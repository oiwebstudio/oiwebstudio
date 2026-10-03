/**
 * Añade a cada página de zona un bloque de municipios cercanos.
 *
 * Las 20 páginas de zona solo recibían enlaces del hub y de la portada, y
 * entre ellas no se enlazaban: cada una era una isla. Este script las conecta
 * por comarca, que es como se mueve de verdad la gente por Gipuzkoa.
 *
 * Es idempotente: si el bloque ya está puesto, no lo duplica.
 */
import fs from "node:fs";
import path from "node:path";

const DIR = path.resolve("web/zonas");

// Vecinos por cercanía real. Los de comarca primero; cuando la comarca tiene
// pocos municipios en la web, se completa con el limítrofe más cercano.
const VECINOS = {
  alegia: ["anoeta", "ibarra", "villabona"],
  anoeta: ["ibarra", "alegia", "villabona"],
  ibarra: ["anoeta", "alegia", "villabona"],
  villabona: ["ibarra", "anoeta", "andoain"],
  andoain: ["lasarte-oria", "hernani", "villabona"],
  "lasarte-oria": ["andoain", "hernani", "donostia-san-sebastian"],
  hernani: ["lasarte-oria", "andoain", "donostia-san-sebastian"],
  "donostia-san-sebastian": ["errenteria", "hernani", "lasarte-oria"],
  errenteria: ["donostia-san-sebastian", "irun", "hernani"],
  irun: ["hondarribia", "errenteria", "donostia-san-sebastian"],
  hondarribia: ["irun", "errenteria", "donostia-san-sebastian"],
  beasain: ["ordizia", "zumarraga", "alegia"],
  ordizia: ["beasain", "zumarraga", "alegia"],
  zumarraga: ["beasain", "ordizia", "azpeitia"],
  azpeitia: ["zarautz", "zumarraga", "ordizia"],
  zarautz: ["azpeitia", "donostia-san-sebastian", "zumarraga"],
  "arrasate-mondragon": ["bergara", "onati", "eibar"],
  bergara: ["arrasate-mondragon", "onati", "eibar"],
  onati: ["arrasate-mondragon", "bergara", "zumarraga"],
  eibar: ["bergara", "arrasate-mondragon", "zumarraga"],
};

const CSS = `
  /* Municipios cercanos: conecta las páginas de zona entre sí */
  .zcerca{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;list-style:none;padding:0;margin:0;}
  @media(max-width:720px){.zcerca{grid-template-columns:1fr;}}
  .zcerca a{display:flex;align-items:center;justify-content:space-between;gap:10px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);padding:16px 18px;text-decoration:none;color:var(--text-muted);font-size:14.5px;transition:transform .3s var(--ease),box-shadow .3s var(--ease),border-color .3s;}
  .zcerca a:hover{transform:translateY(-3px);box-shadow:var(--shadow-md);border-color:var(--border-strong);}
  .zcerca b{color:var(--ink);font-weight:600;}
  .zcerca i{color:var(--terra-link);font-style:normal;font-size:15px;line-height:1;}
`;

/** Nombre tal y como se muestra en el h1 de cada página. */
function nombreDe(slug) {
  const html = fs.readFileSync(path.join(DIR, `${slug}.html`), "utf8");
  const m = html.match(/<h1>[^<]*<span class="grad">([^<]+)<\/span>/);
  if (!m) throw new Error(`No encuentro el nombre en ${slug}.html`);
  return m[1];
}

const nombres = Object.fromEntries(Object.keys(VECINOS).map((s) => [s, nombreDe(s)]));

let tocados = 0;
let saltados = 0;

for (const [slug, vecinos] of Object.entries(VECINOS)) {
  const file = path.join(DIR, `${slug}.html`);
  let html = fs.readFileSync(file, "utf8");

  if (html.includes('class="zcerca"')) {
    saltados++;
    continue;
  }

  // 1. Estilos, justo antes de cerrar el <style> propio de la página.
  const finStyle = html.indexOf("</style>");
  if (finStyle === -1) throw new Error(`${slug}: no hay bloque <style>`);
  html = html.slice(0, finStyle) + CSS + html.slice(finStyle);

  // 2. El bloque va antes de las preguntas frecuentes, que es donde el
  //    lector ya ha decidido si le encajas y puede querer otra localidad.
  const anclaFaq = html.indexOf('<div class="zhead"><span class="k">Dudas</span>');
  if (anclaFaq === -1) throw new Error(`${slug}: no encuentro la sección de FAQ`);
  const inicioSeccion = html.lastIndexOf("<section", anclaFaq);
  if (inicioSeccion === -1) throw new Error(`${slug}: no encuentro el <section> de la FAQ`);

  const items = vecinos
    .map(
      (v) =>
        `<li><a href="${v}.html"><b>${nombres[v]}</b><i>&rarr;</i></a></li>`
    )
    .join("\n");

  const bloque =
    `<section class="zsec" style="padding-top:0;">\n` +
    `<div class="container">\n` +
    `<div class="zhead"><span class="k">Cerca de ${nombres[slug]}</span><h2>También trabajo en estos municipios</h2></div>\n` +
    `<ul class="zcerca" data-anim="up">\n${items}\n</ul>\n` +
    `</div>\n</section>\n\n`;

  html = html.slice(0, inicioSeccion) + bloque + html.slice(inicioSeccion);

  fs.writeFileSync(file, html);
  tocados++;
}

console.log(`páginas actualizadas: ${tocados} | ya tenían el bloque: ${saltados}`);
