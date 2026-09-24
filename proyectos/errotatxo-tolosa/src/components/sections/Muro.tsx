"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/lib/i18n";
import { pins, type PinTag } from "@/lib/pins";
import { storePath, stores } from "@/lib/stores";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;
const FILTERS: ("all" | PinTag)[] = ["all", "pan", "dulce", "cafe", "tiendas"];

/**
 * Muro de fotos estilo Pinterest: mampostería de dos columnas en el móvil
 * (tres y cuatro en pantallas grandes), esquinas muy redondeadas, pie de foto
 * corto debajo y filtros en píldoras que se deslizan con el dedo.
 */
export default function Muro() {
  const { t, locale } = useLocale();
  const copy = t.muro;
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const visible = filter === "all" ? pins : pins.filter((p) => p.tag === filter);

  return (
    <section id="muro" className="relative bg-bg pb-16 pt-14 md:pb-24 md:pt-20">
      <div className="px-4 text-center md:px-12">
        <p className="eyebrow mb-3">{copy.eyebrow}</p>
        <h2 className="display text-[2rem] leading-tight md:text-5xl">
          {copy.title[0]} <span className="text-madera">{copy.title[1]}</span>
        </h2>
      </div>

      {/* Píldoras de filtro: scroll horizontal en el móvil, sin barra visible */}
      <div
        role="group"
        aria-label={copy.filterLabel}
        className="mt-7 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:justify-center md:px-12 [&::-webkit-scrollbar]:hidden"
      >
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            data-cursor="hover"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              "min-h-[40px] shrink-0 rounded-full px-5 text-[13px] font-medium transition-colors duration-300",
              filter === f
                ? "bg-ink text-bg"
                : "bg-lino text-ink/75 hover:bg-sol/25 hover:text-ink"
            )}
          >
            {copy.chips[f]}
          </button>
        ))}
      </div>

      <div className="mt-6 columns-2 gap-3 px-3 sm:gap-4 md:columns-3 md:px-12 lg:columns-4">
          {visible.map((pin) => {
            const store = pin.store ? stores.find((s) => s.id === pin.store) : undefined;
            const caption = locale === "eu" ? pin.eu : pin.es;
            return (
              <motion.figure
                // La clave incluye el filtro: al cambiarlo, las fotos que quedan
                // entran de nuevo con un fundido. Sin animación de salida, que
                // dependía de que el navegador pintara fotogramas para retirarlas.
                key={`${filter}-${pin.src}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="group mb-3 break-inside-avoid sm:mb-4"
              >
                <div className="overflow-hidden rounded-[1.25rem] bg-lino shadow-[0_10px_30px_-18px_rgba(43,30,20,0.45)]">
                  <Image
                    src={pin.src}
                    alt={caption}
                    width={pin.w}
                    height={pin.h}
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    className="h-auto w-full transition-transform duration-700 ease-organic group-hover:scale-[1.04]"
                  />
                </div>
                <figcaption className="px-1.5 pt-2">
                  <span className="block text-[13px] font-medium leading-snug text-ink">{caption}</span>
                  {store && (
                    <Link
                      href={storePath(store)}
                      data-cursor="hover"
                      className="mt-0.5 inline-flex min-h-[28px] items-center gap-1 text-[11px] text-muted transition-colors hover:text-madera"
                    >
                      <MapPin size={11} className="text-madera" />
                      {store.name}
                    </Link>
                  )}
                </figcaption>
              </motion.figure>
            );
          })}
      </div>
    </section>
  );
}
