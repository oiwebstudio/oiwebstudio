import { execSync } from "child_process";
import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("❌ ERROR: DATABASE_URL no está configurada.");
    console.error("Asegúrate de que .env.local contiene DATABASE_URL");
    process.exit(1);
  }

  console.log("🚀 Configurando base de datos...\n");

  try {
    console.log("1️⃣  Corriendo migraciones de Prisma...");
    execSync("npx prisma migrate deploy", { stdio: "inherit", env: { ...process.env } });
    console.log("✅ Migraciones completadas\n");
  } catch (err) {
    console.error("❌ Error en migraciones:", err.message);
    process.exit(1);
  }

  try {
    console.log("2️⃣  Seedeando base de datos...");
    execSync("npx ts-node prisma/seed.ts", { stdio: "inherit" });
    console.log("✅ Seed completado\n");
  } catch (err) {
    console.error("❌ Error en seed:", err.message);
    process.exit(1);
  }

  console.log("🎉 Base de datos lista!");
  console.log("\nAhora probá el chatbot en:");
  console.log("https://oi-studio-booking-api-delta.vercel.app/widget.js");
}

main();
