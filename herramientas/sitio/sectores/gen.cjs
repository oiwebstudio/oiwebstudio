// Monta la pieza «¿Qué negocio tienes?» (#tu-sector) de web/index.html y web/trabajos.html a partir de:
//   existentes.json  los 8 sectores de siempre, con sus claves data-t de siempre
//   nuevos.json      las muestras de sector nuevas (8/11/2026), con eu.json traducido por itzuli.cjs (Itzultzaile)
// y escribe el euskera de los nuevos en web/assets/i18n.js entre las marcas «sx-sectores-nuevos».
// Un sector solo entra si tiene su muestra (web/demos/muestras/<carpeta>/es/), sus miniaturas y su euskera.
// Después hay que pasar herramientas/sitio/generar-euskera.mjs para que /eu/ lo lleve.
// Uso: node herramientas/sitio/sectores/gen.cjs [--check]
const fs = require("fs");
const path = require("path");
const { nuevos, LETRAS, UI } = require("./textos.cjs");
const { I18N } = require("./diccionario.cjs");

const RAIZ = path.resolve(__dirname, "../../..");
const WEB = path.join(RAIZ, "web");
const PAGINAS = ["index.html", "trabajos.html"];
const CHECK = process.argv.includes("--check");

// Orden de los botones, por tipo de negocio: comer y beber · cuidarse · tiendas · casa y oficios · dormir · despachos y clases.
const ORDEN = [
  "restaurante", "bar", "sidreria", "panaderia", "carniceria", "bodega",
  "peluqueria", "estetica", "gimnasio", "dentista", "fisioterapia", "optica", "podologia", "veterinaria", "peluqueriacanina",
  "tienda", "floristeria", "joyeria", "ferreteria",
  "taller", "reformas", "instalador", "industria",
  "casarural", "hotel",
  "abogados", "asesoria", "academia", "musica",
];
const SLUG_EXISTENTES = { hauspo: "restaurante", ahamen: "bar", orrazkera: "peluqueria", bigun: "estetica", torloju: "taller", urdin: "dentista", arin: "fisioterapia", artile: "tienda" };

const EU_NUEVOS = JSON.parse(fs.readFileSync(path.join(__dirname, "eu.json"), "utf8"));
const avisos = [];
const sectores = {};
for (const s of JSON.parse(fs.readFileSync(path.join(__dirname, "existentes.json"), "utf8"))) {
  sectores[SLUG_EXISTENTES[s.id]] = { ...s, slug: SLUG_EXISTENTES[s.id] };
}
for (const s of nuevos()) {
  const t = (key, es) => ({ key, es, eu: EU_NUEVOS[key] || null });
  const sec = {
    id: s.id, nombre: s.nombre, carpeta: s.carpeta, slug: s.slug, enlace: `demos/muestras/${s.carpeta}/es/`, nuevo: true,
    chip: t(`sx_c_${s.slug}`, s.chip), k: t(`sx_k_${s.slug}`, s.k),
    lleva: s.lleva.map((x, i) => t(`sx_${s.slug}_${LETRAS[i]}`, x)),
  };
  const falta = [];
  if (!fs.existsSync(path.join(WEB, "demos/muestras", s.carpeta, "es/index.html"))) falta.push("muestra es/");
  if (!fs.existsSync(path.join(WEB, "demos/muestras", s.carpeta, "index.html"))) falta.push("muestra eu");
  for (const f of [`assets/${s.id}-desk.webp`, `assets/${s.id}-desk.jpg`, `assets/hero/${s.id}-m.webp`]) if (!fs.existsSync(path.join(WEB, f))) falta.push(f);
  for (const x of [sec.chip, sec.k, ...sec.lleva]) if (!x.eu) falta.push("euskera " + x.key);
  if (!ORDEN.includes(s.slug)) falta.push(`slug «${s.slug}» fuera de ORDEN`);
  if (falta.length) { avisos.push(`${s.nombre}: fuera (${falta.join(", ")})`); continue; }
  sectores[s.slug] = sec;
}
const lista = ORDEN.filter((k) => sectores[k]).map((k) => sectores[k]);
for (const k of Object.keys(sectores)) if (!ORDEN.includes(k)) avisos.push(`${k}: no está en ORDEN`);

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const chips = lista.map((s, i) => {
  const n = i + 1;
  return `<button type="button" role="tab" id="sx-t${n}" aria-controls="sx-p${n}" aria-selected="${i ? "false" : "true"}"${i ? ' tabindex="-1"' : ' class="is-on"'}><span data-t="${s.chip.key}">${esc(s.chip.es)}</span></button>`;
}).join("\n");
const paneles = lista.map((s, i) => {
  const n = i + 1;
  return `<div class="sx__p" id="sx-p${n}" role="tabpanel" aria-labelledby="sx-t${n}"${i ? " hidden" : ""}>
<div class="sx__esc">
<div class="sx__win"><div class="sx__bar"><i></i><i></i><i></i><span>${s.carpeta}</span></div><picture><source srcset="assets/${s.id}-desk.webp" type="image/webp"/><img src="assets/${s.id}-desk.jpg" alt="${esc(s.nombre)}" width="900" height="562" loading="lazy" decoding="async"/></picture></div>
<div class="sx__tel"><img src="assets/hero/${s.id}-m.webp" alt="" width="480" height="1013" loading="lazy" decoding="async"/></div>
</div>
<div class="sx__txt">
<p class="sx__k" data-t="${s.k.key}">${esc(s.k.es)}</p>
<h3 class="sx__n">${esc(s.nombre)}</h3>
<p class="sx__inc" data-t="sx_inc">Qué lleva</p>
<ul class="sx__l">${s.lleva.map((l) => `<li data-t="${l.key}">${esc(l.es)}</li>`).join("")}</ul>
<div class="sx__acc"><a class="l3-btn" href="${s.enlace}" target="_blank" rel="noopener" data-t="sx_ver">Ver la muestra</a><a class="l3-a" href="contacto.html" data-t="sx_pedir">Quiero una así</a></div>
<p class="sx__nota" data-t="sx_nota">Marcas inventadas: son muestras mías.</p>
</div>
</div>`;
}).join("\n");

// Galería «todas las muestras» (9/11/2026): cada tarjeta abre la muestra de un toque. Orden variado: uno de cada grupo por turnos.
const GRUPOS = [ORDEN.slice(0, 6), ORDEN.slice(6, 15), ORDEN.slice(15, 19), ORDEN.slice(19, 23), ORDEN.slice(23, 25), ORDEN.slice(25)];
const galeria = [];
for (let r = 0; GRUPOS.some((g) => g.length > r); r++) for (const g of GRUPOS) if (g[r] && sectores[g[r]]) galeria.push(sectores[g[r]]);
const uiES = (k) => esc(UI[k]);
for (const k of Object.keys(UI)) if (!EU_NUEVOS[k]) avisos.push("euskera " + k);
const tarjetas = galeria.map((s) => {
  const card = fs.existsSync(path.join(WEB, `assets/sx/${s.id}-c.webp`)) ? `assets/sx/${s.id}-c.webp` : (avisos.push(`${s.nombre}: sin tarjeta (pasa miniaturas.cjs)`), `assets/${s.id}-desk.webp`);
  return `<li class="sx-t__i"><a class="sx-c" href="${s.enlace}" target="_blank" rel="noopener"><span class="sx-c__img"><img src="${card}" alt="" width="640" height="400" loading="lazy" decoding="async"/><span class="sx-c__abre" aria-hidden="true" data-t="sx_ver">Ver la muestra</span></span><span class="sx-c__pie"><span class="sx-c__n">${esc(s.nombre)}</span><span class="sx-c__s" data-t="${s.chip.key}">${esc(s.chip.es)}</span></span></a></li>`;
}).join("\n");
const galeriaHTML = (abierta) => `<div class="sx-t${abierta ? " is-abierta" : ""}">
<div class="sx-t__cab reveal">
<h3 class="sx-t__h"><span data-t="sx_todas_h">${uiES("sx_todas_h")}</span><span class="sx-t__num">${galeria.length}</span></h3>
<p class="sx-t__p" data-t="sx_todas_p">${uiES("sx_todas_p")}</p>
</div>
<ul class="sx-t__g" id="sx-todas">
${tarjetas}
</ul>
${abierta ? "" : `<button type="button" class="sx-t__mas" aria-controls="sx-todas" aria-expanded="false" hidden><span data-t="sx_todas_mas">${uiES("sx_todas_mas")}</span><span data-t="sx_todas_menos" hidden>${uiES("sx_todas_menos")}</span></button>`}
</div>
`;

let cambios = 0;
for (const pag of PAGINAS) {
  const f = path.join(WEB, pag);
  const h = fs.readFileSync(f, "utf8");
  const a = h.indexOf('<section class="l3 sv sx" id="tu-sector"');
  if (a < 0) { avisos.push(`${pag}: sin #tu-sector`); continue; }
  const b = h.indexOf("</section>", a);
  const sec = h.slice(a, b);
  const c0 = sec.indexOf('<div class="sx__chips reveal"');
  const c1 = sec.indexOf(">", c0) + 1;
  const cFin = sec.indexOf("</div>", c1);
  const p0 = sec.indexOf('<div class="sx__caja reveal">');
  if (c0 < 0 || p0 < 0) { avisos.push(`${pag}: estructura de #tu-sector distinta`); continue; }
  const nueva = sec.slice(0, c1) + "\n" + chips + "\n" + sec.slice(cFin, p0) + '<div class="sx__caja reveal">\n' + paneles + "\n</div>\n" + galeriaHTML(pag === "trabajos.html") + "</div>\n";
  if (nueva !== sec) {
    cambios++;
    if (!CHECK) fs.writeFileSync(f, h.slice(0, a) + nueva + h.slice(b));
  }
}

// Euskera de los sectores nuevos en el diccionario EU de i18n.js
const I0 = "  // sx-sectores-nuevos (lo escribe herramientas/sitio/sectores/gen.cjs; euskera de Itzultzaile Neuronala en sectores/eu.json)";
const I1 = "  // /sx-sectores-nuevos";
let src = fs.readFileSync(I18N, "utf8");
const lineas = [...Object.keys(UI).map((k) => ({ key: k, eu: EU_NUEVOS[k] || null })), ...lista.filter((s) => s.nuevo).flatMap((s) => [s.chip, s.k, ...s.lleva])].map((x) => `  ${x.key}: ${JSON.stringify(x.eu)},`);
const bloque = [I0, ...lineas, I1].join("\n");
if (src.includes(I0)) src = src.slice(0, src.indexOf(I0)) + bloque + src.slice(src.indexOf(I1) + I1.length);
else {
  const ancla = src.indexOf("\n", src.indexOf("  sx_nota:")) + 1;
  src = src.slice(0, ancla) + bloque + "\n" + src.slice(ancla);
}
if (!CHECK) fs.writeFileSync(I18N, src);

console.log(`${lista.length} sectores: ${lista.map((s) => s.nombre).join(", ")}`);
console.log(`${CHECK ? "(--check) cambiarían" : "cambiadas"} ${cambios} páginas; i18n.js: ${lineas.length} textos en euskera de los nuevos`);
if (avisos.length) console.log("AVISOS:\n- " + avisos.join("\n- "));
