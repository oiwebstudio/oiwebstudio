/**
 * Subpáginas de la muestra de Biciprecisión Igartua (Bergara), con la estructura y los datos de su web actual
 * (biciprecisionigartua.com): bicicletas por tipo, ofertas, segunda mano, taller, Flanders, historia y contacto.
 * Todo lo que se afirma sale de su web: catálogo y precios de su tienda online (9/10/2026), "Quiénes somos", "Contacto",
 * la nota de biomecánica (2014) y la portada. Estilo: nueva/sitio.css (mismo lenguaje que index.html).
 *
 *   node herramientas/demos/fotos-biciprecision.mjs <carpeta>        → fotos + <carpeta>/catalogo.json
 *   node herramientas/demos/demo-biciprecision-paginas.mjs <carpeta> → web/demos/clientes/biciprecision-igartua/**
 */
import fs from "node:fs";
import path from "node:path";

const CARPETA = process.argv[2];
const SITE = "web/demos/clientes/biciprecision-igartua/";
const cat = JSON.parse(fs.readFileSync(CARPETA + "/catalogo.json", "utf8"));

const TEL = "943 76 11 21", TEL_H = "tel:+34943761121", WA = "688 67 31 71", WA_N = "34688673171";
const MAIL = "biciprecisionigartua@gmail.com";
const MAPA = "https://www.google.com/maps/dir/?api=1&destination=Zubieta+Kalea+5+Bergara";
const euro = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " €";
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const wa = (txt) => `https://wa.me/${WA_N}?text=${encodeURIComponent(txt)}`;
const MARCA = { cube: "Cube", focus: "Focus", flanders: "Flanders", lapierre: "Lapierre", bh: "BH", cannondale: "Cannondale", stevens: "Stevens", merida: "Merida", moser: "Moser", "": "" };
const TIPOS = {
  carretera: { titulo: "carretera", nombre: "Carretera", cat: "carretera" },
  montana: { titulo: "montaña", nombre: "Montaña", cat: "montana" },
  electricas: { titulo: "eléctricas", nombre: "Eléctricas", cat: "electrica" },
  gravel: { titulo: "gravel", nombre: "Gravel", cat: "gravel" },
};
const porCat = (c) => cat.filter((p) => p.cat === c);
const sinMarca = (p) => p.nombre.replace(new RegExp("^" + (p.marca || "@@") + "\\s+", "i"), "").replace(/\s+/g, " ").trim();

const MENU = [
  ["bicicletas", "Bicicletas", "bicicletas/"], ["ofertas", "Ofertas", "ofertas/"], ["segunda-mano", "Segunda mano", "segunda-mano/"],
  ["taller", "Taller", "taller/"], ["flanders", "Flanders", "flanders/"], ["historia", "Historia", "historia/"], ["contacto", "Contacto", "contacto/"],
];

function tarjeta(p, r, tipoNombre) {
  const marca = MARCA[p.marca] ?? "";
  const dto = p.antes && p.antes > p.precio ? Math.round((1 - p.precio / p.antes) * 100) : 0;
  const precio = p.precio > 50 ? euro(p.precio) : "Consultar";
  return `<a class="bici" href="${esc(wa("Hola, me interesa la " + p.nombre + " que he visto en vuestra web. ¿Sigue disponible?"))}" target="_blank" rel="noopener" data-marca="${p.marca || "otras"}">` +
    `<span class="num tec"><span>${esc(marca || "Bici")}</span><span>${esc(tipoNombre)}</span></span>` +
    (dto ? `<span class="dto">−${dto} %</span>` : "") +
    `<figure><img src="${r}nueva/fotos/${p.foto}" width="${p.w}" height="${p.h}" alt="${esc(p.nombre)}" loading="lazy"/></figure>` +
    `<h3>${esc(marca ? sinMarca(p) : p.nombre)}</h3><p>${precio}${dto ? `<s>${euro(p.antes)}</s>` : ""}</p>` +
    `<span class="pide tec">Pregunta por WhatsApp →</span></a>`;
}

function cabecera(r, actual) {
  const enlaces = MENU.map(([id, t, h]) => `<a class="tec" href="${r}${h}"${id === actual ? ' aria-current="page"' : ""}>${t}</a>`).join("");
  const panel = MENU.map(([id, t, h]) => `<a href="${r}${h}"${id === actual ? ' aria-current="page"' : ""}>${t}<span>→</span></a>`).join("");
  return `<a class="saltar" href="#contenido">Saltar al contenido</a>
<div role="region" aria-label="Aviso"><p class="aviso">Muestra preparada por OI Studio para Biciprecisión Igartua, con su catálogo y sus precios. Sin compromiso.</p></div>
<header class="top"><div class="wrap">
  <a class="logo" href="${r}index.html" aria-label="Biciprecisión Igartua, inicio">igartua<small>Bergara</small></a>
  <nav class="menu" aria-label="Principal">${enlaces}</nav>
  <a class="boton tel tec" href="${TEL_H}">${TEL}</a>
  <button class="burger" type="button" aria-expanded="false" aria-controls="panel">Menú</button>
</div>
<nav class="panel" id="panel" aria-label="Principal móvil">${panel}</nav></header>`;
}

function pie(r) {
  return `<footer class="pie tec"><div class="wrap">
  <div><b>Biciprecisión Igartua</b>Zubieta kalea 5 y 7, Bergara (Gipuzkoa)<br/>Lunes a viernes 9:00–13:00 y 16:00–20:00<br/>Sábados 9:00–13:00</div>
  <div><b>Tienda</b>${MENU.map(([, t, h]) => `<a href="${r}${h}">${t}</a>`).join("")}</div>
  <div><b>Contacto</b><a href="${TEL_H}">${TEL}</a><a href="${wa("Hola, os escribo desde vuestra web.")}">WhatsApp ${WA}</a><a href="mailto:${MAIL}">${MAIL}</a></div>
</div></footer>
<nav class="movil" aria-label="Contacto"><a class="boton" href="${TEL_H}">Llamar</a><a class="boton boton--linea" href="${wa("Hola, os escribo desde vuestra web.")}" target="_blank" rel="noopener">WhatsApp</a></nav>`;
}

function pagina({ ruta, actual, titulo, descripcion, h1, intro, foto, migas, cuerpo, cierre = true }) {
  const r = "../".repeat(ruta.split("/").filter(Boolean).length);
  const mig = [["Inicio", `${r}index.html`], ...migas].map(([t, h], i, a) => (i < a.length - 1 ? `<a href="${h}">${t}</a><span>/</span>` : `<span style="margin:0">${t}</span>`)).join("");
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="robots" content="noindex, nofollow"/>
<meta name="theme-color" content="#0c0c0c"/>
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descripcion)}"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600&family=Archivo:wght@400;500;600&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="${r}nueva/sitio.css"/>
</head>
<body>
${cabecera(r, actual)}
<main id="contenido">
<section class="hero visor" data-portada>
  <div class="foto"><img src="${r}nueva/fotos/${foto}" width="1600" height="1200" alt="" fetchpriority="high"/></div>
  <span class="marca m1"></span><span class="marca m2"></span><span class="marca m3"></span><span class="marca m4"></span>
  <div class="wrap">
    <p class="migas tec">${mig}</p>
    <h1 class="ancha" data-letras>${h1}</h1>
    <p class="intro">${intro}</p>
  </div>
</section>
${cuerpo(r)}
${cierre ? `<section class="cierre"><div class="wrap">
  <h2 class="ancha" data-lineas>pásate por zubieta</h2>
  <p class="tec" style="margin-top:18px;color:var(--gris)">Lunes a viernes 9:00–13:00 y 16:00–20:00 · sábados 9:00–13:00</p>
  <div class="acciones"><a class="boton" href="${TEL_H}">Llamar ${TEL}</a><a class="boton boton--linea" href="${wa("Hola, os escribo desde vuestra web.")}" target="_blank" rel="noopener">WhatsApp ${WA}</a><a class="boton boton--linea" href="${MAPA}" target="_blank" rel="noopener">Cómo llegar</a></div>
</div></section>` : ""}
</main>
${pie(r)}
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js"></script>
<script src="${r}nueva/anim-texto.js"></script>
<script src="${r}nueva/sitio.js"></script>
</body>
</html>
`;
}

const escribir = (ruta, html) => {
  const f = SITE + ruta + "index.html";
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
  console.log("escrito", ruta + "index.html", Math.round(html.length / 1024) + " KB");
};

// ───── Bicicletas (hub) ─────
const desde = (xs) => Math.min(...xs.filter((p) => p.precio > 50).map((p) => p.precio));
const portadaTipo = { carretera: /AIR C:68X RACE/i, montana: /STEREO ONE22 PRO/i, electricas: /STEREO HYBRID ONE44 HPC SLX/i, gravel: /ATLAS 8\.9/i };
escribir("bicicletas/", pagina({
  ruta: "bicicletas/", actual: "bicicletas", titulo: "Bicicletas en Bergara: carretera, montaña, eléctricas y gravel | Biciprecisión Igartua",
  descripcion: "Bicis de carretera, montaña, eléctricas y gravel de Cube, Focus y Flanders en Bergara. Pago en 1 o 2 años sin intereses.",
  h1: "bicicletas", intro: "Carretera, montaña, eléctricas y gravel. Cube, Focus y Flanders, y si no ves la tuya, la montamos a la carta.", foto: "cartel.webp",
  migas: [["Bicicletas", ""]],
  cuerpo: (r) => `<section class="sec"><div class="wrap">
  <div class="cab-sec"><h2 class="ancha" data-lineas>elige tu tipo</h2><p class="tec" data-enciende>Todo el catálogo de la tienda, ordenado por tipo de bici. Pregúntanos por cualquier modelo por WhatsApp.</p></div>
  <div class="tipos" data-escalonado>${Object.entries(TIPOS).map(([k, t]) => {
    const xs = porCat(t.cat), rep = xs.find((p) => portadaTipo[k].test(p.nombre)) ?? xs[0];
    return `<a class="tipo" href="${k}/"><img src="${r}nueva/fotos/${rep.foto}" width="${rep.w}" height="${rep.h}" alt="" loading="lazy"/><div class="dentro"><span class="tec">${xs.length} modelos</span><div><h3>${t.titulo}</h3><div class="pie-tipo tec" style="margin-top:14px"><span>desde ${euro(desde(xs))}</span><span>ver →</span></div></div></div></a>`;
  }).join("")}</div>
  <p class="nota">Precios de su tienda online el 9/10/2026. En la web de verdad saldrían del catálogo y siempre al día.</p>
</div></section>
<div class="tira" aria-hidden="true"><div class="pista" data-pista="38">cube <i>· 01 ·</i> focus <i>· 02 ·</i> flanders <i>· 03 ·</i> massi <i>· 04 ·</i> moustache <i>· 05 ·</i> cube <i>· 01 ·</i> focus</div></div>
<section class="sec"><div class="wrap dos">
  <div><h2 class="ancha" style="font-size:clamp(36px,5vw,76px)" data-lineas>a tu medida</h2></div>
  <div class="texto" data-escalonado>
    <p><strong>Montajes a la carta.</strong> Cuadro, ruedas y cambio: elegimos contigo las piezas y la montamos en la tienda.</p>
    <p><strong>Pago en 1 o 2 años sin intereses,</strong> y también por Bizum.</p>
    <p><strong>Biomecánica y entrenamiento</strong> para ajustar la bici a tu cuerpo. <a href="../taller/">Ver el taller</a></p>
  </div>
</div></section>`,
}));

// ───── Un tipo ─────
for (const [k, t] of Object.entries(TIPOS)) {
  const xs = porCat(t.cat).sort((a, b) => b.precio - a.precio);
  const marcas = [...new Set(xs.map((p) => p.marca || "otras"))];
  const ordenMarcas = ["cube", "focus", "flanders"].filter((m) => marcas.includes(m)).concat(marcas.filter((m) => !["cube", "focus", "flanders"].includes(m)));
  const mn = (m) => (m === "otras" ? "Otras marcas" : MARCA[m]);
  const textos = {
    carretera: "Bicis de carretera de Cube, Focus y Flanders.",
    montana: "Bicis de montaña de Cube, desde 450 €.",
    electricas: "Eléctricas de montaña y de carretera, de Cube y Focus.",
    gravel: "Gravel y cross de Focus, Cube y Lapierre.",
  };
  escribir(`bicicletas/${k}/`, pagina({
    ruta: `bicicletas/${k}/`, actual: "bicicletas", titulo: `${k === "electricas" ? "Bicis eléctricas" : "Bicis de " + t.titulo} en Bergara | Biciprecisión Igartua`,
    descripcion: `${textos[k]} Tienda en Bergara (Gipuzkoa), con pago sin intereses en 1 o 2 años.`,
    h1: t.titulo, intro: textos[k], foto: k === "montana" || k === "electricas" ? "cartel3.webp" : "cartel.webp", migas: [["Bicicletas", "../"], [t.nombre, ""]],
    cuerpo: () => `<section class="sec"><div class="wrap">
  <div class="cab-sec"><h2 class="ancha" data-lineas>${xs.length} modelos</h2><p class="tec" data-enciende>Desde ${euro(desde(xs))}. Toca una bici para preguntarnos por WhatsApp si la tenemos en tu talla.</p></div>
  <div class="filtros" role="group" aria-label="Filtrar por marca"><button class="chip" type="button" data-f="todas" aria-pressed="true">Todas</button>${ordenMarcas.map((m) => `<button class="chip" type="button" data-f="${m}" aria-pressed="false">${mn(m)}</button>`).join("")}<span class="cuenta tec" aria-live="polite" data-cuenta>${xs.length} modelos</span></div>
  <div class="rejilla" data-rejilla>${xs.map((p) => tarjeta(p, "../../", t.nombre)).join("")}</div>
  <p class="nota">Precios de su tienda online el 9/10/2026. Tallas y disponibilidad: por teléfono o WhatsApp.</p>
</div></section>
<section class="sec"><div class="wrap"><div class="filtros"><span class="tec" style="color:var(--gris)">Otros tipos</span>${Object.entries(TIPOS).filter(([o]) => o !== k).map(([o, x]) => `<a class="chip" href="../${o}/">${x.nombre}</a>`).join("")}<a class="chip" href="../../ofertas/">Ofertas</a></div></div></section>`,
  }));
}

// ───── Ofertas ─────
{
  const conDto = cat.filter((p) => p.antes && p.antes > p.precio && p.cat !== "segunda-mano").sort((a, b) => b.antes / b.precio - a.antes / a.precio);
  const cuadros = porCat("ofertas");
  const tn = (c) => ({ carretera: "Carretera", montana: "Montaña", electrica: "Eléctrica", gravel: "Gravel" })[c] ?? "";
  escribir("ofertas/", pagina({
    ruta: "ofertas/", actual: "ofertas", titulo: "Ofertas en bicicletas | Biciprecisión Igartua, Bergara",
    descripcion: "Bicis rebajadas de Cube, Focus y Flanders, y cuadros desde 90 €. Tienda en Bergara.",
    h1: "ofertas", intro: `${conDto.length} bicis rebajadas, hasta un ${Math.round((1 - Math.min(...conDto.map((p) => p.precio / p.antes))) * 100)} % menos, y cuadros Moser y Flanders desde 90 €.`, foto: "cartel3.webp", migas: [["Ofertas", ""]],
    cuerpo: () => `<section class="sec"><div class="wrap">
  <div class="cab-sec"><h2 class="ancha" data-lineas>bicis rebajadas</h2><p class="tec" data-enciende>De más a menos descuento. Pregúntanos por tu talla antes de venir.</p></div>
  <div class="rejilla" data-escalonado>${conDto.map((p) => tarjeta(p, "../", tn(p.cat))).join("")}</div>
  <p class="nota">Precios de su tienda online el 9/10/2026.</p>
</div></section>
<section class="sec"><div class="wrap">
  <div class="cab-sec"><h2 class="ancha" data-lineas>cuadros</h2><p class="tec" data-enciende>Cuadros Moser y Flanders para montar tu bici.</p></div>
  <div class="rejilla" data-escalonado>${cuadros.map((p) => tarjeta({ ...p, marca: /FLANDERS/i.test(p.nombre) ? "flanders" : "moser" }, "../", "Cuadro")).join("")}</div>
</div></section>`,
  }));
}

// ───── Segunda mano ─────
{
  const xs = porCat("segunda-mano").sort((a, b) => b.precio - a.precio);
  escribir("segunda-mano/", pagina({
    ruta: "segunda-mano/", actual: "segunda-mano", titulo: "Bicis de segunda mano en Bergara | Biciprecisión Igartua",
    descripcion: "Bicicletas de segunda mano en Bergara: carretera, eléctricas y de montaña, desde 500 €.",
    h1: "segunda mano", intro: "Bicis de segunda mano de varias marcas. Llámanos o escríbenos y te decimos qué hay ahora mismo.", foto: "cartel2.webp", migas: [["Segunda mano", ""]],
    cuerpo: () => `<section class="sec"><div class="wrap">
  <div class="cab-sec"><h2 class="ancha" data-lineas>${xs.length} bicis</h2><p class="tec" data-enciende>Tallas y estado, por teléfono o WhatsApp. Si buscas algo concreto, te avisamos cuando entre.</p></div>
  <div class="rejilla" data-escalonado>${xs.map((p) => tarjeta(p, "../", "Segunda mano")).join("")}</div>
  <p class="nota">Precios de su tienda online el 9/10/2026. La Merida con motor Shimano no tiene el precio visible en su web: aquí saldría «consultar».</p>
</div></section>`,
  }));
}

// ───── Taller ─────
escribir("taller/", pagina({
  ruta: "taller/", actual: "taller", titulo: "Taller, montajes a la carta y biomecánica | Biciprecisión Igartua",
  descripcion: "Montajes a la carta, biomecánica y entrenamiento, ciclocross, spinning y accesorios en Biciprecisión Igartua, Bergara.",
  h1: "taller", intro: "Tu bici, montada y ajustada en Bergara: piezas a elegir, medidas del cuerpo y material para todo el año.", foto: "cartel3.webp", migas: [["Taller", ""]],
  cuerpo: () => `<section class="sec"><div class="wrap">
  <div class="cab-sec"><h2 class="ancha" data-lineas>qué hacemos</h2><p class="tec" data-enciende>Lo que ya ofrece la tienda, ahora explicado en un sitio.</p></div>
  <div class="servs" data-escalonado>
    <div><b>Montajes a la carta</b><p>Eliges cuadro, ruedas y cambio y te la montamos. Ruedas Fulcrum; cambios Campagnolo, Shimano y SRAM.</p></div>
    <div><b>Biomecánica y entrenamiento</b><p>Ajustar la bici a tu cuerpo y planes de entrenamiento, con David Herrero, ex ciclista profesional. Consúltanos fechas y precio.</p></div>
    <div><b>Ciclocross</b><p>Bicis y material para ciclocross, la especialidad de Iñigo.</p></div>
    <div><b>Spinning</b><p>Bicis de spinning entre 500 y 1.000 €. Llámanos y te decimos cuáles tenemos.</p></div>
    <div><b>Patinetes</b><p>Patinetes en la tienda. Consúltanos modelos y precios.</p></div>
    <div><b>Accesorios</b><p>Pedales, cascos, timbres, candados y cubiertas (Schwalbe, Continental).</p></div>
    <div><b>Cuadros</b><p>Cuadros Moser y Flanders desde 90 €. <a href="../ofertas/">Ver ofertas</a></p></div>
    <div><b>Pago y envíos</b><p>Pago en 1 o 2 años sin intereses, Bizum, transferencia o contra reembolso. La tienda online hace envíos.</p></div>
  </div>
</div></section>
<div class="tira" aria-hidden="true"><div class="pista" data-pista="38">shimano <i>· 01 ·</i> sram <i>· 02 ·</i> campagnolo <i>· 03 ·</i> fulcrum <i>· 04 ·</i> schwalbe <i>· 05 ·</i> shimano <i>· 01 ·</i> sram</div></div>`,
}));

// ───── Flanders ─────
{
  const fl = cat.filter((p) => /FLANDERS/i.test(p.nombre));
  escribir("flanders/", pagina({
    ruta: "flanders/", actual: "flanders", titulo: "Flanders: bicicletas belgas en exclusiva | Biciprecisión Igartua",
    descripcion: "Biciprecisión Igartua importa en exclusiva para España y Portugal las bicicletas belgas Flanders, de Oudenaarde.",
    h1: "flanders", intro: "La marca belga de Oudenaarde, que desde Bergara llegó a España y Portugal. Seguimos siendo su único distribuidor.", foto: "cartel2.webp", migas: [["Flanders", ""]],
    cuerpo: () => `<section class="sec"><div class="wrap dos">
  <div><h2 class="ancha" style="font-size:clamp(36px,5vw,76px)" data-lineas>una amistad<br/>en bélgica</h2></div>
  <div class="texto" data-escalonado>
    <p>En 1991, preparando la temporada de ciclocross en el corazón del ciclismo belga, Iñigo Igartua llegó a Oudenaarde, sede de la empresa de bicicletas Flanders, y conoció a sus fundadores, Frans y Luck Assez.</p>
    <p>La amistad creció tanto que Luck acompañaba a Iñigo a las carreras, y en las horas libres Iñigo ayudaba en la empresa con la reparación y el montaje de bicis.</p>
    <p>De ahí viene que Biciprecisión Igartua trajera la marca a España y Portugal <strong>en exclusiva</strong>. Hoy sigue siéndolo.</p>
    <p><a href="https://flandersfietsen.be/wp/" target="_blank" rel="noopener">Web de Flanders</a></p>
  </div>
</div></section>
<section class="sec"><div class="wrap">
  <div class="cab-sec"><h2 class="ancha" data-lineas>en la tienda</h2><p class="tec" data-enciende>Bicis y cuadros Flanders en este momento.</p></div>
  <div class="rejilla" data-escalonado>${fl.map((p) => tarjeta({ ...p, marca: "flanders" }, "../", /CUADRO/i.test(p.nombre) ? "Cuadro" : "Carretera")).join("")}</div>
  <p class="nota">Precios de su tienda online el 9/10/2026.</p>
</div></section>`,
  }));
}

// ───── Historia ─────
escribir("historia/", pagina({
  ruta: "historia/", actual: "historia", titulo: "Historia de Biciprecisión Igartua, Bergara | desde 1992",
  descripcion: "Los hermanos Miren e Iñigo Igartua abrieron Biciprecisión en Bergara en 1992. Ciclocross, Flanders y una tienda de bicis con tres décadas.",
  h1: "desde 1992", intro: "Una tienda de bicis de Bergara que nació de una carrera: la de Iñigo Igartua, ciclista, y de una amistad belga.", foto: "cartel2.webp", migas: [["Historia", ""]],
  cuerpo: () => `<section class="sec"><div class="wrap">
  <div class="cab-sec"><h2 class="ancha" data-lineas>quiénes somos</h2><p class="tec" data-enciende>Los hermanos Miren e Iñigo Igartua echaron a andar la actividad en 1992.</p></div>
  <div class="hitos" data-escalonado>
    <div class="hito"><b>1991</b><p>Iñigo pasa largos periodos en Bélgica preparando la temporada de ciclocross: Súper Prestigio, Copa del Mundo y pruebas nacionales. En Oudenaarde conoce a los hermanos Frans y Luck Assez, fundadores de Flanders.</p></div>
    <div class="hito"><b>1992</b><p>Los hermanos Miren e Iñigo Igartua inician la actividad económica de Biciprecisión Igartua.</p></div>
    <div class="hito"><b>1997</b><p>Se abre el comercio al público. La tienda se centra en la venta de material ciclista y empieza a traer Flanders, en exclusiva para España y Portugal.</p></div>
    <div class="hito"><b>Después</b><p>Se suma la importación de las bicicletas del campeonísimo Francesco Moser.</p></div>
    <div class="hito"><b>Hoy</b><p>Distribuidor de numerosas marcas, con reconocido prestigio, y todavía en exclusiva con la marca belga Flanders.</p></div>
  </div>
</div></section>
<section class="sec"><div class="wrap">
  <div class="cab-sec"><h2 class="ancha" data-lineas>iñigo igartua</h2><p class="tec" data-enciende>Su palmarés como ciclista.</p></div>
  <div class="cifras" data-escalonado>
    <div><b>13</b><span>Mundiales con la selección</span></div>
    <div><b>6</b><span>Campeonatos de Euskadi, en todas las categorías</span></div>
    <div><b>3.º</b><span>Campeonato de España juvenil</span></div>
  </div>
  <p class="nota">Datos de «Quiénes somos» de su web actual. Falta confirmar con Iñigo cómo quiere contar el resto (Campeonato de España Elite y Sub 23, Súper Prestigio Roma, Mundial Amateur Getxo).</p>
</div></section>`,
}));

// ───── Contacto ─────
escribir("contacto/", pagina({
  ruta: "contacto/", actual: "contacto", titulo: "Contacto y horario | Biciprecisión Igartua, Bergara",
  descripcion: "Zubieta kalea 5 y 7, Bergara. Lunes a viernes 9:00–13:00 y 16:00–20:00, sábados 9:00–13:00. Teléfono 943 76 11 21 y WhatsApp 688 67 31 71.",
  h1: "contacto", intro: "Llámanos, escríbenos por WhatsApp o pásate por la tienda. Estamos en Zubieta, en Bergara.", foto: "cartel.webp", migas: [["Contacto", ""]], cierre: false,
  cuerpo: () => `<section class="sec"><div class="wrap dos">
  <div>
    <h2 class="ancha" style="font-size:clamp(36px,5vw,76px)" data-lineas>la tienda</h2>
    <div class="filas">
      <a href="${MAPA}" target="_blank" rel="noopener"><span class="tec">Dirección</span><b>Zubieta kalea 5 y 7, Bergara</b></a>
      <a href="${TEL_H}"><span class="tec">Teléfono</span><b>${TEL}</b></a>
      <a href="${wa("Hola, os escribo desde vuestra web.")}" target="_blank" rel="noopener"><span class="tec">WhatsApp</span><b>${WA}</b></a>
      <a href="mailto:${MAIL}"><span class="tec">Correo</span><b>${MAIL}</b></a>
      <div class="f"><span class="tec">Lunes a viernes</span><b>9:00–13:00 · 16:00–20:00</b></div>
      <div class="f"><span class="tec">Sábados</span><b>9:00–13:00</b></div>
      <div class="f"><span class="tec">Google</span><b>4,7 ★ · 64 opiniones</b></div>
    </div>
    <div class="acciones"><a class="boton" href="${TEL_H}">Llamar</a><a class="boton boton--linea" href="${wa("Hola, os escribo desde vuestra web.")}" target="_blank" rel="noopener">WhatsApp</a><a class="boton boton--linea" href="${MAPA}" target="_blank" rel="noopener">Cómo llegar</a></div>
    <p class="nota">Su web actual da el horario del sábado solo por la mañana; en su ficha de Google sale también por la tarde. Hay que confirmarlo con Iñigo.</p>
  </div>
  <div>
    <h2 class="ancha" style="font-size:clamp(36px,5vw,76px)" data-lineas>cómo pagar</h2>
    <div class="servs" style="grid-template-columns:1fr" data-escalonado>
      <div><b>En 1 o 2 años, sin intereses</b><p>Para que la bici no sea un golpe a la cartera.</p></div>
      <div><b>Bizum</b><p>Además de tarjeta y efectivo en la tienda.</p></div>
      <div><b>Transferencia o contra reembolso</b><p>En los pedidos de la tienda online.</p></div>
    </div>
  </div>
</div></section>`,
}));

// ───── Script común ─────
fs.writeFileSync(SITE + "nueva/sitio.js", `/* Menú móvil y filtro por marca de las subpáginas. Sin JavaScript todo se ve y se puede usar: el menú está en el pie y el filtro es un extra. */
(function () {
  var b = document.querySelector(".burger"), p = document.getElementById("panel");
  if (b && p) b.addEventListener("click", function () { var on = p.classList.toggle("on"); b.setAttribute("aria-expanded", on); b.textContent = on ? "Cerrar" : "Menú"; });
  var g = document.querySelector("[data-rejilla]"); if (!g) return;
  var fs = document.querySelectorAll(".chip[data-f]"), c = document.querySelector("[data-cuenta]");
  fs.forEach(function (x) { x.addEventListener("click", function () {
    var f = x.dataset.f, n = 0;
    fs.forEach(function (y) { y.setAttribute("aria-pressed", y === x); });
    g.querySelectorAll(".bici").forEach(function (t) { var ok = f === "todas" || t.dataset.marca === f; t.hidden = !ok; if (ok) n++; });
    if (c) c.textContent = n + (n === 1 ? " modelo" : " modelos");
  }); });
})();
`);
console.log("listo");
