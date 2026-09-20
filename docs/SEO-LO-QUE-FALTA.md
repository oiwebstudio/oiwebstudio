# SEO: lo que falta y no puedo hacer yo

Estado a 20/9/2026. Todo lo que se podía hacer desde el código y desde Search
Console está hecho. Queda esto, que necesita una cuenta tuya o una
verificación de identidad. Están por orden de impacto.

---

## 1. La verificación de tu ficha de Google (lo más importante de todo)

En «diseño web Tolosa» sales **1º en los resultados normales**, pero encima de
ti aparece el bloque del mapa con tres negocios: Shareweb (21 reseñas), Chroma
Estudioa (17) y Uau Webs (4). Ese bloque se lleva la mayoría de los clics y
**no se puede tocar desde la web**: sale de las fichas de Google Business.

**La ficha existe** (en la cuenta contactoiwebstudio@gmail.com, no en
oieriras@gmail.com), con la categoría correcta, el teléfono y la web puestos, y
descripción. El problema es otro:

> **«No has pasado la verificación. Para hacerlo, envía otra grabación.»**

Se envió un vídeo de verificación y **Google lo rechazó**. Mientras siga así,
la ficha aparece como «NO ES VISIBLE PÚBLICAMENTE»: no sale en el mapa, no
puede recibir reseñas y no aparece en Maps. **Es el único motivo por el que no
estás en ese bloque.**

**Qué hacer:** business.google.com → OI Studio → «Verificar» → grabar otra vez.
Consejos para que no la vuelvan a rechazar:

- Graba en una sola toma, sin cortes, moviéndote: no vale una foto fija.
- Tiene que verse que el negocio es real y tuyo: el sitio desde el que
  trabajas, el equipo con la web abierta, algún documento o factura con el
  nombre OI Studio, y tú manejando todo eso.
- Si trabajas desde casa, se puede verificar igual como negocio de zona de
  servicio: enseña el puesto de trabajo y la documentación.
- Si la vuelven a rechazar, pide verificación alternativa desde la propia
  pantalla de ayuda (a veces ofrecen postal o vídeollamada con un agente).

**Yo no puedo hacer esto**: la grabación tienes que hacerla tú, y además la
edición de la ficha está bloqueada para mí por seguridad (Claude Code no me
deja modificar cuentas de terceros; lo intenté y lo paró).

**Cuando la verifiques, avísame**, porque le faltan cosas que sí mejoran
posiciones y que te dicto aquí por si prefieres hacerlas tú:

- **Zonas de servicio:** solo tiene 5 (Alegia, Anoeta, Ibarra, Tolosa,
  Villabona). Google admite 20. Añade: Andoain, Lasarte-Oria, Hernani,
  Errenteria, Donostia, Irun, Hondarribia, Zarautz, Azpeitia, Beasain,
  Ordizia, Zumarraga, Eibar, Bergara, Oñati, Arrasate-Mondragón. Son
  exactamente los municipios que ya tienen página propia en la web.
- **Categorías secundarias:** hoy solo hay «Diseñador de sitios web». Añade
  «Agencia de marketing» y «Servicio de diseño gráfico».
- **Descripción:** la que hay solo habla de Tolosaldea. Esta abarca más y no
  promete nada que la web no diga:

> Estudio de diseño y desarrollo web en Tolosa, para negocios locales de
> Gipuzkoa. Webs rápidas, cuidadas y preparadas para aparecer en Google desde
> el primer día. Precio cerrado por escrito desde 199 €, propuesta en 48 horas
> y 30 días de ajustes incluidos. Trabajo en castellano y en euskera, con
> negocios de Tolosaldea, Donostialdea, Goierri y toda Gipuzkoa: hostelería,
> comercio, peluquería y estética, talleres, clínicas y servicios
> profesionales. Puedes ver ocho webs de ejemplo publicadas y navegables en
> oiwebstudio.com.

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

Pedí indexación de 10 páginas y se agotó la cuota diaria de Google (la cuota
es del sitio, no de la cuenta: lo comprobé probando desde las dos). Quedó una:

`https://oiwebstudio.com/eu/contacto.html`

No corre prisa: está en el sitemap y enlazada desde las demás páginas en
euskera, así que Google llegará igual. Si quieres acelerarlo, pégala en la
barra de Search Console y pulsa «Solicitar indexación».

De paso, el informe de indexación aclara las 3 páginas marcadas como error
«alternativa con etiqueta canónica»: son `http://oiwebstudio.com/`,
`http://oiwebstudio.com/index.html` y `/index.html`. Es el duplicado de http
del punto 3 y la canónica ya apunta bien: no hay nada que arreglar ahí.

---

## 6. Repasar el euskera con un hablante

Las páginas de zona en euskera las traduje yo y luego corregí ocho cosas, una
de ellas de significado. Están correctas, pero conviene que las lea alguien
nativo:

- https://oiwebstudio.com/eu/zonas/donostia-san-sebastian.html
- https://oiwebstudio.com/eu/zonas/irun.html
- https://oiwebstudio.com/eu/zonas/zarautz.html

Los textos están en `scripts/euskera-zonas.mjs`, con el castellano al lado.
