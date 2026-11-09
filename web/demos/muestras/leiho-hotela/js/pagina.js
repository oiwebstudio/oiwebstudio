/* LEIHO · lo que reacciona (OI Studio, 8/11/2026)
   · Cabecera: en la portada, sin fondo (el nombre grande hace de logo); al bajar, nombre pequeño y fondo propio, oscuro, claro o teja
     según la sección que tiene debajo, para que no pise el texto.
   · Menú del móvil.
   · Reserva sin comisiones: llegada (por defecto, el próximo viernes, con el día real), noches, personas y habitación →
     salida, precio de una noche y total (los números giran), y la solicitud escrita para WhatsApp («Escribiendo…»).
     Las habitaciones que no caben se apagan. «Reservar esta» en cada habitación la deja elegida.
   · Entradas al asomar, por tiempo (no atadas al scroll): fotos en ventana que se abren, habitaciones y tarjetas que suben,
     la ventana dibujada que se traza y enciende sus cristales.
   · Atado al scroll: la portada que se oscurece cuando la página pasa por encima, y (en el ordenador) la fila de «Cerca andando».
   Sin JS o con «reducir movimiento»: todo quieto y visible (nada se oculta en el CSS). */
(function () {
  var T = JSON.parse(document.getElementById("textos").textContent);
  var mov = !matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EASE = "cubic-bezier(.2,.75,.25,1)";
  var cada = function (l, fn) { Array.prototype.forEach.call(l, fn); };
  var visto = function (el) { var r = el.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; };
  var alAsomar = function (el, fn, margen) {
    if (!("IntersectionObserver" in window)) return fn();
    var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { io.disconnect(); fn(); } }, { rootMargin: margen || "0px 0px -12% 0px" });
    io.observe(el);
  };

  /* ---------- cabecera ---------- */
  var cab = document.querySelector("[data-cab]"), sobre = document.querySelector(".sobre");
  if (cab && sobre && "IntersectionObserver" in window) {
    var marca = document.createElement("div"); marca.setAttribute("aria-hidden", "true"); marca.style.cssText = "position:absolute;top:0;left:0;width:1px;height:1px";
    sobre.insertBefore(marca, sobre.firstChild);
    var altoCab = function () { return cab.offsetHeight; };
    var ioP;
    var vigilaPortada = function () {
      if (ioP) ioP.disconnect();
      ioP = new IntersectionObserver(function (e) {
        var x = e[0]; cab.classList.toggle("en-portada", x.isIntersecting || x.boundingClientRect.top > altoCab());
      }, { rootMargin: "-" + altoCab() + "px 0px 0px 0px" });
      ioP.observe(marca);
    };
    var ioT;
    var vigilaTono = function () {
      if (ioT) ioT.disconnect();
      var h = altoCab();
      ioT = new IntersectionObserver(function (es) {
        es.forEach(function (x) {
          if (!x.isIntersecting) return;
          var t = x.target.getAttribute("data-tono");
          cab.classList.toggle("tono-claro", t === "claro"); cab.classList.toggle("tono-teja", t === "teja");
        });
      }, { rootMargin: "-" + Math.round(h / 2) + "px 0px -" + Math.max(0, innerHeight - Math.round(h / 2) - 1) + "px 0px" });
      cada(document.querySelectorAll("[data-tono]"), function (s) { ioT.observe(s); });
    };
    vigilaPortada(); vigilaTono();
    var tR; addEventListener("resize", function () { clearTimeout(tR); tR = setTimeout(function () { vigilaPortada(); vigilaTono(); }, 200); });
  }

  /* ---------- menú del móvil ---------- */
  var mb = document.querySelector(".menu-btn"), menu = document.getElementById("menu-movil");
  function cerrar() { menu.hidden = true; mb.setAttribute("aria-expanded", "false"); mb.setAttribute("aria-label", T.abrir); document.body.classList.remove("menu-abierto"); }
  if (mb && menu) {
    mb.addEventListener("click", function () {
      if (menu.hidden) {
        menu.hidden = false; mb.setAttribute("aria-expanded", "true"); mb.setAttribute("aria-label", T.cerrar); document.body.classList.add("menu-abierto");
        if (mov && menu.animate) cada(menu.querySelectorAll("li, p"), function (el, i) { el.animate([{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }], { duration: 600, delay: 40 + i * 45, easing: EASE, fill: "backwards" }); });
      } else cerrar();
    });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) cerrar(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) { cerrar(); mb.focus(); } });
  }

  /* ---------- reserva sin comisiones ---------- */
  var f = document.querySelector("[data-reserva]");
  if (f) {
    var $ = function (s) { return f.querySelector(s); };
    var inLleg = $("[data-llegada]"), outN = $("[data-noches]"), outP = $("[data-personas]"), outSal = $("[data-salida]");
    var elPrecio = $("[data-precio]"), elTotal = $("[data-total]"), elNT = $("[data-noches-t]");
    var caja = $("[data-mensaje]"), msgBox = $(".mensaje"), wa = $("[data-wa]"), p3 = $(".panel.p3");
    var st = { noches: 2, personas: 2 };
    var MAXN = 14, MAXP = Math.max.apply(null, T.habs.map(function (h) { return h.cap; }));
    var iso = function (d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
    var deIso = function (s) { var p = (s || "").split("-"); return p.length === 3 ? new Date(+p[0], +p[1] - 1, +p[2]) : null; };
    var loc = T.lang === "eu" ? "eu-ES" : "es-ES";
    var fmt; try { fmt = new Intl.DateTimeFormat(loc, { weekday: "short", day: "numeric", month: "long" }); } catch (e) { fmt = { format: function (d) { return d.toLocaleDateString(); } }; }
    // fechas en euskera con Intl si el navegador las trae; si no (algunos Chromium recortados), en números: 2026/11/13
    var conEu = T.lang !== "eu" || (Intl.DateTimeFormat.supportedLocalesOf ? Intl.DateTimeFormat.supportedLocalesOf([loc]).length > 0 : false);
    var fecha = function (d) { return conEu ? fmt.format(d) : d.getFullYear() + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + String(d.getDate()).padStart(2, "0"); };
    // día de llegada por defecto: el próximo viernes (el día real, nunca una fecha fija que caduque)
    var hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    var vie = new Date(hoy); do { vie.setDate(vie.getDate() + 1); } while (vie.getDay() !== 5);
    inLleg.min = iso(hoy); inLleg.value = iso(vie);
    var hab = function () { var i = f.querySelector('input[name="hab"]:checked'); for (var k = 0; k < T.habs.length; k++) if (i && T.habs[k].id === i.value) return T.habs[k]; return T.habs[0]; };
    var nochesTxt = function (n) { return n === 1 ? T.noches_1 : T.noches_2.replace(/2/, n); };
    var contar = function (el, a) {
      var de = +el.textContent || 0;
      if (!mov || de === a) { el.textContent = a; return; }
      var t0 = performance.now(), dur = 520;
      (function paso(t) { var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(de + (a - de) * e); if (k < 1) requestAnimationFrame(paso); })(t0);
    };
    var lineas = function () {
      var h = hab(), d = deIso(inLleg.value), l = [T.hola, T.l_hab + " " + h.n + "."];
      if (d) { var s = new Date(d); s.setDate(s.getDate() + st.noches); l.push(T.l_llegada + " " + fecha(d) + ".", T.l_salida + " " + fecha(s) + " (" + nochesTxt(st.noches).toLowerCase() + ")."); }
      l.push(T.l_personas + " " + st.personas + ".", T.l_precio + " " + h.precio * st.noches + " € " + T.en_total + ".", T.pregunta);
      return l;
    };
    var tEsc;
    var pintar = function (escribe) {
      var h = hab(), d = deIso(inLleg.value);
      outN.textContent = st.noches; outP.textContent = st.personas;
      cada(f.querySelectorAll("[data-paso]"), function (b) {
        var k = b.getAttribute("data-paso"), dd = +b.getAttribute("data-d"), max = k === "noches" ? MAXN : MAXP;
        b.disabled = dd < 0 ? st[k] <= 1 : st[k] >= max;
      });
      // las habitaciones donde no cabéis, apagadas; si la elegida no vale, la primera que sí
      var elegida = f.querySelector('input[name="hab"]:checked'), primera = null;
      cada(f.querySelectorAll(".op-hab"), function (op) {
        var i = op.querySelector("input"), no = +op.getAttribute("data-cap") < st.personas;
        i.disabled = no; op.classList.toggle("no", no);
        if (!no && !primera) primera = i;
      });
      if (!elegida || elegida.disabled) { (primera || f.querySelector('input[name="hab"]')).checked = true; h = hab(); }
      if (d) { var s = new Date(d); s.setDate(s.getDate() + st.noches); outSal.textContent = fecha(s); } else outSal.textContent = T.elige;
      contar(elPrecio, h.precio); contar(elTotal, h.precio * st.noches); elNT.textContent = nochesTxt(st.noches);
      var l = lineas();
      wa.href = T.wa + "?text=" + encodeURIComponent(l.join("\n"));
      var poner = function () {
        var viejo = [].map.call(caja.children, function (p) { return p.textContent; });
        caja.textContent = "";
        l.forEach(function (x, i) {
          var p = document.createElement("p"); p.textContent = x; caja.appendChild(p);
          if (mov && p.animate && escribe && viejo[i] !== x) p.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 420, easing: EASE, fill: "backwards" });
        });
        msgBox.classList.remove("escribe");
      };
      clearTimeout(tEsc);
      if (escribe && mov) { msgBox.classList.add("escribe"); tEsc = setTimeout(poner, 520); } else poner();
      if (escribe && mov && p3.animate) p3.animate([{ transform: "scale(.985)" }, { transform: "none" }], { duration: 420, easing: EASE });
    };
    f.addEventListener("click", function (e) {
      var b = e.target.closest("[data-paso]"); if (!b || b.disabled) return;
      var k = b.getAttribute("data-paso"), max = k === "noches" ? MAXN : MAXP;
      st[k] = Math.max(1, Math.min(max, st[k] + +b.getAttribute("data-d")));
      pintar(true);
      var out = k === "noches" ? outN : outP;
      if (mov && out.animate) out.animate([{ transform: "translateY(" + (+b.getAttribute("data-d") > 0 ? "-" : "") + "35%)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 320, easing: EASE });
    });
    f.addEventListener("change", function (e) {
      if (e.target.name === "hab") { var op = e.target.closest(".op-hab"); if (mov && op.animate) op.animate([{ transform: "translateX(6px)" }, { transform: "none" }], { duration: 380, easing: EASE }); }
      pintar(true);
    });
    inLleg.addEventListener("input", function () { pintar(true); });
    // «Reservar esta» en cada habitación: la deja elegida (y ajusta las personas si no caben) antes de bajar a la reserva
    cada(document.querySelectorAll("[data-elegir]"), function (a) {
      a.addEventListener("click", function () {
        var id = a.getAttribute("data-elegir"), h = T.habs.filter(function (x) { return x.id === id; })[0];
        if (!h) return;
        if (st.personas > h.cap) st.personas = h.cap;
        var i = f.querySelector('input[name="hab"][value="' + id + '"]');
        pintar(false); i.checked = true; pintar(true);
        var op = i.closest(".op-hab");
        if (mov && op.animate) setTimeout(function () { op.animate([{ transform: "scale(1.04)" }, { transform: "none" }], { duration: 600, easing: EASE }); }, 650);
      });
    });
    pintar(false);
  }

  /* ---------- entradas al asomar (por tiempo) ---------- */
  if (mov && Element.prototype.animate) {
    // fotos en ventana redondeada: se abren desde más pequeñas, como la referencia
    cada(document.querySelectorAll("[data-crece]"), function (fig) {
      if (visto(fig)) return;
      var img = fig.querySelector("img");
      fig.style.transform = "scale(.86)"; if (img) img.style.transform = "scale(1.18)";
      alAsomar(fig, function () {
        fig.animate([{ transform: "scale(.86)" }, { transform: "none" }], { duration: 1500, easing: EASE }).onfinish = function () { fig.style.transform = ""; };
        if (img) img.animate([{ transform: "scale(1.18)" }, { transform: "none" }], { duration: 1700, easing: EASE }).onfinish = function () { img.style.transform = ""; };
        fig.style.transform = ""; if (img) img.style.transform = "";
      }, "0px 0px -8% 0px");
    });
    // fotos altas: suben y se descubren
    cada(document.querySelectorAll("[data-panel]"), function (fig) {
      if (visto(fig)) return;
      var img = fig.querySelector("img");
      fig.style.opacity = "0";
      alAsomar(fig, function () {
        fig.style.opacity = "";
        fig.animate([{ opacity: 0, transform: "translateY(60px)" }, { opacity: 1, transform: "none" }], { duration: 1300, easing: EASE });
        if (img) img.animate([{ transform: "scale(1.15)" }, { transform: "none" }], { duration: 1600, easing: EASE });
      });
    });
    // habitaciones, tarjetas de la reserva y sitios: suben uno detrás de otro
    var subir = function (sel, paso) {
      cada(document.querySelectorAll(sel), function (el) {
        if (visto(el)) return;
        var i = +getComputedStyle(el).getPropertyValue("--i") || 0;
        el.style.opacity = "0";
        alAsomar(el, function () {
          el.style.opacity = "";
          el.animate([{ opacity: 0, transform: "translateY(48px)" }, { opacity: 1, transform: "none" }], { duration: 1200, delay: (i % 3) * paso, easing: EASE, fill: "backwards" });
        });
      });
    };
    subir(".hab", 140); subir(".panel", 120);
    if (!matchMedia("(min-width: 900px)").matches) subir(".sitio", 90);
    // la ventana dibujada: se trazan las líneas y se encienden los cristales uno a uno
    var dib = document.querySelector("[data-dibujo]");
    if (dib && !visto(dib)) {
      var trazos = dib.querySelectorAll(".lineas path"), cristales = dib.querySelectorAll(".cristales path");
      cada(trazos, function (p) { var L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p._L = L; });
      cada(cristales, function (c) { c.style.opacity = "0"; });
      alAsomar(dib, function () {
        cada(trazos, function (p, i) {
          p.animate([{ strokeDashoffset: p._L }, { strokeDashoffset: 0 }], { duration: 1800, delay: i * 90, easing: EASE, fill: "forwards" }).onfinish = function () { p.style.strokeDasharray = ""; p.style.strokeDashoffset = ""; };
        });
        cada(cristales, function (c, i) {
          c.animate([{ opacity: 0 }, { opacity: .14, offset: .4 }, { opacity: .05 }], { duration: 1600, delay: 900 + i * 160, easing: "ease-out", fill: "forwards" }).onfinish = function () { c.style.opacity = ""; };
        });
      }, "0px 0px -20% 0px");
    }
  }

  /* ---------- atado al scroll (GSAP): la portada se oscurece y la fila de «Cerca andando» corre de lado en el ordenador ---------- */
  if (mov && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    var velo = document.querySelector("[data-velo]");
    if (velo && sobre) gsap.fromTo(velo, { opacity: 0 }, { opacity: .85, ease: "none", scrollTrigger: { trigger: sobre, start: "top bottom", end: "top top", scrub: true } });
    var marco = document.querySelector("[data-fila]");
    if (marco && matchMedia("(min-width: 900px)").matches) {
      var fila = marco.querySelector(".sitios");
      marco.classList.add("mueve"); marco.removeAttribute("tabindex");
      gsap.fromTo(fila, { x: 0 }, { x: function () { return -Math.max(0, fila.scrollWidth - (marco.clientWidth - 2 * parseFloat(getComputedStyle(marco).paddingLeft))); }, ease: "none", scrollTrigger: { trigger: marco, start: "top 85%", end: "bottom 15%", scrub: .6, invalidateOnRefresh: true } });
    }
  }
})();
