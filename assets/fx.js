(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const still = () => reduced || document.body.classList.contains('motion-paused');

  // Reveal on scroll
  const targets = [...document.querySelectorAll('.section-heading, .home-overview > *, .career-glance a, .proof-strip > div, .activity-card, .result-stats > div, .timeline-entry, .career-panel, .contact > *, .evidence-block, .results-section, .case-grid > *, figure')];
  const siblingIndex = new Map();
  targets.forEach(el => {
    const i = siblingIndex.get(el.parentElement) || 0;
    siblingIndex.set(el.parentElement, i + 1);
    el.style.setProperty('--d', Math.min(i, 5) * 0.09 + 's');
    if (!el.closest('.hero')) el.classList.add('fx-reveal');
  });
  const seen = el => {
    el.classList.add('fx-in');
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { seen(en.target); io.unobserve(en.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.fx-reveal').forEach(el => io.observe(el));
  } else document.querySelectorAll('.fx-reveal').forEach(el => el.classList.add('fx-in'));

  // Tilt + spotlight (fine pointers only)
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.activity-card, .paper-feature').forEach(el => {
      el.classList.add('fx-tilt');
      el.addEventListener('pointermove', ev => {
        const r = el.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width, y = (ev.clientY - r.top) / r.height;
        el.style.setProperty('--mx', x * 100 + '%');
        el.style.setProperty('--my', y * 100 + '%');
        if (still()) return;
        const big = 2;
        el.style.setProperty('--ry', (x - 0.5) * big * 2 + 'deg');
        el.style.setProperty('--rx', (0.5 - y) * big * 2 + 'deg');
      });
      el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
    });
  }
})();
