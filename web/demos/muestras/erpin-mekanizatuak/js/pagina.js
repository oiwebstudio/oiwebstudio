/* ERPIN · muestra de taller de chapa y mecanizado (OI Studio, 9/11/2026).
   Barra de la máquina (fecha, hora, X/Y, C, S), menú del móvil, horario según la hora de Gipuzkoa,
   «¿entra en nuestras máquinas?» (medidores, plazo y mensaje escrito para WhatsApp o correo) y paneles que entran al asomar.
   Sin JS: la página se ve entera y quieta; el presupuesto enseña su estado inicial y los enlaces llevan un mensaje base. */
(function () {
  var T = JSON.parse(document.getElementById("textos").textContent);
  var D = JSON.parse(document.getElementById("datos").textContent);
  var R = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- hora de Gipuzkoa ---------- */
  function ahora() {
    try {
      var o = {};
      new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit", weekday: "short", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" })
        .formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
      return { y: o.year, m: o.month, d: o.day, dia: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday], h: +o.hour, min: +o.minute, s: o.second };
    } catch (e) {
      var n = new Date(), p = function (v) { return String(v).padStart(2, "0"); };
      return { y: n.getFullYear(), m: p(n.getMonth() + 1), d: p(n.getDate()), dia: n.getDay(), h: n.getHours(), min: n.getMinutes(), s: p(n.getSeconds()) };
    }
  }

  /* ---------- barra de abajo ---------- */
  var bF = $("[data-fecha]"), bH = $("[data-hora]"), bX = $("[data-x]"), bY = $("[data-y]"), bC = $("[data-c]"), bS = $("[data-s]");
  function reloj() {
    var a = ahora();
    if (bF) bF.textContent = a.y + "/" + a.m + "/" + a.d;
    if (bH) bH.textContent = a.h + ":" + String(a.min).padStart(2, "0") + ":" + a.s;
  }
  reloj();
  setInterval(reloj, 1000);
  var px = 0, py = 0, pendiente = false, clics = 0;
  function pinta() {
    pendiente = false;
    if (bX) bX.textContent = "X = " + px;
    if (bY) bY.textContent = "Y = " + py;
    if (bS) bS.textContent = "S = " + Math.round(window.scrollY || 0);
  }
  function pide() { if (!pendiente) { pendiente = true; requestAnimationFrame(pinta); } }
  addEventListener("pointermove", function (e) { px = Math.round(e.clientX); py = Math.round(e.clientY); pide(); }, { passive: true });
  addEventListener("scroll", pide, { passive: true });
  addEventListener("pointerdown", function () { clics++; if (bC) bC.textContent = "C = " + clics; }, { passive: true });
  pinta();

  /* ---------- menú del móvil ---------- */
  var hamb = $(".hamb"), desp = $("#desplegable");
  if (hamb && desp) {
    /* cerrado = hidden (fuera del árbol y del foco); al abrir, se quita hidden y en el siguiente fotograma se despliega */
    var tCierra = null;
    desp.hidden = true;
    var cierra = function () {
      hamb.setAttribute("aria-expanded", "false"); hamb.setAttribute("aria-label", T.menu); desp.classList.remove("abierto");
      clearTimeout(tCierra); tCierra = setTimeout(function () { desp.hidden = true; }, R ? 0 : 460);
    };
    hamb.addEventListener("click", function () {
      if (hamb.getAttribute("aria-expanded") === "true") { cierra(); return; }
      clearTimeout(tCierra);
      desp.hidden = false;
      hamb.setAttribute("aria-expanded", "true"); hamb.setAttribute("aria-label", T.cerrar);
      requestAnimationFrame(function () { requestAnimationFrame(function () { desp.classList.add("abierto"); }); });
    });
    $$("a", desp).forEach(function (a) { a.addEventListener("click", cierra); });
    addEventListener("keydown", function (e) { if (e.key === "Escape" && hamb.getAttribute("aria-expanded") === "true") { cierra(); hamb.focus(); } });
  }

  /* ---------- horario: lunes a viernes, 7:00–15:00 (de ejemplo) ---------- */
  var est = $("[data-estado]");
  function estado() {
    if (!est) return;
    var a = ahora(), m = a.h * 60 + a.min, lab = a.dia >= 1 && a.dia <= 5;
    var t;
    if (lab && m >= 420 && m < 900) t = T.estado_abierto;
    else if (lab && m < 420) t = T.estado_hoy;
    else if (a.dia >= 1 && a.dia <= 4) t = T.estado_manana;
    else if (a.dia === 0) t = T.estado_manana;
    else t = T.estado_lunes; /* viernes por la tarde y sábado */
    est.textContent = t;
  }
  estado();
  setInterval(estado, 60000);

  /* ---------- ¿entra en nuestras máquinas? ---------- */
  var calc = $("[data-calc]");
  if (calc) {
    var cajas = $$('input[name="proc"]', calc), rango = $('input[name="esp"]', calc), cantI = $('input[name="cant"]', calc), nombreI = $('input[name="nombre"]', calc);
    var out = $("[data-esp-out]", calc), ud = $("[data-cant-ud]", calc), ver = $("[data-veredicto]", calc), plazo = $("[data-plazo]", calc);
    var caja = $("[data-msg]", calc), msgW = $(".msg", calc), wa = $("[data-wa]", calc), correo = $("[data-correo]", calc);
    var botonesHero = $$(".proc[data-proc]");
    var antes = [], tEsc = null, primera = true, verAntes = ver ? ver.textContent : "";
    var num = function (n) { return String(n).replace(".", ","); };
    var mm = function (n) { return num(n) + " mm"; };

    function estadoForm() {
      var sel = cajas.filter(function (c) { return c.checked; }).map(function (c) { return c.value; });
      var mat = ($('input[name="mat"]:checked', calc) || {}).value || "acero";
      var esp = D.ESP[+rango.value] || D.ESP[0];
      var cant = Math.max(1, Math.min(99999, parseInt(cantI.value, 10) || 1));
      return { sel: sel, mat: mat, esp: esp, cant: cant, nombre: (nombreI.value || "").trim() };
    }
    function dentro(p, mat, esp) { var c = D.CAP[p][mat]; return esp >= c[0] && (c[1] === null || esp <= c[1]); }
    function lineas(s) {
      var l = [T.msg_hola];
      if (s.sel.length) l.push(T.msg_proceso + ": " + s.sel.map(function (p) { return T.p[p]; }).join(", "));
      l.push(T.msg_material + ": " + T.mat[s.mat] + ", " + mm(s.esp));
      l.push(T.msg_cantidad + ": " + (s.cant === 1 ? T.cant_1 : T.cant_n).replace("{n}", s.cant));
      if (s.nombre) l.push(T.msg_nombre + ": " + s.nombre);
      l.push(T.msg_plano);
      return l;
    }
    function pintaMensaje(l) {
      caja.innerHTML = "";
      l.forEach(function (t, i) {
        var s = document.createElement("span");
        s.textContent = t;
        if (!primera && !R && antes[i] !== t && antes.indexOf(t) === -1) s.className = "nuevo";
        caja.appendChild(s);
      });
      antes = l;
      primera = false;
      var txt = l.join("\n");
      wa.href = D.WA + "?text=" + encodeURIComponent(txt);
      correo.href = "mailto:" + D.CORREO + "?subject=" + encodeURIComponent(T.asunto) + "&body=" + encodeURIComponent(txt);
    }
    function salta(el) {
      if (R || !el || !el.animate) return;
      el.animate([{ transform: "translateY(6px)", opacity: 0.2 }, { transform: "none", opacity: 1 }], { duration: 420, easing: "cubic-bezier(.2,.75,.25,1)" });
    }

    function actualiza(escribe) {
      var s = estadoForm();
      out.textContent = mm(s.esp);
      rango.setAttribute("aria-valuetext", mm(s.esp));
      if (ud) ud.textContent = s.cant === 1 ? T.pieza : T.piezas;
      /* medidores */
      var nDentro = 0;
      $$("[data-med]", calc).forEach(function (li) {
        var p = li.getAttribute("data-med"), c = D.CAP[p][s.mat], on = s.sel.indexOf(p) > -1, ok = dentro(p, s.mat, s.esp);
        var a = c[0] / D.ESCALA * 100, b = (c[1] === null ? D.ESCALA : Math.min(c[1], D.ESCALA)) / D.ESCALA * 100;
        var r = $("[data-rango]", li);
        r.style.left = a.toFixed(2) + "%";
        r.style.width = (b - a).toFixed(2) + "%";
        $("[data-marca]", li).style.transform = "translateX(" + Math.min(99.4, s.esp / D.ESCALA * 100).toFixed(2) + "%)";
        $("[data-lim]", li).textContent = (c[1] === null ? T.desde : T.hasta).replace("{n}", num(c[1] === null ? c[0] : c[1]));
        $("[data-est]", li).textContent = on ? (ok ? T.dentro : T.fuera) : "";
        li.classList.toggle("on", on);
        li.classList.toggle("fuera", !ok);
        if (on && ok) nDentro++;
      });
      var v = !s.sel.length ? T.res_vacio : nDentro === s.sel.length ? T.res_entra : nDentro === 0 ? T.res_no : T.res_parte;
      if (v !== verAntes) { ver.textContent = v; verAntes = v; salta(ver); }
      var pz = s.cant <= 10 ? T.plazo[0] : s.cant <= 100 ? T.plazo[1] : s.cant <= 1000 ? T.plazo[2] : T.plazo[3];
      if (plazo.textContent !== pz) { plazo.textContent = pz; salta(plazo); }
      /* portada: los [ ] marcan lo mismo */
      botonesHero.forEach(function (b) { b.setAttribute("aria-pressed", String(s.sel.indexOf(b.getAttribute("data-proc")) > -1)); });
      /* mensaje: «escribiendo…» y luego el texto, con la línea nueva marcada */
      var l = lineas(s);
      if (R || !escribe) { pintaMensaje(l); return; }
      msgW.classList.add("escribe");
      clearTimeout(tEsc);
      tEsc = setTimeout(function () { msgW.classList.remove("escribe"); pintaMensaje(l); }, 380);
    }

    calc.addEventListener("change", function () { actualiza(true); });
    rango.addEventListener("input", function () { actualiza(true); });
    nombreI.addEventListener("input", function () { actualiza(true); });
    cantI.addEventListener("input", function () { actualiza(true); });
    cantI.addEventListener("blur", function () { cantI.value = estadoForm().cant; actualiza(false); });
    var paso = function (n) { return n < 10 ? 1 : n < 100 ? 10 : n < 1000 ? 100 : 1000; };
    $("[data-mas]", calc).addEventListener("click", function () { var n = estadoForm().cant; cantI.value = Math.min(99999, n + paso(n)); actualiza(true); salta(cantI); });
    $("[data-menos]", calc).addEventListener("click", function () { var n = estadoForm().cant; cantI.value = Math.max(1, n - paso(Math.max(1, n - 1))); actualiza(true); salta(cantI); });
    botonesHero.forEach(function (b) {
      b.addEventListener("click", function () {
        var c = cajas.filter(function (x) { return x.value === b.getAttribute("data-proc"); })[0];
        if (!c) return;
        c.checked = !c.checked;
        actualiza(true);
      });
    });
    actualiza(false);
  }

  /* ---------- paneles que entran al asomar (por tiempo, no atados al scroll) ---------- */
  if (R || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  $$('[data-panel="foto"]').forEach(function (el) {
    var img = el.querySelector("img");
    var tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    tl.fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power3.inOut", clearProps: "clipPath" });
    if (img) tl.fromTo(img, { scale: 1.14 }, { scale: 1, duration: 1.7, ease: "power3.out", clearProps: "transform" }, 0);
  });
  $$('[data-panel="lado"]').forEach(function (el) {
    gsap.from(el, { y: 40, opacity: 0, duration: 1.2, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
  });
  $$(".tarjeta .t-foto img").forEach(function (img) {
    gsap.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.6, ease: "power3.out", clearProps: "transform", scrollTrigger: { trigger: img.closest(".tarjeta"), start: "top 90%", once: true } });
  });
  $$(".amarilla, .azul").forEach(function (sec) {
    gsap.fromTo(sec, { clipPath: "inset(0% 4% 0% 4%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power3.out", clearProps: "clipPath", scrollTrigger: { trigger: sec, start: "top 90%", once: true } });
  });
})();
