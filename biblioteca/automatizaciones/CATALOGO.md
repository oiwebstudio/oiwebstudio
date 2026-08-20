# Catálogo de automatizaciones · OI Studio

Diez flujos de n8n con **coste 0 €**: todo corre en tu equipo o en planes gratuitos permanentes.
Decile a Claude el **nombre clave** y sabe qué flujo montar y qué nodos lleva.

| nombre clave | qué hace | disparador | servicios (todos gratis) |
|---|---|---|---|
| `auto-lead-form` | Recibe el formulario, filtra el spam, lo guarda en una hoja, te avisa al móvil y le contesta al cliente en el acto. | Webhook (el formulario de la web) | n8n autoalojado, Gmail SMTP (500 correos/día), Google Sheets, Telegram Bot |
| `auto-reserva-cita` | Comprueba en el calendario que la franja está libre, crea el evento y manda la confirmación. Si no hay hueco, devuelve alternativas. | Webhook (el widget de reservas de la web) | n8n autoalojado, Google Calendar, Gmail SMTP, Google Sheets |
| `auto-recordatorio-cita` | Mira las citas de mañana y le manda a cada cliente un recordatorio, más un resumen del día al negocio. | Programado · todos los días a las 9:00 | n8n autoalojado, Google Calendar, Gmail SMTP, Telegram Bot |
| `auto-pide-resena` | A los siete días de entregar un trabajo, le pide la reseña al cliente con el enlace directo a Google Maps y marca la hoja para no insistir. | Programado · todos los días a las 18:00 | n8n autoalojado, Google Sheets, Gmail SMTP, Telegram Bot |
| `auto-monitor-webs` | Comprueba que cada web de cliente responde, mide cuánto tarda y avisa si algo se cae o si el certificado está por caducar. | Programado · cada 15 minutos | n8n autoalojado, Google Sheets, Telegram Bot, Gmail SMTP |
| `auto-informe-seo` | Pasa PageSpeed a cada web de cliente, guarda el histórico y manda un informe redactado en cristiano por la IA local. | Programado · día 1 de cada mes a las 8:00 | n8n autoalojado, PageSpeed Insights API, Ollama en local, Google Sheets, Gmail SMTP |
| `auto-borrador-instagram` | Coge el último artículo del blog, y la IA local propone titular de carrusel, texto del pie y hashtags. Te llega a Telegram para aprobar o descartar. | Programado · lunes a las 9:00 | n8n autoalojado, Ollama en local, Telegram Bot |
| `auto-cobro-pendiente` | Revisa las facturas sin cobrar y manda tres avisos con tono distinto: a los 3, a los 10 y a los 20 días de vencer. | Programado · todos los días a las 10:00 | n8n autoalojado, Google Sheets, Gmail SMTP, Telegram Bot |
| `auto-chat-faq` | Responde las preguntas frecuentes con la IA local usando sólo la hoja de FAQ del cliente, y cuando no sabe, deriva a una persona. | Webhook (el chat de la web) | n8n autoalojado, Ollama en local, Google Sheets, Gmail SMTP |
| `auto-backup-webs` | Descarga cada web de cliente y la guarda fechada en tu disco, con un informe de qué se copió y cuánto ocupa. | Programado · domingos a las 3:00 | n8n autoalojado, Disco local, Gmail SMTP, Telegram Bot |

## Detalle

### 📥 auto-lead-form

**Formulario de contacto sin perder un lead** — Recibe el formulario, filtra el spam, lo guarda en una hoja, te avisa al móvil y le contesta al cliente en el acto.

*Por qué vale la pena:* Un lead que espera 24 h por una respuesta ya está pidiendo presupuesto a otro. Esto contesta en segundos y deja el registro ordenado.

1. Validación antispam por honeypot y longitud mínima, sin captcha de pago
1. Fila nueva en la hoja de leads con fecha, origen y mensaje
1. Aviso instantáneo a tu Telegram con el teléfono ya pulsable
1. Respuesta automática al cliente firmada por el estudio

Nodos: `Formulario web` → `Antispam` → `¿Es spam?` → `Descartar en silencio` → `Normalizar datos` → `Guardar en la hoja` → `Avisarme al móvil` → `Responder al cliente` → `Devolver OK`

Importar: `flujos/auto-lead-form.json`

### 📅 auto-reserva-cita

**Reserva de cita con hueco comprobado** — Comprueba en el calendario que la franja está libre, crea el evento y manda la confirmación. Si no hay hueco, devuelve alternativas.

*Por qué vale la pena:* Es el motor de reservas que ya vendés, pero sin depender de Calendly ni de ninguna suscripción mensual.

1. Lee los eventos de esa franja para descartar solapes
1. Crea el evento con los datos del cliente y un recordatorio propio
1. Envía confirmación con la dirección y el enlace para cancelar
1. Si está ocupado, propone las dos franjas libres más cercanas

Nodos: `Widget de reservas` → `Preparar franja` → `Ver si hay hueco` → `¿Está libre?` → `¿Franja libre?` → `Crear la cita` → `Confirmar al cliente` → `Registrar la reserva` → `Buscar alternativas` → `Responder al widget`

Importar: `flujos/auto-reserva-cita.json`

### ⏰ auto-recordatorio-cita

**Recordatorio 24 h antes para que no falten** — Mira las citas de mañana y le manda a cada cliente un recordatorio, más un resumen del día al negocio.

*Por qué vale la pena:* Las ausencias sin avisar son el agujero de caja de peluquerías, talleres y clínicas. Un recordatorio las baja mucho y no cuesta nada.

1. Lee las citas de las próximas 24–48 h
1. Extrae email y teléfono de la descripción del evento
1. Envía un recordatorio corto y claro a cada cliente
1. Te manda por Telegram el resumen del día siguiente

Nodos: `Cada mañana a las 9:00` → `Citas de mañana` → `Sacar contacto` → `Uno a uno` → `Recordar al cliente` → `Armar el resumen` → `Resumen del día`

Importar: `flujos/auto-recordatorio-cita.json`

### ⭐ auto-pide-resena

**Pide la reseña en el momento justo** — A los siete días de entregar un trabajo, le pide la reseña al cliente con el enlace directo a Google Maps y marca la hoja para no insistir.

*Por qué vale la pena:* Las reseñas son lo que más mueve el SEO local, y casi nadie las pide. Pedirlas en automático a la semana justa multiplica la respuesta.

1. Lee la hoja de trabajos entregados
1. Se queda con los de hace 7 días que aún no tienen reseña pedida
1. Envía un correo corto con el enlace directo a dejar reseña
1. Marca la fila como pedida y te resume cuántas salieron

Nodos: `Cada tarde a las 18:00` → `Trabajos entregados` → `Los de hace 7 días` → `Uno a uno` → `Pedir la reseña` → `Marcar como pedida` → `Contar los envíos` → `Resumen de reseñas`

Importar: `flujos/auto-pide-resena.json`

### 🚨 auto-monitor-webs

**Vigilancia de las webs de cliente** — Comprueba que cada web de cliente responde, mide cuánto tarda y avisa si algo se cae o si el certificado está por caducar.

*Por qué vale la pena:* Enterarte de una caída por el propio cliente es la peor manera. Esto te avisa antes, y es un argumento de venta para el mantenimiento mensual.

1. Lee la lista de webs desde una hoja
1. Hace una petición a cada una sin cortar el flujo si falla
1. Marca como incidencia el código distinto de 200 o más de 4 s de respuesta
1. Avisa por Telegram al instante y deja el registro en la hoja

Nodos: `Cada 15 minutos` → `Lista de webs` → `Web a web` → `Llamar a la web` → `Evaluar respuesta` → `¿Se cayó?` → `Alerta al móvil` → `Registrar incidencia` → `Todo correcto`

Importar: `flujos/auto-monitor-webs.json`

### 📊 auto-informe-seo

**Informe mensual de velocidad y SEO** — Pasa PageSpeed a cada web de cliente, guarda el histórico y manda un informe redactado en cristiano por la IA local.

*Por qué vale la pena:* Es el entregable que justifica la cuota de mantenimiento. Con PageSpeed gratis y Ollama en tu equipo, el coste sigue siendo cero.

1. Consulta PageSpeed móvil de cada web (API pública y gratuita)
1. Extrae LCP, CLS y la puntuación de rendimiento
1. Ollama redacta el resumen en lenguaje de cliente, sin tecnicismos
1. Envía el informe y guarda la fila en el histórico

Nodos: `Día 1 de cada mes` → `Clientes con mantenimiento` → `Cliente a cliente` → `PageSpeed móvil` → `Extraer métricas` → `Redactar el informe` → `Montar el correo` → `Enviar al cliente` → `Guardar histórico`

Importar: `flujos/auto-informe-seo.json`

### 📱 auto-borrador-instagram

**Borrador de Instagram a partir del blog** — Coge el último artículo del blog, y la IA local propone titular de carrusel, texto del pie y hashtags. Te llega a Telegram para aprobar o descartar.

*Por qué vale la pena:* Lo que mata la constancia en redes es la hoja en blanco del lunes. Esto la resuelve sin pagar ninguna herramienta de contenidos.

1. Lee el RSS del blog
1. Se queda con el artículo más reciente
1. Ollama escribe portada de carrusel, cuatro diapositivas y pie con hashtags
1. Te lo manda a Telegram como borrador para revisar

Nodos: `Lunes a las 9:00` → `RSS del blog` → `El más reciente` → `Escribir el carrusel` → `Dar formato` → `Borrador a Telegram`

Importar: `flujos/auto-borrador-instagram.json`

### 💶 auto-cobro-pendiente

**Recordatorio de facturas pendientes** — Revisa las facturas sin cobrar y manda tres avisos con tono distinto: a los 3, a los 10 y a los 20 días de vencer.

*Por qué vale la pena:* Reclamar por escrito incomoda y se posterga. Automatizado se manda solo, siempre correcto y siempre a tiempo.

1. Lee la hoja de facturas y calcula los días vencidos
1. Separa en tres tramos: recordatorio suave, firme y aviso final
1. Envía el correo correspondiente con el número y el importe
1. Si pasa de 20 días te avisa a vos para llamar por teléfono

Nodos: `Cada día a las 10:00` → `Facturas` → `Calcular vencidas` → `Según el tramo` → `Aviso suave` → `Aviso firme` → `Aviso final` → `Avisarme para llamar` → `Anotar el aviso`

Importar: `flujos/auto-cobro-pendiente.json`

### 💬 auto-chat-faq

**Chat de la web que responde con tus FAQ** — Responde las preguntas frecuentes con la IA local usando sólo la hoja de FAQ del cliente, y cuando no sabe, deriva a una persona.

*Por qué vale la pena:* Es el chatbot de reservas que ya tenés montado, pero con el modelo corriendo en tu equipo: sin tokens, sin cuota mensual y sin mandar datos de cliente a terceros.

1. Recibe la pregunta desde el widget de chat
1. Carga las FAQ del negocio desde una hoja
1. Ollama responde usando sólo ese contexto, o admite que no sabe
1. Si no sabe, avisa por correo al negocio y le dice al visitante que le contestarán

Nodos: `Chat de la web` → `FAQ del negocio` → `Montar contexto` → `Responder con la IA local` → `¿Supo responder?` → `¿Tiene respuesta?` → `Respuesta directa` → `Derivar al negocio` → `Respuesta de espera` → `Devolver al chat`

Importar: `flujos/auto-chat-faq.json`

### 💾 auto-backup-webs

**Copia de seguridad semanal de las webs** — Descarga cada web de cliente y la guarda fechada en tu disco, con un informe de qué se copió y cuánto ocupa.

*Por qué vale la pena:* La copia de seguridad es lo que separa un susto de una catástrofe, y es el argumento más fácil para cerrar un mantenimiento anual.

1. Lee la lista de webs y su origen
1. Descarga el contenido de cada una
1. Lo guarda en carpeta con fecha en tu disco
1. Te manda el informe de la noche por Telegram

Nodos: `Domingos a las 3:00` → `Webs a copiar` → `Web a web` → `Descargar la web` → `Guardar en disco` → `Anotar el resultado` → `Informe final` → `Informe de la copia`

Importar: `flujos/auto-backup-webs.json`
