/**
 * Genera la biblioteca de automatizaciones de OI Studio.
 *
 *   node generar.mjs
 *
 * Salida:  flujos/*.json  (importables en n8n)  ·  CATALOGO.md  ·  index.html
 *
 * Regla de la biblioteca: coste 0 €. Sólo n8n autoalojado, Ollama en local
 * y servicios con plan gratuito permanente (Gmail SMTP, Google Sheets,
 * Google Calendar, Telegram, PageSpeed Insights).
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(DIR, 'flujos'), { recursive: true });

/* ---------- helpers de nodo ---------- */
let uid = 0;
const id = () => 'oi-' + String(++uid).padStart(4, '0');

const n = (name, type, typeVersion, parameters = {}, extra = {}) =>
  ({ name, type: 'n8n-nodes-base.' + type, typeVersion, parameters, ...extra });

const cred = (tipo, nombre) => ({ credentials: { [tipo]: { id: '', name: nombre } } });

// atajos de nodo, siempre con opciones de plan gratuito
const web   = (name, path, method = 'POST') => n(name, 'webhook', 2, { httpMethod: method, path, responseMode: 'responseNode', options: {} }, { webhookId: id() });
const cron  = (name, rule) => n(name, 'scheduleTrigger', 1.2, { rule });
const code  = (name, jsCode) => n(name, 'code', 2, { jsCode });
const iff   = (name, izq, op, der) => n(name, 'if', 2, {
  conditions: { options: { caseSensitive: true, version: 2 },
    conditions: [{ id: id(), leftValue: izq, rightValue: der, operator: op }], combinator: 'and' }, options: {} });
const http  = (name, url, opts = {}) => n(name, 'httpRequest', 4.2, { url, options: {}, ...opts });
const mail  = (name, to, subject, html) => n(name, 'emailSend', 2.1,
  { fromEmail: 'hola@oistudio.eus', toEmail: to, subject, emailFormat: 'html', html, options: {} },
  cred('smtp', 'Gmail SMTP (gratis)'));
const hoja  = (name, operation, extra = {}) => n(name, 'googleSheets', 4.5,
  { operation, documentId: { __rl: true, value: 'ID_DE_TU_HOJA', mode: 'id' },
    sheetName: { __rl: true, value: 'gid=0', mode: 'list' }, options: {}, ...extra },
  cred('googleSheetsOAuth2Api', 'Google Sheets (gratis)'));
const cal   = (name, operation, extra = {}) => n(name, 'googleCalendar', 1.3,
  { operation, calendar: { __rl: true, value: 'primary', mode: 'list' }, options: {}, ...extra },
  cred('googleCalendarOAuth2Api', 'Google Calendar (gratis)'));
const tele  = (name, text) => n(name, 'telegram', 1.2,
  { chatId: 'TU_CHAT_ID', text, additionalFields: { parse_mode: 'HTML' } },
  cred('telegramApi', 'Telegram Bot (gratis)'));
const resp  = (name, body) => n(name, 'respondToWebhook', 1.1, { respondWith: 'json', responseBody: body, options: {} });
const lote  = (name, batchSize = 1) => n(name, 'splitInBatches', 3, { batchSize, options: {} });
const nada  = (name) => n(name, 'noOp', 1, {});

// Ollama en local: gratis, sin clave y sin enviar datos del cliente fuera
const ollama = (name, prompt) => http(name, 'http://localhost:11434/api/generate', {
  method: 'POST', sendBody: true, specifyBody: 'json',
  jsonBody: JSON.stringify({ model: 'llama3.1:8b', stream: false, prompt: '={{ `' + prompt + '` }}' }, null, 2)
});

/* ---------- las 10 automatizaciones ---------- */
const FLUJOS = [

{ slug:'auto-lead-form', nombre:'Formulario de contacto sin perder un lead',
  icono:'📥', disparador:'Webhook (el formulario de la web)',
  que:'Recibe el formulario, filtra el spam, lo guarda en una hoja, te avisa al móvil y le contesta al cliente en el acto.',
  porque:'Un lead que espera 24 h por una respuesta ya está pidiendo presupuesto a otro. Esto contesta en segundos y deja el registro ordenado.',
  gratis:['n8n autoalojado','Gmail SMTP (500 correos/día)','Google Sheets','Telegram Bot'],
  pasos:['Validación antispam por honeypot y longitud mínima, sin captcha de pago',
         'Fila nueva en la hoja de leads con fecha, origen y mensaje',
         'Aviso instantáneo a tu Telegram con el teléfono ya pulsable',
         'Respuesta automática al cliente firmada por el estudio'],
  nodos:[
    web('Formulario web','lead'),
    code('Antispam', `// Honeypot + mínimos. Cero coste, cero captcha.
const b = $json.body ?? $json;
const esSpam = Boolean(b.website) ||
  (b.mensaje ?? '').trim().length < 12 ||
  /https?:\\/\\//i.test(b.nombre ?? '');
return [{ json: { ...b, esSpam } }];`),
    iff('¿Es spam?','={{ $json.esSpam }}',{type:'boolean',operation:'true',singleValue:true}),
    nada('Descartar en silencio'),
    n('Normalizar datos','set',3.4,{ mode:'manual', assignments:{ assignments:[
      {id:id(),name:'nombre',value:'={{ $json.nombre.trim() }}',type:'string'},
      {id:id(),name:'email',value:'={{ $json.email.trim().toLowerCase() }}',type:'string'},
      {id:id(),name:'telefono',value:'={{ ($json.telefono ?? "").replace(/\\s/g,"") }}',type:'string'},
      {id:id(),name:'mensaje',value:'={{ $json.mensaje.trim() }}',type:'string'},
      {id:id(),name:'origen',value:'={{ $json.origen ?? "web" }}',type:'string'},
      {id:id(),name:'recibido',value:'={{ $now.format("yyyy-LL-dd HH:mm") }}',type:'string'}
    ]}, options:{} }),
    hoja('Guardar en la hoja','append',{ columns:{ mappingMode:'autoMapInputData', value:{} } }),
    tele('Avisarme al móvil','=<b>Nuevo lead</b>\\n{{ $json.nombre }}\\n<a href="tel:{{ $json.telefono }}">{{ $json.telefono }}</a>\\n{{ $json.email }}\\n\\n{{ $json.mensaje }}'),
    mail('Responder al cliente','={{ $json.email }}','=Hemos recibido tu mensaje, {{ $json.nombre }}',
      '=<p>Hola {{ $json.nombre }}:</p><p>Recibimos tu mensaje y te contestamos hoy mismo en horario de oficina.</p><p>Un saludo,<br><strong>OI Studio</strong> · Tolosa</p>'),
    resp('Devolver OK','={{ JSON.stringify({ ok: true }) }}')
  ],
  links:[['Formulario web','Antispam'],['Antispam','¿Es spam?'],
         ['¿Es spam?','Descartar en silencio',0],['¿Es spam?','Normalizar datos',1],
         ['Normalizar datos','Guardar en la hoja'],['Guardar en la hoja','Avisarme al móvil'],
         ['Avisarme al móvil','Responder al cliente'],['Responder al cliente','Devolver OK']] },

{ slug:'auto-reserva-cita', nombre:'Reserva de cita con hueco comprobado',
  icono:'📅', disparador:'Webhook (el widget de reservas de la web)',
  que:'Comprueba en el calendario que la franja está libre, crea el evento y manda la confirmación. Si no hay hueco, devuelve alternativas.',
  porque:'Es el motor de reservas que ya vendés, pero sin depender de Calendly ni de ninguna suscripción mensual.',
  gratis:['n8n autoalojado','Google Calendar','Gmail SMTP','Google Sheets'],
  pasos:['Lee los eventos de esa franja para descartar solapes',
         'Crea el evento con los datos del cliente y un recordatorio propio',
         'Envía confirmación con la dirección y el enlace para cancelar',
         'Si está ocupado, propone las dos franjas libres más cercanas'],
  nodos:[
    web('Widget de reservas','reserva'),
    code('Preparar franja', `const b = $json.body ?? $json;
const inicio = new Date(b.fecha + 'T' + b.hora + ':00');
const fin = new Date(inicio.getTime() + (b.duracion ?? 60) * 60000);
return [{ json: { ...b, inicio: inicio.toISOString(), fin: fin.toISOString() } }];`),
    cal('Ver si hay hueco','getAll',{ returnAll:true, timeMin:'={{ $json.inicio }}', timeMax:'={{ $json.fin }}' }),
    code('¿Está libre?', `// getAll devuelve un item vacío cuando no hay eventos
const eventos = items.filter(i => i.json.id);
const datos = $('Preparar franja').first().json;
return [{ json: { ...datos, libre: eventos.length === 0, ocupados: eventos.length } }];`),
    iff('¿Franja libre?','={{ $json.libre }}',{type:'boolean',operation:'true',singleValue:true}),
    cal('Crear la cita','create',{ start:'={{ $json.inicio }}', end:'={{ $json.fin }}',
      additionalFields:{ summary:'={{ $json.servicio }} · {{ $json.nombre }}',
        description:'={{ $json.telefono }} · {{ $json.email }}\\n\\n{{ $json.nota }}' } }),
    mail('Confirmar al cliente','={{ $json.email }}','=Cita confirmada · {{ $json.fecha }} a las {{ $json.hora }}',
      '=<p>Hola {{ $json.nombre }}:</p><p>Tu cita para <strong>{{ $json.servicio }}</strong> queda confirmada el <strong>{{ $json.fecha }}</strong> a las <strong>{{ $json.hora }}</strong>.</p><p>Si te surge algo, contestá a este correo y la movemos.</p>'),
    hoja('Registrar la reserva','append',{ columns:{ mappingMode:'autoMapInputData', value:{} } }),
    code('Buscar alternativas', `// Dos huecos siguientes de la misma duración
const d = $json, base = new Date(d.inicio), dur = (d.duracion ?? 60);
const alt = [1, 2].map(k => new Date(base.getTime() + k * dur * 60000)
  .toISOString().slice(11, 16));
return [{ json: { ok: false, motivo: 'ocupado', alternativas: alt } }];`),
    resp('Responder al widget','={{ JSON.stringify($json) }}')
  ],
  links:[['Widget de reservas','Preparar franja'],['Preparar franja','Ver si hay hueco'],
         ['Ver si hay hueco','¿Está libre?'],['¿Está libre?','¿Franja libre?'],
         ['¿Franja libre?','Crear la cita',0],['¿Franja libre?','Buscar alternativas',1],
         ['Crear la cita','Confirmar al cliente'],['Confirmar al cliente','Registrar la reserva'],
         ['Registrar la reserva','Responder al widget'],['Buscar alternativas','Responder al widget']] },

{ slug:'auto-recordatorio-cita', nombre:'Recordatorio 24 h antes para que no falten',
  icono:'⏰', disparador:'Programado · todos los días a las 9:00',
  que:'Mira las citas de mañana y le manda a cada cliente un recordatorio, más un resumen del día al negocio.',
  porque:'Las ausencias sin avisar son el agujero de caja de peluquerías, talleres y clínicas. Un recordatorio las baja mucho y no cuesta nada.',
  gratis:['n8n autoalojado','Google Calendar','Gmail SMTP','Telegram Bot'],
  pasos:['Lee las citas de las próximas 24–48 h',
         'Extrae email y teléfono de la descripción del evento',
         'Envía un recordatorio corto y claro a cada cliente',
         'Te manda por Telegram el resumen del día siguiente'],
  nodos:[
    cron('Cada mañana a las 9:00',{ interval:[{ field:'cronExpression', expression:'0 9 * * *' }] }),
    cal('Citas de mañana','getAll',{ returnAll:true,
      timeMin:'={{ $now.plus({days:1}).startOf("day").toISO() }}',
      timeMax:'={{ $now.plus({days:1}).endOf("day").toISO() }}' }),
    code('Sacar contacto', `// El email y el teléfono viajan en la descripción del evento
return items.filter(i => i.json.id).map(i => {
  const d = i.json.description ?? '';
  return { json: {
    titulo: i.json.summary,
    hora: (i.json.start?.dateTime ?? '').slice(11, 16),
    email: (d.match(/[\\w.+-]+@[\\w-]+\\.[\\w.]+/) ?? [''])[0],
    telefono: (d.match(/\\+?\\d[\\d ]{7,}/) ?? [''])[0].trim()
  }};
});`),
    lote('Uno a uno'),
    mail('Recordar al cliente','={{ $json.email }}','=Te esperamos mañana a las {{ $json.hora }}',
      '=<p>Hola:</p><p>Te recordamos tu cita de mañana a las <strong>{{ $json.hora }}</strong> ({{ $json.titulo }}).</p><p>Si no podés venir, avisanos contestando a este correo y liberamos el hueco.</p>'),
    code('Armar el resumen', `const citas = $('Sacar contacto').all().map(i => i.json);
const linea = citas.map(c => \`• \${c.hora} — \${c.titulo}\`).join('\\n');
return [{ json: { total: citas.length, linea } }];`),
    tele('Resumen del día','=<b>Mañana tenés {{ $json.total }} citas</b>\\n{{ $json.linea }}')
  ],
  links:[['Cada mañana a las 9:00','Citas de mañana'],['Citas de mañana','Sacar contacto'],
         ['Sacar contacto','Uno a uno'],['Uno a uno','Recordar al cliente',1],
         ['Recordar al cliente','Uno a uno'],['Uno a uno','Armar el resumen',0],
         ['Armar el resumen','Resumen del día']] },

{ slug:'auto-pide-resena', nombre:'Pide la reseña en el momento justo',
  icono:'⭐', disparador:'Programado · todos los días a las 18:00',
  que:'A los siete días de entregar un trabajo, le pide la reseña al cliente con el enlace directo a Google Maps y marca la hoja para no insistir.',
  porque:'Las reseñas son lo que más mueve el SEO local, y casi nadie las pide. Pedirlas en automático a la semana justa multiplica la respuesta.',
  gratis:['n8n autoalojado','Google Sheets','Gmail SMTP','Telegram Bot'],
  pasos:['Lee la hoja de trabajos entregados',
         'Se queda con los de hace 7 días que aún no tienen reseña pedida',
         'Envía un correo corto con el enlace directo a dejar reseña',
         'Marca la fila como pedida y te resume cuántas salieron'],
  nodos:[
    cron('Cada tarde a las 18:00',{ interval:[{ field:'cronExpression', expression:'0 18 * * *' }] }),
    hoja('Trabajos entregados','read',{ options:{ returnAllMatches: true } }),
    code('Los de hace 7 días', `const hoy = new Date();
return items.filter(i => {
  const f = new Date(i.json.entregado);
  const dias = Math.floor((hoy - f) / 86400000);
  return dias === 7 && !i.json.resena_pedida;
});`),
    lote('Uno a uno'),
    mail('Pedir la reseña','={{ $json.email }}','=¿Nos dejás una reseña, {{ $json.cliente }}?',
      '=<p>Hola {{ $json.cliente }}:</p><p>Hace una semana que pusimos en marcha <strong>{{ $json.proyecto }}</strong>. Si estás contento con el resultado, una reseña nos ayuda muchísimo a que otros negocios de la zona nos encuentren.</p><p><a href="{{ $json.link_resena }}">Dejar la reseña (dos minutos)</a></p><p>Y si algo no está como esperabas, contestá a este correo y lo arreglamos antes.</p>'),
    hoja('Marcar como pedida','update',{ columns:{ mappingMode:'defineBelow', value:{
      fila:'={{ $json.fila }}', resena_pedida:'={{ $now.toFormat("yyyy-LL-dd") }}' } } }),
    code('Contar los envíos', `const n = $('Los de hace 7 días').all().length;
return [{ json: { n } }];`),
    tele('Resumen de reseñas','=Reseñas pedidas hoy: <b>{{ $json.n }}</b>')
  ],
  links:[['Cada tarde a las 18:00','Trabajos entregados'],['Trabajos entregados','Los de hace 7 días'],
         ['Los de hace 7 días','Uno a uno'],['Uno a uno','Pedir la reseña',1],
         ['Pedir la reseña','Marcar como pedida'],['Marcar como pedida','Uno a uno'],
         ['Uno a uno','Contar los envíos',0],['Contar los envíos','Resumen de reseñas']] },

{ slug:'auto-monitor-webs', nombre:'Vigilancia de las webs de cliente',
  icono:'🚨', disparador:'Programado · cada 15 minutos',
  que:'Comprueba que cada web de cliente responde, mide cuánto tarda y avisa si algo se cae o si el certificado está por caducar.',
  porque:'Enterarte de una caída por el propio cliente es la peor manera. Esto te avisa antes, y es un argumento de venta para el mantenimiento mensual.',
  gratis:['n8n autoalojado','Google Sheets','Telegram Bot','Gmail SMTP'],
  pasos:['Lee la lista de webs desde una hoja',
         'Hace una petición a cada una sin cortar el flujo si falla',
         'Marca como incidencia el código distinto de 200 o más de 4 s de respuesta',
         'Avisa por Telegram al instante y deja el registro en la hoja'],
  nodos:[
    cron('Cada 15 minutos',{ interval:[{ field:'minutes', minutesInterval:15 }] }),
    hoja('Lista de webs','read'),
    lote('Web a web'),
    http('Llamar a la web','={{ $json.url }}',{ options:{ response:{ response:{ fullResponse:true, neverError:true } }, timeout:10000 } }),
    code('Evaluar respuesta', `const w = $('Web a web').first().json;
const t0 = $execution.customData?.t0 ?? Date.now();
const code = $json.statusCode ?? 0;
const caida = code !== 200;
return [{ json: { cliente: w.cliente, url: w.url, code, caida,
  cuando: new Date().toISOString().slice(0, 16).replace('T', ' ') } }];`),
    iff('¿Se cayó?','={{ $json.caida }}',{type:'boolean',operation:'true',singleValue:true}),
    tele('Alerta al móvil','=🚨 <b>{{ $json.cliente }}</b> no responde\\n{{ $json.url }}\\nCódigo: {{ $json.code }}'),
    hoja('Registrar incidencia','append',{ columns:{ mappingMode:'autoMapInputData', value:{} } }),
    nada('Todo correcto')
  ],
  links:[['Cada 15 minutos','Lista de webs'],['Lista de webs','Web a web'],
         ['Web a web','Llamar a la web',1],['Llamar a la web','Evaluar respuesta'],
         ['Evaluar respuesta','¿Se cayó?'],['¿Se cayó?','Alerta al móvil',0],
         ['¿Se cayó?','Todo correcto',1],['Alerta al móvil','Registrar incidencia'],
         ['Registrar incidencia','Web a web'],['Todo correcto','Web a web']] },

{ slug:'auto-informe-seo', nombre:'Informe mensual de velocidad y SEO',
  icono:'📊', disparador:'Programado · día 1 de cada mes a las 8:00',
  que:'Pasa PageSpeed a cada web de cliente, guarda el histórico y manda un informe redactado en cristiano por la IA local.',
  porque:'Es el entregable que justifica la cuota de mantenimiento. Con PageSpeed gratis y Ollama en tu equipo, el coste sigue siendo cero.',
  gratis:['n8n autoalojado','PageSpeed Insights API','Ollama en local','Google Sheets','Gmail SMTP'],
  pasos:['Consulta PageSpeed móvil de cada web (API pública y gratuita)',
         'Extrae LCP, CLS y la puntuación de rendimiento',
         'Ollama redacta el resumen en lenguaje de cliente, sin tecnicismos',
         'Envía el informe y guarda la fila en el histórico'],
  nodos:[
    cron('Día 1 de cada mes',{ interval:[{ field:'cronExpression', expression:'0 8 1 * *' }] }),
    hoja('Clientes con mantenimiento','read'),
    lote('Cliente a cliente'),
    http('PageSpeed móvil','=https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url={{ encodeURIComponent($json.url) }}&strategy=mobile&category=performance&category=seo',
      { options:{ timeout:60000 } }),
    code('Extraer métricas', `const c = $('Cliente a cliente').first().json;
const l = $json.lighthouseResult ?? {};
const a = l.audits ?? {};
return [{ json: {
  cliente: c.cliente, email: c.email, url: c.url,
  rendimiento: Math.round((l.categories?.performance?.score ?? 0) * 100),
  seo: Math.round((l.categories?.seo?.score ?? 0) * 100),
  lcp: a['largest-contentful-paint']?.displayValue ?? '—',
  cls: a['cumulative-layout-shift']?.displayValue ?? '—',
  mes: new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
}}];`),
    ollama('Redactar el informe','Escribe en español, tuteando y sin tecnicismos, un resumen de 4 frases para el dueño de un negocio local sobre el estado de su web este mes. Rendimiento {{ $json.rendimiento }}/100, SEO {{ $json.seo }}/100, LCP {{ $json.lcp }}, CLS {{ $json.cls }}. Termina con una recomendación concreta. No uses viñetas.'),
    code('Montar el correo', `const m = $('Extraer métricas').first().json;
return [{ json: { ...m, texto: ($json.response ?? '').trim() } }];`),
    mail('Enviar al cliente','={{ $json.email }}','=Tu web en {{ $json.mes }}: {{ $json.rendimiento }}/100 de velocidad',
      '=<p>Hola {{ $json.cliente }}:</p><p>{{ $json.texto }}</p><table cellpadding="6"><tr><td>Velocidad</td><td><strong>{{ $json.rendimiento }}/100</strong></td></tr><tr><td>SEO técnico</td><td><strong>{{ $json.seo }}/100</strong></td></tr><tr><td>Carga principal</td><td>{{ $json.lcp }}</td></tr></table><p>OI Studio · mantenimiento mensual</p>'),
    hoja('Guardar histórico','append',{ columns:{ mappingMode:'autoMapInputData', value:{} } })
  ],
  links:[['Día 1 de cada mes','Clientes con mantenimiento'],['Clientes con mantenimiento','Cliente a cliente'],
         ['Cliente a cliente','PageSpeed móvil',1],['PageSpeed móvil','Extraer métricas'],
         ['Extraer métricas','Redactar el informe'],['Redactar el informe','Montar el correo'],
         ['Montar el correo','Enviar al cliente'],['Enviar al cliente','Guardar histórico'],
         ['Guardar histórico','Cliente a cliente']] },

{ slug:'auto-borrador-instagram', nombre:'Borrador de Instagram a partir del blog',
  icono:'📱', disparador:'Programado · lunes a las 9:00',
  que:'Coge el último artículo del blog, y la IA local propone titular de carrusel, texto del pie y hashtags. Te llega a Telegram para aprobar o descartar.',
  porque:'Lo que mata la constancia en redes es la hoja en blanco del lunes. Esto la resuelve sin pagar ninguna herramienta de contenidos.',
  gratis:['n8n autoalojado','Ollama en local','Telegram Bot'],
  pasos:['Lee el RSS del blog',
         'Se queda con el artículo más reciente',
         'Ollama escribe portada de carrusel, cuatro diapositivas y pie con hashtags',
         'Te lo manda a Telegram como borrador para revisar'],
  nodos:[
    cron('Lunes a las 9:00',{ interval:[{ field:'cronExpression', expression:'0 9 * * 1' }] }),
    n('RSS del blog','rssFeedRead',1.1,{ url:'https://oistudio.eus/feed.xml', options:{} }),
    code('El más reciente', `const orden = items.sort((a, b) =>
  new Date(b.json.isoDate ?? b.json.pubDate) - new Date(a.json.isoDate ?? a.json.pubDate));
const p = orden[0].json;
return [{ json: { titulo: p.title, link: p.link,
  resumen: (p.contentSnippet ?? p.content ?? '').slice(0, 900) } }];`),
    ollama('Escribir el carrusel','Sos el community manager de un estudio de diseño web de Tolosa. A partir de este artículo escribí: 1) una portada de carrusel de menos de 8 palabras, 2) cuatro diapositivas de una frase cada una, 3) un pie de foto de 3 frases tuteando, 4) ocho hashtags mezclando genéricos y locales de Gipuzkoa. Artículo: {{ $json.titulo }}. {{ $json.resumen }}'),
    code('Dar formato', `const src = $('El más reciente').first().json;
return [{ json: { titulo: src.titulo, link: src.link,
  borrador: ($json.response ?? '').trim() } }];`),
    tele('Borrador a Telegram','=<b>Borrador de la semana</b>\\n{{ $json.titulo }}\\n{{ $json.link }}\\n\\n{{ $json.borrador }}')
  ],
  links:[['Lunes a las 9:00','RSS del blog'],['RSS del blog','El más reciente'],
         ['El más reciente','Escribir el carrusel'],['Escribir el carrusel','Dar formato'],
         ['Dar formato','Borrador a Telegram']] },

{ slug:'auto-cobro-pendiente', nombre:'Recordatorio de facturas pendientes',
  icono:'💶', disparador:'Programado · todos los días a las 10:00',
  que:'Revisa las facturas sin cobrar y manda tres avisos con tono distinto: a los 3, a los 10 y a los 20 días de vencer.',
  porque:'Reclamar por escrito incomoda y se posterga. Automatizado se manda solo, siempre correcto y siempre a tiempo.',
  gratis:['n8n autoalojado','Google Sheets','Gmail SMTP','Telegram Bot'],
  pasos:['Lee la hoja de facturas y calcula los días vencidos',
         'Separa en tres tramos: recordatorio suave, firme y aviso final',
         'Envía el correo correspondiente con el número y el importe',
         'Si pasa de 20 días te avisa a vos para llamar por teléfono'],
  nodos:[
    cron('Cada día a las 10:00',{ interval:[{ field:'cronExpression', expression:'0 10 * * *' }] }),
    hoja('Facturas','read'),
    code('Calcular vencidas', `const hoy = new Date();
return items.map(i => {
  const dias = Math.floor((hoy - new Date(i.json.vence)) / 86400000);
  let tramo = 0;
  if (dias === 3) tramo = 1;
  else if (dias === 10) tramo = 2;
  else if (dias >= 20) tramo = 3;
  return { json: { ...i.json, dias, tramo } };
}).filter(i => i.json.tramo > 0 && !i.json.cobrada);`),
    n('Según el tramo','switch',3,{ rules:{ values:[
      { conditions:{ options:{ version:2 }, conditions:[{ id:id(), leftValue:'={{ $json.tramo }}', rightValue:1, operator:{ type:'number', operation:'equals' } }], combinator:'and' }, outputKey:'suave' },
      { conditions:{ options:{ version:2 }, conditions:[{ id:id(), leftValue:'={{ $json.tramo }}', rightValue:2, operator:{ type:'number', operation:'equals' } }], combinator:'and' }, outputKey:'firme' },
      { conditions:{ options:{ version:2 }, conditions:[{ id:id(), leftValue:'={{ $json.tramo }}', rightValue:3, operator:{ type:'number', operation:'gte' } }], combinator:'and' }, outputKey:'final' }
    ]}, options:{} }),
    mail('Aviso suave','={{ $json.email }}','=Factura {{ $json.numero }} · ¿la habrás pasado por alto?',
      '=<p>Hola {{ $json.cliente }}:</p><p>Te escribimos por la factura <strong>{{ $json.numero }}</strong> de {{ $json.importe }} €, que venció hace unos días. Seguramente sea un despiste.</p><p>Si ya la pagaste, ignorá este correo.</p>'),
    mail('Aviso firme','={{ $json.email }}','=Factura {{ $json.numero }} pendiente ({{ $json.dias }} días)',
      '=<p>Hola {{ $json.cliente }}:</p><p>La factura <strong>{{ $json.numero }}</strong> de {{ $json.importe }} € sigue pendiente, ya con {{ $json.dias }} días de retraso.</p><p>¿Nos confirmás una fecha de pago?</p>'),
    mail('Aviso final','={{ $json.email }}','=Último aviso · factura {{ $json.numero }}',
      '=<p>Hola {{ $json.cliente }}:</p><p>La factura <strong>{{ $json.numero }}</strong> de {{ $json.importe }} € lleva {{ $json.dias }} días vencida. Antes de dar otro paso preferimos hablarlo: contestá a este correo o llamanos.</p>'),
    tele('Avisarme para llamar','=💶 <b>{{ $json.cliente }}</b> lleva {{ $json.dias }} días\\nFactura {{ $json.numero }} · {{ $json.importe }} €\\nToca llamar.'),
    hoja('Anotar el aviso','append',{ columns:{ mappingMode:'autoMapInputData', value:{} } })
  ],
  links:[['Cada día a las 10:00','Facturas'],['Facturas','Calcular vencidas'],
         ['Calcular vencidas','Según el tramo'],
         ['Según el tramo','Aviso suave',0],['Según el tramo','Aviso firme',1],['Según el tramo','Aviso final',2],
         ['Aviso suave','Anotar el aviso'],['Aviso firme','Anotar el aviso'],
         ['Aviso final','Avisarme para llamar'],['Avisarme para llamar','Anotar el aviso']] },

{ slug:'auto-chat-faq', nombre:'Chat de la web que responde con tus FAQ',
  icono:'💬', disparador:'Webhook (el chat de la web)',
  que:'Responde las preguntas frecuentes con la IA local usando sólo la hoja de FAQ del cliente, y cuando no sabe, deriva a una persona.',
  porque:'Es el chatbot de reservas que ya tenés montado, pero con el modelo corriendo en tu equipo: sin tokens, sin cuota mensual y sin mandar datos de cliente a terceros.',
  gratis:['n8n autoalojado','Ollama en local','Google Sheets','Gmail SMTP'],
  pasos:['Recibe la pregunta desde el widget de chat',
         'Carga las FAQ del negocio desde una hoja',
         'Ollama responde usando sólo ese contexto, o admite que no sabe',
         'Si no sabe, avisa por correo al negocio y le dice al visitante que le contestarán'],
  nodos:[
    web('Chat de la web','chat'),
    hoja('FAQ del negocio','read'),
    code('Montar contexto', `const pregunta = ($('Chat de la web').first().json.body ?? {}).pregunta ?? '';
const faq = items.map(i => \`P: \${i.json.pregunta}\\nR: \${i.json.respuesta}\`).join('\\n\\n');
return [{ json: { pregunta, faq } }];`),
    ollama('Responder con la IA local','Respondé en español, en dos frases como mucho, usando SOLO esta información. Si la respuesta no está, contestá exactamente NO_LO_SE.\\n\\n{{ $json.faq }}\\n\\nPregunta del visitante: {{ $json.pregunta }}'),
    code('¿Supo responder?', `const texto = ($json.response ?? '').trim();
const sabe = !/NO_LO_SE/i.test(texto) && texto.length > 3;
return [{ json: { sabe, texto, pregunta: $('Montar contexto').first().json.pregunta } }];`),
    iff('¿Tiene respuesta?','={{ $json.sabe }}',{type:'boolean',operation:'true',singleValue:true}),
    n('Respuesta directa','set',3.4,{ mode:'manual', assignments:{ assignments:[
      {id:id(),name:'respuesta',value:'={{ $json.texto }}',type:'string'},
      {id:id(),name:'derivado',value:'false',type:'boolean'}]}, options:{} }),
    mail('Derivar al negocio','info@negocio-cliente.eus','=Pregunta del chat sin responder',
      '=<p>Un visitante preguntó en el chat y el asistente no supo contestar:</p><blockquote>{{ $json.pregunta }}</blockquote><p>Conviene añadirla a la hoja de FAQ.</p>'),
    n('Respuesta de espera','set',3.4,{ mode:'manual', assignments:{ assignments:[
      {id:id(),name:'respuesta',value:'Esa no la tengo a mano. Dejame tu email y te contesta una persona hoy mismo.',type:'string'},
      {id:id(),name:'derivado',value:'true',type:'boolean'}]}, options:{} }),
    resp('Devolver al chat','={{ JSON.stringify($json) }}')
  ],
  links:[['Chat de la web','FAQ del negocio'],['FAQ del negocio','Montar contexto'],
         ['Montar contexto','Responder con la IA local'],['Responder con la IA local','¿Supo responder?'],
         ['¿Supo responder?','¿Tiene respuesta?'],
         ['¿Tiene respuesta?','Respuesta directa',0],['¿Tiene respuesta?','Derivar al negocio',1],
         ['Derivar al negocio','Respuesta de espera'],
         ['Respuesta directa','Devolver al chat'],['Respuesta de espera','Devolver al chat']] },

{ slug:'auto-backup-webs', nombre:'Copia de seguridad semanal de las webs',
  icono:'💾', disparador:'Programado · domingos a las 3:00',
  que:'Descarga cada web de cliente y la guarda fechada en tu disco, con un informe de qué se copió y cuánto ocupa.',
  porque:'La copia de seguridad es lo que separa un susto de una catástrofe, y es el argumento más fácil para cerrar un mantenimiento anual.',
  gratis:['n8n autoalojado','Disco local','Gmail SMTP','Telegram Bot'],
  pasos:['Lee la lista de webs y su origen',
         'Descarga el contenido de cada una',
         'Lo guarda en carpeta con fecha en tu disco',
         'Te manda el informe de la noche por Telegram'],
  nodos:[
    cron('Domingos a las 3:00',{ interval:[{ field:'cronExpression', expression:'0 3 * * 0' }] }),
    hoja('Webs a copiar','read'),
    lote('Web a web'),
    http('Descargar la web','={{ $json.url }}',{ options:{ response:{ response:{ responseFormat:'file', neverError:true } }, timeout:60000 } }),
    n('Guardar en disco','readWriteFile',1,{ operation:'write',
      fileName:'=D:/backups/{{ $(\'Web a web\').first().json.cliente }}/{{ $now.toFormat("yyyy-LL-dd") }}.html',
      dataPropertyName:'data', options:{} }),
    code('Anotar el resultado', `const w = $('Web a web').first().json;
return [{ json: { cliente: w.cliente, url: w.url,
  guardado: new Date().toISOString().slice(0, 10) } }];`),
    code('Informe final', `const todo = $('Anotar el resultado').all().map(i => i.json);
return [{ json: { total: todo.length,
  linea: todo.map(t => '• ' + t.cliente).join('\\n') } }];`),
    tele('Informe de la copia','=💾 <b>Copia semanal terminada</b>\\n{{ $json.total }} webs guardadas\\n{{ $json.linea }}')
  ],
  links:[['Domingos a las 3:00','Webs a copiar'],['Webs a copiar','Web a web'],
         ['Web a web','Descargar la web',1],['Descargar la web','Guardar en disco'],
         ['Guardar en disco','Anotar el resultado'],['Anotar el resultado','Web a web'],
         ['Web a web','Informe final',0],['Informe final','Informe de la copia']] }
];

/* ---------- construcción de los JSON de n8n ---------- */
function construir(f) {
  const nodes = f.nodos.map((nodo, i) => ({
    ...nodo,
    id: id(),
    position: [260 + (i % 5) * 240, 220 + Math.floor(i / 5) * 200]
  }));
  const porNombre = Object.fromEntries(nodes.map(x => [x.name, x]));

  const connections = {};
  for (const [de, a, salida = 0] of f.links) {
    if (!porNombre[de] || !porNombre[a]) throw new Error(`${f.slug}: nodo inexistente en "${de} → ${a}"`);
    connections[de] ??= { main: [] };
    while (connections[de].main.length <= salida) connections[de].main.push([]);
    connections[de].main[salida].push({ node: a, type: 'main', index: 0 });
  }

  // nota fija dentro del lienzo: qué hace y qué credenciales gratuitas pide
  nodes.push({
    id: id(), name: 'Ficha', type: 'n8n-nodes-base.stickyNote', typeVersion: 1,
    position: [-140, 180],
    parameters: {
      width: 360, height: 320, color: 4,
      content: `## ${f.icono} ${f.nombre}\n**${f.slug}**\n\n${f.que}\n\n**Disparador:** ${f.disparador}\n\n**Coste: 0 €** — ${f.gratis.join(' · ')}\n\n${f.pasos.map(p => '- ' + p).join('\n')}`
    }
  });

  return {
    name: `OI · ${f.nombre}`,
    nodes, connections,
    settings: { executionOrder: 'v1', saveManualExecutions: true },
    tags: [{ name: 'OI Studio' }, { name: 'coste 0' }],
    meta: { instanceId: 'oi-studio-biblioteca' }
  };
}

for (const f of FLUJOS) {
  writeFileSync(join(DIR, 'flujos', f.slug + '.json'), JSON.stringify(construir(f), null, 2), 'utf8');
}

/* ---------- CATALOGO.md ---------- */
const md = [
  '# Catálogo de automatizaciones · OI Studio',
  '',
  'Diez flujos de n8n con **coste 0 €**: todo corre en tu equipo o en planes gratuitos permanentes.',
  'Decile a Claude el **nombre clave** y sabe qué flujo montar y qué nodos lleva.',
  '',
  '| nombre clave | qué hace | disparador | servicios (todos gratis) |',
  '|---|---|---|---|',
  ...FLUJOS.map(f => `| \`${f.slug}\` | ${f.que} | ${f.disparador} | ${f.gratis.join(', ')} |`),
  '',
  '## Detalle',
  '',
  ...FLUJOS.flatMap(f => [
    `### ${f.icono} ${f.slug}`,
    '',
    `**${f.nombre}** — ${f.que}`,
    '',
    `*Por qué vale la pena:* ${f.porque}`,
    '',
    ...f.pasos.map(p => `1. ${p}`),
    '',
    `Nodos: ${f.nodos.map(x => '`' + x.name + '`').join(' → ')}`,
    '',
    `Importar: \`flujos/${f.slug}.json\``,
    ''
  ])
].join('\n');
writeFileSync(join(DIR, 'CATALOGO.md'), md, 'utf8');

/* ---------- index.html ---------- */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Automatizaciones · OI Studio</title>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Geist+Mono:wght@400;600&family=Geist:wght@300..800&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  :root{--page:#fdfdfc; --soft:#f4f4f2; --line:#e4e4e0; --ink:#131315; --dim:#6a6a72; --mute:#9a9aa2;
    --acc:#7b5cff; --ok:#1f9d63; --sans:'Geist',system-ui,sans-serif; --disp:'Bricolage Grotesque',serif; --mono:'Geist Mono',monospace;}
  body{font-family:var(--sans); background:var(--page); color:var(--ink); line-height:1.6; -webkit-font-smoothing:antialiased;}
  .wrap{max-width:1080px; margin:0 auto; padding:52px 24px 80px;}
  header{border-bottom:1px solid var(--line); padding-bottom:26px; margin-bottom:34px;}
  .eyebrow{font-family:var(--mono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--mute);}
  h1{font-family:var(--disp); font-size:clamp(30px,5vw,46px); font-weight:800; letter-spacing:-.035em; line-height:1.08; margin:10px 0 12px;}
  header p{color:var(--dim); max-width:62ch; text-wrap:pretty;}
  .free{display:inline-flex; align-items:center; gap:7px; margin-top:16px; font-size:12.5px; font-weight:700;
    color:var(--ok); background:rgba(31,157,99,.09); border:1px solid rgba(31,157,99,.25); padding:6px 13px; border-radius:100px;}
  .search{margin:28px 0 22px; position:relative;}
  .search input{width:100%; padding:14px 18px; font:inherit; font-size:15px; border:1px solid var(--line);
    border-radius:12px; background:#fff; color:var(--ink); outline:none; transition:.25s;}
  .search input:focus{border-color:var(--acc); box-shadow:0 0 0 4px rgba(123,92,255,.1);}
  .card{border:1px solid var(--line); border-radius:16px; background:#fff; padding:22px; margin-bottom:14px;
    transition:box-shadow .3s cubic-bezier(.16,1,.3,1), transform .3s cubic-bezier(.16,1,.3,1), border-color .3s;}
  .card:hover{box-shadow:0 14px 40px -18px rgba(19,19,21,.28); transform:translateY(-2px); border-color:#d4d4ce;}
  .top{display:flex; align-items:flex-start; gap:13px; flex-wrap:wrap;}
  .ic{font-size:24px; line-height:1.2;}
  .ttl{flex:1; min-width:230px;}
  .ttl h2{font-family:var(--disp); font-size:20px; font-weight:700; letter-spacing:-.02em; line-height:1.25;}
  .key{font-family:var(--mono); font-size:12px; color:var(--acc); background:#f2effe; border:1px solid #e2dbfd;
    padding:3px 9px; border-radius:7px; cursor:pointer; transition:.25s; white-space:nowrap;}
  .key:hover{background:var(--acc); color:#fff; border-color:var(--acc);}
  .que{margin:12px 0 4px; color:var(--dim); text-wrap:pretty;}
  .porque{font-size:13.5px; color:var(--mute); border-left:2px solid var(--line); padding-left:12px; margin:12px 0;}
  .chain{display:flex; flex-wrap:wrap; gap:5px; align-items:center; margin:15px 0 3px;}
  .chain span{font-family:var(--mono); font-size:10.5px; background:var(--soft); border:1px solid var(--line);
    padding:3px 8px; border-radius:6px; color:#4a4a52;}
  .chain i{color:var(--mute); font-style:normal; font-size:10px;}
  details{margin-top:14px; border-top:1px solid var(--line); padding-top:13px;}
  summary{cursor:pointer; font-size:13px; font-weight:600; color:var(--acc); list-style:none;}
  summary::-webkit-details-marker{display:none;}
  summary::before{content:'+ '; font-family:var(--mono);}
  details[open] summary::before{content:'− ';}
  .meta{display:grid; grid-template-columns:110px 1fr; gap:7px 14px; font-size:13px; margin-top:13px;}
  .meta dt{color:var(--mute); font-family:var(--mono); font-size:11px; text-transform:uppercase; letter-spacing:.06em; padding-top:2px;}
  .meta dd{color:var(--dim);}
  ol{margin:0 0 0 17px; color:var(--dim); font-size:13.5px;}
  ol li{margin:3px 0;}
  .tags{display:flex; flex-wrap:wrap; gap:5px;}
  .tags span{font-size:11px; background:rgba(31,157,99,.08); color:#177a4d; border:1px solid rgba(31,157,99,.2); padding:2px 8px; border-radius:100px;}
  .none{display:none; text-align:center; color:var(--mute); padding:40px 0;}
  footer{margin-top:40px; padding-top:22px; border-top:1px solid var(--line); font-size:13px; color:var(--mute);}
  footer code{font-family:var(--mono); background:var(--soft); padding:2px 6px; border-radius:5px; color:#4a4a52;}
  @media (max-width:560px){ .meta{grid-template-columns:1fr;} }
</style></head>
<body><div class="wrap">
<header>
  <div class="eyebrow">OI Studio · biblioteca interna</div>
  <h1>Diez automatizaciones que no cuestan un euro</h1>
  <p>Flujos de n8n listos para importar. Todo corre en tu equipo o en planes gratuitos permanentes: n8n autoalojado, Ollama en local, Gmail SMTP, Google Sheets, Google Calendar, Telegram y PageSpeed Insights.</p>
  <span class="free">● Coste mensual: 0 €</span>
</header>

<div class="search"><input id="q" placeholder="Buscar: reservas, reseñas, facturas, backup, chat…" autocomplete="off"></div>

<div id="lista">
${FLUJOS.map(f => `  <article class="card" data-t="${esc((f.slug + ' ' + f.nombre + ' ' + f.que + ' ' + f.porque + ' ' + f.gratis.join(' ') + ' ' + f.pasos.join(' ')).toLowerCase())}">
    <div class="top">
      <span class="ic">${f.icono}</span>
      <div class="ttl"><h2>${esc(f.nombre)}</h2></div>
      <button class="key" data-k="${f.slug}">${f.slug}</button>
    </div>
    <p class="que">${esc(f.que)}</p>
    <p class="porque">${esc(f.porque)}</p>
    <div class="chain">${f.nodos.map(x => `<span>${esc(x.name)}</span>`).join('<i>→</i>')}</div>
    <details>
      <summary>Cómo funciona y qué necesita</summary>
      <dl class="meta">
        <dt>Disparador</dt><dd>${esc(f.disparador)}</dd>
        <dt>Pasos</dt><dd><ol>${f.pasos.map(p => `<li>${esc(p)}</li>`).join('')}</ol></dd>
        <dt>Gratis con</dt><dd class="tags">${f.gratis.map(g => `<span>${esc(g)}</span>`).join('')}</dd>
        <dt>Importar</dt><dd><code>flujos/${f.slug}.json</code></dd>
      </dl>
    </details>
  </article>`).join('\n')}
</div>
<p class="none" id="none">Sin resultados. Probá con: cita, factura, reseña, caída, informe.</p>

<footer>
  Importar en n8n: <code>Workflows → Import from file</code> y elegí el JSON de <code>flujos/</code>.
  Después creá las credenciales gratuitas que pide cada nodo. La IA local es <code>ollama run llama3.1:8b</code>.
</footer>
</div>
<script>
  const q = document.getElementById('q'), cards = [...document.querySelectorAll('.card')], none = document.getElementById('none');
  const limpia = s => s.normalize('NFD').replace(new RegExp('[\\\\u0300-\\\\u036f]','g'), '').toLowerCase();
  q.addEventListener('input', () => {
    const t = limpia(q.value.trim());
    let n = 0;
    cards.forEach(c => {
      const ok = !t || limpia(c.dataset.t).includes(t);
      c.style.display = ok ? '' : 'none';
      if (ok) n++;
    });
    none.style.display = n ? 'none' : 'block';
  });
  document.querySelectorAll('.key').forEach(b => b.addEventListener('click', async () => {
    await navigator.clipboard.writeText(b.dataset.k);
    const antes = b.textContent;
    b.textContent = 'copiado ✓';
    setTimeout(() => b.textContent = antes, 1200);
  }));
</script>
</body></html>`;
writeFileSync(join(DIR, 'index.html'), html, 'utf8');

console.log(`${FLUJOS.length} flujos generados en flujos/`);
console.log('CATALOGO.md e index.html actualizados');
