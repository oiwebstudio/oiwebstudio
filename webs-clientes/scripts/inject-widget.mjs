// Inserta el <script> del widget de reservas en cada demo de webs-clientes.
// Idempotente: si el tag ya está presente, no lo duplica. Volver a ejecutar es seguro
// si index.html se regenera.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const API_BASE = process.env.BOOKING_API_BASE || "https://oi-studio-booking-api.vercel.app";

const SITES = [
  "cafeteria",
  "floristeria",
  "gimnasio",
  "panaderia",
  "peluqueria",
  "restaurante",
  "taller",
  "veterinaria",
];

for (const slug of SITES) {
  const filePath = join(ROOT, slug, "index.html");
  let html;
  try {
    html = readFileSync(filePath, "utf8");
  } catch {
    console.warn(`[inject-widget] no existe ${filePath}, se salta`);
    continue;
  }

  if (html.includes("data-business=\"" + slug + "\"")) {
    console.log(`[inject-widget] ${slug}: ya tiene el widget, sin cambios`);
    continue;
  }

  const tag = `  <script src="${API_BASE}/widget.js" data-business="${slug}" defer></script>\n`;
  const updated = html.replace("</body>", `${tag}</body>`);

  if (updated === html) {
    console.warn(`[inject-widget] ${slug}: no se encontró </body>, se salta`);
    continue;
  }

  writeFileSync(filePath, updated, "utf8");
  console.log(`[inject-widget] ${slug}: widget insertado`);
}
