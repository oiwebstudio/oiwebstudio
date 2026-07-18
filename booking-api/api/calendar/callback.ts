import type { VercelRequest, VercelResponse } from "@vercel/node";
import { exchangeCodeForToken, setCredentials } from "../../src/calendar";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code } = req.query;

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Missing authorization code" });
  }

  try {
    const tokens = await exchangeCodeForToken(code);
    await setCredentials(tokens);

    return res.status(200).json({
      success: true,
      message: "Google Calendar autorizado exitosamente",
      tokens: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry_date: tokens.expiry_date,
      },
    });
  } catch (err: any) {
    console.error("OAuth callback error:", err.message);
    return res.status(500).json({ error: "Failed to exchange authorization code" });
  }
}
