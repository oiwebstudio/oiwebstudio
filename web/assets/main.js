/* Primera línea del fichero a propósito: marca que el JS se está ejecutando.
   El CSS parte de "todo visible" y sólo oculta lo animable cuando existe esta
   clase, así que si este script no llega a cargarse la web se lee entera. */
document.documentElement.classList.add('js');

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
    const menuEl = document.querySelector('.mobile-menu');
    const onScrollDir = () => {
      const y = window.scrollY;
      const down = y > lastY + 4;
      const up = y < lastY - 4;
      if (down && y > 60) navWrap.classList.add('is-contracted');
      else if (up || y < 60) navWrap.classList.remove('is-contracted');

      // Y además se aparta del todo al bajar: la píldora contraída queda
      // centrada sobre los títulos de sección (que también van centrados) y
      // los tapaba a media lectura. Con el menú móvil abierto no se mueve.
      const menuOpen = menuEl && menuEl.classList.contains('is-open');
      if (!menuOpen && down && y > 160) navWrap.classList.add('is-hidden');
      else if (menuOpen || up || y < 160) navWrap.classList.remove('is-hidden');

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
      if (open && navWrap) navWrap.classList.remove('is-hidden');
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
      const texto = lineas.join('\n');
      window.open('https://wa.me/34680956755?text=' + encodeURIComponent(texto), '_blank', 'noopener');

      // WhatsApp no siempre está disponible (escritorio sin app, bloqueo de
      // ventanas emergentes). Se deja a la vista una salida por correo con el
      // mismo mensaje, para que ningún contacto se pierda por el camino.
      let salida = form.querySelector('.form-fallback');
      if (!salida) {
        salida = document.createElement('p');
        salida.className = 'form-note form-fallback';
        form.appendChild(salida);
      }
      const asunto = encodeURIComponent('Presupuesto web — ' + ((data.get('nombre') || '').toString().trim() || 'nuevo contacto'));
      salida.innerHTML = '¿No se ha abierto WhatsApp? <a class="link-terra" href="mailto:contactoiwebstudio@gmail.com?subject=' +
        asunto + '&body=' + encodeURIComponent(texto) + '">Envíamelo por email</a> con el mismo mensaje.';
    });
  }
});

/* ==========================================================================
   ANIMACIONES AVANZADAS — piezas de biblioteca-animaciones/ adaptadas.
   Bloque autónomo: si algo falla aquí, el resto de main.js sigue intacto.
   ========================================================================== */
(function () {
  const start = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* 01 · adv-aurora — blobs a la deriva bajo la rejilla del hero ------------ */
    const heroBg = document.querySelector('.hero__bg');
    if (heroBg && !heroBg.querySelector('.aur')) {
      for (let i = 1; i <= 3; i++) {
        const b = document.createElement('span');
        b.className = 'aur aur-' + i;
        b.setAttribute('aria-hidden', 'true');
        heroBg.insertBefore(b, heroBg.firstChild);
      }
    }

    /* 02 · card-cursor-glow — la luz sigue al cursor dentro de la tarjeta ----- */
    if (fine) {
      document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', e => {
          const r = card.getBoundingClientRect();
          card.style.setProperty('--gx', (e.clientX - r.left) + 'px');
          card.style.setProperty('--gy', (e.clientY - r.top) + 'px');
        });
      });
    }

    /* 03 · btn-magnetic — los CTA principales se acercan al cursor ------------ */
    if (fine && !reduce) {
      document.querySelectorAll('.btn--lg.btn--accent, .btn--lg.btn--light, .nav__cta').forEach(btn => {
        btn.classList.add('is-magnetic');
        btn.addEventListener('mousemove', e => {
          const r = btn.getBoundingClientRect();
          const x = e.clientX - (r.left + r.width / 2);
          const y = e.clientY - (r.top + r.height / 2);
          btn.style.transform = 'translate(' + (x * 0.22).toFixed(1) + 'px,' + (y * 0.28).toFixed(1) + 'px)';
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
      });
    }

    /* 04 · card-tilt-3d — los planes de precio se inclinan con el ratón ------- */
    if (fine && !reduce) {
      document.querySelectorAll('.pm').forEach(pm => {
        pm.addEventListener('mousemove', e => {
          const r = pm.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          pm.style.transform = 'translateY(-4px) rotateY(' + (px * 9).toFixed(2) + 'deg) rotateX(' + (-py * 9).toFixed(2) + 'deg)';
        });
        pm.addEventListener('mouseleave', () => { pm.style.transform = ''; });
      });
    }

    /* 06 · img-tilt-shine — tilt y destello diagonal en las miniaturas -------- */
    document.querySelectorAll('.mbp').forEach(mbp => {
      const img = mbp.querySelector('img');
      if (!img || mbp.querySelector('.mbp__shine')) return;
      const shine = document.createElement('span');
      shine.className = 'mbp__shine';
      shine.setAttribute('aria-hidden', 'true');
      mbp.appendChild(shine);
      if (!fine || reduce) return;
      mbp.addEventListener('mousemove', e => {
        const r = mbp.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        img.style.transform = 'translateY(-6px) scale(1.015) rotateY(' + (px * 7).toFixed(2) + 'deg) rotateX(' + (-py * 7).toFixed(2) + 'deg)';
        shine.style.setProperty('--sx', (px * 220).toFixed(0) + '%');
      });
      mbp.addEventListener('mouseleave', () => {
        img.style.transform = '';
        shine.style.setProperty('--sx', '-130%');
      });
    });

    /* 07 · adv-scroll-progress — barra de progreso de lectura ----------------- */
    if (!reduce) {
      const bar = document.createElement('div');
      bar.className = 'readbar';
      bar.setAttribute('aria-hidden', 'true');
      bar.innerHTML = '<i></i>';
      document.body.appendChild(bar);
      const fill = bar.firstChild;
      let ticking = false;
      const paint = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
        fill.style.transform = 'scaleX(' + p.toFixed(4) + ')';
        ticking = false;
      };
      window.addEventListener('scroll', () => {
        if (!ticking) { ticking = true; requestAnimationFrame(paint); }
      }, { passive: true });
      window.addEventListener('resize', paint, { passive: true });
      paint();
    }

    /* 08 · text-scramble-scroll — las etiquetas se descifran al entrar -------- */
    const eyebrows = document.querySelectorAll('.eyebrow');
    if (eyebrows.length && !reduce) {
      const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%/*';
      const scramble = el => {
        const finalTxt = el.textContent;
        if (!finalTxt.trim()) return;
        el.classList.add('is-scrambling');
        let n = 0;
        const iv = setInterval(() => {
          el.textContent = Array.from(finalTxt).map((c, i) => (
            c === ' ' ? ' ' : (i < n ? c : pool[Math.random() * pool.length | 0])
          )).join('');
          if (n >= finalTxt.length) {
            clearInterval(iv);
            el.textContent = finalTxt;
            el.classList.remove('is-scrambling');
          }
          n += 0.6;
        }, 36);
      };
      const eyeObs = new IntersectionObserver((entries, obs) => {
        entries.forEach(en => {
          if (!en.isIntersecting) return;
          scramble(en.target);
          obs.unobserve(en.target);
        });
      }, { threshold: 0.9 });
      eyebrows.forEach(el => eyeObs.observe(el));
    }

    /* 09 · text-highlighter — marcador que se pinta bajo la palabra clave ----- */
    const marks = document.querySelectorAll('h2 .grad');
    if (marks.length) {
      if (reduce) {
        marks.forEach(el => el.classList.add('is-marked'));
      } else {
        const markObs = new IntersectionObserver((entries, obs) => {
          entries.forEach(en => {
            if (!en.isIntersecting) return;
            setTimeout(() => en.target.classList.add('is-marked'), 260);
            obs.unobserve(en.target);
          });
        }, { threshold: 0.85 });
        marks.forEach(el => markObs.observe(el));
      }
    }

    /* 10 · adv-dot-grid  +  11 · adv-film-grain — sección oscura -------------- */
    document.querySelectorAll('.dark-section').forEach(sec => {
      if (sec.querySelector('.film-grain')) return;

      const grain = document.createElement('span');
      grain.className = 'film-grain';
      grain.setAttribute('aria-hidden', 'true');
      sec.insertBefore(grain, sec.firstChild);

      if (reduce) return;
      const cv = document.createElement('canvas');
      cv.className = 'dotgrid';
      cv.setAttribute('aria-hidden', 'true');
      sec.insertBefore(cv, sec.firstChild);

      const ctx = cv.getContext('2d');
      let w = 0, h = 0, pts = [], mx = -9999, my = -9999, visible = false, running = false;

      const build = () => {
        const r = sec.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) return false;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = r.width; h = r.height;
        cv.width = Math.round(w * dpr);
        cv.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        pts = [];
        const gap = 30;
        for (let y = gap / 2; y < h; y += gap) {
          for (let x = gap / 2; x < w; x += gap) pts.push({ x: x, y: y, ox: x, oy: y });
        }
        return true;
      };

      const draw = () => {
        if (!visible) { running = false; return; }
        if (!pts.length && !build()) { requestAnimationFrame(draw); return; }
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          const dx = p.ox - mx, dy = p.oy - my;
          const d = Math.hypot(dx, dy) || 1;
          const f = d < 110 ? (1 - d / 110) : 0;
          p.x += (p.ox + dx / d * f * 24 - p.x) * 0.16;
          p.y += (p.oy + dy / d * f * 24 - p.y) * 0.16;
          ctx.fillStyle = 'rgba(232,210,178,' + (0.16 + f * 0.6).toFixed(3) + ')';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.1 + f * 2.1, 0, 6.2832);
          ctx.fill();
        }
        requestAnimationFrame(draw);
      };

      const kick = () => { if (!running) { running = true; requestAnimationFrame(draw); } };

      if (fine) {
        sec.addEventListener('mousemove', e => {
          const r = sec.getBoundingClientRect();
          mx = e.clientX - r.left; my = e.clientY - r.top;
        });
        sec.addEventListener('mouseleave', () => { mx = my = -9999; });
      }
      window.addEventListener('resize', () => { build(); kick(); }, { passive: true });

      new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        if (visible) { if (!pts.length) build(); kick(); }
      }, { threshold: 0 }).observe(sec);

      build();
    });

    /* 12 · loc-city-tags — la botonera de zonas entra en cascada -------------- */
    const tagGroups = new Set();
    document.querySelectorAll('a.btn--ghost, a.zcard').forEach(a => {
      if (a.parentElement) tagGroups.add(a.parentElement);
    });
    tagGroups.forEach(group => {
      const links = Array.from(group.children).filter(el => el.tagName === 'A');
      if (links.length < 6) return;
      group.classList.add('city-tags');
      links.forEach((a, i) => a.style.setProperty('--i', i));
      if (reduce) { group.classList.add('is-in'); return; }
      const io = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) return;
        group.classList.add('is-in');
        io.disconnect();
      }, { threshold: 0.12 });
      io.observe(group);
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
