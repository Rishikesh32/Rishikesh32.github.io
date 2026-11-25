/* Flagship scene: "SQL: from raw records to window aggregates" */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
window.ATLAS_SCENES["sql/overview"] = {
  unit: 34,
  metrics: [
    { id: "scanned", label: "Rows Scanned", tone: "accent" },
    { id: "joined", label: "Joined Output", tone: "good" },
    { id: "latency", label: "Execution Time", tone: "good" }
  ],
  legend: { req: "query plan", data: "streamed rows", res: "aggregated result", miss: "cartesian explosion / scan" },
  nodes: {
    orders:   { type: "cyl",   x: 0,    y: 1.5,  r: 1.2, h: 1.4, color: "t1", label: "orders table", sub: "100k rows" },
    users:    { type: "cyl",   x: 0,    y: 6.0,  r: 1.2, h: 1.4, color: "t2", label: "users table", sub: "25k rows" },
    join_eng: { type: "slab",  x: 4.8,  y: 3.8,  w: 1.6, d: 2.2, h: 0.6, color: "accent", label: "Hash Join", sub: "ON user_id" },
    filter:   { type: "block", x: 9.0,  y: 3.8,  w: 1.6, d: 1.6, h: 0.9, color: "t3", label: "WHERE filter", sub: "completed" },
    window_fn:{ type: "block", x: 13.5, y: 3.8,  w: 1.8, d: 1.8, h: 1.1, color: "good", label: "Window / Aggregate", sub: "DENSE_RANK() & SUM" }
  },
  steps: [
    {
      title: "Index scan & hash join execution",
      tag: "Join",
      add: ["orders", "users", "join_eng"],
      links: [["orders", "join_eng"], ["users", "join_eng"]],
      text: "<p>The SQL query planner evaluates the FROM clause. It builds an in-memory hash table of users and probes it with streamed orders, avoiding an expensive \(O(N^2)\) nested loop.</p>",
      flows: [["orders", "join_eng", "data", { label: "100k rows" }], ["users", "join_eng", "data", { label: "25k rows" }]],
      metrics: { scanned: "125,000", joined: "100,000", latency: "140 ms" }
    },
    {
      title: "Predicate pushdown & row filtering",
      tag: "Filter",
      add: ["filter"],
      links: [["join_eng", "filter"]],
      text: "<p>WHERE conditions eliminate cancelled orders and test accounts before expensive windowing and grouping occur, keeping only verified transactions.</p>",
      flows: [["join_eng", "filter", "data", { label: "status = completed" }]],
      metrics: { scanned: "125,000", joined: "84,200", latency: "185 ms" },
      changed: ["+ Filter applied", "⚡ Filtered down to 84,200 rows"]
    },
    {
      title: "Window ranking & running aggregations",
      tag: "Window",
      add: ["window_fn"],
      links: [["filter", "window_fn"]],
      text: "<p>Window functions partition by customer and order by date. <code>ROW_NUMBER()</code> identifies repeat purchase milestones, and <code>SUM() OVER(...)</code> computes running customer lifetime value in a single efficient pass.</p>",
      flows: [["filter", "window_fn", "res", { count: 4, dur: 0.8, label: "windowed partition" }]],
      metrics: { scanned: "125,000", joined: "84,200", latency: "210 ms" },
      changed: ["✓ Window metrics computed", "✓ Single-pass analytical query complete"]
    }
  ]
};
