/**
 * Publica las guías de octubre de 2026 (articulos-octubre-a.mjs, -b.mjs y -c.mjs):
 *   1. escribe cada página con la carcasa común (gen-articulos-nacionales.mjs),
 *   2. añade su bloque «Sigue leyendo»,
 *   3. las da de alta en articulos.html, sitemap.xml y llms.txt,
 *   4. enlaza hacia ellas desde guías relacionadas ya publicadas.
 * Es idempotente: se puede relanzar sin duplicar nada. Solo ESCRIBE las páginas que aún no existen en web/
 * (las ya publicadas llevan retoques posteriores, como ?v=4 en las fotos, que regenerarlas borraría);
 * con --rehacer las reescribe todas.
 *
 * Uso: node herramientas/sitio/gen-articulos-nuevos.mjs [--rehacer]
 */
import fs from "node:fs";
import path from "node:path";
import { pagina, conservarRelacionados } from "./gen-articulos-nacionales.mjs";
import { ARTICULOS_A } from "./articulos-octubre-a.mjs";
import { ARTICULOS_B } from "./articulos-octubre-b.mjs";
import { ARTICULOS_C } from "./articulos-octubre-c.mjs";
import { ARTICULOS_NOV } from "./articulos-noviembre.mjs";
import { ARTICULOS_IA, ldServicio } from "./articulos-ia.mjs";

const WEB = path.resolve("web");
const TODOS = [...ARTICULOS_A, ...ARTICULOS_B, ...ARTICULOS_C, ...ARTICULOS_NOV, ...ARTICULOS_IA];
const REHACER = process.argv.includes("--rehacer");
const NUEVAS = TODOS.filter((a) => REHACER || !fs.existsSync(path.join(WEB, `${a.slug}.html`)));
const rd = (f) => fs.readFileSync(path.join(WEB, f), "utf8");
const wr = (f, t) => fs.writeFileSync(path.join(WEB, f), t);

/* Ficha de cada guía en la portada de artículos. */
const HUB = {
  "cuanto-cuesta-un-logo": { cat: "Branding", tag: "Precios", img: "stock/art-precio-web", alt: "Persona trabajando con un ordenador portátil", h2: "Cuánto cuesta un logo para tu negocio en 2026", p: "Lo que cuesta según quién lo haga, qué debe incluir cobre lo que cobre y qué preguntar antes de encargarlo." },
  "branding-para-negocio-pequeno": { cat: "Branding", tag: "Marca", img: "stock/art-redes-sociales", alt: "Pantalla con redes sociales de un negocio", h2: "Branding para un negocio pequeño: qué necesitas y qué no", p: "Cuándo basta con un logo, cuándo necesitas identidad y qué puedes dejar para más tarde." },
  "que-automatizar-negocio-pequeno": { cat: "Automatizaciones", tag: "Empezar", img: "stock/sec-pelu-1", alt: "Interior de una peluquería", h2: "Qué automatizar en un negocio pequeño y por dónde empezar", p: "Qué tareas merece la pena automatizar, cuáles no y cómo saber si te compensa." },
  "inteligencia-artificial-negocio-pequeno": { cat: "Automatizaciones", tag: "IA", img: "stock/art-seo-local", alt: "Persona buscando un negocio en el móvil", h2: "Inteligencia artificial para un negocio pequeño: qué funciona hoy", p: "Para qué sirve hoy la IA, dónde no la dejaría sola y qué exige la ley si hablas con clientes." },
  "diseno-web-profesional-que-incluye": { cat: "Empezar", tag: "Guías", h2: "Diseño web profesional: qué incluye y en qué se nota", p: "Qué debe llevar una web para llamarse profesional, en qué se diferencia de una plantilla y cómo comprobarlo antes de pagar.", img: "etxea-desk", alt: "Muestra de web de inmobiliaria, ejemplo de diseño web profesional" },
  "diseno-web-barato-merece-la-pena": { cat: "Precios y plazos", tag: "Precios", h2: "Diseño web barato: cuándo merece la pena y cuándo no", p: "Qué esperar de una web económica, las trampas del presupuesto (cuotas, permanencias, dominio ajeno) y seis preguntas antes de pagar.", img: "stock/art-precio-web", alt: "Escritorio de trabajo con portátil, representando el precio de una web" },
  "diseno-web-donostia-agencia-o-freelance": { cat: "Empezar", tag: "Donostia", h2: "Diseñador web freelance en Donostia o agencia: cuál elegir", p: "Diferencias reales en precio, trato y plazos, qué preguntar y por qué en una ciudad grande conviene pensar en tu barrio.", img: "pedala-desk", alt: "Muestra de web de tienda de bicis, ejemplo de web para un negocio de barrio" },
  "web-para-empresa-industrial-gipuzkoa": { cat: "Por sector", tag: "Industria", h2: "Web para empresa industrial en Gipuzkoa: qué necesita", p: "Capacidades, certificaciones, catálogo e idiomas: cómo convencer a un comprador técnico y captar clientes B2B.", img: "torloju-desk", alt: "Muestra de web de taller mecánico con presupuesto en un minuto" },
  "aviso-legal-privacidad-cookies-web-negocio": { cat: "Empezar", tag: "Legal", h2: "Aviso legal, privacidad y cookies en la web de tu negocio", p: "Qué exige la ley (LSSI y RGPD) a la web de un negocio, qué texto hace falta en cada caso y los errores más habituales.", img: "stock/art-redes-sociales", alt: "Móvil con redes sociales, representando los textos legales de una web" },
  "wordpress-wix-o-web-a-medida": { cat: "Empezar", tag: "Comparativa", h2: "WordPress, Wix o web a medida: cuál te conviene", p: "Comparativa sincera de coste, velocidad, mantenimiento y propiedad, y para quién sirve cada opción.", img: "stock/art-seo-local", alt: "Comercio local de calle, representando la elección de una plataforma web" },
  "web-para-fisioterapia-clinica": { cat: "Por sector", tag: "Fisioterapia", h2: "Web para fisioterapia: qué necesita una clínica", p: "Técnicas explicadas, equipo y colegiación, primera cita, precios y privacidad: lo que atrae pacientes.", img: "arin-desk", alt: "Muestra de web de fisioterapia con mapa del cuerpo" },
  "web-para-psicologo-consulta": { cat: "Por sector", tag: "Psicología", h2: "Web para psicólogo: qué necesita una consulta", p: "Tono sereno, primera sesión, privacidad de los datos de salud y euskera: cómo generar confianza antes de la primera cita.", img: "ekhi-desk", alt: "Muestra de web de psicología con tono sereno" },
  "web-para-inmobiliaria": { cat: "Por sector", tag: "Inmobiliaria", h2: "Web para inmobiliaria: qué necesita para captar vendedores", p: "Tasación gratuita, fichas, zonas y confianza: cómo captar propietarios sin depender de los portales.", img: "etxea-desk", alt: "Muestra de web de inmobiliaria con tasación gratuita" },
  "cuanto-cobra-disenador-web-freelance": { cat: "Precios y plazos", tag: "Precios", h2: "Cuánto cobra un diseñador web freelance en 2026", p: "Por proyecto o por horas, qué entra en el precio, en qué se diferencia de una agencia y seis preguntas antes de aceptar un presupuesto.", img: "stock/art-precio-web", alt: "Escritorio de trabajo con portátil, representando lo que cobra un diseñador web" },
  "diseno-web-euskadi-pais-vasco": { cat: "Empezar", tag: "Euskadi", h2: "Diseño web en Euskadi: precios y cómo elegir", p: "Qué cuesta una web en Gipuzkoa, Bizkaia y Álava, qué debe incluir, el euskera bien hecho y cómo trabajo a distancia desde Tolosa.", img: "errotatxo-desk", alt: "Web de la panadería Errotatxo de Tolosa, en castellano y euskera" },
  /* IA para negocios (6/11/2026) */
  "ia-para-negocios-gipuzkoa": { cat: "Automatizaciones", tag: "IA", img: "stock/art-seo-local", alt: "Persona buscando un negocio en el móvil", h2: "IA para negocios en Gipuzkoa: soluciones adaptadas a cada empresa", p: "Qué funciona hoy (Google y las IAs, reseñas respondidas, reservas), qué hace la IA y qué hago yo, con precio cerrado." },
  "ia-para-negocios-tolosa": { cat: "Automatizaciones", tag: "Tolosa", img: "stock/art-seo-local", alt: "Comercio de calle de un pueblo", h2: "IA para negocios en Tolosa y Tolosaldea", p: "Paso por tu negocio, te enseño en tu móvil lo que dicen Google y una IA de ti y te digo qué te ahorraría tiempo." },
  "ia-para-negocios-donostia": { cat: "Automatizaciones", tag: "Donostia", img: "hauspo-desk", alt: "Muestra de web de restaurante HAUSPO", h2: "IA para negocios en Donostia: para el negocio pequeño", p: "Reseñas en el idioma del cliente, carta en idiomas, Google y las IAs y reservas, para el bar, la tienda o el alojamiento." },
  "ia-para-restaurantes-gipuzkoa": { cat: "Por sector", tag: "Restaurantes", img: "hauspo-desk", alt: "Muestra de web de restaurante HAUSPO con reservas", h2: "IA para restaurantes y bares: reseñas, carta y reservas", p: "Reseñas contestadas con tu tono, carta en cuatro idiomas, Google y las IAs y reservas de mesa sin comisión." },
  "ia-para-peluquerias-estetica-gipuzkoa": { cat: "Por sector", tag: "Peluquerías", img: "stock/sec-pelu-1", alt: "Interior de una peluquería", h2: "IA para peluquerías y centros de estética", p: "Citas online sin IA y sin comisión, reseñas contestadas y lo que dice de ti una IA." },
  "ia-para-casas-rurales-gipuzkoa": { cat: "Por sector", tag: "Casas rurales", img: "aberri-desk", alt: "Web de la casa rural A.Berri de Getaria", h2: "IA para casas rurales: reservas propias y reseñas", p: "Reservas sin comisión con calendario, reseñas en el idioma del huésped y cómo te ven Google y las IAs." },
};

/* Enlaces «Sigue leyendo» de cada guía nueva. */
const REL = {
  "cuanto-cuesta-un-logo": ["branding-para-negocio-pequeno", "precio-diseno-web-profesional", "como-elegir-disenador-web-gipuzkoa"],
  "branding-para-negocio-pequeno": ["cuanto-cuesta-un-logo", "que-debe-tener-web-negocio-local", "conseguir-resenas-google-negocio-local"],
  "que-automatizar-negocio-pequeno": ["inteligencia-artificial-negocio-pequeno", "conseguir-resenas-google-negocio-local", "google-business-profile-guia"],
  "inteligencia-artificial-negocio-pequeno": ["que-automatizar-negocio-pequeno", "conseguir-resenas-google-negocio-local", "aviso-legal-privacidad-cookies-web-negocio"],
  "diseno-web-profesional-que-incluye": ["precio-diseno-web-profesional", "que-debe-tener-web-negocio-local", "aviso-legal-privacidad-cookies-web-negocio"],
  "diseno-web-barato-merece-la-pena": ["precio-diseno-web-profesional", "cuanto-cuesta-mantener-una-web-al-ano", "ayudas-subvenciones-pagina-web-gipuzkoa"],
  "diseno-web-donostia-agencia-o-freelance": ["como-elegir-disenador-web-gipuzkoa", "google-business-profile-guia", "precio-diseno-web-profesional"],
  "web-para-empresa-industrial-gipuzkoa": ["web-para-taller-mecanico", "web-bilingue-euskera-castellano", "seo-local-tolosa-google-maps"],
  "aviso-legal-privacidad-cookies-web-negocio": ["que-debe-tener-web-negocio-local", "pagina-web-para-autonomos", "como-crear-pagina-web-negocio-paso-a-paso"],
  "wordpress-wix-o-web-a-medida": ["landing-page-o-web-completa", "cuanto-cuesta-mantener-una-web-al-ano", "precio-diseno-web-profesional"],
  "web-para-fisioterapia-clinica": ["web-para-psicologo-consulta", "web-para-clinica-veterinaria", "google-business-profile-guia"],
  "web-para-psicologo-consulta": ["web-para-fisioterapia-clinica", "web-bilingue-euskera-castellano", "aviso-legal-privacidad-cookies-web-negocio"],
  "web-para-inmobiliaria": ["google-business-profile-guia", "conseguir-resenas-google-negocio-local", "precio-diseno-web-profesional"],
  "cuanto-cobra-disenador-web-freelance": ["precio-diseno-web-profesional", "diseno-web-barato-merece-la-pena", "diseno-web-donostia-agencia-o-freelance"],
  "diseno-web-euskadi-pais-vasco": ["web-bilingue-euskera-castellano", "ayudas-subvenciones-pagina-web-gipuzkoa", "como-elegir-disenador-web-gipuzkoa"],
  "ia-para-negocios-gipuzkoa": ["ia-para-negocios-tolosa", "ia-para-restaurantes-gipuzkoa", "inteligencia-artificial-negocio-pequeno"],
  "ia-para-negocios-tolosa": ["ia-para-negocios-gipuzkoa", "seo-local-tolosa-google-maps", "conseguir-resenas-google-negocio-local"],
  "ia-para-negocios-donostia": ["ia-para-negocios-gipuzkoa", "ia-para-restaurantes-gipuzkoa", "diseno-web-donostia-agencia-o-freelance"],
  "ia-para-restaurantes-gipuzkoa": ["ia-para-negocios-gipuzkoa", "web-para-restaurante-hosteleria", "conseguir-resenas-google-negocio-local"],
  "ia-para-peluquerias-estetica-gipuzkoa": ["ia-para-negocios-gipuzkoa", "web-para-peluqueria-centro-estetica", "conseguir-resenas-google-negocio-local"],
  "ia-para-casas-rurales-gipuzkoa": ["ia-para-negocios-gipuzkoa", "google-business-profile-guia", "conseguir-resenas-google-negocio-local"],
};

/* Y las guías ya publicadas que enlazan hacia las nuevas (se añade una tarjeta al final). */
const RECIPROCO = {
  "conseguir-resenas-google-negocio-local": ["inteligencia-artificial-negocio-pequeno", "que-automatizar-negocio-pequeno"],
  "web-para-peluqueria-centro-estetica": ["que-automatizar-negocio-pequeno"],
  "web-para-restaurante-hosteleria": ["que-automatizar-negocio-pequeno"],
  "pagina-web-para-autonomos": ["cuanto-cuesta-un-logo", "branding-para-negocio-pequeno"],
  "que-debe-tener-web-negocio-local": ["branding-para-negocio-pequeno"],
  "precio-diseno-web-profesional": ["diseno-web-barato-merece-la-pena", "diseno-web-profesional-que-incluye", "cuanto-cobra-disenador-web-freelance"],
  "cuanto-cuesta-mantener-una-web-al-ano": ["wordpress-wix-o-web-a-medida"],
  "landing-page-o-web-completa": ["wordpress-wix-o-web-a-medida"],
  "dominio-eus-es-com": ["wordpress-wix-o-web-a-medida", "diseno-web-euskadi-pais-vasco"],
  "que-debe-tener-web-negocio-local": ["diseno-web-profesional-que-incluye", "aviso-legal-privacidad-cookies-web-negocio"],
  "pagina-web-para-autonomos": ["aviso-legal-privacidad-cookies-web-negocio", "web-para-psicologo-consulta"],
  "como-crear-pagina-web-negocio-paso-a-paso": ["aviso-legal-privacidad-cookies-web-negocio"],
  "como-elegir-disenador-web-gipuzkoa": ["diseno-web-donostia-agencia-o-freelance", "diseno-web-profesional-que-incluye", "cuanto-cobra-disenador-web-freelance", "diseno-web-euskadi-pais-vasco"],
  "web-para-clinica-veterinaria": ["web-para-fisioterapia-clinica"],
  "web-para-peluqueria-centro-estetica": ["web-para-fisioterapia-clinica"],
  "web-para-taller-mecanico": ["web-para-empresa-industrial-gipuzkoa"],
  "web-bilingue-euskera-castellano": ["web-para-psicologo-consulta", "web-para-empresa-industrial-gipuzkoa", "diseno-web-euskadi-pais-vasco"],
  "seo-local-tolosa-google-maps": ["web-para-inmobiliaria"],
  "google-business-profile-guia": ["web-para-fisioterapia-clinica", "web-para-inmobiliaria"],
  "diseno-web-barato-merece-la-pena": ["cuanto-cobra-disenador-web-freelance"],
  "diseno-web-donostia-agencia-o-freelance": ["cuanto-cobra-disenador-web-freelance"],
  "diseno-web-profesional-que-incluye": ["cuanto-cobra-disenador-web-freelance"],
  "ayudas-subvenciones-pagina-web-gipuzkoa": ["diseno-web-euskadi-pais-vasco"],
  /* IA para negocios (6/11/2026). Van al final: las claves repetidas de arriba se pisarían. */
  "inteligencia-artificial-negocio-pequeno": ["ia-para-negocios-gipuzkoa"],
  "que-automatizar-negocio-pequeno": ["ia-para-negocios-gipuzkoa"],
  "web-para-restaurante-hosteleria": ["ia-para-restaurantes-gipuzkoa"],
  "web-para-peluqueria-centro-estetica": ["ia-para-peluquerias-estetica-gipuzkoa"],
  "seo-local-tolosa-google-maps": ["ia-para-negocios-tolosa"],
  "diseno-web-donostia-agencia-o-freelance": ["ia-para-negocios-donostia"],
};

const INI = "<!-- RELACIONADOS:inicio -->", FIN = "<!-- RELACIONADOS:fin -->";
const hub0 = rd("articulos.html");
const catDe = (slug) => HUB[slug]?.cat || hub0.match(new RegExp(`data-cat="([^"]+)" href="${slug}\\.html"`))?.[1] || "Empezar";
const tituloDe = (slug) => (rd(`${slug}.html`).match(/<title>([^<]*)<\/title>/)?.[1] || slug).replace(/ \| OI Studio$/, "");
const descDe = (slug) => {
  const d = (rd(`${slug}.html`).match(/<meta name="description" content="([^"]*)"/)?.[1] || "").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
  if (d.length <= 112) return d;
  return d.slice(0, 112).replace(/\s+\S*$/, "") + "…";
};
const li = (slug) => `<li><a href="${slug}.html"><span class="rel__k">${catDe(slug)}</span><b>${tituloDe(slug)}</b><span>${descDe(slug)}</span></a></li>`;

/* Estilo del bloque: se toma de una guía que ya lo tiene. */
const molde = rd("landing-page-o-web-completa.html");
const estiloRel = molde.slice(molde.indexOf(INI), molde.indexOf("<h2 id=\"rel-t\""));
const bloque = (slugs) => `${estiloRel}<h2 id="rel-t" class="rel__h">Sigue leyendo</h2>\n<ul class="rel__grid">\n${slugs.map(li).join("\n")}\n</ul>\n</div>\n</section>\n${FIN}\n`;

/* 1. Páginas. */
let escritas = 0;
for (const a of NUEVAS) {
  const ruta = path.join(WEB, `${a.slug}.html`);
  let h = pagina(a).replace(/\r?\n/g, "\n");
  if (a.bodyClass) {
    /* Páginas de IA: títulos en mayúsculas y nodo Service en el JSON-LD. */
    h = h.replace("<body>", `<body class="${a.bodyClass}">`);
    h = h.replace("</head>", "<style>.ia-pg .art-hero h1,.ia-pg .art h2,.ia-pg .cta-band h3{text-transform:uppercase;letter-spacing:0;}</style>\n</head>");
    h = h.replace('"@graph": [', '"@graph": [\n    ' + JSON.stringify(ldServicio(a)) + ",");
  }
  h = conservarRelacionados(ruta, h);
  fs.writeFileSync(ruta, h);
  escritas++;
}
/* 2. «Sigue leyendo» (necesita que todas las páginas existan ya). */
for (const a of NUEVAS) {
  let h = rd(`${a.slug}.html`);
  if (h.includes(INI)) h = h.slice(0, h.indexOf(INI)) + h.slice(h.indexOf(FIN) + FIN.length).replace(/^\n/, "");
  const ancla = h.indexOf('<footer class="footer">');
  if (ancla < 0) throw new Error("sin pie en " + a.slug);
  h = h.slice(0, ancla) + bloque(REL[a.slug]) + h.slice(ancla);
  wr(`${a.slug}.html`, h);
}
console.log("páginas escritas:", escritas, NUEVAS.map((a) => a.slug).join(", "));

/* 3. Portada de artículos. */
{
  let h = rd("articulos.html");
  const tarjetas = TODOS.filter((a) => !h.includes(`href="${a.slug}.html"`)).map((a) => {
    const c = HUB[a.slug];
    return `<a class="post-card" data-cat="${c.cat}" href="${a.slug}.html">
<div class="thumb"><picture><source srcset="assets/${c.img}.webp" type="image/webp"/><img src="assets/${c.img}.jpg" alt="${c.alt}" loading="lazy" width="900" height="562" style="object-fit:cover"/></picture></div>
<div class="body">
<span class="tag">${c.tag}</span>
<h2>${c.h2}</h2>
<p>${c.p}</p>
<div class="meta"><span>${a.fecha >= "2026-11" ? "Noviembre" : "Octubre"} 2026</span><span class="rd">Leer · ${a.min} min →</span></div>
</div>
</a>

`;
  });
  if (tarjetas.length) {
    const i = h.indexOf('<a class="post-card"');
    h = h.slice(0, i) + tarjetas.join("") + h.slice(i);
    wr("articulos.html", h);
  }
  console.log("tarjetas nuevas en articulos.html:", tarjetas.length);
}

/* 4. Sitemap y llms.txt. */
{
  let s = rd("sitemap.xml");
  let n = 0;
  for (const a of TODOS) {
    if (s.includes(`/${a.slug}.html`)) continue;
    s = s.replace("</urlset>", `  <url><loc>https://oiwebstudio.com/${a.slug}.html</loc><lastmod>${a.fecha}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n</urlset>`);
    n++;
  }
  wr("sitemap.xml", s);
  let l = rd("llms.txt");
  let m = 0;
  for (const a of TODOS) {
    if (l.includes(`/${a.slug}.html`)) continue;
    const linea = `- [${a.crumb}](https://oiwebstudio.com/${a.slug}.html): ${a.ogdesc}\n`;
    const fin = l.indexOf("\n\n", l.indexOf("## Guías"));
    l = fin < 0 ? l.trimEnd() + "\n" + linea : l.slice(0, fin + 1) + linea + l.slice(fin + 1);
    m++;
  }
  wr("llms.txt", l);
  console.log("sitemap +", n, "· llms.txt +", m);
}

/* 5. Enlaces desde guías ya publicadas. */
{
  let n = 0;
  for (const [pag, nuevos] of Object.entries(RECIPROCO)) {
    let h = rd(`${pag}.html`);
    if (!h.includes(FIN)) { console.log("  (sin bloque «Sigue leyendo»)", pag); continue; }
    const fin = h.indexOf("</ul>", h.indexOf('class="rel__grid"'));
    let anadir = "";
    for (const s of nuevos) if (!h.includes(`href="${s}.html"><span class="rel__k">`)) anadir += li(s) + "\n";
    if (!anadir) continue;
    h = h.slice(0, fin) + anadir + h.slice(fin);
    wr(`${pag}.html`, h);
    n++;
  }
  console.log("guías con enlaces nuevos:", n);
}
