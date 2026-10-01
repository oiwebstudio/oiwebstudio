"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import FadeIn from "@/components/motion/FadeIn";
import RevealText from "@/components/motion/RevealText";
import imageLoader from "@/lib/imageLoader";
import { useLocale } from "@/lib/i18n";

const EASE = [0.22, 1, 0.36, 1] as const;

// Fotos reales del mostrador, en el mismo orden que t.panes.items.
const PHOTOS = ["/images/pins/pan-sesamo.webp", "/images/pins/pan-avena.webp", "/images/pins/pan-pasas.webp"];
// Cada pieza cae con un giro distinto, como panes dejados en la bandeja.
const TILT = [-2.5, 1.5, -1];

export default function Panes() {
  const { t } = useLocale();
  const copy = t.panes;
  const reduce = useReducedMotion();

  return (
    <section id="panes" className="relative overflow-hidden bg-bg py-24 md:py-32">
      <div className="container-edge mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
        <div>
          <FadeIn>
            <p className="eyebrow mb-3">{copy.eyebrow}</p>
            <div className="line-mark" />
          </FadeIn>
          <RevealText as="h2" lines={copy.title} className="display text-4xl md:text-6xl" />
        </div>
        <FadeIn delay={0.1}>
          <p className="body-editorial max-w-sm">{copy.intro}</p>
        </FadeIn>
      </div>

      <ul className="container-edge grid gap-5 sm:grid-cols-3 md:gap-8">
        {copy.items.map((item, i) => (
          <motion.li
            key={item.name}
            initial={reduce ? false : { opacity: 0, y: 70, rotate: TILT[i] * 3 }}
            whileInView={{ opacity: 1, y: 0, rotate: TILT[i] }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ type: "spring", stiffness: 120, damping: 18, delay: i * 0.12 }}
            whileHover={reduce ? undefined : { rotate: 0, y: -8 }}
            className="group"
          >
            <div className="overflow-hidden rounded-[1.5rem] bg-lino shadow-[0_26px_50px_-30px_rgba(43,30,20,0.6)]">
              <img
                src={imageLoader({ src: PHOTOS[i] })}
                alt={item.name}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-organic group-hover:scale-105"
              />
            </div>
            <h3 className="display mt-5 text-2xl md:text-3xl">{item.name}</h3>
            <p className="mt-1 text-sm text-muted md:text-base">{item.note}</p>
          </motion.li>
        ))}
      </ul>

      <FadeIn delay={0.2}>
        <div className="container-edge mt-12 md:mt-16">
          <Link
            href="/productos/"
            data-cursor="hover"
            className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ink/15 px-6 text-xs uppercase tracking-widest2 text-ink transition-colors duration-300 hover:border-madera hover:bg-madera hover:text-[#F7F1E6]"
          >
            {copy.more}
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}
