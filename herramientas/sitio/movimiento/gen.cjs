// Rellena la rejilla de la sección «Diseño en movimiento» (#wm de web/trabajos.html) con TODAS las muestras de sector,
// con la misma tarjeta que la galería «¿Qué negocio tienes?» (portada, nombre y sector). Las saca de web/index.html (#tu-sector),
// que escribe herramientas/sitio/sectores/gen.cjs; por eso se lanza después de ese generador (él mismo lo llama al final).
// Las seis primeras son las que vuelan por la hélice y forman la rejilla al llegar: no cambiar su orden sin tocar helice.js.
const fs = require("fs"), path = require("path");
const WEB = path.join(__dirname, "../../../web");
const PRIMERAS = ["errotatxo", "aberri", "tinko", "malda", "zehatz", "txilar"];
// Además de las muestras de sector: los dos casos reales (van los primeros, con las demás: Oier 14/11 «no los diferencies, ponlos juntos»)
// y las muestras anteriores que no son de un sector de la galería. Están en extras.json.
const EXTRAS = JSON.parse(fs.readFileSync(path.join(__dirname, "extras.json"), "utf8"));
const tarjeta = (e) => `<a class="sx-c" href="${e.href}"${e.nueva === false ? "" : ' target="_blank" rel="noopener"'}><span class="sx-c__img"><img src="assets/sx/${e.id}-c.webp" alt="" width="640" height="400" loading="lazy" decoding="async"/><span class="sx-c__abre" aria-hidden="true" data-t="${e.claveAbre || "sx_ver"}">${e.abre || "Ver la muestra"}</span></span><span class="sx-c__pie"><span class="sx-c__n">${e.nombre}</span><span class="sx-c__s" data-t="${e.clave}">${e.sector}</span></span></a>`;
const idx = fs.readFileSync(path.join(WEB, "index.html"), "utf8");
const items = [...idx.matchAll(/<li class="sx-t__i"[^>]*>(<a class="sx-c"[\s\S]*?<\/a>)<\/li>/g)].map((m) => m[1]);
if (items.length < 20) throw new Error("No encuentro las tarjetas de #tu-sector en index.html (" + items.length + ")");
const idDe = (a) => (/assets\/sx\/([a-z]+)-c\.webp/.exec(a) || [])[1];
const porId = {}; items.forEach((a) => { porId[idDe(a)] = a; });
const extras = EXTRAS.filter((e) => !porId[e.id]).map((e) => { const a = tarjeta(e); porId[e.id] = a; return a; });
const falta = PRIMERAS.filter((id) => !porId[id]);
if (falta.length) throw new Error("Faltan en la galería las muestras de la hélice: " + falta.join(", "));
const orden = PRIMERAS.map((id) => porId[id]).concat(items.concat(extras).filter((a) => !PRIMERAS.includes(idDe(a))));
const f = path.join(WEB, "trabajos.html"); let h = fs.readFileSync(f, "utf8");
const nl = h.includes("\r\n") ? "\r\n" : "\n";
const bloque = '<ul class="wm__g" id="wm-g">' + nl + orden.map((a) => '<li class="wm__i">' + a + "</li>").join(nl) + nl + "</ul>";
const re = /<ul class="wm__g" id="wm-g">[\s\S]*?<\/ul>/;
if (!re.test(h)) throw new Error("No encuentro <ul class=\"wm__g\" id=\"wm-g\"> en trabajos.html");
const n = h.replace(re, bloque);
// el número del botón de la cabecera
const n2 = n.replace(/(<b id="wm-n">)\d+(<\/b>)/, "$1" + orden.length + "$2");
if (n2 !== h) fs.writeFileSync(f, n2);
console.log("«Diseño en movimiento»: " + orden.length + " muestras en la rejilla" + (n2 !== h ? " (trabajos.html actualizado)" : " (sin cambios)"));
