/* Flagship scene: "Statistics foundations: distributions, sampling & inference" */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
window.ATLAS_SCENES["statistics/overview"] = {
  unit: 34,
  metrics: [
    { id: "mean", label: "Sample Mean", tone: "accent" },
    { id: "se", label: "Standard Error", tone: "good" },
    { id: "ci", label: "95% Conf Interval", tone: "good" }
  ],
  legend: { req: "random draw", data: "sample batch", res: "parameter estimate", miss: "outlier / skew" },
  nodes: {
    pop:      { type: "cyl",   x: 0,    y: 3.8,  r: 1.4, h: 1.5, color: "t1", label: "Population", sub: "N = 500,000" },
    sampler:  { type: "slab",  x: 4.2,  y: 3.8,  w: 1.5, d: 2.0, h: 0.5, color: "accent", label: "Random Sampler", sub: "iid draws" },
    batch1:   { type: "block", x: 8.5,  y: 1.5,  w: 1.5, d: 1.5, h: 0.9, color: "t3", label: "Sample n = 100", sub: "Batch 1" },
    batch2:   { type: "block", x: 8.5,  y: 6.0,  w: 1.5, d: 1.5, h: 0.9, color: "t3", label: "Sample n = 1,000", sub: "Batch 2" },
    clt:      { type: "block", x: 13.0, y: 3.8,  w: 2.0, d: 2.0, h: 1.1, color: "good", label: "CLT Bell Curve", sub: "Normal Distribution" }
  },
  steps: [
    {
      title: "Unknown skewed population",
      tag: "Population",
      add: ["pop"],
      text: "<p>Real-world business data (orders, user lifetimes) is heavily right-skewed. The underlying population mean \(\mu\) and variance \(\sigma^2\) are unknown.</p>",
      metrics: { mean: "Unknown", se: "Unknown", ci: "None" }
    },
    {
      title: "Random independent sampling",
      tag: "Sampling",
      add: ["sampler", "batch1", "batch2"],
      links: [["pop", "sampler"], ["sampler", "batch1"], ["sampler", "batch2"]],
      text: "<p>Random independent sampling draws batches of users. A small sample of \(n=100\) carries substantial variance; \(n=1,000\) reduces standard error by \(\sqrt{10}\).</p>",
      flows: [["pop", "sampler", "req", { label: "iid draw" }], ["sampler", "batch1", "data", { label: "n=100" }], ["sampler", "batch2", "data", { label: "n=1000" }]],
      metrics: { mean: "$124.50", se: "$12.40", ci: "[$100.2, $148.8]" },
      changed: ["+ Samples drawn", "⚡ SE scales as 1/sqrt(n)"]
    },
    {
      title: "Central Limit Theorem convergence",
      tag: "Inference",
      add: ["clt"],
      links: [["batch2", "clt"]],
      text: "<p>As sample size grows, the distribution of sample means becomes normal. We construct narrow 95% confidence intervals and test hypotheses with high statistical power.</p>",
      flows: [["batch2", "clt", "res", { count: 4, dur: 0.8, label: "CLT convergence" }]],
      metrics: { mean: "$124.80", se: "$3.90", ci: "[$117.1, $132.5]" },
      changed: ["✓ Normal convergence confirmed", "✓ Precision tripled with n=1,000", "✓ Trustworthy inference unlocked"]
    }
  ]
};
