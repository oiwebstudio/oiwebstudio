"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/i18n";

const LABELS_ES = {
  fresh: "Recién hecho",
  morning: "Del horno de hoy",
  afternoon: "Horneado esta mañana",
} as const;

const LABELS_EU = {
  fresh: "Egin berria",
  morning: "Gaurko labetik",
  afternoon: "Goizean laberatua",
} as const;

function getMadridHour(): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Madrid",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  return Number(parts.find((p) => p.type === "hour")?.value ?? "0");
}

function getFreshness(): { level: number; key: keyof typeof LABELS_ES } {
  const h = getMadridHour();
  if (h < 5 || h >= 20) return { level: 0, key: "fresh" };
  if (h < 9) return { level: 1, key: "fresh" };
  if (h < 13) return { level: 0.7, key: "morning" };
  return { level: 0.4, key: "afternoon" };
}

export default function FreshnessMeter() {
  const { locale } = useLocale();
  const [freshness, setFreshness] = useState<{
    level: number;
    key: keyof typeof LABELS_ES;
  } | null>(null);

  useEffect(() => {
    setFreshness(getFreshness());
  }, []);

  if (!freshness) return null;

  const labels = locale === "eu" ? LABELS_EU : LABELS_ES;
  const label = labels[freshness.key];
  const dots = 5;
  const activeDots = Math.max(1, Math.round(freshness.level * dots));
  // Warm color gradient: green → gold → amber
  const colors = [
    "bg-green-500",
    "bg-green-400",
    "bg-sol",
    "bg-amber-400",
    "bg-amber-300",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-3"
    >
      <div className="flex gap-1">
        {Array.from({ length: dots }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-4 rounded-full transition-colors duration-500 ${
              i < activeDots ? colors[i] : "bg-ink/10"
            }`}
          />
        ))}
      </div>
      <span className="text-[11px] uppercase tracking-widest2 text-muted">
        {label}
      </span>
    </motion.div>
  );
}
