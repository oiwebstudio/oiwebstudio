# oi-reservas · Worker multi-cliente

Sistema de reservas con confirmación y recordatorio por WhatsApp.
Corre en Cloudflare Workers (gratis) + D1 (gratis).

## Setup rápido

```bash
# 1. Crear la base de datos
npx wrangler d1 create oi-reservas
# → Copiar el database_id en wrangler.toml

# 2. Crear las tablas
npx wrangler d1 execute oi-reservas --file=schema.sql

# 3. Añadir secretos
npx wrangler secret put WA_TOKEN
npx wrangler secret put WA_PHONE_ID
npx wrangler secret put ADMIN_KEY

# 4. Desplegar
npx wrangler deploy -c herramientas/automatizaciones/reservas-worker/wrangler.toml
```

## Dar de alta un cliente

```bash
curl -X POST https://oi-reservas.oi-studio-web.workers.dev/admin/negocios \
  -H "Authorization: Bearer TU_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "errotatxo",
    "nombre": "Errotatxo Okindegia",
    "telefono": "+34600000000",
    "hora_abre": "07:00",
    "hora_cierra": "20:00",
    "dias_abre": "1,2,3,4,5,6",
    "duracion": 30,
    "intervalo": 30
  }'
```

## Añadir servicios

```bash
curl -X POST https://oi-reservas.oi-studio-web.workers.dev/admin/errotatxo/servicios \
  -H "Authorization: Bearer TU_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Pan artesanal (encargo)", "duracion": 15}'
```

## Embeber en la web del cliente

```html
<div id="oi-reservas"></div>
<script src="https://oi-reservas.oi-studio-web.workers.dev/widget.js"
        data-negocio="errotatxo"></script>
```

## API

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/:slug/servicios` | Lista servicios y horarios |
| GET | `/api/:slug/huecos?fecha=YYYY-MM-DD` | Huecos libres para esa fecha |
| POST | `/api/:slug/reservar` | Crea reserva + confirma por WhatsApp |
| GET | `/api/cancelar?token=xxx` | Cancela una reserva |
| GET | `/admin/:slug/reservas?fecha=YYYY-MM-DD` | Lista reservas (auth) |
| POST | `/admin/negocios` | Crea un negocio (auth) |
| POST | `/admin/:slug/servicios` | Añade un servicio (auth) |

## Cron

Cada día a las 9:00 (hora España) envía recordatorio por WhatsApp
a los clientes con cita al día siguiente, y un resumen al negocio.
