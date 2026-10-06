/**
 * Pie de página con mapa de enlaces (octubre 2026).
 *
 * El pie antiguo tenía tres columnas y 8 enlaces. Este lleva a todo lo que
 * importa —servicios, guías, zonas— desde cada página del sitio: es la forma
 * más barata de que Google y las personas lleguen a las páginas profundas.
 *
 * pieHtml(prefijo): "" para páginas de la raíz, "../" para las de /zonas/.
 * Devuelve solo el bloque <div class="footer__grid">…</div>.
 */
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

export function pieHtml(p = "") {
  const li = (href, txt, key) => `<li><a href="${p}${href}"${key ? ` data-t="${key}"` : ""}>${txt}</a></li>`;
  return `<div class="footer__grid">
<div class="footer__col footer__col--brand">
<a href="${p}index.html" class="footer__logo"><img src="${p}assets/logo-nav-black.png" alt="OI Studio" class="footer__logo-img" width="320" height="86"/></a>
<p class="footer__desc" data-t="foot_desc" style="margin-top:20px;">Webs rápidas, modernas y efectivas para negocios locales que quieren destacar en internet.</p>
</div>
<div class="footer__col">
<p class="foot-h" data-t="foot_secciones">Secciones</p>
<ul>
${li("sobre-mi.html", "Sobre mí", "nav_sobre")}
${li("trabajos.html", "Portfolio", "foot_portfolio")}
${li("precios.html", "Precios", "nav_precios")}
${li("ayudas-subvenciones-pagina-web-gipuzkoa.html", "Ayudas", "nav_ayudas")}
${li("articulos.html", "Artículos", "nav_articulos")}
${li("contacto.html", "Contacto", "nav_contacto")}
</ul>
<p class="foot-h" data-t="foot_servicios">Servicios</p>
<ul>
${li("precios.html", "Landing · 199 €", "ft_s1")}
${li("precios.html", "Web de negocio · 299 €", "ft_s2")}
${li("precios.html", "Tienda online · 790 €", "ft_s3")}
${li("chatbot-reservas.html", "Chatbot de reservas", "ft_s4")}
</ul>
</div>
<div class="footer__col">
<p class="foot-h" data-t="foot_guias">Guías</p>
<ul>
${GUIAS.map(([h, t]) => li(h, t)).join("\n")}
</ul>
</div>
<div class="footer__col">
<p class="foot-h" data-t="foot_zonas">Dónde trabajo</p>
<ul class="footer__zonas">
${COMARCAS.map(([s, n]) => li(`zonas/${s}.html`, n)).join("\n")}
${li("diseno-web-negocios-espana.html", "Toda España", "ft_esp")}
${li("zonas.html", "Los 88 municipios →", "ft_todas")}
</ul>
</div>
<div class="footer__col">
<p class="foot-h" data-t="nav_contacto">Contacto</p>
<ul>
<li><a class="js-mail" data-u="contactoiwebstudio" data-d="gmail.com"></a></li>
<li><a href="https://wa.me/34680956755">+34 680 95 67 55</a></li>
<li><a href="https://instagram.com/oi.webstudio" target="_blank" rel="noopener">Instagram · @oi.webstudio</a></li>
<li>Tolosa, País Vasco</li>
</ul>
</div>
</div>`;
}
