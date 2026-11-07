/**
 * Páginas «IA para negocios» (6/11/2026). Oier: «quiero que nos postulemos como software de IA en Gipuzkoa»;
 * frase fijada por él: «Ofrecemos soluciones de IA adaptadas a cada empresa». Plan aprobado el 6/11
 * («todo de golpe», «sí, publícalos»): _local/negocio/marketing/ia-gipuzkoa/PLAN.md.
 *
 * Reglas: solo se vende lo que funciona hoy (QUE-FUNCIONA.md); nada promete una IA que no exista; cada
 * solución dice qué parte hace la IA y qué parte una persona (art. 50); precios de _local/negocio/TARIFA.md;
 * sin cifras sin fuente; sin nombrar competidores; títulos en mayúsculas (clase ia-pg); FAQ visible = JSON-LD.
 *
 * Se publican con gen-articulos-nuevos.mjs, igual que las demás guías.
 */
import { consejo, cta, tabla, figura } from "./gen-articulos-nacionales.mjs";

const FECHA = "2026-11-06";
const FRASE = "Ofrecemos soluciones de IA adaptadas a cada empresa.";

/* Fuentes de por qué responder reseñas (comprobadas el 6/11/2026). */
const F_GOOGLE = `<a href="https://support.google.com/business/answer/7091?hl=es" rel="noopener">la ayuda de Google para empresas</a>`;
const F_HBR = `<a href="https://hbr.org/2018/02/study-replying-to-customer-reviews-results-in-better-ratings" rel="noopener">Harvard Business Review, 2018</a>`;

const avisoIA = `<p><strong>Qué parte hace la IA.</strong> En cada solución te digo qué hace la IA y qué hago yo. Ninguna IA habla con tus clientes en tu nombre sin que lo sepan: si algún día pones un asistente que contesta solo, tiene que avisar de que es una IA, como exige el artículo 50 del Reglamento europeo de IA.</p>`;

const tablaSoluciones = (extra = []) => tabla(["Solución", "Qué ganas", "Qué hace la IA y qué hago yo", "Precio (+ IVA)"], [
  ["<strong>Cómo te ven Google y las IAs</strong>", "Que quien te busca en Google o se lo pregunta a una IA encuentre tu horario, tu web y tus datos buenos", "La IA hace las preguntas que haría un cliente y yo comparo lo que contesta con tu ficha. Los arreglos los hago yo", "120 €, una vez (presencia en Google: ficha completa, QR de reseñas, Bing y Apple Maps)"],
  ["<strong>Reseñas respondidas</strong>", "Cada opinión de Google contestada en su idioma y con tu tono, sin buscar el rato", "La IA redacta el borrador, yo lo reviso y tú dices «vale». En euskera, pasa por Itzultzaile", "Dentro de la cuota de 28 €/mes de tu web"],
  ["<strong>Reservas y citas</strong>", "Dejas de coger el teléfono para todo y no pagas comisión por reserva", "<strong>Sin IA</strong>: entran tal como las pide tu cliente y nadie decide por ti", "Agenda para tu web: 160 € + 20 €/mes (+8 € por profesional más). Web con reservas: 580 € + 28 €/mes"],
  ...extra,
]);

const porQueResenas = `
<h2 id="resenas">Por qué importa contestar las reseñas</h2>
<p>Una respuesta a una reseña no es solo para quien la escribió. La lee también <strong>el próximo cliente</strong>, el que todavía no te conoce y está mirando tu ficha antes de decidir. Estas son las razones, con su fuente:</p>
<ul class="check">
<li><strong>Las reseñas cuentan para salir en Google.</strong> Según ${F_GOOGLE}, tener más reseñas y buenas valoraciones puede mejorar tu posición en las búsquedas locales, y contestarlas demuestra que valoras lo que te dicen tus clientes.</li>
<li><strong>Contestar ayuda a subir la nota.</strong> Un estudio con miles de hoteles (Proserpio y Zervas, ${F_HBR}) vio que los que empezaron a responder subieron de media algo más de una décima de estrella, sin cambiar nada más. Los autores lo explican así: cuando el cliente ve que el dueño lee y contesta, se lo piensa más antes de dejar una queja sin fundamento.</li>
<li><strong>Una mala sin contestar se queda ahí años.</strong> Una respuesta tranquila, que no discute y ofrece hablarlo, convierte la queja en una prueba de que cuidas a la gente.</li>
<li><strong>Es lo que leen las IAs.</strong> Cuando alguien pregunta a una IA con buscador «dónde comer» o «qué peluquería», lo que encuentra de ti es tu ficha: tu nota y tus opiniones. Cuanto mejor cuidada, mejor.</li>
</ul>
<p>Lo difícil no es escribir la respuesta: es acordarse cada semana, saber qué poner cuando es mala y no contestar en caliente. Eso es lo que hago yo.</p>
${consejo("Nunca contestes una mala reseña el mismo día que la lees. Déjala reposar, responde corto, sin discutir, y ofrece hablarlo en privado.")}`;

const porQueResenasCorto = `<p>Contestar no es cortesía sin más: según ${F_GOOGLE}, las reseñas cuentan para salir en el mapa, y un estudio con miles de hoteles (${F_HBR}) vio que los que empezaron a responder subieron su nota. Lo explico entero en <a href="ia-para-negocios-gipuzkoa.html#resenas">por qué importa contestar las reseñas</a>.</p>`;

const aMedida = (ejemplos) => `
<h2 id="a-medida">Si lo que te quita tiempo es otra cosa</h2>
<p>${FRASE} Si tu problema no está en la lista, lo estudio y te digo el precio en 24 horas. Algunas cosas que se pueden montar con herramientas que ya existen:</p>
<ul>
${ejemplos.map((e) => `<li>${e}</li>`).join("\n")}
</ul>
<p>Estas te las monto para tu caso: no son un programa ya hecho. Antes te digo si de verdad te compensa, se prueban contigo y no pagas nada hasta que funcionan.</p>`;

const EJ = {
  whatsapp: "<strong>Un WhatsApp que contesta lo de siempre</strong> (horario, precios, cómo reservar) con el asistente de IA que ya trae WhatsApp Business. Pasa a una persona lo que no sabe y avisa de que es una IA.",
  telefono: "<strong>Un teléfono que se atiende solo</strong> cuando no puedes cogerlo: toma el recado, da el horario y manda el enlace para reservar. Al empezar dice que es un asistente con IA.",
  presupuestos: "<strong>Presupuestos y correos en borrador</strong>: la IA prepara la respuesta con tus precios y tú la revisas y la mandas. Nunca sale nada solo.",
  facturas: "<strong>Facturas de gastos sin teclear</strong>: haces una foto y la IA pasa el proveedor, la base y el IVA a una hoja para tu gestoría.",
  preguntas: "<strong>Las preguntas de siempre por correo</strong> («¿admitís perros?», «¿hay cuna?») con la respuesta ya escrita para que la mandes con un toque.",
};

const pasos = `
<h2 id="como-trabajo">Cómo trabajo</h2>
<ol>
<li><strong>Miro qué te quita tiempo.</strong> Hablamos o paso por tu negocio, y me cuentas qué haces cada día que no te gustaría hacer.</li>
<li><strong>Te enseño gratis lo que dicen de ti Google y una IA</strong>, en tu móvil, en cinco minutos.</li>
<li><strong>Te propongo una o dos cosas con precio cerrado.</strong> Si una tarea sale bien con reglas fijas, te lo digo: no hace falta ponerle IA.</li>
<li><strong>Se paga al final</strong>, cuando está funcionando.</li>
</ol>`;

const ld = (area, desc) => ({
  "@type": "Service",
  name: "Soluciones de IA adaptadas a cada empresa",
  serviceType: "Inteligencia artificial y automatizaciones para negocios pequeños",
  description: desc,
  provider: { "@id": "https://oiwebstudio.com/#estudio" },
  areaServed: area.map((n) => ({ "@type": "Place", name: n })),
  availableLanguage: ["es", "eu"],
  offers: [
    { "@type": "Offer", name: "Presencia en Google y en las IAs", price: "120", priceCurrency: "EUR", priceSpecification: { "@type": "PriceSpecification", price: "120", priceCurrency: "EUR", valueAddedTaxIncluded: false } },
    { "@type": "Offer", name: "Agenda de citas para tu web", price: "160", priceCurrency: "EUR", priceSpecification: { "@type": "PriceSpecification", price: "160", priceCurrency: "EUR", valueAddedTaxIncluded: false } },
    { "@type": "Offer", name: "Web con reservas o citas", price: "580", priceCurrency: "EUR", priceSpecification: { "@type": "PriceSpecification", price: "580", priceCurrency: "EUR", valueAddedTaxIncluded: false } },
  ],
});

const zonasYSectores = `
<h2 id="zonas-sectores">Por zonas y por sector</h2>
<ul>
<li><a href="ia-para-negocios-tolosa.html">IA para negocios en Tolosa y Tolosaldea</a>: paso por tu negocio.</li>
<li><a href="ia-para-negocios-donostia.html">IA para negocios en Donostia</a>: para el negocio pequeño, con turistas e idiomas.</li>
<li><a href="ia-para-restaurantes-gipuzkoa.html">IA para restaurantes y bares</a>: reseñas, carta en idiomas y reservas de mesa.</li>
<li><a href="ia-para-peluquerias-estetica-gipuzkoa.html">IA para peluquerías y centros de estética</a>: citas, reseñas y Google.</li>
<li><a href="ia-para-casas-rurales-gipuzkoa.html">IA para casas rurales</a>: reservas sin comisión, reseñas en varios idiomas.</li>
</ul>`;

export const ARTICULOS_IA = [
/* ------------------------------------------------------------------ 1 · general */
{
  slug: "ia-para-negocios-gipuzkoa",
  fecha: FECHA,
  bodyClass: "ia-pg",
  title: "IA para negocios en Gipuzkoa: soluciones adaptadas a cada empresa",
  headline: "IA para negocios en Gipuzkoa: soluciones adaptadas a cada empresa, con precio cerrado",
  desc: "Soluciones de IA adaptadas a cada negocio de Gipuzkoa: Google y las IAs, reseñas respondidas y reservas. Qué hace la IA y qué hago yo, con precio cerrado.",
  ogdesc: "Soluciones de IA adaptadas a cada negocio de Gipuzkoa: Google y las IAs, reseñas respondidas y reservas, con precio cerrado.",
  keywords: "ia para negocios gipuzkoa, inteligencia artificial pymes gipuzkoa, automatizaciones con ia gipuzkoa, ia para pequeños negocios, agencia ia gipuzkoa, responder reseñas con ia",
  crumb: "IA para negocios en Gipuzkoa",
  h1: "IA para negocios en Gipuzkoa",
  lede: `${FRASE} Miro qué le quita tiempo a tu negocio y monto la IA para eso. Y te digo siempre qué parte hace la IA y qué parte hago yo, desde Tolosa, en euskera o en castellano.`,
  img: "stock/art-seo-local", min: 6,
  area: ["Gipuzkoa", "Tolosaldea", "Donostia / San Sebastián"],
  cuerpo: `
<h2 id="que-funciona">Lo que ya funciona hoy</h2>
<p>No vendo una IA que haga de todo. Vendo tres cosas que funcionan hoy, para negocios pequeños, cada una con su precio:</p>
${tablaSoluciones([["<strong>Carta en idiomas</strong> (restaurantes)", "Tu carta en euskera, castellano, francés e inglés, en la web y en Google", "La IA traduce; el euskera pasa por Itzultzaile y lo reviso todo yo", "60 €, una vez. Los cambios de platos, dentro de la cuota"]])}
<p>No te prometo ningún puesto en Google ni que una IA te nombre. Lo que sí hago es que tus datos estén bien y digan lo mismo en todas partes, que es lo que leen Google y las IAs.</p>
${avisoIA}
${pasos}
${porQueResenas}
${aMedida([EJ.whatsapp, EJ.telefono, EJ.presupuestos, EJ.facturas])}
${cta("Te enseño gratis lo que dice una IA de tu negocio", "Le hago las preguntas que haría un cliente y te mando lo que contesta, con lo que falla y cómo se arregla.", "Pídemelo")}
${zonasYSectores}
`,
  faq: [
    ["¿Qué es una solución de IA adaptada a cada empresa?", "Que no te vendo un programa igual para todos: miro qué te quita tiempo a ti y monto la IA solo para eso. Si una tarea sale bien con reglas fijas, como las reservas, la hago sin IA."],
    ["¿Cuánto cuesta?", "Lo que ya funciona tiene precio cerrado: la presencia en Google y en las IAs, 120 € + IVA una vez; las reseñas respondidas van en la cuota de 28 €/mes de tu web; una agenda de citas para tu web, 160 € + 20 €/mes con un profesional (8 € más al mes por cada profesional más). Si necesitas algo a medida, te digo el precio en 24 horas."],
    ["¿La IA contesta sola a mis clientes?", "No. En lo que monto, la IA prepara borradores y los reviso yo; no se publica nada sin tu visto bueno. Si algún día pones un asistente que contesta solo, tiene que avisar de que es una IA."],
    ["¿Trabajas en euskera?", "Sí. Atiendo en euskera y en castellano, y los textos en euskera los paso siempre por Itzultzaile, el traductor neuronal del Gobierno Vasco, antes de revisarlos."],
    ["¿Me sirve si mi web no la has hecho tú?", "Sí. La presencia en Google y en las IAs se hace sobre cualquier web. Para las reseñas respondidas sin una web mía, te digo el precio en 24 horas."],
  ],
  cierre: `Sigue leyendo: <a href="inteligencia-artificial-negocio-pequeno.html">inteligencia artificial para un negocio pequeño: qué funciona hoy</a>, <a href="que-automatizar-negocio-pequeno.html">qué automatizar en un negocio pequeño</a> y <a href="automatizaciones.html">automatizaciones para negocios en Gipuzkoa</a>.`,
},
/* ------------------------------------------------------------------ 2 · Tolosa */
{
  slug: "ia-para-negocios-tolosa",
  fecha: FECHA,
  bodyClass: "ia-pg",
  title: "IA para negocios en Tolosa y Tolosaldea: en persona y con precio",
  headline: "IA para negocios en Tolosa y Tolosaldea: paso por tu negocio y te enseño qué te ahorraría tiempo",
  desc: "IA para bares, peluquerías, tiendas y talleres de Tolosaldea: paso por tu negocio, te enseño gratis qué dicen Google y una IA de ti y te doy precio cerrado.",
  ogdesc: "Paso por tu negocio en Tolosaldea, te enseño lo que dicen Google y una IA de ti y te digo qué te ahorraría tiempo.",
  keywords: "ia para negocios tolosa, inteligencia artificial tolosa, ia tolosaldea, automatizaciones tolosa, responder reseñas google tolosa, ia para bares tolosa",
  crumb: "IA para negocios en Tolosa",
  h1: "IA para negocios en Tolosa y Tolosaldea",
  lede: `${FRASE} Trabajo desde Tolosa: si tienes un bar, una peluquería, una tienda o un taller en Tolosaldea, paso por tu negocio, te enseño en tu móvil lo que dicen de ti Google y una IA, y te digo qué parte te ahorraría tiempo.`,
  img: "stock/art-seo-local", min: 5,
  area: ["Tolosa", "Tolosaldea", "Ibarra", "Villabona", "Alegia", "Anoeta", "Irura", "Andoain"],
  cuerpo: `
<h2 id="en-persona">En persona, que es como se entiende</h2>
<p>La IA se entiende mejor delante del mostrador que en un correo. Por eso, en Tolosa y en los pueblos de alrededor (Ibarra, Villabona, Alegia, Anoeta, Irura, Asteasu, Zizurkil, Legorreta y hasta Andoain) prefiero pasar por tu negocio por la tarde, a una hora tranquila, y enseñártelo en tu propio móvil. Son cinco minutos.</p>
<p>Lo que te enseño es muy concreto: le pregunto a una IA con buscador lo que preguntaría un cliente («¿dónde comer txuleta en Tolosa?», «¿qué peluquería abre el sábado?», «¿dónde comprar alubias de Tolosa?») y miramos juntos si te nombra, si tu horario está bien y cuántas reseñas tienes sin contestar.</p>

<h2 id="que-funciona">Lo que te puedo montar ya</h2>
${tablaSoluciones()}
${avisoIA}

<h2 id="resenas">Las reseñas, lo primero</h2>
<p>En un pueblo, todo el mundo se conoce, pero quien viene de fuera (o quien se ha mudado hace poco) te mira en Google antes de entrar. Una ficha con opiniones contestadas dice que hay alguien detrás que cuida el negocio.</p>
${porQueResenasCorto}
${pasos}
${aMedida([EJ.whatsapp, EJ.telefono, EJ.presupuestos])}
${cta("¿Paso por tu negocio?", "Dime cuándo te va bien y te enseño en tu móvil lo que dicen de ti Google y una IA. Sin compromiso.", "Escríbeme")}
`,
  faq: [
    ["¿Vienes en persona al negocio?", "Sí, en Tolosa y Tolosaldea paso por tu negocio por la tarde, a la hora que te venga bien. Si estás más lejos, lo vemos por videollamada o por WhatsApp."],
    ["¿Cuánto cuesta?", "La presencia en Google y en las IAs, 120 € + IVA una vez; las reseñas respondidas, dentro de la cuota de 28 €/mes de tu web; la agenda de citas para tu web, 160 € + 20 €/mes con un profesional (8 € más al mes por cada profesional más). Lo enseño gratis y se paga al final."],
    ["¿Tengo que saber de IA?", "No. Tú me cuentas qué te quita tiempo y yo me encargo. Lo único que harás es decir «vale» a las respuestas antes de que se publiquen."],
    ["¿Me atiendes en euskera?", "Sí, en euskera o en castellano, como prefieras."],
  ],
  cierre: `Sigue leyendo: <a href="ia-para-negocios-gipuzkoa.html">IA para negocios en Gipuzkoa</a>, <a href="seo-local-tolosa-google-maps.html">cómo salir en Google Maps en Tolosa</a> y <a href="zonas/tolosa.html">diseño web en Tolosa</a>.`,
},
/* ------------------------------------------------------------------ 3 · Donostia */
{
  slug: "ia-para-negocios-donostia",
  fecha: FECHA,
  bodyClass: "ia-pg",
  title: "IA para negocios en Donostia: soluciones para el negocio pequeño",
  headline: "IA para negocios en Donostia / San Sebastián: soluciones para el negocio pequeño, con turistas e idiomas",
  desc: "IA para el negocio pequeño de Donostia: reseñas en el idioma del cliente, cómo te ven Google y las IAs, carta en idiomas y reservas. Con precio cerrado.",
  ogdesc: "Para el bar, la tienda o el alojamiento de Donostia: reseñas en el idioma del cliente, Google y las IAs, y reservas, con precio cerrado.",
  keywords: "ia para negocios donostia, inteligencia artificial san sebastian, agencia ia donostia, automatizaciones donostia, responder reseñas en ingles frances, ia para pymes donostia",
  crumb: "IA para negocios en Donostia",
  h1: "IA para negocios en Donostia",
  lede: `${FRASE} Muchas propuestas de IA están pensadas para empresas con departamento propio. Yo trabajo con el negocio pequeño de Donostia: el bar de la Parte Vieja, la tienda de Gros, la peluquería de Amara o el alojamiento del Antiguo.`,
  img: "hauspo-desk", min: 5,
  area: ["Donostia / San Sebastián", "Donostialdea"],
  cuerpo: `
<h2 id="idiomas">Clientes de fuera, en su idioma</h2>
<p>En Donostia te busca y te escribe mucha gente de fuera. Ahí la IA ayuda de verdad: <strong>la respuesta a cada reseña sale en el idioma de quien la escribió</strong> (inglés, francés, euskera o castellano) y con tu tono, y la carta puede estar en cuatro idiomas en tu web y en Google.</p>
<p>Y hay quien viaja y, en lugar de buscar, se lo pregunta a una IA: «¿dónde comer pintxos en la Parte Vieja?», «¿una peluquería en Gros que abra el sábado?». Te enseño qué contesta y si te nombra.</p>

<h2 id="que-funciona">Lo que te puedo montar ya</h2>
${tablaSoluciones([["<strong>Carta en idiomas</strong>", "Tu carta en euskera, castellano, francés e inglés, en la web y en Google", "La IA traduce; el euskera pasa por Itzultzaile y lo reviso todo yo", "60 €, una vez"]])}
${avisoIA}

<h2 id="resenas">Por qué contestar, también en inglés y en francés</h2>
<p>Quien está eligiendo dónde cenar esta noche lee las últimas opiniones y cómo contestas. Una respuesta en su idioma le dice que allí le van a entender.</p>
${porQueResenasCorto}
${figura("hauspo-desk", "hauspo · muestra", "Muestra de web de restaurante HAUSPO Jatetxea, con reservas", "HAUSPO, una de mis muestras de restaurante: web con reservas de mesa, sin IA en las reservas.")}
${pasos}
${aMedida([EJ.whatsapp, EJ.telefono, EJ.preguntas])}
${cta("Te enseño lo que dice una IA de tu negocio", "Por WhatsApp o por videollamada: te mando lo que contesta a las preguntas de un cliente y cómo se arregla lo que falla.", "Pídemelo")}
`,
  faq: [
    ["¿Trabajas con negocios de Donostia aunque estés en Tolosa?", "Sí. Lo vemos por videollamada o por WhatsApp, y todo lo que hago funciona igual en Donostia que en Tolosa."],
    ["¿Contestas las reseñas en inglés y en francés?", "Sí: la IA prepara el borrador en el idioma de quien escribió, yo lo reviso y tú dices «vale» antes de que se publique. En euskera, el texto pasa por Itzultzaile."],
    ["¿Cuánto cuesta?", "La presencia en Google y en las IAs, 120 € + IVA una vez; la carta en idiomas, 60 € + IVA; las reseñas respondidas, dentro de la cuota de 28 €/mes de tu web. Lo que no está en la lista, te digo el precio en 24 horas."],
    ["¿Me garantizas que una IA me recomiende?", "No, nadie puede garantizarlo. Lo que hago es que tus datos estén bien y digan lo mismo en tu ficha, tu web y los directorios, que es lo que leen."],
  ],
  cierre: `Sigue leyendo: <a href="ia-para-negocios-gipuzkoa.html">IA para negocios en Gipuzkoa</a>, <a href="ia-para-restaurantes-gipuzkoa.html">IA para restaurantes y bares</a> y <a href="zonas/donostia-san-sebastian.html">diseño web en Donostia</a>.`,
},
/* ------------------------------------------------------------------ 4 · restaurantes */
{
  slug: "ia-para-restaurantes-gipuzkoa",
  fecha: FECHA,
  bodyClass: "ia-pg",
  title: "IA para restaurantes en Gipuzkoa: reseñas, carta y reservas",
  headline: "IA para restaurantes y bares en Gipuzkoa: reseñas contestadas, carta en idiomas y reservas de mesa",
  desc: "IA para restaurantes y bares de Gipuzkoa: reseñas contestadas con tu tono, carta en cuatro idiomas, Google y las IAs, y reservas de mesa sin comisión.",
  ogdesc: "Reseñas contestadas, carta en cuatro idiomas, Google y las IAs y reservas de mesa sin comisión, para restaurantes de Gipuzkoa.",
  keywords: "ia para restaurantes, inteligencia artificial restaurante, responder reseñas restaurante, carta en idiomas restaurante, reservas de mesa sin comision, ia hosteleria gipuzkoa",
  crumb: "IA para restaurantes",
  h1: "IA para restaurantes y bares en Gipuzkoa",
  lede: `${FRASE} En un restaurante, lo que más tiempo quita no se ve: el teléfono en pleno servicio, las reseñas sin contestar, la carta que cambia y los clientes de fuera que no la entienden. Ahí es donde pongo la IA, y solo ahí.`,
  img: "hauspo-desk", min: 6,
  area: ["Gipuzkoa"],
  cuerpo: `
<h2 id="resenas">Reseñas contestadas, con tu tono</h2>
<p>Cada opinión nueva en Google te llega con la respuesta ya escrita: corta, con el nombre de quien la dejó, en su idioma y sin frases de plantilla. Tú dices «vale» (o la cambias) y la publico.</p>
${tabla(["Paso", "Quién"], [["Redacta el borrador", "La IA"], ["Lo revisa y lo ajusta a tu tono", "Yo"], ["Dice «vale»", "Tú"], ["Lo publica en tu ficha", "Yo"]])}
<p>Las malas van aparte: borrador tranquilo, sin discutir, y te aviso para que lo hablemos antes. Va dentro de la cuota de 28 €/mes de tu web.</p>
${porQueResenas}

<h2 id="carta">La carta en cuatro idiomas</h2>
<p>Si tu carta es una foto o un PDF escaneado, a Google y a las IAs les cuesta leerla. La paso a texto, la traduzco al euskera (por Itzultzaile), al francés y al inglés, la reviso, dejo los nombres de siempre sin traducir (txuleta, pimientos de piquillo) y la pongo en tu web y en tu ficha de Google. <strong>60 € + IVA</strong>, una vez; cuando cambias un plato, me lo mandas por WhatsApp y entra en los cambios de la cuota.</p>
<p>Los alérgenos los pongo solo si me los das tú: eso no lo decide ninguna IA.</p>

<h2 id="google">Cómo te ven Google y las IAs</h2>
<p>Le pregunto a una IA con buscador lo que preguntaría un cliente («¿dónde comer txuleta cerca de aquí?», «¿qué restaurante abre el lunes?») y lo comparo con tu ficha: horario, web, teléfono y si te nombra. Te lo enseño gratis; si quieres que lo arregle yo, es la presencia en Google: <strong>120 € + IVA</strong>, una vez, con la ficha completa, el QR de reseñas, Bing y Apple Maps.</p>

<h2 id="reservas">Reservas de mesa, sin IA</h2>
<p>Las reservas no llevan IA, y es a propósito: tu cliente elige día, hora y personas, y la petición te llega al móvil con todo escrito. Confirmas tú cuando puedes, sin coger el teléfono en pleno servicio y sin comisión por reserva. Pack restaurante (web con secciones, reservas y carta editable): <strong>740 € + 28 €/mes</strong>; si te basta una página, 580 € + 28 €/mes.</p>
${figura("hauspo-desk", "hauspo · muestra", "Muestra de web de restaurante HAUSPO Jatetxea, con reservas de mesa", "HAUSPO, una de mis muestras de restaurante. <a href=\"https://hauspo-reservas-demo.oi-studio-web.workers.dev/es/\" rel=\"noopener\">Prueba la demo de reservas</a> (restaurante inventado, con datos de ejemplo).")}
${avisoIA}
${aMedida([EJ.telefono, EJ.whatsapp, EJ.facturas])}
${cta("Te enseño gratis qué dice una IA de tu restaurante", "Y cuántas reseñas tienes sin contestar. Cinco minutos, en tu móvil.", "Pídemelo")}
`,
  faq: [
    ["¿La IA contesta sola a las reseñas de mi restaurante?", "No. La IA escribe el borrador, yo lo reviso y no se publica nada sin tu «vale». Las reseñas malas, además, las hablamos antes."],
    ["¿Cuánto cuesta la carta en idiomas?", "60 € + IVA, una vez, en euskera, castellano, francés e inglés, puesta en tu web y en Google. Los cambios de platos entran en la cuota de tu web."],
    ["¿Las reservas de mesa usan IA?", "No. Funcionan con reglas fijas: tu cliente pide mesa y tú la confirmas. Así nadie decide por ti ni se equivoca de día."],
    ["¿Y si me llaman en pleno servicio?", "Se puede montar un teléfono que coge el recado y manda el enlace para reservar, avisando de que es un asistente con IA. Lo estudio para tu caso y te digo el precio en 24 horas."],
  ],
  cierre: `Sigue leyendo: <a href="ia-para-negocios-gipuzkoa.html">IA para negocios en Gipuzkoa</a>, <a href="web-para-restaurante-hosteleria.html">web para restaurante</a> y <a href="reservas-online-sin-comisiones.html">reservas online sin comisiones</a>.`,
},
/* ------------------------------------------------------------------ 5 · peluquerías */
{
  slug: "ia-para-peluquerias-estetica-gipuzkoa",
  fecha: FECHA,
  bodyClass: "ia-pg",
  title: "IA para peluquerías y centros de estética en Gipuzkoa",
  headline: "IA para peluquerías y centros de estética en Gipuzkoa: citas online, reseñas contestadas y Google",
  desc: "Peluquerías, barberías y estética en Gipuzkoa: citas online sin comisión, reseñas contestadas con tu tono y cómo te ven Google y las IAs. Precio cerrado.",
  ogdesc: "Citas online sin comisión, reseñas contestadas con tu tono y Google y las IAs, para peluquerías y centros de estética de Gipuzkoa.",
  keywords: "ia para peluquerias, inteligencia artificial peluqueria, citas online peluqueria gipuzkoa, responder reseñas peluqueria, ia centro de estetica, agenda online sin comision",
  crumb: "IA para peluquerías",
  h1: "IA para peluquerías y centros de estética",
  lede: `${FRASE} En una peluquería, el teléfono suena justo cuando tienes las manos ocupadas, y las reseñas se quedan sin contestar porque no hay rato. Las citas te las resuelvo sin IA; lo demás, con IA y con alguien que lo revisa.`,
  img: "stock/sec-pelu-1", min: 5,
  area: ["Gipuzkoa"],
  cuerpo: `
<h2 id="citas">Citas online, sin IA y sin comisión</h2>
<p>Tu cliente elige servicio, persona y hora libre desde tu web o desde tu ficha de Google, y tú ves el día entero en el móvil. No hay IA: la agenda sigue tus reglas (duración de cada servicio, descansos, festivos) y no se equivoca de hora. Sin comisión por cita.</p>
${tabla(["Si ya tienes web", "Si no tienes web"], [["Agenda de citas para tu web: <strong>160 € + 20 €/mes</strong> (+8 € por profesional más)", "Web con citas: <strong>580 € + 28 €/mes</strong>"]])}
<p><a href="https://agenda-oi-demo.oi-studio-web.workers.dev/s/salon-demo" rel="noopener">Prueba la demo de citas</a> (salón inventado, con datos de ejemplo). Si ya reservas con una aplicación y te va bien, no hace falta cambiarla: te ayudo con Google y con las reseñas.</p>

<h2 id="resenas">Reseñas contestadas, con tu tono</h2>
<p>En belleza, la gente elige mucho por las opiniones y por las fotos. Cada reseña nueva te llega con la respuesta escrita; tú dices «vale» y la publico. Va dentro de la cuota de 28 €/mes de tu web.</p>
${porQueResenasCorto}

<h2 id="google">Cómo te ven Google y las IAs</h2>
<p>Le pregunto a una IA «¿qué peluquería abre el sábado en tu pueblo?» y miro si te nombra, si tu horario de Google es el bueno y si tus fotos están al día. Te lo enseño gratis; el arreglo es la presencia en Google, <strong>120 € + IVA</strong> una vez.</p>
${figura("orrazkera-desk", "orrazkera · muestra", "Muestra de web de peluquería ORRAZKERA", "ORRAZKERA, una de mis muestras de peluquería.")}
${avisoIA}
${aMedida([EJ.whatsapp, EJ.telefono])}
${cta("Te enseño gratis qué dice una IA de tu peluquería", "Y si tu horario de Google es el bueno. Cinco minutos, en tu móvil.", "Pídemelo")}
`,
  faq: [
    ["¿La agenda de citas usa IA?", "No. Funciona con tus reglas: servicios, duración, personas y horarios. Así no se equivoca de hora ni da una cita que no puedes atender."],
    ["¿Cuánto cuesta la agenda de citas?", "Para la web que ya tienes, 160 € + IVA y 20 €/mes con un profesional (8 € más al mes por cada profesional más). Con web nueva, 580 € + IVA y 28 €/mes. Sin comisión por cita."],
    ["¿Puedo seguir con mi aplicación de reservas?", "Sí. Si te funciona, no la cambies: te ayudo con la ficha de Google, las reseñas y lo que dice de ti una IA."],
    ["¿Quién contesta las reseñas?", "La IA prepara el borrador, yo lo reviso y tú dices «vale» antes de que se publique."],
  ],
  cierre: `Sigue leyendo: <a href="ia-para-negocios-gipuzkoa.html">IA para negocios en Gipuzkoa</a>, <a href="web-para-peluqueria-centro-estetica.html">web para peluquería y centro de estética</a> y <a href="reservas-online-sin-comisiones.html">reservas online sin comisiones</a>.`,
},
/* ------------------------------------------------------------------ 6 · casas rurales */
{
  slug: "ia-para-casas-rurales-gipuzkoa",
  fecha: FECHA,
  bodyClass: "ia-pg",
  title: "IA para casas rurales en Gipuzkoa: reservas propias y reseñas",
  headline: "IA para casas rurales en Gipuzkoa: reservas propias sin comisión, reseñas en varios idiomas y Google",
  desc: "Casas rurales de Gipuzkoa: reservas propias sin comisión con calendario, reseñas contestadas en el idioma del huésped y cómo te ven Google y las IAs.",
  ogdesc: "Reservas propias sin comisión, reseñas en el idioma del huésped y Google y las IAs, para casas rurales de Gipuzkoa.",
  keywords: "ia para casas rurales, reservas casa rural sin comision, responder reseñas casa rural, inteligencia artificial alojamiento rural, casa rural gipuzkoa reservas web",
  crumb: "IA para casas rurales",
  h1: "IA para casas rurales en Gipuzkoa",
  lede: `${FRASE} En una casa rural se va mucho tiempo en lo mismo: cuadrar calendarios, contestar las mismas preguntas y responder opiniones en tres idiomas. Las reservas te las resuelvo sin IA; las respuestas, con IA y revisadas.`,
  img: "aberri-desk", min: 5,
  area: ["Gipuzkoa"],
  cuerpo: `
<h2 id="reservas">Reservas propias, sin comisión y sin IA</h2>
<p>Tu huésped ve las noches libres en tu web y te manda la solicitud; tú la aceptas desde el móvil. Puedes enlazar tus calendarios de las plataformas para no ofrecer una noche que ya está ocupada. No lleva IA: sigue tus precios y tus reglas.</p>
<p>Es lo que tiene <a href="caso-a-berri.html">A.Berri</a>, una casa rural de Getaria con web y reservas hechas por mí (sin IA). Pack casa rural: <strong>740 € + 28 €/mes</strong>.</p>
${figura("aberri-desk", "aberricasarural.com", "Web de la casa rural A.Berri de Getaria, con reservas propias", "A.Berri, en Getaria: web publicada, con reservas por solicitud y calendario.")}

<h2 id="resenas">Reseñas en el idioma del huésped</h2>
<p>Tus huéspedes escriben en castellano, euskera, francés o inglés. Cada opinión te llega con la respuesta escrita en su idioma; tú dices «vale» y la publico. Va dentro de la cuota de 28 €/mes de tu web.</p>
${porQueResenasCorto}

<h2 id="google">Cómo te ven Google y las IAs</h2>
<p>Hay huéspedes que ya no buscan: le preguntan a una IA «casa rural cerca de la costa que admita perros». Te enseño qué contesta y si te nombra, y comparo lo que dice con tu ficha y tu web. El arreglo es la presencia en Google: <strong>120 € + IVA</strong>, una vez.</p>
${avisoIA}
${aMedida([EJ.preguntas, EJ.whatsapp])}
${cta("Te enseño gratis qué dice una IA de tu casa rural", "Te mando lo que contesta a las preguntas de un huésped y cómo se arregla lo que falla.", "Pídemelo")}
`,
  faq: [
    ["¿Las reservas de la casa rural usan IA?", "No. Funcionan con tus precios y tus reglas: el huésped manda la solicitud y tú la aceptas. Así no se reserva nada que no quieras."],
    ["¿Puedo seguir en las plataformas de reservas?", "Sí. Puedes enlazar sus calendarios con el de tu web para no ofrecer dos veces la misma noche."],
    ["¿Contestas reseñas en francés y en inglés?", "Sí: la IA prepara el borrador en el idioma del huésped, yo lo reviso y tú dices «vale». En euskera, pasa por Itzultzaile."],
    ["¿Cuánto cuesta?", "El pack casa rural, 740 € + IVA y 28 €/mes; la presencia en Google y en las IAs, 120 € + IVA una vez. Las reseñas respondidas van en la cuota."],
  ],
  cierre: `Sigue leyendo: <a href="ia-para-negocios-gipuzkoa.html">IA para negocios en Gipuzkoa</a>, <a href="caso-a-berri.html">el caso de A.Berri</a> y <a href="reservas-online-sin-comisiones.html">reservas online sin comisiones</a>.`,
},
];

/* Nodo Service para el JSON-LD de cada página. */
export const ldServicio = (a) => ld(a.area || ["Gipuzkoa"], a.ogdesc);
