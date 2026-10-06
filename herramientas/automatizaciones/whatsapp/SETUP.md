# WhatsApp Business API · Setup para OI Studio

## Qué hace falta

### 1. Cuenta de Meta Business (gratis)
- Ir a business.facebook.com y crear una cuenta de empresa
- Verificar la empresa (tarda 1-3 días laborables)
- Documento: CIF del negocio o factura de suministro

### 2. App en Meta Developers (gratis)
- developers.facebook.com → Crear app → Tipo "Business"
- Añadir el producto "WhatsApp"
- Genera automáticamente un número de prueba (sirve para test)

### 3. Número de WhatsApp Business
- **Opción A (recomendada):** Añadir un número nuevo (SIM prepago ~10 €)
- **Opción B:** Migrar un número existente (se pierde WhatsApp personal)
- El número NO puede estar activo en WhatsApp/WhatsApp Business app

### 4. Token permanente
- En Meta Developers → WhatsApp → Configuración → Tokens
- Crear un token permanente de sistema (System User)
- Guardar como secreto en n8n: nombre "WhatsApp Cloud API", tipo "Header Auth"
  - Header: Authorization
  - Value: Bearer TU_TOKEN

### 5. Variables de entorno en n8n
```
WA_PHONE_ID=123456789012345    ← ID del número (no el número en sí)
WA_NEGOCIO_TEL=34680956755     ← teléfono del dueño del negocio (sin +)
```

### 6. Plantillas de mensaje
- Crear en Meta Business Suite → WhatsApp → Plantillas
- Ver `plantillas-meta.md` para el texto exacto
- Esperar aprobación antes de activar los flujos

### 7. Webhook de respuestas (opcional, fase 2)
- Si quieres que el cliente pueda contestar "cancelar" y se borre la cita:
  - Configurar webhook en Meta Developers → WhatsApp → Configuración
  - Apuntar a un webhook de n8n que lea el mensaje entrante
  - Buscar la cita en Calendar y borrarla

---

## Modelo por cliente

Cuando montes esto para un cliente, necesitas:

| Qué | Quién lo hace |
|---|---|
| Cuenta de Meta Business del cliente | El cliente (o tú con sus datos) |
| App en Meta Developers | Tú, dentro de su cuenta |
| Número de WhatsApp dedicado | El cliente compra la SIM |
| Aprobar plantillas | Tú |
| Configurar n8n | Tú |
| Google Calendar del negocio | El cliente te da acceso |

**Tiempo de setup por cliente:** ~2 horas (sin contar la verificación de Meta)
