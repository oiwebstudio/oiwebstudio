// Claves y textos en castellano de los sectores nuevos (nuevos.json): sx_c_<slug> (botón), sx_k_<slug> (qué negocio es)
// y sx_<slug>_a/b/c (qué lleva). Los 8 primeros sectores conservan sus claves de siempre (existentes.json).
const path = require("path");
const fs = require("fs");
const LETRAS = ["a", "b", "c", "d"];
function nuevos() { return JSON.parse(fs.readFileSync(path.join(__dirname, "nuevos.json"), "utf8")); }
function textosES() {
  const o = {};
  for (const s of nuevos()) {
    o[`sx_c_${s.slug}`] = s.chip;
    o[`sx_k_${s.slug}`] = s.k;
    s.lleva.forEach((t, i) => { o[`sx_${s.slug}_${LETRAS[i]}`] = t; });
  }
  return o;
}
module.exports = { nuevos, textosES, LETRAS };
