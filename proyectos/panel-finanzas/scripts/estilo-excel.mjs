// Estilo compartido de las hojas del libro. Un solo sitio donde cambiar la pinta.

export const C = {
  tinta: 'FF0F172A',
  acento: 'FF3B5BDB',
  papel: 'FFFFFFFF',
  suave: 'FFF1F5F9',
  linea: 'FFDDE3EC',
  texto: 'FF1E293B',
  atenuado: 'FF64748B',
  verde: 'FF15803D',
  rojo: 'FFB91C1C',
  verdeSuave: 'FFDCFCE7',
  rojoSuave: 'FFFEE2E2',
  ambar: 'FF92400E',
  ambarSuave: 'FFFEF3C7',
};

export const EUR = '#,##0.00\\ €';
export const EUR_ROJO = '#,##0.00\\ €;[Red]-#,##0.00\\ €';
export const PCT = '0.0%';
export const FECHA = 'dd/mm/yyyy';

export const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export const relleno = (color) => ({ type: 'pattern', pattern: 'solid', fgColor: { argb: color } });

export const borde = (color = C.linea) => ({
  top: { style: 'thin', color: { argb: color } },
  left: { style: 'thin', color: { argb: color } },
  bottom: { style: 'thin', color: { argb: color } },
  right: { style: 'thin', color: { argb: color } },
});

export function cabecera(hoja, fila, alto = 22) {
  const f = hoja.getRow(fila);
  f.height = alto;
  f.eachCell((celda) => {
    celda.fill = relleno(C.tinta);
    celda.font = { name: 'Aptos Narrow', size: 10, bold: true, color: { argb: C.papel } };
    celda.alignment = { vertical: 'middle', horizontal: 'left' };
    celda.border = borde(C.tinta);
  });
}

export function titulo(hoja, celda, texto, sub) {
  hoja.getCell(celda).value = texto;
  hoja.getCell(celda).font = { name: 'Aptos Display', size: 20, bold: true, color: { argb: C.tinta } };
  if (sub) {
    const fila = Number(celda.replace(/\D/g, '')) + 1;
    const col = celda.replace(/\d/g, '');
    hoja.getCell(`${col}${fila}`).value = sub;
    hoja.getCell(`${col}${fila}`).font = { name: 'Aptos Narrow', size: 10, color: { argb: C.atenuado } };
  }
}

// KPI en formato tarjeta: etiqueta pequeña arriba, cifra grande debajo.
export function tarjetaKpi(hoja, colIni, fila, etiqueta, formula, formato = EUR, colorCifra = C.tinta) {
  const c1 = hoja.getCell(fila, colIni);
  const c2 = hoja.getCell(fila + 1, colIni);
  hoja.mergeCells(fila, colIni, fila, colIni + 2);
  hoja.mergeCells(fila + 1, colIni, fila + 1, colIni + 2);

  c1.value = etiqueta.toUpperCase();
  c1.font = { name: 'Aptos Narrow', size: 9, bold: true, color: { argb: C.atenuado } };
  c1.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  c1.fill = relleno(C.suave);

  c2.value = { formula };
  c2.numFmt = formato;
  c2.font = { name: 'Aptos Display', size: 18, bold: true, color: { argb: colorCifra } };
  c2.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  c2.fill = relleno(C.suave);

  hoja.getRow(fila).height = 18;
  hoja.getRow(fila + 1).height = 30;

  for (let c = colIni; c <= colIni + 2; c++) {
    hoja.getCell(fila, c).border = { top: { style: 'thin', color: { argb: C.linea } }, left: { style: 'thin', color: { argb: C.linea } }, right: { style: 'thin', color: { argb: C.linea } } };
    hoja.getCell(fila + 1, c).border = { bottom: { style: 'thin', color: { argb: C.linea } }, left: { style: 'thin', color: { argb: C.linea } }, right: { style: 'thin', color: { argb: C.linea } } };
  }
}
