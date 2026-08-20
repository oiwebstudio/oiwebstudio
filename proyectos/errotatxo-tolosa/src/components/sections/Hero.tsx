"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { useLenis } from "@/components/motion/LenisProvider";
import Magnetic from "@/components/motion/Magnetic";
import RevealText from "@/components/motion/RevealText";
import imageLoader from "@/lib/imageLoader";
import { useLocale } from "@/lib/i18n";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const lenis = useLenis();
  const { t } = useLocale();
  const hero = t.hero;

  const scrollTo = (selector: string) => {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) return;
    if (lenis) lenis.scrollTo(el);
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-24 pt-32 md:pb-28 md:pt-36"
    >
      {/* fondo: interior del obrador */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageLoader({ src: "/images/hero-interior.jpeg" })})` }}
        role="img"
        aria-label="Interior del obrador de Errotatxo"
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#150D07] via-[#150D07]/60 to-[#150D07]/25" />

      <div className="container-edge relative z-10 w-full">
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9, ease: EASE }}
            className="eyebrow mb-4 text-sol"
          >
            {hero.eyebrow}
          </motion.p>

          <RevealText
            as="h1"
            lines={hero.lines}
            delay={0.35}
            className="display text-[clamp(2.75rem,7vw,5.5rem)] text-[#F5EFE4]"
          />

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.9, ease: EASE }}
            className="body-editorial mt-6 max-w-md text-[#F5EFE4]/75"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.9, ease: EASE }}
            className="mt-9"
          >
            <Magnetic>
              <Link
                href="/productos"
                data-cursor="hover"
                className="inline-block rounded-full bg-sol px-7 py-3.5 text-xs font-medium uppercase tracking-widest2 text-[#4E2E1B] transition-colors duration-300 hover:bg-[#F5EFE4]"
              >
                {hero.cta}
              </Link>
            </Magnetic>
          </motion.div>
        </div>
      </div>

      <motion.button
        type="button"
        aria-label={hero.location}
        onClick={() => scrollTo("#explora")}
        data-cursor="hover"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[10px] uppercase tracking-widest2 text-[#F5EFE4]/60 transition-colors hover:text-[#F5EFE4]"
      >
        <ArrowDown size={12} className="animate-bounce" />
        {hero.location}
      </motion.button>
    </section>
  );
}
