/**
 * Genera la versión en euskera del sitio a partir de la española.
 *
 * Hasta ahora el euskera se aplicaba con JavaScript sobre la misma dirección,
 * así que Google nunca lo veía: para el buscador la web solo existía en
 * castellano. Este script escribe páginas de verdad en web/eu/, con su propia
 * URL, su lang="eu" y sus señales hreflang.
 *
 * NO se traduce a mano: se lee el mismo diccionario EU de assets/i18n.js que ya
 * usa el navegador, así que hay una sola fuente. Se ejecuta en cada despliegue,
 * de modo que las dos versiones no pueden desincronizarse.
 *
 * Uso:  node scripts/generar-euskera.mjs [--check]
 *       --check no escribe nada; solo avisa si algo quedaría sin traducir.
 */
import fs from "node:fs";
import path from "node:path";

const RAIZ = path.resolve("web");
const SALIDA = path.join(RAIZ, "eu");
const SOLO_COMPROBAR = process.argv.includes("--check");

/* Las páginas con cobertura de traducción alta. Las de zona y los artículos
   quedan fuera a propósito: apenas tienen texto marcado como traducible y
   saldrían medio en castellano, que es peor que no tenerlas. */
const PAGINAS = ["index.html", "precios.html", "contacto.html", "trabajos.html", "sobre-mi.html"];

/* Los <title> y las descripciones no pueden llevar data-t, así que van aquí.
   No son traducción literal: "diseño web" y "webgune diseinua" no se buscan
   igual. REVISAR con un hablante antes de dar por buenos. */
const META = {
  "index.html": {
    title: "Web diseinua Tolosan, tokiko negozioentzat | OI Studio",
    desc: "Neurrira egindako webguneak Gipuzkoako negozioentzat. Prezio itxia 199€-tik, proposamena 48 ordutan. Tolosako estudioa.",
  },
  "precios.html": {
    title: "Webgune baten prezioa: itxia eta idatziz | OI Studio",
    desc: "Landing 199€ eta Negozio Weba 299€, ordainketa bakarrean eta prezio itxiarekin. Ezkutuko kuotarik gabe eta iraunkortasunik gabe.",
  },
  "contacto.html": {
    title: "Kontaktua: hitz egin dezagun zure webaz | OI Studio",
    desc: "Kontatu zure negozioa zertan datzan eta proposamen zintzoa jasoko duzu 48 ordu baino gutxiagotan. Konpromisorik gabe.",
  },
  "trabajos.html": {
    title: "Lanak: zortzi webgune zuzenean | OI Studio",
    desc: "Zortzi webgune oso eta nabigagarri, sektore bakoitzeko bat: okindegia, albaitaria, kafetegia, ile-apaindegia, gimnasioa eta gehiago.",
  },
  "sobre-mi.html": {
    title: "Estudioari buruz: nola lan egiten dudan | OI Studio",
    desc: "Pertsona bakarreko estudioa Tolosan. Ingeniari-logika eta diseinatzaile-begia, tokiko negozioentzako webguneak egiteko.",
  },
};

const BASE = "https://oiwebstudio.com";

/* ---------------------------------------------------------------- diccionario */

function leerDiccionario() {
  const src = fs.readFileSync(path.join(RAIZ, "assets/i18n.js"), "utf8");
  const ini = src.indexOf("const EU = {");
  if (ini === -1) throw new Error("No encuentro el objeto EU en assets/i18n.js");
  // Buscar la llave de cierre que corresponde a la de apertura.
  const desde = src.indexOf("{", ini);
  let nivel = 0, fin = -1, enCadena = null;
  for (let i = desde; i < src.length; i++) {
    const c = src[i];
    if (enCadena) {
      if (c === "\\") i++;
      else if (c === enCadena) enCadena = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") enCadena = c;
    else if (c === "{") nivel++;
    else if (c === "}") { nivel--; if (nivel === 0) { fin = i; break; } }
  }
  if (fin === -1) throw new Error("El objeto EU no cierra bien");
  return new Function("return " + src.slice(desde, fin + 1))();
}

/* ------------------------------------------------------------------ utilidades */

/** Encuentra el cierre del elemento que empieza en `desdeFin`, contando anidados. */
function finDeElemento(html, tag, desdeFin) {
  const abre = new RegExp(`<${tag}\\b`, "gi");
  const cierra = new RegExp(`</${tag}\\s*>`, "gi");
  let nivel = 1, i = desdeFin;
  while (i < html.length) {
    abre.lastIndex = i; cierra.lastIndex = i;
    const a = abre.exec(html);
    const c = cierra.exec(html);
    if (!c) return -1;
    if (a && a.index < c.index) { nivel++; i = a.index + a[0].length; continue; }
    nivel--;
    if (nivel === 0) return { ini: c.index, fin: c.index + c[0].length };
    i = c.index + c[0].length;
  }
  return -1;
}

/** Sustituye el contenido de cada [data-t] por su traducción. */
function traducirElementos(html, dic, faltan) {
  const re = /<([a-z0-9]+)\b([^>]*\bdata-t="([^"]+)"[^>]*)>/gi;
  let out = "", ultimo = 0, m;
  while ((m = re.exec(html))) {
    const [completo, tag, , clave] = m;
    const inicioContenido = m.index + completo.length;
    const cierre = finDeElemento(html, tag, inicioContenido);
    if (cierre === -1) continue;
    const valor = dic[clave];
    if (valor == null) { faltan.add(clave); continue; }
    out += html.slice(ultimo, inicioContenido) + valor;
    ultimo = cierre.ini;
    re.lastIndex = cierre.ini;
  }
  return out + html.slice(ultimo);
}

/** Sustituye los placeholder de los [data-tp]. */
function traducirPlaceholders(html, dic, faltan) {
  return html.replace(/<([a-z0-9]+)\b([^>]*\bdata-tp="([^"]+)"[^>]*)>/gi, (todo, tag, attrs, clave) => {
    const valor = dic[clave];
    if (valor == null) { faltan.add(clave); return todo; }
    if (!/\bplaceholder="/.test(attrs)) return todo;
    const nuevos = attrs.replace(/\bplaceholder="[^"]*"/, `placeholder="${valor.replace(/"/g, "&quot;")}"`);
    return `<${tag}${nuevos}>`;
  });
}

/**
 * Reescribe las rutas relativas.
 *
 * Las páginas en euskera cuelgan de /eu/, un nivel más abajo, así que cualquier
 * ruta relativa se rompería. Se pasan todas a absolutas: los recursos apuntan a
 * la raíz y los enlaces internos van a /eu/ si esa página está traducida, o a la
 * versión en castellano si no lo está.
 */
function absolutizarRutas(html) {
  return html.replace(/\b(href|src|srcset)="([^"]+)"/gi, (todo, attr, valor) => {
    if (/^(https?:|mailto:|tel:|data:|#|\/)/i.test(valor)) return todo;
    if (attr === "srcset") {
      const partes = valor.split(",").map((p) => {
        const [u, ...resto] = p.trim().split(/\s+/);
        return ["/" + u.replace(/^\.\//, ""), ...resto].join(" ");
      });
      return `${attr}="${partes.join(", ")}"`;
    }
    const limpio = valor.replace(/^\.\//, "");
    const [ruta, cola = ""] = limpio.split(/(?=[?#])/);
    const destino = PAGINAS.includes(ruta) ? `/eu/${ruta}` : `/${ruta}`;
    return `${attr}="${destino}${cola}"`;
  });
}

/** Cabecera: idioma, título, descripción, canónica y hreflang. */
function ajustarCabecera(html, pagina) {
  const meta = META[pagina];
  const urlEu = `${BASE}/eu/${pagina}`;
  const urlEs = `${BASE}/${pagina === "index.html" ? "" : pagina}`;

  html = html.replace(/<html\s+lang="[^"]*"/i, '<html lang="eu"');
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${meta.title}</title>`);
  html = html.replace(/(<meta\s+name="description"\s+content=")[^"]*(")/i, `$1${meta.desc}$2`);
  html = html.replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/i, `$1${meta.title}$2`);
  html = html.replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/i, `$1${meta.desc}$2`);
  html = html.replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/i, `$1${urlEu}$2`);
  html = html.replace(/(<meta\s+property="og:locale"\s+content=")[^"]*(")/i, `$1eu_ES$2`);
  html = html.replace(/<meta\s+property="og:locale:alternate"[^>]*>\s*/i, "");

  // La página de origen ya trae sus propias alternates: se quitan antes de
  // poner las de esta versión, o quedarían por duplicado y Google se lía.
  html = html.replace(/[ \t]*<link\s+rel="alternate"\s+hreflang="[^"]*"[^>]*>\s*\n?/gi, "");

  // Canónica propia + el par de idiomas. x-default manda al castellano.
  const señales =
    `<link rel="canonical" href="${urlEu}"/>\n` +
    `<link rel="alternate" hreflang="es" href="${urlEs}"/>\n` +
    `<link rel="alternate" hreflang="eu" href="${urlEu}"/>\n` +
    `<link rel="alternate" hreflang="x-default" href="${urlEs}"/>`;

  if (/<link\s+rel="canonical"[^>]*>/i.test(html)) {
    html = html.replace(/<link\s+rel="canonical"[^>]*>/i, señales);
  } else {
    html = html.replace(/<\/head>/i, señales + "\n</head>");
  }
  return html;
}

/**
 * Da la vuelta al selector de idioma.
 *
 * La página de origen ya viene con ES marcado como activo y EU como enlace
 * (lo deja scripts/enlazar-euskera.mjs). Aquí es al revés: EU es la página en
 * la que estás y ES es a donde puedes ir.
 */
function enlazarSelectorIdioma(html, pagina) {
  const es = `/${pagina === "index.html" ? "" : pagina}`;
  return html
    // ES: de activo a enlace de salida.
    .replace(
      /<span class="lang-link is-active"[^>]*>ES<\/span>/gi,
      `<a class="lang-link" href="${es}" hreflang="es" lang="es" aria-label="Ver en castellano">ES</a>`
    )
    // EU: de enlace a activo.
    .replace(
      /<a class="lang-link"[^>]*>EU<\/a>/gi,
      `<span class="lang-link is-active" aria-current="true">EU</span>`
    )
    // Por si alguna página aún tuviera los botones originales.
    .replace(
      /<button\s+type="button"\s+data-lang="es"\s*>ES<\/button>/gi,
      `<a class="lang-link" href="${es}" hreflang="es" lang="es" aria-label="Ver en castellano">ES</a>`
    )
    .replace(
      /<button\s+type="button"\s+data-lang="eu"\s*>EU<\/button>/gi,
      `<span class="lang-link is-active" aria-current="true">EU</span>`
    );
}

/* ------------------------------------------------------------------------ main */

const dic = leerDiccionario();
const faltan = new Set();
let escritas = 0;

if (!SOLO_COMPROBAR) fs.mkdirSync(SALIDA, { recursive: true });

for (const pagina of PAGINAS) {
  const origen = path.join(RAIZ, pagina);
  if (!fs.existsSync(origen)) throw new Error(`No existe ${pagina}`);
  if (!META[pagina]) throw new Error(`Falta el título en euskera de ${pagina}`);

  let html = fs.readFileSync(origen, "utf8");
  html = traducirElementos(html, dic, faltan);
  html = traducirPlaceholders(html, dic, faltan);

  /* Fuera i18n.js: aquí sobra y además estorba. La página ya viene traducida en
     el HTML, y ese script reescribía document.documentElement.lang a "es" al
     cargar, deshaciendo justo la señal que le dice a Google en qué idioma está
     esta página. El idioma lo decide la URL, no el navegador. */
  html = html.replace(/[ \t]*<script[^>]*src="[^"]*i18n\.js[^"]*"[^>]*><\/script>\s*\n?/gi, "");
  html = absolutizarRutas(html);
  html = ajustarCabecera(html, pagina);
  html = enlazarSelectorIdioma(html, pagina);

  // Aviso para quien abra el fichero generado.
  html = html.replace(
    /<head>/i,
    "<head>\n<!-- GENERADO por scripts/generar-euskera.mjs — no editar a mano.\n     Se reescribe en cada despliegue desde la versión en castellano. -->"
  );

  if (!SOLO_COMPROBAR) fs.writeFileSync(path.join(SALIDA, pagina), html);
  escritas++;
}

if (faltan.size) {
  console.error(`\n  ¡OJO! ${faltan.size} claves sin traducción en euskera:`);
  console.error("    " + [...faltan].join(", "));
  console.error("  Esas partes se quedarían en castellano. Añádelas a assets/i18n.js.\n");
  process.exit(1);
}

console.log(SOLO_COMPROBAR ? `  comprobadas ${escritas} páginas, sin claves sueltas ✓` : `  páginas en euskera generadas: ${escritas} → web/eu/`);
