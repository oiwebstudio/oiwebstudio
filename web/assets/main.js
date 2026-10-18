/* Primera línea del fichero a propósito: marca que el JS se está ejecutando.
   El CSS parte de "todo visible" y sólo oculta lo animable cuando existe esta
   clase, así que si este script no llega a cargarse la web se lee entera. */
document.documentElement.classList.add('js');

/* Carpeta de assets/ tal como la pide esta página (assets/ o ../assets/):
   la usa el bloque de movimiento para cargar SplitText solo cuando hace falta. */
/* Trabajo que no corre prisa (lo de más abajo de la pantalla): después de la
   carga y cuando el navegador está libre, para no competir con el primer pintado. */
var OI_TARDE = function (fn) {
  var ir = function () { if (window.requestIdleCallback) requestIdleCallback(fn, { timeout: 1500 }); else setTimeout(fn, 200); };
  if (document.readyState === 'complete') ir(); else window.addEventListener('load', ir, { once: true });
};

var OI_ASSETS = (function () {
  var s = document.currentScript && document.currentScript.src;
  return s ? s.replace(/main\.js(\?.*)?$/, '') : '/assets/';
})();

if (window.self !== window.top) { document.documentElement.style.display = 'none'; window.top.location = window.self.location; }

/* Transiciones entre páginas (styles.css): el logo y el titular viajan a la
   página siguiente. Si al salir ya no se ven (has bajado, o la barra se ha
   escondido), se les quita el nombre para que no entren volando desde fuera
   de la pantalla. Al volver con «atrás» se les devuelve. */
(function () {
  const fuera = (el) => { const r = el.getBoundingClientRect(); return r.bottom <= 0 || r.top >= window.innerHeight; };
  window.addEventListener('pageswap', (e) => {
    if (!e.viewTransition) return;
    const h1 = document.querySelector('h1');
    if (h1 && fuera(h1)) h1.style.viewTransitionName = 'none';
    const logo = document.querySelector('.nav__logo');
    const barra = document.querySelector('.nav-wrap');
    if (logo && (fuera(logo) || (barra && barra.classList.contains('is-hidden')))) logo.style.viewTransitionName = 'none';
  });
  window.addEventListener('pageshow', () => {
    document.querySelectorAll('h1, .nav__logo').forEach((el) => { el.style.viewTransitionName = ''; });
  });
})();

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

  const enEuskera = (document.documentElement.lang || '').toLowerCase().startsWith('eu');

  // Menú del móvil a pantalla completa: bloquea el scroll de detrás, se
  // cierra con Esc o al elegir un enlace y devuelve el foco al botón.
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    const etiqueta = (abierto) => abierto
      ? (enEuskera ? 'Menua itxi' : 'Cerrar menú')
      : (enEuskera ? 'Menua ireki' : 'Abrir menú');
    const abrir = (si) => {
      menu.classList.toggle('is-open', si);
      document.documentElement.classList.toggle('menu-abierto', si);
      toggle.setAttribute('aria-expanded', si ? 'true' : 'false');
      toggle.setAttribute('aria-label', etiqueta(si));
      if (si && navWrap) navWrap.classList.remove('is-hidden', 'is-contracted');
      if (si) { const primero = menu.querySelector('a'); if (primero) primero.focus({ preventScroll: true }); }
    };
    toggle.addEventListener('click', () => abrir(!menu.classList.contains('is-open')));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => abrir(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) { abrir(false); toggle.focus(); }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1200 && menu.classList.contains('is-open')) abrir(false);
    }, { passive: true });
  }

  // «Más» en el menú de escritorio: botón con aria-expanded, Esc cierra,
  // flecha abajo entra en la lista, clic fuera o salir con el tabulador cierra.
  document.querySelectorAll('.nav__mas').forEach(mas => {
    const btn = mas.querySelector('.nav__mas-btn');
    const enlaces = Array.from(mas.querySelectorAll('.nav__drop a'));
    if (!btn) return;
    const abrir = (si) => { mas.classList.toggle('is-open', si); btn.setAttribute('aria-expanded', si ? 'true' : 'false'); };
    btn.addEventListener('click', () => abrir(!mas.classList.contains('is-open')));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); e.stopPropagation(); abrir(true); if (enlaces[0]) enlaces[0].focus(); }
    });
    mas.addEventListener('keydown', (e) => {
      const i = enlaces.indexOf(document.activeElement);
      if (e.key === 'Escape' && mas.classList.contains('is-open')) { abrir(false); btn.focus(); }
      else if (i >= 0 && e.key === 'ArrowDown') { e.preventDefault(); enlaces[(i + 1) % enlaces.length].focus(); }
      else if (i >= 0 && e.key === 'ArrowUp') { e.preventDefault(); if (i === 0) btn.focus(); else enlaces[i - 1].focus(); }
    });
    mas.addEventListener('focusout', (e) => { if (!mas.contains(e.relatedTarget)) abrir(false); });
    document.addEventListener('click', (e) => { if (!mas.contains(e.target)) abrir(false); });
    window.addEventListener('scroll', () => { if (navWrap && navWrap.classList.contains('is-hidden')) abrir(false); }, { passive: true });
  });

  // Volver arriba: solo en páginas largas y cuando ya se ha bajado bastante
  if (document.documentElement.scrollHeight > window.innerHeight * 3) {
    const subir = document.createElement('button');
    subir.type = 'button';
    subir.className = 'subir';
    subir.setAttribute('aria-label', enEuskera ? 'Gora itzuli' : 'Volver arriba');
    subir.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
    document.body.appendChild(subir);
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    subir.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: quieto ? 'auto' : 'smooth' });
      const logo = document.querySelector('.nav__logo');
      if (logo) logo.focus({ preventScroll: true });
    });
    // En el móvil solo aparece al subir (cuando se quiere volver arriba): al
    // bajar leyendo se aparta y no tapa el final de los bloques.
    // (hace falta subir de verdad, 40 px: los reajustes pequeños de la página no cuentan)
    let marca = false, yAntes = window.scrollY, pico = window.scrollY;
    const mirar = () => {
      const y = window.scrollY;
      let on = y > window.innerHeight * 1.4;
      if (y > yAntes) pico = y;
      if (on && window.innerWidth < 760) on = y < pico - 40 ? true : (y > yAntes + 2 ? false : marca);
      yAntes = y;
      if (on !== marca) { marca = on; subir.classList.toggle('is-on', on); }
    };
    window.addEventListener('scroll', mirar, { passive: true });
    mirar();
  }

  // En el móvil, mientras se ve el héroe (que ya tiene sus botones), el flotante
  // de WhatsApp espera: así no tapa los sectores ni los botones de la cabecera.
  const arriba = () => document.documentElement.classList.toggle('flotante-arriba', window.innerWidth < 760 && window.scrollY < window.innerHeight * 0.5);
  window.addEventListener('scroll', arriba, { passive: true });
  window.addEventListener('resize', arriba, { passive: true });
  arriba();

  // Al llegar al pie (que ya trae WhatsApp y teléfono), el botón flotante se aparta
  const finales = document.querySelectorAll('.footer');
  if (finales.length && 'IntersectionObserver' in window) {
    const vistos = new Set();
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach(en => { if (en.isIntersecting) vistos.add(en.target); else vistos.delete(en.target); });
      document.documentElement.classList.toggle('flotante-fuera', vistos.size > 0);
    }, { rootMargin: '0px 0px -40px 0px' });
    finales.forEach(el => io.observe(el));
  }

  // La banda oscura del final (con sus propios botones de presupuesto y
  // WhatsApp): mientras se ve en la parte de abajo de la pantalla, los
  // flotantes se esconden para no tapar esos botones (y el oscuro no se pierde
  // sobre el fondo oscuro).
  const bandas = document.querySelectorAll('.dark-section, .cs-cta');
  if (bandas.length && 'IntersectionObserver' in window) {
    const vistas = new Set();
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach(en => { if (en.isIntersecting) vistas.add(en.target); else vistas.delete(en.target); });
      document.documentElement.classList.toggle('flotante-cta', vistas.size > 0);
    }, { rootMargin: '0px 0px -12px 0px' });
    bandas.forEach(el => io.observe(el));
  }

  // Pie: en el ordenador los grupos se ven abiertos en columnas; en el móvil,
  // plegados (se abren al tocarlos).
  const gruposPie = document.querySelectorAll('.foot-g');
  if (gruposPie.length) {
    const anchoPie = window.matchMedia('(min-width: 760px)');
    const abrirPie = () => gruposPie.forEach(d => { d.open = anchoPie.matches; });
    abrirPie();
    if (anchoPie.addEventListener) anchoPie.addEventListener('change', abrirPie);
    gruposPie.forEach(d => d.querySelector('summary').addEventListener('click', (e) => { if (anchoPie.matches) e.preventDefault(); }));
  }

  /* Lo que se anima en bucle se para cuando sale de la pantalla y sigue al volver:
     así no gasta nada mientras se lee el resto de la página */
  if ('IntersectionObserver' in window) {
    const bucles = document.querySelectorAll('.hx, .tel__toque, .wa__onda, .cta-ping, .zm-hq');
    if (bucles.length) {
      const ioBucle = new IntersectionObserver((ents) => {
        ents.forEach(en => en.target.classList.toggle('is-fuera', !en.isIntersecting));
      }, { rootMargin: '15% 0px' });
      bucles.forEach(el => ioBucle.observe(el));
    }
  }

  // Filas que se deslizan en el móvil: indicador de posición debajo
  document.querySelectorAll('.desliza').forEach(fila => {
    const items = Array.from(fila.children).filter(el => el.nodeType === 1);
    if (items.length < 2) return;
    const ind = document.createElement('div');
    ind.className = 'desliza-ind';
    ind.setAttribute('aria-hidden', 'true');
    ind.innerHTML = '<span class="desliza-ind__barra"><i></i></span><span class="desliza-ind__n"></span>';
    fila.insertAdjacentElement('afterend', ind);
    const barra = ind.querySelector('i');
    const n = ind.querySelector('.desliza-ind__n');
    // El indicador sigue al dedo de forma continua (no salta de tarjeta en
    // tarjeta): la barra se desplaza en proporción exacta a lo deslizado.
    let visibles = items, total = 1, max = 0, pend = false;
    const medir = () => {
      visibles = items.filter(el => !el.hidden && el.offsetParent !== null);
      total = Math.max(visibles.length, 1);
      max = fila.scrollWidth - fila.clientWidth;
      barra.style.width = (100 / total) + '%';
      ind.style.display = max > 4 ? '' : 'none';
    };
    const pintar = () => {
      pend = false;
      const p = max > 0 ? Math.min(Math.max(fila.scrollLeft / max, 0), 1) : 0;
      const actual = Math.min(total, Math.round(p * (total - 1)) + 1);
      barra.style.transform = 'translateX(' + (p * (total - 1) * 100).toFixed(2) + '%)';
      const txt = actual + ' / ' + total;
      if (n.textContent !== txt) n.textContent = txt;
    };
    // Con teclado también se puede recorrer: la fila entra en el orden de tabulación
    const foco = () => { if (fila.scrollWidth - fila.clientWidth > 4) fila.setAttribute('tabindex', '0'); else fila.removeAttribute('tabindex'); };
    fila.addEventListener('scroll', () => { if (!pend) { pend = true; requestAnimationFrame(pintar); } }, { passive: true });
    window.addEventListener('resize', () => { medir(); pintar(); foco(); }, { passive: true });
    fila.addEventListener('desliza:cambio', () => { fila.scrollLeft = 0; medir(); pintar(); });
    medir(); pintar(); foco();
    autoDesliza(fila);
  });

  /* En el móvil, las filas se deslizan de lado al bajar por la página: según la
     fila sube por la pantalla, sus tarjetas pasan de la primera a la última (como
     si el scroll vertical las empujara). Si la persona la toca o la arrastra, la
     fila queda en manual hasta que sale de la pantalla. Con «reducir movimiento»
     o en ordenador, nada se mueve solo. */
  function autoDesliza(fila) {
    const FILAS_SCROLL = (window.__oiFilasScroll = window.__oiFilasScroll || []);
    const quietoMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
    const movilMQ = window.matchMedia('(max-width: 759px)');
    const estado = { fila, manual: false, activa: false };
    const manual = () => { estado.manual = true; estado.x = undefined; fila.style.scrollSnapType = ''; };
    fila.addEventListener('desliza:cambio', () => { estado.max = undefined; estado.x = undefined; });
    fila.addEventListener('touchstart', manual, { passive: true });
    fila.addEventListener('pointerdown', manual);
    fila.addEventListener('wheel', manual, { passive: true });
    fila.addEventListener('focusin', manual);
    estado.puede = () => movilMQ.matches && !quietoMQ.matches && estado.max > 4;
    /* Solo se mide la fila cuando está cerca de la pantalla: lejos no cuesta nada */
    estado.cerca = true;
    if ('IntersectionObserver' in window) new IntersectionObserver((en) => { estado.cerca = en[0].isIntersecting; if (!estado.cerca) { estado.manual = false; estado.x = undefined; } }, { rootMargin: '20% 0px' }).observe(fila);
    FILAS_SCROLL.push(estado);
    if (FILAS_SCROLL.length === 1) {
      let pend = false;
      /* El ancho que se puede deslizar se mide al cargar y al cambiar el tamaño, no en cada scroll */
      /* Ancho deslizable, altura y posición en la página: se miden al cargar y cuando cambia el tamaño de algo,
         no en cada scroll (leer medidas mientras la página se mueve obliga al navegador a recalcularla) */
      const medirMax = () => {
        const y = window.scrollY;
        FILAS_SCROLL.forEach(e => { const r = e.fila.getBoundingClientRect(); e.max = e.fila.scrollWidth - e.fila.clientWidth; e.top = r.top + y; e.h = r.height; });
      };
      if (window.ResizeObserver) new ResizeObserver(() => { medirMax(); pedir(); }).observe(document.body);
      window.addEventListener('load', () => { medirMax(); pedir(); });
      const mover = () => {
        pend = false;
        const vh = window.innerHeight;
        if (FILAS_SCROLL.some(e => e.max === undefined)) medirMax();
        // Primero se leen todas las posiciones y después se escribe: así el navegador
        // no tiene que recalcular la página entre fila y fila
        const sy = window.scrollY;
        const rs = FILAS_SCROLL.map(e => e.cerca ? { top: e.top - sy, bottom: e.top - sy + e.h, height: e.h } : null);
        FILAS_SCROLL.forEach((e, i) => {
          const r = rs[i];
          if (!r) return;
          const enPantalla = r.bottom > 0 && r.top < vh;
          if (!enPantalla) { e.manual = false; e.x = undefined; return; }
          if (e.manual || !e.puede()) { if (e.activa) { e.fila.style.scrollSnapType = ''; e.activa = false; } return; }
          if (!e.activa) { e.fila.style.scrollSnapType = 'none'; e.activa = true; }
          // Empieza cuando la fila ya se ve ENTERA (su borde de abajo dentro de la pantalla)
          // y acaba en la última tarjeta cuando la fila empieza a salir por arriba (más recorrido = más suave).
          const fin = -r.height * 0.15;
          const inicio = Math.max(vh * 0.97 - r.height, fin + vh * 0.3);
          const p = Math.min(Math.max((inicio - r.top) / (inicio - fin), 0), 1);
          const x = Math.round(p * e.max);
          if (x !== e.x) { e.x = x; e.fila.scrollLeft = x; }
        });
      };
      const pedir = () => { if (!pend) { pend = true; requestAnimationFrame(mover); } };
      window.addEventListener('scroll', pedir, { passive: true });
      window.addEventListener('resize', () => { medirMax(); pedir(); }, { passive: true });
      OI_TARDE ? OI_TARDE(pedir) : pedir();
    }
  }

  // Filas deslizables en el móvil: al entrar en pantalla las tarjetas llegan
  // desde la derecha y se pasan un poco de largo, así se insinúa la siguiente
  // y se entiende que la fila se desliza. Solo las que aún no se ven al cargar
  // (las de arriba no deben parpadear). Sin JS o sin movimiento: quietas.
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      && window.matchMedia('(max-width: 759px)').matches) {
    const ioFila = new IntersectionObserver((ents) => {
      ents.forEach(en => {
        if (!en.isIntersecting) return;
        ioFila.unobserve(en.target);
        en.target.classList.add('is-in');
        setTimeout(() => en.target.classList.remove('mv-fila', 'is-in'), 1400);
      });
    }, { threshold: 0.3 });
    // primero se mide (todas), luego se escribe: así no se recalcula la página por fila
    OI_TARDE(() => {
      const filas = Array.from(document.querySelectorAll('.desliza')).filter(f => f.getBoundingClientRect().top >= window.innerHeight);
      filas.forEach(fila => {
        Array.from(fila.children).forEach((el, i) => el.style.setProperty('--mv-i', Math.min(i, 3)));
        fila.classList.add('mv-fila');
        ioFila.observe(fila);
      });
    });
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

  // Ensamblar enlaces de email (anti-harvesting)
  document.querySelectorAll('.js-mail').forEach(a => {
    const addr = a.dataset.u + '@' + a.dataset.d;
    a.href = 'mailto:' + addr;
    // Solo se escribe la dirección en los enlaces de texto. Si el enlace lleva
    // icono o etiqueta dentro (el botón de email del menú flotante), se respeta:
    // antes se sustituía todo por la dirección y el botón redondo quedaba roto.
    if (!a.children.length) a.textContent = addr;
  });

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
      if (data.get('website')) return;
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
      window.open('https://wa.me/34611497409?text=' + encodeURIComponent(texto), '_blank', 'noopener');

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
      salida.textContent = '';
      const t1 = document.createTextNode('¿No se ha abierto WhatsApp? ');
      const a = document.createElement('a');
      a.className = 'link-terra';
      a.href = 'mailto:contactoiwebstudio@gmail.com?subject=' + asunto + '&body=' + encodeURIComponent(texto);
      a.textContent = 'Envíamelo por email';
      const t2 = document.createTextNode(' con el mismo mensaje.');
      salida.append(t1, a, t2);
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

    /* 01 · adv-aurora — quitado el 18/10: las manchas del fondo de cabecera son ahora un degradado quieto en el CSS */

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

    /* 07 · adv-scroll-progress — barra de progreso de lectura -----------------
       Donde el navegador sabe ligar animaciones al scroll, la barra la pinta el
       CSS (body::before, sin JS). Aquí solo el respaldo para los demás, para no
       tener dos barras a la vez. En páginas cortas no hay barra. */
    const corta = document.documentElement.scrollHeight < window.innerHeight * 2.6;
    if (corta) document.documentElement.classList.add('pag-corta');
    const cssBarra = window.CSS && CSS.supports && CSS.supports('animation-timeline: scroll()');
    if (!reduce && !corta && !cssBarra) {
      const bar = document.createElement('div');
      bar.className = 'readbar';
      bar.setAttribute('aria-hidden', 'true');
      bar.innerHTML = '<i></i>';
      document.body.appendChild(bar);
      const fill = bar.firstChild;
      let ticking = false, max = 0;
      /* La altura de la página se mide al cargar y al cambiar el tamaño, no en cada scroll */
      const medir = () => { max = document.documentElement.scrollHeight - window.innerHeight; };
      const paint = () => {
        const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
        fill.style.transform = 'scaleX(' + p.toFixed(4) + ')';
        ticking = false;
      };
      window.addEventListener('scroll', () => {
        if (!ticking) { ticking = true; requestAnimationFrame(paint); }
      }, { passive: true });
      window.addEventListener('resize', () => { medir(); paint(); }, { passive: true });
      window.addEventListener('load', () => { medir(); paint(); });
      if (window.ResizeObserver) new ResizeObserver(medir).observe(document.body);
      medir(); paint();
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
        let mueve = false;
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          const dx = p.ox - mx, dy = p.oy - my;
          const d = Math.hypot(dx, dy) || 1;
          const f = d < 110 ? (1 - d / 110) : 0;
          const vx = (p.ox + dx / d * f * 24 - p.x) * 0.16, vy = (p.oy + dy / d * f * 24 - p.y) * 0.16;
          if (vx > .02 || vx < -.02 || vy > .02 || vy < -.02) mueve = true;
          p.x += vx;
          p.y += vy;
          ctx.fillStyle = 'rgba(232,210,178,' + (0.16 + f * 0.6).toFixed(3) + ')';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.1 + f * 2.1, 0, 6.2832);
          ctx.fill();
        }
        /* Solo se sigue dibujando mientras el ratón está encima o los puntos se recolocan:
           quieta, la rejilla no gasta nada (antes se redibujaba en cada fotograma, también en el móvil) */
        if (mueve || mx > -9000) requestAnimationFrame(draw); else running = false;
      };

      const kick = () => { if (!running) { running = true; requestAnimationFrame(draw); } };

      if (fine) {
        sec.addEventListener('mousemove', e => {
          const r = sec.getBoundingClientRect();
          mx = e.clientX - r.left; my = e.clientY - r.top;
          kick();
        });
        sec.addEventListener('mouseleave', () => { mx = my = -9999; kick(); });
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

/* Movimiento al bajar (assets/movimiento.js): se carga tarde, cuando el
   navegador está libre después de la carga, o antes si se empieza a bajar.
   Sin JS o con «reducir movimiento» no se carga y todo se ve quieto. */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  var hecho = false;
  var cargar = function () {
    if (hecho) return;
    hecho = true;
    var s = document.createElement('script');
    s.src = OI_ASSETS + 'movimiento.js?v=2';
    s.async = true;
    document.head.appendChild(s);
  };
  window.addEventListener('scroll', cargar, { passive: true, once: true });
  window.addEventListener('touchstart', cargar, { passive: true, once: true });
  OI_TARDE(cargar);
})();
