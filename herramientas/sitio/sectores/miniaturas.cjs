// Capturas de la pieza «¿Qué negocio tienes?» para cada muestra nueva, iguales en tamaño a las de siempre:
//   web/assets/<id>-desk.webp y .jpg  (1800×1124, ventana de 1440×900 a 1,25)
//   web/assets/hero/<id>-m.webp       (480×1013, móvil de 390 a 2× reducido)
// Sirve web/ en un puerto local propio y usa el navegador común (turno, sin GPU). Captura la versión en castellano (es/).
// Uso: node herramientas/sitio/sectores/miniaturas.cjs [--solo malda,lauza] [--forzar]
const { conNavegador } = require("C:/tmp/oi-navegador.cjs");
const http = require("http");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { nuevos } = require("./textos.cjs");

const WEB = path.resolve(__dirname, "../../../web");
const ASSETS = path.join(WEB, "assets");
const i = process.argv.indexOf("--solo");
const solo = i > 0 ? process.argv[i + 1].split(",") : null;
const forzar = process.argv.includes("--forzar");
// Tarjetas de la galería «todas las muestras» (assets/sx/<id>-c.webp, 640×400): salen de la captura de ordenador, para todos los sectores
async function tarjetas() {
  fs.mkdirSync(path.join(ASSETS, "sx"), { recursive: true });
  const todos = [...JSON.parse(fs.readFileSync(path.join(__dirname, "existentes.json"), "utf8")), ...nuevos()];
  for (const s of todos) {
    const desde = path.join(ASSETS, `${s.id}-desk.webp`), a = path.join(ASSETS, "sx", `${s.id}-c.webp`);
    if (!fs.existsSync(desde) || (fs.existsSync(a) && !forzar && fs.statSync(a).mtimeMs > fs.statSync(desde).mtimeMs)) continue;
    await sharp(desde).resize(640, 400, { fit: "cover", position: "top" }).webp({ quality: 78 }).toFile(a);
    console.log("tarjeta", s.id, Math.round(fs.statSync(a).size / 1024) + " KB");
  }
}
const lista = nuevos().filter((s) => (!solo || solo.includes(s.id)) && (forzar || !fs.existsSync(path.join(ASSETS, `${s.id}-desk.webp`))));
if (!lista.length) { console.log("Nada que capturar (usa --forzar para rehacer)."); tarjetas().then(() => process.exit(0)); return; }

const TIPOS = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif",
  ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".mp4": "video/mp4", ".webm": "video/webm", ".ico": "image/x-icon" };
const servidor = http.createServer((req, res) => {
  let f = path.join(WEB, decodeURIComponent(req.url.split("?")[0]));
  if (!f.startsWith(WEB)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": TIPOS[path.extname(f).toLowerCase()] || "application/octet-stream" });
  fs.createReadStream(f).pipe(res);
});

servidor.listen(0, "127.0.0.1", () => {
  const base = `http://127.0.0.1:${servidor.address().port}`;
  conNavegador(async (b) => {
    for (const s of lista) {
      const url = `${base}/demos/muestras/${s.carpeta}/es/`;
      // Ordenador
      const cd = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.25, locale: "es-ES", timezoneId: "Europe/Madrid" });
      const pd = await cd.newPage();
      await pd.goto(url, { waitUntil: "networkidle", timeout: 90000 });
      await pd.evaluate(() => document.fonts && document.fonts.ready);
      await pd.waitForTimeout(3500);
      const bufD = await pd.screenshot({ type: "png" });
      await cd.close();
      const d = sharp(bufD).resize(1800, 1125, { fit: "cover", position: "top" }).extract({ left: 0, top: 0, width: 1800, height: 1124 });
      await d.clone().webp({ quality: 80 }).toFile(path.join(ASSETS, `${s.id}-desk.webp`));
      await d.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(ASSETS, `${s.id}-desk.jpg`));
      // Móvil
      const cm = await b.newContext({ viewport: { width: 390, height: 823 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: "es-ES", timezoneId: "Europe/Madrid" });
      const pm = await cm.newPage();
      await pm.goto(url, { waitUntil: "networkidle", timeout: 90000 });
      await pm.evaluate(() => document.fonts && document.fonts.ready);
      await pm.waitForTimeout(3500);
      const bufM = await pm.screenshot({ type: "png" });
      await cm.close();
      await sharp(bufM).resize(480, 1013, { fit: "cover", position: "top" }).webp({ quality: 80 }).toFile(path.join(ASSETS, "hero", `${s.id}-m.webp`));
      const kb = (f) => Math.round(fs.statSync(f).size / 1024) + " KB";
      console.log(s.id, "desk", kb(path.join(ASSETS, `${s.id}-desk.webp`)), kb(path.join(ASSETS, `${s.id}-desk.jpg`)), "· móvil", kb(path.join(ASSETS, "hero", `${s.id}-m.webp`)));
    }
  }, "miniaturas sectores").then(tarjetas).then(() => servidor.close()).catch((e) => { console.error(e); servidor.close(); process.exit(1); });
});
