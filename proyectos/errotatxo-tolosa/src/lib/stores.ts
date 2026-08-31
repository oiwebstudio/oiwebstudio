export type StoreStatus = "open" | "temp-closed" | "unpublished";

export type Store = {
  id: string;
  name: string;
  address: string;
  phone?: string;
  lat: number;
  lng: number;
  image: string;
  mapsQuery: string;
  status: StoreStatus;
  hours?: { weekday: string; weekend?: string };
  /** Horario comprimido para la tarjeta; el detalle vive en la sección de horarios. */
  hoursSummary?: string;
  rating?: number;
  reviews?: number;
  /** Además de despacho de pan, sirve cafetería con barra y mesas. */
  cafe?: boolean;
  /**
   * Qué datos están respaldados por una fuente pública (ficha de Google, registro
   * mercantil, directorios). Lo no verificado no se pinta como si lo estuviera.
   * Ver PROMPT-TIENDAS.md § A.4.
   */
  verified: { phone: boolean; hours: boolean; rating: boolean };
};

function parseRange(range: string): [number, number] | null {
  const parts = range
    .trim()
    .split(/[–-]/)
    .map((s) => s.trim());
  if (parts.length !== 2) return null;
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    if (Number.isNaN(h)) return null;
    return h * 60 + (m || 0);
  };
  const start = toMinutes(parts[0]);
  const end = toMinutes(parts[1]);
  if (start === null || end === null) return null;
  return [start, end];
}

export type LiveStatus = "open" | "closed" | "unknown";

export function isStoreOpenNow(store: Store, now = new Date()): LiveStatus {
  if (store.status !== "open" || !store.hours) return "unknown";

  const madridParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Madrid",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const weekday = madridParts.find((p) => p.type === "weekday")?.value ?? "";
  const hour = Number(madridParts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(madridParts.find((p) => p.type === "minute")?.value ?? "0");
  const currentMinutes = hour * 60 + minute;

  const isWeekend = weekday === "Sat" || weekday === "Sun";
  const schedule = isWeekend ? store.hours.weekend : store.hours.weekday;
  if (!schedule) return "unknown";

  const shifts = schedule.split("/").map((s) => parseRange(s));
  const open = shifts.some(
    (shift) => shift && currentMinutes >= shift[0] && currentMinutes <= shift[1]
  );
  return open ? "open" : "closed";
}

/**
 * Tres tiendas y solo tres: Andia, San Frantzisko y Anoeta.
 * No añadir aquí Amarotz, Ibarra, Azpeitia ni el obrador de San Esteban.
 */
/** Día de la semana en Madrid (0 = domingo), independiente del reloj del visitante. */
export function madridWeekday(now = new Date()): number {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Madrid",
    weekday: "short",
  }).format(now);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekday);
}

export function isWeekendInMadrid(now = new Date()): boolean {
  const d = madridWeekday(now);
  return d === 0 || d === 6;
}

/**
 * loc-live-status (biblioteca-animaciones): próxima hora de apertura.
 * Devuelve la siguiente franja de hoy si aún no ha llegado; si no, la primera
 * franja del día siguiente. `null` si no hay horario que consultar.
 */
export function nextOpening(store: Store, now = new Date()): string | null {
  if (store.status !== "open" || !store.hours) return null;

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Madrid",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  const current = hour * 60 + minute;

  const scheduleFor = (weekend: boolean) =>
    weekend ? store.hours?.weekend : store.hours?.weekday;

  const today = scheduleFor(isWeekendInMadrid(now));
  if (today) {
    for (const shift of today.split("/")) {
      const range = parseRange(shift);
      if (range && current < range[0]) return shift.trim().split(/[–-]/)[0].trim();
    }
  }

  const tomorrowWeekday = (madridWeekday(now) + 1) % 7;
  const tomorrow = scheduleFor(tomorrowWeekday === 0 || tomorrowWeekday === 6);
  if (!tomorrow) return null;
  return tomorrow.split("/")[0].trim().split(/[–-]/)[0].trim();
}

export function directionsUrl(store: Store): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`;
}

export const stores: Store[] = [
  {
    id: "tolosa-andia",
    name: "Tolosa — Andia",
    address: "Andia Kalea, 3, 20400 Tolosa, Gipuzkoa",
    phone: "943 65 54 92",
    lat: 43.1384065,
    lng: -2.0741355,
    image: "/images/fachada.jpg",
    mapsQuery: "Errotatxo Andia Kalea 3 Tolosa",
    status: "open",
    hours: { weekday: "7:00–19:00", weekend: "7:00–14:00" },
    hoursSummary: "L–V 7:00–19:00 · S–D 7:00–14:00",
    rating: 4.7,
    reviews: 11,
    verified: { phone: true, hours: true, rating: true },
  },
  {
    id: "tolosa-san-frantzisko",
    name: "Tolosa — San Frantzisko",
    address: "San Frantzisko Pasealekua, 24, 20400 Tolosa, Gipuzkoa",
    phone: "943 65 47 33",
    lat: 43.1343593,
    lng: -2.0788086,
    // Es la única de las tres con cafetería: barra, taburetes y mesas. La foto
    // del interior es la misma que abre la home.
    image: "/images/hero-interior.jpeg",
    mapsQuery: "Errotatxo San Frantzisko Pasealekua Tolosa",
    status: "open",
    // Horario confirmado por el cliente (ficha de Google), 09/08/2026.
    hours: { weekday: "7:30–14:00 / 16:00–20:30", weekend: "7:30–14:00" },
    hoursSummary: "L–V 7:30–14:00 y 16:00–20:30 · S–D 7:30–14:00",
    cafe: true,
    verified: { phone: true, hours: true, rating: false },
  },
  {
    id: "anoeta",
    name: "Anoeta",
    address: "San Juan Kalea, 2, 20270 Anoeta, Gipuzkoa",
    phone: "943 65 25 99",
    // Posición señalada por el cliente sobre el mapa: junto a Errotaldea lekua,
    // al este de la plaza. Los dos puntos anteriores (-2.07739 y -2.07160)
    // caían 500 m y 150 m al oeste del local.
    lat: 43.1620700,
    lng: -2.0697600,
    image: "/images/pan-tradicional.jpg",
    mapsQuery: "Errotatxo San Juan Kalea Anoeta",
    status: "open",
    // Horario confirmado por el cliente (ficha de Google), 09/08/2026.
    hours: { weekday: "7:00–13:30 / 16:00–20:30", weekend: "7:00–14:00" },
    hoursSummary: "L–V 7:00–13:30 y 16:00–20:30 · S–D 7:00–14:00",
    verified: { phone: true, hours: true, rating: false },
  },
];
