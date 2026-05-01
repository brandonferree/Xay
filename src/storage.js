// src/storage.js
// Wraps localStorage for portfolio + user-added ticker persistence.
// All data stays in the user's browser — never sent anywhere.

const PORTFOLIO_KEY = "px:portfolio";
const TICKERS_KEY   = "px:userTickers";
const META_KEY      = "px:portfolioMeta";

export function savePortfolio(accounts, name = "My Portfolio") {
  try {
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(accounts));
    localStorage.setItem(META_KEY, JSON.stringify({
      name, savedAt: new Date().toISOString()
    }));
    return true;
  } catch (e) { console.error("Save failed:", e); return false; }
}

export function loadPortfolio() {
  try {
    const data = localStorage.getItem(PORTFOLIO_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) { return null; }
}

export function getPortfolioMeta() {
  try {
    const meta = localStorage.getItem(META_KEY);
    return meta ? JSON.parse(meta) : null;
  } catch (e) { return null; }
}

export function clearPortfolio() {
  localStorage.removeItem(PORTFOLIO_KEY);
  localStorage.removeItem(META_KEY);
}

export function getUserTickers() {
  try {
    const data = localStorage.getItem(TICKERS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) { return {}; }
}

export function saveUserTicker(ticker, info) {
  const tickers = getUserTickers();
  tickers[ticker.toUpperCase()] = info;
  try {
    localStorage.setItem(TICKERS_KEY, JSON.stringify(tickers));
    return true;
  } catch (e) { return false; }
}

export function deleteUserTicker(ticker) {
  const tickers = getUserTickers();
  delete tickers[ticker.toUpperCase()];
  localStorage.setItem(TICKERS_KEY, JSON.stringify(tickers));
}
