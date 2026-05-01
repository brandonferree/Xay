// data/profiles.js
// Profile templates for sector / country / look-through holdings.
// Each profile is shared by similar funds (e.g. all S&P 500 funds use US_LARGE_BLEND).
// Top-holdings weights are approximate values from public fund prospectus data.

export const PROFILES = {
  US_LARGE_BLEND: {
    sectors: { "Tech": 0.32, "Financials": 0.13, "Healthcare": 0.11, "Cons. Discretionary": 0.10, "Comm. Services": 0.09, "Industrials": 0.08, "Cons. Staples": 0.06, "Energy": 0.04, "Utilities": 0.02, "Real Estate": 0.02, "Materials": 0.03 },
    countries: { "United States": 1.00 },
    top_holdings: [
      { ticker: "AAPL",  weight: 0.072 }, { ticker: "MSFT",  weight: 0.065 },
      { ticker: "NVDA",  weight: 0.062 }, { ticker: "AMZN",  weight: 0.038 },
      { ticker: "META",  weight: 0.028 }, { ticker: "GOOGL", weight: 0.021 },
      { ticker: "GOOG",  weight: 0.018 }, { ticker: "BRK.B", weight: 0.017 },
      { ticker: "AVGO",  weight: 0.016 }, { ticker: "TSLA",  weight: 0.014 },
    ],
    other_label: "Other US Equities"
  },
  US_TOTAL_MARKET: {
    sectors: { "Tech": 0.30, "Financials": 0.13, "Healthcare": 0.12, "Cons. Discretionary": 0.10, "Comm. Services": 0.09, "Industrials": 0.08, "Cons. Staples": 0.06, "Energy": 0.04, "Utilities": 0.03, "Real Estate": 0.03, "Materials": 0.02 },
    countries: { "United States": 1.00 },
    top_holdings: [
      { ticker: "AAPL",  weight: 0.065 }, { ticker: "MSFT",  weight: 0.058 },
      { ticker: "NVDA",  weight: 0.055 }, { ticker: "AMZN",  weight: 0.035 },
      { ticker: "META",  weight: 0.025 }, { ticker: "GOOGL", weight: 0.019 },
      { ticker: "GOOG",  weight: 0.016 }, { ticker: "BRK.B", weight: 0.015 },
      { ticker: "AVGO",  weight: 0.014 }, { ticker: "TSLA",  weight: 0.013 },
    ],
    other_label: "Other US Equities"
  },
  US_NASDAQ100: {
    sectors: { "Tech": 0.50, "Comm. Services": 0.17, "Cons. Discretionary": 0.14, "Healthcare": 0.06, "Cons. Staples": 0.06, "Industrials": 0.05, "Utilities": 0.01, "Financials": 0.005, "Materials": 0.005 },
    countries: { "United States": 1.00 },
    top_holdings: [
      { ticker: "AAPL",  weight: 0.090 }, { ticker: "MSFT",  weight: 0.082 },
      { ticker: "NVDA",  weight: 0.080 }, { ticker: "AMZN",  weight: 0.055 },
      { ticker: "META",  weight: 0.045 }, { ticker: "GOOGL", weight: 0.030 },
      { ticker: "GOOG",  weight: 0.028 }, { ticker: "AVGO",  weight: 0.038 },
      { ticker: "TSLA",  weight: 0.030 }, { ticker: "COST",  weight: 0.026 },
    ],
    other_label: "Other Nasdaq-100"
  },
  US_LARGE_GROWTH: {
    sectors: { "Tech": 0.45, "Comm. Services": 0.13, "Cons. Discretionary": 0.18, "Healthcare": 0.07, "Industrials": 0.06, "Financials": 0.05, "Cons. Staples": 0.03, "Energy": 0.01, "Materials": 0.01, "Real Estate": 0.005 },
    countries: { "United States": 1.00 },
    top_holdings: [
      { ticker: "AAPL",  weight: 0.110 }, { ticker: "MSFT",  weight: 0.098 },
      { ticker: "NVDA",  weight: 0.095 }, { ticker: "AMZN",  weight: 0.058 },
      { ticker: "META",  weight: 0.042 }, { ticker: "GOOGL", weight: 0.032 },
      { ticker: "GOOG",  weight: 0.028 }, { ticker: "TSLA",  weight: 0.024 },
    ],
    other_label: "Other Growth"
  },
  US_LARGE_VALUE: {
    sectors: { "Financials": 0.21, "Healthcare": 0.16, "Industrials": 0.13, "Cons. Staples": 0.10, "Energy": 0.08, "Tech": 0.10, "Cons. Discretionary": 0.06, "Utilities": 0.06, "Materials": 0.04, "Real Estate": 0.04, "Comm. Services": 0.02 },
    countries: { "United States": 1.00 },
    top_holdings: [
      { ticker: "BRK.B", weight: 0.030 }, { ticker: "JPM",   weight: 0.028 },
      { ticker: "XOM",   weight: 0.022 }, { ticker: "JNJ",   weight: 0.020 },
      { ticker: "WMT",   weight: 0.018 }, { ticker: "PG",    weight: 0.017 },
      { ticker: "CVX",   weight: 0.015 }, { ticker: "BAC",   weight: 0.014 },
    ],
    other_label: "Other Value"
  },
  US_SMALL_CAP: {
    sectors: { "Industrials": 0.18, "Financials": 0.16, "Healthcare": 0.15, "Tech": 0.13, "Cons. Discretionary": 0.11, "Real Estate": 0.07, "Energy": 0.06, "Materials": 0.05, "Cons. Staples": 0.04, "Utilities": 0.03, "Comm. Services": 0.02 },
    countries: { "United States": 1.00 },
    top_holdings: [],
    other_label: "Small-Cap US Equities"
  },
  US_SMALL_GROWTH: {
    sectors: { "Tech": 0.23, "Healthcare": 0.19, "Industrials": 0.18, "Cons. Discretionary": 0.12, "Financials": 0.08, "Energy": 0.05, "Materials": 0.04, "Real Estate": 0.04, "Cons. Staples": 0.03, "Comm. Services": 0.03, "Utilities": 0.01 },
    countries: { "United States": 1.00 },
    top_holdings: [],
    other_label: "Small-Cap Growth Equities"
  },
  US_MID_CAP_BLEND: {
    sectors: { "Industrials": 0.22, "Financials": 0.17, "Cons. Discretionary": 0.13, "Tech": 0.10, "Materials": 0.08, "Healthcare": 0.08, "Real Estate": 0.07, "Cons. Staples": 0.04, "Energy": 0.04, "Utilities": 0.04, "Comm. Services": 0.03 },
    countries: { "United States": 1.00 },
    top_holdings: [],
    other_label: "Mid-Cap US Equities"
  },
  INTL_DEVELOPED: {
    sectors: { "Financials": 0.22, "Industrials": 0.16, "Healthcare": 0.11, "Cons. Discretionary": 0.10, "Tech": 0.09, "Cons. Staples": 0.09, "Materials": 0.07, "Energy": 0.05, "Comm. Services": 0.04, "Utilities": 0.04, "Real Estate": 0.03 },
    countries: { "Japan": 0.22, "United Kingdom": 0.14, "France": 0.10, "Switzerland": 0.09, "Germany": 0.08, "Canada": 0.08, "Australia": 0.06, "Netherlands": 0.05, "Other Developed": 0.18 },
    top_holdings: [
      { ticker: "NVO",     weight: 0.018 }, { ticker: "ASML",    weight: 0.015 },
      { ticker: "NESN.SW", weight: 0.014 }, { ticker: "SAP",     weight: 0.013 },
      { ticker: "TM",      weight: 0.011 }, { ticker: "SHEL",    weight: 0.010 },
    ],
    other_label: "Other Developed Mkts"
  },
  INTL_TOTAL: {
    sectors: { "Financials": 0.22, "Industrials": 0.13, "Tech": 0.11, "Cons. Discretionary": 0.11, "Healthcare": 0.10, "Cons. Staples": 0.08, "Materials": 0.07, "Energy": 0.06, "Comm. Services": 0.05, "Utilities": 0.04, "Real Estate": 0.03 },
    countries: { "Japan": 0.16, "United Kingdom": 0.10, "China": 0.08, "France": 0.07, "Switzerland": 0.06, "Canada": 0.06, "Germany": 0.05, "India": 0.06, "Taiwan": 0.06, "Australia": 0.04, "Other Developed": 0.16, "Other Emerging": 0.10 },
    top_holdings: [
      { ticker: "TSM",     weight: 0.022 }, { ticker: "NVO",     weight: 0.012 },
      { ticker: "ASML",    weight: 0.010 }, { ticker: "NESN.SW", weight: 0.010 },
      { ticker: "SAP",     weight: 0.009 }, { ticker: "TM",      weight: 0.008 },
    ],
    other_label: "Other International"
  },
  INTL_EMERGING: {
    sectors: { "Tech": 0.22, "Financials": 0.20, "Cons. Discretionary": 0.13, "Comm. Services": 0.10, "Industrials": 0.07, "Materials": 0.07, "Cons. Staples": 0.06, "Energy": 0.05, "Healthcare": 0.04, "Utilities": 0.03, "Real Estate": 0.03 },
    countries: { "China": 0.27, "India": 0.20, "Taiwan": 0.18, "South Korea": 0.10, "Brazil": 0.05, "Saudi Arabia": 0.04, "Other Emerging": 0.16 },
    top_holdings: [
      { ticker: "TSM",   weight: 0.085 }, { ticker: "TCEHY", weight: 0.030 },
      { ticker: "BABA",  weight: 0.025 }, { ticker: "RELIANCE.NS", weight: 0.014 },
    ],
    other_label: "Other Emerging Mkts"
  },
  US_BONDS_AGG: {
    sectors: { "Bonds": 1.0 },
    countries: { "United States": 0.92, "Other": 0.08 },
    top_holdings: [],
    other_label: "US Aggregate Bonds"
  },
  US_BONDS_LONG: {
    sectors: { "Bonds": 1.0 },
    countries: { "United States": 1.00 },
    top_holdings: [],
    other_label: "Long Treasury Bonds"
  },
  INTL_BONDS: {
    sectors: { "Bonds": 1.0 },
    countries: { "Japan": 0.20, "France": 0.10, "Germany": 0.08, "United Kingdom": 0.08, "Italy": 0.07, "Other": 0.47 },
    top_holdings: [],
    other_label: "International Bonds"
  },
  REIT_US: {
    sectors: { "Real Estate": 1.0 },
    countries: { "United States": 1.00 },
    top_holdings: [],
    other_label: "US REITs"
  },
  TECH_SECTOR: {
    sectors: { "Tech": 1.0 },
    countries: { "United States": 1.00 },
    top_holdings: [
      { ticker: "AAPL", weight: 0.21 }, { ticker: "MSFT", weight: 0.19 },
      { ticker: "NVDA", weight: 0.18 }, { ticker: "AVGO", weight: 0.045 },
    ],
    other_label: "Other Tech Stocks"
  },
  GOLD: {
    sectors: { "Commodities": 1.0 },
    countries: { "Global": 1.00 },
    top_holdings: [],
    other_label: "Gold Bullion"
  },
  MONEY_MARKET: {
    sectors: { "Cash": 1.0 },
    countries: { "United States": 1.00 },
    top_holdings: [],
    other_label: "Money Market / Cash"
  },
};
