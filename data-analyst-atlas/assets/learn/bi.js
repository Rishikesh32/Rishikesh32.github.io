window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["bi"] = {
  quiz: {
    "dashboard-design": [
      { q: "A sales director asks for \"a dashboard with everything on it\". What should you do first?",
        choices: ["Build every chart you can, then let usage show which ones matter", "Write down who uses it, when, the decision they make and three to five questions", "Copy the layout of the most popular dashboard in the company", "Start with a detail table so nothing is left out"],
        answer: 1,
        why: "The audience, decision and questions decide which visuals belong on the page. Building everything first produces a cluttered page that nobody reads, and usage data takes weeks to arrive." },
      { q: "Where should the order detail table go on a weekly sales page?",
        choices: ["Top left, so people can check the raw data first", "In the middle, between the KPIs and the trend", "At the bottom or on a drill-through page", "Next to every chart so each one has its source"],
        answer: 2,
        why: "People read from the top left, so that spot belongs to the headline KPI. Detail is for the few who need to dig in, so it goes last or behind a drill-through." },
      { q: "Your KPI tile shows \"Revenue $412k\" with nothing else. What is the most important thing to add?",
        choices: ["A comparison such as vs target or vs last year", "A gauge chart around the number", "A different colour for each digit range", "The exact time the number was computed, to the second"],
        answer: 0,
        why: "A number alone can't tell anyone whether to act. A comparison (target, last year, last week) turns it into a signal. A gauge only uses more space for the same single number." }
    ],
    "bi-modeling": [
      { q: "In a star schema, which way do filters normally flow?",
        choices: ["From the fact table out to each dimension", "Both ways on every relationship by default", "Only between dimension tables", "From the dimension (the one side) to the fact table (the many side)"],
        answer: 3,
        why: "You slice by a dimension attribute such as region, which keeps the matching fact rows, and the measure adds them up. Two-way filtering is an exception that you should use sparingly." },
      { q: "You join orders (one row per order) to shipments (one row per parcel) and sum revenue. Finance says your total is too high. Why?",
        choices: ["Shipments are missing for some orders, so the join drops rows", "Orders shipped in several parcels appear once per parcel, so their revenue is counted several times", "Revenue should be averaged after a join, not summed", "The join changed the currency of some orders"],
        answer: 1,
        why: "This is a fan-out: joining across two grains copies each order onto every matching parcel. Keep the two facts separate and relate both to shared dimensions." },
      { q: "A product key appears twice in dim_product with two different categories. What happens when you slice revenue by category?",
        choices: ["The tool removes the duplicate automatically", "Revenue for that product shows up in both categories, so the rows add up to more than the total", "That product's revenue disappears from the visual", "Nothing changes, because categories are text"],
        answer: 1,
        why: "A duplicated key makes the relationship many-to-many. The fact rows for that product match both dimension rows, so they are counted under both categories. Check dimension keys for uniqueness before you relate them." }
    ],
    "calculations": [
      { q: "What is the main difference between a measure and a calculated column?",
        choices: ["A measure is stored per row at refresh; a calculated column is computed per visual cell", "Measures only work in Tableau; calculated columns only work in Power BI", "A calculated column is stored per row at refresh; a measure is computed for each cell in that cell's filter context", "There is no difference except the name"],
        answer: 2,
        why: "Calculated columns are row-level and stored, so they suit attributes you slice by. Measures are formulas evaluated at query time over whatever rows each cell's filters leave." },
      { q: "Two orders: $1,000 with 10% margin and $10 with 50% margin. What margin should the total row show?",
        choices: ["About 10.4%, total profit divided by total revenue", "30%, the average of the two margins", "50%, the highest margin", "60%, the sum of the two margins"],
        answer: 0,
        why: "Margin is a ratio of sums: (100 + 5) / (1,000 + 10) ≈ 10.4%. Averaging the per-row ratios lets the $10 order count as much as the $1,000 one." },
      { q: "A matrix has channels on its rows and uses <code>DIVIDE([Revenue], CALCULATE([Revenue], ALL(Sales[Region])))</code>. Every row shows 100%. Why?",
        choices: ["ALL removes every filter, so the denominator is always the grand total", "DIVIDE returns 1 when its arguments are measures", "The measure has a bug and should use SUMX", "ALL removes only the Region filter; the channel filter from the row stays in both numerator and denominator"],
        answer: 3,
        why: "ALL(Sales[Region]) clears the Region filter only. On a channel row there is no region filter to clear, so the numerator and denominator are the same channel revenue. Use ALL on the column you're putting on rows, or ALL(Sales) for a share of everything." }
    ],
    "interactivity": [
      { q: "A slicer on Region changes the \"company revenue vs target\" tile to 31%. What is the cleanest fix?",
        choices: ["Remove the region slicer from the page", "Turn off the slicer's interaction with that tile, or remove the region filter inside its measure with ALL", "Move the tile to a different page", "Divide the target by the number of regions"],
        answer: 1,
        why: "The tile is meant to be company-wide, so the region filter must not reach it. Edit interactions handles it in the visual layer; CALCULATE with ALL handles it in the measure, which works wherever the measure is used." },
      { q: "You click West in a region chart. The product chart keeps its full bars and shades West's share inside each one. Which interaction is this?",
        choices: ["Cross-highlight", "Cross-filter", "Drill-through", "Drill-down"],
        answer: 0,
        why: "Cross-highlight keeps the totals and shades the selected part, which answers \"how much of each product is West?\". Cross-filter would redraw the chart with West data only." },
      { q: "Which is the best home for an order-level table on a sales dashboard?",
        choices: ["A visual filter on the KPI tile", "A report-level filter", "A drill-through page that receives the clicked region or product", "A slicer with every order ID in it"],
        answer: 2,
        why: "Drill-through takes the clicked value as a filter and opens a detail page, so the main page stays focused and the detail is one click away." }
    ],
    "bi-performance": [
      { q: "Your warehouse loads new data once a night at 05:30. A colleague wants DirectQuery so the dashboard is \"real-time\". What do you tell them?",
        choices: ["DirectQuery will show new orders the moment they happen", "Import mode can't refresh more than once a week", "DirectQuery is always faster than Import", "The data can't be fresher than the warehouse, so an Import refreshed at about 06:00 gives the same freshness with faster pages"],
        answer: 3,
        why: "DirectQuery is only as fresh as its source. If the source changes once a night, a scheduled Import after that load is just as fresh and much faster for viewers." },
      { q: "An Import dataset refreshes at 06:00 and 14:00, and each refresh takes 30 minutes. What is the worst-case data age?",
        choices: ["8.5 hours", "12 hours", "16.5 hours", "24 hours"],
        answer: 2,
        why: "The longest gap is from 14:00 to 06:00 the next day, 16 hours, plus 30 minutes of refresh time. Spacing refreshes evenly matters more than adding more of them." },
      { q: "A full refresh of a 200-million-row table takes 80 minutes, and you need hourly refreshes. What helps most?",
        choices: ["Incremental refresh, so each run reloads only recent partitions", "Adding more visuals so the work is spread out", "Switching every measure to a calculated column", "Refreshing at the top of every hour instead of every 60 minutes"],
        answer: 0,
        why: "Incremental refresh reloads only the recent partitions that can change, so a run takes minutes instead of re-reading 200 million rows. A full refresh longer than the interval can never keep up." }
    ],
    "adoption": [
      { q: "Most people open your new dashboard once and never return. Which stage of the funnel is weak, and what usually fixes it?",
        choices: ["Awareness; send another company-wide launch email", "The week-2 return; make the numbers trusted and fit the page into an existing routine", "Load time; it never affects return visits", "Chart count; add more charts so everyone finds theirs"],
        answer: 1,
        why: "The first visit is easy to win. Returning depends on trust (numbers match finance) and habit (a weekly meeting or a scheduled email). More charts usually make it worse." },
      { q: "You launched a new revenue dashboard, but the old Excel report still goes out every Monday. What is the likely result?",
        choices: ["Both get used equally and agree with each other", "The dashboard wins automatically because it's newer", "Nobody notices, since they show the same thing", "People keep using the familiar report, and two versions of revenue compete"],
        answer: 3,
        why: "Old habits win if the old report stays alive, and any difference between the two erodes trust in both. Retiring it, with notice, is part of the launch." },
      { q: "Which metric best tells you whether a weekly dashboard is working?",
        choices: ["Weekly active viewers and the share who return in week 2", "Total page views since launch", "Number of charts on the page", "How many people received the launch email"],
        answer: 0,
        why: "Weekly active viewers and week-2 return measure ongoing use. Total views since launch are dominated by one-time curiosity after the announcement." }
    ]
  },
  challenges: [
    { id: "dd-two-swaps",
      widget: "dd-demo",
      goal: "Reach a hierarchy score of 100 using no more than 2 swaps.",
      hint: "Look at which tiles sit in slot 1 and slot 6, and in slot 2 and slot 5. Reset if you run out of swaps.",
      success: "Headline KPIs first, then trend, breakdown and detail: the layout now follows the order people read and ask.",
      check: function (w) {
        var t = document.getElementById("dd-readout").textContent;
        var s = t.match(/hierarchy score (\d+)\/100/), n = t.match(/swaps (\d+)/);
        return !!(s && n && +s[1] === 100 && +n[1] <= 2);
      } },
    { id: "star-adds-up",
      widget: "star-demo",
      goal: "Slice revenue by product category so the category rows add up exactly to the fact total of 880.",
      hint: "Two things are wrong with dim_product: it isn't related, and one key appears twice.",
      success: "A related dimension with a unique key gives a one-to-many star, so every fact row lands in exactly one category.",
      check: function (w) {
        var t = document.getElementById("star-readout").textContent;
        return /slice category/.test(t) && /· rows add up$/.test(t);
      } },
    { id: "calc-all-100",
      widget: "calc-demo",
      goal: "Find a setting where the \"% of all regions\" measure shows 100% on every row of the visual.",
      hint: "ALL(Region) removes only the Region filter. What if the rows aren't regions?",
      success: "ALL clears only the column you name; any other filter, such as the channel on the row, still applies to the denominator.",
      check: function (w) {
        return /every row shows 100%/.test(document.getElementById("calc-readout").textContent);
      } },
    { id: "filt-south-posters",
      widget: "filt-demo",
      goal: "Make the KPI show South's poster revenue while the target tile keeps showing the whole company against target.",
      hint: "Use the slicer and a bar click for the KPI, then cut the edges that reach the target tile.",
      success: "Interactions are just filter edges; a company-wide tile must not receive the region or product filter.",
      check: function (w) {
        var t = document.getElementById("filt-readout").textContent;
        return /KPI \$50k/.test(t) && /target tile \$300k/.test(t);
      } },
    { id: "perf-fresh-fast",
      widget: "perf-demo",
      goal: "Keep the 200M-row table (or larger) and get a page load under 3 s with data never older than 2 hours.",
      hint: "In Import mode a full reload is too slow to repeat often. In DirectQuery, count how many query rounds a page needs.",
      success: "Freshness and speed come from different levers: incremental refresh in Import, or fewer visuals per page in DirectQuery.",
      check: function (w) {
        var t = document.getElementById("perf-readout").textContent;
        var l = t.match(/load ([\d.]+) s/), a = t.match(/max data age ([\d.]+) h/), r = t.match(/rows (\d+)M/);
        return !!(l && a && r && parseFloat(l[1]) < 3 && parseFloat(a[1]) <= 2 && +r[1] >= 200);
      } },
    { id: "adopt-three-changes",
      widget: "adopt-demo",
      goal: "Reach at least 35 weekly active users out of 120 using no more than 3 changes.",
      hint: "Find the weakest stage first, and remember that a change only helps the stages it touches.",
      success: "Adoption needs all three: people must find it (meeting), return to it (habit) and believe it (trust).",
      check: function (w) {
        var t = document.getElementById("adopt-readout").textContent;
        var a = t.match(/weekly active (\d+)/), u = t.match(/changes used (\d+)/);
        return !!(a && u && +a[1] >= 35 && +u[1] <= 3);
      } }
  ]
};
