import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createCalendarEvent, setCredentials } from "../../src/calendar";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { bookingId, refreshToken } = req.body;

  if (!bookingId || !refreshToken) {
    return res.status(400).json({ error: "Missing bookingId or refreshToken" });
  }

  try {
    // Fetch booking with relations
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        service: true,
        customer: true,
        business: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Set credentials with refresh token
    setCredentials({ refresh_token: refreshToken });

    // Create calendar event
    await createCalendarEvent(
      booking.business.name,
      booking.service.name,
      booking.customer.name,
      booking.customer.phone,
      booking.startsAt,
      booking.endsAt,
    );

    return res.status(200).json({ success: true, message: "Evento creado en Google Calendar" });
  } catch (err: any) {
    console.error("Calendar sync error:", err.message);
    return res.status(500).json({ error: "Failed to sync with Google Calendar" });
  } finally {
    await prisma.$disconnect();
  }
}
