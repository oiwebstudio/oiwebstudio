/* Mi panel · app de móvil.
   Cinco pantallas sobre una base de datos que vive en el propio dispositivo. */

import {
  borrar, escribirAjuste, estadisticas, exportarTodo, guardar, importarTodo,
  leerAjuste, listar, nuevoId, pedirPersistencia, vaciar,
} from './datos.js';

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

// ── Formato ───────────────────────────────────────────────────────────────────
const eur0 = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0, useGrouping: 'always' });
const eur2 = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' });
const pctF = new Intl.NumberFormat('es-ES', { style: 'percent', maximumFractionDigits: 0 });
const numF = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 });

const euro = (n) => eur0.format(n || 0);
const euroDec = (n) => eur2.format(n || 0);
const pct = (n) => pctF.format(Number.isFinite(n) ? n : 0);
const escapar = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function aNumero(v) {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
  let s = String(v ?? '').replace(/[^\d,.-]/g, '');
  if (!s) return 0;
  const coma = s.lastIndexOf(','), punto = s.lastIndexOf('.');
  if (coma > -1 && punto > -1) {
    const dec = coma > punto ? ',' : '.';
    s = s.split(dec === ',' ? '.' : ',').join('').replace(dec, '.');
  } else if (coma > -1) s = s.replace(',', '.');
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

// ── Fechas ────────────────────────────────────────────────────────────────────
const dosDig = (n) => String(n).padStart(2, '0');
const claveDe = (d) => `${d.getFullYear()}-${dosDig(d.getMonth() + 1)}-${dosDig(d.getDate())}`;
const desdeClave = (k) => { const [a, m, d] = k.split('-').map(Number); return new Date(a, m - 1, d); };
const diasEnMes = (a, m) => new Date(a, m + 1, 0).getDate();
const esFutura = (k) => desdeClave(k) > new Date(new Date().setHours(23, 59, 59, 999));

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const MESES_CORTO = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const HABITOS = [
  { id: 'gym', emoji: '🏋️', nombre: 'Gimnasio' },
  { id: 'lectura', emoji: '📚', nombre: 'Lectura' },
  { id: 'negocio', emoji: '💻', nombre: 'Proyecto' },
  { id: 'carrera', emoji: '🏃', nombre: 'Deporte' },
];

const CATEGORIAS = {
  'personal-Gasto': ['Vivienda', 'Alimentación', 'Transporte', 'Suscripciones', 'Ocio y salidas', 'Gimnasio y deporte', 'Salud', 'Ropa', 'Formación', 'Otros gastos'],
  'personal-Ingreso': ['Retiro de la empresa', 'Nómina o trabajo', 'Otros ingresos'],
  'negocio-Gasto': ['Software y hosting', 'Gestoría y licencias', 'Marketing', 'Equipamiento', 'Retiro a cuenta personal', 'Otras salidas'],
  'negocio-Ingreso': ['Cobro de cliente', 'Servicios recurrentes', 'Otros cobros'],
};

// ── Estado en memoria ─────────────────────────────────────────────────────────
const estado = {
  pantalla: 'inicio',
  nombre: 'Oier',
  movimientos: [],
  objetivos: [],
  habitos: {},          // { 'aaaa-mm-dd': ['gym', ...] }
  ambito: 'personal',
  mesDinero: new Date(),
  mesHabitos: new Date(),
  diaElegido: claveDe(new Date()),
  vistaHabitos: 'dia',
  filtroPlazo: '',
};

const HOY = claveDe(new Date());

// ── Aviso flotante ────────────────────────────────────────────────────────────
let reloj;
function avisar(texto) {
  const el = $('#brindis');
  el.textContent = texto;
  el.classList.add('visible');
  clearTimeout(reloj);
  reloj = setTimeout(() => el.classList.remove('visible'), 2500);
}

// Vibración corta al marcar: en el móvil se agradece, en el navegador no pasa nada.
const vibrar = (ms = 12) => navigator.vibrate?.(ms);

// ── Carga inicial ─────────────────────────────────────────────────────────────
async function cargar() {
  estado.movimientos = await listar('movimientos');
  estado.objetivos = await listar('objetivos');
  estado.nombre = await leerAjuste('nombre', 'Oier');

  const dias = await listar('habitos');
  estado.habitos = {};
  dias.forEach((d) => { if (d.hechos?.length) estado.habitos[d.fecha] = d.hechos; });
}

// ── Cálculos compartidos ──────────────────────────────────────────────────────
const suma = (l) => l.reduce((a, m) => a + m.importe, 0);
const delMes = (l, a, m) => l.filter((x) => { const [y, mm] = x.fecha.split('-').map(Number); return y === a && mm - 1 === m; });
const hechosDe = (k) => estado.habitos[k] || [];

function porcentajeMes(anio, mes) {
  const total = diasEnMes(anio, mes);
  let dias = 0, acumulado = 0;
  for (let d = 1; d <= total; d++) {
    const k = `${anio}-${dosDig(mes + 1)}-${dosDig(d)}`;
    if (esFutura(k)) break;
    dias++;
    acumulado += hechosDe(k).length / HABITOS.length;
  }
  return dias ? acumulado / dias : 0;
}

function racha() {
  let n = 0;
  const d = new Date();
  if (!hechosDe(claveDe(d)).length) d.setDate(d.getDate() - 1);
  while (hechosDe(claveDe(d)).length) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

const diasPlenos = (anio, mes) => {
  let n = 0;
  for (let d = 1; d <= diasEnMes(anio, mes); d++) {
    if (hechosDe(`${anio}-${dosDig(mes + 1)}-${dosDig(d)}`).length === HABITOS.length) n++;
  }
  return n;
};

// ── Pantalla: Inicio ──────────────────────────────────────────────────────────
function pintarInicio() {
  const ahora = new Date();
  const anio = ahora.getFullYear(), mes = ahora.getMonth();
  const hora = ahora.getHours();

  $('#saludo').textContent = `${hora < 6 ? 'Buenas noches' : hora < 14 ? 'Buenos días' : hora < 21 ? 'Buenas tardes' : 'Buenas noches'}, ${estado.nombre}`;
  $('#fecha').textContent = ahora.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  const negocio = estado.movimientos.filter((m) => m.ambito === 'negocio');
  const personal = estado.movimientos.filter((m) => m.ambito === 'personal');

  const caja = suma(negocio.filter((m) => m.tipo === 'Ingreso')) - suma(negocio.filter((m) => m.tipo === 'Gasto'));
  const perMes = delMes(personal, anio, mes);
  const ingPer = suma(perMes.filter((m) => m.tipo === 'Ingreso'));
  const gasPer = suma(perMes.filter((m) => m.tipo === 'Gasto'));
  const tasa = ingPer ? (ingPer - gasPer) / ingPer : null;

  const fijos = perMes.filter((m) => m.tipo === 'Gasto' && m.recurrente);
  const hechosHoy = hechosDe(HOY);
  const activos = estado.objetivos.filter((o) => o.estado !== 'Conseguido');
  const avance = activos.length ? activos.reduce((a, o) => a + Math.min(1, o.progreso / o.meta), 0) / activos.length : 0;

  $('#bento').innerHTML = `
    <button class="baldosa pastel ancha tramada anima" data-ir="dinero">
      <span class="etq">Caja del negocio</span>
      <span class="cifra num">${euro(caja)}</span>
      <div class="matriz">Tu<br>dinero</div>
      <span class="pie">${negocio.length} movimiento(s) apuntados</span>
    </button>

    <button class="baldosa azul anima" data-ir="dinero" style="animation-delay:.04s">
      <span class="etq">Tasa de ahorro</span>
      <span class="cifra chica num ${tasa === null ? '' : tasa >= 0 ? 'pos' : 'neg'}">${tasa === null ? '—' : pct(tasa)}</span>
      <span class="pie">${tasa === null ? 'sin ingresos en casa' : `${euroDec(gasPer)} gastados`}</span>
    </button>

    <button class="baldosa rosa anima" data-ir="dinero" style="animation-delay:.08s">
      <span class="etq">Gasto fijo</span>
      <span class="cifra chica num">${euro(suma(fijos))}</span>
      <span class="pie">${fijos.length ? `${euro(suma(fijos) * 12)} al año` : 'nada fijo aún'}</span>
    </button>

    <div class="baldosa naranja ancha anima" style="animation-delay:.12s">
      <span class="etq">Hábitos de hoy · ${hechosHoy.length}/${HABITOS.length}</span>
      <ul class="lista-habitos" id="habitosInicio" style="margin-top:4px"></ul>
    </div>

    <button class="baldosa purpura ancha anima" data-ir="metas" style="animation-delay:.16s">
      <span class="etq">Metas</span>
      ${
        activos.length
          ? activos.slice(0, 2).map((o) => {
              const a = Math.min(1, o.progreso / o.meta);
              return `<div style="margin-top:4px">
                <div style="display:flex;justify-content:space-between;gap:10px;font-size:13.5px;margin-bottom:5px"><span>${escapar(o.nombre)}</span><b class="num">${pct(a)}</b></div>
                <div class="carril"><span class="relleno p" style="width:${(a * 100).toFixed(1)}%"></span></div>
              </div>`;
            }).join('')
          : '<span class="pie">Todavía no has puesto ninguna meta. Pulsa + para crear la primera.</span>'
      }
      <span class="pie" style="margin-top:6px">${activos.length} activa(s) · avance medio ${pct(avance)}</span>
    </button>`;

  pintarHabitosInicio();
}

function pintarHabitosInicio() {
  const contenedor = $('#habitosInicio');
  if (!contenedor) return;
  const hechos = hechosDe(HOY);
  contenedor.innerHTML = HABITOS.map((h) => `
    <li><button class="habito" data-habito="${h.id}" data-fecha="${HOY}" aria-pressed="${hechos.includes(h.id)}">
      <span class="emoji" aria-hidden="true">${h.emoji}</span>
      <span class="nombre">${h.nombre}</span>
      <span class="check" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg></span>
    </button></li>`).join('');
}

// ── Pantalla: Dinero ──────────────────────────────────────────────────────────
function pintarDinero() {
  const anio = estado.mesDinero.getFullYear(), mes = estado.mesDinero.getMonth();
  $('#mesDinero').textContent = `${MESES[mes]} ${anio}`;

  const propios = estado.movimientos.filter((m) => m.ambito === estado.ambito);
  const mesActual = delMes(propios, anio, mes).sort((a, b) => b.fecha.localeCompare(a.fecha));

  const entra = suma(mesActual.filter((m) => m.tipo === 'Ingreso'));
  const sale = suma(mesActual.filter((m) => m.tipo === 'Gasto'));
  const neto = entra - sale;
  const tono = estado.ambito === 'personal' ? 'var(--azul)' : 'var(--verde)';

  $('#resumenDinero').innerHTML = `
    <div class="bento" style="margin-bottom:14px">
      <div class="baldosa"><span class="etq">Entra</span><span class="cifra chica num pos">${euro(entra)}</span></div>
      <div class="baldosa"><span class="etq">Sale</span><span class="cifra chica num neg">${euro(sale)}</span></div>
    </div>
    <div class="total" style="--tono: ${tono}; margin-top:0">
      <div class="total-etq">${estado.ambito === 'personal' ? 'Ahorro del mes' : 'Beneficio del mes'}<small>${mesActual.length} movimiento(s)</small></div>
      <div class="total-val num ${neto >= 0 ? 'pos' : 'neg'}">${mesActual.length ? euroDec(neto) : '—'}</div>
    </div>`;

  $('#cuentaDinero').textContent = `${mesActual.length} este mes`;

  $('#listaDinero').innerHTML = mesActual.length
    ? mesActual.map((m) => `
        <div class="fila" style="--tono: ${m.tipo === 'Ingreso' ? 'var(--verde)' : 'var(--rosa)'}">
          <i class="punto"></i>
          <div class="fila-txt">
            <b>${escapar(m.concepto)}</b>
            <span>${escapar(m.categoria)} · ${desdeClave(m.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}${m.recurrente ? ' · fijo' : ''}</span>
          </div>
          <div class="fila-cifra num ${m.tipo === 'Ingreso' ? 'pos' : 'neg'}">${m.tipo === 'Ingreso' ? '' : '−'}${euroDec(m.importe)}</div>
          <button class="borrar" data-borrar-mov="${m.id}" aria-label="Borrar ${escapar(m.concepto)}">✕</button>
        </div>`).join('')
    : `<div class="vacio"><b>Nada apuntado este mes</b>Pulsa el botón + para añadir el primero.</div>`;
}

// ── Pantalla: Hábitos ─────────────────────────────────────────────────────────
function pintarHabitos() {
  const anio = estado.mesHabitos.getFullYear(), mes = estado.mesHabitos.getMonth();
  $('#etiquetaMesHabitos').textContent = estado.vistaHabitos === 'anio' ? String(anio) : `${MESES[mes]} ${anio}`;

  const esDia = estado.vistaHabitos === 'dia';
  $('#vistaDia').classList.toggle('oculto', !esDia);
  $('#vistaResumen').classList.toggle('oculto', esDia);
  $('#bloqueChecklist').classList.toggle('oculto', !esDia);

  if (esDia) pintarRejilla(anio, mes);
  else if (estado.vistaHabitos === 'mes') pintarSemanas(anio, mes);
  else pintarMeses(anio);

  pintarChecklist();
}

function pintarRejilla(anio, mes) {
  const desplazamiento = (new Date(anio, mes, 1).getDay() + 6) % 7;
  const total = diasEnMes(anio, mes);
  const celdas = Math.ceil((desplazamiento + total) / 7) * 7;

  let html = '';
  for (let i = 0; i < celdas; i++) {
    const fecha = new Date(anio, mes, 1 - desplazamiento + i);
    const k = claveDe(fecha);
    const fuera = fecha.getMonth() !== mes;
    const hechos = hechosDe(k).length;

    html += `<button class="celda ${fuera ? 'fuera' : ''} ${k === HOY ? 'hoy' : ''} ${k === estado.diaElegido ? 'elegida' : ''} ${hechos === HABITOS.length ? 'completo' : ''}"
      data-dia="${k}" aria-label="${fecha.getDate()} de ${MESES[fecha.getMonth()]}, ${hechos} de ${HABITOS.length}">
      <span class="dia num">${fecha.getDate()}</span>
      <span class="ticks">${'<i class="tick"></i>'.repeat(hechos)}</span>
    </button>`;
  }
  $('#rejilla').innerHTML = html;
}

function pintarSemanas(anio, mes) {
  const total = diasEnMes(anio, mes);
  let html = '<div style="display:grid; gap:11px">';
  let semana = 1;

  for (let desde = 1; desde <= total; desde += 7, semana++) {
    const hasta = Math.min(desde + 6, total);
    let dias = 0, acumulado = 0;
    for (let d = desde; d <= hasta; d++) {
      const k = `${anio}-${dosDig(mes + 1)}-${dosDig(d)}`;
      if (esFutura(k)) break;
      dias++;
      acumulado += hechosDe(k).length / HABITOS.length;
    }
    const p = dias ? acumulado / dias : 0;

    html += `<div>
      <div style="display:flex;justify-content:space-between;gap:10px;margin-bottom:6px">
        <b style="font-size:14.5px">Semana ${semana}</b><span class="num" style="font-weight:700">${pct(p)}</span>
      </div>
      <div class="escala"><span>${desde}–${hasta} ${MESES_CORTO[mes]}</span><span>${dias} día(s)</span></div>
      <div class="carril"><span class="relleno ${p >= 0.75 ? 'v' : p < 0.35 ? 'r' : 'n'}" style="width:${(p * 100).toFixed(1)}%"></span></div>
    </div>`;
  }
  $('#vistaResumen').innerHTML = html + '</div>';
}

function pintarMeses(anio) {
  const hoyReal = new Date();
  $('#vistaResumen').innerHTML = `<div style="display:grid; grid-template-columns:repeat(2,1fr); gap:10px">${
    MESES.map((nombre, m) => {
      const futuro = anio > hoyReal.getFullYear() || (anio === hoyReal.getFullYear() && m > hoyReal.getMonth());
      const p = futuro ? 0 : porcentajeMes(anio, m);
      return `<button class="objetivo" data-mes="${m}" style="padding:12px">
        <div class="objetivo-cab"><b>${nombre}</b><span class="objetivo-pct num" style="--tono:var(--naranja)">${futuro ? '—' : pct(p)}</span></div>
        <div class="carril"><span class="relleno n" style="width:${(p * 100).toFixed(1)}%"></span></div>
      </button>`;
    }).join('')
  }</div>`;
}

function pintarChecklist() {
  const fecha = desdeClave(estado.diaElegido);
  const hechos = hechosDe(estado.diaElegido);

  $('#fechaElegida').textContent = estado.diaElegido === HOY
    ? 'Hoy'
    : fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).replace(/^./, (c) => c.toUpperCase());

  const ratio = $('#ratio');
  ratio.textContent = `${hechos.length}/${HABITOS.length}`;
  ratio.style.setProperty('--tono', hechos.length === HABITOS.length ? 'var(--verde)' : 'var(--naranja)');

  $('#listaHabitos').innerHTML = HABITOS.map((h) => `
    <li><button class="habito" data-habito="${h.id}" data-fecha="${estado.diaElegido}" aria-pressed="${hechos.includes(h.id)}">
      <span class="emoji" aria-hidden="true">${h.emoji}</span>
      <span class="nombre">${h.nombre}</span>
      <span class="check" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg></span>
    </button></li>`).join('');

  $('#statRacha').textContent = racha();
  $('#statMes').textContent = pct(porcentajeMes(estado.mesHabitos.getFullYear(), estado.mesHabitos.getMonth()));
  $('#statPlenos').textContent = diasPlenos(estado.mesHabitos.getFullYear(), estado.mesHabitos.getMonth());
}

// ── Pantalla: Metas ───────────────────────────────────────────────────────────
function pintarMetas() {
  const activos = estado.objetivos.filter((o) => o.estado !== 'Conseguido');
  const logrados = estado.objetivos.filter((o) => o.estado === 'Conseguido');
  $('#resumenMetas').textContent = estado.objetivos.length
    ? `${activos.length} en marcha · ${logrados.length} conseguida(s)`
    : 'Ninguna todavía';

  const lista = estado.objetivos.filter((o) => !estado.filtroPlazo || o.plazo === estado.filtroPlazo);

  $('#listaMetas').innerHTML = lista.length
    ? lista.map((o) => {
        const avance = Math.min(1, o.progreso / o.meta);
        const logrado = o.estado === 'Conseguido';
        const valor = (n) => (o.unidad === '€' ? euroDec(n) : `${numF.format(n)} ${o.unidad}`);
        return `<article class="objetivo" style="--tono: ${logrado ? 'var(--verde)' : 'var(--purpura)'}">
          <div class="objetivo-cab"><b>${escapar(o.nombre)}</b><span class="objetivo-pct num">${pct(avance)}</span></div>
          <div class="carril"><span class="relleno ${logrado ? 'v' : 'p'}" style="width:${(avance * 100).toFixed(1)}%"></span></div>
          <div class="objetivo-pie"><span class="num">${valor(o.progreso)} de ${valor(o.meta)}</span><span>${escapar(o.plazo)} · ${escapar(o.area)}</span></div>
          <div class="objetivo-acciones">
            ${logrado ? `<button data-meta-reabrir="${o.id}">Reabrir</button>` : `<button data-meta-sumar="${o.id}">+ Progreso</button><button data-meta-hecho="${o.id}">Conseguida</button>`}
            <button class="peligro" data-meta-borrar="${o.id}">Borrar</button>
          </div>
        </article>`;
      }).join('')
    : `<div class="tarjeta"><div class="vacio"><b>${estado.objetivos.length ? 'Nada con este filtro' : 'Sin metas todavía'}</b>${estado.objetivos.length ? 'Prueba con otro plazo.' : 'Pulsa + para crear un fondo de ahorro o un objetivo.'}</div></div>`;
}

// ── Pantalla: Ajustes ─────────────────────────────────────────────────────────
async function pintarAjustes() {
  const { cuentas, espacio } = await estadisticas();
  $('#cntMovimientos').textContent = cuentas.movimientos;
  $('#cntObjetivos').textContent = cuentas.objetivos;
  $('#cntHabitos').textContent = Object.keys(estado.habitos).length;
  $('#espacio').textContent = espacio === null ? '—' : `${(espacio / 1024).toFixed(0)} kB`;

  const persistente = await pedirPersistencia();
  $('#estadoPersistencia').textContent =
    persistente === true ? 'el sistema no los borrará' : persistente === false ? 'el sistema podría borrarlos si va justo de espacio' : 'no se puede comprobar aquí';
  $('#iconoPersistencia').textContent = persistente === true ? '✓' : '!';
  $('#iconoPersistencia').className = 'fila-cifra ' + (persistente === true ? 'pos' : 'neg');
}

// ── Router ────────────────────────────────────────────────────────────────────
function ir(pantalla) {
  estado.pantalla = pantalla;
  $$('.pantalla').forEach((s) => s.classList.toggle('oculto', s.dataset.pantalla !== pantalla));
  $$('.pestana').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.ir === pantalla)));
  $('#btnAnadir').classList.toggle('oculto', pantalla === 'ajustes' || pantalla === 'habitos');
  window.scrollTo({ top: 0 });
  pintar();
}

function pintar() {
  if (estado.pantalla === 'inicio') pintarInicio();
  else if (estado.pantalla === 'dinero') pintarDinero();
  else if (estado.pantalla === 'habitos') pintarHabitos();
  else if (estado.pantalla === 'metas') pintarMetas();
  else pintarAjustes();
}

// ── Alta de movimientos ───────────────────────────────────────────────────────
const formMov = () => $('#formMovimiento');
const valorRadio = (form, nombre) => form.querySelector(`input[name="${nombre}"]:checked`).value;

function refrescarCategorias() {
  const form = formMov();
  const ambito = valorRadio(form, 'ambito');
  const tipo = valorRadio(form, 'tipo');
  form.categoria.innerHTML = CATEGORIAS[`${ambito}-${tipo}`].map((c) => `<option>${escapar(c)}</option>`).join('');
  // Lo recurrente solo tiene sentido en gastos: es para alquiler y suscripciones.
  $('#campoRecurrente').classList.toggle('oculto', tipo !== 'Gasto');
  $('#tituloMovimiento').textContent = ambito === 'personal' ? 'Movimiento de casa' : 'Movimiento del negocio';
}

function abrirMovimiento() {
  const form = formMov();
  form.reset();
  form.querySelector(`input[name="ambito"][value="${estado.ambito}"]`).checked = true;
  form.fecha.value = HOY;
  refrescarCategorias();
  $('#errorMovimiento').textContent = '';
  $('#hojaMovimiento').showModal();
}

async function guardarMovimiento(e) {
  e.preventDefault();
  const form = formMov();
  const importe = aNumero(form.importe.value);

  if (!importe || importe <= 0) { $('#errorMovimiento').textContent = 'Pon un importe mayor que cero.'; return; }
  if (!form.concepto.value.trim()) { $('#errorMovimiento').textContent = 'Falta el concepto.'; return; }

  const registro = {
    id: nuevoId(),
    ambito: valorRadio(form, 'ambito'),
    tipo: valorRadio(form, 'tipo'),
    concepto: form.concepto.value.trim(),
    categoria: form.categoria.value,
    importe: Math.round(importe * 100) / 100,
    fecha: form.fecha.value,
    recurrente: valorRadio(form, 'tipo') === 'Gasto' && form.recurrente.value === 'Sí',
  };

  await guardar('movimientos', registro);
  estado.movimientos.push(registro);
  estado.ambito = registro.ambito;
  $$('[data-ambito]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.ambito === registro.ambito)));

  const [a, m] = registro.fecha.split('-').map(Number);
  estado.mesDinero = new Date(a, m - 1, 1);

  $('#hojaMovimiento').close();
  ir('dinero');
  avisar('Movimiento guardado');
}

// ── Alta de metas ─────────────────────────────────────────────────────────────
async function guardarMeta(e) {
  e.preventDefault();
  const form = $('#formMeta');
  const meta = aNumero(form.meta.value);

  if (!form.nombre.value.trim()) { $('#errorMeta').textContent = 'Falta el nombre.'; return; }
  if (!meta || meta <= 0) { $('#errorMeta').textContent = 'La meta tiene que ser mayor que cero.'; return; }

  const registro = {
    id: nuevoId(),
    nombre: form.nombre.value.trim(),
    meta: Math.round(meta * 100) / 100,
    progreso: Math.max(0, Math.round(aNumero(form.progreso.value) * 100) / 100),
    unidad: form.unidad.value.trim() || 'ud.',
    plazo: form.plazo.value,
    area: form.area.value,
    estado: 'Activo',
  };

  await guardar('objetivos', registro);
  estado.objetivos.push(registro);
  $('#hojaMeta').close();
  ir('metas');
  avisar('Meta creada');
}

// ── Hábitos ───────────────────────────────────────────────────────────────────
async function alternarHabito(id, fecha) {
  if (esFutura(fecha)) { avisar('Ese día todavía no ha llegado'); return; }

  const hechos = new Set(hechosDe(fecha));
  hechos.has(id) ? hechos.delete(id) : hechos.add(id);
  const lista = [...hechos];

  if (lista.length) estado.habitos[fecha] = lista;
  else delete estado.habitos[fecha];

  await guardar('habitos', { fecha, hechos: lista });
  vibrar();
  pintar();

  if (lista.length === HABITOS.length) avisar('¡Día completo!');
}

// ── Eventos ───────────────────────────────────────────────────────────────────
function conectar() {
  // Navegación
  $$('.pestana').forEach((b) => b.addEventListener('click', () => ir(b.dataset.ir)));
  $('#btnAjustes').addEventListener('click', () => ir('ajustes'));

  $('#btnAnadir').addEventListener('click', () => {
    if (estado.pantalla === 'metas') {
      $('#formMeta').reset();
      $('#errorMeta').textContent = '';
      $('#hojaMeta').showModal();
    } else {
      abrirMovimiento();
    }
  });

  // Formularios
  formMov().addEventListener('submit', guardarMovimiento);
  formMov().querySelectorAll('input[name="ambito"], input[name="tipo"]').forEach((r) => r.addEventListener('change', refrescarCategorias));
  $('#formMeta').addEventListener('submit', guardarMeta);

  // Dinero
  $$('[data-ambito]').forEach((b) => b.addEventListener('click', () => {
    estado.ambito = b.dataset.ambito;
    $$('[data-ambito]').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    pintarDinero();
  }));

  $('#mesAtras').addEventListener('click', () => { estado.mesDinero = new Date(estado.mesDinero.getFullYear(), estado.mesDinero.getMonth() - 1, 1); pintarDinero(); });
  $('#mesAdelante').addEventListener('click', () => { estado.mesDinero = new Date(estado.mesDinero.getFullYear(), estado.mesDinero.getMonth() + 1, 1); pintarDinero(); });

  // Hábitos
  $$('[data-vista]').forEach((b) => b.addEventListener('click', () => {
    estado.vistaHabitos = b.dataset.vista;
    $$('[data-vista]').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    pintarHabitos();
  }));

  const moverHabitos = (paso) => {
    estado.mesHabitos = estado.vistaHabitos === 'anio'
      ? new Date(estado.mesHabitos.getFullYear() + paso, estado.mesHabitos.getMonth(), 1)
      : new Date(estado.mesHabitos.getFullYear(), estado.mesHabitos.getMonth() + paso, 1);
    pintarHabitos();
  };

  $('#habAtras').addEventListener('click', () => moverHabitos(-1));
  $('#habAdelante').addEventListener('click', () => moverHabitos(1));

  // Metas
  $$('[data-plazo]').forEach((b) => b.addEventListener('click', () => {
    estado.filtroPlazo = b.dataset.plazo;
    $$('[data-plazo]').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    pintarMetas();
  }));

  // Delegación general: todo lo que se repinta continuamente
  document.addEventListener('click', async (e) => {
    const cerrar = e.target.closest('[data-cerrar]');
    if (cerrar) return $('#' + cerrar.dataset.cerrar).close();

    const irA = e.target.closest('[data-ir]');
    if (irA && !irA.classList.contains('pestana')) return ir(irA.dataset.ir);

    const habito = e.target.closest('[data-habito]');
    if (habito) return alternarHabito(habito.dataset.habito, habito.dataset.fecha);

    const dia = e.target.closest('[data-dia]');
    if (dia) {
      estado.diaElegido = dia.dataset.dia;
      const f = desdeClave(estado.diaElegido);
      if (f.getMonth() !== estado.mesHabitos.getMonth()) estado.mesHabitos = new Date(f.getFullYear(), f.getMonth(), 1);
      return pintarHabitos();
    }

    const mesTarjeta = e.target.closest('[data-mes]');
    if (mesTarjeta) {
      estado.mesHabitos = new Date(estado.mesHabitos.getFullYear(), Number(mesTarjeta.dataset.mes), 1);
      estado.vistaHabitos = 'dia';
      $$('[data-vista]').forEach((x) => x.setAttribute('aria-selected', String(x.dataset.vista === 'dia')));
      return pintarHabitos();
    }

    const borrarMov = e.target.closest('[data-borrar-mov]');
    if (borrarMov) {
      const m = estado.movimientos.find((x) => x.id === borrarMov.dataset.borrarMov);
      if (!m || !confirm(`¿Borrar "${m.concepto}" de ${euroDec(m.importe)}?`)) return;
      await borrar('movimientos', m.id);
      estado.movimientos = estado.movimientos.filter((x) => x.id !== m.id);
      pintar();
      return avisar('Movimiento borrado');
    }

    // Acciones sobre metas
    const sumar = e.target.closest('[data-meta-sumar]');
    if (sumar) {
      const o = estado.objetivos.find((x) => x.id === sumar.dataset.metaSumar);
      const respuesta = prompt(`¿Cuánto sumas a "${o.nombre}"?\n\nVas por ${numF.format(o.progreso)} de ${numF.format(o.meta)} ${o.unidad}.`, '');
      if (respuesta === null || !respuesta.trim()) return;
      o.progreso = Math.max(0, Math.round((o.progreso + aNumero(respuesta)) * 100) / 100);
      if (o.progreso >= o.meta) o.estado = 'Conseguido';
      await guardar('objetivos', o);
      pintarMetas();
      return avisar(o.estado === 'Conseguido' ? '¡Meta conseguida!' : 'Progreso actualizado');
    }

    const hecho = e.target.closest('[data-meta-hecho]');
    if (hecho) {
      const o = estado.objetivos.find((x) => x.id === hecho.dataset.metaHecho);
      o.progreso = o.meta;
      o.estado = 'Conseguido';
      await guardar('objetivos', o);
      pintarMetas();
      return avisar('¡Meta conseguida!');
    }

    const reabrir = e.target.closest('[data-meta-reabrir]');
    if (reabrir) {
      const o = estado.objetivos.find((x) => x.id === reabrir.dataset.metaReabrir);
      o.estado = 'Activo';
      await guardar('objetivos', o);
      return pintarMetas();
    }

    const borrarMeta = e.target.closest('[data-meta-borrar]');
    if (borrarMeta) {
      const o = estado.objetivos.find((x) => x.id === borrarMeta.dataset.metaBorrar);
      if (!o || !confirm(`¿Borrar la meta "${o.nombre}"?`)) return;
      await borrar('objetivos', o.id);
      estado.objetivos = estado.objetivos.filter((x) => x.id !== o.id);
      pintarMetas();
      return avisar('Meta borrada');
    }
  });

  // ── Copia de seguridad ──
  $('#btnExportar').addEventListener('click', async () => {
    const copia = await exportarTodo();
    const blob = new Blob([JSON.stringify(copia, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mi-panel-${HOY}.json`;
    a.click();
    URL.revokeObjectURL(url);
    avisar('Copia exportada');
  });

  $('#btnImportar').addEventListener('click', () => $('#ficheroImportar').click());

  $('#ficheroImportar').addEventListener('change', async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    try {
      const resumen = await importarTodo(JSON.parse(await archivo.text()));
      await cargar();
      pintar();
      avisar(`Importados ${resumen.movimientos} movimiento(s)`);
    } catch (err) {
      avisar(err.message || 'Ese archivo no vale');
    }
    e.target.value = '';
  });

  $('#btnVaciar').addEventListener('click', async () => {
    if (!confirm('Esto borra todos tus movimientos, metas y hábitos de este dispositivo.\n\nExporta antes si quieres conservarlos. ¿Seguir?')) return;
    for (const almacen of ['movimientos', 'objetivos', 'habitos']) await vaciar(almacen);
    await cargar();
    pintar();
    avisar('Todo borrado');
  });
}

// ── Arranque ──────────────────────────────────────────────────────────────────
(async () => {
  try {
    await cargar();
  } catch (e) {
    avisar(e.message);
  }

  conectar();
  ir('inicio');

  // Pide al sistema no borrar los datos: viven solo aquí.
  pedirPersistencia();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
