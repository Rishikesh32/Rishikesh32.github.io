/* Interactive quantitative simulation scene for Statistical Arbitrage & Mean Reversion */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  function at(s, t, n) {
    var cyl = n.type === "cyl", w = cyl ? 0 : (n.w || 1.6), d = cyl ? 0 : (n.d || 1.6);
    n.x = s + t - w / 2;
    n.y = t - s - d / 2;
    return n;
  }

  window.ATLAS_SCENES["statistical-arbitrage/overview"] = {
    unit: 34,
    metrics: [
      {
            "id": "zscore",
            "label": "Spread Z-Score",
            "tone": "accent"
      },
      {
            "id": "res",
            "label": "Residual Var",
            "tone": "signal"
      },
      {
            "id": "pnl",
            "label": "Arb P&L",
            "tone": "good"
      }
],
    legend: {"req": "pair quotes", "data": "PCA residual", "res": "basket order", "miss": "divergence stop"},
    nodes: {
      feed:    at(-5.6, 0,    { type: "cyl",   r: 1.1, h: 1.4, color: "t1", label: "Equities Feed", sub: "Price Ticks" }),
      engine:  at(-1.0, 0,    { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "accent", label: "PCA / Kalmar", sub: "Residual Engine" }),
      riskctl: at(2.8, -3.0,  { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t4", label: "Stop-Loss", sub: "Divergence Guard" }),
      alpha:   at(2.8, 3.0,   { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t3", label: "Eigenportfolios", sub: "Stat-Arb Signal" }),
      venue:   at(6.6, 0,     { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "good", label: "Crossing SOR", sub: "Basket Router" })
    },
    steps: [
      {
        title: "Principal component decomposition of equity returns",
        tag: "Decomposition",
        add: ["feed", "engine"],
        links: [["feed", "engine", "req", { lift: 30 }]],
        flows: [["feed", "engine", "req", { label: "Universe returns", lift: 30 }]],
        text: "<p>Eigenvector decomposition of the return covariance matrix isolates the top systematic market factors from idiosyncratic asset residuals.</p>",
        metrics: {"zscore": "1.4 \u03c3", "res": "12.4% Var", "pnl": "$0 Daily"}
      },
      {
        title: "Ornstein-Uhlenbeck residual modeling & entry triggers",
        tag: "Trigger Gating",
        add: ["riskctl", "alpha"],
        links: [["engine", "alpha", "data", { lift: 28 }], ["engine", "riskctl", "miss", { lift: 28 }]],
        flows: [
          ["engine", "alpha", "data", { label: "Mean-revert alpha", lift: 28, pos: 0.42, dy: -6 }],
          ["engine", "riskctl", "miss", { label: "Divergence check", lift: 28, pos: 0.58, dy: -6 }]
        ],
        text: "<p>Idiosyncratic residuals are modeled as mean-reverting Ornstein-Uhlenbeck processes. When an asset deviates beyond 2.0 standard deviations without news, entry triggers arm.</p>",
        metrics: {"zscore": "2.4 \u03c3 Entry", "res": "9.1% Var", "pnl": "+$18.5k"},
        changed: ["+ Statistical mean-reversion signal armed", "\u26a1 Strict divergence stop-loss activated at 3.5\u03c3"]
      },
      {
        title: "Market-neutral basket execution & reversion realization",
        tag: "Execution",
        add: ["venue"],
        links: [["alpha", "venue", "res", { lift: 26 }], ["riskctl", "venue", "res", { lift: 26 }]],
        flows: [
          ["alpha", "venue", "res", { count: 3, dur: 0.7, label: "Revert slice", lift: 26, pos: 0.5, dy: -6 }]
        ],
        text: "<p>Dollar-neutral and beta-neutral baskets are routed to crossing networks. As residuals revert back toward their historical mean, profits are locked in.</p>",
        metrics: {"zscore": "0.3 \u03c3 Target", "res": "6.8% Var", "pnl": "+$46.2k"},
        changed: ["\u2713 Spread reverted to fundamental mean", "\u2713 Stat-arb gains fully booked", "\u2713 Strategy market-neutral"]
      }
    ]
  };
})();
