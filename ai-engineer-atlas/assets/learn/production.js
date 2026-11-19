window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["production"] = {
  quiz: {
    "deployment": [
      { q: "Which of these changes should count as a new, versioned release of an AI feature?",
        choices: [
          "Only a new model, since prompts are just configuration",
          "Only code changes that go through the normal build",
          "Any change to the model snapshot, prompt, parameters, retrieval index, tools or guardrails",
          "Only changes that users can see in the UI"],
        answer: 2,
        why: "Each of these can shift behavior across thousands of conversations. A prompt edit is a deploy, so version the whole bundle and log the release id on every request." },
      { q: "You want to see a new model's error rate, latency and cost on real traffic with zero risk to users. Which rollout fits?",
        choices: [
          "A shadow deploy: mirror traffic to the new version and log its answers without showing them",
          "A 5% canary that ramps up automatically",
          "A 50/50 A/B test",
          "Blue/green: switch all traffic and flip back if something breaks"],
        answer: 0,
        why: "Only shadow traffic is never shown to users. Canary and A/B expose some users, and blue/green exposes everyone. Shadow tools with side effects (emails, refunds) must be disabled." },
      { q: "Your app calls a provider's floating model alias (like \"model-latest\"). Answers changed overnight and no one deployed anything. What should you have done?",
        choices: [
          "Lowered the temperature to 0",
          "Pinned a dated model snapshot in the release, so upgrades become explicit, tested releases",
          "Added more unit tests",
          "Moved to a bigger model"],
        answer: 1,
        why: "A floating alias can be silently upgraded by the provider. Pinning an exact snapshot makes a model change a deliberate release that goes through your eval gate and rollout." }
    ],
    "cicd": [
      { q: "Why does CI for an AI feature need an eval gate on top of ordinary unit tests?",
        choices: [
          "Unit tests cannot run in GitHub Actions",
          "Eval gates are faster than unit tests",
          "Unit tests cannot call external APIs",
          "A prompt change can pass every unit test and still make answers worse"],
        answer: 3,
        why: "Unit tests check fixed inputs and outputs. An eval gate runs the system on a fixed set of cases, scores the answers and blocks the merge on a low score or a regression against the baseline." },
      { q: "Your gate runs 100 cases with a 2-point tolerance and misses real 3-point regressions about 40% of the time. What is the best fix?",
        choices: [
          "Set the tolerance to 0 so any drop blocks the merge",
          "Re-run the eval until it passes",
          "Grow the suite (and compare paired cases) so noise is smaller than the regression you care about",
          "Update the baseline after every merge"],
        answer: 2,
        why: "A pass rate on 100 cases has a standard error of about 4 points, so a 3-point drop hides in the noise. A tolerance of 0 makes the gate block harmless changes too, and people learn to ignore a flaky gate." },
      { q: "What goes wrong if CI automatically updates the baseline score after every merge?",
        choices: [
          "Small regressions that pass within tolerance pile up, and quality slowly drifts down",
          "The gate becomes too strict and blocks everything",
          "Eval costs double",
          "Nothing, because the baseline should always match main"],
        answer: 0,
        why: "Each merge can lose up to the tolerance without failing. If the baseline follows every merge, ten such merges can lose many points without the gate ever firing." }
    ],
    "observability": [
      { q: "What is a trace in LLM observability?",
        choices: [
          "A log line with the final answer",
          "A tree of timed spans for one request, sharing one trace id, each with attributes like model and token counts",
          "A daily chart of average latency",
          "A copy of the model weights used for a request"],
        answer: 1,
        why: "Each step (guardrail, retrieval, model call, tool) is a span with start and end times, a parent and attributes. Together they show where time and tokens went for one request." },
      { q: "A waterfall shows vector search (80 ms) and keyword search (60 ms) running one after the other, though neither needs the other's result. What shortens the critical path for free?",
        choices: [
          "Remove the output guardrail",
          "Log fewer span attributes",
          "Switch to a bigger model",
          "Run the two searches in parallel so the path only waits for the slower one"],
        answer: 3,
        why: "Latency is set by the critical path, not the sum of all spans. Running independent steps in parallel removes 60 ms here without changing results." },
      { q: "After you moved document processing onto a job queue, each request shows up as two unrelated traces. What happened?",
        choices: [
          "The trace context was not propagated with the job message, so the worker started a new trace",
          "The queue doubled the number of requests",
          "OpenTelemetry cannot trace asynchronous work",
          "The collector is sampling 50% of spans"],
        answer: 0,
        why: "Trace ids must cross every boundary (HTTP headers like traceparent, queue messages, threads). Losing the context splits one request into orphan traces." }
    ],
    "monitoring": [
      { q: "The model, prompt and code are unchanged, yet answer quality drops after a product launch. What is the most likely explanation?",
        choices: [
          "The model weights degrade with use",
          "Input drift: users now ask questions the system was never evaluated on",
          "The GPU got slower",
          "The provider changed the tokenizer"],
        answer: 1,
        why: "A system can get worse without any change on your side because the incoming questions changed. That is why you monitor drift and sampled quality, not just latency and errors." },
      { q: "A feature has two bins. The reference shares are [0.5, 0.5] and the current shares are [0.25, 0.75]. Roughly what is the PSI, and what does it suggest?",
        choices: [
          "0, because the totals still add to 1",
          "About 0.05: stable",
          "About 0.27: a significant shift worth an alert",
          "About 0.69: the data is unusable"],
        answer: 2,
        why: "PSI = (0.25 − 0.5)·ln(0.25/0.5) + (0.75 − 0.5)·ln(0.75/0.5) ≈ 0.173 + 0.101 ≈ 0.27, above the common 0.25 alert threshold." },
      { q: "Your hourly drift alert, computed on about 50 requests per window, fires several times a day with no real change. What is the best fix?",
        choices: [
          "Use longer windows or a higher threshold, because small samples give non-zero PSI from noise alone",
          "Mute the alert",
          "Compute PSI with more bins",
          "Run the LLM judge on 100% of traffic instead"],
        answer: 0,
        why: "With few samples, bin shares wobble randomly and PSI rises above zero even with no shift. Size windows and thresholds to your traffic so alerts mean something." }
    ],
    "experiment-tracking": [
      { q: "Which logged information is essential to reproduce last Tuesday's best run exactly?",
        choices: [
          "The final metric values and a screenshot of the dashboard",
          "The run name and its start time",
          "Only the model name",
          "The git commit, data and eval-set versions, prompt version and full config, alongside its metrics"],
        answer: 3,
        why: "A run ties exact inputs to outputs. Without the commit, prompt, data and eval-set versions and config, a good score cannot be traced back to the setup that produced it." },
      { q: "Three runs: X scores 80% at $1/1k requests, Y scores 78% at $2, Z scores 85% at $3. Which run is not on the Pareto front?",
        choices: ["X", "Y", "Z", "None; all three are on the front"],
        answer: 1,
        why: "X beats Y on both axes: higher quality and lower cost. Y is dominated. X and Z are each best at something, so both stay on the front." },
      { q: "Run A scored 84% on eval set v6. Run B scored 81% on eval set v7. What can you conclude?",
        choices: [
          "Nothing yet: scores on different eval sets are not comparable, so rerun both on the same version",
          "A is better by 3 points",
          "B is better because v7 is newer",
          "They are equal within noise"],
        answer: 0,
        why: "Eval sets can differ in difficulty and coverage. Only compare runs scored on the same eval-set version, which is why the version is logged with every run." }
    ],
    "infra": [
      { q: "Why should GPU model servers on Kubernetes autoscale on queue depth or running requests instead of CPU utilization?",
        choices: [
          "Kubernetes cannot read CPU metrics from GPU nodes",
          "CPU-based scaling is more expensive",
          "Queue depth is the only metric Kubernetes supports",
          "CPU usage barely moves when the GPU is saturated, so the autoscaler would never react"],
        answer: 3,
        why: "The work happens on the GPU. Queue depth or running requests track real load, and because new GPU pods take minutes to load weights, you also keep a warm minimum." },
      { q: "A \"summarize this 300-page PDF\" endpoint takes two minutes per request. What is the standard design?",
        choices: [
          "Keep the HTTP connection open and raise the timeout to five minutes",
          "Return 202 with a job id, put the job on a queue for idempotent workers, and let the client poll or get a webhook",
          "Run it in the browser",
          "Cache the answer before the request arrives"],
        answer: 1,
        why: "Slow work should not hold a request open. A queue absorbs bursts, retries with backoff handle transient failures, and idempotent workers make redelivery safe." },
      { q: "Which query is a bad candidate for a semantic cache?",
        choices: [
          "\"What is your refund policy?\"",
          "\"How do I reset my password?\"",
          "\"Where is my order right now?\"",
          "\"What are your support hours?\""],
        answer: 2,
        why: "Personalized or time-sensitive answers differ per user and per moment, so a similar past question can return someone else's or a stale answer. Generic, stable questions are what caches are for." }
    ],
    "registries": [
      { q: "Why does serving load <code>models:/support-classifier@champion</code> instead of a hard-coded version number?",
        choices: [
          "Aliases load faster than version numbers",
          "Promotion and rollback become a metadata change (moving the alias), with no code change or rebuild",
          "Version numbers expire after 30 days",
          "Aliases compress the model"],
        answer: 1,
        why: "Serving follows the alias. To roll back, point @champion at the previous version; every version still links to the run that produced it." },
      { q: "A label event happened on day 10. The user's orders_30d feature was later updated on days 15 and 22. A naive join attaches today's value to the training row. What is the effect?",
        choices: [
          "None, because the latest value is the most accurate",
          "The model trains on slightly stale data",
          "The training set gets smaller",
          "Future information leaks into training, so offline scores look better than the model will ever do live"],
        answer: 3,
        why: "A point-in-time join uses the value as of day 10. Using today's value includes updates from after the event, which the model will never have at prediction time." },
      { q: "You switch to a new embedding model but keep querying the vector index built with the old one. What happens?",
        choices: [
          "Retrieval quality collapses, because query and document vectors come from different embedding spaces",
          "Retrieval improves, because the new model is better",
          "Nothing, because all embeddings share the same space",
          "The index rebuilds itself automatically"],
        answer: 0,
        why: "An index is only meaningful with the embedding model that built it. Register and version the embedding model and the index as a pair, and change them together." }
    ]
  },
  challenges: [
    { id: "canary-fast-rollback",
      widget: "deployment-demo",
      goal: "Ship a bad canary (true error rate 3% or higher) and get it rolled back within the first 5 minutes.",
      hint: "The monitor won't decide until it has 100 canary requests in its 5-minute window, and the canary only gets 5% of traffic at first.",
      success: "A rollback monitor is only as fast as its sample size: more traffic means enough canary requests to decide sooner.",
      check: function (w) {
        var err = +document.getElementById("deployment-err").value;
        var m = (document.getElementById("deployment-readout").textContent || "").match(/Rolled back at minute (\d+)/);
        return !!m && err >= 3 && +m[1] <= 5;
      } },
    { id: "gate-catch-3pp",
      widget: "cicd-demo",
      goal: "Keep the true change at −3 pp and the tolerance at 1 pp or more (so harmless noise doesn't flake), and make the gate reliably block the regression.",
      hint: "The tolerance must sit well above the noise and well below the regression; what shrinks the standard error?",
      success: "Bigger eval suites shrink the noise, so a gate with a sane tolerance can still catch small real regressions.",
      check: function (w) {
        var d = +document.getElementById("cicd-delta").value, tol = +document.getElementById("cicd-tol").value;
        var t = document.getElementById("cicd-readout").textContent || "";
        return d === -3 && tol >= 1 && t.indexOf("reliably blocks") >= 0;
      } },
    { id: "trace-critical-path",
      widget: "observability-demo",
      goal: "For a question that needs no order lookup, get total latency under 1,850 ms without a cache hit and with the reranker still on.",
      hint: "Find the spans that don't need each other, and the one step that adds a whole extra model round trip.",
      success: "Latency is set by the critical path: drop the unneeded tool round trip and run independent searches in parallel.",
      check: function (w) {
        var hit = document.getElementById("observability-cache").checked, rr = document.getElementById("observability-rerank").checked;
        var m = (document.getElementById("observability-readout").textContent || "").replace(/,/g, "").match(/total\s+(\d+)\s*ms/);
        return !!m && !hit && rr && +m[1] < 1850;
      } },
    { id: "psi-noise-alarm",
      widget: "monitoring-demo",
      goal: "Trigger a false alarm: with no real drift (mean shift 0.00σ, spread 1.00), get PSI above 0.10.",
      hint: "If nothing changed, where else can differences between the two histograms come from?",
      success: "Small samples produce non-zero PSI from noise alone, so small windows need longer periods or higher thresholds.",
      check: function (w) {
        var s = +document.getElementById("monitoring-shift").value, sp = +document.getElementById("monitoring-spread").value;
        var m = (document.getElementById("monitoring-readout").textContent || "").match(/PSI\s+([\d.]+)/);
        return !!m && Math.abs(s) < 1e-9 && Math.abs(sp - 1) < 1e-9 && parseFloat(m[1]) > 0.1;
      } },
    { id: "pareto-latency-budget",
      widget: "experiment-tracking-demo",
      goal: "Your product needs p95 ≤ 2.5 s. Find the smallest budget that still buys the best quality available under that latency limit.",
      hint: "Turn the latency limit on first, then slide the budget down until the circled run is about to change.",
      success: "Constraints reshape the choice: under a latency limit the best run is a cheap one, and paying more buys nothing.",
      check: function (w) {
        var lat = document.getElementById("experiment-tracking-lat").checked;
        var b = +document.getElementById("experiment-tracking-budget").value;
        var t = document.getElementById("experiment-tracking-readout").textContent || "";
        return lat && b < 0.95 && /run G\b/.test(t);
      } },
    { id: "cache-save-safely",
      widget: "infra-demo",
      goal: "At 100,000 requests/day and 1.0¢ per call, save at least $400 a day while keeping wrong cached answers at 200 a day or fewer.",
      hint: "Savings and wrong answers both grow with the hit rate; the only other lever is how often a hit is wrong.",
      success: "Semantic-cache risk scales with hit rate, so a high hit rate needs a strict similarity threshold to keep wrong answers rare.",
      check: function (w) {
        var req = +document.getElementById("infra-req").value, c = +document.getElementById("infra-cost").value;
        var h = +document.getElementById("infra-hit").value / 100, f = +document.getElementById("infra-false").value / 100;
        if (req !== 5 || Math.abs(c - 1) > 1e-9) return false;
        var N = 100000;
        return N * h * c / 100 >= 400 - 1e-6 && N * h * f <= 200 + 1e-6;
      } },
    { id: "pit-no-leak",
      widget: "registries-demo",
      goal: "Find the earliest label day on which a naive join would give the same value as a point-in-time join.",
      hint: "A naive join uses today's value, so it is only harmless when no update happened after the label event.",
      success: "Naive joins are only safe after the last feature update; for every earlier label they leak the future.",
      check: function (w) {
        return +document.getElementById("registries-t").value === 27;
      } }
  ]
};
