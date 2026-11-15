/* WORK: the curved glass gallery. Every site sits on the inside of a cylinder; drag it,
   flick it, or use the arrow keys. The card in front lends its brand colour to the room. */
import * as THREE from 'three';

const stage = document.getElementById('stage');
const section = document.getElementById('work');
const elTitle = document.getElementById('wTitle');
const elKind = document.getElementById('wKind');
const elCount = document.getElementById('wCount');
const elOpen = document.getElementById('wOpen');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const phone = matchMedia('(max-width: 767px)').matches;   // phones get the sites' own phone screenshots as tall cards
const ASPECT = phone ? 390 / 844 : 1.6;
const works = WORKS.map(w => ({ ...w, tex: phone && w.mobile ? w.mobile : w.image.replace(/^shots\/(.*)\.jpg$/, 'shots/w/$1-960.webp') }));
const N = works.length;
const fmtA = s => s.replace(/A/g, '<span class="a">A</span>');

// screen-reader list
document.getElementById('workList').innerHTML = works.map(w => `<li><a href="${w.url}" target="_blank" rel="noopener">${w.title}: ${w.medium}</a></li>`).join('');

let active = -1;
function setActive(k) {
  if (k === active) return;
  active = k;
  const w = works[k];
  elTitle.innerHTML = fmtA(w.title.toUpperCase());
  elKind.textContent = w.kind + ' · ' + w.medium;
  elCount.textContent = String(k + 1).padStart(2, '0') + '/' + String(N).padStart(2, '0');
  elOpen.href = w.url;
  if (LIGHT.owner === 'work') LIGHT.set(w.title, w.colour, k);
}

new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting && e.intersectionRatio > .35) { LIGHT.owner = 'work'; const w = works[active]; LIGHT.set(w.title, w.colour, active); }
}), { threshold: [.35, .5] }).observe(stage);

/* ---------- WebGL ---------- */
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
} catch (e) { fallback(); }

function fallback() {
  stage.outerHTML = `<div class="fallback">${works.map(w => `<a href="${w.url}" target="_blank" rel="noopener"><img src="${w.tex}" alt="${w.title}" loading="lazy"></a>`).join('')}</div>`;
  setActive(0);
}

if (renderer) {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  stage.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  const geo = new THREE.PlaneGeometry(1, 1, 64, 1);
  const vert = /* glsl */`
    uniform vec2 uSize; uniform float uX; uniform float uR;
    varying vec2 vUv; varying float vA;
    void main(){
      vUv = uv;
      vec3 p = position; p.x *= uSize.x; p.y *= uSize.y;
      float a = (p.x + uX) / uR;              // angle on the cylinder
      vec3 q = vec3(uR * sin(a), p.y, uR * (1.0 - cos(a)));  // inside of the cylinder: edges come toward you
      vA = a;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(q, 1.0);
    }`;
  const frag = /* glsl */`
    uniform sampler2D uTex; uniform float uLoaded; uniform vec3 uCol; uniform float uAspect; uniform float uSpeed;
    varying vec2 vUv; varying float vA;
    float rbox(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
    void main(){
      // a touch of glass: the image slips a little sideways at the edges while moving
      float shift = uSpeed * 0.012 * sign(vA);
      vec3 img = vec3(texture2D(uTex, vUv + vec2(shift, 0.0)).r, texture2D(uTex, vUv).g, texture2D(uTex, vUv - vec2(shift, 0.0)).b);
      vec3 col = mix(uCol, img, uLoaded);
      col *= 1.0 - 0.42 * smoothstep(0.15, 1.0, abs(vA));            // side cards fall into shade
      col += 0.05 * (1.0 - smoothstep(0.0, 0.22, abs(vUv.y - 0.9)));   // a soft glass highlight near the top
      vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
      float d = rbox(p, vec2(uAspect * 0.5, 0.5), 0.03);
      float aa = fwidth(d) * 1.2;
      float alpha = 1.0 - smoothstep(-aa, aa, d);
      alpha *= 1.0 - smoothstep(1.2, 1.45, abs(vA));
      gl_FragColor = vec4(col, alpha);
    }`;

  const loader = new THREE.TextureLoader();
  const meshes = works.map((w, k) => {
    const c = new THREE.Color(w.colour);
    const mat = new THREE.ShaderMaterial({
      vertexShader: vert, fragmentShader: frag, transparent: true, depthTest: false, depthWrite: false,
      uniforms: { uTex: { value: null }, uLoaded: { value: 0 }, uCol: { value: new THREE.Vector3(c.r, c.g, c.b) },
        uSize: { value: new THREE.Vector2(1.6, 1) }, uX: { value: 0 }, uR: { value: 5 }, uAspect: { value: ASPECT }, uSpeed: { value: 0 } },
    });
    const m = new THREE.Mesh(geo, mat);
    m.frustumCulled = false;
    scene.add(m);
    loader.load(w.tex, t => {
      t.minFilter = THREE.LinearMipmapLinearFilter; t.anisotropy = renderer.capabilities.getMaxAnisotropy();
      mat.uniforms.uTex.value = t; m.userData.loadedAt = performance.now();
    });
    return m;
  });

  let W = 1, H = 1, cardW = 1, cardH = 1, spacing = 1, R = 5, pxToWorld = 0.01;
  function resize() {
    W = stage.clientWidth; H = stage.clientHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    const visH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const visW = visH * camera.aspect;
    cardH = visH * (phone ? 0.84 : 0.74); cardW = cardH * ASPECT;
    const maxW = visW * (phone ? 0.7 : 0.6);
    if (cardW > maxW) { cardW = maxW; cardH = cardW / ASPECT; }
    spacing = cardW * (phone ? 1.1 : 1.07);
    R = cardW * (phone ? 1.6 : 1.15);
    pxToWorld = visW / W;
    meshes.forEach(m => m.material.uniforms.uSize.value.set(cardW, cardH));
  }
  resize(); addEventListener('resize', resize);

  /* ---------- motion ---------- */
  const total = () => N * spacing;
  let pos = 0, target = 0, last = 0, speed = 0, dragging = false, px = 0, moved = 0, vx = 0, lastT = 0;

  stage.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button) return;
    dragging = true; moved = 0; px = e.clientX; vx = 0; lastT = performance.now();
    stage.classList.add('dragging'); stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - px; px = e.clientX; moved += Math.abs(dx);
    const now = performance.now(), dt = Math.max(1, now - lastT); lastT = now;
    vx = vx * 0.6 + (dx / dt) * 0.4;                 // px per ms, smoothed
    target -= dx * pxToWorld * 1.15;
  });
  function release(e) {
    if (!dragging) return;
    dragging = false; stage.classList.remove('dragging');
    if (moved < 6) { click(e); return; }
    if (!reduce) target -= vx * 180 * pxToWorld;      // flick
    target = Math.round(target / spacing) * spacing;  // snap to a card
  }
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);

  function click(e) {
    const r = stage.getBoundingClientRect();
    const half = (cardW / pxToWorld) / 2, cx = r.left + r.width / 2, x = e.clientX;
    if (Math.abs(x - cx) <= half) window.open(works[active].url, '_blank', 'noopener');
    else go(x > cx ? 1 : -1);
  }
  function go(d) { target = (Math.round(target / spacing) + d) * spacing; }

  stage.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {       // trackpad sideways swipe
      e.preventDefault();
      target += e.deltaX * pxToWorld;
      clearTimeout(stage._snap);
      stage._snap = setTimeout(() => { target = Math.round(target / spacing) * spacing; }, 140);
    }
  }, { passive: false });
  stage.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { go(1); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { go(-1); e.preventDefault(); }
    if (e.key === 'Enter') window.open(works[active].url, '_blank', 'noopener');
  });

  /* ---------- render only while the work is near the screen ---------- */
  let visible = false, raf = 0;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible && !raf) raf = requestAnimationFrame(tick); }, { rootMargin: '200px' }).observe(stage);

  let prevT = performance.now();
  function tick(t) {
    raf = 0;
    const dt = Math.min(64, t - prevT) / 16.67; prevT = t;
    const k = dragging ? 0.35 : (reduce ? 1 : 0.085);
    pos += (target - pos) * (1 - Math.pow(1 - k, dt));
    const v = (pos - last) / Math.max(dt, 0.001); last = pos;
    speed += (Math.min(1, Math.abs(v) / (spacing * 0.08)) - speed) * 0.12;
    const r = R / (1 + speed * 0.55);                 // bends harder while moving

    const tot = total();
    let best = 0, bestD = 1e9;
    meshes.forEach((m, k2) => {
      let x = k2 * spacing - pos;
      x = ((x % tot) + tot * 1.5) % tot - tot / 2;   // loop forever
      const u = m.material.uniforms;
      u.uX.value = x; u.uR.value = r; u.uSpeed.value = speed;
      if (m.userData.loadedAt) u.uLoaded.value = Math.min(1, (performance.now() - m.userData.loadedAt) / 500);
      m.visible = Math.abs(x) < r * 1.5;
      m.renderOrder = Math.round(Math.abs(x) * 10);
      if (Math.abs(x) < bestD) { bestD = Math.abs(x); best = k2; }
    });
    setActive(best);
    renderer.render(scene, camera);
    if (visible) raf = requestAnimationFrame(tick);
  }
  setActive(0);
  raf = requestAnimationFrame(tick);
}
