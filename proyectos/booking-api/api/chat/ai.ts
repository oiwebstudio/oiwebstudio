import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../src/prisma.js";
import { withCors } from "../../src/http.js";

/**
 * Respuestas con IA para preguntas libres que las reglas del widget no cubren.
 *
 * Backends, por orden de prioridad:
 *  1. AI_WEBHOOK_URL   — webhook (n8n, Make…) que recibe {question, context, business}
 *                        y devuelve {answer: "..."}.
 *  2. GEMINI_API_KEY   — Google Gemini, capa GRATUITA (clave en aistudio.google.com/apikey).
 *  3. ANTHROPIC_API_KEY — API de Claude (modelo Haiku, de pago, céntimos).
 *
 * Sin ninguno configurado responde {answer: null} y el widget usa su mensaje de cortesía.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (withCors(req, res)) return;
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const { businessSlug, question, context } = req.body ?? {};
  if (typeof businessSlug !== "string" || typeof question !== "string" || !question.trim()) {
    res.status(400).json({ error: "businessSlug_and_question_required" });
    return;
  }
  if (question.length > 500) {
    res.status(400).json({ error: "question_too_long" });
    return;
  }

  const business = await prisma.business.findUnique({
    where: { slug: businessSlug },
    include: { services: { where: { active: true }, orderBy: { sortOrder: "asc" } } },
  });
  if (!business) {
    res.status(404).json({ error: "business_not_found" });
    return;
  }

  const serviceLines = business.services
    .map((s) => `- ${s.name}${s.priceLabel ? ` (${s.priceLabel})` : ""}, ${s.durationMinutes} min`)
    .join("\n");

  const businessInfo =
    `Negocio: ${business.name}\n` +
    (business.openingHours ? `Horario: ${business.openingHours}\n` : "") +
    (serviceLines ? `Servicios reservables:\n${serviceLines}\n` : "") +
    (typeof context === "string" && context.trim() ? `Información adicional:\n${context.slice(0, 2000)}\n` : "");

  const webhookUrl = process.env.AI_WEBHOOK_URL;
  const geminiKey = process.env.GEMINI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  const systemPrompt =
    "Eres el asistente del chat de reservas de un negocio local. Responde SIEMPRE en el idioma del cliente " +
    "(castellano o euskera), en 1-3 frases, tono cercano y profesional. Usa solo la información del negocio " +
    "que te doy; si no sabes algo, dilo y sugiere escribir al negocio o reservar cita. Nunca inventes " +
    "precios ni horarios. Si el cliente quiere reservar, dile que pulse el botón Reservar del chat.\n\n" +
    businessInfo;

  try {
    if (webhookUrl) {
      const r = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, context: businessInfo, business: business.slug }),
      });
      const data: any = await r.json();
      const answer = typeof data?.answer === "string" ? data.answer : null;
      res.status(200).json({ answer });
      return;
    }

    if (geminiKey) {
      const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: "user", parts: [{ text: question }] }],
            generationConfig: { maxOutputTokens: 300, temperature: 0.4 },
          }),
        },
      );
      const data: any = await r.json();
      const answer =
        data?.candidates?.[0]?.content?.parts
          ?.map((p: any) => p.text ?? "")
          .join("")
          .trim() || null;
      res.status(200).json({ answer });
      return;
    }

    if (anthropicKey) {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 300,
          system: systemPrompt,
          messages: [{ role: "user", content: question }],
        }),
      });
      const data: any = await r.json();
      const answer =
        data?.content && Array.isArray(data.content)
          ? data.content.map((b: any) => b.text ?? "").join("").trim() || null
          : null;
      res.status(200).json({ answer });
      return;
    }

    res.status(200).json({ answer: null });
  } catch {
    res.status(200).json({ answer: null });
  }
}
