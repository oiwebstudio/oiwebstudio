/* MALDA · muestra de sidrería y asador (OI Studio, 8/11/2026).
   Horario según la hora real de Tolosa, txotx según la fecha real, carta con la fecha de hoy y platos que se marcan
   «agotado» al pulsarlos, reserva que deja el WhatsApp escrito, las esquinas en crema sobre el verde y paneles que entran
   al asomar. El nombre de arriba lo lleva el CSS (se va con la primera foto; aquí no se toca).
   Sin JS o con «reducir movimiento»: todo se ve quieto y completo. Es una muestra: no se envía nada a ningún sitio. */
(function () {
  var T = JSON.parse(document.getElementById("textos").textContent);
  var R = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EU = T.lang === "eu";
  var EASE = "cubic-bezier(.2,.75,.25,1)";

  /* ---------- hora de Tolosa ---------- */
  var H = { 0: [[780, 990]], 1: [], 2: [], 3: [[780, 960], [1230, 1380]], 4: [[780, 960], [1230, 1380]], 5: [[780, 960], [1230, 1380]], 6: [[780, 960], [1230, 1380]] };
  function ahora() {
    try {
      var o = {};
      new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
        .formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
      return { dia: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday], min: +o.hour * 60 + +o.minute, fecha: new Date(+o.year, +o.month - 1, +o.day) };
    } catch (e) { var n = new Date(); return { dia: n.getDay(), min: n.getHours() * 60 + n.getMinutes(), fecha: new Date(n.getFullYear(), n.getMonth(), n.getDate()) }; }
  }

  /* ---------- horario: el día de hoy marcado y si está abierto ---------- */
  function horario() {
    var a = ahora(), f = H[a.dia], txt = "", abierto = false;
    for (var i = 0; i < f.length; i++) if (a.min >= f[i][0] && a.min < f[i][1]) { txt = T.est["a" + f[i][1]]; abierto = true; }
    if (!abierto) {
      var luego = f.filter(function (x) { return x[0] > a.min; })[0];
      if (luego) txt = T.est["h" + luego[0]];
      else { var k = 1; while (!H[(a.dia + k) % 7].length) k++; txt = k === 1 ? T.est.m780 : T.est.w780; }
    }
    var e = document.querySelector("[data-estado]");
    if (e && e.textContent !== txt) { e.textContent = txt; e.classList.toggle("abierto", abierto); }
    document.querySelectorAll(".horario li").forEach(function (li) {
      var hoy = li.getAttribute("data-dias").split(",").indexOf(String(a.dia)) >= 0, s = li.querySelector(".hoy");
      if (hoy) { li.setAttribute("aria-current", "date"); if (!s) { s = document.createElement("span"); s.className = "hoy"; s.textContent = T.hoy; li.firstElementChild.appendChild(s); } }
      else { li.removeAttribute("aria-current"); if (s) s.remove(); }
    });
  }
  horario(); setInterval(horario, 30000);

  /* ---------- txotx: del 17 de enero al 30 de abril, según la fecha real ---------- */
  function enTxotx(d) { var m = d.getMonth(), dd = d.getDate(); return (m === 0 && dd >= 17) || m === 1 || m === 2 || (m === 3 && dd <= 30); }
  function txotx() {
    var hoy = ahora().fecha, caja = document.querySelector("[data-txotx]"), est = document.querySelector("[data-txotx-estado]"), anio = document.querySelector("[data-anio]");
    if (!caja) return;
    var dentro = enTxotx(hoy), txt;
    if (dentro) txt = T.tx_dentro;
    else {
      var y = hoy.getMonth() >= 4 ? hoy.getFullYear() + 1 : hoy.getFullYear();
      var falta = Math.round((new Date(y, 0, 17) - hoy) / 864e5);
      txt = T.tx_fuera.replace("{n}", falta);
    }
    caja.classList.toggle("en-temporada", dentro);
    est.textContent = txt;
    if (anio && !anio.querySelector(".marca-hoy")) {
      var ini = new Date(hoy.getFullYear(), 0, 1), dias = (new Date(hoy.getFullYear() + 1, 0, 1) - ini) / 864e5;
      var m = document.createElement("span"); m.className = "marca-hoy";
      m.style.left = ((hoy - ini) / 864e5 / dias * 100).toFixed(1) + "%";
      var t = document.createElement("span"); t.textContent = T.hoy; m.appendChild(t); anio.appendChild(m);
    }
  }
  txotx();

  /* ---------- carta al día: la fecha es la de hoy y cada plato se marca «agotado» al pulsarlo ---------- */
  var cartaUl = document.querySelector("[data-carta]"), act = document.querySelector("[data-act]"), actF = document.querySelector("[data-act-fecha]");
  if (cartaUl && act && actF) {
    var h0 = ahora().fecha, y0 = h0.getFullYear(), m0 = h0.getMonth() + 1, d0 = h0.getDate();
    actF.textContent = T.act.replace("{f}", EU ? y0 + "/" + m0 + "/" + d0 : d0 + "/" + m0 + "/" + y0);
    act.hidden = false;
    cartaUl.querySelectorAll("li").forEach(function (li) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "plato"; b.setAttribute("aria-pressed", "false");
      while (li.firstChild) b.appendChild(li.firstChild);
      li.appendChild(b); li.classList.add("pulsable");
      var pr = b.querySelector(".pr"), precio = pr ? pr.textContent : "";
      b.addEventListener("click", function () {
        var on = b.getAttribute("aria-pressed") !== "true";
        b.setAttribute("aria-pressed", on ? "true" : "false");
        li.classList.toggle("agotado", on);
        if (pr) pr.textContent = on ? T.agotado : precio;
        actF.textContent = T.act_ahora;
        if (!R && pr && pr.animate) pr.animate([{ opacity: 0, transform: "translateY(40%)" }, { opacity: 1, transform: "none" }], { duration: 320, easing: EASE });
        if (!R && actF.animate) actF.animate([{ opacity: 0.2 }, { opacity: 1 }], { duration: 500, easing: EASE });
      });
    });
  }

  /* ---------- reservar: el mensaje sale escrito ---------- */
  var form = document.querySelector("[data-reserva]");
  if (form) {
    var lista = form.querySelector("[data-dias-lista]"), otro = form.querySelector("[data-otro]"), fecha = form.querySelector("[data-fecha]");
    var numEl = form.querySelector("[data-num]"), menos = form.querySelector("[data-menos]"), mas = form.querySelector("[data-mas]");
    var aviso = form.querySelector("[data-aviso]"), msgEl = form.querySelector("[data-mensaje]"), caja = form.querySelector(".mensaje"), was = document.querySelectorAll("[data-wa]");
    /* los nombres de los días vienen de la página (en euskera, del traductor), no del navegador: no todos traen el euskera */
    var fCorto = { format: function (x) { return T.cortos[x.getDay()]; } };
    var fDia = { format: function (x) { return T.dias[x.getDay()]; } };
    var meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    var fLargo = { format: function (x) { return T.dias[x.getDay()] + " " + x.getDate() + " de " + meses[x.getMonth()]; } };
    var gente = 4, elegida = null, temporizador = 0;
    var iso = function (d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); };
    var deIso = function (s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); };
    var texto = function (d) {
      if (EU) return fDia.format(d) + ", " + d.getFullYear() + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + ("0" + d.getDate()).slice(-2);
      return fLargo.format(d).replace(",", "");
    };
    /* los próximos cinco días que abrimos (en euskera el nombre del día va entero y no caben más en el móvil) */
    var a = ahora(), d = new Date(a.fecha), dias = [];
    for (var k = 0; dias.length < 5 && k < 21; k++) {
      var f = H[d.getDay()];
      if (f.length && (k > 0 || a.min < f[f.length - 1][0] - 60)) dias.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    lista.innerHTML = "";
    dias.forEach(function (x, i) {
      var l = document.createElement("label"); l.className = "dia";
      l.innerHTML = '<input type="radio" name="dia" value="' + iso(x) + '"' + (i === 0 ? " checked" : "") + '><small>' + fCorto.format(x) + "</small><b>" + x.getDate() + "</b>";
      lista.appendChild(l);
    });
    var lo = document.createElement("label"); lo.className = "dia otro-dia";
    lo.innerHTML = '<input type="radio" name="dia" value="otro"><b>' + T.otro_dia + "</b>";
    lista.appendChild(lo);
    otro.hidden = true;
    fecha.min = iso(a.fecha);
    var max = new Date(a.fecha); max.setDate(max.getDate() + 200); fecha.max = iso(max);

    function salta(el) { if (!R && el && el.animate) el.animate([{ transform: "translateY(0)" }, { transform: "translateY(-5px)" }, { transform: "none" }], { duration: 300, easing: EASE }); }
    function diaElegido() {
      var r = form.querySelector('input[name="dia"]:checked');
      if (!r) return null;
      if (r.value === "otro") return fecha.value ? deIso(fecha.value) : null;
      return deIso(r.value);
    }
    function escribe(inmediato) {
      var dia = diaElegido(), turnoIn = form.querySelector('input[name="turno"]:checked');
      var cena = form.querySelector('input[name="turno"][value="cena"]'), comida = form.querySelector('input[name="turno"][value="comida"]');
      var avisoTxt = "";
      /* el domingo solo a mediodía; lunes y martes, cerrado; hoy, lo que queda */
      var f = dia ? H[dia.getDay()] : [], esHoy = dia && iso(dia) === iso(a.fecha);
      var hayComida = f.some(function (x) { return x[0] === 780 && (!esHoy || a.min < x[0] - 60); });
      var hayCena = f.some(function (x) { return x[0] === 1230 && (!esHoy || a.min < x[0] - 60); });
      comida.disabled = !!dia && !hayComida; cena.disabled = !!dia && !hayCena;
      if (dia && !f.length) avisoTxt = T.fila_3 + ": " + T.cerrado.toLowerCase() + ".";
      else if (dia && dia.getDay() === 0) avisoTxt = T.sin_cena;
      if (turnoIn && turnoIn.disabled) { var otroT = turnoIn === cena ? comida : cena; if (!otroT.disabled) { otroT.checked = true; turnoIn = otroT; } }
      if (gente > 20) avisoTxt = T.muchos;
      if (aviso.textContent !== avisoTxt) { aviso.textContent = avisoTxt; if (avisoTxt && !R && aviso.animate) aviso.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 }); }
      var lineas = [T.wa_hola];
      if (dia) lineas.push(T.wa_dia + ": " + texto(dia));
      if (turnoIn && !turnoIn.disabled) lineas.push(T.wa_turno + ": " + (turnoIn.value === "cena" ? T.turno_cena : T.turno_comida).toLowerCase());
      lineas.push(T.wa_personas + ": " + gente);
      if (dia && enTxotx(dia)) lineas.push(T.wa_txotx);
      var msg = lineas.join("\n"), href = T.wa + "?text=" + encodeURIComponent(msg);
      was.forEach(function (w) { w.href = href; });
      /* «escribiendo…» y luego el mensaje */
      clearTimeout(temporizador);
      if (inmediato || R) { caja.classList.remove("escribe"); msgEl.textContent = msg; return; }
      caja.classList.add("escribe");
      temporizador = setTimeout(function () {
        msgEl.textContent = msg; caja.classList.remove("escribe");
        if (msgEl.animate) msgEl.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 420, easing: EASE });
      }, 520);
    }
    function pinta(n, dir) {
      gente = n; numEl.textContent = n;
      menos.disabled = n <= 1; mas.disabled = n >= 40;
      if (!R && numEl.animate) numEl.animate([{ transform: "translateY(" + (dir > 0 ? 40 : -40) + "%)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 280, easing: EASE });
    }
    menos.addEventListener("click", function () { if (gente > 1) { pinta(gente - 1, -1); escribe(); } });
    mas.addEventListener("click", function () { if (gente < 40) { pinta(gente + 1, 1); escribe(); } });
    form.addEventListener("change", function (e) {
      var t = e.target;
      if (t.name === "dia") {
        otro.hidden = t.value !== "otro";
        if (t.value === "otro" && !fecha.value) { fecha.focus(); }
        salta(t.parentElement);
      }
      if (t.name === "turno") salta(t.parentElement);
      escribe();
    });
    fecha.addEventListener("input", function () { escribe(); });
    pinta(4, 0); escribe(true);
  }

  /* ---------- las esquinas y el nombre, en crema sobre el verde ---------- */
  var verde = document.querySelector(".verde");
  if (verde && "IntersectionObserver" in window) {
    new IntersectionObserver(function (e) { document.documentElement.classList.toggle("sobre-verde", e[0].isIntersecting); }, { rootMargin: "0px 0px -88% 0px" }).observe(verde);
  }

  /* ---------- barra del móvil: aparece cuando la portada ya no se ve ---------- */
  var barra = document.querySelector("[data-barra-movil]"), port = document.querySelector("[data-portada]");
  if (barra) {
    if (!port || !("IntersectionObserver" in window)) barra.classList.add("on");
    else new IntersectionObserver(function (e) { barra.classList.toggle("on", !e[0].isIntersecting); }).observe(port);
  }

  /* ---------- movimiento de lo de abajo (por tiempo al asomar) ---------- */
  if (R || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("js-anim");
  document.querySelectorAll('[data-panel="foto"]').forEach(function (el) {
    var img = el.querySelector("img");
    var tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    tl.fromTo(el, { clipPath: "inset(14% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power3.out", clearProps: "clipPath" });
    if (img) tl.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.8, ease: "power3.out", clearProps: "transform" }, 0);
  });
  document.querySelectorAll('[data-panel="lado"]').forEach(function (el) {
    var img = el.querySelector("img");
    var tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 92%", once: true } });
    tl.fromTo(el, { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power3.inOut", clearProps: "clipPath" });
    if (img) tl.fromTo(img, { scale: 1.15, xPercent: 6 }, { scale: 1, xPercent: 0, duration: 1.8, ease: "power3.out", clearProps: "transform" }, 0);
  });
  document.querySelectorAll('[data-panel="sube"]').forEach(function (el) {
    gsap.from(el, { y: 36, opacity: 0, duration: 1.2, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    var ruta = el.querySelector(".ruta");
    if (ruta) gsap.fromTo(ruta, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.8, delay: 0.4, ease: "power2.inOut", clearProps: "clipPath", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
  });
})();
