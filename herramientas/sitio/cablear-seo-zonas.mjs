/**
 * Mete las páginas de zona nuevas en sitemap.xml y en llms.txt. Idempotente.
 * Se ejecuta después de gen-zonas-ampliado.mjs.
 *
 * Uso: node herramientas/sitio/cablear-seo-zonas.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { NUEVAS } from "./zonas-nuevas-datos.mjs";
import { ESPANA } from "./espana-datos.mjs";
import { ARTICULOS } from "./gen-articulos-nacionales.mjs";

const RAIZ = path.resolve("web");
const BASE = "https://oiwebstudio.com";
const HOY = "2026-10-05";
const COMARCAS = ["tolosaldea", "buruntzaldea", "donostialdea", "oarsoaldea", "bidasoa", "goierri", "urola-garaia", "urola-erdia", "urola-kosta", "debabarrena", "debagoiena"];

/* ---------------------------------------------------------------- sitemap */
const entradas = [
  ...COMARCAS.map((c) => [`${BASE}/zonas/${c}.html`, "monthly", "0.8"]),
  ...ESPANA.map((d) => [`${BASE}/${d.slug}.html`, "monthly", d.ambito === "España" ? "0.8" : "0.7"]),
  ...ARTICULOS.map((a) => [`${BASE}/${a.slug}.html`, "monthly", "0.8"]),
  ...NUEVAS.map((n) => [`${BASE}/zonas/${n.slug}.html`, "monthly", n.slug === "tolosa" ? "0.9" : "0.6"]),
];
let sm = fs.readFileSync(path.join(RAIZ, "sitemap.xml"), "utf8");
let añadidas = 0;
for (const [loc, freq, prio] of entradas) {
  if (sm.includes(`<loc>${loc}</loc>`)) continue;
  sm = sm.replace("</urlset>", `  <url><loc>${loc}</loc><lastmod>${HOY}</lastmod><changefreq>${freq}</changefreq><priority>${prio}</priority></url>\n</urlset>`);
  añadidas++;
}
// el hub de zonas, con fecha de hoy
sm = sm.replace(/(<loc>https:\/\/oiwebstudio.com\/zonas.html<\/loc><lastmod>)[\d-]+/, `$1${HOY}`);
fs.writeFileSync(path.join(RAIZ, "sitemap.xml"), sm);

/* --------------------------------------------------------------- llms.txt */
let llms = fs.readFileSync(path.join(RAIZ, "llms.txt"), "utf8");
const BLOQUE = `## Zonas donde trabaja

Gipuzkoa entera, por comarcas, con página propia para cada municipio de más de unos 1.000 habitantes: [Tolosaldea](${BASE}/zonas/tolosaldea.html) (Tolosa, Alegia, Anoeta, Ibarra, Villabona, Irura, Zizurkil, Asteasu, Berastegi…), [Buruntzaldea](${BASE}/zonas/buruntzaldea.html) (Andoain, Urnieta, Lasarte-Oria), [Donostialdea](${BASE}/zonas/donostialdea.html) (Donostia-San Sebastián, Hernani, Astigarraga, Usurbil), [Oarsoaldea](${BASE}/zonas/oarsoaldea.html) (Errenteria, Pasaia, Lezo, Oiartzun), [Bidasoa](${BASE}/zonas/bidasoa.html) (Irun, Hondarribia), [Goierri](${BASE}/zonas/goierri.html) (Beasain, Ordizia, Lazkao, Idiazabal, Ataun, Zegama…), [Urola Garaia](${BASE}/zonas/urola-garaia.html) (Zumarraga, Urretxu, Legazpi), [Urola Erdia](${BASE}/zonas/urola-erdia.html) (Azpeitia, Azkoitia), [Urola Kosta](${BASE}/zonas/urola-kosta.html) (Zarautz, Getaria, Zumaia, Orio, Zestoa, Aia), [Debabarrena](${BASE}/zonas/debabarrena.html) (Eibar, Elgoibar, Deba, Mutriku, Soraluze) y [Debagoiena](${BASE}/zonas/debagoiena.html) (Arrasate-Mondragón, Bergara, Oñati, Aretxabaleta, Eskoriatza).

Fuera de Gipuzkoa trabaja a distancia, con el mismo precio: [toda España](${BASE}/diseno-web-negocios-espana.html), [Bizkaia](${BASE}/diseno-web-bizkaia.html), [Álava](${BASE}/diseno-web-alava-araba.html) y [Navarra](${BASE}/diseno-web-navarra.html).
`;
llms = llms.replace(/## Zonas donde trabaja\n[\s\S]*?(?=\n## )/, BLOQUE);
for (const a of ARTICULOS) {
  if (llms.includes(`/${a.slug}.html`)) continue;
  const linea = `- [${a.headline[0].toUpperCase() + a.headline.slice(1)}](${BASE}/${a.slug}.html): ${a.desc}`;
  llms = llms.replace("## Guías\n\n", `## Guías\n\n${linea}\n`);
}
llms = llms.replace("Trabaja en persona en Tolosaldea y en remoto en toda Gipuzkoa.", "Trabaja en persona en Tolosaldea y en remoto en toda Gipuzkoa y el resto de España.");
fs.writeFileSync(path.join(RAIZ, "llms.txt"), llms);

console.log(`sitemap: ${añadidas} entradas nuevas | llms.txt actualizado`);
