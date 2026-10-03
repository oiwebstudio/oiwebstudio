# Herramientas de diseño (locales)

Se ejecutan desde la raíz del repo. Usan Playwright y sharp de la raíz y axe-core de aquí (`npm install` en esta carpeta si falta).

| Herramienta | Para qué | Ejemplo |
|---|---|---|
| `captura.mjs` | Capturas por tramos a 390 y 1280 px (baja la página antes para cargar imágenes y animaciones). Avisa de scroll horizontal, imágenes rotas, zonas táctiles pequeñas y errores de consola. | `node herramientas/diseno/captura.mjs http://localhost:4398/laboratorio/composiciones.html` → `capturas/` |
| `auditar.mjs` | Revisión antes de enseñar una demo: axe-core (WCAG 2.2 AA), contraste real, foco con teclado, texto que no llega a aparecer, revelados con clip-path rotos, reduced motion, transiciones caras y peso. | `node herramientas/diseno/auditar.mjs http://localhost:8010/demos/clientes/beko-errota/ --nombre beko` → `informes/beko.json` |
| `paleta.mjs` | Paleta completa en OKLCH desde el color de la marca o desde una foto/logo, con el contraste comprobado y el modo oscuro. | `node herramientas/diseno/paleta.mjs "#8a2b1f" --nombre beko` · `--imagen logo.png` → `paletas/beko.html` |
| `escala.mjs` | Escala tipográfica y de espacios fluida (método Utopia) con `clamp()`. Perfiles: compacto, editorial, cartel. | `node herramientas/diseno/escala.mjs --perfil cartel` |
| `imagenes.mjs` | Fotos del cliente → AVIF + WebP a 480/960/1600, sin EXIF ni GPS, y el `<picture>` listo con width/height (y `--lqip` para el fondo borroso mientras carga). | `node herramientas/diseno/imagenes.mjs fotos-originales/ publico/fotos/ --sizes "(min-width: 900px) 50vw, 100vw"` |

Lecciones y reglas en `_local/negocio/agente/escuela-diseno.md` (§9 bis y §10) y `_local/negocio/agente/auditoria-demos-2026-10-02.md`.
| `inspiracion.mjs` | Tablero numerado de referencias de un sector (Pinterest sin sesión + Landbook) para que Oier elija. | `node herramientas/diseno/inspiracion.mjs restaurante "seafood restaurant website design"` |
| `reponer-inspiracion.mjs` | Mantiene **20 referencias frescas por sector** (13 sectores) y, cuando se usa una, la pasa a «usadas» y busca un recambio. Nunca repite una ya vista. | `node herramientas/diseno/reponer-inspiracion.mjs` · `… usar restaurante 7` |

**Fotos libres para demos (CC0 / dominio público):** API de Openverse (`https://api.openverse.org/v1/images/?q=...&license=cc0,pdm`, incluye rawpixel y Flickr) y Wikimedia Commons (API `action=query&generator=search`). Para recortar un objeto (fondo transparente): `@imgly/background-removal-node` instalado en `%TEMP%/quitafondo` (`node recorta.mjs entrada.jpg salida.png`). Anotar siempre la licencia en el comentario de la demo y en el pie si es CC BY.
