import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    name: "Café Studio Noir",
    category: "cafeteria",
    openingHours: "Mo-Su 08:00-20:00",
    capacity: 4,
    services: [
      { name: "Mesa para 2", durationMinutes: 60 },
      { name: "Mesa para 4", durationMinutes: 60 },
      { name: "Sala privada (grupos)", durationMinutes: 90 },
    ],
  },
  {
    slug: "floristeria",
    name: "Floristería Petalo",
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
    name: "Gimnasio Fuerza",
    category: "gimnasio",
    openingHours: "Mo-Fr 07:00-22:00; Sa 09:00-14:00",
    capacity: 3,
    services: [
      { name: "Clase dirigida (prueba)", durationMinutes: 45 },
      { name: "Sesión con entrenador personal", durationMinutes: 60, priceLabel: "desde 35€" },
    ],
  },
  {
    slug: "panaderia",
    name: "Panadería Fuego & Sal",
    category: "panaderia",
    openingHours: "Mo-Su 07:00-14:00",
    capacity: 2,
    services: [
      { name: "Encargo tarta especial", durationMinutes: 15 },
      { name: "Recogida de pedido grande", durationMinutes: 15 },
    ],
  },
  {
    slug: "peluqueria",
    name: "Studio Noir Peluquería",
    category: "peluqueria",
    openingHours: "Tu-Sa 10:00-19:00",
    capacity: 2,
    services: [
      { name: "Corte", durationMinutes: 30, priceLabel: "desde 25€" },
      { name: "Color", durationMinutes: 90, priceLabel: "desde 55€" },
      { name: "Corte + barba", durationMinutes: 45, priceLabel: "desde 35€" },
    ],
  },
  {
    slug: "restaurante",
    name: "Fuego & Sal Restaurante",
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
    name: "Taller Mecánico Ruedas",
    category: "taller",
    openingHours: "Mo-Fr 08:30-13:30,15:00-19:00",
    capacity: 2,
    services: [
      { name: "Revisión general", durationMinutes: 45, priceLabel: "desde 40€" },
      { name: "Cambio de neumáticos", durationMinutes: 30 },
      { name: "Diagnóstico avería", durationMinutes: 60 },
    ],
  },
  {
    slug: "veterinaria",
    name: "Clínica Veterinaria Sur",
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

async function main() {
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

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
