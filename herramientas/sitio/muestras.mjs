/**
 * Muestras del portfolio con marca inventada.
 *
 * Las demos de web/demos/clientes/ están hechas para negocios reales: llevan su
 * nombre, teléfono, dirección, opiniones de Google y, a veces, fotos suyas. Para
 * enseñar el trabajo en la web pública sin problemas, este script copia tres de
 * ellas a web/demos/muestras/ cambiando todo lo que identifica al negocio:
 *
 *   CVS (electricista, Beasain)   -> LUX Elektrikoak (Goierri)
 *   KIRO (fisioterapia, Irun)     -> ARIN Fisioterapia (Gipuzkoa)
 *   Alex (bar restaurante, Eibar) -> Mara Jatetxea (Gipuzkoa)
 *
 * Nombres, teléfono (943 00 00 00), correo (.example), dirección, opiniones y
 * valoraciones se sustituyen; las fotos que eran del negocio se cambian por
 * fotos de Unsplash que ya estaban en cada demo o en assets/stock.
 *
 * Uso: node herramientas/sitio/muestras.mjs
 * Al terminar imprime lo que haya quedado de los datos originales: debe salir vacío.
 */
import fs from "node:fs";
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

/* ------------------------------------------------------------------- LUX */
function lux() {
  const o = path.join(ORIGEN, "cvs-instalazio-elektrikoak/v3"), d = path.join(DESTINO, "lux-elektrikoak");
  limpiar(d); copiar(o, d);
  fs.copyFileSync(path.join(d, "fotos/prueba-cuadro.jpg"), path.join(d, "fotos/cuadro.jpg"));
  fs.rmSync(path.join(d, "fotos/cuadro-suyo.jpg"));
  let h = quitaComentarios(fs.readFileSync(path.join(d, "index.html"), "utf8"));
  h = comunes(h, { tel: [[/613 ?26 ?82 ?12/g, "943 00 00 00"], ["+34613268212", "+34943000000"]] });
  h = aplicar(h, [
    ["Calle Esteban Lasa 9, 20200 Beasain", "Calle Mayor 1, Goierri (Gipuzkoa)"],
    [/cvs\.instalaciones\.electricas@gmail\.com/g, "hola@lux-elektrikoak.example"],
    ["CVS Instalazio Elektrikoak · Beasain, Gipuzkoa · Empresa habilitada en baja tensión 20/EIBT-1827", "LUX Elektrikoak · Goierri, Gipuzkoa · Empresa habilitada en baja tensión"],
    ["Empresa habilitada en baja tensión · n.º 20/EIBT-1827", "Empresa habilitada en baja tensión"],
    ["Empresa habilitada · BT 20/EIBT-1827", "Empresa habilitada · BT"],
    ["<b>20/EIBT-1827</b>", "<b>BT</b>"],
    ["20/EIBT-1827", "BT"],
    ["· BT BT", "· BT"],
    [/<div class="cristal"><b data-cuenta="4\.8">4,8<\/b>[\s\S]*?<\/div><\/div>/, '<div class="cristal"><b>24 h</b><div><span style="color:var(--amarillo);letter-spacing:.12em;font-size:13px">URGENCIAS</span><small>Presupuesto sin compromiso</small></div></div>'],
    ["<span>C</span><span>V</span><span>S</span>", "<span>L</span><span>U</span><span>X</span>"],
    ["CVS Instalazio Elektrikoak", "LUX Elektrikoak"],
    ["CVS Elektrikoak", "LUX Elektrikoak"],
    ["CVS · BT", "LUX · BT"],
    [/CVS <small>/g, "LUX <small>"],
    ["fotos/cuadro-suyo.jpg", "fotos/cuadro.jpg"],
    [/Beasain/g, "Goierri"],
    [/Mapa: calle Esteban Lasa 9, Goierri/g, "Mapa de Gipuzkoa"],
  ]);
  fs.writeFileSync(path.join(d, "index.html"), h);
  return h;
}

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

/* ------------------------------------------------------------------ MARA */
function mara() {
  const o = path.join(ORIGEN, "alex-jatetxea/v2"), d = path.join(DESTINO, "mara-jatetxea");
  limpiar(d); copiar(o, d);
  const sharpless = (de, a) => fs.copyFileSync(de, path.join(d, "fotos", a));
  sharpless(path.join(STOCK, "sec-cafe-3.jpg"), "barra.jpg");
  sharpless(path.join(d, "fotos/carne.jpg"), "chuleton.jpg");
  sharpless(path.join(STOCK, "sec-rest-1.jpg"), "cocktail.jpg");
  for (const x of ["barra.png", "chuleton.png", "mojito.png"]) fs.rmSync(path.join(d, "fotos", x));
  let h = quitaComentarios(fs.readFileSync(path.join(d, "index.html"), "utf8"));
  h = comunes(h, { tel: [[/608 ?85 ?91 ?88/g, "943 00 00 00"], ["+34608859188", "+34943000000"]], wa: [[/https:\/\/wa\.me\/34943000000\?text=/g, "#contacto?text="], [/https:\/\/wa\.me\/34943000000/g, "#contacto"]] });
  h = aplicar(h, [
    [/<title>[^<]*<\/title>/, "<title>Mara Jatetxea — Bar restaurante en Gipuzkoa</title>"],
    [/<meta name="description" content="[^"]*"\/>/, '<meta name="description" content="Bar restaurante en Gipuzkoa. Cocina casera, chuletón y plato combinado de 14 € con bebida y postre de lunes a viernes."/>'],
    [/<div class="cristal"><b>4,4<\/b>[\s\S]*?<\/div><\/div>/, '<div class="cristal"><b>14 €</b><div><span style="color:var(--amarillo);letter-spacing:.12em;font-size:13px">MENÚ DEL DÍA</span><small>Combinado, bebida y postre</small></div></div>'],
    ["Bar restaurante · Ego-Gain 10, Eibar", "Bar restaurante · Gipuzkoa"],
    ["<span>A</span><span>l</span><span>e</span><span>x</span>", "<span>M</span><span>a</span><span>r</span><span>a</span>"],
    ["Ego-Gain Kalea, 10 · 20600 Eibar, Gipuzkoa", "Kale Nagusia, 1 · Gipuzkoa"],
    ["Ego-Gain Kalea 10, 20600 Eibar", "Kale Nagusia 1, Gipuzkoa"],
    ["Alex <small>Jatetxea · Eibar</small>", "Mara <small>Jatetxea · Gipuzkoa</small>"],
    [/baralexrestaurante@gmail\.com/g, "hola@mara-jatetxea.example"],
    ["Mapa: Ego-Gain 10, Eibar", "Mapa de Gipuzkoa"],
    [/fotos\/barra\.png/g, "fotos/barra.jpg"],
    [/fotos\/chuleton\.png/g, "fotos/chuleton.jpg"],
    [/fotos\/mojito\.png/g, "fotos/cocktail.jpg"],
    [/Alex Jatetxea/g, "Mara Jatetxea"],
    [/Alex/g, "Mara"],
    [/Ego-Gain/g, "Kale Nagusia"],
    [/\bEibar\b/g, "Gipuzkoa"],
  ]);
  fs.writeFileSync(path.join(d, "index.html"), h);
  return h;
}

fs.mkdirSync(DESTINO, { recursive: true });
const resultado = { lux: lux(), arin: arin(), mara: mara() };

/* Comprobación: nada del negocio original debe sobrevivir. */
const PROHIBIDO = /CVS|cvs|Beasain|613|Esteban|EIBT|Nagore|Olga G|Lourdes|KIRO|kiro|Irun|943 ?63|Amostegi|Sosoaga|Aitor|Lucía H|Ana B\.|San Pedro|Alex|Ego-Gain|Eibar|608|Steven|baralex|@gmail|google\.com\/maps|wa\.me\/346/;
let limpio = true;
for (const [k, h] of Object.entries(resultado)) {
  h.split("\n").forEach((l, i) => { if (PROHIBIDO.test(l)) { limpio = false; console.log(`  [${k}] línea ${i + 1}: ${l.trim().slice(0, 150)}`); } });
}
console.log(limpio ? "muestras generadas: sin restos de los datos originales ✓" : "¡OJO! quedan restos (arriba)");
