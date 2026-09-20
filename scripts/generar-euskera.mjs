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
import { COMUNES, ZONAS_EU, NEUTRAS } from "./euskera-zonas.mjs";

const RAIZ = path.resolve("web");
const SALIDA = path.join(RAIZ, "eu");
const SOLO_COMPROBAR = process.argv.includes("--check");

/* Las páginas con cobertura de traducción alta. Los artículos quedan fuera a
   propósito: apenas tienen texto marcado como traducible y saldrían medio en
   castellano, que es peor que no tenerlas. Las de zona no usan data-t: las que
   tienen versión en euskera se traducen con los pares de euskera-zonas.mjs. */
const PAGINAS = ["index.html", "precios.html", "contacto.html", "trabajos.html", "sobre-mi.html"];
const ZONAS = Object.keys(ZONAS_EU);

/* Todo lo que existe en /eu/: los enlaces internos que apunten aquí se
   quedan en euskera; el resto va a la versión en castellano. */
const TRADUCIDAS = new Set([...PAGINAS, ...ZONAS]);

/* Los <title> y las descripciones no pueden llevar data-t, así que van aquí.
   No son traducción literal: "diseño web" y "web diseinua" no se buscan igual.

   Están escritos con la terminología que ya usa el propio sitio en euskera,
   no inventada: "webgune" (no "web"), "Prezio itxia idatziz", "ordainketa
   bakarra", "Iraunkortasunik gabe", "Niri buruz". Si aquí se dijera de otra
   forma, el título prometería una cosa y la página diría otra.

   Aun así, conviene que lo lea un euskaldun antes de darlo por definitivo: son
   la línea que decide si alguien hace clic. */
const META = {
  "index.html": {
    title: "Web diseinua Tolosan: webguneak negozioentzat | OI Studio",
    desc: "Neurrira egindako webguneak Gipuzkoako negozioentzat. Prezio itxia 199€-tik, proposamena 48 ordutan. Tolosako estudioa.",
  },
  "precios.html": {
    title: "Webgune baten prezioa: itxia eta idatzita | OI Studio",
    desc: "Landing 199€ eta Negozio Weba 299€, ordainketa bakarrean eta prezio itxiarekin. Ezkutuko kuotarik eta iraunkortasunik gabe.",
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
    title: "Niri buruz: nola lan egiten dudan | OI Studio",
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
function absolutizarRutas(html, pagina) {
  // Se resuelve contra la URL de la página de origen: así "../assets/x.png"
  // desde zonas/ y "assets/x.png" desde la raíz acaban en el mismo sitio.
  const base = `${BASE}/${pagina}`;
  const resolver = (u) => {
    const url = new URL(u, base);
    const ruta = decodeURI(url.pathname).replace(/^\//, "");
    const destino = TRADUCIDAS.has(ruta) ? `/eu/${ruta}` : `/${ruta}`;
    return destino + url.search + url.hash;
  };
  return html.replace(/\b(href|src|srcset)="([^"]+)"/gi, (todo, attr, valor) => {
    if (/^(https?:|mailto:|tel:|data:|#|\/)/i.test(valor)) return todo;
    if (attr === "srcset") {
      const partes = valor.split(",").map((p) => {
        const [u, ...resto] = p.trim().split(/\s+/);
        return [resolver(u), ...resto].join(" ");
      });
      return `${attr}="${partes.join(", ")}"`;
    }
    return `${attr}="${resolver(valor)}"`;
  });
}

/* ------------------------------------------------------------ zonas (pares) */

const escaparRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Sustituye cada fragmento en castellano por su traducción. Solo cuenta si
 * el fragmento ocupa un texto o un atributo entero (va entre > y <, o entre
 * comillas): así "Servicios" no se come el principio de "Servicios
 * profesionales" ni una palabra suelta dentro de otra frase.
 */
function traducirZona(html, pagina, errores) {
  const propios = ZONAS_EU[pagina].pares;
  // De más largo a más corto, para que las frases completas vayan antes que
  // las palabras sueltas que contienen.
  const pares = [...propios, ...COMUNES].sort((a, b) => b[0].length - a[0].length);
  const cab = html.indexOf("</head>");
  let head = html.slice(0, cab), body = html.slice(cab);

  const aplicar = (trozo, es, eu, enJson) => {
    const re = new RegExp(`(?<=[>"])${escaparRe(es)}(?=[<"])`, "g");
    let n = 0;
    // Dentro del JSON-LD unas comillas sin escapar romperían el bloque.
    const out = trozo.replace(re, () => { n++; return enJson ? eu.replace(/"/g, '\\"') : eu; });
    return [out, n];
  };

  for (const [es, eu] of pares) {
    // En la cabecera solo se toca el JSON-LD (el título y las meta van aparte).
    let n1 = 0;
    head = head.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g, (t, a, json, c) => {
      const [out, n] = aplicar(json, es, eu, true); n1 += n; return a + out + c;
    });
    const [nuevoBody, n2] = aplicar(body, es, eu, false);
    body = nuevoBody;
    // Los comunes pueden no salir en todas las zonas; los propios, sí.
    if (!(n1 + n2) && propios.some((p) => p[0] === es)) {
      errores.push(`${pagina}: ya no aparece «${es.slice(0, 70)}…» — ¿se editó en castellano? Actualiza euskera-zonas.mjs.`);
    }
  }

  // El JSON-LD apunta a la URL en castellano; aquí tiene que ser la propia.
  head = head.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g, (t, a, json, c) =>
    a + json.split(`${BASE}/${pagina}`).join(`${BASE}/eu/${pagina}`)
            .split(`"item":"${BASE}/"`).join(`"item":"${BASE}/eu/index.html"`) + c);

  return head + body;
}

/**
 * Red de seguridad: busca texto que haya quedado en castellano. Cada texto
 * visible, alt, aria-label y cadena del JSON-LD tiene que estar dentro de
 * alguna traducción conocida o ser solo nombres propios y cifras.
 */
function restosDeCastellano(html, dic, pagina) {
  const conocidos = [
    ...COMUNES.map((p) => p[1]),
    ...ZONAS_EU[pagina].pares.map((p) => p[1]),
    ...Object.values(dic).filter((v) => typeof v === "string"),
  ].map((t) => t.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));
  const neutras = [...NEUTRAS].sort((a, b) => b.length - a.length);
  const esNeutro = (t) => {
    let r = t.replace(/\S+@\S+\.\w+/g, " ");
    for (const n of neutras) r = r.split(n).join(" ");
    return !/\p{L}{2,}/u.test(r);
  };
  const ok = (t) => {
    t = t.replace(/&rarr;/g, "→").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
    if (!t || esNeutro(t)) return true;
    return conocidos.some((c) => c.includes(t));
  };

  const restos = new Set();
  const cab = html.indexOf("</head>");
  const body = html.slice(cab).replace(/<(script|style|svg)\b[\s\S]*?<\/\1>/gi, "");
  for (const m of body.matchAll(/>([^<]+)</g)) if (!ok(m[1])) restos.add(m[1].trim());
  for (const m of body.matchAll(/\b(?:alt|aria-label|title)="([^"]*)"/g)) if (!ok(m[1])) restos.add(m[1]);
  for (const m of html.slice(0, cab).matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const recorrer = (o) => {
      if (typeof o === "string") { if (!/^(https?:|\+|\S+@\S+$)/.test(o) && !ok(o)) restos.add(o); }
      else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) if (!k.startsWith("@")) recorrer(v);
    };
    recorrer(JSON.parse(m[1]));
  }
  return [...restos];
}

/** Cabecera: idioma, título, descripción, canónica y hreflang. */
function ajustarCabecera(html, pagina) {
  const meta = META[pagina] || ZONAS_EU[pagina];
  // Las palabras clave en castellano no pintan nada en la versión en euskera.
  html = html.replace(/[ \t]*<meta\s+name="keywords"[^>]*>\s*\n?/i, "");
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
const errores = [];
let escritas = 0;

if (!SOLO_COMPROBAR) fs.mkdirSync(path.join(SALIDA, "zonas"), { recursive: true });

for (const pagina of [...PAGINAS, ...ZONAS]) {
  const origen = path.join(RAIZ, pagina);
  const esZona = ZONAS.includes(pagina);
  if (!fs.existsSync(origen)) throw new Error(`No existe ${pagina}`);
  if (!META[pagina] && !esZona) throw new Error(`Falta el título en euskera de ${pagina}`);

  let html = fs.readFileSync(origen, "utf8");
  html = traducirElementos(html, dic, faltan);
  html = traducirPlaceholders(html, dic, faltan);
  if (esZona) html = traducirZona(html, pagina, errores);

  /* Fuera i18n.js: aquí sobra y además estorba. La página ya viene traducida en
     el HTML, y ese script reescribía document.documentElement.lang a "es" al
     cargar, deshaciendo justo la señal que le dice a Google en qué idioma está
     esta página. El idioma lo decide la URL, no el navegador. */
  html = html.replace(/[ \t]*<script[^>]*src="[^"]*i18n\.js[^"]*"[^>]*><\/script>\s*\n?/gi, "");
  html = absolutizarRutas(html, pagina);
  html = ajustarCabecera(html, pagina);
  html = enlazarSelectorIdioma(html, pagina);

  // Sobre la página ya terminada: lo que se vaya a publicar es lo que se mira.
  if (esZona) {
    for (const r of restosDeCastellano(html, dic, pagina)) errores.push(`${pagina}: queda sin traducir «${r.slice(0, 80)}»`);
  }

  // Aviso para quien abra el fichero generado.
  html = html.replace(
    /<head>/i,
    "<head>\n<!-- GENERADO por scripts/generar-euskera.mjs — no editar a mano.\n     Se reescribe en cada despliegue desde la versión en castellano. -->"
  );

  if (!SOLO_COMPROBAR) fs.writeFileSync(path.join(SALIDA, pagina), html);
  escritas++;
}

if (errores.length) {
  console.error(`\n  ¡OJO! Las páginas de zona en euskera no están completas:`);
  for (const e of errores) console.error("    " + e);
  console.error("  Revisa scripts/euskera-zonas.mjs.\n");
  process.exit(1);
}

if (faltan.size) {
  console.error(`\n  ¡OJO! ${faltan.size} claves sin traducción en euskera:`);
  console.error("    " + [...faltan].join(", "));
  console.error("  Esas partes se quedarían en castellano. Añádelas a assets/i18n.js.\n");
  process.exit(1);
}

console.log(SOLO_COMPROBAR ? `  comprobadas ${escritas} páginas, sin claves sueltas ✓` : `  páginas en euskera generadas: ${escritas} → web/eu/`);
