window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["statistics"] = {
  quiz: {
    "descriptive": [
      { q: "A salary distribution has an extreme right skew with a few multi-millionaires. Which measure of central tendency best describes the typical worker's salary?",
        choices: ["Mean", "Median", "Standard deviation", "Variance"],
        answer: 1,
        why: "The mean is pulled up dramatically by extreme outliers, whereas the median is robust to extreme values and reflects the 50th percentile worker." },
      { q: "What does the Interquartile Range (IQR) represent?",
        choices: ["The distance between minimum and maximum values", "The range of the middle 50% of the data (Q3 - Q1)", "The square root of variance", "The ratio of mean to median"],
        answer: 1,
        why: "IQR = Q3 - Q1, capturing the spread of the middle 50% of observations and filtering out tail outliers." },
      { q: "If standard deviation is 15, what is the variance?",
        choices: ["3.87", "30", "225", "150"],
        answer: 2,
        why: "Variance is the square of standard deviation: 15^2 = 225." }
    ],
    "distributions": [
      { q: "In a perfectly standard normal distribution, what percentage of observations fall within ±2 standard deviations of the mean?",
        choices: ["50%", "68.2%", "95.4%", "99.7%"],
        answer: 2,
        why: "Under the empirical rule (68-95-99.7), approximately 95.4% of values fall within 2 standard deviations of the mean." },
      { q: "Which distribution best models the number of customer support tickets arriving per hour at an e-commerce helpdesk?",
        choices: ["Poisson distribution", "Uniform distribution", "Binomial distribution with 2 trials", "Normal distribution with negative mean"],
        answer: 0,
        why: "The Poisson distribution models the count of independent events occurring in a fixed interval of time or space at a constant average rate." },
      { q: "What is kurtosis a measure of in a probability distribution?",
        choices: ["Asymmetry around the mean", "The 'tailedness' and likelihood of extreme outlier values compared to a normal distribution", "The median value", "The correlation between two variables"],
        answer: 1,
        why: "Kurtosis measures the weight and thickness of a distribution's tails, quantifying the risk of extreme outlier events." }
    ],
    "probability": [
      { q: "What is Bayes' Theorem used for in data analysis?",
        choices: ["Computing the arithmetic mean", "Updating the probability of a hypothesis as new evidence or data becomes available: P(A|B) = P(B|A)P(A)/P(B)", "Calculating SQL join performance", "Sorting tables alphabetically"],
        answer: 1,
        why: "Bayes' Theorem provides the mathematical formula for updating prior probabilities into posterior probabilities given observed evidence." },
      { q: "If event A and event B are independent, what is P(A and B)?",
        choices: ["P(A) + P(B)", "P(A) * P(B)", "P(A) / P(B)", "P(A|B) - P(B)"],
        answer: 1,
        why: "For statistically independent events, the joint probability is the product of their marginal probabilities: P(A ∩ B) = P(A) * P(B)." },
      { q: "What is the Prosecutor's Fallacy in probabilistic reasoning?",
        choices: ["Assuming correlation implies causation", "Confusing the probability of the evidence given innocence P(E|I) with the probability of innocence given the evidence P(I|E)", "Using median instead of mean", "Running a two-tailed test instead of one-tailed"],
        answer: 1,
        why: "The Prosecutor's Fallacy confuses P(Evidence | Innocent) with P(Innocent | Evidence), ignoring the base rate prior probability." }
    ],
    "sampling": [
      { q: "What does the Central Limit Theorem (CLT) state?",
        choices: ["All populations are normally distributed", "The sampling distribution of the sample mean approaches a normal distribution as sample size increases, regardless of the population distribution shape", "Larger datasets always have higher variance", "Samples must be sorted to calculate mean"],
        answer: 1,
        why: "The CLT proves that the sum or average of many independent random variables tends toward a normal distribution, enabling parametric hypothesis tests." },
      { q: "How does Standard Error (SE) differ from Standard Deviation (SD)?",
        choices: ["There is no difference", "SD measures the dispersion of individual data points in a population; SE measures the variability of the sample mean across repeated samples (SE = SD / sqrt(n))", "SE is always larger than SD", "SE only applies to categorical data"],
        answer: 1,
        why: "Standard error quantifies sample mean uncertainty: as sample size n grows, the standard error shrinks by 1 / sqrt(n)." },
      { q: "What type of bias occurs when customers who voluntarily write reviews are only those who had extremely good or extremely bad experiences?",
        choices: ["Survivorship bias", "Self-selection bias / voluntary response bias", "Confirmation bias in SQL", "Simpson's paradox"],
        answer: 1,
        why: "Voluntary response bias over-indexes on polarized emotional extremes and underrepresents the satisfied or indifferent majority." }
    ],
    "inference": [
      { q: "What does a 95% Confidence Interval for a metric mean?",
        choices: ["There is a 95% chance the sample mean is correct", "Under repeated sampling from the population, 95% of such constructed intervals will contain the true population parameter", "95% of users fall within this range", "The p-value is exactly 0.05"],
        answer: 1,
        why: "Frequentist confidence intervals describe long-run procedure reliability: 95% of intervals generated across identical experiments bracket the true parameter." },
      { q: "What is a Type I error (alpha) in hypothesis testing?",
        choices: ["Failing to reject a false null hypothesis (false negative)", "Rejecting a true null hypothesis (false positive)", "A division by zero error in SQL", "Using the wrong chart type"],
        answer: 1,
        why: "Type I error is a false positive: concluding there is a significant effect or difference when in reality none exists." },
      { q: "What is a Type II error (beta)?",
        choices: ["Rejecting a true null hypothesis (false positive)", "Failing to reject a false null hypothesis (false negative)", "Selecting the wrong database engine", "Having p < 0.001"],
        answer: 1,
        why: "Type II error is a false negative: missing a real effect that was actually present, often due to an underpowered sample size." }
    ],
    "correlation": [
      { q: "What does a Pearson correlation coefficient of r = -0.85 indicate?",
        choices: ["No relationship between variables", "A strong negative linear relationship: as one variable increases, the other systematically decreases", "A weak positive relationship", "85% of values are negative"],
        answer: 1,
        why: "Pearson's r ranges from -1 to +1. Values near -1 indicate strong inverse linear relationships." },
      { q: "Ice cream sales and drowning rates are strongly positively correlated. What explains this?",
        choices: ["Eating ice cream causes drowning", "A lurking confounding variable: summer heat causes both higher ice cream consumption and more swimming", "Calculation error in the covariance formula", "Drowning causes people to crave sugar"],
        answer: 1,
        why: "Confounding variables create spurious correlations between unlinked events by driving changes in both simultaneously." },
      { q: "When should you use Spearman's rank correlation instead of Pearson's correlation?",
        choices: ["When the data is strictly normally distributed", "When the relationship is monotonic but non-linear, or when data is ordinal or contains severe outliers", "Only when working with timestamps", "Never, Pearson is always superior"],
        answer: 1,
        why: "Spearman rank correlation evaluates monotonic relationships using ranks rather than raw values, making it robust to non-linear stretches and outliers." }
    ]
  }
};
