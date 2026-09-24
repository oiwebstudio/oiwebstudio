# Cómo se entrega una web a un cliente

De "me interesa" a web publicada en su dominio. Pensado para hacerlo en unas
2–3 horas por cliente, con las demos que ya salen de `scripts/generar-demo.mjs`.

**Decisiones tomadas (24/09/2026):**

| Qué | Dónde | Por qué |
|---|---|---|
| Dominio | **DonDominio**, en la cuenta de OI Studio, con el **cliente como titular** (su nombre/razón social y NIF) | Registrador español, vende .es, .eus y .com. El dominio es legalmente del cliente: si se va, se lo lleva |
| DNS | **Cloudflare** (plan gratis), cuenta de OI Studio | https automático y el dominio raíz (`negocio.com`, sin www) funciona sin trucos |
| Alojamiento | **Cloudflare Pages** (gratis: webs ilimitadas, tráfico ilimitado, privado) | Las demos son HTML estático: no necesitan servidor ni base de datos. Coste real para nosotros: 0 € |
| Código de cada web | `clientes/<slug>/` en este repositorio | Copia de seguridad con historial; nunca se pierde nada |
| Facturas | **FakturaBAI** (Zergabidea, gratis) | TicketBAI es obligatorio en Gipuzkoa desde el primer día |

Coste por cliente: el dominio (~10–15 €/año). Todo lo demás, 0 €.

> Antes del primer cliente hay que crear, una sola vez, la cuenta de DonDominio
> y la de Cloudflare (lo hace Oier: son cuentas a su nombre).

---

## 1. Cuando dice que sí

1. Mandarle el **presupuesto por escrito** por correo y que conteste "de acuerdo".
   Eso ya vale como aceptación. Tiene que decir:
   - precio + IVA y forma de pago (50 % al aceptar, 50 % al publicar; o plazos pactados)
   - qué incluye (páginas, dominio y alojamiento el primer año, 30 días de ajustes)
   - que el dominio va a su nombre y la web es suya
   - mantenimiento: 20 €/mes + IVA sin permanencia, o solo dominio y alojamiento 15 €/año
   - plazo de entrega (desde que manda fotos y textos)
2. **Alta de autónomo** si aún no está hecha (Hacienda Foral + Seguridad Social con tarifa plana).
3. **Factura del primer 50 %** con FakturaBAI. Retención 7 % si el cliente es empresa o autónomo.

## 2. Qué pedirle al cliente

- Nombre de dominio que quiere (proponerle 2–3 libres ya mirados)
- Datos del titular: nombre o razón social, NIF, dirección, email y teléfono
- **Fotos suyas** (del local, los platos, los trabajos…) y el logo si lo tiene
- Textos o correcciones sobre la demo; horarios y precios **confirmados por él**
- Datos para el aviso legal: razón social, NIF, dirección, email

## 3. Preparar la web final

Partir de la demo publicada en `web/demos/clientes/<slug>/` y copiarla a `clientes/<slug>/`:

- [ ] Quitar la nota de demo del pie ("las fotos, los textos y los precios son de ejemplo…")
- [ ] Cambiar las fotos de ejemplo (Unsplash) por las suyas
- [ ] Quitar `noindex` si lo tiene; `canonical`, `og:url` y `og:image` con el dominio nuevo
- [ ] Aviso legal, privacidad y cookies con **sus** datos (si no hay analítica con cookies, no hace falta banner)
- [ ] Favicon, `robots.txt` y `sitemap.xml` con el dominio nuevo
- [ ] Revisar en móvil y ordenador (`scripts/auditoria-visual.js`) y que todos los datos sean verdaderos

## 4. Dominio y publicación

1. **DonDominio** → registrar el dominio con el cliente como titular y OI Studio como contacto técnico.
2. **Cloudflare** → *Add a site* → el dominio → copiar los 2 *nameservers* → ponerlos en DonDominio.
3. Publicar:
   ```bash
   npx wrangler pages deploy clientes/<slug> --project-name <slug>
   ```
4. En el proyecto de Pages → *Custom domains* → añadir `negocio.com` y `www.negocio.com`.
   El certificado https sale solo en unos minutos.
5. Comprobar `https://negocio.com` y `https://www.negocio.com` en móvil y ordenador.

## 5. Después de publicar

- [ ] **Google Search Console**: dar de alta el dominio y enviar el sitemap
- [ ] **Perfil de Google (Maps)**: poner la web nueva (lo hace el cliente o nos da acceso)
- [ ] La demo de `oiwebstudio.com/demos/clientes/<slug>/` pasa a redirigir a su dominio
- [ ] Si el cliente da permiso, añadirla a `web/trabajos.html` como trabajo real
- [ ] Correo de entrega: la dirección, qué incluye, cómo pedir cambios y cuándo vence el dominio
- [ ] **Factura del segundo 50 %**
- [ ] Apuntar en el calendario la renovación del dominio (y a los 11 meses, recordarle el mantenimiento)

## 6. Mantenimiento (20 €/mes)

- **Panel del cliente** (incluido): aviso, precio y menú del día desde el móvil, con PIN.
  Se monta con `scripts/kit-panel/` (ver su LEEME.md) antes de publicar.

- Cambios pequeños: editar `clientes/<slug>/`, commit y el mismo `wrangler pages deploy`
- Una vez al mes: que la web abra, que el https esté bien y que el dominio no esté por caducar
- Si deja el mantenimiento: se le transfiere el dominio a su propia cuenta de DonDominio
  (código de autorización) y se le dan los archivos. Nada queda atado a OI Studio.
