/**
 * Páginas de zona nuevas: 36 municipios de Gipuzkoa y 11 comarcas.
 *
 * Cuando se escribió gen-zonas.js ya había 20 páginas hechas y retocadas a
 * mano; volver a pasarlo las pisaría. Este script solo CREA las que faltan,
 * y toma de zonas/anoeta.html el CSS, el menú y el pie para que sean idénticas
 * al resto en cada despliegue.
 *
 * Datos objetivos (población, coordenadas, comarca): municipios-gipuzkoa.json.
 * Textos a mano: zonas-nuevas-datos.mjs y COMARCAS de este fichero.
 *
 * Uso: node herramientas/sitio/gen-zonas-ampliado.mjs [--check]
 */
import fs from "node:fs";
import path from "node:path";
import { NUEVAS } from "./zonas-nuevas-datos.mjs";
import { ESPANA } from "./espana-datos.mjs";

const RAIZ = path.resolve("web");
const ZONAS = path.join(RAIZ, "zonas");
const MUN = JSON.parse(fs.readFileSync(new URL("./municipios-gipuzkoa.json", import.meta.url), "utf8"));
const BASE = "https://oiwebstudio.com";
const HOY = "2026-10-05";
const SOLO_COMPROBAR = process.argv.includes("--check");

/* ------------------------------------------------------------ utilidades */
const quita = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const jsn = (s) => String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
const miles = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const redondea = (n) => (n >= 10000 ? Math.round(n / 500) * 500 : n >= 1000 ? Math.round(n / 100) * 100 : Math.round(n / 10) * 10);

const TOLOSA = { lat: 43.139, lon: -2.072 };
const km = (a, b) => {
  const R = 6371, r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
/* Distancia por carretera aproximada: la recta por 1,3, redondeada. */
const distCarretera = (m) => Math.max(1, Math.round(km(TOLOSA, m) * 1.3));

/* ----------------------------------------------- plantilla: la de Anoeta */
const plantilla = fs.readFileSync(path.join(ZONAS, "anoeta.html"), "utf8");
const trozo = (ini, fin) => { const a = plantilla.indexOf(ini); const b = fin ? plantilla.indexOf(fin, a) : plantilla.length; if (a < 0 || b < 0) throw new Error("plantilla: " + ini); return plantilla.slice(a, b); };
const CSS = trozo("<style>", "</style>") + "</style>";
const NAV = trozo('<div class="nav-wrap">', '<header class="zh">');
const PIE = trozo('<footer class="footer">');
const CABECERA_COMUN = trozo('<meta http-equiv="Content-Security-Policy"', "<title>");
const FUENTES = trozo('<link rel="preconnect" href="https://fonts.googleapis.com"/>', "<style>");

/* ------------------------------------------------------------ imágenes */
const STOCK = { pan: 4, gym: 2, cafe: 3, pelu: 3, flor: 2, rest: 3, taller: 3, vet: 2 };
const ROTULO = { pan: "Panadería", gym: "Gimnasio", cafe: "Cafetería", pelu: "Peluquería", flor: "Floristería", rest: "Restaurante", taller: "Taller", vet: "Veterinaria" };
const heroImg = (key, seed, nombre) => {
  const f = `sec-${key}-${(seed % STOCK[key]) + 1}`;
  return `<picture><source srcset="../assets/stock/${f}.webp" type="image/webp"/><img src="../assets/stock/${f}.jpg" alt="${esc(ROTULO[key])} en ${esc(nombre)}" width="1000" height="700" fetchpriority="high"/></picture>`;
};
/* Las tres muestras del portfolio (octubre 2026), en orden rotado según la página. */
const TRIO = [["mara", "Bar restaurante"], ["lux", "Electricista"], ["arin", "Fisioterapia"]];
const trioMosaico = (n) => [0, 1, 2].map((j) => TRIO[(j + n) % 3]).map(([img, rot]) => `<a class="zshot" href="../trabajos.html"><picture><source srcset="../assets/${img}-desk.webp" type="image/webp"/><img src="../assets/${img}-desk.jpg" alt="${rot}, muestra de web para negocio local" width="900" height="562" loading="lazy"/></picture><span class="zshot__lbl">${rot}</span></a>`).join("\n");

/* ------------------------------------------------------- índice completo */
const porSlug = Object.fromEntries(MUN.map((m) => [m.slug, m]));
const nuevasPorSlug = Object.fromEntries(NUEVAS.map((n) => [n.slug, n]));
const tienePagina = (m) => m.existente || !!nuevasPorSlug[m.slug];
const nombreVisible = (m) => ({ "Villabona-Amasa": "Villabona", Donostia: "Donostia-San Sebastián", Arrasate: "Arrasate-Mondragón" }[m.eu] || m.eu);
const slugComarca = (c) => c.toLowerCase().replace(/\s+/g, "-");

function cercanos(m, n = 8) {
  return MUN.filter((x) => x.slug !== m.slug && tienePagina(x)).map((x) => ({ x, d: km(m, x) })).sort((a, b) => a.d - b.d).slice(0, n).map((o) => o.x);
}

/* --------------------------------------------------------- avisos ayudas */
const AYUDAS = {
  tolosa: ["Tolosa paga parte de tu web en euskera", "El ayuntamiento tiene una ayuda para pasar la web, los rótulos o la imagen al euskera (bolsa total de 4.000 €). Mira las condiciones y el plazo.", false],
  urretxu: ["Urretxu ayuda a poner la web en euskera", "El ayuntamiento subvenciona la rotulación, la web o la imagen corporativa en euskera. Se pide por su sede electrónica.", false],
  legazpi: ["Legazpi ayuda a usar el euskera en tu web", "El ayuntamiento tiene una ayuda para negocios que usen el euskera en su imagen, sus rótulos o su página web.", false],
  pasaia: ["Pasaia convoca cada año su ayuda para webs en euskera", "Incluye la página web en euskera y el dominio .eus. La de 2026 aún no está publicada; aquí te cuento cuándo suele salir.", true],
};
const GENERICA = ["¿Hay ayudas para tu web?", "Muchos ayuntamientos de Gipuzkoa pagan parte de la web, sobre todo si está en euskera. Mira cuáles están abiertas ahora.", false];
const avisoAyuda = (slug) => {
  const [t, p, anual] = AYUDAS[slug] || GENERICA;
  const href = `../ayudas-subvenciones-pagina-web-gipuzkoa.html${AYUDAS[slug] ? "#" + slug : ""}`;
  return `<section class="zsec" style="padding-top:0;padding-bottom:44px;">
<div class="container">
<a class="ayuda-cta${anual ? " ayuda-cta--anual" : ""}" href="${href}"><span class="ayuda-cta__dot" aria-hidden="true"></span><span class="ayuda-cta__txt"><b>${esc(t)}</b><span>${esc(p)}</span></span><span class="ayuda-cta__go">${AYUDAS[slug] ? "Ver la ayuda →" : "Ver ayudas →"}</span></a>
</div>
</section>`;
};

/* ------------------------------------------------------------ preguntas */
function preguntas(m, d, dist) {
  const nombre = d.name, alt = d.alt ? ` (${d.alt})` : "";
  const q1 = `¿Te mueves hasta ${nombre}?`;
  const a1 = d.slug === "tolosa" ? "Aquí tengo el estudio, así que me paso por tu negocio cuando haga falta, sin cita eterna ni papeleo. Lo del día a día lo resolvemos por WhatsApp."
    : dist <= 12 ? `Casi no hay que moverse: ${nombre} está a unos ${dist} km de Tolosa. Me paso por tu negocio cuando haga falta, sin cita eterna ni papeleo, y lo del día a día lo resolvemos por WhatsApp.`
    : dist <= 35 ? `Sí. ${nombre} está a unos ${dist} km de Tolosa. Quedamos en tu negocio para conocerlo y hacer las fotos si hace falta, y el resto lo llevamos por WhatsApp y videollamada para no hacerte perder tiempo.`
    : `Sí, cuando compensa. ${nombre} está a unos ${dist} km de Tolosa, así que lo habitual es empezar por videollamada o WhatsApp y quedar en persona para conocer el negocio y hacer las fotos. El precio es el mismo.`;
  const q2 = "¿Cuesta lo mismo que en Tolosa?";
  const a2 = `Exactamente lo mismo. Landing desde 199€ y Web Negocio desde 299€, precio cerrado por escrito y 30 días de ajustes incluidos. ${dist <= 12 ? "A tan poca distancia no hay desplazamiento que repercutir ni excusa para cobrarlo." : "Ir a " + nombre + " no lleva ningún recargo."}`;
  const pob = redondea(m.pob);
  const q3 = `¿Merece la pena el SEO en ${pob >= 10000 ? "un municipio de unos " + miles(pob) : "un pueblo de unos " + miles(pob)} habitantes?`;
  const a3 = pob < 3000 ? `Precisamente ahí es donde más rinde. Son pocos negocios peleando y muchos sin web, así que hacerlo bien te pone por delante sin gran esfuerzo. La web sale orientada a búsquedas de ${nombre}${alt} y de ${d.comarca}, y el complemento es tu ficha de Google Business, que repaso en <a href="../google-business-profile-guia.html">esta guía</a>.`
    : pob < 10000 ? `Sí, y bastante: hay competencia moderada y todavía mucha gente que depende solo de las redes. La web se orienta a búsquedas de ${nombre}${alt} y de ${d.comarca}, y se complementa con tu ficha de Google Business, que repaso en <a href="../google-business-profile-guia.html">esta guía</a>.`
    : `Sí. En un municipio de este tamaño hay competencia real por las búsquedas de cada sector, y las primeras posiciones del mapa se llevan casi todos los clics. La web se orienta a ${nombre}${alt} y a ${d.comarca}, y se trabaja junto con tu ficha de Google Business, que repaso en <a href="../google-business-profile-guia.html">esta guía</a>.`;
  const q5 = "¿Puedo verlo antes de decidir?";
  const a5 = `Claro. No enseño maquetas: las webs del <a href="../trabajos.html">portfolio</a> están publicadas y se pueden abrir y recorrer. Con eso y la propuesta en 48h tienes de sobra para decidir sin compromiso.`;
  return [[q1, a1], [q2, a2], [q3, a3], [d.faq.q, d.faq.a], [q5, a5]];
}
const textoPlano = (h) => h.replace(/<[^>]+>/g, "");

/* ------------------------------------------------------ página de municipio */
function paginaMunicipio(d, idx) {
  const m = porSlug[d.slug];
  if (!m) throw new Error("sin dato: " + d.slug);
  const dist = d.slug === "tolosa" ? 0 : distCarretera(m);
  const nombre = d.name, alt = d.alt ? ` (${d.alt})` : "";
  let titulo = `Diseño y páginas web en ${nombre}${alt} | OI Studio`;
  if (titulo.length > 62) titulo = `Diseño web en ${nombre}${alt} | OI Studio`;
  const cercaTxt = d.slug === "tolosa" ? "Estudio en Tolosa." : `Estudio en Tolosa, a ${dist} km.`;
  let desc = `Diseño y desarrollo de páginas web para negocios de ${nombre}${alt} (${d.comarca}). Precio cerrado desde 199€, propuesta en 48h. ${cercaTxt}`;
  if (desc.length > 160) desc = `Páginas web para negocios de ${nombre}${alt} (${d.comarca}). Precio cerrado desde 199€, propuesta en 48h. ${cercaTxt}`;
  const url = `${BASE}/zonas/${d.slug}.html`;
  const img = `${BASE}/assets/stock/sec-${d.hero}-${(idx % STOCK[d.hero]) + 1}.jpg`;
  const kw = [`diseño web ${nombre}`, `páginas web ${nombre}`, d.alt && `diseño web ${d.alt}`, d.alt && `páginas web ${d.alt}`, `desarrollo web ${d.comarca}`, `web negocio ${nombre}`, "diseñador web Gipuzkoa"].filter(Boolean).join(", ");
  const qa = preguntas(m, d, dist);
  const vec = cercanos(m, 8), tres = vec.slice(0, 3);
  const pob = redondea(m.pob);
  const factDist = d.slug === "tolosa" ? `<div class="zfact"><b>Aquí</b><span>Estudio en Tolosa</span></div>` : `<div class="zfact"><b>${dist} km</b><span>Desde Tolosa</span></div>`;
  const enlace = (x) => `<a href="${x.slug}.html">${esc(nombreVisible(x))}</a>`;
  const ldFaq = qa.map(([q, a]) => `    {"@type":"Question","name":"${jsn(q)}","acceptedAnswer":{"@type":"Answer","text":"${jsn(textoPlano(a))}"}}`).join(",\n");
  const alt1 = d.alt ? `, ${d.alt}` : "";

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="theme-color" content="#ffffff"/>
${CABECERA_COMUN}<title>${esc(titulo)}</title>
<meta name="description" content="${esc(desc)}"/>
<meta name="keywords" content="${esc(kw)}"/>
<meta name="robots" content="index, follow, max-image-preview:large"/>
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="OI Studio"/>
<meta property="og:url" content="${url}"/>
<meta property="og:title" content="${esc(titulo)}"/>
<meta property="og:description" content="${esc(desc)}"/>
<meta property="og:image" content="${img}"/>
<meta property="og:locale" content="es_ES"/>
<meta name="twitter:card" content="summary_large_image"/>
<link rel="canonical" href="${url}"/>
<link rel="icon" href="/favicon.ico" sizes="48x48"/>
<link rel="icon" href="/favicon-96.png" type="image/png" sizes="96x96"/>
<link rel="apple-touch-icon" href="/apple-touch-icon.png"/>
<link rel="manifest" href="/site.webmanifest"/>
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"BreadcrumbList",
  "itemListElement":[
    {"@type":"ListItem","position":1,"name":"Inicio","item":"${BASE}/"},
    {"@type":"ListItem","position":2,"name":"Zonas","item":"${BASE}/zonas.html"},
    {"@type":"ListItem","position":3,"name":"${jsn(d.comarca)}","item":"${BASE}/zonas/${slugComarca(d.comarca)}.html"},
    {"@type":"ListItem","position":4,"name":"Diseño web en ${jsn(nombre)}","item":"${url}"}
  ]
}
</script>
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"ProfessionalService",
  "parentOrganization":{"@id":"${BASE}/#estudio","name":"OI Studio","url":"${BASE}/"},
  "name":"OI Studio — Diseño web en ${jsn(nombre)}",
  "url":"${url}",
  "image":"${img}",
  "description":"${jsn(desc)}",
  "email":"contactoiwebstudio@gmail.com",
  "telephone":"+34680956755",
  "priceRange":"199€ - 299€",
  "address":{"@type":"PostalAddress","addressLocality":"Tolosa","addressRegion":"Gipuzkoa","addressCountry":"ES"},
  "areaServed":{"@type":"City","name":"${jsn(nombre)}","containedInPlace":{"@type":"AdministrativeArea","name":"Gipuzkoa"}},
  "sameAs":["https://instagram.com/oi.webstudio"]
}
</script>
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"FAQPage",
  "mainEntity":[
${ldFaq}
  ]
}
</script>
${FUENTES}${CSS}
</head>
<body>

${NAV}<header class="zh">
<div class="container">
<div class="zh__grid">
<div>
<p class="zh__crumbs"><a href="../index.html">Inicio</a> / <a href="../zonas.html">Zonas</a> / <a href="${slugComarca(d.comarca)}.html">${esc(d.comarca)}</a> / ${esc(nombre)}</p>
<h1>Diseño web en <span class="grad">${esc(nombre)}</span></h1>
<p class="zh__lede">${esc(d.lede)}</p>
<div class="zh__cta">
<a href="../contacto.html" class="btn btn--accent">Solicitar presupuesto</a>
<a href="../trabajos.html" class="btn btn--ghost">Ver trabajos</a>
</div>
</div>
<div class="zh__shot" data-anim="clip">
${heroImg(d.hero, idx, nombre)}
<span class="zh__tag">${ROTULO[d.hero]}</span>
</div>
</div>

<div class="zfacts" data-anim="facts">
${factDist}
<div class="zfact"><b>${miles(pob)}</b><span>Habitantes</span></div>
<div class="zfact"><b>199€</b><span>Desde, precio cerrado</span></div>
<div class="zfact"><b>48h</b><span>Propuesta</span></div>
</div>
</div>
</header>

<section class="zsec">
<div class="container">
<div class="zsplit">
<div>
<div class="zhead"><span class="k">${esc(d.comarca)}</span><h2>Qué necesita un negocio de ${esc(nombre)}</h2></div>
<p>${esc(d.contexto)}</p>
<p class="zpull">${esc(d.gancho)}</p>
</div>
<div>
<div class="zhead"><span class="k">Sectores</span><h2>Con quién trabajo</h2></div>
<div class="zchips" data-anim="chips">
${d.sectores.map((s) => `<span class="zchip">${esc(s)}</span>`).join("\n")}
</div>
<p style="font-size:14px;color:var(--text-faint);margin-top:16px;">¿El tuyo no está? Escríbeme igual — trabajo con cualquier negocio local.</p>
</div>
</div>
</div>
</section>

${avisoAyuda(d.slug)}

<section class="zsec--tight zsec" style="padding-top:0;">
<div class="container">
<div class="zhead"><span class="k">Portfolio</span><h2>Webs reales, publicadas y navegables</h2></div>
<div class="zmosaic" data-anim="assemble">
${trioMosaico(idx)}
</div>
<p style="text-align:center;margin-top:16px;font-size:14px;color:var(--text-muted);">No enseño maquetas: las webs del <a href="../trabajos.html" class="link-terra">portfolio</a> están online y puedes abrirlas.</p>
</div>
</section>

<section class="zsec" style="padding-top:0;">
<div class="container">
<div class="zhead"><span class="k">Proceso</span><h2>De la primera llamada a la web publicada</h2></div>
<div class="zsteps" data-anim="steps">
<div class="zstep"><i>01</i><h3>Hablamos 15 min</h3><p>Entiendo tu negocio en ${esc(nombre)} y si de verdad puedo ayudarte.</p></div>
<div class="zstep"><i>02</i><h3>Propuesta en 48h</h3><p>Estructura, referencias y precio cerrado por escrito.</p></div>
<div class="zstep"><i>03</i><h3>Construyo la web</h3><p>Rápida, adaptada a móvil y con SEO local desde el primer día.</p></div>
<div class="zstep"><i>04</i><h3>Publico y acompaño</h3><p>Dominio a tu nombre y 30 días de ajustes gratis.</p></div>
</div>
</div>
</section>

<section class="zsec" style="padding-top:0;">
<div class="container">
<div class="zhead"><span class="k">Cerca de ${esc(nombre)}</span><h2>También trabajo en estos municipios</h2></div>
<ul class="zcerca" data-anim="up">
${tres.map((x) => `<li><a href="${x.slug}.html"><b>${esc(nombreVisible(x))}</b><i>&rarr;</i></a></li>`).join("\n")}
</ul>
</div>
</section>

<section class="zsec" style="padding-top:0;">
<div class="container">
<div class="zsplit">
<div>
<div class="zhead"><span class="k">Dudas</span><h2>Preguntas frecuentes</h2></div>
<div class="zfaq" data-anim="up">
${qa.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${a}</p></details>`).join("\n")}
</div>
</div>
<div>
<div class="zcta" data-anim="up">
<div>
<h2>¿Tienes un negocio en ${esc(nombre)}?</h2>
<p>En 48 horas tienes la propuesta con el precio cerrado. Gratis, y si no encaja no pasa nada.</p>
</div>
<div class="zcta__btns">
<a href="../contacto.html" class="btn btn--light">Solicitar presupuesto</a>
<a href="https://wa.me/34680956755" target="_blank" rel="noopener" class="btn btn--dark-ghost">WhatsApp</a>
</div>
</div>
<p class="znear"><strong style="color:var(--text-muted);font-weight:500;">También trabajo en:</strong><br/>${vec.map(enlace).join(" · ")} · <a href="${slugComarca(d.comarca)}.html">toda ${esc(d.comarca)}</a> · <a href="../zonas.html">ver todas</a></p>
</div>
</div>
</div>
</section>

${PIE}`;
}

/* ------------------------------------------------------------- comarcas */
const COMARCAS = {
  Tolosaldea: { titulo: "Diseño web en Tolosaldea | Páginas web para negocios", lede: "La comarca donde tengo el estudio: 28 municipios alrededor del Oria, con Tolosa como capital y mucho pueblo pequeño. Aquí trabajo en persona.",
    texto: "Tolosaldea es una comarca de pueblos pequeños que se mueven alrededor de Tolosa: la gente compra, come y hace gestiones en la capital y vuelve a casa. Para un negocio de Alegia, Anoeta o Berastegi eso significa dos cosas: que tu clientela real está repartida por toda la comarca, y que quien te busca en Google suele escribir lo que haces más «Tolosaldea» o «Tolosa». Por eso cada web que hago aquí se escribe para la comarca entera, no solo para el nombre del pueblo.",
    faq: ["¿Trabajas con negocios de todos los pueblos de Tolosaldea?", "Sí. El estudio está en Tolosa y me muevo por toda la comarca. Con los pueblos más grandes tengo página propia; los más pequeños aparecen en esta lista, y para ellos el trabajo es el mismo: web proporcionada al negocio y ficha de Google bien hecha."] },
  Buruntzaldea: { titulo: "Diseño web en Buruntzaldea | Andoain, Urnieta y Lasarte-Oria", lede: "La salida de Tolosaldea hacia Donostia: Andoain, Urnieta y Lasarte-Oria, con mucho comercio y clientela que compara.",
    texto: "En Buruntzaldea el cliente se mueve entre municipios y Donostia está a diez o veinte minutos, así que un negocio compite con lo de aquí y con lo de la capital. La diferencia está en ser fácil de encontrar y de contactar: ficha de Google al día, horarios claros, reseñas y una web rápida desde el móvil.",
    faq: ["¿Qué municipios de Buruntzaldea cubres?", "Andoain, Urnieta y Lasarte-Oria tienen página propia, y trabajo con negocios de los pueblos de alrededor. El criterio es el mismo en todos: una web proporcionada y una ficha de Google cuidada."] },
  Donostialdea: { titulo: "Diseño web en Donostialdea | Páginas web para negocios", lede: "Donostia y su entorno: Hernani, Astigarraga y Usurbil. Mucha competencia, así que la diferencia está en los detalles.",
    texto: "Donostialdea es la zona con más competencia de Gipuzkoa: estudios grandes, agencias y presupuestos que empiezan donde los míos acaban. Mi hueco es el negocio de barrio o de pueblo que necesita una web buena sin pagar precio de capital, y que se trabaje a nivel de barrio o de pueblo, que es como busca la gente de verdad.",
    faq: ["¿Compites con las agencias de Donostia?", "No por las cuentas grandes. Trabajo con el comercio, la hostelería y los servicios que necesitan una web clara, rápida y bien posicionada en su barrio, con precio cerrado y propuesta en 48 horas."] },
  Oarsoaldea: { titulo: "Diseño web en Oarsoaldea | Errenteria, Pasaia, Lezo y Oiartzun", lede: "Puerto, comercio de calle y barrios con identidad propia. Webs que saben a quién hablan.",
    texto: "Oarsoaldea reúne Errenteria, Pasaia, Lezo y Oiartzun, cuatro municipios pegados con mucha clientela compartida. Un negocio de la zona no depende de un solo pueblo: depende de aparecer cuando se busca lo que haces en la comarca. Y en Pasaia o Errenteria, cada barrio tiene sus propias costumbres de búsqueda.",
    faq: ["¿Merece la pena una web si mi negocio es de barrio?", "Sí, porque el cliente nuevo te busca en Google antes de llamarte. Con una web sencilla, tus datos correctos en el mapa y reseñas, compites con negocios más grandes."] },
  Bidasoa: { titulo: "Diseño web en el Bidasoa | Irun y Hondarribia", lede: "Frontera, comercio y turismo. Webs en varios idiomas para una clientela que busca desde los dos lados.",
    texto: "En Irun y Hondarribia una parte de la clientela busca en francés y llega del otro lado de la muga, y otra parte son visitantes de paso. Si tu web solo existe en castellano renuncias a un mercado que tienes a cinco minutos. Las dos páginas de zona entran en detalle.",
    faq: ["¿Haces webs en francés?", "Sí: la misma web en castellano, euskera y francés si tu clientela lo pide, con el mismo diseño. Lo vemos en la propuesta."] },
  Goierri: { titulo: "Diseño web en el Goierri | Beasain, Ordizia, Lazkao e Idiazabal", lede: "Industria potente, producto local y mucho turismo de montaña. Webs para quien vive de la comarca y para quien llega de fuera.",
    texto: "El Goierri combina industria, producto local —el queso de Idiazabal, el mercado de Ordizia— y la montaña de Aralar y Aizkorri. Son clientelas distintas y se trabajan distinto: la empresa industrial necesita credibilidad, el productor necesita vender más allá del día de mercado y el negocio de montaña necesita que el excursionista lo encuentre antes de salir de casa.",
    faq: ["¿Cubres todos los municipios del Goierri?", "Con los más grandes tengo página propia y los más pequeños figuran en esta lista. El trabajo es el mismo en todos: una web proporcionada al negocio y la ficha de Google bien hecha."] },
  "Urola Garaia": { titulo: "Diseño web en Urola Garaia | Zumarraga, Urretxu y Legazpi", lede: "Zumarraga, Urretxu y Legazpi funcionan como una sola zona comercial. Una web preparada para las tres.",
    texto: "En el Alto Urola los pueblos están pegados y comparten calle, comercio y clientela. Plantear la web solo alrededor del nombre de tu pueblo deja fuera a media clientela; lo razonable es presentarse como negocio del Alto Urola. Además, varios ayuntamientos de la zona tienen ayudas para poner la web en euskera.",
    faq: ["¿Hay ayudas para la web en el Alto Urola?", "Hay ayudas municipales en Urretxu y Legazpi abiertas ahora y en Zumarraga cada año. Están todas en la página de ayudas, con plazos y bases."] },
  "Urola Erdia": { titulo: "Diseño web en Urola Erdia | Azpeitia y Azkoitia", lede: "Loiola, casco histórico e industria. Dos pueblos que se comparan, y un cliente que elige al que se ve más serio.",
    texto: "Azpeitia y Azkoitia son vecinas y a menudo compiten por el mismo cliente. Cuando alguien busca un servicio en Urola Erdia mira dos o tres opciones en Google y se queda con la que parece más seria y más fácil de contactar. Eso se juega en la ficha de Google, las reseñas y una web que cargue rápido.",
    faq: ["¿Cómo me diferencio de otros negocios de Azpeitia o Azkoitia?", "Con una web clara y rápida, tus datos correctos en Google Maps y reseñas recientes. La mayoría de la competencia local no cuida ninguna de las tres."] },
  "Urola Kosta": { titulo: "Diseño web en Urola Kosta | Zarautz, Getaria, Zumaia y Orio", lede: "Costa, txakoli y turismo. Negocios que dependen de que el visitante los encuentre antes de llegar.",
    texto: "Urola Kosta vive en buena parte del visitante: Zarautz con su playa y su temporada, Getaria con el txakoli y las parrillas, Zumaia con el flysch, Orio con su puerto y su remo. El visitante decide con el móvil y compara; la web y la ficha de Google, con fotos propias y la información práctica a la vista, deciden si te elige. Y en varios idiomas, mejor.",
    faq: ["¿Hacen falta varios idiomas en la web?", "Si tu clientela viene de fuera, sí: castellano y euskera como base, y inglés o francés si lo piden. Se decide mirando de dónde llegan tus clientes, no por intuición."] },
  Debabarrena: { titulo: "Diseño web en Debabarrena | Eibar, Elgoibar, Deba y Mutriku", lede: "Industria de precisión en el valle y turismo de costa. Dos formas distintas de buscar en Google.",
    texto: "Debabarrena reúne el eje industrial de Eibar, Elgoibar y Soraluze, donde la web tiene que ser creíble ante un responsable de compras, y la costa de Deba y Mutriku, donde el visitante busca dónde parar y comer. Son dos trabajos distintos: ficha técnica y capacidades en el primer caso, información práctica y fotos reales en el segundo.",
    faq: ["¿Qué web necesita una empresa industrial de Debabarrena?", "Qué fabricas o mecanizas, con qué maquinaria y ejemplos de trabajos, y una forma rápida de pedir oferta. Lo bonito importa menos que lo creíble."] },
  Debagoiena: { titulo: "Diseño web en Debagoiena | Arrasate, Bergara, Oñati y Aretxabaleta", lede: "Cooperativas, industria técnica, universidad y patrimonio. Una clientela exigente con la profesionalidad.",
    texto: "Debagoiena tiene un entorno empresarial muy particular, con cooperativas y una red densa de proveedores especializados, además de Bergara, Oñati y el turismo de Arantzazu. La clientela local está acostumbrada a un nivel alto de profesionalidad, y una web descuidada resta credibilidad más rápido que en otros sitios.",
    faq: ["¿Trabajas para empresas del entorno cooperativo?", "Trabajo con cualquier negocio local. Para empresa y proveedores priorizo claridad técnica y credibilidad; para comercio y hostelería, que te encuentren cerca y sepan cómo llegar."] },
};

function paginaComarca(nombreComarca) {
  const c = COMARCAS[nombreComarca];
  const slug = slugComarca(nombreComarca);
  const url = `${BASE}/zonas/${slug}.html`;
  const miembros = MUN.filter((m) => m.comarca === nombreComarca).sort((a, b) => b.pob - a.pob);
  const conPagina = miembros.filter(tienePagina), sinPagina = miembros.filter((m) => !tienePagina(m));
  const pobTotal = miembros.reduce((s, m) => s + m.pob, 0);
  const desc = `Diseño y páginas web para negocios de ${nombreComarca} (${miembros.length} municipios). Precio cerrado desde 199€, propuesta en 48h. Estudio en Tolosa.`;
  const titulo = `Diseño y páginas web en ${nombreComarca} | OI Studio`;
  const tarjeta = (m) => `<li><a href="${m.slug}.html"><b>${esc(nombreVisible(m))}</b><i>${miles(redondea(m.pob))} hab. &rarr;</i></a></li>`;
  const ldFaq = `    {"@type":"Question","name":"${jsn(c.faq[0])}","acceptedAnswer":{"@type":"Answer","text":"${jsn(c.faq[1])}"}},
    {"@type":"Question","name":"¿Cuánto cuesta una web en ${jsn(nombreComarca)}?","acceptedAnswer":{"@type":"Answer","text":"Landing desde 199€ y Web Negocio desde 299€, precio cerrado por escrito y 30 días de ajustes incluidos, con propuesta en 48 horas. El precio es el mismo en todos los municipios."}}`;
  const otras = Object.keys(COMARCAS).filter((x) => x !== nombreComarca);
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="theme-color" content="#ffffff"/>
${CABECERA_COMUN}<title>${esc(titulo)}</title>
<meta name="description" content="${esc(desc)}"/>
<meta name="robots" content="index, follow, max-image-preview:large"/>
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="OI Studio"/>
<meta property="og:url" content="${url}"/>
<meta property="og:title" content="${esc(titulo)}"/>
<meta property="og:description" content="${esc(desc)}"/>
<meta property="og:image" content="${BASE}/assets/og-portada.jpg"/>
<meta property="og:locale" content="es_ES"/>
<meta name="twitter:card" content="summary_large_image"/>
<link rel="canonical" href="${url}"/>
<link rel="icon" href="/favicon.ico" sizes="48x48"/>
<link rel="icon" href="/favicon-96.png" type="image/png" sizes="96x96"/>
<link rel="apple-touch-icon" href="/apple-touch-icon.png"/>
<link rel="manifest" href="/site.webmanifest"/>
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"BreadcrumbList",
  "itemListElement":[
    {"@type":"ListItem","position":1,"name":"Inicio","item":"${BASE}/"},
    {"@type":"ListItem","position":2,"name":"Zonas","item":"${BASE}/zonas.html"},
    {"@type":"ListItem","position":3,"name":"${jsn(nombreComarca)}","item":"${url}"}
  ]
}
</script>
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"ProfessionalService",
  "parentOrganization":{"@id":"${BASE}/#estudio","name":"OI Studio","url":"${BASE}/"},
  "name":"OI Studio — Diseño web en ${jsn(nombreComarca)}",
  "url":"${url}",
  "description":"${jsn(desc)}",
  "email":"contactoiwebstudio@gmail.com",
  "telephone":"+34680956755",
  "priceRange":"199€ - 299€",
  "address":{"@type":"PostalAddress","addressLocality":"Tolosa","addressRegion":"Gipuzkoa","addressCountry":"ES"},
  "areaServed":[${miembros.map((m) => `{"@type":"City","name":"${jsn(nombreVisible(m))}"}`).join(",")}]
}
</script>
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"FAQPage",
  "mainEntity":[
${ldFaq}
  ]
}
</script>
${FUENTES}${CSS}
</head>
<body>

${NAV}<header class="zh">
<div class="container">
<div class="zh__grid" style="grid-template-columns:1fr;">
<div>
<p class="zh__crumbs"><a href="../index.html">Inicio</a> / <a href="../zonas.html">Zonas</a> / ${esc(nombreComarca)}</p>
<h1>Diseño web en <span class="grad">${esc(nombreComarca)}</span></h1>
<p class="zh__lede" style="max-width:62ch;">${esc(c.lede)}</p>
<div class="zh__cta">
<a href="../contacto.html" class="btn btn--accent">Solicitar presupuesto</a>
<a href="../precios.html" class="btn btn--ghost">Ver precios</a>
</div>
</div>
</div>
<div class="zfacts" data-anim="facts">
<div class="zfact"><b>${miembros.length}</b><span>Municipios</span></div>
<div class="zfact"><b>${miles(redondea(pobTotal))}</b><span>Habitantes</span></div>
<div class="zfact"><b>199€</b><span>Desde, precio cerrado</span></div>
<div class="zfact"><b>48h</b><span>Propuesta</span></div>
</div>
</div>
</header>

<section class="zsec">
<div class="container">
<div class="zsplit">
<div>
<div class="zhead"><span class="k">La comarca</span><h2>Cómo se busca en ${esc(nombreComarca)}</h2></div>
<p>${esc(c.texto)}</p>
</div>
<div>
<div class="zhead"><span class="k">Dudas</span><h2>Preguntas frecuentes</h2></div>
<div class="zfaq">
<details open><summary>${esc(c.faq[0])}</summary><p>${esc(c.faq[1])}</p></details>
<details><summary>¿Cuánto cuesta una web en ${esc(nombreComarca)}?</summary><p>Landing desde 199€ y Web Negocio desde 299€, precio cerrado por escrito y 30 días de ajustes incluidos, con propuesta en 48 horas. El precio es el mismo en todos los municipios.</p></details>
</div>
</div>
</div>
</div>
</section>

<section class="zsec" style="padding-top:0;">
<div class="container">
<div class="zhead"><span class="k">Municipios</span><h2>Dónde trabajo en ${esc(nombreComarca)}</h2></div>
<ul class="zcerca" data-anim="up">
${conPagina.map(tarjeta).join("\n")}
</ul>
${sinPagina.length ? `<p style="margin-top:22px;font-size:15px;line-height:1.8;color:var(--text-muted);"><strong style="color:var(--ink);font-weight:600;">También trabajo en:</strong> ${sinPagina.map((m) => `${esc(m.eu)}${m.es && quita(m.es) !== quita(m.eu) ? ` (${esc(m.es)})` : ""}`).join(", ")}. Con los municipios más pequeños el trabajo es el mismo: una web proporcionada al negocio y la ficha de Google bien hecha.</p>` : ""}
</div>
</section>

${avisoAyuda("x")}

<section class="zsec" style="padding-top:0;">
<div class="container">
<div class="zcta" data-anim="up">
<div>
<h2>¿Tienes un negocio en ${esc(nombreComarca)}?</h2>
<p>En 48 horas tienes la propuesta con el precio cerrado. Gratis, y si no encaja no pasa nada.</p>
</div>
<div class="zcta__btns">
<a href="../contacto.html" class="btn btn--light">Solicitar presupuesto</a>
<a href="https://wa.me/34680956755" target="_blank" rel="noopener" class="btn btn--dark-ghost">WhatsApp</a>
</div>
</div>
<p class="znear"><strong style="color:var(--text-muted);font-weight:500;">Otras comarcas:</strong><br/>${otras.map((x) => `<a href="${slugComarca(x)}.html">${esc(x)}</a>`).join(" · ")} · <a href="../zonas.html">ver todas</a></p>
</div>
</section>

${PIE}`;
}

/* -------------------------------------------- hub zonas.html: por comarca */
const INI = "<!-- POR-COMARCA:inicio -->", FIN = "<!-- POR-COMARCA:fin -->";
function bloqueComarcas() {
  const tarjeta = (c) => {
    const ms = MUN.filter((m) => m.comarca === c).sort((a, b) => b.pob - a.pob);
    const pob = ms.reduce((s, m) => s + m.pob, 0);
    const lista = ms.map((m) => tienePagina(m) ? `<a href="zonas/${m.slug}.html">${esc(nombreVisible(m))}</a>` : esc(m.eu)).join(", ");
    return `<article class="zcom__c"><h3><a href="zonas/${slugComarca(c)}.html">${esc(c)}</a></h3><p class="zcom__n">${ms.length} municipios · ${miles(redondea(pob))} hab.</p><p class="zcom__l">${lista}</p></article>`;
  };
  return `${INI}
<section class="section" style="padding:0 0 64px;">
<div class="container">
<style>
.zcom{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;}
.zcom__c{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);padding:22px 24px;}
.zcom__c h3{font-size:20px;letter-spacing:-.02em;margin:0;}
.zcom__c h3 a:hover{color:var(--terra-link);}
.zcom__n{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.09em;text-transform:uppercase;color:var(--terra-link);margin:6px 0 12px;}
.zcom__l{font-size:14.5px;line-height:1.75;color:var(--text-muted);margin:0;}
.zcom__l a{color:var(--ink);border-bottom:1px solid var(--border-strong);}
.zcom__l a:hover{color:var(--terra-link);}
</style>
<div style="margin-bottom:26px;">
<span class="eyebrow">Por comarca</span>
<h2 style="font-size:clamp(26px,3.4vw,38px);letter-spacing:-.03em;margin-top:12px;">Los 88 municipios de Gipuzkoa</h2>
<p style="max-width:62ch;color:var(--text-muted);margin-top:12px;">Los municipios con enlace tienen su propia página. Los demás se tratan igual: web proporcionada al negocio y ficha de Google bien hecha.</p>
</div>
<div class="zcom">
${["Tolosaldea", "Buruntzaldea", "Donostialdea", "Oarsoaldea", "Bidasoa", "Goierri", "Urola Garaia", "Urola Erdia", "Urola Kosta", "Debabarrena", "Debagoiena"].map(tarjeta).join("\n")}
</div>
<p style="margin-top:26px;font-size:15px;color:var(--text-muted);"><strong style="color:var(--ink);">¿Fuera de Gipuzkoa?</strong> También trabajo a distancia: <a class="link-terra" href="diseno-web-negocios-espana.html">toda España</a>, <a class="link-terra" href="diseno-web-bizkaia.html">Bizkaia</a>, <a class="link-terra" href="diseno-web-alava-araba.html">Álava</a> y <a class="link-terra" href="diseno-web-navarra.html">Navarra</a>.</p>
</div>
</section>
${FIN}
`;
}
export function aplicarHub(html) {
  const bloque = bloqueComarcas();
  if (html.includes(INI)) html = html.replace(new RegExp(INI + "[\\s\\S]*?" + FIN + "\\n?"), bloque);
  else {
    const cta = html.indexOf(`<section class="section" style="padding-top:0;">
<div class="container">
<div class="hubcta">`);
    if (cta < 0) throw new Error("zonas.html: no encuentro el bloque final");
    html = html.slice(0, cta) + bloque + "\n" + html.slice(cta);
  }
  return html
    .split("Diseño y páginas web en Gipuzkoa: 20 municipios | OI Studio").join("Diseño web en Gipuzkoa: 88 municipios y 11 comarcas | OI Studio")
    .replace(/(<meta name="description" content=")[^"]*(")/, "$1Diseño y páginas web para negocios de los 88 municipios de Gipuzkoa, por comarcas: Tolosaldea, Goierri, Donostialdea, Debagoiena y más. Desde 199€.$2")
    .replace("Gipuzkoa · 20 municipios", "Gipuzkoa · 88 municipios");
}

/* --------------------------------------- páginas fuera de Gipuzkoa (raíz) */
const aRaiz = (h) => h.replace(/(href|src|srcset)="\.\.\//g, '$1="');
function paginaRaiz(d) {
  const url = `${BASE}/${d.slug}.html`;
  const ambito = d.ambito === "España" ? { "@type": "Country", name: "España" } : { "@type": "AdministrativeArea", name: d.nombre };
  const ldFaq = d.faq.map(([q, a]) => `    {"@type":"Question","name":"${jsn(q)}","acceptedAnswer":{"@type":"Answer","text":"${jsn(a)}"}}`).join(",\n");
  const otras = ESPANA.filter((x) => x.slug !== d.slug);
  const pasos = d.pasos || [["Videollamada de 15 min", `Me cuentas qué haces y qué necesitas en ${d.nombre}. Sin compromiso.`], ["Propuesta en 48h", "Estructura, referencias y precio cerrado por escrito."], ["Revisas con un enlace privado", "Ves la web mientras se construye y me dices qué cambiarías."], ["Publico y acompaño", "Dominio a tu nombre y 30 días de ajustes gratis."]];
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="theme-color" content="#ffffff"/>
${CABECERA_COMUN}<title>${esc(d.titulo)}</title>
<meta name="description" content="${esc(d.desc)}"/>
<meta name="keywords" content="${esc(d.kw)}"/>
<meta name="robots" content="index, follow, max-image-preview:large"/>
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="OI Studio"/>
<meta property="og:url" content="${url}"/>
<meta property="og:title" content="${esc(d.titulo)}"/>
<meta property="og:description" content="${esc(d.desc)}"/>
<meta property="og:image" content="${BASE}/assets/og-portada.jpg"/>
<meta property="og:locale" content="es_ES"/>
<meta name="twitter:card" content="summary_large_image"/>
<link rel="canonical" href="${url}"/>
<link rel="icon" href="/favicon.ico" sizes="48x48"/>
<link rel="icon" href="/favicon-96.png" type="image/png" sizes="96x96"/>
<link rel="apple-touch-icon" href="/apple-touch-icon.png"/>
<link rel="manifest" href="/site.webmanifest"/>
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"BreadcrumbList",
  "itemListElement":[
    {"@type":"ListItem","position":1,"name":"Inicio","item":"${BASE}/"},
    {"@type":"ListItem","position":2,"name":"Zonas","item":"${BASE}/zonas.html"},
    {"@type":"ListItem","position":3,"name":"Diseño web en ${jsn(d.nombre)}","item":"${url}"}
  ]
}
</script>
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"ProfessionalService",
  "parentOrganization":{"@id":"${BASE}/#estudio","name":"OI Studio","url":"${BASE}/"},
  "name":"OI Studio — Diseño web en ${jsn(d.nombre)}",
  "url":"${url}",
  "description":"${jsn(d.desc)}",
  "email":"contactoiwebstudio@gmail.com",
  "telephone":"+34680956755",
  "priceRange":"199€ - 790€",
  "address":{"@type":"PostalAddress","addressLocality":"Tolosa","addressRegion":"Gipuzkoa","addressCountry":"ES"},
  "areaServed":${JSON.stringify(ambito)}
}
</script>
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"FAQPage",
  "mainEntity":[
${ldFaq}
  ]
}
</script>
${FUENTES}${CSS}
</head>
<body>

${NAV}<header class="zh">
<div class="container">
<div class="zh__grid" style="grid-template-columns:1fr;">
<div>
<p class="zh__crumbs"><a href="../index.html">Inicio</a> / <a href="../zonas.html">Zonas</a> / ${esc(d.nombre)}</p>
<h1>${esc(d.h1)} <span class="grad">${esc(d.acento)}</span></h1>
<p class="zh__lede" style="max-width:62ch;">${esc(d.lede)}</p>
<div class="zh__cta">
<a href="../contacto.html" class="btn btn--accent">Solicitar presupuesto</a>
<a href="../precios.html" class="btn btn--ghost">Ver precios</a>
</div>
</div>
</div>
<div class="zfacts" data-anim="facts">
${d.hechos.map(([b, s]) => `<div class="zfact"><b>${esc(b)}</b><span>${esc(s)}</span></div>`).join("\n")}
</div>
</div>
</header>

<section class="zsec">
<div class="container">
<div class="zsplit">
<div>
<div class="zhead"><span class="k">${esc(d.k)}</span><h2>${esc(d.h2)}</h2></div>
${d.texto.map((p) => `<p>${esc(p)}</p>`).join("\n")}
<p class="zpull">${esc(d.pull)}</p>
</div>
<div>
<div class="zhead"><span class="k">Sectores</span><h2>Con quién trabajo</h2></div>
<div class="zchips" data-anim="chips">
${d.sectores.map((s) => `<span class="zchip">${esc(s)}</span>`).join("\n")}
</div>
<p style="font-size:14px;color:var(--text-faint);margin-top:16px;">¿El tuyo no está? Escríbeme igual — trabajo con cualquier negocio local.</p>
</div>
</div>
</div>
</section>

<section class="zsec" style="padding-top:0;">
<div class="container">
<div class="zhead"><span class="k">Proceso</span><h2>De la primera videollamada a la web publicada</h2></div>
<div class="zsteps" data-anim="steps">
${pasos.map(([h, p], i) => `<div class="zstep"><i>0${i + 1}</i><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join("\n")}
</div>
</div>
</section>

<section class="zsec" style="padding-top:0;">
<div class="container">
<div class="zhead"><span class="k">Más zonas</span><h2>Dónde trabajo</h2></div>
<ul class="zcerca" data-anim="up">
<li><a href="../zonas.html"><b>Gipuzkoa · 88 municipios</b><i>&rarr;</i></a></li>
${otras.map((x) => `<li><a href="${x.slug}.html"><b>${esc(x.ambito === "España" ? "Toda España, a distancia" : x.nombre)}</b><i>&rarr;</i></a></li>`).join("\n")}
</ul>
</div>
</section>

<section class="zsec" style="padding-top:0;">
<div class="container">
<div class="zsplit">
<div>
<div class="zhead"><span class="k">Dudas</span><h2>Preguntas frecuentes</h2></div>
<div class="zfaq" data-anim="up">
${d.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("\n")}
</div>
</div>
<div>
<div class="zcta" data-anim="up">
<div>
<h2>¿Tienes un negocio en ${esc(d.nombre)}?</h2>
<p>En 48 horas tienes la propuesta con el precio cerrado. Gratis, y si no encaja no pasa nada.</p>
</div>
<div class="zcta__btns">
<a href="../contacto.html" class="btn btn--light">Solicitar presupuesto</a>
<a href="https://wa.me/34680956755" target="_blank" rel="noopener" class="btn btn--dark-ghost">WhatsApp</a>
</div>
</div>
<p class="znear"><strong style="color:var(--text-muted);font-weight:500;">Mira también:</strong><br/><a href="../precios.html">precios</a> · <a href="../ayudas-subvenciones-pagina-web-gipuzkoa.html">ayudas en Gipuzkoa</a> · <a href="../precio-diseno-web-profesional.html">guía de precios</a> · <a href="../cuanto-tarda-hacer-pagina-web.html">cuánto se tarda</a></p>
</div>
</div>
</div>
</section>

${PIE}`;
  return aRaiz(html);
}

/* ------------------------------------------------------------------ salida */
const escritos = [];
NUEVAS.forEach((d, i) => escritos.push([`${d.slug}.html`, paginaMunicipio(d, i)]));
Object.keys(COMARCAS).forEach((c) => escritos.push([`${slugComarca(c)}.html`, paginaComarca(c)]));

let nuevas = 0, cambiadas = 0;
for (const [f, html] of escritos) {
  const p = path.join(ZONAS, f);
  const antes = fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
  if (antes === html) continue;
  antes === null ? nuevas++ : cambiadas++;
  if (!SOLO_COMPROBAR) fs.writeFileSync(p, html);
}
console.log(`páginas: ${escritos.length} (${nuevas} nuevas, ${cambiadas} actualizadas)${SOLO_COMPROBAR ? " [solo comprobación]" : ""}`);
if (!SOLO_COMPROBAR && !process.argv.includes("--sin-hub")) { const p = path.join(RAIZ, "zonas.html"); const h = fs.readFileSync(p, "utf8"); const n = aplicarHub(h); if (n !== h) { fs.writeFileSync(p, n); console.log("zonas.html actualizado"); } }
let raiz = 0;
for (const d of ESPANA) {
  const p = path.join(RAIZ, `${d.slug}.html`), html = paginaRaiz(d);
  if (fs.existsSync(p) && fs.readFileSync(p, "utf8") === html) continue;
  raiz++;
  if (!SOLO_COMPROBAR) fs.writeFileSync(p, html);
}
console.log(`páginas fuera de Gipuzkoa: ${ESPANA.length} (${raiz} escritas)`);
export const URLS = [...escritos.map(([f]) => `${BASE}/zonas/${f}`), ...ESPANA.map((d) => `${BASE}/${d.slug}.html`)];
