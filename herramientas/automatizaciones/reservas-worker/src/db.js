export function getNegocio(db, slug) {
  return db.prepare('SELECT * FROM negocios WHERE slug = ? AND activo = 1').bind(slug).first();
}

export function getServicios(db, negocioId) {
  return db.prepare('SELECT * FROM servicios WHERE negocio_id = ? AND activo = 1').bind(negocioId).all();
}

export function getServicio(db, servicioId) {
  return db.prepare('SELECT * FROM servicios WHERE id = ? AND activo = 1').bind(servicioId).first();
}

export async function getReservasDelDia(db, negocioId, fecha) {
  const { results } = await db.prepare(
    'SELECT * FROM reservas WHERE negocio_id = ? AND fecha = ? AND estado = ?'
  ).bind(negocioId, fecha, 'confirmada').all();
  return results;
}

export async function hayConflicto(db, negocioId, fecha, hora, duracion) {
  const reservas = await getReservasDelDia(db, negocioId, fecha);
  const inicio = horaAMinutos(hora);
  const fin = inicio + duracion;

  return reservas.some(r => {
    const rInicio = horaAMinutos(r.hora);
    const rFin = rInicio + r.duracion;
    return inicio < rFin && fin > rInicio;
  });
}

export async function crearReserva(db, datos) {
  const token = crypto.randomUUID().slice(0, 8);
  const { meta } = await db.prepare(`
    INSERT INTO reservas (negocio_id, servicio_id, nombre, telefono, email, fecha, hora, duracion, nota, token)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    datos.negocio_id, datos.servicio_id || null,
    datos.nombre, datos.telefono, datos.email || null,
    datos.fecha, datos.hora, datos.duracion,
    datos.nota || null, token
  ).run();

  return { id: meta.last_row_id, token };
}

export async function cancelarReserva(db, token) {
  const reserva = await db.prepare('SELECT * FROM reservas WHERE token = ? AND estado = ?').bind(token, 'confirmada').first();
  if (!reserva) return null;
  await db.prepare('UPDATE reservas SET estado = ? WHERE id = ?').bind('cancelada', reserva.id).run();
  return reserva;
}

export async function getReservasManana(db) {
  const manana = fechaManana();
  const { results } = await db.prepare(`
    SELECT r.*, n.slug, n.nombre AS negocio_nombre, n.telefono AS negocio_tel,
           n.wa_phone_id, n.wa_token
    FROM reservas r
    JOIN negocios n ON n.id = r.negocio_id
    WHERE r.fecha = ? AND r.estado = ? AND r.wa_recordatorio IS NULL
  `).bind(manana, 'confirmada').all();
  return results;
}

export async function marcarRecordatorio(db, reservaId, waId) {
  await db.prepare('UPDATE reservas SET wa_recordatorio = ? WHERE id = ?').bind(waId, reservaId).run();
}

export async function buscarHuecosLibres(db, negocioId, fecha, duracion, max = 3) {
  const negocio = await db.prepare('SELECT * FROM negocios WHERE id = ?').bind(negocioId).first();
  if (!negocio) return [];

  const reservas = await getReservasDelDia(db, negocioId, fecha);
  const ocupados = reservas.map(r => ({
    inicio: horaAMinutos(r.hora),
    fin: horaAMinutos(r.hora) + r.duracion,
  }));

  const abre = horaAMinutos(negocio.hora_abre);
  const cierra = horaAMinutos(negocio.hora_cierra);
  const intervalo = negocio.intervalo || 30;
  const libres = [];

  for (let m = abre; m + duracion <= cierra && libres.length < max; m += intervalo) {
    const fin = m + duracion;
    const conflicto = ocupados.some(o => m < o.fin && fin > o.inicio);
    if (!conflicto) libres.push(minutosAHora(m));
  }

  return libres;
}

function horaAMinutos(hora) {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}

function minutosAHora(min) {
  return String(Math.floor(min / 60)).padStart(2, '0') + ':' + String(min % 60).padStart(2, '0');
}

function fechaManana() {
  const d = new Date();
  d.setUTCHours(d.getUTCHours() + 2); // España
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}
