/**
 * Ajusta la demo de Alex Jatetxea (Eibar) con lo que se sabe de ellos.
 *
 * Todo lo que se escribe aquí sale de tres sitios comprobables:
 *   · su propia web (sites.google.com/view/alexjatexea): la carta entera con
 *     precios, quiénes son y su lema "El arte de comer bien"
 *   · su ficha de Google: dirección, teléfono, horario de bar y de cocina,
 *     4,4 con 86 opiniones, y que hacen para llevar y reparto
 *   · sus reseñas de Google, copiadas tal cual
 *
 * Se ejecuta DESPUÉS de generar-demo.mjs, que deja la plantilla de asador:
 *   node herramientas/demos/generar-demo.mjs --id 433
 *   node herramientas/demos/demo-alex-jatetxea.mjs
 */
import fs from "node:fs";

const F = "web/demos/clientes/alex-jatetxea/index.html";
let s = fs.readFileSync(F, "utf8");
const antes = s.length;
const hecho = [];
function pon(desc, re, con) {
  const nuevo = s.replace(re, con);
  if (nuevo === s) { console.log("!! no encontrado: " + desc); return; }
  s = nuevo; hecho.push(desc);
}

/* ── 0 · color: «brasa y hierro» ─────────────────────────────────────────
   El local es un antiguo taller mecánico y lo que más repiten sus reseñas es
   el chuletón. Así que hierro (gris muy oscuro) para las bandas, brasa (un
   rojo de ascua, no de tomate) para los acentos y un crema cálido de fondo.
   Nada que ver con el verde de Har' ta jan: son dos negocios distintos. */
const COLOR = {
  "--fondo": "#FBF7F1",
  "--fondo-alt": "#F2EADF",
  "--filete": "#E0D4C4",
  "--filete-fuerte": "#C4B49E",
  "--tinta": "#1A1613",
  "--tinta-sec": "#5E5449",
  "--acento": "#98301A",
  "--acento-con": "#FFF8F2",
  "--acento-osc": "#6E2010",
  "--acento-claro": "#E09173",
  "--osc": "#17181A",
  "--osc-filete": "#33353A",
  "--osc-tinta": "#E9E3DA",
  "--osc-tinta2": "#B9B2A7",
  "--osc-tinta3": "#8C857A",
  "--ok-claro": "#8FC79C",
};
for (const [clave, valor] of Object.entries(COLOR)) {
  pon("color " + clave, new RegExp("(\\n\\s*" + clave + ":)[^;]*;"), "$1" + valor + ";");
}

/* ── 1 · DATOS ───────────────────────────────────────────────────────────
   El horario es el del BAR, que es el que enseña Google. El de cocina va
   aparte, en su propia tabla, porque es el que de verdad importa para ir a
   comer y no coincide con el de la barra. */
pon("reclamo", /reclamo:\s*"[^"]*"/, 'reclamo: "Bar restaurante en Eibar. Cocina casera, chuletón y buen ambiente."');
pon("cocina", /cocina:\s*"[^"]*"/, 'cocina: "Casera · Parrilla"');
pon("precio", /\n\s*precio:\s*"[^"]*"/, '\n  precio: "10-20 €"');
// El email ya lo pone el generador desde la ficha del negocio.
pon("horario del bar", /horario:\s*\{[\s\S]*?\n\s*\},/,
`horario: {
    1:[["08:00","22:30"]],
    2:[["08:00","22:30"]],
    3:[["08:00","22:30"]],
    4:[["08:00","23:00"]],
    5:[["08:00","23:59"]],
    6:[["09:00","23:59"]],
    0:[["09:00","22:00"]],
  },`);
pon("precio del combinado", /menuPrecio:\s*"[^"]*"/, 'menuPrecio: "14 €"');
pon("qué lleva el combinado", /menuIncluye:\s*"[^"]*"/, 'menuIncluye: "Bebida y postre incluidos"');
pon("sin menú por días", /menuDia:\s*\{[\s\S]*?\n\s*\},/, "menuDia: {},");

/* ── 2 · cabecera ── */
pon("marca de la cabecera", /<a class="marca" href="#inicio">[^<]*<em>[^<]*<\/em><\/a>/,
'<a class="marca" href="#inicio">Alex <em>Jatetxea</em></a>');
pon("botón de la cabecera", /<a class="btn btn--fill top__cta" href="#contacto">Reservar /,
'<a class="btn btn--fill top__cta" href="#contacto">Reservar mesa ');
pon("menú de navegación", /<a href="#carta">La carta<\/a>\s*<a href="#menu">Menú del día<\/a>/,
'<a href="#carta">La carta</a>\n      <a href="#menu">El mediodía</a>');
pon("cabecera en pantallas medianas", /\n<\/style>\n<script>document\.documentElement\.className/,
`
@media(max-width:1100px){ .top .estado{display:none;} }
</style>
<script>document.documentElement.className`);

/* ── 3 · portada: su lema y tres platos de su carta ── */
const U = (id, w, q) => `https://images.unsplash.com/${id}?w=${w}&q=${q}&auto=format&fit=crop`;
const PLATOS = [
  { id: "photo-1619719015339-133a130520f6", alt: "Chuletón a la parrilla cortado", pie: "Chuletón 1 kg · 59 €", w: 1200, h: 1500 },
  { id: "photo-1559742811-822873691df8", alt: "Langostinos a la parrilla en un plato negro", pie: "Langostinos · 15 €", w: 800, h: 1000 },
  { id: "photo-1635327173758-85badf17f995", alt: "Porción de tarta de queso", pie: "Tarta de queso · 4,50 €", w: 800, h: 600 },
];
const ICO_FLECHA = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ICO_TEL = '<svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true"><path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3c0 .8-.7 1.5-1.5 1.5A16.5 16.5 0 0 1 5 5C5 4.2 5.7 3.5 6.5 3.5z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';

pon("portada", /<section class="portada" id="inicio">[\s\S]*?<\/section>/,
`<section class="portada heroe" id="inicio">
  <div class="wrap heroe__in">
    <div class="heroe__txt">
      <p class="heroe__kicker"><span>Bar restaurante · Eibar</span><span>Ego-Gain 10</span></p>
      <h1 class="heroe__h"><span class="l"><span>El arte</span></span><span class="l"><span>de <em>comer bien</em></span></span></h1>
      <p class="hoy" id="hoy-chip">
        <span class="hoy__t"><i aria-hidden="true"></i>De lunes a viernes · 14 €</span>
        <b>Plato combinado con bebida y postre, de 13:00 a 16:00</b>
      </p>
      <div class="heroe__btns">
        <a class="btn btn--fill btn--ico" href="#carta"><span>Ver la carta</span><i class="btn__c">${ICO_FLECHA}</i></a>
        <a class="btn btn--tel" id="p-tel" href="#">${ICO_TEL}<span>Llamar para reservar</span></a>
      </div>
      <p class="heroe__nota">Cocina de <b>13:00 a 16:00</b> y de <b>19:00 a 22:30</b> · para llevar y a domicilio</p>
    </div>
    <div class="heroe__platos" id="platos">
${PLATOS.map((p, i) => `      <figure class="pl pl--${i + 1}" data-prof="${[14, 26, 20][i]}">
        <div class="pl__m"><img src="${U(p.id, i ? 700 : 1100, 76)}"${i ? "" : ` srcset="${U(p.id, 700, 72)} 700w, ${U(p.id, 1100, 76)} 1100w" sizes="(max-width: 899px) 70vw, 36vw" fetchpriority="high"`} decoding="async" alt="${p.alt}" width="${p.w}" height="${p.h}"/></div>
        <figcaption>${p.pie}</figcaption>
      </figure>`).join("\n")}
    </div>
  </div>
</section>`);

/* ── 4 · el mediodía (sustituye al bloque de menú del día) ──────────────
   No tienen menú del día con platos fijos: tienen platos combinados. Los
   precios y lo que incluyen son los de su propia carta. */
pon("el mediodía", /<section class="pizarra sector" id="menu">[\s\S]*?<\/section>/,
`<section class="pizarra sector" id="menu">
  <div class="wrap">
    <div class="cartel__cab">
      <div class="rev">
        <p class="rotulo">El mediodía</p>
        <h2>Combinado,<br/>bebida y postre</h2>
      </div>
    </div>
    <div class="cartel rev" data-d="1">
      <div class="cartel__precio">14 €<small>de lunes a viernes</small></div>
      <p class="cartel__dia">Platos combinados</p>
      <p class="cartel__incl">De 13:00 a 16:00 · todos llevan ensalada, patatas, huevo y croqueta</p>
      <div class="cartel__cols">
        <div><h3>A elegir</h3><ul>
          <li style="--i:0">Pechuga</li><li style="--i:1">Filete de ternera</li>
          <li style="--i:2">Lomo</li><li style="--i:3">Filete de merluza rebozado <em>15 €</em></li></ul></div>
        <div><h3>Entre semana</h3><ul>
          <li style="--i:0"><b>14 €</b> de lunes a viernes</li>
          <li style="--i:1">Con bebida y postre incluidos</li>
          <li style="--i:2">De 13:00 a 16:00</li></ul></div>
        <div><h3>Fines de semana</h3><ul>
          <li style="--i:0"><b>19 €</b> sábados, domingos y festivos</li>
          <li style="--i:1">Mismos platos, mismo acompañamiento</li>
          <li style="--i:2">Mejor avisando si sois varios</li></ul></div>
      </div>
      <div class="cartel__pie">
        <a class="btn btn--fill" id="cartel-tel" href="#">Llamar y reservar <span class="ar" aria-hidden="true">→</span></a>
        <span class="cartel__nota">Ego-Gain kalea 10, Eibar</span>
      </div>
    </div>
  </div>
</section>`);

/* El bloque de "menú del día" de la plantilla ya no existe: su función se
   quedaba sin dónde escribir y tumbaba el resto del guion de la página. */
pon("desactivar el menú de la plantilla", /function pintarMenu\(\)\{/,
'function pintarMenu(){\n  if(!document.getElementById("menu-dia")) return;');

/* ── 5 · la carta, con sus precios ────────────────────────────────────── */
const CARTA = [
  ["Raciones", [
    ["Alitas", "11 €", ""], ["Calamares", "11 €", ""], ["Chicken fingers", "12 €", ""],
    ["Croquetas de la casa", "13 €", ""], ["Langostinos a la parrilla", "15 €", ""],
    ["Langostinos Alex", "12 €", ""], ["Huevos rotos con jamón", "13 €", ""],
    ["Patatas dos salsas", "10 €", ""], ["Papa Alex", "12 €", ""],
    ["Tabla de queso", "15 €", "Para compartir"], ["Tabla de jamón ibérico", "20 €", "Para compartir"],
  ]],
  ["Ensaladas", [["Ensalada mixta", "13 €", ""], ["Ensalada César", "13 €", ""], ["Ensalada campesina", "13 €", ""]]],
  ["Especiales de la casa", [
    ["Chuletón", "59 €", "1 kg · para compartir"], ["Entrecot", "27 €", ""],
    ["Dorada al limón", "24 €", ""], ["Rape al horno", "24 €", ""],
  ]],
  ["Postres", [
    ["Arroz con leche", "3,50 €", ""], ["Flan", "3,50 €", ""], ["Bizcocho casero", "2,50 €", ""],
    ["Tiramisú", "4,50 €", ""], ["Tarta de queso", "4,50 €", ""],
  ]],
];
const grupo = (g) => `
      <div class="grupo rev">
        <h3>${g[0]}</h3>
${g[1].map((p) => `        <article class="plato">
          <p class="plato__n">${p[0]}</p>
          <p class="plato__p">${p[1]}</p>${p[2] ? `\n          <p class="plato__d"><i>${p[2]}</i></p>` : ""}
        </article>`).join("\n")}
      </div>`;

pon("la carta con precios", /<section class="carta" id="carta">[\s\S]*?<\/section>/,
`<section class="carta" id="carta">
  <div class="wrap">
    <div class="carta__cab">
      <div class="rev">
        <p class="rotulo">La carta</p>
        <h2>Para picar,<br/>o para sentarse</h2>
      </div>
      <p class="lead rev" data-d="1">Los precios son los de vuestra carta. Si cambian, se cambian aquí en un minuto.</p>
    </div>
${CARTA.map(grupo).join("\n")}
  </div>
</section>`);

/* ── 6 · la casa: con sus propias palabras ── */
pon("la casa", /<section class="casa" id="casa">[\s\S]*?<\/section>/,
`<section class="casa" id="casa">
  <div class="wrap">
    <p class="rotulo rev">La casa</p>
    <h2 class="casa__t rev" data-d="1">Aquí cocinamos<br/>como en casa</h2>
    <div class="casa__cols rev" data-d="2">
      <p>Somos Alex y Kathe. Cocinamos como en casa, servimos como entre amigos y siempre hay algo rico para compartir.</p>
      <p>Comida <span class="subr">100% casera</span>, hecha al momento y con producto fresco. Y para beber, desde un refresco hasta un vino o un cóctel.</p>
      <p>Comidas de cuadrilla, cenas tranquilas y eventos de empresa: llámanos y lo preparamos a vuestra medida.</p>
    </div>
    <figure class="casa__foto rev" data-d="2">
      <img loading="lazy" width="1400" height="600"
        src="https://images.unsplash.com/photo-1690983325970-185c8a6c0ba6?w=1400&q=78&auto=format&fit=crop"
        alt="Chuletón recién cortado sobre la tabla"/>
      <figcaption>Aquí irían vuestras fotos</figcaption>
    </figure>
  </div>
</section>`);

/* La galería de la plantilla son fotos de banco con pies inventados ("la
   bodega", "la parrilla"): fuera hasta que haya fotos suyas. */
pon("galería de fotos ajenas", /<!-- ═══ 6 · TIRA[\s\S]*?<\/section>\n/, "");

/* ── 7 · reseñas reales de su ficha de Google ── */
const MAPS = "https://www.google.com/maps/search/?api=1&query=Alex%20Jatetxea%20Ego-Gain%2010%20Eibar";
const RESENAS = [
  { q: "Comida espectacular, muy deliciosa. Atención 10 de 10, muy amables todos. Lo recomiendo al 100%. Una gran experiencia.", a: "Steven G.", c: "hace 6 meses" },
  { q: "Excelente servicio, muy buen ambiente y comida deliciosa.", a: "Opinión destacada en Google", c: "" },
  { q: "La comida es muy rica, bien preparada y con sabores que nunca decepcionan.", a: "Opinión destacada en Google", c: "" },
];
pon("reseñas reales", /<!-- ═══ 3 · CIFRAS/,
`<!-- ═══ RESEÑAS · de su ficha de Google ═══ -->
<section class="dicen" id="dicen">
  <div class="wrap">
    <div class="dicen__cab rev">
      <p class="rotulo">Lo que dicen</p>
      <h2>4,4 en Google,<br/>con 86 opiniones</h2>
    </div>
    <div class="dicen__g">
${RESENAS.map((r, i) => `      <figure class="dicho rev" data-d="${i}">
        <p class="dicho__e" aria-hidden="true">★★★★★</p>
        <blockquote>${r.q}</blockquote>
        <figcaption>${r.a}${r.c ? ` <span>· ${r.c}</span>` : ""}</figcaption>
      </figure>`).join("\n")}
    </div>
    <p class="dicen__pie rev" data-d="2"><a href="${MAPS}" target="_blank" rel="noopener">Verlas todas en Google →</a></p>
  </div>
</section>

<!-- ═══ 3 · CIFRAS`);

/* ── 8 · cifras que se pueden comprobar ── */
pon("cifras comprobables", /<li class="rev" data-d="2"><b>([\d,]+)<\/b><small>Google · (\d+) reseñas<\/small><\/li>/,
`<li class="rev"><b>$1</b><small>Google · $2 reseñas</small></li>
      <li class="rev" data-d="1"><b class="cnum" data-n="14" data-suf=" €">14 €</b><small>combinado de diario</small></li>
      <li class="rev" data-d="2"><b>10-20 €</b><small>por persona</small></li>
      <li class="rev" data-d="3"><b>8:00</b><small>abrimos el bar</small></li>`);

/* ── 9 · dónde y cuándo, con el horario de cocina aparte ── */
pon("horario de cocina", /<table class="horarios">\s*<caption>Horario<\/caption>/,
'<table class="horarios">\n<caption>Horario del bar</caption>');
pon("tabla de cocina", /<\/table>\s*<dl class="datos">/,
`</table>
<table class="horarios cocina">
  <caption>Horario de cocina</caption>
  <tbody>
    <tr><td>Lunes</td><td>13:00–15:45 · 19:00–22:00</td></tr>
    <tr><td>Martes</td><td>13:00–15:45 · 19:00–22:15</td></tr>
    <tr><td>Miércoles</td><td>13:00–16:00 · 19:00–22:15</td></tr>
    <tr><td>Jueves</td><td>13:00–16:00 · 19:00–22:30</td></tr>
    <tr><td>Viernes</td><td>13:00–16:00 · 19:00–23:00</td></tr>
    <tr><td>Sábado</td><td>13:00–16:00 · 19:00–23:00</td></tr>
    <tr><td>Domingo</td><td>13:00–16:00 · 19:00–22:30</td></tr>
  </tbody>
</table>
<dl class="datos">`);
pon("dónde estamos", /<h2 class="rev" data-d="1" style="max-width:16ch">[^<]*<br\/>[^<]*<\/h2>/,
'<h2 class="rev" data-d="1" style="max-width:16ch">En Ego-Gain,<br/>en pleno Eibar</h2>');

/* ── 10 · cierre: aquí se reserva por teléfono ── */
pon("cierre", /<p class="rotulo rev">Reservar<\/p>\s*<h2 class="rev" data-d="1">[^<]*<br\/>[^<]*<\/h2>\s*<p class="cierre__lead rev" data-d="2">[^<]*<\/p>/,
`<p class="rotulo rev">Reservar</p>
 <h2 class="rev" data-d="1">Una llamada<br/>y mesa puesta</h2>
 <p class="cierre__lead rev" data-d="2">Para cuadrillas, cenas o comidas de empresa, mejor con un día de margen.</p>`);
pon("botón de llamar", /Llamar ahora/, "Llamar al 608 85 91 88");
pon("campo del formulario", /<label for="f-com">Día, hora y cuántos sois<\/label><input id="f-com" name="comensales" type="text" placeholder="[^"]*"\/>/,
'<label for="f-com">Día, hora y cuántos sois</label><input id="f-com" name="comensales" type="text" placeholder="Sábado 21:00 · 6 personas"/>');

/* ── 11 · meta, icono y datos para Google ── */
pon("título", /<title>[^<]*<\/title>/, "<title>Alex Jatetxea — Bar restaurante en Eibar</title>");
pon("descripción", /<meta name="description" content="[^"]*"\/>/,
'<meta name="description" content="Bar restaurante en Eibar. Cocina casera, chuletón y combinados de 14 € de lunes a viernes con bebida y postre. Ego-Gain 10."/>');
pon("og:title", /<meta property="og:title" content="[^"]*"\/>/,
'<meta property="og:title" content="Alex Jatetxea — Bar restaurante en Eibar"/>');
pon("og:description", /<meta property="og:description" content="[^"]*"\/>/,
'<meta property="og:description" content="Cocina casera, chuletón y combinados de 14 € con bebida y postre."/>');
pon("imagen al compartir", /<meta property="og:image" content="[^"]*"\/>/,
'<meta property="og:image" content="https://images.unsplash.com/photo-1619719015339-133a130520f6?w=1200&h=630&q=80&auto=format&fit=crop"/>');
pon("icono de la pestaña", /<meta name="viewport"([^>]*)\/>/,
'<meta name="viewport"$1/>\n<meta name="theme-color" content="#98301A"/>\n<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Ccircle cx=%2232%22 cy=%2232%22 r=%2232%22 fill=%22%2398301A%22/%3E%3Ctext x=%2232%22 y=%2243%22 text-anchor=%22middle%22 font-family=%22Georgia,serif%22 font-size=%2232%22 fill=%22white%22%3EA%3C/text%3E%3C/svg%3E"/>');
pon("cocina en el JSON-LD", /servesCuisine:DATOS\.cocina/, 'servesCuisine:"Casera"');
pon("título del mapa", /title="Mapa de situación del asador"/, 'title="Mapa: Alex Jatetxea, Ego-Gain kalea 10, Eibar"');
pon("sin enlaces vacíos en el pie", /<p><a href="#">Aviso legal<\/a> · <a href="#">Privacidad<\/a> · <a href="#">Alérgenos<\/a><\/p>/,
'<p><a href="mailto:baralexrestaurante@gmail.com">baralexrestaurante@gmail.com</a></p>');
pon("aviso de la demo", /las fotos, los textos y los precios son de ejemplo y se sustituyen por los vuestros\./,
  "las fotos son de ejemplo; la carta, los precios y los horarios son los vuestros.");

/* ── 12 · estilos: hero, platos, cartel, reseñas y botones ── */
const CSS = `
/* ═══ HERO ═══ */
html:not(.js) .heroe *{opacity:1!important;transform:none!important;}
.heroe{padding:clamp(26px,4vw,56px) 0 clamp(40px,6vw,80px);overflow:hidden;}
.heroe__in{display:grid;gap:clamp(28px,4vw,56px);align-items:center;}
@media(min-width:900px){
  .heroe__in{grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);min-height:min(76svh,700px);}
}
.heroe__kicker{display:flex;flex-wrap:wrap;gap:6px 10px;margin:0 0 18px;}
.heroe__kicker span{font-family:var(--detalle);font-size:11.5px;font-weight:700;letter-spacing:.16em;
  text-transform:uppercase;color:var(--acento);padding:7px 13px;border-radius:100px;
  background:color-mix(in srgb, var(--acento) 9%, var(--fondo));}
.heroe__kicker span+span{color:var(--tinta-sec);background:var(--fondo-alt);}
.heroe .heroe__h{font-size:clamp(48px,6vw,104px);line-height:.95;letter-spacing:-.02em;margin:0 0 22px;}
.heroe__h em{font-style:italic;font-weight:400;color:var(--acento);}
.heroe__h .l{display:block;overflow:hidden;padding-bottom:.08em;}
.heroe__h .l>span{display:inline-block;transform:translateY(105%);
  transition:transform 1s cubic-bezier(.22,1,.36,1);}
.heroe.vivo .heroe__h .l>span{transform:none;}
.heroe.vivo .heroe__h .l+.l>span{transition-delay:.12s;}
.heroe__txt>*:not(.heroe__h){opacity:0;transform:translateY(14px);
  transition:opacity .7s var(--ease),transform .8s var(--ease);}
.heroe.vivo .heroe__txt>*{opacity:1;transform:none;}
.heroe.vivo .hoy{transition-delay:.3s;}
.heroe.vivo .heroe__btns{transition-delay:.42s;}
.heroe.vivo .heroe__nota{transition-delay:.54s;}
.heroe__btns{display:flex;flex-wrap:wrap;gap:12px;}
.heroe__nota{margin:18px 0 0;font-size:14.5px;color:var(--tinta-sec);}
.heroe__nota b{color:var(--tinta);}
.heroe .hoy{display:flex;flex-direction:column;align-items:flex-start;gap:4px;
  border:1px solid var(--filete-fuerte);border-radius:18px;padding:12px 18px;margin:0 0 20px;
  max-width:34rem;background:color-mix(in srgb, var(--acento) 6%, var(--fondo));}
.hoy__t{display:flex;align-items:center;gap:8px;font-size:12.5px;letter-spacing:.06em;
  text-transform:uppercase;font-family:var(--detalle);color:var(--tinta-sec);}
.hoy i{width:7px;height:7px;border-radius:50%;background:var(--acento);font-style:normal;}
.heroe .hoy b{font-size:15.5px;line-height:1.4;}

/* platos del hero */
.heroe__platos{position:relative;height:clamp(420px,52vw,620px);}
.pl{position:absolute;margin:0;opacity:0;transform:translate3d(0,60px,0) scale(.9);
  transition:opacity .8s var(--ease),transform 1.1s cubic-bezier(.34,1.4,.64,1);}
.pl__m{width:100%;height:100%;overflow:hidden;border-radius:26px;
  box-shadow:0 34px 60px -34px rgba(30,20,14,.6),0 0 0 6px var(--fondo);}
.pl img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 1.2s var(--ease);}
.pl:hover img{transform:scale(1.05);}
.pl--1{left:8%;top:6%;width:62%;height:78%;--r:-3deg;}
.pl--2{right:0;top:0;width:36%;height:40%;--r:5deg;}
.pl--3{right:4%;bottom:2%;width:40%;height:36%;--r:-5deg;}
.heroe.vivo .pl{opacity:1;transform:translate3d(var(--px,0),var(--py,0),0) rotate(var(--r));}
.heroe.vivo .pl--1{transition-delay:.15s;} .heroe.vivo .pl--2{transition-delay:.32s;}
.heroe.vivo .pl--3{transition-delay:.46s;}
.heroe.listo .pl{transition:opacity .8s var(--ease),transform .7s cubic-bezier(.22,1,.36,1);}
.heroe.vivo .pl__m{animation:flota 6s ease-in-out 1.4s infinite;}
.heroe.vivo .pl--2 .pl__m{animation-duration:7.2s;animation-delay:1.7s;}
.heroe.vivo .pl--3 .pl__m{animation-duration:6.6s;animation-delay:2s;}
@keyframes flota{0%,100%{transform:translateY(0);}50%{transform:translateY(-9px);}}
.pl figcaption{position:absolute;left:14px;bottom:14px;padding:8px 14px;border-radius:100px;
  background:rgba(255,255,255,.95);color:var(--tinta);font-family:var(--detalle);font-size:12px;
  font-weight:600;box-shadow:0 8px 20px -12px rgba(0,0,0,.45);white-space:nowrap;}

/* ═══ EL MEDIODÍA ═══ */
.cartel__cab{margin-bottom:clamp(20px,3vw,34px);}
.cartel{position:relative;border-radius:28px;background:var(--fondo);
  padding:clamp(24px,4vw,46px);box-shadow:0 30px 70px -52px rgba(20,12,8,.6);}
.pizarra .cartel{color:var(--tinta);}
.cartel__dia{font-family:var(--display);font-size:var(--t4);line-height:1.05;margin:0 0 4px;}
.pizarra .cartel .cartel__dia{color:var(--tinta);}
.cartel__incl{font-family:var(--detalle);font-size:12.5px;letter-spacing:.06em;
  text-transform:uppercase;color:var(--tinta-sec);margin:0 0 clamp(20px,3vw,30px);}
.pizarra .cartel .cartel__incl,.pizarra .cartel .cartel__nota{color:var(--tinta-sec);}
.cartel__cols{display:grid;gap:clamp(20px,3vw,38px);grid-template-columns:repeat(auto-fit,minmax(190px,1fr));}
@media(min-width:900px){ .cartel__cols{grid-template-columns:repeat(3,minmax(0,1fr));} }
.cartel__cols>div+div{border-left:1px solid var(--filete);padding-left:clamp(20px,3vw,38px);}
@media(max-width:719px){ .cartel__cols>div+div{border-left:0;padding-left:0;border-top:1px solid var(--filete);padding-top:20px;} }
.cartel h3{font-family:var(--detalle);font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--acento);margin:0 0 12px;}
.pizarra .cartel h3{color:var(--acento-osc);}
.cartel ul{list-style:none;margin:0;padding:0;display:grid;gap:9px;}
.cartel li{font-size:var(--t1);line-height:1.35;color:var(--tinta);
  opacity:0;transform:translateY(8px);animation:plato .34s var(--ease) forwards;
  animation-delay:calc(var(--i,0) * 30ms + 60ms);}
.cartel li em{font-style:normal;color:var(--tinta-sec);}
@keyframes plato{to{opacity:1;transform:none;}}
.cartel__precio{position:absolute;top:-18px;right:clamp(18px,4vw,42px);width:96px;height:96px;
  border-radius:50%;background:var(--acento);color:#fff;display:grid;place-content:center;
  text-align:center;line-height:1.1;font-family:var(--display);font-size:28px;
  transform:rotate(-7deg);box-shadow:0 16px 32px -18px rgba(110,32,16,.9);}
.pizarra .cartel__precio{background:var(--acento-osc);}
.cartel__precio small{display:block;font-family:var(--detalle);font-size:9.5px;letter-spacing:.08em;
  text-transform:uppercase;opacity:.9;margin-top:3px;}
.cartel__pie{margin-top:clamp(22px,3vw,32px);display:flex;flex-wrap:wrap;gap:12px;align-items:center;}
.cartel__nota{font-size:var(--t1);color:var(--tinta-sec);margin:0;}
.pizarra .cartel .btn--fill{background:var(--acento-osc);border-color:var(--acento-osc);color:#fff;}

/* ═══ RESEÑAS ═══ */
.dicen{padding:clamp(56px,9vw,120px) 0;background:var(--fondo-alt);}
.dicen__cab{margin-bottom:clamp(26px,4vw,44px);}
.dicen__g{display:grid;gap:18px;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));}
.dicho{margin:0;background:var(--fondo);border:1px solid var(--filete);border-radius:22px;
  padding:clamp(22px,2.6vw,30px);display:flex;flex-direction:column;gap:14px;
  transition:transform .4s var(--ease),box-shadow .4s var(--ease);}
.dicho:hover{transform:translateY(-4px);box-shadow:0 26px 50px -38px rgba(40,20,12,.6);}
.dicho__e{margin:0;color:var(--acento);letter-spacing:.16em;font-size:13px;}
.dicho blockquote{margin:0;font-size:var(--t1);line-height:1.5;}
.dicho figcaption{font-family:var(--detalle);font-size:12.5px;letter-spacing:.04em;color:var(--tinta);margin-top:auto;}
.dicho figcaption span{color:var(--tinta-sec);}
.dicen__pie{margin:clamp(22px,3vw,32px) 0 0;}
.dicen__pie a{color:var(--acento);font-family:var(--detalle);font-size:14px;font-weight:600;
  display:inline-flex;align-items:center;min-height:44px;}

/* ═══ HORARIO DE COCINA ═══ */
.horarios.cocina{margin-top:22px;}
.horarios.cocina td:last-child{white-space:nowrap;font-variant-numeric:tabular-nums;}

/* ═══ BOTONES ═══ */
.btn{position:relative;isolation:isolate;overflow:hidden;min-height:54px;padding:0 26px;
  border-radius:100px;gap:12px;font-family:var(--detalle);font-size:13px;font-weight:700;
  letter-spacing:.09em;text-transform:uppercase;
  transition:transform .15s var(--ease),box-shadow .35s var(--ease),border-color .3s,color .3s,background-color .3s;}
.btn:active{transform:scale(.97);}
.btn--fill{background:var(--acento);border:0;color:#fff;box-shadow:0 14px 28px -14px rgba(152,48,26,.75);}
.btn--fill::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--acento-osc);
  transform:translateY(101%);transition:transform .45s cubic-bezier(.22,1,.36,1);}
.btn--fill:hover::before{transform:none;}
.btn--ico{padding-right:8px;}
.btn__c{width:40px;height:40px;border-radius:50%;display:grid;place-content:center;
  background:var(--acento-osc);font-style:normal;transition:transform .45s cubic-bezier(.22,1,.36,1);}
.btn--ico:hover .btn__c{transform:translateX(3px) rotate(-8deg);}
.btn .ar{display:inline-grid;place-content:center;width:30px;height:30px;border-radius:50%;
  background:transparent;margin-right:-12px;transition:transform .45s cubic-bezier(.22,1,.36,1);}
.btn--fill .ar{background:var(--acento-osc);}
.btn:hover .ar{transform:translateX(3px);}
.btn--tel{background:var(--fondo);color:var(--tinta);border:1.5px solid var(--filete-fuerte);}
.btn--tel svg{color:var(--acento);flex:0 0 auto;transition:transform .45s cubic-bezier(.34,1.56,.64,1);}
.btn--tel:hover{border-color:var(--acento);background:color-mix(in srgb, var(--acento) 6%, var(--fondo));}
.btn--tel:hover svg{transform:rotate(-12deg) scale(1.1);}
.top .btn{min-height:44px;padding:0 20px;font-size:12px;}
.top .btn .ar{width:24px;height:24px;margin-right:-10px;}
a:focus-visible,button:focus-visible,input:focus-visible,textarea:focus-visible,.btn:focus-visible{
  outline:3px solid var(--acento);outline-offset:3px;}
.pizarra a:focus-visible,.cifras a:focus-visible{outline-color:var(--acento-claro);}

/* fotos con la esquina de la casa */
.casa__foto img,.mapa,.mapa iframe{border-radius:24px;}

/* ═══ MÓVIL ═══ */
@media(max-width:899px){
  .heroe__platos{height:clamp(210px,58vw,380px);}
  .pl--1{left:0;top:4%;width:64%;height:88%;}
  .pl--2{right:0;top:0;width:40%;height:46%;}
  .pl--3{right:3%;bottom:0;width:40%;height:44%;}
  .pl figcaption{font-size:10.5px;padding:5px 10px;left:8px;bottom:8px;}
  .pl__m{border-radius:20px;box-shadow:0 22px 40px -26px rgba(30,20,14,.6),0 0 0 4px var(--fondo);}
  .heroe__in{display:flex;flex-direction:column;align-items:stretch;}
  .heroe__txt{display:contents;}
  .heroe__kicker{order:1;margin-bottom:12px;}
  .heroe .heroe__h{order:2;margin-bottom:18px;font-size:clamp(42px,12vw,60px);}
  .heroe__platos{order:3;margin-bottom:22px;}
  .heroe__btns{order:4;flex-direction:column;margin-bottom:16px;}
  .heroe .hoy{order:5;margin-bottom:6px;}
  .heroe__nota{order:6;}
}
@media(max-width:719px){
  *{-webkit-tap-highlight-color:transparent;}
  .heroe{padding-top:14px;}
  .heroe__kicker span{font-size:10px;letter-spacing:.12em;padding:6px 10px;}
  .heroe__btns .btn,.cierre__btns .btn,.cartel__pie .btn{width:100%;justify-content:center;}
  .cartel{padding:24px 20px 22px;border-radius:22px;}
  .cartel__dia{font-size:36px;}
  .cartel__precio{width:78px;height:78px;font-size:22px;top:-16px;right:16px;}
  .cartel__pie{flex-direction:column;align-items:stretch;text-align:center;}
  .dicen__g{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:14px;
    margin:0 calc(var(--gutter) * -1);padding:4px var(--gutter) 16px;scrollbar-width:none;}
  .dicen__g::-webkit-scrollbar{display:none;}
  .dicho{flex:0 0 86%;scroll-snap-align:start;}
  .dicho:hover{transform:none;}
  .casa__foto img{height:220px;object-fit:cover;}
  .mapa,.mapa iframe{height:240px!important;min-height:0!important;}
}
@media (prefers-reduced-motion: reduce){
  .carga{display:none!important;}
  .heroe__h .l>span,.heroe__txt>*,.pl,.cartel li{transform:none!important;opacity:1!important;transition:none!important;animation:none!important;}
  .pl{transform:rotate(var(--r))!important;}
  .pl__m{animation:none!important;}
}

/* ═══ PANTALLA DE CARGA ═══ */
.carga{position:fixed;inset:0;z-index:200;display:flex;flex-direction:column;align-items:center;
  justify-content:center;background:var(--osc);overflow:hidden;
  clip-path:inset(0 0 0 0);transition:clip-path 1.05s cubic-bezier(.87,0,.13,1);}
.carga.fuera{clip-path:inset(0 0 100% 0);}
.carga__halo{position:absolute;width:min(78vw,420px);aspect-ratio:1;border-radius:50%;
  background:radial-gradient(circle, rgba(224,145,115,.5) 0%, rgba(224,145,115,0) 68%);
  opacity:0;animation:halo-in .9s ease-out forwards, halo 2.4s ease-in-out infinite;}
@keyframes halo-in{to{opacity:.9;}}
@keyframes halo{0%,100%{transform:scale(.9);}50%{transform:scale(1.08);}}
.carga__marca{position:relative;font-family:var(--display);color:var(--osc-tinta);
  font-size:clamp(52px,12vw,104px);line-height:1;margin:0;opacity:0;
  transform:translateY(26px) scale(.86);animation:marca 1s cubic-bezier(.22,1,.36,1) forwards;}
.carga__marca em{color:var(--acento-claro);font-style:italic;}
@keyframes marca{to{opacity:1;transform:none;}}
.carga__linea{position:relative;width:160px;height:1px;margin-top:34px;overflow:hidden;
  background:rgba(255,255,255,.2);opacity:0;animation:aparece .9s .5s forwards;}
.carga__linea i{position:absolute;inset:0;background:var(--acento-claro);transform-origin:left;
  transform:scaleX(0);animation:llena 1.7s .1s cubic-bezier(.4,0,.2,1) forwards;}
@keyframes llena{to{transform:scaleX(1);}}
.carga__pie{position:relative;margin:16px 0 0;font-family:var(--detalle);font-size:11px;
  letter-spacing:.22em;text-transform:uppercase;color:var(--osc-tinta3);
  opacity:0;animation:aparece .9s .7s forwards;}
@keyframes aparece{to{opacity:1;}}
`;
pon("estilos", /\n<\/style>\n<script>document\.documentElement\.className/,
  "\n" + CSS + "</style>\n<script>document.documentElement.className");

/* ── 13 · pantalla de carga ── */
pon("pantalla de carga", /<body([^>]*)>/,
`<body$1>
<div class="carga" id="carga" aria-hidden="true">
  <div class="carga__halo"></div>
  <p class="carga__marca">Alex <em>Jatetxea</em></p>
  <div class="carga__linea"><i></i></div>
  <p class="carga__pie">Eibar · Ego-Gain 10</p>
</div>
<script>
(function(){
  var c = document.getElementById("carga");
  var visto = false;
  try { visto = sessionStorage.getItem("alex-visto") === "1"; } catch(e){}
  if(visto || matchMedia("(prefers-reduced-motion: reduce)").matches){ c.remove(); return; }
  document.documentElement.style.overflow = "hidden";
  function fuera(){
    if(!c.isConnected) return;
    try { sessionStorage.setItem("alex-visto","1"); } catch(e){}
    c.classList.add("fuera");
    document.documentElement.style.overflow = "";
    setTimeout(function(){ c.remove(); }, 1100);
  }
  setTimeout(fuera, 2200);
  setTimeout(fuera, 4000);
})();
</script>`);

/* ── 14 · movimiento del hero y enlaces de teléfono ── */
pon("movimiento del hero", /<\/body>/, `<script>
(function(){
  var h = document.querySelector(".heroe"); if(!h) return;
  // Los botones de teléfono del hero y del cartel: el mismo tel: que el resto.
  // DATOS vive dentro del guion de la plantilla, así que el tel: se copia del
  // enlace que ese guion ya ha rellenado (el de la barra del móvil).
  var ref = document.querySelector('a[href^="tel:"]');
  var tel = ref ? ref.getAttribute("href") : "#";
  ["p-tel","cartel-tel"].forEach(function(id){ var e = document.getElementById(id); if(e) e.href = tel; });

  function encender(){ h.classList.add("vivo"); setTimeout(function(){ h.classList.add("listo"); }, 1700); }
  var carga = document.getElementById("carga");
  setTimeout(encender, carga ? 2350 : 80);

  if(matchMedia("(prefers-reduced-motion: reduce)").matches || !matchMedia("(hover: hover) and (min-width: 900px)").matches) return;
  var pls = [].slice.call(h.querySelectorAll(".pl")), caja = document.getElementById("platos"), pend = false;
  h.addEventListener("pointermove", function(e){
    var r = caja.getBoundingClientRect();
    var ex = (e.clientX - (r.left + r.width/2)) / r.width, ey = (e.clientY - (r.top + r.height/2)) / r.height;
    if(pend) return; pend = true;
    requestAnimationFrame(function(){
      pls.forEach(function(p){ var k = +p.dataset.prof || 16;
        p.style.setProperty("--px", (ex * -k).toFixed(1) + "px");
        p.style.setProperty("--py", (ey * -k).toFixed(1) + "px"); });
      pend = false;
    });
  });
  h.addEventListener("pointerleave", function(){
    pls.forEach(function(p){ p.style.setProperty("--px","0px"); p.style.setProperty("--py","0px"); });
  });
})();
</script>
</body>`);

/* La barra del móvil ofrece WhatsApp; aquí el contacto es el teléfono y el
   correo, así que el botón del medio pasa a ser el correo. */
pon("barra del móvil", /<a id="b-wa"[^>]*>WhatsApp<\/a>/,
'<a href="mailto:baralexrestaurante@gmail.com">Escribir</a>');

/* ═══ 15 · segunda pasada (22/09) ═════════════════════════════════════════
   Lo que salió al revisarla entera:
   · el horario decía "hasta las 23:59" viernes y sábado: cierran a las 24:00
     y a la 1:00 (Google y su propia web)
   · la carta era una columna de 2.478 px: ahora va a dos columnas y con foto
     al pasar por encima de los platos que la tienen
   · no salía que abren a las 8:00 con desayunos (su Instagram anuncia
     "desayunos completos"), ni las comidas de cuadrilla y de empresa que
     ofrecen en su web */

/* A · el día en Alex: de los desayunos a las cenas */
const ICO = {
  cafe: '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9zm13 1h1.5a2.5 2.5 0 0 1 0 5H17M7 3.5s-.8 1 0 2 0 2 0 2M11 3.5s-.8 1 0 2 0 2 0 2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  plato: '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M2.5 4v5M4 4v16M2.5 9h3M21.5 4c-1.5 0-2.5 2-2.5 5s1 3 2.5 3V20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  luna: '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M19 14.5A7.5 7.5 0 0 1 9.5 5 7.5 7.5 0 1 0 19 14.5z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
  copa: '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M7 3h10l-1 7a4 4 0 0 1-8 0L7 3zm5 11v6m-4 0h8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};
const DIA = [
  ["8:00", "Desayunos", "Desayunos completos desde primera hora. Los fines de semana, desde las 9:00.", ICO.cafe],
  ["13:00", "Comidas", "Combinado con bebida y postre por 14 € de lunes a viernes, o la carta entera.", ICO.plato],
  ["19:00", "Cenas", "Raciones para compartir, chuletón y pescado. Cocina hasta las 22:00 o las 23:00, según el día.", ICO.luna],
  ["Vie y sáb", "Hasta tarde", "El bar abre hasta las 24:00 los viernes y hasta la 1:00 los sábados.", ICO.copa],
];
pon("el día en Alex", /<section class="pizarra sector" id="menu">/,
`<section class="dia" id="dia" aria-label="Horario del día">
  <div class="wrap">
    <div class="dia__cab rev">
      <p class="rotulo">De 8 de la mañana a la noche</p>
      <h2>Un día<br/>en Alex</h2>
    </div>
    <ol class="dia__l">
${DIA.map((d, i) => `      <li class="rev" data-d="${i}">
        <span class="dia__ico">${d[3]}</span>
        <b class="dia__h">${d[0]}</b>
        <h3>${d[1]}</h3>
        <p>${d[2]}</p>
      </li>`).join("\n")}
    </ol>
  </div>
</section>

<section class="pizarra sector" id="menu">`);
pon("menú: el día", /<a href="#carta">La carta<\/a>\n      <a href="#menu">El mediodía<\/a>/,
'<a href="#dia">El día</a>\n      <a href="#carta">La carta</a>\n      <a href="#menu">El mediodía</a>');

/* B · la carta: foto al pasar por encima y la especialidad marcada */
const FOTOS = {
  "Chuletón": "photo-1619719015339-133a130520f6",
  "Langostinos a la parrilla": "photo-1559742811-822873691df8",
  "Tarta de queso": "photo-1635327173758-85badf17f995",
  "Entrecot": "photo-1690983325970-185c8a6c0ba6",
};
for (const [plato, id] of Object.entries(FOTOS)) {
  const re = new RegExp(`<article class="plato">\\s*<p class="plato__n">${plato}</p>`);
  pon("foto de " + plato, re,
    `<article class="plato plato--foto" data-foto="${U(id, 520, 72)}">\n          <p class="plato__n">${plato}</p>`);
}
pon("la especialidad", /<p class="plato__n">Chuletón<\/p>/, '<p class="plato__n">Chuletón <span class="sello-casa">La especialidad</span></p>');

/* C · cuadrillas y empresas (lo ofrecen en su web) */
pon("cuadrillas y empresas", /<!-- ═══ RESEÑAS · de su ficha de Google ═══ -->/,
`<section class="grupos" id="grupos">
  <div class="wrap grupos__in">
    <div class="rev">
      <p class="rotulo">Cuadrillas y empresas</p>
      <h2>¿Sois muchos?<br/>Lo preparamos</h2>
    </div>
    <div class="rev" data-d="1">
      <p class="lead">Comidas de cuadrilla, cenas tranquilas, celebraciones y eventos de empresa. Nos contáis cuántos sois y qué queréis, y os hacemos presupuesto sin compromiso.</p>
      <ul class="grupos__l">
        <li>Comidas y cenas de cuadrilla</li>
        <li>Celebraciones</li>
        <li>Eventos de empresa</li>
      </ul>
      <a class="btn btn--fill" id="g-tel" href="#">Llamar y pedir presupuesto <span class="ar" aria-hidden="true">→</span></a>
    </div>
  </div>
</section>

<!-- ═══ RESEÑAS · de su ficha de Google ═══ -->`);

/* D · la cifra floja fuera; en su lugar, lo que de verdad les distingue */
pon("cifra de desayunos", /<li class="rev" data-d="3"><b>8:00<\/b><small>abrimos el bar<\/small><\/li>/,
'<li class="rev" data-d="3"><b>3</b><small>para llevar, a domicilio<br/>o en el local</small></li>');

const CSS2 = `
/* ═══ UN DÍA EN ALEX ═══ */
.dia{padding:clamp(56px,9vw,120px) 0;}
.dia__cab{margin-bottom:clamp(26px,4vw,44px);}
.dia__l{list-style:none;margin:0;padding:0;display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));
  counter-reset:x;position:relative;}
.dia__l li{position:relative;background:var(--fondo);border:1px solid var(--filete);border-radius:22px;
  padding:24px 22px 22px;transition:transform .4s var(--ease),box-shadow .4s var(--ease),border-color .3s;}
.dia__l li:hover{transform:translateY(-5px);border-color:var(--acento-claro);box-shadow:0 26px 50px -36px rgba(110,32,16,.55);}
.dia__ico{display:grid;place-content:center;width:52px;height:52px;border-radius:16px;margin-bottom:18px;
  color:var(--acento);background:color-mix(in srgb, var(--acento) 9%, var(--fondo));}
.dia__h{display:block;font-family:var(--display);font-size:clamp(30px,3.2vw,40px);line-height:1;color:var(--acento);}
.dia__l h3{margin:6px 0 8px;font-size:19px;}
.dia__l p{margin:0;color:var(--tinta-sec);font-size:15.5px;line-height:1.5;}
@media(min-width:1000px){
  .dia__l::before{content:"";position:absolute;left:4%;right:4%;top:50px;height:1px;
    background:linear-gradient(90deg,transparent,var(--filete-fuerte) 12%,var(--filete-fuerte) 88%,transparent);z-index:-1;}
}

/* ═══ LA CARTA A DOS COLUMNAS ═══ */
/* Columnas de texto, no rejilla: con rejilla quedaban Raciones (11 platos) a
   un lado y Ensaladas (3) al otro, con un hueco enorme debajo. Las columnas
   reparten los grupos por altura, y ningún grupo se parte entre las dos. */
@media(min-width:900px){
  .carta .wrap{column-count:2;column-gap:clamp(36px,5vw,72px);}
  .carta .carta__cab{column-span:all;}
  .carta .grupo{break-inside:avoid;}
}
.carta .grupo{margin-bottom:clamp(26px,3vw,38px);}
.carta .plato{transition:background .25s var(--ease),padding .25s var(--ease);border-radius:12px;}
.carta .plato:hover{background:color-mix(in srgb, var(--acento) 5%, transparent);padding-left:10px;padding-right:10px;}
.sello-casa{display:inline-block;vertical-align:middle;margin-left:8px;padding:4px 10px;border-radius:100px;
  background:var(--acento);color:#fff;font-family:var(--detalle);font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;}
.plato--foto .plato__n::after{content:"";display:inline-block;width:8px;height:8px;margin-left:8px;border-radius:50%;
  background:var(--acento-claro);vertical-align:middle;}
/* foto que sigue al puntero (solo escritorio) */
.foto-plato{position:fixed;z-index:60;width:230px;aspect-ratio:4/3;border-radius:18px;overflow:hidden;pointer-events:none;
  box-shadow:0 30px 60px -24px rgba(20,10,5,.55),0 0 0 5px var(--fondo);
  opacity:0;transform:translate(-50%,-110%) scale(.85) rotate(-4deg);transition:opacity .25s var(--ease),transform .35s cubic-bezier(.34,1.4,.64,1);}
.foto-plato.on{opacity:1;transform:translate(-50%,-110%) scale(1) rotate(-3deg);}
.foto-plato img{width:100%;height:100%;object-fit:cover;}
/* en móvil, la foto va dentro del plato */
.plato__mini{display:none;}
@media(hover:none),(max-width:899px){
  .plato--foto{display:grid;grid-template-columns:1fr auto;column-gap:14px;}
  .plato__mini{display:block;grid-row:1 / span 3;grid-column:2;width:64px;height:64px;border-radius:14px;overflow:hidden;align-self:center;}
  .plato__mini img{width:100%;height:100%;object-fit:cover;}
  .plato--foto .plato__n::after{display:none;}
}

/* ═══ CUADRILLAS Y EMPRESAS ═══ */
.grupos{padding:clamp(56px,9vw,120px) 0;}
.grupos__in{display:grid;gap:clamp(22px,4vw,64px);align-items:center;}
@media(min-width:900px){.grupos__in{grid-template-columns:.9fr 1.1fr;}}
.grupos__l{list-style:none;margin:20px 0 26px;padding:0;display:flex;flex-wrap:wrap;gap:8px;}
.grupos__l li{padding:9px 16px;border-radius:100px;border:1px solid var(--filete-fuerte);font-size:15px;}

/* En el móvil, las cuatro franjas del día en carrusel: apiladas añadían casi
   1.000 px a una página que ya es larga por la carta. */
@media(max-width:719px){
  .dia{padding:48px 0;}
  .dia__l{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:12px;
    margin:0 calc(var(--gutter) * -1);padding:4px var(--gutter) 14px;scrollbar-width:none;}
  .dia__l::-webkit-scrollbar{display:none;}
  .dia__l li{flex:0 0 78%;scroll-snap-align:start;}
  .grupos{padding:48px 0;}
}

@media (prefers-reduced-motion: reduce){ .foto-plato{transition:none;} .dia__l li:hover{transform:none;} }
`;
pon("estilos de la segunda pasada", /\n<\/style>\n<script>document\.documentElement\.className/,
  "\n" + CSS2 + "</style>\n<script>document.documentElement.className");

pon("guion de la segunda pasada", /<\/body>/, `<script>
(function(){
  /* El horario de la tabla: DATOS lleva 23:59 porque el cálculo de "abierto
     ahora" no admite pasar de medianoche, pero lo que se enseña es la hora
     de verdad. */
  var filas = document.querySelectorAll("#tabla-horario tr");
  filas.forEach(function(tr){
    var dia = tr.cells[0] && tr.cells[0].textContent.trim().toLowerCase();
    if(dia === "viernes") tr.cells[1].textContent = "08:00–00:00";
    if(dia === "sábado") tr.cells[1].textContent = "09:00–01:00";
  });

  var ref = document.querySelector('a[href^="tel:"]');
  var g = document.getElementById("g-tel"); if(g && ref) g.href = ref.getAttribute("href");

  /* Fotos de la carta: en escritorio, una tarjeta que sigue al puntero; en
     táctil, una miniatura dentro del propio plato. */
  var platos = [].slice.call(document.querySelectorAll(".plato--foto"));
  var tactil = matchMedia("(hover: none), (max-width: 899px)").matches;
  if(tactil){
    platos.forEach(function(p){
      var m = document.createElement("span"); m.className = "plato__mini";
      m.innerHTML = '<img loading="lazy" alt="" src="' + p.dataset.foto + '">';
      p.appendChild(m);
    });
    return;
  }
  var caja = document.createElement("div"); caja.className = "foto-plato"; caja.setAttribute("aria-hidden","true");
  caja.innerHTML = "<img alt=''>"; document.body.appendChild(caja);
  var img = caja.querySelector("img");
  platos.forEach(function(p){
    var pre = new Image(); pre.src = p.dataset.foto;
    p.addEventListener("pointerenter", function(){ img.src = p.dataset.foto; caja.classList.add("on"); });
    p.addEventListener("pointerleave", function(){ caja.classList.remove("on"); });
    p.addEventListener("pointermove", function(e){ caja.style.left = e.clientX + "px"; caja.style.top = e.clientY + "px"; });
  });
})();
</script>
</body>`);

/* ═══ 16 · salto de calidad (23/09) ═══════════════════════════════════════
   Lo que separa una plantilla bien rellenada de una web que parece hecha a
   medida: movimiento con intención, navegación dentro de la carta y un cierre
   que no se pueda ignorar. Todo con transform/opacity y apagado con
   prefers-reduced-motion. */

/* A · cinta de platos: los nombres reales de su carta, en movimiento */
const CINTA = ["Chuletón de 1 kg", "Croquetas de la casa", "Langostinos a la parrilla", "Huevos rotos con jamón",
  "Rape al horno", "Tabla de jamón ibérico", "Entrecot", "Tarta de queso", "Papa Alex", "Dorada al limón"];
const tira = CINTA.map((p) => `<span>${p}</span><i aria-hidden="true">✦</i>`).join("");
pon("cinta de platos", /<section class="dia" id="dia"/,
`<div class="cinta" aria-label="Algunos platos de la carta">
  <div class="cinta__pista"><div class="cinta__g">${tira}</div><div class="cinta__g" aria-hidden="true">${tira}</div></div>
</div>

<section class="dia" id="dia"`);

/* B · índice de la carta: saltar a cada grupo sin deslizar a ciegas */
pon("índice de la carta", /(<p class="lead rev" data-d="1">Los precios son los de vuestra carta\.[^<]*<\/p>\s*<\/div>)/,
`$1
    <nav class="indice rev" aria-label="Secciones de la carta">
      <a href="#c-raciones">Raciones</a><a href="#c-ensaladas">Ensaladas</a><a href="#c-especiales">Especiales</a><a href="#c-postres">Postres</a>
    </nav>`);
for (const [grupo, id] of [["Raciones", "c-raciones"], ["Ensaladas", "c-ensaladas"], ["Especiales de la casa", "c-especiales"], ["Postres", "c-postres"]]) {
  pon("ancla " + grupo, new RegExp(`<div class="grupo rev">\\s*<h3>${grupo}</h3>`), `<div class="grupo rev" id="${id}">\n        <h3>${grupo}</h3>`);
}

/* C · cierre a lo grande: el teléfono como protagonista */
pon("cierre con el teléfono en grande", /<p class="rotulo rev">Reservar<\/p>\s*<h2 class="rev" data-d="1">Una llamada<br\/>y mesa puesta<\/h2>/,
`<p class="rotulo rev">Reservar</p>
 <h2 class="rev" data-d="1">Una llamada<br/>y mesa puesta</h2>
 <a class="gran-tel rev" data-d="2" id="gran-tel" href="#"><span>608</span> <span>85 91 88</span></a>`);

/* El cierre de la plantilla ofrece WhatsApp: no está confirmado que lo usen
   (en su web piden llamar o escribir un correo). */
pon("cierre sin WhatsApp", /<a class="btn btn--ghost" id="c-wa"[^>]*>WhatsApp<\/a>/,
  '<a class="btn btn--ghost" href="mailto:baralexrestaurante@gmail.com">Escribir un correo</a>');

const CSS3 = `
/* ═══ CINTA DE PLATOS ═══ */
.cinta{overflow:hidden;background:var(--osc);color:var(--osc-tinta);padding:18px 0;border-block:1px solid var(--osc-filete);}
.cinta__pista{display:flex;width:max-content;animation:cinta 42s linear infinite;}
.cinta:hover .cinta__pista{animation-play-state:paused;}
.cinta__g{display:flex;align-items:center;gap:28px;padding-right:28px;}
.cinta span{font-family:var(--display);font-size:clamp(22px,2.6vw,34px);white-space:nowrap;line-height:1;}
.cinta i{font-style:normal;color:var(--acento-claro);font-size:14px;}
@keyframes cinta{to{transform:translateX(-50%);}}

/* ═══ ÍNDICE DE LA CARTA ═══ */
.indice{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 clamp(22px,3vw,34px);column-span:all;}
.indice a{min-height:44px;display:inline-flex;align-items:center;padding:0 18px;border-radius:100px;
  border:1px solid var(--filete-fuerte);font-family:var(--detalle);font-size:12.5px;font-weight:700;letter-spacing:.08em;
  text-transform:uppercase;color:var(--tinta);transition:background .25s,color .25s,border-color .25s;}
.indice a:hover,.indice a.activo{background:var(--acento);border-color:var(--acento);color:#fff;}
.carta .grupo{scroll-margin-top:110px;}
/* los platos entran de uno en uno al aparecer su grupo */
.carta .grupo .plato{opacity:0;transform:translateY(10px);transition:opacity .5s var(--ease),transform .6s var(--ease);}
.carta .grupo.on .plato{opacity:1;transform:none;}
${Array.from({ length: 11 }, (_, i) => `.carta .grupo.on .plato:nth-of-type(${i + 1}){transition-delay:${(i * 0.035).toFixed(3)}s;}`).join("\n")}
html:not(.js) .carta .grupo .plato{opacity:1;transform:none;}

/* ═══ TELÉFONO EN GRANDE ═══ */
.gran-tel{display:inline-flex;gap:.25em;margin:10px 0 18px;font-family:var(--display);line-height:1;
  font-size:clamp(46px,7vw,96px);color:inherit;text-decoration:none;letter-spacing:-.01em;}
.gran-tel span:first-child{color:var(--acento-claro);}
.gran-tel:hover span:last-child{text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:.12em;}

/* ═══ BOTONES MAGNÉTICOS (escritorio) ═══ */
.btn--mag{transition:transform .35s cubic-bezier(.22,1,.36,1),box-shadow .35s var(--ease);}

/* ═══ HERO: grano sutil sobre el fondo ═══ */
.heroe{position:relative;isolation:isolate;}
.heroe::before{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;opacity:.35;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.35 0 0 0 0 0.2 0 0 0 0 0.1 0 0 0 .09 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}

@media (prefers-reduced-motion: reduce){
  .cinta__pista{animation:none;}
  .carta .grupo .plato{opacity:1!important;transform:none!important;transition:none!important;}
}
`;
pon("estilos del salto de calidad", /\n<\/style>\n<script>document\.documentElement\.className/,
  "\n" + CSS3 + "</style>\n<script>document.documentElement.className");

pon("guion del salto de calidad", /<\/body>/, `<script>
(function(){
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* teléfono grande del cierre */
  var ref = document.querySelector('a[href^="tel:"]'), gt = document.getElementById("gran-tel");
  if(ref && gt) gt.href = ref.getAttribute("href");

  /* carta: los grupos se encienden al entrar en pantalla, y el índice marca
     el grupo que se está viendo */
  var grupos = [].slice.call(document.querySelectorAll(".carta .grupo[id]"));
  var enlaces = [].slice.call(document.querySelectorAll(".indice a"));
  if("IntersectionObserver" in window){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add("on");
          enlaces.forEach(function(a){ a.classList.toggle("activo", a.getAttribute("href") === "#" + e.target.id); });
        }
      });
    }, { rootMargin: "-20% 0px -55% 0px" });
    grupos.forEach(function(g){ io.observe(g); });
    // y el reparto: que ningún grupo se quede apagado si se entra de golpe
    var io2 = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting) e.target.classList.add("on"); }); }, { threshold: .05 });
    grupos.forEach(function(g){ io2.observe(g); });
  } else { grupos.forEach(function(g){ g.classList.add("on"); }); }

  /* botones magnéticos: solo con ratón y en pantallas grandes */
  if(reduce || !matchMedia("(hover: hover) and (min-width: 900px)").matches) return;
  document.querySelectorAll(".heroe .btn, .cierre .btn, .grupos .btn").forEach(function(b){
    b.classList.add("btn--mag");
    b.addEventListener("pointermove", function(e){
      var r = b.getBoundingClientRect();
      var x = (e.clientX - r.left - r.width/2) * .18, y = (e.clientY - r.top - r.height/2) * .28;
      b.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
    });
    b.addEventListener("pointerleave", function(){ b.style.transform = ""; });
  });
})();
</script>
</body>`);

fs.writeFileSync(F, s);
console.log("ajustado (" + antes + " → " + s.length + " caracteres)");
hecho.forEach((h) => console.log("  · " + h));
