/* Interactive quantitative simulation scene for Autonomous Agents & AI Copilots in Trading */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  function at(s, t, n) {
    var cyl = n.type === "cyl", w = cyl ? 0 : (n.w || 1.6), d = cyl ? 0 : (n.d || 1.6);
    n.x = s + t - w / 2;
    n.y = t - s - d / 2;
    return n;
  }

  window.ATLAS_SCENES["autonomous-agents-copilots/overview"] = {
    unit: 34,
    metrics: [
      {
            "id": "hypo",
            "label": "Hypotheses",
            "tone": "accent"
      },
      {
            "id": "eval",
            "label": "Refusal Rate",
            "tone": "signal"
      },
      {
            "id": "auto",
            "label": "Agent Autonomy",
            "tone": "good"
      },
      {"id": "pnl", "label": "Profit / P&L", "tone": "good"}
    ],
    legend: {"req": "agent prompt", "data": "tool execution", "res": "sandbox code", "miss": "safety critic"},
    nodes: {
      feed:    at(-5.6, 0,    { type: "cyl",   r: 1.1, h: 1.4, color: "t1", label: "Agent Swarm", sub: "Multi-Agent Team" }),
      engine:  at(-1.0, 0,    { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "accent", label: "Orchestrator", sub: "Tool Engine" }),
      riskctl: at(2.8, -3.0,  { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t4", label: "Safety Critic", sub: "Human-in-the-Loop" }),
      alpha:   at(2.8, 3.0,   { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t3", label: "Hypothesis Gen", sub: "Factor Discovery" }),
      venue:   at(6.6, 0,     { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "good", label: "Backtest Sandbox", sub: "Code Execution" })
    },
    steps: [
      {
        title: "Multi-agent autonomous hypothesis generation",
        tag: "Hypothesis Generation",
        add: ["feed", "engine"],
        links: [["feed", "engine", "req", { lift: 30 }]],
        flows: [["feed", "engine", "req", { label: "Agent task brief", lift: 30 }]],
        text: "<p>A swarm of specialized LLM agents reviews market literature, inspects historical anomalies, and synthesizes novel mathematical factor formulations automatically.</p>",
        metrics: {"hypo": "120 Ideas / hr", "eval": "2.4% Fail", "auto": "85%", pnl: "+$0 (Hypothesis)"}
      },
      {
        title: "Automated code synthesis & safety critic verification",
        tag: "Critic Verification",
        add: ["riskctl", "alpha"],
        links: [["engine", "alpha", "data", { lift: 28 }], ["engine", "riskctl", "miss", { lift: 28 }]],
        flows: [
          ["engine", "alpha", "data", { label: "Factor code", lift: 28, pos: 0.42, dy: -6 }],
          ["engine", "riskctl", "miss", { label: "Safety audit", lift: 28, pos: 0.58, dy: -6 }]
        ],
        text: "<p>A code generation agent translates mathematical formulas into vectorized Python, while a safety critic agent audits for lookahead leakage and data mining artifacts.</p>",
        metrics: {"hypo": "84 Audited", "eval": "1.2% Fail", "auto": "92%", pnl: "+$15,900 (+6.4%)"},
        changed: ["+ 18 viable non-linear factors synthesized", "\u26a1 12 candidates rejected due to collinearity or data mining"]
      },
      {
        title: "Isolated sandbox backtesting & strategy submission",
        tag: "Sandbox Execution",
        add: ["venue"],
        links: [["alpha", "venue", "res", { lift: 26 }], ["riskctl", "venue", "res", { lift: 26 }]],
        flows: [
          ["alpha", "venue", "res", { count: 3, dur: 0.7, label: "Validated strategy", lift: 26, pos: 0.5, dy: -6 }]
        ],
        text: "<p>The autonomous pipeline runs out-of-sample backtests in sandboxed Docker containers, preparing complete statistical dossiers for portfolio manager approval.</p>",
        metrics: {"hypo": "4 Flagship", "eval": "0.4% Fail", "auto": "98%", pnl: "+$42,800 (+17.1%)"},
        changed: ["\u2713 Autonomous factor pipeline operational", "\u2713 Strategies verified with out-of-sample Sharpe > 2.0", "\u2713 Dossiers submitted to trading desk"]
      }
    ]
  };
})();
