window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["experiments"] = {
  quiz: {
    "design": [
      { q: "Why is user-level randomization preferred over session-level randomization for feature rollouts?",
        choices: ["Session-level randomization requires more server memory", "User-level avoids cross-treatment pollution where a user sees both variants across visits", "Session-level randomization breaks HTTPS cookies", "User-level randomization ensures exactly 50% split every second"],
        answer: 1,
        why: "If randomized by session, a user visiting twice may experience variant A then B, creating confusion and diluting treatment effects." },
      { q: "What is the primary purpose of an A/A test before running experiments?",
        choices: ["To measure the conversion lift of the new feature", "To check that the randomization engine is unbiased and false positive rate matches alpha", "To double the sample size for the upcoming test", "To guarantee a p-value below 0.01"],
        answer: 1,
        why: "An A/A test serves identical experiences to both buckets to verify that false positive rates match alpha (e.g., 5%) and there is no sample ratio mismatch." },
      { q: "Which metric is best suited as an experiment's primary success metric?",
        choices: ["Total pageviews across the site", "A direct behavioral proxy for value that moves within the test window and correlates with long-term retention", "Annual customer lifetime value", "Total server CPU utilization"],
        answer: 1,
        why: "A good primary metric must be sensitive enough to detect changes in 2–4 weeks while being causally linked to long-term business health." }
    ],
    "power": [
      { q: "If you halve the Minimum Detectable Effect (MDE) you want to detect, how does the required sample size change?",
        choices: ["It halves", "It stays the same", "It roughly quadruples (4x)", "It increases by 10%"],
        answer: 2,
        why: "Sample size scales inversely with the square of the effect size (1 / MDE^2). Halving MDE requires ~4x the sample size." },
      { q: "What is statistical power (1 - beta) in experiment sizing?",
        choices: ["The probability of rejecting the null hypothesis when a true effect actually exists", "The probability of finding a false positive", "The percentage of users who complete the funnel", "The speed of database query execution"],
        answer: 0,
        why: "Power (typically set to 80% or 90%) is the probability that the test will detect an effect if the true effect equals or exceeds the MDE." },
      { q: "Why should you never stop an experiment early just because p < 0.05 on day 3?",
        choices: ["It drains user battery", "Continuous monitoring without correction inflates the false positive rate (peeking problem)", "The server cache needs 14 days to warm up", "P-values only work on Sundays"],
        answer: 1,
        why: "Checking p-values repeatedly as data arrives severely inflates the false positive rate (often beyond 25% or 30%) due to random fluctuations." }
    ],
    "reading-results": [
      { q: "A 95% confidence interval for conversion lift is [+0.2%, +1.8%]. What is the correct interpretation?",
        choices: ["There is a 95% chance conversion is +1.8%", "Under repeated sampling, 95% of such calculated intervals contain the true lift, and 0 is excluded, indicating a statistically significant positive effect", "95% of users had an increased conversion rate", "Conversion increased by exactly 1.0%"],
        answer: 1,
        why: "The interval excludes zero and indicates a statistically significant positive lift between 0.2% and 1.8% at alpha = 0.05." },
      { q: "What does a p-value of 0.03 tell you?",
        choices: ["The probability that the treatment worked is 97%", "Assuming the null hypothesis of no difference is true, the probability of observing data at least this extreme is 3%", "The effect size is 3%", "3% of users disliked the variant"],
        answer: 1,
        why: "A p-value is P(Data at least as extreme | Null hypothesis is true), not the probability that the hypothesis itself is true or false." },
      { q: "Your test shows p = 0.12 (not statistically significant), but the point estimate is +4%. What should you conclude?",
        choices: ["The feature definitely failed and lost 4%", "We do not have sufficient evidence to reject the null hypothesis of no difference at the 5% level; check power and MDE", "The feature definitely succeeded because +4% is positive", "Re-run the test on the same data with a t-test instead of z-test"],
        answer: 1,
        why: "Insignificance means the data is compatible with random chance; it does not prove the effect is zero, especially if underpowered." }
    ],
    "pitfalls": [
      { q: "You expect a 50/50 traffic split, but count 48,200 visitors in Control and 51,800 in Variant (p < 0.0001). What is this called?",
        choices: ["High conversion lift", "Sample Ratio Mismatch (SRM)", "Novelty effect", "Survivorship bias"],
        answer: 1,
        why: "SRM indicates that the allocation mechanism, tracking, or redirect failed, invalidating comparison between the groups." },
      { q: "A dramatic spike in CTR during week 1 fades back to baseline by week 3. What likely caused this?",
        choices: ["Simpson's paradox", "Novelty effect (users click new buttons simply because they look different)", "Underpowered sample", "Regression towards the mean in SQL"],
        answer: 1,
        why: "Existing users notice visual changes and click out of curiosity; true behavioral changes only persist once novelty wears off." },
      { q: "What is Simpson's Paradox in experiment analysis?",
        choices: ["When mobile users convert faster than desktop users", "A trend appears in different subgroups but reverses or disappears when groups are combined due to an unbalanced confounding factor", "When experiments run on weekends perform worse", "When p-values equal exactly 0.05"],
        answer: 1,
        why: "Simpson's Paradox occurs when confounding mix shifts (e.g. higher proportion of mobile in one variant) reverse the aggregate conclusion." }
    ],
    "multiple-testing": [
      { q: "If you test 20 independent secondary metrics at alpha = 0.05 without correction, what is the chance of at least one false positive?",
        choices: ["Exactly 5%", "About 64% (1 - 0.95^20)", "100%", "0%"],
        answer: 1,
        why: "The family-wise error rate is 1 - (1 - alpha)^k. For 20 tests at 0.05, 1 - 0.95^20 ≈ 64.2% chance of at least one bogus discovery." },
      { q: "What does the Bonferroni correction do to control false discoveries?",
        choices: ["Multiplies the p-value by 100", "Divides the significance threshold alpha by the number of tests k (alpha_adj = alpha / k)", "Combines all metrics into an average", "Ignores tests with small sample sizes"],
        answer: 1,
        why: "Bonferroni divides target alpha by k tests, strictly bounding the overall probability of even a single false positive." },
      { q: "Why should subgroup analysis (e.g., iPhone users in Germany) be pre-registered before running a test?",
        choices: ["To prevent post-hoc data dredging where analysts search dozens of slices until an accidental p < 0.05 emerges", "Because databases cannot filter by country after data ingestion", "To reduce network latency", "To comply with GDPR cookies"],
        answer: 0,
        why: "Post-hoc slicing without hypotheses almost guarantees finding spurious significant segments due to multiple hypothesis testing." }
    ],
    "causal": [
      { q: "When you cannot randomize users (e.g., nationwide TV ad or policy change), which quasi-experimental method compares pre/post differences against an unaffected parallel group?",
        choices: ["Ordinary least squares with no controls", "Difference-in-Differences (DiD)", "Simple before-and-after average", "A/A testing"],
        answer: 1,
        why: "DiD calculates (Treated_post - Treated_pre) - (Control_post - Control_pre), subtracting out shared background trends under the parallel trends assumption." },
      { q: "What is the key assumption required for Difference-in-Differences to be valid?",
        choices: ["That both groups have identical population sizes", "Parallel trends: in the absence of treatment, both groups would have followed parallel trajectories over time", "That neither group had any variance", "That p < 0.01 in pre-period"],
        answer: 1,
        why: "DiD relies on parallel trends: without intervention, the treated group's path would have mirrored the control group's trend." },
      { q: "How does Synthetic Control improve on simple control group selection for regional launches?",
        choices: ["It creates simulated AI users", "It constructs an optimal weighted combination of unexposed regions to match the pre-treatment trajectory of the treated unit", "It randomly assigns cities every morning", "It deletes outlier days"],
        answer: 1,
        why: "Synthetic control algorithmically weights multiple comparison donor units to closely match the treated unit's historical trends before intervention." }
    ]
  }
};
