/* GANTXO · muestra de carnicería (OI Studio, 8/11/2026).
   Abierto o cerrado según la hora real de Tolosa, la fecha de hoy en el mostrador, el encargo que se va sumando al tocar
   las piezas (de medio en medio kilo), la hora de recogida entre las horas reales de apertura y el mensaje de WhatsApp
   escrito. Es una muestra: no se envía nada a ningún sitio; el botón solo abre WhatsApp con el texto.
   Sin JS o con «reducir movimiento»: todo se ve quieto y completo. */
(function () {
  var T = JSON.parse(document.getElementById("textos").textContent);
  var R = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EU = T.lang === "eu";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- hora de Tolosa ---------- */
  // minutos desde medianoche: L–V 9:00–13:30 y 17:00–20:00, sábado 9:00–14:00, domingo cerrado (de ejemplo)
  var H = { 0: [], 1: [[540, 810], [1020, 1200]], 2: [[540, 810], [1020, 1200]], 3: [[540, 810], [1020, 1200]], 4: [[540, 810], [1020, 1200]], 5: [[540, 810], [1020, 1200]], 6: [[540, 840]] };
  function ahora() {
    try {
      var o = {};
      new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
        .formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
      return { dia: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday], min: +o.hour * 60 + +o.minute, y: +o.year, m: +o.month, d: +o.day };
    } catch (e) { var n = new Date(); return { dia: n.getDay(), min: n.getHours() * 60 + n.getMinutes(), y: n.getFullYear(), m: n.getMonth() + 1, d: n.getDate() }; }
  }
  var hh = function (min) { return Math.floor(min / 60) + ":" + ("0" + (min % 60)).slice(-2); };
  var may = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };

  /* ---------- portada: abierto o cerrado ahora ---------- */
  function estado() {
    var a = ahora(), f = H[a.dia], txt = "", abierto = false;
    for (var i = 0; i < f.length; i++) if (a.min >= f[i][0] && a.min < f[i][1]) { txt = T.est["a" + f[i][1]]; abierto = true; }
    if (!abierto) {
      var luego = f.filter(function (x) { return x[0] > a.min; })[0];
      if (luego) txt = T.est["h" + luego[0]];
      else { var k = 1; while (!H[(a.dia + k) % 7].length) k++; txt = k === 1 ? T.est.m540 : T.est.l540; }
    }
    var e = $("[data-estado]");
    if (!e) return;
    if (e.textContent !== txt) e.textContent = txt;
    e.classList.toggle("abierto", abierto);
    e.hidden = false;
  }
  estado(); setInterval(estado, 30000);

  /* ---------- la fecha de hoy en el mostrador ---------- */
  (function () {
    var a = ahora(), f = $("[data-fecha]");
    if (!f) return;
    var dos = function (n) { return ("0" + n).slice(-2); }; // en euskera, año/mes/día con ceros: 2026/11/08
    f.textContent = may(T.dias[a.dia]) + ", " + (EU ? a.y + "/" + dos(a.m) + "/" + dos(a.d) : a.d + "/" + a.m + "/" + a.y);
    f.hidden = false;
  })();

  /* ---------- horas de recogida: cada media hora dentro del horario, con 45 minutos para prepararlo ---------- */
  var sel = $("[data-hora]");
  function horas() {
    if (!sel) return;
    var a = ahora(), previo = sel.value, out = [];
    for (var k = 0; k < 8 && out.length < 8; k++) {
      var dia = (a.dia + k) % 7;
      H[dia].forEach(function (tramo) {
        for (var t = tramo[0] + 30; t <= tramo[1] - 15 && out.length < 8; t += 30) {
          if (k === 0 && t < a.min + 45) continue;
          var nombre = k === 0 ? T.hoy : k === 1 ? T.manana : T.dias[dia];
          out.push({ v: k + "-" + t, txt: nombre + ", " + hh(t) });
        }
      });
    }
    sel.innerHTML = "";
    out.forEach(function (o) { var op = document.createElement("option"); op.value = o.v; op.textContent = may(o.txt); op.setAttribute("data-txt", o.txt); sel.appendChild(op); });
    if (previo && out.some(function (o) { return o.v === previo; })) sel.value = previo;
    var campo = sel.closest("[data-campo]"); if (campo && out.length) campo.hidden = false;
  }
  horas(); setInterval(function () { horas(); mensaje(); }, 60000);

  /* ---------- el encargo ---------- */
  var PASO = 0.5, MAX = 10;
  var piezas = $$("[data-pieza]");
  var kg = {};
  var nf = function (x, dec) { return (dec ? x.toFixed(2) : String(Math.round(x * 100) / 100)).replace(".", ","); };
  var fKg = function (x) { return nf(x) + " kg"; };
  var fEur = function (x) { return nf(x, true) + " €"; };
  var lista = $("[data-lineas-enc]"), vacio = $("[data-vacio]"), total = $("[data-total]"), totalN = $("[data-total-n]"), peso = $("[data-peso]");
  var wa = $("[data-wa]"), aviso = $("[data-aviso]"), caja = $("[data-mensaje-caja]"), esc = $("[data-escribiendo]"), txt = $("[data-mensaje]");
  var anuncio = $("[data-anuncio]"), barra = $("[data-barra]"), barraN = $("[data-barra-n]");
  var info = {};
  piezas.forEach(function (b) {
    var id = b.getAttribute("data-pieza");
    info[id] = { nombre: b.getAttribute("data-nombre"), precio: +b.getAttribute("data-precio"), boton: b };
    kg[id] = 0;
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", function () {
      cambia(id, PASO);
      salta(b);
      if (anuncio) anuncio.textContent = info[id].nombre + ": " + fKg(kg[id]);
    });
  });
  function salta(el) {
    if (R) return;
    el.classList.remove("salta"); void el.offsetWidth; el.classList.add("salta");
  }
  function cambia(id, d) {
    kg[id] = Math.max(0, Math.min(MAX, Math.round((kg[id] + d) * 2) / 2));
    pinta();
  }
  function elegidos() { return piezas.map(function (b) { return b.getAttribute("data-pieza"); }).filter(function (id) { return kg[id] > 0; }); }
  function pinta() {
    var ids = elegidos(), suma = 0, kilos = 0;
    piezas.forEach(function (b) {
      var id = b.getAttribute("data-pieza"), on = kg[id] > 0;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      var e = b.querySelector("[data-kg]"); if (e) e.textContent = on ? fKg(kg[id]) : "";
    });
    // las líneas: se rehacen solo las que cambian para no perder el foco de los botones
    var hay = {};
    ids.forEach(function (id) {
      hay[id] = true;
      var p = info[id], sub = kg[id] * p.precio; suma += sub; kilos += kg[id];
      var li = lista.querySelector('[data-l="' + id + '"]');
      if (!li) {
        li = document.createElement("li"); li.setAttribute("data-l", id);
        li.innerHTML = '<span class="ln"></span><span class="cant"><button type="button" data-d="-1"></button><output></output><button type="button" data-d="1"></button></span><span class="sub"></span>';
        li.querySelector(".ln").innerHTML = "";
        var n = document.createElement("span"); n.textContent = p.nombre;
        var s = document.createElement("small"); s.textContent = nf(p.precio, p.precio % 1 !== 0) + " €/kg";
        li.querySelector(".ln").appendChild(n); li.querySelector(".ln").appendChild(s);
        var bm = li.querySelector('[data-d="-1"]'), bp = li.querySelector('[data-d="1"]');
        bm.textContent = "−"; bp.textContent = "+";
        bm.setAttribute("aria-label", T.menos + ": " + p.nombre); bp.setAttribute("aria-label", T.mas + ": " + p.nombre);
        bm.addEventListener("click", function () { cambia(id, -PASO); if (kg[id] === 0) { var sig = lista.querySelector("button"); if (sig) sig.focus(); else if (info[id].boton) info[id].boton.focus(); } });
        bp.addEventListener("click", function () { cambia(id, PASO); });
        // en el orden del mostrador
        var antes = null, orden = piezas.map(function (b) { return b.getAttribute("data-pieza"); });
        for (var i = orden.indexOf(id) + 1; i < orden.length && !antes; i++) antes = lista.querySelector('[data-l="' + orden[i] + '"]');
        lista.insertBefore(li, antes);
        if (!R && li.animate) li.animate([{ opacity: 0, transform: "translateY(-8px)" }, { opacity: 1, transform: "none" }], { duration: 380, easing: "cubic-bezier(.2,.75,.25,1)" });
      }
      li.querySelector("output").textContent = fKg(kg[id]);
      li.querySelector(".sub").textContent = fEur(sub);
    });
    $$("[data-l]", lista).forEach(function (li) { if (!hay[li.getAttribute("data-l")]) li.remove(); });
    var lleno = ids.length > 0;
    vacio.hidden = lleno; total.hidden = !lleno; peso.hidden = !lleno;
    var nuevo = fEur(suma);
    if (totalN.textContent !== nuevo) { totalN.textContent = nuevo; salta(totalN); }
    if (lleno && aviso) aviso.textContent = "";
    if (barraN) barraN.textContent = lleno ? fKg(kilos) + " · " + nuevo : "";
    barraVer();
    mensaje();
  }

  /* ---------- el mensaje de WhatsApp, escrito ---------- */
  var reloj = null;
  function textoMensaje() {
    var ids = elegidos();
    if (!ids.length) return "";
    var op = sel && sel.options[sel.selectedIndex];
    var l = [T.wa_hola];
    ids.forEach(function (id) { l.push("· " + info[id].nombre + ": " + fKg(kg[id])); });
    if (op) l.push(T.wa_hora + " " + op.getAttribute("data-txt") + ".");
    l.push(T.wa_gracias);
    return l.join("\n");
  }
  function mensaje() {
    var m = textoMensaje();
    wa.href = m ? T.wa + "?text=" + encodeURIComponent(m) : T.wa;
    if (!m) { caja.hidden = true; txt.textContent = ""; return; }
    caja.hidden = false;
    if (R) { esc.hidden = true; txt.textContent = m; return; }
    esc.hidden = false; txt.style.opacity = ".35";
    clearTimeout(reloj);
    reloj = setTimeout(function () { esc.hidden = true; txt.textContent = m; txt.style.opacity = ""; }, 650);
  }
  if (sel) sel.addEventListener("change", mensaje);
  if (wa) wa.addEventListener("click", function (e) {
    if (elegidos().length) return;
    e.preventDefault();
    aviso.textContent = T.aviso_vacio;
    var m = $("#mostradorea");
    if (m) m.scrollIntoView({ behavior: R ? "auto" : "smooth", block: "start" });
    if (piezas[0]) setTimeout(function () { piezas[0].focus({ preventScroll: true }); }, R ? 0 : 600);
  });

  /* ---------- barra del encargo: sale cuando hay piezas y el bloque del encargo no se ve ---------- */
  var encVisible = false, portadaVisible = true;
  function barraVer() { if (barra) barra.hidden = !(elegidos().length && !encVisible && !portadaVisible); }
  if ("IntersectionObserver" in window) {
    var enc = $("#enkargua"), por = $("[data-portada]");
    if (enc) new IntersectionObserver(function (e) { encVisible = e[0].isIntersecting; barraVer(); }, { threshold: 0.12 }).observe(enc);
    if (por) new IntersectionObserver(function (e) { portadaVisible = e[0].isIntersecting; barraVer(); }).observe(por);
  } else portadaVisible = false;

  pinta();

  /* ---------- menú del móvil ---------- */
  var mb = $("[data-menu-btn]"), mm = $("[data-menu]"), mt = $("[data-menu-txt]");
  function menu(abrir) {
    if (!mb || !mm) return;
    mm.hidden = !abrir;
    mb.setAttribute("aria-expanded", abrir ? "true" : "false");
    if (mt) mt.textContent = abrir ? T.cerrar : T.abrir;
    document.documentElement.classList.toggle("menu-abierto", abrir);
    document.documentElement.style.overflow = abrir ? "hidden" : "";
    if (abrir) { var a = mm.querySelector("a"); if (a) a.focus(); if (!R && mm.animate) mm.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: "ease-out" }); }
  }
  if (mb && mm) {
    mb.addEventListener("click", function () { menu(mm.hidden); });
    mm.addEventListener("click", function (e) { if (e.target.closest("a")) menu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !mm.hidden) { menu(false); mb.focus(); } });
    matchMedia("(min-width: 900px)").addEventListener("change", function (q) { if (q.matches) menu(false); });
  }

  /* ---------- paneles que entran al asomar (por tiempo, no atados al scroll) ---------- */
  var paneles = $$("[data-panel]");
  if (!R && paneles.length && "IntersectionObserver" in window) {
    document.documentElement.classList.add("anima");
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("visto"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    paneles.forEach(function (p) { io.observe(p); });
  }
})();
