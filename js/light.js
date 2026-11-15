/* The light: one brand colour (--c) paints the portrait card, the glow, the second name line
   and the work room. Whoever is on screen (hero or work) owns it. */
(function () {
  const root = document.documentElement;
  const litName = document.getElementById('litName');
  const litN = document.getElementById('litN');
  const N = WORKS.length;

  const hexToRgb = h => { h = h.replace('#', ''); return [0, 2, 4].map(k => parseInt(h.slice(k, k + 2), 16) / 255); };
  const lum = ([r, g, b]) => { const f = c => c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4); return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
  // the brand colour, lifted until it reads on near-black
  function readable(hex) {
    const rgb = hexToRgb(hex); let t = 0;
    while (lum(rgb.map(c => c + (1 - c) * t)) < .14 && t < .9) t += .05;
    return '#' + rgb.map(c => Math.round((c + (1 - c) * t) * 255).toString(16).padStart(2, '0')).join('');
  }
  window.LIGHT = {
    owner: 'hero',
    set(name, hex, idx) {
      root.style.setProperty('--c', hex);
      root.style.setProperty('--ink2', readable(hex));
      litName.textContent = name;
      litN.textContent = idx == null ? '' : String(idx + 1).padStart(2, '0') + '/' + String(N).padStart(2, '0');
    },
    readable,
  };
  document.getElementById('countSites').textContent = N;
  document.getElementById('countColours').textContent = new Set(WORKS.map(w => w.colour.toLowerCase())).size;

  /* ---- hero: drag across to move the light through the works ---- */
  const STUDIO = ['the studio', '#a3122a'];
  let i = -1, auto = true, timer;
  function show(n) {
    i = ((n + 1) % (N + 1) + (N + 1)) % (N + 1) - 1; // -1 = the studio
    if (LIGHT.owner !== 'hero') return;
    if (i < 0) LIGHT.set(STUDIO[0], STUDIO[1], null);
    else LIGHT.set(WORKS[i].title, WORKS[i].colour, i);
  }
  window.LIGHT.heroShow = () => show(i);
  function loop() { clearTimeout(timer); if (auto) timer = setTimeout(() => { if (LIGHT.owner === 'hero') show(i + 1); loop(); }, 3200); }
  show(-1); setTimeout(loop, 1600);

  const hero = document.getElementById('hero');
  let x0 = null;
  hero.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse' && e.button) return; x0 = e.clientX; hero.classList.add('dragging'); });
  addEventListener('pointermove', e => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    if (Math.abs(dx) > 90) { auto = false; clearTimeout(timer); show(i + (dx < 0 ? 1 : -1)); x0 = e.clientX; }
  });
  const end = () => { x0 = null; hero.classList.remove('dragging'); };
  addEventListener('pointerup', end); addEventListener('pointercancel', end);

  /* ---- fit SULEIMAN to the full width, capped so both lines sit under the rule ---- */
  const nameEl = document.querySelector('.name'), l1 = document.querySelector('.l1 > span');
  function fit() {
    nameEl.style.setProperty('--fs', '100px');
    let fs = 100 * nameEl.clientWidth / l1.getBoundingClientRect().width;
    if (innerWidth >= 768) fs = Math.min(fs, (innerHeight - nameEl.getBoundingClientRect().top - scrollY * 0) / 1.72);
    nameEl.style.setProperty('--fs', fs.toFixed(1) + 'px');
  }
  document.fonts.ready.then(fit); addEventListener('resize', fit);

  /* ---- statement: words light up as you read down ---- */
  const big = document.getElementById('big');
  big.innerHTML = big.textContent.trim().split(/\s+/).map(w => '<span class="w">' + w.replace(/A/g, '<span class="a">A</span>').replace(/a/g, '<span class="a">a</span>') + '</span>').join(' ');
  const words = [...big.querySelectorAll('.w')];
  function fill() {
    const r = big.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * .82 - r.top) / (r.height + innerHeight * .3)));
    const k = Math.round(p * words.length);
    words.forEach((w, j) => w.classList.toggle('on', j < k));
  }
  addEventListener('scroll', fill, { passive: true }); fill();

  /* ---- who owns the light ---- */
  new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && e.intersectionRatio > .45) { LIGHT.owner = 'hero'; show(i); }
  }), { threshold: [.45, .6] }).observe(hero);
})();
