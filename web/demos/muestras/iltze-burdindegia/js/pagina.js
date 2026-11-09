/* ILTZE BURDINDEGIA · lo que se mueve y lo que reacciona (OI Studio, 9/11/2026).
   1. Abierto o cerrado ahora, según la hora real de Villabona (barra gris de arriba, como el aviso de la referencia, y pie).
      Se rehace cada minuto. La barra se puede cerrar con el aspa.
   2. Pase de fotos de la portada: fundido cada 5,5 s mientras nadie lo toca y la foto se ve; puntos debajo, deslizar en el móvil,
      flechas del teclado. Con «reducir movimiento», solo cambia al tocar los puntos.
   3. Mostrador (llaves, afilado y arreglos): el signo más apunta la pieza; la cesta de la izquierda (y la del móvil) suma el total
      (los números corren), la tarjeta dice cuántas lleva y deja quitar una; debajo, la lista y el WhatsApp escrito.
   4. ¿Lo tenéis?: sección → piezas de esa sección (o escribir cuál), medida y foto (se ve aquí y no sale del móvil); el mensaje se
      escribe solo a la derecha y el botón abre WhatsApp con él. Las secciones de la izquierda y el buscador llevan aquí.
   5. Menú del móvil. 6. Paneles que entran al asomar (GSAP + ScrollTrigger), por tiempo; sin GSAP o con «reducir movimiento», quieto.
   Nada se envía solo: los mensajes salen por WhatsApp (wa.me) y los manda la persona. */
(function () {
  "use strict";
  var T = JSON.parse(document.getElementById("textos").textContent);
  var WA = "https://wa.me/34600000000";
  var quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var minus = function (s) { return s.charAt(0).toLowerCase() + s.slice(1); };
  var waUrl = function (txt) { return WA + "?text=" + encodeURIComponent(txt); };

  /* ---------- 1. abierto o cerrado (hora de Villabona) ---------- */
  function ahora() {
    try {
      var o = {};
      new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
        .formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
      return { dia: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday], min: +o.hour * 60 + +o.minute };
    } catch (e) { var n = new Date(); return { dia: n.getDay(), min: n.getHours() * 60 + n.getMinutes() }; }
  }
  // Horario de ejemplo (minutos): lunes a viernes 9:00–13:00 y 15:30–19:30; sábado 9:30–13:30; domingo cerrado
  var LV = [[540, 780], [930, 1170]];
  var H = { 0: [], 1: LV, 2: LV, 3: LV, 4: LV, 5: LV, 6: [[570, 810]] };
  var CIERRE = { 780: "est_ab_1300", 1170: "est_ab_1930", 810: "est_ab_1330" };
  function estado() {
    var a = ahora(), f = H[a.dia];
    for (var i = 0; i < f.length; i++) if (a.min >= f[i][0] && a.min < f[i][1]) return { abierto: true, txt: T[CIERRE[f[i][1]]] };
    if (f.length === 2 && a.min >= 780 && a.min < 930) return { abierto: false, txt: T.est_ce_tarde };
    if (f.length && a.min < f[0][0]) return { abierto: false, txt: T[a.dia === 6 ? "est_ce_hoy_s" : "est_ce_hoy"] };
    // ya ha cerrado: ¿qué abre después?
    return { abierto: false, txt: T[a.dia === 5 ? "est_ce_manana_s" : a.dia === 6 ? "est_ce_lunes" : "est_ce_manana"] };
  }
  function pintarEstado() {
    var e = estado();
    $$("[data-estado]").forEach(function (el) { el.textContent = e.txt; });
    var pie = $("[data-estado-pie]"); if (pie) pie.textContent = e.txt;
    var av = $("[data-aviso]"); if (av) av.setAttribute("data-abierto", e.abierto ? "si" : "no");
  }
  pintarEstado();
  setInterval(pintarEstado, 60000);
  var avX = $("[data-aviso-x]");
  if (avX) avX.addEventListener("click", function () {
    var av = $("[data-aviso]");
    av.classList.add("fuera");
    setTimeout(function () { av.hidden = true; }, quieto ? 0 : 350);
  });

  /* ---------- 2. pase de fotos ---------- */
  var pase = $("[data-pase]");
  if (pase) {
    var fotos = $$(".foto", pase), puntos = $$("[data-punto]", pase), act = 0, reloj = null, visible = true, encima = false;
    var cargar = function (i) {
      var f = fotos[(i + fotos.length) % fotos.length];
      $$("[data-srcset]", f).forEach(function (s) { s.setAttribute("srcset", s.getAttribute("data-srcset")); s.removeAttribute("data-srcset"); });
      $$("img[data-src]", f).forEach(function (im) { im.src = im.getAttribute("data-src"); im.removeAttribute("data-src"); });
    };
    var ir = function (i) {
      i = (i + fotos.length) % fotos.length;
      if (i === act) return;
      cargar(i); cargar(i + 1);
      fotos[act].classList.remove("activa"); fotos[act].setAttribute("aria-hidden", "true");
      fotos[i].classList.add("activa"); fotos[i].removeAttribute("aria-hidden");
      puntos[act].removeAttribute("aria-current"); puntos[i].setAttribute("aria-current", "true");
      act = i;
    };
    var seguir = function () {
      clearInterval(reloj);
      if (quieto) return;
      reloj = setInterval(function () { if (visible && !encima && !document.hidden) ir(act + 1); }, 5500);
    };
    puntos.forEach(function (p, i) { p.addEventListener("click", function () { ir(i); seguir(); }); });
    pase.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") encima = true; });
    pase.addEventListener("pointerleave", function () { encima = false; });
    pase.addEventListener("focusin", function () { encima = true; });
    pase.addEventListener("focusout", function () { encima = false; });
    pase.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") { ir(act + 1); seguir(); } if (e.key === "ArrowLeft") { ir(act - 1); seguir(); } });
    var x0 = null;
    pase.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    pase.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var d = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(d) > 40) { ir(act + (d < 0 ? 1 : -1)); seguir(); }
    }, { passive: true });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(pase);
    window.addEventListener("load", function () { setTimeout(function () { cargar(1); }, 600); });
    seguir();
  }

  /* ---------- números que corren ---------- */
  function corre(el, de, a) {
    if (!el) return;
    if (quieto || de === a) { el.textContent = a; return; }
    var t0 = performance.now(), dur = 520;
    (function paso(t) {
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(de + (a - de) * e);
      if (k < 1) requestAnimationFrame(paso);
    })(t0);
  }

  /* ---------- 3. mostrador ---------- */
  var cuenta = {}, totalAnt = 0;
  var piezas = $$("[data-pieza]");
  function pintarMostrador() {
    var total = 0, n = 0, lineas = [], html = "";
    piezas.forEach(function (p) {
      var k = p.getAttribute("data-pieza"), c = cuenta[k] || 0, eur = +p.getAttribute("data-euros"), nom = p.getAttribute("data-nombre");
      var el = $("[data-en-lista]", p); el.hidden = c === 0; $("[data-n]", el).textContent = c;
      if (c) {
        total += c * eur; n += c;
        lineas.push(c + " × " + nom + " (" + c * eur + " €)");
        html += "<li><b>" + c + " ×</b><span>" + nom + " · " + c * eur + " €</span></li>";
      }
    });
    var caja = $("[data-lista-txt]");
    caja.innerHTML = n ? "<ul>" + html + "</ul>" : "<p></p>";
    if (!n) caja.firstChild.textContent = T.lista_vacia;
    $("[data-lista-total]").hidden = n === 0;
    corre($("[data-lista-euros]"), totalAnt, total);
    corre($("[data-cesta-total]"), totalAnt, total);
    var cn = $("[data-cesta-n]"); if (cn) { cn.hidden = n === 0; cn.textContent = n; }
    var wa = $("[data-wa-most]");
    if (n) {
      wa.href = waUrl(T.wa_most_hola + "\n" + lineas.join("\n") + "\n" + T.wa_most_total + " " + total + " €\n" + T.wa_most_hora);
      wa.setAttribute("aria-disabled", "false");
    } else { wa.href = WA; wa.setAttribute("aria-disabled", "true"); }
    totalAnt = total;
  }
  function saltaCesta() {
    if (quieto) return;
    $$("[data-cesta]").forEach(function (c) { c.classList.remove("salta"); void c.offsetWidth; c.classList.add("salta"); });
  }
  piezas.forEach(function (p) {
    var k = p.getAttribute("data-pieza");
    $("[data-mas]", p).addEventListener("click", function () {
      cuenta[k] = (cuenta[k] || 0) + 1;
      var b = this; b.classList.remove("dio"); void b.offsetWidth; b.classList.add("dio");
      pintarMostrador(); saltaCesta();
    });
    $("[data-quitar]", p).addEventListener("click", function () {
      cuenta[k] = Math.max(0, (cuenta[k] || 0) - 1);
      pintarMostrador();
      if (!cuenta[k]) $("[data-mas]", p).focus();
    });
  });
  var waMost = $("[data-wa-most]");
  if (waMost) waMost.addEventListener("click", function (e) {
    if (this.getAttribute("aria-disabled") === "true") { e.preventDefault(); var pr = $("[data-mas]"); if (pr) pr.focus(); }
  });
  if (piezas.length) pintarMostrador();

  /* ---------- 4. ¿Lo tenéis? ---------- */
  var lt = $("[data-lt]");
  if (lt) {
    var otra = $("[data-otra]", lt), medida = $("[data-medida]", lt), fotoIn = $("[data-foto-in]", lt), prev = $("[data-foto-prev]", lt), img = $("[data-foto-img]", lt);
    var msg = $("[data-msg]", lt), waLt = $("[data-wa-lt]", lt), url = null, hayFoto = false;
    var secActual = function () { var r = $("input[name=sec]:checked", lt); return r ? r : null; };
    var mostrarChips = function (k, anim) {
      $$("[data-chips]", lt).forEach(function (c) {
        var es = c.getAttribute("data-chips") === k; c.hidden = !es;
        if (es && anim && !quieto && c.animate) $$(".chip", c).forEach(function (ch, i) {
          ch.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 420, delay: i * 40, easing: "cubic-bezier(.2,.75,.25,1)", fill: "backwards" });
        });
      });
    };
    var escribir = function () {
      var s = secActual(), p = $("input[name=pieza]:checked", lt), o = otra.value.trim(), m = medida.value.trim();
      var pieza = o || (p ? minus(p.value) : "");
      var txt;
      if (!pieza) { txt = T.lt_vacio; waLt.href = WA; waLt.setAttribute("aria-disabled", "true"); }
      else {
        txt = T.wa_lt_hola + " " + pieza + (s && !o ? " (" + minus(s.getAttribute("data-nombre")) + ")" : "") + "." +
          (m ? "\n" + T.wa_lt_medida + " " + m : "") + (hayFoto ? "\n" + T.wa_lt_foto : "") + "\n" + T.wa_lt_fin;
        waLt.href = waUrl(txt); waLt.setAttribute("aria-disabled", "false");
      }
      if (msg.textContent !== txt) { msg.textContent = txt; if (!quieto) { msg.classList.remove("cambia"); void msg.offsetWidth; msg.classList.add("cambia"); } }
    };
    lt.addEventListener("change", function (e) {
      if (e.target.name === "sec") {
        $$("input[name=pieza]:checked", lt).forEach(function (r) { r.checked = false; });
        mostrarChips(e.target.value, true);
      }
      if (e.target.name === "pieza") otra.value = "";
      escribir();
    });
    otra.addEventListener("input", function () { if (otra.value.trim()) $$("input[name=pieza]:checked", lt).forEach(function (r) { r.checked = false; }); escribir(); });
    medida.addEventListener("input", escribir);
    fotoIn.addEventListener("change", function () {
      var f = fotoIn.files && fotoIn.files[0];
      if (url) { URL.revokeObjectURL(url); url = null; }
      hayFoto = !!(f && /^image\//.test(f.type));
      if (hayFoto) {
        url = URL.createObjectURL(f); img.src = url; prev.hidden = false;
        if (!quieto && prev.animate) prev.animate([{ opacity: 0, transform: "scale(.94)" }, { opacity: 1, transform: "none" }], { duration: 450, easing: "cubic-bezier(.2,.75,.25,1)" });
      } else prev.hidden = true;
      escribir();
    });
    $("[data-foto-quitar]", lt).addEventListener("click", function () {
      fotoIn.value = ""; hayFoto = false; prev.hidden = true; if (url) { URL.revokeObjectURL(url); url = null; } img.removeAttribute("src");
      $("[data-foto-lbl]", lt).focus(); escribir();
    });
    waLt.addEventListener("click", function (e) { if (this.getAttribute("aria-disabled") === "true") { e.preventDefault(); otra.focus(); } });
    // Las secciones de la izquierda (y del menú) eligen la sección aquí
    $$("[data-ir-sec]").forEach(function (a) {
      a.addEventListener("click", function () {
        var r = $("input[name=sec][value=" + a.getAttribute("data-ir-sec") + "]", lt);
        if (r && !r.checked) { r.checked = true; $$("input[name=pieza]:checked", lt).forEach(function (x) { x.checked = false; }); mostrarChips(r.value, true); escribir(); }
        cerrarMenu();
      });
    });
    // El buscador de la izquierda escribe la pieza aquí
    var buscar = $("[data-buscar]");
    if (buscar) buscar.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = $("[data-buscar-txt]", buscar).value.trim();
      if (q) { otra.value = q; $$("input[name=pieza]:checked", lt).forEach(function (r) { r.checked = false; }); escribir(); }
      document.getElementById("lotenes").scrollIntoView({ behavior: quieto ? "auto" : "smooth", block: "start" });
      setTimeout(function () { (q ? medida : otra).focus({ preventScroll: true }); }, quieto ? 0 : 700);
    });
    escribir();
  }

  /* ---------- 5. menú del móvil ---------- */
  var mBtn = $("[data-menu-btn]"), menu = $("[data-menu]");
  function cerrarMenu() { if (!menu || menu.hidden) return; menu.hidden = true; mBtn.setAttribute("aria-expanded", "false"); document.documentElement.style.overflow = ""; }
  if (mBtn && menu) {
    mBtn.addEventListener("click", function () {
      var abre = menu.hidden;
      menu.hidden = !abre; mBtn.setAttribute("aria-expanded", String(abre));
      document.documentElement.style.overflow = abre ? "hidden" : "";
      if (abre && !quieto && menu.animate) $$("li, .lado-h, .menu-pie", menu).forEach(function (el, i) {
        el.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 380, delay: i * 22, easing: "cubic-bezier(.2,.75,.25,1)", fill: "backwards" });
      });
    });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", cerrarMenu); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) { cerrarMenu(); mBtn.focus(); } });
    matchMedia("(min-width: 760px)").addEventListener("change", cerrarMenu);
  }

  /* ---------- 6. paneles al asomar ---------- */
  if (!quieto && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    $$(".filete-ancho").forEach(function (f) {
      gsap.from(f, { scaleX: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: f, start: "top 92%", once: true } });
    });
    $$(".pieza-foto").forEach(function (f) {
      gsap.from(f, { clipPath: "inset(10% 10% 10% 10% round 15px)", duration: 1.1, ease: "power3.out", clearProps: "clipPath", scrollTrigger: { trigger: f, start: "top 92%", once: true } });
    });
    $$(".lista, .lt-sec, .lt-centro, .lt-msg, .pie-cols, .pie-idioma").forEach(function (p, i) {
      gsap.from(p, { y: 28, opacity: 0, duration: 1, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: p, start: "top 92%", once: true } });
    });
  }
})();
