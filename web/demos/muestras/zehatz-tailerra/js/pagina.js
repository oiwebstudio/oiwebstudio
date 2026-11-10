/* ZEHATZ · lo que se mueve y lo que reacciona (OI Studio, 10/11/2026).
   1. ¿Qué le pasa a tu coche?: tocas una ficha (ruido raro, testigo, revisión, ITV, frenos, neumáticos) y debajo sale qué miramos,
      cuánto suele llevar y el precio orientativo («desde X €», de ejemplo); con la matrícula y el modelo se escribe el mensaje de WhatsApp (wa.me con el texto ya puesto). Nada se
      envía solo: lo manda la persona desde su WhatsApp.
   2. Presupuesto antes de tocar nada: ejemplo de cómo llega por WhatsApp. «Sí, adelante» → «Empezamos ahora…» y, tras «escribiendo…»,
      «Ya está listo…» con la hora a la que se puede pasar según la hora real de Villabona y el horario. «Me lo pienso» → «No tocamos
      nada hasta que nos digas». Las horas de los mensajes son la hora real.
   3. Abierto o cerrado según la hora real (pie). 4. Menú del móvil.
   5. Paneles que entran al asomar (GSAP + ScrollTrigger), por tiempo; con «reducir movimiento» o sin GSAP, todo quieto y visible. */
(function () {
  "use strict";
  var T = JSON.parse(document.getElementById("textos").textContent);
  var WA = "https://wa.me/34600000000";
  var quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- hora de Villabona ---------- */
  function ahora() {
    try {
      var o = {};
      new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
        .formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
      return { dia: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday], min: +o.hour * 60 + +o.minute, hh: o.hour, mm: o.minute };
    } catch (e) { var n = new Date(); return { dia: n.getDay(), min: n.getHours() * 60 + n.getMinutes(), hh: String(n.getHours()).padStart(2, "0"), mm: String(n.getMinutes()).padStart(2, "0") }; }
  }
  // Horario de ejemplo: lunes a viernes 8:00–13:00 y 15:00–19:00; sábado y domingo cerrado
  var LAB = [[480, 780], [900, 1140]];
  var abre = function (d) { return d >= 1 && d <= 5; };
  function estado(a) {
    if (abre(a.dia)) {
      if (a.min >= 480 && a.min < 780) return { ab: true, t: T.est_ab_13, listo: T.listo_13 };
      if (a.min >= 900 && a.min < 1140) return { ab: true, t: T.est_ab_19, listo: T.listo_19 };
      if (a.min >= 780 && a.min < 900) return { ab: false, t: T.est_ce_tarde, listo: T.listo_15 };
      if (a.min < 480) return { ab: false, t: T.est_ce_hoy, listo: T.listo_hoy };
    }
    // después de las 19:00, o fin de semana: mañana si mañana es laborable; si no, el lunes
    var man = (a.dia + 1) % 7;
    return abre(man) ? { ab: false, t: T.est_ce_manana, listo: T.listo_manana } : { ab: false, t: T.est_ce_lunes, listo: T.listo_lunes };
  }
  var est = $("[data-estado]");
  function pintaEstado() { if (!est) return; var e = estado(ahora()); est.textContent = e.t; est.classList.toggle("abierto", e.ab); }
  pintaEstado();
  setInterval(pintaEstado, 60000);
  var hora = function () { var a = ahora(); return a.hh + ":" + a.mm; };

  /* ---------- menú del móvil ---------- */
  var menu = $("[data-menu]"), mBtn = $("[data-menu-btn]"), mCerrar = $("[data-menu-cerrar]");
  function abrirMenu(si) {
    menu.hidden = !si; mBtn.setAttribute("aria-expanded", si ? "true" : "false");
    document.documentElement.style.overflow = si ? "hidden" : "";
    (si ? mCerrar : mBtn).focus();
  }
  if (menu && mBtn) {
    mBtn.addEventListener("click", function () { abrirMenu(true); });
    mCerrar.addEventListener("click", function () { abrirMenu(false); });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { abrirMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) abrirMenu(false); });
  }

  /* ---------- 1. ¿qué le pasa a tu coche? ---------- */
  var fichas = $$("[data-motivo]"), lista = $("[data-fichas]"), panel = $("[data-elegido]");
  var tit = $("[data-el-tit]"), datos = $("[data-el-datos]"), q = $("[data-el-q]"), d = $("[data-el-d]"), pr = $("[data-el-p]");
  var mat = $("[data-matricula]"), mod = $("[data-modelo]"), msg = $("[data-mensaje]"), wa = $("[data-wa]");
  var elegido = null, tit0 = tit ? tit.textContent : "";
  function mensaje() {
    var m = elegido ? T.motivos[elegido].m : T.m_nada;
    var partes = [T.wa_hola, m];
    var vm = (mat.value || "").trim().toUpperCase(), vd = (mod.value || "").trim();
    if (vd) partes.push(T.wa_mod + " " + vd + ".");
    if (vm) partes.push(T.wa_mat + " " + vm + ".");
    partes.push(T.wa_cuando);
    var txt = partes.join(" ");
    // en pantalla, la matrícula y el modelo resaltados para que se vea que entran en el mensaje
    msg.textContent = "";
    partes.forEach(function (p, i) {
      if (i) msg.appendChild(document.createTextNode(" "));
      if ((vd && p === T.wa_mod + " " + vd + ".") || (vm && p === T.wa_mat + " " + vm + ".")) { var s = document.createElement("span"); s.className = "mat"; s.textContent = p; msg.appendChild(s); }
      else msg.appendChild(document.createTextNode(p));
    });
    wa.href = WA + "?text=" + encodeURIComponent(txt);
  }
  function elegir(k, desdeToque) {
    elegido = elegido === k ? null : k;
    fichas.forEach(function (f) { f.setAttribute("aria-pressed", f.getAttribute("data-motivo") === elegido ? "true" : "false"); });
    lista.classList.toggle("hay-una", !!elegido);
    if (elegido) {
      var M = T.motivos[elegido];
      tit.textContent = M.t; q.textContent = M.q; d.textContent = M.d; pr.textContent = M.p;
      datos.hidden = false;
    } else { tit.textContent = tit0; datos.hidden = true; }
    if (!quieto) { var que = $(".que", panel); que.classList.remove("cambia"); void que.offsetWidth; que.classList.add("cambia"); }
    mensaje();
    // si lo elegido queda fuera de la pantalla (móvil), se baja hasta ello
    if (elegido && desdeToque) {
      var r = panel.getBoundingClientRect();
      if (r.top > innerHeight * .72 || r.bottom < 0) panel.scrollIntoView({ behavior: quieto ? "auto" : "smooth", block: "start" });
    }
  }
  fichas.forEach(function (f) { f.addEventListener("click", function () { elegir(f.getAttribute("data-motivo"), true); }); });
  if (mat) { mat.addEventListener("input", mensaje); mod.addEventListener("input", mensaje); mensaje(); }

  /* ---------- 2. presupuesto por WhatsApp (ejemplo) ---------- */
  var burbujas = $("[data-burbujas]"), botones = $("[data-botones]"), otra = $("[data-otra]"), relojes = [];
  var primera = burbujas ? burbujas.firstElementChild : null;
  var h0 = $("[data-hora]"); if (h0) h0.textContent = hora();
  function burbuja(txt, mia, clase) {
    var b = document.createElement("div");
    b.className = "burbuja" + (mia ? " mia" : "") + (clase ? " " + clase : "") + (quieto ? "" : " entra");
    var s = document.createElement("span"); s.className = "quien"; s.textContent = mia ? T.de_tu : T.de_zehatz; b.appendChild(s);
    b.appendChild(document.createTextNode(txt));
    var h = document.createElement("span"); h.className = "hora"; h.textContent = hora(); b.appendChild(h);
    burbujas.appendChild(b);
    return b;
  }
  var espera = function (ms, fn) { relojes.push(setTimeout(fn, quieto ? 0 : ms)); };
  function escribe(ms, txt) {
    espera(ms, function () {
      var e = burbuja(T.escribiendo, false, "escribe");
      espera(1300, function () { e.remove(); burbuja(txt, false); });
    });
  }
  function responder(r) {
    botones.hidden = true;
    burbuja(r === "si" ? T.yo_si : T.yo_pensar, true);
    if (r === "si") {
      escribe(500, T.resp_empezamos);
      escribe(3200, estado(ahora()).listo);
      espera(5000, function () { otra.hidden = false; });
    } else {
      escribe(500, T.resp_pensar);
      espera(2300, function () { otra.hidden = false; });
    }
  }
  $$("[data-resp]").forEach(function (b) { b.addEventListener("click", function () { responder(b.getAttribute("data-resp")); }); });
  var otraBtn = $("[data-otra-btn]");
  if (otraBtn) otraBtn.addEventListener("click", function () {
    relojes.forEach(clearTimeout); relojes = [];
    while (primera.nextSibling) burbujas.removeChild(primera.nextSibling);
    otra.hidden = true; botones.hidden = false; $("[data-resp]", botones).focus();
  });

  /* ---------- 5. paneles que entran al asomar ---------- */
  if (!window.gsap || !window.ScrollTrigger || quieto) return;
  gsap.registerPlugin(ScrollTrigger);
  var E = "power3.out";
  var una = function (el, o) { var b = { trigger: el, start: "top 86%", once: true }; for (var k in o) b[k] = o[k]; return b; };
  // frase centrada
  var lema = $(".lema"); if (lema) gsap.from(lema, { y: 24, opacity: 0, duration: 1.3, ease: E, clearProps: "transform,opacity", scrollTrigger: una(lema, { start: "top 95%" }) });
  // tira: cada foto se abre desde abajo, una detrás de otra
  $$(".tira figure").forEach(function (f, i) {
    gsap.fromTo(f, { clipPath: "inset(18% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: E, delay: i * .12, scrollTrigger: una($(".tira")) });
    gsap.from($("img", f), { scale: 1.16, duration: 1.8, ease: E, delay: i * .12, scrollTrigger: una($(".tira")) });
  });
  // fichas: entran de dos en dos y la foto se asienta
  $$(".fichas > li").forEach(function (li, i) {
    gsap.from(li, { y: 40, opacity: 0, duration: 1.2, ease: E, delay: (i % 2) * .1, clearProps: "transform,opacity", scrollTrigger: una(li, { start: "top 92%" }) });
  });
  var el = $(".elegido"); if (el) gsap.from(el.children, { y: 28, opacity: 0, duration: 1.1, ease: E, stagger: .12, clearProps: "transform,opacity", scrollTrigger: una(el) });
  var ch = $(".chat"); if (ch) gsap.from(ch, { x: 40, opacity: 0, duration: 1.3, ease: E, clearProps: "transform,opacity", scrollTrigger: una(ch) });
  $$(".centro .caja, .presu .cabeza .caja, .fin-cita > *").forEach(function (c) { gsap.from(c, { y: 18, opacity: 0, duration: 1, ease: E, clearProps: "transform,opacity", scrollTrigger: una(c, { start: "top 96%" }) }); });
  // foto de cierre: se abre de los lados al centro
  var fin = $(".fin");
  if (fin) {
    gsap.fromTo(fin, { clipPath: "inset(0% 8% 0% 8%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: E, scrollTrigger: una(fin, { start: "top 85%" }) });
    gsap.from($("img", fin), { scale: 1.12, duration: 2, ease: E, scrollTrigger: una(fin, { start: "top 85%" }) });
  }
  $$(".pie-arriba > div").forEach(function (c, i) { gsap.from(c, { y: 22, opacity: 0, duration: 1, delay: i * .08, ease: E, clearProps: "transform,opacity", scrollTrigger: una($(".pie-arriba"), { start: "top 96%" }) }); });
})();
