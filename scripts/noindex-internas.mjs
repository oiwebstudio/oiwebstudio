/**
 * Saca del índice de Google las páginas que no son el sitio público.
 *
 *  - web/webs-clientes/     demos de negocios inventados (Studio Noir, Errotaberri…).
 *                           Se publican en oiwebstudio.vercel.app.
 *  - web/demos/             plantillas y pruebas de sector.
 *  - web/catalogo-servicios/ notas internas ("Servicios que podría ofrecer").
 *
 * Las tres viven dentro de web/, que pasa a ser la raíz publicada, así que sin
 * esto acabarían indexadas en oiwebstudio.com compitiendo con las páginas
 * buenas y metiendo negocios ficticios en las búsquedas locales de Tolosa.
 *
 * Se marcan noindex pero NO se bloquean en robots.txt: si se bloquea el
 * rastreo, Google no puede leer la etiqueta y las ya indexadas se quedan
 * dentro. Hay que dejarle entrar para que vea el noindex.
 *
 * Siguen abiertas y navegables para quien llegue por un enlace.
 */
import fs from "node:fs";
import path from "node:path";

const DIRS = ["web/webs-clientes", "web/demos", "web/catalogo-servicios"];
const IGNORAR = new Set([".vercel", "node_modules", "scripts", ".git", "src"]);
const META = '<meta name="robots" content="noindex, follow"/>';

function htmlsDe(dir) {
  const out = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (IGNORAR.has(e.name)) continue;
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".html")) out.push(p);
    }
  })(path.resolve(dir));
  return out;
}

let total = 0, reemplazados = 0, insertados = 0, yaEstaban = 0, sinHueco = [];

for (const dir of DIRS) {
  if (!fs.existsSync(dir)) {
    console.log(`  (no existe, se salta: ${dir})`);
    continue;
  }
  for (const p of htmlsDe(dir)) {
    total++;
    let html = fs.readFileSync(p, "utf8");

    if (/name="robots"\s+content="[^"]*noindex/i.test(html)) {
      yaEstaban++;
      continue;
    }

    const existente = html.match(/[ \t]*<meta\s+name="robots"[^>]*>\r?\n?/i);
    if (existente) {
      html = html.replace(existente[0], META + "\r\n");
      reemplazados++;
    } else {
      const vp = html.match(/[ \t]*<meta\s+name="viewport"[^>]*>\r?\n?/i);
      if (!vp) {
        sinHueco.push(path.relative(".", p));
        continue;
      }
      html = html.replace(vp[0], vp[0].replace(/\r?\n?$/, "\r\n") + META + "\r\n");
      insertados++;
    }
    fs.writeFileSync(p, html);
  }
}

console.log(`html encontrados: ${total}`);
console.log(`  etiqueta sustituida: ${reemplazados}`);
console.log(`  etiqueta añadida:    ${insertados}`);
console.log(`  ya estaban:          ${yaEstaban}`);
if (sinHueco.length) console.log(`  SIN viewport, sin tocar:\n    ${sinHueco.join("\n    ")}`);
