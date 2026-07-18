import { google } from "googleapis";

const CLIENT_ID = "741570566228-68i15r3uhuafuksu29qs2pol420594ve.apps.googleusercontent.com";
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/calendar/callback";

export const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

export function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar"],
  });
}

export async function exchangeCodeForToken(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export async function setCredentials(tokens: any) {
  oauth2Client.setCredentials(tokens);
}

export async function createCalendarEvent(
  businessName: string,
  serviceName: string,
  customerName: string,
  customerPhone: string,
  startsAt: Date,
  endsAt: Date,
) {
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const event = {
    summary: `${serviceName} - ${customerName}`,
    description: `Cliente: ${customerName}\nTeléfono: ${customerPhone}\nServicio: ${serviceName}`,
    start: {
      dateTime: startsAt.toISOString(),
      timeZone: "Europe/Madrid",
    },
    end: {
      dateTime: endsAt.toISOString(),
      timeZone: "Europe/Madrid",
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });
    console.log(`Evento creado en Calendar: ${response.data.id}`);
    return response.data;
  } catch (err: any) {
    console.error("Error creating calendar event:", err.message);
    throw err;
  }
}
