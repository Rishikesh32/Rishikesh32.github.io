/* Flagship scene: the KV cache, from one slow token to a GPU shared by dozens of users.
   Model: Llama 3.1 8B (32 layers, 8 KV heads, head dim 128, BF16) on one 80 GB H100.
   Sizes use binary units like the page: 128 KiB per token, 1 GiB per 8k tokens.
   Budget: vLLM claims 90% of 80 GiB = 72 GiB; weights 15 GiB (16 GB) + runtime ~3 GiB leaves 54 GiB of KV pool. */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  "use strict";

  /* ---------- layout ---------- */
  var COLS = [6.6, 8.4, 10.2, 12.0], ROWS = [1.0, 2.6, 4.2, 5.8];
  function slotPos(i) { return { x: COLS[i % 4], y: ROWS[Math.floor(i / 4)] }; }

  var nodes = {
    gpu:     { type: "slab", x: 2.4, y: -1.2, w: 11.0, d: 8.2, color: "t3", label: "H100", sub: "80 GB" },
    prompt:  { type: "stack", x: -0.6, y: 5.0, w: 1.6, d: 1.2, n: 4, color: "t5", label: "Context", sub: "tokens" },
    weights: { type: "block", x: 3.0, y: -0.4, w: 2.4, d: 2.4, h: 1.6, color: "t3", label: "Weights", sub: "16 GB" },
    kvA1:    { type: "stack", x: 8.4, y: 2.6, w: 1.2, d: 1.0, n: 3, color: "t1", label: "KV · user A" },
    kvA2:    { type: "stack", x: 8.4, y: 2.6, w: 1.2, d: 1.0, n: 4, color: "t1", label: "KV · user A" },
    kvA3:    { type: "stack", x: 8.4, y: 2.6, w: 1.2, d: 1.0, n: 7, color: "t1", label: "KV · user A" },
    waiting: { type: "block", x: -0.4, y: 1.4, w: 1.2, d: 1.2, h: 0.8, color: "signal", label: "User 14", sub: "waits", icon: "◉" },
    sys:     { type: "stack", x: 4.6, y: 4.2, w: 1.6, d: 1.2, n: 3, color: "good", label: "System prompt", sub: "shared" }
  };

  /* 13 reserved 32k slots (GQA), shown as stacks of 4 sheets */
  var SLOT_COLORS = ["t1", "t2", "t4", "t5"];
  var slots = [], used = [];
  for (var i = 0; i < 13; i++) {
    var p = slotPos(i);
    nodes["s" + i] = { type: "stack", x: p.x, y: p.y, w: 1.2, d: 1.0, n: 4, color: i === 5 ? "t1" : SLOT_COLORS[i % 4], label: i === 5 ? "User A" : null, sub: i === 5 ? "32k slot" : null };
    nodes["u" + i] = { type: "stack", x: p.x, y: p.y, w: 1.2, d: 1.0, n: 1, color: i === 5 ? "t1" : SLOT_COLORS[i % 4], label: i === 5 ? "User A" : null, sub: i === 5 ? "8k used" : null };
    slots.push("s" + i); used.push("u" + i);
  }

  /* MHA counterfactual: 3 slots of 16 GiB */
  var mha = ["m0", "m1", "m2"];
  nodes.m0 = { type: "stack", x: 6.0, y: 4.6, w: 2.0, d: 1.6, n: 7, color: "signal", label: "MHA slot", sub: "16 GiB" };
  nodes.m1 = { type: "stack", x: 8.6, y: 3.4, w: 2.0, d: 1.6, n: 7, color: "signal" };
  nodes.m2 = { type: "stack", x: 11.0, y: 2.2, w: 2.0, d: 1.6, n: 7, color: "signal" };

  /* PagedAttention: a 7 x 5 grid of 16-token pages, owned by requests in no particular order */
  var PAGE_OWNERS = "ABCADEBDCAEBCDBEADCEBAD.CEBDAECBDAE";
  var OWNER_COLOR = { A: "t1", B: "t2", C: "t4", D: "t5", E: "accent", ".": "ink-3" };
  var pages = [], pagesA = [];
  for (var r = 0; r < 5; r++) for (var c = 0; c < 7; c++) {
    var k = r * 7 + c, owner = PAGE_OWNERS[k], id = "p" + k;
    nodes[id] = { type: "stack", x: 6.6 + c * 0.95, y: 1.0 + r * 1.15, w: 0.72, d: 0.72, n: owner === "." ? 1 : 2, color: OWNER_COLOR[owner] };
    pages.push(id); if (owner === "A") pagesA.push(id);
  }
  nodes.p34.label = "Pages"; nodes.p34.sub = "16 tok each";

  /* ---------- overlay helpers ---------- */
  function txt(ctx, g, x, y, s, o) {
    o = o || {};
    var t = ctx.el("text", { x: x, y: y, "font-size": o.size || 11, "text-anchor": o.anchor || "start", "font-weight": o.bold ? 700 : 500, style: "fill:" + (o.color || "var(--ink)") + ";font-family:var(--font-mono)" }, g);
    t.textContent = s; return t;
  }
  function card(ctx, svg, x, y, w, h, title) {
    var g = ctx.el("g", {}, svg);
    ctx.el("rect", { x: x, y: y, width: w, height: h, rx: 10, style: "fill:var(--surface);stroke:var(--ink);stroke-width:1.5" }, g);
    if (title) txt(ctx, g, x + 12, y + 19, title, { size: 10.5, bold: true, color: "var(--ink-2)" });
    return g;
  }
  /* top-right free corner of the stage */
  function vb(svg) { return svg.getAttribute("viewBox").split(" ").map(Number); }
  function corner(ctx, svg, W) { var v = vb(svg); return [v[0] + v[2] - (W || 252) - 8, v[1] + 8]; }

  /* "K,V computed per new token": naive grows linearly, cached stays at 1 */
  function workBars(withCache) {
    return function (svg, ctx) {
      var o = corner(ctx, svg, 236), W = 236, H = 128, g = card(ctx, svg, o[0], o[1], W, H, "K,V COMPUTED PER NEW TOKEN");
      var base = o[1] + H - 26, x0 = o[0] + 16, n = 8, bw = 18, gap = 7;
      for (var i = 0; i < n; i++) {
        var hh = 8 + i * 9.5, x = x0 + i * (bw + gap);
        ctx.el("rect", { x: x, y: base - hh, width: bw, height: hh, rx: 2, style: "fill:" + ctx.mix("var(--signal)", withCache ? 30 : 70) + ";stroke:var(--signal);stroke-width:1" }, g);
        if (withCache) ctx.el("rect", { x: x + 3, y: base - 3, width: bw - 6, height: 3, style: "fill:var(--good)" }, g);
      }
      ctx.el("line", { x1: x0 - 4, x2: x0 + n * (bw + gap), y1: base, y2: base, style: "stroke:var(--ink-3);stroke-width:1" }, g);
      txt(ctx, g, x0, base + 15, "token 1 → 1,000", { size: 9.5, color: "var(--ink-2)" });
      txt(ctx, g, o[0] + W - 12, base + 15, withCache ? "cached: 1 each" : "no cache", { size: 9.5, anchor: "end", bold: true, color: withCache ? "var(--good)" : "var(--signal)" });
    };
  }

  /* GPU memory bar: weights | runtime | KV | free, with the 90% line */
  function memBar(kv, label) {
    return function (svg, ctx) {
      var v = vb(svg), W = 250, x = v[0] + 14, y = v[1] + v[3] - 34, H = 14, s = W / 80;
      var g = ctx.el("g", {}, svg);
      txt(ctx, g, x, y - 6, "GPU MEMORY · 80 GiB", { size: 10, bold: true, color: "var(--ink-2)" });
      ctx.el("rect", { x: x, y: y, width: W, height: H, rx: 3, style: "fill:var(--surface);stroke:var(--ink);stroke-width:1.3" }, g);
      ctx.el("rect", { x: x, y: y, width: 15 * s, height: H, style: "fill:" + ctx.mix("var(--t3)", 70) }, g);
      ctx.el("rect", { x: x + 15 * s, y: y, width: 3 * s, height: H, style: "fill:" + ctx.mix("var(--ink-3)", 45) }, g);
      if (kv > 0) ctx.el("rect", { x: x + 18 * s, y: y, width: Math.max(1.5, kv * s), height: H, style: "fill:" + ctx.mix("var(--accent)", 70) }, g);
      ctx.el("line", { x1: x + 72 * s, x2: x + 72 * s, y1: y - 3, y2: y + H + 3, style: "stroke:var(--signal);stroke-width:2" }, g);
      txt(ctx, g, x, y + H + 13, "weights 15", { size: 9.5, color: "var(--ink-2)" });
      txt(ctx, g, x + 72 * s, y + H + 13, "90% cap", { size: 9.5, anchor: "middle", color: "var(--signal)" });
      if (label) txt(ctx, g, x + W, y - 6, label, { size: 10, anchor: "end", bold: true, color: "var(--accent)" });
    };
  }
  function both() { var fs = arguments; return function (svg, ctx) { for (var i = 0; i < fs.length; i++) fs[i](svg, ctx); }; }

  function formulaCard(svg, ctx) {
    var o = corner(ctx, svg), W = 252, H = 112, g = card(ctx, svg, o[0], o[1], W, H, "BYTES PER TOKEN");
    var x = o[0] + 12, y = o[1] + 40;
    txt(ctx, g, x, y, "2 (K,V) × 32 layers", { size: 11.5 });
    txt(ctx, g, x, y + 18, "× 8 KV heads × 128 dims", { size: 11.5 });
    txt(ctx, g, x, y + 36, "× 2 bytes (BF16)", { size: 11.5 });
    txt(ctx, g, x, y + 58, "= 131,072 B = 128 KiB", { size: 12, bold: true, color: "var(--accent)" });
  }
  function sizeTable(svg, ctx) {
    var o = corner(ctx, svg), W = 252, H = 112, g = card(ctx, svg, o[0], o[1], W, H, "ONE USER × 128 KiB/TOKEN");
    var rows = [["4,096 tok", "0.5 GiB", "var(--ink)"], ["32,768 tok", "4 GiB", "var(--ink)"], ["131,072 tok", "16 GiB", "var(--signal)"]];
    rows.forEach(function (rw, i) {
      var y = o[1] + 42 + i * 19;
      txt(ctx, g, o[0] + 12, y, rw[0], { size: 11.5 });
      txt(ctx, g, o[0] + W - 12, y, rw[1], { size: 11.5, anchor: "end", bold: true, color: rw[2] });
    });
    txt(ctx, g, o[0] + 12, o[1] + H - 10, "16 GiB > the 15 GiB of weights", { size: 10, color: "var(--signal)" });
  }
  function headsCard(svg, ctx) {
    var o = corner(ctx, svg), W = 252, H = 120, g = card(ctx, svg, o[0], o[1], W, H, "QUERY HEADS → KV HEADS (1 LAYER)");
    function row(y, label, groups, color) {
      txt(ctx, g, o[0] + 12, y + 4, label, { size: 10, bold: true, color: "var(--ink-2)" });
      for (var q = 0; q < 32; q++) {
        var qx = o[0] + 52 + q * 6;
        ctx.el("circle", { cx: qx, cy: y - 8, r: 2.2, style: "fill:var(--accent)" }, g);
      }
      var per = 32 / groups;
      for (var kv = 0; kv < groups; kv++) {
        var cx = o[0] + 52 + (kv * per + (per - 1) / 2) * 6;
        ctx.el("line", { x1: o[0] + 52 + kv * per * 6, x2: o[0] + 52 + (kv * per + per - 1) * 6, y1: y - 3, y2: y - 3, style: "stroke:" + color + ";stroke-width:1" }, g);
        ctx.el("rect", { x: cx - (groups > 8 ? 2 : 4), y: y, width: groups > 8 ? 4 : 8, height: 8, rx: 1.5, style: "fill:" + color }, g);
      }
    }
    row(o[1] + 46, "MHA", 32, "var(--signal)");
    row(o[1] + 84, "GQA", 8, "var(--good)");
    txt(ctx, g, o[0] + W - 12, o[1] + H - 8, "32 vs 8 KV heads cached", { size: 9.5, anchor: "end", color: "var(--ink-2)" });
  }
  /* dashed outline of the full 32k reservation (4 sheets) around each used stack */
  function reservations(svg, ctx) {
    var g = ctx.el("g", {}, svg), lab = svg.querySelector(".iso-labels");
    if (lab) svg.insertBefore(g, lab);
    for (var i = 0; i < 13; i++) {
      var p = slotPos(i), z0 = 0.18, z1 = 4 * 0.26, w = 1.2, d = 1.0;
      var top = [ctx.P(p.x, p.y, z1), ctx.P(p.x + w, p.y, z1), ctx.P(p.x + w, p.y + d, z1), ctx.P(p.x, p.y + d, z1)];
      ctx.el("polygon", { points: top.map(function (q) { return q[0].toFixed(1) + "," + q[1].toFixed(1); }).join(" "), style: "fill:none;stroke:var(--signal);stroke-width:1.3;stroke-dasharray:3 3" }, g);
      [[p.x, p.y + d], [p.x + w, p.y + d], [p.x + w, p.y]].forEach(function (c) {
        var a = ctx.P(c[0], c[1], z0), b = ctx.P(c[0], c[1], z1);
        ctx.el("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], style: "stroke:var(--signal);stroke-width:1.3;stroke-dasharray:3 3" }, g);
      });
    }
    var o = corner(ctx, svg), W = 252, H = 78, cg = card(ctx, svg, o[0], o[1] + 30, W, H, "ONE 32k SLOT, 8k USED");
    var x = o[0] + 12, y = o[1] + 60, bw = W - 24;
    ctx.el("rect", { x: x, y: y, width: bw, height: 14, rx: 3, style: "fill:" + ctx.mix("var(--signal)", 18) + ";stroke:var(--signal);stroke-width:1.2;stroke-dasharray:3 3" }, cg);
    ctx.el("rect", { x: x, y: y, width: bw / 4, height: 14, rx: 3, style: "fill:" + ctx.mix("var(--t1)", 75) + ";stroke:var(--ink);stroke-width:1.2" }, cg);
    txt(ctx, cg, x, y + 30, "1 GiB used", { size: 10, bold: true });
    txt(ctx, cg, x + bw, y + 30, "3 GiB idle (75%)", { size: 10, anchor: "end", bold: true, color: "var(--signal)" });
  }
  function blockTable(svg, ctx) {
    var o = corner(ctx, svg), W = 252, H = 84, g = card(ctx, svg, o[0], o[1] + 20, W, H, "BLOCK TABLE · USER A");
    txt(ctx, g, o[0] + 12, o[1] + 62, "logical 0 1 2 3 4 5 6", { size: 11 });
    txt(ctx, g, o[0] + 12, o[1] + 80, "→ any free page", { size: 11, bold: true, color: "var(--t1)" });
    txt(ctx, g, o[0] + W - 12, o[1] + 96, "waste < 4%", { size: 10, anchor: "end", bold: true, color: "var(--good)" });
  }

  window.ATLAS_SCENES["inference/kv-cache"] = {
    unit: 32,
    metrics: [
      { id: "ctx", label: "Tokens in context" },
      { id: "kv", label: "KV cache", tone: "accent" },
      { id: "mem", label: "GPU memory", tone: "signal" },
      { id: "users", label: "Concurrent users", tone: "good" }
    ],
    legend: { req: "prompt tokens", data: "keys and values", token: "new token", miss: "rejected request" },
    nodes: nodes,
    steps: [
      { title: "Token 1,001 the slow way", tag: "Problem", add: ["gpu", "prompt", "weights"], focus: ["prompt", "weights"],
        badges: { prompt: "1,000 tok", weights: "recompute K,V" },
        text: "<p>You're serving Llama 3.1 8B on one 80 GB H100. A chat has 1,000 tokens and you want token 1,001.</p><p>Attention needs a key and a value for <b>every earlier token in every layer</b>. Without a cache, you push all 1,000 tokens through all 32 layers again just to get them back, then throw them away.</p>",
        flows: [["prompt", "weights", "req", { label: "all 1,000 again", count: 5, dur: 1.3 }], ["weights", "prompt", "token", { label: "token 1,001", lift: 70, delay: 0.6 }]],
        key: "Generating 1,000 tokens this way computes K and V 1 + 2 + … + 1,000 = 500,500 times per layer instead of 1,000.",
        metrics: { ctx: "1,000", kv: "none", mem: "18 / 80 GiB", users: "1" },
        draw: both(workBars(false), memBar(0)) },
      { title: "Prefill writes the cache", tag: "Solution", add: ["kvA1"], focus: ["prompt", "weights", "kvA1"],
        badges: { weights: "prefill", kvA1: "125 MiB" },
        text: "<p><b>Prefill</b> runs the whole prompt through the model in one parallel pass. Every weight you load is reused for all 1,000 tokens, so this phase is compute-bound and sets the time to first token.</p><p>As it goes, each of the 32 layers writes its keys and values into GPU memory. That is the <b>KV cache</b>.</p>",
        flows: [["prompt", "weights", "req", { label: "1,000 tokens at once", count: 6, dur: 1.2 }], ["weights", "kvA1", "data", { label: "K,V × 32 layers", count: 4, delay: 0.5 }]],
        changed: ["+ KV cache for user A: 1,000 tokens", "~ K,V stored once, never recomputed"],
        metrics: { kv: "125 MiB", mem: "18.1 / 80 GiB" },
        draw: memBar(0.12) },
      { title: "Decode appends one row", tag: "Solution", add: ["kvA2"], remove: ["kvA1"], focus: ["prompt", "weights", "kvA2"],
        badges: { weights: "decode", kvA2: "+1 row · 125.1 MiB", prompt: "1,001 tok" },
        text: "<p>Now each step handles <b>one</b> token. The model computes q, k and v for the newest token only, appends that k and v to the cache, and attends over everything stored there.</p><p>The work to make K and V is flat. What still grows is the cache you read each step, one 128 KiB row per token.</p>",
        flows: [["weights", "kvA2", "data", { count: 1, dur: 1.4, lift: 6 }], ["kvA2", "weights", "data", { label: "read 1,000 rows", count: 3, dur: 1.4, lift: 80, delay: 0.4 }], ["weights", "prompt", "token", { label: "token 1,001", lift: 70, delay: 0.9 }]],
        key: "Decode reads every weight and the whole cache to produce one token, so it is limited by memory bandwidth, not compute.",
        changed: ["~ K,V computed per token: 1,000 → 1", "+ 1 row appended per step"],
        metrics: { ctx: "1,001", kv: "125.1 MiB" },
        draw: both(workBars(true), memBar(0.12)) },
      { title: "How big is one token?", tag: "Idea", focus: ["kvA2"],
        badges: { kvA2: "128 KiB / token", prompt: "4,096 tok", weights: "" },
        text: "<p>Each token stores one key and one value vector per <b>key-value head</b>, in every layer:</p><p><code>2 × layers × KV heads × head dim × bytes</code></p><p>For Llama 3.1 8B in BF16 that's 2 × 32 × 8 × 128 × 2 = <b>128 KiB per token</b>. A 4,096-token chat is 4,096 × 128 KiB = 512 MiB.</p>",
        note: "Use KV heads (8), not attention heads (32). Mixing them up overestimates this model's cache by 4×.",
        metrics: { ctx: "4,096", kv: "512 MiB", mem: "18.5 / 80 GiB" },
        draw: both(formulaCard, memBar(0.5)) },
      { title: "Context grows the cache", tag: "Problem", add: ["kvA3"], remove: ["kvA2"], focus: ["kvA3", "weights"],
        badges: { kvA3: "16 GiB", prompt: "131,072 tok", weights: "" },
        text: "<p>The cache grows linearly with context. At 32,768 tokens one user holds 4 GiB. At the full 128k window (131,072 tokens) it's <b>16 GiB</b>.</p><p>That single conversation now takes more memory than the 15 GiB of model weights it runs on.</p>",
        changed: ["~ 4k → 128k tokens: 0.5 → 16 GiB", "~ GPU memory 18.5 → 34 GiB"],
        metrics: { ctx: "131,072", kv: "16 GiB", mem: "34 / 80 GiB" },
        draw: both(sizeTable, memBar(16, "KV 16")) },
      { title: "Many users fill the GPU", tag: "Problem", add: slots.concat(["waiting"]), remove: ["kvA3"], focus: slots.concat(["waiting", "weights"]),
        badges: { prompt: "32k each", waiting: "needs 4 GiB" },
        text: "<p>A naive server reserves a full 32k slot (4 GiB) for every request. vLLM claims 90% of the card: 72 GiB. Take away 15 GiB of weights and about 3 GiB of runtime, and <b>54 GiB</b> is left for KV.</p><p>54 ÷ 4 = 13 users. User 14 has to wait, even though the weights haven't changed at all.</p>",
        flows: [["waiting", "s4", "miss", { label: "no room", count: 1, dur: 1.6, lift: 20 }]],
        key: "The weights are a fixed 15 GiB. The cache, 52 GiB here, decides how many users one GPU can serve.",
        changed: ["+ 12 more users at 32k each", "~ KV 16 → 52 GiB", "- User 14 rejected (would need 74 of 72 GiB)"],
        metrics: { ctx: "32k each", kv: "52 GiB", mem: "70 / 80 GiB", users: "13" },
        draw: memBar(52, "KV 52") },
      { title: "GQA is already saving you 4×", tag: "Idea", add: mha, remove: slots, focus: mha.concat(["weights"]),
        badges: { prompt: "32k each", waiting: "" },
        text: "<p>Picture the same model with full <b>multi-head attention</b>: 32 key-value heads instead of 8. Each token would cost 512 KiB, a 32k slot 16 GiB, and the 54 GiB pool would hold just <b>3 users</b>.</p><p><b>Grouped-query attention</b> lets 4 query heads share one key-value head. Only KV heads are cached, so the cache shrinks 4×.</p>",
        note: "Some models go further: MQA keeps one KV head, and DeepSeek's MLA caches a compressed latent. An FP8 cache halves memory again.",
        changed: ["~ MHA: 512 KiB / token, 3 users", "~ GQA: 128 KiB / token, 13 users"],
        metrics: { kv: "48 GiB (MHA)", mem: "66 / 80 GiB", users: "3 (MHA)" },
        draw: both(headsCard, memBar(48, "KV 48 (MHA)")) },
      { title: "Reserved slots sit empty", tag: "Problem", add: used, remove: mha, focus: used.concat(["waiting"]),
        badges: { prompt: "≈ 8k avg", waiting: "still waiting" },
        text: "<p>Back to GQA and 13 users. Real chats average about 8k tokens, so each 4 GiB slot holds only <b>1 GiB</b> of cache. The other 3 GiB is reserved in case the chat grows.</p><p>That's 39 of 52 GiB idle while user 14 waits. Early servers wasted 60–80% of KV memory this way.</p>",
        changed: ["~ Used 13 GiB of 52 GiB reserved", "- 75% of the KV pool idle"],
        metrics: { ctx: "≈ 8k avg", kv: "52 GiB (13 used)", mem: "70 / 80 GiB", users: "13" },
        draw: both(reservations, memBar(52, "KV 52, 13 used")) },
      { title: "PagedAttention", tag: "Solution", add: pages, remove: used.concat(["waiting"]), focus: pagesA.concat(["p34", "weights"]),
        badges: { prompt: "≈ 8k avg" },
        text: "<p><b>PagedAttention</b> (vLLM) splits the cache into fixed 16-token pages and hands them out only as a chat grows. A per-request <b>block table</b> maps its pages, which can sit anywhere, like virtual memory.</p><p>User A's pages (blue) are scattered and that's fine. With no slots reserved, 54 GiB ÷ 1 GiB per chat, minus under 4% waste, fits about <b>52 users</b>.</p>",
        key: "Allocate cache in small pages on demand, not one max-length slab per request.",
        changed: ["- Fixed 32k reservations", "+ 16-token pages on demand", "~ Users 13 → ≈ 52"],
        metrics: { kv: "≈ 54 GiB", mem: "72 / 80 GiB", users: "≈ 52" },
        draw: both(blockTable, memBar(54, "KV 54, all in use")) },
      { title: "Share the system prompt", tag: "Solution", add: ["sys"], focus: ["sys", "p7", "p15", "p22", "p29", "p10", "p24"],
        links: [["sys", "p7", "data", { dashed: true, lift: 30 }], ["sys", "p15", "data", { dashed: true, lift: 30 }], ["sys", "p22", "data", { dashed: true, lift: 30 }], ["sys", "p29", "data", { dashed: true, lift: 30 }]],
        badges: { sys: "2,048 tok · 256 MiB" },
        text: "<p>Every chat starts with the same 2,048-token system prompt: 256 MiB of cache. With <b>prefix caching</b>, all requests point their block tables at one shared copy and skip prefilling it.</p><p>Each user now adds only about 6k unique tokens (0.75 GiB), so the pool fits about <b>68 users</b>, and first tokens arrive sooner.</p>",
        flows: [["sys", "p10", "data", { count: 1, dur: 1.4, lift: 50 }], ["sys", "p24", "data", { count: 1, dur: 1.4, delay: 0.3, lift: 50 }]],
        note: "Put per-user details (names, timestamps) after the shared prefix. One changed token at the start breaks the match for everyone.",
        changed: ["+ One shared copy of the system prompt", "~ Per user 1 → 0.75 GiB", "~ Users ≈ 52 → ≈ 68"],
        metrics: { users: "≈ 68" },
        draw: memBar(54, "KV 54, ≈ 68 users") },
      { title: "The whole picture", tag: "Recap", unlink: [["sys", "p7"], ["sys", "p15"], ["sys", "p22"], ["sys", "p29"]],
        text: "<p>The KV cache trades recomputation for memory:</p><ul><li><b>Prefill</b> writes K and V for the whole prompt; <b>decode</b> appends one row per token</li><li>Size = 2 × layers × KV heads × head dim × bytes × tokens: 128 KiB/token here</li><li>The cache, not the weights, caps concurrent users</li><li><b>GQA</b>, <b>paging</b> and <b>prefix sharing</b> took one GPU from 3 to about 68 users</li></ul>",
        flows: [["prompt", "weights", "req", { count: 2 }], ["weights", "p0", "data", { count: 1, lift: 20 }], ["p0", "weights", "data", { count: 2, lift: 60 }], ["weights", "prompt", "token", { lift: 70, count: 1 }]],
        draw: memBar(54, "≈ 68 users") }
    ],
    learn: [
      "Why generation without a cache gets slower every token",
      "What prefill and decode do to the KV cache",
      "How to compute cache size from a model config",
      "Why the cache, not the weights, limits concurrent users",
      "How GQA, PagedAttention and prefix caching fit more users"
    ]
  };
})();

/* Overview scene: serving 200 users from one GPU (plays on the Inference & optimization overview). */
window.ATLAS_SCENES["inference/overview"] = {
  unit: 32,
  metrics: [
    { id: "tps", label: "Tokens / s", tone: "good" },
    { id: "ttft", label: "First token", tone: "accent" },
    { id: "mem", label: "GPU memory" },
    { id: "users", label: "Users served" }
  ],
  legend: { req: "request", data: "weights / cache", token: "tokens", miss: "waiting" },
  nodes: {
    users:   { type: "block", x: 0,    y: 0,    w: 1.6, d: 1.6, h: 0.9, color: "t5", label: "200 users", icon: "◉" },
    server:  { type: "block", x: 3.6,  y: 0,    w: 1.8, d: 1.8, h: 1.1, color: "t2", label: "API server" },
    queue:   { type: "stack", x: 3.8,  y: 4.4,  w: 1.6, d: 1.2, n: 4, color: "t4", label: "Queue" },
    sched:   { type: "block", x: 7.2,  y: 0.1,  w: 1.7, d: 1.7, h: 1.0, color: "t1", label: "Scheduler" },
    gpu:     { type: "slab",  x: 10.2, y: -2.2, w: 6.6, d: 6.0, color: "t3", label: "GPU", sub: "80 GB" },
    weights: { type: "block", x: 10.8, y: -1.4, w: 2.2, d: 2.2, h: 1.6, z: 0.15, color: "t3", label: "Weights" },
    kv:      { type: "stack", x: 14.2, y: -1.2, w: 1.7, d: 1.4, n: 3, z: 0.15, color: "accent", label: "KV cache" },
    draft:   { type: "block", x: 11.4, y: 2.4,  w: 1.3, d: 1.1, h: 0.7, z: 0.15, color: "good", label: "Draft model" },
    out:     { type: "block", x: 19,   y: 0.2,  w: 1.5, d: 1.5, h: 0.9, color: "t2", label: "Stream" }
  },
  steps: [
    { title: "One GPU, 200 people waiting", tag: "Problem", add: ["users", "server", "gpu", "weights"], links: [["users", "server"], ["server", "weights"]], badges: { weights: "fp16 · 16 GB" },
      text: "<p>An 8B model on one 80 GB GPU. Served one request at a time, it makes about <b>35 tokens per second</b>, enough for one user. 200 users would wait minutes. This area is about closing that gap.</p>",
      flows: [["users", "server", "req", { count: 3 }], ["server", "weights", "req"]],
      metrics: { tps: "35", ttft: "—", mem: "16 / 80 GB", users: "1" } },
    { title: "Prefill, then decode", tag: "Idea", add: ["kv"], links: [["weights", "kv", "data", { dashed: true }]], focus: ["server", "weights", "kv"],
      text: "<p><b>Prefill</b> reads the whole prompt in parallel and writes the <b>KV cache</b>; this sets the time to first token. <b>Decode</b> then makes one token at a time, and each step is limited by memory bandwidth, not by compute.</p>",
      flows: [["server", "weights", "req", { label: "prefill 1,850 tokens" }], ["weights", "kv", "data", { label: "keys + values", delay: 0.8 }]],
      metrics: { ttft: "380 ms" } },
    { title: "Quantize the weights", tag: "Solution", focus: ["weights"], badges: { weights: "int4 · 4.5 GB" },
      text: "<p>Storing weights in <b>4 bits</b> instead of 16 shrinks them from 16 GB to about 4.5 GB, with a small, measurable quality cost. Less memory to read per token also means faster decoding.</p>",
      metrics: { mem: "4.5 / 80 GB", tps: "60" },
      changed: ["~ Weights 16 GB → 4.5 GB", "~ 35 → 60 tokens / s"] },
    { title: "Requests pile up", tag: "Problem", add: ["queue"], links: [["server", "queue", "miss", { dashed: true }]], focus: ["users", "server", "queue"],
      text: "<p>One request at a time leaves the GPU mostly idle while it waits on memory, and everyone else queues. Time to first token climbs to <b>several seconds</b>.</p>",
      flows: [["users", "server", "req", { count: 4, dur: 1.2 }], ["server", "queue", "miss", { label: "waiting" }]],
      metrics: { ttft: "6.2 s" } },
    { title: "Continuous batching", tag: "Solution", add: ["sched"], links: [["server", "sched"], ["queue", "sched"], ["sched", "weights"]], focus: ["queue", "sched", "weights"],
      text: "<p>The <b>scheduler</b> runs many requests through the model in the same pass, adding new ones the moment others finish. Each pass reads the weights once for 64 users, so throughput jumps.</p>",
      flows: [["queue", "sched", "req", { label: "join batch", count: 3 }], ["sched", "weights", "req", { count: 3 }]],
      metrics: { tps: "2,400", ttft: "450 ms", users: "64" } },
    { title: "The KV cache fills the GPU", tag: "Idea", focus: ["kv", "weights"], badges: { kv: "48 GB" },
      text: "<p>Now the limit is memory for the <b>KV cache</b>: every active user holds their own. PagedAttention stores it in small pages so almost none is wasted, which lets more users fit.</p>",
      metrics: { mem: "52 / 80 GB" },
      note: "The KV cache lesson in this area does this memory math step by step." },
    { title: "Speculative decoding", tag: "Solution", add: ["draft"], links: [["draft", "weights", "token", { dashed: true }]], focus: ["draft", "weights"],
      text: "<p>A small <b>draft model</b> guesses the next 4 tokens; the big model checks all 4 in one pass and keeps the ones it agrees with. Same output, about <b>1.5× faster</b> decoding.</p>",
      flows: [["draft", "weights", "token", { label: "4 guesses" }], ["weights", "draft", "res", { label: "3 accepted", delay: 0.9 }]],
      metrics: { tps: "3,600" } },
    { title: "Stream to everyone", tag: "Solution", add: ["out"], links: [["weights", "out"]], focus: ["weights", "out", "users"],
      text: "<p>Tokens stream back the moment they're made. The same GPU now serves <b>200 users</b> with first tokens in under half a second.</p>",
      flows: [["weights", "out", "token", { count: 3, dur: 1.1 }], ["out", "users", "token", { count: 3, dur: 1.6, lift: 110 }]],
      metrics: { users: "200" } },
    { title: "The whole server", tag: "Recap",
      text: "<p>From 35 tokens per second for one user to 3,600 for 200, on the same hardware. The lessons in this area cover each step:</p><ul><li><b>Quantization</b> and <b>GPU memory math</b></li><li>The <b>KV cache</b> and <b>batching</b></li><li><b>Speculative decoding</b></li><li><b>Serving engines</b> and <b>running locally</b></li></ul>",
      flows: [["users", "server", "req", { count: 1 }], ["sched", "weights", "req", { count: 1 }], ["weights", "out", "token", { count: 1 }], ["out", "users", "token", { count: 1, lift: 110 }]] }
  ],
  learn: [
    "Why decoding is limited by memory, not compute",
    "How quantization shrinks and speeds up a model",
    "How continuous batching serves many users at once",
    "Why the KV cache decides how many users fit",
    "How speculative decoding speeds up generation"
  ]
};
