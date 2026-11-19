window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["fine-tuning"] = {
  quiz: {
    "when-to-finetune": [
      { q: "Your support bot gives confident but wrong answers about pricing that changed this month. Which lever should you pull first?",
        choices: ["Fine-tune the model on the new pricing documents", "Retrieve the current pricing at query time (RAG)", "Run DPO on pairs of good and bad pricing answers", "Distil the bot into a smaller, faster model"],
        answer: 1,
        why: "This is a knowledge failure with facts that change often, which is RAG's job. Facts baked into weights cannot be cited or updated, and training on new facts can even increase hallucination." },
      { q: "A 40-category ticket classifier works well with a 2,500-token prompt on a big model, but it handles 2 million tickets a month. What does the page suggest?",
        choices: ["Add retrieval so the prompt can include more examples", "Shorten the prompt and accept lower accuracy", "LoRA-tune a small model with a short prompt to replace it", "Run RLHF so the big model answers more briefly"],
        answer: 2,
        why: "The task is stable, high-volume and already solved, so the failure is cost. A LoRA-tuned 3B model with a 150-token prompt can match it on one GPU instead of paying for billions of prompt tokens." },
      { q: "A team says its fine-tune beats the baseline by 10 points. What should you check first?",
        choices: ["Whether the baseline was a weak prompt rather than the best prompt on the strongest model", "Whether they used LoRA instead of full fine-tuning", "Whether the eval set had more than 100 examples", "Whether they also used RAG during evaluation"],
        answer: 0,
        why: "Prompting the strongest model you can afford sets the ceiling every fine-tune must beat. Comparing against a weak prompt is one of the most common ways to make a fine-tune look better than it is." }
    ],
    "sft": [
      { q: "Why do prompt tokens get label -100 in supervised fine-tuning?",
        choices: ["So the model cannot see them while predicting the answer", "So they still shape the context but are never prediction targets", "To make the training sequences shorter and faster", "Because -100 is the end-of-turn token in most templates"],
        answer: 1,
        why: "-100 is PyTorch cross-entropy's ignore_index: those positions are skipped in the loss, but the model still attends to them as context for the assistant tokens." },
      { q: "After SFT, your model answers well but keeps generating text past the end of its reply. What is the most likely cause?",
        choices: ["The learning rate was too low", "Too few training epochs", "The LoRA rank was too small", "The end-of-turn token was masked out of the labels"],
        answer: 3,
        why: "The model learns to stop only if the end-of-turn token is a training target. Mask it along with the prompt and the model never learns when to stop." },
      { q: "You trained 5 epochs on 300 examples. Which checkpoint should you ship?",
        choices: ["The one with the lowest training loss", "Always the last one, since it saw the most data", "The one that scores best on the task eval and a general-abilities slice", "The first one, because later ones always overfit"],
        answer: 2,
        why: "Loss is not your eval. The lowest-training-loss checkpoint is often overfitted, and only a task eval plus a before/after general eval tells you about quality and catastrophic forgetting." }
    ],
    "peft": [
      { q: "Why is LoRA's B matrix initialised to zero?",
        choices: ["So the adapted model starts exactly at the base model", "To halve the memory used by the adapter", "So that only A receives gradients during training", "To force the update to have a low rank"],
        answer: 0,
        why: "With B = 0 the update BA is zero, so step 0 is exactly the base model. Both A and B still receive gradients; the low rank comes from the shapes, not the initialisation." },
      { q: "What does QLoRA change compared with plain LoRA?",
        choices: ["It trains the adapter matrices in 4 bits", "It removes the frozen base model entirely", "It quantises only the gradients to save memory", "It stores the frozen base in 4-bit NF4 while the adapters train in bf16"],
        answer: 3,
        why: "With LoRA the frozen base dominates memory, so QLoRA stores it as NF4 (plus double quantisation and paged optimisers) and dequantises blocks to bf16 for each matmul. The adapters stay in bf16." },
      { q: "A colleague runs LoRA with learning rate 2e-5, the usual full fine-tuning value, and concludes that LoRA \"doesn't learn\". What is the likely fix?",
        choices: ["Raise the rank to 256 so it has more capacity", "Adapt only the q and v projections", "Use a learning rate about 10× higher, around 1e-4 to 2e-4", "Switch to full fine-tuning, since LoRA cannot learn this task"],
        answer: 2,
        why: "LoRA typically needs about 10× the full fine-tuning learning rate. Raising the rank or narrowing the targets to q and v does not fix an update that is simply too small." }
    ],
    "preference": [
      { q: "When is preference tuning a better fit than more SFT?",
        choices: ["When you have no data or feedback of any kind", "When good answers are hard to write but easy to judge", "When the model needs to learn new facts", "When you mainly want a smaller, cheaper model"],
        answer: 1,
        why: "SFT needs ideal answers to imitate. Preference tuning learns from judgements (\"A beats B\", \"this passed the tests\"), which are much easier to collect when perfect answers are hard to write." },
      { q: "You want a model to write SQL that returns the right rows from a test database. Which method fits best?",
        choices: ["DPO on thumbs-up/thumbs-down pairs from users", "KTO on unpaired good and bad labels", "GRPO with an execution-match reward (RLVR)", "Logit distillation from a bigger model"],
        answer: 2,
        why: "When a program can check the answer, reinforcement learning with verifiable rewards fits naturally: GRPO samples a group per prompt and rewards the completions whose results match." },
      { q: "In a GRPO run, most prompts are solved by every sampled completion. What happens?",
        choices: ["They give the strongest learning signal", "The KL penalty grows until training diverges", "The value network overfits to them", "They give zero advantage, so they teach nothing"],
        answer: 3,
        why: "Advantage is each reward minus the group mean. If every completion succeeds (or every one fails), all advantages are zero, which is why you aim for 20–80% solve rates. GRPO has no value network." }
    ],
    "distillation": [
      { q: "Why can a teacher's full probability distribution teach more than the correct answer alone?",
        choices: ["It is cheaper to store than the hard labels", "It shows which wrong answers are plausible and by how much", "It removes the need for a shared tokenizer", "It guarantees the student matches the teacher exactly"],
        answer: 1,
        why: "This is Hinton's \"dark knowledge\": a teacher giving Lyon 0.04 and \"located\" almost nothing tells the student how wrong answers relate. A hard label sets every alternative to zero." },
      { q: "You only have API access to a strong teacher: text comes back, but no logits. How can you distil it?",
        choices: ["Generate responses, verify and filter them, then run SFT on them", "Match softmax(z/T) with a KL loss at T = 2", "Run DPO with the teacher as the reference model", "You cannot distil a model without its weights"],
        answer: 0,
        why: "Sequence-level distillation works through text: generate, filter, then SFT on the outputs, as the distilled DeepSeek-R1 models did. Logit distillation needs the teacher's logits and a shared tokenizer. Check the terms of service first." },
      { q: "After training on 50k synthetic examples, your student scores suspiciously high on your eval set. What did you most likely skip?",
        choices: ["Raising the distillation temperature", "Mixing real data into the training set", "Decontaminating the synthetic data against the eval set", "Using a bigger student model"],
        answer: 2,
        why: "If eval items or close paraphrases leak into the generated training data, the score measures memory, not skill. Decontamination is a required filtering step in a synthetic data pipeline." }
    ],
    "tooling": [
      { q: "Roughly how much GPU memory does full fine-tuning of an 8B model need with mixed-precision Adam, before activations?",
        choices: ["About 16 GB", "About 32 GB", "About 128 GB", "About 1 TB"],
        answer: 2,
        why: "Full fine-tuning costs about 16 bytes per parameter (weights, gradients, fp32 master copy and two Adam moments), so 8B × 16 ≈ 128 GB. LoRA brings the frozen base down to about 2 bytes per parameter." },
      { q: "A LoRA run hits an out-of-memory error on a 24 GB card. What should you try first?",
        choices: ["Gradient checkpointing and a smaller micro-batch with gradient accumulation", "Raise the LoRA rank so training converges faster", "Increase max_length so fewer sequences are needed", "Switch to full fine-tuning, which is more memory-efficient"],
        answer: 0,
        why: "Activations scale with tokens per micro-batch. Gradient checkpointing trades about 30% more compute for much less memory, and gradient accumulation keeps the effective batch the same." },
      { q: "Your memory estimate covered weights, gradients and optimiser state, yet a 128k-vocabulary model still runs out of memory at 4,096 tokens. What did you likely forget?",
        choices: ["The tokenizer's vocabulary file", "The size of the saved LoRA adapter", "The chat template's special tokens", "The logits tensor, about 2 GB in fp32"],
        answer: 3,
        why: "4,096 tokens × 128k vocabulary entries × 4 bytes is about 2 GB for the logits alone, and it is one of the most commonly forgotten terms in a memory estimate." }
    ]
  },
  challenges: [
    { id: "ft-lever-ft-wins",
      widget: "when-to-finetune-demo",
      goal: "Build a scenario where <b>Fine-tune (SFT/RL)</b> is the best fit with a score of <b>9/10 or higher</b>.",
      hint: "Fine-tuning scores highest for stable behaviour problems with lots of examples, once the prompt has already been pushed hard.",
      success: "Fine-tuning earns its cost for stable behaviour failures, plenty of examples and a prompt that has already hit its ceiling.",
      check: function () {
        var f = document.getElementById("when-to-finetune-fail"), d = document.getElementById("when-to-finetune-data"),
            c = document.getElementById("when-to-finetune-change"), t = document.getElementById("when-to-finetune-tried");
        if (!f || !d || !c || !t) return false;
        var base = { knowledge: [4, 9, 1, 0], format: [7, 1, 6, 1], behaviour: [6, 1, 7, 1], capability: [3, 1, 4, 0], cost: [3, 1, 6, 8] }[f.value];
        if (!base) return false;
        var s = base.slice(), dv = +d.value;
        s[2] += [-4, -2, 0, 2][dv] || 0;
        if (dv === 0) s[3] -= 1;
        if (c.value === "often") { s[1] += 1; s[2] -= 1; }
        s[0] += t.checked ? -3 : 3;
        var best = 0;
        for (var i = 0; i < 4; i++) { s[i] = Math.max(0, Math.min(10, s[i])); if (s[i] > s[best]) best = i; }
        return best === 2 && s[2] >= 9;
      } },
    { id: "ft-mask-drowned",
      widget: "sft-mask",
      goal: "Turn masking off and find a prompt/answer mix where <b>less than 2%</b> of the loss teaches the answer.",
      hint: "Without masking, the answer's share is answer tokens divided by all tokens: think long retrieved context, short reply.",
      success: "Unmasked, a long RAG-style prompt swamps the answer, so the model spends almost all its training signal predicting the prompt.",
      check: function () {
        var p = document.getElementById("sft-mask-p"), a = document.getElementById("sft-mask-a"), m = document.getElementById("sft-mask-on");
        if (!p || !a || !m || m.checked) return false;
        var P = +p.value, A = +a.value;
        return A / (P + A) < 0.02;
      } },
    { id: "ft-lora-budget",
      widget: "peft-calc",
      goal: "On the Llama 3 8B shape with <b>all seven module types</b> adapted, find the <b>largest rank</b> that keeps trainable parameters under <b>25 million</b>.",
      hint: "Each adapted matrix adds r(d + k) parameters, so the total grows linearly with r: r = 16 gives about 42M.",
      success: "Parameters scale linearly with rank, so halving r from 16 to 8 halves the adapter to about 21M while still adapting every linear layer.",
      check: function () {
        var g = function (id) { return document.getElementById(id); };
        if (!g("peft-calc-rank") || !g("peft-calc-d")) return false;
        if (+g("peft-calc-d").value !== 4096 || +g("peft-calc-ff").value !== 14336 || +g("peft-calc-kv").value !== 1024 || +g("peft-calc-layers").value !== 32) return false;
        var mods = ["q", "k", "v", "o", "gate", "up", "down"];
        for (var i = 0; i < mods.length; i++) { var cb = g("peft-calc-m-" + mods[i]); if (!cb || !cb.checked) return false; }
        return [2, 4, 8, 16, 32, 64, 128, 256][+g("peft-calc-rank").value] === 8;
      } },
    { id: "ft-dpo-trap",
      widget: "preference-dpo",
      goal: "Get the DPO loss <b>below 0.1</b> while the chosen answer is <b>less likely</b> than under the reference (negative log-ratio).",
      hint: "The loss only sees the margin between chosen and rejected, so push the rejected answer down even further.",
      success: "DPO optimises the margin, not the chosen answer's probability: both can fall while the loss looks great, so track both rewards.",
      check: function () {
        var c = document.getElementById("preference-dpo-c"), r = document.getElementById("preference-dpo-r"), b = document.getElementById("preference-dpo-b");
        if (!c || !r || !b) return false;
        var lc = +c.value, lr = +r.value, beta = +b.value, x = -beta * (lc - lr);
        var loss = x > 30 ? x : Math.log(1 + Math.exp(x));
        return lc < 0 && loss < 0.1;
      } },
    { id: "ft-distil-half",
      widget: "distillation-temp",
      goal: "Find the <b>lowest temperature</b> at which the teacher puts <b>more than half</b> its probability on tokens other than \"Paris\".",
      hint: "Dividing logits by a larger T shrinks the gaps between them; watch the non-top share in the readout as you step up.",
      success: "At T = 3 the alternatives hold over half the mass: higher temperature exposes the dark knowledge the student learns from.",
      check: function () {
        var t = document.getElementById("distillation-temp-t");
        if (!t) return false;
        var T = +t.value, z = [9.0, 5.8, 5.2, 4.6, 4.4, 3.0], s = 0;
        for (var i = 0; i < z.length; i++) s += Math.exp((z[i] - 9) / T);
        return 1 - 1 / s > 0.5 && T <= 3;
      } },
    { id: "ft-70b-48gb",
      widget: "tooling-mem",
      goal: "Fit QLoRA on the <b>70B</b> model onto <b>a 48 GB card</b>, like the QLoRA paper's single-GPU run.",
      hint: "The 4-bit weights and adapter state are fixed; the activations and logits shrink with tokens per micro-batch.",
      success: "NF4 weights get a 70B model close to 48 GB, and a shorter micro-batch (with gradient accumulation) trims activations the rest of the way.",
      check: function () {
        var sel = document.getElementById("tooling-mem-model"), out = document.getElementById("tooling-mem-readout");
        if (!sel || !out || sel.value !== "70") return false;
        return /QLoRA fits a (24|48) GB card/.test(out.textContent);
      } }
  ]
};
