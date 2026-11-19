/* Flagship scene: from numbers to a learning machine (plays on the Foundations overview).
   One worked example, a linear price model with no bias term, prices in units of $100k:
     x = [size 1.5 (×100 m²), bedrooms 3, age 2 (decades)], actual price y = 4.2 ($420k)
     w0 = [1.0, 0.5, −0.5]  →  ŷ = 1.5 + 1.5 − 1.0 = 2.0 ($200k)
     L = (ŷ − y)² = (−2.2)² = 4.84;  ∇w L = 2(ŷ − y)·x = [−6.6, −13.2, −8.8]
     η = 0.02  →  w1 = [1.132, 0.764, −0.324], ŷ = 3.342, L = 0.736
   Then a full run over 500 sales (illustrative): mean loss 0.12, final w = [2.2, 0.4, −0.2], ŷ = 4.1.
   RMSE = √0.12 ≈ 0.346 → $34.6k; 95% band ≈ ±1.96 × 34.6 ≈ ±$68k. */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  var MONO = "font-family:var(--font-mono)";

  /* Place a node by its centre in screen-aligned coordinates: s runs left → right, t runs top → bottom. */
  function at(s, t, n) {
    var cyl = n.type === "cyl", w = cyl ? 0 : (n.w || 1.6), d = cyl ? 0 : (n.d || 1.6);
    n.x = s + t - w / 2; n.y = t - s - d / 2;
    return n;
  }

  function txt(c, g, x, y, s, style, anchor) {
    var t = c.el("text", { x: x, y: y, "font-size": 10.5, "text-anchor": anchor || "start", style: style || "fill:var(--ink-2)" }, g);
    t.textContent = s;
    return t;
  }

  /* Dot product written out under the weights: each feature times its weight, then summed. */
  function dotTable(svg, c) {
    var a = c.anchor("w"), x0 = a[0] - 70, y0 = a[1] + 74;
    var g = c.el("g", { class: "dot-table" }, svg);
    var xs = ["1.5", "3", "2"], ws = ["1.0", "0.5", "−0.5"], ps = ["1.5", "1.5", "−1.0"];
    txt(c, g, x0 - 8, y0 + 12, "x", "fill:var(--t2);font-weight:700;" + MONO, "end");
    txt(c, g, x0 - 8, y0 + 32, "w", "fill:var(--t1);font-weight:700;" + MONO, "end");
    txt(c, g, x0 - 8, y0 + 52, "x·w", "fill:var(--ink);font-weight:700;" + MONO, "end");
    for (var i = 0; i < 3; i++) {
      var cx = x0 + i * 46;
      [xs[i], ws[i], ps[i]].forEach(function (v, r) {
        c.el("rect", { x: cx, y: y0 + r * 20, width: 42, height: 17, rx: 3, style: "fill:" + c.mix(r === 0 ? "var(--t2)" : r === 1 ? "var(--t1)" : "var(--accent)", r === 2 ? 26 : 14) + ";stroke:var(--ink-3);stroke-width:.8" }, g);
        txt(c, g, cx + 21, y0 + r * 20 + 12.5, v, "fill:var(--ink);" + MONO, "middle");
      });
    }
    txt(c, g, x0 + 144, y0 + 52, "sum = 2.0", "fill:var(--accent);font-weight:700;" + MONO);
  }

  /* Loss curve over training steps (illustrative run). */
  function lossCurve(svg, c) {
    var a = c.anchor("grad"), x0 = a[0] + 70, y0 = a[1] - 70, W = 150, H = 70;
    var g = c.el("g", { class: "loss-curve" }, svg);
    c.el("rect", { x: x0 - 30, y: y0 - 20, width: W + 44, height: H + 44, rx: 8, style: "fill:var(--surface);stroke:var(--ink-3);stroke-width:.8;opacity:.92" }, g);
    txt(c, g, x0, y0 - 6, "mean loss vs step", "fill:var(--ink-2);font-weight:600");
    c.el("path", { d: "M" + x0 + "," + y0 + " V" + (y0 + H) + " H" + (x0 + W), style: "fill:none;stroke:var(--ink-3);stroke-width:1" }, g);
    var d = "", L0 = 4.6, Lf = 0.12;
    for (var i = 0; i <= 30; i++) {
      var s = i / 30, L = Lf + (L0 - Lf) * Math.exp(-s * 7);
      d += (i ? " L" : "M") + (x0 + s * W).toFixed(1) + "," + (y0 + H - (L / L0) * (H - 4)).toFixed(1);
    }
    c.el("path", { d: d, style: "fill:none;stroke:var(--signal);stroke-width:2" }, g);
    txt(c, g, x0 - 3, y0 + 8, "4.6", "fill:var(--ink-3);" + MONO, "end");
    txt(c, g, x0 + W, y0 + H - 6, "0.12", "fill:var(--good);font-weight:700;" + MONO, "end");
    txt(c, g, x0, y0 + H + 14, "0", "fill:var(--ink-3);" + MONO);
    txt(c, g, x0 + W, y0 + H + 14, "300 steps", "fill:var(--ink-3);" + MONO, "end");
  }

  /* Prediction with a 95% band: a bell curve over a $ axis. */
  function band(svg, c) {
    var a = c.anchor("pred"), x0 = a[0] - 95, y0 = a[1] + 86, W = 190, H = 46;
    var g = c.el("g", { class: "pred-band" }, svg);
    var lo = 300, hi = 520, X = function (v) { return x0 + (v - lo) / (hi - lo) * W; };
    var mu = 410, sd = 34.6;
    var pts = [], fill = [];
    for (var v = lo; v <= hi; v += 4) {
      var yy = y0 + H - Math.exp(-0.5 * Math.pow((v - mu) / sd, 2)) * H;
      pts.push(X(v).toFixed(1) + "," + yy.toFixed(1));
      if (v >= mu - 68 && v <= mu + 68) fill.push(X(v).toFixed(1) + "," + yy.toFixed(1));
    }
    c.el("polygon", { points: X(mu - 68).toFixed(1) + "," + (y0 + H) + " " + fill.join(" ") + " " + X(mu + 68).toFixed(1) + "," + (y0 + H), style: "fill:" + c.mix("var(--good)", 40) }, g);
    c.el("polyline", { points: pts.join(" "), style: "fill:none;stroke:var(--good);stroke-width:1.8" }, g);
    c.el("path", { d: "M" + x0 + "," + (y0 + H) + " H" + (x0 + W), style: "stroke:var(--ink-3);stroke-width:1" }, g);
    [342, 410, 478].forEach(function (v) {
      c.el("path", { d: "M" + X(v) + "," + (y0 + H) + " v4", style: "stroke:var(--ink-3)" }, g);
      txt(c, g, X(v), y0 + H + 15, "$" + v + "k", "fill:var(--ink-2);" + MONO, "middle");
    });
    c.el("path", { d: "M" + X(420) + "," + (y0 - 4) + " V" + (y0 + H), style: "stroke:var(--t5);stroke-width:2;stroke-dasharray:3 2" }, g);
    txt(c, g, X(420) + 4, y0 - 6, "sold $420k", "fill:var(--t5);font-weight:600");
    txt(c, g, x0, y0 + H + 31, "95% band ≈ ŷ ± 1.96 × $34.6k", "fill:var(--ink-3)");
  }

  window.ATLAS_SCENES["foundations/overview"] = {
    unit: 34,
    metrics: [
      { id: "pred", label: "Prediction", tone: "accent" },
      { id: "loss", label: "Loss", tone: "signal" },
      { id: "step", label: "Training step" },
      { id: "band", label: "95% band", tone: "good" }
    ],
    legend: { data: "features / values", req: "forward pass", miss: "error", grad: "gradient / update", res: "result" },
    nodes: {
      house:  at(0, 0,      { type: "block", w: 1.4, d: 1.4, h: 1.0, color: "t5", label: "House sale", icon: "⌂" }),
      sales:  at(0, -3.6,   { type: "stack", w: 1.4, d: 1.0, n: 4, color: "t5", label: "500 sales" }),
      vec:    at(2.6, 0,    { type: "stack", w: 1.4, d: 1.0, n: 3, color: "t2", label: "Features x" }),
      w:      at(5.2, 0,    { type: "block", w: 1.6, d: 1.6, h: 1.3, color: "t1", label: "Weights w", icon: "w" }),
      pred:   at(7.8, 0,    { type: "block", w: 1.4, d: 1.4, h: 0.8, color: "accent", label: "Prediction", icon: "ŷ" }),
      loss:   at(10.4, 0,   { type: "block", w: 1.4, d: 1.4, h: 0.9, color: "signal", label: "Loss", icon: "ℒ" }),
      grad:   at(7.8, -3.6, { type: "block", w: 1.4, d: 1.4, h: 0.9, color: "t4", label: "Gradient", icon: "∇" }),
      py:     at(0, 4.2,    { type: "block", w: 1.4, d: 1.4, h: 1.0, color: "t2", label: "Python code", icon: "ƒ" }),
      tests:  at(2.6, 4.2,  { type: "block", w: 1.4, d: 1.4, h: 0.8, color: "good", label: "Tests", sub: "pytest", icon: "✓" }),
      git:    at(5.2, 4.2,  { type: "cyl", r: 0.75, h: 1.1, color: "t3", label: "Git + CI" }),
      docker: at(7.8, 4.2,  { type: "stack", w: 1.6, d: 1.2, n: 3, color: "t1", label: "Docker image" }),
      cloud:  at(10.6, 4.2, { type: "slab", w: 3.4, d: 3.4, color: "good", label: "cloud VM" }),
      api:    at(11.2, 4.0, { type: "block", z: 0.15, w: 1.4, d: 1.4, h: 1.0, color: "t3", label: "Price API", icon: "▣" }),
      user:   at(13.2, 4.2, { type: "block", w: 1.0, d: 1.0, h: 0.7, color: "t5", label: "Buyer app", icon: "◉" })
    },
    steps: [
      { title: "Guess a house's price", tag: "Problem", add: ["house"], badges: { house: "sold for $420k" },
        text: "<p>A house just sold for <b>$420k</b>: 150 m², 3 bedrooms, 20 years old. You want a program that looks at the next house and guesses its price.</p><p>A computer can't read \"a roomy 3-bed\". Before it can learn anything, every house has to become a list of numbers.</p>",
        key: "Machine learning is arithmetic on numbers. The first job is always turning the thing you care about into numbers.",
        metrics: { pred: "—", loss: "—", step: "0", band: "—" } },

      { title: "Features become a vector", tag: "Idea", add: ["vec"], links: [["house", "vec", "data"]], badges: { vec: "[1.5, 3, 2]" },
        text: "<p>Pick the facts that should matter, the <b>features</b>, and put them in a fixed order: size in hundreds of m², bedrooms, age in decades.</p><p>This house becomes the vector <code>x = [1.5, 3, 2]</code>. Every house gets the same three slots, so they can all be compared and multiplied the same way.</p>",
        flows: [["house", "vec", "data", { label: "encode", count: 2, lift: 175 }]],
        note: "Scaling (m² ÷ 100, years ÷ 10) keeps the features in similar ranges, which makes training much better behaved.",
        changed: ["+ Feature vector x = [1.5, 3, 2]"] },

      { title: "The model is a weight vector", tag: "Idea", add: ["w"], focus: ["vec", "w"], badges: { w: "[1.0, 0.5, −0.5]" },
        text: "<p>The model is just more numbers: one <b>weight</b> per feature, saying how much that feature moves the price. You start from a rough guess, <code>w = [1.0, 0.5, −0.5]</code>.</p><p>With many outputs, the weights form a <b>matrix</b> W. A neural network is a long chain of these matrices with simple functions in between.</p>",
        note: "Real models also add a bias term b. It's left out here to keep the arithmetic short.",
        changed: ["+ Weights w (3 numbers, still untrained)"] },

      { title: "A prediction is a dot product", tag: "Idea", add: ["pred"], links: [["vec", "w", "req"], ["w", "pred", "req"]], focus: ["vec", "w", "pred"], badges: { pred: "$200k" },
        text: "<p>To predict, multiply each feature by its weight and add them up. That's the <b>dot product</b> <code>x · w</code>:</p><p><code>1.5×1.0 + 3×0.5 + 2×(−0.5) = 2.0</code>, so the model says <b>$200k</b>.</p><p>On a batch of 500 houses it's one matrix multiply: <code>X (500×3) @ w (3) → 500 prices</code>.</p>",
        flows: [["vec", "w", "req", { count: 2 }], ["w", "pred", "req", { label: "x · w = 2.0", delay: 0.6, lift: 165 }]],
        metrics: { pred: "$200k" },
        changed: ["+ Prediction ŷ = 2.0 ($200k)"],
        draw: dotTable },

      { title: "The loss measures the error", tag: "Problem", add: ["loss"], links: [["pred", "loss", "req"]], focus: ["house", "pred", "loss"], badges: { loss: "(−2.2)² = 4.84" },
        text: "<p>The house sold for 4.2 (in $100k), the model said 2.0. The <b>loss</b> turns that gap into one number to minimize. Here it's the squared error:</p><p><code>L = (ŷ − y)² = (2.0 − 4.2)² = 4.84</code></p><p>Squaring makes every miss positive and punishes big misses far more than small ones.</p>",
        flows: [["pred", "loss", "req", { label: "ŷ = 2.0", lift: 160 }], ["house", "loss", "miss", { label: "y = 4.2", lift: 170, delay: 0.3 }]],
        metrics: { loss: "4.84" },
        key: "Training never sees \"good\" or \"bad\". It only sees the loss, so the loss you pick defines what the model gets good at.",
        changed: ["+ Squared-error loss = 4.84", "~ Off by $220k"] },

      { title: "The gradient says which way to move", tag: "Idea", add: ["grad"], links: [["loss", "grad", "grad"]], focus: ["loss", "grad", "w"], badges: { grad: "[−6.6, −13.2, −8.8]" },
        text: "<p>Calculus answers: if I nudge each weight, does the loss go up or down, and how fast? The <b>gradient</b> collects those slopes into a vector the same shape as w:</p><p><code>∇L = 2(ŷ − y)·x = −4.4 × [1.5, 3, 2] = [−6.6, −13.2, −8.8]</code></p><p>All negative: raising every weight lowers the loss.</p>",
        flows: [["loss", "grad", "grad", { label: "∂L/∂w" }]],
        key: "The gradient points uphill. Gradient descent steps the other way.",
        note: "Backpropagation is the chain rule doing this for every weight in one backward pass, even for billions of them." },

      { title: "Take one step downhill", tag: "Solution", links: [["grad", "w", "grad"]], focus: ["grad", "w", "pred", "loss"], badges: { w: "[1.13, 0.76, −0.32]", pred: "$334k", loss: "0.74" },
        text: "<p>Move the weights a small step <b>against</b> the gradient, scaled by the learning rate η = 0.02:</p><p><code>w ← w − 0.02 × ∇L = [1.13, 0.76, −0.32]</code></p><p>Predict again: <code>ŷ = 3.34</code>, or $334k. The loss falls from 4.84 to <b>0.74</b> after a single step.</p>",
        flows: [["grad", "w", "grad", { label: "w −= η·∇L" }], ["w", "pred", "req", { delay: 0.9 }], ["pred", "loss", "req", { delay: 1.3 }]],
        metrics: { step: "1", pred: "$334k", loss: "0.74" },
        note: "Step size matters. With η = 0.07 this same step overshoots past $420k and the loss grows instead.",
        changed: ["~ Prediction $200k → $334k", "~ Loss 4.84 → 0.74"] },

      { title: "Loop over all the data", tag: "Solution", add: ["sales"], links: [["sales", "vec", "data", { dashed: true }]], badges: { w: "[2.2, 0.4, −0.2]", pred: "$410k", loss: "0.12 avg", vec: "500 × 3" },
        text: "<p>One house would just be memorized. So you loop over all <b>500 sales</b>: predict, measure the mean loss, take the gradient, step. Repeat.</p><p>After 300 steps the weights settle near <code>[2.2, 0.4, −0.2]</code>: about $220k per 100 m², $40k per bedroom and −$20k per decade of age. This house now gets <b>$410k</b>.</p>",
        flows: [["sales", "vec", "data", { count: 3, dur: 1.2 }], ["w", "pred", "req", { count: 2, dur: 1.0 }], ["pred", "loss", "req", { count: 2, dur: 1.0 }], ["loss", "grad", "grad", { count: 2, dur: 1.0 }], ["grad", "w", "grad", { count: 2, dur: 1.0 }]],
        metrics: { step: "300", pred: "$410k", loss: "0.12" },
        changed: ["+ 500 sales (example dataset)", "~ Mean loss over all sales → 0.12", "~ Weights learned, not hand-picked"],
        draw: lossCurve },

      { title: "Add an uncertainty band", tag: "Idea", focus: ["pred", "loss", "house"], badges: { pred: "$410k ± $68k" },
        text: "<p>$410k sounds exact, but it isn't. A mean squared error of 0.12 means a typical miss of √0.12 ≈ 0.35, about <b>$35k</b>.</p><p><b>Probability</b> turns that into an honest answer: if errors are roughly Gaussian, 95% of sales land within ±1.96 × $34.6k. So the model says <b>$410k ± $68k</b>, and the real $420k sits inside.</p>",
        flows: [["loss", "pred", "res", { lift: 10 }], ["sales", "pred", "data", { label: "500 residuals", lift: 150, delay: 0.4 }]],
        metrics: { band: "± $68k" },
        key: "A prediction without its uncertainty invites people to trust it more than they should.",
        changed: ["+ 95% band ± $68k"],
        draw: band },

      { title: "Turn the math into code", tag: "Solution", add: ["py", "tests", "git"], links: [["py", "tests", "req"], ["tests", "git", "res"]], focus: ["py", "tests", "git", "w"],
        text: "<p>Now the code track. Each idea becomes a small <b>Python function</b>: <code>predict(x, w)</code>, <code>loss(y_hat, y)</code>, <code>step(w, grad, lr)</code>.</p><p>A <b>test</b> pins down what you just checked by hand: <code>assert predict([1.5, 3, 2], [1.0, 0.5, -0.5]) == approx(2.0)</code>. You commit to a <b>git</b> branch, and CI runs the tests on every push.</p>",
        flows: [["w", "py", "data", { label: "the math", lift: -10 }], ["py", "tests", "req", { label: "pytest -q", delay: 0.4, lift: 110 }], ["tests", "git", "res", { label: "3 passed", delay: 0.9, lift: 110 }]],
        note: "Tests are what let you change the code next month without silently breaking a prediction.",
        changed: ["+ predict / loss / step functions", "+ Unit tests with known answers", "+ Branch, PR, CI"] },

      { title: "Ship it in a container", tag: "Solution", add: ["docker", "cloud", "api", "user"], links: [["git", "docker", "req"], ["docker", "api", "req", { dashed: true }], ["user", "api", "req"]], focus: ["git", "docker", "cloud", "api", "user", "w"],
        text: "<p>A <b>Dockerfile</b> packs Python, your dependencies, the code and the learned weights into one image. The same image runs on your laptop and on a <b>cloud VM</b>.</p><p>Behind an HTTP endpoint it becomes a product: a buyer app sends <code>POST /predict</code> with a house and gets back <code>$410k ± $68k</code>.</p>",
        flows: [["git", "docker", "req", { label: "docker build", lift: 110 }], ["w", "docker", "data", { label: "weights", lift: 40, delay: 0.3 }], ["docker", "api", "req", { label: "deploy", delay: 0.8, lift: 110 }], ["user", "api", "req", { label: "POST /predict", delay: 1.4, lift: 110 }], ["api", "user", "res", { delay: 2.0, lift: 10 }]],
        note: "Pass secrets like API keys in at runtime. Anything baked into the image can be read by anyone who has it.",
        changed: ["+ Docker image (base, deps, code + weights)", "+ Price API on a cloud VM", "+ First real request served"] },

      { title: "From numbers to a shipped model", tag: "Recap",
        text: "<p>Two tracks met in one small system:</p><ul><li><b>Linear algebra</b>: features and weights are vectors; a prediction is a dot product</li><li><b>Calculus</b>: the gradient of the loss says which way to move</li><li><b>Optimization</b>: repeat small steps until the loss stops falling</li><li><b>Probability</b>: report the uncertainty, not just a number</li><li><b>Code</b>: functions, tests, git, Docker, cloud</li></ul><p>The lessons in this area take each piece in turn.</p>",
        flows: [["sales", "vec", "data", { count: 1 }], ["vec", "w", "req", { count: 1 }], ["w", "pred", "req", { count: 1 }], ["pred", "loss", "req", { count: 1 }], ["loss", "grad", "grad", { count: 1 }], ["grad", "w", "grad", { count: 1 }], ["py", "tests", "req", { count: 1 }], ["git", "docker", "req", { count: 1 }], ["user", "api", "req", { count: 1 }], ["api", "user", "res", { count: 1, lift: 10 }]] }
    ],
    learn: [
      "How features become a vector and a prediction becomes a dot product",
      "What a loss measures and why squared error punishes big misses",
      "How the gradient tells every weight which way to move",
      "Why gradient descent loops, and what the learning rate controls",
      "How to put an uncertainty band on a prediction",
      "How code, tests, git and Docker get a model to real users"
    ]
  };
})();
