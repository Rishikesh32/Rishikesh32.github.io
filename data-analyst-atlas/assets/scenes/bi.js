/* Flagship scene: "BI & dashboards: star schema to decision cockpit" */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
window.ATLAS_SCENES["bi/overview"] = {
  unit: 34,
  metrics: [
    { id: "load", label: "Query latency", tone: "accent" },
    { id: "users", label: "Weekly active users", tone: "good" },
    { id: "trust", label: "Data trust score", tone: "good" }
  ],
  legend: { req: "user interaction", data: "filtered queries", res: "rendered visuals", miss: "fan-out / slow query" },
  nodes: {
    dim_cust: { type: "block", x: 0,    y: 0,    w: 1.4, d: 1.4, h: 0.8, color: "t2", label: "dim_customers", sub: "1 row / cust" },
    dim_date: { type: "block", x: 0,    y: 3.8,  w: 1.4, d: 1.4, h: 0.8, color: "t2", label: "dim_date", sub: "calendar" },
    dim_prod: { type: "block", x: 0,    y: 7.6,  w: 1.4, d: 1.4, h: 0.8, color: "t2", label: "dim_products", sub: "SKUs" },
    fact_sales:{ type: "cyl",   x: 4.8,  y: 3.8,  r: 1.2, h: 1.3, color: "good", label: "fact_orders", sub: "Star Schema" },
    semantic: { type: "slab",  x: 9.0,  y: 3.8,  w: 1.5, d: 2.2, h: 0.6, color: "accent", label: "Semantic layer", sub: "DAX / Measures" },
    kpi_card: { type: "block", x: 13.5, y: 1.5,  w: 1.5, d: 1.5, h: 0.9, color: "t3", label: "Exec summary", sub: "KPI tiles" },
    trend:    { type: "block", x: 13.5, y: 5.8,  w: 1.5, d: 1.5, h: 0.9, color: "t4", label: "Cohort trend", sub: "Interactive" }
  },
  steps: [
    {
      title: "Star schema data model",
      tag: "Model",
      add: ["dim_cust", "dim_date", "dim_prod", "fact_sales"],
      links: [["dim_cust", "fact_sales"], ["dim_date", "fact_sales"], ["dim_prod", "fact_sales"]],
      text: "<p>A clean star schema with 1-to-many single-direction filters prevents many-to-many fan-out errors and powers blazing fast analytical queries.</p>",
      flows: [["dim_date", "fact_sales", "data", { label: "filter: 2026-Q1" }]],
      metrics: { load: "420 ms", users: "12", trust: "94%" }
    },
    {
      title: "Semantic layer & reusable measures",
      tag: "Measures",
      add: ["semantic"],
      links: [["fact_sales", "semantic"]],
      text: "<p>Measures like <code>SUM(Margin) / SUM(Revenue)</code> calculate dynamically in the filter context, guaranteeing mathematically sound aggregated ratios.</p>",
      flows: [["fact_sales", "semantic", "data", { count: 4, dur: 0.9, label: "raw transactions" }]],
      metrics: { load: "280 ms", users: "45", trust: "98%" },
      changed: ["+ Defined margin ratio measure", "+ Added year-over-year time intelligence"]
    },
    {
      title: "Executive cockpit & drill-down",
      tag: "Dashboard",
      add: ["kpi_card", "trend"],
      links: [["semantic", "kpi_card"], ["semantic", "trend"]],
      text: "<p>Executives view headline KPIs and comparisons at a glance, while operators use cross-filtering to drill down into product cohorts.</p>",
      flows: [["semantic", "kpi_card", "res", { label: "$14.2M (+18% YoY)" }], ["semantic", "trend", "res", { label: "retention 42%" }]],
      metrics: { load: "190 ms", users: "180+", trust: "99.4%" },
      changed: ["✓ Weekly active stakeholders: 180+", "✓ Executive adoption: 95%"]
    }
  ]
};
