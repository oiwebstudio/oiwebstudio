// Croquis dibujado a mano (estilo Errotatxo) a partir de OpenStreetMap: mar, río, playas, parques, calles y vías.
// Uso: node herramientas/diseno/croquis.mjs <osm.json de Overpass "out geom"> <salida.svg> --bbox s,w,n,e [--ancho 1000]
//      [--resaltar "texto en el nombre de la calle"]
// Saca solo la geometría (paths con pathLength=1 para dibujarlos al entrar en pantalla); las etiquetas y el pin
// se ponen en la web encima, con las coordenadas que imprime este script (proyección equirectangular).
// Datos: © colaboradores de OpenStreetMap (ODbL) — citarlo en el pie de la web.
import { readFileSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf("--" + n); return i >= 0 ? args[i + 1] : d; };
const [entrada, salida] = args.filter((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));
const [S, W, N, E] = opt("bbox").split(",").map(Number);
const ANCHO = Number(opt("ancho", 1000));
const resaltar = opt("resaltar", "");
const k = Math.cos(((S + N) / 2) * Math.PI / 180);
const esc = ANCHO / ((E - W) * k);
const ALTO = Math.round((N - S) * esc);
const pr = (lat, lon) => [((lon - W) * k * esc), ((N - lat) * esc)];
const r1 = (n) => Math.round(n * 10) / 10;

// Simplificación Douglas-Peucker en píxeles
function dp(pts, tol) {
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]]; let m = 0, idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    const d = Math.abs(dy * p[0] - dx * p[1] + b[0] * a[1] - b[1] * a[0]) / L;
    if (d > m) { m = d; idx = i; }
  }
  return m > tol ? [...dp(pts.slice(0, idx + 1), tol).slice(0, -1), ...dp(pts.slice(idx), tol)] : [a, b];
}
const camino = (geom, tol = 1.2, cerrar = false) => {
  const pts = dp(geom.map((g) => pr(g.lat, g.lon)), tol);
  return "M" + pts.map((p) => `${r1(p[0])} ${r1(p[1])}`).join("L") + (cerrar ? "Z" : "");
};
const dentro = (geom, m = 0.004) => geom.some((g) => g.lat > S - m && g.lat < N + m && g.lon > W - m && g.lon < E + m);

const j = JSON.parse(readFileSync(entrada, "utf8"));
const capas = { mar: [], costa: [], agua: [], rio: [], playa: [], parque: [], principal: [], calle: [], resaltada: [], tren: [] };
const costas = [];
for (const e of j.elements) {
  const t = e.tags || {};
  const geoms = e.type === "relation" ? (e.members || []).filter((m) => m.geometry && m.role === "outer").map((m) => m.geometry) : e.geometry ? [e.geometry] : [];
  for (const g of geoms) {
    if (!dentro(g)) continue;
    if (t.natural === "coastline") costas.push(g);
    else if (t.natural === "water") capas.agua.push(camino(g, 1, true));
    else if (t.waterway === "river") capas.rio.push(camino(g, 1.5));
    else if (t.natural === "beach") capas.playa.push(camino(g, 1, true));
    else if (t.leisure === "park") capas.parque.push(camino(g, 1.5, true));
    else if (t.railway === "rail") capas.tren.push(camino(g, 2));
    else if (t.highway) {
      const d = camino(g, 1.5);
      if (resaltar && (t.name || "").toLowerCase().includes(resaltar.toLowerCase())) capas.resaltada.push(d);
      else if (/^(primary|secondary|tertiary)$/.test(t.highway)) capas.principal.push(d);
      else capas.calle.push(d);
    }
  }
}
// La costa llega en tramos sueltos: se encadenan por los extremos y el mar se cierra por el borde de arriba.
const clave = (g) => `${g.lat.toFixed(6)},${g.lon.toFixed(6)}`;
let cadenas = costas.map((g) => [...g]);
let unidas = true;
while (unidas) {
  unidas = false;
  outer: for (let i = 0; i < cadenas.length; i++) for (let m = 0; m < cadenas.length; m++) {
    if (i === m) continue;
    if (clave(cadenas[i][cadenas[i].length - 1]) === clave(cadenas[m][0])) { cadenas[i] = [...cadenas[i], ...cadenas[m].slice(1)]; cadenas.splice(m, 1); unidas = true; break outer; }
  }
}
// OSM dibuja la costa con el mar a la DERECHA. Se recorta cada tramo al lienzo y el mar se cierra caminando el
// borde del lienzo en sentido horario desde cada salida hasta la siguiente entrada (vale también para rías).
const dentroL = (p) => p[0] >= 0 && p[0] <= ANCHO && p[1] >= 0 && p[1] <= ALTO;
function corte(a, b) { // punto donde el segmento a→b cruza el borde del lienzo
  let t0 = 0, t1 = 1; const dx = b[0] - a[0], dy = b[1] - a[1];
  for (const [p, q] of [[-dx, a[0]], [dx, ANCHO - a[0]], [-dy, a[1]], [dy, ALTO - a[1]]]) {
    if (p === 0) continue; const r = q / p;
    if (p < 0) t0 = Math.max(t0, r); else t1 = Math.min(t1, r);
  }
  const t = dentroL(a) ? t1 : t0; return [a[0] + dx * t, a[1] + dy * t];
}
const perim = ([x, y]) => { // posición sobre el borde, en sentido horario desde la esquina de arriba a la izquierda
  const e = 0.5;
  if (y <= e) return x; if (x >= ANCHO - e) return ANCHO + y; if (y >= ALTO - e) return 2 * ANCHO + ALTO - x; return 2 * (ANCHO + ALTO) - y;
};
const esquinas = [[0, 0], [ANCHO, 0], [ANCHO, ALTO], [0, ALTO]].map((p) => [perim(p), p]);
const P = 2 * (ANCHO + ALTO);
const tramos = [];
for (const c of cadenas) {
  capas.costa.push(camino(c, 1));
  const pts = dp(c.map((g) => pr(g.lat, g.lon)), 1);
  let actual = null;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], prev = pts[i - 1];
    if (dentroL(p)) {
      if (!actual) { actual = prev ? [corte(prev, p)] : [p]; }
      actual.push(p);
    } else if (actual) { actual.push(corte(prev, p)); tramos.push(actual); actual = null; }
  }
  if (actual) tramos.push(actual); // tramo que acaba dentro: costa cerrada (isla)
}
const enBorde = (p) => p[0] <= 0.5 || p[1] <= 0.5 || p[0] >= ANCHO - 0.5 || p[1] >= ALTO - 0.5;
const abiertos = tramos.filter((t) => enBorde(t[0]) && enBorde(t[t.length - 1]));
for (const t of tramos) if (!abiertos.includes(t)) capas.mar.push("M" + t.map((p) => `${r1(p[0])} ${r1(p[1])}`).join("L") + "Z"); // islas y lagos de costa
const usados = new Set();
for (let i = 0; i < abiertos.length; i++) {
  if (usados.has(i)) continue;
  const poly = []; let j = i;
  while (j >= 0 && !usados.has(j)) {
    usados.add(j); const t = abiertos[j]; poly.push(...t);
    const salida = perim(t[t.length - 1]);
    let mejor = -1, dist = Infinity; // siguiente entrada caminando el borde en sentido horario
    abiertos.forEach((u, k) => { const d = ((perim(u[0]) - salida) % P + P) % P || P; if (d < dist) { dist = d; mejor = k; } });
    esquinas.map(([pe, pt]) => [((pe - salida) % P + P) % P, pt]).filter(([d]) => d > 0 && d < dist).sort((a, b) => a[0] - b[0]).forEach(([, pt]) => poly.push(pt));
    j = mejor;
  }
  capas.mar.push("M" + poly.map((p) => `${r1(p[0])} ${r1(p[1])}`).join("L") + "Z");
}
const g = (clase, lista, extra = "") => lista.length ? `<g class="${clase}"${extra}>${lista.map((d) => `<path d="${d}" pathLength="1"/>`).join("")}</g>` : "";
const svg = `<svg class="croquis" viewBox="0 0 ${ANCHO} ${ALTO}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="croquis-t">
<title id="croquis-t">Croquis del barrio</title>
<defs>
<filter id="lapiz" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="3"/></filter>
<pattern id="cuadricula" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" class="cuad"/></pattern>
<clipPath id="lienzo"><rect width="${ANCHO}" height="${ALTO}"/></clipPath>
</defs>
<rect width="${ANCHO}" height="${ALTO}" fill="url(#cuadricula)"/>
<g clip-path="url(#lienzo)" filter="url(#lapiz)" fill="none" stroke-linecap="round" stroke-linejoin="round">
${g("mar", capas.mar)}${g("parque", capas.parque)}${g("playa", capas.playa)}${g("agua", capas.agua)}
${g("calle", capas.calle)}${g("principal", capas.principal)}${g("tren", capas.tren)}
${g("rio-mancha", capas.rio)}${g("rio", capas.rio)}${g("costa-mancha", capas.costa)}${g("costa", capas.costa)}${g("resaltada", capas.resaltada)}
</g>
<g class="encima"></g>
</svg>`;
writeFileSync(salida, svg);
console.log(`${ANCHO}×${ALTO} · ${(svg.length / 1024).toFixed(0)} KB ·`, Object.entries(capas).map(([a, b]) => `${a} ${b.length}`).join(", "));
console.log("proyectar: x=(lon-(" + W + "))*" + (k * esc).toFixed(3) + "  y=(" + N + "-lat)*" + esc.toFixed(3));
