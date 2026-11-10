/**
 * Pone en web/sitemap.xml el <lastmod> real de cada URL.
 *
 * Fecha = la del último commit que tocó el fichero (git log -1 --format=%cs).
 * Si el fichero tiene cambios sin commitear que no son solo saltos de línea
 * ni la línea de analitica.js, se usa la fecha de modificación del fichero
 * (la de la edición real). En el despliegue, con el árbol limpio, sale solo
 * la del commit.
 *
 * Uso (desde la raíz del estudio):
 *   node herramientas/sitio/lastmod-sitemap.mjs --check   # muestra qué cambiaría
 *   node herramientas/sitio/lastmod-sitemap.mjs           # escribe sitemap.xml
 * No añade ni quita URLs ni toca changefreq/priority. Idempotente.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const RAIZ = path.resolve("web");
const SITEMAP = path.join(RAIZ, "sitemap.xml");
const CHECK = process.argv.includes("--check");
const git = (...a) => execFileSync("git", a, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }).trim();

function ficheroDe(loc) {
  let p = loc.replace(/^https:\/\/oiwebstudio\.com\//, "");
  if (p === "" || p.endsWith("/")) p += "index.html";
  return p;
}

function fechaDe(rel) {
  const ruta = `web/${rel}`;
  if (!fs.existsSync(path.join(RAIZ, rel))) return null;
  const cambios = git("diff", "--ignore-cr-at-eol", "-U0", "--", ruta)
    .split("\n")
    .filter((l) => /^[+-]/.test(l) && !/^(\+\+\+|---)/.test(l) && !l.includes("analitica.js"));
  if (cambios.length) return fs.statSync(path.join(RAIZ, rel)).mtime.toISOString().slice(0, 10);
  const c = git("log", "-1", "--format=%cs", "--", ruta);
  return c || null;
}

let sm = fs.readFileSync(SITEMAP, "utf8");
let cambiadas = 0, sinFecha = 0;
sm = sm.replace(/(<loc>)([^<]+)(<\/loc><lastmod>)([\d-]+)(<\/lastmod>)/g, (m, a, loc, b, vieja, c) => {
  const f = fechaDe(ficheroDe(loc));
  if (!f) { sinFecha++; return m; }
  if (f !== vieja) { cambiadas++; if (CHECK) console.log(`${loc}  ${vieja} -> ${f}`); }
  return `${a}${loc}${b}${f}${c}`;
});
if (!CHECK) fs.writeFileSync(SITEMAP, sm);
console.log(`${CHECK ? "(solo comprobación) " : ""}lastmod cambiados: ${cambiadas} · sin fecha (se dejan): ${sinFecha}`);
