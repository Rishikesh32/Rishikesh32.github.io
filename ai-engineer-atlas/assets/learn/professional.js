window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["professional"] = {
  quiz: {
    "reading-papers": [
      { q: "You give a new paper a 10-minute first pass. What is that pass for?",
        choices: [
          "Working through every equation so nothing surprises you later",
          "Deciding whether the paper deserves more time, by writing down its five Cs",
          "Reproducing the main result before you trust the abstract",
          "Reading the related work closely to judge how novel it is"
        ],
        answer: 1,
        why: "Each pass ends with a decision, and most papers should stop after pass one. Category, context, correctness, contributions and clarity are enough to decide; equations and reproduction belong to later passes." },
      { q: "A paper reports +0.3 points over the baseline. On that benchmark, runs with different seeds vary by about 0.5. What do you conclude?",
        choices: [
          "It is a real gain, because any positive difference counts",
          "It is a real gain if the authors released code",
          "The gain is within seed noise, so it is not yet a result",
          "The baseline must have been over-tuned"
        ],
        answer: 2,
        why: "A gain smaller than seed-to-seed variance can't be told apart from luck. You need several seeds and a gain clearly larger than the noise. Released code helps you check, but it doesn't make the number real." },
      { q: "You reproduce a paper with one seed and land 2 points below the reported number. What should you do first?",
        choices: [
          "Run several seeds and compare preprocessing, the eval script and the appendix hyperparameters with yours",
          "Publish a note saying the paper's result does not hold",
          "Keep tuning your learning rate until the number matches",
          "Move to a different benchmark where the method might work better"
        ],
        answer: 0,
        why: "One seed can't overturn a result, and gaps between paper and code are often where the real trick hides. Rule out your own differences before blaming the authors." }
    ],
    "keeping-up": [
      { q: "Why does the page call keeping up a filtering problem?",
        choices: [
          "Most releases are fake, so you have to filter them out",
          "Papers are only useful once they are a year old",
          "Social feeds are always wrong, so you should drop them completely",
          "Nobody can follow everything, so you pick a few high-signal sources and a fixed time budget"
        ],
        answer: 3,
        why: "The volume is too high to read everything. A few primary sources, a fixed weekly budget and one triage list keep you current without burning hours. Feeds are still useful for early warnings, just capped." },
      { q: "A new model tops a public benchmark chart on launch day. What is the sensible next step?",
        choices: [
          "Switch production to it the same day, before competitors do",
          "Check it solves a problem you have and has evidence beyond the launch post, then test it on your own eval set and adopt behind a flag",
          "Wait for a newsletter to tell you whether it's good",
          "Ignore it, since new models are never worth switching to"
        ],
        answer: 1,
        why: "Launch posts are marketing and public benchmarks measure someone else's task. Your 50 to 200 real examples, with cost and latency, tell you whether it helps you, and a feature flag keeps the switch reversible." },
      { q: "Your provider is deprecating the model your product depends on. Where should you have seen it first?",
        choices: [
          "The provider's release notes or changelog, which you follow weekly",
          "A curated newsletter you skim now and then",
          "Your social feed, which is good for early warnings",
          "A public benchmark leaderboard"
        ],
        answer: 0,
        why: "Primary sources for the tools you actually use come first in a layered diet. Missing a deprecation notice in your own provider's changelog is a classic, avoidable mistake." }
    ],
    "product-sense": [
      { q: "A task happens thousands of times a day and a wrong answer is expensive, such as issuing refunds. What autonomy level fits at launch?",
        choices: [
          "Fully automate it, since the volume is high",
          "Assist only, because frequent tasks don't need AI",
          "The AI drafts and a human approves",
          "A human decides and the AI only does research"
        ],
        answer: 2,
        why: "Frequent and costly sits in the 'AI drafts, human approves' quadrant. 'Human decides, AI researches' is for rare, costly tasks. Climb toward full automation only when data shows errors are rare, visible and reversible." },
      { q: "Which of these is a well-framed problem rather than a solution looking for one?",
        choices: [
          "Add a chatbot to the help centre",
          "Fine-tune a model on our support tickets",
          "Use the newest LLM to improve support",
          "Support agents spend 6 minutes finding the right policy for each ticket"
        ],
        answer: 3,
        why: "A good problem names who is blocked, doing what, and how it is measured. The other three name a technique first and leave the user's pain undefined." },
      { q: "Your answer accuracy rose 8 points, but task success and adoption stayed flat. What does that suggest?",
        choices: [
          "You optimised a quality metric that isn't moving the user's job",
          "The release is a success, because quality metrics matter most",
          "Adoption always lags by a year, so just wait",
          "You need more guardrail metrics before reading the result"
        ],
        answer: 0,
        why: "Track product, quality and guardrail metrics together. If quality climbs while the product metric stays flat, the improvement doesn't matter to users, so revisit the problem framing." }
    ],
    "communication": [
      { q: "On a quality-versus-cost chart, option D costs more than option B and also scores lower. What do you do with D?",
        choices: [
          "Keep it as the premium tier, since it costs more",
          "Drop it: it is dominated, so no reader would rationally choose it",
          "Average it with B to get a middle option",
          "Rescore it with different criteria until it looks competitive"
        ],
        answer: 1,
        why: "An option worse on both axes than another is dominated and drops out. The remaining options form a frontier, and choosing along it is the business question. Changing criteria after scoring is a known mistake." },
      { q: "Error rate is 2%, an error costs $10, reviewers catch 90% of errors, and review costs $0.50 per item. Does reviewing everything pay?",
        choices: [
          "Yes, because any catch rate above 50% pays for itself",
          "Yes, because $10 per error is far more than $0.50 per review",
          "No, because review never pays below a 5% error rate",
          "No: it saves only about $0.18 per item (0.02 × $10 × 0.9), less than the $0.50 it costs"
        ],
        answer: 3,
        why: "Full review pays only when \\(e\\,c\\,k > r\\). Here \\(0.02 \\times 10 \\times 0.9 = 0.18 < 0.50\\). Comparing cost per error with cost per review ignores that most reviewed items were already fine." },
      { q: "An executive asks how the support bot is doing. Which line follows the page's advice?",
        choices: [
          "\"Tagging F1 is 0.87 and p95 latency is 2.8 s.\"",
          "\"Our metrics are within normal ranges.\"",
          "\"About 13 in 100 tickets get a wrong tag, and fixing each takes an agent about 30 seconds. Here are three examples.\"",
          "\"The model performs at state-of-the-art level on public benchmarks.\""
        ],
        answer: 2,
        why: "Turn metrics into user outcomes, money and time, and show real failures. Raw F1 and percentile figures don't tell a non-technical reader what changes for users." }
    ],
    "portfolio": [
      { q: "Why do two or three deep projects beat ten notebook demos?",
        choices: [
          "Depth shows evals, production thinking and judgement, which calling an API does not",
          "Reviewers only have time to open three links",
          "Fewer projects means fewer dependencies to keep updated",
          "Notebooks can't be shared publicly"
        ],
        answer: 0,
        why: "Plenty of people can call an LLM API. Real data, measured results and written trade-offs are what set an AI engineer apart, and only deep projects show them." },
      { q: "Your project has a live demo and a nice README but no evals. Which addition most improves it?",
        choices: [
          "A longer list of frameworks and tools in the README",
          "A second demo built on a different model",
          "A fixed eval set with a results table across iterations, run in CI",
          "A blog post about the tools you chose"
        ],
        answer: 2,
        why: "A chart or table of results across iterations on a fixed eval set proves you measure instead of guessing, and running it in CI lets a reviewer reproduce the numbers with one command." },
      { q: "Should your project write-up include what failed?",
        choices: [
          "No, because reviewers only want to see wins",
          "Only if the whole project failed",
          "Only in a private appendix for interviewers",
          "Yes, because honest failure analysis earns more trust than cherry-picked successes"
        ],
        answer: 3,
        why: "A write-up covers what you tried, what worked, what failed and why. Showing only cherry-picked successes is a listed mistake, because reviewers trust honest failure analysis more." }
    ]
  },
  challenges: [
    { id: "rp-full-read-no-code",
      widget: "rp-triage",
      goal: "Find a paper profile that earns a full third-pass read even though the authors released nothing (Artifacts: Nothing released).",
      hint: "Relevance counts three times and evidence twice, and your time budget can cap the verdict.",
      success: "Relevance and solid evidence drive the score, but only a 3+ hour budget unlocks a full third pass.",
      check: function (w) {
        var t = document.getElementById("rp-readout").textContent || "";
        return t.indexOf("Verdict: Read fully") === 0 && document.getElementById("rp-art").value === "0";
      } },
    { id: "ku-two-deep-reads",
      widget: "ku-diet",
      goal: "With 7 hours a week or less and at least 30% hands-on time, fit in two second-pass paper reads.",
      hint: "Feed minutes come out of the reading budget first, so see what 5 minutes a day costs over a week.",
      success: "Over a week, a small daily feed habit costs a deep read. Capping it frees time for papers and hands-on work.",
      check: function (w) {
        var hrs = +document.getElementById("ku-hours").value, hands = +document.getElementById("ku-hands").value;
        if (hrs > 7 || hands < 30) return false;
        var texts = document.getElementById("ku-svg").querySelectorAll("text");
        for (var i = 0; i < texts.length; i++) {
          var m = (texts[i].textContent || "").match(/^\u2248 \d+ first passes \u00b7 (\d+) second pass/);
          if (m) return parseInt(m[1], 10) >= 2;
        }
        return false;
      } },
    { id: "ps-scope-down-refund",
      widget: "ps-matrix",
      goal: "Scope down the risky refund bot: add a lower-autonomy idea with \"refund\" in its name (for example \"Suggest refunds to agents\") and drag it into Quick wins.",
      hint: "A suggestion that a human approves is far less effort and risk than an autonomous bot, so place it low on effort and still high on impact.",
      success: "Starting at a lower rung of the autonomy ladder often turns a big bet into a quick win that builds trust.",
      check: function (w) {
        var segs = (document.getElementById("ps-readout").textContent || "").split(" · ");
        for (var i = 0; i < segs.length; i++) {
          if (segs[i].indexOf("Quick wins: ") === 0) {
            var names = segs[i].slice(12).split(", ");
            for (var j = 0; j < names.length; j++) {
              if (/refund/i.test(names[j]) && names[j] !== "Autonomous refund bot") return true;
            }
          }
        }
        return false;
      } },
    { id: "cm-review-all-wins",
      widget: "cm-cost",
      goal: "Keep cost per error at $15 and find a situation where reviewing everything is cheaper than both no review and flagged-only review.",
      hint: "Full review pays when error rate × cost per error × catch rate beats the review cost, and it also has to beat a good flagging setup.",
      success: "Full review wins only when errors are common or review is very cheap; otherwise targeted flags are cheaper.",
      check: function (w) {
        var t = document.getElementById("cm-readout").textContent || "";
        return t.indexOf("Cheapest: review everything") === 0 && +document.getElementById("cm-cpe").value === 15;
      } },
    { id: "pf-evals-ready",
      widget: "pf-score",
      goal: "Get the project to portfolio-ready (80 or more) with the Evals dimension at 100%.",
      hint: "Evals are worth 7 points; after ticking them, look at the readout's next best improvement.",
      success: "Visible evals are the most convincing part of a portfolio project, and they lift the score the most.",
      check: function (w) {
        var got = 0, tot = 0, evals = true;
        for (var i = 1; i <= 15; i++) {
          var c = document.getElementById("pf-c" + i);
          if (!c) return false;
          var wt = +c.getAttribute("data-w");
          tot += wt;
          if (c.checked) got += wt;
          else if (c.getAttribute("data-dim") === "Evals") evals = false;
        }
        return evals && tot > 0 && Math.round(got / tot * 100) >= 80;
      } }
  ]
};
