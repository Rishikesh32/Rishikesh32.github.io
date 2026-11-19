/* Flagship scene: LoRA & QLoRA (plays on the fine-tuning / peft lesson).
   Numbers use the Llama 2 7B shape from the page's calculator: hidden 4096, MLP 11008,
   32 layers, no GQA, 6.74B params. Memory follows the page's estimate (16 B/param for
   full fine-tuning, 0.52 B/param for NF4, checkpointed activations at 4,096 tokens ≈ 3.2 GB). */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  var CAP = 24; // GB on the target card

  /* Horizontal memory gauge under the GPU: 24 GB track, filled to `used`. */
  function memBar(used, note) {
    return function (svg, c) {
      var a = c.anchor("gpu"), W = 150, H = 14, x0 = a[0] - W / 2 - 22, y0 = a[1] + 78;
      var g = c.el("g", { class: "mem-gauge" }, svg);
      var over = used > CAP, frac = Math.min(used / CAP, 1);
      var tone = over ? "var(--signal)" : "var(--good)";
      c.el("rect", { x: x0, y: y0, width: W, height: H, rx: 7, style: "fill:" + c.mix("var(--ink)", 8) + ";stroke:var(--ink-3);stroke-width:1" }, g);
      c.el("rect", { x: x0, y: y0, width: Math.max(4, W * frac), height: H, rx: 7, style: "fill:" + tone + ";opacity:.85" }, g);
      if (over) {
        // overflow tail: hatched stub sticking out past the card's capacity
        c.el("rect", { x: x0 + W - 2, y: y0, width: 34, height: H, rx: 3, style: "fill:none;stroke:var(--signal);stroke-width:1.4;stroke-dasharray:3 3" }, g);
        c.el("path", { d: "M" + (x0 + W + 36) + "," + (y0 - 2) + " l6," + (H / 2 + 2) + " l-6," + (H / 2 + 2), style: "fill:none;stroke:var(--signal);stroke-width:1.6" }, g);
      }
      var t = c.el("text", { x: x0, y: y0 + H + 15, "font-size": 11, style: "fill:var(--ink-3);font-family:var(--font-mono)" }, g);
      t.textContent = "0";
      var t2 = c.el("text", { x: x0 + W, y: y0 + H + 15, "text-anchor": "end", "font-size": 11, style: "fill:var(--ink-3);font-family:var(--font-mono)" }, g);
      t2.textContent = CAP + " GB";
      c.pill(g, a[0], y0 + H + 38, (note || "≈ " + used + " GB") + (over ? " · doesn't fit" : " · fits"), { small: true, stroke: tone, color: tone });
    };
  }

  /* Small before/after eval bars beside the eval block. rows: [label, before, after] */
  function evalBars(rows, caption) {
    return function (svg, c) {
      var a = c.anchor("eval"), x0 = a[0] + 62, y0 = a[1] - 30, BW = 96;
      var g = c.el("g", { class: "eval-bars" }, svg);
      rows.forEach(function (r, i) {
        var y = y0 + i * 34;
        var lt = c.el("text", { x: x0, y: y - 3, "font-size": 10.5, style: "fill:var(--ink-2)" }, g); lt.textContent = r[0];
        c.el("rect", { x: x0, y: y, width: BW, height: 8, rx: 3, style: "fill:" + c.mix("var(--ink)", 10) }, g);
        c.el("rect", { x: x0, y: y, width: BW * r[1] / 100, height: 8, rx: 3, style: "fill:var(--ink-3);opacity:.55" }, g);
        c.el("rect", { x: x0, y: y + 10, width: BW, height: 8, rx: 3, style: "fill:" + c.mix("var(--ink)", 10) }, g);
        c.el("rect", { x: x0, y: y + 10, width: BW * r[2] / 100, height: 8, rx: 3, style: "fill:" + (r[2] >= r[1] ? "var(--good)" : "var(--signal)") }, g);
        var vt = c.el("text", { x: x0 + BW + 6, y: y + 17, "font-size": 10.5, style: "fill:var(--ink);font-family:var(--font-mono)" }, g);
        vt.textContent = r[1] + " → " + r[2] + "%";
      });
      var ct = c.el("text", { x: x0, y: y0 + rows.length * 34 + 4, "font-size": 9.5, style: "fill:var(--ink-3)" }, g);
      ct.textContent = caption || "grey = before · colour = after (example)";
    };
  }

  window.ATLAS_SCENES["fine-tuning/peft"] = {
    unit: 34,
    metrics: [
      { id: "train", label: "Trainable params", tone: "accent" },
      { id: "pct", label: "% of model" },
      { id: "mem", label: "GPU memory", tone: "signal" },
      { id: "file", label: "Saved per task", tone: "good" }
    ],
    legend: { req: "forward pass", data: "logits / loss", grad: "gradient", res: "eval result" },
    nodes: {
      data:  { type: "stack", x: -0.6, y: 0.2, w: 1.6, d: 1.2, n: 4, color: "t5", label: "Train pairs" },
      W:     { type: "block", x: 3.0, y: -0.6, w: 2.8, d: 2.8, h: 2.2, color: "t1", label: "Base weights W", icon: "W" },
      W4:    { type: "block", x: 3.0, y: -0.6, w: 2.8, d: 2.8, h: 0.7, color: "t3", label: "W in 4-bit", icon: "W" },
      loss:  { type: "block", x: 9.0, y: 0.4, w: 1.4, d: 1.4, h: 0.9, color: "signal", label: "Loss", icon: "ℒ" },
      A:     { type: "block", x: 1.0, y: 5.6, w: 2.4, d: 0.5, h: 0.35, color: "good", label: "A", sub: "r × 4096" },
      B:     { type: "block", x: 8.6, y: 5.8, w: 0.5, d: 0.5, h: 1.6, color: "good", label: "B", sub: "4096 × r" },
      gpu:   { type: "block", x: 10.6, y: -3.4, w: 1.8, d: 1.8, h: 1.0, color: "t4", label: "GPU", sub: "24 GB", icon: "▦" },
      ad1:   { type: "stack", x: 0.2, y: 5.6, w: 1.4, d: 1.0, n: 2, color: "t2", label: "Support" },
      ad2:   { type: "stack", x: 3.8, y: 5.6, w: 1.4, d: 1.0, n: 2, color: "t4", label: "Legal" },
      ad3:   { type: "stack", x: 7.4, y: 5.6, w: 1.4, d: 1.0, n: 2, color: "t5", label: "SQL" },
      eval:  { type: "block", x: 12.2, y: 4.2, w: 1.6, d: 1.6, h: 0.9, color: "good", label: "Eval suite", icon: "✓" }
    },
    steps: [
      { title: "A 7B model won't train on one GPU", tag: "Problem", add: ["W", "gpu"], badges: { W: "6.74B params" },
        text: "<p>You want to fine-tune a 7B model (Llama 2 7B shape: 6.74B parameters) on one 24 GB GPU.</p><p>Full fine-tuning with mixed-precision Adam keeps about <b>16 bytes per parameter</b>: bf16 weights (2), gradients (2), an fp32 master copy (4) and two Adam moments (4 + 4). That is about 108 GB, plus about 3 GB of activations at 4,096 tokens.</p>",
        key: "Training memory is set by the number of parameters you train, not by the size of the model file.",
        metrics: { train: "6.74B", pct: "100%", mem: "≈ 111 GB", file: "13.5 GB" },
        draw: memBar(111, "≈ 111 GB needed") },
      { title: "The training data", tag: "Idea", add: ["data"], focus: ["data"], badges: { data: "2,000 pairs" },
        text: "<p>Supervised fine-tuning learns from <b>prompt → ideal answer</b> pairs, rendered with the model's chat template. One example:</p><p><code>My card was charged twice for order 1182.</code> → <code>Refund issued for the duplicate charge.</code></p><p>The loss only counts the answer tokens. The prompt tokens get label <code>-100</code>, so they give context but are never prediction targets.</p>",
        note: "Quality beats quantity: a few hundred to a few thousand clean examples is typical. The 2,000 here is an example.",
        draw: function (svg, c) {
          var a = c.anchor("data");
          c.pill(svg, a[0] - 70, a[1] + 74, "prompt: charged twice…", { small: true });
          c.pill(svg, a[0] - 70, a[1] + 98, "→ Refund issued…", { small: true, stroke: "var(--good)", color: "var(--good)" });
        } },
      { title: "Forward pass through W", tag: "Idea", add: ["loss"], focus: ["data", "W", "loss"],
        links: [["data", "W"], ["W", "loss"]], badges: { loss: "1.92" },
        text: "<p>Each batch of tokens flows through the weights <b>W</b>, layer by layer, and comes out as next-token predictions.</p><p>The <b>loss</b> is the cross-entropy between those predictions and the ideal answer. Here it starts at 1.92 (an example value). Training means nudging the weights so this number falls.</p>",
        flows: [["data", "W", "req", { label: "tokens" }], ["W", "loss", "data", { label: "logits", delay: 0.6 }]] },
      { title: "Full fine-tuning updates all of W", tag: "Problem", focus: ["W", "loss", "gpu"], badges: { W: "6.74B trainable" },
        text: "<p>Backprop sends a gradient to <b>every one</b> of the 6.74B weights, and Adam keeps two moving averages for each one:</p><ul><li>weights + gradients: 2 + 2 bytes → 27 GB</li><li>fp32 master + Adam m, v: 12 bytes → 81 GB</li><li>activations at 4,096 tokens: ≈ 3 GB</li></ul><p>That's 111 GB, more than four 24 GB cards, and every task saves its own 13.5 GB copy.</p>",
        flows: [["data", "W", "req", { count: 1 }], ["W", "loss", "data", { count: 1, delay: 0.5 }], ["loss", "W", "grad", { label: "∂L/∂W · all 6.74B", count: 4, dur: 1.4, delay: 1 }]],
        changed: ["+ Gradients for 6.74B weights: 13.5 GB", "+ fp32 master + Adam states: 81 GB", "~ Total ≈ 111 GB, 4.6× the card"],
        draw: memBar(111, "≈ 111 GB needed") },
      { title: "LoRA: freeze W, add A and B", tag: "Solution", add: ["A", "B"], focus: ["W", "A", "B"],
        links: [["data", "A"], ["A", "B", "grad"], ["B", "loss"]], badges: { W: "frozen", A: "trainable", B: "starts at 0" },
        text: "<p>LoRA leaves W untouched and learns the change as two thin matrices beside it:</p><p><code>h = Wx + (α/r)·BAx</code></p><p>A is r × 4096 and B is 4096 × r. At rank r = 16, one 4096 × 4096 projection has 16.8M weights, but A and B together hold 16 × (4096 + 4096) = <b>131,072</b>, or 0.78%.</p>",
        key: "B starts at zero, so at step 0 the adapted model is exactly the base model.",
        note: "α (lora_alpha) is usually r or 2r. Keep α/r fixed when you compare ranks.",
        draw: function (svg, c) {
          var a = c.anchor("A"), b = c.anchor("B");
          c.pill(svg, (a[0] + b[0]) / 2, Math.max(a[1], b[1]) + 92, "h = Wx + (α/r)·BAx", { stroke: "var(--good)" });
        } },
      { title: "Gradients reach only A and B", tag: "Solution", focus: ["A", "B", "loss", "gpu", "W"],
        text: "<p>Put rank-16 adapters on the four attention projections (q, k, v, o) of all 32 layers:</p><ul><li>4 × 131,072 = 524,288 per layer</li><li>× 32 layers = <b>16.8M</b> trainable, 0.25% of 6.74B</li></ul><p>Only those get gradients and Adam states: 16.8M × 16 B ≈ 0.27 GB. The frozen bf16 base is 13.5 GB, so the total is about 17 GB.</p>",
        note: "Backprop still passes <i>through</i> W to reach earlier layers; W just keeps no gradient or optimiser state. All-linear targets on Llama 3 8B give 41.9M (~0.5%), an 84 MB adapter.",
        flows: [["data", "W", "req", { count: 1 }], ["data", "A", "req", { count: 1 }], ["B", "loss", "data", { count: 1, delay: 0.5 }], ["loss", "B", "grad", { count: 3, delay: 1, lift: 60 }], ["B", "A", "grad", { count: 3, delay: 1.5 }]],
        metrics: { train: "16.8M", pct: "0.25%", mem: "≈ 17 GB", file: "34 MB" },
        changed: ["~ Trainable 6.74B → 16.8M", "~ GPU memory 111 → 17 GB", "~ Saved per task 13.5 GB → 34 MB (bf16 adapter)"],
        draw: memBar(17) },
      { title: "QLoRA: store W in 4 bits", tag: "Solution", remove: ["W"], add: ["W4"], focus: ["W4", "gpu", "A", "B"],
        links: [["data", "W4"], ["W4", "loss"]], unlink: [["data", "W"], ["W", "loss"]], badges: { W4: "NF4 · 3.5 GB" },
        text: "<p>With LoRA, the frozen bf16 base is now 13.5 of the 17 GB. QLoRA stores it as <b>NF4</b>: 4-bit levels in blocks of 64 with double-quantised scales, about 0.52 bytes per parameter.</p><p>Base 13.5 → 3.5 GB, total about <b>7 GB</b>. The adapters still train in bf16. That leaves room on a 24 GB card for longer sequences or bigger batches, and even a 16 GB card works.</p>",
        note: "Each block is dequantised to bf16 for its matmul, so QLoRA steps are slower than LoRA steps.",
        flows: [["data", "W4", "req", { count: 1 }], ["data", "A", "req", { count: 1 }], ["loss", "B", "grad", { count: 2, delay: 1, lift: 60 }], ["B", "A", "grad", { count: 2, delay: 1.5 }]],
        metrics: { mem: "≈ 7 GB" },
        changed: ["~ Frozen base 13.5 → 3.5 GB (NF4)", "~ GPU memory 17 → 7 GB", "~ Slower steps: dequantise per matmul"],
        draw: memBar(7) },
      { title: "One base, many adapters", tag: "Solution", remove: ["data", "loss", "A", "B"], add: ["ad1", "ad2", "ad3"],
        focus: ["W4", "ad1", "ad2", "ad3"], badges: { ad1: "34 MB", ad2: "34 MB", ad3: "34 MB", W4: "shared base" },
        links: [["ad1", "W4", "data", { dashed: true }], ["ad2", "W4", "data", { dashed: true }], ["ad3", "W4", "data", { dashed: true }]],
        text: "<p>Training produced a 34 MB adapter, not a new model. You have two ways to ship it:</p><ul><li><b>Merge</b>: compute <code>W + (α/r)·BA</code> into a bf16 base. Zero extra latency, one model per task.</li><li><b>Swap</b>: keep one base and load an adapter per request (vLLM <code>enable_lora</code>).</li></ul><p>Ten customers as full copies take 135 GB. One base plus ten adapters takes 13.8 GB.</p>",
        note: "Don't merge into 4-bit weights. Dequantise to bf16, merge, then re-run your evals.",
        flows: [["ad1", "W4", "data", { count: 1, dur: 1.2 }], ["ad2", "W4", "data", { count: 1, dur: 1.2, delay: 0.4 }], ["ad3", "W4", "data", { count: 1, dur: 1.2, delay: 0.8 }]],
        metrics: { file: "34 MB × 3" },
        changed: ["+ 3 adapters on 1 shared base", "~ 10 tasks: 135 GB of copies → 13.8 GB"] },
      { title: "Pitfall: the model forgets", tag: "Problem", add: ["eval"], focus: ["eval", "W4", "ad1"], badges: { eval: "general ↓" },
        links: [["ad1", "eval", "res"]],
        text: "<p>Train the Support adapter for 3 epochs at a high learning rate on a narrow dataset. The task score climbs, but general ability falls: <b>catastrophic forgetting</b>. Overfitting shows up too, as validation loss rising while training loss keeps falling.</p><p>Only a before/after eval shows it: the task set plus a general-abilities slice, run on every checkpoint.</p>",
        key: "Training loss is not your eval. Score every checkpoint on the task and on what the model must not lose.",
        flows: [["ad1", "eval", "res", { label: "checkpoint 3", count: 2 }]],
        changed: ["+ Eval on every checkpoint", "~ Task 62 → 91% (example)", "~ General 71 → 63% (example)"],
        draw: evalBars([["task eval", 62, 91], ["general slice", 71, 63]]) },
      { title: "Catch it, then fix it", tag: "Solution", focus: ["eval", "ad1", "W4"], badges: { eval: "pass ✓" },
        text: "<p>Mitigations, cheapest first:</p><ul><li>LoRA itself: it learns less and forgets less</li><li>LoRA learning rate of 1e-4 to 2e-4, and 1 to 3 epochs</li><li>mix in 5–20% general replay data</li><li>keep the checkpoint with the best eval, not the last one</li></ul><p>Here, 10% replay and stopping at epoch 2 keeps most of the task gain and nearly all general ability.</p>",
        note: "Fine-tuning on as few as 100 benign examples can weaken an aligned model's refusals (Qi et al., 2023). Include a safety slice in the eval.",
        flows: [["ad1", "eval", "res", { label: "checkpoint 2", count: 2 }]],
        changed: ["+ 10% replay data, early stop at epoch 2", "~ Task 62 → 88% (example)", "~ General 71 → 70% (example)"],
        draw: evalBars([["task eval", 62, 88], ["general slice", 71, 70]]) },
      { title: "The whole picture", tag: "Recap", add: ["data", "loss", "A", "B"], remove: ["ad1", "ad2", "ad3"],
        badges: { W4: "frozen · NF4", eval: "before / after", B: "34 MB adapter" }, metrics: { file: "34 MB" },
        links: [["B", "eval", "res", { dashed: true }]],
        text: "<p>One recipe, every number traceable:</p><ul><li><b>Full fine-tune</b>: 6.74B trainable, ≈ 111 GB, 13.5 GB per task</li><li><b>LoRA r = 16</b> on q, k, v, o: 16.8M (0.25%), ≈ 17 GB</li><li><b>QLoRA</b>: NF4 base, ≈ 7 GB, fits a 24 GB card</li><li><b>Ship</b>: merge into bf16, or hot-swap 34 MB adapters</li><li><b>Guard</b>: task + general eval on every checkpoint</li></ul>",
        flows: [["data", "W4", "req", { count: 1 }], ["data", "A", "req", { count: 1 }], ["W4", "loss", "data", { count: 1, delay: 0.5 }], ["loss", "B", "grad", { count: 2, delay: 1, lift: 60 }], ["B", "eval", "res", { count: 1, delay: 1.8 }]],
        draw: memBar(7) }
    ],
    learn: [
      "Why full fine-tuning costs about 16 bytes per parameter",
      "How LoRA learns BA beside a frozen W",
      "How to count LoRA trainable parameters by hand",
      "How QLoRA's 4-bit base cuts memory again",
      "How to ship adapters and catch forgetting with evals"
    ]
  };
})();
