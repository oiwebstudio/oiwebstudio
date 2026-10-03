// Descarga la biblioteca de letras (_local/material/letras/catalogo.json) en woff2 para autoalojarlas en las demos,
// y genera _local/material/letras/fuentes/<id>.css con los @font-face listos para copiar junto a la web.
// Uso (desde la raíz del repo): node herramientas/diseno/letras.mjs [id ...]   (sin ids: todas)
// Google Fonts: solo el subconjunto «latin» (castellano y euskera). Fontshare: el woff2 que da su API.
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..", "letras");
const SAL = join(RAIZ, "fuentes"); mkdirSync(SAL, { recursive: true });
const { letras } = JSON.parse(readFileSync(join(RAIZ, "catalogo.json"), "utf8"));
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36";
const pedir = process.argv.slice(2);

async function bajar(url, archivo) {
  if (existsSync(join(SAL, archivo))) return true;
  const r = await fetch(url.startsWith("//") ? "https:" + url : url, { headers: { "User-Agent": UA } });
  if (!r.ok) return false;
  writeFileSync(join(SAL, archivo), Buffer.from(await r.arrayBuffer())); return true;
}

for (const l of letras) {
  if (pedir.length && !pedir.includes(l.id)) continue;
  const caras = [];
  try {
    if (l.fuente === "google") {
      const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${l.familia}&display=swap`, { headers: { "User-Agent": UA } })).text();
      // bloques /* latin */ @font-face {...}
      for (const m of css.matchAll(/\/\* latin \*\/\s*@font-face\s*\{([^}]+)\}/g)) {
        const b = m[1], url = b.match(/url\((https:[^)]+\.woff2)\)/)[1];
        const estilo = b.match(/font-style:\s*(\w+)/)[1], peso = b.match(/font-weight:\s*([\d ]+)/)[1].trim();
        const extra = (b.match(/font-stretch:\s*([^;]+);/) || [])[1];
        const archivo = `${l.id}-${peso.replace(" ", "_")}${estilo === "italic" ? "-i" : ""}.woff2`;
        if (await bajar(url, archivo)) caras.push(`@font-face{font-family:'${l.nombre}';font-style:${estilo};font-weight:${peso};${extra ? `font-stretch:${extra};` : ""}font-display:swap;src:url('${archivo}') format('woff2');}`);
      }
    } else {
      const css = await (await fetch(`https://api.fontshare.com/v2/css?f[]=${l.id}@${l.pesos.join(",")}&display=swap`)).text();
      for (const m of css.matchAll(/@font-face\s*\{([^}]+)\}/g)) {
        const b = m[1], url = b.match(/url\('([^']+\.woff2)'\)/)[1];
        const peso = b.match(/font-weight:\s*(\d+)/)[1], estilo = b.match(/font-style:\s*(\w+)/)[1];
        const archivo = `${l.id}-${peso}${estilo === "italic" ? "-i" : ""}.woff2`;
        if (await bajar(url, archivo)) caras.push(`@font-face{font-family:'${l.nombre}';font-style:${estilo};font-weight:${peso};font-display:swap;src:url('${archivo}') format('woff2');}`);
      }
    }
  } catch (e) { console.log("✗", l.id, String(e).slice(0, 80)); }
  writeFileSync(join(SAL, `${l.id}.css`), caras.join("\n") + "\n");
  console.log(caras.length ? "✓" : "✗", l.id, caras.length, "caras");
}
