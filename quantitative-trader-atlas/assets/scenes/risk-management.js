/* Interactive quantitative simulation scene for Quantitative Risk Management */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  function at(s, t, n) {
    var cyl = n.type === "cyl", w = cyl ? 0 : (n.w || 1.6), d = cyl ? 0 : (n.d || 1.6);
    n.x = s + t - w / 2;
    n.y = t - s - d / 2;
    return n;
  }

  window.ATLAS_SCENES["risk-management/overview"] = {
    unit: 34,
    metrics: [
      {
            "id": "var",
            "label": "99% 1D VaR",
            "tone": "accent"
      },
      {
            "id": "cvar",
            "label": "99% CVaR",
            "tone": "signal"
      },
      {
            "id": "liq",
            "label": "Liquidity Days",
            "tone": "good"
      }
],
    legend: {"req": "live positions", "data": "MC scenario", "res": "de-risk order", "miss": "circuit breaker"},
    nodes: {
      feed:    at(-5.6, 0,    { type: "cyl",   r: 1.1, h: 1.4, color: "t1", label: "Position Book", sub: "Real-Time P&L" }),
      engine:  at(-1.0, 0,    { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "accent", label: "MC Engine", sub: "Risk Engine" }),
      riskctl: at(2.8, -3.0,  { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t4", label: "99% CVaR", sub: "Circuit Breaker" }),
      alpha:   at(2.8, 3.0,   { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t3", label: "Stress Test", sub: "Scenario Shocks" }),
      venue:   at(6.6, 0,     { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "good", label: "Liquidation", sub: "De-Risk Router" })
    },
    steps: [
      {
        title: "Real-time position aggregation & Historical VaR",
        tag: "Position Aggregation",
        add: ["feed", "engine"],
        links: [["feed", "engine", "req", { lift: 30 }]],
        flows: [["feed", "engine", "req", { label: "Live exposures", lift: 30 }]],
        text: "<p>Multi-asset positions across global venues are aggregated into factor exposures. Full revaluation under 10 years of historical returns computes empirical Value-at-Risk quantiles.</p>",
        metrics: {"var": "$1.42M VaR", "cvar": "$2.15M CVaR", "liq": "2.4 Days"}
      },
      {
        title: "Extreme Value Theory & Monte Carlo stress testing",
        tag: "Tail Risk Modeling",
        add: ["riskctl", "alpha"],
        links: [["engine", "alpha", "data", { lift: 28 }], ["engine", "riskctl", "miss", { lift: 28 }]],
        flows: [
          ["engine", "alpha", "data", { label: "Stress scenario", lift: 28, pos: 0.42, dy: -6 }],
          ["engine", "riskctl", "miss", { label: "Breaker monitor", lift: 28, pos: 0.58, dy: -6 }]
        ],
        text: "<p>Generalized Pareto distributions fit the fat tails of the loss distribution via Peak-Over-Threshold EVT. Severe macroeconomic and liquidity shocks test solvency.</p>",
        metrics: {"var": "$1.18M VaR", "cvar": "$1.62M CVaR", "liq": "1.8 Days"},
        changed: ["+ Extreme Value Theory tail estimates active", "\u26a1 Automated de-risking triggers calibrated at 99% CVaR"]
      },
      {
        title: "Dynamic margin allocation & automated de-risking",
        tag: "De-Risking",
        add: ["venue"],
        links: [["alpha", "venue", "res", { lift: 26 }], ["riskctl", "venue", "res", { lift: 26 }]],
        flows: [
          ["alpha", "venue", "res", { count: 3, dur: 0.7, label: "De-risk order", lift: 26, pos: 0.5, dy: -6 }]
        ],
        text: "<p>When tail losses approach predefined capital buffers, automated liquidation algorithms slice illiquid positions across venues, preserving fund solvency without causing fire-sale slippage.</p>",
        metrics: {"var": "$0.84M VaR", "cvar": "$1.12M CVaR", "liq": "0.9 Days"},
        changed: ["\u2713 Portfolio tail risk strictly bounded", "\u2713 Margin usage normalized under 45%", "\u2713 Risk guard live"]
      }
    ]
  };
})();
