/* ORRAZKERA · movimiento propio de la muestra (lo de texto común va en anim-texto.js).
   - Menú del móvil y el día de hoy marcado en el horario (funcionan siempre).
   - Portada: el díptico se abre desde la costura y las fotos se asientan; el titular y el botón suben.
   - Paneles (Oier, 24/10: «animaciones de los paneles siempre»): servicios y equipo se destapan con recorte,
     la tira de trabajos corre de lado con el scroll, el ticket del horario entra de lado, el croquis se dibuja
     y la marca cae en su calle, las opiniones y el pie suben.
   Sin GSAP o con «reducir movimiento»: todo quieto y visible (en el CSS no hay nada oculto). */
(function () {
  // menú del móvil
  var b = document.querySelector(".cab-menu"), m = document.getElementById("menu");
  if (b && m) {
    var cerrar = function () { m.classList.remove("abierto"); b.setAttribute("aria-expanded", "false"); };
    b.addEventListener("click", function () { var a = m.classList.toggle("abierto"); b.setAttribute("aria-expanded", a ? "true" : "false"); });
    m.addEventListener("click", function (e) { if (e.target.closest("a")) cerrar(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && m.classList.contains("abierto")) { cerrar(); b.focus(); } });
  }
  // hoy, en el ticket del horario
  var hoy = document.querySelector('.dias [data-dia="' + new Date().getDay() + '"]');
  if (hoy) hoy.setAttribute("aria-current", "date");

  if (!window.gsap || !window.ScrollTrigger || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.registerPlugin(ScrollTrigger);
  var E = "expo.out";

  document.fonts.ready.then(function () {
    // portada
    var izq = document.querySelector(".pf-izq"), der = document.querySelector(".pf-der");
    if (izq && der) {
      gsap.fromTo(izq, { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut", delay: 0.15, clearProps: "clipPath" });
      gsap.fromTo(der, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut", delay: 0.15, clearProps: "clipPath" });
      gsap.fromTo(".pf img", { scale: 1.16 }, { scale: 1, duration: 2.4, ease: E, delay: 0.15 });
      gsap.fromTo(".portada-txt > *", { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: E, stagger: 0.1, delay: 1.0 });
    }
    gsap.fromTo(".cab li, .cab-movil > *", { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: E, stagger: 0.04, delay: 0.1 });

    // servicios y equipo: cada foto se destapa de abajo arriba y se asienta
    var destapa = function (sel, desde) {
      ScrollTrigger.batch(sel, { start: "top 88%", once: true, onEnter: function (els) {
        els.forEach(function (el, i) {
          var f = el.querySelector("figure"), im = el.querySelector("img"), tx = el.querySelectorAll("h3, p");
          gsap.fromTo(f, { clipPath: desde }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.25, ease: "expo.inOut", delay: i * 0.1, clearProps: "clipPath" });
          if (im) gsap.fromTo(im, { scale: 1.18 }, { scale: 1, duration: 1.9, ease: E, delay: i * 0.1 });
          gsap.fromTo(tx, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: E, stagger: 0.06, delay: 0.35 + i * 0.1 });
        });
      } });
    };
    destapa(".serv", "inset(100% 0% 0% 0%)");
    destapa(".eq", "inset(0% 0% 100% 0%)");
    gsap.fromTo(".centro", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: E, scrollTrigger: { trigger: ".centro", start: "top 92%" } });
    gsap.fromTo(".sobre-der .enlace-fuerte", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: E, scrollTrigger: { trigger: ".sobre-der .enlace-fuerte", start: "top 94%" } });

    // la tira de trabajos corre de lado con el scroll (sin JS, se desliza con el dedo)
    var marco = document.querySelector("[data-tira]");
    if (marco) {
      marco.classList.add("viva");
      var tira = marco.querySelector(".tira");
      var recorrido = function () { return -Math.max(0, tira.scrollWidth - marco.clientWidth + 2 * parseFloat(getComputedStyle(marco).paddingLeft)); };
      gsap.fromTo(tira, { x: 0 }, { x: recorrido, ease: "none", scrollTrigger: { trigger: ".trabajos", start: "top 85%", end: "bottom 15%", scrub: 0.5, invalidateOnRefresh: true } });
      gsap.fromTo(tira.children, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: E, stagger: 0.07, scrollTrigger: { trigger: marco, start: "top 90%" } });
    }

    // horario: el ticket entra de lado y los días se apuntan uno detrás de otro
    var ticket = document.querySelector("[data-ticket]");
    if (ticket) {
      gsap.fromTo(ticket, { x: -50, rotation: -1.5, opacity: 0 }, { x: 0, rotation: 0, opacity: 1, duration: 1.2, ease: E, scrollTrigger: { trigger: ticket, start: "top 85%" } });
      gsap.fromTo(ticket.querySelectorAll(".dias li"), { x: -16, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: E, stagger: 0.05, delay: 0.25, scrollTrigger: { trigger: ticket, start: "top 85%" } });
    }

    // croquis: las calles se dibujan, la calle Mayor la última, y la marca cae en su sitio
    var mapa = document.querySelector("[data-mapa]");
    if (mapa) {
      var st = { trigger: mapa, start: "top 80%" };
      gsap.fromTo(mapa.querySelectorAll(".calle path, .principal path, .tren path"), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: "power2.out", stagger: 0.002, scrollTrigger: st, clearProps: "strokeDasharray,strokeDashoffset" });
      gsap.fromTo(mapa.querySelectorAll(".rio path, .rio-mancha path"), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut", scrollTrigger: st, clearProps: "strokeDasharray,strokeDashoffset" });
      gsap.fromTo(mapa.querySelectorAll(".resaltada path"), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, ease: "power2.inOut", delay: 1, scrollTrigger: st, clearProps: "strokeDasharray,strokeDashoffset" });
      gsap.fromTo(mapa.querySelectorAll(".pin > *"), { y: -36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "back.out(1.6)", stagger: 0.05, delay: 1.6, scrollTrigger: st }); // los hijos: la .pin ya lleva su transform de posición
      gsap.fromTo(mapa.querySelectorAll(".etq"), { opacity: 0 }, { opacity: 1, duration: 0.8, ease: E, stagger: 0.1, delay: 1.3, scrollTrigger: st });
    }
    gsap.fromTo(".contacto", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: E, scrollTrigger: { trigger: ".contacto", start: "top 94%" } });

    // pie: el nombre sube letra a letra
    var pie = document.querySelector("[data-pie]");
    if (pie && window.SplitText) {
      var s = SplitText.create(pie, { type: "chars", mask: "chars" });
      gsap.fromTo(s.chars, { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: E, stagger: 0.035, scrollTrigger: { trigger: pie, start: "top 95%" } });
    }
  });
})();
