// src/app.js
// Main entry point. Wires up upload flow, dashboard, ticker classification,
// and Worker-based auto-enrichment.

import { parseCSVFile, buildAccountsFromUploads } from "./parser.js";
import { renderAll, setEnrichmentStatus } from "./render.js";
import {
  savePortfolio, loadPortfolio, getPortfolioMeta, clearPortfolio,
  saveUserTicker
} from "./storage.js";
import { findUnknownTickers } from "./calculations.js";
import { isEnrichmentAvailable, enrichBatch } from "./enrich.js";

// ============================================================
// SAMPLE PORTFOLIO (for demo button)
// ============================================================
const SAMPLE_ACCOUNTS = [
  { name: "Schwab Brokerage", positions: [
    { ticker: "VTI",   shares: 350,  price: 305.20 },
    { ticker: "VXUS",  shares: 800,  price: 68.10 },
    { ticker: "AAPL",  shares: 50,   price: 245.40 },
    { ticker: "NVDA",  shares: 65,   price: 172.80 },
  ]},
  { name: "Fidelity 401(k)", positions: [
    { ticker: "FXAIX", shares: 1200, price: 215.30 },
    { ticker: "FTIHX", shares: 2000, price: 14.55 },
    { ticker: "QQQ",   shares: 35,   price: 665.40 },
  ]},
  { name: "Vanguard IRA", positions: [
    { ticker: "VOO",   shares: 110,  price: 580.90 },
    { ticker: "VEA",   shares: 350,  price: 58.20 },
    { ticker: "BND",   shares: 145,  price: 73.10 },
    { ticker: "MSFT",  shares: 8,    price: 510.50 },
  ]},
];

let ACCOUNTS = [];

// ============================================================
// AUTO-ENRICHMENT
// ============================================================
async function runAutoEnrichment() {
  if (!isEnrichmentAvailable()) return;
  const unknowns = findUnknownTickers(ACCOUNTS);
  if (unknowns.length === 0) return;

  // Mark all as pending in the warning banner immediately
  unknowns.forEach(t => setEnrichmentStatus(t, "pending"));

  await enrichBatch(unknowns, (ticker, result) => {
    if (result.found) {
      setEnrichmentStatus(ticker, "found", result);
    } else {
      setEnrichmentStatus(ticker, "failed", result);
    }
  });

  // After enrichment completes, full re-render so the dashboard reflects new classifications
  renderAll(ACCOUNTS, openClassifyModal);
}

// ============================================================
// FLOW / MODE
// ============================================================
function showDashboard() {
  document.getElementById("upload-screen").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("reset-btn").style.display = "inline-block";
  const meta = getPortfolioMeta();
  if (meta) {
    document.getElementById("header-date").textContent =
      `Saved ${new Date(meta.savedAt).toLocaleString()}`;
  }
  renderAll(ACCOUNTS, openClassifyModal);
  window.scrollTo(0, 0);
  // Fire enrichment in the background (non-blocking)
  runAutoEnrichment();
}

function showUpload() {
  document.getElementById("upload-screen").style.display = "flex";
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("reset-btn").style.display = "none";
  document.getElementById("header-date").textContent = "Upload positions to begin";
  ACCOUNTS = [];
}

function loadFromStorage() {
  const stored = loadPortfolio();
  if (stored && stored.length > 0) {
    ACCOUNTS = stored;
    showDashboard();
    return true;
  }
  return false;
}

// ============================================================
// CLASSIFY MODAL
// ============================================================
function openClassifyModal(ticker) {
  const modal = document.getElementById("classify-modal");
  document.getElementById("classify-ticker").value = ticker;
  document.getElementById("classify-name").value = "";
  document.getElementById("classify-sector").value = "Tech";
  document.getElementById("classify-country").value = "United States";
  document.getElementById("classify-type").value = "Stock";
  document.getElementById("classify-er").value = "0";
  modal.classList.add("show");
}

function closeClassifyModal() {
  document.getElementById("classify-modal").classList.remove("show");
}

function submitClassify() {
  const ticker = document.getElementById("classify-ticker").value;
  const info = {
    name: document.getElementById("classify-name").value || ticker,
    sector: document.getElementById("classify-sector").value,
    country: document.getElementById("classify-country").value,
    type: document.getElementById("classify-type").value,
    er: parseFloat(document.getElementById("classify-er").value) / 100 || 0,
  };
  saveUserTicker(ticker, info);
  closeClassifyModal();
  renderAll(ACCOUNTS, openClassifyModal);
}

// ============================================================
// FILE HANDLING
// ============================================================
async function handleFiles(fileList) {
  if (!fileList || fileList.length === 0) return;
  try {
    const uploads = [];
    for (const f of fileList) uploads.push(await parseCSVFile(f));
    const totalPositions = uploads.reduce((s, u) => s + u.positions.length, 0);
    if (totalPositions === 0) {
      alert("No positions detected. Check that your CSV has Symbol/Ticker and Shares/Quantity columns.");
      return;
    }
    ACCOUNTS = buildAccountsFromUploads(uploads);
    savePortfolio(ACCOUNTS, "My Portfolio");
    showDashboard();
  } catch (err) {
    alert("Error parsing file: " + err.message);
    console.error(err);
  }
}

// ============================================================
// EVENT WIRING
// ============================================================
function init() {
  const dropZone = document.getElementById("drop-zone");
  const fileInput = document.getElementById("file-input");

  dropZone.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", e => handleFiles(e.target.files));

  ["dragenter", "dragover"].forEach(ev =>
    dropZone.addEventListener(ev, e => { e.preventDefault(); dropZone.classList.add("dragover"); }));
  ["dragleave", "drop"].forEach(ev =>
    dropZone.addEventListener(ev, e => { e.preventDefault(); dropZone.classList.remove("dragover"); }));
  dropZone.addEventListener("drop", e => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  });

  document.getElementById("demo-btn").addEventListener("click", () => {
    ACCOUNTS = JSON.parse(JSON.stringify(SAMPLE_ACCOUNTS));
    savePortfolio(ACCOUNTS, "Sample Portfolio");
    showDashboard();
  });

  document.getElementById("reset-btn").addEventListener("click", () => {
    if (confirm("Clear current portfolio? Your saved data and custom tickers will be removed.")) {
      clearPortfolio();
      showUpload();
    }
  });

  document.getElementById("sample-csv-btn").addEventListener("click", () => {
    const csv = `Account,Ticker,Shares,Price
Schwab Brokerage,VTI,350,305.20
Schwab Brokerage,VXUS,800,68.10
Schwab Brokerage,AAPL,50,245.40
Schwab Brokerage,NVDA,65,172.80
Fidelity 401k,FXAIX,1200,215.30
Fidelity 401k,FTIHX,2000,14.55
Fidelity 401k,QQQ,35,665.40
Vanguard IRA,VOO,110,580.90
Vanguard IRA,VEA,350,58.20
Vanguard IRA,BND,145,73.10
Vanguard IRA,MSFT,8,510.50
`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "sample_portfolio.csv";
    a.click(); URL.revokeObjectURL(url);
  });

  // classify modal wiring
  document.getElementById("classify-cancel").addEventListener("click", closeClassifyModal);
  document.getElementById("classify-submit").addEventListener("click", submitClassify);
  document.getElementById("classify-modal").addEventListener("click", e => {
    if (e.target.id === "classify-modal") closeClassifyModal();
  });

  // try to auto-load saved portfolio
  if (!loadFromStorage()) {
    showUpload();
  }
}

document.addEventListener("DOMContentLoaded", init);
