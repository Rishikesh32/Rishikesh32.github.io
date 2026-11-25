/* Data Analyst Atlas — isometric scene engine for flagship lessons.
   Scenes are declarative: nodes placed on an isometric grid, steps that add nodes,
   draw links, send animated packets, focus attention and update metric chips.
   Usage (assets/scenes/<area>.js):
     window.ATLAS_SCENES = window.ATLAS_SCENES || {};
     ATLAS_SCENES["<area>/<lesson-id>"] = { metrics, legend, nodes, steps, learn };
   See the scene authoring guide for the full format. */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var C = Math.cos(Math.PI / 6), SN = 0.5;
  var REDUCED = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var KIND = {
    req: { c: "var(--accent)", label: "request" },
    res: { c: "var(--good)", label: "response" },
    miss: { c: "var(--signal)", label: "miss / error" },
    data: { c: "var(--t3)", label: "data" },
    token: { c: "var(--t2)", label: "tokens" },
    grad: { c: "var(--t4)", label: "gradient / update" }
  };
  function col(name) { return /^(t[1-5]|accent|good|signal|ink|ink-2|ink-3)$/.test(name || "") ? "var(--" + name + ")" : (name || "var(--t1)"); }
  function mix(c, pct) { return "color-mix(in srgb, " + c + " " + pct + "%, var(--surface))"; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  function projector(U) { return function (x, y, z) { return [(x - y) * C * U, (x + y) * SN * U - (z || 0) * U]; }; }
  function pts(arr) { return arr.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" "); }
  function nodeTop(n) {
    var t = n.type || "block";
    var z0 = n.z || 0;
    if (t === "cyl") return { x: n.x, y: n.y, z: z0 + (n.h || 1.2) };
    if (t === "pill") return { x: n.x, y: n.y, z: z0 };
    if (t === "stack") { var k = n.n || 3; return { x: n.x + (n.w || 1.6) / 2, y: n.y + (n.d || 1.2) / 2, z: z0 + k * 0.26 }; }
    if (t === "slab") return { x: n.x + (n.w || 4) / 2, y: n.y + (n.d || 3) / 2, z: z0 + 0.15 };
    return { x: n.x + (n.w || 1.6) / 2, y: n.y + (n.d || 1.6) / 2, z: z0 + (n.h == null ? 1 : n.h) };
  }
  function depth(n) { var t = nodeTop(n); return (n.type === "slab" ? -1000 : 0) + t.x + t.y + (n.z || 0) * 0.01; }

  /* ---------- primitives ---------- */
  function drawBox(g, P, x, y, z, w, d, hgt, c, opts) {
    opts = opts || {};
    var b = [P(x, y, z), P(x + w, y, z), P(x + w, y + d, z), P(x, y + d, z)];
    var t = [P(x, y, z + hgt), P(x + w, y, z + hgt), P(x + w, y + d, z + hgt), P(x, y + d, z + hgt)];
    if (!opts.noShadow) el("polygon", { points: pts([P(x + 0.18, y + 0.25, z), P(x + w + 0.18, y + 0.25, z), P(x + w + 0.18, y + d + 0.25, z), P(x + 0.18, y + d + 0.25, z)]), fill: "var(--ink)", opacity: ".07" }, g);
    el("polygon", { points: pts([t[3], t[2], b[2], b[3]]), style: "fill:" + mix(c, 52), class: "iso-face" }, g);
    el("polygon", { points: pts([t[1], t[2], b[2], b[1]]), style: "fill:" + mix(c, 72), class: "iso-face" }, g);
    el("polygon", { points: pts(t), style: "fill:" + mix(c, opts.topPct || 24), class: "iso-face" }, g);
    return t;
  }
  function drawCyl(g, P, n, c, U) {
    var r = n.r || 0.8, hgt = n.h || 1.2, z = n.z || 0;
    var top = P(n.x, n.y, z + hgt), bot = P(n.x, n.y, z);
    var rx = r * U * C * Math.SQRT2, ry = r * U * SN * Math.SQRT2;
    el("ellipse", { cx: bot[0] + 4, cy: bot[1] + 6, rx: rx, ry: ry, fill: "var(--ink)", opacity: ".07" }, g);
    el("path", { d: "M" + (top[0] - rx) + "," + top[1] + " L" + (bot[0] - rx) + "," + bot[1] + " A" + rx + "," + ry + " 0 0 0 " + (bot[0] + rx) + "," + bot[1] + " L" + (top[0] + rx) + "," + top[1] + " Z", style: "fill:" + mix(c, 50), class: "iso-face" }, g);
    var bands = n.bands == null ? 2 : n.bands;
    for (var i = 1; i <= bands; i++) {
      var yy = top[1] + (bot[1] - top[1]) * i / (bands + 1);
      el("path", { d: "M" + (top[0] - rx) + "," + yy + " A" + rx + "," + ry + " 0 0 0 " + (top[0] + rx) + "," + yy, fill: "none", class: "iso-line" }, g);
    }
    el("ellipse", { cx: top[0], cy: top[1], rx: rx, ry: ry, style: "fill:" + mix(c, 22), class: "iso-face" }, g);
  }
  function pill(g, x, y, text, opts) {
    opts = opts || {};
    var fs = opts.small ? 10.5 : 12, padX = opts.small ? 7 : 10, hgt = opts.small ? 19 : 24;
    var w = Math.max(28, text.length * fs * 0.62 + padX * 2);
    var gg = el("g", { class: "iso-pill" + (opts.cls ? " " + opts.cls : "") }, g);
    el("rect", { x: x - w / 2, y: y - hgt / 2, width: w, height: hgt, rx: hgt / 2, class: "pill-bg", style: opts.stroke ? "stroke:" + opts.stroke : null }, gg);
    var t = el("text", { x: x, y: y + fs * 0.35, "text-anchor": "middle", class: "pill-text", "font-size": fs, style: opts.color ? "fill:" + opts.color : null }, gg);
    t.textContent = text;
    return { w: w, h: hgt };
  }

  function drawNode(layer, P, n, id, U, badge, labelLayer) {
    var g = el("g", { class: "iso-node", "data-id": id }, layer);
    var lg = el("g", { class: "iso-node iso-label", "data-id": id }, labelLayer || layer);
    var c = col(n.color), t = n.type || "block";
    var z = n.z || 0;
    if (t === "block") drawBox(g, P, n.x, n.y, z, n.w || 1.6, n.d || 1.6, n.h == null ? 1 : n.h, c);
    else if (t === "slab") { drawBox(g, P, n.x, n.y, z, n.w || 4, n.d || 3, 0.15, c, { topPct: 12, noShadow: true }); }
    else if (t === "cyl") drawCyl(g, P, n, c, U);
    else if (t === "stack") {
      var k = n.n || 3;
      for (var i = 0; i < k; i++) drawBox(g, P, n.x + i * 0.06, n.y - i * 0.06, z + i * 0.26, n.w || 1.6, n.d || 1.2, 0.18, c, { noShadow: i > 0 });
    }
    if (n.icon && t !== "pill" && t !== "slab") {
      var tp = nodeTop(n), q = P(tp.x, tp.y, tp.z);
      var it = el("text", { x: q[0], y: q[1] + 5, "text-anchor": "middle", class: "iso-icon" }, g); it.textContent = n.icon;
    }
    var top = nodeTop(n), p = P(top.x, top.y, top.z);
    if (t === "slab" && (n.w || 4) >= 5) {
      var corner = P(n.x + 0.15, n.y + (n.d || 3) - 0.15, z + 0.15);
      if (n.label) { var lt = el("text", { x: corner[0] + 6, y: corner[1] + 16, class: "slab-label" }, lg); lt.textContent = n.label + (n.sub ? " · " + n.sub : ""); }
    } else {
      var autoGap = 26;
      if (t === "cyl") {
        autoGap = Math.round((n.r || 0.8) * U * 0.707 + 36);
      } else if (t === "block" || t === "stack" || t === "slab") {
        var nw = n.w || (t === "slab" ? 4 : 1.6), nd = n.d || (t === "slab" ? 3 : 1.6);
        autoGap = Math.round((nw + nd) * 0.25 * U + 36);
      }
      var ly = t === "pill" ? p[1] : p[1] - (n.labelGap || autoGap);
      var labelTxt = n.label ? (n.label + (n.sub ? " · " + n.sub : "")) : "";
      if (labelTxt) pill(lg, p[0], ly, labelTxt, { cls: n.focusLabel ? "strong" : "" });
      if (badge != null && badge !== "") pill(lg, p[0], ly - 26, String(badge), { small: true, stroke: c, color: c, cls: "badge" });
    }
    return [g, lg];
  }

  function anchor(P, n) { var t = nodeTop(n); return P(t.x, t.y, t.z); }
  function linkPath(P, a, b, opt) {
    var p = anchor(P, a), q = anchor(P, b);
    var lift = opt && opt.lift != null ? opt.lift : 34;
    var mx = (p[0] + q[0]) / 2, my = Math.min(p[1], q[1]) - lift;
    return "M" + p[0].toFixed(1) + "," + p[1].toFixed(1) + " Q" + mx.toFixed(1) + "," + my.toFixed(1) + " " + q[0].toFixed(1) + "," + q[1].toFixed(1);
  }

  /* ---------- state accumulation ---------- */
  function stateAt(scene, idx) {
    var shown = {}, links = {}, metrics = {}, badges = {};
    for (var i = 0; i <= idx; i++) {
      var st = scene.steps[i] || {};
      (st.add || []).forEach(function (id) { shown[id] = true; });
      (st.remove || []).forEach(function (id) { delete shown[id]; });
      (st.links || []).forEach(function (l) { links[l[0] + ">" + l[1]] = l; });
      (st.unlink || []).forEach(function (l) { delete links[l[0] + ">" + l[1]]; });
      for (var m in (st.metrics || {})) metrics[m] = st.metrics[m];
      for (var b in (st.badges || {})) badges[b] = st.badges[b];
    }
    return { shown: shown, links: links, metrics: metrics, badges: badges };
  }

  function bounds(scene, P, U) {
    var xs = [], ys = [];
    Object.keys(scene.nodes).forEach(function (id) {
      var n = scene.nodes[id], t = n.type || "block";
      var w = n.w || (t === "slab" ? 4 : 1.6), d = n.d || (t === "slab" ? 3 : 1.6), r = n.r || 0.8;
      var corners = t === "cyl" ? [[n.x - r, n.y - r], [n.x + r, n.y + r], [n.x - r, n.y + r], [n.x + r, n.y - r]] : t === "pill" ? [[n.x, n.y]] : [[n.x, n.y], [n.x + w, n.y], [n.x + w, n.y + d], [n.x, n.y + d]];
      corners.forEach(function (c) { var a = P(c[0], c[1], n.z || 0); xs.push(a[0]); ys.push(a[1]); });
      var tp = anchor(P, n); xs.push(tp[0] - 85, tp[0] + 85); ys.push(tp[1] - (n.label ? 95 : 10));
    });
    return { x: Math.min.apply(null, xs) - 24, y: Math.min.apply(null, ys) - 10, w: Math.max.apply(null, xs) - Math.min.apply(null, xs) + 48, h: Math.max.apply(null, ys) - Math.min.apply(null, ys) + 44 };
  }

  var lastRendered = { scene: null, idx: -1 };
  var liveTl = null, liveTweens = [];
  function gsapOK() { return !!(window.gsap && window.MotionPathPlugin && !REDUCED); }
  function numParts(v) {
    var m = String(v == null ? "" : v).match(/^(.*?)(-?\d[\d,]*\.?\d*)(.*)$/);
    if (!m) return null;
    return { pre: m[1], num: parseFloat(m[2].replace(/,/g, "")), suf: m[3], dec: (m[2].split(".")[1] || "").length, comma: m[2].indexOf(",") >= 0 };
  }
  function fmtNum(p, n) {
    var s2 = n.toFixed(p.dec);
    if (p.comma) { var parts = s2.split("."); parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); s2 = parts.join("."); }
    return p.pre + s2 + p.suf;
  }
  /* camera: frame whatever is visible this step (nodes, labels, overlays), tweening the viewBox */
  function frameCamera(svg, scene, bb, from) {
    var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    Array.prototype.forEach.call(svg.children, function (c) {
      if (c.classList && c.classList.contains("iso-flows")) return;
      var tag = c.tagName.toLowerCase(); if (tag === "defs" || tag === "title") return;
      try { var b = c.getBBox(); if (!b.width && !b.height) return; x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height); } catch (e) {}
    });
    if (!isFinite(x0)) return;
    var pad = 34; x0 -= pad; y0 -= pad; x1 += pad; y1 += pad;
    var w = x1 - x0, hgt = y1 - y0, minW = bb.w * 0.55, minH = bb.h * 0.55;
    if (w < minW) { x0 -= (minW - w) / 2; w = minW; }
    if (hgt < minH) { y0 -= (minH - hgt) / 2; hgt = minH; }
    var target = { x: x0, y: y0, w: w, h: hgt };
    var start = from || { x: bb.x, y: bb.y, w: bb.w, h: bb.h };
    scene._vb = target;
    var setVB = function (v) { svg.setAttribute("viewBox", [v.x, v.y, v.w, v.h].map(function (n) { return n.toFixed(1); }).join(" ")); };
    if (window.gsap && !REDUCED) {
      var pr = { x: start.x, y: start.y, w: start.w, h: start.h };
      setVB(pr);
      liveTweens.push(gsap.to(pr, { x: target.x, y: target.y, w: target.w, h: target.h, duration: from ? 0.95 : 1.25, ease: "power3.inOut", onUpdate: function () { setVB(pr); } }));
    } else setVB(target);
  }

  function render(scene, idx, ui) {
    var U = scene.unit || 34, P = projector(U);
    var st = scene.steps[idx] || {};
    var now = stateAt(scene, idx);
    var prev = (!ui.fresh && lastRendered.scene === scene && lastRendered.idx >= 0) ? stateAt(scene, lastRendered.idx) : { shown: {}, metrics: {} };
    var sameScene = !ui.fresh && lastRendered.scene === scene && lastRendered.idx >= 0;
    lastRendered = { scene: scene, idx: idx };
    if (liveTl) { liveTl.kill(); liveTl = null; }
    liveTweens.forEach(function (t) { t.kill(); }); liveTweens = [];
    var bb = scene._bb || (scene._bb = bounds(scene, P, U));
    ui.stage.innerHTML = "";
    var svg = el("svg", { viewBox: [bb.x, bb.y, bb.w, bb.h].map(function (v) { return v.toFixed(0); }).join(" "), class: "iso-svg", role: "img", "aria-label": st.title || "Animated scene" }, ui.stage);
    var gLinks = el("g", { class: "iso-links" }, svg);
    var gNodes = el("g", { class: "iso-nodes" }, svg);
    var gFlows = el("g", { class: "iso-flows" }, svg);
    var gLabels = el("g", { class: "iso-labels" }, svg);
    var focus = st.focus && st.focus.length ? st.focus : null;
    var dim = function (id) { return focus && focus.indexOf(id) < 0; };

    var placedLabels = [];
    function placeLabelPill(layer, x, y, text, opts) {
      opts = opts || {};
      var testY = y;
      var testX = x;
      var pad = opts.small ? 55 : 70;
      var hpad = opts.small ? 19 : 24;
      for (var attempt = 0; attempt < 8; attempt++) {
        var collides = false;
        for (var i = 0; i < placedLabels.length; i++) {
          var pl = placedLabels[i];
          if (Math.abs(pl.x - testX) < pad && Math.abs(pl.y - testY) < hpad) {
            collides = true;
            break;
          }
        }
        if (!collides) break;
        testY += (attempt % 2 === 0 ? 22 : -40);
      }
      placedLabels.push({ x: testX, y: testY });
      return pill(layer, testX, testY, text, opts);
    }

    var ids = Object.keys(now.shown).filter(function (id) { return scene.nodes[id]; }).sort(function (a, b) { return depth(scene.nodes[a]) - depth(scene.nodes[b]); });
    var k = 0;
    ids.forEach(function (id) {
      var nodeObj = scene.nodes[id];
      if (nodeObj.label) {
        var top = nodeTop(nodeObj), p = P(top.x, top.y, top.z);
        var t = nodeObj.type || "block";
        var autoGap = 26;
        if (t === "cyl") autoGap = Math.round((nodeObj.r || 0.8) * U * 0.707 + 36);
        else if (t === "block" || t === "stack" || t === "slab") {
          var nw = nodeObj.w || (t === "slab" ? 4 : 1.6), nd = nodeObj.d || (t === "slab" ? 3 : 1.6);
          autoGap = Math.round((nw + nd) * 0.25 * U + 36);
        }
        var ly = t === "pill" ? p[1] : p[1] - (nodeObj.labelGap || autoGap);
        placedLabels.push({ x: p[0], y: ly });
      }
      var pair = drawNode(gNodes, P, scene.nodes[id], id, U, now.badges[id], gLabels), d0 = 80 * k;
      pair[0].style.color = col(scene.nodes[id].color);
      var isNew = !prev.shown[id] && !REDUCED;
      if (isNew) k++;
      pair.forEach(function (g) {
        if (dim(id)) g.classList.add("dim");
        if (focus && !dim(id)) g.classList.add("focus");
        if (isNew && g.animate) g.animate([{ opacity: 0, transform: "translateY(-16px)" }, { opacity: dim(id) ? 0.32 : 1, transform: "translateY(0)" }], { duration: 520, delay: d0, easing: "cubic-bezier(.2,.8,.2,1.1)", fill: "backwards" });
      });
    });

    var usedKinds = {};
    Object.keys(now.links).forEach(function (key) {
      var l = now.links[key], a = scene.nodes[l[0]], b = scene.nodes[l[1]];
      if (!a || !b || !now.shown[l[0]] || !now.shown[l[1]]) return;
      var o = l[3] || {};
      var path = el("path", { d: linkPath(P, a, b, o), class: "iso-link" + (o.dashed ? " dashed" : "") + (dim(l[0]) && dim(l[1]) ? " dim" : ""), style: l[2] && KIND[l[2]] ? "stroke:" + KIND[l[2]].c : null }, gLinks);
      if (o.label) {
        var pos = o.pos != null ? o.pos : 0.5;
        var len = path.getTotalLength ? path.getTotalLength() : 0;
        var mp = len ? path.getPointAtLength(len * pos) : { x: 0, y: 0 };
        var lx = mp.x + (o.dx || 0);
        var ly = mp.y - 2 + (o.dy || 0);
        placeLabelPill(gLabels, lx, ly, o.label, { small: true });
      }
    });

    var tl = gsapOK() ? gsap.timeline() : null;
    liveTl = tl;
    (st.flows || []).forEach(function (f, i) {
      var a = scene.nodes[f[0]], b = scene.nodes[f[1]];
      if (!a || !b) return;
      var kind = KIND[f[2]] ? f[2] : "req", o = f[3] || {};
      usedKinds[kind] = true;
      var d = linkPath(P, a, b, o);
      var track = el("path", { d: d, class: "iso-flow-track", style: "stroke:" + KIND[kind].c }, gLinks);
      var t0 = (o.delay || 0) + i * 0.35;
      if (ui.onFlow) {
        if (tl) tl.call(ui.onFlow, [i, f], t0 + (o.dur || 1.6) * 0.85);
        else setTimeout(function () { ui.onFlow(i, f); }, (REDUCED ? i * 120 : (t0 + (o.dur || 1.6) * 0.85) * 1000));
      }
      if (o.label) {
        var pos = o.pos != null ? o.pos : 0.5;
        var tmp = el("path", { d: d }, gLinks);
        var L2 = tmp.getTotalLength();
        var mid = tmp.getPointAtLength(L2 * pos);
        tmp.remove();
        var lx = mid.x + (o.dx || 0);
        var ly = mid.y - 4 + (o.dy || 0);
        placeLabelPill(gLabels, lx, ly, o.label, { small: true, stroke: KIND[kind].c, color: KIND[kind].c });
      }
      if (REDUCED) return;
      var count = o.count || 2, dur = o.dur || 1.6;
      for (var j = 0; j < count; j++) {
        var dot = el("circle", { r: o.size || 5.5, class: "iso-packet", style: "fill:" + KIND[kind].c + ";color:" + KIND[kind].c }, gFlows);
        if (tl) {
          gsap.set(dot, { opacity: 0 });
          var loop = gsap.timeline({ repeat: o.once ? 0 : -1, repeatDelay: 0.35 });
          loop.to(dot, { opacity: 1, duration: 0.18 }, 0)
              .to(dot, { duration: dur, ease: "power2.inOut", motionPath: { path: track, align: track, alignOrigin: [0.5, 0.5] } }, 0)
              .to(dot, { opacity: o.once ? 1 : 0, duration: 0.2 }, dur - 0.2);
          tl.add(loop, t0 + j * dur / count);
          continue;
        }
        var mo = el("animateMotion", { dur: dur + "s", repeatCount: o.once ? "1" : "indefinite", begin: ((o.delay || 0) + i * 0.35 + j * dur / count).toFixed(2) + "s", path: d, fill: o.once ? "freeze" : "remove", calcMode: "spline", keyPoints: "0;1", keyTimes: "0;1", keySplines: ".4 0 .2 1" }, dot);
        void mo;
      }
    });
    Object.keys(scene.legendAlways || {}).forEach(function (k2) { usedKinds[k2] = true; });

    if (typeof st.draw === "function") { try { st.draw(svg, { P: P, U: U, el: el, pill: pill, anchor: function (id) { return anchor(P, scene.nodes[id]); }, mix: mix, col: col }); } catch (e) { if (window.console) console.warn("scene draw error", e); } }

    if (scene.camera !== false) frameCamera(svg, scene, bb, sameScene ? scene._vb : null);

    // metrics (numbers count up to their new value)
    if (ui.metrics) {
      ui.metrics.innerHTML = (scene.metrics || []).map(function (m) {
        var v = now.metrics[m.id], changed = prev.metrics && prev.metrics[m.id] !== undefined && prev.metrics[m.id] !== v;
        return '<div class="metric' + (changed ? " changed" : "") + (m.tone ? " tone-" + m.tone : "") + '" data-mid="' + esc(m.id) + '"><span class="m-label">' + esc(m.label) + '</span><span class="m-val num">' + (v == null ? "—" : esc(v)) + "</span></div>";
      }).join("");
      if (window.gsap && !REDUCED) (scene.metrics || []).forEach(function (m) {
        var a2 = numParts(prev.metrics && prev.metrics[m.id]), b2 = numParts(now.metrics[m.id]);
        if (!a2 || !b2 || a2.num === b2.num || a2.pre !== b2.pre || a2.suf !== b2.suf) return;
        var span = ui.metrics.querySelector('[data-mid="' + m.id + '"] .m-val'); if (!span) return;
        var pr2 = { n: a2.num };
        liveTweens.push(gsap.to(pr2, { n: b2.num, duration: 0.9, ease: "power2.out", onUpdate: function () { span.textContent = fmtNum(b2, pr2.n); } }));
      });
    }
    if (ui.legend) {
      var lg = scene.legend || {};
      ui.legend.innerHTML = Object.keys(usedKinds).map(function (k3) { return '<span class="lg"><i style="background:' + KIND[k3].c + '"></i>' + esc(lg[k3] || KIND[k3].label) + "</span>"; }).join("");
    }
    return { svg: svg, tl: tl };
  }
  function pause(on) {
    if (liveTl) on ? liveTl.pause() : liveTl.resume();
  }

  function narration(st) {
    var h = st.text || "";
    if (st.key) h += '<div class="nbox key"><span class="nb-title">Key idea</span><div>' + st.key + "</div></div>";
    if (st.note) h += '<div class="nbox note"><span class="nb-title">Good to know</span><div>' + st.note + "</div></div>";
    if (st.changed && st.changed.length) {
      h += '<div class="changed"><span class="nb-title">What changed</span><ul>' + st.changed.map(function (c) {
        var m = String(c).match(/^([+~\-])\s*(.*)$/), sign = m ? m[1] : "~", body = m ? m[2] : c;
        return '<li class="ch-' + (sign === "+" ? "add" : sign === "-" ? "del" : "mod") + '"><span class="sg">' + (sign === "-" ? "−" : sign) + "</span>" + body + "</li>";
      }).join("") + "</ul></div>";
    }
    return h;
  }

  window.AtlasIso = { render: render, narration: narration, pause: pause, KIND: KIND };
})();
