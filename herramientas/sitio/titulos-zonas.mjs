/**
 * Acorta el título de las páginas de zona y le mete la segunda variante de búsqueda.
 *
 * Antes:  "Diseño web en Donostia-San Sebastián — Páginas web para negocios | OI Studio"  (81 car.)
 * Ahora:  "Diseño y páginas web en Donostia-San Sebastián | OI Studio"                     (58 car.)
 *
 * Dos motivos, los dos salidos de Search Console:
 *  1. Por encima de ~65 caracteres Google corta el título en los resultados, y en
 *     Donostia — la consulta con más impresiones — se comía el final.
 *  2. "diseño web donostia" y "paginas web donostia" son dos consultas distintas
 *     con volumen propio. El título nuevo cubre las dos y encima ocupa menos.
 */
import fs from "node:fs";
import path from "node:path";

const DIR = path.resolve("web/zonas");
const VIEJO = /^Diseño web en (.+?) — Páginas web para negocios \| OI Studio$/;

let cambiados = 0;
let saltados = 0;
const largos = [];

for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith(".html"))) {
  const p = path.join(DIR, file);
  let html = fs.readFileSync(p, "utf8");

  const actual = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const m = actual?.match(VIEJO);
  if (!m) {
    saltados++;
    continue;
  }

  const nuevo = `Diseño y páginas web en ${m[1]} | OI Studio`;
  html = html.replaceAll(actual, nuevo);
  fs.writeFileSync(p, html);
  cambiados++;
  if (nuevo.length > 65) largos.push(`${file} (${nuevo.length})`);
}

console.log(`títulos acortados: ${cambiados} | sin tocar: ${saltados}`);
console.log(largos.length ? `siguen largos: ${largos.join(", ")}` : "ninguno pasa de 65 caracteres");
