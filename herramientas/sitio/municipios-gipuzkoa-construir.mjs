/**
 * Construye municipios-gipuzkoa.json a partir de la consulta a Wikidata
 * (nombre en euskera y castellano, población, coordenadas) y de la asignación
 * a comarca, que va a mano porque Wikidata mezcla varias clasificaciones.
 *
 * Uso: node herramientas/sitio/municipios-gipuzkoa-construir.mjs <wd.json>
 * wd.json = resultado SPARQL con ?m ?es ?eu ?pop ?coord para Q95010 (Gipuzkoa).
 */
import fs from "node:fs";

const COMARCAS = {
  Tolosaldea: ["Abaltzisketa", "Aduna", "Albiztur", "Alegia", "Alkiza", "Altzo", "Amezketa", "Anoeta", "Asteasu", "Baliarrain", "Belauntza", "Berastegi", "Berrobi", "Bidania-Goiatz", "Elduain", "Gaztelu", "Hernialde", "Ibarra", "Ikaztegieta", "Irura", "Larraul", "Leaburu", "Lizartza", "Orendain", "Orexa", "Tolosa", "Villabona-Amasa", "Zizurkil"],
  Buruntzaldea: ["Andoain", "Urnieta", "Lasarte-Oria"],
  Donostialdea: ["Donostia", "Hernani", "Astigarraga", "Usurbil"],
  Oarsoaldea: ["Errenteria", "Lezo", "Oiartzun", "Pasaia"],
  Bidasoa: ["Irun", "Hondarribia"],
  Goierri: ["Altzaga", "Arama", "Ataun", "Beasain", "Gabiria", "Gaintza", "Idiazabal", "Itsasondo", "Lazkao", "Legorreta", "Mutiloa", "Olaberria", "Ordizia", "Ormaiztegi", "Segura", "Zaldibia", "Zegama", "Zerain"],
  "Urola Garaia": ["Ezkio-Itsaso", "Legazpi", "Urretxu", "Zumarraga"],
  "Urola Erdia": ["Azkoitia", "Azpeitia", "Beizama", "Errezil"],
  "Urola Kosta": ["Aia", "Aizarnazabal", "Getaria", "Orio", "Zarautz", "Zestoa", "Zumaia"],
  Debabarrena: ["Deba", "Eibar", "Elgoibar", "Mendaro", "Mutriku", "Soraluze"],
  Debagoiena: ["Antzuola", "Aretxabaleta", "Arrasate", "Bergara", "Elgeta", "Eskoriatza", "Leintz Gatzaga", "Oñati"],
};
const comarcaDe = {};
for (const [c, ms] of Object.entries(COMARCAS)) for (const m of ms) comarcaDe[m] = c;

/* Municipios que ya tenían página de zona antes de esta ampliación (slug). */
const YA = { Alegia: "alegia", Andoain: "andoain", Anoeta: "anoeta", Arrasate: "arrasate-mondragon", Azpeitia: "azpeitia", Beasain: "beasain", Bergara: "bergara", Donostia: "donostia-san-sebastian", Eibar: "eibar", Errenteria: "errenteria", Hernani: "hernani", Hondarribia: "hondarribia", Ibarra: "ibarra", Irun: "irun", "Lasarte-Oria": "lasarte-oria", Oñati: "onati", Ordizia: "ordizia", "Villabona-Amasa": "villabona", Zarautz: "zarautz", Zumarraga: "zumarraga" };

const slugDe = (n) => n.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ñ/g, "n").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const j = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const por = {};
for (const b of j.results.bindings) {
  const o = (por[b.m.value] ||= { es: b.es?.value, eu: b.eu?.value, pops: [], coord: b.coord?.value });
  if (b.pop) o.pops.push(+b.pop.value);
}
const salida = Object.values(por).map((o) => {
  const [lon, lat] = o.coord.match(/Point\(([-\d.]+) ([-\d.]+)\)/).slice(1).map(Number);
  const eu = o.eu;
  if (!comarcaDe[eu]) throw new Error("sin comarca: " + eu);
  return { eu, es: o.es, slug: YA[eu] || slugDe(eu === "Villabona-Amasa" ? "Villabona" : eu), pob: Math.max(...o.pops), lat: +lat.toFixed(4), lon: +lon.toFixed(4), comarca: comarcaDe[eu], existente: !!YA[eu] };
}).sort((a, b) => a.eu.localeCompare(b.eu));
fs.writeFileSync(new URL("./municipios-gipuzkoa.json", import.meta.url), JSON.stringify(salida, null, 1));
console.log(salida.length, "municipios;", salida.filter((m) => m.existente).length, "con página previa");
