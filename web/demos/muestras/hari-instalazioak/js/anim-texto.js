/* Animaciones de texto — OI Studio (copia de _local/material/plantillas/anim-texto.js adaptada a HARI, 8/11/2026; misma base que TORLOJU v2).
   Cambios frente a la plantilla: el titular de la portada no usa data-letras (entra con CSS desde el primer pintado,
   ver «animaciones-sin-parpadeo»); data-enciende va por tiempo al asomar, no atado al scroll; data-escalonado apaga las
   transiciones de CSS mientras entra (si no, va a tirones).
   Requiere GSAP 3.13 + ScrollTrigger + SplitText. Con «reducir movimiento» o sin GSAP no hace nada: todo quieto y visible.
     data-lineas        titular que sale línea a línea al entrar en pantalla
     data-enciende      párrafo que se enciende palabra a palabra al asomar
     data-escalonado    contenedor cuyos hijos entran uno detrás de otro
     data-pista="35"    texto que corre de lado con el scroll (porcentaje); data-pista-media lo limita a una condición;
                        data-pista="fin" arranca en 0 y corre lo justo para que se vea hasta la última palabra */
(function () {
  if (!window.gsap || !window.ScrollTrigger || !window.SplitText || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  document.fonts.ready.then(function () {
    document.querySelectorAll("[data-lineas]").forEach(function (h) {
      var s = SplitText.create(h, { type: "lines", mask: "lines" });
      gsap.from(s.lines, { yPercent: 105, duration: 1.2, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: h, start: "top 88%", once: true } });
    });
    document.querySelectorAll("[data-enciende]").forEach(function (p) {
      var w = SplitText.create(p, { type: "words", aria: "none" });
      gsap.fromTo(w.words, { opacity: 0.18 }, { opacity: 1, duration: 0.6, ease: "power1.out", stagger: 0.045, scrollTrigger: { trigger: p, start: "top 80%", once: true } });
    });
    document.querySelectorAll("[data-escalonado]").forEach(function (g) {
      var hijos = Array.prototype.slice.call(g.children);
      hijos.forEach(function (h) { h.style.transition = "none"; });
      gsap.from(hijos, {
        y: 40, opacity: 0, duration: 1.1, ease: "power3.out", stagger: 0.09, clearProps: "transform,opacity",
        scrollTrigger: { trigger: g, start: "top 86%", once: true },
        onComplete: function () { hijos.forEach(function (h) { h.style.transition = ""; }); }
      });
    });
    /* data-pista-media="(…)": solo corre con esa condición (en HARI, la palabra de «¿Qué te pasa?» se queda quieta en el ordenador,
       donde son las tarjetas las que pasan por delante, como en la referencia) */
    var mm = gsap.matchMedia();
    document.querySelectorAll("[data-pista]").forEach(function (p) {
      mm.add(p.getAttribute("data-pista-media") || "all", function () {
        if (p.dataset.pista === "fin") {
          /* data-pista="fin" (HARI, 8/11): entra quieta en 0, con el principio entero; corre cuando ya se ve del todo y se para
             justo cuando asoma la última palabra entera por la derecha (si cabe toda, solo se desliza un poco) */
          var caja = p.parentElement;
          var falta = function () {
            var pad = parseFloat(getComputedStyle(caja).paddingLeft) || 0;
            return Math.max(p.offsetWidth + 2 * pad - caja.clientWidth, p.offsetWidth * 0.05);
          };
          gsap.fromTo(p, { x: 0 }, { x: function () { return -falta(); }, ease: "none", scrollTrigger: { trigger: caja, start: "top 75%", end: "top 20%", scrub: 0.6, invalidateOnRefresh: true } });
          return;
        }
        gsap.fromTo(p, { xPercent: 6 }, { xPercent: -(+p.dataset.pista || 35), ease: "none", scrollTrigger: { trigger: p.parentElement, start: "top bottom", end: "bottom top", scrub: 0.6 } });
      });
    });
  });
})();

/* Barra fija del móvil: aparece cuando la portada ya no se ve. */
(function () {
  var m = document.querySelector("[data-barra-movil]"), p = document.querySelector("[data-portada]");
  if (!m) return;
  if (!p || !("IntersectionObserver" in window)) { m.classList.add("on"); return; }
  new IntersectionObserver(function (e) { m.classList.toggle("on", !e[0].isIntersecting); }).observe(p);
})();
