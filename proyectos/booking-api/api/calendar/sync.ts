import type { VercelRequest, VercelResponse } from "@vercel/node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CLIENT_ID = "741570566228-dvtud1nhk5v62ls8b974vv1f63cj5h2d.apps.googleusercontent.com";

async function getAccessToken(refreshToken: string) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const data: any = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.error);
  return data.access_token as string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { bookingId, refreshToken } = req.body;
  const token = refreshToken || process.env.GOOGLE_REFRESH_TOKEN;

  if (!bookingId || !token) {
    return res.status(400).json({ error: "Missing bookingId or refreshToken" });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { service: true, customer: true, business: true },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const accessToken = await getAccessToken(token);

    const eventRes = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: `${booking.service.name} - ${booking.customer.name}`,
          description: `Cliente: ${booking.customer.name}\nTeléfono: ${booking.customer.phone}\nServicio: ${booking.service.name}\nNegocio: ${booking.business.name}`,
          start: { dateTime: booking.startsAt.toISOString(), timeZone: "Europe/Madrid" },
          end: { dateTime: booking.endsAt.toISOString(), timeZone: "Europe/Madrid" },
        }),
      },
    );

    const event: any = await eventRes.json();
    if (!eventRes.ok) {
      console.error("Calendar insert failed:", event);
      return res.status(500).json({ error: event.error?.message || "Calendar insert failed" });
    }

    return res.status(200).json({ success: true, eventId: event.id, link: event.htmlLink });
  } catch (err: any) {
    console.error("Calendar sync error:", err.message);
    return res.status(500).json({ error: err.message });
  } finally {
    await prisma.$disconnect();
  }
}
