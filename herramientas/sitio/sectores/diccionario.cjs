// Lee el diccionario EU de web/assets/i18n.js (el mismo que usan el navegador y generar-euskera.mjs).
const fs = require("fs");
const path = require("path");
const I18N = path.resolve(__dirname, "../../../web/assets/i18n.js");
function leerEU() {
  const src = fs.readFileSync(I18N, "utf8").replace(/^﻿/, "");
  const a = src.indexOf("const EU = {");
  const b = src.indexOf("\n};", a);
  // eslint-disable-next-line no-new-func
  return new Function(src.slice(a, b + 3) + "\nreturn EU;")();
}
module.exports = { I18N, leerEU };
