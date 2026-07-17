import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../src/prisma.js";
import { withCors } from "../../src/http.js";
import { greetingMessages, initialState } from "../../src/conversation.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (withCors(req, res)) return;
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const { businessSlug, channel = "WEB", externalUserId } = req.body ?? {};
  if (typeof businessSlug !== "string") {
    res.status(400).json({ error: "businessSlug_required" });
    return;
  }

  const business = await prisma.business.findUnique({ where: { slug: businessSlug } });
  if (!business) {
    res.status(404).json({ error: "business_not_found" });
    return;
  }

  const state = initialState();
  const session = await prisma.chatSession.create({
    data: {
      businessId: business.id,
      channel,
      externalUserId: externalUserId ?? null,
      state: JSON.stringify(state),
      status: "ACTIVE",
    },
  });

  const messages = greetingMessages(business.name);
  await prisma.message.createMany({
    data: messages.map((m) => ({
      chatSessionId: session.id,
      role: "bot",
      text: m.text,
      payload: m.quickReplies ? JSON.stringify(m.quickReplies) : null,
    })),
  });

  res.status(200).json({ sessionId: session.id, messages });
}
