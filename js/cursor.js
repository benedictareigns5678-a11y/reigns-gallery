/* The ink cursor: a dot that follows the mouse with a soft lag, drawing a glowing
   stroke behind it in the current brand colour. Slow strokes are thick, fast strokes
   thin, and the ink is gone in a quarter of a second. Mouse only; off for touch and
   reduced motion. Over links the dot grows; over drag areas it says DRAG. */
(function () {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const root = document.documentElement;
  const dot = document.createElement('div');
  dot.className = 'cur-dot';
  dot.innerHTML = '<span>DRAG</span>';
  const canvas = document.createElement('canvas');
  canvas.className = 'cur-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.append(canvas, dot);
  const ctx = canvas.getContext('2d');

  const LIFE = 260;           // ms the ink stays
  let tx = 0, ty = 0, x = 0, y = 0, inside = false, raf = 0, last = 0;
  let points = [], width = 3, rgb = [216, 69, 90], rgbAt = 0;

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(innerWidth * dpr);
    canvas.height = Math.round(innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    points = [];
  }
  function readColour(now) {           // the light changes; re-read it a few times a second
    if (now - rgbAt < 200) return;
    rgbAt = now;
    const m = getComputedStyle(root).getPropertyValue('--ink2').match(/\d+(\.\d+)?/g);
    if (m && m.length >= 3) rgb = m.slice(0, 3).map(Number);
  }

  function frame(now) {
    raf = 0;
    const dt = Math.min(64, now - (last || now)); last = now;
    const k = 1 - Math.pow(1 - 0.24, dt / 16.67);
    x += (tx - x) * k; y += (ty - y) * k;
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;

    const moving = Math.abs(tx - x) + Math.abs(ty - y) > 0.3;
    if (inside && moving) {
      const p = points[points.length - 1];
      if (!p || (x - p.x) ** 2 + (y - p.y) ** 2 >= 0.1) points.push({ x, y, t: now });
    }
    points = points.filter(p => now - p.t < LIFE);

    readColour(now);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    const [r, g, b] = rgb;
    ctx.lineCap = 'round';
    ctx.shadowColor = `rgba(${r},${g},${b},.7)`;
    ctx.shadowBlur = 34;
    for (let i = 1; i < points.length - 1; i++) {
      const a = points[i - 1], c = points[i], n = points[i + 1];
      const speed = Math.hypot(c.x - a.x, c.y - a.y) / Math.max(1, c.t - a.t);   // px per ms
      const target = 15 - Math.min(1, Math.max(0, (speed - 0.08) / 2.7)) * 13;
      width += (target - width) * 0.5;
      const alpha = (1 - (now - c.t) / LIFE) ** 2;
      if (alpha < 0.01) continue;
      ctx.beginPath();
      ctx.moveTo((a.x + c.x) / 2, (a.y + c.y) / 2);
      ctx.quadraticCurveTo(c.x, c.y, (c.x + n.x) / 2, (c.y + n.y) / 2);
      ctx.lineWidth = width;
      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.stroke();
    }
    if (points.length || moving) raf = requestAnimationFrame(frame);
    else last = 0;
  }
  const wake = () => { if (!raf) raf = requestAnimationFrame(frame); };

  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    if (!inside) { x = tx = e.clientX; y = ty = e.clientY; dot.classList.add('on'); inside = true; }
    tx = e.clientX; ty = e.clientY;
    wake();
  }, { passive: true });

  document.addEventListener('mouseover', e => {
    const t = e.target;
    dot.classList.toggle('drag', !!t.closest?.('[data-cursor="drag"]') && !t.closest('a'));
    dot.classList.toggle('link', !!t.closest?.('a, button, .menu'));
  });
  const hide = () => { inside = false; dot.classList.remove('on'); };
  document.addEventListener('mouseleave', hide);
  addEventListener('blur', hide);
  addEventListener('resize', resize, { passive: true });
  resize();
})();
