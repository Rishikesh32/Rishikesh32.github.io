/* Flagship scene: "from CSV to clean, reusable analysis in pandas" (plays on the Python overview).
   Illustrative but internally consistent numbers for an online store's weekly export:
   Week 46: 48,210 raw rows, 312 exact duplicate rows -> 47,898; paid orders 41,560.
   customers: 8,400 rows, unique customer_id; 85 paid orders have no matching customer (left_only).
   Paid revenue by region: North $742k, South $611k, West $538k, East $409k, Unknown $10k = $2.31M (5 rows).
   Week 47: 49,027 raw rows, paid revenue $2.26M. A stale cell that stacked both weeks shows $2.31M + $2.26M = $4.57M. */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  "use strict";

  function txt(ctx, g, x, y, s, o) {
    o = o || {};
    var t = ctx.el("text", { x: x, y: y, "font-size": o.size || 11, "text-anchor": o.anchor || "start", "font-weight": o.bold ? 700 : 500, style: "fill:" + (o.color || "var(--ink)") + ";font-family:var(--font-mono)" }, g);
    t.textContent = s; return t;
  }
  function card(ctx, svg, x, y, w, h, title) {
    var g = ctx.el("g", { class: "py-card" }, svg);
    ctx.el("rect", { x: x, y: y, width: w, height: h, rx: 10, style: "fill:var(--surface);stroke:var(--ink);stroke-width:1.4" }, g);
    if (title) txt(ctx, g, x + 12, y + 19, title, { size: 10, bold: true, color: "var(--ink-2)" });
    return g;
  }

  /* df.info() excerpt: two columns read with the wrong dtype. */
  function dtypes(svg, ctx) {
    var a = ctx.anchor("df"), W = 232, H = 118, x0 = a[0] - W / 2, y0 = a[1] + 64;
    var g = card(ctx, svg, x0, y0, W, H, "df.info()  (excerpt)");
    var rows = [["order_id", "int64", false], ["order_date", "object", true], ["amount", "object", true], ["status", "object", false]];
    rows.forEach(function (r, i) {
      var y = y0 + 40 + i * 18;
      txt(ctx, g, x0 + 14, y, r[0], { size: 10.5, color: "var(--ink-2)" });
      txt(ctx, g, x0 + 112, y, r[1], { size: 10.5, bold: r[2], color: r[2] ? "var(--signal)" : "var(--ink)" });
      if (r[2]) txt(ctx, g, x0 + W - 12, y, i === 1 ? "text dates" : "\"$1,204.50\"", { size: 9.5, anchor: "end", color: "var(--signal)" });
    });
  }

  /* The answer: paid revenue by region for week 46. */
  function result(svg, ctx) {
    var a = ctx.anchor("report"), W = 210, H = 150, x0 = a[0] - W / 2, y0 = a[1] + 62;
    var g = card(ctx, svg, x0, y0, W, H, "PAID REVENUE, WEEK 46");
    var rows = [["North", 742], ["South", 611], ["West", 538], ["East", 409], ["Unknown", 10]];
    var bx = x0 + 78, bw = 84;
    rows.forEach(function (r, i) {
      var y = y0 + 40 + i * 21;
      txt(ctx, g, bx - 8, y + 4, r[0], { size: 10, anchor: "end", color: i === 4 ? "var(--signal)" : "var(--ink-2)" });
      ctx.el("rect", { x: bx, y: y - 5, width: Math.max(3, bw * r[1] / 742), height: 11, rx: 3, style: "fill:" + (i === 4 ? "var(--signal)" : "var(--t2)") + ";opacity:.85" }, g);
      txt(ctx, g, bx + bw * r[1] / 742 + 6, y + 4, "$" + r[1] + "k", { size: 9.5, color: "var(--ink-2)" });
    });
  }

  window.ATLAS_SCENES["python/overview"] = {
    unit: 34,
    metrics: [
      { id: "rows", label: "Rows in play" },
      { id: "issues", label: "Data issues", tone: "signal" },
      { id: "rev", label: "Paid revenue", tone: "accent" },
      { id: "time", label: "Time per report", tone: "good" }
    ],
    legend: { req: "request", data: "rows", res: "result", miss: "wrong result" },
    nodes: {
      csv:    { type: "stack", x: 0,    y: 0,    w: 1.8, d: 1.4, n: 4, color: "t5", label: "orders_w46.csv", sub: "export" },
      lead:   { type: "block", x: 13.4, y: 3.6,  w: 1.4, d: 1.4, h: 1.0, color: "t4", label: "Sales lead", icon: "?" },
      nb:     { type: "slab",  x: 2.8,  y: -0.8, w: 9.8, d: 3.4, color: "signal", label: "notebook kernel", sub: "hidden state" },
      mod:    { type: "slab",  x: 2.8,  y: -0.8, w: 9.8, d: 3.4, color: "good", label: "analysis.py", sub: "weekly_report()" },
      df:     { type: "block", x: 3.4,  y: 0,    w: 1.8, d: 1.8, h: 1.1, color: "t1", label: "DataFrame", sub: "read_csv" },
      clean:  { type: "block", x: 6.6,  y: 0,    w: 1.8, d: 1.8, h: 1.1, color: "t2", label: "Clean + filter" },
      cust:   { type: "cyl",   x: 7.5,  y: 4.4,  r: 0.85, h: 1.2, color: "t3", label: "customers", sub: "8,400 rows" },
      merge:  { type: "block", x: 9.8,  y: 0,    w: 1.8, d: 1.8, h: 1.1, color: "t3", label: "Merge + group" },
      report: { type: "block", x: 13.4, y: 0,    w: 1.6, d: 1.6, h: 1.4, color: "accent", label: "Region table" },
      csv2:   { type: "stack", x: 0,    y: -3,   w: 1.8, d: 1.4, n: 4, color: "t5", label: "orders_w47.csv" },
      test:   { type: "block", x: 6.6,  y: -3,   w: 1.4, d: 1.2, h: 0.7, color: "good", label: "pytest", sub: "3 passed", icon: "✓" }
    },
    steps: [
      { title: "The same question every Monday", tag: "Problem", add: ["csv", "lead"],
        text: "<p>Every Monday the sales lead asks: <b>what was paid revenue by region last week?</b> The answer lives in a raw export, <code>orders_w46.csv</code>, with 48,210 rows.</p><p>Done by hand in a spreadsheet, this takes about three hours a week in this example, and the steps differ a little every time.</p>",
        flows: [["lead", "csv", "req", { label: "revenue by region?" }]],
        key: "A question that comes back every week deserves code you can rerun, not a fresh manual effort.",
        metrics: { rows: "48,210", issues: "?", rev: "?", time: "≈ 3 h" } },
      { title: "Load it into a DataFrame", tag: "Idea", add: ["df"], links: [["csv", "df"]], focus: ["csv", "df"], badges: { df: "48,210 × 9" },
        text: "<p>One line, <code>pd.read_csv(\"orders_w46.csv\")</code>, turns the file into a <b>DataFrame</b>: an index, named columns and one dtype per column.</p><p>pandas guesses each column's type while it reads. Before you calculate anything, check those guesses.</p>",
        flows: [["csv", "df", "data", { label: "read_csv", count: 3 }]],
        changed: ["+ DataFrame: 48,210 rows × 9 columns"] },
      { title: "First look: the types are wrong", tag: "Problem", focus: ["df"], badges: { df: "amount: object" },
        text: "<p><code>df.info()</code> shows the trouble. <code>amount</code> is <code>object</code> (text) because values look like <code>\"$1,204.50\"</code>, and <code>order_date</code> is text too. <code>df.duplicated().sum()</code> finds 312 rows exported twice.</p><p>Summing now would fail or double count.</p>",
        draw: dtypes,
        metrics: { issues: "3" },
        changed: ["+ amount stored as text", "+ order_date stored as text", "+ 312 duplicate rows"],
        note: "<code>object</code> on a column you expected to be numeric almost always means some values contain text." },
      { title: "Clean once, explicitly", tag: "Solution", add: ["clean"], links: [["df", "clean"]], focus: ["df", "clean"], badges: { df: null, clean: "47,898 rows" },
        text: "<p>Fix each issue with one visible line: strip <code>$</code> and commas, then <code>pd.to_numeric</code>; parse dates with <code>pd.to_datetime</code>; drop exact duplicates with <code>drop_duplicates()</code>.</p><p>You keep the raw file untouched and write the cleaned result to a new DataFrame.</p>",
        flows: [["df", "clean", "data", { label: "to_numeric, to_datetime" }]],
        metrics: { rows: "47,898", issues: "0" },
        changed: ["~ amount: object → float64", "~ order_date: object → datetime64", "- 312 duplicate rows"] },
      { title: "Filter and select", tag: "Idea", focus: ["clean"], badges: { clean: "status == paid" },
        text: "<p>The question is about <b>paid</b> revenue, so keep only those rows with a boolean mask and only the columns you need.</p><p><code>df.loc[df[\"status\"] == \"paid\", [\"order_id\", \"customer_id\", \"amount\"]]</code> is SQL's <code>WHERE</code> and <code>SELECT</code> in one line.</p>",
        flows: [["df", "clean", "data", { label: "query('status == \"paid\"')" }]],
        metrics: { rows: "41,560" },
        changed: ["- 6,338 pending or refunded orders"] },
      { title: "Merge in the customers' regions", tag: "Idea", add: ["cust", "merge"], links: [["clean", "merge"], ["cust", "merge"]], focus: ["clean", "cust", "merge"], badges: { clean: null, merge: "validate m:1" },
        text: "<p>Region lives in a separate <code>customers</code> table. A <b>left merge</b> keeps every paid order and adds its customer's region.</p><p><code>validate=\"m:1\"</code> raises an error if a customer id appears twice, and <code>indicator=True</code> shows 85 orders with no matching customer.</p>",
        flows: [["clean", "merge", "data", { label: "41,560 orders" }], ["cust", "merge", "data", { label: "how=\"left\"" }]],
        metrics: { rows: "41,560" },
        key: "Check the row count before and after every merge. A left merge on a unique key never changes it.",
        changed: ["+ region column", "~ rows unchanged: 41,560 → 41,560", "+ 85 orders left_only"] },
      { title: "Group, and the answer appears", tag: "Solution", add: ["report"], links: [["merge", "report"]], focus: ["merge", "report", "lead"], badges: { merge: null, report: "5 rows" },
        text: "<p><code>groupby(\"region\", dropna=False)[\"amount\"].sum()</code> collapses 41,560 rows into five, and the 85 unmatched orders show up as <b>Unknown</b> instead of vanishing.</p><p>Total paid revenue: $2.31M. The first version took about 45 minutes in a notebook.</p>",
        draw: result,
        flows: [["merge", "report", "res", { label: "groupby + sum" }], ["report", "lead", "res", { label: "region table", delay: 0.6 }]],
        metrics: { rows: "5", rev: "$2.31M", time: "≈ 45 min" } },
      { title: "Next week, the notebook bites", tag: "Problem", add: ["nb", "csv2"], focus: ["nb", "csv2", "csv", "report"], badges: { report: "$4.57M ?!", df: "In [7] [3] [12]" },
        text: "<p>Week 47 arrives. You copy the notebook, change the file name in three of four places and rerun cells out of order. One stale cell still read last week's file and stacked both weeks.</p><p>The report says $4.57M. Nothing on the page looks wrong, because the bug lives in the kernel's hidden state.</p>",
        flows: [["csv2", "df", "data", { label: "w47" }], ["csv", "df", "miss", { label: "stale w46 cell" }], ["merge", "report", "miss"]],
        metrics: { rows: "97,237", rev: "$4.57M", issues: "1" },
        changed: ["+ copied notebook, 4 manual edits", "~ execution counts out of order", "~ revenue doubled: two weeks stacked"],
        note: "Restart the kernel and run all cells before you share any number. It is the cheapest audit there is." },
      { title: "Turn the steps into a function", tag: "Solution", remove: ["nb"], add: ["mod", "test"], links: [["test", "clean", "req", { dashed: true }]], focus: ["mod", "test", "df", "clean", "merge"], badges: { report: null, df: null },
        text: "<p>Move load, clean, merge and group into <code>analysis.py</code> as <code>weekly_report(path)</code>. The file name becomes a <b>parameter</b>, so there is nothing to edit by hand.</p><p>Three pytest tests on tiny DataFrames pin down the rules: duplicates dropped, unknown customers kept, only paid orders counted.</p>",
        flows: [["test", "clean", "req", { label: "3-row DataFrames" }]],
        metrics: { issues: "0" },
        key: "Whatever changed between your copies becomes a parameter; everything else becomes one tested function body.",
        changed: ["+ weekly_report(path) in analysis.py", "+ 3 tests pass", "- copy-pasted notebook"] },
      { title: "Rerun on any week", tag: "Solution", focus: ["csv2", "mod", "df", "clean", "merge", "report", "lead"],
        text: "<p>Next Monday you run <code>weekly_report(\"orders_w47.csv\")</code> in a fresh kernel. The same tested steps process the new 49,027 rows and return week 47's answer, $2.26M.</p><p>The work drops to about two minutes, and every week is computed by exactly the same logic.</p>",
        flows: [["csv2", "df", "data", { label: "weekly_report(path)" }], ["df", "clean", "data", { delay: 0.3 }], ["clean", "merge", "data", { delay: 0.6 }], ["merge", "report", "res", { delay: 0.9 }], ["report", "lead", "res", { label: "week 47", delay: 1.2 }]],
        metrics: { rows: "49,027", rev: "$2.26M", time: "≈ 2 min" },
        changed: ["~ rows: 49,027 (week 47 raw)", "~ time per report: 45 min → 2 min"] },
      { title: "From CSV to reusable analysis", tag: "Recap",
        text: "<p>One weekly question used every lesson in this area:</p><ul><li><b>Python and NumPy</b>: types and fast columns underneath</li><li><b>pandas</b>: load, check dtypes, clean, filter, group</li><li><b>Merging</b>: a left join you validated by row count</li><li><b>Notebooks</b>: hidden state, fixed by restart and run all</li><li><b>Reusable code</b>: a tested function you rerun every week</li></ul>",
        flows: [["csv2", "df", "data", { count: 1 }], ["df", "clean", "data", { count: 1 }], ["clean", "merge", "data", { count: 1 }], ["cust", "merge", "data", { count: 1 }], ["merge", "report", "res", { count: 1 }], ["report", "lead", "res", { count: 1 }]] }
    ],
    learn: [
      "Why you check dtypes right after read_csv",
      "How to clean text numbers, dates and duplicates",
      "How a validated left merge keeps row counts honest",
      "Why notebooks give wrong answers after out-of-order runs",
      "How a function with a parameter turns a weekly chore into one call"
    ]
  };
})();
