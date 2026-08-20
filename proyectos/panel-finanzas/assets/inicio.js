/* Sección Inicio: cómo va todo hoy, sin tocar un filtro. */

import {
  $, MESES, MESES_LARGO, baseOpciones, conAlfa, datos, diasHasta, dibujar, escapar, euro, euroDec, pct, suma, tema,
} from './comun.js';

const MESES_VISTA = 6;

const delMes = (lista, anio, mes) => lista.filter((m) => m.anio === anio && m.mes === mes);

export function pintar() {
  const ahora = new Date();
  const anio = ahora.getFullYear();
  const mes = ahora.getMonth();

  $('#iSaludo').textContent = `${MESES_LARGO[mes][0].toUpperCase()}${MESES_LARGO[mes].slice(1)} de ${anio}`;
  $('#iFecha').textContent = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(ahora);

  // ── KPIs ────────────────────────────────────────────────────────────────────
  const negMes = delMes(datos.negocio, anio, mes);
  const netoNegocio = suma(negMes.filter((m) => m.tipo === 'Ingreso')) - suma(negMes.filter((m) => m.tipo === 'Gasto'));

  const perMes = delMes(datos.personal, anio, mes);
  const gastoPersonal = suma(perMes.filter((m) => m.tipo === 'Gasto'));
  const ingresoPersonal = suma(perMes.filter((m) => m.tipo === 'Ingreso'));
  const tasa = ingresoPersonal ? (ingresoPersonal - gastoPersonal) / ingresoPersonal : null;

  const activos = datos.objetivos.filter((o) => o.estado === 'Activo');
  const avanceMedio = activos.length ? activos.reduce((a, o) => a + o.avance, 0) / activos.length : 0;

  const fijos = datos.personal.filter((m) => m.tipo === 'Gasto' && m.recurrente && m.anio === anio && m.mes === mes);
  const totalFijo = suma(fijos);

  const tarjetas = [
    { etq: 'Neto del negocio', valor: euro(netoNegocio), cls: netoNegocio >= 0 ? 'pos' : 'neg', pie: 'este mes' },
    { etq: 'Gasto personal', valor: euro(gastoPersonal), cls: 'neg', pie: `${perMes.filter((m) => m.tipo === 'Gasto').length} movimiento(s) este mes` },
    { etq: 'Tasa de ahorro', valor: tasa === null ? '—' : pct(tasa), cls: tasa === null ? '' : tasa >= 0.2 ? 'pos' : tasa >= 0 ? '' : 'neg', pie: tasa === null ? 'sin ingresos personales' : 'de lo que entra en casa' },
    { etq: 'Objetivos en marcha', valor: String(activos.length), cls: '', pie: activos.length ? `avance medio ${pct(avanceMedio)}` : 'ninguno activo' },
  ];

  $('#iKpis').innerHTML = tarjetas
    .map((t) => `<article class="kpi"><div class="kpi-etq">${t.etq}</div><div class="kpi-cifra ${t.cls}">${t.valor}</div><div class="kpi-delta">${t.pie}</div></article>`)
    .join('');

  // ── Negocio vs casa, últimos meses ──────────────────────────────────────────
  const t = tema();
  const etiquetas = [];
  const serieNegocio = [];
  const seriePersonal = [];
  for (let i = MESES_VISTA - 1; i >= 0; i--) {
    const d = new Date(anio, mes - i, 1);
    etiquetas.push(`${MESES[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`);
    const n = delMes(datos.negocio, d.getFullYear(), d.getMonth());
    serieNegocio.push(suma(n.filter((m) => m.tipo === 'Ingreso')) - suma(n.filter((m) => m.tipo === 'Gasto')));
    seriePersonal.push(suma(delMes(datos.personal, d.getFullYear(), d.getMonth()).filter((m) => m.tipo === 'Gasto')));
  }

  dibujar('gInicio', {
    type: 'bar',
    data: {
      labels: etiquetas,
      datasets: [
        { label: 'Neto del negocio', data: serieNegocio, backgroundColor: t.pos, borderRadius: 3, maxBarThickness: 30 },
        { label: 'Gasto personal', data: seriePersonal, backgroundColor: t.neg, borderRadius: 3, maxBarThickness: 30 },
        { label: 'Diferencia', type: 'line', data: serieNegocio.map((v, i) => v - seriePersonal[i]), borderColor: t.acento, backgroundColor: conAlfa(t.acento, 0.12), borderWidth: 2, tension: 0.3, pointRadius: 3, fill: true },
      ],
    },
    options: {
      ...baseOpciones(t),
      plugins: { ...baseOpciones(t).plugins, legend: { display: true, position: 'bottom', labels: { color: t.muted, boxWidth: 10, boxHeight: 10, font: { size: 11 } } } },
    },
  });

  const ultimaDif = serieNegocio[serieNegocio.length - 1] - seriePersonal[seriePersonal.length - 1];
  $('#iNotaGrafico').innerHTML =
    ultimaDif >= 0
      ? `Este mes ganas terreno: <b class="pos">${euro(ultimaDif)}</b>`
      : `Este mes pierdes terreno: <b class="neg">${euro(ultimaDif)}</b>`;

  // ── Objetivos activos ───────────────────────────────────────────────────────
  const urgentes = [...activos].sort((a, b) => {
    if (!a.limite && !b.limite) return b.avance - a.avance;
    if (!a.limite) return 1;
    if (!b.limite) return -1;
    return a.limite - b.limite;
  });

  $('#iObjetivos').innerHTML = urgentes.length
    ? urgentes
        .slice(0, 5)
        .map((o) => {
          const dias = diasHasta(o.limite);
          const cuando = dias === null ? 'sin fecha' : dias < 0 ? 'fecha pasada' : dias === 0 ? 'vence hoy' : `quedan ${dias} día${dias === 1 ? '' : 's'}`;
          return `<li>
            <div class="mini-cab"><span>${escapar(o.nombre)}</span><span class="num">${pct(o.avance)}</span></div>
            <div class="barra"><span class="barra-relleno acento" style="width:${(o.avance * 100).toFixed(1)}%"></span></div>
            <div class="mini-pie"><span>${escapar(o.plazo)} · ${escapar(o.area)}</span><span>${cuando}</span></div>
          </li>`;
        })
        .join('')
    : '<li class="nada">Todavía no has puesto ningún objetivo.</li>';

  // ── Gastos fijos del mes ────────────────────────────────────────────────────
  $('#iFijos').innerHTML = fijos.length
    ? fijos
        .sort((a, b) => b.base - a.base)
        .map((m) => `<li><div class="mini-cab"><span>${escapar(m.concepto)}</span><span class="num">${euroDec(m.base)}</span></div><div class="mini-pie"><span>${escapar(m.categoria)}</span><span>${euro(m.base * 12)}/año</span></div></li>`)
        .join('')
    : '<li class="nada">Nada marcado como recurrente este mes.</li>';
  $('#iNotaFijos').textContent = fijos.length ? `${euro(totalFijo)} al mes · ${euro(totalFijo * 12)} al año` : '';
}
