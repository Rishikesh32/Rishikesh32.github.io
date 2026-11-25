window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["ml"] = {
  quiz: {
    "ml-basics": [
      { q: "Your manager asks: \"Why did cancellations rise in March?\" What kind of question is this?",
        choices: ["Predict: train a churn classifier on March data", "Explain: compare cohorts, check the price change, maybe run a test", "Segment: cluster March cancellers into groups", "Describe: report the March cancellation count and stop"],
        answer: 1,
        why: "It asks for a cause behind something that already happened, so it needs analysis such as cohort comparisons, regression or an experiment. A classifier scores future rows; it does not explain a past rise." },
      { q: "What is the main thing a model produces that a one-off analysis does not?",
        choices: ["A chart that explains the business", "A more accurate average", "A reusable function that scores every new row, again and again", "Proof of what causes the outcome"],
        answer: 2,
        why: "Analysis ends with a person reading an answer. A model ends with a score per row that a process uses repeatedly, often on rows nobody has looked at." },
      { q: "In a churn training table built from month-end snapshots, which feature is leaky?",
        choices: ["Sessions in the 30 days before the snapshot", "Plan type on the snapshot date", "Support tickets in the 90 days before the snapshot", "Days since last login, measured on the day you exported the table"],
        answer: 3,
        why: "Features must be computable on the snapshot date. A value measured on the export day, after the outcome, secretly contains the answer: churners stopped logging in." }
    ],
    "classification": [
      { q: "You lower the churn threshold from 0.5 to 0.2. What usually happens?",
        choices: ["Recall rises, precision falls, and you send more offers", "Precision and recall both rise", "Recall falls because fewer people are flagged", "Nothing changes: the threshold is a property of the model"],
        answer: 0,
        why: "A lower cut-off flags more subscribers. You catch more real churners (recall up) but more of the flags are false alarms (precision down), and offer costs grow." },
      { q: "Only 5% of subscribers churn. A model reports 95% accuracy. What should you conclude?",
        choices: ["It is an excellent model", "Nothing yet: predicting \"nobody churns\" also scores 95%", "It must be overfitting", "Its precision must also be about 95%"],
        answer: 1,
        why: "With a rare positive class, the trivial \"nobody churns\" model gets accuracy equal to the share of stayers. Look at precision and recall for the churn class instead." },
      { q: "The retention team can call 300 people a week. How should you set the threshold?",
        choices: ["Keep 0.5, because the model was trained that way", "Use the threshold that maximizes accuracy", "Flag the 300 highest scores each week", "Flag everyone above the average churn rate"],
        answer: 2,
        why: "When capacity is fixed, the operating point is \"top N\". What matters then is how well the model ranks, so the riskiest 300 get the calls." }
    ],
    "clustering": [
      { q: "You cluster subscribers on monthly spend (dollars) and sessions per week without scaling. What goes wrong?",
        choices: ["k-means refuses to run on mixed units", "Spend dominates the distance, so clusters mostly split on spend", "Sessions dominate because they change more often", "Nothing: k-means scales features internally"],
        answer: 1,
        why: "k-means uses plain distance, so the feature with the bigger spread in raw units decides the groups. Standardize first so both features count." },
      { q: "Why can't you choose k by picking the value with the lowest inertia?",
        choices: ["Inertia always falls as k grows, so the lowest is always the largest k", "Inertia is only defined for k = 2", "Inertia rises with k, so it would always pick k = 1", "Inertia depends on the random seed only"],
        answer: 0,
        why: "More centres always make points closer to a centre, so inertia keeps dropping. Use the elbow, silhouette and whether the segments are usable." },
      { q: "Two runs of k-means with different random starts give different segments. What should you do?",
        choices: ["Report the first run; the second is wrong", "Switch to a supervised model", "Average the two sets of labels", "Run several starts (n_init) and keep the one with the lowest inertia, then check the segments are stable"],
        answer: 3,
        why: "k-means only finds a local optimum, so the starting centres matter. Several starts and a stability check on a re-run guard against a fragile segmentation." }
    ],
    "model-eval": [
      { q: "You train a churn model on January to June snapshots. How should you validate it?",
        choices: ["A random 20% of all rows", "On July and later months it never saw", "On the training months, with cross-validation shuffled across subscribers", "On the month with the most churners"],
        answer: 1,
        why: "The model will score future months, so validate on later months. A random split lets one subscriber's neighbouring snapshots land on both sides and inflates the score." },
      { q: "Churn falls from 20% to 2% of subscribers but the model ranks just as well. Which number drops a lot?",
        choices: ["ROC-AUC", "The ROC curve's diagonal", "PR-AUC and precision in the top 10%", "None: all ranking metrics ignore the base rate"],
        answer: 2,
        why: "ROC-AUC compares churners with stayers and ignores how rare churn is. Precision-based metrics fall with the base rate, so they show what a rare-event campaign will really get." },
      { q: "70% of the top 10% of scores churn, and the overall churn rate is 20%. What is the top-decile lift?",
        choices: ["0.7", "3.5", "1.4", "14"],
        answer: 1,
        why: "Lift is the churn rate in the group divided by the overall rate: 0.70 / 0.20 = 3.5. Contacting that decile finds 3.5 times as many churners as a random 10%." }
    ],
    "explainability": [
      { q: "How does permutation importance measure how much a model relies on a feature?",
        choices: ["It reads the feature's coefficient", "It retrains the model without the feature", "It shuffles that column in validation data and measures how much the metric drops", "It counts how often the feature is non-zero"],
        answer: 2,
        why: "Shuffling breaks the link between the column and the label. A big drop in the metric means the model leaned on that column." },
      { q: "Support tickets have the largest SHAP contribution for many churners. What can you tell stakeholders?",
        choices: ["Closing tickets faster will cut churn", "The model uses tickets heavily to rank risk; whether reducing them helps needs an experiment", "Tickets cause churn, so the support team is to blame", "Tickets are leaky and must be removed"],
        answer: 1,
        why: "Contributions describe how the model uses a feature, not cause and effect. Tickets may be a symptom of a broken product. Test interventions with an experiment." },
      { q: "In a SHAP-style waterfall for one subscriber, what do the bars add up to?",
        choices: ["The subscriber's prediction minus the model's average prediction", "Exactly 1.0", "The model's training accuracy", "The number of features"],
        answer: 0,
        why: "Contributions are additive: start at the average output, add each feature's push, and you land on this row's prediction (in log-odds for a logistic model)." }
    ],
    "when-not-ml": [
      { q: "A stakeholder asks: \"Does the new onboarding flow increase retention?\" What is the best tool?",
        choices: ["A churn classifier with an onboarding feature", "Clustering new users into onboarding groups", "A boosted-tree model with SHAP", "An A/B test comparing the two flows"],
        answer: 3,
        why: "It is a causal question. A model finds associations; a randomized test tells you what the new flow actually does." },
      { q: "You have 40 churn events in total. What should you do first?",
        choices: ["Train boosted trees with heavy regularization", "Use a simple measured rule and collect more labelled outcomes", "Oversample the 40 churners to 4,000", "Cluster the 40 churners"],
        answer: 1,
        why: "Forty examples are too few to train or to evaluate a model reliably. A rule gives value now and becomes the baseline once you have enough labels." },
      { q: "A SQL rule (\"failed payment or no sessions in 14 days\") gets 17% precision; a model gets 26%. When is the model worth it?",
        choices: ["Always: higher precision wins", "Never: rules are always better", "When the value of the extra 9 points beats the cost of pipelines, retraining and monitoring", "Only if the model's ROC-AUC is above 0.9"],
        answer: 2,
        why: "A model is an ongoing product with upkeep. Whether the extra precision pays for that upkeep is a money question you answer with the rule as the baseline." }
    ]
  },
  challenges: [
    { id: "ml-sort-all",
      widget: "mlb-demo",
      goal: "Sort all six questions into the right lane: get 6 of 6 correct.",
      hint: "Ask whether the question needs one answer for people to read or a fresh score for every row.",
      success: "Only per-row predictions and groupings need ML; describe and explain questions need queries, tests or regression.",
      check: function (w) { return w.dataset.correct === "6"; } },
    { id: "ml-threshold-cost",
      widget: "cls-demo",
      goal: "Offers just got expensive. Set the cost per offer to $25 or more, then find the threshold that gives the best possible net value.",
      hint: "At a higher cost, each false alarm hurts more, so the best threshold moves. Watch net value against the \"best possible\" line.",
      success: "The right threshold depends on the cost of acting and the value of a save, not on the model's default 0.5.",
      check: function (w) {
        var cost = parseFloat(document.getElementById("cls-cost").value);
        var net = parseFloat(w.dataset.net), best = parseFloat(w.dataset.best);
        return cost >= 25 && isFinite(net) && isFinite(best) && net >= best - 0.5;
      } },
    { id: "ml-kmeans-four",
      widget: "km-demo",
      goal: "Find the four behaviour groups: run k-means with k = 4 to convergence and land within 1% of the best inertia for k = 4.",
      hint: "If a run gets stuck in a poor grouping, try a new random start and run it again.",
      success: "k-means can stop at a local optimum, which is why you run several starts and keep the lowest inertia.",
      check: function (w) {
        var i = parseFloat(w.dataset.inertia), b = parseFloat(w.dataset.best);
        return w.dataset.k === "4" && w.dataset.converged === "1" && isFinite(i) && isFinite(b) && i <= b * 1.01;
      } },
    { id: "ml-rare-churn",
      widget: "eval-demo",
      goal: "Show that ROC-AUC hides rarity: make churn 5% or rarer while keeping ROC-AUC at 0.80 or more and PR-AUC below 0.40.",
      hint: "Leave model quality alone and move only the churn rate. Which curve moves?",
      success: "ROC-AUC ignores the base rate; PR-AUC and precision at top N show what a rare-event campaign will really get.",
      check: function (w) {
        var rate = parseFloat(document.getElementById("eval-rate").value);
        return rate <= 5 && parseFloat(w.dataset.auc) >= 0.8 && parseFloat(w.dataset.ap) < 0.4;
      } },
    { id: "ml-shap-low-risk",
      widget: "shap-demo",
      goal: "Keep \"payment failed\" ticked, but change the other features until P(churn) drops below 10%.",
      hint: "Look for the bars that push risk up and flip them into green bars that push it down.",
      success: "Contributions add up: several protective features can outweigh one strong risk factor.",
      check: function (w) {
        var pay = document.getElementById("shap-pay");
        return !!(pay && pay.checked) && parseFloat(w.dataset.p) < 0.10;
      } },
    { id: "ml-full-ml",
      widget: "wnm-demo",
      goal: "Describe a project that truly deserves full ML: make the helper recommend \"Full ML\".",
      hint: "Each answer that sends you to a rule or an analysis is a reason a model is not worth its upkeep yet.",
      success: "Full ML needs repeated per-row predictions, an owner who acts, plenty of labels, a measured rule that falls short and a stable pattern.",
      check: function (w) { return w.dataset.level === "3"; } }
  ]
};
