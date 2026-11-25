window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["eda"] = {
  quiz: {
    "questions": [
      { q: "A manager asks \"How are sales doing?\". Which rewrite gives you a question you can actually answer with data?",
        choices: ["How are sales doing compared with how they should be doing?", "Which products do customers love most right now?", "What was net revenue from first-time customers in the last 4 weeks vs the prior 4 weeks?", "Are sales trending in the right direction lately?"],
        answer: 2,
        why: "It names a metric, a population, a bounded window and a baseline. The other versions still leave the metric, the window or the comparison open to interpretation." },
      { q: "Revenue fell 12%. You split it into orders × average order value and find orders fell 8% while AOV fell 4%. What should you do next?",
        choices: ["Split orders further, for example into sessions × conversion, and check which factor moved", "Report that both factors fell and close the ticket", "Rebuild the dashboard with a different chart type", "Recompute AOV with the mean instead of the median"],
        answer: 0,
        why: "A metric tree is useful because you keep splitting the factor that moved until you reach something specific enough to explain, like mobile conversion. Stopping at the first split leaves the \"why\" unanswered." },
      { q: "A stakeholder asks you to \"show that the new loyalty program increased spend\". What is the main problem with this request?",
        choices: ["Loyalty programs cannot be measured with order data", "It assumes the answer, which invites you to keep slicing until the data agrees", "It names a metric, which is too specific for early exploration", "It should be phrased as a SQL query instead"],
        answer: 1,
        why: "A leading question pushes you toward confirming a belief. Restate it neutrally (\"Did spend per member change vs a comparable group?\") so either answer is possible." }
    ],
    "univariate": [
      { q: "Order values have a median of $41 and a mean of $58. What does that tell you about the distribution?",
        choices: ["It is left-skewed, with many tiny orders", "It is symmetric, and the gap is sampling noise", "There must be data-entry errors in the column", "It is right-skewed: a long tail of large orders pulls the mean up"],
        answer: 3,
        why: "The mean is sensitive to extreme values and the median is not. A mean well above the median is the signature of a right tail, which is normal for money data." },
      { q: "You make a histogram of order values with very wide bins and see one smooth hump. What should you try before concluding the data has no special features?",
        choices: ["Switch to a pie chart", "Try several narrower bin widths to see if spikes or a second hump appear", "Remove everything above the 90th percentile", "Report the mean and standard deviation instead"],
        answer: 1,
        why: "Wide bins can swallow real features such as a spike at a free-shipping threshold. Trying several bin widths is the standard way to make sure the shape you see is not an artefact of binning." },
      { q: "A box plot flags 40 orders above the 1.5 × IQR fence. What is the right next step?",
        choices: ["Look at those rows to see whether they are real big orders, bulk buyers or errors", "Delete them, since they are outliers by definition", "Replace them with the median", "Ignore them, because box plots exaggerate outliers"],
        answer: 0,
        why: "The fence is a rule of thumb for what to inspect, not a verdict. In right-skewed money data many points beyond it are genuine customers, and deleting them biases revenue down." }
    ],
    "bivariate": [
      { q: "Which chart fits \"order value by device (mobile, desktop, tablet)\" best?",
        choices: ["A scatter plot", "A line chart over time", "Side-by-side box plots, one per device", "A pie chart of total order value"],
        answer: 2,
        why: "That pair is a category with a number. Box plots per group show the median, spread and outliers of each device at once, which a single total or a scatter cannot." },
      { q: "Sessions and spend show Pearson r = 0.67 but Spearman ρ = 0.19. What is the most likely explanation?",
        choices: ["The relationship is a perfect straight line", "One or a few extreme points are driving Pearson's r", "Spearman is broken when there are ties", "The data must contain missing values"],
        answer: 1,
        why: "Spearman works on ranks, so one huge customer counts like any other top-ranked point. When Pearson is much larger, a few extreme values are usually creating the linear fit." },
      { q: "A scatter of delivery days against satisfaction shows a clear U shape, yet r ≈ 0. What should you conclude?",
        choices: ["There is a strong relationship that is not a straight line, so r misses it", "There is no relationship between the two columns", "The scatter plot must be wrong because r is right", "You need more data before r can detect anything"],
        answer: 0,
        why: "Pearson's r only measures straight-line fit. A curve can be strong and still have r near zero, which is why you plot before you quote a coefficient." }
    ],
    "segmentation": [
      { q: "A new checkout B beats A on mobile and on desktop, yet B's overall conversion is lower. How can that be?",
        choices: ["The test must have a bug, because this is impossible", "B has fewer visitors in total", "Desktop conversion is too noisy to trust", "B received a larger share of mobile traffic, which converts lower for everyone"],
        answer: 3,
        why: "This is Simpson's paradox. The aggregate mixes segments in different proportions, so a group with more low-converting traffic can lose overall while winning in every segment." },
      { q: "You compare January's cohort (5 months old) with April's cohort (2 months old) by total repeat purchases so far. What is wrong?",
        choices: ["Nothing, as long as both cohorts have similar sizes", "January has had more time to repeat, so compare at the same months since signup", "Cohorts should be grouped by last order date, not signup date", "Repeat purchases cannot be compared across months"],
        answer: 1,
        why: "Older cohorts have had more time to buy again. A cohort triangle lines them up by age, so you compare down a column, for example month-1 retention for both." },
      { q: "Your segment table shows the \"TikTok, tablet, Alaska\" segment converts at 19% vs 3% overall. What should you check first?",
        choices: ["Whether marketing should move the whole budget there", "Whether the conversion formula has a bug", "How many visitors and orders that segment has", "Whether the segment's colour stands out on the chart"],
        answer: 2,
        why: "Tiny segments produce extreme rates by chance. Keep each segment's size next to its rate, and be wary when you have sliced many ways until something looked dramatic." }
    ],
    "time-patterns": [
      { q: "Why does a 7-day rolling average remove the weekly sales pattern but a 5-day average does not?",
        choices: ["A 7-day window always contains exactly one of each weekday, so the cycle averages out", "A 7-day window is longer, and longer windows remove all patterns", "Five-day windows skip weekends", "Rolling averages only work on weekly data"],
        answer: 0,
        why: "Any window that is a multiple of the cycle length contains every phase equally often. A 5-day window sometimes includes two weekend days and sometimes none, so some zig-zag survives." },
      { q: "September revenue is 4% below August. Demand might be unchanged. What should you check first?",
        choices: ["Whether the dashboard's colour scheme changed", "Whether the September promo was cancelled", "Whether sessions went up", "The number of days and weekend days in each month"],
        answer: 3,
        why: "September 2026 has one fewer day and two fewer weekend days than August. With weekends selling more, that alone can explain a few percent. Compare per day or weekday-adjusted." },
      { q: "For a year-over-year comparison of daily sales, why do analysts often compare with 364 days ago instead of 365?",
        choices: ["364 is divisible by 4, which avoids leap-year errors", "364 days is exactly 52 weeks, so you compare the same weekday", "Most databases cannot subtract 365 days", "It removes the yearly trend automatically"],
        answer: 1,
        why: "365 days back lands on a different weekday, so a Saturday is compared with a Friday. 364 days keeps weekdays aligned, which matters when weekends sell differently." }
    ],
    "eda-workflow": [
      { q: "You open a new orders table. Which check should come before comparing revenue by channel?",
        choices: ["Making the final chart look good", "Fitting a regression of revenue on channel", "Confirming the grain: that one row is one order and order_id has no duplicates", "Computing year-over-year growth"],
        answer: 2,
        why: "If retries or joins duplicated rows, every segment total is inflated, and unevenly so. Grain and duplicate checks are a gate before any comparison." },
      { q: "What belongs in a findings-log entry?",
        choices: ["The finding, the evidence behind it, your confidence and the next step", "Only the charts you produced", "Every query you ran, in order", "The stakeholder's original wording, unchanged"],
        answer: 0,
        why: "Evidence and confidence make a finding checkable, and a next step makes it actionable. A pile of charts or queries is raw material, not findings." },
      { q: "An automated profiling report flags no issues. Why are you not done with the quality gate?",
        choices: ["Profilers only work on numeric columns", "Profiling reports are always wrong about nulls", "You still need to compute the mean of every column by hand", "The tool does not know your intended grain or question, so it cannot tell you that duplicates or a wrong filter matter"],
        answer: 3,
        why: "A profiler summarizes columns, but whether 900 repeated order_ids are a problem depends on what one row should mean. That judgment stays with you." }
    ]
  },
  challenges: [
    { id: "eda-sharp-question",
      widget: "questions-demo",
      goal: "Turn \"How are sales doing?\" into a question that scores 5/5: every part specific, measurable and neutral.",
      hint: "Watch for traps: things you do not have data for, words with no definition, and a goal that assumes the answer.",
      success: "A sharp question names a metric, a population, a window, a baseline and a decision, and leaves the answer open.",
      check: function (w) { return w.getAttribute("data-score") === "5"; } },
    { id: "eda-bin-bump",
      widget: "univariate-demo",
      goal: "Find a bin width of at least $10 that still shows the $50 to $55 free-shipping bump as its own peak.",
      hint: "Very wide bins merge the bump with the big bars around $30 to $45. Narrow down until the bar containing $52 stands above both neighbours.",
      success: "Bin width decides what a histogram can show, so you always try more than one.",
      check: function (w) {
        var bw = parseInt(document.getElementById("univariate-bw").value, 10);
        return bw >= 10 && w.getAttribute("data-peak") === "1";
      } },
    { id: "eda-whale-r",
      widget: "bivariate-demo",
      goal: "With a weak true link (strength 0.2 or less), make the headline Pearson r read above 0.5.",
      hint: "One point far from both means can contribute more to r than all the others together.",
      success: "A single extreme customer can manufacture a strong Pearson r; Spearman's rank-based ρ is not fooled.",
      check: function (w) {
        var s = parseFloat(document.getElementById("bivariate-strength").value);
        return s <= 0.2 && document.getElementById("bivariate-whale").checked &&
          document.getElementById("bivariate-method").value === "pearson" && parseFloat(w.getAttribute("data-pearson")) > 0.5;
      } },
    { id: "eda-simpson-flip",
      widget: "segmentation-demo",
      goal: "Make checkout B lose overall while it still wins on both devices, and show the split that proves it.",
      hint: "Mobile converts lower for everyone. What happens to B's overall rate if most of its visitors are on mobile?",
      success: "That is Simpson's paradox: a shift in segment mix flipped the aggregate, so compare within segments.",
      check: function (w) { return w.getAttribute("data-flip") === "1" && document.getElementById("segmentation-split").checked; } },
    { id: "eda-weekly-cancel",
      widget: "time-patterns-demo",
      goal: "With the day-of-week pattern and holiday season both on, pick a rolling window that leaves less than 0.5% weekday swing.",
      hint: "Some window lengths contain every weekday the same number of times. Which ones?",
      success: "Windows that are multiples of 7 days cancel the weekly cycle exactly, at the cost of more lag.",
      check: function (w) {
        return document.getElementById("time-patterns-dow").checked && document.getElementById("time-patterns-season").checked &&
          parseFloat(w.getAttribute("data-swing")) < 0.5;
      } },
    { id: "eda-clean-run",
      widget: "eda-workflow-demo",
      goal: "Fill the findings log with all 6 findings and zero warnings.",
      hint: "Some checks depend on others. Which two checks must pass before any number can be trusted?",
      success: "Grain and data-quality checks come first, so every later finding rests on data you have verified.",
      check: function (w) { return w.getAttribute("data-found") === "6" && w.getAttribute("data-warn") === "0"; } }
  ]
};
