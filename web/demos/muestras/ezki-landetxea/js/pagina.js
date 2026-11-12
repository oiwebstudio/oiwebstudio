/* EZKI · lo que reacciona: menú, cabecera que se aparta al bajar, habitaciones («Más»), calendario de noches libres con el mensaje
   de WhatsApp escrito a la vista, pestañas de «qué hacer cerca», visor de fotos y láminas que entran.
   Nada se envía solo: el mensaje sale por WhatsApp cuando la persona pulsa el botón. Las noches cogidas son de ejemplo
   (se calculan a partir de la fecha real, siempre las mismas para cada día). */
(function () {
  var T = JSON.parse(document.getElementById("textos").textContent);
  var WA = "https://wa.me/34600000000?text=";
  var quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var G = !quieto && window.gsap && window.ScrollTrigger ? window.gsap : null;
  var fino = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Cabecera: se aparta al bajar y vuelve al subir, con fondo cuando ya no está sobre la portada ---------- */
  var cab = document.querySelector("[data-cab]"), ultimo = 0;
  addEventListener("scroll", function () {
    var y = scrollY;
    cab.classList.toggle("con-fondo", y > innerHeight * 0.6);
    if (y > ultimo + 6 && y > 120) cab.classList.add("oculta");
    else if (y < ultimo - 6 || y < 120) cab.classList.remove("oculta");
    ultimo = y;
  }, { passive: true });

  /* ---------- Menú a pantalla completa ---------- */
  var btn = document.querySelector("[data-menu-btn]"), menu = document.querySelector("[data-menu]");
  function abrir() {
    menu.hidden = false; btn.setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden";
    if (G) { G.fromTo(menu, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power2.out" }); G.from(menu.querySelectorAll(".menu-nav li"), { y: 18, opacity: 0, duration: 0.7, ease: "expo.out", stagger: 0.04, delay: 0.08 }); }
    menu.querySelector("[data-menu-cerrar]").focus({ preventScroll: true });
    document.addEventListener("keydown", tecla);
  }
  function cerrar(volver) {
    btn.setAttribute("aria-expanded", "false"); document.body.style.overflow = "";
    document.removeEventListener("keydown", tecla);
    var fin = function () { menu.hidden = true; G && G.set(menu, { clearProps: "opacity" }); };
    if (G) G.to(menu, { opacity: 0, duration: 0.3, ease: "power2.in", onComplete: fin }); else fin();
    if (volver !== false) btn.focus({ preventScroll: true });
  }
  function tecla(e) {
    if (e.key === "Escape") cerrar();
    if (e.key === "Tab") {
      var f = menu.querySelectorAll("a, button"), pri = f[0], ult = f[f.length - 1];
      if (e.shiftKey && document.activeElement === pri) { e.preventDefault(); ult.focus(); }
      else if (!e.shiftKey && document.activeElement === ult) { e.preventDefault(); pri.focus(); }
    }
  }
  btn.addEventListener("click", abrir);
  menu.querySelector("[data-menu-cerrar]").addEventListener("click", function () { cerrar(); });
  menu.querySelectorAll("[data-cierra]").forEach(function (a) { a.addEventListener("click", function () { cerrar(false); }); });

  /* ---------- Habitaciones: «Más» abre lo que tiene y el precio ---------- */
  document.querySelectorAll("[data-hab-mas]").forEach(function (b) {
    var info = document.getElementById(b.getAttribute("aria-controls")), li = b.closest("[data-hab-li]");
    b.addEventListener("click", function () {
      var abierta = b.getAttribute("aria-expanded") === "true";
      b.setAttribute("aria-expanded", String(!abierta));
      b.textContent = abierta ? T.mas : T.cerrar;
      li.classList.toggle("abierta", !abierta);
      info.hidden = abierta;
      if (!abierta && G) G.from(info.children, { y: 12, opacity: 0, duration: 0.6, ease: "expo.out", stagger: 0.05 });
    });
  });
  document.querySelectorAll("[data-elige-hab]").forEach(function (a) {
    a.addEventListener("click", function () {
      var r = document.querySelector('input[name="hab"][value="' + a.dataset.eligeHab + '"]');
      if (r) { r.checked = true; r.dispatchEvent(new Event("change", { bubbles: true })); }
    });
  });

  /* ---------- Calendario de noches libres ---------- */
  var cal = document.querySelector("[data-cal]");
  var aviso = document.querySelector("[data-aviso]"), res = document.querySelector("[data-res]"), msg = document.querySelector("[data-msg]"), waBtn = document.querySelector("[data-wa]");
  var hoy = (function () { /* fecha de hoy en Altzo (Europe/Madrid) */
    var p = {}; new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    return new Date(+p.year, +p.month - 1, +p.day);
  })();
  var DIA = 864e5;
  var clave = function (d) { return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); };
  var mas = function (d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); };
  var noches = function (a, b) { return Math.round((b - a) / DIA); };
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) % 100; }
  /* Noche cogida (ejemplo): más los viernes y sábados y en julio y agosto; la casa entera, si hay alguna habitación cogida */
  function cogidaHab(d, h) {
    var p = 20 + (d.getDay() === 5 || d.getDay() === 6 ? 30 : 0) + (d.getMonth() === 6 || d.getMonth() === 7 ? 22 : 0);
    var dos = hash(clave(mas(d, -(d.getDate() % 2))) + h); /* las ocupaciones van de dos en dos noches, como pasa de verdad */
    return dos < p;
  }
  function cogida(d, h) { return h === "casa" ? Object.keys(T.habs).some(function (k) { return cogidaHab(d, k); }) : cogidaHab(d, h); }
  var hab = function () { return (document.querySelector('input[name="hab"]:checked') || {}).value || "pagoa"; };
  var datos = function (h) { return h === "casa" ? T.casa : T.habs[h]; };
  var alta = function (d) { return d.getMonth() === 6 || d.getMonth() === 7; };
  var ini = null, fin = null, previo = null, base = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  var MAX_MESES = 12;
  var nMeses = function () { return matchMedia("(min-width: 800px)").matches ? 2 : 1; };
  /* nombres de meses y días: los de es.json / eu.json (euskera de Itzultzaile), no los del navegador */
  var INI = T.lang === "es" ? ["L", "M", "X", "J", "V", "S", "D"] : T.dias.map(function (x) { return x.charAt(0).toUpperCase(); });
  var dd = function (d) { return ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2); };

  function pintar() {
    if (!cal) return;
    var n = nMeses(), h = hab();
    var html = '<div class="cal-nav"><button type="button" data-mes="-1" aria-label="' + T.cal_ant + '"' + (base <= new Date(hoy.getFullYear(), hoy.getMonth(), 1) ? " disabled" : "") + '><svg viewBox="0 0 12 22" aria-hidden="true"><path d="M11 1L1 11l10 10" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button>' +
      '<button type="button" data-mes="1" aria-label="' + T.cal_sig + '"' + ((base.getFullYear() - hoy.getFullYear()) * 12 + base.getMonth() - hoy.getMonth() >= MAX_MESES - n ? " disabled" : "") + '><svg viewBox="0 0 12 22" aria-hidden="true"><path d="M1 1l10 10L1 21" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button></div>';
    html += '<div class="cal-meses" style="--n:' + n + '">';
    for (var m = 0; m < n; m++) {
      var primero = new Date(base.getFullYear(), base.getMonth() + m, 1);
      html += '<div><p class="mes-tit">' + T.meses[primero.getMonth()] + '<span class="ano">' + primero.getFullYear() + '</span></p><div class="mes">';
      for (var s = 0; s < 7; s++) html += '<span class="dsem" aria-hidden="true">' + INI[s] + "</span>";
      var hueco = (primero.getDay() + 6) % 7;
      for (var e = 0; e < hueco; e++) html += "<span></span>";
      var dias = new Date(primero.getFullYear(), primero.getMonth() + 1, 0).getDate();
      for (var d = 1; d <= dias; d++) {
        var f = new Date(primero.getFullYear(), primero.getMonth(), d), c = ["dia"], dis = false;
        if (f < hoy) { c.push("pasado"); dis = true; }
        else if (cogida(f, h)) { c.push("cogido"); if (!(ini && !fin && f > ini)) dis = true; }
        if (+f === +hoy) c.push("hoy");
        if (ini && +f === +ini) c.push("ini");
        if (fin && +f === +fin) c.push("fin");
        var hasta = fin || previo;
        if (ini && hasta && f > ini && f < hasta) c.push(fin ? "en-rango" : "previo");
        var etiqueta = T.dias[(f.getDay() + 6) % 7] + ", " + d + " " + T.meses[f.getMonth()];
        html += '<button type="button" class="' + c.join(" ") + '" data-d="' + +f + '"' + (dis ? " disabled" : "") + ' aria-label="' + etiqueta + '"' + (c.indexOf("ini") > -1 || c.indexOf("fin") > -1 ? ' aria-pressed="true"' : "") + ">" + d + "</button>";
      }
      html += "</div></div>";
    }
    cal.innerHTML = html + "</div>";
  }
  function libre(a, b, h) { for (var d = a; d < b; d = mas(d, 1)) if (cogida(d, h)) return false; return true; }
  function escribir() {
    var h = hab(), D = datos(h), nom = h === "casa" ? T.wa_casa : D.nom;
    var txt = T.wa_sin;
    if (!ini) { aviso.textContent = T.elige_llegada; res.textContent = ""; }
    else if (!fin) { aviso.textContent = T.elige_salida; res.textContent = ""; }
    else {
      var n = noches(ini, fin), total = 0;
      for (var d = ini; d < fin; d = mas(d, 1)) total += alta(d) ? D.a : D.b;
      aviso.textContent = n < 2 && alta(ini) ? T.min_2 : "";
      res.textContent = (h === "casa" ? T.etxe_osoa.toUpperCase() : D.nom) + " · " + dd(ini) + " – " + dd(fin) + " · " + (n === 1 ? T.res_1 : T.res_n.replace(/(^|\s)3(?=\s)/, "$1" + n)) + " · " + T.res_total.replace("255", total);
      txt = (n === 1 ? T.wa_1.replace("15/11", dd(fin)) : T.wa_n.replace(/(^|\s)3(?=\s)/, "$1" + n).replace("17/11", dd(fin))).replace("PAGOA", nom).replace("14/11", dd(ini));
    }
    msg.textContent = txt;
    waBtn.href = WA + encodeURIComponent(txt);
    if (G && fin) G.fromTo([res, msg], { opacity: 0.35 }, { opacity: 1, duration: 0.5, ease: "power2.out" });
  }
  if (cal) {
    cal.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.dataset.mes) { base = new Date(base.getFullYear(), base.getMonth() + +b.dataset.mes, 1); pintar(); return; }
      var f = new Date(+b.dataset.d), h = hab();
      if (!ini || fin || f <= ini) {
        if (cogida(f, h)) return;
        ini = f; fin = null; previo = null;
      } else if (libre(ini, f, h)) { fin = f; }
      else { aviso.textContent = T.cogido_medio; return; }
      pintar(); escribir();
      var foco = cal.querySelector('[data-d="' + +f + '"]'); foco && foco.focus({ preventScroll: true });
    });
    if (fino) {
      cal.addEventListener("pointerover", function (e) {
        var b = e.target.closest(".dia"); if (!b || !ini || fin) return;
        var f = new Date(+b.dataset.d); if (+f === +(previo || 0)) return;
        previo = f > ini ? f : null;
        cal.querySelectorAll(".dia").forEach(function (x) { var t = +x.dataset.d; x.classList.toggle("previo", !!previo && t > +ini && t < +previo); });
      });
    }
    document.querySelectorAll('input[name="hab"]').forEach(function (r) {
      r.addEventListener("change", function () {
        if (ini && (cogida(ini, hab()) || (fin && !libre(ini, fin, hab())))) { ini = null; fin = null; }
        pintar(); escribir();
        if (G) G.fromTo(cal.querySelectorAll(".cogido"), { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.008, ease: "power1.out" });
      });
    });
    var mq = matchMedia("(min-width: 800px)"); (mq.addEventListener ? mq.addEventListener("change", pintar) : mq.addListener(pintar));
    pintar(); escribir();
  }

  /* ---------- Qué hacer cerca: pestañas ---------- */
  var tabs = [].slice.call(document.querySelectorAll("[data-tabs] [role=tab]"));
  function elige(t, foco) {
    tabs.forEach(function (x) {
      var on = x === t, p = document.getElementById(x.getAttribute("aria-controls"));
      x.setAttribute("aria-selected", String(on)); x.tabIndex = on ? 0 : -1; p.hidden = !on;
      if (on && G) G.fromTo(p.querySelectorAll("li"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "expo.out", stagger: 0.06 });
    });
    if (foco) t.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { elige(t); });
    t.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); elige(tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length], true); }
    });
  });

  /* ---------- Visor de fotos ---------- */
  var visor = document.querySelector("[data-visor]"), vImg = document.querySelector("[data-visor-img]"), fotos = [].slice.call(document.querySelectorAll("[data-foto]")), actual = 0;
  function ver(i) {
    actual = (i + fotos.length) % fotos.length;
    var b = fotos[actual]; vImg.src = b.dataset.src; vImg.alt = b.querySelector("img").alt;
    if (G) G.fromTo(vImg, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.5, ease: "expo.out" });
  }
  if (visor && visor.showModal) {
    fotos.forEach(function (b, i) { b.addEventListener("click", function () { ver(i); visor.showModal(); }); });
    visor.querySelector("[data-visor-x]").addEventListener("click", function () { visor.close(); });
    visor.querySelector("[data-visor-ant]").addEventListener("click", function () { ver(actual - 1); });
    visor.querySelector("[data-visor-sig]").addEventListener("click", function () { ver(actual + 1); });
    visor.addEventListener("click", function (e) { if (e.target === visor) visor.close(); });
    visor.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") ver(actual + 1); if (e.key === "ArrowLeft") ver(actual - 1); });
    visor.addEventListener("close", function () { fotos[actual].focus({ preventScroll: true }); });
  }

  /* ---------- Láminas que entran (por tiempo, al asomar) y fotos que se quedan atrás al bajar ---------- */
  if (G) {
    G.registerPlugin(ScrollTrigger);
    document.querySelectorAll("[data-panel]").forEach(function (p) {
      var c = p.querySelector(".caja");
      var tl = G.timeline({ scrollTrigger: { trigger: p, start: "top 82%", once: true } });
      tl.from(p, { opacity: 0, y: 26, duration: 1, ease: "expo.out" });
      if (c) tl.from(c, { clipPath: "inset(0 50% 0 50%)", duration: 1.1, ease: "expo.out" }, 0.1);
    });
    document.querySelectorAll("[data-fondo] img").forEach(function (img) {
      G.fromTo(img, { yPercent: -4 }, { yPercent: 4, ease: "none", scrollTrigger: { trigger: img.closest("section"), start: "top bottom", end: "bottom top", scrub: true } });
    });
    var mapa = document.querySelector("[data-mapa]");
    if (mapa) G.from(mapa.querySelectorAll(".mapa-et, .mapa-casa"), { opacity: 0, y: 10, duration: 0.9, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: mapa, start: "top 75%", once: true } });
    if (mapa) G.from(mapa.querySelector("img"), { opacity: 0, duration: 1.2, ease: "power2.out", scrollTrigger: { trigger: mapa, start: "top 85%", once: true } });
  }
})();
