/* Interactive quantitative simulation scene for LLMs & Alternative Data in Quantitative Trading */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  function at(s, t, n) {
    var cyl = n.type === "cyl", w = cyl ? 0 : (n.w || 1.6), d = cyl ? 0 : (n.d || 1.6);
    n.x = s + t - w / 2;
    n.y = t - s - d / 2;
    return n;
  }

  window.ATLAS_SCENES["llms-alternative-data/overview"] = {
    unit: 34,
    metrics: [
      {
            "id": "sent",
            "label": "Sentiment Score",
            "tone": "accent"
      },
      {
            "id": "surp",
            "label": "Surprise Index",
            "tone": "signal"
      },
      {
            "id": "ic",
            "label": "Event IC",
            "tone": "good"
      },
      {"id": "pnl", "label": "Profit / P&L", "tone": "good"}
    ],
    legend: {"req": "text / satellite", "data": "FinBERT / LLM", "res": "event order", "miss": "hallucination"},
    nodes: {
      feed:    at(-5.6, 0,    { type: "cyl",   r: 1.1, h: 1.4, color: "t1", label: "Unstructured Feed", sub: "10-K & Transcripts" }),
      engine:  at(-1.0, 0,    { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "accent", label: "FinBERT / LLM", sub: "Embedding Pipeline" }),
      riskctl: at(2.8, -3.0,  { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t4", label: "Hallucination Gate", sub: "Confidence Guard" }),
      alpha:   at(2.8, 3.0,   { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t3", label: "Sentiment Score", sub: "Surprise Signal" }),
      venue:   at(6.6, 0,     { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "good", label: "Earnings Desk", sub: "Event Router" })
    },
    steps: [
      {
        title: "Alternative text ingestion & financial NER extraction",
        tag: "Text Processing",
        add: ["feed", "engine"],
        links: [["feed", "engine", "req", { lift: 30 }]],
        flows: [["feed", "engine", "req", { label: "10k documents/s", lift: 30 }]],
        text: "<p>Earnings calls, corporate 8-Ks, and supply chain shipping records are parsed into domain-specific named entities, removing conversational boilerplate and extracting forward guidance.</p>",
        metrics: {"sent": "+0.42 Score", "surp": "2.4\u03c3 Beat", "ic": "+0.038 IC", pnl: "+$0 (NLP Ingest)"}
      },
      {
        title: "Embedding projection & tone surprise calculation",
        tag: "Embedding Analysis",
        add: ["riskctl", "alpha"],
        links: [["engine", "alpha", "data", { lift: 28 }], ["engine", "riskctl", "miss", { lift: 28 }]],
        flows: [
          ["engine", "alpha", "data", { label: "Tone surprise alpha", lift: 28, pos: 0.42, dy: -6 }],
          ["engine", "riskctl", "miss", { label: "Verification check", lift: 28, pos: 0.58, dy: -6 }]
        ],
        text: "<p>Specialized financial language models quantify semantic tone divergence between prepared executive remarks and unscripted Q&A responses, predicting post-earnings announcement drift.</p>",
        metrics: {"sent": "+0.68 Divergence", "surp": "3.1\u03c3 Beat", "ic": "+0.074 IC", pnl: "+$11,600 (+5.8%)"},
        changed: ["+ Negative guidance cues extracted via Q&A embeddings", "\u26a1 Hallucination filter verifies numerical numbers against SEC filings"]
      },
      {
        title: "Systematic earnings announcement event trading",
        tag: "Event Execution",
        add: ["venue"],
        links: [["alpha", "venue", "res", { lift: 26 }], ["riskctl", "venue", "res", { lift: 26 }]],
        flows: [
          ["alpha", "venue", "res", { count: 3, dur: 0.7, label: "Event basket fill", lift: 26, pos: 0.5, dy: -6 }]
        ],
        text: "<p>Automated orders execute across post-market trading venues seconds after transcript release, capturing post-earnings drift while hedging market and sector beta.</p>",
        metrics: {"sent": "+0.65 Realized", "surp": "3.0\u03c3 Signal", "ic": "+0.082 Net IC", pnl: "+$31,400 (+15.7%)"},
        changed: ["\u2713 Post-earnings drift alpha captured", "\u2713 Sector beta strictly neutralized", "\u2713 Alternative data pipeline live"]
      }
    ]
  };
})();
