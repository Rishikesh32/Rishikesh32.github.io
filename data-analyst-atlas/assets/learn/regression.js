window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["regression"] = {
  quiz: {
    "linear": [
      { q: "Why does ordinary least squares square the residuals instead of just adding them up?",
        choices: ["Squaring makes the line pass through the origin", "Positive and negative misses would cancel, and squaring also punishes big misses more", "Squared residuals are always smaller than raw ones", "It makes the slope equal to the correlation"],
        answer: 1,
        why: "Raw residuals around the best line sum to zero, so they cannot rank lines. Squaring makes every miss count as positive and weights large misses heavily, which is also why OLS is sensitive to outliers." },
      { q: "A model of order value on items has SSE = 688 and SST = 6,893. What is R²?",
        choices: ["0.10", "0.69", "0.90", "1.11"],
        answer: 2,
        why: "\\(R^2 = 1 - \\text{SSE}/\\text{SST} = 1 - 688/6893 \\approx 0.90\\). The line removes 90% of the squared variation around the mean." },
      { q: "Your regression of order value on items has R² = 0.92. A colleague says this proves adding items to baskets causes higher spend. What is wrong?",
        choices: ["R² only measures how much variation the line accounts for, not causation or whether the shape is right", "R² above 0.9 always means overfitting", "R² should be compared to 0.05, like a p-value", "Nothing; a high R² is enough evidence of cause"],
        answer: 0,
        why: "R² describes fit. It says nothing about why x and y move together, and a curved relationship can still give a high R² with a straight line." }
    ],
    "interpreting": [
      { q: "Order value on discount alone gives −$0.49 per point. Adding tenure, items and device gives +$0.37. Which explanation fits best?",
        choices: ["The second model has a bug because coefficients cannot change sign", "Discounts hurt mobile orders only", "Adding controls always makes coefficients positive", "Tenure confounds the first model: new customers get more discounts and also spend less"],
        answer: 3,
        why: "Leaving out a variable that drives both the predictor and the outcome biases the coefficient (omitted variable bias). Controlling for tenure compares customers with similar tenure." },
      { q: "In a model of <code>log(order_value)</code>, the coefficient on items is 0.145. What does one extra item do to expected order value?",
        choices: ["Adds $0.145", "Multiplies it by about 1.156, a 15.6% increase", "Adds 0.145%", "Raises it by 14.5 dollars"],
        answer: 1,
        why: "With a logged outcome, one unit of x multiplies y by \\(e^{\\beta}\\). \\(e^{0.145} = 1.156\\), so +15.6%. The quick \\(100\\beta\\) reading (14.5%) is close only because \\(\\beta\\) is small." },
      { q: "You want the effect of showing a discount banner on order value. Should you control for \"items added after seeing the banner\"?",
        choices: ["Yes, more controls always reduce bias", "Yes, because items strongly predict order value", "No, it is a mediator: the banner may work through it, so controlling for it hides part of the effect", "No, because categorical controls are not allowed"],
        answer: 2,
        why: "Controls should be things that come before the treatment. Controlling for a variable the treatment causes removes the very path you want to measure." }
    ],
    "diagnostics": [
      { q: "Your residuals-vs-fitted plot fans out: tiny residuals for small orders, huge ones for big orders. What is the main risk?",
        choices: ["Your standard errors and intervals are unreliable", "The coefficients are definitely the wrong sign", "R² is too low to report", "The data are not normally distributed, so OLS cannot run"],
        answer: 0,
        why: "A funnel means unequal variance (heteroscedasticity). Coefficients can still be roughly right, but plain standard errors are wrong. Log the outcome or use robust (HC3) standard errors." },
      { q: "The residual plot shows a clear U-shape. Which fix targets the problem?",
        choices: ["Switch to robust standard errors", "Remove the largest residuals", "Add more rows of data", "Add a squared term or transform the predictor so the model can bend"],
        answer: 3,
        why: "A curve left in the residuals means the straight-line shape is wrong. More data or robust SEs don't change the shape; a polynomial term, log or spline does." },
      { q: "One wholesale order with 15 items has a Cook's distance of 11.3 while every other order is below 0.3. What should you do first?",
        choices: ["Delete it, since it is clearly an error", "Find out what it is, then report results with and without it", "Ignore it, because OLS handles outliers automatically", "Switch to logistic regression"],
        answer: 1,
        why: "A high Cook's distance means this row is moving the fit a lot. It may be a real but different kind of customer. Investigate it, decide on a rule, and show how much it matters." }
    ],
    "logistic": [
      { q: "A logistic coefficient on pages viewed is 0.288. What is the odds ratio and what does it mean?",
        choices: ["1.33: each extra page multiplies the odds of buying by 1.33", "0.288: each page adds 28.8 percentage points to the probability", "1.33: each extra page makes buying 33% more likely in probability", "0.75: each page lowers the odds by 25%"],
        answer: 0,
        why: "\\(e^{0.288} \\approx 1.33\\) multiplies the odds. How much the probability moves depends on the starting point: from 0.46 it goes to about 0.53, not 0.61." },
      { q: "Why not fit ordinary linear regression to a 0/1 \"purchased\" column?",
        choices: ["Linear regression cannot use 0/1 outcomes at all", "It always gives the wrong sign", "Its predictions can fall below 0 or above 1, which are not valid probabilities", "It needs more rows than logistic regression"],
        answer: 2,
        why: "A straight line keeps going. With enough pages viewed it predicts a probability above 1. The logistic curve flattens near 0 and 1 instead." },
      { q: "A missed buyer costs far more than a wasted coupon. How should you move the threshold from 0.5?",
        choices: ["Raise it, to improve precision", "Leave it at 0.5, since that is where the model is calibrated", "Refit the model with more pages", "Lower it, to catch more buyers at the cost of more false alarms"],
        answer: 3,
        why: "A lower threshold flags more sessions, raising recall and lowering precision. When false negatives are expensive, that trade is worth it." }
    ],
    "model-features": [
      { q: "A model has <code>discount * C(device)</code>. The discount coefficient is 0.60 and discount:mobile is −0.50. What is the discount slope on mobile?",
        choices: ["0.60", "0.10", "−0.50", "1.10"],
        answer: 1,
        why: "With desktop as the reference, the mobile slope is the main effect plus the interaction: 0.60 + (−0.50) = 0.10 dollars per point." },
      { q: "As you raise the polynomial degree, training error keeps falling but validation error starts rising after degree 2. What is happening?",
        choices: ["The model is overfitting: it is fitting noise in the training rows", "The validation set is too large", "The model is underfitting at high degrees", "Training error is computed wrongly"],
        answer: 0,
        why: "Extra flexibility always helps on the rows used for fitting. Once it starts memorising noise, error on new rows goes up. Choose the degree at the validation minimum." },
      { q: "You encode device as desktop = 1, mobile = 2, tablet = 3 and fit one coefficient. What is the problem?",
        choices: ["Nothing; numbers are fine for any column", "It creates a dummy variable trap", "It forces an order and equal spacing (tablet minus mobile = mobile minus desktop) that does not exist", "It will make R² negative"],
        answer: 2,
        why: "A single numeric code imposes a straight-line effect across arbitrary labels. Use k−1 dummy columns so each device gets its own difference from the reference." }
    ],
    "model-comparison": [
      { q: "You add three columns of random noise to a model. What happens to R² on the training data?",
        choices: ["It drops, because noise hurts the fit", "It stays exactly the same", "It becomes negative", "It stays the same or rises slightly"],
        answer: 3,
        why: "Least squares can always set a new coefficient to zero, so adding a column can never raise SSE. That is why R² cannot be used to choose between models of different size." },
      { q: "Model A has AIC 2539.9 and model B has AIC 2544.3 on the same 500 orders. Model C models log(order value) and has AIC −120. Which comparison is valid?",
        choices: ["C is clearly best because its AIC is lowest", "A vs B: A is preferred; C cannot be compared because its outcome is on a different scale", "None, AIC only works for logistic models", "B is preferred because it has more features"],
        answer: 1,
        why: "AIC differences are only meaningful for models of the same outcome on the same rows. A beats B by 4.4; C's AIC is on a log scale and is not comparable." },
      { q: "You need to choose features for a model that will forecast next month's order values. Which approach is most direct?",
        choices: ["Compare cross-validated prediction error, using time-based folds", "Pick the model with the highest training R²", "Pick the model with the most significant p-values", "Pick the model with the most features"],
        answer: 0,
        why: "Cross-validation measures error on rows the model did not see, which is the goal when predicting. For time-ordered data, folds must respect time so the future does not leak into training." }
    ]
  },
  challenges: [
    { id: "lin-match-ols",
      widget: "lin-demo",
      goal: "Using only the two sliders, get your line's SSE within 2% of the least-squares minimum.",
      hint: "Get the slope roughly right first, then slide the intercept until the squares above and below the line balance out.",
      success: "Least squares is the single line with the smallest total squared miss; every other line, however close, does worse.",
      check: function (w) {
        var m = document.getElementById("lin-readout").textContent.match(/gap (-?[\d.]+)%/);
        return !!(m && parseFloat(m[1]) < 2);
      } },
    { id: "coef-flip-discount",
      widget: "coef-demo",
      goal: "Find a model where the discount coefficient is positive and its 95% interval excludes zero.",
      hint: "Discount codes go mostly to new customers, who spend less. Which controls let you compare like with like?",
      success: "Controlling for the confounders (tenure, and basket size) flips the sign: the raw coefficient was absorbing their effect.",
      check: function (w) {
        var t = document.getElementById("coef-readout").textContent;
        var m = t.match(/predictor (\S+) · coef (-?[\d.]+) · 95% CI \[(-?[\d.]+), (-?[\d.]+)\]/);
        return !!(m && m[1] === "discount_pct" && parseFloat(m[2]) > 0 && parseFloat(m[3]) > 0);
      } },
    { id: "resid-fix-curve",
      widget: "resid-demo",
      goal: "Switch to the curved dataset and find the fix that leaves a healthy residual plot (no funnel, no curve).",
      hint: "The value grows faster than the number of items. Which fix lets the model bend without squashing the spread?",
      success: "A curve in the residuals means the model's shape is wrong; adding a squared term fixes the shape, while robust SEs only fix the uncertainty.",
      check: function (w) {
        var t = document.getElementById("resid-readout").textContent;
        return document.getElementById("resid-data").value === "curve" && /verdict: healthy/.test(t);
      } },
    { id: "logit-catch-buyers",
      widget: "logit-demo",
      goal: "With a well-fitted model (log loss 0.515 or lower), choose a threshold that catches at least 95% of buyers while keeping precision at 0.60 or higher.",
      hint: "Let the computer fit the coefficients first, then lower the threshold step by step and watch precision and recall.",
      success: "Fitting sets the probabilities; the threshold is a separate business choice that trades precision for recall.",
      check: function (w) {
        var t = document.getElementById("logit-readout").textContent;
        var l = t.match(/log loss ([\d.]+)/), p = t.match(/precision ([\d.]+)/), r = t.match(/recall ([\d.]+)/);
        return !!(l && p && r && parseFloat(l[1]) <= 0.515 && parseFloat(p[1]) >= 0.6 && parseFloat(r[1]) >= 0.95);
      } },
    { id: "poly-sweet-spot",
      widget: "poly-demo",
      goal: "Find the polynomial degree with the lowest validation error.",
      hint: "Ignore the training curve; follow the validation curve down to its lowest point before it climbs.",
      success: "Training error always falls with more flexibility; the validation minimum marks where extra terms start fitting noise.",
      check: function (w) {
        var best = parseInt(w.getAttribute("data-best"), 10);
        return parseInt(document.getElementById("poly-deg").value, 10) === best;
      } },
    { id: "cmp-best-cv",
      widget: "cmp-demo",
      goal: "Find the single feature set, out of all 256, with the lowest 5-fold cross-validated RMSE.",
      hint: "Add the real drivers one at a time and keep each only if CV error falls; then test whether the noise columns ever help.",
      success: "Cross-validation rewards the columns that predict new orders and rejects the noise columns that R² would happily keep.",
      check: function (w) {
        var best = parseFloat(w.getAttribute("data-best-cv"));
        var m = document.getElementById("cmp-readout").textContent.match(/CV RMSE \$([\d.]+)/);
        return !!(m && parseFloat(m[1]) <= best + 0.005);
      } }
  ]
};
