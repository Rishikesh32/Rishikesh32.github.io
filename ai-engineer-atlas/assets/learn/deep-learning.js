window.ATLAS_LEARN = window.ATLAS_LEARN || {};
window.ATLAS_LEARN["deep-learning"] = {
  quiz: {
    "neural-nets": [
      { q: "Why does a neural network need nonlinear activation functions between its layers?",
        choices: ["They keep the weights small during training", "They turn the outputs into probabilities", "Without them, any stack of linear layers collapses into a single linear map", "They make matrix multiplies faster on GPUs"],
        answer: 2,
        why: "\\(W_2 W_1 x\\) is just one matrix times \\(x\\), so without a nonlinearity depth buys nothing. Activations let layers build features out of features." },
      { q: "A dense layer maps 512 inputs to 256 outputs. How many parameters does it have?",
        choices: ["131,072", "131,328", "768", "262,144"],
        answer: 1,
        why: "Inputs × outputs + outputs: \\(512 \\cdot 256 + 256 = 131{,}328\\). The extra 256 are the biases, which are easy to forget." },
      { q: "A ReLU neuron's pre-activation \\(z\\) is negative for every training example. What happens to it?",
        choices: ["It outputs negative values that slow training down", "Its gradient explodes on the next update", "It saturates at 1 like a sigmoid", "It outputs 0 with slope 0, so no gradient reaches its weights and it stops learning"],
        answer: 3,
        why: "For \\(z < 0\\), ReLU's output and slope are both exactly 0, so backprop passes nothing to that neuron's weights. This is a \"dead\" ReLU, one reason for smooth variants like GELU." }
    ],
    "backprop": [
      { q: "In the backward pass, what gradient does a multiply node \\(u = x \\cdot w\\) send to \\(w\\)?",
        choices: ["The upstream gradient times \\(x\\)", "The upstream gradient, unchanged", "The upstream gradient times \\(w\\)", "Zero, because multiply nodes block gradients"],
        answer: 0,
        why: "\\(\\partial u / \\partial w = x\\), so the multiply node swaps in the other input: \\(\\partial L/\\partial w = \\partial L/\\partial u \\cdot x\\). That is why the gradient for \\(w\\) scales with \\(x\\)." },
      { q: "A 20-layer network uses sigmoid activations, whose slope is at most 0.25. Why do the early layers barely learn?",
        choices: ["Sigmoids store too many activations", "The gradient is a product of many local slopes below 1, so it shrinks towards zero on the way back", "The learning rate is applied once per layer and adds up", "Early layers have fewer parameters"],
        answer: 1,
        why: "Backprop multiplies local slopes along the chain. Twenty factors of 0.25 or less make the product tiny, so gradients vanish. ReLU-family activations, normalization and residual connections keep that product near 1." },
      { q: "Your PyTorch training loss swings wildly and each update seems bigger than the last. You never call <code>optimizer.zero_grad()</code>. Why?",
        choices: ["<code>backward()</code> resets gradients to random values", "The optimizer skips every other step", "Gradients accumulate by default, so each step uses the sum of all past gradients", "Autograd reuses stale activations from the first batch"],
        answer: 2,
        why: "PyTorch adds new gradients to <code>.grad</code> rather than replacing them. Without zeroing, every step pushes along the running total, so updates keep growing." }
    ],
    "pytorch": [
      { q: "<code>preds</code> has shape (32, 1) and <code>targets</code> has shape (32,). What shape does <code>preds - targets</code> produce?",
        choices: ["(32,)", "(32, 1)", "An error, because the shapes differ", "(32, 32)"],
        answer: 3,
        why: "Aligned from the right, (32, 1) meets (1, 32): both size-1 dimensions stretch, giving a (32, 32) matrix. A loss averaged over it is silently wrong, the classic broadcasting bug." },
      { q: "Which sequence is a correct training step?",
        choices: ["<code>loss = loss_fn(model(x), y)</code>, then <code>loss.backward()</code>, <code>optimizer.step()</code>, <code>optimizer.zero_grad()</code>", "<code>optimizer.step()</code>, then <code>loss = loss_fn(model(x), y)</code>, <code>loss.backward()</code>", "<code>loss.backward()</code>, then <code>loss = loss_fn(model(x), y)</code>, <code>optimizer.step()</code>", "<code>optimizer.zero_grad()</code>, then <code>optimizer.step()</code>, <code>loss.backward()</code>"],
        answer: 0,
        why: "You need the loss before you can backpropagate it, and gradients before the optimizer can step. Zeroing can go first or last, as long as it happens every step." },
      { q: "Evaluating the same trained model on the same validation set gives a slightly different accuracy each time. What is the most likely cause?",
        choices: ["You forgot <code>torch.no_grad()</code>", "The model is still in train mode, so dropout is active", "The learning rate is too low", "You saved the model with <code>state_dict()</code>"],
        answer: 1,
        why: "In train mode, dropout randomly zeroes activations and batch norm uses batch statistics. Call <code>model.eval()</code>. <code>torch.no_grad()</code> saves memory but does not change the outputs." }
    ],
    "architectures": [
      { q: "A 3×3 conv layer from 64 to 128 channels has 73,856 parameters on 224×224 images. How many does it have on 512×512 images?",
        choices: ["About 5× more, matching the larger area", "It depends on the stride", "Still 73,856, because the same kernel is shared across every position", "Half as many, because of padding"],
        answer: 2,
        why: "Parameters are \\(k^2 C_{in} C_{out} + C_{out}\\), with no term for image size. Weight sharing is what makes convolutions so much cheaper than dense layers." },
      { q: "A 64×64 input goes through a conv with kernel 4, padding 1 and stride 2. What is the output size?",
        choices: ["31×31", "33×33", "64×64", "32×32"],
        answer: 3,
        why: "\\((n + 2p - k)/s + 1 = (64 + 2 - 4)/2 + 1 = 32\\). Compute this before building, because a wrong size only shows up later as a shape error." },
      { q: "What was the main reason transformers replaced RNNs for long text?",
        choices: ["RNNs must finish step \\(t-1\\) before step \\(t\\), so they can't parallelize across a sequence", "RNNs have far more parameters than transformers", "RNNs can't accept inputs of varying length", "RNNs need convolutions to read text"],
        answer: 0,
        why: "An RNN carries its hidden state one step at a time, so step 1000 waits for step 999, and gradients vanish over long chains. Attention processes all positions in parallel." }
    ],
    "training": [
      { q: "A fine-tune with AdamW at 3e-4 and no warmup hits NaN loss within the first 50 steps. What should you try first?",
        choices: ["Add dropout", "Increase the batch size 10×", "Add warmup, and lower the peak learning rate if that is not enough", "Turn off weight decay"],
        answer: 2,
        why: "Early on, Adam's statistics are noisy and the weights are untuned, so full-size steps can blow the run up. Warmup ramps the rate from near 0. The learning rate is the first knob to check." },
      { q: "Before a long run, you try to overfit a single batch, but the loss will not go near zero. What does that tell you?",
        choices: ["You need more training data", "There is probably a bug in labels, the loss or shapes, not a hyperparameter problem", "You should add regularization", "The model is too large for one batch"],
        answer: 1,
        why: "Any working model and loss can memorize one batch. If it can't, look at the code (mismatched labels, wrong loss input, a bad reshape) before tuning anything." },
      { q: "What does AdamW change compared with Adam plus an L2 penalty?",
        choices: ["It removes the squared-gradient average", "It adds momentum, which Adam lacks", "It builds a cosine schedule into the optimizer", "It decouples weight decay from Adam's per-parameter step scaling"],
        answer: 3,
        why: "In Adam with L2, the decay term is divided by the adaptive scaling like any other gradient. AdamW applies decay directly to the weights, which is why it is the transformer default." }
    ],
    "hardware": [
      { q: "Roughly how much memory do the training states (weights, gradients, optimizer) take for full AdamW mixed-precision training of an 8B model?",
        choices: ["16 GB", "32 GB", "64 GB", "128 GB"],
        answer: 3,
        why: "About 16 bytes per parameter: bf16 weights and gradients (2 + 2), an fp32 master copy (4) and Adam's two fp32 moments (4 + 4). \\(8\\text{B} \\times 16 = 128\\) GB, before activations." },
      { q: "About how many FLOPs does it take to train a 1B-parameter model on 100B tokens?",
        choices: ["\\(6 \\times 10^{20}\\)", "\\(2 \\times 10^{20}\\)", "\\(6 \\times 10^{22}\\)", "\\(1 \\times 10^{20}\\)"],
        answer: 0,
        why: "\\(C \\approx 6ND = 6 \\cdot 10^9 \\cdot 10^{11} = 6 \\times 10^{20}\\). That is 2 FLOPs per parameter per token forward and 4 backward; \\(2ND\\) is the forward pass only." },
      { q: "Full training doesn't fit on one GPU, so you move to 8 GPUs with plain DDP. Does memory per GPU drop?",
        choices: ["Yes, by 8×", "No: DDP keeps a full copy of weights, gradients and optimizer state on every GPU, so shard with FSDP or ZeRO", "Yes, by about 2×, because gradients are split", "Only the activation memory is replicated"],
        answer: 1,
        why: "Data parallelism replicates everything and only splits the batch. FSDP / ZeRO-3 shards the states, so per-GPU memory falls roughly as 1/N." }
    ]
  },
  challenges: [
    { id: "nn-dead-relu",
      widget: "nn-demo",
      goal: "Kill the neuron: with ReLU, keep both inputs positive but make the slope exactly 0, so no gradient flows back.",
      hint: "The inputs are positive, so push \\(z\\) below zero with the weights or the bias.",
      success: "A ReLU with \\(z < 0\\) outputs 0 and passes zero gradient, so its weights stop learning; that is a dead ReLU.",
      check: function (w) {
        function v(id) { return parseFloat(document.getElementById(id).value); }
        if (document.getElementById("nn-act").value !== "relu") return false;
        var x1 = v("nn-x1"), x2 = v("nn-x2");
        return x1 > 0 && x2 > 0 && v("nn-w1") * x1 + v("nn-w2") * x2 + v("nn-b") < 0;
      } },
    { id: "bp-flip-gradient",
      widget: "bp-demo",
      goal: "Make backprop say that increasing \\(w\\) would raise the loss: get \\(\\partial L/\\partial w\\) positive and step backward until it is shown.",
      hint: "With \\(y = 1\\), \\(\\partial L/\\partial z\\) is always negative, and the multiply node hands \\(w\\) that gradient times one particular input.",
      success: "The multiply node sends \\(w\\) the upstream gradient times \\(x\\), so flipping the sign of \\(x\\) flips the sign of \\(\\partial L/\\partial w\\).",
      check: function (w) {
        var m = document.getElementById("bp-readout").textContent.match(/step (\d+)\//);
        return !!(m && parseInt(m[1], 10) >= 8 && parseFloat(document.getElementById("bp-x").value) < 0);
      } },
    { id: "pt-silent-blowup",
      widget: "pt-demo",
      goal: "Find a pair of shapes that broadcasts without an error into a result bigger than both inputs, without using A = (32, 1).",
      hint: "Look for a shape with a size-1 dimension and line it up from the right against a shape with a different number of dimensions.",
      success: "Size-1 and missing dimensions stretch silently, so a shape mismatch can grow a tensor instead of raising an error.",
      check: function (w) {
        if (document.getElementById("pt-a").value === "32,1") return false;
        return /bigger than both inputs/.test(document.getElementById("pt-readout").textContent);
      } },
    { id: "cv-bottom-edge",
      widget: "cv-demo",
      goal: "With the horizontal-edge kernel (Sobel y), find a window whose output is −4, the strongest negative response.",
      hint: "Sobel y has negative weights on its top row and positive on its bottom row: where is bright above and dark below?",
      success: "An edge detector's sign tells you the direction of the edge; Sobel y goes negative on the square's bottom edge, where bright turns to dark.",
      check: function (w) {
        if (document.getElementById("cv-k").value !== "sobely") return false;
        var m = document.getElementById("cv-readout").textContent.match(/= (-?\d+\.\d\d)\s+·/);
        return !!(m && parseFloat(m[1]) <= -3.99);
      } },
    { id: "lr-cosine-half",
      widget: "lr-demo",
      goal: "With warmup + cosine and a floor of 0.2 or less, move the step marker to where the learning rate has decayed to half of its peak (within ±5%).",
      hint: "Cosine stays near the peak for a long time after warmup, so the halfway point comes later than you might guess.",
      success: "Cosine decay lingers near the peak and then drops quickly, reaching half the peak a bit after the middle of the run.",
      check: function (w) {
        function v(id) { return parseFloat(document.getElementById(id).value); }
        if (document.getElementById("lr-type").value !== "cosine") return false;
        var T = 10000, warm = v("lr-warm"), lo = v("lr-min"), t = Math.min(v("lr-t"), T - 1), Tw = Math.round(T * warm / 100);
        if (lo > 0.2 || t < Tw) return false;
        var p = (t - Tw) / Math.max(1, T - Tw), ratio = lo + 0.5 * (1 - lo) * (1 + Math.cos(Math.PI * p));
        return ratio >= 0.45 && ratio <= 0.55;
      } },
    { id: "mem-70b-full",
      widget: "mem-demo",
      goal: "Make full AdamW training of a 70B model fit on 80 GB GPUs with headroom, using as few GPUs as possible.",
      hint: "70B × 16 bytes is about 1,120 GB of states; only one split option makes that number fall as you add GPUs.",
      success: "Sharding (FSDP / ZeRO-3) divides training states by the GPU count, while DDP replication never shrinks them.",
      check: function (w) {
        var P = [0.5, 1, 3, 7, 13, 34, 70, 180, 405], G = [1, 2, 4, 8, 16, 32, 64];
        var Nb = P[parseInt(document.getElementById("mem-p").value, 10)], n = G[parseInt(document.getElementById("mem-n").value, 10)];
        return Nb === 70 && document.getElementById("mem-mode").value === "full" && document.getElementById("mem-gpu").value === "80" &&
          document.getElementById("mem-shard").value === "shard" && n === 16;
      } }
  ]
};
