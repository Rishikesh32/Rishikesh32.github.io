/* Interactive quantitative simulation scene for Alpha Research & Factor Investing */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  function at(s, t, n) {
    var cyl = n.type === "cyl", w = cyl ? 0 : (n.w || 1.6), d = cyl ? 0 : (n.d || 1.6);
    n.x = s + t - w / 2;
    n.y = t - s - d / 2;
    return n;
  }

  window.ATLAS_SCENES["alpha-research-factor-investing/overview"] = {
    unit: 34,
    metrics: [
      {
            "id": "ic",
            "label": "Info Coeff",
            "tone": "accent"
      },
      {
            "id": "beta",
            "label": "Market Beta",
            "tone": "signal"
      },
      {
            "id": "sharpe",
            "label": "Factor Sharpe",
            "tone": "good"
      },
      {"id": "pnl", "label": "Profit / P&L", "tone": "good"}
    ],
    legend: {"req": "features", "data": "factor tilt", "res": "rebalance basket", "miss": "style bias"},
    nodes: {
      feed:    at(-5.6, 0,    { type: "cyl",   r: 1.1, h: 1.4, color: "t1", label: "Data Lake", sub: "Cross-Section" }),
      engine:  at(-1.0, 0,    { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "accent", label: "Barra Model", sub: "Factor Engine" }),
      riskctl: at(2.8, -3.0,  { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t4", label: "Beta Neutral", sub: "Style Guard" }),
      alpha:   at(2.8, 3.0,   { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t3", label: "Composite", sub: "Multi-Factor IC" }),
      venue:   at(6.6, 0,     { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "good", label: "Portfolio SOR", sub: "Basket Exec" })
    },
    steps: [
      {
        title: "Factor extraction & cross-sectional standardization",
        tag: "Factor Extraction",
        add: ["feed", "engine"],
        links: [["feed", "engine", "req", { lift: 30 }]],
        flows: [["feed", "engine", "req", { label: "3,000 equities", lift: 30 }]],
        text: "<p>Momentum, value, quality, and low-volatility features are extracted across the equity universe, winsorized, and z-scored cross-sectionally per industry sector.</p>",
        metrics: {"ic": "+0.048 IC", "beta": "0.12 \u03b2", "sharpe": "1.35 SR", pnl: "+$0 (Neutralizing)"}
      },
      {
        title: "Orthogonalization & Barra risk factor neutralization",
        tag: "Neutralization",
        add: ["riskctl", "alpha"],
        links: [["engine", "alpha", "data", { lift: 28 }], ["engine", "riskctl", "miss", { lift: 28 }]],
        flows: [
          ["engine", "alpha", "data", { label: "Pure alpha signal", lift: 28, pos: 0.42, dy: -6 }],
          ["engine", "riskctl", "miss", { label: "Style beta hedge", lift: 28, pos: 0.58, dy: -6 }]
        ],
        text: "<p>Gram-Schmidt orthogonalization strips out collinearity among signals, and linear constraints ensure net portfolio exposure to market beta and size is zero.</p>",
        metrics: {"ic": "+0.072 IC", "beta": "0.01 \u03b2", "sharpe": "2.24 SR", pnl: "+$54,300 (+5.4%)"},
        changed: ["+ Multi-factor IC increased via orthogonalization", "\u26a1 Industry and style biases fully neutralized"]
      },
      {
        title: "Convex portfolio optimization & turnover control",
        tag: "Optimization",
        add: ["venue"],
        links: [["alpha", "venue", "res", { lift: 26 }], ["riskctl", "venue", "res", { lift: 26 }]],
        flows: [
          ["alpha", "venue", "res", { count: 3, dur: 0.7, label: "Basket rebalance", lift: 26, pos: 0.5, dy: -6 }]
        ],
        text: "<p>Quadratic programming maximizes expected alpha subject to quadratic transaction cost penalties, generating optimal target weights with controlled turnover.</p>",
        metrics: {"ic": "+0.069 Net IC", "beta": "0.00 \u03b2", "sharpe": "2.68 SR", pnl: "+$142,500 (+14.3%)"},
        changed: ["\u2713 Portfolio beta strictly 0.00", "\u2713 Turnover bounded under 15% monthly", "\u2713 Multi-factor strategy active"]
      }
    ]
  };
})();
