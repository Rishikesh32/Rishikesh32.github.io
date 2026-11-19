/* Flagship scene: "did the new prompt make things better?" (plays on the Evaluation overview).
   Numbers: a 200-case golden set; prompt v13 (old) vs v14 (new), same pinned model.
   Combined pass (assertions + judge rubric): old 136/200 = 68%, new 150/200 = 75%.
   Paired: 22 cases fixed, 8 broken, 170 unchanged. Mean diff 0.07, E[d^2] = 0.15,
   SE = sqrt((0.15 - 0.0049) / 200) = 0.0269, 95% CI = +7 ± 5.3 pts (unpaired would be ± 8.8).
   Judge vs humans on 50 cases: 44 agree (88%), chance 0.7*0.72 + 0.3*0.28 = 0.588, kappa = 0.71.
   Regression PR: 4 fixed, 16 broken, net -12 = -6 pts, SE = sqrt((0.1 - 0.0036) / 200) = 0.022, ± 4.3.
   A/B: 19,000 conversations per arm, 61.2% vs 63.5% resolved, SE(diff) ≈ 0.50 pts, ± 1.0. */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  /* Small number line: the difference new − old in points, with its 95% interval. */
  function ciChart(opt) {
    return function (svg, c) {
      var o = c.P(opt.x, opt.y, 0), x0 = o[0], y0 = o[1];
      var W = 236, lo = -10, hi = 18, sx = function (v) { return x0 + (v - lo) / (hi - lo) * W; };
      var g = c.el("g", { class: "eval-ci" }, svg);
      c.el("rect", { x: x0 - 14, y: y0 - 64, width: W + 28, height: 128, rx: 10, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.2" }, g);
      var t = c.el("text", { x: x0, y: y0 - 44, style: "fill:var(--ink-2);font-size:12px;font-weight:700;letter-spacing:.04em" }, g);
      t.textContent = "NEW − OLD, POINTS (95% CI)";
      var pl = c.el("text", { x: x0, y: y0 - 24, style: "fill:var(--good);font-size:11px;font-weight:700" }, g);
      pl.textContent = "paired: +1.7 to +12.3";
      c.el("line", { x1: x0, y1: y0, x2: x0 + W, y2: y0, style: "stroke:var(--ink-3);stroke-width:1" }, g);
      [-10, -5, 0, 5, 10, 15].forEach(function (v) {
        c.el("line", { x1: sx(v), y1: y0 - 3, x2: sx(v), y2: y0 + 3, style: "stroke:var(--ink-3);stroke-width:1" }, g);
        var tt = c.el("text", { x: sx(v), y: y0 + 16, "text-anchor": "middle", style: "fill:var(--ink-3);font-size:11px" }, g);
        tt.textContent = (v > 0 ? "+" : "") + v;
      });
      c.el("line", { x1: sx(0), y1: y0 - 20, x2: sx(0), y2: y0 + 38, style: "stroke:var(--ink-2);stroke-width:1.2;stroke-dasharray:3 3" }, g);
      c.el("line", { x1: sx(opt.lo), y1: y0 - 10, x2: sx(opt.hi), y2: y0 - 10, style: "stroke:var(--good);stroke-width:4;stroke-linecap:round" }, g);
      c.el("circle", { cx: sx(opt.mid), cy: y0 - 10, r: 5, style: "fill:var(--good);stroke:var(--surface);stroke-width:1.5" }, g);
      c.el("line", { x1: sx(opt.ghost[0]), y1: y0 + 30, x2: sx(opt.ghost[1]), y2: y0 + 30, style: "stroke:var(--ink-3);stroke-width:3;stroke-linecap:round;stroke-dasharray:5 5" }, g);
      var gt = c.el("text", { x: x0, y: y0 + 52, style: "fill:var(--ink-2);font-size:11px" }, g);
      gt.textContent = "unpaired: ±8.8, crosses 0";
    };
  }

  window.ATLAS_SCENES["evaluation/overview"] = {
    unit: 28,
    metrics: [
      { id: "cases", label: "Eval cases" },
      { id: "pass", label: "Pass rate old → new", tone: "accent" },
      { id: "ci", label: "Δ ± 95% CI", tone: "good" },
      { id: "agree", label: "Judge vs humans", tone: "signal" }
    ],
    legend: { req: "eval input / change", res: "answer / pass", miss: "regression / attack", data: "scores & cases", token: "live users" },
    nodes: {
      logs:    { type: "stack", x: -8, y: 4, w: 1.5, d: 1.1, n: 4, color: "t3", label: "Prod logs" },
      golden:  { type: "stack", x: -4.25, y: 6.25, w: 1.8, d: 1.4, n: 6, color: "good", label: "Golden set" },
      red:     { type: "block", x: -2.375, y: 10.125, w: 1.4, d: 1.4, h: 0.9, color: "signal", label: "Red team", icon: "⚑" },
      mate:    { type: "block", x: 4.5, y: 6, w: 1.3, d: 1.3, h: 0.9, color: "t5", label: "Teammate", icon: "◉" },
      v13:     { type: "block", x: -4.375, y: 1.125, w: 1.6, d: 1.6, h: 1.1, color: "t4", label: "Prompt v13", sub: "old" },
      v14:     { type: "block", x: -0.125, y: 5.375, w: 1.6, d: 1.6, h: 1.1, color: "t2", label: "Prompt v14", sub: "new" },
      outs:    { type: "stack", x: 0.125, y: 1.125, w: 1.6, d: 1.2, n: 5, color: "t1", label: "Outputs" },
      checks:  { type: "block", x: -0.75, y: -3.75, w: 1.5, d: 1.5, h: 0.9, color: "t3", label: "Code checks", icon: "✓" },
      judge:   { type: "block", x: 4.125, y: -0.875, w: 1.8, d: 1.8, h: 1.3, color: "t2", label: "LLM judge", icon: "⚖" },
      humans:  { type: "block", x: 8.75, y: -0.25, w: 1.4, d: 1.4, h: 0.9, color: "t5", label: "Reviewers", icon: "◉" },
      stats:   { type: "block", x: 3.125, y: -6.375, w: 1.6, d: 1.6, h: 1.0, color: "accent", label: "Paired stats", icon: "±" },
      gate:    { type: "block", x: 9, y: -5, w: 1.6, d: 1.6, h: 1.0, color: "signal", label: "CI gate", icon: "⛉" },
      pr:      { type: "block", x: 9, y: -10, w: 1.3, d: 1.3, h: 0.7, color: "t4", label: "PR #418" },
      router:  { type: "block", x: 4.125, y: 5.625, w: 1.6, d: 1.6, h: 0.8, color: "accent", label: "A/B router", sub: "50 / 50" },
      users:   { type: "block", x: 3.125, y: 9.125, w: 1.4, d: 1.4, h: 0.9, color: "t5", label: "Users", icon: "◉" }
    },
    steps: [
      { title: "\"It feels better\"", tag: "Problem", add: ["mate", "v13", "v14"], focus: ["mate", "v14"],
        text: "<p>Your teammate rewrote the support bot's prompt from <b>v13</b> to <b>v14</b>. They tried three questions, liked the answers and said: <i>\"the new prompt feels better\"</i>.</p><p>Maybe it is. But three hand-picked examples can't tell a real gain from luck, and nobody checked what got worse.</p>",
        key: "Evaluation is how you answer \"did this change make things better?\" with evidence instead of a feeling.",
        flows: [["mate", "v14", "req", { label: "3 hand-picked Qs", count: 1, lift: 20 }], ["v14", "mate", "res", { label: "\"feels better\"", delay: 0.9, count: 1, lift: 95 }]],
        metrics: { cases: "3", pass: "—", ci: "—", agree: "—" } },

      { title: "Build a golden set", tag: "Solution", add: ["logs", "golden"], remove: ["mate"], focus: ["logs", "golden"], badges: { golden: "200 cases" },
        links: [["logs", "golden", "data"]],
        text: "<p>Collect <b>200 cases</b> into one versioned file. Sample real questions from production logs, add every past bug report, and have an expert write the rare, high-stakes ones.</p><p>Each case holds the input, a grading rule (assertions such as <code>must_call: get_order</code>, or a rubric) and a slice tag: typical 40%, hard 30%, edge 20%, adversarial 10%.</p>",
        note: "Keep the set out of fine-tuning data and few-shot prompts, or the scores stop meaning anything.",
        flows: [["logs", "golden", "data", { label: "stratified sample", count: 3, lift: 70 }]],
        changed: ["+ eval-set v1: 200 cases, 4 slices", "+ A grading rule on every case"],
        metrics: { cases: "200" } },

      { title: "Run old and new on every case", tag: "Idea", add: ["outs"], remove: ["logs"], focus: ["golden", "v13", "v14", "outs"], badges: { outs: "400 answers" },
        links: [["golden", "v13", "req"], ["golden", "v14", "req"], ["v13", "outs"], ["v14", "outs"]],
        text: "<p>Send the same 200 inputs through both prompts. Pin the model snapshot and set temperature to 0, so the <b>only</b> thing that differs is the prompt.</p><p>You get 400 answers, each tagged with its case id and version, ready to score.</p>",
        note: "At example prices this run costs about a dollar. Cache answers by prompt and input, so an unchanged case costs nothing next time.",
        flows: [["golden", "v13", "req", { count: 3, dur: 1.4 }], ["golden", "v14", "req", { count: 3, dur: 1.4 }], ["v13", "outs", "res", { delay: 0.6 }], ["v14", "outs", "res", { delay: 0.6 }]],
        changed: ["+ 2 × 200 answers, same model and settings"] },

      { title: "Score what code can check", tag: "Solution", add: ["checks"], focus: ["outs", "checks"], badges: { checks: "3 assertions", outs: "" },
        links: [["outs", "checks", "data"]],
        text: "<p>Start with cheap, exact checks. For each answer, code verifies the JSON is valid, the right tool was called, and the answer never <b>promises a delivery date</b>.</p><p>On assertions alone, old passes <b>81%</b> and new passes <b>86%</b>. These checks run in seconds and give the same result every time.</p>",
        key: "Use the strictest check that still captures \"correct\". Word-overlap scores like BLEU can rate a wrong answer above a right one.",
        flows: [["outs", "checks", "data", { label: "400 answers", count: 3 }]],
        metrics: { pass: "81% → 86%" } },

      { title: "A judge, in both orders", tag: "Solution", add: ["judge"], focus: ["outs", "judge"], badges: { judge: "new wins 74 · old 41" },
        links: [["outs", "judge", "data"]],
        text: "<p>Free-text quality needs a reader. An <b>LLM judge</b> grades each answer on a rubric (correct, grounded, complete, polite) and compares old and new side by side.</p><p>Shown first, the new answer wins 118 times. Shown second, only 96: that gap is <b>position bias</b>. Run every pair in both orders and count disagreements as ties.</p>",
        flows: [["outs", "judge", "data", { label: "A|B, then B|A", count: 2, lift: 80 }]],
        changed: ["+ Rubric verdict added to each case", "~ Pass rate now needs assertions and rubric: 68% → 75%"],
        metrics: { pass: "68% → 75%" } },

      { title: "Spot-check with people", tag: "Idea", add: ["humans"], focus: ["outs", "judge", "humans"], badges: { humans: "κ 0.71 on 50" },
        links: [["judge", "humans", null, { dashed: true }]],
        text: "<p>Before trusting the judge, two reviewers label <b>50 random cases</b> with the same rubric. The judge matches them on 44, which is <b>88%</b>.</p><p>About 70% of cases pass, so chance alone would agree 59% of the time. Cohen's kappa corrects for that: (0.88 − 0.59) / (1 − 0.59) = <b>0.71</b>.</p>",
        note: "The two reviewers agree with each other at κ = 0.78. A judge can't beat the human ceiling, so 0.71 is good enough to use.",
        flows: [["outs", "humans", "data", { label: "50 sampled", count: 1, lift: 60 }], ["humans", "judge", "data", { delay: 0.8, count: 1 }]],
        metrics: { agree: "88% · κ 0.71" } },

      { title: "Real gain, or just noise?", tag: "Solution", add: ["stats"], focus: ["checks", "judge", "stats"], badges: { stats: "22 fixed · 8 broken", judge: "" },
        links: [["checks", "stats", "data"], ["judge", "stats", "data"]],
        text: "<p>Both prompts answered the <b>same</b> 200 cases, so compare them case by case. New fixed 22 cases and broke 8; the other 170 didn't change. Net +14 cases is <b>+7 points</b>.</p><p>The paired 95% interval runs from +1.7 to +12.3. It excludes zero, so the gain is real, though it could be as small as 2 points.</p>",
        key: "Only fixed and broken cases carry signal. Treat the runs as unrelated samples and the interval is ±8.8, wide enough to cross zero.",
        flows: [["checks", "stats", "data", { count: 1 }], ["judge", "stats", "data", { count: 2 }]],
        draw: ciChart({ x: 7.75, y: -5.25, lo: 1.7, hi: 12.3, mid: 7, ghost: [-1.8, 15.8] }),
        metrics: { ci: "+7 ± 5.3 pts" } },

      { title: "A gate blocks a regression", tag: "Problem", add: ["gate", "pr"], focus: ["stats", "gate", "pr"], badges: { gate: "✗ blocked" },
        links: [["stats", "gate", "data"]],
        text: "<p>v14 ships, and the same eval now runs in CI on every pull request that touches a prompt. A week later, PR #418 trims the prompt to save 400 tokens.</p><p>Pass rate drops from 75% to <b>69%</b>. The gate allows at most 3 points below the 75% baseline, so the merge is <b>blocked</b> and the score diff is posted on the PR.</p>",
        note: "Also keep a short \"must never fail\" list. Two of those critical cases broke here, which would block the PR on its own.",
        flows: [["pr", "gate", "req", { count: 1 }], ["stats", "gate", "data", { delay: 0.5, count: 1 }], ["gate", "pr", "miss", { label: "69% < 72% floor", delay: 1.2, count: 1, lift: 90 }]],
        changed: ["+ Eval gate on prompt and model changes", "- PR #418 blocked: 4 fixed, 16 broken"],
        metrics: { pass: "75% → 69%", ci: "−6 ± 4.3 pts" } },

      { title: "Measure real users", tag: "Idea", add: ["users", "router"], focus: ["users", "router", "v13", "v14"], badges: { router: "61.2% → 63.5%" },
        links: [["users", "router", "token"], ["router", "v13", "token", { dashed: true }], ["router", "v14", "token", { dashed: true }]],
        unlink: [["golden", "v13"], ["golden", "v14"]],
        text: "<p>Offline evals predict quality. An <b>A/B test</b> measures it. The router splits users 50/50 by user ID, so each person always sees the same version.</p><p>After two weeks and 19,000 conversations per arm, chats resolved without a human handoff rose from <b>61.2% to 63.5%</b> (±1.0 points). Latency and cost per chat, the guardrail metrics, stayed flat.</p>",
        note: "Pick the primary metric and sample size before you start, and don't stop early when the numbers look good.",
        flows: [["users", "router", "token", { count: 3 }], ["router", "v13", "token", { delay: 0.5, lift: 50 }], ["router", "v14", "token", { delay: 0.5, lift: 40 }]],
        metrics: { pass: "68% → 75%", ci: "+7 ± 5.3 pts" } },

      { title: "Attack it, then keep the attacks", tag: "Solution", add: ["red", "logs"], focus: ["red", "v14", "golden", "logs"], badges: { red: "18 / 300 succeed", golden: "236 cases" },
        links: [["red", "golden", "miss", { dashed: true }]],
        text: "<p>A red team spends a day attacking v14: instructions hidden in pasted order notes, requests for another customer's address, role-play to unlock refunds. <b>18 of 300</b> attempts succeed.</p><p>Every success becomes a test case, plus a paraphrase of each: <b>36 new cases</b>. Failed chats from production logs join too, so the next change is tested against them.</p>",
        key: "The eval set is never finished. Every attack and every production failure becomes a regression test.",
        flows: [["red", "v14", "miss", { label: "injection", count: 2, lift: 10 }], ["red", "golden", "data", { delay: 1.0, count: 2 }], ["logs", "golden", "data", { delay: 0.6, count: 1 }]],
        changed: ["+ 36 adversarial cases", "~ eval-set v1 → v2"],
        metrics: { cases: "236" } },

      { title: "The evaluation loop", tag: "Recap", focus: [],
        text: "<p>\"Feels better\" became a measured answer:</p><ul><li><b>Golden set</b>: versioned cases with grading rules</li><li><b>Scoring</b>: code first, a judge checked by humans</li><li><b>Statistics</b>: paired intervals, not raw averages</li><li><b>CI gate</b>: regressions blocked before merge</li><li><b>A/B test</b>: real users decide</li><li><b>Red team</b>: attacks become new cases</li></ul>",
        flows: [["golden", "v14", "req", { count: 1, lift: 40 }], ["v14", "outs", "res", { count: 1 }], ["outs", "judge", "data", { count: 1 }], ["judge", "stats", "data", { count: 1 }], ["stats", "gate", "data", { count: 1 }], ["router", "v14", "token", { count: 1, lift: 40 }], ["red", "golden", "data", { count: 1 }]] }
    ],
    learn: [
      "How to build a golden set with grading rules and slices",
      "When to score with code, an LLM judge or people",
      "How to cancel a judge's position bias and check it with kappa",
      "Why a paired confidence interval separates real gains from noise",
      "How a CI gate, an A/B test and red-teaming close the loop"
    ]
  };
})();
