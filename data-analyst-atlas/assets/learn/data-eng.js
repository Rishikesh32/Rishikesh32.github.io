window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["data-eng"] = {
  quiz: {
    "warehouses": [
      { q: "Why is <code>SELECT SUM(amount) FROM orders</code> much cheaper in a columnar warehouse than in a row-store app database?",
        choices: ["The warehouse caches every query result in memory", "The column store reads only the amount column, which is stored together and compressed", "Columnar databases skip rows where amount is zero", "Row stores have to sort the table before they can sum it"],
        answer: 1,
        why: "A column store keeps each column in its own blocks, so a sum over one column reads only that column. A row store keeps whole rows together and has to read every column to reach the amounts." },
      { q: "Your orders table is partitioned by <code>order_date</code>. Which query scans the least data for last week's revenue?",
        choices: ["<code>SELECT * FROM orders LIMIT 1000</code>, then filter in a spreadsheet", "<code>SELECT order_date, amount FROM orders</code>, then filter in pandas", "<code>SELECT order_date, SUM(amount) FROM orders WHERE order_date &gt;= CURRENT_DATE - 7 GROUP BY 1</code>", "<code>SELECT * FROM orders WHERE order_date &gt;= CURRENT_DATE - 7</code>"],
        answer: 2,
        why: "It names only two columns and filters on the partition column, so the engine reads 7 daily partitions of 2 columns. <code>LIMIT</code> does not shrink a scan, and filtering after the query still reads everything." },
      { q: "A colleague says \"I added <code>LIMIT 10</code>, so my <code>SELECT *</code> on the 2 TB events table is cheap.\" What is wrong?",
        choices: ["Nothing; LIMIT stops the scan after 10 rows on every warehouse", "LIMIT only works together with ORDER BY", "LIMIT makes the query slower because it forces a sort", "LIMIT trims the output, but the engine may still read every column of every partition"],
        answer: 3,
        why: "Cost follows bytes read, not rows returned. Without a partition filter and a short column list, the engine can still scan the whole table before handing back 10 rows. Use the table preview or a filtered, narrow query instead." }
    ],
    "elt": [
      { q: "Marketing redefines \"active customer\". In which setup can you rebuild two years of history without touching the source system?",
        choices: ["ELT, because the raw copy in the warehouse can be transformed again with new SQL", "ETL, because the transformed tables already hold the history", "Either, because both keep the original source rows", "Neither; a definition change always needs a fresh full extract"],
        answer: 0,
        why: "ELT loads an untouched raw copy first, so new logic is just another SQL run over it. ETL only stored the transformed output, so the original rows have to be extracted again." },
      { q: "An incremental load reads rows with <code>updated_at &gt;</code> the last loaded maximum. Some updates committed late are never picked up. What is the usual fix?",
        choices: ["Switch to a nightly full copy of every table", "Re-read a lookback window behind the high-water mark and upsert by primary key", "Run the load twice each night", "Sort the source table by updated_at before extracting"],
        answer: 1,
        why: "A lookback window re-reads recent rows so late commits are caught, and upserting by key means the re-read rows replace themselves instead of duplicating. Running twice without upserts just duplicates." },
      { q: "A pipeline task failed halfway and was retried. Revenue for that day is now exactly double. What property was the load missing?",
        choices: ["Partitioning", "Compression", "Idempotency: it appended rows instead of upserting or replacing the day", "Change data capture"],
        answer: 2,
        why: "An idempotent load gives the same result however many times it runs. A plain <code>INSERT</code> appends the same rows again on retry. <code>MERGE</code> by key, or delete-and-replace the day, fixes it." }
    ],
    "dimensional": [
      { q: "What does it mean to declare the grain of a fact table?",
        choices: ["Choose which dimensions it will join to", "State exactly what one row represents, such as one row per order line", "Pick the partition column", "Decide how many decimal places measures keep"],
        answer: 1,
        why: "The grain is the meaning of one row. Every measure and key must fit that grain; mixing grains, such as order headers and order lines, leads to double counting." },
      { q: "A customer moves from Leeds to Bristol. Finance wants last year's revenue by city to stay exactly as it was reported. Which dimension policy do you need?",
        choices: ["SCD Type 1, overwrite the city", "Drop the city column from the dimension", "Store city in the fact table as a measure", "SCD Type 2, add a new row with its own surrogate key and validity dates"],
        answer: 3,
        why: "Type 2 closes the Leeds row and adds a Bristol row. Old orders keep the surrogate key of the Leeds version, so historical reports do not change. Type 1 would restate them as Bristol." },
      { q: "You join <code>fct_orders</code> to a Type 2 <code>dim_customer</code> on <code>customer_id</code> only. Revenue comes out too high. Why?",
        choices: ["Each order matches every version of its customer, so it is counted once per version", "Type 2 dimensions store amounts that get added twice", "customer_id is not unique in the fact table", "The join drops customers without a current row"],
        answer: 0,
        why: "A Type 2 dimension has several rows per natural id. Join on the surrogate key stored in the fact, or on the id plus the validity date range, so each order matches exactly one version." }
    ],
    "dbt": [
      { q: "What does <code>{{ ref('stg_orders') }}</code> do in a dbt model?",
        choices: ["Copies stg_orders into the current model", "Runs stg_orders immediately before compiling", "Resolves to the right table name for the environment and records a dependency in the DAG", "Creates a view called ref_stg_orders"],
        answer: 2,
        why: "ref() does two jobs: it compiles to the correct schema and table for dev or prod, and it adds an edge so dbt builds stg_orders first. Hard-coding the table name loses both." },
      { q: "You changed <code>stg_orders</code>. Which command rebuilds it and keeps every table that depends on it up to date?",
        choices: ["<code>dbt build --select stg_orders+</code>", "<code>dbt build --select +stg_orders</code>", "<code>dbt build --select stg_orders</code>", "<code>dbt source freshness</code>"],
        answer: 0,
        why: "A trailing plus selects the model and everything downstream. A leading plus selects upstream parents, and the bare name rebuilds only that model, leaving downstream tables stale." },
      { q: "Your 2-billion-row events model takes 40 minutes as a <code>table</code>. Only a few million rows change each day. What should you try?",
        choices: ["Make it a <code>view</code> so nothing is stored", "Make it <code>ephemeral</code> so it is inlined", "Split it into 40 smaller models", "Make it <code>incremental</code> with a <code>unique_key</code> and a filter on recent rows"],
        answer: 3,
        why: "An incremental model processes only new or changed rows each run and merges them by key. A view would push the 40-minute cost onto every query that reads it." }
    ],
    "orchestration": [
      { q: "Why is \"run dbt at 06:00 because the extract usually finishes by 05:40\" fragile?",
        choices: ["Cron cannot schedule jobs before 07:00", "On a slow morning dbt starts before the extract finishes and builds on half-loaded data", "dbt cannot run while another job is running", "Fixed times use more warehouse credits"],
        answer: 1,
        why: "Fixed start times guess at durations. An orchestrator starts dbt only when the extract task has succeeded, so a slow morning makes the run later instead of wrong." },
      { q: "The payments API times out on the first two attempts most mornings, then works. The dashboard must refresh by 07:00. What is a sensible setting?",
        choices: ["No retries, so failures are noticed at once", "Ten retries with a 60-minute delay to be safe", "Two or three retries with a short delay that still fits before the deadline", "Remove the dependency so dbt runs without payments"],
        answer: 2,
        why: "Retries absorb transient errors, but each one costs the task duration plus the delay. Size retries and delay to fit the deadline; removing the dependency would publish incomplete revenue." },
      { q: "<code>extract_orders</code> fails every attempt after a column was renamed in the app. What do downstream tasks do in an Airflow-style orchestrator?",
        choices: ["They are marked upstream_failed and do not run, so the dashboard keeps yesterday's data", "They run on whatever orders data is there", "They retry until extract_orders succeeds", "They are skipped and marked success"],
        answer: 0,
        why: "When a task finally fails, everything that depends on it is held back as <code>upstream_failed</code>. That stops partial data reaching the dashboard; a persistent failure then needs a code fix, not more retries." }
    ],
    "data-testing": [
      { q: "What does a passing dbt data test return?",
        choices: ["One row saying PASS", "The row count of the model", "Zero rows: the test query looks for bad rows", "A boolean column with all values true"],
        answer: 2,
        why: "A dbt data test is a SELECT that finds rows breaking the rule, such as duplicate keys. Zero rows returned means the test passes." },
      { q: "All your tests pass, yet the dashboard shows the same numbers as two days ago. Which test was missing?",
        choices: ["unique on order_id", "accepted_values on status", "relationships to customers", "Source freshness on the loaded-at timestamp"],
        answer: 3,
        why: "Stale data is still valid data: keys are unique and values allowed. Only a freshness check on <code>_loaded_at</code> notices that the load stopped." },
      { q: "A new status value <code>'on_hold'</code> appears now and then. You want to hear about it without stopping the morning build. What do you set?",
        choices: ["Delete the accepted_values test", "Keep accepted_values on status with severity warn", "Make every test severity warn", "Add a unique test on status"],
        answer: 1,
        why: "Severity warn lets the run publish and posts an alert, which suits \"a human should look\" problems. Turning every test to warn would let wrong numbers through; deleting the test hides the signal." }
    ]
  },
  challenges: [
    { id: "wh-30-days-under-1gb",
      widget: "wh-demo",
      goal: "Answer \"revenue per day for the last 30 days\" (it needs order_date and amount, and a date filter of at least 30 days) while scanning under 1 GB.",
      hint: "Two separate ideas each cut the scan: reading fewer columns, and skipping old days entirely.",
      success: "Columnar storage cuts the columns read and partition pruning cuts the rows read; you need both to get from hundreds of GB to a fraction of one.",
      check: function (w) {
        var t = document.getElementById("wh-readout").textContent, m = t.match(/scanned ([\d.]+) GB/);
        var od = document.getElementById("wh-col-order_date"), am = document.getElementById("wh-col-amount");
        return !!(m && od && am && od.checked && am.checked && parseInt(document.getElementById("wh-days").value, 10) >= 30 && parseFloat(m[1]) < 1);
      } },
    { id: "elt-no-misses",
      widget: "elt-demo",
      goal: "Design a load where a rule change never needs the source again, no late updates are missed, and fewer than 600,000 rows move per night.",
      hint: "A strict incremental load is fast but misses late commits; how far back do you need to look?",
      success: "ELT with an incremental load and a small lookback window is fast, complete and rebuildable from the raw copy.",
      check: function (w) {
        var t = document.getElementById("elt-readout").textContent;
        var r = t.match(/rows moved ([\d,]+)/), m = t.match(/missed late updates (\d+)/);
        return !!(/^ELT/.test(t) && r && m && parseInt(r[1].replace(/,/g, ""), 10) < 600000 && parseInt(m[1], 10) === 0);
      } },
    { id: "scd-keep-leeds",
      widget: "scd-demo",
      goal: "Play all five events and make the report still credit Leeds with £180, the sales that really happened there.",
      hint: "Under one policy Ana's January order follows her to Bristol. Which policy keeps a separate row for her Leeds years?",
      success: "Type 2 gives each version of the customer its own surrogate key, so old facts keep the attributes that were true at the time.",
      check: function (w) {
        var t = document.getElementById("scd-readout").textContent;
        return /event 5\/5/.test(t) && /Leeds £180\b/.test(t);
      } },
    { id: "dbt-biggest-blast",
      widget: "dbt-demo",
      goal: "Find the staging model whose change forces the most models to rebuild when you also rebuild everything downstream.",
      hint: "Choose the model+ selector, then try each stg_ model and count the highlighted boxes.",
      success: "stg_orders feeds facts, dimensions and reports, so a change there has the widest blast radius; model+ keeps all of it consistent.",
      check: function (w) {
        var m = document.getElementById("dbt-model").value, t = document.getElementById("dbt-readout").textContent;
        return m.indexOf("stg_") === 0 && /\+ · 6 models rebuilt/.test(t);
      } },
    { id: "orch-beat-deadline",
      widget: "orch-demo",
      goal: "The payments API times out twice every morning. Get the dashboard refreshed before the 07:00 deadline.",
      hint: "You need enough retries to reach the third attempt, and each retry costs its delay on top of the 15-minute timeout.",
      success: "Retries turn transient failures into late successes, but retries times delay must still fit inside your deadline.",
      check: function (w) {
        return document.getElementById("orch-scn").value === "transient" && /deadline 07:00 met/.test(document.getElementById("orch-readout").textContent);
      } },
    { id: "dq-warn-stale",
      widget: "dq-demo",
      goal: "The load is 30 hours old, but sales still want the dashboard published with a loud warning. Publish with 0 errors and exactly 1 warning while the stale load is still there.",
      hint: "One problem should be fixed at the source, and one test's severity should change.",
      success: "Severity decides what a failure does: error blocks the run, warn publishes and alerts, so choose it test by test.",
      check: function (w) {
        return document.getElementById("dq-stale").checked && /0 errors, 1 warning\b/.test(document.getElementById("dq-readout").textContent);
      } }
  ]
};
