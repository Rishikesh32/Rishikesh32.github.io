/* Flagship scene: "Time series & forecasting: decomposition to prediction intervals" */
window.ATLAS_SCENES = window.ATLAS_SCENES || {};
window.ATLAS_SCENES["forecasting/overview"] = {
  unit: 34,
  metrics: [
    { id: "mape", label: "Backtest MAPE", tone: "good" },
    { id: "horizon", label: "Forecast Horizon", tone: "accent" },
    { id: "anomalies", label: "Anomalies Caught", tone: "good" }
  ],
  legend: { req: "raw series", data: "decomposed signal", res: "forecast interval", miss: "residual anomaly" },
  nodes: {
    history:  { type: "cyl",   x: 0,    y: 3.8,  r: 1.3, h: 1.4, color: "t1", label: "Historical TS", sub: "36 Months" },
    decomp:   { type: "slab",  x: 4.5,  y: 3.8,  w: 1.6, d: 2.2, h: 0.6, color: "accent", label: "STL Decomposition", sub: "Trend + Seasonality" },
    baseline: { type: "block", x: 9.0,  y: 1.2,  w: 1.6, d: 1.6, h: 0.8, color: "t3", label: "Seasonal Naive", sub: "Baseline Benchmark" },
    arima:    { type: "block", x: 9.0,  y: 6.4,  w: 1.6, d: 1.6, h: 0.9, color: "good", label: "Auto-ARIMA", sub: "SARIMA(1,1,1)(1,1,0)" },
    forecast: { type: "block", x: 13.5, y: 3.8,  w: 2.0, d: 2.0, h: 1.1, color: "good", label: "Forecast & Bounds", sub: "95% Prediction Interval" }
  },
  steps: [
    {
      title: "Decomposition into trend & seasonal cycles",
      tag: "Decompose",
      add: ["history", "decomp"],
      links: [["history", "decomp"]],
      text: "<p>STL decomposition strips out repeating 12-month seasonality and macroeconomic growth, leaving stationary residuals ready for statistical modeling.</p>",
      flows: [["history", "decomp", "data", { label: "raw series" }]],
      metrics: { mape: "--", horizon: "12 wks", anomalies: "0" }
    },
    {
      title: "Model selection against baseline benchmark",
      tag: "Model",
      add: ["baseline", "arima"],
      links: [["decomp", "baseline"], ["decomp", "arima"]],
      text: "<p>We benchmark ARIMA against seasonal naïve baselines via rolling backtesting. ARIMA achieves 6.2% MAPE compared to 14.8% for naïve persistence.</p>",
      flows: [["decomp", "baseline", "data", { label: "naive" }], ["decomp", "arima", "data", { label: "AICc optimization" }]],
      metrics: { mape: "6.2%", horizon: "12 wks", anomalies: "2" },
      changed: ["✓ ARIMA beats baseline (6.2% vs 14.8% MAPE)", "✓ Parameters: SARIMA(1,1,1)(1,1,0)[12]"]
    },
    {
      title: "Forward prediction with confidence intervals",
      tag: "Forecast",
      add: ["forecast"],
      links: [["arima", "forecast"]],
      text: "<p>Generating a 12-week forward forecast with 80% and 95% prediction intervals. Dynamic bounds alert operators to unexpected demand surges or supply shocks.</p>",
      flows: [["arima", "forecast", "res", { count: 4, dur: 0.8, label: "probabilistic bounds" }]],
      metrics: { mape: "6.2%", horizon: "12 wks", anomalies: "3 detected" },
      changed: ["✓ Forward projection published", "✓ Anomaly detection webhooks active"]
    }
  ]
};
