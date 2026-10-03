// Busca fotos libres para una demo y las descarga con su crédito.
// Fuentes: Unsplash (clave en _local/claves.env), Pixabay (si hay clave) y Openverse (sin clave: CC0/dominio público).
// Uso (desde la raíz del repo):
//   node herramientas/diseno/fotos.mjs "<búsqueda en inglés>" <carpeta-salida> [--n 12] [--vertical|--horizontal]
// Deja r1.jpg…, creditos.json (autor, licencia, enlace) y hoja.jpg (numerada) para elegir.
// Unsplash pide avisar de la descarga (download_location) y citar al autor: el crédito va en creditos.json.
import sharp from "sharp";
import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const claves = {};
const fc = join(raiz, "claves.env");
if (existsSync(fc)) for (const l of readFileSync(fc, "utf8").split(/\r?\n/)) { const m = l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/); if (m) claves[m[1]] = m[2]; }
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf("--" + n); return i >= 0 ? args[i + 1] : d; };
const [q, salida] = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--n");
if (!q || !salida) { console.error('Uso: fotos.mjs "<búsqueda>" <carpeta-salida> [--n 12] [--vertical|--horizontal]'); process.exit(1); }
const n = Number(opt("n", 12));
const ori = args.includes("--vertical") ? "portrait" : args.includes("--horizontal") ? "landscape" : "";
mkdirSync(salida, { recursive: true });

const res = [];
if (claves.UNSPLASH_ACCESS_KEY) {
  const u = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=${n}${ori ? "&orientation=" + ori : ""}`;
  const r = await fetch(u, { headers: { Authorization: "Client-ID " + claves.UNSPLASH_ACCESS_KEY, "Accept-Version": "v1" } });
  if (r.ok) for (const x of (await r.json()).results) res.push({ fuente: "unsplash", url: x.urls.raw + "&w=2000&q=82&fm=jpg", aviso: x.links.download_location, autor: x.user.name, enlace: x.links.html + "?utm_source=oi_studio&utm_medium=referral", licencia: "Unsplash License", alt: x.alt_description || "" });
  else console.log("Unsplash:", r.status, await r.text());
}
if (claves.PIXABAY_KEY) {
  const r = await fetch(`https://pixabay.com/api/?key=${claves.PIXABAY_KEY}&q=${encodeURIComponent(q)}&image_type=photo&per_page=${Math.max(3, n)}${ori ? "&orientation=" + (ori === "portrait" ? "vertical" : "horizontal") : ""}`);
  if (r.ok) for (const x of (await r.json()).hits) res.push({ fuente: "pixabay", url: x.largeImageURL, autor: x.user, enlace: x.pageURL, licencia: "Pixabay Content License", alt: x.tags });
}
{
  const r = await fetch(`https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&page_size=${n}&license=cc0,pdm${ori ? "&aspect_ratio=" + (ori === "portrait" ? "tall" : "wide") : ""}`);
  if (r.ok) for (const x of (await r.json()).results) res.push({ fuente: "openverse", url: x.url, autor: x.creator || "", enlace: x.foreign_landing_url, licencia: x.license.toUpperCase(), alt: x.title || "" });
}
// reparto por fuentes
const g = {}; for (const x of res) (g[x.fuente] ??= []).push(x);
const mezcla = []; for (let i = 0; mezcla.length < res.length; i++) for (const k in g) if (g[k][i]) mezcla.push(g[k][i]);
const ok = [];
for (const x of mezcla) {
  if (ok.length >= n * 2) break;
  try {
    const r = await fetch(x.url, { headers: { "User-Agent": "OIStudio/1.0" } }); if (!r.ok) continue;
    const buf = Buffer.from(await r.arrayBuffer()); if (buf.length < 15000) continue;
    const archivo = `r${ok.length + 1}.jpg`;
    await sharp(buf).rotate().resize({ width: 2000, withoutEnlargement: true }).jpeg({ quality: 86 }).toFile(join(salida, archivo));
    if (x.aviso) fetch(x.aviso, { headers: { Authorization: "Client-ID " + claves.UNSPLASH_ACCESS_KEY } }).catch(() => {});
    ok.push({ n: ok.length + 1, archivo, ...x, aviso: undefined });
  } catch {}
}
writeFileSync(join(salida, "creditos.json"), JSON.stringify(ok, null, 1));
const W = 300, H = 300, cols = 6;
const comp = await Promise.all(ok.map(async (x, i) => ({ input: await sharp(join(salida, x.archivo)).resize(W, H, { fit: "cover" }).composite([{ input: Buffer.from(`<svg width="${W}" height="30"><rect width="${W}" height="30" fill="#111" opacity=".75"/><text x="8" y="21" font-size="16" font-family="Arial" fill="#fff">${x.n} · ${x.fuente}</text></svg>`), top: 0, left: 0 }]).toBuffer(), left: (i % cols) * W, top: Math.floor(i / cols) * H })));
if (comp.length) await sharp({ create: { width: cols * W, height: Math.ceil(comp.length / cols) * H, channels: 3, background: "#fff" } }).composite(comp).jpeg({ quality: 80 }).toFile(join(salida, "hoja.jpg"));
console.log(`${ok.length} fotos (${Object.entries(g).map(([k, v]) => k + " " + v.length).join(", ")}) → ${join(salida, "hoja.jpg")}`);
