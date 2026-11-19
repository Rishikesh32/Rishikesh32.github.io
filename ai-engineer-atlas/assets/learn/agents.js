window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["agents"] = {
  quiz: {
    "agent-loop": [
      { q: "In the agent loop, who actually runs a tool when the model asks for one?",
        choices: ["The model runs it inside its own forward pass",
                  "The provider's API runs every tool on its own servers",
                  "Your harness code runs it and appends the result",
                  "The tool runs itself once its name appears in the text"],
        answer: 2,
        why: "The model only proposes a tool call (a name plus JSON arguments). Your harness decides whether and how it runs, which is why logging and guardrails live there." },
      { q: "Every call resends the whole history, and each step adds roughly the same number of tokens. If a run goes from 10 steps to 20, what happens to the history part of total input tokens?",
        choices: ["It doubles, because each step adds a fixed amount",
                  "It stays flat, because the prefix is cached",
                  "It halves per step, so the total is unchanged",
                  "It roughly quadruples, because it grows with N squared"],
        answer: 3,
        why: "The history term is Δ·N(N+1)/2, which is quadratic in N. That is why long runs need compaction and budgets." },
      { q: "Your task always runs the same three steps: extract fields, validate them, save to the database. A teammate builds a full agent loop for it. What's the better choice?",
        choices: ["A fixed workflow of LLM calls, which is cheaper and easier to test",
                  "The agent loop, because agents handle known steps more reliably",
                  "A multi-agent system with one worker per step",
                  "The agent loop with no step limit, so it can always finish"],
        answer: 0,
        why: "Let the model drive only when the path depends on what it finds. When the steps are known in advance, a workflow is cheaper, faster and more predictable." }
    ],
    "tool-design": [
      { q: "Why do a tool's name, description and schema matter so much to an agent?",
        choices: ["The harness uses them to decide which tools to load",
                  "They are the model's only view of what the tool does and when to use it",
                  "They are shown to end users but hidden from the model",
                  "They only matter for documentation, not for behaviour"],
        answer: 1,
        why: "The model never sees your code. Name, description and schema are sent with every call and steer which tool it picks and what arguments it sends." },
      { q: "Your agent always calls <code>get_user</code>, then <code>get_orders</code>, then <code>get_invoices</code>, in that order. What should you do?",
        choices: ["Add few-shot examples that demonstrate the three-call chain",
                  "Describe the other two tools inside each tool's description",
                  "Merge them into one intent-level tool that chains in code",
                  "Raise the step limit so the chain always has room to finish"],
        answer: 2,
        why: "Per-step errors compound across a chain. If the order is always the same, do the chaining in reliable code behind a single tool." },
      { q: "After a timeout, the agent retries a refund call and the customer gets refunded twice. What's the right fix?",
        choices: ["Tell the model in the system prompt never to retry",
                  "Remove the timeout so calls never need a retry",
                  "Return \"Error 500\" on timeouts so the model gives up",
                  "Make the write idempotent, for example with an idempotency key"],
        answer: 3,
        why: "Agents retry. An idempotent write leaves the same end state when called twice, so a retry can't double-refund. A prompt instruction is not a guarantee." }
    ],
    "planning": [
      { q: "Why does plan-and-execute need a re-planning step?",
        choices: ["A plan written before seeing any data can turn out to be wrong",
                  "Executors cannot follow a numbered list without help",
                  "The planner forgets its own plan after the first step",
                  "Re-planning reduces the total number of LLM calls"],
        answer: 0,
        why: "A plan is a guess made before acting. When results (such as a failing test) contradict it, the remaining steps need revising, as in the demo's \"add step 5\"." },
      { q: "You add a reflection step that asks the model \"Is this code correct?\" without showing it any test output. What should you expect?",
        choices: ["It catches most bugs because the model reads the code again",
                  "It doubles accuracy at the cost of one extra call",
                  "It usually answers yes, so bugs slip through",
                  "It only fails on tasks with more than three steps"],
        answer: 2,
        why: "Reflection is only as good as its signal. With real evidence such as failing tests the critique has something to fix; without it, self-approval is the norm." },
      { q: "When is Tree of Thoughts or best-of-n worth its extra cost?",
        choices: ["On any task, since more samples always help",
                  "On quick single-tool lookups that need low latency",
                  "On tasks where there is no way to check the answers",
                  "On search-like problems where a verifier can score candidates"],
        answer: 3,
        why: "These methods generate many candidates and keep the best, so they need a way to score them and a problem worth searching. Their cost multiplies quickly." }
    ],
    "memory": [
      { q: "What does a model \"remember\" between two API calls?",
        choices: ["The last few turns, which the model caches for you",
                  "Nothing beyond what you send in the next call's context",
                  "Everything since the session started, stored in its weights",
                  "The system prompt, which it keeps permanently"],
        answer: 1,
        why: "The model is stateless. Agent memory is your decision about what to put in each call's context and what to move out to storage." },
      { q: "A long agent run is about to overflow its context window. What's the recommended way to keep going?",
        choices: ["Compact: summarise goal, decisions and exact identifiers, and keep recent turns",
                  "Delete the system prompt to free up room for more history",
                  "Shrink the output reserve to zero so the history fits",
                  "Switch to a bigger model mid-run and resend everything"],
        answer: 0,
        why: "Compaction swaps old turns for a short summary. The output reserve must stay, or replies get cut off, and the system prompt still has to steer the model." },
      { q: "You put the current timestamp at the very top of your system prompt. What goes wrong?",
        choices: ["The model ignores anything placed above its instructions",
                  "The timestamp uses up the output reserve",
                  "The prefix changes on every call, so prompt caching never hits",
                  "The tool definitions get pushed out of the window"],
        answer: 2,
        why: "Caches match an exact prefix. Keep stable content first and append changing content at the end." }
    ],
    "multi-agent": [
      { q: "What is the main benefit of the orchestrator–workers pattern?",
        choices: ["It uses fewer total tokens than a single agent",
                  "Workers can skip the briefs and infer their task",
                  "It guarantees consistency across tightly coupled edits",
                  "Parallel workers, each with a fresh, focused context"],
        answer: 3,
        why: "Workers explore in parallel with clean contexts and send back condensed results. Total tokens go up, not down." },
      { q: "You need one tightly coupled refactor of a single module. Should you split it across four parallel agents?",
        choices: ["Yes, as long as each worker gets the full transcript",
                  "No: workers can't see each other's decisions, so one agent fits better",
                  "Yes: parallel agents always finish faster than one",
                  "No: multi-agent systems are unable to edit code"],
        answer: 1,
        why: "Coupled work goes wrong in parallel because each worker decides in isolation. Build one agent first and split only the parallel, context-hungry part." },
      { q: "In your research system, the lead agent's context fills up after a few rounds. What's the most likely cause?",
        choices: ["Workers return full transcripts instead of condensed results",
                  "The briefs sent to workers are too detailed",
                  "Workers run in parallel instead of in sequence",
                  "There is no judge agent to approve findings"],
        answer: 0,
        why: "Workers should write full artefacts to a shared store and send back short summaries. Piping whole transcripts into the lead defeats the point of separate contexts." }
    ],
    "mcp": [
      { q: "What problem does MCP mainly solve?",
        choices: ["It replaces the agent loop with a standard planner",
                  "It turns N×M custom integrations into N+M: one client per app, one server per tool",
                  "It trains models to use tools without needing schemas",
                  "It encrypts tool results before they reach the model"],
        answer: 1,
        why: "Like the Language Server Protocol, MCP lets any capable host use any server. The loop, memory and guardrails still live in the host." },
      { q: "You write a stdio MCP server and add <code>print()</code> debug logs. What happens?",
        choices: ["The logs appear to the model as extra tool results",
                  "Nothing, because stdio servers ignore stdout",
                  "The host restarts the server after each log line",
                  "Stdout is the message channel, so logs corrupt it; log to stderr"],
        answer: 3,
        why: "With stdio, JSON-RPC messages travel as lines on stdin and stdout. Anything else printed to stdout breaks the stream." },
      { q: "A database schema exposed by URI that the host application reads and puts in context is which MCP primitive?",
        choices: ["A resource, controlled by the application",
                  "A tool, controlled by the model",
                  "A prompt, controlled by the user",
                  "Sampling, offered by the client"],
        answer: 0,
        why: "Resources are readable data by URI (files, schemas, docs) that the application chooses to load. Tools are called by the model, and prompts are templates the user picks." }
    ],
    "computer-use": [
      { q: "The model sees a 1280 px wide screenshot of a 1920 px screen and asks to click (880, 640). Where should the harness click?",
        choices: ["(880, 640)",
                  "(587, 427)",
                  "(1320, 960)",
                  "(1920, 1280)"],
        answer: 2,
        why: "The scale factor is 1920 / 1280 = 1.5, so both coordinates are multiplied by 1.5. Skip this and every click lands somewhere else." },
      { q: "When a browser exposes an accessibility tree, why do many agents prefer it to raw screenshots?",
        choices: ["It shows canvas charts and unlabelled icons more clearly",
                  "It makes the agent immune to prompt injection",
                  "It removes the need to run the agent in a sandbox",
                  "Exact element references are cheaper and more precise than coordinates"],
        answer: 3,
        why: "Acting on an element reference avoids coordinate guessing. Screenshots are still needed for canvases and unlabelled icons, and page text can still carry injected instructions." },
      { q: "Why is it risky to run a browser agent on your own logged-in desktop?",
        choices: ["Page text can hijack it, and it can do anything your accounts allow",
                  "Screenshots of personal desktops are too large for the model",
                  "The accessibility tree is unavailable outside virtual machines",
                  "Coordinate scaling only works correctly inside containers"],
        answer: 0,
        why: "Every page is untrusted input. Run these agents in an isolated VM or container that holds only the accounts the task needs." }
    ],
    "guardrails-hitl": [
      { q: "Why can't a system-prompt line such as \"never delete data\" be your only safety control?",
        choices: ["Providers strip safety instructions out of system prompts",
                  "Models can be wrong, confused or manipulated, so checks must run in code",
                  "System prompts are ignored after the first turn",
                  "The line costs too many tokens on every call"],
        answer: 1,
        why: "Guardrails are code around the model: action checks, isolation and an audit log. They hold even when the model is tricked." },
      { q: "A policy auto-approves <code>run_shell</code> because it's mostly used for <code>ls</code>. What's the flaw?",
        choices: ["The same tool can be harmless or destructive, so the arguments must be checked",
                  "Shell tools should always be marked read-only by name",
                  "<code>ls</code> is itself a dangerous command",
                  "Policies should look only at tool descriptions"],
        answer: 0,
        why: "<code>run_shell(\"ls\")</code> and <code>run_shell(\"rm -rf /\")</code> are the same tool. Policies keyed only on tool names miss dangerous arguments." },
      { q: "An agent reads untrusted web pages, can see private customer data and can send email. What's the most robust fix?",
        choices: ["An input filter that catches every injected instruction",
                  "A system prompt telling it to ignore instructions on web pages",
                  "Break the combination, e.g. allowlist recipients or require approval to send",
                  "A higher spend limit so the agent finishes faster"],
        answer: 2,
        why: "Private data, untrusted input and a way out together create an exfiltration risk. No filter catches everything, so remove one leg by design." }
    ]
  },
  challenges: [
    { id: "loop-run-to-exit",
      widget: "agent-loop-demo",
      goal: "Step the agent until the loop exits on its own. Watch the error step on the way: how does the model recover?",
      hint: "The loop keeps going as long as the model asks for a tool. Keep stepping until a turn has no tool call.",
      success: "The loop ends when the model answers without a tool call; the error came back as an observation, and the context grew at every step.",
      check: function (w) {
        var s = document.getElementById("agent-loop-step");
        return !!s && (s.textContent || "").trim() === "9 / 9";
      } },
    { id: "lint-one-flaw",
      widget: "tool-design-demo",
      goal: "Leave exactly one flaw ticked and still get the 4-call task success to 80% or more.",
      hint: "Two flaws affect bad arguments: one causes them, the other stops the model recovering from them. What if only one of the two is present?",
      success: "Constrained arguments and actionable errors cover for each other; with either one fixed, bad arguments stop sinking the task.",
      check: function (w) {
        var on = ["name", "desc", "enum", "huge", "err", "dup"].filter(function (k) {
          var el = document.getElementById("tool-design-" + k); return el && el.checked;
        });
        if (on.length !== 1) return false;
        var texts = document.querySelectorAll("#tool-design-plot text"), m = null;
        for (var i = 0; i < texts.length && !m; i++) m = (texts[i].textContent || "").match(/4-call task success ~(\d+)%/);
        return !!m && +m[1] >= 80;
      } },
    { id: "plan-cheapest-correct",
      widget: "planning-demo",
      goal: "Get a correct result with 6 or fewer LLM calls.",
      hint: "Plan-and-execute gets it right but costs more. Which strategy uses grounded evidence after its first attempt?",
      success: "Reflection works when the critique is grounded in real test output; it is cheaper here than planning plus re-planning.",
      check: function (w) {
        var texts = document.querySelectorAll("#planning-plot text");
        for (var i = 0; i < texts.length; i++) {
          var m = (texts[i].textContent || "").match(/^(Correct|Wrong but confident) · (\d+) LLM calls/);
          if (m) return m[1] === "Correct" && +m[2] <= 6;
        }
        return false;
      } },
    { id: "ctx-fit-32k",
      widget: "memory-demo",
      goal: "Fit a run of at least 40 steps into the 32k window while keeping an output reserve of at least 8k.",
      hint: "Even 40 compacted steps need about 19k tokens. What else is taking space before the user types anything?",
      success: "A small window means budgeting every tenant: compact the history, trim tool definitions and retrieved docs, and keep the output reserve.",
      check: function (w) {
        if (document.getElementById("memory-window").value !== "32000") return false;
        if (+document.getElementById("memory-steps").value < 40) return false;
        if (+document.getElementById("memory-out").value < 8000) return false;
        var texts = document.querySelectorAll("#memory-plot text");
        for (var i = 0; i < texts.length; i++) if (/^Headroom /.test(texts[i].textContent || "")) return true;
        return false;
      } },
    { id: "multi-fast-and-lean",
      widget: "multi-agent-demo",
      goal: "Find a design whose latency is under 2x one agent run and whose token cost is under 3x one agent.",
      hint: "Only one pattern runs agents in parallel, so its latency stays flat. Now look at how its tokens scale with the number of agents.",
      success: "Parallel workers cut latency, but tokens scale with the number of agents, so add workers only when the breadth pays for them.",
      check: function (w) {
        var t = document.getElementById("multi-agent-readout").textContent || "";
        var r = t.match(/\(([\d.]+)x one agent/), l = t.match(/latency about ([\d.]+)x/);
        return !!(r && l) && +r[1] < 3 && +l[1] < 2;
      } },
    { id: "mcp-http-notification",
      widget: "mcp-demo",
      goal: "Using Streamable HTTP, step to the first client-to-server message that gets no reply.",
      hint: "JSON-RPC requests carry an id and get a response. Look for a message without an id.",
      success: "notifications/initialized has no id, so it gets no reply; over HTTP it is still just a POST body.",
      check: function (w) {
        if (document.getElementById("mcp-transport").value !== "http") return false;
        return (document.getElementById("mcp-step").textContent || "").trim() === "4 / 8";
      } },
    { id: "click-max-aim-error",
      widget: "computer-use-demo",
      goal: "On the 2560 px screen, find the largest aim error that still lands the click on Submit.",
      hint: "First make the click land in the right place at all. Then note that the button is much shorter than it is wide.",
      success: "With correct scaling, screen size stops mattering; what's left is whether the aim error fits inside the target, so small buttons are fragile.",
      check: function (w) {
        if (document.getElementById("computer-use-screen").value !== "2560") return false;
        if (document.getElementById("computer-use-target").value !== "submit") return false;
        if (+document.getElementById("computer-use-err").value < 50) return false;
        return (document.getElementById("computer-use-readout").textContent || "").indexOf("Hit") === 0;
      } },
    { id: "budget-cumulative-limit",
      widget: "guardrails-hitl-demo",
      goal: "Under the Permissive policy, find the highest spend limit at which the $240 refund still goes to a human.",
      hint: "The limit applies to the whole run, not to one call. What has already been spent when the $240 refund comes up?",
      success: "Budgets count cumulative spend: $80 + $240 = $320, so any limit below that still forces review of the second refund.",
      check: function (w) {
        if (document.getElementById("guardrails-hitl-policy").value !== "yolo") return false;
        if (+document.getElementById("guardrails-hitl-budget").value !== 300) return false;
        return (document.getElementById("guardrails-hitl-readout").textContent || "").indexOf("1 sent to a human") >= 0;
      } }
  ]
};
