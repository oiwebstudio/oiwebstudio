"use client";

import { useEffect, useState } from "react";
import { type Store, isStoreOpenNow } from "@/lib/stores";
import { useLocale } from "@/lib/i18n";

function getMinutesUntilClose(store: Store): number | null {
  if (!store.hours || store.status !== "open") return null;

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Madrid",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  const current = hour * 60 + minute;

  const isWeekend = weekday === "Sat" || weekday === "Sun";
  const schedule = isWeekend ? store.hours.weekend : store.hours.weekday;
  if (!schedule) return null;

  for (const shift of schedule.split("/")) {
    const rangeParts = shift.trim().split(/[–-]/);
    if (rangeParts.length !== 2) continue;
    const toMinutes = (t: string) => {
      const [h, m] = t.trim().split(":").map(Number);
      return h * 60 + (m || 0);
    };
    const start = toMinutes(rangeParts[0]);
    const end = toMinutes(rangeParts[1]);
    if (current >= start && current <= end) {
      return end - current;
    }
  }
  return null;
}

function formatRemaining(
  mins: number,
  locale: "es" | "eu"
): { text: string; urgent: boolean } {
  const urgent = mins <= 30;
  if (mins < 60) {
    return {
      text:
        locale === "eu"
          ? `${mins} min barru ixten du`
          : `Cierra en ${mins} min`,
      urgent,
    };
  }
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const hLabel = locale === "eu" ? "h" : "h";
  const timeStr = m > 0 ? `${h}${hLabel} ${m} min` : `${h}${hLabel}`;
  return {
    text: locale === "eu" ? `${timeStr} barru ixten du` : `Cierra en ${timeStr}`,
    urgent,
  };
}

export default function TimeToClose({ store }: { store: Store }) {
  const { locale } = useLocale();
  const [remaining, setRemaining] = useState<{
    text: string;
    urgent: boolean;
  } | null>(null);

  useEffect(() => {
    const tick = () => {
      const status = isStoreOpenNow(store);
      if (status !== "open") {
        setRemaining(null);
        return;
      }
      const mins = getMinutesUntilClose(store);
      if (mins === null || mins > 180) {
        setRemaining(null);
        return;
      }
      setRemaining(formatRemaining(mins, locale));
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [store, locale]);

  if (!remaining) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest2 ${
        remaining.urgent
          ? "text-amber-600 dark:text-amber-400"
          : "text-muted"
      }`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {remaining.urgent && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-60" />
        )}
        <span
          className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
            remaining.urgent ? "bg-amber-500" : "bg-muted/40"
          }`}
        />
      </span>
      {remaining.text}
    </span>
  );
}
