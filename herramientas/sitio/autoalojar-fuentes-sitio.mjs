/**
 * Autoaloja las fuentes de la web pública (Geist, Geist Mono, Fraunces).
 *
 * Por qué: cargar Google Fonts desde fonts.googleapis.com hace que el navegador
 * de cada visitante envíe su IP a Google sin consentimiento (sentencia LG
 * München, 2022). Con las fuentes en nuestro dominio no sale ningún dato.
 * Licencia OFL: permite servirlas desde el propio dominio.
 *
 *   node herramientas/sitio/autoalojar-fuentes-sitio.mjs
 *
 * Deja los .woff2 en web/assets/fonts/ y genera web/assets/fuentes.css.
 * Solo se guardan los subconjuntos latin y latin-ext (castellano y euskera).
 */
import fs from "node:fs/promises";
import crypto from "node:crypto";

const CSS_URL =
  "https://fonts.googleapis.com/css2?family=Geist:wght@400;450;500;600;700&family=Geist+Mono:wght@400;500&family=Fraunces:ital,opsz,wght@0,9..144,500;1,9..144,500&display=swap";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

await fs.mkdir("web/assets/fonts", { recursive: true });
const css = await (await fetch(CSS_URL, { headers: { "User-Agent": UA } })).text();

const bloques = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{([^}]*)\}/g)];
const vistos = new Map(); // url remota -> nombre local
let salida = "/* Fuentes autoalojadas — generado por herramientas/sitio/autoalojar-fuentes-sitio.mjs */\n";

for (const [, subset, cuerpo] of bloques) {
  if (subset !== "latin" && subset !== "latin-ext") continue;
  const url = cuerpo.match(/url\((https:[^)]+\.woff2)\)/)?.[1];
  if (!url) continue;
  if (!vistos.has(url)) {
    const buf = Buffer.from(await (await fetch(url, { headers: { "User-Agent": UA } })).arrayBuffer());
    const fam = cuerpo.match(/font-family:\s*'([^']+)'/)[1].toLowerCase().replace(/\s+/g, "-");
    const nombre = `${fam}-${subset}-${crypto.createHash("sha1").update(url).digest("hex").slice(0, 8)}.woff2`;
    await fs.writeFile(`web/assets/fonts/${nombre}`, buf);
    vistos.set(url, nombre);
  }
  const local = cuerpo.replace(url, `fonts/${vistos.get(url)}`);
  salida += `/* ${subset} */\n@font-face {${local.replace(/\s*src:/, "\n  src:").trimEnd()}\n}\n`;
}

await fs.writeFile("web/assets/fuentes.css", salida);
console.log(`fuentes.css: ${bloques.length} bloques leídos, ${vistos.size} archivos woff2`);
