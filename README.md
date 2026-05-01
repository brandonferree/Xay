# Portfolio X-Ray

A self-hosted, privacy-first portfolio analyzer. Upload positions exports from your brokers, see your true exposure across every account, and get the same view that tools like Empower's old Personal Capital, Morningstar X-Ray, and Mezzi provide — without sending your holdings to anyone's server.

**Your data never leaves the browser.** No accounts, no tracking, no API keys. Everything runs as static files on GitHub Pages.

## What it does

- **Consolidates holdings** across multiple brokerage CSVs into one view
- **Auto-detects formats** for Schwab, Fidelity, and Vanguard positions exports, plus a generic `account, ticker, shares, price` CSV
- **Looks through funds** to underlying stocks — if you hold VTI + VOO + FXAIX + QQQ, it shows you that you actually own AAPL through 4+ different sources
- **Surfaces hidden overlap** — concentration you can't see at the broker-statement level
- **Breaks down sectors and countries** based on dollar-weighted look-through
- **Totals your fee drag** — weighted expense ratio, annual dollar cost, per-fund breakdown
- **Auto-saves** to browser localStorage so you don't re-upload every time
- **Lets you classify unknown tickers** manually — they get saved alongside the built-in ~100 securities

## Quick start

### Run locally

```bash
git clone <your-fork-url>
cd portfolio-xray
python3 -m http.server 8000
# open http://localhost:8000
```

(Any static file server works. Python's built-in is easiest. The site uses ES modules, which require HTTP — opening `index.html` directly via `file://` won't work.)

### Deploy to GitHub Pages

1. Fork or clone this repo to your own GitHub account
2. Go to **Settings → Pages** in your repo
3. Under "Source," choose "Deploy from a branch"
4. Select branch `main` (or `master`) and folder `/ (root)`
5. Click Save. Wait 1–2 minutes.
6. Your site is live at `https://<your-username>.github.io/<repo-name>/`

That's it. No build step, no CI, no environment variables.

## Project structure

```
portfolio-xray/
├── index.html              Main page (loads everything)
├── styles/main.css         All styling
├── data/
│   ├── profiles.js         Sector/country/holdings profile templates
│   ├── funds.js            ETF + mutual fund metadata (~50 funds)
│   └── stocks.js           Individual stock metadata (~70 stocks)
├── src/
│   ├── app.js              Entry point, event wiring, flow control
│   ├── parser.js           CSV parsing with broker auto-detection
│   ├── lookups.js          Resolves ticker → metadata
│   ├── calculations.js     Look-through, sector/country exposure, fees, overlap
│   ├── render.js           DOM rendering for all dashboard sections
│   └── storage.js          localStorage save/load
└── samples/                Example CSVs in different broker formats
```

## Adding a new ticker to the database

Two ways:

**Option 1 — Through the app (saves to your browser only).** When you upload a CSV with an unknown ticker, click the yellow pill in the warning banner. Fill in the modal. Done.

**Option 2 — Edit the source files (shared with everyone using your fork).**

For a stock, add an entry to `data/stocks.js`:

```js
"NEW":  { name: "Company Name", sector: "Tech" },
// or for a foreign listing:
"FOO":  { name: "Foreign Co", sector: "Healthcare", country: "Germany" },
```

For a fund, add to `data/funds.js`:

```js
"NEWX": { name: "Some Index Fund", er: 0.0015, profile: "US_LARGE_BLEND" },
```

If no existing profile fits the fund's sector/country mix, add a new profile to `data/profiles.js` first. Profiles are templates — they let multiple funds share the same look-through data without duplication.

Valid sectors: `Tech`, `Financials`, `Healthcare`, `Cons. Discretionary`, `Cons. Staples`, `Comm. Services`, `Industrials`, `Energy`, `Materials`, `Utilities`, `Real Estate`, `Bonds`, `Commodities`.

## How it works (briefly)

The dashboard does pure-function math on your positions array. The interesting algorithm is the **look-through aggregation**:

```
for each position:
    if it's a stock:
        add full dollar value to that ticker's exposure
    if it's a fund:
        for each top underlying holding:
            add (dollar_value × underlying_weight) to that ticker's exposure
        any uncovered weight gets bucketed (e.g. "Other US Equities")
```

This produces a `{ ticker → { value, sources } }` map that drives the top-holdings ranking, the overlap detection (anything with 2+ sources), and the sector/country breakdowns (each underlying ticker has its own classification).

## Privacy

- No backend. No analytics. No cookies.
- Your portfolio data is stored in `localStorage` under the keys `px:portfolio`, `px:portfolioMeta`, and `px:userTickers`.
- Clear it any time with the Reset button, or run `localStorage.clear()` in DevTools, or delete the data through your browser's privacy settings.
- The app loads two external resources: Google Fonts and Papa Parse from cdnjs. If you want air-gapped operation, vendor those locally.

## Limitations / honest disclosures

- **Sector/country/look-through data is approximate.** It uses published fund prospectus data at a fixed point in time. Funds rebalance, weights drift. For investment decisions, verify against the fund issuer's current holdings.
- **No live prices.** You enter share counts and prices from your statement. To make this dynamic, point at a market data API (yfinance, Alpha Vantage, Polygon).
- **No cost basis or performance.** Just current allocation and fees. Adding tax-lot tracking is doable — extend the position schema.
- **PDF statement parsing not included.** CSV exports are reliable; PDF parsing is broker-specific and brittle. Easiest path: convert PDFs to CSVs in Excel/Numbers first, or use Tabula.
- **No multi-portfolio or scenarios.** Single saved portfolio per browser. Adding multiple is straightforward — extend `storage.js` with named slots and add a portfolio picker.

## Roadmap ideas

- Multi-portfolio support (compare snapshots over time)
- Live price refresh via free API
- Cost-basis import + unrealized gain/loss tracking
- Tax-lot harvesting suggestions
- Print-to-PDF export of the analysis
- IBKR + Robinhood + ETrade format detection
- Bond fund duration / credit-quality breakdown

## License

MIT — see `LICENSE`. Use it, fork it, sell a hosted version, whatever. No warranty.

## Acknowledgments

- [PapaParse](https://www.papaparse.com/) for CSV parsing
- [Fraunces](https://fonts.google.com/specimen/Fraunces) and [Geist](https://fonts.google.com/specimen/Geist) typefaces
- The general design idea from Morningstar's X-Ray and Empower's portfolio view
