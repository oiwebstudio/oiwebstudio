// Capturas para una página de caso real del portfolio (web/assets/<clave>-*.{jpg,webp} y web/assets/<clave>/).
// Uso (desde la raíz del repo):
//   node herramientas/diseno/capturas-caso.mjs <url> <clave> [seccion:nombre ...]
// Ejemplo: node herramientas/diseno/capturas-caso.mjs https://aberricasarural.com/ aberri reservas:web-reserva fotos:web-galeria
// Hace: portada en ordenador (1440x900) y en móvil (390x844 a 1,5x), y cada sección indicada por su id,
// en ordenador y en móvil. Recorre la página antes para disparar las animaciones de entrada.
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const [url, clave, ...secciones] = process.argv.slice(2);
if (!url || !clave) { console.error("Uso: capturas-caso.mjs <url> <clave> [id:nombre ...]"); process.exit(1); }
const ASSETS = resolve("web/assets");
const DIR = join(ASSETS, clave);
mkdirSync(DIR, { recursive: true });

async function guardar(png, base, ancho) {
  const img = sharp(png).resize({ width: ancho, withoutEnlargement: true });
  await img.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(base + ".jpg");
  await img.clone().webp({ quality: 80 }).toFile(base + ".webp");
  const m = await sharp(base + ".jpg").metadata();
  console.log("  ", base.replace(ASSETS, "assets"), `${m.width}x${m.height}`);
}

async function recorrer(page) {
  const alto = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < alto; y += 500) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(120); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(900);
}

const browser = await chromium.launch();
for (const [modo, vp, dpr, anchoFinal] of [["desk", { width: 1440, height: 900 }, 1, 1440], ["mobile", { width: 390, height: 844 }, 1.5, 585]]) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: dpr, isMobile: modo === "mobile", hasTouch: modo === "mobile", locale: "es-ES" });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  // fuera avisos de cookies o similares que tapen la captura
  await page.addStyleTag({ content: "#cursor{display:none!important}" }).catch(() => {});
  await recorrer(page);
  await page.waitForTimeout(1200);
  await guardar(await page.screenshot(), join(ASSETS, `${clave}-${modo}`), anchoFinal);
  for (const s of secciones) {
    const [id, nombre] = s.split(":");
    const el = page.locator("#" + id).first();
    if (!(await el.count())) { console.log("   (no existe #" + id + ")"); continue; }
    await el.evaluate((n) => n.scrollIntoView({ block: "start" }));
    await page.waitForTimeout(1400);
    await guardar(await page.screenshot(), join(DIR, `${nombre}${modo === "mobile" ? "-movil" : ""}`), anchoFinal);
  }
  await ctx.close();
}
await browser.close();
