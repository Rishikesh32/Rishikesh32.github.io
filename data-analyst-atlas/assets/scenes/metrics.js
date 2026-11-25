/* Flagship scene: "sign-ups are up but revenue is flat: find out why" (plays on the Business metrics overview).
   Example app from the page: a habit-tracking subscription at $15 / month, about 3,200 paying subscribers.
   All numbers are illustrative but consistent:
   last month   1,600 sign-ups x 10.0% = 160 new paying; MRR 3,200 x $15 = $48,000
   this month   organic 1,600 x 10.0% = 160, promo 640 x 0.9% = 6  -> 166 new paying (7.4% of 2,240)
                3,200 - 146 cancellations + 166 = 3,220 subscribers -> MRR $48,300 (+0.6%)
   promo        $9,600 spend: $15 per sign-up, but $1,600 per paying customer
   LTV          $15 x 80% margin / 4.5% monthly churn ≈ $267, so LTV:CAC ≈ 0.17 and payback ≈ 133 months
   next month   organic 1,600 x 10% = 160 + retargeted promo 300 x 8% = 24 -> 184 new paying (9.7% of 1,900)
                3,220 - 145 + 184 = 3,259 subscribers -> MRR $48,885 */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  "use strict";

  function txt(ctx, g, x, y, s, o) {
    o = o || {};
    var t = ctx.el("text", { x: x, y: y, "font-size": o.size || 11, "text-anchor": o.anchor || "start", "font-weight": o.bold ? 700 : 500, style: "fill:" + (o.color || "var(--ink)") + ";font-family:var(--font-mono)" }, g);
    t.textContent = s; return t;
  }
  function card(ctx, svg, x, y, w, h, title) {
    var g = ctx.el("g", { class: "mt-card" }, svg);
    ctx.el("rect", { x: x, y: y, width: w, height: h, rx: 10, style: "fill:var(--surface);stroke:var(--ink);stroke-width:1.4" }, g);
    if (title) txt(ctx, g, x + 12, y + 19, title, { size: 10, bold: true, color: "var(--ink-2)" });
    return g;
  }

  /* Funnel split by channel: the blended rate hides two very different groups. */
  function channelSplit(svg, ctx) {
    var a = ctx.anchor("paid"), W = 250, H = 132, x0 = a[0] + 92, y0 = a[1] - 150;
    var g = card(ctx, svg, x0, y0, W, H, "SIGN-UP → PAID, BY CHANNEL");
    var rows = [["organic", "1,600", 10.0, "160", "var(--t2)"], ["promo", "640", 0.9, "6", "var(--signal)"], ["blended", "2,240", 7.4, "166", "var(--ink-3)"]];
    var bx = x0 + 74, bw = 96;
    rows.forEach(function (r, i) {
      var y = y0 + 44 + i * 28;
      txt(ctx, g, x0 + 12, y + 4, r[0], { size: 10, bold: i === 1, color: i === 1 ? "var(--signal)" : "var(--ink-2)" });
      ctx.el("rect", { x: bx, y: y - 6, width: bw, height: 12, rx: 3, style: "fill:var(--ink);opacity:.06" }, g);
      ctx.el("rect", { x: bx, y: y - 6, width: Math.max(2, bw * r[2] / 12), height: 12, rx: 3, style: "fill:" + r[4] + ";opacity:.9" }, g);
      txt(ctx, g, bx + bw + 8, y + 4, r[2].toFixed(1) + "%", { size: 10, bold: true, color: r[4] });
      txt(ctx, g, x0 + W - 10, y + 4, r[3] + "/" + r[1], { size: 9, anchor: "end", color: "var(--ink-3)" });
    });
  }

  /* Week-by-week share of each sign-up cohort still checking in. */
  function cohortCurves(svg, ctx) {
    var a = ctx.anchor("cohort"), W = 232, H = 140, x0 = a[0] + 86, y0 = a[1] - 40;
    var g = card(ctx, svg, x0, y0, W, H, "ACTIVE BY WEEK SINCE SIGN-UP");
    var px = x0 + 34, py = y0 + 30, pw = W - 56, ph = H - 62;
    function X(w) { return px + pw * w / 4; }
    function Y(v) { return py + ph * (100 - v) / 100; }
    ctx.el("line", { x1: px, x2: px + pw, y1: py + ph, y2: py + ph, style: "stroke:var(--ink-3);stroke-width:1" }, g);
    ctx.el("line", { x1: px, x2: px, y1: py, y2: py + ph, style: "stroke:var(--ink-3);stroke-width:1" }, g);
    txt(ctx, g, px - 4, Y(100) + 4, "100%", { size: 8.5, anchor: "end", color: "var(--ink-3)" });
    txt(ctx, g, px - 4, Y(0) + 3, "0", { size: 8.5, anchor: "end", color: "var(--ink-3)" });
    var org = [100, 58, 47, 42, 40], pro = [100, 19, 9, 6, 5];
    function path(v) { return v.map(function (p, i) { return (i ? "L" : "M") + X(i).toFixed(1) + "," + Y(p).toFixed(1); }).join(" "); }
    ctx.el("path", { d: path(org), style: "fill:none;stroke:var(--t2);stroke-width:2.2" }, g);
    ctx.el("path", { d: path(pro), style: "fill:none;stroke:var(--signal);stroke-width:2.2" }, g);
    txt(ctx, g, X(4), Y(40) - 6, "organic 40%", { size: 9, anchor: "end", bold: true, color: "var(--t2)" });
    txt(ctx, g, X(4), Y(5) - 6, "promo 5%", { size: 9, anchor: "end", bold: true, color: "var(--signal)" });
    for (var w = 0; w <= 4; w++) txt(ctx, g, X(w), py + ph + 13, "w" + w, { size: 8.5, anchor: "middle", color: "var(--ink-3)" });
  }

  /* The metric tree from revenue down to the channel that explains the gap. */
  function metricTree(svg, ctx) {
    var a = ctx.anchor("billing"), W = 300, H = 176, x0 = a[0] + 70, y0 = a[1] - 196;
    var g = card(ctx, svg, x0, y0, W, H, "METRIC TREE: WHERE DID THE GROWTH GO?");
    function box(x, y, w, label, val, hot) {
      ctx.el("rect", { x: x, y: y, width: w, height: 30, rx: 6, style: "fill:" + (hot ? "color-mix(in srgb, var(--signal) 16%, var(--surface))" : "var(--surface)") + ";stroke:" + (hot ? "var(--signal)" : "var(--ink-3)") + ";stroke-width:1.3" }, g);
      txt(ctx, g, x + w / 2, y + 12, label, { size: 8.5, anchor: "middle", color: "var(--ink-2)" });
      txt(ctx, g, x + w / 2, y + 25, val, { size: 9.5, anchor: "middle", bold: true, color: hot ? "var(--signal)" : "var(--ink)" });
    }
    function edge(x1, y1, x2, y2, hot) { ctx.el("path", { d: "M" + x1 + "," + y1 + " C" + x1 + "," + (y1 + 10) + " " + x2 + "," + (y2 - 10) + " " + x2 + "," + y2, style: "fill:none;stroke:" + (hot ? "var(--signal)" : "var(--ink-3)") + ";stroke-width:" + (hot ? 2 : 1.2) }, g); }
    var cx = x0 + W / 2;
    box(cx - 60, y0 + 28, 120, "MRR", "+0.6%", false);
    edge(cx - 30, y0 + 58, x0 + 70, y0 + 74, true); edge(cx + 30, y0 + 58, x0 + W - 70, y0 + 74, false);
    box(x0 + 14, y0 + 74, 112, "subscribers", "+20 net", true);
    box(x0 + W - 126, y0 + 74, 112, "ARPU", "$15 flat", false);
    edge(x0 + 50, y0 + 104, x0 + 50, y0 + 122, false); edge(x0 + 100, y0 + 104, x0 + 160, y0 + 122, true);
    box(x0 + 8, y0 + 122, 92, "cancellations", "146 (same)", false);
    box(x0 + 108, y0 + 122, 100, "new paying", "166 (+6)", true);
    edge(x0 + 158, y0 + 152, x0 + 262, y0 + 152, true);
    txt(ctx, g, x0 + 218, y0 + 140, "promo:", { size: 9, color: "var(--signal)", bold: true });
    txt(ctx, g, x0 + 218, y0 + 165, "+640 → +6", { size: 9, color: "var(--signal)", bold: true });
  }

  window.ATLAS_SCENES["metrics/overview"] = {
    unit: 34,
    metrics: [
      { id: "su", label: "Sign-ups / month", tone: "accent" },
      { id: "conv", label: "Sign-up → paid" },
      { id: "np", label: "New paying subs", tone: "good" },
      { id: "mrr", label: "MRR", tone: "signal" }
    ],
    legend: { req: "visitors / sign-ups", res: "paying customers", data: "query / data", miss: "lost / low intent" },
    nodes: {
      organic: { type: "block", x: 0, y: 0, w: 1.6, d: 1.6, h: 1, color: "t2", label: "Organic", icon: "◎" },
      promo: { type: "block", x: 0, y: 3.4, w: 1.6, d: 1.6, h: 1, color: "signal", label: "Promo campaign", icon: "%" },
      signup: { type: "block", x: 4, y: 1.6, w: 1.8, d: 1.8, h: 1.2, color: "t1", label: "Sign-ups", icon: "+" },
      paid: { type: "block", x: 8, y: 1.6, w: 1.8, d: 1.8, h: 1.4, color: "good", label: "Paid plan", sub: "$15/mo", icon: "$" },
      billing: { type: "cyl", x: 12.4, y: 2.5, r: 0.85, h: 1.3, color: "t4", label: "Billing", sub: "MRR" },
      dash: { type: "block", x: 6.6, y: -3, w: 1.8, d: 1.2, h: 0.9, color: "t5", label: "Dashboard" },
      wh: { type: "cyl", x: 6.2, y: 6.2, r: 0.8, h: 1.1, color: "t3", label: "Events table" },
      cohort: { type: "stack", x: 9.4, y: 5.4, w: 1.6, d: 1.2, n: 4, color: "t3", label: "Cohorts" },
      guard: { type: "slab", x: 7.4, y: 1.0, w: 3.0, d: 3.0, color: "good", label: "guardrails" }
    },
    steps: [
      { title: "Last month, a normal month", tag: "Problem", add: ["organic", "signup", "paid", "billing"],
        links: [["organic", "signup"], ["signup", "paid"], ["paid", "billing"]],
        text: "<p>Meet the example habit-tracking app from this area. About <b>1,600</b> people sign up each month, mostly from search and word of mouth. One in ten starts paying $15 a month.</p><p>That is 160 new paying subscribers, which roughly replaces the 145 who cancel. MRR (monthly recurring revenue) sits at <b>$48,000</b>.</p>",
        flows: [["organic", "signup", "req", { label: "1,600 sign-ups" }], ["signup", "paid", "res", { count: 1 }], ["paid", "billing", "res", { count: 1 }]],
        metrics: { su: "1,600", conv: "10.0%", np: "160", mrr: "$48,000" },
        note: "All numbers in this scene are illustrative, but they add up: 3,200 subscribers × $15 = $48,000." },
      { title: "A campaign lifts sign-ups 40%", tag: "Problem", add: ["promo", "dash"], links: [["promo", "signup"], ["signup", "dash", null, { dashed: true }]],
        focus: ["promo", "signup", "dash"], badges: { dash: "+40%" },
        text: "<p>Marketing launches a promo campaign on social ads, with a free month for anyone who signs up. Sign-ups jump to <b>2,240</b>.</p><p>The dashboard tile turns green and the campaign gets celebrated in the weekly meeting.</p>",
        flows: [["organic", "signup", "req"], ["promo", "signup", "req", { count: 3, label: "+640 sign-ups" }], ["signup", "dash", "data", { count: 1 }]],
        metrics: { su: "2,240" },
        changed: ["+ Promo campaign: 640 extra sign-ups", "~ Sign-ups 1,600 → 2,240"] },
      { title: "But revenue did not move", tag: "Problem", focus: ["paid", "billing", "dash"], badges: { billing: "+0.6%" },
        text: "<p>At month end, finance reports MRR of <b>$48,300</b>. That is 20 more subscribers than last month, not the 64 extra you would expect if the new sign-ups behaved like the old ones.</p><p>Somewhere between the sign-up and the bill, the growth disappeared. Your job is to find where.</p>",
        flows: [["signup", "paid", "res", { count: 1 }], ["paid", "billing", "res", { count: 1, label: "166 new paying" }]],
        metrics: { np: "166", mrr: "$48,300" },
        key: "A metric that goes up while the outcome it was supposed to drive stays flat is a question, not a win." },
      { title: "First, check the definition", tag: "Idea", add: ["wh"], links: [["wh", "signup", "data", { dashed: true }]], focus: ["wh", "signup"], badges: { wh: "defn ✓" },
        text: "<p>Before you hunt for a business cause, rule out a measurement one. You query the events table and confirm that a sign-up still means <code>one verified account</code>, excluding staff and test accounts, deduplicated by email.</p><p>The definition is unchanged and the tracking works. The 2,240 are real people.</p>",
        flows: [["signup", "wh", "data", { label: "COUNT(DISTINCT user_id)" }], ["wh", "signup", "data", { count: 1 }]],
        note: "A surprising number of \"growth spurts\" turn out to be a tracking change, a bot wave or a new definition. Checking takes ten minutes." },
      { title: "Read it as a funnel", tag: "Idea", focus: ["signup", "paid"], badges: { paid: "7.4%" },
        text: "<p>Lay the steps out as a funnel. The share of sign-ups that become paying dropped from <b>10.0%</b> to <b>7.4%</b> (166 of 2,240).</p><p>So the top of the funnel grew, but the next step got much worse. Did the product get worse at converting people, or did different people arrive?</p>",
        flows: [["signup", "paid", "res", { count: 2, label: "166 / 2,240" }], ["signup", "paid", "miss", { count: 2, delay: 0.5, lift: 70 }]],
        metrics: { conv: "7.4%" },
        changed: ["~ Sign-up → paid 10.0% → 7.4%"] },
      { title: "Split the funnel by channel", tag: "Idea", focus: ["organic", "promo", "signup", "paid"], badges: { organic: "10.0%", promo: "0.9%" },
        text: "<p>Segment by acquisition channel and the mystery clears. Organic sign-ups still convert at <b>10%</b>: 160 paying, exactly as before. The 640 promo sign-ups produced just <b>6</b> paying customers, <b>0.9%</b>.</p><p>Nothing broke. The <b>mix</b> changed: a big, low-intent group dragged the blended rate down.</p>",
        flows: [["organic", "signup", "req", { count: 1 }], ["promo", "signup", "miss", { count: 3 }], ["signup", "paid", "res", { count: 1 }]],
        draw: channelSplit,
        key: "A blended rate can fall while every segment stays the same. Always split a surprising rate by its main segments.",
        changed: ["+ Organic 160 / 1,600 = 10.0%", "+ Promo 6 / 640 = 0.9%"] },
      { title: "Cohorts show low intent", tag: "Idea", add: ["cohort"], links: [["wh", "cohort", "data"]], focus: ["cohort", "wh", "promo"],
        text: "<p>Build weekly cohorts by sign-up channel and track who still checks in. By week 4, about <b>40%</b> of organic sign-ups are active, against <b>5%</b> of promo sign-ups.</p><p>Most promo users took the free month, never formed the habit and left. The free offer attracted people who wanted free, not people who wanted the app.</p>",
        flows: [["wh", "cohort", "data", { label: "GROUP BY channel, week" }]],
        draw: cohortCurves },
      { title: "Price the channel", tag: "Idea", focus: ["promo", "paid", "billing"], badges: { promo: "CAC $1,600" },
        text: "<p>The campaign cost <b>$9,600</b> (example). Per sign-up that is $15, which looked cheap. Per paying customer it is <b>$1,600</b>.</p><p>A subscriber is worth about $15 × 80% margin ÷ 4.5% monthly churn ≈ <b>$267</b> in gross profit. LTV:CAC is about <b>0.17</b>, and payback would take over 11 years.</p>",
        flows: [["promo", "paid", "miss", { count: 2, lift: 60, label: "$9,600 → 6 subs" }]],
        key: "Measure acquisition cost per paying customer, not per sign-up. Cheap sign-ups that never pay are expensive.",
        changed: ["~ Cost per sign-up $15", "~ CAC per paying customer $1,600", "~ LTV ≈ $267, LTV:CAC ≈ 0.17"] },
      { title: "Walk the metric tree", tag: "Solution", focus: ["billing", "paid", "signup", "promo"],
        text: "<p>Put it together as a metric tree. MRR = subscribers × ARPU. ARPU did not move. Subscribers = last month − cancellations + new paying. Cancellations were normal. New paying = sign-ups × conversion, by channel.</p><p>Every branch is flat except one: the promo channel added 640 sign-ups and 6 customers. That is your one-line answer.</p>",
        flows: [["billing", "paid", "data", { count: 1, lift: 50 }], ["paid", "signup", "data", { count: 1, lift: 50 }], ["signup", "promo", "data", { count: 1, label: "root cause" }]],
        draw: metricTree },
      { title: "Fix the goal, add guardrails", tag: "Solution", add: ["guard"], focus: ["guard", "paid", "promo", "dash"], badges: { dash: "paid subs", promo: "retargeted" },
        text: "<p>The campaign did what it was paid to do: it maximised sign-ups. So change the target. Marketing now optimises <b>new paying subscribers</b>, with two guardrails on the dashboard:</p><ul><li>sign-up → paid stays at or above <b>9%</b></li><li>CAC payback stays under <b>12 months</b></li></ul><p>The free month is dropped and the ads target lookalikes of paying users.</p>",
        flows: [["promo", "signup", "req", { count: 1 }], ["signup", "paid", "res", { count: 2 }], ["paid", "dash", "data", { count: 1, label: "guardrails OK" }]],
        changed: ["~ Target: sign-ups → new paying subs", "+ Guardrail: conversion ≥ 9%", "+ Guardrail: payback ≤ 12 months"] },
      { title: "Next month: smaller, better", tag: "Solution", focus: ["organic", "promo", "signup", "paid", "billing"], badges: { promo: "8.0%", paid: "9.7%", billing: "+1.2%" },
        text: "<p>Sign-ups fall to <b>1,900</b>, which would have looked like a bad month on the old dashboard. But the retargeted campaign's 300 sign-ups convert at 8%, adding 24 customers.</p><p>New paying subscribers reach <b>184</b> and MRR grows to <b>$48,885</b>. Fewer sign-ups, more revenue.</p>",
        flows: [["organic", "signup", "req", { count: 1 }], ["promo", "signup", "req", { count: 1 }], ["signup", "paid", "res", { count: 2 }], ["paid", "billing", "res", { count: 2, label: "184 new paying" }]],
        metrics: { su: "1,900", conv: "9.7%", np: "184", mrr: "$48,885" },
        changed: ["~ Sign-ups 2,240 → 1,900", "~ Conversion 7.4% → 9.7%", "~ MRR $48,300 → $48,885"] },
      { title: "The analyst's path", tag: "Recap", focus: [],
        text: "<p>You went from a confusing headline to a specific cause in a fixed order. Each lesson in this area is one of these moves:</p><ul><li><b>Define</b>: is the metric measuring what you think?</li><li><b>Funnel</b>: which step changed?</li><li><b>Cohorts</b>: do the new users stay?</li><li><b>Unit economics</b>: does each customer pay back?</li><li><b>North star and guardrails</b>: what should the team optimise?</li><li><b>Metric tree</b>: which branch explains the change?</li></ul>",
        flows: [["organic", "signup", "req", { count: 1 }], ["promo", "signup", "req", { count: 1 }], ["signup", "paid", "res", { count: 1 }], ["paid", "billing", "res", { count: 1 }]] }
    ],
    learn: [
      "Why a vanity metric can rise while revenue stays flat",
      "How to rule out a definition or tracking change first",
      "How a channel mix shift drags down a blended conversion rate",
      "How cohorts and CAC per paying customer expose low-intent growth",
      "How a metric tree and guardrails turn a headline into a fix"
    ]
  };
})();
