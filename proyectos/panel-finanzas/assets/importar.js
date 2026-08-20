/* Importador de extractos bancarios: CSV o Excel → hoja Personal o Movimientos.
   Adivina las columnas, propone categoría según lo que ya has apuntado antes,
   y no escribe nada hasta que lo has revisado. */

import { $, $$, aFecha, aNumero, api, brindis, cargarDatos, datos, escapar, euroDec, fmtFecha, normalizar } from './comun.js';

const estado = { filas: [], cabeceras: [], mapa: {}, ambito: 'personal', nombreArchivo: '' };

// Pistas para adivinar cada columna en los extractos habituales.
const PISTAS = {
  fecha: ['fecha', 'fecha operacion', 'fecha valor', 'date', 'f. operacion', 'f valor'],
  concepto: ['concepto', 'descripcion', 'detalle', 'movimiento', 'description', 'referencia'],
  importe: ['importe', 'cantidad', 'amount', 'euros', 'importe eur', 'cargo', 'abono'],
};

function adivinar(cabeceras) {
  const mapa = { fecha: -1, concepto: -1, importe: -1 };
  cabeceras.forEach((h, i) => {
    const n = normalizar(h);
    for (const [clave, pistas] of Object.entries(PISTAS)) {
      if (mapa[clave] === -1 && pistas.some((p) => n === p || n.includes(p))) mapa[clave] = i;
    }
  });
  return mapa;
}

/**
 * Categoría propuesta: la que usaste la última vez para un concepto parecido.
 * Sin histórico no propone nada y lo dejas tú.
 */
function proponerCategoria(concepto, ambito) {
  const previos = ambito === 'personal' ? datos.personal : datos.negocio;
  const buscado = normalizar(concepto);
  if (!buscado) return '';

  let mejor = { categoria: '', puntos: 0 };
  for (const m of previos) {
    const suyo = normalizar(m.concepto);
    if (!suyo) continue;
    // Palabras en común: suficiente para "PAGO TARJETA MERCADONA" → Alimentación.
    const palabras = suyo.split(/\s+/).filter((p) => p.length > 3);
    const puntos = palabras.filter((p) => buscado.includes(p)).length;
    if (puntos > mejor.puntos) mejor = { categoria: m.categoria, puntos };
  }
  return mejor.puntos ? mejor.categoria : '';
}

function leerArchivo(buffer, nombre, texto) {
  // En un CSV, "05/08/2026" es 5 de agosto. Si dejas que lo interprete el
  // lector lo toma como 8 de mayo, así que se lee en crudo y lo parseamos aquí.
  const esTexto = /\.(csv|tsv|txt)$/i.test(nombre);
  const libro = esTexto
    ? XLSX.read(texto, { type: 'string', raw: true })
    : XLSX.read(buffer, { type: 'array', cellDates: true });

  const hoja = libro.Sheets[libro.SheetNames[0]];
  const matriz = XLSX.utils.sheet_to_json(hoja, { header: 1, raw: true, cellDates: true, defval: null });

  // Los extractos suelen traer cabecera y basura encima: la fila buena es la
  // primera que parece de cabecera, con al menos tres celdas de texto.
  let filaCabecera = 0;
  for (let i = 0; i < Math.min(matriz.length, 15); i++) {
    const textos = (matriz[i] || []).filter((c) => typeof c === 'string' && c.trim()).length;
    if (textos >= 3) {
      filaCabecera = i;
      break;
    }
  }

  estado.cabeceras = (matriz[filaCabecera] || []).map((h, i) => String(h ?? `Columna ${i + 1}`).trim());
  estado.filas = matriz.slice(filaCabecera + 1).filter((f) => f && f.some((c) => c !== null && c !== ''));
  estado.mapa = adivinar(estado.cabeceras);
  estado.nombreArchivo = nombre;
}

function pintarMapeo() {
  const opciones = (elegido) =>
    ['<option value="-1">— sin asignar —</option>', ...estado.cabeceras.map((h, i) => `<option value="${i}"${i === elegido ? ' selected' : ''}>${escapar(h)}</option>`)].join('');

  $('#impMapa').innerHTML = [
    ['fecha', 'Fecha'],
    ['concepto', 'Concepto'],
    ['importe', 'Importe'],
  ]
    .map(
      ([clave, etq]) => `<div class="campo">
        <label for="imp-${clave}">${etq}</label>
        <select id="imp-${clave}" data-clave="${clave}">${opciones(estado.mapa[clave])}</select>
      </div>`
    )
    .join('');
}

/** Filas ya interpretadas y listas para revisar. */
function preparadas() {
  const { fecha, concepto, importe } = estado.mapa;
  if (fecha === -1 || importe === -1) return [];

  return estado.filas
    .map((f) => {
      const d = aFecha(f[fecha]);
      const bruto = aNumero(f[importe]);
      if (!d || !bruto) return null;
      const texto = concepto === -1 ? 'Movimiento importado' : String(f[concepto] ?? '').trim() || 'Movimiento importado';
      return {
        fecha: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
        // El signo del extracto decide si entra o sale; al Excel va siempre en positivo.
        tipo: bruto > 0 ? 'Ingreso' : 'Gasto',
        concepto: texto,
        base: Math.abs(bruto),
        categoria: proponerCategoria(texto, estado.ambito),
      };
    })
    .filter(Boolean);
}

function pintarVista() {
  const filas = preparadas();
  const cats = estado.ambito === 'personal' ? listasCategorias().personal : listasCategorias().gasto;

  $('#impResumen').innerHTML = filas.length
    ? `<b>${filas.length}</b> movimiento(s) reconocido(s) de ${estado.filas.length} fila(s) · ${filas.filter((f) => f.tipo === 'Ingreso').length} entradas, ${filas.filter((f) => f.tipo === 'Gasto').length} salidas`
    : 'No reconozco ninguna fila. Revisa las columnas de arriba.';

  $('#impVista').innerHTML = filas.length
    ? `<table><thead><tr><th></th><th>Fecha</th><th>Concepto</th><th style="text-align:right">Importe</th><th>Categoría</th></tr></thead><tbody>${filas
        .map(
          (f, i) => `<tr>
            <td><input type="checkbox" class="imp-marca" data-i="${i}" checked></td>
            <td class="num">${fmtFecha.format(new Date(f.fecha + 'T00:00:00'))}</td>
            <td class="ancho">${escapar(f.concepto)}</td>
            <td class="num ${f.tipo === 'Ingreso' ? 'pos' : 'neg'}">${f.tipo === 'Ingreso' ? '' : '−'}${euroDec(f.base)}</td>
            <td><select class="imp-cat" data-i="${i}">${['<option value=""></option>', ...cats.map((c) => `<option${c === f.categoria ? ' selected' : ''}>${escapar(c)}</option>`)].join('')}</select></td>
          </tr>`
        )
        .join('')}</tbody></table>`
    : '';

  $('#btnImportar').disabled = !filas.length;
}

// Las listas vienen de app.js; se piden en el momento para no duplicar estado.
let listasCategorias = () => ({ personal: [], gasto: [] });
export const usarListas = (fn) => (listasCategorias = fn);

export function abrir() {
  estado.filas = [];
  estado.cabeceras = [];
  $('#impMapa').innerHTML = '';
  $('#impVista').innerHTML = '';
  $('#impResumen').textContent = '';
  $('#impError').textContent = '';
  $('#impArchivo').value = '';
  $('#impPaso1').classList.remove('oculto');
  $('#impPaso2').classList.add('oculto');
  $('#btnImportar').disabled = true;
  $('#dlgImportar').showModal();
}

async function cargarArchivo(archivo) {
  $('#impError').textContent = '';
  try {
    const esTexto = /\.(csv|tsv|txt)$/i.test(archivo.name);
    leerArchivo(esTexto ? null : await archivo.arrayBuffer(), archivo.name, esTexto ? await archivo.text() : null);
    if (!estado.filas.length) throw new Error('El archivo no tiene filas de datos.');
    $('#impPaso1').classList.add('oculto');
    $('#impPaso2').classList.remove('oculto');
    $('#impNombre').textContent = archivo.name;
    pintarMapeo();
    pintarVista();
  } catch (e) {
    $('#impError').textContent = `No he podido leer el archivo: ${e.message}`;
  }
}

async function importar() {
  const filas = preparadas();
  const marcadas = $$('.imp-marca');
  const cats = $$('.imp-cat');

  const lote = filas
    .map((f, i) => ({ ...f, categoria: cats[i]?.value || f.categoria, ambito: estado.ambito }))
    .filter((_, i) => marcadas[i]?.checked);

  if (!lote.length) {
    $('#impError').textContent = 'No has marcado ninguna fila.';
    return;
  }

  const boton = $('#btnImportar');
  boton.disabled = true;
  boton.textContent = 'Importando…';
  try {
    const r = await api.post('/api/importar', lote);
    $('#dlgImportar').close();
    await cargarDatos();
    brindis(
      r.repetidos
        ? `${r.importados} importados · ${r.repetidos} ya estaban y me los he saltado`
        : `${r.importados} movimiento(s) importados`
    );
  } catch (e) {
    $('#impError').textContent = e.message;
  } finally {
    boton.disabled = false;
    boton.textContent = 'Importar';
  }
}

export function conectar() {
  $('#impArchivo').addEventListener('change', (e) => {
    const archivo = e.target.files[0];
    if (archivo) cargarArchivo(archivo);
  });

  $('#impSoltar').addEventListener('click', () => $('#impArchivo').click());
  $('#impSoltar').addEventListener('dragover', (e) => {
    e.preventDefault();
    $('#impSoltar').classList.add('encima');
  });
  $('#impSoltar').addEventListener('dragleave', () => $('#impSoltar').classList.remove('encima'));
  $('#impSoltar').addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    $('#impSoltar').classList.remove('encima');
    const archivo = e.dataTransfer.files[0];
    if (archivo) cargarArchivo(archivo);
  });

  $('#impMapa').addEventListener('change', (e) => {
    const sel = e.target.closest('select[data-clave]');
    if (!sel) return;
    estado.mapa[sel.dataset.clave] = Number(sel.value);
    pintarVista();
  });

  $$('#dlgImportar input[name="impAmbito"]').forEach((r) =>
    r.addEventListener('change', () => {
      estado.ambito = r.value;
      pintarVista();
    })
  );

  $('#impTodas').addEventListener('click', () => {
    const marcar = $$('.imp-marca').some((c) => !c.checked);
    $$('.imp-marca').forEach((c) => (c.checked = marcar));
  });

  $('#btnImportar').addEventListener('click', importar);
  $('#btnCerrarImp').addEventListener('click', () => $('#dlgImportar').close());
  $('#btnCancelarImp').addEventListener('click', () => $('#dlgImportar').close());
}
