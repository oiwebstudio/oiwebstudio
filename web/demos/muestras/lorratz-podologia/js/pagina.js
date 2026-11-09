/* LORRATZ · muestra de podología (OI Studio, 9/11/2026). Menú, «¿qué te pasa?» → tratamiento, minutos y WhatsApp escrito, días reales,
   abierto/cerrado según la hora de Tolosa, y paneles que entran al asomar.
   Sin JS o con «reducir movimiento»: todo se ve quieto y completo. Es una muestra: no se envía nada a ningún sitio (WhatsApp lo abre la persona). */
(function () {
  var T = JSON.parse(document.getElementById("textos").textContent);
  var R = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var EASE = "cubic-bezier(.2,.75,.25,1)";
  var pop = function (el) { if (!R && el && el.animate) el.animate([{ transform: "scale(1)" }, { transform: "scale(1.025)" }, { transform: "scale(1)" }], { duration: 340, easing: EASE }); };
  var limpia = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); };

  /* ---------- hora de Tolosa ---------- */
  function ahora() {
    try {
      var o = {};
      new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
        .formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
      return { y: +o.year, m: +o.month, d: +o.day, dia: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday], min: +o.hour * 60 + +o.minute };
    } catch (e) { var n = new Date(); return { y: n.getFullYear(), m: n.getMonth() + 1, d: n.getDate(), dia: n.getDay(), min: n.getHours() * 60 + n.getMinutes() }; }
  }
  var A = ahora();
  var hoyUTC = Date.UTC(A.y, A.m - 1, A.d);

  /* ---------- menú del móvil ---------- */
  var bm = $(".cab-menu"), menu = $("#menu");
  if (bm && menu) {
    var abre = function (si) {
      menu.classList.toggle("abierto", si); document.body.classList.toggle("menu-abierto", si);
      bm.setAttribute("aria-expanded", si); bm.textContent = si ? T.cerrar : T.menu;
    };
    bm.addEventListener("click", function () { abre(!menu.classList.contains("abierto")); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) abre(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu.classList.contains("abierto")) { abre(false); bm.focus(); } });
  }

  /* ---------- ¿qué te pasa? → la caja negra ---------- */
  var form = $("[data-cita]"), losas = $(".losas");
  var botones = $$("[data-prob]");
  var elegido = botones.length ? botones[0].getAttribute("data-prob") : null;
  var eTit = $("[data-t-tit]"), eP = $("[data-t-p]"), eProb = $("[data-t-prob]"), eMin = $("[data-t-min]");
  var msg = $("[data-msg]"), wa = $("[data-wa]");

  /* los próximos cinco días abiertos, con su fecha (hoy, si aún queda turno) */
  var cajaDias = $("[data-dias]");
  if (cajaDias) {
    var html = "", n = 0;
    for (var k = 0; n < 5 && k < 14; k++) {
      var f = new Date(hoyUTC + k * 864e5), d = f.getUTCDay(), fr = T.H[d];
      if (!fr.length) continue;
      if (k === 0 && A.min >= fr[fr.length - 1][1] - 60) continue;
      var et = T.dias[d] + " " + f.getUTCDate() + (k === 0 ? " (" + T.hoy + ")" : "");
      html += '<label class="opc"><input type="radio" name="dia" value="' + d + '" data-hoy="' + (k === 0 ? 1 : 0) + '" data-t="' + et + '"' + (n === 0 ? " checked" : "") + "><span>" + et + "</span></label>";
      n++;
    }
    cajaDias.innerHTML = html;
  }

  /* los minutos giran del valor de antes al nuevo */
  var minActual = eMin ? +eMin.textContent : 0;
  function cuenta(a) {
    if (!eMin) return;
    var de = minActual; minActual = a;
    if (R || de === a) { eMin.textContent = a; return; }
    var t0 = performance.now(), dur = 520;
    (function paso(t) {
      var x = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - x, 3);
      eMin.textContent = Math.round(de + (a - de) * e);
      if (x < 1) requestAnimationFrame(paso);
    })(t0);
  }

  function mensaje(anima) {
    if (!form) return;
    var P = T.prob[elegido], dia = $('input[name="dia"]:checked', form);
    /* hoy solo queda la tarde si ya ha pasado la mañana */
    var tm = $('input[name="turno"][value="m"]', form);
    var hoy = dia && dia.getAttribute("data-hoy") === "1";
    tm.disabled = hoy && A.min >= T.H[A.dia][0][1] - 60;
    if (tm.disabled && tm.checked) $('input[name="turno"][value="t"]', form).checked = true;
    var turno = $('input[name="turno"]:checked', form);
    var lineas = [T.wa_hola, T.wa_que + ": " + P.n, T.wa_trat + ": " + P.t + " (" + P.min + " " + T.minutos + ")",
      T.wa_dia + ": " + dia.getAttribute("data-t") + " (" + turno.getAttribute("data-t").toLowerCase() + ")"];
    msg.innerHTML = lineas.map(limpia).join("<br>");
    wa.href = T.WA + "?text=" + encodeURIComponent(lineas.join("\n"));
    if (anima) pop(msg);
  }

  function elige(k, anima) {
    if (!T.prob[k]) return;
    var cambia = k !== elegido;
    elegido = k;
    botones.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-prob") === k ? "true" : "false"); });
    if (losas) losas.classList.add("elegido");
    var P = T.prob[k];
    if (cambia && !R && eTit && eTit.animate) {
      /* el tratamiento nuevo entra desde abajo */
      eTit.animate([{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(-40%)", opacity: 0 }], { duration: 160, easing: "ease-in" }).onfinish = function () {
        eTit.textContent = P.t; eP.textContent = P.p; eProb.textContent = P.n;
        eTit.animate([{ transform: "translateY(60%)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }], { duration: 520, easing: EASE });
        eP.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 620, delay: 80, easing: EASE, fill: "backwards" });
      };
    } else if (eTit) { eTit.textContent = P.t; eP.textContent = P.p; eProb.textContent = P.n; }
    cuenta(P.min);
    mensaje(anima);
  }

  botones.forEach(function (b) {
    b.addEventListener("click", function () {
      elige(b.getAttribute("data-prob"), true);
      /* en el móvil la caja queda lejos: se baja hasta ella */
      var tj = $("#hitzordua");
      if (tj && innerWidth < 760 && tj.getBoundingClientRect().top > innerHeight * 0.6) tj.scrollIntoView({ behavior: R ? "auto" : "smooth", block: "start" });
    });
  });
  $$("[data-elige]").forEach(function (a) { a.addEventListener("click", function () { elige(a.getAttribute("data-elige"), true); }); });
  if (form) { form.addEventListener("change", function () { mensaje(true); }); mensaje(false); }

  /* ---------- pie: abierto o cerrado ahora, y la línea de hoy ---------- */
  var ab = (T.H[A.dia] || []).some(function (x) { return A.min >= x[0] && A.min < x[1]; });
  var eA = $("[data-ahora]"); if (eA) eA.textContent = ab ? T.abierto : T.cerrado;
  $$(".hor li").forEach(function (li) { if (li.getAttribute("data-dias").split(",").indexOf(String(A.dia)) >= 0) li.classList.add("hoy"); });

  /* ---------- movimiento (solo con GSAP y sin «reducir movimiento») ---------- */
  if (R || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  /* la foto de la portada baja un poco más despacio que la página (paralaje) */
  var pf = $(".portada-foto");
  if (pf) gsap.to(pf, { yPercent: 14, ease: "none", scrollTrigger: { trigger: ".portada", start: "top top", end: "bottom top", scrub: 0.4 } });
  /* fotos que se abren al asomar (por tiempo, no atadas al scroll) */
  $$('[data-panel="foto"]').forEach(function (el, i) {
    gsap.fromTo(el, { clipPath: "inset(12% 0% 0% 0%)", opacity: 0, y: 30 }, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, y: 0, duration: 1.3, delay: (i % 3) * 0.08, ease: "power3.out", clearProps: "clipPath,opacity,transform", scrollTrigger: { trigger: el, start: "top 92%", once: true } });
  });
  $$('[data-panel="sube"]').forEach(function (el) {
    gsap.from(el, { y: 50, opacity: 0, duration: 1.2, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
  });
  /* franjas con foto pálida: la foto entra con un fundido lento */
  $$(".intro-foto, .pie-foto").forEach(function (el) {
    gsap.from(el, { opacity: 0, scale: 1.04, duration: 1.6, ease: "power2.out", clearProps: "opacity,transform", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
  });
  /* el párrafo de la franja y de la pisada, detrás del titular */
  $$(".intro-in > p, .pisada-a > p, .pisada .btn, .zer-cab p").forEach(function (el) {
    gsap.from(el, { y: 24, opacity: 0, duration: 1.1, delay: 0.15, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
  });
})();
