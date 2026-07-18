import type { VercelRequest, VercelResponse } from "@vercel/node";
import { execSync } from "child_process";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const adminSecret = req.headers["x-admin-secret"];
  const expectedSecret = process.env.ADMIN_SECRET || "dev-secret-change-me";

  if (adminSecret !== expectedSecret) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    console.log("🚀 Corriendo migraciones...");
    execSync("npx prisma migrate deploy --skip-generate", {
      stdio: "pipe",
      cwd: process.cwd(),
    });
    console.log("✅ Migraciones completadas");

    console.log("🌱 Seedeando base de datos...");
    execSync("npx ts-node prisma/seed.ts", { stdio: "pipe", cwd: process.cwd() });
    console.log("✅ Seed completado");

    return res.status(200).json({
      success: true,
      message: "Database setup completed",
    });
  } catch (err: any) {
    console.error("❌ Error:", err.message);
    return res.status(500).json({
      error: "Setup failed",
      details: err.message,
    });
  }
}
