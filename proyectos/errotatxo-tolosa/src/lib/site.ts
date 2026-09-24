import type { Metadata } from "next";

/**
 * Dirección pública de la web. Todo lo que Google lee como URL absoluta —
 * canonical, Open Graph, sitemap, datos estructurados— sale de aquí.
 *
 * Antes apuntaba a errotatxotolosa.com, que no existe: las imágenes del schema
 * y de las vistas previas daban error. El día que tenga dominio propio, se
 * cambia esta línea y basePath/assetPrefix en next.config.mjs.
 */
export const SITE_URL = "https://oiwebstudio.com/demos/errotatxo";

/** URL absoluta a partir de una ruta interna ("/tiendas/anoeta/"). */
export function abs(path = "/"): string {
  return SITE_URL + (path.startsWith("/") ? path : `/${path}`);
}

/** Imagen para las vistas previas al compartir el enlace (WhatsApp, Facebook). */
export const OG_IMAGE = { url: abs("/og.jpg"), width: 1200, height: 630 };

/**
 * Metadatos de una página: título, descripción, canonical y vista previa.
 * Cada página tiene su propia canonical para que Google no las confunda entre sí.
 */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  /** true = el título no lleva el sufijo "| Errotatxo" (ya lo incluye). */
  absoluteTitle?: boolean;
}): Metadata {
  const url = abs(path);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Errotatxo Okindegia",
      locale: "es_ES",
      type: "website",
      images: [OG_IMAGE],
    },
  };
}
