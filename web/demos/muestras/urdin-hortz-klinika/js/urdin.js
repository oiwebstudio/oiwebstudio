/* URDIN · muestra de OI Studio (v2, 7/11/2026)
   - Portada: entra con CSS desde el primer pintado (estilo.css). Aquí nada de la primera pantalla.
   - Tratamientos: la radiografía se acerca a la zona de cada tratamiento y la ficha cambia.
   - Cita: días y horas de muestra; la tarjeta de cita se rellena y prepara el WhatsApp.
   - Entradas al asomar por tiempo (IntersectionObserver + transiciones CSS). GSAP solo para lo que va con el scroll
     (banda que corre de lado y párrafo que se enciende). Con «reducir movimiento» o sin JS, todo quieto y visible. */
(function () {
  "use strict";
  window.URDIN_OK = true;
  var T = window.URDIN_TXT || {};
  var EU = T.lang === "eu";
  var doc = document.documentElement;
  var mover = doc.classList.contains("anim");
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Fechas y horario (de ejemplo) ---------- */
  var HORARIO = { 1: [[540, 810], [900, 1200]], 2: [[540, 810], [900, 1200]], 3: [[540, 810], [900, 1200]], 4: [[540, 810], [900, 1200]], 5: [[540, 900]], 6: [], 0: [] };
  var DIA_ES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  var DIA_EU = ["igandea", "astelehena", "asteartea", "asteazkena", "osteguna", "ostirala", "larunbata"];
  var DIA_EU_INE = ["Igandean", "Astelehenean", "Asteartean", "Asteazkenean", "Ostegunean", "Ostiralean", "Larunbatean"];
  var DIA_CORTO = EU ? ["ig.", "al.", "ar.", "az.", "og.", "or.", "lr."] : ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
  var MES_ES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  var MES_EU = ["urtarrila", "otsaila", "martxoa", "apirila", "maiatza", "ekaina", "uztaila", "abuztua", "iraila", "urria", "azaroa", "abendua"];
  var MES_CORTO_ES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  var MES_CORTO_EU = ["urt.", "ots.", "mar.", "api.", "mai.", "eka.", "uzt.", "abu.", "ira.", "urr.", "aza.", "abe."];
  var hhmm = function (m) { return Math.floor(m / 60) + ":" + ("0" + (m % 60)).slice(-2); };
  var minutos = function (d) { return d.getHours() * 60 + d.getMinutes(); };
  var fmt = function (s, o) { return s.replace(/\{(\w)\}/g, function (_, k) { return o[k] != null ? o[k] : ""; }); };

  /* Abierto ahora / cerrado (cabecera) y día de hoy en el ticket */
  (function () {
    var ahora = new Date(), d = ahora.getDay(), m = minutos(ahora), txt = "";
    var hoyR = HORARIO[d] || [];
    for (var i = 0; i < hoyR.length; i++) if (m >= hoyR[i][0] && m < hoyR[i][1]) txt = fmt(T.abierto || "", { h: hhmm(hoyR[i][1]) });
    if (!txt) {
      for (var j = 0; j < hoyR.length; j++) if (m < hoyR[j][0]) { txt = fmt(T.cerradoHoy || "", { h: hhmm(hoyR[j][0]) }); break; }
    }
    if (!txt) {
      for (var k = 1; k <= 7; k++) {
        var dd = (d + k) % 7, r = HORARIO[dd];
        if (r && r.length) {
          txt = k === 1 ? fmt(T.cerradoManana || "", { h: hhmm(r[0][0]) }) : fmt(T.cerrado || "", { d: EU ? DIA_EU_INE[dd] : DIA_ES[dd], h: hhmm(r[0][0]) });
          break;
        }
      }
    }
    var e = $("[data-estado]");
    if (e && txt) { e.textContent = txt; e.hidden = false; }
    $$(".ticket__l li").forEach(function (li) {
      if ((" " + li.getAttribute("data-dias") + " ").indexOf(" " + d + " ") > -1) {
        li.setAttribute("aria-current", "date");
        var s = document.createElement("span"); s.className = "ticket__hoy"; s.textContent = T.hoy || "hoy";
        li.querySelector(".ticket__d").appendChild(s);
      }
    });
  })();

  /* ---------- Menú del móvil ---------- */
  (function () {
    var b = $("[data-menu]"), n = $("#nav");
    if (!b || !n) return;
    var poner = function (abierto) {
      n.classList.toggle("abierta", abierto);
      b.setAttribute("aria-expanded", abierto ? "true" : "false");
      $("[data-abrir]", b).hidden = abierto; $("[data-cerrar]", b).hidden = !abierto;
    };
    b.addEventListener("click", function () { poner(!n.classList.contains("abierta")); });
    $$("a", n).forEach(function (a) { a.addEventListener("click", function () { poner(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && n.classList.contains("abierta")) { poner(false); b.focus(); } });
  })();

  /* ---------- Animación corta de un elemento que cambia ---------- */
  var latido = function (el, frames, ms) {
    if (!mover || !el || !el.animate) return;
    el.animate(frames, { duration: ms || 450, easing: "cubic-bezier(.2,.75,.25,1)" });
  };
  var escribir = function (el) { latido(el, [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], 520); };

  /* ---------- Tratamientos ---------- */
  var tratActual = null;
  var selCita = $("[data-cita-sel]");
  var tarjeta = {
    t: $('[data-c="t"]'), d: $('[data-c="d"]'), h: $('[data-c="h"]'), wa: $("[data-wa]"),
    dia: null, hora: null
  };

  function datosTrat(id) {
    var inp = $('input[name="trat"][value="' + id + '"]');
    return inp ? JSON.parse(inp.getAttribute("data-trat")) : null;
  }

  function zoom(x) {
    var img = $("[data-zoom]");
    if (!img || !x) return;
    var s = x.s, lim = (s - 1) / 2 * 100;
    var tx = Math.max(-lim, Math.min(lim, -s * (x.x - 50)));
    var ty = Math.max(-lim, Math.min(lim, -s * (x.y - 50)));
    img.style.transform = "translate(" + tx.toFixed(2) + "%," + ty.toFixed(2) + "%) scale(" + s + ")";
  }

  var mq = window.matchMedia("(max-width: 900px)");
  var ficha = $("#ficha"), sitioFicha = ficha ? ficha.parentNode : null;
  /* En el móvil la ficha va debajo de la fila elegida. «ancla» es lo que la persona está tocando
     (la fila o el desplegable de la cita): se queda quieto en la pantalla aunque la ficha cambie de sitio. */
  function colocarFicha(ancla) {
    if (!ficha || !tratActual) return;
    if (mq.matches) {
      var li = $('[data-fila="' + tratActual + '"]');
      if (li && ficha.parentNode !== li) {
        var a = ancla || li, ref = a.getBoundingClientRect().top;
        li.appendChild(ficha);
        var dif = a.getBoundingClientRect().top - ref;
        if (Math.abs(dif) > 1) { /* sin animar (el CSS pide scroll suave) */
          var h = document.documentElement, antes = h.style.scrollBehavior;
          h.style.scrollBehavior = "auto"; window.scrollBy(0, dif); h.style.scrollBehavior = antes;
        }
      }
    } else if (sitioFicha && ficha.parentNode !== sitioFicha) {
      sitioFicha.appendChild(ficha);
    }
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  function elegirTrat(id, desdeLista, ancla) {
    var x = datosTrat(id);
    if (!x) return;
    var cambio = tratActual !== null && tratActual !== id;
    tratActual = id;
    zoom(x);
    ["nombre", "que", "vis", "dura", "precio"].forEach(function (k) {
      var el = $('[data-f="' + k + '"]');
      if (el && el.textContent !== x[k]) {
        el.textContent = x[k];
        if (cambio) latido(el, [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], 480);
      }
    });
    var inp = $('input[name="trat"][value="' + id + '"]');
    if (inp && !inp.checked) inp.checked = true;
    if (selCita && selCita.value !== id) selCita.value = id;
    if (tarjeta.t && tarjeta.t.textContent !== x.nombre) { tarjeta.t.textContent = x.nombre; if (cambio) escribir(tarjeta.t); }
    actualizarWa();
    if (desdeLista) colocarFicha(ancla);
  }

  $$('input[name="trat"]').forEach(function (inp) {
    inp.addEventListener("change", function () {
      if (!inp.checked) return;
      var fila = inp.closest(".trat__op");
      elegirTrat(inp.value, true, fila);
      /* con el teclado (flechas) la fila nueva puede quedar fuera de la pantalla */
      if (mq.matches && fila) {
        var r = fila.getBoundingClientRect();
        if (r.top < 70 || r.bottom > window.innerHeight - 80) fila.scrollIntoView({ block: "center" });
      }
    });
  });
  if (selCita) selCita.addEventListener("change", function () { elegirTrat(selCita.value, true, selCita); });
  var btnCitaTrat = $("[data-cita-trat]");
  if (btnCitaTrat) btnCitaTrat.addEventListener("click", function () { if (selCita) selCita.value = tratActual; });
  var primero = $('input[name="trat"]:checked');
  if (primero) elegirTrat(primero.value, false);
  colocarFicha();
  if (mq.addEventListener) mq.addEventListener("change", colocarFicha);

  /* ---------- Cita: días y horas de muestra ---------- */
  var cajaDias = $("[data-dias]"), cajaHoras = $("[data-horas]");
  var HORAS_LJ = [540, 585, 630, 675, 720, 765, 900, 945, 990, 1035, 1080, 1125, 1155];
  var HORAS_V = [540, 585, 630, 675, 720, 765, 810, 855];
  var ocupada = function (fecha, m) {
    var n = fecha.getDate() * 31 + fecha.getMonth() * 7 + m;
    n = (n * 9301 + 49297) % 233280;
    return n / 233280 < 0.42;
  };
  function libres(fecha, esHoy) {
    var lista = fecha.getDay() === 5 ? HORAS_V : HORAS_LJ, ahora = minutos(new Date());
    return lista.map(function (m) { return { m: m, ocupada: ocupada(fecha, m) || (esHoy && m < ahora + 60) }; });
  }
  function textoDia(f) {
    var d = f.getDay(), n = f.getDate(), mes = f.getMonth();
    return EU ? MES_EU[mes] + "k " + n + ", " + DIA_EU[d] : DIA_ES[d] + " " + n + " de " + MES_ES[mes];
  }

  function opcion(nombre, valor, arriba, abajo, deshab, clase) {
    var l = document.createElement("label"); l.className = "op " + (clase || "");
    var i = document.createElement("input"); i.type = "radio"; i.name = nombre; i.value = valor; if (deshab) i.disabled = true;
    var s = document.createElement("span");
    if (arriba) { var sm = document.createElement("small"); sm.textContent = arriba; s.appendChild(sm); }
    var b = document.createElement("b"); b.textContent = abajo; s.appendChild(b);
    if (deshab) { var o = document.createElement("span"); o.className = "sr"; o.textContent = " (" + (T.ocupado || "") + ")"; s.appendChild(o); }
    l.appendChild(i); l.appendChild(s);
    return l;
  }

  var dias = [];
  (function () {
    if (!cajaDias) return;
    var hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    for (var k = 0; dias.length < 5 && k < 14; k++) {
      var f = new Date(hoy); f.setDate(hoy.getDate() + k);
      var dw = f.getDay();
      if (!HORARIO[dw].length) continue;
      var hs = libres(f, k === 0);
      if (!hs.some(function (h) { return !h.ocupada; })) continue;
      dias.push({ fecha: f, horas: hs, rel: k === 0 ? (EU ? "gaur" : "hoy") : k === 1 ? (EU ? "bihar" : "mañana") : DIA_CORTO[dw] });
    }
    var l = document.createElement("div"); l.className = "dias__l";
    dias.forEach(function (d, i) {
      var f = d.fecha, mc = EU ? MES_CORTO_EU[f.getMonth()] + " " + f.getDate() : f.getDate() + " " + MES_CORTO_ES[f.getMonth()];
      var op = opcion("dia", String(i), d.rel, mc, false, "op--dia");
      op.querySelector("input").setAttribute("aria-label", textoDia(f));
      l.appendChild(op);
    });
    cajaDias.appendChild(l);
    l.addEventListener("change", function (e) { elegirDia(+e.target.value); latido(e.target.nextElementSibling, [{ transform: "scale(1)" }, { transform: "scale(1.07)" }, { transform: "scale(1)" }], 320); });
  })();

  function elegirDia(i) {
    var d = dias[i];
    if (!d || !cajaHoras) return;
    tarjeta.dia = textoDia(d.fecha); tarjeta.hora = null;
    poner(tarjeta.d, tarjeta.dia); poner(tarjeta.h, null);
    $$(".horas__g", cajaHoras).forEach(function (g) { g.remove(); });
    [[T.manana, function (m) { return m < 840; }], [T.tarde, function (m) { return m >= 840; }]].forEach(function (par) {
      var hs = d.horas.filter(function (h) { return par[1](h.m); });
      if (!hs.length) return;
      var g = document.createElement("div"); g.className = "horas__g";
      var t = document.createElement("p"); t.className = "horas__t"; t.textContent = par[0]; g.appendChild(t);
      var l = document.createElement("div"); l.className = "horas__l";
      hs.forEach(function (h) { l.appendChild(opcion("hora", String(h.m), null, hhmm(h.m), h.ocupada)); });
      g.appendChild(l); cajaHoras.appendChild(g);
      if (mover && l.animate) $$(".op", l).forEach(function (o, k) { o.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 420, delay: k * 28, easing: "cubic-bezier(.2,.75,.25,1)", fill: "backwards" }); });
    });
    actualizarWa();
  }
  (function () { var r = cajaDias && cajaDias.querySelector('input[name="dia"]'); if (r) { r.checked = true; elegirDia(0); } })();
  if (cajaHoras) cajaHoras.addEventListener("change", function (e) {
    if (e.target.name !== "hora") return;
    tarjeta.hora = hhmm(+e.target.value);
    poner(tarjeta.h, tarjeta.hora);
    latido(e.target.nextElementSibling, [{ transform: "scale(1)" }, { transform: "scale(1.08)" }, { transform: "scale(1)" }], 320);
    actualizarWa();
  });

  function poner(el, valor) {
    if (!el) return;
    el.textContent = valor || T.vacio || "";
    el.classList.toggle("vacio", !valor);
    if (valor) escribir(el);
  }

  function actualizarWa() {
    var a = tarjeta.wa;
    if (!a) return;
    var listo = tarjeta.dia && tarjeta.hora;
    a.setAttribute("aria-disabled", listo ? "false" : "true");
    a.textContent = listo ? T.btn : T.falta;
    if (listo) a.href = "https://wa.me/" + T.waNum + "?text=" + encodeURIComponent(fmt(T.wa, { t: tarjeta.t.textContent, d: tarjeta.dia, h: tarjeta.hora }));
  }
  if (tarjeta.wa) tarjeta.wa.addEventListener("click", function (e) {
    if (tarjeta.wa.getAttribute("aria-disabled") !== "true") return;
    e.preventDefault();
    var caja = $(".cita__elegir");
    caja.classList.add("falta");
    setTimeout(function () { caja.classList.remove("falta"); }, 1600);
    var foco = !tarjeta.dia ? $('input[name="dia"]', cajaDias) : $('input[name="hora"]:not(:disabled)', cajaHoras);
    if (foco) foco.focus();
  });
  actualizarWa();

  /* ---------- Entradas al asomar (por tiempo) ---------- */
  function partirLineas(h) {
    var palabras = h.textContent.trim().split(/\s+/);
    h.textContent = "";
    palabras.forEach(function (p, i) {
      var a = document.createElement("span"); a.className = "pal";
      var w = document.createElement("span"); w.className = "w"; w.textContent = p;
      a.appendChild(w); h.appendChild(a);
      if (i < palabras.length - 1) h.appendChild(document.createTextNode(" "));
    });
    var tops = [], pals = $$(".pal", h);
    pals.forEach(function (a) { var t = a.offsetTop; if (tops.indexOf(t) < 0) tops.push(t); a.firstChild.style.setProperty("--ln", tops.indexOf(t)); });
  }

  if (mover && "IntersectionObserver" in window) {
    var listos = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    listos.then(function () {
      $$("[data-lineas]").forEach(partirLineas);
      $$("[data-escalonado]").forEach(function (g) { Array.prototype.forEach.call(g.children, function (c, k) { c.style.setProperty("--k", k); }); });
      var els = $$("[data-panel],[data-foto],[data-escalonado],[data-lineas]");
      els.forEach(function (el) { el.classList.add("pre"); });
      var io = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          if (!en.isIntersecting) return;
          io.unobserve(en.target);
          requestAnimationFrame(function () { requestAnimationFrame(function () { en.target.classList.add("visto"); en.target.classList.remove("pre"); }); });
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
      els.forEach(function (el) { io.observe(el); });
    });
  }

  /* ---------- Lo que va con el scroll: GSAP ---------- */
  window.addEventListener("load", function () {
    if (!mover || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    $$("[data-pista]").forEach(function (p) {
      gsap.fromTo(p, { x: 0 }, {
        x: function () { return -Math.max(0, p.scrollWidth - p.parentElement.clientWidth + 40); },
        ease: "none", scrollTrigger: { trigger: p.parentElement, start: "top bottom", end: "bottom top", scrub: 0.6, invalidateOnRefresh: true }
      });
    });
    $$("[data-enciende]").forEach(function (p) {
      var palabras = p.textContent.trim().split(/\s+/);
      p.textContent = "";
      var spans = palabras.map(function (w, i) {
        var s = document.createElement("span"); s.textContent = w; p.appendChild(s);
        if (i < palabras.length - 1) p.appendChild(document.createTextNode(" "));
        return s;
      });
      gsap.fromTo(spans, { opacity: 0.2 }, { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: p, start: "top 82%", end: "bottom 48%", scrub: true } });
    });
  });

  /* ---------- Barra fija del móvil: aparece cuando la portada ya no se ve ---------- */
  (function () {
    var b = $("[data-barra-movil]"), p = $("[data-portada]");
    if (!b) return;
    if (!p || !("IntersectionObserver" in window)) { b.classList.add("on"); return; }
    new IntersectionObserver(function (e) { b.classList.toggle("on", !e[0].isIntersecting); }, { threshold: 0.05 }).observe(p);
  })();
})();
