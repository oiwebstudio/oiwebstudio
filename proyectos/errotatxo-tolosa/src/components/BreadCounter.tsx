"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useLocale } from "@/lib/i18n";

function getMadridMinutesSinceMidnight(): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Madrid",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  return h * 60 + m;
}

function estimateBreadsToday(): number {
  const mins = getMadridMinutesSinceMidnight();
  // Bakery starts at 5:00 (300 min), peaks at 10:00 (600 min), slows after 14:00 (840 min)
  // Total daily production ~400 breads across 3 stores
  if (mins < 300) return 0;
  if (mins > 1200) return 420;
  const elapsed = mins - 300;
  const maxMins = 900; // 5:00 to 20:00
  // S-curve: fast in the morning, levels off in the afternoon
  const t = Math.min(elapsed / maxMins, 1);
  const s = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
  return Math.round(s * 420);
}

export default function BreadCounter() {
  const { t } = useLocale();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState("0");
  const [target, setTarget] = useState(0);

  useEffect(() => {
    const n = estimateBreadsToday();
    setTarget(n);
  }, []);

  useEffect(() => {
    if (target === 0) return;
    const controls = animate(count, target, {
      duration: 2.5,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [target, count]);

  useEffect(() => {
    return rounded.on("change", (v) => setDisplay(String(v)));
  }, [rounded]);

  if (target === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-baseline gap-3"
    >
      <span className="font-serif text-5xl italic tabular-nums text-madera md:text-7xl">
        {display}
      </span>
      <span className="max-w-[8rem] text-[11px] uppercase leading-tight tracking-widest2 text-muted">
        {t.smart?.breadCounterLabel ?? "panes horneados hoy"}
      </span>
    </motion.div>
  );
}
