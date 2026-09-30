"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Coffee, Phone } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import LiveStatusBadge from "@/components/LiveStatusBadge";
import { useLocale } from "@/lib/i18n";
import { isWeekendInMadrid, storePath, stores } from "@/lib/stores";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Lo primero que se busca al entrar: qué tienda está abierta y hasta cuándo.
 * Tres fichas pegadas a la portada, con el horario de hoy, el estado en vivo
 * y el teléfono a un toque.
 */
export default function Hoy() {
  const { t } = useLocale();
  const copy = t.hoy;

  // El día se calcula tras montar: el HTML estático muestra el horario entre
  // semana y no cambia la hidratación.
  const [weekend, setWeekend] = useState(false);
  useEffect(() => setWeekend(isWeekendInMadrid()), []);

  const open = stores.filter((s) => s.status === "open");

  return (
    <section aria-label={copy.title} className="relative z-20 -mt-14 pb-12 md:-mt-20 md:pb-16">
      <div className="container-edge">
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-5">
          {open.map((store, i) => {
            const hours = weekend ? store.hours?.weekend : store.hours?.weekday;
            return (
              <motion.li
                key={store.id}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + i * 0.12, duration: 0.8, ease: EASE }}
                className="group relative flex items-center gap-4 rounded-[1.5rem] bg-surface px-5 py-4 shadow-[0_24px_60px_-34px_rgba(43,30,20,0.55)] ring-1 ring-ink/[0.06] transition-[transform,box-shadow] duration-500 ease-organic hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(43,30,20,0.6)] md:p-6"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={storePath(store)}
                    data-cursor="hover"
                    className="flex items-center gap-2 font-serif text-lg text-ink after:absolute after:inset-0 after:rounded-[1.5rem] after:content-['']"
                  >
                    <span>{store.name}</span>
                    {store.cafe && <Coffee size={15} aria-label={t.tiendas.cafeTag} className="shrink-0 text-madera" />}
                    <ArrowUpRight
                      size={15}
                      aria-hidden
                      className="shrink-0 text-madera opacity-0 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </Link>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <p className="text-sm tabular-nums text-muted">
                      <span className="text-madera">{copy.today}:</span> {hours ?? copy.closedToday}
                    </p>
                    <LiveStatusBadge store={store} />
                  </div>
                </div>

                {store.phone && store.verified.phone && (
                  <a
                    href={`tel:+34${store.phone.replace(/\s/g, "")}`}
                    aria-label={`${copy.call} · ${store.name}`}
                    data-cursor="hover"
                    className="relative z-[2] flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sol/25 text-madera transition-colors duration-300 hover:bg-sol hover:text-[#4E2E1B]"
                  >
                    <Phone size={18} />
                  </a>
                )}
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
