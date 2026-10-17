/* ==========================================================================
   OI Studio · movimiento al bajar. Lo carga main.js cuando el navegador está
   libre después de la carga (o al primer gesto), así no pesa en el primer
   pintado. Usa OI_ASSETS, que define main.js.
   ========================================================================== */
/* MOVIMIENTO AL BAJAR (sobre todo en el móvil)
   - Lo ligado al scroll va en CSS (styles.css, «Movimiento al bajar»):
     paralaje dentro del marco, pasos de «Cómo trabajo» con su barra, casos que
     se apilan. Aquí: las fotos que se destapan (por tiempo, al aparecer), el
     respaldo para navegadores sin animation-timeline (Firefox) y el texto,
     que necesita partirse en palabras.
   - El texto se trocea en palabras con SplitText (GSAP 3.13, 7 KB, funciona
     sin el núcleo de GSAP), que se carga DESPUÉS de la carga de la página (o al
     primer gesto): no retrasa el primer pintado ni el LCP. El movimiento lo
     hace el CSS. El núcleo de GSAP (72 KB) y ScrollTrigger no hacen falta aquí.
   - Nada empieza oculto en el CSS: el JS oculta justo antes de animar, y solo
     lo que todavía no se ve. Sin JS, sin SplitText o con movimiento reducido,
     todo queda quieto y visible.
   ========================================================================== */
(function () {
  const raiz = document.documentElement;
  const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (quieto || !('IntersectionObserver' in window)) return;
  const sda = window.CSS && CSS.supports && CSS.supports('animation-timeline: view()');
  const abajo = (el) => el.getBoundingClientRect().top > window.innerHeight + 4;

  /* 1 · Fotos que se destapan al aparecer (por tiempo: ver styles.css). Solo las
         que aún no se ven; las de arriba se quedan como están. */
  const fotos = () => {
    const io = new IntersectionObserver((ents) => {
      ents.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -4% 0px' });
    Array.from(document.querySelectorAll('.caso-dest__foto, .opi__foto, .cs-captura, .cs-fotos figure, .faq-otra__foto'))
      .filter(abajo)
      .forEach(el => { el.classList.add('mv-tapa'); io.observe(el); });
  };
  fotos();

  /* 2 · Respaldo sin animation-timeline: puntos y línea de los pasos */
  const respaldo = () => {
    raiz.classList.add('mv-sin-sda');
    const io = new IntersectionObserver((ents) => {
      ents.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.18, rootMargin: '0px 0px -40% 0px' });
    const pasos = Array.from(document.querySelectorAll('.pasos-linea > li')).map(el => [el, abajo(el)]);
    pasos.forEach(([el, b]) => { if (b) io.observe(el); else el.classList.add('is-in'); });

    // Barra de «Cómo trabajo»: progreso = parte de la lista que ya ha pasado
    // por la mitad de la pantalla. Una variable CSS por fotograma, nada más.
    const listas = Array.from(document.querySelectorAll('.pasos-linea'));
    if (!listas.length) return;
    let pend = false;
    const pintar = () => {
      pend = false;
      const mitad = window.innerHeight * 0.55;
      listas.forEach(ol => {
        const r = ol.getBoundingClientRect();
        if (r.bottom < -50 || r.top > window.innerHeight + 50) return;
        const p = Math.min(Math.max((mitad - r.top) / Math.max(r.height, 1), 0), 1);
        ol.style.setProperty('--mv-p', p.toFixed(3));
      });
    };
    window.addEventListener('scroll', () => { if (!pend) { pend = true; requestAnimationFrame(pintar); } }, { passive: true });
    window.addEventListener('resize', pintar, { passive: true });
    pintar();
  };
  if (!sda) {
    respaldo();
  } else {
    // Con animation-timeline, la línea de los pasos la mueve el CSS; aquí solo
    // se le dice qué tramo de scroll corresponde a «la lista pasa por la mitad
    // de la pantalla», según la altura real (cambia con el idioma y el ancho).
    const tramos = () => document.querySelectorAll('.pasos-linea').forEach(ol => {
      const vh = window.innerHeight, h = ol.offsetHeight, total = vh + h, linea = vh * 0.45;
      ol.style.setProperty('--mv-a', (linea / total * 100).toFixed(1) + '%');
      ol.style.setProperty('--mv-b', ((linea + h) / total * 100).toFixed(1) + '%');
    });
    tramos();
    window.addEventListener('resize', tramos, { passive: true });
  }

  /* 3 · Texto: titulares palabra a palabra con máscara, entradillas que suben
         detrás de su titular y la opinión que se enciende al leerla.
         SplitText solo trocea; el movimiento lo hace el CSS (styles.css,
         «Texto al bajar»), que corre en el compositor y no ocupa el hilo
         principal mientras se hace scroll. Al terminar, el titular se recompone
         como texto normal. ScrollTrigger no hace falta. */
  // Las páginas que ya traen su propio GSAP (ayudas, reservas…) se animan solas.
  if (document.querySelector('script[src*="vendor/gsap"]')) return;

  const TITULARES = 'main h2, .section h2, .cs-cta h2, .lin__h, .zsec h2, .art h2';
  const ENTRADILLAS = '.section-head > p, .lin__cab > p:first-of-type, .cs-intro > p, .pre-mu__h > p, .eleg > p';
  const ENCENDER = '.opi blockquote, .cs-opinion blockquote';
  const fuera = (el) => el.closest('.hero, header, .footer, .mobile-menu, .nav-wrap, [data-quieto], .prueba, details');

  const cargar = (src) => new Promise((ok, mal) => {
    const s = document.createElement('script');
    s.src = OI_ASSETS + 'vendor/' + src;
    s.async = false;
    s.onload = ok; s.onerror = mal;
    document.head.appendChild(s);
  });

  const animar = () => {
    const Split = window.SplitText;
    if (!Split) return;
    // Primero se mide todo (qué queda por debajo de la pantalla) y después se
    // trocea: medir entre troceo y troceo obligaba a recalcular la página entera
    // cada vez.
    const pendientes = new Set();
    document.querySelectorAll(TITULARES + ', ' + ENTRADILLAS + ', ' + ENCENDER).forEach(el => { if (!fuera(el) && abajo(el)) pendientes.add(el); });
    const vale = (el) => pendientes.has(el);

    // Bloque .reveal que solo envuelve texto: si su texto ya entra por su cuenta,
    // el bloque deja de entrar (no hay doble movimiento).
    const calmar = (el) => {
      const r = el.closest('.reveal');
      if (!r) return;
      if (r === el || (!r.querySelector('img, form, .price, .pk') && r.textContent.length < 700)) r.classList.add('mv-texto');
    };

    const io = new IntersectionObserver((ents) => {
      ents.forEach(en => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        if (en.target._mv) en.target._mv();
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

    // Titulares: cada palabra sube desde detrás de su máscara.
    document.querySelectorAll(TITULARES).forEach(h => {
      if (h._mv || !vale(h) || !h.textContent.trim()) return;
      const s = Split.create(h, { type: 'words', mask: 'words', wordsClass: 'mvw', aria: 'auto', propIndex: true });
      const n = s.words.length;
      if (!n) { s.revert(); return; }
      calmar(h);
      const paso = Math.min(60, Math.round(480 / n));
      h.style.setProperty('--mv-paso', paso + 'ms');
      h.classList.add('mv-listo');
      h._mv = () => {
        h.classList.add('mv-sube');
        // fin = última palabra; por si animationend no llega (pestaña oculta), un tope
        let hecho = false;
        const recomponer = () => {
          if (hecho) return; hecho = true;
          s.revert();
          h.classList.remove('mv-listo', 'mv-sube');
          h.style.removeProperty('--mv-paso');
          h.querySelectorAll('.grad').forEach(g => g.classList.add('is-marked'));
        };
        s.words[n - 1].addEventListener('animationend', recomponer, { once: true });
        setTimeout(recomponer, 800 + paso * n + 400);
      };
      io.observe(h);
    });

    // Entradillas: suben enteras, un poco después de su titular.
    document.querySelectorAll(ENTRADILLAS).forEach(p => {
      if (p._mv || !vale(p) || p.classList.contains('par-cascade') || !p.textContent.trim()) return;
      calmar(p);
      p.classList.add('mv-listo-p');
      p._mv = () => {
        p.classList.add('mv-sube-p');
        setTimeout(() => p.classList.remove('mv-listo-p', 'mv-sube-p'), 1200);
      };
      io.observe(p);
    });

    // La opinión: las palabras se encienden al ritmo del scroll, una tras otra,
    // y quedan encendidas antes de que la cita llegue a media pantalla. Si se
    // sube, se vuelven a apagar. Solo cambia la clase de las palabras que pasan
    // la línea (con una transición corta de opacidad): pocas piezas a la vez.
    document.querySelectorAll(ENCENDER).forEach(q => {
      if (!vale(q)) return;
      const w = Split.create(q, { type: 'words', aria: 'none', wordsClass: 'mv-c' }).words;
      const n = w.length;
      if (!n) return;
      const bloque = q.closest('.reveal');
      if (bloque) bloque.classList.add('mv-texto');
      q.classList.add('mv-cita');
      let encendidas = 0, pend = false, activo = false;
      const pintar = () => {
        pend = false;
        const vh = window.innerHeight, r = q.getBoundingClientRect();
        const p = Math.min(Math.max((vh * 0.85 - r.top) / (vh * 0.17 + r.height), 0), 1);
        const k = Math.round(p * n);
        if (k > encendidas) for (let i = encendidas; i < k; i++) w[i].classList.add('is-on');
        else for (let i = k; i < encendidas; i++) w[i].classList.remove('is-on');
        encendidas = k;
      };
      const alBajar = () => { if (!pend) { pend = true; requestAnimationFrame(pintar); } };
      new IntersectionObserver(([en]) => {
        if (en.isIntersecting && !activo) { activo = true; window.addEventListener('scroll', alBajar, { passive: true }); }
        else if (!en.isIntersecting && activo) { activo = false; window.removeEventListener('scroll', alBajar); }
        pintar();
      }).observe(q);
    });
  };

  cargar('SplitText.min.js')
    .then(() => (document.fonts && document.fonts.ready ? document.fonts.ready : null))
    .then(animar)
    .catch(() => {});
})();
