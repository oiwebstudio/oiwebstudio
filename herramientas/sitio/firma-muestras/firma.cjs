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
.oi-firma{display:block;margin:0;padding:0;background:#121110;color:#ece7de;text-align:left;font:400 15px/1.5 "Switzer",system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;-webkit-font-smoothing:antialiased;position:relative;z-index:1;clear:both;border-top:1px solid rgba(236,231,222,.08)}
.oi-firma *{box-sizing:border-box}
.oi-firma .oi-firma__in{max-width:1180px;margin:0 auto;padding:48px 32px 40px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:36px 56px;align-items:end}
.oi-firma .oi-firma__marca{margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
.oi-firma .oi-firma__por{margin:0;font-weight:500;font-size:11px;line-height:1;letter-spacing:.2em;text-transform:uppercase;color:#8f877b}
.oi-firma a.oi-firma__logo{display:inline-block;align-self:flex-start;margin:0;padding:0;color:#fff;text-decoration:none;font-weight:700;font-size:clamp(30px,3.4vw,44px);line-height:.95;letter-spacing:.04em;text-transform:uppercase;-webkit-tap-highlight-color:transparent;transition:opacity .2s ease}
.oi-firma .oi-firma__lema{margin:0;font-weight:400;font-size:15px;line-height:1.4;color:#cfc8bc;text-transform:none;letter-spacing:0}
.oi-firma .oi-firma__datos{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(4,auto);gap:0 36px}
.oi-firma .oi-firma__datos li{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px}
.oi-firma .oi-firma__datos li::before,.oi-firma .oi-firma__datos li::marker{content:none}
.oi-firma .oi-firma__k{font-weight:500;font-size:11px;line-height:1;letter-spacing:.18em;text-transform:uppercase;color:#8f877b}
.oi-firma .oi-firma__datos a{display:inline-flex;align-items:center;min-height:32px;color:#ece7de;text-decoration:none;font-weight:500;font-size:15px;line-height:1.3;text-transform:none;letter-spacing:0;border-bottom:1px solid rgba(236,231,222,.22);transition:border-color .2s ease,color .2s ease;-webkit-tap-highlight-color:transparent}
.oi-firma .oi-firma__pie{grid-column:1/-1;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px 24px;margin:0;padding:22px 0 0;border-top:1px solid rgba(236,231,222,.12)}
.oi-firma .oi-firma__nota{margin:0;font-weight:400;font-size:13.5px;line-height:1.4;color:#8f877b;text-transform:none;letter-spacing:0}
.oi-firma a.oi-firma__cta{display:inline-flex;align-items:center;gap:10px;min-height:46px;margin:0;padding:0 22px;border-radius:999px;background:#ece7de;color:#121110;text-decoration:none;font-weight:600;font-size:14.5px;line-height:1;letter-spacing:0;text-transform:none;transition:background-color .2s ease,transform .15s ease;-webkit-tap-highlight-color:transparent}
.oi-firma a.oi-firma__cta svg{width:16px;height:16px;flex:none}
@media (hover:hover) and (pointer:fine){.oi-firma a.oi-firma__logo:hover{opacity:.82}.oi-firma .oi-firma__datos a:hover{border-color:#ece7de;color:#fff}.oi-firma a.oi-firma__cta:hover{background:#fff}}
.oi-firma a.oi-firma__cta:active{transform:scale(.97)}
.oi-firma a:focus{outline:none}
.oi-firma a:focus-visible{outline:2px solid #ece7de;outline-offset:4px}
.oi-firma .oi-firma__sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.oi-firma.oi-firma--mv .oi-firma__in>*{opacity:0;transform:translateY(14px);transition:opacity .7s ease,transform .9s cubic-bezier(.2,.75,.25,1)}
.oi-firma.oi-firma--mv .oi-firma__in>*:nth-child(2){transition-delay:.08s}
.oi-firma.oi-firma--mv .oi-firma__in>*:nth-child(3){transition-delay:.16s}
.oi-firma.oi-firma--in .oi-firma__in>*{opacity:1;transform:none}
@media (max-width:980px){.oi-firma .oi-firma__in{grid-template-columns:1fr;align-items:start;gap:32px}.oi-firma .oi-firma__datos{grid-template-columns:repeat(2,minmax(0,1fr));gap:22px 24px}}
@media (max-width:600px){.oi-firma .oi-firma__in{padding:40px 20px 32px}.oi-firma .oi-firma__datos{grid-template-columns:1fr 1fr;gap:18px 20px}.oi-firma .oi-firma__datos li:nth-child(n+3){grid-column:1/-1}.oi-firma .oi-firma__datos a{align-self:flex-start}.oi-firma .oi-firma__datos a{min-height:44px;font-size:16px}.oi-firma a.oi-firma__cta{width:100%;justify-content:center;min-height:50px}}
@media (prefers-reduced-motion:reduce){.oi-firma.oi-firma--mv .oi-firma__in>*{opacity:1;transform:none;transition:none}.oi-firma a{transition:none}}
</style>`;
const JS = `<script>(function(){var f=document.getElementById("oi-firma");if(!f||!("IntersectionObserver" in window)||matchMedia("(prefers-reduced-motion: reduce)").matches)return;f.classList.add("oi-firma--mv");var o=new IntersectionObserver(function(e){if(e[0].isIntersecting){f.classList.add("oi-firma--in");o.disconnect();}},{rootMargin:"0px 0px -8% 0px"});o.observe(f);})();</script>`;
const WA_ICONO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>';

function bloque(lang, id) {
  const t = T[lang];
  const utm = `https://oiwebstudio.com/?utm_source=muestra-${id}&amp;utm_medium=pie`;
  const nueva = `<span class="oi-firma__sr"> (${esc(t.nueva)})</span>`;
  const wa = `${DATOS.wa}?text=${encodeURIComponent(t.wa_msg)}`;
  return `<!-- oi-firma · lo pone herramientas/sitio/firma-muestras/firma.cjs (no editar a mano) -->
${CSS}
<aside class="oi-firma" id="oi-firma" aria-label="${esc(t.aria)}">
<div class="oi-firma__in">
<div class="oi-firma__marca">
<p class="oi-firma__por">${esc(t.por)}</p>
<a class="oi-firma__logo" href="${utm}" target="_blank" rel="noopener">OI STUDIO${nueva}</a>
<p class="oi-firma__lema">${esc(t.lema)} · ${DATOS.nombre}</p>
</div>
<ul class="oi-firma__datos">
<li><span class="oi-firma__k">${esc(t.telefono)}</span><a href="${DATOS.telHref}">${DATOS.tel}</a></li>
<li><span class="oi-firma__k">WhatsApp</span><a href="${wa}" target="_blank" rel="noopener">${DATOS.tel}${nueva}</a></li>
<li><span class="oi-firma__k">${esc(t.correo)}</span><a href="mailto:${DATOS.correo}">${DATOS.correo}</a></li>
<li><span class="oi-firma__k">${esc(t.web)}</span><a href="${utm}" target="_blank" rel="noopener">${DATOS.web}${nueva}</a></li>
</ul>
<div class="oi-firma__pie">
<p class="oi-firma__nota">${esc(t.nota)}</p>
<a class="oi-firma__cta" href="${wa}" target="_blank" rel="noopener">${WA_ICONO}${esc(t.cta)}${nueva}</a>
</div>
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
