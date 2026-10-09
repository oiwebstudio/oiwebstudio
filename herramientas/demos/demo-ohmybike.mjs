/**
 * Genera web/demos/clientes/oh-my-bike/index.html (muestra para Oh My Bike!, Donostibizi 2016 S.L.).
 * Referencia: tablero bicis n.º 18 (SAILING): bruma azul, palabra gigante blanca detrás de la bici, lista numerada con
 * miniaturas, «lista de razones» con foto inclinada, bici con rótulos de detalle, acordeón y cierre con teléfono.
 * Todos los textos, tarifas y precios son los de ombdonostia.com (octubre 2026). Fotos: su web y su tienda.
 *
 *   node herramientas/demos/demo-ohmybike.mjs
 */
import fs from "node:fs";
import sharp from "sharp";

const DIR = "web/demos/clientes/oh-my-bike/";
const dim = async (f) => { const m = await sharp(DIR + "fotos/" + f + ".webp").metadata(); return `width="${m.width}" height="${m.height}"`; };

// [archivo, nombre, categoría, precio actual, precio anterior|null, etiqueta]
const P = [
  ["bravo", "Berria Bravo HPR Elite NX", "electricas", "2.799", "3.299", "Eléctrica"],
  ["mako-elite", "Berria Mako Elite Deore", "carbono", "3.099", "3.299", "Carbono"],
  ["belador", "Berria Belador Pro Ultegra Di2", "carbono", "3.299", "3.499", "Carbono"],
  ["mistral", "Berria Mistral HPR Apex", "electricas", "4.099", "4.299", "Eléctrica"],
  ["ursus", "Berria Ursus Elite", "electricas", "3.999", "4.299", "Eléctrica"],
  ["neomouv-mountain", "Neomouv Mountain 2", "electricas", "2.349", "2.749", "Eléctrica"],
  ["neomouv-carlina", "Neomouv Carlina HY rojo", "electricas", "1.799", "1.899", "Eléctrica"],
  ["littium-ibiza", "Littium Ibiza Titanium", "electricas", "1.990", null, "Plegable eléctrica"],
  ["wst-cosmo", "WST Cosmo 27,5\"", "aluminio", "339", null, "Aluminio"],
  ["alpina", "Alpina Freetime caqui", "aluminio", "350", "460", "Aluminio"],
  ["lombardo", "Lombardo Montecatini 7.0", "outlet", "2.599", "3.099", "Outlet"],
  ["wst-poison", "WST Poison 9411 29\" disc", "outlet", "799", "875", "Outlet"],
  ["cayman", "Berria Cayman Elite NX", "outlet", "4.599", "5.799", "Outlet"],
  ["met-echo", "Casco MET Echo MIPS azul mate", "equipamiento", "90", null, "Equipamiento"],
  ["met-crossover", "Casco MET Crossover negro/gris/rosa mate", "equipamiento", "75", null, "Equipamiento"],
  ["onguard-k9", "Candado plegable Onguard K9", "ofertas", "65", "75", "Oferta"],
  ["lazer-chiru", "Casco Lazer Chiru azul mate", "equipamiento", "55", "70", "Equipamiento"],
  ["speedsix-air35", "SpeedSix Air 35 Ultralight carbono disc", "ruedas", "1.495", "1.895", "Ruedas"],
  ["speedsix-air55", "SpeedSix Air 55 Ultralight carbono disc", "ruedas", "1.495", "1.895", "Ruedas"],
  ["speedsix-earth", "SpeedSix Earth gravel carbono disc", "ruedas", "1.295", null, "Ruedas"],
  ["onguard-mastiff", "Candado de cadena Onguard Mastiff", "accesorios", "49", "60", "Accesorio"],
  ["gurpil-plegable", "Candado plegable Gurpil", "accesorios", "29", "35", "Accesorio"],
  ["onguard-doberman", "Candado Onguard Doberman 15x185", "accesorios", "22", "26", "Accesorio"],
];
let cards = "";
for (const [f, n, c, p, a, et] of P) {
  cards += `      <li class="prod" data-cat="${c}">
        <div class="prod__foto"><img src="fotos/${f}.webp" ${await dim(f)} alt="${n}" loading="lazy"/><span class="etiq">${et}</span></div>
        <h3>${n}</h3>
        <p class="precio">${a ? `<s>${a} €</s> ` : ""}<strong>${p} €</strong></p>
        <button class="anadir" type="button" data-nombre="${n}">Añadir al carrito</button>
        <a class="preg" href="#contacto" data-bici="${n}">Preguntar por esta bici</a>
      </li>\n`;
}
const d = { tf: await dim("tienda-fachada"), tl: await dim("taller"), ti: await dim("tienda-interior"), ru: await dim("ruedas"), bv: await dim("hero-poison"), al: await dim("alpina-t"), cr: await dim("cayman"), nc: await dim("neomouv-carlina") };

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="robots" content="noindex, nofollow"/>
<title>Oh My Bike! · Donostia — muestra</title>
<meta name="description" content="Tienda, taller y alquiler de bicis en Donostia: bicis nuevas y reacondicionadas, taller sin cita, alquiler desde 8 € y tours con pintxo."/>
<!--
  MUESTRA · reconstruida sobre la referencia n.º 18 del tablero de bicis («SAILING»), elegida por Oier:
  bruma azul con tarjeta blanca, palabra gigante blanca DETRÁS de la bici, lista numerada con miniaturas que
  salen al pasar, bloque «lista de razones» con foto inclinada y tres líneas, bici con rótulos de detalle unidos
  por puntos, acordeón con foto, cierre con teléfono y bici dibujada de fondo.
  Contenido: el de su web actual (ombdonostia.com, 9/10/2026). Fotos: las suyas (tienda, taller) y su catálogo.
-->
<link rel="stylesheet" href="fuentes/letras.css"/>
<link rel="preload" href="fuentes/archivo-400_900.woff2" as="font" type="font/woff2" crossorigin/>
<style>
:root{--tinta:#0d141c;--gris:#566471;--linea:#dde4ea;--papel:#f4f7f9;--blanco:#fff;--bruma1:#6f8da4;--bruma2:#b9cddb;--bruma3:#e6eef4;--azul:#3d5a73;--e:cubic-bezier(.23,1,.32,1);--lat:max(clamp(18px,4vw,56px),calc((100vw - 1240px)/2))}
*{box-sizing:border-box;margin:0}
html{scroll-behavior:smooth;scroll-padding-top:16px}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
body{font:400 16px/1.55 Satoshi,system-ui,sans-serif;color:var(--tinta);background:#fff;-webkit-font-smoothing:antialiased;padding:0}
img{display:block;max-width:100%;height:auto}
a{color:inherit}
button{font:inherit;color:inherit;cursor:pointer}
:focus-visible{outline:2px solid var(--azul);outline-offset:3px}
.pagina{background:var(--blanco);overflow:clip}
.wrap{padding:0 var(--lat)}
.mono{font:700 12px/1.2 "JetBrains Mono",monospace;text-transform:uppercase;letter-spacing:.06em}
.gran{font-family:Archivo,sans-serif;font-weight:900;font-stretch:100%;letter-spacing:-.035em;line-height:.92}
h2{font:900 clamp(30px,4.4vw,56px)/.98 Archivo,sans-serif;letter-spacing:-.03em;text-transform:uppercase}
.btn{display:inline-flex;align-items:center;gap:10px;min-height:48px;padding:0 8px 0 22px;border-radius:99px;background:var(--tinta);color:#fff;text-decoration:none;font-weight:700;font-size:15px;border:0;transition:transform 160ms var(--e)}
.btn i{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#fff;color:var(--tinta);font-style:normal;transition:transform 240ms var(--e)}
.btn:active{transform:scale(.97)}
.btn--claro{background:#fff;color:var(--tinta)}
.btn--claro i{background:var(--tinta);color:#fff}
.btn--linea{background:transparent;color:var(--tinta);box-shadow:inset 0 0 0 1.5px var(--tinta)}
.btn--linea i{background:var(--tinta);color:#fff}
@media(hover:hover) and (pointer:fine){.btn:hover i{transform:translateX(3px)}}

/* portada */
.portada{position:relative;container-type:inline-size;overflow:hidden;isolation:isolate;height:clamp(600px,100svh,980px);background:radial-gradient(120% 90% at 20% 0%,#cfe0ec 0%,rgba(207,224,236,0) 55%),linear-gradient(180deg,var(--bruma1) 0%,var(--bruma2) 62%,var(--bruma3) 100%)}
.nav{position:absolute;top:0;left:0;right:0;z-index:5;display:flex;align-items:center;gap:20px;padding:18px var(--lat)}
.logo{display:flex;align-items:center;gap:9px;text-decoration:none;font:900 19px/1 Archivo,sans-serif;letter-spacing:-.02em;color:#fff;text-transform:uppercase}
.logo svg{width:30px;height:30px;color:#fff}
.nav ul{display:flex;gap:26px;list-style:none;padding:0;margin:0 auto;font-size:14px;font-weight:700}
.nav ul a{text-decoration:none;color:#fff;opacity:.9;padding:10px 2px}
@media(hover:hover) and (pointer:fine){.nav ul a:hover{opacity:1;text-decoration:underline;text-underline-offset:5px}}
.nav__d{display:flex;align-items:center;gap:14px;margin-left:auto}
.idioma{font:700 12px/1 "JetBrains Mono",monospace;color:#fff;letter-spacing:.06em}
.idioma span{opacity:.6}
.carrito{display:inline-flex;align-items:center;gap:8px;background:#fff;color:var(--tinta);border-radius:99px;min-height:40px;padding:0 16px;font-weight:700;font-size:14px;text-decoration:none}
.carrito b{display:grid;place-items:center;min-width:22px;height:22px;border-radius:99px;background:var(--azul);color:#fff;font-size:12px;padding:0 6px}
.burger{display:none;min-height:44px;padding:0 16px;border:0;border-radius:99px;background:#fff;font-weight:700;font-size:14px}
.palabra{position:absolute;z-index:1;left:0;right:0;top:15%;line-height:1.12;text-align:center;color:#fff;font-size:17.4cqw;white-space:nowrap;user-select:none}
.bici-h{position:absolute;z-index:2;left:3%;bottom:12%;width:60%;filter:drop-shadow(0 3cqw 3cqw rgba(30,55,75,.28))}
.suelo{position:absolute;z-index:1;left:9%;width:50%;bottom:9.5%;height:5%;background:radial-gradient(closest-side,rgba(20,40,58,.28),rgba(20,40,58,0));filter:blur(6px)}
.textos{position:absolute;z-index:4;right:var(--lat);bottom:clamp(18px,3.6vw,44px);max-width:min(400px,31%);color:#fff}
.textos h1{font:900 clamp(22px,3.1cqw,40px)/1.12 Archivo,sans-serif;letter-spacing:-.03em;text-transform:uppercase}
.textos p{margin:10px 0 18px;font-size:clamp(14px,1.5cqw,18px);color:rgba(255,255,255,.95)}
.textos .acc{display:flex;flex-wrap:wrap;gap:10px}
.sello{display:block;margin-bottom:10px;opacity:.95}
.aire{position:absolute;inset:auto 0 0;height:20%;z-index:3;background:linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,0))}

/* lista numerada */
.busca{padding-top:clamp(40px,6vw,76px);padding-bottom:clamp(24px,4vw,48px)}
.busca h2{font-size:clamp(26px,3.3vw,40px);margin-bottom:clamp(14px,2vw,24px)}
.filas{list-style:none;padding:0;border-top:1px solid var(--linea)}
.fila{position:relative;display:grid;grid-template-columns:44px 1fr auto;gap:16px;align-items:center;padding:clamp(16px,2vw,24px) 6px;border-bottom:1px solid var(--linea);text-decoration:none;transition:background 200ms var(--e)}
.fila .n{font:700 14px "JetBrains Mono",monospace;color:var(--gris)}
.fila strong{display:block;font:800 clamp(19px,2.2vw,28px)/1.1 Archivo,sans-serif;letter-spacing:-.02em;text-transform:uppercase}
.fila small{display:block;color:var(--gris);font-size:15px;margin-top:3px}
.fila .ver{font:700 12px "JetBrains Mono",monospace;text-transform:uppercase;letter-spacing:.06em;display:inline-flex;gap:6px;align-items:center}
.mini{position:absolute;right:110px;top:50%;width:130px;height:84px;pointer-events:none;opacity:0;transform:translateY(-44%) rotate(0);transition:opacity 200ms var(--e),transform 300ms var(--e)}
.mini img{position:absolute;width:104px;height:78px;object-fit:cover;border-radius:4px;box-shadow:0 8px 18px rgba(13,20,28,.2);background:var(--papel)}
.mini img:nth-child(1){left:0;top:0;transform:rotate(-7deg)}.mini img:nth-child(2){right:0;top:8px;transform:rotate(6deg)}
.mini .m-b{object-fit:contain;padding:4px}
@media(hover:hover) and (pointer:fine){.fila:hover{background:var(--papel)}.fila:hover .mini,.fila:focus-visible .mini{opacity:1;transform:translateY(-50%)}}
@media(hover:none),(max-width:760px){.mini{display:none}}

/* razones */
.razones{display:grid;grid-template-columns:1.05fr .9fr 1.05fr;gap:clamp(18px,3vw,44px);align-items:center;padding:clamp(34px,5vw,64px) var(--lat)}
.razones h2{margin-bottom:16px}
.razones p.txt{font-size:clamp(17px,1.5vw,20px);line-height:1.5;color:var(--tinta);max-width:44ch}
.razones .foto{position:relative;background:var(--bruma2);padding:14px;aspect-ratio:1/1.05;display:grid;place-items:center;transform:rotate(2.2deg)}
.razones .foto img{width:100%;height:100%;object-fit:cover;object-position:50% 60%;border:6px solid #fff}
.razones ul{list-style:none;padding:0;border-top:1px solid var(--linea)}
.razones li{padding:16px 0;border-bottom:1px solid var(--linea);font:800 14.5px/1.25 Archivo,sans-serif;text-transform:uppercase;letter-spacing:.01em}
.razones li small{display:block;font:400 14px/1.4 Satoshi,sans-serif;text-transform:none;color:var(--gris);margin-top:3px}

/* cifras */
.cifras{position:relative;overflow:hidden;isolation:isolate;color:#fff;padding:clamp(56px,8vw,110px) var(--lat)}
.cifras>img{position:absolute;left:0;top:-12%;width:100%;height:124%;object-fit:cover;z-index:-2}
.cifras::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(13,20,28,.88),rgba(13,20,28,.55))}
.cifras h2{max-width:14ch;margin-bottom:clamp(28px,4vw,56px)}
.cifras dl{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(16px,3vw,40px);margin:0}
.cifras dl div{border-top:1px solid rgba(255,255,255,.4);padding-top:14px}
.cifras dt{font:900 clamp(40px,6.4vw,92px)/.95 Archivo,sans-serif;letter-spacing:-.04em}
.cifras dt small{font-size:.42em;letter-spacing:-.01em;margin-left:4px}
.cifras dd{margin:8px 0 0;font:700 12px/1.3 "JetBrains Mono",monospace;text-transform:uppercase;letter-spacing:.06em;color:#c5d3de}
@media(max-width:760px){.cifras dl{grid-template-columns:1fr 1fr;row-gap:28px}}

/* alquiler */
.alquiler{background:linear-gradient(180deg,#fff 0%,var(--bruma3) 38%,var(--bruma2) 100%);padding:clamp(40px,6vw,80px) var(--lat)}
.alquiler__cab{display:grid;grid-template-columns:1fr auto;gap:24px;align-items:end;margin-bottom:clamp(18px,3vw,40px)}
.alquiler__cab p{max-width:46ch;color:var(--gris);margin-top:12px;font-size:17px}
.detalle{position:relative;max-width:900px;margin:0 auto;aspect-ratio:900/470}
.detalle>img{position:absolute;left:50%;top:6%;width:58%;transform:translateX(-50%);mix-blend-mode:multiply}
.rot{position:absolute;display:flex;align-items:center;gap:12px;width:210px;font:800 12.5px/1.2 Archivo,sans-serif;text-transform:uppercase;letter-spacing:.02em}
.rot span{display:grid;place-items:center;flex:none;width:58px;height:58px;background:#fff;border-radius:4px;box-shadow:0 6px 16px rgba(13,20,28,.12);color:var(--tinta)}
.rot svg{width:30px;height:30px}
.rot small{display:block;font:400 12.5px/1.3 Satoshi,sans-serif;text-transform:none;color:var(--gris);margin-top:2px}
.rot.a{left:2%;top:10%}.rot.b{right:2%;top:6%;flex-direction:row-reverse;text-align:right}.rot.c{left:4%;bottom:6%}.rot.d{right:4%;bottom:10%;flex-direction:row-reverse;text-align:right}
.puntos{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible}
.puntos line{stroke:var(--tinta);stroke-width:1;stroke-dasharray:3 4;opacity:.55}
.puntos circle{fill:var(--azul);stroke:#fff;stroke-width:2}
.nota-ej{text-align:center;font-size:12.5px;color:var(--gris);margin-top:6px}
.tarifas{margin-top:clamp(28px,4vw,48px);background:#fff;border-radius:8px;padding:clamp(16px,2.4vw,30px);box-shadow:0 16px 40px -24px rgba(13,20,28,.35)}
.tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px}
.tab{min-height:44px;padding:0 18px;border-radius:99px;border:1.5px solid var(--tinta);background:#fff;font-weight:700;font-size:14px}
.tab[aria-selected=true]{background:var(--tinta);color:#fff}
.panel table{width:100%;border-collapse:collapse}
.panel th,.panel td{text-align:left;padding:12px 6px;border-bottom:1px solid var(--linea);font-size:16px}
.panel table,.panel tbody,.panel caption{display:block}.panel tbody{display:grid;grid-template-columns:1fr 1fr;column-gap:48px}.panel tr{display:flex;justify-content:space-between;align-items:baseline;gap:12px;border-bottom:1px solid var(--linea)}.panel td{border:0!important}@media(max-width:760px){.panel tbody{grid-template-columns:1fr}}
.panel td:last-child{text-align:right;font:800 18px Archivo,sans-serif;white-space:nowrap}
.panel caption{text-align:left;font-size:14px;color:var(--gris);padding-bottom:8px}
.panel .extra{margin-top:12px;font-size:14px;color:var(--gris)}
.js .panel[hidden]{display:none}
.panel+.panel{margin-top:26px}.js .panel+.panel{margin-top:0}
.panel__h{font:800 14px Archivo,sans-serif;text-transform:uppercase;margin-bottom:6px}
.js .panel__h{display:none}

/* tours */
.tours{background:var(--tinta);color:#fff;padding:clamp(40px,6vw,80px) var(--lat)}
.tours__cab{display:grid;grid-template-columns:1fr auto;gap:20px;align-items:end;margin-bottom:clamp(18px,3vw,36px)}
.tours__cab .mono{color:#9fb4c4;margin-bottom:10px;display:block}
.tours__cab p{color:#b8c6d1;max-width:36ch}
.tour{display:grid;grid-template-columns:44px 1.5fr 1fr auto;gap:18px;align-items:center;padding:clamp(16px,2vw,24px) 6px;border-top:1px solid rgba(255,255,255,.18)}
.tour:last-of-type{border-bottom:1px solid rgba(255,255,255,.18)}
.tour .n{font:700 14px "JetBrains Mono",monospace;color:#9fb4c4}
.tour h3{font:800 clamp(18px,2vw,26px)/1.1 Archivo,sans-serif;text-transform:uppercase;letter-spacing:-.01em}
.tour p{font-size:14.5px;color:#b8c6d1;margin-top:4px}
.tour .meta{font-size:14.5px;color:#d5dfe7}
.tour .pr{text-align:right;font:900 clamp(22px,2.6vw,34px)/1 Archivo,sans-serif;letter-spacing:-.02em}
.tour .pr small{display:block;font:400 13px Satoshi,sans-serif;color:#9fb4c4;margin-top:4px;letter-spacing:0}
.tours__pie{margin-top:18px;color:#9fb4c4;font-size:14px}

/* taller */
.taller{display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,5vw,72px);align-items:center;padding:clamp(40px,6vw,84px) var(--lat)}
.taller h2{margin-bottom:12px}
.taller .lead{color:var(--gris);font-size:17px;max-width:46ch;margin-bottom:18px}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:22px}
.chip{display:inline-flex;align-items:center;min-height:36px;padding:0 14px;border-radius:99px;background:var(--papel);font:700 13px Satoshi,sans-serif}
.acordeon details{border-top:1px solid var(--linea)}
.acordeon details:last-of-type{border-bottom:1px solid var(--linea)}
.acordeon summary{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:14px;min-height:60px;padding:10px 4px;cursor:pointer;font:800 15px Archivo,sans-serif;text-transform:uppercase}
.acordeon summary::-webkit-details-marker{display:none}
.acordeon summary b{margin-left:auto;font-size:20px}
.acordeon summary::after{content:"+";display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:var(--tinta);color:#fff;font:700 18px/1 Satoshi;transition:transform 240ms var(--e)}
.acordeon details[open] summary::after{transform:rotate(45deg)}
.acordeon ul{padding:0 4px 18px 20px;color:var(--gris);font-size:15.5px;line-height:1.55}
.taller__nota{font-size:13.5px;color:var(--gris);margin-top:10px}
.taller__foto{position:relative}
.taller__foto img{width:100%;aspect-ratio:4/4.4;object-fit:cover;object-position:35% 50%;border-radius:6px}
.taller__foto .tag{position:absolute;left:-14px;bottom:24px;background:#fff;box-shadow:0 10px 26px rgba(13,20,28,.18);padding:12px 16px;border-radius:6px;font:800 13px/1.2 Archivo,sans-serif;text-transform:uppercase}
.taller__foto .tag small{display:block;font:400 13px Satoshi;text-transform:none;color:var(--gris);margin-top:2px}

/* tienda */
.tienda{background:var(--papel);padding:clamp(40px,6vw,84px) var(--lat)}
.tienda__cab{display:grid;grid-template-columns:1fr auto;gap:20px;align-items:end;margin-bottom:20px}
.tienda__cab p{color:var(--gris);max-width:44ch;margin-top:10px}
.cats{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:22px}
.cat{min-height:44px;padding:0 16px;border-radius:99px;border:1.5px solid var(--tinta);background:#fff;font:700 14px Satoshi,sans-serif}
.cat[aria-pressed=true]{background:var(--tinta);color:#fff}
.cat small{opacity:.65;font-weight:400;margin-left:4px}
.prods{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;list-style:none;padding:0}
.prod{background:#fff;border-radius:8px;padding:12px 12px 14px;display:flex;flex-direction:column}
.prod[hidden]{display:none}
.prod__foto{position:relative;aspect-ratio:4/3;display:grid;place-items:center;background:#fff;border-radius:4px;overflow:hidden}
.prod__foto img{max-height:100%;width:auto;object-fit:contain;mix-blend-mode:multiply}
.etiq{position:absolute;left:0;top:0;font:700 10.5px "JetBrains Mono",monospace;text-transform:uppercase;letter-spacing:.05em;background:var(--tinta);color:#fff;padding:5px 8px;border-radius:3px}
.prod h3{font:800 14.5px/1.2 Archivo,sans-serif;margin:12px 0 6px;text-transform:uppercase;letter-spacing:.005em;flex:1}
.precio{font-size:15px;margin-bottom:10px;color:var(--gris)}
.precio strong{font:900 21px Archivo,sans-serif;color:var(--tinta);letter-spacing:-.02em}
.anadir{min-height:44px;border-radius:99px;border:1.5px solid var(--tinta);background:#fff;font:700 13.5px Satoshi,sans-serif;transition:background 160ms,color 160ms,transform 120ms var(--e)}
.anadir:active{transform:scale(.97)}
@media(hover:hover) and (pointer:fine){.anadir:hover{background:var(--tinta);color:#fff}}
.vacio{padding:34px 12px;color:var(--gris)}
.fin{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:26px}
.fin div{background:var(--tinta);color:#fff;border-radius:8px;padding:clamp(18px,2.4vw,30px)}
.fin div:nth-child(2){background:var(--azul)}
.fin b{display:block;font:900 clamp(20px,2.4vw,30px)/1.05 Archivo,sans-serif;text-transform:uppercase;letter-spacing:-.02em}
.fin p{margin-top:8px;opacity:.9;font-size:15.5px}
.tienda__nota{margin-top:14px;font-size:13px;color:var(--gris)}

/* cierre */
.cierre{position:relative;overflow:hidden;text-align:center;padding:clamp(56px,8vw,110px) var(--lat) clamp(48px,6vw,80px)}
.cierre .rueda{position:absolute;left:50%;bottom:-16%;width:min(900px,120%);transform:translateX(-50%);color:var(--linea);opacity:.9;z-index:0}
.cierre>*{position:relative;z-index:1}
.cierre h2{font-size:clamp(28px,4.6vw,60px);max-width:16ch;margin:0 auto 14px}
.cierre p.sub{color:var(--gris);font-size:17px;max-width:44ch;margin:0 auto 22px}
.tels{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-bottom:18px}
.tel{font:900 clamp(24px,3.6vw,44px)/1 Archivo,sans-serif;letter-spacing:-.03em;text-decoration:none}
.contacto{display:grid;grid-template-columns:1fr 1fr 1.1fr;gap:clamp(18px,3vw,40px);max-width:1080px;margin:clamp(36px,5vw,64px) auto 0;text-align:left;background:#fff;border-radius:10px;padding:clamp(18px,3vw,36px);box-shadow:0 20px 50px -30px rgba(13,20,28,.4)}
.contacto h3{font:800 14px Archivo,sans-serif;text-transform:uppercase;margin-bottom:10px}
.horas{list-style:none;padding:0;font-size:15.5px}
.horas li{display:flex;flex-direction:column;padding:8px 0;border-bottom:1px solid var(--linea)}.horas li span:last-child{font-weight:700}
.estado{display:inline-flex;align-items:center;gap:8px;margin:12px 0 0;font:700 12px "JetBrains Mono",monospace;text-transform:uppercase;letter-spacing:.05em}
.estado i{width:9px;height:9px;border-radius:50%;background:#9aa7b2}
.estado.on i{background:#13a05a}
.contacto address{font-style:normal;font-size:15.5px;line-height:1.5}
.contacto a.cl{display:inline-block;margin-top:10px;font-weight:700}
form{display:grid;gap:10px}
label{font-size:13.5px;font-weight:700}
input,textarea,select{width:100%;font:inherit;padding:12px 14px;border:1.5px solid #c3cfd8;border-radius:6px;background:#fff;color:var(--tinta)}
textarea{min-height:92px;resize:vertical}
.ok{font-size:14px;color:var(--gris);min-height:20px}
footer{background:var(--tinta);color:#9fb4c4;padding:28px var(--lat);display:flex;flex-wrap:wrap;gap:12px 28px;justify-content:space-between;font-size:13.5px}
footer a{color:#d5dfe7}
.movil{position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:30;display:none;grid-template-columns:1fr 1fr;gap:8px;transform:translateY(140%);visibility:hidden;transition:transform 400ms var(--e),visibility 0s 400ms}
.movil.on{transform:none;visibility:visible;transition:transform 400ms var(--e)}
.movil .btn{justify-content:center;padding:0 16px;min-height:52px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}

@media(max-width:1000px){
  .nav ul{display:none}
  .burger{display:inline-block}
  .panelmenu{display:none;position:absolute;z-index:6;top:70px;left:14px;right:14px;background:#fff;border-radius:10px;padding:10px;box-shadow:0 20px 40px rgba(13,20,28,.3)}
  .panelmenu.on{display:block}
  .panelmenu a{display:flex;align-items:center;min-height:48px;padding:0 12px;text-decoration:none;font-weight:700;border-bottom:1px solid var(--linea)}
  .razones{grid-template-columns:1fr 1fr}.razones ul{grid-column:1/-1}
  .prods{grid-template-columns:repeat(3,1fr)}
}
@media(min-width:1001px){.panelmenu{display:none}}
@media(max-width:760px){
  .portada{height:auto;min-height:700px;display:flex;flex-direction:column;justify-content:flex-end}
  .palabra{font-size:16.6cqw;top:104px}
  .bici-h{width:112%;left:-6%;top:150px;bottom:auto}
  .suelo{left:8%;width:84%;top:366px;bottom:auto}
  .textos{position:relative;right:auto;bottom:auto;max-width:none;padding:0 18px 96px;margin-top:auto}
  .textos h1{font-size:26px}
  .sello{display:none}
  .carrito{padding:0 12px}.carrito span{display:none}
  .idioma{display:none}
  .razones{grid-template-columns:1fr}.razones .foto{transform:none;max-width:420px}
  .alquiler__cab,.tours__cab,.tienda__cab{grid-template-columns:1fr}
  .detalle{aspect-ratio:auto;display:grid;gap:12px}
  .detalle>img{position:static;width:90%;margin:0 auto;transform:none}
  .puntos{display:none}
  .rot,.rot.a,.rot.b,.rot.c,.rot.d{position:static;width:auto;flex-direction:row;text-align:left}
  .tour{grid-template-columns:34px 1fr auto;gap:12px}.tour .meta{grid-column:2/-1;grid-row:2}
  .taller{grid-template-columns:1fr}.taller__foto .tag{left:10px}
  .prods{grid-template-columns:repeat(2,1fr);gap:12px}
  .fin{grid-template-columns:1fr}
  .contacto{grid-template-columns:1fr}
  .movil{display:grid}body{padding-bottom:84px}
  .fila{grid-template-columns:34px 1fr}.fila .ver{display:none}
}
@media(prefers-reduced-motion:reduce){.movil,.btn,.btn i,.mini,.anadir{transition:none}}

/* v4 · misma paleta que la referencia 18: bruma azul, blanco y negro. Titulares enormes, pegatinas blancas y negras. */
:root{--acero:#3d5a73;--trazo:var(--tinta)}
html{scroll-padding-top:72px}
h2{font-size:clamp(40px,7.4vw,112px);line-height:.88;letter-spacing:-.045em}
.hueco{color:transparent;-webkit-text-stroke:max(2px,.025em) var(--trazo)}
mark{background:var(--tinta);color:#fff;padding:0 .12em;margin:0 -.04em;-webkit-box-decoration-break:clone;box-decoration-break:clone}
.mono{font-size:13px}
.btn--tr{background:rgba(255,255,255,.18);color:#fff;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.85)}
.btn--tr i{background:#fff;color:var(--tinta)}
.btn--sm{min-height:44px;margin-top:16px}

/* barra fija */
.nav{position:fixed;z-index:40;padding:14px var(--lat);transition:background 300ms var(--e),box-shadow 300ms var(--e)}
.nav.solid{background:rgba(255,255,255,.92);backdrop-filter:saturate(1.4) blur(14px);-webkit-backdrop-filter:saturate(1.4) blur(14px);box-shadow:0 1px 0 var(--linea)}
.nav.solid .logo,.nav.solid ul a,.nav.solid .idioma,.nav.solid .llamar{color:var(--tinta)}
.nav ul a[aria-current=true]{text-decoration:underline;text-underline-offset:6px;text-decoration-thickness:2px;opacity:1}
.llamar{color:#fff;text-decoration:none;font:800 15px Archivo,sans-serif;letter-spacing:-.01em;padding:10px 4px}
.panelmenu{position:fixed;top:66px}
.nav.solid .carrito{background:var(--tinta);color:#fff}
.nav.solid .carrito b{background:#fff;color:var(--tinta)}

/* portada */
.bici3d{position:absolute;z-index:2;left:2%;bottom:12%;width:57%}
.bici3d.agarrada{cursor:grabbing}
.bici3d canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:pan-y;filter:drop-shadow(0 2cqw 2.4cqw rgba(30,55,75,.2))}
.bici3d .bici-h{position:static;display:block;width:100%;transform:none;transition:opacity 500ms var(--e)}
.bici3d.lista .bici-h{opacity:0;pointer-events:none}
.con3d .suelo{display:none}
.hint360{position:absolute;left:50%;bottom:-6%;transform:translateX(-50%);display:inline-flex;align-items:center;gap:10px;background:#fff;color:var(--tinta);padding:8px 16px;border-radius:99px;font:700 13px Satoshi,sans-serif;white-space:nowrap;box-shadow:0 8px 22px rgba(13,20,28,.2);pointer-events:none;opacity:0;transition:opacity 400ms var(--e)}
.hint360 b{font:900 13px Archivo,sans-serif;letter-spacing:-.01em}
.bici3d.lista .hint360:not([hidden]){opacity:1}
.mando{position:absolute;left:50%;bottom:-6%;transform:translateX(150px);display:none;gap:8px}
.bici3d.lista .mando{display:flex}
.mando button{width:44px;height:44px;border-radius:50%;border:0;background:#fff;color:var(--tinta);font:700 18px Satoshi,sans-serif;box-shadow:0 8px 22px rgba(13,20,28,.2)}
.mando button:active{transform:scale(.94)}
.mando button:first-child{margin-right:0}
.hint360,.mando{z-index:3}
.giro{position:absolute;display:grid;place-items:center;width:clamp(96px,10.5vw,156px);aspect-ratio:1;border-radius:50%;background:#fff;color:var(--tinta);z-index:6;box-shadow:0 12px 30px -12px rgba(13,20,28,.4)}
.giro .aro{position:absolute;inset:0;width:100%;height:100%;animation:giro 18s linear infinite}
.giro text{font:800 10.4px Archivo,sans-serif;letter-spacing:.4px;fill:currentColor;text-transform:uppercase}
.giro b{font:900 clamp(30px,3.6vw,54px)/.85 Archivo,sans-serif;letter-spacing:-.04em;text-align:center}
.giro b small{display:block;font:700 clamp(9px,.9vw,12px) "JetBrains Mono",monospace;letter-spacing:.05em;text-transform:uppercase;margin-top:3px}
@keyframes giro{to{transform:rotate(360deg)}}
@media(prefers-reduced-motion:reduce){.giro .aro{animation:none}}
.portada>.giro{right:calc(var(--lat) - 14px);top:clamp(80px,13%,150px)}
.textos{max-width:min(500px,36%)}
.textos h1{font-size:clamp(28px,3.9cqw,58px);line-height:1.02}
.sello{background:#fff;color:var(--tinta);display:inline-block;padding:6px 10px;border-radius:3px;opacity:1}
.textos .acc{gap:10px}
.atajos{display:flex;flex-wrap:wrap;gap:6px 18px;width:100%;margin:8px 0 0!important;font-size:14px!important;font-weight:700}
.atajos a{color:#fff;text-underline-offset:4px;padding:6px 0}

/* lista */
.busca h2{font-size:clamp(40px,7.4vw,112px);margin-bottom:clamp(18px,3vw,36px)}
.fila{grid-template-columns:clamp(46px,7vw,110px) 1fr auto;padding:clamp(18px,2.6vw,34px) 10px;transition:background 220ms var(--e),color 220ms var(--e),padding 300ms var(--e)}
.fila .n{font:900 clamp(18px,3vw,40px)/1 Archivo,sans-serif;color:var(--acero);letter-spacing:-.03em}
.fila strong{font-size:clamp(24px,5vw,72px);line-height:.95;letter-spacing:-.04em}
.fila small{font-size:clamp(14px,1.3vw,18px);margin-top:8px}
.mini{right:150px;width:210px;height:130px}.mini img{width:170px;height:128px}
@media(hover:hover) and (pointer:fine){.fila:hover{background:var(--tinta);color:#fff;padding-left:28px}.fila:hover .n{color:var(--bruma2)}.fila:hover small{color:#c5d3de}}

/* razones: bruma clara, texto negro */
.razones{background:linear-gradient(180deg,var(--bruma3),var(--bruma2));color:var(--tinta);--trazo:var(--tinta);padding-top:clamp(56px,8vw,110px);padding-bottom:clamp(56px,8vw,110px);grid-template-columns:1.25fr .85fr 1fr}
.razones>div:first-child{display:contents}
.razones h2{grid-column:1/-1;max-width:16ch;margin-bottom:0}
.razones .txt{align-self:center;color:var(--tinta);font-size:clamp(17px,1.6vw,22px)}
.razones .foto{background:#fff;transform:rotate(-3deg);overflow:visible;box-shadow:0 24px 50px -26px rgba(13,20,28,.5)}
.razones .foto img{border-color:#fff}
.razones .foto .giro{right:-34px;top:-34px;background:var(--tinta);color:#fff}
.razones ul{border-top-color:rgba(13,20,28,.3)}
.razones li{border-bottom-color:rgba(13,20,28,.3);font-size:16px}
.razones li small{color:#36424d}

/* cifras: foto en gris con velo de bruma */
.cifras{--trazo:#fff}
.cifras>img{filter:grayscale(1) contrast(1.15)}
.cifras::before{background:linear-gradient(100deg,rgba(61,90,115,.92),rgba(13,20,28,.8))}
.cifras dt{font-size:clamp(54px,11.5vw,180px);line-height:.85}
.cifras dt small{color:var(--bruma2)}
.cifras dl div{border-top:3px solid #fff;padding-top:16px}
.cifras h2{max-width:11ch}

/* alquiler: bruma que oscurece hacia abajo y palabra blanca detrás de la bici, como la portada */
.alquiler{position:relative;background:linear-gradient(180deg,#fff 0%,#cfdde8 16%,#9fb6c7 58%,#6f8da4 100%);overflow:hidden;--trazo:var(--tinta)}
.alquiler>*{position:relative;z-index:1}
.alquiler>.detalle{z-index:auto}
.alquiler .fondo{position:absolute;z-index:0;left:0;right:0;top:30%;margin:0;text-align:center;font:900 24vw/.8 Archivo,sans-serif;letter-spacing:-.05em;color:#fff;opacity:.9;pointer-events:none;white-space:nowrap}
.alquiler__cab p{color:var(--tinta)}
.detalle>img{width:64%;top:2%;mix-blend-mode:normal}
.rot span{border-radius:50%;width:64px;height:64px;background:var(--tinta);color:#fff}
.rot{font-size:14px;width:240px}
.puntos line{stroke:var(--tinta);opacity:.7}.puntos circle{fill:var(--tinta);stroke:#fff}
.nota-ej{color:var(--tinta)}
.tarifas{box-shadow:0 30px 60px -30px rgba(13,20,28,.6)}
.panel td:last-child{font-size:clamp(20px,2.4vw,30px)}

/* tours */
.tours{--trazo:#fff}
.tours__cab .mono{color:var(--bruma2)}
.tour{padding:clamp(20px,3vw,40px) 10px;transition:background 220ms var(--e),padding 300ms var(--e)}
.tour h3{font-size:clamp(22px,3.4vw,48px);letter-spacing:-.03em}
.tour .pr{font-size:clamp(34px,5.6vw,84px);letter-spacing:-.045em}
.tour .n{color:var(--bruma2);font-size:16px}
.res{display:inline-block;margin-top:10px;padding:10px 0;font:700 13px "JetBrains Mono",monospace;text-transform:uppercase;letter-spacing:.05em;color:#fff;text-decoration:underline;text-underline-offset:5px}
.tour .pr .res{font-size:13px}
@media(hover:hover) and (pointer:fine){.tour:hover{background:rgba(255,255,255,.07);padding-left:26px}.res:hover{color:var(--bruma2)}}

/* taller */
.taller{background:#fff;position:relative}
.taller__foto img{aspect-ratio:4/4.8}
.pegatina{position:absolute;z-index:3;right:-18px;top:-26px;display:grid;place-items:center;width:clamp(100px,11vw,150px);aspect-ratio:1;border-radius:50%;background:var(--tinta);color:#fff;text-align:center;font:900 clamp(15px,1.7vw,22px)/1 Archivo,sans-serif;text-transform:uppercase;letter-spacing:-.02em;transform:rotate(12deg);box-shadow:0 14px 30px -10px rgba(13,20,28,.5)}
.acordeon summary{font-size:17px;min-height:68px}
.acordeon summary b{font-size:clamp(24px,3vw,38px);letter-spacing:-.03em}
.chip{background:var(--bruma3);color:var(--tinta)}
.acc2{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}

/* tienda */
.tienda{background:var(--papel)}
.prod{transition:transform 300ms var(--e),box-shadow 300ms var(--e)}
@media(hover:hover) and (pointer:fine){.prod:hover{transform:translateY(-8px);box-shadow:0 24px 40px -22px rgba(13,20,28,.45)}}
.precio strong{font-size:clamp(24px,2.2vw,32px)}
.preg{display:block;text-align:center;margin-top:6px;padding:10px 0 2px;font-size:13.5px;font-weight:700;color:var(--tinta);text-underline-offset:4px}
.fin div:nth-child(1){background:var(--tinta);color:#fff}
.fin div:nth-child(2){background:var(--acero);color:#fff}
.fin b{font-size:clamp(28px,4.2vw,60px);line-height:.92;letter-spacing:-.04em}

/* cierre */
.cierre{background:linear-gradient(180deg,#3d5a73,#587a94);color:#fff;--trazo:#fff}
.cierre .rueda{color:rgba(255,255,255,.18)}
.cierre p.sub{color:#fff}
.cierre h2{max-width:13ch}
.tel[aria-hidden]{display:none}.tels{gap:0 .6em}
.tel{font-size:clamp(34px,7vw,112px);color:#fff;letter-spacing:-.05em}
.cierre>.btn{background:#fff;color:var(--tinta)}
.cierre>.btn i{background:var(--tinta);color:#fff}
.contacto{color:var(--tinta);text-align:left}
footer a{color:#fff}

@media(max-width:1000px){.razones{grid-template-columns:1fr 1fr}.llamar{display:none}}
@media(max-width:760px){
  .portada>.giro{right:10px;top:84px;width:92px}
  .textos{max-width:none}.textos h1{font-size:30px}
  .portada{min-height:840px}
  .bici3d{left:-6%;width:112%;top:150px;bottom:auto}
  .hint360{left:14px;bottom:2px;transform:none}.mando{left:auto;right:14px;bottom:0;transform:none}
  .razones{grid-template-columns:1fr}.razones .foto{transform:rotate(-2deg);max-width:380px;margin-right:auto}.razones .foto .giro{right:-10px;top:-24px;width:96px}
  .mini{display:none}.pegatina{right:6px;top:-18px}
  .alquiler .fondo{top:26%}
  .tel{font-size:clamp(30px,10vw,52px)}
}

/* legibilidad del texto blanco sobre la bruma */
.portada{background:radial-gradient(120% 90% at 20% 0%,#c3d6e4 0%,rgba(195,214,228,0) 55%),linear-gradient(180deg,#678699 0%,#86a0b3 62%,#a1b8c9 100%)}
.textos{text-shadow:0 1px 20px rgba(30,55,75,.4)}
.textos .btn{text-shadow:none}
.btn--tr{background:rgba(13,20,28,.5);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.9)}
@media(max-width:760px){.portada{background:radial-gradient(120% 60% at 20% 0%,#9fb8ca 0%,rgba(159,184,202,0) 55%),linear-gradient(180deg,#587a94 0%,#6a89a0 55%,#7c97ab 100%)}}

/* menú superior más grande */
html{scroll-padding-top:96px}
.nav{padding:22px var(--lat);gap:28px}
.nav.solid{padding:14px var(--lat)}
.logo{font-size:27px;gap:12px}.logo svg{width:40px;height:40px}
.nav ul{gap:38px;font-size:18px}
.nav ul a{padding:12px 4px}
.llamar{font-size:19px}
.idioma{font-size:14px}
.carrito{min-height:50px;padding:0 22px;font-size:17px}.carrito b{min-width:26px;height:26px;font-size:14px}
.burger{min-height:52px;padding:0 22px;font-size:17px}
.panelmenu{top:84px}.panelmenu a{min-height:56px;font-size:18px}
@media(max-width:1180px){.nav ul{gap:24px;font-size:16px}.llamar{display:none}}
@media(max-width:760px){.nav{padding:14px 16px;gap:12px}.logo{font-size:20px;white-space:nowrap}.logo svg{width:32px;height:32px}.carrito{min-height:48px;padding:0 16px}}

/* sin sombra que se cuele por los huecos de las ruedas; cifras que caben en su columna */
.bici3d .bici-h{filter:none}
.cifras dl{container-type:inline-size;grid-template-columns:repeat(4,minmax(0,1fr))}
.cifras dt{font-size:8.2cqw;line-height:.9;white-space:nowrap}
.cifras dt small{font-size:.4em}
.cifras dd{overflow-wrap:anywhere}
@media(max-width:760px){.cifras dl{grid-template-columns:repeat(2,minmax(0,1fr))}.cifras dt{font-size:15cqw}}

.alquiler__cab,.tours__cab,.tienda__cab{grid-template-columns:minmax(0,1fr) auto}
h2{overflow-wrap:break-word;hyphens:manual}
@media(max-width:900px){.alquiler__cab,.tours__cab,.tienda__cab{grid-template-columns:minmax(0,1fr)}}

/* elegir categoría: bicis, equipamiento, accesorios, ruedas, outlet */
.elige{margin-bottom:28px}
.elige__t{color:var(--acero);margin-bottom:12px}
.tiles{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px}
.tile{position:relative;display:flex;flex-direction:column;text-align:left;padding:0 0 16px;border:0;border-radius:10px;overflow:hidden;background:#fff;color:var(--tinta);box-shadow:0 1px 0 var(--linea),0 14px 30px -24px rgba(13,20,28,.5);transition:transform 300ms var(--e),box-shadow 300ms var(--e),background 220ms var(--e),color 220ms var(--e)}
.tile__foto{position:relative;display:block;aspect-ratio:4/3;overflow:hidden;background:linear-gradient(180deg,var(--bruma3),var(--bruma2));padding:12px}
.tile__foto img{position:absolute;inset:12px;margin:auto;max-width:calc(100% - 24px);max-height:calc(100% - 24px);width:auto;height:auto;object-fit:contain;mix-blend-mode:multiply;transition:transform 400ms var(--e)}
.tile__t{min-height:2.05em;margin:14px 16px 0;font:900 clamp(18px,1.9vw,26px)/1 Archivo,sans-serif;text-transform:uppercase;letter-spacing:-.035em}
.tile__n{margin:8px 16px 0;font:700 12px "JetBrains Mono",monospace;text-transform:uppercase;letter-spacing:.05em;color:var(--gris)}
.tile[aria-pressed=true]{background:var(--tinta);color:#fff;box-shadow:0 22px 40px -22px rgba(13,20,28,.7)}
.tile[aria-pressed=true] .tile__n{color:var(--bruma2)}
.tile[aria-pressed=true]::after{content:"";position:absolute;left:50%;bottom:-9px;width:18px;height:18px;background:var(--tinta);transform:translateX(-50%) rotate(45deg)}
@media(hover:hover) and (pointer:fine){.tile:hover{transform:translateY(-6px)}.tile:hover .tile__foto img{transform:scale(1.06)}}
.elige .cats{margin:22px 0 0}
.elige .cats[hidden]{display:none}
@media(max-width:1000px){.tiles{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:620px){.tiles{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.tile__t{font-size:17px}}

/* croquis del mapa */
.llegar{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(0,1fr);gap:clamp(18px,3vw,40px);align-items:center;max-width:1080px;margin:clamp(24px,3vw,40px) auto 0;text-align:left;background:#fff;color:var(--tinta);border-radius:10px;padding:clamp(14px,2vw,24px);box-shadow:0 20px 50px -30px rgba(13,20,28,.5)}
.croquis{margin:0;position:relative}
.croquis .mapa{display:block;width:100%;height:auto;border-radius:10px}
.croquis figcaption{margin-top:8px;color:var(--gris);font-size:11.5px}
.llegar__t h3{font:900 clamp(26px,3vw,40px)/.95 Archivo,sans-serif;letter-spacing:-.04em;text-transform:uppercase;margin:8px 0 10px}
.llegar__t p{color:var(--gris);margin-bottom:6px}
.llegar__t .mono{color:var(--acero)}
.js .croquis .ruta,.js .croquis .ruta-l{stroke-dashoffset:1000}
.js .croquis .ruta{stroke-dasharray:1 11}
.js .croquis .ruta-l{stroke-dasharray:1000}
.js .croquis .pin{opacity:0;transform-box:fill-box;transition:opacity 500ms var(--e) 1.9s}
.croquis.vista .ruta-l{animation:trazo 2.2s var(--e) forwards}
.croquis.vista .ruta{animation:trazo 2.2s var(--e) forwards}
.croquis.vista .pin{opacity:1}
@keyframes trazo{to{stroke-dashoffset:0}}
@media(prefers-reduced-motion:reduce){.js .croquis .ruta,.js .croquis .ruta-l{stroke-dashoffset:0}.js .croquis .pin{opacity:1;transition:none}.croquis.vista .ruta,.croquis.vista .ruta-l{animation:none}}
@media(max-width:860px){.llegar{grid-template-columns:minmax(0,1fr)}}
</style>
<script>document.documentElement.classList.add("js")</script>
</head>
<body>
<a class="sr" href="#contenido">Saltar al contenido</a>
<div class="pagina">

  <nav class="nav" aria-label="Principal">
    <a class="logo" href="#">
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="16" cy="16" r="13"/><circle cx="16" cy="16" r="2.4" fill="currentColor"/><path d="M16 3v10M16 19v10M3 16h10M19 16h10M6.8 6.8l7.4 7.4M17.8 17.8l7.4 7.4M25.2 6.8l-7.4 7.4M14.2 17.8l-7.4 7.4" stroke-width="1"/></svg>
      Oh My Bike!
    </a>
    <ul>
      <li><a href="#tienda">Tienda</a></li>
      <li><a href="#alquiler">Alquiler bicis</a></li>
      <li><a href="#tours">Tours</a></li>
      <li><a href="#taller">Taller</a></li>
      <li><a href="#contacto">Contacto</a></li>
    </ul>
    <div class="nav__d">
      <a class="llamar" href="tel:+34943539703">943 539 703</a>
      <span class="idioma" aria-label="Idioma">ES <span>· EU</span></span>
      <a class="carrito" href="#tienda" aria-label="Carrito"><span>Carrito</span> <b id="cuenta" aria-live="polite">0</b></a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="menu">Menú</button>
    </div>
  </nav>
  <div class="panelmenu" id="menu">
    <a href="#tienda">Tienda</a><a href="#alquiler">Alquiler bicis</a><a href="#tours">Tours</a><a href="#taller">Taller</a><a href="#contacto">Contacto</a><a href="tel:+34943539703">Llamar: 943 539 703</a>
  </div>
<header class="portada" data-portada>

  <p class="palabra gran" aria-hidden="true" data-letras>DONOSTIA</p>
  <span class="suelo" aria-hidden="true"></span>
  <div class="bici3d">
    <img class="bici-h" src="fotos/hero-poison.webp" ${d.bv} fetchpriority="high" alt="WST Poison 9411, bici de montaña deportiva de su tienda"/>
  </div>
  <span class="giro" aria-hidden="true"><svg class="aro" viewBox="0 0 120 120"><defs><path id="oh" d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0"/></defs><text><textPath href="#oh" textLength="277" lengthAdjust="spacing">FINANCIACIÓN EN BICIS Y ACCESORIOS • </textPath></text></svg><b>60<small>meses</small></b></span>
  <div class="textos" id="contenido">
    <span class="mono sello">Proyecto familiar desde 2016</span>
    <h1 data-lineas>Tu tienda y taller de bicis en Donostia</h1>
    <p>Tu pasión por el deporte es lo que nos hace grandes.</p>
    <div class="acc">
      <a class="btn btn--claro" href="#tienda">Ver bicis nuevas y outlet <i aria-hidden="true">→</i></a>
      <a class="btn btn--tr" href="#alquiler">Alquilar una bici <i aria-hidden="true">→</i></a>
    
      <p class="atajos"><a href="#taller">Taller sin cita</a><a href="#tours">Tours con pintxo</a><a href="tel:+34943539703">Llamar</a></p>
    </div>
  </div>
</header>

<section class="busca wrap" aria-labelledby="busca-t">
  <h2 id="busca-t" data-lineas>Lo que estabas <span class="hueco">buscando</span></h2>
  <ol class="filas" data-escalonado>
    <li><a class="fila" href="#alquiler"><span class="n">01</span><span><strong>Alquila una bici</strong><small>Desde 8 € las 2 horas. Con luces, timbre, candado y mapa.</small></span><span class="ver">Ver tarifas →</span>
      <span class="mini" aria-hidden="true"><img src="fotos/ruedas.webp" alt="" loading="lazy"/><img class="m-b" src="fotos/alpina.webp" alt="" loading="lazy"/></span></a></li>
    <li><a class="fila" href="#taller"><span class="n">02</span><span><strong>Taller sin cita previa</strong><small>Revisión básica 35 €. Express: 30 minutos o menos.</small></span><span class="ver">Ver taller →</span>
      <span class="mini" aria-hidden="true"><img src="fotos/taller.webp" alt="" loading="lazy"/><img src="fotos/tienda-interior.webp" alt="" loading="lazy"/></span></a></li>
    <li><a class="fila" href="#tienda"><span class="n">03</span><span><strong>Bicis nuevas y outlet</strong><small>Nuevas, reacondicionadas y outlet: carbono, eléctricas y aluminio. Financiación hasta 60 meses.</small></span><span class="ver">Ver tienda →</span>
      <span class="mini" aria-hidden="true"><img class="m-b" src="fotos/cayman.webp" alt="" loading="lazy"/><img class="m-b" src="fotos/neomouv-carlina.webp" alt="" loading="lazy"/></span></a></li>
    <li><a class="fila" href="#tours"><span class="n">04</span><span><strong>Tours en bici con pintxo</strong><small>Por Donostia y alrededores, en español e inglés. Desde 39 €.</small></span><span class="ver">Ver tours →</span>
      <span class="mini" aria-hidden="true"><img src="fotos/tienda-fachada.webp" alt="" loading="lazy"/><img class="m-b" src="fotos/wst-cosmo.webp" alt="" loading="lazy"/></span></a></li>
  </ol>
</section>

<section class="razones" aria-labelledby="razones-t">
  <div>
    <h2 id="razones-t" data-lineas>Una tienda de barrio con <mark>135 m</mark> de bicis</h2>
    <p class="txt" data-enciende>Oh My Bike! nació en 2016 como proyecto familiar. Hoy tenemos dos plantas en la Plaza Teresa de Calcuta: 135 m para exponer bicicletas y accesorios y 65 m para el taller, con personal cualificado y años de experiencia.</p>
  </div>
  <div class="foto"><span class="giro" aria-hidden="true"><svg class="aro" viewBox="0 0 120 120"><defs><path id="or" d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0"/></defs><text><textPath href="#or" textLength="277" lengthAdjust="spacing">ACEPTAMOS TU BICI • TASACIÓN INMEDIATA • </textPath></text></svg><b>€<small>tasación</small></b></span><img src="fotos/tienda-fachada.webp" ${d.tf} alt="Fachada de Oh My Bike! con dos bicis plegables eléctricas Littium en la puerta" loading="lazy"/></div>
  <ul data-escalonado>
    <li>Aceptamos tu bici como parte de pago<small>Tasación inmediata al comprar una nueva.</small></li>
    <li>Financiación hasta 60 meses<small>En bicis y accesorios.</small></li>
    <li>Bici nueva o reacondicionada<small>Tienda con exposición de 135 m y outlet.</small></li>
  </ul>
</section>

<section class="cifras" aria-labelledby="cifras-t">
  <img src="fotos/tienda-interior.webp" ${d.ti} alt="" loading="lazy" data-parallax="8"/>
  <h2 id="cifras-t" data-lineas>Bicis, taller y cariño desde <span class="hueco">2016</span></h2>
  <dl>
    <div><dt data-cuenta="2016">2016</dt><dd>Año en que empezó el proyecto familiar</dd></div>
    <div><dt><span data-cuenta="135">135</span><small>m</small></dt><dd>De exposición de bicis y accesorios</dd></div>
    <div><dt><span data-cuenta="65">65</span><small>m</small></dt><dd>De taller con lavadero</dd></div>
    <div><dt><span data-cuenta="60">60</span><small>meses</small></dt><dd>De financiación en bicis y accesorios</dd></div>
  </dl>
</section>

<section class="alquiler" id="alquiler" aria-labelledby="alq-t">
  <p class="fondo" aria-hidden="true">ALQUILER</p>
  <div class="alquiler__cab">
    <div>
      <span class="mono">Alquiler de bicis</span>
      <h2 id="alq-t" data-lineas>Alquila una bici en <span class="hueco">San Sebastián</span></h2>
      <p>Alquiler a cualquier hora, todos los días, por teléfono o WhatsApp. Urbanas, carretera, montaña, infantiles, portabebés y remolques.</p>
    </div>
    <a class="btn" href="https://wa.me/34688756396?text=Hola%2C%20quiero%20alquilar%20una%20bici%20en%20Donostia.%20%C2%BFQu%C3%A9%20ten%C3%A9is%20disponible%3F">Reservar por WhatsApp <i aria-hidden="true">→</i></a>
  </div>

  <div class="detalle">
    <img src="fotos/alpina-t.webp" ${d.al} alt="Bici urbana de paseo" loading="lazy"/>
    <svg class="puntos" viewBox="0 0 900 470" preserveAspectRatio="none" aria-hidden="true">
      <line x1="215" y1="75" x2="406" y2="32"/><circle cx="406" cy="32" r="5"/>
      <line x1="685" y1="55" x2="548" y2="85"/><circle cx="548" cy="85" r="5"/>
      <line x1="215" y1="400" x2="356" y2="188"/><circle cx="356" cy="188" r="5"/>
      <line x1="685" y1="385" x2="545" y2="227"/><circle cx="545" cy="227" r="5"/>
    </svg>
    <div class="rot a"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 17a7 7 0 0 1 14 0z"/><path d="M12 6V4M4 19h16"/></svg></span><div>Timbre<small>Incluido en todas.</small></div></div>
    <div class="rot b"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg></span><div>Luces<small>Delantera y trasera.</small></div></div>
    <div class="rot c"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg></span><div>Candado<small>Para dejarla tranquila.</small></div></div>
    <div class="rot d"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/></svg></span><div>Mapa y guía<small>De la ciudad.</small></div></div>
  </div>
  <p class="nota-ej">Imagen de ejemplo. Todas las bicis de alquiler se entregan con luces, timbre, candado y mapa.</p>

  <div class="tarifas">
    <div class="tabs" role="tablist" aria-label="Tarifas de alquiler"></div>
    <section class="panel" id="p-urbana" data-titulo="Urbana">
      <h3 class="panel__h">Bici urbana</h3>
      <table><caption>Tarifa por bici</caption><tbody>
        <tr><td>2 horas</td><td>8 €</td></tr><tr><td>4 horas</td><td>12 €</td></tr><tr><td>6 horas</td><td>14 €</td></tr>
        <tr><td>8 horas</td><td>16 €</td></tr><tr><td>1 día</td><td>18 €</td></tr><tr><td>24 horas</td><td>22 €</td></tr><tr><td>Día extra</td><td>15 €</td></tr>
        <tr><td>Casco</td><td>2 €</td></tr><tr><td>Sillita de bebé</td><td>5 €</td></tr></tbody></table>
      <p class="extra">Fines de semana, sábados y festivos: 5 € más por bici.</p>
    <a class="btn btn--sm" href="https://wa.me/34688756396?text=Hola%2C%20quiero%20alquilar%20una%20bici%20urbana.%20%C2%BFQu%C3%A9%20ten%C3%A9is%20disponible%3F">Reservar este alquiler <i aria-hidden="true">→</i></a>
    </section>
    <section class="panel" id="p-mtb" data-titulo="Montaña y carretera">
      <h3 class="panel__h">Montaña y carretera</h3>
      <table><caption>Tarifa por bici</caption><tbody>
        <tr><td>Media jornada (menos de 4 h)</td><td>25 €</td></tr><tr><td>1 día (4 h o más)</td><td>35 €</td></tr><tr><td>24 horas</td><td>45 €</td></tr><tr><td>Día extra</td><td>35 €</td></tr>
        <tr><td>1 semana</td><td>130 €</td></tr><tr><td>10 días</td><td>160 €</td></tr><tr><td>2 semanas</td><td>190 €</td></tr><tr><td>3 semanas</td><td>225 €</td></tr><tr><td>4 semanas</td><td>260 €</td></tr></tbody></table>
      <p class="extra">Fines de semana y festivos: 20 % más, salvo en las tarifas semanales.</p>
    <a class="btn btn--sm" href="https://wa.me/34688756396?text=Hola%2C%20quiero%20alquilar%20una%20bici%20de%20monta%C3%B1a%20o%20carretera.%20%C2%BFQu%C3%A9%20ten%C3%A9is%20disponible%3F">Reservar este alquiler <i aria-hidden="true">→</i></a>
    </section>
    <section class="panel" id="p-remolque" data-titulo="Remolque">
      <h3 class="panel__h">Remolque</h3>
      <table><caption>Por horas y día, igual que la bici urbana (de 8 € a 22 €; día extra 15 €)</caption><tbody>
        <tr><td>1 semana</td><td>90 €</td></tr><tr><td>10 días</td><td>110 €</td></tr><tr><td>2 semanas</td><td>140 €</td></tr><tr><td>3 semanas</td><td>170 €</td></tr><tr><td>4 semanas</td><td>200 €</td></tr></tbody></table>
      <p class="extra">Fines de semana y festivos: 20 % más, salvo en las tarifas semanales.</p>
    <a class="btn btn--sm" href="https://wa.me/34688756396?text=Hola%2C%20quiero%20alquilar%20un%20remolque.%20%C2%BFQu%C3%A9%20ten%C3%A9is%20disponible%3F">Reservar este alquiler <i aria-hidden="true">→</i></a>
    </section>
  </div>
</section>

<section class="tours" id="tours" aria-labelledby="tours-t">
  <div class="tours__cab">
    <div>
      <span class="mono">Bike tours · ES / EN</span>
      <h2 id="tours-t" data-lineas>Tours en bici por <span class="hueco">Donostia</span></h2>
    </div>
    <p>Desde solo 39 €, con pintxo y bebida. Precios válidos de lunes a domingo.</p>
  </div>
  <div data-escalonado>
    <article class="tour"><span class="n">01</span><div><h3>Tour guiado por la ciudad</h3><p>Casco, candado, luces, timbre, un pintxo y una bebida.</p></div><div class="meta">2,5 h · Muy fácil</div><div class="pr">45 €<small>39 € a partir de 5 personas</small><a class="res" href="https://wa.me/34688756396?text=Hola%2C%20quiero%20reservar%20el%20tour%20guiado%20por%20la%20ciudad%20(2%2C5%20h).%20%C2%BFQu%C3%A9%20fechas%20ten%C3%A9is%3F">Reservar →</a></div></article>
    <article class="tour"><span class="n">02</span><div><h3>Donostia – Oiartzun</h3><p>Hasta las minas de Arditurri. Mismo equipo, pintxo y bebida.</p></div><div class="meta">4,5 h · Fácil</div><div class="pr">75 €<small>69 € a partir de 5 personas</small><a class="res" href="https://wa.me/34688756396?text=Hola%2C%20quiero%20reservar%20el%20tour%20Donostia%20%E2%80%93%20Oiartzun%20(4%2C5%20h).%20%C2%BFQu%C3%A9%20fechas%20ten%C3%A9is%3F">Reservar →</a></div></article>
    <article class="tour"><span class="n">03</span><div><h3>Montaña · Monte Ulia</h3><p>A elegir nivel. Casco, candado, luces y pedales; sin zapatillas ni ropa. Pintxo y bebida.</p></div><div class="meta">3,5 h · De fácil a difícil</div><div class="pr">105 €<small>95 € a partir de 5 personas</small><a class="res" href="https://wa.me/34688756396?text=Hola%2C%20quiero%20reservar%20el%20tour%20de%20monta%C3%B1a%20por%20Monte%20Ulia%20(3%2C5%20h).%20%C2%BFQu%C3%A9%20fechas%20ten%C3%A9is%3F">Reservar →</a></div></article>
    <article class="tour"><span class="n">04</span><div><h3>Carretera · Costa vasca</h3><p>Casco, candado, luces y pedales; sin zapatillas ni ropa. Pintxo y bebida.</p></div><div class="meta">4,5 h · De medio a difícil</div><div class="pr">125 €<small>115 € a partir de 5 personas</small><a class="res" href="https://wa.me/34688756396?text=Hola%2C%20quiero%20reservar%20el%20tour%20de%20carretera%20por%20la%20costa%20vasca%20(4%2C5%20h).%20%C2%BFQu%C3%A9%20fechas%20ten%C3%A9is%3F">Reservar →</a></div></article>
  </div>
  <p class="tours__pie">Precio por persona, de 1 a 4 personas, salvo que se indique otra cosa.</p>
</section>

<section class="taller" id="taller" aria-labelledby="taller-t">
  <div>
    <span class="mono">Taller · lavadero incluido</span>
    <h2 id="taller-t" data-lineas>El taller al que tu bici quiere ir <mark>una vez al año</mark></h2>
    <p class="lead">Reparamos bicis con cariño. Trabajamos sin cita previa, con personal cualificado y años de experiencia.</p>
    <div class="chips"><span class="chip">Sin cita previa</span><span class="chip">Express: 30 min o menos</span><span class="chip">Lavadero</span></div>
    <div class="acordeon">
      <details open><summary>Revisión básica <b>35 €</b></summary><ul><li>Ajuste de frenos</li><li>Ajuste de cambios</li><li>Limpieza básica</li><li>Lubricación</li><li>Hinchado</li></ul></details>
      <details><summary>Revisión intermedia <b>55 €</b></summary><ul><li>Todo lo de la básica</li><li>Centrado de ruedas</li><li>Limpieza intermedia</li></ul></details>
      <details><summary>Revisión completa <b>85 €</b></summary><ul><li>Todo lo de la intermedia</li><li>Ajuste y engrase de rodamientos</li><li>Limpieza a fondo</li></ul></details>
    </div>
    <p class="taller__nota">Precios sin IVA.</p>
    <div class="acc2"><a class="btn" href="tel:+34943539703">Llamar al taller <i aria-hidden="true">→</i></a><a class="btn btn--linea" href="https://www.google.com/maps/search/?api=1&query=Oh+My+Bike+Plaza+Teresa+de+Calcuta+6+Donostia">Cómo llegar <i aria-hidden="true">→</i></a></div>
  </div>
  <div class="taller__foto">
    <span class="pegatina" aria-hidden="true">Sin cita<br/>previa</span>
    <img src="fotos/taller.webp" ${d.tl} alt="Mecánico de Oh My Bike! montando una bici de carretera en el soporte del taller" loading="lazy"/>
    <div class="tag">Taller express<small>30 minutos o menos</small></div>
  </div>
</section>

<section class="tienda" id="tienda" aria-labelledby="tienda-t">
  <div class="tienda__cab">
    <div>
      <span class="mono">Tienda · 135 m de exposición</span>
      <h2 id="tienda-t" data-lineas>Bicis nuevas, reacondicionadas y <mark>outlet</mark></h2>
      <p>Una muestra de su catálogo. En la web final, las más de 300 referencias con su carrito.</p>
    </div>
    <a class="btn btn--linea" href="#contacto">Preguntar por una bici <i aria-hidden="true">→</i></a>
  </div>
  <div class="elige" role="group" aria-label="Elige qué buscas">
    <p class="mono elige__t">Elige qué buscas</p>
    <div class="tiles">
    <button class="tile" type="button" data-g="bicis" data-cats="carbono,electricas,aluminio" data-sub="1" aria-pressed="true"><span class="tile__foto"><img src="fotos/bravo.webp" alt="" loading="lazy"/></span><span class="tile__t">Bicicletas</span><span class="tile__n">73 artículos</span></button>
    <button class="tile" type="button" data-g="equipamiento" data-cats="equipamiento" data-sub="0" aria-pressed="false"><span class="tile__foto"><img src="fotos/met-echo.webp" alt="" loading="lazy"/></span><span class="tile__t">Equipamiento ciclista</span><span class="tile__n">47 artículos</span></button>
    <button class="tile" type="button" data-g="accesorios" data-cats="accesorios" data-sub="0" aria-pressed="false"><span class="tile__foto"><img src="fotos/onguard-mastiff.webp" alt="" loading="lazy"/></span><span class="tile__t">Accesorios y componentes</span><span class="tile__n">68 artículos</span></button>
    <button class="tile" type="button" data-g="ruedas" data-cats="ruedas" data-sub="0" aria-pressed="false"><span class="tile__foto"><img src="fotos/speedsix-air35.webp" alt="" loading="lazy"/></span><span class="tile__t">Ruedas</span><span class="tile__n">15 artículos</span></button>
    <button class="tile" type="button" data-g="ofertas" data-cats="outlet,ofertas" data-sub="0" aria-pressed="false"><span class="tile__foto"><img src="fotos/cayman.webp" alt="" loading="lazy"/></span><span class="tile__t">Outlet y ofertas</span><span class="tile__n">122 artículos</span></button>
    </div>
    <div class="cats" role="group" aria-label="Tipo de bicicleta" data-sub>
      <button class="cat" type="button" data-f="todo" aria-pressed="true">Todas</button>
      <button class="cat" type="button" data-f="electricas" aria-pressed="false">Eléctricas <small>15</small></button>
      <button class="cat" type="button" data-f="carbono" aria-pressed="false">Carbono <small>33</small></button>
      <button class="cat" type="button" data-f="aluminio" aria-pressed="false">Aluminio <small>25</small></button>
    </div>
  </div>
  <ul class="prods" data-rejilla>
${cards}  </ul>
  <p class="vacio" data-vacio hidden>En la muestra solo enseñamos una selección; el resto está en su tienda online.</p>
  <div class="fin">
    <div><b>Financiación hasta 60 meses</b><p>En bicis y accesorios.</p></div>
    <div><b>Tu bici como parte de pago</b><p>Aceptamos tu bici al comprar una nueva. Tasación inmediata.</p></div>
  </div>
  <p class="tienda__nota">Precios de su tienda online a octubre de 2026.</p>
</section>

<section class="cierre" id="contacto" aria-labelledby="cierre-t">
  <svg class="rueda" viewBox="0 0 800 300" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><circle cx="190" cy="180" r="110"/><circle cx="610" cy="180" r="110"/><path d="M190 180l130-90h160l130 90M320 90l-40 90h170l30-90M480 90l-15-30h50M320 90l-10-26h-30"/></svg>
  <span class="mono">¿Te ayudamos?</span>
  <h2 id="cierre-t" data-lineas>Si necesitas ayuda, <span class="hueco">el equipo te atiende</span></h2>
  <p class="sub">Llámanos, escríbenos por WhatsApp o pásate por la tienda. Alquileres a cualquier hora.</p>
  <div class="tels"><a class="tel" href="tel:+34943539703">943 539 703</a><span class="tel" aria-hidden="true" style="opacity:.3">/</span><a class="tel" href="tel:+34688756396">688 756 396</a></div>
  <a class="btn" href="https://wa.me/34688756396">Escribir por WhatsApp <i aria-hidden="true">→</i></a>

  <div class="contacto">
    <div>
      <h3>Horario</h3>
      <ul class="horas"><li><span>Lunes a viernes</span><span>10:00–13:30 · 16:00–19:30</span></li><li><span>Sábados</span><span>10:30–13:30</span></li></ul>
      <p class="estado" data-estado><i></i><span>Horario habitual</span></p>
    </div>
    <div>
      <h3>Dónde estamos</h3>
      <address>Plaza Teresa de Calcuta, 6 bajo<br/>20012 Donostia – San Sebastián<br/>ohmybike@hotmail.com</address>
      <a class="cl" href="https://www.google.com/maps/search/?api=1&query=Oh+My+Bike+Plaza+Teresa+de+Calcuta+6+Donostia">Cómo llegar →</a>
    </div>
    <form data-form novalidate>
      <h3>Escríbenos</h3>
      <div><label for="f-t">Motivo</label><select id="f-t" name="motivo"><option>Comprar una bici</option><option>Alquilar una bici</option><option>Reservar un tour</option><option>Taller o reparación</option><option>Otra consulta</option></select></div>
      <div><label for="f-n">Nombre</label><input id="f-n" name="nombre" autocomplete="name"/></div>
      <div><label for="f-e">Correo</label><input id="f-e" name="email" type="email" autocomplete="email"/></div>
      <div><label for="f-m">¿Qué necesitas?</label><textarea id="f-m" name="mensaje"></textarea></div>
      <button class="btn" type="submit">Enviar mensaje <i aria-hidden="true">→</i></button>
      <p class="ok" role="status" data-ok></p>
    </form>
  </div>

  <div class="llegar">
    <figure class="croquis" data-croquis>
      <svg class="mapa" viewBox="0 0 960 440" role="img" aria-labelledby="croq-t croq-d">
    <title id="croq-t">Croquis de cómo llegar a Oh My Bike!</title>
    <desc id="croq-d">Dibujo esquemático, sin escala: una ruta en bici llega hasta la tienda, en la Plaza Teresa de Calcuta, 6 bajo, con el río cerca.</desc>
    <defs><linearGradient id="fondoMapa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfdde8"/><stop offset="1" stop-color="#a1b8c9"/></linearGradient>
    <pattern id="adoquin" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" fill="#fff" opacity=".55"/></pattern></defs>
    <rect width="960" height="440" rx="14" fill="url(#fondoMapa)"/>
    <rect width="960" height="440" rx="14" fill="url(#adoquin)"/>
    <g fill="#fff" opacity=".62"><rect x="40" y="40" width="120" height="70" rx="10"/><rect x="180" y="40" width="90" height="70" rx="10"/><rect x="290" y="40" width="130" height="70" rx="10"/><rect x="40" y="130" width="70" height="80" rx="10"/><rect x="130" y="130" width="140" height="80" rx="10"/><rect x="40" y="230" width="100" height="70" rx="10"/><rect x="160" y="230" width="110" height="70" rx="10"/><rect x="40" y="320" width="130" height="80" rx="10"/><rect x="190" y="320" width="80" height="80" rx="10"/><rect x="560" y="40" width="100" height="60" rx="10"/><rect x="680" y="40" width="120" height="60" rx="10"/><rect x="820" y="40" width="100" height="60" rx="10"/><rect x="600" y="120" width="90" height="70" rx="10"/><rect x="710" y="120" width="110" height="70" rx="10"/><rect x="840" y="120" width="80" height="70" rx="10"/><rect x="560" y="210" width="110" height="60" rx="10"/><rect x="690" y="210" width="70" height="60" rx="10"/><rect x="780" y="210" width="140" height="60" rx="10"/><rect x="600" y="290" width="120" height="70" rx="10"/><rect x="740" y="290" width="90" height="70" rx="10"/><rect x="850" y="290" width="70" height="70" rx="10"/><rect x="560" y="380" width="150" height="40" rx="10"/><rect x="730" y="380" width="190" height="40" rx="10"/><rect x="330" y="330" width="90" height="70" rx="10"/><rect x="330" y="230" width="70" height="60" rx="10"/></g>
    <path class="rio" d="M-20 395 C 150 330, 300 420, 430 300 S 640 150, 980 215" fill="none" stroke="#5d7f97" stroke-width="58" stroke-linecap="round"/>
    <path d="M-20 395 C 150 330, 300 420, 430 300 S 640 150, 980 215" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="2 14" stroke-linecap="round" opacity=".8"/>
    <text x="108" y="388" font-family="JetBrains Mono,monospace" font-size="13" font-weight="700" fill="#fff" letter-spacing="2" transform="rotate(-12 108 388)">RÍO</text>
    <path class="ruta" d="M70 120 L70 215 L300 215 L300 150 L470 150 L470 250 L530 250 L530 205" fill="none" stroke="#0d141c" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 11" pathLength="1000"/>
    <path class="ruta-l" d="M70 120 L70 215 L300 215 L300 150 L470 150 L470 250 L530 250 L530 205" fill="none" stroke="#0d141c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" pathLength="1000"/>
    <g transform="translate(70 120)"><circle r="19" fill="#fff"/><circle cx="0" cy="0" r="13" fill="none" stroke="#0d141c" stroke-width="1.56"/><line x1="0" y1="0" x2="13.0" y2="0.0" stroke="#0d141c" stroke-width="1"/><line x1="0" y1="0" x2="11.3" y2="6.5" stroke="#0d141c" stroke-width="1"/><line x1="0" y1="0" x2="6.5" y2="11.3" stroke="#0d141c" stroke-width="1"/><line x1="0" y1="0" x2="0.0" y2="13.0" stroke="#0d141c" stroke-width="1"/><line x1="0" y1="0" x2="-6.5" y2="11.3" stroke="#0d141c" stroke-width="1"/><line x1="0" y1="0" x2="-11.3" y2="6.5" stroke="#0d141c" stroke-width="1"/><line x1="0" y1="0" x2="-13.0" y2="0.0" stroke="#0d141c" stroke-width="1"/><line x1="0" y1="0" x2="-11.3" y2="-6.5" stroke="#0d141c" stroke-width="1"/><line x1="0" y1="0" x2="-6.5" y2="-11.3" stroke="#0d141c" stroke-width="1"/><line x1="0" y1="0" x2="-0.0" y2="-13.0" stroke="#0d141c" stroke-width="1"/><line x1="0" y1="0" x2="6.5" y2="-11.3" stroke="#0d141c" stroke-width="1"/><line x1="0" y1="0" x2="11.3" y2="-6.5" stroke="#0d141c" stroke-width="1"/><circle cx="0" cy="0" r="1.8200000000000003" fill="#0d141c"/></g>
    <g><rect x="38" y="62" width="64" height="26" rx="13" fill="#0d141c"/><text x="70" y="79.5" text-anchor="middle" font-family="Archivo,sans-serif" font-size="13" font-weight="900" fill="#fff" letter-spacing="1">TÚ</text></g>
    <g class="pin" transform="translate(530 192)">
      <path d="M0 14 L-13 -10 A26 26 0 1 1 13 -10 Z" fill="#0d141c" transform="translate(0 6)"/>
      <circle cy="-22" r="24" fill="#fff"/><circle cx="0" cy="-22" r="17" fill="none" stroke="#0d141c" stroke-width="2.04"/><line x1="0" y1="-22" x2="17.0" y2="-22.0" stroke="#0d141c" stroke-width="1"/><line x1="0" y1="-22" x2="14.7" y2="-13.5" stroke="#0d141c" stroke-width="1"/><line x1="0" y1="-22" x2="8.5" y2="-7.3" stroke="#0d141c" stroke-width="1"/><line x1="0" y1="-22" x2="0.0" y2="-5.0" stroke="#0d141c" stroke-width="1"/><line x1="0" y1="-22" x2="-8.5" y2="-7.3" stroke="#0d141c" stroke-width="1"/><line x1="0" y1="-22" x2="-14.7" y2="-13.5" stroke="#0d141c" stroke-width="1"/><line x1="0" y1="-22" x2="-17.0" y2="-22.0" stroke="#0d141c" stroke-width="1"/><line x1="0" y1="-22" x2="-14.7" y2="-30.5" stroke="#0d141c" stroke-width="1"/><line x1="0" y1="-22" x2="-8.5" y2="-36.7" stroke="#0d141c" stroke-width="1"/><line x1="0" y1="-22" x2="-0.0" y2="-39.0" stroke="#0d141c" stroke-width="1"/><line x1="0" y1="-22" x2="8.5" y2="-36.7" stroke="#0d141c" stroke-width="1"/><line x1="0" y1="-22" x2="14.7" y2="-30.5" stroke="#0d141c" stroke-width="1"/><circle cx="0" cy="-22" r="2.3800000000000003" fill="#0d141c"/>
    </g>
    <g transform="translate(560 140)"><rect width="250" height="62" rx="12" fill="#fff"/><text x="16" y="27" font-family="Archivo,sans-serif" font-size="21" font-weight="900" fill="#0d141c" letter-spacing="-.5">OH MY BIKE!</text><text x="16" y="48" font-family="Satoshi,sans-serif" font-size="14" fill="#566471">Plaza Teresa de Calcuta, 6 bajo</text></g>
    <g transform="translate(895 395)"><circle r="30" fill="#fff" opacity=".85"/><circle cx="0" cy="0" r="26" fill="none" stroke="#3d5a73" stroke-width="3.12"/><line x1="0" y1="0" x2="26.0" y2="0.0" stroke="#3d5a73" stroke-width="1.04"/><line x1="0" y1="0" x2="22.5" y2="13.0" stroke="#3d5a73" stroke-width="1.04"/><line x1="0" y1="0" x2="13.0" y2="22.5" stroke="#3d5a73" stroke-width="1.04"/><line x1="0" y1="0" x2="0.0" y2="26.0" stroke="#3d5a73" stroke-width="1.04"/><line x1="0" y1="0" x2="-13.0" y2="22.5" stroke="#3d5a73" stroke-width="1.04"/><line x1="0" y1="0" x2="-22.5" y2="13.0" stroke="#3d5a73" stroke-width="1.04"/><line x1="0" y1="0" x2="-26.0" y2="0.0" stroke="#3d5a73" stroke-width="1.04"/><line x1="0" y1="0" x2="-22.5" y2="-13.0" stroke="#3d5a73" stroke-width="1.04"/><line x1="0" y1="0" x2="-13.0" y2="-22.5" stroke="#3d5a73" stroke-width="1.04"/><line x1="0" y1="0" x2="-0.0" y2="-26.0" stroke="#3d5a73" stroke-width="1.04"/><line x1="0" y1="0" x2="13.0" y2="-22.5" stroke="#3d5a73" stroke-width="1.04"/><line x1="0" y1="0" x2="22.5" y2="-13.0" stroke="#3d5a73" stroke-width="1.04"/><circle cx="0" cy="0" r="3.6400000000000006" fill="#3d5a73"/><text y="-34" text-anchor="middle" font-family="Archivo,sans-serif" font-size="15" font-weight="900" fill="#0d141c">N</text></g>
  </svg>
      <figcaption class="mono">Croquis orientativo · sin escala</figcaption>
    </figure>
    <div class="llegar__t">
      <span class="mono">Cómo llegar</span>
      <h3>En bici, hasta la puerta</h3>
      <p>Plaza Teresa de Calcuta, 6 bajo, en Donostia. Si vienes con tu bici, el taller atiende sin cita y tiene lavadero.</p>
      <div class="acc2"><a class="btn" href="https://www.google.com/maps/search/?api=1&query=Oh+My+Bike+Plaza+Teresa+de+Calcuta+6+Donostia">Abrir en el mapa <i aria-hidden="true">→</i></a><a class="btn btn--linea" href="tel:+34943539703">Llamar <i aria-hidden="true">→</i></a></div>
    </div>
  </div>
</section>

<footer>
  <span>© Donostibizi 2016 S.L. · Taller, venta y alquiler de bicis · Tours guiados por Donostia y alrededores · Accesorios y componentes</span>
  <span>Aviso legal · Política de cookies y privacidad · Términos y condiciones</span>
  <span>Muestra de diseño de <a href="https://oiwebstudio.com">OI Studio</a>, no es la web oficial.</span>
</footer>
</div>

<div class="movil" data-barra-movil>
  <a class="btn btn--claro" href="tel:+34943539703">Llamar <i aria-hidden="true">→</i></a>
  <a class="btn" href="https://wa.me/34688756396">WhatsApp <i aria-hidden="true">→</i></a>
</div>

<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js"></script>
<script src="anim-texto.js"></script>
<script src="sitio.js"></script>
</body>
</html>
`;
fs.writeFileSync(DIR + "index.html", html);
console.log("ok", html.length, "bytes", P.length, "productos");
