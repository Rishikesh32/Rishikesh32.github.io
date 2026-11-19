/* Flagship scene: the agent loop, told through one real task
   ("Find why last night's deploy failed and open a fix PR"). Plays on agents/agent-loop.
   Numbers: 3,000-token prefix (system prompt + 5 tool definitions), example prices
   $3 / $15 per million input / output tokens, every call resends the whole history. */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  /* Input tokens sent on each model call (successful run, then the runaway run). */
  var RUN = [3050, 4940, 6230, 7190, 7530, 7890, 8290];
  var RUNAWAY = [3050, 4940, 6230, 7190, 7530, 8490, 8830, 9790, 10130, 11090, 11430, 12390, 12730, 13690, 14030];

  /* Small bar chart in the empty top-right of the stage: input tokens per call. */
  function bars(vals, opt) {
    opt = opt || {};
    return function (svg, c) {
      var o = c.P(5.75, 10.75, 0), x0 = o[0], y0 = o[1];
      var W = 172, H = 64, max = 15000, n = opt.slots || 15, bw = W / n;
      var g = c.el("g", { class: "agent-bars" }, svg);
      c.el("rect", { x: x0 - 10, y: y0 - H - 30, width: W + 20, height: H + 50, rx: 10, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.2" }, g);
      var t = c.el("text", { x: x0, y: y0 - H - 14, style: "fill:var(--ink-2);font-size:10.5px;font-weight:700;letter-spacing:.04em" }, g);
      t.textContent = "INPUT TOKENS PER CALL";
      c.el("line", { x1: x0, y1: y0, x2: x0 + W, y2: y0, style: "stroke:var(--ink-3);stroke-width:1" }, g);
      vals.forEach(function (v, i) {
        var h = Math.max(2, v / max * H), last = i === vals.length - 1;
        var fill = opt.red && i >= 3 ? "var(--signal)" : last ? "var(--accent)" : c.mix("var(--accent)", 45);
        c.el("rect", { x: x0 + i * bw + 1.5, y: y0 - h, width: bw - 3, height: h, rx: 1.5, style: "fill:" + fill }, g);
      });
      if (opt.limit) {
        var lx = x0 + W - 0.5;
        c.el("line", { x1: lx, y1: y0 - H - 4, x2: lx, y2: y0 + 4, style: "stroke:var(--signal);stroke-width:2;stroke-dasharray:3 3" }, g);
      }
      var cap = c.el("text", { x: x0, y: y0 + 14, style: "fill:var(--ink-3);font-size:10px" }, g);
      cap.textContent = opt.caption || ("next call (" + vals.length + "): " + vals[vals.length - 1].toLocaleString("en-US") + " tok");
    };
  }

  window.ATLAS_SCENES["agents/agent-loop"] = {
    unit: 32,
    metrics: [
      { id: "step", label: "Model calls" },
      { id: "tools", label: "Tool calls", tone: "accent" },
      { id: "ctx", label: "Context tokens" },
      { id: "cost", label: "Cost so far", tone: "signal" }
    ],
    legend: { req: "call / run tool", data: "tool_use / tool_result", miss: "failure", res: "answer", token: "approval" },
    nodes: {
      user:    { type: "block", x: -2.15, y: 1.85, w: 1.3, d: 1.3, h: 0.9, color: "t5", label: "You", sub: "on call", icon: "◉" },
      model:   { type: "block", x: 0,    y: -2,   w: 2,   d: 2,   h: 1.4, color: "t2", label: "LLM", sub: "think", icon: "✦" },
      ctx2:    { type: "stack", x: 6.6,  y: 3.3,  w: 1.8, d: 1.4, n: 2, color: "accent", label: "Context" },
      ctx3:    { type: "stack", x: 6.6,  y: 3.3,  w: 1.8, d: 1.4, n: 3, color: "accent", label: "Context" },
      ctx4:    { type: "stack", x: 6.6,  y: 3.3,  w: 1.8, d: 1.4, n: 4, color: "accent", label: "Context" },
      ctx5:    { type: "stack", x: 6.6,  y: 3.3,  w: 1.8, d: 1.4, n: 5, color: "accent", label: "Context" },
      ctx6:    { type: "stack", x: 6.6,  y: 3.3,  w: 1.8, d: 1.4, n: 6, color: "accent", label: "Context" },
      ctx8:    { type: "stack", x: 6.6,  y: 3.3,  w: 1.8, d: 1.4, n: 8, color: "signal", label: "Context" },
      guard:   { type: "slab",  x: 3.4,  y: -6.6, w: 4,   d: 5,   color: "signal", label: "guardrails" },
      harness: { type: "block", x: 4,    y: -6,   w: 2,   d: 2,   h: 1.2, color: "t1", label: "Harness", sub: "act", icon: "⟳" },
      logs:    { type: "stack", x: 3.2,  y: -9.6, w: 1.6, d: 1.2, n: 4, color: "t3", label: "CI logs" },
      repo:    { type: "cyl",   x: 8.5,  y: -8.5, r: 0.8, h: 1.2, color: "t4", label: "Code repo" },
      tests:   { type: "block", x: 11.2, y: -5.8, w: 1.6, d: 1.6, h: 1,   color: "t3", label: "Test runner", icon: "✓" },
      github:  { type: "block", x: 12.7, y: -1.3, w: 1.6, d: 1.6, h: 0.9, color: "t4", label: "GitHub", icon: "⇡" },
      human:   { type: "block", x: 10.35, y: 1.35, w: 1.3, d: 1.3, h: 0.9, color: "t5", label: "Approver", sub: "human", icon: "◉" },
      chartbox: { type: "pill", x: 5.75, y: 11.75 }
    },
    steps: [
      { title: "One call can't do the job", tag: "Problem", add: ["user", "model"],
        text: "<p>Your nightly deploy failed and you ask: <code>Find why last night's deploy failed and open a fix PR.</code></p><p>A single LLM call can't do this. The model can't read the CI logs, can't search your code and can't run the tests. All it can do is reply once, so you get a plausible guess about \"a config issue\".</p>",
        key: "Multi-step work needs the model to act, look at the result and decide again.",
        flows: [["user", "model", "req", { lift: 60 }], ["model", "user", "miss", { label: "a guess", lift: 6, delay: 0.9 }]],
        metrics: { step: "1", tools: "0", ctx: "1,250", cost: "$0.007" } },

      { title: "Put the model in a loop", tag: "Solution", add: ["harness", "ctx2"],
        links: [["ctx2", "model", "req"], ["model", "harness", "data"], ["harness", "ctx2", "data"]],
        badges: { ctx2: "3,050 tok" },
        text: "<p>An agent is the model called in a loop. Each turn:</p><ul><li><b>Think</b>: the model reads the whole context and returns text or a tool call</li><li><b>Act</b>: your harness runs that tool</li><li><b>Observe</b>: the result is appended to the context</li></ul><p>The context starts with the system prompt, 5 tool definitions and your goal: 3,050 tokens.</p>",
        key: "The model only proposes actions. Your harness (about twenty lines of code) decides what actually runs.",
        flows: [["ctx2", "model", "req", { count: 1 }], ["model", "harness", "data", { count: 1, delay: 0.6 }], ["harness", "ctx2", "data", { count: 1, delay: 1.2 }]],
        metrics: { step: "0 / 15", tools: "0", ctx: "3,050", cost: "$0" },
        changed: ["+ Harness with 5 tools", "+ Step limit: 15 model calls"] },

      { title: "Tool 1: read the CI logs", tag: "Idea", add: ["logs"], focus: ["model", "harness", "logs"],
        links: [["harness", "logs"]], badges: { model: "tool_use" },
        text: "<p>The model's first move is to look. It returns a tool call instead of text:</p><p><code>read_ci_logs(run=\"nightly-1142\", tail=200)</code></p><p>The harness runs it and gets back the last 200 lines. The key line is <code>KeyError: 'timeout_ms'</code> raised at <code>config/loader.py:42</code>.</p>",
        flows: [["model", "harness", "data", { label: "read_ci_logs" }], ["harness", "logs", "req", { delay: 0.5 }], ["logs", "harness", "data", { delay: 1.1 }]],
        note: "The tool returns a 200-line tail, not the full 40k-token log. Good tools keep their output small.",
        metrics: { step: "1 / 15", tools: "1", cost: "$0.011" },
        draw: bars(RUN.slice(0, 1), { caption: "call 1: 3,050 tok" }) },

      { title: "The observation joins the context", tag: "Idea", add: ["ctx3"], remove: ["ctx2"], focus: ["ctx3", "model", "harness"],
        links: [["ctx3", "model", "req"], ["harness", "ctx3", "data"]], badges: { model: "think", ctx3: "4,940 tok" },
        text: "<p>The harness appends two messages: the model's tool call and the log output as a <code>tool_result</code>. Then it calls the model again with <b>everything</b>.</p><p>The model has no memory between calls. The context is its memory, so it grows on every turn: 3,050 → 4,940 tokens.</p>",
        flows: [["harness", "ctx3", "data", { label: "tool_result" }], ["ctx3", "model", "req", { label: "call 2", delay: 0.9 }]],
        key: "Each call resends the whole history, so total input tokens grow roughly quadratically with the number of steps.",
        metrics: { ctx: "4,940" },
        changed: ["+ tool_use message: 90 tok", "+ tool_result: 1,800 tok", "~ Context 3,050 → 4,940"],
        draw: bars(RUN.slice(0, 2)) },

      { title: "Tool 2: search the code", tag: "Idea", add: ["repo", "ctx4"], remove: ["ctx3"], focus: ["model", "harness", "repo", "ctx4"],
        links: [["ctx4", "model", "req"], ["harness", "ctx4", "data"], ["harness", "repo"]], badges: { model: "tool_use", ctx4: "6,230 tok" },
        text: "<p>With the error in context, the model searches for the key:</p><p><code>search_code(query=\"timeout_ms\")</code></p><p>Three hits come back. Yesterday's commit <code>a41f9c2</code> renamed <code>timeout</code> to <code>timeout_ms</code> in <code>loader.py</code>, but <code>deploy/prod.yaml</code> still sets the old <code>timeout</code> key.</p>",
        flows: [["model", "harness", "data", { label: "search_code" }], ["harness", "repo", "req", { delay: 0.5 }], ["repo", "harness", "data", { delay: 1.1 }], ["harness", "ctx4", "data", { delay: 1.7 }]],
        metrics: { step: "2 / 15", tools: "2", ctx: "6,230", cost: "$0.027" },
        changed: ["+ tool_result: 1,200 tok", "~ Context 4,940 → 6,230"],
        draw: bars(RUN.slice(0, 3)) },

      { title: "Tool 3: the tests fail", tag: "Problem", add: ["tests", "ctx5"], remove: ["ctx4"], focus: ["model", "harness", "tests", "ctx5"],
        links: [["ctx5", "model", "req"], ["harness", "ctx5", "data"], ["harness", "tests"]], badges: { tests: "1 failed", ctx5: "7,190 tok" },
        text: "<p>Before changing anything, the model reproduces the bug:</p><p><code>run_tests(path=\"tests/config\")</code></p><p><code>test_load_prod_config</code> fails with the same <code>KeyError</code>. A failure is still useful. It goes into the context as an observation and confirms what the code search found.</p>",
        flows: [["model", "harness", "data", { label: "run_tests" }], ["harness", "tests", "req", { delay: 0.5 }], ["tests", "harness", "miss", { label: "1 failed", delay: 1.1 }], ["harness", "ctx5", "miss", { delay: 1.7 }]],
        note: "Turn tool errors into observations (<code>is_error: true</code>) instead of crashing the loop. The model can often fix what it can see.",
        metrics: { step: "3 / 15", tools: "3", ctx: "7,190", cost: "$0.046" },
        draw: bars(RUN.slice(0, 4)) },

      { title: "Fix the code and retry", tag: "Solution", add: ["ctx6"], remove: ["ctx5"], focus: ["model", "harness", "repo", "ctx6"],
        links: [["ctx6", "model", "req"], ["harness", "ctx6", "data"]], badges: { model: "tool_use", repo: "+3 −1", ctx6: "7,530 tok" },
        text: "<p>Now the model writes the fix:</p><p><code>edit_file(\"config/loader.py\", ...)</code></p><p>The loader reads <code>timeout_ms</code> and falls back to the old <code>timeout</code> key with a deprecation warning, so the existing YAML keeps working. The harness applies the edit on a branch and reports a 4-line diff.</p>",
        flows: [["model", "harness", "data", { label: "edit_file" }], ["harness", "repo", "req", { delay: 0.5 }], ["repo", "harness", "data", { label: "ok", delay: 1.1 }], ["harness", "ctx6", "data", { delay: 1.7 }]],
        metrics: { step: "4 / 15", tools: "4", ctx: "7,530", cost: "$0.071" },
        draw: bars(RUN.slice(0, 5)) },

      { title: "Tests pass: a stop condition", tag: "Solution", focus: ["model", "harness", "tests", "ctx6"],
        badges: { tests: "214 passed", repo: "", model: "done?", ctx6: "7,890 tok" },
        text: "<p>The model runs the same tests again. All 214 pass.</p><p>That's the signal the model was working toward. A loop only ends when something tells it to stop:</p><ul><li>the model answers instead of calling a tool</li><li>a step, budget, time or error limit fires</li></ul><p>Here the job isn't finished until the fix is in a PR.</p>",
        flows: [["model", "harness", "data", { label: "run_tests" }], ["harness", "tests", "req", { delay: 0.5 }], ["tests", "harness", "res", { label: "214 passed", delay: 1.1 }]],
        key: "Give the agent a check it can run itself, like tests. A verifiable goal is what lets the loop end on success.",
        metrics: { step: "5 / 15", tools: "5", ctx: "7,890", cost: "$0.095" },
        changed: ["~ Tests: 1 failed → 214 passed"],
        draw: bars(RUN.slice(0, 6)) },

      { title: "Guardrails before real actions", tag: "Solution", add: ["guard", "github", "human"], focus: ["guard", "harness", "human", "github", "user", "model"],
        links: [["harness", "github"], ["harness", "human", "token", { dashed: true }]],
        badges: { tests: "", model: "answer", harness: "6 / 15 · $0.12 / $1", github: "PR #1287" },
        text: "<p>The model asks for <code>create_pull_request</code>. That writes to GitHub, so the harness checks its guardrails first:</p><ul><li><b>Step limit</b>: call 6 of 15</li><li><b>Budget</b>: $0.12 of $1.00</li><li><b>Approval</b>: write actions pause for a human</li></ul><p>You approve, PR #1287 opens, and on call 7 the model answers with a summary and the link.</p>",
        flows: [["harness", "human", "token", { label: "approve?", count: 1 }], ["human", "harness", "res", { count: 1, delay: 0.9 }], ["harness", "github", "req", { label: "open PR", delay: 1.6 }], ["model", "user", "res", { label: "final answer", delay: 2.2 }]],
        note: "Read-only tools (logs, search, tests) run freely. Anything that changes the outside world goes through the approval gate.",
        metrics: { step: "7 / 15", tools: "6", ctx: "8,290", cost: "$0.15" },
        changed: ["+ Approval gate on create_pull_request", "+ PR #1287 opened", "+ Final answer after 7 calls"],
        draw: bars(RUN, { caption: "call 7: 8,290 tok" }) },

      { title: "When the loop doesn't converge", tag: "Problem", add: ["ctx8"], remove: ["ctx6"], focus: ["model", "harness", "repo", "tests", "ctx8", "guard"],
        unlink: [["ctx6", "model"], ["harness", "ctx6"]],
        links: [["ctx8", "model", "req"], ["harness", "ctx8", "data"]],
        badges: { model: "retry…", harness: "15 / 15 · STOP", tests: "fail ×6", github: "", ctx8: "14,030 tok" },
        text: "<p>Now replay the run with a worse fix. The model edits, the tests fail, it edits again, the tests fail again. It never converges.</p><p>The <b>step limit</b> catches it. After 15 calls the harness stops and returns <code>Stopped: step limit reached</code> with the failing test, so a person can take over.</p>",
        flows: [["model", "harness", "data", { label: "edit_file", dur: 1.2 }], ["harness", "repo", "req", { dur: 1.2, delay: 0.3 }], ["harness", "tests", "req", { dur: 1.2, delay: 0.6 }], ["tests", "harness", "miss", { label: "failed", dur: 1.2, delay: 0.9 }], ["harness", "ctx8", "miss", { dur: 1.2, delay: 1.2 }]],
        key: "Every loop needs exits. Without the limit, 200 calls would send about 14 million input tokens, roughly $42 at these prices.",
        note: "A repeated-error limit (e.g. stop after the same test fails 3 times) would have ended this run even sooner.",
        metrics: { step: "15 / 15", tools: "15", ctx: "14,030", cost: "$0.45" },
        changed: ["~ 15 calls instead of 7", "~ Cost $0.15 → $0.45", "+ Stopped by step limit"],
        draw: bars(RUNAWAY, { red: true, limit: true, caption: "stopped at the 15-call limit" }) },

      { title: "The whole loop", tag: "Recap", remove: ["ctx8"], add: ["ctx6"],
        unlink: [["ctx8", "model"], ["harness", "ctx8"]],
        links: [["ctx6", "model", "req"], ["harness", "ctx6", "data"], ["harness", "repo"], ["harness", "tests"]],
        badges: { model: "", harness: "", tests: "", ctx6: "", github: "PR #1287" },
        text: "<p>One goal, seven model calls, six tool calls, one PR. Every agent is this loop:</p><ul><li><b>Think</b>: the model picks a tool or answers</li><li><b>Act</b>: the harness runs it, with guardrails</li><li><b>Observe</b>: the result grows the context</li><li><b>Stop</b>: an answer, or a step, budget or error limit</li></ul><p>If you already know the steps, a fixed workflow is cheaper and easier to test.</p>",
        flows: [["ctx6", "model", "req", { count: 1 }], ["model", "harness", "data", { count: 1 }], ["harness", "logs", "req", { count: 1 }], ["harness", "repo", "req", { count: 1 }], ["harness", "tests", "req", { count: 1 }], ["harness", "ctx6", "data", { count: 1 }]],
        metrics: { step: "7 / 15", tools: "6", ctx: "8,290", cost: "$0.15" },
        draw: bars(RUN, { caption: "7 calls · 45,120 input tok total" }) }
    ],
    learn: [
      "Why one LLM call can't do multi-step work",
      "The think, act, observe loop and who runs the tools",
      "Why the context grows on every turn",
      "How failures become observations the model can fix",
      "Which stop conditions and guardrails every agent needs"
    ]
  };
})();

/* Overview scene: how an agent gets real work done (plays on the AI agents overview). */
window.ATLAS_SCENES["agents/overview"] = {
  unit: 32,
  metrics: [
    { id: "steps", label: "Agent steps" },
    { id: "tools", label: "Tool calls" },
    { id: "ctx", label: "Context tokens", tone: "accent" },
    { id: "cost", label: "Cost so far", tone: "signal" }
  ],
  legend: { req: "goal / action", res: "result", data: "observation / memory", miss: "blocked / limit" },
  nodes: {
    user:    { type: "block", x: 0,    y: 0,    w: 1.5, d: 1.5, h: 0.9, color: "t5", label: "You", icon: "◉" },
    agent:   { type: "block", x: 4,    y: 0,    w: 2.2, d: 2.2, h: 1.8, color: "t3", label: "Agent", sub: "LLM" },
    harness: { type: "block", x: 8.4,  y: 0.1,  w: 2.0, d: 2.0, h: 1.0, color: "t2", label: "Harness" },
    db:      { type: "cyl",   x: 13.4, y: -2.6, r: 0.8, h: 1.1, color: "t4", label: "CRM" },
    code:    { type: "block", x: 12.6, y: 1.2,  w: 1.6, d: 1.6, h: 1.0, color: "t1", label: "Code runner" },
    mcp:     { type: "block", x: 8.6,  y: -4.6, w: 1.8, d: 1.4, h: 0.8, color: "accent", label: "MCP server" },
    search:  { type: "cyl",   x: 13.2, y: -6.2, r: 0.7, h: 0.9, color: "t4", label: "Web search" },
    memory:  { type: "stack", x: 4.4,  y: 4.4,  w: 1.6, d: 1.2, n: 3, color: "t1", label: "Memory" },
    worker:  { type: "block", x: 4.2,  y: -4.6, w: 1.6, d: 1.4, h: 1.0, color: "t3", label: "Worker agent" },
    human:   { type: "block", x: 0.2,  y: 4.2,  w: 1.4, d: 1.4, h: 0.9, color: "good", label: "Approver" }
  },
  steps: [
    { title: "A goal, not a question", tag: "Problem", add: ["user", "agent"], links: [["user", "agent"]],
      text: "<p>You ask: <i>find customers likely to cancel this month and draft a check-in email for each</i>. That needs data lookups, a calculation and writing. One model call can't do all of it.</p>",
      flows: [["user", "agent", "req", { label: "find churn risks + draft emails" }]],
      metrics: { steps: "0", tools: "0", ctx: "2,100", cost: "$0.00" } },
    { title: "The loop: think, act, observe", tag: "Idea", add: ["harness"], links: [["agent", "harness"]], focus: ["agent", "harness"],
      text: "<p>The model doesn't run anything itself. It proposes an <b>action</b> as a tool call. The <b>harness</b>, your code, runs it and returns the result as an <b>observation</b>. Then the model decides the next step.</p>",
      flows: [["agent", "harness", "req", { label: "tool call" }], ["harness", "agent", "data", { label: "observation", delay: 0.8 }]],
      key: "An agent is a model in a loop with tools. Your code decides what actually runs.",
      metrics: { steps: "1" } },
    { title: "Tools do the real work", tag: "Idea", add: ["db", "code"], links: [["harness", "db"], ["harness", "code"]], focus: ["harness", "db", "code"],
      text: "<p>Step 2 queries the CRM for accounts with falling usage. Step 3 runs a small scoring script. Each result comes back as text the model can read.</p>",
      flows: [["harness", "db", "req", { label: "query usage" }], ["db", "harness", "res"], ["harness", "code", "req", { label: "score churn", delay: 0.9 }], ["code", "harness", "res", { delay: 1.4 }]],
      metrics: { steps: "3", tools: "2", ctx: "6,800", cost: "$0.04" } },
    { title: "Context grows every step", tag: "Idea", add: ["memory"], links: [["agent", "memory", "data", { dashed: true }]], focus: ["agent", "memory"], badges: { memory: "notes" },
      text: "<p>Every observation is appended to the context, so each call costs more. Good agents <b>summarise</b> old steps and keep durable facts in <b>memory</b> instead of rereading everything.</p>",
      flows: [["harness", "memory", "data", { label: "save findings" }], ["memory", "agent", "data", { delay: 0.8 }]],
      metrics: { ctx: "4,900" },
      changed: ["~ Context compacted 6,800 → 4,900 tokens"] },
    { title: "MCP plugs in more tools", tag: "Idea", add: ["mcp", "search"], links: [["harness", "mcp"], ["mcp", "search"]], focus: ["harness", "mcp", "search"],
      text: "<p>The <b>Model Context Protocol</b> lets the harness discover tools from separate servers. Here an MCP server exposes web search, used to check each customer's latest news.</p>",
      flows: [["harness", "mcp", "req", { label: "tools/call" }], ["mcp", "search", "req", { delay: 0.6 }], ["search", "mcp", "res", { delay: 1.2 }]],
      metrics: { steps: "5", tools: "4", ctx: "7,200", cost: "$0.08" } },
    { title: "Hand off to a worker", tag: "Idea", add: ["worker"], links: [["agent", "worker", "req", { dashed: true }]], focus: ["agent", "worker"],
      text: "<p>Drafting 12 emails is separate, parallel work. The orchestrator hands it to a <b>worker agent</b> with a short brief, then reviews what comes back.</p>",
      flows: [["agent", "worker", "req", { label: "draft 12 emails" }], ["worker", "agent", "res", { label: "12 drafts", delay: 1.2 }]],
      metrics: { steps: "7", cost: "$0.13" } },
    { title: "A human approves the risky step", tag: "Solution", add: ["human"], links: [["agent", "human"]], focus: ["agent", "human"],
      text: "<p>Sending email is hard to undo, so the harness pauses for <b>approval</b>. You review the drafts and approve 11 of 12.</p>",
      flows: [["agent", "human", "req", { label: "approve sending?" }], ["human", "agent", "res", { label: "11 approved", delay: 1.0 }]],
      note: "Approvals, step limits and budgets are guardrails in the harness, not in the prompt." },
    { title: "When the loop won't stop", tag: "Problem", focus: ["agent", "harness"],
      text: "<p>In a bad run, the model keeps retrying a failing query. The harness enforces a <b>step limit</b> and a <b>budget</b>, stops the run and reports what happened, so it doesn't loop forever.</p>",
      flows: [["agent", "harness", "miss", { label: "step 15 / 15: stopped" }]],
      metrics: { steps: "15", cost: "$0.31" } },
    { title: "The whole agent", tag: "Recap",
      text: "<p>A model in a loop, with tools, memory and guardrails around it. The lessons in this area take each part in turn:</p><ul><li>The <b>loop</b> and <b>tool design</b></li><li><b>Planning</b>, <b>memory</b> and <b>context</b></li><li><b>Multi-agent</b> systems and <b>MCP</b></li><li><b>Computer use</b> and <b>guardrails</b></li></ul>",
      flows: [["user", "agent", "req", { count: 1 }], ["agent", "harness", "req", { count: 1 }], ["harness", "db", "req", { count: 1 }], ["harness", "agent", "data", { count: 1 }], ["agent", "human", "req", { count: 1 }]],
      metrics: { steps: "8", cost: "$0.15" } }
  ],
  learn: [
    "Why an agent is a model in a loop with tools",
    "How the harness runs tools and returns observations",
    "How memory and compaction keep context small",
    "How MCP and worker agents extend an agent",
    "Why guardrails and approvals live in your code"
  ]
};
