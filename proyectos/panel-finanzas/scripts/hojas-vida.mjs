// Hojas de la parte personal: Personal, Objetivos y Resumen personal.
// Se puede aplicar tanto a un libro recién creado como a uno que ya tiene datos:
// nunca toca una hoja que ya exista.

import { C, EUR, EUR_ROJO, PCT, FECHA, MESES, borde, cabecera, relleno, tarjetaKpi, titulo } from './estilo-excel.mjs';

const FILAS = 1000;

export const CAT_PERSONAL = [
  'Vivienda',
  'Alimentación',
  'Transporte',
  'Suscripciones',
  'Ocio y salidas',
  'Salud',
  'Ropa',
  'Formación',
  'Regalos',
  'Viajes',
  'Ahorro e inversión',
  'Nómina / retirada',
  'Otros ingresos',
  'Otros gastos',
];

export const AREAS = ['Dinero', 'Negocio', 'Salud', 'Aprendizaje', 'Personal'];
export const TIPOS_OBJETIVO = ['Importe', 'Cantidad', 'Hito'];
export const ESTADOS_OBJETIVO = ['Activo', 'Conseguido', 'Pausado', 'Descartado'];
export const PLAZOS = ['Día', 'Semana', 'Mes', 'Año', 'Largo plazo'];

// ── Categorías personales y listas de objetivos en la hoja Categorias ─────────
function ampliarCategorias(wb) {
  const cats = wb.getWorksheet('Categorias');
  if (!cats) return null;
  // Se puede llamar sobre un libro a medio ampliar: solo falta comprobar la última columna.
  if (cats.getCell('M1').value) return null;

  cats.getColumn(9).width = 24;
  cats.getColumn(10).width = 18;
  cats.getColumn(11).width = 18;
  cats.getColumn(12).width = 18;

  cats.getColumn(13).width = 16;

  cats.getCell('I1').value = 'Categorías personales';
  cats.getCell('J1').value = 'Áreas de objetivo';
  cats.getCell('K1').value = 'Tipos de objetivo';
  cats.getCell('L1').value = 'Estados de objetivo';
  cats.getCell('M1').value = 'Plazos';
  for (const col of ['I1', 'J1', 'K1', 'L1', 'M1']) {
    cats.getCell(col).fill = relleno(C.tinta);
    cats.getCell(col).font = { name: 'Aptos Narrow', size: 10, bold: true, color: { argb: C.papel } };
    cats.getCell(col).border = borde(C.tinta);
  }

  const largo = Math.max(CAT_PERSONAL.length, AREAS.length, TIPOS_OBJETIVO.length, ESTADOS_OBJETIVO.length, PLAZOS.length);
  for (let i = 0; i < largo; i++) {
    const f = cats.getRow(i + 2);
    f.getCell(9).value = CAT_PERSONAL[i] ?? null;
    f.getCell(10).value = AREAS[i] ?? null;
    f.getCell(11).value = TIPOS_OBJETIVO[i] ?? null;
    f.getCell(12).value = ESTADOS_OBJETIVO[i] ?? null;
    f.getCell(13).value = PLAZOS[i] ?? null;
    for (let c = 9; c <= 13; c++) f.getCell(c).font = { name: 'Aptos Narrow', size: 10, color: { argb: C.texto } };
  }

  wb.definedNames.add(`Categorias!$I$2:$I$${CAT_PERSONAL.length + 1}`, 'lstCatPersonal');
  wb.definedNames.add(`Categorias!$J$2:$J$${AREAS.length + 1}`, 'lstAreas');
  wb.definedNames.add(`Categorias!$K$2:$K$${TIPOS_OBJETIVO.length + 1}`, 'lstTipoObjetivo');
  wb.definedNames.add(`Categorias!$L$2:$L$${ESTADOS_OBJETIVO.length + 1}`, 'lstEstadoObjetivo');
  wb.definedNames.add(`Categorias!$M$2:$M$${PLAZOS.length + 1}`, 'lstPlazo');
  return 'Categorias: categorías personales, áreas y plazos';
}

// ── Hoja Personal ─────────────────────────────────────────────────────────────
function crearPersonal(wb) {
  if (wb.getWorksheet('Personal')) return null;

  const hoja = wb.addWorksheet('Personal', {
    views: [{ state: 'frozen', ySplit: 1, xSplit: 3 }],
    properties: { defaultRowHeight: 18 },
  });

  const COLS = [
    ['Fecha', 12],
    ['Tipo', 10],
    ['Concepto', 40],
    ['Categoría', 22],
    ['Importe', 14],
    ['Método', 14],
    ['Recurrente', 12],
    ['Notas', 32],
    ['Mes', 6],
  ];
  hoja.columns = COLS.map(([, width]) => ({ width }));
  hoja.getRow(1).values = COLS.map(([h]) => h);
  cabecera(hoja, 1, 24);
  hoja.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: COLS.length } };

  for (let f = 2; f <= FILAS; f++) {
    const fila = hoja.getRow(f);
    fila.getCell(1).numFmt = FECHA;
    fila.getCell(5).numFmt = EUR;
    fila.getCell(9).value = { formula: `IF(A${f}="","",MONTH(A${f}))` };
    fila.getCell(9).alignment = { horizontal: 'center' };
    fila.getCell(2).alignment = { horizontal: 'center' };
    fila.getCell(7).alignment = { horizontal: 'center' };
    fila.font = { name: 'Aptos Narrow', size: 10, color: { argb: C.texto } };

    hoja.getCell(`B${f}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['=lstTipo'] };
    hoja.getCell(`D${f}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['=lstCatPersonal'],
      showErrorMessage: true,
      errorStyle: 'warning',
      errorTitle: 'Valor no reconocido',
      error: 'Elige una categoría personal (columna I de la hoja Categorias).',
    };
    hoja.getCell(`F${f}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['=lstMetodo'] };
    hoja.getCell(`G${f}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['=lstDeducible'] };
  }

  hoja.addConditionalFormatting({
    ref: `A2:I${FILAS}`,
    rules: [
      { type: 'expression', formulae: ['$B2="Ingreso"'], priority: 2, style: { font: { color: { argb: C.verde } } } },
      { type: 'expression', formulae: ['AND($A2<>"",MOD(ROW(),2)=0)'], priority: 3, style: { fill: relleno('FFF8FAFC') } },
    ],
  });
  hoja.addConditionalFormatting({
    ref: `G2:G${FILAS}`,
    rules: [{ type: 'expression', formulae: ['$G2="Sí"'], priority: 1, style: { font: { color: { argb: C.ambar }, bold: true } } }],
  });
  return 'Hoja Personal creada';
}

// ── Hoja Objetivos ────────────────────────────────────────────────────────────
// La hoja vieja no tenía columna Plazo. Si está vacía se rehace; si tiene datos
// se respeta y el plazo se deduce de la fecha límite al leerla.
function crearObjetivos(wb) {
  const previa = wb.getWorksheet('Objetivos');
  if (previa) {
    const tienePlazo = String(previa.getCell('C1').value ?? '') === 'Plazo';
    let conDatos = false;
    for (let f = 2; f <= previa.rowCount; f++) {
      if (previa.getCell(f, 1).value && Number(previa.getCell(f, 4).value) > 0) conDatos = true;
    }
    if (tienePlazo || conDatos) return null;
    wb.removeWorksheet(previa.id);
  }

  const hoja = wb.addWorksheet('Objetivos', { views: [{ state: 'frozen', ySplit: 1 }] });
  const COLS = [
    ['Objetivo', 34],
    ['Área', 14],
    ['Plazo', 13],
    ['Tipo', 12],
    ['Meta', 12],
    ['Progreso', 12],
    ['Unidad', 10],
    ['Inicio', 12],
    ['Fecha límite', 13],
    ['Estado', 13],
    ['Notas', 30],
    ['%', 9],
  ];
  hoja.columns = COLS.map(([, width]) => ({ width }));
  hoja.getRow(1).values = COLS.map(([h]) => h);
  cabecera(hoja, 1, 24);
  hoja.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: COLS.length } };

  const HASTA = 200;
  for (let f = 2; f <= HASTA; f++) {
    const fila = hoja.getRow(f);
    fila.getCell(8).numFmt = FECHA;
    fila.getCell(9).numFmt = FECHA;
    fila.getCell(12).value = { formula: `IF(OR(A${f}="",E${f}=0,E${f}=""),"",MIN(1,F${f}/E${f}))` };
    fila.getCell(12).numFmt = PCT;
    fila.font = { name: 'Aptos Narrow', size: 10, color: { argb: C.texto } };

    hoja.getCell(`B${f}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['=lstAreas'] };
    hoja.getCell(`C${f}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['=lstPlazo'] };
    hoja.getCell(`D${f}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['=lstTipoObjetivo'] };
    hoja.getCell(`J${f}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['=lstEstadoObjetivo'] };
  }

  hoja.addConditionalFormatting({
    ref: `L2:L${HASTA}`,
    rules: [{ type: 'dataBar', priority: 1, cfvo: [{ type: 'num', value: 0 }, { type: 'num', value: 1 }], color: { argb: 'FFA5B4FC' } }],
  });
  hoja.addConditionalFormatting({
    ref: `A2:L${HASTA}`,
    rules: [
      { type: 'expression', formulae: ['$J2="Conseguido"'], priority: 2, style: { fill: relleno(C.verdeSuave), font: { color: { argb: C.verde } } } },
      { type: 'expression', formulae: ['$J2="Descartado"'], priority: 3, style: { font: { color: { argb: C.atenuado }, strike: true } } },
    ],
  });

  // La nota va fuera de la columna A: ahí solo pueden vivir nombres de objetivo.
  hoja.getCell(`M${HASTA + 3}`).value =
    'Tipo Importe → meta en €. Tipo Cantidad → meta en unidades (clientes, libros…). Tipo Hito → meta 1, progreso 1 cuando esté hecho.';
  hoja.getCell(`M${HASTA + 3}`).font = { name: 'Aptos Narrow', size: 9, italic: true, color: { argb: C.atenuado } };
  return 'Hoja Objetivos creada (con columna Plazo)';
}

// ── Hoja Resumen personal ─────────────────────────────────────────────────────
function crearResumenPersonal(wb) {
  if (wb.getWorksheet('Resumen personal')) return null;

  const hoja = wb.addWorksheet('Resumen personal', { views: [{ state: 'frozen', ySplit: 4, showGridLines: false }] });
  hoja.columns = [{ width: 3 }, { width: 22 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 12 }, { width: 3 }, { width: 22 }, { width: 15 }, { width: 12 }, { width: 3 }];

  titulo(hoja, 'B2', 'Vida personal', 'Se calcula con SUMIFS sobre la hoja Personal. No escribas aquí.');

  const R = {
    tipo: `Personal!$B$2:$B$${FILAS}`,
    cat: `Personal!$D$2:$D$${FILAS}`,
    imp: `Personal!$E$2:$E$${FILAS}`,
    rec: `Personal!$G$2:$G$${FILAS}`,
    mes: `Personal!$I$2:$I$${FILAS}`,
  };

  const totIng = `SUMIFS(${R.imp},${R.tipo},"Ingreso")`;
  const totGas = `SUMIFS(${R.imp},${R.tipo},"Gasto")`;

  tarjetaKpi(hoja, 2, 5, 'Ingresos personales', totIng, EUR, C.verde);
  tarjetaKpi(hoja, 5, 5, 'Gastos personales', totGas, EUR, C.rojo);
  tarjetaKpi(hoja, 8, 5, 'Tasa de ahorro', `IFERROR((${totIng}-${totGas})/${totIng},0)`, PCT, C.tinta);

  hoja.getRow(8).values = [null, 'Mes', 'Ingresos', 'Gastos', 'Ahorro', 'Tasa'];
  cabecera(hoja, 8, 22);
  for (let i = 0; i < 12; i++) {
    const f = 9 + i;
    const fila = hoja.getRow(f);
    fila.getCell(2).value = MESES[i];
    fila.getCell(3).value = { formula: `SUMIFS(${R.imp},${R.tipo},"Ingreso",${R.mes},${i + 1})` };
    fila.getCell(4).value = { formula: `SUMIFS(${R.imp},${R.tipo},"Gasto",${R.mes},${i + 1})` };
    fila.getCell(5).value = { formula: `C${f}-D${f}` };
    fila.getCell(6).value = { formula: `IF(C${f}=0,"",E${f}/C${f})` };
    for (let c = 3; c <= 5; c++) fila.getCell(c).numFmt = EUR_ROJO;
    fila.getCell(6).numFmt = PCT;
    for (let c = 2; c <= 6; c++) fila.getCell(c).border = borde();
    fila.font = { name: 'Aptos Narrow', size: 10, color: { argb: C.texto } };
  }

  const fTot = 21;
  const tot = hoja.getRow(fTot);
  tot.getCell(2).value = 'TOTAL';
  tot.getCell(3).value = { formula: 'SUM(C9:C20)' };
  tot.getCell(4).value = { formula: 'SUM(D9:D20)' };
  tot.getCell(5).value = { formula: 'C21-D21' };
  tot.getCell(6).value = { formula: 'IF(C21=0,"",E21/C21)' };
  for (let c = 2; c <= 6; c++) {
    tot.getCell(c).fill = relleno(C.tinta);
    tot.getCell(c).font = { name: 'Aptos Narrow', size: 11, bold: true, color: { argb: C.papel } };
    tot.getCell(c).border = borde(C.tinta);
    if (c >= 3 && c <= 5) tot.getCell(c).numFmt = EUR_ROJO;
    if (c === 6) tot.getCell(c).numFmt = PCT;
  }
  tot.height = 24;

  hoja.addConditionalFormatting({
    ref: 'E9:E20',
    rules: [
      { type: 'cellIs', operator: 'lessThan', formulae: ['0'], priority: 1, style: { fill: relleno(C.rojoSuave), font: { color: { argb: C.rojo }, bold: true } } },
      { type: 'cellIs', operator: 'greaterThan', formulae: ['0'], priority: 2, style: { fill: relleno(C.verdeSuave), font: { color: { argb: C.verde }, bold: true } } },
    ],
  });

  // Reparto por categoría, con el coste anual de lo recurrente al lado.
  hoja.getCell('H8').value = 'Categoría';
  hoja.getCell('I8').value = 'Gasto';
  hoja.getCell('J8').value = '% s/gasto';
  cabecera(hoja, 8, 22);

  CAT_PERSONAL.forEach((cat, i) => {
    const f = 9 + i;
    const fila = hoja.getRow(f);
    fila.getCell(8).value = cat;
    fila.getCell(9).value = { formula: `SUMIFS(${R.imp},${R.tipo},"Gasto",${R.cat},H${f})` };
    fila.getCell(10).value = { formula: `IFERROR(I${f}/${totGas},0)` };
    fila.getCell(9).numFmt = EUR;
    fila.getCell(10).numFmt = PCT;
    for (let c = 8; c <= 10; c++) fila.getCell(c).border = borde();
    fila.font = { name: 'Aptos Narrow', size: 10, color: { argb: C.texto } };
  });
  hoja.addConditionalFormatting({
    ref: `I9:I${8 + CAT_PERSONAL.length}`,
    rules: [{ type: 'dataBar', priority: 3, cfvo: [{ type: 'num', value: 0 }, { type: 'max' }], color: { argb: 'FFFCA5A5' } }],
  });

  const fRec = 9 + CAT_PERSONAL.length + 2;
  hoja.getCell(`H${fRec}`).value = 'GASTO RECURRENTE';
  hoja.getCell(`H${fRec}`).font = { name: 'Aptos Narrow', size: 10, bold: true, color: { argb: C.atenuado } };
  hoja.getCell(`H${fRec + 1}`).value = 'Total marcado como recurrente';
  hoja.getCell(`I${fRec + 1}`).value = { formula: `SUMIFS(${R.imp},${R.tipo},"Gasto",${R.rec},"Sí")` };
  hoja.getCell(`I${fRec + 1}`).numFmt = EUR;
  hoja.getCell(`H${fRec + 2}`).value = 'Equivalente a 12 meses';
  hoja.getCell(`I${fRec + 2}`).value = { formula: `I${fRec + 1}/MAX(1,COUNT(${R.mes}))*12` };
  hoja.getCell(`I${fRec + 2}`).numFmt = EUR;
  for (const c of [`H${fRec + 1}`, `I${fRec + 1}`, `H${fRec + 2}`, `I${fRec + 2}`]) {
    hoja.getCell(c).border = borde();
    hoja.getCell(c).font = { name: 'Aptos Narrow', size: 10, color: { argb: C.texto } };
  }
  return 'Hoja Resumen personal creada';
}

// ── Hoja Presupuestos ─────────────────────────────────────────────────────────
// Un tope mensual por categoría personal. Vacío = sin tope.
function crearPresupuestos(wb) {
  if (wb.getWorksheet('Presupuestos')) return null;

  const hoja = wb.addWorksheet('Presupuestos', { views: [{ state: 'frozen', ySplit: 4, showGridLines: false }] });
  hoja.columns = [{ width: 3 }, { width: 26 }, { width: 16 }, { width: 16 }, { width: 14 }, { width: 3 }];

  titulo(hoja, 'B2', 'Presupuestos', 'Tope de gasto al mes por categoría. Deja en blanco lo que no quieras limitar.');

  hoja.getRow(4).values = [null, 'Categoría', 'Tope mensual', 'Gasto este mes', 'Consumido'];
  cabecera(hoja, 4, 22);

  const R = {
    tipo: `Personal!$B$2:$B$${FILAS}`,
    cat: `Personal!$D$2:$D$${FILAS}`,
    imp: `Personal!$E$2:$E$${FILAS}`,
    mes: `Personal!$I$2:$I$${FILAS}`,
  };

  CAT_PERSONAL.forEach((cat, i) => {
    const f = 5 + i;
    const fila = hoja.getRow(f);
    fila.getCell(2).value = cat;
    fila.getCell(3).numFmt = EUR;
    fila.getCell(4).value = { formula: `SUMIFS(${R.imp},${R.tipo},"Gasto",${R.cat},B${f},${R.mes},MONTH(TODAY()))` };
    fila.getCell(4).numFmt = EUR;
    fila.getCell(5).value = { formula: `IF(N(C${f})=0,"",D${f}/C${f})` };
    fila.getCell(5).numFmt = PCT;
    for (let c = 2; c <= 5; c++) fila.getCell(c).border = borde();
    fila.font = { name: 'Aptos Narrow', size: 10, color: { argb: C.texto } };
  });

  const ultima = 4 + CAT_PERSONAL.length;
  const tot = hoja.getRow(ultima + 1);
  tot.getCell(2).value = 'TOTAL';
  tot.getCell(3).value = { formula: `SUM(C5:C${ultima})` };
  tot.getCell(4).value = { formula: `SUM(D5:D${ultima})` };
  tot.getCell(5).value = { formula: `IF(N(C${ultima + 1})=0,"",D${ultima + 1}/C${ultima + 1})` };
  for (let c = 2; c <= 5; c++) {
    tot.getCell(c).fill = relleno(C.tinta);
    tot.getCell(c).font = { name: 'Aptos Narrow', size: 11, bold: true, color: { argb: C.papel } };
    tot.getCell(c).border = borde(C.tinta);
  }
  tot.getCell(3).numFmt = EUR;
  tot.getCell(4).numFmt = EUR;
  tot.getCell(5).numFmt = PCT;
  tot.height = 24;

  // Semáforo: verde hasta el 80 %, ámbar hasta el 100 %, rojo pasado el tope.
  hoja.addConditionalFormatting({
    ref: `E5:E${ultima}`,
    rules: [
      { type: 'cellIs', operator: 'greaterThan', formulae: ['1'], priority: 1, style: { fill: relleno(C.rojoSuave), font: { color: { argb: C.rojo }, bold: true } } },
      { type: 'cellIs', operator: 'greaterThan', formulae: ['0.8'], priority: 2, style: { fill: relleno(C.ambarSuave), font: { color: { argb: C.ambar }, bold: true } } },
      { type: 'cellIs', operator: 'greaterThan', formulae: ['0'], priority: 3, style: { fill: relleno(C.verdeSuave), font: { color: { argb: C.verde } } } },
    ],
  });

  return 'Hoja Presupuestos creada';
}

// ── Hoja Hábitos ──────────────────────────────────────────────────────────────
// Una fila por día, una columna por hábito. Formato ancho a propósito: así se
// lee de un vistazo en Excel y se puede marcar a mano.
export const HABITOS = [
  { id: 'gym', nombre: 'Gimnasio' },
  { id: 'lectura', nombre: 'Lectura' },
  { id: 'negocio', nombre: 'Proyecto' },
  { id: 'carrera', nombre: 'Deporte' },
];

function crearHabitos(wb) {
  if (wb.getWorksheet('Habitos')) return null;

  const hoja = wb.addWorksheet('Habitos', { views: [{ state: 'frozen', ySplit: 1 }] });
  hoja.columns = [{ width: 13 }, ...HABITOS.map(() => ({ width: 13 })), { width: 10 }, { width: 11 }];

  hoja.getRow(1).values = ['Fecha', ...HABITOS.map((h) => h.nombre), 'Hechos', '% del día'];
  cabecera(hoja, 1, 24);
  hoja.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: HABITOS.length + 3 } };

  const ultima = HABITOS.length + 1; // última columna de hábito
  const colHechos = HABITOS.length + 2;
  const colPct = HABITOS.length + 3;
  const letra = (n) => String.fromCharCode(64 + n);

  for (let f = 2; f <= FILAS; f++) {
    const fila = hoja.getRow(f);
    fila.getCell(1).numFmt = FECHA;
    fila.getCell(colHechos).value = { formula: `IF(A${f}="","",COUNTIF(B${f}:${letra(ultima)}${f},"Sí"))` };
    fila.getCell(colHechos).alignment = { horizontal: 'center' };
    fila.getCell(colPct).value = { formula: `IF(A${f}="","",${letra(colHechos)}${f}/${HABITOS.length})` };
    fila.getCell(colPct).numFmt = PCT;
    fila.font = { name: 'Aptos Narrow', size: 10, color: { argb: C.texto } };

    for (let c = 2; c <= ultima; c++) {
      fila.getCell(c).alignment = { horizontal: 'center' };
      hoja.getCell(`${letra(c)}${f}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['=lstDeducible'] };
    }
  }

  hoja.addConditionalFormatting({
    ref: `B2:${letra(ultima)}${FILAS}`,
    rules: [{ type: 'cellIs', operator: 'equal', formulae: ['"Sí"'], priority: 1, style: { fill: relleno(C.verdeSuave), font: { color: { argb: C.verde }, bold: true } } }],
  });

  hoja.addConditionalFormatting({
    ref: `${letra(colPct)}2:${letra(colPct)}${FILAS}`,
    rules: [{ type: 'dataBar', priority: 2, cfvo: [{ type: 'num', value: 0 }, { type: 'num', value: 1 }], color: { argb: 'FF86EFAC' } }],
  });

  return 'Hoja Habitos creada';
}

/**
 * Añade al libro todo lo de la parte personal. Idempotente.
 * Devuelve la lista de cambios aplicados (vacía si no hacía falta nada).
 */
export function ampliarLibro(wb) {
  return [
    ampliarCategorias(wb),
    crearPersonal(wb),
    crearObjetivos(wb),
    crearResumenPersonal(wb),
    crearPresupuestos(wb),
    crearHabitos(wb),
  ].filter(Boolean);
}
