/* Flagship scene: "predicting which subscribers will churn, and what to do about it" (plays on the ML overview).
   Illustrative but internally consistent numbers for a subscription app:
   50,000 active subscribers, 4.0% monthly churn = 2,000 cancellations a month.
   The retention team can contact 5,000 people a month (the top 10% of scores).
   Precision in that list: random 4% (200 churners), SQL rule 17% (850), model 26% (1,300). Lift = 26 / 4 = 6.5.
   Training table: 12 monthly snapshots x 50,000 = 600,000 rows, about 24,000 churn labels.
   Holdout: 20% of the 5,000 flagged (1,000) are not contacted. Holdout churn 26%, contacted 19%.
   Saves = 4,000 x (0.26 - 0.19) = 280 a month, so monthly churn 2,000 -> 1,720 (3.4%). */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  "use strict";

  function txt(ctx, g, x, y, s, o) {
    o = o || {};
    var t = ctx.el("text", { x: x, y: y, "font-size": o.size || 11, "text-anchor": o.anchor || "start", "font-weight": o.bold ? 700 : 500, style: "fill:" + (o.color || "var(--ink)") + ";font-family:var(--font-mono)" }, g);
    t.textContent = s; return t;
  }
  function card(ctx, svg, x, y, w, h, title) {
    var g = ctx.el("g", { class: "ml-card" }, svg);
    ctx.el("rect", { x: x, y: y, width: w, height: h, rx: 10, style: "fill:var(--surface);stroke:var(--ink);stroke-width:1.4" }, g);
    if (title) txt(ctx, g, x + 12, y + 19, title, { size: 10, bold: true, color: "var(--ink-2)" });
    return g;
  }

  /* Precision in the top 5,000: random vs rule vs model */
  function precisionBars(svg, ctx) {
    var a = ctx.anchor("evalm"), W = 230, H = 128, x0 = a[0] + 80, y0 = a[1] - 40;
    var g = card(ctx, svg, x0, y0, W, H, "CHURNERS IN THE TOP 5,000");
    var rows = [["random", 4, 200, "var(--ink-3)"], ["SQL rule", 17, 850, "var(--signal)"], ["model", 26, 1300, "var(--good)"]];
    var bx = x0 + 78, bw = W - 150;
    rows.forEach(function (r, i) {
      var y = y0 + 42 + i * 26;
      txt(ctx, g, bx - 8, y + 4, r[0], { size: 10, anchor: "end", color: "var(--ink-2)", bold: i === 2 });
      ctx.el("rect", { x: bx, y: y - 6, width: Math.max(3, bw * r[1] / 26), height: 12, rx: 3, style: "fill:" + r[3] + ";opacity:.85" }, g);
      txt(ctx, g, bx + bw * r[1] / 26 + 5, y + 4, r[1] + "% · " + r[2].toLocaleString("en-US"), { size: 9.5, color: "var(--ink)" });
    });
  }

  /* Reasons for one flagged subscriber (log-odds contributions, example) */
  function reasons(svg, ctx) {
    var a = ctx.anchor("why"), W = 236, H = 132, x0 = a[0] + 70, y0 = a[1] - 150;
    var g = card(ctx, svg, x0, y0, W, H, "WHY #48213 SCORES 0.93");
    var rows = [["payment failed", 1.47], ["tickets_90d = 3", 0.90], ["sessions_30d = 6", 0.64], ["tenure = 4 mo", 0.56], ["monthly plan", 0.42]];
    var bx = x0 + 124, bw = 70;
    rows.forEach(function (r, i) {
      var y = y0 + 38 + i * 18;
      txt(ctx, g, bx - 6, y + 4, r[0], { size: 9.5, anchor: "end", color: i === 0 ? "var(--signal)" : "var(--ink-2)", bold: i === 0 });
      ctx.el("rect", { x: bx, y: y - 5, width: bw * r[1] / 1.47, height: 10, rx: 3, style: "fill:var(--signal);opacity:" + (i === 0 ? 0.9 : 0.55) }, g);
      txt(ctx, g, bx + bw * r[1] / 1.47 + 4, y + 4, "+" + r[1].toFixed(2), { size: 9, color: "var(--ink-2)" });
    });
  }

  /* Holdout comparison: contacted vs not contacted */
  function holdout(svg, ctx) {
    var a = ctx.anchor("hold"), W = 226, H = 112, x0 = a[0] + 70, y0 = a[1] - 30;
    var g = card(ctx, svg, x0, y0, W, H, "30-DAY CHURN AMONG FLAGGED");
    var rows = [["contacted 4,000", 19, "var(--good)"], ["holdout 1,000", 26, "var(--signal)"]];
    var bx = x0 + 112, bw = 70;
    rows.forEach(function (r, i) {
      var y = y0 + 44 + i * 24;
      txt(ctx, g, bx - 6, y + 4, r[0], { size: 9.5, anchor: "end", color: "var(--ink-2)" });
      ctx.el("rect", { x: bx, y: y - 6, width: bw * r[1] / 26, height: 12, rx: 3, style: "fill:" + r[2] + ";opacity:.85" }, g);
      txt(ctx, g, bx + bw * r[1] / 26 + 5, y + 4, r[1] + "%", { size: 10, bold: true });
    });
    txt(ctx, g, x0 + 12, y0 + H - 12, "7 pts × 4,000 = 280 saves", { size: 10, bold: true, color: "var(--good)" });
  }

  window.ATLAS_SCENES["ml/overview"] = {
    unit: 34,
    metrics: [
      { id: "churn", label: "Monthly churn", tone: "signal" },
      { id: "prec", label: "Top-5,000 precision", tone: "accent" },
      { id: "reached", label: "Churners reached" },
      { id: "saves", label: "Saves / month", tone: "good" }
    ],
    legend: { data: "rows / features", req: "scores", res: "result", miss: "cancellation", grad: "retrain" },
    nodes: {
      db:    { type: "cyl",   x: 0,    y: 0,    r: 0.95, h: 1.4, color: "t4", label: "Warehouse", sub: "50,000 subs" },
      brief: { type: "block", x: 0,    y: -3.4, w: 1.4, d: 1.4, h: 0.8, color: "accent", label: "Brief", icon: "?" },
      rule:  { type: "block", x: 3.8,  y: -3.4, w: 1.6, d: 1.6, h: 0.9, color: "signal", label: "SQL rule", sub: "baseline" },
      snap:  { type: "stack", x: 3.8,  y: 0.4,  w: 1.8, d: 1.4, n: 5, color: "t5", label: "Snapshots", sub: "600k rows" },
      model: { type: "block", x: 7.4,  y: 0.4,  w: 2,   d: 2,   h: 1.6, color: "t3", label: "Churn model", icon: "▲" },
      evalm: { type: "stack", x: 7.4,  y: 4.2,  w: 1.6, d: 1.2, n: 2, color: "t2", label: "Test month", sub: "Dec" },
      why:   { type: "block", x: 7.4,  y: -3.4, w: 1.5, d: 1.5, h: 0.8, color: "t2", label: "Reasons", sub: "per subscriber" },
      crm:   { type: "block", x: 11,   y: 0.4,  w: 1.8, d: 1.8, h: 1.0, color: "t1", label: "CRM list", sub: "top 5,000" },
      team:  { type: "block", x: 14.4, y: 0.4,  w: 1.6, d: 1.6, h: 1.2, color: "good", label: "Retention team", icon: "☎" },
      hold:  { type: "block", x: 11,   y: 4.2,  w: 1.5, d: 1.5, h: 0.7, color: "signal", label: "Holdout", sub: "20% not called" }
    },
    steps: [
      { title: "2,000 cancellations a month", tag: "Problem", add: ["db"], badges: { db: "4.0% churn / mo" },
        text: "<p>A subscription app has <b>50,000 active subscribers</b> and loses about <b>4% a month</b>: 2,000 cancellations. The retention team has budget to contact <b>5,000 people</b> a month.</p><p>Contacting 5,000 at random reaches about 200 people who were going to cancel. The ask: \"tell us who to call\".</p>",
        key: "Before anything else, write down the decision: who gets contacted, by whom, and how often.",
        metrics: { churn: "4.0%", prec: "4%", reached: "200", saves: "—" } },

      { title: "Is this an ML problem?", tag: "Idea", add: ["brief"], focus: ["brief", "db"],
        links: [["brief", "db", "req", { dashed: true }]],
        badges: { brief: "4 checks" },
        text: "<p>Run the four checks from this area:</p><ul><li>A <b>score per subscriber</b>, refreshed every month? Yes.</li><li>Someone <b>acts</b> on it? Yes, the retention team.</li><li><b>Enough labels</b>? About 24,000 past cancellations.</li><li>Does a <b>simple rule</b> already do the job? Not measured yet.</li></ul><p>That last unknown comes first.</p>",
        note: "\"Why did churn rise in March?\" would be a different job: analysis, not prediction.",
        changed: ["+ Brief: decision, owner, cadence"] },

      { title: "Measure a rule first", tag: "Solution", add: ["rule"], focus: ["rule", "db"],
        links: [["db", "rule", "data"]],
        flows: [["db", "rule", "data", { label: "failed payment OR 0 sessions in 14d" }]],
        badges: { rule: "17% precision" },
        text: "<p>Write the team's instinct as SQL: flag anyone with a <b>failed payment</b> or <b>no sessions in 14 days</b>, then rank and take 5,000. On last month's data, <b>17%</b> of them cancelled.</p><p>That's 850 churners reached instead of 200. The rule ships this week and becomes the <b>baseline</b> any model must beat.</p>",
        key: "A measured rule is the cheapest model you'll ever build, and often the last one you need.",
        metrics: { prec: "17%", reached: "850" },
        changed: ["+ Rule baseline: 17% precision", "~ Churners reached 200 → 850"] },

      { title: "Build a point-in-time table", tag: "Idea", add: ["snap"], focus: ["snap", "db"],
        links: [["db", "snap", "data"]],
        flows: [["db", "snap", "data", { label: "12 month-end snapshots", count: 3 }]],
        badges: { snap: "24,000 churn labels" },
        text: "<p>One row per subscriber per month-end: <b>12 snapshots × 50,000 = 600,000 rows</b>. Features look back from the snapshot (sessions in 30 days, tickets in 90 days, tenure, plan, failed payment). The label looks forward: did they cancel in the next 30 days?</p>",
        key: "Every feature must be computable on the snapshot date. Anything measured later leaks the answer.",
        note: "Build it in SQL with a date filter on every event join, then load it into pandas." },

      { title: "Train on the past", tag: "Idea", add: ["model"], focus: ["snap", "model"],
        links: [["snap", "model", "data"]],
        flows: [["snap", "model", "data", { label: "fit: Jan–Sep", count: 3 }]],
        badges: { model: "logistic → boosted trees" },
        text: "<p>Split <b>by time</b>: train on January to September, tune on October and November, and keep December sealed as the test month.</p><p>Fit a <b>logistic regression</b> first as the simple model, then gradient-boosted trees. Keep the trees only if they beat logistic regression on later months.</p>",
        note: "A random split would put one subscriber's May and June rows on both sides and flatter the score." },

      { title: "Test on a month it never saw", tag: "Solution", add: ["evalm"], focus: ["model", "evalm", "rule"],
        links: [["evalm", "model", "req", { dashed: true }]],
        flows: [["evalm", "model", "req", { label: "score Dec, once" }], ["model", "evalm", "res", { label: "26% in top 5,000", delay: 0.8 }]],
        draw: precisionBars,
        badges: { evalm: "ROC-AUC 0.81" },
        text: "<p>On December, the model's top 5,000 hold <b>1,300 churners: 26% precision</b>, against 17% for the rule and 4% at random. That's a top-decile <b>lift of 6.5</b>.</p><p>ROC-AUC is 0.81, but the team cares about the list they'll actually call, so precision at 5,000 is the headline.</p>",
        key: "Always show the model next to random and the current rule, at the operating point you'll use.",
        metrics: { prec: "26%", reached: "1,300" },
        changed: ["~ Precision 17% → 26%", "~ Churners reached 850 → 1,300"] },

      { title: "A score alone is hard to act on", tag: "Problem", add: ["why"], focus: ["why", "model"],
        links: [["model", "why", "res"]],
        flows: [["model", "why", "res", { label: "contributions" }]],
        draw: reasons,
        text: "<p>An agent sees <code>#48213 · 0.93</code>. What should they say? Per-subscriber <b>contributions</b> (SHAP-style) split the score into reasons: here a <b>failed payment</b> and three support tickets.</p><p>So the agent fixes the card and follows up on the tickets instead of offering a generic discount.</p>",
        note: "Reasons describe how the model scores, not what causes churn. Whether an action helps is the next step's question.",
        changed: ["+ Top 3 reasons per subscriber"] },

      { title: "Put the list where work happens", tag: "Solution", add: ["crm", "team"], focus: ["model", "crm", "team", "why"],
        links: [["model", "crm", "req"], ["why", "crm", "res", { dashed: true }], ["crm", "team", "req"]],
        flows: [["model", "crm", "req", { label: "top 5,000 + reasons" }], ["crm", "team", "req", { delay: 0.7, count: 3 }]],
        badges: { crm: "refreshed monthly", team: "5,000 contacts" },
        text: "<p>Each month-end, a scheduled job scores all 50,000 subscribers and writes the <b>top 5,000 with their reasons</b> into the CRM. The retention team works the list in score order.</p>",
        key: "A model only creates value when its output lands in a tool someone already uses." },

      { title: "Did the calls change anything?", tag: "Problem", add: ["hold"], focus: ["crm", "hold", "team"],
        links: [["crm", "hold", "data", { dashed: true }]],
        flows: [["crm", "hold", "data", { label: "random 20%: no call" }]],
        draw: holdout,
        badges: { hold: "1,000 people" },
        text: "<p>Catching churners is not the same as saving them. To measure the effect, <b>randomly hold out 20%</b> of the flagged list: 1,000 people get no call.</p><p>After 30 days, <b>26%</b> of the holdout cancelled against <b>19%</b> of the 4,000 contacted. The 7-point gap is the effect of the outreach.</p>",
        key: "Prediction finds who is at risk; only an experiment tells you whether your action helps.",
        metrics: { saves: "280" },
        changed: ["+ Randomized holdout", "+ 4,000 × 7 pts = 280 saves a month"] },

      { title: "Keep it honest over time", tag: "Solution", focus: ["db", "snap", "model", "hold"],
        links: [["hold", "snap", "grad", { dashed: true, lift: 50 }]],
        flows: [["hold", "snap", "grad", { label: "clean labels", lift: 50 }], ["snap", "model", "grad", { label: "monthly retrain", delay: 0.8 }]],
        text: "<p>Churn drops from 2,000 to about <b>1,720 a month</b>. Now the model is a product: retrain monthly, monitor input columns and precision at 5,000, and alert when they drift.</p><p>The holdout also protects the labels. Once everyone at risk is called, churn in the contacted group no longer shows natural behaviour; the holdout still does.</p>",
        metrics: { churn: "3.4%" },
        changed: ["~ Monthly churn 4.0% → 3.4%", "+ Monitoring and monthly retrain"] },

      { title: "From question to saves", tag: "Recap",
        flows: [["db", "snap", "data", { count: 1 }], ["snap", "model", "data", { count: 1, delay: 0.3 }], ["model", "crm", "req", { count: 1, delay: 0.6 }], ["crm", "team", "req", { count: 1, delay: 0.9 }], ["crm", "hold", "data", { count: 1, delay: 1.2 }]],
        text: "<p>The analyst's ML loop, end to end:</p><ul><li><b>Frame</b>: per-row, repeated, someone acts.</li><li><b>Baseline</b>: measure a SQL rule first.</li><li><b>Build</b> point-in-time features; split by time.</li><li><b>Evaluate</b> at the operating point, against the rule.</li><li><b>Explain</b> each score so people can act.</li><li><b>Test the action</b> with a holdout.</li></ul><p>The lessons in this area take each step in turn.</p>",
        key: "The goal was never a model with a high AUC. It was fewer cancellations, measured honestly." }
    ],
    learn: [
      "How to tell a prediction problem from an analysis question",
      "Why a measured rule is the first baseline",
      "How to build a point-in-time training table and split by time",
      "How to judge a churn model by precision at the list size you'll use",
      "How per-subscriber reasons make scores actionable",
      "Why a holdout is the only way to know the outreach works"
    ]
  };
})();
