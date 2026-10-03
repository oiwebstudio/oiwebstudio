/**
 * Demo de Biciprecision Igartua (Bergara), tienda de bicicletas.
 *
 * Dirección visual (27/09, a petición de Oier): deportiva, de ciclismo, con
 * esquinas redondeadas estilo iPhone. Referencias: las webs de marca actuales
 * (Canyon, Specialized, Rapha): titulares condensados en cursiva y mayúsculas,
 * fotos a sangre en tarjetas muy redondeadas, cristal esmerilado, píldoras y un
 * naranja de maillot sobre negro.
 *
 * Todo lo que se escribe sale de:
 *   · su web (biciprecisionigartua.com): tipos de bici (carretera, montaña,
 *     eléctrica, gravel, city), cuadros, ruedas, cambios, ciclocross, segunda
 *     mano, patinetes, spinning, montajes a la carta, biomecánica y
 *     entrenamiento, marcas, pago sin intereses en 1–2 años, Bizum, envíos,
 *     horario, teléfono, WhatsApp 688 673 171, email y "Zubieta 5 y 7"
 *   · su ficha de Google: 4,7 con 64 opiniones y las reseñas, copiadas tal cual
 *
 * Horario: el de su web (sábado solo mañana). Google dice sábado también por la
 * tarde → repasar con Iñigo.
 *
 *   node herramientas/demos/generar-demo.mjs --id 17133 --plantilla comercio-tienda
 *   node herramientas/demos/demo-biciprecision.mjs
 */
import fs from "node:fs";
import path from "node:path";

const DIR = "web/demos/clientes/biciprecision-igartua";
const F = DIR + "/index.html";
let s = fs.readFileSync(F, "utf8");
const antes = s.length;
const hecho = [];
function pon(desc, re, con) {
  const nuevo = s.replace(re, con);
  if (nuevo === s) { console.log("!! no encontrado: " + desc); return; }
  s = nuevo; hecho.push(desc);
}
const U = (id, w) => `https://images.unsplash.com/${id}?w=${w}&q=78&auto=format&fit=crop`;

/* ── 0 · tipografía deportiva, autoalojada (como el resto de demos) ──────── */
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const FUENTES = [
  // [archivo, estilo, peso]
  ["barlow-condensed-600-normal.woff2", "normal", 600],
  ["barlow-condensed-700-normal.woff2", "normal", 700],
  ["barlow-condensed-700-italic.woff2", "italic", 700],
  ["barlow-condensed-800-italic.woff2", "italic", 800],
];
if (FUENTES.some(([f]) => !fs.existsSync(path.join(DIR, "fuentes", f)))) {
  const css = await (await fetch("https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;1,700;1,800&display=swap", { headers: { "User-Agent": UA } })).text();
  // Solo el bloque "latin" de cada variante
  for (const bloque of css.split("/* ").filter((b) => b.startsWith("latin */"))) {
    const estilo = /font-style:\s*(\w+)/.exec(bloque)[1], peso = Number(/font-weight:\s*(\d+)/.exec(bloque)[1]);
    const url = /url\((https:[^)]+\.woff2)\)/.exec(bloque)[1];
    const f = FUENTES.find(([, e, p]) => e === estilo && p === peso);
    if (f) fs.writeFileSync(path.join(DIR, "fuentes", f[0]), Buffer.from(await (await fetch(url)).arrayBuffer()));
  }
  hecho.push("fuentes Barlow Condensed descargadas");
}
const FONT_FACE = FUENTES.map(([f, e, p]) =>
  `@font-face{font-family:'Barlow Condensed';font-style:${e};font-weight:${p};font-display:swap;src:url('fuentes/${f}') format('woff2');}`).join("\n");

/* ── 1 · cabecera del documento ─────────────────────────────────────────── */
pon("title", /<title>[^<]*<\/title>/, "<title>Tienda de bicicletas en Bergara: Cube, Focus, Massi | Biciprecision Igartua</title>");
pon("description", /(<meta name="description" content=")[^"]*"/, '$1Tienda de bicicletas en Bergara: Cube, Focus, Massi, Flanders y Moustache. Carretera, montaña, eléctricas y gravel, montajes a la carta y pago sin intereses."');
pon("theme-color", /(<meta name="theme-color" content=")[^"]*"/, "$1#0E0F11\"");
pon("og:title", /(<meta property="og:title" content=")[^"]*"/, '$1Biciprecision Igartua — Bicicletas en Bergara"');
pon("og:description", /(<meta property="og:description" content=")[^"]*"/, '$1Carretera, montaña, eléctrica, gravel y ciudad. Montajes a la carta y pago sin intereses."');
pon("og:image", /(<meta property="og:image" content=")[^"]*"/, `$1${U("photo-1761634731562-c7a152d89849", 1200)}&h=630"`);

/* La alternancia claro/oscuro de la plantilla la decide esta demo, no el kit. */
pon("ritmo", /window\.__RITMO__=\[[^\]]*\]/, "window.__RITMO__=[]");

/* ── 2 · el cuerpo ─────────────────────────────────────────────────────── */
const AR = '<span class="ar" aria-hidden="true">→</span>';
const I = {
  wa: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor"><path d="M12 3.5a8.5 8.5 0 0 0-7.4 12.7L3.5 20.5l4.4-1.1A8.5 8.5 0 1 0 12 3.5zm0 15.4a6.9 6.9 0 0 1-3.5-1l-.3-.2-2.6.7.7-2.5-.2-.3A6.9 6.9 0 1 1 12 18.9zm3.8-5.2c-.2-.1-1.2-.6-1.4-.7s-.3-.1-.5.1-.5.7-.6.8-.2.2-.4.1a5.6 5.6 0 0 1-2.8-2.4c-.2-.4.2-.3.6-1.1.1-.1 0-.3 0-.4l-.6-1.5c-.2-.4-.3-.3-.5-.3h-.4a.8.8 0 0 0-.6.3 2.4 2.4 0 0 0-.7 1.8 4.2 4.2 0 0 0 .9 2.2 9.6 9.6 0 0 0 3.7 3.2c1.4.6 1.9.6 2.6.5a2.2 2.2 0 0 0 1.4-1 1.8 1.8 0 0 0 .1-1c0-.1-.2-.2-.4-.3z"/></svg>',
  plazos: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="3" y="5" width="18" height="15" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  bizum: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M11 18.5h2"/></svg>',
  envio: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/></svg>',
};

/* ── 1b · su tienda online (urbeCOM), tal cual está el 27/09/2026 ──────────
   Iñigo preguntó (27/09) si se aparecería al buscar "Cube" y si la web sería
   "como las tiendas potentes de ahora". Su web actual ES tienda online, así
   que la nueva no la sustituye: enseña sus bicis reales y enlaza a cada ficha.
   Precios y fotos copiados de su portada; fotos reducidas a 720 px en
   productos/ (las originales pesan 150–400 KB). */
const TIENDA = "https://www.biciprecisionigartua.com/biciprecision/";
const PRODUCTOS = [
  { n:"Cube Litening Air C:68X Race",            m:"cube",     t:"Carretera",             p:5599, img:"679132113782",   u:"12071657/cube-litening-air-c%3A68x-race.html" },
  { n:"Cube Stereo Hybrid 144 HPC SLX",          m:"cube",     t:"Eléctrica de montaña",  p:5099, img:"862922154798",   u:"12072626/cube-stereo-hybrid-144-hpc-slx.html" },
  { n:"Cube Litening Aero C:68X Pro",            m:"cube",     t:"Carretera",             p:4849, img:"133969627829",   u:"11807617/cube-litening-aero-c%3A68x-pro.html" },
  { n:"Cube Nuroad Hybrid C:62 SLX 400X",        m:"cube",     t:"Gravel eléctrica",      p:4400, img:"7582343354411",  u:"12072628/cube-nuroad-hybrid-c-62-slx-400x-carbon-glosy-2025.html" },
  { n:"Focus Thron² 6.6",                        m:"focus",    t:"Eléctrica de montaña",  p:3750, img:"74616",          u:"12071643/focus-thron%26sup2%3B-6-6.html" },
  { n:"Cube AMS Hybrid ONE44 C:68X SLX 400X 29", m:"cube",     t:"Eléctrica de montaña",  p:4475, img:"43232153285",    u:"12028230/cube-ams-hybrid-one44-c%3A68x-slx-400x-29.html" },
  { n:"FlandersNXT Pro",                         m:"flanders", t:"Flanders",              p:3390, img:"22936454218966", u:"12071562/flandersnxt-pro.html" },
  { n:"Cube Litening Aero C:68X Race Teamline",  m:"cube",     t:"Carretera",             p:4589, img:"31684317589",    u:"12072163/cube-lithening-aero-c68x-race-teamline-2025.html" },
  { n:"Cube Litening Air Race 2026",             m:"cube",     t:"Carretera",             p:5499, img:"7246848747889",  u:"12072624/cube-lithening-air-race-2026.html" },
  { n:"Cube Litening Aero C:68 STL",             m:"cube",     t:"Carretera",             p:6375, img:"77611",          u:"12072164/cube-lithening-aero-c68-stl-solareclipse-carbon-2025.html" },
  { n:"Cube Stereo Hybrid ONE22 Pro 800",        m:"cube",     t:"Eléctrica de montaña",  p:3230, img:"24748113",       u:"12072191/cube-stereo-hybrid-one-22-pro-800-desertone-black.html" },
  { n:"Cube Stereo Hybrid ONE77 HPC SLX 800",    m:"cube",     t:"Eléctrica de montaña",  p:3075, img:"6544851633833",  u:"12072197/cube-stereo-hybrid-one-77-hpc-slx-800-drsertone-black-2025.html" },
];
/* Las marcas de bici con categoría propia en su tienda → una página cada una. */
const MARCAS = [
  { slug:"cube",      nombre:"Cube",      tipos:[["Carretera","c388623/cube-road.html"],["Montaña","c388624/cube-mtb.html"],["Eléctricas","c396898/cube-elec.html"],["Gravel","c435757/cube-gravel.html"]] },
  { slug:"focus",     nombre:"Focus",     tipos:[["Carretera","c8149/focus-road.html"],["Montaña","c8189/focus-mtb.html"],["Eléctricas","c413858/focus-elec.html"],["Gravel","c435180/focus-gravel.html"],["Ciudad","c440094/focus-city.html"]] },
  { slug:"massi",     nombre:"Massi",     tipos:[["Carretera","c439331/massi-road.html"],["Gravel","c439330/massi-gravel.html"]] },
  { slug:"flanders",  nombre:"Flanders",  tipos:[["Carretera","c8148/flanders-road.html"],["Gravel","c440092/flanders-gravel.html"]] },
  { slug:"moustache", nombre:"Moustache", tipos:[["Eléctricas","c391997/moustache-elec.html"]] },
];
const euros = (n) => n.toLocaleString("es-ES") + " €";
const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const tarjetaProducto = (p, pre) => `
    <article class="bk-prod__c">
      <a href="${TIENDA + p.u}" target="_blank" rel="noopener" aria-label="${esc(p.n)}, ${euros(p.p)}, ver la ficha en la tienda online">
        <figure><img loading="lazy" width="720" height="480" src="${pre}productos/${p.img}.jpg" alt="${esc(p.n)}"/></figure>
        <div class="bk-prod__t">
          <p class="bk-prod__cat">${p.t}</p>
          <h3>${esc(p.n)}</h3>
          <p class="bk-prod__pvp">${euros(p.p)}</p>
          <span class="bk-prod__ver">Ver la ficha ${AR}</span>
        </div>
      </a>
    </article>`;
const seccionProductos = (lista, pre, titulo, id) => `
<!-- ═══ EN LA TIENDA · productos reales ═══ -->
<section class="bk-prod"${id ? ` id="${id}"` : ""}>
  <div class="wrap">
    <div class="bk-cab bk-cab--fila">
      <div>
        <p class="bk-eyebrow rev">Tienda online</p>
        <h2 class="bk-h2 rev" data-d="1">${titulo}</h2>
      </div>
      <a class="btn btn--linea rev" data-d="2" href="${TIENDA}c8137/bicicletas.html" target="_blank" rel="noopener">Ver toda la tienda ${AR}</a>
    </div>
  </div>
  <div class="bk-carril bk-carril--prod rev" data-d="1">${lista.map((p) => tarjetaProducto(p, pre)).join("")}
  </div>
  <div class="wrap"><p class="bk-prod__nota">Precios de la tienda online a 27 de septiembre de 2026. Pregunta por tallas y disponibilidad.</p></div>
</section>
`;
const seccionMarcas = (pre, excepto) => `
<!-- ═══ MARCAS · una página cada una ═══ -->
<section class="bk-mar" id="marcas-bicis" aria-label="Nuestras marcas">
  <div class="wrap">
    <p class="bk-eyebrow rev">${excepto ? "Otras marcas" : "Nuestras marcas"}</p>
    <h2 class="bk-h2 rev" data-d="1">${excepto ? "Y también" : "Elige <em>marca</em>"}</h2>
    <div class="bk-mar__g rev" data-d="1">${MARCAS.filter((m) => m.slug !== excepto).map((m) => `
      <a class="bk-mar__c" href="${pre}${m.slug}/">
        <b>${m.nombre}</b>
        <span>${m.tipos.map(([t]) => t).join(" · ")}</span>
        <i aria-hidden="true">→</i>
      </a>`).join("")}
    </div>
  </div>
</section>
`;

const CUERPO = `<!-- ═══ 1 · CABECERA ═══ -->
<header class="top">
  <div class="wrap top__in">
    <a class="marca" href="#inicio">Biciprecisión <em>Igartua</em></a>
    <nav class="nav" aria-label="Principal">
      <a href="#bicis">Bicis</a>
      <a href="#tienda-online">Tienda</a>
      <a href="#montajes">Montajes</a>
      <a href="#donde">Dónde estamos</a>
    </nav>
    <p class="estado" id="estado" aria-live="polite"><i aria-hidden="true"></i><span>Consultando horario…</span></p>
    <a class="btn btn--fill top__cta" id="t-wa" href="#" target="_blank" rel="noopener">WhatsApp ${AR}</a>
  </div>
</header>

<main id="main">

<!-- ═══ 2 · HERO ═══ -->
<section class="bk-hero" id="inicio">
  <div class="bk-hero__card">
    <img class="bk-hero__img" src="${U("photo-1761634731562-c7a152d89849", 2000)}"
         alt="Bicicletas colgadas en las estanterías de la tienda" width="2000" height="1333" fetchpriority="high"/>
    <div class="bk-hero__velo" aria-hidden="true"></div>
    <div class="bk-hero__rayas" aria-hidden="true"></div>
    <div class="bk-hero__in">
      <p class="bk-chip bk-chip--glass rev"><i aria-hidden="true"></i>Tienda y taller · Bergara</p>
      <h1 class="bk-h1 rev" data-d="1">Elige bien.<br/><em>Rueda más.</em></h1>
      <p class="bk-hero__lead rev" data-d="2">Carretera, montaña, eléctrica, gravel y ciudad. Te ayudamos a elegir tu bici, te la montamos a la carta y la pagas sin intereses.</p>
      <div class="bk-btns rev" data-d="3">
        <a class="btn btn--fill" id="h-wa" href="#" target="_blank" rel="noopener">${I.wa} Preguntar por WhatsApp</a>
        <a class="btn btn--glass" href="#bicis">Ver las bicis</a>
      </div>
    </div>
    <ul class="bk-stats rev" data-d="3" aria-label="En cifras">
      <li><b>4,7<span>★</span></b><small>64 opiniones en Google</small></li>
      <li><b>14</b><small>marcas de bicis y componentes</small></li>
      <li><b>0 %</b><small>intereses, en 1 o 2 años</small></li>
      <li><b>Bizum</b><small>y envíos a casa</small></li>
    </ul>
  </div>
</section>

<!-- ═══ 3 · MARCAS · cinta ═══ -->
<section class="bk-marcas" aria-label="Marcas que trabajamos">
  <div class="bk-marcas__pista"><ul id="marcas"></ul></div>
</section>

<!-- ═══ 4 · LAS BICIS · tarjetas por terreno ═══ -->
<section class="bk-secc" id="bicis">
  <div class="wrap">
    <div class="bk-cab">
      <p class="bk-eyebrow rev">Las bicis</p>
      <h2 class="bk-h2 rev" data-d="1">Elige tu <em>terreno</em></h2>
    </div>
  </div>
  <div class="bk-carril rev" data-d="1">
    <article class="bk-card">
      <img loading="lazy" width="800" height="1000" src="${U("photo-1532298229144-0ec0c57515c7", 800)}" alt="Bicicleta de carretera negra"/>
      <div class="bk-card__txt">
        <p class="bk-chip bk-chip--glass">Asfalto y pista</p>
        <h3>Carretera<br/>y gravel</h3>
        <p>Carretera, gravel y ciclocross. Y si ya sabes lo que quieres: cuadro, ruedas y cambio por separado.</p>
      </div>
    </article>
    <article class="bk-card">
      <img loading="lazy" width="800" height="1000" src="${U("photo-1633707167682-9068729bc84c", 800)}" alt="Ciclista de montaña en un bosque"/>
      <div class="bk-card__txt">
        <p class="bk-chip bk-chip--glass">Monte</p>
        <h3>Montaña</h3>
        <p>Para los montes de alrededor de Bergara. Te ayudamos a elegir la que encaja con lo que vas a hacer.</p>
      </div>
    </article>
    <article class="bk-card">
      <img loading="lazy" width="800" height="1000" src="${U("photo-1620802090791-fd9420668913", 800)}" alt="Ciclista con una bicicleta urbana"/>
      <div class="bk-card__txt">
        <p class="bk-chip bk-chip--glass">Día a día</p>
        <h3>Eléctricas<br/>y ciudad</h3>
        <p>Para ir al trabajo, subir las cuestas sin llegar sudando o volver a coger la bici.</p>
      </div>
    </article>
    <article class="bk-card bk-card--naranja">
      <div class="bk-card__txt">
        <p class="bk-chip">Y además</p>
        <h3>Todo lo<br/>demás</h3>
        <ul class="bk-pills">
          <li>Segunda mano</li><li>Cuadros</li><li>Ruedas</li><li>Cambios</li>
          <li>Accesorios</li><li>Cascos</li><li>Patinetes</li><li>Spinning</li>
        </ul>
      </div>
    </article>
  </div>
</section>

${seccionProductos(PRODUCTOS.slice(0, 8), "", "En la tienda <em>ahora</em>", "tienda-online")}${seccionMarcas("", null)}
<!-- ═══ 5 · MONTAJE A LA CARTA · oscuro ═══ -->
<section class="bk-montaje" id="montajes">
  <div class="wrap">
    <div class="bk-montaje__in">
      <div>
        <p class="bk-eyebrow bk-eyebrow--claro rev">Montaje a la carta</p>
        <h2 class="bk-h2 rev" data-d="1">Pieza <em>a pieza.</em></h2>
        <p class="bk-montaje__lead rev" data-d="2">Partes del cuadro que te gusta y eliges el resto. Te la entregamos montada, ajustada y lista para rodar.</p>
        <ol class="bk-pasos rev" data-d="2">
          <li><b>01</b><div><h3>Cuadro</h3><p>Carretera, gravel, montaña o ciclocross.</p></div></li>
          <li><b>02</b><div><h3>Ruedas</h3><p>Fulcrum y más, con las cubiertas que pidas.</p></div></li>
          <li><b>03</b><div><h3>Grupo</h3><p>Shimano, SRAM o Campagnolo.</p></div></li>
          <li><b>04</b><div><h3>Montaje y ajuste</h3><p>Y si quieres afinar la postura, pregúntanos por la biomecánica.</p></div></li>
        </ol>
        <a class="btn btn--fill rev" data-d="3" id="m-wa" href="#" target="_blank" rel="noopener">Pedir presupuesto por WhatsApp ${AR}</a>
      </div>
      <figure class="bk-montaje__foto rev" data-d="1">
        <img loading="lazy" width="800" height="1000" src="${U("photo-1673870861521-626b40f9657e", 800)}" alt="Mecánico montando una bicicleta en el taller"/>
      </figure>
    </div>
  </div>
</section>

<!-- ═══ 6 · LAS TRES PREGUNTAS · widgets ═══ -->
<section class="bk-widgets" aria-label="Pago y envíos">
  <div class="wrap bk-widgets__g">
    <article class="bk-w rev"><span class="bk-w__ico">${I.plazos}</span><h3>Sin intereses</h3><p>Paga tu bici en uno o dos años. Te explicamos las condiciones en la tienda.</p></article>
    <article class="bk-w rev" data-d="1"><span class="bk-w__ico">${I.bizum}</span><h3>Bizum</h3><p>Y también con tarjeta.</p></article>
    <article class="bk-w rev" data-d="2"><span class="bk-w__ico">${I.envio}</span><h3>Envíos</h3><p>Si no puedes acercarte a Bergara, te la enviamos. Según el pedido, el envío sale gratis.</p></article>
  </div>
</section>

<!-- ═══ 7 · LA TIENDA ═══ -->
<section class="bk-tienda" id="tienda">
  <div class="wrap bk-tienda__in">
    <figure class="bk-foto rev"><img loading="lazy" width="900" height="700" src="${U("photo-1676531356064-0a527118baf4", 900)}" alt="Mecánico trabajando en una bicicleta"/></figure>
    <div class="rev" data-d="1">
      <p class="bk-eyebrow">La tienda</p>
      <h2 class="bk-h2">Trato cercano.<br/><em>Buen taller.</em></h2>
      <p>Es lo que más repiten quienes compran aquí: que se les atiende con paciencia, que se resuelven todas las dudas antes de comprar y que, después, la bici se revisa y se ajusta.</p>
      <p>Estamos en Zubieta kalea 5 y 7, en Bergara. Pásate con tu bici o con la idea de la que quieres, y lo miramos juntos.</p>
    </div>
  </div>
</section>

<!-- ═══ 8 · GALERÍA · bento ═══ -->
<section class="bk-bento" id="galeria" aria-label="Bicis y taller">
  <div class="wrap bk-bento__g rev">
    <figure class="b1"><img loading="lazy" width="900" height="900" src="${U("photo-1576435728678-68d0fbf94e91", 900)}" alt="Bicicleta de carretera apoyada en una pared de madera"/><figcaption>Carretera</figcaption></figure>
    <figure class="b2"><img loading="lazy" width="600" height="400" src="${U("photo-1562615193-cbeef074a501", 600)}" alt="Detalle de la transmisión de una bicicleta"/><figcaption>Transmisión</figcaption></figure>
    <figure class="b3"><img loading="lazy" width="600" height="400" src="${U("photo-1629056528325-f328b5f27ae7", 600)}" alt="Ciclista en un camino de tierra"/><figcaption>Gravel</figcaption></figure>
    <figure class="b4"><img loading="lazy" width="600" height="400" src="${U("photo-1535369643553-a33e0d1ac81d", 600)}" alt="Ciclista de montaña entre árboles"/><figcaption>Montaña</figcaption></figure>
    <figure class="b5"><img loading="lazy" width="600" height="400" src="${U("photo-1765376260898-38e465a2cf6f", 600)}" alt="Bicicleta de montaña colgada en el taller"/><figcaption>El taller</figcaption></figure>
  </div>
</section>

<!-- ═══ 9 · OPINIONES ═══ -->
<section class="bk-opin" id="opiniones">
  <div class="wrap">
    <div class="bk-opin__cab rev">
      <p class="bk-nota"><b>4,7</b><span><span class="bk-estrellas" aria-hidden="true">★★★★★</span>64 opiniones en Google</span></p>
      <h2 class="bk-h2">Lo que dicen<br/><em>al salir rodando</em></h2>
    </div>
    <div class="bk-opin__g" id="testis"></div>
  </div>
</section>

<!-- ═══ 10 · DÓNDE ═══ -->
<section class="bk-donde" id="donde">
  <div class="wrap">
    <p class="bk-eyebrow rev">Dónde estamos</p>
    <h2 class="bk-h2 rev" data-d="1">Zubieta kalea 5 y 7, <em>Bergara</em></h2>
    <div class="bk-donde__in">
      <div class="bk-mapa rev">
        <iframe title="Mapa de situación de la tienda" loading="lazy" allowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
          src="https://www.openstreetmap.org/export/embed.html?bbox=-2.4224%2C43.1162%2C-2.4064%2C43.1252&layer=mapnik&marker=43.12066%2C-2.41435"></iframe>
      </div>
      <div class="bk-panel rev" data-d="1">
        <table class="horarios">
          <caption>Horario</caption>
          <tbody id="tabla-horario"></tbody>
        </table>
        <dl class="datos">
          <li><dt>Dirección</dt><dd id="d-dir"></dd></li>
          <li><dt>Teléfono</dt><dd><a id="d-tel" href="#"></a></dd></li>
          <li><dt>WhatsApp</dt><dd><a id="d-wa" href="#" target="_blank" rel="noopener"></a></dd></li>
          <li><dt>Email</dt><dd><a id="d-mail" href="#"></a></dd></li>
          <li><dt>Cómo llegar</dt><dd><a id="d-maps" href="#" target="_blank" rel="noopener">Abrir en Google Maps →</a></dd></li>
        </dl>
      </div>
    </div>
  </div>
</section>

</main>

<!-- ═══ 11 · CIERRE ═══ -->
<section class="bk-cierre" id="contacto">
  <div class="wrap">
    <div class="bk-cierre__card">
      <div class="bk-hero__rayas" aria-hidden="true"></div>
      <div class="bk-cierre__txt">
        <p class="bk-eyebrow bk-eyebrow--negro rev">Preguntar</p>
        <h2 class="bk-h2 rev" data-d="1">¿Qué bici tienes<br/><em>en la cabeza?</em></h2>
        <p class="rev" data-d="2">O qué le pasa a la tuya. Por WhatsApp es lo más rápido: te contestamos con precio y disponibilidad.</p>
        <div class="bk-btns rev" data-d="2">
          <a class="btn btn--negro" id="c-wa" href="#" target="_blank" rel="noopener">${I.wa} WhatsApp</a>
          <a class="btn btn--linea" id="c-tel" href="#">Llamar</a>
        </div>
      </div>
      <form class="form bk-form rev" data-d="1" id="form" novalidate>
        <div><label for="f-nom">Nombre</label><input id="f-nom" name="nombre" type="text" autocomplete="name" required/></div>
        <div><label for="f-tel">Teléfono</label><input id="f-tel" name="tel" type="tel" autocomplete="tel" required/></div>
        <div><label for="f-que">Qué buscas o qué necesitas</label><textarea id="f-que" name="busca" rows="3" placeholder="Una gravel para empezar, una eléctrica para ir a trabajar, una revisión…"></textarea></div>
        <button class="btn btn--fill" type="submit">Enviar ${AR}</button>
        <p class="aviso" id="form-aviso" role="status">Te contestamos en horario de tienda.</p>
      </form>
    </div>
  </div>
</section>

<!-- ═══ 12 · PIE ═══ -->
<footer class="pie">
  <div class="wrap pie__in">
    <p>© <span id="year"></span> Biciprecision Igartua · Zubieta kalea 5 y 7 · Bergara, Gipuzkoa</p>
    <p class="pie__marcas">Bicis ${MARCAS.map((m) => `<a href="${m.slug}/">${m.nombre}</a>`).join(" · ")} en Bergara</p>
    <p><a href="#contacto">Aviso legal</a> · <a href="#contacto">Privacidad</a> · <a href="#contacto">Envíos y devoluciones</a></p>
    <p class="demo">Demostración para Biciprecision Igartua, creada sin compromiso por OI Studio · las fotos, los textos y los precios son de ejemplo y se sustituyen por los vuestros.</p>
  </div>
</footer>

`;
pon("cuerpo", /<!-- ═══ 1 · CABECERA ═══ -->[\s\S]*?(?=<!-- ═══ BARRA FIJA MÓVIL ═══ -->)/, CUERPO);

/* ── 3 · DATOS ─────────────────────────────────────────────────────────── */
pon("DATOS", /const DATOS = \{[\s\S]*?\n\};/,
`const DATOS = {
  nombre:    "Biciprecision Igartua",
  reclamo:   "Bicis de carretera, montaña, eléctricas, gravel y ciudad en Bergara. Montajes a la carta.",
  tel:       "+34943761121",
  whatsapp:  "34688673171",
  email:     "biciprecisionigartua@gmail.com",
  direccion: "Zubieta kalea 5 y 7, 20570 Bergara, Gipuzkoa",
  maps:      "https://www.google.com/maps/search/?api=1&query=Biciprecision%20Igartua%20Zubieta%20Kalea%205%20Bergara",
  geo:       { lat:43.1206612, lon:-2.4143534 },
  precio:    "€€",
  marcas: ["Focus","Cube","Lapierre","Moustache","Massi","Coluer","Flanders","Shimano","SRAM","Campagnolo","Fulcrum","Schwalbe","Continental","Lazer"],
  horario: {
    1:[["09:00","13:00"],["16:00","20:00"]],
    2:[["09:00","13:00"],["16:00","20:00"]],
    3:[["09:00","13:00"],["16:00","20:00"]],
    4:[["09:00","13:00"],["16:00","20:00"]],
    5:[["09:00","13:00"],["16:00","20:00"]],
    6:[["09:00","13:00"]],
    0:null,
  },
  /* De su ficha de Google, tal cual. Solo nombre e inicial. */
  resenas: [
    { texto:"Muy buena experiencia de compra, Iñigo me atendió fenomenal y con enorme paciencia resolvió todas mis dudas.", nombre:"Javier M.", cuando:"Google" },
    { texto:"Compré una Cube Stereo 144 SLX. Desde la compra, la entrega y revisión, todo de 10…", nombre:"Asoka C.", cuando:"Google" },
    { texto:"Todo perfecto, muy simpáticos Iñigo y su hermana, trato cercano. Buen mecánico y precios muy competitivos. Muy contento con la compra.", nombre:"Sebas G.", cuando:"Google" },
  ],
};`);

/* ── 4 · funciones de la plantilla ─────────────────────────────────────── */
/* Las marcas van dos veces seguidas: la cinta se desliza un 50 % y vuelve a
   empezar sin que se note el salto. La segunda copia no la lee el lector. */
pon("pintarEscaparate", /function pintarEscaparate\(\)\{[\s\S]*?\n\}/,
`function pintarEscaparate(){
  const li = (m, oculta) => \`<li\${oculta?' aria-hidden="true"':''}>\${m}</li>\`;
  document.getElementById("marcas").innerHTML =
    DATOS.marcas.map(m=>li(m)).join("") + DATOS.marcas.map(m=>li(m,true)).join("");
}`);
pon("mensaje de WhatsApp", /encodeURIComponent\("Hola, quería preguntar por una prenda de "\+DATOS\.nombre\+"\."\)/,
  'encodeURIComponent("Hola, quería preguntar por una bici.")');
pon("enlaces de WhatsApp", /\[\["c-wa",waHref\],\["b-wa",waHref\],\["h-wa",waHref\]\]/, '[["c-wa",waHref],["b-wa",waHref],["h-wa",waHref],["t-wa",waHref],["d-wa",waHref],["m-wa",waHref]]');
pon("WhatsApp y email visibles", /(document\.getElementById\("d-dir"\)\.textContent = DATOS\.direccion;)/,
  `$1
  document.getElementById("d-wa").textContent = DATOS.whatsapp.replace(/^34/,"").replace(/(\\d{3})(?=\\d)/g,"$$1 ").trim();
  const m = document.getElementById("d-mail"); m.textContent = DATOS.email; m.href = "mailto:" + DATOS.email;`);
pon("schema", /"@type":"ClothingStore"/, '"@type":"BikeStore"');
pon("schema: dirección", /const \[calle, resto=""\] = DATOS\.direccion\.split\("·"\)/, 'const [calle, resto=""] = DATOS.direccion.split(",")');

/* ── 5 · estilo deportivo ──────────────────────────────────────────────── */
const CSS = `<style>
/* ═══ BICIPRECISION · dirección deportiva ═══════════════════════════════
   Negro, blanco y naranja de maillot. Titulares condensados en cursiva,
   radios grandes como las tarjetas de iOS, cristal en lo que flota encima
   de una foto y píldoras en todo lo que se toca. */
${FONT_FACE}
:root{
  --fondo:#F4F4F2; --fondo-alt:#EAEAE6; --filete:#DADAD4; --filete-fuerte:#B9B9B1;
  --tinta:#0E0F11; --tinta-sec:#4F535A;
  --acento:#C2410C; --acento-con:#FFFFFF; --acento-osc:#9A3412; --acento-claro:#FF7A45; --acento-suave:#FFE7DC;
  --osc:#0E0F11; --osc-filete:#26282D; --osc-tinta:#C9CBD0; --osc-tinta2:#A4A7AE; --osc-tinta3:#80838B;
  --naranja:#FF5A1F; --negro:#0E0F11;
  --display:"Barlow Condensed","Arial Narrow",system-ui,sans-serif;
  --r-xl:32px; --r-l:26px; --r-m:20px; --r-s:14px;
  --cristal:color-mix(in srgb, #fff 16%, transparent);
}
body{background:var(--fondo);}
::selection{background:var(--naranja);color:var(--negro);}

/* titulares */
.bk-h1,.bk-h2,.bk-card h3,.bk-pasos h3,.bk-w h3,.bk-stats b,.bk-nota b,.marca{
  font-family:var(--display);text-transform:uppercase;font-style:italic;font-weight:800;letter-spacing:-.01em;}
.bk-h1{font-size:clamp(58px,11vw,150px);line-height:.86;color:#fff;margin:14px 0 18px;}
/* el naranja fluorescente solo sobre negro: sobre claro se queda en 2,8 y el titular pide 3 */
.bk-h1 em,.bk-h2 em{font-style:italic;color:#DD4A0E;}
.bk-hero .bk-h1 em,.bk-montaje .bk-h2 em,.bk-opin .bk-h2 em{color:var(--naranja);}
.bk-h2{font-size:clamp(42px,6.4vw,88px);line-height:.9;}
.bk-eyebrow{font-family:var(--detalle);font-size:12px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--acento);margin-bottom:12px;}
.bk-eyebrow--claro{color:var(--naranja);}
.bk-eyebrow--negro{color:var(--negro);}

/* cabecera: píldora de cristal */
.top{border-radius:999px!important;backdrop-filter:blur(18px) saturate(1.4);-webkit-backdrop-filter:blur(18px) saturate(1.4);}
.marca{font-size:24px;gap:6px;}
.marca em{font-family:var(--detalle);font-style:normal;font-size:10.5px;font-weight:700;letter-spacing:.2em;color:var(--acento);}
.nav a{white-space:nowrap;}

/* botones: píldoras */
.btn{border-radius:999px!important;min-height:52px;padding:0 24px;gap:10px;font-weight:700;letter-spacing:.04em;
  transition:transform .25s var(--ease),background .25s,color .25s,box-shadow .25s;}
.btn:active{transform:scale(.97);}
.btn--fill,.oscura .btn--fill{background:var(--naranja)!important;border-color:var(--naranja)!important;color:var(--negro)!important;
  box-shadow:0 10px 30px -10px color-mix(in srgb,var(--naranja) 70%,transparent);}
.btn--fill:hover{background:#FF6E3A!important;}
.btn--glass{background:var(--cristal);border:1px solid color-mix(in srgb,#fff 35%,transparent);color:#fff;
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);}
.btn--negro{background:var(--negro);border:1px solid var(--negro);color:#fff;}
.btn--linea{background:transparent;border:1.5px solid var(--negro);color:var(--negro);}
.bk-btns{display:flex;flex-wrap:wrap;gap:10px;}

/* chips */
.bk-chip{display:inline-flex;align-items:center;gap:8px;border-radius:999px;padding:8px 14px;font-family:var(--detalle);
  font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;background:var(--negro);color:#fff;width:max-content;}
.bk-chip--glass{background:var(--cristal);color:#fff;border:1px solid color-mix(in srgb,#fff 28%,transparent);
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);}
.bk-chip i{width:8px;height:8px;border-radius:50%;background:var(--naranja);box-shadow:0 0 0 4px color-mix(in srgb,var(--naranja) 30%,transparent);}

/* ── hero ── */
.bk-hero{padding:10px 10px 0;}
.bk-hero__card{position:relative;overflow:hidden;border-radius:var(--r-xl);min-height:min(100svh,920px);
  display:flex;flex-direction:column;justify-content:flex-end;background:var(--negro);isolation:isolate;}
.bk-hero__img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2;transform:scale(1.04);}
.bk-hero__velo{position:absolute;inset:0;z-index:-1;
  background:linear-gradient(180deg,rgba(14,15,17,.35) 0%,rgba(14,15,17,.15) 35%,rgba(14,15,17,.88) 78%,rgba(14,15,17,.96) 100%);}
.bk-hero__rayas{position:absolute;right:-60px;top:18%;width:340px;height:220px;z-index:-1;opacity:.9;
  background:repeating-linear-gradient(-58deg,var(--naranja) 0 10px,transparent 10px 26px);
  -webkit-mask:linear-gradient(90deg,transparent,#000 60%);mask:linear-gradient(90deg,transparent,#000 60%);}
.bk-hero__in{padding:120px clamp(20px,5vw,64px) 24px;max-width:1100px;}
/* móvil: las rayas arriba y pequeñas (encima del titular se comían «RUEDA MÁS») y la foto más oscura, que hay muchas bicis detrás del texto */
@media(max-width:700px){
  .bk-hero__rayas{top:84px;right:-70px;width:200px;height:110px;opacity:.6;}
  .bk-hero__velo{background:linear-gradient(180deg,rgba(14,15,17,.4) 0%,rgba(14,15,17,.62) 32%,rgba(14,15,17,.9) 58%,rgba(14,15,17,.97) 100%);}
}
.bk-hero__lead{color:#E7E8EA;font-size:clamp(17px,1.6vw,20px);max-width:44ch;margin-bottom:24px;}
.bk-stats{list-style:none;margin:8px clamp(10px,2vw,20px) clamp(10px,2vw,20px);padding:0;display:grid;grid-template-columns:repeat(2,1fr);
  gap:1px;border-radius:var(--r-l);overflow:hidden;background:color-mix(in srgb,#fff 14%,transparent);
  backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid color-mix(in srgb,#fff 18%,transparent);}
@media(min-width:900px){.bk-stats{grid-template-columns:repeat(4,1fr);}}
.bk-stats li{padding:16px 18px;background:color-mix(in srgb,var(--negro) 38%,transparent);color:#fff;}
.bk-stats b{display:block;font-size:clamp(30px,3.4vw,44px);line-height:1;}
.bk-stats b span{color:var(--naranja);font-size:.7em;margin-left:2px;}
.bk-stats small{display:block;margin-top:6px;font-size:13px;color:#C9CBD0;line-height:1.3;}

/* ── cinta de marcas ── */
.bk-marcas{padding:26px 0!important;overflow:hidden;}
.bk-marcas__pista{-webkit-mask:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);}
.bk-marcas ul{list-style:none;display:flex;gap:12px;width:max-content;padding:0;animation:bk-cinta 38s linear infinite;}
.bk-marcas li{border:1.5px solid var(--filete-fuerte);border-radius:999px;padding:10px 22px;white-space:nowrap;
  font-family:var(--display);font-style:italic;font-weight:700;font-size:22px;text-transform:uppercase;letter-spacing:.02em;}
@keyframes bk-cinta{to{transform:translateX(-50%);}}
@media(hover:hover){.bk-marcas:hover ul{animation-play-state:paused;}}
@media(prefers-reduced-motion:reduce){.bk-marcas ul{animation:none;flex-wrap:wrap;width:auto;padding:0 20px;}.bk-marcas li[aria-hidden]{display:none;}}

/* ── bicis: carril de tarjetas ── */
.bk-secc{padding-bottom:clamp(40px,6vw,90px)!important;}
.bk-cab{display:flex;flex-direction:column;margin-bottom:28px;}
.bk-carril{display:grid;grid-auto-flow:column;grid-auto-columns:min(82%,340px);gap:14px;overflow-x:auto;
  scroll-snap-type:x mandatory;padding:4px max(20px,calc((100vw - 1180px)/2 + 20px)) 18px;scrollbar-width:none;}
.bk-carril::-webkit-scrollbar{display:none;}
@media(min-width:1100px){.bk-carril{grid-auto-flow:row;grid-template-columns:repeat(4,1fr);max-width:1180px;margin:0 auto;padding:4px 20px;overflow:visible;}}
.bk-card{position:relative;scroll-snap-align:start;min-height:470px;border-radius:var(--r-l);overflow:hidden;background:var(--negro);
  color:#fff;display:flex;align-items:flex-end;isolation:isolate;transition:transform .45s var(--ease);}
.bk-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2;transition:transform .9s var(--ease);}
.bk-card::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,transparent 30%,rgba(14,15,17,.92));}
@media(hover:hover){.bk-card:hover{transform:translateY(-6px);}.bk-card:hover img{transform:scale(1.06);}}
.bk-card__txt{padding:22px;display:grid;gap:10px;}
.bk-card h3{font-size:44px;line-height:.9;}
.bk-card p{font-size:15.5px;color:#DADBDE;}
.bk-card--naranja{background:var(--naranja);color:var(--negro);}
.bk-card--naranja::after{display:none;}
.bk-card--naranja .bk-chip{background:var(--negro);color:#fff;}
.bk-card--naranja .bk-card__txt{align-self:stretch;align-content:start;}
.bk-pills{list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:8px;margin-top:6px;}
.bk-pills li{background:color-mix(in srgb,var(--negro) 10%,transparent);border:1.5px solid var(--negro);border-radius:999px;padding:7px 14px;font-weight:700;font-size:14px;}

/* ── montaje ── */
.bk-montaje{background:var(--negro);color:#fff;border-radius:var(--r-xl);margin:0 10px;}
.bk-montaje__in{display:grid;gap:clamp(28px,4vw,60px);align-items:center;}
@media(min-width:960px){.bk-montaje__in{grid-template-columns:1.1fr .9fr;}}
.bk-montaje__lead{color:#C9CBD0;font-size:18px;max-width:46ch;margin:16px 0 22px;}
.bk-pasos{list-style:none;padding:0;display:grid;gap:10px;margin-bottom:26px;}
@media(min-width:600px){.bk-pasos{grid-template-columns:1fr 1fr;}}
.bk-pasos li{display:flex;gap:14px;align-items:flex-start;padding:16px;border-radius:var(--r-m);
  background:color-mix(in srgb,#fff 6%,transparent);border:1px solid color-mix(in srgb,#fff 12%,transparent);}
.bk-pasos b{flex:0 0 auto;width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:var(--naranja);color:var(--negro);
  font-family:var(--display);font-style:italic;font-weight:800;font-size:18px;}
.bk-pasos h3{font-size:26px;line-height:1;margin-bottom:4px;}
.bk-pasos p{font-size:14.5px;color:#B9BCC3;}
.bk-montaje__foto img{border-radius:var(--r-l);aspect-ratio:4/5;object-fit:cover;width:100%;}

/* ── widgets ── */
.bk-widgets{padding-bottom:0!important;}
.bk-widgets__g{display:grid;gap:12px;}
@media(min-width:760px){.bk-widgets__g{grid-template-columns:repeat(3,1fr);}}
.bk-w{background:#fff;border-radius:var(--r-l);padding:24px;border:1px solid var(--filete);
  box-shadow:0 1px 2px rgba(0,0,0,.04),0 18px 40px -28px rgba(0,0,0,.25);}
.bk-w__ico{width:54px;height:54px;border-radius:18px;display:grid;place-items:center;background:var(--negro);color:var(--naranja);margin-bottom:16px;}
.bk-w h3{font-size:34px;line-height:1;margin-bottom:6px;}
.bk-w p{color:var(--tinta-sec);font-size:15.5px;}

/* ── tienda ── */
.bk-tienda__in{display:grid;gap:clamp(24px,4vw,56px);align-items:center;}
@media(min-width:900px){.bk-tienda__in{grid-template-columns:1fr 1fr;}}
.bk-tienda p:not(.bk-eyebrow){color:var(--tinta-sec);margin-top:14px;max-width:52ch;}
.bk-foto img{border-radius:var(--r-l);width:100%;aspect-ratio:9/7;object-fit:cover;}

/* ── bento ── */
.bk-bento{padding-top:0!important;}
.bk-bento__g{display:grid;gap:10px;grid-template-columns:1fr 1fr;}
.bk-bento__g figure{position:relative;border-radius:var(--r-m);overflow:hidden;margin:0;min-height:160px;}
.bk-bento__g img{width:100%;height:100%;object-fit:cover;transition:transform .9s var(--ease);}
.bk-bento__g .b1{grid-column:1/-1;min-height:260px;}
@media(min-width:900px){
  .bk-bento__g{grid-template-columns:2fr 1fr 1fr;grid-template-rows:230px 230px;}
  .bk-bento__g .b1{grid-column:1;grid-row:1/3;}
}
@media(hover:hover){.bk-bento__g figure:hover img{transform:scale(1.05);}}
.bk-bento__g figcaption{position:absolute;left:10px;bottom:10px;border-radius:999px;padding:6px 12px;font-size:12px;font-weight:700;
  letter-spacing:.1em;text-transform:uppercase;color:#fff;background:color-mix(in srgb,var(--negro) 70%,transparent);
  backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);}

/* ── opiniones ── */
.bk-opin{background:var(--negro);color:#fff;border-radius:var(--r-xl);margin:0 10px;}
.bk-opin__cab{display:grid;gap:18px;margin-bottom:30px;}
@media(min-width:900px){.bk-opin__cab{grid-template-columns:auto 1fr;align-items:end;gap:48px;}}
.bk-nota{display:flex;align-items:center;gap:14px;}
.bk-nota b{font-size:96px;line-height:.8;color:var(--naranja);}
.bk-nota > span{display:grid;font-size:14px;color:#C9CBD0;}
.bk-estrellas{color:var(--naranja);letter-spacing:.12em;font-size:20px;}
.bk-opin__g{display:grid;gap:12px;}
@media(min-width:900px){.bk-opin__g{grid-template-columns:repeat(3,1fr);}}
.bk-opin__g blockquote{margin:0;padding:24px;border-radius:var(--r-l);background:color-mix(in srgb,#fff 6%,transparent);
  border:1px solid color-mix(in srgb,#fff 12%,transparent);display:flex;flex-direction:column;justify-content:space-between;gap:18px;}
.bk-opin__g blockquote::before{content:"★★★★★";color:var(--naranja);letter-spacing:.12em;}
.bk-opin__g blockquote p{font-size:18px;line-height:1.45;color:#EDEEF0;}
.bk-opin__g cite{font-style:normal;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#A4A7AE;}

/* ── dónde ── */
.bk-donde__in{display:grid;gap:12px;margin-top:26px;}
@media(min-width:900px){.bk-donde__in{grid-template-columns:1.3fr .7fr;}}
.bk-mapa{border-radius:var(--r-l);overflow:hidden;min-height:340px;border:1px solid var(--filete);}
.bk-mapa iframe{width:100%;height:100%;min-height:340px;border:0;display:block;}
.bk-panel{background:#fff;border-radius:var(--r-l);padding:22px;border:1px solid var(--filete);}
.bk-panel .horarios tr.hoy td{color:var(--acento);}

/* ── cierre ── */
.bk-cierre__card{position:relative;overflow:hidden;isolation:isolate;border-radius:var(--r-xl);background:var(--naranja);color:var(--negro);
  padding:clamp(26px,5vw,60px);display:grid;gap:28px;}
@media(min-width:960px){.bk-cierre__card{grid-template-columns:1fr 1fr;align-items:center;}}
.bk-cierre__card .bk-hero__rayas{top:auto;bottom:-40px;right:-40px;opacity:.25;
  background:repeating-linear-gradient(-58deg,var(--negro) 0 10px,transparent 10px 26px);}
.bk-cierre__card .bk-h2 em{color:#fff;}
.bk-cierre__txt p:not(.bk-eyebrow){font-size:18px;max-width:40ch;margin:14px 0 22px;}
.bk-form{background:#fff;border-radius:var(--r-l);padding:22px;box-shadow:0 30px 60px -30px rgba(0,0,0,.45);}
.bk-form input,.bk-form textarea{border-radius:var(--r-s)!important;}
.bk-form .btn--fill{background:var(--negro)!important;border-color:var(--negro)!important;color:#fff!important;box-shadow:none;}

/* ── tienda: tarjetas de producto como las de las marcas grandes ── */
.bk-cab--fila{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:16px;}
.bk-carril--prod{grid-auto-columns:min(74%,290px);}
@media(min-width:1100px){.bk-carril--prod{grid-template-columns:repeat(4,1fr);}}
.bk-prod__c{scroll-snap-align:start;}
.bk-prod__c a{display:flex;flex-direction:column;height:100%;background:#fff;border:1px solid var(--filete);border-radius:var(--r-l);overflow:hidden;
  transition:transform .4s var(--ease),box-shadow .4s var(--ease);}
@media(hover:hover){.bk-prod__c a:hover{transform:translateY(-5px);box-shadow:0 24px 50px -30px rgba(0,0,0,.35);}}
.bk-prod__c figure{margin:0;background:#fff;aspect-ratio:3/2;display:grid;place-items:center;padding:10px;}
.bk-prod__c img{width:100%;height:100%;object-fit:contain;border-radius:var(--r-s);}
.bk-prod__t{padding:16px 18px 18px;display:grid;gap:4px;flex:1;align-content:start;}
.bk-prod__cat{font-size:11.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--acento);}
.bk-prod__t h3{font-family:var(--display);font-style:italic;font-weight:700;text-transform:uppercase;font-size:24px;line-height:1;}
.bk-prod__pvp{font-family:var(--display);font-weight:700;font-size:26px;margin-top:6px;}
.bk-prod__ver{margin-top:6px;font-size:14px;font-weight:700;color:var(--acento);}
.bk-prod__nota{font-size:13.5px;color:var(--tinta-sec);margin-top:14px;}

/* ── marcas: tarjetas que llevan a su página ── */
.bk-mar__g{display:grid;gap:10px;margin-top:24px;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));}
.bk-mar__c{position:relative;display:grid;gap:6px;padding:22px;border-radius:var(--r-l);background:var(--negro);color:#fff;min-height:140px;align-content:end;
  overflow:hidden;transition:transform .35s var(--ease),background .35s;}
.bk-mar__c b{font-family:var(--display);font-style:italic;font-weight:800;text-transform:uppercase;font-size:42px;line-height:.9;}
.bk-mar__c span{font-size:13.5px;color:#C9CBD0;}
.bk-mar__c i{position:absolute;top:16px;right:16px;width:38px;height:38px;border-radius:50%;display:grid;place-items:center;font-style:normal;
  background:var(--naranja);color:var(--negro);font-weight:700;transition:transform .35s var(--ease);}
@media(hover:hover){.bk-mar__c:hover{transform:translateY(-4px);}.bk-mar__c:hover i{transform:rotate(-45deg);}}

/* ── página de marca ── */
.bk-mhero{padding:10px 10px 0;}
.bk-mhero__card{position:relative;overflow:hidden;isolation:isolate;border-radius:var(--r-xl);background:var(--negro);color:#fff;
  padding:140px clamp(20px,5vw,64px) clamp(28px,4vw,56px);}
.bk-mhero__card .bk-hero__lead{margin-top:8px;}
.bk-tipos{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px;}
.bk-tipos a{display:inline-flex;align-items:center;gap:10px;min-height:48px;padding:0 20px;border-radius:999px;background:#fff;border:1.5px solid var(--negro);
  font-family:var(--display);font-style:italic;font-weight:700;text-transform:uppercase;font-size:22px;transition:background .25s,color .25s;}
.bk-tipos a:hover{background:var(--negro);color:#fff;}
.bk-migas{font-size:13px;color:#A4A7AE;margin-bottom:10px;}
.bk-migas a{text-decoration:underline;text-underline-offset:3px;display:inline-flex;align-items:center;min-height:44px;}

/* ── barra móvil y pie ── */
.pie__marcas a{text-decoration:underline;text-underline-offset:3px;}
.barra{border-radius:999px!important;}
.barra .pri{background:var(--naranja)!important;color:var(--negro)!important;}
.pie a{display:inline-flex;align-items:center;min-height:44px;}
</style>
</head>`;
/* Al final del body: así gana a los estilos del kit de movimiento, que van
   detrás de los de la plantilla. */
pon("estilos", /<\/body>/, CSS.replace(/<\/head>$/, "</body>"));

/* El resaltado del menú busca la sección de cada enlace con querySelector: con
   un enlace que no empieza por "#" (las páginas de marca) lanzaba un error. */
pon("menú: solo anclas", /const links=\[\.\.\.document\.querySelectorAll\("\.nav a"\)\];/,
  'const links=[...document.querySelectorAll(".nav a")].filter(a=>(a.getAttribute("href")||"").startsWith("#"));');

fs.writeFileSync(F, s);

/* ── 6 · una página por marca: /cube/, /focus/… ───────────────────────────
   Es lo que pidió Iñigo: aparecer cuando alguien busca "Cube". Contra la
   propia marca y las tiendas online nacionales no se compite, pero sí en
   "bicis Cube en Bergara" / "tienda Cube Gipuzkoa": para eso hace falta una
   página que hable solo de esa marca, con su título, sus tipos de bici y sus
   modelos. Se construye a partir de la portada ya terminada: misma cabecera,
   mismo pie, mismo diseño; solo cambia el <main>. */
const dondeYOpiniones = (s.match(/<!-- ═══ 9 · OPINIONES ═══ -->[\s\S]*?(?=<\/main>)/) || [""])[0];
const cinta = (s.match(/<!-- ═══ 3 · MARCAS · cinta ═══ -->[\s\S]*?<\/section>\n/) || [""])[0];
for (const m of MARCAS) {
  const suyos = PRODUCTOS.filter((p) => p.m === m.slug);
  const tipos = m.tipos.map(([t]) => t.toLowerCase());
  const tiposTxt = tipos.length > 1 ? tipos.slice(0, -1).join(", ") + " y " + tipos.at(-1) : tipos[0];
  const main = `<main id="main">

<!-- ═══ MARCA · ${m.nombre} ═══ -->
<section class="bk-mhero" id="inicio">
  <div class="bk-mhero__card">
    <div class="bk-hero__rayas" aria-hidden="true"></div>
    <p class="bk-migas"><a href="../">Biciprecision Igartua</a> · Marcas · ${m.nombre}</p>
    <p class="bk-chip bk-chip--glass rev"><i aria-hidden="true"></i>Tienda de bicis · Bergara</p>
    <h1 class="bk-h1 rev" data-d="1">Bicis <em>${m.nombre}</em><br/>en Bergara</h1>
    <p class="bk-hero__lead rev" data-d="2">En Biciprecision Igartua tenemos bicis ${m.nombre} de ${tiposTxt}. Ven a verlas a Zubieta kalea 5 y 7, en Bergara, o pregúntanos por WhatsApp si tenemos el modelo y la talla que buscas.</p>
    <div class="bk-btns rev" data-d="3">
      <a class="btn btn--fill" id="h-wa" href="#" target="_blank" rel="noopener">${I.wa} Preguntar por una ${m.nombre}</a>
      <a class="btn btn--glass" href="${TIENDA + m.tipos[0][1]}" target="_blank" rel="noopener">Ver en la tienda online</a>
    </div>
  </div>
</section>

<section class="bk-secc" aria-label="Tipos de bici ${m.nombre}">
  <div class="wrap">
    <p class="bk-eyebrow rev">${m.nombre} en la tienda</p>
    <h2 class="bk-h2 rev" data-d="1">¿Qué ${m.nombre} <em>buscas?</em></h2>
    <div class="bk-tipos rev" data-d="2">${m.tipos.map(([t, u]) => `
      <a href="${TIENDA + u}" target="_blank" rel="noopener">${t} ${AR}</a>`).join("")}
    </div>
  </div>
</section>
${suyos.length ? seccionProductos(suyos, "../", `${m.nombre} <em>en la tienda</em>`, "tienda-online") : ""}
${seccionMarcas("../", m.slug)}
${cinta}
${dondeYOpiniones}
</main>`;
  let p = s.replace(/<main id="main">[\s\S]*?<\/main>/, main)
    .replace(/<title>[^<]*<\/title>/, `<title>Bicicletas ${m.nombre} en Bergara | Biciprecision Igartua</title>`)
    .replace(/(<meta name="description" content=")[^"]*"/, `$1Bicis ${m.nombre} de ${tiposTxt} en Bergara (Gipuzkoa). Ven a verlas a Biciprecision Igartua, Zubieta kalea 5 y 7, o pregúntanos por WhatsApp."`)
    .replace(/(<meta property="og:title" content=")[^"]*"/, `$1Bicis ${m.nombre} en Bergara — Biciprecision Igartua"`)
    .replace(/url\('fuentes\//g, "url('../fuentes/")
    .replace(/<a class="marca" href="#inicio">/, '<a class="marca" href="../">')
    .replace(/(<nav class="nav" aria-label="Principal">[\s\S]*?<\/nav>)/, (n) => n.replace(/href="#/g, 'href="../#'))
    .replace(/(<p class="pie__marcas">[\s\S]*?<\/p>)/, (n) => n.replace(/href="/g, 'href="../'))
    .replace(/"Hola, quería preguntar por una bici\."/, `"Hola, quería preguntar por una bici ${m.nombre}."`);
  // Migas de pan para Google
  p = p.replace(/<\/head>/, `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Biciprecision Igartua", item: "../" },
      { "@type": "ListItem", position: 2, name: `Bicis ${m.nombre}` },
    ] })}</script>\n</head>`);
  fs.mkdirSync(path.join(DIR, m.slug), { recursive: true });
  fs.writeFileSync(path.join(DIR, m.slug, "index.html"), p);
  hecho.push(`página /${m.slug}/ (${suyos.length} modelos)`);
}
console.log("ajustado (" + antes + " → " + s.length + " caracteres)");
hecho.forEach((h) => console.log("  · " + h));
