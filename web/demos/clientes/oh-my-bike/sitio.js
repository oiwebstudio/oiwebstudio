/* Oh My Bike! (muestra): menú móvil, pestañas de tarifas, filtro y carrito de la tienda, «ahora abierto», formulario de prueba.
   Sin JavaScript todo se ve: las tres tarifas salen una debajo de otra, todos los productos visibles y el menú es la barra de arriba. */
(function () {
  var b = document.querySelector(".burger"), m = document.getElementById("menu");
  if (b && m) {
    b.addEventListener("click", function () { var on = m.classList.toggle("on"); b.setAttribute("aria-expanded", on); b.textContent = on ? "Cerrar" : "Menú"; });
    m.addEventListener("click", function (e) { if (e.target.closest("a")) { m.classList.remove("on"); b.setAttribute("aria-expanded", "false"); b.textContent = "Menú"; } });
  }

  /* pestañas de alquiler */
  var tabs = document.querySelector(".tabs"), panels = document.querySelectorAll(".panel");
  if (tabs && panels.length) {
    panels.forEach(function (p, i) {
      var t = document.createElement("button");
      t.type = "button"; t.className = "tab"; t.setAttribute("role", "tab"); t.id = "t-" + p.id;
      t.setAttribute("aria-controls", p.id); t.textContent = p.dataset.titulo;
      p.setAttribute("role", "tabpanel"); p.setAttribute("aria-labelledby", t.id);
      tabs.appendChild(t);
    });
    var bt = tabs.querySelectorAll(".tab");
    var pon = function (i) { bt.forEach(function (t, j) { t.setAttribute("aria-selected", i === j); t.tabIndex = i === j ? 0 : -1; }); panels.forEach(function (p, j) { p.hidden = i !== j; }); };
    bt.forEach(function (t, i) {
      t.addEventListener("click", function () { pon(i); });
      t.addEventListener("keydown", function (e) {
        var k = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!k) return;
        var n = (i + k + bt.length) % bt.length; pon(n); bt[n].focus(); e.preventDefault();
      });
    });
    pon(0);
  }

  /* tienda: filtro y carrito de prueba */
  var g = document.querySelector("[data-rejilla]");
  if (g) {
    var fs = document.querySelectorAll(".cat"), vac = document.querySelector("[data-vacio]");
    fs.forEach(function (x) {
      x.addEventListener("click", function () {
        var f = x.dataset.f, n = 0;
        fs.forEach(function (y) { y.setAttribute("aria-pressed", y === x); });
        g.querySelectorAll(".prod").forEach(function (p) { var ok = f === "todo" || p.dataset.cat === f; p.hidden = !ok; if (ok) n++; });
        if (vac) vac.hidden = n > 0;
      });
    });
    var c = document.getElementById("cuenta"), q = 0;
    g.addEventListener("click", function (e) {
      var a = e.target.closest(".anadir"); if (!a || !c) return;
      q++; c.textContent = q; a.textContent = "Añadida ✓"; setTimeout(function () { a.textContent = "Añadir al carrito"; }, 1400);
    });
  }

  /* ahora abierto (hora de Madrid, horario habitual) */
  var est = document.querySelector("[data-estado]");
  if (est && window.Intl) {
    try {
      var f = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date()), o = {};
      f.forEach(function (p) { o[p.type] = p.value; });
      var min = (+o.hour % 24) * 60 + +o.minute, d = o.weekday, ab = false;
      if (/Mon|Tue|Wed|Thu|Fri/.test(d)) ab = (min >= 600 && min < 810) || (min >= 960 && min < 1170);
      else if (d === "Sat") ab = min >= 630 && min < 810;
      est.classList.toggle("on", ab);
      est.lastElementChild.textContent = ab ? "Abierto ahora (horario habitual)" : "Cerrado ahora (horario habitual)";
    } catch (e) {}
  }

  /* formulario de la muestra: no envía nada */
  var fm = document.querySelector("[data-form]");
  if (fm) fm.addEventListener("submit", function (e) {
    e.preventDefault();
    fm.querySelector("[data-ok]").textContent = "Muestra: en la web final este mensaje llega a ohmybike@hotmail.com.";
  });
})();

/* movimiento de la portada y cifras que cuentan (con «reducir movimiento» o sin GSAP todo queda quieto y completo) */
(function () {
  if (!window.gsap || !window.ScrollTrigger || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.registerPlugin(ScrollTrigger);
  var b = document.querySelector(".bici3d"), w = document.querySelector(".palabra"), h = document.querySelector(".portada");
  if (b && h) {
    gsap.from(b, { x: -140, opacity: 0, duration: 1.5, ease: "expo.out", delay: 0.25 });
    gsap.to(b, { y: 70, ease: "none", scrollTrigger: { trigger: h, start: "top top", end: "bottom top", scrub: true } });
    if (w) gsap.to(w, { y: -50, ease: "none", scrollTrigger: { trigger: h, start: "top top", end: "bottom top", scrub: true } });
  }
  var im = document.querySelector(".taller__foto img");
  if (im) gsap.from(im, { clipPath: "inset(100% 0 0 0)", scale: 1.12, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: im, start: "top 85%" } });
  document.querySelectorAll("[data-cuenta]").forEach(function (e) {
    var t = e.dataset.cuenta, o = { v: 0 }, fin = +t;
    gsap.to(o, { v: fin, duration: 1.6, ease: "power2.out", scrollTrigger: { trigger: e, start: "top 90%", once: true }, onUpdate: function () { e.textContent = Math.round(o.v); } });
  });
})();

/* barra fija que se vuelve blanca, sección activa y «preguntar por esta bici» */
(function () {
  var nav = document.querySelector(".nav");
  if (nav) {
    var al = function () { nav.classList.toggle("solid", window.scrollY > 40); };
    al(); window.addEventListener("scroll", al, { passive: true });
    var enl = {}; nav.querySelectorAll("ul a").forEach(function (a) { enl[a.getAttribute("href")] = a; });
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { var a = enl["#" + e.target.id]; if (a) { if (e.isIntersecting) { Object.keys(enl).forEach(function (k) { enl[k].removeAttribute("aria-current"); }); a.setAttribute("aria-current", "true"); } } });
      }, { rootMargin: "-45% 0px -50% 0px" });
      Object.keys(enl).forEach(function (k) { var s = document.querySelector(k); if (s) io.observe(s); });
    }
  }
  var f = document.querySelector("[data-form]");
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-bici]"); if (!a || !f) return;
    f.querySelector("#f-t").value = "Comprar una bici";
    var m = f.querySelector("#f-m"); m.value = "Hola, me interesa la " + a.dataset.bici + ". ¿Está disponible? ¿Puedo probarla?";
    setTimeout(function () { m.focus({ preventScroll: true }); }, 700);
  });
})();
