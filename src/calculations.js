// src/calculations.js
// Pure functions for portfolio analysis.
// All take an `accounts` array of { name, positions: [{ ticker, shares, price }] }.

import { lookupSecurity } from "./lookups.js";

export const calcPositionValue = p => p.shares * p.price;

export function getTotalValue(accounts) {
  return accounts.reduce((s, a) =>
    s + a.positions.reduce((s2, p) => s2 + calcPositionValue(p), 0), 0);
}

export function calcLookThrough(accounts) {
  const exposure = {};
  function add(ticker, val, account, source) {
    if (!exposure[ticker]) exposure[ticker] = { value: 0, sources: [] };
    exposure[ticker].value += val;
    exposure[ticker].sources.push({ account, source, value: val });
  }
  for (const acct of accounts) {
    for (const pos of acct.positions) {
      const sec = lookupSecurity(pos.ticker);
      const val = calcPositionValue(pos);
      if (sec.top_holdings === null) {
        add(pos.ticker, val, acct.name, "direct");
      } else if (sec.top_holdings.length === 0) {
        add(sec.other_label, val, acct.name, pos.ticker);
      } else {
        let covered = 0;
        for (const h of sec.top_holdings) {
          add(h.ticker, val * h.weight, acct.name, pos.ticker);
          covered += h.weight;
        }
        if (covered < 1) add(sec.other_label, val * (1 - covered), acct.name, pos.ticker);
      }
    }
  }
  return exposure;
}

export function calcSectorExposure(accounts) {
  const total = getTotalValue(accounts);
  const sectors = {};
  let unclassified = 0;
  for (const acct of accounts) {
    for (const pos of acct.positions) {
      const sec = lookupSecurity(pos.ticker);
      const val = calcPositionValue(pos);
      const sum = Object.values(sec.sectors).reduce((a, b) => a + b, 0);
      if (sum === 0) { unclassified += val; continue; }
      for (const [s, w] of Object.entries(sec.sectors)) {
        sectors[s] = (sectors[s] || 0) + val * w;
      }
    }
  }
  if (unclassified > 0) sectors["Unclassified"] = unclassified;
  return Object.entries(sectors)
    .map(([k, v]) => ({ name: k, value: v, pct: v / total }))
    .sort((a, b) => b.value - a.value);
}

export function calcCountryExposure(accounts) {
  const total = getTotalValue(accounts);
  const countries = {};
  let unclassified = 0;
  for (const acct of accounts) {
    for (const pos of acct.positions) {
      const sec = lookupSecurity(pos.ticker);
      const val = calcPositionValue(pos);
      const sum = Object.values(sec.countries).reduce((a, b) => a + b, 0);
      if (sum === 0) { unclassified += val; continue; }
      for (const [c, w] of Object.entries(sec.countries)) {
        countries[c] = (countries[c] || 0) + val * w;
      }
    }
  }
  if (unclassified > 0) countries["Unclassified"] = unclassified;
  return Object.entries(countries)
    .map(([k, v]) => ({ name: k, value: v, pct: v / total }))
    .sort((a, b) => b.value - a.value);
}

export function calcFees(accounts) {
  let weighted = 0, fundValue = 0, totalAnnual = 0;
  const rows = [];
  for (const acct of accounts) {
    for (const pos of acct.positions) {
      const sec = lookupSecurity(pos.ticker);
      const val = calcPositionValue(pos);
      if (sec.er > 0) {
        const annual = val * sec.er;
        rows.push({ ticker: pos.ticker, name: sec.name, value: val, er: sec.er, annual, account: acct.name });
        weighted += val * sec.er;
        fundValue += val;
        totalAnnual += annual;
      }
    }
  }
  rows.sort((a, b) => b.annual - a.annual);
  const total = getTotalValue(accounts) || 1;
  return {
    rows,
    weightedER: fundValue > 0 ? weighted / fundValue : 0,
    annualTotal: totalAnnual,
    fundsValue: fundValue,
    portfolioWeightedER: totalAnnual / total
  };
}

export function findUnknownTickers(accounts) {
  const unknowns = new Set();
  for (const acct of accounts) {
    for (const pos of acct.positions) {
      const sec = lookupSecurity(pos.ticker);
      if (!sec.known) unknowns.add(pos.ticker);
    }
  }
  return Array.from(unknowns);
}

// Tickers we want to filter OUT of "real stock" lists (these are bucket placeholders)
const BUCKET_PATTERNS = ["Other", "Bonds", "REITs", "Bullion", "Small-Cap", "Mid-Cap", "Aggregate"];

export function isBucketTicker(ticker) {
  return BUCKET_PATTERNS.some(p => ticker.includes(p));
}
