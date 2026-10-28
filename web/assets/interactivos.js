/* Secciones interactivas de la portada (28/10/2026).
   1) Antes y después: se arrastra la barra (dedo o ratón), se toca para saltar o se mueve
      con las flechas del teclado. Al entrar en pantalla la barra se mueve sola una vez.
   2) Test de 30 segundos: seis preguntas de Sí/No; el aro, el número y la lista de
      arreglos cambian al momento y el botón de WhatsApp lleva el resultado escrito.
   Todo pasa en el navegador: no se envía ni se guarda nada. Los textos salen de los
   [data-t] de la página, así la versión en euskera funciona igual. */
(function () {
  "use strict";
  var quieto = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1) Antes y después ---------- */
  var ad = document.querySelector(".ad");
  if (ad) {
    var mango = ad.querySelector(".ad__mango");
    var pos = 50, abajo = false, movido = false, tocado = false;
    var pon = function (p, suave) {
      pos = Math.max(0, Math.min(100, p));
      ad.classList.toggle("is-suave", !!suave);
      ad.style.setProperty("--pos", pos.toFixed(2) + "%");
      ad.classList.toggle("is-antes", pos > 62);
      ad.classList.toggle("is-despues", pos < 38);
      mango.setAttribute("aria-valuenow", Math.round(pos));
    };
    var desdeX = function (x) { var r = ad.getBoundingClientRect(); return (x - r.left) / r.width * 100; };
    ad.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      abajo = true; movido = false; tocado = true;
      if (e.pointerType === "mouse") { try { ad.setPointerCapture(e.pointerId); } catch (_) {} }
    });
    ad.addEventListener("pointermove", function (e) {
      if (!abajo) return;
      movido = true;
      pon(desdeX(e.clientX));
    });
    ad.addEventListener("pointerup", function (e) {
      if (abajo && !movido) pon(desdeX(e.clientX), true);   /* un toque: salta ahí, suave */
      abajo = false;
    });
    /* si el dedo baja por la página, el navegador se queda el gesto: no pasa nada */
    ad.addEventListener("pointercancel", function () { abajo = false; });
    mango.addEventListener("keydown", function (e) {
      var d = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5, Home: -100, End: 100 }[e.key];
      if (d === undefined) return;
      e.preventDefault(); tocado = true;
      pon(pos + d, true);
    });
    /* las tres ventajas de debajo llevan a ver «después» */
    var cambios = ad.parentNode.querySelectorAll(".ad__cambios li");
    Array.prototype.forEach.call(cambios, function (li) {
      li.addEventListener("click", function () { tocado = true; pon(6, true); });
    });
    /* pista: al verse entera, la barra va y vuelve una vez (si nadie la ha tocado) */
    if (!quieto && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (en) {
        if (!en[0].isIntersecting) return;
        io.disconnect();
        setTimeout(function () {
          if (tocado) return;
          var t0 = null;
          var paso = function (t) {
            if (tocado) return;
            if (t0 === null) t0 = t;
            var k = (t - t0) / 1900;
            if (k >= 1) { pon(50); return; }
            pon(50 - Math.sin(k * Math.PI * 2) * 26 * (1 - k * 0.35));
            requestAnimationFrame(paso);
          };
          requestAnimationFrame(paso);
        }, 450);
      }, { threshold: 0.6 });
      io.observe(ad);
    }
  }

  /* ---------- 2) Test de 30 segundos ---------- */
  var ts = document.querySelector(".ts");
  if (ts) {
    var txt = function (k) { var el = ts.querySelector('[data-k="' + k + '"]'); return el ? el.textContent.trim() : ""; };
    var preguntas = Array.prototype.slice.call(ts.querySelectorAll(".ts__q"));
    var aro = ts.querySelector(".ts__aro-v");
    var num = ts.querySelector(".ts__num b");
    var ver = ts.querySelector(".ts__ver");
    var lista = ts.querySelector(".ts__arreglos");
    var wa = ts.querySelector(".ts__wa");
    var L = 2 * Math.PI * 52;
    aro.style.strokeDasharray = L.toFixed(1);
    aro.style.strokeDashoffset = L.toFixed(1);
    var mostrado = 0, rel = null;
    var cuenta = function (hasta) {
      if (rel) cancelAnimationFrame(rel);
      var desde = mostrado, t0 = null;
      if (quieto || desde === hasta) { num.textContent = hasta; mostrado = hasta; return; }
      var paso = function (t) {
        if (t0 === null) t0 = t;
        var k = Math.min(1, (t - t0) / 420);
        var v = Math.round(desde + (hasta - desde) * (1 - Math.pow(1 - k, 3)));
        num.textContent = v;
        if (k < 1) rel = requestAnimationFrame(paso); else mostrado = hasta;
      };
      rel = requestAnimationFrame(paso);
    };
    var antesVer = "";
    var pinta = function () {
      var resp = preguntas.filter(function (q) { return q.dataset.v != null; });
      var si = resp.filter(function (q) { return q.dataset.v === "1"; }).length;
      var faltan = resp.filter(function (q) { return q.dataset.v === "0"; });
      aro.style.strokeDashoffset = (L * (1 - si / 6)).toFixed(1);
      cuenta(si);
      var estado = !resp.length ? "" : faltan.length === 0 ? (resp.length === 6 ? "bien" : "") : faltan.length <= 2 ? "medio" : "mal";
      ts.dataset.estado = estado;
      var frase = faltan.length === 0 ? (resp.length === 6 ? txt("ts_r1") : txt("ts_r0")) : faltan.length <= 2 ? txt("ts_r2") : txt("ts_r3");
      if (frase !== antesVer) {
        ver.textContent = frase; antesVer = frase;
        ver.classList.remove("is-cambia"); void ver.offsetWidth; ver.classList.add("is-cambia");
      }
      /* lista de arreglos: entran y salen sin recargar la lista entera */
      var claves = faltan.map(function (q) { return q.dataset.arreglo; });
      Array.prototype.slice.call(lista.children).forEach(function (li) { if (claves.indexOf(li.dataset.k) < 0) li.remove(); });
      claves.forEach(function (k) {
        if (lista.querySelector('[data-k="' + k + '"]')) return;
        var li = document.createElement("li");
        li.dataset.k = k;
        li.textContent = txt(k);
        lista.appendChild(li);
      });
      /* WhatsApp con el resultado escrito */
      var msg = txt("ts_msg").replace("{n}", si) + (claves.length ? "\n- " + claves.map(txt).join("\n- ") : "");
      wa.href = "https://wa.me/34611497409?text=" + encodeURIComponent(msg);
    };
    preguntas.forEach(function (q) {
      Array.prototype.forEach.call(q.querySelectorAll("button"), function (b) {
        b.setAttribute("aria-pressed", "false");
        b.addEventListener("click", function () {
          q.dataset.v = b.dataset.v;
          q.classList.toggle("is-si", b.dataset.v === "1");
          q.classList.toggle("is-no", b.dataset.v === "0");
          Array.prototype.forEach.call(q.querySelectorAll("button"), function (o) {
            var on = o === b;
            o.classList.toggle("is-on", on);
            o.setAttribute("aria-pressed", on ? "true" : "false");
          });
          pinta();
        });
      });
    });
    /* si se cambia de idioma, los textos se rehacen */
    document.addEventListener("click", function (e) { if (e.target.closest && e.target.closest("[data-lang]")) setTimeout(function () { antesVer = ""; lista.innerHTML = ""; pinta(); }, 80); });
  }
})();
