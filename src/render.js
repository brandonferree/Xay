// src/render.js
// All DOM rendering. Pure-ish: each function takes the accounts array and updates
// a specific DOM element. No event wiring here — that lives in app.js.

import {
  calcPositionValue, getTotalValue, calcLookThrough,
  calcSectorExposure, calcCountryExposure, calcFees,
  findUnknownTickers, isBucketTicker
} from "./calculations.js";
import { lookupSecurity } from "./lookups.js";

const PALETTE = ["--accent-1","--accent-2","--accent-3","--accent-4","--accent-5","--accent-6","--accent-7","--accent-8","--accent-9","--accent-10","--accent-11"];

const fmt$  = v => "$" + (v || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });
const fmt$2 = v => "$" + (v || 0).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const fmtPct  = v => (v * 100).toFixed(2) + "%";
const fmtPct1 = v => (v * 100).toFixed(1) + "%";
const fmtBps  = v => Math.round(v * 10000) + " bps";

export function renderWarnings(accounts, onClassify) {
  const host = document.getElementById("warn-banner-host");
  const unknowns = findUnknownTickers(accounts);
  if (unknowns.length === 0) { host.innerHTML = ""; return; }
  host.innerHTML = `
    <div class="warn-banner">
      <div class="warn-icon">⚠</div>
      <div class="warn-content">
        <strong>${unknowns.length} unrecognized ticker${unknowns.length>1?"s":""}:</strong>
        ${unknowns.map(t => `<button class="ticker-pill" id="pill-${t.replace(/[^A-Z0-9]/g,"_")}" data-ticker="${t}" title="Click to classify manually">${t}</button>`).join(" ")}
        <br>If a Worker is configured, these will auto-enrich. Otherwise click any ticker to classify it manually.
      </div>
    </div>
  `;
  host.querySelectorAll(".ticker-pill").forEach(btn => {
    btn.addEventListener("click", () => onClassify(btn.dataset.ticker));
  });
}

/**
 * Update a single ticker pill's visual state during async enrichment.
 * Called from app.js as enrichment results come back.
 *   status: "pending" | "found" | "failed"
 *   data:   the result object (used for tooltip on found)
 */
export function setEnrichmentStatus(ticker, status, data) {
  const id = `pill-${ticker.replace(/[^A-Z0-9]/g,"_")}`;
  const pill = document.getElementById(id);
  if (!pill) return;
  pill.classList.remove("pending", "found", "failed");
  pill.classList.add(status);
  if (status === "pending") {
    pill.innerHTML = `${ticker} <span class="pill-spinner">…</span>`;
    pill.title = "Looking up…";
  } else if (status === "found" && data) {
    pill.innerHTML = `${ticker} <span class="pill-check">✓</span>`;
    pill.title = `Auto-classified: ${data.name} · ${data.sector} · ${data.country}`;
  } else if (status === "failed") {
    pill.innerHTML = ticker;
    pill.title = "Auto-lookup failed — click to classify manually";
  }
}

export function renderHero(accounts) {
  const total = getTotalValue(accounts);
  const lookthrough = calcLookThrough(accounts);
  const positionCount = accounts.reduce((s, a) => s + a.positions.length, 0);
  const fundCount = accounts.reduce((s, a) =>
    s + a.positions.filter(p => {
      const sec = lookupSecurity(p.ticker);
      return sec.top_holdings && sec.top_holdings.length > 0;
    }).length, 0);
  const uniqueUnderlying = Object.keys(lookthrough).filter(k => !isBucketTicker(k)).length;
  const fees = calcFees(accounts);

  document.getElementById("hero").innerHTML = `
    <div class="hero-cell">
      <div class="hero-label">Total Portfolio</div>
      <div class="hero-value big">${fmt$(total)}</div>
      <div class="hero-sub">${accounts.length} account${accounts.length!==1?"s":""} · ${positionCount} positions</div>
    </div>
    <div class="hero-cell">
      <div class="hero-label">Funds Held</div>
      <div class="hero-value">${fundCount}</div>
      <div class="hero-sub">ETFs + mutual funds</div>
    </div>
    <div class="hero-cell">
      <div class="hero-label">Effective Stocks</div>
      <div class="hero-value">${uniqueUnderlying}+</div>
      <div class="hero-sub">unique tickers via look-through</div>
    </div>
    <div class="hero-cell">
      <div class="hero-label">Annual Fees</div>
      <div class="hero-value">${fmt$(fees.annualTotal)}</div>
      <div class="hero-sub">${fmtBps(fees.portfolioWeightedER)} blended</div>
    </div>
  `;
}

export function renderXrayCallout(accounts) {
  const total = getTotalValue(accounts);
  const lookthrough = calcLookThrough(accounts);
  const stockEntries = Object.entries(lookthrough)
    .filter(([k]) => !isBucketTicker(k))
    .sort((a, b) => b[1].value - a[1].value);
  if (stockEntries.length === 0) {
    document.getElementById("xray-callout").innerHTML = `
      <div class="xray-callout-quote">Portfolio loaded with ${accounts.length} account${accounts.length!==1?"s":""} totaling <em>${fmt$(total)}</em>.</div>`;
    return;
  }
  const topStock = stockEntries[0];
  const topPct = (topStock[1].value / total * 100).toFixed(1);
  const fundCount = accounts.reduce((s, a) =>
    s + a.positions.filter(p => {
      const sec = lookupSecurity(p.ticker);
      return sec.top_holdings && sec.top_holdings.length > 0;
    }).length, 0);
  document.getElementById("xray-callout").innerHTML = `
    <div class="xray-callout-quote">
      You hold <em>${fundCount} fund${fundCount!==1?"s":""}</em> across ${accounts.length} account${accounts.length!==1?"s":""} —
      but underneath, you effectively own positions in
      <em>${stockEntries.length}+ individual companies.</em>
      Your single largest effective holding is
      <em>${topStock[0]}</em> at <em>${topPct}%</em> of total portfolio,
      held through ${lookthrough[topStock[0]].sources.length} different source${lookthrough[topStock[0]].sources.length!==1?"s":""}.
    </div>
    <div class="xray-callout-detail">→ Concentration that's invisible at the broker-statement level.</div>
  `;
}

export function renderAccounts(accounts) {
  document.getElementById("accounts-grid").innerHTML = accounts.map(acct => {
    const total = acct.positions.reduce((s, p) => s + calcPositionValue(p), 0);
    return `
      <div class="account-card">
        <div class="account-head">
          <div class="account-name">${acct.name}</div>
          <div class="account-value">${fmt$(total)}</div>
        </div>
        ${acct.positions.map(p => {
          const sec = lookupSecurity(p.ticker);
          const cls = sec.known ? "" : "unknown";
          return `<div class="holding-row ${cls}">
            <div class="holding-ticker">${p.ticker}</div>
            <div class="holding-name">${sec.name}</div>
            <div class="holding-value">${fmt$(calcPositionValue(p))}</div>
          </div>`;
        }).join("")}
      </div>`;
  }).join("");
}

function renderDonut(svgEl, items, centerLabel) {
  if (items.length === 0) { svgEl.innerHTML = ""; return; }
  let cumulative = 0;
  const cx = 50, cy = 50, r = 38, sw = 14;
  const C = 2 * Math.PI * r;
  let segs = "";
  items.forEach((item, i) => {
    const dash = C * item.pct;
    const offset = -C * cumulative;
    const color = `var(${PALETTE[i % PALETTE.length]})`;
    segs += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
      stroke="${color}" stroke-width="${sw}"
      stroke-dasharray="${dash} ${C}" stroke-dashoffset="${offset}"
      transform="rotate(-90 ${cx} ${cy})"/>`;
    cumulative += item.pct;
  });
  svgEl.innerHTML = `${segs}
    <text class="donut-center-label" x="${cx}" y="${cy - 3}" text-anchor="middle">${centerLabel}</text>
    <text class="donut-center-value" x="${cx}" y="${cy + 8}" text-anchor="middle">${items.length}</text>`;
}

function renderBars(elId, items) {
  document.getElementById(elId).innerHTML = items.map((item, i) => {
    const color = `var(${PALETTE[i % PALETTE.length]})`;
    return `<div class="bar-item">
      <div class="bar-label">${item.name}</div>
      <div class="bar-track"><div class="bar-fill" style="width: ${(item.pct * 100).toFixed(1)}%; background: ${color};"></div></div>
      <div class="bar-pct">${fmtPct1(item.pct)}</div>
    </div>`;
  }).join("");
}

export function renderSectors(accounts) {
  const items = calcSectorExposure(accounts);
  renderDonut(document.getElementById("sector-donut"), items, "SECTORS");
  renderBars("sector-bars", items);
}

export function renderCountries(accounts) {
  const items = calcCountryExposure(accounts);
  renderDonut(document.getElementById("country-donut"), items, "COUNTRIES");
  renderBars("country-bars", items);
}

export function renderOverlap(accounts) {
  const total = getTotalValue(accounts);
  const lookthrough = calcLookThrough(accounts);
  const overlaps = Object.entries(lookthrough)
    .filter(([k]) => !isBucketTicker(k))
    .map(([k, v]) => {
      const sources = new Set(v.sources.map(s => s.source));
      return { ticker: k, value: v.value, pct: v.value / total, sources: v.sources, sourceCount: sources.size };
    })
    .filter(x => x.sourceCount >= 2)
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
  const host = document.getElementById("overlap-host");
  if (overlaps.length === 0) {
    host.innerHTML = `<div class="empty-state">No multi-source overlap detected. Either your funds have non-overlapping holdings, or you hold mostly direct stocks.</div>`;
    return;
  }
  host.innerHTML = `<div class="overlap-grid">${overlaps.map(o => {
    const isFlagged = o.pct > 0.02;
    const sec = lookupSecurity(o.ticker);
    const sourceRows = {};
    o.sources.forEach(s => {
      const acctShort = s.account.split(/[\s_-]/)[0];
      const key = `${s.source}|${acctShort}`;
      sourceRows[key] = (sourceRows[key] || 0) + s.value;
    });
    return `
      <div class="overlap-card ${isFlagged ? "flag" : ""}">
        <div class="overlap-ticker">
          <div class="overlap-ticker-name">${o.ticker}<span class="full-name">${sec.name || ""}</span></div>
          <div class="overlap-total">${fmt$(o.value)} · ${fmtPct1(o.pct)}</div>
        </div>
        <div class="overlap-sources">
          ${Object.entries(sourceRows).map(([k, val]) => {
            const [source, acct] = k.split("|");
            const label = source === "direct" ? "Direct holding" : "via " + source;
            return `<div class="overlap-source-row"><span>${label} <span style="color:var(--ink-muted)">· ${acct}</span></span><span>${fmt$(val)}</span></div>`;
          }).join("")}
        </div>
      </div>`;
  }).join("")}</div>`;
}

export function renderTopHoldings(accounts) {
  const total = getTotalValue(accounts);
  const lookthrough = calcLookThrough(accounts);
  const all = Object.entries(lookthrough)
    .filter(([k]) => !isBucketTicker(k))   // exclude "Other US Equities" etc. — show real names only
    .map(([k, v]) => ({ ticker: k, value: v.value, pct: v.value / total }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 15);
  document.getElementById("top-holdings-list").innerHTML = all.map((h, i) => {
    const sec = lookupSecurity(h.ticker);
    return `<div class="top-holdings">
      <div class="rank">${String(i + 1).padStart(2, "0")}</div>
      <div class="top-ticker">${h.ticker}</div>
      <div class="top-name">${sec.name || h.ticker}</div>
      <div class="top-value">${fmt$(h.value)}</div>
      <div class="top-pct">${fmtPct1(h.pct)}<div class="mini-bar" style="width: ${Math.min(100, h.pct * 100 * 6)}%"></div></div>
    </div>`;
  }).join("");
}

export function renderFees(accounts) {
  const f = calcFees(accounts);
  const host = document.getElementById("fees-host");
  if (f.rows.length === 0) {
    host.innerHTML = `<div class="empty-state">No fund holdings detected — portfolio appears to be 100% direct stocks.</div>`;
    return;
  }
  host.innerHTML = `
    <table class="fees-table">
      <thead><tr>
        <th>Fund</th><th>Name</th>
        <th class="num">Position</th><th class="num">Expense Ratio</th><th class="num">Annual Fee</th>
      </tr></thead>
      <tbody>${f.rows.map(r => `<tr>
        <td class="fund-ticker">${r.ticker}</td>
        <td>${r.name}</td>
        <td class="num">${fmt$(r.value)}</td>
        <td class="num">${fmtPct(r.er)}</td>
        <td class="num" style="color:var(--gold);font-weight:500">${fmt$2(r.annual)}</td>
      </tr>`).join("")}</tbody>
    </table>
    <div class="fees-summary">
      <div class="fee-stat">
        <div class="fee-stat-label">Weighted Avg ER</div>
        <div class="fee-stat-value">${fmtPct(f.weightedER)}</div>
        <div class="fee-stat-sub">across funds only · ${fmtBps(f.weightedER)}</div>
      </div>
      <div class="fee-stat">
        <div class="fee-stat-label">Portfolio-Weighted ER</div>
        <div class="fee-stat-value">${fmtPct(f.portfolioWeightedER)}</div>
        <div class="fee-stat-sub">includes direct stocks · ${fmtBps(f.portfolioWeightedER)}</div>
      </div>
      <div class="fee-stat">
        <div class="fee-stat-label">Total Annual Fee</div>
        <div class="fee-stat-value">${fmt$(f.annualTotal)}</div>
        <div class="fee-stat-sub">${fmt$(f.annualTotal * 10)} over 10 years (no compounding)</div>
      </div>
    </div>`;
}

export function renderAll(accounts, onClassify) {
  renderWarnings(accounts, onClassify);
  renderHero(accounts);
  renderXrayCallout(accounts);
  renderAccounts(accounts);
  renderSectors(accounts);
  renderCountries(accounts);
  renderOverlap(accounts);
  renderTopHoldings(accounts);
  renderFees(accounts);
}
