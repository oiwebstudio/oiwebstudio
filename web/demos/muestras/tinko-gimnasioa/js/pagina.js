/* TINKO · lo que reacciona (OI Studio, 12/11/2026). Sin dependencias para lo que se toca; GSAP solo para los paneles de abajo.
   Todo lo que «envía» abre WhatsApp con el mensaje escrito: nada sale solo. La hora y las fechas son las reales de Tolosa (Europe/Madrid).
   Plazas libres: de ejemplo, calculadas a partir de la fecha y la clase (siempre las mismas para el mismo día). */
(function () {
  "use strict";
  var T = JSON.parse(document.getElementById("textos").textContent);
  var WA = "https://wa.me/34600000000?text=";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reducir = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Hora real en Tolosa ---------- */
  function ahoraTolosa() {
    var p = {};
    new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false, weekday: "short" })
      .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    var dias = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 };
    return { y: +p.year, m: +p.month, d: +p.day, dow: dias[p.weekday], min: (+p.hour % 24) * 60 + +p.minute };
  }
  var hm = function (s) { var a = s.split(":"); return +a[0] * 60 + +a[1]; };
  var AHORA = ahoraTolosa();
  var HOY = new Date(Date.UTC(AHORA.y, AHORA.m - 1, AHORA.d, 12));
  function fechaDe(dow) { // fecha del próximo «dow» (1–6) contando hoy
    var hoy = AHORA.dow === 0 ? 7 : AHORA.dow;
    var dif = dow - hoy; if (dif < 0) dif += 7;
    return new Date(HOY.getTime() + dif * 864e5);
  }
  // Fechas con los datos del navegador (Intl, CLDR). Si no trae el euskera, en número (2026/11/13) en vez de salir en otro idioma.
  var conIdioma = false; try { conIdioma = Intl.DateTimeFormat.supportedLocalesOf([T.lang]).length > 0; } catch (e) {}
  var fmt = function (f, o) {
    if (!conIdioma) { var d = f.toISOString().slice(0, 10).split("-"); return o.weekday && !o.day ? "" : (T.lang === "eu" ? d.join("/") : d[2] + "/" + d[1] + "/" + d[0]); }
    try { return new Intl.DateTimeFormat(T.lang, Object.assign({ timeZone: "UTC" }, o)).format(f); } catch (e) { return f.toISOString().slice(0, 10); }
  };

  /* ---------- Cuotas: los días cambian los dos precios y el mensaje ---------- */
  var diasCuota = $$('input[name="dias"]');
  function cuota(anim) {
    var sel = diasCuota.filter(function (i) { return i.checked; })[0]; if (!sel) return;
    $$("[data-plan]").forEach(function (pl) {
      var b = $("[data-precio]", pl), nuevo = pl.getAttribute("data-p" + sel.value);
      if (b.textContent !== nuevo) {
        b.textContent = nuevo;
        if (anim && !reducir) { b.classList.remove("gira"); void b.offsetWidth; b.classList.add("gira"); }
      }
      var msg = T.wa_cuota + "\n" + T.wa_plan + ": " + pl.getAttribute("data-nombre") + " (" + nuevo + " €)\n" + T.wa_dias + ": " + sel.getAttribute("data-nombre");
      $("[data-wa-plan]", pl).href = WA + encodeURIComponent(msg);
    });
  }
  diasCuota.forEach(function (i) { i.addEventListener("change", function () { cuota(true); }); });
  cuota(false);

  /* ---------- Horario de la semana ---------- */
  var filas = $("[data-filas]"), vacio = $("[data-vacio]"), pild = $("[data-pildora]"), waClase = $("[data-wa-clase]");
  var diaIn = $$('input[name="dia"]'), actIn = $$('input[name="act"]');
  var elegida = null;
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function libres(fecha, hora, act) {
    var cap = T.cap[act], h = hash(fecha.toISOString().slice(0, 10) + hora + act);
    if (h % 9 === 0) return 0;
    return 1 + (h >>> 3) % cap;
  }
  // Frases enteras del traductor: «Quedan 3 plazas libres» (se cambia el 3), «Queda 1 plaza libre», «Sin plazas libres»
  function textoPlazas(n) { return n === 0 ? T.hor_completa : n === 1 ? T.hor_libre1 : T.hor_libres.replace("3", n); }
  function mayus(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function pinta() {
    var dow = +(diaIn.filter(function (i) { return i.checked; })[0] || diaIn[0]).value;
    var act = (actIn.filter(function (i) { return i.checked; })[0] || actIn[0]).value;
    var fecha = fechaDe(dow), esHoy = dow === AHORA.dow;
    var manana = dow === (AHORA.dow % 7) + 1;
    $("[data-dia-nombre]").textContent = T.dias[dow - 1];
    $("[data-sobre]").textContent = (esHoy ? T.hor_hoy + " · " : manana ? T.hor_manana + " · " : "") + fmt(fecha, { day: "numeric", month: "long" });
    $("[data-aviso]").hidden = !(AHORA.dow === 0 && dow === 1);
    filas.innerHTML = "";
    var lista = (T.horario[dow] || []).filter(function (c) { return act === "todas" || c[1] === act; });
    vacio.hidden = lista.length > 0;
    lista.forEach(function (c) {
      var li = document.createElement("li"), b = document.createElement("button");
      var pasada = esHoy && hm(c[0]) <= AHORA.min, n = libres(fecha, c[0], c[1]);
      b.type = "button"; b.className = "fila";
      b.innerHTML = '<span class="hc"></span><span class="pl"></span>';
      b.firstChild.textContent = c[0] + "  " + T.act[c[1]];
      b.lastChild.textContent = pasada ? T.hor_pasada : textoPlazas(n);
      b.disabled = pasada || n === 0;
      var clave = fecha.toISOString().slice(0, 10) + c[0] + c[1];
      b.setAttribute("aria-pressed", elegida && elegida.clave === clave ? "true" : "false");
      b.addEventListener("click", function () {
        elegida = { clave: clave, dow: dow, fecha: fecha, hora: c[0], act: c[1] };
        $$(".fila", filas).forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        reserva(true);
      });
      li.appendChild(b); filas.appendChild(li);
    });
    if (elegida && !$('.fila[aria-pressed="true"]', filas)) elegida = null;
    reserva(false);
  }
  function reserva(anim) {
    var msg = T.wa_hola;
    if (elegida) {
      var dia = conIdioma ? fmt(elegida.fecha, { weekday: "long", day: "numeric", month: "long" }) : T.dias[elegida.dow - 1] + " " + fmt(elegida.fecha, { day: "numeric" });
      msg += "\n" + T.wa_clase + ": " + T.act[elegida.act] + "\n" + T.wa_dia + ": " + dia + ", " + elegida.hora;
      pild.textContent = T.dias[elegida.dow - 1] + " " + elegida.hora + " · " + T.act[elegida.act] + " · " + T.hor_reservar;
    } else pild.textContent = T.hor_elige;
    pild.href = waClase.href = WA + encodeURIComponent(msg);
    if (anim && !reducir) { pild.classList.remove("salta"); void pild.offsetWidth; pild.classList.add("salta"); }
  }
  // Día por defecto: hoy; si hoy ya han empezado todas las clases (o es domingo), el siguiente día que abre
  var inicio = AHORA.dow === 0 ? 1 : AHORA.dow;
  if (AHORA.dow !== 0 && !(T.horario[inicio] || []).some(function (c) { return hm(c[0]) > AHORA.min; })) inicio = inicio === 6 ? 1 : inicio + 1;
  diaIn.forEach(function (i) { i.checked = +i.value === inicio; i.addEventListener("change", pinta); });
  actIn.forEach(function (i) { i.addEventListener("change", pinta); });
  pinta();
  // «Horario de fuerza…» desde las actividades: filtra y baja al horario
  $$("[data-ver-act]").forEach(function (a) {
    a.addEventListener("click", function () {
      var k = a.getAttribute("data-ver-act");
      actIn.forEach(function (i) { i.checked = i.value === k; });
      pinta();
    });
  });

  /* ---------- Abierto o cerrado ahora ---------- */
  (function () {
    var e = $("[data-estado]"); if (!e) return;
    var dow = AHORA.dow, min = AHORA.min;
    var tramo = function (d) { return d >= 1 && d <= 5 ? T.abre.lv : d === 6 ? T.abre.s : null; };
    var hoy = tramo(dow), txt, abierto = false;
    // Frases enteras del traductor con la hora de lunes a viernes dentro («… hasta las 22:00», «… a las 06:30»): se cambia esa hora
    if (hoy && min >= hm(hoy[0]) && min < hm(hoy[1])) { abierto = true; txt = T.est_ab.replace(T.abre.lv[1], hoy[1]); }
    else if (hoy && min < hm(hoy[0])) txt = T.est_ce_hoy.replace(T.abre.lv[0], hoy[0]);
    else { var m = tramo((dow + 1) % 7); txt = m ? T.est_ce_manana.replace(T.abre.lv[0], m[0]) : T.est_ce_lunes; }
    e.textContent = txt; e.classList.toggle("abierto", abierto);
  })();

  /* ---------- Cabecera: al subir aparece fija con fondo; al bajar se esconde (no pisa el texto) ---------- */
  var cab = $("[data-cab]"), portada = $("[data-portada]"), ultimo = window.scrollY, flota = $("[data-flota]");
  function alto() { return portada ? portada.offsetHeight : 600; }
  window.addEventListener("scroll", function () {
    var y = window.scrollY, h = alto();
    if (y > h) {
      if (!cab.classList.contains("fija")) { cab.classList.add("fija"); }
      cab.classList.toggle("ve", y < ultimo - 2 ? true : y > ultimo + 2 ? false : cab.classList.contains("ve"));
    } else if (y < h * 0.5) { cab.classList.remove("fija", "ve"); }
    ultimo = y;
  }, { passive: true });

  /* ---------- Botón fijo «Primera clase»: solo cuando la portada, el horario y el pie no se ven ---------- */
  if (flota && "IntersectionObserver" in window) {
    var vis = {};
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) { vis[x.target.id || "portada"] = x.isIntersecting; });
      var on = !vis.portada && !vis.horario && !vis.contacto;
      flota.classList.toggle("ve", on);
      flota.tabIndex = on ? 0 : -1; flota.setAttribute("aria-hidden", on ? "false" : "true");
    });
    [portada, $("#horario"), $("#contacto")].forEach(function (x) { if (x) io.observe(x); });
  }

  /* ---------- Menú del móvil ---------- */
  var menu = $("[data-menu]"), abrir = $("[data-menu-btn]"), cerrar = $("[data-menu-cerrar]");
  function menuOn(on) {
    menu.hidden = !on; abrir.setAttribute("aria-expanded", on ? "true" : "false");
    document.body.style.overflow = on ? "hidden" : "";
    (on ? cerrar : abrir).focus();
  }
  abrir.addEventListener("click", function () { menuOn(true); });
  cerrar.addEventListener("click", function () { menuOn(false); });
  $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { menuOn(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) menuOn(false); });

  /* ---------- Paneles que entran al asomar (por tiempo, una vez) ---------- */
  if (window.gsap && window.ScrollTrigger && !reducir) {
    gsap.registerPlugin(ScrollTrigger);
    $$(".plan-foto, .act-foto, .cierre-foto").forEach(function (f) {
      gsap.fromTo(f, { clipPath: "inset(14% 0 0 0)", opacity: 0.2 }, { clipPath: "inset(0% 0 0 0)", opacity: 1, duration: 1.2, ease: "power3.out", clearProps: "clipPath,opacity", scrollTrigger: { trigger: f, start: "top 90%", once: true } });
    });
    $$("[data-panel]").forEach(function (p) {
      gsap.from(p, { y: 40, opacity: 0, duration: 1.1, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: p, start: "top 88%", once: true } });
    });
    $$(".hor-izq").forEach(function (p) {
      gsap.from(p, { opacity: 0, duration: 1, ease: "power2.out", clearProps: "opacity", scrollTrigger: { trigger: p, start: "top 90%", once: true } });
    });
  }
})();
