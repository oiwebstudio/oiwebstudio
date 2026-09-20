# SEO: lo que falta y no puedo hacer yo

Estado a 20/9/2026. Todo lo que se podía hacer desde el código y desde Search
Console está hecho. Queda esto, que necesita una cuenta tuya o una
verificación de identidad. Están por orden de impacto.

---

## 1. Ficha de Google Business (lo que más te puede subir)

En «diseño web Tolosa» sales **1º en los resultados normales**, pero encima de
ti aparece el bloque del mapa con tres negocios: Shareweb (21 reseñas), Chroma
Estudioa (17) y Uau Webs (4). Ese bloque se lleva la mayoría de los clics y
**no se puede tocar desde la web**: sale de las fichas de Google Business.

En la cuenta oieriras@gmail.com no hay ninguna ficha creada
(business.google.com → «No has añadido ninguna empresa»).

**Por qué no la creo yo:** hace falta una dirección real para verificar, y no
me la invento. La verificación, además, es por vídeo o por postal: la tienes
que hacer tú.

**Pasos:** google.com/business → «Gestionar ahora».

- **Nombre:** OI Studio
- **Categoría principal:** Diseñador de sitios web *(es la que usan los tres
  competidores del mapa)*
- **Categorías secundarias:** Agencia de marketing, Servicio de diseño gráfico
- **¿Tienes una ubicación a la que puedan ir los clientes?** Si trabajas desde
  casa, responde **No** y marca solo zona de servicio: así Google no publica tu
  dirección, pero te la pide igualmente para verificarte.
- **Zonas de servicio:** Tolosa, Tolosaldea, Donostialdea, Goierri,
  Buruntzaldea, Urola Kosta, Bidasoa (o «Gipuzkoa» entero)
- **Teléfono:** +34 680 95 67 55
- **Web:** https://oiwebstudio.com

**Descripción, lista para pegar** (Google admite hasta 750 caracteres):

> Estudio de diseño y desarrollo web en Tolosa, para negocios locales de
> Gipuzkoa. Webs rápidas, cuidadas y preparadas para aparecer en Google desde
> el primer día. Precio cerrado por escrito desde 199 €, propuesta en 48 horas
> y 30 días de ajustes incluidos. Trabajo en castellano y en euskera, con
> negocios de Tolosaldea, Donostialdea, Goierri y toda Gipuzkoa: hostelería,
> comercio, peluquería y estética, talleres, clínicas y servicios
> profesionales. Puedes ver ocho webs de ejemplo publicadas y navegables en
> oiwebstudio.com.

Cuando la tengas verificada, avísame y le meto las fotos, el horario, los
servicios con sus precios y el enlace directo para pedir reseñas.

---

## 2. Reseñas

Con la ficha verificada, Google te da un enlace corto para pedir reseñas. Es
lo que más mueve el bloque del mapa: los de arriba tienen 17 y 21.

Aprovecha los envíos que estás haciendo: a cada cliente con la web ya
entregada, un mensaje corto. Ejemplo:

> Kaixo [nombre], ¿qué tal va la web? Si estás contento con cómo quedó, me
> ayudaría mucho una reseña en Google: son dos líneas y para un estudio
> pequeño como el mío marcan la diferencia. Te dejo el enlace directo: [enlace]

---

## 3. Forzar HTTPS en Cloudflare (2 minutos)

`http://oiwebstudio.com` servía la web sin redirigir, así que Google la veía
duplicada en http y en https, y el navegador marcaba «no seguro».

Ya hay una salvaguarda en la web: quien entre por http salta a https. Pero el
arreglo bueno es una casilla:

dash.cloudflare.com → oiwebstudio.com → **SSL/TLS** → **Edge Certificates** →
**Always Use HTTPS** → activar.

*(El dominio va por Cloudflare, así que la casilla «Enforce HTTPS» de GitHub
Pages no sirve aquí.)* Cuando lo actives, avísame y quito la salvaguarda de la
web, que deja de hacer falta.

---

## 4. Directorios (tus primeros enlaces de fuera)

Hoy **no hay ni un solo enlace externo** a oiwebstudio.com. Los competidores
salen en directorios que además posicionan solos.

No los doy de alta yo porque hay que crear una cuenta en cada uno. Son
gratis:

- trustlocal.es → sale el 3º en «diseñador web Tolosa» con su lista «Top 10»
- prontopro.es → sale en «diseño web Tolosa»
- paginasamarillas.es

**Importante:** escribe siempre los mismos datos, carácter por carácter, aquí
y en la ficha de Google. Google los cruza:

```
OI Studio
Tolosa, Gipuzkoa
+34 680 95 67 55
contactoiwebstudio@gmail.com
https://oiwebstudio.com
```

---

## 5. Una URL suelta en Search Console

Pedí indexación de 10 páginas y se agotó la cuota diaria de Google. Quedó una:

`https://oiwebstudio.com/eu/contacto.html`

No corre prisa: está en el sitemap y enlazada desde las demás páginas en
euskera, así que Google llegará igual. Si quieres acelerarlo, pégala en la
barra de Search Console y pulsa «Solicitar indexación».

---

## 6. Repasar el euskera con un hablante

Las páginas de zona en euskera las traduje yo y luego corregí ocho cosas, una
de ellas de significado. Están correctas, pero conviene que las lea alguien
nativo:

- https://oiwebstudio.com/eu/zonas/donostia-san-sebastian.html
- https://oiwebstudio.com/eu/zonas/irun.html
- https://oiwebstudio.com/eu/zonas/zarautz.html

Los textos están en `scripts/euskera-zonas.mjs`, con el castellano al lado.
