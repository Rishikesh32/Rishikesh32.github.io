/* ------------------------------------------------------------------
   Neural core: a WebGL particle field that morphs between shapes
   as you scroll (sphere → knot → wave → helix → sphere) and reacts
   to the cursor. Exposes window.neuralBG.to(shape, x, alpha).
   ------------------------------------------------------------------ */
(function () {
  const state = { shape: 0, x: 0, y: 0, alpha: 0 };
  const api = {
    state,
    to(shape, x, alpha, duration = 1.8, y = 0) {
      if (window.gsap) {
        gsap.to(state, { shape, x, y, alpha, duration, ease: "power2.inOut", overwrite: true });
      } else {
        Object.assign(state, { shape, x, y, alpha });
      }
    },
  };
  window.neuralBG = api;

  const canvas = document.getElementById("bg-canvas");
  if (!canvas || !window.THREE) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
  } catch (e) {
    return; // no WebGL: the CSS aurora still gives a living background
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = window.innerWidth < 768;
  const COUNT = mobile ? 3500 : 7000;
  const dpr = 1;

  renderer.setPixelRatio(dpr);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 7.5);

  /* ---------------- shapes ---------------- */
  const sphere = new Float32Array(COUNT * 3);
  const knot = new Float32Array(COUNT * 3);
  const wave = new Float32Array(COUNT * 3);
  const helix = new Float32Array(COUNT * 3);
  const rnd = new Float32Array(COUNT);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const side = Math.ceil(Math.sqrt(COUNT));

  function randUnit() {
    const u = Math.random() * 2 - 1;
    const a = Math.random() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    return [s * Math.cos(a), s * Math.sin(a), u];
  }

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    const t = i / COUNT;
    rnd[i] = Math.random();

    // 1. Sphere (fibonacci shell + sparse inner core)
    const y = 1 - (2 * (i + 0.5)) / COUNT;
    const ring = Math.sqrt(1 - y * y);
    const th = golden * i;
    let r = 2;
    if (Math.random() < 0.2) r *= 0.25 + Math.random() * 0.6;
    sphere[i3] = Math.cos(th) * ring * r;
    sphere[i3 + 1] = y * r;
    sphere[i3 + 2] = Math.sin(th) * ring * r;

    // 2. Torus knot (2,3)
    const s = t * Math.PI * 2;
    const kr = 2 + Math.cos(3 * s);
    const tube = 0.3 * Math.sqrt(Math.random());
    const [ux, uy, uz] = randUnit();
    knot[i3] = kr * Math.cos(2 * s) * 0.72 + ux * tube;
    knot[i3 + 1] = kr * Math.sin(2 * s) * 0.72 + uy * tube;
    knot[i3 + 2] = -Math.sin(3 * s) * 0.72 + uz * tube;

    // 3. Wave landscape (a "loss surface")
    const gx = (i % side) / side - 0.5;
    const gz = Math.floor(i / side) / side - 0.5;
    const wx = gx * 13;
    const wz = gz * 9 - 1.5;
    wave[i3] = wx;
    wave[i3 + 1] = Math.sin(wx * 0.8) * Math.cos(wz * 0.7) * 0.7 - 1.4;
    wave[i3 + 2] = wz;

    // 4. Double helix (DNA of the data)
    const ht = t * Math.PI * 9;
    const hy = (t - 0.5) * 7.5;
    const strand = i % 2;
    let hx = Math.cos(ht + strand * Math.PI) * 1.15;
    let hz = Math.sin(ht + strand * Math.PI) * 1.15;
    if (rnd[i] < 0.28) {
      const q = Math.round(ht / 0.55) * 0.55;
      const k = Math.random();
      const ax = Math.cos(q) * 1.15, az = Math.sin(q) * 1.15;
      const bx = Math.cos(q + Math.PI) * 1.15, bz = Math.sin(q + Math.PI) * 1.15;
      hx = ax + (bx - ax) * k;
      hz = az + (bz - az) * k;
    }
    helix[i3] = hx + (Math.random() - 0.5) * 0.06;
    helix[i3 + 1] = hy;
    helix[i3 + 2] = hz + (Math.random() - 0.5) * 0.06;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(sphere, 3));
  geo.setAttribute("aKnot", new THREE.BufferAttribute(knot, 3));
  geo.setAttribute("aWave", new THREE.BufferAttribute(wave, 3));
  geo.setAttribute("aHelix", new THREE.BufferAttribute(helix, 3));
  geo.setAttribute("aRnd", new THREE.BufferAttribute(rnd, 1));

  const uniforms = {
    uTime: { value: 0 },
    uShape: { value: 0 },
    uAlpha: { value: 0 },
    uSize: { value: mobile ? 34 : 40 },
    uPR: { value: dpr },
    uAspect: { value: window.innerWidth / window.innerHeight },
    uMouse: { value: new THREE.Vector2(9, 9) },
    uC1: { value: new THREE.Color("#22d3ee") },
    uC2: { value: new THREE.Color("#8b5cf6") },
    uC3: { value: new THREE.Color("#f472b6") },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute vec3 aKnot;
      attribute vec3 aWave;
      attribute vec3 aHelix;
      attribute float aRnd;
      uniform float uTime, uShape, uSize, uPR, uAspect;
      uniform vec2 uMouse;
      varying float vT;
      varying float vGlow;
      varying float vRnd;

      float stage(float s, float i) {
        return smoothstep(0.0, 1.0, clamp((s - i) * 1.6 - aRnd * 0.6, 0.0, 1.0));
      }

      void main() {
        vec3 p = position;
        p = mix(p, aKnot, stage(uShape, 0.0));
        p = mix(p, aWave, stage(uShape, 1.0));
        p = mix(p, aHelix, stage(uShape, 2.0));
        p = mix(p, position, stage(uShape, 3.0));

        float w = sin(p.x * 1.7 + uTime * 0.9 + aRnd * 6.2831) * cos(p.y * 1.3 + uTime * 0.7);
        p.y += w * 0.06;
        p += normalize(p + vec3(0.001)) * sin(uTime * 1.3 + aRnd * 40.0) * 0.035;

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;

        // cursor repulsion in screen space
        vec2 ndc = gl_Position.xy / gl_Position.w;
        vec2 d = (ndc - uMouse) * vec2(uAspect, 1.0);
        float f = smoothstep(0.38, 0.0, length(d));
        gl_Position.xy += normalize(d + 0.0001) / vec2(uAspect, 1.0) * f * 0.09 * gl_Position.w;

        vGlow = f;
        vRnd = aRnd;
        vT = clamp((p.y + 2.3) / 4.6, 0.0, 1.0) * 0.8 + aRnd * 0.2;
        gl_PointSize = uSize * uPR * (0.3 + aRnd * 0.85) / -mv.z * (1.0 + f * 1.4);
      }
    `,
    fragmentShader: `
      uniform vec3 uC1, uC2, uC3;
      uniform float uAlpha, uTime;
      varying float vT;
      varying float vGlow;
      varying float vRnd;

      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float a = pow(1.0 - d * 2.0, 1.7);
        vec3 col = vT < 0.5 ? mix(uC1, uC2, vT * 2.0) : mix(uC2, uC3, (vT - 0.5) * 2.0);
        col += vGlow * 0.55;
        float twinkle = 0.6 + 0.4 * sin(uTime * 2.2 + vRnd * 60.0);
        gl_FragColor = vec4(col, a * uAlpha * twinkle * (0.6 + vGlow * 0.4));
      }
    `,
  });

  const group = new THREE.Group();
  const points = new THREE.Points(geo, material);
  group.add(points);

  /* ---------------- synapses: faint links on the sphere ---------------- */
  const SAMPLE = mobile ? 260 : 520;
  const linePos = [];
  const picks = [];
  for (let i = 0; i < SAMPLE; i++) {
    const idx = (Math.random() * COUNT) | 0;
    const i3 = idx * 3;
    const len = Math.hypot(sphere[i3], sphere[i3 + 1], sphere[i3 + 2]);
    if (len > 1.9) picks.push([sphere[i3], sphere[i3 + 1], sphere[i3 + 2]]);
  }
  for (let i = 0; i < picks.length; i++) {
    let links = 0;
    for (let j = i + 1; j < picks.length && links < 2; j++) {
      const dx = picks[i][0] - picks[j][0], dy = picks[i][1] - picks[j][1], dz = picks[i][2] - picks[j][2];
      if (dx * dx + dy * dy + dz * dz < 0.42) {
        linePos.push(...picks[i], ...picks[j]);
        links++;
      }
    }
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePos, 3));
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x8b5cf6, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  group.add(lines);
  scene.add(group);

  /* ---------------- ambient dust ---------------- */
  const DUST = mobile ? 300 : 700;
  const dustPos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 26;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 18;
    dustPos[i * 3 + 2] = -Math.random() * 12 + 1;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.ShaderMaterial({
    uniforms: { uPR: { value: dpr }, uTime: uniforms.uTime, uDust: { value: new THREE.Color(0.75, 0.8, 1.0) } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      uniform float uPR, uTime;
      varying float vA;
      void main() {
        vec3 p = position;
        p.y += sin(uTime * 0.2 + position.x) * 0.2;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = 22.0 * uPR / -mv.z;
        vA = 0.35 + 0.35 * sin(uTime + position.z * 3.0);
      }`,
    fragmentShader: `
      uniform vec3 uDust;
      varying float vA;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        gl_FragColor = vec4(uDust, pow(1.0 - d * 2.0, 2.0) * vA * 0.5);
      }`,
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  /* ---------------- theme: neon glow on dark, warm ink on cream ---------------- */
  const THEMES = {
    dark:  { c1: "#22d3ee", c2: "#8b5cf6", c3: "#f472b6", line: 0x8b5cf6, dust: [0.75, 0.8, 1.0], blend: THREE.AdditiveBlending },
    light: { c1: "#C2541B", c2: "#9A3B5C", c3: "#C98A1A", line: 0x9A3B5C, dust: [0.55, 0.42, 0.3], blend: THREE.NormalBlending }
  };
  function applyTheme(name) {
    const t = THEMES[name] || THEMES.dark;
    uniforms.uC1.value.set(t.c1); uniforms.uC2.value.set(t.c2); uniforms.uC3.value.set(t.c3);
    lineMat.color.setHex(t.line);
    dustMat.uniforms.uDust.value.setRGB(t.dust[0], t.dust[1], t.dust[2]);
    [material, lineMat, dustMat].forEach((m) => { m.blending = t.blend; m.needsUpdate = true; });
  }
  applyTheme(document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");
  window.neuralBG.setTheme = applyTheme;

  /* ---------------- interaction ---------------- */
  const mouse = { x: 9, y: 9, tx: 9, ty: 9, rx: 0, ry: 0 };
  window.addEventListener("pointermove", (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = -(e.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });
  document.addEventListener("pointerleave", () => { mouse.tx = 9; mouse.ty = 9; });

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    uniforms.uAspect.value = w / h;
  }
  window.addEventListener("resize", resize);

  /* ---------------- loop ---------------- */
  const clock = new THREE.Clock();
  let rotY = 0;

  // While the page is being scrolled, draw the core at half rate so the GPU's
  // first job is moving the page. If the device can't hold ~45fps at all,
  // switch to a lighter mode for good (lower resolution, half rate, fewer CSS loops).
  let lastScroll = -1e9, frameNo = 0, lowFx = false, probeStart = 0;
  const probe = [];
  window.addEventListener("scroll", () => { lastScroll = performance.now(); }, { passive: true });
  window.addEventListener("wheel", () => { lastScroll = performance.now(); }, { passive: true });

  function tick(now) {
    requestAnimationFrame(tick);
    frameNo++;

    if (!lowFx && probe.length < 90) {
      if (!probeStart) probeStart = now;
      probe.push(now);
      if (probe.length === 90 && now - probeStart > 1000) {
        const avg = (probe[89] - probe[10]) / 79;
        if (avg > 22) {
          lowFx = true;
          renderer.setPixelRatio(0.75);
          renderer.setSize(window.innerWidth, window.innerHeight, false);
          document.documentElement.classList.add("lowfx");
        }
      }
    }

    const scrolling = now - lastScroll < 180;
    if ((scrolling || lowFx) && frameNo % 2) return;
    if (document.hidden) return;

    const dt = Math.min(clock.getDelta(), 0.05);
    const time = clock.elapsedTime;
    if (!reduce) {
      uniforms.uTime.value = time;
      rotY += dt * 0.12;
    }

    // ease mouse (snap when it re-enters from "far away")
    if (Math.abs(mouse.tx) > 5) { mouse.x = mouse.tx; mouse.y = mouse.ty; }
    else if (Math.abs(mouse.x) > 5) { mouse.x = mouse.tx; mouse.y = mouse.ty; }
    else { mouse.x += (mouse.tx - mouse.x) * 0.12; mouse.y += (mouse.ty - mouse.y) * 0.12; }
    uniforms.uMouse.value.set(mouse.x, mouse.y);

    const mx = Math.abs(mouse.x) > 5 ? 0 : mouse.x;
    const my = Math.abs(mouse.y) > 5 ? 0 : mouse.y;
    mouse.rx += (my * 0.25 - mouse.rx) * 0.04;
    mouse.ry += (mx * 0.35 - mouse.ry) * 0.04;

    uniforms.uShape.value = state.shape;
    uniforms.uAlpha.value = state.alpha;

    // the wave landscape reads best facing the camera, so damp spin there
    const waveness = Math.max(0, 1 - Math.abs(state.shape - 2));
    group.rotation.y = rotY * (1 - waveness * 0.85) + mouse.ry;
    group.rotation.x = mouse.rx + waveness * 0.25;
    group.rotation.z = Math.sin(time * 0.15) * 0.06;
    group.position.x += (state.x - group.position.x) * 0.06;
    group.position.y += (state.y - group.position.y) * 0.06;

    // synapse lines only on the sphere shapes
    const sphereness = Math.max(0, 1 - state.shape * 1.6, (state.shape - 3.4) * 1.6);
    lineMat.opacity = Math.min(1, sphereness) * 0.22 * state.alpha;

    dust.position.y = window.scrollY * 0.0015;
    dust.rotation.y = time * 0.01;

    renderer.render(scene, camera);
  }
  requestAnimationFrame(tick);
})();
