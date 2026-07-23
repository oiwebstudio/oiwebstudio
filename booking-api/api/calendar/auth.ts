import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const CLIENT_ID = "741570566228-dvtud1nhk5v62ls8b974vv1f63cj5h2d.apps.googleusercontent.com";
    const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/calendar/callback";

    const scope = encodeURIComponent("https://www.googleapis.com/auth/calendar");
    const redirectUri = encodeURIComponent(REDIRECT_URI);
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline`;

    res.redirect(authUrl);
  } catch (err: any) {
    console.error("Auth error:", err.message);
    res.status(500).json({ error: err.message });
  }
}
