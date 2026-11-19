/* Flagship scene: "one training step, then millions" (plays on the Deep learning overview).
   Example model: a GPT-2-small-sized language model, 124M parameters, vocabulary 50,257,
   micro-batch 16 sequences × 1,024 tokens = 16,384 tokens per step per GPU, one H100 80 GB.
   Initial loss = ln(50,257) ≈ 10.82. Training state = 16 bytes/param ≈ 2.0 GB (fp32 weights,
   grads, two Adam moments, or bf16 copies + fp32 master). Activations ≈ 36 GB in fp32 and
   ≈ 19 GB with bf16 autocast at this batch size (illustrative estimates, no checkpointing).
   Throughput figures are illustrative: fp32 ≈ 45k tok/s, bf16 ≈ 300k tok/s per GPU,
   4 GPUs with DDP ≈ 1.14M tok/s (95% scaling). A 10B-token run: 10e9 / 65,536 ≈ 152,600 steps. */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  "use strict";

  function txt(ctx, g, x, y, s, o) {
    o = o || {};
    var t = ctx.el("text", { x: x, y: y, "font-size": o.size || 11, "text-anchor": o.anchor || "start", "font-weight": o.bold ? 700 : 500, style: "fill:" + (o.color || "var(--ink)") + ";font-family:var(--font-mono)" }, g);
    t.textContent = s; return t;
  }
  function card(ctx, svg, x, y, w, h, title) {
    var g = ctx.el("g", { class: "dl-card" }, svg);
    ctx.el("rect", { x: x, y: y, width: w, height: h, rx: 10, style: "fill:var(--surface);stroke:var(--ink);stroke-width:1.4" }, g);
    if (title) txt(ctx, g, x + 12, y + 19, title, { size: 10, bold: true, color: "var(--ink-2)" });
    return g;
  }
  function both() { var fs = arguments; return function (svg, ctx) { for (var i = 0; i < fs.length; i++) fs[i](svg, ctx); }; }

  /* Warmup + cosine learning-rate schedule, with a marker at the current step. */
  function lrCurve(svg, ctx) {
    var a = ctx.anchor("sched"), W = 206, H = 122, x0 = a[0] - W - 56, y0 = a[1] - 64;
    var g = card(ctx, svg, x0, y0, W, H, "LEARNING RATE");
    var px = x0 + 16, py = y0 + 40, pw = W - 32, ph = H - 68, T = 1, Tw = 0.04;
    function lr(t) { return t < Tw ? t / Tw : 0.1 + 0.9 * 0.5 * (1 + Math.cos(Math.PI * (t - Tw) / (T - Tw))); }
    var d = "";
    for (var i = 0; i <= 60; i++) { var t = i / 60; d += (i ? "L" : "M") + (px + pw * t).toFixed(1) + "," + (py + ph * (1 - lr(t))).toFixed(1); }
    ctx.el("line", { x1: px, x2: px + pw, y1: py + ph, y2: py + ph, style: "stroke:var(--ink-3);stroke-width:1" }, g);
    ctx.el("path", { d: d, style: "fill:none;stroke:var(--accent);stroke-width:2.2" }, g);
    ctx.el("circle", { cx: px + pw * Tw, cy: py, r: 4, style: "fill:var(--accent);stroke:var(--surface);stroke-width:1.5" }, g);
    txt(ctx, g, px + pw * Tw + 8, py - 3, "peak 6e-4 at step 2,000", { size: 9, color: "var(--ink-2)" });
    txt(ctx, g, px, py + ph + 13, "warmup", { size: 8.5, color: "var(--ink-3)" });
    txt(ctx, g, px + pw, py + ph + 13, "cosine → 6e-5", { size: 8.5, anchor: "end", color: "var(--ink-3)" });
  }

  /* Training loss against step (log scale), drawn up to the current step. */
  var LOSS = [[1, 10.82], [2, 10.39], [10, 9.6], [100, 7.6], [500, 6.6], [2000, 5.6], [8000, 4.5], [20000, 3.95], [50000, 3.52], [100000, 3.36], [152600, 3.27]];
  function lossCurve(upTo) {
    return function (svg, ctx) {
      var a = ctx.anchor("loss"), W = 206, H = 124, x0 = a[0] + 60, y0 = a[1] - 62;
      var g = card(ctx, svg, x0, y0, W, H, "TRAINING LOSS");
      var px = x0 + 28, py = y0 + 30, pw = W - 42, ph = H - 58, lmax = Math.log10(152600);
      function X(s) { return px + pw * Math.log10(s) / lmax; }
      function Y(v) { return py + ph * (11 - v) / (11 - 3); }
      ctx.el("line", { x1: px, x2: px + pw, y1: py + ph, y2: py + ph, style: "stroke:var(--ink-3);stroke-width:1" }, g);
      ctx.el("line", { x1: px, x2: px, y1: py, y2: py + ph, style: "stroke:var(--ink-3);stroke-width:1" }, g);
      txt(ctx, g, px - 4, Y(11) + 4, "11", { size: 8.5, anchor: "end", color: "var(--ink-3)" });
      txt(ctx, g, px - 4, Y(3) + 3, "3", { size: 8.5, anchor: "end", color: "var(--ink-3)" });
      var pts = LOSS.filter(function (p) { return p[0] <= upTo; });
      ctx.el("path", { d: pts.map(function (p, i) { return (i ? "L" : "M") + X(p[0]).toFixed(1) + "," + Y(p[1]).toFixed(1); }).join(" "), style: "fill:none;stroke:var(--signal);stroke-width:2.2" }, g);
      var last = pts[pts.length - 1];
      ctx.el("circle", { cx: X(last[0]), cy: Y(last[1]), r: 4, style: "fill:var(--signal);stroke:var(--surface);stroke-width:1.5" }, g);
      txt(ctx, g, px, py + ph + 13, "step 1", { size: 8.5, color: "var(--ink-3)" });
      txt(ctx, g, px + pw, py + ph + 13, "152k (log)", { size: 8.5, anchor: "end", color: "var(--ink-3)" });
    };
  }

  /* GPU memory budget: fp32 vs bf16 mixed precision on an 80 GB card. */
  function memBars(svg, ctx) {
    var a = ctx.anchor("loader"), W = 250, H = 116, x0 = a[0] - W - 70, y0 = a[1] - 30;
    var g = card(ctx, svg, x0, y0, W, H, "GPU MEMORY · 80 GB CARD");
    var bx = x0 + 62, bw = W - 76, s = bw / 80;
    [["fp32", 2, 36, "38 GB"], ["bf16 mix", 2, 19, "21 GB"]].forEach(function (r, i) {
      var y = y0 + 36 + i * 30;
      txt(ctx, g, bx - 6, y + 10, r[0], { size: 9.5, anchor: "end", bold: i === 1, color: i === 1 ? "var(--good)" : "var(--ink-2)" });
      ctx.el("rect", { x: bx, y: y, width: bw, height: 13, rx: 3, style: "fill:" + ctx.mix("var(--ink)", 8) + ";stroke:var(--ink-3);stroke-width:1" }, g);
      ctx.el("rect", { x: bx, y: y, width: r[1] * s, height: 13, style: "fill:var(--t4)" }, g);
      ctx.el("rect", { x: bx + r[1] * s, y: y, width: r[2] * s, height: 13, style: "fill:" + (i === 1 ? "var(--good)" : "var(--signal)") + ";opacity:.8" }, g);
      txt(ctx, g, bx + (r[1] + r[2]) * s + 5, y + 10, r[3], { size: 9.5, bold: true, color: "var(--ink)" });
    });
    txt(ctx, g, x0 + 12, y0 + H - 10, "■ weights+grads+Adam 2 GB   ■ activations", { size: 8.5, color: "var(--ink-3)" });
  }

  window.ATLAS_SCENES["deep-learning/overview"] = {
    unit: 34,
    metrics: [
      { id: "loss", label: "Loss", tone: "signal" },
      { id: "step", label: "Step" },
      { id: "mem", label: "GPU memory", tone: "accent" },
      { id: "tps", label: "Tokens / s", tone: "good" }
    ],
    legend: { req: "forward activations", data: "batch / targets", grad: "gradient / update", res: "result" },
    nodes: {
      gpu:    { type: "slab", x: 0.4, y: -4.4, w: 15.0, d: 9.0, color: "t3", label: "GPU 0", sub: "H100" },
      batch:  { type: "stack", x: -1.6, y: 0.2, w: 1.6, d: 1.2, n: 4, color: "t5", label: "Input batch" },
      L1:     { type: "block", x: 2.4, y: -0.3, w: 1.0, d: 2.0, h: 2.0, color: "t1", label: "Layer 1", icon: "W" },
      act:    { type: "block", x: 5.0, y: 0.0, w: 0.9, d: 1.4, h: 0.9, color: "t2", label: "GELU" },
      L2:     { type: "block", x: 7.6, y: -0.3, w: 1.0, d: 2.0, h: 2.0, color: "t1", label: "Layer 2", icon: "W" },
      logits: { type: "stack", x: 10.4, y: 0.1, w: 1.4, d: 1.2, n: 3, color: "t3", label: "Logits" },
      labels: { type: "stack", x: 11.4, y: 3.4, w: 1.4, d: 1.2, n: 2, color: "t5", label: "Labels", sub: "next tokens" },
      loss:   { type: "block", x: 14.6, y: 0.8, w: 1.3, d: 1.3, h: 0.9, color: "signal", label: "Loss", icon: "ℒ" },
      opt:    { type: "block", x: 6.0, y: -3.6, w: 1.6, d: 1.6, h: 1.0, color: "t4", label: "AdamW", icon: "∇" },
      sched:  { type: "block", x: 5.4, y: 5.2, w: 1.2, d: 1.2, h: 0.7, color: "accent", label: "LR schedule" },
      loader: { type: "block", x: -3.0, y: -3.6, w: 1.4, d: 1.4, h: 1.0, color: "t5", label: "Data loader", sub: "CPU" },
      g1:     { type: "block", x: 4.0, y: -8.4, w: 1.8, d: 1.8, h: 1.2, color: "t3", label: "GPU 1", sub: "copy", icon: "▦" },
      g2:     { type: "block", x: 8.0, y: -8.4, w: 1.8, d: 1.8, h: 1.2, color: "t3", label: "GPU 2", sub: "copy", icon: "▦" },
      g3:     { type: "block", x: 12.0, y: -8.4, w: 1.8, d: 1.8, h: 1.2, color: "t3", label: "GPU 3", sub: "copy", icon: "▦" }
    },
    steps: [
      { title: "One batch goes in", tag: "Problem", add: ["batch", "L1"], links: [["batch", "L1", "req"]],
        badges: { batch: "16 × 1,024 tokens" },
        flows: [["batch", "L1", "req", { label: "x·W₁ + b₁", count: 3 }]],
        text: "<p>You're training a small <b>124M-parameter language model</b>. Training is one short step repeated many thousands of times, so follow a single step first.</p><p>It starts with a batch: 16 sequences of 1,024 tokens, each token a 768-number vector. Layer 1 multiplies all 16,384 rows by its weight matrix in one matmul, which is exactly the work GPUs are built for.</p>",
        key: "A training run is this one step, repeated. Get the step right and the rest is scale.",
        metrics: { loss: "—", step: "1", mem: "—", tps: "—" } },

      { title: "Activation, layer 2, logits", tag: "Idea", add: ["act", "L2", "logits"],
        links: [["L1", "act", "req"], ["act", "L2", "req"], ["L2", "logits", "req"]],
        badges: { logits: "50,257 per token" },
        flows: [["L1", "act", "req", { label: "GELU(h)" }], ["act", "L2", "req", { delay: 0.4 }], ["L2", "logits", "req", { label: "logits", delay: 0.8 }]],
        text: "<p>The <b>activation</b> (GELU) bends the signal. Without it, two linear layers would collapse into one matrix and depth would buy nothing.</p><p>Layer 2 maps the result onward, and the output layer produces <b>logits</b>: one raw score for every entry in the 50,257-token vocabulary, at each of the 16,384 positions.</p>",
        note: "A real transformer repeats a block like this (plus attention) 12 times. Two layers keep the picture readable." },

      { title: "Score it: the loss", tag: "Idea", add: ["labels", "loss"], focus: ["logits", "labels", "loss"],
        links: [["logits", "loss", "data"], ["labels", "loss", "data"]],
        flows: [["logits", "loss", "data"], ["labels", "loss", "data", { delay: 0.3 }]],
        text: "<p><b>Cross-entropy</b> compares the logits with the true next token: loss = −log p(correct token), averaged over all 16,384 positions.</p><p>With random weights the model spreads probability evenly over the vocabulary, so the first loss is about ln 50,257 = <b>10.82</b>. Every later step tries to push this one number down.</p>",
        key: "The loss turns 16,384 predictions into one number that says how wrong the model is.",
        metrics: { loss: "10.82" } },

      { title: "Backprop: gradients flow back", tag: "Idea", focus: ["L1", "act", "L2", "logits", "loss"],
        badges: { L1: "∂L/∂W₁", L2: "∂L/∂W₂", logits: "" },
        flows: [["loss", "logits", "grad", { label: "∂L/∂logits" }], ["logits", "L2", "grad", { delay: 0.5 }], ["L2", "act", "grad", { delay: 1.0 }], ["act", "L1", "grad", { delay: 1.5 }]],
        text: "<p>The <b>backward pass</b> starts at the loss and applies the chain rule layer by layer, in reverse. Each layer multiplies the incoming gradient by its own local slope and hands the result to the layer before.</p><p>To do that it needs the activations saved during the forward pass. Those cached activations, about 36 GB here in fp32, are why training needs far more memory than inference.</p>",
        note: "The backward pass costs about twice the forward pass, so one step is roughly 3× the work of one prediction.",
        metrics: { mem: "37 GB" },
        changed: ["+ Gradient for every one of 124M weights", "+ Cached activations ≈ 36 GB"] },

      { title: "AdamW updates the weights", tag: "Solution", add: ["opt"], focus: ["opt", "L1", "L2"],
        links: [["opt", "L1", "grad", { dashed: true }], ["opt", "L2", "grad", { dashed: true }]],
        badges: { opt: "m, v per weight", L1: "", L2: "" },
        flows: [["opt", "L1", "grad"], ["opt", "L2", "grad", { label: "W −= lr · update", delay: 0.4 }]],
        text: "<p>The optimizer turns gradients into a step. <b>AdamW</b> keeps two running averages per weight (the gradient's mean <i>m</i> and its squared size <i>v</i>), so each weight gets its own step size, and applies weight decay separately.</p><p>Then <code>zero_grad()</code> clears the gradients. That's one full step. On the next batch, loss is <b>10.39</b>.</p>",
        key: "forward → loss → backward → update. Every network, from this one to the largest LLM, trains with this loop.",
        metrics: { loss: "10.39", step: "2", mem: "38 GB" },
        changed: ["+ Adam state: 2 × 124M fp32 numbers ≈ 1 GB", "~ Loss 10.82 → 10.39"] },

      { title: "The step size follows a schedule", tag: "Idea", add: ["sched"], focus: ["sched", "opt"],
        links: [["sched", "opt", "data", { dashed: true }]],
        badges: { sched: "lr 6e-4", opt: "" },
        flows: [["sched", "opt", "data", { label: "lr(step)" }]],
        draw: lrCurve,
        text: "<p>The learning rate isn't fixed. <b>Warmup</b> ramps it from 0 to 6e-4 over the first 2,000 steps, while Adam's statistics are still noisy and the weights random. A <b>cosine decay</b> then lowers it to 6e-5 by the end so the model can settle into a minimum.</p><p>Too high and the loss spikes or turns NaN; too low and you waste compute.</p>",
        note: "If a run diverges, the learning rate is the first knob to check. Sweep it by factors of about 3 on a short run.",
        metrics: { loss: "5.60", step: "2,000" } },

      { title: "Batches stream in", tag: "Idea", add: ["gpu", "loader"], focus: ["loader", "batch", "gpu", "L1", "loss"],
        links: [["loader", "batch", "data"]], badges: { batch: "" },
        flows: [["loader", "batch", "data", { label: "next batch", count: 3, dur: 1.2 }], ["batch", "L1", "req", { count: 3, dur: 1.2 }]],
        draw: lossCurve(20000),
        text: "<p>Now repeat the step, again and again. A <b>data loader</b> with several CPU worker processes reads and tokenizes the next batches while the GPU computes the current one, and copies them over through pinned memory.</p><p>In plain fp32 this GPU manages about <b>45,000 tokens/s</b>. A 10B-token run would take about <b>62 hours</b>. Loss is 3.95 by step 20,000.</p>",
        note: "If GPU utilisation dips between steps, the loader is the bottleneck. Add workers or pre-tokenize the data.",
        metrics: { loss: "3.95", step: "20,000", tps: "45,000" } },

      { title: "Mixed precision and the memory budget", tag: "Solution", focus: ["gpu", "L1", "act", "L2", "logits", "loss", "opt", "loader"],
        flows: [["batch", "L1", "req", { count: 3, dur: 0.8 }], ["L1", "act", "req", { dur: 0.8 }], ["act", "L2", "req", { dur: 0.8, delay: 0.2 }], ["L2", "logits", "req", { label: "bf16 matmuls", dur: 0.8, delay: 0.4 }]],
        draw: both(lossCurve(50000), memBars),
        text: "<p>Wrap the forward pass in <code>torch.autocast(dtype=bfloat16)</code>. Matmuls run in bf16 on tensor cores, while master weights and Adam state stay fp32.</p><p>The budget: 2 GB of weights, gradients and Adam state, plus about 19 GB of activations, down from 36 GB. Memory falls to <b>21 GB</b> of 80, and throughput rises to about <b>300,000 tokens/s</b>. The run drops from 62 to about 9 hours.</p>",
        note: "bf16 keeps fp32's exponent range, so unlike fp16 it needs no loss scaling.",
        metrics: { loss: "3.52", step: "50,000", mem: "21 GB", tps: "300,000" },
        changed: ["~ Activations 36 → 19 GB", "~ Tokens/s 45,000 → 300,000 (example)"] },

      { title: "Scale out: one copy per GPU", tag: "Idea", add: ["g1", "g2", "g3"], focus: ["loader", "batch", "gpu", "g1", "g2", "g3"],
        links: [["loader", "g1", "data", { dashed: true }], ["loader", "g2", "data", { dashed: true }], ["loader", "g3", "data", { dashed: true }]],
        badges: { g1: "21 GB", g2: "21 GB", g3: "21 GB" },
        flows: [["loader", "batch", "data", { label: "shard 0" }], ["loader", "g1", "data", { label: "shard 1" }], ["loader", "g2", "data"], ["loader", "g3", "data"]],
        draw: lossCurve(50000),
        text: "<p><b>Data parallelism</b>: four GPUs each hold a full copy of the model and its optimizer state, and each gets a <i>different</i> 16-sequence batch. Each runs forward and backward on its own.</p><p>Memory per GPU stays at 21 GB, because this copies the model rather than splitting it. Different data means different gradients, so the copies would drift apart without the next step.</p>",
        changed: ["+ 3 GPUs, each a full replica", "~ Tokens per step 16,384 → 65,536"] },

      { title: "All-reduce the gradients", tag: "Solution", focus: ["opt", "g1", "g2", "g3", "gpu"],
        links: [["opt", "g1", "grad", { dashed: true }], ["g1", "g2", "grad", { dashed: true }], ["g2", "g3", "grad", { dashed: true }]],
        flows: [["opt", "g1", "grad", { label: "all-reduce" }], ["g1", "g2", "grad", { delay: 0.3 }], ["g2", "g3", "grad", { delay: 0.6 }], ["g3", "opt", "grad", { delay: 0.9, lift: 90 }]],
        draw: lossCurve(150000),
        text: "<p>Before the optimizer step, an <b>all-reduce</b> averages the gradients across the four GPUs over NVLink. Every copy then applies the identical AdamW update, so the weights stay in sync. PyTorch DDP overlaps this with the backward pass.</p><p>Four GPUs reach about <b>1.14M tokens/s</b> (95% scaling). The 10B-token run is about 152,600 steps of 65,536 tokens, roughly <b>2.4 hours</b>.</p>",
        note: "When the model no longer fits on one GPU, FSDP or ZeRO shards the weights, gradients and Adam state instead of copying them.",
        metrics: { loss: "3.28", step: "150,000", tps: "1,140,000" },
        changed: ["~ Tokens/s 300,000 → 1,140,000", "~ Run time ≈ 9 h → 2.4 h"] },

      { title: "One step, then millions", tag: "Recap",
        flows: [["loader", "batch", "data", { count: 1 }], ["batch", "L1", "req", { count: 1, delay: 0.2 }], ["L2", "logits", "req", { count: 1, delay: 0.5 }], ["logits", "loss", "data", { count: 1, delay: 0.8 }], ["loss", "logits", "grad", { count: 1, delay: 1.2 }], ["opt", "L1", "grad", { count: 1, delay: 1.6 }], ["opt", "g1", "grad", { count: 1, delay: 1.9 }]],
        draw: lossCurve(152600),
        text: "<p>Every deep-learning run, from this 124M model to a frontier LLM, is the same step at a different scale:</p><ul><li><b>Forward</b>: matmuls and activations to logits</li><li><b>Loss</b>: one number for how wrong</li><li><b>Backward</b>: gradients by the chain rule</li><li><b>Update</b>: AdamW with a warmup + cosine schedule</li><li><b>Scale</b>: fast loading, bf16, more GPUs</li></ul><p>The lessons in this area take each piece in turn.</p>",
        metrics: { loss: "3.27", step: "152,600" } }
    ],
    learn: [
      "What happens in the forward pass, from batch to logits",
      "Why the first loss of a language model is about ln(vocabulary size)",
      "How backprop sends gradients back layer by layer",
      "What AdamW and a warmup + cosine schedule do to each step",
      "Where GPU memory goes, and how bf16 mixed precision saves it",
      "How data parallelism and all-reduce scale training across GPUs"
    ]
  };
})();
