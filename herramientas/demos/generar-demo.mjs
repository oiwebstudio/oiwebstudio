/**
 * Genera una demo personalizada a partir de un negocio real de la base de
 * captación (captacion/prisma/captacion.db).
 *
 * Antes esto era trabajo a mano: copiar la plantilla del sector, abrir el
 * bloque DATOS y teclear nombre, teléfono, dirección, horario y valoración.
 * Noventa minutos por demo, y una errata al copiar un teléfono te deja en
 * ridículo delante del cliente. Ahora son segundos y los datos salen de la
 * misma base con la que se hace la captación.
 *
 *   node herramientas/demos/generar-demo.mjs --id 412
 *   node herramientas/demos/generar-demo.mjs --nombre "Route 33"
 *   node herramientas/demos/generar-demo.mjs --categoria peluqueria --limite 5
 *   node herramientas/demos/generar-demo.mjs --id 412 --plantilla belleza-peluqueria
 *
 * Sale en web/demos/clientes/<slug>/, listo para publicar y mandar el enlace.
 * Lo que el negocio no tenga en la base se queda con el texto de ejemplo de la
 * plantilla y se avisa por consola: es mejor un dato de muestra que sabes que
 * está ahí, que un hueco vacío que descubres con el cliente delante.
 */
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const RAIZ = "web/demos/_plantillas";
const SALIDA = "web/demos/clientes";

/* Qué plantilla le toca a cada categoría del buscador.
   Sale de docs/COBERTURA-SECTORES.md. */
const PLANTILLA = {
  peluqueria: "belleza-peluqueria", barberia: "belleza-peluqueria",
  estetica: "belleza-peluqueria", unas: "belleza-peluqueria", tatuador: "belleza-peluqueria",
  panaderia: "alimentacion-obrador", carniceria: "alimentacion-obrador",
  fruteria: "alimentacion-obrador", pescaderia: "alimentacion-obrador",
  herboristeria: "alimentacion-obrador",
  ropa: "comercio-tienda", zapateria: "comercio-tienda", joyeria: "comercio-tienda",
  optica: "comercio-tienda", libreria: "comercio-tienda", ferreteria: "comercio-tienda",
  papeleria: "comercio-tienda", floristeria: "comercio-tienda",
  cafeteria: "cafeteria-bar", bar: "cafeteria-bar", pub: "cafeteria-bar",
  restaurante: "hosteleria-asador", hotel: "hosteleria-asador",
  taller: "automocion-taller", autoescuela: "automocion-taller",
  dentista: "salud-odontologia", fisioterapia: "salud-odontologia",
  veterinario: "veterinaria",
  asesoria: "abogacia-gestoria", inmobiliaria: "abogacia-gestoria",
  gimnasio: "gimnasio-clases",
};

/* El negocio de ejemplo de cada plantilla, para poder sustituirlo por el real
   en la marca, los titulares, el pie y las etiquetas. */
const EJEMPLO = {
  "hosteleria-asador":    { nombre: "Asador Mendiola", marca: "Mendiola" },
  "reformas-gremios":     { nombre: "Reformas Elutxeta", marca: "Elutxeta" },
  "veterinaria":          { nombre: "Clínica Veterinaria Otsoa", marca: "Otsoa" },
  "abogacia-gestoria":    { nombre: "Aizpurua Abogados", marca: "Aizpurua" },
  "salud-odontologia":    { nombre: "Clínica Dental Arrate", marca: "Arrate" },
  "automocion-taller":    { nombre: "Talleres Zubieta", marca: "Zubieta" },
  "belleza-peluqueria":   { nombre: "Ilargi Peluquería", marca: "Ilargi" },
  "alimentacion-obrador": { nombre: "Ogia Etxea", marca: "Ogia Etxea" },
  "comercio-tienda":      { nombre: "Aiora Denda", marca: "Aiora" },
  "cafeteria-bar":        { nombre: "Bar Zubi", marca: "Zubi" },
  "gimnasio-clases":      { nombre: "Indarra Gimnasioa", marca: "Indarra" },
};

const DIAS = {
  domingo: 0, lunes: 1, martes: 2, "miércoles": 3, miercoles: 3,
  jueves: 4, viernes: 5, "sábado": 6, sabado: 6,
};

const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);

/** "lunes: 6:30–17:00; martes: Cerrado" → { 1:[["06:30","17:00"]], 2:null } */
function parseHorario(txt) {
  if (!txt) return null;
  const out = {};
  for (const trozo of String(txt).split(";")) {
    const i = trozo.indexOf(":");
    if (i < 0) continue;
    const d = DIAS[trozo.slice(0, i).trim().toLowerCase()];
    if (d === undefined) continue;
    const resto = trozo.slice(i + 1).trim();
    if (/cerrado|closed/i.test(resto)) { out[d] = null; continue; }
    const tramos = [];
    for (const r of resto.split(",")) {
      const m = r.trim().match(/(\d{1,2}):(\d{2})\s*[–—-]\s*(\d{1,2}):(\d{2})/);
      if (m) tramos.push([m[1].padStart(2, "0") + ":" + m[2], m[3].padStart(2, "0") + ":" + m[4]]);
    }
    out[d] = tramos.length ? tramos : null;
  }
  return Object.keys(out).length ? out : null;
}

function jsHorario(h) {
  const filas = [1, 2, 3, 4, 5, 6, 0].map((d) => {
    const v = h[d] ? "[" + h[d].map((t) => '["' + t[0] + '","' + t[1] + '"]').join(",") + "]" : "null";
    return "    " + d + ":" + v + ",";
  });
  return "{\n" + filas.join("\n") + "\n  }";
}

/**
 * Sustituye el valor de una clave del bloque DATOS conservando el formato.
 *
 * El orden de las alternativas importa y mucho. La llave de una sola línea
 * ({ lat:…, lon:… }) tiene que probarse ANTES que la multilínea: si no, el
 * patrón perezoso de la multilínea sigue buscando su "\n  }" y se come todo
 * lo que haya en medio. Con geo eso se llevaba por delante precio,
 * tarifaVigencia y la tabla de tarifas entera, y la demo salía sin precios.
 */
function setDato(js, clave, valorJs) {
  const re = new RegExp(
    "(\\n  " + clave + ":\\s*)" +
    "(\"[^\"]*\"" +          // cadena
    "|\\{[^\\n}]*\\}" +      // llave en una línea
    "|\\{[\\s\\S]*?\\n  \\}" + // llave multilínea
    "|\\[[^\\n\\]]*\\]" +    // lista en una línea
    "|[^,\\n]*)(,)"          // número o identificador
  );
  return re.test(js) ? js.replace(re, "$1" + valorJs + "$3") : js;
}

/**
 * Quita una sección entera y, con ella, los enlaces del menú y del pie que
 * llevaban a su ancla. Si se borra la sección y se deja el enlace, el visitante
 * pulsa "El equipo" y no pasa nada: peor que no tenerlo.
 */
function quitarSeccion(s, re) {
  const m = s.match(re);
  if (!m) return s;
  const id = m[1];
  s = s.replace(m[0], "");
  if (id) s = s.replace(new RegExp('\\s*<a href="#' + id + '"[^>]*>[^<]*</a>', "g"), "");
  return s;
}

function generar(b, plantillaForzada) {
  const plantilla = plantillaForzada || PLANTILLA[b.category];
  if (!plantilla) return { error: 'sin plantilla para la categoría "' + b.category + '"' };
  const dirP = path.join(RAIZ, plantilla);
  if (!fs.existsSync(dirP)) return { error: "no existe la plantilla " + plantilla };

  let s = fs.readFileSync(path.join(dirP, "index.html"), "utf8");
  const ej = EJEMPLO[plantilla];
  const faltan = [];

  const nombre = String(b.name).trim();
  const pueblo = String(b.town || "Tolosa").replace(/^\w/, (c) => c.toUpperCase());
  const tel = String(b.phone || "").replace(/\s/g, "");
  const horario = parseHorario(b.opening_hours);

  /* Google devuelve la dirección con el pueblo dentro más de la mitad de las
     veces ("Bidebarrieta kalea 64, 20600 Eibar"). Añadirlo otra vez dejaba
     "…Eibar · Eibar, Gipuzkoa" en la ficha de contacto. */
  const dir = !b.address ? pueblo + ", Gipuzkoa"
    : /gipuzkoa|guip[uú]zcoa/i.test(b.address) ? b.address
    : new RegExp(pueblo, "i").test(b.address) ? b.address + ", Gipuzkoa"
    : b.address + " · " + pueblo + ", Gipuzkoa";

  if (!tel) faltan.push("teléfono");
  if (!b.address) faltan.push("dirección");
  if (!horario) faltan.push("horario");
  if (!b.google_rating) faltan.push("valoración");
  if (!b.latitude || !b.longitude) faltan.push("coordenadas");

  /* ── bloque DATOS ── */
  const iniD = s.indexOf("const DATOS = {");
  const finD = s.indexOf("\n};", iniD) + 3;
  const orig = s.slice(iniD, finD);
  let js = orig;
  js = setDato(js, "nombre", JSON.stringify(nombre));
  if (tel) {
    js = setDato(js, "tel", JSON.stringify(tel));
    js = setDato(js, "whatsapp", JSON.stringify(tel.replace(/^\+/, "")));
  }
  js = setDato(js, "direccion", JSON.stringify(dir));
  js = setDato(js, "maps", JSON.stringify(
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent((nombre + " " + (b.address || "") + " " + pueblo).trim())));
  if (horario) js = setDato(js, "horario", jsHorario(horario));
  if (b.email) js = setDato(js, "email", JSON.stringify(b.email));
  if (b.latitude && b.longitude) {
    js = setDato(js, "geo", "{ lat:" + b.latitude + ", lon:" + b.longitude + " }");
  }
  s = s.slice(0, iniD) + js + s.slice(finD);

  /* El mapa incrustado lleva las coordenadas en la propia URL, así que hay que
     rehacerla: si no, la demo de un negocio de Eibar enseña un mapa de Tolosa.
     Es el fallo que peor sienta, porque el cliente lo ve en dos segundos. */
  if (b.latitude && b.longitude) {
    const la = Number(b.latitude), lo = Number(b.longitude);
    const bbox = [lo - 0.008, la - 0.0045, lo + 0.008, la + 0.0045]
      .map((n) => n.toFixed(4)).join("%2C");
    s = s.replace(/bbox=[-\d.%A-Za-z]+&layer=mapnik&marker=[-\d.%A-Za-z]+/,
      "bbox=" + bbox + "&layer=mapnik&marker=" + la.toFixed(5) + "%2C" + lo.toFixed(5));
  }

  /* ── nombre visible: marca, titulares, pie, meta ── */
  const partes = nombre.split(/\s+/);
  const marca = partes.length > 2 ? partes.slice(0, 2).join(" ") : partes[0];
  s = s.split(ej.nombre).join(nombre);
  s = s.split(">" + ej.marca + " ").join(">" + marca + " ");
  s = s.split(">" + ej.marca + "<").join(">" + marca + "<");
  // "Tolosaldea" antes que "Tolosa": si no, "· Tolosaldea" se convertía en
  // "· Beasainldea" y la demo de Beasain salía con una comarca inventada.
  s = s.split("Tolosaldea").join(pueblo);
  s = s.split("Tolosa, Gipuzkoa").join(pueblo + ", Gipuzkoa");
  s = s.split("en Tolosa").join("en " + pueblo);
  s = s.split("· Tolosa").join("· " + pueblo);

  /* ── valoración real de Google ── */
  if (b.google_rating) {
    const nota = String(b.google_rating).replace(".", ",");
    const n = b.reviews_count || 0;
    s = s.replace(/<b>\d,\d<span class="vh">[^<]*<\/span><\/b>/,
      "<b>" + nota + '<span class="vh"> sobre 5</span></b>');
    s = s.replace(/>\d,\d</g, ">" + nota + "<");
    s = s.replace(/\d,\d sobre 5 · \d+ reseñas/g, nota + " sobre 5 · " + n + " reseñas");
    s = s.replace(/Google · \d+ reseñas/g, "Google · " + n + " reseñas");
    s = s.replace(/ratingValue:"[\d.]+",reviewCount:"\d+"/,
      'ratingValue:"' + b.google_rating + '",reviewCount:"' + n + '"');
  }

  /* ── datos para Google (JSON-LD) ──
     Las once plantillas sacan el municipio del código postal de la dirección
     y, si no lo encuentran, ponían "Tolosa" a pelo. Cualquier negocio sin
     código postal en la ficha salía para Google como si estuviera en Tolosa.
     Pasó con Har' ta jan, de Errenteria. Y la URL era location.href, con los
     parámetros de la visita incluidos. */
  s = s.split('||"Tolosa"').join("||" + JSON.stringify(pueblo));
  // Y el código postal se buscaba solo en el trozo posterior al "·" de la
  // dirección, que muchas veces está vacío: se busca en la dirección entera.
  s = s.split("resto.match(").join("(resto||DATOS.direccion).match(");
  s = s.split("url:location.href").join("url:location.origin+location.pathname");

  /* ── el aviso de demo, con el nombre del negocio ── */
  s = s.replace("Demostración sin compromiso creada por OI Studio",
    "Demostración para " + nombre + ", creada sin compromiso por OI Studio");

  /* ── fuera lo que la base no puede confirmar ──────────────────────────
     Hasta aquí la demo lleva datos reales del negocio. Lo que viene de la
     plantilla —años abiertos, tamaño del equipo, nombres propios, reseñas
     firmadas— es relleno de diseño, y bajo el rótulo de un negocio REAL deja
     de ser relleno: pasa a ser una afirmación sobre ellos. Antes esto solo se
     avisaba por consola y el enlace salía igual. Ahora se quita. */
  const quitadas = [];

  /* 1 · Cifras. Se queda la de Google, que sale de la base; el resto fuera.
     Si no queda ninguna, la banda entera sobra. */
  s = s.replace(/[ \t]*<li class="rev"[^>]*>\s*<b class="cnum"[\s\S]*?<\/li>\n?/g, (li) => {
    const m = li.match(/>([^<]*)<\/b><small>([^<]*)/);
    if (m && /google|reseñ/i.test(m[2])) return li;
    if (m) quitadas.push("cifra «" + m[1] + " " + m[2] + "»");
    return "";
  });
  s = s.replace(/<section class="cifras"[\s\S]*?<\/section>\n?/g, (sec) =>
    /<li/.test(sec) ? sec : (quitadas.push("banda de cifras (se quedaba vacía)"), ""));

  /* 2 · Fichas de persona: nombre propio y cargo inventados. Fuera la sección
     entera y los enlaces del menú que apuntaban a ella. */
  const personas = [...s.matchAll(/<h3>([^<]+)<\/h3>\s*<p class="prof__rol">([^<]+)</g)]
    .map((m) => m[1]);
  if (personas.length) {
    quitadas.push("equipo inventado (" + personas.join(", ") + ")");
    s = quitarSeccion(s, /<section class="prof"[^>]*id="([^"]*)"[\s\S]*?<\/section>\n?/);
  }

  /* 3 · Reseñas firmadas con nombre y fecha que nadie ha escrito. La nota y el
     número de reseñas SÍ son reales, así que el rótulo se queda y lo que se
     va es la cita, el autor y las flechas. */
  if (/id="cita-txt"/.test(s)) {
    quitadas.push("reseñas de ejemplo firmadas con nombre");
    // La nota y el número de reseñas siguen estando en la banda de cifras, que
    // sí salen de la base. Quitar solo las citas dejaba una franja entera con
    // una única línea repetida, así que se va la sección completa.
    s = quitarSeccion(s, /<section class="cita"[^>]*id="([^"]*)"[\s\S]*?<\/section>\n?/);
    // El array de DATOS tiene una entrada por línea, así que setDato no lo
    // alcanza: se sustituye entero. Dejarlo en el código fuente tampoco vale,
    // que cualquiera abre el fuente de la página y lee los textos falsos.
    s = s.replace(/(\n  resenas:\s*)\[[\s\S]*?\n  \],/, "$1[],");
    // El carrusel ya no tiene dónde pintar: que salga sin hacer nada en vez
    // de reventar el resto del JS de la página.
    s = s.replace(/function pintarCita\(\)\{/, 'function pintarCita(){\n  if(!document.getElementById("cita-txt")) return;');
    s = s.replace(/function moverCita\(paso\)\{/, "function moverCita(paso){\n  if(!DATOS.resenas.length) return;");

    /* Y sobre todo: las flechas del carrusel ya no existen, así que
       addEventListener sobre ellas lanza un TypeError. Eso no rompe "solo el
       carrusel": corta el arranque entero y la demo se queda sin horario, sin
       teléfono y sin menú del día. Pasó en la primera demo de cliente. */
    s = s.replace(/^.*getElementById\("cita-(ant|sig)"\)\.addEventListener[^\n]*\n/gm, "");
  }

  /* 3b · Reseñas inventadas que NO van en carrusel. Algunas plantillas (la de
     gremios) las pintan desde DATOS.resenas en una banda (#testis), no en
     #cita-txt, así que el paso 3 no las veía y la demo de un electricista de
     Beasain salía con "Ainhoa R." contando que le reformaron el piso. Se vacía
     el array y, si la sección se queda sin nada que enseñar, se quita. */
  if (/\n  resenas:\s*\[\s*\{/.test(s)) {
    if (!quitadas.some((q) => q.startsWith("reseñas"))) quitadas.push("reseñas de ejemplo firmadas con nombre");
    s = s.replace(/(\n  resenas:\s*)\[[\s\S]*?\n  \],/, "$1[],");
    // La sección que contiene #testis, sea una banda o un feed, sin pasarse a
    // la siguiente: el patrón no cruza ningún </section>.
    s = quitarSeccion(s, /<section[^>]*\bid="([^"]*)"[^>]*>(?:(?!<\/section>)[\s\S])*?id="testis"[\s\S]*?<\/section>\n?/);
    // Y el guion que la rellenaba no puede reventar si ya no está.
    s = s.split('document.getElementById("testis").innerHTML =').join('(document.getElementById("testis")||{}).innerHTML =');
  }

  /* 3c · La zona de trabajo de la plantilla es la de Tolosaldea. En un negocio
     de otro pueblo es una lista de sitios a los que nadie ha dicho que vaya. */
  if (/\n  zona:\s*\[/.test(s)) {
    s = s.replace(/(\n  zona:\s*)\[[^\]]*\]/, "$1[" + JSON.stringify(pueblo) + "]");
  }

  /* 4 · "desde 1987". Es la afirmación más peligrosa de todas porque no parece
     un dato: va en el rótulo, debajo del nombre real del negocio, y nadie la
     lee como relleno. Se quita de la portada, del pie y de las meta. */
  if (/desde (19|20)\d{2}/i.test(s)) {
    quitadas.push("antigüedad inventada (" + (s.match(/desde (19|20)\d{2}/i) || [])[0] + ")");
    s = s.replace(/\s*desde (19|20)\d{2}/gi, "");
  }

  /* 5 · Precios sueltos en la portada ("Menú del día 17 €"). Los de la carta se
     quedan —van juntos y el pie ya avisa de que son de ejemplo—, pero uno solo
     en el rótulo se lee como el precio de verdad de esta casa. */
  s = s.replace(/[ \t]*<span>[^<]*\d[\d.,]*\s*€[^<]*<\/span>\n?/g, (span) => {
    quitadas.push("precio en la portada («" + span.replace(/<[^>]+>/g, "").trim() + "»)");
    return "";
  });
  s = s.replace(/\s*(Menú del día|Menú) [\d.,]+\s*€\.?/gi, "");
  // Al quitar un trozo de frase quedan "en Errenteria., chuleta" y espacios
  // dobles. Se limpian aquí, que un punto suelto canta más que el dato.
  // Ojo con el alcance: un replace global de espacios dobles aplasta la
  // sangría del HTML, del CSS y del JS de la página entera. Solo se toca el
  // texto visible de las meta y los espacios que han quedado sueltos.
  s = s.replace(/content="([^"]*)"/g, (_, v) =>
    'content="' + v.replace(/\.\s*,/g, ",").replace(/ {2,}/g, " ").replace(/\s+\./g, ".").trim() + '"');
  s = s.replace(/>\s*([^<]*?)\s*<\/span>/g, (todo, v) => (/\S/.test(v) ? ">" + v.replace(/ {2,}/g, " ") + "</span>" : todo));

  /* Lo que no se puede quitar sin dejar la demo coja —la carta, los servicios,
     las fotos— se avisa para repasarlo con el cliente delante. */
  const dudosas = [
    ...[...s.matchAll(/>[^<]{0,40}\b\d+ años\b[^<]{0,40}</g)].map((m) => m[0].slice(1, -1).trim()),
    ...[...s.matchAll(/<p class="(?:portada__nota|hero__nota)">([^<]+)</g)].map((m) => m[1].trim()),
  ];

  /* 6 · Lo que queda de la plantilla —fotos, platos, precios, servicios— no se
     puede sacar de ninguna base: se dice en el pie, con todas las letras. */
  s = s.replace(/los textos e imágenes son orientativos\./,
    "las fotos, los textos y los precios son de ejemplo y se sustituyen por los vuestros.");

  const inventadas = quitadas;

  const destino = path.join(SALIDA, slug(nombre));
  fs.mkdirSync(destino, { recursive: true });
  fs.cpSync(path.join(dirP, "fuentes"), path.join(destino, "fuentes"), { recursive: true });
  fs.writeFileSync(path.join(destino, "index.html"), s);
  return { destino, plantilla, faltan, inventadas, dudosas };
}

/* ── entrada ── */
const arg = (n) => { const i = process.argv.indexOf("--" + n); return i > -1 ? process.argv[i + 1] : undefined; };
const db = new DatabaseSync("captacion/prisma/captacion.db", { readOnly: true });

let negocios = [];
if (arg("id")) {
  negocios = db.prepare("SELECT * FROM businesses WHERE id=?").all(Number(arg("id")));
} else if (arg("nombre")) {
  negocios = db.prepare("SELECT * FROM businesses WHERE name LIKE ? LIMIT 5").all("%" + arg("nombre") + "%");
} else if (arg("categoria")) {
  negocios = db.prepare(
    "SELECT * FROM businesses WHERE category=? AND (website IS NULL OR website='')" +
    " AND phone IS NOT NULL AND phone<>'' ORDER BY reviews_count DESC LIMIT ?"
  ).all(arg("categoria"), Number(arg("limite") || 3));
} else {
  console.log("Falta --id, --nombre o --categoria. Ver la cabecera del fichero.");
  process.exit(1);
}

if (!negocios.length) { console.log("Sin resultados."); process.exit(1); }

for (const b of negocios) {
  const r = generar(b, arg("plantilla"));
  if (r.error) { console.log("x " + b.name + ": " + r.error); continue; }
  console.log("OK " + b.name + "  [" + b.category + " -> " + r.plantilla + "]");
  console.log("   " + r.destino);
  if (r.faltan.length) console.log("   sin datos de: " + r.faltan.join(", ") + " (se queda el ejemplo)");
  if (r.inventadas.length) console.log("   quitado por no poder confirmarlo: " + r.inventadas.join(" · "));
  if (r.dudosas && r.dudosas.length) console.log("   repasar con el cliente: " + r.dudosas.join(" · "));
}
db.close();
