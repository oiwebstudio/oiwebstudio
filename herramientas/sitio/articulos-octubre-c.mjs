/**
 * Guías de octubre de 2026 (parte C): publicadas el 18/10/2026.
 * Salen de consultas reales de Search Console (export del 10/10/2026, propiedad de prefijo):
 *   - «cuanto cuesta un diseñador web» (pos. 10), «diseñador de pagina web precio» (pos. 4),
 *     «diseñador web freelance donostia» (6 impr.), «diseñador web donostia» (6), «cotizacion diseño web».
 *   - «diseño web pais vasco» (11 impr., pos. 97,6) y «diseño web euskadi» (1): no había página que lo trabajara.
 * Mismas reglas de redacción que las partes A y B (primera persona, «atraer/captar», sin cifras sin fuente,
 * títulos en minúscula tras la primera palabra, FAQ visible = JSON-LD).
 *
 * Se publican con gen-articulos-nuevos.mjs (importa ARTICULOS_C). Sin versión en euskera: los artículos
 * quedan fuera de /eu/ a propósito (ver generar-euskera.mjs), así que aquí no hay texto en euskera.
 */
import { consejo, cta, figura, tabla } from "./gen-articulos-nacionales.mjs";

const FECHA = "2026-10-18";

/* Las imágenes de Pedala llevan ?v=4 en todo el sitio (caché de Cloudflare tras cambiar la foto). */
const pedala = (alt, cap) => figura("pedala-desk", "pedala · muestra", alt, cap)
  .replace('pedala-desk.webp"', 'pedala-desk.webp?v=4"').replace('pedala-desk.jpg"', 'pedala-desk.jpg?v=4"');

export const ARTICULOS_C = [
/* ------------------------------------------------------------------ 1 */
{
  slug: "cuanto-cobra-disenador-web-freelance",
  fecha: FECHA,
  title: "Cuánto cobra un diseñador web freelance en 2026",
  headline: "Cuánto cobra un diseñador web freelance en 2026: por proyecto, qué incluye y qué preguntar",
  desc: "Qué cobra un diseñador web freelance por una web de negocio en 2026, qué entra en el precio, en qué se diferencia de una agencia y qué preguntar antes.",
  ogdesc: "Lo que cobra un diseñador web freelance, qué incluye y cómo comparar presupuestos sin perderte.",
  keywords: "cuanto cobra un diseñador web, diseñador web freelance precio, cuanto cuesta un diseñador web, diseñador de pagina web precio, diseñador web freelance donostia, cotizacion diseño web",
  crumb: "Cuánto cobra un diseñador web",
  h1: "Cuánto cobra un diseñador web freelance <em>en 2026</em>",
  lede: "Cuando buscas «diseñador web» quieres saber dos cosas: cuánto te va a costar y si vas a quedar en buenas manos. Te cuento cómo cobramos los que trabajamos por nuestra cuenta, qué entra en el precio y qué preguntar para comparar.",
  img: "stock/art-precio-web", min: 7,
  cuerpo: `
<h2 id="como-cobra">Por proyecto, no por horas</h2>
<p>Lo habitual con un negocio local es un precio por proyecto: te dicen qué van a hacer, cuánto cuesta y cuándo lo entregan. Si te dan un precio por hora sin tope, pide que lo conviertan en un precio cerrado: es la única manera de saber lo que vas a pagar.</p>
<p>En mi caso, el precio va por escrito antes de empezar y se paga al final, cuando la web está publicada. Lo tienes en <a href="precios.html">mis precios</a>.</p>

<h2 id="rangos">Qué cobra un freelance frente a una agencia</h2>
${tabla(["", "Diseñador freelance o estudio pequeño", "Agencia"], [
  ["Web de negocio completa", "Entre 300 y 1.500 €", "Entre 1.500 y 6.000 €"],
  ["Con quién hablas", "Con quien diseña y programa", "Con un comercial y un equipo que no ves"],
  ["Plazos", "Más cortos y flexibles", "Más largos, por procesos"],
  ["Qué vigilar", "Que dependa de una sola persona", "Cuotas y permanencias en algunas"],
])}
<p>Son rangos del mercado español para negocios locales, que explico con más detalle en la guía de <a href="precio-diseno-web-profesional.html">precios de un diseño web profesional</a>. Dentro de cada rango, lo que mueve el precio es lo mismo: cuántas páginas, si hay tienda o reservas, si la web es bilingüe y si los textos y las fotos los pones tú o los hace el diseñador.</p>

<h2 id="que-incluye">Qué tiene que ir dentro del precio</h2>
<ul class="check">
<li><strong>El diseño a medida</strong>, no una plantilla con tu logo encima.</li>
<li><strong>Que se vea bien en el móvil</strong> (es donde te buscan) y cargue rápido.</li>
<li><strong>Dominio a tu nombre y alojamiento</strong>, al menos el primer año, y que te digan cuánto costará renovar.</li>
<li><strong>Lo básico para salir en Google:</strong> títulos, descripciones, Google Maps y la ficha de Google Business conectada.</li>
<li><strong>Textos legales</strong> (aviso legal, privacidad, cookies).</li>
<li><strong>Un periodo de ajustes</strong> después de publicar. En OI Studio, el primer mes.</li>
</ul>
<p>Si quieres reservas o citas online, pregunta si llevan comisión por reserva: las plataformas de terceros la cobran; en tu propia web, <a href="reservas-online-sin-comisiones.html">no tiene por qué haberla</a>.</p>

${pedala("Muestra de web a medida para una tienda de bicis", "Una de mis muestras (marca inventada): esto es lo que un negocio debería recibir por un precio cerrado.")}

<h2 id="preguntar">Seis preguntas antes de aceptar un presupuesto</h2>
<ol>
<li>¿El precio es cerrado y por escrito? ¿Qué pasa si pido un cambio a mitad?</li>
<li>¿El dominio queda a mi nombre?</li>
<li>¿Qué cuotas hay el segundo año y puedo irme sin perder la web?</li>
<li>¿Puedo ver una web tuya publicada y hablar con su dueño?</li>
<li>¿Quién escribe los textos y de dónde salen las fotos?</li>
<li>¿Qué incluye el soporte después de publicar y cuánto cuesta un cambio?</li>
</ol>

${consejo("Un diseñador freelance barato que no responde sale más caro que uno que cobra algo más y contesta el mismo día. Pregunta por el plazo de respuesta a un cambio antes de mirar el precio.")}

<h2 id="donostia">¿Y si busco diseñador web en Donostia, Irun o Zarautz?</h2>
<p>Trabajo desde Tolosa con negocios de toda Gipuzkoa: la primera charla es por teléfono o videollamada, la propuesta llega en 48 horas y la web se revisa por WhatsApp. Si prefieres que nos veamos, en Tolosaldea y Donostialdea me acerco. Tienes una comparativa de <a href="diseno-web-donostia-agencia-o-freelance.html">agencia o freelance en Donostia</a> y las páginas de <a href="zonas/donostia-san-sebastian.html">Donostia</a>, <a href="zonas/irun.html">Irun</a> y <a href="zonas/zarautz.html">Zarautz</a>.</p>

${cta("¿Quieres un precio cerrado para tu web?", "Cuéntame tu negocio y en 48 horas tienes una propuesta por escrito, sin compromiso.", "Pedir propuesta")}
`,
  faq: [
    ["¿Cuánto cobra un diseñador web freelance por una web de negocio?", "Como orientación del mercado, entre 300 y 1.500 € según el alcance; una agencia, entre 1.500 y 6.000 €. En OI Studio, una web de una página cuesta 420 € y una web con secciones 540 €, más IVA, con precio cerrado por escrito."],
    ["¿Es mejor pagar por horas o por proyecto?", "Por proyecto. Con un precio cerrado sabes lo que pagas antes de empezar; por horas sin tope, no. Si te ofrecen horas, pide que lo conviertan en un precio fijo con alcance escrito."],
    ["¿Qué incluye el precio de un diseñador web?", "Diseño a medida, versión móvil, dominio y alojamiento el primer año, lo básico de SEO, textos legales y un periodo de ajustes. Si algo de esto no está, pregúntalo antes de firmar."],
    ["¿Cuánto cuesta un cambio después de publicar la web?", "Depende de quién la haga. En OI Studio el primer mes va incluido; después, con mantenimiento de 28 €/mes (tres cambios al mes) o con un presupuesto antes de hacerlo."],
  ],
  cierre: `Sigue leyendo: <a href="precio-diseno-web-profesional.html">precios de un diseño web profesional</a>, <a href="diseno-web-barato-merece-la-pena.html">cuándo merece la pena una web barata</a> y <a href="como-elegir-disenador-web-gipuzkoa.html">cómo elegir diseñador web en Gipuzkoa</a>.`,
},

/* ------------------------------------------------------------------ 2 */
{
  slug: "diseno-web-euskadi-pais-vasco",
  fecha: FECHA,
  title: "Diseño web en Euskadi: precios y cómo elegir en 2026",
  headline: "Diseño web en Euskadi (País Vasco): qué cuesta, qué mirar y cómo trabajo con negocios de Gipuzkoa, Bizkaia y Álava",
  desc: "Diseño web para negocios del País Vasco: qué cuesta una web en 2026, qué debe incluir, el euskera bien hecho y cómo trabajo desde Tolosa con precio cerrado.",
  ogdesc: "Web para tu negocio en Euskadi: precio cerrado, castellano y euskera, y propuesta en 48 horas.",
  keywords: "diseño web pais vasco, diseño web euskadi, paginas web euskadi, diseñador web pais vasco, web en euskera, diseño web gipuzkoa bizkaia alava",
  crumb: "Diseño web en Euskadi",
  h1: "Diseño web en Euskadi: <em>precios y cómo elegir</em>",
  lede: "Si tu negocio está en Gipuzkoa, Bizkaia o Álava y buscas quién te haga la web, aquí tienes lo que cuesta, lo que debe incluir y cómo trabajo yo desde Tolosa con negocios de las tres provincias.",
  img: "errotatxo-desk", min: 6,
  cuerpo: `
<h2 id="precio">Qué cuesta una web en Euskadi en 2026</h2>
<p>El precio depende de quién la haga más que de la provincia. Como orientación del mercado, una agencia cobra entre 1.500 y 6.000 € por una web completa; un diseñador freelance o un estudio pequeño, entre 300 y 1.500 €. Tienes los rangos explicados en la guía de <a href="precio-diseno-web-profesional.html">precios de un diseño web profesional</a>.</p>
<p>Mi tarifa es la misma en las tres provincias: web de una página 420 €, web con secciones 540 € y tienda online 880 €, más IVA, con el <a href="precios.html">precio cerrado por escrito</a>, propuesta en 48 horas y pago al final, cuando la web está publicada.</p>

<h2 id="euskera">El euskera, bien hecho</h2>
<p>En Euskadi una web en castellano y euskera no es un extra: es lo que esperan muchos clientes, y en varios municipios de Gipuzkoa hay ayudas para pagarla. Hacerla bien significa una página propia en cada idioma (no un traductor automático encima), etiquetas para que Google sepa qué idioma enseñar y una traducción revisada. Lo explico en <a href="web-bilingue-euskera-castellano.html">cómo hacer una web en euskera y castellano</a> y tienes la lista de <a href="ayudas-subvenciones-pagina-web-gipuzkoa.html">ayudas abiertas en Gipuzkoa</a>.</p>

<h2 id="incluir">Qué debe incluir, sea quien sea quien la haga</h2>
<ul class="check">
<li><strong>Diseño para el móvil</strong> y carga rápida: la mayoría de tus clientes te buscan desde el teléfono.</li>
<li><strong>Google Maps y la ficha de Google Business</strong> conectadas: es como se sale en «tu servicio + tu pueblo».</li>
<li><strong>Dominio a tu nombre</strong> (.eus, .es o .com: <a href="dominio-eus-es-com.html">cuál elegir</a>) y alojamiento claro.</li>
<li><strong>Reservas o citas si tu negocio las necesita</strong>, en tu propia web y <a href="reservas-online-sin-comisiones.html">sin comisiones</a>.</li>
<li><strong>Textos legales</strong> y un precio cerrado con lo que incluye.</li>
</ul>

${figura("errotatxo-desk", "errotatxo.com · caso real", "Web de la panadería Errotatxo de Tolosa, hecha por OI Studio", "La web de Errotatxo, panadería de Tolosa: castellano y euskera con el selector ES / EU siempre a mano. Así lo cuento en el <a href=\"caso-errotatxo.html\">caso Errotatxo</a>.")}

<h2 id="distancia">Cómo trabajo con negocios de Bizkaia y Álava</h2>
<p>Igual que con los de Gipuzkoa: una charla de 15 minutos por teléfono o videollamada, propuesta en 48 horas con una muestra de tu negocio, y la web se revisa por WhatsApp hasta publicarla. No hace falta que nos veamos para hacerla bien. Tienes las páginas de <a href="diseno-web-bizkaia.html">Bizkaia</a>, <a href="diseno-web-alava-araba.html">Álava</a> y, por comarcas y pueblos, <a href="zonas.html">toda Gipuzkoa</a>.</p>

${consejo("Pide a quien te presupueste una web publicada que puedas abrir y el contacto de su dueño. Es la prueba más sencilla y la que menos gente pide.")}

<h2 id="elegir">Cómo elegir</h2>
<p>Compara tres cosas: qué incluye el precio, qué cuotas hay el segundo año y quién te responde cuando pidas un cambio. Tienes la lista completa de preguntas en <a href="como-elegir-disenador-web-gipuzkoa.html">cómo elegir diseñador web en Gipuzkoa</a>; sirve igual para Bizkaia y Álava.</p>

${cta("¿Tu negocio está en Euskadi y necesita web?", "Cuéntame qué haces y dónde, y en 48 horas tienes una propuesta con precio cerrado, en castellano y euskera si lo quieres.", "Pedir propuesta")}
`,
  faq: [
    ["¿Cuánto cuesta una página web en el País Vasco?", "Depende de quién la haga: como orientación del mercado, entre 300 y 1.500 € con un freelance o estudio pequeño, y entre 1.500 y 6.000 € en una agencia. En OI Studio, web de una página 420 €, web con secciones 540 € y tienda online 880 €, más IVA, con precio cerrado."],
    ["¿Trabajas con negocios de Bizkaia y Álava?", "Sí, a distancia desde Tolosa, con el mismo precio y el mismo proceso: charla, propuesta en 48 horas y revisión por WhatsApp hasta publicar."],
    ["¿Haces la web en euskera?", "Sí. Una página propia en cada idioma, con las etiquetas que Google necesita y traducción revisada. En varios municipios de Gipuzkoa hay ayudas para la web en euskera."],
    ["¿Hay ayudas para hacer la web en Euskadi?", "En Gipuzkoa hay ayudas municipales (imagen digital, euskera en la web) con plazos que cambian cada año; las tengo reunidas en la página de ayudas. Para Bizkaia y Álava, consulta tu ayuntamiento o la Cámara de Comercio."],
  ],
  cierre: `Sigue leyendo: <a href="diseno-web-bizkaia.html">diseño web en Bizkaia</a>, <a href="diseno-web-alava-araba.html">diseño web en Álava</a> y <a href="web-bilingue-euskera-castellano.html">web en euskera y castellano</a>.`,
},
];
