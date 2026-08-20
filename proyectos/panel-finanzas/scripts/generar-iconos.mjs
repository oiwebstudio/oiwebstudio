// Genera los iconos PNG del PWA sin dependencias: pinta un lienzo RGBA a mano
// y lo codifica en PNG con zlib. Sirven tal cual para empaquetar el APK.
//   npm run iconos

import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DESTINO = resolve(RAIZ, 'iconos');

const FONDO = [11, 13, 16];        // #0b0d10, el fondo de la app
const ACENTO = [110, 139, 255];    // #6e8bff
const VERDE = [52, 211, 153];      // #34d399

// ── Lienzo ────────────────────────────────────────────────────────────────────
function lienzo(lado, relleno = [0, 0, 0, 0]) {
  const pix = new Uint8Array(lado * lado * 4);
  for (let i = 0; i < lado * lado; i++) {
    pix[i * 4] = relleno[0];
    pix[i * 4 + 1] = relleno[1];
    pix[i * 4 + 2] = relleno[2];
    pix[i * 4 + 3] = relleno[3] ?? 255;
  }
  return { lado, pix };
}

function punto(c, x, y, [r, g, b], alfa = 1) {
  if (x < 0 || y < 0 || x >= c.lado || y >= c.lado) return;
  const i = (y * c.lado + x) * 4;
  const previo = c.pix[i + 3] / 255;
  const mezcla = (canal, nuevo) => Math.round(nuevo * alfa + canal * previo * (1 - alfa));
  c.pix[i] = mezcla(c.pix[i], r);
  c.pix[i + 1] = mezcla(c.pix[i + 1], g);
  c.pix[i + 2] = mezcla(c.pix[i + 2], b);
  c.pix[i + 3] = Math.round(Math.min(1, alfa + previo * (1 - alfa)) * 255);
}

/** Rectángulo redondeado con antialias por supermuestreo de los bordes. */
function rectRedondo(c, x0, y0, ancho, alto, radio, color) {
  const dentro = (px, py) => {
    const dx = Math.max(x0 + radio - px, 0, px - (x0 + ancho - radio));
    const dy = Math.max(y0 + radio - py, 0, py - (y0 + alto - radio));
    if (px < x0 || py < y0 || px > x0 + ancho || py > y0 + alto) return 0;
    if (dx === 0 || dy === 0) return 1;
    return Math.hypot(dx, dy) <= radio ? 1 : 0;
  };

  for (let y = Math.floor(y0); y < Math.ceil(y0 + alto); y++) {
    for (let x = Math.floor(x0); x < Math.ceil(x0 + ancho); x++) {
      // 4×4 muestras: suficiente para que las esquinas no se vean escalonadas.
      let dentroCuenta = 0;
      for (let sy = 0; sy < 4; sy++) {
        for (let sx = 0; sx < 4; sx++) {
          dentroCuenta += dentro(x + (sx + 0.5) / 4, y + (sy + 0.5) / 4);
        }
      }
      if (dentroCuenta) punto(c, x, y, color, dentroCuenta / 16);
    }
  }
}

// ── PNG ───────────────────────────────────────────────────────────────────────
const TABLA_CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = TABLA_CRC[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function trozo(tipo, datos) {
  const largo = Buffer.alloc(4);
  largo.writeUInt32BE(datos.length);
  const cuerpo = Buffer.concat([Buffer.from(tipo, 'ascii'), datos]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(cuerpo));
  return Buffer.concat([largo, cuerpo, crc]);
}

function aPng(c) {
  const cabecera = Buffer.alloc(13);
  cabecera.writeUInt32BE(c.lado, 0);
  cabecera.writeUInt32BE(c.lado, 4);
  cabecera[8] = 8; // bits por canal
  cabecera[9] = 6; // RGBA
  // Una fila por scanline, con byte de filtro 0 delante.
  const crudo = Buffer.alloc(c.lado * (c.lado * 4 + 1));
  for (let y = 0; y < c.lado; y++) {
    crudo[y * (c.lado * 4 + 1)] = 0;
    Buffer.from(c.pix.buffer, y * c.lado * 4, c.lado * 4).copy(crudo, y * (c.lado * 4 + 1) + 1);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    trozo('IHDR', cabecera),
    trozo('IDAT', deflateSync(crudo, { level: 9 })),
    trozo('IEND', Buffer.alloc(0)),
  ]);
}

// ── El icono: barras ascendentes sobre fondo oscuro ───────────────────────────
function icono(lado, { recortable = false } = {}) {
  const c = lienzo(lado, [...FONDO, 255]);
  // En modo maskable Android recorta un círculo: hay que dejar margen de sobra.
  const margen = recortable ? lado * 0.26 : lado * 0.2;
  const util = lado - margen * 2;

  const barras = [
    { alto: 0.42, color: ACENTO, alfa: 0.55 },
    { alto: 0.68, color: ACENTO, alfa: 1 },
    { alto: 1.0, color: VERDE, alfa: 1 },
  ];
  const hueco = util * 0.12;
  const ancho = (util - hueco * 2) / 3;
  const radio = Math.max(2, ancho * 0.28);

  barras.forEach((b, i) => {
    const alto = util * b.alto;
    const x = margen + i * (ancho + hueco);
    const y = margen + (util - alto);
    const color = b.alfa < 1 ? b.color.map((v) => Math.round(v * b.alfa + FONDO[0] * (1 - b.alfa))) : b.color;
    rectRedondo(c, x, y, ancho, alto, Math.min(radio, alto / 2), color);
  });

  return aPng(c);
}

// ── .ico para el acceso directo de Windows ────────────────────────────────────
// Desde Vista un .ico puede llevar el PNG dentro tal cual: basta con la cabecera.
function aIco(pngs) {
  const cabecera = Buffer.alloc(6);
  cabecera.writeUInt16LE(0, 0); // reservado
  cabecera.writeUInt16LE(1, 2); // tipo 1 = icono
  cabecera.writeUInt16LE(pngs.length, 4);

  let desplazamiento = 6 + pngs.length * 16;
  const entradas = [];

  for (const { lado, datos } of pngs) {
    const e = Buffer.alloc(16);
    e[0] = lado >= 256 ? 0 : lado; // 0 significa 256
    e[1] = lado >= 256 ? 0 : lado;
    e.writeUInt16LE(1, 4);  // planos
    e.writeUInt16LE(32, 6); // bits por píxel
    e.writeUInt32LE(datos.length, 8);
    e.writeUInt32LE(desplazamiento, 12);
    desplazamiento += datos.length;
    entradas.push(e);
  }

  return Buffer.concat([cabecera, ...entradas, ...pngs.map((p) => p.datos)]);
}

mkdirSync(DESTINO, { recursive: true });

const salidas = [
  ['icono-192.png', icono(192)],
  ['icono-512.png', icono(512)],
  ['icono-maskable-512.png', icono(512, { recortable: true })],
  ['icono-180.png', icono(180)], // iOS
  // Varios tamaños en un archivo: Windows elige el que necesite en cada sitio.
  ['icono.ico', aIco([16, 32, 48, 64, 128, 256].map((lado) => ({ lado, datos: icono(lado) })))],
];

salidas.forEach(([nombre, png]) => writeFileSync(resolve(DESTINO, nombre), png));
console.log(`\n  ${salidas.length} iconos en ${DESTINO}`);
salidas.forEach(([n, p]) => console.log(`   · ${n} (${(p.length / 1024).toFixed(1)} kB)`));
console.log('');
