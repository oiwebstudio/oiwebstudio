/* ARTILE · movimiento y detalles propios de la muestra (el de texto común va en anim-texto.js).
   - Horario: marca el día de hoy y si está abierto ahora (hora de Tolosa). Funciona sin GSAP.
   - Portada: la foto se destapa de abajo arriba y se asienta; el nombre sube letra a letra (anim-texto.js).
   - Prendas: en escritorio la fila se queda fija y pasa de lado con el scroll; las etiquetas de precio se balancean al llegar.
   - Paneles (Oier, 24/10): fotos que se destapan, tarjeta, ticket, tabla y croquis que se abren al entrar, rejillas escalonadas.
   Con «reducir movimiento» o sin GSAP todo queda quieto y visible: nada está oculto en el CSS. */
(function () {
  // ---------- horario: hoy y «abierto ahora» ----------
  var lista = document.querySelector("[data-horario]");
  var estado = document.querySelector("[data-estado]");
  if (lista && estado) {
    var partes = {};
    try {
      new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
        .formatToParts(new Date()).forEach(function (p) { partes[p.type] = p.value; });
    } catch (e) {}
    var dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    var hoy = partes.weekday in dias ? dias[partes.weekday] : new Date().getDay();
    var ahora = (+partes.hour || new Date().getHours()) * 60 + (+partes.minute || new Date().getMinutes());
    var min = function (t) { var x = t.split(":"); return +x[0] * 60 + +x[1]; };
    var li = lista.querySelector('[data-dia="' + hoy + '"]');
    if (li) {
      li.setAttribute("aria-current", "date");
      var marca = document.createElement("span");
      marca.className = "hoy";
      marca.textContent = estado.dataset.hoy;
      li.querySelector(".dia").appendChild(marca);
      var abierto = (li.dataset.horas || "").split(",").some(function (r) {
        if (!r) return false;
        var ab = r.split("-");
        return ahora >= min(ab[0]) && ahora < min(ab[1]);
      });
      estado.textContent = abierto ? estado.dataset.abierto : estado.dataset.cerrado;
      estado.classList.toggle("abierto", abierto);
      estado.hidden = false;
    }
  }

  // ---------- fila de prendas: con el teclado, que la prenda enfocada se vea ----------
  var seccion = document.querySelector("[data-prendas]");
  var pista = document.querySelector("[data-pista-prendas]");

  if (!window.gsap || !window.ScrollTrigger || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.registerPlugin(ScrollTrigger);
  var eo = "expo.out";

  // ---------- portada ----------
  var pf = document.querySelector(".portada-foto");
  if (pf) {
    gsap.fromTo(pf, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut", clearProps: "clipPath" });
    var pimg = pf.querySelector("img");
    if (pimg) gsap.fromTo(pimg, { scale: 1.16 }, { scale: 1, duration: 2.4, ease: eo });
  }
  gsap.from(".cab > *", { y: -14, opacity: 0, duration: 0.9, ease: eo, stagger: 0.07, delay: 0.2 });
  gsap.from(".portada [data-entra] > *", { y: 22, opacity: 0, duration: 1, ease: eo, stagger: 0.09, delay: 0.75 });

  // ---------- textos y bloques que entran ----------
  gsap.utils.toArray("main [data-entra]").forEach(function (el) {
    if (el.closest(".portada")) return;
    gsap.from(el, { y: 30, opacity: 0, duration: 1, ease: eo, scrollTrigger: { trigger: el, start: "top 88%" } });
  });

  // titulares a dos líneas: cada línea sube con su máscara; en la colección se separan un poco con el scroll
  gsap.utils.toArray(".col h2, .tienda h2").forEach(function (h) {
    gsap.from(h.querySelectorAll(".linea > span"), { yPercent: 108, duration: 1.2, ease: eo, stagger: 0.12, scrollTrigger: { trigger: h, start: "top 85%" } });
  });
  var escena = document.querySelector(".col-escena");
  if (escena) {
    var st = { trigger: escena, start: "top bottom", end: "bottom top", scrub: 0.6 };
    gsap.fromTo(escena.querySelector(".l1"), { xPercent: 7 }, { xPercent: -7, ease: "none", scrollTrigger: st });
    gsap.fromTo(escena.querySelector(".l2"), { xPercent: -7 }, { xPercent: 7, ease: "none", scrollTrigger: st });
  }

  // fotos que se destapan de abajo arriba y se asientan
  gsap.utils.toArray("[data-revela]").forEach(function (f) {
    var img = f.querySelector("img");
    gsap.fromTo(f, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut", clearProps: "clipPath", scrollTrigger: { trigger: f, start: "top 88%" } });
    if (img) gsap.fromTo(img, { scale: 1.14 }, { scale: 1, duration: 1.9, ease: eo, scrollTrigger: { trigger: f, start: "top 88%" } });
  });

  // paneles (tarjeta, ticket, tabla, croquis): se abren desde un recorte con sus esquinas
  gsap.utils.toArray("[data-panel]").forEach(function (p) {
    var r = p.classList.contains("tarjeta") ? "22px" : "0px";
    gsap.fromTo(p, { clipPath: "inset(10% 5% 0% 5% round " + r + ")", y: 40, opacity: 0 },
      { clipPath: "inset(0% 0% 0% 0% round " + r + ")", y: 0, opacity: 1, duration: 1.15, ease: eo, clearProps: "clipPath,transform",
        scrollTrigger: { trigger: p, start: "top 90%" } });
  });

  // rejilla de Instagram, escalonada
  ScrollTrigger.batch("[data-panel-ig]", { start: "top 92%", once: true, onEnter: function (els) {
    gsap.fromTo(els, { y: 36, opacity: 0, clipPath: "inset(12% 0% 0% 0%)" }, { y: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: eo, stagger: 0.07, clearProps: "clipPath" });
  } });

  // croquis: las calles principales y la calle Mayor se dibujan al entrar
  var croquis = document.querySelector(".croquis");
  if (croquis) {
    var trazos = croquis.querySelectorAll(".principal path, .resaltada path, .rio path");
    var calles = croquis.querySelector(".calle");
    var tl = gsap.timeline({ scrollTrigger: { trigger: croquis, start: "top 80%" } });
    tl.fromTo(trazos, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", stagger: 0.01 })
      .from(calles, { opacity: 0, duration: 1, ease: "power1.out" }, 0.2)
      .from(croquis.querySelectorAll(".pin, .e-barrio, .e-rio"), { opacity: 0, scale: 0.9, transformOrigin: "50% 50%", duration: 0.7, ease: eo, stagger: 0.08 }, 1);
  }

  // ---------- prendas ----------
  if (seccion && pista) {
    var etiquetas = pista.querySelectorAll(".etiqueta");
    var mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", function () {
      seccion.classList.add("fijada");
      var dist = function () { return Math.max(0, pista.scrollWidth - seccion.clientWidth); };
      var tw = gsap.to(pista, { x: function () { return -dist(); }, ease: "none",
        scrollTrigger: { trigger: seccion, start: "top 6%", end: function () { return "+=" + dist(); }, pin: true, scrub: 0.7, invalidateOnRefresh: true, anticipatePin: 1 } });
      // teclado: llevar el scroll hasta la prenda que recibe el foco
      var alFoco = function (e) {
        var item = e.target.closest(".prenda");
        if (!item || !tw.scrollTrigger) return;
        var s = tw.scrollTrigger, d = dist() || 1;
        pista.scrollLeft = 0;
        var x = Math.min(d, Math.max(0, item.offsetLeft - (seccion.clientWidth - item.offsetWidth) / 2));
        window.scrollTo(0, s.start + (x / d) * (s.end - s.start));
      };
      pista.addEventListener("focusin", alFoco);
      return function () { seccion.classList.remove("fijada"); pista.removeEventListener("focusin", alFoco); };
    });
    ScrollTrigger.batch(pista.querySelectorAll(".prenda"), { start: "top 92%", once: true, onEnter: function (els) {
      gsap.fromTo(els, { y: 48, opacity: 0, clipPath: "inset(10% 4% 0% 4%)" }, { y: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: eo, stagger: 0.08, clearProps: "clipPath,transform" });
    } });
    gsap.fromTo(etiquetas, { rotation: -26 }, { rotation: 3, duration: 1.8, ease: "elastic.out(1, 0.35)", stagger: 0.09, clearProps: "transform",
      scrollTrigger: { trigger: seccion, start: "top 75%" } });
  }

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
