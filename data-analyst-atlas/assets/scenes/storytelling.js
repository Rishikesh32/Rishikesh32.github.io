/* Flagship scene: a 40-slide analysis becomes a 3-minute decision (plays on the Communication & storytelling overview).
   Example: a meal-kit subscription app; monthly churn rose 6.1% -> 7.4%. Promo signups churn 14% in month 2 vs 6%
   at full price (2.3x), and promo share of signups rose 20% -> 45%. All numbers are illustrative. */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  "use strict";

  function txt(ctx, g, x, y, s, o) {
    o = o || {};
    var t = ctx.el("text", { x: x, y: y, "font-size": o.size || 11, "text-anchor": o.anchor || "start", "font-weight": o.bold ? 700 : 500, style: "fill:" + (o.color || "var(--ink)") + ";font-family:var(--font-mono)" }, g);
    t.textContent = s; return t;
  }
  function card(ctx, svg, x, y, w, h, title) {
    var g = ctx.el("g", { class: "st-card" }, svg);
    ctx.el("rect", { x: x, y: y, width: w, height: h, rx: 10, style: "fill:var(--surface);stroke:var(--ink);stroke-width:1.4" }, g);
    if (title) txt(ctx, g, x + 12, y + 19, title, { size: 10, bold: true, color: "var(--ink-2)" });
    return g;
  }

  /* Slide 31 of the deck: month-2 churn by offer, promo highlighted. */
  function finding(svg, ctx) {
    var a = ctx.anchor("deck"), W = 230, H = 118, x0 = a[0] - W - 70, y0 = a[1] + 10;
    var g = card(ctx, svg, x0, y0, W, H, "SLIDE 31 · MONTH-2 CHURN");
    var rows = [["Full price", 6.0, "var(--ink-3)"], ["Referral", 7.1, "var(--ink-3)"], ["30% off", 8.9, "var(--ink-3)"], ["60% off box 1", 14.0, "var(--accent)"]];
    var bx = x0 + 96, bw = W - 140;
    rows.forEach(function (r, i) {
      var y = y0 + 38 + i * 19;
      txt(ctx, g, bx - 6, y + 4, r[0], { size: 9.5, anchor: "end", bold: i === 3, color: i === 3 ? "var(--accent)" : "var(--ink-2)" });
      ctx.el("rect", { x: bx, y: y - 5, width: bw * r[1] / 14, height: 10, rx: 3, style: "fill:" + r[2] + ";opacity:.85" }, g);
      txt(ctx, g, bx + bw * r[1] / 14 + 4, y + 4, r[1].toFixed(1) + "%", { size: 9, color: i === 3 ? "var(--accent)" : "var(--ink-2)", bold: i === 3 });
    });
  }

  /* The three slides, read by their titles alone. */
  function titles(svg, ctx) {
    var a = ctx.anchor("slides"), W = 276, H = 104, x0 = a[0] - W / 2 + 20, y0 = a[1] + 64;
    var g = card(ctx, svg, x0, y0, W, H, "READ THE TITLES ONLY");
    ["1  Promo signups churn 2.3× faster", "2  Cap at 30%: churn 7.4% → ~6.6%", "3  Approve a 4-week test by 20 Oct"].forEach(function (s, i) {
      txt(ctx, g, x0 + 12, y0 + 44 + i * 21, s, { size: 10, color: i === 2 ? "var(--good)" : "var(--ink)", bold: true });
    });
  }

  window.ATLAS_SCENES["storytelling/overview"] = {
    unit: 34,
    metrics: [
      { id: "slides", label: "Slides shown" },
      { id: "answer", label: "Answer appears", tone: "accent" },
      { id: "talk", label: "Talk time" },
      { id: "dec", label: "Decision", tone: "good" }
    ],
    legend: { req: "presentation", res: "decision / reply", miss: "lost attention", data: "content moved" },
    nodes: {
      deck:     { type: "stack", x: -0.6, y: 0, w: 1.8, d: 1.4, n: 8, color: "t5", label: "Analysis deck", sub: "40 slides" },
      question: { type: "block", x: -4.6, y: 0.2, w: 1.4, d: 1.4, h: 0.8, color: "accent", label: "Framed question", icon: "?" },
      summary:  { type: "stack", x: 3.6, y: -0.2, w: 1.6, d: 1.3, n: 2, color: "accent", label: "Exec summary", sub: "5 sentences" },
      appendix: { type: "stack", x: 2.2, y: 5.0, w: 1.6, d: 1.3, n: 6, color: "t5", label: "Appendix", sub: "37 slides" },
      slides:   { type: "stack", x: 7.8, y: 0, w: 1.6, d: 1.3, n: 3, color: "t2", label: "3 slides" },
      vp:       { type: "block", x: 12.4, y: 0, w: 1.6, d: 1.6, h: 1.3, color: "t3", label: "VP of Growth", icon: "◉" },
      cfo:      { type: "block", x: 8.4, y: -5.0, w: 1.3, d: 1.3, h: 1.0, color: "t4", label: "CFO" },
      cmgr:     { type: "block", x: 8.6, y: 4.6, w: 1.3, d: 1.3, h: 1.0, color: "t1", label: "Campaign mgr" },
      decision: { type: "block", x: 15.8, y: -0.6, w: 1.4, d: 1.4, h: 0.8, color: "good", label: "Decision", icon: "✓" }
    },
    steps: [
      { title: "Forty slides, three minutes", tag: "Problem", add: ["deck", "vp"], badges: { deck: "3 weeks of work" },
        text: "<p>Your churn analysis is done: three weeks of work, <b>40 slides</b> of cohort tables, funnels and segment cuts. Monthly churn rose from 6.1% to 7.4% and you know why.</p><p>The VP of Growth gives you <b>3 minutes</b> in Monday's planning meeting. The answer is on slide 31.</p>",
        key: "The analysis is finished. The communication has not started.",
        metrics: { slides: "40", answer: "slide 31", talk: "25 min", dec: "—" } },

      { title: "The chronological walk-through stalls", tag: "Problem", links: [["deck", "vp", "req", { dashed: true }]],
        flows: [["deck", "vp", "req", { label: "slide 1: background", count: 2 }], ["vp", "deck", "miss", { label: "what's the answer?", delay: 1.2 }]],
        badges: { vp: "lost at slide 6" },
        text: "<p>You start where the work started: background, data sources, method. By slide 6 the VP is checking email. At minute 3 you are still explaining the cohort table, and the meeting moves on.</p><p>The decision is postponed two weeks, which is after the 1 Nov campaign launches.</p>",
        note: "Chronological order mirrors your memory of the project. The reader has to relive your three weeks before learning what you found.",
        metrics: { dec: "postponed" },
        changed: ["- Decision slips past the 1 Nov campaign"] },

      { title: "Reframe around the decision", tag: "Idea", add: ["question"], focus: ["question", "deck", "vp"],
        unlink: [["deck", "vp"]], links: [["vp", "question", "res", { dashed: true }], ["question", "deck", "data"]],
        flows: [["vp", "question", "res", { label: "decide promo by 20 Oct" }], ["question", "deck", "data", { label: "keep what serves it", delay: 0.8 }]],
        badges: { question: "decide by 20 Oct", vp: "" },
        text: "<p>Ask the VP one question: <i>what will you decide, and by when?</i> The answer is specific: whether to change the first-box promo before the 1 Nov campaign, decided on 20 Oct.</p><p>That question becomes a filter. Every slide either helps make that decision or goes to the appendix.</p>",
        key: "A framed question tells you what to cut as well as what to analyse.",
        changed: ["+ Decision, owner, deadline, threshold"] },

      { title: "Find the one finding", tag: "Idea", focus: ["deck"], badges: { deck: "slide 31: 14% vs 6%" },
        draw: finding,
        text: "<p>Of 40 slides, one carries the decision. Promo signups churn <b>14%</b> in month 2 against <b>6%</b> at full price, 2.3 times as much, and promo's share of signups rose from 20% to 45%.</p><p>The other branches you tested (late deliveries, the July price rise, a tracking change) were ruled out. They become one line: \"other causes checked and excluded\".</p>",
        note: "Ruled-out hypotheses still matter. They answer \"did you check X?\" before anyone asks." },

      { title: "Lead with the answer", tag: "Solution", add: ["summary"], focus: ["deck", "summary"],
        links: [["deck", "summary", "data"]],
        flows: [["deck", "summary", "data", { label: "slide 31 → sentence 1" }]],
        text: "<p>Write five sentences in BLUF order (bottom line up front):</p><ul><li><b>Recommend</b> capping the promo at 30% off.</li><li><b>Why</b>: 14% vs 6% month-2 churn.</li><li><b>Impact</b>: churn back to about 6.6%.</li><li><b>Risk</b>: signups may drop 10 to 15%.</li><li><b>Ask</b>: approve a 4-week test by 20 Oct.</li></ul>",
        key: "If the VP reads only the first sentence, she still has the answer.",
        metrics: { answer: "sentence 1" },
        changed: ["~ Answer moves from slide 31 to sentence 1"] },

      { title: "Cut to three slides", tag: "Solution", add: ["slides", "appendix"], remove: ["deck"], focus: ["summary", "slides", "appendix"],
        unlink: [["question", "deck"], ["deck", "summary"]], links: [["question", "summary", "data", { dashed: true }], ["summary", "slides", "data"], ["summary", "appendix", "data", { dashed: true }]],
        flows: [["summary", "slides", "data", { label: "3 claims" }], ["summary", "appendix", "data", { label: "37 slides parked", delay: 0.6 }]],
        text: "<p>Each sentence of the summary that needs evidence gets one slide: the insight, the recommendation, the ask. The other <b>37 slides</b> move to an appendix you open only if someone asks.</p><p>Nothing is deleted. The work is still there for questions; it just stops competing for the first three minutes.</p>",
        metrics: { slides: "3" },
        changed: ["- 37 slides to the appendix", "~ Slides shown 40 → 3"] },

      { title: "Titles that carry the message", tag: "Idea", focus: ["slides"], badges: { slides: "action titles" },
        draw: titles,
        text: "<p>Each slide gets an <b>action title</b>: a full sentence with a number. \"Churn by acquisition offer\" becomes \"Promo signups churn 2.3× faster than full-price signups\".</p><p>On the chart, the promo bar is the only coloured one. Read the three titles alone and you have the whole story.</p>",
        key: "If the titles tell the story on their own, the deck works.",
        metrics: { talk: "3 min" } },

      { title: "Pre-wire the stakeholders", tag: "Solution", add: ["cfo", "cmgr"], focus: ["slides", "cfo", "cmgr"],
        links: [["slides", "cfo", "req", { dashed: true }], ["slides", "cmgr", "req", { dashed: true }]],
        flows: [["slides", "cfo", "req", { label: "1:1 preview" }], ["cfo", "slides", "res", { label: "signup risk?", delay: 0.9 }], ["slides", "cmgr", "req", { delay: 0.4 }], ["cmgr", "slides", "res", { label: "helps design test", delay: 1.3 }]],
        badges: { cfo: "question answered", cmgr: "on board" },
        text: "<p>Before Monday, walk two people through it one-to-one. The <b>CFO</b> signs off on discounts; her question about lost signups goes into slide 2 as the risk. The <b>campaign manager</b> runs the promo; she hears it from you first and helps design the test.</p>",
        note: "Nobody should hear the key number for the first time in the decision meeting.",
        changed: ["+ CFO objection answered in the deck", "+ Campaign manager co-owns the test"] },

      { title: "The three-minute decision", tag: "Solution", add: ["decision"], focus: ["slides", "vp", "decision"],
        links: [["slides", "vp", "req"], ["vp", "decision", "res"]],
        flows: [["slides", "vp", "req", { label: "3 slides, 3 min", count: 3, dur: 1.1 }], ["vp", "decision", "res", { label: "approve 4-week test", delay: 1.4 }]],
        badges: { vp: "approved", decision: "test from 22 Oct" },
        text: "<p>Monday: 20 seconds of context, a minute on the insight, a minute on the recommendation, and the ask. The CFO nods, because she has seen it. The VP approves a <b>4-week test</b> starting 22 Oct, with a readout on 19 Nov.</p><p>Total time: under three minutes. The appendix stays closed.</p>",
        metrics: { dec: "approved" },
        changed: ["~ Talk 25 → 3 min", "~ Decision postponed → approved"] },

      { title: "The same work, communicated", tag: "Recap",
        flows: [["question", "summary", "data", { count: 1 }], ["summary", "slides", "data", { count: 1, delay: 0.3 }], ["slides", "cfo", "req", { count: 1, delay: 0.6 }], ["slides", "cmgr", "req", { count: 1, delay: 0.6 }], ["slides", "vp", "req", { count: 1, delay: 0.9 }], ["vp", "decision", "res", { count: 1, delay: 1.3 }]],
        text: "<p>The analysis didn't change. What changed:</p><ul><li><b>Frame</b> the decision, owner and deadline.</li><li><b>Lead</b> with the answer in sentence one.</li><li><b>Cut</b> to a few slides with takeaway titles.</li><li><b>Pre-wire</b> the people who can block or help.</li><li><b>Recommend</b> with impact, risk and a dated ask.</li></ul><p>The lessons in this area take each step in turn.</p>",
        key: "An analysis is finished when a decision is made, not when the query runs." }
    ],
    learn: [
      "How a framed question decides what to cut",
      "Why the answer belongs in the first sentence",
      "How to cut a deck to a few slides with takeaway titles",
      "Why you pre-wire stakeholders before the meeting",
      "How to end with a specific, dated ask"
    ]
  };
})();
