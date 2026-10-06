import { getNegocio, getServicios, getServicio, getReservasDelDia, hayConflicto, crearReserva, cancelarReserva, getReservasManana, marcarRecordatorio, buscarHuecosLibres } from './db.js';
import { enviarPlantilla, enviarTexto } from './whatsapp.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    try {
      // --- API pública ---

      // GET /api/:slug/servicios
      let match = path.match(/^\/api\/([a-z0-9-]+)\/servicios$/);
      if (match && request.method === 'GET') {
        return await handleServicios(env, match[1], cors);
      }

      // GET /api/:slug/huecos?fecha=2026-10-15&duracion=60
      match = path.match(/^\/api\/([a-z0-9-]+)\/huecos$/);
      if (match && request.method === 'GET') {
        const fecha = url.searchParams.get('fecha');
        const duracion = parseInt(url.searchParams.get('duracion') || '60');
        return await handleHuecos(env, match[1], fecha, duracion, cors);
      }

      // POST /api/:slug/reservar
      match = path.match(/^\/api\/([a-z0-9-]+)\/reservar$/);
      if (match && request.method === 'POST') {
        const body = await request.json();
        return await handleReservar(env, match[1], body, cors);
      }

      // GET /api/cancelar?token=xxx
      if (path === '/api/cancelar' && request.method === 'GET') {
        const token = url.searchParams.get('token');
        return await handleCancelar(env, token, cors);
      }

      // --- Admin (protegido) ---

      // GET /admin/:slug/reservas?fecha=2026-10-15
      match = path.match(/^\/admin\/([a-z0-9-]+)\/reservas$/);
      if (match && request.method === 'GET') {
        if (!checkAdmin(request, env)) return json({ error: 'No autorizado' }, 401, cors);
        const fecha = url.searchParams.get('fecha') || hoy();
        return await handleListarReservas(env, match[1], fecha, cors);
      }

      // POST /admin/negocios
      if (path === '/admin/negocios' && request.method === 'POST') {
        if (!checkAdmin(request, env)) return json({ error: 'No autorizado' }, 401, cors);
        const body = await request.json();
        return await handleCrearNegocio(env, body, cors);
      }

      // POST /admin/:slug/servicios
      match = path.match(/^\/admin\/([a-z0-9-]+)\/servicios$/);
      if (match && request.method === 'POST') {
        if (!checkAdmin(request, env)) return json({ error: 'No autorizado' }, 401, cors);
        const body = await request.json();
        return await handleCrearServicio(env, match[1], body, cors);
      }

      return json({ error: 'Ruta no encontrada' }, 404, cors);

    } catch (err) {
      console.error(err);
      return json({ error: 'Error interno' }, 500, cors);
    }
  },

  async scheduled(event, env) {
    await enviarRecordatorios(env);
  },
};

// ─── Handlers públicos ───

async function handleServicios(env, slug, cors) {
  const negocio = await getNegocio(env.DB, slug);
  if (!negocio) return json({ error: 'Negocio no encontrado' }, 404, cors);

  const { results } = await getServicios(env.DB, negocio.id);
  return json({
    negocio: negocio.nombre,
    horario: { abre: negocio.hora_abre, cierra: negocio.hora_cierra, dias: negocio.dias_abre },
    servicios: results.map(s => ({ id: s.id, nombre: s.nombre, duracion: s.duracion, precio: s.precio })),
  }, 200, cors);
}

async function handleHuecos(env, slug, fecha, duracion, cors) {
  if (!fecha) return json({ error: 'Falta el parámetro fecha' }, 400, cors);

  const negocio = await getNegocio(env.DB, slug);
  if (!negocio) return json({ error: 'Negocio no encontrado' }, 404, cors);

  const diasAbre = negocio.dias_abre.split(',').map(Number);
  const diaSemana = new Date(fecha + 'T12:00:00').getDay();
  if (!diasAbre.includes(diaSemana)) {
    return json({ fecha, huecos: [], cerrado: true }, 200, cors);
  }

  const huecos = await buscarHuecosLibres(env.DB, negocio.id, fecha, duracion, 50);
  return json({ fecha, huecos, cerrado: false }, 200, cors);
}

async function handleReservar(env, slug, body, cors) {
  const { nombre, telefono, email, fecha, hora, servicio_id, nota } = body;

  if (!nombre || !telefono || !fecha || !hora) {
    return json({ error: 'Faltan campos: nombre, telefono, fecha, hora' }, 400, cors);
  }

  const negocio = await getNegocio(env.DB, slug);
  if (!negocio) return json({ error: 'Negocio no encontrado' }, 404, cors);

  let duracion = negocio.duracion;
  if (servicio_id) {
    const servicio = await getServicio(env.DB, servicio_id);
    if (servicio) duracion = servicio.duracion;
  }

  const tel = normalizarTelefono(telefono);

  const conflicto = await hayConflicto(env.DB, negocio.id, fecha, hora, duracion);
  if (conflicto) {
    const alternativas = await buscarHuecosLibres(env.DB, negocio.id, fecha, duracion, 3);
    return json({ ok: false, motivo: 'ocupado', alternativas }, 409, cors);
  }

  const { id, token } = await crearReserva(env.DB, {
    negocio_id: negocio.id,
    servicio_id,
    nombre,
    telefono: tel,
    email,
    fecha,
    hora,
    duracion,
    nota,
  });

  const fechaBonita = formatearFecha(fecha);
  const servicioNombre = servicio_id
    ? (await getServicio(env.DB, servicio_id))?.nombre || ''
    : '';

  // Confirmación al cliente por WhatsApp
  let waId = null;
  try {
    waId = await enviarPlantilla(env, tel, 'confirmacion_reserva',
      [nombre, servicioNombre || 'Cita', fechaBonita, hora], negocio);
    await env.DB.prepare('UPDATE reservas SET wa_confirmacion = ? WHERE id = ?').bind(waId, id).run();
  } catch (err) {
    console.error('WhatsApp confirmación falló:', err.message);
  }

  // Aviso al negocio
  try {
    await enviarTexto(env, negocio.telefono,
      `📅 Nueva reserva:\n${nombre}\n${servicioNombre || 'Cita'}\n${fechaBonita} a las ${hora}\n📞 ${tel}`,
      negocio);
  } catch (err) {
    console.error('WhatsApp aviso negocio falló:', err.message);
  }

  const urlCancelar = `https://oi-reservas.oi-studio-web.workers.dev/api/cancelar?token=${token}`;

  return json({ ok: true, reserva: id, cancelar: urlCancelar }, 201, cors);
}

async function handleCancelar(env, token, cors) {
  if (!token) return json({ error: 'Falta token' }, 400, cors);

  const reserva = await cancelarReserva(env.DB, token);
  if (!reserva) return json({ error: 'Reserva no encontrada o ya cancelada' }, 404, cors);

  const negocio = await env.DB.prepare('SELECT * FROM negocios WHERE id = ?').bind(reserva.negocio_id).first();

  // Avisar al negocio
  if (negocio) {
    try {
      await enviarTexto(env, negocio.telefono,
        `❌ Reserva cancelada:\n${reserva.nombre}\n${formatearFecha(reserva.fecha)} a las ${reserva.hora}`,
        negocio);
    } catch (err) {
      console.error('WhatsApp cancelación falló:', err.message);
    }
  }

  return json({ ok: true, mensaje: 'Reserva cancelada' }, 200, cors);
}

// ─── Handlers admin ───

async function handleListarReservas(env, slug, fecha, cors) {
  const negocio = await getNegocio(env.DB, slug);
  if (!negocio) return json({ error: 'Negocio no encontrado' }, 404, cors);

  const reservas = await getReservasDelDia(env.DB, negocio.id, fecha);
  return json({ fecha, total: reservas.length, reservas }, 200, cors);
}

async function handleCrearNegocio(env, body, cors) {
  const { slug, nombre, telefono, hora_abre, hora_cierra, dias_abre, duracion, intervalo, max_dia } = body;
  if (!slug || !nombre || !telefono) {
    return json({ error: 'Faltan campos: slug, nombre, telefono' }, 400, cors);
  }

  await env.DB.prepare(`
    INSERT INTO negocios (slug, nombre, telefono, hora_abre, hora_cierra, dias_abre, duracion, intervalo, max_dia)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    slug, nombre, normalizarTelefono(telefono),
    hora_abre || '09:00', hora_cierra || '20:00',
    dias_abre || '1,2,3,4,5', duracion || 60, intervalo || 30, max_dia || 20
  ).run();

  return json({ ok: true, slug }, 201, cors);
}

async function handleCrearServicio(env, slug, body, cors) {
  const negocio = await getNegocio(env.DB, slug);
  if (!negocio) return json({ error: 'Negocio no encontrado' }, 404, cors);

  const { nombre, duracion, precio } = body;
  if (!nombre) return json({ error: 'Falta el nombre del servicio' }, 400, cors);

  await env.DB.prepare(
    'INSERT INTO servicios (negocio_id, nombre, duracion, precio) VALUES (?, ?, ?, ?)'
  ).bind(negocio.id, nombre, duracion || 60, precio || null).run();

  return json({ ok: true }, 201, cors);
}

// ─── Cron: recordatorios ───

async function enviarRecordatorios(env) {
  const reservas = await getReservasManana(env.DB);
  let enviados = 0;

  const porNegocio = {};

  for (const r of reservas) {
    try {
      const waId = await enviarPlantilla(env, r.telefono, 'recordatorio_cita',
        [r.nombre, r.hora.slice(0, 5)], { wa_phone_id: r.wa_phone_id, wa_token: r.wa_token });
      await marcarRecordatorio(env.DB, r.id, waId);
      enviados++;

      if (!porNegocio[r.negocio_id]) porNegocio[r.negocio_id] = { tel: r.negocio_tel, neg: r, citas: [] };
      porNegocio[r.negocio_id].citas.push(r);
    } catch (err) {
      console.error(`Recordatorio falló para reserva ${r.id}:`, err.message);
    }
  }

  // Resumen al negocio
  for (const [, grupo] of Object.entries(porNegocio)) {
    const lineas = grupo.citas.map(c => `• ${c.hora} — ${c.nombre}`).join('\n');
    try {
      await enviarTexto(env, grupo.tel,
        `📋 Mañana tienes ${grupo.citas.length} citas:\n\n${lineas}`,
        grupo.neg);
    } catch (err) {
      console.error('Resumen negocio falló:', err.message);
    }
  }

  console.log(`Recordatorios enviados: ${enviados}/${reservas.length}`);
}

// ─── Utilidades ───

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

function checkAdmin(request, env) {
  const auth = request.headers.get('Authorization');
  return auth === `Bearer ${env.ADMIN_KEY}`;
}

function normalizarTelefono(tel) {
  let t = tel.replace(/[^0-9+]/g, '');
  if (/^[67]/.test(t)) t = '+34' + t;
  if (!t.startsWith('+')) t = '+34' + t;
  return t;
}

function formatearFecha(fecha) {
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const [a, m, d] = fecha.split('-');
  return `${parseInt(d)} de ${meses[parseInt(m) - 1]}`;
}

function hoy() {
  const d = new Date();
  d.setUTCHours(d.getUTCHours() + 2);
  return d.toISOString().slice(0, 10);
}
