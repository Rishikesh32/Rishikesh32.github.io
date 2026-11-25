/* Flagship scene: "from a messy sales export to a monthly report" (plays on the Spreadsheets overview).
   Example numbers, internally consistent: the export has 4,812 rows; after TRIM/PROPER, 26 rows are exact
   duplicates (4,786 left); stray spaces and capitals split 4 real regions into 7 pivot rows; 212 orders carry
   SKUs stored as numbers, so their lookups return #N/A until the type is fixed. */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  "use strict";

  function txt(ctx, g, x, y, s, o) {
    o = o || {};
    var t = ctx.el("text", { x: x, y: y, "font-size": o.size || 10, "text-anchor": o.anchor || "start", "font-weight": o.bold ? 700 : 500, style: "fill:" + (o.color || "var(--ink)") + ";font-family:var(--font-mono)" }, g);
    t.textContent = s; return t;
  }
  function card(ctx, svg, x, y, w, h, title) {
    var g = ctx.el("g", {}, svg);
    ctx.el("rect", { x: x, y: y, width: w, height: h, rx: 10, style: "fill:var(--surface);stroke:var(--ink);stroke-width:1.4" }, g);
    txt(ctx, g, x + 12, y + 18, title, { size: 9.5, bold: true, color: "var(--ink-2)" });
    return g;
  }

  /* The quick pivot on raw data: one region split into several rows. */
  function splitRegions(svg, ctx) {
    var a = ctx.anchor("quick"), W = 196, H = 150, x0 = a[0] + 70, y0 = a[1] - 120;
    var g = card(ctx, svg, x0, y0, W, H, "PIVOT ON RAW DATA");
    var rows = [["North", "41,200", 0], ["North·", "6,350", 1], ["north", "3,900", 1], ["South", "38,700", 0], ["East", "29,450", 0], ["EAST", "2,100", 1], ["West", "33,800", 0]];
    rows.forEach(function (r, i) {
      var y = y0 + 36 + i * 15.5;
      txt(ctx, g, x0 + 14, y, r[0], { size: 10, bold: !!r[2], color: r[2] ? "var(--signal)" : "var(--ink)" });
      txt(ctx, g, x0 + W - 14, y, "$" + r[1], { size: 10, anchor: "end", color: r[2] ? "var(--signal)" : "var(--ink-2)" });
    });
  }

  /* Monthly revenue line for the finished report (example values, $k). */
  function miniChart(svg, ctx) {
    var a = ctx.anchor("chart"), W = 200, H = 116, x0 = a[0] - W / 2, y0 = a[1] - 190;
    var g = card(ctx, svg, x0, y0, W, H, "WEST UP 18% SINCE JAN");
    var v = [[30, 29, 31, 32, 34, 35.5], [33, 32, 33, 32, 31, 32]], px = x0 + 16, pw = W - 34, py = y0 + 30, ph = H - 48;
    function X(i) { return px + pw * i / 5; }
    function Y(val) { return py + ph * (37 - val) / 9; }
    ctx.el("line", { x1: px, x2: px + pw, y1: py + ph, y2: py + ph, style: "stroke:var(--ink-3);stroke-width:1" }, g);
    [["var(--accent)", 0, "West"], ["var(--ink-3)", 1, "Others"]].forEach(function (s) {
      ctx.el("path", { d: v[s[1]].map(function (val, i) { return (i ? "L" : "M") + X(i).toFixed(1) + "," + Y(val).toFixed(1); }).join(" "), style: "fill:none;stroke:" + s[0] + ";stroke-width:2.2" }, g);
      txt(ctx, g, X(5) + 3, Y(v[s[1]][5]) + 3, s[2], { size: 8.5, color: s[0], bold: true });
    });
    txt(ctx, g, px, py + ph + 12, "Jan", { size: 8.5, color: "var(--ink-3)" });
    txt(ctx, g, px + pw, py + ph + 12, "Jun", { size: 8.5, anchor: "end", color: "var(--ink-3)" });
  }

  window.ATLAS_SCENES["spreadsheets/overview"] = {
    unit: 34,
    metrics: [
      { id: "rows", label: "Rows" },
      { id: "regions", label: "Pivot regions", tone: "signal" },
      { id: "na", label: "#N/A lookups", tone: "accent" },
      { id: "time", label: "Time to report", tone: "good" }
    ],
    legend: { req: "request / lookup", data: "rows", res: "result", miss: "broken value" },
    nodes: {
      lead:     { type: "block", x: 0,    y: 3.8,  w: 1.3, d: 1.3, h: 0.9, color: "t4", label: "Sales lead", icon: "◉" },
      export:   { type: "stack", x: 0,    y: 0,    w: 1.8, d: 1.4, n: 5, color: "t5", label: "Sales export", sub: "CSV" },
      quick:    { type: "block", x: 3.4,  y: -3.4, w: 1.6, d: 1.6, h: 0.9, color: "signal", label: "Quick pivot", icon: "!" },
      raw:      { type: "block", x: 3.4,  y: 0,    w: 1.7, d: 1.7, h: 1.0, color: "t5", label: "Raw tab", sub: "never edited" },
      clean:    { type: "block", x: 6.8,  y: 0,    w: 1.9, d: 1.9, h: 1.3, color: "t1", label: "Clean tab", sub: "helper columns" },
      products: { type: "cyl",   x: 6.8,  y: -3.8, r: 0.85, h: 1.2, color: "t2", label: "Products tab" },
      inputs:   { type: "block", x: 6.8,  y: 3.6,  w: 1.3, d: 1.3, h: 0.7, color: "accent", label: "Inputs", sub: "discount rate", icon: "$" },
      pivot:    { type: "block", x: 10.2, y: 0,    w: 1.9, d: 1.9, h: 1.1, color: "t3", label: "Pivot", sub: "region × month" },
      chart:    { type: "block", x: 13.4, y: 0,    w: 1.7, d: 1.7, h: 1.2, color: "good", label: "Report", sub: "chart + takeaway", icon: "▲" }
    },
    steps: [
      { title: "The export lands on Monday", tag: "Problem", add: ["lead", "export"], badges: { export: "4,812 rows" },
        text: "<p>Every month the shop platform exports last month's orders as a CSV. Your sales lead wants one thing from it: <b>revenue by region, by month</b>, with a chart, by lunchtime.</p><p>Last month it took most of a day, and two numbers were wrong.</p>",
        flows: [["lead", "export", "req", { label: "revenue by region?" }]],
        metrics: { rows: "4,812", regions: "—", na: "—", time: "≈ 6 h" },
        key: "A monthly report is a pipeline. Build it once, properly, and next month costs minutes." },
      { title: "Pivot it straight away?", tag: "Problem", add: ["quick"], focus: ["export", "quick"], badges: { quick: "7 regions?" },
        text: "<p>The fast move is a pivot on the raw export. It shows <b>seven</b> regions, but the business has four. <code>North</code>, <code>North </code> (trailing space) and <code>north</code> are different values to a pivot.</p><p>The revenue column is also text like <code>\"$1,200\"</code>, so some totals quietly skip rows.</p>",
        flows: [["export", "quick", "miss", { count: 2 }]],
        metrics: { regions: "7" },
        draw: splitRegions,
        note: "Each wrong row looks plausible on its own. North appears about 20% smaller than it really is." },
      { title: "Keep the raw tab untouched", tag: "Idea", add: ["raw"], remove: ["quick"], links: [["export", "raw", "data"]], focus: ["export", "raw"],
        text: "<p>Paste the export into a <b>Raw</b> tab and never type in it. Every fix happens in formulas on another tab, so you can see each step, check it and repeat it next month.</p>",
        flows: [["export", "raw", "data", { label: "paste 4,812 rows", count: 3 }]],
        changed: ["+ Raw tab (read-only by habit)", "- Quick pivot on raw data"] },
      { title: "Clean with helper columns", tag: "Solution", add: ["clean"], links: [["raw", "clean", "data"]], focus: ["raw", "clean"], badges: { clean: "TRIM · PROPER · VALUE" },
        text: "<p>A clean tab rebuilds each column with formulas: <code>TRIM</code> strips stray spaces, <code>PROPER</code> fixes capitals, <code>VALUE(SUBSTITUTE(...))</code> turns <code>\"$1,200\"</code> into 1200.</p><p>Only after cleaning do you remove duplicates. Now 26 rows turn out to be exact copies.</p>",
        flows: [["raw", "clean", "data", { label: "TRIM + PROPER", count: 3 }]],
        metrics: { rows: "4,786", regions: "4" },
        changed: ["~ Regions 7 → 4", "~ Rows 4,812 → 4,786 (26 duplicates)", "~ Revenue text → numbers"] },
      { title: "Bring in product details", tag: "Idea", add: ["products"], links: [["clean", "products", "req", { dashed: true }]], focus: ["clean", "products"],
        text: "<p>Orders carry a SKU, but category and list price live in the Products tab. One lookup per row fetches them:</p><p><code>=XLOOKUP([@sku], Products[sku], Products[category], \"missing\")</code></p><p>Most rows match. <b>212</b> come back as <code>#N/A</code>.</p>",
        flows: [["clean", "products", "req", { label: "XLOOKUP(sku)" }], ["products", "clean", "data", { label: "category, price", delay: 0.6 }]],
        metrics: { na: "212" } },
      { title: "Every #N/A is a data question", tag: "Solution", focus: ["clean", "products"], badges: { products: "SKUs as text" },
        text: "<p>The 212 misses all have SKUs like <code>10442</code> stored as <b>numbers</b> in the export and as <b>text</b> in Products. They look identical and never match.</p><p>Convert the key once, <code>=TEXT([@sku], \"0\")</code>, and every row finds its product. No <code>IFERROR(..., 0)</code> hiding the gap.</p>",
        flows: [["clean", "products", "req", { label: "TEXT(sku)" }], ["products", "clean", "data", { delay: 0.6 }]],
        metrics: { na: "0" },
        changed: ["~ #N/A 212 → 0", "+ Key type check"],
        note: "Lookups ignore letter case but never ignore spaces or the difference between text and numbers." },
      { title: "One formula, filled down", tag: "Idea", add: ["inputs"], links: [["inputs", "clean", "req", { dashed: true }]], focus: ["inputs", "clean"], badges: { clean: "=[@units]*[@price]*(1-$J$1)" },
        text: "<p>Net revenue is one formula filled down 4,786 rows. The discount rate lives in its own labelled input cell, locked with <code>$J$1</code>, so every row points at the same cell.</p><p>Change the rate once and every row and every total updates.</p>",
        flows: [["inputs", "clean", "req", { label: "$J$1 = 5%" }]],
        key: "Relative references move with the copy. Absolute references stay pinned to one input cell." },
      { title: "Pivot the clean table", tag: "Solution", add: ["pivot"], links: [["clean", "pivot", "data"]], focus: ["clean", "pivot"], badges: { pivot: "4 × 12 grid" },
        text: "<p>Now the pivot works: Region in Rows, Month in Columns, Sum of net revenue in Values. That is a <code>GROUP BY region, month</code> with the months spread across columns.</p><p>Four regions, one total that ties back to the clean tab.</p>",
        flows: [["clean", "pivot", "data", { label: "GROUP BY region, month", count: 3 }]],
        changed: ["+ Pivot from a Table, so new rows are included"],
        note: "A pivot does not update itself. Refresh it after every paste." },
      { title: "Chart the finding", tag: "Solution", add: ["chart"], links: [["pivot", "chart", "res"]], focus: ["pivot", "chart"],
        text: "<p>The question is a trend over months, so the chart is a line. The title states the finding, not the data: <b>West up 18% since January</b>. Lines are labelled directly, with no legend to decode.</p>",
        flows: [["pivot", "chart", "res", { label: "line chart" }]],
        draw: miniChart },
      { title: "Next month: paste and refresh", tag: "Solution", links: [["chart", "lead", "res", { dashed: true }]], badges: { export: "new month" },
        text: "<p>Next Monday you paste the new export into Raw, press <b>Refresh All</b>, and the clean tab, lookups, pivot and chart all update.</p><p>Add a small check cell that flags blanks, any <code>#N/A</code> and a row count far from last month's.</p>",
        flows: [["export", "raw", "data", { count: 2 }], ["raw", "clean", "data", { count: 2, delay: 0.3 }], ["clean", "pivot", "data", { count: 2, delay: 0.6 }], ["pivot", "chart", "res", { delay: 0.9 }], ["chart", "lead", "res", { label: "monthly report", delay: 1.2 }]],
        metrics: { time: "≈ 15 min" },
        changed: ["~ Time to report ≈ 6 h → ≈ 15 min", "+ Data-check cell"] },
      { title: "The whole path", tag: "Recap",
        text: "<p>One messy export became a trusted monthly report:</p><ul><li><b>Raw tab</b>: paste, never edit</li><li><b>Clean</b>: TRIM, PROPER, VALUE, then dedupe</li><li><b>Lookups</b>: XLOOKUP, and explain every #N/A</li><li><b>Formulas</b>: fill once, lock the inputs</li><li><b>Pivot + chart</b>: GROUP BY, then the finding</li></ul><p>The lessons below take each stage in turn, and finish with what-if models.</p>",
        flows: [["export", "raw", "data", { count: 1 }], ["raw", "clean", "data", { count: 1 }], ["products", "clean", "data", { count: 1 }], ["clean", "pivot", "data", { count: 1 }], ["pivot", "chart", "res", { count: 1 }], ["chart", "lead", "res", { count: 1 }]] }
    ],
    learn: [
      "Why you never edit the raw export",
      "How TRIM, PROPER and VALUE fix pivots and totals",
      "How to join tables with XLOOKUP and explain #N/A",
      "When to lock a reference with $",
      "How a pivot maps to GROUP BY",
      "How to make the report refresh next month"
    ]
  };
})();
