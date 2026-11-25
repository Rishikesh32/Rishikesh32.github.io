/* Flagship scene: "Change Management: resistance, adoption curves & habit architecture" */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
window.ATLAS_SCENES["change/overview"] = {
  unit: 34,
  metrics: [
    { id: "adoption_rate", label: "Adoption Rate", tone: "good" },
    { id: "resistance", label: "Inertia / Friction", tone: "signal" },
    { id: "habit_str", label: "Habit Automaticity", tone: "accent" }
  ],
  legend: { req: "catalyst / cue", data: "pilot adoption", res: "refrozen norm", miss: "status quo bias / stall" },
  nodes: {
    status_quo: { type: "block", x: 0,    y: 3.8,  w: 1.6, d: 1.6, h: 1.2, color: "t1", label: "Status Quo", sub: "Loss Aversion" },
    unfreeze:   { type: "slab",  x: 4.2,  y: 1.2,  w: 1.8, d: 2.0, h: 0.5, color: "accent", label: "Unfreeze / Catalyst", sub: "Kotter Urgency" },
    chasm_pilot:{ type: "block", x: 4.2,  y: 6.4,  w: 1.8, d: 1.8, h: 0.9, color: "good", label: "Early Adopter Pilot", sub: "Rogers Curve" },
    habit_loop: { type: "cyl",   x: 8.8,  y: 3.8,  r: 1.2, h: 1.3, color: "good", label: "Cue-Routine-Reward", sub: "B=MAP Loop" },
    refreeze:   { type: "block", x: 13.5, y: 3.8,  w: 2.0, d: 2.0, h: 1.1, color: "good", label: "Refrozen Culture", sub: "Institutional Norm" }
  },
  steps: [
    {
      title: "Overcoming the status quo bias & unfreezing",
      tag: "Unfreeze",
      add: ["status_quo", "unfreeze"],
      links: [["status_quo", "unfreeze"]],
      text: "<p>Loss aversion anchors teams to familiar routines. Establishing a compelling sense of urgency unfreezes outdated assumptions and highlights the cost of inaction.</p>",
      flows: [["status_quo", "unfreeze", "req", { label: "destabilize complacency" }]],
      metrics: { adoption_rate: "12%", resistance: "High", habit_str: "Weak" }
    },
    {
      title: "Crossing the adoption chasm with early champions",
      tag: "Adoption",
      add: ["chasm_pilot"],
      links: [["unfreeze", "chasm_pilot"]],
      text: "<p>Rather than mandating compliance, run pilots with enthusiastic Early Adopters. Documenting quick wins creates internal peer proof that pulls the pragmatic majority across the chasm.</p>",
      flows: [["unfreeze", "chasm_pilot", "data", { label: "visible early wins" }]],
      metrics: { adoption_rate: "54%", resistance: "Moderate", habit_str: "Building" },
      changed: ["✓ Pilot team live (+40% efficiency)", "✓ Pragmatic majority engaging"]
    },
    {
      title: "Habit automation & refreezing into organizational DNA",
      tag: "Refreeze",
      add: ["habit_loop", "refreeze"],
      links: [["chasm_pilot", "habit_loop"], ["habit_loop", "refreeze"]],
      text: "<p>New workflows are designed around clear environmental cues and immediate feedback. The transformation refreezes into default company culture.</p>",
      flows: [["chasm_pilot", "habit_loop", "data", { label: "cue-routine" }], ["habit_loop", "refreeze", "res", { count: 4, dur: 0.8, label: "default culture" }]],
      metrics: { adoption_rate: "94%", resistance: "Near zero", habit_str: "Automatic" },
      changed: ["✓ 94% company-wide adoption", "✓ New workflow refrozen as default standard"]
    }
  ]
};
