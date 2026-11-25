window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["spreadsheets"] = {
  quiz: {
    "formulas": [
      { q: "You copy <code>=$A2*B$1</code> from B2 to D5. What does the copy say?",
        choices: ["<code>=$A2*B$1</code>, because nothing moves", "<code>=$A5*D$1</code>", "<code>=$C5*D$4</code>", "<code>=A5*D1</code>"],
        answer: 1,
        why: "The dollar before A pins the column and the dollar before 1 pins the row. The row of the first reference moves from 2 to 5 and the column of the second moves from B to D." },
      { q: "Row 2 computes tax as <code>=C2*F1</code>. After filling down, row 3 shows 0 tax. What happened?",
        choices: ["F1 holds text, so the product is zero", "The fill skipped row 3 because it was hidden", "Tax rates must be stored as percentages", "The copy became <code>=C3*F2</code>, and F2 is empty"],
        answer: 3,
        why: "A relative reference moves with the copy, so the rate reference drifted to the empty F2. Lock it as <code>$F$1</code> so every row points at the same rate cell." },
      { q: "A column of totals suddenly shows <code>#REF!</code>. What is the most likely cause?",
        choices: ["A row or column the formulas pointed at was deleted", "One input cell contains text like \"1,200 \"", "A lookup could not find its key", "A divisor cell is blank"],
        answer: 0,
        why: "<code>#REF!</code> means the referenced cell no longer exists. Text in arithmetic gives <code>#VALUE!</code>, a failed lookup gives <code>#N/A</code> and a blank divisor gives <code>#DIV/0!</code>." }
    ],
    "lookups": [
      { q: "What does every lookup do, whichever function you use?",
        choices: ["Sorts the lookup table, then reads the nearest row", "Finds the position of the value in one column, then returns the item at that position from another", "Copies the whole matching row into the current sheet", "Counts how many times the value appears"],
        answer: 1,
        why: "XLOOKUP does both halves in one call; INDEX/MATCH splits them: MATCH finds the position and INDEX returns the item at that position." },
      { q: "A colleague inserts a Supplier column into the products table. Which lookup now returns the wrong field with no error?",
        choices: ["<code>XLOOKUP(A2, P:P, S:S)</code>", "<code>INDEX(S:S, MATCH(A2, P:P, 0))</code>", "<code>VLOOKUP(A2, P:T, 4, FALSE)</code>", "All three keep working"],
        answer: 2,
        why: "VLOOKUP's column number is typed, so after the insert column 4 is a different field. XLOOKUP and INDEX/MATCH reference the return column itself, which moves with the insert." },
      { q: "Your lookup for <code>P-103</code> returns <code>#N/A</code>, but you can see P-103 in the products tab. What should you check first?",
        choices: ["Whether the key has a stray space or is stored as a different type", "Whether the letter case matches exactly", "Whether the products tab is sorted", "Whether the sheet needs recalculating"],
        answer: 0,
        why: "Lookups ignore case but never ignore spaces or the difference between text and numbers. Wrapping the key in <code>TRIM()</code> or fixing the type usually solves it." }
    ],
    "pivots": [
      { q: "Which SQL matches a pivot with Region in Rows, Month in Columns and Sum of Revenue in Values?",
        choices: ["<code>SELECT region, month, revenue FROM orders ORDER BY region</code>", "<code>SELECT region, SUM(revenue) FROM orders GROUP BY region</code>", "<code>SELECT DISTINCT region, month FROM orders</code>", "<code>SELECT region, month, SUM(revenue) FROM orders GROUP BY region, month</code>"],
        answer: 3,
        why: "A pivot is a GROUP BY over the Rows and Columns fields with one aggregate per cell. Columns only changes how the second grouping is laid out." },
      { q: "You want \"how many customers bought in March\". Which Values setting answers it?",
        choices: ["Sum of Customer ID", "Count of Customer ID", "Distinct count of Customer ID", "Average of Revenue"],
        answer: 2,
        why: "Count counts rows, so a customer with three orders counts three times. A distinct count (via the Data Model in Excel) counts each customer once." },
      { q: "You paste 300 new orders into the source tab, but the pivot totals don't change. Why?",
        choices: ["Pivots only read the first 1,000 rows", "Pivots don't update on their own, and a fixed range may also miss new rows", "New rows need to be sorted before a pivot sees them", "Pivots ignore rows added after creation"],
        answer: 1,
        why: "You must refresh the pivot, and its source should be a Table so the range grows with new rows. Otherwise you present stale numbers." }
    ],
    "cleaning-sheets": [
      { q: "A pivot shows both \"North\" and \"North \" as separate regions. What fixes it at the source?",
        choices: ["<code>TRIM</code> on the region column before pivoting", "<code>PROPER</code> on the region column", "Sorting the region column A to Z", "Changing the pivot's aggregation to Count"],
        answer: 0,
        why: "The trailing space makes the two values different to a pivot. TRIM removes leading, trailing and doubled spaces, so both rows collapse into one group." },
      { q: "Why must you trim and fix case before running Remove Duplicates?",
        choices: ["Remove Duplicates refuses to run on untrimmed text", "Trimming is faster on fewer rows", "Otherwise near-duplicates like \"jane smith\" and \"Jane Smith \" survive as two customers", "Remove Duplicates changes the case of the text"],
        answer: 2,
        why: "Remove Duplicates compares exact values. Clean the text first so the copies become identical and are removed." },
      { q: "An amount column shows \"$1,200\" and <code>SUM</code> of the column returns 0. What is going on?",
        choices: ["The column is formatted as currency, which SUM skips", "The values are text, which SUM ignores, so strip the symbols and convert with VALUE", "SUM needs the range to include the header", "The numbers are too large for the cell width"],
        answer: 1,
        why: "Numbers stored as text are skipped by SUM. <code>VALUE(SUBSTITUTE(SUBSTITUTE(B2,\"$\",\"\"),\",\",\"\"))</code> turns them back into numbers." }
    ],
    "charts-sheets": [
      { q: "Which chart best answers \"how did monthly revenue change from January to June?\"",
        choices: ["Pie chart of the six months", "Line chart with months on the x-axis", "Scatter of revenue against month number", "Stacked bar of the total"],
        answer: 1,
        why: "Change over ordered time reads best as a line running left to right. A pie throws away the order, which is the whole question." },
      { q: "You insert a chart and the months appear in the legend while the channels sit on the x-axis. What do you do?",
        choices: ["Re-type the table with months as the header row", "Change the chart type to a pie", "Use Switch Row/Column", "Delete the legend"],
        answer: 2,
        why: "By default the first column becomes categories and the header row becomes series. Switch Row/Column swaps them without retyping anything." },
      { q: "A column chart shows web at $305k and store at $295k, but the bars look three times different. What is the likely problem?",
        choices: ["The y-axis does not start at zero", "The chart uses two colours", "The categories are sorted by size", "The chart title states the finding"],
        answer: 0,
        why: "Bar length encodes the value, so a truncated axis exaggerates small differences. Bars should start at zero." }
    ],
    "what-if": [
      { q: "In a well-built model, where does the 40-units-per-dollar demand assumption belong?",
        choices: ["Typed inside the units formula, so it can't be changed by accident", "In a comment on the profit cell", "In its own labelled input cell that formulas reference", "On a separate workbook"],
        answer: 2,
        why: "Inputs live in their own coloured cells and calculations only reference them. A number hidden inside a formula is invisible and hard to change." },
      { q: "You want to see profit at $20, $25, $30, $35, $40 and $45 at the same time. Which tool fits?",
        choices: ["Goal Seek", "A one-variable data table", "Remove Duplicates", "A pivot table"],
        answer: 1,
        why: "A data table recalculates the model for a column of input values and shows every result at once. Goal Seek answers the reverse question for one target." },
      { q: "Goal Seek says a price of $27.68 earns $6,000. Why should you still look at the profit curve?",
        choices: ["Goal Seek rounds to the nearest dollar", "Goal Seek always returns the highest price", "Goal Seek ignores fixed costs", "Profit rises then falls, so a second price also hits $6,000 and Goal Seek returns only the one near its start"],
        answer: 3,
        why: "On a hump-shaped curve two prices reach the same profit. Goal Seek stops at the one nearest the starting value, so check the other side of the peak." }
    ]
  },
  challenges: [
    { id: "sheets-mixed-refs",
      widget: "formulas-demo",
      goal: "Place dollar signs so that one formula, filled across the whole grid, gives all 12 cells the right units × price.",
      hint: "Units always come from column A and prices always come from row 1. Lock only that part of each reference.",
      success: "Mixed references: <code>=$A2*B$1</code> pins the column of the units and the row of the prices.",
      check: function (w) { return w.dataset.correct === "12"; } },
    { id: "sheets-lookup-survives",
      widget: "lookups-demo",
      goal: "Insert the Supplier column, then pick a function that still returns the correct Price.",
      hint: "Which functions point at the return column itself instead of a typed column number?",
      success: "XLOOKUP and INDEX/MATCH move with inserted columns; VLOOKUP's typed column number does not.",
      check: function (w) {
        return document.getElementById("lookups-insert").checked && document.getElementById("lookups-field").value === "price" && w.dataset.ok === "1";
      } },
    { id: "sheets-pivot-south",
      widget: "pivots-demo",
      goal: "Build a grid of revenue by category and month for the South region only.",
      hint: "Use Rows and Columns for the two groupings, and the filter to remove the other regions before grouping.",
      success: "Filter, two groupings and a sum: that is <code>WHERE</code> plus <code>GROUP BY category, month</code>.",
      check: function (w) {
        var p = (w.dataset.layout || "").split("|");
        var two = (p[0] === "category" && p[1] === "month") || (p[0] === "month" && p[1] === "category");
        return two && p[2] === "sumrev" && p[3] === "South";
      } },
    { id: "sheets-clean-cities",
      widget: "cleaning-sheets-demo",
      goal: "Get the distinct city count down to exactly 3 while keeping all 6 rows. Which steps actually fix city names?",
      hint: "Removing duplicates is not allowed here. Look at what makes \" london\" differ from \"London\".",
      success: "Split, TRIM and PROPER together turn five spellings into three real cities.",
      check: function (w) { return w.dataset.cities === "3" && w.dataset.rows === "6"; } },
    { id: "sheets-chart-match",
      widget: "charts-sheets-demo",
      goal: "Find the best-fit chart for all four business questions.",
      hint: "Time, comparison, share of a whole and relationship each have one chart that answers them best.",
      success: "Line for trends, bars for comparisons, pie for a 2–3 part share and scatter for relationships.",
      check: function (w) { return w.dataset.matched === "4"; } },
    { id: "sheets-breakeven",
      widget: "what-if-demo",
      goal: "Fixed costs rise to $12,000. Use Goal Seek to find a break-even price (profit = 0).",
      hint: "Set the fixed cost slider first, keep the goal at 0, then Goal Seek. Try a different starting price to find the other answer.",
      success: "Break-even sits near $23.19 or $38.81: two prices work because profit rises and then falls.",
      check: function (w) {
        var s = (w.dataset.seek || "").split(":"), p = parseFloat(s[1]);
        return s[0] === "0" && document.getElementById("whatif-fixed").value === "12000" && ((p > 22.9 && p < 23.5) || (p > 38.5 && p < 39.1));
      } }
  ]
};
