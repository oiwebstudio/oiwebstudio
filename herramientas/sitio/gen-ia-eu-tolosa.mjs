/**
 * «IA para negocios en Tolosa y Tolosaldea» en euskera (14/11/2026, plan tras el análisis de la competencia:
 * el euskera de verdad es lo nuestro). web/adimen-artifiziala-negozioentzat-tolosa.html.
 *
 * Usa como carcasa la página en euskera de Gipuzkoa YA PUBLICADA (menú, pie, estilos, autoría y analítica
 * al día) y cambia solo la cabecera, el JSON-LD y el artículo. Texto nuevo: Itzultzaile Neuronala el
 * 14/11/2026, tal cual salvo las trampas conocidas (memoria euskera-itzultzaile-neuronala): «irakatsi» →
 * «erakutsi» (enseñar = mostrar) y «aipamen» → «erreseina» (como en el resto de la página). Bloques de
 * soluciones, por qué contestar reseñas, cómo trabajo y FAQ comunes: los de la página de Gipuzkoa.
 * Falta que lo lea un euskaldun. Idempotente. Uso: node herramientas/sitio/gen-ia-eu-tolosa.mjs
 */
import fs from "node:fs";
import path from "node:path";

const WEB = path.resolve("web");
const BASE = "adimen-artifiziala-negozioentzat-gipuzkoa";
const EUS = "adimen-artifiziala-negozioentzat-tolosa";
const ES = "ia-para-negocios-tolosa";
const U = (s) => `https://oiwebstudio.com/${s}.html`;
const WA = "https://wa.me/34611497409";

const tpl = fs.readFileSync(path.join(WEB, `${BASE}.html`), "utf8");
const entre = (t, a, b) => { const i = t.indexOf(a), j = t.indexOf(b, i + a.length); if (i < 0 || j < 0) throw new Error("carcasa: " + a); return t.slice(i, j); };

const TITULO = "Tolosa eta Tolosaldeko negozioetarako adimen artifiziala";
const DESC = "Tolosa eta Tolosaldeko negozioetarako adimen artifiziala, zuzenean eta prezio itxiarekin. Enpresa bakoitzari egokitutako adimen artifizialeko soluzioak.";
const LEDE = "Enpresa bakoitzari egokitutako adimen artifizialeko soluzioak eskaintzen ditugu. Tolosatik lan egiten dut: Tolosaldean taberna bat, ile-apaindegi bat, denda bat edo tailer bat baduzu, zure negoziotik igaroko naiz, mugikorrean Googlek eta adimen artifizial batek zuri buruz diotena erakutsiko dizut, eta esango dizut zer zati aurreztuko zenukeen.";

/* Bloques comunes de la página de Gipuzkoa. */
const soluciones = entre(tpl, '<h2 id="funtzionatzen">Funtzionatzen duena</h2>', '<h2 id="erreseinak">').replace('<h2 id="funtzionatzen">Funtzionatzen duena</h2>', '<h2 id="funtzionatzen">Dagoeneko muntatu dezakedana</h2>');
const razones = entre(tpl, '<ul class="check">', '<h2 id="nola">');
const nola = entre(tpl, '<h2 id="nola">', '<div class="cta-band">');
const faqTpl = entre(tpl, '<div class="faq-pre">', '</div>\n\n<p style="margin-top:40px;">');
const faqDe = (q) => { const i = faqTpl.indexOf(`<summary>${q}</summary>`); if (i < 0) throw new Error("faq: " + q); const a = faqTpl.lastIndexOf("<details>", i); return faqTpl.slice(a, faqTpl.indexOf("</details>", i) + 10); };

const FAQ = [
  ["Zuzenean zatoz negoziora?", "Bai, Tolosan eta Tolosaldean arratsaldez pasatzen naiz zure negoziotik, ondo datorkizun orduan. Urrunago bazaude, bideo-dei bidez edo WhatsApp bidez ikusiko dugu."],
  ["Adimen artifiziala ulertu behar dut?", "Ez. Zuk kontatzen didazu zerk kentzen dizun denbora eta ni arduratuko naiz. Argitaratu aurretik erantzunak ontzat emango dituzu."],
];
const det = ([q, r]) => `<details>\n<summary>${q}</summary>\n<p>${r}</p>\n</details>`;
const faqComunes = ["Zenbat balio du?", "Euskaraz lan egiten duzu?"].map(faqDe);
const txt = (s) => s.replace(/<[^>]+>/g, "");
const faqLd = [...FAQ, ...faqComunes.map((d) => [d.match(/<summary>([\s\S]*?)<\/summary>/)[1], txt(d.match(/<p>([\s\S]*?)<\/p>/)[1])])];

const articulo = `<article class="art">
<h2 id="aurrez-aurre">Aurrez aurre</h2>
<p>Adimen artifiziala hobeto ulertzen da mostradorearen aurrean posta elektroniko batean baino. Horregatik, Tolosan eta inguruko herrietan (Ibarra, Villabona, Alegia, Anoeta, Irura, Asteasu, Zizurkil, Legorreta eta Andoain) nahiago dut arratsaldez zure negoziotik pasatu, ordu lasaian, eta zeure mugikorrean erakutsi. Bost minutu dira.</p>
<p>Erakusten dizudana oso zehatza da: bezero batek galdetuko lukeena galdetzen diot bilatzailea duen adimen artifizial bati, eta elkarrekin begiratzen dugu izendatzen zaituen, zure ordutegia ondo dagoen eta Googleren zenbat erreseina dituzun erantzun gabe.</p>
<p>Adibidez: non jan txuleta Tolosan? Zer ile-apaindegi irekiko da larunbatean? Non erosi Tolosako babarrunak?</p>

${soluciones}<h2 id="erreseinak">Erreseinak, lehenengo gauza</h2>
<p>Herri batean denek ezagutzen dute elkar, baina kanpotik datorrenak, edo duela gutxi aldatu denak, Googlen begiratzen dizu sartu aurretik. Erantzundako iritziak dituen fitxa batek dio atzean norbait dagoela negozioa zaintzen duena.</p>
${razones}${nola}<p>Denbora kentzen dizuna beste zerbait bada, aztertu eta 24 orduko epean prezioa esaten dizut. Ez duzu ezer ordaintzen funtzionatzen duen arte.</p>
<div class="cta-band">
<div>
<h3>Zure negoziotik pasatzea nahi duzu?</h3>
<p>Esaidazu noiz doakizun ondo eta mugikorrean erakutsiko dizut zer dioten zutaz Googlek eta adimen artifizial batek. Konpromisorik gabe.</p>
</div>
<a class="btn btn--light" href="${WA}">Idatz iezadazu WhatsApp bidez</a>
</div>

<h2 id="faq">Ohiko galderak</h2>
<div class="faq-pre">
${[...FAQ.map(det), ...faqComunes].join("\n")}
</div>

<p style="margin-top:40px;"><a href="${BASE}.html">Gehiago Gipuzkoako negozioetarako adimen artifizialari buruz.</a></p>
<p><a href="${ES}.html" hreflang="es" lang="es">Orrialde hau gaztelaniaz dago.</a></p>

</article>`;

let h = tpl;
const rep = (a, b) => { if (!h.includes(a)) throw new Error("no: " + a.slice(0, 70)); h = h.split(a).join(b); };
rep("<title>Gipuzkoako negozioetarako adimen artifiziala | OI Studio</title>", `<title>${TITULO}</title>`);
rep('<meta property="og:title" content="Gipuzkoako negozioetarako adimen artifiziala | OI Studio"/>', `<meta property="og:title" content="${TITULO} | OI Studio"/>`);
h = h.replace(/<meta name="description" content="[^"]*"\/>/, `<meta name="description" content="${DESC}"/>`)
  .replace(/<meta property="og:description" content="[^"]*"\/>/, `<meta property="og:description" content="${DESC}"/>`)
  .replace(/<meta name="keywords" content="[^"]*"\/>/, '<meta name="keywords" content="adimen artifiziala tolosa, adimen artifiziala tolosaldea, negozioetarako adimen artifiziala, erreseinei erantzun, oi studio"/>');
rep(U(`${BASE}`), U(EUS));
rep(U("ia-para-negocios-gipuzkoa"), U(ES));
rep('href="ia-para-negocios-gipuzkoa.html" hreflang="es"', `href="${ES}.html" hreflang="es"`);
rep(`href="${BASE}.html" hreflang="eu"`, `href="${EUS}.html" hreflang="eu"`);
rep("/ Gipuzkoako negozioetarako adimen artifiziala</p>", `/ ${TITULO}</p>`);
rep("<h1>Gipuzkoako negozioetarako adimen artifiziala</h1>", `<h1>${TITULO}</h1>`);
h = h.replace(/<p class="lede">[\s\S]*?<\/p>/, `<p class="lede">${LEDE}</p>`);
h = h.replace(/<article class="art">[\s\S]*?<\/article>/, articulo);

/* JSON-LD: el de la carcasa con los datos de Tolosa. */
{
  const m = h.match(/<script type="application\/ld\+json">\n?([\s\S]*?)\n?<\/script>/);
  const ld = JSON.parse(m[1]);
  for (const n of ld["@graph"]) {
    if (n["@type"] === "Service") { n.description = DESC; n.areaServed = ["Tolosa", "Tolosaldea", "Ibarra", "Villabona", "Alegia", "Anoeta", "Irura", "Andoain"].map((x) => ({ "@type": "Place", name: x })); }
    if (n["@type"] === "Article") { n.headline = `${TITULO}: aurrez aurre eta prezio itxiarekin`; n.description = DESC; n.mainEntityOfPage = U(EUS); n.datePublished = "2026-11-14"; n.dateModified = "2026-11-14"; }
    if (n["@type"] === "BreadcrumbList") { const l = n.itemListElement[n.itemListElement.length - 1]; l.name = TITULO; l.item = U(EUS); }
    if (n["@type"] === "FAQPage") n.mainEntity = faqLd.map(([q, r]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: r } }));
  }
  h = h.replace(m[1], JSON.stringify(ld, null, 2));
}
if (h.includes("Gipuzkoako negozioetarako adimen artifiziala</h1>")) throw new Error("quedó el título de Gipuzkoa");
fs.writeFileSync(path.join(WEB, `${EUS}.html`), h);

/* Página en castellano: par hreflang y enlace. */
{
  const f = path.join(WEB, `${ES}.html`);
  let es = fs.readFileSync(f, "utf8");
  if (!es.includes('hreflang="eu"')) {
    es = es.replace(`<link rel="canonical" href="${U(ES)}"/>`, `<link rel="canonical" href="${U(ES)}"/>\n<link rel="alternate" hreflang="es" href="${U(ES)}"/>\n<link rel="alternate" hreflang="eu" href="${U(EUS)}"/>\n<link rel="alternate" hreflang="x-default" href="${U(ES)}"/>`);
    es = es.replace('<p style="margin-top:40px;">Sigue leyendo:', `<p style="margin-top:40px;"><a href="${EUS}.html" hreflang="eu" lang="eu">Orrialde hau euskaraz</a>.</p>\n<p>Sigue leyendo:`);
    fs.writeFileSync(f, es);
  }
}
/* Sitemap y llms.txt. */
{
  let s = fs.readFileSync(path.join(WEB, "sitemap.xml"), "utf8");
  if (!s.includes(`/${EUS}.html`)) fs.writeFileSync(path.join(WEB, "sitemap.xml"), s.replace("</urlset>", `  <url><loc>${U(EUS)}</loc><lastmod>2026-11-14</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n</urlset>`));
  let l = fs.readFileSync(path.join(WEB, "llms.txt"), "utf8");
  if (!l.includes(`/${EUS}.html`) && l.includes(`(${U(ES)}):`)) fs.writeFileSync(path.join(WEB, "llms.txt"), l.replace(`(${U(ES)}):`, `(${U(ES)}) ([euskaraz](${U(EUS)})):`));
}
console.log("escrita", `${EUS}.html`);
