/* TORLOJU · muestra de taller (OI Studio). Comportamiento y animaciones de paneles.
   Sin JS o con «reducir movimiento»: todo se ve quieto y completo; los formularios no envían nada (es una muestra). */
(function () {
  var T = JSON.parse(document.getElementById("textos").textContent);
  var lang = document.documentElement.lang === "eu" ? "eu" : "es";

  /* ---- hora de Tolosaldea (Europe/Madrid) ---- */
  function ahora() {
    try {
      var p = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
      var o = {}; p.forEach(function (x) { o[x.type] = x.value; });
      var d = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 }[o.weekday];
      return { dia: d, min: (+o.hour) * 60 + (+o.minute) };
    } catch (e) { var n = new Date(); return { dia: n.getDay(), min: n.getHours() * 60 + n.getMinutes() }; }
  }
  /* horario de ejemplo: L–V 8–13 y 15–19, S 9–13, D cerrado */
  var H = { 0: [], 1: [[480, 780], [900, 1140]], 2: [[480, 780], [900, 1140]], 3: [[480, 780], [900, 1140]], 4: [[480, 780], [900, 1140]], 5: [[480, 780], [900, 1140]], 6: [[540, 780]] };
  var hm = function (m) { return Math.floor(m / 60) + ":" + ("0" + (m % 60)).slice(-2); };
  var franjas = function (d) { return H[d].length ? H[d].map(function (f) { return hm(f[0]) + "–" + hm(f[1]); }).join(" " + T.y + " ") : T.cerrado; };
  var a = ahora();
  var abierto = H[a.dia].some(function (f) { return a.min >= f[0] && a.min < f[1]; });
  var est = document.querySelector("[data-estado]");
  if (est) {
    est.innerHTML = "<b>" + (abierto ? T.abierto_ahora : T.cerrado_ahora) + "</b><span>" + T.hoy + ": " + franjas(a.dia) + "</span>";
    est.classList.toggle("cerrado", !abierto);
    est.hidden = false;
  }
  var hoyLi = document.querySelector('.horario li[data-dia="' + a.dia + '"]');
  if (hoyLi) {
    hoyLi.setAttribute("aria-current", "date");
    var s = document.createElement("span"); s.className = "hoy"; s.textContent = T.hoy;
    hoyLi.querySelector(".dia").appendChild(s);
  }

  /* ---- menú del móvil ---- */
  var hb = document.querySelector(".hamb"), m = document.getElementById("desplegable");
  if (hb && m) {
    var cierra = function () { m.classList.remove("abierto"); hb.setAttribute("aria-expanded", "false"); hb.setAttribute("aria-label", T.menu); };
    hb.addEventListener("click", function () { var ab = m.classList.toggle("abierto"); hb.setAttribute("aria-expanded", ab); hb.setAttribute("aria-label", ab ? T.cerrar : T.menu); });
    m.addEventListener("click", function (e) { if (e.target.closest("a")) cierra(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && m.classList.contains("abierto")) { cierra(); hb.focus(); } });
  }

  /* ---- servicios: la foto fija cambia con la fila (ratón o foco) ---- */
  var filas = document.querySelectorAll(".serv"), fotos = document.querySelectorAll(".serv-foto picture");
  function activa(i) {
    filas.forEach(function (f, j) { f.classList.toggle("activa", j === i); });
    fotos.forEach(function (f, j) { f.classList.toggle("activa", j === i); });
  }
  filas.forEach(function (f, i) {
    f.addEventListener("mouseenter", function () { activa(i); });
    f.addEventListener("focusin", function () { activa(i); });
  });
  if (filas.length) activa(0);

  /* ---- «Pedir presupuesto» desde un servicio: marca lo que corresponde ---- */
  document.querySelectorAll("[data-marca]").forEach(function (l) {
    l.addEventListener("click", function () {
      var c = document.getElementById(l.dataset.marca);
      if (c) c.checked = true;
      var nota = document.getElementById("nota");
      if (nota && l.dataset.servicio && !nota.value) nota.value = l.dataset.servicio;
    });
  });

  /* ---- presupuesto (muestra: no envía nada) ---- */
  var fo = document.getElementById("form-orden");
  if (fo) {
    var r = fo.querySelector(".respuesta");
    var mensaje = function () {
      var q = [].slice.call(fo.querySelectorAll('input[name="que"]:checked')).map(function (c) { return c.nextElementSibling ? c.parentElement.textContent.trim() : c.value; });
      var l = [T.lab_matricula + ": " + (fo.matrikula.value || "—"), T.lab_modelo + ": " + (fo.modeloa.value || "—"), T.lab_que + " " + (q.join(", ") || "—")];
      if (fo.nota.value) l.push(fo.nota.value);
      return l.join("\n");
    };
    var wa = fo.querySelector(".enl-wa");
    if (wa) wa.addEventListener("click", function () { wa.href = "https://wa.me/34600000000?text=" + encodeURIComponent(mensaje()); });
    fo.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!fo.telefonoa.value.trim()) { r.textContent = T.falta_tel; fo.telefonoa.focus(); return; }
      r.textContent = T.demo_resp;
    });
  }

  /* ---- cita: los próximos días de taller ---- */
  var cd = document.querySelector("[data-dias]");
  if (cd) {
    var html = "", base = new Date(), n = 0, i = 1;
    while (n < 12 && i < 30) {
      var d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i); i++;
      if (d.getDay() === 0) continue;
      var id = "dia-" + n;
      var wd = T.dias[d.getDay()];
      var mo = T.meses[d.getMonth()];
      html += '<label class="opcion" for="' + id + '"><input type="radio" name="eguna" id="' + id + '" value="' + d.toISOString().slice(0, 10) + '" data-sabado="' + (d.getDay() === 6 ? 1 : 0) + '"><span><small>' + wd + '</small><b>' + d.getDate() + '</b><small>' + mo + '</small></span></label>';
      n++;
    }
    cd.innerHTML = html;
    cd.removeAttribute("aria-describedby");
    var tarde = document.getElementById("franja-2");
    cd.addEventListener("change", function (e) {
      var sab = e.target.dataset.sabado === "1";
      if (tarde) { tarde.disabled = sab; if (sab && tarde.checked) { tarde.checked = false; document.getElementById("franja-1").checked = true; } }
    });
  }
  var fc = document.getElementById("form-cita");
  if (fc) {
    var rc = fc.querySelector(".respuesta");
    fc.addEventListener("submit", function (e) {
      e.preventDefault();
      if (cd && !fc.querySelector('input[name="eguna"]:checked')) { rc.textContent = T.falta_dia; return; }
      if (!fc.querySelector("#tel-cita").value.trim()) { rc.textContent = T.falta_tel; fc.querySelector("#tel-cita").focus(); return; }
      rc.textContent = T.cita_resp;
    });
  }

  /* ---- barra del móvil: aparece cuando la portada ya no se ve ---- */
  var barra = document.querySelector("[data-barra-movil]"), portada = document.querySelector("[data-portada]");
  if (barra && portada && "IntersectionObserver" in window) {
    new IntersectionObserver(function (e) { barra.classList.toggle("on", !e[0].isIntersecting); }, { rootMargin: "0px 0px -40% 0px" }).observe(portada);
  } else if (barra) barra.classList.add("on");

  /* ---- animaciones de paneles (24/10 Oier: siempre) ---- */
  if (!window.gsap || !window.ScrollTrigger || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.registerPlugin(ScrollTrigger);
  var ease = "expo.out";
  document.fonts.ready.then(function () {
    /* portada: la foto se asienta y el texto sube */
    var pf = document.querySelector(".portada-foto img");
    if (pf) {
      gsap.fromTo(pf, { scale: 1.14 }, { scale: 1, duration: 1.8, ease: ease });
      gsap.to(pf, { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".portada", start: "top top", end: "bottom top", scrub: true } });
    }
    gsap.from(".portada-txt .estado, .portada-txt .lema, .portada-txt .info", { y: 26, opacity: 0, duration: 1, ease: ease, stagger: 0.08, delay: 0.35 });

    /* servicios: la foto fija se destapa; las miniaturas se asientan */
    var sf = document.querySelector(".serv-foto");
    if (sf && getComputedStyle(sf).display !== "none") {
      gsap.fromTo(sf, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut", clearProps: "clipPath", scrollTrigger: { trigger: ".serv-rej", start: "top 80%" } });
    }
    ScrollTrigger.batch(".serv-min", { start: "top 92%", once: true, onEnter: function (els) {
      gsap.fromTo(els, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "expo.inOut", stagger: 0.07, clearProps: "clipPath" });
      els.forEach(function (e) { var im = e.querySelector("img"); if (im) gsap.fromTo(im, { scale: 1.2 }, { scale: 1, duration: 1.4, ease: ease }); });
    } });

    /* la orden de trabajo se abre desde un recorte */
    var orden = document.querySelector(".orden");
    if (orden) {
      gsap.fromTo(orden, { clipPath: "inset(12% 5% 0% 5%)", y: 50, opacity: 0 }, { clipPath: "inset(0% 0% 0% 0%)", y: 0, opacity: 1, duration: 1.1, ease: ease, clearProps: "clipPath", scrollTrigger: { trigger: orden, start: "top 88%" } });
      gsap.from(".placa", { x: -40, opacity: 0, duration: 1, ease: ease, delay: 0.25, scrollTrigger: { trigger: orden, start: "top 88%" } });
      gsap.from(".marcas .marca", { y: 16, opacity: 0, duration: 0.7, ease: ease, stagger: 0.05, scrollTrigger: { trigger: ".marcas", start: "top 90%" } });
    }

    /* cita: la foto entra desde la derecha y los días uno detrás de otro */
    var cf = document.querySelector(".cita-foto");
    if (cf) {
      gsap.fromTo(cf, { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut", clearProps: "clipPath", scrollTrigger: { trigger: ".cita .rej", start: "top 82%" } });
      gsap.fromTo(cf.querySelector("img"), { scale: 1.18 }, { scale: 1, duration: 1.8, ease: ease, scrollTrigger: { trigger: ".cita .rej", start: "top 82%" } });
    }
    gsap.from(".dias .opcion", { y: 20, opacity: 0, duration: 0.7, ease: ease, stagger: 0.04, scrollTrigger: { trigger: ".dias", start: "top 92%" } });

    /* por qué: foto que se destapa y casillas que se marcan */
    var pq = document.querySelector(".porque-foto");
    if (pq) {
      gsap.fromTo(pq, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut", clearProps: "clipPath", scrollTrigger: { trigger: ".porque .rej", start: "top 80%" } });
      gsap.fromTo(pq.querySelector("img"), { scale: 1.16 }, { scale: 1, duration: 1.8, ease: ease, scrollTrigger: { trigger: ".porque .rej", start: "top 80%" } });
    }
    ScrollTrigger.batch(".checks li", { start: "top 90%", once: true, onEnter: function (els) {
      gsap.from(els, { x: 30, opacity: 0, duration: 0.9, ease: ease, stagger: 0.08 });
      els.forEach(function (li, k) { var c = li.querySelector(".caja svg"); if (c) gsap.fromTo(c, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power2.out", delay: 0.35 + k * 0.08, clearProps: "clipPath" }); });
    } });

    /* opiniones: la grande sube y las pequeñas entran detrás */
    gsap.from(".op-grande", { y: 40, opacity: 0, duration: 1.1, ease: ease, scrollTrigger: { trigger: ".op-grande", start: "top 88%" } });
    gsap.from(".op-pequenas blockquote", { y: 30, opacity: 0, duration: 1, ease: ease, stagger: 0.12, scrollTrigger: { trigger: ".op-pequenas", start: "top 88%" } });

    /* plano: la ruta se dibuja con el scroll y el punto aparece */
    var ruta = document.querySelector(".mapa .ruta");
    if (ruta) gsap.fromTo(ruta, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: ".mapa", start: "top 85%", end: "center 45%", scrub: 0.6 } });
    var punto = document.querySelector(".mapa .punto");
    if (punto) gsap.from(punto, { scale: 0.6, opacity: 0, transformOrigin: "50% 100%", duration: 0.8, ease: "back.out(2)", scrollTrigger: { trigger: ".mapa", start: "center 60%" } });
    gsap.from(".mapa", { y: 40, opacity: 0, duration: 1, ease: ease, scrollTrigger: { trigger: ".donde .rej", start: "top 85%" } });

    /* teléfono gigante: sube cifra a cifra */
    var tg = document.querySelector(".tel-gigante");
    if (tg && window.SplitText) {
      var st = SplitText.create(tg, { type: "chars", mask: "chars" });
      gsap.from(st.chars, { yPercent: 110, duration: 1, ease: ease, stagger: 0.03, scrollTrigger: { trigger: tg, start: "top 90%" } });
    }
    gsap.from(".con-botones", { y: 20, opacity: 0, duration: 0.8, ease: ease, scrollTrigger: { trigger: ".con-botones", start: "top 98%" } });

    /* pie: el nombre se descubre de izquierda a derecha */
    var pm = document.querySelector(".pie-marca");
    if (pm) gsap.fromTo(pm, { clipPath: "inset(-10% 100% -10% 0%)" }, { clipPath: "inset(-10% 0% -10% 0%)", duration: 1.4, ease: "power3.inOut", scrollTrigger: { trigger: pm, start: "top 95%" } });
  });
})();
