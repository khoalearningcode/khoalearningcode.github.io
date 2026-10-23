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
// Animated, illustrative particle field; no experimental data is represented.
const canvas = document.querySelector('#network');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height, frame = 0, visible = true;
  const pointer = { x: 0, y: 0 };
  function resize() { const rect = canvas.getBoundingClientRect(); width = rect.width; height = rect.height; const ratio = Math.min(devicePixelRatio || 1, 2); canvas.width = width * ratio; canvas.height = height * ratio; ctx.setTransform(ratio, 0, 0, ratio, 0, 0); }
  new ResizeObserver(resize).observe(canvas);
  const points = Array.from({ length: 62 }, (_, i) => ({ angle: i * 2.39996, radius: 0.32 + (i % 6) * .028, phase: i * .45 }));
  canvas.parentElement.addEventListener('pointermove', event => { const rect = canvas.getBoundingClientRect(); pointer.x = (event.clientX - rect.left - width/2)*.035; pointer.y = (event.clientY - rect.top - height/2)*.035; });
  canvas.parentElement.addEventListener('pointerleave', () => { pointer.x = pointer.y = 0; });
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }).observe(canvas);
  function draw() {
    if (!document.hidden && visible && width && (!motionPaused || frame === 0)) {
      ctx.clearRect(0,0,width,height);
      const time = reducedMotion ? 0 : frame * .003;
      const projected = points.map(p => { const a = p.angle + time; const r = Math.min(width,height) * p.radius; return { x: width/2 + Math.cos(a)*r*1.45 + pointer.x, y: height/2 + Math.sin(a)*r + Math.cos(p.phase+time)*26 + pointer.y }; });
      projected.forEach((p,i) => { projected.slice(i+1).forEach(q => { const distance = Math.hypot(p.x-q.x,p.y-q.y); if (distance < 73) { ctx.strokeStyle=`rgba(130,160,255,${(1-distance/73)*.45})`;ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke(); } });ctx.fillStyle=i%7===0?'#9de8cc':'#8da6f5';ctx.beginPath();ctx.arc(p.x,p.y,i%7===0?2.5:1.3,0,Math.PI*2);ctx.fill(); });
      frame++;
    }
    if (!reducedMotion) requestAnimationFrame(draw);
  }
  resize(); draw();
}
const typeLine = document.querySelector('#type-line');
if (typeLine && !reducedMotion) {
  const phrases = ['building grounded intelligence', 'exploring multimodal reasoning', 'connecting research to systems'];
  let phrase=0,letter=phrases[0].length,deleting=true;
  function type() { if (motionPaused) { setTimeout(type,500); return; } const text=phrases[phrase]; typeLine.textContent=text.slice(0,letter); if (deleting) { letter--; if(letter<0){deleting=false;phrase=(phrase+1)%phrases.length;letter=0;} } else { letter++; if(letter>text.length){deleting=true;setTimeout(type,2300);return;} } setTimeout(type,deleting?35:65); }
  setTimeout(type,2500);
}
