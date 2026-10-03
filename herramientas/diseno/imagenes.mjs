// Prepara las fotos de un cliente para la web: AVIF + WebP a varios anchos, orientación corregida,
// sin metadatos (ni GPS de la cámara), y el <picture> listo para pegar con width/height (sin saltos de maquetación).
// Uso (desde la raíz del repo):
//   node herramientas/diseno/imagenes.mjs <archivo|carpeta> <carpeta-salida> [--anchos 480,960,1600] [--sizes "(min-width: 900px) 50vw, 100vw"] [--lqip]
// --lqip añade a cada <img> un fondo borroso de ~300 bytes mientras carga la foto.
import sharp from "sharp";
import { readdirSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { join, basename, extname, relative } from "node:path";

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf("--" + n); return i >= 0 ? args[i + 1] : d; };
const conValor = new Set(["--anchos", "--sizes"]);
const posicionales = args.filter((a, i) => !a.startsWith("--") && !conValor.has(args[i - 1]));
const [entrada, salida] = posicionales;
if (!entrada || !salida) { console.error("Uso: imagenes.mjs <archivo|carpeta> <carpeta-salida> [--anchos 480,960,1600]"); process.exit(1); }
const anchos = opt("anchos", "480,960,1600").split(",").map(Number).sort((a, b) => a - b);
const sizes = opt("sizes", "100vw");
const lqip = args.includes("--lqip");
const nombreSeguro = (s) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const archivos = statSync(entrada).isDirectory()
  ? readdirSync(entrada).filter((f) => /\.(jpe?g|png|webp|avif|tiff?|heic)$/i.test(f)).map((f) => join(entrada, f))
  : [entrada];
mkdirSync(salida, { recursive: true });

let antes = 0, despues = 0, movil = 0, grande = 0;
const fragmentos = [];
for (const archivo of archivos) {
  const base = nombreSeguro(basename(archivo, extname(archivo)));
  const img = sharp(archivo).rotate(); // aplica la orientación EXIF y la descarta
  const meta = await img.metadata();
  const giro = (meta.orientation || 1) >= 5; // 5–8: la foto está tumbada
  const [w, h] = giro ? [meta.height, meta.width] : [meta.width, meta.height];
  antes += statSync(archivo).size;
  // nunca agrandar, ni sacar dos versiones casi del mismo ancho (480 y 500)
  const usados = anchos.filter((a) => a < w * 0.85).concat(anchos.some((a) => a >= w * 0.85) ? [w] : []);
  const srcset = { avif: [], webp: [] };
  for (const a of usados) {
    for (const [fmt, ops] of [["avif", { quality: 50, effort: 5 }], ["webp", { quality: 74, effort: 5 }]]) {
      const nombre = `${base}-${a}.${fmt}`;
      const info = await sharp(archivo).rotate().resize({ width: a, withoutEnlargement: true })[fmt](ops).toFile(join(salida, nombre));
      despues += info.size;
      if (fmt === "avif" && a === usados[0]) movil += info.size;
      if (fmt === "avif" && a === usados.at(-1)) grande += info.size;
      srcset[fmt].push(`${nombre} ${a}w`);
    }
  }
  let estilo = "";
  if (lqip) {
    const mini = await sharp(archivo).rotate().resize(16).blur(1).webp({ quality: 40 }).toBuffer();
    estilo = ` style="background:url(data:image/webp;base64,${mini.toString("base64")}) center/cover"`;
  }
  const mayor = srcset.webp.at(-1).split(" ")[0];
  fragmentos.push(`<picture>
  <source type="image/avif" srcset="${srcset.avif.join(", ")}" sizes="${sizes}">
  <img src="${mayor}" srcset="${srcset.webp.join(", ")}" sizes="${sizes}" width="${w}" height="${h}" alt="" loading="lazy" decoding="async"${estilo}>
</picture>`);
  console.log(`${basename(archivo)} (${w}×${h}) → ${usados.join(", ")} px`);
}
writeFileSync(join(salida, "picture.html"), `<!-- Pegar y escribir el alt de cada foto. La de la portada: quitar loading="lazy" y poner fetchpriority="high". -->\n${fragmentos.join("\n\n")}\n`);
const kb = (b) => (b / 1024).toFixed(0) + " KB";
console.log(`\n${archivos.length} fotos · originales ${kb(antes)} · un móvil descarga ${kb(movil)} (AVIF pequeño) · un escritorio ${kb(grande)} (AVIF grande) · en disco, todas las versiones: ${kb(despues)}`);
console.log(`<picture> listos en ${relative(process.cwd(), join(salida, "picture.html"))}`);
