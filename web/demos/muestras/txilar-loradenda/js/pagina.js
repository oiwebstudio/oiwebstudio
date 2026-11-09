/* TXILAR LORAK · lo que se mueve y lo que reacciona (OI Studio, 9/11/2026).
   1. Pase de fotos de la portada (como MUCK FLORAL): mitad izquierda = anterior, mitad derecha = siguiente, cursor «[SIGUIENTE]»
      con ratón, deslizar en el móvil, flechas del teclado; la flor gira un pétalo en cada cambio. Pasa sola cada 6,5 s mientras
      nadie la toca (no con «reducir movimiento»).
   2. El encargo: para qué, tamaño, color, día (hoy solo antes de las 12:00 y si abre; mañana, o el lunes si mañana es domingo;
      otro día con calendario, sin domingos), recoger o llevar (y a qué pueblo), mensaje de la tarjeta. Sale el precio orientativo
      (los números giran), la tarjeta escrita con la flor del color elegido, el resumen y el mensaje de WhatsApp. Nada se envía solo.
   3. La lista de pueblos de reparto se toca y pasa al encargo. 4. Bodas: fecha del evento → días que faltan y mensaje para la cita.
   5. Abierto o cerrado según la hora real de Tolosa. 6. Barra de abajo con el ramo cuando el encargo no se ve.
   7. Paneles que entran al asomar (GSAP + ScrollTrigger), por tiempo; con «reducir movimiento» o sin GSAP, todo quieto y visible. */
(function () {
  "use strict";
  var T = JSON.parse(document.getElementById("textos").textContent);
  var LOC = T.lang === "eu" ? "eu" : "es";
  var WA = "https://wa.me/34600000000";
  var quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fino = matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- hora y fecha de Tolosa ---------- */
  function ahora() {
    try {
      var o = {};
      new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
        .formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
      return { dia: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday], min: +o.hour * 60 + +o.minute, f: Date.UTC(+o.year, +o.month - 1, +o.day) };
    } catch (e) { var n = new Date(); return { dia: n.getDay(), min: n.getHours() * 60 + n.getMinutes(), f: Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) }; }
  }
  var DIA = 864e5;
  var ymd = function (t) { return new Date(t).toISOString().slice(0, 10); };
  var deYmd = function (s) { var p = s.split("-"); return Date.UTC(+p[0], +p[1] - 1, +p[2]); };
  // La fecha la escribe el navegador (Intl, datos de CLDR). Si no trae el euskera, en número (2026/11/10), sin traducir a mano.
  var conIntl = false; try { conIntl = Intl.DateTimeFormat.supportedLocalesOf([LOC]).length > 0; } catch (e) {}
  var fmtFecha = function (t) {
    var otroAno = new Date(t).getUTCFullYear() !== new Date(A0.f).getUTCFullYear();
    if (conIntl) try { return new Intl.DateTimeFormat(LOC, { weekday: "long", day: "numeric", month: "long", year: otroAno ? "numeric" : undefined, timeZone: "UTC" }).format(new Date(t)); } catch (e) {}
    var d = new Date(t), dd = String(d.getUTCDate()).padStart(2, "0"), mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    return LOC === "eu" ? d.getUTCFullYear() + "/" + mm + "/" + dd : dd + "/" + mm + "/" + d.getUTCFullYear();
  };
  var A0 = ahora();
  // Horario de ejemplo (minutos): lunes a viernes 9:30–13:30 y 16:30–20:00; sábado 9:30–14:00; domingo cerrado
  var H = { 0: [], 1: [[570, 810], [990, 1200]], 2: [[570, 810], [990, 1200]], 3: [[570, 810], [990, 1200]], 4: [[570, 810], [990, 1200]], 5: [[570, 810], [990, 1200]], 6: [[570, 840]] };
  var LIMITE_HOY = 720; // los ramos para hoy, antes de las 12:00

  function estadoTxt(a) {
    var f = H[a.dia];
    for (var i = 0; i < f.length; i++) if (a.min >= f[i][0] && a.min < f[i][1]) return T[f[i][1] === 810 ? "est_ab_1330" : f[i][1] === 840 ? "est_ab_1400" : "est_ab_2000"];
    if (f.length === 2 && a.min >= 810 && a.min < 990) return T.est_ce_tarde;
    if (f.length && a.min < 570) return T.est_ce_hoy;
    return T[a.dia === 6 ? "est_ce_lunes" : "est_ce_manana"];
  }
  var est = $("[data-estado]");
  function pintaEstado() { if (est) est.textContent = estadoTxt(ahora()); }
  pintaEstado();
  setInterval(pintaEstado, 60000);

  /* ---------- 1. pase de fotos ---------- */
  var portada = $("[data-portada]"), cab = $("[data-cab]");
  var diapos = $$("[data-diapo]"), actual = 0, giro = 0, reloj = null, pausa = false;
  var flP = $("[data-flor-portada]"), num = $("[data-num]"), ley = $("[data-leyenda]"), leyTxt = $("[data-leyenda-txt]");
  // las fotos del pase se piden cuando toca: la que se va a ver y las de al lado (las demás esperan en data-srcset)
  function carga(n) {
    var d = diapos[(n + diapos.length) % diapos.length]; if (!d) return;
    $$("[data-srcset]", d).forEach(function (e) { e.setAttribute("srcset", e.getAttribute("data-srcset")); e.removeAttribute("data-srcset"); });
    $$("[data-src]", d).forEach(function (e) { e.setAttribute("src", e.getAttribute("data-src")); e.removeAttribute("data-src"); });
  }
  function ir(n, dir) {
    if (!diapos.length) return;
    n = (n + diapos.length) % diapos.length;
    if (n === actual) return;
    carga(n); carga(n + 1); carga(n - 1);
    diapos[actual].classList.remove("activa"); diapos[actual].setAttribute("aria-hidden", "true");
    diapos[n].classList.add("activa"); diapos[n].removeAttribute("aria-hidden");
    actual = n;
    var tono = diapos[n].getAttribute("data-tono");
    portada.setAttribute("data-tono", tono); cab.setAttribute("data-tono", tono);
    cab.setAttribute("data-menu", diapos[n].getAttribute("data-menu") || "blanco"); // menú en negro sobre las fotos claras (9/11)
    num.textContent = (n + 1) + "/" + diapos.length;
    leyTxt.textContent = diapos[n].getAttribute("data-pie");
    if (!quieto) { ley.classList.remove("cambia"); void ley.offsetWidth; ley.classList.add("cambia"); }
    giro += 72 * (dir || 1);
    if (flP) flP.style.transform = "rotate(" + giro + "deg)";
  }
  function siguiente() { ir(actual + 1, 1); }
  function anterior() { ir(actual - 1, -1); }
  function reprograma() { clearTimeout(reloj); if (!quieto) reloj = setTimeout(function paso() { if (!pausa && !document.hidden) siguiente(); reloj = setTimeout(paso, 6500); }, 6500); }
  if (portada && diapos.length) {
    portada.setAttribute("data-tono", "oscuro");
    $("[data-sig]").addEventListener("click", function () { siguiente(); reprograma(); });
    $("[data-ant]").addEventListener("click", function () { anterior(); reprograma(); });
    portada.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { siguiente(); reprograma(); }
      if (e.key === "ArrowLeft") { anterior(); reprograma(); }
    });
    var x0 = null;
    portada.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    portada.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) { if (dx < 0) siguiente(); else anterior(); reprograma(); }
    }, { passive: true });
    portada.addEventListener("focusin", function () { pausa = true; });
    portada.addEventListener("focusout", function () { pausa = false; });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { pausa = !e[0].isIntersecting; }).observe(portada);
    setTimeout(reprograma, 1800);
    var antesDe = function () { carga(1); carga(diapos.length - 1); };
    if (document.readyState === "complete") setTimeout(antesDe, 1200); else window.addEventListener("load", function () { setTimeout(antesDe, 1200); });

    // cursor «[ANTERIOR]» / «[SIGUIENTE]» que sigue al ratón (solo con ratón)
    var cur = $("[data-cursor]");
    if (fino && cur) {
      var cx = 0, cy = 0, pend = false;
      var pinta = function () { pend = false; cur.style.transform = "translate3d(" + (cx + 16) + "px," + (cy - 12) + "px,0)"; };
      portada.addEventListener("mousemove", function (e) {
        var sobre = e.target.classList && e.target.classList.contains("zona");
        cur.classList.toggle("on", !!sobre);
        if (!sobre) return;
        var izq = e.clientX < window.innerWidth / 2;
        var t = "[" + (izq ? T.cur_ant : T.cur_sig) + "]";
        if (cur.textContent !== t) cur.textContent = t;
        cur.classList.toggle("izq", izq);
        cx = e.clientX; cy = e.clientY;
        if (!pend) { pend = true; requestAnimationFrame(pinta); }
      });
      portada.addEventListener("mouseleave", function () { cur.classList.remove("on"); pausa = false; });
      portada.addEventListener("mouseenter", function () { pausa = true; });
    }
  }

  /* ---------- menú del móvil ---------- */
  var menu = $("[data-menu]"), menuBtn = $("[data-menu-btn]");
  function menuAbierto(si) {
    menu.hidden = !si; menuBtn.setAttribute("aria-expanded", si ? "true" : "false");
    document.body.style.overflow = si ? "hidden" : ""; document.documentElement.classList.toggle("menu-abierto", si);
  }
  function cierraMenu() { if (!menu || menu.hidden) return; menuAbierto(false); menuBtn.focus(); }
  if (menu && menuBtn) {
    menuBtn.addEventListener("click", function () { menuAbierto(true); $("[data-menu-cerrar]").focus(); });
    $("[data-menu-cerrar]").addEventListener("click", cierraMenu);
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { menuAbierto(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") cierraMenu(); });
  }

  /* ---------- 2. el encargo ---------- */
  var form = $("[data-pedido]");
  var COLORES = {
    rosa: ["#E7A1B0", "#EFB3C0", "#E28FA2", "#F0BAC6", "#E99AAE", "#B85C74"],
    rojo: ["#C8102E", "#B20F2A", "#D42A3D", "#BE1631", "#CC1F36", "#6E0A1A"],
    blanco: ["#F3EFE6", "#F7F4EC", "#EFEADF", "#F5F1E8", "#F1EDE3", "#C9B98F"],
    amarillo: ["#F2C230", "#F5CD4A", "#EDB91E", "#F7D35C", "#F0C63A", "#A8781A"],
    temporada: ["#E7A1B0", "#C8102E", "#F2C230", "#9B7BB8", "#F08A4B", "#3B2A20"],
  };
  function tine(svg, c) {
    if (!svg) return;
    var p = COLORES[c] || null;
    $$(".pt", svg).forEach(function (el, i) { el.style.fill = p ? p[i] : ""; el.style.stroke = c === "blanco" ? "#222" : ""; el.style.strokeWidth = c === "blanco" ? "1.2" : ""; });
    var ct = $(".ct", svg); if (ct) { ct.style.fill = p ? p[5] : ""; }
  }
  var tocado = false, mostrado = 40, animNum = null;
  function giraNumero(hasta) {
    var els = $$("[data-precio]"), barra = $("[data-precio-barra]");
    var desde = mostrado; mostrado = hasta;
    if (animNum) cancelAnimationFrame(animNum);
    if (quieto || desde === hasta) { els.forEach(function (e) { e.textContent = hasta; }); if (barra) barra.textContent = hasta + " €"; return; }
    var t0 = performance.now();
    (function paso(t) {
      var k = Math.min(1, (t - t0) / 520), v = Math.round(desde + (hasta - desde) * (1 - Math.pow(1 - k, 3)));
      els.forEach(function (e) { e.textContent = v; }); if (barra) barra.textContent = v + " €";
      if (k < 1) animNum = requestAnimationFrame(paso);
    })(t0);
  }
  function salta(input) {
    if (quieto || !input) return;
    var s = input.nextElementSibling; if (!s) return;
    s.classList.remove("salta"); void s.offsetWidth; s.classList.add("salta");
  }
  var marcado = function (name) { return form ? form.querySelector('input[name="' + name + '"]:checked') : null; };

  // días: hoy (antes de las 12:00 y si abre), mañana (o «el lunes» si mañana es domingo), otro día
  var A = ahora();
  var hoyInput = form && form.querySelector('input[name="dia"][value="hoy"]');
  var mananaInput = form && form.querySelector('input[name="dia"][value="manana"]');
  var avisoDia = $("[data-aviso-dia]"), fechaCampo = $("[data-fecha-campo]"), fecha = $("[data-fecha]");
  var fManana = A.f + DIA, mananaEsLunes = false;
  if (new Date(fManana).getUTCDay() === 0) { fManana += DIA; mananaEsLunes = true; $("[data-dia-manana]").textContent = T.d_lunes; }
  var hoyNo = !H[A.dia].length ? T.d_hoy_cerrado : (A.min >= LIMITE_HOY ? T.d_hoy_tarde : "");
  if (hoyInput && hoyNo) { hoyInput.disabled = true; hoyInput.parentNode.title = hoyNo; }
  if (fecha) fecha.min = ymd(A.f + DIA);

  function diaElegido() {
    var d = marcado("dia"); if (!d) return null;
    if (d.value === "hoy") return { t: A.f, txt: T.d_hoy };
    if (d.value === "manana") return { t: fManana, txt: mananaEsLunes ? T.d_lunes : T.d_manana };
    if (!fecha.value) return null;
    var t = deYmd(fecha.value);
    if (t <= A.f || new Date(t).getUTCDay() === 0) return null;
    return { t: t, txt: null };
  }
  function avisaDia() {
    var d = marcado("dia"), msg = "";
    if (d && d.value === "otro" && fecha.value) {
      var t = deYmd(fecha.value);
      if (t <= A.f) msg = T.d_pasado; else if (new Date(t).getUTCDay() === 0) msg = T.d_domingo;
    } else if (hoyNo && (!d || d.value === "hoy" || d.value === "manana")) msg = hoyNo;
    if (avisoDia && avisoDia.textContent !== msg) avisoDia.textContent = msg;
  }

  var tarjeta = $("[data-tarjeta]"), tTxt = $("[data-tarjeta-txt]"), resumen = $("[data-resumen]"), wa = $("[data-wa]");
  var flT = $("[data-flor-tarjeta]"), flE = $("[data-flor-encargo] svg");
  var listaPueblos = $$("[data-pueblo]"), elegido = $("[data-ent-elegido]"), pueblosOp = $("[data-pueblos-op]");
  var mayus = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
  function actualiza() {
    if (!form) return;
    var para = marcado("para"), tam = marcado("tam"), col = marcado("color"), ent = marcado("entrega"), pue = marcado("pueblo");
    var llevar = ent && ent.value === "llevar";
    if (pueblosOp) pueblosOp.hidden = !llevar;
    var euros = (tam ? +tam.dataset.euros : 0) + (llevar && pue ? +pue.dataset.euros : 0);
    giraNumero(euros);
    // la tarjeta
    var escrito = tarjeta.value.trim();
    var sug = para ? para.dataset.sug : T.sug_nada;
    tTxt.textContent = escrito || sug;
    tTxt.classList.toggle("vacio", !escrito);
    tine(flT, col ? col.value : null);
    if (tocado) tine(flE, col ? col.value : null);
    // el día
    var d = diaElegido();
    var diaTxt = d ? (d.txt ? d.txt + ", " + fmtFecha(d.t) : mayus(fmtFecha(d.t))) : "";
    var fl = fechaCampo && $(".fecha-lbl", fechaCampo);
    if (fechaCampo) {
      fechaCampo.hidden = !(marcado("dia") && marcado("dia").value === "otro");
      var lleno = !!fecha.value;
      fechaCampo.classList.toggle("lleno", lleno);
      fl.textContent = lleno ? fmtFecha(deYmd(fecha.value)) : fl.getAttribute("data-vacio");
    }
    avisaDia();
    // lo que se lleva
    var entTxt = llevar && pue ? T.ent_el[pue.value].replace(/\.$/, "") + (+pue.dataset.euros ? " (" + pue.dataset.euros + " €)" : "") : T.e_recoger;
    listaPueblos.forEach(function (b) { b.setAttribute("aria-pressed", llevar && pue && b.dataset.pueblo === pue.value ? "true" : "false"); });
    if (elegido) elegido.textContent = llevar && pue ? T.ent_el[pue.value] : elegido.getAttribute("data-vacio");
    resumen.textContent = [tam ? tam.dataset.nombre : "", col ? col.dataset.nombre : "", diaTxt, entTxt].filter(Boolean).join(" · ");
    // el mensaje de WhatsApp (se escribe, no se envía)
    var l = [T.wa_hola];
    if (para) l.push(T.wa_para + ": " + para.dataset.nombre);
    if (tam) l.push(T.wa_tam + ": " + tam.dataset.nombre + " (" + tam.dataset.euros + " €)");
    if (col) l.push(T.wa_color + ": " + col.dataset.nombre);
    if (diaTxt) l.push(T.wa_dia + ": " + diaTxt);
    l.push(llevar && pue ? T.wa_llevar + ": " + pue.value + (+pue.dataset.euros ? " (" + pue.dataset.euros + " €)" : "") : T.wa_recoger);
    if (escrito) l.push(T.wa_tarjeta + ": «" + escrito + "»");
    l.push(T.wa_precio + ": " + euros + " €");
    wa.href = WA + "?text=" + encodeURIComponent(l.join("\n"));
    barraVisible();
  }
  if (form) {
    var fl0 = fechaCampo && $(".fecha-lbl", fechaCampo); if (fl0) fl0.setAttribute("data-vacio", fl0.textContent);
    form.addEventListener("change", function (e) {
      var t = e.target; tocado = true;
      if (t.name === "para" && t.dataset.color) {
        var c = form.querySelector('input[name="color"][value="' + t.dataset.color + '"]');
        if (c && !c.checked) { c.checked = true; salta(c); }
      }
      if (t.name === "entrega" && t.value === "llevar" && !marcado("pueblo")) form.querySelector('input[name="pueblo"]').checked = true;
      if (t.type === "radio") salta(t);
      if (t.name === "dia" && t.value === "otro" && fecha && !fecha.value) { try { fecha.focus(); } catch (x) {} }
      actualiza();
    });
    tarjeta.addEventListener("input", function () { tocado = true; actualiza(); });
    if (fecha) {
      fecha.addEventListener("input", actualiza);
      fecha.addEventListener("click", function () { try { fecha.showPicker(); } catch (x) {} });
    }
    actualiza();
  }

  /* ---------- 3. pueblos de reparto ---------- */
  listaPueblos.forEach(function (b) {
    b.addEventListener("click", function () {
      if (!form) return;
      tocado = true;
      var yaEsta = b.getAttribute("aria-pressed") === "true";
      var ent = form.querySelector('input[name="entrega"][value="' + (yaEsta ? "recoger" : "llevar") + '"]');
      ent.checked = true;
      if (!yaEsta) { var p = form.querySelector('input[name="pueblo"][value="' + b.dataset.pueblo + '"]'); if (p) p.checked = true; }
      if (!quieto) { b.classList.remove("salta"); void b.offsetWidth; b.classList.add("salta"); }
      actualiza();
    });
  });

  /* ---------- 4. cita para bodas y eventos ---------- */
  var cita = $("[data-cita]"), fEv = $("[data-fecha-ev]"), faltan = $("[data-faltan]"), waCita = $("[data-wa-cita]");
  function actualizaCita() {
    if (!cita) return;
    var ev = cita.querySelector('input[name="evento"]:checked');
    var campo = fEv.parentNode, lbl = $(".fecha-lbl", campo);
    if (!lbl.getAttribute("data-vacio")) lbl.setAttribute("data-vacio", lbl.textContent);
    var l = [T.wa_cita];
    if (ev) l.push(T.wa_evento + ": " + ev.dataset.nombre);
    var msg = "";
    if (fEv.value) {
      var t = deYmd(fEv.value), n = Math.round((t - A.f) / DIA);
      lbl.textContent = fmtFecha(t); campo.classList.add("lleno");
      msg = n < 0 ? T.d_pasado : n === 0 ? T.bod_hoy : n === 1 ? T.bod_falta1 : T.bod_faltan.replace("215", n);
      if (n >= 0) l.push(T.wa_fecha + ": " + fmtFecha(t));
    } else { lbl.textContent = lbl.getAttribute("data-vacio"); campo.classList.remove("lleno"); }
    faltan.textContent = msg;
    waCita.href = WA + "?text=" + encodeURIComponent(l.join("\n"));
  }
  if (cita) {
    fEv.min = ymd(A.f);
    cita.addEventListener("change", function (e) { if (e.target.type === "radio") salta(e.target); actualizaCita(); });
    fEv.addEventListener("input", actualizaCita);
    fEv.addEventListener("click", function () { try { fEv.showPicker(); } catch (x) {} });
    actualizaCita();
  }

  /* ---------- 6. barra de abajo («CART / STORE» de la referencia) ---------- */
  var barra = $("[data-barra]"), encVisible = true, portVisible = true;
  function barraVisible() { if (barra) barra.classList.toggle("on", tocado && !encVisible && !portVisible); }
  if (barra && "IntersectionObserver" in window) {
    var enc = $("#encargo");
    new IntersectionObserver(function (e) { e.forEach(function (x) { if (x.target === enc) encVisible = x.isIntersecting; else portVisible = x.isIntersecting; }); barraVisible(); }).observe(enc);
    if (portada) new IntersectionObserver(function (e) { portVisible = e[0].isIntersecting; barraVisible(); }).observe(portada);
  }

  /* ---------- 7. paneles que entran al asomar ---------- */
  if (!window.gsap || !window.ScrollTrigger || quieto) return;
  gsap.registerPlugin(ScrollTrigger);
  var E = "power3.out", una = function (el, extra) { return Object.assign({ trigger: el, start: "top 86%", once: true }, extra || {}); };
  $$(".marco-foto img").forEach(function (img) { gsap.from(img, { scale: 1.14, duration: 1.4, ease: E, clearProps: "transform", scrollTrigger: una(img.closest(".marcos")) }); });
  $$(".pedido > .paso, .pedido > .campo").forEach(function (el, i) { if (i) gsap.from(el, { y: 30, opacity: 0, duration: 1.1, ease: E, clearProps: "transform,opacity", scrollTrigger: una(el, { start: "top 92%" }) }); });
  var tj = $(".tarjeta"); if (tj) gsap.from(tj, { y: 50, rotation: -10, opacity: 0, duration: 1.3, ease: E, scrollTrigger: una(tj) });
  var cu = $(".cuenta"); if (cu) gsap.from(cu, { x: 40, opacity: 0, duration: 1.2, ease: E, clearProps: "transform,opacity", scrollTrigger: una(cu) });
  var fa = $(".foto-ancha");
  if (fa) {
    gsap.fromTo(fa, { clipPath: "inset(10% 7% 10% 7%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: E, scrollTrigger: una(fa, { start: "top 80%" }) });
    gsap.from($("img", fa), { scale: 1.14, duration: 1.6, ease: E, scrollTrigger: una(fa, { start: "top 80%" }) });
  }
  $$(".cita > *").forEach(function (el) { gsap.from(el, { y: 26, opacity: 0, duration: 1, ease: E, clearProps: "transform,opacity", scrollTrigger: una(el, { start: "top 94%" }) }); });
  var ct = $(".con-txt"); if (ct) gsap.from(ct, { x: -46, opacity: 0, duration: 1.2, ease: E, clearProps: "transform,opacity", scrollTrigger: una(ct) });
  var cf = $(".con-flor"); if (cf) gsap.from(cf, { scale: .6, rotation: -70, opacity: 0, duration: 1.4, ease: E, scrollTrigger: una(cf) });
  $$("[data-flor-gira] svg, [data-flor-encargo] svg").forEach(function (svg) {
    gsap.fromTo(svg, { rotation: -40 }, { rotation: 100, ease: "none", scrollTrigger: { trigger: svg.parentNode.closest("section"), start: "top bottom", end: "bottom top", scrub: 0.8 } });
  });
})();
