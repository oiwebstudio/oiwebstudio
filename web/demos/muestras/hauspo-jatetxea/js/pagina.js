/* HAUSPO (muestra de restaurante de OI Studio; diseño de la v3 calcada de RAMU) · movimiento propio de la página, además de anim-texto.js.
   - HAUSPO de la portada sube letra a letra (sus letras, en SVG) y la foto se asienta despacio.
   - La palabra gigante de la carta sube con el scroll sobre la foto; los títulos suben letra a letra.
   - Las fotos de las tarjetas y la del comedor se deslizan al entrar.
   - En el pie, el HAUSPO gigante sube letra a letra.
   Con «reducir movimiento» o sin GSAP no se anima nada: en el CSS no hay nada oculto. */
(function () {
  var cuerpo = document.body, boton = document.querySelector(".menu-boton"), menu = document.getElementById("menu");
  function poner(abierto) {
    cuerpo.classList.toggle("menu-abierto", abierto);
    boton.setAttribute("aria-expanded", abierto ? "true" : "false");
    boton.setAttribute("aria-label", abierto ? boton.dataset.cerrar : boton.dataset.abrir);
    boton.textContent = abierto ? boton.dataset.txtCerrar : boton.dataset.txtAbrir;
  }
  if (boton) {
    poner(false);
    boton.addEventListener("click", function () { poner(!cuerpo.classList.contains("menu-abierto")); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) poner(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && cuerpo.classList.contains("menu-abierto")) { poner(false); boton.focus(); } });
  }
  var barra = document.querySelector("[data-barra-movil]");
  if (barra && "MutationObserver" in window) {
    new MutationObserver(function () {
      var on = barra.classList.contains("on");
      barra.setAttribute("aria-hidden", on ? "false" : "true");
      barra.tabIndex = on ? 0 : -1;
    }).observe(barra, { attributes: true, attributeFilter: ["class"] });
  }
  var gora = document.querySelector("[data-gora]");
  if (gora) gora.addEventListener("click", function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); });

  /* Horario de ejemplo (inventado): 0 domingo … 6 sábado, tramos en minutos */
  var HORARIO = { 0: [[780, 960]], 1: [], 2: [[780, 960]], 3: [[780, 960]], 4: [[780, 960]], 5: [[780, 960], [1230, 1380]], 6: [[780, 960], [1230, 1380]] };
  var ahoraTolosa = function () { var s = new Date().toLocaleString("en-US", { timeZone: "Europe/Madrid" }); return new Date(s); };
  var chip = document.querySelector("[data-abierto]");
  if (chip) {
    var pinta = function () {
      var d = ahoraTolosa(), m = d.getHours() * 60 + d.getMinutes();
      var si = HORARIO[d.getDay()].some(function (t) { return m >= t[0] && m < t[1]; });
      chip.classList.toggle("si", si);
      chip.textContent = si ? chip.dataset.si : chip.dataset.no;
      chip.hidden = false;
    };
    pinta(); setInterval(pinta, 60000);
  }

  /* Reserva de prueba (pack restaurante): se rellena la ficha tal como os llegaría; no se envía nada */
  var form = document.querySelector("[data-reserva]");
  if (form) {
    var dia = form.elements.dia, hora = form.elements.hora, aviso = form.querySelector("[data-res-aviso]"), ticket = document.querySelector("[data-ticket]");
    var hoy = ahoraTolosa(); var dos = function (n) { return (n < 10 ? "0" : "") + n; };
    var iso = function (d) { return d.getFullYear() + "-" + dos(d.getMonth() + 1) + "-" + dos(d.getDate()); };
    var primero = new Date(hoy); while (!HORARIO[primero.getDay()].length) primero.setDate(primero.getDate() + 1);
    dia.min = iso(hoy); dia.value = iso(primero);
    var horas = function () {
      var d = new Date(dia.value + "T12:00:00"), tramos = HORARIO[d.getDay()] || [];
      hora.innerHTML = "";
      tramos.forEach(function (t) { for (var m = t[0]; m <= t[1] - 60; m += 30) { var o = document.createElement("option"); o.textContent = dos(Math.floor(m / 60)) + ":" + dos(m % 60); hora.appendChild(o); } });
      aviso.textContent = tramos.length ? "" : (d.getDay() === 1 ? aviso.dataset.lunes + " " : "") + aviso.dataset.elige;
      return tramos.length > 0;
    };
    horas(); dia.addEventListener("change", horas);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!horas() || !hora.value) return;
      if (!form.elements.nombre.value.trim()) { form.elements.nombre.focus(); return; }
      var d = new Date(dia.value + "T12:00:00");
      var EGUN = ["igandea", "astelehena", "asteartea", "asteazkena", "osteguna", "ostirala", "larunbata"], HIL = ["urtarrilak", "otsailak", "martxoak", "apirilak", "maiatzak", "ekainak", "uztailak", "abuztuak", "irailak", "urriak", "azaroak", "abenduak"];
      var fecha = document.documentElement.lang === "eu" ? HIL[d.getMonth()] + " " + d.getDate() + ", " + EGUN[d.getDay()] : d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
      var datos = { dia: fecha, hora: hora.value, pers: form.elements.pers.value, nombre: form.elements.nombre.value.trim() };
      Object.keys(datos).forEach(function (k) { ticket.querySelector('[data-t="' + k + '"]').textContent = datos[k]; });
      if (window.gsap && !matchMedia("(prefers-reduced-motion: reduce)").matches) gsap.fromTo(ticket.querySelector(".t-cuerpo"), { y: 30, opacity: 0, rotate: -2 }, { y: 0, opacity: 1, rotate: 0, duration: 0.8, ease: "back.out(1.8)" });
    });
  }

  /* Panel con la carta entera: precios y alérgenos, con filtro «sin este alérgeno» */
  var panel = document.getElementById("panel-karta");
  var quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (panel && panel.showModal) {
    var quitar = panel.querySelector("[data-al-quitar]");
    var filtrar = function () {
      var sin = [].map.call(panel.querySelectorAll(".al-boton[aria-pressed=true]"), function (b) { return b.dataset.al; });
      panel.querySelectorAll(".pg").forEach(function (g) {
        var visibles = 0;
        g.querySelectorAll("li").forEach(function (li) {
          var lleva = (li.dataset.al || "").split(" ");
          var fuera = sin.some(function (a) { return lleva.indexOf(a) >= 0; });
          li.classList.toggle("fuera", fuera);
          if (!fuera) visibles++;
        });
        g.querySelector(".vacio").hidden = visibles > 0;
      });
      quitar.hidden = sin.length === 0;
      if (window.gsap && !quieto) gsap.fromTo(panel.querySelectorAll(".pg li:not(.fuera)"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.015, overwrite: true });
    };
    panel.querySelectorAll(".al-boton").forEach(function (b) {
      b.addEventListener("click", function () { b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") === "true" ? "false" : "true"); filtrar(); });
    });
    quitar.addEventListener("click", function () { panel.querySelectorAll(".al-boton").forEach(function (b) { b.setAttribute("aria-pressed", "false"); }); filtrar(); });
    document.querySelectorAll("[data-abrir-carta]").forEach(function (b) {
      b.addEventListener("click", function () {
        panel.showModal();
        panel.scrollTop = 0;
        if (window.gsap && !quieto) {
          gsap.fromTo(panel, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "expo.out" });
          gsap.fromTo(panel.querySelectorAll(".pg h3, .pg li, .al-boton"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: "expo.out", stagger: 0.012, delay: 0.1 });
        }
      });
    });
    panel.querySelector("[data-cerrar-carta]").addEventListener("click", function () { panel.close(); });
    panel.addEventListener("click", function (e) { if (e.target === panel) panel.close(); });
  }

  var raiz = document.documentElement;
  if (!window.gsap || !window.ScrollTrigger || !window.SplitText || matchMedia("(prefers-reduced-motion: reduce)").matches) { raiz.classList.remove("pre"); return; }
  gsap.registerPlugin(ScrollTrigger, SplitText);

  /* HAUSPO con sus letras entra en cuanto se abre la página, sin esperar a las letras de la web */
  gsap.set(".marca-svg .l", { opacity: 1 });
  gsap.from(".marca-svg .l", { y: 720, duration: 1.3, ease: "expo.out", stagger: 0.075 });

  document.fonts.ready.then(function () {
    /* La foto grande de la portada sube y se abre después de la palabra gigante */
    var fp = document.querySelector(".foto-grande[data-desliza=portada]");
    if (fp) {
      gsap.fromTo(fp, { clipPath: "inset(18% 6% 0% 6%)", y: 60 }, { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 1.5, ease: "expo.out", delay: 0.55 });
      gsap.fromTo(fp.querySelector("img"), { scale: 1.2 }, { scale: 1, duration: 2, ease: "expo.out", delay: 0.55 });
    }
    /* La foto grande se acerca despacio al bajar; las de cada rejilla suben a distinto ritmo */
    gsap.utils.toArray(".foto-grande img").forEach(function (im) { gsap.fromTo(im, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: im.closest("figure"), start: "top bottom", end: "bottom top", scrub: true } }); });
    gsap.utils.toArray(".rejilla > figure:nth-child(2), .rejilla > div:nth-child(2)").forEach(function (f) { gsap.fromTo(f, { y: 50 }, { y: -30, ease: "none", scrollTrigger: { trigger: f.parentNode, start: "top bottom", end: "bottom top", scrub: true } }); });
    /* El croquis se dibuja con el scroll y luego cae el punto de HAUSPO */
    var cq = document.querySelector(".croquis");
    if (cq) {
      var trazos = cq.querySelectorAll(".calle path, .principal path, .tren path, .rio path, .rio-mancha path, .resaltada path");
      gsap.set(trazos, { strokeDasharray: 1, strokeDashoffset: 1 });
      var tl = gsap.timeline({ scrollTrigger: { trigger: ".croquis-caja", start: "top 85%", end: "center 45%", scrub: 0.6 } });
      tl.to(cq.querySelectorAll(".rio-mancha path, .rio path"), { strokeDashoffset: 0, ease: "none", duration: 0.6 }, 0)
        .to(cq.querySelectorAll(".principal path"), { strokeDashoffset: 0, ease: "none", duration: 0.7 }, 0.05)
        .to(cq.querySelectorAll(".calle path, .tren path"), { strokeDashoffset: 0, ease: "none", duration: 0.8, stagger: { amount: 0.25 } }, 0.15)
        .to(cq.querySelectorAll(".resaltada path"), { strokeDashoffset: 0, ease: "none", duration: 0.3 }, 0.75)
        .from(cq.querySelectorAll(".agua path, .parque path, .e-barrio, .e-rio"), { opacity: 0, duration: 0.4 }, 0.3);
      gsap.from(cq.querySelector(".pin"), { scale: 0, transformOrigin: "50% 50%", duration: 0.9, ease: "back.out(2.4)", scrollTrigger: { trigger: ".croquis-caja", start: "center 60%" } });
      gsap.fromTo(cq.querySelector(".pin-onda"), { scale: 1, opacity: 0.8 }, { scale: 3.2, opacity: 0, duration: 1.8, ease: "power2.out", repeat: -1, delay: 1 });
    }
    /* La foto ancha del comedor se abre de los lados al bajar */
    gsap.utils.toArray(".foto-grande.sola").forEach(function (f) { gsap.fromTo(f, { clipPath: "inset(0% 12% 0% 12%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: f, start: "top 95%", end: "center 55%", scrub: true } }); });
    /* El «+» de cada sección gira al llegar */
    gsap.utils.toArray(".cab-sec h2 > span").forEach(function (s) { gsap.fromTo(s, { rotation: -180, display: "inline-block" }, { rotation: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: s, start: "top 90%" } }); });
    /* Las filas de la carta se encienden de una en una */
    gsap.utils.toArray(".grupo").forEach(function (g) { gsap.from(g.querySelectorAll("li"), { opacity: 0, x: -16, duration: 0.7, ease: "expo.out", stagger: 0.05, scrollTrigger: { trigger: g, start: "top 85%" } }); });
    gsap.utils.toArray(".portada .boton-carta, .sec > .boton-carta").forEach(function (bt) { gsap.fromTo(bt, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: "back.out(2)", scrollTrigger: { trigger: bt, start: "top 95%" } }); });
    gsap.fromTo(".lead-txt, .cab > a, .cab > button", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", delay: 0.4, stagger: 0.05 });
    /* Fotos que se deslizan hacia arriba al entrar, una detrás de otra en cada rejilla */
    document.querySelectorAll("[data-desliza]:not([data-desliza=portada])").forEach(function (f) {
      var img = f.querySelector("img"), n = Array.prototype.indexOf.call(f.parentNode.children, f);
      gsap.timeline({ scrollTrigger: { trigger: f, start: "top 92%" } })
        .fromTo(f, { clipPath: "inset(100% 0% 0% 0%)", y: 50 }, { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 1.2, ease: "expo.out", delay: (n % 3) * 0.08 })
        .fromTo(img, { scale: 1.16 }, { scale: 1, duration: 1.5, ease: "expo.out" }, "<");
    });
    /* Títulos de sección letra a letra */
    document.querySelectorAll("[data-titulo]").forEach(function (h) {
      var s = SplitText.create(h, { type: "words,chars", mask: "chars" });
      gsap.from(s.chars, { yPercent: 112, duration: 1, ease: "expo.out", stagger: 0.03, scrollTrigger: { trigger: h, start: "top 90%" } });
    });
    /* HAUSPO con sus letras: en la portada entra letra a letra; en el pie, al llegar */
    gsap.from(".pie-svg .l", { y: 720, duration: 1.2, ease: "expo.out", stagger: 0.07, scrollTrigger: { trigger: ".pie-gigante", start: "top 95%" } });
    raiz.classList.remove("pre");
  });
})();
