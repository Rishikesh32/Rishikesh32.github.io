/* Quantitative Trader Atlas — Designed-to-scale Interactive Engine & Curriculum */
(function () {
  "use strict";

  const k = "#211e1b";
  const _r = "#1c1a17";
  const vr = {
    orange: { top: ["#fee6cc", "#fcd4ad"], side: ["#f9c697", "#f3b47f"] },
    green: { top: ["#e2f2d7", "#d1e9c2"], side: ["#c3e1b2", "#b3d79f"] },
    blue: { top: ["#dfebf9", "#cde0f5"], side: ["#bcd3ef", "#a9c5e8"] },
    yellow: { top: ["#fff3d6", "#fee7b8"], side: ["#fcdb9c", "#f6cd82"] },
    purple: { top: ["#f2eaf9", "#e6dbf4"], side: ["#d9cbef", "#cbbae6"] },
    slab: { top: ["#f7f0e7", "#f0e7dc"], side: ["#ece2d5", "#e3d7c8"] },
    store: { top: ["#f6f1fa", "#ece4f4"], side: ["#e2d8ee", "#d6c9e6"] }
  };

  const A = (e) => Math.round(e * 100) / 100;
  const j = (e, t, n = 0) => [A(14 * (e + t)), A(7 * (e - t) - n)];

  // SVG Icons dictionary
  const ICONS = {
    menu: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    replay: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',
    pause: '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="14" y="3" width="5" height="18" rx="1"/><rect x="5" y="3" width="5" height="18" rx="1"/></svg>',
    play: '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
    expand: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
    arrowLeft: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
    arrowRight: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
    check: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    circleCheck: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    chevronRight: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>',
    chevronDown: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>',
    folder: '<svg width="18" height="15" viewBox="0 0 20 16" fill="currentColor"><path d="M1 3a2 2 0 0 1 2-2h4.3l2 2.2H17a2 2 0 0 1 2 2V13a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2Z"/></svg>',
    file: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    lock: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    bulb: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.76.76 1.23 1.52 1.41 2.5"/></svg>',
    gear: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    keyboard: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="4" width="20" height="16" rx="2.5"/><line x1="6" y1="8" x2="6.01" y2="8"/><line x1="10" y1="8" x2="10.01" y2="8"/><line x1="14" y1="8" x2="14.01" y2="8"/><line x1="18" y1="8" x2="18.01" y2="8"/><line x1="6" y1="12" x2="6.01" y2="12"/><line x1="18" y1="12" x2="18.01" y2="12"/><line x1="8" y1="16" x2="16" y2="16"/></svg>'
  };

  function icon(name) {
    return ICONS[name] || "";
  }

  // 6 Comprehensive Curriculum Modules matching Designed-to-Scale
  const MODULES = [
    {
      id: "foundations",
      num: "01",
      title: "Foundations & Stochastic Calculus",
      color: "sand",
      lessons: [
        { id: "prob-spaces", title: "Probability Spaces & Filtrations", ready: true },
        { id: "brownian-motion", title: "Brownian Motion & Wiener Paths", ready: true },
        { id: "ito-calculus", title: "Itô's Lemma & Quadratic Drift", ready: true },
        { id: "svd-pca", title: "SVD Matrix Denoising & RMT", ready: true }
      ]
    },
    {
      id: "microstructure",
      num: "02",
      title: "Microstructure & Order Books",
      color: "orange",
      lessons: [
        { id: "lob-mechanics", title: "Limit Order Book Level 2/3", ready: true },
        { id: "order-flow-toxicity", title: "Order Flow Toxicity (VPIN)", ready: true },
        { id: "market-impact", title: "Almgren-Chriss Market Impact", ready: true }
      ]
    },
    {
      id: "derivatives",
      num: "03",
      title: "Derivatives & Volatility Surface",
      color: "violet",
      lessons: [
        { id: "black-scholes", title: "Black-Scholes-Merton PDE", ready: true },
        { id: "the-greeks", title: "Delta, Gamma & Vega Hedging", ready: true },
        { id: "vol-surface", title: "Volatility Surface & Smile Skew", ready: true }
      ]
    },
    {
      id: "alpha-stat-arb",
      num: "04",
      title: "Alpha Research & Stat Arb",
      color: "green",
      lessons: [
        { id: "factor-investing", title: "Multi-Factor Models & Alpha Decay", ready: true },
        { id: "pairs-trading", title: "Cointegration & Kalman Pairs", ready: true },
        { id: "financial-ml", title: "Purged K-Fold Cross Validation", ready: true }
      ]
    },
    {
      id: "hft-execution",
      num: "05",
      title: "HFT, Quoting & Algorithms",
      color: "blue",
      lessons: [
        { id: "avellaneda-stoikov", title: "Avellaneda-Stoikov Market Making", ready: true },
        { id: "execution-algos", title: "TWAP, VWAP & Slippage TCA", ready: true },
        { id: "quant-tech-stack", title: "Low-Latency C++ & KDB+/q", ready: true }
      ]
    },
    {
      id: "ai-llm-frontier",
      num: "06",
      title: "The AI & LLM Quant Frontier",
      color: "rose",
      lessons: [
        { id: "llm-earnings-nlp", title: "SEC Filings & Transcript NLP Alpha", ready: true },
        { id: "autonomous-swarms", title: "Autonomous Multi-Agent Trading Swarms", ready: true }
      ]
    }
  ];

  // Flat lesson registry
  const LESSONS = MODULES.flatMap((m) =>
    m.lessons.map((l, idx) => ({
      ...l,
      module: m,
      index: idx + 1,
      of: m.lessons.length
    }))
  );

  // Lesson Content Database
  const LESSON_DATA = {
    "lob-mechanics": {
      title: "Limit Order Book Level 2/3",
      subtitle: "How matching engines execute trades, maintain price-time priority, and manage bid-ask queues.",
      metrics: ["spread", "bestBid", "bestAsk", "vpin", "latency"],
      goals: [
        { text: "Understand FIFO Price-Time priority matching in Level 3 books", step: 1 },
        { text: "Measure aggressive market orders against passive limit queues", step: 3 },
        { text: "Track adverse selection and order flow toxicity (VPIN)", step: 5 }
      ],
      steps: [
        {
          short: "Enter Queue",
          chapter: "problem",
          title: "The Limit Order Book Structure",
          body: [
            "Trading venues maintain a two-sided continuous double auction. Passive participants inject <code>Limit Orders</code> specifying quantity and price limit, forming the bid (buy) and ask (sell) queues.",
            "The top of the book represents the <strong>National Best Bid and Offer (NBBO)</strong>. The gap between them is the bid-ask spread."
          ],
          callout: { kind: "insight", text: "Passive liquidity providers earn the spread but face adverse selection when informed traders trade against them." },
          changes: ["+ Bid Queue ($100.00)", "+ Ask Queue ($100.02)"],
          metrics: { spread: "$0.02", bestBid: "$100.00", bestAsk: "$100.02", vpin: "0.12", latency: "1.2 μs" },
          scene: {
            entities: [
              { id: "mm", type: "device", x: -8, y: -8, label: "Market Maker", sub: "Passive Quoter" },
              { id: "engine", type: "block", x: 0, y: 0, color: "orange", glyph: "server", label: ["Matching", "Engine"], sub: "Price-Time FIFO" },
              { id: "bids", type: "db", x: 8, y: -6, color: "green", label: "Bids ($100.00)", sub: "6,800 shs" },
              { id: "asks", type: "db", x: 8, y: 6, color: "blue", label: "Asks ($100.02)", sub: "4,200 shs" }
            ],
            links: [
              { from: "mm", to: "engine", label: "Quote L2" },
              { from: "engine", to: "bids", label: "Queue Bid" },
              { from: "engine", to: "asks", label: "Queue Ask" }
            ],
            flows: [
              { from: "mm", to: "engine", color: "#10b981", label: "Limit Buy" },
              { from: "engine", to: "bids", color: "#10b981" }
            ]
          }
        },
        {
          short: "Market Sweep",
          chapter: "technique",
          title: "Aggressive Market Order Execution",
          body: [
            "An institutional trader submits an aggressive <code>Market Order</code> to buy 5,000 shares immediately.",
            "The matching engine sweeps the top of the ask book: it fills 4,200 shares at $100.02, completely exhausting the level, and fills the remaining 800 shares at the next price level $100.03."
          ],
          callout: { kind: "tip", text: "Sweeping multiple levels creates immediate temporary market impact and widens the spread." },
          changes: ["~ Ask swept to $100.03", "~ Spread widened 2¢ → 3¢", "+ 5,000 shares executed"],
          metrics: { spread: "$0.03", bestBid: "$100.00", bestAsk: "$100.03", vpin: "0.28", latency: "1.4 μs" },
          scene: {
            entities: [
              { id: "inst", type: "device", x: -8, y: 8, label: "Institutional Fund", sub: "Aggressive Buyer" },
              { id: "engine", type: "block", x: 0, y: 0, color: "orange", glyph: "server", label: ["Matching", "Engine"], sub: "Matching Trade" },
              { id: "bids", type: "db", x: 8, y: -6, color: "green", label: "Bids ($100.00)", sub: "6,800 shs" },
              { id: "asks", type: "db", x: 8, y: 6, color: "blue", label: "Asks ($100.03)", sub: "8,500 shs" },
              { id: "tape", type: "panel", x: 0, y: 12, label: "SIP Tape Feed", sub: "5,000 @ $100.022" }
            ],
            links: [
              { from: "inst", to: "engine", label: "Market Buy" },
              { from: "engine", to: "asks", label: "Sweep Asks" },
              { from: "engine", to: "tape", label: "Print Trade" }
            ],
            flows: [
              { from: "inst", to: "engine", color: "#f59e0b", label: "5k shs" },
              { from: "engine", to: "tape", color: "#10b981", label: "Trade Fill" }
            ]
          }
        },
        {
          short: "Order Toxicity",
          chapter: "solution",
          title: "Adverse Selection & VPIN Spike",
          body: [
            "When persistent one-sided aggressive buying continues, Volume-Synchronized Probability of Toxicity (<code>VPIN</code>) spikes above 0.50.",
            "High-frequency market makers detect the toxic informed flow, cancel their resting ask quotes within microseconds, and widen bid-ask spreads to avoid being picked off."
          ],
          callout: { kind: "alert", text: "Market makers that fail to retreat from toxic informed flow experience severe inventory devaluation." },
          changes: ["! VPIN spiked 0.28 → 0.64", "~ Market makers retreat", "~ Spread widened to 5¢"],
          metrics: { spread: "$0.05", bestBid: "$99.98", bestAsk: "$100.03", vpin: "0.64", latency: "0.8 μs" },
          scene: {
            entities: [
              { id: "hft", type: "device", x: -8, y: -8, label: "HFT Quoter", sub: "Cancelling Quotes" },
              { id: "engine", type: "block", x: 0, y: 0, color: "orange", glyph: "server", label: ["Matching", "Engine"], sub: "Toxic Imbalance" },
              { id: "bids", type: "db", x: 8, y: -6, color: "green", label: "Bids ($99.98)", sub: "Widened" },
              { id: "asks", type: "db", x: 8, y: 6, color: "blue", label: "Asks ($100.03)", sub: "Depleted" }
            ],
            links: [
              { from: "hft", to: "engine", label: "Cancel All" },
              { from: "engine", to: "bids", label: "Pull Depth" }
            ],
            flows: [
              { from: "hft", to: "engine", color: "#ef4444", label: "Cancel" }
            ]
          }
        },
        {
          short: "Recap",
          chapter: "recap",
          title: "Key Takeaways: Order Book Mastery",
          body: [
            "The Limit Order Book is a dynamic auction governed by queue priority, fill latency, and adverse selection risk.",
            "Modern quantitative execution algorithms model market impact (Almgren-Chriss) and toxic flow (VPIN) to slice parent orders into invisible child orders."
          ],
          callout: { kind: "insight", text: "Execution skill directly preserves alpha. Even a 1-basis-point slippage reduction scales to millions in active fund performance." },
          changes: ["✓ Level 3 Order Book verified", "✓ Microstructure mechanics mastered"],
          metrics: { spread: "$0.02", bestBid: "$100.00", bestAsk: "$100.02", vpin: "0.15", latency: "0.9 μs" },
          scene: {
            entities: [
              { id: "engine", type: "block", x: 0, y: 0, color: "orange", glyph: "server", label: ["Matching", "Engine"], sub: "Equilibrium" },
              { id: "bids", type: "db", x: -8, y: 0, color: "green", label: "Bids Queue", sub: "Balanced" },
              { id: "asks", type: "db", x: 8, y: 0, color: "blue", label: "Asks Queue", sub: "Balanced" }
            ],
            links: [
              { from: "bids", to: "engine" },
              { from: "asks", to: "engine" }
            ],
            flows: []
          }
        }
      ]
    },
    "avellaneda-stoikov": {
      title: "Avellaneda-Stoikov Market Making",
      subtitle: "Optimal high-frequency bid-ask spread formulation and inventory risk management.",
      metrics: ["inventory", "reservation", "midPrice", "halfSpread", "pnl"],
      goals: [
        { text: "Derive the reservation price equation with inventory aversion", step: 1 },
        { text: "Observe quote asymmetry when accumulating long inventory", step: 2 },
        { text: "Prevent toxic inventory blowups during trending market regimes", step: 3 }
      ],
      steps: [
        {
          short: "Mid-Price Zero",
          chapter: "problem",
          title: "Symmetric Quoting at Zero Inventory",
          body: [
            "When the market maker holds zero inventory ($q = 0$), reservation price $r(s, q)$ equals the fair mid-price $S_t$.",
            "Optimal bid and ask quotes are placed symmetrically around mid-price: $r_a = S + \\delta/2$ and $r_b = S - \\delta/2$."
          ],
          callout: { kind: "insight", text: "Reservation price represents the asset value at which the trader is indifferent between trading and holding." },
          changes: ["+ Inventory q = 0", "+ Symmetric Spread: 4¢"],
          metrics: { inventory: "0", reservation: "$100.00", midPrice: "$100.00", halfSpread: "2.0¢", pnl: "$0.00" },
          scene: {
            entities: [
              { id: "maker", type: "block", x: 0, y: 0, color: "green", glyph: "server", label: "AS Quoter", sub: "q = 0" },
              { id: "bid", type: "device", x: -8, y: 0, label: "Bid: $99.98", sub: "Passive Buy" },
              { id: "ask", type: "device", x: 8, y: 0, label: "Ask: $100.02", sub: "Passive Sell" }
            ],
            links: [
              { from: "maker", to: "bid" },
              { from: "maker", to: "ask" }
            ],
            flows: [
              { from: "maker", to: "bid", color: "#10b981" },
              { from: "maker", to: "ask", color: "#3b82f6" }
            ]
          }
        },
        {
          short: "Long Inventory Skew",
          chapter: "technique",
          title: "Dynamic Reservation Skew with Long Inventory",
          body: [
            "After several incoming customer sales, the market maker accumulates a long inventory position ($q = +10$).",
            "Under the Avellaneda-Stoikov formula: $r(s, q) = s - q \\gamma \\sigma^2 (T - t)$.",
            "The reservation price shifts downward to $99.96$. The market maker lowers the bid to deter further buys, while aggressively lowering the ask to attract sellers and offload inventory."
          ],
          callout: { kind: "tip", text: "Asymmetric quoting automatically rebalances inventory without requiring costly market-order crosses." },
          changes: ["~ Inventory q = +10", "~ Reservation shifted -$0.04", "~ Ask quote lowered to attract buyers"],
          metrics: { inventory: "+10", reservation: "$99.96", midPrice: "$100.00", halfSpread: "2.4¢", pnl: "+$42.50" },
          scene: {
            entities: [
              { id: "maker", type: "block", x: 0, y: 0, color: "green", glyph: "server", label: "AS Quoter", sub: "q = +10 (Skewed)" },
              { id: "bid", type: "device", x: -8, y: -4, label: "Bid: $99.94", sub: "Deterring Buys" },
              { id: "ask", type: "device", x: 8, y: 4, label: "Ask: $99.98", sub: "Attracting Sells" }
            ],
            links: [
              { from: "maker", to: "bid" },
              { from: "maker", to: "ask" }
            ],
            flows: [
              { from: "maker", to: "ask", color: "#f59e0b", label: "Inventory Unload" }
            ]
          }
        },
        {
          short: "Recap",
          chapter: "recap",
          title: "Key Takeaways: High-Frequency Market Making",
          body: [
            "Avellaneda-Stoikov provides the closed-form mathematical baseline for all automated market makers across electronic exchanges and crypto order books.",
            "By penalizing inventory variance $\\gamma \\sigma^2$, market makers survive adverse trending regimes while capturing steady bid-ask flow profits."
          ],
          callout: { kind: "insight", text: "Modern extensions incorporate order flow arrival intensity jumps and tick-size discretization." },
          changes: ["✓ Inventory returned to neutral", "✓ Cumulative PnL locked in"],
          metrics: { inventory: "0", reservation: "$100.00", midPrice: "$100.00", halfSpread: "2.0¢", pnl: "+$128.00" },
          scene: {
            entities: [
              { id: "maker", type: "block", x: 0, y: 0, color: "green", glyph: "server", label: "AS Quoter", sub: "Neutral State" }
            ],
            links: [],
            flows: []
          }
        }
      ]
    },
    
    "stochastic-calculus": {
      title: "Stochastic Calculus & Itô's Lemma",
      subtitle: "Geometric Brownian Motion, quadratic variation, and continuous-time drift-diffusion modeling.",
      metrics: ["drift", "diffusion", "quad_var", "itô_term"],
      goals: [
        { text: "Derive quadratic variation of Brownian motion [B, B]_t = t", step: 1 },
        { text: "Apply Itô's Formula with second-order convexity correction", step: 2 },
        { text: "Discretize SDEs using Euler-Maruyama and Milstein schemes", step: 3 }
      ],
      steps: [
        {
          short: "Brownian Motion",
          chapter: "problem",
          title: "Standard Brownian Motion & Filtrations",
          body: [
            "We model continuous asset returns through a filtered probability space (Ω, F, (F_t), P).",
            "A standard Brownian motion B_t satisfies stationary independent Gaussian increments with E[B_t] = 0 and Var(B_t) = t.",
            "Because Brownian paths are almost surely nowhere differentiable, classical Newton-Leibniz calculus fails: we require Itô integration."
          ],
          callout: { kind: "insight", text: "Brownian sample paths have infinite total variation on any finite interval, meaning sum |ΔB_i| -> ∞ as partition mesh -> 0. The quadratic variation, however, converges deterministically to t." },
          changes: ["+ Filtered space (Ω, F_t, P) configured", "+ Brownian noise generator active"],
          metrics: { drift: "μ = 0.08", diffusion: "σ = 0.22", quad_var: "d[B]_t = dt", itô_term: "1/2 σ² S² dt" },
          scene: {
            entities: [
              { id: "clock", type: "device", x: -8, y: -4, label: "Time t", sub: "Filtration F_t" },
              { id: "noise", type: "block", x: -8, y: 4, color: "blue", label: ["Gaussian", "dB_t ~ N(0,dt)"], sub: "Wiener Process" },
              { id: "sde", type: "block", x: 2, y: 0, color: "orange", label: ["Itô SDE", "dS_t = μSdt + σSdB"], sub: "Stochastic Integrator" },
              { id: "path", type: "db", x: 10, y: 0, color: "green", label: "Asset Price S_t", sub: "Lognormal GBM" }
            ],
            links: [
              { from: "clock", to: "sde", label: "μ S dt" },
              { from: "noise", to: "sde", label: "σ S dB_t" },
              { from: "sde", to: "path", label: "S_{t+Δt}" }
            ],
            flows: [
              { from: "clock", to: "sde", color: "#f59e0b" },
              { from: "noise", to: "sde", color: "#3b82f6" },
              { from: "sde", to: "path", color: "#10b981" }
            ]
          }
        },
        {
          short: "Itô's Lemma",
          chapter: "technique",
          title: "The Itô Correction Term (1/2 σ² S² f'')",
          body: [
            "Given a twice-differentiable payoff function f(S_t, t), Taylor expansion gives df = f_t dt + f_S dS + 1/2 f_{SS} (dS)².",
            "In classical calculus, (dt)² and dt·dB are discarded, and (dB)² is set to zero. But in stochastic calculus, (dB_t)² = dt!",
            "This extra non-zero term 1/2 σ² S² f_{SS} dt accounts for convexity and prevents systematic arbitrage in derivatives pricing."
          ],
          callout: { kind: "formula", text: "df(S_t, t) = (∂f/∂t + μS ∂f/∂S + 1/2 σ² S² ∂²f/∂S²) dt + σS ∂f/∂S dB_t" },
          changes: ["+ Quadratic variation term active", "+ Convexity drag quantified"],
          metrics: { drift: "μ = 0.08", diffusion: "σ = 0.22", quad_var: "(dB)² = dt", itô_term: "Convexity +0.024" },
          scene: {
            entities: [
              { id: "sde", type: "block", x: -6, y: 0, color: "orange", label: ["Asset SDE", "dS_t"], sub: "Underlying" },
              { id: "taylor", type: "block", x: 2, y: -4, color: "purple", label: ["Taylor 2nd", "1/2 f''(dS)²"], sub: "Convexity Engine" },
              { id: "ito", type: "block", x: 2, y: 4, color: "yellow", label: ["Quadratic Var", "(dB_t)² = dt"], sub: "Deterministic Push" },
              { id: "derivative", type: "db", x: 10, y: 0, color: "green", label: "Option df(S,t)", sub: "Martingale Price" }
            ],
            links: [
              { from: "sde", to: "taylor", label: "dS" },
              { from: "taylor", to: "ito", label: "(dS)²" },
              { from: "ito", to: "derivative", label: "df_t" }
            ],
            flows: [
              { from: "sde", to: "taylor", color: "#3b82f6" },
              { from: "ito", to: "derivative", color: "#10b981" }
            ]
          }
        }
      ]
    },
    "latency-fpga": {
      title: "Ultra-Low Latency Kernel Bypass & FPGA Pipeline",
      subtitle: "Tick-to-trade execution in under 450 nanoseconds using Solarflare Onload and Xilinx Ultrascale+ FPGAs.",
      metrics: ["wire_latency", "parser_time", "order_gen", "jitter"],
      goals: [
        { text: "Bypass OS kernel network stack using Solarflare OpenOnload and DPDK", step: 1 },
        { text: "Parse ITCH/OOU binary feeds in FPGA programmable logic", step: 2 },
        { text: "Execute trigger logic and emit OUCH cancel/replace packets in sub-microsecond time", step: 3 }
      ],
      steps: [
        {
          short: "Optical Tap",
          chapter: "architecture",
          title: "Optical Tap & Physical Layer Transceiver (10G/25G)",
          body: [
            "In high-frequency trading, market data packets enter the colocation rack directly from exchange fiber via optical splitters.",
            "Packets arrive at the SFP28 optical transceiver and enter the MAC layer of an FPGA without touching the operating system bus.",
            "Zero memory copying (zero-copy) and dedicated cut-through architecture ensure minimum transit latency."
          ],
          callout: { kind: "latency", text: "Standard Linux kernel networking takes 12-25 microseconds. Kernel bypass reduces this to 1.8 microseconds. FPGA cut-through parsing achieves under 450 nanoseconds tick-to-trade." },
          changes: ["+ Optical bypass connected", "+ 10G SFP28 PHY initialized"],
          metrics: { wire_latency: "45 ns", parser_time: "78 ns", order_gen: "120 ns", jitter: "±4 ns" },
          scene: {
            entities: [
              { id: "fiber", type: "device", x: -9, y: 0, label: "Exchange Feed", sub: "NASDAQ ITCH 5.0" },
              { id: "phy", type: "block", x: -3, y: 0, color: "blue", label: ["10G/25G PHY", "SFP28 Optical"], sub: "Layer 1 Transceiver" },
              { id: "fpga", type: "block", x: 4, y: 0, color: "orange", label: ["Xilinx FPGA", "UltraScale+"], sub: "Logic Pipeline" },
              { id: "ouch", type: "db", x: 10, y: 0, color: "green", label: "Exchange Gateway", sub: "OUCH 4.2 DMA" }
            ],
            links: [
              { from: "fiber", to: "phy", label: "Optical 850nm" },
              { from: "phy", to: "fpga", label: "AXI-Stream" },
              { from: "fpga", to: "ouch", label: "Direct PCIe DMA" }
            ],
            flows: [
              { from: "fiber", to: "phy", color: "#3b82f6" },
              { from: "phy", to: "fpga", color: "#3b82f6" },
              { from: "fpga", to: "ouch", color: "#10b981" }
            ]
          }
        },
        {
          short: "FPGA Parser",
          chapter: "technique",
          title: "Hardware Bit-Level Binary Parser & Book Construction",
          body: [
            "The FPGA parser reads incoming Ethernet frames byte-by-byte in pipeline registers on every clock cycle (322 MHz clock).",
            "ITCH message types (Add Order 'A', Execute 'E', Cancel 'X') are decoded in 2 clock cycles.",
            "Top-of-book BBO (Best Bid & Offer) registers are updated in BRAM (Block RAM) with zero cache misses."
          ],
          callout: { kind: "insight", text: "Because FPGA logic is truly parallel, BBO update and trigger condition evaluation occur simultaneously in hardware rather than sequentially on a CPU core." },
          changes: ["+ BRAM book state updated", "+ Trigger logic armed"],
          metrics: { wire_latency: "45 ns", parser_time: "52 ns", order_gen: "85 ns", jitter: "±2 ns" },
          scene: {
            entities: [
              { id: "phy", type: "block", x: -8, y: 0, color: "blue", label: ["Ethernet Frame", "Raw Bytes"], sub: "MAC RX" },
              { id: "parser", type: "block", x: -1, y: -4, color: "purple", label: ["VHDL Parser", "ITCH Decoder"], sub: "Pipelined 322MHz" },
              { id: "bram", type: "db", x: -1, y: 4, color: "yellow", label: "BRAM L2 Book", sub: "Zero-Latency State" },
              { id: "trigger", type: "block", x: 7, y: 0, color: "orange", label: ["Order Trigger", "Spread Arb"], sub: "Combinatorial Logic" }
            ],
            links: [
              { from: "phy", to: "parser", label: "64-bit word" },
              { from: "parser", to: "bram", label: "Write BBO" },
              { from: "bram", to: "trigger", label: "Price Delta" }
            ],
            flows: [
              { from: "phy", to: "parser", color: "#3b82f6" },
              { from: "parser", to: "bram", color: "#eab308" },
              { from: "bram", to: "trigger", color: "#10b981" }
            ]
          }
        }
      ]
    },
    "autonomous-swarms": {
      title: "Autonomous Multi-Agent Trading Swarms",
      subtitle: "Multi-agent LLM consensus architectures with real-time risk arbiters and C++ guardrails.",
      metrics: ["agents", "consensus", "varRisk", "activeAlpha", "latency"],
      goals: [
        { text: "Architect specialized agent roles (Macro, Factor, Risk)", step: 1 },
        { text: "Implement Bayesian debate consensus mechanisms", step: 2 },
        { text: "Enforce deterministic C++ risk guardrails over LLM allocations", step: 3 }
      ],
      steps: [
        {
          short: "Agent Debate",
          chapter: "problem",
          title: "Specialized Role-Based Agent Swarms",
          body: [
            "A single LLM cannot trade reliably. Modern institutions deploy specialized multi-agent swarms: a <strong>Macro Economist Agent</strong> analyzing central bank transcripts, a <strong>Factor Quant Agent</strong> computing cross-sectional momentum, and a <strong>Risk Auditor Agent</strong> calculating tail risk.",
            "Each agent produces structured conviction vectors and debates live strategy allocations."
          ],
          callout: { kind: "insight", text: "Role specialization prevents prompt dilution and isolates qualitative reasoning from quantitative mathematical bounds." },
          changes: ["+ Macro Agent (Bullish +0.65)", "+ Quant Agent (Neutral +0.10)", "+ Risk Agent (High Vol Warning)"],
          metrics: { agents: "3 Active", consensus: "68%", varRisk: "1.8%", activeAlpha: "+4.2%", latency: "240 ms" },
          scene: {
            entities: [
              { id: "macro", type: "device", x: -8, y: -6, label: "Macro Agent", sub: "FOMC Parser" },
              { id: "quant", type: "device", x: -8, y: 0, label: "Factor Agent", sub: "Momentum Screen" },
              { id: "risk", type: "device", x: -8, y: 6, label: "Risk Agent", sub: "VaR Auditor" },
              { id: "arbiter", type: "block", x: 4, y: 0, color: "purple", glyph: "server", label: ["Consensus", "Arbiter"], sub: "Bayesian Swarm" }
            ],
            links: [
              { from: "macro", to: "arbiter", label: "Macro View" },
              { from: "quant", to: "arbiter", label: "Factor Vector" },
              { from: "risk", to: "arbiter", label: "Risk Gating" }
            ],
            flows: [
              { from: "macro", to: "arbiter", color: "#10b981" },
              { from: "quant", to: "arbiter", color: "#3b82f6" },
              { from: "risk", to: "arbiter", color: "#ef4444" }
            ]
          }
        },
        {
          short: "C++ Guardrails",
          chapter: "solution",
          title: "Deterministic Execution Guardrails",
          body: [
            "LLMs must never send orders directly to exchanges. The Consensus Arbiter's suggested allocation is passed to a deterministic C++ execution core.",
            "Hard mathematical bounds strictly clip position size, enforce drawdown limits, verify portfolio margin, and execute orders via zero-copy lock-free ring buffers."
          ],
          callout: { kind: "alert", text: "Never trust LLM outputs for order sizing. Deterministic guardrails prevent hallucinations from causing financial catastrophe." },
          changes: ["✓ C++ Guardrail validated", "✓ Position clipped within 99% CVaR", "+ Execution sent to venue"],
          metrics: { agents: "3 Active", consensus: "84%", varRisk: "1.2%", activeAlpha: "+5.1%", latency: "14 μs" },
          scene: {
            entities: [
              { id: "arbiter", type: "block", x: -6, y: 0, color: "purple", glyph: "server", label: ["Consensus", "Arbiter"], sub: "Validated Signal" },
              { id: "guard", type: "block", x: 2, y: 0, color: "orange", glyph: "server", label: ["C++ Hard", "Guardrail"], sub: "Max Drawdown Gating" },
              { id: "exchange", type: "db", x: 10, y: 0, color: "green", label: "Exchange Venue", sub: "Low-Latency Gateway" }
            ],
            links: [
              { from: "arbiter", to: "guard", label: "Signal Vector" },
              { from: "guard", to: "exchange", label: "Verified Order" }
            ],
            flows: [
              { from: "arbiter", to: "guard", color: "#a855f7" },
              { from: "guard", to: "exchange", color: "#10b981", label: "Sub-microsecond" }
            ]
          }
        },
        {
          short: "Recap",
          chapter: "recap",
          title: "Key Takeaways: AI Trading Frontiers",
          body: [
            "Autonomous multi-agent architectures unlock semantic alternative data alpha at scale.",
            "By coupling high-level LLM reasoning swarms with ultra-fast deterministic C++ risk layers, quantitative funds build resilient, adaptive trading operations."
          ],
          callout: { kind: "insight", text: "The future of quantitative finance is hybrid: LLMs generate the creative alpha hypotheses while convex optimization and low-latency C++ enforce survival." },
          changes: ["✓ Swarm architecture live in production", "✓ Full curriculum verified"],
          metrics: { agents: "3 Active", consensus: "92%", varRisk: "1.1%", activeAlpha: "+5.4%", latency: "12 μs" },
          scene: {
            entities: [
              { id: "swarm", type: "block", x: 0, y: 0, color: "green", glyph: "server", label: ["Hybrid AI", "Quant Core"], sub: "Operational" }
            ],
            links: [],
            flows: []
          }
        }
      ]
    }
  };

  // State Manager
  let state = {
    lessonId: "lob-mechanics",
    stepIndex: 0,
    paused: false,
    theme: localStorage.getItem("qt:theme") || "light"
  };

  function getLesson(id) {
    return LESSONS.find((l) => l.id === id) || LESSONS[0];
  }

  function getLessonData(id) {
    if (LESSON_DATA[id]) return LESSON_DATA[id];
    // Fallback template for any lesson
    const meta = getLesson(id);
    return {
      title: meta.title,
      subtitle: `Rigorous mathematical and algorithmic breakdown of ${meta.title}.`,
      metrics: ["signal", "risk", "sharpe", "latency"],
      goals: [
        { text: `Understand the core theoretical principles of ${meta.title}`, step: 1 },
        { text: `Calibrate quantitative parameters under empirical market noise`, step: 2 },
        { text: `Deploy production algorithms with strict risk controls`, step: 3 }
      ],
      steps: [
        {
          short: "Formulation",
          chapter: "problem",
          title: `Mathematical Formulation: ${meta.title}`,
          body: [
            `Quantitative analysis of ${meta.title} begins by formalizing market dynamics into testable hypotheses.`,
            `We establish probability bounds, calibrate empirical covariance matrices, and account for non-stationary market regimes.`
          ],
          callout: { kind: "insight", text: "In quantitative trading, theory without empirical validation is fantasy, and empirical patterns without risk controls fail when regimes shift." },
          changes: [`+ Model initialized for ${meta.title}`, "+ Benchmark tracking active"],
          metrics: { signal: "+0.042 IC", risk: "2.1% σ", sharpe: "1.45", latency: "1.8 μs" },
          scene: {
            entities: [
              { id: "data", type: "device", x: -8, y: 0, label: "Market Data", sub: "Tick & Book Feed" },
              { id: "engine", type: "block", x: 0, y: 0, color: "orange", glyph: "server", label: [meta.title.slice(0, 10), "Engine"], sub: "Quantitative Model" },
              { id: "output", type: "db", x: 8, y: 0, color: "green", label: "Alpha Signal", sub: "Target Portfolio" }
            ],
            links: [
              { from: "data", to: "engine", label: "Ingest" },
              { from: "engine", to: "output", label: "Weights" }
            ],
            flows: [
              { from: "data", to: "engine", color: "#3b82f6" },
              { from: "engine", to: "output", color: "#10b981" }
            ]
          }
        },
        {
          short: "Backtest Reality",
          chapter: "technique",
          title: "Purged Simulation & Slippage Calibration",
          body: [
            "We test the strategy under realistic market microstructure friction: queue wait times, Almgren-Chriss market impact, and borrow costs for short positions.",
            "Purged cross-validation strictly isolates overlapping holding periods to eliminate lookahead bias."
          ],
          callout: { kind: "tip", text: "Always verify performance using Deflated Sharpe Ratio (DSR) to correct for multiple testing selection bias." },
          changes: ["~ Slippage modeled: 1.2 bps", "~ Lookahead leakage purged", "+ Deflated Sharpe: 2.14"],
          metrics: { signal: "+0.068 IC", risk: "1.4% σ", sharpe: "2.14", latency: "1.2 μs" },
          scene: {
            entities: [
              { id: "engine", type: "block", x: -4, y: 0, color: "orange", glyph: "server", label: [meta.title.slice(0, 10), "Engine"], sub: "Simulating" },
              { id: "risk", type: "block", x: 4, y: 0, color: "purple", glyph: "server", label: ["Barra Risk", "Gating"], sub: "Factor Neutral" }
            ],
            links: [
              { from: "engine", to: "risk", label: "Validate" }
            ],
            flows: [
              { from: "engine", to: "risk", color: "#f59e0b" }
            ]
          }
        },
        {
          short: "Production",
          chapter: "recap",
          title: "Execution Deployment & Risk Controls",
          body: [
            `The strategy is deployed into low-latency C++ execution containers, routing child orders through dark pools and lit books.`,
            `Continuous VaR and stress testing guard against tail risk drawdowns.`
          ],
          callout: { kind: "insight", text: "Institutional quant platforms survive because risk management has total veto power over trading signals." },
          changes: ["✓ Live in production", "✓ Tail risk bound within 99% CVaR"],
          metrics: { signal: "+0.065 Net IC", risk: "1.1% σ", sharpe: "2.42", latency: "0.8 μs" },
          scene: {
            entities: [
              { id: "engine", type: "block", x: 0, y: 0, color: "green", glyph: "server", label: [meta.title.slice(0, 10), "Live"], sub: "Executing" }
            ],
            links: [],
            flows: []
          }
        }
      ]
    };
  }

  // Isometric SVG Stage Renderer
  
  function formatMath(str) {
    if (!str) return "";
    let s = String(str);
    // Replace Greek letters and math operators
    s = s.replace(/\\delta/g, "δ")
         .replace(/\\gamma/g, "γ")
         .replace(/\\sigma/g, "σ")
         .replace(/\\mu/g, "μ")
         .replace(/\\alpha/g, "α")
         .replace(/\\beta/g, "β")
         .replace(/\\lambda/g, "λ")
         .replace(/\\tau/g, "τ")
         .replace(/\\rho/g, "ρ")
         .replace(/\\kappa/g, "κ")
         .replace(/\\theta/g, "θ")
         .replace(/\\Delta/g, "Δ")
         .replace(/\\Omega/g, "Ω")
         .replace(/\\infty/g, "∞")
         .replace(/\\approx/g, "≈")
         .replace(/\\pm/g, "±")
         .replace(/\\ge/g, "≥")
         .replace(/\\le/g, "≤")
         .replace(/\\ne/g, "≠")
         .replace(/\\cdot/g, "·")
         .replace(/\\times/g, "×");

    // Replace $...$ blocks with styled spans
    s = s.replace(/\$([^$]+)\$/g, (m, p1) => `<span class="math">${p1.trim()}</span>`);
    return s;
  }

  function renderSvgStage(step) {
    const scene = step.scene || { entities: [], links: [], flows: [] };
    const entMap = {};

    // 1. Entities
    let entsHtml = "";
    scene.entities.forEach((ent) => {
      const [sx, sy] = j(ent.x, ent.y, ent.lift || 0);
      entMap[ent.id] = [sx, sy];
      const color = ent.color || "orange";
      const c = vr[color] || vr.orange;

      const mainLabel = Array.isArray(ent.label) ? ent.label[0] : (ent.label || "");
      const secLabel = Array.isArray(ent.label) ? (ent.label[1] || "") : "";

      if (ent.type === "block") {
        // Dynamic prism width based on label
        const maxLen = Math.max(mainLabel.length, secLabel.length);
        const bw = maxLen > 8 ? 44 : 36;

        entsHtml += `
          <g class="ent-block" transform="translate(${sx}, ${sy})">
            <!-- Shadow -->
            <ellipse cx="0" cy="18" rx="${bw + 4}" ry="16" fill="#1c1a17" opacity="0.25" filter="url(#blur-md)"/>
            <!-- 3D Prism Base -->
            <path d="M-${bw} 0 L0 16 L${bw} 0 L${bw} 25 L0 41 L-${bw} 25 Z" fill="url(#g-${color}-side)" stroke="${k}" stroke-width="1.8" stroke-linejoin="round"/>
            <path d="M0 18 L0 46" stroke="${k}" stroke-width="1.8"/>
            <!-- Top Face -->
            <path d="M-${bw} 0 L0 -16 L${bw} 0 L0 16 Z" fill="url(#g-${color}-top)" stroke="${k}" stroke-width="1.8" stroke-linejoin="round"/>
            <!-- Bevel Highlight -->
            <path d="M-${bw - 2} 0 L0 14 L${bw - 2} 0" fill="none" stroke="#ffffff" stroke-opacity="0.75" stroke-width="1.5" stroke-linecap="round"/>
            <!-- Label -->
            <text x="0" y="3.5" text-anchor="middle" font-family="JetBrains Mono" font-size="10.5" font-weight="700" fill="${k}">${mainLabel}</text>
            <!-- Subtitle Pill -->
            ${ent.sub ? (() => {
              const pw = Math.max(68, Math.round(ent.sub.length * 6.6) + 16);
              const hpw = Math.round(pw / 2);
              return `
                <g transform="translate(0, 36)">
                  <rect x="-${hpw}" y="2" width="${pw}" height="18" rx="9" fill="${_r}"/>
                  <rect x="-${hpw}" y="0" width="${pw}" height="18" rx="9" fill="#fbf6ef" stroke="${k}" stroke-width="1.2"/>
                  <text x="0" y="12" text-anchor="middle" font-family="JetBrains Mono" font-size="8.8" font-weight="700" fill="#6f6961">${ent.sub}</text>
                </g>
              `;
            })() : ""}
          </g>
        `;
      } else if (ent.type === "db") {
        // Cylinder Database Node
        const dw = Math.max(28, Math.round(mainLabel.length * 3.8) + 6);
        entsHtml += `
          <g class="ent-db" transform="translate(${sx}, ${sy})">
            <ellipse cx="0" cy="18" rx="${dw + 4}" ry="14" fill="#1c1a17" opacity="0.25" filter="url(#blur-md)"/>
            <path d="M-${dw} 0 V24 A${dw} 12 0 0 0 ${dw} 24 V0 Z" fill="url(#g-${color}-side)" stroke="${k}" stroke-width="1.8" stroke-linejoin="round"/>
            <ellipse cx="0" cy="0" rx="${dw}" ry="12" fill="url(#g-${color}-top)" stroke="${k}" stroke-width="1.8"/>
            <ellipse cx="0" cy="0" rx="${dw - 2}" ry="10" fill="url(#cyl-sheen)"/>
            <text x="0" y="16" text-anchor="middle" font-family="JetBrains Mono" font-size="10" font-weight="700" fill="${k}">${mainLabel}</text>
            ${ent.sub ? `<text x="0" y="32" text-anchor="middle" font-family="JetBrains Mono" font-size="8.5" font-weight="600" fill="#6f6961">${ent.sub}</text>` : ""}
          </g>
        `;
      } else {
        // Device / Client / Exchange Node with dynamic sizing
        const dw = Math.max(54, Math.round(mainLabel.length * 7) + 18);
        const hdw = Math.round(dw / 2);
        entsHtml += `
          <g class="ent-device" transform="translate(${sx}, ${sy})">
            <ellipse cx="0" cy="14" rx="${hdw + 2}" ry="12" fill="#1c1a17" opacity="0.2" filter="url(#blur-sm)"/>
            <rect x="-${hdw}" y="-13" width="${dw}" height="26" rx="6" fill="#fbf6ef" stroke="${k}" stroke-width="1.8"/>
            <text x="0" y="4" text-anchor="middle" font-family="JetBrains Mono" font-size="9.8" font-weight="700" fill="${k}">${mainLabel}</text>
            ${ent.sub ? (() => {
              const pw = Math.max(68, Math.round(ent.sub.length * 6.5) + 16);
              const hpw = Math.round(pw / 2);
              return `
                <g transform="translate(0, 22)">
                  <rect x="-${hpw}" y="2" width="${pw}" height="16" rx="8" fill="${_r}"/>
                  <rect x="-${hpw}" y="0" width="${pw}" height="16" rx="8" fill="#fbf6ef" stroke="${k}" stroke-width="1.2"/>
                  <text x="0" y="11" text-anchor="middle" font-family="JetBrains Mono" font-size="8.5" font-weight="700" fill="#6f6961">${ent.sub}</text>
                </g>
              `;
            })() : ""}
          </g>
        `;
      }
    });

    // 2. Links
    let linksHtml = "";
    (scene.links || []).forEach((link) => {
      const p1 = entMap[link.from] || [0, 0];
      const p2 = entMap[link.to] || [50, 50];
      const mx = (p1[0] + p2[0]) / 2;
      const my = (p1[1] + p2[1]) / 2;

      linksHtml += `
        <g class="link-group">
          <line x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}" stroke="${k}" stroke-width="1.8" stroke-dasharray="4 4" opacity="0.65" marker-end="url(#arrow)"/>
          ${link.label ? (() => {
            const lw = Math.max(54, Math.round(link.label.length * 6.5) + 16);
            const hlw = Math.round(lw / 2);
            return `
              <g transform="translate(${mx}, ${my - 8})">
                <rect x="-${hlw}" y="2" width="${lw}" height="16" rx="8" fill="${_r}"/>
                <rect x="-${hlw}" y="0" width="${lw}" height="16" rx="8" fill="#fbf6ef" stroke="${k}" stroke-width="1"/>
                <text x="0" y="11" text-anchor="middle" font-family="JetBrains Mono" font-size="8.8" font-weight="700" fill="${k}">${link.label}</text>
              </g>
            `;
          })() : ""}
        </g>
      `;
    });

    // 3. Traffic Packets
    let packetsHtml = "";
    if (!state.paused) {
      (scene.flows || []).forEach((flow, i) => {
        const p1 = entMap[flow.from] || [0, 0];
        const p2 = entMap[flow.to] || [50, 50];
        const d = `M${p1[0]},${p1[1]} L${p2[0]},${p2[1]}`;
        const color = flow.color || "#10b981";

        packetsHtml += `
          <g class="flow-pkt">
            <circle r="4.5" fill="${color}" stroke="${k}" stroke-width="1.4">
              <animateMotion path="${d}" dur="1.5s" repeatCount="indefinite" begin="${(i * 0.35).toFixed(2)}s"/>
            </circle>
          </g>
        `;
      });
    }

    return `
      <svg class="stage-svg" viewBox="-290 -135 580 270" xmlns="http://www.w3.org/2000/svg" role="img">
        <defs>
          ${Object.entries(vr).map(([t, n]) => `
            <linearGradient id="g-${t}-top" x1="0" y1="0" x2="0.35" y2="1">
              <stop offset="0" stop-color="${n.top[0]}"/><stop offset="1" stop-color="${n.top[1]}"/>
            </linearGradient>
            <linearGradient id="g-${t}-side" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="${n.side[0]}"/><stop offset="1" stop-color="${n.side[1]}"/>
            </linearGradient>
          `).join("")}
          <linearGradient id="cyl-sheen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#fff" stop-opacity="0"/>
            <stop offset=".3" stop-color="#fff" stop-opacity=".35"/>
            <stop offset=".55" stop-color="#fff" stop-opacity=".05"/>
            <stop offset="1" stop-color="#4b2f6b" stop-opacity=".08"/>
          </linearGradient>
          <filter id="blur-sm" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2"/></filter>
          <filter id="blur-md" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"/></filter>
          <marker id="arrow" viewBox="0 0 10 10" refX="8.6" refY="5" markerWidth="5.2" markerHeight="5.2" orient="auto-start-reverse" markerUnits="strokeWidth">
            <path d="M1,1.2 L9,5 L1,8.8 Z" fill="${k}" stroke="${k}" stroke-width="1" stroke-linejoin="round"/>
          </marker>
          <pattern id="iso-grid" patternUnits="userSpaceOnUse" x="0" y="-7" width="28" height="14">
            <path d="M0 7 L14 0 L28 7 L14 14 Z" fill="none" stroke="#a8916f" stroke-opacity=".28" stroke-width=".8"/>
          </pattern>
          <radialGradient id="grid-fade" cx="0" cy="0" r="260" fx="0" fy="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#fff"/>
            <stop offset=".45" stop-color="#fff" stop-opacity=".95"/>
            <stop offset=".8" stop-color="#fff" stop-opacity=".35"/>
            <stop offset="1" stop-color="#fff" stop-opacity="0"/>
          </radialGradient>
          <mask id="grid-mask">
            <rect x="-300" y="-150" width="600" height="300" fill="url(#grid-fade)"/>
          </mask>
        </defs>

        <!-- Centered Isometric Diamond Grid with Radial Vignette -->
        <rect x="-300" y="-150" width="600" height="300" fill="url(#iso-grid)" mask="url(#grid-mask)"/>

        <!-- Links -->
        <g class="layer-links">${linksHtml}</g>

        <!-- Entities -->
        <g class="layer-entities">${entsHtml}</g>

        <!-- Moving Traffic Packets -->
        <g class="layer-packets">${packetsHtml}</g>
      </svg>
    `;
  }
  function renderHud(metrics) {
    if (!metrics) return "";
    return Object.entries(metrics).map(([key, val]) => `
      <div class="chip" data-k="${key}" data-level="good">
        <span class="chip__label">${icon("gear")} ${key.toUpperCase()}</span>
        <span class="chip__value">${val}</span>
      </div>
    `).join("");
  }

  // Render Main View
  function render() {
    // Update Mastered Set
    if (!state.mastered) {
      try {
        state.mastered = new Set(JSON.parse(localStorage.getItem("quant_mastered") || "[]"));
      } catch (e) {
        state.mastered = new Set();
      }
    }
    state.mastered.add(state.lessonId);
    try {
      localStorage.setItem("quant_mastered", JSON.stringify([...state.mastered]));
    } catch (e) {}

    const progressPctEl = document.getElementById("progress-pct");
    const progressBarEl = document.getElementById("progress-bar-fill");
    if (progressPctEl && progressBarEl) {
      const doneCount = state.mastered.size;
      const totalCount = LESSONS.length;
      const pct = Math.round((doneCount / totalCount) * 100);
      progressPctEl.textContent = `${doneCount} / ${totalCount} (${pct}%)`;
      progressBarEl.style.width = `${pct}%`;
    }

    const meta = getLesson(state.lessonId);
    const data = getLessonData(state.lessonId);
    const step = data.steps[state.stepIndex] || data.steps[0];
    const totalSteps = data.steps.length;

    // 1. Sidebar Modules
    const courseNav = document.getElementById("course");
    if (courseNav) {
      courseNav.innerHTML = MODULES.map((m) => {
        const isOpen = m.lessons.some((l) => l.id === state.lessonId);
        return `
          <section class="mod ${isOpen ? "is-open" : ""}" data-mod="${m.id}">
            <button class="mod__head" data-mod="${m.id}" aria-expanded="${isOpen}">
              <span class="mod__chev">${icon("chevronRight")}</span>
              <span class="mod__title" style="color: var(--ink); font-weight: 700;">${m.num}. ${m.title}</span>
              <span class="mod__count">${m.lessons.length}</span>
            </button>
            <div class="mod__body" style="${isOpen ? "display: block;" : "display: none;"}">
              <ul class="mod__lessons">
                ${m.lessons.map((l) => {
                  const isActive = l.id === state.lessonId;
                  return `
                    <li class="lesson ${isActive ? "is-active" : ""}" data-lesson="${l.id}">
                      <a href="#/${l.id}" data-id="${l.id}">
                        <span class="lesson__markbox">${icon(isActive ? "circleCheck" : "file")}</span>
                        <span class="lesson__title" style="${isActive ? "font-weight: 700; color: var(--ink);" : ""}">${l.title}</span>
                      </a>
                    </li>
                  `;
                }).join("")}
              </ul>
            </div>
          </section>
        `;
      }).join("");

      // Mod accordion listeners
      courseNav.querySelectorAll(".mod__head").forEach((btn) => {
        btn.onclick = () => {
          const mod = btn.closest(".mod");
          const open = mod.classList.toggle("is-open");
          btn.setAttribute("aria-expanded", open);
          mod.querySelector(".mod__body").style.display = open ? "block" : "none";
        };
      });

      courseNav.querySelectorAll(".lesson a").forEach((link) => {
        link.onclick = (e) => {
          e.preventDefault();
          const id = link.getAttribute("data-id");
          state.lessonId = id;
          state.stepIndex = 0;
          render();
        };
      });
    }

    // 2. Lesson Header
    const headEl = document.getElementById("head");
    if (headEl) {
      headEl.innerHTML = `
        <div class="lesson-head__row">
          <div class="crumb"><span style="color: #059669; font-weight: 700;">${meta.module.num}. ${meta.module.title}</span> / Lesson ${meta.index} of ${meta.of}</div>
          <div class="tags">
            <span class="tag tag--sand">${icon("clock")} 10 min</span>
            <span class="tag tag--mint">${icon("check")} Advanced</span>
            <span class="tag tag--violet">${icon("file")} ${totalSteps} steps</span>
          </div>
        </div>
        <h1 class="title">${data.title}</h1>
        <p class="subtitle">${data.subtitle}</p>
      `;
    }

    // 3. Stage HUD, Tools, Canvas
    const hudEl = document.getElementById("hud");
    if (hudEl) hudEl.innerHTML = renderHud(step.metrics);

    const canvasEl = document.getElementById("canvas");
    if (canvasEl) canvasEl.innerHTML = renderSvgStage(step);

    // 4. Horizontal Timeline
    const tlEl = document.getElementById("timeline");
    if (tlEl) {
      tlEl.innerHTML = `
        <div class="timeline__head">
          <span class="eyebrow">IN THIS LESSON</span>
          <span class="timeline__count" style="font-family: JetBrains Mono; font-weight: 700;">Step ${state.stepIndex + 1} of ${totalSteps}</span>
        </div>
        <div class="timeline__track" style="--n: ${totalSteps}">
          <div class="timeline__rail"><span style="width: ${(state.stepIndex / (totalSteps - 1)) * 100}%;"></span></div>
          <ol class="timeline__steps">
            ${data.steps.map((st, idx) => `
              <li class="${idx === state.stepIndex ? "is-current" : idx < state.stepIndex ? "is-done" : ""}">
                <button data-idx="${idx}" title="${st.title}">
                  <span class="timeline__dot chapter-dot--${st.chapter === "problem" ? "orange" : st.chapter === "technique" ? "blue" : "green"}">${idx + 1}</span>
                  <span class="timeline__label">${st.short}</span>
                </button>
              </li>
            `).join("")}
          </ol>
        </div>
      `;

      tlEl.querySelectorAll("button[data-idx]").forEach((btn) => {
        btn.onclick = () => {
          state.stepIndex = parseInt(btn.getAttribute("data-idx"), 10);
          render();
        };
      });
    }

    // 5. Right Guide & Narrative
    const guideEl = document.getElementById("guide");
    if (guideEl) {
      guideEl.innerHTML = `
        <div class="guide__meta">
          <span class="eyebrow">STEP ${state.stepIndex + 1} / ${totalSteps}</span>
          <div class="guide__meta-end"><span class="chapter chapter--${step.chapter === "problem" ? "orange" : step.chapter === "technique" ? "blue" : "green"}">${step.chapter.toUpperCase()}</span></div>
        </div>
        <div class="guide__content">
          <h2 class="guide__title">${step.title}</h2>
          <div class="guide__body">
            ${step.body.map((p) => `<p>${formatMath(p)}</p>`).join("")}
          </div>
          ${step.callout ? `
            <div class="callout callout--${step.callout.kind || "insight"}" style="margin: 18px 0; padding: 14px 16px; border-radius: 10px; background: #e2f2d7; border: 1.5px solid #7fc278;">
              <div class="callout__head" style="font-family: JetBrains Mono; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                ${icon("bulb")} ${step.callout.kind.toUpperCase()}
              </div>
              <p style="margin: 0; font-size: 0.92rem; line-height: 1.5; color: var(--ink);">${formatMath(step.callout.text)}</p>
            </div>
          ` : ""}
          ${step.changes ? `
            <div class="changes" style="margin: 16px 0;">
              <div class="eyebrow" style="margin-bottom: 8px;">WHAT CHANGED</div>
              <ul style="list-style: none; padding: 0; margin: 0; font-family: JetBrains Mono; font-size: 0.88rem; line-height: 1.6;">
                ${step.changes.map((c) => `<li style="margin-bottom: 4px;">${formatMath(c)}</li>`).join("")}
              </ul>
            </div>
          ` : ""}
        </div>
        <div class="guide__nav">
          <button class="btn-ghost" id="step-back" ${state.stepIndex === 0 ? "disabled" : ""}>
            ${icon("arrowLeft")} Back
          </button>
          <button class="btn-pop btn-next" id="step-next">
            <span class="btn-next__label">${state.stepIndex === totalSteps - 1 ? "Next Lesson" : "Next"}</span>
            ${icon(state.stepIndex === totalSteps - 1 ? "check" : "arrowRight")}
          </button>
        </div>
        <div class="guide__hint">
          ${icon("keyboard")} <span><kbd>←</kbd> <kbd>→</kbd> step · <kbd>R</kbd> replay · <kbd>Space</kbd> pause</span>
        </div>
      `;

      document.getElementById("step-back").onclick = () => {
        if (state.stepIndex > 0) {
          state.stepIndex--;
          render();
        }
      };

      document.getElementById("step-next").onclick = () => {
        if (state.stepIndex < totalSteps - 1) {
          state.stepIndex++;
          render();
        } else {
          // Advance to next lesson
          const curIdx = LESSONS.findIndex((l) => l.id === state.lessonId);
          if (curIdx < LESSONS.length - 1) {
            state.lessonId = LESSONS[curIdx + 1].id;
            state.stepIndex = 0;
            render();
          }
        }
      };
    }

    // 6. Goals Checklist
    const goalsEl = document.getElementById("goals");
    if (goalsEl) {
      goalsEl.innerHTML = `
        <div class="eyebrow" style="margin-bottom: 10px;">YOU'LL LEARN</div>
        <ul style="list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; font-size: 0.88rem;">
          ${data.goals.map((g, i) => {
            const isHit = state.stepIndex >= g.step;
            return `
              <li style="display: flex; align-items: flex-start; gap: 8px; color: ${isHit ? "var(--ink)" : "var(--muted)"};">
                <span style="color: ${isHit ? "#10b981" : "var(--line)"}; font-weight: 800;">${icon("check")}</span>
                <span>${g.text}</span>
              </li>
            `;
          }).join("")}
        </ul>
      `;
    }
  }

  // Keyboard Shortcuts
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      if (state.stepIndex > 0) {
        state.stepIndex--;
        render();
      }
    } else if (e.key === "ArrowRight") {
      const data = getLessonData(state.lessonId);
      if (state.stepIndex < data.steps.length - 1) {
        state.stepIndex++;
        render();
      }
    } else if (e.key === "r" || e.key === "R") {
      render();
    } else if (e.key === " ") {
      state.paused = !state.paused;
      render();
      e.preventDefault();
    }
  });

  // Global Tool Buttons
  
  // Global Event Listeners & Interactive Controls
  document.addEventListener("DOMContentLoaded", () => {
    // 1. Replay & Pause
    const replayBtn = document.getElementById("replay");
    if (replayBtn) replayBtn.onclick = () => render();

    const pauseBtn = document.getElementById("pause");
    if (pauseBtn) {
      pauseBtn.onclick = () => {
        state.paused = !state.paused;
        pauseBtn.innerHTML = `${icon(state.paused ? "play" : "pause")}<span>${state.paused ? "Play" : "Pause"}</span>`;
        render();
      };
    }

    // 2. Expand / Fullscreen
    const expandBtn = document.getElementById("expand");
    if (expandBtn) {
      expandBtn.onclick = () => {
        const stage = document.querySelector(".stage");
        if (!stage) return;
        if (!document.fullscreenElement) {
          if (stage.requestFullscreen) stage.requestFullscreen().catch(() => stage.classList.toggle("is-expanded"));
          else stage.classList.toggle("is-expanded");
        } else {
          if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
        }
      };
    }

    // 3. Theme Toggle
    const themeBtn = document.getElementById("theme-btn");
    function updateThemeIcon() {
      const isDark = document.documentElement.dataset.theme === "dark";
      if (themeBtn) {
        themeBtn.innerHTML = isDark
          ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
          : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      }
    }
    if (themeBtn) {
      updateThemeIcon();
      themeBtn.onclick = () => {
        const isDark = document.documentElement.dataset.theme === "dark";
        if (isDark) {
          delete document.documentElement.dataset.theme;
          localStorage.setItem("quant_theme", "light");
        } else {
          document.documentElement.dataset.theme = "dark";
          localStorage.setItem("quant_theme", "dark");
        }
        updateThemeIcon();
        render();
      };
    }

    // 4. Mobile Drawer Controls
    const menuBtn = document.getElementById("menu-btn");
    const drawerClose = document.getElementById("drawer-close");
    const drawerBackdrop = document.getElementById("drawer-backdrop");
    const sidebar = document.getElementById("sidebar");

    function openDrawer() {
      if (sidebar) sidebar.classList.add("is-open");
      if (drawerBackdrop) drawerBackdrop.classList.add("is-open");
      if (menuBtn) menuBtn.setAttribute("aria-expanded", "true");
    }
    function closeDrawer() {
      if (sidebar) sidebar.classList.remove("is-open");
      if (drawerBackdrop) drawerBackdrop.classList.remove("is-open");
      if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    }
    if (menuBtn) menuBtn.onclick = openDrawer;
    if (drawerClose) drawerClose.onclick = closeDrawer;
    if (drawerBackdrop) drawerBackdrop.onclick = closeDrawer;

    // 5. Search Modal
    const searchModal = document.getElementById("search-modal");
    const searchOpen = document.getElementById("search-open");
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results");

    function openSearch() {
      if (!searchModal) return;
      searchModal.classList.add("is-open");
      if (searchInput) {
        searchInput.value = "";
        searchInput.focus();
        renderSearchResults("");
      }
    }
    function closeSearch() {
      if (searchModal) searchModal.classList.remove("is-open");
    }
    function renderSearchResults(query) {
      if (!searchResults) return;
      const q = (query || "").trim().toLowerCase();
      const matched = LESSONS.filter(l => !q || l.title.toLowerCase().includes(q) || l.module.title.toLowerCase().includes(q));
      searchResults.innerHTML = matched.map((l, i) => `
        <li class="search-result-item ${i === 0 ? "is-selected" : ""}" data-id="${l.id}">
          <div>
            <div class="item-title">${l.title}</div>
            <div class="item-mod">${l.module.num}. ${l.module.title}</div>
          </div>
          <span style="font-family: JetBrains Mono; font-size: 11px; color: var(--muted); font-weight: 700;">${icon("arrowRight")}</span>
        </li>
      `).join("");

      searchResults.querySelectorAll(".search-result-item").forEach(item => {
        item.onclick = () => {
          const id = item.getAttribute("data-id");
          closeSearch();
          state.lessonId = id;
          state.stepIndex = 0;
          location.hash = "#/" + id + "/1";
          render();
          closeDrawer();
        };
      });
    }

    if (searchOpen) searchOpen.onclick = openSearch;
    if (searchModal) {
      searchModal.onclick = (e) => {
        if (e.target === searchModal) closeSearch();
      };
    }
    if (searchInput) {
      searchInput.oninput = (e) => renderSearchResults(e.target.value);
      searchInput.onkeydown = (e) => {
        if (e.key === "Escape") closeSearch();
        if (e.key === "Enter") {
          const first = searchResults.querySelector(".search-result-item");
          if (first) first.click();
        }
      };
    }

    window.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSearch();
      } else if (e.key === "Escape" && searchModal && searchModal.classList.contains("is-open")) {
        closeSearch();
      }
    });

    // 6. Hash Router & URL Sync
    function syncFromHash() {
      if (location.hash && location.hash.length > 2) {
        const parts = location.hash.replace("#/", "").split("/");
        const id = parts[0];
        const step = parts[1] ? parseInt(parts[1], 10) - 1 : 0;
        if (LESSONS.some((l) => l.id === id)) {
          state.lessonId = id;
          state.stepIndex = Math.max(0, step);
        }
      }
    }

    window.addEventListener("hashchange", () => {
      syncFromHash();
      render();
    });

    syncFromHash();
    render();
  });
})();
