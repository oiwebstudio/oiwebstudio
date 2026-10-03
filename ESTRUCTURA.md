# Estructura de la carpeta OI Studio

Reorganizada el 3/10/2026. **Cuatro reglas, y con eso no vuelve el lío:**

1. Si se publica en oiwebstudio.com → `web/`. Si no se publica ahí, no entra.
2. Si es de un cliente que paga → `clientes/<cliente>/`.
3. Si no se publica nunca → `_local/`, y dentro **siempre** en una de sus cinco carpetas.
4. En la raíz no se crea nada nuevo sin añadirlo a este fichero.

```
OI STUDIO/
├── web/           → oiwebstudio.com (GitHub Pages)
├── clientes/      → webs de clientes reales
├── proyectos/     → software propio que no es web de cliente
├── herramientas/  → scripts y utilidades
├── docs/          → documentación viva
├── captacion/     → buscador de negocios (repositorio aparte)
├── webs-clientes/ → 3 redirecciones de Vercel (ver abajo)
└── _local/        → nada de aquí se publica ni se versiona
```

---

## `web/` — el sitio publicado

Su contenido va a la raíz del dominio: `web/index.html` → `oiwebstudio.com/`,
`web/zonas/ibarra.html` → `oiwebstudio.com/zonas/ibarra.html`.

| Ruta | Qué es |
|---|---|
| `index.html` y las páginas sueltas | Portada, precios, trabajos, zonas, contacto, legal y los artículos |
| `zonas/` (20) | Una página por municipio |
| `diseno-web-<pueblo>.html` (20) | **Redirecciones.** Era la estructura de URLs antigua. Google las tiene indexadas: si se borran, se pierden esas visitas |
| `eu/` | Versión en euskera. **Generada**, no se edita ni se versiona |
| `assets/` | CSS, JS, imágenes y logos |
| `demos/_plantillas/` (11) | Plantillas por sector |
| `demos/clientes/` | Demos enviadas a negocios concretos. **Son URLs que has mandado por WhatsApp: no se borran ni se renombran** |
| `webs-clientes/` | Ocho webs de ejemplo por sector |
| `catalogo-servicios/` | Catálogo interno de lo que se puede vender |
| `CNAME`, `robots.txt`, `sitemap.xml`, `llms.txt` | Dominio, indexación y visibilidad en IAs |
| `google…html`, `3823fb…txt` | Verificación de Search Console y de Bing. **No borrar** |

**Dentro de `web/` no se reorganiza nada**: cada fichero es una URL indexada.

## `clientes/` — webs de clientes reales

Una carpeta por cliente, y dentro siempre lo mismo:

```
clientes/errotatxo/
├── fuente/                 el proyecto Next.js con el que se construye
├── publicado/              lo que se sirve (export de fuente/)
├── obras/                  página «en obras», lo que se ve ahora
├── worker.js               redirección de www
├── web.wrangler.jsonc      errotatxo.com      → npx wrangler deploy -c clientes/errotatxo/web.wrangler.jsonc
└── previa.wrangler.jsonc   la web completa en workers.dev
```

## `proyectos/` — software propio

| Carpeta | Qué es |
|---|---|
| `booking-api/` | API de reservas del chatbot (Vercel) |
| `panel-finanzas/` | Panel de finanzas del estudio |

## `herramientas/` — todo lo que se ejecuta

| Carpeta | Qué hay |
|---|---|
| `sitio/` | Lo que construye el sitio: euskera, zonas, favicon, noindex |
| `demos/` | Generadores de demos, kit de movimiento, servidor de demos |
| `diseno/` | Captura, auditoría visual, paletas, escalas, imágenes, letras |
| `auditoria/` | Auditoría con axe |
| `kit-panel/` | Panel de cliente |
| `automatizaciones/` | Catálogo de flujos |

**`herramientas/sitio/generar-euskera.mjs` lo ejecuta el despliegue.** Si cambia
algo ahí, se vuelve a publicar la web: está en los `paths` de
`.github/workflows/deploy.yml`.

## `_local/` — nada de esto se publica

Ignorado entero por git (una sola regla en `.gitignore`). Cinco carpetas:

| Carpeta | Qué hay |
|---|---|
| `demos/` | Demos en curso, una por negocio, con sus versiones (`-v2`, `-v3`…) y `_maquetas/` |
| `material/` | Letras, composiciones, inspiración, animaciones, paletas, capturas e informes |
| `negocio/` | Captación, envíos, Instagram, logs, claves y los JSON de las colas |
| `planes/` | Notas, prompts y documentos de trabajo |
| `_archivo/` | Retirado: `taller-vintage`, `facturas-diamacon`, `mi-panel-movil`, versiones anteriores de la web |

Las dos tareas programadas de Windows ejecutan
`_local/negocio/correo-al-crm.cmd` y `_local/negocio/enviar-seguimientos.cmd`.

## `captacion/` — repositorio aparte

Antes `localai/`. Busca negocios sin web, genera landings y lleva el CRM.
Tiene **su propio git**: no se versiona desde aquí. Sus scripts leen datos de
`../_local/negocio/`.

## `webs-clientes/` — no tocar el nombre

Tres ficheros de redirección. El proyecto `oiwebstudio` de Vercel publica
`oiwebstudio.vercel.app` con "Root Directory" = `webs-clientes`. Si se renombra
esta carpeta sin cambiar antes ese ajuste en Vercel, **todos los despliegues
fallan**. Cuando se cambie el ajuste, pasa a llamarse `vercel-redirecciones/`.
