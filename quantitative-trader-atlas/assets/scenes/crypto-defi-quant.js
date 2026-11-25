/* Interactive quantitative simulation scene for Crypto & DeFi Quantitative Strategies */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
(function () {
  function at(s, t, n) {
    var cyl = n.type === "cyl", w = cyl ? 0 : (n.w || 1.6), d = cyl ? 0 : (n.d || 1.6);
    n.x = s + t - w / 2;
    n.y = t - s - d / 2;
    return n;
  }

  window.ATLAS_SCENES["crypto-defi-quant/overview"] = {
    unit: 34,
    metrics: [
      {
            "id": "gas",
            "label": "Gas Gwei",
            "tone": "accent"
      },
      {
            "id": "arb",
            "label": "Arb Profit",
            "tone": "signal"
      },
      {
            "id": "front",
            "label": "MEV Shield",
            "tone": "good"
      }
],
    legend: {"req": "mempool tx", "data": "AMM curve", "res": "bundle tx", "miss": "sandwich slip"},
    nodes: {
      feed:    at(-5.6, 0,    { type: "cyl",   r: 1.1, h: 1.4, color: "t1", label: "RPC Node", sub: "Mempool / DEX" }),
      engine:  at(-1.0, 0,    { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "accent", label: "AMM Model", sub: "CFMM Solver" }),
      riskctl: at(2.8, -3.0,  { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t4", label: "MEV Shield", sub: "Slippage Bound" }),
      alpha:   at(2.8, 3.0,   { type: "block", w: 1.6, d: 1.6, h: 1.0, color: "t3", label: "Cross-DEX Arb", sub: "Liquidity Alpha" }),
      venue:   at(6.6, 0,     { type: "block", w: 1.6, d: 1.6, h: 1.2, color: "good", label: "Flashbots", sub: "Private Bundle" })
    },
    steps: [
      {
        title: "Mempool decoding & Constant Product Market Maker modeling",
        tag: "Mempool Decoding",
        add: ["feed", "engine"],
        links: [["feed", "engine", "req", { lift: 30 }]],
        flows: [["feed", "engine", "req", { label: "Pending tx stream", lift: 30 }]],
        text: "<p>Pending decentralized exchange swaps are simulated against Uniswap v2/v3 concentrated liquidity curves to identify deterministic cross-venue price discrepancies.</p>",
        metrics: {"gas": "18 Gwei", "arb": "$1,450 / hr", "front": "Protected"}
      },
      {
        title: "Convex arbitrage sizing & slippage bounding",
        tag: "Arbitrage Sizing",
        add: ["riskctl", "alpha"],
        links: [["engine", "alpha", "data", { lift: 28 }], ["engine", "riskctl", "miss", { lift: 28 }]],
        flows: [
          ["engine", "alpha", "data", { label: "Optimal swap size", lift: 28, pos: 0.42, dy: -6 }],
          ["engine", "riskctl", "miss", { label: "Slippage check", lift: 28, pos: 0.58, dy: -6 }]
        ],
        text: "<p>Closed-form convex optimization calculates the exact input token amount that maximizes net profit after gas fees and price impact across multi-hop pools.</p>",
        metrics: {"gas": "24 Gwei", "arb": "$3,820 / hr", "front": "Shielded"},
        changed: ["+ Multi-hop arbitrage path verified", "\u26a1 Maximum slippage bound to 0.05%"]
      },
      {
        title: "Flashbots bundle submission & zero-revert execution",
        tag: "Private Bundling",
        add: ["venue"],
        links: [["alpha", "venue", "res", { lift: 26 }], ["riskctl", "venue", "res", { lift: 26 }]],
        flows: [
          ["alpha", "venue", "res", { count: 3, dur: 0.7, label: "Private bundle", lift: 26, pos: 0.5, dy: -6 }]
        ],
        text: "<p>Transactions are bundled directly to Ethereum block builders via private RPC relays, guaranteeing atomic inclusion at the top of the block with zero revert risk.</p>",
        metrics: {"gas": "22 Gwei", "arb": "$6,140 / hr", "front": "100% MEV Shield"},
        changed: ["\u2713 Private bundle mined at top of block", "\u2713 Zero failed-transaction gas burned", "\u2713 Cross-DEX arbitrage completed"]
      }
    ]
  };
})();
