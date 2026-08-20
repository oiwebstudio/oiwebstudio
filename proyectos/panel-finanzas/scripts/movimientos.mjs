// Escritura en datos/Finanzas.xlsx: movimientos (negocio y personal) y objetivos.
// Lo usan el servidor y la línea de comandos. El Excel sigue siendo la única fuente.

import ExcelJS from 'exceljs';
import { copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const LIBRO = resolve(RAIZ, 'datos', 'Finanzas.xlsx');
const RESPALDO = resolve(RAIZ, 'datos', 'Finanzas.respaldo.xlsx');

const EUR = '#,##0.00\\ €';
const FECHA = 'dd/mm/yyyy';
const PRIMERA_FILA = 2;

// ── Los dos ámbitos, con su hoja y su reparto de columnas ─────────────────────
const AMBITOS = {
  negocio: {
    hoja: 'Movimientos',
    col: { fecha: 1, tipo: 2, concepto: 3, categoria: 4, quien: 5, base: 6, ivaPct: 7, metodo: 10, estado: 11, deducible: 12, notas: 15 },
    formatos: { 1: FECHA, 6: EUR, 7: '0%' },
    formulas: (f) => [
      [8, `IF(F${f}="","",F${f}*G${f})`],
      [9, `IF(F${f}="","",F${f}+H${f})`],
      [13, `IF(A${f}="","",MONTH(A${f}))`],
      [14, `IF(A${f}="","","T"&ROUNDUP(MONTH(A${f})/3,0))`],
    ],
    porDefecto: { categoria: 'Otros gastos', metodo: 'Banco', estado: 'Pagado' },
  },
  personal: {
    hoja: 'Personal',
    col: { fecha: 1, tipo: 2, concepto: 3, categoria: 4, base: 5, metodo: 6, recurrente: 7, notas: 8 },
    formatos: { 1: FECHA, 5: EUR },
    formulas: (f) => [[9, `IF(A${f}="","",MONTH(A${f}))`]],
    porDefecto: { categoria: 'Otros gastos', metodo: 'Tarjeta' },
  },
};

const HOJA_OBJETIVOS = 'Objetivos';
const COL_OBJ = { nombre: 1, area: 2, plazo: 3, tipo: 4, meta: 5, progreso: 6, unidad: 7, inicio: 8, limite: 9, estado: 10, notas: 11 };
const PLAZOS = ['Día', 'Semana', 'Mes', 'Año', 'Largo plazo'];

const texto = (v) => String(v ?? '').trim();

function ambitoDe(nombre) {
  const a = AMBITOS[texto(nombre).toLowerCase() || 'negocio'];
  if (!a) throw new Error('Ámbito desconocido: usa "negocio" o "personal".');
  return a;
}

function aFechaUTC(v) {
  if (v instanceof Date) return new Date(Date.UTC(v.getFullYear(), v.getMonth(), v.getDate()));
  const m = texto(v).match(/^(\d{4})-(\d{2})-(\d{2})$/); // el input date del navegador
  if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  const d = new Date(v);
  if (isNaN(d)) throw new Error('Fecha no válida.');
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

const aNumero = (v) => Number(String(v ?? '').replace(',', '.'));

function validar(mov, ambito) {
  const base = aNumero(mov.base);
  if (!Number.isFinite(base) || base <= 0) throw new Error('El importe debe ser un número mayor que cero.');
  if (!texto(mov.concepto)) throw new Error('Falta el concepto.');

  const comun = {
    fecha: aFechaUTC(mov.fecha),
    tipo: texto(mov.tipo).toLowerCase().startsWith('ing') ? 'Ingreso' : 'Gasto',
    concepto: texto(mov.concepto),
    categoria: texto(mov.categoria) || ambito.porDefecto.categoria,
    base: Math.round(base * 100) / 100,
    metodo: texto(mov.metodo) || ambito.porDefecto.metodo,
    notas: texto(mov.notas),
  };

  if (ambito.col.ivaPct !== undefined) {
    let ivaPct = aNumero(mov.ivaPct ?? 0);
    if (ivaPct > 1) ivaPct /= 100;
    if (!Number.isFinite(ivaPct) || ivaPct < 0 || ivaPct > 1) throw new Error('IVA no válido.');
    comun.ivaPct = ivaPct;
    comun.quien = texto(mov.quien);
    comun.estado = texto(mov.estado) || ambito.porDefecto.estado;
    comun.deducible = texto(mov.deducible) === 'No' ? 'No' : 'Sí';
  } else {
    comun.recurrente = texto(mov.recurrente) === 'Sí' ? 'Sí' : 'No';
  }

  return comun;
}

async function abrir(nombreHoja) {
  if (!existsSync(LIBRO)) throw new Error('No existe datos/Finanzas.xlsx. Genéralo con: npm run excel');
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(LIBRO);
  const hoja = wb.getWorksheet(nombreHoja);
  if (!hoja) throw new Error(`El libro no tiene la hoja ${nombreHoja}. Ejecuta: npm run actualizar`);
  return { wb, hoja };
}

async function guardar(wb) {
  // Copia de seguridad antes de sobrescribir: si algo va mal, no pierdes nada.
  await copyFile(LIBRO, RESPALDO).catch(() => {});
  try {
    await wb.xlsx.writeFile(LIBRO);
  } catch (e) {
    if (e.code === 'EBUSY' || e.code === 'EPERM') {
      throw new Error('Tienes Finanzas.xlsx abierto en Excel. Ciérralo e inténtalo otra vez.');
    }
    throw e;
  }
}

// ── Movimientos ───────────────────────────────────────────────────────────────
function escribirFila(hoja, f, mov, ambito) {
  const fila = hoja.getRow(f);
  for (const [clave, col] of Object.entries(ambito.col)) {
    const v = mov[clave];
    fila.getCell(col).value = v === undefined || v === '' ? null : v;
  }
  for (const [col, fmt] of Object.entries(ambito.formatos)) fila.getCell(Number(col)).numFmt = fmt;
  for (const [col, formula] of ambito.formulas(f)) fila.getCell(col).value = { formula };
  fila.commit();
}

function vaciarFila(hoja, f, ambito) {
  const fila = hoja.getRow(f);
  Object.values(ambito.col).forEach((c) => (fila.getCell(c).value = null));
  fila.commit();
}

function primeraLibre(hoja, ambito) {
  for (let f = PRIMERA_FILA; f <= hoja.rowCount + 1; f++) {
    if (!hoja.getCell(f, ambito.col.fecha).value) return f;
  }
  return hoja.rowCount + 1;
}

// Lee los movimientos tal cual están en la hoja, con su número de fila.
function leerFilas(hoja, ambito) {
  const filas = [];
  for (let f = PRIMERA_FILA; f <= hoja.rowCount; f++) {
    const fecha = hoja.getCell(f, ambito.col.fecha).value;
    const base = hoja.getCell(f, ambito.col.base).value;
    if (!fecha || base === null || base === undefined || base === '') continue;

    const mov = { fila: f };
    for (const [clave, col] of Object.entries(ambito.col)) mov[clave] = hoja.getCell(f, col).value;
    mov.base = Number(mov.base);
    if (mov.ivaPct !== undefined) mov.ivaPct = Number(mov.ivaPct) || 0;
    filas.push(mov);
  }
  return filas;
}

/** Añade uno o varios movimientos. `ambito` = "negocio" (por defecto) o "personal". */
export async function anadirMovimientos(entrada, nombreAmbito) {
  const lista = Array.isArray(entrada) ? entrada : [entrada];
  const ambito = ambitoDe(nombreAmbito ?? lista[0]?.ambito);
  const movs = lista.map((m) => validar(m, ambito));
  const { wb, hoja } = await abrir(ambito.hoja);

  const escritas = [];
  for (const mov of movs) {
    const f = primeraLibre(hoja, ambito);
    escribirFila(hoja, f, mov, ambito);
    escritas.push({ fila: f, ...mov, fecha: mov.fecha.toISOString().slice(0, 10) });
  }

  await guardar(wb);
  return escritas;
}

/**
 * Borra la fila indicada y compacta el resto hacia arriba, sin dejar huecos.
 * `comprobacion` ({ concepto, base }) evita borrar otra cosa si el Excel cambió
 * entre que el panel pintó la tabla y llegó la petición.
 */
export async function borrarMovimiento(fila, comprobacion = {}) {
  const objetivo = Number(fila);
  if (!Number.isInteger(objetivo) || objetivo < PRIMERA_FILA) throw new Error('Fila no válida.');

  const ambito = ambitoDe(comprobacion.ambito);
  const { wb, hoja } = await abrir(ambito.hoja);
  const filas = leerFilas(hoja, ambito);
  const indice = filas.findIndex((m) => m.fila === objetivo);
  if (indice === -1) throw new Error('Ese movimiento ya no está en el Excel. Recarga el panel.');

  const borrado = filas[indice];
  const mismoConcepto = comprobacion.concepto === undefined || String(comprobacion.concepto) === String(borrado.concepto ?? '');
  const mismoImporte = comprobacion.base === undefined || Math.abs(Number(comprobacion.base) - borrado.base) < 0.005;
  if (!mismoConcepto || !mismoImporte) {
    throw new Error('El Excel ha cambiado desde que se cargó el panel. Recárgalo y vuelve a intentarlo.');
  }

  const quedan = filas.filter((_, i) => i !== indice);
  quedan.forEach((mov, i) => escribirFila(hoja, PRIMERA_FILA + i, { ...mov, fecha: aFechaUTC(mov.fecha) }, ambito));
  for (let f = PRIMERA_FILA + quedan.length; f <= filas[filas.length - 1].fila; f++) vaciarFila(hoja, f, ambito);

  await guardar(wb);
  return { borrado: { ...borrado, fecha: aFechaUTC(borrado.fecha).toISOString().slice(0, 10) }, quedan: quedan.length };
}

// ── Objetivos ─────────────────────────────────────────────────────────────────
/**
 * Fecha límite implícita del plazo: hoy, fin de semana, de mes o de año.
 * `desde` siempre viene de aFechaUTC (medianoche UTC), así que se opera en UTC.
 */
function limiteDelPlazo(plazo, desde) {
  const y = desde.getUTCFullYear();
  const m = desde.getUTCMonth();
  const d = desde.getUTCDate();

  if (plazo === 'Día') return new Date(Date.UTC(y, m, d));
  if (plazo === 'Semana') {
    // Semana europea: termina en domingo.
    const diaSemana = new Date(Date.UTC(y, m, d)).getUTCDay() || 7;
    return new Date(Date.UTC(y, m, d + (7 - diaSemana)));
  }
  if (plazo === 'Mes') return new Date(Date.UTC(y, m + 1, 0));
  if (plazo === 'Año') return new Date(Date.UTC(y, 11, 31));
  return null;
}

function validarObjetivo(obj) {
  const nombre = texto(obj.nombre);
  if (!nombre) throw new Error('El objetivo necesita un nombre.');

  const tipo = ['Importe', 'Cantidad', 'Hito'].includes(texto(obj.tipo)) ? texto(obj.tipo) : 'Importe';
  const plazo = PLAZOS.includes(texto(obj.plazo)) ? texto(obj.plazo) : 'Largo plazo';
  const meta = tipo === 'Hito' ? 1 : aNumero(obj.meta);
  if (!Number.isFinite(meta) || meta <= 0) throw new Error('La meta debe ser un número mayor que cero.');

  const progreso = aNumero(obj.progreso ?? 0);
  if (!Number.isFinite(progreso) || progreso < 0) throw new Error('El progreso no puede ser negativo.');

  const inicio = obj.inicio ? aFechaUTC(obj.inicio) : aFechaUTC(new Date());

  return {
    nombre,
    area: texto(obj.area) || 'Personal',
    plazo,
    tipo,
    meta: Math.round(meta * 100) / 100,
    progreso: Math.round(progreso * 100) / 100,
    unidad: texto(obj.unidad) || (tipo === 'Importe' ? '€' : tipo === 'Hito' ? 'hito' : 'ud.'),
    inicio,
    // Con plazo corto la fecha límite se calcula sola; solo la de largo plazo se escribe a mano.
    limite: obj.limite ? aFechaUTC(obj.limite) : limiteDelPlazo(plazo, inicio),
    estado: ['Activo', 'Conseguido', 'Pausado', 'Descartado'].includes(texto(obj.estado)) ? texto(obj.estado) : 'Activo',
    notas: texto(obj.notas),
  };
}

function escribirObjetivo(hoja, f, obj) {
  const fila = hoja.getRow(f);
  for (const [clave, col] of Object.entries(COL_OBJ)) {
    const v = obj[clave];
    fila.getCell(col).value = v === undefined || v === '' ? null : v;
  }
  fila.getCell(COL_OBJ.inicio).numFmt = FECHA;
  fila.getCell(COL_OBJ.limite).numFmt = FECHA;
  fila.getCell(12).value = { formula: `IF(OR(A${f}="",E${f}=0,E${f}=""),"",MIN(1,F${f}/E${f}))` };
  fila.commit();
}

function leerObjetivos(hoja) {
  const lista = [];
  for (let f = PRIMERA_FILA; f <= hoja.rowCount; f++) {
    const nombre = hoja.getCell(f, COL_OBJ.nombre).value;
    // Sin meta no es un objetivo: así ninguna nota suelta de la hoja cuela como tal.
    if (!nombre || !(Number(hoja.getCell(f, COL_OBJ.meta).value) > 0)) continue;
    const obj = { fila: f };
    for (const [clave, col] of Object.entries(COL_OBJ)) obj[clave] = hoja.getCell(f, col).value;
    obj.meta = Number(obj.meta) || 0;
    obj.progreso = Number(obj.progreso) || 0;
    lista.push(obj);
  }
  return lista;
}

const paraEnviar = (o) => ({
  ...o,
  inicio: o.inicio ? aFechaUTC(o.inicio).toISOString().slice(0, 10) : null,
  limite: o.limite ? aFechaUTC(o.limite).toISOString().slice(0, 10) : null,
});

export async function anadirObjetivo(entrada) {
  const obj = validarObjetivo(entrada);
  const { wb, hoja } = await abrir(HOJA_OBJETIVOS);
  const usadas = leerObjetivos(hoja);
  const f = usadas.length ? Math.max(...usadas.map((o) => o.fila)) + 1 : PRIMERA_FILA;
  escribirObjetivo(hoja, f, obj);
  await guardar(wb);
  return paraEnviar({ fila: f, ...obj });
}

/** Cambia campos sueltos de un objetivo (progreso, estado, lo que sea). */
export async function actualizarObjetivo(fila, cambios = {}) {
  const objetivo = Number(fila);
  const { wb, hoja } = await abrir(HOJA_OBJETIVOS);
  const actual = leerObjetivos(hoja).find((o) => o.fila === objetivo);
  if (!actual) throw new Error('Ese objetivo ya no está en el Excel. Recarga el panel.');

  const fusionado = validarObjetivo({
    ...paraEnviar(actual),
    ...cambios,
    // "sumar" añade al progreso en vez de reemplazarlo
    progreso: cambios.sumar !== undefined ? actual.progreso + aNumero(cambios.sumar) : (cambios.progreso ?? actual.progreso),
  });

  // Al llegar a la meta se marca solo, salvo que se pida otro estado a mano.
  if (cambios.estado === undefined && fusionado.progreso >= fusionado.meta && fusionado.estado === 'Activo') {
    fusionado.estado = 'Conseguido';
  }

  escribirObjetivo(hoja, objetivo, fusionado);
  await guardar(wb);
  return paraEnviar({ fila: objetivo, ...fusionado });
}

export async function borrarObjetivo(fila, comprobacion = {}) {
  const objetivo = Number(fila);
  const { wb, hoja } = await abrir(HOJA_OBJETIVOS);
  const lista = leerObjetivos(hoja);
  const indice = lista.findIndex((o) => o.fila === objetivo);
  if (indice === -1) throw new Error('Ese objetivo ya no está en el Excel. Recarga el panel.');

  const borrado = lista[indice];
  if (comprobacion.nombre !== undefined && String(comprobacion.nombre) !== String(borrado.nombre ?? '')) {
    throw new Error('El Excel ha cambiado desde que se cargó el panel. Recárgalo y vuelve a intentarlo.');
  }

  const quedan = lista.filter((_, i) => i !== indice);
  quedan.forEach((o, i) => escribirObjetivo(hoja, PRIMERA_FILA + i, validarObjetivo(paraEnviar(o))));
  for (let f = PRIMERA_FILA + quedan.length; f <= lista[lista.length - 1].fila; f++) {
    const fila = hoja.getRow(f);
    Object.values(COL_OBJ).forEach((c) => (fila.getCell(c).value = null));
    fila.commit();
  }

  await guardar(wb);
  return { borrado: paraEnviar(borrado), quedan: quedan.length };
}

// ── Presupuestos ──────────────────────────────────────────────────────────────
const HOJA_PRESUPUESTOS = 'Presupuestos';
const PRIMERA_PRESUPUESTO = 5;

export async function leerPresupuestos() {
  const { hoja } = await abrir(HOJA_PRESUPUESTOS);
  const lista = [];
  for (let f = PRIMERA_PRESUPUESTO; f <= hoja.rowCount; f++) {
    const cat = hoja.getCell(f, 2).value;
    if (!cat || String(cat).toUpperCase() === 'TOTAL') continue;
    const tope = Number(hoja.getCell(f, 3).value) || 0;
    lista.push({ fila: f, categoria: String(cat), tope });
  }
  return lista;
}

/** Guarda los topes que llegan ({ categoria: importe }). 0 o vacío = sin tope. */
export async function guardarPresupuestos(topes) {
  const { wb, hoja } = await abrir(HOJA_PRESUPUESTOS);
  let tocados = 0;

  for (let f = PRIMERA_PRESUPUESTO; f <= hoja.rowCount; f++) {
    const cat = hoja.getCell(f, 2).value;
    if (!cat || String(cat).toUpperCase() === 'TOTAL') continue;
    if (!(String(cat) in topes)) continue;

    const valor = aNumero(topes[String(cat)]);
    hoja.getCell(f, 3).value = Number.isFinite(valor) && valor > 0 ? Math.round(valor * 100) / 100 : null;
    hoja.getCell(f, 3).numFmt = EUR;
    tocados++;
  }

  await guardar(wb);
  return { tocados };
}

// ── Importación de extractos ──────────────────────────────────────────────────
// Dos movimientos con la misma fecha, importe y concepto son el mismo apunte.
const huella = (m) => `${aFechaUTC(m.fecha).toISOString().slice(0, 10)}|${Math.round(Number(m.base) * 100)}|${texto(m.concepto).toLowerCase()}`;

/**
 * Alta en lote saltándose lo que ya está apuntado.
 * Devuelve cuántos entraron y cuántos se descartaron por repetidos.
 */
export async function importarMovimientos(entrada, nombreAmbito) {
  const lista = Array.isArray(entrada) ? entrada : [entrada];
  if (!lista.length) throw new Error('No hay nada que importar.');

  const porAmbito = new Map();
  lista.forEach((m) => {
    const clave = texto(m.ambito).toLowerCase() === 'personal' ? 'personal' : 'negocio';
    if (!porAmbito.has(clave)) porAmbito.set(clave, []);
    porAmbito.get(clave).push(m);
  });

  let importados = 0;
  const repetidos = [];

  for (const [clave, movs] of porAmbito) {
    const ambito = ambitoDe(nombreAmbito || clave);
    const { wb, hoja } = await abrir(ambito.hoja);

    const yaEstan = new Set(leerFilas(hoja, ambito).map(huella));
    const nuevos = [];
    for (const m of movs) {
      const validado = validar(m, ambito);
      const h = huella(validado);
      if (yaEstan.has(h)) {
        repetidos.push({ fecha: validado.fecha.toISOString().slice(0, 10), concepto: validado.concepto, base: validado.base });
        continue;
      }
      yaEstan.add(h); // también evita duplicados dentro del propio archivo
      nuevos.push(validado);
    }

    for (const mov of nuevos) escribirFila(hoja, primeraLibre(hoja, ambito), mov, ambito);
    if (nuevos.length) await guardar(wb);
    importados += nuevos.length;
  }

  return { importados, repetidos: repetidos.length, ejemplosRepetidos: repetidos.slice(0, 5) };
}

// ── Hábitos ───────────────────────────────────────────────────────────────────
const HOJA_HABITOS = 'Habitos';
export const IDS_HABITOS = ['gym', 'lectura', 'negocio', 'carrera'];

const claveISO = (d) => aFechaUTC(d).toISOString().slice(0, 10);

/** Todo el histórico como { 'aaaa-mm-dd': ['gym', 'lectura'] }. */
export async function leerHabitos() {
  const { hoja } = await abrir(HOJA_HABITOS);
  const registro = {};
  for (let f = PRIMERA_FILA; f <= hoja.rowCount; f++) {
    const fecha = hoja.getCell(f, 1).value;
    if (!fecha) continue;
    const hechos = IDS_HABITOS.filter((_, i) => texto(hoja.getCell(f, i + 2).value) === 'Sí');
    if (hechos.length) registro[claveISO(fecha)] = hechos;
  }
  return registro;
}

/** Deja un día exactamente con los hábitos indicados. Sin ninguno, borra la fila. */
export async function guardarHabitosDelDia(fechaISO, hechos = []) {
  const dia = aFechaUTC(fechaISO);
  const clave = dia.toISOString().slice(0, 10);
  const marcados = IDS_HABITOS.filter((id) => hechos.includes(id));

  const { wb, hoja } = await abrir(HOJA_HABITOS);

  // Se busca el día; si no está y hay algo que marcar, se añade al final.
  let destino = 0;
  let ultima = PRIMERA_FILA - 1;
  for (let f = PRIMERA_FILA; f <= hoja.rowCount; f++) {
    const v = hoja.getCell(f, 1).value;
    if (!v) continue;
    ultima = f;
    if (claveISO(v) === clave) destino = f;
  }

  if (!destino) {
    if (!marcados.length) return { fecha: clave, hechos: [] };
    destino = ultima + 1;
  }

  const fila = hoja.getRow(destino);
  if (marcados.length) {
    fila.getCell(1).value = dia;
    fila.getCell(1).numFmt = FECHA;
    IDS_HABITOS.forEach((id, i) => (fila.getCell(i + 2).value = marcados.includes(id) ? 'Sí' : null));
  } else {
    // Día sin nada marcado: se vacía para no dejar filas huecas en el Excel.
    for (let c = 1; c <= IDS_HABITOS.length + 1; c++) fila.getCell(c).value = null;
  }
  fila.commit();

  await guardar(wb);
  return { fecha: clave, hechos: marcados };
}

// ── Listas para los desplegables del panel ────────────────────────────────────
export async function leerListas() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(LIBRO);
  const hoja = wb.getWorksheet('Categorias');
  if (!hoja) return null;

  // Para en el primer hueco: debajo de las listas hay notas de ayuda que no son datos.
  const columna = (c) => {
    const valores = [];
    for (let f = 2; f <= 80; f++) {
      const v = hoja.getCell(f, c).value;
      if (v === null || v === undefined || v === '') break;
      valores.push(v);
    }
    return valores;
  };

  return {
    categorias: columna(1).map(String),
    ingreso: columna(2).map(String),
    gasto: columna(3).map(String),
    ivas: columna(5).map(Number),
    metodos: columna(6).map(String),
    estados: columna(7).map(String),
    personal: columna(9).map(String),
    areas: columna(10).map(String),
    tiposObjetivo: columna(11).map(String),
    estadosObjetivo: columna(12).map(String),
    plazos: columna(13).map(String),
  };
}

// ── Uso desde la terminal ─────────────────────────────────────────────────────
// node scripts/movimientos.mjs personal '{"fecha":"2026-08-09","concepto":"…","base":10}'
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [uno, dos] = process.argv.slice(2);
  const nombreAmbito = dos ? uno : 'negocio';
  const json = dos ?? uno;
  if (!json) {
    console.error('Uso: node scripts/movimientos.mjs [negocio|personal] \'{"…"}\'');
    process.exit(1);
  }
  const escritas = await anadirMovimientos(JSON.parse(json), nombreAmbito);
  escritas.forEach((m) => console.log(`  fila ${m.fila}: ${m.fecha} · ${m.tipo} · ${m.concepto} · ${m.base} €`));
}
