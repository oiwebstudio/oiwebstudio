// Genera datos/Finanzas.xlsx — la fuente de la verdad del panel.
// Uso:  npm run excel          (respeta el archivo existente si ya hay uno)
//       npm run excel -- --force   (lo sobrescribe)
//       npm run excel -- --vacio   (sin movimientos de ejemplo)

import ExcelJS from 'exceljs';
import { C, EUR, EUR_ROJO, FECHA, MESES, PCT, borde, cabecera, relleno, tarjetaKpi, titulo } from './estilo-excel.mjs';
import { ampliarLibro } from './hojas-vida.mjs';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DESTINO = resolve(RAIZ, 'datos', 'Finanzas.xlsx');
const FORZAR = process.argv.includes('--force');
const VACIO = process.argv.includes('--vacio');
const EJERCICIO = Number(process.argv.find((a) => /^--anio=\d{4}$/.test(a))?.slice(7)) || 2026;

const FILAS = 1000; // hasta dónde llegan fórmulas y validaciones

// ── Listas maestras ───────────────────────────────────────────────────────────
const CAT_INGRESO = [
  'Diseño web',
  'Mantenimiento web',
  'SEO local',
  'Automatizaciones',
  'Fotografía / contenido',
  'Consultoría',
  'Otros ingresos',
];

const CAT_GASTO = [
  'Hosting y dominios',
  'Software y licencias',
  'Publicidad',
  'Formación',
  'Material y equipo',
  'Desplazamientos',
  'Suministros oficina',
  'Gestoría',
  'Cuota autónomos',
  'Comisiones bancarias',
  'Subcontratación',
  'Otros gastos',
];

const METODOS = ['Banco', 'Tarjeta', 'Efectivo', 'Bizum', 'Domiciliado'];
const ESTADOS = ['Cobrado', 'Pendiente', 'Pagado'];
const IVAS = [0, 4, 10, 21];

// ── Movimientos de ejemplo ────────────────────────────────────────────────────
function ejemplos(anio) {
  const m = [];
  const add = (mes, dia, tipo, concepto, cat, quien, base, iva, metodo, estado, deducible) =>
    // UTC a propósito: ExcelJS serializa en UTC y así la fecha no se desplaza un día.
    m.push({ fecha: new Date(Date.UTC(anio, mes - 1, dia)), tipo, concepto, cat, quien, base, iva, metodo, estado, deducible });

  // Ingresos recurrentes: mantenimientos
  const mantenimientos = [
    ['Errotatxo Tolosa', 45],
    ['Floristería Tallo', 35],
    ['Clínica Aranzabal', 60],
  ];
  for (let mes = 1; mes <= 12; mes++) {
    for (const [cliente, importe] of mantenimientos) {
      add(mes, 3, 'Ingreso', `Mantenimiento web ${MESES[mes - 1]}`, 'Mantenimiento web', cliente, importe, 21, 'Banco', 'Cobrado', 'No');
    }
    add(mes, 5, 'Gasto', 'Cuota autónomos', 'Cuota autónomos', 'Seguridad Social', 294, 0, 'Domiciliado', 'Pagado', 'Sí');
    add(mes, 8, 'Gasto', 'Hosting compartido', 'Hosting y dominios', 'Hostinger', 12.9, 21, 'Tarjeta', 'Pagado', 'Sí');
    add(mes, 10, 'Gasto', 'Suite de diseño', 'Software y licencias', 'Adobe', 29.99, 21, 'Tarjeta', 'Pagado', 'Sí');
    add(mes, 12, 'Gasto', 'Gestoría mensual', 'Gestoría', 'Asesoría Loiola', 60, 21, 'Domiciliado', 'Pagado', 'Sí');
  }

  // Proyectos
  add(1, 14, 'Ingreso', 'Web corporativa 6 páginas', 'Diseño web', 'Errotatxo Tolosa', 1450, 21, 'Banco', 'Cobrado', 'No');
  add(2, 2, 'Ingreso', 'Landing + reservas', 'Diseño web', 'Floristería Tallo', 890, 21, 'Banco', 'Cobrado', 'No');
  add(2, 21, 'Ingreso', 'Auditoría SEO local', 'SEO local', 'Panadería Zubieta', 380, 21, 'Banco', 'Cobrado', 'No');
  add(3, 9, 'Ingreso', 'Automatización de reservas n8n', 'Automatizaciones', 'Clínica Aranzabal', 1200, 21, 'Banco', 'Cobrado', 'No');
  add(3, 27, 'Ingreso', 'Rediseño tienda online', 'Diseño web', 'Deportes Ibarra', 2100, 21, 'Banco', 'Cobrado', 'No');
  add(4, 11, 'Ingreso', 'Sesión de fotos producto', 'Fotografía / contenido', 'Floristería Tallo', 450, 21, 'Bizum', 'Cobrado', 'No');
  add(5, 6, 'Ingreso', 'Web restaurante + carta digital', 'Diseño web', 'Asador Beko', 1750, 21, 'Banco', 'Cobrado', 'No');
  add(5, 23, 'Ingreso', 'Consultoría estrategia digital', 'Consultoría', 'Ayto. Anoeta', 600, 21, 'Banco', 'Cobrado', 'No');
  add(6, 15, 'Ingreso', 'SEO local 3 meses', 'SEO local', 'Deportes Ibarra', 900, 21, 'Banco', 'Cobrado', 'No');
  add(7, 4, 'Ingreso', 'Web peluquería', 'Diseño web', 'Estética Nahia', 1180, 21, 'Banco', 'Cobrado', 'No');
  add(7, 30, 'Ingreso', 'Chatbot de reservas', 'Automatizaciones', 'Asador Beko', 750, 21, 'Banco', 'Pendiente', 'No');
  add(9, 12, 'Ingreso', 'Web taller mecánico', 'Diseño web', 'Talleres Otegi', 1320, 21, 'Banco', 'Cobrado', 'No');
  add(10, 8, 'Ingreso', 'Campaña Google Ads setup', 'Consultoría', 'Deportes Ibarra', 500, 21, 'Banco', 'Cobrado', 'No');
  add(10, 24, 'Ingreso', 'Web clínica dental', 'Diseño web', 'Dental Amara', 1980, 21, 'Banco', 'Pendiente', 'No');
  add(11, 17, 'Ingreso', 'Contenido redes trimestre', 'Fotografía / contenido', 'Estética Nahia', 720, 21, 'Bizum', 'Cobrado', 'No');
  add(12, 3, 'Ingreso', 'Automatización facturación', 'Automatizaciones', 'Talleres Otegi', 950, 21, 'Banco', 'Pendiente', 'No');

  // Gastos puntuales
  add(1, 20, 'Gasto', 'Dominios .com y .eus (renovación)', 'Hosting y dominios', 'Namecheap', 58, 21, 'Tarjeta', 'Pagado', 'Sí');
  add(2, 14, 'Gasto', 'Curso de accesibilidad web', 'Formación', 'Udemy', 74.5, 21, 'Tarjeta', 'Pagado', 'Sí');
  add(3, 2, 'Gasto', 'Monitor 27" 4K', 'Material y equipo', 'PcComponentes', 289, 21, 'Tarjeta', 'Pagado', 'Sí');
  add(3, 19, 'Gasto', 'Campaña Meta Ads', 'Publicidad', 'Meta', 150, 21, 'Tarjeta', 'Pagado', 'Sí');
  add(4, 7, 'Gasto', 'Tren Tolosa–Bilbao (cliente)', 'Desplazamientos', 'Euskotren', 18.4, 10, 'Tarjeta', 'Pagado', 'Sí');
  add(4, 25, 'Gasto', 'Banco de imágenes anual', 'Software y licencias', 'Envato', 199, 21, 'Tarjeta', 'Pagado', 'Sí');
  add(5, 18, 'Gasto', 'Maquetador freelance', 'Subcontratación', 'J. Etxeberria', 400, 21, 'Banco', 'Pagado', 'Sí');
  add(6, 5, 'Gasto', 'Material de oficina', 'Suministros oficina', 'Ofimarket', 46.2, 21, 'Tarjeta', 'Pagado', 'Sí');
  add(6, 22, 'Gasto', 'Campaña Google Ads', 'Publicidad', 'Google', 220, 21, 'Tarjeta', 'Pagado', 'Sí');
  add(7, 11, 'Gasto', 'Comisiones y mantenimiento', 'Comisiones bancarias', 'Laboral Kutxa', 12, 0, 'Banco', 'Pagado', 'Sí');
  add(9, 3, 'Gasto', 'Portátil de trabajo', 'Material y equipo', 'Apple', 1499, 21, 'Tarjeta', 'Pagado', 'Sí');
  add(9, 28, 'Gasto', 'Copywriter externa', 'Subcontratación', 'M. Aguirre', 320, 21, 'Banco', 'Pagado', 'Sí');
  add(10, 15, 'Gasto', 'Curso de automatizaciones n8n', 'Formación', 'n8n Academy', 129, 21, 'Tarjeta', 'Pagado', 'Sí');
  add(11, 9, 'Gasto', 'Campaña Black Friday', 'Publicidad', 'Meta', 300, 21, 'Tarjeta', 'Pagado', 'Sí');
  add(11, 26, 'Gasto', 'Servidor VPS anual', 'Hosting y dominios', 'Hetzner', 84, 21, 'Tarjeta', 'Pagado', 'Sí');
  add(12, 14, 'Gasto', 'Comida con cliente', 'Desplazamientos', 'Asador Beko', 62, 10, 'Tarjeta', 'Pagado', 'Sí');

  return m.sort((a, b) => a.fecha - b.fecha);
}

// ═══════════════════════════════════════════════════════════════════════════════
async function construir() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'OI STUDIO — Panel de finanzas';
  wb.created = new Date();
  wb.views = [{ x: 0, y: 0, width: 20000, height: 12000, firstSheet: 0, activeTab: 0 }];

  // ── Hoja: Movimientos ───────────────────────────────────────────────────────
  const mov = wb.addWorksheet('Movimientos', {
    views: [{ state: 'frozen', ySplit: 1, xSplit: 3 }],
    properties: { defaultRowHeight: 18 },
  });

  const COLS = [
    { key: 'fecha', header: 'Fecha', width: 12 },
    { key: 'tipo', header: 'Tipo', width: 10 },
    { key: 'concepto', header: 'Concepto', width: 38 },
    { key: 'cat', header: 'Categoría', width: 22 },
    { key: 'quien', header: 'Cliente / Proveedor', width: 22 },
    { key: 'base', header: 'Base', width: 13 },
    { key: 'ivaPct', header: 'IVA %', width: 8 },
    { key: 'ivaEur', header: 'IVA €', width: 12 },
    { key: 'total', header: 'Total', width: 13 },
    { key: 'metodo', header: 'Método', width: 13 },
    { key: 'estado', header: 'Estado', width: 12 },
    { key: 'deducible', header: 'Deducible', width: 11 },
    { key: 'mes', header: 'Mes', width: 6 },
    { key: 'trim', header: 'Trim.', width: 7 },
    { key: 'notas', header: 'Notas', width: 30 },
  ];
  mov.columns = COLS.map(({ key, width }) => ({ key, width }));
  mov.getRow(1).values = COLS.map((c) => c.header);
  cabecera(mov, 1, 24);
  mov.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: COLS.length } };

  const datos = VACIO ? [] : ejemplos(EJERCICIO);
  datos.forEach((d, i) => {
    const f = i + 2;
    mov.getRow(f).values = {
      fecha: d.fecha,
      tipo: d.tipo,
      concepto: d.concepto,
      cat: d.cat,
      quien: d.quien,
      base: d.base,
      ivaPct: d.iva / 100,
      metodo: d.metodo,
      estado: d.estado,
      deducible: d.deducible,
      notas: '',
    };
  });

  // Fórmulas y formato hasta FILAS, para que añadir filas nuevas ya funcione.
  for (let f = 2; f <= FILAS; f++) {
    const fila = mov.getRow(f);
    fila.getCell('fecha').numFmt = FECHA;
    fila.getCell('base').numFmt = EUR;
    fila.getCell('ivaPct').numFmt = '0%';
    fila.getCell('ivaEur').value = { formula: `IF(F${f}="","",F${f}*G${f})` };
    fila.getCell('ivaEur').numFmt = EUR;
    fila.getCell('total').value = { formula: `IF(F${f}="","",F${f}+H${f})` };
    fila.getCell('total').numFmt = EUR;
    fila.getCell('mes').value = { formula: `IF(A${f}="","",MONTH(A${f}))` };
    fila.getCell('trim').value = { formula: `IF(A${f}="","","T"&ROUNDUP(MONTH(A${f})/3,0))` };
    fila.getCell('trim').alignment = { horizontal: 'center' };
    fila.getCell('mes').alignment = { horizontal: 'center' };
    fila.getCell('tipo').alignment = { horizontal: 'center' };
    fila.getCell('estado').alignment = { horizontal: 'center' };
    fila.getCell('deducible').alignment = { horizontal: 'center' };
    fila.font = { name: 'Aptos Narrow', size: 10, color: { argb: C.texto } };
  }

  // Filas alternas + semáforo por tipo + estado pendiente
  mov.addConditionalFormatting({
    ref: `A2:O${FILAS}`,
    rules: [
      { type: 'expression', formulae: [`$B2="Ingreso"`], priority: 3, style: { font: { color: { argb: C.verde } } } },
      { type: 'expression', formulae: [`$B2="Gasto"`], priority: 4, style: { font: { color: { argb: C.texto } } } },
      { type: 'expression', formulae: [`AND($A2<>"",MOD(ROW(),2)=0)`], priority: 5, style: { fill: relleno('FFF8FAFC') } },
    ],
  });
  mov.addConditionalFormatting({
    ref: `K2:K${FILAS}`,
    rules: [{ type: 'expression', formulae: [`$K2="Pendiente"`], priority: 1, style: { fill: relleno('FFFEF3C7'), font: { bold: true, color: { argb: 'FF92400E' } } } }],
  });
  mov.addConditionalFormatting({
    ref: `I2:I${FILAS}`,
    rules: [{ type: 'dataBar', priority: 2, cfvo: [{ type: 'min' }, { type: 'max' }], color: { argb: 'FFBFD4F5' } }],
  });

  // ── Hoja: Categorias (listas maestras) ──────────────────────────────────────
  const cats = wb.addWorksheet('Categorias', { views: [{ state: 'frozen', ySplit: 1 }] });
  cats.columns = [
    { key: 'todas', width: 24 },
    { key: 'ing', width: 24 },
    { key: 'gas', width: 24 },
    { key: 'tipo', width: 12 },
    { key: 'iva', width: 10 },
    { key: 'metodo', width: 14 },
    { key: 'estado', width: 14 },
    { key: 'ded', width: 12 },
  ];
  cats.getRow(1).values = ['Todas las categorías', 'Categorías de ingreso', 'Categorías de gasto', 'Tipo', 'IVA %', 'Método', 'Estado', 'Deducible'];
  cabecera(cats, 1, 24);

  const TODAS = [...CAT_INGRESO, ...CAT_GASTO];
  const maxLista = Math.max(TODAS.length, METODOS.length, ESTADOS.length, IVAS.length, 2);
  for (let i = 0; i < maxLista; i++) {
    const f = cats.getRow(i + 2);
    f.getCell(1).value = TODAS[i] ?? null;
    f.getCell(2).value = CAT_INGRESO[i] ?? null;
    f.getCell(3).value = CAT_GASTO[i] ?? null;
    f.getCell(4).value = ['Ingreso', 'Gasto'][i] ?? null;
    if (IVAS[i] !== undefined) {
      f.getCell(5).value = IVAS[i] / 100;
      f.getCell(5).numFmt = '0%';
    }
    f.getCell(6).value = METODOS[i] ?? null;
    f.getCell(7).value = ESTADOS[i] ?? null;
    f.getCell(8).value = ['Sí', 'No'][i] ?? null;
    f.font = { name: 'Aptos Narrow', size: 10, color: { argb: C.texto } };
  }
  cats.getCell(`A${maxLista + 4}`).value = 'Añade categorías nuevas al final de cada columna: los desplegables de Movimientos se actualizan solos.';
  cats.getCell(`A${maxLista + 4}`).font = { name: 'Aptos Narrow', size: 9, italic: true, color: { argb: C.atenuado } };

  // Nombres definidos → validaciones estables y compatibles
  wb.definedNames.add(`Categorias!$A$2:$A$${maxLista + 1}`, 'lstCategorias');
  wb.definedNames.add('Categorias!$D$2:$D$3', 'lstTipo');
  wb.definedNames.add('Categorias!$E$2:$E$5', 'lstIva');
  wb.definedNames.add(`Categorias!$F$2:$F$${METODOS.length + 1}`, 'lstMetodo');
  wb.definedNames.add(`Categorias!$G$2:$G$${ESTADOS.length + 1}`, 'lstEstado');
  wb.definedNames.add('Categorias!$H$2:$H$3', 'lstDeducible');

  const validar = (col, nombre, mensaje) => {
    for (let f = 2; f <= FILAS; f++) {
      mov.getCell(`${col}${f}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`=${nombre}`],
        showErrorMessage: true,
        errorStyle: 'warning',
        errorTitle: 'Valor no reconocido',
        error: mensaje,
      };
    }
  };
  validar('B', 'lstTipo', 'Usa Ingreso o Gasto.');
  validar('D', 'lstCategorias', 'Elige una categoría de la hoja Categorias (o añádela allí).');
  validar('G', 'lstIva', 'IVA habitual: 0%, 4%, 10% o 21%.');
  validar('J', 'lstMetodo', 'Elige un método de pago de la lista.');
  validar('K', 'lstEstado', 'Cobrado, Pendiente o Pagado.');
  validar('L', 'lstDeducible', 'Sí o No.');

  // Rangos usados en fórmulas
  const R = {
    fecha: `Movimientos!$A$2:$A$${FILAS}`,
    tipo: `Movimientos!$B$2:$B$${FILAS}`,
    cat: `Movimientos!$D$2:$D$${FILAS}`,
    quien: `Movimientos!$E$2:$E$${FILAS}`,
    base: `Movimientos!$F$2:$F$${FILAS}`,
    ivaEur: `Movimientos!$H$2:$H$${FILAS}`,
    estado: `Movimientos!$K$2:$K$${FILAS}`,
    ded: `Movimientos!$L$2:$L$${FILAS}`,
    mes: `Movimientos!$M$2:$M$${FILAS}`,
    trim: `Movimientos!$N$2:$N$${FILAS}`,
  };

  // ── Hoja: Resumen (mes × concepto) ──────────────────────────────────────────
  const res = wb.addWorksheet('Resumen', { views: [{ state: 'frozen', ySplit: 4, showGridLines: false }] });
  res.columns = [
    { width: 3 }, { width: 14 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 12 }, { width: 3 },
  ];
  titulo(res, 'B2', `Resumen ${EJERCICIO}`, 'Todo se calcula con SUMIFS sobre la hoja Movimientos. No escribas aquí.');

  res.getRow(4).values = [null, 'Mes', 'Ingresos', 'Gastos', 'Neto', 'Neto acumulado', 'Margen'];
  cabecera(res, 4, 22);

  for (let i = 0; i < 12; i++) {
    const f = 5 + i;
    const fila = res.getRow(f);
    fila.getCell(2).value = MESES[i];
    fila.getCell(3).value = { formula: `SUMIFS(${R.base},${R.tipo},"Ingreso",${R.mes},${i + 1})` };
    fila.getCell(4).value = { formula: `SUMIFS(${R.base},${R.tipo},"Gasto",${R.mes},${i + 1})` };
    fila.getCell(5).value = { formula: `C${f}-D${f}` };
    fila.getCell(6).value = { formula: i === 0 ? `E${f}` : `F${f - 1}+E${f}` };
    fila.getCell(7).value = { formula: `IF(C${f}=0,"",E${f}/C${f})` };
    for (let c = 3; c <= 6; c++) fila.getCell(c).numFmt = EUR_ROJO;
    fila.getCell(7).numFmt = PCT;
    fila.height = 20;
    fila.font = { name: 'Aptos Narrow', size: 10, color: { argb: C.texto } };
    for (let c = 2; c <= 7; c++) fila.getCell(c).border = borde();
  }

  const fTot = 17;
  const tot = res.getRow(fTot);
  tot.getCell(2).value = 'TOTAL';
  tot.getCell(3).value = { formula: 'SUM(C5:C16)' };
  tot.getCell(4).value = { formula: 'SUM(D5:D16)' };
  tot.getCell(5).value = { formula: 'C17-D17' };
  tot.getCell(6).value = { formula: 'E17' };
  tot.getCell(7).value = { formula: 'IF(C17=0,"",E17/C17)' };
  for (let c = 3; c <= 6; c++) tot.getCell(c).numFmt = EUR_ROJO;
  tot.getCell(7).numFmt = PCT;
  tot.height = 24;
  for (let c = 2; c <= 7; c++) {
    tot.getCell(c).fill = relleno(C.tinta);
    tot.getCell(c).font = { name: 'Aptos Narrow', size: 11, bold: true, color: { argb: C.papel } };
    tot.getCell(c).border = borde(C.tinta);
  }

  res.addConditionalFormatting({
    ref: 'C5:C16',
    rules: [{ type: 'dataBar', priority: 1, cfvo: [{ type: 'num', value: 0 }, { type: 'max' }], color: { argb: 'FF86EFAC' } }],
  });
  res.addConditionalFormatting({
    ref: 'D5:D16',
    rules: [{ type: 'dataBar', priority: 2, cfvo: [{ type: 'num', value: 0 }, { type: 'max' }], color: { argb: 'FFFCA5A5' } }],
  });
  res.addConditionalFormatting({
    ref: 'E5:E16',
    rules: [
      { type: 'cellIs', operator: 'lessThan', formulae: ['0'], priority: 3, style: { fill: relleno(C.rojoSuave), font: { color: { argb: C.rojo }, bold: true } } },
      { type: 'cellIs', operator: 'greaterThan', formulae: ['0'], priority: 4, style: { fill: relleno(C.verdeSuave), font: { color: { argb: C.verde }, bold: true } } },
    ],
  });

  // ── Hoja: Dashboard ─────────────────────────────────────────────────────────
  const dash = wb.addWorksheet('Dashboard', { views: [{ showGridLines: false, state: 'frozen', ySplit: 3 }] });
  dash.columns = [
    { width: 3 }, { width: 22 }, { width: 9 }, { width: 9 }, { width: 3 },
    { width: 22 }, { width: 9 }, { width: 9 }, { width: 3 },
    { width: 22 }, { width: 9 }, { width: 9 }, { width: 3 },
  ];
  titulo(dash, 'B2', `Cuadro de mando ${EJERCICIO}`, 'Los importes son base imponible (sin IVA). El IVA se liquida en la hoja IVA.');

  const totIng = `SUMIFS(${R.base},${R.tipo},"Ingreso")`;
  const totGas = `SUMIFS(${R.base},${R.tipo},"Gasto")`;

  tarjetaKpi(dash, 2, 5, 'Ingresos', totIng, EUR, C.verde);
  tarjetaKpi(dash, 6, 5, 'Gastos', totGas, EUR, C.rojo);
  tarjetaKpi(dash, 10, 5, 'Beneficio neto', `${totIng}-${totGas}`, EUR_ROJO, C.tinta);
  tarjetaKpi(dash, 2, 8, 'Margen neto', `IFERROR((${totIng}-${totGas})/${totIng},0)`, PCT, C.tinta);
  tarjetaKpi(dash, 6, 8, 'Pendiente de cobro', `SUMIFS(Movimientos!$I$2:$I$${FILAS},${R.tipo},"Ingreso",${R.estado},"Pendiente")`, EUR, 'FF92400E');
  tarjetaKpi(dash, 10, 8, 'Ticket medio proyecto', `IFERROR(AVERAGEIFS(${R.base},${R.tipo},"Ingreso",${R.cat},"Diseño web"),0)`, EUR, C.tinta);

  // Bloque: gasto por categoría
  dash.getCell('B12').value = 'GASTO POR CATEGORÍA';
  dash.getCell('B12').font = { name: 'Aptos Narrow', size: 10, bold: true, color: { argb: C.atenuado } };
  dash.getRow(13).values = [null, 'Categoría', 'Importe', '% s/gasto'];
  cabecera(dash, 13, 20);
  CAT_GASTO.forEach((c, i) => {
    const f = 14 + i;
    const fila = dash.getRow(f);
    fila.getCell(2).value = c;
    fila.getCell(3).value = { formula: `SUMIFS(${R.base},${R.tipo},"Gasto",${R.cat},B${f})` };
    fila.getCell(4).value = { formula: `IFERROR(C${f}/${totGas},0)` };
    fila.getCell(3).numFmt = EUR;
    fila.getCell(4).numFmt = PCT;
    fila.font = { name: 'Aptos Narrow', size: 10, color: { argb: C.texto } };
    for (let cc = 2; cc <= 4; cc++) fila.getCell(cc).border = borde();
  });
  dash.addConditionalFormatting({
    ref: `C14:C${13 + CAT_GASTO.length}`,
    rules: [{ type: 'dataBar', priority: 10, cfvo: [{ type: 'num', value: 0 }, { type: 'max' }], color: { argb: 'FFFCA5A5' } }],
  });

  // Bloque: ingreso por categoría
  dash.getCell('F12').value = 'INGRESO POR CATEGORÍA';
  dash.getCell('F12').font = { name: 'Aptos Narrow', size: 10, bold: true, color: { argb: C.atenuado } };
  dash.getRow(13).getCell(6).value = 'Categoría';
  dash.getRow(13).getCell(7).value = 'Importe';
  dash.getRow(13).getCell(8).value = '% s/ingreso';
  CAT_INGRESO.forEach((c, i) => {
    const f = 14 + i;
    const fila = dash.getRow(f);
    fila.getCell(6).value = c;
    fila.getCell(7).value = { formula: `SUMIFS(${R.base},${R.tipo},"Ingreso",${R.cat},F${f})` };
    fila.getCell(8).value = { formula: `IFERROR(G${f}/${totIng},0)` };
    fila.getCell(7).numFmt = EUR;
    fila.getCell(8).numFmt = PCT;
    for (let cc = 6; cc <= 8; cc++) fila.getCell(cc).border = borde();
  });
  dash.addConditionalFormatting({
    ref: `G14:G${13 + CAT_INGRESO.length}`,
    rules: [{ type: 'dataBar', priority: 11, cfvo: [{ type: 'num', value: 0 }, { type: 'max' }], color: { argb: 'FF86EFAC' } }],
  });

  // Bloque: mes a mes
  dash.getCell('J12').value = 'NETO MES A MES';
  dash.getCell('J12').font = { name: 'Aptos Narrow', size: 10, bold: true, color: { argb: C.atenuado } };
  dash.getRow(13).getCell(10).value = 'Mes';
  dash.getRow(13).getCell(11).value = 'Neto';
  dash.getRow(13).getCell(12).value = 'Acumulado';
  cabecera(dash, 13, 20);
  for (let i = 0; i < 12; i++) {
    const f = 14 + i;
    const fila = dash.getRow(f);
    fila.getCell(10).value = MESES[i];
    fila.getCell(11).value = { formula: `Resumen!E${5 + i}` };
    fila.getCell(12).value = { formula: `Resumen!F${5 + i}` };
    fila.getCell(11).numFmt = EUR_ROJO;
    fila.getCell(12).numFmt = EUR_ROJO;
    for (let cc = 10; cc <= 12; cc++) fila.getCell(cc).border = borde();
  }
  dash.addConditionalFormatting({
    ref: 'K14:K25',
    rules: [{ type: 'dataBar', priority: 12, cfvo: [{ type: 'min' }, { type: 'max' }], color: { argb: 'FFA5B4FC' } }],
  });

  // Top clientes
  dash.getCell('B28').value = 'TOP CLIENTES POR FACTURACIÓN';
  dash.getCell('B28').font = { name: 'Aptos Narrow', size: 10, bold: true, color: { argb: C.atenuado } };
  dash.getRow(29).values = [null, 'Cliente', 'Facturado'];
  cabecera(dash, 29, 20);
  const clientes = [...new Set(datos.filter((d) => d.tipo === 'Ingreso').map((d) => d.quien))];
  clientes.forEach((cl, i) => {
    const f = 30 + i;
    const fila = dash.getRow(f);
    fila.getCell(2).value = cl;
    fila.getCell(3).value = { formula: `SUMIFS(${R.base},${R.tipo},"Ingreso",${R.quien},B${f})` };
    fila.getCell(3).numFmt = EUR;
    for (let cc = 2; cc <= 3; cc++) fila.getCell(cc).border = borde();
  });
  if (clientes.length) {
    dash.addConditionalFormatting({
      ref: `C30:C${29 + clientes.length}`,
      rules: [{ type: 'dataBar', priority: 13, cfvo: [{ type: 'num', value: 0 }, { type: 'max' }], color: { argb: 'FF93C5FD' } }],
    });
  }

  // ── Hoja: IVA ───────────────────────────────────────────────────────────────
  const iva = wb.addWorksheet('IVA', { views: [{ showGridLines: false, state: 'frozen', ySplit: 4 }] });
  iva.columns = [{ width: 3 }, { width: 14 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 16 }, { width: 3 }];
  titulo(iva, 'B2', `IVA ${EJERCICIO}`, 'Estimación orientativa por trimestre. Confírmala siempre con tu gestoría.');
  iva.getRow(4).values = [null, 'Trimestre', 'IVA repercutido', 'IVA soportado', 'Resultado', 'Base facturada'];
  cabecera(iva, 4, 22);

  for (let t = 1; t <= 4; t++) {
    const f = 4 + t;
    const fila = iva.getRow(f);
    fila.getCell(2).value = `T${t}`;
    fila.getCell(3).value = { formula: `SUMIFS(${R.ivaEur},${R.tipo},"Ingreso",${R.trim},"T${t}")` };
    fila.getCell(4).value = { formula: `SUMIFS(${R.ivaEur},${R.tipo},"Gasto",${R.trim},"T${t}",${R.ded},"Sí")` };
    fila.getCell(5).value = { formula: `C${f}-D${f}` };
    fila.getCell(6).value = { formula: `SUMIFS(${R.base},${R.tipo},"Ingreso",${R.trim},"T${t}")` };
    for (let c = 3; c <= 6; c++) {
      fila.getCell(c).numFmt = EUR_ROJO;
      fila.getCell(c).border = borde();
    }
    fila.getCell(2).border = borde();
    fila.height = 22;
    fila.font = { name: 'Aptos Narrow', size: 10, color: { argb: C.texto } };
  }
  const fIvaTot = 9;
  const it = iva.getRow(fIvaTot);
  it.getCell(2).value = 'AÑO';
  it.getCell(3).value = { formula: 'SUM(C5:C8)' };
  it.getCell(4).value = { formula: 'SUM(D5:D8)' };
  it.getCell(5).value = { formula: 'C9-D9' };
  it.getCell(6).value = { formula: 'SUM(F5:F8)' };
  for (let c = 2; c <= 6; c++) {
    it.getCell(c).fill = relleno(C.tinta);
    it.getCell(c).font = { name: 'Aptos Narrow', size: 11, bold: true, color: { argb: C.papel } };
    it.getCell(c).border = borde(C.tinta);
    if (c >= 3) it.getCell(c).numFmt = EUR_ROJO;
  }
  it.height = 24;

  iva.getCell('B11').value = 'Resultado positivo = te toca ingresar a Hacienda. Negativo = sale a compensar.';
  iva.getCell('B11').font = { name: 'Aptos Narrow', size: 9, italic: true, color: { argb: C.atenuado } };
  iva.addConditionalFormatting({
    ref: 'E5:E8',
    rules: [
      { type: 'cellIs', operator: 'greaterThan', formulae: ['0'], priority: 1, style: { fill: relleno(C.rojoSuave), font: { color: { argb: C.rojo }, bold: true } } },
      { type: 'cellIs', operator: 'lessThan', formulae: ['0'], priority: 2, style: { fill: relleno(C.verdeSuave), font: { color: { argb: C.verde }, bold: true } } },
    ],
  });

  // ── Parte personal: Personal, Objetivos y Resumen personal ──────────────────
  ampliarLibro(wb);

  // ── Guardar ─────────────────────────────────────────────────────────────────
  mkdirSync(dirname(DESTINO), { recursive: true });
  await wb.xlsx.writeFile(DESTINO);
  return { filas: datos.length };
}

if (existsSync(DESTINO) && !FORZAR) {
  console.error(`\n  Ya existe ${DESTINO}`);
  console.error('  No lo sobrescribo para no perder tus datos.');
  console.error('  Si quieres regenerarlo igualmente:  npm run excel -- --force\n');
  process.exit(1);
}

const { filas } = await construir();
console.log(`\n  Excel generado: ${DESTINO}`);
console.log(`  ${filas} movimientos de ejemplo · ejercicio ${EJERCICIO}`);
console.log('  Hojas: Movimientos · Categorias · Resumen · Dashboard · IVA');
console.log('         Personal · Objetivos · Resumen personal\n');
