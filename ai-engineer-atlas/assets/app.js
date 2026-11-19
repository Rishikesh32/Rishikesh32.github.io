/* AI Engineer Atlas — shared behaviour: theme, progress, contents, checklists, map. */
(function () {
  "use strict";
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  window.AtlasStore = store;
  if (/\/topics\/[^/]+\.html$/.test(location.pathname)) {
    document.documentElement.classList.add("app-loading");
    setTimeout(function () { document.documentElement.classList.remove("app-loading"); }, 6000);
  }
  var BASE = ((document.currentScript && document.currentScript.src) || "").replace(/app\.js(\?.*)?$/, "");

  /* ---- theme (applied immediately to avoid a flash) ---- */
  var root = document.documentElement;
  var savedTheme = store.get("atlas:theme");
  // warm light is the default; dark mode is an opt-in that's remembered
  root.setAttribute("data-theme", savedTheme === "dark" ? "dark" : "light");
  var ICON_MOON = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16.5 12.3A6.8 6.8 0 0 1 7.7 3.5a6.8 6.8 0 1 0 8.8 8.8z"/></svg>';
  var ICON_SUN = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="10" cy="10" r="4"/><path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M4 4l1.4 1.4M14.6 14.6L16 16M4 16l1.4-1.4M14.6 5.4L16 4"/></svg>';
  function syncToggles() {
    var dark = root.getAttribute("data-theme") === "dark";
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.innerHTML = dark ? ICON_SUN : ICON_MOON;
      b.setAttribute("aria-label", dark ? "Switch to warm light mode" : "Switch to dark mode");
      b.setAttribute("title", dark ? "Warm light mode" : "Dark mode");
      b.setAttribute("aria-pressed", dark ? "true" : "false");
    });
  }
  document.addEventListener("DOMContentLoaded", syncToggles);
  function currentTheme() {
    var t = root.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-theme-toggle]");
    if (!b) return;
    var next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    store.set("atlas:theme", next);
    syncToggles();
    document.dispatchEvent(new CustomEvent("atlas:theme", { detail: next }));
  });

  /* ---- progress helpers ---- */
  var A = window.ATLAS || { tiers: [], areas: [] };
  function mKey(area, sub) { return "atlas:m:" + area + ":" + sub; }
  function isMastered(area, sub) { return store.get(mKey(area, sub)) === "1"; }
  function setMastered(area, sub, on) { on ? store.set(mKey(area, sub), "1") : store.del(mKey(area, sub)); }
  function areaDone(area) { return area.subs.filter(function (s) { return isMastered(area.id, s[0]); }).length; }
  function tierOf(area) { return A.tiers.find(function (t) { return t.id === area.tier; }); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  window.Atlas = { isMastered: isMastered, setMastered: setMastered, areaDone: areaDone, data: A, base: BASE, tierOf: tierOf, pad: pad };

  var ICON_CHECK = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5"/></svg>';
  var ICON_CIRCLE = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="8" cy="8" r="5.6"/></svg>';

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (html != null) n.innerHTML = html;
    return n;
  }

  /* ================= topic pages ================= */
  function initTopic(areaId) {
    var area = A.areas.find(function (a) { return a.id === areaId; });
    if (!area) return;
    var tier = tierOf(area);
    document.body.style.setProperty("--tier", tier ? tier.color : "var(--accent)");

    // eyebrow + meta chips
    var eb = document.querySelector('[data-fill="eyebrow"]');
    if (eb) eb.innerHTML = '<span class="tier-dot"></span><span>Area ' + pad(area.n) + " of " + A.areas.length + "</span><span>·</span><span>" + (tier ? tier.name : "") + "</span>";
    var meta = document.querySelector('[data-fill="meta"]');
    if (meta) {
      var h = '<span class="chip"><b>' + area.subs.length + "</b> subtopics</span>" +
              '<span class="chip">Time <b>' + area.weeks + "</b></span>";
      if (area.prereqs.length) {
        h += area.prereqs.map(function (p) {
          var pa = A.areas.find(function (a) { return a.n === p; });
          return pa ? '<a class="chip" href="' + pa.file + '">Builds on <b>' + pad(pa.n) + " " + pa.title + "</b></a>" : "";
        }).join("");
      } else {
        h += '<span class="chip">No prerequisites</span>';
      }
      meta.innerHTML = h;
    }
    var crumb = document.querySelector('[data-fill="crumb"]');
    if (crumb) crumb.textContent = pad(area.n) + " · " + area.title;

    // sections, mastered buttons, contents
    var sections = Array.prototype.slice.call(document.querySelectorAll("section.topic[id]"));
    var tocList = document.querySelector('[data-fill="toc"]');
    var links = {};
    sections.forEach(function (sec, i) {
      var id = sec.id;
      var h2 = sec.querySelector("h2");
      var title = h2 ? h2.textContent.trim() : id;
      var head = sec.querySelector(".topic-head");
      if (head && !head.querySelector(".master-btn")) {
        var btn = el("button", { type: "button", class: "master-btn", "aria-pressed": "false", "data-sub": id });
        head.appendChild(btn);
      }
      if (tocList) {
        var li = el("li");
        var a = el("a", { href: "#" + id }, '<span class="dot" aria-hidden="true"></span><span>' + title + "</span>");
        li.appendChild(a);
        tocList.appendChild(li);
        links[id] = a;
      }
    });

    function refresh() {
      var done = 0;
      sections.forEach(function (sec) {
        var on = isMastered(area.id, sec.id);
        if (on) done++;
        var btn = sec.querySelector(".master-btn");
        if (btn) {
          btn.setAttribute("aria-pressed", on ? "true" : "false");
          btn.innerHTML = (on ? ICON_CHECK + "Mastered" : ICON_CIRCLE + "Mark as mastered");
        }
        if (links[sec.id]) links[sec.id].classList.toggle("done", on);
      });
      var total = sections.length || 1;
      document.querySelectorAll('[data-fill="progress-bar"]').forEach(function (b) { b.style.width = (done / total * 100) + "%"; });
      document.querySelectorAll('[data-fill="progress-text"]').forEach(function (t) { t.textContent = done + " / " + sections.length; });
    }
    document.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest(".master-btn");
      if (!b) return;
      var sub = b.getAttribute("data-sub");
      setMastered(area.id, sub, !isMastered(area.id, sub));
      refresh();
      document.dispatchEvent(new CustomEvent("atlas:mastered", { detail: { area: area.id, sub: sub, on: isMastered(area.id, sub) } }));
    });
    refresh();
    window.Atlas.refreshTopic = refresh;
    window.Atlas.area = area;

    // scroll spy
    if ("IntersectionObserver" in window && tocList) {
      var visible = {};
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
        var first = sections.find(function (s) { return visible[s.id]; });
        if (first) {
          Object.keys(links).forEach(function (k) { links[k].classList.toggle("active", k === first.id); });
        }
      }, { rootMargin: "-80px 0px -60% 0px" });
      sections.forEach(function (s) { io.observe(s); });
    }

    // checklists
    document.querySelectorAll(".checklist input[type=checkbox][data-key]").forEach(function (cb) {
      var k = "atlas:c:" + area.id + ":" + cb.getAttribute("data-key");
      cb.checked = store.get(k) === "1";
      cb.addEventListener("change", function () { cb.checked ? store.set(k, "1") : store.del(k); });
    });

    // pager
    var pager = document.querySelector('[data-fill="pager"]');
    if (pager) {
      var idx = A.areas.indexOf(area);
      var prev = A.areas[idx - 1], next = A.areas[idx + 1];
      var ph = "";
      ph += prev ? '<a class="prev" href="' + prev.file + '"><span class="eyebrow">← Previous · ' + pad(prev.n) + "</span><strong>" + prev.title + "</strong></a>"
                 : '<a class="prev" href="../index.html"><span class="eyebrow">← Back</span><strong>The atlas</strong></a>';
      ph += next ? '<a class="next" href="' + next.file + '"><span class="eyebrow">Next · ' + pad(next.n) + " →</span><strong>" + next.title + "</strong></a>"
                 : '<a class="next" href="../index.html"><span class="eyebrow">Finished →</span><strong>Back to the atlas</strong></a>';
      pager.innerHTML = ph;
    }
  }

  /* ---- code copy buttons (all pages) ---- */
  function initCode() {
    document.querySelectorAll("pre.code").forEach(function (pre) {
      if (pre.querySelector(".copy-btn")) return;
      var b = el("button", { type: "button", class: "copy-btn" }, "Copy");
      b.addEventListener("click", function () {
        var code = pre.querySelector("code") || pre;
        var text = code.innerText;
        var done = function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy"; }, 1400); };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () { selectText(code); });
        } else selectText(code);
      });
      pre.appendChild(b);
    });
  }
  function selectText(node) {
    var r = document.createRange(); r.selectNodeContents(node);
    var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  }

  /* ---- math ---- */
  function initMath() {
    if (typeof window.renderMathInElement === "function") {
      window.renderMathInElement(document.body, {
        delimiters: [
          { left: "\\[", right: "\\]", display: true },
          { left: "\\(", right: "\\)", display: false }
        ],
        ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
        throwOnError: false
      });
    }
  }


  /* ================= animation: diagrams build in, flows move ================= */
  var REDUCED = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SHAPES = "rect,circle,ellipse,polygon,text,path,line,polyline";
  var FLOW_SEL = ".d-line-accent,.d-line-signal,.map-edge";

  function partsOf(svg, opts) {
    if (opts && opts.parts) return Array.prototype.slice.call(svg.querySelectorAll(opts.parts));
    return Array.prototype.slice.call(svg.querySelectorAll(SHAPES)).filter(function (n) {
      return !n.closest("defs,marker,clipPath,mask,pattern,symbol,title") && !n.classList.contains("flow-dot");
    });
  }
  function isStroke(n) {
    var tag = n.tagName.toLowerCase();
    if (tag !== "line" && tag !== "path" && tag !== "polyline") return false;
    var cs = getComputedStyle(n);
    var fillNone = cs.fill === "none" || cs.fill === "transparent" || cs.fillOpacity === "0";
    var dashed = cs.strokeDasharray && cs.strokeDasharray !== "none";
    return fillNone && !dashed && typeof n.getTotalLength === "function";
  }
  function pathData(n) {
    var tag = n.tagName.toLowerCase();
    if (tag === "path") return n.getAttribute("d");
    if (tag === "line") return "M" + n.getAttribute("x1") + "," + n.getAttribute("y1") + " L" + n.getAttribute("x2") + "," + n.getAttribute("y2");
    if (tag === "polyline") {
      var pts = (n.getAttribute("points") || "").trim().split(/[\s,]+/);
      var d = "";
      for (var i = 0; i + 1 < pts.length; i += 2) d += (i ? " L" : "M") + pts[i] + "," + pts[i + 1];
      return d;
    }
    return null;
  }

  function buildIn(svg, opts) {
    opts = opts || {};
    if (REDUCED || typeof svg.animate !== "function" && !(svg.firstElementChild && svg.firstElementChild.animate)) return 0;
    var parts = partsOf(svg, opts);
    if (!parts.length) return 0;
    var vb = svg.viewBox && svg.viewBox.baseVal;
    var wide = !vb || !vb.width || vb.width >= vb.height;
    var span = Math.max(1, wide ? (vb ? vb.width : 600) : vb.height);
    var spread = opts.spread || 1100;
    var longest = 0;
    parts.forEach(function (n, i) {
      var box; try { box = n.getBBox(); } catch (e) { box = { x: 0, y: 0, width: 0, height: 0 }; }
      var pos = wide ? box.x : box.y;
      var delay = Math.max(0, Math.min(1, pos / span)) * spread + (i % 7) * 12;
      var final = getComputedStyle(n).opacity || "1";
      if (!opts.parts && isStroke(n)) {
        var len = 0; try { len = n.getTotalLength(); } catch (e) {}
        if (len > 0) {
          var dur = Math.min(900, 260 + len * 1.4);
          n.animate([
            { strokeDasharray: len + " " + len, strokeDashoffset: len, opacity: final },
            { strokeDasharray: len + " " + len, strokeDashoffset: 0, opacity: final }
          ], { duration: dur, delay: delay + 120, easing: "cubic-bezier(.4,0,.2,1)", fill: "backwards" });
          longest = Math.max(longest, delay + 120 + dur);
          return;
        }
      }
      var frames = n.hasAttribute("transform") || n.tagName.toLowerCase() === "a"
        ? [{ opacity: 0 }, { opacity: final }]
        : [{ opacity: 0, transform: "translateY(6px)" }, { opacity: final, transform: "translateY(0)" }];
      if (n.tagName.toLowerCase() === "a") frames = [{ opacity: 0 }, { opacity: final }];
      n.animate(frames, { duration: 420, delay: delay, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" });
      longest = Math.max(longest, delay + 420);
    });
    return longest;
  }

  function addFlows(svg) {
    if (REDUCED) return;
    svg.querySelectorAll(".flow-dot").forEach(function (d) { d.remove(); });
    var NS = "http://www.w3.org/2000/svg";
    var flows = Array.prototype.slice.call(svg.querySelectorAll(FLOW_SEL)).filter(function (n) {
      if (n.closest("defs,marker")) return false;
      // only arrows carry flow dots; chart curves and brackets have no arrowhead
      return n.hasAttribute("marker-end") || n.hasAttribute("marker-start") || n.classList.contains("d-flow");
    });
    flows.slice(0, 24).forEach(function (n, i) {
      var d = pathData(n);
      if (!d) return;
      var len = 120; try { len = n.getTotalLength(); } catch (e) {}
      var signal = n.classList.contains("d-line-signal");
      var dot = document.createElementNS(NS, "circle");
      dot.setAttribute("r", n.classList.contains("map-edge") ? "3" : "3.6");
      dot.setAttribute("class", "flow-dot" + (signal ? " flow-dot-signal" : ""));
      var mo = document.createElementNS(NS, "animateMotion");
      mo.setAttribute("dur", Math.max(1.2, len / 90).toFixed(2) + "s");
      mo.setAttribute("repeatCount", "indefinite");
      mo.setAttribute("begin", (i * 0.23 % 1.5).toFixed(2) + "s");
      mo.setAttribute("path", d);
      mo.setAttribute("keyPoints", "0;1");
      mo.setAttribute("keyTimes", "0;1");
      mo.setAttribute("calcMode", "linear");
      dot.appendChild(mo);
      var t = n.getAttribute("transform");
      if (t) dot.setAttribute("transform", t);
      n.parentNode.insertBefore(dot, n.nextSibling);
    });
  }

  function play(svg, opts) {
    svg.querySelectorAll(".flow-dot").forEach(function (d) { d.remove(); });
    var t = buildIn(svg, opts);
    setTimeout(function () { addFlows(svg); }, Math.min(t, 1600));
  }

  var watcher = ("IntersectionObserver" in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var svg = en.target;
      if (en.isIntersecting) {
        if (!svg.__played) { svg.__played = true; play(svg, svg.__opts); }
        if (svg.unpauseAnimations) svg.unpauseAnimations();
      } else if (svg.__played && svg.pauseAnimations) {
        svg.pauseAnimations();
      }
    });
  }, { threshold: 0.25 }) : null;

  function animateSvg(svg, opts) {
    svg.__opts = opts;
    if (REDUCED) return;
    if (watcher) watcher.observe(svg); else play(svg, opts);
  }


  /* ================= 3D: extrude flat diagram boxes into blocks ================= */
  var FACE = {
    "d-box":    { f: "var(--surface)",     s: "var(--ink-3)" },
    "d-fill":   { f: "var(--surface-2)",   s: "var(--ink-3)" },
    "d-accent": { f: "var(--accent-soft)", s: "var(--accent)" },
    "d-signal": { f: "var(--signal-soft)", s: "var(--signal)" },
    "d-good":   { f: "var(--good-soft)",   s: "var(--good)" }
  };
  function extrude(svg) {
    if (svg.__extruded) return; svg.__extruded = true;
    var NS = "http://www.w3.org/2000/svg";
    var vb = svg.viewBox && svg.viewBox.baseVal, VW = vb && vb.width ? vb.width : 600;
    var rects = Array.prototype.slice.call(svg.querySelectorAll("rect")).filter(function (r) {
      if (r.closest("defs,marker,pattern,clipPath,mask")) return false;
      var cls = (r.getAttribute("class") || "").split(/\s+/);
      r.__face = null;
      for (var i = 0; i < cls.length; i++) if (FACE[cls[i]]) { r.__face = FACE[cls[i]]; break; }
      if (!r.__face || r.hasAttribute("transform")) return false;
      var w = +r.getAttribute("width") || 0, h = +r.getAttribute("height") || 0;
      return w >= 18 && h >= 14 && w < VW * 0.8;
    });
    var boxes = rects.map(function (r) { return { r: r, x: +r.getAttribute("x") || 0, y: +r.getAttribute("y") || 0, w: +r.getAttribute("width"), h: +r.getAttribute("height") }; });
    var labels = [];
    Array.prototype.slice.call(svg.querySelectorAll("text")).forEach(function (t) { try { var bb = t.getBBox(); if (bb.width) labels.push({ x: bb.x, y: bb.y, w: bb.width, h: bb.height }); } catch (e) {} });
    function hits(a, x0, y0, x1, y1) {
      var over = function (b) { return b.x < x1 && b.x + b.w > x0 && b.y < y1 && b.y + b.h > y0; };
      return boxes.some(function (b) { return b !== a && over(b); }) || labels.some(over);
    }
    boxes.forEach(function (b) {
      var D = Math.max(5, Math.min(11, Math.min(b.w, b.h) * 0.2));
      var topFree = !hits(b, b.x + 1, b.y - D, b.x + b.w + D, b.y - 0.5);
      var sideFree = !hits(b, b.x + b.w + 0.5, b.y - D, b.x + b.w + D, b.y + b.h - 1);
      if (!topFree && !sideFree) return;
      var F = b.r.__face, parent = b.r.parentNode, x = b.x, y = b.y, w = b.w, h = b.h;
      var g = document.createElementNS(NS, "g"); g.setAttribute("class", "x3d");
      var sh = document.createElementNS(NS, "rect");
      sh.setAttribute("x", x - 3); sh.setAttribute("y", y + 5); sh.setAttribute("width", w); sh.setAttribute("height", h);
      sh.setAttribute("rx", Math.min(+b.r.getAttribute("rx") || 0, 6)); sh.setAttribute("class", "x3d-shadow");
      g.appendChild(sh);
      function face(points, kind) {
        var p = document.createElementNS(NS, "polygon");
        p.setAttribute("points", points.map(function (q) { return q[0].toFixed(1) + "," + q[1].toFixed(1); }).join(" "));
        p.setAttribute("class", "x3d-face x3d-" + kind);
        p.setAttribute("style", "fill:" + (kind === "top" ? "color-mix(in srgb, " + F.f + " 82%, #fff)" : "color-mix(in srgb, " + F.f + " 72%, #000)") + ";stroke:" + F.s);
        g.appendChild(p);
      }
      if (sideFree) face([[x + w, y], [x + w + D, y - D], [x + w + D, y + h - D], [x + w, y + h]], "side");
      if (topFree) face([[x, y], [x + D, y - D], [x + w + D, y - D], [x + w, y]], "top");
      parent.insertBefore(g, b.r);
      if (+b.r.getAttribute("rx") > 4) b.r.setAttribute("rx", "4");
      svg.__x3d = true;
    });
    // labels always sit on top of the new faces
    if (svg.__x3d) Array.prototype.slice.call(svg.querySelectorAll("text")).forEach(function (t) { if (!t.closest("defs,marker")) t.parentNode.appendChild(t); });
  }

  /* subtle 3D tilt toward the pointer */
  function tiltable(box) {
    if (REDUCED || box.__tilt || !window.matchMedia("(pointer: fine)").matches) return;
    box.__tilt = true;
    var svg = box.querySelector("svg"); if (!svg) return;
    box.addEventListener("pointermove", function (e) {
      var r = box.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      svg.style.transform = "perspective(1100px) rotateX(" + (-py * 5).toFixed(2) + "deg) rotateY(" + (px * 6).toFixed(2) + "deg)";
    });
    box.addEventListener("pointerleave", function () { svg.style.transform = ""; });
  }
  window.AtlasExtrude = extrude;

  function initAnimations() {
    document.querySelectorAll(".diagram svg").forEach(function (svg) {
      var box = svg.closest(".diagram");
      try { extrude(svg); } catch (e) {}
      if (box) tiltable(box);
      animateSvg(svg);
      if (!REDUCED && box && !box.querySelector(".replay-btn")) {
        var b = el("button", { type: "button", class: "replay-btn", "aria-label": "Replay the diagram animation" },
          '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M3 8a5 5 0 1 0 1.6-3.7"/><path d="M3 2.5v2.8h2.8"/></svg>Replay');
        b.addEventListener("click", function () { play(svg); });
        box.appendChild(b);
      }
    });
  }
  window.AtlasAnimate = { play: play, observe: animateSvg };

  /* ================= home page ================= */
  function initHome() {
    var totalSubs = 0, totalDone = 0;
    A.areas.forEach(function (a) { totalSubs += a.subs.length; totalDone += areaDone(a); });
    var set = function (sel, v) { document.querySelectorAll(sel).forEach(function (n) { n.textContent = v; }); };
    set('[data-fill="n-areas"]', A.areas.length);
    set('[data-fill="n-subs"]', totalSubs);
    set('[data-fill="n-done"]', totalDone);
    var pct = totalSubs ? Math.round(totalDone / totalSubs * 100) : 0;
    set('[data-fill="pct"]', pct + "%");
    document.querySelectorAll('[data-fill="overall-bar"]').forEach(function (b) { b.style.width = pct + "%"; });

    renderMap();
    renderCards();

    var reset = document.getElementById("reset-progress");
    if (reset) {
      var armed = false, t;
      reset.addEventListener("click", function () {
        if (!armed) {
          armed = true; reset.classList.add("armed"); reset.textContent = "Click again to clear all progress";
          t = setTimeout(function () { armed = false; reset.classList.remove("armed"); reset.textContent = "Reset progress"; }, 4000);
          return;
        }
        clearTimeout(t);
        try {
          Object.keys(localStorage).forEach(function (k) { if (k.indexOf("atlas:m:") === 0 || k.indexOf("atlas:c:") === 0) localStorage.removeItem(k); });
        } catch (e) {}
        location.reload();
      });
    }
  }

  function renderCards() {
    var host = document.getElementById("cards");
    if (!host) return;
    var html = "";
    A.tiers.forEach(function (t) {
      var areas = A.areas.filter(function (a) { return a.tier === t.id; });
      html += '<div class="tier-group" style="--tier:' + t.color + '"><div class="tier-group-head"><span class="tier-dot"></span><h3>' + t.name +
              '</h3><span class="muted" style="font-size:.92rem">' + t.blurb + '</span></div><div class="cards">';
      areas.forEach(function (a) {
        var d = areaDone(a), pct = Math.round(d / a.subs.length * 100);
        html += '<a class="area-card" href="topics/' + a.file + '">' +
          '<div class="top"><span class="n">' + pad(a.n) + '</span><span class="eyebrow" style="font-size:.68rem">' + a.weeks + "</span></div>" +
          "<h4>" + a.title + "</h4>" +
          "<p>" + a.summary + "</p>" +
          '<div class="subs">' + a.subs.map(function (s) { return '<span class="' + (isMastered(a.id, s[0]) ? "done" : "") + '">' + s[1] + "</span>"; }).join("") + "</div>" +
          '<div class="foot"><span class="num">' + d + "/" + a.subs.length + '</span><span class="bar"><i style="width:' + pct + '%"></i></span></div>' +
          "</a>";
      });
      html += "</div></div>";
    });
    host.innerHTML = html;
  }

  function renderMap() {
    var host = document.getElementById("map");
    if (!host) return;
    var NS = "http://www.w3.org/2000/svg";
    var colW = 196, gap = 64, padX = 18, top = 70, nodeH = 62, vGap = 22;
    var cols = A.tiers.length;
    var W = padX * 2 + cols * colW + (cols - 1) * gap;
    var maxRows = Math.max.apply(null, A.tiers.map(function (t) { return A.areas.filter(function (a) { return a.tier === t.id; }).length; }));
    var H = top + maxRows * nodeH + (maxRows - 1) * vGap + 20;
    var pos = {};
    A.tiers.forEach(function (t, ci) {
      A.areas.filter(function (a) { return a.tier === t.id; }).forEach(function (a, ri) {
        pos[a.n] = { x: padX + ci * (colW + gap), y: top + ri * (nodeH + vGap), col: ci, row: ri, tier: t };
      });
    });
    var s = '<svg xmlns="' + NS + '" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Learning path map: five tiers from Foundations to Grow, with arrows showing which areas build on which.">';
    s += '<defs><marker id="map-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor" opacity=".6"/></marker></defs>';
    // tier headers
    A.tiers.forEach(function (t, ci) {
      var x = padX + ci * (colW + gap);
      s += '<rect x="' + x + '" y="8" width="' + colW + '" height="3" rx="1.5" fill="' + t.color + '"/>';
      s += '<text class="map-tier-label" x="' + x + '" y="32" fill="' + t.color + '">' + (ci + 1) + " · " + t.name + "</text>";
      s += '<text class="map-tier-blurb" x="' + x + '" y="50">' + t.blurb + "</text>";
    });
    // edges
    var edges = "";
    A.areas.forEach(function (a) {
      var to = pos[a.n];
      if (a.tier === "E") return;
      a.prereqs.forEach(function (p) {
        var from = pos[p];
        if (!from) return;
        var d;
        if (from.col === to.col) {
          if (to.row - from.row !== 1) return;
          var cx = from.x + colW / 2;
          d = "M" + cx + "," + (from.y + nodeH) + " L" + cx + "," + (to.y - 3);
        } else {
          if (to.col - from.col !== 1) return; // only draw links between neighbouring tiers
          var x1 = from.x + colW, y1 = from.y + nodeH / 2, x2 = to.x - 3, y2 = to.y + nodeH / 2;
          var mx = (x1 + x2) / 2;
          d = "M" + x1 + "," + y1 + " C" + mx + "," + y1 + " " + mx + "," + y2 + " " + x2 + "," + y2;
        }
        edges += '<path class="map-edge" data-from="' + p + '" data-to="' + a.n + '" d="' + d + '" marker-end="url(#map-arrow)" style="color:var(--ink-3)"/>';
      });
    });
    s += edges;
    // nodes
    A.areas.forEach(function (a) {
      var p = pos[a.n];
      var d = areaDone(a), frac = d / a.subs.length;
      var title = a.title.length > 24 ? a.title.replace("Retrieval-augmented generation", "RAG").replace("Safety, security & ethics", "Safety & security").replace("Inference & optimization", "Inference & speed") : a.title;
      s += '<a class="map-node" href="topics/' + a.file + '" data-n="' + a.n + '">' +
        '<title>' + a.title + " — " + a.summary + "</title>" +
        '<rect class="node-bg" x="' + p.x + '" y="' + p.y + '" width="' + colW + '" height="' + nodeH + '" rx="9"/>' +
        '<rect x="' + p.x + '" y="' + (p.y + 12) + '" width="3" height="' + (nodeH - 24) + '" rx="1.5" fill="' + p.tier.color + '"/>' +
        '<text class="node-num" x="' + (p.x + 14) + '" y="' + (p.y + 21) + '">' + pad(a.n) + " · " + d + "/" + a.subs.length + "</text>" +
        '<text class="node-title" x="' + (p.x + 14) + '" y="' + (p.y + 40) + '">' + title + "</text>" +
        '<rect class="node-track" x="' + (p.x + 14) + '" y="' + (p.y + 49) + '" width="' + (colW - 28) + '" height="4" rx="2"/>' +
        '<rect x="' + (p.x + 14) + '" y="' + (p.y + 49) + '" width="' + Math.max(0, (colW - 28) * frac) + '" height="4" rx="2" fill="var(--good)"/>' +
        "</a>";
    });
    s += "</svg>";
    host.innerHTML = s;
    var mapSvg = host.querySelector("svg");
    if (mapSvg && !host.__animated) { host.__animated = true; animateSvg(mapSvg, { parts: ".map-node, .map-edge, rect[y='8'], .map-tier-label, .map-tier-blurb", spread: 1300 }); }
    host.querySelectorAll(".map-node").forEach(function (n) {
      var num = n.getAttribute("data-n");
      var on = function (v) {
        host.querySelectorAll('.map-edge[data-from="' + num + '"], .map-edge[data-to="' + num + '"]').forEach(function (e) { e.classList.toggle("hot", v); });
        var self = A.areas.find(function (a) { return String(a.n) === num; });
        (self ? self.prereqs : []).forEach(function (p) {
          var pr = host.querySelector('.map-node[data-n="' + p + '"] .node-bg'); if (pr) pr.style.stroke = v ? "var(--accent)" : "";
        });
        var r = n.querySelector(".node-bg"); if (r) r.style.stroke = v ? "var(--accent)" : "";
      };
      n.addEventListener("mouseenter", function () { on(true); });
      n.addEventListener("mouseleave", function () { on(false); });
      n.addEventListener("focus", function () { on(true); });
      n.addEventListener("blur", function () { on(false); });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var areaId = document.body.getAttribute("data-area");
    if (areaId) initTopic(areaId);
    if (document.body.getAttribute("data-page") === "home") initHome();
    initCode();
    initAnimations();
    if (BASE) {
      if (document.body.getAttribute("data-area")) { var ls = document.createElement("script"); ls.src = BASE + "lesson.js"; ls.async = false; document.body.appendChild(ls); }
      var es = document.createElement("script"); es.src = BASE + "engage.js"; es.async = false; document.body.appendChild(es);
    }
    initMath();
  });
  window.addEventListener("pageshow", function (e) { if (e.persisted && document.body.getAttribute("data-page") === "home") initHome(); });
})();
