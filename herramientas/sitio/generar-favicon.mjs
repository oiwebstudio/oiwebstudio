// Iconos de la web a partir del logo (assets/logo-mark.png, 317×220).
// El antiguo favicon medía 128×89: no era cuadrado y Google lo aplastaba dentro
// de su círculo. Ahora: lienzo cuadrado, fondo tinta y el símbolo en crema,
// con margen suficiente para que el círculo de Google no lo corte.
// Uso: node herramientas/sitio/generar-favicon.mjs
import sharp from "sharp";
import fs from "node:fs";

const WEB = "web";
const TINTA = { r: 25, g: 23, b: 18 };     // --ink #191712
const CREMA = { r: 251, g: 249, b: 244 };  // --bg  #fbf9f4

// Símbolo en crema conservando el antialiasing del original (su canal alfa)
const alfa = await sharp(`${WEB}/assets/logo-mark.png`).ensureAlpha().extractChannel(3).toBuffer();
const { width: W0, height: H0 } = await sharp(`${WEB}/assets/logo-mark.png`).metadata();
const marca = await sharp({ create: { width: W0, height: H0, channels: 3, background: CREMA } })
  .joinChannel(alfa).png().toBuffer();
const recorte = await sharp(marca).trim().png().toBuffer();

async function icono(lado, { ancho = 0.64, redondeo = 0 } = {}) {
  const w = Math.round(lado * ancho);
  const simbolo = await sharp(recorte).resize({ width: w }).png().toBuffer();
  const fondo = redondeo
    ? Buffer.from(`<svg width="${lado}" height="${lado}"><rect width="${lado}" height="${lado}" rx="${lado * redondeo}" fill="#191712"/></svg>`)
    : await sharp({ create: { width: lado, height: lado, channels: 4, background: { ...TINTA, alpha: 1 } } }).png().toBuffer();
  return sharp(fondo).composite([{ input: simbolo, gravity: "center" }]).png({ compressionLevel: 9 }).toBuffer();
}

const salidas = {
  "favicon-48.png": await icono(48, { redondeo: 0.22 }),
  "favicon-96.png": await icono(96, { redondeo: 0.22 }),
  "icon-192.png": await icono(192, { redondeo: 0.22 }),
  "icon-512.png": await icono(512),                        // "maskable": sin esquinas, margen amplio
  "apple-touch-icon.png": await icono(180, { ancho: 0.6 }), // iOS redondea por su cuenta
};
for (const [f, buf] of Object.entries(salidas)) fs.writeFileSync(`${WEB}/${f}`, buf);

// favicon.ico (16, 32, 48) con PNG embebido: es lo primero que pide Google
const tamanos = [16, 32, 48];
const pngs = await Promise.all(tamanos.map((t) => icono(t, { ancho: 0.72, redondeo: 0.2 })));
const cab = Buffer.alloc(6 + 16 * pngs.length);
cab.writeUInt16LE(0, 0); cab.writeUInt16LE(1, 2); cab.writeUInt16LE(pngs.length, 4);
let off = cab.length;
pngs.forEach((p, i) => {
  const e = 6 + 16 * i, t = tamanos[i];
  cab.writeUInt8(t, e); cab.writeUInt8(t, e + 1); cab.writeUInt8(0, e + 2); cab.writeUInt8(0, e + 3);
  cab.writeUInt16LE(1, e + 4); cab.writeUInt16LE(32, e + 6);
  cab.writeUInt32LE(p.length, e + 8); cab.writeUInt32LE(off, e + 12);
  off += p.length;
});
fs.writeFileSync(`${WEB}/favicon.ico`, Buffer.concat([cab, ...pngs]));

fs.writeFileSync(`${WEB}/site.webmanifest`, JSON.stringify({
  name: "OI Studio · Diseño web en Tolosa",
  short_name: "OI Studio",
  start_url: "/",
  display: "standalone",
  background_color: "#fbf9f4",
  theme_color: "#191712",
  icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
  ],
}, null, 2) + "\n");
console.log("iconos:", [...Object.keys(salidas), "favicon.ico", "site.webmanifest"].join(", "));
