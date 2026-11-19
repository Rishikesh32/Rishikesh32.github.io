/* Flagship scene: a dataset is a product (plays on the Data skills overview).
   Running example: a support-ticket urgency classifier. Numbers are illustrative but consistent:
     120,000 tickets in; 2,400 null text + 5,350 duplicate ids rejected = 7,750; 112,250 clean rows.
     1,250 rows carry a −1 sentinel in reply_mins: turned into NULL + a flag column, kept.
     Events table: 300M rows × 50 columns × 8 B = 120 GB as CSV. Parquet (3× compression) reading
     3 of 50 columns: 120 × 3/50 ÷ 3 = 2.4 GB.
     Pilot kappa: 30 / 14 / 14 / 42 → p_o 0.72, p_e 0.5072, κ ≈ 0.43.
     After guideline fix (page example): 45 / 10 / 5 / 40 → p_o 0.85, p_e 0.50, κ = 0.70.
     Synthetic funnel (page): 10,000 → 9,200 → 5,400 → 3,100. Dataset v1.3 = 8,000 real + 3,100 synthetic. */
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
  function panel(c, g, x, y, w, h) {
    c.el("rect", { x: x, y: y, width: w, height: h, rx: 8, style: "fill:var(--surface);stroke:var(--ink-3);stroke-width:.8;opacity:.94" }, g);
  }

  /* Bytes a column query reads: row-oriented CSV vs columnar Parquet. */
  function scanBars(svg, c) {
    var a = c.anchor("wh"), x0 = a[0] - 92, y0 = a[1] + 84, BW = 150;
    var g = c.el("g", { class: "scan-bars" }, svg);
    panel(c, g, x0 - 10, y0 - 22, BW + 112, 82);
    txt(c, g, x0, y0 - 7, "SELECT 3 of 50 columns, 300M rows", "fill:var(--ink-2);font-weight:600");
    [["CSV", 120, "var(--signal)", "120 GB"], ["Parquet", 2.4, "var(--good)", "2.4 GB"]].forEach(function (r, i) {
      var y = y0 + 4 + i * 24;
      txt(c, g, x0 + 44, y + 11, r[0], "fill:var(--ink-2)", "end");
      c.el("rect", { x: x0 + 50, y: y, width: BW, height: 14, rx: 3, style: "fill:" + c.mix("var(--ink)", 8) }, g);
      c.el("rect", { x: x0 + 50, y: y, width: Math.max(4, BW * r[1] / 120), height: 14, rx: 3, style: "fill:" + c.mix(r[2], 70) + ";stroke:var(--ink);stroke-width:1" }, g);
      txt(c, g, x0 + 50 + (i ? 10 : BW + 6), y + 11, r[3], "fill:var(--ink);font-weight:700;" + MONO);
    });
  }

  /* 2×2 agreement table for two annotators. */
  function kappaTable(cells, po, pe, k) {
    return function (svg, c) {
      var a = c.anchor("label"), x0 = a[0] + 132, y0 = a[1] - 40, CW = 48;
      var g = c.el("g", { class: "kappa" }, svg);
      panel(c, g, x0 - 52, y0 - 34, 2 * CW + 64, 128);
      txt(c, g, x0 + CW, y0 - 20, "100 tickets", "fill:var(--ink-2);font-weight:600", "middle");
      txt(c, g, x0 + CW / 2, y0 - 5, "B: urg", "fill:var(--ink-3)", "middle");
      txt(c, g, x0 + CW * 1.5, y0 - 5, "B: not", "fill:var(--ink-3)", "middle");
      ["A: urg", "A: not"].forEach(function (l, r) { txt(c, g, x0 - 6, y0 + r * 25 + 16, l, "fill:var(--ink-3)", "end"); });
      cells.forEach(function (v, i) {
        var r = Math.floor(i / 2), cc = i % 2, agree = r === cc;
        c.el("rect", { x: x0 + cc * CW, y: y0 + r * 25, width: CW - 3, height: 22, rx: 3, style: "fill:" + c.mix(agree ? "var(--good)" : "var(--signal)", agree ? 30 : 18) + ";stroke:var(--ink-3);stroke-width:.8" }, g);
        txt(c, g, x0 + cc * CW + (CW - 3) / 2, y0 + r * 25 + 15, String(v), "fill:var(--ink);font-weight:700;" + MONO, "middle");
      });
      txt(c, g, x0 - 40, y0 + 70, "pₒ " + po + "  pₑ " + pe, "fill:var(--ink-2);" + MONO);
      txt(c, g, x0 - 40, y0 + 86, "κ = " + k, "fill:" + (parseFloat(k) >= 0.7 ? "var(--good)" : "var(--signal)") + ";font-weight:700;" + MONO);
    };
  }

  /* Generate-then-filter funnel beside the generator. */
  function funnel(svg, c) {
    var a = c.anchor("gen"), x0 = a[0] - 250, y0 = a[1] - 30, BW = 120;
    var g = c.el("g", { class: "funnel" }, svg);
    panel(c, g, x0 - 64, y0 - 22, BW + 120, 4 * 20 + 30);
    txt(c, g, x0 - 54, y0 - 7, "generated → kept", "fill:var(--ink-2);font-weight:600");
    [["raw", 10000], ["valid", 9200], ["deduped", 5400], ["verified", 3100]].forEach(function (r, i) {
      var y = y0 + i * 20, w = BW * r[1] / 10000;
      txt(c, g, x0 - 6, y + 11, r[0], "fill:var(--ink-2)", "end");
      c.el("rect", { x: x0, y: y, width: w, height: 14, rx: 3, style: "fill:" + c.mix(i === 3 ? "var(--good)" : "var(--t4)", i === 3 ? 70 : 45) + ";stroke:var(--ink);stroke-width:1" }, g);
      txt(c, g, x0 + w + 6, y + 11, r[1].toLocaleString("en-US"), "fill:var(--ink);" + MONO);
    });
  }

  window.ATLAS_SCENES["data/overview"] = {
    unit: 34,
    metrics: [
      { id: "rows", label: "Rows in" },
      { id: "rej", label: "Rows rejected", tone: "signal" },
      { id: "scan", label: "Bytes scanned", tone: "accent" },
      { id: "kappa", label: "Label agreement", tone: "good" }
    ],
    legend: { data: "rows", miss: "bad rows", req: "labels", res: "synthetic rows" },
    nodes: {
      appdb: at(0, -3.9,   { type: "cyl", r: 0.8, h: 1.2, color: "t1", label: "App DB", sub: "tickets" }),
      logs:  at(0, 0,      { type: "stack", w: 1.5, d: 1.1, n: 4, color: "t2", label: "Event logs" }),
      ext:   at(0, 3.6,    { type: "block", w: 1.4, d: 1.4, h: 0.9, color: "t5", label: "Billing API", sub: "3rd party", icon: "⇄" }),
      etl:   at(3.2, 0,    { type: "block", w: 1.6, d: 1.6, h: 1.1, color: "t3", label: "ETL job", icon: "⚙" }),
      val:   at(6.2, 0,    { type: "block", w: 1.4, d: 1.4, h: 0.8, color: "accent", label: "Validation", icon: "✓" }),
      quar:  at(3.2, -3.8, { type: "stack", w: 1.4, d: 1.0, n: 3, color: "signal", label: "Quarantine" }),
      wh:    at(9.2, 0,    { type: "cyl", r: 0.95, h: 1.3, color: "t4", label: "Warehouse", sub: "Parquet" }),
      sql:   at(12.2, 0,   { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t1", label: "Training table", icon: "⋈" }),
      label: at(12.2, 5.0, { type: "block", w: 1.4, d: 1.4, h: 0.9, color: "t5", label: "Annotators", icon: "✎" }),
      gen:   at(10.2, 8.2, { type: "block", w: 1.4, d: 1.4, h: 0.9, color: "t4", label: "LLM generator", icon: "✦" }),
      ds:    at(7.6, 4.4,  { type: "stack", w: 1.7, d: 1.3, n: 5, color: "good", label: "Dataset v1.3" }),
      train: at(3.4, 4.4,  { type: "block", w: 1.8, d: 1.8, h: 1.3, color: "t3", label: "Training run", icon: "▦" })
    },
    steps: [
      { title: "The data is scattered", tag: "Problem", add: ["appdb", "logs", "ext"],
        badges: { appdb: "120,000 tickets", logs: "300M events", ext: "38,000 accounts" },
        text: "<p>You want to train a model that flags <b>urgent support tickets</b>. The raw material exists, but in three places:</p><ul><li>ticket text in your <b>app database</b></li><li>what each user did, in <b>event logs</b></li><li>plan and billing status from a <b>third-party API</b></li></ul><p>None of it is a dataset yet. A dataset is something you build, test and version like any other product.</p>",
        key: "Models are only as good as the data they learn from and get evaluated on.",
        metrics: { rows: "—", rej: "—", scan: "—", kappa: "—" } },

      { title: "Ingest with an ETL job", tag: "Idea", add: ["etl"], links: [["appdb", "etl", "data"], ["logs", "etl", "data"], ["ext", "etl", "data"]], focus: ["appdb", "logs", "ext", "etl"],
        text: "<p>A scheduled <b>ETL job</b> extracts from all three sources every night, transforms the records into one schema and loads them.</p><p>It must be <b>idempotent</b>: it upserts by <code>ticket_id</code>, so a retry at 3 a.m. can't double the rows.</p><p>The raw event export alone is a <b>120 GB CSV</b>, and every question about it reads the whole file.</p>",
        flows: [["appdb", "etl", "data", { label: "tickets" }], ["logs", "etl", "data", { delay: 0.3 }], ["ext", "etl", "data", { label: "GET /accounts", delay: 0.6 }]],
        metrics: { rows: "120,000", scan: "120 GB" },
        note: "Pass the run date into the job instead of using \"now\", so you can backfill any past day safely.",
        changed: ["+ Nightly ETL, upsert by ticket_id", "+ 120,000 ticket rows in"] },

      { title: "Validation catches bad rows", tag: "Problem", add: ["val", "quar"], links: [["etl", "val", "data"], ["val", "quar", "miss", { dashed: true }]], focus: ["etl", "val", "quar"],
        badges: { quar: "7,750 rows", val: "3 checks" },
        text: "<p>Before anything expensive runs, a <b>validation</b> step checks every batch:</p><ul><li><b>2,400</b> tickets have null text: rejected</li><li><b>5,350</b> are duplicate ids from an old retry bug: rejected</li><li><b>1,250</b> have <code>reply_mins = −1</code>, a sentinel from a buggy logger: set to NULL with a flag column, kept</li></ul><p>Bad rows go to <b>quarantine</b>, not silently into training.</p>",
        flows: [["etl", "val", "data", { count: 3 }], ["etl", "val", "miss", { label: "−1 sentinel", delay: 0.5, lift: -25 }], ["val", "quar", "miss", { label: "null text", delay: 0.8, lift: -30 }], ["val", "quar", "miss", { label: "duplicate id", delay: 1.4, lift: 50 }]],
        metrics: { rej: "7,750" },
        key: "Treat a sentinel like −1 as missing, not as a real number. Averaging it in quietly skews every statistic.",
        changed: ["- 2,400 null text", "- 5,350 duplicates", "~ 1,250 sentinels → NULL + flag", "+ 112,250 clean rows"] },

      { title: "Land it as Parquet", tag: "Solution", add: ["wh"], links: [["val", "wh", "data"]], focus: ["val", "wh"],
        badges: { wh: "300M × 50 cols" },
        text: "<p>Clean rows land in the <b>warehouse</b> as <b>Parquet</b>: columnar, compressed and with min/max stats per row group.</p><p>Most questions touch a few columns. Reading 3 of the 50 event columns, at about 3× compression, scans <b>2.4 GB</b> instead of the 120 GB a CSV forces you to read.</p>",
        flows: [["val", "wh", "data", { label: "112,250 clean", count: 3, lift: 150 }]],
        metrics: { scan: "2.4 GB" },
        note: "Filter on a sorted date column too and Parquet skips whole row groups, so the two savings multiply.",
        changed: ["~ Bytes scanned 120 GB → 2.4 GB (−98%)"],
        draw: scanBars },

      { title: "SQL joins build the training table", tag: "Idea", add: ["sql"], links: [["wh", "sql", "data"]], focus: ["wh", "sql"],
        badges: { sql: "112,250 × 14" },
        text: "<p>One SQL query turns three sources into one row per ticket:</p><p><code>tickets LEFT JOIN accounts USING (account_id)</code>, plus a count of each user's events in the 24 hours before the ticket.</p><p>Check the row count before and after. It must still be 112,250. A join on a non-unique key would quietly multiply rows and double-count.</p>",
        flows: [["wh", "sql", "data", { label: "LEFT JOIN accounts", lift: 150 }], ["sql", "wh", "data", { delay: 0.8, lift: 10 }]],
        key: "Joins multiply rows on non-unique keys. Count before and after every join.",
        changed: ["+ Training table: 112,250 rows × 14 columns", "~ Row count unchanged by the join"] },

      { title: "Labels that people disagree on", tag: "Problem", add: ["label"], links: [["sql", "label", "req"]], focus: ["sql", "label"],
        badges: { label: "pilot: 100 × 2" },
        text: "<p>The table has features but no answer column. Two annotators label a <b>pilot</b> of 100 tickets as urgent or not.</p><p>They agree on 72, which sounds fine. But by chance alone they'd agree on about 51. <b>Cohen's kappa</b> corrects for that: <code>κ = (0.72 − 0.51) / (1 − 0.51) ≈ 0.43</code>. That's moderate at best, too noisy for ground truth.</p>",
        flows: [["sql", "label", "req", { label: "100-ticket pilot", lift: -100 }]],
        metrics: { kappa: "κ 0.43" },
        note: "Low agreement usually means the guideline is unclear, not that the annotators are careless.",
        draw: kappaTable([30, 14, 14, 42], "0.72", "0.51", "0.43") },

      { title: "Fix the guideline, then scale", tag: "Solution", focus: ["sql", "label"],
        badges: { label: "8,000 labeled" },
        text: "<p>The disagreements cluster on outage reports from free-plan users. You rewrite the guideline with a definition and three edge-case examples, then re-pilot.</p><p>Now they agree on 85 with chance at 50: <code>κ = 0.70</code>, the usual bar for eval labels. You scale to <b>8,000</b> tickets with gold questions mixed in to catch drift.</p>",
        flows: [["sql", "label", "req", { count: 3 }], ["label", "sql", "req", { label: "κ 0.70", delay: 0.8, lift: -100 }]],
        metrics: { kappa: "κ 0.70" },
        changed: ["~ Kappa 0.43 → 0.70", "+ 8,000 labeled tickets"],
        draw: kappaTable([45, 10, 5, 40], "0.85", "0.50", "0.70") },

      { title: "Synthetic data fills a gap", tag: "Solution", add: ["gen"], links: [["label", "gen", "res", { dashed: true }]], focus: ["label", "gen"],
        text: "<p>Account-takeover tickets are rare: only 40 of the 8,000. The model can't learn them from so few.</p><p>You seed an <b>LLM generator</b> with 50 real examples, topics and personas, and generate 10,000 candidates. Then you filter hard: schema checks, near-duplicate removal, verification and a 200-item human spot check. About a third survive.</p>",
        flows: [["label", "gen", "res", { label: "50 seed examples", lift: -30 }]],
        note: "Tag synthetic rows and evaluate on real data only, or the model just learns the generator's style.",
        changed: ["+ 10,000 generated → 3,100 kept", "+ Synthetic rows tagged as synthetic"],
        draw: funnel },

      { title: "Freeze a versioned dataset", tag: "Solution", add: ["ds"], links: [["label", "ds", "req"], ["gen", "ds", "res"]], focus: ["label", "gen", "ds"],
        badges: { ds: "11,100 rows · md5 a71e…" },
        text: "<p>Real and synthetic rows are frozen together as <b>dataset v1.3</b>: 8,000 real plus 3,100 synthetic.</p><p>The bytes go to object storage. Git only gets a small DVC pointer file holding the content hash <code>a71e…</code>, tagged <code>data-v1.3</code>. Nothing ever overwrites <code>latest.jsonl</code> in place.</p>",
        flows: [["label", "ds", "req", { label: "8,000 real" }], ["gen", "ds", "res", { label: "3,100 synthetic", delay: 0.5, lift: -20 }]],
        key: "If you can't say exactly which data trained a model, you can't reproduce it or roll it back.",
        changed: ["+ Dataset v1.3 = 8,000 real + 3,100 synthetic", "+ Content hash a71e… in git"] },

      { title: "Training reads a pinned version", tag: "Solution", add: ["train"], links: [["ds", "train", "data"]], focus: ["ds", "train"],
        badges: { train: "model 7" },
        text: "<p>The <b>training run</b> reads dataset v1.3 by its hash and records <code>data=a71e…</code> next to the model.</p><p>When model 8 looks worse next month, you can answer \"what changed?\" exactly: diff the two dataset versions, or check out v1.3 and retrain the old model byte for byte.</p>",
        flows: [["ds", "train", "data", { label: "data=a71e…", count: 3 }]],
        changed: ["+ Training run pinned to dataset hash", "+ Model 7 traceable to its data"] },

      { title: "A dataset is a product", tag: "Recap",
        text: "<p>Every stage made the data more trustworthy:</p><ul><li><b>Pipelines</b>: scheduled, idempotent ETL</li><li><b>Cleaning</b>: validate, quarantine, fix sentinels</li><li><b>Storage</b>: Parquet, so queries read 2% of the bytes</li><li><b>SQL</b>: joins with checked row counts</li><li><b>Labels</b>: guidelines measured by kappa</li><li><b>Synthetic + versioning</b>: filtered extras, frozen by hash</li></ul><p>The lessons in this area take each stage in turn.</p>",
        flows: [["appdb", "etl", "data", { count: 1 }], ["logs", "etl", "data", { count: 1 }], ["ext", "etl", "data", { count: 1 }], ["etl", "val", "data", { count: 1 }], ["val", "quar", "miss", { count: 1 }], ["val", "wh", "data", { count: 1 }], ["wh", "sql", "data", { count: 1 }], ["sql", "label", "req", { count: 1 }], ["label", "ds", "req", { count: 1 }], ["gen", "ds", "res", { count: 1 }], ["ds", "train", "data", { count: 1 }]] }
    ],
    learn: [
      "How an idempotent ETL job pulls data from apps, logs and APIs",
      "How validation catches nulls, sentinels and duplicates",
      "Why Parquet scans a fraction of the bytes a CSV does",
      "How to join tables without multiplying rows",
      "How kappa measures whether labels can be trusted",
      "How synthetic data and dataset versions fit in"
    ]
  };
})();
