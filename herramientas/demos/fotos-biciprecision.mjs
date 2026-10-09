/**
 * Baja las fotos de producto de la tienda online de Biciprecisión Igartua (urbecom) y las pasa a WebP de 600 px
 * en web/demos/clientes/biciprecision-igartua/nueva/fotos/. Lee productos.json (sacado de sus páginas de categoría)
 * y escribe catalogo.json (con el nombre de la foto y su tamaño) para demo-biciprecision-paginas.mjs.
 *
 *   node herramientas/demos/fotos-biciprecision.mjs <carpeta con productos.json>
 */
import fs from "node:fs";
import sharp from "sharp";

const CARPETA = process.argv[2];
const DIR = "web/demos/clientes/biciprecision-igartua/nueva/fotos/";
const P = JSON.parse(fs.readFileSync(CARPETA + "/productos.json", "utf8"));
const marcaDe = (n) => {
  const m = n.match(/^(CUBE|FOCUS|FLANDERS|LAPIERRE|BH|CANNONDALE|STEVENS|MERIDA)/i);
  return m ? m[1].toLowerCase() : /MOSER/i.test(n) ? "moser" : "";
};
const vistos = new Set(), out = [];
for (const p of P) {
  const k = p.nombre + p.precio;
  if (vistos.has(k)) continue;
  vistos.add(k);
  out.push({ ...p, marca: marcaDe(p.nombre) });
}
let nuevas = 0;
for (const p of out) {
  const ext = (p.img.match(/\.(jpg|png|jpeg)$/i) || [, "jpg"])[1];
  const base = p.img.replace(/^.*uploaded_images\//, "").replace(/-b\.(jpg|png|jpeg)$/i, "");
  p.foto = "p-" + base.replace(/[^\w]/g, "").slice(0, 14) + ".webp";
  if (!fs.existsSync(DIR + p.foto)) {
    try {
      const r = await fetch("https://www.urbecom.com/uploaded_images/" + base + "." + ext);
      if (!r.ok) throw new Error(String(r.status));
      await sharp(Buffer.from(await r.arrayBuffer())).resize({ width: 600, withoutEnlargement: true }).webp({ quality: 64 }).toFile(DIR + p.foto);
      nuevas++;
    } catch (e) { console.log("falla", p.nombre, e.message); p.foto = null; continue; }
  }
  const m = await sharp(DIR + p.foto).metadata();
  p.w = m.width; p.h = m.height;
}
fs.writeFileSync(CARPETA + "/catalogo.json", JSON.stringify(out, null, 1));
console.log("productos", out.length, "· fotos nuevas", nuevas, "· sin foto", out.filter((x) => !x.foto).length);
