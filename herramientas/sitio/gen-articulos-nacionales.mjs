/**
 * Tres artículos pensados para búsquedas de toda España (no solo de Gipuzkoa):
 * web para autónomos, landing o web completa, y cómo crear la web de un negocio.
 *
 * Usa como carcasa (estilos, menú, pie) un artículo ya publicado, para que
 * sean idénticos salvo el contenido. Solo CREA las páginas: no toca las demás.
 *
 * Uso: node herramientas/sitio/gen-articulos-nacionales.mjs
 */
import fs from "node:fs";
import path from "node:path";

const WEB = path.resolve("web");
const base = fs.readFileSync(path.join(WEB, "cuanto-tarda-hacer-pagina-web.html"), "utf8");
const trozo = (a, b) => { const i = base.indexOf(a), j = base.indexOf(b, i); if (i < 0 || j < 0) throw new Error("carcasa: " + a.slice(0, 30)); return base.slice(i, j); };
const estilos = trozo("<style>", "</style>") + "</style>";
const nav = trozo('<div class="nav-wrap">', '<div class="container">\n<header class="art-hero">');
const pie = trozo('<footer class="footer">', '<script src="assets/i18n.js');
const wa = trozo('<a class="wa-float"', "</body>");
const fuentes = trozo('<link rel="preconnect" href="https://fonts.googleapis.com"/>', '<link rel="stylesheet" href="assets/styles.css');
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const txt = (s) => s.replace(/<[^>]+>/g, "");
const HOY = "2026-10-05";

const consejo = (t) => `<div class="dev-tip">
<div class="who">
<img src="favicon-96.png" alt="OI Studio" width="96" height="96"/>
<div><b>Consejo del desarrollador</b><small>OI Studio · Tolosa</small></div>
</div>
<p>"${t}"</p>
</div>`;
const cta = (h, p, btn, href = "contacto.html") => `<div class="cta-band">
<div>
<h3>${h}</h3>
<p>${p}</p>
</div>
<a class="btn btn--light" href="${href}">${btn}</a>
</div>`;
const figura = (img, url, alt, cap) => `<figure>
<div class="browser">
<div class="browser__bar"><span class="browser__dots"><i></i><i></i><i></i></span><span class="browser__url">${url}</span><span style="width:34px;"></span></div>
<picture><source srcset="assets/${img}.webp" type="image/webp"/><img src="assets/${img}.jpg" alt="${esc(alt)}" width="900" height="562" loading="lazy"/></picture>
</div>
<figcaption>${cap}</figcaption>
</figure>`;
const tabla = (cab, filas) => `<div class="tbl-wrap">
<table class="tbl">
<thead>
<tr>${cab.map((c) => `<th>${c}</th>`).join("")}</tr>
</thead>
<tbody>
${filas.map((f) => `<tr>${f.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("\n")}
</tbody>
</table>
</div>`;

function pagina(a) {
  const url = `https://oiwebstudio.com/${a.slug}.html`;
  const imgAbs = `https://oiwebstudio.com/assets/${a.img}.jpg`;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Article", headline: a.headline, description: a.desc, image: imgAbs,
        author: { "@type": "Organization", name: "OI Studio", url: "https://oiwebstudio.com/sobre-mi.html" },
        publisher: { "@type": "Organization", name: "OI Studio", logo: { "@type": "ImageObject", url: "https://oiwebstudio.com/icon-512.png" } },
        datePublished: HOY, dateModified: HOY, mainEntityOfPage: url, inLanguage: "es" },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://oiwebstudio.com/" },
        { "@type": "ListItem", position: 2, name: "Artículos", item: "https://oiwebstudio.com/articulos.html" },
        { "@type": "ListItem", position: 3, name: a.crumb, item: url } ] },
      { "@type": "FAQPage", mainEntity: a.faq.map(([q, r]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: txt(r) } })) },
    ],
  };
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="theme-color" content="#ffffff"/>
<meta http-equiv="Content-Security-Policy" content="base-uri 'self'; form-action 'self' mailto: https://wa.me"/>
<title>${a.title}</title>
<meta name="description" content="${esc(a.desc)}"/>
<meta name="keywords" content="${esc(a.keywords)}"/>
<meta name="robots" content="index, follow, max-image-preview:large"/>
<meta property="og:type" content="article"/>
<meta property="og:site_name" content="OI Studio"/>
<meta property="og:url" content="${url}"/>
<meta property="og:title" content="${esc(a.title)}"/>
<meta property="og:description" content="${esc(a.ogdesc)}"/>
<meta property="og:image" content="${imgAbs}"/>
<meta property="og:locale" content="es_ES"/>
<meta name="twitter:card" content="summary_large_image"/>
<link rel="canonical" href="${url}"/>
<link rel="icon" href="/favicon.ico" sizes="48x48"/>
<link rel="icon" href="/favicon-96.png" type="image/png" sizes="96x96"/>
<link rel="apple-touch-icon" href="/apple-touch-icon.png"/>
<link rel="manifest" href="/site.webmanifest"/>
${fuentes}<link rel="stylesheet" href="assets/styles.css?v=23"/>
<script>if(location.protocol==='http:'&&/(^|\\.)oiwebstudio\\.com$/.test(location.hostname))location.replace('https://'+location.host+location.pathname+location.search+location.hash);document.documentElement.classList.add('js');</script>
${estilos}
<script type="application/ld+json">
${JSON.stringify(ld, null, 2)}
</script>
</head>
<body>

${nav}<div class="container">
<header class="art-hero">
<p class="crumbs"><a href="index.html">Inicio</a> / <a href="articulos.html">Artículos</a> / ${a.crumb}</p>
<h1>${a.h1}</h1>
<p class="lede">${a.lede}</p>
<div class="art-meta">
<span>Actualizado · Octubre 2026</span>
<span>Lectura · ${a.min} min</span>
<span>Por OI Studio, Tolosa</span>
</div>
</header>

<article class="art">
${a.cuerpo.trim()}

<h2 id="faq">Preguntas frecuentes</h2>
<div class="faq-pre">
${a.faq.map(([q, r]) => `<details>\n<summary>${q}</summary>\n<p>${r}</p>\n</details>`).join("\n")}
</div>

<p style="margin-top:40px;">${a.cierre}</p>

</article>
</div>

${pie}<script src="assets/i18n.js?v=6"></script>
<script src="assets/main.js?v=10"></script>
${wa}</body>
</html>
`;
}

export const ARTICULOS = [
/* ------------------------------------------------------------------ 1 */
{
  slug: "pagina-web-para-autonomos",
  title: "Página Web para Autónomos: Qué Necesitas y Cuánto Cuesta | OI Studio",
  headline: "Página web para autónomos: qué necesitas, qué incluir y cuánto cuesta",
  desc: "Qué debe tener la web de un autónomo, cuándo compensa una landing y cuándo una web completa, qué datos legales incluir y cuánto cuesta en 2026.",
  ogdesc: "Lo mínimo que tiene que tener la web de un autónomo, qué incluir por ley y cuánto cuesta hacerla bien.",
  keywords: "página web para autónomos, web para autónomos, crear página web autónomo, cuánto cuesta una web para autónomos, landing autónomo, web negocio local",
  crumb: "Web para autónomos",
  h1: "Página web para autónomos: <em>qué necesitas de verdad</em>",
  lede: "Quien trabaja por cuenta propia vive de que lo encuentren y de que se fíen de él. La web hace las dos cosas a la vez, pero solo si está bien planteada: no necesitas diez páginas, necesitas las cuatro o cinco cosas que busca tu cliente.",
  img: "taller-desk", min: 7,
  cuerpo: `
<h2 id="necesita">¿Necesita web un autónomo?</h2>
<p>Depende de cómo te llegan los clientes. Si todo lo que haces te viene por recomendación y no quieres crecer, puedes tirar sin web. Pero hasta el cliente recomendado <strong>te busca en Google antes de llamarte</strong>: quiere ver que existes, que el teléfono es el tuyo y que hay trabajos o reseñas que lo respalden.</p>
<p>Donde más se nota es en los oficios y servicios locales: fontanería, electricidad, reformas, fisioterapia, estética, fotografía, asesoría, clases particulares. El cliente nuevo busca «lo que haces + su ciudad», mira tres opciones y llama a la que parece más seria y más fácil de contactar.</p>

<h2 id="minimo">Lo mínimo que debe tener</h2>
<ul class="check">
<li><strong>Qué haces y dónde, en la primera pantalla.</strong> Sin frases vagas: «Electricista en Tolosa y Tolosaldea», no «soluciones eléctricas integrales».</li>
<li><strong>Teléfono y WhatsApp a un toque.</strong> En el móvil, sin tener que buscarlos. La mayoría de los contactos llegan por ahí.</li>
<li><strong>Zona de servicio clara.</strong> Si atiendes varios pueblos o ciudades, nómbralos: es lo que hace que Google te enseñe en esas búsquedas.</li>
<li><strong>Fotos reales de tu trabajo.</strong> Valen más cinco fotos tuyas, aunque sean de móvil, que veinte de banco de imágenes.</li>
<li><strong>Reseñas o ejemplos.</strong> Lo que dicen otros clientes pesa más que lo que dices tú. Si tienes reseñas en Google, enséñalas.</li>
<li><strong>Horario y cómo pedir presupuesto.</strong> Un formulario corto o un botón de WhatsApp con el mensaje ya escrito.</li>
</ul>

<h2 id="legal">Lo que exige la ley</h2>
<p>Una web con actividad económica tiene que mostrar los <strong>datos identificativos del titular</strong> (nombre o denominación, domicilio, NIF y un medio de contacto), normalmente en un aviso legal. Si recoges datos con un formulario hace falta una política de privacidad, y si usas cookies de analítica o publicidad, un aviso de cookies. Es poco trabajo si se prepara desde el principio; si tienes dudas concretas, consúltalas con tu gestor.</p>

<h2 id="landing-o-web">Landing o web completa</h2>
${tabla(["Opción", "Cuándo encaja", "Desde"], [
  ["Landing (una página)", "Das uno o dos servicios claros y quieres que te encuentren y te llamen", "199 € + IVA"],
  ["Web de negocio (varias páginas)", "Tienes varios servicios, un equipo o contenido que explicar", "299 € + IVA"],
  ["Tienda online", "Vendes productos y quieres cobrar con tarjeta o Bizum", "790 € + IVA"],
])}
<p>Para la mayoría de autónomos que empiezan, una landing bien hecha es suficiente. Se puede ampliar más adelante cuando haya algo que contar. Hay una guía entera sobre <a href="landing-page-o-web-completa.html">cuándo elegir cada una</a>.</p>

${figura("taller-desk", "taller · web de ejemplo", "Web de ejemplo de un negocio de oficios", "Un oficio o servicio local: lo que haces, dónde, cómo contactar y trabajos reales a la vista.")}

<h2 id="coste">Cuánto cuesta y qué más se paga</h2>
<ul class="check">
<li><strong>La web.</strong> Un pago único: desde 199 € una landing y desde 299 € una web de negocio, más IVA, con el precio cerrado por escrito.</li>
<li><strong>Dominio y alojamiento.</strong> El primer año van incluidos; después son unos 15 € al año si solo quieres mantenerlos.</li>
<li><strong>Mantenimiento.</strong> Opcional: 20 € al mes si prefieres que te encargues de cambios y actualizaciones a otra persona.</li>
<li><strong>Tu tiempo.</strong> Reunir fotos y contar qué haces. Es lo que más se subestima y lo que más se nota en el resultado.</li>
</ul>
<p>Más detalle, partida por partida, en la <a href="precio-diseno-web-profesional.html">guía de precios de una web profesional</a> y en <a href="cuanto-cuesta-mantener-una-web-al-ano.html">cuánto cuesta mantenerla al año</a>.</p>

<h2 id="google">Antes que la web: tu ficha de Google</h2>
<p>Para un autónomo local, la ficha de Google Business (la que sale en el mapa) suele traer más llamadas que la propia web. Es gratis, y con fotos, horario y reseñas bien cuidados te pone en el mapa cuando alguien busca cerca. La web y la ficha se refuerzan: hay una <a href="google-business-profile-guia.html">guía paso a paso</a> para montarla.</p>

<h2 id="ayudas">¿Hay ayudas para pagarla?</h2>
<p>En algunos sitios sí: varios ayuntamientos de Gipuzkoa pagan parte de la web de un negocio, sobre todo si está en euskera. Casi todas se piden con factura y con la web ya publicada, así que conviene mirarlo <strong>antes</strong> de empezar. Las abiertas ahora están en la <a href="ayudas-subvenciones-pagina-web-gipuzkoa.html">página de ayudas</a>.</p>

${consejo("Antes de pagar por una web, escribe en un papel qué le preguntan siempre tus clientes. Ese papel es la mitad de la web: lo demás es ponerlo claro, en el móvil y con tu teléfono a un toque.")}

${cta("¿Tienes un servicio y quieres que te encuentren?", "Cuéntame qué haces y dónde, y en 48 horas tienes una propuesta con el precio cerrado. Funciona igual a distancia que en persona.", "Solicitar presupuesto")}
`,
  faq: [
    ["¿Cuánto cuesta una página web para un autónomo?", "Una landing de una página cuesta desde 199 € + IVA y una web de negocio con varias páginas desde 299 € + IVA, con el precio cerrado por escrito. El primer año incluye dominio y alojamiento."],
    ["¿Puedo hacerla yo mismo?", "Sí, con un constructor de webs se puede. Cuesta tiempo, y lo habitual es que quede genérica, lenta en el móvil y sin planteamiento para aparecer en Google. Si tu hora vale dinero, suele compensar encargarla."],
    ["¿Qué datos legales tiene que llevar?", "Datos identificativos del titular (nombre, domicilio, NIF, contacto), política de privacidad si hay formularios y aviso de cookies si usas analítica o publicidad. Lo concreto conviene validarlo con tu gestor."],
    ["¿Trabajas con autónomos de fuera de Gipuzkoa?", "Sí. El estudio está en Tolosa, pero el proceso funciona a distancia, con videollamada, WhatsApp y un enlace privado para revisar la web. El precio es el mismo."],
  ],
  cierre: `Sigue leyendo: <a href="landing-page-o-web-completa.html">landing page o web completa</a> y <a href="como-crear-pagina-web-negocio-paso-a-paso.html">cómo crear la web de tu negocio paso a paso</a>.`,
},

/* ------------------------------------------------------------------ 2 */
{
  slug: "landing-page-o-web-completa",
  title: "Landing Page o Web Completa: Cuál Necesita Tu Negocio | OI Studio",
  headline: "Landing page o web completa: cuál necesita tu negocio",
  desc: "Diferencias entre una landing page y una web completa, cuándo basta una página, cuándo hacen falta varias y cómo decidirlo sin pagar de más.",
  ogdesc: "Una página o varias: cómo saber cuál de las dos necesita tu negocio y cuánto cuesta cada una.",
  keywords: "landing page o web completa, diferencia landing page y web, cuánto cuesta una landing page, landing page negocio local, web de una página",
  crumb: "Landing o web completa",
  h1: "Landing page o web completa: <em>cuál necesita tu negocio</em>",
  lede: "Es la primera duda de casi todos los negocios que piden presupuesto: una sola página o una web con varias secciones. La respuesta no depende del tamaño de tu negocio, sino de cuántas cosas tienes que contar y de cómo te busca tu cliente.",
  img: "cafe-desk", min: 6,
  cuerpo: `
<h2 id="diferencia">La diferencia, en una frase</h2>
<p>Una <strong>landing page</strong> es una sola página larga que cuenta todo lo esencial de arriba abajo y termina en una acción: llamar, escribir por WhatsApp, reservar. Una <strong>web completa</strong> reparte la información en varias páginas (servicios, equipo, precios, contacto…) con un menú.</p>

<h2 id="tabla">Cuál encaja con cada negocio</h2>
${tabla(["Tu situación", "Lo que suele funcionar", "Por qué"], [
  ["Un servicio o producto claro (fontanero, fisioterapeuta, clases)", "Landing", "Todo cabe en una página y el cliente llega con una idea concreta"],
  ["Varios servicios con público distinto (clínica, gestoría, taller)", "Web completa", "Cada servicio merece su página, y Google la encuentra por separado"],
  ["Un local con horario, carta o tarifas (restaurante, peluquería)", "Landing o web corta", "Lo que se busca es horario, ubicación, carta y contacto"],
  ["Quieres vender productos por internet", "Tienda online", "Catálogo, carrito y cobro: necesita estructura propia"],
  ["Compites por muchas búsquedas distintas", "Web completa", "Cada página puede salir en una búsqueda diferente"],
])}

<h2 id="landing">Cuándo basta una landing</h2>
<ul class="check">
<li>Ofreces <strong>pocos servicios y bien definidos</strong>.</li>
<li>Tu cliente te llega por recomendación o por el mapa y solo necesita comprobar que eres de fiar y contactarte.</li>
<li>Quieres <strong>empezar ya</strong>, con poco gasto, y ampliar después si funciona.</li>
<li>Tu negocio es pequeño y la competencia por tu búsqueda local es baja.</li>
</ul>
<p>Una landing bien hecha tiene lo esencial: qué haces y dónde, fotos reales, reseñas, precios orientativos si se pueden dar, horario, mapa y un botón de contacto visible en el móvil.</p>

${figura("cafe-desk", "cafetería · web de ejemplo", "Web de ejemplo de una cafetería", "Un negocio de local con carta, horario y ubicación puede funcionar con una página o con pocas.")}

<h2 id="completa">Cuándo hace falta una web completa</h2>
<ul class="check">
<li>Tienes <strong>varios servicios</strong> y cada uno lo busca un público distinto.</li>
<li>Necesitas explicar cosas: tu equipo, tu proceso, tarifas, preguntas frecuentes, casos de clientes.</li>
<li>Quieres posicionarte por <strong>muchas búsquedas diferentes</strong>: una sola página no puede salir bien para todas.</li>
<li>Vas a publicar contenido útil (artículos, guías) que atraiga visitas desde Google.</li>
</ul>

<h2 id="seo">Y para Google, ¿cuál es mejor?</h2>
<p>Una landing compite con una sola página, así que tiene menos «superficie» para aparecer. A cambio es más fácil de mantener y de entender. Para búsquedas locales muy concretas («peluquería en Tolosa», «electricista en Andoain») suele bastar si la ficha de Google está bien. Cuando necesitas aparecer por varios servicios o por varias zonas, una web con una página por cada uno marca la diferencia.</p>

<h2 id="precio">Cuánto cuesta cada una</h2>
${tabla(["Opción", "Precio", "Incluye"], [
  ["Landing", "Desde 199 € + IVA", "Una página a medida, adaptada a móvil, formulario de contacto, botón de WhatsApp y dominio y hosting el primer año"],
  ["Web de negocio", "Desde 299 € + IVA", "Varias páginas, todo lo de la landing y más contenido"],
  ["Tienda online", "Desde 790 € + IVA", "Todo lo anterior, hasta 50 productos cargados, pago con tarjeta y Bizum"],
])}
<p>Se puede empezar por una landing y ampliar más adelante cuando haya algo más que contar. Todo está en la <a href="precios.html">página de precios</a>.</p>

${consejo("Si dudas, empieza por la landing. Es más fácil ampliar una página que funciona que justificar una web grande que nadie ha pedido. Lo que importa es que la primera pantalla diga qué haces, dónde y cómo contactarte.")}

${cta("¿No sabes cuál te conviene?", "Cuéntame tu negocio y te digo, sin compromiso, cuál de las dos encaja y por qué.", "Solicitar presupuesto")}
`,
  faq: [
    ["¿Cuánto cuesta una landing page?", "Desde 199 € + IVA en OI Studio, con dominio y alojamiento el primer año, adaptación a móvil, formulario de contacto y botón de WhatsApp."],
    ["¿Puedo ampliar una landing a web completa más adelante?", "Sí. Se empieza por la landing y, cuando hay más que contar, se añaden páginas. Lo importante es planteársela desde el principio con ese margen."],
    ["¿Una landing sale en Google?", "Sí, sobre todo para búsquedas locales concretas y si la ficha de Google Business está bien cuidada. Para muchas búsquedas distintas conviene una web con varias páginas."],
    ["¿Cuál es mejor para un negocio local?", "Depende de cuántos servicios ofrezcas y de cómo te busque el cliente. Con uno o dos servicios claros suele bastar una landing; con varios, una web de negocio."],
  ],
  cierre: `Sigue leyendo: <a href="pagina-web-para-autonomos.html">página web para autónomos</a> y <a href="precio-diseno-web-profesional.html">cuánto cuesta una web profesional</a>.`,
},

/* ------------------------------------------------------------------ 3 */
{
  slug: "como-crear-pagina-web-negocio-paso-a-paso",
  title: "Cómo Crear la Web de tu Negocio Paso a Paso (2026) | OI Studio",
  headline: "Cómo crear la web de tu negocio paso a paso",
  desc: "Guía práctica para crear la página web de un negocio local: qué preparar, dominio, alojamiento, estructura, publicar y que Google la encuentre.",
  ogdesc: "Los pasos para tener la web de tu negocio publicada y encontrable en Google, con lo que se hace por tu cuenta y lo que conviene encargar.",
  keywords: "cómo crear una página web para mi negocio, crear web negocio paso a paso, crear página web negocio local, dominio y hosting, publicar una web",
  crumb: "Crear la web de tu negocio",
  h1: "Cómo crear la web de tu negocio <em>paso a paso</em>",
  lede: "Crear una web no es tan difícil como parece, pero tiene un orden. Estos son los pasos, qué prepara cada uno y en cuáles conviene pedir ayuda, tanto si la haces tú como si se la encargas a alguien.",
  img: "pan-desk", min: 8,
  cuerpo: `
<h2 id="objetivo">1. Decide para qué la quieres</h2>
<p>Antes de tocar nada, responde a una pregunta: <strong>¿qué quieres que haga quien entre?</strong> Que te llame, que reserve, que compre, que pida presupuesto. Una web que intenta hacerlo todo no consigue nada. Elige una acción principal y haz que todo lleve a ella.</p>

<h2 id="material">2. Reúne el material</h2>
<ul class="check">
<li><strong>Textos.</strong> Qué haces, para quién, dónde, por qué te eligen. Escribe como hablarías con un cliente.</li>
<li><strong>Fotos reales.</strong> Del local, del equipo y de tu trabajo. Con luz natural y en horizontal, aunque sean de móvil.</li>
<li><strong>Logo y colores</strong>, si los tienes.</li>
<li><strong>Datos fijos.</strong> Dirección, teléfono, horario, redes y los datos legales del titular.</li>
</ul>

<h2 id="dominio">3. Elige el dominio</h2>
<p>El dominio es la dirección (por ejemplo <code>minegocio.com</code>). Mejor corto, fácil de decir por teléfono y <strong>registrado a tu nombre</strong>, no al de quien te hace la web: así la web es tuya si algún día cambias de proveedor. Si tu negocio es local, un .com o un .es funcionan igual de bien.</p>

<h2 id="hosting">4. Contrata el alojamiento</h2>
<p>El alojamiento (hosting) es donde vive la web. Para un negocio local no hace falta nada grande: lo que importa es que sea rápido, tenga <strong>https</strong> (el candado) y copias de seguridad. Una web estática o ligera cuesta muy poco y carga en menos de dos segundos.</p>

<h2 id="estructura">5. Decide la estructura</h2>
<p>Una landing de una página o una web con varias, según lo que tengas que contar. Hay una guía sobre <a href="landing-page-o-web-completa.html">cuándo elegir cada una</a>. Si dudas, empieza por lo mínimo: portada con lo esencial, servicios, quién eres, contacto y mapa.</p>

${figura("pan-desk", "panadería · web de ejemplo", "Web de ejemplo de una panadería", "Lo primero que se ve: qué es, dónde está y cómo contactar. El resto, debajo.")}

<h2 id="diseno">6. Diseña y construye</h2>
<p>Aquí está el gran dilema: hacerlo tú con un constructor o encargarlo. Compara con honestidad:</p>
${tabla(["", "La haces tú", "La encargas"], [
  ["Coste de entrada", "Bajo (suscripción mensual)", "Un pago único desde unos 199 €"],
  ["Tiempo tuyo", "Muchas horas, y aprender la herramienta", "Una conversación y reunir material"],
  ["Resultado", "Correcto, pero suele parecerse a otras", "A medida, pensado para tu negocio y para Google"],
  ["Después", "Cuota mensual mientras la tengas", "Tuya, con mantenimiento opcional"],
])}
<p>Hagas lo que hagas, cuida tres cosas: que <strong>se vea perfecta en el móvil</strong> (es desde donde te buscan), que <strong>cargue rápido</strong> y que el <strong>teléfono y el botón de contacto</strong> estén siempre a la vista.</p>

<h2 id="publicar">7. Publica y que Google la conozca</h2>
<ul class="check">
<li><strong>Crea tu ficha de Google Business</strong>, gratis, con fotos, horario y la dirección de tu web. Es lo que te pone en el mapa. Hay una <a href="google-business-profile-guia.html">guía paso a paso</a>.</li>
<li><strong>Da de alta la web en Google Search Console</strong> y envía el mapa del sitio (sitemap) para que la encuentre antes.</li>
<li><strong>Pide reseñas</strong> a tus clientes. Hay otra guía sobre <a href="conseguir-resenas-google-negocio-local.html">cómo conseguirlas</a>.</li>
<li><strong>Enlázala</strong> desde tus redes, tu firma de correo y los directorios de tu zona.</li>
</ul>

<h2 id="mantener">8. Mantenla viva</h2>
<p>Una web no se queda hecha para siempre: cambian horarios, precios, fotos y servicios. Revisa una vez al trimestre que todo siga bien y actualiza lo que haya cambiado. Si prefieres no ocuparte, el mantenimiento se puede encargar; la <a href="cuanto-cuesta-mantener-una-web-al-ano.html">guía de costes de mantenimiento</a> explica cuánto suele costar.</p>

${consejo("El error más común no es técnico: es publicar la web y no volver a mirarla. Con un horario antiguo o una foto de hace diez años pierdes más clientes de los que ganas con la web.")}

${cta("¿Prefieres que te la haga yo?", "Cuéntame tu negocio y en 48 horas tienes una propuesta con el precio cerrado. Funciona igual a distancia que en persona.", "Solicitar presupuesto")}
`,
  faq: [
    ["¿Cuánto tarda en crearse una web?", "Una landing suele estar en una semana y una web de negocio en dos o tres. Lo que más tarda es reunir fotos y textos, no construirla."],
    ["¿Qué necesito para empezar?", "Saber qué quieres que haga quien entre, unas cuantas fotos reales, los textos básicos de qué haces y dónde, y tus datos de contacto y legales."],
    ["¿El dominio tiene que estar a mi nombre?", "Sí, conviene. Si lo registra otra persona a su nombre, la web depende de ella. A tu nombre, la web es tuya y la puedes llevar a otro proveedor cuando quieras."],
    ["¿Cómo consigo que aparezca en Google?", "Con una web rápida, con tu zona y tus servicios bien escritos, una ficha de Google Business cuidada, reseñas y enlaces de tus redes. No hay atajos: es constancia y datos correctos."],
  ],
  cierre: `Sigue leyendo: <a href="pagina-web-para-autonomos.html">página web para autónomos</a> y <a href="que-debe-tener-web-negocio-local.html">qué debe tener la web de un negocio local</a>.`,
},
];

if (process.argv[1] && process.argv[1].endsWith("gen-articulos-nacionales.mjs")) {
  for (const a of ARTICULOS) {
    fs.writeFileSync(path.join(WEB, `${a.slug}.html`), pagina(a).replace(/\r?\n/g, "\n"));
    console.log("  escrito", a.slug + ".html");
  }
}
