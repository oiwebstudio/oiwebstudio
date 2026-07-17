import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../src/prisma.js";
import { processTurn, greetingMessages, initialState, type ChatState } from "../../src/conversation.js";
import { sendWhatsAppMessage } from "../../src/whatsapp.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    return handleVerify(req, res);
  }
  if (req.method === "POST") {
    return handleIncoming(req, res);
  }
  res.status(405).end();
}

/** Handshake de verificación de Meta: GET con hub.mode/hub.verify_token/hub.challenge. */
async function handleVerify(req: VercelRequest, res: VercelResponse) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode !== "subscribe" || typeof token !== "string") {
    res.status(403).end();
    return;
  }

  const config = await prisma.bookingConfig.findFirst({
    where: { whatsappVerifyToken: token },
  });

  if (!config) {
    res.status(403).end();
    return;
  }

  res.status(200).send(challenge);
}

/** Recibe un mensaje entrante de WhatsApp Cloud API y lo pasa por el mismo motor que la web. */
async function handleIncoming(req: VercelRequest, res: VercelResponse) {
  // Responder rápido: Meta reintenta si no hay 200 en unos segundos.
  res.status(200).end();

  try {
    const entry = req.body?.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const phoneNumberId: string | undefined = change?.metadata?.phone_number_id;
    const message = change?.messages?.[0];

    if (!phoneNumberId || !message) return; // notificación de estado, no un mensaje

    const from: string = message.from;
    const text: string = message.text?.body ?? message.button?.text ?? "";

    const config = await prisma.bookingConfig.findFirst({
      where: { whatsappPhoneNumberId: phoneNumberId },
      include: { business: true },
    });
    if (!config || !config.business) return;

    const business = config.business;

    let session = await prisma.chatSession.findFirst({
      where: { businessId: business.id, channel: "WHATSAPP", externalUserId: from, status: "ACTIVE" },
    });

    let outgoing: { text: string }[] = [];

    if (!session) {
      const state = initialState();
      session = await prisma.chatSession.create({
        data: {
          businessId: business.id,
          channel: "WHATSAPP",
          externalUserId: from,
          state: JSON.stringify(state),
          status: "ACTIVE",
        },
      });
      outgoing = greetingMessages(business.name);
      await prisma.message.createMany({
        data: outgoing.map((m) => ({ chatSessionId: session!.id, role: "bot", text: m.text })),
      });
    } else {
      await prisma.message.create({
        data: { chatSessionId: session.id, role: "user", text },
      });

      const state = JSON.parse(session.state) as ChatState;
      const result = await processTurn(business.id, state, { value: text });
      outgoing = result.messages;

      await prisma.$transaction([
        prisma.chatSession.update({
          where: { id: session.id },
          data: { state: JSON.stringify(result.state), status: result.status },
        }),
        prisma.message.createMany({
          data: result.messages.map((m) => ({ chatSessionId: session!.id, role: "bot", text: m.text })),
        }),
      ]);
    }

    for (const m of outgoing) {
      await sendWhatsAppMessage(config, from, m.text);
    }
  } catch (err) {
    console.error("[whatsapp webhook] error procesando mensaje entrante", err);
  }
}
