import type { MetadataRoute } from "next";
import { abs } from "@/lib/site";
import { storePath, stores } from "@/lib/stores";

export const dynamic = "force-static";

/**
 * Se publica en /demos/errotatxo/sitemap.xml. Google no lo descubre solo en
 * una subcarpeta: hay que darlo de alta en Search Console.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, number][] = [
    ["/", 1],
    ["/tiendas/", 0.9],
    ...stores.map((s) => [storePath(s), 0.9] as [string, number]),
    ["/productos/", 0.7],
    ["/historia/", 0.5],
    ["/contacto/", 0.6],
  ];
  return pages.map(([path, priority]) => ({
    url: abs(path),
    changeFrequency: "monthly",
    priority,
  }));
}
