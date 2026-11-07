/**
 * Servicios (7/11/2026, encargo de Dirección: «lo que ofrece 375estudio.com, quitando vídeo,
 * fotografía y apps»). Genera el índice servicios.html y seis páginas:
 * diseño gráfico (con anuncios y publicidad), catálogos, cartelería y rotulación, gestión de
 * imprenta, dominio + alojamiento + correo profesional y programación web a medida.
 *
 * - Sin cifras: los servicios nuevos no tienen precio en TARIFA.md → «precio cerrado en 24 h».
 *   La única cifra es la cuota de 28 €/mes, que ya está publicada.
 * - Lo físico (imprimir, fabricar y colocar) lo hace una imprenta o un rotulista; Oier diseña
 *   y gestiona. Nunca «taller propio».
 * - Solo castellano (como las guías): el euskera solo pasa por Itzultzaile Neuronala.
 * - El marco (cabecera, menú, CTA, pie y scripts) se copia de branding.html; luego
 *   menu.mjs y pie.mjs dejan el menú y el pie al día.
 *
 * Uso (desde la raíz):  node herramientas/sitio/gen-servicios.mjs
 */
import fs from "node:fs";
import path from "node:path";

const WEB = path.resolve("web");
const URL = "https://oiwebstudio.com/";
const marco = fs.readFileSync(path.join(WEB, "branding.html"), "utf8").replace(/\r\n/g, "\n");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const txt = (s) => s.replace(/<[^>]+>/g, "");
const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const PARTIR = '<script>/* El titular se trocea aquí, antes de pintarse: si no, se ve entero, desaparece y vuelve a entrar */(function(h){var n=0;(function t(e){[].slice.call(e.childNodes).forEach(function(c){if(c.nodeType===1)return t(c);if(c.nodeType!==3)return;var f=document.createDocumentFragment();c.textContent.split(/(\\s+)/).forEach(function(p){if(!p)return;if(!p.trim())return f.appendChild(document.createTextNode(\' \'));var s=document.createElement(\'span\');s.className=\'oi-w\';s.style.setProperty(\'--i\',n++);s.textContent=p;f.appendChild(s)});e.replaceChild(f,c)})})(h)})(document.currentScript.previousElementSibling)</script>';
const AREA = [{ "@type": "AdministrativeArea", name: "Gipuzkoa" }, { "@type": "City", name: "Tolosa" }, { "@type": "City", name: "Donostia-San Sebastián" }, { "@type": "Country", name: "España" }];
const ZONA = (que) => `<div class="sv-zona reveal" data-d="1">
<h2 class="tt">${que} en Tolosa, Donostia y toda Gipuzkoa</h2>
<p>En Tolosaldea podemos vernos en persona. Con negocios de Donostia, Irun, Zarautz, Eibar, Arrasate o Azpeitia, y del resto de España, trabajo a distancia, por videollamada y WhatsApp.</p>
</div>`;

/* ------------------------------------------------------------ piezas */
function cabecera(p) {
  let h = marco.slice(0, marco.indexOf("<main>"));
  const t = esc(p.title), d = esc(p.desc), u = URL + p.slug;
  h = h.replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${d}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${u}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${t}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${d}`)
    .replace(/<meta property="og:locale:alternate"[^>]*>\n/, "")
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${u}`)
    .replace(/<link rel="alternate" hreflang="[^"]*"[^>]*>\n/g, "")
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\n/g, "")
    .replace(/(<link rel="stylesheet" href="assets\/lineas\.css[^"]*"\/>)/, `$1\n<link rel="stylesheet" href="assets/servicios.css?v=1"/>`);
  const miga = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: URL },
    ...(p.slug === "servicios.html" ? [] : [{ "@type": "ListItem", position: 2, name: "Servicios", item: URL + "servicios.html" }]),
    { "@type": "ListItem", position: p.slug === "servicios.html" ? 2 : 3, name: p.miga, item: u }] };
  const ld = `<script type="application/ld+json">\n${JSON.stringify(miga)}\n</script>\n<script type="application/ld+json">\n${JSON.stringify(p.ld)}\n</script>\n`;
  return h.replace("</head>", ld + "</head>");
}
function pie() {
  let f = marco.slice(marco.indexOf("</main>"));
  return f.replace(/(<script src="assets\/piezas\.js[^"]*" defer><\/script>)/, `$1\n<script src="assets/servicios.js?v=1" defer></script>`);
}
const faqLd = (faq) => ({ "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: txt(a) } })) });
function faqHtml(titulo, faq, lee = []) {
  return `<section class="section section--subtle" id="preguntas">
<div class="container hfaq">
<div class="hfaq__lado">
<div class="section-head left reveal">
<h2>${titulo}</h2>
</div>
${lee.length ? `<div class="sv-lee reveal" data-d="1">
<p class="sv-lee__k">Sigue leyendo</p>
${lee.map(([h, t]) => `<a href="${h}">${t}</a>`).join("\n")}
</div>` : ""}
</div>
<div class="hfaq__lista reveal" data-d="1">
${faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("\n")}
</div>
</div>
</section>`;
}
function heroHtml(p) {
  return `<section class="l3 l3-pag l3-br" aria-labelledby="h1">
<div class="container br__top">
<div>
<h1 class="tt" id="h1">${p.h1}</h1>
${PARTIR}
<p class="br__lede">${p.lede}</p>
${(p.cond || []).map((c) => `<p class="br__cond">${c}</p>`).join("\n")}
<a class="l3-btn" href="contacto.html">${p.btn || "Pedir precio"}</a>
</div>
<div class="reveal" data-d="1">
${p.mq}
</div>
</div>
</section>`;
}
const tarjetas = (items, clase = "") => `<ul class="svx-c${clase}">
${items.map(([h, t, id], n) => `<li class="reveal" data-d="${n % 3}"${id ? ` id="${id}"` : ""}><h3>${h}</h3><p>${t}</p></li>`).join("\n")}
</ul>`;
const pasos = (items) => `<ol class="sv-pasos sv-pasos--4">
${items.map(([h, t], n) => `<li class="reveal" data-d="${n}"><span class="sv-pasos__n" aria-hidden="true">${n + 1}</span><h3 class="tt">${h}</h3><p>${t}</p></li>`).join("\n")}
</ol>`;
const sec = (id, h2, cuerpo, suave = false, pre = "") => `<section class="l3 sv${suave ? " sv--suave" : ""}" id="${id}" aria-labelledby="${id}-h">
<div class="container">
<h2 class="tt" id="${id}-h">${h2}</h2>
${pre ? `<p class="svx-pre reveal">${pre}</p>` : ""}
${cuerpo}
</div>
</section>`;
function servicioLd(p, nombre, tipo) {
  const u = URL + p.slug;
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "WebPage", "@id": u, url: u, name: txt(p.h1), about: { "@id": URL + "#estudio" }, inLanguage: "es" },
    { "@type": "Service", "@id": u + "#servicio", url: u, name: nombre, serviceType: tipo, description: txt(p.lede), provider: { "@id": URL + "#estudio" }, areaServed: AREA },
    faqLd(p.faq)] };
}
const MUESTRA = '<p class="mq__k">Muestra · nombre inventado</p>';
const BOTON_PAL = '<button type="button" class="mq__b" data-mq-pal>Otros colores</button>';

/* ------------------------------------------------------------ páginas */
const P = [];

P.push({
  slug: "diseno-grafico-gipuzkoa.html", miga: "Diseño gráfico",
  title: "Diseño gráfico en Gipuzkoa: flyers y anuncios | OI Studio",
  desc: "Diseño gráfico en Tolosa y Gipuzkoa: flyers, folletos, tarjetas, cartas, plantillas para redes y anuncios. Precio cerrado en 24 h y pago al final.",
  h1: "Diseño gráfico en Gipuzkoa",
  lede: "Diseño lo que tu negocio imprime o publica: flyers, folletos, tarjetas, la carta, plantillas para redes y anuncios. Con tus colores y tus letras, para que todo parezca del mismo sitio.",
  cond: ["Te digo el precio cerrado en 24 horas y pagas al final, cuando está terminado."],
  mq: `<div class="mq">
<div class="mq-flyer" aria-hidden="true"><div class="mq-flyer__img"></div><div class="mq-flyer__t">Hauspo</div><div class="mq-flyer__l"></div><div class="mq-flyer__l"></div><span class="mq-flyer__p">Menú de sidrería</span></div>
<div class="mq-tarjeta" aria-hidden="true"><b>HAUSPO</b><div><span></span><span></span></div></div>
${MUESTRA}${BOTON_PAL}
</div>`,
  cuerpo: (p) => [
    sec("que-diseno", "Qué diseño", tarjetas([
      ["Flyers y folletos", "Para el buzón, el mostrador o una feria. Dípticos y trípticos incluidos."],
      ["Tarjetas de visita", "Con tu logo, tu teléfono y un QR a tu web o a tu WhatsApp."],
      ["Carta y menú", "La carta del restaurante o tu lista de precios, fácil de leer y de cambiar."],
      ["Plantillas para redes", "Para Instagram y Facebook, que puedes rellenar tú sin romper el diseño."],
      ["Anuncios y publicidad", "Para periódicos, revistas locales, programas de fiestas y banners de internet, a la medida que pide cada medio.", "anuncios"],
      ["Papelería", "Hojas de presupuesto, sobres, etiquetas, pegatinas y bolsas."],
    ])),
    sec("como-trabajo", "Cómo trabajo", pasos([
      ["Me cuentas qué necesitas", "Qué pieza es, para cuándo y dónde se va a ver. Si tienes logo y textos, me los pasas."],
      ["Precio cerrado en 24 h", "Te digo qué incluye, cuánto cuesta y la fecha de entrega, por escrito."],
      ["Propuesta y cambios", "Te enseño el diseño y lo ajusto en dos rondas de cambios."],
      ["Archivos y pago al final", "Te entrego el PDF listo para imprenta y la versión para el móvil. Pagas entonces."],
    ]), true),
    `<section class="l3 sv" id="cuando" aria-labelledby="cuando-h">
<div class="container sv-dos">
<div>
<h2 class="tt" id="cuando-h">Si todavía no tienes logo</h2>
<p class="sv-p reveal">Un flyer o una tarjeta salen mucho mejor con un logo en vector y tus colores definidos. Si no los tienes, empezamos por ahí. <a class="l3-a" href="branding.html">Ver branding y logos</a></p>
<p class="sv-p reveal" style="margin-top:14px">Para imprimir, te paso los archivos o lo gestiono yo con la imprenta. <a class="l3-a" href="gestion-imprenta-gipuzkoa.html">Ver gestión de imprenta</a></p>
</div>
${ZONA("Diseño gráfico")}
</div>
</section>`,
    faqHtml("Preguntas sobre diseño gráfico", p.faq, [["catalogos-diseno-gipuzkoa.html", "Diseño de catálogos"], ["carteleria-rotulacion-gipuzkoa.html", "Cartelería y rotulación"]]),
  ].join("\n\n"),
  faq: [
    ["¿Cuánto cuesta diseñar un flyer o una tarjeta de visita?", "Depende de la pieza y de si ya tienes logo y textos. Te doy el precio cerrado en 24 horas, antes de empezar, y pagas al final."],
    ["¿Imprimes tú?", "No tengo imprenta. Te entrego los archivos listos para imprimir y, si quieres, gestiono el pedido: pido presupuestos, reviso la prueba y te aviso cuando está."],
    ["¿Diseñas anuncios para periódicos y revistas?", "Sí. Me pasas las medidas que pide el medio, o se las pido yo, y te entrego el anuncio en el formato que necesitan. También banners para internet."],
    ["¿Puedo cambiar yo los textos después?", "En las plantillas para redes, sí: te las dejo para que las rellenes tú. De los impresos te paso los archivos editables si los pides."],
    ["¿Trabajas fuera de Tolosa?", "Sí. En Tolosaldea podemos vernos; con el resto de Gipuzkoa y de España trabajo por videollamada y WhatsApp."],
  ],
  ld: null, servicio: ["Diseño gráfico", "Diseño gráfico e impresos para negocios"],
});

P.push({
  slug: "catalogos-diseno-gipuzkoa.html", miga: "Diseño de catálogos",
  title: "Diseño de catálogos en Gipuzkoa, impresos y PDF | OI Studio",
  desc: "Diseño de catálogos de producto y de servicios para empresas de Tolosa y Gipuzkoa, para imprimir y en PDF para enviar por WhatsApp. Precio cerrado en 24 h.",
  h1: "Diseño de catálogos en Gipuzkoa",
  lede: "Catálogos de producto, de servicios o de temporada, para imprimir o para mandar en PDF. Ordeno tus productos para que se encuentren rápido y se vean bien.",
  cond: ["Te digo el precio cerrado en 24 horas y pagas al final, cuando está terminado."],
  mq: `<div class="mq">
<div class="mq-cat" aria-hidden="true">
<div class="mq-cat__i"><div class="mq-cat__foto"></div><div class="mq-cat__t">Otoño 2026</div></div>
<div class="mq-cat__d">
<div class="mq-cat__p"><i></i><b>Silla Ola<br/>Roble</b><em>REF. 014</em></div>
<div class="mq-cat__p"><i></i><b>Mesa Haritz<br/>180 × 90</b><em>REF. 022</em></div>
<div class="mq-cat__p"><i></i><b>Lámpara Ilun<br/>Latón</b><em>REF. 031</em></div>
</div>
</div>
${MUESTRA}${BOTON_PAL}
</div>`,
  cuerpo: (p) => [
    sec("que-incluye", "Qué incluye", tarjetas([
      ["Portada e interiores", "Una maqueta propia, con tus colores y tus letras, que aguanta 8 o 80 páginas."],
      ["Fichas de producto", "Foto, nombre, referencia, medidas y lo que necesite tu cliente para elegir."],
      ["Para imprimir y en PDF", "Una versión para imprenta y otra ligera para mandar por WhatsApp o por correo."],
      ["Precios aparte", "Si quieres, la tabla de precios va en una hoja suelta: cambias precios sin rehacer el catálogo."],
      ["En dos idiomas", "En castellano y en euskera, o con francés si vendes al otro lado de la muga."],
      ["También en tu web", "Si tu web es mía, el catálogo puede estar también en ella, para verlo en el móvil."],
    ])),
    sec("que-necesito", "Lo que necesito de ti", `<div class="sv-dos">
<ul class="sv-lista reveal">
<li>La lista de productos, en Excel o como la tengas.</li>
<li>Las fotos. Si alguna no sirve para imprimir, te digo cuál y por qué.</li>
<li>Los textos, o una idea de lo que quieres decir y los escribo yo.</li>
<li>Tu logo en vector. Si no lo tienes, lo redibujamos.</li>
</ul>
${ZONA("Catálogos")}
</div>`, true),
    sec("como-trabajo", "Cómo trabajo", pasos([
      ["Me cuentas el catálogo", "Cuántos productos, para quién es y si se imprime, se envía o las dos cosas."],
      ["Precio cerrado en 24 h", "Te digo precio y fecha por escrito, según páginas y productos."],
      ["Maqueta y cambios", "Primero dos páginas de muestra; cuando te gustan, monto el resto y lo repasamos juntos."],
      ["Archivos y pago al final", "PDF de imprenta y PDF ligero. Si quieres, gestiono la impresión. Pagas al terminar."],
    ])),
    faqHtml("Preguntas sobre catálogos", p.faq, [["gestion-imprenta-gipuzkoa.html", "Gestión de imprenta"], ["diseno-grafico-gipuzkoa.html", "Diseño gráfico"]]),
  ].join("\n\n"),
  faq: [
    ["¿Cuánto cuesta diseñar un catálogo?", "Depende sobre todo del número de páginas y de productos, y de si las fotos y los textos están listos. Te doy el precio cerrado en 24 horas y pagas al final."],
    ["¿Cuánto se tarda?", "Un catálogo corto, pocos días; uno largo, unas semanas. La fecha va por escrito en la propuesta."],
    ["¿Y si cambian los precios?", "Si pones los precios en una hoja aparte, solo se cambia esa hoja. Si van dentro, actualizo el catálogo y te digo antes cuánto cuesta."],
    ["¿Lo imprimes tú?", "No tengo imprenta. Te entrego el PDF de imprenta o gestiono el pedido con una imprenta: la impresión te la factura ella directamente."],
    ["¿Puede ir en euskera?", "Sí, en euskera y en castellano. También con francés si lo necesitas."],
  ],
  servicio: ["Diseño de catálogos", "Diseño y maquetación de catálogos"],
});

P.push({
  slug: "carteleria-rotulacion-gipuzkoa.html", miga: "Cartelería y rotulación",
  title: "Cartelería y rotulación en Gipuzkoa: diseño y gestión | OI Studio",
  desc: "Diseño de carteles, lonas, roll-ups, escaparates y rótulos de fachada o vehículo en Gipuzkoa; la fabricación, con un rotulista. Precio en 24 h.",
  h1: "Cartelería y rotulación en Gipuzkoa",
  lede: "Diseño carteles, lonas, roll-ups, el vinilo de tu escaparate y el rótulo de tu fachada o tu furgoneta. Lo fabrica y lo coloca un rotulista o una imprenta; yo me encargo de que salga bien.",
  cond: ["No tengo taller: no fabrico ni coloco. Te cobro el diseño y la gestión, con precio cerrado en 24 horas."],
  mq: `<div class="mq">
<div class="mq-fach" aria-hidden="true">
<div class="mq-fach__rot">Hauspo</div>
<div class="mq-fach__b"><div class="mq-fach__esc"><span>Abierto · 9:00–20:00</span></div><div class="mq-fach__pu"></div></div>
</div>
${MUESTRA}${BOTON_PAL}
</div>`,
  cuerpo: (p) => [
    sec("que-diseno", "Qué diseño", tarjetas([
      ["Carteles", "Para un evento, una oferta o el escaparate, de A3 a A1.", "carteleria"],
      ["Lonas y banderolas", "Para la fachada, una obra o una fiesta, que se lean de lejos."],
      ["Roll-ups", "Para ferias y mostradores, con lo que tienen que leer en tres segundos."],
      ["Rótulo de fachada", "Con tu logo y tu nombre, dibujado sobre una foto de tu fachada para que lo veas puesto.", "rotulacion"],
      ["Vinilo de escaparate", "El horario, el teléfono, tus redes o una imagen que tape lo que no tiene que verse."],
      ["Rotulación de vehículos", "La furgoneta o el coche de empresa, dibujado sobre el modelo que tienes."],
    ])),
    sec("como-funciona", "Cómo funciona", pasos([
      ["Fotos y medidas", "Me mandas fotos y medidas. En Tolosaldea puedo ir a verlo."],
      ["Diseño sobre la foto", "Te enseño el rótulo o el cartel puesto en tu fachada o tu vehículo, antes de fabricar nada."],
      ["Presupuesto de fabricación", "Pido precio a rotulistas o imprentas de la zona y eliges. Te facturan ellos directamente."],
      ["Prueba y colocación", "Reviso la prueba antes de fabricar y el rotulista lo coloca. Tú pagas el diseño al final."],
    ]), true),
    `<section class="l3 sv" id="permisos" aria-labelledby="permisos-h">
<div class="container sv-dos">
<div>
<h2 class="tt" id="permisos-h">Antes de poner un rótulo</h2>
<ul class="sv-lista reveal">
<li>En muchos ayuntamientos, el rótulo de fachada necesita licencia o una comunicación previa. Pregunta en el tuyo antes de fabricarlo.</li>
<li>Si estás en un edificio con comunidad, mira si hay normas para la fachada.</li>
<li>Te preparo el dibujo con medidas y materiales, que es lo que suelen pedir.</li>
</ul>
</div>
${ZONA("Rotulación")}
</div>
</section>`,
    faqHtml("Preguntas sobre cartelería y rotulación", p.faq, [["diseno-grafico-gipuzkoa.html", "Diseño gráfico"], ["branding.html", "Branding y logos"]]),
  ].join("\n\n"),
  faq: [
    ["¿Fabricas y colocas tú el rótulo?", "No. Diseño el rótulo, pido presupuestos a rotulistas de la zona y reviso que se fabrique como está diseñado. La fabricación y la colocación te las factura el rotulista."],
    ["¿Cuánto cuesta?", "El diseño y la gestión, con precio cerrado en 24 horas. La fabricación depende del tamaño y del material, y te la presupuesta el rotulista antes de empezar."],
    ["¿Necesito permiso del ayuntamiento?", "En muchos municipios, el rótulo de fachada necesita licencia o una comunicación previa. Pregunta en tu ayuntamiento; te preparo el dibujo con medidas y materiales."],
    ["Mi logo es una imagen borrosa, ¿sirve?", "Para un rótulo o una lona, no. Hay que redibujarlo en vector antes; te digo el precio junto con el resto."],
    ["¿Trabajas fuera de Tolosa?", "Sí. En Tolosaldea puedo ir a ver la fachada; en el resto de Gipuzkoa trabajo con tus fotos y medidas."],
  ],
  servicio: ["Cartelería y rotulación", "Diseño de cartelería y rotulación con gestión de fabricación"],
});

P.push({
  slug: "gestion-imprenta-gipuzkoa.html", miga: "Gestión de imprenta",
  title: "Gestión de imprenta en Gipuzkoa | OI Studio",
  desc: "Archivos para imprenta, presupuestos, prueba y seguimiento hasta la entrega, para negocios de Tolosa y Gipuzkoa. Precio cerrado en 24 h.",
  h1: "Gestión de imprenta en Gipuzkoa",
  lede: "Te ahorras buscar imprenta, comparar papeles y revisar pruebas. Preparo los archivos, pido presupuestos, compruebo la prueba y te aviso cuando está listo.",
  cond: ["La imprenta te factura la impresión a ti, al precio que has visto antes. Yo te cobro la gestión, con precio cerrado y sin comisión escondida."],
  mq: `<div class="mq">
<div class="mq-ped">
<h4>Pedido · catálogo de otoño</h4>
<ol>
<li><i>${CHECK}</i>Archivo de imprenta, con sangrado</li>
<li><i>${CHECK}</i>Tres presupuestos pedidos</li>
<li><i>${CHECK}</i>Papel y tirada elegidos</li>
<li><i>${CHECK}</i>Prueba revisada</li>
<li><i>${CHECK}</i>Entrega el viernes</li>
</ol>
</div>
${MUESTRA}
</div>`,
  cuerpo: (p) => [
    sec("que-hago", "Qué hago", tarjetas([
      ["Archivos para imprenta", "En el formato que pide cada imprenta, con sangrado, marcas de corte y colores para imprimir."],
      ["Presupuestos", "Pido precio a dos o tres imprentas, de la zona u online, y te los enseño juntos."],
      ["Papel y acabado", "Te digo qué papel, qué gramaje y cuántas unidades tienen sentido para lo que vas a hacer."],
      ["Prueba antes de imprimir", "Reviso la prueba de la imprenta antes de dar el visto bueno a la tirada."],
      ["Seguimiento", "Sigo el pedido hasta que te llega, y si algo sale mal, lo reclamo yo."],
      ["Lo que se imprime", "Flyers, tarjetas, catálogos, cartas, carteles, etiquetas, pegatinas y bolsas."],
    ])),
    `<section class="l3 sv sv--suave" id="quien-paga" aria-labelledby="quien-paga-h">
<div class="container sv-dos">
<div>
<h2 class="tt" id="quien-paga-h">Quién paga qué</h2>
<ul class="sv-lista reveal">
<li>La impresión te la factura la imprenta, a ti, al precio del presupuesto que eliges.</li>
<li>Yo te cobro la gestión, con precio cerrado antes de empezar y al final.</li>
<li>Si el diseño también es mío, te digo los dos precios juntos.</li>
<li>Si ya tienes una imprenta de confianza, le paso los archivos y en paz.</li>
</ul>
</div>
${ZONA("Imprenta")}
</div>
</section>`,
    faqHtml("Preguntas sobre la gestión de imprenta", p.faq, [["catalogos-diseno-gipuzkoa.html", "Diseño de catálogos"], ["diseno-grafico-gipuzkoa.html", "Diseño gráfico"]]),
  ].join("\n\n"),
  faq: [
    ["¿Tienes imprenta propia?", "No. Trabajo con la imprenta que elijas: una de la zona o una online. Yo preparo los archivos y sigo el pedido."],
    ["¿Quién paga la impresión?", "Tú, directamente a la imprenta y al precio del presupuesto que has visto. Yo te cobro solo la gestión."],
    ["¿Puedo usar mi imprenta de siempre?", "Sí. Le paso los archivos en el formato que pide y reviso la prueba con ella."],
    ["El diseño me lo hizo otra persona, ¿lo preparas?", "Sí. Reviso que el archivo esté bien para imprimir y te digo antes si hay que corregir algo."],
    ["¿Cuánto tarda?", "Lo que tarde la imprenta en imprimir y enviar, que suele ser unos días. Te lo digo con el presupuesto."],
  ],
  servicio: ["Gestión de imprenta", "Preparación de archivos y gestión de pedidos de imprenta"],
});

P.push({
  slug: "dominio-alojamiento-correo-profesional.html", miga: "Dominio, alojamiento y correo",
  title: "Dominio, alojamiento y correo profesional | OI Studio",
  desc: "Dominios .eus, .es y .com, alojamiento web con https y correo profesional con el nombre de tu negocio, sin caer en spam. Gipuzkoa y España.",
  h1: "Dominio, alojamiento y correo profesional",
  lede: "Registro tu dominio, alojo tu web y te dejo el correo con el nombre de tu negocio, como info@tunegocio.eus, funcionando en el móvil y en el ordenador.",
  cond: ["Con una web mía, el dominio y el alojamiento van dentro de la cuota de 28&nbsp;€/mes. Lo demás, con precio cerrado en 24 horas."],
  mq: `<div class="mq">
<div class="mq-mail">
<div class="mq-mail__bar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>hauspo.eus</div>
<p class="mq-mail__de">Bandeja de <span>info@hauspo.eus</span></p>
<ul>
<li class="is-new"><i>M</i><span><b>Mesa para el sábado</b><em>Somos seis, ¿tenéis hueco a las 21:00?</em></span><em>ahora</em></li>
<li><i>I</i><span><b>Presupuesto de comida de empresa</b><em>Para el 12 de diciembre…</em></span><em>10:42</em></li>
<li><i>A</i><span><b>Factura de octubre</b><em>Os adjunto la factura…</em></span><em>ayer</em></li>
</ul>
</div>
${MUESTRA}
</div>`,
  cuerpo: (p) => [
    sec("servicios", "Tres cosas que van juntas", tarjetas([
      ["Registro de dominios", "El dominio a tu nombre, no al mío: .eus, .es o .com. Te aviso antes de cada renovación. <a href=\"dominio-eus-es-com.html\">Cuál elegir</a>.", "dominio"],
      ["Alojamiento web", "Rápido, con https y copias de seguridad. Si tu web la hizo otra persona, te digo si conviene moverla y qué cuesta.", "alojamiento"],
      ["Correo profesional", "Buzones con tu dominio en Google Workspace o Microsoft 365, o un reenvío gratis a tu Gmail para empezar.", "correo"],
    ])),
    sec("correo-bien", "Correo que llega", `<div class="sv-dos">
<ul class="sv-lista reveal">
<li>Configuro los registros del dominio (SPF, DKIM y DMARC) para que tus correos no caigan en spam.</li>
<li>Te lo dejo en el móvil y en el ordenador, y te explico cómo responder desde info@.</li>
<li>La cuota del buzón la pagas a Google o a Microsoft, a su precio. Yo no la revendo.</li>
<li>Si cambias de proveedor, lo muevo sin perder correos: primero copia y luego el cambio.</li>
</ul>
${ZONA("Dominio y correo")}
</div>`, true),
    faqHtml("Preguntas sobre dominio, alojamiento y correo", p.faq, [["dominio-eus-es-com.html", "Dominio .eus, .es o .com"], ["precios.html", "Precios y cuota de las webs"]]),
  ].join("\n\n"),
  faq: [
    ["¿El dominio queda a mi nombre?", "Sí. El dominio se registra a tu nombre y es tuyo. Yo lo gestiono y te aviso antes de cada renovación."],
    ["¿Cuánto cuesta el correo profesional?", "Configurarlo, con precio cerrado en 24 horas. La cuota de cada buzón la cobra Google o Microsoft, a su precio, directamente a ti."],
    ["¿Puedo tener correo con mi dominio sin pagar cuota?", "Sí: un reenvío de info@tunegocio a tu Gmail. Sirve para recibir; para responder desde info@ con comodidad, lo mejor es un buzón de pago."],
    ["¿Por qué mis correos caen en spam?", "Muchas veces faltan los registros SPF, DKIM y DMARC del dominio, que dicen quién puede mandar correo en tu nombre. Los reviso y los dejo bien."],
    ["¿Alojas webs que no has hecho tú?", "Depende de cómo esté hecha. Te digo si puedo alojarla o si conviene dejarla donde está, antes de tocar nada."],
  ],
  servicio: ["Dominio, alojamiento web y correo profesional", "Registro de dominios, alojamiento web y correo profesional"],
});

P.push({
  slug: "programacion-web-a-medida-gipuzkoa.html", miga: "Programación web a medida",
  title: "Programación web a medida en Gipuzkoa | OI Studio",
  desc: "Programación web a medida en Tolosa y Gipuzkoa: reservas con tus reglas, paneles, calculadoras de presupuesto y conexiones con lo que ya usas.",
  h1: "Programación web a medida en Gipuzkoa",
  lede: "Cuando una plantilla no llega: reservas con tus reglas, un panel para tu equipo, una calculadora de presupuestos o conectar tu web con lo que ya usas. Lo programo yo y te explico en llano qué hace.",
  cond: ["Precio cerrado en 24 horas y pago al final. Si algo se resuelve mejor con una herramienta que ya existe, te lo digo antes."],
  mq: `<div class="mq">
<div class="mq-pan">
<h4>Solicitudes <span>hoy</span></h4>
<div class="mq-pan__f"><span><b>2 noches · 14 y 15 de marzo</b><em>Pareja, habitación doble</em></span><span class="mq-pan__a"><button type="button" class="si" data-r="Aceptada">Aceptar</button><button type="button" data-r="Rechazada">Rechazar</button></span></div>
<div class="mq-pan__f"><span><b>Mesa · sábado 21:00</b><em>6 personas, una trona</em></span><span class="mq-pan__a"><button type="button" class="si" data-r="Aceptada">Aceptar</button><button type="button" data-r="Rechazada">Rechazar</button></span></div>
</div>
<p class="mq__k">Ejemplo · toca Aceptar o Rechazar</p>
</div>`,
  cuerpo: (p) => [
    sec("ya-hecho", "Lo que ya he programado", tarjetas([
      ["Reservas con calendario", "En la casa rural A.Berri, de Getaria: el huésped pide las noches y ellos aceptan o rechazan desde un panel. <a href=\"caso-a-berri.html\">Ver el caso</a>."],
      ["Abierto ahora", "En Errotatxo, de Tolosa: la web dice si cada tienda está abierta según su horario. <a href=\"caso-errotatxo.html\">Ver el caso</a>."],
      ["Calculadora de presupuesto", "La de mi página de precios: eliges lo que necesitas y ves el total al momento. <a href=\"precios.html#calculadora\">Probarla</a>."],
    ])),
    sec("que-puedo", "Qué te puedo hacer", tarjetas([
      ["Paneles para tu equipo", "Para cambiar la carta, los precios o el horario sin llamar a nadie."],
      ["Formularios que ordenan", "El pedido o la solicitud te llega con todo escrito, sin ir y volver por WhatsApp."],
      ["Conexiones", "Con Google Calendar, Sheets, tu correo, Stripe o Bizum, según lo que ya uses. <a href=\"automatizaciones.html\">Ver automatizaciones</a>."],
      ["Tiendas online", "Con pago con tarjeta y Bizum y aviso de cada pedido. <a href=\"precios.html#plan-tienda\">Ver precio</a>."],
    ], " svx-c--2"), true),
    sec("como-trabajo", "Cómo trabajo", pasos([
      ["Me cuentas el problema", "Qué haces a mano cada semana y qué te gustaría que pasara solo."],
      ["Si se puede y cuánto cuesta", "En 24 horas te digo si se puede, cómo y el precio cerrado, por escrito."],
      ["Lo pruebas antes", "Lo programo en una dirección de prueba y lo usas antes de publicarlo."],
      ["Lo publico y pagas", "Cuando funciona en tu web, pagas. Con la cuota, lo mantengo al día."],
    ])),
    faqHtml("Preguntas sobre programación a medida", p.faq, [["automatizaciones.html", "Automatizaciones para negocios"], ["reservas-online-sin-comisiones.html", "Reservas online sin comisiones"]]),
  ].join("\n\n"),
  faq: [
    ["¿Cuánto cuesta una función a medida?", "Depende de lo que haga. Te digo el precio cerrado en 24 horas, antes de empezar, y pagas cuando funciona."],
    ["¿Haces aplicaciones para el móvil?", "No hago apps para las tiendas de aplicaciones. Muchas veces basta una web que se abre bien en el móvil y se puede guardar en la pantalla de inicio."],
    ["¿Con qué lo programas?", "Con HTML, CSS y JavaScript, y para lo que funciona en el servidor, con Cloudflare. Nada que te ate a un programa de pago."],
    ["¿Y si mi web la hizo otra persona?", "Te digo si se puede añadir a tu web tal como está o si conviene hacerlo de otra forma, antes de tocar nada."],
    ["¿Quién lo mantiene?", "Si la web es mía, entra en la cuota de 28 €/mes. Si no, te digo en el presupuesto cómo se mantiene."],
  ],
  servicio: ["Programación web a medida", "Desarrollo web a medida"],
});

/* ------------------------------------------------------------ índice */
const GRUPOS = [
  ["webs", "Webs", "Webs bonitas para tu negocio, con lo que necesites dentro.", [
    ["precios.html#plan-una", "Página web", "De una página o con secciones, preparada para el móvil y para Google."],
    ["precios.html#plan-tienda", "Tienda online", "Con pago con tarjeta y Bizum y aviso de cada pedido."],
    ["programacion-web-a-medida-gipuzkoa.html", "Programación web a medida", "Reservas con tus reglas, paneles, calculadoras y conexiones."],
    ["seo-posicionamiento-google.html", "SEO y presencia en Google", "Tu ficha de Google, Bing y Apple Maps, y cómo te nombran las IAs."],
    ["reservas-online-sin-comisiones.html", "Reservas online", "Mesas, citas o noches desde tu web, sin comisión por reserva."],
  ]],
  ["grafico", "Diseño gráfico e imprenta", "Lo que se imprime, se pega o se publica. Lo físico lo hace una imprenta o un rotulista y yo lo gestiono.", [
    ["diseno-grafico-gipuzkoa.html", "Diseño gráfico", "Flyers, folletos, tarjetas, cartas y plantillas para redes."],
    ["diseno-grafico-gipuzkoa.html#anuncios", "Anuncios y publicidad", "Para prensa, revistas, programas de fiestas e internet."],
    ["catalogos-diseno-gipuzkoa.html", "Catálogos", "Para imprimir y en PDF, con tus productos ordenados."],
    ["carteleria-rotulacion-gipuzkoa.html", "Cartelería y rotulación", "Carteles, lonas, roll-ups, escaparates, fachadas y vehículos.", "Lo fabrica y lo coloca un rotulista"],
    ["gestion-imprenta-gipuzkoa.html", "Gestión de imprenta", "Archivos listos, presupuestos, prueba y entrega.", "Imprime la imprenta que elijas"],
  ]],
  ["marca", "Marca", "El logo, los colores y las letras de tu negocio, pensados juntos.", [
    ["branding.html", "Logotipos", "Tu logo con sus versiones: color, una tinta, fondo oscuro e icono."],
    ["branding.html#que-incluye", "Branding e imagen corporativa", "Colores, letras, hoja de marca y cómo se aplican."],
    ["branding-para-negocio-pequeno.html", "Marca para un negocio pequeño", "Qué necesitas y qué no, explicado en llano."],
  ]],
  ["dominio", "Dominio, alojamiento y correo", "Lo que no se ve pero tiene que funcionar todos los días.", [
    ["dominio-alojamiento-correo-profesional.html#dominio", "Registro de dominios", ".eus, .es o .com, a tu nombre."],
    ["dominio-alojamiento-correo-profesional.html#alojamiento", "Alojamiento web", "Rápido, con https y copias de seguridad."],
    ["dominio-alojamiento-correo-profesional.html#correo", "Correo profesional", "info@tunegocio, en el móvil y sin caer en spam."],
  ]],
  ["auto", "Automatizaciones", "Lo que te quita trabajo cada semana. En cada una te digo qué parte hace la IA.", [
    ["automatizaciones.html", "Reservas, Google y reseñas", "Reservas sin comisiones, tu ficha al día y respuestas a tus reseñas."],
    ["ia-para-negocios-gipuzkoa.html", "IA para negocios", "Soluciones de IA adaptadas a cada empresa, solo con lo que funciona hoy."],
  ]],
];
const indice = {
  slug: "servicios.html", miga: "Servicios",
  title: "Servicios: webs, diseño gráfico y marca | OI Studio",
  desc: "Webs, tiendas online, diseño gráfico, catálogos, cartelería y rotulación, imprenta, logos, dominio y correo profesional, desde Tolosa (Gipuzkoa).",
  h1: "Servicios de diseño en Tolosa y Gipuzkoa",
  lede: "Webs, diseño gráfico, marca, dominio y correo, y automatizaciones. Lo hago yo, Oier, desde Tolosa. Lo que se imprime o se fabrica lo hace una imprenta o un rotulista, y yo lo gestiono.",
};
function indiceHtml() {
  const hero = `<section class="l3 l3-pag l3-br" aria-labelledby="h1">
<div class="container">
<h1 class="tt" id="h1">${indice.h1}</h1>
${PARTIR}
<p class="br__lede" style="max-width:62ch">${indice.lede}</p>
<ul class="svx-saltos reveal">
${GRUPOS.map(([id, h]) => `<li><a href="#${id}">${h}</a></li>`).join("\n")}
</ul>
</div>
</section>`;
  const grupos = GRUPOS.map(([id, h, p, items], g) => `<section class="l3 sv svx-g${g % 2 ? " sv--suave" : ""}" id="${id}" aria-labelledby="${id}-h">
<div class="container svx-g__cab">
<div class="reveal">
<h2 class="tt" id="${id}-h">${h}</h2>
<p>${p}</p>
</div>
<ul class="svx-l">
${items.map(([href, n, t, fis], i) => `<li class="reveal" data-d="${i % 3}"><a href="${href}"><h3>${n}</h3><p>${t}</p>${fis ? `<span class="svx-fis">${fis}</span>` : ""}</a></li>`).join("\n")}
</ul>
</div>
</section>`).join("\n\n");
  return hero + "\n\n" + grupos;
}
indice.ld = { "@context": "https://schema.org", "@graph": [
  { "@type": "CollectionPage", "@id": URL + "servicios.html", url: URL + "servicios.html", name: indice.h1, about: { "@id": URL + "#estudio" }, inLanguage: "es" },
  { "@type": "OfferCatalog", "@id": URL + "servicios.html#catalogo", name: "Servicios de OI Studio", itemListElement: GRUPOS.map(([, h, , items]) => ({ "@type": "OfferCatalog", name: h, itemListElement: items.map(([href, n]) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: n, url: URL + href, provider: { "@id": URL + "#estudio" } } })) })) }] };

/* ------------------------------------------------------------ escribir */
const escribir = (slug, html) => { fs.writeFileSync(path.join(WEB, slug), html.replace(/\n/g, "\r\n")); console.log("escrita", slug); };
for (const p of P) {
  p.ld = servicioLd(p, p.servicio[0], p.servicio[1]);
  escribir(p.slug, cabecera(p) + `<main>\n<!-- ${p.miga.toUpperCase()} (7/11/2026, gen-servicios.mjs): sin cifras; precio cerrado en 24 h -->\n${heroHtml(p)}\n\n${p.cuerpo(p)}\n\n` + pie());
}
escribir(indice.slug, cabecera(indice) + `<main>\n<!-- SERVICIOS (7/11/2026, gen-servicios.mjs) -->\n${indiceHtml()}\n\n` + pie());
export { P, GRUPOS };
