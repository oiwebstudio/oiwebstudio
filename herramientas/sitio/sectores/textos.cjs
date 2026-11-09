// Claves y textos en castellano de los sectores nuevos (nuevos.json): sx_c_<slug> (botón), sx_k_<slug> (qué negocio es)
// y sx_<slug>_a/b/c (qué lleva). Los 8 primeros sectores conservan sus claves de siempre (existentes.json).
const path = require("path");
const fs = require("fs");
const LETRAS = ["a", "b", "c", "d"];
// Textos de la galería «todas las muestras» que va debajo de las pestañas (9/11/2026, Oier: «que la gente vea rápidamente los demos»)
const UI = {
  sx_todas_h: "Todas las muestras",
  sx_todas_p: "Toca una y se abre entera, lista para probar.",
  sx_todas_mas: "Ver todas",
  sx_todas_menos: "Ver menos",
};
function nuevos() { return JSON.parse(fs.readFileSync(path.join(__dirname, "nuevos.json"), "utf8")); }
function textosES() {
  const o = { ...UI };
  for (const s of nuevos()) {
    o[`sx_c_${s.slug}`] = s.chip;
    o[`sx_k_${s.slug}`] = s.k;
    s.lleva.forEach((t, i) => { o[`sx_${s.slug}_${LETRAS[i]}`] = t; });
  }
  return o;
}
module.exports = { nuevos, textosES, LETRAS, UI };
