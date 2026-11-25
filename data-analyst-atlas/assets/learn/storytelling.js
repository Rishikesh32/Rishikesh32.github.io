window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["storytelling"] = {
  quiz: {
    "framing": [
      { q: "A manager asks you to \"look into churn\". What is the most useful first question to ask back?",
        choices: ["Which tables should I use?", "What will you do differently depending on the answer?", "Do you want a dashboard or a slide deck?", "How far back should the data go?"],
        answer: 1,
        why: "The decision drives everything else: the metric, the precision you need and the deadline. Tables, format and date range are details you can settle once you know what the answer is for." },
      { q: "The decision is whether to change the first-box promo. Which metric fits it best?",
        choices: ["Total monthly churn rate for all customers", "Predicted churn risk for each active customer", "Number of support tickets about cancellations", "Month-2 churn of promo signups compared with full-price signups"],
        answer: 3,
        why: "Only the promo versus full-price comparison can move the promo decision. Total churn mixes every cause together, and a per-customer risk score fits a different decision (who gets a retention call)." },
      { q: "Why should you agree the threshold (\"act if promo churn is over 1.5× full price\") before you run the analysis?",
        choices: ["So the query runs faster", "So nobody reinterprets the result afterwards to fit what they already believed", "Because thresholds are required for statistical significance", "So the stakeholder doesn't need to read the findings"],
        answer: 1,
        why: "A threshold set in advance turns the result into a decision rule. Set after the fact, the same number can be read as \"big\" or \"small\" depending on who wants what." }
    ],
    "exec-summary": [
      { q: "What does BLUF mean for an executive summary?",
        choices: ["Put the recommendation in the first sentence", "Bold the key numbers so they stand out", "Keep the summary under one page", "List findings in the order you found them"],
        answer: 0,
        why: "Bottom line up front: the answer comes first, then the evidence. Formatting and length help, but they don't fix a summary that buries the answer." },
      { q: "Your summary opens with \"We analysed 18 months of subscription data using cohort tables…\". What is the best fix?",
        choices: ["Shorten the method sentence to save words", "Add more detail so the method is convincing", "Move the method to the end and open with the recommendation", "Replace it with a chart"],
        answer: 2,
        why: "Method serves the people who check your work, so it goes last or in an appendix. Deciders need the recommendation first, because many stop reading after a sentence or two." },
      { q: "In the pyramid principle, what sits directly under the main point?",
        choices: ["The raw data tables", "A list of open questions", "The methodology section", "A few supporting arguments, each backed by evidence below it"],
        answer: 3,
        why: "The pyramid goes answer, then supporting arguments, then evidence. A reader can stop at any level and still leave with the right conclusion." }
    ],
    "presenting": [
      { q: "Which slide title is a takeaway title rather than a topic title?",
        choices: ["Churn by acquisition offer", "Q3 churn analysis", "Promo signups churn 2.3× faster than full-price signups", "Month-2 churn: an overview"],
        answer: 2,
        why: "A takeaway title is a full sentence with a claim and a number. The other three only say what the chart is about, so each viewer draws their own conclusion." },
      { q: "Your chart supports the claim that the 60%-off promo drives churn. How should you colour it?",
        choices: ["A different bright colour for each offer", "A red-to-green gradient by churn level", "All bars in the brand colour for consistency", "The promo bar in an accent colour and the others in grey"],
        answer: 3,
        why: "Colour the evidence and grey out the context. One accent colour points every eye at the bar the title talks about." },
      { q: "You have 3 minutes and 40 slides. What is the best plan?",
        choices: ["Present about three slides planned backwards from the ask, and keep the rest as an appendix", "Pick the 10 most interesting charts", "Show all 40 slides quickly so nothing is missed", "Skip slides and talk through the doc"],
        answer: 0,
        why: "A decision talk needs context, one insight, the recommendation and the ask. The appendix answers detailed questions without making everyone sit through them." }
    ],
    "analysis-docs": [
      { q: "Where should the limitations of your analysis go in the doc?",
        choices: ["In the main body, because they change how much to trust the result", "In the appendix, so they don't distract", "Nowhere; stakeholders lose confidence if they see them", "Only in the SQL comments"],
        answer: 0,
        why: "Limitations affect how much weight the reader should give the conclusion, so the decider needs to see them. Hiding them in an appendix nobody opens is a common mistake." },
      { q: "A reviewer can't reproduce your \"14% vs 6%\" churn figure. What would have prevented this?",
        choices: ["A bigger chart", "Rounding to whole numbers", "Linking the number to a saved query, a data pull date and a written churn definition", "Adding more exploratory charts to the appendix"],
        answer: 2,
        why: "Traceability means every number leads back to a query, the data it ran on and the definition it used. Without that chain, the only way to check a number is to ask you." },
      { q: "You made 20 exploratory charts while working. What should happen to them in the doc?",
        choices: ["Put all 20 in the findings so the effort is visible", "Put them at the top as context", "Delete them and never mention them", "Keep only those that support a finding in the body; the rest go to the appendix or are dropped"],
        answer: 3,
        why: "Exploratory charts are part of the work, not the story. The body holds one chart per finding; the rest can live in an appendix for reviewers." }
    ],
    "stakeholders": [
      { q: "The CFO must approve discount changes but rarely reads analytics. Which quadrant and approach fit?",
        choices: ["Manage closely: weekly working sessions", "Keep satisfied: short, conclusion-first updates", "Keep informed: regular detailed reports", "Monitor: send the final doc only"],
        answer: 1,
        why: "High influence and low interest means keep satisfied. Give the CFO the conclusion and the impact in a few sentences, not a 20-page doc." },
      { q: "What is \"pre-wiring\" a decision meeting?",
        choices: ["Testing the projector before the meeting", "Sending the deck to everyone an hour early", "Asking the VP to approve the recommendation in advance", "Walking key stakeholders through the finding one-to-one before the group meeting"],
        answer: 3,
        why: "One-to-one previews surface objections privately, so you can address them in the deck. Nobody hears the key number for the first time in the meeting." },
      { q: "Your analysis shows the campaign manager's promo is the main cause of churn. When should she hear it?",
        choices: ["Early and privately, with an invitation to help design the fix", "In the decision meeting, with everyone else", "After the decision, in the follow-up email", "Never; tell only her manager"],
        answer: 0,
        why: "People whose work looks bad should hear it from you early and in private. It avoids a public defensive reaction and often improves the fix, since she knows the promo best." }
    ],
    "recommendations": [
      { q: "Option A's impact range is +$20k to +$60k a month. Option B's is −$30k to +$80k, with a higher midpoint. What does the comparison show?",
        choices: ["B is better because its best case is higher", "A is the safer bet because its whole range is positive; B could lose money", "They are equivalent because the midpoints are similar", "Neither can be recommended without a point estimate"],
        answer: 1,
        why: "A range that crosses zero is a gamble. A is positive across its whole range, so it is the safer recommendation even though B's best case is bigger." },
      { q: "Confidence is medium and the change would be announced publicly and is hard to reverse. What is the best recommendation?",
        choices: ["Do it now", "Roll out to everyone and monitor", "Test first, then decide", "Drop the idea"],
        answer: 2,
        why: "Hard-to-reverse decisions need more confidence than reversible ones. With medium confidence, a test raises confidence before you commit." },
      { q: "Which ending makes a recommendation actionable?",
        choices: ["\"Let me know your thoughts.\"", "\"More analysis may be needed.\"", "\"The data speaks for itself.\"", "\"Please approve a 4-week test by 20 Oct; the campaign manager launches it and we read out on 19 Nov.\""],
        answer: 3,
        why: "An actionable next step names the action, an owner and a date. The others leave the reader to work out what happens next, so usually nothing does." }
    ]
  },
  challenges: [
    { id: "framing-support-5",
      widget: "framing-demo",
      goal: "Frame the support-dashboard request fully: reach a framing score of 5/5.",
      hint: "Pick a real decision first, then make sure the metric and threshold match that same decision.",
      success: "A dashboard request becomes useful once it names the decision, the metric and threshold that serve it, an owner and a deadline.",
      check: function (w) {
        var r = document.getElementById("framing-req");
        var t = document.getElementById("framing-readout").textContent;
        return !!(r && r.value === "2" && /framing score 5\/5/.test(t));
      } },
    { id: "exec-bluf-5",
      widget: "exec-demo",
      goal: "Reorder the summary until it scores 5/5 and every reader sees the recommendation.",
      hint: "Recommendation first, its evidence right after, impact before risk, and the method at the very end.",
      success: "BLUF order puts the answer where 100% of readers see it and pushes method to the end for the checkers.",
      check: function (w) {
        return /order score 5\/5/.test(document.getElementById("exec-readout").textContent);
      } },
    { id: "present-takeaway-5",
      widget: "present-demo",
      goal: "Write your own slide title that passes all five checks (5/5).",
      hint: "Name the promo segment, give a number, and compare it with something using a verb, all in 6 to 15 words.",
      success: "A takeaway title states the claim, the number and the comparison, so the chart becomes evidence for one sentence.",
      check: function (w) {
        return /title score 5\/5/.test(document.getElementById("present-readout").textContent);
      } },
    { id: "docs-clean-8",
      widget: "docs-demo",
      goal: "Fix the outline so it has 0 issues and the main doc reads in 8 minutes or less.",
      hint: "Some sections are fine in the body or the appendix, but only one of those choices keeps the main doc short.",
      success: "Layer by reader: summary and question on top, findings and limitations in the body, method and queries in the appendix.",
      check: function (w) {
        var t = document.getElementById("docs-readout").textContent;
        var m = t.match(/main doc ([\d.]+) min/);
        return !!(/issues 0/.test(t) && m && parseFloat(m[1]) <= 8);
      } },
    { id: "stake-map-5",
      widget: "stake-demo",
      goal: "Read each profile and place all five stakeholders in the right quadrant (5/5).",
      hint: "Ask two questions per person: can they change the decision, and do they care about the outcome?",
      success: "Influence and interest set how you engage: manage closely, keep satisfied, keep informed or monitor.",
      check: function (w) {
        return /placed 5\/5/.test(document.getElementById("stake-readout").textContent);
      } },
    { id: "rec-test-first",
      widget: "rec-demo",
      goal: "Find a setting where the builder says \"Test first\" even though the expected value is above $150k a year.",
      hint: "A high expected value is not enough on its own; think about how easy the change would be to undo.",
      success: "When confidence is medium and the change is hard to reverse, a test is worth its delay even for a valuable option.",
      check: function (w) {
        var t = document.getElementById("rec-readout").textContent;
        var m = t.match(/expected value \+\$(\d+)k/);
        return !!(/verdict: Test first/.test(t) && m && parseInt(m[1], 10) > 150);
      } }
  ]
};
