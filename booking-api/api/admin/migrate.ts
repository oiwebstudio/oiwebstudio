import type { VercelRequest, VercelResponse } from "@vercel/node";
import { PrismaClient } from "@prisma/client";
import { seedAll } from "../../prisma/seed.js";

const DDL_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS businesses (
    id text PRIMARY KEY,
    slug text UNIQUE NOT NULL,
    name text NOT NULL,
    category text,
    phone text,
    whatsapp_number text,
    opening_hours text,
    timezone text NOT NULL DEFAULT 'Europe/Madrid',
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS booking_configs (
    id text PRIMARY KEY,
    business_id text UNIQUE NOT NULL REFERENCES businesses(id),
    slot_interval_minutes int NOT NULL DEFAULT 30,
    capacity int NOT NULL DEFAULT 1,
    lead_time_minutes int NOT NULL DEFAULT 60,
    max_advance_days int NOT NULL DEFAULT 30,
    whatsapp_enabled boolean NOT NULL DEFAULT false,
    whatsapp_phone_number_id text,
    whatsapp_verify_token text,
    whatsapp_access_token text,
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS services (
    id text PRIMARY KEY,
    business_id text NOT NULL REFERENCES businesses(id),
    name text NOT NULL,
    duration_minutes int NOT NULL,
    price_label text,
    capacity int,
    active boolean NOT NULL DEFAULT true,
    sort_order int NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS services_business_id_idx ON services(business_id)`,
  `CREATE TABLE IF NOT EXISTS customers (
    id text PRIMARY KEY,
    business_id text NOT NULL REFERENCES businesses(id),
    name text NOT NULL,
    phone text NOT NULL,
    email text,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(business_id, phone)
  )`,
  `CREATE TABLE IF NOT EXISTS bookings (
    id text PRIMARY KEY,
    business_id text NOT NULL REFERENCES businesses(id),
    service_id text NOT NULL REFERENCES services(id),
    customer_id text NOT NULL REFERENCES customers(id),
    starts_at timestamptz NOT NULL,
    ends_at timestamptz NOT NULL,
    status text NOT NULL DEFAULT 'CONFIRMED',
    source text NOT NULL DEFAULT 'WEB',
    notes text,
    chat_session_id text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS bookings_business_id_starts_at_idx ON bookings(business_id, starts_at)`,
  `CREATE TABLE IF NOT EXISTS chat_sessions (
    id text PRIMARY KEY,
    business_id text NOT NULL REFERENCES businesses(id),
    channel text NOT NULL,
    external_user_id text,
    state text NOT NULL,
    status text NOT NULL DEFAULT 'ACTIVE',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS chat_sessions_lookup_idx ON chat_sessions(business_id, channel, external_user_id)`,
  `CREATE TABLE IF NOT EXISTS messages (
    id text PRIMARY KEY,
    chat_session_id text NOT NULL REFERENCES chat_sessions(id),
    role text NOT NULL,
    text text NOT NULL,
    payload text,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS messages_chat_session_id_idx ON messages(chat_session_id)`,
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const adminSecret = req.headers["x-admin-secret"];
  const expectedSecret = process.env.ADMIN_SECRET || "dev-secret-change-me";

  if (adminSecret !== expectedSecret) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const prisma = new PrismaClient();

  try {
    for (const sql of DDL_STATEMENTS) {
      await prisma.$executeRawUnsafe(sql);
    }
    await seedAll(prisma);
    const count = await prisma.business.count();
    return res.status(200).json({ success: true, message: "Tablas creadas y seed aplicado", businesses: count });
  } catch (err: any) {
    return res.status(500).json({ error: "Setup failed", details: err.message });
  } finally {
    await prisma.$disconnect();
  }
}
