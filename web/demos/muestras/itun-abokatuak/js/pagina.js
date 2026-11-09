/* ITUN · lo que reacciona (OI Studio, 8/11/2026)
   · Menú del móvil.
   · Primera consulta sin llamar: eliges el asunto → salen sus papeles; marcas los que ya tienes, idioma y mañana o tarde →
     el mensaje se escribe solo («Escribiendo…») y los enlaces de WhatsApp y correo lo llevan dentro.
   · Asuntos que se apilan al bajar: el que se está leyendo, encendido; los demás, apagados (como la referencia).
   · Horario: abierto o cerrado según la hora real de Tolosa.
   · Entradas al asomar (por tiempo, no atadas al scroll): fotos que se abren de abajo arriba, filetes que se trazan y títulos
     que caen en ola letra a letra (animate(), como la referencia). Atado al scroll solo el paralaje de las fotos de fondo y las dos
     frases de la franja negra, que se separan del centro hacia los lados.
   Sin JS o con «reducir movimiento»: todo quieto y visible (nada se oculta en el CSS). */
(function () {
  var T = JSON.parse(document.getElementById("textos").textContent);
  var mov = !matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EASE = "cubic-bezier(.2,.75,.25,1)";
  var cada = function (l, fn) { Array.prototype.forEach.call(l, fn); };

  /* ---------- menú del móvil ---------- */
  var hamb = document.querySelector(".hamb"), menu = document.getElementById("menu-movil");
  function cerrar() { menu.hidden = true; hamb.setAttribute("aria-expanded", "false"); hamb.setAttribute("aria-label", T.abrir); document.body.classList.remove("menu-abierto"); }
  if (hamb && menu) {
    hamb.addEventListener("click", function () {
      if (menu.hidden) {
        menu.hidden = false; hamb.setAttribute("aria-expanded", "true"); hamb.setAttribute("aria-label", T.cerrar); document.body.classList.add("menu-abierto");
        if (mov && menu.animate) cada(menu.querySelectorAll("li, p"), function (el, i) { el.animate([{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }], { duration: 600, delay: 40 + i * 45, easing: EASE, fill: "backwards" }); });
      } else cerrar();
    });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) cerrar(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) { cerrar(); hamb.focus(); } });
  }

  /* ---------- primera consulta sin llamar ---------- */
  var f = document.querySelector("[data-consulta]");
  if (f) {
    var caja = f.querySelector("[data-mensaje]"), msgBox = f.querySelector(".mensaje"), wa = f.querySelector("[data-wa]"), mail = f.querySelector("[data-mail]");
    var val = function (n) { var i = f.querySelector('input[name="' + n + '"]:checked'); return i ? i.value : null; };
    var minus = function (s) { return s.charAt(0).toLowerCase() + s.slice(1); };
    var lineas = function () {
      var as = val("asunto"), docs = T.docs[as];
      var tengo = [], falta = [];
      cada(f.querySelectorAll('input[name="doc-' + as + '"]'), function (i) { (i.checked ? tengo : falta).push(docs[+i.value - 1]); });
      var l = [T.inicio[as]];
      if (tengo.length) { l.push(T.tengo + " " + tengo.map(minus).join("; ") + "."); if (falta.length) l.push(T.falta + " " + falta.map(minus).join("; ") + "."); }
      else l.push(T.nada);
      l.push(T[val("idioma")], T[val("franja")], T.gracias);
      return l;
    };
    var tEsc;
    var pintar = function (escribe) {
      var l = lineas(), texto = l.join("\n");
      wa.href = T.wa + "?text=" + encodeURIComponent(texto);
      mail.href = "mailto:" + T.mail + "?subject=" + encodeURIComponent(T.asunto_mail) + "&body=" + encodeURIComponent(texto);
      var poner = function () {
        var viejo = [].map.call(caja.children, function (p) { return p.textContent; });
        caja.textContent = "";
        l.forEach(function (x, i) {
          var p = document.createElement("p"); p.textContent = x; caja.appendChild(p);
          if (mov && p.animate && (escribe || viejo[i] !== x)) p.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 420, delay: escribe ? i * 70 : 0, easing: EASE, fill: "backwards" });
        });
        msgBox.classList.remove("escribe");
      };
      clearTimeout(tEsc);
      if (escribe && mov) { msgBox.classList.add("escribe"); tEsc = setTimeout(poner, 650); } else poner();
    };
    var verDocs = function (as, animar) {
      cada(f.querySelectorAll("[data-docs]"), function (d) {
        var si = d.getAttribute("data-docs") === as; d.hidden = !si;
        if (si && animar && mov && d.animate) cada(d.children, function (l, i) { l.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], { duration: 500, delay: i * 60, easing: EASE, fill: "backwards" }); });
      });
    };
    f.addEventListener("change", function (e) {
      var n = e.target.name;
      if (n === "asunto") { verDocs(e.target.value, true); pintar(true); }
      else pintar(n !== "asunto" && !/^doc-/.test(n));
    });
    verDocs(val("asunto"), false);
    pintar(false);
  }

  /* ---------- horario: abierto o cerrado según la hora de Tolosa ---------- */
  var est = document.querySelector("[data-estado]");
  if (est && window.Intl) {
    var estado = function () {
      var o = {};
      new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
      var d = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(o.weekday), m = (+o.hour % 24) * 60 + +o.minute, lab = d >= 1 && d <= 5, k;
      if (lab && m >= 540 && m < 840) k = "a14";
      else if (lab && m >= 960 && m < 1140) k = "a19";
      else if (lab && m < 540) k = "h9";
      else if (lab && m < 960) k = "h16";
      else if ((lab && d < 5) || d === 0) k = "m9";
      else k = "l9";
      est.textContent = T.est[k];
    };
    estado(); setInterval(estado, 60000);
  }

  /* ---------- asuntos apilados: el que se lee, encendido ---------- */
  var areas = [].slice.call(document.querySelectorAll("[data-area]"));
  if (mov && areas.length && "IntersectionObserver" in window) {
    areas[0].parentNode.classList.add("vivas");
    var dentro = [];
    /* encendido: el último que ha entrado en la mitad de arriba (los anteriores siguen pegados arriba, tapados por él) */
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) { var i = areas.indexOf(e.target); dentro[i] = e.isIntersecting; });
      var cur = -1; dentro.forEach(function (v, i) { if (v) cur = i; });
      if (cur < 0) cur = areas[0].getBoundingClientRect().top > 0 ? 0 : areas.length - 1; /* antes de llegar, el primero; al pasar, el último */
      areas.forEach(function (a, i) { a.classList.toggle("on", i === cur); });
    }, { rootMargin: "0px 0px -52% 0px" });
    areas.forEach(function (a) { obs.observe(a); });
  }

  /* ---------- títulos en ola: las letras caen en curva una detrás de otra ---------- */
  var olas = document.querySelectorAll(".ola");
  if (mov && olas.length && "IntersectionObserver" in window && Element.prototype.animate) {
    var DESDE = "translateY(.95em) rotate(30deg)";
    cada(olas, function (h) { cada(h.querySelectorAll(".ch"), function (c) { c.style.opacity = "0"; c.style.transform = DESDE; c.style.transformOrigin = "0 100%"; }); });
    var ioO = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        ioO.unobserve(e.target);
        var celda = e.target.closest(".celda"), extra = celda ? (+getComputedStyle(celda).getPropertyValue("--i") || 0) % 3 * 110 : 0;
        cada(e.target.querySelectorAll(".ch"), function (c, i) {
          c.style.opacity = ""; c.style.transform = "";
          c.animate([{ opacity: 0, transform: DESDE }, { opacity: 1, transform: "none" }], { duration: 950, delay: extra + i * 26, easing: EASE, fill: "backwards" });
        });
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    cada(olas, function (h) { ioO.observe(h); });
  }

  /* ---------- GSAP: fotos, filetes, paralaje y la franja negra ---------- */
  if (!mov || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray("[data-panel]").forEach(function (fig) {
    var img = fig.querySelector("img");
    gsap.set(fig, { clipPath: "inset(100% 0% 0% 0%)" });
    gsap.set(img, { scale: 1.16 });
    ScrollTrigger.create({ trigger: fig, start: "top 90%", once: true, onEnter: function () {
      gsap.to(fig, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.35, ease: "power3.out" });
      gsap.to(img, { scale: 1, duration: 1.8, ease: "power3.out" });
    } });
  });
  gsap.utils.toArray("[data-filete]").forEach(function (h) {
    gsap.from(h, { scaleX: 0, duration: 1.4, ease: "power3.out", scrollTrigger: { trigger: h, start: "top 92%", once: true } });
  });
  gsap.utils.toArray("[data-fondo] picture").forEach(function (p) {
    gsap.fromTo(p, { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: p.closest("section"), start: "top bottom", end: "bottom top", scrub: true } });
  });
  gsap.utils.toArray(".banda-foto img").forEach(function (img) {
    gsap.fromTo(img, { scale: 1.12 }, { scale: 1, ease: "none", scrollTrigger: { trigger: img.parentNode, start: "top bottom", end: "bottom 40%", scrub: true } });
  });
  var mm = gsap.matchMedia();
  mm.add("(min-width: 760px)", function () {
    cada(document.querySelectorAll("[data-separa]"), function (p) {
      var s = p.firstElementChild, signo = +p.getAttribute("data-separa");
      gsap.fromTo(s, { x: function () { return -signo * Math.max(0, p.clientWidth - s.offsetWidth - 34); } }, {
        x: 0, ease: "none",
        scrollTrigger: { trigger: ".pin", start: "top 75%", end: "top -35%", scrub: true, invalidateOnRefresh: true },
      });
    });
  });
  mm.add("(max-width: 759px)", function () {
    cada(document.querySelectorAll("[data-separa]"), function (p) {
      var signo = +p.getAttribute("data-separa");
      gsap.fromTo(p.firstElementChild, { y: -signo * 12, opacity: .35 }, { y: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: ".banda", start: "top 85%", end: "center 45%", scrub: true } });
    });
  });
})();
