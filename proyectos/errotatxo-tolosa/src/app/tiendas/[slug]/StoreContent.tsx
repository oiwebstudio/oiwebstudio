"use client";

import { ArrowLeft, ArrowUpRight, Clock, ExternalLink, MapPin, Phone, Star } from "lucide-react";
import Link from "next/link";
import LiveStatusBadge from "@/components/LiveStatusBadge";
import FadeIn from "@/components/motion/FadeIn";
import RevealImage from "@/components/motion/RevealImage";
import RevealText from "@/components/motion/RevealText";
import PageTransition from "@/components/PageTransition";
import TimeToClose from "@/components/TimeToClose";
import { useLocale } from "@/lib/i18n";
import { directionsUrl, storePath, stores } from "@/lib/stores";

/** "7:30–14:00 / 16:00–20:30" → ["7:30–14:00", "16:00–20:30"] */
const shifts = (s?: string) => (s ?? "").split("/").map((x) => x.trim()).filter(Boolean);

export default function StoreContent({ id }: { id: string }) {
  const { t } = useLocale();
  const store = stores.find((s) => s.id === id)!;
  const copy = t.tiendas.stores[store.id];
  const labels = t.storePage;
  const others = stores.filter((s) => s.id !== store.id);

  return (
    <PageTransition>
      <section className="relative overflow-hidden bg-bg pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="pointer-events-none absolute -right-32 -top-24 h-[30rem] w-[30rem] rounded-full bg-sol/15 blur-3xl" />

        <div className="container-edge relative">
          <Link
            href="/tiendas/"
            data-cursor="hover"
            className="mb-10 inline-flex min-h-[44px] items-center gap-2 text-[11px] uppercase tracking-widest2 text-muted transition-colors hover:text-madera"
          >
            <ArrowLeft size={14} /> {labels.back}
          </Link>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-6">
              <p className="eyebrow mb-4 flex flex-wrap items-center gap-2.5">
                Errotatxo · {store.locality}
                {store.cafe && (
                  <span className="rounded-full bg-sol/20 px-2.5 py-1 text-[10px] text-madera">
                    {t.tiendas.cafeTag}
                  </span>
                )}
              </p>
              <div className="line-mark" />
              <RevealText
                as="h1"
                lines={copy.h1}
                delay={0.1}
                className="display text-[clamp(2.4rem,6vw,4.75rem)]"
              />

              <div className="mt-6 flex flex-col gap-1">
                <LiveStatusBadge store={store} />
                <TimeToClose store={store} />
              </div>

              <FadeIn delay={0.3}>
                <p className="body-editorial mt-8 max-w-lg">{copy.about}</p>
              </FadeIn>

              <FadeIn delay={0.4}>
                <dl className="mt-10 divide-y divide-ink/10 border-y border-ink/10 text-sm">
                  <div className="flex gap-4 py-4">
                    <dt className="flex w-28 shrink-0 items-start gap-2 text-[11px] uppercase tracking-widest2 text-muted">
                      <MapPin size={14} className="text-madera" /> {labels.address}
                    </dt>
                    <dd className="text-ink">
                      {store.address}
                      <a
                        href={directionsUrl(store)}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="hover"
                        className="link-underline mt-2 flex min-h-[44px] w-fit items-center gap-1.5 text-[11px] uppercase tracking-widest2 text-madera"
                      >
                        {t.tiendas.routeCta} <ExternalLink size={12} />
                      </a>
                    </dd>
                  </div>

                  {store.hours && (
                    <div className="flex gap-4 py-4">
                      <dt className="flex w-28 shrink-0 items-start gap-2 text-[11px] uppercase tracking-widest2 text-muted">
                        <Clock size={14} className="text-madera" /> {labels.hours}
                      </dt>
                      <dd className="space-y-2 text-ink">
                        <p>
                          <span className="block text-xs text-muted">{t.ubicacion.weekdayLabel}</span>
                          {shifts(store.hours.weekday).join(" · ")}
                        </p>
                        {store.hours.weekend && (
                          <p>
                            <span className="block text-xs text-muted">{t.ubicacion.weekendLabel}</span>
                            {shifts(store.hours.weekend).join(" · ")}
                          </p>
                        )}
                      </dd>
                    </div>
                  )}

                  {store.phone && store.verified.phone && (
                    <div className="flex gap-4 py-4">
                      <dt className="flex w-28 shrink-0 items-start gap-2 text-[11px] uppercase tracking-widest2 text-muted">
                        <Phone size={14} className="text-madera" /> {labels.phone}
                      </dt>
                      <dd>
                        <a
                          href={`tel:${store.phone.replace(/\s/g, "")}`}
                          data-cursor="hover"
                          className="font-serif text-xl text-madera"
                        >
                          {store.phone}
                        </a>
                      </dd>
                    </div>
                  )}

                  {store.verified.rating && store.rating && (
                    <div className="flex items-center gap-2 py-4 text-xs text-muted">
                      <Star size={14} className="text-madera" />
                      {store.rating.toLocaleString("es-ES", { minimumFractionDigits: 1 })}{" "}
                      {t.tiendas.ratingLabel}
                      {store.reviews ? ` (${store.reviews})` : ""}
                    </div>
                  )}
                </dl>
              </FadeIn>
            </div>

            <FadeIn delay={0.2} className="order-first md:order-none md:col-span-6">
              <RevealImage
                src={store.image}
                alt={copy.imageAlt}
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="aspect-[4/5] w-full rounded-[1.5rem] shadow-[0_14px_40px_-22px_rgba(43,30,20,0.55)] md:rounded-md md:shadow-none"
              />
            </FadeIn>
          </div>

          <FadeIn className="mt-20 md:mt-28">
            <p className="mb-3 text-[11px] uppercase tracking-widest2 text-muted">{labels.others}</p>
            <ul className="grid grid-cols-1 divide-y divide-ink/10 border-y border-ink/10 md:grid-cols-2 md:divide-x md:divide-y-0">
              {others.map((s) => (
                <li key={s.id}>
                  <Link
                    href={storePath(s)}
                    data-cursor="hover"
                    className="group flex min-h-[44px] items-center justify-between gap-4 py-5 md:px-6 md:first:pl-0"
                  >
                    <span>
                      <span className="font-serif text-xl italic text-ink transition-colors group-hover:text-madera">
                        {s.name}
                      </span>
                      <span className="block text-xs text-muted">
                        {s.street}, {s.locality}
                        {s.cafe && ` · ${t.tiendas.cafeTag}`}
                      </span>
                    </span>
                    <ArrowUpRight size={16} className="shrink-0 text-madera" />
                  </Link>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>
    </PageTransition>
  );
}
