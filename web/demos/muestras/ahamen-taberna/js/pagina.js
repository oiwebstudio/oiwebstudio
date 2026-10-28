/* AHAMEN · muestra de OI Studio. Cabecera, menú, fotos de portada, «abierto ahora», panel de la carta,
   opiniones y animaciones de paneles. Sin JS o con «reducir movimiento»: todo visible y quieto. */
(function () {
  var T = {};
  try { T = JSON.parse(document.getElementById("textos").textContent); } catch (e) {}
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ——— cabecera: color según la sección de debajo y nombre al salir de la portada ——— */
  var cab = document.querySelector(".cab");
  var secciones = [].slice.call(document.querySelectorAll("[data-tono]")).filter(function (s) { return s !== cab; });
  function tono() {
    var y = 34, elegido = null;
    for (var i = 0; i < secciones.length; i++) {
      var r = secciones[i].getBoundingClientRect();
      if (r.top <= y && r.bottom > y) { elegido = secciones[i]; }
    }
    if (elegido) {
      cab.setAttribute("data-tono", elegido.getAttribute("data-tono"));
      // fuera de la portada, la cabecera toma el color de la sección para que no se monte sobre los titulares
      cab.style.backgroundColor = elegido.hasAttribute("data-portada") ? "" : getComputedStyle(elegido).backgroundColor;
    }
    var p = document.querySelector("[data-portada]");
    cab.classList.toggle("con-marca", p ? p.getBoundingClientRect().bottom < 80 : true);
  }
  var pend = false;
  addEventListener("scroll", function () { if (!pend) { pend = true; requestAnimationFrame(function () { pend = false; tono(); }); } }, { passive: true });
  addEventListener("resize", tono);
  tono();

  /* ——— menú a pantalla completa ——— */
  var bMenu = document.querySelector(".cab-menu"), menu = document.getElementById("menu"), main = document.getElementById("contenido");
  var bCerrar = menu && menu.querySelector(".menu-cerrar");
  function abrir() {
    menu.hidden = false; bMenu.setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden";
    if (main) main.inert = true; document.querySelector(".pie") && (document.querySelector(".pie").inert = true);
    bCerrar.focus();
    if (window.gsap && !reduce) gsap.from(menu.querySelectorAll("nav a"), { y: 30, opacity: 0, duration: .7, ease: "expo.out", stagger: .04 });
  }
  function cerrar(volver) {
    menu.hidden = true; bMenu.setAttribute("aria-expanded", "false"); document.body.style.overflow = "";
    if (main) main.inert = false; document.querySelector(".pie") && (document.querySelector(".pie").inert = false);
    if (volver !== false) bMenu.focus();
  }
  if (bMenu && menu) {
    bMenu.addEventListener("click", abrir);
    bCerrar.addEventListener("click", function () { cerrar(); });
    menu.addEventListener("keydown", function (e) {
      if (e.key === "Escape") cerrar();
      if (e.key === "Tab") { // el foco no sale del menú
        var f = menu.querySelectorAll("a,button"), a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
    menu.querySelectorAll("nav a").forEach(function (a) { a.addEventListener("click", function () { cerrar(false); }); });
  }

  /* ——— fotos de la portada: las miniaturas cambian la foto de fondo (sin pase automático) ——— */
  var fotos = [].slice.call(document.querySelectorAll(".pf")), minis = [].slice.call(document.querySelectorAll(".mini"));
  function carga(i) {
    var p = fotos[i]; if (!p) return;
    p.querySelectorAll("[data-srcset]").forEach(function (s) { s.srcset = s.getAttribute("data-srcset"); s.removeAttribute("data-srcset"); });
    var im = p.querySelector("img"); if (im.getAttribute("data-src")) { im.src = im.getAttribute("data-src"); im.removeAttribute("data-src"); }
    return im;
  }
  function ver(i) {
    var im = carga(i);
    var pon = function () { fotos.forEach(function (p, j) { p.classList.toggle("on", j === i); }); };
    if (im && im.decode && !im.complete) im.decode().then(pon, pon); else pon();
    minis.forEach(function (m, j) { m.classList.toggle("on", j === i); m.setAttribute("aria-pressed", j === i ? "true" : "false"); });
  }
  minis.forEach(function (m, i) {
    m.addEventListener("click", function () { ver(i); });
    m.addEventListener("pointerenter", function () { carga(i); });
    m.addEventListener("focus", function () { carga(i); });
  });

  /* ——— «abierto ahora» con la hora de aquí (Europe/Madrid) ——— */
  function ahora() {
    var d = new Date(), o = {};
    try {
      new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
        .formatToParts(d).forEach(function (p) { o[p.type] = p.value; });
      return { dia: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(o.weekday), min: (+o.hour) * 60 + (+o.minute) };
    } catch (e) { return { dia: (d.getDay() + 6) % 7, min: d.getHours() * 60 + d.getMinutes() }; }
  }
  var CIERRE = [0, 1380, 1380, 1380, 1500, 1500, 960]; // lunes cerrado · ma–ju 23:00 · vi–sá 1:00 · do 16:00
  var n = ahora(), est = document.querySelector("[data-estado]");
  if (est && T.estado_abierto_23) {
    var txt, abierto = true;
    if (n.min < 60 && (n.dia === 5 || n.dia === 6)) txt = T.estado_abierto_01;              // madrugada de viernes o sábado
    else if (n.dia === 0) { abierto = false; txt = T.estado_cerrado_manana; }                // lunes
    else if (n.min < 600) { abierto = false; txt = T.estado_cerrado_hoy; }
    else if (n.min < CIERRE[n.dia]) txt = CIERRE[n.dia] === 1380 ? T.estado_abierto_23 : CIERRE[n.dia] === 960 ? T.estado_abierto_16 : T.estado_abierto_01;
    else { abierto = false; txt = n.dia === 6 ? T.estado_cerrado_martes : T.estado_cerrado_manana; }
    est.textContent = txt; est.classList.toggle("cerrado", !abierto); est.hidden = false;
  }
  var hoy = document.querySelector('.pie-horas li[data-dia="' + n.dia + '"]');
  if (hoy) hoy.setAttribute("aria-current", "date");

  /* ——— panel del dueño: cambia precios y agotados de la carta ——— */
  var panel = document.querySelector(".panel");
  if (panel) {
    panel.hidden = false;
    var aviso = panel.querySelector(".panel-estado"), tAviso;
    var fmt = function (x) { return x.toFixed(2).replace(".", ",") + " €"; };
    var fila = function (id) { return document.querySelector('.platos li[data-id="' + id + '"]'); };
    var avisa = function () { aviso.textContent = T.panel_hecho || ""; clearTimeout(tAviso); tAviso = setTimeout(function () { aviso.textContent = ""; }, 2600); };
    panel.querySelectorAll("[data-paso]").forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-id"), li = fila(id); if (!li) return;
        var v = Math.max(.5, Math.round((+li.getAttribute("data-pr") + (+b.getAttribute("data-paso"))) * 100) / 100);
        li.setAttribute("data-pr", v);
        li.querySelector(".pr").textContent = fmt(v);
        panel.querySelector('[data-p="' + id + '"]').textContent = fmt(v);
        li.classList.remove("cambia"); void li.offsetWidth; li.classList.add("cambia");
        avisa();
      });
    });
    panel.querySelectorAll("[data-agot]").forEach(function (c) {
      c.addEventListener("change", function () {
        var li = fila(c.getAttribute("data-agot")); if (!li) return;
        li.classList.toggle("agotado", c.checked);
        var ag = li.querySelector(".ag");
        if (c.checked && !ag) { ag = document.createElement("span"); ag.className = "ag"; ag.textContent = T.agotado || ""; li.appendChild(ag); }
        if (!c.checked && ag) ag.remove();
        avisa();
      });
    });
  }

  /* ——— opiniones: una cada vez ——— */
  var ops = [].slice.call(document.querySelectorAll(".iritzi")), ctl = document.querySelector(".iritzi-ctl"), cuenta = document.querySelector("[data-cuenta]"), ia = 0;
  function op(i) {
    ia = (i + ops.length) % ops.length;
    ops.forEach(function (o, j) { o.hidden = j !== ia; });
    if (cuenta) cuenta.textContent = (ia + 1) + " / " + ops.length;
  }
  if (ops.length > 1 && ctl) {
    ctl.hidden = false; op(0);
    ctl.querySelector("[data-ant]").addEventListener("click", function () { op(ia - 1); });
    ctl.querySelector("[data-sig]").addEventListener("click", function () { op(ia + 1); });
  }

  /* ——— animaciones de paneles (texto: anim-texto.js) ——— */
  if (!window.gsap || !window.ScrollTrigger || reduce) return;
  gsap.registerPlugin(ScrollTrigger);
  document.fonts.ready.then(function () {
    // portada: la línea del lugar y las miniaturas entran tras el nombre
    gsap.from(".lugar", { y: 18, opacity: 0, duration: 1, ease: "expo.out", delay: .55 });
    gsap.from(".mini", { y: 34, opacity: 0, duration: 1, ease: "expo.out", stagger: .06, delay: .7, clearProps: "opacity,transform" });
    gsap.fromTo(".pf.on img", { scale: 1.08 }, { scale: 1, duration: 2.2, ease: "expo.out" });
    // presentación: el subrayado y el rotulador se dibujan
    gsap.fromTo(".intro .sub", { backgroundSize: "0% 1.5px, 0% 1px" }, { backgroundSize: "100% 1.5px, 100% 1px", duration: 1, ease: "power2.inOut", stagger: .25, scrollTrigger: { trigger: ".intro-p", start: "top 70%" } });
    gsap.fromTo(".intro .marca", { backgroundSize: "0% 86%" }, { backgroundSize: "100% 86%", duration: .8, ease: "power2.inOut", delay: .55, scrollTrigger: { trigger: ".intro-p", start: "top 70%" } });
    gsap.from(".regla span", { x: -10, opacity: 0, duration: .8, ease: "expo.out", stagger: .05, scrollTrigger: { trigger: ".intro", start: "top 70%" } });

    // fotos verticales: se destapan de abajo arriba y se asientan
    document.querySelectorAll(".cap-foto").forEach(function (f) {
      gsap.fromTo(f, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut", clearProps: "clipPath", scrollTrigger: { trigger: f, start: "top 88%" } });
      gsap.fromTo(f.querySelector("img"), { scale: 1.16 }, { scale: 1, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: f, start: "top 88%" } });
    });
    // hojas de papel: la de delante cae girando, las de detrás se abren en abanico
    document.querySelectorAll(".hojas").forEach(function (h) {
      var st = { trigger: h, start: "top 86%" };
      gsap.from(h.querySelector(".hoja-frente"), { y: 120, rotate: 4, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: st });
      gsap.from(h.querySelectorAll(".hoja-atras"), { rotate: 0, xPercent: function (i) { return i ? -22 : 22; }, opacity: 0, duration: 1.5, ease: "expo.out", delay: .15, scrollTrigger: st });
      gsap.from(h.querySelectorAll(".hoja-cols > *"), { y: 26, opacity: 0, duration: .9, ease: "expo.out", stagger: .1, delay: .35, scrollTrigger: st });
    });
    // la carta: el montón de hojas sube y el móvil del dueño entra de lado
    var kp = document.querySelector(".karta-pila");
    if (kp) {
      gsap.from(kp.querySelector(".karta-hoja"), { y: 140, rotate: -3, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: kp, start: "top 88%" } });
      gsap.from(kp.querySelectorAll(".hoja-atras"), { rotate: 0, y: 60, opacity: 0, duration: 1.5, ease: "expo.out", delay: .1, scrollTrigger: { trigger: kp, start: "top 88%" } });
    }
    if (panel) gsap.from(panel, { x: 60, y: 30, rotate: 8, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: panel, start: "top 90%" } });
    // galería: las fotos llegan escalonadas; con ratón, la fila corre de lado con el scroll
    ScrollTrigger.batch(".polaroid", { start: "top 92%", once: true, onEnter: function (els) {
      gsap.from(els, { y: 70, rotate: function (i) { return i % 2 ? 3 : -3; }, opacity: 0, duration: 1.1, ease: "expo.out", stagger: .08 });
    } });
    var vista = document.querySelector(".gal-vista"), filaG = document.querySelector(".gal-fila");
    if (vista && filaG && matchMedia("(hover: hover) and (pointer: fine) and (min-width: 900px)").matches) {
      vista.classList.add("arrastre"); vista.removeAttribute("tabindex");
      gsap.to(filaG, { x: function () { return -Math.max(0, filaG.scrollWidth - innerWidth); }, ease: "none", scrollTrigger: { trigger: ".galeria", start: "top bottom", end: "bottom top", scrub: .6, invalidateOnRefresh: true } });
    }
    // menú del día y opiniones
    gsap.from(".gaur > div", { y: 30, opacity: 0, duration: 1, ease: "expo.out", stagger: .1, scrollTrigger: { trigger: ".gaur", start: "top 88%" } });
    gsap.from(".iritzi-zona", { y: 40, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: ".iritzi-zona", start: "top 88%" } });
    // reservar: la tarjeta crece con el scroll y las guías bajan
    gsap.fromTo(".deia", { scale: .9, y: 40 }, { scale: 1, y: 0, ease: "none", scrollTrigger: { trigger: ".deia", start: "top 98%", end: "top 45%", scrub: .6 } });
    gsap.from(".erreserba .guias i", { scaleY: 0, transformOrigin: "50% 0%", duration: 1.2, ease: "expo.out", stagger: .08, scrollTrigger: { trigger: ".erreserba", start: "top 85%" } });
    // pie: columnas desde los lados, croquis que se dibuja y el nombre gigante que sube
    gsap.from(".pie-rej > *", { y: 30, opacity: 0, duration: 1, ease: "expo.out", stagger: .1, scrollTrigger: { trigger: ".pie-rej", start: "top 85%" } });
    var trazos = document.querySelectorAll(".croquis [data-traza]");
    if (trazos.length) gsap.fromTo(trazos, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", stagger: .12, scrollTrigger: { trigger: ".croquis", start: "top 88%" } });
    gsap.from(".croquis .pin", { scale: 0, transformOrigin: "50% 100%", duration: .8, ease: "back.out(2)", delay: 1.2, scrollTrigger: { trigger: ".croquis", start: "top 88%" } });
    gsap.fromTo(".pie-gigante", { yPercent: 45 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".pie-gigante", start: "top bottom", end: "bottom bottom", scrub: .6 } });
  });
})();
