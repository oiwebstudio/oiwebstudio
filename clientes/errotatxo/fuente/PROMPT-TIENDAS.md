# PROMPT — Sección "Las tres tiendas" (Errotatxo, demo Tolosa)

> Alcance: **solo** el bloque de las tres tiendas de la home. El mapa, los horarios,
> productos y la nueva sección de historia se especifican en prompts aparte.
> Este documento tiene dos partes: **(A) dossier de investigación** con los datos reales
> encontrados y su nivel de fiabilidad, y **(B) el prompt de implementación**.

---

## A. DOSSIER DE INVESTIGACIÓN

### A.1 La empresa

| Dato | Valor | Fuente / fiabilidad |
|---|---|---|
| Razón social | **Okindegia Errotatxo, S.L.** | Registro mercantil vía Empresite — **alta** |
| CIF | B20543005 | Empresite — alta |
| Constitución | **30 de enero de 1996** (≈30 años en 2026) | Empresite — alta |
| CNAE | 1071 — Fabricación de pan y productos frescos de panadería y pastelería | Empresite — alta |
| Domicilio social | Calle Andia, 3 bajo, 20400 Tolosa (Gipuzkoa) | Empresite / QDQ / Kompass — alta |
| Marca registrada | "Errotatxo" (1 registro) | Empresite — media |
| Rótulo habitual | *Errotatxo Gozotegia Okindegia* (pastelería + panadería en euskera) | RestaurantGuru, Yelp — alta |

**Lectura de marca:** *errota* = molino en euskera; *-txo* = diminutivo → "el molinito".
Es un nombre de raíz local, no comercial. Sirve como eje narrativo del sitio y como
justificación del icono/emblema que ya usa el logo. **1996 + tres puntos de venta en
el valle del Oria** es el ángulo diferencial frente a un obrador genérico.

### A.2 Las tres tiendas

**1 · Tolosa — Andia (tienda madre / domicilio social)**
- Dirección: Andia Kalea, 3 (bajo), 20400 Tolosa
- Teléfono: 943 65 54 92 (Empresite lista también 943 65 16 33 como segundo número)
- Horario publicado: **L–V 7:00–19:00 · Sáb 7:00–14:00 · Dom 7:00–14:00**
- Google: **4,7 / 5 con 11 reseñas**; ranking local #23 de 192 en Tolosa
- Atributos: acepta tarjeta, accesible en silla de ruedas
- Reseñas literales (Google, vía RestaurantGuru):
  - "Excelente panadería y confitería en el corazón de Tolosa. Buen servicio"
  - "Buen servicio y productos, gente amable"
- Contexto urbano: Andia Kalea está en el **casco viejo de Tolosa**, a un paso de la
  Plaza Euskal Herria y del mercado. Es la tienda "de paso", la de la compra diaria.
- Coordenadas en el código actual: `43.1384065, -2.0741355`

**2 · Tolosa — San Frantzisko**
- Dirección: San Frantzisko Pasealekua, 24, 20400 Tolosa
- Teléfono en el código: 943 65 47 33 — **NO verificado en ninguna fuente pública**
- Horario: **L–V 7:30–14:00 y 16:00–20:30 · S–D 7:30–14:00** — confirmado por el
  cliente el 09/08/2026 (ficha de Google)
- Valoración en el código: 4,4 — **no verificada** (no aparece ficha propia indexada)
- Contexto urbano: el paseo de San Frantzisko discurre junto al Oria, zona de
  vivienda y paseo; es la tienda "de barrio", con más clientela recurrente que de paso.
- Coordenadas en el código actual: `43.1343593, -2.0788086`

**3 · Anoeta — San Juan**
- Dirección: San Juan Kalea, 2, 20270 Anoeta
- Teléfono: **943 65 25 99** — confirmado (Páginas Amarillas, QDQ, Firmania)
- Horario: **L–V 7:00–13:30 y 16:00–20:30 · S–D 7:00–14:00** — confirmado por el
  cliente el 09/08/2026 (ficha de Google)
- Valoración en el código: 4,0 — **no verificada**
- Contexto: Anoeta es un municipio de ~2.000 habitantes a 4 km de Tolosa. Aquí la
  panadería no es una opción más: es *la* panadería del pueblo. Ese es el tono.
- Coordenadas: `43.1628447, -2.0715969` (San Juan kalea, 2). Las anteriores
  (`43.1637421, -2.0773860`) caían ~500 m al oeste, fuera del casco urbano.

### A.3 Alcance cerrado — la web habla de tres tiendas y solo de tres

**Decisión tomada:** el sitio trata **únicamente** estas tres tiendas:

1. Tolosa — **Andia**
2. Tolosa — **San Frantzisko**
3. **Anoeta**

Los directorios listan otros puntos a nombre de Okindegia Errotatxo, S.L. —
**Amarotz Auzoa 9** (San Blas), **San Esteban Auzoa 31** (Polígono La Muela, casi con
seguridad el obrador de producción), y referencias sueltas a **Ibarra** y **Azpeitia**.
**Ninguno aparece en la web**: ni en las tarjetas, ni en el mapa, ni en el copy, ni en
el structured data, ni en el footer. Se anotan aquí solo para que nadie los "recupere"
más adelante creyendo que faltaban.

Consecuencia de copy: "tres tiendas" sí se puede afirmar, y la cifra 3 es utilizable en
títulos y textos.

### A.4 Discrepancias a resolver con el cliente (bloqueantes para publicar)

1. Teléfono de San Frantzisko (el del código es inventado y sigue sin fuente).
2. ~~Horarios de San Frantzisko y Anoeta~~ — **resuelto el 09/08/2026**, ver A.2.
3. Valoraciones 4,4 y 4,0: si no se pueden respaldar con la ficha de Google, **se retiran**.
   Publicar una nota falsa es riesgo real, no un detalle estético.
4. Nombre público de cada tienda: ¿"Andia" y "San Frantzisko" o los llaman de otro modo
   los vecinos? Lo segundo suele ser mejor rótulo.

Ninguna de estas dudas afecta al alcance: son tres tiendas, punto (ver A.3).

### A.5 Qué debe conseguir la sección (encargo real, no decorativo)

El 80 % de las visitas a una web de panadería local buscan **dónde, a qué hora y cómo
llegar**. La sección de tiendas es la página de destino real del sitio. Objetivos, por orden:

1. Que en 3 segundos el visitante identifique **la tienda que le pilla cerca**.
2. Que sepa **si está abierta ahora mismo** sin hacer cuentas.
3. Que pueda **llamar** o **abrir la ruta** con un toque desde el móvil.
4. Que las tres se lean como **una misma casa**, no como tres negocios sueltos.

---

## B. PROMPT DE IMPLEMENTACIÓN

Trabaja en `errotatxo-tolosa/` (Next.js 14 App Router estático, Tailwind, GSAP + Lenis,
i18n propio ES/EU en `src/lib/i18n.tsx`, datos en `src/lib/stores.ts`).

### B.1 Encargo

Crea una sección nueva, `src/components/sections/Tiendas.tsx`, que presente las tres
tiendas de Errotatxo con peso editorial propio, y colócala en la home
(`src/app/page.tsx`) **justo debajo de la sección de productos**. La sección de mapa y
la de horarios van después, en bloques independientes: esta sección **no lleva mapa
embebido ni tabla de horarios completa**.

`Cifras` desaparece de la home (borrar el render en `page.tsx`; el componente y sus
claves i18n se eliminan si no quedan usos).

**Restricción dura:** exactamente **tres** tiendas — Andia, San Frantzisko y Anoeta.
`stores.ts` no debe contener ninguna otra entrada. No añadas Amarotz, Ibarra, Azpeitia
ni el obrador de San Esteban en ningún punto de la web.

### B.2 Estructura visual

Cabecera de sección, coherente con el resto del sitio:
- `eyebrow` + `line-mark`
- `RevealText` a dos líneas: **"Tres tiendas," / "un mismo obrador"** (eu: *"Hiru denda,"
  / "labe bera"*)
- Párrafo `body-editorial` de una o dos frases situando el valle del Oria (Tolosa y Anoeta)

Cuerpo: **tres tarjetas editoriales grandes**, no las fichas comprimidas actuales.
- Desktop: grid de 3 columnas, `gap-6`, tarjetas de proporción alta (`aspect-[3/4]` para
  la imagen + bloque de datos debajo, no superpuesto). Alternativa aceptable: filas
  horizontales alternando imagen izquierda/derecha si se busca más aire editorial —
  elige una y sé consistente.
- Móvil: una columna, tarjetas apiladas a ancho completo.

Cada tarjeta contiene, en este orden:
1. Imagen (`RevealImage`), con `object-cover` y zoom suave al hover (`ease-organic`, 700 ms)
2. Índice `01 / 02 / 03` en `text-madera`, como en `Productos`
3. Nombre de la tienda en `display`
4. `LiveStatusBadge` — abierto / cerrado ahora, calculado en `Europe/Madrid`
5. Una línea de **carácter** propia de cada tienda (ver copy en B.4) — es lo que impide
   que las tres tarjetas se lean iguales
6. Dirección con icono `MapPin`
7. Teléfono como `<a href="tel:">` (icono `Phone`), sólo si está verificado
8. Horario **resumido en una línea** ("L–V 7:00–19:00 · S–D 7:00–14:00"). El detalle
   completo vive en la sección de horarios posterior
9. Dos acciones al pie: **Cómo llegar** (Google Maps, `target="_blank" rel="noopener
   noreferrer"`) y **Llamar**. Estilo `link-underline`, `text-[11px] uppercase
   tracking-widest2`

### B.3 Datos

Amplía `src/lib/stores.ts` sin romper a los consumidores actuales (`Ubicacion`,
`TiendasMap`, `LiveStatusBadge`):
- Añade `tagline?: string` (frase de carácter) y `neighborhood?: string`
- Añade `hoursSummary?: string` para la línea comprimida de la tarjeta
- Marca explícitamente lo no verificado: `verified?: { phone: boolean; hours: boolean; rating: boolean }`
- **Retira `rating` de San Frantzisko y Anoeta** hasta que el cliente lo confirme, y no
  pintes estrella si `rating` es `undefined`
- El teléfono de San Frantzisko queda comentado con un `// TODO: confirmar con cliente`
  hasta validación; si no hay teléfono, la acción "Llamar" no se renderiza (nunca un
  botón muerto)

Las cadenas visibles van a `i18n.tsx` en **es** y **eu**; `stores.ts` guarda sólo datos
factuales (direcciones, coordenadas, teléfonos, horas). El `tagline` es copy → i18n,
indexado por `store.id`.

### B.4 Copy (ES / EU)

**Intro** — es: "Tres tiendas en el valle del Oria. El mismo pan, la misma masa y la
misma gente detrás del mostrador desde 1996." · eu: "Hiru denda Oria bailaran. Ogi bera,
ore bera eta jende bera mostradorearen atzean 1996tik."

**01 · Tolosa — Andia** — es: "En pleno casco viejo, a un paso de la plaza. La tienda
donde empezó todo." · eu: "Alde Zaharraren erdian, plazatik pauso batera. Dena hasi zen
denda."

**02 · Tolosa — San Frantzisko** — es: "Junto al paseo, camino del río. La panadería de
los que pasan cada día a la misma hora." · eu: "Pasealekuaren ondoan, ibaira bidean.
Egunero ordu berean pasatzen direnen okindegia."

**03 · Anoeta** — es: "En Anoeta no somos una panadería más: somos la del pueblo." ·
eu: "Anoetan ez gara okindegi bat gehiago: herrikoa gara."

Reglas de tono: frases cortas, sin adjetivos publicitarios ("exquisito", "único",
"pasión por"), sin exclamaciones. El euskera es equivalente, **no traducción literal**.
Nada de cifras redondas inventadas.

### B.5 Movimiento

- `FadeIn` escalonado con `delay={0.08 * i}` sobre las tarjetas
- `RevealImage` en las imágenes; `RevealText` sólo en el título de sección
- Hover: `-translate-y-1.5` + sombra `0_24px_48px_-16px_rgba(78,46,27,0.45)`, 500 ms
- Todo debe degradar limpio con `prefers-reduced-motion` (usar los helpers ya existentes,
  no añadir animaciones nuevas fuera de `motion/`)

### B.6 Accesibilidad y SEO

- `<section id="tiendas">` y cada tarjeta como `<article>`
- Imágenes con `alt` descriptivo por tienda (a i18n), nunca `alt=""` aquí
- Objetivos táctiles ≥ 44 px en las acciones de móvil
- El estado abierto/cerrado no puede depender sólo del color: siempre lleva texto
- Actualiza `src/lib/structuredData.ts`: `Bakery` por tienda con `address`,
  `telephone`, `geo` y `openingHoursSpecification` reales. **No emitas `aggregateRating`
  para las tiendas cuya valoración no esté verificada.**

### B.7 Criterios de aceptación

1. La home queda: Hero → Productos → **Tiendas** → Mapa → Horarios. Sin `Cifras`.
2. Las tres tarjetas se distinguen entre sí por imagen y por línea de carácter.
3. `npm run build` pasa sin errores de tipos ni de lint.
4. Nada visible en pantalla en ES sin su equivalente en EU.
5. Ningún dato no verificado se muestra como si lo estuviera: sin teléfono inventado,
   sin valoración sin respaldo, sin horario de fin de semana ficticio.
6. Verificado en viewport 375 y 1280, en claro y en oscuro.

### B.8 Fuera de alcance

Mapa, sección de horarios, página de historia, retirada de `/obrador`, productos.
Van en sus propios prompts.

---

## Fuentes

- [RestaurantGuru — Errotatxo, Tolosa](https://restaurantguru.com/Errotatxo-Tolosa)
- [Empresite (El Economista) — Okindegia Errotatxo SL](https://empresite.eleconomista.es/OKINDEGIA-ERROTATXO.html)
- [Yelp — Okindegia Errotatxo, Andia Kalea 3](https://www.yelp.com/biz/okindegia-errotatxo-tolosa)
- [QDQ — Okindegia Errotatxo SL, Tolosa](https://www.qdq.com/okindegia-errotatxo-sl-813911)
- [QDQ — Okindegia Errotatxo SL, Anoeta](https://www.qdq.com/okindegia-errotatxo-sl-813804)
- [Páginas Amarillas — Errotatxo, Anoeta](https://www.paginasamarillas.es/f/anoeta/errotatxo_203820865_000000001.html)
- [Páginas Amarillas — Okindegia Errotatxo, Amarotz Auzoa 9](https://www.paginasamarillas.es/f/san-blas/okindegia-errotatxo_133411454_000000003.html)
- [Páginas Amarillas — Okindegia Errotatxo SL, San Esteban Auzoa 31](https://www.paginasamarillas.es/f/san-esteban/okindegia-errotatxo-s-l-_133411454_000000004.html)
- [Kompass — Okindegia Errotatxo](https://es.kompass.com/c/okindegia-errotatxo/es1176055/)
- [Firmania — Errotatxo, Anoeta](https://firmania.es/anoeta/errotatxo-803244)
