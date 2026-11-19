window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["inference"] = {
  quiz: {
    "quantization": [
      { q: "Why does weight-only 4-bit quantization make single-user decoding faster?",
        choices: [
          "Integer arithmetic is four times faster than floating-point arithmetic on GPUs",
          "It skips the smallest weights, so each step does fewer multiplications",
          "Decoding is limited by bytes read from memory, and 4-bit weights are a quarter of the bytes",
          "It shrinks the KV cache by the same factor as the weights"],
        answer: 2,
        why: "Kernels dequantize the 4-bit weights back to normal precision in registers, so the math is unchanged. The win is that each decode step reads four times fewer weight bytes, and decoding is limited by memory bandwidth." },
      { q: "A weight tensor is mostly small values plus a few huge outliers. You quantize it to 4 bits with one scale for the whole tensor. What goes wrong?",
        choices: [
          "The outliers stretch the scale, so most small weights land on a few levels and many round to zero",
          "The outliers are clipped to zero and the rest of the weights are unaffected",
          "Nothing, because symmetric quantization ignores the largest values",
          "The file gets bigger because outliers need extra bits"],
        answer: 0,
        why: "The scale is max|w| ÷ 7, so one large weight makes the grid step huge for everyone. One scale per group of 32–128 weights confines that damage to a single group." },
      { q: "You have one 48 GB GPU. Which choice usually gives the best answers?",
        choices: [
          "An 8B model in 16-bit, because quantization always costs more quality than model size gives",
          "A 70B model in 2-bit, so there is plenty of memory left over",
          "A 70B model in FP8, since 8-bit is near-lossless",
          "A 70B model in 4-bit (about 38–42 GB), after checking it on your own tasks"],
        answer: 3,
        why: "Bigger models tolerate quantization well, so a 4-bit 70B usually beats a 16-bit 8B. FP8 70B needs about 70 GB and does not fit, and 2-bit loses noticeable quality." }
    ],
    "kv-cache": [
      { q: "Why is prefill compute-bound while decode is memory-bandwidth-bound?",
        choices: [
          "Prefill uses every loaded weight for all prompt tokens at once; decode uses each weight for only one new token",
          "Prefill runs on tensor cores and decode runs on the CPU",
          "Decode recomputes keys and values for every earlier token on every step",
          "Prefill skips the KV cache, so it reads less memory"],
        answer: 0,
        why: "In prefill each weight read is reused across the whole prompt, so arithmetic dominates. In decode each weight byte is used for only about two FLOPs, so reading memory is the bottleneck." },
      { q: "Llama 3.1 8B needs 128 KiB of KV cache per token in BF16. Roughly how much KV memory do 32 users at 8,192 tokens each need?",
        choices: ["1 GiB", "4 GiB", "32 GiB", "128 GiB"],
        answer: 2,
        why: "128 KiB × 8,192 tokens = 1 GiB per conversation, and 32 conversations need 32 GiB. That is twice the 16 GB of weights, which is why the cache usually limits how many users a GPU serves." },
      { q: "A teammate sizes the KV cache of a GQA model with 32 attention heads and 8 key-value heads, using 32 in the formula. What is the result?",
        choices: [
          "A correct estimate, because every attention head stores its own keys and values",
          "An estimate four times too large, because only the 8 key-value heads are cached",
          "An estimate four times too small, because query heads also need caching",
          "A correct estimate only when the cache is FP8"],
        answer: 1,
        why: "Only key-value heads are cached. With grouped-query attention, four query heads share each KV head here, so using the attention-head count overestimates the cache by the group factor of 4." }
    ],
    "batching": [
      { q: "Going from batch size 1 to 16 on a decode server raises total throughput almost 16× while per-token latency barely moves. Why?",
        choices: [
          "The GPU switches to a faster clock speed under load",
          "Each sequence gets its own copy of the weights",
          "Larger batches skip the KV cache",
          "Each weight read from memory is shared by every sequence in the batch, and at small batches that read dominates the step time"],
        answer: 3,
        why: "Batch-1 decode is about 1 FLOP per byte, far below what the GPU can do. Batching reuses each weight read across B sequences, so useful work per step rises almost for free until per-sequence KV reads or compute take over." },
      { q: "Requests in a batch have very different output lengths (20 tokens vs 800 tokens). What does continuous batching do better than static batching?",
        choices: [
          "It refills a slot at the very next decode step when its sequence finishes, instead of waiting for the longest request",
          "It truncates long outputs so everyone finishes together",
          "It runs each request on its own GPU",
          "It processes all prompts first and all outputs later"],
        answer: 0,
        why: "Static batching leaves finished slots idle until the slowest member is done. Continuous (iteration-level) batching reschedules after every step, so waiting requests join immediately." },
      { q: "A vendor advertises 10,000 tokens/s for their inference server. What do you most need to know before trusting that number?",
        choices: [
          "Which programming language the server is written in",
          "Whether the number was measured with streaming turned off",
          "The concurrency and prompt/output mix, plus the TTFT and TPOT percentiles at that throughput",
          "The model's parameter count only"],
        answer: 2,
        why: "Throughput keeps rising with batch size while per-user latency gets worse. A throughput figure without the concurrency and latency percentiles it was measured at says little about whether users will be happy." }
    ],
    "speculative": [
      { q: "Speculative decoding gives 2.5× at batch size 1. Why does the speed-up shrink on a heavily loaded server with large batches?",
        choices: [
          "The draft model's acceptance rate drops when many users are online",
          "The GPU is no longer idle, so verifying drafts that get rejected costs real compute",
          "Large batches change the output distribution, so more drafts are rejected",
          "The KV cache cannot store draft tokens at large batches"],
        answer: 1,
        why: "The trick works because a batch-1 decode step leaves compute idle, so checking several tokens is nearly free. At high batch sizes compute is busy and wasted verification work has a real cost, so engines often turn speculation off under load." },
      { q: "Your drafter has acceptance rate α = 0.5 with γ = 4 draft tokens. Which change raises tokens per target pass the most?",
        choices: [
          "Drafting γ = 10 tokens per round instead of 4",
          "Using a cheaper drafter with the same acceptance rate",
          "Raising the sampling temperature",
          "A better-matched drafter that raises α to 0.8, keeping γ = 4"],
        answer: 3,
        why: "Expected tokens per round = (1 − α^(γ+1)) / (1 − α). At α = 0.5, going from γ = 4 to 10 moves it from about 1.94 to 2.0, while α = 0.8 with γ = 4 gives about 3.4. Acceptance matters much more than draft length." },
      { q: "A colleague worries that speculative decoding lowers answer quality because a small model writes some of the tokens. What is correct?",
        choices: [
          "Quality drops slightly, roughly in proportion to how many draft tokens are accepted",
          "Quality is only preserved with greedy decoding; with sampling it changes",
          "With the min(1, p/q) acceptance rule and resampling on rejection, the output distribution is exactly the target model's",
          "Quality is preserved only if the draft model is at least half the size of the target"],
        answer: 2,
        why: "The rejection-sampling rule guarantees the same distribution as sampling from the target alone, for sampling as well as greedy decoding. The draft model affects only speed, through the acceptance rate." }
    ],
    "serving": [
      { q: "What does a serving engine's scheduler do on every decode step?",
        choices: [
          "Decides which sequences run together in the next step, admitting waiting requests while KV blocks are free",
          "Downloads the newest model weights",
          "Tokenizes the HTTP request body",
          "Compresses finished responses before streaming them"],
        answer: 0,
        why: "The scheduler and the KV block manager work together every few milliseconds: they move requests from waiting to running when memory allows, and the model runner executes one step for the whole batch." },
      { q: "You will self-host on GPU servers for an agent workload with long shared system prompts, many turns and lots of JSON output. Which engine is the natural first candidate?",
        choices: ["Ollama", "SGLang", "llama.cpp", "A hand-written model.generate() loop"],
        answer: 1,
        why: "SGLang's RadixAttention reuses shared prefixes across requests and it has fast constrained (JSON) decoding. Ollama and llama.cpp target laptops and CPUs, and a hand-written loop has no continuous batching." },
      { q: "Your prompt template starts with the current timestamp and the user's name, followed by a 3,000-token system prompt. Prefix caching barely helps. Why?",
        choices: [
          "Prefix caching only works for prompts shorter than 1,000 tokens",
          "Prefix caching needs FP8 weights",
          "The cache only matches identical leading tokens, so per-user data at the front makes every prefix different",
          "Timestamps are tokenized differently on each request"],
        answer: 2,
        why: "Requests share cached blocks only for an identical prefix. Put the shared part (system prompt, tool definitions, documents) first and identical, and move per-user data to the end." }
    ],
    "gpu-math": [
      { q: "Roughly what is the fastest a single stream can decode an 8B model in BF16 (16 GB) on an H100 with 3.35 TB/s of memory bandwidth?",
        choices: ["About 21 tokens/s", "About 2,000 tokens/s", "About 60,000 tokens/s", "About 209 tokens/s"],
        answer: 3,
        why: "Each decode step reads every weight once, so the ceiling is bandwidth ÷ weight bytes: 3,350 GB/s ÷ 16 GB ≈ 209 tokens/s. Real systems reach roughly 60–80% of that." },
      { q: "Which change roughly doubles that single-stream decode ceiling?",
        choices: [
          "Moving to a GPU with twice the TFLOPS but the same memory bandwidth",
          "Quantizing the weights from BF16 to FP8",
          "Doubling the batch size",
          "Halving the maximum context length"],
        answer: 1,
        why: "The ceiling is memory bandwidth ÷ weight bytes. FP8 halves the bytes per weight, so each step reads half as much. More TFLOPS does not help a memory-bound step, and batching raises total throughput, not the per-stream limit." },
      { q: "A teammate says: \"Llama 3.1 8B is 16 GB in BF16, so fine-tuning it with Adam fits on one 24 GB GPU.\" What is wrong?",
        choices: [
          "Nothing, because training and inference use the same memory",
          "Fine-tuning needs only the 4-bit size, about 5 GB",
          "Full training with Adam in mixed precision needs about 16 bytes per parameter, roughly 128 GB before activations",
          "Training needs exactly twice the inference memory, so 32 GB"],
        answer: 2,
        why: "Training stores weights, gradients and optimizer states (Adam keeps two moments, often with FP32 master weights), about 16 bytes per parameter. Inference rules do not apply to full fine-tuning." }
    ],
    "local": [
      { q: "A 12 GB model runs with 9 GB of layers on the GPU and 3 GB in system RAM. Why does the RAM part take most of the time per token?",
        choices: [
          "Every token passes through every layer, and system RAM bandwidth (~60 GB/s) is far lower than VRAM's",
          "The CPU recomputes the layers on the GPU as well",
          "Layers in RAM must be decompressed before each token",
          "The GPU waits until the whole RAM part has been copied over"],
        answer: 0,
        why: "Speed is bandwidth-bound everywhere. 9 GB at ~500 GB/s takes about 18 ms, but 3 GB at ~60 GB/s takes about 50 ms, so a quarter of the model costs nearly three quarters of the time." },
      { q: "You have about 8 GB of free VRAM for an 8B model. Which GGUF file is the sensible pick?",
        choices: [
          "Q8_0 (8.5 GB), because 8-bit is near-lossless",
          "BF16 (16 GB), with the rest offloaded to RAM",
          "Q2_K (3.2 GB), to get the maximum speed",
          "Q4_K_M (about 4.9 GB), leaving room for the KV cache and runtime"],
        answer: 3,
        why: "Leave 1–2 GB plus the KV cache free on top of the file size. Q4_K_M is the usual sweet spot; Q8_0 does not fit, BF16 would crawl with offload, and Q2_K loses noticeable quality on an 8B model." },
      { q: "You give a local Ollama model a long document and it answers as if it only saw the end. What is the most likely cause?",
        choices: [
          "The model is quantized too aggressively",
          "The context window (num_ctx) is still at its small default, so the prompt was truncated",
          "Local models cannot read documents",
          "The GPU ran out of bandwidth"],
        answer: 1,
        why: "Local runtimes often start with a small context window. Raise num_ctx (and budget the extra KV cache) so the whole document fits." }
    ]
  },
  challenges: [
    { id: "quant-outliers-20db",
      widget: "quantization-demo",
      goal: "Keep the outlier weights on and reach an SQNR of at least 20 dB using 5 bits or fewer.",
      hint: "Each extra bit adds about 6 dB, but what stops one huge weight from stretching everyone's scale?",
      success: "Per-group scales confine outlier damage, so you get good quality at fewer bits than a single tensor-wide scale needs.",
      check: function (w) {
        var bits = +document.getElementById("quantization-bits").value;
        var outl = document.getElementById("quantization-outlier").checked;
        var m = (document.getElementById("quantization-readout").textContent || "").match(/SQNR\s+(-?[\d.,]+)\s*dB/);
        if (!m) return false;
        return outl && bits <= 5 && parseFloat(m[1].replace(/,/g, "")) >= 20;
      } },
    { id: "kv-70b-under-30gb",
      widget: "kv-cache-demo",
      goal: "Serve Llama 3.1 70B to at least 16 concurrent sequences at 8,192+ tokens each while keeping the total KV cache under 30 GB.",
      hint: "You can't shrink the context or the user count, but you can change how many bytes each cached number takes.",
      success: "An FP8 KV cache halves memory per token, which doubles how many users or how much context fits.",
      check: function (w) {
        var model = document.getElementById("kv-cache-model").value;
        var ctx = +document.getElementById("kv-cache-ctx").value, batch = +document.getElementById("kv-cache-batch").value;
        var m = (document.getElementById("kv-cache-readout").textContent || "").match(/([\d.,]+)\s*GB in total/);
        if (!m) return false;
        return model === "80,64,8,128" && ctx >= 13 && batch >= 4 && parseFloat(m[1].replace(/,/g, "")) < 30;
      } },
    { id: "batch-10k-tps",
      widget: "batching-demo",
      goal: "With an average context of at least 2,048 tokens, push total throughput above 10,000 tok/s while the KV cache still fits.",
      hint: "Large batches pay off only while weight reads dominate; what halves both the weight bytes and each sequence's KV bytes?",
      success: "Batching shares weight reads across users, and fewer bytes per weight and per cached token push the throughput ceiling higher.",
      check: function (w) {
        var ctx = +document.getElementById("batching-ctx").value;
        var t = (document.getElementById("batching-readout").textContent || "").replace(/,/g, "");
        var m = t.match(/([\d.]+)\s*tok\/s total/);
        if (!m) return false;
        return ctx >= 11 && parseFloat(m[1]) > 10000 && t.indexOf("NOT fit") < 0;
      } },
    { id: "spec-best-gamma",
      widget: "speculative-demo",
      goal: "Your drafter is mediocre: set acceptance α to 0.60 or lower and draft cost c to 0.10 or higher. Then choose the draft length γ that gives the biggest speed-up.",
      hint: "Watch the bars: with low acceptance, later draft tokens are rarely accepted but still cost time.",
      success: "When acceptance is mediocre, short drafts win: extra draft tokens are mostly rejected but still cost time.",
      check: function (w) {
        var a = +document.getElementById("speculative-alpha").value, c = +document.getElementById("speculative-cost").value;
        var g = +document.getElementById("speculative-gamma").value;
        var m = (document.getElementById("speculative-readout").textContent || "").match(/best γ here = (\d+)/);
        if (!m) return false;
        return a <= 0.6 + 1e-9 && c >= 0.1 - 1e-9 && g === +m[1];
      } },
    { id: "prefix-ttft-100",
      widget: "serving-demo",
      goal: "Every request carries a shared prefix of at least 6,000 tokens. Get the mean TTFT across the 8 requests under 100 ms.",
      hint: "Only the first request has to prefill the shared part when the prefix can be reused, so what is left for the others?",
      success: "Prefix caching skips the shared prefill, so TTFT depends only on the short unique part of each prompt.",
      check: function (w) {
        var S = +document.getElementById("serving-sys").value;
        var m = (document.getElementById("serving-readout").textContent || "").replace(/,/g, "").match(/mean TTFT\s+([\d.]+)\s*ms/);
        if (!m) return false;
        return S >= 6000 && parseFloat(m[1]) < 100;
      } },
    { id: "gpu-70b-one-card",
      widget: "gpu-math-demo",
      goal: "Fit Llama 3.1 70B for at least 8 concurrent sequences at 8,192+ tokens on a single GPU.",
      hint: "In BF16 the weights alone are about 141 GB; look at both the bytes per weight and the size of the card.",
      success: "Fewer bytes per weight (or a bigger card) frees memory, and whatever is left after weights and overhead becomes the KV cache for users.",
      check: function (w) {
        var model = document.getElementById("gpu-math-model").value.split(",").map(Number);
        var bw = +document.getElementById("gpu-math-prec").value, ctxV = +document.getElementById("gpu-math-ctx").value;
        var B = +document.getElementById("gpu-math-batch").value, n = +document.getElementById("gpu-math-n").value;
        var vram = +document.getElementById("gpu-math-gpu").value.split(",")[0];
        if (model[0] !== 70.6 || n !== 1 || B < 8 || ctxV < 13) return false;
        var ctx = Math.pow(2, ctxV), kv = 2 * model[1] * model[2] * model[3] * ctx * 2 / 1e9 * B;
        return model[0] * bw + kv + 2 <= vram * 0.9;
      } },
    { id: "local-70b-8tps",
      widget: "local-demo",
      goal: "Run the 70B model locally at 8 tok/s or faster.",
      hint: "A 70B file won't fit in 24 GB of VRAM, and the part left in system RAM sets the speed; which machine keeps all of it in fast memory?",
      success: "Local speed is bandwidth ÷ model size, so a big unified-memory machine plus a 4-bit quant beats a fast GPU that has to offload to RAM.",
      check: function (w) {
        var model = document.getElementById("local-model").value;
        var m = (document.getElementById("local-readout").textContent || "").replace(/,/g, "").match(/about\s+([\d.]+)\s*tok\/s/);
        if (!m) return false;
        return model === "70" && parseFloat(m[1]) >= 8;
      } }
  ]
};
