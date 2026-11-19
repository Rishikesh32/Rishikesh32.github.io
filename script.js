(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  /* ================================================================
     Text scramble ("decoding" effect)
     ================================================================ */
  const GLYPHS = "01<>/\\{}[]#$%&*+=ABCDEFXYZ";
  function scramble(el, finalText, duration = 900) {
    return new Promise((resolve) => {
      if (reduce) { el.textContent = finalText; return resolve(); }
      const start = performance.now();
      const len = finalText.length;
      function frame(now) {
        const p = Math.min(1, (now - start) / duration);
        const revealed = Math.floor(p * len);
        let out = "";
        for (let i = 0; i < len; i++) {
          const ch = finalText[i];
          out += i < revealed || ch === " " ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        el.textContent = out;
        if (p < 1) requestAnimationFrame(frame);
        else resolve();
      }
      requestAnimationFrame(frame);
    });
  }

  /* ================================================================
     Boot loader (shown once per browser session)
     ================================================================ */
  const BOOT_LOG = [
    "spawning supervisor agent",
    "registering 18 MCP tools",
    "loading memory + knowledge graph",
    "running eval suite: 214/214 passed",
    "ready.",
  ];
  function runLoader() {
    return new Promise((resolve) => {
      const loader = $("#loader");
      if (!loader) return resolve();
      let seen = false;
      try { seen = sessionStorage.getItem("booted") === "1"; sessionStorage.setItem("booted", "1"); } catch (_) {}
      if (reduce || seen) { loader.remove(); return resolve(); }

      const bar = $("#loader-bar"), pctEl = $("#loader-pct"), log = $("#loader-log");
      let pct = 0, line = 0;
      const iv = setInterval(() => {
        pct = Math.min(100, pct + Math.random() * 9 + 4);
        bar.style.width = pct + "%";
        pctEl.textContent = Math.floor(pct);
        const want = Math.floor((pct / 100) * (BOOT_LOG.length - 1));
        while (line <= want) {
          const p = document.createElement("p");
          p.textContent = "> " + BOOT_LOG[line++];
          log.appendChild(p);
        }
        if (pct >= 100) {
          clearInterval(iv);
          setTimeout(() => {
            loader.classList.add("done");
            setTimeout(() => loader.remove(), 700);
            resolve();
          }, 280);
        }
      }, 75);
    });
  }

  /* ================================================================
     Hero intro
     ================================================================ */
  const ROLES = ["Agentic AI Architect", "AI Solutions Architect", "Multi-Agent Systems Designer", "MCP & Tooling Architect", "Senior Data Scientist"]; // EDIT

  function rotateRoles() {
    const el = $("#role");
    if (!el || reduce) return;
    let i = 0;
    setInterval(() => {
      i = (i + 1) % ROLES.length;
      scramble(el, ROLES[i], 650);
    }, 3200);
  }

  function countUp() {
    $$("[data-count]").forEach((el) => {
      const target = parseFloat(el.dataset.count);
      if (reduce) { el.textContent = target; return; }
      const start = performance.now(), dur = 1600;
      (function frame(now) {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString();
        if (p < 1) requestAnimationFrame(frame);
      })(start);
    });
  }

  async function heroIntro() {
    const introEls = $$("[data-intro]");
    const nameLines = $$("[data-scramble]");
    window.neuralBG && window.neuralBG.to(0, heroX(), isMobile() ? 0.55 : 1, 2.4, heroY());

    if (hasGSAP && !reduce) {
      gsap.set(introEls, { opacity: 0, y: 24 });
      document.documentElement.classList.remove("intro-pending");
      gsap.to(introEls, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, delay: 0.15 });
    }
    document.documentElement.classList.remove("intro-pending");
    for (const el of nameLines) {
      await scramble(el, el.dataset.scramble, 700);
    }
    countUp();
    rotateRoles();
  }

  /* ================================================================
     Background shape per section
     ================================================================ */
  const isMobile = () => window.innerWidth < 960;
  const heroX = () => (isMobile() ? 0 : 2.3);
  const heroY = () => (isMobile() ? -2.6 : 0); // on phones the core sits below the text

  function sectionShapes() {
    if (!hasGSAP || !window.neuralBG) return;
    $$("[data-shape]").forEach((sec) => {
      const apply = () => {
        const shape = parseFloat(sec.dataset.shape);
        let x = parseFloat(sec.dataset.x || "0");
        let alpha = parseFloat(sec.dataset.alpha || "1");
        let y = 0;
        if (isMobile()) { x = 0; alpha *= sec.id === "top" ? 0.55 : 0.5; y = sec.id === "top" ? -2.6 : 0; }
        window.neuralBG.to(shape, x, alpha, 1.8, y);
      };
      ScrollTrigger.create({ trigger: sec, start: "top 55%", end: "bottom 55%", onEnter: apply, onEnterBack: apply });
    });
  }

  /* ================================================================
     Scroll reveals + timeline
     ================================================================ */
  function reveals() {
    if (!hasGSAP || reduce) {
      $$(".tl-item").forEach((el) => el.classList.add("active"));
      return;
    }
    $$("[data-reveal]").forEach((el) => {
      gsap.from(el, { y: 22, opacity: 0, duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 98%" } });
    });
    $$("[data-stagger]").forEach((group) => {
      gsap.from(group.children, {
        y: 26, opacity: 0, duration: 0.7, ease: "power2.out", stagger: 0.06,
        scrollTrigger: { trigger: group, start: "top 98%" },
      });
    });
    gsap.fromTo(".tl-fill", { scaleY: 0 }, {
      scaleY: 1, ease: "none",
      scrollTrigger: { trigger: ".timeline", start: "top 65%", end: "bottom 65%", scrub: true },
    });
    $$(".tl-item").forEach((item) => {
      ScrollTrigger.create({ trigger: item, start: "top 65%", onEnter: () => item.classList.add("active"), onLeaveBack: () => item.classList.remove("active") });
      gsap.from(item.querySelector(".tl-card"), { y: 22, opacity: 0, duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: item, start: "top 98%" } });
    });
  }

  /* ================================================================
     Cursor, spotlight, card tilt
     ================================================================ */
  function pointerFX() {
    const root = document.documentElement;
    const spot = $(".spotlight");
    if (spot && finePointer) {
      window.addEventListener("pointermove", (e) => {
        spot.style.transform = "translate3d(" + e.clientX + "px, " + e.clientY + "px, 0)";
      }, { passive: true });
    }

    if (finePointer && !reduce) {
      document.body.classList.add("has-cursor");
      const dot = $(".cursor-dot"), ring = $(".cursor-ring");
      let x = -100, y = -100, rx = -100, ry = -100;
      window.addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
      (function loop() {
        rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
        dot.style.transform = `translate(${x}px, ${y}px)`;
        ring.style.transform = `translate(${rx}px, ${ry}px)`;
        requestAnimationFrame(loop);
      })();
      document.addEventListener("pointerover", (e) => {
        ring.classList.toggle("grow", !!e.target.closest("a, button, .card, input"));
      });
    }

    if (finePointer && !reduce) {
      $$(".card").forEach((card) => {
        card.addEventListener("pointermove", (e) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
          card.style.setProperty("--x", px * 100 + "%");
          card.style.setProperty("--y", py * 100 + "%");
          card.style.transition = "transform .15s ease-out, border-color .3s";
          card.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 7}deg) rotateY(${(px - 0.5) * 9}deg) translateY(-4px)`;
        });
        card.addEventListener("pointerleave", () => { card.style.transition = ""; card.style.transform = ""; });
      });
    }
  }

  /* ================================================================
     Nav
     ================================================================ */
  function nav() {
    const navEl = $("#nav"), btn = $("#menu-btn"), links = $("#nav-links");
    const onScroll = () => navEl.classList.toggle("scrolled", window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", open);
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      links.classList.toggle("open", open);
    });
    links.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        btn.setAttribute("aria-expanded", "false");
        btn.setAttribute("aria-label", "Open menu");
        links.classList.remove("open");
      }
    });
  }

  /* ================================================================
     HUD live numbers
     ================================================================ */
  function hud() {
    const lossEl = $("#hud-loss"), spark = $("#hud-spark"), tps = $("#hud-tps"),
      lat = $("#hud-lat"), meter = $("#hud-meter"), temp = $("#hud-temp");
    if (!lossEl) return;
    let loss = 0.214;
    const hist = Array.from({ length: 30 }, (_, i) => 0.6 - i * 0.012 + Math.random() * 0.03);
    function update() {
      loss = Math.max(0.0121, loss * (0.97 + Math.random() * 0.025));
      hist.push(loss); hist.shift();
      lossEl.textContent = loss.toFixed(4);
      const max = Math.max(...hist), min = Math.min(...hist);
      spark.setAttribute("d", hist.map((v, i) => `${i ? "L" : "M"}${(i / (hist.length - 1)) * 120},${34 - ((v - min) / (max - min || 1)) * 32}`).join(""));
      const t = 120 + Math.random() * 60;
      tps.textContent = Math.round(t);
      lat.textContent = Math.round(28 + Math.random() * 22) + "ms";
      meter.style.width = (t / 180) * 100 + "%";
      temp.textContent = (0.6 + Math.random() * 0.2).toFixed(2);
    }
    update();
    if (!reduce) setInterval(update, 1100);
  }

  /* ================================================================
     Skills as a neural network (canvas)
     EDIT: your skills, layer by layer
     ================================================================ */
  const SKILL_LAYERS = [
    { title: "design", nodes: ["AI system design", "Python", "Pydantic", "FastAPI", "ML & forecasting"] },
    { title: "models", nodes: ["Frontier LLMs", "Open-weight LLMs", "Model routing", "Fine-tuning (LoRA)", "Multimodal & vision", "Speech AI"] },
    { title: "knowledge", nodes: ["RAG & GraphRAG", "Hybrid search", "Vector databases", "Agent memory", "Context engineering"] },
    { title: "agents", nodes: ["LangGraph", "Multi-agent systems", "MCP servers", "A2A protocol", "Agent SDKs", "Human-in-the-loop"] },
    { title: "llmops", nodes: ["LLM evals", "Observability", "Guardrails", "vLLM serving", "Kubernetes", "Bedrock / Vertex"] },
    { title: "output", nodes: ["Agentic platforms"] },
  ];
  const isLight = () => document.documentElement.getAttribute("data-theme") === "light";
  const PALETTES = {
    dark: { layers: ["#22d3ee", "#38bdf8", "#60a5fa", "#8b5cf6", "#c084fc", "#f472b6"], edge: "rgba(139,92,246,0.09)", edgeHot: "rgba(167,139,250,0.65)",
            nodeFill: "#0a0c1d", labelBg: "rgba(8,10,24,0.85)", label: "rgba(222,226,255,0.82)", labelHot: "#ffffff", spark: "#ffffff" },
    light: { layers: ["#C2541B", "#B5671F", "#A8781F", "#9A3B5C", "#7E4A86", "#1F7A72"], edge: "rgba(43,34,25,0.10)", edgeHot: "rgba(194,84,27,0.6)",
            nodeFill: "#FFFBF4", labelBg: "rgba(255,251,244,0.92)", label: "rgba(43,34,25,0.78)", labelHot: "#2B2219", spark: "#FFFBF4" }
  };
  const pal = () => (isLight() ? PALETTES.light : PALETTES.dark);
  const LAYER_COLORS = new Proxy([], { get: (_, k) => pal().layers[k] });

  function skillsNetwork() {
    const canvas = $("#skills-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, nodes = [], edges = [], pulses = [], hover = null, visible = false, spawn = 0, last = 0;

    function layout() {
      const box = canvas.parentElement.getBoundingClientRect();
      if (!box.width) return;
      W = box.width - 36;
      H = Math.max(440, Math.min(540, W * 0.48));
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      nodes = [];
      const padL = 24, padR = 150, n = SKILL_LAYERS.length;
      SKILL_LAYERS.forEach((layer, li) => {
        const x = padL + ((W - padL - padR) * li) / (n - 1);
        const top = 80, bottom = H - 34, c = layer.nodes.length;
        layer.nodes.forEach((label, ni) => {
          const y = c === 1 ? (top + bottom) / 2 : top + ((bottom - top) * ni) / (c - 1);
          nodes.push({ x, y, label, layer: li, act: 0 });
        });
      });
      edges = [];
      nodes.forEach((a) => nodes.forEach((b) => { if (b.layer === a.layer + 1) edges.push({ a, b }); }));
    }

    function fire(a) {
      if (a.layer >= SKILL_LAYERS.length - 1 || pulses.length > 70) return;
      const next = nodes.filter((n) => n.layer === a.layer + 1);
      const b = next[(Math.random() * next.length) | 0];
      pulses.push({ a, b, t: 0, speed: 0.8 + Math.random() * 0.7 });
      a.act = 1;
    }

    function update(dt) {
      spawn -= dt;
      if (spawn <= 0) {
        spawn = 0.16 + Math.random() * 0.22;
        const inputs = nodes.filter((n) => n.layer === 0);
        fire(inputs[(Math.random() * inputs.length) | 0]);
      }
      const done = [];
      pulses.forEach((p) => { p.t += dt * p.speed; if (p.t >= 1) done.push(p); });
      pulses = pulses.filter((p) => p.t < 1);
      done.forEach((p) => {
        p.b.act = 1;
        if (Math.random() < 0.9) fire(p.b);
        if (Math.random() < 0.25) fire(p.b);
      });
      nodes.forEach((n) => (n.act = Math.max(0, n.act - dt * 1.4)));
    }

    function roundRect(x, y, w, h, r) {
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
      else ctx.rect(x, y, w, h);
    }

    function draw() {
      if (!nodes.length) return;
      ctx.clearRect(0, 0, W, H);
      // layer titles
      ctx.font = '500 11px "JetBrains Mono", monospace';
      ctx.textBaseline = "middle";
      SKILL_LAYERS.forEach((L, li) => {
        const nd = nodes.find((n) => n.layer === li);
        ctx.fillStyle = LAYER_COLORS[li];
        ctx.globalAlpha = 0.85;
        ctx.fillText("layer[" + li + "] " + L.title, nd.x - 6, 30);
        ctx.globalAlpha = 1;
      });
      // edges
      edges.forEach(({ a, b }) => {
        const hl = hover && (a === hover || b === hover);
        ctx.strokeStyle = hl ? pal().edgeHot : pal().edge;
        ctx.lineWidth = hl ? 1.4 : 1;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      });
      // pulses
      pulses.forEach((p) => {
        const x = p.a.x + (p.b.x - p.a.x) * p.t, y = p.a.y + (p.b.y - p.a.y) * p.t;
        const col = LAYER_COLORS[p.a.layer];
        const g = ctx.createRadialGradient(x, y, 0, x, y, 12);
        g.addColorStop(0, col); g.addColorStop(1, "transparent");
        ctx.fillStyle = g; ctx.globalAlpha = 0.55;
        ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1; ctx.fillStyle = pal().spark;
        ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
      });
      // nodes + labels
      nodes.forEach((n) => {
        const col = LAYER_COLORS[n.layer];
        const isHover = n === hover;
        const r = 7 + n.act * 3 + (isHover ? 3 : 0);
        if (n.act > 0.05 || isHover) {
          ctx.globalAlpha = isHover ? 0.35 : n.act * 0.3;
          ctx.fillStyle = col;
          ctx.beginPath(); ctx.arc(n.x, n.y, r + 7, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 1;
        }
        ctx.fillStyle = pal().nodeFill; ctx.strokeStyle = col; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = col; ctx.globalAlpha = 0.35 + n.act * 0.65;
        ctx.beginPath(); ctx.arc(n.x, n.y, r - 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;

        ctx.font = (isHover ? "600 " : "500 ") + '14px "Space Grotesk", sans-serif';
        const tw = ctx.measureText(n.label).width;
        const lx = n.x + 16, ly = n.y;
        ctx.fillStyle = pal().labelBg;
        roundRect(lx - 6, ly - 12, tw + 14, 24, 7); ctx.fill();
        if (isHover || n.act > 0.4) { ctx.strokeStyle = col; ctx.globalAlpha = isHover ? 0.9 : n.act * 0.6; ctx.lineWidth = 1; ctx.stroke(); ctx.globalAlpha = 1; }
        ctx.fillStyle = isHover || n.act > 0.5 ? pal().labelHot : pal().label;
        ctx.fillText(n.label, lx + 1, ly + 1);
      });
    }

    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      if (visible) { update(dt); draw(); }
      requestAnimationFrame(frame);
    }

    canvas.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      let found = null;
      for (const n of nodes) {
        if (Math.hypot(n.x - x, n.y - y) < 16 || (x > n.x && x < n.x + 160 && Math.abs(y - n.y) < 12)) { found = n; break; }
      }
      if (found && found !== hover) { for (let i = 0; i < 3; i++) fire(found); }
      hover = found;
      canvas.style.cursor = found ? "pointer" : "default";
      if (reduce) draw();
    });
    canvas.addEventListener("pointerleave", () => { hover = null; if (reduce) draw(); });

    layout();
    window.addEventListener("resize", () => { layout(); draw(); });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { layout(); draw(); } }).observe(canvas);
    if (reduce) { draw(); return; }
    requestAnimationFrame(frame);
  }

  /* ================================================================
     "Ask my AI twin" – a scripted assistant that answers from this
     portfolio. EDIT the answers to match your real details.
     ================================================================ */
  const KB = [
    { keys: ["experience", "career", "job", "jobs", "company", "companies", "role", "worked", "years", "current"],
      a: "▹ Senior Data Scientist, AIT Global India (Dec 2023–now): LLM-integrated API services for financial-report insights, GenAI summarisation and sentiment modules, risk scoring.\n▹ AI Data Specialist, Futurense Technologies (2023): real-time web data for pricing models, executive dashboards.\n▹ Software Engineer, Systech Solutions (2022–23): data frameworks for large-scale trading datasets.\n▹ Data Scientist, Varilligence Technologies (2020–22): stock-movement prediction and alpha-generating trading signals." },
    { keys: ["why", "hire", "strength", "strengths", "fit", "different", "value", "unique"],
      a: "Three reasons:\n\n▹ Architecture first: every design starts from a layered blueprint covering orchestration, MCP tools, memory, a model gateway, guardrails and evals.\n▹ Grounded in production ML: 6+ years shipping models and LLM services, mostly in finance, where mistakes are expensive.\n▹ Safety by design: human approval on irreversible actions, least-privilege tools and every run traced and scored." },
    { keys: ["architect", "agents", "architecture", "architecting", "design", "approach", "blueprint", "principles", "pattern", "patterns"],
      a: "Rishikesh starts from a reference architecture: interfaces → guardrails → a supervisor agent (LangGraph state machine with checkpoints) → specialist agents → tools via MCP → vector + graph knowledge and memory → a model gateway that routes between frontier and open-weight models. Security runs down one side and observability and evals down the other.\n\nPrinciples: workflows before agents, evals are the spec, tools through MCP, humans approve anything irreversible, and route for cost." },
    { keys: ["alphadesk", "flagship", "quant", "quantitative", "stock", "stocks", "trading", "backtest"],
      a: "AlphaDesk is the flagship: a multi-agent quant research platform. A LangGraph supervisor delegates to a market-data agent (MCP servers), a research agent (GraphRAG over filings and news), a quant agent that writes and runs backtests in a sandbox, and a risk agent. Frontier models plan, small open-weight models extract, everything is traced in Langfuse, and a human approves before any signal leaves. It evolved from an earlier regression and time-series stock prediction project." },
    { keys: ["atlas", "ai-engineer-atlas", "engineer-atlas", "study", "map", "curriculum", "learning", "sites", "site", "interactive"],
      a: "The AI Engineer Atlas is an interactive study platform and knowledge map hosted live at https://rishikesh32.github.io/ai-engineer-atlas/.\n\n▹ 16 core areas across 5 curriculum tiers (from math foundations to production agents)\n▹ 106 subtopics with deep dives, KaTeX math, and code labs\n▹ Three.js interactive 3D learning graph\n▹ Progress tracker and spaced-repetition daily review" },
    { keys: ["skill", "skills", "stack", "tech", "tools", "know", "languages", "framework", "frameworks", "cloud"],
      a: "Agents: LangGraph, CrewAI, OpenAI Agents SDK, Claude Agent SDK, multi-agent systems, MCP servers, A2A, computer use, human-in-the-loop.\nKnowledge: RAG and GraphRAG, hybrid search and reranking, vector databases, knowledge graphs, agent memory, context engineering.\nModels: Claude, GPT, Gemini, Llama, Qwen, DeepSeek, model routing, LoRA/QLoRA/DPO fine-tuning, multimodal.\nSpeech: Whisper, streaming speech-to-text and text-to-speech, speaker diarization, voice agents, video dubbing.\nLLMOps: Ragas, DeepEval, Langfuse, LangSmith, guardrails, prompt-injection defence.\nPlatform: vLLM, Ollama, Docker, Kubernetes, AWS Bedrock, Azure AI Foundry, Vertex AI." },
    { keys: ["voice", "speech", "call", "calls", "phone", "echoagent", "conversational", "stt", "tts", "audio"],
      a: "EchoAgent is a real-time voice agent: streaming speech-to-text (Whisper) feeds an LLM agent that calls tools to look up, book and update records, and streaming text-to-speech replies with low latency. It handles interruptions mid-sentence and hands off to a person when asked." },
    { keys: ["dubbing", "dub", "dubbed", "dubflow", "video", "translation", "translate", "languages", "diarization"],
      a: "DubFlow dubs a video into another language: Whisper transcribes with timestamps, speaker diarization separates the voices, an LLM translates while keeping context and timing, and text-to-speech generates each speaker's voice, aligned to the original timing and mixed back with the background audio." },
    { keys: ["prospectus", "prospectuses", "sai", "style", "styling", "styles", "funddocs", "document", "documents", "filings", "vlm", "mutual"],
      a: "FundDocs Studio: prospectuses, summary prospectuses and SAI documents go in with the client's style guide. Vision-language models read each page's layout, a style-guide agent decides which rule applies to every heading, table and footnote, and LLM agents apply the formatting, verify it against the guide and route it for human sign-off. It evolved from an automated mutual-fund data pipeline." },
    { keys: ["recommendation", "recommendations", "recommender", "ott", "cinemind", "redis", "cluster", "clustering", "movies", "movie", "streaming"],
      a: "CineMind is an OTT recommendation engine. Watch events become user embeddings, viewers are clustered into taste groups so similar people see similar films, candidates from the cluster plus item similarity are ranked per user, and Redis serves precomputed recommendations, sessions and trending lists. FastAPI microservices on PostgreSQL, in Docker, with a conversational agent that explains each pick." },
    { keys: ["listing", "listings", "listingstudio", "estate", "property", "properties", "housing"],
      a: "ListingStudio goes beyond classifying property photos: vision models tag each image by room and feature, then LLM agents generate the rest of each listing at scale, including the view and surroundings, amenities, neighbourhood details and the full description. A critic agent checks claims against the photos and filters non-compliant language before publishing." },
    { keys: ["project", "projects", "built", "build", "portfolio", "case", "shipped", "made", "listingstudio", "invoiceops", "skywatch", "cinemind", "gateway", "funddocs"],
      a: "Nine AI systems:\n\n▹ AlphaDesk: multi-agent quant research (flagship)\n▹ EchoAgent: real-time voice agent with tool calling\n▹ DubFlow: AI video dubbing (transcribe, translate, re-voice)\n▹ ListingStudio: classifies listing photos and generates views, amenities and descriptions at scale\n▹ InvoiceOps: document AI plus a computer-use agent\n▹ FundDocs Studio: VLM + LLM agents that style prospectuses to the client style guide\n▹ SkyWatch: perceive → reason → act vision agent\n▹ CineMind: OTT recommendations from user taste clusters, served from Redis\n▹ Enterprise MCP Gateway: secure tool layer for any agent" },
    { keys: ["rag", "retrieval", "llm", "llms", "genai", "generative", "gpt", "claude", "gemini", "fine", "finetuning", "langgraph", "prompt", "agent", "agents", "agentic", "mcp", "evals", "multi"],
      a: "Agent-first toolkit: LangGraph supervisors and multi-agent teams, MCP servers as the standard tool layer, A2A for talking to external agents, GraphRAG with hybrid search for knowledge, long-term memory for personalisation, and Langfuse plus eval suites so every agent run is traced and scored. Models are routed between Claude, GPT, Gemini and open-weight models on vLLM." },
    { keys: ["finance", "financial", "market", "portfolio", "risk", "fund", "funds"],
      a: "Finance is a through-line: stock-movement models and trading signals at Varilligence, trading-data systems at Systech, and LLM services for financial reports, risk scoring and portfolio intelligence at AIT Global India. AlphaDesk and FundDocs Studio carry that into agentic architecture." },
    { keys: ["education", "degree", "university", "college", "study", "studied", "msc", "bsc", "certification", "certifications", "award", "awards"],
      a: "Education: M.Sc. Computer Science, Shivaji University (2022), and B.Sc. Computer Science, Mahavir College (2019), both in Kolhapur.\nRecognition: Best Performer of the Month, Spot Award, GOM Award.\nCertifications: Machine Learning in Python, Data Analysis with Python, Data Visualization." },
    { keys: ["resume", "résumé", "cv", "pdf", "download"],
      a: "Rishikesh's résumé is a 2-page PDF: use the \"Download résumé\" button at the top of the page, the Résumé link in the menu, or the link in the contact section. It covers the agentic AI skills, four roles since 2020, selected projects like AlphaDesk and FundDocs Studio, and education." },
    { keys: ["contact", "email", "available", "availability", "freelance", "consult", "reach", "touch", "linkedin", "github"],
      a: "Rishikesh is open to AI Architect roles. The quickest way is email: rishikeshombase4@gmail.com. You can also connect on LinkedIn (linkedin.com/in/rishikesh-ombase-11989b1ab) or see code on GitHub (github.com/Rishikesh32)." },
    { keys: ["where", "location", "based", "city", "india", "kolhapur", "remote"],
      a: "Rishikesh is based in Kolhapur, Maharashtra, India, and open to AI Architect roles." },
    { keys: ["who", "about", "yourself", "rishikesh", "background", "introduce", "summary"],
      a: "Rishikesh Ombase is an agentic AI architect and Senior Data Scientist based in Kolhapur, India, with 6+ years in AI and ML. The focus is designing multi-agent systems with MCP tool layers, RAG and memory, and the evals and guardrails that make them production-safe." },
    { keys: ["hi", "hello", "hey", "yo", "sup", "namaste"],
      a: "Hey! Ask me about Rishikesh's agentic architecture approach, the projects, the stack or how to get in touch." },
  ];
  const FALLBACK = "I'm a small twin trained only on this portfolio, so that one's outside my weights. Try asking about architecture, projects, skills or experience, or email rishikeshombase4@gmail.com directly.";

  function answer(q) {
    const text = q.toLowerCase();
    const words = text.match(/[a-z]+/g) || [];
    let best = null, bestScore = 0;
    KB.forEach((entry) => {
      const score = entry.keys.reduce((s, k) => s + (words.includes(k) || (k.length > 4 && text.includes(k)) ? 1 : 0), 0);
      if (score > bestScore) { best = entry; bestScore = score; }
    });
    return best ? best.a : FALLBACK;
  }

  function chat() {
    const log = $("#chat-log"), form = $("#chat-form"), input = $("#chat-input");
    if (!log) return;
    let busy = false;

    function add(role, text) {
      const msg = document.createElement("div");
      msg.className = "msg msg-" + role;
      const body = document.createElement("div");
      body.className = "msg-body";
      const bubble = document.createElement("div");
      bubble.className = "bubble";
      bubble.textContent = text;
      body.appendChild(bubble);
      if (role === "ai") {
        const av = document.createElement("span");
        av.className = "msg-avatar";
        msg.appendChild(av);
      }
      msg.appendChild(body);
      log.appendChild(msg);
      log.scrollTop = log.scrollHeight;
      return bubble;
    }

    async function ask(q) {
      if (busy) return;
      busy = true;
      add("user", q);
      const bubble = add("ai", "");
      bubble.innerHTML = '<span class="dots"><i></i><i></i><i></i></span>';
      log.setAttribute("aria-busy", "true");
      const t0 = performance.now();
      await wait(reduce ? 100 : 550 + Math.random() * 500);

      const a = answer(q);
      if (reduce) {
        bubble.textContent = a;
      } else {
        bubble.textContent = "";
        const textNode = document.createTextNode("");
        const caret = document.createElement("span");
        caret.className = "cursor";
        bubble.append(textNode, caret);
        for (let i = 0; i < a.length; i += 2) {
          textNode.data = a.slice(0, i + 2);
          log.scrollTop = log.scrollHeight;
          await wait(12);
        }
        caret.remove();
      }
      const meta = document.createElement("div");
      meta.className = "msg-meta";
      meta.textContent = `rishi-ai · ${Math.round(a.length / 4)} tokens · ${((performance.now() - t0) / 1000).toFixed(1)}s`;
      bubble.parentElement.appendChild(meta);
      log.scrollTop = log.scrollHeight;
      log.setAttribute("aria-busy", "false");
      busy = false;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = input.value.trim();
      if (!q || busy) return;
      input.value = "";
      ask(q);
    });
    $$(".chip-btn").forEach((b) => b.addEventListener("click", () => ask(b.textContent)));
  }

  /* ================================================================
     Misc
     ================================================================ */
  function copyEmail() {
    const btn = $("#copy-email");
    if (!btn) return;
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.email);
        btn.textContent = "Copied ✓";
      } catch (_) {
        btn.textContent = btn.dataset.email;
      }
      setTimeout(() => (btn.textContent = "Copy email"), 1800);
    });
  }

  /* ================================================================
     Sites & Atlas inline preview toggle
     ================================================================ */
  function initSitesPreview() {
    const toggleBtn = $("#toggle-atlas-preview");
    const container = $("#atlas-preview-container");
    const closeBtn = $("#close-atlas-preview");
    const iframe = $("#atlas-iframe");
    const btnText = $("#preview-btn-text");

    if (!toggleBtn || !container || !iframe) return;

    function setPreviewState(open) {
      container.hidden = !open;
      toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
      if (btnText) btnText.textContent = open ? "Hide Preview" : "Preview Inline";

      if (open) {
        if (!iframe.src && iframe.dataset.src) {
          iframe.src = iframe.dataset.src;
        }
        setTimeout(() => {
          container.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 80);
      }
    }

    toggleBtn.addEventListener("click", () => {
      setPreviewState(container.hidden);
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        setPreviewState(false);
      });
    }
  }

  /* ================================================================
     Pause CSS animations in sections that are off screen
     ================================================================ */
  function pauseOffscreen() {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.target.classList.toggle("offscreen", !e.isIntersecting));
    }, { rootMargin: "100px 0px" });
    $$("main > section, .marquee, .footer").forEach((el) => io.observe(el));
  }

  /* ================================================================
     Theme: warm light by default, dark is opt-in
     ================================================================ */
  function themeToggle() {
    const btn = $("#theme-btn");
    if (!btn) return;
    const MOON = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16.5 12.3A6.8 6.8 0 0 1 7.7 3.5a6.8 6.8 0 1 0 8.8 8.8z"/></svg>';
    const SUN = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="10" cy="10" r="4"/><path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M4 4l1.4 1.4M14.6 14.6L16 16M4 16l1.4-1.4M14.6 5.4L16 4"/></svg>';
    const sync = () => {
      const dark = !isLight();
      btn.innerHTML = dark ? SUN : MOON;
      btn.setAttribute("aria-label", dark ? "Switch to warm light mode" : "Switch to dark mode");
      btn.setAttribute("title", dark ? "Warm light mode" : "Dark mode");
      const m = document.querySelector('meta[name="theme-color"]');
      if (m) m.setAttribute("content", dark ? "#04050d" : "#F6F0E6");
      if (window.neuralBG && window.neuralBG.setTheme) window.neuralBG.setTheme(dark ? "dark" : "light");
    };
    btn.addEventListener("click", () => {
      const next = isLight() ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("portfolio:theme", next); } catch (e) {}
      sync();
    });
    sync();
  }

  /* ================================================================
     Boot
     ================================================================ */
  $("#year").textContent = new Date().getFullYear();
  themeToggle();
  nav();
  initSitesPreview();
  pauseOffscreen();
  pointerFX();
  hud();
  skillsNetwork();
  chat();
  copyEmail();

  heroIntro();
  reveals();
  sectionShapes();
})();
