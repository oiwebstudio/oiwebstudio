/* Cabecera: se vuelve sólida al bajar, menú de móvil y carrusel de la portada. Sin JS todo se ve y funciona (enlaces normales). */
(function () {
  var cab = document.querySelector("[data-cab]"), aviso = document.querySelector(".aviso");
  var quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (cab) {
    var pos = function () {
      var h = aviso ? aviso.getBoundingClientRect().bottom : 0;
      cab.style.top = Math.max(0, h) + "px";
      cab.classList.toggle("solida", h <= 0 && scrollY > 80);
    };
    pos(); addEventListener("scroll", pos, { passive: true }); addEventListener("resize", pos);
  }
  var b = document.querySelector(".cab__burger"), m = document.getElementById("menu-m");
  if (b && m) {
    var cerrar = function () { m.hidden = true; b.setAttribute("aria-expanded", "false"); b.setAttribute("aria-label", "Abrir el menú"); document.body.classList.remove("menu-abierto"); };
    b.addEventListener("click", function () {
      var abrir = m.hidden;
      m.hidden = !abrir; b.setAttribute("aria-expanded", abrir); b.setAttribute("aria-label", abrir ? "Cerrar el menú" : "Abrir el menú");
      document.body.classList.toggle("menu-abierto", abrir);
      if (abrir) m.querySelector("a").focus();
    });
    addEventListener("keydown", function (e) { if (e.key === "Escape" && !m.hidden) { cerrar(); b.focus(); } });
    m.addEventListener("click", function (e) { if (e.target.closest("a")) cerrar(); });
  }
  var car = document.querySelector("[data-slides]");
  if (car) {
    var fotos = [].slice.call(car.querySelectorAll(".slides img")), i = 0, t;
    var ir = function (n) { fotos[i].classList.remove("on"); i = (n + fotos.length) % fotos.length; fotos[i].classList.add("on"); };
    var auto = function () { clearInterval(t); if (!quieto) t = setInterval(function () { ir(i + 1); }, 6500); };
    car.querySelector(".flecha--izq").addEventListener("click", function () { ir(i - 1); auto(); });
    car.querySelector(".flecha--der").addEventListener("click", function () { ir(i + 1); auto(); });
    auto();
  }
})();
