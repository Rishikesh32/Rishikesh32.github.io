/* Interactive quantitative simulation scene for Portfolio Construction & Optimization */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  function at(s, t, n) {
    var cyl = n.type === "cyl", w = cyl ? 0 : (n.w || 1.6), d = cyl ? 0 : (n.d || 1.6);
    n.x = s + t - w / 2;
    n.y = t - s - d / 2;
    return n;
  }

  window.ATLAS_SCENES["portfolio-optimization/overview"] = {
    unit: 34,
    metrics: [
      {
            "id": "sharpe",
            "label": "Max Sharpe",
            "tone": "accent"
      },
      {
            "id": "vol",
            "label": "Port Volatility",
            "tone": "signal"
      },
      {
            "id": "divers",
            "label": "Divers Ratio",
            "tone": "good"
      },
      {"id": "pnl", "label": "Profit / P&L", "tone": "good"}
    ],
    legend: {"req": "alpha / cov", "data": "Black-Litterman", "res": "target weights", "miss": "factor limit"},
    nodes: {
      feed:    at(-5.6, 0,    { type: "cyl",   r: 1.1, h: 1.4, color: "t1", label: "Expected Ret", sub: "Cov Matrix" }),
      engine:  at(-1.0, 0,    { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "accent", label: "Markowitz / BL", sub: "Convex Solver" }),
      riskctl: at(2.8, -3.0,  { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t4", label: "Turnover Limit", sub: "Factor Bound" }),
      alpha:   at(2.8, 3.0,   { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t3", label: "Optimal Wgts", sub: "Tangency Vector" }),
      venue:   at(6.6, 0,     { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "good", label: "Rebalance Desk", sub: "Smart SOR" })
    },
    steps: [
      {
        title: "Shrinkage covariance estimation & Black-Litterman blending",
        tag: "Covariance Estimation",
        add: ["feed", "engine"],
        links: [["feed", "engine", "req", { lift: 30 }]],
        flows: [["feed", "engine", "req", { label: "Returns & Views", lift: 30 }]],
        text: "<p>Ledoit-Wolf shrinkage cleans sample covariance matrices to eliminate eigenvalue inversion noise. Subjective and quantitative alpha views are blended with market equilibrium weights.</p>",
        metrics: {"sharpe": "1.45 SR", "vol": "14.2% \u03c3", "divers": "1.82 DR", pnl: "+$0 (Shrinkage)"}
      },
      {
        title: "Convex optimization with quadratic transaction costs",
        tag: "Convex Solver",
        add: ["riskctl", "alpha"],
        links: [["engine", "alpha", "data", { lift: 28 }], ["engine", "riskctl", "miss", { lift: 28 }]],
        flows: [
          ["engine", "alpha", "data", { label: "Target weights", lift: 28, pos: 0.42, dy: -6 }],
          ["engine", "riskctl", "miss", { label: "Turnover penalty", lift: 28, pos: 0.58, dy: -6 }]
        ],
        text: "<p>Second-Order Cone Programming (SOCP) maximizes risk-adjusted returns subject to L1 gross leverage, sector concentration, and non-linear market impact penalties.</p>",
        metrics: {"sharpe": "2.14 SR", "vol": "10.8% \u03c3", "divers": "2.45 DR", pnl: "+$24,400 (+4.9%)"},
        changed: ["+ Eigenvalue shrinkage applied to covariance", "\u26a1 Non-linear transaction cost penalties active"]
      },
      {
        title: "Hierarchical Risk Parity & portfolio rebalance",
        tag: "Rebalance",
        add: ["venue"],
        links: [["alpha", "venue", "res", { lift: 26 }], ["riskctl", "venue", "res", { lift: 26 }]],
        flows: [
          ["alpha", "venue", "res", { count: 3, dur: 0.7, label: "Rebalance slice", lift: 26, pos: 0.5, dy: -6 }]
        ],
        text: "<p>Hierarchical Risk Parity (HRP) uses tree-clustering to allocate capital across uncorrelated asset clusters without requiring matrix inversion, producing resilient out-of-sample weights.</p>",
        metrics: {"sharpe": "2.52 SR", "vol": "9.4% \u03c3", "divers": "3.12 DR", pnl: "+$64,200 (+12.8%)"},
        changed: ["\u2713 Portfolio volatility reduced by 34%", "\u2713 Maximum drawdown bounded within 8%", "\u2713 Production rebalance committed"]
      }
    ]
  };
})();
