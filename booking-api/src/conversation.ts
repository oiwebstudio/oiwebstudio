import { prisma } from "./prisma.js";
import { computeSlotsForDate, effectiveCapacity, isSlotAvailable } from "./availability.js";
import { createCalendarEvent, deleteCalendarEvent } from "./calendar.js";
import { sendWhatsAppMessage, type WhatsAppCredentials } from "./whatsapp.js";

export type ChatStep =
  | "GREETING"
  | "MENU"
  | "SELECT_SERVICE"
  | "SELECT_DATE"
  | "SELECT_SLOT"
  | "COLLECT_NAME"
  | "COLLECT_PHONE"
  | "CONFIRM"
  | "BOOKED"
  | "COLLECT_PHONE_FOR_BOOKINGS"
  | "SELECT_BOOKING_TO_SHOW"
  | "SELECT_BOOKING_ACTION"
  | "SELECT_NEW_SERVICE_FOR_MODIFY"
  | "SELECT_NEW_SLOT_FOR_MODIFY"
  | "CONFIRM_MODIFY"
  | "MODIFIED"
  | "CONFIRM_CANCEL"
  | "CANCELLED"
  | "WHATSAPP_REDIRECT"
  | "COMPLETION_OPTIONS";

export interface ChatState {
  step: ChatStep;
  serviceId?: string;
  serviceName?: string;
  date?: string;
  slotStartsAt?: string;
  name?: string;
  phone?: string;
  bookingIdToModify?: string;
  bookingIdToCancel?: string;
  originalBookingId?: string;
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
  return { step: "MENU" };
}

export function greetingMessages(businessName: string): BotMessage[] {
  return [
    {
      text: `¡Hola! 👋 Bienvenido/a a ${businessName}. ¿En qué puedo ayudarte hoy?`,
      quickReplies: [
        { label: "📅 Reservar cita", value: "menu:booking" },
        { label: "✏️ Mis citas", value: "menu:view_bookings" },
        { label: "💬 Hablar con recepción", value: "menu:whatsapp" },
      ],
    },
  ];
}

export async function processTurn(
  businessId: string,
  state: ChatState,
  input: ChatInput,
): Promise<TurnResult> {
  switch (state.step) {
    case "MENU":
      return handleMenu(businessId, input);

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

    case "COLLECT_PHONE_FOR_BOOKINGS":
      return handleCollectPhoneForBookings(businessId, state, input);

    case "SELECT_BOOKING_TO_SHOW":
      return handleSelectBookingToShow(businessId, state, input);

    case "SELECT_BOOKING_ACTION":
      return handleSelectBookingAction(businessId, state, input);

    case "SELECT_NEW_SERVICE_FOR_MODIFY":
      return handleSelectNewServiceForModify(businessId, state, input);

    case "SELECT_NEW_SLOT_FOR_MODIFY":
      return handleSelectNewSlotForModify(businessId, state, input);

    case "CONFIRM_MODIFY":
      return handleConfirmModify(businessId, state, input);

    case "CONFIRM_CANCEL":
      return handleConfirmCancel(businessId, state, input);

    case "COMPLETION_OPTIONS":
      return handleCompletionOptions(businessId, input);

    case "WHATSAPP_REDIRECT":
      return {
        state,
        status: "COMPLETED",
        messages: [{ text: "¡Hasta luego!" }],
      };

    default:
      return {
        state,
        status: "COMPLETED",
        messages: [{ text: "Esta conversación ya ha terminado. ¡Escríbenos de nuevo cuando quieras!" }],
      };
  }
}

async function handleMenu(businessId: string, input: ChatInput): Promise<TurnResult> {
  const business = await prisma.business.findUniqueOrThrow({ where: { id: businessId } });
  if (input.value === "menu:booking") {
    return selectServiceStep(businessId);
  } else if (input.value === "menu:view_bookings") {
    return {
      state: { step: "COLLECT_PHONE_FOR_BOOKINGS" },
      status: "ACTIVE",
      messages: [{ text: "¿Qué teléfono usaste para tus reservas?", expectsFreeText: true }],
    };
  } else if (input.value === "menu:whatsapp") {
    const waNumber = business.whatsappNumber || "+34600000000";
    return {
      state: { step: "WHATSAPP_REDIRECT" },
      status: "COMPLETED",
      messages: [
        {
          text: `Contacta con recepción en WhatsApp: https://wa.me/${waNumber.replace(/\D/g, "")}?text=Hola,%20necesito%20ayuda`,
        },
      ],
    };
  }
  return {
    state: { step: "MENU" },
    status: "ACTIVE",
    messages: greetingMessages(business?.name ?? "OI Studio"),
  };
}

async function handleCollectPhoneForBookings(businessId: string, state: ChatState, input: ChatInput): Promise<TurnResult> {
  const phone = input.value.trim();
  if (!/^[+\d][\d\s-]{5,}$/.test(phone)) {
    return {
      state,
      status: "ACTIVE",
      messages: [{ text: "Teléfono no válido. ¿Puedes escribirlo de nuevo?", expectsFreeText: true }],
    };
  }

  const bookings = await prisma.booking.findMany({
    where: {
      businessId,
      customer: { phone },
      status: "CONFIRMED",
      startsAt: { gte: new Date() },
    },
    include: { service: true },
    orderBy: { startsAt: "asc" },
  });

  if (bookings.length === 0) {
    return {
      state: { step: "MENU" },
      status: "ACTIVE",
      messages: [{ text: "No encontramos citas para ese teléfono.", quickReplies: [{ label: "Volver al menú", value: "menu:booking" }] }],
    };
  }

  return {
    state: { ...state, step: "SELECT_BOOKING_TO_SHOW", phone },
    status: "ACTIVE",
    messages: [
      {
        text: "Tus citas:",
        quickReplies: bookings.map((b) => ({
          label: `${b.service.name} - ${formatDateLabel(b.startsAt)} ${formatTimeLabel(b.startsAt)}`,
          value: b.id,
        })),
      },
    ],
  };
}

async function handleSelectBookingToShow(businessId: string, state: ChatState, input: ChatInput): Promise<TurnResult> {
  const bookingId = input.value;
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, businessId, status: "CONFIRMED" },
    include: { service: true },
  });

  if (!booking) {
    return {
      state: { ...state, step: "SELECT_BOOKING_TO_SHOW" },
      status: "ACTIVE",
      messages: [{ text: "Cita no encontrada. Elige otra.", expectsFreeText: false }],
    };
  }

  return {
    state: { ...state, bookingIdToModify: bookingId, originalBookingId: bookingId, step: "SELECT_BOOKING_ACTION" },
    status: "ACTIVE",
    messages: [
      {
        text: `${booking.service.name} el ${formatDateLabel(booking.startsAt)} a las ${formatTimeLabel(booking.startsAt)}. ¿Qué quieres hacer?`,
        quickReplies: [
          { label: "Modificar", value: "action:modify" },
          { label: "Cancelar", value: "action:cancel" },
        ],
      },
    ],
  };
}

async function handleSelectBookingAction(businessId: string, state: ChatState, input: ChatInput): Promise<TurnResult> {
  const bookingId = state.bookingIdToModify;
  if (!bookingId) {
    return {
      state: { step: "MENU" },
      status: "ACTIVE",
      messages: [{ text: "Error interno. Vuelve al menú.", quickReplies: [{ label: "Menú", value: "menu:booking" }] }],
    };
  }

  if (input.value === "action:modify") {
    const services = await prisma.service.findMany({
      where: { businessId, active: true },
      orderBy: { sortOrder: "asc" },
    });

    if (services.length === 0) {
      return {
        state: { step: "MENU" },
        status: "ACTIVE",
        messages: [{ text: "No hay servicios disponibles. Vuelve al menú.", quickReplies: [{ label: "Menú", value: "menu:booking" }] }],
      };
    }

    return {
      state: { ...state, step: "SELECT_NEW_SERVICE_FOR_MODIFY" },
      status: "ACTIVE",
      messages: [
        {
          text: "¿Cuál es el nuevo servicio?",
          quickReplies: services.map((s) => ({
            label: s.priceLabel ? `${s.name} (${s.priceLabel})` : s.name,
            value: s.id,
          })),
        },
      ],
    };
  } else if (input.value === "action:cancel") {
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, businessId, status: "CONFIRMED" },
      include: { service: true },
    });

    if (!booking) {
      return {
        state: { step: "MENU" },
        status: "ACTIVE",
        messages: [{ text: "Cita no encontrada. Vuelve al menú.", quickReplies: [{ label: "Menú", value: "menu:booking" }] }],
      };
    }

    return {
      state: { ...state, step: "CONFIRM_CANCEL", bookingIdToCancel: bookingId },
      status: "ACTIVE",
      messages: [
        {
          text: `¿Cancelar ${booking.service.name} el ${formatDateLabel(booking.startsAt)} a las ${formatTimeLabel(booking.startsAt)}?`,
          quickReplies: [
            { label: "Sí, cancelar", value: "confirm_cancel" },
            { label: "No, mantener", value: "keep" },
          ],
        },
      ],
    };
  }

  return {
    state,
    status: "ACTIVE",
    messages: [{ text: "Opción no válida.", quickReplies: [{ label: "Volver al menú", value: "menu:booking" }] }],
  };
}

async function handleCompletionOptions(businessId: string, input: ChatInput): Promise<TurnResult> {
  if (input.value === "menu:back") {
    const business = await prisma.business.findUnique({ where: { id: businessId } });
    return {
      state: { step: "MENU" },
      status: "ACTIVE",
      messages: greetingMessages(business?.name ?? "OI Studio"),
    };
  } else if (input.value === "menu:whatsapp") {
    const business = await prisma.business.findUnique({ where: { id: businessId } });
    const waNumber = business?.whatsappNumber || "+34600000000";
    return {
      state: { step: "WHATSAPP_REDIRECT" },
      status: "COMPLETED",
      messages: [
        {
          text: `Contacta con recepción en WhatsApp: https://wa.me/${waNumber.replace(/\D/g, "")}?text=Hola,%20necesito%20ayuda`,
        },
      ],
    };
  }
  return {
    state: { step: "MENU" },
    status: "ACTIVE",
    messages: [{ text: "Opción no reconocida. Volviendo al menú...", quickReplies: [{ label: "Menú", value: "menu:booking" }] }],
  };
}

async function handleConfirmCancel(businessId: string, state: ChatState, input: ChatInput): Promise<TurnResult> {
  if (input.value !== "confirm_cancel") {
    return {
      state: { step: "MENU" },
      status: "ACTIVE",
      messages: [{ text: "Vale, tu cita se mantiene. ¿Algo más?", quickReplies: [{ label: "Menú", value: "menu:booking" }] }],
    };
  }

  if (!state.bookingIdToCancel) {
    return {
      state: { step: "MENU" },
      status: "ACTIVE",
      messages: greetingMessages(""),
    };
  }

  const booking = await prisma.booking.findUnique({
    where: { id: state.bookingIdToCancel },
  });

  await prisma.booking.update({
    where: { id: state.bookingIdToCancel },
    data: { status: "CANCELLED" },
  });

  // Elimina evento de Google Calendar (best-effort).
  if (booking?.googleCalendarEventId) {
    try {
      const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
      if (refreshToken) {
        await deleteCalendarEvent(refreshToken, booking.googleCalendarEventId);
      }
    } catch (calErr) {
      console.error("Calendar deletion (no bloqueante) falló:", (calErr as Error).message);
    }
  }

  return {
    state: { step: "COMPLETION_OPTIONS" },
    status: "ACTIVE",
    messages: [
      {
        text: "✅ Cita cancelada. Esperamos verte pronto. 🙏",
        quickReplies: [
          { label: "🏠 Volver al menú", value: "menu:back" },
          { label: "💬 Contactar por WhatsApp", value: "menu:whatsapp" },
        ],
      },
    ],
  };
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

async function handleSelectNewServiceForModify(businessId: string, state: ChatState, input: ChatInput): Promise<TurnResult> {
  const service = await prisma.service.findFirst({
    where: { id: input.value, businessId, active: true },
  });

  if (!service) {
    const services = await prisma.service.findMany({
      where: { businessId, active: true },
      orderBy: { sortOrder: "asc" },
    });
    return {
      state,
      status: "ACTIVE",
      messages: [
        {
          text: "Servicio no válido. Elige otro.",
          quickReplies: services.map((s) => ({
            label: s.priceLabel ? `${s.name} (${s.priceLabel})` : s.name,
            value: s.id,
          })),
        },
      ],
    };
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
    state: { ...state, step: "SELECT_NEW_SLOT_FOR_MODIFY", serviceId: service.id, serviceName: service.name, date: undefined },
    status: "ACTIVE",
    messages: [
      {
        text: `${service.name}. ¿Qué día te viene bien?`,
        quickReplies: dateOptions.map((d) => ({ label: formatDateLabel(d), value: isoDate(d) })),
      },
    ],
  };
}

async function handleSelectNewSlotForModify(businessId: string, state: ChatState, input: ChatInput): Promise<TurnResult> {
  if (!state.serviceId || !state.bookingIdToModify) {
    return {
      state: { step: "MENU" },
      status: "ACTIVE",
      messages: [{ text: "Error interno. Vuelve al menú.", quickReplies: [{ label: "Menú", value: "menu:booking" }] }],
    };
  }

  const service = await prisma.service.findUniqueOrThrow({ where: { id: state.serviceId } });
  const business = await prisma.business.findUniqueOrThrow({ where: { id: businessId } });
  const config = await prisma.bookingConfig.findUnique({ where: { businessId } });
  const capacity = effectiveCapacity(service, config ?? { capacity: 1 });

  const date = parseIsoDate(input.value);
  if (!date) {
    const dateOptions = findAvailableDates(business.openingHours ?? "", service.durationMinutes, config, DAYS_AHEAD);
    return {
      state,
      status: "ACTIVE",
      messages: [
        {
          text: "Fecha no válida. Elige otra.",
          quickReplies: dateOptions.map((d) => ({ label: formatDateLabel(d), value: isoDate(d) })),
        },
      ],
    };
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
    const dateOptions = findAvailableDates(business.openingHours ?? "", service.durationMinutes, config, DAYS_AHEAD);
    return {
      state: { ...state, step: "SELECT_NEW_SLOT_FOR_MODIFY" },
      status: "ACTIVE",
      messages: [{ text: "Ese día ya no queda hueco. Elige otro día, por favor.", quickReplies: dateOptions.map((d) => ({ label: formatDateLabel(d), value: isoDate(d) })) }],
    };
  }

  return {
    state: { ...state, step: "CONFIRM_MODIFY", date: isoDate(date) },
    status: "ACTIVE",
    messages: [
      {
        text: `Horas libres para el ${formatDateLabel(date)}:`,
        quickReplies: freeSlots.map((s) => ({ label: formatTimeLabel(s), value: s.toISOString() })),
      },
    ],
  };
}

async function handleConfirmModify(businessId: string, state: ChatState, input: ChatInput): Promise<TurnResult> {
  // Primero, intentar parsear como ISO datetime (horario seleccionado)
  const isIsoDatetime = /^\d{4}-\d{2}-\d{2}T/.test(input.value);

  if (isIsoDatetime) {
    // Usuario seleccionó un horario, confirmar
    const slotStart = new Date(input.value);
    if (Number.isNaN(slotStart.getTime())) {
      return {
        state,
        status: "ACTIVE",
        messages: [{ text: "Horario no válido. Por favor, elige otro.", expectsFreeText: false }],
      };
    }

    return {
      state: { ...state, step: "CONFIRM_MODIFY", slotStartsAt: input.value },
      status: "ACTIVE",
      messages: [
        {
          text: `¿Confirmar ${state.serviceName} el ${state.date} a las ${formatTimeLabel(slotStart)}?`,
          quickReplies: [
            { label: "Sí, confirmar", value: "action:confirm_modify" },
            { label: "No, otro horario", value: "action:cancel_modify" },
          ],
        },
      ],
    };
  }

  if (input.value === "action:cancel_modify") {
    return {
      state: { step: "MENU" },
      status: "ACTIVE",
      messages: [{ text: "Cambio cancelado. ¿Qué más?", quickReplies: [{ label: "Menú", value: "menu:booking" }] }],
    };
  }

  if (input.value !== "action:confirm_modify") {
    return {
      state,
      status: "ACTIVE",
      messages: [{ text: "Opción no válida.", quickReplies: [{ label: "Volver al menú", value: "menu:booking" }] }],
    };
  }

  if (!state.bookingIdToModify || !state.serviceId || !state.slotStartsAt) {
    return {
      state: { step: "MENU" },
      status: "ACTIVE",
      messages: [{ text: "Error interno. Vuelve al menú.", quickReplies: [{ label: "Menú", value: "menu:booking" }] }],
    };
  }

  const service = await prisma.service.findUniqueOrThrow({ where: { id: state.serviceId } });
  const startsAt = new Date(state.slotStartsAt);
  const endsAt = new Date(startsAt.getTime() + service.durationMinutes * 60_000);

  const oldBooking = await prisma.booking.findUnique({
    where: { id: state.bookingIdToModify },
    include: { customer: true },
  });

  if (!oldBooking) {
    return {
      state: { step: "MENU" },
      status: "ACTIVE",
      messages: [{ text: "Cita no encontrada. Vuelve al menú.", quickReplies: [{ label: "Menú", value: "menu:booking" }] }],
    };
  }

  const config = await prisma.bookingConfig.findUnique({ where: { businessId } });
  const capacity = effectiveCapacity(service, config ?? { capacity: 1 });

  try {
    await prisma.$transaction(async (tx) => {
      const overlapping = await tx.booking.count({
        where: {
          businessId,
          serviceId: service.id,
          status: "CONFIRMED",
          startsAt: { lt: endsAt },
          endsAt: { gt: startsAt },
          id: { not: state.bookingIdToModify },
        },
      });
      if (overlapping >= capacity) {
        throw new SlotTakenError();
      }

      await tx.booking.update({
        where: { id: state.bookingIdToModify },
        data: {
          serviceId: service.id,
          startsAt,
          endsAt,
          googleCalendarEventId: null,
        },
      });
    });
  } catch (err) {
    if (err instanceof SlotTakenError) {
      return {
        state: { ...state, step: "SELECT_NEW_SLOT_FOR_MODIFY" },
        status: "ACTIVE",
        messages: [{ text: "Ese horario ya no está disponible. Elige otro.", expectsFreeText: false }],
      };
    }
    throw err;
  }

  // Elimina evento anterior de Google Calendar (best-effort)
  if (oldBooking?.googleCalendarEventId) {
    try {
      const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
      if (refreshToken) {
        await deleteCalendarEvent(refreshToken, oldBooking.googleCalendarEventId);
      }
    } catch (calErr) {
      console.error("Calendar deletion (no bloqueante) falló:", (calErr as Error).message);
    }
  }

  // Crea nuevo evento en Google Calendar
  try {
    const business = await prisma.business.findUnique({ where: { id: businessId } });
    const event = await createCalendarEvent(
      business?.name ?? "OI Studio",
      service.name,
      oldBooking.customer.name,
      oldBooking.customer.phone,
      startsAt,
      endsAt,
    );
    if (event.id && state.bookingIdToModify) {
      await prisma.booking.update({
        where: { id: state.bookingIdToModify },
        data: { googleCalendarEventId: event.id },
      });
    }
  } catch (calErr) {
    console.error("Calendar sync (no bloqueante) falló:", (calErr as Error).message);
  }

  return {
    state: { ...state, step: "COMPLETION_OPTIONS" },
    status: "ACTIVE",
    messages: [
      {
        text: "✅ ¡Cita actualizada! Te esperamos. 🎉",
        quickReplies: [
          { label: "🏠 Volver al menú", value: "menu:back" },
          { label: "💬 Contactar por WhatsApp", value: "menu:whatsapp" },
        ],
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

  let booking;
  try {
    const result = await prisma.$transaction(async (tx) => {
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

      return await tx.booking.create({
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
    booking = result;
  } catch (err) {
    if (err instanceof SlotTakenError) {
      return await handleSelectDate(businessId, state, { value: state.date! });
    }
    throw err;
  }

  // Sincroniza con Google Calendar (best-effort).
  if (booking) {
    try {
      const business = await prisma.business.findUnique({ where: { id: businessId } });
      const event = await createCalendarEvent(
        business?.name ?? "OI Studio",
        service.name,
        state.name!,
        state.phone!,
        startsAt,
        endsAt,
      );
      if (event.id) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { googleCalendarEventId: event.id },
        });
      }
    } catch (calErr) {
      console.error("Calendar sync (no bloqueante) falló:", (calErr as Error).message);
    }
  }

  // Envía WhatsApp (best-effort).
  try {
    const config = await prisma.bookingConfig.findUnique({ where: { businessId } });
    const whatsappCreds: WhatsAppCredentials = {
      whatsappEnabled: config?.whatsappEnabled ?? false,
      whatsappPhoneNumberId: config?.whatsappPhoneNumberId ?? null,
      whatsappAccessToken: config?.whatsappAccessToken ?? null,
    };
    const msg = `✅ Reserva confirmada\n${service.name}\n${formatDateLabel(startsAt)} a las ${formatTimeLabel(startsAt)}\nA nombre de ${state.name}\n\nTe esperamos 🎉`;
    await sendWhatsAppMessage(whatsappCreds, state.phone!, msg);
  } catch (wErr) {
    console.error("WhatsApp (no bloqueante) falló:", (wErr as Error).message);
  }

  return {
    state: { ...state, step: "COMPLETION_OPTIONS" },
    status: "ACTIVE",
    messages: [
      {
        text: "✅ ¡Reserva confirmada! Te esperamos. 🎉",
        quickReplies: [
          { label: "🏠 Volver al menú", value: "menu:back" },
          { label: "💬 Contactar por WhatsApp", value: "menu:whatsapp" },
        ],
      },
    ],
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
