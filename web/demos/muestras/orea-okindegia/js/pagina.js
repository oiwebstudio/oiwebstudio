/* OREA · muestra de panadería y pastelería (OI Studio, 8/11/2026).
   Abierto o cerrado según la hora real de Tolosa; lo que sale hoy del horno con «recién salido» o «sale dentro de X
   minutos» según la hora real (de noche, lo de mañana) y la fecha real; el encargo: piezas y cantidades, tarta con sabor,
   tamaño y mensaje (con un día de margen), día y hora de recogida dentro del horario, y el mensaje de WhatsApp escrito.
   Es una muestra: no se envía nada a ningún sitio; el botón solo abre WhatsApp con el texto.
   Sin JS o con «reducir movimiento»: todo se ve quieto y completo. */
(function () {
  var T = JSON.parse(document.getElementById("textos").textContent);
  var R = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EU = T.lang === "eu";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var may = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
  var hh = function (min) { return Math.floor(min / 60) + ":" + ("0" + (min % 60)).slice(-2); };
  var dos = function (n) { return ("0" + n).slice(-2); };

  /* ---------- hora de Tolosa ---------- */
  // horario de ejemplo en minutos: L–V 7:30–14:00 y 17:00–20:00, sábado 8:00–14:00, domingo 8:30–13:00
  var H = { 0: [[510, 780]], 1: [[450, 840], [1020, 1200]], 2: [[450, 840], [1020, 1200]], 3: [[450, 840], [1020, 1200]], 4: [[450, 840], [1020, 1200]], 5: [[450, 840], [1020, 1200]], 6: [[480, 840]] };
  function ahora() {
    try {
      var o = {};
      new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
        .formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
      return { dia: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday], min: +o.hour * 60 + +o.minute, y: +o.year, m: +o.month, d: +o.day };
    } catch (e) { var n = new Date(); return { dia: n.getDay(), min: n.getHours() * 60 + n.getMinutes(), y: n.getFullYear(), m: n.getMonth() + 1, d: n.getDate() }; }
  }
  function fecha(a, k) { // la fecha de dentro de k días, escrita como en cada idioma
    var f = new Date(Date.UTC(a.y, a.m - 1, a.d + k));
    var y = f.getUTCFullYear(), m = f.getUTCMonth() + 1, d = f.getUTCDate();
    return EU ? y + "/" + dos(m) + "/" + dos(d) : d + "/" + m + "/" + y;
  }

  /* ---------- portada: abierto o cerrado ahora ---------- */
  function estado() {
    var a = ahora(), f = H[a.dia], txt = "", abierto = false;
    for (var i = 0; i < f.length; i++) if (a.min >= f[i][0] && a.min < f[i][1]) { txt = T.est["a" + f[i][1]]; abierto = true; }
    if (!abierto) {
      var luego = f.filter(function (x) { return x[0] > a.min; })[0];
      txt = luego ? T.est["h" + luego[0]] : T.est["m" + H[(a.dia + 1) % 7][0][0]];
    }
    var e = $("[data-estado]");
    if (!e || !txt) return;
    if (e.textContent !== txt) e.textContent = txt;
    e.classList.toggle("abierto", abierto);
    e.hidden = false;
  }

  /* ---------- las horas del horno ---------- */
  function horno() {
    var a = ahora(), cierre = H[a.dia][H[a.dia].length - 1][1];
    var k = a.min < cierre ? 0 : 1; // pasada la hora de cerrar, lo de mañana
    var dia = (a.dia + k) % 7, lista = T.horno[dia];
    var f = $("[data-fecha]");
    if (f) {
      var t = may(k ? T.manana : T.hoy) + ", " + T.dias[dia] + ", " + fecha(a, k);
      if (f.textContent !== t) f.textContent = t;
      f.hidden = false;
    }
    $$("[data-horno] li").forEach(function (li) {
      var n = +li.getAttribute("data-n"), e = null;
      lista.forEach(function (x) { if (x[1] === n) e = x; });
      li.hidden = !e;
      if (!e) return;
      var st = "", clase = "";
      if (!k) {
        var dif = e[0] - a.min;
        if (dif <= -45) { st = T.st.salio; clase = "ya"; }
        else if (dif <= 0) { st = T.st.recien; clase = "ahora"; }
        else if (dif <= 90) { st = T.st.pronto.replace("25", String(dif)); clase = "ahora"; }
      }
      var tt = li.querySelector("[data-t]"), es = li.querySelector("[data-est]");
      if (tt.textContent !== hh(e[0])) tt.textContent = hh(e[0]);
      if (es.textContent !== st) es.textContent = st;
      li.classList.toggle("ya", clase === "ya");
      li.classList.toggle("ahora", clase === "ahora");
    });
  }

  /* ---------- el encargo ---------- */
  var piezas = $$("[data-pieza]"), n = {}, info = {};
  var lista = $("[data-lineas-enc]"), vacio = $("[data-vacio]"), total = $("[data-total]"), totalN = $("[data-total-n]");
  var wa = $("[data-wa]"), aviso = $("[data-aviso]"), caja = $("[data-mensaje-caja]"), escr = $("[data-escribiendo]"), txt = $("[data-mensaje]");
  var anuncio = $("[data-anuncio]"), barra = $("[data-barra]"), barraN = $("[data-barra-n]");
  var tam = $("[data-tam]"), msg = $("[data-msg]"), notaT = $("[data-nota-t]"), vista = $("[data-tarta-msg]");
  var diasCaja = $("[data-dias]"), sel = $("[data-hora]"), campoHora = $("[data-campo-hora]");
  var nf = function (x) { return (x % 1 ? x.toFixed(2) : String(x)).replace(".", ","); };
  var fEur = function (x) { return nf(Math.round(x * 100) / 100) + " €"; };

  piezas.forEach(function (b) {
    var id = b.getAttribute("data-pieza");
    info[id] = { nombre: b.getAttribute("data-nombre"), euros: +b.getAttribute("data-euros"), boton: b };
    n[id] = 0;
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", function () {
      cambia(id, 1);
      salta(b);
      if (anuncio) anuncio.textContent = info[id].nombre + ": " + n[id];
    });
  });
  function salta(el) { if (R) return; el.classList.remove("salta"); void el.offsetWidth; el.classList.add("salta"); }
  function cambia(id, d) { n[id] = Math.max(0, Math.min(40, n[id] + d)); pinta(); }
  function elegidos() { return piezas.map(function (b) { return b.getAttribute("data-pieza"); }).filter(function (id) { return n[id] > 0; }); }
  function tarta() {
    var s = $('input[name="sabor"]:checked'), t = $('input[name="tam"]:checked');
    if (!s || !s.value) return null;
    return { sabor: T.sabores[s.value], tam: T.tamanos[t ? t.value : "8"], msg: (msg && msg.value || "").trim() };
  }

  /* día y hora de recogida: cada media hora dentro del horario; hoy, con una hora de margen; las tartas, desde mañana */
  var diaSel = null;
  function huecos(k) {
    var a = ahora(), dia = (a.dia + k) % 7, out = [];
    H[dia].forEach(function (tr) { for (var t = tr[0] + 30; t <= tr[1] - 30; t += 30) if (k > 0 || t >= a.min + 60) out.push(t); });
    return out;
  }
  function dias() {
    if (!diasCaja) return;
    var a = ahora(), conTarta = !!tarta(), previo = diaSel, html = "", primero = null;
    for (var k = 0; k < 5; k++) {
      var dia = (a.dia + k) % 7, nombre = k === 0 ? T.hoy : k === 1 ? T.manana : T.dias[dia];
      var off = (conTarta && k === 0) || !huecos(k).length;
      if (!off && primero === null) primero = k;
      html += '<label class="caja"><input type="radio" name="dia" value="' + k + '"' + (off ? " disabled" : "") + '><span>' + may(nombre) + "</span></label>";
    }
    if (diasCaja.getAttribute("data-html") !== html) { diasCaja.innerHTML = html; diasCaja.setAttribute("data-html", html); }
    var ok = previo !== null && !$('input[name="dia"][value="' + previo + '"]', diasCaja).disabled;
    diaSel = ok ? previo : primero;
    var r = diaSel !== null && $('input[name="dia"][value="' + diaSel + '"]', diasCaja);
    if (r) r.checked = true;
    horas();
  }
  function horas() {
    if (!sel || diaSel === null) return;
    var previo = sel.value, l = huecos(diaSel);
    var html = l.map(function (t) { return '<option value="' + t + '">' + hh(t) + "</option>"; }).join("");
    if (sel.getAttribute("data-html") !== html + diaSel) { sel.innerHTML = html; sel.setAttribute("data-html", html + diaSel); }
    if (previo && l.indexOf(+previo) >= 0) sel.value = previo;
    campoHora.hidden = !l.length;
  }
  if (diasCaja) diasCaja.addEventListener("change", function (e) { if (e.target.name === "dia") { diaSel = +e.target.value; horas(); mensaje(); } });
  if (sel) sel.addEventListener("change", mensaje);

  /* la tarta: sabor, tamaño y mensaje */
  function pintaTarta() {
    var t = tarta();
    if (tam) tam.disabled = !t;
    if (msg) msg.disabled = !t;
    if (vista) { var v = t && t.msg ? t.msg : ""; if (vista.textContent !== v) vista.textContent = v; }
    if (notaT) notaT.classList.toggle("marca", !!t);
  }
  $$('input[name="sabor"], input[name="tam"]').forEach(function (i) { i.addEventListener("change", function () { pintaTarta(); dias(); pinta(); }); });
  if (msg) msg.addEventListener("input", function () { pintaTarta(); mensaje(); });

  function linea(id, nombre, detalle, sub, conCant) {
    var li = lista.querySelector('[data-l="' + id + '"]'), nuevo = !li;
    if (nuevo) {
      li = document.createElement("li"); li.setAttribute("data-l", id);
      li.innerHTML = '<span class="ln"><span></span><small></small></span><span class="cant"><button type="button" data-d="-1">−</button><output></output><button type="button" data-d="1">+</button></span><span class="sub"></span>';
      li.querySelector(".ln span").textContent = nombre;
      var bm = li.querySelector('[data-d="-1"]'), bp = li.querySelector('[data-d="1"]');
      bm.setAttribute("aria-label", T.menos + ": " + nombre); bp.setAttribute("aria-label", T.mas + ": " + nombre);
      if (conCant) {
        bm.addEventListener("click", function () { cambia(id, -1); if (!n[id]) { var b = lista.querySelector("button"); (b || info[id].boton).focus(); } });
        bp.addEventListener("click", function () { cambia(id, 1); });
      } else {
        bp.remove();
        bm.addEventListener("click", function () { var s = $('input[name="sabor"][value=""]'); if (s) { s.checked = true; s.dispatchEvent(new Event("change", { bubbles: true })); s.focus(); } });
      }
      lista.appendChild(li);
      if (!R && li.animate) li.animate([{ opacity: 0, transform: "translateY(-8px)" }, { opacity: 1, transform: "none" }], { duration: 380, easing: "cubic-bezier(.2,.75,.25,1)" });
    }
    li.querySelector(".ln small").textContent = detalle;
    var o = li.querySelector("output"); o.textContent = conCant ? n[id] : "";
    li.querySelector(".sub").textContent = fEur(sub);
    return li;
  }
  function pinta() {
    var ids = elegidos(), suma = 0, piezasN = 0, hay = {};
    piezas.forEach(function (b) {
      var id = b.getAttribute("data-pieza"), on = n[id] > 0;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      var e = b.querySelector("[data-n]"); var v = on ? String(n[id]) : ""; if (e.textContent !== v) e.textContent = v;
    });
    ids.forEach(function (id) {
      hay[id] = true; var p = info[id], sub = n[id] * p.euros; suma += sub; piezasN += n[id];
      linea(id, p.nombre, fEur(p.euros), sub, true);
    });
    var t = tarta();
    if (t) { hay.tarta = true; suma += t.tam.euros; linea("tarta", T.tarta, t.sabor + ", " + t.tam.txt, t.tam.euros, false).querySelector(".ln small").textContent = t.sabor + ", " + t.tam.txt; }
    // el orden: piezas como en la lista y la tarta al final
    piezas.forEach(function (b) { var li = lista.querySelector('[data-l="' + b.getAttribute("data-pieza") + '"]'); if (li) lista.appendChild(li); });
    var lt = lista.querySelector('[data-l="tarta"]'); if (lt) lista.appendChild(lt);
    $$("[data-l]", lista).forEach(function (li) { if (!hay[li.getAttribute("data-l")]) li.remove(); });
    var lleno = ids.length > 0 || !!t;
    vacio.hidden = lleno; total.hidden = !lleno;
    var nuevo = fEur(suma);
    if (totalN.textContent !== nuevo) { totalN.textContent = nuevo; salta(totalN); }
    if (lleno && aviso) aviso.textContent = "";
    if (barraN) barraN.textContent = lleno ? (piezasN + (t ? 1 : 0)) + " · " + nuevo : "";
    barraVer();
    mensaje();
  }

  /* ---------- el mensaje de WhatsApp, escrito ---------- */
  var reloj = null;
  function textoMensaje() {
    var ids = elegidos(), t = tarta();
    if (!ids.length && !t) return "";
    var l = [T.wa_hola];
    ids.forEach(function (id) { l.push("· " + info[id].nombre + " × " + n[id]); });
    if (t) { l.push("· " + T.tarta + ": " + t.sabor + ", " + t.tam.txt); if (t.msg) l.push("   " + T.wa_mensaje + ": «" + t.msg.toUpperCase() + "»"); }
    if (diaSel !== null && sel && sel.value) {
      var a = ahora(), dia = (a.dia + diaSel) % 7, nombre = diaSel === 0 ? T.hoy : diaSel === 1 ? T.manana : T.dias[dia];
      l.push(T.wa_recoger + " " + nombre + ", " + hh(+sel.value) + ".");
    }
    l.push(T.wa_gracias);
    return l.join("\n");
  }
  function mensaje() {
    var m = textoMensaje();
    wa.href = m ? T.wa + "?text=" + encodeURIComponent(m) : T.wa;
    if (!m) { caja.hidden = true; txt.textContent = ""; return; }
    caja.hidden = false;
    if (R) { escr.hidden = true; txt.textContent = m; return; }
    escr.hidden = false; txt.style.opacity = ".35";
    clearTimeout(reloj);
    reloj = setTimeout(function () { escr.hidden = true; txt.textContent = m; txt.style.opacity = ""; }, 650);
  }
  if (wa) wa.addEventListener("click", function (e) {
    if (elegidos().length || tarta()) return;
    e.preventDefault();
    aviso.textContent = T.aviso_vacio;
    var p = $("[data-piezas]");
    if (p) p.scrollIntoView({ behavior: R ? "auto" : "smooth", block: "center" });
    if (piezas[0]) setTimeout(function () { piezas[0].focus({ preventScroll: true }); }, R ? 0 : 600);
  });

  /* ---------- barra del encargo (móvil): sale cuando hay algo y no se ve ninguna parte del bloque del encargo ---------- */
  var bolsaVisible = false, portadaVisible = true;
  function barraVer() { if (barra) barra.hidden = !((elegidos().length || tarta()) && !bolsaVisible && !portadaVisible); }
  if ("IntersectionObserver" in window) {
    var bo = $("#enkargua"), por = $("[data-portada]");
    if (bo) new IntersectionObserver(function (e) { bolsaVisible = e[0].isIntersecting; barraVer(); }).observe(bo);
    if (por) new IntersectionObserver(function (e) { portadaVisible = e[0].isIntersecting; barraVer(); }).observe(por);
  } else portadaVisible = false;

  /* ---------- puntos del carrusel de piezas (móvil) ---------- */
  var tira = $("[data-piezas]"), puntos = $$("[data-puntos] i");
  if (tira && puntos.length) {
    var marca = function () {
      var lis = tira.children, x = tira.scrollLeft, mejor = 0, d = 1e9;
      for (var i = 0; i < lis.length; i++) { var dd = Math.abs(lis[i].offsetLeft - tira.offsetLeft - 20 - x); if (dd < d) { d = dd; mejor = i; } }
      if (tira.scrollLeft + tira.clientWidth >= tira.scrollWidth - 4) mejor = lis.length - 1;
      puntos.forEach(function (p, i) { p.classList.toggle("on", i === mejor); });
    };
    tira.addEventListener("scroll", function () { requestAnimationFrame(marca); }, { passive: true });
  }

  /* ---------- menú ---------- */
  var botones = $$("[data-menu-btn]"), mm = $("[data-menu]"), cerrar = $("[data-menu-cerrar]"), ultimo = null;
  function menu(abrir) {
    if (!mm) return;
    mm.hidden = !abrir;
    botones.forEach(function (b) { b.setAttribute("aria-expanded", abrir ? "true" : "false"); });
    document.documentElement.style.overflow = abrir ? "hidden" : "";
    if (abrir) {
      var a = mm.querySelector("a"); if (a) a.focus();
      if (!R && mm.animate) {
        mm.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: "ease-out" });
        $$("nav a", mm).forEach(function (x, i) { x.animate([{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "none" }], { duration: 700, delay: 60 + i * 70, easing: "cubic-bezier(.2,.72,.2,1)", fill: "backwards" }); });
      }
    } else if (ultimo) ultimo.focus();
  }
  botones.forEach(function (b) { b.addEventListener("click", function () { ultimo = b; menu(mm.hidden); }); });
  if (cerrar) cerrar.addEventListener("click", function () { menu(false); });
  if (mm) {
    mm.addEventListener("click", function (e) { if (e.target.closest("a")) { ultimo = null; menu(false); } });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !mm.hidden) menu(false); });
  }

  /* ---------- arranque ---------- */
  estado(); horno(); pintaTarta(); dias(); pinta();
  setInterval(function () { estado(); horno(); dias(); mensaje(); }, 30000);

  /* ---------- paneles y fotos que entran al asomar (por tiempo, no atados al scroll) ---------- */
  var paneles = $$("[data-panel]");
  if (!R && paneles.length && "IntersectionObserver" in window) {
    document.documentElement.classList.add("anima");
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("visto"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    paneles.forEach(function (p) { io.observe(p); });
  }
  if (!R && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    $$("[data-foto]").forEach(function (f) {
      var img = f.querySelector("img");
      gsap.fromTo(f, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.5, ease: "power3.out", clearProps: "clipPath", scrollTrigger: { trigger: f, start: "top 88%", once: true } });
      if (img) gsap.fromTo(img, { scale: 1.14 }, { scale: 1, duration: 1.9, ease: "power3.out", clearProps: "transform", scrollTrigger: { trigger: f, start: "top 88%", once: true } });
    });
  }
})();
