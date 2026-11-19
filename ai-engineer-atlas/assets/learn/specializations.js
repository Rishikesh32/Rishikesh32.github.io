window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["specializations"] = {
  quiz: {
    "computer-vision": [
      { q: "A predicted box is the same size as the ground-truth box but shifted so it covers exactly half of it. Why does it fail a 0.5 IoU threshold?",
        choices: [
          "IoU divides the overlap by the ground-truth area only, which gives exactly 0.5, and ties fail",
          "IoU only measures overlap along the horizontal axis, and the shift is horizontal",
          "IoU divides the overlap by the union of both boxes, so half the object gives about 50/150 = 0.33",
          "IoU multiplies the overlap by the prediction's confidence score, which pulls it below 0.5"
        ],
        answer: 2,
        why: "The union counts both boxes' areas minus the overlap, so a half-covering box of equal size scores only 0.33. Dividing by the ground-truth area alone would be recall-like coverage, not IoU." },
      { q: "Your detector reports the same car three times with heavily overlapping boxes. Which change to non-maximum suppression fixes that?",
        choices: [
          "Lower the NMS IoU threshold, so overlapping boxes get deleted sooner",
          "Raise the NMS IoU threshold, so only near-identical boxes are removed",
          "Raise the mAP matching threshold from 0.5 to 0.75",
          "Report top-5 accuracy instead of mAP"
        ],
        answer: 0,
        why: "NMS deletes boxes whose IoU with the kept box exceeds the threshold, so a lower threshold removes more duplicates. Go too low, though, and people standing close together get merged into one." },
      { q: "You must flag five fixed defect types in two million factory images a day, fast and cheaply. What does the page recommend?",
        choices: [
          "A vision-language model prompted on each image, because it is the most flexible",
          "CLIP zero-shot with a prompt per defect, because it needs no labels or boxes",
          "A ViT trained from scratch on your images, since it needs no pretraining",
          "A small trained detector, which is fast, cheap and precise for a fixed set of classes"
        ],
        answer: 3,
        why: "High-volume, fixed-class detection is where a small detector can be about 100× cheaper than a VLM, which is also weaker at exact localisation. ViTs need large-scale pretraining, and CLIP gives labels rather than boxes." }
    ],
    "speech": [
      { q: "Which number best predicts whether a voice agent feels responsive?",
        choices: [
          "The total time the LLM takes to generate its whole reply",
          "Voice-to-voice time to first audio: the sum of each stage's time to first output",
          "The word error rate of the speech recogniser",
          "The sample rate of the TTS audio"
        ],
        answer: 1,
        why: "The user hears silence until the first sound arrives, so what matters is endpoint wait + ASR + network + LLM first token + TTS first audio. Measuring full generation time is a common mistake when every stage can stream." },
      { q: "A 10-word reference is transcribed with 2 substitutions, 1 deletion and 3 insertions. What is the WER?",
        choices: [
          "30%, because insertions are not counted as errors",
          "50%, because you divide by the 12 words in the hypothesis",
          "60%, and insertions mean WER can even go above 100%",
          "Undefined, because WER cannot handle extra words"
        ],
        answer: 2,
        why: "WER = (S + D + I) / N = (2 + 1 + 3) / 10 = 60%, where N is the number of reference words. Because insertions count, a very chatty transcript can push WER past 100%." },
      { q: "The user starts talking halfway through the agent's spoken reply. You stop the TTS and cancel the LLM. What else must happen?",
        choices: [
          "Keep the full planned reply in the history so the LLM remembers what it meant to say",
          "Raise the endpoint silence so the user cannot interrupt next time",
          "Restart the ASR model to clear its audio buffer",
          "Drop the unspoken part of the reply from the conversation history"
        ],
        answer: 3,
        why: "The user never heard the cut-off text, so leaving it in history makes the LLM believe it said things it did not. Barge-in means stop speaking, cancel generation and trim the history to what was actually spoken." }
    ],
    "diffusion": [
      { q: "In the forward process, what does \\(\\bar\\alpha_t\\) tell you?",
        choices: [
          "The share of the clean image's signal variance still left at step \\(t\\)",
          "The amount of noise added in step \\(t\\) alone",
          "The learning rate the denoiser uses at step \\(t\\)",
          "The guidance scale applied at step \\(t\\)"
        ],
        answer: 0,
        why: "\\(\\bar\\alpha_t\\) is the product of \\((1-\\beta_s)\\) up to step \\(t\\): it starts near 1 and falls toward 0. The per-step noise is \\(\\beta_t\\), not \\(\\bar\\alpha_t\\)." },
      { q: "You raise the classifier-free guidance scale \\(w\\) from 5 to 15. What do you expect?",
        choices: [
          "More diverse images that follow the prompt more loosely",
          "Closer prompt adherence and less diversity, with burnt, oversaturated images if pushed too far",
          "The same images, but sampling takes three times as many steps",
          "No visible change, because \\(w\\) only matters during training"
        ],
        answer: 1,
        why: "CFG extrapolates from the unconditional toward the conditional prediction, and \\(w\\) sets how far. More guidance trades diversity for adherence and eventually burns the image. The number of steps does not change." },
      { q: "You generate one image per prompt and pick the prompt whose image looks better. What did you most likely forget?",
        choices: [
          "Switching from the linear to the cosine schedule",
          "Dropping the prompt 10% of the time while sampling",
          "Fixing the seed, so you may be judging the random starting noise rather than the prompt",
          "Running the diffusion in pixel space instead of latent space"
        ],
        answer: 2,
        why: "Each sample starts from random noise, so two prompts with different seeds differ for reasons unrelated to the prompt. Fix the seed (and ideally compare several) before drawing conclusions." }
    ],
    "recsys": [
      { q: "A user never clicked an item you showed in position 40. Why shouldn't you treat that as a confident dislike?",
        choices: [
          "Matrix factorization can only learn from positive ratings",
          "Negative labels make the two-tower loss undefined",
          "Unclicked items are always cold-start items with no vector yet",
          "They may never have looked at it, and top positions earn clicks just by being on top"
        ],
        answer: 3,
        why: "Implicit feedback is biased: a missing click may just mean the item went unseen, and position bias inflates clicks on top slots. Treating every unclicked impression as a hard negative teaches the model the wrong thing." },
      { q: "Why does the retrieval stage use a two-tower model instead of running the heavy ranker over all 10 million items?",
        choices: [
          "User and item vectors are computed separately, so item vectors can be precomputed into an ANN index and searched in milliseconds",
          "Two-tower models are more accurate than rankers on every metric",
          "The ranker can only use a single feature per item",
          "Two-tower models need no training data at all"
        ],
        answer: 0,
        why: "Keeping the towers separate means only the user vector is computed per request; the nearest items come from a prebuilt index. The expensive ranker then scores only about 1,000 candidates with hundreds of features." },
      { q: "Your new recommender beats the old one on a random 80/20 split of interactions. Why be suspicious?",
        choices: [
          "Random splits always underestimate accuracy",
          "A random split leaks future interactions into training; split by time instead",
          "NDCG cannot be computed on a random split",
          "An 80/20 split leaves too few items for recall@K"
        ],
        answer: 1,
        why: "With a random split the model trains on what users did later and is tested on what they did earlier, which it can never do in production. Split by time offline, and let an A/B test on retention decide." }
    ],
    "time-series": [
      { q: "Why does a centred moving average with a window of 12 isolate the trend in monthly data with a yearly cycle?",
        choices: [
          "A 12-point window removes all of the noise, leaving only the trend",
          "Every window covers one full cycle, so the seasonal ups and downs average out",
          "The window removes the trend and leaves the seasonal cycle behind",
          "Any window size works equally well; 12 is just a convention"
        ],
        answer: 1,
        why: "Averaging over exactly one period cancels the cycle, so what is left is the trend. Set the window off the period and part of the cycle leaks into the trend and residual." },
      { q: "You forecast daily sales 7 days ahead. Which feature leaks information you won't have at forecast time?",
        choices: [
          "The value 7 days before the target day",
          "The value 14 days before the target day",
          "Yesterday's value relative to the target day (lag 1)",
          "The day of the week of the target day"
        ],
        answer: 2,
        why: "When you forecast 7 days out, the day before the target is still in the future. Lags must be at least the horizon; calendar features like day of week are always known." },
      { q: "In backtests your deep forecasting model gets MASE = 1.3. What does that tell you?",
        choices: [
          "It beats the seasonal naive baseline by 30%",
          "MASE above 1 means the series contains zeros",
          "Nothing yet, since MASE only applies to daily data",
          "It is worse than seasonal naive, so the simple baseline should win"
        ],
        answer: 3,
        why: "MASE divides your error by seasonal naive's in-sample error, so below 1 beats the baseline and above 1 loses to it. Skipping the baseline and celebrating a deep model that does not beat it is a classic mistake." }
    ],
    "rl": [
      { q: "With \\(\\gamma = 0.9\\), about how much is a reward of 1 that arrives four steps from now worth today?",
        choices: [
          "0.66",
          "0.90",
          "0.36",
          "1.00, because rewards are only discounted at the end of an episode"
        ],
        answer: 0,
        why: "Each step multiplies by \\(\\gamma\\), so four steps give \\(0.9^4 \\approx 0.66\\). A lower \\(\\gamma\\) makes the agent more short-sighted." },
      { q: "\\(Q(s,a) = 0.2\\), \\(\\alpha = 0.5\\), \\(r = 0\\), \\(\\gamma = 0.9\\) and the best next-state value is 0.6. What is \\(Q(s,a)\\) after one update?",
        choices: [
          "0.54",
          "0.27",
          "0.47",
          "0.37"
        ],
        answer: 3,
        why: "The target is \\(0 + 0.9 \\times 0.6 = 0.54\\), the TD error is \\(0.54 - 0.2 = 0.34\\), and half of it is added: \\(0.2 + 0.17 = 0.37\\). 0.54 is the target, not the updated value." },
      { q: "In RLHF you remove the KL penalty and the reward climbs quickly. What is the likely result?",
        choices: [
          "A more accurate model, because nothing holds it back",
          "The model drifts into outputs the reward model likes but people don't, such as padded or garbled text",
          "Training stops, because PPO cannot run without a KL term",
          "The reward model retrains itself to keep up with the policy"
        ],
        answer: 1,
        why: "The KL penalty keeps the policy near the starting model. Without it the policy exploits the reward model's quirks, which is reward hacking: high scores without doing the task." }
    ]
  },
  challenges: [
    { id: "cv-strict-match",
      widget: "cv-iou",
      goal: "Set a strict COCO-style threshold of 0.75 or higher, then move or resize the orange prediction until it still counts as a true positive.",
      hint: "Union punishes any extra area, so the prediction must match the blue box's position and its size.",
      success: "At strict thresholds a match needs nearly the same box, which is why COCO averages mAP over IoU 0.5 to 0.95.",
      check: function (w) {
        var thr = parseFloat(document.getElementById("cv-iou-thr").value);
        var m = (document.getElementById("cv-iou-readout").textContent || "").match(/IoU (\d+\.\d+)/);
        if (!m) return false;
        var iou = parseFloat(m[1]);
        return thr >= 0.75 && iou >= thr;
      } },
    { id: "speech-sub-800",
      widget: "speech-latency",
      goal: "Get voice-to-voice latency to 800 ms or less without making the agent rude (endpoint silence at least 300 ms) and with a realistic LLM (first token at least 300 ms).",
      hint: "With endpoint and LLM fixed at 300 ms each, you have 200 ms left for ASR, network and TTS, and none of it for waiting on the full reply.",
      success: "Every stage adds to time to first audio, so a sub-second agent streams everything and trims each stage.",
      check: function (w) {
        function v(id) { return +document.getElementById(id).value; }
        if (document.getElementById("speech-wait").checked) return false;
        var total = v("speech-vad") + v("speech-asr") + v("speech-net") + v("speech-llm") + v("speech-tts");
        return v("speech-vad") >= 300 && v("speech-llm") >= 300 && total <= 800;
      } },
    { id: "diff-signal-survives",
      widget: "diff-noise",
      goal: "Find a step t of 600 or later where at least 30% of the signal variance still survives (ᾱ ≥ 0.30).",
      hint: "Look at both curves in the chart: one of the schedules has almost nothing left after step 400.",
      success: "The cosine schedule destroys signal evenly, so late steps still carry information instead of near-static.",
      check: function (w) {
        var t = parseInt(document.getElementById("diff-t").value, 10);
        var parts = (document.getElementById("diff-readout").textContent || "").split("·");
        if (parts.length < 2) return false;
        var ab = parseFloat(parts[1].split("=")[1]);
        return t >= 600 && ab >= 0.3;
      } },
    { id: "recsys-niche-top",
      widget: "recsys-2t",
      goal: "Make the short-vector niche item \"Robot comedy\" the number 1 recommendation.",
      hint: "Popular items have longer vectors; which score stops rewarding length and looks only at direction?",
      success: "Dot product favours long, popular item vectors; cosine scores direction only, which lets niche items win.",
      check: function (w) {
        var m = (document.getElementById("recsys-readout").textContent || "").match(/: (.+?) \(/);
        return !!m && m[1] === "Robot comedy";
      } },
    { id: "ts-drown-cycle",
      widget: "ts-decomp",
      goal: "Keep the MA window at the 12-month period and the season amplitude at 10 or more, and find how much noise it takes to push seasonal strength below 0.5.",
      hint: "Seasonal strength compares the cycle with the residual, so make the residual bigger.",
      success: "Seasonal strength measures the cycle against the noise, so even a correct decomposition can't find a cycle that is buried in noise.",
      check: function (w) {
        var win = parseInt(document.getElementById("ts-win").value, 10), amp = +document.getElementById("ts-amp").value;
        var m = (document.getElementById("ts-readout").textContent || "").match(/strength = (\d+\.\d+)/);
        return !!m && win === 12 && amp >= 10 && parseFloat(m[1]) < 0.5;
      } },
    { id: "rl-farsighted",
      widget: "rl-grid",
      goal: "The goal is 8 steps from start. Train the agent until the start square's value is above 0.85.",
      hint: "A reward k steps away is worth about γ^k, so with γ = 0.9 the start can never pass 0.9^7 ≈ 0.48.",
      success: "With γ near 1 a distant reward keeps most of its value (0.99^7 ≈ 0.93); a low γ makes the agent short-sighted.",
      check: function (w) {
        var texts = document.getElementById("rl-svg").querySelectorAll("text");
        for (var i = 0; i < texts.length; i++) {
          if (texts[i].getAttribute("x") === "16" && texts[i].getAttribute("y") === "296") {
            return parseFloat(texts[i].textContent) > 0.85;
          }
        }
        return false;
      } }
  ]
};
