/* Flagship scene: "Team & Group Dynamics: safety, leadership & cooperation" */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
window.ATLAS_SCENES["teams/overview"] = {
  unit: 34,
  metrics: [
    { id: "safety", label: "Psychological Safety", tone: "good" },
    { id: "velocity", label: "Team Velocity", tone: "accent" },
    { id: "groupthink", label: "Groupthink Risk", tone: "signal" }
  ],
  legend: { req: "idea / dissent", data: "collaborative flow", res: "innovative delivery", miss: "social loafing / conformity" },
  nodes: {
    leader:   { type: "block", x: 0,    y: 3.8,  w: 1.5, d: 1.5, h: 1.2, color: "t4", label: "Servant Leader", icon: "🧭" },
    safety_env:{ type: "slab", x: 4.2,  y: 3.8,  w: 1.8, d: 2.2, h: 0.5, color: "accent", label: "Safety Culture", sub: "Edmondson model" },
    dev_a:    { type: "block", x: 8.5,  y: 1.5,  w: 1.4, d: 1.4, h: 0.9, color: "t2", label: "Member A", icon: "👩‍💻" },
    dev_b:    { type: "block", x: 8.5,  y: 6.2,  w: 1.4, d: 1.4, h: 0.9, color: "t3", label: "Member B", icon: "👨‍💻" },
    devil:    { type: "block", x: 12.5, y: 1.5,  w: 1.5, d: 1.5, h: 0.9, color: "good", label: "Devil's Advocate", sub: "Healthy Dissent" },
    synthesis:{ type: "block", x: 13.5, y: 5.5,  w: 1.8, d: 1.8, h: 1.1, color: "good", label: "High Performance", sub: "Tit-for-Tat Sync" }
  },
  steps: [
    {
      title: "Establishing psychological safety",
      tag: "Culture",
      add: ["leader", "safety_env"],
      links: [["leader", "safety_env"]],
      text: "<p>The leader models fallibility and invites questions, establishing <b>psychological safety</b> where admitting errors and proposing bold hypotheses carries zero interpersonal penalty.</p>",
      flows: [["leader", "safety_env", "data", { label: "empowerment" }]],
      metrics: { safety: "92%", velocity: "60%", groupthink: "Low" }
    },
    {
      title: "Combatting groupthink with institutional dissent",
      tag: "Decisions",
      add: ["dev_a", "dev_b", "devil"],
      links: [["safety_env", "dev_a"], ["safety_env", "dev_b"], ["dev_a", "devil"]],
      text: "<p>Instead of rushing to premature consensus, team members debate hypotheses. A designated Devil's Advocate tests blind spots, eradicating groupthink and social loafing.</p>",
      flows: [["dev_a", "devil", "req", { label: "challenge premise" }], ["dev_b", "devil", "req", { label: "propose alternate" }]],
      metrics: { safety: "95%", velocity: "84%", groupthink: "Near zero" },
      changed: ["✓ Psychological safety: 95%", "✓ Constructive dissent normalized"]
    },
    {
      title: "Iterated cooperation & high-velocity output",
      tag: "Performing",
      add: ["synthesis"],
      links: [["dev_b", "synthesis"], ["devil", "synthesis"]],
      text: "<p>Tuckman's Performing stage achieved. Operating under transparent Tit-for-Tat norms, the team executes with high alignment, mutual accountability, and resilient cohesion.</p>",
      flows: [["devil", "synthesis", "res", { count: 4, dur: 0.8, label: "breakthrough delivery" }]],
      metrics: { safety: "98%", velocity: "96%", groupthink: "0%" },
      changed: ["✓ High performance unlocked", "✓ Social loafing eliminated"]
    }
  ]
};
