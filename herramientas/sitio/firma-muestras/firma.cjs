// Firma de OI Studio al final de TODAS las muestras de web/demos/muestras/ (Oier, 10/11/2026: «en todas las webs abajo pon
// OI STUDIO como en Torino y mis datos, lo de siempre»). Mismo sello que el pie de torinozarautz.com (Diseñado por · OI STUDIO ·
// lema) y debajo los datos de Oier: nombre, teléfono y WhatsApp, correo y web. Va en una franja oscura propia, igual en todas.
//
// - Quita la firma pequeña de antes («Diseñado por OI Studio», «Muestra de OI Studio · oiwebstudio.com»…) para que no salga dos veces.
// - Lo mete entre <!-- oi-firma --> y <!-- /oi-firma -->: si se vuelve a pasar, lo sustituye (no duplica).
// - Euskera de Itzultzaile en eu.json (itzuli.cjs); castellano en es.json. El idioma sale de <html lang>.
// OJO: el gen.mjs de cada muestra rehace su HTML sin la firma. Después de regenerar una muestra, vuelve a pasar esto.
// Uso: node herramientas/sitio/firma-muestras/firma.cjs [--check] [--solo carpeta1,carpeta2]
const fs = require("fs");
const path = require("path");

const RAIZ = path.resolve(__dirname, "../../..");
const MUESTRAS = path.join(RAIZ, "web/demos/muestras");
const CHECK = process.argv.includes("--check");
const i = process.argv.indexOf("--solo");
const SOLO = i > 0 ? process.argv[i + 1].split(",") : null;
const T = { es: JSON.parse(fs.readFileSync(path.join(__dirname, "es.json"), "utf8")), eu: JSON.parse(fs.readFileSync(path.join(__dirname, "eu.json"), "utf8")) };
for (const k of Object.keys(T.es)) if (!T.eu[k]) { console.error(`Falta el euskera de «${k}»: pasa itzuli.cjs`); process.exit(1); }

const DATOS = { nombre: "Oier Irastorza", tel: "611 49 74 09", telHref: "tel:+34611497409", wa: "https://wa.me/34611497409", correo: "contactoiwebstudio@gmail.com", web: "oiwebstudio.com" };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const CSS = `<style id="oi-firma-css">
.oi-firma{display:block;margin:0;padding:44px 20px 48px;background:#15130f;color:#f4efe6;text-align:center;font:400 15px/1.45 "Switzer",system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;-webkit-font-smoothing:antialiased;position:relative;z-index:1;clear:both}
.oi-firma *{box-sizing:border-box}
.oi-firma .oi-firma__in{max-width:980px;margin:0 auto;padding:0;display:flex;flex-direction:column;align-items:center;gap:18px}
.oi-firma .oi-firma__p{margin:0;padding:0;font-weight:400;font-size:15px;line-height:1.45;font-family:inherit;color:#cfc7b8;text-transform:none;letter-spacing:0}
.oi-firma a.oi-firma__sello{display:inline-flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:6px 14px;margin:0;padding:14px 26px;border-radius:999px;border:1px solid rgba(244,239,230,.3);background:transparent;color:#f4efe6;text-decoration:none;transition:background-color .25s ease,border-color .25s ease,transform .15s ease;-webkit-tap-highlight-color:transparent}
.oi-firma .oi-firma__sello span{font-weight:600;font-size:12px;line-height:1;font-family:inherit;letter-spacing:.14em;text-transform:uppercase;color:#bdb4a4}
.oi-firma .oi-firma__sello b{font-weight:700;font-size:26px;line-height:1;font-family:inherit;letter-spacing:.02em;text-transform:uppercase;color:#fff}
.oi-firma .oi-firma__sello small{font-weight:500;font-size:13px;line-height:1.2;font-family:inherit;color:#e3a57b;text-transform:none;letter-spacing:0}
@media (hover:hover) and (pointer:fine){.oi-firma a.oi-firma__sello:hover{background:rgba(244,239,230,.08);border-color:rgba(244,239,230,.62)}}
.oi-firma a.oi-firma__sello:active{transform:scale(.98)}
.oi-firma .oi-firma__datos{margin:0;padding:0;list-style:none;display:flex;flex-wrap:wrap;justify-content:center;gap:0 22px}
.oi-firma .oi-firma__datos li{margin:0;padding:0;list-style:none;font-weight:400;font-size:14.5px;line-height:1.3;font-family:inherit;color:#f4efe6}
.oi-firma .oi-firma__datos li::before,.oi-firma .oi-firma__datos li::marker{content:none}
.oi-firma .oi-firma__datos a,.oi-firma .oi-firma__datos span{display:inline-flex;align-items:center;min-height:44px;color:#f4efe6;font:inherit;text-transform:none;letter-spacing:0;text-decoration:underline;text-decoration-color:rgba(244,239,230,.35);text-underline-offset:4px;-webkit-tap-highlight-color:transparent}
.oi-firma .oi-firma__datos span{text-decoration:none;color:#cfc7b8}
@media (hover:hover) and (pointer:fine){.oi-firma .oi-firma__datos a:hover{text-decoration-color:#f4efe6}}
.oi-firma a:focus{outline:none}
.oi-firma a:focus-visible{outline:2px solid #f4efe6;outline-offset:3px}
.oi-firma .oi-firma__sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.oi-firma.oi-firma--mv .oi-firma__in>*{opacity:0;transform:translateY(14px);transition:opacity .7s ease,transform .9s cubic-bezier(.2,.75,.25,1)}
.oi-firma.oi-firma--mv .oi-firma__in>*:nth-child(2){transition-delay:.08s}
.oi-firma.oi-firma--mv .oi-firma__in>*:nth-child(3){transition-delay:.16s}
.oi-firma.oi-firma--in .oi-firma__in>*{opacity:1;transform:none}
@media (max-width:600px){.oi-firma{padding:36px 16px 40px}.oi-firma .oi-firma__sello b{font-size:22px}.oi-firma .oi-firma__datos{gap:0 16px}}
@media (prefers-reduced-motion:reduce){.oi-firma.oi-firma--mv .oi-firma__in>*{opacity:1;transform:none;transition:none}.oi-firma a.oi-firma__sello{transition:none}}
</style>`;
const JS = `<script>(function(){var f=document.getElementById("oi-firma");if(!f||!("IntersectionObserver" in window)||matchMedia("(prefers-reduced-motion: reduce)").matches)return;f.classList.add("oi-firma--mv");var o=new IntersectionObserver(function(e){if(e[0].isIntersecting){f.classList.add("oi-firma--in");o.disconnect();}},{rootMargin:"0px 0px -8% 0px"});o.observe(f);})();</script>`;

function bloque(lang, id) {
  const t = T[lang];
  const utm = `https://oiwebstudio.com/?utm_source=muestra-${id}&amp;utm_medium=pie`;
  const nueva = `<span class="oi-firma__sr"> (${esc(t.nueva)})</span>`;
  return `<!-- oi-firma · lo pone herramientas/sitio/firma-muestras/firma.cjs (no editar a mano) -->
${CSS}
<aside class="oi-firma" id="oi-firma" aria-label="${esc(t.aria)}">
<div class="oi-firma__in">
<p class="oi-firma__p">${esc(t.pregunta)}</p>
<a class="oi-firma__sello" href="${utm}" target="_blank" rel="noopener"><span>${esc(t.por)}</span><b>OI STUDIO</b><small>${esc(t.lema)}</small>${nueva}</a>
<ul class="oi-firma__datos">
<li><span>${DATOS.nombre}</span></li>
<li><a href="${DATOS.telHref}">${DATOS.tel}</a></li>
<li><a href="${DATOS.wa}" target="_blank" rel="noopener">WhatsApp${nueva}</a></li>
<li><a href="mailto:${DATOS.correo}">${DATOS.correo}</a></li>
<li><a href="${utm}" target="_blank" rel="noopener">${DATOS.web}${nueva}</a></li>
</ul>
</div>
</aside>
${JS}
<!-- /oi-firma -->`;
}

// Firmas pequeñas de antes: se quitan (y su elemento, si se queda vacío) para que OI Studio no salga dos veces.
const VIEJAS = [
  /(\s*·\s*)?(?:Diseñado por|Diseinatzailea:)(?:\s|&nbsp;)*<a\b[^>]*oiwebstudio\.com[^>]*>\s*OI Studio\s*<\/a>(\s*·\s*)?/g,
  /(\s*·\s*)?<a\b[^>]*oiwebstudio\.com[^>]*>\s*(?:Diseñado por|Diseinatzailea:)\s*<b>OI Studio<\/b>\s*<\/a>(\s*·\s*)?/g,
  /(\s*·\s*)?<a\b[^>]*oiwebstudio\.com[^>]*>\s*(?:Web diseñada por OI Studio|OI Studiok diseinatutako webgunea)\s*<\/a>(\s*·\s*)?/g,
  /(\s*·\s*)?<a\b[^>]*oiwebstudio\.com[^>]*>\s*(?:Muestra de diseño de OI Studio|OI Studio-ren diseinu-lagina|Muestra de OI Studio|OI Studioko lagin-orria)\s*·\s*oiwebstudio\.com\s*<\/a>(\s*·\s*)?/g,
  /(\s*·\s*)?(?:Muestra de OI Studio|OI Studioren lagin bat)\s*·\s*<a\b[^>]*oiwebstudio\.com[^>]*>\s*oiwebstudio\.com\s*<\/a>(\s*·\s*)?/g,
];
function quitarViejas(h) {
  let n = 0;
  for (const re of VIEJAS) h = h.replace(re, (m, antes, despues) => { n++; return antes && despues ? " · " : ""; });
  // elementos que se han quedado vacíos justo donde estaba la firma (p, span, li, div, small) — solo si están completamente vacíos
  h = h.replace(/<(p|span|li|small|div)\b(?![^>]*\bid=)[^>]*class="[^"]*(?:firma|pie-firma|pie__firma|credito|creditos)[^"]*"[^>]*>\s*<\/\1>/g, () => { n++; return ""; });
  h = h.replace(/<(p|li)>\s*<\/\1>/g, (m) => { n++; return ""; });
  return { h, n };
}

let cambiadas = 0, quitadas = 0;
const avisos = [];
for (const carpeta of fs.readdirSync(MUESTRAS)) {
  if (SOLO && !SOLO.includes(carpeta)) continue;
  const dir = path.join(MUESTRAS, carpeta);
  if (!fs.statSync(dir).isDirectory()) continue;
  const id = carpeta.split("-")[0];
  for (const rel of ["index.html", "es/index.html", "eu/index.html"]) {
    const f = path.join(dir, rel);
    if (!fs.existsSync(f)) continue;
    let h = fs.readFileSync(f, "utf8");
    const lang = ((h.match(/<html[^>]*\blang="([a-z]{2})/i) || [])[1] || "es").toLowerCase() === "eu" ? "eu" : "es";
    const a = h.indexOf("<!-- oi-firma"), b = h.indexOf("<!-- /oi-firma -->");
    if (a >= 0 && b > a) h = h.slice(0, a) + h.slice(b + "<!-- /oi-firma -->".length);
    const q = quitarViejas(h); h = q.h; quitadas += q.n;
    const fin = h.lastIndexOf("</body>");
    if (fin < 0) { avisos.push(`${carpeta}/${rel}: sin </body>`); continue; }
    h = h.slice(0, fin).replace(/\s*$/, "\n") + bloque(lang, id) + "\n" + h.slice(fin);
    const antes = fs.readFileSync(f, "utf8");
    if (h !== antes) { cambiadas++; if (!CHECK) fs.writeFileSync(f, h); }
    console.log(`${carpeta}/${rel} (${lang})${q.n ? ` · quitadas ${q.n} firmas viejas` : ""}`);
  }
}
console.log(`${CHECK ? "(--check) cambiarían" : "cambiadas"} ${cambiadas} páginas; firmas viejas quitadas: ${quitadas}`);
if (avisos.length) console.log("AVISOS:\n- " + avisos.join("\n- "));
