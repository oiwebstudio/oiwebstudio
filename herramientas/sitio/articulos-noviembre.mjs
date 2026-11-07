/**
 * Guías de noviembre de 2026: publicadas el 2/11/2026 (Oier: «posiciona mi web para branding también y
 * para servicios de automatizaciones también»). A 2/11 branding.html y automatizaciones.html no tenían
 * ninguna impresión en 90 días de Search Console: hacían falta páginas que contesten lo que se busca antes
 * de contratar.
 * Mismas reglas de redacción que las partes A, B y C (primera persona, sin cifras sin fuente, títulos en
 * minúscula tras la primera palabra, FAQ visible = JSON-LD) y las de los servicios: ninguna rama promete una
 * IA que no existe y no se nombra a ningún competidor.
 *
 * Se publican con gen-articulos-nuevos.mjs. Sin versión en euskera, como el resto de las guías.
 */
import { consejo, cta, tabla } from "./gen-articulos-nacionales.mjs";

const FECHA = "2026-11-02";

export const ARTICULOS_NOV = [
/* ------------------------------------------------------------------ 1 */
{
  slug: "cuanto-cuesta-un-logo",
  fecha: FECHA,
  title: "Cuánto cuesta un logo para tu negocio en 2026",
  headline: "Cuánto cuesta un logo para tu negocio en 2026: rangos, qué debe incluir y qué preguntar",
  desc: "Cuánto cuesta un logo en 2026 según quién lo haga, qué debe incluir cobre lo que cobre y qué preguntar antes de encargarlo. Con mis precios: desde 220 € + IVA.",
  ogdesc: "Lo que cuesta un logo según quién lo haga, qué debe incluir y qué preguntar antes de encargarlo.",
  keywords: "cuanto cuesta un logo, precio logo negocio, precio diseño logotipo, diseñador de logos gipuzkoa, cuanto cuesta identidad corporativa",
  crumb: "Cuánto cuesta un logo",
  h1: "Cuánto cuesta un logo <em>para tu negocio</em>",
  lede: "Un logo puede costar 50 € o 5.000 €, y los dos se llaman igual. Te cuento qué cambia entre uno y otro, qué debe llevar cobre lo que cobre y qué preguntar para no tener que rehacerlo a los seis meses.",
  img: "stock/art-precio-web", min: 6,
  cuerpo: `
<h2 id="rangos">Lo que cuesta según quién lo haga</h2>
<p>Estos son los rangos que publica <a href="https://www.cronoshare.com/cuanto-cuesta/diseno-logotipo" rel="noopener">Cronoshare</a>, un portal de presupuestos, para España en 2026. Son orientativos, pero sirven para situarte:</p>
${tabla(["Quién lo hace", "Rango orientativo", "Qué sueles recibir"], [
  ["Generadores y plataformas baratas", "50–300 €", "Un archivo rápido, sin nadie que conozca tu negocio"],
  ["Freelance con experiencia", "350–2.200 €", "Propuestas a medida, versiones y archivos"],
  ["Estudio o agencia pequeña", "1.000–5.000 €", "Estudio previo, manual básico y aplicaciones"],
  ["Agencia de branding", "5.000–20.000 €", "Estrategia de marca completa, para empresas grandes"],
])}
<p>De los estudios de Gipuzkoa que he mirado, casi ninguno publica su precio: lo normal es pedir presupuesto. Por eso conviene saber qué estás comparando.</p>

<h2 id="por-que-cambia">Por qué cambia tanto el precio</h2>
<p>Dibujar un símbolo es la parte pequeña. Lo que mueve el precio es todo lo demás:</p>
<ul>
<li><strong>Cuántas propuestas y cuántas rondas de cambios</strong> entran. Si no está escrito, cada cambio puede salirte aparte.</li>
<li><strong>Cuántas versiones</strong> te entregan: no es lo mismo un logo en un solo color que uno preparado para fondo oscuro, una tinta y el perfil de Instagram.</li>
<li><strong>Si solo es el logo o también cómo usarlo:</strong> colores, letras, tarjeta, redes, carta o rótulo.</li>
<li><strong>Cuánto tiempo dedican a entender tu negocio</strong> antes de dibujar.</li>
</ul>

<h2 id="que-debe-incluir">Qué debe incluir un logo, cobre lo que cobre</h2>
<ul>
<li><strong>Versión en color y en una sola tinta</strong>, para sellos, facturas o un vinilo.</li>
<li><strong>Versión para fondo oscuro</strong>, porque tarde o temprano lo necesitarás.</li>
<li><strong>Icono o versión reducida</strong>, para el perfil de redes y el icono de la web.</li>
<li><strong>Archivos en vector.</strong> Es lo que permite ampliarlo a un rótulo sin que se vea borroso. Si solo te dan una imagen JPG, tendrás un problema el día que quieras imprimirlo en grande.</li>
<li><strong>Tus colores y tus letras por escrito</strong>, para que la imprenta o quien te haga la web usen los mismos.</li>
</ul>
${consejo("Antes de pagar, pide que te digan exactamente qué archivos te van a entregar. Es la pregunta que más disgustos evita.")}

<h2 id="mis-precios">Lo que cobro yo</h2>
${tabla(["Nivel", "Qué lleva", "Precio"], [
  ["Logo", "Tu logo con sus versiones: color, una tinta, fondo oscuro e icono", "220 € + IVA"],
  ["Identidad", "El logo, tus colores y letras, una hoja de marca, y la tarjeta y las redes", "440 € + IVA"],
  ["Marca completa", "La identidad, un manual corto y 3 o 4 aplicaciones: rótulo, carta o etiqueta, y plantillas", "820 € + IVA"],
])}
<p>En los tres hay dos propuestas y dos rondas de cambios, te entrego los archivos en vector y pagas al final. No hay cuota al mes si no te hago también la web. Lo tienes todo en <a href="branding.html">branding y diseño de logos</a>.</p>

<h2 id="fuera-del-precio">Lo que suele quedar fuera</h2>
<p>En mis precios, y en muchos otros, no entra inventar el nombre, imprimir, fabricar el rótulo ni hacer fotos. Tampoco registrar la marca: eso se hace en la <a href="https://www.oepm.es" rel="noopener">Oficina Española de Patentes y Marcas</a>, que cobra su tasa. Antes de cerrar el nombre, busca en su localizador si ya existe.</p>

<h2 id="que-preguntar">Qué preguntar antes de encargarlo</h2>
<ol>
<li>¿Cuántas propuestas me enseñas y cuántas rondas de cambios entran?</li>
<li>¿Qué versiones y qué archivos me entregas?</li>
<li>¿El precio lleva IVA?</li>
<li>¿Cuándo se paga y cuándo lo tengo?</li>
<li>¿Qué pasa si no me convence ninguna propuesta?</li>
</ol>
${cta("¿Quieres saber qué necesita tu negocio?", "Te digo qué nivel te encaja y te mando la propuesta en menos de 48 horas.", "Ver branding y logos", "branding.html")}
`,
  faq: [
    ["¿Cuánto cuesta un logo para un negocio pequeño?", "Según Cronoshare, un freelance con experiencia cobra entre 350 y 2.200 €, y las plataformas baratas entre 50 y 300 €. Mi logo con sus versiones cuesta 220 € + IVA."],
    ["¿Vale un logo hecho con un generador de IA?", "Te saca del paso, pero no conoce tu negocio y el resultado puede parecerse al de otros. Si vas a imprimir un rótulo o una carta, compruébalo antes y asegúrate de tener el archivo en vector."],
    ["¿Qué diferencia hay entre logo e identidad corporativa?", "El logo es el símbolo y el nombre. La identidad corporativa añade tus colores, tus letras y cómo se aplican en la tarjeta, las redes y el resto de lo que ve tu cliente."],
    ["¿El registro de la marca va incluido?", "Normalmente no. Se hace en la Oficina Española de Patentes y Marcas, que cobra su tasa. En mis precios no va incluido."],
  ],
  cierre: `Sigue leyendo: <a href="branding.html">branding y diseño de logos en Gipuzkoa</a>, <a href="branding-para-negocio-pequeno.html">branding para un negocio pequeño</a> y <a href="precio-diseno-web-profesional.html">precios de un diseño web profesional</a>.`,
},
/* ------------------------------------------------------------------ 2 */
{
  slug: "branding-para-negocio-pequeno",
  fecha: FECHA,
  title: "Branding para un negocio pequeño: qué necesitas y qué no",
  headline: "Branding para un negocio pequeño: qué necesitas de verdad y qué puedes dejar para más tarde",
  desc: "Qué es el branding para un negocio pequeño, cuándo basta con un logo, cuándo necesitas identidad corporativa y qué puedes dejar para más tarde.",
  ogdesc: "Cuándo basta con un logo, cuándo necesitas identidad y qué puedes dejar para más tarde.",
  keywords: "branding para pequeños negocios, branding negocio local, identidad corporativa pequeña empresa, branding gipuzkoa, marca para mi negocio",
  crumb: "Branding para un negocio pequeño",
  h1: "Branding para un negocio pequeño: <em>qué necesitas y qué no</em>",
  lede: "Branding suena a multinacional, pero en un negocio pequeño significa algo sencillo: que tu rótulo, tu carta, tus redes y tu web parezcan del mismo sitio. Te cuento qué necesitas según el momento en el que estás.",
  img: "stock/art-redes-sociales", min: 6,
  cuerpo: `
<h2 id="que-es">Qué es el branding, sin palabras raras</h2>
<p>Es cómo te reconoce la gente: el nombre, el logo, los colores, las letras y la forma en la que todo eso aparece allí donde te ven. Un negocio con la marca cuidada no parece más caro por capricho: parece más serio, y se recuerda mejor.</p>
<p>No necesitas un manual de cien páginas. Necesitas decidir unas pocas cosas y usarlas siempre igual.</p>

<h2 id="que-necesitas">Qué necesitas según tu momento</h2>
${tabla(["Tu situación", "Qué te basta", "Mi precio"], [
  ["Empiezas, con poco dinero y sin local", "Un logo con sus versiones", "220 € + IVA"],
  ["Tienes local o carta, y haces redes", "Identidad: logo, colores, letras, tarjeta y redes", "440 € + IVA"],
  ["Vas a hacer rótulo, carta o etiquetas, o hay más gente que usa tu marca", "Marca completa: identidad, manual corto y aplicaciones", "820 € + IVA"],
])}
<p>Empieza por lo que vas a usar este año. Lo demás se añade después, si el logo y los colores ya están bien decididos.</p>

<h2 id="senales">Señales de que tu marca te está frenando</h2>
<ul>
<li>Tu logo es una imagen borrosa que alguien te pasó por WhatsApp.</li>
<li>Cada vez que imprimes algo, los colores salen distintos.</li>
<li>Tu rótulo, tu carta y tus redes parecen de tres negocios diferentes.</li>
<li>Pides algo a la imprenta y te dicen que el archivo no les sirve.</li>
<li>Te da reparo enseñar tu tarjeta o tu perfil.</li>
</ul>

<h2 id="dejar-para-luego">Qué puedes dejar para más tarde</h2>
<ul>
<li><strong>Un manual largo.</strong> Mientras seas tú quien usa la marca, una hoja de marca es suficiente.</li>
<li><strong>Papelería impresa en cantidad.</strong> Imprime poco hasta que veas qué usas de verdad.</li>
<li><strong>Merchandising.</strong> Camisetas y tazas, cuando alguien te las pida.</li>
<li><strong>Una estrategia de marca a lo grande.</strong> Si tienes claro a qué te dedicas y a quién atiendes, ya tienes lo que necesitas para empezar.</li>
</ul>

<h2 id="colores-letras">Colores y letras: tres reglas que sirven siempre</h2>
<ul>
<li><strong>Pocos colores.</strong> Uno o dos que te identifiquen y uno neutro para el texto.</li>
<li><strong>Dos tipos de letra, como mucho.</strong> Uno con carácter para los títulos y otro que se lea bien.</li>
<li><strong>Pruébalo en pequeño.</strong> Si tu logo no se entiende en el perfil de Instagram, en un móvil, habrá que simplificarlo.</li>
</ul>
<p>Si trabajas en euskera y en castellano, comprueba también que el nombre y el lema funcionan en los dos.</p>
${consejo("Haz la marca antes que la web, o a la vez. Así la web sale con tus letras y tus colores desde el principio, y no hay que rehacer nada.")}

<h2 id="con-la-web">La marca y la web, mejor juntas</h2>
<p>La web es, muchas veces, el sitio donde más gente va a ver tu marca. Por eso diseño las dos pensando la una en la otra. Si ya tienes logo y te gusta, no hace falta tocarlo: lo importante es que se vea bien. Puedes ver <a href="branding.html">qué incluye cada nivel de branding</a> y <a href="precios.html">los precios de las webs</a>.</p>
${cta("¿Tu marca necesita un repaso?", "Cuéntame tu negocio y te digo qué merece la pena hacer ahora y qué puede esperar.", "Ver branding y logos", "branding.html")}
`,
  faq: [
    ["¿Qué es el branding de un negocio pequeño?", "Es cómo te reconoce la gente: tu nombre, tu logo, tus colores y tus letras, usados siempre igual en el rótulo, la carta, las redes y la web."],
    ["¿Logo y branding son lo mismo?", "No. El logo es una pieza. El branding es el conjunto: el logo, los colores, las letras y cómo se usan en todo lo que ve tu cliente."],
    ["¿Qué va primero, la marca o la web?", "Mejor la marca, o las dos a la vez. Así la web se construye con tus letras y tus colores desde el principio y no hay que rehacer nada."],
    ["¿Cuánto cuesta el branding para un negocio pequeño?", "Mis precios son 220 € el logo, 440 € la identidad y 820 € la marca completa, más IVA y con pago al final."],
  ],
  cierre: `Sigue leyendo: <a href="branding.html">branding y diseño de logos en Gipuzkoa</a>, <a href="cuanto-cuesta-un-logo.html">cuánto cuesta un logo</a> y <a href="que-debe-tener-web-negocio-local.html">qué debe tener la web de un negocio local</a>.`,
},
/* ------------------------------------------------------------------ 3 */
{
  slug: "que-automatizar-negocio-pequeno",
  fecha: FECHA,
  title: "Qué automatizar en un negocio pequeño y por dónde empezar",
  headline: "Qué automatizar en un negocio pequeño, qué no y por dónde empezar",
  desc: "Qué tareas de un negocio pequeño merece la pena automatizar, cuáles no, por dónde empezar y cómo saber si te compensa, con ejemplos de reservas y citas.",
  ogdesc: "Qué tareas merece la pena automatizar en un negocio pequeño, cuáles no y por dónde empezar.",
  keywords: "automatizar negocio pequeño, automatizaciones para negocios, automatizar reservas, automatizar citas, automatizacion pymes gipuzkoa",
  crumb: "Qué automatizar en un negocio",
  h1: "Qué automatizar en un negocio pequeño <em>y por dónde empezar</em>",
  lede: "Automatizar no es llenar el negocio de aplicaciones: es quitarte de encima lo que haces cada semana sin pensar. Te cuento cómo distinguir lo que merece la pena de lo que es mejor dejar como está.",
  img: "stock/sec-pelu-1", min: 7,
  cuerpo: `
<h2 id="regla">La regla para decidir</h2>
<p>Una tarea merece la pena automatizarla cuando cumple tres cosas:</p>
<ul>
<li><strong>Se repite</strong> cada día o cada semana.</li>
<li><strong>Sigue siempre las mismas reglas</strong>, sin que tengas que decidir nada.</li>
<li><strong>Si falla, no pasa nada grave</strong>, o se ve enseguida y se arregla.</li>
</ul>
<p>Si falta alguna de las tres, deja que la haga una persona, o que la máquina prepare y la persona decida.</p>

<h2 id="tareas">Tarea por tarea</h2>
${tabla(["Tarea", "¿Automatizar?", "Cómo"], [
  ["Pedir cita o mesa", "Sí, lo primero", "Desde tu web, a cualquier hora, y tú lo ves en el móvil"],
  ["Avisos y recordatorios", "Sí", "Por correo, a ti y a tu cliente"],
  ["Noches libres de una casa rural", "Sí, con cuidado", "Enlazando los calendarios de Booking y Airbnb, que se actualizan cada pocas horas"],
  ["Pasar datos entre apps", "Depende", "Cobros, facturas u hojas, si lo haces a menudo"],
  ["Responder reseñas", "A medias", "Se prepara un borrador y lo apruebas tú"],
  ["Contestar una queja", "No", "Necesita tu criterio y tu tono"],
  ["Datos de salud de pacientes", "Con mucho cuidado", "Con el programa de tu consulta, no con cualquier herramienta"],
])}

<h2 id="empezar">Por dónde empezar</h2>
<p>Durante una semana, apunta cada vez que coges el teléfono o contestas un mensaje para lo mismo. Lo que más se repita es tu primera automatización. En la mayoría de los negocios con clientes que reservan, son las citas o las mesas.</p>
<p>Empieza por una sola cosa. Cuando funcione sin que tengas que mirarla, pasa a la siguiente. Si cambias cinco cosas a la vez, no sabrás cuál te ayuda.</p>
${consejo("Prueba siempre la automatización haciéndote pasar por tu cliente, desde tu móvil. Si a ti te cuesta, a él también.")}

<h2 id="compensa">Cómo saber si te compensa</h2>
<p>La cuenta es sencilla: cuántas horas al mes te quita esa tarea, por lo que vale tu hora, frente a lo que cuesta la herramienta. Suma también lo que no se ve: las llamadas que no puedes coger en pleno servicio y las comisiones que pagas por reserva si usas una plataforma.</p>
<p>Lo que cobro yo, sin comisión por reserva:</p>
${tabla(["Qué", "Precio (+ IVA)"], [
  ["Agenda de citas para la web que ya tienes (un profesional)", "160 € + 20 €/mes, +8 € por profesional más"],
  ["Web de una página con reservas o citas", "580 € + 28 €/mes"],
  ["Restaurante o casa rural: web, reservas y presencia en Google", "740 € + 28 €/mes"],
  ["Presencia en Google: ficha, reseñas, Bing y Apple Maps", "120 €"],
])}
<p>Tienes el detalle en <a href="automatizaciones.html">automatizaciones para negocios</a> y en <a href="reservas-online-sin-comisiones.html">reservas online sin comisiones</a>.</p>

<h2 id="errores">Errores que conviene evitar</h2>
<ul>
<li><strong>Automatizar lo que no funciona.</strong> Si el proceso ya es un lío, irá igual de mal, pero más rápido.</li>
<li><strong>Quitar a la persona del todo.</strong> Tu cliente tiene que poder hablar contigo cuando lo necesite.</li>
<li><strong>Un programa para cada cosa.</strong> Tres suscripciones que no se hablan entre sí son más trabajo, no menos.</li>
<li><strong>Olvidar los datos.</strong> Si guardas datos de tus clientes, tienes que cumplir la ley de protección de datos y decírselo.</li>
</ul>
${cta("¿Qué te quita más tiempo cada semana?", "Cuéntamelo y te digo qué automatizaría, qué dejaría como está y cuánto cuesta.", "Ver las automatizaciones", "automatizaciones.html")}
`,
  faq: [
    ["¿Qué se puede automatizar en un negocio pequeño?", "Lo que se repite y sigue siempre las mismas reglas: reservas y citas, avisos por correo, calendarios y el borrador de las respuestas a reseñas. Lo que necesita tu criterio, como una queja, es mejor que lo sigas decidiendo tú."],
    ["¿Por dónde empiezo a automatizar mi negocio?", "Por lo que más se repite. Apunta durante una semana cada llamada o mensaje para lo mismo. En los negocios con clientes que reservan, suele ser la cita o la mesa."],
    ["¿Cuánto cuesta automatizar las citas?", "Con mi agenda, 160 € + 20 €/mes para la web que ya tienes, con un profesional (8 € más al mes por cada profesional más) y sin comisión por reserva. Todo + IVA."],
    ["¿Necesito saber de informática?", "No. Lo monto yo y tú solo miras tus citas o reservas en el móvil."],
  ],
  cierre: `Sigue leyendo: <a href="automatizaciones.html">automatizaciones para negocios en Gipuzkoa</a>, <a href="reservas-online-sin-comisiones.html">reservas online sin comisiones</a> e <a href="inteligencia-artificial-negocio-pequeno.html">inteligencia artificial para un negocio pequeño</a>.`,
},
/* ------------------------------------------------------------------ 4 */
{
  slug: "inteligencia-artificial-negocio-pequeno",
  fecha: FECHA,
  title: "Inteligencia artificial para un negocio pequeño: qué funciona hoy",
  headline: "Inteligencia artificial para un negocio pequeño: qué funciona hoy, qué no y qué dice la ley",
  desc: "Para qué sirve hoy la inteligencia artificial en un negocio pequeño, para qué no, qué exige la ley si hablas con clientes y por dónde empezar sin riesgos.",
  ogdesc: "Para qué sirve hoy la IA en un negocio pequeño, para qué no y qué exige la ley.",
  keywords: "inteligencia artificial para pymes, ia para negocios pequeños, automatizaciones con ia, chatbot para negocio, responder reseñas con ia",
  crumb: "IA para un negocio pequeño",
  h1: "Inteligencia artificial para un negocio pequeño: <em>qué funciona hoy</em>",
  lede: "Te dirán que la IA lo hará todo por ti. La uso a diario en mi trabajo y te cuento lo que he visto: dónde ahorra tiempo de verdad, dónde la dejaría fuera y qué tienes que tener en cuenta si la usas con tus clientes.",
  img: "stock/art-seo-local", min: 6,
  cuerpo: `
<h2 id="sirve">Para qué sirve hoy</h2>
<p>La IA es muy buena preparando un primer borrador que luego revisa una persona:</p>
<ul>
<li><strong>Responder reseñas:</strong> un borrador en el idioma de quien escribe y con tu tono. Tú solo lo apruebas.</li>
<li><strong>Escribir y corregir textos:</strong> correos, descripciones, publicaciones o la carta.</li>
<li><strong>Resumir:</strong> un correo largo, un contrato o las opiniones de tus clientes, para saber qué se repite.</li>
<li><strong>Ver cómo te encuentran:</strong> hacerle a un buscador con IA las preguntas que haría un cliente y comparar lo que contesta con tu ficha y tu web.</li>
</ul>

<h2 id="no-sirve">Dónde no la dejaría sola</h2>
<ul>
<li><strong>Contestar a clientes sin supervisión.</strong> Puede inventarse un precio, un horario o una promesa, y lo dirá muy segura.</li>
<li><strong>Las quejas.</strong> Una respuesta automática a un cliente enfadado suele empeorar las cosas.</li>
<li><strong>Datos de salud o datos delicados.</strong> No los metas en una herramienta sin saber dónde acaban.</li>
<li><strong>Las reservas.</strong> Aquí no hace falta: un sistema normal, con sus reglas, no se equivoca de día ni de hora.</li>
<li><strong>El euskera sin revisar.</strong> Yo paso los textos por Itzultzaile, el traductor neuronal del Gobierno Vasco, y aun así conviene que los lea alguien que lo hable.</li>
</ul>
${consejo("Si una tarea sale bien siguiendo unas reglas fijas, no le pongas IA. Te saldrá más barata y más fiable sin ella.")}

<h2 id="mis-servicios">Qué parte hace la IA en lo que yo monto</h2>
${tabla(["Servicio", "Qué hace la IA", "Qué hago yo o qué haces tú"], [
  ["Reservas y citas", "Nada: funcionan sin IA", "Tu cliente reserva y tú lo ves en el móvil"],
  ["Google y las IAs", "Contesta a las preguntas que haría un cliente", "Comparo la respuesta con tu ficha y tu web, y arreglo lo que falla"],
  ["Reseñas respondidas", "Redacta el borrador", "Lo reviso yo, tú dices «vale» y lo publico"],
])}
<p>No prometo ningún puesto en Google ni que una IA te nombre. Lo que sí puedo hacer es que tus datos estén bien y digan lo mismo en todas partes. Lo tienes explicado en <a href="automatizaciones.html">automatizaciones para negocios</a>.</p>

<h2 id="ley">Qué dice la ley</h2>
<p>Desde el 2 de agosto de 2026, el artículo 50 del <a href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj" rel="noopener">Reglamento europeo de IA</a> obliga a que quien habla con un sistema de IA sepa que no está hablando con una persona, salvo que resulte evidente. Si pones un chatbot en tu web o en tu WhatsApp, tiene que avisarlo.</p>
<p>Si además la herramienta trata datos de tus clientes, sigue valiendo la ley de protección de datos: tienes que saber quién los trata y contarlo en tu política de privacidad. No soy abogado: ante una duda concreta, pregunta a quien te lleve estos temas.</p>

<h2 id="empezar">Por dónde empezar</h2>
<ol>
<li>Busca tu negocio en Google y pregúntaselo a una IA con buscador: «¿dónde puedo…?». Mira si lo que contesta es verdad.</li>
<li>Pon al día tu ficha de Google y tu web, para que digan lo mismo.</li>
<li>Prueba a redactar con IA tus próximas respuestas a reseñas, y revísalas siempre antes de publicarlas.</li>
<li>Deja para más tarde el chatbot: primero, que tu web conteste lo que te preguntan siempre.</li>
</ol>
${cta("¿Quieres saber dónde te ahorraría tiempo?", "Te digo qué parte tiene sentido y qué parte no, antes de que pagues nada.", "Ver las automatizaciones", "automatizaciones.html")}
`,
  faq: [
    ["¿Para qué sirve la inteligencia artificial en un negocio pequeño?", "Para preparar borradores que luego revisa una persona: respuestas a reseñas, correos, textos y resúmenes. También para comprobar lo que contesta un buscador con IA sobre tu negocio."],
    ["¿Necesito un chatbot en mi web?", "Normalmente no es lo primero. Antes conviene que tu web conteste lo que te preguntan siempre y que se pueda reservar desde ella. Si lo pones, tiene que avisar de que es una IA."],
    ["¿Una IA puede responder sola a mis reseñas?", "Puede redactar el borrador, pero no te lo recomiendo sin revisar. Yo lo reviso y no se publica nada sin tu visto bueno."],
    ["¿Hay que avisar a los clientes de que hablan con una IA?", "Sí. Desde el 2 de agosto de 2026, el artículo 50 del Reglamento europeo de IA obliga a informar de ello, salvo que resulte evidente."],
  ],
  cierre: `Sigue leyendo: <a href="automatizaciones.html">automatizaciones para negocios en Gipuzkoa</a>, <a href="que-automatizar-negocio-pequeno.html">qué automatizar en un negocio pequeño</a> y <a href="conseguir-resenas-google-negocio-local.html">cómo conseguir reseñas en Google</a>.`,
},
];
