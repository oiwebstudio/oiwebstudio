"use client";

import { Clock, ExternalLink, MapPin, Phone, Star } from "lucide-react";
import Link from "next/link";
import CursorGlow from "@/components/motion/CursorGlow";
import FadeIn from "@/components/motion/FadeIn";
import LiveStatusBadge from "@/components/LiveStatusBadge";
import Magnetic from "@/components/motion/Magnetic";
import RevealImage from "@/components/motion/RevealImage";
import RevealText from "@/components/motion/RevealText";
import Scramble from "@/components/motion/Scramble";
import TimeToClose from "@/components/TimeToClose";
import { useLocale } from "@/lib/i18n";
import { directionsUrl, storePath, stores } from "@/lib/stores";

export default function Tiendas() {
  const { t } = useLocale();
  const copy = t.tiendas;

  return (
    <section id="tiendas" className="relative overflow-hidden bg-bg py-24 md:py-32">
      <div className="container-edge mb-14 md:mb-20">
        <FadeIn>
          {/* text-scramble-scroll (biblioteca-animaciones) */}
          <Scramble text={copy.eyebrow} className="eyebrow mb-3 block" />
          <div className="line-mark" />
        </FadeIn>
        <RevealText as="h2" lines={copy.title} className="display text-4xl md:text-6xl" />
        <FadeIn delay={0.1}>
          <p className="body-editorial mt-6 max-w-xl">{copy.intro}</p>
        </FadeIn>
      </div>

      {/* card-siblings-blur (biblioteca-animaciones) */}
      {/* En el móvil, carrusel que se desliza con el dedo (con la siguiente
          tarjeta asomando); en escritorio, las tres en fila. */}
      <div className="fx-siblings flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 [scrollbar-width:none] md:grid md:snap-none md:grid-cols-3 md:gap-x-8 md:overflow-visible md:px-12 lg:px-[6vw] [&::-webkit-scrollbar]:hidden">
        {stores.map((store, i) => {
          const store_copy = copy.stores[store.id];
          const mapsUrl = directionsUrl(store);

          return (
            <FadeIn key={store.id} delay={0.08 * i} className="w-[80vw] max-w-sm shrink-0 snap-start md:w-auto md:max-w-none">
              <CursorGlow as="article" className="group flex h-full flex-col rounded-md">
                {/* card-glass-sheen (biblioteca-animaciones) */}
                <div className="fx-sheen relative mb-6 overflow-hidden rounded-[1.25rem] shadow-[0_10px_30px_-18px_rgba(43,30,20,0.45)] md:rounded-md md:shadow-none">
                  <RevealImage
                    src={store.image}
                    alt={store_copy?.imageAlt ?? store.name}
                    className="aspect-[4/5] w-full md:aspect-[3/4]"
                    imgClassName="transition-transform duration-700 ease-organic group-hover:scale-110"
                  />
                </div>

                <span className="mb-2 block text-xs text-madera">0{i + 1}</span>

                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h3 className="display flex items-baseline gap-2.5 text-xl transition-colors duration-500 group-hover:text-madera md:text-2xl">
                    {/* Enlace a la página propia de la tienda: el texto del enlace
                        es su nombre, que es lo que Google asocia a esa página. */}
                    <Link href={storePath(store)} data-cursor="hover" className="relative z-[2]">
                      {store.name}
                    </Link>
                    {/* Solo San Frantzisko tiene cafetería: se dice en la tarjeta
                        porque cambia a qué vas al local. */}
                    {store.cafe && (
                      <span className="rounded-full bg-sol/20 px-2.5 py-1 font-sans text-[10px] font-medium uppercase not-italic tracking-widest2 text-madera">
                        {copy.cafeTag}
                      </span>
                    )}
                  </h3>
                  <LiveStatusBadge store={store} />
                </div>
                <TimeToClose store={store} />

                {store_copy && (
                  <p className="body-editorial mb-5 text-sm md:text-base">{store_copy.tagline}</p>
                )}

                <ul className="space-y-2 text-xs text-muted">
                  <li className="flex gap-2">
                    <MapPin size={14} className="mt-0.5 shrink-0 text-madera" />
                    <span>{store.address}</span>
                  </li>

                  {store.hoursSummary && (
                    <li className="flex gap-2">
                      <Clock size={14} className="mt-0.5 shrink-0 text-madera" />
                      <span>
                        {store.hoursSummary}
                        {!store.verified.hours && (
                          <span className="mt-0.5 block text-[11px] text-muted/70">
                            {copy.unverifiedHours}
                          </span>
                        )}
                      </span>
                    </li>
                  )}

                  {/* La valoración solo se muestra si está respaldada por la ficha de Google. */}
                  {store.verified.rating && store.rating && (
                    <li className="flex items-center gap-2">
                      <Star size={14} className="shrink-0 text-madera" />
                      <span>
                        {store.rating.toLocaleString("es-ES", { minimumFractionDigits: 1 })}{" "}
                        {copy.ratingLabel}
                        {store.reviews ? ` (${store.reviews})` : ""}
                      </span>
                    </li>
                  )}
                </ul>

                <div className="relative z-[2] mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
                  {/* btn-magnetic (biblioteca-animaciones) */}
                  <Magnetic>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="hover"
                      className="link-underline inline-flex min-h-[44px] items-center gap-1.5 text-[11px] uppercase tracking-widest2 text-ink"
                    >
                      {copy.routeCta} <ExternalLink size={12} />
                    </a>
                  </Magnetic>

                  {/* Sin teléfono verificado no se pinta el botón: nunca una acción muerta. */}
                  {store.phone && store.verified.phone && (
                    <a
                      href={`tel:${store.phone.replace(/\s/g, "")}`}
                      data-cursor="hover"
                      className="link-underline inline-flex min-h-[44px] items-center gap-1.5 text-[11px] uppercase tracking-widest2 text-ink"
                    >
                      {copy.callCta} <Phone size={12} />
                    </a>
                  )}
                </div>
              </CursorGlow>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
