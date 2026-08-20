"use client";

import { ExternalLink, MapPin, Phone } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import FadeIn from "@/components/motion/FadeIn";
import LiveStatusBadge from "@/components/LiveStatusBadge";
import Magnetic from "@/components/motion/Magnetic";
import RevealText from "@/components/motion/RevealText";
import Scramble from "@/components/motion/Scramble";
import { useLocale } from "@/lib/i18n";
import { directionsUrl, stores } from "@/lib/stores";
import { cn } from "@/lib/utils";

const TiendasMap = dynamic(() => import("@/components/TiendasMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-lino" />,
});

export default function Mapa() {
  const { t } = useLocale();
  const copy = t.mapa;

  // loc-map-card (biblioteca-animaciones): tarjeta de acción sobre el mapa.
  // La tienda elegida manda al mapa volar hasta ella.
  const [activeId, setActiveId] = useState(stores[0].id);
  const active = stores.find((s) => s.id === activeId) ?? stores[0];
  const mapsUrl = directionsUrl(active);

  return (
    <section id="mapa" className="relative bg-lino/25 py-24 md:py-32">
      <div className="container-edge mb-12 md:mb-16">
        <FadeIn>
          {/* text-scramble-scroll (biblioteca-animaciones) */}
          <Scramble text={copy.eyebrow} className="eyebrow mb-3 block" />
          <div className="line-mark" />
        </FadeIn>
        <RevealText as="h2" lines={copy.title} className="display text-4xl md:text-6xl" />
        <FadeIn delay={0.1}>
          <p className="body-editorial mt-6 max-w-md">{copy.intro}</p>
        </FadeIn>
      </div>

      <div className="container-edge">
        <FadeIn delay={0.15}>
          <div className="relative overflow-hidden rounded-[1.75rem] bg-surface shadow-[0_20px_60px_-40px_rgba(43,30,20,0.55)] ring-1 ring-ink/[0.07]">
            <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-sol to-transparent" />

            {/* Desktop: tarjeta flotante sobre el mapa. Móvil: tarjeta debajo. */}
            <div className="relative h-[50vh] min-h-[280px] w-full md:h-[62vh] md:min-h-[380px]">
              <div role="region" aria-label={copy.title.join(" ")} className="h-full w-full">
                <TiendasMap focusId={activeId} />
              </div>

              {/* Tarjeta flotante solo en desktop */}
              <div className="pointer-events-none absolute inset-x-6 bottom-6 z-[500] hidden justify-start md:flex">
                <div className="pointer-events-auto w-full max-w-sm rounded-2xl bg-surface/90 p-5 shadow-[0_18px_46px_-28px_rgba(43,30,20,0.6)] ring-1 ring-ink/[0.08] backdrop-blur-xl">
                  <div className="mb-4 flex flex-wrap gap-2">
                    {stores.map((store) => (
                      <button
                        key={store.id}
                        type="button"
                        data-cursor="hover"
                        onClick={() => setActiveId(store.id)}
                        aria-pressed={store.id === activeId}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-[10px] uppercase tracking-widest2 transition-all duration-500",
                          store.id === activeId
                            ? "bg-carbon text-[#F7F1E6] shadow-[0_6px_16px_-8px_rgba(214,166,74,0.9)]"
                            : "bg-lino/70 text-muted hover:bg-lino"
                        )}
                      >
                        {store.name.replace("Tolosa — ", "")}
                      </button>
                    ))}
                  </div>

                  <div className="mb-2 flex items-start justify-between gap-3">
                    <p className="display text-lg">{active.name}</p>
                    <LiveStatusBadge store={active} />
                  </div>

                  <p className="flex gap-2 text-xs text-muted">
                    <MapPin size={14} className="mt-0.5 shrink-0 text-madera" />
                    {active.address}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                    <Magnetic>
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="hover"
                        className="link-underline inline-flex min-h-[44px] items-center gap-1.5 text-[11px] uppercase tracking-widest2 text-ink"
                      >
                        {t.tiendas.routeCta} <ExternalLink size={12} />
                      </a>
                    </Magnetic>

                    {active.phone && active.verified.phone && (
                      <a
                        href={`tel:${active.phone.replace(/\s/g, "")}`}
                        data-cursor="hover"
                        className="link-underline inline-flex min-h-[44px] items-center gap-1.5 text-[11px] uppercase tracking-widest2 text-ink"
                      >
                        {t.tiendas.callCta} <Phone size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta bajo el mapa solo en móvil */}
            <div className="border-t border-ink/[0.07] p-5 md:hidden">
              <div className="mb-3 flex flex-wrap gap-2">
                {stores.map((store) => (
                  <button
                    key={store.id}
                    type="button"
                    data-cursor="hover"
                    onClick={() => setActiveId(store.id)}
                    aria-pressed={store.id === activeId}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-[10px] uppercase tracking-widest2 transition-all duration-500",
                      store.id === activeId
                        ? "bg-carbon text-[#F7F1E6] shadow-[0_6px_16px_-8px_rgba(214,166,74,0.9)]"
                        : "bg-lino/70 text-muted hover:bg-lino"
                    )}
                  >
                    {store.name.replace("Tolosa — ", "")}
                  </button>
                ))}
              </div>

              <div className="mb-2 flex items-start justify-between gap-3">
                <p className="display text-lg">{active.name}</p>
                <LiveStatusBadge store={active} />
              </div>

              <p className="flex gap-2 text-xs text-muted">
                <MapPin size={14} className="mt-0.5 shrink-0 text-madera" />
                {active.address}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="link-underline inline-flex min-h-[44px] items-center gap-1.5 text-[11px] uppercase tracking-widest2 text-ink"
                >
                  {t.tiendas.routeCta} <ExternalLink size={12} />
                </a>

                {active.phone && active.verified.phone && (
                  <a
                    href={`tel:${active.phone.replace(/\s/g, "")}`}
                    data-cursor="hover"
                    className="link-underline inline-flex min-h-[44px] items-center gap-1.5 text-[11px] uppercase tracking-widest2 text-ink"
                  >
                    {t.tiendas.callCta} <Phone size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
