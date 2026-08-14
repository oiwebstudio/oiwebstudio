/* Capa de datos: IndexedDB dentro del propio dispositivo.
   Ni servidor, ni Excel, ni cuentas. Todo vive aquí y sale solo si tú lo exportas. */

const NOMBRE_BD = 'mi-panel';
const VERSION_BD = 1;

// Un almacén por tipo de cosa. `clave` es el campo que identifica cada registro.
const ALMACENES = {
  movimientos: 'id',
  objetivos: 'id',
  habitos: 'fecha',
  ajustes: 'clave',
};

let bd = null;

function abrir() {
  if (bd) return Promise.resolve(bd);

  return new Promise((cumple, falla) => {
    const peticion = indexedDB.open(NOMBRE_BD, VERSION_BD);

    peticion.onupgradeneeded = () => {
      const db = peticion.result;
      for (const [nombre, clave] of Object.entries(ALMACENES)) {
        if (!db.objectStoreNames.contains(nombre)) db.createObjectStore(nombre, { keyPath: clave });
      }
    };

    peticion.onsuccess = () => {
      bd = peticion.result;
      // Si otra pestaña actualiza la base, esta se cierra para no quedarse atrás.
      bd.onversionchange = () => { bd.close(); bd = null; };
      cumple(bd);
    };

    peticion.onerror = () => falla(new Error('No he podido abrir la base de datos del dispositivo.'));
  });
}

function transaccion(almacen, modo) {
  return abrir().then((db) => db.transaction(almacen, modo).objectStore(almacen));
}

const promesa = (peticion) =>
  new Promise((cumple, falla) => {
    peticion.onsuccess = () => cumple(peticion.result);
    peticion.onerror = () => falla(peticion.error);
  });

// ── Operaciones básicas ───────────────────────────────────────────────────────
export const listar = (almacen) => transaccion(almacen, 'readonly').then((s) => promesa(s.getAll()));

export const obtener = (almacen, clave) => transaccion(almacen, 'readonly').then((s) => promesa(s.get(clave)));

export const guardar = (almacen, registro) =>
  transaccion(almacen, 'readwrite').then((s) => promesa(s.put(registro))).then(() => registro);

export const borrar = (almacen, clave) => transaccion(almacen, 'readwrite').then((s) => promesa(s.delete(clave)));

export const vaciar = (almacen) => transaccion(almacen, 'readwrite').then((s) => promesa(s.clear()));

/** Mete muchos registros de golpe, en una sola transacción. */
export function guardarVarios(almacen, registros) {
  return abrir().then(
    (db) =>
      new Promise((cumple, falla) => {
        const t = db.transaction(almacen, 'readwrite');
        const s = t.objectStore(almacen);
        registros.forEach((r) => s.put(r));
        t.oncomplete = () => cumple(registros.length);
        t.onerror = () => falla(t.error);
      })
  );
}

export const nuevoId = () => 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// ── Ajustes sueltos (nombre, topes de presupuesto…) ───────────────────────────
export const leerAjuste = (clave, porDefecto = null) =>
  obtener('ajustes', clave).then((r) => (r === undefined ? porDefecto : r.valor));

export const escribirAjuste = (clave, valor) => guardar('ajustes', { clave, valor });

// ── Copia de seguridad ────────────────────────────────────────────────────────
/**
 * Los datos viven solo en este dispositivo: si se pierde, se pierden. Exportar
 * de vez en cuando es la única red de seguridad, así que tiene que ser fácil.
 */
export async function exportarTodo() {
  const copia = { version: 1, exportado: new Date().toISOString() };
  for (const almacen of Object.keys(ALMACENES)) copia[almacen] = await listar(almacen);
  return copia;
}

export async function importarTodo(copia, { reemplazar = true } = {}) {
  if (!copia || typeof copia !== 'object') throw new Error('El archivo no tiene el formato esperado.');

  const resumen = {};
  for (const almacen of Object.keys(ALMACENES)) {
    const registros = Array.isArray(copia[almacen]) ? copia[almacen] : [];
    if (reemplazar) await vaciar(almacen);
    if (registros.length) await guardarVarios(almacen, registros);
    resumen[almacen] = registros.length;
  }
  return resumen;
}

/** Cuánto ocupa y cuántos registros hay, para enseñarlo en Ajustes. */
export async function estadisticas() {
  const cuentas = {};
  for (const almacen of Object.keys(ALMACENES)) cuentas[almacen] = (await listar(almacen)).length;

  let espacio = null;
  if (navigator.storage?.estimate) {
    try {
      const { usage } = await navigator.storage.estimate();
      espacio = usage;
    } catch { /* no todos los navegadores lo dan */ }
  }
  return { cuentas, espacio };
}

/**
 * Pide al sistema que no borre estos datos si va justo de espacio.
 * Sin esto, Android puede vaciar la base de una PWA poco usada.
 */
export async function pedirPersistencia() {
  if (!navigator.storage?.persist) return null;
  try {
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch {
    return null;
  }
}
