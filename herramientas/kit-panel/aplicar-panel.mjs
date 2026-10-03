/**
 * Conecta el panel del cliente a una web hecha con generar-demo.mjs.
 *
 *   node herramientas/kit-panel/aplicar-panel.mjs <carpeta-web> --slug har-ta-jan [--modo prueba|real]
 *
 * Qué hace (y se puede repetir sin duplicar nada: todo va entre marcas):
 *   1. Antes del bloque DATOS, carga los datos que el cliente ha guardado:
 *        prueba → del navegador (localStorage), para enseñarlo en la demo
 *        real   → de /api/datos (Cloudflare Pages Functions + KV, con PIN)
 *   2. Justo después de DATOS, los mezcla encima: lo del panel manda.
 *   3. Pinta el "aviso" (vacaciones, cierres…) bajo el estado de abierto/cerrado.
 *   4. Escribe <carpeta-web>/panel/index.html con los valores de partida.
 *
 * En modo real hay que copiar también herramientas/kit-panel/functions/ a la raíz de
 * lo que se publica en Pages (ver LEEME.md).
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const aqui = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const carpeta = args[0];
const opcion = (n, def) => { const i = args.indexOf("--" + n); return i > 0 ? args[i + 1] : def; };
const slug = opcion("slug");
const modo = opcion("modo", "prueba");
if (!carpeta || !slug || !["prueba", "real"].includes(modo)) {
  console.error("Uso: node herramientas/kit-panel/aplicar-panel.mjs <carpeta-web> --slug <slug> [--modo prueba|real]");
  process.exit(1);
}

const F = path.join(carpeta, "index.html");
let s = fs.readFileSync(F, "utf8");

// ── Quitar lo de una pasada anterior ────────────────────────────────────────
s = s.replace(/<!-- panel-cliente:[a-z]+ -->[\s\S]*?<!-- \/panel-cliente -->\n?/g, "");
s = s.replace(/\n\/\* panel-cliente:mezcla \*\/[^\n]*\n[^\n]*\n/, "\n");

// ── Leer DATOS tal cual está en la web ─────────────────────────────────────
const ini = s.indexOf("const DATOS = {");
if (ini < 0) throw new Error("No encuentro «const DATOS = {» en " + F);
const fin = s.indexOf("\n};", ini) + 3;
const DATOS = vm.runInNewContext("(" + s.slice(ini + "const DATOS = ".length, fin - 1) + ")");

// ── 1. Cargar los datos guardados, antes del <script> de DATOS ─────────────
const inicioScript = s.lastIndexOf("<script>", ini);
const cargador = modo === "real"
  ? `<!-- panel-cliente:carga -->\n<script src="/api/datos"></script>\n<!-- /panel-cliente -->\n`
  : `<!-- panel-cliente:carga -->\n<script>\n/* Demo: lo que se guarde en /panel/ se ve en este navegador. */\ntry { var v = localStorage.getItem(${JSON.stringify("panel:" + slug)}); if (v) window.DATOS_VIVOS = JSON.parse(v); } catch (e) {}\n</script>\n<!-- /panel-cliente -->\n`;
s = s.slice(0, inicioScript) + cargador + s.slice(inicioScript);

// ── 2. Mezclarlos encima de DATOS ──────────────────────────────────────────
const fin2 = s.indexOf("\n};", s.indexOf("const DATOS = {")) + 3;
s = s.slice(0, fin2) +
  "\n/* panel-cliente:mezcla */ /* lo que el negocio cambia desde su panel manda sobre lo de arriba */\n" +
  "if (window.DATOS_VIVOS) Object.assign(DATOS, window.DATOS_VIVOS);\n" +
  s.slice(fin2);

// ── 3. El aviso ────────────────────────────────────────────────────────────
const aviso = `<!-- panel-cliente:aviso -->
<style>
.aviso-panel{display:flex;gap:10px;align-items:flex-start;margin:14px 0 0;padding:12px 14px;border-radius:12px;
  background:var(--tomate-fondo,#FFF1E6);color:#3B1A0C;border:1px solid var(--tomate-claro,#F2CDBB);
  font-size:15px;line-height:1.4;max-width:34rem;margin:0 0 18px;}
.aviso-panel::before{content:"!";flex:0 0 22px;height:22px;border-radius:50%;display:grid;place-items:center;
  background:var(--tomate,#B8441E);color:#fff;font-weight:700;font-size:13px;}
</style>
<script>
(function(){
  if(typeof DATOS === "undefined") return;

  /* El precio del menú también está escrito tal cual en la portada ("12 €",
     "12€"): si el negocio lo cambia en el panel, se cambia ahí también. */
  var antes = ${JSON.stringify(String(DATOS.menuPrecio ?? ""))}, ahora = (DATOS.menuPrecio || "").trim();
  var main = document.querySelector("main");
  if(antes && ahora && ahora !== antes && main){
    var pegado = antes.replace(/\\s+/g, ""), nuevoPegado = ahora.replace(/\\s+/g, "");
    var w = document.createTreeWalker(main, NodeFilter.SHOW_TEXT), n;
    while((n = w.nextNode())){
      var v = n.nodeValue;
      if(v.indexOf(antes) > -1) n.nodeValue = v.split(antes).join(ahora);
      else if(v.indexOf(pegado) > -1) n.nodeValue = v.split(pegado).join(nuevoPegado);
    }
  }

  /* El aviso va arriba del todo de la portada, antes del titular. */
  var t = (DATOS.aviso || "").trim();
  if(!t) return;
  var p = document.createElement("p");
  p.className = "aviso-panel"; p.setAttribute("role","status");
  p.textContent = t; // texto, nunca HTML
  var h1 = document.querySelector("main h1");
  if(h1 && h1.parentElement) h1.parentElement.insertBefore(p, h1.parentElement.firstElementChild);
  else if(main) main.prepend(p);
})();
</script>
<!-- /panel-cliente -->
`;
s = s.replace(/<\/body>/i, aviso + "</body>");
fs.writeFileSync(F, s);

// ── 4. La página del panel ────────────────────────────────────────────────
const abiertos = [1, 2, 3, 4, 5, 6, 0].filter((d) => DATOS.horario?.[d]);
const menuDia = {};
for (let d = 0; d <= 6; d++) menuDia[d] = DATOS.menuDia?.[d] ?? null;
const config = {
  slug,
  modo,
  web: "../",
  dias: abiertos.length ? abiertos : [1, 2, 3, 4, 5, 6],
  inicial: { aviso: "", menuPrecio: DATOS.menuPrecio ?? "", menuIncluye: DATOS.menuIncluye ?? "", menuDia },
};
const acento = (s.match(/--acento:\s*(#[0-9a-fA-F]{3,8})/) || [])[1] || "#2E5E3E";
const escaparHtml = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const panel = fs.readFileSync(path.join(aqui, "panel.html"), "utf8")
  .replaceAll("__NOMBRE__", escaparHtml(DATOS.nombre))
  .replace("__ACENTO__", acento)
  .replace("__CONFIG__", JSON.stringify(config, null, 2).replace(/</g, "\\u003c"));
fs.mkdirSync(path.join(carpeta, "panel"), { recursive: true });
fs.writeFileSync(path.join(carpeta, "panel", "index.html"), panel);

console.log(`Panel (${modo}) conectado a ${F}`);
console.log(`  · días con horario: ${config.dias.join(", ")} · acento ${acento}`);
console.log(`  · ${path.join(carpeta, "panel", "index.html")}`);
