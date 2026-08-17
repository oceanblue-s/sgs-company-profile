/* ==========================================================================
   PT. SENTRA GARUDA CAKRA PRATAMA (SGS)
   script.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================
     NAVBAR SCROLL STATE
  ========================================================== */

  const navbar = document.querySelector('.navbar');

  const onScroll = () => {

    if (!navbar) return;

    if (window.scrollY > 40) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }

  };

  onScroll();

  window.addEventListener(
    'scroll',
    onScroll,
    { passive: true }
  );


  /* ==========================================================
     MOBILE NAVIGATION
  ========================================================== */

  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (toggle && mobileNav) {

    toggle.addEventListener('click', () => {

      toggle.classList.toggle('is-open');
      mobileNav.classList.toggle('is-open');

      document.body.style.overflow =
        mobileNav.classList.contains('is-open')
          ? 'hidden'
          : '';

    });


    mobileNav.querySelectorAll('a').forEach(link => {

      link.addEventListener('click', () => {

        toggle.classList.remove('is-open');
        mobileNav.classList.remove('is-open');

        document.body.style.overflow = '';

      });

    });

  }


  /* ==========================================================
     SCROLL REVEAL
  ========================================================== */

  const reduceMotion =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

  const revealEls =
    document.querySelectorAll(
      '[data-reveal], .timeline-step'
    );


  if (reduceMotion) {

    revealEls.forEach(el => {
      el.classList.add('is-visible');
    });

  } else if ('IntersectionObserver' in window) {

    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(entry => {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                'is-visible'
              );

              observer.unobserve(
                entry.target
              );

            }

          });

        },
        {
          threshold: 0.15,
          rootMargin: '0px 0px -60px 0px'
        }
      );


    revealEls.forEach(el => {
      observer.observe(el);
    });

  } else {

    revealEls.forEach(el => {
      el.classList.add('is-visible');
    });

  }


  /* ==========================================================
     ACTIVE NAVIGATION
  ========================================================== */

  const path =
    window.location.pathname
      .split('/')
      .pop() || 'index.html';


  document
    .querySelectorAll(
      '.nav-links a, .mobile-nav a'
    )
    .forEach(link => {

      const href =
        link.getAttribute('href');

      if (
        href === path ||
        (path === '' && href === 'index.html')
      ) {

        link.classList.add('active');

      }

    });


  /* ==========================================================
     CONTACT FORM → WHATSAPP SGS
  ========================================================== */

  const form =
    document.querySelector('#contact-form');


  if (form) {

    const successBox =
      document.querySelector('.form-success');


    /* ----------------------------------------------------------
       KONFIGURASI WHATSAPP SGS
    ---------------------------------------------------------- */

    const whatsappNumber =
      '6282211227088';


    /* ----------------------------------------------------------
       ERROR HANDLER
    ---------------------------------------------------------- */

    const showError = (field, message) => {

      field.classList.add('error');

      const errorMessage =
        field.querySelector('.err-msg');

      if (errorMessage) {
        errorMessage.textContent = message;
      }

    };


    const clearError = (field) => {

      field.classList.remove('error');

      const errorMessage =
        field.querySelector('.err-msg');

      if (errorMessage) {
        errorMessage.textContent = '';
      }

    };


    /* ----------------------------------------------------------
       SUBMIT FORM
    ---------------------------------------------------------- */

    form.addEventListener(
      'submit',
      (event) => {

        event.preventDefault();

        let valid = true;


        /* ======================================================
           VALIDASI FIELD
        ====================================================== */

        form
          .querySelectorAll('.form-field')
          .forEach(field => {

            const input =
              field.querySelector(
                'input, textarea, select'
              );

            if (!input) return;

            clearError(field);


            /* REQUIRED */

            if (
              input.hasAttribute('required') &&
              !input.value.trim()
            ) {

              showError(
                field,
                'Kolom ini wajib diisi.'
              );

              valid = false;

              return;
            }


            /* EMAIL */

            if (
              input.type === 'email' &&
              input.value.trim()
            ) {

              const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


              if (
                !emailRegex.test(
                  input.value.trim()
                )
              ) {

                showError(
                  field,
                  'Masukkan alamat email yang valid.'
                );

                valid = false;

              }

            }


            /* TELEPHONE */

            if (
              input.type === 'tel' &&
              input.value.trim()
            ) {

              const phoneRegex =
                /^[0-9+\-\s()]{8,}$/;


              if (
                !phoneRegex.test(
                  input.value.trim()
                )
              ) {

                showError(
                  field,
                  'Masukkan nomor WhatsApp yang valid.'
                );

                valid = false;

              }

            }

          });


        /* ======================================================
           STOP JIKA VALIDASI GAGAL
        ====================================================== */

        if (!valid) {

          const firstError =
            form.querySelector(
              '.form-field.error input, ' +
              '.form-field.error select, ' +
              '.form-field.error textarea'
            );

          if (firstError) {
            firstError.focus();
          }

          return;

        }


        /* ======================================================
           AMBIL DATA FORM
        ====================================================== */

        const nama =
          document
            .querySelector('#nama')
            .value
            .trim();


        const perusahaan =
          document
            .querySelector('#perusahaan')
            .value
            .trim();


        const telepon =
          document
            .querySelector('#telepon')
            .value
            .trim();


        const email =
          document
            .querySelector('#email')
            .value
            .trim();


        const layanan =
          document
            .querySelector('#layanan')
            .value
            .trim();


        const pesan =
          document
            .querySelector('#pesan')
            .value
            .trim();


        /* ======================================================
           FORMAT PESAN WHATSAPP
        ====================================================== */

        const whatsappMessage =
`Halo SGS,

Saya ingin mengajukan permintaan informasi layanan.

*DATA CLIENT*
Nama: ${nama}
Perusahaan: ${perusahaan}
WhatsApp: ${telepon}
Email: ${email || '-'}

*KEBUTUHAN LAYANAN*
${layanan}

*DETAIL KEBUTUHAN*
${pesan}

Mohon informasi lebih lanjut mengenai layanan dan penawaran dari PT. Sentra Garuda Cakra Pratama.

Terima kasih.`;


        /* ======================================================
           ENCODE PESAN
        ====================================================== */

        const encodedMessage =
          encodeURIComponent(
            whatsappMessage
          );


        /* ======================================================
           URL WHATSAPP
        ====================================================== */

        const whatsappURL =
          `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;


        /* ======================================================
           TAMPILKAN STATUS
        ====================================================== */

        if (successBox) {

          successBox.classList.add(
            'is-visible'
          );

          successBox.innerHTML =
            'Permintaan Anda sedang diarahkan ke <strong>WhatsApp SGS</strong>.';

        }


        /* ======================================================
           BUKA WHATSAPP
        ====================================================== */

        window.open(
          whatsappURL,
          '_blank',
          'noopener,noreferrer'
        );


        /* ======================================================
           RESET FORM
        ====================================================== */

        setTimeout(() => {

          form.reset();

        }, 500);

      }
    );


    /* ==========================================================
       CLEAR ERROR SAAT USER MENGETIK
    ========================================================== */

    form
      .querySelectorAll(
        'input, textarea, select'
      )
      .forEach(input => {

        input.addEventListener(
          'input',
          () => {

            const field =
              input.closest(
                '.form-field'
              );

            if (field) {
              clearError(field);
            }

          }
        );


        input.addEventListener(
          'change',
          () => {

            const field =
              input.closest(
                '.form-field'
              );

            if (field) {
              clearError(field);
            }

          }
        );

      });

  }

});
