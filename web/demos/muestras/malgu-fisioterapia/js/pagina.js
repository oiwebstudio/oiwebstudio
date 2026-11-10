/* MALGU · muestra de fisioterapia (OI Studio, 10/11/2026). Menú del móvil, «¿dónde te duele?» → tratamiento, sesiones y WhatsApp escrito,
   días reales para la primera cita, reloj de 30 s en los ejercicios, abierto/cerrado según la hora de Tolosa, filas de losas que corren
   de lado con el scroll y paneles que entran al asomar.
   Sin JS o con «reducir movimiento»: todo se ve quieto y completo. Es una muestra: no se envía nada a ningún sitio (WhatsApp lo abre la persona). */
(function () {
  var T = JSON.parse(document.getElementById("textos").textContent);
  var R = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var EASE = "cubic-bezier(.2,.75,.25,1)";
  var pop = function (el) { if (!R && el && el.animate) el.animate([{ transform: "scale(1)" }, { transform: "scale(1.03)" }, { transform: "scale(1)" }], { duration: 360, easing: EASE }); };
  var limpia = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); };
  var may = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };

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
  function fmt(f, o) { try { return new Intl.DateTimeFormat(T.lang, Object.assign({ timeZone: "UTC" }, o)).format(f); } catch (e) { return ""; } }

  /* ---------- menú del móvil ---------- */
  var bm = $(".cab-menu"), menu = $("#menu"), bmT = $("[data-menu-t]");
  if (bm && menu) {
    var abre = function (si) {
      menu.classList.toggle("abierto", si); document.body.classList.toggle("menu-abierto", si);
      bm.setAttribute("aria-expanded", si); if (bmT) bmT.textContent = si ? T.cerrar : T.menu;
      if (si && !R && menu.animate) menu.animate([{ opacity: 0, transform: "translateY(-8px)" }, { opacity: 1, transform: "none" }], { duration: 320, easing: EASE });
    };
    bm.addEventListener("click", function () { abre(!menu.classList.contains("abierto")); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) abre(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu.classList.contains("abierto")) { abre(false); bm.focus(); } });
  }

  /* ---------- la primera cita: los próximos cinco días abiertos con su fecha (hoy, si queda al menos una hora) ---------- */
  var form = $("[data-cita]");
  var cajaDias = $("[data-dias]");
  if (cajaDias) {
    var html = "", n = 0;
    for (var k = 0; n < 5 && k < 14; k++) {
      var f = new Date(hoyUTC + k * 864e5), d = f.getUTCDay(), fr = T.H[d];
      if (!fr.length) continue;
      if (k === 0 && A.min >= fr[fr.length - 1][1] - 60) continue;
      /* en euskera, los nombres de los días vienen de Itzultzaile (no todos los navegadores traen el euskera en Intl) */
      var corto = T.dias ? T.dias[d] : fmt(f, { weekday: "short" }).replace(/\.$/, ""), largo = T.dias ? T.dias[d] : fmt(f, { weekday: "long" });
      var num = f.getUTCDate();
      var chip = corto ? corto.toUpperCase() + " " + num : String(num);
      var txt = (largo || corto) + " " + num + (k === 0 ? " (" + T.hoy + ")" : "");
      html += '<label class="opc"><input type="radio" name="dia" value="' + k + '" data-hoy="' + (k === 0 ? 1 : 0) + '" data-t="' + limpia(txt) + '" data-c="' + limpia(chip) + '"' + (n === 0 ? " checked" : "") + "><span>" + limpia(k === 0 ? chip + " · " + T.hoy : chip) + "</span></label>";
      n++;
    }
    if (html) cajaDias.innerHTML = html;
  }

  /* ---------- ¿dónde te duele? → la hoja de arriba y el mensaje ---------- */
  var botones = $$("[data-zona]");
  var elegida = botones.length ? botones[0].getAttribute("data-zona") : "espalda";
  var aTit = $("[data-a-tit]"), aT = $("[data-a-t]"), aN = $("[data-a-n]"), bDia = $("[data-b-dia]");
  var msg = $("[data-msg]"), wa = $("[data-wa]");

  function mensaje(anima) {
    if (!form) return;
    var Z = T.zona[elegida];
    var dia = $('input[name="dia"]:checked', form);
    var tm = $('input[name="turno"][value="m"]', form);
    /* hoy, si ya ha pasado la mañana, solo queda la tarde */
    tm.disabled = !!dia && dia.getAttribute("data-hoy") === "1" && A.min >= 13 * 60;
    if (tm.disabled && tm.checked) $('input[name="turno"][value="t"]', form).checked = true;
    var turno = $('input[name="turno"]:checked', form), vez = $('input[name="vez"]:checked', form);
    var lineas = [T.wa_hola, T.wa_zona + ": " + Z.n.toLowerCase(),
      T.wa_dia + ": " + dia.getAttribute("data-t") + ", " + turno.getAttribute("data-t").toLowerCase(),
      T.wa_visita + ": " + vez.getAttribute("data-t").toLowerCase()];
    msg.innerHTML = lineas.map(limpia).join("<br>");
    wa.href = T.WA + "?text=" + encodeURIComponent(lineas.join("\n"));
    if (bDia) {
      var nuevo = dia.getAttribute("data-c") || dia.getAttribute("data-t");
      if (bDia.textContent !== nuevo) {
        if (anima && !R && bDia.animate) {
          bDia.animate([{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(-30%)", opacity: 0 }], { duration: 150, easing: "ease-in" }).onfinish = function () {
            bDia.textContent = nuevo; bDia.animate([{ transform: "translateY(40%)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 480, easing: EASE });
          };
        } else bDia.textContent = nuevo;
      }
    }
    if (anima) pop(msg);
  }

  function rueda(el, txt) {
    if (!el || el.textContent === txt) return;
    if (R || !el.animate) { el.textContent = txt; return; }
    el.animate([{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(-45%)", opacity: 0 }], { duration: 160, easing: "ease-in" }).onfinish = function () {
      el.textContent = txt;
      el.animate([{ transform: "translateY(55%)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 520, easing: EASE });
    };
  }

  function elige(k, anima) {
    if (!T.zona[k]) return;
    var Z = T.zona[k];
    elegida = k;
    botones.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-zona") === k ? "true" : "false"); });
    rueda(aTit, Z.n);
    rueda(aN, Z.s);
    if (aT) {
      aT.textContent = Z.t;
      if (anima && !R && aT.animate) aT.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 620, delay: 120, easing: EASE, fill: "backwards" });
    }
    mensaje(anima);
  }

  botones.forEach(function (b) {
    b.addEventListener("click", function () {
      elige(b.getAttribute("data-zona"), true);
      var h = $("#hoja-a");
      if (h) setTimeout(function () { h.scrollIntoView({ behavior: R ? "auto" : "smooth", block: "start" }); }, 180);
    });
  });
  $$("[data-elige]").forEach(function (a) { a.addEventListener("click", function () { elige(a.getAttribute("data-elige"), false); }); });
  if (form) { form.addEventListener("change", function () { mensaje(true); }); mensaje(false); }

  /* ---------- reloj de 30 segundos en cada ejercicio ---------- */
  $$("[data-reloj]").forEach(function (b) {
    var num = $(".r-n", b), t = null;
    b.addEventListener("click", function () {
      clearInterval(t);
      b.classList.remove("corre", "hecho"); num.textContent = "30";
      void b.offsetWidth; /* para que el anillo vuelva a empezar */
      b.classList.add("corre");
      var fin = Date.now() + 30000;
      t = setInterval(function () {
        var s = Math.max(0, Math.ceil((fin - Date.now()) / 1000));
        num.textContent = s;
        if (s === 0) { clearInterval(t); b.classList.remove("corre"); b.classList.add("hecho"); num.textContent = T.listo; pop(b); }
      }, 250);
      pop(b);
    });
  });

  /* ---------- abierto o cerrado ahora, y la línea de hoy del horario ---------- */
  var ab = (T.H[A.dia] || []).some(function (x) { return A.min >= x[0] && A.min < x[1]; });
  $$("[data-ahora]").forEach(function (e) { e.textContent = ab ? T.abierto : T.cerrado; });
  var e2 = $("[data-ahora2]"); if (e2) e2.textContent = ab ? T.abierto : T.cerrado;
  $$(".hor li").forEach(function (li) { if (li.getAttribute("data-dias").split(",").indexOf(String(A.dia)) >= 0) li.classList.add("hoy"); });

  /* ---------- preguntas: la respuesta entra al abrir ---------- */
  $$("details.pr").forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (d.open && !R) { var r = $(".pr-r", d); if (r && r.animate) r.animate([{ opacity: 0, transform: "translateY(-6px)" }, { opacity: 1, transform: "none" }], { duration: 420, easing: EASE }); }
    });
  });

  /* ---------- movimiento (solo con GSAP y sin «reducir movimiento») ---------- */
  if (R || !window.gsap || !window.ScrollTrigger) { $$(".pista").forEach(function (p) { p.style.flexWrap = "wrap"; p.style.width = "auto"; p.style.justifyContent = "center"; }); return; }
  gsap.registerPlugin(ScrollTrigger);
  /* las dos filas de losas corren de lado con el scroll, en sentidos contrarios; cada losa pasa entera por la pantalla */
  $$(".pista").forEach(function (p) {
    var dir = +p.getAttribute("data-dir");
    var dist = function () { return Math.max(0, p.scrollWidth - document.documentElement.clientWidth); };
    gsap.fromTo(p, { x: function () { return dir < 0 ? 0 : -dist(); } }, { x: function () { return dir < 0 ? -dist() : 0; }, ease: "none",
      scrollTrigger: { trigger: ".pistas", start: "top bottom", end: "bottom top", scrub: 0.5, invalidateOnRefresh: true } });
  });
  /* fotos que se abren al asomar (por tiempo, no atadas al scroll) */
  $$('[data-panel="foto"]').forEach(function (el, i) {
    gsap.fromTo(el, { clipPath: "inset(10% 4% 0% 4% round 12px)", opacity: 0, y: 30 }, { clipPath: "inset(0% 0% 0% 0% round 12px)", opacity: 1, y: 0, duration: 1.3, delay: (i % 3) * 0.08, ease: "power3.out", clearProps: "clipPath,opacity,transform", scrollTrigger: { trigger: el, start: "top 92%", once: true } });
  });
  $$('[data-panel="sube"]').forEach(function (el, i) {
    gsap.from(el, { y: 50, opacity: 0, duration: 1.15, delay: (i % 3) * 0.08, ease: "power3.out", clearProps: "opacity", scrollTrigger: { trigger: el, start: "top 92%", once: true },
      onComplete: function () { gsap.set(el, { clearProps: "transform" }); } });
  });
  /* las hojas de la cita y el bloque de ejercicios se abren desde abajo */
  $$(".hoja, .ej-in").forEach(function (el) {
    gsap.from(el, { y: 60, opacity: 0, duration: 1.2, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
  });
  /* la foto del bloque de ejercicios se asienta (1.12 → 1) */
  var ef = $(".ej-foto img");
  if (ef) gsap.from(ef, { scale: 1.12, duration: 1.8, ease: "power2.out", clearProps: "transform", scrollTrigger: { trigger: ".ej-in", start: "top 85%", once: true } });
  $$(".zonak-p, .llamar, .cta-dir").forEach(function (el) {
    gsap.from(el, { y: 20, opacity: 0, duration: 1.1, delay: 0.15, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: el, start: "top 94%", once: true } });
  });
  /* el nombre del pie sube al asomar */
  /* con el teclado, la losa que recibe el foco se pone a la vista (la fila vuelve a correr al hacer scroll) */
  $$(".pista").forEach(function (p) {
    p.addEventListener("focusin", function (e) {
      var par = e.target.closest(".par"); if (!par || !par.matches(":focus-visible")) return;
      var vw = document.documentElement.clientWidth, x = par.offsetLeft, w = par.offsetWidth;
      var dist = Math.max(0, p.scrollWidth - vw);
      gsap.to(p, { x: -Math.min(dist, Math.max(0, x - (vw - w) / 2)), duration: 0.5, ease: "power3.out", overwrite: "auto" });
    });
  });
  var pn = $(".pie-nombre");
  if (pn) gsap.from(pn, { yPercent: 40, opacity: 0, duration: 1.3, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: pn, start: "top 96%", once: true } });
})();
