/* LAUZA · muestra de reformas (OI Studio, 8/11/2026). Barra que cambia de color, menú, sección que corre de lado, obras,
   presupuesto al momento, opiniones y paneles. Sin JS o con «reducir movimiento»: todo se ve quieto y completo.
   Es una muestra: no se envía nada a ningún sitio; el mensaje sale por WhatsApp y lo manda la persona. */
(function () {
  var T = JSON.parse(document.getElementById("textos").textContent);
  var H = document.documentElement;
  var R = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ANCHO = matchMedia("(min-width: 900px)");
  var RATON = matchMedia("(hover: hover) and (pointer: fine)");
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };

  /* ---------- la barra cambia de color según lo que tiene debajo ---------- */
  var cab = $("[data-cab]");
  var tonos = $$("[data-tono]");
  if (cab && "IntersectionObserver" in window) {
    var dentro = new Set();
    var pinta = function () {
      var ultimo = null;
      tonos.forEach(function (s) { if (dentro.has(s)) ultimo = s; });
      cab.classList.toggle("claro", !!ultimo && ultimo.getAttribute("data-tono") === "claro" && !H.classList.contains("menu-abierto"));
      /* sobre «cómo trabajamos» sus rótulos ocupan la barra y el logo se aparta (como en la referencia) */
      cab.classList.toggle("sin-logo", !!ultimo && ultimo.hasAttribute("data-estudio"));
      /* en el móvil, fuera de la portada la barra lleva fondo (ver estilo.css) */
      cab.classList.toggle("fondo", !!ultimo && !ultimo.classList.contains("portada"));
    };
    /* franja de arriba (4 % de la pantalla): la última sección que la toca manda (el bloque marrón tapa al de antes) */
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) dentro.add(e.target); else dentro.delete(e.target); });
      pinta();
    }, { rootMargin: "0px 0px -96% 0px" });
    tonos.forEach(function (s) { io.observe(s); });
    window.LAUZA_TONO = pinta;
  }

  /* ---------- menú del móvil ---------- */
  var mb = $(".menu-btn"), mm = $("#menu-movil");
  if (mb && mm) {
    var cierra = function () { mm.classList.remove("abierto"); H.classList.remove("menu-abierto"); mb.setAttribute("aria-expanded", "false"); mb.textContent = T.menu; if (window.LAUZA_TONO) LAUZA_TONO(); };
    mb.addEventListener("click", function () {
      var ab = mm.classList.toggle("abierto");
      H.classList.toggle("menu-abierto", ab);
      mb.setAttribute("aria-expanded", ab); mb.textContent = ab ? T.cerrar : T.menu;
      if (window.LAUZA_TONO) LAUZA_TONO();
    });
    mm.addEventListener("click", function (e) { if (e.target.closest("a")) cierra(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && mm.classList.contains("abierto")) { cierra(); mb.focus(); } });
  }

  /* ---------- obras terminadas: la fila elegida enseña su foto en el centro ---------- */
  var obras = $$(".obra");
  function activaObra(i) {
    obras.forEach(function (o, k) {
      var on = k === i;
      o.classList.toggle("on", on);
      var b = $(".obra-fila", o); if (b) b.setAttribute("aria-pressed", on);
    });
  }
  obras.forEach(function (o, i) {
    var b = $(".obra-fila", o);
    if (!b) return;
    b.addEventListener("click", function () { if (ANCHO.matches) activaObra(i); });
    b.addEventListener("focus", function () { if (ANCHO.matches) activaObra(i); });
    b.addEventListener("mouseenter", function () { if (ANCHO.matches && RATON.matches) activaObra(i); });
  });

  /* ---------- presupuesto al momento ---------- */
  var calc = $("[data-calc]");
  var miles = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "."); };
  if (calc) {
    var rango = $("[data-metros]", calc), salida = $("[data-metros-v]", calc), pueblo = $("[data-pueblo]", calc);
    var precioEl = $("[data-precio]", calc), plazoEl = $("[data-plazo]", calc), msgEl = $("[data-msg]", calc), wa = $("[data-wa]", calc), sr = $("[data-resul-sr]", calc);
    var fotos = $$("[data-tipo-foto]");
    var antes = { min: 0, max: 0, lineas: [] }, srT;
    var elegido = function () { return $('input[name="tipo"]:checked', calc); };
    function plazo(sem) {
      if (sem < 1.5) return T.plazo_semana;
      if (sem < 9) return T.plazo_semanas.replace("{n}", Math.round(sem));
      return T.plazo_meses.replace("{n}", Math.max(2, Math.round(sem / 4.3)));
    }
    function gira(desde, hasta) {
      /* los dos números cuentan hasta el nuevo precio en ~450 ms */
      var pinta = function (a, b) { precioEl.textContent = miles(a) + "–" + miles(b) + " €"; };
      if (R || (desde.min === hasta.min && desde.max === hasta.max) || !desde.max) { pinta(hasta.min, hasta.max); return; }
      var t0 = performance.now(), dur = 450;
      cancelAnimationFrame(precioEl._raf);
      (function paso(t) {
        var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        var r = function (a, b) { return Math.round((a + (b - a) * e) / 100) * 100; };
        pinta(r(desde.min, hasta.min), r(desde.max, hasta.max));
        if (k < 1) precioEl._raf = requestAnimationFrame(paso);
      })(t0);
    }
    function calcula(avisar) {
      var t = elegido(), m = +rango.value;
      var eur = t.dataset.eur.split(","), sem = t.dataset.sem.split(",");
      var min = Math.round((m * eur[0]) / 100) * 100, max = Math.round((m * eur[1]) / 100) * 100;
      var pl = plazo(+sem[0] + m / +sem[1]);
      salida.textContent = m + " m²";
      gira(antes, { min: min, max: max });
      if (plazoEl.textContent !== pl) {
        plazoEl.textContent = pl;
        if (!R && plazoEl.animate) plazoEl.animate([{ opacity: 0, transform: "translateY(30%)" }, { opacity: 1, transform: "none" }], { duration: 380, easing: "cubic-bezier(.2,.75,.25,1)" });
      }
      /* el mensaje se escribe con lo elegido; la línea que cambia se marca un momento */
      var lineas = [T.wa_hola, T.wa_que + ": " + t.dataset.nombre, T.wa_metros + ": " + m + " m²", T.wa_pueblo + ": " + pueblo.value, T.wa_precio + ": " + miles(min) + "–" + miles(max) + " €", T.wa_fin];
      msgEl.textContent = "";
      lineas.forEach(function (l, i) {
        if (i) msgEl.appendChild(document.createElement("br"));
        if (antes.lineas.length && antes.lineas[i] !== l && avisar) {
          var s = document.createElement("span"); s.className = "cambia"; s.textContent = l; msgEl.appendChild(s);
          setTimeout(function () { s.classList.remove("cambia"); }, 900);
        } else msgEl.appendChild(document.createTextNode(l));
      });
      wa.href = "https://wa.me/34600000000?text=" + encodeURIComponent(lineas.join("\n"));
      if (avisar && sr) { clearTimeout(srT); srT = setTimeout(function () { sr.textContent = t.dataset.nombre + ", " + m + " m²: " + miles(min) + "–" + miles(max) + " €. " + pl + "."; }, 700); }
      antes = { min: min, max: max, lineas: lineas };
    }
    calc.addEventListener("change", function (e) {
      if (e.target.name === "tipo") {
        var t = e.target;
        rango.min = t.dataset.min; rango.max = t.dataset.max; rango.step = t.dataset.paso; rango.value = t.dataset.def;
        fotos.forEach(function (f) { f.classList.toggle("on", f.getAttribute("data-tipo-foto") === t.value); });
      }
      calcula(true);
    });
    rango.addEventListener("input", function () { calcula(true); });
    calcula(false);
  }

  /* ---------- opiniones: anterior / siguiente, y «ver la obra» ---------- */
  var opin = $("[data-opin]");
  if (opin) {
    var citas = $$(".op-cita", opin), fotosOp = $$("[data-op-foto]", opin), ver = $("[data-ver-obra]", opin), actual = 0;
    var muestra = function (i) {
      actual = (i + citas.length) % citas.length;
      citas.forEach(function (c, k) { c.classList.toggle("on", k === actual); });
      fotosOp.forEach(function (f) { f.classList.toggle("on", +f.getAttribute("data-op-foto") === actual); });
    };
    $$("[data-op-mover]", opin).forEach(function (b) { b.addEventListener("click", function () { muestra(actual + +b.getAttribute("data-op-mover")); }); });
    if (ver) ver.addEventListener("click", function () { var o = +citas[actual].getAttribute("data-obra"); if (ANCHO.matches) activaObra(o); });
  }

  /* ---------- movimiento (GSAP): sección que corre de lado y paneles que entran al asomar ---------- */
  if (R || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  var est = $("[data-estudio]"), pista = $("[data-est-pista]"), velo = $("[data-est-velo]"), marron = $("[data-marron]");
  var parrafo = est ? $(".est-c p", est) : null;
  if (est && pista) {
    var mmG = gsap.matchMedia();
    /* en el móvil no corre de lado: el párrafo se enciende por tiempo al asomar */
    mmG.add("(max-width: 899px)", function () {
      var w = null, vivo = true;
      document.fonts.ready.then(function () {
        if (!vivo || !parrafo || !window.SplitText) return;
        w = SplitText.create(parrafo, { type: "words", aria: "none" });
        gsap.fromTo(w.words, { opacity: 0.18 }, { opacity: 1, duration: 0.6, ease: "power1.out", stagger: 0.045, scrollTrigger: { trigger: parrafo, start: "top 82%", once: true } });
      });
      return function () { vivo = false; if (w) w.revert(); };
    });
    mmG.add("(min-width: 900px)", function () {
      /* la clase va ya (cambia la altura de la sección); lo que trocea palabras espera a la letra */
      H.classList.add("est-horiz");
      var palabras = null, tl = null, vt = null, vivo = true;
      document.fonts.ready.then(function () {
        if (!vivo) return;
        if (parrafo && window.SplitText) palabras = SplitText.create(parrafo, { type: "words", aria: "none" });
        tl = gsap.timeline({ scrollTrigger: { trigger: est, start: "top top", end: function () { return "+=" + innerHeight * 0.9; }, scrub: 0.8, invalidateOnRefresh: true } });
        tl.to(pista, { x: function () { return -innerWidth * 0.5; }, ease: "none", duration: 1 }, 0);
        if (palabras) tl.fromTo(palabras.words, { opacity: 0.18 }, { opacity: 1, ease: "none", stagger: 0.02, duration: 0.25 }, 0.5);
        if (velo && marron) vt = gsap.fromTo(velo, { opacity: 0 }, { opacity: 0.45, ease: "none", scrollTrigger: { trigger: marron, start: "top bottom", end: "top top", scrub: true } });
        ScrollTrigger.refresh();
      });
      return function () {
        vivo = false;
        H.classList.remove("est-horiz");
        if (tl) { tl.scrollTrigger.kill(); tl.kill(); }
        if (vt) { vt.scrollTrigger.kill(); vt.kill(); }
        if (palabras) palabras.revert();
        gsap.set([pista, velo], { clearProps: "all" });
      };
    });
  }

  /* fotos que se destapan y se asientan */
  $$('[data-panel="foto"]').forEach(function (el) {
    /* en los huecos con varias fotos (.pf) se mueve la capa, no la img: la img tiene su transición de CSS */
    var img = el.querySelector(".pf.on") || el.querySelector("img");
    var tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    tl.fromTo(el, { clipPath: "inset(10% 0% 10% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power3.out", clearProps: "clipPath" });
    if (img && !el.closest(".est-b")) tl.fromTo(img, { scale: 1.14 }, { scale: 1, duration: 1.6, ease: "power3.out", clearProps: "transform" }, 0);
  });
  /* el texto del bloque marrón y su enlace suben */
  var mt = $(".mar-txt");
  if (mt) gsap.from(mt.children, { y: 30, opacity: 0, duration: 1.1, ease: "power3.out", stagger: 0.12, clearProps: "transform,opacity", scrollTrigger: { trigger: mt, start: "top 85%", once: true } });
  /* el nombre gigante sube letra a letra */
  $$("[data-gigante]").forEach(function (gig) {
    gsap.from($$("span span", gig), { yPercent: 104, duration: 1.15, ease: "power4.out", stagger: 0.07, scrollTrigger: { trigger: gig, start: "top 96%", once: true } });
  });
  /* filas de obras: entran escalonadas; la foto activa se destapa de arriba abajo */
  var lista = $(".obras-lista");
  if (lista) {
    gsap.from($$(".obra-fila", lista), { y: 22, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.07, clearProps: "transform,opacity", scrollTrigger: { trigger: lista, start: "top 80%", once: true } });
    if (ANCHO.matches) {
      var f0 = $(".obra.on .obra-foto", lista);
      if (f0) gsap.fromTo(f0, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power3.inOut", clearProps: "clipPath", scrollTrigger: { trigger: $(".obras-in"), start: "top 75%", once: true } });
    } else {
      $$(".obra-foto", lista).forEach(function (f) {
        gsap.fromTo(f, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power3.inOut", clearProps: "clipPath", scrollTrigger: { trigger: f, start: "top 88%", once: true } });
      });
    }
  }
  /* columna del presupuesto y opinión: entran desde abajo */
  $$(".campos, .resul, .msg, .acc").forEach(function (el, i) {
    gsap.from(el, { y: 24, opacity: 0, duration: 1, ease: "power3.out", delay: 0.05 * i, clearProps: "transform,opacity", scrollTrigger: { trigger: el, start: "top 92%", once: true } });
  });
  var oc = $(".op-centro");
  if (oc) gsap.from(oc.children, { y: 26, opacity: 0, duration: 1.1, ease: "power3.out", stagger: 0.1, clearProps: "transform,opacity", scrollTrigger: { trigger: oc, start: "top 80%", once: true } });
  var pc = $(".pie-rej");
  if (pc) gsap.from(pc.children, { y: 24, opacity: 0, duration: 1.1, ease: "power3.out", stagger: 0.1, clearProps: "transform,opacity", scrollTrigger: { trigger: pc, start: "top 88%", once: true } });

  addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
