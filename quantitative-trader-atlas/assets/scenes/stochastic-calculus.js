/* Interactive quantitative simulation scene for Stochastic Calculus & Asset Dynamics */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  function at(s, t, n) {
    var cyl = n.type === "cyl", w = cyl ? 0 : (n.w || 1.6), d = cyl ? 0 : (n.d || 1.6);
    n.x = s + t - w / 2;
    n.y = t - s - d / 2;
    return n;
  }

  window.ATLAS_SCENES["stochastic-calculus/overview"] = {
    unit: 34,
    metrics: [
      {
            "id": "drift",
            "label": "Drift \u03bc",
            "tone": "accent"
      },
      {
            "id": "vol",
            "label": "Diffusion \u03c3",
            "tone": "signal"
      },
      {
            "id": "hedge",
            "label": "Delta Hedge",
            "tone": "good"
      },
      {"id": "pnl", "label": "Profit / P&L", "tone": "good"}
    ],
    legend: {"req": "price process", "data": "Ito lemma", "res": "delta hedge", "miss": "jump diffusion"},
    nodes: {
      feed:    at(-5.6, 0,    { type: "cyl",   r: 1.1, h: 1.4, color: "t1", label: "Asset Drift", sub: "Brownian Path" }),
      engine:  at(-1.0, 0,    { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "accent", label: "Ito Calculus", sub: "SDE Solver" }),
      riskctl: at(2.8, -3.0,  { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t4", label: "Jump Guard", sub: "Merton Jump" }),
      alpha:   at(2.8, 3.0,   { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t3", label: "Diffusion", sub: "Drift Alpha" }),
      venue:   at(6.6, 0,     { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "good", label: "Hedge Router", sub: "Delta Hedge" })
    },
    steps: [
      {
        title: "Geometric Brownian motion & SDE simulation",
        tag: "SDE Simulation",
        add: ["feed", "engine"],
        links: [["feed", "engine", "req", { lift: 30 }]],
        flows: [["feed", "engine", "req", { label: "10k paths/sec", lift: 30 }]],
        text: "<p>Continuous price paths are modeled via Itô stochastic differential equations $dS_t = \mu S_t dt + \sigma S_t dW_t$. Paths are discretized and simulated under the equivalent martingale measure $\mathbb{Q}$.</p>",
        metrics: {"drift": "+8.2% \u03bc", "vol": "18.4% \u03c3", "hedge": "0.98 \u0394", pnl: "+$0 (Hedging)"}
      },
      {
        title: "Itô lemma expansion & jump-diffusion gating",
        tag: "Jump Gating",
        add: ["riskctl", "alpha"],
        links: [["engine", "alpha", "data", { lift: 28 }], ["engine", "riskctl", "miss", { lift: 28 }]],
        flows: [
          ["engine", "alpha", "data", { label: "Itô Taylor term", lift: 28, pos: 0.42, dy: -6 }],
          ["engine", "riskctl", "miss", { label: "Poisson jump test", lift: 28, pos: 0.58, dy: -6 }]
        ],
        text: "<p>Applying Itô lemma decomposes derivative dynamics into deterministic drift, diffusive variance, and discontinuous jump components to immunize non-linear Greeks.</p>",
        metrics: {"drift": "+6.4% \u03bc", "vol": "14.2% \u03c3", "hedge": "0.99 \u0394", pnl: "+$12,800 (+5.1%)"},
        changed: ["+ Second-order It\u00f4 convexity captured", "\u26a1 Poisson jump risk bounded via Merton buffer"]
      },
      {
        title: "Dynamic delta replication & martingale hedging",
        tag: "Replication",
        add: ["venue"],
        links: [["alpha", "venue", "res", { lift: 26 }], ["riskctl", "venue", "res", { lift: 26 }]],
        flows: [
          ["alpha", "venue", "res", { count: 3, dur: 0.7, label: "Rebalance delta", lift: 26, pos: 0.5, dy: -6 }]
        ],
        text: "<p>Continuous rebalancing of underlying shares synthesizes replicating portfolios, driving tracking variance toward zero under continuous martingales.</p>",
        metrics: {"drift": "+0.0% \u03bc", "vol": "0.8% Tracking", "hedge": "1.00 \u0394", pnl: "+$32,600 (+13.0%)"},
        changed: ["\u2713 Delta-neutral replication active", "\u2713 Residual variance bound within 0.8%", "\u2713 Hedging pipeline live"]
      }
    ]
  };
})();
