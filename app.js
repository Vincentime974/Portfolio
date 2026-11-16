const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');
menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); menu.textContent = open ? 'Fermer −' : 'Menu +'; });
const closeMenu = () => { menu?.setAttribute('aria-expanded','false'); nav?.classList.remove('open'); if(menu) menu.textContent='Menu +'; };
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click',closeMenu));
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeMenu(); });
document.querySelector('#year')?.replaceChildren(String(new Date().getFullYear()));
document.querySelector('.copy')?.addEventListener('click',async () => { const status=document.querySelector('#copy-status'); try { await navigator.clipboard.writeText('vincentanavillela974@gmail.com'); status.textContent='Adresse copiée !'; } catch { status.textContent='Vous pouvez sélectionner et copier l’adresse ci-dessus.'; } });
document.querySelector('#contact-form')?.addEventListener('submit',e => { e.preventDefault(); const data=new FormData(e.currentTarget); const subject=encodeURIComponent('Contact portfolio — '+data.get('name')); const body=encodeURIComponent('Nom : '+data.get('name')+'\nE-mail : '+data.get('email')+'\n\n'+data.get('message')); location.href='mailto:vincentanavillela974@gmail.com?subject='+subject+'&body='+body; });
if ('IntersectionObserver' in window) { const observer=new IntersectionObserver(entries => entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:0.07}); document.querySelectorAll('.section').forEach(s=>{s.classList.add('reveal');observer.observe(s);}); }

// Le lien reste absent tant que la collection réelle n’est pas renseignée.
const PEARLTREES_URL = '';
const slot = document.querySelector('#pearltrees-slot');
if (slot && /^https:\/\/(www\.)?pearltrees\.com\//i.test(PEARLTREES_URL)) {
  const link = document.createElement('a');
  link.href = PEARLTREES_URL; link.target = '_blank'; link.rel = 'noopener';
  link.className = 'text-link'; link.textContent = 'Consulter ma veille sur Pearltrees ↗';
  slot.querySelector('p')?.remove(); slot.append(link);
}
const rail = document.querySelector('.watch-rail');
if (rail) {
  const controls = document.querySelector('.watch-controls');
  const buttons = [...document.querySelectorAll('[data-watch-direction]')];
  controls.hidden = false;
  const updateControls = () => buttons.forEach(button => {
    button.disabled = Number(button.dataset.watchDirection) < 0
      ? rail.scrollLeft <= 2 : rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
  });
  buttons.forEach(button => button.addEventListener('click', () => {
    rail.scrollBy({left: Number(button.dataset.watchDirection) * (rail.firstElementChild.getBoundingClientRect().width + 20),
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  }));
  rail.addEventListener('scroll', updateControls, {passive:true});
  window.addEventListener('resize', updateControls); updateControls();
}
