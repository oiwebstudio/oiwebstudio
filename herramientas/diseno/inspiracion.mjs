// Biblioteca de inspiración: busca referencias de un sector en Pinterest (sin iniciar sesión: los resultados cargan
// detrás del aviso) y en Landbook (webs reales), las guarda numeradas y monta un tablero para elegir.
// Uso (desde la raíz del repo):
//   node herramientas/diseno/inspiracion.mjs <sector> "<búsqueda en inglés>" ["<otra búsqueda>" ...] [--max 40]
//   p. ej.: node herramientas/diseno/inspiracion.mjs restaurante "seafood restaurant website design" "coastal restaurant web design"
// Deja en _local/material/inspiracion/<sector>/<fecha>/: r1.jpg… , lista.json (origen de cada una) y tablero.jpg (numerado).
// Lo que Oier elige y por qué se apunta en _local/material/inspiracion/gusto.md: es lo que hace que cada demo aprenda de la anterior.
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const iMax = args.indexOf("--max");
const max = iMax >= 0 ? Number(args[iMax + 1]) : 40;
const [sector, ...busquedas] = args.filter((a, i) => !a.startsWith("--") && !(iMax >= 0 && i === iMax + 1));
if (!sector || !busquedas.length) { console.error('Uso: inspiracion.mjs <sector> "<búsqueda>" [...]'); process.exit(1); }
const fecha = new Date().toISOString().slice(0, 10);
const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "inspiracion", sector, fecha);
mkdirSync(dir, { recursive: true });

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
const fuentes = busquedas.flatMap(FUENTES);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 1600 }, locale: "es-ES", userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36" });
const vistos = new Set(), todas = [];
for (const [fuente, url] of fuentes) {
  const p = await ctx.newPage();
  try {
    await p.goto(url, { waitUntil: "load", timeout: 45000 }); await p.waitForTimeout(4000);
    await p.evaluate(async () => { for (let i = 0; i < 5; i++) { scrollBy(0, 1200); await new Promise((r) => setTimeout(r, 900)); } });
    const imgs = await p.evaluate((fuente) => [...document.images].filter((i) => i.naturalWidth >= 200 && i.naturalHeight >= 200).map((i) => {
      let src = i.currentSrc || i.src; if (fuente === "pinterest") src = src.replace(/\/(236x|474x)\//, "/736x/");
      const a = i.closest("a"); return { src, alt: (i.alt || "").slice(0, 160), enlace: a ? a.href : "" };
    }), fuente);
    for (const x of imgs) if (!vistos.has(x.src) && !/avatar|profile|logo/i.test(x.src)) { vistos.add(x.src); todas.push({ fuente, busqueda: url, ...x }); }
  } catch (e) { console.log("no se pudo leer", url, String(e).slice(0, 60)); }
  await p.close();
}
// reparto: una de cada fuente por turno, para que no se coma todo la primera
const porFuente = {}; for (const x of todas) (porFuente[x.fuente] ??= []).push(x);
const mezcla = []; for (let i = 0; mezcla.length < todas.length; i++) for (const g of Object.values(porFuente)) if (g[i]) mezcla.push(g[i]);
todas.splice(0, todas.length, ...mezcla);
const lista = [];
for (const x of todas) {
  if (lista.length >= max) break;
  try {
    const r = await ctx.request.get(x.src); if (!r.ok()) continue;
    const buf = await r.body(); if (buf.length < 15000) continue;
    const n = lista.length + 1; const archivo = `r${n}.jpg`;
    await sharp(buf).jpeg({ quality: 85 }).toFile(join(dir, archivo));
    lista.push({ n, archivo, ...x });
  } catch { /* imagen rota: se salta */ }
}
await b.close();
writeFileSync(join(dir, "lista.json"), JSON.stringify(lista, null, 1));

// tablero numerado
const W = 300, H = 380, cols = 5, comp = [];
for (const [i, x] of lista.entries()) {
  const t = await sharp(join(dir, x.archivo)).resize(W, H, { fit: "cover", position: "top" })
    .composite([{ input: Buffer.from(`<svg width="${W}" height="40"><rect width="56" height="40" fill="#111"/><text x="8" y="28" font-size="24" font-family="Arial" fill="#fff">${x.n}</text></svg>`), top: 0, left: 0 }]).toBuffer();
  comp.push({ input: t, left: (i % cols) * W, top: Math.floor(i / cols) * H });
}
await sharp({ create: { width: cols * W, height: Math.ceil(lista.length / cols) * H, channels: 3, background: "#fff" } }).composite(comp).jpeg({ quality: 82 }).toFile(join(dir, "tablero.jpg"));
console.log(`${lista.length} referencias de «${sector}» → ${join(dir, "tablero.jpg")}`);
