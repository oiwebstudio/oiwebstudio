"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n";
import { isStoreOpenNow, nextOpening, type LiveStatus, type Store } from "@/lib/stores";

export default function LiveStatusBadge({ store }: { store: Store }) {
  const { t } = useLocale();
  const [status, setStatus] = useState<LiveStatus>(() => isStoreOpenNow(store));
  // loc-live-status (biblioteca-animaciones): cuando está cerrada, se anuncia
  // la próxima apertura en vez de dejar solo el "cerrado".
  const [opensAt, setOpensAt] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      setStatus(isStoreOpenNow(store));
      setOpensAt(nextOpening(store));
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [store]);

  if (status === "unknown") return null;

  const open = status === "open";

  return (
    <span className="inline-flex flex-wrap items-center gap-1.5 text-[11px] uppercase tracking-widest2">
      <span className="relative flex h-2 w-2">
        {open && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${open ? "bg-green-500" : "bg-muted/60"}`}
        />
      </span>
      <span className={open ? "text-green-700 dark:text-green-400" : "text-muted"}>
        {open ? t.ubicacion.openNow : t.ubicacion.closedNow}
      </span>
      {!open && opensAt && (
        <span className="text-madera">
          · {t.tiendas.opensAt.replace("{time}", opensAt)}
        </span>
      )}
    </span>
  );
}
