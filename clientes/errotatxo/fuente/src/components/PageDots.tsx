"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function PageDots() {
  const { t } = useLocale();
  const pathname = usePathname();
  const links = t.nav.sections;
  const index = links.findIndex((s) => s.href === pathname);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 xl:flex xl:flex-col xl:items-center xl:gap-3"
    >
      {links.map((s, i) => {
        const active = i === index;
        return (
          <Link
            key={s.href}
            href={s.href}
            data-cursor="hover"
            aria-label={s.label}
            className="group pointer-events-auto relative flex items-center justify-center py-1"
          >
            <span
              className={cn(
                "block rounded-full transition-all duration-500",
                active ? "h-6 w-1.5 bg-madera" : "h-1.5 w-1.5 bg-ink/20 group-hover:bg-madera/60"
              )}
            />
            <span className="pointer-events-none absolute left-5 whitespace-nowrap rounded-full bg-surface px-3 py-1 text-[10px] uppercase tracking-widest2 text-ink opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100">
              {s.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
