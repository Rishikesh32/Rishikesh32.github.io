/* Interactive quantitative simulation scene for Mathematical & Probabilistic Foundations */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  function at(s, t, n) {
    var cyl = n.type === "cyl", w = cyl ? 0 : (n.w || 1.6), d = cyl ? 0 : (n.d || 1.6);
    n.x = s + t - w / 2;
    n.y = t - s - d / 2;
    return n;
  }

  window.ATLAS_SCENES["math-foundations/overview"] = {
    unit: 34,
    metrics: [
      { id: "signal", label: "Math Core", tone: "accent" },
      { id: "risk", label: "Tail Volatility", tone: "signal" },
      { id: "sharpe", label: "Risk-Adjusted", tone: "good" },
      {"id": "pnl", "label": "Profit / P&L", "tone": "good"}
    ],
    legend: { req: "market stream", data: "alpha model", res: "execution order", miss: "tail risk / friction" },
    nodes: {
      feed:    at(-5.6, 0,    { type: "cyl",   r: 1.1, h: 1.4, color: "t1", label: "Market Data", sub: "L2 Feed" }),
      engine:  at(-1.0, 0,    { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "accent", label: "Quant Core", sub: "Engine" }),
      riskctl: at(2.8, -3.0,  { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t4", label: "VaR Guard", sub: "Risk Control" }),
      alpha:   at(2.8, 3.0,   { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t3", label: "Alpha Model", sub: "Signal Gen" }),
      venue:   at(6.6, 0,     { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "good", label: "Execution", sub: "Smart SOR" })
    },
    steps: [
      {
        title: "Market data ingestion & signal calibration",
        tag: "Data Ingestion",
        add: ["feed", "engine"],
        links: [["feed", "engine", "req", { lift: 30 }]],
        flows: [["feed", "engine", "req", { label: "100k ticks/sec", lift: 30 }]],
        text: "<p>Continuous microsecond feeds stream into the Mathematical & Probabilistic Foundations calculation pipeline. Parameters are dynamically calibrated under rigorous statistical bounds.</p>",
        metrics: { signal: "+0.042 IC", risk: "2.1% σ", sharpe: "1.42" , pnl: "+$0 (Calibrating)"}
      },
      {
        title: "Factor optimization & risk gating",
        tag: "Risk Gating",
        add: ["riskctl", "alpha"],
        links: [["engine", "alpha", "data", { lift: 28 }], ["engine", "riskctl", "miss", { lift: 28 }]],
        flows: [
          ["engine", "alpha", "data", { label: "Factor tilt", lift: 28, pos: 0.42, dy: -6 }],
          ["engine", "riskctl", "miss", { label: "VaR constraint", lift: 28, pos: 0.58, dy: -6 }]
        ],
        text: "<p>The algorithm isolates genuine predictive alpha while projecting portfolio exposures onto orthogonal risk factors to immunize against market beta.</p>",
        metrics: { signal: "+0.068 IC", risk: "1.4% σ", sharpe: "2.18", pnl: "+$7,840 (+7.8%)"},
        changed: ["+ Factor signals extracted", "⚡ Volatility constrained via covariance cleaning"]
      },
      {
        title: "Optimal execution & slippage minimization",
        tag: "Execution",
        add: ["venue"],
        links: [["alpha", "venue", "res", { lift: 26 }], ["riskctl", "venue", "res", { lift: 26 }]],
        flows: [
          ["alpha", "venue", "res", { count: 3, dur: 0.7, label: "Child orders", lift: 26, pos: 0.5, dy: -6 }]
        ],
        text: "<p>Smart order routing slices trades across dark pools and lit books, minimizing Almgren-Chriss market impact and realizing positive net alpha.</p>",
        metrics: { signal: "+0.065 Net IC", risk: "1.2% σ", sharpe: "2.45", pnl: "+$18,420 (+18.4%)"},
        changed: ["✓ Execution slippage reduced by 42%", "✓ Drawdown strictly bound within 99% CVaR", "✓ System live in production"]
      }
    ]
  };
})();
