/* LAINO · cristal empañado.
   Cada [data-vidrio] tiene la foto nítida (.nitida) y la misma foto ya empañada (.empanada, horneada en fotos/*-niebla-*).
   Con JavaScript, la niebla se pinta en un <canvas>: al entrar en pantalla un «dedo» limpia una franja (data-limpio =
   «cx cy rx ry» en % del recuadro; data-limpio-movil para pantallas estrechas) y, solo con ratón, el cursor va limpiando
   el cristal y la niebla vuelve poco a poco. Con «reducir movimiento» no se hace nada: queda la franja fija del CSS. */
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var fino = matchMedia("(hover:hover) and (pointer:fine)").matches;

  function Vidrio(el) {
    var emp = el.querySelector(".empanada");
    var cv = document.createElement("canvas"), ctx = cv.getContext("2d");
    var off = document.createElement("canvas"), octx = off.getContext("2d");
    var mk = document.createElement("canvas"), mctx = mk.getContext("2d"); /* lo que ha limpiado el cursor */
    var w = 0, h = 0, limpio = false, raf = 0, cuenta = 0, ultimo = null, zona = el.closest("section") || el;
    cv.setAttribute("aria-hidden", "true");

    function franja() {
      var d = innerWidth < 760 && el.dataset.limpioMovil ? el.dataset.limpioMovil : (innerHeight > innerWidth * 1.1 && el.dataset.limpioAlto ? el.dataset.limpioAlto : el.dataset.limpio);
      return (d || "50 40 16 6").split(/\s+/).map(Number);
    }
    function niebla(c) {
      var iw = emp.naturalWidth, ih = emp.naturalHeight, s = Math.max(w / iw, h / ih), dw = iw * s, dh = ih * s;
      var op = getComputedStyle(emp).objectPosition.split(" ");
      var px = (parseFloat(op[0]) || 50) / 100, py = (parseFloat(op[1]) || 50) / 100;
      c.drawImage(emp, (w - dw) * px, (h - dh) * py, dw, dh);
    }
    function brocha(c, x, y, r, a) {
      var g = c.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, "rgba(0,0,0," + a + ")"); g.addColorStop(0.45, "rgba(0,0,0," + a * 0.7 + ")"); g.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 6.2832); c.fill();
    }
    function borra(c, x, y, r) { /* el dedo: borde más seco, como en el cristal de verdad */
      var g = c.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, "rgba(0,0,0,1)"); g.addColorStop(0.72, "rgba(0,0,0,.95)"); g.addColorStop(1, "rgba(0,0,0,0)");
      c.globalCompositeOperation = "destination-out"; c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 6.2832); c.fill(); c.globalCompositeOperation = "source-over";
    }
    function pinta() { ctx.clearRect(0, 0, w, h); ctx.drawImage(off, 0, 0, w, h); ctx.globalCompositeOperation = "destination-out"; ctx.drawImage(mk, 0, 0, w, h); ctx.globalCompositeOperation = "source-over"; }
    function dedo(c, t) {
      var f = franja(), cx = f[0] / 100 * w, cy = f[1] / 100 * h, rx = f[2] / 100 * w, ry = f[3] / 100 * h;
      var x0 = cx - rx, x1 = cx + rx, n = Math.max(8, Math.ceil((x1 - x0) / (ry * 0.25)));
      for (var i = 0; i <= n * t; i++) borra(c, x0 + (x1 - x0) * i / n, cy + Math.sin(i / n * 3.1) * ry * -0.35, ry);
    }
    function monta() {
      var r = el.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = r.width; h = r.height; if (!w || !h) return;
      [cv, off, mk].forEach(function (c) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); });
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); octx.setTransform(dpr, 0, 0, dpr, 0, 0); mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      octx.clearRect(0, 0, w, h); niebla(octx); dedo(octx, 1);
      ctx.clearRect(0, 0, w, h);
      mctx.clearRect(0, 0, w, h);
      if (limpio) ctx.drawImage(off, 0, 0, w, h); else niebla(ctx);
    }
    function limpia() {
      var t0 = performance.now(), dur = 1100;
      (function paso(t) {
        var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        ctx.clearRect(0, 0, w, h); niebla(ctx); dedo(ctx, e);
        if (k < 1) requestAnimationFrame(paso); else { limpio = true; ctx.clearRect(0, 0, w, h); ctx.drawImage(off, 0, 0, w, h); }
      })(t0);
    }
    function empana() {
      cuenta++;
      mctx.globalCompositeOperation = "destination-out"; mctx.fillStyle = "rgba(0,0,0,.025)"; mctx.fillRect(0, 0, w, h); mctx.globalCompositeOperation = "source-over";
      if (cuenta > 260) { mctx.clearRect(0, 0, w, h); pinta(); raf = 0; return; }
      pinta(); raf = requestAnimationFrame(empana);
    }
    function mueve(e) {
      if (!limpio) return;
      var r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > w || y > h) { ultimo = null; return; }
      var rad = Math.max(54, Math.min(120, w * 0.075));
      if (ultimo) {
        var dx = x - ultimo[0], dy = y - ultimo[1], d = Math.hypot(dx, dy), n = Math.ceil(d / (rad * 0.25));
        for (var i = 1; i <= n; i++) brocha(mctx, ultimo[0] + dx * i / n, ultimo[1] + dy * i / n, rad, 0.35);
      } else brocha(mctx, x, y, rad, 0.35);
      ultimo = [x, y]; cuenta = 0;
      if (!raf) raf = requestAnimationFrame(empana);
    }

    function arranca() {
      el.appendChild(cv); monta(); el.classList.add("con-lienzo");
      var io = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { io.disconnect(); setTimeout(limpia, el.closest("[data-portada]") ? 500 : 150); }
      }, { threshold: 0.35 });
      io.observe(el);
      if (fino) {
        zona.addEventListener("pointermove", mueve, { passive: true });
        zona.addEventListener("pointerleave", function () { ultimo = null; });
      }
      var tm; addEventListener("resize", function () { clearTimeout(tm); tm = setTimeout(monta, 150); });
    }
    var hecho = false;
    function listo() { if (hecho || !emp.naturalWidth) return; hecho = true; arranca(); }
    /* la carga puede haber terminado ya o cambiar de tamaño de srcset: se escucha y, por si acaso, se vuelve a mirar */
    emp.addEventListener("load", listo);
    listo();
    var vueltas = 0, t = setInterval(function () { listo(); if (hecho || ++vueltas > 60) clearInterval(t); }, 250);
  }
  document.querySelectorAll("[data-vidrio]").forEach(function (el) { Vidrio(el); });
})();

/* Menú del móvil */
(function () {
  var cab = document.getElementById("cab"), b = cab && cab.querySelector(".menu-btn");
  if (!b) return;
  function cierra() { cab.classList.remove("abierta"); b.setAttribute("aria-expanded", "false"); b.textContent = "Menú"; }
  b.addEventListener("click", function () {
    var a = !cab.classList.contains("abierta");
    cab.classList.toggle("abierta", a); b.setAttribute("aria-expanded", String(a)); b.textContent = a ? "Cerrar" : "Menú";
  });
  cab.querySelectorAll("nav a, .tel").forEach(function (a) { a.addEventListener("click", cierra); });
  addEventListener("keydown", function (e) { if (e.key === "Escape") cierra(); });
})();

/* Formulario de muestra: no envía nada */
(function () {
  var f = document.getElementById("form"), s = document.getElementById("f-estado");
  if (!f) return;
  f.addEventListener("submit", function (e) { e.preventDefault(); s.textContent = "Es una muestra de diseño: este formulario no envía nada."; });
})();
