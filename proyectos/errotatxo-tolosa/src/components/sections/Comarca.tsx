"use client";

import AnimatedNumber from "@/components/motion/AnimatedNumber";
import FadeIn from "@/components/motion/FadeIn";
import RevealText from "@/components/motion/RevealText";
import { useLocale } from "@/lib/i18n";

/**
 * Dice en texto llano qué es Errotatxo y dónde está: panadería, pastelería y
 * cafetería en Tolosaldea. Es lo que Google necesita leer para asociar la web
 * con esas búsquedas. Las cifras son datos comprobables, no adornos.
 */
export default function Comarca() {
  const { t, locale } = useLocale();
  const copy = t.comarca;

  return (
    <section id="tolosaldea" className="relative bg-bg py-20 md:py-28">
      <div className="container-edge grid grid-cols-1 gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <FadeIn>
            <p className="eyebrow mb-3">{copy.eyebrow}</p>
            <div className="line-mark" />
          </FadeIn>
          <RevealText as="h2" lines={copy.title} className="display text-4xl md:text-5xl" />
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <FadeIn delay={0.1}>
            <p className="body-editorial">{copy.text}</p>
            {/* Mucha gente de la comarca busca en euskera: la frase va siempre,
                también en la versión en castellano que lee Google. */}
            {locale === "es" && (
              <p lang="eu" className="mt-4 font-serif text-lg italic text-madera">
                Okindegia, gozotegia eta kafetegia Tolosaldean.
              </p>
            )}
          </FadeIn>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-ink/10 pt-8">
            {copy.stats.map((stat, i) => (
              <FadeIn key={stat.label} delay={0.15 + i * 0.1}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <AnimatedNumber
                    value={stat.value}
                    duration={stat.value.length > 2 ? 2 : 1.2}
                    className="display text-4xl tabular-nums text-ink md:text-5xl"
                  />
                  <span aria-hidden className="mt-2 block text-xs leading-snug text-muted">
                    {stat.label}
                  </span>
                </dd>
              </FadeIn>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
