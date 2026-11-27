/* Interactive quantitative simulation scene for Machine Learning in Quantitative Finance */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  function at(s, t, n) {
    var cyl = n.type === "cyl", w = cyl ? 0 : (n.w || 1.6), d = cyl ? 0 : (n.d || 1.6);
    n.x = s + t - w / 2;
    n.y = t - s - d / 2;
    return n;
  }

  window.ATLAS_SCENES["machine-learning-finance/overview"] = {
    unit: 34,
    metrics: [
      {
            "id": "auc",
            "label": "OOS AUC",
            "tone": "accent"
      },
      {
            "id": "overfit",
            "label": "Deflated SR",
            "tone": "signal"
      },
      {
            "id": "ret",
            "label": "Net Alpha",
            "tone": "good"
      },
      {"id": "pnl", "label": "Profit / P&L", "tone": "good"}
    ],
    legend: {"req": "feature matrix", "data": "ML inference", "res": "target weights", "miss": "label leakage"},
    nodes: {
      feed:    at(-5.6, 0,    { type: "cyl",   r: 1.1, h: 1.4, color: "t1", label: "Feature Store", sub: "Engineered Ticks" }),
      engine:  at(-1.0, 0,    { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "accent", label: "LightGBM / MLP", sub: "ML Pipeline" }),
      riskctl: at(2.8, -3.0,  { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t4", label: "Purged CV", sub: "Leakage Guard" }),
      alpha:   at(2.8, 3.0,   { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t3", label: "Non-Linear", sub: "Predict Alpha" }),
      venue:   at(6.6, 0,     { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "good", label: "Execution Alg", sub: "Slicing Venue" })
    },
    steps: [
      {
        title: "Feature engineering & triple barrier labeling",
        tag: "Feature Store",
        add: ["feed", "engine"],
        links: [["feed", "engine", "req", { lift: 30 }]],
        flows: [["feed", "engine", "req", { label: "Order-flow features", lift: 30 }]],
        text: "<p>Fractional differentiation preserves memory in price series while achieving stationarity. Events are labeled using the Lopez de Prado Triple-Barrier method with dynamic volatility horizontal bounds.</p>",
        metrics: {"auc": "0.542 AUC", "overfit": "1.21 DSR", "ret": "+2.4% Annual", pnl: "+$0 (Training)"}
      },
      {
        title: "Combinatorial purged cross-validation & feature importance",
        tag: "Purged CV",
        add: ["riskctl", "alpha"],
        links: [["engine", "alpha", "data", { lift: 28 }], ["engine", "riskctl", "miss", { lift: 28 }]],
        flows: [
          ["engine", "alpha", "data", { label: "Non-linear alpha", lift: 28, pos: 0.42, dy: -6 }],
          ["engine", "riskctl", "miss", { label: "Overfitting gate", lift: 28, pos: 0.58, dy: -6 }]
        ],
        text: "<p>Combinatorial Purged Cross-Validation (CPCV) eliminates serial information leakage. Mean Decrease Impurity (MDI) isolates genuinely predictive non-linear interactions.</p>",
        metrics: {"auc": "0.598 AUC", "overfit": "2.18 DSR", "ret": "+8.9% Annual", pnl: "+$14,300 (+5.7%)"},
        changed: ["+ Non-linear feature interactions mapped", "\u26a1 Information leakage eliminated via CPCV embargo"]
      },
      {
        title: "Production model serving & execution thresholding",
        tag: "Serving",
        add: ["venue"],
        links: [["alpha", "venue", "res", { lift: 26 }], ["riskctl", "venue", "res", { lift: 26 }]],
        flows: [
          ["alpha", "venue", "res", { count: 3, dur: 0.7, label: "ML target order", lift: 26, pos: 0.5, dy: -6 }]
        ],
        text: "<p>Calibrated probability outputs are passed to an optimal sizing Kelly criterion, executing orders only when expected returns exceed transaction cost hurdles.</p>",
        metrics: {"auc": "0.589 Live AUC", "overfit": "2.45 DSR", "ret": "+14.6% Net", pnl: "+$38,400 (+15.4%)"},
        changed: ["\u2713 Model deployed to microsecond inference engine", "\u2713 Transaction cost hurdle applied", "\u2713 Out-of-sample alpha confirmed"]
      }
    ]
  };
})();
