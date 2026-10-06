export async function enviarPlantilla(env, telefono, plantilla, parametros, negocio) {
  const phoneId = negocio?.wa_phone_id || env.WA_PHONE_ID;
  const token = negocio?.wa_token || env.WA_TOKEN;
  const ver = env.WA_API_VERSION || 'v21.0';

  const tel = telefono.replace(/[^0-9]/g, '');

  const res = await fetch(`https://graph.facebook.com/${ver}/${phoneId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: tel,
      type: 'template',
      template: {
        name: plantilla,
        language: { code: 'es' },
        components: [{
          type: 'body',
          parameters: parametros.map(t => ({ type: 'text', text: String(t) })),
        }],
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`WhatsApp error: ${JSON.stringify(data)}`);
  return data.messages?.[0]?.id || null;
}

export async function enviarTexto(env, telefono, texto, negocio) {
  const phoneId = negocio?.wa_phone_id || env.WA_PHONE_ID;
  const token = negocio?.wa_token || env.WA_TOKEN;
  const ver = env.WA_API_VERSION || 'v21.0';

  const tel = telefono.replace(/[^0-9]/g, '');

  const res = await fetch(`https://graph.facebook.com/${ver}/${phoneId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: tel,
      type: 'text',
      text: { body: texto },
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`WhatsApp error: ${JSON.stringify(data)}`);
  return data.messages?.[0]?.id || null;
}
