// Auditoría de una demo antes de enseñarla: accesibilidad (axe-core, WCAG 2.2 AA), contraste real por secciones
// (herramientas/auditoria/auditoria-visual.js), movimiento (reduced motion, contenido que se queda oculto, transiciones caras),
// foco con teclado y peso de la página.
// Uso (desde la raíz del repo):
//   node herramientas/diseno/auditar.mjs <url> [--nombre x] [--anchos 390,1280]
// Deja el detalle en herramientas/diseno/informes/<nombre>.json y un resumen en la consola.
import { chromium } from "playwright";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const aqui = dirname(fileURLToPath(import.meta.url));
const axeFuente = readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");
const visualFuente = readFileSync(join(aqui, "../../herramientas/auditoria/auditoria-visual.js"), "utf8");

const args = process.argv.slice(2);
const url = args.find((a) => /^https?:|^file:/.test(a));
if (!url) { console.error("Falta la url"); process.exit(1); }
const opt = (n, d) => { const i = args.indexOf("--" + n); return i >= 0 ? args[i + 1] : d; };
const nombre = opt("nombre", new URL(url).pathname.split("/").filter(Boolean).filter((p) => p !== "index.html").pop()?.replace(/\.html$/, "") || "portada");
const anchos = opt("anchos", "390,1280").split(",").map(Number);

async function bajarDespacio(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.5) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); }
    scrollTo(0, document.documentElement.scrollHeight); await new Promise((r) => setTimeout(r, 1200));
  });
}

// texto que sigue invisible (animaciones de entrada que no llegan a dispararse). Dos pasadas: al final de la página
// se apuntan los candidatos; después cada uno se centra en pantalla, se espera y se vuelve a medir. Así no cuenta
// lo que se desvanece a propósito al dejarlo atrás (la portada) ni lo que aún no había entrado.
async function ocultos(page) {
  const n = await page.evaluate(() => {
    let k = 0;
    for (const e of document.querySelectorAll("main *, body > section *, footer *")) {
      const t = [...e.childNodes].some((x) => x.nodeType === 3 && x.textContent.trim().length > 2);
      if (!t || e.closest("[aria-hidden=true],[hidden],dialog:not([open]),[inert]")) continue;
      const r = e.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      let x = e, op = 1;
      while (x && x !== document.body) { const cs = getComputedStyle(x); op *= +cs.opacity; if (cs.visibility === "hidden") op = 0; x = x.parentElement; }
      if (op < 0.1 && k < 40) e.dataset.auditarOculto = k++;
    }
    return k;
  });
  const fuera = [];
  for (let i = 0; i < n; i++) {
    await page.evaluate((i) => document.querySelector(`[data-auditar-oculto="${i}"]`).scrollIntoView({ block: "center", inline: "center" }), i);
    await page.waitForTimeout(1500); // hay entradas con retardo (el sello de CVS: 500 ms + 380 ms)
    const f = await page.evaluate((i) => {
      const e = document.querySelector(`[data-auditar-oculto="${i}"]`);
      let x = e, op = 1;
      while (x && x !== document.body) { const cs = getComputedStyle(x); op *= +cs.opacity; if (cs.visibility === "hidden") op = 0; x = x.parentElement; }
      return op < 0.1 ? `${e.tagName.toLowerCase()}.${[...e.classList].join(".")} «${e.textContent.trim().slice(0, 30)}»` : null;
    }, i);
    if (f) fuera.push(f);
  }
  return [...new Set(fuera)].slice(0, 8);
}

// fotos o bloques con un revelado por clip-path que nunca se dispara. Caso real (CVS v3, 2/10/2026): Chrome cuenta
// el clip-path del propio elemento en IntersectionObserver, así que un elemento recortado a cero nunca «entra».
async function recortes(page) {
  const n = await page.evaluate(() => {
    let k = 0;
    for (const e of document.querySelectorAll("body *")) {
      const c = getComputedStyle(e).clipPath, r = e.getBoundingClientRect();
      if (r.width > 20 && r.height > 20 && /inset\(/.test(c) && /100%/.test(c) && k < 15) e.dataset.auditarRecorte = k++;
    }
    return k;
  });
  const malos = [];
  for (let i = 0; i < n; i++) {
    await page.evaluate((i) => document.querySelector(`[data-auditar-recorte="${i}"]`).scrollIntoView({ block: "center" }), i);
    await page.waitForTimeout(1500);
    const m = await page.evaluate((i) => { const e = document.querySelector(`[data-auditar-recorte="${i}"]`); return /100%/.test(getComputedStyle(e).clipPath) ? `${e.tagName.toLowerCase()}.${[...e.classList].join(".")}` : null; }, i);
    if (m) malos.push(m);
  }
  return [...new Set(malos)];
}

const informe = { url, fecha: new Date().toISOString(), anchos: {} };
const browser = await chromium.launch();
for (const ancho of anchos) {
  const movil = ancho < 768;
  const r = (informe.anchos[ancho] = {});
  const ctx = await browser.newContext({ viewport: { width: ancho, height: movil ? 844 : 900 }, isMobile: movil, hasTouch: movil });
  const page = await ctx.newPage();
  const errores = [];
  page.on("pageerror", (e) => errores.push(String(e).slice(0, 160)));
  page.on("console", (m) => m.type() === "error" && errores.push(m.text().slice(0, 160)));
  page.on("requestfailed", (q) => errores.push("no carga: " + q.url().slice(0, 120)));
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(1500);

  // rendimiento (sin limitar la red: el LCP real en 4G será peor; vale para comparar demos entre sí)
  r.rendimiento = await page.evaluate(async () => {
    const lcp = await new Promise((res) => { new PerformanceObserver((l) => res(l.getEntries().at(-1)?.startTime || 0)).observe({ type: "largest-contentful-paint", buffered: true }); setTimeout(() => res(0), 1500); });
    const cls = await new Promise((res) => { let s = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) s += e.value; }).observe({ type: "layout-shift", buffered: true }); setTimeout(() => res(s), 500); });
    const recursos = performance.getEntriesByType("resource").map((e) => ({ url: e.name.split("/").pop().slice(0, 60), kb: Math.round((e.transferSize || e.encodedBodySize || 0) / 1024), tipo: e.initiatorType }));
    const nav = performance.getEntriesByType("navigation")[0];
    const html = Math.round((nav?.transferSize || nav?.encodedBodySize || 0) / 1024);
    return { lcpMs: Math.round(lcp), cls: +cls.toFixed(3), totalKb: html + recursos.reduce((s, x) => s + x.kb, 0), pesados: recursos.sort((a, b) => b.kb - a.kb).slice(0, 5) };
  });

  // foco con teclado: los 20 primeros tabuladores
  r.foco = await (async () => {
    const sinFoco = [], invisibles = [];
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press("Tab");
      const medir = () => page.evaluate(() => {
        const e = document.activeElement; if (!e || e === document.body) return null;
        const cs = getComputedStyle(e), rc = e.getBoundingClientRect();
        const marca = (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== "none";
        let x = e, op = 1;
        while (x && x !== document.body) { const c = getComputedStyle(x); op *= +c.opacity; if (c.visibility === "hidden") op = 0; x = x.parentElement; }
        const dentro = rc.bottom > 0 && rc.top < innerHeight && rc.right > 0 && rc.left < innerWidth;
        return { q: `${e.tagName.toLowerCase()} «${(e.textContent || e.getAttribute("aria-label") || e.name || "").trim().slice(0, 24)}»`, marca, visible: rc.width > 1 && rc.height > 1 && op > 0.1 && dentro };
      });
      let f = await medir();
      if (f && !f.visible) { await page.waitForTimeout(900); f = await medir(); } // dar tiempo a las animaciones de entrada
      if (!f) break;
      if (!f.marca) sinFoco.push(f.q);
      if (!f.visible) invisibles.push(f.q);
    }
    return { sinFoco: [...new Set(sinFoco)].slice(0, 6), invisibles: [...new Set(invisibles)].slice(0, 6) };
  })();

  await bajarDespacio(page);
  r.ocultos = await ocultos(page);
  r.recortes = await recortes(page);

  // movimiento: transiciones de «all» o de propiedades que recalculan la maquetación, y si se respeta reduced motion
  r.movimiento = await page.evaluate(() => {
    const all = new Set(), caras = new Set(), largas = new Set();
    let reduce = false;
    const caro = /(^|,\s*)(width|height|top|left|right|bottom|margin[\w-]*|padding[\w-]*)(\s|,|$)/;
    const recorrer = (reglas) => {
      for (const x of reglas) {
        if (x.media && /prefers-reduced-motion/.test(x.media.mediaText)) reduce = true;
        if (x.cssRules && !x.style) { recorrer(x.cssRules); continue; }
        if (!x.style) continue;
        const prop = x.style.transitionProperty, dur = x.style.transitionDuration;
        if (!dur || dur.split(",").every((d) => parseFloat(d) === 0)) continue;
        if (!prop || prop === "all" || /(^|,\s*)all(,|$)/.test(prop)) all.add(x.selectorText);
        if (prop && caro.test(prop)) caras.add(`${x.selectorText} (${prop})`);
        if (dur.split(",").some((d) => parseFloat(d) * (d.includes("ms") ? 1 : 1000) > 600)) largas.add(`${x.selectorText} (${dur})`);
        if (x.cssRules) recorrer(x.cssRules);
      }
    };
    for (const h of document.styleSheets) { try { recorrer(h.cssRules); } catch { /* hoja de otro dominio */ } }
    const scripts = [...document.scripts].map((s) => s.textContent).join("\n");
    if (/prefers-reduced-motion/.test(scripts)) reduce = true;
    const hayMovimiento = document.getAnimations().length > 0 || !!window.gsap || /@keyframes|animation/.test([...document.styleSheets].map((h) => { try { return [...h.cssRules].map((c) => c.cssText).join(""); } catch { return ""; } }).join(""));
    return { hayMovimiento, respetaReduce: reduce, transicionAll: [...all].slice(0, 6), propiedadesCaras: [...caras].slice(0, 6), largas: [...largas].slice(0, 6), gsap: window.gsap?.version || null };
  });

  // contraste real y zonas táctiles (la auditoría visual de scripts/)
  try { r.visual = JSON.parse(await page.evaluate(visualFuente)); } catch (e) { r.visual = { error: String(e).slice(0, 120) }; }

  // axe-core: WCAG 2.0/2.1/2.2 A y AA + buenas prácticas
  await page.addScriptTag({ content: axeFuente });
  const axe = await page.evaluate(async () => {
    const res = await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] }, resultTypes: ["violations"] });
    return res.violations.map((v) => ({ id: v.id, impacto: v.impact, ayuda: v.help, n: v.nodes.length, donde: v.nodes.slice(0, 3).map((n) => n.target.join(" ")) }));
  });
  const orden = { critical: 0, serious: 1, moderate: 2, minor: 3 };
  r.axe = axe.sort((a, b) => orden[a.impacto] - orden[b.impacto]);

  // con reduced motion: nada debe quedarse oculto
  const ctxR = await browser.newContext({ viewport: { width: ancho, height: movil ? 844 : 900 }, isMobile: movil, hasTouch: movil, reducedMotion: "reduce" });
  const pR = await ctxR.newPage();
  await pR.goto(url, { waitUntil: "load" }); await pR.waitForTimeout(1000);
  await bajarDespacio(pR);
  r.ocultosConReduce = await ocultos(pR);
  await ctxR.close();

  r.errores = [...new Set(errores)].slice(0, 8);
  await ctx.close();
}
await browser.close();

const dir = join(aqui, "informes"); mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, `${nombre}.json`), JSON.stringify(informe, null, 2));

// ── resumen ──
const icono = { critical: "✗✗", serious: "✗ ", moderate: "· ", minor: "  " };
console.log(`\nAUDITORÍA · ${url}`);
let fallos = 0;
for (const [ancho, r] of Object.entries(informe.anchos)) {
  console.log(`\n── ${ancho}px ──`);
  const p = r.rendimiento;
  console.log(`Peso ${p.totalKb} KB · LCP ${p.lcpMs} ms (sin limitar la red) · CLS ${p.cls}${p.cls > 0.1 ? "  ✗ > 0,1" : ""}`);
  if (p.totalKb > 1500) console.log(`  ✗ página pesada; lo que más pesa: ${p.pesados.map((x) => `${x.url} ${x.kb} KB`).join(", ")}`);
  if (r.axe.length) { console.log("Accesibilidad (axe):"); for (const v of r.axe) { console.log(`  ${icono[v.impacto]}${v.id} ×${v.n} — ${v.ayuda}  [${v.donde[0]}]`); if (v.impacto === "critical" || v.impacto === "serious") fallos++; } }
  else console.log("Accesibilidad (axe): sin fallos");
  const v = r.visual;
  if (v && !v.error) {
    if (v.contraste) console.log(`  ✗ contraste real bajo en ${v.contraste} textos: ${v.malos.join(" | ")}`);
    if (v.tactil) console.log(`  · ${v.tactil} zonas táctiles < 44 px (ej.: ${v.chicos.join(", ")})`);
    if (v.seguidas?.length) console.log(`  · secciones oscuras seguidas: ${v.seguidas.join(", ")}`);
    if (v.h1 !== 1) console.log(`  ✗ ${v.h1} h1 (debe haber uno)`);
    if (v.sinMedir?.length) console.log(`  · sin medir (texto sobre foto, revisar a ojo): ${v.sinMedir.join(", ")}`);
  }
  if (r.foco.sinFoco.length) { console.log(`  ✗ sin foco visible con teclado: ${r.foco.sinFoco.join(", ")}`); fallos++; }
  if (r.foco.invisibles.length) console.log(`  ✗ el foco cae en algo invisible: ${r.foco.invisibles.join(", ")}`);
  if (r.ocultos.length) { console.log(`  ✗ texto que sigue oculto tras bajar toda la página: ${r.ocultos.join(", ")}`); fallos++; }
  if (r.recortes.length) { console.log(`  ✗ revelado por clip-path que nunca aparece (no observar el elemento recortado, sino su contenedor): ${r.recortes.join(", ")}`); fallos++; }
  if (r.ocultosConReduce.length) { console.log(`  ✗ con «reducir movimiento» se queda oculto: ${r.ocultosConReduce.join(", ")}`); fallos++; }
  const m = r.movimiento;
  if (m.hayMovimiento && !m.respetaReduce) { console.log("  ✗ hay animaciones y no se respeta prefers-reduced-motion"); fallos++; }
  if (m.transicionAll.length) console.log(`  · transition: all en ${m.transicionAll.join(", ")} (mejor nombrar transform/opacity)`);
  if (m.propiedadesCaras.length) console.log(`  · se animan propiedades de maquetación: ${m.propiedadesCaras.join(", ")}`);
  if (m.largas.length) console.log(`  · transiciones de más de 600 ms: ${m.largas.join(", ")}`);
  if (r.errores.length) console.log(`  ✗ errores: ${r.errores.join(" | ")}`);
}
console.log(`\n${fallos ? `${fallos} problemas importantes` : "Sin problemas importantes"} · detalle en ${join("herramientas/diseno/informes", nombre + ".json")}`);
