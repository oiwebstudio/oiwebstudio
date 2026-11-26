/**
 * Agentes de IA (22/11/2026). Oier: «trabaja para que nos posicionemos como expertos en IA, agentes, etc.».
 * Plan: _local/negocio/marketing/ia-gipuzkoa/PLAN-EXPERTOS-IA.md.
 *
 * Se publican el 29/11/2026 (campo `publicar`): la semana del 22 al 28/11 es de asentamiento del SEO y no se
 * toca web/. Antes de esa fecha gen-articulos-nuevos.mjs las ignora; con --borrador las genera para verlas.
 *
 * Reglas: solo lo que existe (el asistente de la web, el bot y los agentes del estudio son reales; ningún
 * cliente tiene todavía un agente); qué hace la IA y qué hago yo; aviso del art. 50; precios de TARIFA.md
 * (lo hecho a medida, «precio en 24 horas»); sin cifras sin fuente; sin nombrar competidores ni clientes.
 */
import { consejo, cta, tabla } from "./gen-articulos-nacionales.mjs";

const FECHA = "2026-11-22";
const FRASE = "Ofrecemos soluciones de IA adaptadas a cada empresa.";
const PROBAR = `<a href="#probar" onclick="if(window.OIAsistente){window.OIAsistente.abrir();return false;}">«Habla con la IA»</a>`;

export const ARTICULOS_AGENTES = [
/* ------------------------------------------------------------------ 1 · agentes */
{
  slug: "agentes-ia-empresas-gipuzkoa",
  fecha: FECHA, publicar: FECHA, asistente: true, globo: true,
  bodyClass: "ia-pg",
  title: "Agentes de IA para empresas en Gipuzkoa: cuándo compensan",
  headline: "Agentes de IA para empresas en Gipuzkoa: qué son, cuándo compensan y cuánto cuestan",
  desc: "Qué es un agente de IA, en qué se diferencia de un chatbot, cuáles compensan en un negocio pequeño, cuánto cuestan y qué dice la ley. Con uno para probar.",
  ogdesc: "Qué es un agente de IA, cuáles compensan en un negocio pequeño de Gipuzkoa y cuáles no, cuánto cuestan y qué dice la ley. Con uno para probar.",
  keywords: "agentes de ia, agentes ia empresas gipuzkoa, agente de inteligencia artificial, chatbot con ia para empresas, asistente ia web, agentes ia donostia, consultor ia gipuzkoa",
  crumb: "Agentes de IA para empresas",
  h1: "Agentes de IA para empresas en Gipuzkoa",
  lede: `${FRASE} Un agente de IA es un programa que hace tareas por ti, no solo contesta. Yo los uso cada día para llevar mi propio estudio, así que te cuento cuáles funcionan, cuáles no compensan y te dejo uno para probar.`,
  img: "stock/art-seo-local", min: 7,
  area: ["Gipuzkoa", "Donostia / San Sebastián", "Tolosaldea"],
  cuerpo: `
<h2 id="que-es">Qué es un agente de IA (y en qué se diferencia de un chatbot)</h2>
<p>Un <strong>chatbot</strong> contesta preguntas. Un <strong>agente</strong> además hace cosas: lee un correo, mira tu calendario, rellena una hoja, prepara una respuesta o avisa a una persona, siguiendo unas reglas que pones tú. La diferencia importa porque un agente toca tus datos y tus clientes: hay que decidir muy bien qué puede hacer solo y qué tiene que pasar por ti.</p>
${tabla(["", "Chatbot", "Agente de IA"], [
  ["Qué hace", "Contesta", "Contesta y hace tareas: leer, ordenar, preparar, avisar"],
  ["Con qué trabaja", "Lo que sabe de tu negocio", "Además, tus herramientas: correo, calendario, hojas, WhatsApp"],
  ["El riesgo", "Que conteste algo que no es verdad", "Que haga algo que no querías. Por eso, lo importante pasa por una persona"],
])}

<h2 id="probar">Pruébalo aquí: el asistente de esta web</h2>
<p>En esta misma web tienes uno funcionando: abre ${PROBAR} en el menú. Lo he montado yo y es el mismo motor que puedo poner en la web de tu negocio:</p>
<ul class="check">
<li><strong>Contesta con lo que dice la web</strong>, no con lo que se inventa: lee las páginas públicas y los precios salen solo de la página de precios.</li>
<li><strong>Dice que es una IA</strong> desde el primer mensaje.</li>
<li><strong>No guarda las conversaciones</strong> ni las direcciones IP.</li>
<li><strong>Si no sabe algo, te pasa a WhatsApp</strong> con el resumen de lo que has preguntado.</li>
<li>Funciona con un modelo abierto (Llama 3.3) dentro de Cloudflare, sin cuentas de terceros, y contesta en castellano o en euskera.</li>
</ul>
<p><button type="button" class="btn btn--accent" onclick="window.OIAsistente&&window.OIAsistente.abrir()">Habla con la IA</button></p>

<h2 id="los-mios">Los agentes que uso yo cada día</h2>
<div class="ia-cifras"><div><b data-cuenta="36">36</b><span>agentes de IA</span></div><div><b data-cuenta="11">11</b><span>departamentos</span></div><div><b data-cuenta="0">0</b><span>mensajes a clientes sin revisar</span></div></div>
<p>OI Studio funciona con <strong>36 agentes de IA repartidos en 11 departamentos</strong>: comercial, diseño, SEO, administración, posventa, seguridad… Uno busca negocios con la web vieja, otro revisa cada diseño antes de que lo vea nadie, otro mira el SEO cada mañana y hay uno por cada cliente en obra. Un bot de Telegram me transcribe los audios y los apunta donde toca.</p>
<p>La regla que no se salta: <strong>ningún agente manda nada a un cliente sin que yo lo vea y diga «sí»</strong>. Lo cuento entero, con lo que ha fallado, en <a href="como-funciona-oi-studio-agentes-ia.html">cómo funciona OI Studio con agentes de IA</a>.</p>

<h2 id="cuales">Cuáles compensan en un negocio pequeño</h2>
${tabla(["Agente", "Qué te quita", "Hoy"], [
  ["<strong>Asistente con IA en tu web</strong>", "Las mismas preguntas de siempre (horario, precios, cómo llegar), a cualquier hora", "Funciona: es el de esta web. Para la tuya, a medida"],
  ["<strong>Respuestas a reseñas</strong>", "Contestar cada opinión de Google con tu tono", "Funciona: la IA escribe el borrador y tú das el visto bueno"],
  ["<strong>Correos y presupuestos en borrador</strong>", "Escribir desde cero las mismas respuestas", "A medida: la IA prepara, tú revisas y mandas"],
  ["<strong>WhatsApp que contesta lo básico</strong>", "Contestar veinte veces el horario y los precios", "A medida, con el asistente que ya trae WhatsApp Business"],
  ["<strong>Teléfono que se atiende solo</strong>", "Las llamadas que no puedes coger", "A medida, con una recepcionista con IA de las que ya existen"],
  ["<strong>Papeleo</strong>", "Pasar facturas de gastos a una hoja para la gestoría", "A medida"],
])}
<p>«A medida» quiere decir que lo monto para tu caso con herramientas que ya existen, que se prueba contigo antes de pagar y que no lo tiene todavía ningún cliente mío.</p>

<h2 id="cuando-no">Cuándo NO compensa</h2>
<ul>
<li><strong>Si te preguntan poco.</strong> Con cinco mensajes a la semana, contéstalos tú.</li>
<li><strong>Si la tarea sale bien con reglas fijas.</strong> Las reservas, por ejemplo: un sistema normal no se equivoca de día ni de hora. Las mías funcionan sin IA.</li>
<li><strong>Con datos de salud</strong> o delicados: mejor que no pasen por una IA.</li>
<li><strong>Si nadie va a revisar lo que hace.</strong> Un agente sin supervisión acaba diciendo algo que no es verdad, y lo dice muy seguro.</li>
</ul>
${consejo("Empieza por lo que más se repite y menos riesgo tiene: las preguntas de siempre y las respuestas a reseñas. Cuando eso funcione, sube un escalón.")}

<h2 id="cuanto">Cuánto cuesta un agente de IA</h2>
<p>Depende de qué haga y de con qué herramienta, así que no te doy una cifra sin mirarlo: lo estudio y <strong>te digo el precio en 24 horas</strong>, y pagas al final, cuando funciona. Para que te hagas una idea de lo que pesa cada parte:</p>
<ul>
<li><strong>El modelo de IA.</strong> El asistente de esta web usa la capa gratis de Cloudflare, con un tope de mensajes al día; para la mayoría de negocios pequeños llega de sobra.</li>
<li><strong>Las herramientas de terceros.</strong> Una recepcionista telefónica con IA cuesta, según los propios proveedores, entre unos 29 y 99 € al mes con los minutos incluidos (lo pagas tú, a ellos). El asistente de WhatsApp Business, Meta lo cobra por uso.</li>
<li><strong>Montarlo y cuidarlo.</strong> Es lo que hago yo: entender tu negocio, darle tus datos, ponerle límites y revisar que conteste bien.</li>
</ul>

<h2 id="ley">Qué dice la ley</h2>
<p>El artículo 50 del Reglamento europeo de IA obliga a que quien habla con una IA sepa que no está hablando con una persona, salvo que resulte evidente. Por eso todo lo que monto lo dice desde el primer mensaje. Y si el agente trata datos de tus clientes, sigue valiendo la protección de datos: hay que saber quién los trata y contarlo en tu política de privacidad. No soy abogado: ante una duda concreta, pregunta a quien te lleve estos temas.</p>

<h2 id="como">Cómo trabajo</h2>
<ol>
<li><strong>Me cuentas qué te quita tiempo</strong>, por teléfono, por WhatsApp o en tu negocio.</li>
<li><strong>Te digo si un agente te compensa o no.</strong> Muchas veces la respuesta es que no, o que antes hay otra cosa.</li>
<li><strong>Precio cerrado en 24 horas</strong> y, si te encaja, lo monto.</li>
<li><strong>Se prueba contigo</strong> y pagas al final, cuando funciona.</li>
</ol>
${cta("¿Te compensaría un agente de IA?", "Cuéntame qué te quita tiempo y te digo, sin compromiso, si una IA te ayudaría y cuánto costaría.", "Escríbeme")}
`,
  faq: [
    ["¿Qué diferencia hay entre un chatbot y un agente de IA?", "Un chatbot contesta preguntas. Un agente, además, hace tareas con tus herramientas: leer un correo, ordenar datos, preparar una respuesta o avisar a una persona, siguiendo las reglas que le pones."],
    ["¿Mi negocio necesita un agente de IA?", "Casi nunca al principio. Compensa cuando hay una tarea que se repite mucho y tiene poco riesgo, como las preguntas de siempre o las respuestas a reseñas. Si te preguntan poco o la tarea sale bien con reglas fijas, no hace falta."],
    ["¿Cuánto cuesta un agente de IA?", "Depende de lo que haga y de con qué herramienta. Lo estudio y te digo el precio en 24 horas, y pagas al final, cuando funciona."],
    ["¿Puedo probar uno antes?", "Sí: el asistente de esta web es uno de verdad. Ábrelo con «Habla con la IA» en el menú; es el mismo motor que puedo poner en tu web."],
    ["¿El agente guarda las conversaciones de mis clientes?", "El asistente que monto yo no guarda conversaciones ni direcciones IP: solo cuenta cuántos mensajes hay al día para no pasarse del límite."],
    ["¿Hay que avisar de que es una IA?", "Sí. El artículo 50 del Reglamento europeo de IA obliga a avisar, salvo que resulte evidente. Todo lo que monto lo dice desde el primer mensaje."],
  ],
  cierre: `Sigue leyendo: <a href="como-funciona-oi-studio-agentes-ia.html">cómo funciona OI Studio con agentes de IA</a>, <a href="ia-para-negocios-gipuzkoa.html">IA y automatización para negocios en Gipuzkoa</a> e <a href="inteligencia-artificial-negocio-pequeno.html">inteligencia artificial para un negocio pequeño</a>.`,
},
/* ------------------------------------------------------------------ 2 · caso propio */
{
  slug: "como-funciona-oi-studio-agentes-ia",
  fecha: FECHA, publicar: FECHA, asistente: true, globo: true,
  bodyClass: "ia-pg",
  title: "Cómo funciona OI Studio con 36 agentes de IA",
  headline: "Cómo funciona OI Studio con 36 agentes de IA: qué hace la IA, qué hago yo y qué ha fallado",
  desc: "Mi estudio funciona con 36 agentes de IA en 11 departamentos. Qué hace cada uno, qué decido yo, qué ha fallado y qué te sirve de todo esto para tu negocio.",
  ogdesc: "36 agentes de IA en 11 departamentos: qué hace la IA, qué decido yo, qué ha fallado y qué te sirve para tu negocio.",
  keywords: "agentes de ia caso real, empresa con agentes de ia, como usar agentes de ia, automatizar negocio con ia, oi studio agentes",
  crumb: "OI Studio con agentes de IA",
  h1: "Cómo funciona OI Studio con agentes de IA",
  lede: "Llevo el estudio con 36 agentes de IA repartidos en 11 departamentos. Te cuento cómo está montado, qué hace la IA, qué decido yo y, sobre todo, qué ha fallado, porque es lo que más te sirve si estás pensando en usar IA en tu negocio.",
  img: "stock/art-seo-local", min: 6,
  area: ["Gipuzkoa"],
  cuerpo: `
<h2 id="por-que">Por qué lo monté así</h2>
<p>Hago webs y automatizaciones desde Tolosa con unas pocas horas al día. No me daba para buscar clientes, diseñar, mirar el SEO, llevar las cuentas y atender a quien ya tiene su web. En lugar de dejar cosas sin hacer, monté el estudio como una empresa con departamentos, y en cada departamento, agentes de IA con un trabajo concreto.</p>

<div class="ia-cifras"><div><b data-cuenta="36">36</b><span>agentes de IA</span></div><div><b data-cuenta="11">11</b><span>departamentos</span></div><div><b data-cuenta="0">0</b><span>mensajes a clientes sin revisar</span></div></div>

<h2 id="organigrama">El organigrama</h2>
${tabla(["Departamento", "Qué hacen sus agentes"], [
  ["Comercial", "Buscan negocios con la web vieja, preparan los mensajes, leen las respuestas y me dejan las llamadas de la tarde"],
  ["Diseño", "Buscan referencias, construyen la muestra, la revisan con criterio y pasan la auditoría técnica antes de que la vea nadie"],
  ["Clientes y posventa", "Un agente por cada web en obra; otro revisa que las webs entregadas sigan funcionando"],
  ["Marketing", "La web propia, el SEO de cada mañana e Instagram"],
  ["Administración", "Cuentas, presupuestos con la plantilla de siempre y plazos con la gestoría"],
  ["Sistemas y seguridad", "Dominios, servidores y una revisión de seguridad antes de publicar cualquier panel"],
  ["Estrategia", "Competencia, mercado y qué hacer las próximas semanas"],
])}
<p>Además hay tareas que corren solas (el SEO de cada mañana, el chequeo semanal de las webs entregadas, el resumen del viernes) y un bot de Telegram al que le mando audios y fotos: los transcribe y los apunta donde toca.</p>

<h2 id="quien-decide">Qué hace la IA y qué hago yo</h2>
<ul class="check">
<li><strong>La IA prepara:</strong> busca, redacta, diseña, revisa, mide y me avisa.</li>
<li><strong>Yo decido:</strong> precios, qué se publica y qué se manda. Ningún agente envía nada a un cliente sin que yo lo vea y diga «sí».</li>
<li><strong>Todo queda escrito:</strong> cada agente apunta lo que ha hecho en un diario común, así el siguiente sabe por dónde va la cosa.</li>
</ul>

<h2 id="fallos">Lo que ha fallado</h2>
<p>Esto es lo que no te cuenta quien solo vende IA:</p>
<ul>
<li><strong>El correo automático acabó en spam.</strong> Gmail empezó a marcarlo, incluso los correos cortos y personalizados. Lo paré.</li>
<li><strong>El WhatsApp automático no envió ni uno.</strong> El envío automático se bloqueaba, y además no está bien que un programa escriba solo a gente que no te conoce. Ahora el agente prepara los mensajes y los mando yo.</li>
<li><strong>Un freno automático saltó sin motivo.</strong> Paró los envíos dos días por unos rebotes que no existían. Desde entonces, cada alarma se comprueba antes de actuar.</li>
<li><strong>Un chat de reservas que no estaba a la altura.</strong> Lo retiré de la web y las reservas se quedaron sin IA, que es como mejor funcionan.</li>
</ul>
${consejo("La IA no se equivoca menos que una persona: se equivoca más rápido y con más seguridad. Ponle siempre a alguien que revise lo importante.")}

<h2 id="para-ti">Qué te sirve a ti de todo esto</h2>
<ol>
<li><strong>Empieza por una tarea</strong> que se repite mucho y tiene poco riesgo.</li>
<li><strong>Que la IA prepare y tú decidas</strong>, al menos al principio.</li>
<li><strong>Si sale bien con reglas fijas, sin IA.</strong> Es más barato y más fiable.</li>
<li><strong>Apúntalo todo:</strong> lo que no queda escrito, la IA no lo sabe la próxima vez.</li>
</ol>
<p>Es lo mismo que aplico cuando monto un agente para un negocio. Lo explico en <a href="agentes-ia-empresas-gipuzkoa.html">agentes de IA para empresas en Gipuzkoa</a>, y en esta web tienes uno para probar: ${PROBAR}.</p>
${cta("¿Quieres algo así para tu negocio, a tu medida?", "Cuéntame qué te quita tiempo y te digo qué parte haría la IA y cuánto costaría.", "Escríbeme")}
`,
  faq: [
    ["¿De verdad funciona el estudio con agentes de IA?", "Sí: 36 agentes en 11 departamentos, cada uno con un trabajo concreto. Preparan, revisan y avisan; las decisiones y lo que sale a los clientes pasan por mí."],
    ["¿Qué IA usas?", "Para el trabajo del estudio, Claude, de Anthropic. Para el asistente de la web, un modelo abierto (Llama 3.3) dentro de Cloudflare, sin cuentas de terceros."],
    ["¿Puedo tener algo así en mi negocio?", "Sí, a tu medida y empezando pequeño: una tarea que se repita mucho. Lo estudio y te digo el precio en 24 horas."],
    ["¿Qué es lo que más ha fallado?", "Automatizar los envíos: el correo acabó en spam y el WhatsApp automático no funcionó. Ahora la IA prepara y yo envío."],
  ],
  cierre: `Sigue leyendo: <a href="agentes-ia-empresas-gipuzkoa.html">agentes de IA para empresas en Gipuzkoa</a>, <a href="ia-para-negocios-gipuzkoa.html">IA y automatización para negocios en Gipuzkoa</a> y <a href="sobre-mi.html">sobre mí</a>.`,
},
];
