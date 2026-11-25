/* Flagship scene: "Communication, Influence & Conflict Resolution" */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
window.ATLAS_SCENES["communication/overview"] = {
  unit: 34,
  metrics: [
    { id: "empathy", label: "Perspective Accuracy", tone: "good" },
    { id: "alignment", label: "Integrative Value", tone: "accent" },
    { id: "tension", label: "Conflict Tension", tone: "signal" }
  ],
  legend: { req: "active listening", data: "interest trade-off", res: "win-win agreement", miss: "reactance / escalated conflict" },
  nodes: {
    party_a:  { type: "block", x: 0,    y: 3.8,  w: 1.5, d: 1.5, h: 1.0, color: "t2", label: "Speaker A", icon: "🗣️" },
    listen:   { type: "slab",  x: 4.2,  y: 1.2,  w: 1.6, d: 2.0, h: 0.6, color: "accent", label: "Active Listening", sub: "Cognitive Empathy" },
    party_b:  { type: "block", x: 0,    y: 7.2,  w: 1.5, d: 1.5, h: 1.0, color: "t3", label: "Speaker B", icon: "👤" },
    zopa:     { type: "cyl",   x: 8.8,  y: 4.2,  r: 1.2, h: 1.3, color: "good", label: "ZOPA / BATNA", sub: "Harvard Project" },
    deal:     { type: "block", x: 13.5, y: 4.2,  w: 1.8, d: 1.8, h: 1.1, color: "good", label: "Integrative Deal", sub: "Expanded Pie" }
  },
  steps: [
    {
      title: "Active listening & de-escalating reactance",
      tag: "Listen",
      add: ["party_a", "party_b", "listen"],
      links: [["party_a", "listen"], ["party_b", "listen"]],
      text: "<p>Instead of escalating positional arguments, both sides practice active listening and perspective taking. Separating facts from emotional needs defuses psychological reactance.</p>",
      flows: [["party_a", "listen", "req", { label: "uncover interests" }], ["party_b", "listen", "req", { label: "clarify needs" }]],
      metrics: { empathy: "88%", alignment: "40%", tension: "Low" }
    },
    {
      title: "Mapping the bargaining zone (ZOPA & BATNA)",
      tag: "Negotiate",
      add: ["zopa"],
      links: [["listen", "zopa"]],
      text: "<p>Understanding both sides' walk-away alternatives (BATNA) uncovers the Zone of Possible Agreement. Moving away from fixed-pie bargaining opens the door to multi-issue trade-offs.</p>",
      flows: [["listen", "zopa", "data", { label: "expand options" }]],
      metrics: { empathy: "92%", alignment: "78%", tension: "Very low" },
      changed: ["✓ BATNA mapped", "✓ ZOPA identified"]
    },
    {
      title: "Collaborative win-win resolution",
      tag: "Agreement",
      add: ["deal"],
      links: [["zopa", "deal"]],
      text: "<p>By trading low-cost items of high value to the other party, the negotiation produces an integrative win-win agreement that strengthens long-term partnership.</p>",
      flows: [["zopa", "deal", "res", { count: 4, dur: 0.8, label: "integrative pact" }]],
      metrics: { empathy: "98%", alignment: "96%", tension: "Resolved" },
      changed: ["✓ Win-win agreement executed", "✓ Long-term trust solidified"]
    }
  ]
};
