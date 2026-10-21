/**
 * Página del caso real A.Berri (casa rural en Getaria): web/caso-a-berri.html.
 * Usa la carcasa de caso-errotatxo.html (estilos, menú y pie) y cambia la cabecera y el contenido.
 * La opinión es la que dejó María Jesús en aberricasarural.com/valoracion (16/10/2026, 5★, con permiso
 * para publicarla), tal cual en euskera y con su traducción.
 *
 * Uso: node herramientas/sitio/gen-caso-aberri.mjs
 */
import fs from "node:fs";
import path from "node:path";

const WEB = path.resolve("web");
const base = fs.readFileSync(path.join(WEB, "caso-errotatxo.html"), "utf8");
const URL = "https://oiwebstudio.com/caso-a-berri.html";
const OG = "https://oiwebstudio.com/assets/aberri/foto-caserio.jpg";

const pic = (src, alt, w, h, extra = 'loading="lazy"') =>
  `<picture><source srcset="assets/${src}.webp" type="image/webp"/><img src="assets/${src}.jpg" alt="${alt}" width="${w}" height="${h}" ${extra}/></picture>`;

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CreativeWork",
      name: "Web de A.Berri, casa rural en Getaria",
      url: URL,
      about: "Diseño y desarrollo de la web aberricasarural.com, con reservas",
      creator: { "@type": "Organization", name: "OI Studio", url: "https://oiwebstudio.com/" },
      image: OG,
      inLanguage: "es",
      dateCreated: "2026-10-16",
      mainEntity: {
        "@type": "LodgingBusiness",
        name: "A.Berri landetxea",
        url: "https://aberricasarural.com/",
        address: { "@type": "PostalAddress", addressLocality: "Getaria", addressRegion: "Gipuzkoa", addressCountry: "ES" },
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://oiwebstudio.com/" },
        { "@type": "ListItem", position: 2, name: "Trabajos", item: "https://oiwebstudio.com/trabajos.html" },
        { "@type": "ListItem", position: 3, name: "Caso real: A.Berri", item: URL },
      ],
    },
  ],
};

let h = base;
const rep = (a, b) => { if (!h.includes(a)) throw new Error("no encuentro: " + a.slice(0, 60)); h = h.replace(a, b); };
const repRe = (re, b) => { if (!re.test(h)) throw new Error("no encuentro: " + re); h = h.replace(re, b); };

repRe(/<title>[^<]*<\/title>/, "<title>Caso real: web de reservas para A.Berri en Getaria | OI Studio</title>");
repRe(/<meta name="description" content="[^"]*"\/>/, `<meta name="description" content="Así es la web de A.Berri, casa rural en Getaria: reservas con calendario, panel para los dueños, tres idiomas y fotos propias. Con la opinión de la dueña."/>`);
repRe(/<meta property="og:url" content="[^"]*"\/>/, `<meta property="og:url" content="${URL}"/>`);
repRe(/<meta property="og:title" content="[^"]*"\/>/, `<meta property="og:title" content="Caso real: la web con reservas de A.Berri, casa rural en Getaria"/>`);
repRe(/<meta property="og:description" content="[^"]*"\/>/, `<meta property="og:description" content="Un caserío entre viñas de txakoli que ahora recibe reservas desde su propia web."/>`);
repRe(/<meta property="og:image" content="[^"]*"\/>/, `<meta property="og:image" content="${OG}"/>`);
repRe(/<link rel="canonical" href="[^"]*"\/>/, `<link rel="canonical" href="${URL}"/>`);
repRe(/<meta name="theme-color" content="[^"]*"\/>/, `<meta name="theme-color" content="#ffffff"/>`);
repRe(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">\n${JSON.stringify(ld, null, 2)}\n</script>`);
// estilos propios del caso: la opinión
rep("</style>", `  .cs-opinion{margin:64px 0 0;background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:clamp(28px,4vw,48px);display:grid;gap:26px;}
  @media(min-width:900px){.cs-opinion{grid-template-columns:1.25fr 1fr;align-items:start;gap:48px;}}
  .cs-opinion__estrellas{color:#c98a2b;font-size:18px;letter-spacing:.12em;}
  .cs-opinion blockquote{margin:12px 0 0;font-family:var(--font-serif);font-size:clamp(22px,2.6vw,30px);line-height:1.35;letter-spacing:-.01em;color:var(--ink);}
  .cs-opinion__trad{margin-top:16px;font-size:16px;line-height:1.65;color:var(--text-muted);}
  .cs-opinion__trad small{display:block;margin-top:6px;font-size:12.5px;color:var(--text-faint);}
  .cs-opinion__autor{display:flex;flex-direction:column;gap:4px;padding-top:18px;border-top:1px solid var(--border);}
  .cs-opinion__autor b{font-size:17px;color:var(--ink);}
  .cs-opinion__autor span{font-size:14.5px;color:var(--text-muted);}
  .cs-opinion__mejor{font-size:15px;color:var(--text-muted);line-height:1.6;}
  .cs-opinion__mejor b{color:var(--ink);}
  @media(min-width:760px){.cs-fotos figure:nth-child(4){grid-row:auto;}}
</style>`);

const main = `<main>
<div class="container">
<header class="cs-hero">
<p class="cs-crumbs"><a href="index.html">Inicio</a> / <a href="trabajos.html">Trabajos</a> / Caso real</p>
<div class="cs-hero__grid">
<div class="reveal">
<span class="cs-tag"><i></i>Caso real · en vivo en aberricasarural.com</span>
<h1>A.Berri: un caserío de Getaria que ahora <em>recibe reservas</em> desde su web.</h1>
<p class="cs-lede">Casa rural y apartamento entre viñas de txakoli, a cinco kilómetros de Getaria. María Jesús y Carlos querían una web que enseñara la casa tal como es y que las reservas les llegaran directamente, sin depender solo de los portales.</p>
<div class="cs-acts">
<a class="btn btn--primary btn--lg" href="https://aberricasarural.com/" target="_blank" rel="noopener">Visitar aberricasarural.com ↗</a>
<a class="btn btn--ghost btn--lg" href="contacto.html">Quiero una así</a>
</div>
</div>
<div class="cs-escena reveal" data-d="1">
<div class="cs-escena__foto">${pic("aberri/foto-caserio", "El caserío de A.Berri al atardecer, entre viñas, en Getaria", 800, 450, 'loading="eager" fetchpriority="high"')}</div>
<div class="cs-escena__web"><b><i></i><i></i><i></i></b>${pic("aberri-desk", "Portada de la web aberricasarural.com en un ordenador", 1440, 900, "")}</div>
<div class="cs-escena__movil">${pic("aberri-mobile", "La web de A.Berri en un móvil", 585, 1266, "")}</div>
</div>
</div>
</header>

<div class="cs-ficha reveal">
<div><span>Cliente</span><b>A.Berri landetxea</b></div>
<div><span>Sector</span><b>Casa rural y apartamento</b></div>
<div><span>Lugar</span><b>Barrio Meaga · Getaria</b></div>
<div><span>Idiomas</span><b>Castellano, euskera e inglés</b></div>
<div><span>En vivo</span><b><a href="https://aberricasarural.com/" target="_blank" rel="noopener">aberricasarural.com</a></b></div>
</div>

<section class="cs-resumen reveal" aria-label="Resumen del caso">
<div><h3>Qué necesitaban</h3><p>Un caserío de piedra para grupos y un apartamento para parejas o familias, en Getaria. Querían enseñar cada alojamiento tal como es, explicar qué noches están libres y recibir las reservas directamente, sin depender solo de los portales, en castellano, euskera e inglés.</p></div>
<div><h3>Qué hice</h3><p>Un calendario por alojamiento que solo deja marcar las noches libres y calcula el precio antes de enviar; la solicitud llega con todos los datos al correo de los dueños, y un panel privado les permite marcar noches como abiertas u ocupadas y aceptar o rechazar cada solicitud con la respuesta ya redactada. El panel también puede enlazar los calendarios de Booking o Airbnb (iCal) para no ofrecer una noche ocupada allí. Sin comisión por reserva.</p></div>
<div><h3>Cómo va</h3><p>Publicada en octubre de 2026, con dominio propio. Las reservas son por solicitud: los dueños confirman por correo y no hay pago online. Es pronto para hablar de número de reservas y no voy a inventarlo. Abajo, la opinión de María Jesús, tal cual la escribió.</p></div>
</section>

<section class="cs-opinion reveal" aria-label="Opinión de la clienta">
<div>
<div class="cs-opinion__estrellas" aria-label="5 de 5 estrellas">★★★★★</div>
<blockquote lang="eu">«Eskerrak eman nahi nizkizun webgunea eguneratzen egindako lan handiagaitik. Primeram gelditu da, nabegazio askarra eta diseñuak gure espektatibak bete deitu, lan bikaina eta askarra.»</blockquote>
<p class="cs-opinion__trad">«Quería darte las gracias por el gran trabajo de actualizar la web. Ha quedado de maravilla: la navegación es rápida y el diseño ha cumplido nuestras expectativas. Un trabajo excelente y rápido.»<small>Traducción del euskera. La opinión original se publica tal cual la escribió.</small></p>
</div>
<div style="display:grid;gap:18px;">
<p class="cs-opinion__mejor"><b>Lo que más valoró:</b> la atención y la profesionalidad.</p>
<div class="cs-opinion__autor"><b>María Jesús</b><span>A.Berri landetxea, Getaria · octubre de 2026</span></div>
</div>
</section>

<section class="cs-sec">
<div class="cs-intro reveal">
<h2>Una casa que se alquila entera y un apartamento: dos reservas distintas en la misma web.</h2>
<p>A.Berri alquila un caserío de piedra para grupos y un apartamento para parejas o familias, cada uno con su entrada, su precio y su calendario. La web tenía que explicar en segundos qué se alquila, para cuántas personas y qué noches están libres, en castellano, euskera e inglés.</p>
</div>

<div class="cs-pieza reveal">
<div class="cs-pieza__txt">
<span class="cs-num">01 · Reservas con calendario</span>
<h3>El huésped elige, ve las noches libres y envía su solicitud</h3>
<p>Se elige casa o apartamento, se marcan las fechas en un calendario que solo deja libres las noches disponibles y el precio aparece calculado antes de enviar. A los dueños les llega un aviso al correo con todos los datos.</p>
</div>
<div class="cs-captura cs-captura--movil">${pic("aberri/web-reserva-movil", "Calendario de reservas de la web de A.Berri en el móvil", 585, 1266)}</div>
</div>

<div class="cs-pieza cs-pieza--inv reveal">
<div class="cs-pieza__txt">
<span class="cs-num">02 · Un panel sencillo para los dueños</span>
<h3>Abierto u ocupado, y la respuesta ya escrita</h3>
<p>Desde el móvil marcan cada noche como abierta u ocupada y aceptan o rechazan las solicitudes. Al responder, el correo sale ya redactado en el idioma del huésped y con su firma. Sin programas complicados ni comisiones por reserva.</p>
</div>
<div class="cs-captura">${pic("aberri/web-reserva", "Sección de reservas de la web de A.Berri en un ordenador", 1440, 900)}</div>
</div>

<div class="cs-pieza reveal">
<div class="cs-pieza__txt">
<span class="cs-num">03 · Casa rural y apartamento</span>
<h3>Cada alojamiento, con su precio y su entrada</h3>
<p>Desde la portada se entiende que son dos alojamientos independientes: la casa para grupos de hasta nueve personas y el apartamento para parejas o familias. Cada ficha enseña plazas, precio por noche y fotos propias.</p>
</div>
<div class="cs-captura">${pic("aberri/web-alojamientos", "Fichas de la casa rural y del apartamento en la web de A.Berri", 1440, 900)}</div>
</div>
</section>

<section class="cs-sec">
<div class="cs-pieza cs-pieza--inv reveal" style="margin-top:0">
<div class="cs-pieza__txt">
<span class="cs-num">04 · Sus fotos, con filtros</span>
<h3>Piedra, madera y jardín, tal como son</h3>
<p>La galería se ordena por exterior, casa rural y apartamento, y cada foto se abre a pantalla completa. Son las fotos de la propia casa: el atardecer sobre las viñas, el comedor, la barbacoa del jardín.</p>
</div>
<div class="cs-captura">${pic("aberri/web-galeria", "Galería de fotos con filtros en la web de A.Berri", 1440, 900)}</div>
</div>
<div class="cs-fotos reveal">
<figure>${pic("aberri/foto-apartamento", "Apartamento de A.Berri con jardín y barbacoa", 800, 450)}<figcaption>El apartamento</figcaption></figure>
<figure>${pic("aberri/foto-comedor", "Comedor de la casa rural de A.Berri", 800, 450)}<figcaption>Comedor de la casa</figcaption></figure>
<figure>${pic("aberri/foto-salon", "Salón y cocina del apartamento de A.Berri", 800, 361)}<figcaption>Salón del apartamento</figcaption></figure>
<figure>${pic("aberri/foto-habitacion", "Habitación de la casa rural de A.Berri", 800, 360)}<figcaption>Una habitación</figcaption></figure>
<figure>${pic("aberri/foto-vinas", "Viñas de txakoli junto a A.Berri, en Getaria", 800, 450)}<figcaption>Las viñas de alrededor</figcaption></figure>
</div>

<div class="cs-pieza reveal">
<div class="cs-pieza__txt">
<span class="cs-num">05 · Cómo llegar</span>
<h3>Un caserío en el monte, fácil de encontrar</h3>
<p>Un plano propio con Getaria, Zarautz y Zumaia, las distancias y los botones para abrir la ruta en Google Maps, Apple Maps o Waze. Es lo primero que pregunta quien llega por primera vez a un caserío.</p>
</div>
<div class="cs-captura">${pic("aberri/web-llegar", "Sección Cómo llegar con plano y distancias en la web de A.Berri", 1440, 900)}</div>
</div>
</section>

<section class="cs-sec">
<div class="cs-intro reveal">
<h2>Y lo que no se ve, también.</h2>
</div>
<ul class="cs-incluye reveal">
<li><b>Su propio dominio</b>aberricasarural.com, a su nombre. La web es suya.</li>
<li><b>Tres idiomas para Google</b>Castellano, euskera e inglés, cada uno con su dirección para que Google lo enseñe a cada visitante.</li>
<li><b>Datos de alojamiento para Google</b>Dirección, horarios de entrada y salida y tipos de alojamiento, en el formato que entiende el buscador.</li>
<li><b>Avisos a su correo</b>Cada solicitud de reserva llega a su correo de siempre, con todos los datos.</li>
<li><b>WhatsApp y llamar, a un toque</b>Una barra fija en el móvil para quien prefiere preguntar antes de reservar.</li>
<li><b>Aviso legal y privacidad</b>En los tres idiomas, como pide la ley.</li>
</ul>
</section>

<section class="cs-cta reveal">
<div>
<h2>¿Tienes un alojamiento y quieres reservas directas?</h2>
<p>Cuéntame cómo funciona tu casa y te preparo una propuesta con precio cerrado en menos de 48 horas.</p>
</div>
<div class="cs-cta__acts">
<a class="btn btn--light btn--lg" href="contacto.html">Pedir propuesta</a>
<a class="btn btn--lg" style="--btn-bg:transparent;--btn-fg:#f6f1e7;border:1px solid rgba(246,241,231,.3)" href="trabajos.html">Ver más trabajos</a>
</div>
</section>
</div>
</main>`;
repRe(/<main>[\s\S]*?<\/main>/, main);
fs.writeFileSync(path.join(WEB, "caso-a-berri.html"), h);
console.log("web/caso-a-berri.html escrita");
