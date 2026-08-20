# Estructura de la carpeta OI Studio

```
OI STUDIO/
├── web/                    ← lo que se publica en oiwebstudio.com
├── proyectos/              ← cada uno con su propio despliegue
├── biblioteca/             ← material de trabajo del estudio
├── docs/                   ← documentación y prompts
├── scripts/                ← utilidades
├── _local/                 ← nada de aquí se publica
└── .github/workflows/      ← el despliegue
```

---

## `web/` — el sitio publicado

**Su contenido va a la raíz del dominio.** `web/index.html` → `oiwebstudio.com/`,
`web/zonas/ibarra.html` → `oiwebstudio.com/zonas/ibarra.html`.

| Ruta | Qué es |
|---|---|
| `index.html` + 17 páginas | Portada, precios, trabajos, zonas, contacto, legal y los 8 artículos |
| `zonas/` (20) | Una página por pueblo |
| `diseno-web-<pueblo>.html` (20) | **Redirecciones.** Era la estructura de URLs antigua; cada una manda a su `zonas/<pueblo>.html`. Google las tiene indexadas: si se borran, se pierden esas visitas |
| `assets/` | CSS, JS, imágenes y logos |
| `demos/_plantillas/` | Las seis plantillas de sector |
| `demos/` (resto) | Demos sueltas: errotatxo, pelu-mosaico, floristeria-tallo |
| `webs-clientes/` | Ocho webs de ejemplo por sector |
| `catalogo-servicios/` | Catálogo interno de lo que se puede vender |
| `biblioteca.html` | La biblioteca de animaciones, versión pública |
| `CNAME`, `robots.txt`, `sitemap.xml` | Dominio e indexación |

### Las seis plantillas de sector

| Carpeta | Negocio de ejemplo | Bloque que la hace distinta |
|---|---|---|
| `hosteleria-asador/` | Asador Mendiola | Menú del día, que cambia solo según el día |
| `reformas-gremios/` | Reformas Elutxeta | Obras con comparador antes/después |
| `veterinaria/` | Clínica Otsoa | Urgencias 24 h con teléfono de guardia |
| `abogacia-gestoria/` | Aizpurua Abogados | Primera consulta: precio y qué te llevas |
| `salud-odontologia/` | Clínica Arrate | Primera visita: reloj de los 40 minutos |
| `automocion-taller/` | Talleres Zubieta | Tarifas cerradas publicadas |

## `proyectos/`

| Ruta | Qué es |
|---|---|
| `errotatxo-tolosa/` | La panadería, en Next.js. Proyecto real, no demo |
| `booking-api/` | API de reservas del chatbot (`booking-api-delta.vercel.app`) |
| `panel-finanzas/` | Panel de finanzas del estudio |

## `biblioteca/`

| Ruta | Qué es |
|---|---|
| `animaciones/` | 954 piezas con nombre clave y su catálogo. **No se publica**: es el criterio del estudio |
| `automatizaciones/` | Flujos de automatización |

## `docs/`

| Fichero | Para qué |
|---|---|
| `PUBLICAR.md` | Cómo se despliega el sitio |
| `PROMPT-PLANTILLAS-SECTOR.md` | Spec de las plantillas: tokens, bloques, bloque `DATOS` |
| `PROMPT-DIRECCION-VISUAL.md` | Tipografías y estructuras permitidas |
| `PROMPT-ANIMACIONES.md` | Cómo aplicar la biblioteca de animaciones |
| `INFORME-AUDITORIA.md` | Auditoría del sitio |
| `LEEME.md` | Notas de trabajo |
| `estrategia-de-ventas.txt`, `cm-semana-1.txt` | Notas comerciales |

## `_local/`

No se publica nada de aquí, y basta con `_local/` en el `.gitignore`: si algo no
debe subirse, se mueve a esta carpeta y no hay que tocar nada más.

`instagram/` · `web-version-anterior/` · `borradores/` · `_check5/` ·
`_retirado/` (cosas apartadas, se puede vaciar) · `server.js` · los `.bat`

---

## El despliegue

`.github/workflows/deploy.yml` publica **solo `web/`**, y su contenido queda en la
raíz del dominio. Se dispara al empujar cambios dentro de `web/`.

Antes, GitHub Pages servía la raíz del repositorio: por eso las páginas tenían que
estar sueltas en la raíz, revueltas con los proyectos y las notas.

> **Requiere un cambio manual, una sola vez:**
> GitHub → Settings → Pages → Source: **GitHub Actions**.
> Hasta que esté hecho, el workflow no publica nada.

El workflow comprueba antes de publicar que existan `index.html` y `CNAME` y que
todas las URLs del sitemap tengan su fichero. Si falta algo, falla ahí en vez de
publicar una web con enlaces rotos.

### Ver el sitio en local

```bash
npm run dev
```

Sirve `web/` en `http://localhost:8000`, con las mismas rutas que el dominio.

---

## Cómo se monta una demo para un prospecto

1. Copiar la carpeta de su sector de `web/demos/_plantillas/`.
2. Editar **solo** el bloque `DATOS` del final: nombre, teléfono, dirección,
   horario, reseñas.
3. Cambiar las URLs de las imágenes por fotos suyas (Google Maps o Instagram).
4. Ajustar `--acento` en `:root` si tiene color de marca.
5. Publicar y mandarle el enlace.

Presupuesto de tiempo: **90 minutos**.
