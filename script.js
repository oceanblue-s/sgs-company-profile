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

  // Recruitment Portal Features (rekrutmen.html)
  const recruitmentForm = $('#recruitment-form');
  if (recruitmentForm) {
    // 1. Auto-select position from job cards
    $$('.btn-apply').forEach(btn => {
      btn.addEventListener('click', () => {
        const pos = btn.getAttribute('data-posisi');
        const posSelect = $('#posisi_dilamar', recruitmentForm);
        if (posSelect && pos) {
          posSelect.value = pos;
          posSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
          posSelect.focus();
          posSelect.style.borderColor = 'var(--red)';
          setTimeout(() => { posSelect.style.borderColor = ''; }, 1800);
        }
      });
    });

    // 2. File upload label & size validation (max 5 MB)
    $$('input[type="file"]', recruitmentForm).forEach(input => {
      input.addEventListener('change', () => {
        const box = input.closest('.file-upload-box');
        const label = box ? $('.file-custom-label', box) : null;
        const err = input.closest('.field') ? $('.form-error', input.closest('.field')) : null;

        if (input.files && input.files[0]) {
          const file = input.files[0];
          const maxSize = 5 * 1024 * 1024; // 5 MB
          if (file.size > maxSize) {
            alert(`File "${file.name}" melebihi batas maksimal 5 MB. Silakan pilih file dengan ukuran lebih kecil.`);
            input.value = '';
            if (label) label.textContent = 'Pilih file kembali (maks 5 MB)';
            if (err) err.style.display = 'block';
            return;
          }
          if (label) {
            label.textContent = `✓ ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
            label.style.color = '#16a34a';
          }
          if (err) err.style.display = 'none';
        }
      });
    });

    // 3. Form submission & success modal
    const modal = $('#success-modal');
    const btnCloseModal = $('#btn-close-modal');

    if (btnCloseModal && modal) {
      btnCloseModal.addEventListener('click', () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      });
      modal.addEventListener('click', e => {
        if (e.target === modal) {
          modal.classList.remove('open');
          modal.setAttribute('aria-hidden', 'true');
        }
      });
    }

    recruitmentForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      let firstErrorEl = null;

      // Validate required inputs, selects, textareas, files
      const requiredInputs = $$('[required]', recruitmentForm);
      requiredInputs.forEach(el => {
        let ok = true;
        const field = el.closest('.field') || el.closest('.checkbox-field');
        const err = field ? $('.form-error', field) : null;

        if (el.type === 'checkbox') {
          ok = el.checked;
        } else if (el.type === 'file') {
          ok = el.files && el.files.length > 0;
        } else if (el.tagName.toLowerCase() === 'select') {
          ok = !!el.value;
        } else if (el.type === 'tel') {
          ok = el.value.trim().replace(/\D/g, '').length >= 10;
        } else if (el.type === 'email') {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
        } else {
          ok = el.value.trim().length >= 2;
        }

        if (err) err.style.display = ok ? 'none' : 'block';
        if (!ok) {
          valid = false;
          if (!firstErrorEl) firstErrorEl = el;
        }
      });

      if (!valid) {
        if (firstErrorEl) {
          firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (firstErrorEl.focus) firstErrorEl.focus();
        }
        return;
      }

      // Generate unique registration number: SGS-2026-XXXXX
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const regNum = `SGS-2026-${randomNum}`;
      const nama = ($('#nama_lengkap', recruitmentForm)?.value || '').trim();
      const posisi = ($('#posisi_dilamar', recruitmentForm)?.value || '').trim();
      const wa = ($('#no_wa', recruitmentForm)?.value || '').trim();
      const email = ($('#email', recruitmentForm)?.value || '').trim();
      const domisili = ($('#domisili', recruitmentForm)?.value || '').trim();
      const pendidikan = ($('#pendidikan', recruitmentForm)?.value || '').trim();
      const pengalaman = ($('#pengalaman_kerja', recruitmentForm)?.value || '').trim();

      const now = new Date();
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const tanggalFormatted = now.toLocaleDateString('id-ID', options);

      // Populate modal fields
      const regEl = $('#res-reg-num');
      const posEl = $('#res-posisi');
      const namaEl = $('#res-nama');
      const tglEl = $('#res-tanggal');
      if (regEl) regEl.textContent = regNum;
      if (posEl) posEl.textContent = posisi;
      if (namaEl) namaEl.textContent = nama;
      if (tglEl) tglEl.textContent = tanggalFormatted;

      // WhatsApp confirm text
      const waText = `Subjek: [LAMARAN] ${posisi} — ${nama} — ${regNum}\n\n` +
        `Nomor Lamaran : ${regNum}\n` +
        `Tanggal Masuk : ${tanggalFormatted}\n` +
        `Posisi : ${posisi}\n` +
        `Nama : ${nama}\n` +
        `WhatsApp : ${wa}\n` +
        `Email : ${email}\n` +
        `Domisili : ${domisili}\n` +
        `Pendidikan : ${pendidikan}\n` +
        `Pengalaman : ${pengalaman}\n` +
        `Dokumen : CV, KTP, dan Pas Foto terlampir`;

      const btnWaConfirm = $('#btn-wa-confirm');
      if (btnWaConfirm) {
        btnWaConfirm.href = `https://wa.me/6282189800300?text=${encodeURIComponent(waText)}`;
      }

      // Open success modal
      if (modal) {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
      }

      // Reset form fields
      recruitmentForm.reset();
      $$('.file-custom-label', recruitmentForm).forEach(lbl => {
        lbl.textContent = 'Pilih Berkas';
        lbl.style.color = '';
      });

      // Save submission to localStorage for instant tracking
      try {
        const stored = JSON.parse(localStorage.getItem('sgs_applications') || '[]');
        stored.unshift({
          regNum,
          nama,
          posisi,
          tanggal: tanggalFormatted,
          step: 2, // In progress: Seleksi Administrasi
          note: 'Berkas dan formulir online Anda berhasil diterima sistem HRD SGS. Tim kami sedang melakukan verifikasi berkas administrasi.'
        });
        localStorage.setItem('sgs_applications', JSON.stringify(stored.slice(0, 10)));
      } catch (e) {
        // LocalStorage fallback
      }
    });
  }

  // 4. Job Category Filter Tabs
  const filterBtns = $$('.filter-btn');
  const jobCards = $$('.job-card');
  if (filterBtns.length && jobCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        jobCards.forEach(card => {
          const cat = card.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.3s ease';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 5. Job Detail Modal Data & Handler
  const jobDetailModal = $('#job-detail-modal');
  const jobModalClose = $('#btn-close-job-modal');
  const jobModalCancel = $('#btn-job-modal-cancel');
  const jobModalApply = $('#btn-job-modal-apply');

  const jobDetailsData = {
    satpam: {
      title: 'Anggota Pengamanan (Satpam) Operasional',
      tag: 'Prioritas Penempatan',
      loc: 'Bandung & Wilayah Jawa Barat',
      edu: 'SMA / SMK Sederajat',
      type: 'Full Time (Sistem Shift)',
      desc: 'Personel garda terdepan yang bertugas menjaga keamanan fisik, ketertiban fasilitas, penegakan tata tertib lingkungan, dan pelayanan prima (Service Excellence) bagi mitra korporat SGS.',
      responsibilities: [
        'Melaksanakan pengawasan pos penjagaan dan patroli berkala di area steril',
        'Melakukan pemeriksaan akses orang, barang, dan kendaraan yang masuk / keluar fasilitas',
        'Mencatat mutasi penjagaan, serah terima tugas harian, dan insiden dalam logbook resmi',
        'Merespons secara cepat tindakan pertama tempat kejadian perkara (TPTKP) dan keadaan darurat',
        'Menerapkan standar 5S (Senyum, Sapa, Salam, Sopan, Santun) kepada seluruh staf dan tamu mitra'
      ],
      requirements: [
        'Pria / Wanita, usia 19 – 35 tahun',
        'Tinggi badan minimal 168 cm (Pria) / 158 cm (Wanita) dengan postur tubuh proporsional',
        'Pendidikan minimal SMA / SMK sederajat',
        'Diutamakan memiliki Ijazah & KTA Gada Pratama aktif (Tersedia jalur pembinaan/diklat bagi yang belum memiliki)',
        'Bebas narkoba, tidak bertato, dan tidak bertindik (khusus pria)',
        'Sehat jasmani dan rohani serta melampirkan SKCK aktif'
      ],
      benefits: [
        'Gaji pokok normatif sesuai standar regulasi UMK penempatan kerja',
        'Jaminan resmi BPJS Ketenagakerjaan (JKK, JKM, JHT) & BPJS Kesehatan',
        'Perlengkapan seragam dinas PDH/PDL lengkap dengan atribut kedinasan',
        'Jenjang karier terbuka menuju Komandan Regu (Danru) & Chief Security',
        'Program pelatihan fisik berkala dan penyegaran SOP pengamanan Ditbinmas Polri'
      ]
    },
    cleaning: {
      title: 'Cleaning Service & Office Boy / Girl',
      tag: 'Penempatan Cepat',
      loc: 'Bandung Kota & Cimahi',
      edu: 'SMP / SMA Sederajat',
      type: 'Full Time (Shift / Regular)',
      desc: 'Bertanggung jawab atas standar higienitas, kebersihan menyeluruh, kerapian ruangan kerja, serta kelancaran operasional harian kantor mitra korporat SGS.',
      responsibilities: [
        'Melakukan pembersihan berkala area lantai, kaca, toilet, koridor, dan ruang kerja direksi',
        'Mengoperasikan peralatan kebersihan komersial sesuai standar Keselamatan dan Kesehatan Kerja (K3)',
        'Membantu kebutuhan harian kantor, fotokopi dokumen, dan penyajian konsumsi tamu',
        'Mengontrol stok chemical kebersihan dan perlengkapan sanitasi harian',
        'Menjaga kerahasiaan dokumen dan integritas keamanan barang-barang milik klien'
      ],
      requirements: [
        'Pria / Wanita, usia 18 – 32 tahun',
        'Pendidikan minimal SMP / SMA / SMK sederajat',
        'Jujur, teliti, disiplin, berpenampilan bersih, dan berorientasi pada kerapian',
        'Memiliki etos kerja tinggi dan mampu bekerja sama dalam tim',
        'Pengalaman kerja di bidang cleaning service / perhotelan / perkantoran diutamakan'
      ],
      benefits: [
        'Gaji pokok normatif dan insentif kehadiran kerja',
        'Perlindungan resmi BPJS Ketenagakerjaan & BPJS Kesehatan',
        'Seragam kerja dinas bersih standar korporasi',
        'Pelatihan SOP sanitasi higienis dan hospitality service modern'
      ]
    },
    danru: {
      title: 'Komandan Regu (Danru) Security',
      tag: 'Kebutuhan Khusus',
      loc: 'Bandung Raya & Kawasan Industri',
      edu: 'SMA / D3 / S1',
      type: 'Full Time (Sistem Shift)',
      desc: 'Memimpin, mengoordinasikan, dan mengevaluasi regu pengamanan agar seluruh perimeter operasional berjalan dengan aman, tertib, dan sesuai instruksi kerja (IK).',
      responsibilities: [
        'Memimpin apel serah terima tugas regu, briefing harian, dan inspeksi kerapian personel',
        'Menyusun jadwal jaga (roster shift), plotting pos operasional, dan back-up pengamanan darurat',
        'Melakukan investigasi awal dan menyusun Berita Acara Pemeriksaan (BAP) jika terjadi insiden di lokasi',
        'Menjadi jembatan komunikasi operasional langsung antara pimpinan klien dengan manajemen operasional SGS',
        'Mengevaluasi kedisiplinan dan kesiapsiagaan seluruh anggota regu'
      ],
      requirements: [
        'Pria, usia 25 – 40 tahun',
        'Wajib memiliki Ijazah & KTA minimal Gada Madya atau Gada Pratama berpengalaman',
        'Pengalaman kerja minimal 3 tahun sebagai Danru atau Security Leader',
        'Memiliki jiwa kepemimpinan tegas, diplomatis, dan berintegritas tinggi',
        'Mampu mengoperasikan komputer dasar (MS Word & Excel untuk pelaporan digital)',
        'Memiliki SIM C / SIM A aktif'
      ],
      benefits: [
        'Gaji pokok, tunjangan jabatan kepemimpinan, dan insentif kinerja',
        'Fasilitas lengkap BPJS Ketenagakerjaan & BPJS Kesehatan',
        'Peluang karier akseleratif menuju Chief Security & Koordinator Area Jawa Barat',
        'Program pelatihan kepemimpinan manajerial sekuriti komprehensif'
      ]
    },
    staff: {
      title: 'Staff Administrasi Operasional',
      tag: 'Penempatan Kantor',
      loc: 'Head Office Bandung',
      edu: 'D3 / S1 Semua Jurusan',
      type: 'Full Time (Office Hours)',
      desc: 'Mengelola database kepegawaian personel lapangan, mutasi seragam dan logistik pos, arsip berkas pelamar, serta rekapitulasi data operasional pendukung.',
      responsibilities: [
        'Mengelola database kepersonaliaan dan berkas dokumen seluruh personel di lapangan',
        'Membuat rekapitulasi absensi harian dan rekap logbook operasional pos mitra',
        'Mendistribusikan logistik seragam, atribut dinas, dan perlengkapan penunjang tugas',
        'Menyusun laporan bulanan operasional dan surat-menyurat korespondensi klien',
        'Mendukung proses seleksi berkas awal pelamar baru dan penjadwalan interview'
      ],
      requirements: [
        'Pria / Wanita, usia maksimal 28 tahun',
        'Pendidikan minimal D3 / S1 (Manajemen / Psikologi / Hukum / Administrasi diutamakan)',
        'Mahir mengoperasikan MS Office (khususnya MS Excel formula: VLOOKUP, SUMIFS, Pivot Table)',
        'Komunikatif, teliti, rapi dalam pengarsipan dokumen, dan terbiasa bekerja dengan tenggat waktu',
        'Pengalaman administrasi di BUJP atau perusahaan alih daya (Outsourcing) menjadi nilai plus'
      ],
      benefits: [
        'Gaji pokok kompetitif dan tunjangan tetap bulanan',
        'Jaminan BPJS Ketenagakerjaan & BPJS Kesehatan lengkap',
        'Lingkungan kerja dinamis dan profesional di kantor pusat Bandung',
        'Peluang pengembangan karier di bidang HRD & Operasional'
      ]
    }
  };

  let activeModalJob = null;

  const closeJobModal = () => {
    if (jobDetailModal) {
      jobDetailModal.classList.remove('open');
      jobDetailModal.setAttribute('aria-hidden', 'true');
    }
  };

  if (jobDetailModal) {
    if (jobModalClose) jobModalClose.addEventListener('click', closeJobModal);
    if (jobModalCancel) jobModalCancel.addEventListener('click', closeJobModal);
    jobDetailModal.addEventListener('click', e => {
      if (e.target === jobDetailModal) closeJobModal();
    });

    // View detail button click
    $$('.btn-view-detail').forEach(btn => {
      btn.addEventListener('click', () => {
        const jobKey = btn.getAttribute('data-job');
        const data = jobDetailsData[jobKey];
        if (!data) return;

        activeModalJob = data.title;

        $('#job-modal-title').textContent = data.title;
        $('#job-modal-tag').textContent = data.tag;
        $('#job-modal-loc').textContent = `📍 ${data.loc}`;
        $('#job-modal-edu').textContent = `🎓 ${data.edu}`;
        $('#job-modal-type').textContent = `⏱️ ${data.type}`;
        $('#job-modal-desc').textContent = data.desc;

        const respList = $('#job-modal-responsibilities');
        respList.innerHTML = data.responsibilities.map(r => `<li>${r}</li>`).join('');

        const reqList = $('#job-modal-requirements');
        reqList.innerHTML = data.requirements.map(r => `<li>${r}</li>`).join('');

        const benList = $('#job-modal-benefits');
        benList.innerHTML = data.benefits.map(b => `<li>${b}</li>`).join('');

        jobDetailModal.classList.add('open');
        jobDetailModal.setAttribute('aria-hidden', 'false');
      });
    });

    // Apply from inside modal
    if (jobModalApply) {
      jobModalApply.addEventListener('click', () => {
        closeJobModal();
        const posSelect = $('#posisi_dilamar', recruitmentForm);
        if (posSelect && activeModalJob) {
          posSelect.value = activeModalJob;
          posSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
          posSelect.focus();
          posSelect.style.borderColor = 'var(--red)';
          setTimeout(() => { posSelect.style.borderColor = ''; }, 1800);
        }
      });
    }
  }

  // 6. Status Check & Tracking
  const statusSearchForm = $('#status-search-form');
  const statusResultContainer = $('#status-result-container');
  if (statusSearchForm && statusResultContainer) {
    statusSearchForm.addEventListener('submit', e => {
      e.preventDefault();
      const input = $('#status-search-input');
      const query = (input ? input.value : '').trim().toUpperCase();
      if (!query) return;

      // Check stored submissions first
      let matched = null;
      try {
        const stored = JSON.parse(localStorage.getItem('sgs_applications') || '[]');
        matched = stored.find(item => item.regNum.toUpperCase() === query || (item.wa && item.wa.includes(query)));
      } catch (err) {}

      // Default mock if query is demo code or new registration query
      const candidateData = matched || {
        regNum: query.startsWith('SGS') ? query : 'SGS-2026-88392',
        nama: 'Kandidat Pelamar SGS',
        posisi: 'Anggota Pengamanan (Satpam) Operasional',
        tanggal: '06 September 2026',
        step: 2,
        note: 'Berkas dan formulir pendaftaran Anda telah tercatat pada pangkalan data rekrutmen. Tim HRD SGS sedang menjalankan verifikasi berkas administrasi dan keabsahan kualifikasi.'
      };

      // Populate tracker UI
      const badgeEl = $('#track-badge');
      const namaEl = $('#track-nama');
      const posisiEl = $('#track-posisi');
      const regEl = $('#track-reg');
      const tglEl = $('#track-tanggal');
      const noteEl = $('#track-note');

      if (namaEl) namaEl.textContent = candidateData.nama;
      if (posisiEl) posisiEl.textContent = `Posisi: ${candidateData.posisi}`;
      if (regEl) regEl.textContent = `No. Registrasi: ${candidateData.regNum}`;
      if (tglEl) tglEl.textContent = candidateData.tanggal;
      if (noteEl) noteEl.textContent = candidateData.note;

      // Update 4-step timeline classes
      const currentStep = candidateData.step || 2;
      for (let s = 1; s <= 4; s++) {
        const stepEl = $(`#step-${s}`);
        if (!stepEl) continue;
        stepEl.classList.remove('step-done', 'step-active');
        if (s < currentStep) {
          stepEl.classList.add('step-done');
          const dot = $('.marker-dot', stepEl);
          if (dot) dot.textContent = '✓';
        } else if (s === currentStep) {
          stepEl.classList.add('step-active');
          const dot = $('.marker-dot', stepEl);
          if (dot) dot.textContent = s;
        } else {
          const dot = $('.marker-dot', stepEl);
          if (dot) dot.textContent = s;
        }
      }

      const stepTitles = ['', 'Pendaftaran Diterima', 'Seleksi Administrasi', 'Interview & Tes Fisik', 'Penawaran & Penempatan'];
      if (badgeEl) badgeEl.textContent = stepTitles[currentStep] || 'Dalam Proses';

      statusResultContainer.style.display = 'block';
      statusResultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  // 7. FAQ Accordion Toggle
  const faqItems = $$('.faq-item');
  if (faqItems.length) {
    faqItems.forEach(item => {
      const q = $('.faq-question', item);
      if (q) {
        q.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          // Close others for clean accordion
          faqItems.forEach(other => {
            other.classList.remove('active');
            const otherBtn = $('.faq-question', other);
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          });
          if (!isActive) {
            item.classList.add('active');
            q.setAttribute('aria-expanded', 'true');
          }
        });
      }
    });
  }
})();

