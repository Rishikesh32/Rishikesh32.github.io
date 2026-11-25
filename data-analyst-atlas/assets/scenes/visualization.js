/* Flagship scene: "Data visualization: perceptual encoding & visual storytelling" */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
window.ATLAS_SCENES["visualization/overview"] = {
  unit: 34,
  metrics: [
    { id: "read_time", label: "Time to insight", tone: "good" },
    { id: "accuracy", label: "Perceptual accuracy", tone: "good" },
    { id: "clutter", label: "Data-ink ratio", tone: "accent" }
  ],
  legend: { req: "raw metric", data: "visual encoding", res: "clear insight", miss: "misleading 3D / truncated axis" },
  nodes: {
    raw_data: { type: "cyl",   x: 0,    y: 3.8,  r: 1.3, h: 1.4, color: "t1", label: "Raw Records", sub: "12 Regions" },
    bad_pie:  { type: "block", x: 4.5,  y: 1.2,  w: 1.6, d: 1.6, h: 0.8, color: "signal", label: "3D Pie Chart", sub: "Angles & Area" },
    good_bar: { type: "block", x: 4.5,  y: 6.4,  w: 1.6, d: 1.6, h: 0.8, color: "accent", label: "Sorted Bars", sub: "Common Baseline" },
    declutter:{ type: "slab",  x: 9.0,  y: 6.4,  w: 1.6, d: 2.0, h: 0.5, color: "good", label: "Decluttering", sub: "Remove chartjunk" },
    story:    { type: "block", x: 13.5, y: 3.8,  w: 2.0, d: 2.0, h: 1.1, color: "good", label: "Direct Annotation", sub: "Insight Headline" }
  },
  steps: [
    {
      title: "Raw table to visual choice",
      tag: "Choice",
      add: ["raw_data", "bad_pie", "good_bar"],
      links: [["raw_data", "bad_pie"], ["raw_data", "good_bar"]],
      text: "<p>Comparing 12 regional sales figures: A 3D pie chart forces readers to decode 2D angles and warped perspectives, whereas an aligned horizontal bar chart leverages the highest-precision perceptual channel.</p>",
      flows: [["raw_data", "bad_pie", "miss", { label: "warped angles" }], ["raw_data", "good_bar", "data", { label: "aligned length" }]],
      metrics: { read_time: "14.2s", accuracy: "62%", clutter: "Low" }
    },
    {
      title: "Maximizing the data-ink ratio",
      tag: "Declutter",
      add: ["declutter"],
      links: [["good_bar", "declutter"]],
      text: "<p>Removing dark gridlines, heavy borders, and redundant decimal places elevates the data. Zero-baseline ensures proportional honesty.</p>",
      flows: [["good_bar", "declutter", "data", { label: "strip noise" }]],
      metrics: { read_time: "5.1s", accuracy: "94%", clutter: "High" },
      changed: ["✓ Dark gridlines removed", "✓ Bars sorted by value descending", "✓ Accessible palette applied"]
    },
    {
      title: "Direct annotation & executive takeaway",
      tag: "Story",
      add: ["story"],
      links: [["declutter", "story"]],
      text: "<p>Direct labeling places numbers next to the data rather than in disconnected legends. The active title announces the finding: <em>'West Region led growth (+24%) following Q2 expansion'</em>.</p>",
      flows: [["declutter", "story", "res", { count: 3, dur: 0.8, label: "instant comprehension" }]],
      metrics: { read_time: "1.8s", accuracy: "99.5%", clutter: "Optimal" },
      changed: ["✓ Time to insight reduced to under 2 seconds", "✓ Zero cognitive ambiguity"]
    }
  ]
};
