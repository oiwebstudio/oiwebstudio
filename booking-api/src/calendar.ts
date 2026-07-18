import { google } from "googleapis";

const CLIENT_ID = "741570566228-68i15r3uhuafuksu29qs2pol420594ve.apps.googleusercontent.com";
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/calendar/callback";

let oauth2Client: any = null;

function getOAuth2Client() {
  if (!oauth2Client) {
    oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  }
  return oauth2Client;
}

export function getAuthUrl() {
  const scope = encodeURIComponent("https://www.googleapis.com/auth/calendar");
  const redirectUri = encodeURIComponent(REDIRECT_URI);
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline`;
}

export async function exchangeCodeForToken(code: string) {
  const client = getOAuth2Client();
  const { tokens } = await client.getToken(code);
  return tokens;
}

export async function setCredentials(tokens: any) {
  const client = getOAuth2Client();
  client.setCredentials(tokens);
}

export async function createCalendarEvent(
  businessName: string,
  serviceName: string,
  customerName: string,
  customerPhone: string,
  startsAt: Date,
  endsAt: Date,
) {
  const client = getOAuth2Client();
  const calendar = google.calendar({ version: "v3", auth: client });

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
