// data/funds.js
// Fund (ETF + mutual fund) metadata.
// Each entry references a profile from profiles.js + provides name + expense ratio.
// To add a new fund, append an entry below with the right profile name.

export const FUNDS = {
  // ====== US Total / S&P 500 / Large-Cap Blend ======
  "VTI":   { name: "Vanguard Total Stock Market ETF",   er: 0.0003,  profile: "US_TOTAL_MARKET" },
  "ITOT":  { name: "iShares Core S&P Total US Stock",   er: 0.0003,  profile: "US_TOTAL_MARKET" },
  "SCHB":  { name: "Schwab US Broad Market ETF",        er: 0.0003,  profile: "US_TOTAL_MARKET" },
  "FZROX": { name: "Fidelity ZERO Total Market Index",  er: 0.0,     profile: "US_TOTAL_MARKET" },
  "FSKAX": { name: "Fidelity Total Market Index",       er: 0.00015, profile: "US_TOTAL_MARKET" },
  "VOO":   { name: "Vanguard S&P 500 ETF",              er: 0.0003,  profile: "US_LARGE_BLEND" },
  "IVV":   { name: "iShares Core S&P 500 ETF",          er: 0.0003,  profile: "US_LARGE_BLEND" },
  "SPY":   { name: "SPDR S&P 500 ETF Trust",            er: 0.00095, profile: "US_LARGE_BLEND" },
  "SPLG":  { name: "SPDR Portfolio S&P 500 ETF",        er: 0.0002,  profile: "US_LARGE_BLEND" },
  "FXAIX": { name: "Fidelity 500 Index Fund",           er: 0.00015, profile: "US_LARGE_BLEND" },
  "FNILX": { name: "Fidelity ZERO Large Cap Index",     er: 0.0,     profile: "US_LARGE_BLEND" },
  "SCHX":  { name: "Schwab US Large-Cap ETF",           er: 0.0003,  profile: "US_LARGE_BLEND" },

  // ====== Nasdaq / Tech sector ======
  "QQQ":   { name: "Invesco QQQ Trust",                  er: 0.0020,  profile: "US_NASDAQ100" },
  "QQQM":  { name: "Invesco NASDAQ 100 ETF",             er: 0.0015,  profile: "US_NASDAQ100" },
  "VGT":   { name: "Vanguard Information Tech ETF",      er: 0.0009,  profile: "TECH_SECTOR" },
  "XLK":   { name: "Tech Select Sector SPDR",            er: 0.0009,  profile: "TECH_SECTOR" },

  // ====== Growth / Value / Dividend ======
  "VUG":   { name: "Vanguard Growth ETF",                er: 0.0004,  profile: "US_LARGE_GROWTH" },
  "SCHG":  { name: "Schwab US Large-Cap Growth",         er: 0.0004,  profile: "US_LARGE_GROWTH" },
  "IWF":   { name: "iShares Russell 1000 Growth",        er: 0.0019,  profile: "US_LARGE_GROWTH" },
  "VTV":   { name: "Vanguard Value ETF",                 er: 0.0004,  profile: "US_LARGE_VALUE" },
  "SCHV":  { name: "Schwab US Large-Cap Value",          er: 0.0004,  profile: "US_LARGE_VALUE" },
  "IWD":   { name: "iShares Russell 1000 Value",         er: 0.0019,  profile: "US_LARGE_VALUE" },
  "VYM":   { name: "Vanguard High Dividend Yield ETF",   er: 0.0006,  profile: "US_LARGE_VALUE" },
  "SCHD":  { name: "Schwab US Dividend Equity ETF",      er: 0.0006,  profile: "US_LARGE_VALUE" },

  // ====== Mid / Small Cap ======
  "VB":    { name: "Vanguard Small-Cap ETF",             er: 0.0005,  profile: "US_SMALL_CAP" },
  "IJR":   { name: "iShares Core S&P Small-Cap",         er: 0.0006,  profile: "US_SMALL_CAP" },
  "IWM":   { name: "iShares Russell 2000 ETF",           er: 0.0019,  profile: "US_SMALL_CAP" },
  "SCHA":  { name: "Schwab US Small-Cap ETF",            er: 0.0004,  profile: "US_SMALL_CAP" },
  "IWO":   { name: "iShares Russell 2000 Growth ETF",    er: 0.0024,  profile: "US_SMALL_GROWTH" },
  "MDY":   { name: "SPDR S&P MidCap 400 ETF Trust",      er: 0.0023,  profile: "US_MID_CAP_BLEND" },
  "IJH":   { name: "iShares Core S&P Mid-Cap ETF",       er: 0.0005,  profile: "US_MID_CAP_BLEND" },
  "VO":    { name: "Vanguard Mid-Cap ETF",               er: 0.0004,  profile: "US_MID_CAP_BLEND" },

  // ====== International (Developed / Total / Emerging) ======
  "VXUS":  { name: "Vanguard Total International Stock", er: 0.0007,  profile: "INTL_TOTAL" },
  "IXUS":  { name: "iShares Core MSCI Total Intl Stock", er: 0.0007,  profile: "INTL_TOTAL" },
  "FTIHX": { name: "Fidelity Total International Index", er: 0.0006,  profile: "INTL_TOTAL" },
  "FZILX": { name: "Fidelity ZERO Intl Index",           er: 0.0,     profile: "INTL_TOTAL" },
  "VEA":   { name: "Vanguard FTSE Developed Markets",    er: 0.0005,  profile: "INTL_DEVELOPED" },
  "EFA":   { name: "iShares MSCI EAFE ETF",              er: 0.0033,  profile: "INTL_DEVELOPED" },
  "IEFA":  { name: "iShares Core MSCI EAFE",             er: 0.0007,  profile: "INTL_DEVELOPED" },
  "SCHF":  { name: "Schwab International Equity ETF",    er: 0.0006,  profile: "INTL_DEVELOPED" },
  "VWO":   { name: "Vanguard FTSE Emerging Markets",     er: 0.0008,  profile: "INTL_EMERGING" },
  "EEM":   { name: "iShares MSCI Emerging Markets",      er: 0.0072,  profile: "INTL_EMERGING" },
  "IEMG":  { name: "iShares Core MSCI EM",               er: 0.0009,  profile: "INTL_EMERGING" },
  "SCHE":  { name: "Schwab Emerging Markets Equity",     er: 0.0011,  profile: "INTL_EMERGING" },
  "AEMZX": { name: "Acadian Emerging Markets Portfolio", er: 0.0116,  profile: "INTL_EMERGING" },
  "BGEGX": { name: "Baillie Gifford Emerging Markets Eqs", er: 0.0087, profile: "INTL_EMERGING" },

  // ====== Bonds ======
  "BND":   { name: "Vanguard Total Bond Market ETF",     er: 0.0003,  profile: "US_BONDS_AGG" },
  "AGG":   { name: "iShares Core US Aggregate Bond",     er: 0.0003,  profile: "US_BONDS_AGG" },
  "FXNAX": { name: "Fidelity US Bond Index Fund",        er: 0.00025, profile: "US_BONDS_AGG" },
  "SCHZ":  { name: "Schwab US Aggregate Bond ETF",       er: 0.0003,  profile: "US_BONDS_AGG" },
  "TLT":   { name: "iShares 20+ Year Treasury Bond",     er: 0.0015,  profile: "US_BONDS_LONG" },
  "BNDX":  { name: "Vanguard Total Intl Bond ETF",       er: 0.0007,  profile: "INTL_BONDS" },

  // ====== REITs / Commodities ======
  "VNQ":   { name: "Vanguard Real Estate ETF",           er: 0.0013,  profile: "REIT_US" },
  "IYR":   { name: "iShares US Real Estate ETF",         er: 0.0039,  profile: "REIT_US" },
  "GLD":   { name: "SPDR Gold Trust",                    er: 0.0040,  profile: "GOLD" },
  "IAU":   { name: "iShares Gold Trust",                 er: 0.0025,  profile: "GOLD" },

  // ====== Money Market / Cash equivalents ======
  "SNOXX": { name: "Schwab Treasury Obligations Money Fund", er: 0.0034, profile: "MONEY_MARKET" },
  "SPAXX": { name: "Fidelity Government Money Market Fund",  er: 0.0042, profile: "MONEY_MARKET" },
  "VMFXX": { name: "Vanguard Federal Money Market Fund",     er: 0.0011, profile: "MONEY_MARKET" },
  "FDRXX": { name: "Fidelity Government Cash Reserves",      er: 0.0038, profile: "MONEY_MARKET" },

  // ====== Active Small/Mid-Cap Funds ======
  "GMAYX": { name: "GMO Small Cap Quality Fund",         er: 0.0075, profile: "US_SMALL_GROWTH" },
  "HRNOX": { name: "Hood River New Opportunities Inst",  er: 0.0095, profile: "US_SMALL_GROWTH" },
};
