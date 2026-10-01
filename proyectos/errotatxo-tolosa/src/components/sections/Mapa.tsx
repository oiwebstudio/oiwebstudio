"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Coffee, ExternalLink, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import Croquis from "@/components/Croquis";
import FadeIn from "@/components/motion/FadeIn";
import LiveStatusBadge from "@/components/LiveStatusBadge";
import RevealText from "@/components/motion/RevealText";
import Scramble from "@/components/motion/Scramble";
import { useLocale } from "@/lib/i18n";
import { directionsUrl, stores } from "@/lib/stores";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Mapa() {
  const { t } = useLocale();
  const copy = t.mapa;

  // La tienda elegida se resalta en el croquis y despliega su ficha.
  const [activeId, setActiveId] = useState(stores[0].id);

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

      <div className="container-edge grid items-start gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-12">
        <FadeIn delay={0.1}>
          <div className="mx-auto w-full max-w-[min(100%,calc(86vh*0.524))] overflow-hidden rounded-[1.75rem] bg-lino shadow-[0_20px_60px_-40px_rgba(43,30,20,0.55)] ring-1 ring-ink/[0.07]">
            <div className="aspect-[520/993] w-full">
              <Croquis activeId={activeId} onSelect={setActiveId} label={copy.croquisAlt} />
            </div>
          </div>
        </FadeIn>

        <ul className="flex flex-col gap-3 md:sticky md:top-28">
          {stores.map((store, i) => {
            const active = store.id === activeId;
            return (
              <motion.li
                key={store.id}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: EASE }}
                className={cn(
                  "overflow-hidden rounded-[1.5rem] bg-surface ring-1 transition-[box-shadow,ring-color] duration-500",
                  active ? "shadow-[0_24px_50px_-30px_rgba(43,30,20,0.55)] ring-madera/30" : "ring-ink/[0.06]"
                )}
              >
                <button
                  type="button"
                  data-cursor="hover"
                  onClick={() => setActiveId(store.id)}
                  aria-expanded={active}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left md:px-6 md:py-5"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "h-3 w-3 shrink-0 rounded-full border-[3px] border-madera transition-colors duration-500",
                      active ? "bg-madera" : "bg-surface"
                    )}
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="flex items-center gap-2 font-serif text-lg text-ink md:text-xl">
                      {store.name}
                      {store.cafe && <Coffee size={15} aria-label={t.tiendas.cafeTag} className="shrink-0 text-madera" />}
                    </span>
                    <LiveStatusBadge store={store} />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                    >
                      <div className="px-5 pb-5 md:px-6 md:pb-6">
                        <p className="flex gap-2 text-sm text-muted">
                          <MapPin size={15} className="mt-0.5 shrink-0 text-madera" />
                          {store.address}
                        </p>
                        {store.hoursSummary && <p className="mt-2 pl-[23px] text-sm tabular-nums text-muted">{store.hoursSummary}</p>}
                        <div className="mt-4 flex flex-wrap gap-2 pl-[23px]">
                          <a
                            href={directionsUrl(store)}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-cursor="hover"
                            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-carbon px-4 text-[11px] uppercase tracking-widest2 text-[#F7F1E6] transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.97]"
                          >
                            {t.tiendas.routeCta} <ExternalLink size={12} />
                          </a>
                          {store.phone && store.verified.phone && (
                            <a
                              href={`tel:+34${store.phone.replace(/\s/g, "")}`}
                              data-cursor="hover"
                              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-sol/25 px-4 text-[11px] uppercase tracking-widest2 text-madera transition-colors duration-300 hover:bg-sol hover:text-[#4E2E1B] active:scale-[0.97]"
                            >
                              {t.tiendas.callCta} <Phone size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
