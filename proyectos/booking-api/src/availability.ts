import { prisma } from "./prisma.js";

const DAY_CODES = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;
type DayCode = (typeof DAY_CODES)[number];

interface TimeRange {
  startMinutes: number; // minutos desde medianoche
  endMinutes: number;
}

interface DayRule {
  day: DayCode;
  ranges: TimeRange[];
}

/** Parsea un subset de la sintaxis OSM opening_hours, ej: "Mo-Fr 09:00-19:00; Sa 10:00-14:00" */
export function parseOpeningHours(osm: string): DayRule[] {
  const rules: DayRule[] = [];
  const groups = osm.split(";").map((g) => g.trim()).filter(Boolean);

  for (const group of groups) {
    const match = group.match(/^([A-Za-z,\-]+)\s+(.+)$/);
    if (!match) continue;
    const [, daySpec, timeSpec] = match;

    const days = expandDaySpec(daySpec);
    const ranges = timeSpec
      .split(",")
      .map((t) => t.trim())
      .map(parseTimeRange)
      .filter((r): r is TimeRange => r !== null);

    for (const day of days) {
      rules.push({ day, ranges });
    }
  }

  return rules;
}

function expandDaySpec(spec: string): DayCode[] {
  const out: DayCode[] = [];
  for (const part of spec.split(",")) {
    const rangeMatch = part.match(/^([A-Za-z]{2})-([A-Za-z]{2})$/);
    if (rangeMatch) {
      const start = DAY_CODES.indexOf(rangeMatch[1] as DayCode);
      const end = DAY_CODES.indexOf(rangeMatch[2] as DayCode);
      if (start === -1 || end === -1) continue;
      for (let i = start; i <= end; i++) out.push(DAY_CODES[i]);
    } else if (DAY_CODES.includes(part as DayCode)) {
      out.push(part as DayCode);
    }
  }
  return out;
}

function parseTimeRange(spec: string): TimeRange | null {
  const m = spec.match(/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const startMinutes = Number(m[1]) * 60 + Number(m[2]);
  const endMinutes = Number(m[3]) * 60 + Number(m[4]);
  if (endMinutes <= startMinutes) return null;
  return { startMinutes, endMinutes };
}

/** Devuelve los rangos abiertos para un día concreto (0=domingo, igual que Date#getDay). */
export function rangesForWeekday(rules: DayRule[], jsWeekday: number): TimeRange[] {
  const dayCode = DAY_CODES[(jsWeekday + 6) % 7]; // JS: 0=domingo; DAY_CODES: 0=lunes
  return rules.filter((r) => r.day === dayCode).flatMap((r) => r.ranges);
}

export interface SlotOptions {
  slotIntervalMinutes: number;
  durationMinutes: number;
  leadTimeMinutes: number;
  now?: Date;
}

/** Calcula los horarios de inicio posibles para una fecha dada, dado el horario de apertura y la duración del servicio. */
export function computeSlotsForDate(
  openingHours: string,
  date: Date,
  opts: SlotOptions,
): Date[] {
  const rules = parseOpeningHours(openingHours);
  const ranges = rangesForWeekday(rules, date.getDay());
  if (ranges.length === 0) return [];

  const now = opts.now ?? new Date();
  const earliestAllowed = new Date(now.getTime() + opts.leadTimeMinutes * 60_000);

  const slots: Date[] = [];
  for (const range of ranges) {
    for (
      let minutes = range.startMinutes;
      minutes + opts.durationMinutes <= range.endMinutes;
      minutes += opts.slotIntervalMinutes
    ) {
      const slotStart = new Date(date);
      slotStart.setHours(0, 0, 0, 0);
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      slotStart.setHours(hours, mins, 0, 0);
      if (slotStart >= earliestAllowed) slots.push(slotStart);
    }
  }
  return slots;
}

/** Comprueba si una franja sigue libre contando reservas confirmadas que se solapen. */
export async function isSlotAvailable(
  businessId: string,
  serviceId: string,
  startsAt: Date,
  endsAt: Date,
  capacity: number,
): Promise<boolean> {
  const overlapping = await prisma.booking.count({
    where: {
      businessId,
      serviceId,
      status: "CONFIRMED",
      startsAt: { lt: endsAt },
      endsAt: { gt: startsAt },
    },
  });
  return overlapping < capacity;
}

/** Resuelve la capacidad efectiva para un servicio (el propio servicio pisa la config del negocio). */
export function effectiveCapacity(service: { capacity: number | null }, bookingConfig: { capacity: number }): number {
  return service.capacity ?? bookingConfig.capacity;
}
