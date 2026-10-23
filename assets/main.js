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
const cards = [...document.querySelectorAll('.activity-card')];
const filterLabels = { all: 'All work', research: 'Research', industry: 'Industry', 'self-project': 'Self Project', challenge: 'Challenge' };
function applyWorkFilter(category, updateUrl = false) {
  if (!Object.hasOwn(filterLabels, category)) category = 'all';
  document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
  let count = 0;
  cards.forEach(card => {
    card.hidden = category !== 'all' && card.dataset.category !== category;
    if (!card.hidden) { count++; card.classList.add('in-view'); }
  });
  const emptyState = document.querySelector('.work-empty');
  if (emptyState) emptyState.hidden = count !== 0;
  const status = document.querySelector('#filter-status');
  if (status) status.textContent = `${filterLabels[category]} · ${count} ${count === 1 ? 'entry' : 'entries'}`;
  if (updateUrl) {
    const url = new URL(location.href);
    if (category === 'all') url.searchParams.delete('filter'); else url.searchParams.set('filter', category);
    url.hash = 'work';
    history.replaceState(null, '', url);
  }
}
if (cards.length) {
  applyWorkFilter(new URLSearchParams(location.search).get('filter') || 'all');
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => applyWorkFilter(button.dataset.filter, true)));
}
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
  document.querySelectorAll('.section-heading,.activity-card,.timeline-entry,.career-panel,.profile-facts,.case-body section').forEach(element => { element.classList.add('reveal-ready'); observer.observe(element); });
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

const route = location.pathname.split('/').pop();
if (route === 'career.html') document.querySelectorAll('nav a').forEach(a => { if (a.textContent === 'Career') a.setAttribute('aria-current','page'); });
if (location.pathname.includes('/channels/') || location.pathname.includes('/projects/')) {
  document.querySelectorAll('nav a').forEach(a => { if (a.textContent === 'Work') a.setAttribute('aria-current','page'); });
}
