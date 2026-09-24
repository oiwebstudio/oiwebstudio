import { socialLinks } from "@/lib/data";
import type { FaqItem } from "@/lib/faq";
import { abs } from "@/lib/site";
import { directionsUrl, storePath, stores, type Store } from "@/lib/stores";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const WEEKEND = ["Saturday", "Sunday"];

const ORG_ID = abs("/#organizacion");
const SITE_ID = abs("/#web");

/** Municipios de Tolosaldea desde los que se viene a las tres tiendas. */
const AREA = ["Tolosa", "Anoeta", "Ibarra", "Irura", "Alegia", "Villabona", "Hernialde", "Tolosaldea"];

type Node = Record<string, unknown>;

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
      opens: opens.trim().padStart(5, "0"),
      closes: closes.trim().padStart(5, "0"),
    }));
}

function openingHours(store: Store) {
  // Un horario sin confirmar no se publica como dato estructurado: Google lo mostraría
  // en la ficha como si fuera oficial.
  if (!store.hours || !store.verified.hours) return undefined;

  return [
    ...specsFor(store.hours.weekday, WEEKDAYS),
    ...(store.hours.weekend ? specsFor(store.hours.weekend, WEEKEND) : []),
  ];
}

export function organizationNode(): Node {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Errotatxo",
    legalName: "Okindegia Errotatxo, S.L.",
    // Rótulo de las tiendas y cómo se busca en euskera y castellano.
    alternateName: ["Errotatxo Okindegia", "Errotatxo Gozotegia Okindegia", "Panadería Errotatxo"],
    // Fecha de constitución del registro mercantil.
    foundingDate: "1996-01-30",
    url: abs("/"),
    logo: abs("/images/logo-errotatxo.png"),
    sameAs: socialLinks.map((s) => s.href),
    areaServed: AREA.map((name) => ({ "@type": "Place", name })),
  };
}

export function websiteNode(): Node {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: abs("/"),
    name: "Errotatxo — Panadería en Tolosa",
    inLanguage: ["es", "eu"],
    publisher: { "@id": ORG_ID },
  };
}

export function storeNode(store: Store): Node {
  const url = abs(storePath(store));
  return {
    "@type": store.cafe ? ["Bakery", "CafeOrCoffeeShop"] : "Bakery",
    "@id": `${url}#tienda`,
    name: `Errotatxo — ${store.name}`,
    url,
    image: abs(store.image),
    parentOrganization: { "@id": ORG_ID },
    address: {
      "@type": "PostalAddress",
      streetAddress: store.street,
      postalCode: store.postalCode,
      addressLocality: store.locality,
      addressRegion: "Gipuzkoa",
      addressCountry: "ES",
    },
    geo: { "@type": "GeoCoordinates", latitude: store.lat, longitude: store.lng },
    hasMap: directionsUrl(store),
    telephone: store.verified.phone && store.phone ? `+34 ${store.phone}` : undefined,
    openingHoursSpecification: openingHours(store),
    areaServed: AREA.map((name) => ({ "@type": "Place", name })),
    // Solo se declara valoración cuando está respaldada por la ficha de Google.
    aggregateRating:
      store.verified.rating && store.rating && store.reviews
        ? { "@type": "AggregateRating", ratingValue: store.rating, reviewCount: store.reviews }
        : undefined,
  };
}

export function faqNode(items: FaqItem[]): Node {
  return {
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

/** Migas de pan: [["Tiendas", "/tiendas/"], ["Anoeta", "/tiendas/anoeta/"]] */
export function breadcrumbNode(trail: [name: string, path: string][]): Node {
  const items = [["Inicio", "/"] as [string, string], ...trail];
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: abs(path),
    })),
  };
}

export function allStoreNodes(): Node[] {
  return stores.filter((s) => s.status !== "temp-closed").map(storeNode);
}

/** Un solo bloque JSON-LD por página, con todos los nodos enlazados entre sí. */
export function graph(...nodes: Node[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes });
}
