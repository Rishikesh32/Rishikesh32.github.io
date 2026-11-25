window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["metrics"] = {
  quiz: {
    "metric-design": [
      { q: "Two dashboards both show \"weekly active users\" but differ by 30%. What is the most likely cause?",
        choices: ["One of the dashboards has a SQL syntax error", "The definitions differ in event, window, filters or unit", "Weekly numbers are always too noisy to match", "One tool rounds to the nearest thousand"],
        answer: 1,
        why: "Mismatched numbers almost always come from different definitions: app opens vs check-ins, rolling 7 days vs calendar weeks, or test accounts included in one. A broken query usually fails outright rather than giving a plausible number." },
      { q: "Your manager wants to put \"total sign-ups since launch\" on the team's goal slide. What is the problem with it?",
        choices: ["It is too hard to compute in SQL", "It changes too quickly to be useful", "It can only go up, so it cannot warn you when something breaks", "It counts users instead of events"],
        answer: 2,
        why: "A cumulative total rises every week, even in a bad one, so it cannot guide a decision. A rate per period, such as weekly activation rate, drops when something breaks." },
      { q: "A query counts <code>COUNT(*)</code> rows from <code>checkin_completed</code> events and reports it as \"active users\". What goes wrong?",
        choices: ["It counts events, so one very active user is counted many times", "It misses users who did not check in", "<code>COUNT(*)</code> skips rows with NULL values", "Nothing, as long as the window is a week"],
        answer: 0,
        why: "One user can produce dozens of check-in events. Counting users requires <code>COUNT(DISTINCT user_id)</code>. <code>COUNT(*)</code> counts every row, including those with NULLs." }
    ],
    "funnels": [
      { q: "Step conversions are 10%, 50% and 40%. What is the overall conversion from the first step to the last?",
        choices: ["100%, the sum of the steps", "33%, the average of the steps", "10%, the lowest step", "2%, the product of the steps"],
        answer: 3,
        why: "Each step applies to the people who survived the previous one, so the rates multiply: 0.10 × 0.50 × 0.40 = 0.02, or 2%." },
      { q: "You can lift exactly one step by 5 percentage points: visit → sign-up (now 8%) or trial → paid (now 50%). Which adds more paying customers?",
        choices: ["Visit → sign-up, because 8% to 13% is a 62% relative lift", "Trial → paid, because it is closest to revenue", "Both add the same, because both are +5 points", "Trial → paid, because it has fewer people to convert"],
        answer: 0,
        why: "The steps multiply, so what matters is the relative change of each rate. 8% → 13% multiplies paid customers by 1.625; 50% → 55% multiplies them by only 1.1." },
      { q: "An analyst computes October conversion as October payments ÷ October sign-ups and gets 112%. What is the real mistake?",
        choices: ["Payments should be counted in dollars, not users", "It mixes cohorts: many October payers signed up in September", "The conversion window is too short", "Conversion can never be computed monthly"],
        answer: 1,
        why: "A period-based ratio puts different people in the numerator and denominator. Fix the cohort at the first step (October sign-ups) and count who from that group paid within the window." }
    ],
    "retention": [
      { q: "In a cohort table, what does reading down a single column (for example, M1) show you?",
        choices: ["How one cohort ages over time", "What happened in one calendar month", "How cohorts of different start months compare at the same age", "The total number of active users"],
        answer: 2,
        why: "A column fixes the age, so it compares cohorts like for like. Rows show one cohort ageing; diagonals show one calendar month across cohorts." },
      { q: "Product A keeps 60% at month 1 and decays toward 0. Product B keeps 45% at month 1 and flattens at 30%. Which has the stronger long-run base?",
        choices: ["Product B, because its curve flattens and keeps a loyal core", "Product A, because it keeps more users at month 1", "They are equal, because the average is similar", "You cannot tell without revenue data"],
        answer: 0,
        why: "A curve that decays to zero loses every cohort eventually. A curve that flattens keeps a core of users for good, and that floor drives lifetime value." },
      { q: "Monthly churn is a steady 5%. Roughly what share of a cohort is still subscribed after 12 months?",
        choices: ["40%, because 12 × 5% = 60% leave", "95%, because only 5% ever leave", "About 54%, because 0.95 to the 12th power ≈ 0.54", "About 25%, because churn compounds upward"],
        answer: 2,
        why: "Each month 95% of the remaining customers stay, so after 12 months \\(0.95^{12} \\approx 0.54\\) remain. Multiplying 12 × 5% overstates the loss because churn applies to a shrinking base." }
    ],
    "unit-economics": [
      { q: "Spend is $40,000, new paying customers are 250, ARPU is $20 a month and gross margin is 75%. What is simple CAC payback?",
        choices: ["8 months", "10.7 months", "6 months", "13.3 months"],
        answer: 1,
        why: "CAC = 40,000 ÷ 250 = $160. Monthly margin = $20 × 0.75 = $15. Payback = 160 ÷ 15 ≈ 10.7 months. Using revenue instead of margin would give the wrong answer of 8 months." },
      { q: "Blended CAC is $150 and LTV is $200, yet the finance team wants to cut one channel. Why might they be right?",
        choices: ["Blended CAC is always higher than channel CAC", "LTV should be compared with revenue, not CAC", "Blended CAC includes free organic customers and can hide a channel that costs far more than LTV", "Any LTV:CAC under 3 means every channel should be cut"],
        answer: 2,
        why: "Blended CAC averages paid channels with customers who cost nothing. A single channel can cost $600 per customer while the average still looks healthy, so decide per channel." },
      { q: "Monthly churn drops from 6% to 3% while everything else stays the same. What happens to LTV under the simple formula?",
        choices: ["It falls by half", "It rises by 3%", "It stays the same, because ARPU did not change", "It doubles"],
        answer: 3,
        why: "LTV = monthly margin ÷ churn, so halving churn doubles the expected lifetime and doubles LTV. That sensitivity is why a guessed churn rate makes LTV fragile." }
    ],
    "north-star": [
      { q: "Which is the best north star for a subscription habit app?",
        choices: ["Weekly subscribers who complete at least one check-in", "Total app downloads", "Monthly revenue", "Number of push notifications sent"],
        answer: 0,
        why: "A north star should capture value customers actually get and lead future revenue. Downloads are a vanity count, revenue lags, and notifications sent measure your effort rather than customer value." },
      { q: "The team doubles sessions per user by sending daily pushes. Unsubscribes double too. Which idea explains why this is not a win?",
        choices: ["Simpson's paradox", "Goodhart's law: the target was hit while the outcome it stood for got worse", "Regression to the mean", "The law of large numbers"],
        answer: 1,
        why: "When a measure becomes a target it stops being a good measure. Sessions were a proxy for value; pushing them directly broke the link, and an unsubscribe guardrail would have caught it." },
      { q: "When should guardrail limits be agreed?",
        choices: ["After the results come in, so the limits fit the data", "Only if the north star goes down", "Before the push starts, with explicit thresholds", "Never; guardrails should just be watched informally"],
        answer: 2,
        why: "Limits set after the fact get bent to fit whatever happened. Agreeing on explicit thresholds up front turns a guardrail into a real stopping rule." }
    ],
    "metric-trees": [
      { q: "Revenue fell 11.7%. Orders fell 10.8% and average order value fell 1.0%. Where should you look next?",
        choices: ["Into the orders branch, because it explains most of the drop", "Into the AOV branch, because prices are easy to change", "At both equally, because each changed", "At total revenue by day, to confirm the drop"],
        answer: 0,
        why: "Revenue = orders × AOV, and the log shares put about 92% of the change on orders. Follow the branch that explains the most change." },
      { q: "Conversion fell overall, but conversion is flat within every traffic channel. What is the most likely explanation?",
        choices: ["A tracking bug in every channel at once", "Random noise in the total", "A mix shift: more traffic now comes from a channel that converts less", "Conversion is computed wrongly in the total"],
        answer: 2,
        why: "If each segment's rate is steady but the share of traffic moves toward a low-converting segment, the weighted total falls. This is the same mechanism behind Simpson's paradox." },
      { q: "A daily revenue chart shows a 40% drop for yesterday. What should you check first?",
        choices: ["Which marketing campaign ended", "Whether the data is complete and the definition unchanged, for example a late pipeline load", "Conversion by platform", "Competitor prices"],
        answer: 1,
        why: "Sudden large drops are often data problems: a late load, a renamed event or an edited definition. Confirm the number is real before spending hours explaining it." }
    ]
  },
  challenges: [
    { id: "md-full-marks",
      widget: "md-demo",
      goal: "Turn the vague \"recent logged-in users\" into a metric that scores full marks on precise, measurable and actionable.",
      hint: "Each open issue maps to one control, and an actionable metric counts an action that shows value delivered.",
      success: "A good metric pins down the unit, the event, the window and the filters, and points at something you can act on.",
      check: function (w) {
        var t = document.getElementById("md-readout").textContent;
        return /precise 4\/4/.test(t) && /measurable 2\/2/.test(t) && /actionable 3\/3/.test(t);
      } },
    { id: "funnel-one-lever",
      widget: "funnel-demo",
      goal: "Keep traffic at 20,000 and get at least 230 paying customers by changing just one step, by no more than 10 points.",
      hint: "The steps multiply, so compare the relative lift that 10 extra points gives each step.",
      success: "The same number of points is a much bigger relative lift on a low rate, so the weakest step is usually the best lever.",
      check: function (w) {
        var v = parseFloat(document.getElementById("fn-visitors").value);
        var ids = ["fn-r1", "fn-r2", "fn-r3", "fn-r4"], def = [8, 50, 40, 50], r = [], changed = 0, ok = true;
        ids.forEach(function (id, i) {
          var x = parseFloat(document.getElementById(id).value); r.push(x);
          if (Math.abs(x - def[i]) > 1e-9) { changed++; if (Math.abs(x - def[i]) > 10 + 1e-9) ok = false; }
        });
        var paid = v * r[0] * r[1] * r[2] * r[3] / 1e8;
        return v === 20000 && changed === 1 && ok && paid >= 230 - 1e-6;
      } },
    { id: "retention-flatten",
      widget: "retention-demo",
      goal: "Keep month-1 retention at 70% or lower, but lift the January cohort's month-6 retention to at least 55%.",
      hint: "The first drop is fixed, so change what happens after it: how fast the not-yet-loyal leave, or how big the loyal core is.",
      success: "Where and how fast the curve flattens matters more for the long run than the first-month drop.",
      check: function (w) {
        var m1 = parseFloat(document.getElementById("ret-m1").value), keep = parseFloat(document.getElementById("ret-keep").value) / 100;
        var floor = parseFloat(document.getElementById("ret-floor").value), f = Math.min(floor, m1);
        var m6 = f + (m1 - f) * Math.pow(keep, 5);
        return m1 <= 70 && m6 >= 55;
      } },
    { id: "ue-healthy",
      widget: "ue-demo",
      goal: "Without changing the price (ARPU stays $15), reach LTV:CAC of at least 3 and simple payback within 12 months.",
      hint: "LTV moves with churn and margin; CAC moves with how many customers your spend brings in.",
      success: "Healthy unit economics come from cheaper acquisition, better margin and, above all, lower churn.",
      check: function (w) {
        var g = function (id) { return parseFloat(document.getElementById(id).value); };
        var arpu = g("ue-arpu"), cac = g("ue-spend") / g("ue-new"), m = arpu * g("ue-gm") / 100, ltv = m / (g("ue-churn") / 100);
        return arpu === 15 && ltv / cac >= 3 && cac / m <= 12;
      } },
    { id: "ns-balance",
      widget: "ns-demo",
      goal: "Push the north star to 15,000 or more while every guardrail stays OK.",
      hint: "Push each lever until its guardrail is just inside the limit; no single lever gets you there alone.",
      success: "Guardrails turn \"maximize the metric\" into \"maximize it within agreed costs\", which forces a balanced plan.",
      check: function (w) {
        var g = function (id) { return parseFloat(document.getElementById(id).value); };
        var push = g("ns-push"), disc = g("ns-disc"), steps = g("ns-steps");
        var ns = 10000 + 4000 * (1 - Math.exp(-push / 4)) + 60 * disc + (6 - steps) * 500;
        var ok = 1 + 0.25 * push <= 3 + 1e-9 && 70 - 0.6 * disc >= 60 - 1e-9 && 8 + 1.5 * Math.pow(Math.max(0, 6 - steps), 2) <= 20 + 1e-9;
        return ok && ns >= 15000;
      } },
    { id: "tree-root-cause",
      widget: "tree-demo",
      goal: "Revenue fell 11.7% this week. Drill down the tree until you reach the single segment that explains the drop.",
      hint: "At each level, open the child that explains the biggest share of its parent's change, and ignore red herrings that are offset elsewhere.",
      success: "Following the branch with the largest contribution turns \"revenue is down\" into a specific, fixable cause.",
      check: function (w) {
        return w.getAttribute("data-found") === "1";
      } }
  ]
};
