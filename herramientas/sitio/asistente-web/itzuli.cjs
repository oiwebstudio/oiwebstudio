// Pasa por Itzultzaile Neuronala (es → eu) los textos del botón del asistente con IA en oiwebstudio.com (es.json) que aún no están en eu.json.
// de nuevos.json que aún no están en eu.json, con el navegador común (turno, sin GPU). Nunca euskera a ojo (Oier, 18/10).
// Guarda lo que entra y sale en euskera/entradaN.txt y salidaN.txt.
// Uso: node herramientas/sitio/sectores/itzuli.cjs [--todo]   (--todo vuelve a traducir también lo ya traducido)
const { conNavegador } = require("C:/tmp/oi-navegador.cjs");
const fs = require("fs");
const path = require("path");
const textosES = () => JSON.parse(fs.readFileSync(path.join(__dirname, "es.json"), "utf8"));

const AQUI = __dirname;
const SALIDA = path.join(AQUI, "eu.json");
const previo = fs.existsSync(SALIDA) ? JSON.parse(fs.readFileSync(SALIDA, "utf8")) : {};
const ES = textosES();
const todo = process.argv.includes("--todo");
const claves = Object.keys(ES).filter((k) => todo || !previo[k]);
if (!claves.length) { console.log("Nada nuevo que traducir."); process.exit(0); }
const DIR = path.join(AQUI, "euskera");
fs.mkdirSync(DIR, { recursive: true });
let n = 1; while (fs.existsSync(path.join(DIR, `entrada${n}.txt`))) n++;

conNavegador(async (b) => {
  const p = await b.newPage({ locale: "es-ES" });
  await p.goto("https://www.euskadi.eus/itzuli/", { waitUntil: "networkidle", timeout: 90000 });
  for (const sel of ["#aceptarModalLabel", "button:has-text('Aceptar')", "button:has-text('Onartu')"]) { try { await p.click(sel, { timeout: 1500 }); } catch {} }
  try { await p.selectOption("#model", "es2eu"); } catch (e) { console.log("sin selector de modelo:", e.message.split("\n")[0]); }
  const leer = () => p.evaluate(() => {
    for (const s of ["#translation_text", "#translated0"]) { const e = document.querySelector(s); if (e && e.innerText.trim()) return e.innerText; }
    return "";
  });
  const traducir = async (texto) => {
    await p.fill("#text_input", "");
    await p.evaluate(() => { for (const s of ["#translation_text", "#translated0"]) { const e = document.querySelector(s); if (e) e.innerText = ""; } });
    await p.fill("#text_input", texto);
    await p.click("#btn_translate");
    await p.waitForFunction(() => ["#translation_text", "#translated0"].some((s) => (document.querySelector(s)?.innerText || "").trim().length > 0), null, { timeout: 60000 });
    await p.waitForTimeout(600);
    return (await leer()).trim();
  };
  const EU = { ...previo };
  const tandas = []; let t = [];
  for (const k of claves) { if (t.length >= 12) { tandas.push(t); t = []; } t.push(k); }
  if (t.length) tandas.push(t);
  const entra = [], sale = [];
  for (const tanda of tandas) {
    const res = (await traducir(tanda.map((k) => ES[k]).join("\n"))).split(/\n+/).map((s) => s.trim()).filter(Boolean);
    if (res.length === tanda.length) tanda.forEach((k, m) => { EU[k] = res[m]; entra.push(k + "\t" + ES[k]); sale.push(k + "\t" + res[m]); });
    else for (const k of tanda) { const r = await traducir(ES[k]); EU[k] = r; entra.push(k + "\t" + ES[k]); sale.push(k + "\t" + r); }
    console.log(`tanda de ${tanda.length}: ${res.length === tanda.length ? "ok" : "uno a uno"}`);
  }
  fs.writeFileSync(path.join(DIR, `entrada${n}.txt`), entra.join("\n") + "\n");
  fs.writeFileSync(path.join(DIR, `salida${n}.txt`), sale.join("\n") + "\n");
  fs.writeFileSync(SALIDA, JSON.stringify(EU, null, 1) + "\n");
  console.log("eu.json:", Object.keys(EU).length, "textos · euskera/salida" + n + ".txt");
}, "itzuli firma").catch((e) => { console.error(e); process.exit(1); });
