import { stores } from "@/lib/stores";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const WEEKEND = ["Saturday", "Sunday"];

/**
 * Cada turno ("7:00–13:30 / 16:00–20:30") va como su propia especificación:
 * declararlo de un tirón anunciaría que abrimos durante el cierre del mediodía.
 */
function specsFor(schedule: string, dayOfWeek: string[]) {
  return schedule
    .split("/")
    .map((shift) => shift.trim().split(/[–-]/))
    .filter((range) => range.length === 2)
    .map(([opens, closes]) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek,
      opens: opens.trim(),
      closes: closes.trim(),
    }));
}

function openingHours(store: (typeof stores)[number]) {
  // Un horario sin confirmar no se publica como dato estructurado: Google lo mostraría
  // en la ficha como si fuera oficial.
  if (!store.hours || !store.verified.hours) return undefined;

  return [
    ...specsFor(store.hours.weekday, WEEKDAYS),
    ...(store.hours.weekend ? specsFor(store.hours.weekend, WEEKEND) : []),
  ];
}

export function buildBakeryStructuredData() {
  return stores
    .filter((s) => s.status !== "temp-closed")
    .map((store) => ({
      "@context": "https://schema.org",
      // San Frantzisko además sirve cafetería: declarar solo Bakery dejaría fuera
      // las búsquedas de cafetería en la zona.
      "@type": store.cafe ? ["Bakery", "CafeOrCoffeeShop"] : "Bakery",
      name: `Errotatxo — ${store.name}`,
      image: `https://errotatxotolosa.com${store.image}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: store.address,
        addressCountry: "ES",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: store.lat,
        longitude: store.lng,
      },
      telephone: store.verified.phone ? store.phone : undefined,
      openingHoursSpecification: openingHours(store),
      // Solo se declara valoración cuando está respaldada por la ficha de Google.
      aggregateRating:
        store.verified.rating && store.rating && store.reviews
          ? {
              "@type": "AggregateRating",
              ratingValue: store.rating,
              reviewCount: store.reviews,
            }
          : undefined,
      url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.mapsQuery)}`,
    }));
}
