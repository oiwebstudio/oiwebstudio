# OI Studio

Estudio de diseño y desarrollo web en Tolosa (Gipuzkoa), para negocios locales.
Esta carpeta tiene el sitio del estudio, las webs de los clientes, las demos y
las herramientas con las que se hacen.

**El mapa de carpetas y las reglas para no volver a liarlo: [ESTRUCTURA.md](ESTRUCTURA.md).**

## Lo que hay que saber para trabajar aquí

| Quiero… | Dónde |
|---|---|
| Tocar oiwebstudio.com | `web/` — y leer antes [docs/PUBLICAR.md](docs/PUBLICAR.md) |
| Ver el sitio en local | servidor `web` (puerto 8010) |
| Hacer una demo para un negocio | `_local/demos/<negocio>/`, con `herramientas/demos/` |
| Entregar una web a un cliente | [docs/ENTREGA-CLIENTES.md](docs/ENTREGA-CLIENTES.md) |
| Publicar la web de Errotatxo | `npx wrangler deploy -c clientes/errotatxo/web.wrangler.jsonc` |
| Saber qué falta de SEO | [docs/SEO-LO-QUE-FALTA.md](docs/SEO-LO-QUE-FALTA.md) |
| Aparecer en las IAs | [docs/VISIBILIDAD-IA.md](docs/VISIBILIDAD-IA.md) |

## El sitio

- Se publica solo: cada push a `main` que toque `web/` o `herramientas/sitio/`
  lanza `.github/workflows/deploy.yml`, que genera la versión en euskera,
  comprueba que no falta ninguna URL del sitemap y publica en GitHub Pages.
- La versión en euskera (`web/eu/`) **se genera**: no se edita a mano ni se
  versiona. Sus traducciones viven en `herramientas/sitio/euskera-zonas.mjs`.
- Dentro de `web/` no se mueven ni se renombran ficheros: cada uno es una URL
  que Google tiene indexada, incluidas las demos enviadas a clientes.
