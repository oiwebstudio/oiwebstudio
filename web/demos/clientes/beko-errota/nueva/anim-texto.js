/* Animaciones de texto con el scroll — OI Studio (se copia junto a cada web).
   Requiere GSAP 3.13 + ScrollTrigger + SplitText cargados antes. Con «reducir movimiento» o sin GSAP no hace nada:
   todo se ve quieto y completo (no hay estados ocultos en el CSS).
   Atributos:
     data-letras        titular que sube letra a letra al cargar (portada)
     data-lineas        titular que sale línea a línea al entrar en pantalla
     data-enciende      párrafo que se enciende palabra a palabra mientras se lee
     data-escalonado    contenedor cuyos hijos entran uno detrás de otro
     data-pista="35"    banda de texto que corre de lado con el scroll (porcentaje)
     data-parallax="15" elemento que se queda atrás al bajar */
(function () {
  if (!window.gsap || !window.ScrollTrigger || !window.SplitText || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  document.fonts.ready.then(function () {
    document.querySelectorAll("[data-letras]").forEach(function (h) {
      var s = SplitText.create(h, { type: "words,chars,lines", mask: "lines" }); /* words: que no parta palabras al hacer salto de línea */
      gsap.from(s.chars, { yPercent: 110, duration: 1.15, ease: "expo.out", stagger: 0.028, delay: 0.1 });
    });
    document.querySelectorAll("[data-lineas]").forEach(function (h) {
      SplitText.create(h, { type: "lines", mask: "lines", autoSplit: true, onSplit: function (s) { /* se vuelve a partir si cambia el ancho */
        return gsap.from(s.lines, { yPercent: 105, duration: 1.1, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: h, start: "top 86%" } });
      } });
    });
    document.querySelectorAll("[data-enciende]").forEach(function (p) {
      var w = SplitText.create(p, { type: "words", aria: "none" });
      gsap.fromTo(w.words, { opacity: 0.16 }, { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: p, start: "top 85%", end: "bottom 45%", scrub: true } });
    });
    document.querySelectorAll("[data-escalonado]").forEach(function (g) {
      gsap.from(g.children, { y: 28, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: g, start: "top 88%" } });
    });
    document.querySelectorAll("[data-pista]").forEach(function (p) {
      gsap.fromTo(p, { xPercent: 0 }, { xPercent: -(+p.dataset.pista || 35), ease: "none", scrollTrigger: { trigger: p.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });
    document.querySelectorAll("[data-parallax]").forEach(function (e) {
      gsap.to(e, { yPercent: -(+e.dataset.parallax || 15), ease: "none", scrollTrigger: { trigger: e.closest("section,header") || e, start: "top top", end: "bottom top", scrub: true } });
    });
  });
})();

/* Barra fija del móvil: aparece cuando la portada ya no se ve; oculta, no recibe el foco. */
(function () {
  var m = document.querySelector("[data-barra-movil]"), p = document.querySelector("[data-portada]");
  if (!m) return;
  if (!p || !("IntersectionObserver" in window)) { m.classList.add("on"); return; }
  new IntersectionObserver(function (e) { m.classList.toggle("on", !e[0].isIntersecting); }).observe(p);
})();
