/* Croquis del mapa: se dibuja al entrar en pantalla. Sin JS o con «reducir movimiento» se ve entero y quieto. */
(function () {
  var s = document.querySelector(".croquis");
  if (!s || matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  s.classList.add("pre");
  var io = new IntersectionObserver(function (e) {
    if (!e[0].isIntersecting) return;
    io.disconnect();
    requestAnimationFrame(function () { requestAnimationFrame(function () { s.classList.remove("pre"); s.classList.add("on"); }); });
  }, { threshold: 0.25 });
  io.observe(s);
})();
