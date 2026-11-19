/* Flagship scene: from paper to shipped portfolio project (plays on the Professional skills overview).
   Four regions form the page's loop, clockwise on screen: Learn (top), Decide (right),
   Explain (bottom), Show (left). Positions are given in screen terms: a = x - y, b = x + y.
   Story numbers (illustrative, consistent with the page's examples): 12 papers × 10 min
   first pass; support agents spend 6 min per ticket; 20,000 tickets × 3% wrong × $15 =
   $9,000 / month; eval of 200 cases 52 → 64 → 71 → 78% against a 75% release bar;
   option A $0.0013 per query = $1.30 per 1,000; option B 7.5× the cost. */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  function at(type, a, b, o) {
    var w = o.w || o.s || 1.5, d = o.d || o.s || 1.5;
    o.x = (b + a) / 2 - w / 2; o.y = (b - a) / 2 - d / 2; o.w = w; o.d = d;
    delete o.s; o.type = type;
    return o;
  }
  function txt(c, g, x, y, s, st) { var t = c.el("text", { x: x, y: y, style: "font-size:10px;fill:var(--ink-2);" + (st || "") }, g); t.textContent = s; return t; }
  function panel(svg, c, px, py, title, W, H) {
    var o = c.P(px, py, 0), x0 = o[0], y0 = o[1];
    var g = c.el("g", { class: "pro-panel" }, svg);
    c.el("rect", { x: x0, y: y0, width: W, height: H, rx: 10, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.2" }, g);
    var t = c.el("text", { x: x0 + 12, y: y0 + 19, style: "fill:var(--ink-2);font-size:10.5px;font-weight:700;letter-spacing:.04em" }, g);
    t.textContent = title;
    return { g: g, x: x0 + 12, y: y0 + 30, w: W - 24 };
  }

  /* step 5: pass rate per iteration on the same 200 cases (top-right corner) */
  function evalChart(svg, c) {
    var p = panel(svg, c, 2.5, -4.1, "PASS RATE · 200 CASES", 222, 132);
    var rows = [["baseline", 52], ["+ hybrid", 64], ["+ reranker", 71], ["+ citations", 78]];
    var H = 62, base = p.y + 8 + H, bw = 34, gap = (p.w - rows.length * bw) / (rows.length - 1);
    var barY = base - 0.75 * H;
    rows.forEach(function (r, i) {
      var x = p.x + i * (bw + gap), h = r[1] / 100 * H, ok = r[1] >= 75;
      c.el("rect", { x: x, y: base - h, width: bw, height: h, rx: 2, style: "fill:" + (ok ? "var(--good)" : c.mix("var(--accent)", 55)) }, p.g);
      txt(c, p.g, x + bw / 2, base - h - 4, r[1] + "%", "text-anchor:middle;font-weight:700;fill:var(--ink)");
      txt(c, p.g, x + bw / 2, base + 13, r[0], "text-anchor:middle;font-size:9px");
    });
    c.el("line", { x1: p.x - 4, y1: barY, x2: p.x + p.w + 4, y2: barY, style: "stroke:var(--signal);stroke-width:1.4;stroke-dasharray:4 3" }, p.g);
    txt(c, p.g, p.x + p.w + 4, barY - 4, "bar 75%", "text-anchor:end;font-size:9px;fill:var(--signal);font-weight:700");
    txt(c, p.g, p.x, base + 30, "one change per run, same cases", "font-size:9.5px");
  }

  /* step 6: the comparison table at the heart of the design doc (bottom-right corner) */
  function optionsTable(svg, c) {
    var p = panel(svg, c, 12.3, 5.1, "DESIGN DOC · OPTIONS", 262, 128);
    var cols = [0, 118, 160, 204], heads = ["option", "pass", "p95", "$/1k"];
    var rows = [["A · small + RAG", "78%", "1.8 s", "1.30", true], ["B · large model", "84%", "3.4 s", "9.80", false], ["C · do nothing", "—", "—", "0", false]];
    heads.forEach(function (h, i) { txt(c, p.g, p.x + cols[i], p.y + 4, h, "font-size:9px;fill:var(--ink-3)"); });
    rows.forEach(function (r, j) {
      var y = p.y + 22 + j * 17;
      if (r[4]) c.el("rect", { x: p.x - 5, y: y - 12, width: p.w + 10, height: 17, rx: 4, style: "fill:color-mix(in srgb, var(--good) 18%, transparent)" }, p.g);
      for (var i = 0; i < 4; i++) txt(c, p.g, p.x + cols[i], y, r[i], r[4] ? "font-weight:700;fill:var(--ink)" : "");
    });
    txt(c, p.g, p.x, p.y + 82, "Decision: A now; revisit B if its price drops.", "font-size:9.5px;font-weight:700;fill:var(--ink)");
  }

  window.ATLAS_SCENES["professional/overview"] = {
    unit: 30,
    metrics: [
      { id: "papers", label: "Papers triaged" },
      { id: "hours", label: "Hours spent" },
      { id: "pass", label: "Eval pass rate", tone: "good" },
      { id: "dec", label: "Decision", tone: "signal" }
    ],
    legend: { req: "work handed on", data: "evidence", res: "decision / release", grad: "feedback" },
    nodes: {
      /* four regions of the loop */
      learn:   { type: "slab", x: 0, y: 0, w: 5.4, d: 5.4, color: "t1", label: "Learn", sub: "16.1–16.2" },
      decide:  { type: "slab", x: 6.4, y: 0, w: 5.4, d: 5.4, color: "t2", label: "Decide", sub: "16.3" },
      explain: { type: "slab", x: 6.4, y: 6.4, w: 5.4, d: 5.4, color: "t3", label: "Explain", sub: "16.4" },
      show:    { type: "slab", x: 0, y: 6.4, w: 5.4, d: 5.4, color: "t4", label: "Show", sub: "16.5" },
      /* Learn */
      papers:   at("stack", -2.8, 6.2, { w: 1.5, d: 1.2, n: 4, color: "t1", label: "New papers" }),
      triage:   at("block", 0, 3.4, { s: 1.4, h: 0.9, color: "t1", label: "3-pass read", icon: "◎" }),
      notebook: at("block", 2.8, 6.2, { s: 1.5, h: 1.1, color: "accent", label: "Notebook", icon: "▤" }),
      /* Decide */
      problem: at("block", 3.8, 12.2, { s: 1.4, h: 0.9, color: "t5", label: "User problem", icon: "◉" }),
      proto:   at("block", 6.6, 9.6, { s: 1.5, h: 1.2, color: "t2", label: "Prototype", icon: "✦" }),
      evals:   at("stack", 9.4, 12.2, { w: 1.5, d: 1.2, n: 5, color: "good", label: "Eval set" }),
      /* Explain */
      doc:   at("stack", 3, 17.6, { w: 1.3, d: 1.6, n: 3, color: "t3", label: "Design doc" }),
      stake: at("block", -2.8, 18.6, { s: 1.6, h: 0.9, color: "t5", label: "Stakeholders", icon: "◉" }),
      /* Show */
      prod:  at("block", -4.2, 13.6, { s: 1.7, h: 1.4, color: "accent", label: "Production", icon: "⇡" }),
      folio: at("stack", -8.8, 11.4, { w: 1.5, d: 1.3, n: 4, color: "t4", label: "Portfolio" })
    },
    steps: [
      { title: "A new paper drops", tag: "Problem", add: ["learn", "papers", "triage"],
        links: [["papers", "triage"]], badges: { papers: "12 this week", triage: "1 goes deeper" },
        flows: [["papers", "triage", "req", { count: 3, label: "pass 1 · 10 min each" }]],
        text: "<p>Twelve papers land in your feed this week. One claims a new reranker that adds <b>+7.4 points of recall@10</b> to RAG pipelines, which is close to your team's problem.</p><p>Read in passes. Pass one is 10 minutes per paper: title, abstract, figures, conclusion. Eleven stop there. The reranker paper earns a second, hour-long pass over its main table and ablations.</p>",
        key: "Most papers deserve only the first pass. The decision points are where you save time.",
        note: "Finish pass one with the five Cs: category, context, correctness, contributions, clarity.",
        metrics: { papers: "12", hours: "3 h", pass: "—", dec: "Exploring" } },

      { title: "Reproduce the key result", tag: "Idea", add: ["notebook"], focus: ["triage", "notebook"],
        links: [["triage", "notebook"]], badges: { notebook: "+7.1 ± 0.4" },
        flows: [["triage", "notebook", "data", { label: "authors' code + config" }]],
        text: "<p>Pass three: rebuild the claim before you bet a product on it. Start from the authors' code, match their config exactly, and run <b>three seeds</b>.</p><p>You get +7.1 ± 0.4 points against the reported +7.4, which is within the noise. Write down every gap between paper and code; that's often where the real trick hides.</p>",
        note: "A gain smaller than seed-to-seed variance is not a result.",
        changed: ["+ Notebook with 3 seeds", "~ Hours 3 → 8"],
        metrics: { hours: "8 h" } },

      { title: "Which user problem does it solve?", tag: "Idea", add: ["decide", "problem"], focus: ["notebook", "problem"],
        links: [["notebook", "problem"]], badges: { problem: "6 min / ticket" },
        flows: [["notebook", "problem", "req", { label: "who needs this?" }]],
        text: "<p>A technique isn't a product. Write the problem as a job: <b>support agents spend 6 minutes finding the right policy for each ticket</b>.</p><p>Then ask what a wrong answer costs. At 20,000 tickets a month, 3% wrong and $15 to fix each, full automation would cost $9,000 a month in errors. So the AI <b>drafts</b> and a person approves.</p>",
        key: "Frequency × cost of a wrong answer sets how much autonomy the AI gets.",
        changed: ["+ Problem framed as a user's job", "+ Autonomy: draft + approve"],
        metrics: { hours: "10 h", dec: "Scoped" } },

      { title: "Build the smallest prototype", tag: "Solution", add: ["proto"], focus: ["problem", "proto", "notebook"],
        links: [["problem", "proto"]], badges: { proto: "small model + RAG" },
        flows: [["problem", "proto", "req"], ["notebook", "proto", "data", { label: "reranker", lift: 50 }]],
        text: "<p>Build the simplest thing that could work: a small model answering from the policy docs with retrieval, and the paper's reranker behind a flag so you can switch it off.</p><p>No fine-tuning, no agents. A prototype exists to be measured, so keep it small enough to change in an afternoon.</p>",
        changed: ["+ Prototype: small model + RAG", "~ Hours 10 → 22"],
        metrics: { hours: "22 h", dec: "Prototype" } },

      { title: "An eval proves it works", tag: "Solution", add: ["evals"], focus: ["proto", "evals"],
        links: [["proto", "evals"]], badges: { evals: "200 cases" },
        flows: [["proto", "evals", "req", { label: "run 200 cases" }], ["evals", "proto", "data", { lift: -40, delay: 0.8 }]],
        text: "<p>Collect <b>200 real tickets</b> with the correct policy marked, and score every change against them. One change per run:</p><ul><li>baseline 52%</li><li>+ hybrid search 64%</li><li>+ the paper's reranker 71%</li><li>+ a citations prompt 78%</li></ul><p>That clears the 75% bar you agreed on before starting.</p>",
        key: "Your own eval set turns \"it seems better\" into a number anyone can check.",
        draw: evalChart,
        changed: ["+ Eval set: 200 cases", "~ Pass rate 52% → 78%"],
        metrics: { hours: "30 h", pass: "78%", dec: "Passes bar" } },

      { title: "Write the design doc", tag: "Idea", add: ["explain", "doc"], focus: ["evals", "doc"],
        links: [["evals", "doc"]], badges: { doc: "3 options" },
        flows: [["evals", "doc", "data", { label: "eval numbers" }]],
        text: "<p>Before asking for a launch, write it down: the problem, goals and non-goals, and at least two real options plus <b>do nothing</b>, compared on criteria agreed in advance.</p><p>The large model scores 6 points higher but costs 7.5× as much and nearly doubles p95 latency. That's a business question, so the doc states it as one.</p>",
        note: "An option that is worse on every axis than another is dominated. Drop it from the table.",
        draw: optionsTable,
        changed: ["+ Options A, B and do nothing", "+ Decision proposed: A"],
        metrics: { hours: "34 h", dec: "Proposed" } },

      { title: "Present it: a decision gets made", tag: "Solution", add: ["stake"], focus: ["doc", "stake"],
        links: [["doc", "stake"]], badges: { stake: "approved: A" },
        flows: [["doc", "stake", "req", { label: "30-min review" }], ["stake", "doc", "res", { lift: -40, delay: 1, label: "go, with a flag" }]],
        text: "<p>Product, support and finance don't care about recall@10. Translate: <b>about 1 draft in 5 needs an agent's edit</b>, a query costs a tenth of a cent, and one user in 20 waits about 2 seconds.</p><p>Show three real failures next to the numbers. The group approves option A for 10% of agents, with a date to review the results.</p>",
        key: "One concrete bad answer persuades more than a percentage.",
        changed: ["~ Decision: proposed → approved"],
        metrics: { hours: "36 h", dec: "Approved" } },

      { title: "Ship it", tag: "Solution", add: ["show", "prod"], focus: ["stake", "prod"],
        links: [["stake", "prod"]], badges: { prod: "10% of agents" },
        flows: [["stake", "prod", "res", { label: "flag on" }]],
        text: "<p>Ship behind a <b>feature flag</b> to 10% of agents. Log every draft, trace every retrieval, and measure what you promised: p95 latency of 1.8 s and $0.0013 per query.</p><p>Watch the approval edit rate. If it stays low for weeks, widen the rollout; if it climbs, the flag turns it off in seconds.</p>",
        note: "Adopt behind a flag you can turn off. That's what makes saying yes cheap for everyone else.",
        changed: ["+ Production behind a flag", "+ Latency and cost tracked"],
        metrics: { hours: "44 h", dec: "Shipped" } },

      { title: "Write it up as a portfolio project", tag: "Solution", add: ["folio"], focus: ["prod", "folio", "evals"],
        links: [["prod", "folio"]], badges: { folio: "README + evals" },
        flows: [["prod", "folio", "data", { label: "cost + latency" }], ["evals", "folio", "data", { lift: 80, delay: 0.6, label: "results table" }]],
        text: "<p>Now show the work. The README has the problem, an architecture diagram, the <b>results table across iterations</b>, cost per query and p95 latency, and a failure gallery.</p><p>Include what didn't win: the large model, and why 6 points weren't worth 7.5× the cost. Keep the 200 cases in the repo and run them in CI so anyone can reproduce your numbers.</p>",
        key: "Two or three projects like this beat ten notebook demos.",
        changed: ["+ Portfolio write-up", "~ Hours 44 → 48"],
        metrics: { hours: "48 h" } },

      { title: "The loop starts again", tag: "Idea", focus: ["folio", "papers", "triage", "prod"],
        links: [["folio", "papers", "grad", { dashed: true }]], badges: { papers: "7 new", triage: "citations?" },
        flows: [["prod", "folio", "grad", { count: 1 }], ["folio", "papers", "grad", { label: "users: wrong citations on 3%" }]],
        text: "<p>Feedback restarts the loop. Agents report that 3% of drafts cite the wrong policy section, so next week's triage looks for a paper on <b>citation grounding</b>.</p><p>This time it goes faster: the eval set, the flag and the doc template already exist. Every turn of the loop makes the next one cheaper.</p>",
        changed: ["+ Feedback link Show → Learn", "~ Papers triaged 12 → 19"],
        metrics: { papers: "19", dec: "Next loop" } },

      { title: "Paper to portfolio", tag: "Recap", focus: [],
        flows: [["papers", "triage", "req", { count: 1 }], ["notebook", "problem", "req", { count: 1 }], ["evals", "doc", "data", { count: 1 }], ["stake", "prod", "res", { count: 1 }], ["folio", "papers", "grad", { count: 1 }]],
        text: "<p>One paper became a shipped feature and a project you can show:</p><ul><li><b>Learn</b>: three-pass triage, then reproduce</li><li><b>Decide</b>: a user's job, the cost of being wrong, a small prototype, an eval</li><li><b>Explain</b>: a design doc with options, a decision in plain numbers</li><li><b>Show</b>: ship behind a flag, write it up with evals and cost</li></ul><p>The lessons in this area take each skill in turn.</p>" }
    ],
    learn: [
      "How to triage papers with the three-pass method",
      "How to frame a feature as a user's job with a cost of failure",
      "Why an eval set comes before the demo",
      "How to write a design doc that gets a decision",
      "What makes a portfolio project credible"
    ]
  };
})();
