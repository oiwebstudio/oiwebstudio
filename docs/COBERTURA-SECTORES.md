# Cobertura de plantillas por sector

Cruce entre lo que la herramienta de captación tiene encontrado y las plantillas
que existen. Los números salen de `captacion/prisma/captacion.db`:
**2.391 negocios, 1.431 sin web.**

Para regenerar el recuento:

```bash
npm --prefix captacion run dashboard
```

---

## Estado

| # | Plantilla | Categorías que cubre | Sin web |
|---|---|---|---|
| 1 | ✅ `belleza-peluqueria` | peluquería 352 · estética 59 · barbería 18 · uñas 17 · tatuador 0 | **446** |
| 2 | ✅ `alimentacion-obrador` | panadería 103 · carnicería 89 · frutería 25 · pescadería 10 · herboristería 4 | **231** |
| 3 | ⬜ `comercio-tienda` | ropa 85 · zapatería 49 · joyería 30 · óptica 16 · librería 12 · ferretería 8 · papelería 5 | **205** |
| 4 | ⬜ `cafeteria-bar` | cafetería 116 · bar 58 · pub 13 | **187** |
| 5 | ✅ `hosteleria-asador` | restaurante 154 · hotel 1 | 155 |
| 6 | ✅ `automocion-taller` | taller 56 · autoescuela 2 | 58 |
| 7 | ✅ `salud-odontologia` | dentista 52 · fisioterapia 30 | 82 |
| 8 | ✅ `floristeria` *(demo `floristeria-tallo`)* | floristería 24 | 24 |
| 9 | ⬜ `gimnasio-clases` | gimnasio 21 | 21 |
| 10 | ✅ `veterinaria` | veterinario 14 | 14 |
| 11 | ✅ `abogacia-gestoria` | asesoría 3 · inmobiliaria 5 | 8 |
| 12 | ✅ `reformas-gremios` | *(sin categoría en el buscador — ver abajo)* | — |

**Cubierto hoy: 1.018 de 1.431 (71 %).** Con las tres pendientes: 1.431 (100 %).

---

## Las tres que faltan

### `comercio-tienda` — 205 sin web
Ropa, zapatería, joyería, óptica, librería, ferretería, papelería.
Acción principal: **venir a la tienda**, no comprar online.
Bloque de sector: **el escaparate de esta semana** y las marcas que trabaja.
Lo que ningún competidor pone: si tienen tu talla, si reservan una prenda por
teléfono y si hacen arreglos.

### `cafeteria-bar` — 187 sin web
Cafetería, bar, pub. **No es el asador**: aquí no se reserva mesa. Lo que se
busca es a qué hora abren, si ponen desayunos, si hay terraza y si dan pintxos.
Bloque de sector: **el desayuno y el pintxo del día**, con el horario ampliado
(la gente busca a las 7:00 y a las 23:00, que es cuando el resto está cerrado).

### `gimnasio-clases` — 21 sin web
Bloque de sector: **el cuadro de clases de la semana**, con la de ahora marcada
sola, y las cuotas sin letra pequeña.

---

## Nota sobre `reformas-gremios`

No aparece en la tabla porque el buscador no tiene categoría para reformas: OSM
no etiqueta bien a los gremios. Son negocios reales y con ticket alto, pero hay
que encontrarlos por otra vía (boca a boca, Páginas Amarillas, el colegio de
aparejadores). La plantilla está hecha y esperando.

Si se quiere buscarlos con la herramienta, habría que añadir al mapa de
categorías de `captacion/src/finder/categories.ts` algo como:

```ts
reformas: '"craft"="builder"',
fontanero: '"craft"="plumber"',
electricista: '"craft"="electrician"',
```

Aviso: la cobertura de `craft=*` en OpenStreetMap para Gipuzkoa es floja, así que
saldrán pocos. Merece más la pena buscarlos a mano.

---

## Cómo se usa esto

1. En la captación, filtrar por la categoría con más negocios sin web.
2. Coger la plantilla de la fila correspondiente en `web/demos/_plantillas/`.
3. Editar **solo** el bloque `DATOS`: nombre, teléfono, dirección, horario, reseñas.
4. Cambiar las fotos por las suyas de Google Maps o Instagram.
5. Publicar y mandar el enlace.

Presupuesto: **90 minutos por demo**.

> El orden de ataque lo marca la columna «sin web». Peluquería sola son 352
> negocios: más que las seis categorías del final de la tabla juntas.
