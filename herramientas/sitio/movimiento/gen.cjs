// Rellena la rejilla de la sección «Diseño en movimiento» (#wm de web/trabajos.html) con TODAS las muestras de sector,
// con la misma tarjeta que la galería «¿Qué negocio tienes?» (portada, nombre y sector). Las saca de web/index.html (#tu-sector),
// que escribe herramientas/sitio/sectores/gen.cjs; por eso se lanza después de ese generador (él mismo lo llama al final).
// Las seis primeras son las que vuelan por la hélice y forman la rejilla al llegar: no cambiar su orden sin tocar helice.js.
const fs = require("fs"), path = require("path");
const WEB = path.join(__dirname, "../../../web");
const PRIMERAS = ["irri", "ezki", "tinko", "malda", "zehatz", "txilar"];
const idx = fs.readFileSync(path.join(WEB, "index.html"), "utf8");
const items = [...idx.matchAll(/<li class="sx-t__i"[^>]*>(<a class="sx-c"[\s\S]*?<\/a>)<\/li>/g)].map((m) => m[1]);
if (items.length < 20) throw new Error("No encuentro las tarjetas de #tu-sector en index.html (" + items.length + ")");
const idDe = (a) => (/assets\/sx\/([a-z]+)-c\.webp/.exec(a) || [])[1];
const porId = {}; items.forEach((a) => { porId[idDe(a)] = a; });
const falta = PRIMERAS.filter((id) => !porId[id]);
if (falta.length) throw new Error("Faltan en la galería las muestras de la hélice: " + falta.join(", "));
const orden = PRIMERAS.map((id) => porId[id]).concat(items.filter((a) => !PRIMERAS.includes(idDe(a))));
const f = path.join(WEB, "trabajos.html"); let h = fs.readFileSync(f, "utf8");
const nl = h.includes("\r\n") ? "\r\n" : "\n";
const bloque = '<ul class="wm__g" id="wm-g">' + nl + orden.map((a) => '<li class="wm__i">' + a + "</li>").join(nl) + nl + "</ul>";
const re = /<ul class="wm__g" id="wm-g">[\s\S]*?<\/ul>/;
if (!re.test(h)) throw new Error("No encuentro <ul class=\"wm__g\" id=\"wm-g\"> en trabajos.html");
const n = h.replace(re, bloque);
if (n !== h) fs.writeFileSync(f, n);
console.log("«Diseño en movimiento»: " + orden.length + " muestras en la rejilla" + (n !== h ? " (trabajos.html actualizado)" : " (sin cambios)"));
