// Capturas de una página en móvil y escritorio, por tramos legibles.
// Uso (desde la raíz del repo):
//   node herramientas/diseno/captura.mjs <url> [--anchos 390,1280] [--tramo 1400] [--nombre x] [--oscuro] [--sin-movimiento]
// Baja la página poco a poco antes de capturar (carga las imágenes lazy y dispara las animaciones de scroll).
// Deja PNG en herramientas/diseno/capturas/<nombre>-<ancho>-<n>.png y avisa de errores de consola y desbordes.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith("--") && /^https?:|^file:/.test(a));
if (!url) { console.error("Falta la url"); process.exit(1); }
const opt = (n, d) => { const i = args.indexOf("--" + n); return i >= 0 ? args[i + 1] : d; };
const anchos = opt("anchos", "390,1280").split(",").map(Number);
const tramo = Number(opt("tramo", "0")); // 0 = automático según ancho
const nombre = opt("nombre", new URL(url).pathname.split("/").filter(Boolean).pop()?.replace(/\.html$/, "") || "portada");
const salida = join(dirname(fileURLToPath(import.meta.url)), "capturas");
mkdirSync(salida, { recursive: true });

const browser = await chromium.launch();
for (const ancho of anchos) {
  const movil = ancho < 768;
  const ctx = await browser.newContext({
    viewport: { width: ancho, height: movil ? 844 : 900 },
    deviceScaleFactor: 1,
    isMobile: movil, hasTouch: movil,
    colorScheme: args.includes("--oscuro") ? "dark" : "light",
    reducedMotion: args.includes("--sin-movimiento") ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  const errores = [];
  page.on("console", (m) => m.type() === "error" && errores.push(m.text()));
  page.on("pageerror", (e) => errores.push(String(e)));
  page.on("requestfailed", (r) => errores.push("falla " + r.url()));
  await page.goto(url, { waitUntil: "networkidle" });

  // bajar despacio hasta el final y volver arriba
  await page.evaluate(async () => {
    const paso = innerHeight * 0.6;
    for (let y = 0; y < document.documentElement.scrollHeight; y += paso) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
    scrollTo(0, document.documentElement.scrollHeight); await new Promise((r) => setTimeout(r, 600));
    scrollTo(0, 0); await new Promise((r) => setTimeout(r, 600)); // arriba: las barras fijas salen donde deben
  });
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(800);

  const info = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const desborda = [...document.querySelectorAll("body *")]
      .filter((e) => { const r = e.getBoundingClientRect(); return r.width && (r.right > vw + 1 || r.left < -1) && getComputedStyle(e).position !== "fixed"; })
      .filter((e) => !e.closest("[aria-hidden=true]"))
      .slice(0, 6).map((e) => `${e.tagName.toLowerCase()}.${[...e.classList].join(".")}`);
    const rotas = [...document.images].filter((i) => !i.complete || !i.naturalWidth).map((i) => i.getAttribute("src"));
    const pequenos = [...document.querySelectorAll("a,button,input,select,textarea,[role=button]")]
      .filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.height && (r.height < 24 || r.width < 24); })
      .slice(0, 6).map((e) => `${e.tagName.toLowerCase()} «${(e.textContent || e.getAttribute("aria-label") || "").trim().slice(0, 25)}»`);
    return { alto: document.documentElement.scrollHeight, scrollAncho: document.documentElement.scrollWidth, vw, desborda, rotas, pequenos };
  });
  const t = tramo || (movil ? 1500 : 1100);
  const n = Math.ceil(info.alto / t);
  for (let k = 0; k < n; k++) {
    const y = k * t, h = Math.min(t, info.alto - y);
    const archivo = join(salida, `${nombre}-${ancho}-${k + 1}.png`);
    await page.screenshot({ path: archivo, fullPage: true, clip: { x: 0, y, width: ancho, height: h } });
  }
  console.log(`\n${ancho}px · alto ${info.alto} · ${n} capturas en ${salida}`);
  if (info.scrollAncho > info.vw) console.log(`  ⚠ scroll horizontal: ${info.scrollAncho} > ${info.vw}`);
  if (info.desborda.length) console.log("  ⚠ se salen del ancho:", info.desborda.join(", "));
  if (info.rotas.length) console.log("  ⚠ imágenes sin cargar:", info.rotas.join(", "));
  if (info.pequenos.length) console.log("  · objetivos táctiles < 24px:", info.pequenos.join(", "));
  if (errores.length) console.log("  ⚠ consola:", [...new Set(errores)].slice(0, 6).join(" | "));
  await ctx.close();
}
await browser.close();
