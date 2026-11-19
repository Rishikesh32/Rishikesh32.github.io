/* Flagship scene: self-attention, followed for one token ("it") (plays on Transformers & LLMs, 05.3). */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  var WORDS = ["the", "animal", "didn't", "cross", "the", "street", "because", "it", "was", "tired"];
  /* Illustrative q·k scores for the query of "it" (one head, d_k = 64, so √d_k = 8). */
  var RAW = [4, 36, 4, 8, 4, 20, 8, 12, 4, 16];
  var DK_ROOT = 8, IT = 7, SP = 1.6;

  function softmax(xs) {
    var m = Math.max.apply(null, xs.filter(function (v) { return v !== -Infinity; }));
    var e = xs.map(function (v) { return v === -Infinity ? 0 : Math.exp(v - m); });
    var s = e.reduce(function (a, b) { return a + b; }, 0);
    return e.map(function (v) { return v / s; });
  }
  var SCALED = RAW.map(function (r) { return r / DK_ROOT; });
  var W_FULL = softmax(SCALED);
  var W_MASK = softmax(SCALED.map(function (v, i) { return i > IT ? -Infinity : v; }));

  /* ---- nodes ---- */
  var nodes = {};
  var ids = { w: [], t: [], q: [], k: [], v: [] };
  WORDS.forEach(function (w, i) {
    var x = i * SP;
    nodes["w" + i] = { type: "pill", x: x + 0.5, y: 0.5, z: 0.5, label: w };
    nodes["t" + i] = { type: "block", x: x, y: 0, w: 1, d: 1, h: 0.7, color: i === IT ? "accent" : "t1", label: w };
    nodes["q" + i] = { type: "block", x: x + 0.15, y: 1.9, w: 0.7, d: 0.7, h: 0.4, color: "t5", icon: "q", labelGap: 2 };
    nodes["k" + i] = { type: "block", x: x + 0.15, y: 3.25, w: 0.7, d: 0.7, h: 0.4, color: "t2", icon: "k", labelGap: 2 };
    nodes["v" + i] = { type: "block", x: x + 0.15, y: 4.6, w: 0.7, d: 0.7, h: 0.4, color: "t3", icon: "v", labelGap: 2 };
    ["w", "t", "q", "k", "v"].forEach(function (p) { ids[p].push(p + i); });
  });
  nodes.out = { type: "block", x: 10.6, y: 6.1, w: 1.1, d: 1.1, h: 0.8, color: "good", label: "new \"it\"" };
  nodes.h1 = { type: "block", x: 0.6, y: 3.4, w: 1.3, d: 1.3, h: 0.9, color: "t2", label: "reference head" };
  nodes.h2 = { type: "block", x: 5.4, y: 3.4, w: 1.3, d: 1.3, h: 0.9, color: "t3", label: "prev-token head" };
  nodes.h3 = { type: "block", x: 10.2, y: 3.4, w: 1.3, d: 1.3, h: 0.9, color: "t4", label: "first-token head" };
  /* n × n score grids, 0.8 units per 1k tokens; each square cell is one 1k × 1k block (1M scores). */
  var SLABS = { s1: [0, 4.4, 0.8, "t2", "1k → 1M"], s2: [1.4, 3.6, 1.6, "t3", "2k → 4M"], s4: [3.8, 2.0, 3.2, "t4", "4k → 16M"], s8: [8.2, -1.2, 6.4, "signal", "8k → 64M"] };
  Object.keys(SLABS).forEach(function (id) {
    var a = SLABS[id];
    nodes[id] = { type: "slab", x: a[0], y: a[1], w: a[2], d: a[2], color: a[3] };
    nodes["l" + id] = { type: "pill", x: a[0] + a[2] / 2, y: a[1] + a[2] / 2, z: 0.9, label: a[4] };
  });
  /* never shown: reserves stage space for the worked-numbers panel (top right) */
  nodes.pad = { type: "pill", x: 5.9, y: -11.8, z: 0 };

  var QKV = ids.q.concat(ids.k, ids.v);
  var GRID = ids.t.concat(QKV);

  /* ---- worked-numbers panel (drawn in the empty top-right corner of the stage) ---- */
  function fmt(v) { return v.toFixed(2).replace(/^0/, ""); }
  function panel(mode) {
    return function (svg, c) {
      var x0 = 334, y0 = -106, rowH = 16.5, W = 252;
      var showW = mode !== "raw", masked = mode === "mask";
      var foot = mode === "sum" || mode === "mask";
      var H = 40 + rowH * WORDS.length + (foot ? 22 : 6);
      var g = c.el("g", { class: "attn-panel" }, svg);
      c.el("rect", { x: x0, y: y0, width: W, height: H, rx: 10, style: "fill:var(--surface);stroke:var(--ink);stroke-width:1.5" }, g);
      function t(x, y, s, o) {
        o = o || {};
        var n = c.el("text", { x: x, y: y, "text-anchor": o.anchor || "start", style: "fill:" + (o.color || "var(--ink)") + ";font-family:var(--font-mono);font-size:" + (o.size || 12) + "px;font-weight:" + (o.weight || 600) }, g);
        n.textContent = s;
        return n;
      }
      t(x0 + 10, y0 + 16, mode === "raw" ? "query of \"it\" · key" : masked ? "causal: \"it\" sees 1–8" : "softmax(q·k ÷ 8)", { weight: 700 });
      var hy = y0 + 34, cW = x0 + 10, cR = x0 + 104, cS = x0 + 138, bX = x0 + 146, bW = 58, cWt = x0 + W - 8;
      t(cW, hy, "key", { color: "var(--ink-3)", size: 11 });
      t(cR, hy, "q·k", { anchor: "end", color: "var(--ink-3)", size: 11 });
      if (showW) { t(cS, hy, "÷8", { anchor: "end", color: "var(--ink-3)", size: 11 }); t(cWt, hy, "w", { anchor: "end", color: "var(--ink-3)", size: 11 }); }
      var ws = masked ? W_MASK : W_FULL;
      WORDS.forEach(function (w, i) {
        var y = hy + 6 + rowH * (i + 1) - 4;
        var future = masked && i > IT;
        if (i === 1 && showW) c.el("rect", { x: x0 + 4, y: y - 12.5, width: W - 8, height: rowH - 1, rx: 4, style: "fill:" + c.mix("var(--good)", 28) }, g);
        if (i === IT) c.el("rect", { x: x0 + 4, y: y - 12.5, width: W - 8, height: rowH - 1, rx: 4, style: "fill:" + c.mix("var(--accent)", 16) }, g);
        t(cW, y, w, { color: future ? "var(--ink-3)" : "var(--ink)" });
        t(cR, y, String(RAW[i]), { anchor: "end", color: future ? "var(--ink-3)" : "var(--ink)" });
        if (!showW) {
          c.el("rect", { x: x0 + 112, y: y - 9, width: Math.max(2, (RAW[i] / 36) * 120), height: 8, rx: 2, style: "fill:var(--accent)" }, g);
          return;
        }
        if (future) {
          t(cS, y, "−∞", { anchor: "end", color: "var(--signal)", weight: 700 });
          t(cWt, y, "0", { anchor: "end", color: "var(--signal)" });
          return;
        }
        t(cS, y, String(SCALED[i]), { anchor: "end" });
        c.el("rect", { x: bX, y: y - 9, width: Math.max(1.5, ws[i] * bW), height: 8, rx: 2, style: "fill:" + (i === 1 ? "var(--good)" : "var(--accent)") }, g);
        t(cWt, y, fmt(ws[i]), { anchor: "end", weight: i === 1 ? 700 : 600 });
      });
      if (foot) {
        var fy = y0 + H - 9;
        t(x0 + 10, fy, masked ? "was, tired → −∞ → weight 0" : "rows sum to 1.00", { color: masked ? "var(--signal)" : "var(--ink-2)", size: 11 });
      }
    };
  }

  /* ---- grid lines on the n × n slabs: one cell = 1k × 1k = 1M scores ---- */
  function grids(list) {
    return function (svg, c) {
      var g = c.el("g", { class: "attn-grid" }, svg);
      list.forEach(function (id) {
        var a = SLABS[id], n = Math.round(a[2] / 0.8), z = 0.15;
        for (var i = 1; i < n; i++) {
          var u = a[0] + i * 0.8, v = a[1] + i * 0.8;
          var p1 = c.P(u, a[1], z), p2 = c.P(u, a[1] + a[2], z), p3 = c.P(a[0], v, z), p4 = c.P(a[0] + a[2], v, z);
          c.el("line", { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], style: "stroke:var(--ink);stroke-width:1;opacity:.35" }, g);
          c.el("line", { x1: p3[0], y1: p3[1], x2: p4[0], y2: p4[1], style: "stroke:var(--ink);stroke-width:1;opacity:.35" }, g);
        }
      });
    };
  }

  /* ---- the vector for "it" (step 2) ---- */
  function vectorNote(svg, c) {
    var a = c.anchor("t7"), x = a[0] + 120, y = a[1] - 78;
    c.el("path", { d: "M" + (a[0] + 16) + "," + (a[1] - 36) + " Q" + (a[0] + 40) + "," + (y + 4) + " " + (x - 90) + "," + (y + 6), style: "fill:none;stroke:var(--accent);stroke-width:1.6;stroke-dasharray:4 4" }, svg);
    c.pill(svg, x, y, "it = [0.21, −1.37, 0.05, …]", { stroke: "var(--accent)" });
    c.pill(svg, x, y + 24, "768 numbers", { small: true });
  }

  /* ---- helpers ---- */
  function arr(prefix, from, to) { var a = []; for (var i = from; i <= to; i++) a.push(prefix + i); return a; }

  window.ATLAS_SCENES["transformers-llms/attention"] = {
    unit: 34,
    metrics: [
      { id: "tok", label: "Tokens" },
      { id: "scores", label: "Scores / head", tone: "signal" },
      { id: "top", label: "Top weight", tone: "good" },
      { id: "heads", label: "Heads", tone: "accent" }
    ],
    legend: { req: "query → key", data: "values / projections", token: "head output", miss: "ambiguity / masked" },
    nodes: nodes,
    steps: [
      { title: "What does \"it\" mean?", tag: "Problem", add: ids.w, focus: ["w1", "w5", "w7"],
        text: "<p>Read <code>the animal didn't cross the street because it was tired</code>. You know at once that <b>it</b> is the animal. Swap <i>tired</i> for <i>wide</i> and it becomes the street.</p><p>A model that reads each word on its own can't tell. The vector for <b>it</b> needs to pull in information from the right earlier word.</p>",
        key: "Meaning depends on context. Self-attention is how each token gathers that context from the other tokens.",
        badges: { w1: "it?", w5: "it?" },
        flows: [["w7", "w1", "miss", { count: 1, lift: 46 }], ["w7", "w5", "miss", { count: 1, lift: 30 }]],
        metrics: { tok: "10", scores: "—", top: "—", heads: "—" } },

      { title: "Tokens become vectors", tag: "Idea", remove: ids.w, add: ids.t, focus: ["t7"], draw: vectorNote,
        text: "<p>The tokenizer splits the sentence into <b>10 tokens</b>, and each one is looked up in the embedding table and combined with its position. Every token is now a vector of <b>d = 768</b> numbers (the size of GPT-2 small).</p><p>Right now the vector for <b>it</b> only describes the word <i>it</i>. It knows nothing about animals or streets.</p>",
        changed: ["+ 10 tokens × 768 dims", "+ Position information added"],
        metrics: { tok: "10" } },

      { title: "Each token makes Q, K and V", tag: "Idea", add: QKV, focus: ["t7", "q7", "k7", "v7"].concat(ids.q, ids.k, ids.v),
        text: "<p>Three learned matrices project every token three ways:</p><ul><li><b>Query</b> (q): what this token is looking for</li><li><b>Key</b> (k): what it offers to others</li><li><b>Value</b> (v): the content it hands over</li></ul><p>In one head of GPT-2 small, <code>W_Q</code>, <code>W_K</code> and <code>W_V</code> are each 768 × 64, so every q, k and v has <b>d_k = 64</b> numbers.</p>",
        flows: [["t7", "q7", "data", { count: 1, lift: 26 }], ["t7", "k7", "data", { count: 1, lift: 26 }], ["t7", "v7", "data", { count: 1, lift: 26 }]],
        note: "W_Q, W_K and W_V are the only learned parts of a head (plus W_O after the heads are combined).",
        changed: ["+ 10 queries, 10 keys, 10 values", "+ Each has d_k = 64 numbers"],
        metrics: { heads: "1" } },

      { title: "Score the query against every key", tag: "Idea", focus: ["t7", "q7"].concat(ids.k),
        text: "<p>Take the query of <b>it</b> and take a dot product with each of the 10 keys. A large score means \"this token looks relevant to me\".</p><p>The key of <b>animal</b> scores 36, far above the rest. <b>street</b> (20) and <b>tired</b> (16) come next. The panel shows the whole row (example numbers).</p>",
        flows: ids.k.map(function (k) { return ["q7", k, "req", { count: 1, dur: 1.4, lift: 18 }]; }),
        draw: panel("raw"),
        changed: ["+ 10 dot products for one query", "~ Highest: animal = 36"],
        metrics: { scores: "10" } },

      { title: "Scale by √d_k, then softmax", tag: "Solution", focus: ["t7", "q7", "k1", "t1"],
        text: "<p>Divide each score by <b>√64 = 8</b>, then apply <b>softmax</b>: exponentiate and divide by the sum, so the weights are positive and add up to 1.</p><p><b>animal</b> gets <b>0.71</b> of the attention, <b>street</b> 0.10, <b>tired</b> 0.06. Every other token gets a few percent.</p>",
        key: "Without the ÷ 8, the gap 36 vs 20 becomes e¹⁶ and animal would take 0.9999999. The softmax saturates and its gradients vanish.",
        draw: panel("soft"),
        changed: ["~ Scores ÷ 8", "+ Softmax: weights sum to 1", "~ animal 36 → 4.5 → 0.71"],
        metrics: { top: "0.71 animal" } },

      { title: "Mix the values", tag: "Solution", add: ["out"], focus: ["out", "v1", "v5", "v9", "v7", "t7", "t1"], badges: { out: "71% animal" },
        text: "<p>The new vector for <b>it</b> is a weighted sum of all 10 value vectors:</p><p><code>0.71·v(animal) + 0.10·v(street) + 0.06·v(tired) + …</code></p><p>So the updated <b>it</b> now carries mostly animal information. Every token does the same thing in parallel, so one head computes a full <b>10 × 10 = 100</b> grid of scores.</p>",
        flows: ids.v.map(function (v, i) { return [v, "out", "data", { count: 1, dur: 1.8, lift: 20, size: Math.max(3, Math.round(3 + W_FULL[i] * 9)) }]; }),
        draw: panel("sum"),
        note: "This is the same arithmetic as the page's worked example, just with 10 tokens instead of 3. Bigger dots carry more weight.",
        changed: ["+ Output for \"it\" = weighted values", "~ All 10 queries at once: 100 scores"],
        metrics: { scores: "100" } },

      { title: "The causal mask: no peeking", tag: "Idea", focus: ["t7", "q7", "out"].concat(arr("k", 0, 7), arr("v", 0, 7)), badges: { out: "77% animal" },
        text: "<p>A decoder model like GPT writes left to right. When it processes <b>it</b>, the words <b>was</b> and <b>tired</b> don't exist yet, so they must not leak in.</p><p>The <b>causal mask</b> sets their scores to <b>−∞</b> before softmax, giving them exactly zero weight. The 8 remaining weights renormalize and <b>animal</b> rises to <b>0.77</b>.</p>",
        flows: arr("k", 0, 7).map(function (k) { return ["q7", k, "req", { count: 1, dur: 1.4, lift: 18 }]; }).concat([["q7", "k8", "miss", { count: 1, lift: 18 }], ["q7", "k9", "miss", { count: 1, lift: 18 }]]),
        draw: panel("mask"),
        note: "Mask before softmax, with −∞. Masking with 0, or after softmax, is a classic bug: the weights no longer sum to 1.",
        changed: ["+ Mask on was, tired (−∞)", "~ Top weight 0.71 → 0.77", "~ Only 55 of 100 scores are used"],
        metrics: { top: "0.77 animal" } },

      { title: "Many heads, many relations", tag: "Solution", remove: QKV.concat(["out"]), add: ["h1", "h2", "h3"], badges: { h1: "it → animal", h2: "it → because", h3: "it → the" },
        text: "<p>One head can only track one kind of relation. So the layer runs several <b>heads</b> in parallel, each with its own W_Q, W_K, W_V. GPT-2 small has <b>12 heads × 64 = 768</b>.</p><ul><li>a reference head links <b>it</b> to <b>animal</b></li><li>a previous-token head looks one word back</li><li>a sink head parks weight on the first token</li></ul><p>Their outputs are concatenated and mixed by <code>W_O</code>.</p>",
        flows: [["t7", "h1", "req", { count: 1, lift: 20 }], ["t7", "h2", "req", { count: 1, lift: 20 }], ["t7", "h3", "req", { count: 1, lift: 20 }],
          ["h1", "t1", "token", { count: 1, delay: 0.7, lift: 40 }], ["h2", "t6", "token", { count: 1, delay: 0.7, lift: 20 }], ["h3", "t0", "token", { count: 1, delay: 0.7, lift: 60 }]],
        note: "Larger models use more, wider heads: 32 heads of 128 dims when d = 4,096. These three patterns match the demo heads on this page.",
        changed: ["+ 3 of 12 heads shown", "+ Concat + W_O → one vector per token"],
        metrics: { heads: "12" } },

      { title: "The bill: n² scores", tag: "Problem", remove: ids.t.concat(["h1", "h2", "h3"]), add: ["s1", "s2", "s4", "ls1", "ls2", "ls4"], draw: grids(["s2", "s4"]),
        text: "<p>Every query is scored against every key, so a head builds an <b>n × n</b> grid. Each square here is that grid, and each small cell is 1k × 1k = 1M scores.</p><ul><li>1k tokens → 1M scores</li><li>2k tokens → 4M scores</li><li>4k tokens → 16M scores</li></ul><p>Doubling the context <b>quadruples</b> the scores. That is why long prompts slow down the first token.</p>",
        key: "Attention compute and score memory grow with the square of the sequence length.",
        changed: ["~ 10 → 1,000 tokens", "~ 100 → 1M scores per head"],
        metrics: { tok: "1k", scores: "1M", top: "—" } },

      { title: "Long context, quadratic cost", tag: "Problem", add: ["s8", "ls8"], focus: ["s8", "ls8", "s1", "ls1"], draw: grids(["s2", "s4", "s8"]),
        text: "<p>At <b>8k</b> tokens one head needs <b>64M</b> scores, 64 times the 1k case for 8 times the text. At 32k it is about <b>1 billion</b>.</p><p>And that is per head, per layer: GPT-2 small runs 12 heads in each of 12 layers. FlashAttention computes the grid in tiles so it never stores it whole, but the n² work remains.</p>",
        note: "Grouped-query attention, the KV cache and prefix caching all exist to tame this one operation. Lesson 11 covers them.",
        changed: ["~ 1k → 8k tokens (8×)", "~ 1M → 64M scores (64×)"],
        metrics: { tok: "8k", scores: "64M" } },

      { title: "Self-attention in one picture", tag: "Recap", remove: ["s1", "s2", "s4", "s8", "ls1", "ls2", "ls4", "ls8"], add: GRID.concat(["out"]), focus: ["t7", "t1", "q7", "k1", "v1", "out"], badges: { h1: "", h2: "", h3: "" },
        text: "<p>For every token, in every head:</p><ul><li>project to <b>q, k, v</b></li><li>score <b>q · k</b> against every key, ÷ <b>√d_k</b></li><li><b>mask</b> the future, then <b>softmax</b> into weights</li><li>mix the <b>values</b> with those weights</li></ul><p>That is how <b>it</b> ends up 77% about the animal, and why the cost grows as <b>n²</b>.</p>",
        flows: [["q7", "k1", "req", { count: 1, lift: 30 }], ["v1", "out", "data", { count: 1, delay: 0.6, size: 9 }]],
        metrics: { tok: "10", scores: "100", top: "0.77 animal", heads: "12" } }
    ],
    learn: [
      "What queries, keys and values each do",
      "How scores become weights with √d_k and softmax",
      "How a weighted sum of values gives \"it\" its meaning",
      "Why decoders mask future tokens with −∞",
      "Why attention cost grows as n²"
    ]
  };
})();

/* Overview scene: from text to the next token (plays on the Transformers & LLMs overview). */
window.ATLAS_SCENES["transformers-llms/overview"] = {
  unit: 32,
  metrics: [
    { id: "tok", label: "Tokens in context" },
    { id: "layers", label: "Layers" },
    { id: "params", label: "Parameters" },
    { id: "top", label: "Top next token", tone: "good" }
  ],
  legend: { req: "text", data: "numbers", token: "tokens" },
  nodes: {
    text:    { type: "block", x: 0,    y: 0,    w: 1.6, d: 1.6, h: 0.8, color: "t5", label: "Prompt", icon: "¶" },
    tok:     { type: "block", x: 3.4,  y: 0,    w: 1.6, d: 1.6, h: 1.0, color: "t2", label: "Tokenizer" },
    emb:     { type: "stack", x: 6.8,  y: 0.2,  w: 1.6, d: 1.2, n: 4, color: "t1", label: "Embeddings" },
    blocks:  { type: "block", x: 10,   y: -0.3, w: 2.4, d: 2.4, h: 2.3, color: "t3", label: "Transformer", sub: "×32" },
    weights: { type: "stack", x: 10.4, y: -4.6, w: 1.8, d: 1.3, n: 5, color: "t3", label: "Weights" },
    kv:      { type: "cyl",   x: 11.2, y: 4.6,  r: 0.8, h: 1.0, color: "accent", label: "KV cache" },
    logits:  { type: "block", x: 14.4, y: 0,    w: 1.6, d: 1.6, h: 0.9, color: "t4", label: "Logits" },
    sample:  { type: "block", x: 17.6, y: 0,    w: 1.4, d: 1.4, h: 0.8, color: "good", label: "Sampler" }
  },
  steps: [
    { title: "One job: predict the next token", tag: "Problem", add: ["text", "blocks"],
      text: "<p>Every LLM, from autocomplete to a coding agent, does one thing over and over: given the text so far, predict the <b>next token</b>. Follow <code>The cat sat on the</code> through the machine.</p>",
      key: "Chat, reasoning and tool use are all next-token prediction run in a loop.",
      flows: [["text", "blocks", "req", { label: "The cat sat on the", lift: 50 }]],
      metrics: { tok: "—", layers: "32", params: "8B", top: "—" } },
    { title: "Text becomes token ids", tag: "Idea", add: ["tok"], links: [["text", "tok"]], focus: ["text", "tok"], badges: { tok: "5 ids" },
      text: "<p>The <b>tokenizer</b> splits the text into pieces from a fixed vocabulary and maps each piece to an integer id. Common words are one token; rare words are several.</p>",
      flows: [["text", "tok", "req", { label: "The cat sat on the" }]],
      metrics: { tok: "5" } },
    { title: "Ids become vectors", tag: "Idea", add: ["emb"], links: [["tok", "emb"]], focus: ["tok", "emb"], badges: { emb: "5 × 4,096" },
      text: "<p>Each id looks up a learned <b>embedding</b>: a vector of 4,096 numbers. Position information is mixed in, so the model knows that \"cat\" comes before \"sat\".</p>",
      flows: [["tok", "emb", "data", { label: "[791, 8415, 7731, 389, 279]" }]] },
    { title: "32 blocks of attention + MLP", tag: "Idea", links: [["emb", "blocks"]], focus: ["emb", "blocks"],
      text: "<p>The vectors pass through 32 identical <b>transformer blocks</b>. In each one, <b>attention</b> lets every token pull in context from earlier tokens, and an <b>MLP</b> transforms each vector on its own.</p>",
      flows: [["emb", "blocks", "token", { count: 3 }]],
      note: "The self-attention lesson in this area plays this step in slow motion." },
    { title: "Where the knowledge lives", tag: "Idea", add: ["weights"], links: [["weights", "blocks", "data", { dashed: true }]], focus: ["weights", "blocks"],
      text: "<p>Those blocks are defined by about <b>8 billion learned numbers</b>, the weights. Pretraining on trillions of tokens set them; instruction tuning and RLHF taught the model to follow requests.</p>",
      flows: [["weights", "blocks", "data", { label: "8B weights" }]] },
    { title: "Scores for every possible token", tag: "Idea", add: ["logits"], links: [["blocks", "logits"]], focus: ["blocks", "logits"], badges: { logits: "128k scores" },
      text: "<p>The last vector is turned into a <b>logit</b>, a raw score, for every token in the vocabulary. Softmax turns the scores into probabilities.</p>",
      flows: [["blocks", "logits", "token"]],
      metrics: { top: "mat · 0.62" } },
    { title: "Pick one, append, repeat", tag: "Solution", add: ["sample"], links: [["logits", "sample"]], focus: ["logits", "sample", "text"],
      text: "<p>The <b>sampler</b> picks a token using temperature and top-p. The chosen token, \"mat\", is appended to the prompt, and the whole loop runs again for the next one.</p>",
      flows: [["logits", "sample", "token"], ["sample", "text", "token", { label: "mat", lift: 90, delay: 0.6 }]],
      metrics: { tok: "6" },
      changed: ["+ \"mat\" appended", "~ Context 5 → 6 tokens"] },
    { title: "The KV cache keeps the loop fast", tag: "Solution", add: ["kv"], links: [["blocks", "kv", "data", { dashed: true }]], focus: ["blocks", "kv"],
      text: "<p>Without help, every new token would recompute attention over the whole history. The <b>KV cache</b> stores each token's keys and values, so each step only computes the newest token.</p>",
      flows: [["blocks", "kv", "data", { label: "keys + values" }], ["kv", "blocks", "data", { delay: 0.8 }]],
      metrics: { tok: "7" } },
    { title: "The whole machine", tag: "Recap",
      text: "<p>Text → tokens → vectors → 32 blocks → scores → one sampled token → repeat. Each lesson in this area opens one of these boxes:</p><ul><li><b>Tokenization</b> and <b>embeddings</b></li><li><b>Attention</b> and the <b>transformer block</b></li><li><b>Training</b>: pretraining, tuning, RLHF</li><li><b>Decoding</b> and <b>choosing a model</b></li></ul>",
      flows: [["text", "tok", "req", { count: 1 }], ["tok", "emb", "data", { count: 1 }], ["emb", "blocks", "token", { count: 1 }], ["blocks", "logits", "token", { count: 1 }], ["logits", "sample", "token", { count: 1 }], ["sample", "text", "token", { count: 1, lift: 90 }]] }
  ],
  learn: [
    "Why an LLM is a next-token predictor run in a loop",
    "How text becomes token ids and vectors",
    "What the transformer blocks and weights do",
    "How logits and sampling pick the next token",
    "Why the KV cache makes generation fast"
  ]
};
