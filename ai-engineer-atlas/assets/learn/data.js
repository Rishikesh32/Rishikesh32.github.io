window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["data"] = {
  quiz: {
    "sql": [
      { q: "Why does <code>WHERE COUNT(*) &gt;= 5</code> fail, while <code>HAVING COUNT(*) &gt;= 5</code> works?",
        choices: ["COUNT(*) is only allowed inside ORDER BY and LIMIT clauses",
                  "WHERE runs before GROUP BY, so no group counts exist yet",
                  "WHERE can only compare columns against constant strings",
                  "HAVING is just an alias of WHERE that some databases prefer"],
        answer: 1,
        why: "Logically, FROM and WHERE run first, then GROUP BY, then HAVING. Aggregates only exist after grouping, so filters on them belong in HAVING." },
      { q: "You join orders to a tags table where each order has 3 tags, then <code>SUM(o.amount)</code>. Revenue comes out 3× too high. Why?",
        choices: ["SUM skips NULL amounts, which distorts the total",
                  "INNER JOIN drops orders with no tags and rescales the rest",
                  "SUM needs an ORDER BY to aggregate rows correctly",
                  "The one-to-many join repeated each order once per tag"],
        answer: 3,
        why: "A join returns one row per matching pair, so each order appears three times and is summed three times. Check row counts before and after joins, or aggregate before joining." },
      { q: "You <code>LEFT JOIN</code> users to orders and add <code>WHERE o.status = 'paid'</code>. Users with no orders disappear. Why?",
        choices: ["Their o.status is NULL, so WHERE drops them; move the filter into ON",
                  "LEFT JOIN never keeps users that have no matching order rows",
                  "WHERE runs before the join, so it filters the orders table first",
                  "The comparison needs IS 'paid' instead of = 'paid' for text"],
        answer: 0,
        why: "Unmatched users get NULL order columns, and NULL = 'paid' is not true, so WHERE removes them and the query behaves like an INNER JOIN. Conditions on the right table go in ON." }
    ],
    "data-wrangling": [
      { q: "A column of prompt lengths (mostly 100 to 300 tokens) contains two pasted documents of 2,400 and 3,100 tokens. Which summary barely moves?",
        choices: ["The mean", "The standard deviation", "The maximum", "The median"],
        answer: 3,
        why: "The median depends only on the middle of the sorted values, so a few extreme values hardly shift it. The mean and standard deviation are dragged far toward the outliers." },
      { q: "A buggy logger writes −1 whenever it fails to record the token count. What should you do before computing statistics?",
        choices: ["Keep it, because −1 is a real measured value",
                  "Convert it to missing (NaN) and keep an is_missing flag",
                  "Replace it with 0 so the column stays non-negative",
                  "Clip it up to the lower IQR fence with the outliers"],
        answer: 1,
        why: "−1 is a sentinel meaning unknown, not a length. Treating it as data distorts every statistic; mark it missing, then decide how to impute, and keep a flag because missingness can carry signal." },
      { q: "You compute the median for imputation and the IQR clipping thresholds on the whole dataset, then split into train and test. What is wrong?",
        choices: ["Medians are too slow to compute on the full dataset",
                  "Clipping thresholds must always be fixed by hand instead",
                  "Test-set information leaks into the training pipeline",
                  "pandas cannot apply imputation after a split is made"],
        answer: 2,
        why: "Statistics fit on the full data include the test rows, so the test set is no longer unseen. Fit cleaning parameters on train only and apply them unchanged to test." }
    ],
    "pipelines": [
      { q: "A daily load uses plain INSERTs into a table with no unique key, and the orchestrator retries it after a timeout. What happens?",
        choices: ["The rows are duplicated and every sum built on them inflates",
                  "The database notices the repeat and silently skips the rows",
                  "Only the rows whose values changed are written a second time",
                  "The retry is rejected because the day was already loaded"],
        answer: 0,
        why: "A plain append is not idempotent: each run adds the full batch again. Upserting by key or overwriting the date partition gives the same result however many times it runs." },
      { q: "Why has ELT become the usual choice over ETL for analytics?",
        choices: ["Extracting data is faster when it skips the transform step",
                  "ETL tools cannot read JSON, so raw logs need ELT",
                  "Cheap storage lets you keep raw data and rerun SQL transforms",
                  "ELT removes the need for a warehouse altogether"],
        answer: 2,
        why: "ELT loads raw data first and transforms it inside the warehouse. Keeping the raw copy means a bug in a transform is fixed by rerunning SQL, not by re-extracting from the source." },
      { q: "A task picks which day to load with <code>now()</code>. You backfill last week after a fix. What goes wrong?",
        choices: ["The backfill is rejected because now() is in the future",
                  "Nothing, because now() always returns the run's date",
                  "The backfill runs much slower than the daily schedule",
                  "Every backfilled run loads today's data, not its own day"],
        answer: 3,
        why: "now() is the wall clock, not the run's logical date, so all seven runs load the same current data. Pass the run date as a parameter so any day can be replayed." }
    ],
    "formats": [
      { q: "A query uses 3 of a table's 50 columns. Why does it read far fewer bytes from Parquet than from CSV?",
        choices: ["Each column is stored together, so only those 3 are read",
                  "Parquet keeps a cache of results from earlier queries",
                  "CSV files have to be decompressed twice before reading",
                  "Parquet stores each row in a separate small file"],
        answer: 0,
        why: "Parquet is columnar: values for one column sit in contiguous, compressed chunks, so a reader fetches only the columns it needs. A row file must scan every byte of every row." },
      { q: "You are publishing fine-tuned model weights for strangers to download. Which format should you use?",
        choices: ["pickle (.pkl), because it is native to Python",
                  "CSV, because anyone can inspect it in a text editor",
                  "safetensors, because loading it cannot run code",
                  "JSONL, with one tensor stored on each line"],
        answer: 2,
        why: "Unpickling can execute arbitrary code, so untrusted .pkl or .pt files are a security hole. safetensors stores raw tensors plus a header and is safe to load." },
      { q: "A job writes 50,000 tiny Parquet files every day and queries over them keep getting slower. What is the likely fix?",
        choices: ["Switch to CSV, since Parquet cannot compress small files",
                  "Store one row group per row so filters can skip more",
                  "Convert to JSONL, which handles many files better",
                  "Compact them into fewer, larger files on a schedule"],
        answer: 3,
        why: "Every file carries overhead (opening it, reading its footer and metadata), which dominates when files are tiny. Compaction into larger files restores fast scans." }
    ],
    "labeling": [
      { q: "Two annotators agree on 95% of items, but 95% of the items are \"safe\". Why might the labels still be poor?",
        choices: ["95% falls below the 0.7 target, so it fails by definition",
                  "Chance alone yields high agreement here, so kappa may be low",
                  "Percent agreement understates how often they truly agree",
                  "Agreement has to be computed separately for each annotator"],
        answer: 1,
        why: "When one label dominates, two annotators who mostly say \"safe\" agree by chance. Cohen's kappa subtracts that chance agreement and can reveal that they barely agree on the rare positives." },
      { q: "You want an LLM to label 50,000 support tickets. What should you do first?",
        choices: ["Have humans label a gold set and measure model-human kappa",
                  "Trust it outright if it is a frontier model from a big lab",
                  "Ask the engineer who built the system to eyeball 10 tickets",
                  "Label all 50,000 first and correct mistakes as they appear"],
        answer: 0,
        why: "Treat the LLM as one more annotator: validate it against careful human labels, then route low-confidence or disagreeing items to people." },
      { q: "Your 100-item pilot comes back with kappa = 0.35. What is the usual first fix?",
        choices: ["Replace the annotators with more careful ones",
                  "Scale up anyway, since more labels average out the noise",
                  "Report percent agreement instead, which looks healthier",
                  "Clarify the guidelines with edge cases, then re-pilot"],
        answer: 3,
        why: "Low agreement usually traces back to ambiguous definitions, not careless people. Fix the rules once, re-pilot, and only scale when kappa reaches your target (often 0.7 or more)." }
    ],
    "synthetic-data": [
      { q: "Why do exact hashes miss many duplicates in LLM-generated data?",
        choices: ["Hash functions collide too often on long text",
                  "A one-word paraphrase gets a completely different hash",
                  "Generated text is rarely valid UTF-8, so hashing fails",
                  "Hashes only work on numbers, not on strings"],
        answer: 1,
        why: "Any change, even one word, produces an unrelated hash. Comparing shingle sets with Jaccard similarity (MinHash at scale) catches these near-duplicates." },
      { q: "You generate both training and eval examples with the same prompts and generator. What is the risk?",
        choices: ["The eval becomes much harder than real traffic",
                  "Deduplication removes every eval item by accident",
                  "Scores inflate, because the model is tested on its own style",
                  "DVC cannot version two datasets made by one prompt"],
        answer: 2,
        why: "A model trained on the generator's quirks looks great on more of the same. Keep synthetic data tagged and evaluate on real data to measure what users will see." },
      { q: "A quality regression shows up after retraining. How does versioning data with DVC help?",
        choices: ["Each run records a data hash, so you can restore that exact version",
                  "It stores the full dataset inside git so diffs are line by line",
                  "It automatically detects and fixes mislabeled examples",
                  "It deduplicates the dataset every time you commit"],
        answer: 0,
        why: "Git holds a small pointer with the content hash and storage holds the bytes. Checking out the old tag and running dvc checkout restores the exact data that trained the earlier model." }
    ]
  },
  challenges: [
    { id: "join-keep-orphan-order",
      widget: "join-demo",
      goal: "Pick the join that keeps order 104 (whose user does not exist) but drops the users who never ordered.",
      hint: "Ask which table's unmatched rows each join type keeps; you want only the orders side.",
      success: "A RIGHT JOIN keeps every row of the right table and fills missing left columns with NULL; a FULL JOIN would also keep the order-less users.",
      check: function (w) { return document.getElementById("join-type").value === "right"; } },
    { id: "clean-keep-all-rows",
      widget: "clean-demo",
      goal: "Keep all 28 rows (drop nothing) and bring the cleaned standard deviation below 75 tokens.",
      hint: "Dropping is off the table, so fill the gaps, tame the extremes, and look hard at that −1.",
      success: "Treating the sentinel as missing, clipping outliers to the fences and imputing keeps every row while removing what distorted the spread.",
      check: function (w) {
        var m = (document.getElementById("clean-readout").textContent || "").match(/clean: n=(\d+) mean=-?\d+ median=-?\d+ sd=(\d+)/);
        return !!m && parseInt(m[1], 10) === 28 && parseInt(m[2], 10) < 75;
      } },
    { id: "idem-six-runs",
      widget: "idem-demo",
      goal: "Run the load 6 times and still end with exactly 5 rows and the correct SUM(amount).",
      hint: "Retries will happen; pick a write mode whose result does not depend on how many times it runs.",
      success: "Upserting by key or overwriting the partition is idempotent: six runs leave the same five rows with the latest values.",
      check: function (w) {
        var runs = parseInt(document.getElementById("idem-runs").textContent, 10);
        var txt = document.getElementById("idem-readout").textContent || "";
        return runs >= 6 && txt.indexOf("(0 duplicates)") >= 0 && /correct$/.test(txt.trim());
      } },
    { id: "scan-1000x",
      widget: "scan-demo",
      goal: "Keep the table at 50 columns and make Parquet read at least 1,000× fewer bytes than the row file.",
      hint: "Column pruning alone tops out well short of 1,000×; what else can Parquet skip besides columns?",
      success: "Column pruning and predicate pushdown multiply: few columns from few row groups turns a full scan into a tiny read.",
      check: function (w) {
        var C = parseInt(document.getElementById("scan-cols").value, 10);
        var used = Math.min(parseInt(document.getElementById("scan-used").value, 10), C);
        var keep = parseInt(document.getElementById("scan-keep").value, 10);
        if (C !== 50 || !(used > 0) || !(keep > 0)) return false;
        return (C * 3 * 100) / (used * keep) >= 999.5;
      } },
    { id: "kappa-high-agree-low-kappa",
      widget: "kappa-demo",
      goal: "Enter counts where the annotators agree on at least 90% of items, yet Cohen's kappa is below 0.2.",
      hint: "Make one label very common and let the annotators disagree on most of the rare ones.",
      success: "When one class dominates, chance agreement is already huge, so high raw agreement can hide near-zero real agreement.",
      check: function (w) {
        var g = function (k) { var v = Math.floor(+document.getElementById("kappa-" + k).value || 0); return Math.max(0, v); };
        var yy = g("yy"), yn = g("yn"), ny = g("ny"), nn = g("nn"), n = yy + yn + ny + nn;
        if (!n) return false;
        var po = (yy + nn) / n, aY = (yy + yn) / n, bY = (yy + ny) / n;
        var pe = aY * bY + (1 - aY) * (1 - bY);
        if (pe >= 1) return false;
        return po >= 0.9 && (po - pe) / (1 - pe) < 0.2;
      } },
    { id: "dedup-high-threshold",
      widget: "dedup-demo",
      goal: "Without editing the texts, still flag this paraphrase pair as near-duplicates with the threshold at 0.60 or higher.",
      hint: "Shorter shingles share more pieces; what does that do to Jaccard similarity?",
      success: "Small k inflates Jaccard similarity, which is why k = 1 makes almost any two questions look alike and pipelines use 3 to 5 word shingles.",
      check: function (w) {
        var a = document.getElementById("dedup-a"), b = document.getElementById("dedup-b");
        if (a.value !== a.defaultValue || b.value !== b.defaultValue) return false;
        var th = parseFloat(document.getElementById("dedup-t").value);
        var txt = document.getElementById("dedup-readout").textContent || "";
        return th >= 0.599 && txt.indexOf("near-duplicate") >= 0;
      } }
  ]
};
