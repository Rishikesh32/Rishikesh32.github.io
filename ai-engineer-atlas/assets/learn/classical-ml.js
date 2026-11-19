window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["classical-ml"] = {
  quiz: {
    "supervised": [
      { q: "In logistic regression, you double both \\(w\\) and \\(b\\). What happens?",
        choices: ["The decision boundary rotates by 90 degrees", "The boundary shifts further from the origin", "Nothing changes, because the sigmoid ignores scale", "The boundary stays put, but probabilities move further from 0.5"],
        answer: 3,
        why: "The boundary is where \\(w \\cdot x + b = 0\\), and scaling both sides by 2 leaves that line unchanged. The logits double, though, so the sigmoid outputs become more confident. The length of \\(w\\) sets confidence; its direction sets the boundary." },
      { q: "You have 200 features and suspect only a handful really matter. Which regularizer helps you find them?",
        choices: ["Ridge (L2), because it shrinks every weight evenly", "Lasso (L1), because it drives many weights to exactly zero", "No regularizer, so small weights stay easy to spot", "A larger learning rate, so weak features fade out"],
        answer: 1,
        why: "Lasso's L1 penalty pushes many weights to exactly zero, which leaves a sparse model. Ridge shrinks weights but rarely makes any of them exactly zero." },
      { q: "A teammate fits plain linear regression to a 0/1 churn label and reports a churn \"probability\" of 1.3 for one customer. What is the right fix?",
        choices: ["Clip the predictions to [0, 1] and keep the model", "Add features until the predictions stay in range", "Use logistic regression, which passes the linear score through a sigmoid", "Rescale the target to −1 and +1 before fitting"],
        answer: 2,
        why: "A linear model's output is unbounded. Logistic regression squashes the same linear score through \\(\\sigma(z)\\) into (0, 1) and trains it with log loss. Clipping only hides the symptom." }
    ],
    "trees-ensembles": [
      { q: "Why can't a gradient-boosted tree model predict a house price higher than any price it saw in training?",
        choices: ["Each leaf predicts an average of training targets, so predictions are a staircase capped by what was seen", "Boosting clips predictions to the training range on purpose", "The learning rate shrinks large predictions towards the mean", "Trees need scaled features before they can extrapolate"],
        answer: 0,
        why: "A tree's prediction is the average label of the rows in a leaf, and boosting adds such values together. Outside the training range the prediction just stays flat at the last step. Trees cannot extrapolate." },
      { q: "Which statement correctly contrasts random forests and gradient boosting?",
        choices: ["Forests add small trees one by one to fix residuals; boosting averages deep trees", "Both average independent trees; boosting simply uses more of them", "Forests average decorrelated deep trees to cut variance; boosting adds small trees in sequence to cut bias", "Forests must be early-stopped; boosting needs no stopping rule"],
        answer: 2,
        why: "Bagging plus random feature subsets gives decorrelated trees whose average has lower variance. Boosting fits each new small tree to the current residuals, so it reduces bias step by step, which is why it needs early stopping." },
      { q: "You lower the boosting learning rate from 0.3 to 0.03 but keep 100 trees, and validation error gets worse. What happened?",
        choices: ["The smaller rate made the model overfit faster", "Each tree now adds a tenth as much, so 100 trees underfit; rate and tree count must be tuned together", "Lower learning rates always hurt gradient boosting", "The trees automatically grew deeper to compensate"],
        answer: 1,
        why: "\\(F_m = F_{m-1} + \\nu h_m\\): with a smaller \\(\\nu\\) each tree moves the prediction less, so you need many more trees. Pick the tree count with early stopping after choosing the rate." }
    ],
    "unsupervised": [
      { q: "k-means sometimes ends with two centroids inside one blob and a worse inertia. Why?",
        choices: ["The update step can increase inertia when clusters overlap", "k was set lower than the true number of blobs", "k-means needs labels to separate blobs correctly", "It only converges to a local minimum that depends on the starting centroids"],
        answer: 3,
        why: "Each assign and update step lowers inertia, so k-means always converges, but only to a local minimum. k-means++ starts and several restarts make a bad local minimum much less likely." },
      { q: "You cluster embedded user queries. The groups have odd shapes and many queries are one-offs that fit no group. Which algorithm suits this best?",
        choices: ["k-means with a large k", "A Gaussian mixture model", "HDBSCAN", "PCA down to 2 dimensions"],
        answer: 2,
        why: "HDBSCAN finds dense regions of any shape, labels sparse points as noise and needs no preset k. k-means assumes round clusters and forces every point into one. PCA reduces dimensions but does not cluster." },
      { q: "On a UMAP plot of your embeddings, cluster A sits far from cluster B and close to cluster C. What can you conclude?",
        choices: ["Very little: UMAP preserves local neighbourhoods, and distances between clusters on the plot mean little", "A is semantically closer to C than to B", "A and C should be merged into one cluster", "B is probably an outlier cluster"],
        answer: 0,
        why: "t-SNE and UMAP are for looking at neighbourhoods. Cluster sizes and gaps between clusters on their plots are not reliable measurements. Use them to look, never to measure." }
    ],
    "evaluation": [
      { q: "1% of transactions are fraud. A model predicts \"not fraud\" for every row. What are its accuracy and its recall on fraud?",
        choices: ["50% accuracy, 50% recall", "1% accuracy, 100% recall", "99% accuracy, 99% recall", "99% accuracy, 0% recall"],
        answer: 3,
        why: "It is right on all the legitimate 99%, so accuracy is 99%, but it catches no fraud at all, so recall is 0. This is why accuracy on imbalanced data needs the majority-class baseline beside it." },
      { q: "You are building an auto-delete feature for spam. It must almost never delete a real email. How should you move the threshold from 0.5?",
        choices: ["Lower it, to catch more spam", "Raise it, to gain precision at the cost of recall", "Leave it at 0.5, since the threshold does not affect precision", "Choose the threshold that maximizes ROC-AUC"],
        answer: 1,
        why: "A false positive here deletes a real email, so you want high precision. Raising the threshold flags only high-scoring items. ROC-AUC is the same at every threshold, so it cannot pick one." },
      { q: "Model B scores 87% accuracy and model A scores 85% on the same 200 test examples. What should you conclude?",
        choices: ["B is clearly better and should ship", "A is better because it is simpler", "The gap is inside the roughly ±5-point error bar, so it may be noise", "Accuracy can't compare models; only F1 can"],
        answer: 2,
        why: "With 200 examples at about 85%, the 95% interval is about \\(1.96\\sqrt{0.85 \\cdot 0.15 / 200} \\approx \\pm 5\\) points. Bootstrap an interval or gather more test data before you declare a winner." }
    ],
    "bias-variance": [
      { q: "Training error is 2% and validation error is 19%. What is the diagnosis and a sensible next step?",
        choices: ["High variance: get more data, regularize or simplify", "High bias: add capacity or features", "Noise floor: nothing will help", "Underfitting: train for longer"],
        answer: 0,
        why: "A big gap between training and validation error means the model memorized the training rows. More data, regularization, a simpler model or early stopping all reduce variance." },
      { q: "Training and validation errors are both high and close together. A colleague proposes collecting 10× more data. Will it help?",
        choices: ["Yes, more data always lowers error", "Yes, validation error will fall to the training error", "Only if you also add dropout", "Probably not: this is high bias, so add capacity or better features instead"],
        answer: 3,
        why: "When both errors are high and close, the model is too simple. More data reduces variance, not bias, so the errors will stay roughly where they are." },
      { q: "Your churn model reaches 0.97 ROC-AUC on validation, which is suspiciously high. Which feature is the most likely culprit?",
        choices: ["plan_type", "signup_month", "account_closed_date", "support_tickets in the 90 days before the prediction date"],
        answer: 2,
        why: "account_closed_date is only known after the customer churns, so it is target leakage. The model will not have it in production, which is why the score is too good to be true." }
    ],
    "feature-engineering": [
      { q: "Why encode hour of day as \\((\\sin 2\\pi h/24, \\cos 2\\pi h/24)\\) instead of the raw number 0–23?",
        choices: ["To scale the value into [0, 1]", "So that 23:00 and 00:00 end up next to each other", "Because trees cannot split on integers", "To reduce the number of columns"],
        answer: 1,
        why: "As a raw number, 23 and 0 look maximally far apart. The sine and cosine pair puts the hours on a circle, so midnight sits right next to 23:00." },
      { q: "A column has 20,000 distinct merchant IDs. Which encoding is the sensible choice?",
        choices: ["Out-of-fold target encoding, or learned embeddings", "One-hot encode all 20,000 levels", "Map the IDs to 1…20000 and standardize them", "Drop the column; IDs never carry signal"],
        answer: 0,
        why: "One-hot is for a few categories. With thousands of levels, use target encoding (the mean label per category) computed out-of-fold so a row never sees its own label, or use embeddings. Numbering the IDs invents an order that means nothing." },
      { q: "You run 200 random-search trials and report the best trial's cross-validation score as your expected production performance. What is wrong?",
        choices: ["Nothing, because cross-validation is unbiased", "Random search can't be combined with cross-validation", "Grid search should have been used instead", "The best of 200 scores is optimistically biased; confirm on an untouched test set"],
        answer: 3,
        why: "Picking the maximum of many noisy scores favours trials that got lucky on those folds. The test set, opened once after tuning, gives the honest number." }
    ]
  },
  challenges: [
    { id: "sup-right-but-unsure",
      widget: "sup-demo",
      goal: "Find weights that classify at least 90% of the points correctly but still have a mean log loss above 0.5.",
      hint: "Point \\(w\\) from the orange cluster towards the blue one, then make it short: what does a small \\(|w|\\) do to the probabilities?",
      success: "Accuracy only reads the side of the boundary; log loss also punishes hesitant probabilities, and \\(|w|\\) sets how confident the model is.",
      check: function (w) {
        var t = document.getElementById("sup-readout").textContent;
        var a = t.match(/accuracy ([\d.]+)%/), l = t.match(/log loss ([\d.]+)/);
        return !!(a && l && parseFloat(a[1]) >= 90 && parseFloat(l[1]) > 0.5);
      } },
    { id: "gb-slow-and-steady",
      widget: "gb-demo",
      goal: "With a learning rate of 0.15 or lower, get validation MSE below 0.35. How many trees does it take?",
      hint: "Each tree only adds \\(\\nu\\) times its prediction, so a small learning rate needs many more trees.",
      success: "Learning rate and tree count are coupled: halve the rate and you need roughly twice the trees, which is why the count is set by early stopping.",
      check: function (w) {
        var lr = parseFloat(document.getElementById("gb-lr").value);
        var m = document.getElementById("gb-readout").textContent.match(/validation MSE ([\d.]+)/);
        return !!(m && lr <= 0.151 && parseFloat(m[1]) < 0.35);
      } },
    { id: "km-local-minimum",
      widget: "km-demo",
      goal: "Catch k-means in a bad local minimum: with k = 4, converge to an inertia above 150 (the good solution is about 92).",
      hint: "Run to convergence, and if the four blobs come out right, press New random start and try again.",
      success: "k-means always converges, but only to a local minimum that depends on the start; k-means++ and several restarts are the fix.",
      check: function (w) {
        var k = parseInt(document.getElementById("km-k").value, 10);
        var t = document.getElementById("km-readout").textContent, m = t.match(/inertia ([\d.]+)/);
        return !!(k === 4 && /converged/.test(t) && m && parseFloat(m[1]) > 150);
      } },
    { id: "thr-catch-90",
      widget: "thr-demo",
      goal: "Find a threshold that catches at least 90% of the positives (recall ≥ 0.90) while keeping precision at 0.60 or higher.",
      hint: "Lower the threshold slowly from 0.50 and watch precision fall as recall climbs; the window where both hold is narrow.",
      success: "The threshold trades precision for recall along one curve; choose the operating point from what each mistake costs, not by default.",
      check: function (w) {
        var t = document.getElementById("thr-readout").textContent;
        var p = t.match(/precision ([\d.]+)/), r = t.match(/recall ([\d.]+)/);
        return !!(p && r && parseFloat(p[1]) >= 0.6 && parseFloat(r[1]) >= 0.9);
      } },
    { id: "bv-tame-degree-12",
      widget: "bv-demo",
      goal: "Keep the polynomial degree at 12 or higher, but get the readout to say the fit is near the sweet spot.",
      hint: "You can't lower the degree, but you can change how much data it has to fit.",
      success: "More data lowers variance: the same flexible model that wildly overfits 15 points behaves well on 45 or more.",
      check: function (w) {
        var d = parseInt(document.getElementById("bv-deg").value, 10);
        return d >= 12 && /near the sweet spot/.test(document.getElementById("bv-readout").textContent);
      } },
    { id: "hp-random-finds-band",
      widget: "hp-demo",
      goal: "With only 9 trials, get random search to a best score of at least 0.80 (the 3×3 grid is stuck near 0.60).",
      hint: "Keep the budget at 9 and press New random draw until one trial lands in the narrow dark band.",
      success: "Nine random trials test nine distinct learning rates, while a 3×3 grid tests only three, so random search finds narrow good regions far more often.",
      check: function (w) {
        var n = parseInt(document.getElementById("hp-budget").value, 10);
        var m = document.getElementById("hp-readout").textContent.match(/random: \d+ distinct, best score ([\d.]+)/);
        return !!(n === 3 && m && parseFloat(m[1]) >= 0.8);
      } }
  ]
};
