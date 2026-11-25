/* Flagship scene: "Motivation & Influence: drives, persuasion & goal architecture" */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
window.ATLAS_SCENES["motivation/overview"] = {
  unit: 34,
  metrics: [
    { id: "drive", label: "Intrinsic Drive", tone: "accent" },
    { id: "compliance", label: "Influence Rate", tone: "good" },
    { id: "goal_comp", label: "Goal Completion", tone: "good" }
  ],
  legend: { req: "cue / appeal", data: "internal drive", res: "sustained action", miss: "overjustification crowd-out" },
  nodes: {
    individual: { type: "block", x: 0,    y: 3.8,  w: 1.5, d: 1.5, h: 1.0, color: "t1", label: "Person", icon: "👤" },
    sdt:        { type: "slab",  x: 4.2,  y: 1.2,  w: 1.6, d: 2.0, h: 0.6, color: "accent", label: "Self-Determination", sub: "Autonomy & Mastery" },
    cialdini:   { type: "block", x: 4.2,  y: 6.4,  w: 1.6, d: 1.6, h: 0.9, color: "t3", label: "Persuasion Cues", sub: "Reciprocity / Social Proof" },
    reward_sys: { type: "cyl",   x: 8.8,  y: 3.8,  r: 1.1, h: 1.2, color: "good", label: "Dopamine Loop", sub: "Variable reinforcement" },
    goal_engine:{ type: "block", x: 13.5, y: 3.8,  w: 1.8, d: 1.8, h: 1.1, color: "good", label: "Execution Engine", sub: "If-Then Intentions" }
  },
  steps: [
    {
      title: "Intrinsic foundations: Autonomy & mastery",
      tag: "Drive",
      add: ["individual", "sdt"],
      links: [["individual", "sdt"]],
      text: "<p>Deep motivation thrives when three core psychological needs are met: <b>Autonomy</b> (choice), <b>Competence</b> (mastery), and <b>Relatedness</b> (belonging). Extrinsic incentives without autonomy erode natural interest.</p>",
      flows: [["individual", "sdt", "data", { label: "internal purpose" }]],
      metrics: { drive: "90%", compliance: "40%", goal_comp: "55%" }
    },
    {
      title: "Principles of ethical persuasion",
      tag: "Influence",
      add: ["cialdini"],
      links: [["sdt", "cialdini"]],
      text: "<p>Robert Cialdini's six universal principles—reciprocity, social proof, commitment, authority, liking, and scarcity—shape how decisions are framed and adopted ethically.</p>",
      flows: [["sdt", "cialdini", "req", { label: "social proof + commitment" }]],
      metrics: { drive: "90%", compliance: "82%", goal_comp: "68%" },
      changed: ["+ Applied consistency & reciprocity", "✓ Influence rate doubled"]
    },
    {
      title: "Goal architecture: If-then execution",
      tag: "Execution",
      add: ["reward_sys", "goal_engine"],
      links: [["cialdini", "reward_sys"], ["reward_sys", "goal_engine"]],
      text: "<p>Vague intentions fail. Pairing challenging specific milestones with <b>implementation intentions</b> (<em>'If event X occurs, then I do Y'</em>) automates execution and creates lasting achievement.</p>",
      flows: [["reward_sys", "goal_engine", "res", { count: 4, dur: 0.8, label: "automatic follow-through" }]],
      metrics: { drive: "94%", compliance: "88%", goal_comp: "92%" },
      changed: ["✓ Implementation intentions locked", "✓ Goal completion elevated to 92%"]
    }
  ]
};
