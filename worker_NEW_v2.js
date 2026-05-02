// worker/worker.js
//
// Cloudflare Worker that proxies Financial Modeling Prep API calls for ticker enrichment.
// Deployed at: https://<your-worker-name>.<your-subdomain>.workers.dev
//
// Endpoints:
//   GET /lookup?ticker=AAPL    →  full enrichment (name, sector, country, ER, type)
//   GET /health                →  basic health check
//
// Required environment secret:
//   FMP_API_KEY  →  free tier key from https://site.financialmodelingprep.com/
//
// Optional environment variable (binding):
//   ALLOWED_ORIGIN  →  e.g. https://yourname.github.io  (default: "*" for any origin)

const FMP_BASE = "https://financialmodelingprep.com/stable";

// FMP uses Yahoo-style sector names. Map them to the labels used in our app.
const SECTOR_MAP = {
  "Technology":             "Tech",
  "Financial Services":     "Financials",
  "Financials":             "Financials",
  "Healthcare":             "Healthcare",
  "Consumer Cyclical":      "Cons. Discretionary",
  "Consumer Defensive":     "Cons. Staples",
  "Communication Services": "Comm. Services",
  "Industrials":            "Industrials",
  "Energy":                 "Energy",
  "Basic Materials":        "Materials",
  "Materials":              "Materials",
  "Utilities":              "Utilities",
  "Real Estate":            "Real Estate",
};

// FMP returns ISO country codes. Map to display names matching our country profiles.
const COUNTRY_MAP = {
  "US": "United States",  "GB": "United Kingdom", "JP": "Japan",
  "CN": "China",          "DE": "Germany",        "FR": "France",
  "CH": "Switzerland",    "CA": "Canada",         "AU": "Australia",
  "IN": "India",          "TW": "Taiwan",         "KR": "South Korea",
  "NL": "Netherlands",    "BR": "Brazil",         "DK": "Denmark",
  "IT": "Italy",          "ES": "Spain",          "SE": "Sweden",
  "HK": "Hong Kong",      "SG": "Singapore",      "MX": "Mexico",
  "ZA": "South Africa",   "SA": "Saudi Arabia",
};

export default {
  async fetch(request, env) {
    const allowedOrigin = env.ALLOWED_ORIGIN || "*";

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(allowedOrigin) });
    }

    const url = new URL(request.url);

    // Health check
    if (url.pathname === "/health") {
      return jsonResponse({
        ok: true,
        hasFmpKey: !!env.FMP_API_KEY,
        hasClaudeKey: !!env.ANTHROPIC_API_KEY,
      }, allowedOrigin);
    }

    // Main lookup
    if (url.pathname === "/lookup") {
      const ticker = url.searchParams.get("ticker");
      if (!ticker) return jsonError("ticker query param required", 400, allowedOrigin);
      if (!env.FMP_API_KEY) return jsonError("FMP_API_KEY not configured", 500, allowedOrigin);

      try {
        const result = await lookupTicker(ticker, env);
        return jsonResponse(result, allowedOrigin);
      } catch (err) {
        return jsonError(err.message || "lookup failed", 500, allowedOrigin);
      }
    }

    return jsonError("not found", 404, allowedOrigin);
  }
};

// ============================================================
// Lookup logic
// ============================================================
async function lookupTicker(rawTicker, env) {
  const apiKey = env.FMP_API_KEY;
  const ticker = rawTicker.trim().toUpperCase();

  // Step 1: profile endpoint (works for stocks AND ETFs)
  const profile = await fmpFetch(`/profile?symbol=${encodeURIComponent(ticker)}`, apiKey);
  if (!Array.isArray(profile) || profile.length === 0) {
    return { ticker, found: false, reason: "no profile match" };
  }

  const p = profile[0];
  const isEtf  = p.isEtf === true;
  const isFund = p.isFund === true || isEtf;

  let result = {
    ticker,
    found: true,
    name: p.companyName || ticker,
    type: isFund ? "Fund" : "Stock",
    sector: SECTOR_MAP[p.sector] || p.sector || "Unclassified",
    country: COUNTRY_MAP[p.country] || p.country || "United States",
    er: 0,
    isFund,  // explicit flag for the frontend
    source: "fmp",
  };

  // Step 2: if it's a fund, try to fetch the expense ratio.
  // /etf-info works for ETFs; /funds/info or /funds/profile for mutual funds.
  // We try both and keep whichever succeeds.
  if (isFund) {
    // For ETFs, infer a default category to help the frontend pick a profile
    result.fundCategory = inferFundCategory(p);

    // Try ETF endpoint first
    try {
      const info = await fmpFetch(`/etf-info?symbol=${encodeURIComponent(ticker)}`, apiKey);
      if (Array.isArray(info) && info.length > 0) {
        const expense = parseFloat(info[0].expenseRatio);
        if (!isNaN(expense) && expense > 0) {
          result.er = expense > 1 ? expense / 100 : expense;
        }
      }
    } catch (e) { /* fall through */ }

    // If still no ER, try mutual-fund-specific endpoints
    if (result.er === 0) {
      for (const path of [`/funds/info?symbol=${encodeURIComponent(ticker)}`,
                          `/mutual-fund-info?symbol=${encodeURIComponent(ticker)}`]) {
        try {
          const info = await fmpFetch(path, apiKey);
          if (Array.isArray(info) && info.length > 0) {
            const expense = parseFloat(info[0].expenseRatio || info[0].netExpenseRatio);
            if (!isNaN(expense) && expense > 0) {
              result.er = expense > 1 ? expense / 100 : expense;
              break;
            }
          }
        } catch (e) { /* try next */ }
      }
    }

    // Last resort: ask Claude. Costs ~$0.005 per call with Haiku.
    // Only fires if FMP returned no expense ratio AND ANTHROPIC_API_KEY is configured.
    if (result.er === 0 && env.ANTHROPIC_API_KEY) {
      try {
        const claudeEr = await fetchExpenseRatioFromClaude(ticker, result.name, env.ANTHROPIC_API_KEY);
        if (claudeEr !== null) {
          result.er = claudeEr;
          result.erSource = "claude";
        }
      } catch (e) { /* not fatal — fund without ER is still useful */ }
    }
  }

  return result;
}

// Ask Claude for an expense ratio. Returns a decimal (e.g. 0.0039) or null if unknown/uncertain.
async function fetchExpenseRatioFromClaude(ticker, name, apiKey) {
  const prompt = `What is the current expense ratio for the mutual fund or ETF with ticker "${ticker}"${name ? ` ("${name}")` : ""}?

Respond with ONLY a JSON object, no other text. Format:
{"er": 0.0039, "confidence": "high"}

Where:
- "er" is the expense ratio as a decimal (0.0039 means 0.39%, 0.001 means 0.10%). If unknown, use null.
- "confidence" is "high", "medium", or "low".

If you don't know the fund or aren't reasonably confident, return {"er": null, "confidence": "low"}.`;

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 100,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!resp.ok) throw new Error(`Anthropic ${resp.status}`);
  const data = await resp.json();
  const text = data?.content?.[0]?.text || "";

  // Strip code fences if Claude added any, then parse
  const clean = text.replace(/```json|```/g, "").trim();
  const match = clean.match(/\{[^}]+\}/);
  if (!match) return null;

  try {
    const parsed = JSON.parse(match[0]);
    if (parsed.er === null || parsed.er === undefined) return null;
    if (parsed.confidence === "low") return null; // don't trust low-confidence answers
    const er = parseFloat(parsed.er);
    if (isNaN(er) || er < 0 || er > 0.05) return null; // sanity check: ER between 0 and 5%
    return er;
  } catch (e) {
    return null;
  }
}

// Heuristic: given an FMP profile object for a fund, guess the broad category
// so the frontend can pick a reasonable look-through profile.
function inferFundCategory(p) {
  const name = (p.companyName || "").toLowerCase();
  const desc = (p.description || "").toLowerCase();
  const text = name + " " + desc;

  if (/\bbond\b|\btreasury\b|\bfixed.?income\b/.test(text)) return "BONDS";
  if (/\bmoney.?market\b|\btreasury obligations\b/.test(text)) return "MONEY_MARKET";
  if (/\bemerging\b/.test(text)) return "INTL_EMERGING";
  if (/\binternational\b|\bforeign\b|\bglobal\b|\bworld\b|\bex.?us\b/.test(text)) return "INTL_DEVELOPED";
  if (/\bsmall.?cap\b/.test(text)) return "US_SMALL_CAP";
  if (/\bmid.?cap\b/.test(text)) return "US_MID_CAP_BLEND";
  if (/\bgrowth\b/.test(text)) return "US_LARGE_GROWTH";
  if (/\bvalue\b|\bdividend\b/.test(text)) return "US_LARGE_VALUE";
  if (/\bnasdaq\b|\bqqq\b/.test(text)) return "US_NASDAQ100";
  if (/\btotal.?(stock|market)\b/.test(text)) return "US_TOTAL_MARKET";
  if (/\b500\b|\bs.?&.?p\b/.test(text)) return "US_LARGE_BLEND";
  if (/\bhealth/.test(text)) return "TECH_SECTOR"; // sector-specific funds get TECH_SECTOR template
  if (/\btech|\bsoftware/.test(text)) return "TECH_SECTOR";
  if (/\breal.?estate|\breit\b/.test(text)) return "REIT_US";
  if (/\bgold\b/.test(text)) return "GOLD";
  return "US_LARGE_BLEND"; // safe default for any large-cap US fund

async function fmpFetch(path, apiKey) {
  const sep = path.includes("?") ? "&" : "?";
  const url = `${FMP_BASE}${path}${sep}apikey=${apiKey}`;
  const resp = await fetch(url, { cf: { cacheTtl: 86400, cacheEverything: true } });
  if (!resp.ok) throw new Error(`FMP ${resp.status}`);
  return await resp.json();
}

// ============================================================
// HTTP helpers
// ============================================================
function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin":  origin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age":       "86400",
  };
}

function jsonResponse(data, origin) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

function jsonError(msg, status, origin) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}
