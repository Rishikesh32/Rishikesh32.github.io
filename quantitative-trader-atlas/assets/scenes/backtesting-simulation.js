/* Interactive quantitative simulation scene for Backtesting, Simulation & Production */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  function at(s, t, n) {
    var cyl = n.type === "cyl", w = cyl ? 0 : (n.w || 1.6), d = cyl ? 0 : (n.d || 1.6);
    n.x = s + t - w / 2;
    n.y = t - s - d / 2;
    return n;
  }

  window.ATLAS_SCENES["backtesting-simulation/overview"] = {
    unit: 34,
    metrics: [
      {
            "id": "dsr",
            "label": "Deflated SR",
            "tone": "accent"
      },
      {
            "id": "slip",
            "label": "Slippage bps",
            "tone": "signal"
      },
      {
            "id": "mdd",
            "label": "Max Drawdown",
            "tone": "good"
      }
],
    legend: {"req": "historical L3", "data": "sim queue", "res": "live order", "miss": "lookahead leak"},
    nodes: {
      feed:    at(-5.6, 0,    { type: "cyl",   r: 1.1, h: 1.4, color: "t1", label: "Tick Replay", sub: "Nanosecond L3" }),
      engine:  at(-1.0, 0,    { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "accent", label: "Sim Engine", sub: "Queue Model" }),
      riskctl: at(2.8, -3.0,  { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t4", label: "Leakage Guard", sub: "Lookahead Test" }),
      alpha:   at(2.8, 3.0,   { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t3", label: "Backtested", sub: "Fill Simulator" }),
      venue:   at(6.6, 0,     { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "good", label: "Production Desk", sub: "Live Router" })
    },
    steps: [
      {
        title: "Event-driven backtesting with nanosecond tick replay",
        tag: "Tick Replay",
        add: ["feed", "engine"],
        links: [["feed", "engine", "req", { lift: 30 }]],
        flows: [["feed", "engine", "req", { label: "1B tick events", lift: 30 }]],
        text: "<p>Event-driven backtesters process historical market events in strict causal chronological sequence, eliminating forward-looking bias and simulating exact order queue position dynamics.</p>",
        metrics: {"dsr": "1.24 DSR", "slip": "2.4 bps", "mdd": "-12.4%"}
      },
      {
        title: "Realistic fill simulation & latency modeling",
        tag: "Fill Modeling",
        add: ["riskctl", "alpha"],
        links: [["engine", "alpha", "data", { lift: 28 }], ["engine", "riskctl", "miss", { lift: 28 }]],
        flows: [
          ["engine", "alpha", "data", { label: "Simulated fill", lift: 28, pos: 0.42, dy: -6 }],
          ["engine", "riskctl", "miss", { label: "Causality check", lift: 28, pos: 0.58, dy: -6 }]
        ],
        text: "<p>Simulations model wire latency, exchange matching queue priority, and market impact using calibrated non-linear Almgren-Chriss square-root laws.</p>",
        metrics: {"dsr": "1.92 DSR", "slip": "1.6 bps", "mdd": "-8.2%"},
        changed: ["+ Queue priority depletion modeled", "\u26a1 Wire latency buffer strictly enforced"]
      },
      {
        title: "Paper trading reconciliation & production deployment",
        tag: "Production",
        add: ["venue"],
        links: [["alpha", "venue", "res", { lift: 26 }], ["riskctl", "venue", "res", { lift: 26 }]],
        flows: [
          ["alpha", "venue", "res", { count: 3, dur: 0.7, label: "Live fill verify", lift: 26, pos: 0.5, dy: -6 }]
        ],
        text: "<p>Real-time shadow execution verifies that simulated fills match production live fills within a 0.2 bps tolerance before allocating live institutional capital.</p>",
        metrics: {"dsr": "2.35 DSR", "slip": "1.1 bps", "mdd": "-5.4%"},
        changed: ["\u2713 Simulation matches live fills within 0.15 bps", "\u2713 Lookahead bias verifiably zero", "\u2713 Production deployment authorized"]
      }
    ]
  };
})();
