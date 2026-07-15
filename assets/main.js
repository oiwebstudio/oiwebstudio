document.addEventListener('DOMContentLoaded', () => {

  // Navbar scroll state
  const navWrap = document.querySelector('.nav-wrap');
  if (navWrap) {
    const onScroll = () => navWrap.classList.toggle('is-scrolled', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Mobile nav toggle
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Scroll reveal
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => observer.observe(el));
  }

  // Rodillo en enlaces de nav y footer (el i18n reescribe el innerHTML al
  // cambiar de idioma, así que hay que re-envolver tras cada toggle)
  const setupRoll = () => {
    document.querySelectorAll('.nav__links a, .footer ul a').forEach(a => {
      if (a.querySelector('.roll') || a.children.length || !a.textContent.trim()) return;
      const t = a.textContent;
      a.innerHTML = '<span class="roll"><span>' + t + '</span><span aria-hidden="true">' + t + '</span></span>';
    });
  };
  if (!reduceMotion) {
    setupRoll();
    document.querySelectorAll('.lang-switch [data-lang]').forEach(b => {
      b.addEventListener('click', () => setTimeout(setupRoll, 0));
    });
  }

  // Números animados (stats)
  const cnums = document.querySelectorAll('.cnum');
  if (cnums.length) {
    const animateCount = (el) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      if (reduceMotion) { el.textContent = target; return; }
      const duration = 1500;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const statsObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.cnum').forEach(animateCount);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.stats').forEach(el => statsObserver.observe(el));
  }

  // Halo del footer que sigue al cursor
  const footerEl = document.querySelector('.footer');
  if (footerEl && !reduceMotion) {
    footerEl.addEventListener('mousemove', (e) => {
      const r = footerEl.getBoundingClientRect();
      footerEl.style.setProperty('--fx', (e.clientX - r.left) + 'px');
      footerEl.style.setProperty('--fy', (e.clientY - r.top) + 'px');
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-trigger').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('is-open');
        i.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Contact form -> WhatsApp con el mensaje ya redactado (sin backend, cero fricción)
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const lineas = [
        'Hola, quiero pedir presupuesto para una web:',
        `• Nombre: ${(data.get('nombre') || '').toString().trim()}`,
        `• Email: ${(data.get('email') || '').toString().trim()}`
      ];
      const negocio = (data.get('negocio') || '').toString().trim();
      const mensaje = (data.get('mensaje') || '').toString().trim();
      if (negocio) lineas.push(`• Negocio: ${negocio}`);
      if (mensaje) lineas.push(`• Detalles: ${mensaje}`);
      window.open('https://wa.me/34680956755?text=' + encodeURIComponent(lineas.join('\n')), '_blank', 'noopener');
    });
  }
});

// Hero: los chips de sector cambian la web mostrada en los dispositivos
document.addEventListener('DOMContentLoaded', function () {
  var desk = document.getElementById('dvDesk');
  var tab = document.getElementById('dvTab');
  var mob = document.getElementById('dvMob');
  var chips = document.querySelectorAll('.sector[data-shot]');
  if (!desk || !chips.length) return;
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var k = chip.dataset.shot;
      chips.forEach(function (c) { c.classList.toggle('is-active', c === chip); });
      [[desk, 'desk'], [tab, 'tablet'], [mob, 'mobile']].forEach(function (par) {
        var img = par[0];
        if (!img) return;
        var src = 'assets/' + k + '-' + par[1] + '.jpg';
        var pre = new Image();
        img.style.opacity = '0';
        pre.onload = function () { img.src = src; img.style.opacity = '1'; };
        pre.onerror = function () { img.style.opacity = '1'; };
        pre.src = src;
      });
    });
  });
});
