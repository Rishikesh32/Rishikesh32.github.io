/* Data Analyst Atlas — learning layer:
   reading-level switch, glossary tooltips, time estimates, quick-check quizzes,
   demo challenges, spaced review, streaks, badges and "continue where you left off". */
(function () {
  "use strict";
  var At = window.Atlas, S = window.AtlasStore;
  if (!At || !S) return;
  var A = At.data, BASE = At.base;
  var PAGE = document.body.getAttribute("data-page") || "";
  var AREA = document.body.getAttribute("data-area") || "";
  var ROOT = AREA ? "../" : "";
  var REDUCED = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DAY = 86400000;
  var INTERVALS = [0, 1, 3, 7, 21, 60]; // days per review box
  window.ATLAS_LEARN = window.ATLAS_LEARN || {};

  /* ---------- small helpers ---------- */
  function dayKey(d) { d = d || new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function jget(k, def) { try { var v = S.get(k); return v ? JSON.parse(v) : def; } catch (e) { return def; } }
  function jset(k, v) { S.set(k, JSON.stringify(v)); }
  function keys(prefix) { var out = []; try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.indexOf(prefix) === 0) out.push(k); } } catch (e) {} return out; }
  function h(tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function loadScript(src) { return new Promise(function (res) { var s = document.createElement("script"); s.src = src; s.onload = function () { res(true); }; s.onerror = function () { res(false); }; document.head.appendChild(s); }); }
  function areaById(id) { return A.areas.find(function (a) { return a.id === id; }); }
  function subTitle(area, sub) { var s = area && area.subs.find(function (x) { return x[0] === sub; }); return s ? s[1] : sub; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function renderMath(node) { if (typeof window.renderMathInElement === "function") { try { window.renderMathInElement(node, { delimiters: [{ left: "\\[", right: "\\]", display: true }, { left: "\\(", right: "\\)", display: false }], throwOnError: false }); } catch (e) {} } }
  function fmtDate(ts) { var d = new Date(ts), now = new Date(); var diff = Math.round((new Date(dayKey(d)) - new Date(dayKey(now))) / DAY); if (diff <= 0) return "today"; if (diff === 1) return "tomorrow"; if (diff < 7) return "in " + diff + " days"; return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }); }

  var ICON = {
    flame: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5c.4 2.2 2 3.3 3 4.7.8 1.1 1.2 2.2 1.2 3.4A4.2 4.2 0 0 1 8 14a4.2 4.2 0 0 1-4.2-4.4c0-1.5.7-2.7 1.6-3.6.2 1.2.8 1.9 1.6 2.2-.3-2.4.2-4.6 1-6.7z" fill="currentColor"/></svg>',
    review: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M2.5 8a5.5 5.5 0 1 0 1.7-4"/><path d="M2.5 2.5v3h3"/><path d="M8 5v3.2l2 1.3"/></svg>',
    bulb: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M6 12.5h4M6.5 14.5h3M8 1.5a4.5 4.5 0 0 0-2.6 8.2c.4.3.6.7.6 1.2v.6h4v-.6c0-.5.2-.9.6-1.2A4.5 4.5 0 0 0 8 1.5z"/></svg>',
    target: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="3"/><circle cx="8" cy="8" r=".8" fill="currentColor"/></svg>',
    check: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5"/></svg>',
    arrow: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>'
  };

  /* ---------- toast + confetti ---------- */
  var toastBox;
  function toast(html, kind) {
    if (!toastBox) { toastBox = h("div", "toast-stack"); toastBox.setAttribute("aria-live", "polite"); document.body.appendChild(toastBox); }
    var t = h("div", "toast" + (kind ? " toast-" + kind : ""), html);
    toastBox.appendChild(t);
    setTimeout(function () { t.classList.add("out"); setTimeout(function () { t.remove(); }, 400); }, 3600);
  }
  function confetti(anchor) {
    if (REDUCED || !anchor || !anchor.animate) return;
    var r = anchor.getBoundingClientRect();
    var colors = ["var(--accent)", "var(--good)", "var(--signal)", "var(--t2)", "var(--t3)"];
    for (var i = 0; i < 26; i++) {
      var p = h("span", "confetti");
      p.style.left = (r.left + r.width / 2) + "px"; p.style.top = (r.top + r.height / 2) + "px";
      p.style.background = colors[i % colors.length];
      document.body.appendChild(p);
      var ang = Math.random() * Math.PI * 2, dist = 60 + Math.random() * 110;
      var dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist - 40;
      p.animate([{ transform: "translate(0,0) rotate(0deg)", opacity: 1 }, { transform: "translate(" + dx + "px," + (dy + 90) + "px) rotate(" + (Math.random() * 540) + "deg)", opacity: 0 }],
        { duration: 900 + Math.random() * 500, easing: "cubic-bezier(.2,.6,.3,1)", fill: "forwards" }).onfinish = (function (el) { return function () { el.remove(); }; })(p);
    }
  }

  /* ---------- activity, streaks, stats ---------- */
  function logActivity() {
    var d = jget("da:days", []), t = dayKey();
    if (d.indexOf(t) < 0) { d.push(t); if (d.length > 500) d = d.slice(-500); jset("da:days", d); }
    updateTopbar(); checkBadges();
  }
  function streakInfo() {
    var d = jget("da:days", []), set = {};
    d.forEach(function (x) { set[x] = 1; });
    var cur = new Date(), n = 0;
    if (!set[dayKey(cur)]) cur.setDate(cur.getDate() - 1);
    while (set[dayKey(cur)]) { n++; cur.setDate(cur.getDate() - 1); }
    var sorted = d.slice().sort(), best = 0, run = 0, prev = null;
    sorted.forEach(function (k) { var t = new Date(k + "T12:00:00"); run = (prev && Math.round((t - prev) / DAY) === 1) ? run + 1 : 1; best = Math.max(best, run); prev = t; });
    return { current: n, best: Math.max(best, n), activeToday: !!set[dayKey()] , days: set };
  }
  function quizStates() {
    return keys("da:q:").map(function (k) { var p = k.split(":"); var v = jget(k, null); return v ? { area: p[2], sub: p[3], st: v, key: k } : null; }).filter(Boolean);
  }
  function dueStates() { var now = Date.now(); return quizStates().filter(function (q) { return q.st.due <= now; }).sort(function (a, b) { return a.st.due - b.st.due; }); }
  function stats() {
    var mastered = 0, tiers = {};
    A.tiers.forEach(function (t) { tiers[t.id] = true; });
    A.areas.forEach(function (a) { var d = At.areaDone(a); mastered += d; if (d < a.subs.length) tiers[a.tier] = false; });
    var total = A.areas.reduce(function (s, a) { return s + a.subs.length; }, 0);
    var si = streakInfo();
    return { mastered: mastered, total: total, quizzes: quizStates().length, challenges: keys("da:ch:").length,
      reviews: +(S.get("da:reviews") || 0), streak: si.current, best: si.best, tiers: tiers };
  }

  /* ---------- badges ---------- */
  var BADGES = [
    { id: "first-step", name: "First step", desc: "Master your first subtopic", sym: "1", test: function (s) { return s.mastered >= 1; } },
    { id: "quiz-1", name: "Quick thinker", desc: "Pass your first quick check", sym: "?", test: function (s) { return s.quizzes >= 1; } },
    { id: "quiz-25", name: "Sharp mind", desc: "Pass 25 quick checks", sym: "25", test: function (s) { return s.quizzes >= 25; } },
    { id: "ch-1", name: "Tinkerer", desc: "Solve your first demo challenge", sym: "◎", test: function (s) { return s.challenges >= 1; } },
    { id: "ch-10", name: "Experimenter", desc: "Solve 10 demo challenges", sym: "10", test: function (s) { return s.challenges >= 10; } },
    { id: "ch-40", name: "Lab master", desc: "Solve 40 demo challenges", sym: "40", test: function (s) { return s.challenges >= 40; } },
    { id: "streak-3", name: "On a roll", desc: "Learn 3 days in a row", sym: "3d", test: function (s) { return s.best >= 3; } },
    { id: "streak-7", name: "Habit formed", desc: "Learn 7 days in a row", sym: "7d", test: function (s) { return s.best >= 7; } },
    { id: "streak-30", name: "Unstoppable", desc: "Learn 30 days in a row", sym: "30d", test: function (s) { return s.best >= 30; } },
    { id: "review-10", name: "Memory keeper", desc: "Get 10 review questions right", sym: "R", test: function (s) { return s.reviews >= 10; } },
    { id: "review-50", name: "Long-term memory", desc: "Get 50 review questions right", sym: "R50", test: function (s) { return s.reviews >= 50; } }
  ];
  A.tiers.forEach(function (t, i) {
    BADGES.push({ id: "tier-" + t.id, name: t.name + " done", desc: "Master every subtopic in tier " + (i + 1) + ": " + t.name, sym: "T" + (i + 1), color: t.color,
      test: function (s) { return s.tiers[t.id]; } });
  });
  BADGES.push({ id: "all", name: "Atlas complete", desc: "Master all subtopics", sym: "★", test: function (s) { return s.mastered >= s.total; } });

  function checkBadges(silent) {
    var st = stats(), have = jget("da:badges", []), fresh = [];
    BADGES.forEach(function (b) { if (have.indexOf(b.id) < 0 && b.test(st)) { have.push(b.id); fresh.push(b); } });
    if (fresh.length) {
      jset("da:badges", have);
      if (!silent) fresh.forEach(function (b) { toast('<span class="toast-badge">' + esc(b.sym) + "</span><span><b>Badge earned: " + esc(b.name) + "</b><br>" + esc(b.desc) + "</span>", "badge"); });
    }
    return have;
  }
  function badgeSvg(b, earned) {
    var col = b.color || "var(--accent)";
    return '<svg viewBox="0 0 48 52" aria-hidden="true"><path d="M24 2 44 13.5v25L24 50 4 38.5v-25z" fill="' + (earned ? col : "var(--surface-2)") + '" opacity="' + (earned ? ".16" : "1") + '"/>' +
      '<path d="M24 2 44 13.5v25L24 50 4 38.5v-25z" fill="none" stroke="' + (earned ? col : "var(--line)") + '" stroke-width="2"/>' +
      '<text x="24" y="31" text-anchor="middle" font-size="' + (b.sym.length > 2 ? 11 : 14) + '" font-weight="700" font-family="var(--font-mono)" fill="' + (earned ? col : "var(--ink-3)") + '">' + esc(b.sym) + "</text></svg>";
  }

  /* ---------- top bar: streak + review ---------- */
  var tbStreak, tbReview;
  function setupTopbar() {
    var bar = document.querySelector(".topbar .wrap");
    if (!bar) return;
    var brand = bar.querySelector(".brand");
    if (brand && !brand.querySelector(".brand-text")) {
      Array.prototype.slice.call(brand.childNodes).forEach(function (n) { if (n.nodeType === 3 && n.textContent.trim()) { var sp = h("span", "brand-text", esc(n.textContent.trim())); brand.replaceChild(sp, n); } });
    }
    var theme = bar.querySelector("[data-theme-toggle]");
    tbStreak = h("span", "tb-pill tb-streak"); tbStreak.title = "Days in a row you've learned something";
    tbReview = h("a", "tb-pill tb-review"); tbReview.href = ROOT + "review.html"; tbReview.title = "Spaced review of topics you've passed";
    bar.insertBefore(tbStreak, theme); bar.insertBefore(tbReview, theme);
    if (AREA) {
      var sw = h("div", "mode-switch");
      sw.setAttribute("role", "group"); sw.setAttribute("aria-label", "Reading level");
      sw.innerHTML = '<button type="button" data-mode="beginner">Beginner</button><button type="button" data-mode="deep">Deep</button>';
      var prog = bar.querySelector(".topbar-progress");
      bar.insertBefore(sw, prog || theme);
      sw.addEventListener("click", function (e) { var b = e.target.closest("button[data-mode]"); if (b) setMode(b.getAttribute("data-mode"), true); });
    }
    updateTopbar();
  }
  function updateTopbar() {
    if (!tbStreak) return;
    var si = streakInfo(), due = dueStates().length;
    tbStreak.innerHTML = ICON.flame + '<b class="num">' + si.current + "</b>";
    tbStreak.classList.toggle("lit", si.activeToday);
    tbStreak.setAttribute("aria-label", si.current + " day streak");
    tbReview.innerHTML = ICON.review + '<span class="tb-label">Review</span>' + (due ? '<b class="num due">' + due + "</b>" : "");
  }

  /* ---------- reading level ---------- */
  function setMode(m, announce) {
    if (m !== "beginner" && m !== "deep") m = "beginner";
    document.documentElement.setAttribute("data-mode", m);
    S.set("da:mode", m);
    document.querySelectorAll(".mode-switch button").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-mode") === m ? "true" : "false"); });
    var note = document.querySelector(".mode-note");
    if (note) note.innerHTML = m === "beginner"
      ? "<b>Beginner view.</b> Code, formulas and tables are hidden so you can focus on the ideas. Switch to <b>Deep</b> in the top bar to see everything."
      : "<b>Deep view.</b> Everything is shown, including code, formulas, tables and further reading.";
    if (announce) toast(m === "beginner" ? "Beginner view: showing the ideas, diagrams and demos" : "Deep view: showing code, math and tables too");
  }
  function setupMode() {
    document.querySelectorAll(".content h4").forEach(function (x) { if (/^go deeper/i.test(x.textContent.trim())) x.classList.add("deep-only"); });
    var hero = document.querySelector(".page-hero .wrap");
    if (hero && !hero.querySelector(".mode-note")) hero.appendChild(h("p", "mode-note"));
    setMode(S.get("da:mode") || "beginner", false);
  }

  /* ---------- time estimates + last position ---------- */
  function setupTimes(learn) {
    document.querySelectorAll("section.topic[id]").forEach(function (sec) {
      var clone = sec.cloneNode(true);
      clone.querySelectorAll("svg,pre,script,.widget,.resources,.checklist,.quiz").forEach(function (n) { n.remove(); });
      var words = clone.textContent.split(/\s+/).filter(Boolean).length;
      var demos = sec.querySelectorAll(".widget").length;
      var hasQuiz = learn && learn.quiz && learn.quiz[sec.id];
      var mins = Math.max(4, Math.round(words / 200 + demos * 2.5 + (hasQuiz ? 1.5 : 0)));
      var eb = sec.querySelector(".topic-head .eyebrow");
      if (eb && !eb.querySelector(".mins")) eb.insertAdjacentHTML("beforeend", ' <span class="mins">· ~' + mins + " min</span>");
    });
  }
  function setupLastPosition() {
    var secs = Array.prototype.slice.call(document.querySelectorAll("section.topic[id]"));
    if (!secs.length || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) jset("da:last", { area: AREA, sub: en.target.id, t: Date.now() }); });
    }, { rootMargin: "-30% 0px -60% 0px" });
    secs.forEach(function (s) { io.observe(s); });
  }

  /* ---------- glossary tooltips ---------- */
  function setupGlossary() {
    var G = window.ATLAS_GLOSSARY;
    if (!G || !G.length) return;
    var ci = [], cs = [], map = {};
    G.forEach(function (g, i) {
      g.match.split("|").forEach(function (p) {
        var key = g.cs ? p : p.toLowerCase();
        map[(g.cs ? "C:" : "I:") + key] = i;
        (g.cs ? cs : ci).push(p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
      });
    });
    var byLen = function (a, b) { return b.length - a.length; };
    var reI = ci.length ? new RegExp("\\b(" + ci.sort(byLen).join("|") + ")\\b", "gi") : null;
    var reC = cs.length ? new RegExp("\\b(" + cs.sort(byLen).join("|") + ")\\b", "g") : null;
    var SKIP = "a,code,pre,svg,.katex,h1,h2,h3,h4,button,label,select,option,textarea,.widget,.quiz,.challenge,.term,.eyebrow,.resources,.chip,.callout-title,script,style,output,th";
    var scopes = document.querySelectorAll(".overview, section.topic, .capstone");
    scopes.forEach(function (scope) {
      var used = {};
      var walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
        acceptNode: function (n) { if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT; var p = n.parentElement; return p && !p.closest(SKIP) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; }
      });
      var nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(function (node) {
        var guard = 0;
        while (node && guard++ < 20) {
          var best = null;
          [[reI, "I:"], [reC, "C:"]].forEach(function (pair) {
            var re = pair[0]; if (!re) return; re.lastIndex = 0; var m;
            while ((m = re.exec(node.nodeValue))) {
              var key = pair[1] + (pair[1] === "I:" ? m[1].toLowerCase() : m[1]);
              var idx = map[key];
              if (idx == null || used[idx]) continue;
              if (!best || m.index < best.index) best = { index: m.index, text: m[1], idx: idx };
              break;
            }
          });
          if (!best) break;
          used[best.idx] = true;
          var after = node.splitText(best.index);
          var rest = after.splitText(best.text.length);
          var span = h("span", "term");
          span.setAttribute("tabindex", "0"); span.setAttribute("role", "button");
          span.setAttribute("data-g", best.idx); span.setAttribute("aria-label", best.text + ": show definition");
          span.textContent = after.nodeValue;
          after.parentNode.replaceChild(span, after);
          node = rest;
        }
      });
    });
    var tip = h("div", "gloss-tip"); tip.setAttribute("role", "tooltip"); tip.hidden = true; document.body.appendChild(tip);
    var current = null, hideT;
    function show(t) {
      clearTimeout(hideT);
      var g = G[+t.getAttribute("data-g")]; if (!g) return;
      current = t;
      tip.innerHTML = "<b>" + esc(g.term) + "</b><span>" + g.def + "</span>";
      tip.hidden = false;
      var r = t.getBoundingClientRect(), tw = Math.min(320, window.innerWidth - 24);
      tip.style.width = tw + "px";
      var left = Math.max(12, Math.min(r.left + r.width / 2 - tw / 2, window.innerWidth - tw - 12));
      tip.style.left = left + "px";
      var below = r.bottom + 10, th = tip.offsetHeight;
      tip.style.top = (below + th > window.innerHeight - 8 ? r.top - th - 10 : below) + "px";
    }
    function hide() { hideT = setTimeout(function () { tip.hidden = true; current = null; }, 120); }
    document.addEventListener("mouseover", function (e) { var t = e.target.closest && e.target.closest(".term"); if (t) show(t); });
    document.addEventListener("mouseout", function (e) { var t = e.target.closest && e.target.closest(".term"); if (t) hide(); });
    document.addEventListener("focusin", function (e) { if (e.target.classList && e.target.classList.contains("term")) show(e.target); });
    document.addEventListener("focusout", function (e) { if (e.target.classList && e.target.classList.contains("term")) hide(); });
    document.addEventListener("click", function (e) { var t = e.target.closest && e.target.closest(".term"); if (t) { current === t && !tip.hidden ? (tip.hidden = true, current = null) : show(t); } else if (!tip.hidden && !e.target.closest(".gloss-tip")) { tip.hidden = true; } });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") tip.hidden = true; if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("term")) { e.preventDefault(); show(e.target); } });
    window.addEventListener("scroll", function () { if (!tip.hidden) tip.hidden = true; }, { passive: true });
  }

  /* ---------- quizzes ---------- */
  function qKey(area, sub) { return "da:q:" + area + ":" + sub; }
  function schedulePass(area, sub) {
    var k = qKey(area, sub), st = jget(k, null), now = Date.now();
    if (!st) st = { box: 1, due: now + INTERVALS[1] * DAY, passes: 0 };
    st.passes = (st.passes || 0) + 1; st.last = now;
    jset(k, st);
  }
  function questionHTML(q, i, name) {
    var order = shuffle(q.choices.map(function (c, j) { return j; }));
    return '<li class="qq" data-answer="' + q.answer + '"><p class="qq-text">' + q.q + '</p><div class="qq-choices" role="group" aria-label="Question ' + (i + 1) + ' choices">' +
      order.map(function (j) { return '<button type="button" class="qq-choice" data-i="' + j + '">' + q.choices[j] + "</button>"; }).join("") +
      '</div><p class="qq-why" hidden><span class="qq-verdict"></span> ' + q.why + "</p></li>";
  }
  function renderQuiz(sec, area, sub, qs) {
    if (!qs || !qs.length || sec.querySelector(".quiz")) return;
    var box = h("div", "quiz");
    var passed = !!jget(qKey(area.id, sub), null);
    box.innerHTML = '<div class="quiz-head"><span class="quiz-icon">' + ICON.bulb + '</span><div><span class="eyebrow">Quick check</span><p class="quiz-title">' + qs.length +
      " questions. Get them all right to mark this subtopic as mastered.</p></div>" + (passed ? '<span class="quiz-badge">' + ICON.check + "Passed</span>" : "") + "</div>" +
      '<ol class="quiz-qs">' + qs.map(function (q, i) { return questionHTML(q, i); }).join("") + "</ol>" +
      '<div class="quiz-foot" hidden><span class="quiz-score"></span><button type="button" class="btn quiz-retry">Try again</button></div>';
    var anchor = Array.prototype.slice.call(sec.querySelectorAll("h4")).find(function (x) { return /^check yourself/i.test(x.textContent.trim()); });
    if (anchor) sec.insertBefore(box, anchor); else sec.appendChild(box);
    renderMath(box);
    var answered = 0, right = 0;
    box.addEventListener("click", function (e) {
      var b = e.target.closest(".qq-choice"); if (b) {
        var li = b.closest(".qq"); if (li.classList.contains("done")) return;
        var ok = +b.getAttribute("data-i") === +li.getAttribute("data-answer");
        li.classList.add("done", ok ? "right" : "wrong");
        b.classList.add(ok ? "picked-right" : "picked-wrong");
        li.querySelectorAll(".qq-choice").forEach(function (c) { c.disabled = true; if (+c.getAttribute("data-i") === +li.getAttribute("data-answer")) c.classList.add("is-answer"); });
        var why = li.querySelector(".qq-why"); why.hidden = false; why.querySelector(".qq-verdict").textContent = ok ? "Correct." : "Not quite.";
        answered++; if (ok) right++;
        logActivity();
        if (answered === qs.length) finish();
        return;
      }
      if (e.target.closest(".quiz-retry")) {
        box.querySelector(".quiz-qs").innerHTML = shuffle(qs).map(function (q, i) { return questionHTML(q, i); }).join("");
        renderMath(box);
        box.querySelector(".quiz-foot").hidden = true; answered = 0; right = 0;
      }
    });
    function finish() {
      var foot = box.querySelector(".quiz-foot"), score = box.querySelector(".quiz-score");
      foot.hidden = false;
      var retry = box.querySelector(".quiz-retry");
      if (right === qs.length) {
        score.innerHTML = ICON.check + " <b>" + right + "/" + qs.length + "</b>. Marked as mastered. This topic will come back for a short review " + fmtDate(Date.now() + DAY) + ".";
        score.className = "quiz-score pass";
        retry.textContent = "Take it again";
        At.setMastered(area.id, sub, true);
        if (At.refreshTopic) At.refreshTopic();
        schedulePass(area.id, sub);
        if (!box.querySelector(".quiz-badge")) box.querySelector(".quiz-head").insertAdjacentHTML("beforeend", '<span class="quiz-badge">' + ICON.check + "Passed</span>");
        confetti(score); logActivity();
      } else {
        score.innerHTML = "<b>" + right + "/" + qs.length + "</b>. Read the explanations above, then try again. The questions come back in a new order.";
        score.className = "quiz-score";
        retry.textContent = "Try again";
      }
    }
  }

  /* ---------- demo challenges ---------- */
  function renderChallenges(area, list) {
    (list || []).forEach(function (ch, i) {
      var w = document.getElementById(ch.widget);
      if (!w || w.querySelector(".challenge")) return;
      var key = "da:ch:" + area.id + ":" + (ch.id || i);
      var solved = S.get(key) === "1";
      var bar = h("div", "challenge" + (solved ? " solved" : ""));
      bar.innerHTML = '<span class="ch-icon">' + ICON.target + '</span><div class="ch-body"><span class="ch-tag">Challenge</span><p class="ch-goal">' + ch.goal + "</p>" +
        (ch.hint ? '<p class="ch-hint" hidden>' + ch.hint + "</p>" : "") + '</div><div class="ch-side"><span class="ch-state">' + (solved ? ICON.check + "Solved" : "Not solved yet") + "</span>" +
        (ch.hint ? '<button type="button" class="ch-hint-btn">Hint</button>' : "") + "</div>";
      var head = w.querySelector(".widget-head");
      if (head && head.nextSibling) w.insertBefore(bar, head.nextSibling); else w.insertBefore(bar, w.firstChild);
      renderMath(bar);
      var hb = bar.querySelector(".ch-hint-btn");
      if (hb) hb.addEventListener("click", function () { var p = bar.querySelector(".ch-hint"); p.hidden = !p.hidden; hb.textContent = p.hidden ? "Hint" : "Hide hint"; });
      var timers = [];
      function test() {
        if (S.get(key) === "1" && bar.classList.contains("solved")) return;
        var ok = false; try { ok = !!ch.check(w); } catch (e) { ok = false; }
        if (ok) {
          S.set(key, "1"); bar.classList.add("solved");
          bar.querySelector(".ch-state").innerHTML = ICON.check + "Solved";
          confetti(bar.querySelector(".ch-state"));
          toast("<b>Challenge solved!</b> " + (ch.success || "Nice work."), "good");
          logActivity();
        }
      }
      function soon() { timers.forEach(clearTimeout); timers = [80, 450, 1200, 2600, 5000, 8000, 12000, 18000, 25000].map(function (t) { return setTimeout(test, t); }); }
      ["input", "change", "click", "pointerup", "keyup"].forEach(function (ev) { w.addEventListener(ev, function (e) { if (e.target.closest && e.target.closest(".challenge")) return; soon(); }); });
    });
  }

  /* ---------- home page ---------- */
  function setupHome() {
    var hero = document.querySelector(".home-hero");
    if (!hero || document.querySelector(".engage")) return;
    var st = stats(), si = streakInfo(), due = dueStates(), last = jget("da:last", null), earned = checkBadges(true);
    var la = last && areaById(last.area); if (la && !la.live) la = null;
    var firstLive = A.areas.find(function (x) { return x.live; }) || A.areas[0];
    var cont = la
      ? '<a class="eg-card eg-continue" href="topics/' + la.file + "#" + esc(last.sub) + '"><span class="eyebrow">Continue where you left off</span><strong>' + At.pad(la.n) + " · " + esc(subTitle(la, last.sub)) + "</strong><span class=\"muted\">" + esc(la.title) + "</span><span class=\"eg-go\">Resume " + ICON.arrow + "</span></a>"
      : '<a class="eg-card eg-continue" href="topics/' + firstLive.file + '"><span class="eyebrow">Start here</span><strong>' + At.pad(firstLive.n) + ' · ' + esc(firstLive.subs[0][1]) + '</strong><span class="muted">Each lesson takes about 10 minutes</span><span class="eg-go">Start learning ' + ICON.arrow + "</span></a>";
    var week = "";
    for (var i = 6; i >= 0; i--) { var d = new Date(); d.setDate(d.getDate() - i); var on = si.days[dayKey(d)]; week += '<span class="wk' + (on ? " on" : "") + '" title="' + d.toLocaleDateString(undefined, { weekday: "long" }) + '">' + d.toLocaleDateString(undefined, { weekday: "narrow" }) + "</span>"; }
    var streakCard = '<div class="eg-card eg-streak"><span class="eyebrow">Streak</span><div class="eg-big"><span class="flame' + (si.activeToday ? " lit" : "") + '">' + ICON.flame + '</span><span class="num">' + si.current + "</span><span class=\"muted\">day" + (si.current === 1 ? "" : "s") + "</span></div><div class=\"week\">" + week + "</div><span class=\"muted small\">" +
      (si.activeToday ? "You've learned today. Come back tomorrow to keep it going." : si.current ? "Do one quick check today to keep your streak." : "Pass a quick check or solve a challenge to start a streak.") + "</span></div>";
    var next = quizStates().sort(function (a, b) { return a.st.due - b.st.due; })[0];
    var reviewCard = '<a class="eg-card eg-review" href="review.html"><span class="eyebrow">Daily review</span><div class="eg-big"><span class="num">' + due.length + '</span><span class="muted">due</span></div><span class="muted small">' +
      (due.length ? "A few quick questions on topics you passed. About " + Math.max(1, Math.round(Math.min(due.length, 12) * 0.5)) + " min." : next ? "All caught up. Next review " + fmtDate(next.st.due) + "." : "Pass quick checks on topic pages and they'll come back here at the right time.") +
      '</span><span class="eg-go">' + (due.length ? "Start review" : "Open review") + " " + ICON.arrow + "</span></a>";
    var badges = BADGES.map(function (b) { var on = earned.indexOf(b.id) >= 0; return '<div class="badge' + (on ? " earned" : "") + '" title="' + esc(b.desc) + '">' + badgeSvg(b, on) + '<span class="b-name">' + esc(b.name) + '</span><span class="b-desc">' + esc(b.desc) + "</span></div>"; }).join("");
    var sec = h("section", "engage");
    sec.innerHTML = '<div class="wrap"><div class="eg-row">' + cont + streakCard + reviewCard + '</div>' +
      '<div class="eg-badges"><div class="section-head"><h2>Badges</h2><span class="muted" style="font-size:.92rem">' + earned.length + " of " + BADGES.length + " earned · " + st.quizzes + " quick checks passed · " + st.challenges + " challenges solved</span></div>" +
      '<div class="badge-grid">' + badges + "</div></div></div>";
    hero.parentNode.insertBefore(sec, hero.nextSibling);
  }

  /* ---------- review page ---------- */
  function setupReview() {
    var root = document.getElementById("review-root");
    if (!root) return;
    var L = window.ATLAS_LEARN;
    function pool(list) {
      return list.map(function (q) { var area = areaById(q.area), qs = L[q.area] && L[q.area].quiz && L[q.area].quiz[q.sub]; return area && qs && qs.length ? { area: area, sub: q.sub, key: q.key, st: q.st, q: qs[Math.floor(Math.random() * qs.length)] } : null; }).filter(Boolean);
    }
    function intro() {
      var due = pool(dueStates()), all = quizStates();
      var next = all.slice().sort(function (a, b) { return a.st.due - b.st.due; }).find(function (x) { return x.st.due > Date.now(); });
      var html = '<div class="rv-intro">';
      if (due.length) {
        html += '<p class="eyebrow">Today</p><h1>' + due.length + " topic" + (due.length === 1 ? "" : "s") + " to review</h1><p class=\"lede\">One question per topic. Topics you get right come back later and later (1, 3, 7, 21, then 60 days). Topics you miss come back tomorrow.</p>" +
          '<div class="rv-actions"><button type="button" class="btn primary" id="rv-start">Start review (' + Math.min(due.length, 12) + " questions)</button></div>";
      } else if (all.length) {
        html += '<p class="eyebrow">All caught up</p><h1>Nothing due right now</h1><p class="lede">' + (next ? "Your next review is " + fmtDate(next.st.due) + ". " : "") + "You can still practise the topics you've passed.</p>" +
          '<div class="rv-actions"><button type="button" class="btn primary" id="rv-practice">Practise anyway (' + Math.min(all.length, 8) + " questions)</button></div>";
      } else {
        html += '<p class="eyebrow">Daily review</p><h1>Your review deck is empty</h1><p class="lede">Every subtopic ends with a three-question quick check. Pass one and that topic is added here, so it comes back right before you would forget it.</p>' +
          '<div class="rv-actions"><a class="btn primary" href="topics/' + (A.areas.find(function (x) { return x.live; }) || A.areas[0]).file + '">Start learning</a></div>';
      }
      html += "</div>";
      if (all.length) {
        var boxes = [0, 0, 0, 0, 0, 0]; all.forEach(function (x) { boxes[Math.min(5, x.st.box || 1)]++; });
        html += '<div class="rv-boxes"><p class="eyebrow">How well you know your topics</p><div class="rv-box-row">' + [1, 2, 3, 4, 5].map(function (b) {
          return '<div class="rv-box"><span class="num">' + boxes[b] + '</span><span class="muted small">' + ["", "New", "Learning", "Familiar", "Strong", "Mastered"][b] + "</span><span class=\"rv-int\">every " + INTERVALS[b] + "d</span></div>";
        }).join("") + "</div></div>";
      }
      root.innerHTML = html;
      var s1 = document.getElementById("rv-start"); if (s1) s1.onclick = function () { run(shuffle(due).slice(0, 12), true); };
      var s2 = document.getElementById("rv-practice"); if (s2) s2.onclick = function () { run(shuffle(pool(all)).slice(0, 8), false); };
    }
    function run(items, scheduled) {
      var i = 0, right = 0;
      function card() {
        if (i >= items.length) return done();
        var it = items[i], q = it.q;
        var order = shuffle(q.choices.map(function (c, j) { return j; }));
        root.innerHTML = '<div class="rv-card"><div class="rv-top"><span class="eyebrow">' + At.pad(it.area.n) + " · " + esc(it.area.title) + '</span><span class="muted small num">' + (i + 1) + " / " + items.length + '</span></div><div class="bar rv-prog"><i style="width:' + (i / items.length * 100) + '%"></i></div>' +
          '<h2 class="rv-sub">' + esc(subTitle(it.area, it.sub)) + '</h2><p class="qq-text">' + q.q + '</p><div class="qq-choices">' + order.map(function (j) { return '<button type="button" class="qq-choice" data-i="' + j + '">' + q.choices[j] + "</button>"; }).join("") +
          '</div><p class="qq-why" hidden></p><div class="rv-next" hidden><a class="rv-link" href="topics/' + it.area.file + "#" + esc(it.sub) + '">Revisit this topic</a><button type="button" class="btn primary" id="rv-next-btn">' + (i + 1 < items.length ? "Next question" : "See results") + "</button></div></div>";
        renderMath(root);
        root.querySelectorAll(".qq-choice").forEach(function (b) {
          b.onclick = function () {
            var ok = +b.getAttribute("data-i") === q.answer;
            root.querySelectorAll(".qq-choice").forEach(function (c) { c.disabled = true; if (+c.getAttribute("data-i") === q.answer) c.classList.add("is-answer"); });
            b.classList.add(ok ? "picked-right" : "picked-wrong");
            var why = root.querySelector(".qq-why"); why.hidden = false;
            why.innerHTML = "<b>" + (ok ? "Correct." : "Not quite.") + "</b> " + q.why; renderMath(why);
            if (ok) right++;
            if (scheduled) {
              var st = jget(it.key, { box: 1 }), now = Date.now();
              st.box = ok ? Math.min(5, (st.box || 1) + 1) : 1;
              st.due = now + INTERVALS[st.box] * DAY; st.last = now;
              jset(it.key, st);
            }
            if (ok) S.set("da:reviews", String(+(S.get("da:reviews") || 0) + 1));
            logActivity();
            root.querySelector(".rv-next").hidden = false;
            document.getElementById("rv-next-btn").onclick = function () { i++; card(); };
          };
        });
      }
      function done() {
        root.innerHTML = '<div class="rv-card rv-done"><p class="eyebrow">Session complete</p><h1><span class="num">' + right + " / " + items.length + "</span> correct</h1><p class=\"lede\">" +
          (right === items.length ? "Perfect. Those topics move further out in your schedule." : "Topics you missed will come back tomorrow. Revisiting their pages now helps the most.") +
          '</p><div class="rv-actions"><a class="btn primary" href="index.html">Back to the atlas</a><button type="button" class="btn" id="rv-again">Review screen</button></div></div>';
        confetti(root.querySelector("h1"));
        document.getElementById("rv-again").onclick = intro;
      }
      card();
    }
    intro();
  }

  /* ---------- boot ---------- */
  function boot() {
    setupTopbar();
    checkBadges(true);
    document.addEventListener("da:mastered", function (e) { if (e.detail && e.detail.on) logActivity(); else { updateTopbar(); } });
    if (AREA) {
      setupMode();
      Promise.all([loadScript(BASE + "learn/" + AREA + ".js"), loadScript(BASE + "glossary.js")]).then(function () {
        var area = areaById(AREA), learn = window.ATLAS_LEARN[AREA];
        if (learn) {
          document.querySelectorAll("section.topic[id]").forEach(function (sec) { renderQuiz(sec, area, sec.id, learn.quiz && learn.quiz[sec.id]); });
          renderChallenges(area, learn.challenges);
        }
        setupTimes(learn);
        setupGlossary();
        document.dispatchEvent(new CustomEvent("da:ready"));
      });
    }
    if (PAGE === "home") setupHome();
    if (PAGE === "review") setupReview();
  }
  boot();
})();
