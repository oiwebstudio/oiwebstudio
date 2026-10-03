/**
 * Autoaloja las fuentes de las plantillas de sector.
 *
 * Por qué existe: las demos dependían de CDN externos (Fontshare, Google).
 * El 15/08/2026 Fontshare empezó a devolver "Access to the Fontshare API has
 * been temporarily restricted" en 6 de 13 familias. Una demo que se le manda a
 * un cliente no se puede permitir que la tipografía dependa de que un tercero
 * conteste: si no carga, la página cae a fuentes del sistema y pierde justo lo
 * que la hacía no parecer una plantilla.
 *
 * Qué hace: descarga los .woff2 de Google Fonts (licencias OFL / Apache 2.0,
 * que permiten servirlas desde tu propio dominio), los deja en
 * <plantilla>/fuentes/ y sustituye los <link> a CDN por un bloque @font-face
 * local dentro del propio HTML.
 *
 *   node herramientas/demos/autoalojar-fuentes.mjs            → todas las plantillas
 *   node herramientas/demos/autoalojar-fuentes.mjs belleza-peluqueria
 *
 * Es idempotente: si ya está autoalojada, la salta.
 */

import fs from "node:fs/promises";
import path from "node:path";

const RAIZ = path.resolve("web/demos/_plantillas");

/* Un User-Agent moderno es lo que hace que Google devuelva woff2 en vez de
   ttf: la API sirve un formato distinto según quién pregunte. */
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

/* Familias por plantilla. Los nombres son los de Google Fonts.
   Ninguna está en la lista negra de docs/PROMPT-DIRECCION-VISUAL.md §A.1. */
const PLANTILLAS = {
  "hosteleria-asador": {
    display: ["Instrument Serif", "ital,wght@0,400;1,400"],
    texto:   ["Instrument Sans", "wght@400;500;600"],
    detalle: ["Instrument Sans", "wght@600;700"],
  },
  "reformas-gremios": {
    display: ["Bricolage Grotesque", "opsz,wght@12..96,600;12..96,700"],
    texto:   ["Public Sans", "wght@400;500;600"],
    detalle: ["Martian Mono", "wght@400;600"],
  },
  "veterinaria": {
    display: ["Newsreader", "opsz,wght@6..72,500;6..72,700"],
    texto:   ["Onest", "wght@400;500;600"],
    detalle: ["Onest", "wght@600"],
  },
  "abogacia-gestoria": {
    display: ["Libre Caslon Display", ""],
    texto:   ["Newsreader", "ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400"],
    detalle: ["Archivo Narrow", "wght@600;700"],
  },
  "salud-odontologia": {
    display: ["Petrona", "wght@500;600"],
    texto:   ["Public Sans", "wght@400;500;700"],
    detalle: ["Public Sans", "wght@700"],
  },
  "automocion-taller": {
    display: ["Archivo", "wdth,wght@112,600;112,700"],
    texto:   ["Chivo", "wght@400;500;700"],
    detalle: ["Spline Sans Mono", "wght@400;600"],
  },
  "belleza-peluqueria": {
    display: ["Bodoni Moda", "opsz,wght@6..96,400;6..96,500;6..96,700"],
    texto:   ["Chivo", "wght@400;500;600"],
    detalle: ["Chivo", "wght@700"],
  },
  "alimentacion-obrador": {
    display: ["Zilla Slab", "wght@500;700"],
    texto:   ["Public Sans", "wght@400;500;600"],
    detalle: ["Public Sans", "wght@700"],
  },
  "comercio-tienda": {
    display: ["Syne", "wght@500;600;700"],
    texto:   ["Chivo", "wght@400;500"],
    detalle: ["Chivo", "wght@700"],
  },
  "cafeteria-bar": {
    display: ["Big Shoulders Display", "wght@500;700;800"],
    texto:   ["Onest", "wght@400;500;600"],
    detalle: ["Onest", "wght@700"],
  },
  "gimnasio-clases": {
    display: ["Unbounded", "wght@500;700;800"],
    texto:   ["Chivo", "wght@400;500;600"],
    detalle: ["Chivo", "wght@700"],
  },
};

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/**
 * Reescribe los tokens --display/--texto/--detalle para que apunten a las
 * familias que se acaban de descargar.
 *
 * Sin esto, el paso anterior deja las @font-face nuevas declaradas pero los
 * tokens señalando a las familias viejas: la página se ve peor que antes,
 * porque cae a la fuente del sistema. Va aparte de la descarga y se ejecuta
 * siempre, también cuando las fuentes ya estaban.
 */
function ajustarTokens(html, conf, nombre) {
  for (const [rol, [familia]] of Object.entries(conf)) {
    const respaldo = rol === "display" ? "Georgia,serif" : "system-ui,sans-serif";
    html = html.replace(
      new RegExp(`(--${rol}:)[^;]+;`),
      `$1"${familia}",${respaldo};`,
    );
  }
  /* el comentario de cabecera también miente si no se toca */
  const familias = [...new Set(Object.values(conf).map(([f]) => f))].join(" · ");
  html = html.replace(
    /(\n\s*Tipografía[^\n]*\n)(?:\s{4}[^\n]*\n)+/,
    `\n  Tipografía (Google Fonts, autoalojadas en fuentes/):\n    ${familias}\n`,
  );
  return html;
}

async function css(familia, ejes) {
  const q = ejes ? `${familia.replace(/ /g, "+")}:${ejes}` : familia.replace(/ /g, "+");
  const url = `https://fonts.googleapis.com/css2?family=${q}&display=swap`;
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`${familia}: HTTP ${r.status}`);
  const t = await r.text();
  if (!t.includes("@font-face")) throw new Error(`${familia}: sin @font-face`);
  return t;
}

/* Solo el subset latin. latin-ext cubre caracteres del este de Europa
   (ā ē ő ș ț ł ż…) que no salen ni en castellano ni en euskera; los acentos
   que sí usamos —á é í ó ú ü ñ ¿ ¡ « »— y el € entran todos en latin.
   Incluirlo duplicaba el peso a cambio de nada: 4,7 MB frente a 2,7. */
function bloquesUtiles(hoja) {
  return [...hoja.matchAll(/\/\*\s*([a-z-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g)]
    .filter(([, sub]) => sub === "latin")
    .map(([, , bloque]) => bloque);
}

async function procesar(nombre) {
  const dir = path.join(RAIZ, nombre);
  const fichero = path.join(dir, "index.html");
  let html = await fs.readFile(fichero, "utf8");

  const conf = PLANTILLAS[nombre];

  /* Si las fuentes ya están, solo hay que asegurar que los tokens las usan. */
  if (html.includes("═══ FUENTES AUTOALOJADAS ═══")) {
    const arreglado = ajustarTokens(html, conf, nombre);
    if (arreglado !== html) {
      await fs.writeFile(fichero, arreglado);
      console.log(`  ${nombre}: fuentes ya estaban · tokens corregidos`);
    } else {
      console.log(`  ${nombre}: ya autoalojada, salto`);
    }
    return { nombre, saltada: true };
  }

  const familias = [...new Set(Object.values(conf).map(([f, e]) => `${f}|${e}`))];

  await fs.mkdir(path.join(dir, "fuentes"), { recursive: true });
  const caras = [];
  let bytes = 0;

  for (const clave of familias) {
    const [familia, ejes] = clave.split("|");
    const hoja = await css(familia, ejes);
    for (const bloque of bloquesUtiles(hoja)) {
      const url = bloque.match(/url\((https:\/\/[^)]+\.woff2)\)/)?.[1];
      if (!url) continue;
      const peso = bloque.match(/font-weight:\s*([^;]+);/)?.[1].trim() ?? "400";
      const estilo = bloque.match(/font-style:\s*([^;]+);/)?.[1].trim() ?? "normal";
      const rango = bloque.match(/unicode-range:\s*([^;]+);/)?.[1].trim();

      const fich = `${slug(familia)}-${slug(peso)}-${estilo}-${caras.length}.woff2`;
      const bin = Buffer.from(await (await fetch(url, { headers: { "User-Agent": UA } })).arrayBuffer());
      await fs.writeFile(path.join(dir, "fuentes", fich), bin);
      bytes += bin.length;

      caras.push(
        `@font-face{font-family:'${familia}';font-style:${estilo};font-weight:${peso};` +
          `font-display:swap;src:url('fuentes/${fich}') format('woff2');` +
          (rango ? `unicode-range:${rango};` : "") +
          `}`,
      );
    }
  }

  const bloque =
    `<style>\n/* ═══ FUENTES AUTOALOJADAS ═══\n` +
    `   Se sirven desde esta misma carpeta: la demo no depende de ningún CDN.\n` +
    `   Google Fonts, licencias OFL / Apache 2.0 — permiten el autoalojamiento.\n` +
    `   Regenerar con: node herramientas/demos/autoalojar-fuentes.mjs ${nombre}  */\n` +
    caras.join("\n") +
    `\n</style>`;

  /* fuera los <link> a CDN y el preconnect que ya no hace falta */
  html = html
    .replace(/<link rel="preconnect"[^>]*(?:fontshare|googleapis|gstatic)[^>]*\/?>\s*\n?/g, "")
    .replace(/<link[^>]*href="https:\/\/(?:api\.fontshare\.com|fonts\.googleapis\.com)[^"]*"[^>]*\/?>\s*\n?/g, "")
    .replace(/<style>/, bloque + "\n<style>");

  html = ajustarTokens(html, conf, nombre);

  await fs.writeFile(fichero, html);
  console.log(`  ${nombre}: ${caras.length} caras · ${(bytes / 1024).toFixed(0)} KB`);
  return { nombre, caras: caras.length, kb: +(bytes / 1024).toFixed(0) };
}

const pedidas = process.argv.slice(2);
const lista = pedidas.length ? pedidas : Object.keys(PLANTILLAS);
console.log(`Autoalojando fuentes en ${lista.length} plantilla(s)…\n`);

const hechas = [];
for (const n of lista) {
  if (!PLANTILLAS[n]) { console.log(`  ${n}: no está en la lista, salto`); continue; }
  try { hechas.push(await procesar(n)); }
  catch (e) { console.log(`  ${n}: FALLO — ${e.message}`); }
}

const kb = hechas.reduce((a, h) => a + (h.kb || 0), 0);
console.log(`\nListo. ${hechas.filter((h) => !h.saltada).length} plantillas · ${kb} KB en total.`);
