/* Flagship scene: "Mental Health & Well-being: nervous system regulation & resilience" */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
window.ATLAS_SCENES["wellbeing/overview"] = {
  unit: 34,
  metrics: [
    { id: "vagal", label: "Vagal Tone (Calm)", tone: "good" },
    { id: "resilience", label: "Resilience Score", tone: "good" },
    { id: "cortisol", label: "Stress Cortisol", tone: "signal" }
  ],
  legend: { req: "stressor / threat", data: "reappraisal / breath", res: "restorative flourishing", miss: "catastrophizing / rumination" },
  nodes: {
    stressor: { type: "block", x: 0,    y: 3.8,  w: 1.5, d: 1.5, h: 1.2, color: "signal", label: "Acute Stressor", icon: "⚡" },
    cbt_lens: { type: "slab",  x: 4.2,  y: 1.2,  w: 1.8, d: 2.0, h: 0.5, color: "accent", label: "CBT Reappraisal", sub: "Challenge automatic thoughts" },
    somatic:  { type: "block", x: 4.2,  y: 6.4,  w: 1.8, d: 1.8, h: 0.9, color: "good", label: "Physiological Sigh", sub: "Parasympathetic brake" },
    mindset:  { type: "cyl",   x: 8.8,  y: 3.8,  r: 1.2, h: 1.3, color: "good", label: "Growth & Self-Compassion", sub: "ACT flexibility" },
    perma:    { type: "block", x: 13.5, y: 3.8,  w: 2.0, d: 2.0, h: 1.1, color: "good", label: "PERMA Flourishing", sub: "Meaning & Connection" }
  },
  steps: [
    {
      title: "Deconstructing the stress response & automatic thoughts",
      tag: "Awareness",
      add: ["stressor", "cbt_lens"],
      links: [["stressor", "cbt_lens"]],
      text: "<p>When unexpected stressors strike, catastrophic automatic thoughts can trigger fight-or-flight distress. <b>Cognitive reappraisal</b> catches cognitive distortions before panic sets in.</p>",
      flows: [["stressor", "cbt_lens", "req", { label: "examine evidence" }]],
      metrics: { vagal: "35%", resilience: "45%", cortisol: "Elevated" }
    },
    {
      title: "Somatic regulation: The parasympathetic brake",
      tag: "Regulation",
      add: ["somatic"],
      links: [["cbt_lens", "somatic"]],
      text: "<p>The <b>physiological sigh</b> (two quick nasal inhales, one long mouth exhale) immediately activates the vagus nerve, slowing heart rate and dumping carbon dioxide within seconds.</p>",
      flows: [["cbt_lens", "somatic", "data", { label: "vagal activation" }]],
      metrics: { vagal: "82%", resilience: "78%", cortisol: "Declining" },
      changed: ["✓ Parasympathetic rest-and-digest activated", "✓ Heart rate calmed"]
    },
    {
      title: "Sustained flourishing & human connection (PERMA)",
      tag: "Flourishing",
      add: ["mindset", "perma"],
      links: [["somatic", "mindset"], ["mindset", "perma"]],
      text: "<p>Resilience is sustained through psychological flexibility, self-compassion, and deep social relationships. The PERMA model anchors lasting mental well-being and life satisfaction.</p>",
      flows: [["somatic", "mindset", "data", { label: "values alignment" }], ["mindset", "perma", "res", { count: 4, dur: 0.8, label: "deep flourishing" }]],
      metrics: { vagal: "96%", resilience: "95%", cortisol: "Optimal" },
      changed: ["✓ Psychological flexibility locked", "✓ Meaning, connection & vitality restored"]
    }
  ]
};
