// Fotografía cada sección (hijos directos de <main>, más header y footer) de una o varias demos, a 1280 px y sin
// animaciones, para montar el catálogo de composiciones (_local/material/disenos/).
// Uso (desde la raíz del repo): node herramientas/diseno/secciones.mjs <nombre>=<url> [<nombre>=<url> ...]
// Deja _local/material/disenos/secciones/<nombre>-<n>.jpg y añade/actualiza _local/material/disenos/secciones.json.
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..", "disenos");
const SAL = join(RAIZ, "secciones"); mkdirSync(SAL, { recursive: true });
const fj = join(RAIZ, "secciones.json");
const datos = existsSync(fj) ? JSON.parse(readFileSync(fj, "utf8")) : {};
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
for (const arg of process.argv.slice(2)) {
  const [nombre, url] = arg.split(/=(.*)/s);
  try {
    await p.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } scrollTo(0, 0); });
    await p.waitForTimeout(800);
    const cajas = await p.evaluate(() => {
      const el = [...document.querySelectorAll("body > header, main > *, body > section, body > footer, body > .pie, body > div.banda")]
        .filter((e) => { const r = e.getBoundingClientRect(); return r.height > 160 && getComputedStyle(e).display !== "none" && getComputedStyle(e).position !== "fixed"; });
      return el.map((e) => { const r = e.getBoundingClientRect(); return { x: 0, y: r.top + scrollY, h: Math.min(r.height, 1500), id: e.id || e.className.toString().split(" ")[0] || e.tagName.toLowerCase() }; });
    });
    datos[nombre] = { url, secciones: [] };
    for (const [i, c] of cajas.entries()) {
      const archivo = `${nombre}-${i + 1}.jpg`;
      const buf = await p.screenshot({ clip: { x: 0, y: c.y, width: 1280, height: c.h }, fullPage: true });
      await sharp(buf).resize(960).jpeg({ quality: 78 }).toFile(join(SAL, archivo));
      datos[nombre].secciones.push({ archivo, id: c.id, alto: Math.round(c.h) });
    }
    console.log("✓", nombre, cajas.length, "secciones");
  } catch (e) { console.log("✗", nombre, String(e).slice(0, 100)); }
}
writeFileSync(fj, JSON.stringify(datos, null, 1));
await b.close();
