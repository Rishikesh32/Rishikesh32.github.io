/* Flagship scene: "AI tools, ethics & career growth" */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
window.ATLAS_SCENES["career/overview"] = {
  unit: 34,
  metrics: [
    { id: "hours", label: "Hours saved / wk", tone: "accent" },
    { id: "trust", label: "Governance score", tone: "good" },
    { id: "impact", label: "Strategic impact", tone: "good" }
  ],
  legend: { req: "prompt / input", data: "automated pipeline", res: "strategic decision", miss: "hallucination / PII leak" },
  nodes: {
    analyst:  { type: "block", x: 0,    y: 3.8,  w: 1.5, d: 1.5, h: 1.0, color: "t4", label: "Data Analyst", icon: "👨‍💻" },
    copilot:  { type: "slab",  x: 4.0,  y: 0.8,  w: 1.6, d: 1.6, h: 0.6, color: "accent", label: "AI Assistant", sub: "Prompt + Schema" },
    verify:   { type: "block", x: 8.0,  y: 0.8,  w: 1.6, d: 1.6, h: 0.9, color: "good", label: "Verification", sub: "Sanity checks" },
    pipeline: { type: "block", x: 4.0,  y: 6.8,  w: 1.6, d: 1.6, h: 0.9, color: "t2", label: "Automation", sub: "Scheduled script" },
    privacy:  { type: "block", x: 8.0,  y: 6.8,  w: 1.6, d: 1.6, h: 0.9, color: "t5", label: "Privacy guard", sub: "k-anonymity" },
    impact_hub:{ type: "cyl",  x: 12.5, y: 3.8,  r: 1.2, h: 1.3, color: "good", label: "Strategic Impact", sub: "Exec decisions" }
  },
  steps: [
    {
      title: "AI-assisted query drafting with verification",
      tag: "Leverage",
      add: ["analyst", "copilot", "verify"],
      links: [["analyst", "copilot"], ["copilot", "verify"]],
      text: "<p>The analyst feeds schema, grain, and business definitions to an AI assistant, then runs row-count and sample cross-checks to catch subtle hallucinations before queries run in production.</p>",
      flows: [["analyst", "copilot", "req", { label: "schema + prompt" }], ["copilot", "verify", "data", { label: "draft SQL" }]],
      metrics: { hours: "6 hrs", trust: "95%", impact: "Medium" }
    },
    {
      title: "Automated pipelines & privacy guards",
      tag: "Responsibility",
      add: ["pipeline", "privacy"],
      links: [["analyst", "pipeline"], ["pipeline", "privacy"]],
      text: "<p>Recurring manual reports run on scheduled pipelines with alerting on failure. PII and quasi-identifiers are hashed or generalized to protect customer privacy.</p>",
      flows: [["analyst", "pipeline", "req", { label: "parameterized run" }], ["pipeline", "privacy", "data", { label: "mask PII" }]],
      metrics: { hours: "18 hrs", trust: "99.8%", impact: "High" },
      changed: ["+ Scheduled pipeline active", "✓ k-anonymity checks passed", "+ Alert webhooks configured"]
    },
    {
      title: "High-leverage strategic partnership",
      tag: "Growth",
      add: ["impact_hub"],
      links: [["verify", "impact_hub"], ["privacy", "impact_hub"]],
      text: "<p>Freed from routine reporting and armed with trustworthy metrics, the analyst drives strategic business decisions, building a reputation as an indispensable trusted partner.</p>",
      flows: [["verify", "impact_hub", "res", { count: 3, dur: 0.8, label: "verified insight" }], ["privacy", "impact_hub", "res", { count: 3, dur: 0.8, label: "clean report" }]],
      metrics: { hours: "24 hrs", trust: "100%", impact: "Top tier" },
      changed: ["✓ Weekly hours saved: 24+", "✓ Promotion to Lead Analyst", "🚀 High-impact business outcomes"]
    }
  ]
};
