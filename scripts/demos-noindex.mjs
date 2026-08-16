/**
 * Saca las webs de demostración del índice de Google.
 *
 * web/webs-clientes/ se publica en oiwebstudio.vercel.app y son negocios
 * inventados (Studio Noir, Errotaberri…). Estaban marcados "index, follow", así
 * que competían como si fueran negocios reales de Tolosa, en un subdominio
 * .vercel.app que además no es del estudio.
 *
 * Se marcan noindex pero SIN bloquearlas en robots.txt: si se bloquea el
 * rastreo, Google no puede leer la etiqueta y las ya indexadas se quedarían
 * dentro. Hay que dejarle entrar para que vea el noindex.
 *
 * Siguen abiertas y navegables para quien llegue desde el portfolio.
 */
import fs from "node:fs";
import path from "node:path";

const DIR = path.resolve("web/webs-clientes");
const META = '<meta name="robots" content="noindex, follow"/>';

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) {
      if ([".vercel", "node_modules", "scripts"].includes(e.name)) continue;
      walk(p);
    } else if (e.name.endsWith(".html")) files.push(p);
  }
})(DIR);

let reemplazados = 0;
let insertados = 0;
let yaEstaban = 0;

for (const p of files) {
  let html = fs.readFileSync(p, "utf8");

  if (/name="robots"\s+content="[^"]*noindex/i.test(html)) {
    yaEstaban++;
    continue;
  }

  const existente = html.match(/[ \t]*<meta\s+name="robots"[^>]*>\n?/i);
  if (existente) {
    html = html.replace(existente[0], META + "\n");
    reemplazados++;
  } else {
    // Va detrás del viewport, que está en todas las cabeceras.
    const vp = html.match(/[ \t]*<meta\s+name="viewport"[^>]*>\n?/i);
    if (!vp) {
      console.log(`  ¡ojo! sin viewport, sin tocar: ${path.relative(DIR, p)}`);
      continue;
    }
    html = html.replace(vp[0], vp[0] + META + "\n");
    insertados++;
  }

  fs.writeFileSync(p, html);
}

console.log(`html encontrados: ${files.length}`);
console.log(`  etiqueta sustituida: ${reemplazados}`);
console.log(`  etiqueta añadida:    ${insertados}`);
console.log(`  ya estaban:          ${yaEstaban}`);
