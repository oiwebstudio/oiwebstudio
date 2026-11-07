/* Servicios (7/11/2026): lo que reacciona en las muestras dibujadas. */
(function () {
  "use strict";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Otros colores: cambia la paleta de la muestra */
  var PAL = [["#c07a35", "#191712", "#f8ead9"], ["#2f5d50", "#10231d", "#e7efe9"], ["#b8443a", "#22140f", "#f6e3dc"], ["#3d5a8a", "#121a2b", "#e4eaf4"]];
  [].forEach.call(document.querySelectorAll("[data-mq-pal]"), function (b) {
    var mq = b.closest(".mq"), i = 0;
    b.addEventListener("click", function () {
      i = (i + 1) % PAL.length;
      mq.style.setProperty("--c1", PAL[i][0]); mq.style.setProperty("--c2", PAL[i][1]); mq.style.setProperty("--c3", PAL[i][2]);
    });
  });

  /* Pedido de imprenta: se marca paso a paso al asomar */
  [].forEach.call(document.querySelectorAll(".mq-ped"), function (ped) {
    var pasos = ped.querySelectorAll("li");
    var marcar = function () { [].forEach.call(pasos, function (li, n) { setTimeout(function () { li.classList.add("is-ok"); }, reduce ? 0 : 450 + n * 650); }); };
    if (!("IntersectionObserver" in window)) return marcar();
    var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { io.disconnect(); marcar(); } }, { threshold: 0.5 });
    io.observe(ped);
  });

  /* Panel a medida: aceptar o rechazar una solicitud */
  [].forEach.call(document.querySelectorAll(".mq-pan__a"), function (a) {
    a.addEventListener("click", function (ev) {
      var b = ev.target.closest("button"); if (!b) return;
      var si = b.classList.contains("si");
      var est = document.createElement("span");
      est.className = "mq-pan__est " + (si ? "ok" : "no");
      est.textContent = b.getAttribute("data-r");
      a.replaceWith(est);
    });
  });
})();
