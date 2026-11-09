/* UHAL · lo que se mueve y lo que reacciona (OI Studio, 9/11/2026).
   1. ¿Qué perro traes?: tamaño, pelo y servicio → precio orientativo (los números giran), tiempo, hora a la que estará listo según
      la hora de entrega, la foto grande cambia con el pelo y el mensaje para pedir cita por WhatsApp se escribe solo (con su nombre
      y cómo quiere que le avisen). Nada se envía solo: el botón abre WhatsApp con el texto.
   2. Precios: la columna del tamaño elegido y el precio elegido se marcan; tocar un precio lo pasa a la cita.
   3. Recogida: WhatsApp o llamada; el aviso de ejemplo se escribe («escribiendo…» y el mensaje) con su nombre y la hora de cierre.
   4. Abierto o cerrado según la hora real de Tolosa. 5. Menú del móvil.
   6. Paneles que entran al asomar, por tiempo (GSAP + ScrollTrigger); con «reducir movimiento» o sin GSAP, todo quieto y visible. */
(function () {
  "use strict";
  var T = JSON.parse(document.getElementById("textos").textContent);
  var quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var TAM = ["peq", "med", "gra"];

  /* ---------- hora de Tolosa ---------- */
  function ahora() {
    try {
      var o = {};
      new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
        .formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
      return { dia: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday], min: +o.hour * 60 + +o.minute };
    } catch (e) { var n = new Date(); return { dia: n.getDay(), min: n.getHours() * 60 + n.getMinutes() }; }
  }
  var hm = function (s) { var p = s.split(":"); return +p[0] * 60 + +p[1]; };
  var txtHora = function (m) { return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); };
  var durTxt = function (m) { return (m >= 60 ? Math.floor(m / 60) + " h" : "") + (m % 60 ? (m >= 60 ? " " : "") + (m % 60) + " min" : ""); };

  /* ---------- abierto / cerrado (L-V 09:00-13:30 y 15:30-19:30; S 09:00-13:00) ---------- */
  function estadoTxt(a) {
    var lv = a.dia >= 1 && a.dia <= 5, sab = a.dia === 6;
    if (lv && a.min >= 540 && a.min < 810) return T.est_ab_1330;
    if (lv && a.min >= 930 && a.min < 1170) return T.est_ab_1930;
    if (sab && a.min >= 540 && a.min < 780) return T.est_ab_1300;
    if (lv && a.min >= 810 && a.min < 930) return T.est_ce_tarde;
    if ((lv || sab) && a.min < 540) return T.est_ce_hoy;
    if (a.dia >= 1 && a.dia <= 4) return T.est_ce_manana;
    if (a.dia === 5) return T.est_ce_manana; // el viernes por la noche abre el sábado
    return T.est_ce_lunes;                   // sábado tarde y domingo
  }
  var est = $("[data-estado]");
  if (est) { est.textContent = estadoTxt(ahora()); setInterval(function () { est.textContent = estadoTxt(ahora()); }, 60000); }

  /* ---------- menú del móvil ---------- */
  var menu = $("[data-menu]"), mBtn = $("[data-menu-btn]");
  function cierraMenu() { menu.hidden = true; menu.classList.remove("abre"); mBtn.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; }
  if (menu && mBtn) {
    mBtn.addEventListener("click", function () { menu.hidden = false; menu.classList.add("abre"); mBtn.setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden"; $("a", menu).focus(); });
    $("[data-menu-cerrar]").addEventListener("click", function () { cierraMenu(); mBtn.focus(); });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", cierraMenu); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) { cierraMenu(); mBtn.focus(); } });
  }

  /* ---------- la cita ---------- */
  var form = $("[data-calc]");
  if (!form) return;
  var val = function (n) { var i = $('input[name="' + n + '"]:checked'); return i ? i.value : null; };
  var nomDe = function (n) { var i = $('input[name="' + n + '"]:checked'); return i ? i.dataset.nombre : ""; };
  var precioEl = $("[data-precio]"), tiempoEl = $("[data-tiempo]"), listoEl = $("[data-listo]"), msgEl = $("[data-msg]"), waEl = $("[data-wa]");
  var nombreEl = $("#nombre"), avisoRiz = $("[data-aviso-rizado]");
  var precioAhora = +precioEl.textContent, giro = null;

  function giraNumero(hasta) {
    if (giro) cancelAnimationFrame(giro);
    var desde = precioAhora, t0 = performance.now(), dur = quieto ? 0 : 650;
    precioAhora = hasta;
    (function paso(t) {
      var k = dur ? Math.min(1, (t - t0) / dur) : 1, e = 1 - Math.pow(1 - k, 3);
      precioEl.textContent = Math.round(desde + (hasta - desde) * e);
      if (k < 1) giro = requestAnimationFrame(paso);
    })(t0);
  }
  function cuenta() {
    var tam = val("tam"), pelo = val("pelo"), serv = val("serv"), i = TAM.indexOf(tam);
    var euros = T.PRECIO[serv][i] + T.EXTRA[pelo], min = T.MIN[serv][i] + T.MIN_PELO[pelo];
    var entra = hm(val("hora")), sale = entra + min;
    var listo = entra < 810 && sale > 810 ? T.r_listo_tarde.replace("15:30", "15:30") : T.r_listo.replace("12:30", txtHora(Math.ceil(sale / 15) * 15));
    return { tam: tam, pelo: pelo, serv: serv, euros: euros, min: min, entra: entra, sale: entra < 810 && sale > 810 ? 930 : sale, listo: listo };
  }
  function nombrePerro() { var n = (nombreEl.value || "").trim(); return n; }
  function texto(c) {
    var n = nombrePerro();
    return [T.wa_hola, "", T.wa_perro + ": " + (n || T.tu_perro), T.wa_tam + ": " + nomDe("tam"), T.wa_pelo + ": " + nomDe("pelo"),
      T.wa_serv + ": " + nomDe("serv"), T.wa_hora + ": " + val("hora"), "", val("aviso") === "tel" ? T.wa_av_tel : T.wa_av_wa].join("\n");
  }
  var primera = true;
  function pinta(conBurbuja) {
    var c = cuenta();
    if (+precioEl.textContent !== c.euros || giro) giraNumero(c.euros);
    tiempoEl.textContent = durTxt(c.min);
    listoEl.textContent = c.listo;
    msgEl.textContent = texto(c);
    if (conBurbuja && !primera && !quieto) { msgEl.classList.remove("cambia"); void msgEl.offsetWidth; msgEl.classList.add("cambia"); }
    waEl.href = T.wa + "?text=" + encodeURIComponent(texto(c));
    avisoRiz.hidden = !(c.pelo === "rizado" && c.serv === "deslanado");
    marcaTabla(c);
    cambiaFoto(c.pelo);
    pintaRecogida(c);
    primera = false;
  }
  var fotoActual = val("pelo");
  function cambiaFoto(p) {
    if (p === fotoActual) return;
    fotoActual = p;
    $$("[data-foto-pelo]").forEach(function (f) { var on = f.dataset.fotoPelo === p; f.classList.toggle("activa", on); if (on) f.removeAttribute("aria-hidden"); else f.setAttribute("aria-hidden", "true"); });
  }
  form.addEventListener("change", function (e) {
    var lab = e.target.closest && e.target.closest(".op");
    if (lab && !quieto) { lab.classList.remove("salta"); void lab.offsetWidth; lab.classList.add("salta"); }
    if (e.target.name === "aviso") sincroniza("aviso2", e.target.value);
    pinta(true);
  });
  var tecleo = null;
  nombreEl.addEventListener("input", function () { clearTimeout(tecleo); pinta(false); tecleo = setTimeout(function () { escribeAviso(); }, 500); });

  /* precios: columna y precio elegidos; tocar un precio lo pasa a la cita */
  function marcaTabla(c) {
    $$(".celda").forEach(function (b) {
      b.classList.toggle("en-col", b.dataset.tam === c.tam);
      var el = b.dataset.tam === c.tam && b.dataset.serv === c.serv;
      b.classList.toggle("elegida", el); b.setAttribute("aria-pressed", el ? "true" : "false");
    });
  }
  function sincroniza(name, v) { var i = $('input[name="' + name + '"][value="' + v + '"]'); if (i) i.checked = true; }
  $$(".celda").forEach(function (b) {
    b.addEventListener("click", function () {
      sincroniza("tam", b.dataset.tam); sincroniza("serv", b.dataset.serv); pinta(true);
      $("#resultado").scrollIntoView({ behavior: quieto ? "auto" : "smooth", block: "center" });
    });
  });

  /* recogida: WhatsApp o llamada, y el aviso de ejemplo que se escribe */
  var chat = $("[data-chat]"), llamada = $("[data-llamada]"), chatTxt = $("[data-chat-txt]"), ultimo = null, visto = false, reloj = null;
  function cierre(c) { return c.sale <= 810 ? "13:30" : "19:30"; }
  function pintaRecogida(c) {
    var porTel = val("aviso") === "tel";
    chat.hidden = porTel; llamada.hidden = !porTel;
    var n = nombrePerro() || T.tu_perro;
    var t = n + ": " + T.rec_msg.replace("19:30", cierre(c));
    if (t !== ultimo) { ultimo = t; if (visto) escribeAviso(); else chatTxt.textContent = t; }
  }
  function escribeAviso() {
    if (quieto || !visto) { chatTxt.textContent = ultimo; return; }
    clearTimeout(reloj);
    chat.classList.add("escribe");
    reloj = setTimeout(function () { chatTxt.textContent = ultimo; chat.classList.remove("escribe"); }, 1100);
  }
  $$('input[name="aviso2"]').forEach(function (i) {
    i.addEventListener("change", function () {
      var lab = i.closest(".op"); if (!quieto) { lab.classList.remove("salta"); void lab.offsetWidth; lab.classList.add("salta"); }
      sincroniza("aviso", i.value); pinta(false);
    });
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e, o) { if (e[0].isIntersecting) { visto = true; escribeAviso(); o.disconnect(); } }, { threshold: 0.4 }).observe($("[data-aviso-demo]"));
  } else visto = true;

  pinta(false);

  /* ---------- paneles que entran al asomar (por tiempo, no atados al scroll) ---------- */
  if (window.gsap && window.ScrollTrigger && !quieto) {
    gsap.registerPlugin(ScrollTrigger);
    $$("[data-panel]").forEach(function (p) {
      gsap.from(p, { y: 40, opacity: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: p, start: "top 88%", once: true } });
    });
    $$(".rec-foto img, .marco").forEach(function (f) {
      gsap.fromTo(f, { clipPath: "inset(12% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.3, ease: "power3.out", scrollTrigger: { trigger: f, start: "top 88%", once: true } });
    });
    $$("fieldset", form).forEach(function (f, i) {
      gsap.from(f, { y: 22, opacity: 0, duration: 1, delay: i * 0.07, ease: "power3.out", scrollTrigger: { trigger: form, start: "top 85%", once: true } });
    });
  }
})();
