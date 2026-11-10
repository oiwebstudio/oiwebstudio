// Claves y textos en castellano de los sectores nuevos (nuevos.json): sx_c_<slug> (botón), sx_k_<slug> (qué negocio es)
// y sx_<slug>_a/b/c (qué lleva). Los 8 primeros sectores conservan sus claves de siempre (existentes.json).
const path = require("path");
const fs = require("fs");
const LETRAS = ["a", "b", "c", "d"];
// Textos de la galería «todas las muestras» que va debajo de las pestañas (9/11/2026, Oier: «que la gente vea rápidamente los demos»)
const UI = {
  sx_todas_h: "Todas las muestras",
  sx_todas_p: "Toca una y se abre entera, lista para probar.",
  sx_todas_mas: "Ver todas",
  sx_todas_menos: "Ver menos",
  // 9/11 noche (Oier: «están muy abajo»): la pieza entera es la galería, justo debajo de la portada, con filtros por tipo de negocio
  sx_g_todos: "Todos",
  sx_g_comer: "Comer y beber",
  sx_g_cuidado: "Cuidado y salud",
  sx_g_tiendas: "Tiendas",
  sx_g_casa: "Casa y oficios",
  sx_g_dormir: "Alojamiento",
  sx_g_despachos: "Despachos y clases",
  at_muestras: "Muestras",
  // 10/11 (Oier: «lo de las reservas ponlo más a mano… lo de la peluquería ponlo arriba y el panel sin contraseña»): bloque #reservas-demo de la portada
  rv_h: "Reservas sin comisiones: pruébalas",
  rv_p: "Una peluquería inventada con su agenda funcionando. Pide una cita como si fueras un cliente y luego mira cómo le llega al dueño, sin contraseña.",
  rv_cli: "Pedir una cita",
  rv_pan: "Ver el panel del dueño",
  rv_mas: "Precio y cómo funciona",
  rv_t1: "Lo que ve tu cliente",
  rv_t2: "Lo que ves tú",
  rv_nota: "Peluquería inventada: lo que hagas se borra solo en media hora.",
};
function nuevos() { return JSON.parse(fs.readFileSync(path.join(__dirname, "nuevos.json"), "utf8")); }
function textosES() {
  const o = { ...UI };
  for (const s of nuevos()) {
    o[`sx_c_${s.slug}`] = s.chip;
    o[`sx_k_${s.slug}`] = s.k;
    s.lleva.forEach((t, i) => { o[`sx_${s.slug}_${LETRAS[i]}`] = t; });
  }
  return o;
}
module.exports = { nuevos, textosES, LETRAS, UI };
