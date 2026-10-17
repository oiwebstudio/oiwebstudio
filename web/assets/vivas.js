/* Los dos casos de clientes, en vivo (trabajos.html, #vivas). 17/10/2026.
   - errotatxo.com se abre dentro del móvil SOLO al tocarlo: así no pesa al
     cargar la página, no atrapa el scroll y no se llama a su web sin que el
     visitante quiera.
   - aberricasarural.com no permite abrirse dentro de otra página
     (X-Frame-Options: SAMEORIGIN), así que se pasan sus capturas con
     anterior / siguiente (y con el dedo: es un carrusel con scroll-snap).
   Los textos salen de [data-t] de la página: en /eu/ ya vienen traducidos. */
(function () {
  "use strict";
  var raiz = document.getElementById("vivas");
  if (!raiz) return;
  var txt = function (k) { var el = raiz.querySelector('[data-k="' + k + '"]'); return el ? el.textContent.trim() : ""; };

  /* La web se pinta a 390 px de ancho, como en un móvil de verdad, y se reduce
     para caber en el marco (si no, se vería con el ancho de un móvil diminuto). */
  var ANCHO = 390;
  var encajar = function (f) {
    var p = f.parentNode, s = p.clientWidth / ANCHO;
    f.style.width = ANCHO + "px";
    f.style.height = (p.clientHeight / s) + "px";
    f.style.transform = "scale(" + s + ")";
  };
  window.addEventListener("resize", function () { raiz.querySelectorAll(".viva iframe").forEach(encajar); });

  /* Errotatxo: el iframe se crea al tocar */
  raiz.querySelectorAll(".viva__tapa").forEach(function (tapa) {
    tapa.addEventListener("click", function () {
      var pantalla = tapa.parentNode;
      if (pantalla.querySelector("iframe")) return;
      var etiqueta = tapa.querySelector("span");
      tapa.setAttribute("aria-busy", "true");
      if (etiqueta && txt("cargando")) etiqueta.textContent = txt("cargando");
      var f = document.createElement("iframe");
      f.title = txt("iframe") || "errotatxo.com";
      f.referrerPolicy = "strict-origin-when-cross-origin";
      f.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox");
      f.addEventListener("load", function () {
        f.classList.add("cargado");
        tapa.remove();
      });
      f.src = tapa.getAttribute("data-src");
      pantalla.appendChild(f);
      encajar(f);
      /* si tarda mucho, se quita la tapa igualmente: el iframe ya está debajo */
      setTimeout(function () { if (tapa.isConnected) { f.classList.add("cargado"); tapa.remove(); } }, 12000);
    });
  });

  /* A.Berri: carrusel de capturas */
  var pase = document.getElementById("pase-aberri");
  if (!pase) return;
  var fotos = pase.querySelectorAll("picture");
  var nombres = txt("pase").split("|");
  var ant = document.getElementById("pase-ant");
  var sig = document.getElementById("pase-sig");
  var rotulo = document.getElementById("pase-nombre");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var actual = 0;

  var marcar = function (i) {
    actual = i;
    rotulo.textContent = nombres[i] || "";
    var n = document.createElement("small");
    n.textContent = (i + 1) + " / " + fotos.length;
    rotulo.appendChild(n);
    ant.disabled = i === 0;
    sig.disabled = i === fotos.length - 1;
    fotos.forEach(function (p, j) {
      var img = p.querySelector("img");
      img.alt = j === i ? "aberricasarural.com: " + (nombres[j] || "") : "";
      if (j <= i + 1) img.loading = "eager"; /* la siguiente ya cargada al pasar */
    });
  };
  var ir = function (i) {
    i = Math.max(0, Math.min(fotos.length - 1, i));
    pase.scrollTo({ left: i * pase.clientWidth, behavior: reduce ? "auto" : "smooth" });
    marcar(i);
  };
  ant.addEventListener("click", function () { ir(actual - 1); });
  sig.addEventListener("click", function () { ir(actual + 1); });
  pase.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { e.preventDefault(); ir(actual + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); ir(actual - 1); }
  });
  /* al pasar con el dedo, el rótulo sigue a la pantalla que se ve */
  var espera = null;
  pase.addEventListener("scroll", function () {
    clearTimeout(espera);
    espera = setTimeout(function () {
      var i = Math.round(pase.scrollLeft / Math.max(1, pase.clientWidth));
      if (i !== actual) marcar(i);
    }, 90);
  }, { passive: true });
  marcar(0);
})();
