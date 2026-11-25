window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["python"] = {
  quiz: {
    "python-basics": [
      { q: "You build <code>{o[\"customer\"]: o[\"amount\"] for o in orders}</code> from 6 orders and get only 4 entries. What happened?",
        choices: ["Two orders had missing amounts and were skipped", "Some customers appear more than once, and each repeat overwrote the earlier value", "Dict comprehensions drop the first and last items", "The comprehension filtered out orders below zero"],
        answer: 1,
        why: "Dict keys are unique. When a customer appears again, the new value silently replaces the old one, so you lose rows without any error. To total per customer, accumulate with <code>totals.get(key, 0) + amount</code> or use pandas <code>groupby</code>." },
      { q: "A CSV column holds amounts stored as text. What does <code>\"42\" + \"8\"</code> return in Python?",
        choices: ["50", "\"50\"", "\"428\"", "A TypeError"],
        answer: 2,
        why: "Adding two strings concatenates them. Text that looks like a number does not behave like one, which is why you check types and convert with <code>float()</code> or <code>pd.to_numeric</code> before doing maths." },
      { q: "Which comprehension gives the amounts of paid orders only?",
        choices: ["<code>[o[\"amount\"] for o in orders if o[\"status\"] == \"paid\"]</code>", "<code>[o[\"status\"] == \"paid\" for o in orders]</code>", "<code>[o for o[\"amount\"] in orders if \"paid\"]</code>", "<code>[if o[\"status\"] == \"paid\": o[\"amount\"] for o in orders]</code>"],
        answer: 0,
        why: "Read it as expression, loop, filter: give me <code>o[\"amount\"]</code>, for each <code>o</code> in <code>orders</code>, if the status is paid. The second option returns a list of True/False values instead of amounts." }
    ],
    "numpy": [
      { q: "<code>units</code> has shape (3, 4): 3 stores by 4 quarters. What does <code>units.sum(axis=0)</code> return?",
        choices: ["3 totals, one per store", "A single grand total", "4 totals, one per quarter", "The same (3, 4) array, sorted"],
        answer: 2,
        why: "<code>axis=0</code> runs down the rows and collapses them, leaving one value per column. Column totals here are quarter totals. Use <code>axis=1</code> for one total per store." },
      { q: "You multiply a (3, 4) array by a vector of 3 per-store factors with shape (3,) and get a ValueError. What is the fix?",
        choices: ["Reshape the vector to a column with <code>factors[:, None]</code>, shape (3, 1)", "Transpose the vector with <code>factors.T</code>", "Convert both to Python lists first", "Use <code>np.multiply</code> instead of <code>*</code>"],
        answer: 0,
        why: "Broadcasting right-aligns shapes, so a (3,) vector lines up with the last axis of size 4 and fails. As a (3, 1) column, the 1 stretches across the 4 columns. Transposing a 1-D array does nothing." },
      { q: "Why is <code>prices * units</code> on two NumPy arrays of a million values much faster than a Python loop?",
        choices: ["NumPy uses several GPUs automatically", "The arrays store raw numbers in one block, so one compiled loop does all the work", "NumPy skips half the values and estimates the rest", "Python loops are only slow on the first run"],
        answer: 1,
        why: "An ndarray holds same-typed numbers side by side in memory, so the multiplication runs as a single loop in compiled code. A Python list holds pointers to separate objects that a Python loop must visit one at a time." }
    ],
    "pandas": [
      { q: "Which filter keeps paid orders of at least 50?",
        choices: ["<code>df[df[\"status\"] == \"paid\" and df[\"amount\"] &gt;= 50]</code>", "<code>df[(df[\"status\"] == \"paid\") &amp; (df[\"amount\"] &gt;= 50)]</code>", "<code>df.where(\"paid\", 50)</code>", "<code>df[df[\"status\"] == \"paid\" &amp; df[\"amount\"] &gt;= 50]</code>"],
        answer: 1,
        why: "Masks combine with <code>&amp;</code>, and each condition needs its own parentheses because <code>&amp;</code> binds tighter than <code>==</code>. Python's <code>and</code> raises an error on a Series." },
      { q: "Right after <code>read_csv</code>, <code>df.info()</code> shows the <code>amount</code> column has dtype <code>object</code>. What does that most likely mean?",
        choices: ["The column is fine; object is pandas' name for decimal numbers", "The column is empty", "Some values are text, such as \"$1,204.50\", so the column was read as strings", "pandas loaded the column as dates"],
        answer: 2,
        why: "A numeric column becomes <code>object</code> when any value can't be parsed as a number. Sums will fail or concatenate, so clean the text and convert with <code>pd.to_numeric</code> first." },
      { q: "You write <code>df[df[\"amount\"] &gt; 100][\"flag\"] = 1</code> and <code>df</code> is unchanged. What should you write instead?",
        choices: ["<code>df.loc[df[\"amount\"] &gt; 100, \"flag\"] = 1</code>", "<code>df.iloc[df[\"amount\"] &gt; 100][\"flag\"] = 1</code>", "<code>df[\"flag\"][df[\"amount\"] &gt; 100] == 1</code>", "Run the same line twice"],
        answer: 0,
        why: "The original is chained assignment: the first brackets may return a temporary copy, and the value lands on that copy. One <code>.loc</code> call with a mask and a column name writes to <code>df</code> itself." }
    ],
    "wrangling": [
      { q: "You left-merge 5,000 orders with a customers table on <code>customer_id</code> and get 5,240 rows. What is the most likely cause?",
        choices: ["Some orders had no matching customer", "The customers table has duplicate ids, so those orders were repeated", "A left join always adds the unmatched customers too", "pandas added a header row per customer"],
        answer: 1,
        why: "A left join keeps every order exactly once unless the right table has several rows for the same key. Then each matching order is copied once per duplicate. <code>validate=\"m:1\"</code> turns this into an error." },
      { q: "Your long table has two rows for North / Feb. What happens when you reshape it with <code>pivot</code> versus <code>pivot_table(aggfunc=\"sum\")</code>?",
        choices: ["Both keep the first row and drop the second", "Both raise an error", "<code>pivot</code> sums them; <code>pivot_table</code> raises an error", "<code>pivot</code> raises a duplicate-entries error; <code>pivot_table</code> adds the two values into one cell"],
        answer: 3,
        why: "<code>pivot</code> only rearranges, so two values for one cell is an error. <code>pivot_table</code> aggregates them, with mean as the default, so pass <code>aggfunc=\"sum\"</code> for revenue." },
      { q: "Seaborn wants one row per region and month, but your sheet has a column per month. Which call fixes the shape?",
        choices: ["<code>wide.pivot_table(index=\"region\")</code>", "<code>pd.concat([wide, wide])</code>", "<code>wide.melt(id_vars=\"region\", var_name=\"month\", value_name=\"revenue\")</code>", "<code>wide.merge(wide, on=\"region\")</code>"],
        answer: 2,
        why: "<code>melt</code> turns column headers into values of a new column, going from wide to long. <code>pivot_table</code> goes the other way." }
    ],
    "notebooks": [
      { q: "A notebook's execution counts read 7, 3, 12, 5 from top to bottom. What should you conclude?",
        choices: ["The outputs came from an order you can't see on the page, so restart and run all before trusting them", "The notebook is fine, because each cell ran at least once", "Cells 2 and 4 failed", "The kernel crashed and reset the counters"],
        answer: 0,
        why: "Counts record the order cells ran. When they don't increase top to bottom, the kernel's state came from a hidden history, and outputs may not match what the code on the page would produce." },
      { q: "A cell runs <code>df[\"amount\"] = df[\"amount\"] * 1.2</code>. You run it twice by accident. What happens?",
        choices: ["Nothing, pandas ignores the second run", "VAT is applied twice, so amounts are 1.44 times the original", "pandas raises an error on the second run", "The second run undoes the first"],
        answer: 1,
        why: "The cell changes the column in place, so every rerun multiplies again. Derive a new column instead, such as <code>df.assign(amount_gross=...)</code>, so the cell gives the same result however often it runs." },
      { q: "You deleted the cell that defined <code>VAT_RATE</code>, but the notebook still runs. Why is that a problem?",
        choices: ["It isn't; deleted cells are saved in the file", "The variable will slowly lose precision", "Jupyter will reinsert the cell on save", "The kernel still remembers the variable, so the notebook will fail after the next restart or on a colleague's machine"],
        answer: 3,
        why: "The kernel keeps every variable you created until it restarts. The page no longer explains where <code>VAT_RATE</code> came from, so a fresh run raises a NameError." }
    ],
    "reusable-code": [
      { q: "You have three copied blocks that differ only in the region name and a threshold. What should the function's parameters be?",
        choices: ["The whole DataFrame and nothing else, with region and threshold as globals", "Region and threshold (plus the DataFrame), with sensible defaults", "One parameter per line in the original block", "No parameters; copy the function three times instead"],
        answer: 1,
        why: "Whatever differs between copies becomes a parameter. Pass the data in too, so the function doesn't depend on notebook globals, and give stable values defaults." },
      { q: "Calling your <code>clean(df)</code> function twice gives different results. What is the likely bug?",
        choices: ["The function has a docstring", "The function returns a new DataFrame", "The function modifies the input DataFrame in place", "The function has a default argument"],
        answer: 2,
        why: "A function that mutates its input changes the data the next call sees. Return a new DataFrame (for example with <code>.assign</code> or <code>.copy()</code>) and leave the input untouched." },
      { q: "Why add a tiny pytest test with a three-row DataFrame to <code>analysis.py</code>?",
        choices: ["It pins down what the function promises, such as whether <code>min_total</code> is inclusive, and catches changes that break it", "pytest makes pandas run faster", "Tests are required before Python will import a module", "It replaces the need for a docstring"],
        answer: 0,
        why: "A small known input with a known answer documents the edge cases and fails loudly when someone changes the logic. The docstring says what the function should do; the test checks that it does." }
    ]
  },
  challenges: [
    { id: "py-comp-lost-key",
      widget: "py-comp-demo",
      goal: "Build a dict by customer from paid orders only and run it to the end. Get a result where the dict has fewer entries than the orders it kept.",
      hint: "Paid orders include two from the same customer; watch what the second one does to the first.",
      success: "A dict keeps one value per key, so repeated keys overwrite earlier values without any warning.",
      check: function (w) {
        var t = document.getElementById("py-comp-readout").textContent;
        return document.getElementById("py-comp-kind").value === "dict" &&
          document.getElementById("py-comp-filter").value === "paid" &&
          /Step 6 of 6/.test(t) && /replaced/.test(t);
      } },
    { id: "py-bcast-per-store",
      widget: "py-bcast-demo",
      goal: "Keep A at (3, 4) and choose a B that holds one factor per store (3 values) but still broadcasts to (3, 4).",
      hint: "A plain (3,) vector lines up with the last axis, which has 4 quarters.",
      success: "A (3, 1) column lines up with the rows and stretches across the columns; that is what <code>[:, None]</code> does.",
      check: function (w) {
        return document.getElementById("py-bcast-a").value === "3,4" &&
          document.getElementById("py-bcast-b").value === "3,1" &&
          /result \(3, 4\)/.test(document.getElementById("py-bcast-readout").textContent);
      } },
    { id: "py-df-sql-translate",
      widget: "py-df-demo",
      goal: "Translate this SQL into the controls: SELECT customer, amount FROM orders WHERE status = 'paid' AND amount >= 50 ORDER BY amount DESC. You should get 3 rows and 2 columns.",
      hint: "WHERE is the status and amount filters, SELECT is the column list, ORDER BY is the sort.",
      success: "A boolean mask is WHERE, a column list is SELECT and sort_values is ORDER BY.",
      check: function (w) {
        var t = document.getElementById("py-df-readout").textContent;
        return document.getElementById("py-df-status").value === "paid" &&
          document.getElementById("py-df-cols").value === "ca" &&
          document.getElementById("py-df-sort").value === "desc" &&
          /result: 3 rows × 2 columns/.test(t);
      } },
    { id: "py-merge-eight-rows",
      widget: "py-merge-demo",
      goal: "Make the merge return 8 rows from only 5 orders.",
      hint: "You need both a fan-out from a duplicate key and a join that keeps unmatched rows on both sides.",
      success: "Duplicate keys multiply rows and outer joins add unmatched rows from both sides, so always compare row counts before and after a merge.",
      check: function (w) {
        return /^8 rows/.test(document.getElementById("py-merge-out").textContent);
      } },
    { id: "py-reshape-duplicate",
      widget: "py-reshape-demo",
      goal: "Add the second North / Feb row and still produce a valid wide table in which North / Feb is 150.",
      hint: "One of the two long-to-wide operations can't handle two values for one cell.",
      success: "pivot only rearranges and fails on duplicates; pivot_table aggregates them with aggfunc.",
      check: function (w) {
        return document.getElementById("py-reshape-dup").checked &&
          document.getElementById("py-reshape-op").value === "pivot_table" &&
          /summed to 150/.test(document.getElementById("py-reshape-readout").textContent);
      } },
    { id: "py-nb-break-then-fix",
      widget: "py-nb-demo",
      goal: "First make the notebook print a wrong revenue by running cells out of order, then get it to print the correct 120,000.",
      hint: "Rerun the VAT cell before computing the total, then use the button that clears the kernel's memory.",
      success: "The kernel remembers every cell you ran; restart and run all is the quick way to get numbers you can defend.",
      check: function (w) {
        return w.getAttribute("data-saw-wrong") === "1" &&
          /· correct/.test(document.getElementById("py-nb-readout").textContent);
      } },
    { id: "py-ref-south-two",
      widget: "py-refactor-demo",
      goal: "Leave top_n at 3 or more and make revenue_report return exactly two South customers.",
      hint: "If top_n can't cut the list, the min_total threshold has to; look at where the third customer sits.",
      success: "Parameters let one function body answer many questions; you changed the cut-off without touching the code.",
      check: function (w) {
        return document.getElementById("py-ref-region").value === "South" &&
          parseInt(document.getElementById("py-ref-top").value, 10) >= 3 &&
          /returned 2 rows/.test(document.getElementById("py-ref-readout").textContent);
      } }
  ]
};
