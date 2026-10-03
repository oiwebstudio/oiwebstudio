// Mantiene la biblioteca en 50 referencias "frescas" por sector (31 grupos sacados del CRM) y repone las que se usan.
// Uso (desde la raíz del repo):
//   node herramientas/diseno/reponer-inspiracion.mjs                          → rellena todos los sectores hasta 50
//   node herramientas/diseno/reponer-inspiracion.mjs solo restaurante,dental   → solo esos sectores
//   node herramientas/diseno/reponer-inspiracion.mjs usar <sector> <n|archivo>  → marca una como usada y busca un recambio
// Estado en _local/material/inspiracion/<sector>/biblioteca.json: { disponibles:[...], usadas:[...], vistas:[urls] }.
// Imágenes en _local/material/inspiracion/<sector>/biblioteca/ y tablero numerado en tablero-biblioteca.jpg.
// Fuentes sin iniciar sesión: Pinterest, Landbook, Dribbble, Behance, SiteInspire, Cosmos, Httpster (Savee quitado: casi todo ruido) (repartidas por turnos).
import { chromium } from "playwright";
import sharp from "sharp";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..", "inspiracion");
const OBJETIVO = 50;
// Grupos de sectores sacados del CRM (categorías de captacion, 2/10/2026). En el comentario, las categorías que cubre.
const BUSQUEDAS = {
  restaurante: ["restaurant website design", "seafood restaurant website editorial", "bistro website typography"], // restaurante, sidreria, catering
  "bar-cafeteria": ["cafe website design", "coffee shop website", "cocktail bar website"], // bar, cafeteria, pub
  peluqueria: ["hair salon website design", "barber shop website", "hairdresser website editorial"], // peluqueria, barberia
  estetica: ["beauty studio website", "nail salon website", "spa massage website design"], // estetica, unas, masajes
  taller: ["auto repair shop website", "car garage website design", "mechanic website bold"],
  reformas: ["renovation company website", "construction company website design", "painter decorator website"], // reformas, construccion, pintor, cristalero, toldos, climatizacion
  interiorismo: ["interior design studio website", "furniture store website", "carpentry workshop website"], // interiorismo, muebles, cocinas, arquitecto, carpintero
  academia: ["language school website", "tutoring academy website design", "music school website"], // academia, autoescuela, musica
  electricista: ["electrician website design", "electrical contractor website", "solar installer website"],
  fontaneria: ["plumber website design", "plumbing company website", "locksmith website"], // fontanero, cerrajero
  panaderia: ["bakery website design", "pastry shop website", "patisserie website editorial"], // panaderia, pasteleria
  dental: ["dental clinic website design", "dentist website modern", "orthodontist website"],
  fisioterapia: ["physiotherapy clinic website", "osteopath website design", "podiatry clinic website"], // fisioterapia, osteopata, podologo
  psicologia: ["therapist website design", "psychologist website", "nutritionist website design"], // psicologo, logopeda, nutricionista
  fotografo: ["photographer portfolio website", "wedding photographer website", "photo studio website"],
  gimnasio: ["gym website design", "yoga studio website", "fitness studio website bold"], // gimnasio, yoga, deportes
  "hotel-casa-rural": ["boutique hotel website", "farmhouse guesthouse website", "countryside hotel website editorial"], // hotel, casa rural
  inmobiliaria: ["real estate agency website", "property listing website design", "luxury real estate website"],
  "gestoria-abogados": ["law firm website design", "accounting firm website", "insurance broker website"], // gestoria, abogado, asesoria, seguros
  jardineria: ["landscaping company website", "gardener website design", "flower shop website"], // jardineria, floristeria
  optica: ["optician website design", "eyewear store website", "glasses shop website"],
  "tienda-moda": ["fashion boutique website", "shoe store website", "jewelry store website design"], // ropa, zapateria, joyeria
  libreria: ["bookshop website design", "stationery shop website", "print shop website"], // libreria, papeleria, imprenta
  alimentacion: ["butcher shop website", "greengrocer website", "fishmonger website design"], // carniceria, fruteria, pescaderia, herboristeria
  ferreteria: ["hardware store website", "tool shop website design", "diy store website"],
  mascotas: ["veterinary clinic website", "dog grooming website", "pet care website playful"], // veterinario, peluqueria canina
  limpieza: ["cleaning company website", "dry cleaner website", "moving company website"], // tintoreria, limpieza, mudanzas
  tatuaje: ["tattoo studio website", "tattoo artist website dark", "piercing studio website"],
  bicicletas: ["bike shop website design", "bicycle brand website", "cycling store website"],
  informatica: ["computer repair shop website", "it services website design", "tech repair website"],
  viajes: ["travel agency website design", "tour operator website", "travel website editorial"],
};
const leer = (s) => { const f = join(RAIZ, s, "biblioteca.json"); return existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : { disponibles: [], usadas: [], vistas: [] }; };
const guardar = (s, e) => writeFileSync(join(RAIZ, s, "biblioteca.json"), JSON.stringify(e, null, 1));

const FUENTES = (q) => {
  const e = encodeURIComponent, w = encodeURIComponent(q.split(" ").slice(0, 2).join(" "));
  return [
    ["pinterest", `https://www.pinterest.com/search/pins/?q=${e(q)}`],
    ["landbook", `https://land-book.com/?search=${e(q.split(" ")[0])}`],
    ["dribbble", `https://dribbble.com/search/${w}%20website`],
    ["behance", `https://www.behance.net/search/projects/${w}%20website`],
    ["siteinspire", `https://www.siteinspire.com/websites?search=${e(q.split(" ")[0])}`],
    ["cosmos", `https://www.cosmos.so/search/${w}%20website`],
    ["httpster", `https://httpster.net/?s=${e(q.split(" ")[0])}`],
  ];
};

// Reúne candidatas de todas las búsquedas y fuentes, las reparte por turnos (una de cada fuente) y descarga hasta `cuantas`.
async function buscar(ctx, sector, cuantas, estado) {
  const dir = join(RAIZ, sector, "biblioteca"); mkdirSync(dir, { recursive: true });
  const vistas = new Set(estado.vistas); const porFuente = {};
  const deOtros = new Set(); // lo que ya está en otro sector no entra (suele ser ruido genérico de las galerías)
  for (const o of Object.keys(BUSQUEDAS)) if (o !== sector) for (const x of leer(o).disponibles) deOtros.add(x.src.split("?")[0]);
  for (const q of BUSQUEDAS[sector] ?? [sector + " website design"]) {
    for (const [fuente, url] of FUENTES(q)) {
      const p = await ctx.newPage();
      try {
        await p.goto(url, { waitUntil: "load", timeout: 45000 }); await p.waitForTimeout(3500);
        await p.evaluate(async () => { for (let i = 0; i < 10; i++) { scrollBy(0, 1300); await new Promise((r) => setTimeout(r, 900)); } });
        const imgs = await p.evaluate(() => [...document.images].filter((i) => i.naturalWidth >= 200 && i.naturalHeight >= 200).map((i) => (i.currentSrc || i.src).replace(/\/(236x|474x)\//, "/736x/")));
        for (const src of imgs) if (!vistas.has(src) && !deOtros.has(src.split("?")[0]) && !/avatar|profile|logo/i.test(src)) (porFuente[fuente] ??= []).push({ src, busqueda: q, fuente });
      } catch { console.log("  no se pudo leer", url.slice(0, 70)); }
      await p.close();
    }
  }
  const grupos = Object.values(porFuente).map((l) => [...new Map(l.map((x) => [x.src, x])).values()]);
  const mezcla = [];
  for (let i = 0; grupos.some((l) => l[i]); i++) for (const l of grupos) if (l[i]) mezcla.push(l[i]);
  const nuevas = [];
  for (const x of mezcla) {
    if (nuevas.length >= cuantas) break;
    if (vistas.has(x.src)) continue;
    vistas.add(x.src);
    try {
      const r = await ctx.request.get(x.src); if (!r.ok()) continue;
      const buf = await r.body(); if (buf.length < 20000) continue;
      const archivo = `i${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}.jpg`;
      await sharp(buf).jpeg({ quality: 85 }).toFile(join(dir, archivo));
      nuevas.push({ archivo, src: x.src, fuente: x.fuente, busqueda: x.busqueda, fecha: new Date().toISOString().slice(0, 10) });
    } catch {}
  }
  estado.vistas = [...vistas];
  return nuevas;
}

async function tablero(sector, estado) {
  const dir = join(RAIZ, sector, "biblioteca"); const W = 280, H = 360, cols = 5, comp = [];
  for (const [i, x] of estado.disponibles.entries()) {
    try {
      const t = await sharp(join(dir, x.archivo)).resize(W, H, { fit: "cover", position: "top" })
        .composite([{ input: Buffer.from(`<svg width="${W}" height="36"><rect width="52" height="36" fill="#111"/><text x="8" y="26" font-size="22" font-family="Arial" fill="#fff">${i + 1}</text></svg>`), top: 0, left: 0 }]).toBuffer();
      comp.push({ input: t, left: (i % cols) * W, top: Math.floor(i / cols) * H });
    } catch {}
  }
  if (comp.length) await sharp({ create: { width: cols * W, height: Math.ceil(comp.length / cols) * H, channels: 3, background: "#fff" } }).composite(comp).jpeg({ quality: 80 }).toFile(join(RAIZ, sector, "tablero-biblioteca.jpg"));
}

const [accion, sectorArg, archivoArg] = process.argv.slice(2);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 1600 }, locale: "es-ES", userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36" });
const sectores = accion === "usar" ? [sectorArg] : accion === "solo" ? sectorArg.split(",") : Object.keys(BUSQUEDAS);
for (const s of sectores) {
  mkdirSync(join(RAIZ, s), { recursive: true });
  const e = leer(s);
  if (accion === "usar") {
    const i = e.disponibles.findIndex((x, k) => x.archivo === archivoArg || String(k + 1) === archivoArg);
    if (i < 0) { console.log("No encuentro", archivoArg, "en", s); continue; }
    const [x] = e.disponibles.splice(i, 1); e.usadas.push({ ...x, usada: new Date().toISOString().slice(0, 10) });
    console.log(`${s}: «${x.archivo}» pasa a usadas`);
  }
  const faltan = OBJETIVO - e.disponibles.length;
  if (faltan > 0) { const n = await buscar(ctx, s, faltan, e); e.disponibles.push(...n); }
  guardar(s, e); await tablero(s, e);
  console.log(`${s}: ${e.disponibles.length} disponibles · ${e.usadas.length} usadas`);
}
await b.close();
