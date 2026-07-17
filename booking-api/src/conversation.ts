import { prisma } from "./prisma.js";
import { computeSlotsForDate, effectiveCapacity, isSlotAvailable } from "./availability.js";

export type ChatStep =
  | "GREETING"
  | "SELECT_SERVICE"
  | "SELECT_DATE"
  | "SELECT_SLOT"
  | "COLLECT_NAME"
  | "COLLECT_PHONE"
  | "CONFIRM"
  | "BOOKED"
  | "CANCELLED";

export interface ChatState {
  step: ChatStep;
  serviceId?: string;
  serviceName?: string;
  date?: string; // ISO yyyy-mm-dd
  slotStartsAt?: string; // ISO datetime
  name?: string;
  phone?: string;
}

export interface QuickReply {
  label: string;
  value: string;
}

export interface BotMessage {
  text: string;
  quickReplies?: QuickReply[];
  expectsFreeText?: boolean;
}

export interface ChatInput {
  /** "value" viene de un quick reply pulsado, o de texto libre escrito por el usuario. */
  value: string;
}

export interface TurnResult {
  state: ChatState;
  status: "ACTIVE" | "COMPLETED" | "ABANDONED";
  messages: BotMessage[];
}

const DAYS_AHEAD = 7;
const WEEKDAY_LABEL = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

export function initialState(): ChatState {
  return { step: "GREETING" };
}

export function greetingMessages(businessName: string): BotMessage[] {
  return [
    {
      text: `¡Hola! 👋 Soy el asistente de reservas de ${businessName}. ¿Quieres reservar?`,
      quickReplies: [{ label: "Reservar cita", value: "start_booking" }],
    },
  ];
}

/** Reducer puro (salvo las lecturas/escrituras de reservas necesarias para calcular disponibilidad). */
export async function processTurn(
  businessId: string,
  state: ChatState,
  input: ChatInput,
): Promise<TurnResult> {
  switch (state.step) {
    case "GREETING":
      return selectServiceStep(businessId);

    case "SELECT_SERVICE":
      return handleSelectService(businessId, input);

    case "SELECT_DATE":
      return handleSelectDate(businessId, state, input);

    case "SELECT_SLOT":
      return handleSelectSlot(businessId, state, input);

    case "COLLECT_NAME":
      return handleCollectName(state, input);

    case "COLLECT_PHONE":
      return handleCollectPhone(businessId, state, input);

    case "CONFIRM":
      return handleConfirm(businessId, state, input);

    default:
      return {
        state,
        status: "COMPLETED",
        messages: [{ text: "Esta conversación ya ha terminado. ¡Escríbenos de nuevo cuando quieras!" }],
      };
  }
}

async function selectServiceStep(businessId: string): Promise<TurnResult> {
  const services = await prisma.service.findMany({
    where: { businessId, active: true },
    orderBy: { sortOrder: "asc" },
  });

  if (services.length === 0) {
    return {
      state: { step: "CANCELLED" },
      status: "ABANDONED",
      messages: [{ text: "Ahora mismo no tenemos servicios reservables configurados. ¡Escríbenos directamente!" }],
    };
  }

  return {
    state: { step: "SELECT_SERVICE" },
    status: "ACTIVE",
    messages: [
      {
        text: "¿Para qué servicio quieres reservar?",
        quickReplies: services.map((s) => ({
          label: s.priceLabel ? `${s.name} (${s.priceLabel})` : s.name,
          value: s.id,
        })),
      },
    ],
  };
}

async function handleSelectService(businessId: string, input: ChatInput): Promise<TurnResult> {
  const service = await prisma.service.findFirst({
    where: { id: input.value, businessId, active: true },
  });

  if (!service) {
    return selectServiceStep(businessId);
  }

  const business = await prisma.business.findUniqueOrThrow({ where: { id: businessId } });
  const config = await prisma.bookingConfig.findUnique({ where: { businessId } });
  const capacity = effectiveCapacity(service, config ?? { capacity: 1 });

  const dateOptions = findAvailableDates(business.openingHours ?? "", service.durationMinutes, config, DAYS_AHEAD);

  if (dateOptions.length === 0) {
    return {
      state: { step: "CANCELLED" },
      status: "ABANDONED",
      messages: [{ text: "No encontramos hueco en los próximos días. ¡Prueba a escribirnos más tarde!" }],
    };
  }

  return {
    state: { step: "SELECT_DATE", serviceId: service.id, serviceName: service.name },
    status: "ACTIVE",
    messages: [
      {
        text: `${service.name}. ¿Qué día te viene bien?`,
        quickReplies: dateOptions.map((d) => ({ label: formatDateLabel(d), value: isoDate(d) })),
      },
    ],
  };
}

function findAvailableDates(
  openingHours: string,
  durationMinutes: number,
  config: { slotIntervalMinutes: number; leadTimeMinutes: number } | null,
  daysAhead: number,
): Date[] {
  const out: Date[] = [];
  const today = new Date();
  for (let i = 0; i < daysAhead; i++) {
    const candidate = new Date(today);
    candidate.setDate(candidate.getDate() + i);
    const slots = computeSlotsForDate(openingHours, candidate, {
      slotIntervalMinutes: config?.slotIntervalMinutes ?? 30,
      durationMinutes,
      leadTimeMinutes: config?.leadTimeMinutes ?? 60,
    });
    if (slots.length > 0) out.push(candidate);
  }
  return out;
}

async function handleSelectDate(businessId: string, state: ChatState, input: ChatInput): Promise<TurnResult> {
  if (!state.serviceId) return selectServiceStep(businessId);

  const service = await prisma.service.findUniqueOrThrow({ where: { id: state.serviceId } });
  const business = await prisma.business.findUniqueOrThrow({ where: { id: businessId } });
  const config = await prisma.bookingConfig.findUnique({ where: { businessId } });
  const capacity = effectiveCapacity(service, config ?? { capacity: 1 });

  const date = parseIsoDate(input.value);
  if (!date) {
    return await handleSelectService(businessId, { value: state.serviceId });
  }

  const rawSlots = computeSlotsForDate(business.openingHours ?? "", date, {
    slotIntervalMinutes: config?.slotIntervalMinutes ?? 30,
    durationMinutes: service.durationMinutes,
    leadTimeMinutes: config?.leadTimeMinutes ?? 60,
  });

  const freeSlots: Date[] = [];
  for (const slotStart of rawSlots) {
    const slotEnd = new Date(slotStart.getTime() + service.durationMinutes * 60_000);
    if (await isSlotAvailable(businessId, service.id, slotStart, slotEnd, capacity)) {
      freeSlots.push(slotStart);
    }
  }

  if (freeSlots.length === 0) {
    return {
      state: { ...state, step: "SELECT_DATE" },
      status: "ACTIVE",
      messages: [{ text: "Ese día ya no queda hueco. Elige otro día, por favor.", quickReplies: [] }],
    };
  }

  return {
    state: { ...state, step: "SELECT_SLOT", date: isoDate(date) },
    status: "ACTIVE",
    messages: [
      {
        text: `Horas libres para el ${formatDateLabel(date)}:`,
        quickReplies: freeSlots.map((s) => ({ label: formatTimeLabel(s), value: s.toISOString() })),
      },
    ],
  };
}

async function handleSelectSlot(businessId: string, state: ChatState, input: ChatInput): Promise<TurnResult> {
  if (!state.serviceId || !state.date) return selectServiceStep(businessId);

  const slotStart = new Date(input.value);
  if (Number.isNaN(slotStart.getTime())) {
    return await handleSelectDate(businessId, state, { value: state.date });
  }

  const service = await prisma.service.findUniqueOrThrow({ where: { id: state.serviceId } });
  const config = await prisma.bookingConfig.findUnique({ where: { businessId } });
  const capacity = effectiveCapacity(service, config ?? { capacity: 1 });
  const slotEnd = new Date(slotStart.getTime() + service.durationMinutes * 60_000);

  if (!(await isSlotAvailable(businessId, service.id, slotStart, slotEnd, capacity))) {
    return await handleSelectDate(businessId, state, { value: state.date });
  }

  return {
    state: { ...state, step: "COLLECT_NAME", slotStartsAt: slotStart.toISOString() },
    status: "ACTIVE",
    messages: [{ text: "¿A nombre de quién hacemos la reserva?", expectsFreeText: true }],
  };
}

function handleCollectName(state: ChatState, input: ChatInput): TurnResult {
  const name = input.value.trim();
  if (!name) {
    return {
      state,
      status: "ACTIVE",
      messages: [{ text: "Necesito un nombre para la reserva.", expectsFreeText: true }],
    };
  }
  return {
    state: { ...state, step: "COLLECT_PHONE", name },
    status: "ACTIVE",
    messages: [{ text: "¿Y un teléfono de contacto?", expectsFreeText: true }],
  };
}

async function handleCollectPhone(businessId: string, state: ChatState, input: ChatInput): Promise<TurnResult> {
  const phone = input.value.trim();
  if (!/^[+\d][\d\s-]{5,}$/.test(phone)) {
    return {
      state,
      status: "ACTIVE",
      messages: [{ text: "Ese teléfono no parece válido, ¿puedes escribirlo de nuevo?", expectsFreeText: true }],
    };
  }

  const nextState: ChatState = { ...state, step: "CONFIRM", phone };
  const slot = nextState.slotStartsAt ? new Date(nextState.slotStartsAt) : null;
  const date = slot ? formatDateLabel(slot) : "";
  const time = slot ? formatTimeLabel(slot) : "";

  return {
    state: nextState,
    status: "ACTIVE",
    messages: [
      {
        text: `Resumen: ${nextState.serviceName} el ${date} a las ${time}, a nombre de ${nextState.name} (${phone}). ¿Confirmas?`,
        quickReplies: [
          { label: "Confirmar", value: "confirm" },
          { label: "Cancelar", value: "cancel" },
        ],
      },
    ],
  };
}

async function handleConfirm(businessId: string, state: ChatState, input: ChatInput): Promise<TurnResult> {
  if (input.value !== "confirm") {
    return {
      state: { step: "CANCELLED" },
      status: "ABANDONED",
      messages: [{ text: "Reserva cancelada. ¡Escríbenos cuando quieras volver a intentarlo!" }],
    };
  }

  if (!state.serviceId || !state.slotStartsAt || !state.name || !state.phone) {
    return selectServiceStep(businessId);
  }

  const service = await prisma.service.findUniqueOrThrow({ where: { id: state.serviceId } });
  const config = await prisma.bookingConfig.findUnique({ where: { businessId } });
  const capacity = effectiveCapacity(service, config ?? { capacity: 1 });
  const startsAt = new Date(state.slotStartsAt);
  const endsAt = new Date(startsAt.getTime() + service.durationMinutes * 60_000);

  try {
    await prisma.$transaction(async (tx) => {
      const overlapping = await tx.booking.count({
        where: {
          businessId,
          serviceId: service.id,
          status: "CONFIRMED",
          startsAt: { lt: endsAt },
          endsAt: { gt: startsAt },
        },
      });
      if (overlapping >= capacity) {
        throw new SlotTakenError();
      }

      const customer = await tx.customer.upsert({
        where: { businessId_phone: { businessId, phone: state.phone! } },
        update: { name: state.name! },
        create: { businessId, name: state.name!, phone: state.phone! },
      });

      await tx.booking.create({
        data: {
          businessId,
          serviceId: service.id,
          customerId: customer.id,
          startsAt,
          endsAt,
          source: "WEB",
        },
      });
    });
  } catch (err) {
    if (err instanceof SlotTakenError) {
      return await handleSelectDate(businessId, state, { value: state.date! });
    }
    throw err;
  }

  return {
    state: { ...state, step: "BOOKED" },
    status: "COMPLETED",
    messages: [{ text: "¡Reserva confirmada! Te esperamos. 🎉" }],
  };
}

class SlotTakenError extends Error {}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function parseIsoDate(s: string): Date | null {
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDateLabel(d: Date): string {
  return `${WEEKDAY_LABEL[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
}

function formatTimeLabel(d: Date): string {
  return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}
