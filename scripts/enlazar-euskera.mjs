/**
 * Prepara las páginas en castellano para convivir con su versión en euskera.
 *
 * Hace dos cosas en las cinco páginas traducidas:
 *
 *  1. Añade las señales hreflang. Tienen que ser recíprocas: si la página en
 *     castellano no declara a su pareja en euskera, Google ignora la relación
 *     entera y trata las dos como contenido duplicado.
 *
 *  2. Convierte el selector de idioma en enlaces de verdad. Antes eran botones
 *     que reescribían la página con JavaScript, y un buscador nunca ejecuta eso;
 *     ahora el enlace lleva a /eu/, que es lo que permite descubrir la versión
 *     traducida. En el resto de páginas los botones se quedan como estaban,
 *     porque no tienen versión en euskera a la que enlazar.
 *
 * Es idempotente: se puede ejecutar las veces que haga falta.
 */
import fs from "node:fs";
import path from "node:path";

const RAIZ = path.resolve("web");
const BASE = "https://oiwebstudio.com";
const PAGINAS = ["index.html", "precios.html", "contacto.html", "trabajos.html", "sobre-mi.html"];

let tocadas = 0;

for (const pagina of PAGINAS) {
  const p = path.join(RAIZ, pagina);
  let html = fs.readFileSync(p, "utf8");
  const antes = html;

  const urlEs = `${BASE}/${pagina === "index.html" ? "" : pagina}`;
  const urlEu = `${BASE}/eu/${pagina}`;

  /* 1. hreflang, justo después de la canónica y sin duplicar si ya está. */
  if (!/hreflang="eu"/.test(html)) {
    const señales =
      `\n<link rel="alternate" hreflang="es" href="${urlEs}"/>` +
      `\n<link rel="alternate" hreflang="eu" href="${urlEu}"/>` +
      `\n<link rel="alternate" hreflang="x-default" href="${urlEs}"/>`;
    if (/<link\s+rel="canonical"[^>]*>/i.test(html)) {
      html = html.replace(/(<link\s+rel="canonical"[^>]*>)/i, `$1${señales}`);
    } else {
      html = html.replace(/<\/head>/i, `${señales}\n</head>`);
    }
  }

  /* 2. El selector, a enlaces. */
  html = html.replace(
    /<button\s+type="button"\s+data-lang="es"\s*>ES<\/button>/gi,
    `<span class="lang-link is-active" aria-current="true">ES</span>`
  );
  html = html.replace(
    /<button\s+type="button"\s+data-lang="eu"\s*>EU<\/button>/gi,
    `<a class="lang-link" href="/eu/${pagina}" hreflang="eu" lang="eu" aria-label="Euskaraz ikusi">EU</a>`
  );

  if (html !== antes) {
    fs.writeFileSync(p, html);
    tocadas++;
  }
}

console.log(`  páginas en castellano preparadas: ${tocadas} de ${PAGINAS.length}`);
