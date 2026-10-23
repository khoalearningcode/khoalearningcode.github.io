(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const still = () => reduced || document.body.classList.contains('motion-paused');

  // Scroll progress bar
  const bar = document.createElement('div');
  bar.className = 'fx-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.prepend(bar);
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.setProperty('--p', max > 0 ? Math.min(scrollY / max, 1) : 0);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Count-up for headline numbers
  const countUp = el => {
    const text = el.textContent.trim();
    const m = text.match(/^([#+\-−]?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
    if (!m || still()) return;
    const [, pre, num, post] = m;
    const target = parseFloat(num.replace(/,/g, ''));
    const decimals = (num.split('.')[1] || '').length;
    const comma = num.includes(',');
    const fmt = v => {
      const s = v.toFixed(decimals);
      return comma ? Number(s).toLocaleString('en-US', { minimumFractionDigits: decimals }) : s;
    };
    const t0 = performance.now(), dur = 1100;
    const tick = now => {
      const k = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - k, 3);
      el.textContent = pre + fmt(target * e) + post;
      if (k < 1) requestAnimationFrame(tick); else el.textContent = text;
    };
    requestAnimationFrame(tick);
  };

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
    el.querySelectorAll('.card-results strong, .result-stats strong, .proof-strip strong').forEach(countUp);
    if (el.matches('.result-stats > div, .proof-strip > div')) el.querySelectorAll('strong').forEach(countUp);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { seen(en.target); io.unobserve(en.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.fx-reveal').forEach(el => io.observe(el));
  } else document.querySelectorAll('.fx-reveal').forEach(el => el.classList.add('fx-in'));

  // Tilt + spotlight (fine pointers only)
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.activity-card, .paper-feature, .result-stats > div, .proof-strip > div').forEach(el => {
      el.classList.add('fx-tilt');
      el.addEventListener('pointermove', ev => {
        const r = el.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width, y = (ev.clientY - r.top) / r.height;
        el.style.setProperty('--mx', x * 100 + '%');
        el.style.setProperty('--my', y * 100 + '%');
        if (still()) return;
        const big = el.matches('.paper-feature, .activity-card') ? 5 : 3;
        el.style.setProperty('--ry', (x - 0.5) * big * 2 + 'deg');
        el.style.setProperty('--rx', (0.5 - y) * big * 2 + 'deg');
      });
      el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
    });

    // Soft cursor glow
    const glow = document.createElement('div');
    glow.className = 'fx-cursor';
    glow.setAttribute('aria-hidden', 'true');
    document.body.append(glow);
    let gx = 0, gy = 0, raf = 0;
    addEventListener('pointermove', ev => {
      gx = ev.clientX; gy = ev.clientY;
      if (still()) return;
      glow.classList.add('on');
      if (!raf) raf = requestAnimationFrame(() => { glow.style.transform = `translate3d(${gx}px,${gy}px,0)`; raf = 0; });
    }, { passive: true });
    document.addEventListener('pointerleave', () => glow.classList.remove('on'));
  }
})();
