/* Flagship scene: anatomy of one LLM API call (plays on the LLM APIs overview). */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
window.ATLAS_SCENES["llm-apis/overview"] = {
  unit: 34,
  metrics: [
    { id: "in", label: "Input tokens" },
    { id: "ttft", label: "First token", tone: "accent" },
    { id: "out", label: "Output tokens" },
    { id: "cost", label: "Cost / call", tone: "signal" }
  ],
  legend: { req: "request", token: "streamed tokens", data: "tool call / result" },
  nodes: {
    user:  { type: "block", x: 0,   y: 0,   w: 1.4, d: 1.4, h: 0.9, color: "t5", label: "User", icon: "◉" },
    app:   { type: "block", x: 3.2, y: 0,   w: 2,   d: 2,   h: 1.2, color: "t1", label: "Your app" },
    api:   { type: "block", x: 7,   y: 0,   w: 2,   d: 2,   h: 1.4, color: "t2", label: "Model API" },
    cache: { type: "slab",  x: 6.6, y: -0.4, w: 2.8, d: 2.8, color: "good", label: "prompt cache" },
    gpu:   { type: "block", x: 11,  y: 0,   w: 2.2, d: 2.2, h: 1.8, color: "t3", label: "LLM", sub: "on GPUs" },
    db:    { type: "cyl",   x: 4.2, y: 4.4, r: 0.85, h: 1.3, color: "t4", label: "Orders DB" }
  },
  steps: [
    { title: "A user asks a question", tag: "Problem", add: ["user", "app"],
      text: "<p>A customer types <code>Where is my order #4182?</code> into your support chat. Your app has about a second before the wait starts to feel slow.</p><p>Follow this one request all the way through. Every step adds either time or cost.</p>",
      key: "An LLM call is a network request like any other. It has a payload, a price and a latency budget.",
      flows: [["user", "app", "req"]],
      metrics: { in: "—", ttft: "—", out: "—", cost: "—" } },
    { title: "Build the messages", tag: "Idea", focus: ["app"], badges: { app: "1,850 tok" },
      text: "<p>The model only sees what you send. Your app assembles a <b>system prompt</b> (role and rules), the conversation so far, tool definitions and the new question.</p>",
      note: "Most of those 1,850 tokens are the system prompt and tool definitions. They're identical on every call, which matters in step 7.",
      changed: ["+ System prompt + tools ≈ 1,600 tokens", "+ History + question ≈ 250 tokens"],
      metrics: { in: "1,850" } },
    { title: "Send it to the API", tag: "Idea", add: ["api"], links: [["app", "api"]],
      text: "<p>One HTTPS request carries the messages, the model name, <code>max_tokens</code> and settings like temperature. The API checks your key and your rate limit, then queues the request for a GPU.</p>",
      flows: [["app", "api", "req", { label: "POST /messages" }]],
      note: "A <code>429</code> here means you hit a rate limit. Retry with exponential backoff and jitter." },
    { title: "Prefill the prompt", tag: "Idea", add: ["gpu"], links: [["api", "gpu"]], focus: ["gpu"], badges: { gpu: "prefill" },
      text: "<p>The model tokenizes the prompt and processes all 1,850 tokens <b>in parallel</b>. This is the <b>prefill</b> phase, and it builds the KV cache.</p><p>Nothing can come back until prefill finishes, so a longer prompt means a longer wait for the first token.</p>",
      flows: [["api", "gpu", "req"]],
      metrics: { ttft: "≈ 380 ms" } },
    { title: "Stream tokens back", tag: "Solution", badges: { gpu: "decode" },
      text: "<p>Now the model <b>decodes</b> one token at a time. With streaming on, each token is sent as soon as it's ready, so the user starts reading after about 0.4 s and doesn't wait for the full 240-token answer.</p>",
      flows: [["gpu", "api", "token", { count: 3, dur: 1.1 }], ["api", "app", "token", { count: 3, dur: 1.1 }], ["app", "user", "token", { count: 3, dur: 1.1 }]],
      key: "Streaming doesn't make the model faster. It makes the wait feel shorter because the first words show up quickly.",
      metrics: { out: "240", cost: "$0.0092" },
      changed: ["~ Perceived wait: 4.2 s → 0.4 s", "+ Cost at example prices ($3 / $15 per M tokens)"] },
    { title: "The model asks for a tool", tag: "Idea", add: ["db"], focus: ["app", "db", "api", "gpu"],
      text: "<p>The order status isn't in the prompt, so the model doesn't guess. It returns a <b>tool call</b>: <code>get_order(id=\"4182\")</code>. <b>Your app</b> runs it against the database and sends the result back in a second request.</p>",
      flows: [["api", "app", "data", { label: "tool_use" }], ["app", "db", "req"], ["db", "app", "data"], ["app", "api", "data", { label: "tool_result", delay: 0.8 }]],
      note: "The model never touches your database. It only asks, and your code decides what actually runs.",
      changed: ["+ 1 extra round trip", "~ Total time ≈ 1.6 s"] },
    { title: "Cache the repeated prefix", tag: "Solution", add: ["cache"], focus: ["api", "cache", "gpu"],
      text: "<p>The 1,600-token system prompt and tool definitions are the same on every call. With <b>prompt caching</b>, the provider keeps their processed form, so later calls skip that part of prefill.</p>",
      flows: [["app", "api", "req"], ["api", "gpu", "req", { dur: 0.8 }]],
      metrics: { ttft: "≈ 150 ms", cost: "$0.0048" },
      changed: ["+ Cache hit on 1,600 tokens", "~ First token 380 → 150 ms", "~ Cost per call −48%"],
      key: "Put stable content first and the parts that change last, so the prefix stays the same and can be cached." },
    { title: "The whole path", tag: "Recap",
      text: "<p>One question touched the user, your app, the API, the GPUs and a tool. Engineering an LLM feature means owning each hop:</p><ul><li><b>Prompt</b>: what you send, and its size</li><li><b>Latency</b>: prefill, streaming, round trips</li><li><b>Cost</b>: tokens in and out, and caching</li><li><b>Reliability</b>: rate limits, retries, tool errors</li></ul><p>The lessons in this area take each hop in turn.</p>",
      flows: [["user", "app", "req", { count: 1 }], ["app", "api", "req", { count: 1 }], ["api", "gpu", "req", { count: 1 }], ["gpu", "api", "token", { count: 2 }], ["api", "app", "token", { count: 2 }], ["app", "user", "token", { count: 2 }]] }
  ],
  learn: [
    "What's inside an API request",
    "Why prefill sets the time to first token",
    "How streaming changes the perceived wait",
    "How a tool call adds a round trip",
    "How prompt caching cuts cost and latency"
  ]
};
