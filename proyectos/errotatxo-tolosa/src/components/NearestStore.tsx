"use client";

import { MapPin, Navigation, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/lib/i18n";
import { directionsUrl, stores, type Store } from "@/lib/stores";

function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function NearestStore() {
  const { t } = useLocale();
  const [nearest, setNearest] = useState<{ store: Store; km: number } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;
    if (sessionStorage.getItem("errotatxo-nearest-dismissed")) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let best: { store: Store; km: number } | null = null;
        for (const store of stores) {
          const km = haversine(latitude, longitude, store.lat, store.lng);
          if (!best || km < best.km) best = { store, km };
        }
        if (best && best.km < 50) setNearest(best);
      },
      () => {},
      { timeout: 8000, maximumAge: 300000 }
    );
  }, []);

  const dismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("errotatxo-nearest-dismissed", "1");
  };

  if (!nearest || dismissed) return null;

  const label = nearest.km < 1
    ? `${Math.round(nearest.km * 1000)} m`
    : `${nearest.km.toFixed(1)} km`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ delay: 2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-20 left-4 right-4 z-[45] mx-auto max-w-sm md:bottom-6 md:left-auto md:right-6"
      >
        <div className="flex items-center gap-3 rounded-2xl bg-surface/95 px-4 py-3 shadow-[0_12px_40px_-12px_rgba(43,30,20,0.5)] ring-1 ring-ink/[0.08] backdrop-blur-xl">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sol/20">
            <Navigation size={18} className="text-madera" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-widest2 text-muted">
              {t.smart?.nearestLabel ?? "Tu tienda más cercana"}
            </p>
            <p className="truncate text-sm font-medium text-ink">
              {nearest.store.name}
              <span className="ml-1.5 text-xs text-muted">· {label}</span>
            </p>
          </div>
          <a
            href={directionsUrl(nearest.store)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-carbon text-[#F7F1E6] transition-colors hover:bg-madera"
            aria-label={t.tiendas.routeCta}
          >
            <MapPin size={14} />
          </a>
          <button
            type="button"
            onClick={dismiss}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:text-ink"
            aria-label={t.nav.close}
          >
            <X size={14} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
