/* Flagship scene: one toolkit, six worlds (plays on the Specializations overview).
   Layout on the screen, top to bottom: the shared core, a row of six specialization
   hubs, and one "workbench" lane where the active branch builds its mini pipeline.
   Positions are given in screen terms: a = x - y (left/right), b = x + y (up/down).
   Numbers: ViT 224² / 16 px patches = 196 tokens; IoU of [0,0,10,10] vs
   [1.6,0,11.6,10] = 84 / 116 = 0.72; voice budget 250 + 80 + 300 + 120 + 50 = 800 ms;
   recsys funnel 5 + 30 + 2 ms; GRPO and discounting as on the page. */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  /* place a node by its centre in screen terms (a, b) */
  function at(type, a, b, o) {
    var w = o.w || o.s || 1.6, d = o.d || o.s || 1.6;
    if (type === "cyl") { o.x = (b + a) / 2; o.y = (b - a) / 2; }
    else { o.x = (b + a) / 2 - w / 2; o.y = (b - a) / 2 - d / 2; o.w = w; o.d = d; }
    delete o.s; o.type = type;
    return o;
  }
  var CORE = 1.6, HUB = 9.2, LANE = 17;

  /* shared panel to the right of the hub and lane rows */
  function panel(c, title, W, H) {
    var o = c.P(9.9, -0.9, 0), x0 = o[0], y0 = o[1];
    var g = c.el("g", { class: "spec-panel" }, null);
    c.el("rect", { x: x0, y: y0, width: W, height: H, rx: 10, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.2" }, g);
    var t = c.el("text", { x: x0 + 12, y: y0 + 19, style: "fill:var(--ink-2);font-size:10.5px;font-weight:700;letter-spacing:.04em" }, g);
    t.textContent = title;
    return { g: g, x: x0 + 12, y: y0 + 30, w: W - 24 };
  }
  function txt(c, g, x, y, s, st) { var t = c.el("text", { x: x, y: y, style: "font-size:10px;fill:var(--ink-2);" + (st || "") }, g); t.textContent = s; return t; }

  function iouPanel(svg, c) {
    var p = panel(c, "IOU: OVERLAP / UNION", 214, 120);
    svg.appendChild(p.g);
    var s = 6, ox = p.x + 6, oy = p.y + 8;
    c.el("rect", { x: ox, y: oy, width: 10 * s, height: 10 * s, style: "fill:color-mix(in srgb, var(--t1) 22%, transparent);stroke:var(--t1);stroke-width:1.6" }, p.g);
    c.el("rect", { x: ox + 1.6 * s, y: oy, width: 10 * s, height: 10 * s, style: "fill:color-mix(in srgb, var(--signal) 18%, transparent);stroke:var(--signal);stroke-width:1.6;stroke-dasharray:4 3" }, p.g);
    var tx = ox + 11.6 * s + 12;
    txt(c, p.g, tx, oy + 10, "true box", "fill:var(--t1);font-weight:700");
    txt(c, p.g, tx, oy + 24, "predicted", "fill:var(--signal);font-weight:700");
    txt(c, p.g, tx, oy + 42, "overlap 84");
    txt(c, p.g, tx, oy + 55, "union 116");
    txt(c, p.g, p.x, oy + 10 * s + 18, "IoU = 84 / 116 = 0.72  ≥ 0.5 ✓", "font-size:10.5px;font-weight:700;fill:var(--ink)");
  }

  function latencyPanel(svg, c) {
    var p = panel(c, "VOICE-TO-VOICE BUDGET", 240, 96);
    svg.appendChild(p.g);
    var parts = [["VAD", 250, "var(--t2)"], ["ASR", 80, "var(--t3)"], ["LLM", 300, "var(--accent)"], ["TTS", 120, "var(--t5)"], ["net", 50, "var(--ink-3)"]];
    var x = p.x, k = p.w / 800, y = p.y + 4;
    parts.forEach(function (q) {
      var w = q[1] * k;
      c.el("rect", { x: x, y: y, width: w - 1.5, height: 16, rx: 2, style: "fill:" + q[2] + ";opacity:.85" }, p.g);
      txt(c, p.g, x + 1, y + 30, q[0], "font-size:9.5px");
      txt(c, p.g, x + 1, y + 42, String(q[1]), "font-size:9.5px;fill:var(--ink-3)");
      x += w;
    });
    txt(c, p.g, p.x, y + 60, "total ≈ 800 ms (1.5 s feels broken)", "font-size:10px;font-weight:700;fill:var(--ink)");
  }

  function forecastPanel(svg, c) {
    var p = panel(c, "BACKTEST · 4 FOLDS · 7-DAY HORIZON", 240, 124);
    svg.appendChild(p.g);
    var x0 = p.x, y0 = p.y + 6, W = p.w, H = 44, n = 40, hist = 30;
    function v(i) { return 0.5 + 0.012 * i + 0.22 * Math.sin(i * 2 * Math.PI / 7); }
    var pts = [], fc = [], up = [], lo = [];
    for (var i = 0; i < n; i++) {
      var X = x0 + i * W / (n - 1), Y = y0 + H - v(i) * H * 0.85;
      if (i <= hist) pts.push(X.toFixed(1) + "," + Y.toFixed(1));
      if (i >= hist) { fc.push(X.toFixed(1) + "," + Y.toFixed(1)); var sp = 3 + (i - hist) * 1.6; up.push(X.toFixed(1) + "," + (Y - sp).toFixed(1)); lo.unshift(X.toFixed(1) + "," + (Y + sp).toFixed(1)); }
    }
    c.el("polygon", { points: up.concat(lo).join(" "), style: "fill:color-mix(in srgb, var(--t5) 26%, transparent)" }, p.g);
    c.el("polyline", { points: pts.join(" "), style: "fill:none;stroke:var(--ink-2);stroke-width:1.6" }, p.g);
    c.el("polyline", { points: fc.join(" "), style: "fill:none;stroke:var(--t5);stroke-width:1.8;stroke-dasharray:4 3" }, p.g);
    for (var f = 0; f < 4; f++) {
      var fy = y0 + H + 8 + f * 6, cut = 0.42 + f * 0.13;
      c.el("rect", { x: x0, y: fy, width: W * cut, height: 4, rx: 1, style: "fill:color-mix(in srgb, var(--ink-3) 45%, transparent)" }, p.g);
      c.el("rect", { x: x0 + W * cut + 3, y: fy, width: W * 0.11, height: 4, rx: 1, style: "fill:var(--t5)" }, p.g);
    }
    txt(c, p.g, x0, y0 + H + 42, "shaded: P10–P90 forecast band", "font-size:9.5px");
    txt(c, p.g, x0, y0 + H + 56, "MASE 0.82 < 1: beats seasonal naive", "font-size:10px;font-weight:700;fill:var(--ink)");
  }

  function pathPanel(svg, c) {
    var rows = [["shopping assistant", "Vision + RecSys", true], ["support voice agent", "Speech", false], ["design / media tool", "Diffusion", false], ["capacity planning", "Time series", false], ["tuning a model", "RL", false]];
    var p = panel(c, "IF YOU BUILD …  GO DEEP ON", 256, 30 + rows.length * 17 + 8);
    svg.appendChild(p.g);
    rows.forEach(function (r, i) {
      var y = p.y + 8 + i * 17;
      txt(c, p.g, p.x, y, r[0], r[2] ? "font-weight:700;fill:var(--ink)" : "");
      txt(c, p.g, p.x + 128, y, "→ " + r[1], r[2] ? "font-weight:700;fill:var(--accent)" : "fill:var(--ink)");
    });
  }

  window.ATLAS_SCENES["specializations/overview"] = {
    unit: 32,
    metrics: [
      { id: "worlds", label: "Worlds explored" },
      { id: "shape", label: "Data shape" },
      { id: "key", label: "Key number", tone: "accent" },
      { id: "budget", label: "Budget", tone: "signal" }
    ],
    legend: { req: "input / action", data: "features / candidates", res: "output", token: "tokens / audio", grad: "reward / update" },
    nodes: {
      /* shared core */
      emb:   at("block", -4.4, CORE, { s: 1.5, h: 1.1, color: "accent", label: "Embeddings", icon: "⋮" }),
      tfm:   at("block", 0, CORE, { s: 1.8, h: 1.5, color: "accent", label: "Transformers", icon: "✦" }),
      train: at("block", 4.4, CORE, { s: 1.5, h: 1.1, color: "accent", label: "Training loop", icon: "⟳" }),
      /* six specialization hubs */
      vis: at("block", -8, HUB, { s: 1.3, h: 0.9, color: "t1", label: "Vision", icon: "◐" }),
      sp:  at("block", -4.8, HUB, { s: 1.3, h: 0.9, color: "t2", label: "Speech", icon: "♪" }),
      dif: at("block", -1.6, HUB, { s: 1.3, h: 0.9, color: "t3", label: "Diffusion", icon: "✺" }),
      rec: at("block", 1.6, HUB, { s: 1.3, h: 0.9, color: "t4", label: "RecSys", icon: "≡" }),
      ts:  at("block", 4.8, HUB, { s: 1.3, h: 0.9, color: "t5", label: "Time series", icon: "∿" }),
      rl:  at("block", 8, HUB, { s: 1.3, h: 0.9, color: "good", label: "RL", icon: "↻" }),
      /* vision lane */
      vImg:   at("block", -7, LANE, { s: 1.7, h: 0.25, color: "t1", label: "Image", sub: "224²", icon: "▦" }),
      vPatch: at("stack", -2.4, LANE, { w: 1.5, d: 1.5, n: 4, color: "t1", label: "Patches", sub: "16×16" }),
      vVit:   at("block", 2.2, LANE, { s: 1.8, h: 1.5, color: "accent", label: "ViT encoder", icon: "✦" }),
      vBox:   at("block", 6.8, LANE, { s: 1.5, h: 0.6, color: "t1", label: "Boxes", icon: "▢" }),
      /* speech lane */
      sUser: at("block", -8, LANE, { s: 1.3, h: 0.9, color: "t5", label: "Caller", icon: "◉" }),
      sVad:  at("block", -4, LANE, { s: 1.4, h: 0.8, color: "t2", label: "VAD" }),
      sAsr:  at("block", 0, LANE, { s: 1.5, h: 1.1, color: "t3", label: "ASR" }),
      sLlm:  at("block", 4, LANE, { s: 1.7, h: 1.4, color: "accent", label: "LLM", icon: "✦" }),
      sTts:  at("block", 8, LANE, { s: 1.5, h: 1.1, color: "t5", label: "TTS" }),
      /* diffusion lane */
      dNoise: at("block", -8, LANE, { s: 1.6, h: 0.3, color: "ink-3", label: "Noise", sub: "t = 50", icon: "░" }),
      dS1:    at("block", -4, LANE, { s: 1.6, h: 0.3, color: "t3", label: "Step 1", icon: "▒" }),
      dS25:   at("block", 0, LANE, { s: 1.6, h: 0.3, color: "t3", label: "Step 25", icon: "▓" }),
      dS50:   at("block", 4, LANE, { s: 1.6, h: 0.3, color: "t3", label: "Step 50", icon: "█" }),
      dImg:   at("block", 8, LANE, { s: 1.6, h: 0.3, color: "good", label: "Image", sub: "512²", icon: "▣" }),
      /* recsys lane */
      rCat:  at("cyl", -8, LANE, { r: 0.85, h: 1.3, color: "t4", label: "Catalog" }),
      rTwo:  at("block", -4, LANE, { s: 1.6, h: 1.1, color: "t4", label: "Two-tower" }),
      rRank: at("block", 0, LANE, { s: 1.7, h: 1.4, color: "accent", label: "Ranker" }),
      rRe:   at("block", 4, LANE, { s: 1.4, h: 0.8, color: "t4", label: "Re-rank" }),
      rFeed: at("stack", 8, LANE, { w: 1.5, d: 1.2, n: 4, color: "good", label: "Feed" }),
      /* time-series lane */
      tHist: at("stack", -7, LANE, { w: 1.7, d: 1.3, n: 5, color: "t5", label: "History" }),
      tMod:  at("block", -2.4, LANE, { s: 1.7, h: 1.3, color: "accent", label: "GBM model" }),
      tFc:   at("block", 2.2, LANE, { s: 1.5, h: 0.8, color: "t5", label: "Forecast", sub: "P10–P90" }),
      tBack: at("block", 6.8, LANE, { s: 1.5, h: 0.8, color: "signal", label: "Backtest", icon: "✓" }),
      /* RL lane */
      lAgent: at("block", -4.6, LANE, { s: 1.8, h: 1.4, color: "good", label: "Agent", sub: "policy π", icon: "◉" }),
      lEnv:   at("block", 4.6, LANE, { s: 2.2, h: 1.1, color: "t4", label: "Environment", icon: "▦" }),
      lRew:   at("block", 0, LANE + 4.2, { s: 1.3, h: 0.6, color: "signal", label: "Reward", icon: "★" }),
      /* where it all lands */
      prod: at("block", 0, LANE, { s: 2.3, h: 1.6, color: "accent", label: "Your product", icon: "◆" })
    },
    steps: [
      { title: "One toolkit", tag: "Idea", add: ["emb", "tfm", "train"], badges: { tfm: "shared core" },
        text: "<p>Everything you've built so far is a general toolkit: <b>embeddings</b> that turn things into vectors, <b>transformers</b> that mix those vectors with attention, and a <b>training loop</b> of loss, backprop and evaluation.</p><p>None of it is specific to text. Every specialization in this area runs on the same three parts.</p>",
        key: "LLMs are the common core. A specialization adds a new data shape and the tricks for it, not a new kind of maths.",
        metrics: { worlds: "0 / 6", shape: "tensors", key: "—", budget: "—" } },

      { title: "Six worlds, six data shapes", tag: "Problem", add: ["vis", "sp", "dif", "rec", "ts", "rl"],
        links: [["tfm", "vis", null, { dashed: true, lift: -10 }], ["tfm", "sp", null, { dashed: true, lift: -10 }], ["tfm", "dif", null, { dashed: true, lift: -10 }], ["tfm", "rec", null, { dashed: true, lift: -10 }], ["tfm", "ts", null, { dashed: true, lift: -10 }], ["tfm", "rl", null, { dashed: true, lift: -10 }]],
        flows: [["tfm", "vis", "req", { count: 1, lift: -10 }], ["tfm", "sp", "req", { count: 1, lift: -10 }], ["tfm", "dif", "req", { count: 1, lift: -10 }], ["tfm", "rec", "req", { count: 1, lift: -10 }], ["tfm", "ts", "req", { count: 1, lift: -10 }], ["tfm", "rl", "req", { count: 1, lift: -10 }]],
        text: "<p>Real products need more than text. Pixels, waveforms, generated media, user histories, timestamps and reward signals each arrive in a different shape, and each community invented its own architectures and metrics for them.</p><p>You can't master all six. Walk through each one once to see its pipeline, then pick one or two to go deep.</p>",
        metrics: { shape: "6 shapes" } },

      { title: "Vision: image → patches → ViT → boxes", tag: "Idea", add: ["vImg", "vPatch", "vVit", "vBox"], focus: ["vis", "vImg", "vPatch", "vVit", "vBox", "tfm"],
        links: [["vis", "vImg", null, { dashed: true, lift: 0 }], ["vImg", "vPatch"], ["vPatch", "vVit"], ["vVit", "vBox"]],
        badges: { vis: "IoU 0.72" },
        flows: [["vImg", "vPatch", "data", { label: "196 patches", lift: 96 }], ["vPatch", "vVit", "token", { count: 3 }], ["vVit", "vBox", "res", { label: "box, class, score", lift: 96 }]],
        text: "<p>A photo is a 3×224×224 tensor, about 150,000 numbers. A <b>ViT</b> cuts it into 196 patches of 16×16 pixels, projects each to a vector and runs the transformer encoder you already know. A detection head outputs boxes with a class and a score.</p><p>A box counts as correct only if its <b>IoU</b> (overlap ÷ union) with the true box clears a threshold, usually 0.5.</p>",
        note: "For high-volume, fixed-class detection a small detector is often 100× cheaper than sending images to a vision-language model.",
        draw: iouPanel,
        metrics: { worlds: "1 / 6", shape: "3×224×224", key: "IoU 0.72", budget: "196 patches" } },

      { title: "Speech: a voice agent on a clock", tag: "Idea", remove: ["vImg", "vPatch", "vVit", "vBox"], add: ["sUser", "sVad", "sAsr", "sLlm", "sTts"],
        focus: ["sp", "sUser", "sVad", "sAsr", "sLlm", "sTts"],
        links: [["sp", "sVad", null, { dashed: true, lift: 0 }], ["sUser", "sVad"], ["sVad", "sAsr"], ["sAsr", "sLlm"], ["sLlm", "sTts"]],
        badges: { sp: "≈ 800 ms" },
        flows: [["sUser", "sVad", "token", { label: "16 kHz audio", lift: 96 }], ["sVad", "sAsr", "token"], ["sAsr", "sLlm", "req", { label: "transcript", lift: 96 }], ["sLlm", "sTts", "token"], ["sTts", "sUser", "res", { lift: -90, label: "first sound", delay: 0.6 }]],
        text: "<p>A caller talks. <b>VAD</b> decides they've finished, streaming <b>ASR</b> turns audio into text, the <b>LLM</b> replies, and <b>TTS</b> speaks from the first sentence.</p><p>The models are good enough. The hard part is time: the caller feels the sum of every stage's time to first output. Here that's 250 + 80 + 300 + 120 ms plus 50 ms of network, about 800 ms.</p>",
        key: "Stream every stage and start speaking on the LLM's first sentence. Under ~800 ms feels responsive; past 1.5 s feels broken.",
        draw: latencyPanel,
        changed: ["- Vision lane", "+ VAD → ASR → LLM → TTS", "~ Budget is now time to first audio"],
        metrics: { worlds: "2 / 6", shape: "16 kHz audio", key: "WER 6%", budget: "≈ 800 ms" } },

      { title: "Diffusion: noise in, image out", tag: "Idea", remove: ["sUser", "sVad", "sAsr", "sLlm", "sTts"], add: ["dNoise", "dS1", "dS25", "dS50", "dImg"],
        focus: ["dif", "dNoise", "dS1", "dS25", "dS50", "dImg"],
        links: [["dif", "dS1", null, { dashed: true, lift: 0 }], ["dNoise", "dS1"], ["dS1", "dS25", null, { dashed: true }], ["dS25", "dS50", null, { dashed: true }], ["dS50", "dImg"]],
        badges: { dif: "50 steps", dS25: "2 calls / step" },
        flows: [["dNoise", "dS1", "data", { label: "64×64×4 latent", lift: 96 }], ["dS1", "dS25", "data"], ["dS25", "dS50", "data"], ["dS50", "dImg", "res", { label: "VAE decode", lift: 96 }]],
        text: "<p>Start from pure static in a 64×64×4 latent. At each step a network (U-Net or DiT) predicts the noise and removes a little, steered by your prompt through cross-attention.</p><p>The original DDPM needed 1,000 steps; a modern sampler uses 20 to 50. Classifier-free guidance doubles the calls per step, so 50 steps means 100 network calls. A VAE decodes the final latent into a 512×512 image.</p>",
        note: "Fix the seed when you compare prompts or models, or you're judging the noise.",
        changed: ["- Speech lane", "+ Noise → 50 denoise steps → image", "~ Budget is now steps × network calls"],
        metrics: { worlds: "3 / 6", shape: "64×64×4 latent", key: "CFG w = 4", budget: "50 steps" } },

      { title: "RecSys: 10 million items, ten slots", tag: "Idea", remove: ["dNoise", "dS1", "dS25", "dS50", "dImg"], add: ["rCat", "rTwo", "rRank", "rRe", "rFeed"],
        focus: ["rec", "rCat", "rTwo", "rRank", "rRe", "rFeed", "emb"],
        links: [["rec", "rRank", null, { dashed: true, lift: 0 }], ["rCat", "rTwo"], ["rTwo", "rRank"], ["rRank", "rRe"], ["rRe", "rFeed"]],
        badges: { rec: "10M → 10", rCat: "10M items", rTwo: "~1,000 · 5 ms", rRank: "~100 · 30 ms", rRe: "2 ms", rFeed: "10 shown" },
        flows: [["rCat", "rTwo", "data"], ["rTwo", "rRank", "data"], ["rRank", "rRe", "data"], ["rRe", "rFeed", "res"]],
        text: "<p>One user, ten slots, about 100 ms. Scoring every item with a heavy model is impossible, so recommenders are a <b>funnel</b>.</p><p>A <b>two-tower</b> model embeds the user and searches precomputed item vectors in an ANN index: about 1,000 candidates in 5 ms. A <b>ranker</b> with hundreds of features scores them in 30 ms, and a re-ranker adds diversity and business rules.</p>",
        key: "Two-tower retrieval is the same embedding search you use in RAG. Ranking is reranking.",
        changed: ["- Diffusion lane", "+ Retrieve → rank → re-rank → feed", "~ Budget ≈ 5 + 30 + 2 ms"],
        metrics: { worlds: "4 / 6", shape: "users × items", key: "10M → 10", budget: "≈ 37 ms" } },

      { title: "Time series: history → forecast → backtest", tag: "Idea", remove: ["rCat", "rTwo", "rRank", "rRe", "rFeed"], add: ["tHist", "tMod", "tFc", "tBack"],
        focus: ["ts", "tHist", "tMod", "tFc", "tBack", "train"],
        links: [["ts", "tFc", null, { dashed: true, lift: 0 }], ["tHist", "tMod"], ["tMod", "tFc"], ["tFc", "tBack"]],
        badges: { ts: "MASE 0.82", tBack: "4 folds" },
        flows: [["tHist", "tMod", "data", { label: "lags ≥ 7 days", lift: 96 }], ["tMod", "tFc", "res"], ["tFc", "tBack", "data"]],
        text: "<p>Hourly API traffic for the last 90 days. A gradient-boosted model on lag and calendar features forecasts the next 7 days as P10, P50 and P90, and you provision GPUs for the P90.</p><p>Before you trust it, <b>backtest</b>: train up to a cutoff, forecast, slide the cutoff, repeat. A MASE of 0.82 means the error is 18% lower than seasonal naive's.</p>",
        note: "Never shuffle time series. Random splits leak the future into training, and a lag-1 feature is useless for a 7-day forecast.",
        draw: forecastPanel,
        changed: ["- RecSys lane", "+ History → model → forecast → backtest"],
        metrics: { worlds: "5 / 6", shape: "hourly series", key: "MASE 0.82", budget: "7-day horizon" } },

      { title: "RL: learn from reward", tag: "Idea", remove: ["tHist", "tMod", "tFc", "tBack"], add: ["lAgent", "lEnv", "lRew"],
        focus: ["rl", "lAgent", "lEnv", "lRew", "train"],
        links: [["rl", "lEnv", null, { dashed: true, lift: 0 }]],
        badges: { rl: "γ = 0.9", lAgent: "π(a | s)", lEnv: "next state" },
        flows: [["lAgent", "lEnv", "req", { label: "action a_t", lift: 60 }], ["lEnv", "lRew", "data", { lift: 20, delay: 0.5 }], ["lRew", "lAgent", "grad", { label: "r = +1 → update π", lift: 20, delay: 0.9 }]],
        text: "<p>No labels this time. The <b>agent</b> acts, the <b>environment</b> returns a new state and a <b>reward</b>, and the policy shifts toward actions that earned more. With γ = 0.9, a reward four steps away is worth 0.66 of an immediate one.</p><p>Make the agent an LLM and the reward a preference model or unit tests, and you have RLHF and GRPO: how chat and reasoning models get tuned.</p>",
        note: "Watch for reward hacking: a policy that scores high without doing the task, like padding answers because the reward model likes length.",
        changed: ["- Time-series lane", "+ Agent ↔ environment loop", "+ Reward drives the update"],
        metrics: { worlds: "6 / 6", shape: "state, action, reward", key: "γ = 0.9", budget: "10k episodes" } },

      { title: "Every branch feeds back into LLM work", tag: "Solution", remove: ["lAgent", "lEnv", "lRew"], add: ["prod"],
        focus: ["vis", "sp", "dif", "rec", "ts", "rl", "prod"],
        links: [["vis", "prod", "res", { lift: -60 }], ["sp", "prod", "res", { lift: -60 }], ["dif", "prod", "res", { lift: -60 }], ["rec", "prod", "res", { lift: -60 }], ["ts", "prod", "res", { lift: -60 }], ["rl", "prod", "res", { lift: -60 }]],
        flows: [["vis", "prod", "res", { label: "eyes", lift: -60, count: 1 }], ["sp", "prod", "res", { lift: -60, count: 1 }], ["dif", "prod", "res", { lift: -60, count: 1 }], ["rec", "prod", "res", { label: "retrieval → RAG", lift: -60, count: 1 }], ["ts", "prod", "res", { lift: -60, count: 1 }], ["rl", "prod", "res", { label: "RLHF", lift: -60, count: 1 }]],
        text: "<p>The six fields don't sit off to the side. Vision encoders give LLMs <b>eyes</b>, speech gives them <b>ears and a voice</b>, diffusion turns text into <b>media</b>, recommender retrieval is the ancestor of <b>RAG</b>, forecasting plans your <b>GPU and token spend</b>, and RL is how models get <b>tuned</b>.</p><p>So the products you can ship grow with each branch you learn.</p>",
        changed: ["- RL lane", "+ All six branches feed one product"],
        metrics: { shape: "all six", key: "6 → 1 product", budget: "—" } },

      { title: "Choose your path", tag: "Solution", focus: ["vis", "rec", "prod", "emb", "tfm", "train"],
        badges: { vis: "go deep", rec: "go deep" },
        flows: [["tfm", "vis", "req", { lift: -10, count: 1 }], ["tfm", "rec", "req", { lift: -10, count: 1 }], ["vis", "prod", "res", { lift: -60 }], ["rec", "prod", "res", { lift: -60 }]],
        text: "<p>Pick one or two fields by the product you want to build, not by what's trending. Building a shopping assistant? Go deep on <b>vision</b> for product photos and <b>recsys</b> for the feed, and read the other primers once for orientation.</p><p>Each primer ends with a five-step roadmap from a toy dataset to a project with a real eval set.</p>",
        key: "Depth in one domain plus the shared core beats a shallow pass over all six.",
        draw: pathPanel,
        metrics: { key: "pick 1–2", budget: "5-step roadmap" } },

      { title: "One toolkit, six worlds", tag: "Recap",
        badges: { vis: "IoU 0.72", rec: "10M → 10" },
        flows: [["tfm", "vis", "req", { lift: -10, count: 1 }], ["tfm", "sp", "req", { lift: -10, count: 1 }], ["tfm", "dif", "req", { lift: -10, count: 1 }], ["tfm", "rec", "req", { lift: -10, count: 1 }], ["tfm", "ts", "req", { lift: -10, count: 1 }], ["tfm", "rl", "req", { lift: -10, count: 1 }], ["rec", "prod", "res", { lift: -60, count: 1, delay: 1 }], ["sp", "prod", "res", { lift: -60, count: 1, delay: 1 }]],
        text: "<p>The same core, six data shapes, six pipelines:</p><ul><li><b>Vision</b>: patches → ViT → boxes, scored by IoU</li><li><b>Speech</b>: VAD → ASR → LLM → TTS in ~800 ms</li><li><b>Diffusion</b>: 50 denoise steps from noise to image</li><li><b>RecSys</b>: retrieve → rank → feed in ~37 ms</li><li><b>Time series</b>: forecast, then backtest</li><li><b>RL</b>: act, get reward, update</li></ul>",
        metrics: { shape: "6 shapes", key: "pick 1–2" } }
    ],
    learn: [
      "Why every specialization runs on the same core",
      "How a ViT turns an image into tokens and boxes",
      "Where a voice agent's 800 ms goes",
      "How retrieval-then-ranking serves a feed in milliseconds",
      "Why time series needs backtests, and RL needs rewards",
      "How to pick one or two fields to go deep on"
    ]
  };
})();
