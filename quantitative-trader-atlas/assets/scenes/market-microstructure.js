/* Interactive quantitative simulation scene for Market Microstructure & Order Book Dynamics */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  function at(s, t, n) {
    var cyl = n.type === "cyl", w = cyl ? 0 : (n.w || 1.6), d = cyl ? 0 : (n.d || 1.6);
    n.x = s + t - w / 2;
    n.y = t - s - d / 2;
    return n;
  }

  window.ATLAS_SCENES["market-microstructure/overview"] = {
    unit: 34,
    metrics: [
      {
            "id": "spread",
            "label": "Spread bps",
            "tone": "accent"
      },
      {
            "id": "depth",
            "label": "Book Depth",
            "tone": "signal"
      },
      {
            "id": "fill",
            "label": "Fill Ratio",
            "tone": "good"
      },
      {"id": "pnl", "label": "Profit / P&L", "tone": "good"}
    ],
    legend: {"req": "ITCH packet", "data": "book state", "res": "OUCH order", "miss": "adverse selection"},
    nodes: {
      feed:    at(-5.6, 0,    { type: "cyl",   r: 1.1, h: 1.4, color: "t1", label: "ITCH L3 Feed", sub: "Order Book" }),
      engine:  at(-1.0, 0,    { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "accent", label: "Matching Eng", sub: "Limit Book" }),
      riskctl: at(2.8, -3.0,  { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t4", label: "Toxicity Guard", sub: "VPIN / Toxic" }),
      alpha:   at(2.8, 3.0,   { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t3", label: "Queue Alpha", sub: "Imbalance Signal" }),
      venue:   at(6.6, 0,     { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "good", label: "Crossing Desk", sub: "Smart Venue" })
    },
    steps: [
      {
        title: "L3 order reconstruction & price-time priority",
        tag: "Order Reconstruction",
        add: ["feed", "engine"],
        links: [["feed", "engine", "req", { lift: 30 }]],
        flows: [["feed", "engine", "req", { label: "500k events/s", lift: 30 }]],
        text: "<p>Raw ITCH network packets are decoded into limit order book ladders in sub-microseconds, maintaining deterministic price-time queues across all price levels.</p>",
        metrics: {"spread": "1.2 bps", "depth": "$4.2M Top3", "fill": "92.4%", pnl: "+$0 (Quoting)"}
      },
      {
        title: "Order flow toxicity & queue position calculation",
        tag: "Toxicity Gating",
        add: ["riskctl", "alpha"],
        links: [["engine", "alpha", "data", { lift: 28 }], ["engine", "riskctl", "miss", { lift: 28 }]],
        flows: [
          ["engine", "alpha", "data", { label: "Imbalance signal", lift: 28, pos: 0.42, dy: -6 }],
          ["engine", "riskctl", "miss", { label: "VPIN monitor", lift: 28, pos: 0.58, dy: -6 }]
        ],
        text: "<p>Volume-Synchronized Probability of Toxicity (VPIN) gauges informed order flow pressure. Queue depletion models predict microsecond fill probability at the top of book.</p>",
        metrics: {"spread": "0.8 bps", "depth": "$6.8M Top3", "fill": "96.2%", pnl: "+$22,500 (+4.5%)"},
        changed: ["+ Order book imbalance (OBI) signal active", "\u26a1 Orders cancelled ahead of toxic informed sweeps"]
      },
      {
        title: "Sub-microsecond passive posting & adverse selection minimization",
        tag: "Passive Posting",
        add: ["venue"],
        links: [["alpha", "venue", "res", { lift: 26 }], ["riskctl", "venue", "res", { lift: 26 }]],
        flows: [
          ["alpha", "venue", "res", { count: 3, dur: 0.7, label: "Passive join", lift: 26, pos: 0.5, dy: -6 }]
        ],
        text: "<p>Orders join high-queue-priority levels on inverted maker-taker venues, capturing half-spread maker rebates while avoiding adverse selection from fast sweeps.</p>",
        metrics: {"spread": "0.4 bps", "depth": "$8.4M Top3", "fill": "98.7%", pnl: "+$58,900 (+11.8%)"},
        changed: ["\u2713 Adverse selection drops by 68%", "\u2713 Maker rebates captured", "\u2713 Live in co-location"]
      }
    ]
  };
})();
