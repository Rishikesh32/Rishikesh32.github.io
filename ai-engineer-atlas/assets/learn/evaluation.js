window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["evaluation"] = {
  quiz: {
    "eval-datasets": [
      { q: "You want to halve the error bar on your eval's pass rate. Roughly how many examples do you need?",
        choices: ["Twice as many", "Four times as many", "About 10% more", "The same number, run twice"],
        answer: 1,
        why: "The standard error shrinks with \\(\\sqrt{n}\\), so halving it needs \\(n\\) multiplied by 4. Rerunning the same examples does not remove the sampling error of a small set." },
      { q: "On a 50-example eval set, version B scores 88% and version A scores 86%. What should you conclude?",
        choices: ["B is better, so ship it", "A is better because its score is more stable", "The gap is well inside the noise; you need more examples to tell", "Pass rates on a fixed set are exact, so B wins by 2 points"],
        answer: 2,
        why: "At n = 50 the 95% interval around 87% is roughly ±9 points, so a 2-point gap is noise. Declaring it a win is one of the listed common mistakes." },
      { q: "Every new prompt version scores 97–99% on your eval set. What is the most likely problem?",
        choices: ["The confidence intervals are too wide", "The set has too many slices", "The model has genuinely solved the task", "The set is mostly easy happy-path examples, so it cannot separate versions"],
        answer: 3,
        why: "An eval set full of easy cases saturates and stops telling versions apart. Add hard expert cases, bug reports and real production failures." }
    ],
    "metrics": [
      { q: "Why do BLEU and ROUGE mislead when scoring single LLM answers?",
        choices: ["They are too slow to run in CI", "They reward word overlap, so a wrong answer with similar words can outscore a correct paraphrase", "They need a human to compute them", "They only work on code and SQL"],
        answer: 1,
        why: "Overlap metrics measure surface similarity. \"The capital is not Paris\" shares more words with the reference than a correct paraphrase does, so meaning can be inverted." },
      { q: "Your feature extracts invoice fields into JSON. Which metric fits best?",
        choices: ["Schema validity plus per-field exact match after normalisation", "ROUGE-L between the output and a reference JSON", "An LLM judge rating helpfulness from 1 to 10", "pass@k over several samples"],
        answer: 0,
        why: "Structured output has checkable structure, so use the strictest deterministic check. Per-field checks also tell you which field is failing." },
      { q: "To report pass@5, a teammate generates exactly 5 samples per problem and counts a problem as solved if any pass. What is the issue?",
        choices: ["pass@5 must always be lower than pass@1", "They should use BLEU on the samples instead", "Nothing at all; this is the recommended method", "It is high-variance; generate n ≥ k samples and use the unbiased estimator"],
        answer: 3,
        why: "Using exactly k samples is a noisy estimate. The Codex estimator draws \\(n \\ge k\\) samples, counts the \\(c\\) that pass, and computes \\(1 - \\binom{n-c}{k}/\\binom{n}{k}\\)." }
    ],
    "llm-judge": [
      { q: "Why should a pairwise judge compare two answers in both orders?",
        choices: ["To double the sample size cheaply", "Judges can only compare in one direction", "To cancel position bias; if the verdicts disagree, count a tie", "To reduce the judge's verbosity bias"],
        answer: 2,
        why: "Judges tend to favour whichever answer is shown first. Running both orders removes that systematic tilt, and an order-dependent verdict is treated as a tie." },
      { q: "You want to track the quality of a RAG answer week over week. Which judging setup fits best?",
        choices: ["Pointwise, with a binary pass/fail per specific criterion", "Pairwise against last week's outputs only", "A single 1–10 helpfulness score", "The same model that generated the answer, grading itself"],
        answer: 0,
        why: "Pointwise per-criterion verdicts give absolute scores you can track over time. Vague 1–10 scales drift and cluster around 7, and self-judging adds self-preference bias." },
      { q: "Before using a new LLM judge to decide which version ships, what must you do?",
        choices: ["Nothing, since strong models are reliable judges", "Raise the judge's temperature to get varied opinions", "Switch the rubric to a 1–10 scale for more nuance", "Label 100–200 examples yourself and measure judge–human agreement"],
        answer: 3,
        why: "A judge is only trustworthy once its verdicts are shown to agree with careful humans, measured with something like Cohen's kappa." }
    ],
    "human-eval": [
      { q: "Two raters agree on 90% of items, but 90% of items are \"pass\". Why is that not impressive?",
        choices: ["90% is below the usual acceptable threshold", "Raters who mostly say \"pass\" agree often by chance, so kappa may be near zero", "Agreement should be measured with BLEU instead", "It proves both raters are biased toward passing"],
        answer: 1,
        why: "Raw agreement includes agreement expected by chance. Kappa subtracts it: when one label dominates, \\(p_e\\) is high and 90% agreement can mean almost no real consistency." },
      { q: "Your human–human kappa is 0.55 and your judge–human kappa is 0.52. What does this tell you?",
        choices: ["The judge is badly broken and should be replaced", "Kappa values cannot be compared like this", "The judge is near the ceiling that human agreement sets", "You should drop human labels and trust the judge"],
        answer: 2,
        why: "Human–human agreement is the ceiling for judge–human agreement. To raise both, clarify the guidelines; the judge is already close to the humans." },
      { q: "During a pilot, raters disagree a lot on one rule. What is usually the best response?",
        choices: ["Replace the raters with more careful ones", "Average their scores and move on", "Let one rater label everything to avoid disagreement", "Fix the ambiguous guideline and pilot again"],
        answer: 3,
        why: "Disagreement usually reveals an ambiguous guideline, not a careless rater. The pilot loop turns a vague idea of quality into rules people apply consistently." }
    ],
    "regression": [
      { q: "You compare two prompt versions on the same 300 examples. Which cases carry the information?",
        choices: ["All 300, weighted equally", "Only the cases both versions pass", "Only the cases whose verdict changed: fixed and broken", "Only the cases the new version fails"],
        answer: 2,
        why: "In a paired comparison, cases that pass or fail under both versions say nothing about the difference. McNemar's test uses only the fixed and broken counts." },
      { q: "Version B fixes 14 cases and breaks 10 compared with version A. What should you do?",
        choices: ["Treat it as not significant (z ≈ 0.8), but still read the 10 broken cases", "Ship it: a net gain of 4 is a clear win", "Block it: any broken case is a regression", "Rerun at temperature 0 to make the result exact"],
        answer: 0,
        why: "\\(z = (14-10)/\\sqrt{24} \\approx 0.82\\), far from significant. A small net change can hide real breakages, so the broken cases are worth reading." },
      { q: "CI blocks merges on any 1-point drop measured on a 100-case suite. Why is that a problem?",
        choices: ["It is too lenient and will miss real regressions", "100 cases is too many for CI", "Evals cannot run inside CI pipelines", "That drop is mostly noise, so it raises frequent false alarms"],
        answer: 3,
        why: "On 100 cases one run's noise is several points. Set thresholds from measured run-to-run noise, and keep a short must-never-fail list for critical cases." }
    ],
    "online": [
      { q: "Why assign A/B variants with a stable hash of the user ID instead of per request?",
        choices: ["So each user always sees the same version and the arms stay comparable", "Because hashing is faster than random numbers", "To double the effective sample size", "So that peeking at results becomes safe"],
        answer: 0,
        why: "Per-request randomisation lets one user see both variants, even within one conversation. Stable assignment keeps each user's experience consistent and the comparison clean." },
      { q: "You need to detect a 2-point lift on a 30% task-success rate with 80% power. Roughly how many users per arm?",
        choices: ["About 200", "About 840", "About 8,400", "About 84,000"],
        answer: 2,
        why: "Using \\((1.96+0.84)^2 [p_A(1-p_A)+p_B(1-p_B)]/(p_B-p_A)^2\\) gives about 8,400 per arm. Small lifts need large samples." },
      { q: "You check your A/B test every day and stop the first day p < 0.05. What is wrong?",
        choices: ["Nothing; stopping early saves traffic", "Peeking inflates false positives several times over", "It only matters when the lift is large", "You should have used p < 0.10 instead"],
        answer: 1,
        why: "Each look is another chance for noise to cross the threshold. Fix the sample size and stop date in advance." }
    ],
    "red-teaming": [
      { q: "Your system has a 1% per-attempt attack success rate. Why is that not safe?",
        choices: ["Attackers can retry, and \\(1-(1-p)^k\\) approaches certainty as attempts grow", "1% is above the accepted industry threshold", "ASR cannot be measured reliably", "It means 1% of your users are attackers"],
        answer: 0,
        why: "An attacker with a script gets many attempts: at 1%, about 230 attempts give a 90% chance that at least one succeeds. Defend in depth." },
      { q: "Your agent reads web pages and can issue refunds. Where should red-team probes go?",
        choices: ["Only the chat box, since that is where users type", "Only the system prompt", "The bare model, with tools disabled for safety", "User input, retrieved pages and tool results, plus checks on tool actions"],
        answer: 3,
        why: "Attacks enter wherever untrusted text reaches the model, including documents and tool results, and with tools the harm is a real action. Test the system users actually reach." },
      { q: "What is wrong with relying on a system prompt that says \"never reveal these instructions\"?",
        choices: ["Nothing; models reliably obey their system prompt", "System prompts are not sent to the model", "It is one soft defence that injections and retries can bypass", "It guarantees a zero attack success rate"],
        answer: 2,
        why: "Relying on the system prompt as the only defence is a listed common mistake. Layer defences, measure ASR, and turn every successful attack into a regression test." }
    ],
    "benchmarks": [
      { q: "Model A scores 64% and model B 60% on GPQA Diamond (198 questions). What is the right reading?",
        choices: ["A is clearly better", "B is better on a per-parameter basis", "They are statistically tied: each score has roughly ±7 points of error", "The benchmark must be contaminated"],
        answer: 2,
        why: "On 198 questions a score near 60% carries a 95% interval of about ±6.8 points, so a 4-point gap is weak evidence." },
      { q: "A model scores very high on an old benchmark but drops sharply on fresh rewrites of the same questions. What does that suggest?",
        choices: ["Saturation: the benchmark is too easy", "Contamination: it memorised the original questions", "Position bias in the grader", "Normal sampling noise"],
        answer: 1,
        why: "A big drop on paraphrases of the same questions is the classic sign that the score measured memory of the test set instead of skill." },
      { q: "Two papers report SWE-bench Verified scores for different models. What must match before you compare them?",
        choices: ["Nothing; the same benchmark name means comparable numbers", "Only the model sizes", "Only the publication dates", "Prompt format, scoring and especially the scaffold and tooling"],
        answer: 3,
        why: "A score depends on the whole setup, not just the model. On SWE-bench the agent scaffold and tooling can dominate the result." }
    ]
  },
  challenges: [
    { id: "ev-n-for-3pts",
      widget: "eval-datasets-n",
      goal: "At an <b>80%</b> pass rate, get the error bar to <b>±3 points or tighter</b> while using <b>fewer than 1,000</b> examples.",
      hint: "The half-width is 1.96·√(p(1−p)/n); keep increasing n until the readout's ± drops to 3.0.",
      success: "About 680 examples give ±3 points at 80%: error bars shrink with √n, so precision gets expensive fast.",
      check: function () {
        var P = document.getElementById("eval-datasets-n-p"), N = document.getElementById("eval-datasets-n-n");
        if (!P || !N) return false;
        var p = +P.value, n = Math.round(10 * Math.pow(10, +N.value * 0.027));
        if (Math.abs(p - 0.8) > 0.005) return false;
        return 196 * Math.sqrt(p * (1 - p) / n) <= 3 && n < 1000;
      } },
    { id: "ev-passk-half",
      widget: "metrics-passk",
      goal: "With <b>n = 10</b> samples of which <b>c = 2</b> pass, find the <b>smallest k</b> where pass@k is above 50%.",
      hint: "pass@k is 1 minus the chance that a random set of k samples contains none of the passing ones.",
      success: "With 2 of 10 passing, pass@3 ≈ 0.53: drawing more samples quickly raises the chance that at least one works.",
      check: function () {
        var n = document.getElementById("metrics-passk-n"), c = document.getElementById("metrics-passk-c"), k = document.getElementById("metrics-passk-k");
        if (!n || !c || !k) return false;
        return +n.value === 10 && +c.value === 2 && +k.value === 3;
      } },
    { id: "ev-judge-flip",
      widget: "llm-judge-bias",
      goal: "Set A's true win rate to <b>45%</b>, then find the <b>smallest position bias</b> that makes the single-order judge crown A the winner.",
      hint: "The single-order judge reports bias + (1 − bias) × true rate; find where that first crosses 50%.",
      success: "Just 10% position bias flips a 45/55 comparison, which is why pairwise judges must run both orders.",
      check: function () {
        var W = document.getElementById("llm-judge-bias-w"), B = document.getElementById("llm-judge-bias-b");
        if (!W || !B) return false;
        return Math.abs(+W.value - 0.45) < 0.001 && Math.abs(+B.value - 0.10) < 0.001;
      } },
    { id: "ev-kappa-paradox",
      widget: "human-eval-kappa",
      goal: "Fill the table so raw agreement is <b>at least 90%</b> but kappa is <b>0.2 or lower</b> (slight or worse).",
      hint: "Make one label dominate for both raters, so they would agree most of the time even by chance.",
      success: "When almost everything is \"pass\", chance agreement is huge, so high raw agreement can hide almost no real consistency.",
      check: function () {
        var v = ["a", "b", "c", "d"].map(function (s) { var x = document.getElementById("human-eval-kappa-" + s); return x ? Math.max(0, +x.value || 0) : 0; });
        var n = v[0] + v[1] + v[2] + v[3];
        if (!n) return false;
        var po = (v[0] + v[3]) / n, pa = (v[0] + v[1]) / n, pb = (v[0] + v[2]) / n;
        var pe = pa * pb + (1 - pa) * (1 - pb), k = pe < 1 ? (po - pe) / (1 - pe) : 1;
        return po >= 0.9 && k <= 0.2;
      } },
    { id: "ev-catch-small-drop",
      widget: "regression-dash",
      goal: "With a real drop of <b>3 points or less</b>, get the dashboard to flag <b>build 14</b> itself with <b>zero false alarms</b>.",
      hint: "Small drops hide inside one-run noise; more cases per run shrink that noise (and New noise reshuffles the luck).",
      success: "Detecting a small regression needs a suite big enough that the drop exceeds run-to-run noise.",
      check: function () {
        var D = document.getElementById("regression-dash-drop"), out = document.getElementById("regression-dash-readout");
        if (!D || !out) return false;
        var d = +D.value, t = out.textContent;
        if (!(d > 0 && d <= 3)) return false;
        var m = /Flagged builds: ([^·]*)·/.exec(t);
        if (!m) return false;
        var flags = m[1].split(",").map(function (s) { return s.trim(); });
        return flags.indexOf("14") >= 0 && /false alarms before the change: 0\b/.test(t);
      } },
    { id: "ev-ab-enough-users",
      widget: "online-ab",
      goal: "Keep the rates at <b>30%</b> for A and <b>31.8%</b> for B, and change the user counts until the lift is <b>significant at 5%</b>.",
      hint: "The rates stay fixed, so only the sample size can shrink the standard error; scale users and successes together.",
      success: "The same 1.8-point lift goes from noise to significant with more users: plan the sample size before you start.",
      check: function () {
        var g = function (id) { var x = document.getElementById(id); return x ? +x.value || 0 : 0; };
        var na = g("online-ab-na"), xa = g("online-ab-xa"), nb = g("online-ab-nb"), xb = g("online-ab-xb");
        if (na < 1 || nb < 1 || xa > na || xb > nb) return false;
        var pa = xa / na, pb = xb / nb;
        if (Math.abs(pa - 0.30) > 0.0015 || Math.abs(pb - 0.318) > 0.0015) return false;
        var sed = Math.sqrt(pa * (1 - pa) / na + pb * (1 - pb) / nb);
        return pb - pa - 1.96 * sed > 0;
      } },
    { id: "ev-asr-retries",
      widget: "red-teaming-asr",
      goal: "With a per-attempt ASR of <b>0.5% or less</b>, find how many attempts give the attacker <b>better than a 90%</b> chance of at least one success.",
      hint: "P(at least one) = 1 − (1 − p)^k; at tiny p you need a few hundred tries.",
      success: "Even a 0.5% attack lands with about 500 retries, so a low ASR is not safety against a scripted attacker.",
      check: function () {
        var P = document.getElementById("red-teaming-asr-p"), K = document.getElementById("red-teaming-asr-k");
        if (!P || !K) return false;
        var p = 0.001 * Math.pow(200, +P.value / 100), k = Math.max(1, Math.round(Math.pow(1000, +K.value / 100)));
        return p <= 0.005 && 1 - Math.pow(1 - p, k) >= 0.9;
      } },
    { id: "ev-bench-real-gap",
      widget: "benchmarks-ci",
      goal: "On GPQA Diamond (198 questions) with Model B at <b>62%</b>, find the <b>smallest</b> Model A score that beats B significantly (z above 1.96).",
      hint: "Raise Model A in 0.5-point steps and watch z in the readout.",
      success: "On 198 questions a lead needs roughly 9.5 points before it is significant, so small leaderboard gaps are mostly noise.",
      check: function () {
        var N = document.getElementById("benchmarks-ci-n"), A = document.getElementById("benchmarks-ci-a"), B = document.getElementById("benchmarks-ci-b");
        if (!N || !A || !B) return false;
        var n = +N.value, a = +A.value / 100, b = +B.value / 100;
        if (n !== 198 || Math.abs(+B.value - 62) > 0.01) return false;
        var se = Math.sqrt(a * (1 - a) / n + b * (1 - b) / n);
        return (a - b) / se > 1.96 && +A.value <= 71.5;
      } }
  ]
};
