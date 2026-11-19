window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["foundations"] = {
  quiz: {
    "linear-algebra": [
      { q: "A 2×2 matrix has determinant 0. What does it do to the plane?",
        choices: ["Rotates it while keeping every area the same",
                  "Mirrors it, flipping orientation but keeping area",
                  "Collapses it onto a line, so the map cannot be undone",
                  "Doubles every area while keeping the orientation"],
        answer: 2,
        why: "The determinant is the area scale. Zero means the columns line up, the plane is squashed onto a line and information is lost, so there is no inverse. A mirror flip gives a negative determinant, not zero." },
      { q: "A batch <code>X</code> of shape (32, 128) is multiplied by weights <code>W</code> of shape (128, 64). What shape is <code>X @ W</code>?",
        choices: ["(32, 64)", "(128, 128)", "(32, 128)", "(64, 32)"],
        answer: 0,
        why: "The inner sizes (128) must match and then disappear: (32 × 128)(128 × 64) gives (32 × 64), one 64-dimensional output per example in the batch." },
      { q: "Your embeddings are not normalized and you rank documents by raw dot product, meaning to use cosine similarity. What goes wrong?",
        choices: ["Nothing, because the dot product and cosine always give the same ranking",
                  "The ranking comes out exactly reversed compared with cosine similarity",
                  "Scores turn negative for every document, which breaks the sort",
                  "Long vectors get boosted even when they point in a less similar direction"],
        answer: 3,
        why: "The dot product equals length × length × cos θ, so vector length leaks into the score. Only for unit-length vectors do dot product and cosine give the same ranking." }
    ],
    "calculus": [
      { q: "At the current point, \\(f'(x) = 3\\). Roughly what happens to \\(f\\) if you nudge \\(x\\) up by 0.01?",
        choices: ["It rises by about 3", "It rises by about 0.03", "It falls by about 0.03", "It rises by about 0.3"],
        answer: 1,
        why: "A derivative is output change per unit of input change, so a 0.01 nudge changes f by about 3 × 0.01 = 0.03. The derivative itself (3) is a rate, not the change." },
      { q: "On a loss surface, which way does the gradient \\(\\nabla L\\) point?",
        choices: ["Straight at the minimum, wherever you stand",
                  "Along the contour line, where the loss stays constant",
                  "In the direction of steepest decrease in loss",
                  "In the direction of steepest increase in loss"],
        answer: 3,
        why: "The gradient points uphill, perpendicular to the contours. That is why descent steps along −∇L. On an elongated bowl, −∇L does not even aim at the minimum, which causes zig-zags." },
      { q: "Your training loop calls <code>loss.backward()</code> every step but never calls <code>optimizer.zero_grad()</code>. What happens?",
        choices: ["Gradients add up across steps, so each update uses a stale running sum",
                  "PyTorch resets gradients automatically, so nothing changes",
                  "The second call to backward() raises an error and stops training",
                  "The weights freeze because the graph is freed after the first step"],
        answer: 0,
        why: "PyTorch accumulates gradients into .grad on purpose (to allow gradient accumulation). Without zero_grad() every step adds to the old gradients and updates become wrong and ever larger." }
    ],
    "probability-statistics": [
      { q: "A fraud filter catches 99% of fraud and flags 1% of legitimate transactions. Only 0.1% of transactions are fraud. When it flags one, roughly how likely is it to be fraud?",
        choices: ["About 99%", "About 50%", "About 1%", "About 9%"],
        answer: 3,
        why: "Per 100,000 transactions: about 99 real frauds are flagged versus about 999 false alarms from the huge legitimate group, so only about 9% of flags are fraud. The base rate dominates." },
      { q: "Prompt A scores 82% and prompt B scores 84% on the same 500-item eval. What should you conclude?",
        choices: ["B is clearly better, since a 2-point gain is a real improvement",
                  "A is more reliable, because a lower score has a smaller variance",
                  "Not much yet: each 95% interval is about ±3.4 points, so they overlap",
                  "B is better only if the p-value from one run is below 0.5"],
        answer: 2,
        why: "At 82% on 500 items the 95% interval is about ±3.4 points, so a 2-point gap is well within noise. You need far more items (or a paired test) to separate them." },
      { q: "A language model gives probability 0.25 to every correct next token. What is its perplexity?",
        choices: ["0.25", "4", "1.39", "25"],
        answer: 1,
        why: "Cross-entropy is −ln 0.25 ≈ 1.39 nats and perplexity is e to that, which is 4: the model is as unsure as a fair 4-way guess. 1.39 is the loss, not the perplexity." }
    ],
    "optimization": [
      { q: "On \\(L = x^2\\), gradient descent gives \\(x_{t+1} = (1 - 2\\eta)\\,x_t\\). What happens with \\(\\eta = 0.75\\)?",
        choices: ["It flips sign each step but still shrinks toward 0",
                  "It creeps smoothly toward 0 without overshooting",
                  "It grows each step and diverges to infinity",
                  "It never moves, because the step cancels out"],
        answer: 0,
        why: "1 − 2(0.75) = −0.5, so x flips sign and halves every step: oscillating convergence. Smooth convergence needs η < 0.5 and divergence starts at η > 1." },
      { q: "You fully fine-tune a large pretrained model and the loss spikes, then turns NaN within a few hundred steps. What is the most likely fix?",
        choices: ["Raise the learning rate so the model escapes the spike",
                  "Remove warmup so the model reaches the peak rate sooner",
                  "Switch from AdamW to plain SGD with momentum turned off",
                  "Lower the peak learning rate and keep warmup and clipping"],
        answer: 3,
        why: "A rate copied from pretraining is far too large for full fine-tuning (often near 1e-5). Too large a step overshoots the sharpest curvature, which shows up as spikes and NaN." },
      { q: "Why does training with AdamW take more GPU memory than plain SGD for the same model?",
        choices: ["It keeps a full copy of each mini-batch on the GPU",
                  "It stores two extra values per weight: the moment estimates",
                  "It needs every weight in float64 to stay numerically stable",
                  "It stores the full Hessian matrix of second derivatives"],
        answer: 1,
        why: "AdamW tracks a running mean of gradients and of squared gradients for every parameter, so its optimizer state is about twice the model size. Plain SGD stores none." }
    ],
    "python": [
      { q: "What does reading a 50 GB JSONL file through a generator that yields batches of 64 records buy you?",
        choices: ["Faster parsing, because a generator runs the batches in parallel",
                  "Automatic retries on records that fail to parse",
                  "Memory stays at about one batch instead of the whole file",
                  "The file is compressed on the fly while it is being read"],
        answer: 2,
        why: "A generator pauses at each yield and only keeps the current batch alive, so memory is O(batch) instead of O(file). It is lazy, not parallel." },
      { q: "You need to send 500 LLM API calls fast without breaking the provider's rate limit. Which approach fits best?",
        choices: ["A multiprocessing pool with 500 worker processes",
                  "asyncio.gather with an asyncio.Semaphore capping calls in flight",
                  "A plain for-loop with time.sleep between each call",
                  "Unlimited threads, since the GIL will serialize them anyway"],
        answer: 1,
        why: "The work is I/O-bound waiting, so asyncio overlaps the waits and a semaphore caps concurrency inside the rate limit. Processes are for CPU-bound Python and add heavy overhead here." },
      { q: "Inside an <code>async def</code> you call <code>time.sleep(2)</code> (or a synchronous HTTP client). What happens?",
        choices: ["The whole event loop freezes, so every other task stalls too",
                  "Only that coroutine pauses while the others keep running",
                  "Python quietly converts it to asyncio.sleep for you",
                  "It raises a RuntimeError as soon as the coroutine starts"],
        answer: 0,
        why: "A blocking call never yields to the event loop, so no other coroutine can run until it returns. Use await asyncio.sleep or an async client instead." }
    ],
    "dsa": [
      { q: "At one million items and 10⁸ simple operations per second, roughly how long do an O(n²) and an O(n log n) algorithm take?",
        choices: ["About 3 days versus about 1 minute",
                  "About 10 s versus about 1 s",
                  "Both finish in well under a second",
                  "About 3 hours versus about 0.2 s"],
        answer: 3,
        why: "n² = 10¹² operations, about 10⁴ s or close to 3 hours. n log₂ n ≈ 2 × 10⁷ operations, about 0.2 s. At scale the growth rate dwarfs constant factors." },
      { q: "You need the 10 best scores from a stream of 50 million search hits. What is the best approach?",
        choices: ["Sort all 50 million hits and take the first 10",
                  "Put the hits in a hash set and scan it at the end",
                  "Keep a size-10 min-heap and replace the root when beaten",
                  "Binary-search every hit into one sorted list of all hits"],
        answer: 2,
        why: "A size-k min-heap only compares each new score with its smallest kept score: O(n log k) time and O(k) memory, versus O(n log n) time and O(n) memory for a full sort." },
      { q: "A dedup loop runs <code>if h not in seen: seen.append(h)</code> over a million documents, where <code>seen</code> is a list. It crawls. Why?",
        choices: ["Each membership test scans the list, so the loop is O(n²); use a set",
                  "Computing the hashes is the slow part, so skip hashing entirely",
                  "list.append copies the whole list, so each append is O(n)",
                  "Python compares strings character by character, which is O(n²)"],
        answer: 0,
        why: "x in list is a linear scan, so a million checks cost about n²/2 comparisons. A set (hash table) makes each check O(1) on average and the whole job O(n)." }
    ],
    "software-engineering": [
      { q: "Why do most unit tests for an LLM app mock the model call?",
        choices: ["Mocked calls measure answer quality more accurately than real ones",
                  "Providers do not allow their APIs to be called from test suites",
                  "Mocks catch prompt regressions that evals would otherwise miss",
                  "They stay fast, free and deterministic and test your own logic"],
        answer: 3,
        why: "Unit tests check your parsing, retries and routing, which should not depend on a slow, costly, non-deterministic provider. Real quality is measured separately with evals." },
      { q: "You notice you pushed a commit containing an API key to a shared repo. What do you do first?",
        choices: ["Rotate the key (revoke it and issue a new one), then clean up",
                  "Rewrite git history to remove the commit; that is enough",
                  "Make the repository private so nobody else can see it",
                  "Add the file to .gitignore so it is not committed again"],
        answer: 0,
        why: "Once pushed, assume the key is copied: clones, forks and caches keep it. Only revoking it makes it useless; history rewriting and .gitignore are clean-up, not a fix." },
      { q: "A test asserts that the model returns exactly \"The capital of France is Paris.\" What is the problem?",
        choices: ["Nothing; exact-string checks are the most rigorous kind of test",
                  "Output varies run to run, so assert properties (valid JSON, fields, length)",
                  "Tests should never look at model output in any form at all",
                  "It should use a case-insensitive regex for that exact sentence"],
        answer: 1,
        why: "Model output is non-deterministic and changes with model versions, so exact-match tests are flaky. Assert properties of the output and measure quality with evals." }
    ],
    "devops-basics": [
      { q: "Why copy <code>requirements.txt</code> and run <code>pip install</code> before <code>COPY . .</code> in a Dockerfile?",
        choices: ["Docker refuses to build if code is copied before dependencies",
                  "It makes the final image smaller by skipping unused packages",
                  "A code edit then leaves the slow install layer cached",
                  "pip needs to see your source files to resolve versions"],
        answer: 2,
        why: "A change invalidates its own layer and every layer after it. With dependencies installed first, editing code only rebuilds the cheap COPY step, not the minutes-long install." },
      { q: "You start a 10-hour training job on a remote GPU box over SSH from your laptop. How do you keep it running if the laptop sleeps?",
        choices: ["Raise the SSH keep-alive timeout to 12 hours",
                  "Run it with chmod +x so it detaches from SSH",
                  "Pipe its output into tail -f so the session persists",
                  "Run it inside tmux (or similar) and detach"],
        answer: 3,
        why: "A plain SSH session's processes die when the connection drops. tmux keeps the session alive on the server, so you can detach and reattach later." },
      { q: "Where should an inference container get its API keys?",
        choices: ["Passed in at runtime, via an env file or a secrets manager",
                  "Baked into the image with ENV so the image is self-contained",
                  "Committed in a config file that sits next to the Dockerfile",
                  "Written into the container's writable layer during the build"],
        answer: 0,
        why: "Anything baked into an image can be read by anyone who has the image. Passing secrets at runtime keeps them out of images and repositories." }
    ]
  },
  challenges: [
    { id: "la-det-minus-two",
      widget: "la-demo",
      goal: "Mirror the plane and double its area at the same time: make the determinant exactly −2.",
      hint: "The determinant is ad − bc; a negative value means a flip, and its size is the area scale.",
      success: "The sign of the determinant says whether orientation flips; its size says how much area scales.",
      check: function (w) {
        var g = function (id) { var e = document.getElementById(id); return e ? parseFloat(e.value) : NaN; };
        var det = g("la-a") * g("la-d") - g("la-b") * g("la-c");
        return isFinite(det) && Math.abs(det + 2) < 0.02;
      } },
    { id: "calc-flat-spot",
      widget: "calc-demo",
      goal: "Find the curve's other flat spot (true slope 0) and shrink h until the secant slope is within 0.05 of the true derivative there.",
      hint: "The exact slope is x² − 1, so it is zero at two points; you start on one of them.",
      success: "The secant slope approaches the derivative as h → 0, and the flat spots at x = ±1 are where an optimizer can stop.",
      check: function (w) {
        var x = parseFloat(document.getElementById("calc-x").value), h = parseFloat(document.getElementById("calc-h").value);
        if (!isFinite(x) || !isFinite(h) || h <= 0) return false;
        var f = function (t) { return t * t * t / 3 - t; };
        var err = Math.abs((f(x + h) - f(x)) / h - (x * x - 1));
        return Math.abs(x + 1) < 0.01 && err < 0.05;
      } },
    { id: "clt-shrink-spread",
      widget: "clt-demo",
      goal: "Keep the skewed Exponential source and make the spread of the sample means 0.2 or less (less than half of what n = 5 gives).",
      hint: "The spread of means is σ/√n; how much more data do you need to halve it?",
      success: "Standard error falls as 1/√n: quadruple the sample size to halve the spread, whatever the source shape.",
      check: function (w) {
        if (document.getElementById("clt-dist").value !== "exp") return false;
        var m = (document.getElementById("clt-readout").textContent || "").match(/spread of means = ([\d.]+)/);
        return !!m && parseFloat(m[1]) <= 0.2;
      } },
    { id: "gd-escape-local-min",
      widget: "gd-demo",
      goal: "On Two valleys, start at x₀ = 2 and finish in the deep left valley without raising the learning rate above 0.20.",
      hint: "A ball that has built up speed can roll over a hump; which control adds that memory of past steps?",
      success: "Momentum carries velocity from earlier steps, which can push the optimizer over a hump out of a shallow local minimum.",
      check: function (w) {
        var fn = document.getElementById("gd-fn").value;
        var lr = parseFloat(document.getElementById("gd-lr").value), x0 = parseFloat(document.getElementById("gd-x0").value);
        var txt = document.getElementById("gd-readout").textContent || "";
        return fn === "valleys" && Math.abs(x0 - 2) < 0.01 && lr <= 0.2001 && txt.indexOf("deep left valley") >= 0 && txt.indexOf("diverged") < 0;
      } },
    { id: "async-60-under-5",
      widget: "async-demo",
      goal: "Push all 60 API calls (mean latency 1.0 s or more) through in under 5 seconds of total time. Can you do it with a limit below 15?",
      hint: "Total time is roughly calls × latency ÷ limit, plus a tail from the slowest calls.",
      success: "With I/O-bound calls, the concurrency cap sets the run time: about n × latency ÷ cap until the provider's rate limit bites.",
      check: function (w) {
        var n = parseInt(document.getElementById("async-n").value, 10), lat = parseFloat(document.getElementById("async-lat").value);
        var m = (document.getElementById("async-readout").textContent || "").match(/with limit \d+: ([\d.]+) s/);
        return n >= 60 && lat >= 0.99 && !!m && parseFloat(m[1]) < 5;
      } },
    { id: "bigo-years",
      widget: "bigo-demo",
      goal: "Find the real input size at which an O(n²) algorithm would run for years, then switch on log scale so 2ⁿ fits on the chart.",
      hint: "At 10⁸ operations per second, n² operations take n²/10⁸ seconds; a year is about 3 × 10⁷ s.",
      success: "At 100 million items O(n²) takes years while O(n log n) takes seconds, and log scale is the only way to show exponential growth beside them.",
      check: function (w) {
        return document.getElementById("bigo-real").value === "100000000" && document.getElementById("bigo-log").checked === true;
      } },
    { id: "docker-reqs-change",
      widget: "docker-demo",
      goal: "Find the change that makes even the well-ordered Dockerfile reinstall every dependency, while its base image layer stays cached.",
      hint: "A change invalidates its own layer and every layer after it; which file is copied just before pip install?",
      success: "Changing requirements.txt invalidates the install layer in any ordering, which is why you keep dependency changes rare and separate from code edits.",
      check: function (w) {
        var m = (document.getElementById("docker-readout").textContent || "").match(/Good order: ([\d.]+) s/);
        if (!m) return false;
        var g = parseFloat(m[1]);
        return g >= 90 && g < 100;
      } }
  ]
};
