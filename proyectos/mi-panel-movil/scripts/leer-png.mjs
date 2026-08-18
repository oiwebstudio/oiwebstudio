// Lee un PNG sin dependencias: descomprime, deshace el filtro de cada línea y
// devuelve los píxeles en RGBA. Admite lo que sacan los móviles y los editores
// normales: 8 bits por canal, gris, gris+alfa, RGB, RGBA y paleta, sin
// entrelazado. Suficiente para meter un logo hecho fuera.

import { inflateSync } from 'node:zlib';

const CANALES = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };

export function leerPng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('Eso no es un PNG');

  let i = 8, cabecera = null, datos = [], paleta = null, transparencia = null;
  while (i < buf.length) {
    const largo = buf.readUInt32BE(i);
    const tipo = buf.toString('ascii', i + 4, i + 8);
    const cuerpo = buf.subarray(i + 8, i + 8 + largo);

    if (tipo === 'IHDR') {
      cabecera = {
        ancho: cuerpo.readUInt32BE(0),
        alto: cuerpo.readUInt32BE(4),
        bits: cuerpo[8],
        color: cuerpo[9],
        entrelazado: cuerpo[12],
      };
    } else if (tipo === 'PLTE') paleta = Buffer.from(cuerpo);
    else if (tipo === 'tRNS') transparencia = Buffer.from(cuerpo);
    else if (tipo === 'IDAT') datos.push(cuerpo);
    else if (tipo === 'IEND') break;

    i += 12 + largo;
  }

  if (!cabecera) throw new Error('PNG sin cabecera');
  if (cabecera.bits !== 8) throw new Error(`Solo sé leer 8 bits por canal (este trae ${cabecera.bits})`);
  if (cabecera.entrelazado) throw new Error('Este PNG está entrelazado; vuelve a guardarlo sin entrelazar');

  const { ancho, alto, color } = cabecera;
  const canales = CANALES[color];
  const crudo = inflateSync(Buffer.concat(datos));
  const porLinea = ancho * canales;
  const salida = new Uint8Array(ancho * alto * 4);

  let anterior = Buffer.alloc(porLinea);
  for (let y = 0; y < alto; y++) {
    const filtro = crudo[y * (porLinea + 1)];
    const linea = Buffer.from(crudo.subarray(y * (porLinea + 1) + 1, (y + 1) * (porLinea + 1)));

    // Deshacer el filtro: cada byte se guardó como diferencia con sus vecinos.
    for (let x = 0; x < porLinea; x++) {
      const a = x >= canales ? linea[x - canales] : 0;   // izquierda
      const b = anterior[x];                             // arriba
      const c = x >= canales ? anterior[x - canales] : 0; // diagonal
      let v = linea[x];
      if (filtro === 1) v += a;
      else if (filtro === 2) v += b;
      else if (filtro === 3) v += (a + b) >> 1;
      else if (filtro === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      linea[x] = v & 0xff;
    }

    for (let x = 0; x < ancho; x++) {
      const o = (y * ancho + x) * 4;
      const p = x * canales;
      if (color === 0) { salida[o] = salida[o + 1] = salida[o + 2] = linea[p]; salida[o + 3] = 255; }
      else if (color === 4) { salida[o] = salida[o + 1] = salida[o + 2] = linea[p]; salida[o + 3] = linea[p + 1]; }
      else if (color === 2) { salida[o] = linea[p]; salida[o + 1] = linea[p + 1]; salida[o + 2] = linea[p + 2]; salida[o + 3] = 255; }
      else if (color === 6) { salida.set(linea.subarray(p, p + 4), o); }
      else if (color === 3) {
        const idx = linea[p];
        salida[o] = paleta[idx * 3]; salida[o + 1] = paleta[idx * 3 + 1]; salida[o + 2] = paleta[idx * 3 + 2];
        salida[o + 3] = transparencia?.[idx] ?? 255;
      }
    }
    anterior = linea;
  }

  return { ancho, alto, pix: salida };
}

/** Reduce con media de área: al bajar de 1024 a 48 px no queda dentado. */
export function redimensionar(img, ladoDestino, { recorte = null } = {}) {
  const { x0, y0, ancho, alto } = recorte || { x0: 0, y0: 0, ancho: img.ancho, alto: img.alto };
  const salida = new Uint8Array(ladoDestino * ladoDestino * 4);
  const escalaX = ancho / ladoDestino, escalaY = alto / ladoDestino;

  for (let y = 0; y < ladoDestino; y++) {
    const desdeY = Math.floor(y0 + y * escalaY), hastaY = Math.max(desdeY + 1, Math.floor(y0 + (y + 1) * escalaY));
    for (let x = 0; x < ladoDestino; x++) {
      const desdeX = Math.floor(x0 + x * escalaX), hastaX = Math.max(desdeX + 1, Math.floor(x0 + (x + 1) * escalaX));
      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let sy = desdeY; sy < hastaY && sy < img.alto; sy++) {
        for (let sx = desdeX; sx < hastaX && sx < img.ancho; sx++) {
          const o = (sy * img.ancho + sx) * 4;
          const alfa = img.pix[o + 3] / 255;
          r += img.pix[o] * alfa; g += img.pix[o + 1] * alfa; b += img.pix[o + 2] * alfa;
          a += img.pix[o + 3]; n++;
        }
      }
      const o = (y * ladoDestino + x) * 4;
      if (!n) continue;
      const alfaMedia = a / n / 255;
      salida[o] = Math.round(alfaMedia ? r / n / alfaMedia : 0);
      salida[o + 1] = Math.round(alfaMedia ? g / n / alfaMedia : 0);
      salida[o + 2] = Math.round(alfaMedia ? b / n / alfaMedia : 0);
      salida[o + 3] = Math.round(a / n);
    }
  }
  return { lado: ladoDestino, pix: salida };
}

/** Encuentra el dibujo dentro de la imagen: se salta el borde de fondo liso. */
export function recortarAlContenido(img, { umbral = 24 } = {}) {
  const fondo = [img.pix[0], img.pix[1], img.pix[2]];
  let x0 = img.ancho, y0 = img.alto, x1 = 0, y1 = 0;
  for (let y = 0; y < img.alto; y++) {
    for (let x = 0; x < img.ancho; x++) {
      const o = (y * img.ancho + x) * 4;
      const distinto = img.pix[o + 3] > 8 && (
        Math.abs(img.pix[o] - fondo[0]) > umbral ||
        Math.abs(img.pix[o + 1] - fondo[1]) > umbral ||
        Math.abs(img.pix[o + 2] - fondo[2]) > umbral);
      if (distinto) {
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
    }
  }
  if (x1 <= x0 || y1 <= y0) return { x0: 0, y0: 0, ancho: img.ancho, alto: img.alto, fondo };
  // Cuadrado, para que el logo no salga estirado
  const lado = Math.max(x1 - x0, y1 - y0) + 1;
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  return {
    x0: Math.round(cx - lado / 2), y0: Math.round(cy - lado / 2),
    ancho: lado, alto: lado, fondo,
  };
}
