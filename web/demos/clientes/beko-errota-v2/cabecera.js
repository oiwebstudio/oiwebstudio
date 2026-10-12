/* Beko Errota v2 · cabecera, menú visual, carrusel de la portada y animaciones.
   Sin JS (o con «reducir movimiento») todo se ve completo y los enlaces funcionan. */
(function () {
  var quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var G = window.gsap, ST = window.ScrollTrigger;
  if (G && ST) G.registerPlugin(ST);

  /* ── desplazamiento suave (Lenis), enlazado con ScrollTrigger ── */
  var lenis = null;
  if (window.Lenis && !quieto) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9 });
    if (G && ST) { lenis.on("scroll", ST.update); G.ticker.add(function (t) { lenis.raf(t * 1000); }); G.ticker.lagSmoothing(0); }
    else { (function f(t) { lenis.raf(t); requestAnimationFrame(f); })(0); }
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute("href").length < 2) return;
      var el = document.querySelector(a.getAttribute("href"));
      if (!el) return;
      e.preventDefault(); lenis.scrollTo(el, { offset: -80 });
    });
  }

  /* ── cabecera: se vuelve sólida al bajar y se esconde al seguir bajando ── */
  var cab = document.querySelector("[data-cab]"), aviso = document.querySelector(".aviso"), ultimo = 0;
  var menuAbierto = function () { return document.body.classList.contains("menu-abierto"); };
  if (cab) {
    var pos = function () {
      var h = aviso ? aviso.getBoundingClientRect().bottom : 0, y = scrollY;
      cab.style.top = Math.max(0, h) + "px";
      cab.classList.toggle("solida", h <= 0 && y > 80);
      if (!menuAbierto()) {
        if (y > 420 && y > ultimo + 6) cab.classList.add("oculta");
        else if (y < ultimo - 6 || y < 200) cab.classList.remove("oculta");
      }
      ultimo = y;
    };
    pos(); addEventListener("scroll", pos, { passive: true }); addEventListener("resize", pos);
  }

  /* ── menú visual: pantalla completa con la foto de cada apartado ── */
  var b = document.querySelector(".cab__burger"), m = document.getElementById("menu-m");
  if (b && m) {
    var fotos = [].slice.call(m.querySelectorAll(".menu-m__der img")), cargadas = false;
    var cargar = function () { if (cargadas) return; cargadas = true; fotos.forEach(function (i) { if (i.dataset.src) i.src = i.dataset.src; }); };
    b.addEventListener("pointerenter", cargar, { once: true }); b.addEventListener("focus", cargar, { once: true });
    if ("requestIdleCallback" in window) requestIdleCallback(cargar, { timeout: 4000 }); else setTimeout(cargar, 2500);
    var ver = function (k) { fotos.forEach(function (f, j) { f.classList.toggle("on", j === k); }); };
    [].slice.call(m.querySelectorAll(".menu-m__izq nav a")).forEach(function (a) {
      var k = +a.dataset.i; a.addEventListener("mouseenter", function () { ver(k); }); a.addEventListener("focus", function () { ver(k); });
    });
    var cerrando = false;
    var abrir = function () {
      cargar(); m.hidden = false; cab && cab.classList.remove("oculta");
      b.setAttribute("aria-expanded", "true"); b.querySelector("span").textContent = "Cerrar"; document.body.classList.add("menu-abierto"); lenis && lenis.stop();
      if (G && !quieto) {
        G.fromTo(m, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.85, ease: "expo.out" });
        G.fromTo(m.querySelectorAll(".menu-m__izq nav a"), { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.07, delay: 0.25 });
        G.fromTo(m.querySelector(".menu-m__der"), { clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0%)", duration: 1.1, ease: "expo.out", delay: 0.2 });
        G.fromTo(m.querySelectorAll(".menu-m__pie,.menu-m__pie2"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.7, stagger: 0.1 });
      }
      var p = m.querySelector("nav a"); p && setTimeout(function () { p.focus({ preventScroll: true }); }, 60);
    };
    var cerrar = function () {
      if (cerrando) return; cerrando = true;
      var fin = function () { m.hidden = true; m.style.clipPath = ""; cerrando = false; b.setAttribute("aria-expanded", "false"); b.querySelector("span").textContent = "Menú"; document.body.classList.remove("menu-abierto"); lenis && lenis.start(); };
      if (G && !quieto) G.to(m, { clipPath: "inset(0 0 100% 0)", duration: 0.65, ease: "expo.inOut", onComplete: fin }); else fin();
    };
    b.addEventListener("click", function () { if (m.hidden) abrir(); else cerrar(); });
    addEventListener("keydown", function (e) { if (e.key === "Escape" && !m.hidden) { cerrar(); b.focus(); } });
    m.addEventListener("click", function (e) { var a = e.target.closest("a"); if (a && a.getAttribute("href").charAt(0) === "#") cerrar(); });
  }

  /* ── carrusel de la portada: cambia solo, sin botones ── */
  var car = document.querySelector("[data-slides]");
  if (car) {
    var sl = [].slice.call(car.querySelectorAll(".slides img")), i = 0;
    if (sl.length > 1 && !quieto) setInterval(function () { sl[i].classList.remove("on"); i = (i + 1) % sl.length; sl[i].classList.add("on"); }, 6500);
  }

  /* ── galerías del móvil: se deslizan solas al bajar la página ── */
  (function () {
    if (quieto) return;
    var gs = [].slice.call(document.querySelectorAll(".galeria"));
    if (!gs.length) return;
    var mano = new Map(), pendiente = false;
    gs.forEach(function (g) { g.addEventListener("touchstart", function () { mano.set(g, true); }, { passive: true }); });
    function mover() {
      pendiente = false;
      var vh = innerHeight;
      gs.forEach(function (g) {
        var max = g.scrollWidth - g.clientWidth;
        if (max < 4) return;
        var r = g.getBoundingClientRect();
        var p = (vh * 0.92 - r.top) / (vh * 0.62);
        if (p <= 0 || p >= 1) { g.style.scrollSnapType = ""; mano.set(g, false); g.scrollLeft = p >= 1 ? max : 0; return; }
        if (mano.get(g)) return;
        g.style.scrollSnapType = "none"; g.scrollLeft = p * max;
      });
    }
    addEventListener("scroll", function () { if (!pendiente) { pendiente = true; requestAnimationFrame(mover); } }, { passive: true });
    addEventListener("resize", mover); mover();
  })();

  if (!G || !ST || quieto) return;

  /* ── animaciones de entrada y de desplazamiento ── */
  var on = function (sel, fn) { G.utils.toArray(sel).forEach(fn); };

  /* al cargar: la cabecera baja con calma y la píldora de la portada sube */
  if (cab) G.from(cab.children, { y: -22, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.09, delay: 0.15, clearProps: "transform,opacity" });
  on(".pildora", function (p) { G.from(p, { y: 34, opacity: 0, duration: 1.4, ease: "expo.out", delay: 1.1 }); });
  on(".hero-h1 small", function (p) { G.from(p, { opacity: 0, letterSpacing: "0.7em", duration: 2, ease: "expo.out", delay: 0.9 }); });

  /* tarjetas grandes: se abren como un marco, la foto se mueve más despacio que la página y el título se asienta */
  on(".card-n", function (c) {
    var img = c.querySelector("img"), tit = c.querySelector("h2"), pil = c.querySelector(".pil");
    G.fromTo(c, { clipPath: "inset(9% 7% 9% 7% round 20px)" }, { clipPath: "inset(0% 0% 0% 0% round 20px)", duration: 1.5, ease: "expo.out", scrollTrigger: { trigger: c, start: "top 90%" } });
    if (img) G.fromTo(img, { yPercent: -7 }, { yPercent: 7, ease: "none", scrollTrigger: { trigger: c, start: "top bottom", end: "bottom top", scrub: true } });
    if (tit) G.from(tit, { opacity: 0, letterSpacing: "0.75em", duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: c, start: "top 82%" } });
    if (pil) G.from(pil, { opacity: 0, y: 22, duration: 1.1, ease: "expo.out", delay: 0.35, scrollTrigger: { trigger: c, start: "top 78%" } });
  });

  /* rótulos pequeños: se abren de letra a letra */
  on(".etq-n,.etiqueta", function (e) { G.from(e, { opacity: 0, letterSpacing: "0.7em", duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: e, start: "top 90%" } }); });

  /* el emblema de la rueda gira despacio al bajar */
  on(".emblema", function (e) { G.to(e, { rotation: 200, ease: "none", scrollTrigger: { trigger: e, start: "top bottom", end: "bottom top", scrub: 0.6 } }); });

  /* platos, botellas y galerías: entran con un zoom suave y se mueven un poco con el scroll */
  on(".platos img,.tarjeta img,.botella img,.foto-marco img,.lugar img", function (el) {
    G.from(el, { scale: 1.14, opacity: 0, duration: 1.5, ease: "expo.out", clearProps: "transform,opacity", scrollTrigger: { trigger: el, start: "top 92%" } });
  });
  on(".botella", function (el) {
    G.fromTo(el, { yPercent: 6 }, { yPercent: -6, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
  });

  /* pie: las letras fantasma suben desde abajo */
  on(".pie__fantasma", function (f) {
    G.fromTo(f, { yPercent: 55, opacity: 0.3 }, { yPercent: 12, opacity: 1, ease: "none", scrollTrigger: { trigger: ".pie", start: "top bottom", end: "bottom bottom", scrub: 0.5 } });
  });

  /* filas de las fichas y de los menús: entran una detrás de otra */
  on(".ficha,.filas", function (f) { G.from(f.children, { y: 18, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: f, start: "top 88%" } }); });
  on(".mcard__in > *", function (e) { G.from(e, { y: 16, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: e, start: "top 94%" } }); });
  on(".cat", function (c) { G.from(c, { y: 40, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: c, start: "top 92%" } }); });
  on(".paso", function (p) { G.from(p, { x: -24, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: p, start: "top 92%" } }); });

  addEventListener("load", function () { ST.refresh(); });
})();
