/** Auditoría técnica del sitio: enlaces rotos, duplicados y problemas de SEO/rendimiento. */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("web");
const pages = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (["assets", "node_modules", ".git"].includes(e.name)) continue;
      walk(p);
    } else if (e.name.endsWith(".html")) pages.push(p);
  }
})(ROOT);

const rel = (p) => path.relative(ROOT, p).replace(/\\/g, "/");
const read = (p) => fs.readFileSync(p, "utf8");

const titles = new Map();
const descs = new Map();
const problems = { rotos: [], sinTitle: [], sinDesc: [], descLarga: [], titleLargo: [], sinAlt: [], sinDim: [], sinCanonical: [], jsonldRoto: [] };

for (const p of pages) {
  const html = read(p);
  const r = rel(p);
  const esPuente = /http-equiv="refresh"/.test(html);

  const t = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
  const d = html.match(/<meta name="description" content="([^"]*)"/)?.[1]?.trim();

  if (!esPuente) {
    if (!t) problems.sinTitle.push(r);
    else {
      titles.set(t, [...(titles.get(t) || []), r]);
      if (t.length > 65) problems.titleLargo.push(`${r} (${t.length})`);
    }
    if (!d) problems.sinDesc.push(r);
    else {
      descs.set(d, [...(descs.get(d) || []), r]);
      if (d.length > 165) problems.descLarga.push(`${r} (${d.length})`);
    }
    if (!/rel="canonical"/.test(html)) problems.sinCanonical.push(r);
  }

  // JSON-LD válido
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { problems.jsonldRoto.push(`${r}: ${e.message.slice(0, 60)}`); }
  }

  // Imágenes sin alt / sin dimensiones (CLS)
  for (const m of html.matchAll(/<img\s[^>]*>/g)) {
    const tag = m[0];
    if (!/\salt=/.test(tag)) problems.sinAlt.push(`${r}: ${tag.slice(0, 70)}`);
    if (!/\swidth=/.test(tag) || !/\sheight=/.test(tag)) problems.sinDim.push(r);
  }

  // Enlaces internos rotos
  for (const m of html.matchAll(/(?:href|src)="([^"#][^"]*)"/g)) {
    let href = m[1];
    if (/^(https?:|mailto:|tel:|data:|\/\/)/.test(href)) continue;
    href = href.split("#")[0].split("?")[0];
    if (!href) continue;
    const dest = href.startsWith("/")
      ? path.join(ROOT, href)
      : path.resolve(path.dirname(p), href);
    if (!fs.existsSync(dest)) problems.rotos.push(`${r} -> ${href}`);
  }
}

const dupT = [...titles].filter(([, v]) => v.length > 1);
const dupD = [...descs].filter(([, v]) => v.length > 1);

console.log(`páginas analizadas: ${pages.length}\n`);
const show = (label, arr, limit = 8) => {
  if (!arr.length) return console.log(`✓ ${label}: ninguno`);
  console.log(`✗ ${label}: ${arr.length}`);
  arr.slice(0, limit).forEach((x) => console.log(`    ${x}`));
  if (arr.length > limit) console.log(`    …y ${arr.length - limit} más`);
};
show("enlaces internos rotos", [...new Set(problems.rotos)]);
show("sin <title>", problems.sinTitle);
show("sin meta description", problems.sinDesc);
show("títulos duplicados", dupT.map(([k, v]) => `"${k.slice(0, 45)}…" en ${v.length}: ${v.slice(0, 3).join(", ")}`));
show("descripciones duplicadas", dupD.map(([k, v]) => `"${k.slice(0, 45)}…" en ${v.length}: ${v.slice(0, 3).join(", ")}`));
show("title > 65 car.", problems.titleLargo, 5);
show("description > 165 car.", problems.descLarga, 5);
show("sin canonical", problems.sinCanonical);
show("JSON-LD inválido", problems.jsonldRoto);
show("imágenes sin alt", problems.sinAlt, 5);
show("imágenes sin width/height (CLS)", [...new Set(problems.sinDim)], 5);
