// Inserta el <script> del widget de reservas en cada demo de webs-clientes,
// con los colores, la etiqueta y las FAQs contextuales de cada negocio.
// Idempotente: si el tag ya está presente, lo REEMPLAZA (para propagar cambios de
// color/label/faq). Volver a ejecutar es seguro si index.html se regenera.
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const API_BASE = process.env.BOOKING_API_BASE || "https://oi-studio-booking-api-delta.vercel.app";

// accent/ink = colores tomados del :root de cada web · label = texto del botón lanzador.
const SITES = {
  gimnasio:    { accent: "#d7ff3e", ink: "#0b0b0d", label: "Tu día de prueba gratis" },
  panaderia:   { accent: "#c07a35", ink: "#2c231b", label: "Hacer un encargo" },
  floristeria: { accent: "#6f7d64", ink: "#43373a", label: "Encarga tus flores" },
  cafeteria:   { accent: "#b07d4f", ink: "#2f2119", label: "Reserva tu mesa" },
  restaurante: { accent: "#d4552b", ink: "#161210", label: "Reservar mesa" },
  peluqueria:  { accent: "#cfa96b", ink: "#111013", label: "Pide tu cita" },
  taller:      { accent: "#ffb400", ink: "#101418", label: "Pide presupuesto" },
  veterinaria: { accent: "#2ba8a4", ink: "#26333f", label: "Pide cita" },
};

for (const [slug, cfg] of Object.entries(SITES)) {
  const filePath = join(ROOT, slug, "index.html");
  let html;
  try {
    html = readFileSync(filePath, "utf8");
  } catch {
    console.warn(`[inject-widget] no existe ${filePath}, se salta`);
    continue;
  }

  const block =
    `  <script src="../scripts/oib-faq.js" data-business="${slug}"></script>\n` +
    `  <script src="${API_BASE}/widget.js" data-business="${slug}"` +
    ` data-accent="${cfg.accent}" data-ink="${cfg.ink}" data-label="${cfg.label}" defer></script>\n`;

  // Si ya existe cualquier variante del bloque (faq + widget), reemplázala entera.
  const existing = new RegExp(
    `([ \\t]*<script src="[^"]*oib-faq\\.js"[^>]*></script>\\s*)?` +
    `[ \\t]*<script src="[^"]*/widget\\.js" data-business="${slug}"[^>]*></script>\\n?`
  );

  let updated;
  if (existing.test(html)) {
    updated = html.replace(existing, block);
  } else {
    updated = html.replace("</body>", `${block}</body>`);
    if (updated === html) {
      console.warn(`[inject-widget] ${slug}: no se encontró </body>, se salta`);
      continue;
    }
  }

  if (updated === html) {
    console.log(`[inject-widget] ${slug}: sin cambios`);
  } else {
    writeFileSync(filePath, updated, "utf8");
    console.log(`[inject-widget] ${slug}: widget actualizado`);
  }
}
