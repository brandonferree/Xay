// src/config.js
//
// Worker URL is set to your deployed Cloudflare Worker.
// To disable auto-enrichment, set WORKER_URL to "".

export const WORKER_URL = "https://portfolio-xray-enrich.brandon-ferree.workers.dev";

// Whether to automatically look up unknown tickers when a portfolio is uploaded.
export const ENABLE_AUTO_ENRICH = true;

// How many lookups to run in parallel.
export const ENRICH_CONCURRENCY = 4;
