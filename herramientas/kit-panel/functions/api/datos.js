/**
 * API del panel del cliente (Cloudflare Pages Functions).
 *
 *   GET  /api/datos        → JavaScript: window.DATOS_VIVOS = {...};  (lo carga la web)
 *   GET  /api/datos?json   → los mismos datos en JSON                (lo carga el panel)
 *   POST /api/datos        → { pin, datos? } guarda; sin `datos`, solo comprueba el PIN
 *
 * Necesita en el proyecto de Pages:
 *   - un KV enlazado como PANEL
 *   - la variable secreta PANEL_PIN
 *
 * Solo se guardan las claves de la lista blanca, y todo el texto pasa por
 * `limpiar`: la web pinta los platos con innerHTML, así que aquí no entra ni
 * un < ni un >.
 */

const CLAVES = ["aviso", "menuPrecio", "menuIncluye", "menuDia"];
const MAX_TEXTO = 300;
const MAX_LISTA = 15;
const MAX_FALLOS = 5; // por IP, cada 15 minutos

function limpiarTexto(v) {
  return String(v ?? "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, MAX_TEXTO);
}

function limpiarLista(v) {
  if (!Array.isArray(v)) return [];
  return v.map(limpiarTexto).filter(Boolean).slice(0, MAX_LISTA);
}

function limpiarMenuDia(v) {
  const out = {};
  for (let d = 0; d <= 6; d++) {
    const m = v && v[d];
    out[d] = m && typeof m === "object"
      ? { primeros: limpiarLista(m.primeros), segundos: limpiarLista(m.segundos), postres: limpiarLista(m.postres) }
      : null;
  }
  return out;
}

function limpiar(datos) {
  const out = {};
  for (const k of CLAVES) {
    if (!(k in (datos || {}))) continue;
    out[k] = k === "menuDia" ? limpiarMenuDia(datos[k]) : limpiarTexto(datos[k]);
  }
  return out;
}

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

export async function onRequestGet({ env, request }) {
  const datos = (await env.PANEL.get("datos")) || "null";
  if (new URL(request.url).searchParams.has("json")) {
    return new Response(datos, { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
  }
  return new Response(`window.DATOS_VIVOS=${datos};`, {
    // 30 s: lo bastante corto para que el cliente vea su cambio casi al momento.
    headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": "public, max-age=30" },
  });
}

export async function onRequestPost({ env, request }) {
  if (!env.PANEL_PIN) return json({ error: "El panel no tiene PIN configurado." }, 500);

  const ip = request.headers.get("cf-connecting-ip") || "desconocida";
  const claveFallos = "fallos:" + ip;
  const fallos = Number((await env.PANEL.get(claveFallos)) || 0);
  if (fallos >= MAX_FALLOS) return json({ error: "Demasiados intentos. Prueba otra vez dentro de 15 minutos." }, 429);

  const body = await request.json().catch(() => null);
  if (!body || String(body.pin ?? "") !== String(env.PANEL_PIN)) {
    await env.PANEL.put(claveFallos, String(fallos + 1), { expirationTtl: 900 });
    return json({ error: "PIN incorrecto." }, 401);
  }

  if (body.datos === undefined) return json({ ok: true });

  const actual = JSON.parse((await env.PANEL.get("datos")) || "{}");
  const nuevo = { ...actual, ...limpiar(body.datos), actualizado: new Date().toISOString() };
  await env.PANEL.put("datos", JSON.stringify(nuevo));
  return json({ ok: true, datos: nuevo });
}
