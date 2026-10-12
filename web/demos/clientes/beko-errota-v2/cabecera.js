/* Beko Errota · menú del móvil, galerías que se deslizan solas en el móvil y una entrada suave de las fotos.
   Sin JS (o con «reducir movimiento») todo se ve completo y los enlaces funcionan. */
(function () {
  var quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;

  var b = document.querySelector(".top__burger"), m = document.getElementById("menu-m");
  if (b && m) {
    var cerrar = function () { m.hidden = true; b.setAttribute("aria-expanded", "false"); b.textContent = "Menú"; document.body.classList.remove("menu-abierto"); };
    b.addEventListener("click", function () {
      var abrir = m.hidden;
      m.hidden = !abrir; b.setAttribute("aria-expanded", abrir ? "true" : "false"); b.textContent = abrir ? "Cerrar" : "Menú";
      document.body.classList.toggle("menu-abierto", abrir);
    });
    addEventListener("keydown", function (e) { if (e.key === "Escape" && !m.hidden) { cerrar(); b.focus(); } });
    m.addEventListener("click", function (e) { if (e.target.closest("a")) cerrar(); });
    addEventListener("resize", function () { if (innerWidth > 1000 && !m.hidden) cerrar(); });
  }

  if (quieto) return;

  /* galerías del móvil: se deslizan solas al bajar la página; si la persona las toca, manda su dedo */
  (function () {
    var gs = [].slice.call(document.querySelectorAll(".galeria"));
    if (!gs.length) return;
    var mano = new Map(), pend = false;
    gs.forEach(function (g) { g.addEventListener("touchstart", function () { mano.set(g, true); }, { passive: true }); });
    function mover() {
      pend = false; var vh = innerHeight;
      gs.forEach(function (g) {
        var max = g.scrollWidth - g.clientWidth; if (max < 4) return;
        var r = g.getBoundingClientRect(), p = (vh * 0.92 - r.top) / (vh * 0.62);
        if (p <= 0 || p >= 1) { g.style.scrollSnapType = ""; mano.set(g, false); g.scrollLeft = p >= 1 ? max : 0; return; }
        if (mano.get(g)) return;
        g.style.scrollSnapType = "none"; g.scrollLeft = p * max;
      });
    }
    addEventListener("scroll", function () { if (!pend) { pend = true; requestAnimationFrame(mover); } }, { passive: true });
    addEventListener("resize", mover); mover();
  })();

  /* las fotos entran con un fundido corto */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray(".intro-v img,.carta-v img,.fotos-v img,.bodas-v img,.prod-v img,.foto-marco img,.tarjeta img,.platos img").forEach(function (el) {
      gsap.from(el, { opacity: 0, y: 24, duration: 1.1, ease: "expo.out", clearProps: "transform,opacity", scrollTrigger: { trigger: el, start: "top 92%" } });
    });
    gsap.utils.toArray(".ficha,.filas").forEach(function (f) { gsap.from(f.children, { y: 16, opacity: 0, duration: 0.8, ease: "expo.out", stagger: 0.07, scrollTrigger: { trigger: f, start: "top 88%" } }); });
    gsap.utils.toArray(".cat").forEach(function (c) { gsap.from(c, { y: 30, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: c, start: "top 92%" } }); });
    addEventListener("load", function () { ScrollTrigger.refresh(); });
  }
})();
