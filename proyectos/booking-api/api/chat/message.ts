import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../src/prisma.js";
import { withCors } from "../../src/http.js";
import { processTurn, type ChatState } from "../../src/conversation.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (withCors(req, res)) return;
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const { sessionId, input } = req.body ?? {};
  if (typeof sessionId !== "string" || typeof input !== "string") {
    res.status(400).json({ error: "sessionId_and_input_required" });
    return;
  }

  const session = await prisma.chatSession.findUnique({ where: { id: sessionId } });
  if (!session) {
    res.status(404).json({ error: "session_not_found" });
    return;
  }
  if (session.status !== "ACTIVE") {
    res.status(409).json({ error: "session_not_active" });
    return;
  }

  await prisma.message.create({
    data: { chatSessionId: session.id, role: "user", text: input },
  });

  const state = JSON.parse(session.state) as ChatState;
  const result = await processTurn(session.businessId, state, { value: input });

  await prisma.$transaction([
    prisma.chatSession.update({
      where: { id: session.id },
      data: { state: JSON.stringify(result.state), status: result.status },
    }),
    prisma.message.createMany({
      data: result.messages.map((m) => ({
        chatSessionId: session.id,
        role: "bot",
        text: m.text,
        payload: m.quickReplies ? JSON.stringify(m.quickReplies) : null,
      })),
    }),
  ]);

  res.status(200).json({ messages: result.messages, status: result.status });
}
