/* Interactive quantitative simulation scene for Quantitative Career, Portfolio & Interview */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  function at(s, t, n) {
    var cyl = n.type === "cyl", w = cyl ? 0 : (n.w || 1.6), d = cyl ? 0 : (n.d || 1.6);
    n.x = s + t - w / 2;
    n.y = t - s - d / 2;
    return n;
  }

  window.ATLAS_SCENES["career-interview-prep/overview"] = {
    unit: 34,
    metrics: [
      {
            "id": "acc",
            "label": "Problem Speed",
            "tone": "accent"
      },
      {
            "id": "math",
            "label": "Rigorous Math",
            "tone": "signal"
      },
      {
            "id": "offer",
            "label": "Offer Prob",
            "tone": "good"
      },
      {"id": "pnl", "label": "Profit / P&L", "tone": "good"}
    ],
    legend: {"req": "brainteaser", "data": "stochastic math", "res": "optimal solution", "miss": "edge case"},
    nodes: {
      feed:    at(-5.6, 0,    { type: "cyl",   r: 1.1, h: 1.4, color: "t1", label: "Brainteasers", sub: "Probability Math" }),
      engine:  at(-1.0, 0,    { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "accent", label: "Quant Solver", sub: "Stochastic Model" }),
      riskctl: at(2.8, -3.0,  { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t4", label: "Complexity Guard", sub: "Edge Case Gate" }),
      alpha:   at(2.8, 3.0,   { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t3", label: "Mental Math", sub: "Fermi Estimates" }),
      venue:   at(6.6, 0,     { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "good", label: "Superday Board", sub: "Offer Desk" })
    },
    steps: [
      {
        title: "Probability brainteasers & martingale betting games",
        tag: "Probability Puzzles",
        add: ["feed", "engine"],
        links: [["feed", "engine", "req", { lift: 30 }]],
        flows: [["feed", "engine", "req", { label: "Interview puzzle", lift: 30 }]],
        text: "<p>Top quant trading firms test mental agility with stopping time problems, random walks on graphs, and optimal coin-toss betting games under time pressure.</p>",
        metrics: {"acc": "45s / Puzzle", "math": "92%", "offer": "72%", pnl: "+$0 (Pitch Prep)"}
      },
      {
        title: "Stochastic calculus derivations & C++ systems questions",
        tag: "Technical Rigor",
        add: ["riskctl", "alpha"],
        links: [["engine", "alpha", "data", { lift: 28 }], ["engine", "riskctl", "miss", { lift: 28 }]],
        flows: [
          ["engine", "alpha", "data", { label: "Analytical proof", lift: 28, pos: 0.42, dy: -6 }],
          ["engine", "riskctl", "miss", { label: "Corner case verify", lift: 28, pos: 0.58, dy: -6 }]
        ],
        text: "<p>Deep technical rounds demand deriving Black-Scholes PDEs from first principles, writing lock-free queue primitives, and explaining market microstructure nuances.</p>",
        metrics: {"acc": "30s / Proof", "math": "98%", "offer": "88%", pnl: "+$6,400 (+6.4%)"},
        changed: ["+ First-principles stochastic derivations demonstrated", "\u26a1 Memory layout and cache-line false sharing explained"]
      },
      {
        title: "Live portfolio pitch & algorithmic trading simulation",
        tag: "Superday Pitch",
        add: ["venue"],
        links: [["alpha", "venue", "res", { lift: 26 }], ["riskctl", "venue", "res", { lift: 26 }]],
        flows: [
          ["alpha", "venue", "res", { count: 3, dur: 0.7, label: "Alpha strategy pitch", lift: 26, pos: 0.5, dy: -6 }]
        ],
        text: "<p>Candidates pitch defensible statistical arbitrage strategies backed by backtests, purged cross-validation, and risk-adjusted Sharpe analysis, securing top trading offers.</p>",
        metrics: {"acc": "Top 1% Rank", "math": "100%", "offer": "96%", pnl: "+$16,800 (+16.8%)"},
        changed: ["\u2713 Multi-factor strategy pitch defended", "\u2713 Risk controls and live drawdowns addressed", "\u2713 Institutional offer extended"]
      }
    ]
  };
})();
