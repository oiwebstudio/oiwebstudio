/**
 * Menú de la cabecera (octubre 2026): TRABAJOS · PRECIOS · RESERVAS · SOBRE MÍ ·
 * CONTACTO + «Más» (Ayudas, Zonas, Artículos, Chatbot), y el menú del móvil a
 * pantalla completa con tres accesos directos (Llamar, WhatsApp, Pedir presupuesto).
 *
 * El menú está copiado en todas las páginas (raíz, zonas/ y guías). Este script
 * lo reescribe en todas a la vez y marca la página actual. Es idempotente: se
 * puede volver a lanzar sin romper nada. Los generadores que copian el menú de
 * una página existente (gen-zonas-ampliado.mjs ← zonas/anoeta.html,
 * gen-articulos-nacionales.mjs ← cuanto-tarda-hacer-pagina-web.html) heredan el
 * nuevo sin tocarlos.
 *
 * Uso (desde la raíz):  node herramientas/sitio/menu.mjs [--check]
 */
import fs from "node:fs";
import path from "node:path";

const WEB = path.resolve("web");
const SOLO_COMPROBAR = process.argv.includes("--check");

const PRINCIPAL = [
  ["trabajos", "trabajos.html", "nav_trabajos", "Trabajos"],
  ["precios", "precios.html", "nav_precios", "Precios"],
  ["reservas", "reservas-online-sin-comisiones.html", "nav_reservas", "Reservas"],
  ["sobre", "sobre-mi.html", "nav_sobre", "Sobre mí"],
  ["contacto", "contacto.html", "nav_contacto", "Contacto"],
];
const MAS = [
  ["ayudas", "ayudas-subvenciones-pagina-web-gipuzkoa.html", "nav_ayudas", "Ayudas"],
  ["zonas", "zonas.html", "nav_zonas", "Zonas"],
  ["articulos", "articulos.html", "nav_articulos", "Artículos"],
  ["chatbot", "chatbot-reservas.html", "nav_chatbot", "Chatbot"],
];

/* Qué entrada del menú corresponde a cada página. Las guías se sacan del
   índice de artículos, así una guía nueva queda marcada sin tocar esto. */
function seccionDe(rel, guias) {
  if (rel.startsWith("zonas/") || rel === "zonas.html" || /^diseno-web-(negocios-espana|bizkaia|navarra|alava-araba)\.html$/.test(rel)) return "zonas";
  const fijo = {
    "trabajos.html": "trabajos", "caso-errotatxo.html": "trabajos", "caso-a-berri.html": "trabajos",
    "precios.html": "precios", "reservas-online-sin-comisiones.html": "reservas", "sobre-mi.html": "sobre",
    "contacto.html": "contacto", "ayudas-subvenciones-pagina-web-gipuzkoa.html": "ayudas",
    "articulos.html": "articulos", "chatbot-reservas.html": "chatbot",
  }[rel];
  if (fijo) return fijo;
  if (guias.has(rel)) return "articulos";
  return null;
}

const ICONO_TEL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>';
const ICONO_WA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.5 8.5 0 0 1-4-1L3 20l1-5.5A8.5 8.5 0 1 1 21 11.5z"/></svg>';
const ICONO_FLECHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

export function menuEscritorio(p, actual) {
  const a = ([id, href, k, txt]) => `<li><a href="${p}${href}"${id === actual ? ' class="is-active" aria-current="page"' : ""} data-t="${k}">${txt}</a></li>`;
  const enMas = MAS.some(([id]) => id === actual);
  return `<ul class="nav__links">
${PRINCIPAL.map(a).join("\n")}
<li class="nav__mas"><button type="button" class="nav__mas-btn${enMas ? " is-active" : ""}" aria-expanded="false" aria-controls="nav-mas"><span data-t="nav_mas">Más</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>
<ul class="nav__drop" id="nav-mas">
${MAS.map(a).join("\n")}
</ul></li>
</ul>`;
}

export function menuMovil(p, actual) {
  const a = ([id, href, k, txt]) => `<li><a href="${p}${href}"${id === actual ? ' class="is-active" aria-current="page"' : ""} data-t="${k}">${txt}</a></li>`;
  return `<div class="mobile-menu" id="menu-movil">
<ul class="mobile-menu__main">
${PRINCIPAL.map(a).join("\n")}
</ul>
<ul class="mobile-menu__sec">
${MAS.map(a).join("\n")}
</ul>
<div class="mobile-menu__atajos">
<a href="tel:+34680956755">${ICONO_TEL}<span data-t="fm_llamar">Llamar</span></a>
<a href="https://wa.me/34680956755" target="_blank" rel="noopener" class="is-wa">${ICONO_WA}<span>WhatsApp</span></a>
<a href="${p}contacto.html" class="is-main">${ICONO_FLECHA}<span data-t="mm_presu">Pedir presupuesto</span></a>
</div>
</div>`;
}

const TOGGLE = `<button class="nav__toggle" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="menu-movil">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path class="nav__toggle-a" d="M4 7h16M4 12h16M4 17h16"/><path class="nav__toggle-b" d="M6 6l12 12M18 6L6 18"/></svg>
</button>`;

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
    nivel += m[0] === '</div>' ? -1 : 1;
    if (nivel === 0) return m.index + m[0].length;
  }
  throw new Error('div sin cerrar');
}

export function aplicarMenu(html, rel, guias) {
  if (!html.includes('class="nav__links"')) return html;
  const p = rel.includes("/") ? "../" : "";
  const actual = seccionDe(rel, guias);
  const ul = html.indexOf('<ul class="nav__links">');
  const finUl = html.indexOf('<div class="nav__right">', ul);
  const mm = html.indexOf('<div class="mobile-menu"');
  if (ul < 0 || finUl < 0 || mm < 0) throw new Error(`${rel}: no encuentro el menú`);
  const finMovil = finDeDiv(html, mm);
  // Respeta el final de línea del fichero (en Windows la copia de trabajo va en CRLF).
  const eol = html.includes("\r\n") ? "\r\n" : "\n";
  const fl = (s) => s.replace(/\r?\n/g, eol);
  let out = html.slice(0, ul) + fl(menuEscritorio(p, actual) + "\n") + html.slice(finUl, mm) + fl(menuMovil(p, actual)) + html.slice(finMovil);
  out = out.replace(/<button class="nav__toggle"[^>]*>[\s\S]*?<\/button>/, fl(TOGGLE));
  return out;
}

if (process.argv[1] && process.argv[1].endsWith("menu.mjs")) {
  const indice = fs.readFileSync(path.join(WEB, "articulos.html"), "utf8");
  const guias = new Set([...indice.matchAll(/href="([a-z0-9-]+\.html)"/g)].map((m) => m[1])
    .filter((h) => !/^(index|precios|trabajos|sobre-mi|contacto|zonas|articulos|legal|chatbot-reservas|reservas-online-sin-comisiones|ayudas-subvenciones-pagina-web-gipuzkoa)\.html$/.test(h)));
  let cambiadas = 0, total = 0;
  for (const rel of paginas()) {
    const abs = path.join(WEB, rel);
    const html = fs.readFileSync(abs, "utf8");
    if (!html.includes('class="nav__links"')) continue;
    total++;
    const nuevo = aplicarMenu(html, rel, guias);
    if (nuevo !== html) { cambiadas++; if (!SOLO_COMPROBAR) fs.writeFileSync(abs, nuevo); }
  }
  console.log(`${SOLO_COMPROBAR ? "comprobadas" : "menú aplicado en"} ${total} páginas · ${cambiadas} ${SOLO_COMPROBAR ? "cambiarían" : "cambiadas"}`);
}
