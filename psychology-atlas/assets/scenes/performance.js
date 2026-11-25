/* Flagship scene: "Performance & Productivity: Yerkes-Dodson, flow channel & burnout prevention" */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
window.ATLAS_SCENES["performance/overview"] = {
  unit: 34,
  metrics: [
    { id: "arousal", label: "Arousal Level", tone: "accent" },
    { id: "flow_depth", label: "Flow Channel", tone: "good" },
    { id: "burnout_risk", label: "Burnout Risk", tone: "signal" }
  ],
  legend: { req: "task challenge", data: "skill mastery", res: "peak flow state", miss: "anxiety overload / burnout" },
  nodes: {
    worker:   { type: "block", x: 0,    y: 3.8,  w: 1.5, d: 1.5, h: 1.0, color: "t3", label: "Knowledge Worker", icon: "🧠" },
    arousal_curve:{ type: "slab", x: 4.2, y: 1.2, w: 1.8, d: 2.0, h: 0.5, color: "accent", label: "Yerkes-Dodson", sub: "Optimal Eustress" },
    flow_chan:{ type: "block", x: 4.2,  y: 6.4,  w: 1.8, d: 1.8, h: 0.9, color: "good", label: "Flow Channel", sub: "Challenge = Skill" },
    recovery: { type: "cyl",   x: 8.8,  y: 3.8,  r: 1.2, h: 1.3, color: "good", label: "Detachment & Rest", sub: "Parasympathetic" },
    peak:     { type: "block", x: 13.5, y: 3.8,  w: 1.8, d: 1.8, h: 1.1, color: "good", label: "Peak Performance", sub: "Sustained Mastery" }
  },
  steps: [
    {
      title: "Calibrating optimal arousal (Yerkes-Dodson)",
      tag: "Arousal",
      add: ["worker", "arousal_curve"],
      links: [["worker", "arousal_curve"]],
      text: "<p>Neither boredom nor panic yields high output. Healthy eustress activates focus and executive functioning without triggering amygdala hijacking.</p>",
      flows: [["worker", "arousal_curve", "req", { label: "manageable pressure" }]],
      metrics: { arousal: "Optimal", flow_depth: "50%", burnout_risk: "Low" }
    },
    {
      title: "Entering the deep Flow channel",
      tag: "Flow",
      add: ["flow_chan"],
      links: [["arousal_curve", "flow_chan"]],
      text: "<p>When challenge matches high capability with zero interruptions, transient hypofrontality silences the inner critic. Hours feel like minutes, and deep creative execution flows effortlessly.</p>",
      flows: [["arousal_curve", "flow_chan", "data", { label: "deep focus" }]],
      metrics: { arousal: "Optimal", flow_depth: "96%", burnout_risk: "Controlled" },
      changed: ["✓ Flow state attained", "✓ Distractions eliminated"]
    },
    {
      title: "Active psychological detachment & burnout prevention",
      tag: "Sustained",
      add: ["recovery", "peak"],
      links: [["flow_chan", "recovery"], ["recovery", "peak"]],
      text: "<p>Peak performance is cyclical, not constant sprinting. Deliberate non-work psychological detachment replenishes cognitive capacity, preventing cynicism and exhaustion.</p>",
      flows: [["flow_chan", "recovery", "data", { label: "disconnect & rest" }], ["recovery", "peak", "res", { count: 4, dur: 0.8, label: "sustainable mastery" }]],
      metrics: { arousal: "Balanced", flow_depth: "98%", burnout_risk: "0%" },
      changed: ["✓ Cognitive reserves replenished", "✓ Sustainable career longevity achieved"]
    }
  ]
};
