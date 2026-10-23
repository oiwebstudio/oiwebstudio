/* Cabecera: se vuelve sólida al bajar, menú de móvil y carrusel de la portada. Sin JS todo se ve y funciona (enlaces normales). */
(function () {
  var cab = document.querySelector("[data-cab]"), aviso = document.querySelector(".aviso");
  var quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (cab) {
    var pos = function () {
      var h = aviso ? aviso.getBoundingClientRect().bottom : 0;
      cab.style.top = Math.max(0, h) + "px";
      cab.classList.toggle("solida", h <= 0 && scrollY > 80);
    };
    pos(); addEventListener("scroll", pos, { passive: true }); addEventListener("resize", pos);
  }
  var b = document.querySelector(".cab__burger"), m = document.getElementById("menu-m");
  if (b && m) {
    var cerrar = function () { m.hidden = true; b.setAttribute("aria-expanded", "false"); b.setAttribute("aria-label", "Abrir el menú"); document.body.classList.remove("menu-abierto"); };
    b.addEventListener("click", function () {
      var abrir = m.hidden;
      m.hidden = !abrir; b.setAttribute("aria-expanded", abrir); b.setAttribute("aria-label", abrir ? "Cerrar el menú" : "Abrir el menú");
      document.body.classList.toggle("menu-abierto", abrir);
      if (abrir) m.querySelector("a").focus();
    });
    addEventListener("keydown", function (e) { if (e.key === "Escape" && !m.hidden) { cerrar(); b.focus(); } });
    m.addEventListener("click", function (e) { if (e.target.closest("a")) cerrar(); });
  }
  var car = document.querySelector("[data-slides]");
  if (car) {
    var fotos = [].slice.call(car.querySelectorAll(".slides img")), i = 0, t;
    var ir = function (n) { fotos[i].classList.remove("on"); i = (n + fotos.length) % fotos.length; fotos[i].classList.add("on"); };
    var auto = function () { clearInterval(t); if (!quieto) t = setInterval(function () { ir(i + 1); }, 6500); };
    /* un clic en la foto pasa a la siguiente (salvo en botones y enlaces) */
    car.addEventListener("click", function (e) { if (e.target.closest("a,button")) return; ir(i + 1); auto(); });
    auto();
  }
})();

/* Entradas de las fotos: aparecen con un zoom suave al llegar a ellas. Sin GSAP o con «reducir movimiento», se ven quietas. */
(function () {
  if (!window.gsap || !window.ScrollTrigger || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.utils.toArray(".collage .grande,.collage .chica,.tarj-osc .im img,.platos img,.galeria .tarjeta img,.foto-marco img").forEach(function (el) {
    gsap.from(el, { scale: 1.14, opacity: 0, duration: 1.5, ease: "expo.out", clearProps: "transform,opacity", scrollTrigger: { trigger: el, start: "top 92%" } });
  });
})();

/* Galerías del móvil: se deslizan solas hacia el lado al bajar la página. Si la persona las toca, manda su dedo. */
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var gs = [].slice.call(document.querySelectorAll(".galeria"));
  if (!gs.length) return;
  var mano = new Map(), pendiente = false;
  gs.forEach(function (g) {
    g.addEventListener("touchstart", function () { mano.set(g, true); }, { passive: true });
  });
  function mover() {
    pendiente = false;
    var vh = innerHeight;
    gs.forEach(function (g) {
      var max = g.scrollWidth - g.clientWidth;
      if (max < 4) return;
      var r = g.getBoundingClientRect();
      var p = (vh * 0.92 - r.top) / (vh * 0.62); /* 0 al asomar por abajo, 1 cuando la galería llega al tercio de arriba */
      if (p <= 0 || p >= 1) { g.style.scrollSnapType = ""; mano.set(g, false); if (p >= 1) g.scrollLeft = max; else g.scrollLeft = 0; return; }
      if (mano.get(g)) return;
      g.style.scrollSnapType = "none";
      g.scrollLeft = p * max;
    });
  }
  addEventListener("scroll", function () { if (!pendiente) { pendiente = true; requestAnimationFrame(mover); } }, { passive: true });
  addEventListener("resize", mover);
  mover();
})();
