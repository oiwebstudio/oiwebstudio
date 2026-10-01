"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Check, Coffee, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import LiveStatusBadge from "@/components/LiveStatusBadge";
import RevealText from "@/components/motion/RevealText";
import imageLoader from "@/lib/imageLoader";
import { useLocale } from "@/lib/i18n";
import { directionsUrl, storePath, stores } from "@/lib/stores";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * La cafetería de San Frantzisko como protagonista: la única de las tres
 * tiendas donde sentarse. Dos fotos reales que se desplazan a distinto ritmo
 * y la ficha con horario, estado en vivo y cómo llegar.
 */
export default function Cafeteria() {
  const { t } = useLocale();
  const copy = t.cafeteria;
  const store = stores.find((s) => s.cafe) ?? stores[0];
  const reduce = useReducedMotion();

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yBig = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40]);
  const ySmall = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [110, -90]);

  return (
    <section ref={ref} id="cafeteria" className="relative overflow-hidden bg-carbon py-24 text-[#F5EFE4] md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-sol/15 blur-3xl"
      />

      <div className="container-edge relative grid items-center gap-14 md:grid-cols-2 md:gap-16">
        {/* Collage: barra grande y mesas pequeña, solapadas. */}
        <div className="relative pb-16 md:pb-24">
          <motion.div style={{ y: yBig }} className="overflow-hidden rounded-[1.75rem] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)]">
            <motion.img
              src={imageLoader({ src: "/images/pins/cafe-barra.webp" })}
              alt={t.tiendas.stores[store.id]?.imageAlt ?? store.name}
              loading="lazy"
              initial={reduce ? false : { scale: 1.15, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 1.4, ease: EASE }}
              className="aspect-[9/8] w-full object-cover"
            />
          </motion.div>
          <motion.div
            style={{ y: ySmall }}
            className="absolute -bottom-2 right-[-4%] w-[46%] overflow-hidden rounded-[1.25rem] ring-[6px] ring-carbon md:right-[-8%]"
          >
            <img
              src={imageLoader({ src: "/images/pins/cafe-mesas.webp" })}
              alt={copy.photoAlt}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          </motion.div>
          <motion.span
            aria-hidden
            initial={reduce ? false : { scale: 0, rotate: -40 }}
            whileInView={{ scale: 1, rotate: -8 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.5 }}
            className="absolute -left-3 top-6 flex h-20 w-20 items-center justify-center rounded-full bg-sol text-[#4E2E1B] shadow-lg md:-left-6 md:h-24 md:w-24"
          >
            <Coffee size={30} />
          </motion.span>
        </div>

        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="eyebrow mb-4 text-sol"
          >
            {copy.eyebrow}
          </motion.p>
          <RevealText as="h2" lines={copy.title} className="display text-4xl text-[#F5EFE4] md:text-6xl" />

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            className="mt-6 max-w-md text-base leading-relaxed text-[#F5EFE4]/75 md:text-lg"
          >
            {copy.text}
          </motion.p>

          <ul className="mt-8 grid gap-3">
            {copy.points.map((point, i) => (
              <motion.li
                key={point}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.25 + i * 0.1, ease: EASE }}
                className="flex items-center gap-3 text-[15px]"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sol/20 text-sol">
                  <Check size={15} />
                </span>
                {point}
              </motion.li>
            ))}
          </ul>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
            className="mt-9 rounded-[1.25rem] bg-surface p-5 text-ink md:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] uppercase tracking-widest2 text-madera">{copy.hoursLabel}</p>
              <LiveStatusBadge store={store} />
            </div>
            <p className="mt-2 text-sm tabular-nums text-muted">{store.hoursSummary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={storePath(store)}
                data-cursor="hover"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-carbon px-5 text-[11px] uppercase tracking-widest2 text-[#F7F1E6] transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.97]"
              >
                {copy.ctaStore} <ArrowUpRight size={13} />
              </Link>
              <a
                href={directionsUrl(store)}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-sol/25 px-5 text-[11px] uppercase tracking-widest2 text-madera transition-colors duration-300 hover:bg-sol hover:text-[#4E2E1B] active:scale-[0.97]"
              >
                {copy.ctaRoute} <ExternalLink size={12} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
