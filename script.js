(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  // Mobile navigation
  const menuBtn = $('.menu-toggle');
  const drawer = $('.mobile-drawer');
  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open);
      menuBtn.textContent = open ? '×' : '☰';
    });
    $$('.mobile-drawer a').forEach(a => a.addEventListener('click', () => {
      drawer.classList.remove('open'); menuBtn.setAttribute('aria-expanded','false'); menuBtn.textContent='☰';
    }));
  }

  // Hero slider: autoplay, arrows, dots, keyboard, touch swipe.
  const slides = $$('.hero-slide'), dots = $$('.hero-dot');
  let current = 0, timer;
  const show = n => {
    current = (n + slides.length) % slides.length;
    slides.forEach((s,i)=>s.classList.toggle('active',i===current));
    dots.forEach((d,i)=>d.classList.toggle('active',i===current));
  };
  const restart = () => { clearInterval(timer); timer = setInterval(()=>show(current+1),6000); };
  if (slides.length) {
    $('.next')?.addEventListener('click',()=>{show(current+1);restart()});
    $('.prev')?.addEventListener('click',()=>{show(current-1);restart()});
    dots.forEach((d,i)=>d.addEventListener('click',()=>{show(i);restart()}));
    $('.hero')?.addEventListener('mouseenter',()=>clearInterval(timer));
    $('.hero')?.addEventListener('mouseleave',restart);
    let sx=0;
    $('.hero')?.addEventListener('touchstart',e=>sx=e.changedTouches[0].screenX,{passive:true});
    $('.hero')?.addEventListener('touchend',e=>{const dx=e.changedTouches[0].screenX-sx;if(Math.abs(dx)>50){show(current+(dx<0?1:-1));restart()}},{passive:true});
    restart();
  }

  // Reveal-on-scroll, with graceful fallback for reduced motion.
  const reveals = $$('.reveal');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) reveals.forEach(x=>x.classList.add('visible'));
  else {
    const io = new IntersectionObserver(entries => entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});
    reveals.forEach(x=>io.observe(x));
  }

  // Front-end inquiry validation. No backend is assumed.
  const form = $('#inquiry-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      $$('.field',form).forEach(field=>{
        const input = $('input,textarea',field), err=$('.form-error',field);
        const ok = input && input.value.trim().length >= (input.name==='email' ? 5 : 2);
        if (err) err.style.display = ok ? 'none' : 'block';
        if (!ok) valid=false;
      });
      const status=$('.form-status',form);
      if (valid) {
        status.textContent='Inquiry siap dikirim. Untuk respons langsung, gunakan tombol WhatsApp SGS.';
        status.style.display='block';
        form.reset();
      } else {
        status.style.display='none';
      }
    });
  }

  // Active navigation based on section position.
  // Active page navigation is rendered server-side via the .active class.
  // Keep hash-aware highlighting only for the homepage if sections are present.
  const navLinks = $$('.nav-links a');
  const sections = $$('main section[id]');
  if (sections.length) {
    const navIO = new IntersectionObserver(entries => entries.forEach(entry=>{
      if(entry.isIntersecting) navLinks.forEach(a=>{
        const href=a.getAttribute('href')||'';
        if(href.startsWith('#')) a.classList.toggle('active',href==='#'+entry.target.id);
      });
    }),{rootMargin:'-45% 0px -45% 0px'});
    sections.forEach(s=>navIO.observe(s));
  }
})();
