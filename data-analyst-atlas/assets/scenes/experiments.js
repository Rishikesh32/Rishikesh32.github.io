/* Flagship scene: "A/B testing & experiments pipeline" */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
window.ATLAS_SCENES["experiments/overview"] = {
  unit: 34,
  metrics: [
    { id: "visitors", label: "Visitors", tone: "accent" },
    { id: "srm", label: "SRM p-value", tone: "good" },
    { id: "lift", label: "Estimated lift", tone: "accent" },
    { id: "conf", label: "Confidence", tone: "good" }
  ],
  legend: { req: "traffic split", data: "conversions", res: "lift measurement", miss: "SRM or peeking trap" },
  nodes: {
    traffic:  { type: "block", x: 0,    y: 3.8,  w: 1.5, d: 1.5, h: 0.9, color: "t5", label: "User traffic", icon: "👥" },
    hash:     { type: "slab",  x: 3.5,  y: 3.8,  w: 1.2, d: 1.8, h: 0.5, color: "t2", label: "Hash router", sub: "Murmur3" },
    ctrl:     { type: "block", x: 7.2,  y: 1.5,  w: 1.6, d: 1.6, h: 1.0, color: "t3", label: "Control (A)", sub: "Baseline 5.0%" },
    treat:    { type: "block", x: 7.2,  y: 6.0,  w: 1.6, d: 1.6, h: 1.0, color: "accent", label: "Variant (B)", sub: "New checkout" },
    metrics:  { type: "cyl",   x: 11.0, y: 3.8,  r: 1.1, h: 1.2, color: "good", label: "Event log", sub: "Warehouse" },
    evaluator:{ type: "block", x: 14.5, y: 3.8,  w: 1.8, d: 1.8, h: 1.1, color: "t4", label: "Stat engine", sub: "Welch t-test" }
  },
  steps: [
    {
      title: "Randomized traffic assignment",
      tag: "Design",
      add: ["traffic", "hash"],
      links: [["traffic", "hash"]],
      text: "<p>Incoming users are salted and hashed (e.g. <code>hash(user_id + salt) % 100</code>) to ensure stable, mutually exclusive, uniform bucketing.</p>",
      flows: [["traffic", "hash", "req", { count: 6, dur: 1.0, label: "user sessions" }]],
      metrics: { visitors: "0", srm: "1.00", lift: "0.0%", conf: "0%" }
    },
    {
      title: "Clean 50/50 allocation & SRM validation",
      tag: "Check",
      add: ["ctrl", "treat"],
      links: [["hash", "ctrl"], ["hash", "treat"]],
      text: "<p>Users are routed to Control (50%) and Treatment (50%). A chi-square test monitors allocation in real-time to detect Sample Ratio Mismatch.</p>",
      flows: [["hash", "ctrl", "req", { count: 3, dur: 1.0, label: "50%" }], ["hash", "treat", "req", { count: 3, dur: 1.0, label: "50%" }]],
      metrics: { visitors: "10,000", srm: "0.49", lift: "--", conf: "--" },
      changed: ["+ Control & Variant live", "✓ Chi-square p = 0.49 (No SRM)"]
    },
    {
      title: "Data collection & event pipeline",
      tag: "Pipeline",
      add: ["metrics"],
      links: [["ctrl", "metrics"], ["treat", "metrics"]],
      text: "<p>Conversion events and guardrail metrics flow into the warehouse. We pre-specify sample size (100,000 users) to avoid the peeking trap.</p>",
      flows: [["ctrl", "metrics", "data", { label: "orders" }], ["treat", "metrics", "data", { label: "orders" }]],
      metrics: { visitors: "50,000", srm: "0.52", lift: "+8.2%", conf: "88%" },
      changed: ["+ Logging conversions", "⚡ Reached 50% power target"]
    },
    {
      title: "Evaluation: Statistically significant lift",
      tag: "Decision",
      add: ["evaluator"],
      links: [["metrics", "evaluator"]],
      text: "<p>The experiment concludes at full sample size. Two-sided t-test shows +6.4% lift [95% CI: +2.1%, +10.7%] with p = 0.004 < 0.05. Ready to ship!</p>",
      flows: [["metrics", "evaluator", "res", { count: 4, dur: 0.8, label: "t-stat: 2.88" }]],
      metrics: { visitors: "102,400", srm: "0.51", lift: "+6.4%", conf: "99.6%" },
      changed: ["✓ p = 0.004 (Statistically Significant)", "✓ Guardrail latency unaffected", "🚀 Feature rolled to 100%"]
    }
  ]
};
