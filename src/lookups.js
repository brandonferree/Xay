// src/lookups.js
// Resolves a ticker to enrichment metadata. Falls through built-in funds → built-in stocks →
// user-added classifications (from localStorage) → unknown placeholder.

import { PROFILES } from "../data/profiles.js";
import { FUNDS }    from "../data/funds.js";
import { STOCKS }   from "../data/stocks.js";
import { getUserTickers } from "./storage.js";

export function lookupSecurity(ticker) {
  const t = ticker.toUpperCase();

  if (FUNDS[t]) {
    const f = FUNDS[t];
    const p = PROFILES[f.profile];
    return {
      ticker: t, name: f.name, type: "Fund", er: f.er,
      sectors: p.sectors, countries: p.countries,
      top_holdings: p.top_holdings, other_label: p.other_label,
      known: true, source: "builtin"
    };
  }

  if (STOCKS[t]) {
    const s = STOCKS[t];
    return {
      ticker: t, name: s.name, type: "Stock", er: 0,
      sectors: { [s.sector]: 1.0 },
      countries: { [s.country || "United States"]: 1.0 },
      top_holdings: null,
      known: true, source: "builtin"
    };
  }

  const userTickers = getUserTickers();
  if (userTickers[t]) {
    const u = userTickers[t];
    return {
      ticker: t, name: u.name || t, type: u.type || "Stock", er: u.er || 0,
      sectors: { [u.sector]: 1.0 },
      countries: { [u.country || "United States"]: 1.0 },
      top_holdings: null,
      known: true, source: "user"
    };
  }

  return {
    ticker: t, name: "Unknown — manual classification needed",
    type: "Unknown", er: 0,
    sectors: {}, countries: {},
    top_holdings: null,
    known: false, source: "none"
  };
}
