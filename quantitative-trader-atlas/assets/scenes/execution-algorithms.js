/* Interactive quantitative simulation scene for Optimal Execution & Market Impact */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  function at(s, t, n) {
    var cyl = n.type === "cyl", w = cyl ? 0 : (n.w || 1.6), d = cyl ? 0 : (n.d || 1.6);
    n.x = s + t - w / 2;
    n.y = t - s - d / 2;
    return n;
  }

  window.ATLAS_SCENES["execution-algorithms/overview"] = {
    unit: 34,
    metrics: [
      {
            "id": "slip",
            "label": "Arrival Slippage",
            "tone": "accent"
      },
      {
            "id": "imp",
            "label": "Market Impact",
            "tone": "signal"
      },
      {
            "id": "save",
            "label": "Cost Savings",
            "tone": "good"
      },
      {"id": "pnl", "label": "Profit / P&L", "tone": "good"}
    ],
    legend: {"req": "parent order", "data": "Almgren-Chriss", "res": "child slice", "miss": "urgency slip"},
    nodes: {
      feed:    at(-5.6, 0,    { type: "cyl",   r: 1.1, h: 1.4, color: "t1", label: "Parent Order", sub: "Volume Profile" }),
      engine:  at(-1.0, 0,    { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "accent", label: "TWAP / VWAP", sub: "Optimal Slicer" }),
      riskctl: at(2.8, -3.0,  { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t4", label: "Impact Guard", sub: "Urgency Limit" }),
      alpha:   at(2.8, 3.0,   { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t3", label: "Schedule Alg", sub: "Dynamic Pace" }),
      venue:   at(6.6, 0,     { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "good", label: "Smart Venue", sub: "Hidden / Lit" })
    },
    steps: [
      {
        title: "Intraday volume forecasting & order slicing",
        tag: "Volume Profile",
        add: ["feed", "engine"],
        links: [["feed", "engine", "req", { lift: 30 }]],
        flows: [["feed", "engine", "req", { label: "Parent order", lift: 30 }]],
        text: "<p>U-shaped intraday volume curves and real-time order book liquidity are projected to create optimal child order schedules that minimize overall market impact.</p>",
        metrics: {"slip": "3.8 bps", "imp": "2.4 bps", "save": "$12.4k", pnl: "+$0 (Volume Fit)"}
      },
      {
        title: "Almgren-Chriss optimal trajectory & risk aversion parameterization",
        tag: "Trajectory Solver",
        add: ["riskctl", "alpha"],
        links: [["engine", "alpha", "data", { lift: 28 }], ["engine", "riskctl", "miss", { lift: 28 }]],
        flows: [
          ["engine", "alpha", "data", { label: "Optimal child pace", lift: 28, pos: 0.42, dy: -6 }],
          ["engine", "riskctl", "miss", { label: "Price drift guard", lift: 28, pos: 0.58, dy: -6 }]
        ],
        text: "<p>Euler-Lagrange equations balance permanent market impact against volatility risk over the execution horizon, dynamically speeding up or slowing down trading pace.</p>",
        metrics: {"slip": "2.1 bps", "imp": "1.4 bps", "save": "$28.6k", pnl: "+$18,200 (+1.8%)"},
        changed: ["+ Dynamic risk-aversion parameter calibrated", "\u26a1 Dark pool resting orders prioritize non-displayed liquidity"]
      },
      {
        title: "Smart Order Routing across lit and dark liquidity pools",
        tag: "Smart Routing",
        add: ["venue"],
        links: [["alpha", "venue", "res", { lift: 26 }], ["riskctl", "venue", "res", { lift: 26 }]],
        flows: [
          ["alpha", "venue", "res", { count: 3, dur: 0.7, label: "Discreet child fill", lift: 26, pos: 0.5, dy: -6 }]
        ],
        text: "<p>Smart order routing sprays child slices across midpoint dark venues and lit order books, capturing spread rebates and eliminating information leakage.</p>",
        metrics: {"slip": "0.9 bps", "imp": "0.6 bps", "save": "$46.8k", pnl: "+$46,800 (+4.7%)"},
        changed: ["\u2713 Slippage reduced by 76% vs baseline VWAP", "\u2713 Information footprint minimized", "\u2713 Execution complete"]
      }
    ]
  };
})();
