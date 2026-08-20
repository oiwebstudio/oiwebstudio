/** Envoltorio fino sobre la API de WhatsApp Cloud (Meta). No-op si el negocio no tiene credenciales activas. */
export interface WhatsAppCredentials {
  whatsappEnabled: boolean;
  whatsappPhoneNumberId: string | null;
  whatsappAccessToken: string | null;
}

export async function sendWhatsAppMessage(
  creds: WhatsAppCredentials,
  to: string,
  text: string,
): Promise<void> {
  if (!creds.whatsappEnabled || !creds.whatsappPhoneNumberId || !creds.whatsappAccessToken) {
    console.log(`[whatsapp:noop] -> ${to}: ${text}`);
    return;
  }

  const url = `https://graph.facebook.com/v20.0/${creds.whatsappPhoneNumberId}/messages`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${creds.whatsappAccessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text },
    }),
  });

  if (!resp.ok) {
    console.error(`[whatsapp] fallo al enviar (${resp.status}): ${await resp.text()}`);
  }
}
