window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["transformers-llms"] = {
  quiz: {
    "tokenization": [
      { q: "Why can byte-level BPE encode any string without ever producing an \"unknown\" token?",
        choices: ["Its vocabulary contains every word in every language",
                  "It starts from single bytes, so anything can fall back to byte pieces",
                  "It swaps unseen words for the closest word it knows",
                  "It learns new merge rules on the fly while encoding"],
        answer: 1,
        why: "BPE's starting vocabulary is the individual bytes, and merges only build bigger pieces on top. Any string can always be spelled out byte by byte, so nothing is ever unknown." },
      { q: "You budget a 3,000-word English prompt as 3,000 tokens. What is a better estimate, and how should you confirm it?",
        choices: ["About 4,000 tokens; confirm with the model's own tokenizer",
                  "About 3,000 tokens; one word is one token",
                  "About 750 tokens; each token holds about 4 words",
                  "About 12,000 tokens; every character is a token"],
        answer: 0,
        why: "English averages about 0.75 words per token, so 3,000 words is roughly 4,000 tokens. Tokenizers differ, so count with the model's real tokenizer before you estimate cost." },
      { q: "Your app strips the leading space from user text before sending it to the model. Why might the outputs change?",
        choices: ["They won't, because the tokenizer removes spaces anyway",
                  "Whitespace only matters for code models, not prose",
                  "The provider rejects text that starts without a space",
                  "\"␣word\" and \"word\" are different tokens, so the model sees different ids"],
        answer: 3,
        why: "Pre-splitting keeps the leading space as part of the next word, so \"␣Hello\" and \"Hello\" have different ids. Casually adding or removing whitespace changes what the model actually reads." }
    ],
    "embeddings": [
      { q: "Why does a transformer need positional information at all?",
        choices: ["Without it the embedding table can't be looked up",
                  "Position tells the model which tokens are rare",
                  "Attention alone is order-blind, so \"dog bites man\" and \"man bites dog\" would look alike",
                  "The causal mask only works when positions are added"],
        answer: 2,
        why: "Attention computes weighted averages over a set of vectors and ignores their order. Without a position signal, any reordering of the same tokens gives the same representations." },
      { q: "Most current open LLMs use RoPE. What does rotating queries and keys by their position achieve?",
        choices: ["The q·k score depends on the distance between tokens, not their absolute positions",
                  "Each token gets a learned vector that is added to its embedding",
                  "The model can skip the softmax step inside attention",
                  "The embedding table becomes smaller and cheaper to store"],
        answer: 0,
        why: "Rotating q by mθ and k by nθ leaves an angle of (n − m)θ between them, so their dot product sees only the relative distance. Shifting both tokens by the same amount leaves the score unchanged." },
      { q: "A model learned one position vector for each of positions 0–1,023 (GPT-2 style). What happens if you feed it 2,000 tokens?",
        choices: ["It works fine because positions are interpolated automatically",
                  "There is no learned vector past position 1,023, so it can't represent those positions",
                  "It automatically switches to rotary position embeddings",
                  "Quality is unchanged because attention ignores position"],
        answer: 1,
        why: "A learned absolute table has exactly one row per trained position, so it cannot go past its trained length. RoPE-based models can be stretched further, usually with RoPE scaling and long-document training." }
    ],
    "attention": [
      { q: "In self-attention, what role does the value vector play?",
        choices: ["It scores how relevant another token is to this one",
                  "It says what this token is looking for",
                  "It encodes where the token sits in the sequence",
                  "It is the content a token hands over, mixed by the attention weights"],
        answer: 3,
        why: "Queries and keys produce the scores, softmax turns scores into weights, and those weights average the value vectors. The value is what actually gets passed along." },
      { q: "You grow a prompt from 8k to 32k tokens. Roughly how does the attention score computation change?",
        choices: ["It stays about the same per request",
                  "It grows about 2×",
                  "It grows about 16×",
                  "It grows about 4×"],
        answer: 2,
        why: "The score matrix is n × n, so cost grows with the square of length. Four times the tokens means about 4² = 16 times the attention work." },
      { q: "A hand-written causal mask sets future scores to 0 before the softmax. What is wrong?",
        choices: ["e⁰ = 1, so future tokens still get weight; the mask must use −∞",
                  "Nothing: a zero score already gives zero weight",
                  "The mask should be applied after the softmax instead",
                  "Masking belongs on the value vectors, not the scores"],
        answer: 0,
        why: "Softmax exponentiates scores, and e⁰ = 1, so a zero score still gets a share. Setting future scores to −∞ gives e^−∞ = 0, which is exactly zero weight with rows still summing to 1." }
    ],
    "transformer-block": [
      { q: "What is the residual stream in a transformer?",
        choices: ["A cache of keys and values reused between generated tokens",
                  "A running vector each sublayer reads from and adds its output back into",
                  "A normalization step that makes activations sum to 1",
                  "A router that sends tokens to different blocks"],
        answer: 1,
        why: "Each sublayer computes x + sublayer(norm(x)), so the stream is shared working memory. The additions also give gradients a clean path through dozens of layers." },
      { q: "Using the 12·L·d² rule of thumb, roughly how many parameters does a dense model with d = 4,096 and L = 32 have, ignoring embeddings?",
        choices: ["About 1.6B",
                  "About 13B",
                  "About 0.5B",
                  "About 6.4B"],
        answer: 3,
        why: "12 × 32 × 4,096² ≈ 6.4B. That is a 7B-class model once embeddings and gated-MLP details are added." },
      { q: "A 7B model's fp16 weights take about 14 GB, so you serve it with long prompts on a 16 GB GPU. What did you forget?",
        choices: ["The KV cache and activations, which grow with context length",
                  "The MLP weights, which are stored separately from the block",
                  "Embeddings, which are always kept in fp32",
                  "Pre-norm, which doubles the weight memory"],
        answer: 0,
        why: "Weight memory is only the start. The KV cache and activations grow with context length and batch size, so long prompts need a lot more than the weights alone." }
    ],
    "model-families": [
      { q: "Why doesn't an encoder-only model like BERT naturally generate text left to right?",
        choices: ["It has too few parameters to write fluent text",
                  "It has no embedding table for output tokens",
                  "Each token sees the whole input in both directions, so it isn't trained to predict the next token from the past",
                  "It only uses cross-attention, which can't produce text"],
        answer: 2,
        why: "Encoders use bidirectional attention and are pretrained on tasks like filling masked words. Generation needs the causal, next-token setup that decoders are built around." },
      { q: "You need to embed 10 million support articles for semantic search, cheaply and fast. Which family fits best?",
        choices: ["A frontier decoder-only chat model",
                  "A small encoder-only embedding model",
                  "An encoder–decoder translation model",
                  "A reasoning model with a large thinking budget"],
        answer: 1,
        why: "Encoders are small, fast and good at one vector per text, which is exactly what search needs. A large chat model would cost orders of magnitude more for the same job." },
      { q: "In an encoder–decoder model, where does cross-attention get its queries and its keys/values?",
        choices: ["Queries from the encoder; keys/values from the decoder",
                  "Both from the decoder's own earlier tokens",
                  "Both from the encoder's output",
                  "Queries from the decoder; keys/values from the encoder's output"],
        answer: 3,
        why: "Cross-attention lets each decoder token ask questions of the source. The decoder supplies the queries and the encoder's output supplies the keys and values." }
    ],
    "training-pipeline": [
      { q: "You send a plain question to a base (pretrained-only) model and it replies with more questions in the same style. Why?",
        choices: ["Base models continue documents; answering instructions comes from SFT and preference tuning",
                  "The model is broken, because base models always answer directly",
                  "The temperature is set too high for question answering",
                  "Base models know no facts until RLHF adds them"],
        answer: 0,
        why: "Pretraining teaches the model to continue text, and a list of questions is a plausible continuation. Supervised fine-tuning on example conversations is what teaches it to answer." },
      { q: "A team trains a 7B model on 2T tokens, far past the ~20 tokens per parameter that Chinchilla calls compute-optimal. Why would they?",
        choices: ["More tokens always lower total training compute",
                  "Chinchilla's rule only applies to encoder models",
                  "Serving cost dominates: a smaller model trained longer is cheaper to run at similar quality",
                  "Extra tokens are needed for the model to learn the chat template"],
        answer: 2,
        why: "Chinchilla optimizes training compute only. For a model that will serve heavy traffic, spending more on training to get a smaller model saves money on every request afterwards." },
      { q: "What does the KL penalty in RLHF do?",
        choices: ["It speeds up training of the reward model",
                  "It keeps the policy close to the reference model so it can't drift into reward-hacking outputs",
                  "It makes responses longer and more detailed",
                  "It removes the need for human preference data"],
        answer: 1,
        why: "Optimizing hard against an imperfect reward model leads to odd, flattering or overly long outputs. The KL term charges the policy for straying far from where it started." }
    ],
    "decoding": [
      { q: "As temperature approaches 0, sampling behaves most like what?",
        choices: ["A uniform random choice among all tokens",
                  "Beam search over several candidate sequences",
                  "Top-p sampling with p = 1",
                  "Greedy decoding: nearly always the top token"],
        answer: 3,
        why: "Dividing logits by a tiny T stretches the gaps between them, so the top token's probability approaches 1. That is effectively greedy decoding." },
      { q: "You're extracting fields from invoices into JSON. Which decoding settings fit best?",
        choices: ["Greedy or a temperature around 0–0.2",
                  "Temperature 1.0 with top-p 0.95",
                  "Temperature 1.5 to explore more options",
                  "Top-k 50 with temperature 0.9"],
        answer: 0,
        why: "Extraction has one right answer, so randomness only adds errors. Higher temperatures and wide sampling suit open-ended writing, not structured output." },
      { q: "How does top-p (nucleus) sampling differ from top-k?",
        choices: ["Top-p always keeps exactly p tokens",
                  "Top-k adapts to the model's confidence but top-p doesn't",
                  "Top-p's kept set grows when the model is unsure and shrinks when it is confident",
                  "They are identical whenever p equals k / 100"],
        answer: 2,
        why: "Top-p keeps the fewest tokens whose probabilities add up to p, so the count depends on how spread out the distribution is. Top-k always keeps exactly k, whatever the model's confidence." }
    ],
    "frontier": [
      { q: "An MoE model has 47B total and 13B active parameters. Which number should you size GPU memory for?",
        choices: ["13B, because only active experts are used per token",
                  "47B, because every expert must be loaded",
                  "About 30B, the average of the two",
                  "Only the shared attention layers"],
        answer: 1,
        why: "The router may pick any expert for the next token, so all of them must sit in memory. Active parameters set per-token compute, not memory." },
      { q: "When is a reasoning model most likely worth its extra cost and latency?",
        choices: ["Sorting short tickets into four categories at high volume",
                  "Real-time autocomplete while the user types",
                  "Rewriting a paragraph in a friendlier tone",
                  "Hard multi-step math or code where accuracy matters more than speed"],
        answer: 3,
        why: "Reasoning models spend many thinking tokens to do better on hard, checkable problems. For simple or latency-sensitive tasks you pay that cost without a matching gain." },
      { q: "How does an image become input to a multimodal LLM?",
        choices: ["A vision encoder turns patches into vectors and a projector maps them into the LLM's embedding space",
                  "It is always converted into a text caption first",
                  "Raw pixel values are fed in as token ids 0–255",
                  "Image vectors skip attention and go straight to the MLP"],
        answer: 0,
        why: "Image patches become vectors that sit alongside text embeddings, and the transformer attends over both together. That is also why images use up context like text does." }
    ],
    "landscape": [
      { q: "What should you settle first when choosing a model?",
        choices: ["Which model currently tops the public leaderboard",
                  "Which model has the lowest price per token",
                  "Hard constraints like data rules and deployment, which rule out whole classes",
                  "Which model has the longest context window"],
        answer: 2,
        why: "Privacy and deployment rules can remove entire categories, such as all hosted APIs. Ranking candidates only makes sense among the ones you are allowed to use." },
      { q: "Model A costs $1 per 1,000 calls but passes your check only half the time, so you retry until it passes. Model B costs $1.40 per 1,000 calls and passes first time. Which is cheaper per completed task?",
        choices: ["Model A, because it is cheaper per call",
                  "They cost the same once retries are counted",
                  "You can't tell without per-token prices",
                  "Model B, because A averages two calls per success, about $2 per 1,000 tasks"],
        answer: 3,
        why: "With a 50% pass rate you need two attempts on average, which doubles A's effective price. Compare cost per successful task, not price per call or per token." },
      { q: "A startup with a few hundred requests a day wants to self-host an open-weight model to save money. What's the likely problem?",
        choices: ["Idle GPUs usually cost more than API calls at that volume",
                  "Open-weight models can't be fine-tuned",
                  "Self-hosting is more expensive at every volume",
                  "Hosted APIs can't handle such low traffic"],
        answer: 0,
        why: "At low volume a GPU mostly sits idle while you still pay for it. Self-hosting starts to pay off with high, steady volume or when data rules require it." }
    ]
  },
  challenges: [
    { id: "bpe-half",
      widget: "tokenization-demo",
      goal: "Keep merging until the corpus is half its starting length or shorter (counted in tokens). How many merges does it take?",
      hint: "Each merge replaces every occurrence of the top pair, so pairs inside frequent words shrink the corpus fastest.",
      success: "Frequent pairs merge first, so common words collapse into single tokens after just a few merges.",
      check: function (w) {
        var t = (document.getElementById("tokenization-readout") || {}).textContent || "";
        var m = t.match(/corpus length (\d+) tokens \(started at (\d+) characters\)/);
        if (!m) return false;
        var tok = +m[1], chars = +m[2];
        return chars > 0 && tok * 2 <= chars;
      } },
    { id: "pe-slow-pair",
      widget: "embeddings-demo",
      goal: "Find the lowest dimension pair whose wave does not finish even one full cycle across the 64 positions shown.",
      hint: "The readout says how many positions each pair takes to repeat, and that length grows quickly as i goes up.",
      success: "Higher dimension pairs oscillate more slowly, so together the pairs give every position a unique pattern, like the hands of a clock.",
      check: function (w) {
        var el = document.getElementById("embeddings-pair");
        return !!el && +el.value === 9;
      } },
    { id: "attn-sink",
      widget: "attention-demo",
      goal: "Make the last word, \"tired\", put at least 90% of its attention on the very first token, \"The\".",
      hint: "One of the heads already favors the first token; sharpness then decides how peaked its weights get.",
      success: "Sharpness scales the scores before softmax, so a head's favorite gets more and more of the weight. Many trained models have a head like this that parks attention on the first token.",
      check: function (w) {
        var q = document.getElementById("attention-query");
        var t = (document.getElementById("attention-readout") || {}).textContent || "";
        var m = t.match(/attends most to: (\S+) ([0-9.]+)/);
        return !!q && q.value === "9" && !!m && m[1] === "The" && parseFloat(m[2]) >= 0.9;
      } },
    { id: "block-shrink",
      widget: "transformer-block-demo",
      goal: "Keep all 32 layers but shrink the 7B-class model to between 3B and 4B parameters (6–8 GB of fp16 weights).",
      hint: "Most parameters grow with d², so width is the strongest lever you have.",
      success: "Attention and MLP weights both scale with d², so a modest cut in width removes billions of parameters.",
      check: function (w) {
        var L = document.getElementById("transformer-block-L");
        var t = (document.getElementById("transformer-block-readout") || {}).textContent || "";
        var m = t.match(/Total ≈ ([0-9.]+)(B|M)/);
        if (!L || +L.value !== 32 || !m || m[2] !== "B") return false;
        var b = parseFloat(m[1]);
        return b >= 3 && b <= 4;
      } },
    { id: "families-cross",
      widget: "model-families-demo",
      goal: "Find the family and query position where the selected token can attend to exactly 8 positions in total, counting everything it can see.",
      hint: "No single 7-token sentence gets you to 8; you need a family where a token reads from two sequences at once.",
      success: "In an encoder–decoder, a decoder token sees its own earlier output causally and the whole source through cross-attention.",
      check: function (w) {
        var a = document.getElementById("model-families-arch"), q = document.getElementById("model-families-q");
        return !!a && !!q && a.value === "encdec" && +q.value === 2;
      } },
    { id: "chinchilla-70b",
      widget: "training-pipeline-demo",
      goal: "On the default cluster (1,024 GPUs at 400 TFLOP/s), train a model of at least 70B parameters at 15–40 tokens per parameter in under 30 days.",
      hint: "Compute is 6·N·D, so grow N and set D near 20 × N, then check the wall-clock time.",
      success: "Near-optimal data plus 6·N·D compute sets a hard ceiling on how big a model a fixed cluster can train in a month.",
      check: function (w) {
        var n = document.getElementById("training-pipeline-n"), d = document.getElementById("training-pipeline-d");
        var g = document.getElementById("training-pipeline-gpus"), tf = document.getElementById("training-pipeline-tflops");
        if (!n || !d || !g || !tf) return false;
        if (+g.value !== 1024 || +tf.value !== 400) return false;
        var N = Math.pow(10, +n.value) * 1e9, D = Math.pow(10, +d.value);
        var ratio = D / N, days = 6 * N * D / (1024 * 400e12) / 86400;
        return N >= 70e9 && ratio >= 15 && ratio <= 40 && days < 30;
      } },
    { id: "decode-cut-tail",
      widget: "decoding-demo",
      goal: "Get the entropy under 1 bit while \"sunny\" still gets less than 70% of the probability.",
      hint: "Temperature alone pushes sunny's share up; try cutting the candidate list instead.",
      success: "Top-k and top-p remove the tail without making the head more confident, while temperature reshapes the whole distribution.",
      check: function (w) {
        var t = (document.getElementById("decoding-readout") || {}).textContent || "";
        var e = t.match(/entropy ([0-9.]+) bits/), top = t.match(/top token \S+ ([0-9.]+)/);
        if (!e || !top) return false;
        return parseFloat(e[1]) < 1 && parseFloat(top[1]) < 0.7;
      } },
    { id: "moe-sparse",
      widget: "frontier-demo",
      goal: "Design an MoE with at least 100B total parameters but no more than 15B active per token.",
      hint: "Total grows with the number of experts, but active parameters only grow with k.",
      success: "MoE separates capacity (total parameters, which set memory) from per-token compute (active parameters).",
      check: function (w) {
        var E = document.getElementById("frontier-e"), k = document.getElementById("frontier-k");
        var x = document.getElementById("frontier-x"), s = document.getElementById("frontier-s");
        if (!E || !k || !x || !s) return false;
        var e = +E.value, kk = Math.min(+k.value, e), xb = +x.value, sb = +s.value;
        return sb + e * xb >= 100 && sb + kk * xb <= 15;
      } },
    { id: "landscape-selfhost",
      widget: "landscape-demo",
      goal: "Make the self-hosted open-weight model the best fit without any rule that forces data onto your own servers or the user's device.",
      hint: "Think about which kinds of traffic make owning GPUs pay off.",
      success: "High, steady volume and batch work are what make self-hosting worth it, even when hosted APIs are allowed.",
      check: function (w) {
        var p = document.getElementById("landscape-privacy");
        var t = (document.getElementById("landscape-readout") || {}).textContent || "";
        return !!p && (p.value === "any" || p.value === "cloud") && t.indexOf("Shortlist: Open-weight model, self-hosted") === 0;
      } }
  ]
};
