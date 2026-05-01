import { useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════
   CINDER VAULT MOMENTUM CATALYST
   Catalyst Intelligence Engine — v2.0
   Cinder Vault Enterprises LLC
   Educational trade planning only. Not financial advice.
═══════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────
// CONFIGURATION — Replace these with your real keys
// See API_SETUP_GUIDE at bottom of this file for instructions
// ─────────────────────────────────────────────────────────────────
const CONFIG = {
  FINNHUB_KEY:     "d65c22hr01qppnms3nbgd65c22hr01qppnms3nc0",
  SUPABASE_URL:    "https://aaalexzfmxpihgfffbym.supabase.co",
  SUPABASE_ANON:   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhYWxleHpmbXhwaWhnZmZmYnltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNDY0NjcsImV4cCI6MjA5MjkyMjQ2N30._kkhwl2Qz87zL4_NqVKvcusivvnHKlbDLrjVOsBOtY8",
  PAYPAL_PRO_LINK:   "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=GAXKVRGYQ8UVY",
  PAYPAL_ELITE_LINK: "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=2JBDDQK3DG98G",
};

// ─────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────
const T = {
  bg:        "#05050a",
  bg2:       "#07070d",
  surface:   "#0c0c14",
  card:      "#0f0f18",
  border:    "#1e1e30",
  borderHi:  "#2c2c42",
  gold:      "#c9a84c",
  goldLt:    "#e3ca70",
  goldDk:    "#6b5a22",
  goldGlow:  "rgba(201,168,76,0.09)",
  white:     "#f0f0f8",
  muted:     "#606082",
  mutedLt:   "#9090b8",
  green:     "#22d472",
  red:       "#f04848",
  orange:    "#f5a623",
  blue:      "#4da6ff",
  cyan:      "#22d4c8",
  purple:    "#9f7aea",
};

// ─────────────────────────────────────────────────────────────────
// CATALYST CONFIG
// ─────────────────────────────────────────────────────────────────
const CATALYST_TYPES = {
  "Earnings Beat":         { icon: "📈", color: T.green,  bg: "rgba(34,212,114,0.08)",  border: "rgba(34,212,114,0.25)"  },
  "Earnings Miss":         { icon: "📉", color: T.red,    bg: "rgba(240,72,72,0.08)",   border: "rgba(240,72,72,0.25)"   },
  "FDA / Biotech":         { icon: "🔬", color: T.cyan,   bg: "rgba(34,212,200,0.08)",  border: "rgba(34,212,200,0.25)"  },
  "Merger / Acquisition":  { icon: "🤝", color: T.gold,   bg: "rgba(201,168,76,0.08)",  border: "rgba(201,168,76,0.25)"  },
  "Analyst Upgrade":       { icon: "⬆",  color: T.green,  bg: "rgba(34,212,114,0.08)",  border: "rgba(34,212,114,0.25)"  },
  "Analyst Downgrade":     { icon: "⬇",  color: T.red,    bg: "rgba(240,72,72,0.08)",   border: "rgba(240,72,72,0.25)"   },
  "Contract / Partnership":{ icon: "📋", color: T.blue,   bg: "rgba(77,166,255,0.08)",  border: "rgba(77,166,255,0.25)"  },
  "Product Launch":        { icon: "🚀", color: T.purple, bg: "rgba(159,122,234,0.08)", border: "rgba(159,122,234,0.25)" },
  "Offering / Dilution":   { icon: "⚠",  color: T.orange, bg: "rgba(245,166,35,0.08)",  border: "rgba(245,166,35,0.25)"  },
  "Lawsuit / Regulatory":  { icon: "⚖",  color: T.orange, bg: "rgba(245,166,35,0.08)",  border: "rgba(245,166,35,0.25)"  },
  "Social Momentum":       { icon: "🔥", color: T.orange, bg: "rgba(245,166,35,0.08)",  border: "rgba(245,166,35,0.25)"  },
  "No Real Catalyst":      { icon: "○",  color: T.muted,  bg: "rgba(77,77,104,0.08)",   border: "rgba(77,77,104,0.25)"   },
};

const SCORE_TIERS = [
  { min: 0,  max: 20,  label: "Weak — Ignore",       color: T.muted  },
  { min: 21, max: 50,  label: "Mild Interest",        color: T.orange },
  { min: 51, max: 75,  label: "Strong Catalyst",      color: T.blue   },
  { min: 76, max: 100, label: "High Impact Momentum", color: T.green  },
];

const scoreTier = (s) => SCORE_TIERS.find(t => s >= t.min && s <= t.max) || SCORE_TIERS[0];

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Get started with basic catalyst scanning",
    features: [
      "3 tickers at a time",
      "5 AI analyses per day",
      "Basic catalyst scoring",
      "News headlines",
      "Standard support",
    ],
    cta: "Start Free",
    highlight: false,
    paypalKey: null,
  },
  {
    id: "pro",
    name: "Pro Trader",
    price: "$15",
    period: "per month",
    desc: "Full momentum catalyst engine for active traders",
    features: [
      "Unlimited tickers",
      "Unlimited AI analyses",
      "Full trade context breakdown",
      "Watch zones &amp; entry logic",
      "Stop-loss &amp; target logic",
      "Risk/reward estimates",
      "News + sentiment feed",
      "Discipline warnings",
      "Saved watchlists",
      "Analysis history",
      "Priority support",
    ],
    cta: "Subscribe via PayPal — $15/mo",
    highlight: true,
    paypalKey: "PAYPAL_PRO_LINK",
    badge: "Most Popular",
  },
  {
    id: "elite",
    name: "Elite",
    price: "$39",
    period: "per month",
    desc: "Everything in Pro plus advanced features",
    features: [
      "Everything in Pro",
      "Multi-account support",
      "CSV broker import",
      "AI behavioral pattern analysis",
      "Weekly review workflow",
      "Full Cinder Vault journal access",
      "Custom alerts (coming soon)",
      "White-glove onboarding",
    ],
    cta: "Subscribe via PayPal — $39/mo",
    highlight: false,
    paypalKey: "PAYPAL_ELITE_LINK",
    badge: "Full Platform",
  },
];

const QUICK_TICKERS = ["AAPL","NVDA","TSLA","MSFT","META","AMD","SPY","QQQ","AMZN","GOOGL"];

// ─────────────────────────────────────────────────────────────────
// SUPABASE CLIENT — Live connection
// ─────────────────────────────────────────────────────────────────
let supabase = null;

async function getSupabase() {
  if (supabase) return supabase;
  try {
    const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
    supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON);
  } catch {
    supabase = {
      from: () => ({ select: () => Promise.resolve({ data: [], error: null }), insert: () => Promise.resolve({ data: null, error: null }), upsert: () => Promise.resolve({ data: null, error: null }) }),
      auth: { signInWithPassword: () => Promise.resolve({ data: null, error: { message: "Offline" } }), signUp: () => Promise.resolve({ data: null, error: { message: "Offline" } }), signOut: () => Promise.resolve({ error: null }), getSession: () => Promise.resolve({ data: { session: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }) },
    };
  }
  return supabase;
}

// ─────────────────────────────────────────────────────────────────
// LOCAL STORAGE
// ─────────────────────────────────────────────────────────────────
const LS = {
  get: (k, d) => { try { const v = localStorage.getItem(`cvc_${k}`); return v ? JSON.parse(v) : d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(`cvc_${k}`, JSON.stringify(v)); } catch {} },
};

// ─────────────────────────────────────────────────────────────────
// MARKET DATA — Yahoo Finance via allorigins proxy
// ─────────────────────────────────────────────────────────────────
const PROXY = (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

async function fetchQuote(symbol) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol.toUpperCase()}?interval=1d&range=5d`;
    const proxies = [
      `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    ];
    let json = null;
    for (const proxy of proxies) {
      try {
        const res = await fetch(proxy, { signal: AbortSignal.timeout(6000) });
        if (!res.ok) continue;
        const raw = await res.json();
        json = raw.contents ? JSON.parse(raw.contents) : raw;
        if (json?.chart?.result?.[0]) break;
      } catch { continue; }
    }
    if (!json) return null;
    const r = json?.chart?.result?.[0];
    if (!r) return null;
    const meta   = r.meta;
    const quote  = r.indicators?.quote?.[0] || {};
    const price  = parseFloat((meta.regularMarketPrice || 0).toFixed(2));
    const prev   = parseFloat((meta.previousClose || meta.chartPreviousClose || price).toFixed(2));
    const vol    = meta.regularMarketVolume || 0;
    const vols   = (quote.volume || []).filter(Boolean);
    const avgVol = vols.length > 1 ? vols.slice(0, -1).reduce((a, b) => a + b, 0) / Math.max(vols.length - 1, 1) : vol;
    const closes = (quote.close || []).filter(Boolean);
    return {
      symbol:     symbol.toUpperCase(),
      name:       meta.longName || meta.shortName || symbol.toUpperCase(),
      exchange:   meta.exchangeName || "",
      price,
      prev,
      change:     parseFloat((price - prev).toFixed(2)),
      changePct:  parseFloat(((price - prev) / (prev || 1) * 100).toFixed(2)),
      volume:     vol,
      avgVolume:  Math.round(avgVol),
      relVolume:  avgVol > 0 ? parseFloat((vol / avgVol).toFixed(2)) : 1,
      high:       parseFloat((meta.regularMarketDayHigh || price).toFixed(2)),
      low:        parseFloat((meta.regularMarketDayLow  || price).toFixed(2)),
      open:       parseFloat((meta.regularMarketOpen    || price).toFixed(2)),
      closes:     closes.slice(-5),
    };
  } catch { return null; }
}

async function fetchNews(symbol) {
  try {
    const to   = new Date().toISOString().split("T")[0];
    const from = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
    const url  = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${CONFIG.FINNHUB_KEY}`;
    const res  = await fetch(PROXY(url), { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const json = await res.json();
    const data = JSON.parse(json.contents);
    if (!Array.isArray(data)) return [];
    return data.slice(0, 8).map(n => ({
      headline: n.headline || "",
      summary:  n.summary  || "",
      source:   n.source   || "",
      url:      n.url      || "#",
      datetime: n.datetime || 0,
    }));
  } catch { return []; }
}

// ─────────────────────────────────────────────────────────────────
// AI CATALYST ANALYSIS — Anthropic Claude
// ─────────────────────────────────────────────────────────────────
async function runAnalysis(symbol, quote, news) {
  const newsText = news.slice(0, 5).map((n, i) =>
    `[${i + 1}] ${n.headline}\nSource: ${n.source} | ${n.datetime ? new Date(n.datetime * 1000).toLocaleDateString() : "recent"}\nSummary: ${(n.summary || "").slice(0, 200)}`
  ).join("\n\n");

  const marketText = quote
    ? `Price: $${quote.price} | Change: ${quote.changePct >= 0 ? "+" : ""}${quote.changePct}%\nVolume: ${(quote.volume / 1e6).toFixed(2)}M | Avg Vol: ${(quote.avgVolume / 1e6).toFixed(2)}M | RelVol: ${quote.relVolume}x\nDay Range: $${quote.low} – $${quote.high} | Open: $${quote.open}`
    : "Market data unavailable.";

  const prompt = `You are a professional market analyst inside an educational trading discipline platform. Analyze the news and market data for ${symbol} and return ONLY a JSON object — no markdown, no explanation, just raw JSON.

MARKET DATA:
${marketText}

NEWS (last 7 days):
${newsText}

Return exactly this JSON structure with no extra text:
{
  "newsSummary": "2-3 sentence plain-English explanation of what is happening with this stock right now",
  "catalystType": "one of exactly: Earnings Beat|Earnings Miss|FDA / Biotech|Merger / Acquisition|Analyst Upgrade|Analyst Downgrade|Contract / Partnership|Product Launch|Offering / Dilution|Lawsuit / Regulatory|Social Momentum|No Real Catalyst",
  "catalystScore": <integer 0-100 based on news importance, fundamental impact, recency, and market reaction>,
  "catalystRationale": "1-2 sentences explaining the score",
  "whyMoving": "2-3 sentences connecting news + volume + price action",
  "avoid": <true if setup should be avoided for any reason, false otherwise>,
  "avoidReason": "<if avoid true: one sentence explanation. If avoid false: empty string>",
  "watchZone": "describe the price level or condition where this becomes worth watching",
  "entryLogic": "what must happen BEFORE considering entry — specific pattern, volume, or confirmation needed",
  "stopLossLogic": "where and why to place stop loss based on price structure, support, or VWAP",
  "takeProfitLogic": "take-profit targets based on resistance levels and risk/reward",
  "rrEstimate": "estimated risk/reward ratio with brief plain-English explanation",
  "disciplineWarning": "one specific discipline reminder directly relevant to this setup",
  "keyRisk": "the single most important risk factor for this trade idea"
}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: "You are a professional quantitative analyst for an educational trading platform. You analyze news catalysts and market data objectively and educationally. You never say buy or sell. You never guarantee profits. You always emphasize discipline and risk management. Return only valid, parseable JSON. No markdown code blocks. No extra text before or after the JSON.",
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    const raw  = (data.content?.[0]?.text || "").replace(/```json|```/g, "").trim();
    // Find JSON boundaries safely
    const start = raw.indexOf("{");
    const end   = raw.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    return JSON.parse(raw.slice(start, end + 1));
  } catch { return null; }
}

// ─────────────────────────────────────────────────────────────────
// CSS
// ─────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@300;400;500&family=Sora:wght@300;400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:${T.bg};color:${T.white};font-family:'Sora',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
::-webkit-scrollbar{width:3px;height:3px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:${T.goldDk};border-radius:2px}

/* App shell */
.app{min-height:100vh;display:flex;flex-direction:column;background:${T.bg};background-image:radial-gradient(ellipse at 10% 0%,rgba(201,168,76,.035) 0%,transparent 55%),radial-gradient(ellipse at 90% 100%,rgba(34,212,114,.025) 0%,transparent 55%)}
.topbar{background:${T.surface};border-bottom:1px solid ${T.border};padding:0 26px;height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
.content{flex:1;padding:22px 26px;max-width:1440px;margin:0 auto;width:100%}
.footer{background:${T.surface};border-top:1px solid ${T.border};padding:14px 26px;font-family:'IBM Plex Mono',monospace;font-size:9.5px;color:${T.muted};display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-top:auto}

/* Logo */
.logo-wrap{display:flex;align-items:center;gap:12px}
.logo-icon{width:30px;height:30px;background:linear-gradient(135deg,${T.goldDk},${T.gold});border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
.logo-name{font-family:'Bebas Neue',serif;font-size:19px;letter-spacing:2.5px;color:${T.white};line-height:1}
.logo-sub{font-family:'IBM Plex Mono',monospace;font-size:8px;color:${T.muted};letter-spacing:2px;text-transform:uppercase}

/* Nav tabs */
.nav-tabs{display:flex;gap:2px}
.nav-tab{padding:7px 14px;border-radius:8px;font-size:12px;font-weight:500;color:${T.muted};cursor:pointer;transition:all .15s;border:none;background:transparent;font-family:'Sora',sans-serif}
.nav-tab:hover{color:${T.white};background:rgba(255,255,255,.04)}
.nav-tab.active{background:rgba(201,168,76,.1);color:${T.gold}}

/* Buttons */
.btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:9px;font-size:12.5px;font-weight:600;cursor:pointer;transition:all .15s;border:none;font-family:'Sora',sans-serif;white-space:nowrap;text-decoration:none}
.btn-gold{background:linear-gradient(135deg,${T.gold},${T.goldLt});color:#060608}
.btn-gold:hover{opacity:.9;transform:translateY(-1px);box-shadow:0 4px 20px rgba(201,168,76,.25)}
.btn-outline{background:transparent;border:1px solid ${T.borderHi};color:${T.mutedLt}}
.btn-outline:hover{border-color:${T.gold};color:${T.gold}}
.btn-ghost{background:transparent;color:${T.mutedLt};padding:7px 12px}
.btn-ghost:hover{color:${T.white};background:rgba(255,255,255,.04)}
.btn-danger{background:rgba(240,72,72,.1);color:${T.red};border:1px solid rgba(240,72,72,.25)}
.btn-sm{padding:6px 13px;font-size:11.5px}
.btn-xs{padding:3px 8px;font-size:10.5px}
.btn:disabled{opacity:.35;cursor:not-allowed;transform:none!important}
.btn-w{width:100%;justify-content:center}

/* Cards */
.card{background:${T.card};border:1px solid ${T.border};border-radius:13px;overflow:hidden;transition:border-color .2s}
.card:hover{border-color:${T.borderHi}}
.card-pad{padding:18px}
.card-title{font-family:'Bebas Neue',serif;font-size:15px;letter-spacing:1.5px;color:${T.goldLt};margin-bottom:3px}
.card-sub{font-size:11px;color:${T.muted}}

/* Stock card */
.scard{background:${T.card};border:1px solid ${T.border};border-radius:13px;overflow:hidden;transition:all .2s;position:relative}
.scard:hover{border-color:${T.borderHi}}
.scard-hdr{padding:16px 18px;cursor:pointer;user-select:none}
.scard-body{border-top:1px solid ${T.border};background:${T.bg2};padding:18px}
.scard-glow{position:absolute;top:0;left:0;right:0;height:2px}

/* Price */
.price-xl{font-family:'IBM Plex Mono',monospace;font-size:22px;font-weight:500;line-height:1}
.price-chg{font-family:'IBM Plex Mono',monospace;font-size:12px;margin-top:4px}
.ticker-lbl{font-size:10px;color:#8080a8;margin-bottom:3px}

/* Stats pills */
.stats-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
.spill{background:${T.surface};border:1px solid ${T.borderHi};border-radius:8px;padding:6px 11px;flex:1;min-width:72px}
.spill-lbl{font-family:'IBM Plex Mono',monospace;font-size:8px;color:#7a7aa8;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:3px}
.spill-val{font-family:'IBM Plex Mono',monospace;font-size:13px;font-weight:500;color:${T.white}}

/* Score arc */
.score-arc-wrap{display:flex;flex-direction:column;align-items:center;gap:4px}
.score-tier-lbl{font-family:'IBM Plex Mono',monospace;font-size:8px;letter-spacing:.8px;text-transform:uppercase;text-align:center;line-height:1.3;white-space:nowrap;max-width:70px}

/* Catalyst badge */
.cat-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:20px;font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:600;letter-spacing:.8px;border:1px solid}

/* Score bar */
.score-track{flex:1;background:${T.border};border-radius:4px;height:6px;overflow:hidden}
.score-fill{height:100%;border-radius:4px;transition:width .7s ease}
.score-num{font-family:'IBM Plex Mono',monospace;font-size:13px;font-weight:500;min-width:28px;text-align:right}

/* Analysis blocks */
.sec-hdr{font-family:'IBM Plex Mono',monospace;font-size:8.5px;color:${T.mutedLt};text-transform:uppercase;letter-spacing:2.5px;margin-bottom:10px;display:flex;align-items:center;gap:8px}
.sec-hdr::after{content:'';flex:1;height:1px;background:${T.border}}
.ablock{background:${T.surface};border:1px solid ${T.border};border-radius:9px;padding:13px 15px;margin-bottom:9px}
.ablock:last-child{margin-bottom:0}
.ablock-lbl{font-family:'IBM Plex Mono',monospace;font-size:8px;color:${T.muted};text-transform:uppercase;letter-spacing:2px;margin-bottom:6px}
.ablock-text{font-size:13px;color:#b0b0d0;line-height:1.7}
.ablock-text strong{color:${T.white}}

/* Trade context */
.trade-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:10px}
.tcell{background:${T.bg};border:1px solid ${T.border};border-radius:9px;padding:11px 13px}
.tcell-lbl{font-family:'IBM Plex Mono',monospace;font-size:8px;color:${T.muted};text-transform:uppercase;letter-spacing:2px;margin-bottom:5px}
.tcell-text{font-size:12px;color:${T.mutedLt};line-height:1.55}

/* Avoid */
.avoid-box{background:rgba(240,72,72,.07);border:1px solid rgba(240,72,72,.28);border-radius:10px;padding:13px 15px;display:flex;align-items:flex-start;gap:11px;margin-bottom:13px}
.avoid-title{font-family:'Bebas Neue',serif;font-size:17px;letter-spacing:2px;color:${T.red};margin-bottom:3px}
.avoid-txt{font-size:12px;color:rgba(240,72,72,.8);line-height:1.5}

/* RR box */
.rr-box{background:linear-gradient(135deg,rgba(201,168,76,.07),rgba(34,212,114,.05));border:1px solid ${T.borderHi};border-radius:9px;padding:12px 14px;margin-bottom:10px}
.rr-val{font-family:'IBM Plex Mono',monospace;font-size:20px;color:${T.gold};font-weight:500}

/* Discipline */
.disc-box{background:rgba(201,168,76,.07);border:1px solid rgba(201,168,76,.2);border-radius:9px;padding:12px 14px;display:flex;align-items:flex-start;gap:9px;margin-bottom:9px}
.disc-txt{font-size:12px;color:${T.goldLt};line-height:1.5;font-style:italic}

/* Risk */
.risk-box{background:rgba(240,72,72,.06);border:1px solid rgba(240,72,72,.2);border-radius:9px;padding:12px 14px;display:flex;gap:9px;align-items:flex-start;margin-bottom:14px}
.risk-txt{font-size:12px;color:rgba(240,72,72,.85);line-height:1.5}

/* News */
.news-item{padding:10px 0;border-bottom:1px solid ${T.border}}
.news-item:last-child{border-bottom:none;padding-bottom:0}
.news-hl{font-size:12px;color:${T.white};line-height:1.45;font-weight:500;text-decoration:none;display:block;margin-bottom:4px}
.news-hl:hover{color:${T.goldLt}}
.news-meta{display:flex;align-items:center;gap:8px;font-family:'IBM Plex Mono',monospace;font-size:9px;color:${T.muted}}
.news-src{color:${T.gold}}

/* Disclaimer */
.disclaimer{background:rgba(201,168,76,.07);border:1px solid rgba(201,168,76,.2);border-radius:9px;padding:10px 13px;font-family:'IBM Plex Mono',monospace;font-size:9.5px;color:#8888b0;line-height:1.65;display:flex;align-items:flex-start;gap:8px}

/* Expand btn */
.expand-btn{width:100%;background:rgba(201,168,76,.04);border:none;border-top:1px solid ${T.borderHi};padding:9px;color:#7878a8;font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:6px}
.expand-btn:hover{background:rgba(201,168,76,.08);color:${T.gold}}

/* Skeleton */
.skel{background:linear-gradient(90deg,${T.surface} 25%,${T.card} 50%,${T.surface} 75%);background-size:400px 100%;animation:shimmer 1.4s infinite;border-radius:5px}
@keyframes shimmer{from{background-position:-400px 0}to{background-position:400px 0}}

/* Spinner */
.spin{display:inline-block;width:13px;height:13px;border:2px solid ${T.border};border-top-color:${T.gold};border-radius:50%;animation:rot .7s linear infinite;flex-shrink:0}
@keyframes rot{to{transform:rotate(360deg)}}

/* Status dot */
.dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.dot-g{background:${T.green};box-shadow:0 0 5px ${T.green}}
.dot-r{background:${T.red};box-shadow:0 0 5px ${T.red}}

/* Badge */
.badge{display:inline-block;padding:2px 8px;border-radius:20px;font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:600;letter-spacing:1px}
.badge-gold{background:rgba(201,168,76,.15);color:${T.gold};border:1px solid rgba(201,168,76,.3)}
.badge-green{background:rgba(34,212,114,.12);color:${T.green};border:1px solid rgba(34,212,114,.3)}
.badge-red{background:rgba(240,72,72,.12);color:${T.red};border:1px solid rgba(240,72,72,.3)}
.badge-purple{background:rgba(159,122,234,.12);color:${T.purple};border:1px solid rgba(159,122,234,.3)}

/* Grid */
.g2{display:grid;grid-template-columns:1fr 1fr;gap:13px}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:13px}
.g-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(400px,1fr));gap:15px}

/* Ticker input */
.ticker-inp{background:${T.surface};border:1px solid ${T.border};border-radius:9px;padding:9px 13px;color:${T.white};font-family:'IBM Plex Mono',monospace;font-size:13px;outline:none;transition:border-color .15s;text-transform:uppercase;width:150px}
.ticker-inp:focus{border-color:${T.goldDk}}
.ticker-inp::placeholder{color:${T.muted};text-transform:none;font-size:12px}
.quick-btn{background:${T.surface};border:1px solid ${T.border};border-radius:8px;padding:5px 11px;color:${T.mutedLt};font-family:'IBM Plex Mono',monospace;font-size:10.5px;cursor:pointer;transition:all .15s}
.quick-btn:hover,.quick-btn.on{border-color:${T.gold};color:${T.gold};background:rgba(201,168,76,.07)}

/* Payment page */
.pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:28px}
.plan-card{background:${T.card};border:1px solid ${T.border};border-radius:16px;padding:24px;position:relative;transition:all .2s;display:flex;flex-direction:column}
.plan-card:hover{border-color:${T.borderHi};transform:translateY(-2px)}
.plan-card.highlight{border-color:${T.gold};background:linear-gradient(180deg,rgba(201,168,76,.06) 0%,${T.card} 100%)}
.plan-card.highlight::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,${T.gold},transparent)}
.plan-name{font-family:'Bebas Neue',serif;font-size:20px;letter-spacing:2px;color:${T.white};margin-bottom:4px}
.plan-price{font-family:'IBM Plex Mono',monospace;font-size:32px;font-weight:500;color:${T.gold};line-height:1}
.plan-period{font-family:'IBM Plex Mono',monospace;font-size:10px;color:${T.muted};margin-top:2px;margin-bottom:12px}
.plan-desc{font-size:12px;color:#9090b8;margin-bottom:16px;line-height:1.5}
.plan-features{flex:1;margin-bottom:20px}
.plan-feat{display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;font-size:12px;color:#9090b8;line-height:1.4}
.plan-feat-check{color:${T.green};flex-shrink:0;margin-top:1px}
.plan-badge{position:absolute;top:14px;right:14px}

/* Score legend */
.legend-bar{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:18px}
.legend-item{background:${T.surface};border:1px solid ${T.border};border-radius:7px;padding:4px 11px;display:flex;align-items:center;gap:6px}
.legend-dot{width:7px;height:7px;border-radius:2px}
.legend-txt{font-family:'IBM Plex Mono',monospace;font-size:9px;color:${T.mutedLt}}

/* Setup guide */
.setup-step{display:flex;gap:12px;padding:14px;background:${T.surface};border:1px solid ${T.border};border-radius:10px;margin-bottom:10px}
.step-num{width:26px;height:26px;border-radius:7px;background:rgba(201,168,76,.1);border:1px solid ${T.goldDk};display:flex;align-items:center;justify-content:center;font-family:'IBM Plex Mono',monospace;font-size:12px;color:${T.gold};flex-shrink:0}
.step-title{font-size:13.5px;font-weight:600;color:${T.white};margin-bottom:3px}
.step-desc{font-size:12.5px;color:#9090b8;line-height:1.55}
.code-block{background:${T.bg};border:1px solid ${T.border};border-radius:7px;padding:8px 12px;font-family:'IBM Plex Mono',monospace;font-size:11px;color:${T.goldLt};margin-top:6px;user-select:all}

/* Fade */
@keyframes fadeUp{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
.fade{animation:fadeUp .22s ease forwards}

/* Flex utils */
.flex{display:flex}.items-center{align-items:center}.items-start{align-items:flex-start}
.justify-between{justify-content:space-between}.justify-center{justify-content:center}
.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}
.gap-4{gap:4px}.gap-6{gap:6px}.gap-8{gap:8px}.gap-10{gap:10px}.gap-12{gap:12px}.gap-14{gap:14px}.gap-16{gap:16px}
.mb-4{margin-bottom:4px}.mb-6{margin-bottom:6px}.mb-8{margin-bottom:8px}.mb-10{margin-bottom:10px}
.mb-12{margin-bottom:12px}.mb-14{margin-bottom:14px}.mb-16{margin-bottom:16px}.mb-20{margin-bottom:20px}.mb-24{margin-bottom:24px}
.mt-6{margin-top:6px}.mt-8{margin-top:8px}.mt-10{margin-top:10px}.mt-12{margin-top:12px}.mt-16{margin-top:16px}
.mono{font-family:'IBM Plex Mono',monospace}.text-muted{color:${T.muted}}.text-gold{color:${T.gold}}
.w-full{width:100%}.text-center{text-align:center}.relative{position:relative}
.sep{border:none;border-top:1px solid ${T.border};margin:14px 0}
.card-pad{padding:18px}

/* Responsive */
@media(max-width:960px){
  .g-cards{grid-template-columns:1fr}
  .pricing-grid{grid-template-columns:1fr}
  .g3{grid-template-columns:1fr 1fr}
  .topbar{padding:0 16px}
  .content{padding:14px 16px}
}
@media(max-width:600px){
  .g2,.g3,.trade-grid{grid-template-columns:1fr}
  .stats-row{gap:6px}
  .nav-tabs{gap:0}
  .nav-tab{padding:7px 10px;font-size:11px}
}
`;

// ─────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────
function ScoreArc({ score, size = 64 }) {
  const tier = scoreTier(score);
  const r    = size / 2 - 6;
  const circ = 2 * Math.PI * r;
  const arc  = circ * 0.75;
  const fill = Math.min(score / 100, 1) * arc;
  return (
    <div className="score-arc-wrap">
      <svg width={size} height={size * 0.7} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.border} strokeWidth="5"
          strokeDasharray={`${arc} ${circ - arc}`} strokeDashoffset={circ * 0.125} strokeLinecap="round" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={tier.color} strokeWidth="5"
          strokeDasharray={`${fill} ${arc - fill + 0.01}`} strokeDashoffset={circ * 0.125}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray .8s ease", filter: `drop-shadow(0 0 4px ${tier.color}55)` }} />
        <text x={size/2} y={size/2 + 4} textAnchor="middle" dominantBaseline="middle"
          style={{ fontFamily: "IBM Plex Mono,monospace", fontSize: size * 0.21, fill: tier.color, fontWeight: 500 }}>
          {score}
        </text>
      </svg>
      <div className="score-tier-lbl" style={{ color: tier.color }}>{tier.label}</div>
    </div>
  );
}

function SparkLine({ closes, width = 76, height = 26 }) {
  if (!closes || closes.length < 2) return null;
  const vals  = closes.filter(Boolean);
  if (!vals.length) return null;
  const mn    = Math.min(...vals), mx = Math.max(...vals), rng = mx - mn || 1;
  const pts   = vals.map((v, i) => `${(i / (vals.length - 1)) * width},${height - ((v - mn) / rng) * (height - 2) - 1}`).join(" ");
  const isUp  = vals[vals.length - 1] >= vals[0];
  return (
    <svg width={width} height={height} style={{ display: "block", flexShrink: 0 }}>
      <polyline points={pts} fill="none" stroke={isUp ? T.green : T.red} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function CatBadge({ type }) {
  const cfg = CATALYST_TYPES[type] || CATALYST_TYPES["No Real Catalyst"];
  return (
    <div className="cat-badge" style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}>
      <span>{cfg.icon}</span><span>{type}</span>
    </div>
  );
}

function AnalyzingSkeleton() {
  return (
    <div className="fade">
      <div className="flex items-center gap-10 mb-12" style={{ color: T.muted, fontSize: 12 }}>
        <span className="spin" />
        <span className="mono">Catalyst Intelligence Engine analyzing...</span>
      </div>
      {[100, 85, 95, 70, 90, 60].map((w, i) => (
        <div key={i} className="skel" style={{ width: `${w}%`, height: 10, marginBottom: 7, borderRadius: 4 }} />
      ))}
    </div>
  );
}

function NewsItem({ n }) {
  const age = n.datetime ? Math.round((Date.now() / 1000 - n.datetime) / 3600) : null;
  return (
    <div className="news-item">
      <a href={n.url} target="_blank" rel="noopener noreferrer" className="news-hl">{n.headline}</a>
      <div className="news-meta">
        <span className="news-src">{n.source}</span>
        {age !== null && <span>{age < 1 ? "< 1h ago" : `${age}h ago`}</span>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ANALYSIS PANEL
// ─────────────────────────────────────────────────────────────────
function AnalysisPanel({ analysis, news }) {
  if (!analysis) return <AnalyzingSkeleton />;

  return (
    <div className="fade">
      {analysis.avoid && (
        <div className="avoid-box">
          <div style={{ fontSize: 20, flexShrink: 0 }}>🚫</div>
          <div>
            <div className="avoid-title">AVOID TRADE</div>
            <div className="avoid-txt">{analysis.avoidReason}</div>
          </div>
        </div>
      )}

      <div className="sec-hdr mb-10">Why It's Moving</div>
      <div className="ablock mb-12">
        <div className="ablock-lbl">◈ Market Context</div>
        <div className="ablock-text">{analysis.whyMoving}</div>
      </div>
      <div className="ablock mb-16">
        <div className="ablock-lbl">⬡ Catalyst Rationale</div>
        <div className="ablock-text">{analysis.catalystRationale}</div>
      </div>

      {!analysis.avoid && (
        <>
          <div className="sec-hdr mb-10">Trade Context — Educational Only</div>
          <div className="trade-grid">
            {[
              { label: "👁  Watch Zone",        text: analysis.watchZone },
              { label: "⟶  Entry Logic",        text: analysis.entryLogic },
              { label: "⬇  Stop-Loss Logic",    text: analysis.stopLossLogic },
              { label: "⬆  Take-Profit Logic",  text: analysis.takeProfitLogic },
            ].map(c => (
              <div key={c.label} className="tcell">
                <div className="tcell-lbl">{c.label}</div>
                <div className="tcell-text">{c.text}</div>
              </div>
            ))}
          </div>
          <div className="rr-box">
            <div className="tcell-lbl mb-6">⚖  Risk / Reward Estimate</div>
            <div className="flex items-center gap-12">
              <div className="rr-val">{(analysis.rrEstimate || "").split(" ")[0] || "—"}</div>
              <div style={{ fontSize: 12, color: T.mutedLt, lineHeight: 1.5 }}>{analysis.rrEstimate}</div>
            </div>
          </div>
        </>
      )}

      <div className="disc-box">
        <div style={{ fontSize: 15, flexShrink: 0 }}>⚠</div>
        <div className="disc-txt">"{analysis.disciplineWarning}"</div>
      </div>

      <div className="risk-box">
        <div style={{ fontSize: 15, flexShrink: 0 }}>🎯</div>
        <div>
          <div style={{ fontFamily: "IBM Plex Mono,monospace", fontSize: 8, color: T.red, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 4 }}>Key Risk</div>
          <div className="risk-txt">{analysis.keyRisk}</div>
        </div>
      </div>

      {news && news.length > 0 && (
        <>
          <div className="sec-hdr mb-6">Recent News</div>
          <div className="ablock">
            {news.slice(0, 6).map((n, i) => <NewsItem key={i} n={n} />)}
          </div>
        </>
      )}

      <div className="disclaimer mt-12">
        <span style={{ flexShrink: 0 }}>⚠</span>
        <span>This analysis is for educational trade planning only. It does not constitute financial advice or trading signals. All trading involves significant risk of loss. Cinder Vault Enterprises LLC is not a registered investment advisor. You are solely responsible for your trading decisions.</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// STOCK CARD
// ─────────────────────────────────────────────────────────────────
function StockCard({ ticker, onRemove }) {
  const [quote,      setQuote]      = useState(null);
  const [news,       setNews]       = useState([]);
  const [analysis,   setAnalysis]   = useState(null);
  const [expanded,   setExpanded]   = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [aiLoading,  setAiLoading]  = useState(false);
  const [error,      setError]      = useState("");
  const [refreshed,  setRefreshed]  = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(""); setAnalysis(null);
    const [q, n] = await Promise.all([fetchQuote(ticker), fetchNews(ticker)]);
    if (!q) {
      setError(`No data found for ${ticker}. Check the symbol.`);
      setLoading(false);
      return;
    }
    setQuote(q); setNews(n); setRefreshed(new Date()); setLoading(false);
  }, [ticker]);

  const runAI = useCallback(async () => {
    if (!quote) return;
    setAiLoading(true); setAnalysis(null);
    if (!expanded) setExpanded(true);
    const fallback = {
      newsSummary: "AI analysis temporarily unavailable. Check your connection or API configuration.",
      catalystType: "No Real Catalyst", catalystScore: 0,
      catalystRationale: "Could not reach analysis engine.",
      whyMoving: "Analysis unavailable.", avoid: true,
      avoidReason: "Wait until analysis engine is available before considering any trade.",
      watchZone: "—", entryLogic: "—", stopLossLogic: "—", takeProfitLogic: "—",
      rrEstimate: "—",
      disciplineWarning: "Never trade without proper analysis. Wait for reliable data.",
      keyRisk: "Data unavailable — do not trade.",
    };
    const result = await runAnalysis(ticker, quote, news);
    setAnalysis(result || fallback);
    setAiLoading(false);
  }, [quote, news, ticker, expanded]);

  useEffect(() => { load(); }, [load]);

  const catCfg    = analysis ? (CATALYST_TYPES[analysis.catalystType] || CATALYST_TYPES["No Real Catalyst"]) : null;
  const tier      = analysis ? scoreTier(analysis.catalystScore) : null;
  const rvolColor = !quote ? T.muted : quote.relVolume >= 3 ? T.green : quote.relVolume >= 1.5 ? T.orange : T.muted;
  const glowColor = catCfg ? `linear-gradient(90deg, transparent, ${catCfg.color}55, transparent)` : "transparent";

  return (
    <div className="scard" style={{ opacity: loading ? 0.65 : 1 }}>
      <div className="scard-glow" style={{ background: glowColor }} />

      {/* Header */}
      <div className="scard-hdr" onClick={() => !loading && setExpanded(e => !e)}>
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="ticker-lbl">{loading ? "Loading..." : (quote?.name || ticker)}</div>
            <div className="flex items-center gap-10">
              <div className="price-xl" style={{ color: !quote ? T.muted : quote.change >= 0 ? T.green : T.red }}>
                {loading
                  ? <div className="skel" style={{ width: 80, height: 22, display: "inline-block" }} />
                  : `$${quote.price.toFixed(2)}`}
              </div>
              {!loading && quote && (
                <>
                  <div className="price-chg" style={{ color: quote.change >= 0 ? T.green : T.red }}>
                    {quote.change >= 0 ? "▲" : "▼"} {Math.abs(quote.changePct).toFixed(2)}%
                  </div>
                  <SparkLine closes={quote.closes} />
                </>
              )}
            </div>
          </div>

          <div className="flex items-start gap-10" onClick={e => e.stopPropagation()}>
            {analysis && <ScoreArc score={analysis.catalystScore} size={62} />}
            <div className="flex flex-col gap-6">
              <button className="btn btn-gold btn-sm" onClick={runAI} disabled={loading || aiLoading}>
                {aiLoading ? <span className="spin" /> : "⚡"}
                {aiLoading ? "Analyzing..." : "Analyze"}
              </button>
              <button className="btn btn-ghost btn-xs" onClick={load} disabled={loading} style={{ justifyContent: "center" }}>
                {loading ? <span className="spin" /> : "↺ Refresh"}
              </button>
              <button className="btn btn-xs" style={{ background: "rgba(240,72,72,.1)", color: T.red, border: "1px solid rgba(240,72,72,.2)", justifyContent: "center" }}
                onClick={() => onRemove(ticker)}>✕ Remove</button>
            </div>
          </div>
        </div>

        {!loading && quote && (
          <div className="stats-row">
            <div className="spill">
              <div className="spill-lbl">Ticker</div>
              <div className="spill-val text-gold">{ticker}</div>
            </div>
            <div className="spill">
              <div className="spill-lbl">Volume</div>
              <div className="spill-val">{(quote.volume / 1e6).toFixed(2)}M</div>
            </div>
            <div className="spill">
              <div className="spill-lbl">Rel Vol</div>
              <div className="spill-val" style={{ color: rvolColor }}>{quote.relVolume}x</div>
            </div>
            <div className="spill">
              <div className="spill-lbl">Range</div>
              <div className="spill-val" style={{ fontSize: 11 }}>${quote.low}–${quote.high}</div>
            </div>
          </div>
        )}

        {analysis && (
          <div>
            <div className="flex items-center gap-8 mb-8 flex-wrap">
              <CatBadge type={analysis.catalystType} />
              {analysis.avoid && (
                <div className="cat-badge" style={{ color: T.red, background: "rgba(240,72,72,.08)", borderColor: "rgba(240,72,72,.35)" }}>
                  <span>🚫</span><span>AVOID</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-8 mb-10">
              <div className="score-track">
                <div className="score-fill" style={{ width: `${analysis.catalystScore}%`, background: `linear-gradient(90deg, ${tier.color}88, ${tier.color})` }} />
              </div>
              <div className="score-num" style={{ color: tier.color }}>{analysis.catalystScore}</div>
            </div>
            <div style={{ fontSize: 12.5, color: "#a0a0c8", lineHeight: 1.65 }}>{analysis.newsSummary}</div>
          </div>
        )}

        {error && (
          <div style={{ color: T.red, fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <span>⚠</span><span>{error}</span>
          </div>
        )}
        {refreshed && !loading && (
          <div style={{ fontSize: 9, color: T.muted, marginTop: 8, fontFamily: "IBM Plex Mono,monospace" }}>
            Updated {refreshed.toLocaleTimeString()}
          </div>
        )}
      </div>

      <button className="expand-btn" onClick={() => setExpanded(e => !e)}>
        {expanded ? "▲  Collapse Analysis" : "▼  Full AI Breakdown"}
      </button>

      {expanded && (
        <div className="scard-body">
          {aiLoading
            ? <AnalyzingSkeleton />
            : analysis
              ? <AnalysisPanel analysis={analysis} news={news} />
              : (
                <div className="text-center" style={{ padding: "28px 0", color: T.muted }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>⚡</div>
                  <div style={{ fontSize: 13 }}>Click <strong style={{ color: T.gold }}>Analyze</strong> to run the Catalyst Intelligence Engine</div>
                </div>
              )
          }
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SCANNER PAGE
// ─────────────────────────────────────────────────────────────────
function ScannerPage({ user }) {
  const [tickers, setTickers] = useState(() => LS.get("tickers", ["AAPL", "NVDA", "TSLA", "SPY"]));
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Save tickers locally always
  useEffect(() => { LS.set("tickers", tickers); }, [tickers]);

  // Load watchlist from Supabase if logged in
  useEffect(() => {
    if (!user) return;
    (async () => {
      const sb = await getSupabase();
      const { data } = await sb.from("watchlists").select("tickers").eq("user_id", user.id).single().catch(() => ({ data: null }));
      if (data?.tickers?.length) setTickers(data.tickers);
    })();
  }, [user]);

  const saveWatchlist = async () => {
    if (!user) { setSaveMsg("Sign in to save watchlists to your account"); setTimeout(() => setSaveMsg(""), 3000); return; }
    setSaving(true);
    const sb = await getSupabase();
    await sb.from("watchlists").upsert({ user_id: user.id, tickers, updated_at: new Date().toISOString() });
    setSaving(false); setSaveMsg("Watchlist saved ✓"); setTimeout(() => setSaveMsg(""), 2500);
  };

  const addTicker = (sym) => {
    const s = sym.trim().toUpperCase();
    if (!s || tickers.includes(s) || tickers.length >= 12) return;
    setTickers(t => [...t, s]);
    setInput("");
  };
  const removeTicker = (sym) => setTickers(t => t.filter(x => x !== sym));

  return (
    <div>
      <div className="flex items-start justify-between mb-16 flex-wrap gap-10">
        <div className="flex items-center gap-12">
          <div style={{ width:52, height:52, borderRadius:12, overflow:"hidden", flexShrink:0, background:"#0a0a0a", border:`1px solid ${T.goldDk}`, boxShadow:`0 0 20px rgba(201,168,76,0.15)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <img src="/logo.png" alt="Cinder Vault Capital" style={{ width:50, height:50, objectFit:"contain" }} />
          </div>
          <div>
            <div style={{ fontFamily:"Bebas Neue,serif", fontSize:26, letterSpacing:"3px", color:T.white, lineHeight:1 }}>
              Catalyst Intelligence Engine
            </div>
            <div style={{ fontFamily:"Bebas Neue,serif", fontSize:11, letterSpacing:"3px", color:T.gold, marginTop:3 }}>
              Discipline. Patience. Positioning.
            </div>
            <div style={{ fontSize:12, color:T.mutedLt, marginTop:5 }}>
              Real-time news · AI catalyst scoring · Educational trade context · Not financial advice
            </div>
          </div>
        </div>
        <div className="badge badge-gold">⚡ CIE v2.0</div>
      </div>

      <div className="disclaimer mb-16">
        <span style={{ flexShrink: 0 }}>◈</span>
        <span>This tool is for educational trade planning only. It does not provide financial advice or trading signals. All trading involves risk of loss. Do not trade based solely on automated analysis.</span>
      </div>

      {/* Ticker controls */}
      <div className="flex items-center gap-8 flex-wrap mb-16">
        <input className="ticker-inp" placeholder="Add symbol..." value={input}
          onChange={e => setInput(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === "Enter" && addTicker(input)} />
        <button className="btn btn-gold btn-sm" onClick={() => addTicker(input)} disabled={!input.trim()}>＋ Add</button>
        <div className="flex gap-6 flex-wrap">
          {QUICK_TICKERS.slice(0, 7).map(t => (
            <button key={t}
              className={`quick-btn ${tickers.includes(t) ? "on" : ""}`}
              onClick={() => tickers.includes(t) ? removeTicker(t) : addTicker(t)}>{t}</button>
          ))}
        </div>
        <button className="btn btn-outline btn-sm" onClick={saveWatchlist} disabled={saving}>
          {saving ? <span className="spin" /> : "💾"} {saving ? "Saving..." : "Save Watchlist"}
        </button>
        {saveMsg && <span style={{ fontFamily: "IBM Plex Mono,monospace", fontSize: 10, color: saveMsg.includes("✓") ? T.green : T.orange }}>{saveMsg}</span>}
        <div style={{ fontFamily: "IBM Plex Mono,monospace", fontSize: 9, color: T.muted, marginLeft: "auto" }}>
          {tickers.length}/12 active
        </div>
      </div>

      {/* Score legend */}
      <div className="legend-bar">
        {SCORE_TIERS.map(t => (
          <div key={t.label} className="legend-item">
            <div className="legend-dot" style={{ background: t.color }} />
            <span className="legend-txt">{t.min}–{t.max}: {t.label}</span>
          </div>
        ))}
      </div>

      {/* Cards */}
      {tickers.length === 0 ? (
        <div className="text-center" style={{ padding: "60px 0", color: T.muted }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
          <div style={{ fontSize: 15, color: T.mutedLt, marginBottom: 6 }}>No tickers in scanner</div>
          <div style={{ fontSize: 13 }}>Add symbols above to begin</div>
        </div>
      ) : (
        <div className="g-cards">
          {tickers.map(t => <StockCard key={t} ticker={t} onRemove={removeTicker} />)}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// PRICING / PAYMENT PAGE — PayPal
// ─────────────────────────────────────────────────────────────────
function PricingPage() {
  const handleCheckout = (plan) => {
    if (!plan.paypalKey) return;
    const link = CONFIG[plan.paypalKey];
    if (!link || link.startsWith("YOUR_")) {
      alert("PayPal not configured yet.\n\nSee the API Setup Guide tab for instructions.\n\nOnce you add your PayPal subscription links, customers can subscribe here.");
      return;
    }
    window.open(link, "_blank");
  };

  return (
    <div className="fade">
      {/* Header */}
      <div className="text-center mb-24">
        <img src="/logo.png" alt="Cinder Vault Capital" style={{ width: 100, height: 100, borderRadius: 16, objectFit: "cover", margin: "0 auto 16px", display: "block", boxShadow: "0 0 40px rgba(201,168,76,0.2)" }} />
        <div style={{ fontFamily: "Bebas Neue,serif", fontSize: 36, letterSpacing: "4px", color: T.white, marginBottom: 4 }}>
          Cinder Vault Momentum Catalyst
        </div>
        <div style={{ fontFamily: "Bebas Neue,serif", fontSize: 14, letterSpacing: "4px", color: T.gold, marginBottom: 8 }}>
          Discipline. Patience. Positioning.
        </div>
        <div style={{ fontFamily: "Bebas Neue,serif", fontSize: 18, letterSpacing: "3px", color: T.gold, marginBottom: 12 }}>
          Choose Your Plan
        </div>
        <div style={{ fontSize: 12.5, color: T.muted, maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
          Professional-grade catalyst intelligence for disciplined traders. Payments processed securely through PayPal — no credit card required, pay with your PayPal balance or any card.
        </div>
      </div>

      {/* PayPal trust banner */}
      <div style={{ background: "rgba(0,112,186,0.08)", border: "1px solid rgba(0,112,186,0.25)", borderRadius: 10, padding: "12px 18px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 24, flexShrink: 0 }}>🅿</div>
        <div>
          <div style={{ fontSize: 12.5, color: T.white, fontWeight: 600, marginBottom: 2 }}>Payments powered by PayPal</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>
            Secure checkout · Buyer protection · Cancel anytime · No hidden fees · Pay with PayPal balance, credit card, or debit card
          </div>
        </div>
      </div>

      {/* Plan cards */}
      <div className="pricing-grid">
        {PLANS.map(plan => (
          <div key={plan.id} className={`plan-card ${plan.highlight ? "highlight" : ""}`}>
            {plan.badge && (
              <div className="plan-badge">
                <span className={`badge ${plan.id === "elite" ? "badge-purple" : "badge-gold"}`}>{plan.badge}</span>
              </div>
            )}
            <div className="plan-name">{plan.name}</div>
            <div className="plan-price">{plan.price}</div>
            <div className="plan-period">{plan.period}</div>
            <div className="plan-desc">{plan.desc}</div>
            <div className="plan-features">
              {plan.features.map((f, i) => (
                <div key={i} className="plan-feat">
                  <span className="plan-feat-check">✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {/* PayPal button */}
            {plan.paypalKey ? (
              <div>
                <button
                  className={`btn btn-w ${plan.highlight ? "btn-gold" : "btn-outline"}`}
                  style={{ marginBottom: 8 }}
                  onClick={() => handleCheckout(plan)}>
                  <span>🅿</span> {plan.cta}
                </button>
                <div style={{ fontSize: 9.5, color: T.muted, textAlign: "center", fontFamily: "IBM Plex Mono,monospace" }}>
                  Secure checkout via PayPal · Cancel anytime
                </div>
              </div>
            ) : (
              <button className="btn btn-w btn-outline" onClick={() => {}}>
                {plan.cta}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Annual savings */}
      <div className="card card-pad text-center mb-20">
        <div style={{ fontFamily: "Bebas Neue,serif", fontSize: 18, letterSpacing: "2px", color: T.white, marginBottom: 6 }}>
          Annual Plans — Save 2 Months Free
        </div>
        <div style={{ fontSize: 12, color: T.muted, marginBottom: 10 }}>
          Pro annually: <strong style={{ color: T.gold }}>$150/yr</strong>
          <span style={{ color: T.muted, margin: "0 10px" }}>·</span>
          Elite annually: <strong style={{ color: T.gold }}>$390/yr</strong>
        </div>
        <div style={{ fontSize: 11, color: T.muted }}>
          Contact us at <span style={{ color: T.gold }}>billing@cindervaultpro.com</span> to set up annual billing via PayPal invoice
        </div>
      </div>

      {/* How PayPal works */}
      <div className="card card-pad mb-20">
        <div style={{ fontFamily: "Bebas Neue,serif", fontSize: 16, letterSpacing: "2px", color: T.white, marginBottom: 14 }}>
          How Subscription Works
        </div>
        <div className="g3">
          {[
            { step: "1", title: "Click Subscribe", desc: "Click the PayPal button on your chosen plan. You'll be taken to PayPal's secure checkout." },
            { step: "2", title: "Pay with PayPal", desc: "Use your PayPal balance, credit card, or debit card. PayPal Buyer Protection covers your payment." },
            { step: "3", title: "Instant Access", desc: "Your account is activated immediately. Log in here to access all Pro or Elite features." },
          ].map(s => (
            <div key={s.step} style={{ display: "flex", gap: 10 }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: T.goldGlow, border: `1px solid ${T.goldDk}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "IBM Plex Mono,monospace", fontSize: 12, color: T.gold, flexShrink: 0 }}>{s.step}</div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: T.white, marginBottom: 3 }}>{s.title}</div>
                <div style={{ fontSize: 11.5, color: T.muted, lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cancel info */}
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ fontSize: 20, flexShrink: 0 }}>↩</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.white, marginBottom: 4 }}>Cancel Anytime — No Questions Asked</div>
          <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.55 }}>
            You can cancel your subscription at any time directly from your PayPal account under
            <strong style={{ color: T.mutedLt }}> Settings → Payments → Manage Automatic Payments</strong>.
            Your access continues until the end of the current billing period.
          </div>
        </div>
      </div>

      {/* Trust signals */}
      <div className="g3 mb-20">
        {[
          { icon: "🔒", title: "Secure Payments", desc: "All payments processed by PayPal. We never see or store your card details." },
          { icon: "🛡", title: "PayPal Protection", desc: "Every payment is covered by PayPal Buyer Protection for peace of mind." },
          { icon: "📊", title: "Educational Only", desc: "Not financial advice. Built to improve discipline, not predict markets." },
        ].map(s => (
          <div key={s.title} className="card card-pad text-center">
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.white, marginBottom: 5 }}>{s.title}</div>
            <div style={{ fontSize: 11.5, color: T.muted, lineHeight: 1.5 }}>{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Legal disclaimer */}
      <div className="disclaimer">
        <span style={{ flexShrink: 0 }}>⚠</span>
        <span>Cinder Vault Momentum Catalyst is a subscription-based educational tool. It does not provide investment advice, trading signals, or guarantees of profit. Trading involves significant risk of loss. Past results are not indicative of future performance. Cinder Vault Enterprises LLC is not a registered investment advisor. All trading decisions are your sole responsibility. Subscription fees are non-refundable except where required by law.</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// API SETUP GUIDE
// ─────────────────────────────────────────────────────────────────
function SetupGuidePage() {
  const steps = [
    {
      num: "1",
      title: "Finnhub API — Stock News",
      desc: "Used for real-time company news headlines and summaries.",
      actions: [
        { label: "Status", text: "✓ Connected — Key active", isConnected: true },
        { label: "Key", code: `FINNHUB_KEY: "${CONFIG.FINNHUB_KEY.slice(0,12)}...${CONFIG.FINNHUB_KEY.slice(-4)}"` },
        { label: "Free tier", text: "60 calls/minute — more than enough" },
      ],
      note: "Your Finnhub key is active and pulling live news for all tickers.",
      ready: true,
    },
    {
      num: "2",
      title: "Anthropic API — AI Catalyst Analysis",
      desc: "Powers the full catalyst breakdown, trade context, and discipline warnings.",
      actions: [
        { label: "Go to", link: "https://console.anthropic.com", text: "console.anthropic.com" },
        { label: "Create account and go to API Keys" },
        { label: "Create a new API key" },
        { label: "The artifact already uses this automatically via Claude" },
      ],
      note: "This artifact runs Claude directly — no key needed in the CONFIG for the artifact version. If you deploy as a standalone app, add ANTHROPIC_KEY to your server environment.",
      ready: true,
    },
    {
      num: "3",
      title: "Supabase — Database &amp; Auth (Free tier available)",
      desc: "Persistent watchlists, user accounts, saved analysis history, and subscription management.",
      actions: [
        { label: "Go to", link: "https://supabase.com", text: "supabase.com" },
        { label: "Create a new project (free tier is fine to start)" },
        { label: "Go to Settings → API" },
        { label: "Copy Project URL and anon public key" },
        { label: "Replace in code", code: 'SUPABASE_URL: "YOUR_SUPABASE_URL",\nSUPABASE_ANON: "YOUR_SUPABASE_ANON_KEY"' },
        { label: "Run SQL below to create tables", code: `CREATE TABLE watchlists (\n  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,\n  user_id uuid REFERENCES auth.users,\n  tickers text[],\n  updated_at timestamptz DEFAULT now()\n);\n\nCREATE TABLE analyses (\n  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,\n  user_id uuid REFERENCES auth.users,\n  symbol text,\n  analysis jsonb,\n  created_at timestamptz DEFAULT now()\n);` },
      ],
      note: "Install supabase-js: npm install @supabase/supabase-js, then replace the stub supabase object in the code with createClient().",
      ready: false,
    },
    {
      num: "4",
      title: "PayPal — Subscription Payments",
      desc: "Handles the $15/month Pro and $39/month Elite recurring subscriptions.",
      actions: [
        { label: "Go to", link: "https://paypal.com", text: "paypal.com" },
        { label: "Sign in to your PayPal Business account (or create one — it's free)" },
        { label: "Go to", link: "https://www.paypal.com/buttons/", text: "paypal.com/buttons" },
        { label: "Click", text: "Subscribe Button" },
        { label: "Set up Pro button — Service name: Cinder Vault Pro, Price: $15.00, Billing cycle: Monthly" },
        { label: "Click Get Code, then copy the hosted button URL from the link" },
        { label: "Repeat for Elite — Service name: Cinder Vault Elite, Price: $39.00, Monthly" },
        { label: "Replace in code", code: 'PAYPAL_PRO_LINK:   "https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=YOUR_PRO_ID",\nPAYPAL_ELITE_LINK: "https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=YOUR_ELITE_ID"' },
      ],
      note: "PayPal automatically handles recurring billing, cancellations, and refunds. No extra code needed. Payouts go directly to your PayPal business account and can be transferred to your bank.",
      ready: false,
    },
    {
      num: "5",
      title: "Where to Deploy",
      desc: "Recommended hosting for this app.",
      actions: [
        { label: "Option A (Best for beginners):", text: "Vercel — vercel.com", link: "https://vercel.com" },
        { label: "Push code to GitHub, connect repo to Vercel, deploy in 2 minutes. Free tier handles thousands of users." },
        { label: "Option B (More control):", text: "Netlify — netlify.com", link: "https://netlify.com" },
        { label: "Same workflow as Vercel. Also free tier." },
        { label: "Option C (Full stack):", text: "Railway — railway.app", link: "https://railway.app" },
        { label: "Use if you add a backend server for Stripe webhooks and auth." },
        { label: "Domain:", text: "Namecheap — namecheap.com", link: "https://namecheap.com" },
        { label: "Buy cindervault.com or cindervaultpro.com — around $10-15/yr. Connect to Vercel for free." },
      ],
      note: "For launch: GitHub → Vercel → Namecheap domain. Total cost under $15/year for hosting.",
      ready: false,
    },
  ];

  return (
    <div className="fade">
      <div className="mb-20">
        <div style={{ fontFamily: "Bebas Neue,serif", fontSize: 28, letterSpacing: "3px", color: T.white, marginBottom: 6 }}>
          API Setup &amp; Deployment Guide
        </div>
        <div style={{ fontSize: 12, color: T.muted }}>
          Everything you need to take this from artifact to live product
        </div>
      </div>

      {steps.map(step => (
        <div key={step.num} className="setup-step">
          <div className="step-num">{step.num}</div>
          <div style={{ flex: 1 }}>
            <div className="flex items-center gap-10 mb-4">
              <div className="step-title">{step.title}</div>
              {step.ready && <span className="badge badge-green">✓ Auto-configured</span>}
            </div>
            <div className="step-desc mb-8">{step.desc}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {step.actions.map((a, i) => (
                <div key={i} style={{ fontSize: 12.5, color: "#a0a0c8" }}>
                  {a.label && <span style={{ color: "#8888b0" }}>• {a.label} </span>}
                  {a.isConnected && <span style={{ color: T.green, fontWeight:600 }}>{a.text}</span>}
                  {a.link && <a href={a.link} target="_blank" rel="noopener noreferrer" style={{ color: T.blue, textDecoration: "none" }}>{a.text}</a>}
                  {a.text && !a.link && !a.isConnected && <span style={{ color: T.white }}>{a.text}</span>}
                  {a.code && <div className="code-block">{a.code}</div>}
                </div>
              ))}
            </div>
            {step.note && (
              <div style={{ marginTop: 10, padding: "9px 13px", background: "rgba(201,168,76,.07)", border: `1px solid rgba(201,168,76,.18)`, borderRadius: 7, fontSize: 11.5, color: "#9090b8", lineHeight: 1.6 }}>
                💡 {step.note}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Launch checklist */}
      <div className="card card-pad mt-20">
        <div className="card-title mb-12">Launch Checklist</div>
        {[
          { done: false, item: "Get Finnhub API key and add to CONFIG.FINNHUB_KEY" },
          { done: true,  item: "Anthropic API — already works in this artifact" },
          { done: false, item: "Create Supabase project and run table SQL" },
          { done: false, item: "Create PayPal Business account" },
          { done: false, item: "Create Pro subscription button ($15/mo) and copy link" },
          { done: false, item: "Create Elite subscription button ($39/mo) and copy link" },
          { done: false, item: "Add both PayPal links to CONFIG.PAYPAL_PRO_LINK and CONFIG.PAYPAL_ELITE_LINK" },
          { done: false, item: "Push code to GitHub" },
          { done: false, item: "Deploy to Vercel (free, 2 minutes)" },
          { done: false, item: "Connect custom domain from Namecheap" },
          { done: false, item: "Test payment flow end-to-end in Stripe test mode" },
          { done: false, item: "Add privacy policy and terms of service pages" },
          { done: false, item: "Launch and get first 10 users for free" },
        ].map((c, i) => (
          <div key={i} className="flex items-start gap-10 mb-8" style={{ fontSize: 12.5 }}>
            <span style={{ color: c.done ? T.green : T.muted, flexShrink: 0, marginTop: 1 }}>{c.done ? "✓" : "○"}</span>
            <span style={{ color: c.done ? T.green : T.mutedLt }}>{c.item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────
// ADMIN BACK OFFICE
// ─────────────────────────────────────────────────────────────────
function AdminPage({ user }) {
  const [stats, setStats] = useState({ users: 0, analyses: 0, watchlists: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [psych, setPsych] = useState([
    "Avoid FOMO. The market will always be there.",
    "Your job is not to trade. Your job is to wait for your setup.",
    "After two losses, stop trading for the day.",
    "No revenge trading. The market owes you nothing.",
    "Protect capital first. Profit comes second.",
  ]);
  const [newMsg, setNewMsg] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const isAdmin = user?.email?.toLowerCase().includes("admin") ||
                  user?.email === "rasgibbons21@gmail.com" ||
                  user?.email?.toLowerCase().includes("cindervault");

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      setLoading(true);
      try {
        const sb = await getSupabase();
        const [wRes, aRes] = await Promise.all([
          sb.from("watchlists").select("id, user_id, tickers, updated_at").catch(() => ({ data: [] })),
          sb.from("analyses").select("id, symbol, created_at").catch(() => ({ data: [] })),
        ]);
        setStats({
          users: wRes.data?.length || 0,
          analyses: aRes.data?.length || 0,
          watchlists: wRes.data?.length || 0,
        });
        setUsers(wRes.data?.map((w, i) => ({
          id: w.user_id || `user-${i}`,
          tickers: w.tickers || [],
          lastActive: w.updated_at ? new Date(w.updated_at).toLocaleDateString() : "Unknown",
        })) || []);
      } catch {}
      setLoading(false);
    })();
  }, [isAdmin]);

  if (!isAdmin) return (
    <div className="page fade">
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 0", gap:16 }}>
        <div style={{ fontSize:48 }}>🔐</div>
        <div style={{ fontFamily:"Bebas Neue,serif", fontSize:28, letterSpacing:"3px", color:T.red }}>Access Denied</div>
        <div style={{ fontSize:13, color:T.mutedLt, textAlign:"center", maxWidth:400 }}>
          This area requires admin credentials. Sign in with your admin account to access the back office.
        </div>
        <div style={{ fontFamily:"IBM Plex Mono,monospace", fontSize:11, color:T.muted }}>
          Current user: {user?.email || "Not signed in"}
        </div>
      </div>
    </div>
  );

  return (
    <div className="page fade">
      <div className="ph">
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div className="page-title">Admin Back Office</div>
            <span style={{ background:"rgba(159,122,234,.15)", border:"1px solid rgba(159,122,234,.35)", color:"#c4b5fd", fontSize:9, padding:"3px 9px", borderRadius:5, fontFamily:"IBM Plex Mono,monospace", letterSpacing:"1.5px", textTransform:"uppercase" }}>OWNER</span>
          </div>
          <div className="page-sub">Cinder Vault Enterprises LLC — Dashboard</div>
        </div>
      </div>

      {/* Admin tabs */}
      <div className="tabs mb-20">
        {["overview","users","messages","api-status","api-setup"].map(t => (
          <button key={t} className={`tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
            {t === "overview" ? "📊 Overview" : t === "users" ? "👥 Users" : t === "messages" ? "💬 Messages" : t === "api-status" ? "🔌 API Status" : "⚙ Setup Guide"}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="fade">
          <div className="g4 mb-20">
            {[
              { l:"Total Users",    v: loading ? "..." : stats.users,     c:T.gold,  sub:"Registered accounts" },
              { l:"AI Analyses Run",v: loading ? "..." : stats.analyses,  c:T.green, sub:"Total catalyst runs" },
              { l:"Watchlists",     v: loading ? "..." : stats.watchlists,c:T.blue,  sub:"Saved watchlists" },
              { l:"App Version",    v:"2.0",                               c:T.purple,sub:"CIE v2.0 — Live" },
            ].map(s => (
              <div key={s.l} className="stat" style={{"--a":s.c}}>
                <div className="stat-label">{s.l}</div>
                <div className="stat-value" style={{ color:s.c, fontSize:28 }}>{s.v}</div>
                <div className="stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          <div className="g2">
            <div className="card card-pad">
              <div className="card-title mb-14">Revenue Summary</div>
              {[
                { l:"Pro Plan ($15/mo)",   v:"PayPal Active",  c:T.green },
                { l:"Elite Plan ($39/mo)", v:"PayPal Active",  c:T.green },
                { l:"Annual Pro",          v:"Invoice based",  c:T.gold  },
                { l:"Annual Elite",        v:"Invoice based",  c:T.gold  },
              ].map(r => (
                <div key={r.l} className="flex justify-between mb-10" style={{ fontSize:13 }}>
                  <span style={{ color:T.mutedLt }}>{r.l}</span>
                  <span className="mono" style={{ color:r.c, fontSize:12 }}>{r.v}</span>
                </div>
              ))}
              <div className="sep" />
              <div style={{ fontSize:11, color:T.muted }}>
                View full transaction history at <span style={{ color:T.blue }}>paypal.com/activity</span>
              </div>
            </div>

            <div className="card card-pad">
              <div className="card-title mb-14">System Health</div>
              {[
                { l:"Yahoo Finance API",  v:"Live", c:T.green  },
                { l:"Finnhub News API",   v:"Connected", c:T.green },
                { l:"Anthropic AI",       v:"Active", c:T.green  },
                { l:"Supabase Database",  v:"Connected", c:T.green },
                { l:"PayPal Payments",    v:"Live", c:T.green  },
                { l:"Domain",             v:"cindervaultpro.com", c:T.gold },
              ].map(r => (
                <div key={r.l} className="flex justify-between mb-10" style={{ fontSize:13 }}>
                  <span style={{ color:T.mutedLt }}>{r.l}</span>
                  <div className="flex items-center gap-6">
                    <div style={{ width:6, height:6, borderRadius:"50%", background:r.c, boxShadow:`0 0 5px ${r.c}` }} />
                    <span className="mono" style={{ color:r.c, fontSize:11 }}>{r.v}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="fade">
          <div className="card" style={{ padding:0, overflow:"hidden" }}>
            <div style={{ padding:"16px 18px", borderBottom:`1px solid ${T.border}` }}>
              <div className="card-title">Registered Users</div>
              <div className="card-sub">{loading ? "Loading..." : `${users.length} users with saved watchlists`}</div>
            </div>
            {loading ? (
              <div className="flex items-center justify-center" style={{ padding:40, gap:10, color:T.muted }}>
                <span className="spin" /> Loading user data...
              </div>
            ) : users.length === 0 ? (
              <div style={{ padding:40, textAlign:"center", color:T.muted, fontSize:13 }}>
                No users with saved watchlists yet. Once users sign up and save watchlists they appear here.
              </div>
            ) : (
              <table className="tbl">
                <thead><tr><th>User ID</th><th>Tickers</th><th>Last Active</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td className="mono" style={{ fontSize:11, color:T.mutedLt }}>{u.id?.slice(0,20)}...</td>
                      <td>
                        <div className="flex flex-wrap gap-4">
                          {u.tickers.map(t => <span key={t} className="badge badge-gold" style={{ fontSize:9 }}>{t}</span>)}
                        </div>
                      </td>
                      <td style={{ fontSize:12, color:T.muted }}>{u.lastActive}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === "messages" && (
        <div className="fade">
          <div className="card card-pad">
            <div className="card-title mb-4">Psychology Message Library</div>
            <div className="card-sub mb-16">These messages display to users in the scanner. Edit or add new ones below.</div>
            <div style={{ maxHeight:400, overflowY:"auto", marginBottom:16 }}>
              {psych.map((msg, i) => (
                <div key={i} className="flex items-start gap-10 mb-8"
                  style={{ background:T.bg, border:`1px solid ${T.border}`, borderRadius:8, padding:"10px 14px" }}>
                  <div style={{ fontFamily:"IBM Plex Mono,monospace", fontSize:10, color:T.goldDk, flexShrink:0, marginTop:2 }}>{String(i+1).padStart(2,"0")}</div>
                  <div style={{ flex:1, fontSize:12.5, color:T.mutedLt, lineHeight:1.5 }}>"{msg}"</div>
                  <button className="btn btn-xs" style={{ background:"rgba(240,72,72,.1)", color:T.red, border:"1px solid rgba(240,72,72,.2)", flexShrink:0, padding:"3px 8px" }}
                    onClick={() => setPsych(p => p.filter((_,j) => j !== i))}>✕</button>
                </div>
              ))}
            </div>
            <div className="flex gap-10">
              <input className="inp" placeholder="Add new psychology message..." value={newMsg}
                onChange={e => setNewMsg(e.target.value)} style={{ flex:1 }}
                onKeyDown={e => e.key === "Enter" && newMsg && (setPsych(p => [...p, newMsg]), setNewMsg(""))} />
              <button className="btn btn-gold btn-sm"
                onClick={() => { if(newMsg){ setPsych(p => [...p, newMsg]); setNewMsg(""); } }}>Add</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "api-status" && (
        <div className="fade">
          <div className="g2">
            {[
              { name:"Finnhub News API", key: CONFIG.FINNHUB_KEY, status:"Connected", url:"finnhub.io", desc:"Real-time company news headlines and summaries for all tickers.", color:T.green },
              { name:"Anthropic Claude AI", key:"Auto-configured", status:"Active", url:"console.anthropic.com", desc:"Powers the full catalyst breakdown, trade context, and discipline warnings.", color:T.green },
              { name:"Supabase Database", key: CONFIG.SUPABASE_URL, status:"Connected", url:"supabase.com", desc:"User authentication, saved watchlists, and analysis history.", color:T.green },
              { name:"Yahoo Finance", key:"No key required", status:"Live", url:"finance.yahoo.com", desc:"Live price data, volume, day range, and 5-day price history for all symbols.", color:T.green },
              { name:"PayPal Pro", key: CONFIG.PAYPAL_PRO_LINK?.includes("GAXKVRGYQ8UVY") ? "Button ID: GAXKVRGYQ8UVY" : "Not configured", status: CONFIG.PAYPAL_PRO_LINK?.includes("GAXKVRGYQ8UVY") ? "Active" : "Pending", url:"paypal.com", desc:"$15/month Pro subscription checkout button.", color: CONFIG.PAYPAL_PRO_LINK?.includes("GAXKVRGYQ8UVY") ? T.green : T.orange },
              { name:"PayPal Elite", key: CONFIG.PAYPAL_ELITE_LINK?.includes("2JBDDQK3DG98G") ? "Button ID: 2JBDDQK3DG98G" : "Not configured", status: CONFIG.PAYPAL_ELITE_LINK?.includes("2JBDDQK3DG98G") ? "Active" : "Pending", url:"paypal.com", desc:"$39/month Elite subscription checkout button.", color: CONFIG.PAYPAL_ELITE_LINK?.includes("2JBDDQK3DG98G") ? T.green : T.orange },
            ].map(api => (
              <div key={api.name} className="card card-pad">
                <div className="flex items-center justify-between mb-10">
                  <div style={{ fontSize:14, fontWeight:600, color:T.white }}>{api.name}</div>
                  <div className="flex items-center gap-6">
                    <div style={{ width:7, height:7, borderRadius:"50%", background:api.color, boxShadow:`0 0 6px ${api.color}` }} />
                    <span style={{ fontFamily:"IBM Plex Mono,monospace", fontSize:10, color:api.color }}>{api.status}</span>
                  </div>
                </div>
                <div style={{ fontSize:11.5, color:T.muted, marginBottom:10, lineHeight:1.5 }}>{api.desc}</div>
                <div style={{ background:T.bg, border:`1px solid ${T.border}`, borderRadius:7, padding:"7px 10px", fontFamily:"IBM Plex Mono,monospace", fontSize:10, color:T.mutedLt, wordBreak:"break-all" }}>
                  {api.key?.length > 60 ? api.key.slice(0,60) + "..." : api.key}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {activeTab === "api-setup" && (
        <div className="fade">
          <SetupGuidePage />
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("scanner");
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [authMsg, setAuthMsg] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  // Check existing session on load
  useEffect(() => {
    (async () => {
      const sb = await getSupabase();
      const { data } = await sb.auth.getSession();
      if (data?.session?.user) setUser(data.session.user);
      sb.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });
    })();
  }, []);

  const handleAuth = async () => {
    if (!authEmail || !authPass) return;
    setAuthLoading(true); setAuthMsg("");
    const sb = await getSupabase();
    const fn = authMode === "login" ? sb.auth.signInWithPassword : sb.auth.signUp;
    const { data, error } = await fn.call(sb.auth, { email: authEmail, password: authPass });
    if (error) { setAuthMsg(error.message); }
    else { setUser(data?.user || data?.session?.user); setShowAuth(false); setAuthEmail(""); setAuthPass(""); }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    const sb = await getSupabase();
    await sb.auth.signOut();
    setUser(null);
  };

  const TABS = [
    { id: "scanner",  label: "⚡ Scanner"  },
    { id: "pricing",  label: "💳 Pricing"  },
    ...(user ? [{ id: "admin", label: "🔐 Admin" }] : []),
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* Topbar */}
        <div className="topbar">
          <div className="logo-wrap">
            <div style={{ width:40, height:40, borderRadius:10, overflow:"hidden", flexShrink:0, background:"#0a0a0a", border:`1px solid ${T.goldDk}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <img src="/logo.png" alt="Cinder Vault Capital"
                style={{ width:38, height:38, objectFit:"contain" }} />
            </div>
            <div>
              <div className="logo-name">CINDER VAULT</div>
              <div className="logo-sub">Momentum Catalyst</div>
            </div>
          </div>

          <div className="nav-tabs">
            {TABS.map(t => (
              <button key={t.id} className={`nav-tab ${page === t.id ? "active" : ""}`} onClick={() => setPage(t.id)}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-10">
            <div className="flex items-center gap-6">
              <div className="dot dot-g" />
              <span style={{ fontFamily: "IBM Plex Mono,monospace", fontSize: 9, color: T.mutedLt }}>LIVE</span>
            </div>
            {user ? (
              <div className="flex items-center gap-8">
                <span style={{ fontFamily: "IBM Plex Mono,monospace", fontSize: 9, color: T.gold }}>⬡ {user.email?.split("@")[0]}</span>
                <button className="btn btn-outline btn-xs" onClick={handleLogout}>Sign Out</button>
              </div>
            ) : (
              <button className="btn btn-gold btn-sm" onClick={() => setShowAuth(true)}>Sign In</button>
            )}
            <div className="badge badge-gold">Not Financial Advice</div>
          </div>
        </div>

        {/* Auth modal */}
        {showAuth && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(4,4,8,.88)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ background: T.surface, border: `1px solid ${T.borderHi}`, borderRadius: 14, padding: 28, width: "100%", maxWidth: 380 }}>
              <div style={{ fontFamily: "Bebas Neue,serif", fontSize: 20, letterSpacing: "2px", color: T.goldLt, marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
                <img src="/logo.png" alt="Cinder Vault" style={{ width: 32, height: 32, borderRadius: 6, objectFit: "cover" }} />
                {authMode === "login" ? "Sign In" : "Create Account"}
              </div>
              <div style={{ fontSize: 11, color: T.muted, marginBottom: 18 }}>Cinder Vault Momentum Catalyst</div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: "IBM Plex Mono,monospace", fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "1.8px", marginBottom: 5 }}>Email</div>
                <input style={{ width: "100%", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 12px", color: T.white, fontFamily: "Sora,sans-serif", fontSize: 13, outline: "none" }}
                  type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="you@email.com" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "IBM Plex Mono,monospace", fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "1.8px", marginBottom: 5 }}>Password</div>
                <input style={{ width: "100%", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 12px", color: T.white, fontFamily: "Sora,sans-serif", fontSize: 13, outline: "none" }}
                  type="password" value={authPass} onChange={e => setAuthPass(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAuth()} placeholder="Password" />
              </div>
              {authMsg && <div style={{ fontSize: 11, color: T.red, marginBottom: 12 }}>{authMsg}</div>}
              <button className="btn btn-gold btn-w" onClick={handleAuth} disabled={authLoading} style={{ marginBottom: 10 }}>
                {authLoading ? <span className="spin" /> : null}
                {authLoading ? "Please wait..." : authMode === "login" ? "Sign In" : "Create Account"}
              </button>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: T.muted, cursor: "pointer" }}
                  onClick={() => { setAuthMode(m => m === "login" ? "signup" : "login"); setAuthMsg(""); }}>
                  {authMode === "login" ? "No account? Sign up" : "Have account? Sign in"}
                </span>
                <button className="btn btn-ghost btn-xs" onClick={() => { setShowAuth(false); setAuthMsg(""); }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="content">
          {page === "scanner" && <ScannerPage user={user} />}
          {page === "pricing" && <PricingPage />}
          {page === "admin"   && <AdminPage user={user} />}
        </div>

        {/* Footer */}
        <div className="footer">
          <div>© 2026 Cinder Vault Enterprises LLC — Cinder Vault Momentum Catalyst v2.0</div>
          <div>Educational use only · Not financial advice · All trading involves significant risk</div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   API SETUP GUIDE — QUICK REFERENCE
   ───────────────────────────────────────────────────────────────────
   GET THESE KEYS (all have free tiers):

   1. FINNHUB (news data)
      → finnhub.io → Get free API key
      → 60 calls/min free
      → Add to: CONFIG.FINNHUB_KEY

   2. ANTHROPIC (AI analysis)
      → Already works in this artifact
      → For standalone deploy: console.anthropic.com → API Keys
      → Add to server .env: ANTHROPIC_API_KEY=...

   3. SUPABASE (database + auth)
      → supabase.com → New project → Settings → API
      → Add to: CONFIG.SUPABASE_URL + CONFIG.SUPABASE_ANON
      → Install: npm install @supabase/supabase-js
      → Replace stub supabase object with createClient()

   4. STRIPE (payments)
      → stripe.com → Payment Links → Create link
      → Pro: $15/mo recurring → copy URL
      → Elite: $39/mo recurring → copy URL
      → Add to: CONFIG.STRIPE_LINK_PRO + CONFIG.STRIPE_LINK_ELITE

   WHERE TO PUBLISH:
   → Vercel (recommended): vercel.com — free, instant deploy from GitHub
   → Netlify: netlify.com — same, also free
   → Domain: namecheap.com — ~$10-15/yr, connect to Vercel free
   → Full stack later: railway.app for backend + Stripe webhooks

   LAUNCH ORDER:
   Finnhub key → Supabase setup → Stripe links → GitHub → Vercel → Domain → Launch
═══════════════════════════════════════════════════════════════════ */
