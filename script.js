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

  // Kirim inquiry form langsung ke WhatsApp Marketing SGS
  const form = $('#inquiry-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      $$('.field', form).forEach(field => {
        const input = $('input,textarea', field), err = $('.form-error', field);
        const ok = input && input.value.trim().length >= (input.name === 'email' ? 5 : 2);
        if (err) err.style.display = ok ? 'none' : 'block';
        if (!ok) valid = false;
      });
      const status = $('.form-status', form);
      if (valid) {
        const nama = ($('#nama', form)?.value || '').trim();
        const perusahaan = ($('#perusahaan', form)?.value || '').trim();
        const wa = ($('#wa', form)?.value || '').trim();
        const email = ($('#email', form)?.value || '').trim();
        const kebutuhan = ($('#kebutuhan', form)?.value || '').trim();
        const pesan = ($('#pesan', form)?.value || '').trim();

        const text = `Halo Marketing SGS, saya ingin mengajukan inquiry melalui website:\n\n` +
          `• *Nama:* ${nama}\n` +
          `• *Perusahaan:* ${perusahaan}\n` +
          `• *Nomor WhatsApp:* ${wa}\n` +
          `• *Email:* ${email}\n` +
          `• *Kebutuhan:* ${kebutuhan}\n` +
          `• *Pesan:*\n${pesan}`;

        const waUrl = `https://wa.me/6282189800300?text=${encodeURIComponent(text)}`;
        window.open(waUrl, '_blank');

        status.textContent = 'Membuka WhatsApp untuk mengirim inquiry...';
        status.style.display = 'block';
        form.reset();
      } else {
        status.style.display = 'none';
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

  // Counter Section Animation with IntersectionObserver
  const counterItems = $$('.counter-val');
  if (counterItems.length) {
    const animateCounter = (el) => {
      const target = parseFloat(el.getAttribute('data-target') || '0');
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      const isLocale = el.getAttribute('data-format') === 'locale';
      const duration = 2000;
      const startTime = performance.now();

      const update = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        const currentVal = progress === 1 ? target : (target * ease);

        if (decimals > 0) {
          el.textContent = currentVal.toFixed(decimals);
        } else {
          const intVal = Math.floor(currentVal);
          el.textContent = isLocale ? intVal.toLocaleString('id-ID') : intVal;
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          if (decimals > 0) {
            el.textContent = target.toFixed(decimals);
          } else {
            el.textContent = isLocale ? Math.round(target).toLocaleString('id-ID') : Math.round(target);
          }
        }
      };

      requestAnimationFrame(update);
    };

    const counterSections = $$('.counter-section');
    if (counterSections.length) {
      const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            $$('.counter-val', entry.target).forEach(animateCounter);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      counterSections.forEach(sec => counterObserver.observe(sec));
    }
  }
})();
