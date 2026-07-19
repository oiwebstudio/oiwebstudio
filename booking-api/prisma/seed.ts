import { PrismaClient } from "@prisma/client";

interface SeedService {
  name: string;
  durationMinutes: number;
  priceLabel?: string;
}

interface SeedBusiness {
  slug: string;
  name: string;
  category: string;
  openingHours: string;
  capacity: number;
  services: SeedService[];
}

const BUSINESSES: SeedBusiness[] = [
  {
    slug: "cafeteria",
    name: "Madera Café",
    category: "cafeteria",
    openingHours: "Mo-Fr 08:00-21:00; Sa-Su 10:00-22:00",
    capacity: 4,
    services: [
      { name: "Mesa para 2", durationMinutes: 60 },
      { name: "Mesa para 4", durationMinutes: 60 },
      { name: "Sala privada (grupos)", durationMinutes: 90 },
    ],
  },
  {
    slug: "floristeria",
    name: "Lore Floristería",
    category: "floristeria",
    openingHours: "Mo-Sa 09:30-13:30,16:30-20:00",
    capacity: 1,
    services: [
      { name: "Recogida de encargo", durationMinutes: 15 },
      { name: "Asesoría ramo a medida", durationMinutes: 30, priceLabel: "desde 25€" },
    ],
  },
  {
    slug: "gimnasio",
    name: "IRONPULSE",
    category: "gimnasio",
    openingHours: "Mo-Su 00:00-24:00",
    capacity: 3,
    services: [
      { name: "Clase dirigida (prueba)", durationMinutes: 45 },
      { name: "Sesión con entrenador personal", durationMinutes: 60, priceLabel: "desde 35€" },
    ],
  },
  {
    slug: "panaderia",
    name: "Errotaberri",
    category: "panaderia",
    openingHours: "Mo-Sa 07:00-14:00,17:00-20:30",
    capacity: 2,
    services: [
      { name: "Encargo tarta especial", durationMinutes: 15 },
      { name: "Recogida de pedido grande", durationMinutes: 15 },
    ],
  },
  {
    slug: "peluqueria",
    name: "Studio Noir",
    category: "peluqueria",
    openingHours: "Tu-Fr 10:00-20:00; Sa 09:00-19:00",
    capacity: 2,
    services: [
      { name: "Corte", durationMinutes: 30, priceLabel: "desde 25€" },
      { name: "Color", durationMinutes: 90, priceLabel: "desde 55€" },
      { name: "Corte + barba", durationMinutes: 45, priceLabel: "desde 35€" },
    ],
  },
  {
    slug: "restaurante",
    name: "Fuego & Sal",
    category: "restaurante",
    openingHours: "Tu-Su 13:00-16:00,20:00-23:30",
    capacity: 6,
    services: [
      { name: "Mesa comida", durationMinutes: 90 },
      { name: "Mesa cena", durationMinutes: 120 },
      { name: "Evento privado", durationMinutes: 180, priceLabel: "consultar" },
    ],
  },
  {
    slug: "taller",
    name: "Garaje Norte",
    category: "taller",
    openingHours: "Mo-Fr 09:00-13:30,15:30-19:30; Sa 09:00-13:00",
    capacity: 2,
    services: [
      { name: "Revisión general", durationMinutes: 45, priceLabel: "desde 40€" },
      { name: "Cambio de neumáticos", durationMinutes: 30 },
      { name: "Diagnóstico avería", durationMinutes: 60 },
    ],
  },
  {
    slug: "veterinaria",
    name: "VetCare",
    category: "veterinaria",
    openingHours: "Mo-Fr 09:00-13:00,16:00-20:00; Sa 10:00-13:00",
    capacity: 1,
    services: [
      { name: "Consulta general", durationMinutes: 30, priceLabel: "desde 30€" },
      { name: "Vacunación", durationMinutes: 20 },
      { name: "Revisión urgente", durationMinutes: 30, priceLabel: "consultar" },
    ],
  },
];

export async function seedAll(prisma: PrismaClient) {
  for (const b of BUSINESSES) {
    const business = await prisma.business.upsert({
      where: { slug: b.slug },
      update: {
        name: b.name,
        category: b.category,
        openingHours: b.openingHours,
      },
      create: {
        slug: b.slug,
        name: b.name,
        category: b.category,
        openingHours: b.openingHours,
      },
    });

    await prisma.bookingConfig.upsert({
      where: { businessId: business.id },
      update: { capacity: b.capacity },
      create: { businessId: business.id, capacity: b.capacity },
    });

    for (const [i, s] of b.services.entries()) {
      const existing = await prisma.service.findFirst({
        where: { businessId: business.id, name: s.name },
      });
      if (existing) {
        await prisma.service.update({
          where: { id: existing.id },
          data: { durationMinutes: s.durationMinutes, priceLabel: s.priceLabel, sortOrder: i },
        });
      } else {
        await prisma.service.create({
          data: {
            businessId: business.id,
            name: s.name,
            durationMinutes: s.durationMinutes,
            priceLabel: s.priceLabel,
            sortOrder: i,
          },
        });
      }
    }

    console.log(`Seed listo: ${b.slug} (${b.services.length} servicios)`);
  }
}

const isMain = process.argv[1] && process.argv[1].endsWith("seed.ts");
if (isMain) {
  const prisma = new PrismaClient();
  seedAll(prisma)
    .catch((err) => {
      console.error(err);
      process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
}
