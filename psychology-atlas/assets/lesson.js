/* Data Analyst Atlas — lesson app shell.
   Turns a long topic page into a 3-panel, step-by-step lesson player:
   course tree | animated stage + stepper | narration + "you'll learn".
   Steps are derived from the page's own content; flagship lessons can supply a scripted
   isometric scene (assets/scenes/<area>.js) that plays before the regular steps. */
(function () {
  "use strict";
  var At, S, A, AREA, area, lessons = [], cur = { li: 0, si: 0 }, app, els = {};
  var LEVEL = { A: "Beginner", B: "Intermediate", C: "Intermediate", D: "Advanced", E: "Intermediate" };
  var ICON = {
    replay: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M3 8a5 5 0 1 0 1.6-3.7"/><path d="M3 2.5v2.8h2.8"/></svg>',
    clock: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 4.5V8l2.2 1.4"/></svg>',
    bars: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="9" width="2.6" height="5" rx=".6"/><rect x="6.7" y="6" width="2.6" height="8" rx=".6"/><rect x="11.4" y="3" width="2.6" height="11" rx=".6" opacity=".35"/></svg>',
    list: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 4h8M6 8h8M6 12h8M2.5 4h.01M2.5 8h.01M2.5 12h.01"/></svg>',
    folder: '<svg viewBox="0 0 18 16"><path d="M1 3.2C1 2.5 1.5 2 2.2 2h4.3l1.6 1.8h7.7c.7 0 1.2.5 1.2 1.2v8.3c0 .7-.5 1.2-1.2 1.2H2.2c-.7 0-1.2-.5-1.2-1.2z" fill="currentColor"/></svg>',
    doc: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M4 1.8h5.2L12.5 5v9.2H4z"/><path d="M9 1.8V5h3.5"/></svg>',
    check: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.2 3L13 4.5"/></svg>',
    arrowR: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>',
    arrowL: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 8H3M7 4L3 8l4 4"/></svg>',
    menu: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M2.5 4h11M2.5 8h11M2.5 12h11"/></svg>',
    play: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4.5 2.8v10.4L13 8z"/></svg>',
    pause: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="2.8" width="3" height="10.4" rx=".8"/><rect x="9.5" y="2.8" width="3" height="10.4" rx=".8"/></svg>',
    spark: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M8 1.5l1.6 4.2 4.4.3-3.4 2.8 1.1 4.3L8 10.7l-3.7 2.4 1.1-4.3L2 6l4.4-.3z"/></svg>'
  };
  function h(tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function txt(n) { return (n && n.textContent || "").replace(/\s+/g, " ").trim(); }
  function short(s, n) { s = s || ""; return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : s; }
  function mode() { return document.documentElement.getAttribute("data-mode") || "beginner"; }
  function is(n, sel) { return n.nodeType === 1 && n.matches(sel); }

  /* ---------------- step building ---------------- */
  var VIS = "figure, .widget, pre.code, .formula, .table-wrap, .grid-2, .grid-3, .projects";
  var DEEP_ONLY = "pre.code, .formula, .table-wrap";
  var RECAP = ".keyideas, .callout.pitfall, .callout.tip";
  function visKind(n) {
    if (is(n, ".widget")) return "try";
    if (is(n, "pre.code")) return "code";
    if (is(n, ".formula")) return "math";
    if (is(n, ".table-wrap")) return "compare";
    if (is(n, ".grid-2, .grid-3")) return "compare";
    if (is(n, ".projects")) return "build";
    return "picture";
  }
  var TAG = { intro: ["Start", "t2"], picture: ["Picture it", "t1"], try: ["Try it", "accent"], code: ["Code", "t5"], math: ["Math", "t3"],
    compare: ["Compare", "t4"], recap: ["Recap", "good"], quiz: ["Quick check", "accent"], build: ["Build", "t4"], scene: ["Watch", "t2"] };
  function stepTitle(kind, stage, narr, i, lessonTitle) {
    var h3 = narr.find(function (n) { return is(n, "h3"); });
    if (h3) return txt(h3);
    if (kind === "try") { var wt = stage.querySelector(".widget-title"); if (wt) return txt(wt); }
    if (i === 0) return lessonTitle;
    if (kind === "code") return "In code";
    if (kind === "math") return "The math";
    if (kind === "compare") return "Side by side";
    var cap = stage.querySelector && stage.querySelector("figcaption");
    if (cap) return short(txt(cap).split(/[.:;]/)[0], 48);
    return "Picture it";
  }

  function buildSteps(L) {
    var deep = mode() === "deep";
    var steps = [], narr = [], recap = [], resources = [], quiz = null, learn = null;
    var kids = L.nodes;
    for (var i = 0; i < kids.length; i++) {
      var n = kids[i];
      if (n.nodeType !== 1) continue;
      if (is(n, "h4") && /^check yourself|^you've mastered this area/i.test(txt(n))) { var nx = kids[i + 1]; if (nx && is(nx, ".checklist")) { learn = nx; i++; } continue; }
      if (is(n, "h4") && /^go deeper/i.test(txt(n))) { var rx = kids[i + 1]; if (rx && is(rx, ".resources")) { resources.push(rx); i++; } continue; }
      if (is(n, ".quiz")) { quiz = n; continue; }
      if (is(n, RECAP)) { recap.push(n); continue; }
      if (is(n, ".eyebrow") || is(n, "h2")) continue;
      if (n.matches(VIS)) {
        if (!deep && n.matches(DEEP_ONLY)) continue;
        steps.push({ kind: steps.length === 0 && narr.length ? "intro" : visKind(n), vkind: visKind(n), stage: n, narr: narr });
        narr = [];
        continue;
      }
      narr.push(n);
    }
    steps.forEach(function (s, k) { s.title = stepTitle(s.vkind, s.stage, s.narr, k, L.title); if (s.kind === "intro" && s.vkind === "try") s.kind = "try"; });
    var tipNodes = recap.filter(function (r) { return is(r, ".callout.tip"); });
    var cardNodes = recap.filter(function (r) { return !is(r, ".callout.tip"); });
    if (narr.length && !steps.length) {
      steps.push({ kind: "intro", stage: null, narr: narr, title: L.title }); narr = [];
    }
    if (cardNodes.length || narr.length || tipNodes.length) {
      steps.push({ kind: "recap", stage: cardNodes, narr: narr.concat(tipNodes, deep ? resources : []), title: "Recap" });
    }
    if (quiz) steps.push({ kind: "quiz", stage: quiz, narr: [], title: "Quick check" });
    var sc = window.ATLAS_SCENES && window.ATLAS_SCENES[AREA + "/" + L.id];
    if (sc && window.AtlasIso) {
      var sceneSteps = sc.steps.map(function (st, k) { return { kind: "scene", scene: sc, sceneIndex: k, title: st.title, tag: st.tag, narr: [] }; });
      if (!deep) steps = steps.filter(function (s) { return s.kind === "try" || s.kind === "recap" || s.kind === "quiz"; });
      steps = sceneSteps.concat(steps);
      if (sc.learn && !L.sceneLearn) L.sceneLearn = sc.learn;
    }
    L.learn = learn; L.steps = steps;
    return steps;
  }

  /* ---------------- collect lessons from the page ---------------- */
  function collect() {
    var content = document.querySelector("main.content");
    if (!content) return false;
    var ov = content.querySelector(".overview");
    if (ov) lessons.push({ id: "overview", title: "Overview", kind: "overview", el: ov, nodes: Array.prototype.slice.call(ov.children) });
    content.querySelectorAll("section.topic[id]").forEach(function (sec) {
      var head = sec.querySelector(".topic-head");
      var title = txt(sec.querySelector("h2"));
      var nodes = Array.prototype.slice.call(sec.children).filter(function (n) { return n !== head; });
      var lead = sec.querySelector(".lead");
      var mins = head && head.querySelector(".mins");
      var master = head && head.querySelector(".master-btn");
      var tag = head && head.querySelector(".eyebrow") ? txt(head.querySelector(".eyebrow")).replace(/·\s*~?\d+\s*min.*$/, "").split("·").slice(1).join("·").trim() : "";
      lessons.push({ id: sec.id, title: title, kind: "topic", el: sec, nodes: nodes, sub: lead ? short(txt(lead).split(/(?<=\.)\s/)[0], 140) : "", mins: mins ? txt(mins).replace(/[^\d]/g, "") : "", master: master, tag: tag });
    });
    var cap = content.querySelector(".capstone");
    if (cap) lessons.push({ id: "projects", title: "Projects", kind: "capstone", el: cap, nodes: Array.prototype.slice.call(cap.children) });
    if (lessons[0] && lessons[0].kind === "overview") {
      var lede = document.querySelector(".page-hero .lede");
      lessons[0].sub = lede ? short(txt(lede), 160) : "";
    }
    return lessons.length > 0;
  }

  /* ---------------- shell ---------------- */
  function build() {
    var tier = At.tierOf(area);
    app = h("div", "app");
    app.style.setProperty("--tier", tier ? tier.color : "var(--accent)");
    app.innerHTML =
      '<aside class="app-nav" aria-label="Course"><div class="nav-head"><span class="nav-title">' + ICON.folder + 'Course</span><span class="nav-count">' + A.areas.reduce(function (s, a) { return s + a.subs.length; }, 0) + ' lessons</span></div><div class="nav-tree"></div>' +
      '<a class="nav-progress" href="../index.html"><span>Progress</span><span class="num"></span>' + ICON.arrowR + "</a></aside>" +
      '<section class="app-main"><header class="lesson-head"><button type="button" class="btn-chunky nav-toggle" aria-label="Show course list">' + ICON.menu + '</button><div class="lh-text"><p class="crumb-line"></p><h1 class="lesson-title"></h1><p class="lesson-sub"></p></div><div class="lesson-chips"></div></header>' +
      '<div class="stage-card"><div class="stage-bar"><div class="metrics"></div><div class="stage-actions"><span class="stage-kind"></span><button type="button" class="btn-chunky small play" hidden>' + ICON.play + 'Play</button><button type="button" class="btn-chunky small replay">' + ICON.replay + "Replay</button></div></div>" +
      '<div class="stage" tabindex="-1"></div><div class="stage-foot"><div class="legend"></div><p class="stage-cap"></p></div><div class="flowlog" hidden><div class="fl-head"><span>No.</span><span>Source</span><span>Destination</span><span>Type</span><span>Info</span></div><div class="fl-rows"></div></div></div>' +
      '<div class="stepper-card"><div class="stepper-head"><span>In this lesson</span><span class="num step-count"></span></div><ol class="stepper"></ol></div></section>' +
      '<aside class="app-panel"><div class="panel-card narr"><div class="narr-top"><span class="step-no num"></span><span class="step-tag"></span></div><h2 class="step-title"></h2><div class="narr-body"></div>' +
      '<div class="narr-nav"><button type="button" class="btn-chunky back">' + ICON.arrowL + 'Back</button><button type="button" class="btn-chunky primary next"><span class="next-label">Next</span>' + ICON.arrowR + "</button></div>" +
      '<p class="kbd-hint"><kbd>←</kbd><kbd>→</kbd> step · <kbd>R</kbd> replay</p></div>' +
      '<div class="panel-card learn"><p class="panel-label">You\'ll learn</p><div class="learn-body"></div><div class="learn-foot"></div></div></aside>' +
      '<div class="store" hidden></div>';
    var store = app.querySelector(".store");
    lessons.forEach(function (L) { store.appendChild(L.el); });
    var old = document.querySelector(".wrap > .layout");
    var hero = document.querySelector(".page-hero");
    var foot = document.querySelector(".site-foot");
    document.body.insertBefore(app, hero || old);
    if (hero) { hero.hidden = true; var note = hero.querySelector(".mode-note"); if (note) note.remove(); }
    if (old) old.parentNode.hidden = true;
    if (foot) foot.hidden = true;
    document.body.classList.add("lesson-mode");
    els = {
      nav: app.querySelector(".app-nav"), tree: app.querySelector(".nav-tree"), progress: app.querySelector(".nav-progress .num"),
      crumb: app.querySelector(".crumb-line"), title: app.querySelector(".lesson-title"), sub: app.querySelector(".lesson-sub"), chips: app.querySelector(".lesson-chips"),
      metrics: app.querySelector(".metrics"), stage: app.querySelector(".stage"), kind: app.querySelector(".stage-kind"), legend: app.querySelector(".legend"), cap: app.querySelector(".stage-cap"),
      replay: app.querySelector(".replay"), play: app.querySelector(".play"), flowlog: app.querySelector(".flowlog"), flRows: app.querySelector(".fl-rows"), stepper: app.querySelector(".stepper"), count: app.querySelector(".step-count"),
      stepNo: app.querySelector(".step-no"), tag: app.querySelector(".step-tag"), stepTitle: app.querySelector(".step-title"), narr: app.querySelector(".narr-body"),
      back: app.querySelector(".back"), next: app.querySelector(".next"), nextLabel: app.querySelector(".next-label"),
      learnBody: app.querySelector(".learn-body"), learnFoot: app.querySelector(".learn-foot"), store: store
    };
    els.narr.addEventListener("scroll", fadeCheck, { passive: true });
    window.addEventListener("resize", function () { fadeCheck(); fitWidget(); });
    els.back.addEventListener("click", function () { go(-1); });
    els.next.addEventListener("click", function () { go(1); });
    els.replay.addEventListener("click", replay);
    els.play.addEventListener("click", function () { setAutoplay(!autoplay); });
    app.querySelector(".nav-toggle").addEventListener("click", function () { app.classList.toggle("nav-open"); });
    els.stepper.addEventListener("click", function (e) { var b = e.target.closest("button[data-si]"); if (b) show(cur.li, +b.getAttribute("data-si"), true); });
    els.tree.addEventListener("click", function (e) { var a = e.target.closest("a[data-li]"); if (a) { e.preventDefault(); app.classList.remove("nav-open"); show(+a.getAttribute("data-li"), 0, true); } });
    document.addEventListener("keydown", function (e) {
      var t = e.target, tag = t && t.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" || (t && t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      else if (e.key === "r" || e.key === "R") replay();
      else if (e.key === "Escape") app.classList.remove("nav-open");
    });
    window.addEventListener("hashchange", fromHash);
    document.addEventListener("psy:mastered", renderTree);
    new MutationObserver(function () { var L = lessons[cur.li]; var ttl = L.steps && L.steps[cur.si] && L.steps[cur.si].title; restoreAll(); lessons.forEach(function (x) { x.steps = null; }); var st = steps(L); var k = st.findIndex(function (s) { return s.title === ttl; }); show(cur.li, Math.max(0, k), false); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ["data-mode"] });
  }

  function steps(L) { return L.steps || buildSteps(L); }

  function renderTree() {
    var html = "";
    var done = 0, total = 0;
    A.areas.forEach(function (a) {
      var d = At.areaDone(a); done += d; total += a.subs.length;
      var t = A.tiers.find(function (x) { return x.id === a.tier; });
      var open = a.id === AREA;
      html += '<div class="tree-area' + (open ? " open" : "") + '" style="--c:' + (t ? t.color : "var(--accent)") + '">' +
        '<a class="tree-row area-row' + (a.live ? "" : " soon") + '"' + (a.live ? ' href="' + (open ? "#overview" : a.file) + '"' : "") + ' ' + (open ? ' data-li="0"' : "") + '><span class="chev">' + (open ? "▾" : "▸") + '</span><span class="fold">' + ICON.folder + '</span><span class="tr-name">' + At.pad(a.n) + ". " + esc(a.title) + '</span><span class="tr-count num">' + d + "/" + a.subs.length + "</span></a>";
      if (open) {
        html += '<div class="tree-kids">';
        lessons.forEach(function (L, li) {
          var isDone = L.kind === "topic" && At.isMastered(AREA, L.id);
          html += '<a class="tree-row lesson-row' + (li === cur.li ? " active" : "") + (isDone ? " done" : "") + '" href="#' + L.id + '" data-li="' + li + '"><span class="ic">' + (isDone ? ICON.check : ICON.doc) + "</span><span>" + esc(L.title) + "</span></a>";
        });
        html += "</div>";
      }
      html += "</div>";
    });
    els.tree.innerHTML = html;
    els.progress.textContent = done + " / " + total;
    var act = els.tree.querySelector(".lesson-row.active");
    if (act && act.scrollIntoView) { var r = act.getBoundingClientRect(), pr = els.tree.getBoundingClientRect(); if (r.top < pr.top || r.bottom > pr.bottom) act.scrollIntoView({ block: "nearest" }); }
  }

  /* ---------------- showing a step ---------------- */
  function restoreAll() {
    // put every moved node back into its lesson container, in original order
    lessons.forEach(function (L) { L.nodes.forEach(function (n) { if (n.style && n.style.zoom) n.style.zoom = ""; L.el.appendChild(n); }); });
    if (lessons[cur.li] && lessons[cur.li].master) {
      var L = lessons[cur.li]; var head = L.el.querySelector(".topic-head"); if (head) head.appendChild(L.master);
    }
  }
  function place(nodes, into) { (Array.isArray(nodes) ? nodes : [nodes]).forEach(function (n) { if (n) into.appendChild(n); }); }

  function show(li, si, push) {
    li = Math.max(0, Math.min(lessons.length - 1, li));
    var L = lessons[li], st = steps(L);
    si = Math.max(0, Math.min(st.length - 1, si));
    var lessonChanged = li !== cur.li || !els.title.textContent;
    restoreAll();
    cur = { li: li, si: si };
    var step = st[si];
    // header
    var topics = lessons.filter(function (x) { return x.kind === "topic"; });
    var tIndex = topics.indexOf(L);
    els.crumb.innerHTML = At.pad(area.n) + ". " + esc(area.title) + " <span>/</span> " + (L.kind === "topic" ? "Lesson " + (tIndex + 1) + " of " + topics.length : esc(L.title));
    els.title.textContent = L.kind === "overview" ? area.title : L.title;
    els.sub.textContent = si === 0 ? (L.sub || "") : "";
    els.sub.hidden = !els.sub.textContent;
    var chips = "";
    if (L.mins) chips += '<span class="lchip c-time">' + ICON.clock + L.mins + " min</span>";
    chips += '<span class="lchip c-level">' + ICON.bars + LEVEL[area.tier] + "</span>";
    chips += '<span class="lchip c-steps">' + ICON.list + st.length + " steps</span>";
    els.chips.innerHTML = chips;
    // stepper
    els.stepper.innerHTML = st.map(function (s, k) {
      return '<li class="' + (k < si ? "past" : k === si ? "now" : "") + '"><button type="button" data-si="' + k + '" aria-label="Step ' + (k + 1) + ": " + esc(s.title) + '"' + (k === si ? ' aria-current="step"' : "") + '><span class="dot num">' + (k + 1) + '</span><span class="lbl">' + esc(short(s.title, 22)) + "</span></button></li>";
    }).join("");
    els.stepper.style.setProperty("--progress", st.length > 1 ? (si / (st.length - 1) * 100) + "%" : "0%");
    els.count.textContent = "Step " + (si + 1) + " of " + st.length;
    var cs = els.stepper.querySelector("li.now"); if (cs && cs.scrollIntoView) { var sr = els.stepper.getBoundingClientRect(), cr = cs.getBoundingClientRect(); if (cr.left < sr.left || cr.right > sr.right) els.stepper.scrollLeft += cr.left - sr.left - sr.width / 2 + cr.width / 2; }
    // narration panel
    var tg = step.kind === "scene" && step.tag ? [step.tag, /problem/i.test(step.tag) ? "signal" : /solution/i.test(step.tag) ? "good" : "t2"] : TAG[step.kind] || TAG.picture;
    els.stepNo.textContent = "Step " + (si + 1) + " / " + st.length;
    els.tag.textContent = tg[0]; els.tag.style.setProperty("--c", "var(--" + tg[1] + ")");
    els.stepTitle.textContent = step.title;
    els.narr.innerHTML = "";
    els.stage.innerHTML = ""; els.metrics.innerHTML = ""; els.legend.innerHTML = ""; els.cap.textContent = "";
    els.stage.className = "stage kind-" + step.kind;
    els.metrics.parentNode.classList.toggle("has-metrics", false);
    if (step.kind === "scene") {
      var sst = step.scene.steps[step.sceneIndex];
      els.narr.innerHTML = window.AtlasIso.narration(sst);
      if (lessonChanged || push === "replay" || !logScene || logScene !== step.scene) { els.flRows.innerHTML = ""; flowNo = 0; logScene = step.scene; }
      window.AtlasIso.render(step.scene, step.sceneIndex, { stage: els.stage, metrics: els.metrics, legend: els.legend, fresh: lessonChanged || push === "replay", onFlow: logFlow(step.scene) });
      els.metrics.parentNode.classList.toggle("has-metrics", !!(step.scene.metrics && step.scene.metrics.length));
      els.kind.textContent = "";
    } else {
      step.narr.forEach(function (n) { if (is(n, "h3") && txt(n) === step.title) return; els.narr.appendChild(n); });
      if (step.kind === "recap") {
        var box = h("div", "recap-board"); place(step.stage, box); els.stage.appendChild(box);
      } else if (step.kind === "intro" && !step.stage) {
        els.stage.appendChild(h("div", "title-card", '<span class="eyebrow">' + At.pad(area.n) + " · " + esc(area.title) + "</span><strong>" + esc(L.title) + "</strong>"));
      } else if (step.stage) {
        if (is(step.stage, "figure")) {
          els.stage.classList.add("fit");
          var capEl = step.stage.querySelector("figcaption");
          if (capEl && !step.narr.length) els.narr.appendChild(h("p", "", capEl.innerHTML));
          else if (capEl) els.cap.textContent = txt(capEl);
        }
        place(step.stage, els.stage);
      }
      els.kind.textContent = { try: "Interactive · change the controls", code: "Code", math: "Formula", compare: "Comparison", recap: "Summary", quiz: "Three questions", build: "Project ideas" }[step.kind] || "";
      if (!els.narr.children.length) els.narr.appendChild(h("p", "muted", step.kind === "try" ? "Play with the controls and watch what changes. The challenge above the demo gives you a goal." : step.kind === "quiz" ? "Answer all three to mark this lesson as mastered. Wrong answers show an explanation and you can retry." : "Look at the picture, then press Next."));
      els.stage.querySelectorAll(".diagram svg").forEach(function (svg) { if (window.AtlasAnimate) window.AtlasAnimate.play(svg); });
    }
    repaint(els.stage);
    if (step.kind === "quiz") pageQuiz(els.stage.querySelector(".quiz"));
    fitWidget();
    els.replay.hidden = !(step.kind === "scene" || els.stage.querySelector(".diagram svg"));
    els.play.hidden = step.kind !== "scene";
    els.flowlog.hidden = step.kind !== "scene";
    if (step.kind !== "scene" && autoplay) setAutoplay(false);
    if (autoplay) scheduleNext();
    animateIn(step);
    // learn panel
    els.learnBody.innerHTML = "";
    if (L.sceneLearn && step.kind === "scene") {
      els.learnBody.innerHTML = '<ul class="scene-learn">' + L.sceneLearn.map(function (t, k) { return '<li class="' + (k <= Math.floor(si / Math.max(1, step.scene.steps.length) * L.sceneLearn.length) ? "on" : "") + '">' + t + "</li>"; }).join("") + "</ul>";
    } else if (L.learn) { els.learnBody.appendChild(L.learn); }
    else els.learnBody.innerHTML = '<p class="muted small">' + (L.kind === "overview" ? "How the lessons in this area fit together." : "") + "</p>";
    els.learnFoot.innerHTML = "";
    if (L.master) els.learnFoot.appendChild(L.master);
    // nav buttons
    var nextStep = st[si + 1], nextLesson = lessons[li + 1];
    var idx = A.areas.indexOf(area), nextArea = A.areas.slice(idx + 1).find(function (x) { return x.live; });
    els.back.disabled = li === 0 && si === 0;
    els.nextLabel.textContent = nextStep ? "Next: " + short(nextStep.title, 22) : nextLesson ? "Next lesson: " + short(nextLesson.title, 18) : nextArea ? "Next area: " + short(nextArea.title, 16) : "Finish";
    renderTree();
    renderMath(app);
    if (window.AtlasStore) window.AtlasStore.set("psy:last", JSON.stringify({ area: AREA, sub: L.id === "overview" || L.id === "projects" ? (lessons[1] ? lessons[1].id : L.id) : L.id, t: Date.now() }));
    var hash = "#" + L.id + (si ? "/" + (si + 1) : "");
    if (location.hash !== hash) history.replaceState(null, "", hash);
    if (push && lessonChanged) { els.stage.scrollTop = 0; app.querySelector(".narr").scrollTop = 0; window.scrollTo(0, 0); }
    els.narr.scrollTop = 0;
    fadeCheck();
  }
  /* some browsers skip repainting an SVG that was moved into the stage; force a re-layout once it has settled */
  var repaintTimers = [];
  function repaint(stage) {
    repaintTimers.forEach(clearTimeout);
    repaintTimers = [120, 1700].map(function (t) {
      return setTimeout(function () {
        stage.querySelectorAll("svg").forEach(function (s) { if (s.closest(".widget")) return; var d = s.style.display; s.style.display = "none"; void s.getBoundingClientRect(); s.style.display = d; });
      }, t);
    });
  }
  function fitWidget() {
    var w = els.stage.firstElementChild;
    if (!w || window.innerWidth <= 1060 || els.stage.classList.contains("fit") || els.stage.classList.contains("kind-scene")) return;
    w.style.zoom = "";
    var tries = 0;
    function pass() {
      var cs = getComputedStyle(els.stage);
      var availH = els.stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - 4;
      var availW = els.stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 2;
      var z = parseFloat(w.style.zoom) || 1, r = w.getBoundingClientRect();
      var visW = Math.max(r.width, w.scrollWidth * z), visH = Math.max(r.height, w.scrollHeight * z);
      var ratio = Math.min(availH / visH, availW / visW);
      if (availH > 160 && ratio < 0.995 && tries++ < 4) {
        w.style.zoom = String(Math.max(0.52, z * ratio * 0.99).toFixed(3));
        requestAnimationFrame(pass);
      }
    }
    requestAnimationFrame(pass);
  }
  /* quick checks: one question at a time inside the stage */
  function pageQuiz(q) {
    if (!q) return;
    var idx = 0;
    function items() { return Array.prototype.slice.call(q.querySelectorAll(".qq")); }
    function update() {
      var it = items(); if (!it.length) return;
      if (it.every(function (li) { return !li.classList.contains("done"); })) idx = 0;
      idx = Math.min(idx, it.length - 1);
      it.forEach(function (li, i) { li.classList.toggle("cur", i === idx); });
      var nav = q.querySelector(".qq-nav");
      if (!nav) { nav = h("div", "qq-nav"); q.querySelector(".quiz-qs").after(nav); }
      var done = it[idx].classList.contains("done"), last = idx === it.length - 1;
      nav.innerHTML = '<span class="qq-count num">Question ' + (idx + 1) + " of " + it.length + "</span>" +
        (done && !last ? '<button type="button" class="btn-chunky small primary qq-next">Next question ' + ICON.arrowR + "</button>" : "");
      fitWidget();
    }
    if (!q.__paged) {
      q.__paged = true;
      q.addEventListener("click", function (e) { if (e.target.closest(".qq-next")) { idx++; update(); } else setTimeout(update, 0); });
    }
    q.classList.add("paged");
    update();
  }
  function fadeCheck() { var n = els.narr; if (!n) return; n.classList.toggle("more", n.scrollHeight - n.scrollTop - n.clientHeight > 8); }
  function renderMath(node) { if (typeof window.renderMathInElement === "function") { try { window.renderMathInElement(node, { delimiters: [{ left: "\\[", right: "\\]", display: true }, { left: "\\(", right: "\\)", display: false }], throwOnError: false, ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"] }); } catch (e) {} } }

  /* ---------- cinematic extras: flow log, autoplay, GSAP transitions ---------- */
  var flowNo = 0, logScene = null, autoplay = false, autoTimer = null;
  var REDUCED = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function logFlow(scene) {
    return function (i, f) {
      if (logScene !== scene || !els.flRows) return;
      var K = window.AtlasIso.KIND[f[2]] || window.AtlasIso.KIND.req, o = f[3] || {};
      var a = scene.nodes[f[0]] || {}, b = scene.nodes[f[1]] || {};
      var lg = (scene.legend || {})[f[2]] || K.label;
      flowNo++;
      var row = h("div", "fl-row", '<span class="fl-no num" style="--k:' + K.c + '">' + flowNo + "</span><span>" + esc(a.label || f[0]) + "</span><span>" + esc(b.label || f[1]) + '</span><span class="fl-type"><i style="background:' + K.c + '"></i>' + esc(lg) + "</span><span class=\"fl-info\">" + esc(o.label || (a.label || f[0]) + " → " + (b.label || f[1])) + "</span>");
      els.flRows.appendChild(row);
      while (els.flRows.children.length > 40) els.flRows.removeChild(els.flRows.firstChild);
      els.flRows.scrollTop = els.flRows.scrollHeight;
      if (window.gsap && !REDUCED) gsap.from(row, { autoAlpha: 0, x: -12, duration: 0.35, ease: "power2.out", clearProps: "opacity,visibility,transform" });
    };
  }
  function setAutoplay(on) {
    autoplay = on;
    els.play.innerHTML = (on ? ICON.pause + "Pause" : ICON.play + "Play");
    els.play.classList.toggle("primary", on);
    clearTimeout(autoTimer);
    if (window.AtlasIso && window.AtlasIso.pause) window.AtlasIso.pause(false);
    if (on) scheduleNext();
  }
  function scheduleNext() {
    clearTimeout(autoTimer);
    var L = lessons[cur.li], st = steps(L), step = st[cur.si];
    if (!step || step.kind !== "scene") return setAutoplay(false);
    var nextIsScene = st[cur.si + 1] && st[cur.si + 1].kind === "scene";
    var flows = (step.scene.steps[step.sceneIndex].flows || []).length;
    autoTimer = setTimeout(function () { if (!autoplay) return; if (nextIsScene) show(cur.li, cur.si + 1, true); else setAutoplay(false); }, Math.max(5200, 3800 + flows * 700));
  }
  function animateIn(step) {
    if (!window.gsap || REDUCED) return;
    var g = window.gsap;
    g.killTweensOf([els.stepTitle, els.tag]);
    g.fromTo(els.stepTitle, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out", clearProps: "opacity,visibility,transform" });
    g.fromTo(els.tag, { scale: 0.7, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(2)", clearProps: "opacity,visibility,transform" });
    var kids = Array.prototype.slice.call(els.narr.children);
    if (kids.length) g.fromTo(kids, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out", delay: 0.08, clearProps: "opacity,visibility,transform" });
    if (step.kind !== "scene") {
      var stageKids = Array.prototype.slice.call(els.stage.children);
      if (stageKids.length) g.fromTo(stageKids, { autoAlpha: 0, y: 18, scale: 0.985 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "power3.out", stagger: 0.05, clearProps: "opacity,visibility,transform" });
    }
    var now = els.stepper.querySelector("li.now .dot");
    if (now) g.fromTo(now, { scale: 0.6 }, { scale: 1, duration: 0.5, ease: "back.out(3)", clearProps: "transform" });
  }

  function go(d) {
    if (autoplay) setAutoplay(false);
    var L = lessons[cur.li], st = steps(L);
    if (d > 0) {
      if (cur.si + 1 < st.length) return show(cur.li, cur.si + 1, true);
      if (cur.li + 1 < lessons.length) return show(cur.li + 1, 0, true);
      var idx = A.areas.indexOf(area), na = A.areas.slice(idx + 1).find(function (x) { return x.live; });
      location.href = na ? na.file : "../index.html";
    } else {
      if (cur.si > 0) return show(cur.li, cur.si - 1, true);
      if (cur.li > 0) { var pl = lessons[cur.li - 1]; return show(cur.li - 1, steps(pl).length - 1, true); }
    }
  }
  function replay() {
    var L = lessons[cur.li], step = steps(L)[cur.si];
    if (step.kind === "scene") window.AtlasIso.render(step.scene, step.sceneIndex, { stage: els.stage, metrics: els.metrics, legend: els.legend, fresh: true });
    else els.stage.querySelectorAll(".diagram svg").forEach(function (svg) { if (window.AtlasAnimate) window.AtlasAnimate.play(svg); });
  }
  function fromHash() {
    var m = (location.hash || "").slice(1).split("/");
    var li = lessons.findIndex(function (L) { return L.id === m[0]; });
    if (li < 0) li = 0;
    var si = m[1] ? Math.max(0, parseInt(m[1], 10) - 1) : 0;
    if (li === cur.li && si === cur.si && els.title.textContent) return;
    show(li, si, true);
  }

  function loadScript(src) { return new Promise(function (res) { var s = document.createElement("script"); s.src = src; s.onload = function () { res(true); }; s.onerror = function () { res(false); }; document.head.appendChild(s); }); }

  function init() {
    At = window.Atlas; S = window.AtlasStore;
    if (!At || !At.area) return;
    A = At.data; area = At.area; AREA = area.id;
    var SCENE_AREAS = A.areas.map(function (x) { return x.id; });
    var hasScene = SCENE_AREAS.indexOf(AREA) >= 0;
    var CDN = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/";
    var gsapReady = loadScript(CDN + "gsap.min.js").then(function (ok) { return ok ? loadScript(CDN + "MotionPathPlugin.min.js") : false; })
      .then(function () { if (window.gsap && window.MotionPathPlugin) window.gsap.registerPlugin(window.MotionPathPlugin); });
    var gsapSoon = Promise.race([gsapReady, new Promise(function (r) { setTimeout(r, 450); })]);
    Promise.all((hasScene ? [loadScript(At.base + "iso.js"), loadScript(At.base + "scenes/" + AREA + ".js")] : []).concat([gsapSoon])).then(function () {
      if (!collect()) { document.documentElement.classList.remove("app-loading"); return; }
      build();
      fromHash();
      if (!els.title.textContent) show(0, 0, false);
      requestAnimationFrame(function () { document.documentElement.classList.remove("app-loading"); });
    });
  }
  document.addEventListener("psy:ready", init);
})();
