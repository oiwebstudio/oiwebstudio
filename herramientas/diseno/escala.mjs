// Escala tipográfica y de espacios fluida (método Utopia): cada paso crece con la pantalla entre dos límites,
// sin saltos de breakpoints y respetando el zoom (rem + vw dentro de clamp).
// Uso (desde la raíz del repo):
//   node herramientas/diseno/escala.mjs [--perfil editorial|compacto|cartel] [--base 17,19] [--ratio 1.2,1.333] [--vw 360,1240]
// Perfiles: compacto = webs de servicios con mucho texto (1.125→1.2) · editorial = la mayoría (1.2→1.25)
//           cartel = portadas con un titular enorme (1.2→1.414).
const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf("--" + n); return i >= 0 ? args[i + 1] : undefined; };
const perfiles = { compacto: [1.125, 1.2], editorial: [1.2, 1.25], cartel: [1.2, 1.414] };
const perfil = opt("perfil") || "editorial";
const [rMin, rMax] = opt("ratio") ? opt("ratio").split(",").map(Number) : perfiles[perfil];
const [bMin, bMax] = (opt("base") || "17,19").split(",").map(Number);
const [vMin, vMax] = (opt("vw") || "360,1240").split(",").map(Number);

const r = (x, d = 4) => +x.toFixed(d);
function fluido(min, max) {
  const pendiente = (max - min) / (vMax - vMin);
  const corte = min - pendiente * vMin;
  // los pasos negativos pueden encoger al crecer la pantalla: clamp necesita siempre (menor, preferido, mayor)
  return `clamp(${r(Math.min(min, max) / 16)}rem, ${r(corte / 16)}rem ${pendiente < 0 ? "-" : "+"} ${r(Math.abs(pendiente) * 100)}vw, ${r(Math.max(min, max) / 16)}rem)`;
}

const lineas = [`/* Escala «${perfil}»: base ${bMin}→${bMax}px, razón ${rMin}→${rMax}, de ${vMin} a ${vMax}px de ancho (escala.mjs) */`, ":root {"];
const tabla = [];
for (let n = -2; n <= 6; n++) {
  const min = bMin * rMin ** n, max = bMax * rMax ** n;
  lineas.push(`  --paso-${n < 0 ? "m" + -n : n}: ${fluido(min, max)};`);
  tabla.push(`  paso ${String(n).padStart(2)}  ${min.toFixed(1).padStart(6)}px → ${max.toFixed(1).padStart(6)}px`);
}
// espacios: múltiplos de la base, y parejas que crecen más que la letra (para márgenes de sección)
const esp = { "3xs": 0.25, "2xs": 0.5, xs: 0.75, s: 1, m: 1.5, l: 2, xl: 3, "2xl": 4, "3xl": 6 };
for (const [k, f] of Object.entries(esp)) lineas.push(`  --esp-${k}: ${fluido(bMin * f, bMax * f)};`);
const claves = Object.keys(esp);
for (let i = 3; i < claves.length - 1; i++) {
  const a = claves[i], b = claves[i + 1];
  lineas.push(`  --esp-${a}-${b}: ${fluido(bMin * esp[a], bMax * esp[b])};`);
}
lineas.push(`  --esp-seccion: ${fluido(bMin * 3, bMax * 6)}; /* padding vertical de sección: 3 bases en el móvil, 6 en escritorio */`);
lineas.push("}");
console.log(lineas.join("\n"));
console.log(`\nTamaños (a ${vMin}px → a ${vMax}px):\n${tabla.join("\n")}`);
console.log(`\nUso: body = paso-0 · titulares de sección = paso-3 o 4 · portada = paso-5 o 6 · notas = paso-m1 (nunca menos de 14px: paso-m2 = ${(bMin * rMin ** -2).toFixed(1)}→${(bMax * rMax ** -2).toFixed(1)}px).`);
if (Math.min(bMin * rMin ** -2, bMax * rMax ** -2) < 12) console.log("⚠ paso-m2 baja de 12px en algún ancho: no usarlo para texto.");
