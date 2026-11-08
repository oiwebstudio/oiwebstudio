/* BEHAKO · muestra de óptica (OI Studio, 8/11/2026).
   Menú con desplegables, menú del móvil, revisión según la fecha real, cita que deja el WhatsApp escrito («escribiendo…»),
   monturas que se apartan para probarlas (pasan a la cita), horario con el estado según la hora real de Tolosa,
   la fila de monturas que corre de lado con el scroll y paneles que entran al asomar.
   Sin JS o con «reducir movimiento»: todo se ve quieto y completo. Es una muestra: no se envía nada a ningún sitio. */
(function () {
  var T = JSON.parse(document.getElementById("textos").textContent);
  var R = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EU = T.lang === "eu";
  var EASE = "cubic-bezier(.2,.75,.25,1)";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- hora de Tolosa ---------- */
  // minutos desde las 0:00 de cada tramo; domingo = 0
  var H = { 0: [], 1: [[570, 810], [990, 1200]], 2: [[570, 810], [990, 1200]], 3: [[570, 810], [990, 1200]], 4: [[570, 810], [990, 1200]], 5: [[570, 810], [990, 1200]], 6: [[600, 810]] };
  function ahora() {
    try {
      var o = {};
      new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
        .formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
      return { dia: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday], min: +o.hour * 60 + +o.minute, fecha: new Date(+o.year, +o.month - 1, +o.day) };
    } catch (e) { var n = new Date(); return { dia: n.getDay(), min: n.getHours() * 60 + n.getMinutes(), fecha: new Date(n.getFullYear(), n.getMonth(), n.getDate()) }; }
  }
  var A = ahora();
  function salta(el) { if (!R && el && el.animate) el.animate([{ transform: "translateY(0)" }, { transform: "translateY(-5px)" }, { transform: "none" }], { duration: 320, easing: EASE }); }
  function entra(el) { if (!R && el && el.animate) el.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 420, easing: EASE }); }

  /* ---------- horario: abierto o cerrado ahora ---------- */
  function estado() {
    var a = ahora(), f = H[a.dia], txt = "", abierto = false, i;
    for (i = 0; i < f.length; i++) if (a.min >= f[i][0] && a.min < f[i][1]) { txt = f[i][1] === 810 ? T.est.a1330 : T.est.a2000; abierto = true; }
    if (!abierto) {
      var luego = f.filter(function (x) { return x[0] > a.min; })[0];
      if (luego) txt = luego[0] === 570 ? T.est.h0930 : luego[0] === 600 ? T.est.h1000 : T.est.h1630;
      else if (a.dia === 5) txt = T.est.m1000;           // viernes por la noche → sábado a las 10
      else if (a.dia === 6) txt = T.est.l0930;           // sábado por la tarde → lunes
      else txt = T.est.m0930;                             // de domingo a jueves → mañana a las 9:30
    }
    var e = $("[data-estado]");
    if (e && e.textContent !== txt) { e.textContent = txt; e.classList.toggle("abierto", abierto); }
  }
  estado(); setInterval(estado, 30000);

  /* ---------- desplegables del menú ---------- */
  var desps = $$(".desp");
  function cierraDesp(excepto) { desps.forEach(function (d) { if (d !== excepto) { d.classList.remove("abierto"); d.querySelector("button").setAttribute("aria-expanded", "false"); } }); }
  desps.forEach(function (d) {
    var b = d.querySelector("button");
    b.addEventListener("click", function () {
      var on = !d.classList.contains("abierto");
      cierraDesp(d); d.classList.toggle("abierto", on); b.setAttribute("aria-expanded", on ? "true" : "false");
    });
    d.addEventListener("mouseleave", function () { if (matchMedia("(hover:hover)").matches) cierraDesp(); });
  });
  document.addEventListener("click", function (e) { if (!e.target.closest(".desp")) cierraDesp(); else if (e.target.closest(".sub a")) cierraDesp(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { var ab = $(".desp.abierto"); cierraDesp(); if (ab) ab.querySelector("button").focus(); cierraMenu(true); } });

  /* ---------- menú del móvil ---------- */
  var hamb = $(".hamb"), menu = $("#menu-movil");
  function cierraMenu(foco) {
    if (!menu || menu.hidden) return;
    menu.hidden = true; hamb.setAttribute("aria-expanded", "false"); document.body.classList.remove("menu-abierto");
    if (foco) hamb.focus();
  }
  if (hamb && menu) {
    hamb.addEventListener("click", function () {
      if (!menu.hidden) { cierraMenu(); return; }
      menu.hidden = false; hamb.setAttribute("aria-expanded", "true"); document.body.classList.add("menu-abierto");
      if (!R && menu.animate) menu.animate([{ opacity: 0, transform: "translateY(-12px)" }, { opacity: 1, transform: "none" }], { duration: 380, easing: EASE });
      var p = menu.querySelector("a"); if (p) p.focus();
    });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) cierraMenu(); });
  }

  /* ---------- enlaces a los puntos del acordeón: se abren y se marcan ---------- */
  function abreDetalle(id) {
    var d = document.getElementById(id);
    if (!d || d.tagName !== "DETAILS") return;
    d.open = true; d.classList.add("marcado");
    setTimeout(function () { d.classList.remove("marcado"); }, 2400);
  }
  $$('a[href^="#"]').forEach(function (a) { a.addEventListener("click", function () { abreDetalle(a.getAttribute("href").slice(1)); }); });
  if (location.hash) abreDetalle(location.hash.slice(1));

  /* ---------- revisión: eliges el año de la última y te dice si toca ---------- */
  var rev = $("[data-rev]");
  if (rev) {
    var Y = A.fecha.getFullYear();
    var inicioAnio = new Date(Y, 0, 1), finAnio = new Date(Y + 1, 0, 1);
    var hoyF = Y + (A.fecha - inicioAnio) / (finAnio - inicioAnio); // el año con decimales: 2026,85…
    var anios = $("[data-anios]", rev), linea = $("[data-linea]", rev), res = $("[data-rev-r]", rev);
    var ops = [Y, Y - 1, Y - 2, Y - 3, "antes", "nose"];
    ops.forEach(function (v, i) {
      var l = document.createElement("label"); l.className = "op-anio";
      var txt = v === "antes" ? T.rev.antes : v === "nose" ? T.rev.nose_b : String(v);
      l.innerHTML = '<input type="radio" name="anio" value="' + v + '"' + (i === 1 ? " checked" : "") + "><span>" + txt + "</span>";
      anios.appendChild(l);
    });
    // la línea: de cuatro años atrás al que viene, con «última», «próxima revisión» y «hoy»
    var x0 = Y - 4, x1 = Y + 2;
    var pos = function (y) { return ((y - x0) / (x1 - x0) * 100).toFixed(2) + "%"; };
    linea.innerHTML = '<span class="eje"></span><span class="tramo"></span>';
    for (var y = x0; y <= Y + 1; y++) { var t = document.createElement("span"); t.className = "tic"; t.style.left = pos(y + 0.5); t.textContent = y === x0 ? T.rev.antes : y; linea.appendChild(t); }
    // los puntos van solos sobre la línea y lo que es cada uno, en la leyenda de debajo (así no se pisan los nombres)
    var pUlt = document.createElement("span"); pUlt.className = "pto ult";
    var pProx = document.createElement("span"); pProx.className = "pto prox";
    var pHoy = document.createElement("span"); pHoy.className = "pto hoy";
    linea.appendChild(pUlt); linea.appendChild(pProx); linea.appendChild(pHoy);
    var ley = document.createElement("p"); ley.className = "leyenda"; ley.setAttribute("aria-hidden", "true");
    ley.innerHTML = '<span class="l-ult"><i></i>' + T.rev.ultima + '</span><span class="l-prox"><i></i>' + T.rev.proxima + '</span><span class="l-hoy"><i></i>' + T.hoy + "</span>";
    linea.parentNode.insertBefore(ley, linea.nextSibling);
    var tramo = $(".tramo", linea);
    pHoy.style.left = pos(hoyF);
    var revisa = function (primera) {
      var v = ($('input[name="anio"]:checked', rev) || {}).value, txt, ult, prox;
      if (v === "nose") { txt = T.rev.nose; ult = null; }
      else {
        ult = v === "antes" ? x0 + 0.5 : +v + 0.5;           // a mitad de ese año
        prox = ult + 1;
        if (+v === Y) txt = T.rev.ok.replace("{y}", Y + 1);
        else if (+v === Y - 1) txt = T.rev.toca;
        else txt = T.rev.tarde;
      }
      pUlt.style.opacity = ult === null ? "0" : "1"; pProx.style.opacity = ult === null ? "0" : "1";
      ley.classList.toggle("sin-ult", ult === null);
      if (ult !== null) {
        pUlt.style.left = pos(ult); pProx.style.left = pos(prox);
        // tramo: de la última a la próxima; si ya pasó, sigue hasta hoy (a rayas)
        var fin = Math.max(prox, hoyF);
        tramo.style.left = pos(ult); tramo.style.width = ((fin - ult) / (x1 - x0) * 100).toFixed(2) + "%";
        tramo.classList.toggle("tarde", hoyF > prox);
        tramo.style.opacity = "1";
      } else tramo.style.opacity = "0";
      if (res.textContent !== txt) { res.textContent = txt; if (!primera) entra(res); }
    };
    anios.addEventListener("change", function (e) { salta(e.target.parentElement); revisa(); });
    revisa(true);
    // la herramienta ya está montada: sale ella y se va el texto de reserva («Elige el año de tu última revisión»)
    rev.hidden = false;
    var reserva = $("[data-rev-reserva]");
    if (reserva) reserva.hidden = true;
  }

  /* ---------- cita: el mensaje sale escrito ---------- */
  var form = $("[data-cita]");
  var ponMotivo = function () {};
  var ponMontura = function () {};
  if (form) {
    var lista = $("[data-dias]", form), otro = $("[data-otro]", form), fecha = $("[data-fecha]", form);
    var aviso = $("[data-aviso]", form), msgEl = $("[data-mensaje]", form), caja = $(".mensaje", form), was = $$("[data-wa]");
    var eleg = $("[data-elegida]", form), elegN = $("[data-elegida-n]", form), quitar = $("[data-quitar]", form);
    var meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    var montura = null, temporizador = 0;
    var iso = function (d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); };
    var deIso = function (s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); };
    var texto = function (d) {
      if (EU) return T.dias[d.getDay()] + ", " + d.getFullYear() + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + ("0" + d.getDate()).slice(-2);
      return T.dias[d.getDay()] + " " + d.getDate() + " de " + meses[d.getMonth()];
    };
    // los próximos siete días que abrimos (hoy, si queda más de una hora)
    var d = new Date(A.fecha), dias = [];
    for (var k = 0; dias.length < 7 && k < 21; k++) {
      var f = H[d.getDay()];
      if (f.length && (k > 0 || A.min < f[f.length - 1][1] - 60)) dias.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    lista.innerHTML = "";
    dias.forEach(function (x, i) {
      var l = document.createElement("label"); l.className = "dia";
      l.innerHTML = '<input type="radio" name="dia" value="' + iso(x) + '"' + (i === 0 ? " checked" : "") + "><span><small>" + T.cortos[x.getDay()] + "</small><b>" + x.getDate() + "</b></span>";
      lista.appendChild(l);
    });
    var lo = document.createElement("label"); lo.className = "dia otro-dia";
    lo.innerHTML = '<input type="radio" name="dia" value="otro"><span><b style="font-size:.9rem">' + T.otro_dia + "</b></span>";
    lista.appendChild(lo);
    otro.hidden = true;
    fecha.min = iso(A.fecha);
    var max = new Date(A.fecha); max.setDate(max.getDate() + 180); fecha.max = iso(max);

    var diaElegido = function () {
      var r = $('input[name="dia"]:checked', form);
      if (!r) return null;
      if (r.value === "otro") return fecha.value ? deIso(fecha.value) : null;
      return deIso(r.value);
    };
    var escribe = function (inmediato) {
      var dia = diaElegido(), mot = $('input[name="motivo"]:checked', form), fr = $('input[name="franja"]:checked', form);
      var tarde = $('input[name="franja"][value="tarde"]', form), man = $('input[name="franja"][value="manana"]', form);
      var avisoTxt = "", cerrado = dia && !H[dia.getDay()].length;
      var esHoy = dia && iso(dia) === iso(A.fecha);
      var f = dia ? H[dia.getDay()] : [];
      var hayMan = f.some(function (x) { return x[0] < 840 && (!esHoy || A.min < x[1] - 60); });
      var hayTarde = f.some(function (x) { return x[0] >= 840 && (!esHoy || A.min < x[1] - 60); });
      man.disabled = !!dia && !cerrado && !hayMan; tarde.disabled = !!dia && !cerrado && !hayTarde;
      if (cerrado) { avisoTxt = T.domingo; man.disabled = tarde.disabled = false; }
      else if (dia && dia.getDay() === 6) avisoTxt = T.sabado;
      if (fr && fr.disabled) { var otraF = fr === tarde ? man : tarde; if (!otraF.disabled) { otraF.checked = true; fr = otraF; } }
      if (aviso.textContent !== avisoTxt) { aviso.textContent = avisoTxt; if (avisoTxt) entra(aviso); }
      var lineas = [T.wa_hola];
      if (mot) lineas.push(T.wa_motivo + ": " + T.motivos[mot.value].toLowerCase());
      if (dia && !cerrado) lineas.push(T.wa_dia + ": " + texto(dia));
      if (fr && !fr.disabled && !cerrado) lineas.push(T.wa_franja + ": " + (fr.value === "tarde" ? T.tarde : T.manana).toLowerCase());
      if (montura) lineas.push(T.wa_montura.replace("{m}", montura));
      var msg = lineas.join("\n"), href = T.wa + "?text=" + encodeURIComponent(msg);
      was.forEach(function (w) { w.href = href; });
      clearTimeout(temporizador);
      if (inmediato || R) { caja.classList.remove("escribe"); msgEl.textContent = msg; return; }
      caja.classList.add("escribe");
      temporizador = setTimeout(function () { msgEl.textContent = msg; caja.classList.remove("escribe"); entra(msgEl); }, 560);
    };
    form.addEventListener("change", function (e) {
      var t = e.target;
      if (t.name === "dia") { otro.hidden = t.value !== "otro"; if (t.value === "otro" && !fecha.value) fecha.focus(); }
      if (t.name === "dia" || t.name === "motivo" || t.name === "franja") salta(t.parentElement);
      escribe();
    });
    fecha.addEventListener("input", function () { escribe(); });
    ponMotivo = function (v) { var r = $('input[name="motivo"][value="' + v + '"]', form); if (r && !r.checked) { r.checked = true; salta(r.parentElement); escribe(true); } };
    ponMontura = function (n) {
      montura = n;
      eleg.hidden = !n; elegN.textContent = n || "";
      if (n) { ponMotivo("gafas"); entra(eleg); }
      escribe(true);
      $$(".ficha-b").forEach(function (b) {
        var on = b.getAttribute("data-montura") === n;
        b.setAttribute("aria-pressed", on ? "true" : "false");
        var t = b.querySelector("[data-probar-t]"); if (t) t.textContent = on ? T.apartada : T.probar;
      });
    };
    quitar.addEventListener("click", function () { ponMontura(null); });
    escribe(true);
  }
  // enlaces que llevan a la cita con el motivo puesto
  $$("[data-motivo]").forEach(function (a) { a.addEventListener("click", function () { ponMotivo(a.getAttribute("data-motivo")); }); });

  /* ---------- monturas: pulsar aparta la montura para probarla (pasa a la cita) ---------- */
  $$(".ficha-b").forEach(function (b) {
    b.addEventListener("click", function () {
      var n = b.getAttribute("data-montura");
      ponMontura(b.getAttribute("aria-pressed") === "true" ? null : n);
      salta(b.querySelector(".ficha-n"));
    });
  });

  /* ---------- movimiento de lo de abajo (por tiempo al asomar) ---------- */
  if (R || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("js-anim");

  // la fila de monturas corre de lado mientras se baja (la «pista»); con el teclado, la página baja hasta enseñar la ficha
  var fila = $("[data-fila]"), ul = $("[data-pista-fila]");
  if (fila && ul) {
    document.documentElement.classList.add("js-pista");
    var dist = function () { return Math.max(0, ul.scrollWidth - (window.innerWidth - fila.getBoundingClientRect().left) + 8); };
    var tw = gsap.fromTo(ul, { x: 0 }, { x: function () { return -dist(); }, ease: "none", scrollTrigger: { trigger: "#monturas", start: "top 5%", end: "bottom top", scrub: 0.6, invalidateOnRefresh: true } });
    ul.addEventListener("focusin", function (e) {
      var li = e.target.closest(".ficha"); if (!li) return;
      var st = tw.scrollTrigger, D = dist(); if (!st || !D) return;
      var need = Math.min(1, Math.max(0, (li.offsetLeft + li.offsetWidth - (window.innerWidth - fila.getBoundingClientRect().left) + 24) / D));
      var p = st.progress;
      var cardX = li.offsetLeft - p * D, vis = window.innerWidth - fila.getBoundingClientRect().left;
      if (cardX < 0 || cardX + li.offsetWidth > vis) window.scrollTo(0, st.start + need * (st.end - st.start));
    });
  }

  $$('[data-panel="foto"]').forEach(function (el) {
    var img = el.querySelector("img");
    var tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    tl.fromTo(el, { clipPath: "inset(16% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power3.out", clearProps: "clipPath" });
    if (img) tl.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.8, ease: "power3.out", clearProps: "transform" }, 0);
  });
  $$('[data-panel="lado"]').forEach(function (el) {
    var img = el.querySelector("img");
    var tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    tl.fromTo(el, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power3.inOut", clearProps: "clipPath" });
    if (img) tl.fromTo(img, { scale: 1.15, xPercent: -5 }, { scale: 1, xPercent: 0, duration: 1.8, ease: "power3.out", clearProps: "transform" }, 0);
  });
  ScrollTrigger.batch(".ficha", {
    start: "top 92%", once: true,
    onEnter: function (els) { gsap.fromTo(els, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: "power3.out", stagger: 0.09, clearProps: "transform,opacity" }); }
  });
  $$(".datos [data-col]").forEach(function (c, i) {
    gsap.from(c, { x: (i - 1) * 40, y: i === 1 ? 30 : 0, opacity: 0, duration: 1.1, delay: i * 0.08, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: ".datos", start: "top 88%", once: true } });
  });
  [".rev-herr", ".elige", ".pie-grid", ".mon-quien"].forEach(function (s) {
    var el = $(s); if (!el) return;
    gsap.from(el, { y: 36, opacity: 0, duration: 1.15, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
  });
  $$(".etiqueta").forEach(function (el) {
    gsap.from(el, { clipPath: "inset(0% 100% 0% 0%)", duration: 0.9, ease: "power3.inOut", clearProps: "clipPath", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
  });
})();
