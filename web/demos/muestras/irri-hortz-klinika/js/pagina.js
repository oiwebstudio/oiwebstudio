/* IRRI · lo que reacciona: menú, «¿Qué te pasa?», cita sin llamar (mensaje de WhatsApp escrito), urgencias según la hora real de
   Tolosa, fotos que flotan y paneles que entran. Nada se envía solo: los mensajes salen por WhatsApp o por teléfono. */
(function () {
  var T = JSON.parse(document.getElementById("textos").textContent);
  var WA = "https://wa.me/34600000000?text=";
  var quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var G = !quieto && window.gsap && window.ScrollTrigger ? window.gsap : null;

  /* ---------- Hora de Tolosa (Europe/Madrid), sea cual sea la del aparato ---------- */
  function ahora() {
    var p = {};
    new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    var dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { d: dias[p.weekday], m: (+p.hour) * 60 + (+p.minute) };
  }
  /* Horario de ejemplo: L–J 9:00–13:30 y 15:00–20:00; V 9:00–15:00; S y D cerrado */
  function estado() {
    var a = ahora(), d = a.d, m = a.m;
    if (d >= 1 && d <= 4) {
      if (m < 540) return { abierto: false, t: T.est_abre_900 };
      if (m < 810) return { abierto: true, t: T.est_ab_1330 };
      if (m < 900) return { abierto: false, t: T.est_abre_1500 };
      if (m < 1200) return { abierto: true, t: T.est_ab_2000 };
      return { abierto: false, t: T.est_cerrado_man };
    }
    if (d === 5) {
      if (m < 540) return { abierto: false, t: T.est_abre_900 };
      if (m < 900) return { abierto: true, t: T.est_ab_1500 };
    }
    return { abierto: false, t: T.est_cerrado_lun };
  }

  /* ---------- Menú ---------- */
  var btn = document.querySelector("[data-menu-btn]"), panel = document.querySelector("[data-panel-menu]"), velo = document.querySelector("[data-velo]");
  function abrir() {
    panel.hidden = false; velo.hidden = false; btn.setAttribute("aria-expanded", "true");
    if (G) { G.fromTo(panel, { xPercent: 104 }, { xPercent: 0, duration: 0.6, ease: "expo.out" }); G.fromTo(velo, { opacity: 0 }, { opacity: 1, duration: 0.4 }); }
    panel.querySelector("a").focus({ preventScroll: true });
    document.addEventListener("keydown", tecla);
  }
  function cerrar(volver) {
    btn.setAttribute("aria-expanded", "false");
    document.removeEventListener("keydown", tecla);
    var fin = function () { panel.hidden = true; velo.hidden = true; G && G.set(panel, { clearProps: "transform" }); };
    if (G) { G.to(panel, { xPercent: 104, duration: 0.4, ease: "power2.in", onComplete: fin }); G.to(velo, { opacity: 0, duration: 0.3 }); } else fin();
    if (volver !== false) btn.focus({ preventScroll: true });
  }
  function tecla(e) {
    if (e.key === "Escape") cerrar();
    if (e.key === "Tab") { /* el foco no sale del panel */
      var f = panel.querySelectorAll("a, button"), pri = f[0], ult = f[f.length - 1];
      if (e.shiftKey && document.activeElement === pri) { e.preventDefault(); ult.focus(); }
      else if (!e.shiftKey && document.activeElement === ult) { e.preventDefault(); pri.focus(); }
    }
  }
  btn.addEventListener("click", abrir);
  velo.addEventListener("click", function () { cerrar(); });
  panel.querySelector("[data-menu-cerrar]").addEventListener("click", function () { cerrar(); });
  panel.querySelectorAll("[data-cierra]").forEach(function (a) { a.addEventListener("click", function () { cerrar(false); }); });

  /* ---------- ¿Qué te pasa? ---------- */
  function abrirFila(li, si) {
    var b = li.querySelector("[data-abrir]"), info = li.querySelector(".f-info");
    b.setAttribute("aria-expanded", si ? "true" : "false");
    b.querySelector("[data-txt]").textContent = si ? T.cerrar : T.ver;
    li.classList.toggle("abierta", si);
    info.hidden = !si;
    if (si && G) G.fromTo(info.querySelector(".f-in").children, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: "expo.out", stagger: 0.06 });
    if (si && window.ScrollTrigger) ScrollTrigger.refresh();
  }
  document.querySelectorAll("[data-fila]").forEach(function (li) {
    li.querySelector("[data-abrir]").addEventListener("click", function () { abrirFila(li, li.querySelector(".f-info").hidden); });
  });
  /* Si se llega a una fila por enlace (#f-dolor…), se abre */
  function porAncla() { var li = location.hash && document.querySelector(location.hash + "[data-fila]"); if (li) abrirFila(li, true); }
  window.addEventListener("hashchange", porAncla); porAncla();

  /* ---------- Cita sin llamar ---------- */
  var form = document.querySelector("[data-cita]"), msgEl = form.querySelector("[data-msg]"), waCita = form.querySelector("[data-wa-cita]");
  var aviso = form.querySelector("[data-aviso]"), nombre = form.querySelector("[data-tu-nombre]");
  var esta = form.querySelector('input[name="semana"][value="esta"]'), otra = form.querySelector('input[name="semana"][value="otra"]');
  (function semana() { /* el viernes desde las 14:00 y el fin de semana ya no queda consulta esta semana */
    var a = ahora();
    if (a.d === 6 || a.d === 0 || (a.d === 5 && a.m >= 840)) { esta.disabled = true; otra.checked = true; esta.closest(".op").title = T.aviso_semana; form.dataset.sinSemana = "1"; }
  })();
  var val = function (n) { var x = form.querySelector('input[name="' + n + '"]:checked'); return x ? x.dataset.nombre : ""; };
  var tCambio;
  function mensaje() {
    var t = T.wa_hola + " " + T.wa_motivo + " " + val("motivo") + ". " + T.wa_franja + " " + val("franja") + ". " + T.wa_semana + " " + val("semana") + ".";
    var n = nombre.value.trim();
    if (n) t += " " + T.wa_nombre + " " + n + ".";
    waCita.href = WA + encodeURIComponent(t);
    if (msgEl.textContent !== t) {
      msgEl.classList.add("cambia");
      clearTimeout(tCambio);
      tCambio = setTimeout(function () { msgEl.textContent = t; msgEl.classList.remove("cambia"); }, quieto ? 0 : 160);
    }
    var urg = form.querySelector('input[name="motivo"]:checked').value === "urg";
    aviso.innerHTML = "";
    if (urg) { var a = document.createElement("a"); a.href = "#urgencias"; a.textContent = T.aviso_urg; aviso.appendChild(a); }
    else if (form.dataset.sinSemana) aviso.textContent = T.aviso_semana;
  }
  form.addEventListener("change", mensaje);
  nombre.addEventListener("input", mensaje);
  mensaje();

  /* ---------- Urgencias hoy ---------- */
  var est = document.querySelector("[data-estado]"), b1 = document.querySelector("[data-urg-1]"), b2 = document.querySelector("[data-urg-2]");
  var waUrg = WA + encodeURIComponent(T.wa_urg), tel = "tel:+34943000000";
  function urgencias() {
    var e = estado();
    est.textContent = e.t;
    est.classList.toggle("abierto", e.abierto);
    if (e.abierto) {
      b1.href = tel; b1.removeAttribute("target"); b1.removeAttribute("rel"); b1.textContent = T.btn_llamar + " · " + T.tel;
      b2.href = waUrg; b2.target = "_blank"; b2.rel = "noopener"; b2.textContent = T.urg_o_wa;
    } else { /* cerrado: primero WhatsApp (os llamamos al abrir) y después el teléfono */
      b1.href = waUrg; b1.target = "_blank"; b1.rel = "noopener"; b1.textContent = T.btn_aviso;
      b2.href = tel; b2.removeAttribute("target"); b2.removeAttribute("rel"); b2.textContent = T.urg_o_tel + " " + T.tel;
    }
  }
  urgencias(); setInterval(urgencias, 60000);

  /* ---------- Los botones de arriba se apartan al bajar (no tapan el texto) y vuelven al subir ---------- */
  (function () {
    var cab = document.querySelector('.cab'), ult = window.scrollY, port = document.querySelector('[data-portada]');
    window.addEventListener('scroll', function () {
      var y = window.scrollY, fueraPortada = y > port.offsetHeight * 0.6;
      if (panel.hidden) cab.classList.toggle('oculta', fueraPortada && y > ult + 2);
      if (y < ult - 2 || !fueraPortada) cab.classList.remove('oculta');
      ult = y;
    }, { passive: true });
    cab.addEventListener('focusin', function () { cab.classList.remove('oculta'); });
  })();

  if (!G) { return; }
  gsap.registerPlugin(ScrollTrigger);
  /* ---------- Fotos que flotan sobre la banda (se quedan atrás o se adelantan al bajar) ---------- */
  document.querySelectorAll("[data-flota]").forEach(function (e) {
    G.fromTo(e, { yPercent: -(+e.dataset.flota) }, { yPercent: +e.dataset.flota, ease: "none", scrollTrigger: { trigger: e.closest("section"), start: "top bottom", end: "bottom top", scrub: true } });
  });
  /* ---------- Paneles y fotos: entran al asomar, por tiempo (no atados al scroll) ---------- */
  document.querySelectorAll("[data-foto]").forEach(function (f) {
    G.fromTo(f, { clipPath: "inset(12% 0 0 0)", opacity: 0, y: 30 }, { clipPath: "inset(0% 0 0 0)", opacity: 1, y: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: f, start: "top 90%", once: true } });
  });
  document.querySelectorAll(".fila .f-nom").forEach(function (h) {
    G.fromTo(h, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 92%", once: true } });
  });
  [".portada-sigue", ".sobre-pie", ".que-txt", ".mensaje", ".acc", ".pie-cols"].forEach(function (s) {
    document.querySelectorAll(s).forEach(function (e) {
      G.fromTo(e, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: e, start: "top 92%", once: true } });
    });
  });
})();
