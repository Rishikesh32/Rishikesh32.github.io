/* Flagship scene: the full RAG pipeline, ingest to grounded answer (plays on the RAG overview). */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
window.ATLAS_SCENES["rag/overview"] = {
  unit: 34,
  metrics: [
    { id: "chunks", label: "Chunks indexed" },
    { id: "k", label: "Top-k", tone: "accent" },
    { id: "recall", label: "Recall@5", tone: "good" },
    { id: "grounded", label: "Answer grounded", tone: "signal" }
  ],
  legend: { req: "question / query", res: "grounded answer", miss: "miss / made-up answer", data: "chunks & vectors" },
  nodes: {
    ingest:  { type: "pill",  x: -2.05, y: 6.55, label: "INGEST · offline" },
    query:   { type: "pill",  x: 3.2, y: 11.8, label: "QUERY · each request" },
    docs:    { type: "stack", x: -0.05, y: 3.65,  w: 1.6, d: 1.2, n: 5, color: "t5", label: "300 docs" },
    chunker: { type: "block", x: 2.05, y: 1.45, w: 1.5, d: 1.5, h: 1.0, color: "t1", label: "Chunker", icon: "✂" },
    chunks:  { type: "stack", x: 4.1, y: -0.35, w: 1.4, d: 1.1, n: 3, color: "t3", label: "Chunks" },
    embed:   { type: "block", x: 5.9, y: -2.7, w: 1.8, d: 1.8, h: 1.2, color: "t4", label: "Embedding model" },
    vdb:     { type: "cyl",   x: 9.2, y: -4.2, r: 0.9, h: 1.4, color: "t2", label: "Vector DB" },
    bm25:    { type: "cyl",   x: 8.25, y: 1.75, r: 0.7, h: 1.0, color: "t3", label: "BM25 index" },
    topk:    { type: "stack", x: 13.2, y: 0.55, w: 1.4, d: 1.1, n: 4, color: "t2", label: "Top-k chunks" },
    fuse:    { type: "block", x: 13.2, y: 0.4,  w: 1.4, d: 1.4, h: 0.8, color: "t3", label: "RRF fusion" },
    rerank:  { type: "block", x: 11.1, y: 2.3,  w: 1.6, d: 1.6, h: 1.1, color: "signal", label: "Reranker", icon: "⇅" },
    prompt:  { type: "stack", x: 9.15, y: 4.5,  w: 1.5, d: 1.2, n: 4, color: "good", label: "Prompt" },
    llm:     { type: "block", x: 6.85, y: 6.25, w: 1.9, d: 1.9, h: 1.4, color: "t2", label: "LLM" },
    user:    { type: "block", x: 5.1, y: 8.6, w: 1.3, d: 1.3, h: 0.9, color: "t5", label: "User", icon: "◉" },
    evalset: { type: "block", x: 0.8, y: 7.8, w: 1.4, d: 1.4, h: 0.8, color: "good", label: "Eval set", sub: "120 Qs", icon: "✓" }
  },
  steps: [
    { title: "The model doesn't know your policy", tag: "Problem", add: ["user", "llm"],
      text: "<p>A customer asks your support bot: <code>Can I get a refund on my Pro annual plan after 45 days?</code></p><p>The model has never seen your company's refund policy. It was trained on the public web, so it produces the most plausible-sounding answer: <b>\"Yes, within 60 days.\"</b> Your real policy says 30 days, then pro-rated.</p>",
      key: "A model can only answer from its training data and its prompt. If your documents are in neither, it guesses fluently.",
      flows: [["user", "llm", "req", { lift: 50 }], ["llm", "user", "miss", { label: "\"Yes, within 60 days\"", delay: 0.9, lift: 110 }]],
      metrics: { chunks: "0", k: "—", recall: "—", grounded: "no" } },

    { title: "Ingest: split documents into chunks", tag: "Idea", add: ["ingest", "docs", "chunker", "chunks"], focus: ["ingest", "docs", "chunker", "chunks"],
      links: [["docs", "chunker"], ["chunker", "chunks"]],
      text: "<p>The fix starts offline. Take your 300 policy, billing and help-centre documents (about 2,000 tokens each) and split them into <b>chunks</b> the model can use one at a time.</p><p>Here each chunk is 400 tokens with 60 tokens of overlap, so a stride of 340. That gives ⌈1,940 / 340⌉ = 6 chunks per document.</p>",
      note: "Overlap means a sentence that crosses a boundary lands whole in at least one chunk. It costs 60 / 340 ≈ 18% extra stored text.",
      flows: [["docs", "chunker", "data"], ["chunker", "chunks", "data", { count: 3 }]],
      badges: { chunker: "400-tok chunks", chunks: "1,800" },
      changed: ["+ 300 documents → 1,800 chunks", "+ Metadata per chunk: source, page, heading"] },

    { title: "Embed every chunk and store it", tag: "Idea", add: ["embed", "vdb"], focus: ["ingest", "chunks", "embed", "vdb"],
      links: [["chunks", "embed"], ["embed", "vdb"]],
      text: "<p>An <b>embedding model</b> turns each chunk into a 768-number vector. Chunks that mean similar things get vectors that point in similar directions.</p><p>The <b>vector DB</b> stores each vector with the chunk's text and metadata. 1,800 × 768 float32 values is about 5.5 MB, which fits in memory easily.</p>",
      flows: [["chunks", "embed", "data", { count: 3 }], ["embed", "vdb", "data", { count: 3 }]],
      badges: { embed: "768 dims", vdb: "1,800 × 768" },
      metrics: { chunks: "1,800" },
      note: "This pipeline reruns only when documents change. Re-embed a document when it's edited, and delete its old chunks, or stale text keeps coming back.",
      changed: ["+ 1,800 vectors indexed", "+ ≈ 5.5 MB of float32 vectors"] },

    { title: "Embed the question", tag: "Idea", add: ["query"], focus: ["query", "user", "embed"],
      text: "<p>Now a question arrives. The query pipeline runs on <b>every request</b>.</p><p>The question goes through the <b>same embedding model</b> you used for the documents. That puts it in the same vector space, so \"refund after 45 days\" lands near chunks about refund windows, even if they use different words.</p>",
      flows: [["user", "embed", "req", { label: "embed question", lift: 50 }]],
      badges: { user: "refund after 45 days?" },
      key: "Documents and questions must be embedded by the same model. Vectors from two different models can't be compared." },

    { title: "Find the nearest neighbours", tag: "Solution", add: ["topk"], focus: ["embed", "vdb", "topk"],
      links: [["vdb", "topk", "data"]],
      text: "<p>The vector DB finds the chunks whose vectors have the highest cosine similarity to the question's vector. An ANN index such as HNSW does this without comparing against every vector.</p><p>You ask for a wide net, <code>k = 50</code>, because later steps narrow it down.</p>",
      flows: [["embed", "vdb", "req"], ["vdb", "topk", "data", { label: "50 nearest", count: 3, delay: 0.6 }]],
      metrics: { k: "50", recall: "0.71" },
      note: "Recall@5 here is measured on the eval set you'll build in step 10: in 71% of test questions, a correct chunk is in the top five.",
      changed: ["+ Vector search, k = 50", "~ Recall@5 0.71 (vector only)"] },

    { title: "Add keyword search and fuse", tag: "Solution", add: ["bm25", "fuse"], remove: ["topk"], focus: ["vdb", "bm25", "fuse", "chunks"],
      links: [["chunks", "bm25", "data", { dashed: true, lift: 10 }], ["vdb", "fuse", "data"], ["bm25", "fuse", "data"]],
      text: "<p>Vectors understand paraphrase but can miss exact tokens like <code>Pro annual</code> or a policy number. <b>BM25</b> keyword search catches those.</p><p>You run both and merge the two ranked lists with <b>reciprocal rank fusion</b>: each chunk scores Σ 1 / (60 + rank). Chunks that rank well in both lists rise to the top.</p>",
      flows: [["user", "bm25", "req", { label: "\"Pro annual\" refund", lift: 60 }], ["vdb", "fuse", "data", { delay: 0.6 }], ["bm25", "fuse", "data", { delay: 0.6 }]],
      badges: { fuse: "50 candidates", user: "" },
      metrics: { recall: "0.82" },
      key: "Fuse by rank, not by raw score. BM25 scores and cosine similarities are on different scales.",
      changed: ["+ BM25 index built from the same chunks", "~ Recall@5 0.71 → 0.82"] },

    { title: "Rerank the candidates", tag: "Solution", add: ["rerank"], focus: ["fuse", "rerank"],
      links: [["fuse", "rerank", "data"]],
      text: "<p>A <b>cross-encoder reranker</b> reads the question and each of the 50 candidates together, with full attention between them, and scores how well each one answers.</p><p>It's too slow to run on all 1,800 chunks, but 50 pairs take tens of milliseconds on a GPU. You keep the best 5.</p>",
      flows: [["fuse", "rerank", "data", { count: 3 }]],
      badges: { rerank: "50 → 5" },
      metrics: { k: "5", recall: "0.90" },
      note: "The refund clause was 9th after fusion. The reranker moves it to 1st, which is what lifts recall@5.",
      changed: ["+ Cross-encoder over 50 pairs", "~ Top-k 50 → 5", "~ Recall@5 0.82 → 0.90"] },

    { title: "Answer from the chunks, with citations", tag: "Solution", add: ["prompt"], focus: ["rerank", "prompt", "llm", "user"],
      links: [["rerank", "prompt", "data"], ["prompt", "llm", "req"]],
      text: "<p>The 5 chunks and the question go into the prompt, each chunk tagged with an id. The instructions say: answer only from these passages, cite the ids, and say so if the answer isn't there.</p><p>Now the model replies: <b>\"Refunds are full within 30 days; after that, annual plans are pro-rated [1].\"</b></p>",
      flows: [["rerank", "prompt", "data"], ["user", "prompt", "req", { lift: 64 }], ["prompt", "llm", "req", { delay: 0.7 }], ["llm", "user", "res", { label: "30 days, pro-rated [1]", delay: 1.2, lift: 110 }]],
      metrics: { grounded: "yes" },
      key: "The model answers from retrieved evidence, not memory, and the citation lets the user check it.",
      changed: ["+ 5 × 400-token chunks + question ≈ 2,100 tokens", "~ Answer: 60 days (made up) → 30 days, cited"] },

    { title: "When chunk size goes wrong", tag: "Problem", focus: ["chunker", "chunks", "vdb", "fuse", "rerank", "prompt", "llm", "user"],
      text: "<p>Suppose you set chunks to 2,000 tokens. Each document becomes one chunk, so the billing terms vector averages a dozen topics: invoices, taxes, cards and refunds.</p><p>A short FAQ chunk on <i>how</i> to request a refund now looks closer to the question. The clause with the 30-day rule falls to 14th, outside the top 5, and the model guesses again.</p>",
      flows: [["chunker", "chunks", "data", { count: 1 }], ["vdb", "fuse", "miss", { label: "clause ranks #14" }], ["rerank", "prompt", "miss", { delay: 0.6 }], ["llm", "user", "miss", { label: "\"within 60 days\"", delay: 1.1, lift: 110 }]],
      badges: { chunker: "2,000-tok chunks", chunks: "300", vdb: "300 × 768" },
      metrics: { chunks: "300", recall: "0.52", grounded: "no" },
      note: "Chunks that are too small fail the other way: the 30-day sentence gets cut off from the heading that says it's about refunds.",
      changed: ["~ Chunk size 400 → 2,000 tokens", "~ Chunks 1,800 → 300", "~ Recall@5 0.90 → 0.52"] },

    { title: "Measure it: recall@k and faithfulness", tag: "Solution", add: ["evalset"], focus: ["evalset", "chunker", "rerank", "llm"],
      text: "<p>You catch this with an <b>eval set</b>: 120 real questions, each labelled with the chunk ids that answer it.</p><ul><li><b>Recall@5</b>: is a gold chunk in the top 5? It tests retrieval.</li><li><b>Faithfulness</b>: what share of the answer's claims the chunks support? It tests generation.</li></ul><p>Sweeping chunk size shows 400 tokens wins, so you change it back.</p>",
      flows: [["evalset", "rerank", "req", { label: "120 questions", lift: 80 }], ["rerank", "evalset", "res", { delay: 0.8, lift: 10 }], ["llm", "evalset", "res", { label: "faithfulness", delay: 1.2, lift: 16 }]],
      badges: { chunker: "400-tok chunks", chunks: "1,800", vdb: "1,800 × 768" },
      metrics: { chunks: "1,800", recall: "0.90", grounded: "94% of claims" },
      key: "Score retrieval and generation separately, so a bad answer points at one component to fix.",
      changed: ["+ 120 labelled questions, run on every change", "~ Recall@5 0.52 → 0.90 (back to 400 tokens)", "+ Faithfulness 0.94 (LLM judge)"],
      draw: function (svg, ctx) {
        var a = ctx.anchor("docs"), x0 = a[0] - 228, y0 = a[1] - 64;
        var g = ctx.el("g", { class: "rag-bars" }, svg);
        var t = ctx.el("text", { x: x0, y: y0 - 8, "font-size": 11, style: "fill:var(--ink-2);font-weight:600" }, g);
        t.textContent = "recall@5 by chunk size";
        [["200", 0.84, "t3"], ["400", 0.90, "good"], ["2,000", 0.52, "signal"]].forEach(function (r, i) {
          var y = y0 + i * 20, w = r[1] * 84;
          var lb = ctx.el("text", { x: x0 + 34, y: y + 10.5, "text-anchor": "end", "font-size": 10.5, style: "fill:var(--ink-2)" }, g); lb.textContent = r[0];
          ctx.el("rect", { x: x0 + 40, y: y, width: 84, height: 14, rx: 3, style: "fill:" + ctx.mix("var(--ink)", 8) }, g);
          ctx.el("rect", { x: x0 + 40, y: y, width: w, height: 14, rx: 3, style: "fill:" + ctx.mix(ctx.col(r[2]), 70) + ";stroke:var(--ink);stroke-width:1.2" }, g);
          var v = ctx.el("text", { x: x0 + 130, y: y + 10.5, "font-size": 10.5, style: "fill:var(--ink);font-weight:600" }, g); v.textContent = r[1].toFixed(2);
        });
      } },

    { title: "The whole RAG pipeline", tag: "Recap",
      text: "<p>One question, two pipelines:</p><ul><li><b>Ingest</b> (offline): chunk, embed, index in a vector DB and BM25</li><li><b>Retrieve</b>: hybrid search for 50, fuse, rerank to 5</li><li><b>Generate</b>: answer only from those chunks, with citations</li><li><b>Evaluate</b>: recall@k for retrieval, faithfulness for answers</li></ul><p>The lessons in this area take each box in turn.</p>",
      flows: [["user", "embed", "req", { count: 1, lift: 50 }], ["vdb", "fuse", "data", { count: 1 }], ["bm25", "fuse", "data", { count: 1 }], ["fuse", "rerank", "data", { count: 1 }], ["rerank", "prompt", "data", { count: 1 }], ["prompt", "llm", "req", { count: 1 }], ["llm", "user", "res", { count: 1 }]] }
  ],
  learn: [
    "Why a model without retrieval invents company facts",
    "How documents become chunks, vectors and indexes",
    "How hybrid search, fusion and reranking pick 5 chunks from 1,800",
    "How a grounded prompt produces cited answers",
    "Why chunk size can silently break retrieval",
    "How recall@k and faithfulness locate the broken part"
  ]
};
