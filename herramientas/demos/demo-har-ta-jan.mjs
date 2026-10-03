/**
 * Ajusta la demo de Har' ta jan con lo que se sabe de ellos de verdad:
 * su Instagram (@har_ta_jan), sus tres carteles de menú y su WhatsApp.
 *
 * Se ejecuta DESPUÉS de generar-demo.mjs, que deja la plantilla de asador.
 * Har' ta jan no es un asador de parrilla: es comida casera para llevar,
 * solo a mediodía, con el menú del día como producto.
 *
 *   node herramientas/demos/generar-demo.mjs --id 413
 *   node <este fichero>
 */
import fs from "node:fs";

const F = "web/demos/clientes/har-ta-jan/index.html";
let s = fs.readFileSync(F, "utf8");
const antes = s.length;
const hecho = [];
function pon(desc, re, con) {
  const nuevo = s.replace(re, con);
  if (nuevo === s) { console.log("!! no encontrado: " + desc); return; }
  s = nuevo; hecho.push(desc);
}

/* ── 0 · color: verde natural sobre blanco ──────────────────────────────
   La plantilla del asador va en crema y rojo teja, que es de parrilla y de
   carbón. Har' ta jan vende comida casera del día: verdura, ensaladilla,
   porrusalda. El verde y el blanco cuentan eso, y además el blanco deja que
   la foto del plato sea lo único con color en la pantalla. */
/* Segunda paleta: «huerta y mantel». El verde se queda —es lo que pidió
   Oier y cuenta verdura y casa—, pero se le suma el color que ya usa el
   propio negocio: el naranja de cuadros de mantel que enmarca sus carteles
   de Instagram. Tomate para el sello del precio y los acentos, melocotón muy
   claro para los fondos alternos. Blanco de base. */
const COLOR = {
  "--fondo": "#FFFFFF",
  "--fondo-alt": "#FFF5EE",
  "--filete": "#EFE0D5",
  "--tinta": "#1D2420",
  "--tinta-sec": "#58605A",
  "--acento": "#2E5E3E",
  "--acento-con": "#FFFFFF",
  "--acento-osc": "#1F4530",
  "--acento-claro": "#9FCDA9",
  "--filete-fuerte": "#DCC6B6",
  "--osc": "#1B2A21",
  "--osc-filete": "#2F4036",
  "--osc-tinta": "#E3EBE0",
  "--osc-tinta2": "#B9C6B5",
  "--osc-tinta3": "#8FA08C",
  "--ok-claro": "#9FCDA9",
};
for (const [clave, valor] of Object.entries(COLOR)) {
  pon("color " + clave, new RegExp("(\\n\\s*" + clave + ":)[^;]*;"), "$1" + valor + ";");
}

/* ── 1 · DATOS: precio, WhatsApp de pedidos y los tres menús reales ── */
pon("reclamo", /reclamo:\s*"[^"]*"/, 'reclamo: "Comida casera hecha cada día para llevar."');
pon("cocina", /cocina:\s*"[^"]*"/, 'cocina: "Casera · Para llevar"');
// Google: "€10-20 por persona, informado por 16 personas".
pon("precio", /\n\s*precio:\s*"[^"]*"/, '\n  precio: "10-20 €"');
// El enlace de alérgenos del pie promete una información que no tenemos.
pon("sin enlace de alérgenos", / · <a href="#">Alérgenos<\/a>/, "");
// El WhatsApp de pedidos no es el teléfono fijo: sale en sus carteles.
pon("whatsapp de pedidos", /whatsapp:\s*"[^"]*"/, 'whatsapp: "34603112955"');
pon("precio del menú", /menuPrecio:\s*"[^"]*"/, 'menuPrecio: "12 €"');
pon("qué incluye", /menuIncluye:\s*"[^"]*"/, 'menuIncluye: "Incluye pan"');

const menus = `menuDia: {
    1:null,
    2:null,
    3:null,
    4:{ primeros:["Vainas con refrito","Espaguetis a la boloñesa","Marmitako","Ensaladilla rusa"],
        segundos:["Pechuga rellena de espinacas","Chuleta tipo sajonia con pimiento rojo","Salmón a la plancha","Merluza rebozada"],
        postres:["Arroz con leche","Panna cotta","Tarta de queso","Flan de huevo"] },
    5:{ primeros:["Alcachofas fritas con jamón","Paella de carne","Ensaladilla rusa","Macarrones con tomate y chorizo"],
        segundos:["Pechuga rellena de bechamel","Cachopo de jamón y queso","Albóndigas en tomate","Chipirones en su tinta"],
        postres:["Arroz con leche","Natillas","Flan de huevo","Tarta de queso"] },
    6:{ primeros:["Paella de marisco","Ensalada de patata con tomate","Ensaladilla rusa","Porrusalda"],
        segundos:["Cachopo de boletus con patatas fritas","Costilla de cerdo al horno","Albóndigas en salsa de verduras","Chipirones en su tinta"],
        postres:["Arroz con leche","Natillas","Flan de huevo","Tarta de queso"] },
    0:null,
  },`;
pon("menús de jueves, viernes y sábado", /menuDia:\s*\{[\s\S]*?\n\s*\},/, menus);

/* ── 2 · el bloque del menú: postres y un aviso honesto los días sin cartel ── */
pon("postres en el menú de hoy",
  /  c\.innerHTML = `\n\s*<h4>Primeros[\s\S]*?m\.segundos\.map\(p=>`<li>\$\{p\}<\/li>`\)\.join\(""\)\}<\/ul>`;/,
  '  c.innerHTML = `\n' +
  '    <h4>Primeros — a elegir</h4>\n' +
  '    <ul>${m.primeros.map(p=>`<li>${p}</li>`).join("")}</ul>\n' +
  '    <h4>Segundos — a elegir</h4>\n' +
  '    <ul>${m.segundos.map(p=>`<li>${p}</li>`).join("")}</ul>\n' +
  '    ${m.postres ? `<h4>Postres — a elegir</h4><ul>${m.postres.map(p=>`<li>${p}</li>`).join("")}</ul>` : ""}`;');

pon("aviso los días sin cartel",
  /\s*dia\.textContent\s*= "Hoy no hay menú del día";\s*\n\s*incl\.textContent = "[^"]*";\s*\n\s*c\.innerHTML = `<p class="pizarra__cerrado">[^`]*`;/,
  '\n    dia.textContent  = "El menú de hoy, al teléfono";\n' +
  '    incl.textContent = "Cambia cada día. Llámanos y te lo contamos.";\n' +
  '    c.innerHTML = `<p class="pizarra__cerrado">Aquí iría el menú de hoy, el mismo cartel que colgáis cada mañana en Instagram, puesto desde el móvil en diez segundos.</p>`;');

pon("texto del WhatsApp", /quería reservar mesa en "\+DATOS\.nombre\+"\./, 'quería hacer un encargo en "+DATOS.nombre+".');

/* ── 2b · la marca de la cabecera: no son un asador ── */
pon("marca de la cabecera", /<a class="marca" href="#inicio">[^<]*<em>[^<]*<\/em><\/a>/,
'<a class="marca" href="#inicio">Har\' ta jan <em>Para llevar</em></a>');

pon("botón de la cabecera", /<a class="btn btn--fill top__cta" href="#contacto">Reservar /,
'<a class="btn btn--fill top__cta" href="#contacto">Encargar ');

/* El nombre real es más largo que el de la plantilla ("Asador Mendiola" cabía,
   "Har' ta jan · Para llevar" no), así que entre 900 y 1100 px la cabecera se
   partía en dos líneas. El aviso de horario es lo primero que sobra: se sigue
   viendo en la sección de "Dónde estamos". */
pon("cabecera en pantallas medianas", /\n<\/style>\n<script>document\.documentElement\.className/,
`
@media(max-width:1100px){ .top .estado{display:none;} }
@media(max-width:1023px){ .marca em{display:none;} }
</style>
<script>document.documentElement.className`);

/* ── 3 · portada: el texto a un lado, los platos al otro ─────────────────
   Los platos van DENTRO del hero, no debajo: en escritorio a la derecha del
   titular y en móvil entre el titular y los botones, así que a la primera
   pantalla se ve qué se come, qué hay hoy y cómo encargarlo. */
const U = (id, w, q) => `https://images.unsplash.com/${id}?w=${w}&q=${q}&auto=format&fit=crop`;
const PLATOS = [
  { id: "photo-1650964807311-970cb88d347c", alt: "Paella de marisco en la paellera", pie: "Sábado · Paella de marisco", w: 1200, h: 1500 },
  { id: "photo-1682988771291-da784f151ef7", alt: "Paella de carne recién hecha", pie: "Viernes · Paella de carne", w: 800, h: 1000 },
  { id: "photo-1702728109878-c61a98d80491", alt: "Flan de huevo con caramelo", pie: "De postre · Flan de huevo", w: 800, h: 600 },
];
const ICO_FLECHA = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ICO_CHAT = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 3.5a8.5 8.5 0 0 0-7.4 12.7L3.5 20.5l4.4-1.1A8.5 8.5 0 1 0 12 3.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8.8 9.2c.3 2.4 2.3 4.6 5.3 5.6l1.3-1.3-1.9-1-1 .7c-.9-.5-1.7-1.3-2.1-2.2l.7-1-1-1.9z" fill="currentColor"/></svg>';

pon("portada", /<section class="portada" id="inicio">[\s\S]*?<\/section>/,
`<section class="portada heroe" id="inicio">
  <div class="wrap heroe__in">
    <div class="heroe__txt">
      <p class="heroe__kicker"><span>Comida para llevar</span><span>Eramateko janaria</span></p>
      <h1 class="heroe__h"><span class="l"><span>Comida de casa,</span></span><span class="l"><span>hecha <em>cada día</em></span></span></h1>
      <p class="hoy" id="hoy-chip" hidden></p>
      <div class="heroe__btns">
        <a class="btn btn--fill btn--ico" href="#menu"><span>Ver el menú del día</span><i class="btn__c">${ICO_FLECHA}</i></a>
        <a class="btn btn--wa" id="p-wa" href="#" target="_blank" rel="noopener">${ICO_CHAT}<span>Encargar por WhatsApp</span></a>
      </div>
      <p class="heroe__nota"><b>12 €</b> el menú con pan · Solo a mediodía · Mandoegi kalea 2</p>
    </div>
    <div class="heroe__platos" id="platos">
${PLATOS.map((p, i) => `      <figure class="pl pl--${i + 1}" data-prof="${[14, 26, 20][i]}">
        <div class="pl__m"><img src="${U(p.id, i ? 700 : 1100, 76)}"${i ? "" : ` srcset="${U(p.id, 700, 72)} 700w, ${U(p.id, 1100, 76)} 1100w" sizes="(max-width: 899px) 70vw, 36vw" fetchpriority="high"`} decoding="async" alt="${p.alt}" width="${p.w}" height="${p.h}"/></div>
        <figcaption>${p.pie}</figcaption>
      </figure>`).join("\n")}
      <span class="heroe__sello" aria-hidden="true">12€<small>con pan</small></span>
    </div>
  </div>
</section>`);

/* ── 4 · la carta pasa a ser los menús de la semana ── */
const dias = [
  ["Jueves", ["Vainas con refrito", "Espaguetis a la boloñesa", "Marmitako", "Ensaladilla rusa"],
    ["Pechuga rellena de espinacas", "Chuleta tipo sajonia con pimiento rojo", "Salmón a la plancha", "Merluza rebozada"],
    ["Arroz con leche", "Panna cotta", "Tarta de queso", "Flan de huevo"]],
  ["Viernes", ["Alcachofas fritas con jamón", "Paella de carne", "Ensaladilla rusa", "Macarrones con tomate y chorizo"],
    ["Pechuga rellena de bechamel", "Cachopo de jamón y queso", "Albóndigas en tomate", "Chipirones en su tinta"],
    ["Arroz con leche", "Natillas", "Flan de huevo", "Tarta de queso"]],
  ["Sábado", ["Paella de marisco", "Ensalada de patata con tomate", "Ensaladilla rusa", "Porrusalda"],
    ["Cachopo de boletus con patatas fritas", "Costilla de cerdo al horno", "Albóndigas en salsa de verduras", "Chipirones en su tinta"],
    ["Arroz con leche", "Natillas", "Flan de huevo", "Tarta de queso"]],
];
const grupo = (d) => `
 <div class="grupo rev">
 <h3>${d[0]}</h3>
 <article class="plato">
 <p class="plato__n">Primeros</p>
 <p class="plato__p">12 €<em>/menú</em></p>
 <p class="plato__d">${d[1].join(" · ")}<i>A elegir</i></p>
 </article>
 <article class="plato">
 <p class="plato__n">Segundos</p>
 <p class="plato__d">${d[2].join(" · ")}<i>A elegir</i></p>
 </article>
 <article class="plato">
 <p class="plato__n">Postres</p>
 <p class="plato__d">${d[3].join(" · ")}<i>Caseros</i></p>
 </article>
 </div>`;

pon("menús de la semana", /<section class="carta" id="carta">[\s\S]*?<\/section>/,
`<section class="carta" id="carta">
 <div class="wrap">
 <div class="carta__cab">
 <div class="rev">
 <p class="rotulo">Los menús</p>
 <h2>Jueves, viernes y sábado,<br/>12 € el menú</h2>
 </div>
 <p class="lead rev" data-d="1">Estos son los últimos menús que habéis publicado. En la web se cambiarían desde el móvil, igual que colgáis el cartel.</p>
 </div>
${dias.map(grupo).join("\n")}
 </div>
</section>`);

/* ── 5 · la casa: lo que se sabe de ellos, y nada más ── */
pon("la casa", /<section class="casa" id="casa">[\s\S]*?<\/section>/,
`<section class="casa" id="casa">
 <div class="wrap">
 <p class="rotulo rev">La casa</p>
 <h2 class="casa__t rev" data-d="1">Comida casera para llevar, en Galtzaraborda</h2>
 <div class="casa__cols rev" data-d="2">
 <p>Abrimos en mayo de 2022 en Mandoegi kalea, y desde entonces cocinamos cada día el menú: primeros, segundos y postres de casa, para llevar o comer aquí.</p>
 <p>El menú son <span class="subr">12 € con pan</span> y cambia todos los días. Los encargos, por teléfono o por WhatsApp.</p>
 <p>Estamos solo al mediodía, de lunes a sábado. Los domingos cerramos.</p>
 </div>
 <figure class="casa__foto rev" data-d="2">
 <img loading="lazy" width="1400" height="600"
 src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=80&auto=format&fit=crop"
 alt="Bandejas de comida casera preparadas para llevar"/>
 <figcaption>Aquí irían vuestras fotos</figcaption>
 </figure>
 </div>
</section>`);

/* ── 6 · fuera la galería: no tenemos fotos suyas y las de banco mienten ── */
pon("galería de fotos ajenas", /<!-- ═══ 6 · TIRA[\s\S]*?<\/section>\n/, "");

/* ── 7 · cierre: encargar, no reservar mesa ── */
pon("cierre", /<p class="rotulo rev">Reservar<\/p>\s*<h2 class="rev" data-d="1">[^<]*<br\/>[^<]*<\/h2>\s*<p class="cierre__lead rev" data-d="2">[^<]*<\/p>/,
`<p class="rotulo rev">Encargar</p>
 <h2 class="rev" data-d="1">Llámanos<br/>o mándanos un WhatsApp</h2>
 <p class="cierre__lead rev" data-d="2">Dinos qué quieres por teléfono o por WhatsApp.</p>`);
pon("botón de llamar", /Llamar ahora/, "Llamar al 943 384 080");
pon("campo del formulario", /<label for="f-com">Día, hora y cuántos sois<\/label><input id="f-com" name="comensales" type="text" placeholder="[^"]*"\/>/,
'<label for="f-com">Qué quieres y a qué hora lo recoges</label><input id="f-com" name="comensales" type="text" placeholder="2 menús · a las 13:30"/>');
pon("botón del formulario", /Pedir reserva/, "Hacer el encargo");
pon("aviso del formulario", /Te confirmamos por teléfono en cuanto lo veamos\./, "Te confirmamos por teléfono o WhatsApp en cuanto lo veamos.");

/* ── 8 · cabecera, título y menú de navegación ── */
pon("título", /<title>[^<]*<\/title>/, "<title>Har' ta jan — Comida casera para llevar en Errenteria</title>");
pon("descripción", /<meta name="description" content="[^"]*"\/>/,
'<meta name="description" content="Comida casera para llevar en Errenteria. Menú del día 12 € con pan, cambia cada día. Encargos por teléfono o WhatsApp."/>');
pon("og:title", /<meta property="og:title" content="[^"]*"\/>/,
'<meta property="og:title" content="Har\' ta jan — Comida casera para llevar en Errenteria"/>');
pon("og:description", /<meta property="og:description" content="[^"]*"\/>/,
'<meta property="og:description" content="Menú del día 12 €, incluye pan. Cambia cada día."/>');
pon("menú de navegación", /<a href="#carta">La carta<\/a>\s*<a href="#menu">Menú del día<\/a>/,
'<a href="#menu">Menú del día</a>\n      <a href="#carta">Los menús</a>');
pon("dónde estamos", /<h2 class="rev" data-d="1" style="max-width:16ch">[^<]*<br\/>[^<]*<\/h2>/,
'<h2 class="rev" data-d="1" style="max-width:16ch">En Mandoegi kalea,<br/>en Galtzaraborda</h2>');

/* ── 9 · el WhatsApp también en la portada, y el Instagram en el pie ── */
pon("botón de WhatsApp de la portada", /\[\["c-wa",waHref\],\["b-wa",waHref\]\]/, '[["c-wa",waHref],["b-wa",waHref],["p-wa",waHref]]');
pon("Instagram en el pie", /<p><a href="#">Aviso legal<\/a>/,
'<p><a href="https://www.instagram.com/har_ta_jan/" target="_blank" rel="noopener">Instagram</a> · <a href="#">Aviso legal</a>');

/* ── 10 · el cartel del día ────────────────────────────────────────────
   Sigue docs/PROMPT-DEMO-COMIDA-DEL-DIA.md: la web ES el cartel de hoy. El
   bloque de "menú del día" de la plantilla era una lista dentro de una caja
   cuadrada; aquí pasa a ser una tarjeta-cartel con el día en grande, tres
   columnas, el precio en un círculo y pestañas para ver los otros días. */
pon("sección del cartel de hoy", /<section class="pizarra sector" id="menu">[\s\S]*?<\/section>/,
`<section class="pizarra sector" id="menu">
  <div class="wrap">
    <div class="cartel__cab">
      <div class="rev">
        <p class="rotulo">El menú de hoy</p>
        <h2>Cada día,<br/>su menú</h2>
      </div>
      <div class="dias rev" data-d="1" id="dias" role="tablist" aria-label="Menús por día"></div>
    </div>
    <div class="rev" data-d="1" id="cartel"></div>
  </div>
</section>`);

pon("carrusel de menús", /<section class="carta" id="carta">[\s\S]*?<\/section>/,
`<section class="carta" id="carta">
  <div class="wrap">
    <div class="carta__cab">
      <div class="rev">
        <p class="rotulo">La semana</p>
        <h2>Jueves, viernes y sábado,<br/>12 € el menú</h2>
      </div>
      <p class="lead rev" data-d="1">Estos son vuestros últimos carteles. En la web se cambiarían desde el móvil en lo que se tarda en hacer la foto.</p>
    </div>
  </div>
  <div class="wrap">
    <div class="carteles rev" data-d="1" id="carteles"></div>
    <p class="tira__ayuda rev" data-d="2">Desliza →</p>
  </div>
</section>`);



/* El bloque viejo del menú ya no existe (lo sustituye el cartel), así que su
   función se queda sin sitio donde escribir y tumbaba el resto del guion. */
pon("desactivar el menú viejo", /function pintarMenu\(\)\{/,
'function pintarMenu(){\n  if(!document.getElementById("menu-dia")) return;');

const DISENO = `
/* ═══ CARTEL DEL DÍA ═══ (docs/PROMPT-DEMO-COMIDA-DEL-DIA.md)
   Formas redondeadas del estilo Organic Biophilic: el negocio vende comida de
   casa, y la esquina viva de la plantilla editorial lo dejaba frío. */
.cartel__cab{display:flex;flex-wrap:wrap;gap:20px;align-items:flex-end;
  justify-content:space-between;margin-bottom:clamp(20px,3vw,34px);}
.dias{display:flex;gap:8px;flex-wrap:wrap;}
.dias button{min-height:44px;padding:0 18px;border-radius:100px;cursor:pointer;
  border:1px solid var(--filete-fuerte);background:transparent;color:var(--tinta-sec);
  font-family:var(--detalle);font-size:13px;font-weight:600;letter-spacing:.06em;
  text-transform:uppercase;transition:background .25s var(--ease),color .25s var(--ease),
  border-color .25s var(--ease);}
.dias button:hover{border-color:var(--acento);color:var(--acento);}
.dias button[aria-selected="true"]{background:var(--acento);border-color:var(--acento);
  color:var(--acento-con);}

.cartel{position:relative;border:1px solid var(--filete);border-radius:28px;
  background:var(--fondo);padding:clamp(24px,4vw,46px);
  box-shadow:0 30px 70px -52px rgba(20,40,25,.55);}
.cartel__dia{font-family:var(--display);font-size:var(--t4);line-height:1.05;
  margin:0 0 4px;}
/* solo la primera letra: capitalize ponía "Jueves 17 De Septiembre" */
.cartel__dia::first-letter{text-transform:uppercase;}
.cartel__incl{font-family:var(--detalle);font-size:12.5px;letter-spacing:.08em;
  text-transform:uppercase;color:var(--tinta-sec);margin:0 0 clamp(20px,3vw,30px);}
.cartel__cols{display:grid;gap:clamp(20px,3vw,38px);
  grid-template-columns:repeat(auto-fit,minmax(190px,1fr));}
.cartel__cols>div+div{border-left:1px solid var(--filete);padding-left:clamp(20px,3vw,38px);}
@media(max-width:719px){
  .cartel__cols>div+div{border-left:0;padding-left:0;border-top:1px solid var(--filete);padding-top:20px;}
}
.cartel h3{font-family:var(--detalle);font-size:11.5px;letter-spacing:.14em;
  text-transform:uppercase;color:var(--acento);margin:0 0 12px;}
.cartel ul{list-style:none;margin:0;padding:0;display:grid;gap:9px;}
.cartel li{font-size:var(--t1);line-height:1.35;}
/* preset 7 · stagger list (subtle): 30 ms entre plato y plato */
.cartel li{opacity:0;transform:translateY(8px);
  animation:plato .34s var(--ease) forwards;animation-delay:calc(var(--i,0) * 30ms + 60ms);}
@keyframes plato{to{opacity:1;transform:none;}}
.cartel__precio{position:absolute;top:-18px;right:clamp(18px,4vw,42px);
  width:84px;height:84px;border-radius:50%;background:var(--acento);color:var(--acento-con);
  display:grid;place-content:center;text-align:center;line-height:1.1;
  font-family:var(--display);font-size:26px;transform:rotate(-7deg) scale(.6);opacity:0;
  animation:sello .5s cubic-bezier(.34,1.56,.64,1) .25s forwards;
  box-shadow:0 14px 30px -18px rgba(20,60,30,.8);}
.cartel__precio small{display:block;font-family:var(--detalle);font-size:10px;
  letter-spacing:.1em;text-transform:uppercase;opacity:.85;}
@keyframes sello{to{opacity:1;transform:rotate(-7deg) scale(1);}}
.cartel__pie{margin-top:clamp(22px,3vw,32px);display:flex;flex-wrap:wrap;gap:12px;align-items:center;}
.cartel__pie .btn{border-radius:100px;}
.cartel__nota{font-size:var(--t1);color:var(--tinta-sec);max-width:46ch;margin:0;}

/* carrusel de carteles · arrastre nativo con scroll-snap */
.carteles{display:flex;gap:18px;overflow-x:auto;scroll-snap-type:x mandatory;
  padding:6px 2px 18px;margin:0 calc(var(--gutter) * -1);
  padding-left:var(--gutter);padding-right:var(--gutter);scrollbar-width:none;}
.carteles::-webkit-scrollbar{display:none;}
.carteles .cartel{flex:0 0 min(86%,430px);scroll-snap-align:start;}
.carteles .cartel li{animation:none;opacity:1;transform:none;}

/* la pastilla de "hoy" en la portada */
.hoy{display:inline-flex;align-items:center;gap:10px;flex-wrap:wrap;
  border:1px solid var(--filete-fuerte);border-radius:100px;
  padding:9px 18px;margin:0 0 14px;font-size:14.5px;color:var(--tinta-sec);
  background:color-mix(in srgb, var(--acento) 7%, var(--fondo));}
.hoy b{color:var(--tinta);font-weight:600;}
.hoy i{width:7px;height:7px;border-radius:50%;background:var(--acento);font-style:normal;}

/* ═══ PALETA · el tomate de su mantel ═══ */
:root{--tomate:#B8441E;--tomate-claro:#F6A988;--tomate-fondo:#FFE9DE;}
.portada h1 em{color:var(--tomate);}
.hoy{background:var(--tomate-fondo);border-color:#F2CDBB;}
.hoy i{background:var(--tomate);}
.cartel__precio,.pizarra .cartel__precio{background:var(--tomate);color:#fff;}
.dicho__e{color:var(--tomate);}
.pasos__l b{background:var(--tomate-fondo);color:var(--tomate);}
.subr::after{background:var(--tomate)!important;}
.barra-lectura{background:var(--tomate)!important;}

/* ═══ LOS PLATOS EN LA PORTADA ═══
   Tres fotos en vez de una: un plato grande y dos pequeños, cada uno con el
   día de su cartel en que sale. Las fotos son de banco (el pie lo dice); los
   platos y los días, no: son de sus carteles de Instagram. */
.platos{height:auto!important;display:grid;gap:14px;
  grid-template-columns:1.35fr 1fr;grid-template-rows:1fr 1fr;
  aspect-ratio:16/9;max-height:620px;padding:0 var(--gutter);overflow:visible!important;}
.plato-f{position:relative;margin:0;overflow:hidden;border-radius:26px;min-height:0;}
.plato-f--1{grid-row:1 / span 2;}
.plato-f img{width:100%;height:100%;object-fit:cover;border-radius:0!important;
  transition:transform 1.2s var(--ease);}
.plato-f:hover img{transform:scale(1.04);}
.plato-f figcaption{position:absolute;left:12px;bottom:12px;padding:8px 14px;border-radius:100px;
  background:rgba(255,255,255,.94);color:var(--tinta);font-family:var(--detalle);
  font-size:12px;font-weight:600;letter-spacing:.04em;backdrop-filter:blur(6px);}
/* entrada escalonada de las tres fotos (preset 8, standard) */
.platos .plato-f{opacity:0;transform:translateY(22px) scale(.97);
  transition:opacity .7s var(--ease),transform .9s var(--ease);}
.platos.on .plato-f{opacity:1;transform:none;}
.platos.on .plato-f--2{transition-delay:.12s;}
.platos.on .plato-f--3{transition-delay:.24s;}

/* ═══ PANTALLA DE CARGA ═══ · la de Errotatxo, en vanilla
   Halo que late detrás del nombre, el nombre sube, una línea fina se llena y
   la cortina se recoge hacia arriba. Solo la primera vez en la sesión. */
.carga{position:fixed;inset:0;z-index:200;display:flex;flex-direction:column;
  align-items:center;justify-content:center;background:var(--fondo-alt);overflow:hidden;
  clip-path:inset(0 0 0 0);transition:clip-path 1.05s cubic-bezier(.87,0,.13,1);}
.carga.fuera{clip-path:inset(0 0 100% 0);}
.carga__halo{position:absolute;width:min(78vw,420px);aspect-ratio:1;border-radius:50%;
  background:radial-gradient(circle, var(--tomate-claro) 0%, rgba(246,169,136,0) 68%);
  opacity:0;animation:halo-in .9s ease-out forwards, halo 2.4s ease-in-out infinite;}
@keyframes halo-in{to{opacity:.75;}}
@keyframes halo{0%,100%{transform:scale(.9);}50%{transform:scale(1.08);}}
.carga__marca{position:relative;font-family:var(--display);color:var(--acento-osc);
  font-size:clamp(52px,12vw,104px);line-height:1;margin:0;
  opacity:0;transform:translateY(26px) scale(.86);
  animation:marca 1s cubic-bezier(.22,1,.36,1) forwards;}
.carga__marca em{color:var(--tomate);}
@keyframes marca{to{opacity:1;transform:none;}}
.carga__linea{position:relative;width:160px;height:1px;margin-top:34px;overflow:hidden;
  background:rgba(31,69,48,.16);opacity:0;animation:aparece .9s .5s forwards;}
.carga__linea i{position:absolute;inset:0;background:var(--acento-osc);transform-origin:left;
  transform:scaleX(0);animation:llena 1.7s .1s cubic-bezier(.4,0,.2,1) forwards;}
@keyframes llena{to{transform:scaleX(1);}}
.carga__pie{position:relative;margin:16px 0 0;font-family:var(--detalle);font-size:11px;
  letter-spacing:.22em;text-transform:uppercase;color:var(--tinta-sec);
  opacity:0;animation:aparece .9s .7s forwards;}
@keyframes aparece{to{opacity:1;}}

/* botones en píldora, como la cabecera y la barra: con la esquina viva de la
   plantilla editorial convivían dos formas de botón en la misma pantalla */
.btn{border-radius:100px;}
.form input,.form textarea{border-radius:14px;}

/* esquinas de la familia: fotos y mapa dejan de ser rectángulos duros */
.portada__foto img,.casa__foto img,.mapa,.mapa iframe{border-radius:24px;}
.portada__foto img{border-radius:28px;}

/* ═══ RESEÑAS ═══ · preset 8 (stagger list · standard) vía el kit (.rev) */
.dicen{padding:clamp(56px,9vw,120px) 0;background:var(--fondo-alt);}
.dicen__cab{margin-bottom:clamp(26px,4vw,44px);}
.dicen__g{display:grid;gap:18px;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));}
.dicho{margin:0;background:var(--fondo);border:1px solid var(--filete);border-radius:22px;
  padding:clamp(22px,2.6vw,30px);display:flex;flex-direction:column;gap:14px;
  transition:transform .4s var(--ease),box-shadow .4s var(--ease);}
.dicho:hover{transform:translateY(-4px);box-shadow:0 26px 50px -38px rgba(20,50,28,.6);}
.dicho__e{margin:0;color:var(--acento);letter-spacing:.16em;font-size:13px;}
.dicho blockquote{margin:0;font-size:var(--t1);line-height:1.5;}
.dicho figcaption{font-family:var(--detalle);font-size:12.5px;letter-spacing:.06em;
  text-transform:uppercase;color:var(--tinta);margin-top:auto;}
.dicho figcaption span{color:var(--tinta-sec);text-transform:none;letter-spacing:0;}
.dicen__pie{margin:clamp(22px,3vw,32px) 0 0;}
.dicen__pie a{color:var(--acento);font-family:var(--detalle);font-size:14px;font-weight:600;
  display:inline-flex;align-items:center;min-height:44px;}

/* ═══ CÓMO SE ENCARGA ═══ */
.pasos{padding:clamp(48px,7vw,90px) 0;}
.pasos__l{list-style:none;margin:clamp(20px,3vw,30px) 0 0;padding:0;display:grid;gap:18px;
  grid-template-columns:repeat(auto-fit,minmax(230px,1fr));counter-reset:paso;}
.pasos__l li{display:flex;gap:16px;align-items:flex-start;}
.pasos__l b{flex:0 0 auto;width:42px;height:42px;border-radius:50%;display:grid;place-content:center;
  background:color-mix(in srgb, var(--acento) 12%, var(--fondo));color:var(--acento-osc);
  font-family:var(--display);font-size:21px;}
.pasos__l p{margin:6px 0 0;font-size:var(--t1);line-height:1.45;}

/* La sección del menú es la oscura de la página, así que dentro de ella los
   tokens están volteados: el texto hereda claro. La tarjeta es blanca, y sin
   esto salía blanco sobre blanco — no se leía nada. Se fija a mano cada color
   de la tarjeta en vez de confiar en la herencia. */
.pizarra .cartel{background:var(--fondo);color:var(--tinta);border-color:transparent;}
.pizarra .cartel .cartel__dia,.pizarra .cartel li{color:var(--tinta);}
.pizarra .cartel .cartel__incl,.pizarra .cartel .cartel__nota{color:var(--tinta-sec);}
.pizarra .cartel h3{color:var(--acento-osc);}
.pizarra .cartel__precio{background:var(--acento-osc);color:#fff;}
.pizarra .cartel .btn--fill{background:var(--acento-osc);border-color:var(--acento-osc);color:#fff;}
.pizarra .dias button{border-color:var(--osc-filete);color:var(--osc-tinta);}
.pizarra .dias button:hover{border-color:var(--acento-claro);color:var(--acento-claro);}
.pizarra .dias button[aria-selected="true"]{background:var(--acento-claro);
  border-color:var(--acento-claro);color:var(--osc);}

/* ═══ MÓVIL ═══
   Medido a 375 px antes de tocar nada: el primer botón de encargar salía a
   1006 px y la pastilla con el menú de hoy a 1117, con una pantalla de 812. O
   sea, quien entraba con hambre no veía ni qué hay ni cómo pedirlo sin
   deslizar. Y la página medía 8.900 px. Aquí se reordena y se acorta. */
@media (max-width: 719px){
  *{-webkit-tap-highlight-color:transparent;}
  .btn{min-height:52px;transition:transform .12s var(--ease);}
  .btn:active,.dias button:active,.barra a:active{transform:scale(.97);}

  /* portada: titular → lo de hoy → botones → texto → foto */
  .portada{display:flex;flex-direction:column;padding-top:18px;}
  .portada h1{font-size:clamp(44px,12.6vw,62px);line-height:.98;}
  .portada__meta{margin-top:14px;gap:6px 18px;}
  /* la plantilla le pone padding:X 0 0, que en escritorio no se nota porque
     .wrap centra con max-width, pero en móvil pegaba botones y pastilla al
     borde de la pantalla */
  .portada__pie{order:1;display:flex;flex-direction:column;gap:14px;padding:18px var(--gutter) 0;}
  .portada__pie > .lead{order:2;font-size:17px;margin:4px 0 0;}
  .portada__pie > div{display:flex;flex-direction:column;}
  .hoy{order:-1;border-radius:18px;align-items:flex-start;padding:12px 16px;
    font-size:15px;line-height:1.4;margin-bottom:12px;}
  .portada__btns{flex-direction:column;}
  .portada__btns .btn,.cierre__btns .btn,.cartel__pie .btn{width:100%;}
  .portada__foto{order:2;margin:24px 0 0;}
  .platos{aspect-ratio:auto;grid-template-columns:1fr 1fr;grid-template-rows:230px 150px;gap:10px;}
  .plato-f--1{grid-row:auto;grid-column:1 / span 2;}
  .plato-f{border-radius:20px;}
  .plato-f figcaption{font-size:11px;padding:6px 11px;left:9px;bottom:9px;}

  /* el cartel, más apretado: en móvil las tres columnas van una debajo de otra */
  .cartel{padding:24px 20px 22px;border-radius:22px;}
  .cartel__dia{font-size:36px;}
  .cartel__cols{gap:16px;}
  .cartel ul{gap:6px;}
  .cartel li{font-size:16px;}
  .cartel__precio{width:72px;height:72px;font-size:22px;top:-16px;right:16px;}
  .cartel__pie{flex-direction:column;align-items:stretch;text-align:center;}
  .dias{width:100%;}
  .dias button{flex:1;}

  /* la semana ya se ve con las pestañas del cartel: en móvil sobra repetirla */
  .carta{display:none;}

  /* reseñas en carrusel: una y un trozo de la siguiente */
  .dicen__g{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:14px;
    margin:0 calc(var(--gutter) * -1);padding:4px var(--gutter) 16px;scrollbar-width:none;}
  .dicen__g::-webkit-scrollbar{display:none;}
  .dicho{flex:0 0 86%;scroll-snap-align:start;}
  .dicho:hover{transform:none;}

  .casa__foto img{height:220px;object-fit:cover;}
  .mapa,.mapa iframe{height:240px!important;min-height:0!important;}
  .pasos__l{gap:14px;}
}

@media (prefers-reduced-motion: reduce){
  .carga{display:none!important;}
  .platos .plato-f{opacity:1!important;transform:none!important;transition:none!important;}
  .cartel li,.cartel__precio{animation:none!important;opacity:1!important;transform:none!important;}
  .cartel__precio{transform:rotate(-7deg)!important;}
}
`;
pon("estilos del cartel", /\n<\/style>\n<script>document\.documentElement\.className/,
"\n" + DISENO + "</style>\n<script>document.documentElement.className");

/* ── 11 · reseñas de verdad ────────────────────────────────────────────
   La plantilla traía tres reseñas inventadas con nombre y fecha, y el
   generador las quita (bien). Estas son reales: están en su ficha de Google,
   copiadas tal cual, recortadas solo donde se dice, y con el nombre como lo
   publica su autor pero abreviado. Se enlaza a Google para que cualquiera las
   compruebe, que es lo que hace que una reseña valga algo. */
const RESENAS = [
  { q: "Animados por la afluencia de personas al local nos decidimos a pedir dos menús para llevar y la experiencia ha resultado buenísima. La atención buena y la comida buenísima. Repetiremos. Eskerrik asko.",
    a: "Ainhoa B.", c: "hace 6 meses" },
  { q: "Comida casera muy rica a un precio fantástico. Recomiendo 100%. Las chicas son muy amables y cercanas. Nosotros vamos muy a menudo y seguiremos yendo.",
    a: "Leire G.", c: "hace 10 meses" },
  { q: "Una opción genial para esos días que no apetece cocinar. Comida buenísima, casera y abundante […]. Las trabajadoras muy amables. He ido unas cuantas veces y repetiré.",
    a: "Guapis", c: "Local Guide" },
];
const MAPS = "https://www.google.com/maps/search/?api=1&query=HAR%20TA%20JAN%20Errenteria";
pon("reseñas reales", /<!-- ═══ 3 · CIFRAS/,
`<!-- ═══ RESEÑAS · de su ficha de Google ═══ -->
<section class="dicen" id="dicen">
  <div class="wrap">
    <div class="dicen__cab rev">
      <p class="rotulo">Lo que dicen · Zer dioten</p>
      <h2>4,9 en Google,<br/>con 57 opiniones</h2>
    </div>
    <div class="dicen__g">
${RESENAS.map((r, i) => `      <figure class="dicho rev" data-d="${i}">
        <p class="dicho__e" aria-label="5 sobre 5">★★★★★</p>
        <blockquote>${r.q}</blockquote>
        <figcaption>${r.a} <span>· ${r.c}</span></figcaption>
      </figure>`).join("\n")}
    </div>
    <p class="dicen__pie rev" data-d="2"><a href="${MAPS}" target="_blank" rel="noopener">Verlas todas en Google →</a></p>
  </div>
</section>

<!-- ═══ 3 · CIFRAS`);

/* ── 11b · la banda de cifras, con lo que sí se puede comprobar ──────────
   El generador dejó solo la de Google, porque las de la plantilla eran
   inventadas. Estas tres salen de su cartel (el precio), de la prensa local
   (abrieron el 9/5/2022) y de su horario en Google. */
pon("cifras comprobables", /<li class="rev" data-d="2"><b>([\d,]+)<\/b><small>Google · (\d+) reseñas<\/small><\/li>/,
`<li class="rev"><b>$1</b><small>Google · $2 reseñas</small></li>
      <li class="rev" data-d="1"><b class="cnum" data-n="12" data-suf=" €">12 €</b><small>menú con pan</small></li>
      <li class="rev" data-d="2"><b>2022</b><small>abrimos en Galtzaraborda</small></li>
      <li class="rev" data-d="3"><b>Lun–Sáb</b><small>solo al mediodía</small></li>`);

/* ── 12 · cómo se encarga, en tres pasos ── */
pon("cómo encargar", /<!-- ═══ 8 · DÓNDE/,
`<!-- ═══ PASOS · cómo se encarga ═══ -->
<section class="pasos">
  <div class="wrap">
    <p class="rotulo rev">Encargar es esto</p>
    <ol class="pasos__l">
      <li class="rev"><b>1</b><p>Nos llamas o nos mandas un WhatsApp.</p></li>
      <li class="rev" data-d="1"><b>2</b><p>Nos dices qué quieres.</p></li>
      <li class="rev" data-d="2"><b>3</b><p>Lo recoges en Mandoegi kalea 2.</p></li>
    </ol>
  </div>
</section>

<!-- ═══ 8 · DÓNDE`);

/* ── 13 · euskera, como en sus carteles ── */
pon("euskera en el menú", /<p class="rotulo">El menú de hoy<\/p>/,
'<p class="rotulo">El menú del día · Eguneko menua</p>');
pon("color del navegador", /<meta name="viewport"([^>]*)\/>/,
'<meta name="viewport"$1/>\n<meta name="theme-color" content="#2F6B3F"/>');

const SCRIPT = `
<script>
/* ═══ El cartel del día ═══
   Pinta el menú de hoy como el cartel que cuelgan cada mañana, deja cambiar de
   día con las pestañas y repite los carteles de la semana en el carrusel.
   Todo sale de DATOS.menuDia: aquí no se escribe ni un plato a mano. */
(function(){
  var DIAS = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
  var cartel = document.getElementById("cartel");
  var pestanas = document.getElementById("dias");
  var carteles = document.getElementById("carteles");
  var chip = document.getElementById("hoy-chip");
  if(!cartel) return;

  /* Los menús van por día de la semana: según Oier, el del jueves es siempre
     el del jueves, y así con cada día. Por eso no se pone fecha. */
  var conMenu = Object.keys(DATOS.menuDia).map(Number).filter(function(d){ return DATOS.menuDia[d]; })
    .sort(function(a,b){ return (a===0?7:a)-(b===0?7:b); });
  var hoy = new Date().getDay();

  function lista(titulo, platos){
    if(!platos || !platos.length) return "";
    return "<div><h3>"+titulo+"</h3><ul>"+platos.map(function(p,i){
      return '<li style="--i:'+i+'">'+p+"</li>"; }).join("")+"</ul></div>";
  }

  function pintarCartel(d, destino, conBoton){
    var m = DATOS.menuDia[d];
    if(!m){
      destino.className = "cartel";
      destino.innerHTML = '<p class="cartel__dia">El menú de hoy, al teléfono</p>' +
        '<p class="cartel__nota">El menú cambia cada día. Llámanos al ' +
        DATOS.tel.replace(/^\\+34/,"") + ' y te decimos lo que hay hoy.</p>';
      return;
    }
    destino.className = "cartel";
    destino.innerHTML =
      '<div class="cartel__precio">' + DATOS.menuPrecio + "<small>" + DATOS.menuIncluye + "</small></div>" +
      '<p class="cartel__dia">' + (d === hoy ? "Hoy · " : "") + DIAS[d] + "</p>" +
      '<p class="cartel__incl">Primeros, segundos y postre · para llevar</p>' +
      '<div class="cartel__cols">' + lista("Primeros", m.primeros) + lista("Segundos", m.segundos) +
      lista("Postres", m.postres) + "</div>" +
      (conBoton ? '<div class="cartel__pie"><a class="btn btn--fill" id="cartel-wa" href="#" target="_blank" rel="noopener">Encargar por WhatsApp <span class="ar" aria-hidden="true">→</span></a><span class="cartel__nota">o al ' + DATOS.tel.replace(/^\\+34/,"") + "</span></div>" : "");
    if(conBoton){
      var wa = destino.querySelector("#cartel-wa");
      var b = document.getElementById("b-wa");
      if(wa && b) wa.href = b.href;
    }
  }

  // Pestañas: primero el cartel más reciente.
  var elegido = hoy;
  if(!DATOS.menuDia[hoy]){ for(var i=1;i<=7;i++){ var dd=(hoy+i)%7; if(DATOS.menuDia[dd]){ elegido=dd; break; } } }
  if(pestanas && conMenu.length > 1){
    conMenu.forEach(function(d){
      var b = document.createElement("button");
      b.type = "button"; b.setAttribute("role","tab");
      b.textContent = d === hoy ? "Hoy" : DIAS[d].slice(0,3);
      b.setAttribute("aria-label", DIAS[d]);
      b.onclick = function(){ elegido = d; pintar(); };
      b.dataset.dia = d;
      pestanas.appendChild(b);
    });
  }

  function pintar(){
    pintarCartel(elegido, cartel, true);
    if(pestanas) [].forEach.call(pestanas.children, function(b){
      b.setAttribute("aria-selected", Number(b.dataset.dia) === elegido ? "true" : "false"); });
  }
  pintar();

  // El carrusel repite todos los carteles que haya, sin el botón.
  if(carteles){
    conMenu.forEach(function(d){
      var div = document.createElement("div");
      pintarCartel(d, div, false);
      carteles.appendChild(div);
    });
  }

  // Pastilla de la portada: el menú de hoy o, si hoy no hay, el del próximo día.
  if(chip && DATOS.menuDia[elegido]){
    var m = DATOS.menuDia[elegido];
    chip.innerHTML = '<span class="hoy__t"><i aria-hidden="true"></i>' +
      (elegido === hoy ? "Hoy" : "Menú del " + DIAS[elegido]) + " · " + DATOS.menuPrecio + "</span>" +
      "<b>" + m.segundos.slice(0,2).join(" · ") + "</b>";
    chip.hidden = false;
  }

  /* preset 13 · parallax subtle: solo la foto de portada, y solo 8%. */
  var foto = document.querySelector(".portada__foto img");
  if(foto && !matchMedia("(prefers-reduced-motion: reduce)").matches){
    var tic = false;
    addEventListener("scroll", function(){
      if(tic) return; tic = true;
      requestAnimationFrame(function(){
        var y = Math.min(scrollY, innerHeight) * 0.08;
        foto.style.transform = "translate3d(0," + y.toFixed(1) + "px,0) scale(1.06)";
        tic = false;
      });
    }, { passive:true });
  }
})();
</script>
`;
pon("guion del cartel", /<\/body>/, SCRIPT + "</body>");

/* ── 13b · el hero y los botones ────────────────────────────────────────
   Presets de motion.csv: 5 (reveal por líneas del titular), 8 (entrada
   escalonada de los platos con back.out), 13 (parallax suave, aquí con el
   puntero en escritorio). Todo con transform/opacity y apagado con
   prefers-reduced-motion. */
const HEROE = `
/* ═══ HERO ═══ */
/* sin JavaScript no hay quien encienda el hero: que se vea tal cual */
html:not(.js) .heroe *{opacity:1!important;transform:none!important;}
.heroe{padding:clamp(26px,4vw,56px) 0 clamp(40px,6vw,80px);overflow:hidden;}
.heroe__in{display:grid;gap:clamp(28px,4vw,56px);align-items:center;}
@media(min-width:900px){
  .heroe__in{grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);min-height:min(78svh,720px);}
}
.heroe__kicker{display:flex;flex-wrap:wrap;gap:6px 10px;margin:0 0 18px;}
.heroe__kicker span{font-family:var(--detalle);font-size:11.5px;font-weight:700;letter-spacing:.16em;
  text-transform:uppercase;color:var(--acento);padding:7px 13px;border-radius:100px;
  background:color-mix(in srgb, var(--acento) 9%, var(--fondo));}
.heroe__kicker span+span{color:var(--tomate);background:var(--tomate-fondo);}
/* .heroe .heroe__h y no .heroe__h a secas: la plantilla trae .portada h1 a
   196 px, que gana por especificidad y partía el titular en cinco líneas */
.heroe .heroe__h{font-size:clamp(48px,6vw,100px);line-height:.95;letter-spacing:-.02em;margin:0 0 22px;}
.heroe__h em{font-style:italic;font-weight:400;color:var(--tomate);}
/* cada línea sube desde detrás de su propia máscara */
.heroe__h .l{display:block;overflow:hidden;padding-bottom:.08em;}
.heroe__h .l>span{display:inline-block;transform:translateY(105%);
  transition:transform 1s cubic-bezier(.22,1,.36,1);}
.heroe.vivo .heroe__h .l>span{transform:none;}
.heroe.vivo .heroe__h .l+.l>span{transition-delay:.12s;}
.heroe__txt .hoy{margin:0 0 20px;}
.heroe__txt>*:not(.heroe__h){opacity:0;transform:translateY(14px);
  transition:opacity .7s var(--ease),transform .8s var(--ease);}
.heroe.vivo .heroe__txt>*{opacity:1;transform:none;}
.heroe.vivo .heroe__kicker{transition-delay:0s;}
.heroe.vivo .hoy{transition-delay:.3s;}
.heroe.vivo .heroe__btns{transition-delay:.42s;}
.heroe.vivo .heroe__nota{transition-delay:.54s;}
.heroe__btns{display:flex;flex-wrap:wrap;gap:12px;}
.heroe__nota{margin:18px 0 0;font-size:14.5px;color:var(--tinta-sec);}
.heroe__nota b{color:var(--tinta);}

/* la pastilla del menú: día y precio arriba, platos debajo */
.heroe .hoy{display:flex;flex-direction:column;align-items:flex-start;gap:4px;border-radius:18px;padding:12px 18px;max-width:34rem;}
.hoy__t{display:flex;align-items:center;gap:8px;font-size:12.5px;letter-spacing:.06em;text-transform:uppercase;font-family:var(--detalle);color:var(--tinta-sec);}
.heroe .hoy b{font-size:15.5px;line-height:1.4;}

/* los platos: uno grande y dos que asoman, cada uno flotando a su ritmo */
.heroe__platos{position:relative;height:clamp(420px,52vw,640px);}
.pl{position:absolute;margin:0;}
.pl__m{width:100%;height:100%;overflow:hidden;border-radius:30px;
  box-shadow:0 34px 60px -34px rgba(40,30,20,.55),0 0 0 6px var(--fondo);}
.pl img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 1.2s var(--ease);}
.pl:hover img{transform:scale(1.05);}
.pl--1{left:8%;top:6%;width:62%;height:78%;--r:-3deg;}
.pl--2{right:0;top:0;width:36%;height:40%;--r:5deg;}
.pl--3{right:4%;bottom:2%;width:40%;height:36%;--r:-5deg;}
.pl figcaption{position:absolute;left:14px;bottom:14px;padding:8px 14px;border-radius:100px;
  background:rgba(255,255,255,.95);color:var(--tinta);font-family:var(--detalle);font-size:12px;
  font-weight:600;letter-spacing:.03em;box-shadow:0 8px 20px -12px rgba(0,0,0,.45);white-space:nowrap;}
/* entrada: caen desde abajo girando hasta su ángulo, con un rebote corto */
.pl{opacity:0;transform:translate3d(0,60px,0) rotate(0deg) scale(.9);
  transition:opacity .8s var(--ease),transform 1.1s cubic-bezier(.34,1.4,.64,1);}
.heroe.vivo .pl{opacity:1;transform:translate3d(var(--px,0),var(--py,0),0) rotate(var(--r));}
.heroe.vivo .pl--1{transition-delay:.15s;}
.heroe.vivo .pl--2{transition-delay:.32s;}
.heroe.vivo .pl--3{transition-delay:.46s;}
/* tras la entrada, el seguimiento del puntero va suave, sin el rebote */
.heroe.listo .pl{transition:opacity .8s var(--ease),transform .7s cubic-bezier(.22,1,.36,1);}
/* flotar: se anima el contenedor interno para no pisar el transform de arriba */
.heroe.vivo .pl__m{animation:flota 6s ease-in-out 1.4s infinite;}
.heroe.vivo .pl--2 .pl__m{animation-duration:7.2s;animation-delay:1.7s;}
.heroe.vivo .pl--3 .pl__m{animation-duration:6.6s;animation-delay:2s;}
@keyframes flota{0%,100%{transform:translateY(0);}50%{transform:translateY(-9px);}}
.heroe__sello{position:absolute;left:1%;top:0;width:96px;height:96px;border-radius:50%;
  background:var(--tomate);color:#fff;display:grid;place-content:center;text-align:center;
  font-family:var(--display);font-size:30px;line-height:1;z-index:3;
  box-shadow:0 18px 34px -16px rgba(184,68,30,.8);
  opacity:0;transform:scale(.4) rotate(-30deg);
  transition:opacity .5s var(--ease) .75s,transform .8s cubic-bezier(.34,1.56,.64,1) .75s;}
.heroe__sello small{font-family:var(--detalle);font-size:10px;letter-spacing:.12em;
  text-transform:uppercase;margin-top:4px;}
.heroe.vivo .heroe__sello{opacity:1;transform:rotate(-10deg);}
@media(max-width:899px){
  .heroe{padding-top:14px;}
  .heroe__kicker span{font-size:10px;letter-spacing:.12em;padding:6px 10px;}
  .heroe .heroe__h{font-size:clamp(42px,12vw,60px);}
  .heroe__platos{height:clamp(210px,58vw,380px);}
  .pl--1{left:0;top:4%;width:64%;height:88%;}
  .pl--2{right:0;top:0;width:40%;height:46%;}
  .pl--3{right:3%;bottom:0;width:40%;height:44%;}
  .pl figcaption{font-size:10.5px;padding:5px 10px;left:8px;bottom:8px;}
  .pl__m{border-radius:22px;box-shadow:0 22px 40px -26px rgba(40,30,20,.55),0 0 0 4px var(--fondo);}
  .heroe__sello{width:70px;height:70px;font-size:22px;left:-6px;top:-12px;right:auto;bottom:auto;}
  .heroe__sello small{font-size:8.5px;}
  /* en móvil los platos van entre el titular y los botones */
  .heroe__in{display:flex;flex-direction:column;align-items:stretch;}
  .heroe__txt{display:contents;}
  .heroe__kicker{order:1;margin-bottom:12px;}
  .heroe__h{order:2;margin-bottom:18px;}
  .heroe__platos{order:3;margin-bottom:22px;}
  /* botones antes que la pastilla: tienen que caber en la primera pantalla */
  .heroe__btns{order:4;flex-direction:column;margin-bottom:16px;}
  .heroe__txt .hoy{order:5;margin-bottom:6px;}
  .heroe__nota{order:6;}
}

/* ═══ ESCRITORIO ═══
   Medido a 1440 px: el carrusel de carteles obligaba a deslizar para ver el
   tercero aunque sobraba ancho, y las rejillas de auto-fit dejaban una cuarta
   columna vacía que descentraba el contenido. */
@media(min-width:1100px){
  .carteles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));overflow:visible;
    margin:0;padding:6px 0 18px;}
  .carteles .cartel{flex:none;}
  .carta .tira__ayuda{display:none;}
}
@media(min-width:900px){
  .cartel__cols,.pasos__l{grid-template-columns:repeat(3,minmax(0,1fr));}
  .dicho:hover{transform:translateY(-6px);}
}

/* ═══ BOTONES ═══
   Píldora de 54 px, texto en versalitas espaciadas y la flecha dentro de un
   círculo que se desplaza al pasar por encima. El relleno oscuro entra desde
   abajo en vez de cambiar de color de golpe. */
.btn{position:relative;isolation:isolate;overflow:hidden;min-height:54px;padding:0 26px;
  border-radius:100px;gap:12px;font-family:var(--detalle);font-size:13px;font-weight:700;
  letter-spacing:.09em;text-transform:uppercase;
  transition:transform .15s var(--ease),box-shadow .35s var(--ease),border-color .3s,color .3s,background-color .3s;}
.btn:active{transform:scale(.97);}
.btn--fill{background:var(--acento);border:0;color:#fff;
  box-shadow:0 14px 28px -14px rgba(46,94,62,.75);}
.btn--fill::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--acento-osc);
  transform:translateY(101%);transition:transform .45s cubic-bezier(.22,1,.36,1);}
.btn--fill:hover::before{transform:none;}
.btn--fill:hover{box-shadow:0 18px 32px -14px rgba(31,69,48,.85);}
.btn--ico{padding-right:8px;}
.btn__c{width:40px;height:40px;border-radius:50%;display:grid;place-content:center;
  background:#467D58;font-style:normal;transition:transform .45s cubic-bezier(.22,1,.36,1),background .3s;}
.btn--ico:hover .btn__c{transform:translateX(3px) rotate(-8deg);background:#548C66;}
.btn .ar{display:inline-grid;place-content:center;width:30px;height:30px;border-radius:50%;
  background:transparent;margin-right:-12px;transition:transform .45s cubic-bezier(.22,1,.36,1);}
.btn:hover .ar{transform:translateX(3px);}
/* círculo sólido, no translúcido: con un blanco al 18% el texto de dentro
   dependía de lo que hubiera detrás, y el medidor de contraste no lo puede leer */
.btn--fill .ar{background:#467D58;}
.btn--wa{background:var(--fondo);color:var(--tinta);border:1.5px solid var(--filete-fuerte);}
.btn--wa svg{color:#1E9E4E;flex:0 0 auto;transition:transform .45s cubic-bezier(.34,1.56,.64,1);}
.btn--wa:hover{border-color:#1E9E4E;background:#F1FAF4;}
.btn--wa:hover svg{transform:rotate(-12deg) scale(1.1);}
.btn--ghost{border:1.5px solid currentColor;}
.top .btn{min-height:44px;padding:0 20px;font-size:12px;}
.top .btn .ar{width:24px;height:24px;margin-right:-10px;}
@media(max-width:719px){ .heroe__btns .btn{width:100%;justify-content:space-between;} }
@media(max-width:719px){ .btn--wa{justify-content:center!important;} }

@media (prefers-reduced-motion: reduce){
  .heroe__h .l>span,.heroe__txt>*,.pl,.heroe__sello{transform:none!important;opacity:1!important;transition:none!important;}
  .pl{transform:rotate(var(--r))!important;}
  .heroe__sello{transform:rotate(-10deg)!important;}
  .pl__m{animation:none!important;}
  .btn--fill::before{transition:none;}
}
`;
pon("estilos del hero y los botones", /\n<\/style>\n<script>document\.documentElement\.className/,
"\n" + HEROE + "</style>\n<script>document.documentElement.className");

pon("movimiento del hero", /<\/body>/, `<script>
/* El hero se enciende al cargar (o al irse la pantalla de carga, si la hay),
   y en escritorio los platos siguen un poco al puntero, cada uno a su
   profundidad (data-prof). */
(function(){
  var h = document.querySelector(".heroe"); if(!h) return;
  function encender(){ h.classList.add("vivo"); setTimeout(function(){ h.classList.add("listo"); }, 1700); }
  var carga = document.getElementById("carga");
  // setTimeout y no requestAnimationFrame: rAF se congela con la pestaña en
  // segundo plano y el hero se quedaba en blanco hasta volver a ella.
  setTimeout(encender, carga ? 2350 : 80);
  if(matchMedia("(prefers-reduced-motion: reduce)").matches || !matchMedia("(hover: hover) and (min-width: 900px)").matches) return;
  var pls = [].slice.call(h.querySelectorAll(".pl")), caja = document.getElementById("platos"), pend = false, ex = 0, ey = 0;
  h.addEventListener("pointermove", function(e){
    var r = caja.getBoundingClientRect();
    ex = (e.clientX - (r.left + r.width/2)) / r.width; ey = (e.clientY - (r.top + r.height/2)) / r.height;
    if(pend) return; pend = true;
    requestAnimationFrame(function(){
      pls.forEach(function(p){ var k = +p.dataset.prof || 16;
        p.style.setProperty("--px", (ex * -k).toFixed(1) + "px"); p.style.setProperty("--py", (ey * -k).toFixed(1) + "px"); });
      pend = false;
    });
  });
  h.addEventListener("pointerleave", function(){ pls.forEach(function(p){ p.style.setProperty("--px","0px"); p.style.setProperty("--py","0px"); }); });
})();
</script>
</body>`);


/* ── 15 · lo que encontró la auditoría ─────────────────────────────────── */
// Datos para Google: aquí se encarga, no se reserva mesa; y "Casera" a secas.
pon("sin reservas en el JSON-LD", /acceptsReservations:"True",/, 'acceptsReservations:"False",');
pon("cocina en el JSON-LD", /cocina:\s*"Casera · Para llevar"/, 'cocina: "Casera"');
// Con la dirección sin "·", el JSON-LD buscaba el código postal en un trozo
// vacío y lo dejaba en blanco: se busca en la dirección entera.
pon("código postal en el JSON-LD", /\(resto\.match\(\/\\d\{5\}\\s\+\(\[\^,\]\+\)\/\)/, "((resto||DATOS.direccion).match(/\\d{5}\\s+([^,]+)/)");
pon("código postal en el JSON-LD (2)", /\(resto\.match\(\/\\d\{5\}\/\)/, "((resto||DATOS.direccion).match(/\\d{5}/)");
// La imagen al compartir el enlace (WhatsApp, redes) era la chuleta del asador.
pon("imagen al compartir", /<meta property="og:image" content="[^"]*"\/>/,
  '<meta property="og:image" content="https://images.unsplash.com/photo-1650964807311-970cb88d347c?w=1200&h=630&q=80&auto=format&fit=crop"/>');
pon("icono de la pestaña", /<meta name="theme-color"/,
  '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Ccircle cx=%2232%22 cy=%2232%22 r=%2232%22 fill=%22%23B8441E%22/%3E%3Ctext x=%2232%22 y=%2243%22 text-anchor=%22middle%22 font-family=%22Georgia,serif%22 font-size=%2232%22 fill=%22white%22%3EH%3C/text%3E%3C/svg%3E"/>\n<meta name="theme-color"');
pon("título del mapa", /title="Mapa de situación del asador"/, "title=\"Mapa: Har' ta jan, Mandoegi kalea 2, Errenteria\"");
// Enlaces a "#": prometen unas páginas que no existen.
pon("sin enlaces vacíos en el pie", / · <a href="#">Aviso legal<\/a> · <a href="#">Privacidad<\/a>/, "");
// Con el teclado no se veía dónde estaba el foco: los botones quitaban el contorno.
pon("foco visible", /\n<\/style>\n<script>document\.documentElement\.className/,
`
a:focus-visible,button:focus-visible,input:focus-visible,textarea:focus-visible,.btn:focus-visible{
  outline:3px solid var(--tomate);outline-offset:3px;}
.pizarra a:focus-visible,.pizarra button:focus-visible,.cifras a:focus-visible{outline-color:var(--tomate-claro);}
</style>
<script>document.documentElement.className`);

/* ── 14 · pantalla de carga, la de Errotatxo ────────────────────────────
   Va pegada a <body> y con su guion justo detrás, antes de que se pinte nada:
   si ya se vio en esta sesión, o si el sistema pide menos movimiento, se
   quita en el acto y no llega a parpadear. Tope de 2,7 s en total, y un
   seguro por si algo falla: la página nunca se queda tapada. */
pon("pantalla de carga", /<body([^>]*)>/,
`<body$1>
<div class="carga" id="carga" aria-hidden="true">
  <div class="carga__halo"></div>
  <p class="carga__marca">Har' ta <em>jan</em></p>
  <div class="carga__linea"><i></i></div>
  <p class="carga__pie">Errenteria · Eramateko janaria</p>
</div>
<script>
(function(){
  var c = document.getElementById("carga");
  var visto = false;
  try { visto = sessionStorage.getItem("hartajan-visto") === "1"; } catch(e){}
  if(visto || matchMedia("(prefers-reduced-motion: reduce)").matches){ c.remove(); return; }
  document.documentElement.style.overflow = "hidden";
  function fuera(){
    if(!c.isConnected) return;
    try { sessionStorage.setItem("hartajan-visto","1"); } catch(e){}
    c.classList.add("fuera");
    document.documentElement.style.overflow = "";
    setTimeout(function(){ c.remove(); }, 1100);
  }
  setTimeout(fuera, 2200);
  setTimeout(fuera, 4000); // seguro
})();
</script>`);

fs.writeFileSync(F, s);
console.log("ajustado (" + antes + " → " + s.length + " caracteres)");
hecho.forEach((h) => console.log("  · " + h));

// Panel del cliente en modo prueba: desde /panel/ se cambia el menú del día y
// el aviso, y se ve en la demo (solo en ese navegador). Ver herramientas/kit-panel/.
const { execFileSync } = await import("node:child_process");
execFileSync(process.execPath, ["herramientas/kit-panel/aplicar-panel.mjs", "web/demos/clientes/har-ta-jan", "--slug", "har-ta-jan", "--modo", "prueba"], { stdio: "inherit" });
