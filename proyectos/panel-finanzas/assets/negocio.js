/* Sección Negocio: lo que factura y gasta el estudio. Base imponible e IVA. */

import {
  $, $$, MESES, agrupar, api, baseOpciones, brindis, cargarDatos, conAlfa, datos, dibujar,
  escapar, euro, euroDec, fmtFecha, normalizar, opcionesHorizontal, paleta, pct, porMes, suma, tema,
} from './comun.js';

const POR_PAGINA = 25;

const estado = {
  orden: { col: 'fecha', dir: 'desc' },
  pagina: 1,
  filtroGrafico: null,
};

// ── Filtros ───────────────────────────────────────────────────────────────────
function leerFiltros() {
  return {
    anio: $('#nAnio').value,
    trim: $('#nTrim').value,
    tipo: $('#nTipo').value,
    cat: $('#nCat').value,
    estado: $('#nEstado').value,
    buscar: normalizar($('#nBuscar').value),
  };
}

function aplicar(movs, f, { ignorarTipo = false } = {}) {
  return movs.filter((m) => {
    if (f.anio && String(m.anio) !== f.anio) return false;
    if (f.trim && m.trim !== f.trim) return false;
    if (!ignorarTipo && f.tipo && m.tipo !== f.tipo) return false;
    if (f.cat && m.categoria !== f.cat) return false;
    if (f.estado && m.estado !== f.estado) return false;
    if (estado.filtroGrafico && m.categoria !== estado.filtroGrafico) return false;
    if (f.buscar) {
      const heno = normalizar(`${m.concepto} ${m.quien} ${m.categoria} ${m.metodo}`);
      if (!heno.includes(f.buscar)) return false;
    }
    return true;
  });
}

// Mismo filtro, periodo anterior: sirve para las variaciones de los KPIs.
function periodoAnterior(f) {
  const anterior = { ...f };
  if (f.trim) {
    const t = Number(f.trim[1]);
    if (t === 1) {
      anterior.trim = 'T4';
      anterior.anio = String(Number(f.anio) - 1);
    } else {
      anterior.trim = 'T' + (t - 1);
    }
  } else if (f.anio) {
    anterior.anio = String(Number(f.anio) - 1);
  } else {
    return null;
  }
  return anterior;
}

// ── KPIs ──────────────────────────────────────────────────────────────────────
function pintarKpis(movs, movsAnt) {
  const ing = suma(movs.filter((m) => m.tipo === 'Ingreso'));
  const gas = suma(movs.filter((m) => m.tipo === 'Gasto'));
  const neto = ing - gas;
  const margen = ing ? neto / ing : 0;
  const sinCobrar = movs.filter((m) => m.tipo === 'Ingreso' && normalizar(m.estado) === 'pendiente');
  const pendiente = suma(sinCobrar, 'total');
  const ivaRep = suma(movs.filter((m) => m.tipo === 'Ingreso'), 'ivaEur');
  const ivaSop = suma(movs.filter((m) => m.tipo === 'Gasto' && m.deducible), 'ivaEur');

  let ant = null;
  if (movsAnt) {
    const iA = suma(movsAnt.filter((m) => m.tipo === 'Ingreso'));
    const gA = suma(movsAnt.filter((m) => m.tipo === 'Gasto'));
    ant = { ing: iA, gas: gA, neto: iA - gA, margen: iA ? (iA - gA) / iA : 0 };
  }

  const delta = (actual, previo) => {
    if (!ant || previo === undefined) return '';
    if (!previo) return 'sin referencia previa';
    const v = (actual - previo) / Math.abs(previo);
    return `<b class="${v >= 0 ? 'pos' : 'neg'}">${v >= 0 ? '+' : ''}${pct(v)}</b> vs periodo anterior`;
  };

  const tarjetas = [
    { etq: 'Ingresos', valor: euro(ing), cls: 'pos', pie: delta(ing, ant?.ing) },
    { etq: 'Gastos', valor: euro(gas), cls: 'neg', pie: delta(gas, ant?.gas) },
    { etq: 'Beneficio neto', valor: euro(neto), cls: neto >= 0 ? 'pos' : 'neg', pie: delta(neto, ant?.neto) },
    { etq: 'Margen neto', valor: pct(margen), cls: margen >= 0 ? '' : 'neg', pie: ant ? `antes ${pct(ant.margen)}` : '' },
    { etq: 'Pendiente de cobro', valor: euro(pendiente), cls: pendiente > 0 ? 'aviso' : '', pie: `${sinCobrar.length} factura(s) sin cobrar` },
    { etq: 'IVA a liquidar', valor: euro(ivaRep - ivaSop), cls: ivaRep - ivaSop > 0 ? 'neg' : 'pos', pie: `${euro(ivaRep)} repercutido · ${euro(ivaSop)} soportado` },
  ];

  $('#nKpis').innerHTML = tarjetas
    .map((t) => `<article class="kpi"><div class="kpi-etq">${t.etq}</div><div class="kpi-cifra ${t.cls}">${t.valor}</div><div class="kpi-delta">${t.pie || '&nbsp;'}</div></article>`)
    .join('');
}

// ── Gráficos ──────────────────────────────────────────────────────────────────
function pintarGraficos(movs, delPeriodo) {
  const t = tema();
  const ing = porMes(movs, (m) => m.tipo === 'Ingreso');
  const gas = porMes(movs, (m) => m.tipo === 'Gasto');

  dibujar('gNegMensual', {
    type: 'bar',
    data: {
      labels: MESES,
      datasets: [
        { label: 'Ingresos', data: ing, backgroundColor: t.pos, borderRadius: 3, maxBarThickness: 22 },
        { label: 'Gastos', data: gas, backgroundColor: t.neg, borderRadius: 3, maxBarThickness: 22 },
      ],
    },
    options: {
      ...baseOpciones(t),
      plugins: { ...baseOpciones(t).plugins, legend: { display: true, position: 'bottom', labels: { color: t.muted, boxWidth: 10, boxHeight: 10, font: { size: 11 } } } },
    },
  });

  let acc = 0;
  const acumulado = ing.map((v, i) => (acc += v - gas[i]));
  dibujar('gNegAcumulado', {
    type: 'line',
    data: {
      labels: MESES,
      datasets: [{ label: 'Neto acumulado', data: acumulado, borderColor: t.acento, backgroundColor: conAlfa(t.acento, 0.16), fill: true, tension: 0.32, borderWidth: 2, pointRadius: 0, pointHoverRadius: 4 }],
    },
    options: baseOpciones(t),
  });
  $('#nNotaAcum').textContent = euro(acumulado[acumulado.length - 1]);

  const cats = agrupar(delPeriodo.filter((m) => m.tipo === 'Gasto'), 'categoria').slice(0, 8);
  dibujar('gNegCategorias', {
    type: 'bar',
    data: { labels: cats.map((c) => c[0]), datasets: [{ label: 'Gasto', data: cats.map((c) => c[1]), backgroundColor: t.neg, borderRadius: 3, maxBarThickness: 16 }] },
    options: {
      ...opcionesHorizontal(t),
      onClick: (_e, elementos) => {
        const entrada = elementos.length && cats[elementos[0].index];
        if (!entrada) return;
        estado.filtroGrafico = estado.filtroGrafico === entrada[0] ? null : entrada[0];
        estado.pagina = 1;
        pintar();
      },
    },
  });

  const clientes = agrupar(delPeriodo.filter((m) => m.tipo === 'Ingreso' && m.quien), 'quien').slice(0, 8);
  dibujar('gNegClientes', {
    type: 'bar',
    data: { labels: clientes.map((c) => c[0]), datasets: [{ label: 'Facturado', data: clientes.map((c) => c[1]), backgroundColor: t.acento, borderRadius: 3, maxBarThickness: 16 }] },
    options: opcionesHorizontal(t),
  });

  const trims = ['T1', 'T2', 'T3', 'T4'];
  const rep = trims.map((tr) => suma(delPeriodo.filter((m) => m.trim === tr && m.tipo === 'Ingreso'), 'ivaEur'));
  const sop = trims.map((tr) => suma(delPeriodo.filter((m) => m.trim === tr && m.tipo === 'Gasto' && m.deducible), 'ivaEur'));
  dibujar('gNegIva', {
    type: 'bar',
    data: {
      labels: trims,
      datasets: [
        { label: 'Repercutido', data: rep, backgroundColor: t.pos, borderRadius: 3, maxBarThickness: 26 },
        { label: 'Soportado', data: sop, backgroundColor: t.muted, borderRadius: 3, maxBarThickness: 26 },
        { label: 'A liquidar', data: rep.map((v, i) => v - sop[i]), backgroundColor: t.alerta, borderRadius: 3, maxBarThickness: 26 },
      ],
    },
    options: {
      ...baseOpciones(t),
      plugins: { ...baseOpciones(t).plugins, legend: { display: true, position: 'bottom', labels: { color: t.muted, boxWidth: 10, boxHeight: 10, font: { size: 11 } } } },
    },
  });
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

  $('#nTbody').innerHTML = ordenados
    .slice(desde, desde + POR_PAGINA)
    .map((m) => {
      const esIng = m.tipo === 'Ingreso';
      const pendiente = normalizar(m.estado) === 'pendiente';
      return `<tr>
        <td class="num">${fmtFecha.format(m.fecha)}</td>
        <td><span class="chip ${esIng ? 'ingreso' : 'gasto'}">${m.tipo}</span></td>
        <td class="ancho">${escapar(m.concepto)}</td>
        <td>${escapar(m.categoria)}</td>
        <td>${escapar(m.quien)}</td>
        <td class="num ${esIng ? 'pos' : 'neg'}">${esIng ? '' : '−'}${euroDec(m.base)}</td>
        <td class="num">${euroDec(m.ivaEur)}</td>
        <td class="num">${euroDec(m.total)}</td>
        <td>${escapar(m.metodo)}</td>
        <td><span class="chip ${pendiente ? 'pendiente' : ''}">${escapar(m.estado)}</span></td>
        <td class="acciones"><button class="borrar" data-fila="${m.filaExcel}" aria-label="Borrar ${escapar(m.concepto)}">✕</button></td>
      </tr>`;
    })
    .join('');

  $('#nInfoPag').textContent = `${ordenados.length} movimiento(s) · página ${estado.pagina} de ${paginas}`;
  $('#nPrev').disabled = estado.pagina <= 1;
  $('#nNext').disabled = estado.pagina >= paginas;
  $('#nNotaTabla').textContent = `${ordenados.length} de ${datos.negocio.length}`;

  $$('#tablaNegocio thead th[data-col]').forEach((th) => {
    th.setAttribute('aria-sort', th.dataset.col === col ? (dir === 'asc' ? 'ascending' : 'descending') : 'none');
  });
}

// ── Orquestación ──────────────────────────────────────────────────────────────
export function pintar() {
  if (!$('#nAnio').options.length) poblarFiltros();

  const f = leerFiltros();
  const movs = aplicar(datos.negocio, f);
  // Los repartos ignoran el filtro de Tipo: si no, media pantalla queda vacía.
  const delPeriodo = aplicar(datos.negocio, f, { ignorarTipo: true });
  const fAnt = periodoAnterior(f);

  pintarKpis(movs, fAnt ? aplicar(datos.negocio, fAnt) : null);
  pintarGraficos(movs, delPeriodo);
  pintarTabla(movs);

  $('#nAvisoFiltro').classList.toggle('visible', !!estado.filtroGrafico);
  if (estado.filtroGrafico) $('#nAvisoTexto').textContent = `Filtrando por categoría: ${estado.filtroGrafico}`;
}

function poblarFiltros() {
  const anios = [...new Set(datos.negocio.map((m) => m.anio))].sort((a, b) => b - a);
  $('#nAnio').innerHTML = ['<option value="">Todos los años</option>', ...anios.map((a) => `<option value="${a}">${a}</option>`)].join('');
  const actual = new Date().getFullYear();
  $('#nAnio').value = anios.includes(actual) ? String(actual) : String(anios[0] ?? '');

  const cats = [...new Set(datos.negocio.map((m) => m.categoria))].sort((a, b) => a.localeCompare(b, 'es'));
  $('#nCat').innerHTML = ['<option value="">Todas</option>', ...cats.map((c) => `<option>${escapar(c)}</option>`)].join('');

  const estados = [...new Set(datos.negocio.map((m) => m.estado).filter(Boolean))].sort();
  $('#nEstado').innerHTML = ['<option value="">Todos</option>', ...estados.map((e) => `<option>${escapar(e)}</option>`)].join('');
}

async function borrarFila(boton) {
  const filaExcel = Number(boton.dataset.fila);
  const mov = datos.negocio.find((m) => m.filaExcel === filaExcel);
  if (!mov) return;

  const resumen = `${fmtFecha.format(mov.fecha)} · ${mov.concepto} · ${euroDec(mov.base)}`;
  if (!confirm(`¿Borrar este movimiento del Excel?\n\n${resumen}\n\nQueda una copia en datos/Finanzas.respaldo.xlsx.`)) return;

  boton.disabled = true;
  try {
    await api.borrar('/api/movimientos', { ambito: 'negocio', fila: filaExcel, concepto: mov.concepto, base: mov.base });
    await cargarDatos();
    brindis('Movimiento borrado del Excel');
  } catch (e) {
    boton.disabled = false;
    brindis(e.message);
  }
}

export function conectar() {
  ['nAnio', 'nTrim', 'nTipo', 'nCat', 'nEstado'].forEach((id) =>
    $('#' + id).addEventListener('change', () => {
      estado.pagina = 1;
      pintar();
    })
  );

  let reloj;
  $('#nBuscar').addEventListener('input', () => {
    clearTimeout(reloj);
    reloj = setTimeout(() => {
      estado.pagina = 1;
      pintar();
    }, 180);
  });

  $('#nLimpiar').addEventListener('click', () => {
    estado.filtroGrafico = null;
    pintar();
  });
  $('#nPrev').addEventListener('click', () => {
    estado.pagina--;
    pintar();
  });
  $('#nNext').addEventListener('click', () => {
    estado.pagina++;
    pintar();
  });

  $$('#tablaNegocio thead th[data-col]').forEach((th) => {
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

  // Delegación: la tabla se repinta entera en cada refresco.
  $('#nTbody').addEventListener('click', (e) => {
    const boton = e.target.closest('.borrar');
    if (boton) borrarFila(boton);
  });
}
