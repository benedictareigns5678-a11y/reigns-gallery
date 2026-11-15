/* Brand identity: the room takes the brand's colour while you look at it. */
(function () {
  const sec = document.getElementById('brands');
  const first = sec.querySelector('.bcard');
  new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && e.intersectionRatio > .3) { LIGHT.owner = 'brands'; LIGHT.set(first.dataset.name, first.dataset.colour, null); }
  }), { threshold: [.3, .5] }).observe(sec);
  const mail = document.getElementById('mail');
  mail.href = 'mailto:' + GALLERY.email + '?subject=' + encodeURIComponent('A new project');
  const ml = document.getElementById('mailline'); ml.href = 'mailto:' + GALLERY.email; ml.textContent = GALLERY.email;
  // branding rows rise in as they arrive
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const rows = document.querySelectorAll('.svc');
    rows.forEach(r => r.classList.add('rv'));
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
    rows.forEach(r => io.observe(r));
  }
})();
