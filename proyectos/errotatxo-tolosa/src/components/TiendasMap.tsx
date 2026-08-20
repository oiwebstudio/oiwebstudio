"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import LiveStatusBadge from "@/components/LiveStatusBadge";
import { useLocale } from "@/lib/i18n";
import imageLoader from "@/lib/imageLoader";
import { stores, type Store } from "@/lib/stores";

/* loc-pin-drop (biblioteca-animaciones): los pines caen y rebotan al aparecer,
   escalonados por índice. El halo late solo en los abiertos. */
function pinIcon(color: string, delay = 0, pulse = false) {
  return L.divIcon({
    className: "",
    html: `<div class="fx-pin-drop" style="animation-delay:${delay}s;position:relative;width:16px;height:16px">
      ${pulse ? `<span style="position:absolute;inset:-6px;border-radius:9999px;background:${color};opacity:.25;animation:ping 2.4s cubic-bezier(0,0,.2,1) infinite"></span>` : ""}
      <span style="position:absolute;inset:0;border-radius:9999px;background:${color};border:2px solid #F8F5F0;box-shadow:0 1px 6px rgba(0,0,0,.45)"></span>
    </div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10],
  });
}

const openIcon = (i: number) => pinIcon("#A9825A", 0.12 * i, true);
const closedIcon = (i: number) => pinIcon("#9CA3AF", 0.12 * i);

function StorePopup({ store }: { store: Store }) {
  const { t } = useLocale();
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.mapsQuery)}`;

  return (
    <div className="w-56 overflow-hidden">
      <div className="relative h-28 w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageLoader({ src: store.image })} alt={store.name} className="h-full w-full object-cover" />
      </div>
      <div className="p-3">
        <p className="font-serif text-base leading-tight text-[#15110D]">{store.name}</p>
        <p className="mt-1 text-xs leading-snug text-[#15110D]/60">{store.address}</p>
        <div className="mt-1.5">
          <LiveStatusBadge store={store} />
        </div>

        {store.status === "temp-closed" && (
          <p className="mt-2 text-xs font-medium text-red-600">{t.ubicacion.tempClosed}</p>
        )}
        {store.status === "unpublished" && (
          <p className="mt-2 text-xs text-[#15110D]/55">{t.ubicacion.unpublished}</p>
        )}
        {store.hours && (
          <div className="mt-2 space-y-0.5 text-xs text-[#15110D]/80">
            <p>
              <span className="text-[#A9825A]">{t.ubicacion.weekdayLabel}:</span> {store.hours.weekday}
            </p>
            {store.hours.weekend ? (
              <p>
                <span className="text-[#A9825A]">{t.ubicacion.weekendLabel}:</span> {store.hours.weekend}
              </p>
            ) : (
              <p className="text-[#15110D]/50">{t.ubicacion.checkWeekend}</p>
            )}
          </div>
        )}

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-[11px] uppercase tracking-widest2 text-[#A9825A] underline underline-offset-2"
        >
          {t.ubicacion.viewOnMaps}
        </a>
      </div>
    </div>
  );
}

/**
 * loc-map-card (biblioteca-animaciones): el mapa vuela a la tienda elegida en
 * la tarjeta de acción. Sin `focusId` mantiene el encuadre de las tres.
 */
function FlyTo({ focusId }: { focusId?: string }) {
  const map = useMap();

  useEffect(() => {
    if (!focusId) return;
    const store = stores.find((s) => s.id === focusId);
    if (!store) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      map.setView([store.lat, store.lng], 16, { animate: false });
      return;
    }
    map.flyTo([store.lat, store.lng], 16, { duration: 1.1 });
  }, [focusId, map]);

  return null;
}

export default function TiendasMap({ focusId }: { focusId?: string }) {
  const bounds = useMemo(
    () => L.latLngBounds(stores.map((s) => [s.lat, s.lng] as [number, number])),
    []
  );

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [36, 36] }}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap &copy; CARTO'
      />
      <FlyTo focusId={focusId} />
      {stores.map((store, i) => (
        <Marker
          key={store.id}
          position={[store.lat, store.lng]}
          icon={store.status === "open" ? openIcon(i) : closedIcon(i)}
          eventHandlers={{
            mouseover: (e) => e.target.openPopup(),
          }}
        >
          <Popup closeButton={false} maxWidth={224} className="store-popup">
            <StorePopup store={store} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
