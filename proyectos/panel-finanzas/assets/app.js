/* Arranque: navegación entre secciones, tema, carga del Excel y formularios de alta. */

import { $, $$, MESES_LARGO, alCargar, api, brindis, cargarDatos, datos, escapar, euroDec, aNumero } from './comun.js';
import * as inicio from './inicio.js';
import * as negocio from './negocio.js';
import * as personal from './personal.js';
import * as calendario from './calendario.js';
import * as objetivos from './objetivos.js';
import * as importar from './importar.js';

const SECCIONES = {
  inicio: { pintar: inicio.pintar, conectar: null, alta: 'personal' },
  negocio: { pintar: negocio.pintar, conectar: negocio.conectar, alta: 'negocio' },
  personal: { pintar: personal.pintar, conectar: personal.conectar, alta: 'personal' },
  calendario: { pintar: calendario.pintar, conectar: () => calendario.conectar(abrirMovimiento), alta: 'personal' },
  objetivos: { pintar: objetivos.pintar, conectar: objetivos.conectar, alta: 'objetivo' },
};

let seccionActiva = 'inicio';

// ── Navegación ────────────────────────────────────────────────────────────────
function irA(nombre, { historial = true } = {}) {
  if (!SECCIONES[nombre]) nombre = 'inicio';
  seccionActiva = nombre;

  $$('.nav-boton').forEach((b) => {
    const activo = b.dataset.seccion === nombre;
    b.classList.toggle('activo', activo);
    b.setAttribute('aria-current', activo ? 'page' : 'false');
  });
  $$('.seccion').forEach((s) => s.classList.toggle('oculto', s.dataset.seccion !== nombre));

  $('#btnApuntar').textContent = nombre === 'objetivos' ? '+ Objetivo' : '+ Apuntar';

  if (historial && location.hash.slice(1) !== nombre) history.replaceState(null, '', '#' + nombre);
  if (datos.cargado) SECCIONES[nombre].pintar();
}

// ── Tema ──────────────────────────────────────────────────────────────────────
function conectarTema() {
  const guardado = localStorage.getItem('panel-finanzas:tema');
  if (guardado) document.documentElement.dataset.tema = guardado;

  $('#btnTema').addEventListener('click', () => {
    const nuevo = document.documentElement.dataset.tema === 'claro' ? 'oscuro' : 'claro';
    document.documentElement.dataset.tema = nuevo;
    localStorage.setItem('panel-finanzas:tema', nuevo);
    if (datos.cargado) SECCIONES[seccionActiva].pintar(); // los gráficos leen los colores del CSS
  });
}

// ── Diálogo de movimientos (negocio y personal en el mismo sitio) ──────────────
const dlgMov = () => $('#dlgMovimiento');
const formMov = () => $('#formMovimiento');

const ambitoElegido = () => formMov().querySelector('input[name="ambito"]:checked').value;
const tipoElegido = () => formMov().querySelector('input[name="tipo"]:checked').value;

let listas = {
  gasto: ['Hosting y dominios', 'Software y licencias', 'Publicidad', 'Formación', 'Material y equipo', 'Desplazamientos', 'Suministros oficina', 'Gestoría', 'Cuota autónomos', 'Comisiones bancarias', 'Subcontratación', 'Otros gastos'],
  ingreso: ['Diseño web', 'Mantenimiento web', 'SEO local', 'Automatizaciones', 'Fotografía / contenido', 'Consultoría', 'Otros ingresos'],
  personal: ['Vivienda', 'Alimentación', 'Transporte', 'Suscripciones', 'Ocio y salidas', 'Salud', 'Ropa', 'Formación', 'Regalos', 'Viajes', 'Ahorro e inversión', 'Nómina / retirada', 'Otros ingresos', 'Otros gastos'],
  metodos: ['Banco', 'Tarjeta', 'Efectivo', 'Bizum', 'Domiciliado'],
  estados: ['Cobrado', 'Pendiente', 'Pagado'],
  areas: ['Dinero', 'Negocio', 'Salud', 'Aprendizaje', 'Personal'],
};

function ajustarFormulario() {
  const form = formMov();
  const esNegocio = ambitoElegido() === 'negocio';
  const esIngreso = tipoElegido() === 'Ingreso';

  $$('.solo-negocio').forEach((el) => el.classList.toggle('oculto', !esNegocio));
  $$('.solo-personal').forEach((el) => el.classList.toggle('oculto', esNegocio));

  const cats = esNegocio ? (esIngreso ? listas.ingreso : listas.gasto) : listas.personal;
  $('#listaCategorias').innerHTML = cats.map((c) => `<option value="${escapar(c)}">`).join('');

  const gente = [...new Set(datos.negocio.map((m) => m.quien).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
  $('#listaQuien').innerHTML = gente.map((g) => `<option value="${escapar(g)}">`).join('');

  const opciones = (sel, valores, elegido) =>
    (sel.innerHTML = valores.map((v) => `<option${v === elegido ? ' selected' : ''}>${escapar(v)}</option>`).join(''));
  opciones($('#mMetodo'), listas.metodos, esNegocio ? (esIngreso ? 'Banco' : 'Tarjeta') : 'Tarjeta');
  opciones($('#mEstado'), listas.estados, esIngreso ? 'Pendiente' : 'Pagado');
  form.deducible.value = esIngreso ? 'No' : 'Sí';

  $('#dlgTitulo').textContent = esNegocio ? 'Nuevo movimiento del negocio' : 'Nuevo movimiento personal';
  $('#dlgDestino').textContent = esNegocio ? 'hoja Movimientos' : 'hoja Personal';
}

function actualizarResumen() {
  const form = formMov();
  const base = aNumero(form.base.value);
  if (!base) {
    $('#dlgResumen').textContent = '';
    return;
  }

  const esNegocio = ambitoElegido() === 'negocio';
  const ivaPct = esNegocio ? Number(form.ivaPct.value) / 100 : 0;
  const repetir = Number(form.repetir.value);
  const cuota = base * (1 + ivaPct);

  const partes = [
    esNegocio
      ? `${tipoElegido()} de <b>${euroDec(base)}</b> + ${euroDec(base * ivaPct)} de IVA = <b>${euroDec(cuota)}</b>`
      : `${tipoElegido()} de <b>${euroDec(base)}</b>`,
  ];
  if (repetir > 1) {
    const desde = new Date(form.fecha.value + 'T00:00:00');
    const hasta = new Date(desde.getFullYear(), desde.getMonth() + repetir - 1, desde.getDate());
    const mes = (d) => d.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
    partes.push(`× ${repetir} meses (${mes(desde)} → ${mes(hasta)}) = <b>${euroDec(cuota * repetir)}</b>`);
  }
  $('#dlgResumen').innerHTML = partes.join(' · ');
}

function abrirMovimiento(ambito, fechaISO) {
  const form = formMov();
  form.reset();
  form.querySelector(`input[name="ambito"][value="${ambito}"]`).checked = true;
  form.fecha.value = fechaISO || new Date().toISOString().slice(0, 10);
  ajustarFormulario();
  $('#dlgError').textContent = '';
  $('#dlgResumen').textContent = '';
  dlgMov().showModal();
  setTimeout(() => form.concepto.focus(), 40);
}

async function guardarMovimiento(evento) {
  evento.preventDefault();
  const form = formMov();
  $('#dlgError').textContent = '';

  const base = aNumero(form.base.value);
  if (!base) {
    $('#dlgError').textContent = 'Pon un importe mayor que cero.';
    form.base.focus();
    return;
  }

  const ambito = ambitoElegido();
  const repetir = Number(form.repetir.value);
  const [a, m, d] = form.fecha.value.split('-').map(Number);

  const comun = {
    ambito,
    tipo: tipoElegido(),
    concepto: form.concepto.value,
    categoria: form.categoria.value,
    base,
    metodo: form.metodo.value,
    notas: form.notas.value,
  };
  if (ambito === 'negocio') {
    Object.assign(comun, {
      ivaPct: Number(form.ivaPct.value),
      quien: form.quien.value,
      estado: form.estado.value,
      deducible: form.deducible.value,
    });
  } else {
    comun.recurrente = form.recurrente.value;
  }

  // Mensualidades: mismo día de cada mes, ajustando si el mes es más corto.
  const lote = Array.from({ length: repetir }, (_, i) => {
    const ultimoDia = new Date(a, m - 1 + i + 1, 0).getDate();
    const dia = String(Math.min(d, ultimoDia)).padStart(2, '0');
    const fecha = new Date(a, m - 1 + i, 1);
    return { ...comun, fecha: `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${dia}` };
  });

  const boton = $('#btnGuardar');
  boton.disabled = true;
  boton.textContent = 'Guardando…';
  try {
    await api.post('/api/movimientos', lote);
    dlgMov().close();
    await cargarDatos();
    brindis(repetir > 1 ? `${repetir} movimientos guardados en el Excel` : 'Movimiento guardado en el Excel');
  } catch (e) {
    $('#dlgError').textContent = e.message;
  } finally {
    boton.disabled = false;
    boton.textContent = 'Guardar';
  }
}

// ── Diálogo de objetivos ──────────────────────────────────────────────────────
function ajustarObjetivo() {
  const form = $('#formObjetivo');
  const esHito = form.tipo.value === 'Hito';
  $$('.solo-medible').forEach((el) => el.classList.toggle('oculto', esHito));
  if (form.tipo.value === 'Importe') form.unidad.value = '€';
  else if (esHito) form.unidad.value = 'hito';
  else if (form.unidad.value === '€') form.unidad.value = 'ud.';

  // Con plazo corto la fecha límite la pone el servidor; solo se pide en largo plazo.
  const largo = form.plazo.value === 'Largo plazo';
  $('#campoLimite').classList.toggle('oculto', !largo);
  $('#notaPlazo').textContent = largo
    ? 'Sin fecha límite no puedo calcular el ritmo necesario, pero el objetivo funciona igual.'
    : `La fecha límite se calcula sola: ${{ Día: 'hoy', Semana: 'este domingo', Mes: 'fin de mes', Año: '31 de diciembre' }[form.plazo.value]}.`;
}

function abrirObjetivo() {
  const form = $('#formObjetivo');
  form.reset();
  form.inicio.value = new Date().toISOString().slice(0, 10);
  form.area.innerHTML = listas.areas.map((a) => `<option>${escapar(a)}</option>`).join('');
  form.plazo.innerHTML = (listas.plazos?.length ? listas.plazos : ['Día', 'Semana', 'Mes', 'Año', 'Largo plazo'])
    .map((p) => `<option${p === 'Mes' ? ' selected' : ''}>${escapar(p)}</option>`)
    .join('');
  ajustarObjetivo();
  $('#dlgObjError').textContent = '';
  $('#dlgObjetivo').showModal();
  setTimeout(() => form.nombre.focus(), 40);
}

async function guardarObjetivo(evento) {
  evento.preventDefault();
  const form = $('#formObjetivo');
  $('#dlgObjError').textContent = '';

  const boton = $('#btnGuardarObj');
  boton.disabled = true;
  boton.textContent = 'Guardando…';
  try {
    await api.post('/api/objetivos', {
      nombre: form.nombre.value,
      area: form.area.value,
      plazo: form.plazo.value,
      tipo: form.tipo.value,
      meta: form.tipo.value === 'Hito' ? 1 : form.meta.value,
      unidad: form.unidad.value,
      progreso: form.progreso.value || 0,
      inicio: form.inicio.value,
      limite: form.plazo.value === 'Largo plazo' ? form.limite.value || null : null,
      notas: form.notas.value,
    });
    $('#dlgObjetivo').close();
    await cargarDatos();
    irA('objetivos');
    brindis('Objetivo creado');
  } catch (e) {
    $('#dlgObjError').textContent = e.message;
  } finally {
    boton.disabled = false;
    boton.textContent = 'Guardar';
  }
}

// ── Carga ─────────────────────────────────────────────────────────────────────
function mostrarError(mensaje) {
  $('#cargando').classList.add('oculto');
  $('#errorCarga').classList.remove('oculto');
  $('#errorTexto').innerHTML = mensaje;
}

async function cargar() {
  try {
    await cargarDatos();
    $('#cargando').classList.add('oculto');
    $('#errorCarga').classList.add('oculto');
    $('#app').classList.remove('oculto');
    $('#origen').textContent = datos.origen;
    SECCIONES[seccionActiva].pintar();
  } catch (e) {
    mostrarError(`${escapar(e.message)}<br>Genera el Excel con <code>npm run excel</code> o arrastra aquí tu archivo.`);
  }
}

// ── Arranque ──────────────────────────────────────────────────────────────────
function conectar() {
  conectarTema();

  $$('.nav-boton').forEach((b) => b.addEventListener('click', () => irA(b.dataset.seccion)));
  window.addEventListener('hashchange', () => irA(location.hash.slice(1), { historial: false }));

  Object.values(SECCIONES).forEach((s) => s.conectar?.());

  // Importador: usa las mismas listas de categorías que el resto de la app.
  importar.usarListas(() => listas);
  importar.conectar();
  $('#btnImportarExtracto').addEventListener('click', importar.abrir);

  // Diálogo de movimientos
  $('#btnApuntar').addEventListener('click', () => {
    const destino = SECCIONES[seccionActiva].alta;
    destino === 'objetivo' ? abrirObjetivo() : abrirMovimiento(destino);
  });
  $('#btnCerrarDlg').addEventListener('click', () => dlgMov().close());
  $('#btnCancelar').addEventListener('click', () => dlgMov().close());
  formMov().addEventListener('submit', guardarMovimiento);
  formMov().querySelectorAll('input[name="ambito"], input[name="tipo"]').forEach((r) =>
    r.addEventListener('change', () => {
      ajustarFormulario();
      actualizarResumen();
    })
  );
  ['base', 'ivaPct', 'repetir', 'fecha'].forEach((n) => formMov()[n].addEventListener('input', actualizarResumen));

  // Diálogo de objetivos
  $('#btnCerrarObj').addEventListener('click', () => $('#dlgObjetivo').close());
  $('#btnCancelarObj').addEventListener('click', () => $('#dlgObjetivo').close());
  $('#formObjetivo').addEventListener('submit', guardarObjetivo);
  $('#formObjetivo').tipo.addEventListener('change', ajustarObjetivo);
  $('#formObjetivo').plazo.addEventListener('change', ajustarObjetivo);

  // Atajos: 1-5 cambian de sección, N apunta.
  const nombres = Object.keys(SECCIONES);
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (dlgMov().open || $('#dlgObjetivo').open) return;
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement?.tagName)) return;

    if (/^[1-5]$/.test(e.key)) {
      e.preventDefault();
      irA(nombres[Number(e.key) - 1]);
    } else if (e.key.toLowerCase() === 'n') {
      e.preventDefault();
      $('#btnApuntar').click();
    }
  });

  // Arrastrar y soltar otro Excel
  const capa = $('#soltar');
  let arrastres = 0;
  window.addEventListener('dragenter', (e) => {
    e.preventDefault();
    arrastres++;
    capa.classList.add('visible');
  });
  window.addEventListener('dragover', (e) => e.preventDefault());
  window.addEventListener('dragleave', () => {
    if (--arrastres <= 0) capa.classList.remove('visible');
  });
  window.addEventListener('drop', async (e) => {
    e.preventDefault();
    arrastres = 0;
    capa.classList.remove('visible');
    const archivo = e.dataTransfer.files[0];
    if (!archivo) return;
    try {
      await cargarDatos(await archivo.arrayBuffer(), archivo.name);
      $('#origen').textContent = archivo.name;
      $('#app').classList.remove('oculto');
      $('#errorCarga').classList.add('oculto');
      SECCIONES[seccionActiva].pintar();
    } catch (err) {
      brindis(err.message);
    }
  });

  // Cada sección se repinta cuando cambian los datos.
  alCargar(() => SECCIONES[seccionActiva].pintar());
}

// ── Instalable (y base para empaquetarlo como APK más adelante) ───────────────
function conectarPWA() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {
      /* sin service worker se pierde el modo offline, nada más */
    });
  }

  let peticion = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    peticion = e;
    $('#btnInstalar').classList.remove('oculto');
  });

  $('#btnInstalar').addEventListener('click', async () => {
    if (!peticion) return;
    peticion.prompt();
    const { outcome } = await peticion.userChoice;
    peticion = null;
    $('#btnInstalar').classList.add('oculto');
    if (outcome === 'accepted') brindis('Instalada. Búscala entre tus aplicaciones.');
  });

  window.addEventListener('appinstalled', () => $('#btnInstalar').classList.add('oculto'));
}

async function inicioApp() {
  conectar();
  conectarPWA();
  irA(location.hash.slice(1) || 'inicio', { historial: false });

  try {
    const l = await api.get('/api/listas');
    if (l?.gasto?.length) listas = { ...listas, ...l };
  } catch {
    /* sin servidor propio: se usan las listas por defecto */
  }

  await cargar();
}

inicioApp();
