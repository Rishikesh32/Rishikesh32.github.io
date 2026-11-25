/* Single source of truth for areas and subtopics.
   Topic pages must use <section class="topic" id="SUBTOPIC_ID"> with the ids below. */
/* Areas whose pages are finished. Add an id here when its page, quizzes and scene are done. */
window.ATLAS_LIVE = ["statistics", "spreadsheets", "sql", "python", "cleaning", "eda", "visualization", "metrics", "experiments", "regression", "forecasting", "ml", "bi", "data-eng", "storytelling", "career"];
window.ATLAS = {
  tiers: [
    { id: "A", name: "Foundations", blurb: "Statistics, spreadsheets, SQL and Python", color: "var(--t1)" },
    { id: "B", name: "Core analysis", blurb: "Clean, explore, visualize and measure", color: "var(--t2)" },
    { id: "C", name: "Advanced analysis", blurb: "Experiments, models and forecasts", color: "var(--t3)" },
    { id: "D", name: "Tools & delivery", blurb: "Dashboards, pipelines and storytelling", color: "var(--t4)" },
    { id: "E", name: "Grow", blurb: "AI tools, ethics and your career", color: "var(--t5)" }
  ],
  areas: [
    { n: 1, id: "statistics", file: "01-statistics.html", tier: "A", title: "Statistics foundations", weeks: "4–6 wks", prereqs: [],
      summary: "Describe data, reason about uncertainty and avoid the classic statistical traps.",
      subs: [
        ["descriptive", "Descriptive statistics"], ["distributions", "Distributions"], ["probability", "Probability"],
        ["sampling", "Sampling & the central limit theorem"], ["inference", "Confidence intervals & hypothesis tests"], ["correlation", "Correlation vs causation"]
      ] },
    { n: 2, id: "spreadsheets", file: "02-spreadsheets.html", tier: "A", title: "Spreadsheets", weeks: "2–3 wks", prereqs: [],
      summary: "Excel and Google Sheets done properly: formulas, lookups, pivots and models.",
      subs: [
        ["formulas", "Formulas & references"], ["lookups", "Lookups (XLOOKUP & INDEX/MATCH)"], ["pivots", "Pivot tables"],
        ["cleaning-sheets", "Cleaning data in sheets"], ["charts-sheets", "Charts in spreadsheets"], ["what-if", "What-if analysis & models"]
      ] },
    { n: 3, id: "sql", file: "03-sql.html", tier: "A", title: "SQL", weeks: "4–6 wks", prereqs: [],
      summary: "The analyst's core language: query, join, aggregate and window over real tables.",
      subs: [
        ["select", "SELECT, filtering & sorting"], ["aggregation", "Aggregation & GROUP BY"], ["joins", "Joins"],
        ["subqueries", "Subqueries & CTEs"], ["window", "Window functions"], ["performance", "Query performance"]
      ] },
    { n: 4, id: "python", file: "04-python.html", tier: "A", title: "Python for data", weeks: "5–6 wks", prereqs: [3],
      summary: "Python, pandas and notebooks: from first DataFrame to reusable analysis code.",
      subs: [
        ["python-basics", "Python essentials"], ["numpy", "NumPy"], ["pandas", "pandas fundamentals"],
        ["wrangling", "Merging & reshaping"], ["notebooks", "Notebooks & reproducibility"], ["reusable-code", "Writing reusable analysis code"]
      ] },
    { n: 5, id: "cleaning", file: "05-cleaning.html", tier: "B", title: "Data cleaning & preparation", weeks: "3 wks", prereqs: [3, 4],
      summary: "Turn messy exports into trustworthy tables: missing values, duplicates, types and checks.",
      subs: [
        ["missing", "Missing values"], ["duplicates", "Duplicates & keys"], ["outliers", "Outliers"],
        ["types-dates", "Types, dates & parsing"], ["text", "Cleaning text & categories"], ["quality-checks", "Data quality checks"]
      ] },
    { n: 6, id: "eda", file: "06-eda.html", tier: "B", title: "Exploratory data analysis", weeks: "3 wks", prereqs: [1, 5],
      summary: "Ask good questions of a dataset and find the patterns worth explaining.",
      subs: [
        ["questions", "Asking the right questions"], ["univariate", "One variable at a time"], ["bivariate", "Relationships between variables"],
        ["segmentation", "Segmentation & cohorts"], ["time-patterns", "Patterns over time"], ["eda-workflow", "An EDA workflow"]
      ] },
    { n: 7, id: "visualization", file: "07-visualization.html", tier: "B", title: "Data visualization", weeks: "3–4 wks", prereqs: [6],
      summary: "Pick the right chart, encode data honestly and make the insight obvious.",
      subs: [
        ["chart-choice", "Choosing the right chart"], ["perception", "Perception & encoding"], ["color", "Color & accessibility"],
        ["python-viz", "Plotting in Python"], ["misleading", "Misleading charts"], ["chart-stories", "Annotating & telling the story"]
      ] },
    { n: 8, id: "metrics", file: "08-metrics.html", tier: "B", title: "Business metrics & KPIs", weeks: "3 wks", prereqs: [3, 6],
      summary: "Define the numbers a business runs on: funnels, retention, unit economics and metric trees.",
      subs: [
        ["metric-design", "Designing good metrics"], ["funnels", "Funnels & conversion"], ["retention", "Cohorts & retention"],
        ["unit-economics", "Unit economics (CAC, LTV, margin)"], ["north-star", "North star & guardrail metrics"], ["metric-trees", "Metric trees & root-cause analysis"]
      ] },
    { n: 9, id: "experiments", file: "09-experiments.html", tier: "C", title: "A/B testing & experiments", weeks: "3–4 wks", prereqs: [1, 8],
      summary: "Design, run and read experiments without fooling yourself.",
      subs: [
        ["design", "Experiment design"], ["power", "Power & sample size"], ["reading-results", "Reading results"],
        ["pitfalls", "Pitfalls: peeking, SRM & novelty"], ["multiple-testing", "Multiple tests & segments"], ["causal", "When you can't randomize"]
      ] },
    { n: 10, id: "regression", file: "10-regression.html", tier: "C", title: "Regression & statistical modeling", weeks: "4 wks", prereqs: [1, 4],
      summary: "Explain and predict with linear and logistic regression, and know when to trust them.",
      subs: [
        ["linear", "Linear regression"], ["interpreting", "Interpreting coefficients"], ["diagnostics", "Assumptions & diagnostics"],
        ["logistic", "Logistic regression"], ["model-features", "Features, interactions & overfitting"], ["model-comparison", "Comparing models"]
      ] },
    { n: 11, id: "forecasting", file: "11-forecasting.html", tier: "C", title: "Time series & forecasting", weeks: "3 wks", prereqs: [6, 10],
      summary: "Find trend and seasonality, forecast honestly and measure forecast error.",
      subs: [
        ["ts-components", "Trend, seasonality & noise"], ["smoothing", "Moving averages & smoothing"], ["baselines", "Baseline forecasts"],
        ["arima-ets", "ETS & ARIMA"], ["forecast-eval", "Backtesting & forecast error"], ["anomalies", "Anomaly detection"]
      ] },
    { n: 12, id: "ml", file: "12-ml.html", tier: "C", title: "Machine learning for analysts", weeks: "4 wks", prereqs: [10],
      summary: "Practical ML for analysts: segmentation, churn prediction and honest evaluation.",
      subs: [
        ["ml-basics", "How ML differs from analysis"], ["classification", "Classification"], ["clustering", "Clustering & segmentation"],
        ["model-eval", "Evaluating models"], ["explainability", "Explaining predictions"], ["when-not-ml", "When not to use ML"]
      ] },
    { n: 13, id: "bi", file: "13-bi.html", tier: "D", title: "BI & dashboards", weeks: "3–4 wks", prereqs: [7, 8],
      summary: "Build dashboards people trust and actually use, in Power BI, Tableau or Looker.",
      subs: [
        ["dashboard-design", "Dashboard design"], ["bi-modeling", "Data models for BI"], ["calculations", "Measures & calculations"],
        ["interactivity", "Filters & interactivity"], ["bi-performance", "Performance & refresh"], ["adoption", "Driving adoption"]
      ] },
    { n: 14, id: "data-eng", file: "14-data-eng.html", tier: "D", title: "Data engineering for analysts", weeks: "3–4 wks", prereqs: [3, 5],
      summary: "Warehouses, ELT, dbt and data quality: the plumbing behind every analysis.",
      subs: [
        ["warehouses", "Data warehouses"], ["elt", "ETL & ELT pipelines"], ["dimensional", "Dimensional modeling"],
        ["dbt", "dbt & analytics engineering"], ["orchestration", "Scheduling & orchestration"], ["data-testing", "Data quality & testing"]
      ] },
    { n: 15, id: "storytelling", file: "15-storytelling.html", tier: "D", title: "Communication & storytelling", weeks: "2–3 wks", prereqs: [7],
      summary: "Turn analysis into decisions: framing, writing, presenting and influencing.",
      subs: [
        ["framing", "Framing the question"], ["exec-summary", "Executive summaries"], ["presenting", "Presenting insights"],
        ["analysis-docs", "Writing analysis docs"], ["stakeholders", "Working with stakeholders"], ["recommendations", "Making recommendations"]
      ] },
    { n: 16, id: "career", file: "16-career.html", tier: "E", title: "AI tools, ethics & career", weeks: "ongoing", prereqs: [],
      summary: "Use AI assistants well, handle data responsibly and grow your analytics career.",
      subs: [
        ["ai-assistants", "AI assistants for analysis"], ["automation", "Automating reports"], ["ethics-privacy", "Ethics, privacy & bias"],
        ["portfolio", "Building a portfolio"], ["interviews", "Interviews & case studies"], ["career-paths", "Career paths"]
      ] }
  ]
};

window.ATLAS.areas.forEach(function (a) { a.live = window.ATLAS_LIVE.indexOf(a.id) >= 0; });
