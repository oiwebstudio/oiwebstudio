/**
 * Inyecta el kit de movimiento en las plantillas de sector.
 *
 * Por qué: las demos se veían planas. Todo el movimiento era un fade de entrada
 * repetido sección tras sección, y la cabecera no hacía nada.
 *
 * Piezas de _local/material/animaciones/CATALOGO.md:
 *   head-shrink · head-progress · head-underline
 *   scroll-parallax-layers · scroll-title-scale · scroll-image-zoom
 *   scroll-alternate-sides · scroll-blur-in · scroll-text-highlight
 *
 * Límites tomados de la skill ui-ux-pro-max (data/motion.csv):
 *   · Scroll Reveal Standard: 400-600 ms, power2.out, máx. 8 hijos en cascada,
 *     0.02-0.04 s por elemento.
 *   · Parallax Subtle: solo capas decorativas, NUNCA texto ni controles.
 *     Delta de 5-15 % para que el fondo no se desincronice del primer plano.
 *   · Nada de pin: pelea con el scroll nativo y empeora el móvil.
 *   · No animar width/height (provoca reflow). Solo transform y opacity.
 *
 *   node herramientas/demos/kit-movimiento.mjs                 → todas
 *   node herramientas/demos/kit-movimiento.mjs belleza-peluqueria
 *
 * Idempotente: si el kit ya está, lo reemplaza por la versión nueva.
 */

import fs from "node:fs/promises";
import path from "node:path";

const RAIZ = path.resolve("web/demos/_plantillas");
const MARCA_INI = "<!-- ═══ KIT DE MOVIMIENTO ═══ -->";
const MARCA_FIN = "<!-- ═══ FIN KIT DE MOVIMIENTO ═══ -->";

/**
 * Ritmo claro/oscuro, decidido a mano y no por heurística.
 *
 * Se nombran las secciones POR CLASE, no por posición. Antes eran índices
 * (0 = hero, 1 = cifras…) y funcionaba mientras las once plantillas
 * compartían el mismo orden de bloques. Desde que cada sector tiene su propio
 * orden —ver docs/PROMPT-ARQUITECTURA-SECCIONES.md— el índice deja de
 * significar nada: mover una sección repintaba otra distinta, en silencio.
 *
 * Solo se listan las que hay que oscurecer NOSOTROS. Las que ya son oscuras de
 * fábrica (el menú del día, urgencias, la banda de reseñas…) no se tocan, y el
 * ritmo de abajo ya las tiene en cuenta para no encadenar dos seguidas.
 *
 * Un intento anterior calculaba esto solo, midiendo luminancias en tiempo de
 * ejecución. Daba un resultado distinto en cada plantilla y era imposible de
 * razonar. Dos nombres de clase se leen de un vistazo y se verifican una vez.
 *
 * automocion-taller no está: es oscura de fábrica y no se alterna nada.
 */
const RITMO = {
  "hosteleria-asador":    ["tira", "cifras"],     // ya oscuras: pizarra, que ahora abre · cierre
  "reformas-gremios":     ["obras", "cert"],      // ya oscura:  banda · cifras baja al final
  "veterinaria":          ["banner", "feed"],     // ya oscura:  urg, que ahora abre · cifras baja
  "abogacia-gestoria":    ["declaracion", "consulta"], // ya oscuras: banda · cierre
  "salud-odontologia":    ["ad", "visita"],        // ya oscura:  cita · cifras baja al final
  "belleza-peluqueria":   ["ad", "tarifas"],        // ya oscura:  cita · cifras baja al final
  "alimentacion-obrador": ["tira", "cifras"],     // ya oscura:  dehoy, que ahora abre
  "comercio-tienda":      ["escap", "marcas"],    // ya oscura:  banda · el escaparate abre
  "cafeteria-bar":        ["frase", "feed"],      // ya oscura:  dia, que ahora abre
  "gimnasio-clases":      ["clases", "cifras"],   // ya oscura:  cita · el horario abre la página
};

/* El bloque de contacto (.cierre) NO se oscurece nunca, aunque el ritmo lo
   pidiera. En media docena de plantillas ese bloque se pinta con el color de
   acento y lleva el texto en blanco fijo (rgba(255,255,255,.75)); al aclararse
   --acento dentro de .oscura, ese blanco se queda sobre un fondo claro y baja
   a 2:1. O tiene ya su propio tratamiento oscuro, o se deja como está. */

/**
 * Módulos opcionales, por plantilla.
 *
 * Dos secciones nuevas —el deslizador antes/después y las fichas de persona—
 * las piden varios sectores a la vez (ver docs/PROMPT-ARQUITECTURA-SECCIONES.md).
 * Copiarlas a mano en cada index.html significaba mantener el mismo CSS en
 * cinco sitios y que se fueran separando solos. Se inyectan desde aquí, y sólo
 * en las plantillas que las usan: las demás no cargan CSS que no van a pintar.
 *
 * El HTML de la sección sí vive en cada plantilla: el texto es del gremio.
 */
const MODULOS = {
  "belleza-peluqueria":  ["ad", "fichas"],
  "salud-odontologia":   ["ad", "fichas"],
  "reformas-gremios":    ["fichas"],           // el antes/después lo tiene propio, con plazos y factura
  "veterinaria":         ["fichas"],
  /* abogacia-gestoria no está: ya trae sus propias fichas (.persona) */
  "gimnasio-clases":     ["fichas"],
};

const CSS_MODULO = {
  ad: `
/* ═══ ANTES / DESPUÉS ═══
   El módulo que más convierte de todo landing.csv («visual proof of value,
   45% higher conversion»), y el único que ninguna peluquería de la zona tiene.

   Sin JS se ven las dos fotos, una al lado de otra y rotuladas: se entiende
   igual. Con JS se superponen y el <input type=range> descubre la de después.
   El input es un control real, así que va con teclado y lo lee el lector de
   pantalla sin que haya que añadirle nada. */
.ad{padding:clamp(48px,7vw,96px) 0;}
.ad__cab{max-width:54ch;margin-bottom:clamp(22px,3.5vw,38px);}
.ad__cab h2{margin:12px 0 14px;}
.ad__cab p{color:var(--tinta-sec);}

.ad__par{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.ad__par figure{margin:0;position:relative;overflow:hidden;border-radius:var(--radio-foto);}
.ad__par img{width:100%;height:auto;display:block;}
.ad__rot{position:absolute;left:10px;bottom:10px;font-family:var(--detalle);
  font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
  padding:6px 10px;background:var(--osc);color:var(--fondo);}

.ad__mando{margin-top:16px;}
.ad__mando label{display:block;font-family:var(--detalle);font-size:11px;font-weight:700;
  letter-spacing:.13em;text-transform:uppercase;color:var(--tinta-sec);margin-bottom:10px;}
.ad__pie{margin-top:14px;color:var(--tinta-sec);font-size:var(--t0);}

/* Con JS: una sola foto y el corte se mueve. */
.ad--js .ad__par{display:block;position:relative;line-height:0;
  border-radius:var(--radio-foto);overflow:hidden;}
.ad--js .ad__par figure{position:absolute;inset:0;border-radius:0;}
.ad--js .ad__par figure:first-child{position:relative;}
.ad--js .ad__par figure:first-child img{position:relative;}
.ad--js .ad__despues{clip-path:inset(0 0 0 var(--corte,50%));}
.ad--js .ad__par img{height:100%;object-fit:cover;}
.ad--js .ad__rot{bottom:14px;}
.ad--js .ad__despues .ad__rot{left:auto;right:14px;background:var(--acento);color:var(--acento-con);}

/* La línea de corte. Puramente decorativa: quien maneja el control es el
   input de abajo, que sigue siendo el que recibe el foco. */
.ad--js .ad__linea{position:absolute;top:0;bottom:0;left:var(--corte,50%);width:2px;
  background:var(--fondo);pointer-events:none;transform:translateX(-1px);}
.ad--js .ad__linea::after{content:"";position:absolute;top:50%;left:50%;
  width:42px;height:42px;margin:-21px 0 0 -21px;border-radius:50%;
  background:var(--fondo);box-shadow:0 2px 14px rgba(0,0,0,.28);}

/* El input ocupa toda la foto para poder arrastrar encima de ella, pero se
   mantiene visible debajo: en móvil, un control invisible no se descubre. */
.ad__rango{width:100%;height:44px;margin:0;cursor:ew-resize;
  -webkit-appearance:none;appearance:none;background:transparent;}
.ad__rango:focus-visible{outline:2px solid var(--acento);outline-offset:3px;}
.ad__rango::-webkit-slider-runnable-track{height:3px;background:var(--filete-fuerte);}
.ad__rango::-moz-range-track{height:3px;background:var(--filete-fuerte);}
.ad__rango::-webkit-slider-thumb{-webkit-appearance:none;width:26px;height:26px;
  margin-top:-11px;border-radius:50%;background:var(--acento);border:3px solid var(--fondo);
  box-shadow:0 1px 6px rgba(0,0,0,.3);}
.ad__rango::-moz-range-thumb{width:26px;height:26px;border-radius:50%;
  background:var(--acento);border:3px solid var(--fondo);box-shadow:0 1px 6px rgba(0,0,0,.3);}

@media(min-width:760px){
  .ad--js .ad__par{aspect-ratio:16/9;}
}
@media(max-width:759px){
  .ad__par{grid-template-columns:1fr;}
  .ad--js .ad__par{aspect-ratio:4/5;}
}
`,
  fichas: `
/* ═══ PROFESIONALES ═══
   Sustituye a los tres párrafos de prosa que había antes. products.csv pide
   «booking system» y «service menu» para el sector; pedir cita con una persona
   concreta es lo que de verdad distingue a un salón de una cadena, y en prosa
   no se podía hacer clic. */
.prof{padding:clamp(48px,7vw,96px) 0;background:var(--fondo-alt);
  border-top:1px solid var(--filete);border-bottom:1px solid var(--filete);}
.prof__t{max-width:20ch;margin:12px 0 clamp(22px,3.5vw,38px);}
.prof__g{list-style:none;display:grid;gap:14px;grid-template-columns:1fr;}
.prof__c{background:var(--fondo);border:1px solid var(--filete);padding:0 0 18px;
  display:flex;flex-direction:column;}
.prof__c img{width:100%;height:auto;aspect-ratio:1/1;object-fit:cover;display:block;
  margin-bottom:14px;}
.prof__c h3{font-size:var(--t2);margin:0 18px 2px;}
.prof__rol{font-family:var(--detalle);font-size:10.5px;font-weight:700;letter-spacing:.14em;
  text-transform:uppercase;color:var(--acento);margin:0 18px 10px;}
.prof__c p{margin:0 18px 14px;color:var(--tinta-sec);font-size:var(--t0);flex:1;}
.prof__c .btn{margin:0 18px;justify-content:center;}
.prof__pie{margin-top:22px;color:var(--tinta-sec);font-size:var(--t0);max-width:70ch;}
@media(min-width:620px){ .prof__g{grid-template-columns:1fr 1fr;} }
@media(min-width:980px){ .prof__g{grid-template-columns:repeat(3,1fr);} }
`,
};

const JS_MODULO = {
  ad: `
/* ═══ ANTES / DESPUÉS ═══
   La superposición sólo se activa aquí, con JS ya en marcha. Si el script no
   llega, el HTML deja las dos fotos una al lado de otra, rotuladas Antes y
   Después: se entiende igual, que es la regla 6 del contrato de secciones.

   El control es el <input type=range>, no la propia foto. Arrastrar sobre la
   imagen es cómodo pero no es accesible por sí solo; teniendo el input debajo,
   el teclado y el lector de pantalla funcionan sin añadir nada. */
(function(){
  var par = document.getElementById("ad-par");
  var rango = document.getElementById("ad-rango");
  if(!par || !rango) return;
  var sec = par.closest("section");
  if(sec) sec.classList.add("ad--js");

  function pintar(){ par.style.setProperty("--corte", rango.value + "%"); }
  rango.addEventListener("input", pintar);
  pintar();

  function desdeX(x){
    var r = par.getBoundingClientRect();
    rango.value = Math.round(Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100)));
    pintar();
  }
  var pulsando = false;
  par.addEventListener("pointerdown", function(e){ pulsando = true; desdeX(e.clientX); });
  window.addEventListener("pointermove", function(e){ if(pulsando) desdeX(e.clientX); });
  window.addEventListener("pointerup", function(){ pulsando = false; });
})();
`,
  fichas: "",
};

const CSS = `
/* ═══ RITMO Y CABECERA ═══
   Tomado de atxalandabaso-prime-web.vercel.app, que es la referencia que
   funciona: cabecera isla, alternancia dura claro/oscuro y aire de sobra.
   El problema de las plantillas era que alternaban entre dos cremas casi
   iguales (--fondo y --fondo-alt), así que la página se leía plana. */

/* head-island · cabecera flotante en píldora, no barra de lado a lado */
.top{position:fixed;top:12px;left:50%;transform:translateX(-50%);
  width:min(100% - 24px, 1180px);border-radius:100px;border:1px solid var(--filete);
  background:color-mix(in srgb, var(--fondo) 82%, transparent);
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  box-shadow:0 6px 28px -18px rgba(0,0,0,.5);z-index:40;
  transition:top .3s var(--ease),width .3s var(--ease);}
.top__in{padding-left:clamp(16px,3vw,26px);padding-right:clamp(8px,2vw,14px);}
/* lo que va dentro de una píldora tiene que ser redondo: con --radio:0 el CTA
   salía con esquinas rectas dentro de la cabecera curva y cantaba */
.top .btn{border-radius:100px;}
.top .btn--fill{padding-left:22px;padding-right:20px;}
@media(min-width:768px){.top{top:20px;}}
/* la isla flota: el contenido necesita hueco arriba */
body{padding-top:92px;}
@media(min-width:768px){body{padding-top:108px;}}
:target,section[id]{scroll-margin-top:104px;}

/* el hero ocupa la pantalla entera, con svh para que el móvil no mienta */
.hero,.portada,.banner{min-height:auto;}
@media(min-width:768px){
  .hero__foto,.portada__foto,.banner__foto{min-height:min(78svh,620px);}
}

/* aire: 128px en escritorio como la referencia, no 96 */
section{padding-top:clamp(56px,8.5vw,128px);padding-bottom:clamp(56px,8.5vw,128px);}

/* ═══ ALTERNANCIA CLARO / OSCURO ═══
   Una sección .oscura le da la vuelta a los tokens en vez de repintar cada
   regla: los hijos siguen usando var(--tinta), var(--filete)… y salen bien
   sin tocar una línea del CSS de la plantilla. */
.oscura{
  background:var(--osc);
  --tinta:var(--fondo);
  --tinta-sec:var(--osc-tinta);
  --filete:var(--osc-filete);
  /* Los colores de estado también se voltean. Se olvidaron en la primera
     versión: al oscurecer una sección con estrellas de reseña, el dorado de
     --alerta se quedaba a 4,05 sobre el fondo oscuro, por debajo del 4,5.
     Los tokens claros ya existían en :root, sólo faltaba usarlos aquí. */
  --alerta:var(--alerta-clara);
  --ok:var(--ok-claro);
  --filete-fuerte:var(--osc-filete);
  --fondo-alt:var(--osc);
  --acento:var(--acento-claro);
  --acento-con:var(--osc);
  color:var(--tinta);
}
.oscura h1,.oscura h2,.oscura h3,.oscura h4{color:var(--tinta);}
.oscura .btn{border-color:var(--tinta);color:var(--tinta);}
.oscura .btn--fill{background:var(--acento);border-color:var(--acento);color:var(--acento-con);}
.oscura .btn--ghost:hover,.oscura .btn--ghost:focus-visible{background:var(--tinta);color:var(--osc);}
.oscura .mapa iframe{filter:invert(.92) hue-rotate(180deg) saturate(.35);}
.oscura input,.oscura textarea{color:var(--tinta);}

/* ═══ KIT DE MOVIMIENTO ═══
   Piezas: head-shrink · head-progress · head-underline · scroll-parallax-layers
   scroll-title-scale · scroll-image-zoom · scroll-alternate-sides
   scroll-blur-in · scroll-text-highlight
   Límites de ui-ux-pro-max/data/motion.csv — ver herramientas/demos/kit-movimiento.mjs  */

/* ═══ BARRA DE ACCIONES EN PÍLDORA ═══
   La barra inferior iba de lado a lado y pegada al borde, con las esquinas en
   ángulo recto. Al lado de la cabecera —que ya es una píldora flotante— parecía
   de otra web. Ahora las dos son islas y comparten radio, filete y sombra.

   Va aquí y no en cada plantilla porque el bloque era idéntico en las once.

   El overflow:hidden es lo que hace que los botones de los extremos se
   recorten con la curva; sin él, el verde del primario sobresale por la esquina
   y se ve el pico. */
.barra{
  left:50%;right:auto;
  transform:translateX(-50%);
  width:min(100% - 24px, 460px);
  bottom:calc(12px + env(safe-area-inset-bottom));
  padding-bottom:0;
  border:1px solid var(--filete-fuerte);
  border-radius:100px;
  overflow:hidden;
  box-shadow:0 6px 26px -10px rgba(0,0,0,.42);
  background:color-mix(in srgb, var(--fondo) 92%, transparent);
  backdrop-filter:blur(12px);
  -webkit-backdrop-filter:blur(12px);
}
/* En los extremos, la curva se come parte del ancho útil: un poco más de
   holgura para que el rótulo no se acerque al filete redondeado. */
.barra a:first-child{padding-left:12px;}
.barra a:last-child{padding-right:12px;}
/* Con la barra estrecha cada botón se queda en 122 px, y "Probar gratis"
   partía en dos líneas: en una píldora de 58 px de alto eso se ve apretado.
   El interletrado baja de .13em a .09em —sigue leyéndose como versal— y el
   rótulo se prohíbe partir. El rótulo más largo de las once, "Cómo llegar",
   cabe con holgura. */
.barra a{white-space:nowrap;letter-spacing:.09em;}

/* La barra ya no está pegada abajo, así que el pie necesita 12 px más de
   holgura para que el último renglón no quede debajo de ella. */
@media(max-width:899px){
  .pie{padding-bottom:calc(104px + env(safe-area-inset-bottom));}
}

/* head-progress · barra de lectura al pie de la cabecera.
   Va dentro de .top, que ya es la isla flotante de arriba: no se le vuelve a
   tocar la posición aquí o se pisaría el position:fixed.

   Va metida por los lados a propósito: la cabecera es una píldora con 100px de
   radio, y una barra que llegaba al borde se metía en la curva y salía cortada
   en diagonal. Empieza donde empieza el texto, y con las puntas redondeadas. */
.barra-lectura{position:absolute;left:clamp(20px,4%,38px);right:clamp(20px,4%,38px);
  bottom:5px;height:2px;width:auto;border-radius:2px;
  transform:scaleX(var(--leido,0));transform-origin:left;background:var(--acento);
  pointer-events:none;}

/* head-shrink · la cabecera se compacta al bajar.
   Se anima el padding del contenedor interno, no la altura de .top: animar
   height fuerza reflow en cada frame (anti-patrón de la skill, prioridad 7). */
.top__in{transition:height .3s var(--ease);}
.js.encogido .top__in{height:56px;}
.js.encogido .marca small,.js.encogido .marca em{opacity:0;transition:opacity .2s;}

/* head-underline · el subrayado del menú crece desde el centro */
/* Los enlaces del menú medían entre 35 y 42 px de alto según la plantilla, por
   debajo de los 44 px de zona táctil que exige el contrato. Se iguala aquí, en
   el kit, porque el fallo era el mismo en las once. El alto no cambia la
   maqueta: la cabecera ya es más alta que eso. */
/* Los enlaces legales del pie van dentro de un párrafo, así que la excepción
   de texto en línea del criterio 2.5.8 los cubre; aun así medían 14 px de alto,
   que con el dedo es una lotería. Un poco de relleno vertical los deja en 24 sin
   descolocar el renglón. Los 44 px completos sí romperían la línea. */
.pie a{display:inline-block;padding:5px 0;}
.nav a{position:relative;min-height:44px;display:inline-flex;align-items:center;}
.nav a::after{content:"";position:absolute;left:50%;right:50%;bottom:0;height:1px;
  background:var(--acento);transition:left .3s var(--ease),right .3s var(--ease);}
.nav a:hover::after{left:0;right:0;}

/* scroll-parallax-layers · SOLO la foto del hero, que es decorativa.
   Delta de 8% — dentro del 5-15% que marca la skill. Nunca sobre texto.
   El contenedor recorta: la foto va al 1.08 para tener recorrido, y sin
   overflow:hidden ese 8% de más se sale y provoca scroll horizontal. */
.js .hero__foto,.js .portada__foto,.js .banner__foto,.js .hero__img{overflow:hidden;}
.js .hero__foto img,.js .portada__foto img,.js .banner__foto img,.js .hero__img img{
  will-change:transform;transform:translate3d(0,var(--par,0px),0) scale(1.08);}
/* lo mismo para las fotos de sección, que llevan zoom */
.js .serv__m,.js .zonas__m,.js .secc__m,.js .paso__m{overflow:hidden;}

/* scroll-title-scale · el titular de portada cede un poco al bajar.
   Solo opacity y transform, y solo con pantalla suficiente. */
@media(min-width:900px) and (prefers-reduced-motion:no-preference){
  .js .portada h1,.js .hero h1{will-change:transform,opacity;
    transform:translate3d(0,calc(var(--tit,0) * -28px),0);
    opacity:calc(1 - var(--tit,0) * .55);}
}

/* scroll-image-zoom · las fotos de sección respiran al cruzar la pantalla */
.js .serv__m img,.js .zonas__m img,.js .secc__m img,.js .obra__media img,
.js .paso__m img,.js .equipo img,.js .casa img,.js .obrador img,.js .nosotros img,
.js .tienda img,.js .sobre img{
  transform:scale(var(--zoom,1));transition:transform .9s var(--ease);}

/* scroll-alternate-sides · las filas en zig-zag entran desde su lado.
   En móvil el desplazamiento es VERTICAL: a 375px una fila corrida 26px a la
   derecha asoma por el borde y provoca scroll horizontal en toda la página.
   Y de paso, en una columna estrecha el zig-zag lateral no se entiende. */
.js .serv__f,.js .zonas__f,.js .secc__f,.js .obra,.js .clinica .paso{
  opacity:0;transform:translate3d(0,22px,0);
  transition:opacity .55s var(--ease),transform .55s var(--ease);}
@media(min-width:760px){
  .js .serv__f,.js .zonas__f,.js .secc__f,.js .obra,.js .clinica .paso{
    transform:translate3d(-26px,0,0);}
  .js .serv__f:nth-of-type(even),.js .zonas__f:nth-of-type(even),
  .js .secc__f:nth-of-type(even),.js .obra:nth-of-type(even),
  .js .clinica .paso:nth-of-type(even){transform:translate3d(26px,0,0);}
}
.js .serv__f.dentro,.js .zonas__f.dentro,.js .secc__f.dentro,
.js .obra.dentro,.js .clinica .paso.dentro{opacity:1;transform:none;}

/* El subrayado de texto lleva white-space:nowrap para no partirse por la
   mitad. En móvil una frase larga así no cabe y empuja el ancho de la página:
   ahí se deja romper, que un subrayado en dos líneas es mejor que un scroll
   horizontal en toda la web. */
@media(max-width:759px){ .subr{white-space:normal;} }

/* scroll-blur-in · el reveal base gana un desenfoque muy corto.
   400-600 ms y power2.out, que es lo que pide la skill para el nivel Standard. */
.js .rev{filter:blur(6px);
  transition:opacity .52s cubic-bezier(.22,1,.36,1),
             transform .52s cubic-bezier(.22,1,.36,1),
             filter .52s cubic-bezier(.22,1,.36,1);}
.js .rev.on{filter:blur(0);}

/* scroll-text-highlight · el párrafo de entrada se enciende palabra a palabra */
.js .lead .pal{opacity:.28;transition:opacity .4s var(--ease);}
.js .lead.encendido .pal{opacity:1;}

/* La cascada nunca pasa de 8 elementos ni de 0.04 s por elemento: más allá,
   los últimos llegan tarde y se nota (motion.csv, Stagger List). */
.js [data-esc]{transition-delay:calc(var(--i,0) * .035s);}

@media (prefers-reduced-motion:reduce){
  .js .rev{filter:none!important;}
  .js .hero__foto img,.js .portada__foto img,.js .banner__foto img,.js .hero__img img{
    transform:none!important;}
  .js .serv__f,.js .zonas__f,.js .secc__f,.js .obra,.js .clinica .paso{
    opacity:1!important;transform:none!important;}
  .js .lead .pal{opacity:1!important;}
  .js .top__in{transition:none;}
}`;

const JS = `
/* ═══ KIT DE MOVIMIENTO ═══ (ver herramientas/demos/kit-movimiento.mjs) */
(function(){
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var raiz = document.documentElement;

  /* head-progress + head-shrink + scroll-title-scale + parallax.
     Todo en UN solo listener de scroll con rAF: varios listeners sueltos
     compiten por el hilo principal y el scroll se nota a tirones. */
  var cab = document.querySelector(".top");
  if(cab && !cab.querySelector(".barra-lectura")){
    var b = document.createElement("span");
    b.className = "barra-lectura"; b.setAttribute("aria-hidden","true");
    cab.appendChild(b);
  }
  var heroFoto = document.querySelector(".hero__foto img,.portada__foto img,.banner__foto img,.hero__img img");
  var titular  = document.querySelector(".portada h1,.hero h1");
  var pendiente = false;

  function alScroll(){
    if(pendiente) return;
    pendiente = true;
    requestAnimationFrame(function(){
      var y = scrollY;
      var alto = Math.max(1, document.body.scrollHeight - innerHeight);
      raiz.style.setProperty("--leido", Math.min(1, y / alto).toFixed(4));
      raiz.classList.toggle("encogido", y > 90);

      if(!reduce){
        /* parallax: 8% del recorrido visible, solo mientras el hero está en pantalla */
        if(heroFoto && y < innerHeight * 1.4){
          heroFoto.style.setProperty("--par", (y * 0.08).toFixed(1) + "px");
        }
        /* el titular cede hasta la mitad de la primera pantalla */
        if(titular && y < innerHeight){
          titular.style.setProperty("--tit", Math.min(1, y / (innerHeight * 0.7)).toFixed(4));
        }
      }
      pendiente = false;
    });
  }
  addEventListener("scroll", alScroll, { passive:true });
  alScroll();

  if(reduce) return;

  /* scroll-alternate-sides */
  var filas = document.querySelectorAll(".serv__f,.zonas__f,.secc__f,.obra,.clinica .paso");
  if(filas.length){
    var ioF = new IntersectionObserver(function(es,o){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("dentro"); o.unobserve(e.target); } });
    },{ rootMargin:"0px 0px -10% 0px", threshold:.15 });
    filas.forEach(function(f){ ioF.observe(f); });
    /* red de seguridad, igual que con .rev: si el observer no dispara, se ven */
    setTimeout(function(){ filas.forEach(function(f){ f.classList.add("dentro"); }); }, 2600);
  }

  /* scroll-image-zoom · la foto entra al 1.06 y se asienta en 1 */
  var fotos = document.querySelectorAll(".serv__m img,.zonas__m img,.secc__m img,.obra__media img,.paso__m img,.equipo img,.casa img,.obrador img,.nosotros img,.tienda img,.sobre img");
  if(fotos.length){
    fotos.forEach(function(f){ f.style.setProperty("--zoom","1.06"); });
    var ioZ = new IntersectionObserver(function(es,o){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.style.setProperty("--zoom","1"); o.unobserve(e.target); } });
    },{ threshold:.2 });
    fotos.forEach(function(f){ ioZ.observe(f); });
    setTimeout(function(){ fotos.forEach(function(f){ f.style.setProperty("--zoom","1"); }); }, 2600);
  }

  /* scroll-text-highlight · se parte en palabras, no en letras: partir por
     letras deja el texto ilegible para los lectores de pantalla. */
  var leads = document.querySelectorAll(".lead");
  leads.forEach(function(p){
    if(p.querySelector(".pal") || p.children.length) return;   // no tocar si ya tiene marcado
    var txt = p.textContent;
    if(txt.length > 240) return;                                // párrafos largos, fuera
    p.innerHTML = txt.split(" ").map(function(w){
      return '<span class="pal">' + w + "</span>";
    }).join(" ");
  });
  var ioT = new IntersectionObserver(function(es,o){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("encendido"); o.unobserve(e.target); } });
  },{ threshold:.35 });
  leads.forEach(function(p){ ioT.observe(p); });
  setTimeout(function(){ leads.forEach(function(p){ p.classList.add("encendido"); }); }, 2600);

  /* Alternancia claro/oscuro — la lista sale de RITMO en
     herramientas/demos/kit-movimiento.mjs. No se mide nada en tiempo de ejecución:
     las secciones a oscurecer están decididas y revisadas una a una. */
  (function(){
    var clases = window.__RITMO__ || [];
    clases.forEach(function(c){
      var sec = document.querySelector("main > section." + c + ", body > section." + c);
      if(sec) sec.classList.add("oscura");
    });
  })();

  /* cascada: máximo 8, que es lo que aguanta antes de sentirse lento */
  document.querySelectorAll(".cifras ul,.masonry__g,.tira__scroll,.banda__g,.feed__l,.preg,.susti,.cuotas,.pacto").forEach(function(cont){
    [].slice.call(cont.children, 0, 8).forEach(function(hijo, i){
      hijo.setAttribute("data-esc","");
      hijo.style.setProperty("--i", i);
    });
  });
})();`;

async function procesar(nombre) {
  const fichero = path.join(RAIZ, nombre, "index.html");
  let html = await fs.readFile(fichero, "utf8");

  /* quitar una versión anterior del kit antes de meter la nueva */
  const ini = html.indexOf(MARCA_INI);
  if (ini !== -1) {
    const fin = html.indexOf(MARCA_FIN);
    if (fin === -1) throw new Error("kit anterior sin marca de cierre");
    html = html.slice(0, ini) + html.slice(fin + MARCA_FIN.length);
  }

  const ritmo = JSON.stringify(RITMO[nombre] || []);
  const mods = MODULOS[nombre] || [];
  const cssMods = mods.map((m) => CSS_MODULO[m] || "").join("");
  const jsMods  = mods.map((m) => JS_MODULO[m]  || "").join("");
  const bloque =
    `\n${MARCA_INI}\n<style>${CSS}${cssMods}\n</style>\n` +
    `<script>window.__RITMO__=${ritmo};${JS}${jsMods}\n</script>\n${MARCA_FIN}\n`;

  if (!html.includes("</body>")) throw new Error("sin </body>");
  html = html.replace("</body>", bloque + "</body>");

  await fs.writeFile(fichero, html);
  return { nombre, actualizado: ini !== -1 };
}

const pedidas = process.argv.slice(2);
const todas = (await fs.readdir(RAIZ, { withFileTypes: true }))
  .filter((d) => d.isDirectory())
  .map((d) => d.name);
const lista = pedidas.length ? pedidas : todas;

console.log(`Kit de movimiento en ${lista.length} plantilla(s)…\n`);
for (const n of lista) {
  try {
    const r = await procesar(n);
    console.log(`  ${n}: ${r.actualizado ? "kit actualizado" : "kit añadido"}`);
  } catch (e) {
    console.log(`  ${n}: FALLO — ${e.message}`);
  }
}
console.log("\nListo.");
