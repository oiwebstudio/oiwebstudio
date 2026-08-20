/* Sección Calendario: el mes de un vistazo, con lo que entra, lo que sale
   y los objetivos que vencen. Clic en un día para ver el detalle o apuntar ahí. */

import {
  $, $$, MESES_LARGO, api, brindis, cargarDatos, datos, escapar, euro, euroDec, fmtFecha, suma,
} from './comun.js';

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const hoyLocal = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

const estado = {
  anio: new Date().getFullYear(),
  mes: new Date().getMonth(),
  capas: { negocio: true, personal: true, objetivos: true },
  diaAbierto: null, // clave 'aaaa-mm-dd'
};

const clave = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Todo lo que pasa cada día del mes, ya mezclado y listo para pintar. */
function agenda() {
  const mapa = new Map();
  const meter = (fecha, item) => {
    const k = clave(fecha);
    if (!mapa.has(k)) mapa.set(k, []);
    mapa.get(k).push(item);
  };

  if (estado.capas.negocio) {
    datos.negocio
      .filter((m) => m.anio === estado.anio && m.mes === estado.mes)
      .forEach((m) => meter(m.fecha, { clase: 'negocio', tipo: m.tipo, texto: m.concepto, importe: m.base, mov: m, ambito: 'negocio' }));
  }
  if (estado.capas.personal) {
    datos.personal
      .filter((m) => m.anio === estado.anio && m.mes === estado.mes)
      .forEach((m) => meter(m.fecha, { clase: 'personal', tipo: m.tipo, texto: m.concepto, importe: m.base, mov: m, ambito: 'personal' }));
  }
  if (estado.capas.objetivos) {
    datos.objetivos
      .filter((o) => o.limite && o.limite.getFullYear() === estado.anio && o.limite.getMonth() === estado.mes && o.estado === 'Activo')
      .forEach((o) => meter(o.limite, { clase: 'objetivo', texto: o.nombre, objetivo: o }));
  }
  return mapa;
}

export function pintar() {
  const mapa = agenda();
  const hoy = hoyLocal();
  const claveHoy = clave(hoy);

  $('#cTitulo').textContent = `${MESES_LARGO[estado.mes][0].toUpperCase()}${MESES_LARGO[estado.mes].slice(1)} ${estado.anio}`;

  // Rejilla que empieza en lunes y cubre semanas completas.
  const primero = new Date(estado.anio, estado.mes, 1);
  const desplazamiento = (primero.getDay() + 6) % 7;
  const inicio = new Date(estado.anio, estado.mes, 1 - desplazamiento);
  const diasDelMes = new Date(estado.anio, estado.mes + 1, 0).getDate();
  const celdas = Math.ceil((desplazamiento + diasDelMes) / 7) * 7;

  $('#cDias').innerHTML = DIAS.map((d) => `<div class="cal-dia-cab">${d}</div>`).join('');

  let html = '';
  for (let i = 0; i < celdas; i++) {
    const d = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + i);
    const k = clave(d);
    const fuera = d.getMonth() !== estado.mes;
    const items = mapa.get(k) || [];

    const gastos = items.filter((x) => x.mov && x.tipo === 'Gasto');
    const ingresos = items.filter((x) => x.mov && x.tipo === 'Ingreso');
    const metas = items.filter((x) => x.objetivo);

    const pastillas = items
      .slice(0, 3)
      .map((x) =>
        x.objetivo
          ? `<span class="cal-pastilla objetivo">◆ ${escapar(x.texto)}</span>`
          : `<span class="cal-pastilla ${x.clase} ${x.tipo === 'Ingreso' ? 'entra' : 'sale'}">${x.tipo === 'Ingreso' ? '+' : '−'}${euro(x.importe)} ${escapar(x.texto)}</span>`
      )
      .join('');

    html += `<button class="cal-celda ${fuera ? 'fuera' : ''} ${k === claveHoy ? 'hoy' : ''} ${estado.diaAbierto === k ? 'abierta' : ''}"
      data-fecha="${k}" ${items.length ? '' : 'data-vacio="1"'}>
      <span class="cal-numero">${d.getDate()}</span>
      ${ingresos.length || gastos.length ? `<span class="cal-neto ${suma(ingresos, 'importe') - suma(gastos, 'importe') >= 0 ? 'pos' : 'neg'}">${euro(suma(ingresos, 'importe') - suma(gastos, 'importe'))}</span>` : ''}
      <span class="cal-pastillas">${pastillas}</span>
      ${items.length > 3 ? `<span class="cal-mas">+${items.length - 3} más</span>` : ''}
      ${metas.length ? `<span class="cal-marca-objetivo" title="${metas.length} objetivo(s) vencen"></span>` : ''}
    </button>`;
  }
  $('#cRejilla').innerHTML = html;

  // Totales del mes
  const negMes = datos.negocio.filter((m) => m.anio === estado.anio && m.mes === estado.mes);
  const perMes = datos.personal.filter((m) => m.anio === estado.anio && m.mes === estado.mes);
  const ingresos = suma(negMes.filter((m) => m.tipo === 'Ingreso')) + suma(perMes.filter((m) => m.tipo === 'Ingreso'));
  const gastos = suma(negMes.filter((m) => m.tipo === 'Gasto')) + suma(perMes.filter((m) => m.tipo === 'Gasto'));
  $('#cTotales').innerHTML =
    `<span><i class="punto entra"></i>Entra <b>${euro(ingresos)}</b></span>` +
    `<span><i class="punto sale"></i>Sale <b>${euro(gastos)}</b></span>` +
    `<span>Saldo <b class="${ingresos - gastos >= 0 ? 'pos' : 'neg'}">${euro(ingresos - gastos)}</b></span>`;

  pintarDetalle(mapa);
}

function pintarDetalle(mapa = agenda()) {
  const panel = $('#cDetalle');
  if (!estado.diaAbierto) {
    panel.classList.add('oculto');
    return;
  }
  panel.classList.remove('oculto');

  const [a, m, d] = estado.diaAbierto.split('-').map(Number);
  const fecha = new Date(a, m - 1, d);
  const items = mapa.get(estado.diaAbierto) || [];

  $('#cDetalleTitulo').textContent = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(fecha);

  $('#cDetalleLista').innerHTML = items.length
    ? items
        .map((x) =>
          x.objetivo
            ? `<li class="cal-item"><span class="cal-item-txt"><b>◆ ${escapar(x.texto)}</b><br><span class="nota">Vence este objetivo · ${escapar(x.objetivo.area)}</span></span></li>`
            : `<li class="cal-item">
                <span class="cal-item-txt"><b>${escapar(x.texto)}</b><br><span class="nota">${escapar(x.mov.categoria)} · ${x.ambito === 'negocio' ? 'negocio' : 'casa'}</span></span>
                <span class="num ${x.tipo === 'Ingreso' ? 'pos' : 'neg'}">${x.tipo === 'Ingreso' ? '' : '−'}${euroDec(x.importe)}</span>
                <button class="borrar" data-ambito="${x.ambito}" data-fila="${x.mov.filaExcel}" aria-label="Borrar ${escapar(x.texto)}">✕</button>
              </li>`
        )
        .join('')
    : '<li class="nada">Nada apuntado este día.</li>';
}

/** El botón de apuntar del calendario abre el diálogo con la fecha del día elegido. */
export const fechaElegida = () => estado.diaAbierto;

async function borrarItem(boton) {
  const ambito = boton.dataset.ambito;
  const fila = Number(boton.dataset.fila);
  const lista = ambito === 'negocio' ? datos.negocio : datos.personal;
  const mov = lista.find((m) => m.filaExcel === fila);
  if (!mov) return;

  if (!confirm(`¿Borrar del Excel?\n\n${fmtFecha.format(mov.fecha)} · ${mov.concepto} · ${euroDec(mov.base)}\n\nQueda una copia en datos/Finanzas.respaldo.xlsx.`)) return;

  boton.disabled = true;
  try {
    await api.borrar('/api/movimientos', { ambito, fila, concepto: mov.concepto, base: mov.base });
    await cargarDatos();
    brindis('Movimiento borrado del Excel');
  } catch (e) {
    boton.disabled = false;
    brindis(e.message);
  }
}

export function conectar(abrirAlta) {
  $('#cAnterior').addEventListener('click', () => {
    estado.mes--;
    if (estado.mes < 0) {
      estado.mes = 11;
      estado.anio--;
    }
    estado.diaAbierto = null;
    pintar();
  });

  $('#cSiguiente').addEventListener('click', () => {
    estado.mes++;
    if (estado.mes > 11) {
      estado.mes = 0;
      estado.anio++;
    }
    estado.diaAbierto = null;
    pintar();
  });

  $('#cHoy').addEventListener('click', () => {
    const d = new Date();
    estado.anio = d.getFullYear();
    estado.mes = d.getMonth();
    estado.diaAbierto = clave(hoyLocal());
    pintar();
  });

  $$('#cCapas input').forEach((chk) =>
    chk.addEventListener('change', () => {
      estado.capas[chk.value] = chk.checked;
      pintar();
    })
  );

  $('#cRejilla').addEventListener('click', (e) => {
    const celda = e.target.closest('.cal-celda');
    if (!celda) return;
    estado.diaAbierto = estado.diaAbierto === celda.dataset.fecha ? null : celda.dataset.fecha;
    pintar();
  });

  $('#cCerrarDetalle').addEventListener('click', () => {
    estado.diaAbierto = null;
    pintar();
  });

  $('#cDetalleLista').addEventListener('click', (e) => {
    const boton = e.target.closest('.borrar');
    if (boton) borrarItem(boton);
  });

  $('#cApuntarDia').addEventListener('click', () => abrirAlta('personal', estado.diaAbierto));
}
