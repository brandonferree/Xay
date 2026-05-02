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
    const isFund = u.isFund === true || u.type === "Fund";

    if (isFund) {
      // User-saved fund: use its inferred fund category to apply a proper profile
      // (sector mix, country mix, top holdings) instead of treating it as a single-sector stock.
      // This fixes: fund-counter incrementing, sector breakdown not bucketing as one sector,
      // and look-through working through the underlying holdings.
      const profileKey = u.fundCategory && PROFILES[u.fundCategory]
        ? u.fundCategory
        : "US_LARGE_BLEND"; // safe default
      const p = PROFILES[profileKey];
      return {
        ticker: t, name: u.name || t, type: "Fund", er: u.er || 0,
        sectors: p.sectors, countries: p.countries,
        top_holdings: p.top_holdings, other_label: p.other_label,
        known: true, source: "user"
      };
    }

    // Stock — single sector, single country
    return {
      ticker: t, name: u.name || t, type: "Stock", er: u.er || 0,
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
