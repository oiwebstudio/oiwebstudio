/**
 * Pie de página con mapa de enlaces (octubre 2026; resumido el 17/10/2026).
 *
 * Lleva a todo lo que importa —servicios, guías, zonas— desde cada página del
 * sitio: es la forma más barata de que Google y las personas lleguen a las
 * páginas profundas. Ningún enlace se pierde al resumirlo.
 *
 * En el móvil: logo, una línea, los contactos a un toque (2 × 2) y cada grupo
 * (Secciones, Servicios, Guías, Dónde trabajo) en un <details> nativo cerrado;
 * aviso legal y copyright en una línea. En el ordenador, los grupos se ven
 * abiertos en columnas (main.js les pone «open» a partir de 760 px y el CSS
 * oculta el botón de plegar).
 *
 * El pie está copiado en todas las páginas (raíz, zonas/ y guías). Con este
 * script se reescribe en todas a la vez. Es idempotente. Los generadores que
 * copian el pie de una página existente (gen-zonas-ampliado.mjs ←
 * zonas/anoeta.html, gen-articulos-nacionales.mjs ←
 * cuanto-tarda-hacer-pagina-web.html) heredan el nuevo sin tocarlos.
 *
 * pieHtml(prefijo): "" para la raíz, "../" para /zonas/, "/" para 404.html.
 * Devuelve desde <div class="footer__grid"> hasta el cierre de footer__bottom.
 *
 * Uso (desde la raíz):  node herramientas/sitio/pie.mjs [--check]
 */
import fs from "node:fs";
import path from "node:path";

const COMARCAS = [
  ["tolosaldea", "Tolosaldea"], ["buruntzaldea", "Buruntzaldea"], ["donostialdea", "Donostialdea"], ["oarsoaldea", "Oarsoaldea"],
  ["bidasoa", "Bidasoa"], ["goierri", "Goierri"], ["urola-garaia", "Urola Garaia"], ["urola-erdia", "Urola Erdia"],
  ["urola-kosta", "Urola Kosta"], ["debabarrena", "Debabarrena"], ["debagoiena", "Debagoiena"],
];
const GUIAS = [
  ["precio-diseno-web-profesional.html", "Cuánto cuesta una web profesional"],
  ["pagina-web-para-autonomos.html", "Página web para autónomos"],
  ["landing-page-o-web-completa.html", "Landing o web completa"],
  ["como-crear-pagina-web-negocio-paso-a-paso.html", "Crear la web de tu negocio"],
  ["seo-local-tolosa-google-maps.html", "SEO local y Google Maps"],
  ["google-business-profile-guia.html", "Guía de Google Business Profile"],
  ["ayudas-subvenciones-pagina-web-gipuzkoa.html", "Ayudas para tu web en Gipuzkoa"],
];

const I = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICONO = {
  wa: I('<path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.5 8.5 0 0 1-4-1L3 20l1-5.5A8.5 8.5 0 1 1 21 11.5z"/>'),
  tel: I('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>'),
  mail: I('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
  ig: I('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>'),
};

export function pieHtml(p = "") {
  const li = (href, txt, key) => `<li><a href="${p}${href}"${key ? ` data-t="${key}"` : ""}>${txt}</a></li>`;
  const grupo = (key, txt, cuerpo, clase = "") => `<details class="foot-g">
<summary class="foot-h"><span data-t="${key}">${txt}</span></summary>
<ul${clase ? ` class="${clase}"` : ""}>
${cuerpo}
</ul>
</details>`;
  return `<div class="footer__grid">
<div class="footer__col footer__col--brand">
<a href="${p}index.html" class="footer__logo"><img src="${p}assets/logo-nav-black.png" alt="OI Studio" class="footer__logo-img" width="320" height="86"/></a>
<p class="footer__desc" data-t="foot_desc">Webs a medida para negocios locales.</p>
<ul class="foot-contacto">
<li><a href="https://wa.me/34611497409" target="_blank" rel="noopener">${ICONO.wa}<span>WhatsApp</span></a></li>
<li><a href="tel:+34611497409">${ICONO.tel}<span>611 49 74 09</span></a></li>
<li><a class="js-mail" data-u="contactoiwebstudio" data-d="gmail.com">${ICONO.mail}<span data-t="ft_correo">Correo</span></a></li>
<li><a href="https://instagram.com/oi.webstudio" target="_blank" rel="noopener">${ICONO.ig}<span>Instagram</span></a></li>
</ul>
</div>
${grupo("foot_secciones", "Secciones", [
  li("sobre-mi.html", "Sobre mí", "nav_sobre"),
  li("trabajos.html", "Portfolio", "foot_portfolio"),
  li("precios.html", "Precios", "nav_precios"),
  li("ayudas-subvenciones-pagina-web-gipuzkoa.html", "Ayudas", "nav_ayudas"),
  li("articulos.html", "Artículos", "nav_articulos"),
  li("contacto.html", "Contacto", "nav_contacto"),
].join("\n"))}
${grupo("foot_servicios", "Servicios", [
  // 23/10/2026: oferta nueva (web bonita + presencia, presencia en Google 120 €;
  // el chatbot sale de la lista y la landing pasa a segundo plano).
  li("precios.html", "Web bonita + presencia ·&nbsp;540&nbsp;€", "ft_s2"),
  li("seo-posicionamiento-google.html", "SEO y presencia en Google ·&nbsp;120&nbsp;€", "ft_s6"),
  li("precios.html", "Tienda online ·&nbsp;880&nbsp;€", "ft_s3"),
  li("precios.html", "Landing ·&nbsp;420&nbsp;€", "ft_s1"),
  li("reservas-online-sin-comisiones.html", "Reservas online sin comisiones", "ft_s5"),
].join("\n"))}
${grupo("foot_guias", "Guías", GUIAS.map(([h, t]) => li(h, t)).join("\n"))}
${grupo("foot_zonas", "Dónde trabajo", [
  ...COMARCAS.map(([s, n]) => li(`zonas/${s}.html`, n)),
  li("diseno-web-negocios-espana.html", "Toda España", "ft_esp"),
  li("zonas.html", "Los 88 municipios →", "ft_todas"),
].join("\n"), "footer__zonas")}
</div>
<div class="footer__bottom">
<p>© 2026 OI Studio · <a href="${p}legal.html" data-t="foot_legal">Aviso legal y privacidad</a></p>
<p data-t="foot_made">Diseñado y desarrollado en Tolosa</p>
</div>`;
}

/* ------------------------------------------------------------ aplicar */
const WEB = path.resolve("web");

function paginas() {
  const out = [];
  const recorrer = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, e.name);
      const rel = path.relative(WEB, abs).split(path.sep).join("/");
      if (e.isDirectory()) {
        if (/^(demos|webs-clientes|eu|catalogo-servicios|assets)$/.test(rel)) continue;
        recorrer(abs);
      } else if (e.name.endsWith(".html")) out.push(rel);
    }
  };
  recorrer(WEB);
  return out;
}

/** Fin del <div> que empieza en ini, contando los <div> anidados. */
function finDeDiv(html, ini) {
  const re = /<div\b|<\/div>/g;
  re.lastIndex = ini;
  let nivel = 0, m;
  while ((m = re.exec(html))) {
    nivel += m[0] === "</div>" ? -1 : 1;
    if (nivel === 0) return m.index + m[0].length;
  }
  throw new Error("div sin cerrar");
}

export function aplicarPie(html, rel) {
  const f = html.indexOf('<footer class="footer">');
  if (f < 0) return html;
  const ini = html.indexOf('<div class="footer__grid">', f);
  const bajo = html.indexOf('<div class="footer__bottom">', f);
  if (ini < 0 || bajo < 0) throw new Error(`${rel}: no encuentro el pie`);
  const fin = finDeDiv(html, bajo);
  const logo = html.slice(ini, bajo).match(/<a href="([^"]*)index\.html" class="footer__logo"/);
  const p = logo ? logo[1] : (rel.includes("/") ? "../" : "");
  const eol = html.includes("\r\n") ? "\r\n" : "\n";
  return html.slice(0, ini) + pieHtml(p).replace(/\r?\n/g, eol) + html.slice(fin);
}

if (process.argv[1] && process.argv[1].endsWith("pie.mjs")) {
  const SOLO_COMPROBAR = process.argv.includes("--check");
  let cambiadas = 0, total = 0;
  for (const rel of paginas()) {
    const abs = path.join(WEB, rel);
    const html = fs.readFileSync(abs, "utf8");
    if (!html.includes('<footer class="footer">')) continue;
    total++;
    const nuevo = aplicarPie(html, rel);
    if (nuevo !== html) { cambiadas++; if (!SOLO_COMPROBAR) fs.writeFileSync(abs, nuevo); }
  }
  console.log(`${SOLO_COMPROBAR ? "comprobadas" : "pie aplicado en"} ${total} páginas · ${cambiadas} ${SOLO_COMPROBAR ? "cambiarían" : "cambiadas"}`);
}
