/* Menú móvil y filtro por marca de las subpáginas. Sin JavaScript todo se ve y se puede usar: el menú está en el pie y el filtro es un extra. */
(function () {
  var b = document.querySelector(".burger"), p = document.getElementById("panel");
  if (b && p) b.addEventListener("click", function () { var on = p.classList.toggle("on"); b.setAttribute("aria-expanded", on); b.textContent = on ? "Cerrar" : "Menú"; });
  var g = document.querySelector("[data-rejilla]"); if (!g) return;
  var fs = document.querySelectorAll(".chip[data-f]"), c = document.querySelector("[data-cuenta]");
  fs.forEach(function (x) { x.addEventListener("click", function () {
    var f = x.dataset.f, n = 0;
    fs.forEach(function (y) { y.setAttribute("aria-pressed", y === x); });
    g.querySelectorAll(".bici").forEach(function (t) { var ok = f === "todas" || t.dataset.marca === f; t.hidden = !ok; if (ok) n++; });
    if (c) c.textContent = n + (n === 1 ? " modelo" : " modelos");
  }); });
})();
