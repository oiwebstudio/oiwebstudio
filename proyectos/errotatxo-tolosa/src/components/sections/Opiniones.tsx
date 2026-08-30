"use client";

import { ExternalLink, Quote, Star } from "lucide-react";
import FadeIn from "@/components/motion/FadeIn";
import Magnetic from "@/components/motion/Magnetic";
import RevealText from "@/components/motion/RevealText";
import Scramble from "@/components/motion/Scramble";
import { stores } from "@/lib/stores";
import { useLocale } from "@/lib/i18n";

function StarsRow({ size = 15, value = 5 }: { size?: number; value?: number }) {
  return (
    <div className="flex gap-0.5 text-sol" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={0}
          className={i < Math.round(value) ? "fill-current" : "fill-current opacity-25"}
        />
      ))}
    </div>
  );
}

export default function Opiniones() {
  const { t } = useLocale();

  // Solo entran las tiendas con valoración verificada en su ficha de Google.
  const rated = stores.filter((s) => s.verified.rating && typeof s.rating === "number");
  const avg =
    rated.reduce((sum, s) => sum + (s.rating ?? 0), 0) / Math.max(rated.length, 1);
  const avgLabel = avg.toFixed(1).replace(".", ",");
  const totalReviews = rated.reduce((sum, s) => sum + (s.reviews ?? 0), 0);

  const quotes = t.opiniones.quotes;
  // El marquee necesita ancho suficiente para no dejar hueco; se repite el
  // bloque real en vez de rellenar con testimonios inventados.
  const track = [...quotes, ...quotes, ...quotes, ...quotes];

  return (
    <section id="opiniones" className="relative overflow-hidden bg-bg py-24 md:py-36">
      {/* halo cálido muy bajo, para separar la sección sin oscurecerla */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-lino/60 to-transparent"
      />

      <div className="container-edge relative">
        <FadeIn>
          {/* text-scramble-scroll (biblioteca-animaciones) */}
          <Scramble text={t.opiniones.eyebrow} className="eyebrow mb-3 block" />
          <div className="line-mark" />
        </FadeIn>
        <RevealText
          as="h2"
          lines={t.opiniones.title}
          className="display mb-14 text-4xl md:mb-20 md:text-6xl"
        />

        {/* testi-rating-summary (biblioteca-animaciones): nota grande + desglose
            por tienda. Sin distribución inventada: solo lo que hay en Google. */}
        <FadeIn delay={0.1}>
          <div className="overflow-hidden rounded-[1.75rem] bg-surface shadow-[0_20px_60px_-40px_rgba(43,30,20,0.55)] ring-1 ring-ink/[0.07]">
            <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-sol to-transparent" />

            <div className="grid gap-10 p-8 md:grid-cols-[auto_1fr] md:gap-14 md:p-12">
              <div className="flex flex-col items-center gap-3 text-center md:items-start md:border-r md:border-ink/[0.07] md:pr-14 md:text-left">
                <span className="display text-7xl leading-none text-madera md:text-8xl">
                  {avgLabel}
                </span>
                <StarsRow size={18} value={avg} />
                <p className="text-[11px] uppercase tracking-widest2 text-muted">
                  {totalReviews} {t.opiniones.reviewCount} · Google
                </p>
              </div>

              <div className="flex flex-col justify-center gap-5">
                <ul className="flex flex-col gap-4">
                  {rated.map((store) => (
                    <li
                      key={store.id}
                      className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-ink/[0.06] pb-4 last:border-b-0 last:pb-0"
                    >
                      <span className="display text-lg">{store.name}</span>
                      <span className="flex items-center gap-3">
                        <StarsRow size={13} value={store.rating ?? 0} />
                        <span className="text-sm text-muted">
                          {store.rating?.toLocaleString("es-ES", {
                            minimumFractionDigits: 1,
                          })}
                          {store.reviews ? ` · ${store.reviews}` : ""}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>

                {/* btn-magnetic (biblioteca-animaciones) */}
                <Magnetic>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      rated[0]?.mapsQuery ?? "Errotatxo Tolosa"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    className="link-underline inline-flex w-fit items-center gap-1.5 text-[11px] uppercase tracking-widest2 text-ink"
                  >
                    {t.opiniones.readReviews} <ExternalLink size={12} />
                  </a>
                </Magnetic>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* testi-marquee + card-quote-rise (biblioteca-animaciones) */}
        <div className="group relative mt-12 [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)] md:mt-16">
          <div className="flex w-max animate-marquee gap-6 py-2 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            {track.map((q, i) => (
              <figure
                key={`${q.name}-${i}`}
                className="relative flex w-[16.5rem] shrink-0 flex-col justify-between overflow-hidden rounded-3xl bg-surface p-6 shadow-[0_16px_40px_-32px_rgba(43,30,20,0.5)] ring-1 ring-ink/[0.07] transition-all duration-500 ease-organic hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-28px_rgba(43,30,20,0.55)] hover:ring-sol/40 sm:w-80 sm:p-7"
              >
                <Quote
                  aria-hidden
                  size={64}
                  strokeWidth={0}
                  className="pointer-events-none absolute -right-2 -top-2 fill-sol/[0.13]"
                />

                <blockquote className="relative font-serif text-base italic leading-relaxed text-ink/85 sm:text-lg">
                  “{q.text}”
                </blockquote>

                <figcaption className="relative mt-6 flex items-center gap-3">
                  {/* card-avatar-row (biblioteca-animaciones): inicial en círculo */}
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-madera/10 font-serif text-sm italic text-madera">
                    {q.name.charAt(0)}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-xs uppercase tracking-widest2 text-ink">
                      {q.name}
                    </span>
                    <span className="text-[11px] text-muted">{q.role}</span>
                  </span>
                  <StarsRow size={11} />
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <FadeIn delay={0.2}>
          <p className="mt-8 text-xs text-muted/90">{t.opiniones.disclaimer}</p>
        </FadeIn>
      </div>
    </section>
  );
}
