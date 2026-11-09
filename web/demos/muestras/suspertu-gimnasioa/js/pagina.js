/* SUSPERTU · muestra de entrenamiento personal, fuerza, pilates y yoga (OI Studio, 9/11/2026).
   Con la fecha y la hora reales de Tolosa: las clases de los próximos siete días (horario y plazas libres de ejemplo), las
   próximas en la rueda, las cifras de la semana, el número de clases que quedan hoy junto a «Horario»; eliges actividad
   («Anterior / Siguiente» o deslizando) y franja, tocas una clase y sale el mensaje de WhatsApp escrito; en las tarifas,
   «¿cuántos días vas a venir?» marca el bono y lo que sale cada clase.
   Es una muestra: no se envía nada a ningún sitio; el botón solo abre WhatsApp con el texto.
   Sin JS o con «reducir movimiento»: todo se ve quieto y completo (la rueda y las cifras, como listas). */
(function () {
  var T = JSON.parse(document.getElementById("textos").textContent);
  var R = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var G = !!(window.gsap && window.ScrollTrigger) && !R;
  var EU = T.lang === "eu";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var may = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
  var dos = function (n) { return ("0" + n).slice(-2); };
  var aMin = function (h) { var p = h.split(":"); return +p[0] * 60 + +p[1]; };
  var EASE = "cubic-bezier(.2,.75,.25,1)";
  if (G) gsap.registerPlugin(ScrollTrigger);

  /* ---------- fecha y hora de Tolosa ---------- */
  function ahora() {
    try {
      var o = {};
      new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
        .formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
      return { dia: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday], min: +o.hour * 60 + +o.minute, y: +o.year, m: +o.month, d: +o.day };
    } catch (e) { var n = new Date(); return { dia: n.getDay(), min: n.getHours() * 60 + n.getMinutes(), y: n.getFullYear(), m: n.getMonth() + 1, d: n.getDate() }; }
  }
  function dentroDe(a, k) {
    var f = new Date(Date.UTC(a.y, a.m - 1, a.d + k));
    return { dia: f.getUTCDay(), d: f.getUTCDate(), clave: f.getUTCFullYear() + "-" + dos(f.getUTCMonth() + 1) + "-" + dos(f.getUTCDate()) };
  }
  // «Hoy, martes 10» / «Gaur, asteartea 10» (el orden lo dio el traductor: «Gaur, asteartea 10»)
  function nombreDia(k, f) { var n = T.dias[f.dia] + " " + f.d; return k === 0 ? may(T.hoy) + ", " + n : k === 1 ? may(T.manana) + ", " + n : may(n); }
  function corto(k, f) { return k === 0 ? may(T.hoy) : k === 1 ? may(T.manana) : may(T.dias[f.dia]); }

  /* ---------- las clases de los próximos siete días (horario y plazas de ejemplo) ---------- */
  var ACT = T.act, porId = {};
  ACT.forEach(function (a, i) { a.i = i; porId[a.id] = a; });
  // plazas libres de ejemplo: fijas para cada día, clase y hora (no cambian al recargar)
  function libres(s, aforo) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15; h = h >>> 0;
    if (aforo === 1) return h % 3 === 0 ? 0 : 1;
    return h % 10 < 2 ? 0 : 1 + ((h >>> 5) % aforo);
  }
  function semana() {
    var a = ahora(), out = [];
    for (var k = 0; k < 7; k++) {
      var f = dentroDe(a, k);
      T.clases.forEach(function (c) {
        if (c[1].indexOf(f.dia) < 0) return;
        var min = aMin(c[2]);
        if (k === 0 && min <= a.min) return; // ya ha empezado
        var act = porId[c[0]];
        out.push({ k: k, f: f, act: act, h: c[2], min: min, libres: libres(f.clave + c[0] + c[2], act.aforo), id: f.clave + "-" + c[0] + "-" + c[2] });
      });
    }
    out.sort(function (x, y) { return x.k - y.k || x.min - y.min; });
    return out;
  }
  var CL = semana();
  var txtLibres = function (n) { return n === 1 ? T.libres1 : T.libresN.replace("3", String(n)); };

  /* ---------- «Horario» con las clases que quedan hoy ---------- */
  (function () {
    var b = $("[data-badge]"), n = CL.filter(function (c) { return c.k === 0; }).length;
    if (!b || !n) return;
    b.innerHTML = n + '<span class="sr"> ' + T.badge + "</span>";
    b.hidden = false;
  })();

  /* ---------- menú ---------- */
  (function () {
    var m = $("[data-menu]"), bs = $$("[data-menu-btn]"), ult = null;
    if (!m) return;
    function abrir(v) {
      m.hidden = !v;
      bs.forEach(function (b) { b.setAttribute("aria-expanded", v ? "true" : "false"); });
      document.documentElement.style.overflow = v ? "hidden" : "";
      if (v) { ult = document.activeElement; var a = $("nav a", m); if (a) a.focus(); if (!R) m.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 350, easing: "ease-out" }); }
      else if (ult) ult.focus();
    }
    bs.forEach(function (b) { b.addEventListener("click", function () { abrir(m.hidden); }); });
    $("[data-menu-cerrar]", m).addEventListener("click", function () { abrir(false); });
    $$("a", m).forEach(function (a) { a.addEventListener("click", function () { if (a.getAttribute("href").charAt(0) === "#") abrir(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !m.hidden) abrir(false); });
  })();

  /* ---------- el horario: actividad, franja, clases y mensaje ---------- */
  var sec = $("[data-horario]"), lista = $("[data-semana]"), caja = $("[data-mensaje]");
  var st = { ai: 0, franja: "todo", sel: null };
  var enFranja = function (c) { return st.franja === "todo" || (st.franja === "m" && c.min < 720) || (st.franja === "md" && c.min >= 720 && c.min < 960) || (st.franja === "t" && c.min >= 960); };

  function pintaSemana(animar) {
    var act = ACT[st.ai];
    var cs = CL.filter(function (c) { return c.act === act && enFranja(c); });
    var html = "", k = -1;
    if (!cs.length) html = '<p class="sin-clases">' + T.sinClases + "</p>";
    cs.forEach(function (c) {
      if (c.k !== k) { k = c.k; html += '<p class="dia">' + nombreDia(c.k, c.f) + "</p>"; }
      var lleno = !c.libres, sel = st.sel && st.sel.id === c.id;
      html += '<button type="button" class="fila" data-id="' + c.id + '"' + (lleno ? " disabled" : ' aria-pressed="' + (sel ? "true" : "false") + '"') + ">" +
        '<span class="hora">' + c.h + "</span>" +
        '<span class="que"><b>' + act.nom + "</b>" + act.dur + " min</span>" +
        '<span class="pl' + (c.libres === 1 ? " poco" : "") + '">' + (lleno ? T.completa : txtLibres(c.libres)) + "</span></button>";
    });
    lista.innerHTML = html;
    if (animar && G) gsap.from(lista.children, { y: 16, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.025, clearProps: "transform,opacity" });
  }
  lista.addEventListener("click", function (e) {
    var b = e.target.closest(".fila");
    if (!b || b.disabled) return;
    var c = CL.filter(function (x) { return x.id === b.getAttribute("data-id"); })[0];
    if (!c) return;
    elegir(c, false);
  });

  function elegir(c, irAlMensaje) {
    st.sel = c;
    $$(".fila", lista).forEach(function (b) {
      if (b.disabled) return;
      var on = b.getAttribute("data-id") === c.id;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      if (on && !R) b.animate([{ transform: "scale(.985)" }, { transform: "scale(1.012)" }, { transform: "none" }], { duration: 420, easing: EASE });
    });
    escribe(true);
    if (irAlMensaje) caja.scrollIntoView({ behavior: R ? "auto" : "smooth", block: "center" });
  }

  var nombreIn = $("[data-msg-nombre]"), texto = $("[data-msg-texto]"), esc = $("[data-escribiendo]"), wa = $("[data-wa]"), tEsc = 0;
  function mensaje() {
    var c = st.sel; if (!c) return "";
    var l = [T.msg.hola, T.msg.clase + " " + c.act.largo, T.msg.dia + " " + nombreDia(c.k, c.f), T.msg.hora + " " + c.h];
    var n = (nombreIn.value || "").trim();
    if (n) l.push(T.msg.nombre + " " + n);
    return l.join("\n");
  }
  function escribe(conPausa) {
    if (!st.sel) return;
    var t = mensaje();
    caja.classList.add("lleno");
    wa.href = T.wa + "?text=" + encodeURIComponent(t);
    clearTimeout(tEsc);
    if (conPausa && !R) {
      texto.hidden = true; esc.hidden = false;
      tEsc = setTimeout(function () {
        esc.hidden = true; texto.textContent = t; texto.hidden = false;
        texto.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 500, easing: EASE });
      }, 650);
    } else { esc.hidden = true; texto.textContent = t; texto.hidden = false; }
  }
  nombreIn.addEventListener("input", function () { escribe(false); });

  // actividad: nombre gigante, descripción, foto y número; con «Anterior / Siguiente» o deslizando
  var nom = $("[data-act-nom]"), desc = $("[data-act-desc]"), num = $("[data-act-i]"), nomP = nom.parentElement;
  function ponAct(i, dir) {
    st.ai = (i + ACT.length) % ACT.length;
    var a = ACT[st.ai];
    nomP.style.setProperty("--len", Math.max(a.nom.length, 4));
    nom.textContent = a.nom; desc.textContent = a.desc; num.textContent = dos(st.ai + 1);
    $$("[data-act-foto]").forEach(function (f) { f.classList.toggle("on", f.getAttribute("data-act-foto") === a.id); });
    if (dir && !R) {
      nom.animate([{ transform: "translateY(" + (dir > 0 ? 100 : -100) + "%)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 750, easing: EASE });
      desc.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, easing: "ease-out" });
    }
    if (st.sel && st.sel.act !== a) st.sel = null;
    if (!st.sel) { caja.classList.remove("lleno"); texto.hidden = true; esc.hidden = true; wa.href = T.wa; }
    pintaSemana(!!dir);
  }
  $("[data-act-prev]").addEventListener("click", function () { ponAct(st.ai - 1, -1); });
  $("[data-act-next]").addEventListener("click", function () { ponAct(st.ai + 1, 1); });
  (function () { // deslizar en el móvil
    var zona = $("[data-act]"), x0 = null, y0 = 0;
    zona.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") { x0 = e.clientX; y0 = e.clientY; } });
    zona.addEventListener("pointerup", function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) ponAct(st.ai + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    });
    zona.addEventListener("pointercancel", function () { x0 = null; });
  })();
  $$("input[name=franja]").forEach(function (r) {
    r.addEventListener("change", function () {
      st.franja = r.value;
      if (!R) r.nextElementSibling.animate([{ transform: "scale(.94)" }, { transform: "scale(1.05)" }, { transform: "none" }], { duration: 380, easing: EASE });
      pintaSemana(true);
    });
  });
  ponAct(0, 0);

  /* ---------- la rueda de las próximas clases ---------- */
  (function () {
    var s = $("[data-rueda-sec]"), ol = $("[data-rueda]");
    var prox = CL.filter(function (c) { return c.libres > 0; }).slice(0, 8);
    if (!prox.length) return;
    ol.innerHTML = prox.map(function (c, i) {
      return '<li><button type="button" class="rueda-it" data-r="' + i + '"><small>' + corto(c.k, c.f) + ", " + c.h + "</small>" + c.act.nom + "</button></li>";
    }).join("") + '<li><a class="rueda-it mas" href="#' + sec.id + '">' + T.mas + "</a></li>";
    ol.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-r]");
      if (!b) return;
      var c = prox[+b.getAttribute("data-r")];
      st.franja = "todo"; $$("input[name=franja]").forEach(function (r) { r.checked = r.value === "todo"; });
      st.sel = c; ponAct(c.act.i, 1); elegir(c, true);
    });
    if (!G) return;
    s.classList.add("vivo");
    var lis = $$("li", ol), fs = 0, ultimo = -9;
    function mide() { fs = parseFloat(getComputedStyle(ol).fontSize) || 40; }
    function pinta(p) {
      var c = -0.8 + p * (lis.length - 0.2);
      if (Math.abs(c - ultimo) < 0.004) return; ultimo = c;
      lis.forEach(function (li, i) {
        var d = i - c, ad = Math.abs(d);
        li.style.transform = "translate(" + (d * d * fs * 0.32).toFixed(1) + "px, calc(-50% + " + (d * fs * 1.9).toFixed(1) + "px))";
        li.style.opacity = Math.max(0.55, 1 - ad * 0.2).toFixed(3); // nunca por debajo de .55: el texto sigue pasando el contraste de texto grande
        li.style.filter = ad < 0.35 ? "none" : "blur(" + Math.min((ad - 0.35) * 2.4, 7).toFixed(1) + "px)";
        li.style.visibility = ad > 4 ? "hidden" : "visible";
        var lejos = ad > 1.2, it = li.firstElementChild; // lo que está lejos del centro, borroso y desvaído, queda fuera del teclado y del lector
        if (it.__lejos !== lejos) { it.__lejos = lejos; if (lejos) { it.setAttribute("aria-hidden", "true"); it.setAttribute("tabindex", "-1"); } else { it.removeAttribute("aria-hidden"); it.removeAttribute("tabindex"); } }
      });
    }
    mide(); pinta(0);
    ScrollTrigger.create({ trigger: s, start: "top top", end: "bottom bottom", onUpdate: function (t) { pinta(t.progress); }, onRefresh: function (t) { mide(); ultimo = -9; pinta(t.progress); } });
  })();

  /* ---------- el bloque rojo: las cifras de la semana ---------- */
  (function () {
    var s = $("[data-rojo]"), cs = $$("[data-cifra]", s);
    var val = { clases: CL.length, plazas: CL.reduce(function (t, c) { return t + c.libres; }, 0) };
    cs.forEach(function (c) { var k = c.getAttribute("data-cifra"); if (k in val) { $("[data-n]", c).textContent = val[k]; c.hidden = false; } });
    if (!G) return;
    s.classList.add("vivo");
    var barra = $("[data-rojo-barra]", s), cur = -1;
    function cuenta(c) { // sube desde ~70 % hasta el valor, por tiempo
      var k = c.getAttribute("data-cifra"); if (!(k in val)) return;
      var n = $("[data-n]", c), fin = val[k], o = { v: Math.round(fin * 0.7) };
      gsap.to(o, { v: fin, duration: 1.1, ease: "power2.out", onUpdate: function () { n.textContent = Math.round(o.v); } });
    }
    function pon(i) {
      if (i === cur) return;
      cs.forEach(function (c, j) { c.classList.toggle("on", j === i); c.classList.toggle("ya", j < i); c.setAttribute("aria-hidden", j === i ? "false" : "true"); });
      cuenta(cs[i]); cur = i;
    }
    pon(0);
    ScrollTrigger.create({ trigger: s, start: "top top", end: "bottom bottom", onUpdate: function (t) {
      barra.style.transform = "scaleX(" + t.progress.toFixed(3) + ")";
      pon(Math.min(cs.length - 1, Math.floor(t.progress * cs.length * 0.999)));
    } });
  })();

  /* ---------- tarifas: ¿cuántos días vas a venir? ---------- */
  (function () {
    var lis = $$("[data-precios] li"), sale = $("[data-sale]");
    var P = {}; T.precios.forEach(function (p) { P[p.k] = p; });
    function pon(v, animar) {
      var li = lis.filter(function (l) { return l.getAttribute("data-dias") === v; })[0];
      lis.forEach(function (l) { l.classList.toggle("on", l === li); });
      if (!li) return;
      var p = P[li.getAttribute("data-precio")], x = p.v / p.clases;
      var t = (Math.round(x * 100) / 100).toFixed(2).replace(".", ",").replace(",00", "");
      sale.textContent = T.sale.replace("8,75", t);
      if (animar && !R) { sale.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 450, easing: EASE }); li.animate([{ transform: "scale(.98)" }, { transform: "scale(1.02)" }, { transform: "none" }], { duration: 450, easing: EASE }); }
    }
    $$("input[name=dias]").forEach(function (r) { r.addEventListener("change", function () { pon(r.value, true); }); });
    var c = $("input[name=dias]:checked"); if (c) pon(c.value, false);
  })();

  /* ---------- barra del móvil: «Reservar la primera clase» cuando no se ve ni la portada, ni el horario, ni el pie ---------- */
  (function () {
    var b = $("[data-barra]"); if (!b || !("IntersectionObserver" in window)) return;
    var vis = new Map(), mira = [$("[data-portada]"), sec, $(".pie")];
    b.hidden = false;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { vis.set(e.target, e.isIntersecting); });
      b.classList.toggle("on", !mira.some(function (m) { return vis.get(m) !== false; }));
    });
    mira.forEach(function (m) { io.observe(m); });
  })();

  /* ---------- movimiento de lo de abajo (por tiempo al asomar; paralaje con el scroll) ---------- */
  if (!G) return;
  document.fonts.ready.then(function () {
    // la foto cuadrada se destapa de abajo arriba y sube un poco más despacio que el texto
    var ff = $(".frase-foto");
    gsap.fromTo(ff, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.3, ease: "power3.out", scrollTrigger: { trigger: ff, start: "top 90%", once: true } });
    gsap.fromTo(ff, { yPercent: 14 }, { yPercent: -14, ease: "none", scrollTrigger: { trigger: ".frase", start: "top bottom", end: "bottom top", scrub: 0.6 } });
    // paneles que entran
    $$("[data-panel]").forEach(function (el) {
      gsap.from(el, { y: 40, opacity: 0, duration: 1.1, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    });
    // fotos de fondo: un poco de paralaje
    gsap.fromTo(".op-foto img", { scale: 1.12, yPercent: -4 }, { scale: 1, yPercent: 4, ease: "none", scrollTrigger: { trigger: ".opinion", start: "top bottom", end: "bottom top", scrub: 0.6 } });
    gsap.fromTo(".fin-foto img", { scale: 1.14 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".final", start: "top bottom", end: "bottom bottom", scrub: 0.6 } });
    // las fotos que pasan junto a las tarifas (en el ordenador, a distinta velocidad)
    var tar = $("[data-tarifas]");
    var mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", function () {
      tar.classList.add("vivo");
      $$("[data-flot]", tar).forEach(function (f) {
        var v = +f.getAttribute("data-flot");
        gsap.fromTo(f, { y: 0 }, { y: function () { return v * window.innerHeight / 100 * 2.2; }, ease: "none", scrollTrigger: { trigger: tar, start: "top bottom", end: "bottom top", scrub: 0.6, invalidateOnRefresh: true } });
      });
      ScrollTrigger.refresh();
      return function () { tar.classList.remove("vivo"); };
    });
    $$("[data-flot] img").forEach(function (im) {
      gsap.from(im, { opacity: 0, scale: 1.06, duration: 1.2, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: im, start: "top 95%", once: true } });
    });
  });
})();
