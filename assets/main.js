const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let motionPaused = reducedMotion;
const motionButton = document.querySelector('.motion-toggle');
function updateMotion() { document.body.classList.toggle('motion-paused', motionPaused); motionButton?.setAttribute('aria-pressed', String(motionPaused)); motionButton?.setAttribute('aria-label', motionPaused ? 'Resume decorative motion' : 'Pause decorative motion'); if (motionButton) motionButton.textContent = motionPaused ? '▷ Motion' : 'Ⅱ Motion'; }
updateMotion();
motionButton?.addEventListener('click', () => { motionPaused = !motionPaused; updateMotion(); });
const themeButton = document.querySelector('.theme-toggle');
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeButton?.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  if (themeButton) themeButton.textContent = theme === 'dark' ? '☼' : '☾';
}
let savedTheme;
try { savedTheme = localStorage.getItem('khoa-theme'); } catch {}
setTheme(savedTheme === 'light' ? 'light' : 'dark');
themeButton?.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  setTheme(theme);
  try { localStorage.setItem('khoa-theme', theme); } catch {}
});
document.querySelector('#copy-email')?.addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try { await navigator.clipboard.writeText('minhkhoaae@gmail.com'); status.textContent = 'Email copied.'; }
  catch { status.textContent = 'minhkhoaae@gmail.com'; }
});
const cards = [...document.querySelectorAll('.project-card')];
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  let count = 0;
  cards.forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; if (!card.hidden) { count++; card.classList.add('in-view'); } });
  document.querySelector('#filter-status').textContent = `${count} projects shown.`;
}));
const dialog = document.querySelector('.image-dialog');
let dialogTrigger;
document.querySelectorAll('.zoom-image').forEach(button => button.addEventListener('click', () => {
  if (!dialog) return;
  dialogTrigger = button;
  dialog.querySelector('img').src = button.dataset.image;
  dialog.querySelector('img').alt = button.dataset.caption || button.querySelector('img')?.alt || 'Project figure';
  dialog.querySelector('p').textContent = button.dataset.caption || '';
  dialog.showModal();
}));
dialog?.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
dialog?.addEventListener('close', () => dialogTrigger?.focus());
if (!reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); } }), { threshold: 0.08 });
  document.querySelectorAll('.section-heading,.project-card,.publication,.research-bottom,.artifact,.experience article,.education,.case-body section').forEach(element => { element.classList.add('reveal-ready'); observer.observe(element); });
}
const progress = document.createElement('div'); progress.className = 'page-progress'; progress.setAttribute('aria-hidden','true'); document.body.append(progress);
let scrollPending = false;
function updateScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${max > 0 ? scrollY / max * 100 : 0}%`;
  document.querySelector('.to-top')?.classList.toggle('visible', scrollY > 650);
  scrollPending = false;
}
addEventListener('scroll', () => { if (!scrollPending) { requestAnimationFrame(updateScroll); scrollPending = true; } }, { passive: true });
updateScroll();
