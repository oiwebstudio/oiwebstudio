"use client";

import { useLocale } from "@/lib/i18n";

export default function Marquee() {
  const { t } = useLocale();
  const items = t.marquee.items;
  const track = [...items, ...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-ink/[0.07] bg-lino/30 py-4 md:py-5">
      <div className="flex w-max animate-marquee gap-8 motion-reduce:animate-none md:gap-12">
        {track.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-8 text-xs uppercase tracking-widest2 text-muted md:gap-12 md:text-sm"
          >
            <span className="whitespace-nowrap font-serif italic text-ink/70">
              {item}
            </span>
            <span
              aria-hidden
              className="h-1 w-1 shrink-0 rotate-45 bg-sol/60"
            />
          </span>
        ))}
      </div>
    </div>
  );
}
