/* Animaciones de texto — OI Studio (copia de _local/material/plantillas/anim-texto.js, con la misma adaptación que TXILAR; usada en ILTZE 9/11/2026). El nombre de la portada no usa data-letras (entra con CSS desde el primer
   pintado, ver «animaciones-sin-parpadeo»); data-enciende va por tiempo al asomar, no atado al scroll.
   Requiere GSAP 3.13 + ScrollTrigger + SplitText. Con «reducir movimiento» o sin GSAP no hace nada: todo quieto y visible.
     data-lineas        titular que sale línea a línea al entrar en pantalla
     data-enciende      párrafo que se enciende palabra a palabra al asomar
     data-escalonado    contenedor cuyos hijos entran uno detrás de otro
     data-pista="35"    banda que corre de lado con el scroll (porcentaje); TXILAR ya no la lleva desde el 9/11
                        (la referencia no la tiene y el revisor pidió quitarla); se deja por si se vuelve a poner */
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
      gsap.fromTo(w.words, { opacity: 0.18 }, { opacity: 1, duration: 0.6, ease: "power1.out", stagger: 0.045, scrollTrigger: { trigger: p, start: "top 94%", once: true } });
    });
    document.querySelectorAll("[data-escalonado]").forEach(function (g) {
      gsap.from(g.children, { y: 26, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.07, clearProps: "transform,opacity", scrollTrigger: { trigger: g, start: "top 88%", once: true } });
    });
    document.querySelectorAll("[data-pista]").forEach(function (p) {
      gsap.fromTo(p, { xPercent: 0 }, { xPercent: -(+p.dataset.pista || 35), ease: "none", scrollTrigger: { trigger: p.parentElement, start: "top bottom", end: "bottom top", scrub: 0.6 } });
    });
  });
})();

