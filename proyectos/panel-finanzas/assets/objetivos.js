/* Sección Objetivos: metas con progreso, ritmo necesario y fecha límite.
   Tres tipos: Importe (€), Cantidad (unidades) e Hito (hecho / no hecho). */

import { $, $$, api, brindis, cargarDatos, datos, diaCero, diasHasta, escapar, euro, euroDec, fmtFecha, numero, pct } from './comun.js';

const DIA = 86400000;

const estado = { filtroEstado: 'Activo', filtroArea: '', filtroPlazo: '' };

// De más corto a más largo: es el orden en que hay que mirarlos.
const PLAZOS = [
  { clave: 'Día', titulo: 'Hoy', pie: 'lo que se decide en las próximas horas' },
  { clave: 'Semana', titulo: 'Esta semana', pie: 'hasta el domingo' },
  { clave: 'Mes', titulo: 'Este mes', pie: 'hasta fin de mes' },
  { clave: 'Año', titulo: 'Este año', pie: 'hasta el 31 de diciembre' },
  { clave: 'Largo plazo', titulo: 'Largo plazo', pie: 'sin prisa, pero sin pausa' },
];

const esImporte = (o) => o.tipo === 'Importe';
const valor = (o, n) => (esImporte(o) ? euroDec(n) : `${numero(n)} ${o.unidad}`.trim());

const diasRestantes = (o) => diasHasta(o.limite);

/**
 * Ritmo: cuánto falta repartido entre lo que queda, y si vas por delante o por
 * detrás del calendario. Sin fecha límite no hay ritmo que calcular.
 */
function ritmo(o) {
  const dias = diasRestantes(o);
  const falta = Math.max(0, o.meta - o.progreso);

  if (o.estado === 'Conseguido' || falta === 0) return { texto: 'Conseguido', clase: 'pos' };

  // Un hito está hecho o no lo está: no hay ritmo que repartir.
  if (o.tipo === 'Hito') {
    if (dias === null) return { texto: 'Pendiente', clase: '' };
    if (dias < 0) return { texto: 'Pendiente · fecha pasada', clase: 'neg' };
    if (dias === 0) return { texto: 'Pendiente · vence hoy', clase: 'neg' };
    return { texto: `Pendiente · quedan ${dias} día${dias === 1 ? '' : 's'}`, clase: dias <= 7 ? 'aviso' : '' };
  }

  if (dias === null) return { texto: `Faltan ${valor(o, falta)}`, clase: '' };
  if (dias < 0) return { texto: `Fecha pasada · faltan ${valor(o, falta)}`, clase: 'neg' };
  if (dias === 0) return { texto: `Vence hoy · faltan ${valor(o, falta)}`, clase: 'neg' };

  // Por debajo de una semana el ritmo semanal no dice nada útil: mejor por día.
  const ritmoTexto =
    dias >= 7
      ? `${valor(o, (falta / dias) * 7)}/semana durante ${dias} días`
      : `${valor(o, falta / dias)}/día durante ${dias} día${dias === 1 ? '' : 's'}`;

  // Semáforo: comparo el avance real con el que tocaría a estas alturas.
  if (!o.inicio) return { texto: ritmoTexto, clase: '' };
  const total = (diaCero(o.limite) - diaCero(o.inicio)) / DIA;
  const transcurrido = (diaCero(new Date()) - diaCero(o.inicio)) / DIA;
  if (total <= 0) return { texto: ritmoTexto, clase: '' };

  const esperado = Math.min(1, Math.max(0, transcurrido / total));
  const diferencia = o.avance - esperado;
  const clase = diferencia >= 0.02 ? 'pos' : diferencia >= -0.08 ? 'aviso' : 'neg';
  const mote = diferencia >= 0.02 ? 'por delante' : diferencia >= -0.08 ? 'justo' : 'por detrás';
  return { texto: `${ritmoTexto} · ${mote}`, clase };
}

// Anillo de progreso en SVG: nada de librerías para un círculo.
function anillo(o, color) {
  const r = 30;
  const circunferencia = 2 * Math.PI * r;
  const ocupado = circunferencia * o.avance;
  return `<svg class="anillo" viewBox="0 0 72 72" aria-hidden="true">
    <circle cx="36" cy="36" r="${r}" class="anillo-fondo"></circle>
    <circle cx="36" cy="36" r="${r}" class="anillo-frente ${color}"
      stroke-dasharray="${ocupado.toFixed(1)} ${(circunferencia - ocupado).toFixed(1)}"></circle>
    <text x="36" y="40" class="anillo-texto">${Math.round(o.avance * 100)}%</text>
  </svg>`;
}

function tarjeta(o) {
  const r = ritmo(o);
  const dias = diasRestantes(o);
  const color = o.estado === 'Conseguido' ? 'pos' : r.clase || 'acento';
  const hito = o.tipo === 'Hito';

  return `<article class="objetivo ${o.estado === 'Conseguido' ? 'logrado' : ''}" data-fila="${o.filaExcel}">
    <div class="objetivo-cab">
      ${anillo(o, color)}
      <div class="objetivo-id">
        <h3>${escapar(o.nombre)}</h3>
        <div class="objetivo-meta">
          <span class="chip">${escapar(o.area)}</span>
          <span class="chip">${escapar(o.tipo)}</span>
          ${o.limite ? `<span class="chip ${dias !== null && dias < 0 ? 'pendiente' : ''}">${fmtFecha.format(o.limite)}</span>` : ''}
        </div>
      </div>
    </div>

    <div class="objetivo-cifras">
      <span class="num"><b>${valor(o, o.progreso)}</b> de ${valor(o, o.meta)}</span>
      <span class="objetivo-ritmo ${r.clase}">${escapar(r.texto)}</span>
    </div>

    <div class="barra"><span class="barra-relleno ${color}" style="width:${(o.avance * 100).toFixed(1)}%"></span></div>

    ${o.notas ? `<p class="objetivo-notas">${escapar(o.notas)}</p>` : ''}

    <div class="objetivo-acciones">
      ${
        o.estado === 'Conseguido'
          ? `<button data-accion="reabrir">Reabrir</button>`
          : hito
            ? `<button class="principal" data-accion="hecho">Marcar hecho</button>`
            : `<button class="principal" data-accion="sumar">+ Progreso</button>
               <button data-accion="hecho">Conseguido</button>`
      }
      <button data-accion="borrar" class="peligro">Borrar</button>
    </div>
  </article>`;
}

// Primero lo que corre más prisa: con fecha límite y más cerca.
const porUrgencia = (a, b) => {
  if (!a.limite && !b.limite) return b.avance - a.avance;
  if (!a.limite) return 1;
  if (!b.limite) return -1;
  return a.limite - b.limite;
};

export function pintar() {
  const lista = datos.objetivos.filter((o) => {
    if (estado.filtroEstado && o.estado !== estado.filtroEstado) return false;
    if (estado.filtroArea && o.area !== estado.filtroArea) return false;
    if (estado.filtroPlazo && o.plazo !== estado.filtroPlazo) return false;
    return true;
  });

  const activos = datos.objetivos.filter((o) => o.estado === 'Activo');
  const logrados = datos.objetivos.filter((o) => o.estado === 'Conseguido');
  $('#oResumen').innerHTML = datos.objetivos.length
    ? `<b>${activos.length}</b> en marcha · <b>${logrados.length}</b> conseguido(s) · avance medio <b>${pct(activos.length ? activos.reduce((a, o) => a + o.avance, 0) / activos.length : 0)}</b>`
    : '';

  // Pastillas de plazo con el recuento de lo que hay en cada uno.
  $('#oPlazos').innerHTML = [{ clave: '', titulo: 'Todos' }, ...PLAZOS]
    .map((p) => {
      const n = p.clave ? activos.filter((o) => o.plazo === p.clave).length : activos.length;
      return `<button class="pastilla ${estado.filtroPlazo === p.clave ? 'activa' : ''}" data-plazo="${p.clave}">
        ${p.titulo}${n ? ` <span class="cuenta">${n}</span>` : ''}
      </button>`;
    })
    .join('');

  const areas = [...new Set(datos.objetivos.map((o) => o.area))].sort();
  if ($('#oArea').options.length <= 1) {
    $('#oArea').innerHTML = ['<option value="">Todas las áreas</option>', ...areas.map((a) => `<option>${escapar(a)}</option>`)].join('');
    $('#oArea').value = estado.filtroArea;
  }

  $('#oVacio').classList.toggle('oculto', datos.objetivos.length > 0);

  if (!lista.length) {
    $('#oGrupos').innerHTML = datos.objetivos.length ? '<p class="nada">Nada aquí con estos filtros.</p>' : '';
    return;
  }

  // Agrupados por plazo, de lo más inmediato a lo más lejano.
  $('#oGrupos').innerHTML = PLAZOS.map((p) => {
    const suyos = lista.filter((o) => o.plazo === p.clave).sort(porUrgencia);
    if (!suyos.length) return '';
    return `<section class="grupo-plazo">
      <header class="grupo-cab">
        <h3>${p.titulo}</h3>
        <span class="nota">${suyos.length} · ${p.pie}</span>
      </header>
      <div class="rejilla-objetivos">${suyos.map(tarjeta).join('')}</div>
    </section>`;
  }).join('');
}

async function accionar(articulo, accion) {
  const fila = Number(articulo.dataset.fila);
  const obj = datos.objetivos.find((o) => o.filaExcel === fila);
  if (!obj) return;

  try {
    if (accion === 'sumar') {
      const respuesta = prompt(`¿Cuánto añades a "${obj.nombre}"?\n\nAhora vas por ${valor(obj, obj.progreso)} de ${valor(obj, obj.meta)}.`, '');
      if (respuesta === null || respuesta.trim() === '') return;
      await api.patch('/api/objetivos', { fila, sumar: respuesta });
      brindis('Progreso actualizado');
    } else if (accion === 'hecho') {
      await api.patch('/api/objetivos', { fila, progreso: obj.meta, estado: 'Conseguido' });
      brindis('¡Objetivo conseguido!');
    } else if (accion === 'reabrir') {
      await api.patch('/api/objetivos', { fila, estado: 'Activo' });
      brindis('Objetivo reabierto');
    } else if (accion === 'borrar') {
      if (!confirm(`¿Borrar el objetivo "${obj.nombre}" del Excel?\n\nQueda una copia en datos/Finanzas.respaldo.xlsx.`)) return;
      await api.borrar('/api/objetivos', { fila, nombre: obj.nombre });
      brindis('Objetivo borrado');
    }
    await cargarDatos();
  } catch (e) {
    brindis(e.message);
  }
}

export function conectar() {
  $('#oEstado').addEventListener('change', (e) => {
    estado.filtroEstado = e.target.value;
    pintar();
  });
  $('#oArea').addEventListener('change', (e) => {
    estado.filtroArea = e.target.value;
    pintar();
  });

  $('#oPlazos').addEventListener('click', (e) => {
    const boton = e.target.closest('button[data-plazo]');
    if (!boton) return;
    estado.filtroPlazo = boton.dataset.plazo;
    pintar();
  });

  $('#oGrupos').addEventListener('click', (e) => {
    const boton = e.target.closest('button[data-accion]');
    if (boton) accionar(boton.closest('.objetivo'), boton.dataset.accion);
  });
}
