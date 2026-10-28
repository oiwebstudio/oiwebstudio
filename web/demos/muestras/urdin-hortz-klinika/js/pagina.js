/* URDIN Hortz Klinika — muestra de OI Studio. Lo que se toca: menú del móvil, tratamientos desplegables (con foto
   que acompaña al cursor solo con ratón), cuota de ejemplo, horario con el día de hoy, y la entrada de los paneles.
   Sin JavaScript todo se ve abierto y completo; con «reducir movimiento», nada se mueve. */
(function () {
  var quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var raton = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* Menú del móvil */
  var cab = document.getElementById("cab"), bm = cab && cab.querySelector(".cab__menu");
  if (bm) {
    bm.addEventListener("click", function () {
      var abierto = cab.classList.toggle("abierta");
      bm.setAttribute("aria-expanded", abierto ? "true" : "false");
      bm.textContent = abierto ? bm.dataset.cerrar : bm.dataset.abrir;
    });
    cab.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () { cab.classList.remove("abierta"); bm.setAttribute("aria-expanded", "false"); bm.textContent = bm.dataset.abrir; });
    });
  }

  /* Tratamientos: se cierran al cargar y se abren al tocar */
  var filas = document.querySelectorAll(".trat__fila");
  filas.forEach(function (f, i) {
    var b = f.querySelector(".trat__btn"), p = f.querySelector(".trat__panel");
    var abrir = function (si) {
      b.setAttribute("aria-expanded", si ? "true" : "false");
      p.hidden = !si;
      if (si && window.gsap && !quieto) gsap.from(p.children, { y: 16, opacity: 0, duration: 0.6, ease: "expo.out", stagger: 0.06 });
    };
    abrir(i === 0);
    b.addEventListener("click", function () { abrir(b.getAttribute("aria-expanded") !== "true"); });
  });

  /* La foto del tratamiento acompaña al cursor por la lista (solo con ratón) */
  var vista = document.querySelector(".trat__vista");
  if (vista && raton && !quieto) {
    var vimg = vista.querySelector("img"), x = 0, y = 0, cx = 0, cy = 0, vivo = false;
    var bucle = function () {
      cx += (x - cx) * 0.16; cy += (y - cy) * 0.16;
      vista.style.transform = "translate(" + (cx + 26) + "px," + (cy - 90) + "px)";
      if (vista.classList.contains("on") || Math.abs(x - cx) > 0.5) requestAnimationFrame(bucle); else vivo = false;
    };
    filas.forEach(function (f) {
      var b = f.querySelector(".trat__btn"), im = f.querySelector(".trat__panel img");
      b.addEventListener("mouseenter", function (e) {
        if (b.getAttribute("aria-expanded") === "true") return;
        vimg.src = im.currentSrc || im.src; vimg.srcset = "";
        if (!vivo) { cx = x = e.clientX; cy = y = e.clientY; }
        vista.classList.add("on");
        if (!vivo) { vivo = true; requestAnimationFrame(bucle); }
      });
      b.addEventListener("mouseleave", function () { vista.classList.remove("on"); });
      b.addEventListener("click", function () { vista.classList.remove("on"); });
    });
    addEventListener("mousemove", function (e) { x = e.clientX; y = e.clientY; }, { passive: true });
    /* que la foto ya esté descargada cuando pase el ratón */
    setTimeout(function () { filas.forEach(function (f) { var im = f.querySelector(".trat__panel img"); if (im) { var pre = new Image(); pre.src = im.currentSrc || im.src; } }); }, 2500);
  }

  /* Cuota de ejemplo */
  var fin = document.getElementById("fin");
  if (fin) {
    var eur = function (n, dec) { return n.toLocaleString("es-ES", { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: "always" }) + " €"; };
    var calcula = function () {
      var t = fin.querySelector("input[name=fin-t]:checked"), m = fin.querySelector("input[name=fin-m]:checked");
      var imp = +t.value, n = +m.value;
      document.getElementById("fin-nombre").textContent = t.dataset.nombre;
      document.getElementById("fin-importe").textContent = eur(imp, 0);
      document.getElementById("fin-n").textContent = n;
      var c = document.getElementById("fin-cuota");
      c.textContent = eur(Math.round(imp / n * 100) / 100, 2);
      if (window.gsap && !quieto) gsap.fromTo(c, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "expo.out" });
    };
    fin.addEventListener("change", calcula); calcula();
  }

  /* Horario: el día de hoy y si ahora está abierto (hora de aquí) */
  var est = document.getElementById("estado");
  if (est) {
    var ahora = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Madrid" }));
    var d = ahora.getDay(), min = ahora.getHours() * 60 + ahora.getMinutes();
    var hoyTxt = document.querySelector(".ticket__hoy").dataset.hoy;
    document.querySelectorAll(".ticket li").forEach(function (li) {
      if (li.dataset.dias.split(",").indexOf(String(d)) < 0) return;
      li.setAttribute("aria-current", "date");
      var s = document.createElement("span"); s.className = "ticket__hoytxt"; s.textContent = " · " + hoyTxt;
      li.querySelector(".ticket__d").appendChild(s);
    });
    var franjas = { 1: [[540, 810], [900, 1200]], 2: [[540, 810], [900, 1200]], 3: [[540, 810], [900, 1200]], 4: [[540, 810], [900, 1200]], 5: [[540, 900]] };
    var abierto = (franjas[d] || []).some(function (f) { return min >= f[0] && min < f[1]; });
    est.textContent = abierto ? est.dataset.abierto : est.dataset.cerrado;
  }

  /* Paneles que entran al bajar (24/10, Oier: «animaciones de los paneles siempre») */
  if (!window.gsap || !window.ScrollTrigger || quieto) return;
  gsap.registerPlugin(ScrollTrigger);
  document.fonts.ready.then(function () {
    /* portada: el panel menta crece desde la derecha, la foto se destapa y se asienta, y entran las fichas */
    var tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    var marco = document.querySelector(".portada__marco");
    tl.fromTo(marco, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut", clearProps: "clipPath" }, 0.1)
      .fromTo(marco.querySelector("img"), { scale: 1.16 }, { scale: 1, duration: 1.9 }, 0.1)
      .from(".visita", { y: 40, opacity: 0, duration: 1 }, 0.95)
      .from(".portada__pie", { x: 30, opacity: 0, duration: 1 }, 1.1)
      .from(".portada__p, .portada .botones, .datos", { y: 22, opacity: 0, duration: 1, stagger: 0.09 }, 0.55);

    var abre = { clipPath: "inset(12% 5% 0% 5%)", y: 40, opacity: 0 };
    var cerrado = { clipPath: "inset(0% 0% 0% 0%)", y: 0, opacity: 1, duration: 1.1, ease: "expo.out", clearProps: "clipPath" };
    /* fotos que se destapan y se asientan */
    document.querySelectorAll(".revela").forEach(function (r) {
      var im = r.querySelector("img");
      gsap.fromTo(r, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut", clearProps: "clipPath", scrollTrigger: { trigger: r, start: "top 88%" } });
      if (im) gsap.fromTo(im, { scale: 1.12 }, { scale: 1, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: r, start: "top 88%" } });
    });
    /* bloque de urgencias: se abre desde un recorte */
    gsap.fromTo(".urg__caja", { clipPath: "inset(6% 4% 6% 4% round 18px)" }, { clipPath: "inset(0% 0% 0% 0% round 4px)", duration: 1.2, ease: "expo.out", clearProps: "clipPath", scrollTrigger: { trigger: ".urg", start: "top 85%" } });
    gsap.from(".urg__der > *", { x: 40, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: ".urg__caja", start: "top 70%" } });
    /* presupuesto y ticket suben como un papel */
    [".presu", ".ticket"].forEach(function (s) {
      gsap.fromTo(s, abre, Object.assign({ scrollTrigger: { trigger: s, start: "top 88%" } }, cerrado));
    });
    gsap.from(".fin__form fieldset", { y: 26, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: ".fin__form", start: "top 88%" } });
    /* columnas de contacto: desde los lados */
    gsap.from(".contacto__cita", { x: -40, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".contacto", start: "top 75%" } });
    gsap.from(".llegar", { x: 40, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".llegar", start: "top 85%" } });
    /* cabezas de sección: el texto lateral entra después del título */
    gsap.utils.toArray(".cabeza__lado").forEach(function (c) { gsap.from(c, { y: 24, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: c, start: "top 88%" } }); });
  });
})();
