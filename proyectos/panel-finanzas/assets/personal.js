/* Sección Personal: el dinero de casa. Sin IVA, sin deducible, sin estados.
   Aquí la cifra que manda no es el saldo, es la tasa de ahorro. */

import {
  $, $$, MESES, MESES_LARGO, agrupar, api, baseOpciones, brindis, cargarDatos, conAlfa, datos,
  dibujar, escapar, euro, euroDec, fmtFecha, normalizar, opcionesHorizontal, paleta, pct, porMes, suma, tema,
} from './comun.js';

const POR_PAGINA = 25;

const estado = {
  orden: { col: 'fecha', dir: 'desc' },
  pagina: 1,
  filtroCategoria: null,
  presupuestos: [],
};

// ── Presupuestos ──────────────────────────────────────────────────────────────
export async function cargarPresupuestos() {
  try {
    estado.presupuestos = await api.get('/api/presupuestos');
  } catch {
    estado.presupuestos = []; // sin servidor propio simplemente no hay topes
  }
}

function pintarPresupuestos(f) {
  const conTope = estado.presupuestos.filter((p) => p.tope > 0);
  const panel = $('#pPresupuestos');

  if (!conTope.length) {
    panel.innerHTML =
      '<p class="nada">Sin topes puestos. Pulsa <b>Editar topes</b> y pon un máximo mensual a las categorías que se te vayan de las manos.</p>';
    return;
  }

  // Siempre contra el mes elegido: un tope mensual comparado con un año no dice nada.
  const ahora = new Date();
  const anio = Number(f.anio) || ahora.getFullYear();
  const mes = f.mes !== '' ? Number(f.mes) : ahora.getMonth();

  const gastoDe = (cat) =>
    datos.personal
      .filter((m) => m.tipo === 'Gasto' && m.categoria === cat && m.anio === anio && m.mes === mes)
      .reduce((a, m) => a + m.base, 0);

  const filas = conTope
    .map((p) => ({ ...p, gastado: gastoDe(p.categoria), consumido: gastoDe(p.categoria) / p.tope }))
    .sort((a, b) => b.consumido - a.consumido);

  const totalTope = filas.reduce((a, p) => a + p.tope, 0);
  const totalGasto = filas.reduce((a, p) => a + p.gastado, 0);

  $('#pNotaPresu').innerHTML = `${euro(totalGasto)} de ${euro(totalTope)} · <b class="${totalGasto > totalTope ? 'neg' : 'pos'}">${pct(totalTope ? totalGasto / totalTope : 0)}</b> del mes`;

  panel.innerHTML = `<ul class="mini-lista columnas">${filas
    .map((p) => {
      const color = p.consumido > 1 ? 'neg' : p.consumido > 0.8 ? 'aviso' : 'pos';
      const resto = p.tope - p.gastado;
      return `<li>
        <div class="mini-cab"><span>${escapar(p.categoria)}</span><span class="num ${color}">${pct(p.consumido)}</span></div>
        <div class="barra"><span class="barra-relleno ${color}" style="width:${Math.min(100, p.consumido * 100).toFixed(1)}%"></span></div>
        <div class="mini-pie">
          <span>${euroDec(p.gastado)} de ${euroDec(p.tope)}</span>
          <span class="${resto < 0 ? 'neg' : ''}">${resto < 0 ? `${euroDec(-resto)} de más` : `quedan ${euroDec(resto)}`}</span>
        </div>
      </li>`;
    })
    .join('')}</ul>`;
}

export function abrirEditorTopes() {
  const cats = [...new Set([...estado.presupuestos.map((p) => p.categoria)])];
  $('#topesRejilla').innerHTML = cats
    .map((c) => {
      const p = estado.presupuestos.find((x) => x.categoria === c);
      return `<div class="campo">
        <label for="tope-${escapar(c)}">${escapar(c)}</label>
        <input id="tope-${escapar(c)}" data-categoria="${escapar(c)}" inputmode="decimal" placeholder="sin tope" value="${p?.tope ? p.tope : ''}">
      </div>`;
    })
    .join('');
  $('#topesError').textContent = '';
  $('#dlgTopes').showModal();
}

async function guardarTopes(evento) {
  evento.preventDefault();
  const topes = {};
  $$('#topesRejilla input').forEach((i) => (topes[i.dataset.categoria] = i.value.trim()));

  const boton = $('#btnGuardarTopes');
  boton.disabled = true;
  boton.textContent = 'Guardando…';
  try {
    await api.put('/api/presupuestos', topes);
    await cargarPresupuestos();
    $('#dlgTopes').close();
    pintar();
    brindis('Topes guardados en el Excel');
  } catch (e) {
    $('#topesError').textContent = e.message;
  } finally {
    boton.disabled = false;
    boton.textContent = 'Guardar';
  }
}

function leerFiltros() {
  return {
    anio: $('#pAnio').value,
    mes: $('#pMes').value,
    tipo: $('#pTipo').value,
    cat: $('#pCat').value,
    buscar: normalizar($('#pBuscar').value),
  };
}

function aplicar(movs, f, { ignorarTipo = false, ignorarMes = false } = {}) {
  return movs.filter((m) => {
    if (f.anio && String(m.anio) !== f.anio) return false;
    if (!ignorarMes && f.mes !== '' && String(m.mes) !== f.mes) return false;
    if (!ignorarTipo && f.tipo && m.tipo !== f.tipo) return false;
    if (f.cat && m.categoria !== f.cat) return false;
    if (estado.filtroCategoria && m.categoria !== estado.filtroCategoria) return false;
    if (f.buscar) {
      const heno = normalizar(`${m.concepto} ${m.categoria} ${m.metodo} ${m.notas}`);
      if (!heno.includes(f.buscar)) return false;
    }
    return true;
  });
}

// ── KPIs ──────────────────────────────────────────────────────────────────────
function pintarKpis(movs, delAnio, f) {
  const ing = suma(movs.filter((m) => m.tipo === 'Ingreso'));
  const gas = suma(movs.filter((m) => m.tipo === 'Gasto'));
  const ahorro = ing - gas;
  const tasa = ing ? ahorro / ing : 0;

  const recurrentes = movs.filter((m) => m.tipo === 'Gasto' && m.recurrente);
  const fijo = suma(recurrentes);

  // Media diaria y proyección: solo tienen sentido mirando un mes concreto.
  const unMes = f.mes !== '';
  const ahora = new Date();
  const mesEnCurso = unMes && Number(f.mes) === ahora.getMonth() && String(ahora.getFullYear()) === f.anio;
  const diasDelMes = unMes ? new Date(Number(f.anio || ahora.getFullYear()), Number(f.mes) + 1, 0).getDate() : 0;
  const diasTranscurridos = mesEnCurso ? ahora.getDate() : diasDelMes;
  const media = unMes && diasTranscurridos ? gas / diasTranscurridos : 0;
  const proyeccion = media * diasDelMes;

  const tarjetas = [
    { etq: 'Ingresos', valor: euro(ing), cls: 'pos', pie: unMes ? MESES_LARGO[Number(f.mes)] : 'periodo seleccionado' },
    { etq: 'Gastos', valor: euro(gas), cls: 'neg', pie: `${movs.filter((m) => m.tipo === 'Gasto').length} movimiento(s)` },
    { etq: 'Ahorro', valor: euro(ahorro), cls: ahorro >= 0 ? 'pos' : 'neg', pie: ahorro >= 0 ? 'te queda en el bolsillo' : 'has gastado de más' },
    { etq: 'Tasa de ahorro', valor: ing ? pct(tasa) : '—', cls: tasa >= 0.2 ? 'pos' : tasa >= 0 ? '' : 'neg', pie: ing ? 'de cada euro que entra' : 'sin ingresos apuntados' },
    { etq: 'Gasto fijo', valor: euro(fijo), cls: 'aviso', pie: `${recurrentes.length} recurrente(s) · ${euro(fijo * 12)}/año` },
    unMes
      ? { etq: 'Media diaria', valor: euro(media), cls: '', pie: mesEnCurso ? `cierre estimado ${euro(proyeccion)}` : `sobre ${diasDelMes} días` }
      : { etq: 'Gasto medio / mes', valor: euro(gas / Math.max(1, new Set(delAnio.filter((m) => m.tipo === 'Gasto').map((m) => m.mes)).size)), cls: '', pie: 'meses con movimientos' },
  ];

  $('#pKpis').innerHTML = tarjetas
    .map((t) => `<article class="kpi"><div class="kpi-etq">${t.etq}</div><div class="kpi-cifra ${t.cls}">${t.valor}</div><div class="kpi-delta">${t.pie || '&nbsp;'}</div></article>`)
    .join('');
}

// ── Gráficos ──────────────────────────────────────────────────────────────────
function pintarGraficos(delAnio, delPeriodo, f) {
  const t = tema();

  // 1 · Ingresos, gastos y ahorro mes a mes (todo el año, ignorando el mes elegido)
  const ing = porMes(delAnio, (m) => m.tipo === 'Ingreso');
  const gas = porMes(delAnio, (m) => m.tipo === 'Gasto');
  dibujar('gPerMensual', {
    type: 'bar',
    data: {
      labels: MESES,
      datasets: [
        { label: 'Ingresos', data: ing, backgroundColor: t.pos, borderRadius: 3, maxBarThickness: 20 },
        { label: 'Gastos', data: gas, backgroundColor: t.neg, borderRadius: 3, maxBarThickness: 20 },
        { label: 'Ahorro', type: 'line', data: ing.map((v, i) => v - gas[i]), borderColor: t.acento, backgroundColor: conAlfa(t.acento, 0.12), borderWidth: 2, tension: 0.3, pointRadius: 0, fill: true },
      ],
    },
    options: {
      ...baseOpciones(t),
      plugins: { ...baseOpciones(t).plugins, legend: { display: true, position: 'bottom', labels: { color: t.muted, boxWidth: 10, boxHeight: 10, font: { size: 11 } } } },
    },
  });

  // 2 · Reparto por categoría — clic para filtrar
  const cats = agrupar(delPeriodo.filter((m) => m.tipo === 'Gasto'), 'categoria');
  const colores = paleta(t, cats.length);
  dibujar('gPerCategorias', {
    type: 'doughnut',
    data: { labels: cats.map((c) => c[0]), datasets: [{ data: cats.map((c) => c[1]), backgroundColor: colores, borderColor: t.surface, borderWidth: 2 }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '58%',
      animation: { duration: 320 },
      plugins: {
        legend: { display: true, position: 'right', labels: { color: t.muted, boxWidth: 9, boxHeight: 9, font: { size: 11 }, padding: 8 } },
        tooltip: {
          backgroundColor: t.surface, borderColor: t.linea, borderWidth: 1, titleColor: t.texto, bodyColor: t.texto, padding: 10,
          callbacks: { label: (c) => ` ${c.label}: ${euroDec(c.parsed)}` },
        },
      },
      onClick: (_e, elementos) => {
        const entrada = elementos.length && cats[elementos[0].index];
        if (!entrada) return;
        estado.filtroCategoria = estado.filtroCategoria === entrada[0] ? null : entrada[0];
        estado.pagina = 1;
        pintar();
      },
    },
  });

  // 3 · La carrera del mes: acumulado diario contra el mes anterior
  const anio = Number(f.anio) || new Date().getFullYear();
  const mesRef = f.mes !== '' ? Number(f.mes) : new Date().getMonth();
  const acumuladoDe = (mes, anioMes) => {
    const dias = new Date(anioMes, mes + 1, 0).getDate();
    const serie = new Array(dias).fill(0);
    datos.personal
      .filter((m) => m.tipo === 'Gasto' && m.mes === mes && m.anio === anioMes)
      .forEach((m) => (serie[m.dia - 1] += m.base));
    let acc = 0;
    return serie.map((v) => (acc += v));
  };
  const mesAnterior = mesRef === 0 ? 11 : mesRef - 1;
  const anioAnterior = mesRef === 0 ? anio - 1 : anio;
  const serieActual = acumuladoDe(mesRef, anio);
  const seriePrevia = acumuladoDe(mesAnterior, anioAnterior);
  const dias = Math.max(serieActual.length, seriePrevia.length);

  dibujar('gPerCarrera', {
    type: 'line',
    data: {
      labels: Array.from({ length: dias }, (_, i) => i + 1),
      datasets: [
        { label: MESES_LARGO[mesAnterior], data: seriePrevia, borderColor: t.muted, borderWidth: 1.5, borderDash: [4, 4], tension: 0.25, pointRadius: 0 },
        { label: MESES_LARGO[mesRef], data: serieActual, borderColor: t.neg, backgroundColor: conAlfa(t.neg, 0.14), fill: true, borderWidth: 2, tension: 0.25, pointRadius: 0 },
      ],
    },
    options: {
      ...baseOpciones(t),
      plugins: { ...baseOpciones(t).plugins, legend: { display: true, position: 'bottom', labels: { color: t.muted, boxWidth: 10, boxHeight: 10, font: { size: 11 } } } },
      scales: { ...baseOpciones(t).scales, x: { grid: { display: false }, border: { color: t.linea }, ticks: { color: t.muted, font: { size: 10 }, maxTicksLimit: 10 } } },
    },
  });

  // 4 · Suscripciones y fijos, con lo que suponen al año
  const rec = agrupar(delPeriodo.filter((m) => m.tipo === 'Gasto' && m.recurrente), 'concepto').slice(0, 8);
  dibujar('gPerRecurrentes', {
    type: 'bar',
    data: { labels: rec.map((r) => r[0]), datasets: [{ label: 'Al año', data: rec.map((r) => r[1] * 12), backgroundColor: t.alerta, borderRadius: 3, maxBarThickness: 16 }] },
    options: opcionesHorizontal(t),
  });
  $('#pNotaRec').textContent = rec.length ? `${euro(suma(delPeriodo.filter((m) => m.tipo === 'Gasto' && m.recurrente)) * 12)} al año` : 'nada marcado como recurrente';
}

// ── Tabla ─────────────────────────────────────────────────────────────────────
function pintarTabla(movs) {
  const { col, dir } = estado.orden;
  const signo = dir === 'asc' ? 1 : -1;
  const ordenados = [...movs].sort((a, b) => {
    const x = a[col], y = b[col];
    if (x instanceof Date) return (x - y) * signo;
    if (typeof x === 'number') return (x - y) * signo;
    return String(x).localeCompare(String(y), 'es') * signo;
  });

  const paginas = Math.max(1, Math.ceil(ordenados.length / POR_PAGINA));
  estado.pagina = Math.min(estado.pagina, paginas);
  const desde = (estado.pagina - 1) * POR_PAGINA;

  $('#pTbody').innerHTML = ordenados
    .slice(desde, desde + POR_PAGINA)
    .map((m) => {
      const esIng = m.tipo === 'Ingreso';
      return `<tr>
        <td class="num">${fmtFecha.format(m.fecha)}</td>
        <td><span class="chip ${esIng ? 'ingreso' : 'gasto'}">${m.tipo}</span></td>
        <td class="ancho">${escapar(m.concepto)}</td>
        <td>${escapar(m.categoria)}</td>
        <td class="num ${esIng ? 'pos' : 'neg'}">${esIng ? '' : '−'}${euroDec(m.base)}</td>
        <td>${escapar(m.metodo)}</td>
        <td>${m.recurrente ? '<span class="chip pendiente">Recurrente</span>' : ''}</td>
        <td class="acciones"><button class="borrar" data-fila="${m.filaExcel}" aria-label="Borrar ${escapar(m.concepto)}">✕</button></td>
      </tr>`;
    })
    .join('');

  $('#pInfoPag').textContent = `${ordenados.length} movimiento(s) · página ${estado.pagina} de ${paginas}`;
  $('#pPrev').disabled = estado.pagina <= 1;
  $('#pNext').disabled = estado.pagina >= paginas;

  $$('#tablaPersonal thead th[data-col]').forEach((th) => {
    th.setAttribute('aria-sort', th.dataset.col === col ? (dir === 'asc' ? 'ascending' : 'descending') : 'none');
  });
}

// ── Orquestación ──────────────────────────────────────────────────────────────
export function pintar() {
  if (!$('#pAnio').options.length) poblarFiltros();

  const f = leerFiltros();
  const movs = aplicar(datos.personal, f);
  const delPeriodo = aplicar(datos.personal, f, { ignorarTipo: true });
  const delAnio = aplicar(datos.personal, f, { ignorarTipo: true, ignorarMes: true });

  if (!datos.personal.length) {
    $('#pVacio').classList.remove('oculto');
    $('#pContenido').classList.add('oculto');
    return;
  }
  $('#pVacio').classList.add('oculto');
  $('#pContenido').classList.remove('oculto');

  pintarKpis(movs, delAnio, f);
  pintarPresupuestos(f);
  pintarGraficos(delAnio, delPeriodo, f);
  pintarTabla(movs);

  $('#pAvisoFiltro').classList.toggle('visible', !!estado.filtroCategoria);
  if (estado.filtroCategoria) $('#pAvisoTexto').textContent = `Filtrando por categoría: ${estado.filtroCategoria}`;
}

function poblarFiltros() {
  const anios = [...new Set(datos.personal.map((m) => m.anio))].sort((a, b) => b - a);
  const actual = new Date().getFullYear();
  if (!anios.includes(actual)) anios.unshift(actual);
  $('#pAnio').innerHTML = anios.map((a) => `<option value="${a}">${a}</option>`).join('');
  $('#pAnio').value = String(actual);

  $('#pMes').innerHTML = ['<option value="">Todo el año</option>', ...MESES_LARGO.map((m, i) => `<option value="${i}">${m[0].toUpperCase() + m.slice(1)}</option>`)].join('');
  $('#pMes').value = String(new Date().getMonth());

  const cats = [...new Set(datos.personal.map((m) => m.categoria))].sort((a, b) => a.localeCompare(b, 'es'));
  $('#pCat').innerHTML = ['<option value="">Todas</option>', ...cats.map((c) => `<option>${escapar(c)}</option>`)].join('');
}

async function borrarFila(boton) {
  const filaExcel = Number(boton.dataset.fila);
  const mov = datos.personal.find((m) => m.filaExcel === filaExcel);
  if (!mov) return;

  const resumen = `${fmtFecha.format(mov.fecha)} · ${mov.concepto} · ${euroDec(mov.base)}`;
  if (!confirm(`¿Borrar este gasto personal del Excel?\n\n${resumen}\n\nQueda una copia en datos/Finanzas.respaldo.xlsx.`)) return;

  boton.disabled = true;
  try {
    await api.borrar('/api/movimientos', { ambito: 'personal', fila: filaExcel, concepto: mov.concepto, base: mov.base });
    await cargarDatos();
    brindis('Movimiento borrado del Excel');
  } catch (e) {
    boton.disabled = false;
    brindis(e.message);
  }
}

export function conectar() {
  ['pAnio', 'pMes', 'pTipo', 'pCat'].forEach((id) =>
    $('#' + id).addEventListener('change', () => {
      estado.pagina = 1;
      pintar();
    })
  );

  let reloj;
  $('#pBuscar').addEventListener('input', () => {
    clearTimeout(reloj);
    reloj = setTimeout(() => {
      estado.pagina = 1;
      pintar();
    }, 180);
  });

  $('#pLimpiar').addEventListener('click', () => {
    estado.filtroCategoria = null;
    pintar();
  });
  $('#pPrev').addEventListener('click', () => {
    estado.pagina--;
    pintar();
  });
  $('#pNext').addEventListener('click', () => {
    estado.pagina++;
    pintar();
  });

  $$('#tablaPersonal thead th[data-col]').forEach((th) => {
    const ordenar = () => {
      const col = th.dataset.col;
      estado.orden = { col, dir: estado.orden.col === col && estado.orden.dir === 'desc' ? 'asc' : 'desc' };
      pintar();
    };
    th.addEventListener('click', ordenar);
    th.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        ordenar();
      }
    });
  });

  $('#pTbody').addEventListener('click', (e) => {
    const boton = e.target.closest('.borrar');
    if (boton) borrarFila(boton);
  });

  $('#pEditarTopes').addEventListener('click', abrirEditorTopes);
  $('#formTopes').addEventListener('submit', guardarTopes);
  $('#btnCerrarTopes').addEventListener('click', () => $('#dlgTopes').close());
  $('#btnCancelarTopes').addEventListener('click', () => $('#dlgTopes').close());

  cargarPresupuestos();
}
