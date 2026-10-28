/* BIGUN (muestra de OI Studio): horario de hoy, foto de la carta que cambia con la categoría y animaciones de los paneles.
   Sin GSAP o con «reducir movimiento», todo quieto y visible: nada se oculta en el CSS. */
(function () {
  /* Horario: resalta el día de hoy (hora de aquí) */
  var d = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Madrid" })).getDay();
  var hoy = document.querySelector('#horario li[data-d="' + d + '"]');
  if (hoy) { hoy.classList.add("hoy"); hoy.setAttribute("aria-current", "date"); }

  /* Tratamientos (escritorio): la foto fija cambia con la categoría que se está leyendo, o al pasar el ratón */
  var fija = document.querySelector(".trat-fija");
  if (fija && "IntersectionObserver" in window) {
    var fotos = fija.querySelectorAll("picture[data-cat]");
    var poner = function (id) { fotos.forEach(function (p) { p.classList.toggle("activa", p.getAttribute("data-cat") === id); }); };
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) poner(e.target.id); }); }, { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll(".categoria").forEach(function (c) {
      io.observe(c);
      c.addEventListener("pointerenter", function (ev) { if (ev.pointerType === "mouse") poner(c.id); });
    });
  }

  if (!window.gsap || !window.ScrollTrigger || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.registerPlugin(ScrollTrigger);
  var E = "expo.out";

  document.fonts.ready.then(function () {
    /* Portada: la foto se asienta y se queda un poco atrás al bajar; la cabecera y el pie de portada entran después del nombre */
    var pf = document.querySelector("[data-foto-portada] img");
    if (pf) {
      gsap.fromTo(pf, { scale: 1.2 }, { scale: 1.1, duration: 1.9, ease: E }); /* se queda a 1,1 para que el parallax no destape el borde */
      gsap.to(pf, { yPercent: 4.5, ease: "none", scrollTrigger: { trigger: "[data-portada]", start: "top top", end: "bottom top", scrub: true } });
    }
    gsap.from(".cabecera .envoltura > *:not(.boton)", { y: -14, opacity: 0, duration: 0.9, ease: E, stagger: 0.06, delay: 0.35 });
    gsap.from(".cabecera .boton", { opacity: 0, duration: 0.9, ease: "power2.out", delay: 0.6 }); /* el botón tiene transición de transform en el CSS: solo fundido */
    gsap.from(".portada-pie > *", { y: 24, opacity: 0, duration: 1, ease: E, stagger: 0.1, delay: 0.55 });

    /* Fotos que se destapan de abajo arriba y se asientan (las que aún no se ven empiezan tapadas, desde aquí, no desde el CSS) */
    var alto = window.innerHeight;
    var revela = gsap.utils.toArray("[data-revela]").filter(function (el) { return el.getBoundingClientRect().top > alto * 0.9; });
    gsap.set(revela, { clipPath: "inset(100% 0% 0% 0%)" });
    ScrollTrigger.batch(revela, {
      start: "top 90%", once: true, onEnter: function (els) {
        gsap.to(els, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.25, ease: "expo.inOut", stagger: 0.12, clearProps: "clipPath" });
        els.forEach(function (el) { var im = el.querySelector("picture"); if (im) gsap.fromTo(im, { scale: 1.16 }, { scale: 1, duration: 1.9, ease: E, clearProps: "transform" }); });
      }
    });

    /* Títulos de las categorías de la carta y sus fotos del móvil */
    gsap.utils.toArray(".categoria").forEach(function (c) {
      gsap.from(c.querySelectorAll("h3, .categoria > p"), { x: -28, opacity: 0, duration: 0.9, ease: E, stagger: 0.08, scrollTrigger: { trigger: c, start: "top 85%" } });
      var fm = c.querySelector(".foto-movil");
      if (fm && getComputedStyle(fm).display !== "none") gsap.fromTo(fm, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut", clearProps: "clipPath", scrollTrigger: { trigger: c, start: "top 88%" } });
    });

    /* Bonos: la palabra de fondo corre de lado y la tarjeta regalo cae girando sobre la foto */
    gsap.fromTo("[data-palabra]", { xPercent: 9 }, { xPercent: -9, ease: "none", scrollTrigger: { trigger: ".bonos", start: "top bottom", end: "bottom top", scrub: true } });
    var tarjeta = document.querySelector("[data-tarjeta]");
    if (tarjeta) {
      gsap.from(tarjeta, { y: 90, rotation: 7, opacity: 0, duration: 1.5, ease: E, scrollTrigger: { trigger: tarjeta.parentElement, start: "top 75%" } });
      if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
        var zona = tarjeta.parentElement;
        zona.addEventListener("pointermove", function (e) {
          var r = zona.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(tarjeta, { rotation: -5 + x * 5, rotationY: x * 12, rotationX: -y * 10, transformPerspective: 900, duration: 0.7, ease: "power3.out" });
        });
        zona.addEventListener("pointerleave", function () { gsap.to(tarjeta, { rotation: -5, rotationY: 0, rotationX: 0, duration: 0.9, ease: "power3.out" }); });
      }
    }

    /* Mosaico: las fotos entran escalonadas desde un recorte */
    ScrollTrigger.batch(".mosaico li", {
      start: "top 90%", once: true, onEnter: function (els) {
        gsap.fromTo(els, { clipPath: "inset(14% 6% 0% 6%)", y: 46, opacity: 0 }, { clipPath: "inset(0% 0% 0% 0%)", y: 0, opacity: 1, duration: 1.1, ease: E, stagger: 0.09, clearProps: "clipPath" });
        els.forEach(function (li) { var im = li.querySelector("picture"); if (im) gsap.fromTo(im, { scale: 1.18 }, { scale: 1, duration: 1.7, ease: E, clearProps: "transform" }); });
      }
    });

    /* Opinión grande: sube con la máscara de sus líneas (la pone anim-texto en los h2; aquí, la cita) */
    gsap.from(".op-grande blockquote, .op-grande .firma", { y: 36, opacity: 0, duration: 1.1, ease: E, stagger: 0.12, scrollTrigger: { trigger: ".op-grande", start: "top 85%" } });

    /* Pide cita: la foto entra desde el lado y el texto detrás */
    gsap.from(".cita-texto > *", { y: 34, opacity: 0, duration: 1, ease: E, stagger: 0.08, scrollTrigger: { trigger: ".cita", start: "top 75%" } });

    /* Horario: el ticket sube un poco torcido y se endereza */
    gsap.from("[data-ticket]", { y: 60, rotation: -3, opacity: 0, duration: 1.2, ease: E, scrollTrigger: { trigger: "[data-ticket]", start: "top 90%" } });

    /* Croquis: las calles se dibujan con el scroll y luego aparece la zona del ejemplo */
    var cq = document.querySelector(".croquis");
    if (cq) {
      var trazos = cq.querySelectorAll(".calle path, .principal path, .rio path, .rio-mancha path");
      gsap.set(trazos, { strokeDasharray: 1, strokeDashoffset: 1 });
      var tl = gsap.timeline({ scrollTrigger: { trigger: ".croquis-caja", start: "top 80%", once: true } }); /* se dibuja de una vez (no con scrub): así nunca se queda a medias si se para el dedo */
      tl.to(cq.querySelectorAll(".rio-mancha path, .rio path"), { strokeDashoffset: 0, ease: "power2.inOut", duration: 1.2 }, 0)
        .to(cq.querySelectorAll(".principal path"), { strokeDashoffset: 0, ease: "power2.out", duration: 1.1 }, 0.1)
        .to(cq.querySelectorAll(".calle path"), { strokeDashoffset: 0, ease: "power2.out", duration: 1, stagger: { amount: 0.5 } }, 0.25);
      gsap.from(cq.querySelector(".zona-g"), { scale: 0, transformOrigin: "50% 50%", duration: 1, ease: "back.out(2.2)", scrollTrigger: { trigger: ".croquis-caja", start: "center 70%" } });
      gsap.from(cq.querySelector(".zona-etiqueta"), { opacity: 0, x: -14, duration: 0.7, delay: 0.35, ease: E, scrollTrigger: { trigger: ".croquis-caja", start: "center 70%" } });
    }

    /* Pie: el nombre sube desde su línea */
    gsap.fromTo(".pie-nombre", { yPercent: 45, clipPath: "inset(0% 0% 100% 0%)" }, { yPercent: 0, clipPath: "inset(0% 0% -10% 0%)", duration: 1.4, ease: E, scrollTrigger: { trigger: ".pie", start: "top 85%" } });
    gsap.from(".pie-col > div", { y: 28, opacity: 0, duration: 0.9, ease: E, stagger: 0.08, scrollTrigger: { trigger: ".pie-col", start: "top bottom" } });
  });
})();
