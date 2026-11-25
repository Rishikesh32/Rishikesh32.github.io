/* Flagship scene: "what actually drives order value?" (plays on the Regression overview).
   Numbers come from the same 500 example orders the page's demos use:
   discount alone: -$0.49 / pt, R² 0.020, CV RMSE $25.97;
   + tenure, items, device: +$0.37 / pt, R² 0.754, CV RMSE $13.35;
   + items²: R² 0.771, CV RMSE $12.86; + 3 noise columns: R² 0.771 (+0.0007), CV RMSE $12.95. */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  "use strict";

  function txt(ctx, g, x, y, s, o) {
    o = o || {};
    var t = ctx.el("text", { x: x, y: y, "font-size": o.size || 11, "text-anchor": o.anchor || "start", "font-weight": o.bold ? 700 : 500, style: "fill:" + (o.color || "var(--ink)") + ";font-family:var(--font-mono)" }, g);
    t.textContent = s; return t;
  }
  function card(ctx, svg, x, y, w, h, title) {
    var g = ctx.el("g", { "class": "reg-card" }, svg);
    ctx.el("rect", { x: x, y: y, width: w, height: h, rx: 10, style: "fill:var(--surface);stroke:var(--ink);stroke-width:1.4" }, g);
    if (title) txt(ctx, g, x + 12, y + 19, title, { size: 10, bold: true, color: "var(--ink-2)" });
    return g;
  }

  /* Scatter of order value against discount with the (misleading) downward line. */
  function rawScatter(svg, ctx) {
    var a = ctx.anchor("model"), W = 200, H = 128, x0 = a[0] + 70, y0 = a[1] - 190;
    var g = card(ctx, svg, x0, y0, W, H, "VALUE VS DISCOUNT ALONE");
    var px = x0 + 22, py = y0 + 30, pw = W - 40, ph = H - 58;
    ctx.el("line", { x1: px, x2: px + pw, y1: py + ph, y2: py + ph, style: "stroke:var(--ink-3);stroke-width:1" }, g);
    ctx.el("line", { x1: px, x2: px, y1: py, y2: py + ph, style: "stroke:var(--ink-3);stroke-width:1" }, g);
    var cols = [0, 5, 10, 15, 20], s = 7;
    cols.forEach(function (d, i) {
      for (var k = 0; k < 6; k++) {
        s = (s * 9301 + 49297) % 233280;
        var v = 0.25 + 0.6 * (s / 233280) + (d === 0 ? 0.12 : 0) - d * 0.006;
        ctx.el("circle", { cx: px + 12 + i * (pw - 24) / 4 + (k - 2.5) * 2.2, cy: py + ph - v * ph, r: 2.4, style: "fill:var(--ink-3);opacity:.7" }, g);
      }
    });
    ctx.el("line", { x1: px + 6, y1: py + ph * 0.38, x2: px + pw - 6, y2: py + ph * 0.58, style: "stroke:var(--signal);stroke-width:2.4" }, g);
    txt(ctx, g, px + pw, py + 10, "−$0.49 / pt", { size: 10, anchor: "end", bold: true, color: "var(--signal)" });
    txt(ctx, g, px, py + ph + 14, "0%", { size: 8.5, color: "var(--ink-3)" });
    txt(ctx, g, px + pw, py + ph + 14, "20% off", { size: 8.5, anchor: "end", color: "var(--ink-3)" });
  }

  /* Coefficients of the controlled model, with 95% intervals. */
  function coefCard(svg, ctx) {
    var a = ctx.anchor("model"), W = 236, H = 132, x0 = a[0] + 70, y0 = a[1] - 196;
    var g = card(ctx, svg, x0, y0, W, H, "WITH CONTROLS (95% CI)");
    var rows = [["items", "+$9.68 / item", "var(--t1)"], ["tenure", "+$1.29 / month", "var(--t1)"], ["mobile", "−$6.98 vs desktop", "var(--t1)"], ["discount", "+$0.37 / pt", "var(--good)"]];
    rows.forEach(function (r, i) {
      var y = y0 + 42 + i * 22;
      txt(ctx, g, x0 + 14, y, r[0], { size: 10, color: "var(--ink-2)" });
      txt(ctx, g, x0 + W - 12, y, r[1], { size: 10.5, anchor: "end", bold: i === 3, color: r[2] });
    });
    txt(ctx, g, x0 + 14, y0 + H - 10, "discount CI [0.20, 0.54]", { size: 9, color: "var(--ink-3)" });
  }

  /* Model scoreboard: R² vs cross-validated RMSE. */
  function scoreboard(svg, ctx) {
    var a = ctx.anchor("cv"), W = 236, H = 118, x0 = a[0] - W / 2, y0 = a[1] - 210;
    var g = card(ctx, svg, x0, y0, W, H, "R²  VS  5-FOLD CV RMSE");
    var rows = [["A  controls", "0.754", "$13.35", false], ["B  A + items²", "0.771", "$12.86", true], ["E  B + 3 noise", "0.771", "$12.95", false]];
    rows.forEach(function (r, i) {
      var y = y0 + 44 + i * 22;
      if (r[3]) ctx.el("rect", { x: x0 + 6, y: y - 14, width: W - 12, height: 20, rx: 5, style: "fill:" + ctx.mix("var(--good)", 22) }, g);
      txt(ctx, g, x0 + 14, y, r[0], { size: 10, color: "var(--ink-2)" });
      txt(ctx, g, x0 + 150, y, r[1], { size: 10, anchor: "end" });
      txt(ctx, g, x0 + W - 12, y, r[2], { size: 10, anchor: "end", bold: r[3], color: r[3] ? "var(--good)" : "var(--ink)" });
    });
    txt(ctx, g, x0 + 14, y0 + H - 8, "lower CV error wins: B", { size: 9, color: "var(--ink-3)" });
  }

  window.ATLAS_SCENES["regression/overview"] = {
    unit: 34,
    metrics: [
      { id: "n", label: "Orders" },
      { id: "r2", label: "R²", tone: "accent" },
      { id: "rmse", label: "CV RMSE", tone: "good" },
      { id: "disc", label: "Discount effect", tone: "signal" }
    ],
    legend: { data: "rows / columns", req: "fit", res: "result", miss: "noise column" },
    nodes: {
      wh:     { type: "cyl",   x: 0,    y: 0,   r: 0.95, h: 1.4, color: "t5", label: "orders table" },
      nb:     { type: "block", x: 3.4,  y: 0,   w: 1.8, d: 1.8, h: 1.0, color: "t2", label: "Notebook", icon: "≡" },
      model:  { type: "block", x: 7.2,  y: 0,   w: 2.0, d: 2.0, h: 1.5, color: "t3", label: "OLS model", icon: "β" },
      items:  { type: "block", x: 4.6,  y: 4.0, w: 1.1, d: 1.1, h: 0.7, color: "t1", label: "items" },
      disc:   { type: "block", x: 6.9,  y: 4.0, w: 1.1, d: 1.1, h: 0.7, color: "signal", label: "discount" },
      ten:    { type: "block", x: 9.2,  y: 4.0, w: 1.1, d: 1.1, h: 0.7, color: "t4", label: "tenure" },
      device: { type: "block", x: 11.5, y: 4.0, w: 1.1, d: 1.1, h: 0.7, color: "t1", label: "device" },
      noise:  { type: "stack", x: 2.2,  y: 4.0, w: 1.2, d: 1.0, n: 3, color: "signal", label: "+3 columns", sub: "day, zip, opens" },
      resid:  { type: "block", x: 10.8, y: 0,   w: 1.6, d: 1.6, h: 0.8, color: "accent", label: "Residuals", icon: "∿" },
      cv:     { type: "stack", x: 14.0, y: 0,   w: 1.6, d: 1.3, n: 5, color: "t2", label: "5-fold CV" },
      report: { type: "block", x: 14.0, y: -3.6, w: 1.6, d: 1.6, h: 1.0, color: "good", label: "Answer", icon: "✓" }
    },
    steps: [
      { title: "What actually drives order value?", tag: "Problem", add: ["wh"], badges: { wh: "500 orders" },
        text: "<p>The head of growth wants to know what makes some orders bigger than others. Marketing says discounts. Finance says discounts just give money away.</p><p>You have the store's <code>orders</code> table. This scene uses the same 500 example orders as the demos on this page, with an average order of about $54.</p>",
        key: "A good regression question names one outcome (order value) and the drivers you want to size.",
        metrics: { n: "500", r2: "—", rmse: "—", disc: "—" } },

      { title: "Pull one row per order", tag: "Idea", add: ["nb"], links: [["wh", "nb", "data"]],
        flows: [["wh", "nb", "data", { label: "SELECT value, items, discount_pct, …", count: 3 }]],
        badges: { nb: "500 rows × 5 cols" },
        text: "<p>Query one row per order with the outcome and the candidate drivers: <b>items</b> in the basket, <b>discount</b> percentage, customer <b>tenure</b> in months and <b>device</b>.</p><p>Plot each driver against order value before fitting anything. Plots catch skew, outliers and odd codes early.</p>",
        changed: ["+ 500 orders × order_value, items, discount_pct, tenure_months, device"] },

      { title: "Fit the obvious model", tag: "Idea", add: ["model", "disc"], focus: ["nb", "model", "disc"],
        links: [["nb", "model", "data"], ["disc", "model", "data"]], badges: { model: "value ~ discount" },
        flows: [["nb", "model", "req", { label: "smf.ols(...).fit()" }], ["disc", "model", "data"]],
        text: "<p>Start with what everyone is arguing about: <code>order_value ~ discount_pct</code>.</p><p>The slope is <b>−$0.49 per discount point</b>, with a 95% interval of −0.80 to −0.19. Taken at face value, discounts shrink baskets and finance wins. R² is only 0.02.</p>",
        metrics: { r2: "0.020", rmse: "$25.97", disc: "−$0.49 / pt" },
        draw: rawScatter },

      { title: "A confounder hides in tenure", tag: "Problem", add: ["ten"], focus: ["ten", "disc", "model"],
        links: [["ten", "disc", "miss", { dashed: true, label: "new → more codes" }]],
        flows: [["ten", "disc", "miss", { count: 2 }]],
        badges: { ten: "drives both" },
        text: "<p>Discount codes go mostly to <b>new customers</b>, and new customers spend less whatever the discount. Tenure pushes on both the predictor and the outcome.</p><p>With tenure left out, the discount coefficient soaks up the &quot;new customer&quot; effect. That is <b>omitted variable bias</b>.</p>",
        key: "If a variable drives both your predictor and your outcome, leaving it out biases the coefficient, sometimes enough to flip its sign.",
        changed: ["~ Suspect: discount slope is confounded by tenure"] },

      { title: "Add the controls", tag: "Solution", add: ["items", "device"], focus: ["items", "disc", "ten", "device", "model"],
        unlink: [["ten", "disc"]],
        links: [["items", "model", "data"], ["ten", "model", "data"], ["device", "model", "data"]],
        flows: [["items", "model", "data"], ["ten", "model", "data"], ["device", "model", "data"], ["disc", "model", "data"]],
        badges: { model: "+ tenure, items, device", ten: null },
        text: "<p>Fit <code>value ~ items + discount + tenure + C(device)</code>. Each coefficient now compares orders that match on the other columns.</p><p>The discount effect flips to <b>+$0.37 per point</b> (interval 0.20 to 0.54). Items, at +$9.68 each, and tenure, at +$1.29 per month, do most of the work. R² jumps to 0.754.</p>",
        metrics: { r2: "0.754", rmse: "$13.35", disc: "+$0.37 / pt" },
        changed: ["+ 3 controls", "~ Discount −$0.49 → +$0.37 per point", "~ CV RMSE $25.97 → $13.35"],
        draw: coefCard },

      { title: "Check the residuals", tag: "Problem", add: ["resid"], focus: ["model", "resid"],
        links: [["model", "resid", "res"]], badges: { resid: "curve + funnel" },
        flows: [["model", "resid", "res", { label: "y − ŷ" }]],
        text: "<p>Plot residuals against fitted values. They bow upward at the big-order end and fan out. Value grows <b>faster</b> than items, so a straight line in items is the wrong shape.</p><p>A wrong shape biases the effects at both ends, and the fan makes plain standard errors too optimistic.</p>",
        note: "Two standard fixes: model log(order value), which turns effects into percentages, or add an items² term. The next step keeps dollars and adds items²." },

      { title: "Let the model bend", tag: "Solution", focus: ["items", "model", "resid"],
        flows: [["items", "model", "data", { label: "items²" }], ["model", "resid", "res"]],
        badges: { model: "+ items²", resid: "flat band" },
        text: "<p>Add <code>I(items**2)</code>. The residual band flattens, R² rises to 0.771 and, more importantly, the error on held-out orders falls to <b>$12.86</b>.</p><p>The discount coefficient barely moves. A stable coefficient across sensible models is a good sign.</p>",
        metrics: { r2: "0.771", rmse: "$12.86" },
        changed: ["+ items² term", "~ CV RMSE $13.35 → $12.86"] },

      { title: "The kitchen-sink temptation", tag: "Problem", add: ["noise"], focus: ["noise", "model"],
        links: [["noise", "model", "miss", { dashed: true }]],
        flows: [["noise", "model", "miss", { label: "day, zip, opens", count: 2 }]],
        badges: { noise: "pure noise" },
        text: "<p>A teammate adds three more columns: day of month, a zip-code digit and email opens. None of them affects spend in this data.</p><p>R² still ticks up, by 0.0007. It always does, because least squares can never fit worse with an extra column. R² cannot tell you to stop.</p>",
        metrics: { r2: "0.771" },
        changed: ["+ 3 noise columns", "~ R² +0.0007 (it never goes down)"] },

      { title: "Judge on unseen orders", tag: "Solution", add: ["cv"], focus: ["model", "cv"],
        links: [["model", "cv", "req"]],
        flows: [["model", "cv", "req", { label: "5 folds", count: 5, dur: 1.2 }]],
        text: "<p>Five-fold cross-validation fits each model on 4/5 of the orders and scores it on the other fifth, five times. The noise columns make predictions <b>worse</b>: $12.95 against $12.86.</p><p>Adjusted R² and AIC agree. Drop the noise and keep model B.</p>",
        metrics: { rmse: "$12.86" },
        changed: ["- Model E (noise) rejected", "~ Chosen: model B"],
        draw: scoreboard },

      { title: "The answer", tag: "Solution", add: ["report"], remove: ["noise"], unlink: [["noise", "model"]], focus: ["report", "cv", "model"],
        links: [["cv", "report", "res"]],
        flows: [["cv", "report", "res", { label: "model B" }]],
        badges: { report: "basket + tenure" },
        text: "<p>Order value is driven mainly by <b>basket size</b> (each extra item adds more than the last) and <b>tenure</b> (about +$1.29 per month). Mobile orders run about $7 smaller.</p><p>Discounts show a small positive association, +$0.37 per point. This is observational data, so before anyone changes pricing, test discounts in an experiment (Area 09).</p>",
        key: "Regression sizes associations with honest uncertainty. Causal claims need a design, such as a randomized test, behind them." },

      { title: "The whole path", tag: "Recap",
        flows: [["wh", "nb", "data", { count: 1 }], ["nb", "model", "req", { count: 1 }], ["model", "resid", "res", { count: 1 }], ["model", "cv", "req", { count: 1 }], ["cv", "report", "res", { count: 1 }]],
        text: "<p>One question, six habits, one per lesson in this area:</p><ul><li><b>Fit</b> a line by least squares (10.1)</li><li><b>Interpret</b> with the right controls and units (10.2)</li><li><b>Diagnose</b> with residual plots (10.3)</li><li><b>Logistic</b> when the outcome is yes/no (10.4)</li><li><b>Engineer</b> features without overfitting (10.5)</li><li><b>Compare</b> models on unseen data (10.6)</li></ul>" }
    ],
    learn: [
      "How least squares fits a line and what R² measures",
      "Why adding a control can flip a coefficient's sign",
      "How to read residual plots and fix a wrong shape",
      "Why R² always rises and cross-validation doesn't",
      "How to turn a model into a careful business answer"
    ]
  };
})();
