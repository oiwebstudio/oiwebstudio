// Una sola vez (8/11/2026): saca los 8 sectores que ya estaban en la pieza «¿Qué negocio tienes?»
// de web/index.html y su euskera de assets/i18n.js, y los deja en existentes.json.
// Uso: node herramientas/sitio/sectores/extraer-existentes.cjs (desde la raíz del repo)
const fs = require("fs");
const path = require("path");
const RAIZ = path.resolve(__dirname, "../../..");
const h = fs.readFileSync(path.join(RAIZ, "web/index.html"), "utf8");
const a = h.indexOf('<section class="l3 sv sx" id="tu-sector"');
const s = h.slice(a, h.indexOf("</section>", a) + 10);
const EU = require("./diccionario.cjs").leerEU();
const chips = [...s.matchAll(/<button[^>]*aria-controls="(sx-p\d+)"[^>]*><span data-t="([^"]+)">([^<]+)<\/span><\/button>/g)];
const out = [];
for (const [, pid, ck, ctxt] of chips) {
  const pa = s.indexOf(`id="${pid}"`);
  const p = s.slice(pa, s.indexOf('<p class="sx__nota"', pa));
  const g = (re) => p.match(re) || [];
  const k = g(/<p class="sx__k" data-t="([^"]+)">([^<]+)<\/p>/);
  out.push({
    id: g(/srcset="assets\/([a-z0-9-]+)-desk\.webp"/)[1],
    nombre: g(/<h3 class="sx__n">([^<]+)<\/h3>/)[1],
    carpeta: g(/<span>([^<]+)<\/span><\/div><picture>/)[1],
    enlace: g(/<a class="l3-btn" href="([^"]+)"/)[1],
    chip: { key: ck, es: ctxt, eu: EU[ck] ?? null },
    k: { key: k[1], es: k[2], eu: EU[k[1]] ?? null },
    lleva: [...p.matchAll(/<li data-t="([^"]+)">([^<]+)<\/li>/g)].map((m) => ({ key: m[1], es: m[2], eu: EU[m[1]] ?? null })),
  });
}
fs.writeFileSync(path.join(__dirname, "existentes.json"), JSON.stringify(out, null, 1) + "\n");
console.log(out.length, "sectores");
