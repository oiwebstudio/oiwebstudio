# BRIEF — `heroesq`: 50 heroes catalogados por composición

Sección nueva para `biblioteca-animaciones/index.html`.
Dirección de arte + especificación de construcción.

---

## 0. El encargo en una frase

Cincuenta primeras pantallas para negocio local **catalogadas por dónde caen los bloques**
—foto, texto, botones— para que elegir estructura deje de ser una decisión improvisada y
pase a ser una decisión de catálogo.

---

## 1. Diagnóstico: qué falta hoy

La biblioteca tiene 150 heroes en tres bloques y los tres responden a la misma pregunta:
*¿qué aspecto tiene?*

| Bloque | Eje de catalogación | Pregunta que resuelve |
|---|---|---|
| `hero-` | efecto | ¿cómo se mueve? |
| `heropro-` | acabado | ¿cuánto lujo tiene? |
| `heromin-` | densidad | ¿cuánto ruido quito? |
| **`heroesq-`** | **composición** | **¿dónde pongo cada cosa?** |

Cuando se monta la web de un bar, la duda nunca es "¿aurora o parallax?". Es "la foto del
comedor, ¿a la derecha o de fondo?" y "el botón de reservar, ¿arriba, debajo del texto o
fijo abajo?". Ese eje no está cubierto, y es el que más condiciona si la página convierte.

**`heroesq` es ortogonal a las otras tres secciones**: se elige un esquema aquí, y encima se
le aplica el efecto de `hero-`, el acabado de `heropro-` y la tipografía de `font-`. Por eso
la sección debe ser deliberadamente **sobria en efecto**: si una pieza llama la atención por
su animación, está mal hecha, porque tapa lo que se está enseñando.

---

## 2. Tesis de diseño

Cinco principios que gobiernan las 50 piezas. Cuando dos entren en conflicto, gana el que
esté más arriba.

### 2.1. El hero de un negocio local no persuade: enruta

El visitante llega con la intención ya formada —comer, reservar, arreglar el coche, saber
si está abierto—. No hay que convencerlo de nada, hay que **quitarle de encima los tres
segundos de "¿es este el sitio y cómo lo hago?"**.

De ahí la jerarquía obligatoria, en este orden de lectura:

```
1. IDENTIDAD   ¿es este el sitio?          nombre + qué es + dónde
2. PRUEBA      ¿me sirve?                  foto real, horario, precio, reseña
3. ACCIÓN      ¿cómo lo hago?              llamar / reservar / llegar
```

Ninguna pieza puede invertir este orden visualmente. El botón nunca gana peso óptico al
titular; lo gana en **contraste y posición**, no en tamaño.

### 2.2. El móvil es la pieza original; el escritorio, la derivada

Las búsquedas locales son mayoritariamente de móvil, muchas veces de pie y en la calle. Así
que **cada esquema se diseña primero a 375 px** y se expande a 1440. Esto invierte el hábito
de la biblioteca actual, donde lo móvil llegó después, y es una decisión consciente.

Consecuencia dura: **la acción principal vive en el tercio inferior de la pantalla**, dentro
del alcance del pulgar. Un botón a 700 px de altura en móvil es un botón que no existe. Los
esquemas que colocan el CTA arriba solo son válidos si además lo repiten abajo o si el
propio bloque completo cabe en pantalla.

### 2.3. La foto es prueba, no decoración

En un negocio local la imagen contesta una pregunta concreta, y por eso **el esquema de
imagen se elige por el tipo de prueba que entrega**:

| Tipo de prueba | Qué enseña | Encaja en |
|---|---|---|
| **Espacio** | cómo es el local por dentro | bar, hotel rural, gimnasio, clínica |
| **Producto** | el objeto que se vende | panadería, floristería, carnicería, óptica |
| **Resultado** | el antes/después del servicio | peluquería, estética, taller, reformas |
| **Persona** | quién te va a atender | gestoría, fisio, veterinaria, abogado |
| **Proceso** | cómo se hace | obrador, cerrajería, academia |

Un esquema de mosaico no sirve para "persona" y un retrato a sangre no sirve para
"producto". La ficha de cada pieza debe declarar qué tipo de prueba asume.

Las fotos se simulan con gradientes CSS multicapa, como ya se hace en los `heropro` móviles
(`bg-hair`, `bg-rest`…). **No se descarga ni un solo asset.** Los gradientes deben leerse
como fotografía —dirección de luz coherente, una zona clara y una oscura, nunca un degradado
plano de dos paradas— porque si parecen bloques de color el esquema deja de evaluarse bien.

### 2.4. Ruta de lectura antes que retícula

Cada esquema declara su recorrido óptico y lo respeta:

- **Bloque de texto a la izquierda + foto a la derecha** → patrón F. El CTA cae al final del
  primer barrido vertical, alineado al margen izquierdo del texto. Nunca centrado.
- **Foto a sangre + texto encima** → patrón Z. Marca arriba-izquierda, acción abajo-derecha.
- **Texto centrado sin foto** → eje único. Todo colgado de la línea central, y entonces el
  CTA sí va centrado. Mezclar centrado con un CTA a la izquierda es el error más común.
- **Dos columnas de texto** → Gutenberg. La esquina inferior derecha es zona terminal: ahí va
  la acción, no un dato decorativo.

Regla derivada: **la alineación del CTA se hereda del bloque de texto**, jamás se decide por
separado.

### 2.5. Densidad honesta

Una barbería no tiene "métricas". Un bar no tiene "casos de éxito". Los huecos que deja el
esquema se rellenan con las señales que ese negocio realmente posee:

`● Abierto ahora · cierra a las 20:00` · `★★★★☆ 4,6 · 213 reseñas` · `A 4 min de la plaza` ·
`Menú del día 16 €` · `Desde 1978 en el barrio` · `Recogida en 20 min` ·
`Aparcamiento en la puerta` · `Se habla euskera`

Si un esquema no tiene sitio para ninguna de estas, **debe dejar aire**, no inventar relleno.

---

## 3. Gramática de nombres

El nombre clave describe la composición y se lee en voz alta sin abrir el HTML:

```
heroesq-<imagen>-<texto>-<accion>
```

- `heroesq-media-izq-cta-doble` → foto media pantalla a la izquierda, texto derecha, dos botones.
- `heroesq-sangre-z-barra-fija` → foto a sangre, recorrido Z, barra de acción fija al pie.
- `heroesq-sinfoto-centro-cta-ancho` → sin imagen, texto centrado, botón a todo el ancho.

**El nombre nunca lleva el sector.** El sector es el relleno de ejemplo y rota; el esquema es
lo permanente. Un mismo `heroesq-mosaico-izq-cta-flecha` sirve para floristería y para óptica.

---

## 4. La matriz: cómo se generan las 50

Tres ejes. Cada pieza es una terna única, y la selección de las 50 debe cubrir cada valor de
cada eje al menos tres veces.

### Eje A — Imagen (10 valores)

| # | Valor | Nota de composición |
|---|---|---|
| A1 | `sinfoto` | Tipografía y color sostienen la pantalla. El titular sube a display grande. |
| A2 | `sangre` | Fondo completo + scrim direccional. Nunca overlay negro plano al 50 %. |
| A3 | `media-der` | 50/50. El sujeto de la foto mira hacia el texto, no hacia fuera. |
| A4 | `media-izq` | Invierte el patrón F; el texto pierde apoyo, así que necesita más peso tipográfico. |
| A5 | `recorte` | Círculo, arco o rombo. La forma debe justificarse (arco = puerta, círculo = retrato). |
| A6 | `mosaico` | 3–4 fotos con una dominante. Nunca cuatro iguales: eso es una galería, no un hero. |
| A7 | `tira` | Franja horizontal al pie, scroll lateral insinuado. Prueba de "producto". |
| A8 | `flotante` | La foto desborda el marco por un lado. Da profundidad sin sombra falsa. |
| A9 | `mockup` | Móvil, carta o ticket. Solo si el negocio tiene algo digital que enseñar. |
| A10 | `franja` | Columna, banda o diagonal parcial. Deja que el color de marca respire. |

### Eje B — Texto (6 valores)

`izq` · `centro` · `der` · `dos-col` · `antetitulo` (eyebrow + titular) · `dato` (cifra o
precio como protagonista tipográfico).

Medida de línea siempre entre **34 y 52 caracteres**. La regla `max-width:34ch` que ya usa
`.hx p` es correcta y se mantiene.

### Eje C — Acción (12 valores) — el eje que importa

| # | Valor | Cuándo | Por qué |
|---|---|---|---|
| C1 | `cta-doble` | El caso general | Primario + fantasma. Nunca dos primarios compitiendo. |
| C2 | `cta-unico` | Una sola intención posible | Máxima conversión, cero duda. Bar de menú fijo. |
| C3 | `cta-flecha` | Servicio caro, decisión lenta | Botón + enlace con flecha para el que aún explora. |
| C4 | `barra-fija` | Móvil, negocio de llamada | Zona de pulgar. El patrón más efectivo de la lista. |
| C5 | `cta-header` | Cabecera con marca | Reserva junto al logo. Requiere repetirlo abajo. |
| C6 | `cta-sobre-foto` | Foto que ya convence | La acción cae donde está mirando el ojo. |
| C7 | `cta-apilado` | Móvil estrecho, 2 acciones largas | Evita el botón partido en dos líneas. |
| C8 | `cta-telefono` | Cliente mayor, urgencia | El número **es** el botón, a 28 px, `tel:`. |
| C9 | `cta-terna` | Restaurante, clínica | Reservar / Llamar / Cómo llegar. Solo tres, jamás cuatro. |
| C10 | `cta-tarjeta` | Hotel, inmobiliaria | Panel flotante sobre la foto con acción y dato. |
| C11 | `cta-pie` | Marca sobria, gama alta | Tras una línea, al fondo. Lento a propósito. |
| C12 | `cta-ancho` | Móvil, acción única | Botón a todo el ancho. El más grande y el más obvio. |

**Reglas transversales de acción**

- Área táctil mínima real **44 × 44 px**, con `padding` no con `height`.
- Contraste del primario ≥ 4.5:1 contra su fondo inmediato, medido sobre el punto más claro
  del gradiente, no sobre el promedio.
- El secundario nunca es un botón relleno de otro color: es fantasma, texto o enlace.
- Ningún esquema muestra más de tres acciones. Cuatro botones es no haber decidido.

---

## 5. Tokens y contrato visual

Se trabaja **dentro del sistema que ya existe** en `:root`; no se introducen variables nuevas
salvo las de esta sección, con prefijo `--eq-`.

**Color.** Cada pieza usa **un acento de los ocho existentes** (`--accent`…`--accent8`), y
solo uno. El acento se elige por sector, no por gusto: cálidos (`--accent4`, `--accent7`) para
hostelería y comercio de boca; fríos (`--accent5`, `--accent8`) para salud y servicios
técnicos; `--accent3` para bienestar y verde; `--accent2` para estética y belleza. El neutro
manda: el acento aparece en el CTA primario y, como mucho, en un segundo sitio.

**Tipografía.** `--display` (Bricolage Grotesque) para titulares, `--sans` (Geist) para
cuerpo, `--mono` (Geist Mono) para antetítulos, horarios y precios —el mono da a los datos un
aire de rótulo y ficha que encaja con el comercio—. Escala del titular en la maqueta:
`clamp(26px, 5vw, 40px)` con `letter-spacing:-.04em` y `line-height:.98`. Cuerpo 13,5 px,
`line-height:1.6`.

**Espaciado.** Múltiplos de 4, con la escala 4 / 8 / 12 / 20 / 32. El aire entre el bloque de
texto y la acción es **siempre mayor** que el aire entre titular y párrafo: separa lo que se
lee de lo que se pulsa.

**Radio y sombra.** Radio 16 px en el contenedor, 100 px en botones de píldora, 12 px en
tarjetas internas. Sombras solo con `--sh-2` / `--sh-3`; nada de sombras inventadas por pieza.

**Motion.** Al máximo **un gesto por pieza**, y siempre funcional: entrada escalonada del
bloque de texto, o un desplazamiento leve de la foto. Duración 300–500 ms, `--ease-out`.
`prefers-reduced-motion: reduce` desactiva todo. Si dudas, ninguna animación.

---

## 6. Copy

Las 50 piezas llevan texto real. El copy genérico arruina un catálogo de composición porque
impide juzgar si el bloque tiene el tamaño correcto.

**Sí:** `Reservar mesa` · `Pedir cita` · `Llamar ahora` · `Cómo llegar` · `Ver la carta` ·
`Encargar` · `Pedir presupuesto` · `Ver precios` · `WhatsApp` · `Horarios`.

**No:** `Saber más` · `Empezar` · `Descubrir` · `Contactar` · `Más información` · cualquier
verbo que no diga qué pasa al pulsarlo.

**Titulares:** dicen qué hace el negocio y para quién, en lenguaje de cliente, no de sector.
`Cortes que aguantan el mes` sirve; `Excelencia en peluquería` no. Máximo dos líneas en móvil.

**Voz:** español neutro, frases cortas, sin superlativos. Sentence case en botones y etiquetas.
La acción mantiene el mismo nombre en toda la pieza.

**Negocios:** inventados, con sonido local vasco/castellano (Ilargi, Ogi Berri, Garaje Beltza,
Lore, Zaindu). Ninguna marca real, ningún teléfono real —`943 00 00 00`.

### Sectores a cubrir (25, máximo 2 apariciones cada uno)

Bar · restaurante · cafetería · panadería · peluquería · barbería · centro de estética ·
tienda de ropa · ferretería · floristería · frutería · carnicería · taller mecánico ·
gimnasio · clínica dental · fisioterapia · veterinaria · óptica · academia · gestoría ·
inmobiliaria · hotel rural · guardería · cerrajería · reformas.

---

## 7. Lista negra

Si una pieza cumple tres o más de estos, se rehace:

1. Texto centrado + blob degradado de fondo + dos botones píldora. Es el hero por defecto de
   internet en 2026.
2. Overlay negro uniforme sobre la foto para "arreglar" el contraste.
3. Marcadores numerados `01 / 02 / 03` donde no hay secuencia real.
4. Métricas inventadas (`+500 clientes satisfechos`) en negocios que no las tienen.
5. Cuatro botones del mismo peso.
6. Iconos genéricos de "check" adornando una lista que no es una lista.
7. Titular que no menciona ni el oficio ni el pueblo.
8. Foto de mosaico donde las cuatro imágenes pesan igual.
9. Botón fantasma sobre foto sin scrim detrás: ilegible en cuanto la foto es clara.
10. La misma silueta que otra pieza de la sección con distinto color.

---

## 8. Construcción

- Sección `<section class="category" id="heroesq">` colocada **después de `#heromin`**, con
  `.cat-head` (tag `15 · Heroes por esquema`, `<h2>`, `<p>` de intención) y `<div id="heroesq-host">`.
- Builder IIFE al final del `<script>`, mismo patrón que el de `heromin`: recorre un array
  `ESQ` y va creando filas `.grid-2` con `.demo` → `.demo-label` + `.demo-stage`.
- **Renumerar** las secciones posteriores (Tipografía pasa a 16, Header a 17, Contenido a 18,
  Footer a 19) en el HTML, en la navegación del índice y en `CATALOGO.md`.
- Cada entrada del array declara: `[nombre clave, etiqueta legible, badge, prueba, html]`,
  donde `prueba` es uno de los cinco tipos de §2.3 y se muestra como micro-etiqueta en el
  `.demo-label`.
- Se reutilizan `.hx`, `.hxm`, `.b`, `.b.gh`, `.eyeb`, `.acts`, `.mbar`, `.badge2`, `.kick`,
  `.sheet`, `.strip`, `.glow`. Clases nuevas solo si el esquema no sale con las existentes, y
  con prefijo `.eq` (`.eq-split`, `.eq-bleed`, `.eq-arc`…), en un bloque CSS propio comentado.
- **Cada esquema se presenta en sus dos estados**: la maqueta ancha (`.hx`, 520 × 300) y la
  móvil (`.hxm`, 300 × 560 aprox.). El catálogo pierde su valor si no se ve cómo apila.
- Al apilar en móvil, el orden resultante nunca puede poner una acción antes del titular.
- HTML + CSS + JS vanilla. Sin GSAP, sin librerías, sin fuentes nuevas, sin base64.
- Consola limpia. `prefers-reduced-motion` respetado. Foco de teclado visible en todo lo
  pulsable.

---

## 9. Entregables

1. Sección `heroesq` completa en `index.html` (CSS agrupado + builder + navegación).
2. Renumeración de las secciones posteriores, coherente en HTML y en `CATALOGO.md`.
3. `CATALOGO.md`: fila en la tabla resumen (`Heroes por esquema | 50 | heroesq-`) y apartado
   propio con las 50 filas. La columna *"qué hace"* describe **la posición de los bloques**,
   no el efecto: `Foto a la derecha, texto a la izquierda, dos botones bajo el párrafo`.
   Columna extra con el tipo de prueba.
4. Tabla de cobertura al final del apartado: qué valores de A, B y C cubre cada pieza, para
   ver de un vistazo que no hay agujeros ni duplicados.
5. `shot8.js` siguiendo el patrón de los `shot*.js` existentes, con captura de escritorio
   (1440) y móvil (375).

---

## 10. Criterios de aceptación

- **Test de la silueta.** Con las 50 piezas en escala de grises y desenfocadas a 8 px, no hay
  dos siluetas iguales. Este es el criterio principal: si dos piezas solo se distinguen por el
  color, una sobra.
- **Test del sector.** Cualquiera de los 25 sectores encuentra al menos un esquema que le
  encaja sin retocar la estructura.
- **Test del nombre.** Se dice el nombre clave en voz alta y se dibuja el esquema en una
  servilleta sin abrir el archivo.
- **Test del pulgar.** En las 50 maquetas móviles, la acción principal cae en el tercio
  inferior o el bloque entero cabe en pantalla.
- **Contraste.** Todo texto sobre imagen supera 4.5:1 en el punto más desfavorable del
  gradiente.
- Abre sin errores en consola en Chrome a 1440 y a 375 px.

---

## 11. Fuera de alcance

- No se tocan `hero-`, `heropro-` ni `heromin-`.
- No se generan ni descargan imágenes reales.
- No se aplica nada a ninguna web de cliente; esto es catálogo.
