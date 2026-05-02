// src/enrich.js
// Calls the Cloudflare Worker to look up ticker metadata and saves results to localStorage.

import { WORKER_URL, ENRICH_CONCURRENCY } from "./config.js";
import { saveUserTicker } from "./storage.js";

// In-memory cache to avoid re-hitting the Worker for the same ticker within a session.
// (Saved tickers are also persisted via saveUserTicker.)
const sessionCache = new Map();

export function isEnrichmentAvailable() {
  return Boolean(WORKER_URL);
}

/**
 * Look up a single ticker via the Worker.
 * Returns { ticker, found, ...info } or { ticker, found: false, error }.
 * Caches results for the lifetime of the page.
 */
export async function enrichTicker(ticker) {
  const t = ticker.toUpperCase();
  if (sessionCache.has(t)) return sessionCache.get(t);
  if (!WORKER_URL) {
    const result = { ticker: t, found: false, error: "no worker configured" };
    sessionCache.set(t, result);
    return result;
  }

  try {
    const resp = await fetch(`${WORKER_URL}/lookup?ticker=${encodeURIComponent(t)}`);
    if (!resp.ok) {
      const result = { ticker: t, found: false, error: `worker ${resp.status}` };
      sessionCache.set(t, result);
      return result;
    }
    const data = await resp.json();
    sessionCache.set(t, data);

    if (data.found) {
      // Persist to localStorage user-tickers so future uploads don't re-fetch
      saveUserTicker(t, {
        name: data.name,
        sector: data.sector,
        country: data.country,
        type: data.type,
        er: data.er || 0,
        isFund: data.isFund || false,
        fundCategory: data.fundCategory || null,
      });
    }
    return data;
  } catch (err) {
    const result = { ticker: t, found: false, error: err.message };
    sessionCache.set(t, result);
    return result;
  }
}

/**
 * Enrich a list of tickers in parallel batches.
 * Calls onProgress(ticker, result) as each completes — UI uses this to update pills live.
 */
export async function enrichBatch(tickers, onProgress) {
  const queue = [...tickers];
  const workers = [];

  async function runWorker() {
    while (queue.length > 0) {
      const ticker = queue.shift();
      const result = await enrichTicker(ticker);
      if (onProgress) onProgress(ticker, result);
    }
  }

  const concurrency = Math.min(ENRICH_CONCURRENCY, tickers.length);
  for (let i = 0; i < concurrency; i++) workers.push(runWorker());
  await Promise.all(workers);
}
