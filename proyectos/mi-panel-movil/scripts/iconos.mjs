// Genera los iconos de la app sin dependencias: dibuja el logo a mano con
// distancias (cada píxel sabe lo lejos que está del trazo) y lo codifica en PNG
// con zlib. Al ser vectorial de origen, sale nítido en cualquier tamaño.
//
//   npm run iconos
//
// El logo son tres barras ascendentes de trazo redondeado —la primera con su
// tilde encima— y la última se prolonga en una flecha hacia arriba.

import { deflateSync } from 'node:zlib';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DESTINO = resolve(RAIZ, 'www', 'iconos');

const FONDO = [11, 11, 12];        // #0B0B0C, el negro del logo
const TRAZO = [255, 255, 255];

/* ── Geometría del logo, en un lienzo imaginario de 100 × 100 ──────────────
   Cambiar estos números es cambiar el logo: todo lo demás se adapta.        */
const GROSOR = 6.2;                // ancho del trazo
const LOGO = {
  // Barras: [x izquierda, x derecha, y arriba, y abajo]
  barras: [
    [8, 26, 62, 92],
    [33, 51, 48, 92],
    [58, 76, 34, 92],
  ],
  tilde: [8, 26, 52],              // la rayita sobre la primera barra
  // Trazos sueltos: el gancho de la barra del medio y la flecha de la alta
  lineas: [
    [[33, 48], [37, 38], [49, 36]],           // gancho de la segunda barra
    [[58, 34], [68, 20], [88, 6]],            // cuerpo de la flecha
    [[88, 6], [72, 8]],                       // punta, lado izquierdo
    [[88, 6], [85, 21]],                      // punta, lado derecho
  ],
};

/* ── Distancias ──────────────────────────────────────────────────────────── */
const dist = (x, y) => Math.hypot(x, y);

/** Distancia de un punto a un segmento: la base de todo el dibujo. */
function aSegmento(px, py, [ax, ay], [bx, by]) {
  const vx = bx - ax, vy = by - ay;
  const wx = px - ax, wy = py - ay;
  const largo = vx * vx + vy * vy;
  const t = largo ? Math.max(0, Math.min(1, (wx * vx + wy * vy) / largo)) : 0;
  return dist(wx - vx * t, wy - vy * t);
}

/** Distancia al contorno de una barra: un rectángulo con las esquinas redondas. */
function aBarra(px, py, [x0, x1, y0, y1]) {
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const mitadAncho = (x1 - x0) / 2, mitadAlto = (y1 - y0) / 2;
  const r = Math.min(mitadAncho, mitadAlto);       // radio de las esquinas
  // Distancia con signo a un rectángulo redondeado, centrado en (cx, cy).
  const qx = Math.abs(px - cx) - (mitadAncho - r);
  const qy = Math.abs(py - cy) - (mitadAlto - r);
  const fuera = dist(Math.max(qx, 0), Math.max(qy, 0));
  const dentro = Math.min(Math.max(qx, qy), 0);
  return Math.abs(fuera + dentro - r);             // en valor absoluto: el borde
}

/** Lo cerca que está un punto del trazo del logo. 0 = justo encima. */
function alLogo(px, py) {
  let d = Infinity;
  for (const b of LOGO.barras) d = Math.min(d, aBarra(px, py, b));
  const [tx0, tx1, ty] = LOGO.tilde;
  d = Math.min(d, aSegmento(px, py, [tx0 + GROSOR / 2, ty], [tx1 - GROSOR / 2, ty]));
  for (const linea of LOGO.lineas)
    for (let i = 0; i < linea.length - 1; i++)
      d = Math.min(d, aSegmento(px, py, linea[i], linea[i + 1]));
  return d;
}

/* ── Lienzo y pintado ────────────────────────────────────────────────────── */
function lienzo(lado, relleno) {
  const pix = new Uint8Array(lado * lado * 4);
  if (relleno) {
    for (let i = 0; i < lado * lado; i++) {
      pix[i * 4] = relleno[0];
      pix[i * 4 + 1] = relleno[1];
      pix[i * 4 + 2] = relleno[2];
      pix[i * 4 + 3] = 255;
    }
  }
  return { lado, pix };
}

/**
 * Dibuja el logo.
 *   margen  cuánto aire dejar alrededor (los iconos recortables piden más)
 *   fondo   null para dejarlo transparente
 */
function dibujar(lado, { margen = 0.14, fondo = FONDO, trazo = TRAZO } = {}) {
  const c = lienzo(lado, fondo);
  const util = lado * (1 - margen * 2);
  const desde = lado * margen;
  const escala = util / 100;
  const grosor = (GROSOR / 2) * escala;
  const suave = Math.max(0.6, lado / 260);     // ancho del difuminado del borde

  for (let y = 0; y < lado; y++) {
    for (let x = 0; x < lado; x++) {
      // Del píxel al sistema de coordenadas del logo
      const lx = (x + 0.5 - desde) / escala;
      const ly = (y + 0.5 - desde) / escala;
      if (lx < -12 || ly < -12 || lx > 112 || ly > 112) continue;

      const d = alLogo(lx, ly) * escala - grosor;
      const alfa = 1 - Math.min(1, Math.max(0, (d + suave / 2) / suave));
      if (alfa <= 0) continue;

      const i = (y * c.lado + x) * 4;
      const previo = c.pix[i + 3] / 255;
      for (let k = 0; k < 3; k++)
        c.pix[i + k] = Math.round(trazo[k] * alfa + c.pix[i + k] * previo * (1 - alfa));
      c.pix[i + 3] = Math.round(Math.min(1, alfa + previo * (1 - alfa)) * 255);
    }
  }
  return c;
}

/* ── PNG ─────────────────────────────────────────────────────────────────── */
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
  const crudo = Buffer.alloc(c.lado * (c.lado * 4 + 1));
  for (let y = 0; y < c.lado; y++) {
    crudo[y * (c.lado * 4 + 1)] = 0;   // byte de filtro
    Buffer.from(c.pix.buffer, y * c.lado * 4, c.lado * 4).copy(crudo, y * (c.lado * 4 + 1) + 1);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    trozo('IHDR', cabecera),
    trozo('IDAT', deflateSync(crudo, { level: 9 })),
    trozo('IEND', Buffer.alloc(0)),
  ]);
}

const png = (lado, opciones) => aPng(dibujar(lado, opciones));

/* ── .ico para el acceso directo de Windows ──────────────────────────────── */
function aIco(pngs) {
  const cabecera = Buffer.alloc(6);
  cabecera.writeUInt16LE(0, 0);
  cabecera.writeUInt16LE(1, 2);
  cabecera.writeUInt16LE(pngs.length, 4);

  let desplazamiento = 6 + pngs.length * 16;
  const entradas = [];
  for (const { lado, datos } of pngs) {
    const e = Buffer.alloc(16);
    e[0] = lado >= 256 ? 0 : lado;
    e[1] = lado >= 256 ? 0 : lado;
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(datos.length, 8);
    e.writeUInt32LE(desplazamiento, 12);
    desplazamiento += datos.length;
    entradas.push(e);
  }
  return Buffer.concat([cabecera, ...entradas, ...pngs.map((p) => p.datos)]);
}

/* ── A escribir ──────────────────────────────────────────────────────────── */
mkdirSync(DESTINO, { recursive: true });

const salidas = [
  ['icono-192.png', png(192)],
  ['icono-512.png', png(512)],
  ['icono-maskable-512.png', png(512, { margen: 0.26 })],
  ['icono-180.png', png(180)],
];
salidas.forEach(([nombre, datos]) => writeFileSync(resolve(DESTINO, nombre), datos));
writeFileSync(resolve(DESTINO, 'icono.ico'), aIco([16, 32, 48, 256].map((lado) => ({ lado, datos: png(lado) }))));
console.log(`\n  ${salidas.length + 1} iconos web en ${DESTINO}`);

// Android pide el icono en cinco densidades. El adaptativo va en dos capas: el
// fondo lo pone el sistema y el primer plano es este PNG, con margen de sobra
// porque el sistema lo recorta en círculo, cuadrado o lo que toque.
const RES = resolve(RAIZ, 'android', 'app', 'src', 'main', 'res');
const DENSIDADES = [
  ['mdpi', 48, 108],
  ['hdpi', 72, 162],
  ['xhdpi', 96, 216],
  ['xxhdpi', 144, 324],
  ['xxxhdpi', 192, 432],
];

if (existsSync(RES)) {
  let n = 0;
  for (const [densidad, lado, ladoCapa] of DENSIDADES) {
    const carpeta = resolve(RES, `mipmap-${densidad}`);
    mkdirSync(carpeta, { recursive: true });
    const completo = png(lado);
    writeFileSync(resolve(carpeta, 'ic_launcher.png'), completo);
    writeFileSync(resolve(carpeta, 'ic_launcher_round.png'), completo);
    writeFileSync(resolve(carpeta, 'ic_launcher_foreground.png'), png(ladoCapa, { margen: 0.3, fondo: null }));
    n += 3;
  }
  console.log(`  ${n} iconos de Android en ${RES}`);

  // La barra de estado solo pinta la silueta: blanco puro sobre transparente.
  const drawable = resolve(RES, 'drawable');
  mkdirSync(drawable, { recursive: true });
  writeFileSync(resolve(drawable, 'ic_stat_icon.png'), png(96, { margen: 0.1, fondo: null }));
  console.log(`  icono de notificación en ${drawable}`);
} else {
  console.log('  (sin proyecto Android: me salto sus iconos)');
}

console.log('');
