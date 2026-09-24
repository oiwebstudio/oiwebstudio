import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/site";
import { breadcrumbNode, graph, storeNode } from "@/lib/structuredData";
import { storePath, stores, type Store } from "@/lib/stores";
import StoreContent from "./StoreContent";

/** "7:30–14:00 / 16:00–20:30" → "7:30–14:00 y 16:00–20:30" */
const shifts = (s?: string) => (s ?? "").split("/").map((x) => x.trim()).join(" y ");

/**
 * Título y descripción de cada tienda: la búsqueda que responde va delante
 * ("Panadería en Anoeta", "Cafetería y panadería en Tolosa"), y la descripción
 * lleva lo que la gente busca antes de ir: calle, horario y teléfono.
 */
const SEO: Record<string, (s: Store) => { title: string; description: string }> = {
  "tolosa-andia": (s) => ({
    title: "Panadería en Tolosa, casco viejo (Andia Kalea)",
    description: `Errotatxo en ${s.street}, casco viejo de Tolosa. Pan, bollería y pastelería. L–V ${shifts(s.hours?.weekday)}, sábados y domingos ${s.hours?.weekend}. Tel. ${s.phone}.`,
  }),
  "tolosa-san-frantzisko": (s) => ({
    title: "Cafetería y panadería en Tolosa (San Frantzisko)",
    description: `Panadería con cafetería en ${s.street}, Tolosa: café en barra o en mesa con el pan y la bollería del día. L–V ${shifts(s.hours?.weekday)}, fines de semana ${s.hours?.weekend}. Tel. ${s.phone}.`,
  }),
  anoeta: (s) => ({
    title: "Panadería en Anoeta (San Juan Kalea)",
    description: `Errotatxo en ${s.street}, Anoeta. Pan del obrador, bollería y pastelería. L–V ${shifts(s.hours?.weekday)}, fines de semana ${s.hours?.weekend}. Tel. ${s.phone}.`,
  }),
};

const find = (slug: string) => stores.find((s) => s.slug === slug);

export function generateStaticParams() {
  return stores.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const store = find((await params).slug);
  if (!store) return {};
  return pageMetadata({ ...SEO[store.id](store), path: storePath(store) });
}

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const store = find((await params).slug);
  if (!store) notFound();

  return (
    <>
      <JsonLd
        json={graph(
          storeNode(store),
          breadcrumbNode([
            ["Tiendas", "/tiendas/"],
            [store.name, storePath(store)],
          ])
        )}
      />
      <StoreContent id={store.id} />
    </>
  );
}
