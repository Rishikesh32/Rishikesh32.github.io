/* Flagship scene: design a customer-support assistant over 1M documents (plays on the system-design overview).
   Numbers follow case study 1 on the page: 50k conversations/day x 4 turns = 200k model calls/day
   (about 2.3/s average, ~7/s peak); ~5,100 input and 250 output tokens per call; about $0.014 per call
   at the example prices ($3 / $0.30 cached / $15 per M tokens), so $14 per 1k requests with one large model
   and $6.44 per 1k when 60% of calls go to a 10x cheaper small model. */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  /* Stacked bar of p95 latency components against the 2 s first-token budget. */
  var SEGS = [
    ["net + gateway", 80, "t1"],
    ["retrieve + rerank", 350, "t3"],
    ["tools", 270, "t4"],
    ["router", 200, "t5"],
    ["prefill", 950, "t2"]
  ];
  function budgetBar(svg, c) {
    var o = c.P(10.25, 4.75, 0), x0 = o[0], y0 = o[1];
    var W = 300, H = 16, budget = 2000;
    var g = c.el("g", { class: "sd-budget" }, svg);
    c.el("rect", { x: x0 - 12, y: y0 - 40, width: W + 44, height: 106, rx: 10, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.2" }, g);
    var t = c.el("text", { x: x0, y: y0 - 22, style: "fill:var(--ink-2);font-size:10.5px;font-weight:700;letter-spacing:.04em" }, g);
    t.textContent = "P95 TO FIRST TOKEN · BUDGET 2,000 MS";
    c.el("rect", { x: x0, y: y0 - 8, width: W, height: H, rx: 3, style: "fill:" + c.mix("var(--ink)", 6) }, g);
    var x = x0;
    SEGS.forEach(function (s) {
      var w = s[1] / budget * W;
      c.el("rect", { x: x, y: y0 - 8, width: Math.max(1, w - 1.5), height: H, rx: 2, style: "fill:" + c.mix(c.col(s[2]), 70) }, g);
      x += w;
    });
    c.el("line", { x1: x0 + W, y1: y0 - 14, x2: x0 + W, y2: y0 + 14, style: "stroke:var(--signal);stroke-width:2;stroke-dasharray:3 3" }, g);
    var items = SEGS.concat([["headroom", 150, "signal"]]);
    items.forEach(function (s, i) {
      var cx = x0 + (i % 2) * 156, cy = y0 + 25 + Math.floor(i / 2) * 15, last = i === items.length - 1;
      c.el("rect", { x: cx, y: cy - 7, width: 8, height: 8, rx: 2, style: last ? "fill:none;stroke:var(--signal);stroke-width:1.2" : "fill:" + c.mix(c.col(s[2]), 70) }, g);
      var tt = c.el("text", { x: cx + 13, y: cy, style: last ? "fill:var(--signal);font-size:10px;font-weight:700" : "fill:var(--ink-2);font-size:10px" }, g);
      tt.textContent = s[0] + " " + s[1] + " ms";
    });
  }

  window.ATLAS_SCENES["system-design/overview"] = {
    unit: 32,
    metrics: [
      { id: "p95", label: "p95 TTFT · budget 2 s", tone: "accent" },
      { id: "avail", label: "Availability · SLO 99.9%", tone: "good" },
      { id: "cost", label: "Cost / 1k requests", tone: "signal" },
      { id: "qps", label: "QPS admitted" }
    ],
    legend: { req: "request", res: "answer", miss: "error / rejected", data: "retrieved data / tool result", token: "streamed tokens" },
    nodes: {
      client:    { type: "block", x: -3,    y: 8,     w: 1.4, d: 1.4, h: 0.9, color: "t5", label: "Chat widget", icon: "◉" },
      spike:     { type: "stack", x: -1.05, y: 12.15, w: 1.6, d: 1.2, n: 4,   color: "signal", label: "Traffic spike" },
      gateway:   { type: "block", x: -0.8,  y: 5.2,   w: 2,   d: 2,   h: 1.2, color: "t1", label: "Gateway", icon: "⛨" },
      bucket:    { type: "cyl",   x: 3,     y: 10,    r: 0.75, h: 1,  color: "t1", label: "Token bucket" },
      docs:      { type: "stack", x: -6.55, y: 4.15,  w: 1.6, d: 1.2, n: 5,   color: "t4", label: "Help docs", sub: "1M" },
      orch:      { type: "block", x: 1.85,  y: 2.35,  w: 2.2, d: 2.2, h: 1.4, color: "accent", label: "Orchestrator", icon: "⟳" },
      vecdb:     { type: "cyl",   x: -1.5,  y: 2,     r: 0.85, h: 1.3, color: "t3", label: "Vector DB" },
      kw:        { type: "block", x: 0.2,   y: -1.3,  w: 1.6, d: 1.6, h: 1,   color: "t3", label: "Keyword index" },
      crm:       { type: "block", x: 3.95,  y: 6.45,  w: 1.6, d: 1.6, h: 0.9, color: "t4", label: "CRM" },
      orders:    { type: "cyl",   x: 7.5,   y: 5,     r: 0.8, h: 1.1, color: "t4", label: "Orders" },
      router:    { type: "block", x: 4.7,   y: -0.3,  w: 1.8, d: 1.8, h: 1,   color: "t5", label: "Model router", icon: "⑂" },
      small:     { type: "block", x: 4.95,  y: -5.05, w: 1.6, d: 1.6, h: 1,   color: "good", label: "Small model" },
      large:     { type: "block", x: 9,     y: -1.5,  w: 2,   d: 2,   h: 1.6, color: "t2", label: "Large model" },
      secondary: { type: "block", x: 11.6,  y: -3.9,  w: 1.8, d: 1.8, h: 1.3, color: "t2", label: "Provider B" },
      cache:     { type: "stack", x: 8.45,  y: -6.85, w: 1.6, d: 1.2, n: 3,   color: "good", label: "Answer cache" }
    },
    steps: [
      { title: "Design a support assistant", tag: "Problem", add: ["client", "docs"], badges: { docs: "1.5B tokens" },
        text: "<p>A retailer wants a help-page assistant that answers from <b>1M documents</b> (help center, internal KB, past tickets) and can look up orders.</p><p>Write the requirements as numbers first: 50k conversations a day of about 4 turns, p95 first token under <b>2 s</b>, 99.9% availability and at most <b>$8 per 1k requests</b>.</p>",
        key: "A design answer is a story with numbers. Estimate load and cost before you draw a single box.",
        changed: ["+ 50k × 4 = 200k calls/day ≈ 2.3/s avg, 7/s peak", "+ 5,100 tok in, 250 out ≈ $0.014 per call", "~ $14 per 1k, well over the $8 target"],
        metrics: { p95: "—", avail: "—", cost: "$14.00", qps: "7" } },

      { title: "One front door: the gateway", tag: "Idea", add: ["gateway"], links: [["client", "gateway"]], badges: { gateway: "auth · quota · route" },
        text: "<p>Every request enters through a <b>gateway</b>. It checks the user's token, applies per-user and per-tenant <b>rate limits</b>, picks a route, and logs tokens and cost for each call.</p><p>Putting this in one place means model keys never live in the client, and every team gets the same quotas and cost dashboards.</p>",
        flows: [["client", "gateway", "req", { label: "POST /chat", lift: -24 }]],
        metrics: { p95: "80 ms" },
        changed: ["+ Gateway: auth, quotas, routing, cost logs", "~ p95 so far: network + gateway ≈ 80 ms"] },

      { title: "The orchestrator", tag: "Idea", add: ["orch"], links: [["gateway", "orch"]], focus: ["gateway", "orch"], badges: { orch: "prompt + tool loop", gateway: "", docs: "" },
        text: "<p>Behind the gateway sits the <b>orchestrator</b>: your application code. It builds the prompt, calls retrieval and tools, picks a model and checks the output.</p><p>Each request gets a trace ID, and every box below emits spans into that trace, so you can answer \"why did it say that?\" later.</p>",
        flows: [["gateway", "orch", "req", { label: "turn + trace id", lift: -24 }]],
        note: "Here the steps are known in advance (retrieve, look up, answer), so a fixed workflow beats a free-running agent." },

      { title: "Hybrid retrieval", tag: "Solution", add: ["vecdb", "kw"], focus: ["orch", "vecdb", "kw", "docs"],
        links: [["docs", "vecdb", "data", { dashed: true }], ["docs", "kw", "data", { dashed: true, lift: 20 }], ["orch", "vecdb"], ["orch", "kw"]],
        badges: { vecdb: "4.5M chunks", orch: "" },
        text: "<p>The 1M documents become about <b>4.5M chunks</b> of 400 tokens. The orchestrator searches two indexes at once:</p><ul><li><b>Vector DB</b> finds paraphrases (\"my parcel never came\")</li><li><b>Keyword index</b> (BM25) finds exact strings like order <code>#4182</code></li></ul><p>A reranker cuts the top 50 down to 5 chunks for the prompt.</p>",
        flows: [["orch", "vecdb", "req", { label: "embed(q) · top-50" }], ["orch", "kw", "req", { delay: 0.2 }], ["vecdb", "orch", "data", { delay: 1.1 }], ["kw", "orch", "data", { delay: 1.2 }]],
        note: "Filter by language and visibility <b>inside</b> the query. Filtering after retrieval leaks documents and wastes the top-k.",
        metrics: { p95: "430 ms" },
        changed: ["+ Index ≈ 18 GB float32 (≈ 4.5 GB int8)", "+ Rerank 50 → 5", "~ p95 80 → 430 ms"] },

      { title: "Tools: CRM and orders", tag: "Idea", add: ["crm", "orders"], focus: ["orch", "crm", "orders"],
        links: [["orch", "crm"], ["orch", "orders"]], badges: { vecdb: "" },
        text: "<p>\"Where is my order?\" can't be answered from documents. The orchestrator calls two tools in parallel: the <b>CRM</b> for the customer's plan and history, and the <b>orders</b> service for live status.</p><p>Both results go into the prompt as structured fields, not free text.</p>",
        flows: [["orch", "orders", "req", { label: "get_order(4182)" }], ["orch", "crm", "req", { delay: 0.15 }], ["orders", "orch", "data", { delay: 1.1 }], ["crm", "orch", "data", { delay: 1.2 }]],
        note: "Refunds and other writes need customer confirmation and server-side limits. Ticket text is untrusted input.",
        metrics: { p95: "700 ms" },
        changed: ["+ 2 parallel tool calls ≈ 270 ms p95", "~ p95 430 → 700 ms"] },

      { title: "Route easy and hard questions", tag: "Solution", add: ["router", "small", "large"], focus: ["orch", "router", "small", "large"],
        links: [["orch", "router"], ["router", "small"], ["router", "large"]],
        text: "<p>Most questions are easy: opening hours, return windows, order status. A cheap <b>router</b> classifies each turn and sends about 60% to a <b>small model</b> that costs a tenth as much.</p><p>Multi-step or angry conversations go to the <b>large model</b>. The router adds about 200 ms but saves more than half the bill.</p>",
        flows: [["orch", "router", "req"], ["router", "small", "req", { label: "easy · 60%", delay: 0.6 }], ["router", "large", "req", { label: "hard · 40%", delay: 0.9 }]],
        key: "Routing is usually the biggest cost lever. Check on your eval set that the small model's answers stay at the quality bar.",
        metrics: { p95: "900 ms", cost: "$6.44", avail: "99.5%" },
        changed: ["+ Router + small model", "~ Cost per 1k $14.00 → $6.44 (≈ $38k / month)", "~ p95 700 → 900 ms"] },

      { title: "The latency budget fills up", tag: "Problem", focus: ["router", "large"], badges: { large: "prefill 5,100 tok" },
        text: "<p>Now add the model. Prefilling 5,100 input tokens takes about 950 ms at p95, so the path to the first token reaches <b>1,850 ms</b> against a 2,000 ms budget.</p><p>Only 150 ms of headroom is left. One more tool call or a longer prompt would break the target.</p>",
        flows: [["router", "large", "req", { count: 1 }]],
        note: "Summing each part's p95 overestimates the real p95, because parts are rarely all slow at once. It is a safe upper bound for budgeting.",
        metrics: { p95: "1,850 ms" },
        changed: ["+ Prefill ≈ 950 ms p95", "~ p95 900 → 1,850 ms of 2,000"],
        draw: budgetBar },

      { title: "The primary model fails", tag: "Problem", focus: ["router", "large", "orch"], badges: { large: "503 · timeouts" },
        text: "<p>The large model's provider starts returning <code>503</code> errors and hanging requests. Without a plan, every hard question waits for the 20 s timeout and then fails.</p><p>One provider at 99.5% availability means over three hours of failures a month, which already misses the 99.9% SLO.</p>",
        flows: [["router", "large", "req", { count: 1 }], ["large", "router", "miss", { delay: 0.9, lift: 10 }]],
        metrics: { p95: "20,000 ms" },
        changed: ["~ p95 1,850 → 20,000 ms (timeouts)", "- Hard questions fail"] },

      { title: "The fallback chain takes over", tag: "Solution", add: ["secondary", "cache"], focus: ["router", "large", "secondary", "cache"],
        links: [["router", "secondary", "req", { dashed: true }], ["router", "cache", "res", { dashed: true }]],
        badges: { large: "breaker open", secondary: "fallback 1", cache: "fallback 2 · 40% hit" },
        text: "<p>After half of the last 20 calls fail, a <b>circuit breaker</b> opens and the router stops calling the primary. It tries the next option instead:</p><ul><li>a <b>secondary model</b> at another provider, with a prompt you've evaluated</li><li>if that fails too, a <b>cached answer</b> to a near-identical question</li><li>last, an honest \"try again or talk to a person\"</li></ul>",
        flows: [["router", "secondary", "req", { lift: 70 }], ["secondary", "router", "res", { delay: 0.9, lift: 40 }], ["router", "cache", "req", { delay: 1.6, lift: 60 }], ["cache", "router", "res", { delay: 2.4, lift: 12 }]],
        key: "Fallbacks multiply failure rates: two independent 99.5% providers give about 99.997%. Shared causes make the real number lower.",
        metrics: { p95: "1,950 ms", avail: "99.95%" },
        changed: ["+ Circuit breaker, provider B, answer cache", "~ Availability 99.5% → 99.95%", "~ p95 back to 1,950 ms"] },

      { title: "Shed a traffic spike", tag: "Solution", add: ["spike", "bucket"], focus: ["spike", "gateway", "bucket", "client"],
        links: [["spike", "gateway", "req"], ["gateway", "bucket", "data", { dashed: true }]],
        badges: { spike: "+33 req/s", bucket: "B = 20 · r = 5/s", gateway: "429 × 28/s", large: "", secondary: "", cache: "" },
        text: "<p>One tenant's script suddenly sends 33 extra requests a second. If they all reached the providers, the shared quota would run out for every customer.</p><p>The gateway keeps a <b>token bucket</b> per tenant in Redis. That tenant gets a burst of 20, then 5 per second. The rest get <code>429</code> with a <code>Retry-After</code> header.</p>",
        flows: [["spike", "gateway", "req", { count: 4, dur: 1.2 }], ["gateway", "bucket", "data", { delay: 0.4 }], ["gateway", "spike", "miss", { label: "429 Retry-After", delay: 1, count: 3, lift: -20 }], ["client", "gateway", "req", { count: 1, delay: 0.3 }]],
        metrics: { qps: "12" },
        changed: ["~ Offered 40 req/s, admitted 12", "+ Shed 28 req/s at the door", "~ Other tenants unaffected"] },

      { title: "Stream the answer", tag: "Solution", focus: ["large", "router", "orch", "gateway", "client"],
        badges: { client: "first words ≈ 0.9 s", spike: "", bucket: "", gateway: "" },
        text: "<p>A 250-token answer takes several seconds to decode, so the server streams tokens as they're made. The user starts reading at about 0.9 s (p50) instead of staring at a spinner.</p><p>While retrieval runs, the widget shows \"Searching 3 sources...\". Citations link each claim to a chunk ID, and a \"not found\" path beats a guess.</p>",
        flows: [["large", "router", "token", { count: 3, dur: 1.1 }], ["router", "orch", "token", { count: 3, dur: 1.1 }], ["orch", "gateway", "token", { count: 3, dur: 1.1 }], ["gateway", "client", "token", { count: 3, dur: 1.1 }]],
        note: "Little's law sizes the streaming tier: 7 requests/s × 8 s each ≈ 56 open streams at peak.",
        changed: ["+ Server-sent events from model to widget", "+ Progress steps and citations"] },

      { title: "The whole design", tag: "Recap", badges: { client: "" },
        text: "<p>You took a vague request to a design with numbers on every box:</p><ul><li><b>Requirements</b>: 7 QPS peak, 2 s p95, $8 per 1k</li><li><b>Shape</b>: gateway, orchestrator, hybrid retrieval, tools, router</li><li><b>Cost</b>: routing cut $14 to $6.44 per 1k</li><li><b>Resilience</b>: breaker, fallback chain, per-tenant limits</li><li><b>UX</b>: streaming, progress, citations</li></ul>",
        flows: [["client", "gateway", "req", { count: 1 }], ["gateway", "orch", "req", { count: 1 }], ["orch", "vecdb", "req", { count: 1 }], ["orch", "router", "req", { count: 1 }], ["router", "large", "req", { count: 1 }], ["gateway", "client", "token", { count: 2 }]],
        key: "Every box exists to hit one of four numbers: quality, latency, cost or availability. Say which one when you defend it." }
    ],
    learn: [
      "How to turn requirements into QPS, latency and cost numbers",
      "What the gateway and the orchestrator each own",
      "Why hybrid retrieval and tools both feed the prompt",
      "How a model router cuts cost by more than half",
      "How circuit breakers, fallbacks and rate limits keep it up",
      "Why streaming makes a 2 s budget feel fast"
    ]
  };
})();
