/* AIHEN · muestra de txakolindegi (OI Studio, 8/11/2026).
   Menú del móvil, visita con cata (día, personas, con o sin comida → precio y mensaje de WhatsApp), lista de txakolis que se
   abre (nota de cata y con qué comerlo) y caja que se dibuja al sumar botellas (recoger o enviar → total y mensaje; pide 18 años).
   Movimiento con GSAP + ScrollTrigger: el bodegón se desmonta al bajar (solo en el ordenador), la frase se enciende, la foto crece,
   paneles que entran al asomar. Con «reducir movimiento» o sin GSAP, todo quieto y visible. No se envía nada a ningún sitio. */
(function () {
  var T = JSON.parse(document.getElementById("textos").textContent);
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mayus = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
  var wa = function (lineas) { return T.wa + "?text=" + encodeURIComponent(lineas.join("\n")); };

  /* ---------- menú del móvil ---------- */
  var panel = $("[data-panel-menu]"), abrir = $("[data-menu-abrir]");
  function cerrarMenu() { panel.hidden = true; abrir.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; abrir.focus(); }
  abrir.addEventListener("click", function () {
    panel.hidden = false; abrir.setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden";
    $(".panel-lista a", panel).focus();
  });
  $("[data-menu-cerrar]").addEventListener("click", cerrarMenu);
  $$(".panel-lista a, .panel-tel a", panel).forEach(function (a) { a.addEventListener("click", function () { panel.hidden = true; abrir.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) cerrarMenu(); });

  /* ---------- «escribiendo…» y luego el mensaje ---------- */
  function escribir(caja, p, texto) {
    clearTimeout(caja._t);
    if (quieto || !p.textContent) { p.textContent = texto; return; }
    caja.classList.add("escribe");
    caja._t = setTimeout(function () { p.textContent = texto; caja.classList.remove("escribe"); }, 420);
  }
  function gira(el, v) { if (String(el.textContent) === String(v)) return; el.textContent = v; el.classList.remove("gira"); void el.offsetWidth; el.classList.add("gira"); }

  /* ---------- visita: viernes (17:00) y sábados (11:00) de las próximas cuatro semanas, desde hoy (hora de Madrid) ---------- */
  var hoy = (function () {
    var f = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()).split("-");
    return new Date(Date.UTC(+f[0], +f[1] - 1, +f[2]));
  })();
  function etiqueta(f, hora) {
    var d = f.getUTCDate(), m = f.getUTCMonth(), dia = T.dias[(f.getUTCDay() + 6) % 7];
    if (T.lang === "eu") return mayus(T.mesesGen[m] + " " + T.sufijos[d - 1] + ", " + dia + ", " + hora + "etan");
    return mayus(dia) + " " + d + " de " + T.meses[m] + ", " + hora;
  }
  var dias = [];
  for (var k = 1; k <= 28; k++) {
    var f = new Date(hoy.getTime() + k * 864e5), w = f.getUTCDay();
    if (w === 5) dias.push(etiqueta(f, "17:00")); else if (w === 6) dias.push(etiqueta(f, "11:00"));
  }
  var V = { dia: 0, pers: 2, modo: "sin" };
  var form = $("[data-visita]"), ulDias = $("[data-dias]");
  ulDias.innerHTML = dias.map(function (t, i) {
    return '<li><label class="opcion"><input type="radio" name="dia" value="' + i + '"' + (i === 0 ? " checked" : "") + '><i class="punto" aria-hidden="true"></i><span class="op-t">' + t + "</span></label></li>";
  }).join("");
  $$("[data-paso]", form).forEach(function (p) { p.hidden = false; });
  var vMsg = $("[data-v-msg]"), vCaja = vMsg.parentNode, vWa = $("[data-v-wa]"), vAviso = $("[data-v-aviso]");
  function visita(salto) {
    var precio = T.precio[V.modo] * V.pers;
    gira($("[data-pers]"), V.pers);
    $("[data-menos-p]").disabled = V.pers <= 1; $("[data-mas-p]").disabled = V.pers >= 12;
    $("[data-v-total]").textContent = T.total.replace("{t}", precio);
    var modo = V.modo === "con" ? T.con_comida : T.sin_comida;
    var lineas = [T.wa_visita_hola, T.wa_dia + ": " + (dias[V.dia] || T.sin_dia), T.wa_personas + ": " + V.pers, T.wa_visita + ": " + modo, T.total.replace("{t}", precio), T.wa_pregunta_visita];
    escribir(vCaja, vMsg, lineas.join("\n"));
    vWa.href = wa(lineas);
    if (salto) { salto.classList.remove("salta"); void salto.offsetWidth; salto.classList.add("salta"); }
  }
  form.addEventListener("change", function (e) {
    var t = e.target;
    if (t.name === "dia") V.dia = +t.value;
    if (t.name === "modo") V.modo = t.value;
    vAviso.textContent = "";
    visita(t.closest(".opcion"));
  });
  $("[data-menos-p]").addEventListener("click", function () { if (V.pers > 1) V.pers--; vAviso.textContent = ""; visita(); });
  $("[data-mas-p]").addEventListener("click", function () { if (V.pers < 12) V.pers++; vAviso.textContent = V.pers >= 12 ? T.aviso_muchos : ""; visita(); });
  visita();

  /* ---------- lista de txakolis: se abre como la de la referencia; el primero, abierto ---------- */
  var COLOR = ["#1d3360", "#b48a3c", "#c4868a"];
  var filas = $$("[data-vino]");
  filas.forEach(function (li, i) {
    var b = $("[data-abrir]", li), mas = $("[data-detalle]", li);
    if (i > 0) { b.setAttribute("aria-expanded", "false"); mas.hidden = true; }
    b.addEventListener("click", function () {
      var abre = b.getAttribute("aria-expanded") !== "true";
      b.setAttribute("aria-expanded", String(abre)); mas.hidden = !abre;
      if (abre && !quieto) { mas.classList.remove("abre"); void mas.offsetWidth; mas.classList.add("abre"); }
    });
    $("[data-paso]", li).hidden = false;
  });

  /* ---------- la caja ---------- */
  var N = [0, 0, 0], MAX = 24, antes = 0;
  var caja = $("[data-caja]"), dib = $("[data-caja-dib]"), lineasUl = $("[data-caja-lineas]"), vacia = $("[data-caja-vacia]");
  var cMsg = $("[data-c-msg]"), cCaja = cMsg.parentNode, cWa = $("[data-c-wa]"), cAviso = $("[data-c-aviso]"), mayor = $("[data-mayor]");
  var aCaja = $("[data-a-caja]"), cuenta = $("[data-cuenta]");
  caja.hidden = false; aCaja.hidden = false;
  function entrega() { return $("[data-entrega]:checked").value; }
  function pintaCaja() {
    var total = N[0] + N[1] + N[2], euros = 0, huecos = [], lineas = [], msg = [T.wa_caja_hola];
    N.forEach(function (n, i) {
      for (var j = 0; j < n; j++) huecos.push(COLOR[i]);
      if (n) {
        var e = n * T.precio.v[i]; euros += e;
        lineas.push('<li><i style="--c:' + COLOR[i] + '"></i><span>' + n + " × " + T.nombres[i] + "</span><span>" + e + " €</span></li>");
        msg.push(n + " × " + T.nombres[i]);
      }
    });
    var cajas = Math.max(1, Math.ceil(total / 6)), html = "";
    for (var c = 0; c < cajas; c++) {
      html += '<div class="kutxa">';
      for (var s = 0; s < 6; s++) {
        var h = c * 6 + s;
        html += '<span class="hueco">' + (huecos[h] ? '<b style="--c:' + huecos[h] + '"' + (h >= antes && !quieto ? ' class="nuevo"' : "") + "></b>" : "") + "</span>";
      }
      html += "</div>";
    }
    dib.innerHTML = html; antes = total;
    lineasUl.innerHTML = lineas.join(""); vacia.hidden = total > 0;
    if (entrega() === "enviar" && total) euros += T.precio.envio;
    var tot = total ? T.total.replace("{t}", euros) : "";
    $("[data-c-total]").textContent = tot;
    msg.push(T.wa_entrega + ": " + (entrega() === "enviar" ? T.enviar : T.recoger));
    if (tot) msg.push(tot);
    msg.push(T.wa_pregunta_caja);
    escribir(cCaja, cMsg, total ? msg.join("\n") : T.caja_vacia);
    cWa.href = wa(msg);
    cWa.setAttribute("aria-disabled", String(!total || !mayor.checked));
    gira(cuenta, total);
    filas.forEach(function (li, i) {
      gira($("[data-n]", li), N[i]);
      $("[data-menos]", li).disabled = N[i] === 0;
      $("[data-mas]", li).disabled = total >= MAX;
    });
    if (total && mayor.checked) cAviso.textContent = "";
  }
  filas.forEach(function (li, i) {
    $("[data-mas]", li).addEventListener("click", function () { if (N[0] + N[1] + N[2] < MAX) { N[i]++; pintaCaja(); } });
    $("[data-menos]", li).addEventListener("click", function () { if (N[i] > 0) { N[i]--; antes = Math.min(antes, 99); pintaCaja(); } });
  });
  $$("[data-entrega]").forEach(function (r) { r.addEventListener("change", function () { pintaCaja(); var o = r.closest(".opcion"); o.classList.remove("salta"); void o.offsetWidth; o.classList.add("salta"); }); });
  mayor.addEventListener("change", pintaCaja);
  cWa.addEventListener("click", function (e) {
    var total = N[0] + N[1] + N[2];
    if (!total) { e.preventDefault(); cAviso.textContent = T.caja_vacia; return; }
    if (!mayor.checked) { e.preventDefault(); cAviso.textContent = T.falta_edad; mayor.focus(); }
  });
  pintaCaja();

  /* ---------- movimiento (GSAP) ---------- */
  if (quieto || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  var visto = function (el) { return el.getBoundingClientRect().top < innerHeight; };
  var mm = gsap.matchMedia();

  /* el bodegón se desmonta al bajar, como el de la referencia: la botella se endereza y sube, las piezas caen (solo ordenador) */
  mm.add("(min-width: 900px)", function () {
    var tl = gsap.timeline({ scrollTrigger: { trigger: "[data-portada]", start: "top top", end: "bottom top", scrub: 0.9 } });
    tl.to(".portada-h1", { yPercent: -45, opacity: 0, ease: "none" }, 0)
      .to(".p-botila", { x: -40, y: -150, rotation: 24, scale: 1.12, ease: "none" }, 0)
      .to(".p-sombras, .repisa, .bajar", { opacity: 0, ease: "none" }, 0);
    ["p-kortxoa", "p-bola-sarea", "p-harri-luzea", "p-duela", "p-ohola", "p-makila", "p-bola", "p-harria", "p-tapa"].forEach(function (c, i) {
      var lado = i % 2 ? -1 : 1;
      tl.to("." + c, { x: lado * (30 + i * 14), y: 140 + i * 26, rotation: lado * (12 + i * 5), opacity: 0, ease: "none" }, 0.04 * i);
    });
  });

  /* la frase grande: se enciende palabra a palabra y las fotos pequeñas se abren (por tiempo, al asomar) */
  var frase = $("[data-frase]");
  if (!visto(frase)) {
    var st = { trigger: frase, start: "top 78%", once: true };
    gsap.fromTo($$(".w", frase), { opacity: 0.16 }, { opacity: 1, duration: 0.7, ease: "power1.out", stagger: 0.055, scrollTrigger: st });
    gsap.fromTo($$(".mini", frase), { clipPath: "inset(0 50% 0 50%)" }, { clipPath: "inset(0 0% 0 0%)", duration: 1.1, ease: "power3.out", stagger: 0.3, delay: 0.25, scrollTrigger: st });
  }

  /* fotos que se destapan y se asientan */
  [$("[data-banda]")].forEach(function (fig) {
    if (visto(fig)) return;
    var st = { trigger: fig, start: "top 85%", once: true };
    gsap.fromTo(fig, { clipPath: "inset(14% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.3, ease: "power3.out", scrollTrigger: st });
    gsap.fromTo($("img", fig), { scale: 1.14 }, { scale: 1, duration: 1.6, ease: "power3.out", scrollTrigger: st });
  });
  /* la foto del paisaje crece al bajar (como la de la torre y el lago de la referencia) */
  gsap.fromTo("[data-crece]", { scale: 0.36 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".crece", start: "top 95%", end: "center 52%", scrub: 0.8 } });
  /* barricas: paralaje suave */
  gsap.fromTo("[data-oscura] img", { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1.12, ease: "none", scrollTrigger: { trigger: ".oscura", start: "top bottom", end: "bottom top", scrub: 0.6 } });

  /* paneles que entran al asomar: formulario, caja, pie */
  [[".elige > *", ".elige"], [".caja > *", ".caja"], [".pie-centro, .pie-der", ".pie-grid"], [".oscura-txt > p, .oscura-txt > .ovalo", ".oscura-txt"], [".intro-vinos .texto-c, .intro-vinos .ovalo", ".intro-vinos"], [".lista-cab .ovalo", ".lista-cab"]].forEach(function (par) {
    var trg = $(par[1]); if (!trg || visto(trg)) return;
    gsap.from($$(par[0]), { y: 34, opacity: 0, duration: 1.1, ease: "power3.out", stagger: 0.12, clearProps: "transform,opacity", scrollTrigger: { trigger: trg, start: "top 86%", once: true } });
  });
})();
