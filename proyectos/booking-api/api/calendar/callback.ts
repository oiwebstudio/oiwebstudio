import type { VercelRequest, VercelResponse } from "@vercel/node";

const CLIENT_ID = "741570566228-dvtud1nhk5v62ls8b974vv1f63cj5h2d.apps.googleusercontent.com";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).send("Method not allowed");
  }

  const code = Array.isArray(req.query.code) ? req.query.code[0] : req.query.code;
  if (!code) {
    return res.status(400).send("Missing authorization code");
  }

  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientSecret || !redirectUri) {
    return res.status(500).send("Server configuration error");
  }

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: String(code),
        client_id: CLIENT_ID,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }).toString(),
    });

    const data: any = await response.json();

    if (!response.ok) {
      return res.status(400).send(`Error: ${data.error_description || data.error}`);
    }

    const refreshToken = data.refresh_token || "NO REFRESH TOKEN";

    return res.status(200).send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>✓ Conectado</title>
  <style>
    body { font-family: system-ui; background: #0f1117; color: #e8e8e8; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { background: #1a1d27; border-radius: 16px; padding: 40px; max-width: 600px; text-align: center; }
    h1 { margin: 0; font-size: 1.4rem; }
    .ok { color: #4ade80; font-size: 3rem; margin: 0; }
    code { display: block; background: #0f1117; padding: 16px; margin: 16px 0; border-radius: 8px; word-break: break-all; font-size: 0.85rem; text-align: left; user-select: all; }
    p { margin: 12px 0; color: #aaa; }
  </style>
</head>
<body>
  <div class="card">
    <div class="ok">✓</div>
    <h1>Google Calendar Conectado</h1>
    <p>Copia este token:</p>
    <code>${refreshToken}</code>
    <p style="font-size:0.9rem">Pégalo a Claude como GOOGLE_REFRESH_TOKEN</p>
  </div>
</body>
</html>`);
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Server error");
  }
}
