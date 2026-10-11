/**
 * Autoaloja las fuentes de Google que quedan en demos, muestras y biblioteca.
 *
 * Para qué: cualquier <link> a fonts.googleapis.com hace que el navegador del
 * visitante envíe su IP a Google. La web principal ya usa fuentes propias
 * (autoalojar-fuentes-sitio.mjs); esto hace lo mismo con el resto de páginas
 * públicas, que piden familias distintas en cada una.
 *
 *   node herramientas/sitio/autoalojar-fuentes-demos.mjs
 *
 * Por cada URL de Google Fonts distinta: descarga los .woff2 latin y latin-ext
 * a web/assets/fonts/, escribe web/assets/fonts-css/<hash>.css y sustituye los
 * <link> de la página por un único <link> a ese css (ruta desde la raíz).
 * Es idempotente. Hay que volver a lanzarlo tras regenerar las muestras
 * (herramientas/sitio/muestras.mjs), porque sus plantillas de origen aún
 * traen los <link> de Google.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const RAIZ = path.resolve("web");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const FUENTES = path.join(RAIZ, "assets/fonts");
const CSS_DIR = path.join(RAIZ, "assets/fonts-css");
fs.mkdirSync(FUENTES, { recursive: true });
fs.mkdirSync(CSS_DIR, { recursive: true });

const sha = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 8);
const woff = new Map(); // url remota -> nombre local

function* htmls(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (p === path.join(RAIZ, "eu") || e.name === "node_modules") continue; yield* htmls(p); }
    else if (e.name.endsWith(".html")) yield p;
  }
}

async function cssLocal(urlGoogle) {
  const h = sha(urlGoogle);
  const destino = path.join(CSS_DIR, h + ".css");
  if (fs.existsSync(destino)) return h;
  const res = await fetch(urlGoogle, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Google Fonts ${res.status}: ${urlGoogle.slice(0, 90)}`);
  const css = await res.text();
  let salida = `/* Autoalojado — ${new Date().toISOString().slice(0, 10)} — generado por autoalojar-fuentes-demos.mjs */\n`;
  for (const [, subset, cuerpo] of css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{([^}]*)\}/g)) {
    if (subset !== "latin" && subset !== "latin-ext") continue;
    const url = cuerpo.match(/url\((https:[^)]+\.woff2)\)/)?.[1];
    if (!url) continue;
    if (!woff.has(url)) {
      const nombre = `${cuerpo.match(/font-family:\s*'([^']+)'/)[1].toLowerCase().replace(/\s+/g, "-")}-${subset}-${sha(url)}.woff2`;
      if (!fs.existsSync(path.join(FUENTES, nombre))) {
        const r = await fetch(url, { headers: { "User-Agent": UA } });
        fs.writeFileSync(path.join(FUENTES, nombre), Buffer.from(await r.arrayBuffer()));
      }
      woff.set(url, nombre);
    }
    salida += `/* ${subset} */\n@font-face {${cuerpo.replace(url, `../fonts/${woff.get(url)}`).trimEnd()}\n}\n`;
  }
  fs.writeFileSync(destino, salida);
  return h;
}

const reGoogle = /(googleapis|gstatic)\.com/;
let paginas = 0;
const restos = [];
for (const p of htmls(RAIZ)) {
  let t = fs.readFileSync(p, "utf8");
  if (!reGoogle.test(t)) continue;
  const urls = new Set();
  const marcar = (m) => { const u = m.match(/href=["'](https:\/\/fonts\.googleapis\.com\/css[^"']*)["']/); if (u && !/rel=["']preload["']/.test(m)) urls.add(u[1].replace(/&amp;/g, "&")); };
  const todo = [...t.matchAll(/<link[^>]*(googleapis|gstatic)\.com[^>]*>/g)].map((m) => m[0]);
  todo.forEach(marcar);
  // si solo había <noscript> o preload, también hay que tomar la URL
  if (!urls.size) for (const m of todo) { const u = m.match(/href=["'](https:\/\/fonts\.googleapis\.com\/css[^"']*)["']/); if (u) urls.add(u[1].replace(/&amp;/g, "&")); }
  const enlaces = [];
  for (const u of urls) enlaces.push(`<link rel="stylesheet" href="/assets/fonts-css/${await cssLocal(u)}.css">`);
  let puesto = false;
  const poner = () => { if (puesto) return ""; puesto = true; return enlaces.join("\n"); };
  t = t.replace(/<noscript>\s*<link[^>]*(googleapis|gstatic)\.com[^>]*>\s*<\/noscript>/g, poner);
  t = t.replace(/<link[^>]*(googleapis|gstatic)\.com[^>]*>/g, poner);
  if (reGoogle.test(t.replace(/<(?:script|a)[^>]*>/g, ""))) restos.push(path.relative(RAIZ, p));
  fs.writeFileSync(p, t);
  paginas++;
}
console.log(`páginas reescritas: ${paginas} · archivos de fuente nuevos: ${woff.size} · css: ${fs.readdirSync(CSS_DIR).length}`);
if (restos.length) console.log("con referencias a Google todavía:", restos);
