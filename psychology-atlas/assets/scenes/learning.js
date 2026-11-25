/* Learning Theories: how classical, operant and social learning work */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
window.ATLAS_SCENES["learning/overview"] = {
  unit: 34,
  metrics: [
    { id: "strength", label: "Response strength", tone: "accent" },
    { id: "trials", label: "Trials", tone: "good" },
    { id: "time", label: "Time elapsed" }
  ],
  legend: { req: "stimulus / action", res: "response", data: "reward / observation", miss: "extinction (no reward)" },
  nodes: {
    dog:      { type: "block", x: 0,    y: 0,    w: 1.5, d: 1.5, h: 0.9, color: "t5", label: "Dog", icon: "🐕" },
    bell:     { type: "cyl",   x: 3.5,  y: 0,    r: 0.6, h: 0.8, color: "t2", label: "Bell" },
    food:     { type: "block", x: 6.5,  y: 0,    w: 1.2, d: 1.2, h: 0.8, color: "good", label: "Food" },

    rat:      { type: "block", x: 0,    y: 3,    w: 1.3, d: 1.3, h: 0.7, color: "t3", label: "Rat", icon: "🐭" },
    lever:    { type: "slab",  x: 3.5,  y: 3,    w: 0.8, d: 2.0, h: 0.4, color: "t1", label: "Lever" },
    reward:   { type: "block", x: 6.5,  y: 3,    w: 1.0, d: 1.0, h: 0.9, color: "accent", label: "Food pellet" },

    child:    { type: "block", x: 0,    y: 6,    w: 1.4, d: 1.4, h: 0.8, color: "t4", label: "Child", icon: "👧" },
    parent:   { type: "block", x: 3.5,  y: 6,    w: 1.4, d: 1.4, h: 0.8, color: "t2", label: "Parent", icon: "👨" },
    behave:   { type: "block", x: 6.5,  y: 6,    w: 1.4, d: 1.4, h: 0.8, color: "good", label: "Behavior" }
  },
  steps: [
    {
      title: "Classical Conditioning: Learning by Association",
      tag: "Concept",
      add: ["dog", "food"],
      links: [["food", "dog"]],
      text: "<p>Pavlov discovered that a <b>dog naturally salivates when it sees food</b>. No learning needed—it's reflexive. This is the foundation for classical conditioning.</p>",
      key: "A stimulus that naturally triggers a response is the starting point.",
      flows: [["food", "dog", "res", { label: "natural response" }]]
    },
    {
      title: "Pairing: Bell + Food",
      tag: "Concept",
      add: ["bell"],
      links: [["bell", "dog"], ["food", "dog"]],
      text: "<p>Now Pavlov pairs the <b>bell with food</b> repeatedly. Each time the bell rings, food appears. The dog learns that the bell predicts food.</p>",
      flows: [["bell", "dog", "req", { label: "neutral sound" }], ["food", "dog", "res", { label: "natural salivation" }]],
      metrics: { trials: "1–5", strength: "0%" },
      changed: ["+ Bell introduced as CS", "+ Pairing begins"]
    },
    {
      title: "Conditioning: Bell Alone",
      tag: "Solution",
      text: "<p>After many pairings, something remarkable happens. <b>The bell alone triggers salivation</b>, even without food present. The dog has learned.</p>",
      flows: [["bell", "dog", "res", { label: "conditioned response" }]],
      metrics: { trials: "50+", strength: "95%" },
      changed: ["+ Dog now responds to bell", "~ Response strength 0% → 95%"]
    },
    {
      title: "Extinction: What Happens Without Food?",
      tag: "Insight",
      text: "<p>If you keep ringing the bell <b>without food</b>, the response gradually weakens. The dog stops salivating. The learned association fades—but can spontaneously return weeks later.</p>",
      flows: [["bell", "dog", "miss", { label: "no food follows" }]],
      metrics: { trials: "50+ more", strength: "5%" },
      changed: ["~ Response strength 95% → 5%", "+ Extinction occurs without reinforcement"]
    },
    {
      title: "Operant Conditioning: Learning from Consequences",
      tag: "Concept",
      add: ["rat", "lever", "reward"],
      links: [["rat", "lever"], ["lever", "reward"]],
      focus: ["rat", "lever", "reward"],
      text: "<p>Skinner studied rats in a box with a <b>lever and a food dispenser</b>. The rat naturally explores and accidentally presses the lever. Food drops out. What happens next?</p>",
      key: "Behavior followed by reward tends to repeat. Behavior followed by punishment tends to stop.",
      flows: [["rat", "lever", "res", { label: "accidental press" }], ["lever", "reward", "data", { label: "food!" }]]
    },
    {
      title: "Reinforcement: The Behavior Increases",
      tag: "Insight",
      focus: ["rat", "lever", "reward"],
      text: "<p>The rat presses the lever repeatedly because <b>food follows the behavior</b>. The reward strengthens the behavior. Eventually, the rat presses it hundreds of times per hour.</p>",
      flows: [["rat", "lever", "res", { count: 3, label: "press press press" }], ["lever", "reward", "data", { count: 3, label: "food × 3" }]],
      metrics: { strength: "100%", time: "day 1" },
      changed: ["+ Rat learns lever → food", "+ Behavior rate increases sharply"]
    },
    {
      title: "Schedules: Variable Ratio (Most Powerful)",
      tag: "Idea",
      focus: ["rat", "lever"],
      text: "<p>Skinner discovered that <b>unpredictable rewards create the strongest behavior</b>. If the rat gets food every 5th press (but it varies: 3rd, then 7th, then 4th), it presses persistently and doesn't give up easily.</p>",
      flows: [["rat", "lever", "res", { count: 5, dur: 0.8 }], ["lever", "reward", "data", { label: "reward after varying presses" }]],
      note: "This is why slot machines are so addictive—each pull might win."
    },
    {
      title: "Social Learning: Learning by Observation",
      tag: "Concept",
      add: ["child", "parent", "behave"],
      focus: ["child", "parent"],
      links: [["parent", "behave"], ["parent", "child"]],
      text: "<p>Bandura showed that children <b>learn by watching others</b>, especially people they admire or who look like them. A child watches a parent act kindly to others.</p>",
      flows: [["parent", "behave", "data", { label: "model behavior" }], ["behave", "child", "data", { label: "child observes" }]]
    },
    {
      title: "Imitation: Child Reproduces the Behavior",
      tag: "Solution",
      focus: ["child", "parent", "behave"],
      text: "<p>When the child later interacts with others, they <b>imitate what they observed</b>. No direct reward was needed—the observation and the model's status/likability were enough.</p>",
      flows: [["child", "behave", "res", { label: "child imitates kindness" }]],
      changed: ["+ Child reproduces parent's behavior", "+ Learning without direct reinforcement"]
    },
    {
      title: "Modeling with Reinforcement",
      tag: "Insight",
      focus: ["parent", "child"],
      text: "<p>Learning speeds up if the <b>child sees the parent rewarded</b> for the behavior. The child learns not just what to do, but that the behavior leads to positive outcomes.</p>",
      flows: [["parent", "behave", "res"], ["behave", "reward", "data", { label: "parent is praised" }], ["child", "behave", "res", { label: "child more likely to imitate" }]]
    },
    {
      title: "Three Theories at Work",
      tag: "Recap",
      focus: ["dog", "bell", "rat", "lever", "child", "parent"],
      text: "<p>Three powerful learning mechanisms shape human and animal behavior:</p><ul><li><b>Classical conditioning:</b> Learn associations between stimuli (bell + food)</li><li><b>Operant conditioning:</b> Learn from consequences (behavior → reward or punishment)</li><li><b>Social learning:</b> Learn by watching others (observation → imitation)</li></ul>",
      flows: [["bell", "dog", "res"], ["rat", "lever", "res"], ["child", "behave", "res"]]
    }
  ],
  learn: [
    "How classical conditioning creates learned associations",
    "How reinforcement shapes and strengthens behavior",
    "How observation leads to learning without direct experience",
    "Why variable rewards create the strongest, most persistent behavior",
    "How to combine all three theories for effective behavior change"
  ]
};
