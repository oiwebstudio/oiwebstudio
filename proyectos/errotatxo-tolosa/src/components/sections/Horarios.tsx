"use client";

import { useEffect, useState } from "react";
import FadeIn from "@/components/motion/FadeIn";
import LiveStatusBadge from "@/components/LiveStatusBadge";
import RevealText from "@/components/motion/RevealText";
import Scramble from "@/components/motion/Scramble";
import { useLocale } from "@/lib/i18n";
import { isWeekendInMadrid, stores } from "@/lib/stores";
import { cn } from "@/lib/utils";

export default function Horarios() {
  const { t } = useLocale();
  const copy = t.horarios;

  // loc-hours-today (biblioteca-animaciones): se resalta la columna que
  // corresponde a hoy. Se calcula tras montar para no romper la hidratación.
  const [weekendToday, setWeekendToday] = useState<boolean | null>(null);
  useEffect(() => {
    setWeekendToday(isWeekendInMadrid());
  }, []);

  const todayChip = (
    <span className="ml-2 rounded-full bg-sol/20 px-2 py-0.5 text-[10px] uppercase tracking-widest2 text-madera">
      {copy.todayLabel}
    </span>
  );

  return (
    <section id="horarios" className="relative bg-bg py-24 md:py-32">
      <div className="container-edge mb-12 md:mb-16">
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

      <div className="container-edge">
        <div className="overflow-hidden rounded-sm border border-ink/10">
          {/* Cabecera solo en desktop: en móvil cada fila se lee como una ficha. */}
          <div className="hidden border-b border-ink/10 bg-lino/40 md:grid md:grid-cols-[1.6fr_1fr_1fr_13rem]">
            <p className="px-6 py-4 text-[11px] uppercase tracking-widest2 text-muted">
              {copy.storeCol}
            </p>
            <p
              className={cn(
                "px-6 py-4 text-[11px] uppercase tracking-widest2 text-muted",
                weekendToday === false && "fx-today text-madera"
              )}
            >
              {t.ubicacion.weekdayLabel}
              {weekendToday === false && todayChip}
            </p>
            <p
              className={cn(
                "px-6 py-4 text-[11px] uppercase tracking-widest2 text-muted",
                weekendToday === true && "fx-today text-madera"
              )}
            >
              {t.ubicacion.weekendLabel}
              {weekendToday === true && todayChip}
            </p>
            <span className="px-6 py-4" />
          </div>

          {stores.map((store, i) => (
            <FadeIn
              key={store.id}
              delay={0.06 * i}
              className="grid grid-cols-1 gap-y-2 border-b border-ink/10 px-6 py-6 last:border-b-0 md:grid-cols-[1.6fr_1fr_1fr_13rem] md:items-center md:gap-y-0 md:px-0 md:py-0"
            >
              <p className="display text-lg md:px-6 md:py-6">{store.name}</p>

              <p
                className={cn(
                  "text-sm text-muted md:px-6 md:py-6",
                  weekendToday === false && "fx-today text-ink"
                )}
              >
                <span className="text-madera md:hidden">{t.ubicacion.weekdayLabel}: </span>
                {store.hours?.weekday ?? "—"}
              </p>

              <p
                className={cn(
                  "text-sm text-muted md:px-6 md:py-6",
                  weekendToday === true && "fx-today text-ink"
                )}
              >
                <span className="text-madera md:hidden">{t.ubicacion.weekendLabel}: </span>
                {store.hours?.weekend ?? t.ubicacion.checkWeekend}
              </p>

              <div className="mt-1 md:mt-0 md:px-6 md:py-6">
                <LiveStatusBadge store={store} />
              </div>

              {!store.verified.hours && (
                <p className="text-[11px] text-muted/70 md:col-span-4 md:px-6 md:pb-5">
                  {t.tiendas.unverifiedHours}
                </p>
              )}
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2}>
          <p className="mt-6 text-xs text-muted/80">{copy.note}</p>
        </FadeIn>
      </div>
    </section>
  );
}
