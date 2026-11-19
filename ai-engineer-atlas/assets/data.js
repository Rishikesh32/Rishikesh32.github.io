/* Single source of truth for areas and subtopics.
   Topic pages must use <section class="topic" id="SUBTOPIC_ID"> with the ids below. */
window.ATLAS = {
  tiers: [
    { id: "A", name: "Foundations", blurb: "Math, code, data and classical ML", color: "var(--t1)" },
    { id: "B", name: "LLM core", blurb: "How LLMs work and how to build on them", color: "var(--t2)" },
    { id: "C", name: "Make it good", blurb: "Adapt, measure and speed up models", color: "var(--t3)" },
    { id: "D", name: "Ship it", blurb: "Production, system design and safety", color: "var(--t4)" },
    { id: "E", name: "Grow", blurb: "Go deep and grow your career", color: "var(--t5)" }
  ],
  areas: [
    { n: 1, id: "foundations", file: "01-foundations.html", tier: "A", title: "Foundations", weeks: "8–12 wks", prereqs: [],
      summary: "The math, Python and software-engineering base everything else stands on.",
      subs: [
        ["linear-algebra", "Linear algebra"], ["calculus", "Calculus & gradients"], ["probability-statistics", "Probability & statistics"],
        ["optimization", "Optimization"], ["python", "Python in depth"], ["dsa", "Data structures & algorithms"],
        ["software-engineering", "Software engineering essentials"], ["devops-basics", "Linux, Docker & cloud basics"]
      ] },
    { n: 2, id: "data", file: "02-data.html", tier: "A", title: "Data skills", weeks: "3–4 wks", prereqs: [1],
      summary: "Query, clean, move and version the data your models live on.",
      subs: [
        ["sql", "SQL"], ["data-wrangling", "Data cleaning & EDA"], ["pipelines", "Pipelines & ETL"],
        ["formats", "File formats & storage"], ["labeling", "Labeling & data quality"], ["synthetic-data", "Synthetic data & versioning"]
      ] },
    { n: 3, id: "classical-ml", file: "03-classical-ml.html", tier: "A", title: "Classical machine learning", weeks: "5–6 wks", prereqs: [1, 2],
      summary: "Regression, trees, clustering and the evaluation habits that carry over to every model.",
      subs: [
        ["supervised", "Supervised learning"], ["trees-ensembles", "Trees & gradient boosting"], ["unsupervised", "Unsupervised learning"],
        ["evaluation", "Model evaluation & metrics"], ["bias-variance", "Bias–variance, overfitting & leakage"], ["feature-engineering", "Feature engineering & tuning"]
      ] },
    { n: 4, id: "deep-learning", file: "04-deep-learning.html", tier: "A", title: "Deep learning", weeks: "6–8 wks", prereqs: [3],
      summary: "Neural networks, backprop and PyTorch, from a single neuron to multi-GPU training.",
      subs: [
        ["neural-nets", "Neural network basics"], ["backprop", "Backpropagation"], ["pytorch", "PyTorch"],
        ["architectures", "CNNs, RNNs & autoencoders"], ["training", "Training techniques"], ["hardware", "GPUs & scaling training"]
      ] },
    { n: 5, id: "transformers-llms", file: "05-transformers-llms.html", tier: "B", title: "Transformers & LLMs", weeks: "5–6 wks", prereqs: [4],
      summary: "Tokens, attention and the training recipe behind modern language models.",
      subs: [
        ["tokenization", "Tokenization"], ["embeddings", "Embeddings & positional encoding"], ["attention", "Self-attention"],
        ["transformer-block", "The transformer block"], ["model-families", "Encoder, decoder & encoder–decoder"],
        ["training-pipeline", "Pretraining → instruction tuning → RLHF"], ["decoding", "Decoding & sampling"],
        ["frontier", "MoE, multimodal & reasoning models"], ["landscape", "Choosing a model"]
      ] },
    { n: 6, id: "llm-apis", file: "06-llm-apis.html", tier: "B", title: "Building with LLM APIs", weeks: "3–4 wks", prereqs: [5],
      summary: "Prompts, structured output, tool calls and the cost and reliability work around them.",
      subs: [
        ["prompting", "Prompt engineering"], ["structured-output", "Structured output"], ["tool-use", "Tool use / function calling"],
        ["streaming", "Streaming"], ["cost-latency", "Tokens, caching & cost"], ["reliability", "Errors, retries & routing"]
      ] },
    { n: 7, id: "rag", file: "07-rag.html", tier: "B", title: "Retrieval-augmented generation", weeks: "3–4 wks", prereqs: [6],
      summary: "Ground model answers in your own documents with search, chunking and reranking.",
      subs: [
        ["embeddings-search", "Embeddings & semantic search"], ["chunking", "Chunking"], ["vector-db", "Vector databases"],
        ["hybrid-rerank", "Hybrid search & reranking"], ["query-transform", "Query rewriting"], ["advanced-rag", "Advanced RAG patterns"],
        ["rag-eval", "Evaluating RAG"]
      ] },
    { n: 8, id: "agents", file: "08-agents.html", tier: "B", title: "AI agents", weeks: "4–5 wks", prereqs: [6, 7],
      summary: "Models that loop, call tools, remember and work together on multi-step tasks.",
      subs: [
        ["agent-loop", "The agent loop"], ["tool-design", "Tool design"], ["planning", "Planning & reflection"],
        ["memory", "Memory & context management"], ["multi-agent", "Multi-agent systems"], ["mcp", "Model Context Protocol (MCP)"],
        ["computer-use", "Computer & browser use"], ["guardrails-hitl", "Guardrails & human-in-the-loop"]
      ] },
    { n: 9, id: "fine-tuning", file: "09-fine-tuning.html", tier: "C", title: "Fine-tuning & adaptation", weeks: "3–4 wks", prereqs: [5, 6],
      summary: "When and how to change the weights: SFT, LoRA, preference tuning and distillation.",
      subs: [
        ["when-to-finetune", "Prompt vs RAG vs fine-tune"], ["sft", "Supervised fine-tuning"], ["peft", "LoRA & QLoRA"],
        ["preference", "RLHF, DPO & GRPO"], ["distillation", "Distillation & synthetic data"], ["tooling", "Fine-tuning tooling"]
      ] },
    { n: 10, id: "evaluation", file: "10-evaluation.html", tier: "C", title: "Evaluation", weeks: "3 wks", prereqs: [6],
      summary: "The most underrated skill: knowing, with evidence, whether your system got better.",
      subs: [
        ["eval-datasets", "Building eval datasets"], ["metrics", "Automated metrics"], ["llm-judge", "LLM-as-judge"],
        ["human-eval", "Human evaluation"], ["regression", "Regression testing & CI"], ["online", "A/B tests & online metrics"],
        ["red-teaming", "Red-teaming"], ["benchmarks", "Reading benchmarks"]
      ] },
    { n: 11, id: "inference", file: "11-inference.html", tier: "C", title: "Inference & optimization", weeks: "3 wks", prereqs: [5],
      summary: "Make models fast and cheap: quantization, KV cache, batching and serving engines.",
      subs: [
        ["quantization", "Quantization"], ["kv-cache", "KV cache"], ["batching", "Batching & throughput"],
        ["speculative", "Speculative decoding"], ["serving", "Serving engines"], ["gpu-math", "GPU memory math"],
        ["local", "Running models locally"]
      ] },
    { n: 12, id: "production", file: "12-production.html", tier: "D", title: "Production & LLMOps", weeks: "4 wks", prereqs: [6, 10],
      summary: "Deploy, observe and operate AI systems that real users depend on.",
      subs: [
        ["deployment", "Deployment"], ["cicd", "CI/CD for AI"], ["observability", "Observability & tracing"],
        ["monitoring", "Monitoring quality, drift & cost"], ["experiment-tracking", "Experiment tracking"],
        ["infra", "Kubernetes, queues & caching"], ["registries", "Model registries & feature stores"]
      ] },
    { n: 13, id: "system-design", file: "13-system-design.html", tier: "D", title: "AI system design", weeks: "3 wks", prereqs: [7, 8, 12],
      summary: "Put the pieces together and defend the trade-offs, in real systems and in interviews.",
      subs: [
        ["patterns", "Architecture patterns"], ["tradeoffs", "Quality, latency, cost & reliability"], ["resilience", "Rate limits & fallbacks"],
        ["ux", "UX for AI products"], ["case-studies", "Design case studies"]
      ] },
    { n: 14, id: "safety-security", file: "14-safety-security.html", tier: "D", title: "Safety, security & ethics", weeks: "2–3 wks", prereqs: [6, 8],
      summary: "Defend against injection and leaks, reduce harm and stay on the right side of regulation.",
      subs: [
        ["prompt-injection", "Prompt injection"], ["jailbreaks", "Jailbreaks"], ["privacy", "Privacy & PII"],
        ["hallucination", "Hallucination mitigation"], ["fairness", "Bias & fairness"], ["regulation", "Regulation & governance"]
      ] },
    { n: 15, id: "specializations", file: "15-specializations.html", tier: "E", title: "Specializations", weeks: "pick 1–2", prereqs: [4],
      summary: "Go deep in one domain: vision, speech, generative media, recommenders, time series or RL.",
      subs: [
        ["computer-vision", "Computer vision"], ["speech", "Speech & voice agents"], ["diffusion", "Diffusion & generative media"],
        ["recsys", "Recommender systems"], ["time-series", "Time series"], ["rl", "Reinforcement learning"]
      ] },
    { n: 16, id: "professional", file: "16-professional.html", tier: "E", title: "Professional skills", weeks: "ongoing", prereqs: [],
      summary: "Read papers, keep up, think in products and explain trade-offs clearly.",
      subs: [
        ["reading-papers", "Reading papers"], ["keeping-up", "Keeping up"], ["product-sense", "Product sense"],
        ["communication", "Communicating trade-offs"], ["portfolio", "Building a portfolio"]
      ] }
  ]
};
