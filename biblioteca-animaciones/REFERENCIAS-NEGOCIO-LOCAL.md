# Referencias de negocio local — qué hacen sus heroes

Análisis de fuentes reales de hostelería, barbería y comercio de barrio, para contrastar
contra `heroesq`. Es el género que nos toca: land-book y 21st.dev, las dos referencias que
usamos para lo demás, van de SaaS y producto digital, y su lenguaje no traslada.

Fecha: agosto de 2026.

---

## 1. Lo que confirman las fuentes y la biblioteca ya cubre

| Hallazgo | Dónde está en `heroesq` |
|---|---|
| Dos botones en el hero: reservar + ver carta | `C1 cta-doble` (9 piezas) |
| Botón de reserva **fijo** que sigue al scroll en móvil | `C4 barra-fija` (5 piezas) |
| Foto real del local, no de banco | Eje de prueba **Espacio** (13 piezas) |
| Prueba social con recuento de reseñas | `.eqsig` con estrellas |
| Antigüedad como argumento («Desde 1933») | Copy tipo «Desde 1974», «tres generaciones» |
| Precio visible, sin esconderlo | Eje B **dato grande** (10 piezas) |
| Nada de PDF para la carta | Los mockups de carta son HTML, no descarga |

El acierto de fondo se confirma: **el hero de negocio local enruta, no persuade**, y la
acción principal vive donde llega el pulgar.

---

## 2. Lo que las fuentes piden y la biblioteca NO tiene

Esto es material para la siguiente tanda. Cuatro esquemas ausentes, todos con respaldo:

### 2.1. Barra de datos esenciales (NAP + horario)
*«Your address, phone number, and hours should be visible above the fold — ideally in the
header or the hero section.»*

No hay ningún esquema con una **franja fina de datos** —dirección, teléfono, horario,
barrio— pegada al hero. Es requisito de SEO local, no adorno. Sería un valor nuevo del eje C
o, mejor, un eje D de guarnición: `heroesq-*-datos-arriba`.

### 2.2. Precio **y duración** por servicio
*«The best booking flows show price and duration for every service upfront.»*

El `.sheet` muestra precio pero nunca duración. En peluquería, estética, fisio y taller la
duración decide tanto como el precio: quien mira el móvil quiere saber si le cabe en la hora
de comer. Es un cambio pequeño en las fichas existentes, no un esquema nuevo.

### 2.3. Fila de personas con nombre
*«Naming barbers with their favorite cuts and Instagram handles… builds connection.»*

El tipo de prueba **Persona** existe (5 piezas), pero siempre como un retrato anónimo.
Ninguna enseña una **fila de dos o tres personas con nombre y especialidad**, que es lo que
de verdad convierte en barbería, peluquería y clínica pequeña.

### 2.4. Hero en vídeo
*«Video heroes (Mr. Winston's, Rudy's, The Rosemont Barbers)… stock photos kill that
instantly.»*

`heroesq` no tiene ningún esquema de vídeo. La biblioteca sí (`hero-video-overlay`), pero sin
la composición local: vídeo mudo en bucle del local + barra de acción fija encima. Se puede
maquetar sin archivo de vídeo, igual que se simulan las fotos.

---

## 3. Errores que las fuentes señalan y conviene dejar por escrito

Ampliación de la lista negra del brief, con respaldo externo:

11. **Mandar la reserva a Facebook o a Instagram.** Se pierde al visitante «en el momento
    exacto de la conversión». La reserva se resuelve en la página.
12. **Foto de banco.** «La experiencia de una barbería es física y atmosférica, y una foto de
    stock la mata al instante.» Nuestro eje de prueba ya lo asume, pero no estaba escrito
    como prohibición.
13. **Esconder el precio.** Aparece en todas las listas de fallos.
14. **Carta en PDF.** En móvil es la forma más rápida de perder al cliente.
15. **Formulario propio de reserva en vez de integración.** Los formularios convierten al
    1–3 %; las integraciones reales, al 15–30 %. Afecta al `href` del botón, no al esquema,
    pero cambia el resultado más que cualquier decisión visual de esta biblioteca.

---

## 4. Qué NO traer de las referencias que usamos para lo demás

- **21st.dev** es React + Tailwind + shadcn. De su catálogo de heroes animados, la biblioteca
  ya tenía todo salvo cuatro piezas (`adv-circuit-board`, `adv-digital-loom`,
  `adv-ascii-wave`, `adv-vapour-text`), y esas cuatro son estética tecnológica: sirven para
  estudio o producto digital, no para comercio de barrio.
- **Land-book** hoy es mayoritariamente SaaS de IA. Su lenguaje visual y sus titulares
  —«Welcome to agentic revenue»— no trasladan. Lo único que sí traslada, y mucho, es **cómo
  clasifican los titulares**: ese marco es el eje de titular que ya está incorporado a
  `heroesq`.

---

## Fuentes

- [Barbershop Websites: 20 Design Examples (2026) — Nanoglobals](https://nanoglobals.com/barbershop-websites/)
- [Restaurant Website Design Examples That Actually Drive Reservations (2026)](https://elevatewebdesign.ca/blog/restaurant-website-design-examples)
- [20 Best Restaurant Websites of 2026 (With Design Breakdowns) — Start Designs](https://www.startdesigns.com/blog/best-restaurant-websites/)
- [24 Best Barbershop Website Design Examples — The Salon Business](https://thesalonbusiness.com/barbershop-website-designs/)
- [Land-book — clasificación de headlines](https://land-book.com/headlines)
- [21st.dev — registro de componentes](https://21st.dev/)
