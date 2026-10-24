const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let motionPaused = reducedMotion;
try { if (localStorage.getItem('khoa-motion') === 'paused') motionPaused = true; } catch {}
const motionButton = document.querySelector('.motion-toggle');
function updateMotion() { document.body.classList.toggle('motion-paused', motionPaused); motionButton?.setAttribute('aria-pressed', String(motionPaused)); motionButton?.setAttribute('aria-label', motionPaused ? 'Resume decorative motion' : 'Pause decorative motion'); if (motionButton) motionButton.textContent = motionPaused ? '▷ Motion' : 'Ⅱ Motion'; }
updateMotion();
motionButton?.addEventListener('click', () => { motionPaused = !motionPaused; updateMotion(); try { localStorage.setItem('khoa-motion', motionPaused ? 'paused' : 'on'); } catch {} });
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
  try { await navigator.clipboard.writeText('godminhkhoa@gmail.com'); status.textContent = 'Email copied.'; }
  catch { status.textContent = 'godminhkhoa@gmail.com'; }
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
  // Hide filters that have no entries yet instead of showing an empty "00" tab.
  document.querySelectorAll('[data-filter]').forEach(button => {
    const key = button.dataset.filter;
    if (key !== 'all' && !cards.some(card => card.dataset.category === key)) button.hidden = true;
  });
  // Counts come from the cards so they never need manual updates.
  document.querySelectorAll('[data-filter]').forEach(button => {
    const key = button.dataset.filter;
    const n = key === 'all' ? cards.length : cards.filter(card => card.dataset.category === key).length;
    const badge = button.querySelector('span');
    if (badge) badge.textContent = String(n).padStart(2, '0');
  });
  applyWorkFilter(new URLSearchParams(location.search).get('filter') || 'all');
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => applyWorkFilter(button.dataset.filter, true)));
}
const dialog = document.querySelector('.image-dialog');
let dialogTrigger;
document.querySelectorAll('.zoom-image').forEach(button => button.addEventListener('click', () => {
  if (!dialog) return;
  dialogTrigger = button;
  dialog.setZoom?.(1);
  stage.scrollTo(0, 0);
  dialog.querySelector('img').src = button.dataset.image;
  dialog.querySelector('img').alt = button.dataset.caption || button.querySelector('img')?.alt || 'Project figure';
  dialog.querySelector('p').textContent = button.dataset.caption || '';
  dialog.showModal();
}));
dialog?.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
// Zoom and pan for large diagrams: buttons, double-click, drag, and keyboard (+ / - / 0).
let zoomLevel = 1;
let stage, zoomLabel;
if (dialog) {
  const img = dialog.querySelector('img');
  stage = document.createElement('div');
  stage.className = 'dialog-stage';
  img.replaceWith(stage);
  stage.append(img);
  const bar = document.createElement('div');
  bar.className = 'dialog-zoom';
  bar.innerHTML = '<button type="button" data-zoom="out" aria-label="Zoom out">−</button><button type="button" data-zoom="fit" aria-label="Fit to window"><span>100%</span></button><button type="button" data-zoom="in" aria-label="Zoom in">+</button>';
  stage.before(bar);
  zoomLabel = bar.querySelector('span');
  const setZoom = (value, anchor) => {
    const previous = zoomLevel;
    zoomLevel = Math.min(5, Math.max(1, value));
    img.style.width = `${zoomLevel * 100}%`;
    img.style.maxWidth = zoomLevel > 1 ? 'none' : '100%';
    img.style.maxHeight = zoomLevel > 1 ? 'none' : '';
    stage.classList.toggle('zoomed', zoomLevel > 1);
    zoomLabel.textContent = `${Math.round(zoomLevel * 100)}%`;
    if (anchor && previous !== zoomLevel) {
      const ratio = zoomLevel / previous;
      stage.scrollLeft = (stage.scrollLeft + anchor.x) * ratio - anchor.x;
      stage.scrollTop = (stage.scrollTop + anchor.y) * ratio - anchor.y;
    }
  };
  dialog.setZoom = setZoom;
  bar.addEventListener('click', event => {
    const action = event.target.closest('[data-zoom]')?.dataset.zoom;
    const center = { x: stage.clientWidth / 2, y: stage.clientHeight / 2 };
    if (action === 'in') setZoom(zoomLevel * 1.5, center);
    if (action === 'out') setZoom(zoomLevel / 1.5, center);
    if (action === 'fit') setZoom(1);
  });
  img.addEventListener('dblclick', event => {
    const rect = stage.getBoundingClientRect();
    setZoom(zoomLevel > 1 ? 1 : 2.5, { x: event.clientX - rect.left, y: event.clientY - rect.top });
  });
  let drag;
  stage.addEventListener('pointerdown', event => {
    if (zoomLevel === 1 || event.button !== 0) return;
    drag = { x: event.clientX, y: event.clientY, left: stage.scrollLeft, top: stage.scrollTop };
    stage.setPointerCapture(event.pointerId);
    stage.classList.add('panning');
  });
  stage.addEventListener('pointermove', event => {
    if (!drag) return;
    stage.scrollLeft = drag.left - (event.clientX - drag.x);
    stage.scrollTop = drag.top - (event.clientY - drag.y);
  });
  const endDrag = () => { drag = undefined; stage.classList.remove('panning'); };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
  dialog.addEventListener('keydown', event => {
    const center = { x: stage.clientWidth / 2, y: stage.clientHeight / 2 };
    if (event.key === '+' || event.key === '=') setZoom(zoomLevel * 1.5, center);
    if (event.key === '-') setZoom(zoomLevel / 1.5, center);
    if (event.key === '0') setZoom(1);
  });
}
dialog?.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
dialog?.addEventListener('close', () => dialogTrigger?.focus());
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
