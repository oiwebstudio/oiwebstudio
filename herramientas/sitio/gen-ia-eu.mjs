/**
 * Versión en euskera de «IA para negocios en Gipuzkoa» (6/11/2026):
 * web/adimen-artifiziala-negozioentzat-gipuzkoa.html.
 *
 * Las guías no tienen euskera (generar-euskera.mjs solo traduce las páginas principales y las zonas), así que
 * esta página se escribe aparte: misma carcasa que las guías, menú y pie traducidos con el diccionario EU de
 * assets/i18n.js, sin i18n.js (forzaría lang="es" en una guía) y con ES/EU como enlaces entre las dos páginas.
 * Texto: Itzultzaile Neuronala (euskadi.eus/itzuli) el 6/11/2026, pegado tal cual salvo trampas conocidas del
 * traductor (memoria euskera-itzultzaile-neuronala): «aipamenak» → «hitzorduak» (citas), «aipamen/ezaupide» →
 * «erreseina» (reseñas, como el propio traductor en el resto del texto), «irakatsi» → «erakutsi» (enseñar = mostrar).
 * Falta que lo lea un euskaldun.
 *
 * Además añade el par hreflang es/eu a la página en castellano. Idempotente.
 * Uso: node herramientas/sitio/gen-ia-eu.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { pagina, cta } from "./gen-articulos-nacionales.mjs";
import { ldServicio } from "./articulos-ia.mjs";

const WEB = path.resolve("web");
const ES = "ia-para-negocios-gipuzkoa";
const EUS = "adimen-artifiziala-negozioentzat-gipuzkoa";
const URL_ES = `https://oiwebstudio.com/${ES}.html`;
const URL_EU = `https://oiwebstudio.com/${EUS}.html`;
const WA = "https://wa.me/34611497409";

/* Diccionario EU del menú y el pie. */
const i18n = fs.readFileSync(path.join(WEB, "assets/i18n.js"), "utf8");
const DICT = Function(`return ${i18n.match(/const EU = (\{[\s\S]*?\n\});/)[1]}`)();

const FRASE = "Enpresa bakoitzari egokitutako adimen artifizialeko soluzioak eskaintzen ditugu.";

const a = {
  slug: EUS,
  fecha: "2026-11-06",
  title: "Gipuzkoako negozioetarako adimen artifiziala | OI Studio",
  headline: "Gipuzkoako negozioetarako adimen artifiziala: enpresa bakoitzari egokitutako soluzioak",
  desc: `${FRASE} Prezio itxiarekin, Tolosatik, euskaraz edo gaztelaniaz.`,
  ogdesc: `${FRASE} Prezio itxiarekin, Tolosatik, euskaraz edo gaztelaniaz.`,
  keywords: "adimen artifiziala negozioentzat, adimen artifiziala gipuzkoa, adimen artifiziala tolosa, erreseinei erantzun, oi studio",
  crumb: "Gipuzkoako negozioetarako adimen artifiziala",
  h1: "Gipuzkoako negozioetarako adimen artifiziala",
  lede: `${FRASE} Zure negozioari denbora kentzen diona begiratzen dut eta adimen artifiziala muntatzen dut horretarako. Beti esaten dizut zer zati egiten duen adimen artifizialak eta zer zati egiten dudan nik, Tolosatik, euskaraz edo gaztelaniaz.`,
  img: "stock/art-seo-local", min: 4,
  area: ["Gipuzkoa", "Tolosaldea", "Donostia / San Sebastián"],
  cuerpo: `
<h2 id="funtzionatzen">Funtzionatzen duena</h2>
<h3>Nola ikusten zaituzte Googlek eta adimen artifizialek</h3>
<p>Bezero batek egingo lituzkeen galderak egiten dizkiot bilatzailea duen adimen artifizial bati, eta Googleko zure fitxarekin alderatzen dut erantzuten duena. Konponketak nik egingo ditut: fitxa osoa, erreseinak eskatzeko QR kodea, Bing eta Apple Maps. <strong>120 euro gehi BEZa, behin bakarrik.</strong></p>
<h3>Erantzundako erreseinak</h3>
<p>Adimen artifizialak bezeroaren hizkuntzan idazten du erantzunaren zirriborroa, nik berrikusten dut eta zuk oniritzia ematen duzu argitaratu aurretik. <strong>Zure webgunearen hileko 28 euroko kuotaren barruan doa.</strong></p>
<h3>Erreserbak eta hitzorduak, adimen artifizialik gabe</h3>
<p>Zure bezeroek edozein ordutan erreserbatzen dute zure webgunetik, eta zuk mugikorrean ikusten duzu, erreserbarako komisiorik gabe. Inork ez du zure ordez erabakitzen. <strong>Web orrirako agenda: 160 euro (gehi BEZa) eta 20 euro hilean profesional batekin (8 euro gehiago hilean profesional bakoitzeko).</strong></p>

<h2 id="erreseinak">Zergatik axola du erreseinei erantzutea</h2>
<ul class="check">
<li>Erantzuna ez da erreseina idatzi zuenarentzat bakarrik: hurrengo bezeroak ere irakurtzen du, oraindik ezagutzen ez zaituenak.</li>
<li><a href="https://support.google.com/business/answer/7091?hl=eu" rel="noopener">Googlek enpresentzat emandako laguntzaren</a> arabera, erreseina gehiago eta balorazio onak izateak hobetu egin dezake bilaketa lokaletan duzun posizioa, eta horiei erantzuteak erakusten du zure bezeroek esaten dizutena baloratzen duzula.</li>
<li>Milaka hotelekin egindako ikerketa batek (<a href="https://hbr.org/2018/02/study-replying-to-customer-reviews-results-in-better-ratings" rel="noopener">Harvard Business Review, 2018</a>) ikusi zuen erantzuten hasi zirenak batez beste hamarren bat izar baino gehiago igo zirela, beste ezer aldatu gabe.</li>
<li>Erantzun gabeko erreseina txar bat hor geratzen da urteetan. Erantzun lasai batek, eztabaidatzen ez duenak, jendea zaintzen duzula erakusten du.</li>
</ul>

<h2 id="nola">Nola egiten dut lan</h2>
<ol>
<li>Hitz egiten dugu edo zure negoziotik pasatzen naiz, eta kontatzen didazu zerk kentzen dizun denbora.</li>
<li>Doan erakutsiko dizut, zure mugikorrean, Googlek eta adimen artifizial batek zutaz diotena.</li>
<li>Gauza bat edo bi proposatzen dizkizut prezio itxiarekin.</li>
<li>Azkenean ordaintzen da, funtzionatzen ari denean.</li>
</ol>
<p>Egunen batean zure bezeroei bakarrik erantzuten dien programa bat jartzen baduzu, adimen artifiziala dela jakinarazi behar duzu, adimen artifizialari buruzko Europako Araudiaren 50. artikuluak eskatzen duen bezala.</p>
${cta("Doan erakutsiko dizut zer dioen adimen artifizial batek zure negozioari buruz", "Bezero batek egingo lituzkeen galderak egiten dizkiot, eta zer erantzuten duen, zer huts egiten duen eta nola konpontzen den bidaltzen dizut.", "Eska iezadazu WhatsApp bidez", WA)}
`,
  faq: [
    ["Zer da enpresa bakoitzari egokitutako adimen artifizialeko soluzio bat?", "Ez dut denentzat berdina den programa bat saltzen: zuri denbora kentzen dizuna begiratzen dut eta adimen artifiziala muntatzen dut horretarako bakarrik. Lan bat ondo ateratzen bada arau finkoekin, erreserbak bezala, adimen artifizialik gabe egiten dut."],
    ["Zenbat balio du?", "Googlen eta adimen artifizialetan dagoen presentziak, 120 euro gehi BEZa behin. Erantzundako erreseinak zure webguneko 28 euroko hileko kuotaren barruan daude. Neurrira egindako zerbait behar baduzu, 24 orduko epean prezioa esango dizut."],
    ["Adimen artifizialak bakarrik erantzuten die nire bezeroei?", "Ez. Adimen artifizialak zirriborroak prestatzen ditu eta nik berrikusten ditut; ez da ezer argitaratzen zure oniritzirik gabe."],
    ["Euskaraz lan egiten duzu?", "Bai. Arreta euskaraz eta gaztelaniaz."],
  ],
  cierre: `<a href="${ES}.html" hreflang="es" lang="es">Orrialde hau gaztelaniaz dago.</a>`,
};

let h = pagina(a).replace(/\r?\n/g, "\n");

/* Idioma y señales. */
h = h.replace('<html lang="es">', '<html lang="eu">')
  .replace('<meta property="og:locale" content="es_ES"/>', '<meta property="og:locale" content="eu_ES"/>')
  .replace('"inLanguage": "es"', '"inLanguage": "eu"')
  .replace(`<link rel="canonical" href="${URL_EU}"/>`, `<link rel="canonical" href="${URL_EU}"/>\n<link rel="alternate" hreflang="es" href="${URL_ES}"/>\n<link rel="alternate" hreflang="eu" href="${URL_EU}"/>\n<link rel="alternate" hreflang="x-default" href="${URL_ES}"/>`)
  .replace(/"name": "Inicio"/, '"name": "Hasiera"')
  .replace(/"name": "Artículos"/, '"name": "Artikuluak"');
h = h.replace('"@graph": [', '"@graph": [\n    ' + JSON.stringify({ ...ldServicio(a), name: "Enpresa bakoitzari egokitutako adimen artifizialeko soluzioak", serviceType: "Adimen artifiziala eta automatizazioak negozio txikientzat", description: a.ogdesc }) + ",");

/* Títulos en mayúsculas, como la página en castellano. */
h = h.replace("<body>", '<body class="ia-pg">')
  .replace("</head>", "<style>.ia-pg .art-hero h1,.ia-pg .art h2,.ia-pg .art h3,.ia-pg .cta-band h3{text-transform:uppercase;letter-spacing:0;}</style>\n</head>");

/* Menú y pie en euskera (diccionario de i18n.js); los enlaces a páginas con versión eu/ van a ella. */
h = h.replace(/(<([a-z0-9]+)\b[^>]*\bdata-t="([a-z_0-9]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g, (m, open, tag, k, inner, close) => (DICT[k] != null ? open + DICT[k] + close : m));
const CON_EU = ["index.html", "precios.html", "contacto.html", "trabajos.html", "sobre-mi.html", "seo-posicionamiento-google.html", "automatizaciones.html", "branding.html"];
h = h.replace(/href="(index|precios|contacto|trabajos|sobre-mi|seo-posicionamiento-google|automatizaciones|branding)\.html(#[^"]*)?"/g, (m, p, hash = "") => (CON_EU.includes(`${p}.html`) ? `href="eu/${p}.html${hash}"` : m));
h = h.replace(/<div class="lang-switch" role="group" aria-label="Idioma \/ Hizkuntza">[\s\S]*?<\/div>/,
  `<div class="lang-switch" role="group" aria-label="Idioma / Hizkuntza">\n<a class="lang-link" href="${ES}.html" hreflang="es" lang="es" aria-label="Ver en castellano">ES</a>\n<a class="lang-link is-active" href="${EUS}.html" hreflang="eu" lang="eu" aria-current="page">EU</a>\n</div>`);
/* Sin i18n.js: en una guía forzaría lang="es". */
h = h.replace(/<script src="assets\/i18n\.js[^"]*"><\/script>\n?/, "");
/* Cabecera del artículo y FAQ. */
h = h.replace('<p class="crumbs"><a href="index.html">Inicio</a> / <a href="articulos.html">Artículos</a> /', '<p class="crumbs"><a href="eu/index.html">Hasiera</a> / <a href="articulos.html">Artikuluak</a> /')
  .replace('<p class="crumbs"><a href="eu/index.html">Inicio</a> / <a href="articulos.html">Artículos</a> /', '<p class="crumbs"><a href="eu/index.html">Hasiera</a> / <a href="articulos.html">Artikuluak</a> /')
  .replace(/<div class="art-meta">[\s\S]*?<\/div>\n/, "")
  .replace('<h2 id="faq">Preguntas frecuentes</h2>', '<h2 id="faq">Ohiko galderak</h2>');

fs.writeFileSync(path.join(WEB, `${EUS}.html`), h);

/* Par hreflang en la página en castellano. */
{
  const f = path.join(WEB, `${ES}.html`);
  let es = fs.readFileSync(f, "utf8");
  if (!es.includes('hreflang="eu"')) {
    es = es.replace(`<link rel="canonical" href="${URL_ES}"/>`, `<link rel="canonical" href="${URL_ES}"/>\n<link rel="alternate" hreflang="es" href="${URL_ES}"/>\n<link rel="alternate" hreflang="eu" href="${URL_EU}"/>\n<link rel="alternate" hreflang="x-default" href="${URL_ES}"/>`);
    es = es.replace('<p style="margin-top:40px;">Sigue leyendo:', `<p style="margin-top:40px;"><a href="${EUS}.html" hreflang="eu" lang="eu">Orrialde hau euskaraz</a>.</p>\n<p>Sigue leyendo:`);
    fs.writeFileSync(f, es);
  }
}

/* Sitemap y llms.txt. */
{
  let s = fs.readFileSync(path.join(WEB, "sitemap.xml"), "utf8");
  if (!s.includes(`/${EUS}.html`)) {
    s = s.replace("</urlset>", `  <url><loc>${URL_EU}</loc><lastmod>2026-11-06</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n</urlset>`);
    fs.writeFileSync(path.join(WEB, "sitemap.xml"), s);
  }
  let l = fs.readFileSync(path.join(WEB, "llms.txt"), "utf8");
  if (!l.includes(`/${EUS}.html`)) {
    l = l.replace(`(${URL_ES}):`, `(${URL_ES}) ([euskaraz](${URL_EU})):`);
    fs.writeFileSync(path.join(WEB, "llms.txt"), l);
  }
}
console.log("escrita", `${EUS}.html`);
