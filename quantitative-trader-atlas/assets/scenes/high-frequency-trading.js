/* Interactive quantitative simulation scene for High-Frequency Trading & Ultra-Low Latency */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  function at(s, t, n) {
    var cyl = n.type === "cyl", w = cyl ? 0 : (n.w || 1.6), d = cyl ? 0 : (n.d || 1.6);
    n.x = s + t - w / 2;
    n.y = t - s - d / 2;
    return n;
  }

  window.ATLAS_SCENES["high-frequency-trading/overview"] = {
    unit: 34,
    metrics: [
      {
            "id": "lat",
            "label": "Tick-to-Trade",
            "tone": "accent"
      },
      {
            "id": "drop",
            "label": "Packet Drop",
            "tone": "signal"
      },
      {
            "id": "fill",
            "label": "Queue Hit Rate",
            "tone": "good"
      },
      {"id": "pnl", "label": "Profit / P&L", "tone": "good"}
    ],
    legend: {"req": "10GbE packet", "data": "FPGA book", "res": "OUCH order", "miss": "stale race"},
    nodes: {
      feed:    at(-5.6, 0,    { type: "cyl",   r: 1.1, h: 1.4, color: "t1", label: "FPGA Kernel", sub: "10GbE Solarflare" }),
      engine:  at(-1.0, 0,    { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "accent", label: "C++20 Engine", sub: "Lock-Free Ring" }),
      riskctl: at(2.8, -3.0,  { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t4", label: "Pre-Trade Guard", sub: "FPGA Risk Gate" }),
      alpha:   at(2.8, 3.0,   { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t3", label: "Sub-Microsec", sub: "Queue Jump" }),
      venue:   at(6.6, 0,     { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "good", label: "Co-Lo Venue", sub: "Direct Market" })
    },
    steps: [
      {
        title: "Kernel bypass packet capture & FPGA book building",
        tag: "Kernel Bypass",
        add: ["feed", "engine"],
        links: [["feed", "engine", "req", { lift: 30 }]],
        flows: [["feed", "engine", "req", { label: "10GbE packets", lift: 30 }]],
        text: "<p>Solarflare OpenOnload and FPGA NICs bypass the operating system kernel entirely, streaming raw UDP market packets directly into CPU L1/L2 caches without context switches.</p>",
        metrics: {"lat": "420 ns", "drop": "0.000%", "fill": "84.2%", pnl: "+$0 (Co-Lo Start)"}
      },
      {
        title: "Lock-free ring buffers & hardware pre-trade risk",
        tag: "Hardware Risk",
        add: ["riskctl", "alpha"],
        links: [["engine", "alpha", "data", { lift: 28 }], ["engine", "riskctl", "miss", { lift: 28 }]],
        flows: [
          ["engine", "alpha", "data", { label: "Sub-microsec signal", lift: 28, pos: 0.42, dy: -6 }],
          ["engine", "riskctl", "miss", { label: "FPGA risk pass", lift: 28, pos: 0.58, dy: -6 }]
        ],
        text: "<p>Orders pass through hardware-enforced SEC Rule 15c3-5 pre-trade risk gates in under 20 nanoseconds, checking price bands and credit limits in silicon.</p>",
        metrics: {"lat": "280 ns", "drop": "0.000%", "fill": "92.8%", pnl: "+$31,700 (+6.3%)"},
        changed: ["+ In-silicon price band validation active", "\u26a1 Zero-allocation C++ memory layout locked in cache"]
      },
      {
        title: "Deterministic OUCH order injection & queue priority capture",
        tag: "Order Injection",
        add: ["venue"],
        links: [["alpha", "venue", "res", { lift: 26 }], ["riskctl", "venue", "res", { lift: 26 }]],
        flows: [
          ["alpha", "venue", "res", { count: 3, dur: 0.7, label: "Direct OUCH order", lift: 26, pos: 0.5, dy: -6 }]
        ],
        text: "<p>Deterministic fiber cross-connects inject cancel-and-replace packets into matching engines, winning queue priority races at the inside spread.</p>",
        metrics: {"lat": "190 ns", "drop": "0.000%", "fill": "97.4%", pnl: "+$84,500 (+16.9%)"},
        changed: ["\u2713 Sub-200ns tick-to-trade latency confirmed", "\u2713 Queue position capture rate exceeds 95%", "\u2713 Production co-location active"]
      }
    ]
  };
})();
