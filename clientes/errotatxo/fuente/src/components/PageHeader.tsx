"use client";

import { motion } from "framer-motion";
import AnimatedNumber from "@/components/motion/AnimatedNumber";
import FadeIn from "@/components/motion/FadeIn";
import RevealText from "@/components/motion/RevealText";

const EASE = [0.22, 1, 0.36, 1] as const;

export type PageStat = { value: string; suffix?: string; label: string };

export default function PageHeader({
  eyebrow,
  title,
  intro,
  stats = [],
}: {
  eyebrow: string;
  title: string[];
  intro: string;
  stats?: PageStat[];
}) {
  return (
    <section className="relative overflow-hidden bg-bg pb-16 pt-36 md:pb-24 md:pt-44">
      {/* halo cálido de marca */}
      <div className="pointer-events-none absolute -right-32 -top-24 h-[30rem] w-[30rem] rounded-full bg-sol/15 blur-3xl" />

      <div className="container-edge relative">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="eyebrow mb-4"
        >
          {eyebrow}
        </motion.p>
        <div className="line-mark" />

        <RevealText
          as="h1"
          lines={title}
          delay={0.15}
          className="display text-[clamp(2.6rem,7vw,5.5rem)]"
        />

        <FadeIn delay={0.45}>
          <p className="body-editorial mt-7 max-w-xl">{intro}</p>
        </FadeIn>

        {stats.length > 0 && (
          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-md bg-ink/10 md:mt-20 md:grid-cols-4">
            {stats.map((s, i) => (
              <FadeIn key={s.label} delay={0.5 + i * 0.08} className="bg-bg p-6 md:p-8">
                <AnimatedNumber
                  value={s.value}
                  suffix={s.suffix}
                  className="display mb-2 text-4xl md:text-5xl"
                />
                <p className="text-[11px] uppercase leading-snug tracking-widest2 text-muted">
                  {s.label}
                </p>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
