window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["system-design"] = {
  quiz: {
    "patterns": [
      { q: "An editor copilot shows ghost-text completions while you type. Which part of the design is the hard part?",
        choices: [
          "Ingesting millions of documents and filtering them by permission",
          "A context builder and a small fill-in-the-middle model answering in a few hundred ms",
          "A durable job queue with idempotent workers and a dead-letter queue",
          "An agent loop with step budgets and approval gates for every edit"
        ],
        answer: 1,
        why: "Inline completions must land in roughly 100 to 400 ms, so latency dominates: a small model fed by a smart context builder. Ingestion, queues and agent loops are the hard parts of other patterns." },
      { q: "A ticket flow always runs the same three steps: classify the ticket, retrieve the matching policy, draft a reply. What should you build?",
        choices: [
          "An autonomous agent that decides which step to take next",
          "A multi-agent system with one specialised agent per step",
          "A nightly batch job that processes all tickets at once",
          "A fixed workflow where your code runs the steps in order"
        ],
        answer: 3,
        why: "When the steps are known in advance, a workflow (code decides the steps) is simpler, cheaper and easier to test. Use an agent only when the steps cannot be known ahead of time." },
      { q: "An enterprise RAG search must never show employees documents they are not allowed to see. Where should the permission check live?",
        choices: [
          "Inside the retrieval query, filtering by the user's access list",
          "In the system prompt, telling the model to skip restricted files",
          "After generation, by scanning the answer for restricted titles",
          "In the UI, by hiding citations that point to restricted files"
        ],
        answer: 0,
        why: "Filtering inside the query means restricted chunks never reach the model. Prompt instructions and after-the-fact filtering can leak content the model has already read." }
    ],
    "tradeoffs": [
      { q: "An answer has 400 output tokens at about 25 ms per token. Which change cuts total latency the most?",
        choices: [
          "Moving the vector index onto faster disks",
          "Shaving 50 ms off the network and gateway hop",
          "Asking for a concise answer capped at about 150 tokens",
          "Adding a reranker so the retrieved chunks are better"
        ],
        answer: 2,
        why: "Decode costs N_out × TPOT: 400 × 25 ms is 10 s, which dwarfs everything else. Fewer output tokens is the cheapest speed-up; a reranker actually adds latency." },
      { q: "A request waits on 10 parallel calls, and each call is slow 1% of the time. Roughly how often is the whole request slow?",
        choices: [
          "About 1% of the time, the same as one call",
          "About 10% of the time",
          "About 0.1% of the time, since slowness averages out",
          "Never, because the calls run in parallel"
        ],
        answer: 1,
        why: "The request is slow if any call is slow: \\(1-(1-0.01)^{10} \\approx 9.6\\%\\). Fan-out amplifies tail latency instead of hiding it." },
      { q: "Your prompt starts with the current timestamp and the user's name, followed by a long fixed system prompt and tool definitions. What is wrong?",
        choices: [
          "Nothing; the order of prompt content does not affect cost",
          "The model will ignore the system prompt if it is not first",
          "Timestamps make the model hallucinate dates in its answers",
          "Dynamic content at the top breaks prefix caching for everything after it"
        ],
        answer: 3,
        why: "Prefix caching only matches an identical prefix, so stable content (system prompt, tools) must come first. Dynamic text at the top makes every request a cache miss." }
    ],
    "resilience": [
      { q: "In a token-bucket rate limiter, what do the capacity B and the refill rate r each control?",
        choices: [
          "B sets the largest burst you admit; r sets the sustained throughput",
          "B sets the sustained throughput; r sets the largest burst you admit",
          "B is the maximum number of retries; r is the backoff multiplier",
          "Both only decide how long a client must wait after a 429"
        ],
        answer: 0,
        why: "A full bucket lets B requests through at once, and over a window t it admits at most B + r·t, so in the long run throughput is set by r." },
      { q: "A call to your model provider returns HTTP 400 (bad request). What should your retry wrapper do?",
        choices: [
          "Retry immediately, up to three times",
          "Retry with exponential backoff and full jitter",
          "Fail fast without retrying, since the same request will fail again",
          "Wait for the circuit breaker to close, then resend it"
        ],
        answer: 2,
        why: "Retry only errors that can succeed next time (429, 5xx, timeouts). A 400 means the request itself is wrong, so retrying only adds load." },
      { q: "Two providers at 99.5% each, used as a fallback chain, give 99.9975% on paper. Why is the real number usually lower?",
        choices: [
          "Fallback availability multiplies the two availabilities, giving about 99%",
          "Their failures are correlated: shared regions, an over-long prompt or traffic spikes hit both",
          "The secondary provider always rate-limits traffic that fails over to it",
          "Every fallback hop adds a timeout, which counts as downtime"
        ],
        answer: 1,
        why: "The formula \\(1-\\prod(1-a_i)\\) assumes independent failures. Shared causes make both fail together, pulling availability back towards the primary's own." }
    ],
    "ux": [
      { q: "Streaming does not change when the full answer finishes. Why does it still make the product feel faster?",
        choices: [
          "It makes decoding faster because tokens are sent in smaller packets",
          "It lowers the cost per request, so you can afford a faster model",
          "It removes the need to cap the answer with max_tokens",
          "Users start reading at the first token, so the perceived wait shrinks to TTFT"
        ],
        answer: 3,
        why: "Perceived latency becomes the time to first token instead of the total, which keeps answers inside the 1 to 10 second attention window." },
      { q: "An assistant writes replies to customers' emails. Which autonomy level fits best?",
        choices: [
          "Draft the reply and let a person review and approve it before sending",
          "Send automatically and record the message in an audit log",
          "Send automatically, with an undo button that works for 24 hours",
          "Refuse to draft at all, because email is too risky for AI"
        ],
        answer: 0,
        why: "Autonomy should follow the cost and reversibility of a mistake. A sent email cannot be unsent, so draft-and-approve keeps the value while a human catches errors." },
      { q: "Your team wants to show \"87% confident\" next to each answer, taken from the model's own estimate. What is the problem?",
        choices: [
          "Percentages are fine but should be rounded to the nearest 10%",
          "Users ignore numbers, so it has no effect either way",
          "An uncalibrated number teaches users to trust wrong answers; sources and dates work better",
          "Confidence numbers must be computed in the browser, not on the server"
        ],
        answer: 2,
        why: "The goal is calibrated trust. A number that does not track real accuracy misleads; concrete cues such as \"based on 2 sources, updated March\" let users judge." }
    ],
    "case-studies": [
      { q: "Peak traffic is 10 requests per second and each streamed answer takes 6 s. About how many concurrent streams must you support?",
        choices: ["About 16", "About 60", "About 1.7", "About 600"],
        answer: 1,
        why: "Little's law: \\(L = \\lambda W = 10 \\times 6 = 60\\) requests in flight. This sizes streams, workers and sandboxes." },
      { q: "A coding agent reads untrusted issue text and repository files. Where should its safety boundary live?",
        choices: [
          "In a system prompt that forbids pushing to the main branch",
          "In an LLM judge that reviews each step before it runs",
          "In the pull-request description, so reviewers see the risks",
          "In the sandbox, the network allow-list and a narrowly scoped token"
        ],
        answer: 3,
        why: "The model decides the steps; the architecture decides what those steps can possibly do. Prompt rules and judges can be bypassed by untrusted text, so put safety in the environment." },
      { q: "One model call in your agent design costs $0.04. What is the most common mistake when estimating the monthly bill?",
        choices: [
          "Forgetting to multiply by the many model calls each task makes",
          "Using prices per million tokens instead of per thousand",
          "Counting output tokens, which are usually free",
          "Including cached input, which is never billed"
        ],
        answer: 0,
        why: "An agent may make 10 to 50 calls per task, so per-call cost hides most of the bill. Output costs more than input, and cached input is discounted, not free." }
    ]
  },
  challenges: [
    { id: "sd-pattern-copilot",
      widget: "patterns-explorer",
      goal: "Find the pattern whose latency target is a few hundred milliseconds and whose hard part is the context builder plus a small model.",
      hint: "Which product has to keep up with someone typing?",
      success: "Editor copilots live or die on latency, so a small model and a smart context builder are the hard part.",
      check: function (w) {
        var s = document.getElementById("patterns-explorer-sel");
        return !!s && s.value === "copilot";
      } },
    { id: "sd-latency-full-3s",
      widget: "tradeoffs-latency",
      goal: "Measure to the full response and get at least 95% of requests under a target of 3,000 ms or less.",
      hint: "Decode time is output tokens divided by decode speed, and it dwarfs every other bar.",
      success: "Total latency is dominated by decode, so fewer output tokens or faster decoding is the biggest lever.",
      check: function (w) {
        var mode = document.getElementById("tradeoffs-latency-mode");
        var tg = document.getElementById("tradeoffs-latency-target");
        var r = document.getElementById("tradeoffs-latency-readout");
        if (!mode || !tg || !r || mode.value !== "full" || +tg.value > 3000) return false;
        var m = r.textContent.match(/([\d.]+)% of requests meet/);
        return !!m && parseFloat(m[1]) >= 95;
      } },
    { id: "sd-bucket-absorb-burst",
      widget: "resilience-bucket",
      goal: "Keep the burst on and traffic at 2.5 req/s or more. Accept every single request while keeping the refill rate no higher than the traffic.",
      hint: "Refill pays for steady traffic; something else has to absorb 15 requests arriving at once.",
      success: "Capacity is the burst you tolerate and refill is the sustained rate: a bigger bucket absorbs spikes without raising throughput.",
      check: function (w) {
        var b = document.getElementById("resilience-bucket-burst");
        var load = +document.getElementById("resilience-bucket-load").value;
        var rate = +document.getElementById("resilience-bucket-rate").value;
        var m = document.getElementById("resilience-bucket-readout").textContent.match(/Accepted (\d+) of (\d+)/);
        return !!(b && b.checked && load >= 2.5 && rate <= load && m && +m[2] > 0 && m[1] === m[2]);
      } },
    { id: "sd-fallback-99",
      widget: "resilience-chain",
      goal: "With both providers failing at least 10% of the time and the cache hit rate at 40% or less, get the expected AI-answer availability to 99% or more.",
      hint: "The fallback only helps when the secondary fails for different reasons than the primary.",
      success: "Fallbacks multiply failure probabilities only when failures are independent; shared causes cancel most of the benefit.",
      check: function (w) {
        var f1 = +document.getElementById("resilience-chain-p1").value / 100;
        var f2 = +document.getElementById("resilience-chain-p2").value / 100;
        var rho = +document.getElementById("resilience-chain-corr").value;
        var h = +document.getElementById("resilience-chain-cache").value / 100;
        var open = document.getElementById("resilience-chain-cb").checked;
        if (f1 < 0.1 || f2 < 0.1 || h > 0.4) return false;
        var sec = rho + (1 - rho) * f2;
        var avail = open ? 1 - sec * (1 - h) : 1 - f1 * sec * (1 - h);
        return avail >= 0.99 - 1e-9;
      } },
    { id: "sd-stream-save-5s",
      widget: "ux-stream",
      goal: "Find settings where streaming saves the user at least 5 seconds of staring at a spinner, while its first words still appear within 1 second.",
      hint: "TTFT sets when words first appear; tokens per second sets how long the blocking version makes you wait.",
      success: "The slower the decode, the more streaming matters: perceived wait drops from the total time to TTFT.",
      check: function (w) {
        var t = document.getElementById("ux-stream-readout").textContent;
        var a = t.match(/first words at ([\d.]+) s/), b = t.match(/drops by ([\d.]+) s/);
        return !!(a && b && parseFloat(a[1]) <= 1 && parseFloat(b[1]) >= 5);
      } },
    { id: "sd-cost-support-40k",
      widget: "case-studies-cost",
      goal: "For the support assistant (50,000 requests/day, 4 calls, 5,100 in and 250 out tokens, default prices), get the monthly bill under $40,000 without the batch API and without raising the cached share above 39%.",
      hint: "Live chat cannot wait for a batch job, so which calls could a much cheaper model handle?",
      success: "Routing easy calls to a small model is the big cost lever for chat; the batch API only fits work nobody is waiting for.",
      check: function (w) {
        function v(k) { var e = document.getElementById("case-studies-cost-" + k); return e ? parseFloat(e.value) : NaN; }
        if (v("rpd") !== 50000 || v("calls") !== 4 || v("in") !== 5100 || v("out") !== 250) return false;
        if (v("pin") !== 3 || Math.abs(v("pcache") - 0.3) > 1e-9 || v("pout") !== 15 || Math.abs(v("small") - 0.1) > 1e-9) return false;
        if (document.getElementById("case-studies-cost-batch").checked || v("cache") > 39) return false;
        var m = document.getElementById("case-studies-cost-readout").textContent.match(/per month \$([\d,.]+)/);
        return !!m && parseFloat(m[1].replace(/,/g, "")) < 40000;
      } }
  ]
};
