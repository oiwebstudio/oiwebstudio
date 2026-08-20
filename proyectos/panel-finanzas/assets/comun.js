/* Piezas compartidas por todas las secciones: formato, lectura del Excel,
   estado, gráficos y llamadas al servidor. */

export const RUTA_LIBRO = 'datos/Finanzas.xlsx';

export const $ = (sel, raiz = document) => raiz.querySelector(sel);
export const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];

export const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
export const MESES_LARGO = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

// ── Formato ───────────────────────────────────────────────────────────────────
// useGrouping 'always': si no, es-ES deja "8624 €" junto a "18.800 €" y no cuadra.
const fmtEuro = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0, useGrouping: 'always' });
const fmtEuroDec = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' });
export const fmtPct = new Intl.NumberFormat('es-ES', { style: 'percent', maximumFractionDigits: 1 });
export const fmtFecha = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
const fmtNum = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 });

export const euro = (n) => fmtEuro.format(n || 0);
export const euroDec = (n) => fmtEuroDec.format(n || 0);
export const numero = (n) => fmtNum.format(n || 0);
export const pct = (n) => fmtPct.format(Number.isFinite(n) ? n : 0);

export const escapar = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const normalizar = (s) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

// Acepta 1450, "1.450,00 €" (es) y "1,450.00 €" (en): manda el último separador.
export function aNumero(v) {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
  if (v == null || v === '') return 0;

  let s = String(v).replace(/[^\d,.-]/g, '');
  if (!s) return 0;

  const ultimaComa = s.lastIndexOf(',');
  const ultimoPunto = s.lastIndexOf('.');
  if (ultimaComa > -1 && ultimoPunto > -1) {
    const decimal = ultimaComa > ultimoPunto ? ',' : '.';
    const miles = decimal === ',' ? '.' : ',';
    s = s.split(miles).join('').replace(decimal, '.');
  } else if (ultimaComa > -1) {
    s = /,\d{3}(\D|$)/.test(s) ? s.split(',').join('') : s.replace(',', '.');
  } else if (ultimoPunto > -1 && /\.\d{3}(\D|$)/.test(s) && !/\.\d{1,2}$/.test(s)) {
    s = s.split('.').join('');
  }

  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

export function aFecha(v) {
  if (v instanceof Date && !isNaN(v)) return v;
  if (typeof v === 'number') {
    const d = XLSX.SSF.parse_date_code(v);
    return d ? new Date(d.y, d.m - 1, d.d) : null;
  }
  if (typeof v === 'string') {
    const m = v.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
    if (m) return new Date(Number(m[3].length === 2 ? '20' + m[3] : m[3]), Number(m[2]) - 1, Number(m[1]));
    const d = new Date(v);
    if (!isNaN(d)) return d;
  }
  return null;
}

export const hoy = () => new Date();

/**
 * Fechas del Excel y fechas del navegador no comparten hora ni zona. Para contar
 * días hay que quedarse solo con el día del calendario: si no, "vence hoy" se
 * convierte en "queda 1 día" según el huso.
 */
export const diaCero = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Días de calendario de hoy a `fecha`. Negativo si ya pasó. */
export function diasHasta(fecha) {
  if (!fecha) return null;
  return Math.round((diaCero(fecha) - diaCero(new Date())) / 86400000);
}

export const claveISO = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// ── Estado compartido ─────────────────────────────────────────────────────────
export const datos = {
  negocio: [],
  personal: [],
  objetivos: [],
  listas: null,
  origen: '',
  cargado: false,
};

const oyentes = [];
export const alCargar = (fn) => oyentes.push(fn);
const avisar = () => oyentes.forEach((fn) => fn());

// ── Lectura del Excel ─────────────────────────────────────────────────────────
function filasDeHoja(libro, nombre) {
  const real = libro.SheetNames.find((n) => normalizar(n) === normalizar(nombre));
  if (!real) return [];
  return XLSX.utils.sheet_to_json(libro.Sheets[real], { header: 1, raw: true, cellDates: true, defval: null });
}

function parsearNegocio(libro) {
  const matriz = filasDeHoja(libro, 'Movimientos');
  const filas = [];
  for (let i = 1; i < matriz.length; i++) {
    const c = matriz[i];
    const fecha = aFecha(c[0]);
    const base = aNumero(c[5]);
    if (!fecha || !base) continue;

    let ivaPct = aNumero(c[6]);
    if (ivaPct > 1) ivaPct /= 100;
    const ivaEur = base * ivaPct;

    filas.push({
      filaExcel: i + 1,
      fecha,
      anio: fecha.getFullYear(),
      mes: fecha.getMonth(),
      trim: 'T' + (Math.floor(fecha.getMonth() / 3) + 1),
      tipo: normalizar(c[1]).startsWith('ing') ? 'Ingreso' : 'Gasto',
      concepto: String(c[2] ?? '').trim(),
      categoria: String(c[3] ?? '').trim() || 'Sin categoría',
      quien: String(c[4] ?? '').trim(),
      base,
      ivaPct,
      ivaEur,
      total: base + ivaEur,
      metodo: String(c[9] ?? '').trim(),
      estado: String(c[10] ?? '').trim(),
      deducible: !normalizar(c[11]).startsWith('n'),
    });
  }
  return filas;
}

function parsearPersonal(libro) {
  const matriz = filasDeHoja(libro, 'Personal');
  const filas = [];
  for (let i = 1; i < matriz.length; i++) {
    const c = matriz[i];
    const fecha = aFecha(c[0]);
    const base = aNumero(c[4]);
    if (!fecha || !base) continue;

    filas.push({
      filaExcel: i + 1,
      fecha,
      anio: fecha.getFullYear(),
      mes: fecha.getMonth(),
      dia: fecha.getDate(),
      tipo: normalizar(c[1]).startsWith('ing') ? 'Ingreso' : 'Gasto',
      concepto: String(c[2] ?? '').trim(),
      categoria: String(c[3] ?? '').trim() || 'Sin categoría',
      base,
      metodo: String(c[5] ?? '').trim(),
      recurrente: normalizar(c[6]).startsWith('s'),
      notas: String(c[7] ?? '').trim(),
    });
  }
  return filas;
}

function parsearObjetivos(libro) {
  const matriz = filasDeHoja(libro, 'Objetivos');
  const filas = [];
  for (let i = 1; i < matriz.length; i++) {
    const c = matriz[i];
    const nombre = String(c[0] ?? '').trim();
    const meta = aNumero(c[4]) || 0;
    // Sin meta no es un objetivo: así ninguna nota suelta de la hoja cuela como tal.
    if (!nombre || meta <= 0) continue;

    const progreso = aNumero(c[5]) || 0;
    filas.push({
      filaExcel: i + 1,
      nombre,
      area: String(c[1] ?? '').trim() || 'Personal',
      plazo: String(c[2] ?? '').trim() || 'Largo plazo',
      tipo: String(c[3] ?? '').trim() || 'Importe',
      meta,
      progreso,
      unidad: String(c[6] ?? '').trim() || '€',
      inicio: aFecha(c[7]),
      limite: aFecha(c[8]),
      estado: String(c[9] ?? '').trim() || 'Activo',
      notas: String(c[10] ?? '').trim(),
      avance: meta ? Math.min(1, progreso / meta) : 0,
    });
  }
  return filas;
}

/** Relee el Excel entero y avisa a todas las secciones. */
export async function cargarDatos(buffer, origen = RUTA_LIBRO) {
  if (!buffer) {
    const r = await fetch(RUTA_LIBRO, { cache: 'no-store' });
    if (!r.ok) throw new Error(`No he podido leer ${RUTA_LIBRO}.`);
    buffer = await r.arrayBuffer();
  }
  const libro = XLSX.read(buffer, { type: 'array', cellDates: true });

  datos.negocio = parsearNegocio(libro);
  datos.personal = parsearPersonal(libro);
  datos.objetivos = parsearObjetivos(libro);
  datos.origen = origen;
  datos.cargado = true;

  avisar();
  return datos;
}

// ── Servidor ──────────────────────────────────────────────────────────────────
async function pedir(ruta, metodo, cuerpo) {
  const r = await fetch(ruta, {
    method: metodo,
    headers: cuerpo ? { 'Content-Type': 'application/json' } : undefined,
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  const texto = await r.text();
  const datos = texto ? JSON.parse(texto) : {};
  if (!r.ok) throw new Error(datos.error || 'No se pudo completar la operación.');
  return datos;
}

export const api = {
  get: (ruta) => pedir(ruta, 'GET'),
  post: (ruta, cuerpo) => pedir(ruta, 'POST', cuerpo),
  put: (ruta, cuerpo) => pedir(ruta, 'PUT', cuerpo),
  patch: (ruta, cuerpo) => pedir(ruta, 'PATCH', cuerpo),
  borrar: (ruta, cuerpo) => pedir(ruta, 'DELETE', cuerpo),
};

// ── Avisos ────────────────────────────────────────────────────────────────────
let relojBrindis;
export function brindis(texto) {
  const el = $('#brindis');
  el.textContent = texto;
  el.classList.add('visible');
  clearTimeout(relojBrindis);
  relojBrindis = setTimeout(() => el.classList.remove('visible'), 2800);
}

// ── Gráficos ──────────────────────────────────────────────────────────────────
export function conAlfa(color, alfa) {
  const c = String(color).trim();
  const hex = c.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alfa})`;
  }
  const rgb = c.match(/^rgba?\(([^)]+)\)$/i);
  if (rgb) {
    const [r, g, b] = rgb[1].split(/[,\s/]+/).map(Number);
    return `rgba(${r}, ${g}, ${b}, ${alfa})`;
  }
  return c;
}

export function tema() {
  const cs = getComputedStyle(document.documentElement);
  const v = (n) => cs.getPropertyValue(n).trim();
  return {
    texto: v('--text'),
    muted: v('--muted'),
    linea: v('--line'),
    acento: v('--acento'),
    pos: v('--pos'),
    neg: v('--neg'),
    alerta: v('--alerta'),
    surface: v('--surface'),
  };
}

// Paleta para repartos por categoría: variaciones del acento más los semáforos.
export function paleta(t, n) {
  const base = [t.acento, t.neg, t.pos, t.alerta, '#8b5cf6', '#06b6d4', '#f472b6', '#84cc16', '#f97316', '#64748b'];
  return Array.from({ length: n }, (_, i) => base[i % base.length]);
}

export function baseOpciones(t) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 320 },
    plugins: {
      legend: { display: false, labels: { color: t.muted, boxWidth: 10, boxHeight: 10, font: { size: 11 } } },
      tooltip: {
        backgroundColor: t.surface,
        borderColor: t.linea,
        borderWidth: 1,
        titleColor: t.texto,
        bodyColor: t.texto,
        padding: 10,
        callbacks: {
          label: (c) => ` ${c.dataset.label ? c.dataset.label + ': ' : ''}${euroDec(c.parsed.y ?? c.parsed.x ?? c.parsed)}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, border: { color: t.linea }, ticks: { color: t.muted, font: { size: 11 } } },
      y: {
        grid: { color: t.linea, drawTicks: false },
        border: { display: false },
        ticks: { color: t.muted, font: { size: 11 }, callback: (v) => euro(v) },
      },
    },
  };
}

// Ejes invertidos, para barras horizontales.
export function opcionesHorizontal(t) {
  const o = baseOpciones(t);
  return {
    ...o,
    indexAxis: 'y',
    scales: {
      x: { grid: { color: t.linea, drawTicks: false }, border: { display: false }, ticks: { color: t.muted, font: { size: 11 }, callback: (v) => euro(v) } },
      y: { grid: { display: false }, border: { color: t.linea }, ticks: { color: t.muted, font: { size: 11 } } },
    },
  };
}

const graficos = {};

export function dibujar(id, config) {
  const lienzo = document.getElementById(id);
  if (!lienzo) return null;
  if (graficos[id]) graficos[id].destroy();
  graficos[id] = new Chart(lienzo, config);
  return graficos[id];
}

// ── Utilidades de datos ───────────────────────────────────────────────────────
export const suma = (lista, campo = 'base') => lista.reduce((a, m) => a + (m[campo] || 0), 0);

export function agrupar(lista, clave, campo = 'base') {
  const mapa = new Map();
  lista.forEach((m) => {
    const k = typeof clave === 'function' ? clave(m) : m[clave];
    mapa.set(k, (mapa.get(k) || 0) + (m[campo] || 0));
  });
  return [...mapa.entries()].sort((a, b) => b[1] - a[1]);
}

export function porMes(lista, filtro = () => true, campo = 'base') {
  const meses = new Array(12).fill(0);
  lista.filter(filtro).forEach((m) => (meses[m.mes] += m[campo] || 0));
  return meses;
}

/** Años presentes en los datos, de más reciente a más antiguo. */
export function aniosDisponibles(...listas) {
  const anios = new Set();
  listas.flat().forEach((m) => anios.add(m.anio));
  if (!anios.size) anios.add(new Date().getFullYear());
  return [...anios].sort((a, b) => b - a);
}
