window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["rag"] = {
  quiz: {
    "embeddings-search": [
      { q: "Why can semantic search match \"I forgot my login\" to \"Reset your password\" even though they share no words?",
        choices: ["The index keeps a synonym list for every word in the corpus",
                  "The encoder places texts with similar meaning at nearby vectors",
                  "Cosine similarity counts the characters the two texts share",
                  "The query is expanded with extra keywords before searching"],
        answer: 1,
        why: "Contrastive training pulls matching question–passage pairs together, so meaning, not shared words, decides distance. No synonym list or keyword expansion is involved." },
      { q: "You switch queries to a newer, better embedding model but keep the chunk vectors you stored with the old one. What happens?",
        choices: ["Results improve because queries are now embedded more accurately",
                  "Nothing changes as long as both models output the same dimension",
                  "Only the scores shift; the ranking of chunks stays the same",
                  "Results become unreliable, because vectors from different models are not comparable"],
        answer: 3,
        why: "Each model builds its own space. Even with matching dimensions, an old-model vector and a new-model vector cannot be compared, so you must re-embed the whole corpus." },
      { q: "A teammate drops every result with cosine below 0.8 \"because 0.8 means relevant\". What's the problem?",
        choices: ["Score ranges differ by model, so no single threshold is universal",
                  "Unit-length vectors can never reach a cosine above 0.8",
                  "The cutoff should use Euclidean distance instead of cosine",
                  "Thresholds must be applied before the query is embedded"],
        answer: 0,
        why: "One model's 0.8 can be another's 0.5. Calibrate any cutoff on your own queries. For unit vectors, Euclidean distance gives the same ranking, so switching metrics changes nothing." }
    ],
    "chunking": [
      { q: "What happens to retrieval if every chunk is a whole chapter?",
        choices: ["Recall becomes perfect because every fact sits inside some chunk",
                  "Each vector blurs several topics, so specific questions match poorly",
                  "The embedding gets sharper because the model sees more context",
                  "Overlap becomes unnecessary, so retrieval quality goes up"],
        answer: 1,
        why: "One vector has to summarize everything in its chunk. Big chunks mix topics, so a precise question lands near none of them. Very long chunks can also exceed the model's input limit and be truncated." },
      { q: "A 10,000-token report is split with chunk size 500 and overlap 100. Roughly how many chunks, and how much extra text is stored?",
        choices: ["20 chunks and no extra text",
                  "20 chunks and about 20% extra",
                  "25 chunks and about 25% extra",
                  "50 chunks and about 100% extra"],
        answer: 2,
        why: "The stride is 500 − 100 = 400, so ⌈(10,000 − 100) / 400⌉ = 25 chunks. Overhead is 100 / 400 = 25%." },
      { q: "You set <code>chunk_size=1200</code> believing it means tokens, but the splitter counts characters. What do you actually get?",
        choices: ["Chunks about four times larger than intended, which get truncated",
                  "An error, because the splitter refuses an ambiguous unit",
                  "Exactly what you wanted, since characters and tokens match in English",
                  "Chunks of roughly 300 tokens, about a quarter of what you intended"],
        answer: 3,
        why: "English averages about four characters per token, so 1,200 characters is roughly 300 tokens. Mixing up characters and tokens is a common sizing bug." }
    ],
    "vector-db": [
      { q: "What does raising HNSW's <code>efSearch</code> do?",
        choices: ["Keeps more candidates during the descent: higher recall and higher latency",
                  "Prunes graph links to cut memory, at the cost of some recall",
                  "Raises recall for free, with no effect on query latency",
                  "Adds more layers to the graph, which requires a full rebuild"],
        answer: 0,
        why: "efSearch is a query-time knob: a wider candidate list finds more true neighbours but does more work. Memory and graph structure are set at build time by M and efConstruction." },
      { q: "An IVF index misses true neighbours when the query sits near a cell boundary. What is the most direct fix?",
        choices: ["Lower nprobe so each query scans fewer cells",
                  "Switch the similarity metric from cosine to dot product",
                  "Raise nprobe so more nearby cells are scanned",
                  "Re-embed the corpus with a larger embedding model"],
        answer: 2,
        why: "Neighbours just across the boundary live in the next cell. Probing more cells finds them at the cost of scanning more vectors. That is the recall/speed dial in the demo." },
      { q: "A multi-tenant app takes the ANN top-10 and then keeps only tenant \"acme\" (5% of the data). Users often get 0 or 1 results. Why?",
        choices: ["HNSW cannot store tenant ids, so the filter matches at random",
                  "acme's vectors were normalized differently from everyone else's",
                  "Top-10 is too large, so duplicate results get collapsed away",
                  "Post-filtering a small top-k with a selective filter leaves almost nothing"],
        answer: 3,
        why: "Only about 1 in 20 of the global top-10 belongs to acme. Apply the filter inside the index walk (or over-fetch heavily) so the search returns k allowed results." }
    ],
    "hybrid-rerank": [
      { q: "Why does reciprocal rank fusion combine BM25 and vector results by rank instead of adding their scores?",
        choices: ["Ranks are cheaper to store and sort than floating-point scores",
                  "BM25 and cosine use unrelated scales, so adding raw scores is meaningless",
                  "Adding scores would require re-running the reranker on every document",
                  "Rank fusion lets each retriever run on its own separate machine"],
        answer: 1,
        why: "BM25 runs from 0 to about 30 and cosine from −1 to 1. RRF sidesteps normalization by using only positions: 1/(k + rank)." },
      { q: "Users search for error code <code>E1043</code>, and pure vector search returns generic printer pages. What's the best first fix?",
        choices: ["Shrink chunks so the error code gets a chunk of its own",
                  "Raise the vector top-k from 5 to 50 and hope it shows up",
                  "Switch to a bigger embedding model with more dimensions",
                  "Add BM25 keyword search and fuse it with the vector results"],
        answer: 3,
        why: "Exact identifiers are where keyword search beats embeddings. Hybrid retrieval with RRF keeps the paraphrase strength of vectors and adds exact-token matching." },
      { q: "A pipeline retrieves the top 5 chunks and then runs a cross-encoder reranker on just those 5. What's wrong with that?",
        choices: ["Cross-encoders only accept lists of exactly 50 documents",
                  "Reranking 5 documents costs more than reranking 50",
                  "The reranker cannot promote a document that was never a candidate",
                  "Cross-encoder scores must be fused with RRF before use"],
        answer: 2,
        why: "Reranking reorders candidates; it cannot find new ones. Retrieve wide (50 to 100) cheaply, then rerank narrow." }
    ],
    "query-transform": [
      { q: "Why does HyDE help retrieval even when the hypothetical answer contains wrong facts?",
        choices: ["The reranker filters the wrong facts out before the search runs",
                  "Only its position matters: a fake answer looks like real documents",
                  "HyDE checks the fake answer against the corpus and corrects it",
                  "The fake answer is shown to the user, so retrieval matters less"],
        answer: 1,
        why: "A short question lands far from long passages in embedding space. A plausible answer lands among them, next to the right document, whatever its facts say." },
      { q: "Earlier in a chat the user said \"We're on the Pro plan\". Now they ask \"what about for teams?\" and retrieval returns junk. Which technique fixes this most directly?",
        choices: ["Step-back prompting that asks a broader question first",
                  "Self-query that extracts date and price filters from the text",
                  "Lowering top-k so fewer irrelevant pages come back",
                  "A standalone rewrite that folds the history into the question"],
        answer: 3,
        why: "The follow-up only makes sense with the chat history. A standalone rewrite turns it into a self-contained question such as \"adding team members on the Pro plan\"." },
      { q: "Your rewriter turns \"E1043 printer won't connect\" into \"printer connection troubleshooting\". What's the risk, and the fix?",
        choices: ["The rewrite is too short; ask the LLM for a longer paraphrase",
                  "Rewrites always hurt recall; remove the rewrite step entirely",
                  "The exact code is lost; keep the original query as one of the variants",
                  "Send the rewrite to the answer model instead of the user's question"],
        answer: 2,
        why: "Rewrites can drop identifiers that keyword search needs. Searching with the original query alongside the variants keeps them. The answer model should still see the user's real question." }
    ],
    "advanced-rag": [
      { q: "A chunk reads \"Revenue grew 3% over the previous quarter.\" and loses to near-identical chunks from other reports. Which pattern targets this failure?",
        choices: ["GraphRAG: extract an entity graph and summarize its communities",
                  "Contextual retrieval: prepend an LLM-written context to each chunk at ingest",
                  "Agentic RAG: let the model search repeatedly until it is satisfied",
                  "HyDE: embed a hypothetical answer instead of the question"],
        answer: 1,
        why: "The chunk never names its company or quarter. Prepending \"From ACME's Q2 2023 report…\" before embedding and BM25 indexing restores the missing context." },
      { q: "Users ask \"What are the main risks across all our supplier reports?\" and top-k retrieval returns narrow, partial answers. Which pattern fits best?",
        choices: ["GraphRAG, which answers global questions from community summaries",
                  "A cross-encoder reranker over the top 50 candidates",
                  "Contextual retrieval with prompt caching at ingest",
                  "Raising top-k from 5 to 10 chunks per question"],
        answer: 0,
        why: "Broad, thematic questions need facts spread across the whole corpus. GraphRAG pre-summarizes communities and runs map-reduce over them, which no single top-k can cover." },
      { q: "A team adds an agentic RAG loop and some queries now take a minute and cost a fortune. What did they most likely forget?",
        choices: ["Prompt caching for the document prefix at ingest time",
                  "Switching from HNSW to IVF for faster single searches",
                  "Re-embedding the corpus with the agent's own model",
                  "A step or token budget that caps the number of searches"],
        answer: 3,
        why: "Agentic RAG searches until it judges the evidence sufficient. Without a cap, hard questions loop. Expect 2 to 5 times the latency even when it works well." }
    ],
    "rag-eval": [
      { q: "Why measure retrieval and generation separately instead of only grading the final answers?",
        choices: ["End-to-end answer quality cannot be scored by an LLM judge",
                  "Generation metrics only work when retrieval is already perfect",
                  "Separate scores show which component failed: retriever or model",
                  "Retrieval metrics remove the need for any human labels"],
        answer: 2,
        why: "A wrong answer can come from a missed passage or a misused one. Separate metrics point to the component to fix, while end-to-end scores hide that." },
      { q: "With k = 10, a reranker moves a relevant chunk from rank 6 to rank 1. What happens to the metrics?",
        choices: ["recall@10 rises while MRR stays the same",
                  "recall@10 stays the same while RR and nDCG rise",
                  "All metrics stay the same because the top-10 set is unchanged",
                  "nDCG falls because the ideal ordering has changed"],
        answer: 1,
        why: "Recall ignores order inside the top k, so it doesn't move. RR (first hit now at rank 1) and nDCG (higher-ranked hits count more) both reward the better order." },
      { q: "Your eval set is built only from questions an LLM wrote from each chunk, and recall@5 is 0.98. Why be suspicious?",
        choices: ["Questions copied from chunk wording make retrieval look easier than it is",
                  "Synthetic questions are always harder than real ones, so 0.98 is impossible",
                  "recall@5 cannot exceed 0.9 on any real-world corpus",
                  "Synthetic sets measure faithfulness, not retrieval quality"],
        answer: 0,
        why: "Questions that reuse a chunk's exact words match it trivially. Real users paraphrase. Build the set from real questions and use synthetic ones only to fill gaps." }
    ]
  },
  challenges: [
    { id: "emb-boundary-query",
      widget: "embeddings-search-demo",
      goal: "With top-k at 3, aim the query so that the #1 hit is a billing topic but an account topic still makes the top 3.",
      hint: "Clusters sit at different angles. Swing the query between the account cluster and the billing cluster, closer to billing.",
      success: "Cosine depends only on direction, so a query between clusters pulls neighbours from both.",
      check: function (w) {
        var k = +document.getElementById("embeddings-search-k").value;
        if (k !== 3) return false;
        var t = document.getElementById("embeddings-search-readout").textContent || "";
        var items = t.replace(/^Top-\d+:\s*/, "").split(" · ").map(function (s) { return s.replace(/\s*\([^)]*\)\s*$/, "").trim(); });
        var acct = ["reset password", "forgot login", "2FA code missing", "change email", "locked account"];
        var bill = ["refund request", "invoice copy", "update card", "charged twice", "cancel plan"];
        return items.length === 3 && bill.indexOf(items[0]) >= 0 &&
          items.some(function (x) { return acct.indexOf(x) >= 0; });
      } },
    { id: "chunk-clean-cuts",
      widget: "chunking-demo",
      goal: "Find settings where no chunk ends mid-sentence, with at least 5 words of overlap and no more than 20% extra stored text.",
      hint: "Snapping lets a chunk end early at a full stop. Then balance overlap against chunk size to keep the overhead down.",
      success: "Sentence-aware boundaries keep chunks readable; modest overlap protects boundary text without bloating storage.",
      check: function (w) {
        var t = document.getElementById("chunking-readout").textContent || "";
        var pct = t.match(/\(\+(-?\d+)%\)/), cut = t.match(/(\d+) chunks? end mid-sentence/);
        var S = +document.getElementById("chunking-size").value;
        var O = Math.min(+document.getElementById("chunking-overlap").value, S - 1);
        return !!(pct && cut) && +cut[1] === 0 && +pct[1] <= 20 && O >= 5;
      } },
    { id: "ivf-full-recall-cheap",
      widget: "vector-db-demo",
      goal: "Find all 5 true neighbours (recall@5 = 5/5) while scanning less than 25% of the vectors.",
      hint: "The default query sits near a cell boundary. Probe one more cell, or see what happens to a query in the middle of a cell.",
      success: "IVF recall depends on the nprobe setting and on where the query falls; a little extra probing buys back the neighbours near the boundary.",
      check: function (w) {
        var t = document.getElementById("vector-db-readout").textContent || "";
        var r = t.match(/recall@5 = (\d)\/5/), p = t.match(/\((\d+)%\)/);
        return !!(r && p) && +r[1] === 5 && +p[1] < 25;
      } },
    { id: "rrf-bm25-wins",
      widget: "hybrid-rerank-demo",
      goal: "Without editing either list, make BM25's top hit d7 come first in the fused ranking.",
      hint: "d3 wins because it ranks high in both lists. Which slider changes how much the vector list counts?",
      success: "RRF weights decide how much each retriever's opinion counts; agreement between lists usually wins.",
      check: function (w) {
        function norm(s) { return (s || "").split(/[\s,;]+/).filter(Boolean).join(","); }
        if (norm(document.getElementById("hybrid-rerank-bm25").value) !== "d7,d3,d9,d1,d4") return false;
        if (norm(document.getElementById("hybrid-rerank-vec").value) !== "d3,d5,d7,d2,d9") return false;
        var t = document.getElementById("hybrid-rerank-readout").textContent || "";
        return /^Fused order: d7 >/.test(t);
      } },
    { id: "rewrite-one-search",
      widget: "query-transform-demo",
      goal: "Get the relevant doc d2 to rank #1 while running only one search.",
      hint: "Multi-query works but runs three searches. Which single query would look most like the help-centre page itself?",
      success: "HyDE searches with an answer-shaped query, and answers look like the documents you want to find.",
      check: function (w) {
        var t = document.getElementById("query-transform-readout").textContent || "";
        return /ranks #1 /.test(t) && /searches: 1$/.test(t.trim());
      } },
    { id: "ctx-q1-chunk",
      widget: "advanced-rag-demo",
      goal: "For the \"ACME Q1 2023 revenue\" query, get the correct chunk to rank #1 on its own, with no tie.",
      hint: "Without context, all three chunks only share the word \"revenue\" with the query. What would tell them apart?",
      success: "Contextual retrieval puts the company and period back into each chunk, so keyword and vector search can tell them apart.",
      check: function (w) {
        if (document.getElementById("advanced-rag-query").value !== "2") return false;
        var t = document.getElementById("advanced-rag-readout").textContent || "";
        return t.indexOf("The correct chunk ranks #1") === 0;
      } },
    { id: "eval-be-the-reranker",
      widget: "rag-eval-demo",
      goal: "Act as the reranker: with k = 5 and 4 relevant chunks, reorder the results so nDCG@5 is at least 0.95, keeping the same grades (one 3, one 2, two 1s).",
      hint: "Clicking cycles a grade 0→1→2→3→0, so to move a result, set its old slot to 0 and give the new slot the same grade. Best grades go first.",
      success: "nDCG rewards putting the most relevant results highest, which is exactly what a reranker does.",
      check: function (w) {
        if (+document.getElementById("rag-eval-k").value !== 5) return false;
        if (+document.getElementById("rag-eval-total").value !== 4) return false;
        var cells = document.querySelectorAll("#rag-eval-plot text.d-title");
        var g = [];
        for (var i = 0; i < cells.length; i++) g.push(+cells[i].textContent);
        var rel = g.filter(function (x) { return x > 0; }).sort().join(",");
        if (rel !== "1,1,2,3") return false;
        var m = (document.getElementById("rag-eval-readout").textContent || "").match(/DCG ([\d.]+) \/ IDCG ([\d.]+)/);
        return !!m && +m[2] > 0 && +m[1] / +m[2] >= 0.95;
      } }
  ]
};
