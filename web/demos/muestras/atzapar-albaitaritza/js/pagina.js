/* ATZAPAR · muestra de veterinaria (OI Studio, 9/11/2026). Cabecera, menú, cita por WhatsApp, aviso de la vacuna, horario de hoy y paneles.
   Sin JS o con «reducir movimiento»: todo se ve quieto y completo. Es una muestra: no se envía nada a ningún sitio (WhatsApp lo abre la persona). */
(function () {
  var T = JSON.parse(document.getElementById("textos").textContent);
  var R = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var pop = function (el) { if (!R && el && el.animate) el.animate([{ transform: "scale(1)" }, { transform: "scale(1.04)" }, { transform: "scale(1)" }], { duration: 320, easing: "cubic-bezier(.2,.75,.25,1)" }); };

  /* ---------- hora de Tolosaldea ---------- */
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

  /* ---------- cabecera: se esconde al bajar, vuelve al subir con fondo blanco ---------- */
  var cab = $("[data-cab]"), ultimo = 0, menuAb = false;
  function cabecera() {
    var y = window.scrollY, alto = window.innerHeight * 0.85;
    cab.classList.toggle("solida", y > alto);
    if (!menuAb) cab.classList.toggle("oculta", y > alto && y > ultimo + 2);
    if (y < ultimo - 2 || y <= alto) cab.classList.remove("oculta");
    ultimo = y;
  }
  if (cab) { window.addEventListener("scroll", cabecera, { passive: true }); cabecera(); }

  /* ---------- menú ---------- */
  var hb = $(".hamb"), menu = $("#menu");
  if (hb && menu) {
    var cierra = function () { menuAb = false; menu.classList.remove("abierto"); hb.setAttribute("aria-expanded", "false"); hb.setAttribute("aria-label", T.menu); };
    hb.addEventListener("click", function () {
      menuAb = !menu.classList.contains("abierto");
      menu.classList.toggle("abierto", menuAb); hb.setAttribute("aria-expanded", menuAb); hb.setAttribute("aria-label", menuAb ? T.cerrar : T.menu);
    });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) cierra(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menuAb) { cierra(); hb.focus(); } });
    document.addEventListener("click", function (e) { if (menuAb && !e.target.closest(".cab")) cierra(); });
  }

  /* ---------- cita: animal, motivo, día y turno → mensaje de WhatsApp escrito ---------- */
  var form = $("[data-cita]");
  var animalElegido = function () { var i = $('input[name="animal"]:checked'); return i ? i.getAttribute("data-t") : ""; };
  if (form) {
    /* los próximos seis días abiertos, con su fecha (hoy, si aún queda turno) */
    var cajaDias = $("[data-dias]", form);
    var html = "", n = 0;
    for (var k = 0; n < 6 && k < 14; k++) {
      var f = new Date(hoyUTC + k * 864e5), d = f.getUTCDay(), fr = T.H[d];
      if (!fr.length) continue;
      if (k === 0 && A.min >= fr[fr.length - 1][1] - 60) continue;
      var et = T.dias[d] + " " + f.getUTCDate() + (k === 0 ? " (" + T.hoy + ")" : "");
      html += '<label class="opc dia"><input type="radio" name="dia" value="' + d + '" data-t="' + et + '"' + (n === 0 ? " checked" : "") + "><span>" + et + "</span></label>";
      n++;
    }
    cajaDias.innerHTML = html;

    var fotos = $$("[data-animal-foto]"), malo = $("[data-malo]"), msg = $("[data-msg]"), wa = $("[data-wa]");
    var turnoT = $('input[name="turno"][value="t"]');
    function actualiza(e) {
      var animal = $('input[name="animal"]:checked', form), motivo = $('input[name="motivo"]:checked', form), dia = $('input[name="dia"]:checked', form);
      /* el sábado solo hay mañana */
      var sab = dia && dia.value === "6";
      turnoT.disabled = sab;
      if (sab && turnoT.checked) $('input[name="turno"][value="m"]').checked = true;
      var turno = $('input[name="turno"]:checked', form);
      fotos.forEach(function (fo) { fo.classList.toggle("on", fo.getAttribute("data-animal-foto") === animal.value); });
      if (malo) malo.hidden = motivo.value !== "malo";
      var lineas = [T.wa_hola, T.wa_animal + ": " + animal.getAttribute("data-t"), T.wa_motivo + ": " + motivo.getAttribute("data-t"),
        T.wa_dia + ": " + dia.getAttribute("data-t") + " (" + turno.getAttribute("data-t").toLowerCase() + ")"];
      msg.innerHTML = lineas.map(function (l) { return l.replace(/&/g, "&amp;").replace(/</g, "&lt;"); }).join("<br>");
      wa.href = T.WA + "?text=" + encodeURIComponent(lineas.join("\n"));
      if (e) pop(msg.parentNode);
      vacuna();
    }
    form.addEventListener("change", actualiza);
  }

  /* ---------- vacuna: fecha de la última → mes de la siguiente ---------- */
  var vf = $("[data-vac-fecha]"), vres = $("[data-vac-res]"), vya = $("[data-vac-ya]"), vwa = $("[data-wa-vac]");
  var iso = function (t) { var x = new Date(t); return x.getUTCFullYear() + "-" + ("0" + (x.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + x.getUTCDate()).slice(-2); };
  function vacuna(e) {
    if (!vf || !vf.value) { if (vres) vres.textContent = "—"; return; }
    var p = vf.value.split("-"), y = +p[0], m = +p[1], d = +p[2];
    var sig = Date.UTC(y + 1, m - 1, d);
    vres.textContent = T.meses[m - 1] + " " + (y + 1);
    vya.hidden = sig > hoyUTC;
    var fecha = ("0" + d).slice(-2) + "/" + ("0" + m).slice(-2) + "/" + y;
    var lineas = [T.wa_vac_hola, T.wa_animal + ": " + animalElegido(), T.wa_vac_ultima + ": " + fecha];
    vwa.href = T.WA + "?text=" + encodeURIComponent(lineas.join("\n"));
    if (e) pop(vres);
  }
  if (vf) {
    vf.max = iso(hoyUTC);
    vf.min = iso(Date.UTC(A.y - 3, A.m - 1, A.d));
    /* de partida: hace once meses, para que se vea el cálculo */
    vf.value = iso(Date.UTC(A.y, A.m - 12, Math.min(A.d, 28)));
    vf.addEventListener("change", vacuna);
    vf.addEventListener("input", vacuna);
  }
  if (form) actualiza(); else vacuna();

  /* ---------- horario del pie: la línea de hoy ---------- */
  $$(".pie-hor li").forEach(function (li) {
    if (li.getAttribute("data-dias").split(",").indexOf(String(A.dia)) < 0) return;
    li.classList.add("hoy");
    var s = document.createElement("span"); s.className = "hoy-t"; s.textContent = T.hoy; li.appendChild(s);
  });

  /* ---------- movimiento (solo con GSAP y sin «reducir movimiento») ---------- */
  if (R || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("js-anim");
  /* la portada se desenfoca detrás de los servicios (fundido con la copia borrosa: solo opacidad) */
  var lau = $(".fondo .lausoa"), p2 = $(".portada-2");
  if (lau && p2) gsap.fromTo(lau, { opacity: 0 }, { opacity: 1, ease: "none", scrollTrigger: { trigger: p2, start: "top 92%", end: "top 30%", scrub: 0.5 } });
  /* paneles que entran al asomar (por tiempo, no atados al scroll) */
  $$('[data-panel="foto"]').forEach(function (el) {
    gsap.fromTo(el, { clipPath: "inset(10% 0% 10% 0% round 40px)", opacity: 0 }, { clipPath: "inset(0% 0% 0% 0% round 0px)", opacity: 1, duration: 1.3, ease: "power3.out", clearProps: "clipPath,opacity", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
  });
  $$('[data-panel="sube"]').forEach(function (el) {
    gsap.from(el, { y: 50, opacity: 0, duration: 1.2, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
  });
  var mc = $(".cita-marca");
  if (mc) gsap.from(mc.children, { scale: 0.4, opacity: 0, duration: 1, ease: "back.out(1.6)", stagger: 0.12, clearProps: "transform,opacity", scrollTrigger: { trigger: mc, start: "top 85%", once: true } });
})();
