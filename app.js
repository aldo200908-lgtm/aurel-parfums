'use strict';
const $ = selector => document.querySelector(selector);
let active = 0, playing = false, timer, selected = 0, currentFilter = 'all';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const total = fragrances.length;
const productLabel = p => `${p.brand} · ${p.name}`;
function bottle(p, eager = false) {
 return `<img class="bottle-image" src="./assets/perfumes/${p.id}.webp" alt="${productLabel(p)}" width="560" height="840" loading="${eager ? 'eager' : 'lazy'}" decoding="async" draggable="false">`;
}
$('#stage').innerHTML = fragrances.map((p, i) => `<button class="perfume" data-index="${i}" ${Math.abs(carouselPosition(i, 0, total)) > 2 ? 'hidden' : ''} aria-label="Seleccionar ${productLabel(p)}">${bottle(p, Math.abs(carouselPosition(i, 0, total)) <= 2)}</button>`).join('');
$('#products').innerHTML = fragrances.map((p, i) => `<button class="product" data-index="${i}" data-family="${p.group}" aria-label="Descubrir ${productLabel(p)}"><div class="product-art" style="--glow:${p.glow}"><span class="product-num">${String(i+1).padStart(2, '0')}</span>${bottle(p)}</div><span class="product-brand">${p.brand}</span><h3>${p.name}</h3><p>${p.design}</p><div class="product-bottom"><span>EXPLORAR PERFUME</span><span>↗</span></div></button>`).join('');
$('#total').textContent = String(total).padStart(2, '0');
$('#all-count').textContent = total;
function show(index) {
 active = (index + total) % total;
 const p = fragrances[active];
 document.querySelectorAll('.perfume').forEach((el, i) => {
  const position = carouselPosition(i, active, total);
  el.hidden = Math.abs(position) > 2;
  el.dataset.position = position;
  el.setAttribute('aria-current', String(position === 0));
  el.setAttribute('aria-label', `${position === 0 ? 'Descubrir' : 'Seleccionar'} ${productLabel(fragrances[i])}`);
  el.tabIndex = position === 0 ? 0 : -1;
  if (!el.hidden) el.querySelector('img').loading = 'eager';
 });
 $('#stage').setAttribute('aria-label', `Galería de ${total} perfumes. ${active+1} de ${total}: ${productLabel(p)}`);
 $('#active-name').textContent = p.name;
 $('#family').textContent = p.brand.toUpperCase();
 $('#active-notes').textContent = p.design;
 $('#current').textContent = String(active + 1).padStart(2, '0');
 $('.light').style.background = `radial-gradient(ellipse at 50% 45%,${p.glow},transparent 65%)`;
}
function stop() {
 playing = false; clearInterval(timer);
 $('#autoplay').innerHTML = 'REPRODUCIR <span>▷</span>';
 $('#autoplay').setAttribute('aria-label', 'Activar reproducción automática');
 $('#autoplay').setAttribute('aria-pressed', 'false');
}
function manual(index) { stop(); show(index); }
$('#prev').onclick = () => manual(active-1);
$('#next').onclick = () => manual(active+1);
let startX, startY, swiped = false;
$('#stage').onclick = e => {
 if (swiped) { swiped = false; return; }
 const el = e.target.closest('.perfume');
 if (el) { const i = Number(el.dataset.index); if (i === active) openDetail(i); else manual(i); }
};
$('#stage').addEventListener('keydown', e => {
 if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
  e.preventDefault(); manual(active + (e.key === 'ArrowRight' ? 1 : -1));
  $('.perfume[aria-current="true"]').focus();
 }
});
$('#stage').addEventListener('pointerdown', e => { startX = e.clientX; startY = e.clientY; swiped = false; });
$('#stage').addEventListener('pointerup', e => {
 if (startX == null) return;
 const dx = e.clientX-startX, dy = e.clientY-startY;
 if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { swiped = true; manual(active + (dx < 0 ? 1 : -1)); }
 startX = null;
});
$('#stage').addEventListener('pointercancel', () => { startX = null; });
$('#autoplay').onclick = () => {
 if (playing) { stop(); return; }
 playing = true;
 $('#autoplay').innerHTML = 'PAUSAR <span>Ⅱ</span>';
 $('#autoplay').setAttribute('aria-label', 'Pausar reproducción automática');
 $('#autoplay').setAttribute('aria-pressed', 'true');
 timer = setInterval(() => show(active+1), 4500);
};
document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
const dialog = $('#detail'); let oldOverflow = '';
function openDetail(i) {
 stop(); selected = i; const p = fragrances[i];
 $('#detail-art').innerHTML = bottle(p, true);
 $('#detail-art').style.setProperty('--glow', p.glow);
 $('#detail-name').textContent = p.name;
 $('#detail-family').textContent = p.brand.toUpperCase();
 $('#detail-desc').textContent = p.desc;
 $('#top-notes').textContent = p.color;
 $('#heart-notes').textContent = p.detail;
 $('#base-notes').textContent = p.brand;
 oldOverflow = document.body.style.overflow;
 document.body.style.overflow = 'hidden'; dialog.showModal();
}
$('#explore').onclick = () => openDetail(active);
$('.close').onclick = () => dialog.close();
dialog.addEventListener('close', () => { document.body.style.overflow = oldOverflow; });
dialog.onclick = e => {
 if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); }
};
$('#products').onclick = e => { const p = e.target.closest('.product'); if (p) openDetail(Number(p.dataset.index)); };
$('#choose').onclick = () => { dialog.close(); manual(selected); $('#inicio').scrollIntoView({behavior:reduced?'instant':'smooth'}); $('#explore').focus({preventScroll:true}); };
$('#openCollection').onclick = () => $('#coleccion').scrollIntoView({behavior:reduced?'instant':'smooth'});
function filterProducts() {
 const query = normalizeSearch($('#search').value.trim()); let visible = 0;
 document.querySelectorAll('.product').forEach((el, i) => {
  const p = fragrances[i];
  el.hidden = (currentFilter !== 'all' && p.group !== currentFilter) || !normalizeSearch(productLabel(p)).includes(query);
  if (!el.hidden) visible++;
 });
 $('#results-count').textContent = `${visible} ${visible === 1 ? 'perfume' : 'perfumes'}`;
 $('#empty').hidden = visible !== 0;
}
document.querySelectorAll('[data-filter]').forEach(button => button.onclick = () => {
 currentFilter = button.dataset.filter;
 document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
 filterProducts();
});
$('#search').addEventListener('input', filterProducts);
$('#reset-search').onclick = () => { $('#search').value = ''; currentFilter = 'all'; document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === 'all'))); filterProducts(); $('#search').focus(); };
if ('IntersectionObserver' in window && !reduced) {
 const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }), {threshold:.1});
 document.querySelectorAll('.section-heading,.maison-art,.maison-copy,.closing>h2').forEach(el => { el.classList.add('reveal'); observer.observe(el); });
}
$('#year').textContent = new Date().getFullYear();
show(0); filterProducts();
