// Paleta completa a partir del color de un negocio, en OKLCH, con el contraste comprobado.
// Uso (desde la raíz del repo):
//   node herramientas/diseno/paleta.mjs "#8a2b1f" [--nombre beko]
//   node herramientas/diseno/paleta.mjs --imagen ruta/logo.png [--nombre beko]   (saca el color del logo o de una foto)
// Escribe herramientas/diseno/paletas/<nombre>.html (muestra visual) e imprime los tokens :root y la tabla de contraste.
//
// Por qué OKLCH: la claridad (L) es perceptual. Mover L de 0.97 a 0.22 manteniendo el tono (H) da neutros
// «teñidos» de la marca en vez del gris o el crema de siempre, y dos colores con la misma L se ven igual de claros.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf("--" + n); return i >= 0 ? args[i + 1] : undefined; };

// ── conversión sRGB ⇄ OKLab ⇄ OKLCH (Björn Ottosson) ──
const aLineal = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const aGamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
function hexARgb(hex) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? [...h].map((x) => x + x).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255);
}
function rgbAOklch([r, g, b]) {
  [r, g, b] = [r, g, b].map(aLineal);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { L, C: Math.hypot(A, B), H: ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360 };
}
function oklchALineal({ L, C, H }) {
  const A = C * Math.cos((H * Math.PI) / 180), B = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
const enGama = (lin) => lin.every((c) => c >= -1e-4 && c <= 1 + 1e-4);
// si el color no cabe en sRGB, baja el croma (no la claridad ni el tono) hasta que quepa
function ajustar(c) {
  if (enGama(oklchALineal(c))) return c;
  let lo = 0, hi = c.C;
  for (let i = 0; i < 30; i++) { const mid = (lo + hi) / 2; enGama(oklchALineal({ ...c, C: mid })) ? (lo = mid) : (hi = mid); }
  return { ...c, C: lo };
}
const aHex = (c) => "#" + oklchALineal(ajustar(c)).map((v) => Math.round(Math.min(1, Math.max(0, aGamma(v))) * 255).toString(16).padStart(2, "0")).join("");
const luminancia = (c) => { const [r, g, b] = oklchALineal(ajustar(c)).map((v) => Math.min(1, Math.max(0, v))); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contraste = (a, b) => { const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const css = (c) => { const k = ajustar(c); return `oklch(${(k.L * 100).toFixed(1)}% ${k.C.toFixed(3)} ${k.H.toFixed(1)})`; };
// baja (o sube) la claridad hasta que el color llegue al contraste pedido sobre el fondo
function hastaContraste(c, fondo, minimo, haciaOscuro = true) {
  let k = { ...c };
  for (let i = 0; i < 100 && contraste(k, fondo) < minimo; i++) k = { ...k, L: k.L + (haciaOscuro ? -0.01 : 0.01) };
  return ajustar(k);
}

// ── color de partida ──
let marca, origen;
if (opt("imagen")) {
  const { default: sharp } = await import("sharp");
  const { data } = await sharp(opt("imagen")).resize(64, 64, { fit: "inside" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const cubos = new Map();
  for (let i = 0; i < data.length; i += 3) {
    const c = rgbAOklch([data[i] / 255, data[i + 1] / 255, data[i + 2] / 255]);
    if (c.C < 0.04 || c.L > 0.93 || c.L < 0.15) continue; // fuera blancos, negros y grises
    const k = Math.round(c.H / 15) % 24;
    const cubo = cubos.get(k) || { peso: 0, L: 0, C: 0, x: 0, y: 0 };
    const w = c.C; // los píxeles más vivos pesan más
    cubo.peso += w; cubo.L += c.L * w; cubo.C += c.C * w;
    cubo.x += Math.cos((c.H * Math.PI) / 180) * w; cubo.y += Math.sin((c.H * Math.PI) / 180) * w;
    cubos.set(k, cubo);
  }
  const lista = [...cubos.values()].sort((a, b) => b.peso - a.peso).slice(0, 3)
    .map((c) => ({ L: c.L / c.peso, C: c.C / c.peso, H: ((Math.atan2(c.y, c.x) * 180) / Math.PI + 360) % 360 }));
  if (!lista.length) { console.error("La imagen no tiene colores con croma (es gris o blanco y negro): elige el color a mano."); process.exit(1); }
  console.log("Colores dominantes de la imagen:", lista.map(aHex).join("  "));
  marca = lista[0]; origen = basename(opt("imagen"));
} else {
  const hex = args.find((a) => /^#?[0-9a-f]{3}([0-9a-f]{3})?$/i.test(a));
  if (!hex) { console.error('Uso: paleta.mjs "#8a2b1f" | --imagen logo.png'); process.exit(1); }
  marca = rgbAOklch(hexARgb(hex)); origen = hex;
}
const nombre = opt("nombre") || "paleta";
const H = marca.H, tinte = Math.min(0.018, marca.C * 0.12); // neutros con un pelo del tono de la marca

// ── tokens: modo claro ──
const papel = ajustar({ L: 0.975, C: tinte * 0.7, H });
const superficie = ajustar({ L: 0.995, C: tinte * 0.3, H });
const tinta = ajustar({ L: 0.23, C: tinte * 1.2, H });
const texto2 = hastaContraste({ L: 0.5, C: tinte * 1.5, H }, papel, 4.5);
const regla = ajustar({ L: 0.885, C: tinte, H });
const m = ajustar(marca);
const marcaTexto = contraste(m, papel) >= 4.5 ? m : hastaContraste(m, papel, 4.5); // la marca usada como texto o enlace
const sobreMarca = contraste(superficie, m) >= contraste(tinta, m) ? superficie : tinta; // texto encima de un botón de la marca
const marcaSuave = ajustar({ L: 0.94, C: Math.min(0.045, marca.C * 0.35), H });
const oscura = ajustar({ L: 0.2, C: Math.min(0.035, marca.C * 0.4), H }); // sección oscura
const sobreOscura = ajustar({ L: 0.95, C: tinte * 0.6, H });
const marcaEnOscura = contraste(m, oscura) >= 4.5 ? m : hastaContraste(m, oscura, 4.5, false);

// ── modo oscuro (mismos papeles, otra claridad) ──
const o = {
  papel: ajustar({ L: 0.17, C: Math.min(0.03, marca.C * 0.25), H }),
  superficie: ajustar({ L: 0.215, C: Math.min(0.03, marca.C * 0.25), H }),
  tinta: ajustar({ L: 0.94, C: tinte * 0.6, H }),
  regla: ajustar({ L: 0.32, C: tinte, H }),
};
o.texto2 = hastaContraste({ L: 0.72, C: tinte * 1.5, H }, o.papel, 4.5, false);
o.marcaTexto = contraste(m, o.papel) >= 4.5 ? m : hastaContraste(m, o.papel, 4.5, false);

const claro = { papel, superficie, tinta, "texto-2": texto2, regla, marca: m, "marca-texto": marcaTexto, "sobre-marca": sobreMarca, "marca-suave": marcaSuave, oscura, "sobre-oscura": sobreOscura, "marca-en-oscura": marcaEnOscura };
const oscuro = { papel: o.papel, superficie: o.superficie, tinta: o.tinta, "texto-2": o.texto2, regla: o.regla, "marca-texto": o.marcaTexto };

const pares = [
  ["tinta sobre papel", tinta, papel, 4.5], ["texto-2 sobre papel", texto2, papel, 4.5],
  ["marca-texto sobre papel", marcaTexto, papel, 4.5], ["sobre-marca en botón de marca", sobreMarca, m, 4.5],
  ["tinta sobre marca-suave", tinta, marcaSuave, 4.5], ["sobre-oscura en sección oscura", sobreOscura, oscura, 4.5],
  ["marca-en-oscura en sección oscura", marcaEnOscura, oscura, 4.5], ["regla sobre papel (borde de campo)", regla, papel, 3],
  ["(oscuro) tinta sobre papel", o.tinta, o.papel, 4.5], ["(oscuro) texto-2 sobre papel", o.texto2, o.papel, 4.5],
  ["(oscuro) marca-texto sobre papel", o.marcaTexto, o.papel, 4.5],
];

const bloque = (t) => Object.entries(t).map(([k, v]) => `  --${k}: ${css(v)}; /* ${aHex(v)} */`).join("\n");
const salidaCss = `/* Paleta «${nombre}» desde ${origen} — generada con herramientas/diseno/paleta.mjs */
:root {
${bloque(claro)}
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${bloque(oscuro).replace(/^/gm, "  ")}
  }
}`;
console.log(salidaCss);
console.log("\nContraste (WCAG 2.2; 4,5 texto normal · 3 bordes de campos y texto grande):");
for (const [n, a, b, min] of pares) {
  const r = contraste(a, b);
  console.log(`  ${r >= min ? "✓" : "✗"} ${n.padEnd(38)} ${r.toFixed(2)}${r >= min ? "" : `  (mínimo ${min})`}`);
}
if (contraste(sobreMarca, m) < 4.5) console.log("  → El botón de la marca no llega a 4,5 con ningún texto: usar la marca solo como acento y el botón en tinta, o letra ≥ 24 px (mínimo 3).");
if (contraste(regla, papel) < 3) console.log("  → La regla es decorativa (separadores). Para bordes de campos de formulario usar texto-2.");

// muestra visual
const dir = join(dirname(fileURLToPath(import.meta.url)), "paletas");
mkdirSync(dir, { recursive: true });
const muestra = (t) => Object.entries(t).map(([k, v]) => `<div class="m"><i style="background:${css(v)}"></i><b>${k}</b><code>${aHex(v)}</code></div>`).join("");
writeFileSync(join(dir, `${nombre}.html`), `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Paleta ${nombre}</title>
<style>${salidaCss}
body{margin:0;font:16px/1.5 system-ui,sans-serif;background:var(--papel);color:var(--tinta)}
.w{max-width:960px;margin:0 auto;padding:32px 20px}.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px}
.m i{display:block;height:64px;border-radius:8px;border:1px solid rgba(0,0,0,.08)}.m b{display:block;font-size:13px;margin-top:6px}.m code{font-size:12px;color:var(--texto-2)}
.demo{margin-top:32px;padding:28px;background:var(--superficie);border:1px solid var(--regla);border-radius:12px}
.demo h2{margin:0 0 8px;font-size:32px;line-height:1.1}.demo p{color:var(--texto-2);margin:0 0 16px}.demo a{color:var(--marca-texto)}
.demo .btn{display:inline-block;padding:12px 20px;border-radius:999px;background:var(--marca);color:var(--sobre-marca);text-decoration:none;font-weight:600}
.suave{margin-top:16px;padding:16px;background:var(--marca-suave);border-radius:8px}
.osc{margin-top:16px;padding:24px;background:var(--oscura);color:var(--sobre-oscura);border-radius:12px}.osc a{color:var(--marca-en-oscura)}</style>
<div class="w"><h1 style="margin:0 0 16px">Paleta «${nombre}» <small style="font-weight:400;color:var(--texto-2)">desde ${origen}</small></h1>
<div class="g">${muestra(claro)}</div>
<div class="demo"><h2>Reservar mesa en dos toques</h2><p>Texto secundario con su contraste comprobado. <a href="#">Un enlace</a> en el color de la marca.</p><a class="btn" href="#">Reservar mesa</a>
<div class="suave">Bloque destacado sobre marca-suave, con el texto en tinta.</div>
<div class="osc"><b>Sección oscura</b> con el texto claro y <a href="#">un enlace en la marca</a>.</div></div></div>`);
console.log(`\nMuestra: ${join(dir, nombre + ".html")}`);
