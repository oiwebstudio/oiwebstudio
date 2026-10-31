/**
 * Guías de octubre de 2026 (parte A): pensadas a partir de las búsquedas reales
 * de Search Console (11/10/2026) y de lo que más pregunta quien va a encargar
 * una web. Las genera gen-articulos-nuevos.mjs con la misma carcasa que el resto.
 *
 * Reglas de redacción: primera persona del singular, «atraer/captar clientes»,
 * precios siempre + IVA, nada de «proyecto real» para las muestras, cifras solo
 * si tienen fuente.
 */
import { consejo, cta, figura, tabla } from "./gen-articulos-nacionales.mjs";

const FECHA = "2026-10-11";

export const ARTICULOS_A = [
/* ------------------------------------------------------------------ 1 */
{
  slug: "diseno-web-profesional-que-incluye",
  fecha: FECHA,
  title: "Diseño web profesional: qué incluye y en qué se nota",
  headline: "Diseño web profesional: qué incluye, en qué se diferencia de una plantilla y cómo reconocerlo",
  desc: "Qué es un diseño web profesional para un negocio local: qué incluye de verdad, en qué se nota frente a una plantilla y cómo comprobarlo antes de pagar.",
  ogdesc: "Qué incluye una web profesional, en qué se nota y cómo comprobarlo antes de contratar.",
  keywords: "diseño web profesional, página web profesional, web profesional, qué incluye una web profesional, diseño web a medida, web profesional negocio local",
  crumb: "Diseño web profesional",
  h1: "Diseño web profesional: <em>qué incluye de verdad</em>",
  lede: "«Web profesional» lo dice todo el mundo, incluso quien te monta una plantilla en una tarde. Aquí va una lista concreta de lo que debe incluir una web para llamarse así, cómo comprobarlo tú mismo y qué señales indican que te están vendiendo humo.",
  img: "etxea-desk", min: 7,
  cuerpo: `
<h2 id="que-es">Qué significa «profesional» en una web</h2>
<p>No significa cara ni complicada. Una web profesional es la que <strong>cumple su trabajo</strong>: que quien te busca entienda en cinco segundos qué haces, dónde estás y cómo contactarte, que cargue rápido en el móvil y que Google pueda leerla bien. El resto (animaciones, efectos, secciones de más) es decoración.</p>
<p>Por eso una landing de una página bien hecha es más profesional que una web de veinte páginas con textos de relleno. Lo que cuenta es el criterio, no el tamaño.</p>

<h2 id="incluye">Qué debe incluir</h2>
<ul class="check">
<li><strong>Un diseño pensado para tu negocio.</strong> Tu actividad, tus colores y tus clientes, no una plantilla con el logo cambiado.</li>
<li><strong>Adaptación real al móvil.</strong> No «se ve en el móvil»: se ha diseñado y probado primero ahí, con botones que se pulsan bien y el teléfono a un toque.</li>
<li><strong>Velocidad.</strong> Poco peso, imágenes optimizadas y sin plugins que no usas. Puedes medirlo gratis en PageSpeed Insights.</li>
<li><strong>SEO básico bien hecho.</strong> Un título y una descripción por página, encabezados con sentido, nombre del pueblo o ciudad donde toca y datos para que Google entienda tu negocio.</li>
<li><strong>Textos claros.</strong> Qué haces, para quién, cuánto cuesta (o cómo se calcula) y cómo pedirlo. Sin frases vacías.</li>
<li><strong>Textos legales.</strong> Aviso legal y política de privacidad con tus datos. Tienes una guía aparte sobre <a href="aviso-legal-privacidad-cookies-web-negocio.html">lo que exige la ley</a>.</li>
<li><strong>Dominio y alojamiento a tu nombre,</strong> con HTTPS desde el primer día.</li>
<li><strong>Qué pasa después.</strong> Quién hace los cambios, cuánto cuesta y en cuánto tiempo.</li>
</ul>

<h2 id="plantilla">En qué se nota frente a una plantilla</h2>
${tabla(["Aspecto", "Web de plantilla", "Web profesional a medida"], [
  ["Diseño", "El mismo que otros cien negocios", "Hecho para tu actividad"],
  ["Velocidad", "Suele arrastrar código que no usa", "Solo lleva lo necesario"],
  ["Móvil", "Se adapta, a veces a medias", "Se diseña primero para el móvil"],
  ["Textos", "Genéricos, de relleno", "Escritos con tus servicios y tu zona"],
  ["Propiedad", "Depende de la plataforma", "Dominio y web a tu nombre"],
])}
<p>Una plantilla no es mala por sí misma: para un proyecto personal o para probar una idea puede bastar. El problema aparece cuando te la venden como «diseño profesional a medida» y es lo mismo con otro logo.</p>

${figura("etxea-desk", "etxea · muestra", "Muestra de web de inmobiliaria con foto grande y tasación gratis", "Una de mis muestras (marca inventada): lo importante arriba, casas con su precio y un solo botón principal.")}

<h2 id="comprobar">Cómo comprobarlo antes de pagar</h2>
<ol>
<li><strong>Pide ejemplos online, no capturas.</strong> Ábrelos en tu móvil y mira cómo cargan. Las <a href="trabajos.html">muestras de OI Studio</a> están publicadas para eso.</li>
<li><strong>Pasa PageSpeed Insights</strong> a uno de esos ejemplos. No hace falta un 100, pero sí que no esté en rojo.</li>
<li><strong>Pregunta qué incluye y qué no:</strong> dominio, alojamiento, textos legales, cambios posteriores.</li>
<li><strong>Pide el precio por escrito y desglosado.</strong> Si todo va en una cuota mensual sin explicar, desconfía.</li>
<li><strong>Comprueba que el dominio va a tu nombre.</strong> Si te lo registran a nombre de otro, la web no es tuya.</li>
</ol>

<h2 id="precio">Cuánto cuesta una web profesional</h2>
<p>En el mercado local verás desde unos cientos de euros hasta varios miles, según quién la haga y qué incluya. En OI Studio una web de una página cuesta 420 € + IVA y una web con secciones 540 € + IVA, con el <a href="precios.html">precio cerrado por escrito</a>. El desglose completo del mercado está en la <a href="precio-diseno-web-profesional.html">guía de precios</a>.</p>

${consejo("Una web profesional se nota en lo que no tiene: ni diez fuentes distintas, ni un carrusel que nadie mira, ni cuatro formas de contactar que se pisan. Lo bueno de verdad suele ser sencillo.")}

${cta("¿Quieres ver cómo quedaría la tuya?", "Dime el nombre de tu negocio y te preparo una muestra con tus datos, gratis y sin compromiso.", "Pedir una muestra")}
`,
  faq: [
    ["¿Qué es un diseño web profesional?", "Una web hecha para cumplir un objetivo concreto de tu negocio: que te encuentren, que se entienda qué haces y que sea fácil contactarte. Incluye diseño a medida, adaptación al móvil, velocidad, SEO básico, textos claros y los textos legales."],
    ["¿Una web hecha con plantilla puede ser profesional?", "Puede ser correcta, pero rara vez es a medida ni está optimizada. Si te la venden como diseño exclusivo, pide ver ejemplos distintos entre sí y comprueba su velocidad en el móvil."],
    ["¿Cuánto cuesta una web profesional para un negocio local?", "Depende del alcance. En OI Studio, una web de una página desde 420 € + IVA y una web con secciones desde 540 € + IVA, con precio cerrado por escrito. En el mercado hay presupuestos desde unos cientos de euros hasta varios miles."],
    ["¿Cómo sé si una web es profesional?", "Ábrela en el móvil: debe entenderse qué hace el negocio sin hacer scroll, cargar rápido y tener teléfono o WhatsApp a un toque. Después mira si tiene aviso legal, HTTPS y un título propio en cada página."],
  ],
  cierre: `Sigue leyendo: <a href="precio-diseno-web-profesional.html">cuánto cuesta un diseño web profesional</a> y <a href="que-debe-tener-web-negocio-local.html">qué debe tener la web de un negocio local</a>.`,
},

/* ------------------------------------------------------------------ 2 */
{
  slug: "diseno-web-barato-merece-la-pena",
  fecha: FECHA,
  title: "Diseño web barato: cuándo merece la pena y cuándo no",
  headline: "Diseño web barato: cuándo merece la pena, qué esperar y dónde están las trampas",
  desc: "Qué esperar de una web barata, cuándo merece la pena, qué comprobar en el presupuesto y cuánto cuesta de verdad una web sencilla para un negocio local.",
  ogdesc: "Barato no es lo mismo que malo, pero hay trampas. Qué mirar antes de pagar una web económica.",
  keywords: "diseño web barato, página web barata, web barata negocio, cuánto cuesta una web, precio diseño web, web económica, landing barata",
  crumb: "Diseño web barato",
  h1: "Diseño web barato: <em>cuándo merece la pena</em>",
  lede: "Barato no es sinónimo de malo, ni caro de bueno. Una web sencilla puede costar poco y funcionar muy bien; lo que no funciona es pagar poco por algo que no te corresponde. Estas son las preguntas que separan una ganga de una trampa.",
  img: "stock/art-precio-web", min: 7,
  cuerpo: `
<h2 id="posible">¿Se puede tener una buena web sin gastar mucho?</h2>
<p>Sí, si el alcance es pequeño. Un negocio local con uno o dos servicios claros no necesita veinte páginas: necesita una <a href="landing-page-o-web-completa.html">landing bien hecha</a> con lo esencial. Eso se puede hacer por unos cientos de euros, o menos, cuando la hace una sola persona sin estructura de agencia.</p>
<p>Lo que sube el precio es el alcance (reservas, tienda, varios idiomas, muchas páginas), no la calidad del trabajo. Por eso la pregunta útil no es «¿cuánto cuesta?» sino «¿qué incluye por ese precio?».</p>

<h2 id="trampas">Las trampas más habituales</h2>
<ul class="check">
<li><strong>La cuota mensual eterna.</strong> «Web gratis» o «web por 20 €/mes» que se paga mientras la tengas y no te llevas si te vas.</li>
<li><strong>El dominio a nombre de otro.</strong> Si lo registra el proveedor a su nombre, la web depende de él.</li>
<li><strong>La permanencia.</strong> Contratos de 12 a 36 meses «para amortizar el diseño».</li>
<li><strong>Lo que no se dice:</strong> alojamiento, textos legales, cambios posteriores o fotos, que luego se cobran aparte.</li>
<li><strong>La plantilla disfrazada.</strong> Un diseño comprado con tus textos pegados, vendido como «a medida».</li>
<li><strong>Precio sin IVA que no se aclara.</strong> Los 300 € que se convierten en 363 € en la factura.</li>
</ul>

<h2 id="precios">Precios de referencia</h2>
${tabla(["Qué compras", "Orden de precio", "Qué suele pasar"], [
  ["Web gratis de plataforma", "0 € al principio", "Publicidad ajena, dominio de la plataforma y cuotas si quieres quitarla"],
  ["Plantilla con cuota mensual", "10–40 €/mes", "Pagas mientras la uses; si te vas, te quedas sin web"],
  ["Landing a medida (1 página)", "Desde 420 € + IVA <a href=\"precios.html\">en OI Studio</a>", "Pago único, dominio y alojamiento el primer año"],
  ["Web a medida de varias páginas", "Desde 540 € + IVA <a href=\"precios.html\">en OI Studio</a>", "Pago único, más contenido y SEO básico"],
])}
<p>Son órdenes de magnitud, no ofertas: las cuotas de las plataformas cambian y conviene mirarlas en cada caso. El mercado completo, con rangos de freelance y agencia, está en la <a href="precio-diseno-web-profesional.html">guía de precios</a>.</p>

<h2 id="preguntas">Seis preguntas antes de pagar</h2>
<ol>
<li>¿El precio es único o hay cuota mensual? ¿Cuánto en total a tres años?</li>
<li>¿A nombre de quién queda el dominio?</li>
<li>¿Hay permanencia? ¿Puedo irme con mi web?</li>
<li>¿Qué incluye exactamente: páginas, textos, fotos, aviso legal, SEO básico?</li>
<li>¿Quién hace los cambios después y a qué precio?</li>
<li>¿Puedo ver ejemplos online abiertos en mi móvil?</li>
</ol>

${consejo("Compara siempre el coste a tres años, no el de hoy, y mira qué paga cada cuota. Una plataforma de 20 € al mes sale por 720 € y la web nunca es tuya; la mía de 540 € + IVA lleva una cuota de 28 €/mes con dominio, alojamiento, copias de seguridad y hasta 3 cambios al mes, y la web queda a tu nombre.")}

<h2 id="ayudas">Y si lo que quieres es pagar menos</h2>
<p>Algunos ayuntamientos de Gipuzkoa subvencionan parte de la web de un negocio. Tienes el mapa y los plazos en la <a href="ayudas-subvenciones-pagina-web-gipuzkoa.html">guía de ayudas</a>: a veces cubren una parte importante del coste.</p>

${cta("¿Cuánto costaría tu web?", "Cuéntame tu negocio y te doy el precio cerrado por escrito en menos de 48 horas.", "Pedir presupuesto")}
`,
  faq: [
    ["¿Cuánto cuesta una web barata?", "Las hay gratis (con condiciones), con cuota mensual de decenas de euros o de pago único desde unos cientos. En OI Studio una web de una página cuesta desde 420 € + IVA y una web con secciones desde 540 € + IVA, con precio cerrado, más la cuota de 28 €/mes que incluye dominio, alojamiento, copias de seguridad y hasta 3 cambios al mes."],
    ["¿Una web barata es peor?", "No necesariamente: el alcance es lo que cambia el precio. Es peor cuando es una plantilla vendida como a medida, cuando tiene cuotas escondidas o cuando el dominio no queda a tu nombre."],
    ["¿Qué debo comprobar en un presupuesto económico?", "Que el precio sea cerrado y con IVA aclarado, que el dominio vaya a tu nombre, que no haya permanencia, qué incluye y quién hace los cambios después."],
    ["¿Compensa una web de plataforma con cuota mensual?", "Puede servir para empezar, pero si dejas de pagar te quedas sin web y no te la puedes llevar. Compara siempre el coste total a tres años, con las cuotas incluidas, y quién es el dueño del dominio."],
  ],
  cierre: `Sigue leyendo: <a href="precio-diseno-web-profesional.html">cuánto cuesta una web profesional</a> y <a href="cuanto-cuesta-mantener-una-web-al-ano.html">cuánto cuesta mantenerla al año</a>.`,
},

/* ------------------------------------------------------------------ 3 */
{
  slug: "diseno-web-donostia-agencia-o-freelance",
  fecha: FECHA,
  title: "Agencia o freelance en Donostia: cómo elegir quién hace tu web",
  headline: "Agencia o freelance en Donostia: cómo elegir quién hace tu web y qué preguntar",
  desc: "Agencia, freelance o estudio pequeño para la web de tu negocio en Donostia-San Sebastián: diferencias, precios orientativos y qué preguntar.",
  ogdesc: "Agencia o freelance en Donostia: qué cambia en precio, trato y resultado, y cómo elegir.",
  keywords: "diseño web Donostia, diseño web San Sebastián, diseñador web freelance Donostia, agencia diseño web San Sebastián, páginas web Donostia, crear página web Donosti",
  crumb: "Diseño web en Donostia",
  h1: "Diseño web en Donostia: <em>agencia o freelance</em>",
  lede: "En Donostia hay desde grandes agencias hasta diseñadores que trabajan solos desde casa. Para el negocio de un barrio la mejor opción no es siempre la más grande: depende de qué necesitas, cuánto quieres gastar y con quién prefieres hablar.",
  img: "pedala-desk", min: 7,
  cuerpo: `
<h2 id="opciones">Tres opciones, tres maneras de trabajar</h2>
${tabla(["", "Agencia", "Freelance / estudio pequeño"], [
  ["Trato", "Un comercial y un equipo que no ves", "Hablas con quien hace la web"],
  ["Plazos", "Más largos, por procesos", "Más cortos y flexibles"],
  ["Precio orientativo", "1.500–6.000 € una web completa", "300–1.500 € una web completa"],
  ["Alcance", "Proyectos grandes, varias disciplinas", "Webs de negocio, ajustadas y claras"],
  ["Riesgo", "Cuotas y permanencias en algunas", "Depende de una sola persona"],
])}
<p>Son rangos del mercado español para negocios locales (hay más detalle en la <a href="precio-diseno-web-profesional.html">guía de precios</a>). Una agencia tiene sentido si necesitas marca, campañas, tienda compleja o varias personas trabajando a la vez. Para la web de un comercio, un despacho o una consulta, lo habitual es que un freelance o un estudio pequeño te dé justo lo que necesitas por menos.</p>

<h2 id="elegir">Qué preguntar a cualquiera de los dos</h2>
<ul class="check">
<li><strong>Ejemplos online que puedas abrir en el móvil,</strong> no solo capturas.</li>
<li><strong><a href="precios.html">Precio cerrado por escrito</a></strong> y qué incluye: dominio, alojamiento, textos, fotos y cambios después.</li>
<li><strong>A nombre de quién queda el dominio.</strong> Tiene que ser el tuyo.</li>
<li><strong>Quién hace los cambios y cuánto cuesta.</strong> Y en cuánto tiempo.</li>
<li><strong>Quién trabaja en tu proyecto.</strong> Una persona concreta, no «el equipo».</li>
</ul>

<h2 id="cerca">¿Importa que esté en Donostia?</h2>
<p>Menos de lo que parece. El trabajo se hace a distancia y las reuniones caben en una videollamada o en un café. Lo que sí ayuda a un negocio local es que quien hace la web conozca cómo busca la gente de la zona: los nombres de los barrios, cómo se llama cada cosa y qué se espera de un local de Gros, del Centro o de Egia.</p>
<p>OI Studio es un estudio de una persona, con base en Tolosa, a unos 26 km de Donostia. Si quieres que la primera reunión sea en tu local, me acerco; si no, lo hacemos todo desde el móvil. Tienes los detalles en la <a href="zonas/donostia-san-sebastian.html">página de diseño web en Donostia</a>.</p>

${figura("pedala-desk", "pedala · muestra", "Muestra de web de tienda de bicicletas con cartel en blanco y negro", "Una de mis muestras (marca inventada): un negocio de barrio con personalidad propia.")}

<h2 id="competencia">Lo que sí cambia en Donostia: la competencia</h2>
<p>En una ciudad con tanta oferta, salir en Google para «diseño web Donostia» es difícil; pero a tu negocio no le hace falta salir ahí. Le hace falta salir cuando alguien busca <em>lo que tú haces</em> en <em>tu zona</em>: «fisioterapeuta en Gros», «peluquería en Egia». Para eso mandan la <a href="google-business-profile-guia.html">ficha de Google Business</a>, las reseñas y una web que diga con claridad qué haces y dónde.</p>

${consejo("En una ciudad grande, piensa en tu barrio. Es más fácil ser el primero para «tu servicio + tu barrio» que para «tu servicio + Donostia», y es justo el cliente que de verdad viene a tu local.")}

${cta("¿Tienes un negocio en Donostia?", "Cuéntame qué haces y te preparo una propuesta con precio cerrado y una muestra con tu negocio, sin compromiso.", "Pedir presupuesto")}
`,
  faq: [
    ["¿Cuánto cuesta una página web en Donostia?", "Depende de quién la haga y del alcance: en agencia, entre 1.500 y 6.000 € una web completa; con un freelance o estudio pequeño, entre 300 y 1.500 €. En OI Studio, desde 420 € + IVA una web de una página y desde 540 € + IVA una web con secciones."],
    ["¿Agencia o freelance para un negocio pequeño?", "Para un comercio, un despacho o una consulta suele bastar un freelance o estudio pequeño: trato directo, plazos cortos y menos coste. La agencia compensa en proyectos grandes con varias disciplinas."],
    ["¿Tiene que estar el diseñador en Donostia?", "No. El trabajo se hace a distancia. Lo importante es que conozca cómo busca la gente de tu zona y que sea una persona con quien puedas hablar."],
    ["¿Trabajáis con negocios de Donostia?", "Sí. OI Studio trabaja con negocios de toda Gipuzkoa. Estoy en Tolosa, a 26 km, y me acerco a Donostia si prefieres la primera reunión en tu local."],
  ],
  cierre: `Sigue leyendo: <a href="como-elegir-disenador-web-gipuzkoa.html">8 preguntas para elegir diseñador web en Gipuzkoa</a> y <a href="seo-local-tolosa-google-maps.html">cómo aparecer en Google cuando buscan tu negocio</a>.`,
},

/* ------------------------------------------------------------------ 4 */
{
  slug: "web-para-empresa-industrial-gipuzkoa",
  fecha: FECHA,
  title: "Web para empresa industrial en Gipuzkoa: qué necesita",
  headline: "Web para una empresa industrial en Gipuzkoa: qué necesita para que te encuentren y se fíen",
  desc: "Qué debe tener la web de una empresa industrial o taller de mecanizado en Gipuzkoa: capacidades, certificaciones, catálogo, idiomas y captar clientes B2B.",
  ogdesc: "La web de una empresa industrial no vende al público: tiene que convencer a un comprador técnico. Qué incluir.",
  keywords: "web industrial Gipuzkoa, página web empresa industrial, web mecanizado, web para pyme industrial, diseño web industria País Vasco, web B2B",
  crumb: "Web para empresa industrial",
  h1: "Web para una empresa industrial: <em>qué necesita de verdad</em>",
  lede: "Gipuzkoa es tierra de industria, pero muchas webs industriales parecen un folleto de hace veinte años: no dicen qué fabrican, ni con qué capacidad, ni cómo pedir presupuesto. El cliente es un comprador técnico con poco tiempo; la web tiene que ponérselo fácil.",
  img: "taller-desk", min: 7,
  cuerpo: `
<h2 id="cliente">A quién le hablas</h2>
<p>En una web industrial no vendes al público: hablas con un <strong>comprador, un ingeniero o un responsable de compras</strong> que está comparando proveedores. Quiere saber en un minuto si puedes fabricar lo que necesita, con qué calidad y en qué plazos. Si no lo encuentra, pasa al siguiente.</p>

<h2 id="contenido">Lo que debe verse en la primera pantalla</h2>
<ul class="check">
<li><strong>Qué haces, con palabras del sector.</strong> «Mecanizado CNC de precisión», «matricería», «calderería», no «soluciones industriales».</li>
<li><strong>Dónde estás.</strong> El pueblo y la comarca. Muchos compradores buscan «proveedor + zona».</li>
<li><strong>Un botón claro para pedir presupuesto,</strong> con teléfono y correo del departamento comercial.</li>
</ul>

<h2 id="capacidades">Capacidades, certificaciones y sectores</h2>
<p>Es el bloque que más se mira y el que más se descuida. Conviene una página que recoja:</p>
<ul class="check">
<li><strong>Procesos y maquinaria:</strong> tipos de máquina, tamaños máximos, tolerancias, materiales con los que trabajas.</li>
<li><strong>Certificaciones:</strong> ISO u otras que tengas vigentes, con su número y entidad si quieres dar confianza (solo las que de verdad tengas).</li>
<li><strong>Sectores a los que sirves:</strong> automoción, máquina-herramienta, energía, etc., si puedes mencionarlos.</li>
<li><strong>Referencias o casos,</strong> con permiso de los clientes. Si no se pueden nombrar, describe el tipo de pieza o proyecto.</li>
<li><strong>Plazos y series:</strong> si haces prototipos, series cortas o series largas.</li>
</ul>

<h2 id="catalogo">Catálogo y fichas técnicas</h2>
<p>Si tienes producto propio, una ficha por producto con foto, características y descarga del PDF técnico. El PDF puede estar, pero no debe ser lo único: Google lee mejor una página que un documento suelto, y el comprador busca antes en la web que en el correo.</p>

<h2 id="idiomas">Idiomas</h2>
<p>Si exportas o trabajas con clientes de otros países, una versión en inglés (y a veces francés o alemán) marca la diferencia. Dentro de Euskadi, castellano y euskera: ten en cuenta que <a href="web-bilingue-euskera-castellano.html">las dos versiones tienen que ser páginas reales,</a> no un traductor encima.</p>

<h2 id="seo">Cómo captar clientes industriales con la web</h2>
<ul class="check">
<li><strong>Una página por servicio o proceso,</strong> con la zona nombrada: «mecanizado CNC en Eibar», «calderería en Goierri».</li>
<li><strong>Ficha de Google Business</strong> con la dirección de la nave, el horario y las fotos del taller: a la gente de la zona le sirve y a Google le da señales de que existes.</li>
<li><strong>Fotos reales de la nave, la maquinaria y las piezas.</strong> Un buen par de fotos de pieza terminada vale más que un banco de imágenes.</li>
<li><strong>Velocidad y móvil.</strong> También los compradores consultan desde el móvil, a veces en una feria.</li>
</ul>

${consejo("Pon en la web lo que le dirías a un comprador por teléfono en los primeros dos minutos: qué fabricas, qué materiales, qué cantidades y cuánto tardas. Si eso no está, no hay web que lo arregle.")}

<h2 id="cuanto">Cuánto cuesta</h2>
<p>Una web de negocio de varias páginas, con las capacidades, los procesos y el contacto bien explicados, parte de 540 € + IVA en OI Studio, con precio cerrado por escrito. Si necesitas catálogo grande, área de clientes o varios idiomas, se presupuesta aparte antes de empezar. Más información en la <a href="precios.html">página de precios</a>.</p>

${cta("¿Tienes una empresa o taller en Gipuzkoa?", "Cuéntame qué fabricas o qué servicio ofreces y te preparo una propuesta con precio cerrado en menos de 48 horas.", "Pedir presupuesto")}
`,
  faq: [
    ["¿Necesita web una empresa industrial pequeña?", "Sí: los compradores comparan proveedores en internet antes de pedir presupuesto. Una web sencilla con capacidades, certificaciones y contacto claro ya te pone en la lista de candidatos."],
    ["¿Qué debe incluir la web de una empresa de mecanizado?", "Procesos y maquinaria, materiales y tolerancias, certificaciones vigentes, sectores a los que sirves, fotos reales de la nave y las piezas, y un botón claro para pedir presupuesto."],
    ["¿Es útil tener la web en inglés?", "Si exportas o trabajas con clientes extranjeros, sí. Dentro de Euskadi conviene tener también castellano y euskera como páginas reales."],
    ["¿Cuánto cuesta una web industrial?", "Una web de negocio de varias páginas parte de 540 € + IVA en OI Studio, con precio cerrado. Si hace falta catálogo grande, área privada o varios idiomas, se presupuesta aparte."],
  ],
  cierre: `Sigue leyendo: <a href="web-para-taller-mecanico.html">la web de un taller mecánico</a> y <a href="landing-page-o-web-completa.html">landing o web completa</a>.`,
},

/* ------------------------------------------------------------------ 5 */
{
  slug: "aviso-legal-privacidad-cookies-web-negocio",
  fecha: FECHA,
  title: "Aviso legal, privacidad y cookies en la web de tu negocio",
  headline: "Aviso legal, política de privacidad y cookies: qué necesita la web de tu negocio",
  desc: "Qué textos legales exige la ley a la web de un negocio (LSSI y RGPD): aviso legal, privacidad y cookies, cuándo hace falta cada uno y errores habituales.",
  ogdesc: "Qué exige la ley a la web de un negocio: aviso legal, privacidad y cookies, explicado sin jerga.",
  keywords: "aviso legal web, política de privacidad web, política de cookies, LSSI RGPD página web negocio, textos legales web autónomo, aviso legal obligatorio",
  crumb: "Textos legales de la web",
  h1: "Aviso legal, privacidad y cookies: <em>lo que tu web necesita</em>",
  lede: "Casi todos los negocios tienen web sin saber si cumple la ley. La buena noticia es que, para un negocio local sencillo, lo que hace falta es poco y se resuelve de una vez. Aquí va lo esencial, sin jerga. No es asesoramiento jurídico: si dudas, consúltalo con tu gestoría.",
  img: "stock/art-redes-sociales", min: 8,
  cuerpo: `
<h2 id="tres">Tres textos distintos</h2>
${tabla(["Texto", "Para qué sirve", "¿Siempre hace falta?"], [
  ["Aviso legal", "Identifica a quien está detrás de la web", "Sí, si hay actividad económica"],
  ["Política de privacidad", "Explica qué haces con los datos que te dan", "Sí, si recoges datos (formulario, correo, WhatsApp)"],
  ["Política de cookies", "Informa y pide permiso para cookies no necesarias", "Solo si usas cookies que no son técnicas"],
])}

<h2 id="aviso">El aviso legal</h2>
<p>La Ley de Servicios de la Sociedad de la Información (LSSI, art. 10) obliga a quien ofrece servicios o tiene actividad económica en internet a que su web muestre, de forma permanente y fácil de encontrar:</p>
<ul class="check">
<li>Nombre o denominación social, domicilio y <strong>NIF</strong>.</li>
<li>Un correo electrónico y otro medio de contacto directo.</li>
<li>Los datos del Registro Mercantil, si la empresa está inscrita.</li>
<li>Si tu profesión está regulada (fisioterapia, psicología, abogacía…): el <strong>colegio profesional, el número de colegiado</strong> y el título.</li>
</ul>
<p>Suele ponerse en un enlace del pie de página, visible desde todas las páginas. Aunque no vendas online, si tu web promociona tu actividad, te afecta.</p>

<h2 id="privacidad">La política de privacidad</h2>
<p>En cuanto la web recoge datos personales (un formulario de contacto, una reserva, un enlace a tu correo), el Reglamento General de Protección de Datos (RGPD) exige informar de:</p>
<ul class="check">
<li><strong>Quién es el responsable</strong> (tú) y cómo contactarte.</li>
<li><strong>Para qué usas los datos</strong> (responder a la consulta, gestionar una reserva…).</li>
<li><strong>Con qué base legal</strong> (consentimiento, ejecución de un contrato, interés legítimo).</li>
<li><strong>A quién se comunican</strong> (el alojamiento, el servicio de correo, WhatsApp si lo usas) y si salen de la Unión Europea.</li>
<li><strong>Cuánto tiempo los guardas</strong> y cómo ejercer los derechos de acceso, rectificación, supresión y demás.</li>
<li>Que se puede reclamar ante la <strong>Agencia Española de Protección de Datos</strong>.</li>
</ul>
<p>Si el formulario se basa en el consentimiento, la casilla de aceptar la política <strong>no debe venir marcada de antemano</strong>.</p>

<h2 id="cookies">Las cookies</h2>
<p>Las cookies <strong>técnicas</strong> (las imprescindibles para que la web funcione o recordar el idioma) no necesitan consentimiento. Las de <strong>analítica y publicidad</strong> sí, con un aviso que permita aceptar o rechazar con la misma facilidad y que no cargue nada antes de que decidas.</p>
<p>La forma más sencilla de cumplir es no usarlas: una web sin analítica ni publicidad, como esta, puede ahorrarse el banner. Si usas Google Analytics, píxeles de Meta o mapas y vídeos incrustados que instalan cookies, necesitas el aviso.</p>

<h2 id="terceros">Un detalle que se olvida: los servicios de terceros</h2>
<p>Cada vez que tu web carga algo de Google, Meta u otro servicio, el navegador del visitante les envía su dirección IP. Un tribunal de Múnich (2022) condenó a una web por cargar Google Fonts desde los servidores de Google sin consentimiento. La solución es sencilla: alojar las fuentes y las librerías en tu propio dominio. Es lo que he hecho en esta web.</p>

<h2 id="errores">Errores habituales</h2>
<ul class="check">
<li>Copiar el aviso legal de otra web, con los datos de otro.</li>
<li>Poner «Aviso legal» sin NIF ni domicilio.</li>
<li>Decir «no cedemos datos a terceros» cuando el formulario va a un servicio externo.</li>
<li>Un banner de cookies que dice «Aceptar» en grande y esconde «Rechazar».</li>
<li>No actualizar los textos cuando cambia algo (de forma jurídica, de dirección, de herramienta).</li>
</ul>

${consejo("Los textos legales buenos son cortos y están hechos con tus datos reales. Mejor un aviso legal sencillo y cierto que uno larguísimo copiado de otra web. Y que lo revise tu gestoría o un abogado.")}

<h2 id="mi-caso">Cómo lo resuelvo yo</h2>
<p>Quien te haga la web debería preparar el aviso legal y la política de privacidad con los datos reales de tu negocio, y conviene que tu gestoría los revise antes de publicar. Cuando una web no usa cookies de seguimiento, como esta, tampoco hace falta banner. Si estás empezando como autónomo, la <a href="pagina-web-para-autonomos.html">guía de web para autónomos</a> te explica qué datos tienes que tener a mano.</p>

${cta("¿Quieres una web con todo en regla?", "Cuéntame tu negocio y te digo qué datos necesito para los textos legales.", "Pedir presupuesto")}
`,
  faq: [
    ["¿Es obligatorio el aviso legal en una web?", "Sí, si la web se usa para una actividad económica. Debe mostrar nombre o denominación, domicilio, NIF y un medio de contacto, y en profesiones reguladas, el colegio y el número de colegiado."],
    ["¿Necesito política de privacidad si solo tengo un formulario de contacto?", "Sí. En cuanto recoges datos personales (nombre, correo, teléfono) tienes que informar de quién los trata, para qué, con qué base legal, a quién se comunican, cuánto se guardan y cómo ejercer los derechos."],
    ["¿Tengo que poner un banner de cookies?", "Solo si usas cookies que no sean técnicas, como analítica o publicidad. Si tu web solo usa cookies técnicas o ninguna, no hace falta banner."],
    ["¿Qué multa puede haber por no tener los textos legales?", "La LSSI y el RGPD prevén sanciones económicas, que dependen de la gravedad y del tipo de infracción. En la práctica lo habitual es cumplir con textos sencillos y reales. Consulta tu caso con tu gestoría o un abogado."],
  ],
  cierre: `Sigue leyendo: <a href="que-debe-tener-web-negocio-local.html">qué debe tener la web de un negocio local</a> y <a href="pagina-web-para-autonomos.html">página web para autónomos</a>.`,
},
];
