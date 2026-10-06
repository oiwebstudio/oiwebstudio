-- Ejecutar con: npx wrangler d1 execute oi-reservas --file=schema.sql

CREATE TABLE IF NOT EXISTS negocios (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  slug       TEXT    NOT NULL UNIQUE,            -- "errotatxo", "aberri"
  nombre     TEXT    NOT NULL,                   -- "Errotatxo Okindegia"
  telefono   TEXT    NOT NULL,                   -- "+34600000000" (WhatsApp del dueño)
  wa_phone_id TEXT,                              -- ID de WhatsApp del negocio (si tiene propio)
  wa_token    TEXT,                              -- token propio (si tiene)
  duracion   INTEGER NOT NULL DEFAULT 60,        -- minutos por defecto
  hora_abre  TEXT    NOT NULL DEFAULT '09:00',
  hora_cierra TEXT   NOT NULL DEFAULT '20:00',
  dias_abre  TEXT    NOT NULL DEFAULT '1,2,3,4,5', -- 0=dom, 1=lun...
  intervalo  INTEGER NOT NULL DEFAULT 30,        -- cada cuántos minutos se puede reservar
  max_dia    INTEGER NOT NULL DEFAULT 20,        -- máximo de reservas por día
  activo     INTEGER NOT NULL DEFAULT 1,
  creado     TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS servicios (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  negocio_id INTEGER NOT NULL REFERENCES negocios(id),
  nombre     TEXT    NOT NULL,                   -- "Corte de pelo"
  duracion   INTEGER NOT NULL DEFAULT 60,        -- minutos
  precio     REAL,                               -- opcional, en euros
  activo     INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS reservas (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  negocio_id INTEGER NOT NULL REFERENCES negocios(id),
  servicio_id INTEGER REFERENCES servicios(id),
  nombre     TEXT    NOT NULL,                   -- nombre del cliente
  telefono   TEXT    NOT NULL,                   -- teléfono del cliente
  email      TEXT,
  fecha      TEXT    NOT NULL,                   -- "2026-10-15"
  hora       TEXT    NOT NULL,                   -- "10:30"
  duracion   INTEGER NOT NULL DEFAULT 60,
  nota       TEXT,
  estado     TEXT    NOT NULL DEFAULT 'confirmada', -- confirmada, cancelada, completada
  token      TEXT    NOT NULL,                   -- para cancelar sin login
  wa_confirmacion TEXT,                          -- ID del mensaje de WhatsApp
  wa_recordatorio TEXT,                          -- ID del recordatorio
  creado     TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_reservas_fecha ON reservas(negocio_id, fecha, estado);
CREATE INDEX IF NOT EXISTS idx_reservas_token ON reservas(token);
