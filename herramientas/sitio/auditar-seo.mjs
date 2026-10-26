/**
 * Auditoría SEO de oiwebstudio.com en local (la usa cada mañana la tarea seo-diario).
 *
 * Comprueba, sin escribir nada:
 *  - enlaces internos rotos, canonical, páginas indexables fuera del sitemap y
 *    páginas con noindex o redirección dentro del sitemap;
 *  - títulos (> 65 caracteres) y descripciones (> 160) largos, y duplicados;
 *  - JSON-LD que no se puede leer y FAQ del JSON-LD que no coincide con el texto visible;
 *  - restos de la oferta vieja (Web Negocio, reservas sueltas 290 / +190, chatbot como
 *    servicio, 15 €/mes) después de la oferta nueva del 23-24/10/2026.
 * Con --vivo, además: portada y llms.txt en producción con GPTBot y ClaudeBot (tienen que dar 200).
 *
 * Uso (desde la raíz):  node herramientas/sitio/auditar-seo.mjs [--vivo]
 * Sale con código 1 si encuentra algo, para que la tarea lo vea.
 */
import fs from "node:fs";
import path from "node:path";

const WEB = path.resolve("web");
const SALTAR = new Set(["vendor", "assets", "_borradores", "node_modules", "demos", "eu"]);
const problemas = [];
const avisa = (tipo, fichero, detalle = "") => problemas.push([tipo, fichero, detalle]);

const ficheros = [];
(function recorre(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) { if (!SALTAR.has(f)) recorre(p); }
    else if (f.endsWith(".html")) ficheros.push(path.relative(WEB, p).replace(/\\/g, "/"));
  }
})(WEB);

const sitemap = new Set([...fs.readFileSync(path.join(WEB, "sitemap.xml"), "utf8").matchAll(/<loc>https:\/\/oiwebstudio\.com\/([^<]*)<\/loc>/g)].map((m) => m[1]));
const existe = (rel) => fs.existsSync(path.join(WEB, rel)) || fs.existsSync(path.join(WEB, rel, "index.html"));
const limpia = (s) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const largo = (s) => [...s].length;

const VIEJO = [
  [/Web Negocio/, "«Web Negocio» (ahora «Web con secciones»)"],
  [/Web bonita \+ presencia|Landing (desde )?420/i, "«Web bonita + presencia» o «Landing» (desde el 26/10: «Web con secciones» y «Web de una página»)"],
  [/\b290 ?€|290€/, "reservas sueltas a 290 €"],
  [/\+190 ?€/, "reservas o chatbot a +190 €"],
  [/15 ?€\/mes/, "cuota de 15 €/mes"],
  [/chatbot de reservas (responde|si el volumen)/i, "chatbot como servicio"],
];
const SIN_OFERTA = new Set(["chatbot-reservas.html", "widget-n8n-reservas.html", "404.html", "biblioteca.html", "legal.html"]);

const titulos = {}, descripciones = {};
for (const f of ficheros) {
  const t = fs.readFileSync(path.join(WEB, f), "utf8");
  const robots = (t.match(/<meta name="robots" content="([^"]*)"/) || [])[1] || "";
  const redirige = /http-equiv="refresh"/.test(t);
  const noindex = /noindex/.test(robots) || redirige;
  if (/^google[0-9a-f]+\.html$/.test(f)) continue;

  const visible = limpia(t);
  for (const m of t.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let j;
    try { j = JSON.parse(m[1]); } catch (e) { avisa("JSON-LD roto", f, e.message); continue; }
    for (const nodo of j["@graph"] || [j]) {
      if (nodo["@type"] !== "FAQPage") continue;
      for (const q of nodo.mainEntity || []) {
        const pregunta = limpia(q.name || "");
        const respuesta = limpia(q.acceptedAnswer?.text || "");
        if (!visible.includes(pregunta)) avisa("FAQ: pregunta del JSON-LD que no se ve", f, pregunta.slice(0, 70));
        else if (respuesta && !visible.includes(respuesta.slice(0, 60))) avisa("FAQ: respuesta distinta en JSON-LD", f, pregunta.slice(0, 70));
      }
    }
  }

  for (const m of t.matchAll(/href="([^"#?]+)[^"]*"/g)) {
    const h = m[1];
    if (/^(https?:|mailto:|tel:|javascript:|data:|\/\/)/.test(h)) continue;
    const rel = h.startsWith("/") ? h.slice(1) : path.posix.normalize(path.posix.join(path.posix.dirname(f), h));
    if (rel && !rel.startsWith("..") && !existe(rel)) avisa("enlace roto", f, h);
  }

  if (!SIN_OFERTA.has(f) && !noindex) for (const [re, que] of VIEJO) if (re.test(visible)) avisa("oferta vieja", f, que);

  if (noindex) {
    if (sitemap.has(f) || sitemap.has(f.replace(/index\.html$/, ""))) avisa("noindex o redirección dentro del sitemap", f);
    continue;
  }
  const titulo = (t.match(/<title>([^<]*)<\/title>/) || [])[1];
  const desc = (t.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (!titulo) avisa("sin title", f); else { (titulos[titulo] ||= []).push(f); if (largo(titulo) > 65) avisa(`title de ${largo(titulo)} caracteres`, f, titulo); }
  if (!desc) avisa("sin description", f); else { (descripciones[desc] ||= []).push(f); if (largo(desc) > 160) avisa(`description de ${largo(desc)} caracteres`, f); }
  const canonica = (t.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  if (!canonica) avisa("sin canonical", f);
  if (!sitemap.has(f) && !sitemap.has(f.replace(/index\.html$/, ""))) avisa("indexable fuera del sitemap", f);
}
for (const [k, v] of Object.entries(titulos)) if (v.length > 1) avisa("title duplicado", v.join(" "), k);
for (const [k, v] of Object.entries(descripciones)) if (v.length > 1) avisa("description duplicada", v.join(" "), k.slice(0, 60));

if (process.argv.includes("--vivo")) {
  const pruebas = [["https://oiwebstudio.com/", "Mozilla/5.0"], ["https://oiwebstudio.com/llms.txt", "GPTBot"], ["https://oiwebstudio.com/llms.txt", "ClaudeBot"], ["https://oiwebstudio.com/sitemap.xml", "Googlebot"]];
  for (const [url, ua] of pruebas) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": ua }, redirect: "follow" });
      if (r.status !== 200) avisa(`en vivo: ${r.status}`, url, ua);
    } catch (e) { avisa("en vivo: sin respuesta", url, `${ua} ${e.message}`); }
  }
}

for (const [tipo, f, d] of problemas) console.log(`${tipo} | ${f}${d ? " | " + d : ""}`);
console.log(`\npáginas: ${ficheros.length} · sitemap: ${sitemap.size} · problemas: ${problemas.length}`);
process.exitCode = problemas.length ? 1 : 0;
