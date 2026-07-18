import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAuthUrl } from "../../src/calendar";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authUrl = getAuthUrl();
  res.redirect(authUrl);
}
