// src/parser.js
// Multi-broker CSV parser with auto-detected formats.
// Uses Papa Parse (loaded as global from CDN in index.html).

const CASH_TICKERS = ["CASH", "MMDA", "SPAXX", "VMFXX", "FDRXX", "FZDXX"];

export function detectFormat(headers) {
  const h = headers.map(s => (s || "").toString().toLowerCase().trim());
  const has = (...needles) => needles.every(n => h.some(col => col.includes(n)));
  if (has("symbol") && has("quantity") && has("market value")) return "schwab";
  if (has("symbol") && has("quantity") && has("last price"))   return "fidelity";
  if (has("investment name") && has("symbol") && has("shares")) return "vanguard";
  if (has("ticker") && has("shares")) return "generic";
  if (has("symbol") && has("shares")) return "generic";
  if (has("symbol") && has("quantity")) return "generic";
  return "unknown";
}

export function parseNumber(v) {
  if (v == null || v === "") return null;
  const s = v.toString().replace(/[$,\s"]/g, "").replace(/[()]/g, "-");
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

function getField(row, ...keys) {
  for (const k of keys) {
    for (const col of Object.keys(row)) {
      if (col.toLowerCase().trim() === k.toLowerCase()) return row[col];
    }
    for (const col of Object.keys(row)) {
      if (col.toLowerCase().includes(k.toLowerCase())) return row[col];
    }
  }
  return null;
}

export function rowToPosition(row, format) {
  let ticker, shares, price, value, account;

  if (format === "schwab") {
    ticker = getField(row, "Symbol");
    shares = parseNumber(getField(row, "Quantity"));
    price  = parseNumber(getField(row, "Price"));
    value  = parseNumber(getField(row, "Market Value"));
  } else if (format === "fidelity") {
    ticker  = getField(row, "Symbol");
    shares  = parseNumber(getField(row, "Quantity"));
    price   = parseNumber(getField(row, "Last Price"));
    value   = parseNumber(getField(row, "Current Value"));
    account = getField(row, "Account Name") || getField(row, "Account Number");
  } else if (format === "vanguard") {
    ticker  = getField(row, "Symbol");
    shares  = parseNumber(getField(row, "Shares"));
    price   = parseNumber(getField(row, "Share Price"));
    value   = parseNumber(getField(row, "Total Value"));
    account = getField(row, "Account Number");
  } else {
    ticker  = getField(row, "Ticker", "Symbol");
    shares  = parseNumber(getField(row, "Shares", "Quantity"));
    price   = parseNumber(getField(row, "Price"));
    value   = parseNumber(getField(row, "Value", "Market Value", "Current Value"));
    account = getField(row, "Account");
  }

  if (!ticker) return null;
  ticker = ticker.toString().trim().toUpperCase();
  if (!ticker || ticker.length > 10 || /[^A-Z0-9.\-]/.test(ticker)) {
    if (!CASH_TICKERS.includes(ticker)) return null;
  }
  if (!price && value && shares) price = value / shares;
  if (!shares && value && price) shares = value / price;
  if (!shares || !price) return null;

  return { ticker, shares, price, account: account || null };
}

export function parseCSVFile(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true, skipEmptyLines: true, dynamicTyping: false,
      complete: (results) => {
        const headers = results.meta.fields || [];
        const format = detectFormat(headers);
        const positions = [];
        for (const row of results.data) {
          const p = rowToPosition(row, format);
          if (p) positions.push(p);
        }
        resolve({ filename: file.name, format, positions });
      },
      error: reject
    });
  });
}

export function buildAccountsFromUploads(uploads) {
  const accountMap = new Map();
  for (const up of uploads) {
    const fileLabel = up.filename.replace(/\.[^.]+$/, "");
    for (const pos of up.positions) {
      const acctName = pos.account || fileLabel;
      if (!accountMap.has(acctName)) accountMap.set(acctName, []);
      accountMap.get(acctName).push({
        ticker: pos.ticker, shares: pos.shares, price: pos.price
      });
    }
  }
  return Array.from(accountMap.entries()).map(([name, positions]) => ({ name, positions }));
}
