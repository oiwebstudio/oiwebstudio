# Plantillas de WhatsApp para aprobar en Meta

Antes de que los flujos funcionen, hay que crear estas plantillas en
Meta Business Suite → WhatsApp → Gestión de cuenta → Plantillas de mensajes.

---

## 1. confirmacion_reserva

**Categoría:** UTILITY
**Idioma:** es (español)

```
Hola {{1}}, tu cita de {{2}} queda confirmada para el {{3}} a las {{4}}.

Si necesitas cambiarla o cancelarla, contesta a este mensaje.
```

Parámetros:
- {{1}} = nombre del cliente
- {{2}} = servicio (ej: "Corte de pelo")
- {{3}} = fecha (ej: "15 de octubre")
- {{4}} = hora (ej: "10:30")

---

## 2. recordatorio_cita

**Categoría:** UTILITY
**Idioma:** es (español)

```
Hola {{1}}, te recordamos tu cita de {{2}} mañana a las {{3}}.

Si no puedes venir, avísanos contestando a este mensaje y liberamos el hueco.
```

Parámetros:
- {{1}} = nombre del cliente
- {{2}} = servicio
- {{3}} = hora

---

## Notas

- Las plantillas UTILITY se aprueban en minutos (a veces segundos).
- No usar emojis en la plantilla; Meta las rechaza más.
- El nombre de la plantilla tiene que ser snake_case y solo letras/números/guión bajo.
- Una vez aprobadas, se pueden usar en los flujos de n8n sin cambios.
