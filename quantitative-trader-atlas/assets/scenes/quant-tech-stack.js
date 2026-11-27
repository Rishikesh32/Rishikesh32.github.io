/* Interactive quantitative simulation scene for Quant Developer & Technology Stack */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  function at(s, t, n) {
    var cyl = n.type === "cyl", w = cyl ? 0 : (n.w || 1.6), d = cyl ? 0 : (n.d || 1.6);
    n.x = s + t - w / 2;
    n.y = t - s - d / 2;
    return n;
  }

  window.ATLAS_SCENES["quant-tech-stack/overview"] = {
    unit: 34,
    metrics: [
      {
            "id": "tp",
            "label": "Throughput",
            "tone": "accent"
      },
      {
            "id": "cache",
            "label": "Cache Hit",
            "tone": "signal"
      },
      {
            "id": "ipc",
            "label": "IPC Latency",
            "tone": "good"
      },
      {"id": "pnl", "label": "Profit / P&L", "tone": "good"}
    ],
    legend: {"req": "IPC message", "data": "Arrow buffer", "res": "market packet", "miss": "memory stall"},
    nodes: {
      feed:    at(-5.6, 0,    { type: "cyl",   r: 1.1, h: 1.4, color: "t1", label: "Kafka / Redpanda", sub: "Arrow Flight" }),
      engine:  at(-1.0, 0,    { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "accent", label: "DuckDB / Polars", sub: "Vectorized C++" }),
      riskctl: at(2.8, -3.0,  { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t4", label: "Zero-Copy", sub: "Memory Guard" }),
      alpha:   at(2.8, 3.0,   { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t3", label: "Distributed Ray", sub: "Parallel Alpha" }),
      venue:   at(6.6, 0,     { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "good", label: "gRPC / IPC", sub: "Async Gateway" })
    },
    steps: [
      {
        title: "Vectorized analytics & columnar memory layout",
        tag: "Vectorized Processing",
        add: ["feed", "engine"],
        links: [["feed", "engine", "req", { lift: 30 }]],
        flows: [["feed", "engine", "req", { label: "10M rows/s", lift: 30 }]],
        text: "<p>Apache Arrow zero-copy memory layouts enable high-throughput SIMD vectorization across millions of financial time-series observations without deserialization overhead.</p>",
        metrics: {"tp": "4.2M rows/s", "cache": "94.2%", "ipc": "1.4 \u03bcs", pnl: "+$0 (Zero-Copy)"}
      },
      {
        title: "Shared memory IPC & lock-free queue architecture",
        tag: "IPC Architecture",
        add: ["riskctl", "alpha"],
        links: [["engine", "alpha", "data", { lift: 28 }], ["engine", "riskctl", "miss", { lift: 28 }]],
        flows: [
          ["engine", "alpha", "data", { label: "Zero-copy pointer", lift: 28, pos: 0.42, dy: -6 }],
          ["engine", "riskctl", "miss", { label: "Ring buffer check", lift: 28, pos: 0.58, dy: -6 }]
        ],
        text: "<p>Single-Producer Single-Consumer (SPSC) lock-free ring buffers in POSIX shared memory allow Python research models and C++ execution engines to exchange orders in sub-microseconds.</p>",
        metrics: {"tp": "12.8M rows/s", "cache": "98.1%", "ipc": "420 ns", pnl: "+$14,800 (+4.9%)"},
        changed: ["+ Zero-copy shared memory queues active", "\u26a1 CPU core pinning and NUMA affinity set"]
      },
      {
        title: "Production async gateways & distributed cluster scaling",
        tag: "Cluster Scaling",
        add: ["venue"],
        links: [["alpha", "venue", "res", { lift: 26 }], ["riskctl", "venue", "res", { lift: 26 }]],
        flows: [
          ["alpha", "venue", "res", { count: 3, dur: 0.7, label: "Async gateway order", lift: 26, pos: 0.5, dy: -6 }]
        ],
        text: "<p>High-performance asynchronous gateways connect parallel Ray clusters to exchange co-location facilities, achieving deterministic low latency under extreme market volatility.</p>",
        metrics: {"tp": "28.5M rows/s", "cache": "99.4%", "ipc": "180 ns", pnl: "+$39,400 (+13.1%)"},
        changed: ["\u2713 Sub-microsecond IPC validated", "\u2713 Memory allocation zero in hot path", "\u2713 Distributed pipeline operational"]
      }
    ]
  };
})();
