/* ZIRKIN DANTZA ESKOLA · lo que se mueve y lo que reacciona (OI Studio, 9/11/2026).
   Clases por edad con plazas libres · clase de prueba con el mensaje de WhatsApp escrito · cuenta atrás al festival (fecha calculada aquí).
   Nada se envía solo: el WhatsApp se abre con el texto y lo manda quien lo escribe. Todos los datos son de ejemplo (nota del pie). */
(function () {
  "use strict";
  var T = JSON.parse(document.getElementById("textos").textContent);
  var C = JSON.parse(document.getElementById("clases-datos").textContent);
  var QUIETO = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var RATON = matchMedia("(hover: hover) and (pointer: fine)").matches;
  var G = !QUIETO && window.gsap && window.ScrollTrigger ? window.gsap : null;
  var WA = "https://wa.me/34600000000";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var may = function (s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; };

  /* ---------- menú del móvil ---------- */
  var menu = $("[data-menu]"), abrir = $("[data-menu-btn]");
  function cerrarMenu() { menu.hidden = true; document.documentElement.classList.remove("menu-abierto"); abrir.setAttribute("aria-expanded", "false"); abrir.focus(); }
  abrir.addEventListener("click", function () { menu.hidden = false; document.documentElement.classList.add("menu-abierto"); abrir.setAttribute("aria-expanded", "true"); $("[data-menu-cerrar]").focus(); });
  $("[data-menu-cerrar]").addEventListener("click", cerrarMenu);
  $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { if (a.getAttribute("href").charAt(0) === "#") cerrarMenu(); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) cerrarMenu(); });

  /* ---------- vídeos: solo con movimiento permitido; se paran cuando no se ven ---------- */
  function ponVideo(v, base) {
    v.src = base + ".mp4";
    v.addEventListener("playing", function () { v.classList.add("va"); }, { once: true });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) { if (e[0].isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); }, { threshold: 0.05 }).observe(v.parentElement);
    } else v.play();
  }
  if (!QUIETO) {
    var vp = $("[data-video]");
    ponVideo(vp, matchMedia("(max-width: 699px)").matches ? vp.dataset.m : vp.dataset.d);
    var vl = $("[data-video-lazy]");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { io.disconnect(); ponVideo(vl, vl.dataset.src); } }, { rootMargin: "300px" });
      io.observe(vl.parentElement);
    }
  }

  /* ---------- el círculo sigue un poco al ratón (solo con ratón) ---------- */
  var circ = $(".circulo");
  if (RATON && !QUIETO && circ) {
    var port = $("[data-portada]");
    port.addEventListener("pointermove", function (e) {
      var r = circ.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), d = Math.hypot(dx, dy);
      if (d < 260) circ.style.transform = "translate(" + (dx * 0.18).toFixed(1) + "px," + (dy * 0.18).toFixed(1) + "px) scale(1.04)";
      else circ.style.transform = "";
    });
    port.addEventListener("pointerleave", function () { circ.style.transform = ""; });
  }

  /* ---------- clases por edad ---------- */
  var filas = $$(".fila");
  function verEdad(edad, anima) {
    var vis = [];
    filas.forEach(function (f) { var si = f.dataset.edad === edad; if (si) { f.removeAttribute("data-oculta"); vis.push(f); } else f.setAttribute("data-oculta", ""); });
    if (anima && G) G.fromTo(vis, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.06, clearProps: "transform,opacity" });
  }
  $$("[data-edades] input").forEach(function (i) { i.addEventListener("change", function () { verEdad(i.value, true); }); });
  var marcada = $("[data-edades] input:checked"); if (marcada) verEdad(marcada.value, false);

  /* ---------- clase de prueba ---------- */
  var sel = $("[data-p-clase]"), diasBox = $("[data-dias]"), msg = $("[data-mensaje]"), wa = $("[data-wa]");
  var nombre = $("[data-p-nombre]"), edadIn = $("[data-p-edad]"), avisoDia = $("[data-aviso-dia]"), avisoClase = $("[data-aviso-clase]");
  var fmtDia = function (d) { // «Martes, 11 de noviembre» / «Asteartea, azaroaren 11(a)» con los nombres del CLDR que pone gen.mjs
    var F = T.fechas, dia = may(F.dias[d.getDay()]), fecha = F.meses[d.getMonth()].replace("{d}", d.getDate());
    return dia + ", " + fecha;
  };
  var conNum = function (el, txt) { // las cifras en Satoshi: las de Italiana son de texto antiguo (el 4 baja y el 1 se queda pequeño)
    el.textContent = ""; txt.split(/(d+)/).forEach(function (t, i) { if (!t) return; if (i % 2) { var s = document.createElement("span"); s.className = "num"; s.textContent = t; el.appendChild(s); } else el.appendChild(document.createTextNode(t)); });
  };
  function proximos(c) {
    // los tres próximos días de esa clase, desde hoy (hoy cuenta si faltan dos horas o más); julio y agosto, sin clases
    var ahora = new Date(), d = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()), out = [], verano = false;
    var hm = c.h.split(":");
    for (var i = 0; i < 120 && out.length < 3; i++, d.setDate(d.getDate() + 1)) {
      var mes = d.getMonth();
      if (mes === 6 || mes === 7) { verano = true; continue; }
      var dia = d.getDay() === 0 ? 7 : d.getDay();
      if (c.dias.indexOf(dia) < 0) continue;
      var empieza = new Date(d.getFullYear(), d.getMonth(), d.getDate(), +hm[0], +hm[1]);
      if (empieza - ahora < 2 * 3600 * 1000) continue;
      out.push(new Date(d));
    }
    return { dias: out, verano: verano };
  }
  function pintaDias() {
    var c = C[sel.value], p = proximos(c), antes = (diasBox.querySelector("input:checked") || {}).value;
    diasBox.innerHTML = '<legend class="sr">' + diasBox.querySelector("legend").textContent + "</legend>";
    p.dias.forEach(function (d, i) {
      var v = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(), l = document.createElement("label");
      l.className = "dia";
      l.innerHTML = '<input type="radio" name="dia" value="' + v + '"' + ((antes ? antes === v : i === 0) ? " checked" : "") + "><span></span>";
      l.querySelector("span").textContent = fmtDia(d) + " · " + c.h;
      l.querySelector("input").addEventListener("change", escribe);
      diasBox.appendChild(l);
    });
    if (!diasBox.querySelector("input:checked") && diasBox.querySelector("input")) diasBox.querySelector("input").checked = true;
    avisoDia.textContent = p.verano ? T.pr_verano : "";
    avisoClase.textContent = c.libres === 0 ? T.pr_completo : "";
  }
  var ultimo = "";
  function escribe() {
    var c = C[sel.value], dia = diasBox.querySelector("input:checked"), lineas = [c.libres === 0 ? T.wa_espera : T.wa_hola];
    lineas.push(T.wa_clase + " " + c.clase + " · " + c.edad + " · " + c.nivel);
    if (dia && c.libres > 0) lineas.push(T.wa_dia + " " + dia.nextElementSibling.textContent);
    if (nombre.value.trim()) lineas.push(T.wa_nombre + " " + nombre.value.trim());
    if (edadIn.value.trim()) lineas.push(T.wa_edad + " " + edadIn.value.trim());
    var txt = lineas.join("\n");
    if (txt === ultimo) return;
    ultimo = txt;
    msg.textContent = txt;
    msg.classList.remove("cambia"); void msg.offsetWidth; if (!QUIETO) msg.classList.add("cambia");
    wa.href = WA + "?text=" + encodeURIComponent(txt);
  }
  function redibuja(celda) {
    var p = celda && celda.querySelector(".dibujo path");
    if (!p || !G) return;
    G.fromTo(p, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" });
  }
  sel.addEventListener("change", function () { pintaDias(); escribe(); redibuja(sel.closest(".celda")); redibuja(diasBox.closest(".celda")); });
  [nombre, edadIn].forEach(function (i) { i.addEventListener("input", escribe); });
  nombre.addEventListener("change", function () { redibuja(nombre.closest(".celda")); });
  pintaDias(); escribe();

  // «Probar» / «Lista de espera» de la tabla: elige ese grupo en la clase de prueba
  $$("[data-probar]").forEach(function (a) {
    a.addEventListener("click", function () {
      sel.value = a.dataset.probar; pintaDias(); escribe();
      setTimeout(function () { redibuja(sel.closest(".celda")); }, 500);
    });
  });

  /* ---------- festival: tercer sábado de junio del curso (de ejemplo); cuenta atrás ---------- */
  function tercerSabado(anio) { var d = new Date(anio, 5, 1); while (d.getDay() !== 6) d.setDate(d.getDate() + 1); d.setDate(d.getDate() + 14); d.setHours(18, 0, 0, 0); return d; }
  var ahora0 = new Date(), fes = tercerSabado(ahora0.getFullYear());
  if (ahora0 > new Date(fes.getTime() + 3 * 3600 * 1000)) fes = tercerSabado(ahora0.getFullYear() + 1);
  var hFaltan = $("[data-faltan]"), reloj = $("[data-reloj]"), fFecha = $("[data-fecha-fes]");
  fFecha.textContent = fmtDia(fes) + (T.lang === "eu" ? " · " : " de ") + fes.getFullYear() + " · 18:00";
  var dos = function (n) { return (n < 10 ? "0" : "") + n; };
  function tic() {
    var ms = fes - new Date(), dias = Math.floor(ms / 864e5);
    var t = ms <= 0 || (dias === 0 && new Date().getDate() === fes.getDate()) ? T.fes_0 : dias <= 1 ? T.fes_1 : T.fes_n.replace("214", dias);
    if (hFaltan.dataset.t !== t) { hFaltan.dataset.t = t; conNum(hFaltan, t); }
    if (ms > 0) { var s = Math.floor(ms / 1000); reloj.textContent = "+ " + dos(Math.floor(s / 3600) % 24) + " h " + dos(Math.floor(s / 60) % 60) + " min " + dos(s % 60) + " s"; }
    else reloj.textContent = "";
  }
  tic(); setInterval(tic, 1000);
  $("[data-ics]").addEventListener("click", function (e) {
    e.preventDefault();
    var z = function (d) { return d.getFullYear() + dos(d.getMonth() + 1) + dos(d.getDate()) + "T" + dos(d.getHours()) + dos(d.getMinutes()) + "00"; };
    var fin = new Date(fes.getTime() + 2 * 3600 * 1000);
    var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Zirkin (ejemplo)//ES", "BEGIN:VEVENT", "UID:festival-" + z(fes) + "@zirkin.example", "DTSTAMP:" + z(new Date()), "DTSTART:" + z(fes), "DTEND:" + z(fin), "SUMMARY:" + T.fes_ics, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = "zirkin-festival.ics"; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  });

  /* ---------- entradas al hacer scroll (por tiempo, una vez): fotos, dibujos, bandas, filetes ---------- */
  if (!G) return;
  G.registerPlugin(ScrollTrigger);
  $$("[data-panel='foto']").forEach(function (f) {
    G.fromTo(f, { clipPath: "inset(14% 10% 14% 10% round 40px)", opacity: 0.3 }, { clipPath: "inset(0% 0% 0% 0% round 0px)", opacity: 1, duration: 1.4, ease: "power3.out", clearProps: "clipPath,opacity", scrollTrigger: { trigger: f, start: "top 88%", once: true } });
    var im = f.querySelector("img"); if (im) G.fromTo(im, { scale: 1.12 }, { scale: 1, duration: 1.8, ease: "power3.out", clearProps: "transform", scrollTrigger: { trigger: f, start: "top 88%", once: true } });
  });
  $$("[data-panel='banda'] img").forEach(function (im) {
    G.fromTo(im, { scale: 1.1 }, { scale: 1, duration: 2, ease: "power2.out", clearProps: "transform", scrollTrigger: { trigger: im, start: "top 90%", once: true } });
  });
  $$(".dibujo path").forEach(function (p) {
    G.fromTo(p, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.4, ease: "power2.inOut", scrollTrigger: { trigger: p.closest("svg"), start: "top 90%", once: true } });
  });
  $$(".reticula").forEach(function (r) {
    G.from(r.children, { y: 26, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.09, clearProps: "transform,opacity", scrollTrigger: { trigger: r, start: "top 86%", once: true } });
  });
  var vf = $(".esc-video");
  G.fromTo(vf, { clipPath: "inset(0 18% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.6, ease: "power3.out", clearProps: "clipPath", scrollTrigger: { trigger: vf, start: "top 85%", once: true } });
  G.from(".filas .fila:not([data-oculta])", { y: 18, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.07, clearProps: "transform,opacity", scrollTrigger: { trigger: ".filas", start: "top 88%", once: true } });
})();
