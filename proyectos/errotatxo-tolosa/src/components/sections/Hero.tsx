"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Magnetic from "@/components/motion/Magnetic";
import Parallax from "@/components/motion/Parallax";
import RevealText from "@/components/motion/RevealText";
import Particles from "@/components/Particles";
import imageLoader from "@/lib/imageLoader";
import { useLocale } from "@/lib/i18n";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const { t } = useLocale();
  const hero = t.hero;

  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-[92svh] items-end overflow-hidden rounded-b-[2rem] pb-28 pt-32 md:min-h-[100svh] md:rounded-none md:pb-40 md:pt-36"
    >
      {/* Fondo: la cafetería de San Frantzisko, con parallax y un acercamiento
          lento al entrar. Es una <img> de verdad (no un fondo CSS) para que el
          navegador la pida la primera: es lo más grande de la página. */}
      <Parallax speed={0.15} className="absolute inset-0 z-0">
        <motion.img
          src={imageLoader({ src: "/images/hero-interior.webp" })}
          alt="Cafetería y mostrador de Errotatxo en San Frantzisko, Tolosa"
          fetchPriority="high"
          initial={{ scale: 1.14 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.6, ease: EASE }}
          className="h-[120%] w-full object-cover object-center motion-reduce:!transform-none"
        />
      </Parallax>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#150D07] via-[#150D07]/60 to-[#150D07]/25" />
      <Particles className="z-[1] opacity-60" />

      <div className="container-edge relative z-10 w-full">
        <div className="max-w-4xl">
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
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <Link
                href="#panes"
                data-cursor="hover"
                className="inline-block rounded-full bg-sol px-7 py-3.5 text-xs font-medium uppercase tracking-widest2 text-[#4E2E1B] transition-colors duration-300 hover:bg-[#F5EFE4]"
              >
                {hero.cta}
              </Link>
            </Magnetic>
            <Link
              href="#cafeteria"
              data-cursor="hover"
              className="inline-block rounded-full border border-[#F5EFE4]/35 px-7 py-3.5 text-xs font-medium uppercase tracking-widest2 text-[#F5EFE4] backdrop-blur-sm transition-colors duration-300 hover:border-[#F5EFE4] hover:bg-[#F5EFE4]/10"
            >
              {hero.cta2}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
