/**
 * Guías de octubre de 2026 (parte B): tres sectores de las muestras
 * (fisioterapia, psicología, inmobiliaria) y la comparativa de plataformas.
 * Mismas reglas de redacción que la parte A.
 */
import { consejo, cta, figura, tabla } from "./gen-articulos-nacionales.mjs";

const FECHA = "2026-10-11";

export const ARTICULOS_B = [
/* ------------------------------------------------------------------ 6 */
{
  slug: "wordpress-wix-o-web-a-medida",
  fecha: FECHA,
  title: "WordPress, Wix o web a medida: cuál te conviene",
  headline: "WordPress, Wix o web a medida: cuál te conviene para tu negocio local",
  desc: "Comparativa sincera entre WordPress, Wix o Squarespace y una web a medida: coste real, velocidad, quién la mantiene y cuándo conviene cada una.",
  ogdesc: "WordPress, Wix o a medida: ventajas, inconvenientes y para quién sirve cada opción, sin humo.",
  keywords: "wordpress o wix, web a medida o wordpress, wix o wordpress negocio, crear web con wix, web a medida vs wordpress, plataforma para crear web negocio",
  crumb: "WordPress, Wix o a medida",
  h1: "WordPress, Wix o web a medida: <em>cuál te conviene</em>",
  lede: "No hay una opción mejor para todos. Cada una resuelve un problema distinto y trae el suyo. Te cuento cómo es cada una de verdad, incluso cuando la mejor para ti no es la que yo hago.",
  img: "stock/art-seo-local", min: 8,
  cuerpo: `
<h2 id="resumen">En una tabla</h2>
${tabla(["", "Wix / Squarespace", "WordPress", "Web a medida"], [
  ["Quién la crea", "Tú, con editor visual", "Tú o un profesional", "Un profesional"],
  ["Coste de partida", "Bajo", "Medio (alojamiento, tema, plugins)", "Pago único según alcance"],
  ["Cuota recurrente", "Sí, mientras la mantengas", "Alojamiento y, a veces, plugins de pago", "Dominio y alojamiento"],
  ["Velocidad", "Aceptable, depende de la plataforma", "Muy variable, según tema y plugins", "Alta, solo lleva lo necesario"],
  ["Cambiar cosas tú solo", "Muy fácil", "Fácil con práctica", "Pides el cambio a quien la hizo"],
  ["Mantenimiento", "Lo hace la plataforma", "Actualizaciones y seguridad constantes", "Casi nulo"],
  ["Si te vas", "Pierdes la web", "Puedes llevártela", "La web es tuya"],
])}

<h2 id="wix">Wix, Squarespace y similares</h2>
<p><strong>Para quién:</strong> quien quiere montar algo sencillo por su cuenta y asume que es una cuota mensual como la luz o el teléfono.</p>
<p><strong>Ventajas:</strong> editor visual, todo incluido, sin instalar nada, soporte de la plataforma.</p>
<p><strong>Inconvenientes:</strong> pagas mientras la tengas y no puedes llevarte el diseño a otro sitio. La velocidad y el SEO tienen techo. Los cambios de precio los decide la plataforma.</p>

<h2 id="wordpress">WordPress</h2>
<p><strong>Para quién:</strong> proyectos que van a crecer (blog, tienda grande, muchas páginas) o quien quiere gestionar contenido con frecuencia.</p>
<p><strong>Ventajas:</strong> el software es libre, hay miles de temas y plugins, y es tuyo: te lo puedes llevar a otro alojamiento.</p>
<p><strong>Inconvenientes:</strong> necesita actualizaciones constantes de WordPress, tema y plugins, o se vuelve lento e inseguro. Cada plugin añade peso y riesgo. Montarlo bien lleva tiempo.</p>

<h2 id="medida">Web a medida (código ligero)</h2>
<p><strong>Para quién:</strong> negocios locales con una web que cambia poco: horario, servicios, fotos, contacto. Es lo que hago en OI Studio, con <a href="precios.html">precio cerrado</a>.</p>
<p><strong>Ventajas:</strong> muy rápida, sin plugins que mantener, sin cuota por la herramienta y con el diseño pensado para tu negocio. La web es tuya.</p>
<p><strong>Inconvenientes:</strong> los cambios los hace quien la construyó; no tienes un panel para editar tú mismo. Para un blog que publica cada semana o una tienda con cientos de productos, no es lo más cómodo.</p>

${figura("pedala-desk", "pedala · muestra", "Muestra de web a medida para una tienda de bicis", "Una de mis muestras (marca inventada): web a medida, sin plugins y rápida.")}

<h2 id="elegir">Cómo decidir</h2>
<ul class="check">
<li><strong>¿Cambiarás cosas a menudo y quieres hacerlo tú?</strong> Wix, Squarespace o WordPress.</li>
<li><strong>¿Vas a tener un blog o muchas páginas que crecen?</strong> WordPress.</li>
<li><strong>¿Tu web cambia poco y quieres que sea rápida, ligera y tuya sin cuotas?</strong> A medida.</li>
<li><strong>¿Es un proyecto de prueba o para algo muy puntual?</strong> Una plataforma, sin gastar de más.</li>
</ul>

${consejo("Elige por cómo vas a usar la web durante tres años, no por cómo se ve hoy. Si no vas a tocarla, no pagues una herramienta para editarla; si vas a editarla cada semana, no encargues una a medida.")}

<h2 id="precio">Y el coste total</h2>
<p>Mira siempre el coste a tres años: plataforma (cuota por tres años), WordPress (alojamiento, tema, plugins y mantenimiento) o a medida (pago único más dominio y alojamiento). Tienes el desglose del mercado en la <a href="precio-diseno-web-profesional.html">guía de precios</a> y el de mantener una web en <a href="cuanto-cuesta-mantener-una-web-al-ano.html">esta otra</a>.</p>

${cta("¿No sabes cuál encaja contigo?", "Cuéntame tu negocio y te digo, aunque no sea una web a medida, qué opción te conviene.", "Pedir consejo")}
`,
  faq: [
    ["¿Es mejor WordPress o Wix?", "Depende. Wix es más sencillo y todo está incluido pero pagas mientras la uses; WordPress es más flexible y puedes llevártelo, pero necesita mantenimiento constante. Para una web sencilla ninguna de las dos es imprescindible."],
    ["¿Una web a medida es más rápida que WordPress?", "Normalmente sí, porque solo lleva el código necesario. Una WordPress bien optimizada puede ser rápida, pero requiere más cuidado."],
    ["¿Puedo cambiar mi web a medida yo mismo?", "No hay panel de edición: los cambios los hace quien la construyó. En OI Studio los pides por WhatsApp; los primeros 30 días son gratis y después con mantenimiento (25 €/mes + IVA) o con presupuesto por adelantado."],
    ["¿Qué pasa con mi web si dejo de pagar Wix?", "La pierdes: el diseño y el contenido viven en la plataforma. Con una web a medida o una WordPress alojada por ti, la web sigue siendo tuya."],
  ],
  cierre: `Sigue leyendo: <a href="landing-page-o-web-completa.html">landing o web completa</a> y <a href="cuanto-cuesta-mantener-una-web-al-ano.html">cuánto cuesta mantener una web al año</a>.`,
},

/* ------------------------------------------------------------------ 7 */
{
  slug: "web-para-fisioterapia-clinica",
  fecha: FECHA,
  title: "Web para fisioterapia: qué necesita una clínica",
  headline: "La web de una clínica de fisioterapia: qué necesita para captar pacientes",
  desc: "Qué debe tener la web de una clínica de fisioterapia: técnicas explicadas, equipo y colegiación, primera cita, precios, ubicación y textos legales.",
  ogdesc: "Qué poner en la web de una clínica de fisioterapia para atraer pacientes y que se fíen a la primera.",
  keywords: "web para fisioterapia, página web fisioterapeuta, web clínica fisioterapia, diseño web fisioterapia, web para fisioterapeuta, captar pacientes fisioterapia",
  crumb: "Web para fisioterapia",
  h1: "La web de una clínica de fisioterapia: <em>qué necesita</em>",
  lede: "Quien busca fisioterapeuta suele tener dolor y poco tiempo para decidir. Quiere saber en un minuto si tratáis lo suyo, quién lo va a tratar, dónde estáis y cómo pedir cita. Una web que responda a eso capta pacientes; una que cuente la historia del centro, no.",
  img: "arin-desk", min: 7,
  cuerpo: `
<h2 id="busca">Qué busca quien llega a tu web</h2>
<p>Casi nadie busca «fisioterapia» a secas: busca <strong>«dolor de espalda en Tolosa», «fisio para lesión de rodilla», «fisioterapeuta suelo pélvico»</strong>. Entra con un problema, no con una técnica. Por eso la web tiene que hablar primero del problema y después del tratamiento.</p>

<h2 id="imprescindible">Lo imprescindible</h2>
<ul class="check">
<li><strong>Qué tratas y para quién,</strong> en la primera pantalla: lesiones deportivas, dolor crónico, embarazo y posparto, rehabilitación tras una operación…</li>
<li><strong>Cita a un toque:</strong> teléfono, WhatsApp y, si puedes, <a href="reservas-online-sin-comisiones.html">reserva online</a>. Desde el móvil, sin tener que buscar.</li>
<li><strong>Dónde estáis y cómo llegar:</strong> dirección, aparcamiento o transporte, y horario real.</li>
<li><strong>El equipo, con nombre y cara,</strong> y el número de colegiado de cada profesional.</li>
<li><strong>Qué pasa en la primera sesión:</strong> cuánto dura, qué se hace y qué ropa llevar. Quita miedo.</li>
<li><strong>Precios claros</strong> o, al menos, el de la primera consulta y los bonos.</li>
</ul>

<h2 id="tecnicas">Las técnicas, explicadas con palabras llanas</h2>
<p>«Punción seca», «terapia manual», «neuromodulación»: tu paciente no sabe qué es. Una página por técnica con tres cosas basta: <strong>para qué sirve, cómo es la sesión y a quién le va bien</strong>. Sin tecnicismos y sin prometer resultados.</p>

${figura("arin-desk", "arin · muestra", "Muestra de web de fisioterapia con mapa del cuerpo para elegir dónde duele", "Una de mis muestras (marca inventada): un mapa del cuerpo para elegir dónde duele y la cita a un toque.")}

<p>Puedes recorrer la <a href="demos/muestras/arin-fisioterapia/">muestra de fisioterapia</a> en tu móvil para ver cómo se plantea.</p>

<h2 id="legal">Lo que no se puede olvidar</h2>
<ul class="check">
<li><strong>Datos del titular y colegiación</strong> en el aviso legal: si es profesión regulada, el colegio y el número de colegiado.</li>
<li><strong>Cuidado con la publicidad sanitaria:</strong> evita prometer curaciones o resultados garantizados y consulta a tu colegio profesional qué puedes decir. Mejor explicar que prometer.</li>
<li><strong>Formularios mínimos:</strong> nombre, teléfono y motivo en pocas palabras. Los datos de salud son de categoría especial; no pidas historial clínico por la web.</li>
<li><strong>Política de privacidad</strong> clara. Tienes la guía de <a href="aviso-legal-privacidad-cookies-web-negocio.html">textos legales</a>.</li>
</ul>

<h2 id="google">Y fuera de la web: la ficha de Google</h2>
<p>En fisioterapia, la mayoría de pacientes llegan por <strong>«fisioterapeuta cerca de mí»</strong> y por el mapa. Cuida tu <a href="google-business-profile-guia.html">ficha de Google Business</a> (categoría correcta, fotos del local, horario) y pide <a href="conseguir-resenas-google-negocio-local.html">reseñas</a> a quien se quede contento, siempre sin entrar en detalles clínicos.</p>

${consejo("Pon en la web las preguntas que haces tú por teléfono: «¿dónde te duele?», «¿desde cuándo?». Si la web ya guía esa conversación, el paciente llega con la cita medio decidida.")}

${cta("¿Tienes una clínica de fisioterapia?", "Te preparo una muestra con tu centro, gratis y sin compromiso, y un presupuesto cerrado en menos de 48 horas.", "Pedir presupuesto")}
`,
  faq: [
    ["¿Qué debe tener la web de una clínica de fisioterapia?", "Qué tratas y para quién, cita a un toque, ubicación y horario, equipo con colegiación, qué ocurre en la primera sesión, precios claros y los textos legales."],
    ["¿Puedo poner testimonios de pacientes?", "Con mucha cautela: son datos de salud y la publicidad sanitaria tiene límites. Lo más seguro son las reseñas públicas de Google, sin detalles clínicos. Confírmalo con tu colegio profesional."],
    ["¿Hace falta reserva online?", "No es obligatoria, pero ayuda: muchos pacientes piden cita fuera de horario. Si no, un botón de WhatsApp con el mensaje ya escrito funciona muy bien."],
    ["¿Cuánto cuesta la web de una clínica de fisioterapia?", "Una web de negocio con las páginas de servicios, equipo y contacto parte de 499 € + IVA en OI Studio, con precio cerrado por escrito."],
  ],
  cierre: `Sigue leyendo: <a href="web-para-psicologo-consulta.html">la web de una consulta de psicología</a> y <a href="web-para-clinica-veterinaria.html">la web de una clínica veterinaria</a>.`,
},

/* ------------------------------------------------------------------ 8 */
{
  slug: "web-para-psicologo-consulta",
  fecha: FECHA,
  title: "Web para psicólogo: qué necesita una consulta",
  headline: "La web de una consulta de psicología: qué necesita para generar confianza",
  desc: "Qué debe tener la web de un psicólogo: enfoque, primera sesión, precios, privacidad de los datos de salud, euskera y textos legales.",
  ogdesc: "La web de una consulta de psicología debe tranquilizar antes de informar. Qué poner y qué evitar.",
  keywords: "web para psicólogo, página web psicología, web consulta psicología, diseño web psicólogo, web para terapeuta, captar pacientes psicología",
  crumb: "Web para psicólogo",
  h1: "La web de una consulta de psicología: <em>qué necesita</em>",
  lede: "Pedir ayuda a un psicólogo cuesta. Quien llega a tu web suele hacerlo con dudas, a veces de noche, y la compara con otras dos o tres. Antes de informar, la web tiene que tranquilizar: tono sereno, claridad y nada que presione.",
  img: "ekhi-desk", min: 8,
  cuerpo: `
<h2 id="primero">Primero, que se sienta bien recibido</h2>
<p>El diseño de una consulta de psicología tiene que transmitir calma: colores suaves, mucho espacio, fotos reales (del espacio, no de personas sonriendo de banco de imágenes) y un lenguaje cercano. Si la web agobia, el paciente no pide cita.</p>

<h2 id="contenido">Lo que debe decir</h2>
<ul class="check">
<li><strong>Con qué ayudas, en palabras de la gente:</strong> ansiedad, duelo, relaciones, estrés, autoestima… no solo «psicología clínica».</li>
<li><strong>Cómo trabajas:</strong> enfoque, duración de las sesiones, si son individuales, de pareja o familiares, presenciales u online.</li>
<li><strong>Quién eres:</strong> formación, colegiación y una presentación humana, en primera persona.</li>
<li><strong>Cómo es la primera sesión:</strong> qué ocurre, cuánto dura, qué compromiso supone. La pregunta que más frena. Si quieres que la pidan sin llamar, puedes añadir <a href="reservas-online-sin-comisiones.html">citas online</a> a la web.</li>
<li><strong>Precio de la sesión,</strong> bonos o condiciones. Esconderlo genera desconfianza.</li>
<li><strong>Idiomas:</strong> en Euskadi, poder atender en euskera es un valor. Si lo haces, que se vea (y la web, <a href="web-bilingue-euskera-castellano.html">en los dos idiomas</a>).</li>
<li><strong>Un contacto fácil y discreto:</strong> formulario corto, correo y WhatsApp. Sin obligar a llamar.</li>
</ul>

${figura("ekhi-desk", "ekhi · muestra", "Muestra de web de psicología con tono sereno y fotos del espacio", "Una de mis muestras (marca inventada): tono sereno, el paciente elige qué le pasa y la web le cuenta cómo puede ayudarle.")}

<p>Puedes recorrer la <a href="demos/muestras/ekhi-psikologia/">muestra de psicología</a> en tu móvil para ver cómo se plantea.</p>

<h2 id="privacidad">Privacidad: más importante que en otras webs</h2>
<ul class="check">
<li><strong>Los datos de salud son de categoría especial</strong> en el RGPD. El formulario no debe pedir motivo clínico detallado: nombre, forma de contacto y, como mucho, una frase.</li>
<li><strong>Sin analítica ni píxeles de publicidad</strong> en una consulta: quien visita una web de psicología no quiere que le persigan anuncios. Además te ahorra el banner de cookies.</li>
<li><strong>Política de privacidad</strong> clara, con quién trata los datos (tú) y cómo ejercer los derechos. Tienes la guía de <a href="aviso-legal-privacidad-cookies-web-negocio.html">textos legales</a>.</li>
<li><strong>Aviso legal con colegiación:</strong> colegio y número de colegiado.</li>
</ul>

<h2 id="limites">Lo que conviene evitar</h2>
<ul class="check">
<li><strong>Prometer resultados o curas.</strong> La publicidad sanitaria tiene límites; consulta a tu colegio profesional qué puedes decir.</li>
<li><strong>Testimonios con datos clínicos.</strong> Aunque el paciente lo permita, es mejor no hacerlo público.</li>
<li><strong>Tecnicismos y diagnósticos</strong> en la portada. Quien llega no busca un manual, busca sentirse comprendido.</li>
<li><strong>Muchas ventanas emergentes y avisos.</strong> En esta web, menos es más.</li>
</ul>

<h2 id="captar">Cómo captar pacientes sin perder la discreción</h2>
<p>La mayoría de pacientes llegan por Google Maps y por recomendación. Cuida tu <a href="google-business-profile-guia.html">ficha de Google Business</a> (categoría «psicólogo», horario, fotos del espacio) y escribe en la web las búsquedas reales: «psicólogo en Tolosa», «terapia de pareja en Gipuzkoa». Una página por tipo de ayuda le dice a Google a quién atiendes.</p>

${consejo("En una consulta, cada palabra cuenta. Lee tu web en voz alta: si suena a folleto o a manual, reescríbela como si hablaras con alguien que acaba de entrar por la puerta.")}

${cta("¿Tienes una consulta de psicología?", "Te preparo una muestra con tu consulta, gratis y sin compromiso, con el tono que quieras transmitir.", "Pedir presupuesto")}
`,
  faq: [
    ["¿Qué debe tener la web de un psicólogo?", "Con qué ayudas, cómo trabajas, quién eres y tu colegiación, cómo es la primera sesión, precios, idiomas, un contacto sencillo y los textos legales, con la privacidad especialmente cuidada."],
    ["¿Puedo poner testimonios de pacientes?", "Es mejor evitarlos o limitarte a reseñas públicas sin detalles clínicos. Son datos de salud y la publicidad sanitaria tiene límites; confírmalo con tu colegio profesional."],
    ["¿Es mejor no usar analítica en la web de una consulta?", "Conviene: quien visita una web de psicología agradece no ser rastreado. Sin analítica ni publicidad tampoco necesitas banner de cookies."],
    ["¿Cuánto cuesta una web para una consulta de psicología?", "Una web de negocio con tu enfoque, primera sesión, contacto y textos legales parte de 499 € + IVA en OI Studio. Si la quieres en euskera y castellano, se presupuesta antes de empezar."],
  ],
  cierre: `Sigue leyendo: <a href="web-para-fisioterapia-clinica.html">la web de una clínica de fisioterapia</a> y <a href="web-bilingue-euskera-castellano.html">web en euskera y castellano</a>.`,
},

/* ------------------------------------------------------------------ 9 */
{
  slug: "web-para-inmobiliaria",
  fecha: FECHA,
  title: "Web para inmobiliaria: qué necesita para captar vendedores",
  headline: "La web de una inmobiliaria local: qué necesita para captar propietarios y compradores",
  desc: "Qué debe tener la web de una inmobiliaria local: fichas, tasación gratuita, zonas, certificado energético y captar propietarios sin depender de portales.",
  ogdesc: "La web de una inmobiliaria local compite con los portales: tiene que captar al propietario, no solo al comprador.",
  keywords: "web para inmobiliaria, página web inmobiliaria, diseño web inmobiliaria, web agencia inmobiliaria local, captar propietarios, tasación gratuita web",
  crumb: "Web para inmobiliaria",
  h1: "La web de una inmobiliaria local: <em>qué necesita</em>",
  lede: "Los portales ya enseñan casas mejor que cualquier web propia. Tu web no tiene que competir con ellos en cantidad, sino en lo que los portales no hacen: dar confianza a quien quiere vender y presentar tu zona como la conoces tú.",
  img: "etxea-desk", min: 7,
  cuerpo: `
<h2 id="dos">Dos clientes, dos mensajes</h2>
<p>La web de una inmobiliaria habla a dos personas: <strong>el comprador</strong>, que quiere ver casas, y <strong>el propietario</strong>, que quiere saber si puede fiarse de ti para vender la suya. Los portales captan al primero; la web propia es tu mejor oportunidad para captar al segundo.</p>

<h2 id="propietario">Para captar propietarios</h2>
<ul class="check">
<li><strong>Tasación gratuita a un toque,</strong> bien visible en la portada. Es el gancho que más contactos genera.</li>
<li><strong>Cómo vendes:</strong> pasos, tiempos y qué hace la inmobiliaria en cada uno. Quien vende por primera vez agradece saberlo.</li>
<li><strong>Casas vendidas</strong> (con permiso), con precio de venta y tiempo. Demuestra que sabes vender.</li>
<li><strong>Quién eres:</strong> el equipo con nombre y cara, años en la zona si son verificables.</li>
<li><strong>Zona que conoces:</strong> una página por pueblo o barrio donde trabajas, con cómo se mueve su mercado.</li>
</ul>

<h2 id="compradores">Para los compradores</h2>
<ul class="check">
<li><strong>Fichas completas:</strong> precio, superficie, habitaciones, planta, ascensor, estado, gastos de comunidad.</li>
<li><strong>Buenas fotos,</strong> con luz y orden. Es lo que más pesa en una ficha.</li>
<li><strong>Mapa de situación</strong> y cercanía a servicios, colegios y transporte.</li>
<li><strong>Certificado energético:</strong> la calificación energética debe aparecer en los anuncios de venta o alquiler. Conviene comprobar el formato exigido con tu gestoría o tu colegio.</li>
<li><strong>Filtros sencillos:</strong> zona, precio, tipo. Pocos y claros.</li>
</ul>

${figura("etxea-desk", "etxea · muestra", "Muestra de web de inmobiliaria con tasación gratuita y casas con su precio", "Una de mis muestras (marca inventada): portada con foto grande, tasación gratis a un toque y casas con su precio.")}

<p>Puedes recorrer la <a href="demos/muestras/etxea-inmobiliaria/">muestra de inmobiliaria</a> en tu móvil para ver cómo se plantea.</p>

<h2 id="portales">¿Y los portales?</h2>
<p>No son enemigos: son escaparate. La estrategia razonable es publicar en portales <strong>y</strong> tener tu web, donde los propietarios ven que eres una inmobiliaria real, con presencia propia y casas vendidas. Sin web, dependes de lo que decida el portal.</p>

<h2 id="seo">Cómo aparecer en Google</h2>
<p>La gente busca <strong>«inmobiliaria en Tolosa», «piso en venta en Hernani»</strong>. Una página por zona, la <a href="google-business-profile-guia.html">ficha de Google Business</a> con la dirección de la oficina y un par de <a href="conseguir-resenas-google-negocio-local.html">reseñas</a> de clientes que vendieron contigo marcan la diferencia en el mapa.</p>

<h2 id="legal">Lo legal</h2>
<ul class="check">
<li><strong>Aviso legal</strong> con datos de la empresa y, si procede, el registro de la actividad inmobiliaria en tu comunidad.</li>
<li><strong>Política de privacidad</strong> clara: la tasación y los contactos recogen datos personales. Tienes la guía de <a href="aviso-legal-privacidad-cookies-web-negocio.html">textos legales</a>.</li>
</ul>

${consejo("En la portada pon una sola acción principal: «Tasa tu casa gratis». Lo demás (buscar casas, ver el equipo) va debajo. Una portada que ofrece diez cosas no consigue ninguna.")}

${cta("¿Tienes una inmobiliaria local?", "Te preparo una muestra con tu agencia, gratis y sin compromiso, y un presupuesto cerrado en menos de 48 horas.", "Pedir presupuesto")}
`,
  faq: [
    ["¿Necesita web propia una inmobiliaria si ya está en los portales?", "Sí: los portales captan compradores, pero un propietario que quiere vender suele buscar tu nombre antes de contactarte. Una web propia da confianza y no depende de la cuota ni de las reglas de un portal."],
    ["¿Qué debe tener la web de una inmobiliaria local?", "Tasación gratuita visible, cómo vendes, casas vendidas, el equipo, fichas completas con buenas fotos, mapa, páginas por zona y los textos legales."],
    ["¿Es obligatorio el certificado energético en los anuncios?", "La calificación energética debe aparecer en los anuncios de venta o alquiler de inmuebles. Comprueba el formato exigido con tu gestoría."],
    ["¿Cuánto cuesta la web de una inmobiliaria?", "Una web de negocio con fichas, zonas y tasación parte de 499 € + IVA en OI Studio, con precio cerrado. Si necesitas sincronizar con un programa de gestión o un buscador avanzado, se presupuesta aparte antes de empezar."],
  ],
  cierre: `Sigue leyendo: <a href="seo-local-tolosa-google-maps.html">cómo aparecer en Google cuando buscan tu negocio</a> y <a href="landing-page-o-web-completa.html">landing o web completa</a>.`,
},
];
