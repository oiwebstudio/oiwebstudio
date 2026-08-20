"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import FadeIn from "@/components/motion/FadeIn";
import RevealText from "@/components/motion/RevealText";
import Scramble from "@/components/motion/Scramble";
import { useLocale } from "@/lib/i18n";

export default function Cronologia() {
  const { t } = useLocale();
  const copy = t.cronologia;
  const listRef = useRef<HTMLOListElement>(null);

  // scroll-steps-line (biblioteca-animaciones): la línea vertical se dibuja
  // conforme la sección atraviesa la pantalla.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 80%", "end 60%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="cronologia" className="relative bg-lino/30 py-24 md:py-32">
      <div className="container-edge mb-14 md:mb-20">
        <FadeIn>
          {/* text-scramble-scroll (biblioteca-animaciones) */}
          <Scramble text={copy.eyebrow} className="eyebrow mb-3 block" />
          <div className="line-mark" />
        </FadeIn>
        <RevealText as="h2" lines={copy.title} className="display text-4xl md:text-6xl" />
      </div>

      <div className="container-edge">
        <ol ref={listRef} className="relative pl-8 md:pl-12">
          <span aria-hidden className="absolute inset-y-0 left-0 w-px bg-ink/10" />
          <motion.span
            aria-hidden
            style={{ scaleY: lineScale }}
            className="absolute inset-y-0 left-0 w-px origin-top bg-madera"
          />

          {copy.steps.map((step, i) => (
            <FadeIn key={step.title} delay={0.08 * i} className="relative pb-12 last:pb-0">
              {/* loc-pin-drop (biblioteca-animaciones): el punto cae sobre la línea */}
              <span
                aria-hidden
                className="fx-pin-drop absolute -left-[2.15rem] top-2 h-2.5 w-2.5 rounded-full bg-madera md:-left-[3.15rem]"
                style={{ animationDelay: `${0.15 + i * 0.08}s` }}
              />
              <p className="mb-2 text-xs uppercase tracking-widest2 text-madera">{step.year}</p>
              <h3 className="display mb-3 text-2xl md:text-3xl">{step.title}</h3>
              <p className="body-editorial max-w-xl text-sm md:text-base">{step.text}</p>
            </FadeIn>
          ))}
        </ol>
      </div>
    </section>
  );
}
