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
/* Psicología: de la demo de Leire Godoy. Las fotos de las personas se quitan
   (retratos reales): el equipo lleva monogramas y la portada una foto libre. */
function ekhi() {
  const o = path.join(process.cwd(), "_local/demos/leire-godoy"), d = path.join(DESTINO, "ekhi-psikologia");
  limpiar(d); fs.mkdirSync(path.join(d, "fotos"), { recursive: true });
  fs.copyFileSync(path.join(WEB, "assets/stock/sec-flor-1.jpg"), path.join(d, "fotos/_flor.jpg"));
  return sharp(path.join(d, "fotos/_flor.jpg")).resize(949, 1111, { fit: "cover" }).webp({ quality: 80 }).toFile(path.join(d, "fotos/portada.webp"))
    .then(() => sharp(path.join(d, "fotos/_flor.jpg")).resize(949, 1111, { fit: "cover" }).jpeg({ quality: 84 }).toFile(path.join(d, "fotos/portada.jpg")))
    .then(() => {
      fs.rmSync(path.join(d, "fotos/_flor.jpg"));
      let h = quitaComentarios(fs.readFileSync(path.join(o, "index.html"), "utf8"));
      const EQ = [["leire", "Ainhoa Etxeberria", "AE", "Trauma y apego · IFS · EMDR", "Psicóloga general sanitaria. Formada en neuropsicología, EMDR, IFS y AEDP."],
        ["laura", "Maite Olano", "MO", "Familia y pareja", "Psicóloga general sanitaria, especializada en terapia familiar y de pareja. Acompaña también a menores y familias."],
        ["elena", "Nerea Sagarna", "NS", "Trauma, apego · EMDR · IFS", "Psicóloga sanitaria con formación en trauma, apego y psicología jurídica y forense."],
        ["ane", "Uxue Lizarraga", "UL", "Ansiedad, depresión · niños y adolescentes", "Psicóloga clínica. Atiende a niños, adolescentes y adultos, en castellano y en inglés."]];
      // equipo: monogramas en vez de fotos
      for (const [k, nombre, ini, rol, txt] of EQ) {
        h = h.replace(new RegExp(`<article class="rev"><picture><source type="image/avif" srcset="fotos/${k}-480\\.avif"/>[\\s\\S]*?</article>`), `<article class="rev"><div class="mono" aria-hidden="true">${ini}</div><h3>${nombre}</h3><p class="rol">${rol}</p><p>${txt}</p></article>`);
      }
      h = aplicar(h, [
        [/var EQ = \{[^}]*\};/, `var EQ = { leire: "Ainhoa Etxeberria", laura: "Maite Olano", elena: "Nerea Sagarna", ane: "Uxue Lizarraga" }, INI = { leire: "AE", laura: "MO", elena: "NS", ane: "UL" };`],
        [`'<span><img src="fotos/' + n + '-480.webp" alt="" width="32" height="32"/>' + EQ[n] + "</span>"`, `'<span><i class="mono mono--s" aria-hidden="true">' + INI[n] + "</i>" + EQ[n] + "</span>"`],
        [/<div role="region" aria-label="Aviso"><p class="aviso">[\s\S]*?<\/p><\/div>/, `<div role="region" aria-label="Aviso"><p class="aviso">Muestra de diseño creada por OI Studio: el nombre, las personas y los datos son inventados.</p></div>`],
        [/<picture><source type="image\/avif" srcset="fotos\/leire-480\.avif 480w[\s\S]*?<\/picture>/, `<picture><source type="image/webp" srcset="fotos/portada.webp"/><img src="fotos/portada.jpg" width="949" height="1111" alt="Ramo de flores rosas en cubos de zinc" fetchpriority="high"/></picture>`],
        [`<figcaption><b>Leire Godoy</b> · psicóloga general sanitaria</figcaption>`, `<figcaption><b>Ekhi Psicología</b> · consulta presencial y online</figcaption>`],
        [/<a class="nota" href="[^"]*"[^>]*>[\s\S]*?<\/a>/, `<a class="nota" href="#sesiones"><b>50 min</b><span>por sesión<br/>primera consulta sin compromiso</span></a>`],
        [/https:\/\/wa\.me\/34688697602(\?text=)?/g, (m, q) => (q ? "#contacto?text=" : "#contacto")],
        [/tel:\+34688697602/g, "tel:+34943000000"],
        [/688 ?69 ?76 ?02/g, "943 00 00 00"],
        [/mailto:leiregodoypsicologia@gmail\.com/g, "mailto:hola@ekhi-psikologia.example"],
        [/leiregodoypsicologia@gmail\.com/g, "hola@ekhi-psikologia.example"],
        [/<a href="https:\/\/www\.google\.com\/maps\/dir[^>]*>(<span>Consulta<\/span>)<b>[^<]*<\/b><\/a>/, `<a href="#contacto">$1<b>Calle Mayor 1, Donostia</b></a>`],
        [/\s*<a href="https:\/\/www\.instagram\.com\/psicoleire\/"[\s\S]*?<\/a>/, ""],
        [/<title>[^<]*<\/title>/, "<title>Ekhi Psicología · Donostia y online — muestra</title>"],
        [/<meta name="description" content="[^"]*"\/>/, `<meta name="description" content="Psicólogas en Donostia y online especializadas en trauma, apego, ansiedad, terapia de pareja y familia. Muestra de diseño creada por OI Studio."/>`],
        [/<a class="marca" href="#inicio">Leire Godoy<small>/, `<a class="marca" href="#inicio">Ekhi<small>`],
        [/© Leire Godoy Psicología · Donostia/, "© Ekhi Psicología · Donostia"],
        [/Idiomas<\/dt><dd>Castellano, e inglés con Ane/, "Idiomas</dt><dd>Castellano, e inglés con Uxue"],
        [/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, ""],
        [/<\/style>/, `.mono{display:grid;place-items:center;width:100%;aspect-ratio:3/4;border-radius:18px;background:var(--marca-suave);color:var(--marca);font:400 clamp(44px,7vw,84px)/1 Literata,serif;letter-spacing:-.02em;outline:1px solid var(--regla);outline-offset:-1px}
.quien .mono.mono--s{width:32px;height:32px;aspect-ratio:1;border-radius:50%;font-size:12px;font-weight:600;letter-spacing:0;font-family:"Instrument Sans",sans-serif;background:var(--marca);color:var(--sobre-marca);outline:0}
</style>`],
        ["Leire Godoy", "Ekhi"],
      ]);
      fs.writeFileSync(path.join(d, "index.html"), h);
      return h;
    });
}

/* ------------------------------------------------------------------ PEDALA */
/* Tienda de bicis: de Biciprecisión Igartua. Las fotos eran de su tienda, así
   que se sustituyen por ilustraciones de línea dibujadas aquí. */
const dibujaBici = (tipo, { fondo, trazo, w = 720, h = 540 }) => {
  const R = tipo === "mtb" ? 100 : tipo === "gravel" ? 98 : 94;
  const bb = [335, 330], rear = [185, 330], front = [tipo === "mtb" ? 590 : 565, 330];
  const seat = tipo === "mtb" ? [292, 185] : [296, 168], head = tipo === "mtb" ? [498, 198] : [488, 182], headB = [head[0] + 14, head[1] + 42];
  const ln = (a, b, extra = "") => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" ${extra}/>`;
  const rueda = (c) => `<circle cx="${c[0]}" cy="${c[1]}" r="${R}"/><circle cx="${c[0]}" cy="${c[1]}" r="${R - 12}" stroke-opacity=".45"/><circle cx="${c[0]}" cy="${c[1]}" r="6" fill="${trazo}"/>`;
  const manillar = tipo === "city" ? `<path d="M${head[0] - 6} ${head[1] - 22} h26 m-13 0 v22"/>` : `<path d="M${head[0] - 4} ${head[1] - 24} c24 -4 38 6 34 24 c-3 12 -16 14 -22 6"/>`;
  const extra = tipo === "mtb" ? `<path d="M${bb[0] - 4} ${bb[1] - 14} L${headB[0] - 24} ${headB[1] - 6}" stroke-width="22" stroke-opacity=".55"/><rect x="${bb[0] - 28}" y="${bb[1] - 22}" width="46" height="26" rx="9" fill="${trazo}" fill-opacity=".85" stroke="none"/>` : tipo === "gravel" ? `<path d="M${rear[0]} ${rear[1] - R - 14} h70 M${front[0] - 60} ${front[1] - R - 14} h66" stroke-opacity=".5"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 720 540"><rect width="720" height="540" fill="${fondo}"/><g transform="translate(0 28)" fill="none" stroke="${trazo}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">${rueda(rear)}${rueda(front)}${ln(rear, bb)}${ln(rear, seat)}${ln(bb, seat)}${ln(seat, head)}${ln(bb, headB)}${ln(head, headB)}${ln(headB, front)}${extra}<path d="M${seat[0] - 8} ${seat[1] - 18} h38 M${seat[0] + 4} ${seat[1] - 18} L${seat[0] + 4} ${seat[1]}" stroke-width="8"/>${manillar}<circle cx="${bb[0]}" cy="${bb[1]}" r="16"/><path d="M${bb[0] - 30} ${bb[1] + 18} L${bb[0] + 30} ${bb[1] - 18}" stroke-width="6"/></g></svg>`;
};
async function pedala() {
  const o = path.join(ORIGEN, "biciprecision-igartua"), d = path.join(DESTINO, "pedala-bizikletak");
  limpiar(d); fs.mkdirSync(path.join(d, "nueva/fotos"), { recursive: true });
  fs.copyFileSync(path.join(o, "nueva/anim-texto.js"), path.join(d, "nueva/anim-texto.js"));
  // ilustraciones (cartel grande + 8 fichas)
  const F = path.join(d, "nueva/fotos");
  const guarda = async (nombre, svg, w, h) => { await sharp(Buffer.from(svg)).resize(w, h).webp({ quality: 84 }).toFile(path.join(F, nombre + ".webp")); };
  const carteles = [["cartel", "road", "#3a3a37", "#e9e9e4"], ["cartel3", "mtb", "#2c2c2a", "#dcdcd6"]];
  for (const [n, t, f, tr] of carteles) {
    const svg = dibujaBici(t, { fondo: f, trazo: tr }).replace('translate(0 28)', "translate(-40 -20) scale(1.2)").replace('viewBox="0 0 720 540"', 'viewBox="0 0 720 540" preserveAspectRatio="xMidYMid slice"');
    await sharp(Buffer.from(svg)).resize(1600, 1200).webp({ quality: 82 }).toFile(path.join(F, n + ".webp"));
  }
  const fichas = [["air-race-720", "road", "#e6e6e1", "#1c1c1a"], ["aero-teamline-720", "road", "#d9d9d3", "#222220"], ["thron-720", "mtb", "#ececE8", "#1c1c1a"], ["ams-hybrid-720", "mtb", "#d6d6d0", "#262624"], ["nuroad-720", "gravel", "#e2e2dc", "#1d1d1b"], ["stereo-hybrid-720", "mtb", "#dededa", "#222220"], ["flanders-720", "road", "#cfcfc9", "#1c1c1a"], ["aero-pro-720", "road", "#e9e9e4", "#242422"]];
  for (const [n, t, f, tr] of fichas) await guarda(n, dibujaBici(t, { fondo: f, trazo: tr }), 720, 540);
  let h = quitaComentarios(fs.readFileSync(path.join(o, "index.html"), "utf8"));
  const ficha = (num, tipo, nombre, precio, dto, antes) => `<a class="bici" href="#visita"><span class="num tec"><span>${num}</span><span>${tipo}</span></span>${dto ? `<span class="dto">${dto}</span>` : ""}<figure><img src="nueva/fotos/__IMG__.webp" width="720" height="540" alt="" loading="lazy"/></figure><h3>${nombre}</h3><p>${precio}${antes ? `<s>${antes}</s>` : ""}</p></a>`;
  const MODELOS = [["Carretera", "Aero 68 Race", "4.990 €", "", ""], ["Carretera", "Aero 68 Team", "4.190 €", "−15 %", "4.930 €"], ["Eléctrica", "Trail Eléctrica 6.6", "3.450 €", "", ""], ["Eléctrica", "Enduro Eléctrica 144", "4.150 €", "−25 %", "5.530 €"], ["Gravel", "Gravel Carbono 62", "3.990 €", "−14 %", "4.640 €"], ["Eléctrica", "Montaña Eléctrica 144", "4.690 €", "", ""], ["Carretera", "Clásica Pro", "2.990 €", "−30 %", "4.270 €"], ["Carretera", "Aero 68 Pro", "4.390 €", "", ""]];
  const IMG = ["air-race-720", "aero-teamline-720", "thron-720", "ams-hybrid-720", "nuroad-720", "stereo-hybrid-720", "flanders-720", "aero-pro-720"];
  const nuevas = MODELOS.map((m, i) => ficha(String(i + 1).padStart(2, "0"), m[0], m[1], m[2], m[3], m[4]).replace("__IMG__", IMG[i])).join("\n    ");
  h = aplicar(h, [
    [/<a class="bici" href="tel[\s\S]*?<\/a>\s*(?=<\/div>\s*<p class="nota">)/, nuevas + "\n  "],
    [/<p class="nota">[\s\S]*?<\/p>/, '<p class="nota">Modelos, ilustraciones y precios de ejemplo. En una web de verdad saldrían de tu catálogo, siempre al día.</p>'],
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
    [/alt="Bici de carretera Cube[^"]*"/, 'alt="Ilustración de una bici de carretera"'],
    [/alt="Bici eléctrica de montaña apoyada[^"]*"/, 'alt="Ilustración de una bici eléctrica de montaña"'],
    [/<span>Spinning<\/span>|<b>Spinning<\/b><span>Bicis entre 500 y 1\.000 €<\/span>/, "<b>Spinning</b><span>Bicis desde 500 €</span>"],
    [/<h2 class="ancha" data-lineas>zubieta 5<\/h2>/, '<h2 class="ancha" data-lineas>kale nagusia 1</h2>'],
    [/<a href="https:\/\/www\.google\.com\/maps\/dir[^>]*><span class="tec">Tienda<\/span><b>[^<]*<\/b><\/a>/, '<a href="#visita"><span class="tec">Tienda</span><b>Kale Nagusia 1, Gipuzkoa</b></a>'],
    [/\s*<a href="tel:\+34688673171">[\s\S]*?<\/a>/, ""],
    [/<a href="mailto:[^"]*"><span class="tec">Correo<\/span><b>[^<]*<\/b><\/a>/, '<a href="mailto:hola@pedala.example"><span class="tec">Correo</span><b>hola@pedala.example</b></a>'],
    [/\s*<div><span class="tec">Google<\/span><b>[^<]*<\/b><\/div>/, ""],
    [/<footer class="pie tec"><div class="wrap"><span>[^<]*<\/span><span>[^<]*<\/span>/, '<footer class="pie tec"><div class="wrap"><span>© Pedala · Gipuzkoa</span><span>Carretera · Gravel · Eléctricas</span>'],
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
