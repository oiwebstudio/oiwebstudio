const CLIENT_ID = "741570566228-dvtud1nhk5v62ls8b974vv1f63cj5h2d.apps.googleusercontent.com";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

let credentials: any = null;

export function setCredentials(tokens: any) {
  credentials = tokens;
}

export async function exchangeCodeForToken(code: string) {
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/calendar/callback";

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const data: any = await res.json();
  if (!res.ok) {
    throw new Error(data.error_description || data.error || "Token exchange failed");
  }

  return data;
}

export async function getAccessToken(refreshToken: string) {
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data: any = await res.json();
  if (!res.ok) {
    throw new Error(data.error_description || data.error || "Token refresh failed");
  }

  return data.access_token as string;
}

export async function createCalendarEvent(
  businessName: string,
  serviceName: string,
  customerName: string,
  customerPhone: string,
  startsAt: Date,
  endsAt: Date
) {
  if (!credentials?.refresh_token && !process.env.GOOGLE_REFRESH_TOKEN) {
    throw new Error("No Google Calendar refresh token configured");
  }

  const refreshToken = credentials?.refresh_token || process.env.GOOGLE_REFRESH_TOKEN;
  const accessToken = await getAccessToken(refreshToken);

  const eventRes = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: `${serviceName} - ${customerName}`,
        description: `Negocio: ${businessName}\nCliente: ${customerName}\nTeléfono: ${customerPhone}\nServicio: ${serviceName}`,
        start: {
          dateTime: startsAt.toISOString(),
          timeZone: "Europe/Madrid",
        },
        end: {
          dateTime: endsAt.toISOString(),
          timeZone: "Europe/Madrid",
        },
      }),
    }
  );

  const event: any = await eventRes.json();
  if (!eventRes.ok) {
    throw new Error(event.error?.message || "Failed to create calendar event");
  }

  return event;
}

export async function deleteCalendarEvent(refreshToken: string, eventId: string) {
  const accessToken = await getAccessToken(refreshToken);

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    const data: any = await res.json();
    throw new Error(data.error?.message || "Failed to delete calendar event");
  }
}
