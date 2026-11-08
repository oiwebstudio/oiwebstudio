/* TORLOJU v2 · muestra de taller (OI Studio, 7/11/2026). Persiana según la hora, presupuesto al momento, menú y paneles.
   Sin JS o con «reducir movimiento»: todo se ve quieto y completo. Es una muestra: no se envía nada a ningún sitio. */
(function () {
  var T = JSON.parse(document.getElementById("textos").textContent);
  var R = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var TOR = window.TORLOJU;
  var hm = function (m) { return Math.floor(m / 60) + ":" + ("0" + (m % 60)).slice(-2); };

  /* ---------- abierto o cerrado, según la hora de Tolosaldea ---------- */
  function proxima(a) {
    /* siguiente apertura desde ahora: {dia, min, cuantos días faltan} */
    for (var k = 0; k < 8; k++) {
      var d = (a.dia + k) % 7, f = TOR.H[d];
      for (var i = 0; i < f.length; i++) if (k > 0 || f[i][0] > a.min) return { dia: d, min: f[i][0], k: k };
    }
    return null;
  }
  function textos(a) {
    var e = TOR.estado(a), f = TOR.H[a.dia], r = { e: e };
    if (e === "abierto") {
      var fin = f.filter(function (x) { return a.min >= x[0] && a.min < x[1]; })[0][1];
      r.corto = T.estado_abierto; r.largo = T.estado_cierra.replace("{h}", hm(fin));
    } else {
      var p = proxima(a), h = hm(p.min);
      var cuando = (p.k === 0 ? T.estado_abre_hoy : p.k === 1 ? T.estado_abre_manana : T.estado_abre_dia.replace("{dia}", T.dias_cuando[p.dia])).replace("{h}", h);
      if (e === "comida") { r.corto = T.estado_comida; r.largo = T.estado_vuelve.replace("{h}", h); r.pint = T.pintado_vuelve.replace("{h}", h); }
      else { r.corto = T.estado_cerrado; r.largo = cuando; r.pint = cuando.charAt(0).toUpperCase() + cuando.slice(1); }
    }
    return r;
  }
  var fachada = document.querySelector("[data-fachada]");
  function pinta(primera) {
    var a = TOR.ahora(), t = textos(a);
    var est = document.querySelector("[data-estado-txt]");
    if (est) { est.setAttribute("data-estado", t.e); est.innerHTML = "<b>" + t.corto + "</b><span>" + t.largo + "</span>"; }
    var ah = document.querySelector("[data-ahora]");
    if (ah) ah.innerHTML = t.corto + "<span>" + t.largo + "</span>";
    var ps = document.querySelector("[data-pintado-s]");
    if (ps) ps.textContent = t.pint || "";
    if (fachada && fachada.getAttribute("data-estado") !== t.e) {
      if (!primera) fachada.classList.add("cambia");
      fachada.setAttribute("data-estado", t.e);
    }
    document.querySelectorAll(".horario li").forEach(function (li) {
      var hoy = +li.getAttribute("data-dia") === a.dia;
      var s = li.querySelector(".hoy");
      if (hoy) { li.setAttribute("aria-current", "date"); if (!s) { s = document.createElement("span"); s.className = "hoy"; s.textContent = T.hoy; li.querySelector(".dia").appendChild(s); } }
      else { li.removeAttribute("aria-current"); if (s) s.remove(); }
    });
  }
  if (TOR) { pinta(true); setInterval(function () { pinta(false); }, 30000); }

  /* ---------- menú del móvil ---------- */
  var hb = document.querySelector(".hamb"), m = document.getElementById("desplegable");
  if (hb && m) {
    var cierra = function () { m.classList.remove("abierto"); hb.setAttribute("aria-expanded", "false"); hb.setAttribute("aria-label", T.menu); };
    hb.addEventListener("click", function () { var ab = m.classList.toggle("abierto"); hb.setAttribute("aria-expanded", ab); hb.setAttribute("aria-label", ab ? T.cerrar : T.menu); });
    m.addEventListener("click", function (e) { if (e.target.closest("a")) cierra(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && m.classList.contains("abierto")) { cierra(); hb.focus(); } });
  }

  /* ---------- presupuesto al momento ---------- */
  var calc = document.querySelector("[data-calc]");
  var euros = function (n) { return n.toLocaleString(T.lang === "eu" ? "eu" : "es-ES") + " €"; };
  function gira(el, desde, hasta) {
    /* el número sube o baja contando, en ~450 ms */
    if (R || desde === hasta) { el.textContent = euros(hasta); return; }
    var t0 = performance.now(), dur = 450;
    cancelAnimationFrame(el._raf);
    (function paso(t) {
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = euros(Math.round(desde + (hasta - desde) * e));
      if (k < 1) el._raf = requestAnimationFrame(paso);
    })(t0);
  }
  if (calc) {
    var lista = calc.querySelector("[data-lineas-tk]"), totalEl = calc.querySelector("[data-total]"), plazoEl = calc.querySelector("[data-plazo]");
    var cocheEl = calc.querySelector("[data-coche-tk]"), mat = calc.querySelector("[data-matricula]");
    var barraTot = document.querySelector("[data-total-barra]"), was = document.querySelectorAll("[data-wa]"), srTot = calc.querySelector("[data-total-sr]");
    var total = 0, estado = { tam: "", nombres: [], suma: 0 };
    var factor = function () { var r = calc.querySelector('input[name="tamano"]:checked'); return r ? +r.dataset.factor : 1; };
    var precio = function (base) { return Math.round(base * factor()); };
    function mensaje() {
      /* el mensaje de WhatsApp queda escrito con lo elegido */
      var msg = [T.wa_hola, T.wa_coche + ": " + estado.tam];
      if (mat && mat.value.trim()) msg.push(T.wa_matricula + ": " + mat.value.trim().toUpperCase());
      if (estado.nombres.length) msg.push(T.wa_trabajos + ": " + estado.nombres.join(", "));
      if (estado.suma) msg.push(T.wa_total.replace("{n}", estado.suma));
      var href = "https://wa.me/34600000000?text=" + encodeURIComponent(msg.join("\n"));
      was.forEach(function (a) { a.href = href; });
    }
    function actualiza(cambioCoche, avisar) {
      var f = factor(), r = calc.querySelector('input[name="tamano"]:checked');
      cocheEl.textContent = r.dataset.coche;
      /* precios de la lista según el coche */
      calc.querySelectorAll(".precio .n").forEach(function (n) {
        var v = precio(+n.dataset.base);
        if (n.textContent !== String(v)) {
          n.textContent = v;
          if (cambioCoche && !R && n.animate) n.animate([{ transform: "translateY(-40%)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 320, easing: "cubic-bezier(.2,.75,.25,1)" });
        }
      });
      var marcados = [].slice.call(calc.querySelectorAll('input[name="trabajo"]:checked'));
      var suma = 0, horas = 0, otra = false, nombres = [];
      /* líneas del ticket: se añaden y se quitan con su animación */
      var actuales = {};
      lista.querySelectorAll("li[data-k]").forEach(function (li) { actuales[li.dataset.k] = li; });
      var vacio = lista.querySelector(".vacio");
      marcados.forEach(function (c) {
        var p = +c.dataset.precio, v = p ? precio(p) : 0;
        suma += v; horas += +c.dataset.horas; if (!p) otra = true;
        nombres.push(c.dataset.nombre + (p ? " (" + T.linea_tpl.replace("{n}", v) + ")" : ""));
        var li = actuales[c.value];
        var txt = p ? T.linea_tpl.replace("{n}", v) : T.te_llamamos;
        if (li) { li.querySelector("b").textContent = txt; delete actuales[c.value]; lista.appendChild(li); }
        else {
          li = document.createElement("li"); li.dataset.k = c.value;
          var s = document.createElement("span"); s.textContent = c.dataset.nombre;
          var b = document.createElement("b"); b.textContent = txt;
          li.appendChild(s); li.appendChild(b); lista.appendChild(li);
          if (!R && li.animate) li.animate([{ opacity: 0, transform: "translateX(14px)" }, { opacity: 1, transform: "none" }], { duration: 380, easing: "cubic-bezier(.2,.75,.25,1)" });
        }
      });
      Object.keys(actuales).forEach(function (k) {
        var li = actuales[k];
        delete li.dataset.k;
        if (!R && li.animate) { var an = li.animate([{ opacity: 1 }, { opacity: 0, transform: "translateX(14px)" }], { duration: 220, easing: "ease-in" }); an.onfinish = function () { li.remove(); }; }
        else li.remove();
      });
      if (vacio) vacio.hidden = marcados.length > 0;
      gira(totalEl, total, suma); if (barraTot) gira(barraTot, total, suma);
      total = suma;
      plazoEl.textContent = !marcados.length ? T.plazo_nada : (suma === 0 ? T.plazo_otra : (horas <= 2.5 ? T.plazo_manana : horas <= 6 ? T.plazo_dia : T.plazo_dias) + (otra ? "; " + T.plazo_otra : ""));
      if (avisar && !R && marcados.length && plazoEl.animate) plazoEl.animate([{ opacity: .3 }, { opacity: 1 }], { duration: 300 });
      /* lectores de pantalla: el total se dice una vez, no mientras el número cuenta */
      if (avisar && srTot) srTot.textContent = marcados.length ? T.tk_total + ": " + euros(suma) : "";
      estado = { tam: r.dataset.tam.toLowerCase(), nombres: nombres, suma: suma };
      mensaje();
    }
    calc.addEventListener("change", function (e) { if (e.target === mat) return; actualiza(e.target.name === "tamano", true); });
    if (mat) mat.addEventListener("input", mensaje);
    actualiza(false, false);
    /* el total «salta» un poco cuando cambia */
    calc.addEventListener("change", function (e) { if (e.target !== mat && !R && totalEl.animate) totalEl.animate([{ transform: "scale(1)" }, { transform: "scale(1.06)" }, { transform: "scale(1)" }], { duration: 320, easing: "cubic-bezier(.2,.75,.25,1)" }); });
  }

  /* ---------- barra del móvil: dentro de «precios» enseña el total ---------- */
  var barra = document.querySelector("[data-barra-movil]"), sec = document.getElementById("precios");
  if (barra && sec && "IntersectionObserver" in window) {
    new IntersectionObserver(function (e) { barra.classList.toggle("total", e[0].isIntersecting); }, { rootMargin: "-30% 0px -40% 0px" }).observe(sec);
  }

  /* ---------- paneles que entran al asomar (por tiempo, no atados al scroll) ---------- */
  if (R || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("js-anim");
  document.querySelectorAll('[data-panel="foto"]').forEach(function (el) {
    var img = el.querySelector("img, svg");
    var tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    tl.fromTo(el, { clipPath: "inset(12% 0% 12% 0%)", opacity: 0 }, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 1.3, ease: "power3.out", clearProps: "clipPath,opacity" });
    if (img) tl.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.6, ease: "power3.out", clearProps: "transform" }, 0);
  });
  document.querySelectorAll('[data-panel="lado"]').forEach(function (el) {
    gsap.from(el, { x: 40, opacity: 0, duration: 1.2, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
  });
  document.querySelectorAll('[data-panel="sube"]').forEach(function (el) {
    gsap.from(el, { y: 40, opacity: 0, duration: 1.2, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: el, start: "top 86%", once: true } });
  });
  var ruta = document.querySelector(".mapa .ruta");
  if (ruta) gsap.from(ruta, { opacity: 0, duration: 1.2, delay: 0.5, ease: "power2.out", scrollTrigger: { trigger: ruta.closest(".mapa"), start: "top 80%", once: true } });
})();
