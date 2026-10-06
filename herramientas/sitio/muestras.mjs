/**
 * Muestras del portfolio con marca inventada.
 *
 * Las demos de web/demos/clientes/ están hechas para negocios reales (nombre, teléfono, dirección,
 * opiniones de Google, fotos de personas y de su tienda). Este script genera en web/demos/muestras/
 * versiones con marca inventada, sin ningún dato del original:
 *
 *   KIRO (fisioterapia, Irun)      -> ARIN Fisioterapia
 *   Leire Godoy (psicología)       -> Ekhi Psicología (equipo con monogramas, foto libre)
 *   Biciprecisión Igartua (bicis)  -> Pedala (ilustraciones de línea en vez de sus fotos)
 *   Etxea (inmobiliaria)           -> ya es una plantilla inventada: se copia
 *
 * Uso: node herramientas/sitio/muestras.mjs   (desde la raíz del repo)
 * Al terminar comprueba que no queda nada de los datos originales.
 */
import fs from "node:fs";
import sharp from "sharp";
import path from "node:path";

const WEB = path.resolve("web");
const ORIGEN = path.join(WEB, "demos/clientes");
const DESTINO = path.join(WEB, "demos/muestras");
const STOCK = path.join(WEB, "assets/stock");

const AVISO = '<p style="font-size:13px">Muestra de diseño creada por OI Studio. El nombre, los datos, los textos y los precios son inventados; las fotos son de Unsplash, de ejemplo.</p>';
const MAPA_GENERICO = "https://www.openstreetmap.org/export/embed.html?bbox=-2.6%2C42.95%2C-1.75%2C43.5&amp;layer=mapnik";

const quitaComentarios = (h) => h.replace(/<!--[\s\S]*?-->\s*/g, "");
const aplicar = (h, pares) => { for (const [de, a] of pares) h = typeof de === "string" ? h.split(de).join(a) : h.replace(de, a); return h; };
const copiar = (de, a) => fs.cpSync(de, a, { recursive: true });
const limpiar = (dir) => fs.rmSync(dir, { recursive: true, force: true });

/* Pares comunes: mapas, teléfono genérico, aviso final y secciones de opiniones. */
const comunes = (h, { tel, wa }) => aplicar(h, [
  [/<section(?: class="opin")? id="opiniones">[\s\S]*?<\/section>\s*/g, ""],
  [/\s*<a href="#opiniones">Opiniones<\/a>/g, ""],
  [/,\s*\["#opiniones", 0, 0\]/g, ""],
  [/href="https:\/\/www\.google\.com\/maps\/[^"]*"/g, 'href="#contacto"'],
  [/src="https:\/\/www\.openstreetmap\.org\/export\/embed\.html\?[^"]*"/g, `src="${MAPA_GENERICO}"`],
  [/<p style="font-size:13px">Demostraci[\s\S]*?<\/p>/, AVISO],
  [/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, ""],
  ...(tel ? tel.map(([a, b]) => [a, b]) : []),
  ...(wa ? wa : []),
]);

/* ------------------------------------------------------------------ ARIN */
function arin() {
  const o = path.join(ORIGEN, "kiro-fisioterapia/v2"), d = path.join(DESTINO, "arin-fisioterapia");
  limpiar(d); copiar(o, d);
  const f = (a, b) => { fs.copyFileSync(path.join(d, "fotos", a), path.join(d, "fotos", b)); };
  f("hombro.jpg", "f1.jpg"); f("ejercicio.jpg", "f2.jpg"); f("espalda.jpg", "f3.jpg"); f("cadera.jpg", "f4.jpg");
  for (const x of ["kiro-epte.jpg", "kiro-gimnasio.jpg", "kiro-indiba.jpg", "kiro-readaptacion.jpg"]) fs.rmSync(path.join(d, "fotos", x));
  let h = quitaComentarios(fs.readFileSync(path.join(d, "index.html"), "utf8"));
  h = comunes(h, { tel: [[/943 ?63 ?32 ?01/g, "943 00 00 00"], ["+34943633201", "+34943000000"]] });
  h = aplicar(h, [
    [/<title>[^<]*<\/title>/, "<title>ARIN Fisioterapia — Fisioterapia en Gipuzkoa</title>"],
    [/<meta name="description" content="[^"]*"\/>/, '<meta name="description" content="Fisioterapia en Gipuzkoa: espalda y hernias discales, cefaleas y vértigos cervicales, tendones, lesiones deportivas y postoperatorios. Punción seca, EPTE ecoguiada, INDIBA y pilates terapéutico."/>'],
    [/<meta property="og:title" content="[^"]*"\/>/, '<meta property="og:title" content="ARIN Fisioterapia Avanzada — Gipuzkoa"/>'],
    [/<meta property="og:description" content="[^"]*"\/>/, '<meta property="og:description" content="Fisioterapia en Gipuzkoa. Espalda, tendones, cabeza, deporte y postoperatorio."/>'],
    [/<div class="cristal"><b>4,5<\/b>[\s\S]*?<\/div><\/div>/, '<div class="cristal"><b>48 h</b><div><span class="estrellas">CITA</span><small>Primera valoración sin compromiso</small></div></div>'],
    ["Fisioterapia en Irun desde 1997, ", "Fisioterapia en Gipuzkoa, "],
    ["Tres fisioterapeutas en San Pedro 20.", "Tres fisioterapeutas en el centro."],
    ["Fisioterapia avanzada · Irun", "Fisioterapia avanzada · Gipuzkoa"],
    ["<span>K</span><span>I</span><span>R</span><span>O</span>", "<span>A</span><span>R</span><span>I</span><span>N</span>"],
    ['<p class="anio rev"><small>Desde</small>1997</p>', '<p class="anio rev"><small>Equipo</small>3</p>'],
    ["<b>Aitor Amostegi</b><span>Fundador, gerente y fisioterapeuta, desde 1997</span>", "<b>Iker Zubialde</b><span>Fundador y fisioterapeuta</span>"],
    ["<b>Amaia López de Sosoaga</b><span>Fisioterapeuta, más de 10 años en KIRO</span>", "<b>Ane Mendiluze</b><span>Fisioterapeuta del equipo</span>"],
    ["<small>Desde</small>", "<small>Equipo</small>"],
    ["Aitor ha valorado", "Han valorado"],
    ["San Pedro 20, bajo · 20304 Irun", "Calle Mayor 1 · Gipuzkoa"],
    [/kirofisio@gmail\.com/g, "info@arin-fisioterapia.example"],
    ["KIRO Fisioterapia Avanzada", "ARIN Fisioterapia Avanzada"],
    ["KIRO Fisioterapia SL · Calle Mayor 1 · Gipuzkoa", "ARIN Fisioterapia · Calle Mayor 1 · Gipuzkoa"],
    ["KIRO Fisioterapia", "ARIN Fisioterapia"],
    [/fotos-kiro/g, "fotos-clinica"],
    [/fotos\/kiro-readaptacion\.jpg/g, "fotos/f4.jpg"],
    [/fotos\/kiro-epte\.jpg/g, "fotos/f1.jpg"],
    [/fotos\/kiro-indiba\.jpg/g, "fotos/f3.jpg"],
    [/fotos\/kiro-gimnasio\.jpg/g, "fotos/f2.jpg"],
    [/\bKIRO\b/g, "ARIN"],
    [/Mapa de ARIN Fisioterapia en Irun/g, "Mapa de Gipuzkoa"],
    [/\bIrun\b/g, "Gipuzkoa"],
  ]);
  fs.writeFileSync(path.join(d, "index.html"), h);
  return h;
}

/* ------------------------------------------------------------------ EKHI */
/* Psicología: de la versión nueva (v2) de la demo de Leire Godoy. Se quitan los
   retratos de personas, las opiniones con nombre, el croquis con su calle y
   todos sus datos de contacto. */
async function ekhi() {
  const o = path.join(process.cwd(), "_local/demos/v2/leire"), d = path.join(DESTINO, "ekhi-psikologia");
  limpiar(d); fs.mkdirSync(path.join(d, "fotos"), { recursive: true });
  for (const f of ["concha-1000.webp", "manos-1000.webp", "mano.woff2"]) fs.copyFileSync(path.join(o, "fotos", f), path.join(d, "fotos", f));
  fs.copyFileSync(path.join(o, "anim-texto.js"), path.join(d, "anim-texto.js"));
  const flor = path.join(WEB, "assets/stock/sec-flor-1.jpg");
  await sharp(flor).resize(949, 1111, { fit: "cover" }).webp({ quality: 80 }).toFile(path.join(d, "fotos/portada-949.webp"));
  await sharp(flor).resize(480, 562, { fit: "cover" }).webp({ quality: 80 }).toFile(path.join(d, "fotos/portada-480.webp"));
  let h = quitaComentarios(fs.readFileSync(path.join(o, "index.html"), "utf8"));
  const EQ = [["leire", "Leire Godoy", "Ainhoa Etxeberria", "AE"], ["laura", "Laura Urrutia", "Maite Olano", "MO"], ["elena", "Elena Fernández", "Nerea Sagarna", "NS"], ["ane", "Ane Requena", "Uxue Lizarraga", "UL"]];
  for (const [k, viejo, nombre, ini] of EQ) {
    h = h.replace(new RegExp(`<div class="t"><img src="fotos/${k}-480\\.webp"[^>]*/></div>`), `<div class="t mono" aria-hidden="true">${ini}</div>`);
    h = h.replace(`<h3>${viejo}</h3>`, `<h3>${nombre}</h3>`);
  }
  h = aplicar(h, [
    [/<section class="sec" id="opiniones"[\s\S]*?<\/section>\s*/, ""],
    [/<section class="sec" id="como-llegar"[\s\S]*?<\/section>\s*/, ""],
    [/\s*<a href="#opiniones">[^<]*<\/a>/g, ""],
    [/<div role="region" aria-label="Aviso"><p class="aviso">[\s\S]*?<\/p><\/div>/, `<div role="region" aria-label="Aviso"><p class="aviso">Muestra de diseño creada por OI Studio: el nombre, las personas y los datos son inventados.</p></div>`],
    [/<img src="fotos\/leire-949\.webp"[^>]*\/>/, `<img src="fotos/portada-949.webp" srcset="fotos/portada-480.webp 480w, fotos/portada-949.webp 949w" sizes="(min-width: 820px) 46vw, 92vw" width="949" height="1111" alt="Ramo de flores rosas en cubos de zinc" fetchpriority="high"/>`],
    [/<figcaption><span class="mayus">Leire Godoy<\/span><span class="mayus">Psicóloga sanitaria<\/span><\/figcaption>/, `<figcaption><span class="mayus">Ekhi Psicología</span><span class="mayus">Presencial y online</span></figcaption>`],
    [/<a class="nota" href="https:\/\/www\.google\.com\/maps[^>]*>[\s\S]*?<\/a>/, `<a class="nota" href="#contacto"><b>50 min</b> por sesión · primera consulta sin compromiso</a>`],
    [/https:\/\/wa\.me\/34688697602(\?text=[^"]*)?/g, "#contacto"],
    [/ target="_blank" rel="noopener"/g, ""],
    [/tel:\+34688697602/g, "tel:+34943000000"],
    [/688 ?69 ?76 ?02/g, "943 00 00 00"],
    [/mailto:leiregodoypsicologia@gmail\.com/g, "mailto:hola@ekhi-psikologia.example"],
    [/leiregodoypsicologia@gmail\.com/g, "hola@ekhi-psikologia.example"],
    [/<a href="https:\/\/www\.google\.com\/maps\/dir[^>]*>(<span>Consulta<\/span>)<b>[^<]*<\/b><\/a>/, `<a href="#contacto">$1<b>Calle Mayor 1, Donostia</b></a>`],
    [/\s*<a href="https:\/\/www\.instagram\.com\/psicoleire\/"[\s\S]*?<\/a>/, ""],
    [/<title>[^<]*<\/title>/, "<title>Ekhi Psicología · Donostia y online — muestra</title>"],
    [/<meta name="description" content="[^"]*"\/>/, `<meta name="description" content="Psicólogas en Donostia y online especializadas en trauma, apego, ansiedad, terapia de pareja y familia. Muestra de diseño de OI Studio."/>`],
    [/<a class="marca" href="#">Leire Godoy<small>Psicología · Donostia-San Sebastián<\/small>/, `<a class="marca" href="#">Ekhi<small>Psicología · Donostia y online</small>`],
    [/© Leire Godoy Psicología · Donostia/, "© Ekhi Psicología · Donostia"],
    [/<small>Croquis dibujado[\s\S]*?<\/small>/, "<small>Muestra de diseño. Fotos de apoyo: La Concha (Flickr, dominio público), manos (rawpixel, CC0) y flores (Unsplash).</small>"],
    [/var EQ = \{[^}]*\};/, `var EQ = { leire: "Ainhoa Etxeberria", laura: "Maite Olano", elena: "Nerea Sagarna", ane: "Uxue Lizarraga" }, INI = { leire: "AE", laura: "MO", elena: "NS", ane: "UL" };`],
    [/'<span><img src="fotos\/' \+ n \+ '-480\.webp" alt="" width="30" height="30"\/>' \+ EQ\[n\] \+ "<\/span>"/, `'<span><i class="mono mono--s" aria-hidden="true">' + INI[n] + "</i>" + EQ[n] + "</span>"`],
    [/inglés con Ane/g, "inglés con Uxue"],
    [/Escribir por WhatsApp|Escribirnos por WhatsApp/g, "Pedir primera consulta"],
    [/<span>WhatsApp<\/span>/g, "<span>Teléfono</span>"],
    [/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, ""],
    [/<\/style>/, `.mono{display:grid;place-items:center;background:#dbe5ee;color:#3b5b7a;font:300 clamp(44px,7vw,84px)/1 Newsreader,serif}
.mono.mono--s{display:inline-grid;width:30px;height:30px;border-radius:50%;aspect-ratio:1;font:600 11px "Inter Tight",sans-serif;background:#3b5b7a;color:#fff;vertical-align:middle;margin-right:8px}
</style>`],
    ["Leire Godoy", "Ekhi"],
    ["Leire", "Ekhi"],
  ]);
  fs.writeFileSync(path.join(d, "index.html"), h);
  return h;
}

/* ------------------------------------------------------------------ PEDALA */
/* Tienda de bicis: de Biciprecisión Igartua. Sus fotos eran de su tienda; se
   sustituyen por fotos libres de bicis (Wikimedia Commons, CC BY / CC BY-SA)
   guardadas en fotos-bicis/ con sus créditos. */
async function pedala() {
  const o = path.join(ORIGEN, "biciprecision-igartua"), d = path.join(DESTINO, "pedala-bizikletak");
  const FB = path.resolve("herramientas/sitio/fotos-bicis");
  limpiar(d); fs.mkdirSync(path.join(d, "nueva/fotos"), { recursive: true });
  fs.copyFileSync(path.join(o, "nueva/anim-texto.js"), path.join(d, "nueva/anim-texto.js"));
  const F = path.join(d, "nueva/fotos");
  for (const n of ["cartel", "cartel3"]) await sharp(path.join(FB, n + ".jpg")).resize(1600, 1200, { fit: "cover" }).webp({ quality: 82 }).toFile(path.join(F, n + ".webp"));
  const FICHAS = ["air-race-720", "aero-teamline-720", "thron-720", "ams-hybrid-720", "nuroad-720", "stereo-hybrid-720", "flanders-720", "aero-pro-720"];
  for (const n of FICHAS) await sharp(path.join(FB, n + ".jpg")).resize(720, 540, { fit: "cover", position: "centre" }).webp({ quality: 82 }).toFile(path.join(F, n + ".webp"));
  const cred = JSON.parse(fs.readFileSync(path.join(FB, "creditos.json"), "utf8"));
  const autores = [...new Set(Object.values(cred).map((c) => `${c.autor.replace(/\s+/g, " ").trim().slice(0, 40)} (${c.licencia})`))].join(" · ");
  let h = quitaComentarios(fs.readFileSync(path.join(o, "index.html"), "utf8"));
  const ficha = (num, tipo, nombre, precio, dto, antes, img) => `<a class="bici" href="#visita"><span class="num tec"><span>${num}</span><span>${tipo}</span></span>${dto ? `<span class="dto">${dto}</span>` : ""}<figure><img src="nueva/fotos/${img}.webp" width="720" height="540" alt="" loading="lazy"/></figure><h3>${nombre}</h3><p>${precio}${antes ? `<s>${antes}</s>` : ""}</p></a>`;
  const MODELOS = [["Gravel", "Gravel Marrón 58", "3.690 €", "", ""], ["Carretera", "Aero Rojo Team", "4.190 €", "−15 %", "4.930 €"], ["Eléctrica", "Trail Eléctrica 29", "3.450 €", "", ""], ["Eléctrica", "Montaña Azul 144", "4.150 €", "−25 %", "5.530 €"], ["Gravel", "Gravel Verde Acero", "2.990 €", "−14 %", "3.480 €"], ["Eléctrica", "Urbana Eléctrica", "2.690 €", "", ""], ["Gravel", "Gravel Rosa Carbono", "3.990 €", "−30 %", "5.700 €"], ["Gravel", "Gravel Aventura Pro", "4.390 €", "", ""]];
  const nuevas = MODELOS.map((m, i) => ficha(String(i + 1).padStart(2, "0"), m[0], m[1], m[2], m[3], m[4], FICHAS[i])).join("\n    ");
  h = aplicar(h, [
    [/<a class="bici" href="tel[\s\S]*?<\/a>\s*(?=<\/div>\s*<p class="nota">)/, nuevas + "\n  "],
    [/<p class="nota">[\s\S]*?<\/p>/, '<p class="nota">Modelos y precios de ejemplo. En una web de verdad saldrían de tu catálogo, siempre al día.</p>'],
    [/<title>[^<]*<\/title>/, "<title>Pedala · Tienda de bicis en Gipuzkoa — muestra</title>"],
    [/<meta name="description" content="[^"]*"\/>/, '<meta name="description" content="Tienda de bicis en Gipuzkoa: carretera, gravel y eléctricas, montajes a la carta, ciclocross, biomecánica y segunda mano. Muestra de diseño de OI Studio."/>'],
    [/<p class="aviso">[\s\S]*?<\/p>/, '<p class="aviso">Muestra de diseño creada por OI Studio. El nombre, las bicis y los datos son inventados.</p>'],
    [/<a class="credito tec"[^>]*>[\s\S]*?<\/a>/, '<span class="credito tec">@pedala<br/>www.pedala.example<br/>©2026</span>'],
    [/<h1 class="ancha nombre" aria-label="Igartua"([^>]*)><span aria-hidden="true">ig<\/span>([\s\S]*?)<span aria-hidden="true">rtu<\/span>/, '<h1 class="ancha nombre" aria-label="Pedala"$1><span aria-hidden="true">ped</span>$2<span aria-hidden="true">l</span>'],
    [/<p class="ciudad">Bergara<\/p>/, '<p class="ciudad">Gipuzkoa</p>'],
    [/<p class="frase">[^<]*<\/p>/, '<p class="frase">Pedala · carretera, gravel y eléctricas · montajes a la carta</p>'],
    [/href="tel:\+34943761121"/g, 'href="#visita"'],
    [/943 ?76 ?11 ?21/g, "943 00 00 00"],
    [/<div class="tira" aria-hidden="true"><div class="pista"[^>]*>[\s\S]*?<\/div><\/div>/, '<div class="tira" aria-hidden="true"><div class="pista" data-pista="38">carretera <i>· 01 ·</i> gravel <i>· 02 ·</i> eléctrica <i>· 03 ·</i> montaña <i>· 04 ·</i> ciudad <i>· 05 ·</i> carretera <i>· 01 ·</i> gravel</div></div>'],
    [/alt="Bici de carretera Cube[^"]*"/, 'alt="Bici apoyada en un muro de ladrillo, en blanco y negro"'],
    [/alt="Bici eléctrica de montaña apoyada[^"]*"/, 'alt="Bici eléctrica de montaña, en blanco y negro"'],
    [/<b>Spinning<\/b><span>Bicis entre 500 y 1\.000 €<\/span>/, "<b>Spinning</b><span>Bicis desde 500 €</span>"],
    [/<h2 class="ancha" data-lineas>zubieta 5<\/h2>/, '<h2 class="ancha" data-lineas>kale nagusia 1</h2>'],
    [/<a href="https:\/\/www\.google\.com\/maps\/dir[^>]*><span class="tec">Tienda<\/span><b>[^<]*<\/b><\/a>/, '<a href="#visita"><span class="tec">Tienda</span><b>Kale Nagusia 1, Gipuzkoa</b></a>'],
    [/\s*<a href="tel:\+34688673171">[\s\S]*?<\/a>/, ""],
    [/<a href="mailto:[^"]*"><span class="tec">Correo<\/span><b>[^<]*<\/b><\/a>/, '<a href="mailto:hola@pedala.example"><span class="tec">Correo</span><b>hola@pedala.example</b></a>'],
    [/\s*<div><span class="tec">Google<\/span><b>[^<]*<\/b><\/div>/, ""],
    [/<footer class="pie tec"><div class="wrap"><span>[^<]*<\/span><span>[^<]*<\/span>/, `<footer class="pie tec"><div class="wrap"><span>© Pedala · Gipuzkoa</span><span>Carretera · Gravel · Eléctricas</span></div><div class="wrap" style="margin-top:10px;font-size:11px;opacity:.6;text-transform:none;letter-spacing:0"><span>Fotos: Wikimedia Commons — ${autores}</span>`],
  ]);
  fs.writeFileSync(path.join(d, "index.html"), h);
  return h;
}

/* ------------------------------------------------------------------ ETXEA */
/* Inmobiliaria: ya es una plantilla con marca inventada (Etxea). Se copia tal cual. */
function etxea() {
  const o = path.join(process.cwd(), "_local/material/plantillas/inmobiliaria"), d = path.join(DESTINO, "etxea-inmobiliaria");
  limpiar(d); copiar(o, d);
  const p = path.join(d, "index.html");
  const h = aplicar(fs.readFileSync(p, "utf8"), [
    [/https:\/\/wa\.me\/34600000000(\?text=[^"]*)?/g, "#contacto"],
    [/https:\/\/www\.google\.com\/maps\/[^"]*/g, "#contacto"],
    [/ target="_blank" rel="noopener">(WhatsApp|Calle Ejemplo)/g, ">$1"],
  ]);
  fs.writeFileSync(p, h);
  return h;
}

fs.mkdirSync(DESTINO, { recursive: true });
const resultado = { arin: arin(), ekhi: await ekhi(), pedala: await pedala(), etxea: etxea() };

/* Comprobación: nada del negocio original debe sobrevivir. */
const PROHIBIDO = /CVS|Beasain|613|Esteban|EIBT|KIRO|kiro|Irun|943 ?63|Amostegi|Sosoaga|Aitor|Alex|Eibar|Leire|Godoy|Soroa|psicoleire|Urrutia|Requena|Igartua|igartua|Bergara|Zubieta|[Bb]iciprecisi|\bCube\b|Flanders|\bMassi\b|Moustache|688|@gmail|google\.com\/maps|wa\.me\/346(?!00000000)|instagram\.com\/(?!oi)/;
let limpio = true;
for (const [k, h] of Object.entries(resultado)) {
  h.split("\n").forEach((l, i) => { if (PROHIBIDO.test(l)) { limpio = false; console.log(`  [${k}] línea ${i + 1}: ${l.trim().slice(0, 150)}`); } });
}
console.log(limpio ? "muestras generadas: sin restos de los datos originales ✓" : "¡OJO! quedan restos (arriba)");
