/**
 * Menú y pie en euskera para las páginas en euskera que viven fuera de web/eu/ (14/11/2026):
 * adimen-artifiziala-negozioentzat-*.html. No cargan i18n.js (en una guía forzaría lang="es"), así que
 * menu.mjs y pie.mjs les dejan el menú y el pie en castellano. Este script los vuelve a poner en euskera
 * con el diccionario EU de assets/i18n.js y apunta a eu/ los enlaces de las páginas que tienen versión eu/.
 *
 * LANZARLO SIEMPRE DESPUÉS de menu.mjs o pie.mjs. Idempotente.
 * Uso: node herramientas/sitio/marco-eu-sueltas.mjs
 */
import fs from "node:fs";
import path from "node:path";

const WEB = path.resolve("web");
const i18n = fs.readFileSync(path.join(WEB, "assets/i18n.js"), "utf8");
const DICT = Function(`return ${i18n.match(/const EU = (\{[\s\S]*?\n\});/)[1]}`)();
const CON_EU = /href="(index|precios|contacto|trabajos|sobre-mi|seo-posicionamiento-google|automatizaciones|branding)\.html(#[^"]*)?"/g;

const sueltas = fs.readdirSync(WEB).filter((f) => /^adimen-artifiziala-negozioentzat-.+\.html$/.test(f));
for (const f of sueltas) {
  const abs = path.join(WEB, f);
  let h = fs.readFileSync(abs, "utf8");
  const antes = h;
  // Solo el marco: cabecera (hasta el artículo) y pie (desde <footer>).
  const ini = h.indexOf('<header class="art-hero">');
  const pie = h.indexOf('<footer class="footer">');
  const traducir = (s) => s
    /* pie.mjs toma el prefijo del enlace del logo (eu/index.html) y lo pone en todos: se quita donde no hay eu/. */
    .replace(/src="eu\/assets\//g, 'src="assets/')
    .replace(/href="eu\/(?!(?:index|precios|contacto|trabajos|sobre-mi|seo-posicionamiento-google|automatizaciones|branding)\.html)([^"]*)"/g, 'href="$1"')
    .replace(/(<([a-z0-9]+)\b[^>]*\bdata-t="([a-z_0-9]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g, (m, open, tag, k, inner, close) => (DICT[k] != null ? open + DICT[k] + close : m))
    .replace(CON_EU, (m, p, hash = "") => `href="eu/${p}.html${hash}"`);
  h = traducir(h.slice(0, ini)) + h.slice(ini, pie) + traducir(h.slice(pie));
  if (h !== antes) fs.writeFileSync(abs, h);
  console.log(f, h !== antes ? "traducida" : "sin cambios");
}
