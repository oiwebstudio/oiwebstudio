"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { isStoreOpenNow, stores } from "@/lib/stores";

type TimeSlot = "morning" | "afternoon" | "evening" | "night";

function getMadridHour(): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Madrid",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  return Number(parts.find((p) => p.type === "hour")?.value ?? "12");
}

function getTimeSlot(hour: number): TimeSlot {
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 22) return "evening";
  return "night";
}

const GREETINGS: Record<string, Record<TimeSlot, string>> = {
  es: {
    morning: "Buenos días",
    afternoon: "Buenas tardes",
    evening: "Buenas tardes",
    night: "Buenas noches",
  },
  eu: {
    morning: "Egun on",
    afternoon: "Arratsalde on",
    evening: "Arratsalde on",
    night: "Gabon",
  },
};

const STATUS_MSG: Record<string, { open: string; closed: string }> = {
  es: { open: "Estamos abiertos", closed: "Ahora cerrado" },
  eu: { open: "Irekita gaude", closed: "Orain itxita" },
};

export default function SmartGreeting({ locale = "es" }: { locale?: string }) {
  const [info, setInfo] = useState<{ greeting: string; status: string; isOpen: boolean } | null>(null);

  useEffect(() => {
    const hour = getMadridHour();
    const slot = getTimeSlot(hour);
    const greeting = GREETINGS[locale]?.[slot] ?? GREETINGS.es[slot];
    const anyOpen = stores.some((s) => isStoreOpenNow(s) === "open");
    const msgs = STATUS_MSG[locale] ?? STATUS_MSG.es;
    setInfo({ greeting, status: anyOpen ? msgs.open : msgs.closed, isOpen: anyOpen });
  }, [locale]);

  if (!info) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="inline-flex items-center gap-2 rounded-full bg-[#F5EFE4]/10 px-3.5 py-1.5 backdrop-blur-sm"
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
            info.isOpen ? "bg-green-400/60" : "bg-red-400/60"
          }`}
        />
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            info.isOpen ? "bg-green-400" : "bg-red-400"
          }`}
        />
      </span>
      <span className="text-[11px] tracking-wide text-[#F5EFE4]/80">
        {info.greeting} · {info.status}
      </span>
    </motion.div>
  );
}
