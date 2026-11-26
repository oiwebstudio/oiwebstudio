// Inicio de la portada (Oier 23/11 y 26/11: «la otra versión que trabajamos, publícalo»; referencia: dixonbaxi.com).
// Escribe en web/index.html la cabecera de cabecera.html con la fila de webs, que sale de la lista de la página Webs
// (web/trabajos.html, la que genera herramientas/sitio/movimiento/gen.cjs). Se puede ejecutar las veces que haga falta:
//   node herramientas/sitio/inicio/gen.cjs          escribe
//   node herramientas/sitio/inicio/gen.cjs --check  solo dice si hay algo que cambiar
// Después de añadir una web a la página Webs hay que volver a ejecutarlo para que salga en la fila.
const fs = require("fs"), path = require("path");
const WEB = path.resolve(__dirname, "../../../web");
const V_CSS = 1, V_JS = 2;   // subir al cambiar assets/inicio.css o assets/inicio.js

// Orden de la fila (Oier 23/11: «pon otras webs más bonitas, como Bigun, la de inmobiliaria moderna y así»).
// DELANTE: lo que se ve al abrir (la primera asoma cortada por la izquierda). DETRAS: lo que aparece al arrastrar
// hacia la derecha, de más cerca a más lejos. Las webs nuevas sin colocar quedan en medio de la vuelta.
const DELANTE = ["zirkin", "bigun", "etxea", "leiho", "uztai", "ahamen", "lauza", "orea", "hiria", "artile", "aberri",
  "aihen", "lorratz", "txilar", "behako", "orrazkera", "gantxo", "errotatxo", "zehatz", "hauspo", "atzapar", "lerro", "pedala", "ekhi", "malda"];
const DETRAS = ["arin", "gainetik", "laino", "itun", "uhal", "hari", "irri", "ezki", "tinko", "malgu", "iltze", "erpin", "maila", "agiri"];
// Muestras antiguas cuya captura lleva arriba la franja «Página de muestra…»: la portada se encuadra un poco más abajo
const CON_AVISO = ["bigun", "pedala", "ekhi"];

const idDe = (li) => (li.match(/assets\/sx\/([a-z]+)-c\.webp/) || [])[1];
function ordenar(lis) {
  const por = {}; lis.forEach(li => { por[idDe(li)] = li; });
  const fin = DETRAS.slice().reverse().filter(id => por[id]), ini = DELANTE.filter(id => por[id]);
  const resto = lis.filter(li => !ini.includes(idDe(li)) && !fin.includes(idDe(li)));
  return ini.map(id => por[id]).concat(resto, fin.map(id => por[id]));
}
function tarjetas() {
  const h = fs.readFileSync(path.join(WEB, "trabajos.html"), "utf8");
  const lis = ordenar(h.match(/<li class="wm__i">[\s\S]*?<\/li>/g) || []);
  if (lis.length < 12) throw new Error("La página Webs solo da " + lis.length + " webs: no escribo la fila");
  return lis.map((li, i) => {
    const href = (li.match(/href="([^"]+)"/) || [])[1];
    const id = idDe(li);
    const nombre = (li.match(/sx-c__n">([^<]+)</) || [])[1];
    const s = li.match(/sx-c__s" data-t="([a-z0-9_]+)">([^<]+)</) || [];
    if (!href || !id || !nombre || !s[1]) throw new Error("No entiendo esta web de la lista: " + li.slice(0, 120));
    const propia = fs.existsSync(path.join(WEB, "assets/hero", id + "-m.webp"));
    const img = propia ? "assets/hero/" + id + "-m.webp" : "assets/" + id + "-mobile.webp";
    if (!fs.existsSync(path.join(WEB, img))) throw new Error("Falta la portada " + img);
    const fuera = /^caso-/.test(href) ? "" : ' target="_blank" rel="noopener"';
    let r = 0; while (fs.existsSync(path.join(WEB, "assets/inicio", id + "-" + (r + 1) + ".webp"))) r++; // pantallas para la ráfaga al pasar el ratón
    return '<li class="ini__s"><a class="ini__c" href="' + href + '"' + fuera + ' data-id="' + id + '" data-r="' + r + '" draggable="false"><span class="ini__in"><img src="' + img + '" alt="" width="480" height="1013" decoding="async" draggable="false"' + (CON_AVISO.includes(id) ? ' style="object-position:50% 13%"' : '') + (i < 9 ? ' fetchpriority="' + (i < 3 ? "high" : "auto") + '"' : ' loading="lazy"') + '/><span class="ini__et"><span class="sr-only">' + nombre + ' · </span><span data-t="' + s[1] + '">' + s[2] + "</span></span></span></a></li>";
  }).join("\n");
}

const f = path.join(WEB, "index.html");
const antes = fs.readFileSync(f, "utf8");
const cab = fs.readFileSync(path.join(__dirname, "cabecera.html"), "utf8").trim().replace("<!--TARJETAS-->", () => tarjetas());
let h = antes;

// 1) La cabecera: la primera vez sustituye a la de la mano; después, a sí misma
const viejo = /<!-- HERO:[\s\S]*?<\/header>/, nuevo = /<!-- INICIO:[\s\S]*?<\/header>/;
if (nuevo.test(h)) h = h.replace(nuevo, () => cab);
else if (viejo.test(h)) h = h.replace(viejo, () => cab);
else throw new Error("No encuentro la cabecera de la portada en index.html");

// 2) Lo que ya no hace falta: la barra de accesos (Oier 23/11: no le gusta) y la precarga de la foto de la mano
h = h.replace(/[ \t]*<!-- Accesos a las partes de la portada -->[\s\S]*?<\/nav>\r?\n?/, "");
h = h.replace(/[ \t]*<link rel="preload" as="image" type="image\/avif" href="\/assets\/hero\/mano-520\.avif"[^>]*>\r?\n?/, "");

// 3) Estilos (los últimos de la cabeza, para que manden sobre portada.css) y script (después del asistente)
const css = '<link rel="stylesheet" href="assets/inicio.css?v=' + V_CSS + '"/>';
h = h.replace(/[ \t]*<link rel="stylesheet" href="assets\/inicio\.css\?v=\d+"\/>\r?\n?/, "");
h = h.replace(/<\/head>/i, css + "\n</head>");
const js = '<script src="assets/inicio.js?v=' + V_JS + '" defer></script>';
h = h.replace(/[ \t]*<script src="assets\/inicio\.js\?v=\d+" defer><\/script>\r?\n?/, "");
const asis = /(<script src="\/assets\/js\/oi-asistente\.js\?v=)\d+("[^>]*><\/script>)/;
if (!asis.test(h)) throw new Error("No encuentro el script del asistente en index.html");
h = h.replace(asis, (m, a, b) => a + "2" + b + "\n" + js);   // v=2: el asistente gana «preguntar(texto)»

if (h === antes) { console.log("Inicio: index.html ya está al día"); process.exit(0); }
if (process.argv.includes("--check")) { console.log("Inicio: index.html cambiaría (ejecuta sin --check)"); process.exit(1); }
fs.writeFileSync(f, h);
console.log("Inicio escrito en web/index.html · " + (cab.match(/class="ini__s"/g) || []).length + " webs en la fila");
