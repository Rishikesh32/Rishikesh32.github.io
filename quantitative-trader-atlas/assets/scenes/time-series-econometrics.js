/* Interactive quantitative simulation scene for Time-Series Analysis & Financial Econometrics */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  function at(s, t, n) {
    var cyl = n.type === "cyl", w = cyl ? 0 : (n.w || 1.6), d = cyl ? 0 : (n.d || 1.6);
    n.x = s + t - w / 2;
    n.y = t - s - d / 2;
    return n;
  }

  window.ATLAS_SCENES["time-series-econometrics/overview"] = {
    unit: 34,
    metrics: [
      {
            "id": "half",
            "label": "Half-Life",
            "tone": "accent"
      },
      {
            "id": "hurst",
            "label": "Hurst Exp",
            "tone": "signal"
      },
      {
            "id": "coint",
            "label": "Cointegration",
            "tone": "good"
      },
      {"id": "pnl", "label": "Profit / P&L", "tone": "good"}
    ],
    legend: {"req": "tick series", "data": "ARIMA-GARCH", "res": "pairs order", "miss": "unit root / drift"},
    nodes: {
      feed:    at(-5.6, 0,    { type: "cyl",   r: 1.1, h: 1.4, color: "t1", label: "Tick History", sub: "Returns Stream" }),
      engine:  at(-1.0, 0,    { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "accent", label: "ARIMA-GARCH", sub: "Vol Filter" }),
      riskctl: at(2.8, -3.0,  { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t4", label: "ADF Guard", sub: "Stationarity" }),
      alpha:   at(2.8, 3.0,   { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t3", label: "Mean-Revert", sub: "Z-Score Signal" }),
      venue:   at(6.6, 0,     { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "good", label: "Pairs Router", sub: "Spread SOR" })
    },
    steps: [
      {
        title: "Stationarity tests & volatility clustering",
        tag: "Econometric Filter",
        add: ["feed", "engine"],
        links: [["feed", "engine", "req", { lift: 30 }]],
        flows: [["feed", "engine", "req", { label: "Tick returns", lift: 30 }]],
        text: "<p>Financial returns exhibit heavy tails, volatility clustering, and non-stationarity. Returns pass through Augmented Dickey-Fuller (ADF) filters and GARCH(1,1) conditional volatility models.</p>",
        metrics: {"half": "4.2 Days", "hurst": "0.38 H", "coint": "p < 0.01", pnl: "+$0 (Filtering)"}
      },
      {
        title: "Cointegration isolation & Ornstein-Uhlenbeck fit",
        tag: "Cointegration",
        add: ["riskctl", "alpha"],
        links: [["engine", "alpha", "data", { lift: 28 }], ["engine", "riskctl", "miss", { lift: 28 }]],
        flows: [
          ["engine", "alpha", "data", { label: "Z-Score tilt", lift: 28, pos: 0.42, dy: -6 }],
          ["engine", "riskctl", "miss", { label: "Unit-root check", lift: 28, pos: 0.58, dy: -6 }]
        ],
        text: "<p>Johansen cointegration tests isolate stationary linear combinations of non-stationary price series. Mean-reversion speeds are quantified via calibrated Ornstein-Uhlenbeck parameters.</p>",
        metrics: {"half": "3.1 Days", "hurst": "0.32 H", "coint": "p < 0.001", pnl: "+$11,200 (+7.5%)"},
        changed: ["+ Cointegrating eigenvector extracted", "\u26a1 Spread volatility scaled by GARCH forecasts"]
      },
      {
        title: "Statistical arbitrage spread execution",
        tag: "Execution",
        add: ["venue"],
        links: [["alpha", "venue", "res", { lift: 26 }], ["riskctl", "venue", "res", { lift: 26 }]],
        flows: [
          ["alpha", "venue", "res", { count: 3, dur: 0.7, label: "Pairs slice", lift: 26, pos: 0.5, dy: -6 }]
        ],
        text: "<p>When spread z-scores exceed 2.0 standard deviations, matched pairs are routed to lit and dark venues, capturing reversion gains as spreads mean-revert.</p>",
        metrics: {"half": "2.8 Days", "hurst": "0.29 H", "coint": "1.85 Sharpe", pnl: "+$21,450 (+14.3%)"},
        changed: ["\u2713 Mean-reverting alpha locked", "\u2713 Tracking error strictly controlled", "\u2713 Execution active"]
      }
    ]
  };
})();
