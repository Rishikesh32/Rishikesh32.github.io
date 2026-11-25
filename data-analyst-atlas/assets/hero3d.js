/* Data Analyst Atlas — home page motion:
   1. A real-time Three.js "atlas": 16 area blocks on a blueprint grid, packets flowing
      along the learning path, hover tooltips, click to open, drag to turn.
   2. GSAP + ScrollTrigger reveals for the rest of the page.
   Loads three.js as an ES module (import map in index.html) and GSAP from cdnjs.
   Everything degrades gracefully: no WebGL → the hero shows text only; reduced motion → static. */
(function () {
  "use strict";
  var REDUCED = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var CDN = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/";
  function loadScript(src) { return new Promise(function (res) { var s = document.createElement("script"); s.src = src; s.onload = function () { res(true); }; s.onerror = function () { res(false); }; document.head.appendChild(s); }); }
  function css(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }
  function isDark() { var t = document.documentElement.getAttribute("data-theme"); return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches; }

  var gsapReady = loadScript(CDN + "gsap.min.js").then(function (ok) { return ok ? loadScript(CDN + "ScrollTrigger.min.js") : false; })
    .then(function () { if (window.gsap && window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger); });

  /* ---------------- page reveals ---------------- */
  function reveals() {
    var g = window.gsap;
    if (!g || REDUCED) return;
    g.from(".hero-copy > *", { autoAlpha: 0, y: 24, duration: 0.8, stagger: 0.08, ease: "power3.out", clearProps: "opacity,visibility,transform" });
    // stats count up
    document.querySelectorAll(".stats .big").forEach(function (el) {
      var to = parseFloat(el.textContent) || 0, p = { n: 0 };
      if (!to) return;
      g.to(p, { n: to, duration: 1.4, ease: "power2.out", delay: 0.3, onUpdate: function () { el.textContent = Math.round(p.n); } });
    });
    if (!window.ScrollTrigger) return;
    var batchIn = function (sel, extra) {
      ScrollTrigger.batch(sel, Object.assign({
        start: "top 92%", once: true,
        onEnter: function (els) { g.fromTo(els, { autoAlpha: 0, y: 34, rotationX: 8, transformPerspective: 800 }, { autoAlpha: 1, y: 0, rotationX: 0, duration: 0.75, stagger: 0.06, ease: "power3.out", overwrite: true, clearProps: "opacity,visibility,transform" }); }
      }, extra || {}));
    };
    batchIn(".eg-card");
    batchIn(".badge");
    batchIn(".area-card");
    batchIn(".tier-group-head");
    batchIn(".section-head");
    var map = document.querySelector(".map-frame");
    if (map) g.fromTo(map, { autoAlpha: 0, scale: 0.96, y: 40 }, { autoAlpha: 1, scale: 1, y: 0, duration: 1, ease: "power3.out", clearProps: "opacity,visibility,transform", scrollTrigger: { trigger: map, start: "top 88%", once: true } });
  }

  /* ---------------- the 3D atlas ---------------- */
  var host = document.getElementById("atlas3d");
  if (!host || !window.ATLAS) { gsapReady.then(reveals); return; }

  import("three").then(function (THREE) { build(THREE); }).catch(function () { host.classList.add("no3d"); }).finally(function () { gsapReady.then(reveals); });

  function build(THREE) {
    var A = window.ATLAS, At = window.Atlas || {};
    var renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" }); }
    catch (e) { host.classList.add("no3d"); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.insertBefore(renderer.domElement, host.firstChild);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);
    var target = new THREE.Vector3(0, 0.4, 0);

    // lights
    var hemi = new THREE.HemisphereLight(0xffffff, 0x666666, 1.1); scene.add(hemi);
    var sun = new THREE.DirectionalLight(0xffffff, 1.6); sun.position.set(6, 12, 8); scene.add(sun);
    var rim = new THREE.DirectionalLight(0xffffff, 0.5); rim.position.set(-8, 6, -6); scene.add(rim);

    // layout: tiers along x, areas along z
    var COLW = 2.7, ROWD = 2.05;
    var tiers = A.tiers.map(function (t) { return t.id; });
    var maxRows = 0;
    tiers.forEach(function (tid) { maxRows = Math.max(maxRows, A.areas.filter(function (a) { return a.tier === tid; }).length); });
    var world = new THREE.Group(); scene.add(world);
    var blocks = [], byN = {};
    var boxGeo = new THREE.BoxGeometry(1, 1, 1);
    var edgeGeo = new THREE.EdgesGeometry(boxGeo);
    var capGeo = new THREE.BoxGeometry(1, 1, 1);

    tiers.forEach(function (tid, ci) {
      var areas = A.areas.filter(function (a) { return a.tier === tid; });
      areas.forEach(function (a, ri) {
        var h = 0.45 + a.subs.length * 0.09;
        var x = (ci - (tiers.length - 1) / 2) * COLW;
        var z = (ri - (maxRows - 1) / 2) * ROWD;
        var grp = new THREE.Group(); grp.position.set(x, 0, z);
        var mat = new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.05, transparent: true, opacity: 0.96 });
        var mesh = new THREE.Mesh(boxGeo, mat); mesh.scale.set(1.55, h, 1.15); mesh.position.y = h / 2;
        var edges = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ transparent: true }));
        edges.scale.copy(mesh.scale); edges.position.copy(mesh.position);
        var done = At.areaDone ? At.areaDone(a) : 0, frac = done / a.subs.length;
        var cap = new THREE.Mesh(capGeo, new THREE.MeshStandardMaterial({ roughness: 0.4, emissiveIntensity: 0.35 }));
        cap.scale.set(Math.max(0.001, 1.55 * frac), 0.06, 1.15); cap.position.set(-1.55 / 2 + (1.55 * frac) / 2, h + 0.03, 0); cap.visible = frac > 0;
        grp.add(mesh, edges, cap);
        world.add(grp);
        mesh.userData = { area: a, grp: grp, h: h };
        var b = { a: a, grp: grp, mesh: mesh, edges: edges, cap: cap, h: h, tier: tid, lift: 0, liftTo: 0 };
        blocks.push(b); byN[a.n] = b;
      });
    });

    // ground grid
    var grid = new THREE.GridHelper(40, 40, 0xffffff, 0xffffff); grid.position.y = -0.001; grid.material.transparent = true; scene.add(grid);

    // learning-path arcs + packets
    var arcs = [], packets = [];
    var arcMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.55 });
    var pktGeo = new THREE.SphereGeometry(0.075, 16, 12);
    A.areas.forEach(function (a) {
      a.prereqs.forEach(function (p, k) {
        var from = byN[p], to = byN[a.n]; if (!from || !to) return;
        var p0 = new THREE.Vector3(from.grp.position.x, from.h + 0.05, from.grp.position.z);
        var p2 = new THREE.Vector3(to.grp.position.x, to.h + 0.05, to.grp.position.z);
        var mid = p0.clone().lerp(p2, 0.5); mid.y = Math.max(p0.y, p2.y) + 0.9 + p0.distanceTo(p2) * 0.12;
        var curve = new THREE.QuadraticBezierCurve3(p0, mid, p2);
        var line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(40)), arcMat);
        world.add(line);
        var pk = new THREE.Mesh(pktGeo, new THREE.MeshStandardMaterial({ emissiveIntensity: 1.4, roughness: 0.3 }));
        world.add(pk);
        var arc = { curve: curve, line: line, from: p, to: a.n };
        arcs.push(arc);
        packets.push({ mesh: pk, arc: arc, t: Math.random(), speed: 0.16 + Math.random() * 0.12 });
      });
    });

    /* ---- colours follow the site theme ---- */
    function colour(v, fb) { var c = css(v); try { return new THREE.Color(c || fb); } catch (e) { return new THREE.Color(fb); } }
    function applyTheme() {
      var dark = isDark();
      var ink = colour("--ink", "#1d1b18"), line = colour("--line", "#dbd5c9"), surface = colour("--surface", "#ffffff"), accent = colour("--accent", "#2f45cf"), good = colour("--good", "#1b7f52");
      A.tiers.forEach(function (t) { t._c = colour(t.color.replace(/^var\((--[^)]+)\)$/, "$1"), "#2f45cf"); });
      blocks.forEach(function (b) {
        var tc = A.tiers.find(function (t) { return t.id === b.tier; })._c;
        b.base = tc;
        b.mesh.material.color.copy(dark ? tc.clone().multiplyScalar(0.42) : tc.clone().lerp(surface, 0.38));
        b.mesh.material.emissive = dark ? tc.clone().multiplyScalar(0.18) : tc.clone().lerp(new THREE.Color(0xffffff), 0.55).multiplyScalar(0.22);
        b.edges.material.color.copy(dark ? tc.clone().lerp(new THREE.Color(0xffffff), 0.35) : ink);
        b.cap.material.color.copy(good); b.cap.material.emissive = good.clone().multiplyScalar(dark ? 0.6 : 0.15);
      });
      arcMat.color.copy(dark ? accent : ink); arcMat.opacity = dark ? 0.6 : 0.35;
      packets.forEach(function (p) { p.mesh.material.color.copy(accent); p.mesh.material.emissive = accent.clone(); });
      grid.material.color = dark ? accent.clone().multiplyScalar(0.35) : line.clone(); grid.material.opacity = dark ? 0.45 : 0.8;
      hemi.intensity = dark ? 0.7 : 1.5; sun.intensity = dark ? 1.1 : 1.8;
    }
    applyTheme();
    document.addEventListener("da:theme", function () { requestAnimationFrame(applyTheme); });
    if (window.matchMedia) matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);

    /* ---- HTML number labels that track the blocks ---- */
    var labelHost = host.querySelector(".a3-labels");
    blocks.forEach(function (b) {
      var l = document.createElement("span"); l.className = "a3-label"; l.textContent = String(b.a.n).padStart(2, "0");
      labelHost.appendChild(l); b.label = l;
    });

    /* ---- camera rig: slow orbit, pointer parallax, drag to turn ---- */
    var az = Math.PI / 4, azVel = 0, el = 0.66, dist = 29, intro = { k: REDUCED ? 1 : 0 };
    var pointer = { x: 0, y: 0 }, drag = null;
    function placeCamera() {
      var a = az + pointer.x * 0.12, e = el - pointer.y * 0.06;
      var d = dist * (1.35 - 0.35 * intro.k);
      camera.position.set(target.x + d * Math.cos(e) * Math.sin(a), target.y + d * Math.sin(e), target.z + d * Math.cos(e) * Math.cos(a));
      camera.lookAt(target);
    }
    function size() {
      var w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = w / h < 1.1 ? 40 : 30;
      camera.updateProjectionMatrix();
    }
    new ResizeObserver(size).observe(host); size();

    var ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), hovered = null;
    var tip = host.querySelector(".a3-tip");
    function pick(ev) {
      var r = renderer.domElement.getBoundingClientRect();
      ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      var hit = ray.intersectObjects(blocks.map(function (b) { return b.mesh; }), false)[0];
      return hit ? blocks.find(function (b) { return b.mesh === hit.object; }) : null;
    }
    function setHover(b, ev) {
      if (hovered && hovered !== b) hovered.liftTo = 0;
      hovered = b;
      host.style.cursor = b ? "pointer" : (drag ? "grabbing" : "grab");
      arcs.forEach(function (a) { a.hot = b && (a.from === b.a.n || a.to === b.a.n); });
      if (!b) { tip.hidden = true; return; }
      b.liftTo = 0.35;
      var done = At.areaDone ? At.areaDone(b.a) : 0;
      tip.innerHTML = '<span class="eyebrow">' + String(b.a.n).padStart(2, "0") + " · " + (A.tiers.find(function (t) { return t.id === b.tier; }).name) + "</span><strong>" + b.a.title + "</strong><span>" + b.a.summary + '</span><span class="a3-tip-foot">' + (b.a.live ? done + " / " + b.a.subs.length + " mastered · " + b.a.weeks : "Coming soon") + "</span>";
      tip.hidden = false;
      var r = host.getBoundingClientRect(), x = ev.clientX - r.left, y = ev.clientY - r.top;
      tip.style.left = Math.min(Math.max(8, x + 16), r.width - tip.offsetWidth - 8) + "px";
      tip.style.top = Math.min(Math.max(8, y + 16), r.height - tip.offsetHeight - 8) + "px";
    }
    host.addEventListener("pointermove", function (ev) {
      var r = host.getBoundingClientRect();
      pointer.x = ((ev.clientX - r.left) / r.width - 0.5) * 2;
      pointer.y = ((ev.clientY - r.top) / r.height - 0.5) * 2;
      if (drag) { var dx = ev.clientX - drag.x; drag.moved = drag.moved || Math.abs(dx) > 4; azVel = 0; az = drag.az - dx * 0.008; setHover(null); return; }
      setHover(pick(ev), ev);
    });
    host.addEventListener("pointerleave", function () { pointer.x = pointer.y = 0; setHover(null); });
    host.addEventListener("pointerdown", function (ev) { drag = { x: ev.clientX, az: az, moved: false }; host.setPointerCapture && host.setPointerCapture(ev.pointerId); host.style.cursor = "grabbing"; });
    host.addEventListener("pointerup", function (ev) {
      var wasDrag = drag && drag.moved; drag = null; host.style.cursor = "grab";
      if (!wasDrag) { var b = pick(ev); if (b && b.a.live) location.href = "topics/" + b.a.file; }
    });

    /* ---- intro: blocks rise in, camera dollies in ---- */
    var g = window.gsap;
    function introAnim() {
      g = window.gsap;
      if (!g || REDUCED) { intro.k = 1; return; }
      blocks.forEach(function (b) { b.grp.scale.y = 0.001; });
      g.to(intro, { k: 1, duration: 2.2, ease: "power3.out" });
      g.to(blocks.map(function (b) { return b.grp.scale; }), { y: 1, duration: 1.1, ease: "back.out(1.6)", stagger: { each: 0.06, from: "start" }, delay: 0.2 });
    }
    gsapReady.then(introAnim);

    /* ---- render loop (only while visible) ---- */
    var v = new THREE.Vector3(), visible = true, last = performance.now();
    function frame(now) {
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!drag && !REDUCED) az += 0.05 * dt;
      blocks.forEach(function (b) {
        b.lift += (b.liftTo - b.lift) * Math.min(1, dt * 10);
        b.grp.position.y = b.lift;
        b.mesh.material.emissiveIntensity = 1 + b.lift * 3;
      });
      if (!REDUCED) packets.forEach(function (p) {
        p.t = (p.t + p.speed * dt * (p.arc.hot ? 2.2 : 1)) % 1;
        p.mesh.position.copy(p.arc.curve.getPointAt(p.t));
        var s = p.arc.hot ? 1.6 : 1; p.mesh.scale.setScalar(s);
      });
      placeCamera();
      renderer.render(scene, camera);
      var w = renderer.domElement.clientWidth, h = renderer.domElement.clientHeight;
      blocks.forEach(function (b) {
        v.set(b.grp.position.x, b.h * b.grp.scale.y + b.lift + 0.25, b.grp.position.z).project(camera);
        b.label.style.transform = "translate(" + ((v.x * 0.5 + 0.5) * w).toFixed(1) + "px," + ((-v.y * 0.5 + 0.5) * h).toFixed(1) + "px) translate(-50%,-100%)";
        b.label.classList.toggle("hot", b === hovered);
      });
    }
    function loop() { if (visible && !document.hidden) frame(performance.now()); }
    if (REDUCED) { placeCamera(); renderer.render(scene, camera); frame(performance.now()); }
    else renderer.setAnimationLoop(loop);
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) last = performance.now(); }).observe(host);
    document.addEventListener("da:theme", function () { if (REDUCED) setTimeout(function () { frame(performance.now()); }, 30); });
    host.classList.add("ready");
  }
})();
