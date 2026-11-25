/* Interactive quantitative simulation scene for Alpha Research & Factor Investing */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
window.ATLAS_SCENES["alpha-research-factor-investing/overview"] = {
  unit: 34,
  metrics: [
    { id: "signal", label: "Alpha / Effici", tone: "accent" },
    { id: "risk", label: "Tail Volatilit", tone: "signal" },
    { id: "sharpe", label: "Risk-Adjusted", tone: "good" }
  ],
  legend: { req: "market stream", data: "alpha model", res: "execution order", miss: "tail risk / friction" },
  nodes: {
    feed:    { type: "cyl",   x: 0,    y: 3.8,  r: 1.4, h: 1.5, color: "t1", label: "Market Data L2", sub: "Tick & Book Feed" },
    engine:  { type: "slab",  x: 4.5,  y: 3.8,  w: 2.4, d: 2.6, h: 0.6, color: "accent", label: "Alpha Research", sub: "Quantitative Core" },
    riskctl: { type: "block", x: 9.0,  y: 1.5,  w: 2.4, d: 1.6, h: 1.0, color: "t4", label: "Barra Risk / V", sub: "Drawdown Guard" },
    alpha:   { type: "block", x: 9.0,  y: 6.0,  w: 2.4, d: 1.6, h: 1.0, color: "t3", label: "Alpha Signal", sub: "IC Optimization" },
    venue:   { type: "block", x: 13.5, y: 3.8,  w: 2.0, d: 2.6, h: 1.2, color: "good", label: "Execution Venu", sub: "Smart Order Router" }
  },
  steps: [
    {
      title: "Market data ingestion & signal calibration",
      tag: "Data Ingestion",
      add: ["feed", "engine"],
      links: [["feed", "engine"]],
      flows: [["feed", "engine", "req", { label: "100k ticks/sec" }]],
      text: "<p>Continuous microsecond feeds stream into the Alpha Research & Factor Investing calculation pipeline. Parameters are dynamically calibrated under rigorous statistical bounds.</p>",
      metrics: { signal: "+0.042 IC", risk: "2.1% σ", sharpe: "1.42" }
    },
    {
      title: "Factor optimization & risk gating",
      tag: "Risk Gating",
      add: ["riskctl", "alpha"],
      links: [["engine", "alpha"], ["engine", "riskctl"]],
      flows: [["engine", "alpha", "data", { label: "Factor tilt" }], ["engine", "riskctl", "miss", { label: "VaR constraint" }]],
      text: "<p>The algorithm isolates genuine predictive alpha while projecting portfolio exposures onto orthogonal risk factors to immunize against market beta.</p>",
      metrics: { signal: "+0.068 IC", risk: "1.4% σ", sharpe: "2.18" },
      changed: ["+ Factor signals extracted", "⚡ Volatility constrained via covariance cleaning"]
    },
    {
      title: "Optimal execution & slippage minimization",
      tag: "Execution",
      add: ["venue"],
      links: [["alpha", "venue"], ["riskctl", "venue"]],
      flows: [["alpha", "venue", "res", { count: 3, dur: 0.7, label: "Child orders" }]],
      text: "<p>Smart order routing slices trades across dark pools and lit books, minimizing Almgren-Chriss market impact and realizing positive net alpha.</p>",
      metrics: { signal: "+0.065 Net IC", risk: "1.2% σ", sharpe: "2.45" },
      changed: ["✓ Execution slippage reduced by 42%", "✓ Drawdown strictly bound within 99% CVaR", "✓ System live in production"]
    }
  ]
};
