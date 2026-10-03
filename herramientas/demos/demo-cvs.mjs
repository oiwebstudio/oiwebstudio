/**
 * Ajusta la demo de CVS Instalazio Elektrikoak (Beasain), electricista.
 *
 * Todo lo que se escribe sale de:
 *   · su web (sites.google.com/view/cvs-instalazio-electrikoak): servicios,
 *     "empresa habilitada en baja tensión 20/EIBT-1827", urgencias 24 h,
 *     horario L-S 8-18, teléfono, correo y dirección
 *   · su ficha de Google: 4,8 con 11 opiniones y las reseñas, copiadas tal cual
 *
 * La plantilla de gremios es de una empresa de reformas: precios de obra,
 * obras antes/después en Ibarra y Villabona, un seguro de 600.000 € y una
 * garantía de tres años que nadie ha dicho. Todo eso se va.
 *
 *   node herramientas/demos/generar-demo.mjs --id 2966 --plantilla reformas-gremios
 *   node herramientas/demos/demo-cvs.mjs
 */
import fs from "node:fs";

const F = "web/demos/clientes/cvs-instalazio-elektrikoak/index.html";
let s = fs.readFileSync(F, "utf8");
const antes = s.length;
const hecho = [];
function pon(desc, re, con) {
  const nuevo = s.replace(re, con);
  if (nuevo === s) { console.log("!! no encontrado: " + desc); return; }
  s = nuevo; hecho.push(desc);
}

/* ── 0 · color: azul de cuadro eléctrico y amarillo de aviso ──────────────
   El amarillo solo va sobre fondo oscuro: sobre blanco no llega al contraste
   mínimo. En claro, el acento es el azul. */
const COLOR = {
  "--fondo": "#F7F8FA", "--fondo-alt": "#EDF0F5", "--filete": "#D9DEE7", "--filete-fuerte": "#B7BFCC",
  "--tinta": "#121722", "--tinta-sec": "#4D5667",
  "--acento": "#1D4ED8", "--acento-con": "#FFFFFF", "--acento-osc": "#1638A3", "--acento-claro": "#FACC15",
  "--osc": "#0F1522", "--osc-filete": "#253047", "--osc-tinta": "#E6EAF2", "--osc-tinta2": "#B3BCCC", "--osc-tinta3": "#8791A3",
};
for (const [k, v] of Object.entries(COLOR)) pon("color " + k, new RegExp("(\\n\\s*" + k + ":)[^;]*;"), "$1" + v + ";");

/* ── 1 · DATOS ── */
pon("reclamo", /reclamo:\s*"[^"]*"/, 'reclamo:   "Electricista autorizado en Beasain. Boletines, revisiones, reformas y urgencias 24 h."');

/* ── 2 · cabecera ── */
pon("marca", /<a class="marca" href="#inicio">[^<]*<em>[^<]*<\/em><\/a>/, '<a class="marca" href="#inicio">CVS <em>Elektrikoak</em></a>');
pon("navegación", /<nav class="nav" aria-label="Principal">[\s\S]*?<\/nav>/,
`<nav class="nav" aria-label="Principal">
      <a href="#servicios">Servicios</a>
      <a href="#urgencias">Urgencias</a>
      <a href="#opiniones">Opiniones</a>
      <a href="#donde">Dónde estamos</a>
    </nav>`);
pon("botón de la cabecera", /<a class="btn btn--fill top__cta" href="#contacto">Presupuesto /, '<a class="btn btn--fill top__cta" href="#contacto">Llamar ');

/* ── 3 · hero ── */
const U = (id, w) => `https://images.unsplash.com/${id}?w=${w}&q=78&auto=format&fit=crop`;
pon("hero", /<section class="hero" id="inicio">[\s\S]*?<\/section>/,
`<section class="hero" id="inicio">
  <div class="wrap hero__in">
    <div class="hero__col">
      <p class="rotulo rev">Electricista autorizado · Beasain</p>
      <h1 class="rev" data-d="1">La luz de tu casa,<br/><em>en regla</em> y a tiempo</h1>
      <div class="hero__btns rev" data-d="2">
        <a class="btn btn--fill" id="h-tel" href="#">Llamar al 613 26 82 12 <span class="ar" aria-hidden="true">→</span></a>
        <a class="btn btn--ghost" href="#servicios">Ver servicios</a>
      </div>
    </div>
    <div class="hero__col rev" data-d="2">
      <p class="lead">Reformas, reparaciones y mantenimiento de instalaciones de baja tensión, en viviendas y en locales. Y si se va la luz, urgencias las 24 horas.</p>
      <dl class="hero__compromiso">
        <div><dt>Empresa habilitada</dt><dd>Baja tensión · certificado n.º 20/EIBT-1827</dd></div>
        <div><dt>Urgencias</dt><dd>Las 24 horas</dd></div>
        <div><dt>Horario</dt><dd>De lunes a sábado, de 8:00 a 18:00</dd></div>
      </dl>
    </div>
  </div>
  <figure class="hero__foto rev" data-d="3">
    <img src="${U("photo-1758101755915-462eddc23f57", 1800)}"
      srcset="${U("photo-1758101755915-462eddc23f57", 800)} 800w, ${U("photo-1758101755915-462eddc23f57", 1800)} 1800w"
      sizes="(max-width: 719px) 100vw, 1200px"
      alt="Electricista comprobando un cuadro eléctrico con el polímetro" width="1800" height="900" fetchpriority="high"/>
  </figure>
</section>`);

/* ── 4 · servicios: los de su web, sin precios ni plazos inventados ── */
const SERV = [
  ["Boletines (CIE)", "El certificado de la instalación para dar de alta la luz en una vivienda o un local nuevo, o después de una reforma."],
  ["Revisiones periódicas", "Las inspecciones de la instalación que pide la normativa, con su informe."],
  ["Tomas de tierra", "Comprobación, medición y arreglo de la toma de tierra de la instalación."],
  ["Reformas de instalación", "Cuadro, cableado, enchufes y puntos de luz nuevos cuando se reforma una casa o un local."],
  ["Reparaciones y mantenimiento", "Averías, saltos de diferencial, enchufes que no van y el mantenimiento de la instalación."],
  ["Domótica y automatización", "Control de la energía, de la iluminación y de la seguridad en viviendas y edificios."],
  ["Rótulos y alumbrado", "Lámparas de descarga y rótulos luminosos para comercios y locales."],
  ["Grupos electrógenos", "Instalación de generadores de baja tensión."],
  ["Líneas de distribución", "Líneas aéreas y subterráneas, e instalaciones en locales con riesgo de incendio o explosión."],
];
pon("servicios", /<section class="serv" id="servicios">[\s\S]*?<\/section>/,
`<section class="serv" id="servicios">
  <div class="wrap">
    <div class="serv__cab">
      <div class="rev">
        <p class="rotulo">Servicios</p>
        <h2>Lo que hacemos</h2>
      </div>
      <p class="lead rev" data-d="1">El precio de cada trabajo depende de la instalación. Llámanos, cuéntanos qué necesitas y te damos presupuesto.</p>
    </div>
    <div class="srv">
${SERV.map((x, i) => `      <article class="srv__i rev" data-d="${i % 3}">
        <p class="srv__n">${String(i + 1).padStart(2, "0")}</p>
        <h3>${x[0]}</h3>
        <p>${x[1]}</p>
      </article>`).join("\n")}
    </div>
  </div>
</section>`);

/* ── 5 · urgencias (sustituye a las obras antes/después, que eran inventadas) ── */
pon("urgencias", /<section class="obras sector" id="obras">[\s\S]*?<\/section>/,
`<section class="obras sector" id="urgencias">
  <div class="wrap urg">
    <div class="urg__t rev">
      <p class="rotulo">Urgencias 24 horas</p>
      <h2>¿Se te ha ido<br/>la luz?</h2>
      <p class="lead">Un diferencial que no sube, un enchufe que echa chispas o un cuadro que salta sin parar: llámanos a la hora que sea.</p>
      <a class="btn btn--sol" id="u-tel" href="#">Llamar ahora · 613 26 82 12 <span class="ar" aria-hidden="true">→</span></a>
    </div>
    <figure class="urg__f rev" data-d="1">
      <img loading="lazy" src="${U("photo-1682345262055-8f95f3c513ea", 900)}" alt="Electricista con guantes sujetando un cable" width="900" height="600"/>
    </figure>
  </div>
</section>`);

/* ── 6 · papeles: solo lo que dicen ellos ── */
pon("papeles", /<section class="cert" id="garantias">[\s\S]*?<\/section>/,
`<section class="cert" id="garantias">
  <div class="wrap cert__in">
    <div class="cert__cab">
      <p class="rotulo rev">En regla</p>
      <h2 class="rev" data-d="1">Instalación hecha<br/>y con sus papeles</h2>
      <p class="rev" data-d="2">Para dar de alta la luz, pasar una inspección o cambiar de compañía hacen falta los papeles de la instalación. Te los hacemos nosotros.</p>
    </div>
    <dl class="cert__l rev" data-d="1">
      <div><dt>Empresa habilitada en baja tensión</dt><dd>Certificado n.º 20/EIBT-1827.</dd></div>
      <div><dt>Boletines (CIE)</dt><dd>Para instalaciones nuevas de viviendas y locales, y después de una reforma.</dd></div>
      <div><dt>Revisiones periódicas</dt><dd>Inspecciones y mediciones de tomas de tierra.</dd></div>
    </dl>
  </div>
</section>`);

/* ── 7 · fuera la galería de reformas (fotos de cocinas y salones) ── */
pon("galería de reformas", /<!-- ═══ 6 · GALERÍA[\s\S]*?<\/section>\n/, "");

/* ── 8 · opiniones reales ── */
const MAPS = "https://www.google.com/maps/search/?api=1&query=CVS%20instalaciones%20electricas%20Beasain";
const RES = [
  { q: "Estoy súper contenta con el trabajo realizado. Desde el primer día me transmitió mucha confianza y tranquilidad. A medida que iba avanzando la obra, me fue explicando todo lo que encontraba, los problemas que había y las distintas opciones […]", a: "Nagore M.", c: "hace 3 meses" },
  { q: "Muy contentos con su trabajo, son rápidos, eficaces y limpios. Buena gente.", a: "Olga G.", c: "hace 8 meses" },
  { q: "La rapidez y eficacia ante la llamada de solicitar sus servicios de electricista es puntual y ante el problema me han resuelto en un instante […]", a: "Lourdes C.", c: "hace un año" },
];
pon("opiniones", /<!-- ═══ 3 · CIFRAS/,
`<section class="dicen" id="opiniones">
  <div class="wrap">
    <div class="dicen__cab rev">
      <p class="rotulo">Opiniones</p>
      <h2>4,8 en Google,<br/>con 11 opiniones</h2>
    </div>
    <div class="dicen__g">
${RES.map((r, i) => `      <figure class="dicho rev" data-d="${i}">
        <p class="dicho__e" aria-hidden="true">★★★★★</p>
        <blockquote>${r.q}</blockquote>
        <figcaption>${r.a} <span>· ${r.c}</span></figcaption>
      </figure>`).join("\n")}
    </div>
    <p class="dicen__pie rev" data-d="2"><a href="${MAPS}" target="_blank" rel="noopener">Verlas todas en Google →</a></p>
  </div>
</section>

<!-- ═══ 3 · CIFRAS`);

/* ── 9 · cifras que se pueden comprobar ── */
pon("cifras", /<section class="cifras"[\s\S]*?<\/section>/,
`<section class="cifras" aria-label="En cifras">
  <div class="wrap">
    <ul>
      <li class="rev"><b>4,8</b><small>Google<br/>11 opiniones</small></li>
      <li class="rev" data-d="1"><b>24 h</b><small>urgencias</small></li>
      <li class="rev" data-d="2"><b>L–S</b><small>de 8:00<br/>a 18:00</small></li>
      <li class="rev" data-d="3"><b>BT</b><small>empresa<br/>habilitada</small></li>
    </ul>
  </div>
</section>`);

/* ── 10 · dónde y cierre ── */
pon("dónde", /<h2 class="rev" data-d="1" style="max-width:18ch">[^<]*<br\/>[^<]*<\/h2>/,
'<h2 class="rev" data-d="1" style="max-width:18ch">En Beasain,<br/>calle Esteban Lasa 9</h2>');
pon("título del horario", /<caption>Horario de oficina<\/caption>/, "<caption>Horario</caption>");
pon("cierre", /<p class="rotulo rev">Presupuesto<\/p>[\s\S]*?<div class="cierre__btns rev" data-d="2">[\s\S]*?<\/div>/,
`<p class="rotulo rev">Presupuesto</p>
    <h2 class="rev" data-d="1">Cuéntanos qué<br/>necesitas</h2>
    <p class="rev" data-d="2">Por teléfono o por correo. Si es una urgencia, llama directamente: atendemos las 24 horas.</p>
    <div class="cierre__btns rev" data-d="2">
      <a class="btn" id="c-tel" href="#">Llamar al 613 26 82 12 <span class="ar" aria-hidden="true">→</span></a>
      <a class="btn" href="mailto:cvs.instalaciones.electricas@gmail.com">Escribir un correo</a>
    </div>`);
pon("formulario: qué", /<label for="f-obra">[^<]*<\/label><input id="f-obra" name="obra" type="text" placeholder="[^"]*"\/>/,
'<label for="f-obra">Qué necesitas</label><input id="f-obra" name="obra" type="text" placeholder="Boletín para un piso · Beasain"/>');
pon("formulario: más", /<label for="f-msg">[^<]*<\/label><textarea id="f-msg" name="mensaje" rows="2" placeholder="[^"]*"><\/textarea>/,
'<label for="f-msg">Cuéntanos un poco más</label><textarea id="f-msg" name="mensaje" rows="2" placeholder="Qué pasa, desde cuándo y si es vivienda o local"></textarea>');
pon("botón del formulario", /Pedir visita <span/, "Enviar <span");
pon("aviso del formulario", /Te llamamos en 48 h laborables para concretar la visita\./, "Te llamamos en cuanto lo veamos.");

/* ── 11 · barra del móvil: sin WhatsApp confirmado, el correo ── */
pon("barra del móvil", /<a id="b-wa"[^>]*>WhatsApp<\/a>/, '<a href="mailto:cvs.instalaciones.electricas@gmail.com">Escribir</a>');

/* ── 12 · meta, icono, pie ── */
pon("título", /<title>[^<]*<\/title>/, "<title>CVS Elektrikoak — Electricista autorizado en Beasain</title>");
pon("descripción", /<meta name="description" content="[^"]*"\/>/,
'<meta name="description" content="Electricista autorizado en Beasain. Boletines, revisiones, tomas de tierra, reformas y reparaciones. Urgencias 24 horas. 613 26 82 12."/>');
pon("og:title", /<meta property="og:title" content="[^"]*"\/>/, '<meta property="og:title" content="CVS Elektrikoak — Electricista autorizado en Beasain"/>');
pon("og:description", /<meta property="og:description" content="[^"]*"\/>/, '<meta property="og:description" content="Boletines, revisiones, reformas y urgencias 24 horas."/>');
pon("og:image", /<meta property="og:image" content="[^"]*"\/>/, `<meta property="og:image" content="${U("photo-1758101755915-462eddc23f57", 1200)}&h=630"/>`);
pon("icono", /<meta name="viewport"([^>]*)\/>/,
'<meta name="viewport"$1/>\n<meta name="theme-color" content="#1D4ED8"/>\n<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Ccircle cx=%2232%22 cy=%2232%22 r=%2232%22 fill=%22%231D4ED8%22/%3E%3Cpath d=%22M35 10 18 36h12l-4 18 18-28H32z%22 fill=%22%23FACC15%22/%3E%3C/svg%3E"/>');
pon("mapa", /title="Mapa de situación de la oficina"/, 'title="Mapa: CVS Elektrikoak, Esteban Lasa 9, Beasain"');
pon("pie: enlaces vacíos", /<p><a href="#">Aviso legal<\/a>[^<]*<a href="#">[^<]*<\/a>(?: · <a href="#">[^<]*<\/a>)*<\/p>/,
'<p><a href="mailto:cvs.instalaciones.electricas@gmail.com">cvs.instalaciones.electricas@gmail.com</a></p>');
pon("aviso de la demo", /las fotos, los textos y los precios son de ejemplo y se sustituyen por los vuestros\./,
  "las fotos son de ejemplo; los servicios, los datos y las opiniones son los vuestros.");

/* ── 13 · estilos ── */
const CSS = `
/* servicios en tarjetas */
.srv{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));margin-top:clamp(22px,3vw,34px);}
.srv__i{background:var(--fondo);border:1px solid var(--filete);border-radius:20px;padding:22px 22px 20px;
  transition:transform .35s var(--ease),box-shadow .35s var(--ease),border-color .3s;}
.srv__i:hover{transform:translateY(-4px);border-color:var(--acento);box-shadow:0 22px 44px -32px rgba(29,78,216,.6);}
.srv__n{font-family:var(--detalle);font-size:12px;font-weight:700;letter-spacing:.14em;color:var(--acento);margin:0 0 10px;}
.srv__i h3{font-size:clamp(19px,2vw,22px);margin:0 0 8px;line-height:1.2;}
.srv__i p:last-child{margin:0;color:var(--tinta-sec);font-size:15.5px;line-height:1.5;}

/* urgencias */
.urg{display:grid;gap:clamp(24px,4vw,56px);align-items:center;}
@media(min-width:900px){.urg{grid-template-columns:1.1fr .9fr;}}
.urg__t h2{font-size:clamp(40px,6vw,84px);line-height:.98;margin:8px 0 18px;}
.urg__t .rotulo{color:var(--acento-claro);}
.urg__f{margin:0;border-radius:26px;overflow:hidden;aspect-ratio:3/2;}
.urg__f img{width:100%;height:100%;object-fit:cover;}
.btn--sol{background:var(--acento-claro);color:#111;border-color:var(--acento-claro);margin-top:8px;}
.btn--sol:hover{background:#FDE047;border-color:#FDE047;}

/* opiniones */
.dicen{padding:clamp(56px,9vw,120px) 0;background:var(--fondo-alt);}
.dicen__cab{margin-bottom:clamp(26px,4vw,44px);}
.dicen__g{display:grid;gap:18px;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));}
.dicho{margin:0;background:var(--fondo);border:1px solid var(--filete);border-radius:22px;padding:clamp(22px,2.6vw,30px);
  display:flex;flex-direction:column;gap:14px;}
.dicho__e{margin:0;color:#B45309;letter-spacing:.16em;font-size:13px;}
.dicho blockquote{margin:0;font-size:var(--t1);line-height:1.5;}
.dicho figcaption{font-family:var(--detalle);font-size:12.5px;color:var(--tinta);margin-top:auto;}
.dicho figcaption span{color:var(--tinta-sec);}
.dicen__pie a{color:var(--acento);font-family:var(--detalle);font-size:14px;font-weight:600;display:inline-flex;align-items:center;min-height:44px;margin-top:18px;}

/* botones en píldora y foco visible */
.btn{border-radius:100px;min-height:52px;}
.btn:active{transform:scale(.97);}
.hero__foto img,.mapa,.mapa iframe{border-radius:24px;}
a:focus-visible,button:focus-visible,input:focus-visible,textarea:focus-visible,.btn:focus-visible{outline:3px solid var(--acento);outline-offset:3px;}
.obras a:focus-visible{outline-color:var(--acento-claro);}

@media(max-width:719px){
  .hero__btns{flex-direction:column;} .hero__btns .btn,.cierre__btns .btn{width:100%;}
  .dicen__g{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:14px;margin:0 calc(var(--gutter) * -1);
    padding:4px var(--gutter) 16px;scrollbar-width:none;}
  .dicen__g::-webkit-scrollbar{display:none;}
  .dicho{flex:0 0 86%;scroll-snap-align:start;}
  .mapa,.mapa iframe{height:240px!important;min-height:0!important;}
}
`;
pon("estilos", /\n<\/style>\n<script>document\.documentElement\.className/, "\n" + CSS + "</style>\n<script>document.documentElement.className");

/* ── 13b · lo que salió al probarla ──────────────────────────────────────
   · El botón amarillo de urgencias heredaba el color claro que la sección
     oscura da a los botones: amarillo sobre amarillo, 1,44 de contraste.
   · Al quitar la galería, "urgencias" y "papeles" quedaban dos oscuras
     seguidas: la segunda oscura pasa a ser la banda de cifras.
   · Para Google, un electricista no es un "contratista general". */
pon("contraste del botón de urgencias", /\n<\/style>\n<script>document\.documentElement\.className/,
`
.obras .btn.btn--sol,.obras .btn.btn--sol .ar{color:#111!important;}
.obras .btn.btn--sol{background:var(--acento-claro)!important;border-color:var(--acento-claro)!important;}
</style>
<script>document.documentElement.className`);
pon("ritmo claro/oscuro", /window\.__RITMO__=\["obras","cert"\]/, 'window.__RITMO__=["obras","cifras"]');
pon("tipo para Google", /"@type":"GeneralContractor"/, '"@type":"Electrician"');

/* ── 14 · enlaces de teléfono nuevos ── */
pon("teléfonos del hero y urgencias", /<\/body>/, `<script>
(function(){
  var ref = document.querySelector('a[href^="tel:"]');
  var tel = ref ? ref.getAttribute("href") : "tel:+34613268212";
  ["h-tel","u-tel"].forEach(function(id){ var e = document.getElementById(id); if(e) e.href = tel; });
})();
</script>
</body>`);

/* ═══ 15 · salto de calidad (23/09), el mismo nivel que Alex Jatetxea ════ */

/* A · un icono por servicio: con solo números, nueve tarjetas iguales se
   leían como una lista, no como lo que hace un electricista */
const I = (d) => `<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const ICONOS = [
  I('<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>'),                       // boletín
  I('<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2M8.5 11l1.8 1.8 3.2-3.3"/>'),       // revisión
  I('<path d="M12 3v10M6 13h12M8 17h8M10 21h4"/>'),                                             // toma de tierra
  I('<path d="M4 20V9l8-5 8 5v11z"/><path d="M13 10l-3 4h4l-3 4"/>'),                           // reforma
  I('<path d="M14.5 5.5a4 4 0 0 0-5 5L4 16l4 4 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-2.5-.5-.5-2.5z"/>'), // reparación
  I('<rect x="6" y="3" width="12" height="18" rx="2.5"/><path d="M10 7h4M12 17h.01"/><path d="M9.5 12a3.5 3.5 0 0 1 5 0"/>'), // domótica
  I('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z"/>'),             // alumbrado
  I('<rect x="3" y="7" width="18" height="11" rx="2"/><path d="M7 7V5h10v2M12 10l-2 3h3l-2 3"/>'), // grupo electrógeno
  I('<path d="M6 21 9 3m9 18-3-18M4 8h16M5 13h14"/>'),                                           // líneas
];
ICONOS.forEach((svg, i) => {
  pon("icono del servicio " + (i + 1), new RegExp(`<p class="srv__n">${String(i + 1).padStart(2, "0")}</p>`),
    `<p class="srv__n"><span class="srv__ico">${svg}</span>${String(i + 1).padStart(2, "0")}</p>`);
});

/* B · cinta de servicios en movimiento, entre el hero y los servicios */
const CINTA = ["Boletines (CIE)", "Revisiones periódicas", "Tomas de tierra", "Urgencias 24 h", "Reformas de instalación",
  "Averías", "Domótica", "Rótulos y alumbrado", "Grupos electrógenos"];
const tira = CINTA.map((p) => `<span>${p}</span><i aria-hidden="true">⚡</i>`).join("");
pon("cinta de servicios", /<section class="serv" id="servicios">/,
`<div class="cinta" aria-label="Servicios">
  <div class="cinta__pista"><div class="cinta__g">${tira}</div><div class="cinta__g" aria-hidden="true">${tira}</div></div>
</div>

<section class="serv" id="servicios">`);

/* C · el titular entra por líneas, y la foto con una cortina */
pon("titular por líneas", /<h1 class="rev" data-d="1">La luz de tu casa,<br\/><em>en regla<\/em> y a tiempo<\/h1>/,
  '<h1 class="hero__h"><span class="l"><span>La luz de tu casa,</span></span><span class="l"><span><em>en regla</em> y a tiempo</span></span></h1>');

/* D · cierre con el teléfono en grande: es lo que busca quien tiene una avería */
pon("teléfono grande en el cierre", /(<h2 class="rev" data-d="1">Cuéntanos qué<br\/>necesitas<\/h2>)/,
  '$1\n    <a class="gran-tel rev" data-d="2" id="gran-tel" href="#"><span>613</span> <span>26 82 12</span></a>');

/* E · pantalla de carga con un rayo */
pon("pantalla de carga", /<body([^>]*)>/,
`<body$1>
<div class="carga" id="carga" aria-hidden="true">
  <div class="carga__halo"></div>
  <svg class="carga__rayo" viewBox="0 0 24 24" width="54" height="54"><path d="M13.5 2 4 14h7l-1.5 8L20 10h-7z" fill="#FACC15"/></svg>
  <p class="carga__marca">CVS <em>Elektrikoak</em></p>
  <div class="carga__linea"><i></i></div>
  <p class="carga__pie">Beasain · Electricista autorizado</p>
</div>
<script>
(function(){
  var c = document.getElementById("carga"), visto = false;
  try { visto = sessionStorage.getItem("cvs-visto") === "1"; } catch(e){}
  if(visto || matchMedia("(prefers-reduced-motion: reduce)").matches){ c.remove(); return; }
  document.documentElement.style.overflow = "hidden";
  function fuera(){
    if(!c.isConnected) return;
    try { sessionStorage.setItem("cvs-visto","1"); } catch(e){}
    c.classList.add("fuera"); document.documentElement.style.overflow = "";
    setTimeout(function(){ c.remove(); }, 1100);
  }
  setTimeout(fuera, 2000); setTimeout(fuera, 3800);
})();
</script>`);

const CSS2 = `
/* ═══ SERVICIOS CON ICONO ═══ */
.srv__n{display:flex;align-items:center;gap:12px;}
.srv__ico{display:grid;place-content:center;width:46px;height:46px;border-radius:14px;color:var(--acento);
  background:color-mix(in srgb, var(--acento) 9%, var(--fondo));transition:background .3s,color .3s,transform .4s cubic-bezier(.34,1.5,.64,1);}
.srv__i:hover .srv__ico{background:var(--acento);color:#fff;transform:rotate(-6deg) scale(1.06);}

/* ═══ CINTA ═══ */
.cinta{overflow:hidden;background:var(--osc);color:var(--osc-tinta);padding:18px 0;margin-top:clamp(40px,6vw,72px);}
.cinta__pista{display:flex;width:max-content;animation:cinta 38s linear infinite;}
.cinta:hover .cinta__pista{animation-play-state:paused;}
.cinta__g{display:flex;align-items:center;gap:26px;padding-right:26px;}
.cinta span{font-family:var(--display);font-size:clamp(20px,2.4vw,30px);white-space:nowrap;line-height:1;}
.cinta i{font-style:normal;font-size:15px;}
@keyframes cinta{to{transform:translateX(-50%);}}

/* ═══ HERO ═══ */
.hero__h{font-size:clamp(40px,7.4vw,92px);margin:18px 0 0;line-height:1;}
.hero__h em{font-style:normal;color:var(--acento);}
.hero__h .l{display:block;overflow:hidden;padding-bottom:.06em;}
.hero__h .l>span{display:inline-block;transform:translateY(105%);transition:transform 1s cubic-bezier(.22,1,.36,1);}
.hero.vivo .hero__h .l>span{transform:none;}
.hero.vivo .hero__h .l+.l>span{transition-delay:.12s;}
html:not(.js) .hero__h .l>span{transform:none;}
.hero__foto{clip-path:inset(12% 6% 12% 6% round 24px);transition:clip-path 1.4s cubic-bezier(.22,1,.36,1) .25s;}
.hero.vivo .hero__foto{clip-path:inset(0 0 0 0 round 24px);}
html:not(.js) .hero__foto{clip-path:none;}
.hero::before{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;opacity:.3;
  background-image:radial-gradient(circle at 85% 10%, rgba(250,204,21,.18), transparent 40%),radial-gradient(circle at 10% 90%, rgba(29,78,216,.10), transparent 45%);}
.hero{position:relative;isolation:isolate;}

/* ═══ TELÉFONO GRANDE ═══ */
.gran-tel{display:inline-flex;gap:.25em;margin:12px 0 18px;font-family:var(--display);line-height:1;
  font-size:clamp(46px,7vw,92px);color:inherit;text-decoration:none;}
.gran-tel span:first-child{color:var(--acento-claro);}
.gran-tel:hover span:last-child{text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:.12em;}

/* ═══ BOTONES MAGNÉTICOS ═══ */
.btn--mag{transition:transform .35s cubic-bezier(.22,1,.36,1),box-shadow .35s;}

/* ═══ PANTALLA DE CARGA ═══ */
.carga{position:fixed;inset:0;z-index:200;display:flex;flex-direction:column;align-items:center;justify-content:center;
  background:var(--osc);overflow:hidden;clip-path:inset(0 0 0 0);transition:clip-path 1.05s cubic-bezier(.87,0,.13,1);}
.carga.fuera{clip-path:inset(0 0 100% 0);}
.carga__halo{position:absolute;width:min(78vw,420px);aspect-ratio:1;border-radius:50%;
  background:radial-gradient(circle, rgba(250,204,21,.35) 0%, rgba(250,204,21,0) 66%);opacity:0;
  animation:halo-in .9s ease-out forwards, halo 2.4s ease-in-out infinite;}
@keyframes halo-in{to{opacity:.9;}}
@keyframes halo{0%,100%{transform:scale(.9);}50%{transform:scale(1.08);}}
.carga__rayo{position:relative;opacity:0;transform:scale(.4) rotate(-20deg);animation:rayo .7s cubic-bezier(.34,1.56,.64,1) .1s forwards;}
@keyframes rayo{to{opacity:1;transform:none;}}
.carga__marca{position:relative;font-family:var(--display);color:var(--osc-tinta);font-size:clamp(46px,10vw,88px);line-height:1;
  margin:14px 0 0;opacity:0;transform:translateY(22px);animation:marca 1s cubic-bezier(.22,1,.36,1) .2s forwards;}
.carga__marca em{font-style:normal;color:var(--acento-claro);}
@keyframes marca{to{opacity:1;transform:none;}}
.carga__linea{position:relative;width:160px;height:1px;margin-top:30px;overflow:hidden;background:rgba(255,255,255,.2);opacity:0;animation:aparece .8s .5s forwards;}
.carga__linea i{position:absolute;inset:0;background:var(--acento-claro);transform-origin:left;transform:scaleX(0);animation:llena 1.5s .1s cubic-bezier(.4,0,.2,1) forwards;}
@keyframes llena{to{transform:scaleX(1);}}
.carga__pie{position:relative;margin:16px 0 0;font-family:var(--detalle);font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--osc-tinta3);opacity:0;animation:aparece .8s .7s forwards;}
@keyframes aparece{to{opacity:1;}}

@media (prefers-reduced-motion: reduce){
  .carga{display:none!important;} .cinta__pista{animation:none;}
  .hero__h .l>span{transform:none!important;transition:none!important;} .hero__foto{clip-path:none!important;transition:none!important;}
}
`;
pon("estilos del salto de calidad", /\n<\/style>\n<script>document\.documentElement\.className/,
  "\n" + CSS2 + "</style>\n<script>document.documentElement.className");

pon("guion del salto de calidad", /<\/body>/, `<script>
(function(){
  var ref = document.querySelector('a[href^="tel:"]'), gt = document.getElementById("gran-tel");
  if(ref && gt) gt.href = ref.getAttribute("href");
  var h = document.querySelector(".hero");
  if(h) setTimeout(function(){ h.classList.add("vivo"); }, document.getElementById("carga") ? 2150 : 80);
  if(matchMedia("(prefers-reduced-motion: reduce)").matches || !matchMedia("(hover: hover) and (min-width: 900px)").matches) return;
  document.querySelectorAll(".hero .btn, .cierre .btn, .obras .btn").forEach(function(b){
    b.classList.add("btn--mag");
    b.addEventListener("pointermove", function(e){
      var r = b.getBoundingClientRect();
      b.style.transform = "translate(" + ((e.clientX - r.left - r.width/2) * .18).toFixed(1) + "px," + ((e.clientY - r.top - r.height/2) * .28).toFixed(1) + "px)";
    });
    b.addEventListener("pointerleave", function(){ b.style.transform = ""; });
  });
})();
</script>
</body>`);

fs.writeFileSync(F, s);
console.log("ajustado (" + antes + " → " + s.length + " caracteres)");
hecho.forEach((h) => console.log("  · " + h));
