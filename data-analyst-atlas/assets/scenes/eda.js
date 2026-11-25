/* Flagship scene: "why did revenue drop last month?" (plays on the EDA overview).
   Illustrative but internally consistent numbers for an online store:
   Sep 2026: 800,000 sessions x 3.00% conversion = 24,000 orders x $50 AOV = $1.200M
   Oct 2026: 800,000 sessions x 2.75% conversion = 22,000 orders x $48 AOV = $1.056M  (-12%)
   Mobile:  500,000 sessions/month, 2.4% -> 2.0% (12,000 -> 10,000 orders); desktop 300,000 at 4.0% both months.
   Oct mobile: 2.4% for Oct 1-8, about 1.86% from Oct 9 (8 x 2.4 + 23 x 1.86 = 31 x 2.0).
   Waterfall: (24,000 - 22,000) x $50 = $100k from orders, 22,000 x ($50 - $48) = $44k from AOV, total $144k. */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  "use strict";

  function txt(ctx, g, x, y, s, o) {
    o = o || {};
    var t = ctx.el("text", { x: x, y: y, "font-size": o.size || 11, "text-anchor": o.anchor || "start", "font-weight": o.bold ? 700 : 500, style: "fill:" + (o.color || "var(--ink)") + ";font-family:var(--font-mono)" }, g);
    t.textContent = s; return t;
  }
  function card(ctx, svg, x, y, w, h, title) {
    var g = ctx.el("g", { class: "eda-card" }, svg);
    ctx.el("rect", { x: x, y: y, width: w, height: h, rx: 10, style: "fill:var(--surface);stroke:var(--ink);stroke-width:1.4" }, g);
    if (title) txt(ctx, g, x + 12, y + 19, title, { size: 10, bold: true, color: "var(--ink-2)" });
    return g;
  }

  /* Revenue bridge: Sep $1.20M -> fewer orders -$100k -> lower AOV -$44k -> Oct $1.056M */
  function waterfall(svg, ctx) {
    var a = ctx.anchor("ord"), W = 236, H = 150, x0 = a[0] + 70, y0 = a[1] - 170;
    var g = card(ctx, svg, x0, y0, W, H, "REVENUE BRIDGE, SEP → OCT");
    var base = y0 + H - 30, top = y0 + 34, lo = 1.0, hi = 1.2;
    function Y(v) { return base - (v - lo) / (hi - lo) * (base - top); }
    var bars = [["Sep", 1.0, 1.2, "var(--t1)", "$1.20M"], ["orders", 1.1, 1.2, "var(--signal)", "−$100k"], ["AOV", 1.056, 1.1, "var(--t3)", "−$44k"], ["Oct", 1.0, 1.056, "var(--t1)", "$1.06M"]];
    bars.forEach(function (b, i) {
      var bx = x0 + 18 + i * 54;
      ctx.el("rect", { x: bx, y: Y(b[2]), width: 36, height: Math.max(2, Y(b[1]) - Y(b[2])), rx: 3, style: "fill:" + b[3] + ";opacity:.85" }, g);
      txt(ctx, g, bx + 18, Y(b[2]) - 5, b[4], { size: 9.5, anchor: "middle", bold: true, color: i === 1 ? "var(--signal)" : "var(--ink-2)" });
      txt(ctx, g, bx + 18, base + 15, b[0], { size: 9.5, anchor: "middle", color: "var(--ink-2)" });
    });
    ctx.el("line", { x1: x0 + 12, x2: x0 + W - 12, y1: base, y2: base, style: "stroke:var(--ink-3);stroke-width:1" }, g);
  }

  /* Daily mobile conversion, Sep 1 - Oct 31: flat around 2.4% with a weekend wiggle, then a step down on Oct 9. */
  function dailyMobile(svg, ctx) {
    var a = ctx.anchor("mob"), W = 270, H = 132, x0 = a[0] - 90, y0 = a[1] - 200;
    var g = card(ctx, svg, x0, y0, W, H, "MOBILE CONVERSION BY DAY");
    var px = x0 + 34, py = y0 + 30, pw = W - 48, ph = H - 60, lo = 1.5, hi = 2.7;
    function X(d) { return px + pw * d / 60; }
    function Y(v) { return py + ph * (hi - v) / (hi - lo); }
    var wig = [0.02, -0.03, -0.02, 0.0, 0.04, 0.09, 0.05], pts = [];
    for (var d = 0; d <= 60; d++) { var lvl = d < 38 ? 2.4 : 1.86; pts.push((d ? "L" : "M") + X(d).toFixed(1) + "," + Y(lvl + wig[(d + 1) % 7]).toFixed(1)); }
    ctx.el("line", { x1: px, x2: px + pw, y1: py + ph, y2: py + ph, style: "stroke:var(--ink-3);stroke-width:1" }, g);
    ctx.el("path", { d: pts.join(" "), style: "fill:none;stroke:var(--t2);stroke-width:2" }, g);
    ctx.el("line", { x1: X(38), x2: X(38), y1: py - 2, y2: py + ph, style: "stroke:var(--signal);stroke-width:1.4;stroke-dasharray:3 3" }, g);
    txt(ctx, g, X(38) + 4, py + 6, "Oct 9: app 5.2", { size: 9, color: "var(--signal)", bold: true });
    txt(ctx, g, px - 4, Y(2.4) + 3, "2.4%", { size: 8.5, anchor: "end", color: "var(--ink-3)" });
    txt(ctx, g, px - 4, Y(1.86) + 3, "1.9%", { size: 8.5, anchor: "end", color: "var(--signal)" });
    txt(ctx, g, px, py + ph + 14, "Sep 1", { size: 8.5, color: "var(--ink-3)" });
    txt(ctx, g, X(30), py + ph + 14, "Oct 1", { size: 8.5, anchor: "middle", color: "var(--ink-3)" });
    txt(ctx, g, px + pw, py + ph + 14, "Oct 31", { size: 8.5, anchor: "end", color: "var(--ink-3)" });
  }

  window.ATLAS_SCENES["eda/overview"] = {
    unit: 34,
    metrics: [
      { id: "rev", label: "Oct revenue", tone: "signal" },
      { id: "orders", label: "Oct orders" },
      { id: "aov", label: "Oct AOV", tone: "accent" },
      { id: "mconv", label: "Mobile conv.", tone: "good" }
    ],
    legend: { req: "question / query", data: "rows", res: "result", miss: "suspect", token: "finding" },
    nodes: {
      exec:  { type: "block", x: -3, y: 3,    w: 1.4, d: 1.4, h: 0.9, color: "t5", label: "Head of sales", icon: "◉" },
      dash:  { type: "block", x: 0.95, y: 7.45,  w: 1.6, d: 1.6, h: 0.7, color: "t1", label: "Revenue report" },
      q:     { type: "block", x: 0.35, y: 2.85,    w: 1.5, d: 1.5, h: 0.8, color: "accent", label: "Sharp question", icon: "?" },
      db:    { type: "cyl",   x: 5.25, y: 8.75,  r: 0.85, h: 1.3, color: "t4", label: "orders", sub: "46k rows" },
      nb:    { type: "block", x: 4.15, y: 2.65,    w: 1.8, d: 1.8, h: 1.1, color: "t1", label: "EDA notebook", icon: "≡" },
      ord:   { type: "block", x: 3.7, y: -1.3,    w: 1.6, d: 1.6, h: 1.2, color: "t2", label: "Orders", sub: "−8.3%" },
      aov:   { type: "block", x: 8.3, y: 3.3,    w: 1.6, d: 1.6, h: 1.0, color: "t3", label: "AOV", sub: "−4%" },
      mob:   { type: "stack", x: 4.1, y: -4.9, w: 1.6, d: 1.2, n: 4, color: "t2", label: "Mobile" },
      desk:  { type: "stack", x: 7.7, y: -1.3,  w: 1.6, d: 1.2, n: 3, color: "t2", label: "Desktop" },
      rel:   { type: "block", x: 8.55, y: -4.95, w: 1.4, d: 1.4, h: 0.8, color: "signal", label: "App 5.2", sub: "Oct 9", icon: "!" },
      yoy:   { type: "cyl",   x: 11.9, y: 2.9,    r: 0.75, h: 1.0, color: "t3", label: "Last October" },
      fin:   { type: "block", x: 11.9, y: -1.1,  w: 1.6, d: 1.6, h: 1.0, color: "good", label: "Findings", icon: "✓" }
    },
    steps: [
      { title: "Revenue fell 12%. Why?", tag: "Problem", add: ["dash", "exec"],
        text: "<p>The monthly report lands: October revenue was <b>$1.06M</b>, down from <b>$1.20M</b> in September. The head of sales asks you one thing: <i>why?</i></p><p>You could open the data and start making charts. You will get further if you first decide exactly what you are explaining.</p>",
        flows: [["dash", "exec", "res", { label: "Oct revenue −12%" }]],
        metrics: { rev: "$1.06M", orders: "—", aov: "—", mconv: "—" } },
      { title: "Sharpen the question", tag: "Idea", add: ["q"], links: [["exec", "q"]], focus: ["exec", "q"],
        text: "<p>\"Why did revenue drop?\" becomes: <b>which factor of net revenue changed between September and October, in which segment, and is it something we can fix?</b></p><p>That names the metric, the window, the comparison and the decision. It also tells you when you are done.</p>",
        flows: [["exec", "q", "req", { label: "why did revenue drop?" }]],
        key: "A sharp question names the metric, the population, the window, the baseline and the decision it feeds." },
      { title: "Check the data before trusting it", tag: "Idea", add: ["db", "nb"], links: [["q", "nb"], ["db", "nb", "data"]], focus: ["db", "nb"],
        text: "<p>You pull September and October from <code>orders</code>: 46,000 rows. First the quality gate. One row per <code>order_id</code>? Yes. Missing days? None. Test orders? Already filtered.</p><p>Then the calendar. October has 31 days and 9 weekend days against September's 30 and 8, so the calendar <b>favours</b> October. Per day, the drop is even bigger: about 15%.</p>",
        flows: [["nb", "db", "req", { label: "SELECT … Sep–Oct" }], ["db", "nb", "data", { count: 3 }]],
        changed: ["✓ No duplicate order_ids", "✓ No missing days", "~ Per day: $40.0k → $34.1k (−14.8%)"],
        note: "Ruling out the boring explanations (bad data, calendar) first is what makes the rest of the analysis believable." },
      { title: "Split revenue into orders × AOV", tag: "Idea", add: ["ord", "aov"], links: [["nb", "ord"], ["nb", "aov"]], focus: ["ord", "aov"],
        text: "<p>Revenue is orders times average order value. Orders fell from <b>24,000 to 22,000</b> (−8.3%) and AOV from <b>$50 to $48</b> (−4%).</p><p>The bridge shows the sizes: fewer orders cost <b>$100k</b>, the lower AOV cost <b>$44k</b>. Orders are the bigger story, so dig there first.</p>",
        flows: [["nb", "ord", "res"], ["nb", "aov", "res"]],
        metrics: { orders: "22,000", aov: "$48" },
        changed: ["~ Orders −2,000 → −$100k", "~ AOV −$2 → −$44k"],
        draw: waterfall },
      { title: "Orders = sessions × conversion", tag: "Idea", focus: ["ord"], badges: { ord: "conv 3.0% → 2.75%" },
        text: "<p>Keep splitting the factor that moved. Sessions were flat at <b>800,000</b> in both months, so traffic is not the problem. Conversion fell from <b>3.0% to 2.75%</b>, and 800,000 × 0.25 points is exactly the 2,000 missing orders.</p>",
        flows: [["db", "ord", "data", { count: 2, label: "sessions 800k → 800k" }]],
        key: "Keep splitting the factor that moved until you reach something specific enough to act on." },
      { title: "Segment by device", tag: "Idea", add: ["mob", "desk"], links: [["ord", "mob"], ["ord", "desk"]], focus: ["mob", "desk", "ord"], badges: { mob: "2.4% → 2.0%", desk: "4.0% → 4.0%" },
        text: "<p>Split conversion by device. Desktop held at <b>4.0%</b>. Mobile fell from <b>2.4% to 2.0%</b>: 500,000 sessions × 0.4 points = 2,000 orders. The whole drop is mobile.</p><p>You also check the mix: mobile's share of sessions stayed at 62.5%, so this is a real change inside the segment, not a mix shift.</p>",
        flows: [["ord", "mob", "miss"], ["ord", "desk", "res"]],
        metrics: { mconv: "2.0%" },
        changed: ["~ Mobile 12,000 → 10,000 orders", "= Desktop 12,000 orders both months"] },
      { title: "When did it start?", tag: "Idea", add: ["rel"], links: [["rel", "mob", "miss", { dashed: true, label: "Oct 9" }]], focus: ["mob", "rel"],
        text: "<p>Plot mobile conversion by day. It sits near 2.4% with its usual weekend wiggle through September, then <b>steps down on October 9</b> to about 1.9% and stays there.</p><p>A step, not a slope, points to an event. October 9 is the day app version 5.2 shipped a new checkout.</p>",
        flows: [["rel", "mob", "miss", { label: "new checkout" }]],
        note: "A gradual slide suggests demand or competition. A sudden step that lines up with a release, an outage or a tracking change usually points to the cause.",
        draw: dailyMobile },
      { title: "Is the AOV dip seasonal?", tag: "Idea", add: ["yoy"], links: [["yoy", "aov", "data", { dashed: true }]], focus: ["aov", "yoy"], badges: { aov: "seasonal" },
        text: "<p>The other $44k came from AOV. Compare like with like: last year, AOV also fell about <b>4%</b> from September to October, as back-to-school baskets faded.</p><p>So the AOV dip is the normal season, not a new problem. It belongs in the report, but not in the bug tracker.</p>",
        flows: [["yoy", "aov", "data", { label: "Sep→Oct 2025: −4%" }]],
        key: "Before you explain a change, check whether the same change happened at the same time last year." },
      { title: "Write the findings", tag: "Solution", add: ["fin"], links: [["mob", "fin"], ["aov", "fin"]], focus: ["fin", "mob", "aov", "exec"],
        text: "<p>Your answer to the head of sales, with evidence and confidence:</p><ul><li><b>$100k</b>: mobile conversion stepped down after the Oct 9 app release. High confidence. Fix the checkout.</li><li><b>$44k</b>: AOV fell as it does every October. Medium confidence. No action.</li></ul>",
        flows: [["mob", "fin", "token"], ["aov", "fin", "token"], ["fin", "exec", "token", { label: "2 findings + evidence", delay: 0.6 }]],
        changed: ["+ Finding 1: app 5.2 checkout, −$100k", "+ Finding 2: seasonal AOV, −$44k", "= $144k explained"] },
      { title: "The whole investigation", tag: "Recap",
        text: "<p>One vague \"why?\" became two specific, checked findings. Each lesson in this area is one move you just made:</p><ul><li><b>Question</b>: sharpen it first</li><li><b>One column, two columns</b>: profile and relate</li><li><b>Segments</b>: split the factor that moved</li><li><b>Time</b>: step or slope, season or calendar</li><li><b>Workflow</b>: quality gate, then a findings log</li></ul>",
        flows: [["exec", "q", "req", { count: 1 }], ["db", "nb", "data", { count: 1 }], ["nb", "ord", "res", { count: 1 }], ["ord", "mob", "miss", { count: 1 }], ["mob", "fin", "token", { count: 1 }], ["fin", "exec", "token", { count: 1, delay: 0.8 }]] }
    ],
    learn: [
      "How to turn \"why did revenue drop?\" into a sharp question",
      "Why you check grain and the calendar before anything else",
      "How a metric tree finds the factor that moved",
      "How segmenting and a daily chart point to a cause",
      "How a year-over-year check separates season from problem"
    ]
  };
})();
