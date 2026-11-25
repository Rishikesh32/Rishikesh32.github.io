/* Interactive quantitative simulation scene for Derivatives Pricing & Volatility Surface */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  function at(s, t, n) {
    var cyl = n.type === "cyl", w = cyl ? 0 : (n.w || 1.6), d = cyl ? 0 : (n.d || 1.6);
    n.x = s + t - w / 2;
    n.y = t - s - d / 2;
    return n;
  }

  window.ATLAS_SCENES["derivatives-pricing/overview"] = {
    unit: 34,
    metrics: [
      {
            "id": "iv",
            "label": "Implied Vol",
            "tone": "accent"
      },
      {
            "id": "gamma",
            "label": "Net Gamma",
            "tone": "signal"
      },
      {
            "id": "pnl",
            "label": "Hedge P&L",
            "tone": "good"
      }
],
    legend: {"req": "spot stream", "data": "vol surface", "res": "hedge order", "miss": "vega risk"},
    nodes: {
      feed:    at(-5.6, 0,    { type: "cyl",   r: 1.1, h: 1.4, color: "t1", label: "Spot & Rate", sub: "Curve Feed" }),
      engine:  at(-1.0, 0,    { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "accent", label: "PDE Engine", sub: "Black-Scholes" }),
      riskctl: at(2.8, -3.0,  { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t4", label: "Vega Guard", sub: "Greeks Surface" }),
      alpha:   at(2.8, 3.0,   { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t3", label: "Vol Skew", sub: "SVI Arb Signal" }),
      venue:   at(6.6, 0,     { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "good", label: "Options Desk", sub: "Exotic Router" })
    },
    steps: [
      {
        title: "Market quote calibration & SVI surface construction",
        tag: "Vol Calibration",
        add: ["feed", "engine"],
        links: [["feed", "engine", "req", { lift: 30 }]],
        flows: [["feed", "engine", "req", { label: "Option chains", lift: 30 }]],
        text: "<p>Option chains across strikes and maturities are calibrated to stochastic volatility models (Heston, SVI), enforcing butterfly and calendar arbitrage-free constraints.</p>",
        metrics: {"iv": "18.6% ATM", "gamma": "+4,200 \u0393", "pnl": "$0 Daily"}
      },
      {
        title: "Non-linear Greeks calculation & pin risk immunisation",
        tag: "Greeks Immunisation",
        add: ["riskctl", "alpha"],
        links: [["engine", "alpha", "data", { lift: 28 }], ["engine", "riskctl", "miss", { lift: 28 }]],
        flows: [
          ["engine", "alpha", "data", { label: "Vol skew alpha", lift: 28, pos: 0.42, dy: -6 }],
          ["engine", "riskctl", "miss", { label: "Vega limit", lift: 28, pos: 0.58, dy: -6 }]
        ],
        text: "<p>Sensitivities (Delta, Gamma, Vega, Vanna, Volga) are computed via automated adjoint differentiation, setting tight position limits on gamma pin exposure.</p>",
        metrics: {"iv": "18.2% SVI", "gamma": "+1,100 \u0393", "pnl": "+$14.2k"},
        changed: ["+ Volatility skew mispricing detected", "\u26a1 Vanna-volga hedging bounds applied"]
      },
      {
        title: "Dynamic gamma scalp & delta-neutral rebalancing",
        tag: "Gamma Scalp",
        add: ["venue"],
        links: [["alpha", "venue", "res", { lift: 26 }], ["riskctl", "venue", "res", { lift: 26 }]],
        flows: [
          ["alpha", "venue", "res", { count: 3, dur: 0.7, label: "Delta rebalance", lift: 26, pos: 0.5, dy: -6 }]
        ],
        text: "<p>Automated delta rebalancing scalps gamma profits as the underlying crosses strike thresholds, monetizing realized volatility above implied volatility.</p>",
        metrics: {"iv": "17.9% Realized", "gamma": "+450 \u0393", "pnl": "+$38.6k"},
        changed: ["\u2713 Gamma scalping gains monetized", "\u2713 Vega exposure strictly hedged", "\u2713 Options book immunized"]
      }
    ]
  };
})();
