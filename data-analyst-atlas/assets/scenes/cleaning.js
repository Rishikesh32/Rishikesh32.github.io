/* Flagship scene: a messy CRM export becomes a table you can trust (plays on the Data cleaning overview).
   Example numbers, internally consistent: 12,480 raw rows − 550 duplicates = 11,930;
   − 37 unparseable rows quarantined = 11,893, which matches finance's count of paying customers. */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  "use strict";

  function txt(ctx, g, x, y, s, o) {
    o = o || {};
    var t = ctx.el("text", { x: x, y: y, "font-size": o.size || 11, "text-anchor": o.anchor || "start", "font-weight": o.bold ? 700 : 500, style: "fill:" + (o.color || "var(--ink)") + ";font-family:var(--font-mono)" }, g);
    t.textContent = s; return t;
  }
  function card(ctx, svg, x, y, w, h, title) {
    var g = ctx.el("g", { "class": "cln-card" }, svg);
    ctx.el("rect", { x: x, y: y, width: w, height: h, rx: 10, style: "fill:var(--surface);stroke:var(--ink);stroke-width:1.4" }, g);
    if (title) txt(ctx, g, x + 12, y + 19, title, { size: 10, bold: true, color: "var(--ink-2)" });
    return g;
  }

  /* Raw top cities from a naive GROUP BY: New York is split across spellings. */
  function rawCities(svg, ctx) {
    var a = ctx.anchor("report"), W = 210, H = 112, x0 = a[0] - W - 70, y0 = a[1] - 40;
    var g = card(ctx, svg, x0, y0, W, H, "GROUP BY city (RAW)");
    var rows = [["Los Angeles", 1840, "var(--t1)"], ["San Francisco", 1610, "var(--t1)"], ["New York", 1490, "var(--signal)"], ["NYC", 960, "var(--signal)"]];
    rows.forEach(function (r, i) {
      var y = y0 + 38 + i * 18;
      txt(ctx, g, x0 + 98, y + 4, r[0], { size: 9.5, anchor: "end", color: "var(--ink-2)" });
      ctx.el("rect", { x: x0 + 104, y: y - 5, width: r[1] / 1840 * 66, height: 10, rx: 3, style: "fill:" + r[2] + ";opacity:.85" }, g);
      txt(ctx, g, x0 + 108 + r[1] / 1840 * 66, y + 4, r[1].toLocaleString("en-US"), { size: 9, color: "var(--ink-2)" });
    });
  }

  /* Alias map card next to the text-normalizing station. */
  function aliasCard(svg, ctx) {
    var a = ctx.anchor("text"), W = 214, H = 92, x0 = a[0] - W / 2, y0 = a[1] + 38;
    var g = card(ctx, svg, x0, y0, W, H, "41 SPELLINGS → 12 CITIES");
    [["NYC · N.Y. · new york", "New York"], ["LA · L.A. · los angeles", "Los Angeles"], ["SF · san fransisco", "San Francisco"]].forEach(function (r, i) {
      var y = y0 + 40 + i * 17;
      txt(ctx, g, x0 + 12, y, r[0], { size: 9, color: "var(--ink-3)" });
      txt(ctx, g, x0 + W - 12, y, "→ " + r[1], { size: 9, anchor: "end", bold: true, color: "var(--good)" });
    });
  }

  window.ATLAS_SCENES["cleaning/overview"] = {
    unit: 34,
    metrics: [
      { id: "rows", label: "Customer rows" },
      { id: "dupes", label: "Duplicate rows", tone: "signal" },
      { id: "cities", label: "City values", tone: "accent" },
      { id: "checks", label: "Checks passing", tone: "good" }
    ],
    legend: { data: "rows", req: "query", miss: "rejected rows", res: "result", grad: "rule fix" },
    nodes: {
      crm:     { type: "cyl",   x: 0,    y: 0,   r: 0.85, h: 1.3, color: "t4", label: "CRM", sub: "source system" },
      raw:     { type: "stack", x: 3,    y: 0,   w: 1.8, d: 1.4, n: 5, color: "t5", label: "CRM export", sub: "customers.csv" },
      profile: { type: "block", x: 6.2,  y: 0,   w: 1.5, d: 1.5, h: 1.0, color: "t1", label: "Profile", icon: "?" },
      dedupe:  { type: "block", x: 9.2,  y: 0,   w: 1.5, d: 1.5, h: 1.0, color: "accent", label: "Dedupe", icon: "≡" },
      nulls:   { type: "block", x: 12.2, y: 0,   w: 1.5, d: 1.5, h: 1.0, color: "t2", label: "Fix blanks", icon: "∅" },
      types:   { type: "block", x: 12.2, y: 3.4, w: 1.5, d: 1.5, h: 1.0, color: "t3", label: "Parse dates", icon: "⌚" },
      text:    { type: "block", x: 9.2,  y: 3.4, w: 1.5, d: 1.5, h: 1.0, color: "t2", label: "Normalize text", icon: "A" },
      outl:    { type: "block", x: 6.2,  y: 3.4, w: 1.5, d: 1.5, h: 1.0, color: "t1", label: "Outliers", icon: "!" },
      checks:  { type: "block", x: 3.2,  y: 3.4, w: 1.7, d: 1.7, h: 1.3, color: "accent", label: "Quality checks", icon: "✓" },
      quar:    { type: "stack", x: 12.2, y: 6.8, w: 1.5, d: 1.2, n: 2, color: "signal", label: "Quarantine", sub: "rejected rows" },
      clean:   { type: "cyl",   x: 0,    y: 3.4, r: 0.9, h: 1.4, color: "good", label: "customers_clean" },
      report:  { type: "block", x: 0,    y: 6.8, w: 1.6, d: 1.6, h: 0.9, color: "t5", label: "City report" }
    },
    steps: [
      { title: "A Monday CRM export", tag: "Problem", add: ["crm", "raw"],
        text: "<p>Marketing wants <b>paying customers by city</b> for a campaign plan. You pull this week's export from the CRM: one CSV, 12,480 rows, typed in by sales reps, support agents and a signup form over five years.</p><p>Follow it from raw file to a table you would sign your name under.</p>",
        flows: [["crm", "raw", "data", { label: "customers.csv", count: 3 }]],
        metrics: { rows: "12,480", dupes: "—", cities: "—", checks: "—" } },
      { title: "The naive answer is wrong", tag: "Problem", add: ["report"], links: [["raw", "report", "req", { dashed: true }]], focus: ["raw", "report"], badges: { report: "12,480 customers" },
        text: "<p>A quick <code>GROUP BY city</code> says you have 12,480 customers and Los Angeles is the biggest city. Finance's billing system says <b>11,893</b> paying customers.</p><p>Neither the total nor the ranking can be trusted until you know why the numbers differ.</p>",
        flows: [["raw", "report", "req", { label: "COUNT(*) GROUP BY city" }]],
        draw: rawCities,
        key: "When your number disagrees with another trusted source, stop and find out why before you publish either one.",
        metrics: { cities: "41" } },
      { title: "Profile before you fix", tag: "Idea", add: ["profile"], links: [["raw", "profile", "data"]], focus: ["raw", "profile"], badges: { profile: "4 problems" },
        text: "<p>Profiling means measuring the mess before touching it: blanks per column, key uniqueness, value formats and ranges. Ten minutes of profiling turns a vague worry into a list of specific problems you can fix one by one.</p>",
        flows: [["raw", "profile", "data", { label: "profile(customers)" }]],
        changed: ["+ 550 rows share an email (4.4%)", "+ 8% blank emails, 6% blank spend", "+ 3 date formats in signup_date", "+ 41 spellings of 12 cities"],
        metrics: { dupes: "550" } },
      { title: "Deduplicate on a normalized key", tag: "Solution", add: ["dedupe"], links: [["profile", "dedupe", "data"]], focus: ["dedupe"], badges: { dedupe: "lower(trim(email))" },
        text: "<p>The grain is <b>one row per customer</b>. Reps re-entered customers with different casing and stray spaces, so you normalize the email, group on it and keep the most recently updated row as the survivor.</p>",
        flows: [["profile", "dedupe", "data", { count: 3 }]],
        key: "Write the grain of the table in one sentence, then prove the key is unique at that grain.",
        changed: ["- 550 duplicate rows merged", "~ Rows 12,480 → 11,930"],
        metrics: { rows: "11,930", dupes: "0" } },
      { title: "Handle blanks deliberately", tag: "Solution", add: ["nulls"], links: [["dedupe", "nulls", "data"]], focus: ["nulls"], badges: { nulls: "flag + plan median" },
        text: "<p>Blank emails stay blank: you cannot invent an address, and the count is reported. Blank <code>annual_spend</code> depends on plan, because Enterprise accounts are invoiced offline, so you fill it with the <b>median of the same plan</b> and add a <code>spend_was_missing</code> flag.</p>",
        flows: [["dedupe", "nulls", "data", { count: 3 }]],
        note: "No row is dropped for a blank. Dropping would have removed a large share of Enterprise customers.",
        changed: ["+ spend_was_missing flag on 716 rows", "~ Emails: blanks kept as NULL"] },
      { title: "Parse types and dates", tag: "Solution", add: ["types", "quar"], links: [["nulls", "types", "data"], ["types", "quar", "miss", { dashed: true }]], focus: ["types", "quar"], badges: { types: "UTC", quar: "37 rows" },
        text: "<p><code>signup_date</code> arrives in three formats. You parse each with an explicit format, attach the CRM's time zone and store UTC. 37 rows hold text such as <code>\"TBD\"</code> that no format can parse, so they go to <b>quarantine</b>, not into the table.</p>",
        flows: [["nulls", "types", "data", { count: 2 }], ["types", "quar", "miss", { label: "37 unparseable", delay: 0.6 }]],
        changed: ["- 37 rows quarantined with the reason", "~ Rows 11,930 → 11,893"],
        metrics: { rows: "11,893" } },
      { title: "Normalize city names", tag: "Solution", add: ["text"], links: [["types", "text", "data"]], focus: ["text"], badges: { text: "41 → 12" },
        text: "<p>Trim, lowercase and strip punctuation first, then apply a reviewed <b>alias map</b>. <code>NYC</code>, <code>N.Y.</code> and <code>new york</code> all become New York, and the 41 spellings collapse into 12 real cities.</p>",
        flows: [["types", "text", "data", { count: 3 }]],
        draw: aliasCard,
        note: "A loose fuzzy match would also have merged Newark into New York. Every merge in the alias map was reviewed.",
        metrics: { cities: "12" } },
      { title: "Investigate the outliers", tag: "Solution", add: ["outl"], links: [["text", "outl", "data"]], focus: ["outl"], badges: { outl: "3 flagged" },
        text: "<p>IQR fences flag three <code>lifetime_value</code> figures above 1,000,000. Two came from an old import that stored cents, so you divide them by 100 at the source. The third is a real enterprise account, so it stays.</p>",
        flows: [["text", "outl", "data", { count: 3 }]],
        key: "A rule finds candidates. Context decides whether each one is an error to fix or a real extreme to keep.",
        changed: ["~ 2 values fixed (cents → dollars)", "+ 1 real enterprise value kept"] },
      { title: "A check fails", tag: "Problem", add: ["checks"], links: [["outl", "checks", "data"]], focus: ["checks", "types"], badges: { checks: "5 / 6 pass" },
        text: "<p>Six automated checks run before anything is published: unique email, not-null id, valid plan, spend ≥ 0, city in the reference list, and <code>signup_date ≤ today</code>. The last one fails on 4 rows dated December 2026.</p><p>The EU sales team writes dates day-first, so <code>03/12/2026</code> was read as 3 December instead of 12 March.</p>",
        flows: [["outl", "checks", "data", { count: 2 }], ["checks", "types", "grad", { label: "fix the parser rule", delay: 0.8 }]],
        metrics: { checks: "5 / 6" },
        note: "You fix the rule (parse EU-team rows day-first), not the four numbers. Next week's export gets the fix too." },
      { title: "Publish a table you can trust", tag: "Solution", add: ["clean"], links: [["checks", "clean", "data"], ["clean", "report", "res"]], unlink: [["raw", "report"]], focus: ["checks", "clean", "report"], badges: { checks: "6 / 6 pass", report: "11,893 · NY leads" },
        text: "<p>With the rule fixed, all six checks pass and the table publishes. The report now counts <b>11,893</b> customers, exactly matching finance, and New York, not Los Angeles, is the biggest city.</p>",
        flows: [["checks", "clean", "data", { count: 3 }], ["clean", "report", "res", { label: "GROUP BY city_clean", delay: 0.6 }]],
        changed: ["+ customers_clean published", "~ Checks 5/6 → 6/6", "~ Report total now matches finance"],
        metrics: { checks: "6 / 6" } },
      { title: "The whole path", tag: "Recap",
        text: "<p>One export went through the full cleaning path:</p><ul><li><b>Profile</b> to list the problems</li><li><b>Fix</b> duplicates, blanks, types, text and outliers with rules you can rerun</li><li><b>Quarantine</b> what cannot be fixed, with a reason</li><li><b>Check</b> before publishing, and fix rules, not numbers</li></ul><p>The lessons in this area cover each station in turn.</p>",
        flows: [["crm", "raw", "data", { count: 1 }], ["raw", "profile", "data", { count: 1 }], ["profile", "dedupe", "data", { count: 1 }], ["dedupe", "nulls", "data", { count: 1 }], ["nulls", "types", "data", { count: 1 }], ["types", "text", "data", { count: 1 }], ["text", "outl", "data", { count: 1 }], ["outl", "checks", "data", { count: 1 }], ["checks", "clean", "data", { count: 1 }], ["clean", "report", "res", { count: 1 }]] }
    ],
    learn: [
      "Why a naive count disagrees with finance",
      "How profiling turns a messy export into a fix list",
      "How to deduplicate on a normalized key",
      "When to fill, flag or quarantine a bad value",
      "Why failing checks lead to fixed rules, not edited numbers"
    ]
  };
})();
