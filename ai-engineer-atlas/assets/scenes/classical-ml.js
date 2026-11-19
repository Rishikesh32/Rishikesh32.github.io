/* Flagship scene: "will this model work on data it hasn't seen?" (plays on the Classical ML overview).
   Example: monthly customer-churn snapshots, 50,000 rows, 18% churned within 30 days.
   All scores are illustrative but consistent: the "nobody churns" baseline is 82% accuracy,
   and the test interval is 1.96 * sqrt(0.869 * 0.131 / 8,500) ≈ ±0.7 points. */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  "use strict";

  /* ---------- overlay helpers ---------- */
  function txt(ctx, g, x, y, s, o) {
    o = o || {};
    var t = ctx.el("text", { x: x, y: y, "font-size": o.size || 11, "text-anchor": o.anchor || "start", "font-weight": o.bold ? 700 : 500, style: "fill:" + (o.color || "var(--ink)") + ";font-family:var(--font-mono)" }, g);
    t.textContent = s; return t;
  }
  function card(ctx, svg, x, y, w, h, title) {
    var g = ctx.el("g", { class: "cml-card" }, svg);
    ctx.el("rect", { x: x, y: y, width: w, height: h, rx: 10, style: "fill:var(--surface);stroke:var(--ink);stroke-width:1.4" }, g);
    if (title) txt(ctx, g, x + 12, y + 19, title, { size: 10, bold: true, color: "var(--ink-2)" });
    return g;
  }

  /* Accuracy vs number of trees for a deep (depth 12) model: train climbs, validation peaks then sags. */
  function overfitCurve(svg, ctx) {
    var a = ctx.anchor("model"), W = 214, H = 132, x0 = a[0] + 100, y0 = a[1] - 70;
    var g = card(ctx, svg, x0, y0, W, H, "ACCURACY VS TREES (DEPTH 12)");
    var px = x0 + 30, py = y0 + 32, pw = W - 46, ph = H - 62;
    var lo = 80, hi = 100;
    function X(t) { return px + pw * t / 3000; }
    function Y(v) { return py + ph * (hi - v) / (hi - lo); }
    ctx.el("line", { x1: px, x2: px + pw, y1: py + ph, y2: py + ph, style: "stroke:var(--ink-3);stroke-width:1" }, g);
    ctx.el("line", { x1: px, x2: px, y1: py, y2: py + ph, style: "stroke:var(--ink-3);stroke-width:1" }, g);
    txt(ctx, g, px - 4, Y(100) + 4, "100", { size: 8.5, anchor: "end", color: "var(--ink-3)" });
    txt(ctx, g, px - 4, Y(80) + 3, "80", { size: 8.5, anchor: "end", color: "var(--ink-3)" });
    var train = [[0, 82], [100, 88], [250, 91.5], [400, 93.5], [800, 96.5], [1500, 98.8], [3000, 99.7]];
    var val = [[0, 82], [100, 86.2], [250, 87.6], [400, 88.1], [800, 87.4], [1500, 86.3], [3000, 85.3]];
    function path(pts) { return pts.map(function (p, i) { return (i ? "L" : "M") + X(p[0]).toFixed(1) + "," + Y(p[1]).toFixed(1); }).join(" "); }
    ctx.el("path", { d: path(train), style: "fill:none;stroke:var(--t1);stroke-width:2.2" }, g);
    ctx.el("path", { d: path(val), style: "fill:none;stroke:var(--signal);stroke-width:2.2" }, g);
    ctx.el("line", { x1: X(400), x2: X(400), y1: py, y2: py + ph, style: "stroke:var(--good);stroke-width:1.2;stroke-dasharray:3 3" }, g);
    txt(ctx, g, X(400) + 3, py + 8, "best val", { size: 8.5, color: "var(--good)" });
    txt(ctx, g, X(3000), Y(99.7) - 5, "train 99.7", { size: 9, anchor: "end", bold: true, color: "var(--t1)" });
    txt(ctx, g, X(3000), Y(85.3) + 13, "val 85.3", { size: 9, anchor: "end", bold: true, color: "var(--signal)" });
    txt(ctx, g, px, py + ph + 13, "0", { size: 8.5, color: "var(--ink-3)" });
    txt(ctx, g, px + pw, py + ph + 13, "3,000 trees", { size: 8.5, anchor: "end", color: "var(--ink-3)" });
  }

  /* Feature importance after the leaky columns arrived. */
  function importance(svg, ctx) {
    var a = ctx.anchor("model2"), W = 236, H = 140, x0 = a[0] + 104, y0 = a[1] - 74;
    var g = card(ctx, svg, x0, y0, W, H, "FEATURE IMPORTANCE (GAIN)");
    var rows = [["last_login_days", 64, "var(--signal)"], ["tenure_months", 9, "var(--t1)"], ["tickets_90d", 7, "var(--t1)"], ["plan_price", 5, "var(--t1)"], ["27 others", 15, "var(--ink-3)"]];
    var bx = x0 + 118, bw = W - 130;
    rows.forEach(function (r, i) {
      var y = y0 + 38 + i * 20;
      txt(ctx, g, bx - 6, y + 4, r[0], { size: 9.5, anchor: "end", bold: i === 0, color: i === 0 ? "var(--signal)" : "var(--ink-2)" });
      ctx.el("rect", { x: bx, y: y - 5, width: Math.max(3, bw * r[1] / 64 * 0.82), height: 10, rx: 3, style: "fill:" + r[2] + ";opacity:.85" }, g);
      txt(ctx, g, bx + bw * r[1] / 64 * 0.82 + 4, y + 4, r[1] + "%", { size: 9, color: "var(--ink-2)" });
    });
  }

  /* Time axis card under the test stack: the year split 8 / 2 / 2 months. */
  function timeline(svg, ctx) {
    var c = ctx.anchor("testT"), W = 300, H = 70, x0 = c[0] - W - 70, y0 = c[1] + 4;
    var g = card(ctx, svg, x0, y0, W, H, "SPLIT BY TIME →");
    var bx = x0 + 12, bw = W - 24, y = y0 + 30;
    [["Jan–Aug", "var(--t1)", 0, 8], ["Sep–Oct", "var(--t2)", 8, 10], ["Nov–Dec", "var(--t4)", 10, 12]].forEach(function (sg) {
      var sx = bx + bw * sg[2] / 12, ex = bx + bw * sg[3] / 12;
      ctx.el("rect", { x: sx + 1, y: y, width: ex - sx - 2, height: 10, rx: 3, style: "fill:" + sg[1] + ";opacity:.85" }, g);
      txt(ctx, g, (sx + ex) / 2, y + 24, sg[0], { size: 8.5, anchor: "middle", color: "var(--ink-2)" });
    });
  }

  window.ATLAS_SCENES["classical-ml/overview"] = {
    unit: 34,
    metrics: [
      { id: "train", label: "Train acc" },
      { id: "val", label: "Validation acc", tone: "accent" },
      { id: "test", label: "Test acc", tone: "good" },
      { id: "feat", label: "Features", tone: "signal" }
    ],
    legend: { data: "rows / features", req: "score", res: "result", miss: "leaked feature", grad: "tuning" },
    nodes: {
      leak:   { type: "block", x: -3.7, y: -3.7, w: 1.4, d: 1.4, h: 0.8, color: "signal", label: "+7 features", icon: "!" },
      data:   { type: "stack", x: -0.4, y: 0.8, w: 1.8, d: 1.4, n: 5, color: "t5", label: "Churn table", sub: "50,000 rows" },
      train:  { type: "stack", x: 1.2, y: -5.1, w: 1.6, d: 1.2, n: 4, color: "t1", label: "Train", sub: "70%" },
      val:    { type: "stack", x: 3.7, y: -2.6, w: 1.6, d: 1.2, n: 2, color: "t2", label: "Validation", sub: "15%" },
      test:   { type: "stack", x: 6.2, y: -0.1, w: 1.6, d: 1.2, n: 2, color: "t4", label: "Test", sub: "sealed" },
      trainT: { type: "stack", x: 1.2, y: -5.1, w: 1.6, d: 1.2, n: 4, color: "t1", label: "Train", sub: "Jan–Aug" },
      valT:   { type: "stack", x: 3.7, y: -2.6, w: 1.6, d: 1.2, n: 2, color: "t2", label: "Validation", sub: "Sep–Oct" },
      testT:  { type: "stack", x: 6.2, y: -0.1, w: 1.6, d: 1.2, n: 2, color: "t4", label: "Test", sub: "Nov–Dec" },
      model:  { type: "block", x: 5.5, y: -9.5, w: 2, d: 2, h: 1.9, color: "t3", label: "Boosted trees", icon: "▲" },
      model2: { type: "block", x: 5.5, y: -9.5, w: 2, d: 2, h: 1.0, color: "good", label: "Boosted trees", icon: "▲" },
      tuner:  { type: "block", x: 10.05, y: -4.95, w: 1.4, d: 1.4, h: 0.9, color: "accent", label: "Tuner", icon: "⟳" },
      report: { type: "block", x: 11.7, y: -9.8, w: 1.6, d: 1.6, h: 1.0, color: "good", label: "Test score", icon: "✓" }
    },
    steps: [
      { title: "Will it work on new customers?", tag: "Problem", add: ["data"], badges: { data: "18% churned" },
        text: "<p>You have <b>50,000 customer snapshots</b>. Each row is one customer at one month-end: 24 features such as plan, tenure, logins and support tickets, plus a label saying whether they cancelled in the next 30 days.</p><p>Any flexible model can fit this table. The real question is whether it will be right about <b>customers it has never seen</b>.</p>",
        key: "A score on the rows a model trained on tells you almost nothing. Only held-out rows answer the question.",
        note: "18% of rows churned, so predicting \"nobody churns\" already scores 82% accuracy. Every number in this scene has to beat that.",
        metrics: { train: "—", val: "—", test: "—", feat: "24" } },

      { title: "Split before you look", tag: "Idea", add: ["train", "val", "test"],
        links: [["data", "train", "data"], ["data", "val", "data"], ["data", "test", "data"]],
        flows: [["data", "train", "data", { label: "35,000 rows" }], ["data", "val", "data", { label: "7,500" }], ["data", "test", "data", { label: "7,500" }]],
        badges: { test: "do not open" },
        text: "<p>Before any modelling, cut the table into three piles, each keeping the 18% churn rate (a stratified split):</p><ul><li><b>Train</b> fits the model's parameters.</li><li><b>Validation</b> chooses between models and settings.</li><li><b>Test</b> is opened once, at the very end, to report the number.</li></ul>",
        note: "Small data? Use k-fold cross-validation instead of one validation pile, but still hold out the test set.",
        changed: ["+ Train 35,000 · validation 7,500 · test 7,500"] },

      { title: "Train a gradient-boosted model", tag: "Idea", add: ["model"], focus: ["train", "model"],
        links: [["train", "model", "data"]], badges: { model: "300 trees · depth 6" },
        flows: [["train", "model", "data", { label: "fit(X, y)", count: 3 }]],
        text: "<p>For tabular data the strong default is <b>gradient-boosted trees</b> (LightGBM, XGBoost). The model adds small trees one at a time, each fitted to the errors the earlier trees still make.</p><p>Trees need no feature scaling and pick up interactions on their own. With default settings, train accuracy is 90.6%.</p>",
        key: "Train accuracy only says the model can fit. It's the starting point, not the result.",
        metrics: { train: "90.6%" } },

      { title: "Validate and tune in a loop", tag: "Idea", add: ["tuner"], focus: ["model", "val", "tuner"],
        links: [["model", "val", "req", { dashed: true }], ["val", "tuner", "res", { dashed: true }], ["tuner", "model", "grad", { dashed: true }]],
        badges: { tuner: "trial 12 / 40" },
        flows: [["model", "val", "req", { label: "predict(X_val)" }], ["val", "tuner", "res", { label: "val 88.1%", delay: 0.6 }], ["tuner", "model", "grad", { label: "depth, lr, trees", delay: 1.2 }]],
        text: "<p>A <b>tuner</b> runs the loop for you: pick settings, train on the train pile, score on validation, repeat. Random search over 40 trials samples the learning rate on a log scale, plus tree depth and tree count.</p><p>The best trial so far reaches <b>88.1%</b> on validation. The test pile stays sealed the whole time.</p>",
        note: "Tuning on the test set would make its score optimistic: you'd be picking whatever happened to fit those particular rows.",
        metrics: { train: "91.8%", val: "88.1%" },
        changed: ["+ Validation score per trial", "~ Train 90.6 → 91.8%"] },

      { title: "Overfitting shows up", tag: "Problem", focus: ["model", "train", "val"],
        badges: { model: "depth 12 · 3,000 trees" },
        flows: [["train", "model", "data", { count: 3 }], ["model", "val", "req", { label: "val 85.3%", delay: 0.5 }]],
        draw: overfitCurve,
        text: "<p>Train accuracy keeps rising with bigger models, so you widen the search: depth 12, 3,000 trees. Train hits <b>99.7%</b>, but validation <b>falls to 85.3%</b>.</p><p>The trees are memorising individual customers, noise that won't repeat next month. A large train–validation gap is the signature of <b>high variance</b>.</p>",
        key: "Read the gap. Both scores low means underfitting; train high and validation low means overfitting.",
        metrics: { train: "99.7%", val: "85.3%" },
        changed: ["~ Train 91.8 → 99.7%", "~ Validation 88.1 → 85.3%", "~ Gap 3.7 → 14.4 points"] },

      { title: "Regularise and simplify", tag: "Solution", remove: ["model"], add: ["model2"], focus: ["model2", "train", "val", "tuner"],
        links: [["train", "model2", "data"], ["model2", "val", "req", { dashed: true }], ["tuner", "model2", "grad", { dashed: true }]],
        unlink: [["train", "model"], ["model", "val"], ["tuner", "model"]],
        badges: { model2: "depth 4 · stopped at 420", tuner: "40 / 40 done" },
        flows: [["train", "model2", "data"], ["model2", "val", "res", { label: "val 88.6%", delay: 0.5 }]],
        text: "<p>Make the model less able to memorise:</p><ul><li>shallower trees (max depth 4)</li><li>at least 100 customers per leaf</li><li>learning rate 0.05 with row subsampling</li><li><b>early stopping</b>: stop adding trees once validation loss stops improving (here at 420 trees)</li></ul><p>Train falls to 90.4%, validation rises to <b>88.6%</b>. The gap shrinks to 1.8 points.</p>",
        key: "A small gap at a good validation score is the goal, not a high train score.",
        metrics: { train: "90.4%", val: "88.6%" },
        changed: ["- 2,580 trees", "~ Validation 85.3 → 88.6%", "~ Gap 14.4 → 1.8 points"] },

      { title: "A score too good to be true", tag: "Problem", add: ["leak"], focus: ["leak", "train", "val", "model2"],
        links: [["leak", "train", "miss", { dashed: true }], ["leak", "val", "miss", { dashed: true }]],
        flows: [["leak", "train", "miss", { label: "+7 columns" }], ["leak", "val", "miss"], ["model2", "val", "res", { label: "val 99.1% ?!", delay: 0.9 }]],
        text: "<p>A teammate adds seven columns from the data warehouse and retrains. Validation jumps from 88.6% to <b>99.1%</b>.</p><p>Nothing about churn got that much easier overnight. On a real-world problem, a near-perfect validation score is far more often a bug than a breakthrough.</p>",
        key: "When validation looks too good, audit the features and the split before you celebrate.",
        metrics: { train: "99.3%", val: "99.1%", feat: "31" },
        changed: ["+ 7 features", "~ Validation 88.6 → 99.1%"] },

      { title: "Find the leak", tag: "Idea", focus: ["leak", "model2"],
        badges: { leak: "last_login_days" },
        flows: [["leak", "model2", "miss", { label: "64% of gain", lift: 60 }]],
        draw: importance,
        text: "<p>Feature importance shows one new column doing <b>64%</b> of the work. <code>last_login_days</code> was computed on the day you exported the table, weeks after each row's snapshot date.</p><p>Customers who cancelled stopped logging in, so the value is huge exactly when the label is 1. The model is reading the answer, and the random split put the same leak in validation.</p>",
        key: "A feature is only legal if you'd know its value at the moment you make the prediction.",
        changed: ["+ Diagnosis: target leakage (feature computed after the outcome)"] },

      { title: "Fix: point-in-time features, time split", tag: "Solution",
        remove: ["train", "val", "test", "leak"], add: ["trainT", "valT", "testT"],
        unlink: [["data", "train"], ["data", "val"], ["data", "test"], ["train", "model2"], ["model2", "val"], ["leak", "train"], ["leak", "val"]],
        links: [["data", "trainT", "data"], ["data", "valT", "data"], ["data", "testT", "data"], ["trainT", "model2", "data"], ["model2", "valT", "req", { dashed: true }]],
        badges: { trainT: "33,000", valT: "8,500", testT: "8,500 · sealed" },
        flows: [["data", "trainT", "data", { label: "as of snapshot date" }], ["trainT", "model2", "data", { delay: 0.5 }], ["model2", "valT", "res", { label: "val 87.4%", delay: 1.0 }]],
        draw: timeline,
        text: "<p>Rebuild every feature <b>as of its row's snapshot date</b>, so <code>last_login_days</code> now means days since the last login <i>before</i> that month-end. Then split by time: train on January to August, validate on September and October, test on November and December.</p><p>Validation now mimics production, predicting the future from the past. It settles at <b>87.4%</b>, which is the honest number.</p>",
        note: "A random split hides drift and lets near-identical monthly rows of one customer land on both sides. A time split catches both.",
        metrics: { train: "89.9%", val: "87.4%" },
        changed: ["~ last_login_days recomputed point-in-time", "~ Random split → time split", "~ Validation 99.1 → 87.4%"] },

      { title: "One honest test score", tag: "Solution", add: ["report"], focus: ["testT", "model2", "report"],
        links: [["testT", "model2", "req", { dashed: true, lift: 70 }], ["model2", "report", "res"]],
        badges: { report: "86.9% ± 0.7", testT: "opened once" },
        flows: [["testT", "model2", "req", { label: "predict(X_test), once", lift: 70 }], ["model2", "report", "res", { label: "86.9%", delay: 0.9 }]],
        text: "<p>Features, model and settings are now frozen. Retrain on January to October, unseal the test months, and score <b>once</b>: <b>86.9%</b>, with a 95% interval of about ±0.7 points over 8,500 rows.</p><p>It's 0.5 points under validation, the usual small slip after picking the best of many trials. It beats the 82% baseline by about 5 points.</p>",
        note: "With 18% positives, also report precision and recall for the churn class. Accuracy alone can hide a model that misses most churners.",
        metrics: { test: "86.9%" },
        changed: ["+ Test set used once", "+ 95% interval ±0.7 points"] },

      { title: "The honest loop", tag: "Recap",
        flows: [["data", "trainT", "data", { count: 1 }], ["trainT", "model2", "data", { count: 1, delay: 0.3 }], ["model2", "valT", "req", { count: 1, delay: 0.6 }], ["valT", "tuner", "res", { count: 1, delay: 0.9 }], ["tuner", "model2", "grad", { count: 1, delay: 1.2 }], ["model2", "report", "res", { count: 1, delay: 1.6 }]],
        text: "<p>Whether a model works on unseen data comes down to a few habits:</p><ul><li><b>Split first</b>, the way you'll predict (by time here).</li><li><b>Tune on validation</b>, never on test.</li><li><b>Read the gap</b>: too big means regularise or simplify.</li><li><b>Distrust perfect scores</b>: check every feature is known at prediction time.</li><li><b>Open the test set once</b>, and report an interval.</li></ul><p>The lessons in this area take each step in turn.</p>",
        key: "These habits carry straight over to LLM evals: hold-out sets, contamination checks and one honest final number." }
    ],
    learn: [
      "Why you split into train, validation and test before modelling",
      "How gradient-boosted trees fit tabular data",
      "How to read the train–validation gap",
      "Regularisation and early stopping as fixes for overfitting",
      "How target leakage inflates scores, and how point-in-time features and time splits fix it",
      "Why the test set is opened once"
    ]
  };
})();
