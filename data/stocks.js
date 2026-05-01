// data/stocks.js
// Individual stock metadata. Country defaults to "United States" if omitted.
// Sectors use GICS-style classification.

export const STOCKS = {
  // ====== Mega-cap Tech / Communications ======
  "AAPL":  { name: "Apple Inc.",            sector: "Tech" },
  "MSFT":  { name: "Microsoft Corp.",       sector: "Tech" },
  "NVDA":  { name: "NVIDIA Corp.",          sector: "Tech" },
  "AMZN":  { name: "Amazon.com Inc.",       sector: "Cons. Discretionary" },
  "GOOGL": { name: "Alphabet Inc. (A)",     sector: "Comm. Services" },
  "GOOG":  { name: "Alphabet Inc. (C)",     sector: "Comm. Services" },
  "META":  { name: "Meta Platforms Inc.",   sector: "Comm. Services" },
  "TSLA":  { name: "Tesla Inc.",            sector: "Cons. Discretionary" },
  "BRK.B": { name: "Berkshire Hathaway B",  sector: "Financials" },
  "AVGO":  { name: "Broadcom Inc.",         sector: "Tech" },

  // ====== Tech ======
  "ADBE":  { name: "Adobe Inc.",            sector: "Tech" },
  "CRM":   { name: "Salesforce Inc.",       sector: "Tech" },
  "ORCL":  { name: "Oracle Corp.",          sector: "Tech" },
  "INTC":  { name: "Intel Corp.",           sector: "Tech" },
  "AMD":   { name: "Advanced Micro Devices",sector: "Tech" },
  "QCOM":  { name: "QUALCOMM Inc.",         sector: "Tech" },
  "CSCO":  { name: "Cisco Systems",         sector: "Tech" },
  "NOW":   { name: "ServiceNow Inc.",       sector: "Tech" },

  // ====== Financials ======
  "JPM":   { name: "JPMorgan Chase",        sector: "Financials" },
  "BAC":   { name: "Bank of America",       sector: "Financials" },
  "WFC":   { name: "Wells Fargo & Co.",     sector: "Financials" },
  "USB":   { name: "U.S. Bancorp",          sector: "Financials" },
  "V":     { name: "Visa Inc.",             sector: "Financials" },
  "MA":    { name: "Mastercard Inc.",       sector: "Financials" },
  "BLK":   { name: "BlackRock Inc.",        sector: "Financials" },
  "SCHW":  { name: "Charles Schwab Corp.",  sector: "Financials" },
  "GS":    { name: "Goldman Sachs Group",   sector: "Financials" },
  "ALL":   { name: "Allstate Corp.",        sector: "Financials" },
  "CB":    { name: "Chubb Limited",         sector: "Financials" },
  "TRU":   { name: "TransUnion",            sector: "Industrials" },

  // ====== Healthcare ======
  "JNJ":   { name: "Johnson & Johnson",     sector: "Healthcare" },
  "UNH":   { name: "UnitedHealth Group",    sector: "Healthcare" },
  "ABBV":  { name: "AbbVie Inc.",           sector: "Healthcare" },
  "ABT":   { name: "Abbott Laboratories",   sector: "Healthcare" },
  "BMY":   { name: "Bristol-Myers Squibb",  sector: "Healthcare" },
  "LLY":   { name: "Eli Lilly & Co.",       sector: "Healthcare" },
  "MRK":   { name: "Merck & Co.",           sector: "Healthcare" },
  "PFE":   { name: "Pfizer Inc.",           sector: "Healthcare" },
  "BRKR":  { name: "Bruker Corp.",          sector: "Healthcare" },
  "TFX":   { name: "Teleflex Inc.",         sector: "Healthcare" },

  // ====== Consumer Staples ======
  "PG":    { name: "Procter & Gamble",      sector: "Cons. Staples" },
  "WMT":   { name: "Walmart Inc.",          sector: "Cons. Staples" },
  "PEP":   { name: "PepsiCo Inc.",          sector: "Cons. Staples" },
  "KO":    { name: "Coca-Cola Co.",         sector: "Cons. Staples" },
  "COST":  { name: "Costco Wholesale",      sector: "Cons. Staples" },
  "LW":    { name: "Lamb Weston Holdings",  sector: "Cons. Staples" },
  "SYY":   { name: "Sysco Corp.",           sector: "Cons. Staples" },

  // ====== Consumer Discretionary ======
  "HD":    { name: "Home Depot Inc.",       sector: "Cons. Discretionary" },
  "MCD":   { name: "McDonald's Corp.",      sector: "Cons. Discretionary" },
  "NKE":   { name: "Nike Inc.",             sector: "Cons. Discretionary" },
  "AZO":   { name: "AutoZone Inc.",         sector: "Cons. Discretionary" },

  // ====== Communication Services ======
  "DIS":   { name: "Walt Disney Co.",       sector: "Comm. Services" },
  "NFLX":  { name: "Netflix Inc.",          sector: "Comm. Services" },
  "T":     { name: "AT&T Inc.",             sector: "Comm. Services" },
  "VZ":    { name: "Verizon Communications",sector: "Comm. Services" },

  // ====== Industrials ======
  "BA":    { name: "Boeing Co.",            sector: "Industrials" },
  "CAT":   { name: "Caterpillar Inc.",      sector: "Industrials" },
  "GE":    { name: "General Electric",      sector: "Industrials" },
  "UPS":   { name: "United Parcel Service", sector: "Industrials" },
  "HON":   { name: "Honeywell International",sector: "Industrials" },
  "LMT":   { name: "Lockheed Martin",       sector: "Industrials" },
  "RTX":   { name: "RTX Corp.",             sector: "Industrials" },
  "MMM":   { name: "3M Company",            sector: "Industrials" },
  "EMR":   { name: "Emerson Electric Co.",  sector: "Industrials" },
  "UNP":   { name: "Union Pacific Corp.",   sector: "Industrials" },
  "ETN":   { name: "Eaton Corp. plc",       sector: "Industrials",  country: "Ireland" },
  "TKR":   { name: "Timken Co.",            sector: "Industrials" },
  "WM":    { name: "Waste Management Inc.", sector: "Industrials" },

  // ====== Energy ======
  "XOM":   { name: "Exxon Mobil Corp.",     sector: "Energy" },
  "CVX":   { name: "Chevron Corp.",         sector: "Energy" },
  "BKR":   { name: "Baker Hughes Co.",      sector: "Energy" },
  "KMI":   { name: "Kinder Morgan Inc.",    sector: "Energy" },

  // ====== Materials ======
  "APD":   { name: "Air Products & Chemicals", sector: "Materials" },
  "NEM":   { name: "Newmont Corp.",            sector: "Materials" },
  "MEOH":  { name: "Methanex Corp.",           sector: "Materials",  country: "Canada" },

  // ====== Utilities ======
  "FE":    { name: "FirstEnergy Corp.",        sector: "Utilities" },
  "SO":    { name: "Southern Co.",             sector: "Utilities" },
  "BEPC":  { name: "Brookfield Renewable Corp.", sector: "Utilities", country: "Canada" },

  // ====== Real Estate (REITs trading as stocks) ======
  "CCI":   { name: "Crown Castle Inc.",     sector: "Real Estate" },
  "LINE":  { name: "Lineage Inc.",          sector: "Real Estate" },

  // ====== Cash placeholder (some brokers report CASH as a row) ======
  "CASH":  { name: "Cash",                  sector: "Cash" },

  // ====== Foreign listings / ADRs ======
  "DEO":         { name: "Diageo plc",            sector: "Cons. Staples",        country: "United Kingdom" },
  "SNY":         { name: "Sanofi",                sector: "Healthcare",           country: "France" },
  "TSM":         { name: "Taiwan Semiconductor",  sector: "Tech",                 country: "Taiwan" },
  "NVO":         { name: "Novo Nordisk",          sector: "Healthcare",           country: "Denmark" },
  "ASML":        { name: "ASML Holding",          sector: "Tech",                 country: "Netherlands" },
  "NESN.SW":     { name: "Nestlé SA",             sector: "Cons. Staples",        country: "Switzerland" },
  "SAP":         { name: "SAP SE",                sector: "Tech",                 country: "Germany" },
  "TM":          { name: "Toyota Motor",          sector: "Cons. Discretionary",  country: "Japan" },
  "SHEL":        { name: "Shell plc",             sector: "Energy",               country: "United Kingdom" },
  "TCEHY":       { name: "Tencent Holdings",      sector: "Comm. Services",       country: "China" },
  "BABA":        { name: "Alibaba Group",         sector: "Cons. Discretionary",  country: "China" },
  "RELIANCE.NS": { name: "Reliance Industries",   sector: "Energy",               country: "India" },
};
