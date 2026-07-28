document.addEventListener('DOMContentLoaded', () => {

  // Navbar scroll state
  const navWrap = document.querySelector('.nav-wrap');
  if (navWrap) {
    const onScroll = () => navWrap.classList.toggle('is-scrolled', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Nav-isla en móvil: sin ratón no hay :hover, así que se contrae al
    // bajar y se expande al subir (o cerca del top), igual que el hover
    // en escritorio pero disparado por la dirección del scroll.
    let lastY = window.scrollY;
    const onScrollDir = () => {
      const y = window.scrollY;
      if (y > lastY + 4 && y > 60) navWrap.classList.add('is-contracted');
      else if (y < lastY - 4 || y < 60) navWrap.classList.remove('is-contracted');
      lastY = y;
    };
    window.addEventListener('scroll', onScrollDir, { passive: true });
  }

  // adv-spotlight-cards en el nav: el spotlight y el anillo de borde siguen al cursor
  const navEl = document.querySelector('.nav');
  if (navEl) {
    navEl.addEventListener('mousemove', (e) => {
      const r = navEl.getBoundingClientRect();
      navEl.style.setProperty('--nav-mx', (e.clientX - r.left) + 'px');
      navEl.style.setProperty('--nav-my', (e.clientY - r.top) + 'px');
    });
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
    // Dirección de entrada: las columnas entran desde su lado; los bloques
    // a todo el ancho alternan izquierda/derecha. El héroe y las cabeceras
    // de sección conservan la entrada desde abajo.
    let alt = 0;
    const vw = window.innerWidth;
    // Fase de lectura (getBoundingClientRect) separada de la de escritura
    // (classList.add) para no forzar recálculos de layout en cada iteración.
    const measured = Array.from(revealEls).map(el => {
      if (el.closest('.hero') || el.classList.contains('section-head')) return null;
      return { el, r: el.getBoundingClientRect() };
    });
    measured.forEach(m => {
      if (!m) return;
      const { el, r } = m;
      const center = r.left + r.width / 2;
      if (r.width < vw * 0.66) {
        if (center < vw * 0.44) el.classList.add('reveal--left');
        else if (center > vw * 0.56) el.classList.add('reveal--right');
      } else {
        el.classList.add(alt++ % 2 ? 'reveal--right' : 'reveal--left');
      }
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => observer.observe(el));
  }

  // Animaciones de entrada genéricas: [data-anim="..."] recibe .is-in al
  // entrar en pantalla. El tipo concreto lo define el CSS de cada página
  // (clip-reveal, grid-assemble, etc. — biblioteca-animaciones).
  const animEls = document.querySelectorAll('[data-anim]');
  if (animEls.length) {
    if (reduceMotion) {
      animEls.forEach(el => el.classList.add('is-in'));
    } else {
      const animObs = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });
      animEls.forEach(el => animObs.observe(el));
    }
  }

  // Párrafos en cascada palabra a palabra (par-word-cascade, biblioteca-animaciones)
  // En páginas de artículo, cascadea todos los párrafos del cuerpo del texto.
  document.querySelectorAll('.art p').forEach(p => p.classList.add('par-cascade'));

  const cascadeEls = document.querySelectorAll('.par-cascade');
  if (cascadeEls.length) {
    cascadeEls.forEach(el => {
      // Recorre los nodos hijos en vez de usar textContent, para no perder
      // <strong>/<a>/<em> dentro del párrafo: cada palabra suelta se envuelve
      // en un span, y cada elemento inline se envuelve entero como una unidad.
      let i = 0;
      const frag = document.createDocumentFragment();
      Array.from(el.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          node.textContent.split(/(\s+)/).forEach(part => {
            if (part === '') return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const span = document.createElement('span');
            span.textContent = part;
            span.style.transitionDelay = Math.min(i * 0.06, 1.1).toFixed(3) + 's';
            i++;
            frag.appendChild(span);
          });
        } else {
          const span = document.createElement('span');
          span.style.transitionDelay = Math.min(i * 0.06, 1.1).toFixed(3) + 's';
          span.appendChild(node.cloneNode(true));
          i++;
          frag.appendChild(span);
        }
      });
      el.innerHTML = '';
      el.appendChild(frag);

      if (reduceMotion) { el.classList.add('vis'); return; }
      const io = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { el.classList.add('vis'); io.disconnect(); }
      }, { threshold: 0.35 });
      io.observe(el);
    });
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

