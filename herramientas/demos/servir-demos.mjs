/**
 * Servidor estático mínimo para ver las demos como las verá el cliente.
 * El navegador bloquea el JS de los ficheros abiertos con file://, así que sin
 * esto no se puede comprobar que el menú del día se pinta solo.
 *
 *   node herramientas/demos/servir-demos.mjs      → http://localhost:4399/clientes/<slug>/
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";

const RAIZ = path.resolve("web/demos");
const TIPO = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg" };

createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  const f = path.join(RAIZ, p);
  if (!f.startsWith(RAIZ)) { res.writeHead(403).end("no"); return; }
  try {
    const cuerpo = await readFile(f);
    res.writeHead(200, { "Content-Type": TIPO[path.extname(f)] ?? "application/octet-stream" }).end(cuerpo);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("No está: " + p);
  }
}).listen(4399, () => console.log("Demos en http://localhost:4399/clientes/"));
