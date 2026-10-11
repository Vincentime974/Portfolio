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
