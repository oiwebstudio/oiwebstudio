# Que ChatGPT, Gemini y compañía recomienden OI Studio

Estado a 1/10/2026. Cuando alguien pregunta a una IA «¿qué diseñador web me
recomiendas en Tolosa?», la IA hace dos cosas:

1. **Busca en internet en ese momento.** ChatGPT y Copilot usan el índice de
   **Bing**; Gemini y los resúmenes de Google usan **Google**; Perplexity y
   Claude tienen buscador propio. Si no estás bien indexado ahí, no existes.
2. **Mira lo que dicen otros de ti.** Las IAs no se fían de lo que una web
   dice de sí misma: recomiendan a quien sale en **directorios, listas tipo
   «Top 10», reseñas y enlaces de otros sitios**. Hoy oiwebstudio.com tiene
   un solo enlace externo, el de la web de Errotatxo.

La parte 1 ya está trabajada desde el código (ver abajo). **La parte 2 es la
que decide, y necesita tus cuentas.** Lista por orden de impacto:

---

## 1. Desbloquear a los bots de IA en Cloudflare (2 minutos) ⚠️

Comprobado el 1/10: **GPTBot (OpenAI) y ClaudeBot (Anthropic) reciben un
error 403** al entrar en tu web. No es tu web: es una opción de Cloudflare que
bloquea los bots de IA. Mientras siga así, ChatGPT y Claude no aprenden nada
de ti cuando actualizan lo que saben.

dash.cloudflare.com → oiwebstudio.com → **Seguridad → Bots** (o **AI Crawl
Control**, según la versión del panel) → desactiva **«Block AI bots»** o pon
GPTBot y ClaudeBot en **Permitir**. Si ves «Managed robots.txt», déjalo
desactivado: tu robots.txt ya invita a todos los bots de IA.

De paso, la casilla pendiente de siempre: **SSL/TLS → Edge Certificates →
Always Use HTTPS → activar** (http://oiwebstudio.com sigue respondiendo sin
redirigir).

Avísame cuando lo hagas y compruebo que entran.

## 2. Bing Webmaster Tools (5 minutos)

ChatGPT busca en Bing. Ya avisé a Bing de tus 53 páginas con IndexNow, pero
con la cuenta verás si las tiene y podrás enviar el sitemap.

bing.com/webmasters → entra con tu cuenta de Google → **Importar desde Google
Search Console** → elige oiwebstudio.com. Se verifica solo.

## 3. Verificar la ficha de Google Business (sigue siendo lo n.º 1 en Google)

Ver `docs/SEO-LO-QUE-FALTA.md`, punto 1. Gemini y los resúmenes de Google
sacan las recomendaciones locales del mapa, y sin ficha verificada no estás
en el mapa. Cuando esté verificada:

- **Bing Places** (bingplaces.com) → «Importar desde Google Business».
  ChatGPT y Copilot usan estos datos para negocios locales.
- **Apple Business Connect** (businessconnect.apple.com) → lo que usa Siri.

## 4. Directorios que las IAs leen y citan

Cuando se busca «diseñador web Tolosa», sale **trustlocal.es** con su lista
«Top 10 de diseñadores web en Tolosa» (22 agencias), y tú no estás. Ese tipo
de lista es justo lo que una IA resume cuando le piden una recomendación.

Todos son gratis. Por orden:

| Directorio | Por qué |
|---|---|
| **trustlocal.es** | Sale arriba en «diseño web Tolosa» y «Donostia». Listas que las IAs citan |
| **sortlist.es** | Directorio de agencias que suele salir cuando se pregunta por «agencias de diseño web en [ciudad]» |
| **clutch.co** | Directorio internacional de agencias, muy leído por buscadores e IAs |
| **proveedores.com** | Sale en «empresas de diseño web Guipúzcoa» |
| **paginasamarillas.es** | Clásico, Google y Bing lo leen |
| **prontopro.es** | Sale en «diseño web Tolosa» |
| **LinkedIn** (página de empresa) | Las IAs lo usan para confirmar que una empresa existe |

**Copia siempre estos datos exactos, carácter por carácter.** Google y las
IAs cruzan los datos entre sitios:

```
OI Studio
Diseño web en Tolosa (Gipuzkoa)
Tolosa, Gipuzkoa
+34 680 95 67 55
contactoiwebstudio@gmail.com
https://oiwebstudio.com
```

**Descripción corta** (cabe en casi todos, 160 caracteres):

> Estudio de diseño web en Tolosa (Gipuzkoa). Webs y tiendas online para
> negocios locales, en castellano y euskera. Precio cerrado desde 199 €.

**Descripción larga:**

> OI Studio es un estudio de diseño y desarrollo web con base en Tolosa
> (Gipuzkoa). Hago páginas web y tiendas online a medida para negocios
> locales de Tolosaldea y toda Gipuzkoa: hostelería, comercio, peluquerías,
> talleres, clínicas y servicios profesionales. Precio cerrado y por escrito
> (landing 199 €, web de negocio 299 €, tienda online 790 €, más IVA),
> propuesta en 48 horas y webs en castellano y euskera. Es un estudio de una
> persona: hablas siempre con quien diseña y programa tu web. Trabajos y caso
> real en oiwebstudio.com.

**En euskera** (conviene que lo lea un euskaldun antes de publicarlo):

> OI Studio web diseinu eta garapen estudioa da, Tolosan (Gipuzkoa).
> Neurrira egindako webguneak eta online dendak egiten ditut Tolosaldeko eta
> Gipuzkoa osoko tokiko negozioentzat, gaztelaniaz eta euskaraz. Prezio
> itxia eta idatzita, 199 €-tik aurrera, eta proposamena 48 ordutan.

**Categorías** cuando las pidan: Diseño web · Desarrollo web · Tiendas
online · SEO local · Diseño gráfico.

## 5. Reseñas

Lo que más pesa en el mapa de Google y en las IAs. En cuanto la ficha esté
verificada, pídele una a **Errotatxo** (es tu cliente real) y a cada cliente
que entregues. El texto para pedirla está en `docs/SEO-LO-QUE-FALTA.md`,
punto 2. Si te das de alta en Trustlocal, pide también allí.

## 6. Enlaces desde las webs de tus clientes

La web de Errotatxo ya enlaza a oiwebstudio.com en el pie, con el texto
«OI Studio». Para cada web que entregues:

- Pie de página con «Diseño web: **OI Studio**, Tolosa» enlazando a
  https://oiwebstudio.com (con permiso del cliente).
- Mejor aún si el texto del enlace dice lo que haces: «diseño web en Tolosa».

## 7. Prensa local y asociaciones

Una mención en un medio local vale mucho para las IAs. Ideas que no cuestan
dinero:

- **Tolosaldeko Ataria** o **Noticias de Gipuzkoa**: la historia de Errotatxo
  (panadería de 1996 que estrena web bilingüe con horario en directo) es una
  noticia local pequeña pero real. Pídele permiso a Errotatxo antes.
- La asociación de comerciantes de Tolosa y Tolosaldea Garatzen suelen tener
  directorios o boletines para socios y proveedores locales.

---

## Lo que ya está hecho desde la web (1/10/2026)

- **llms.txt** en https://oiwebstudio.com/llms.txt: ficha en texto plano de
  quién eres, dónde, precios, zonas y páginas clave, pensada para las IAs.
- **robots.txt** con permiso explícito para GPTBot, ClaudeBot, PerplexityBot,
  Google-Extended, Applebot y el resto (falta el desbloqueo de Cloudflare,
  punto 1).
- **Ficha de entidad** (schema) en la portada: nombre, nombres alternativos,
  aclaración de que no eres ninguna de las otras empresas llamadas «OI
  Studio», contacto en castellano y euskera, zonas, precios de los cuatro
  planes y lema.
- **Guía «Cómo elegir diseñador web en Gipuzkoa»**: responde a la pregunta
  que la gente le hace a la IA, y explica con datos qué ofrece OI Studio.
- **Caso real de Errotatxo**: lo único que las IAs pueden comprobar como
  trabajo real tuyo.
- **IndexNow**: Bing (y Yandex) avisados de todas las páginas.
- **Imágenes para compartir** propias en las páginas principales.

## Cómo comprobar si funciona

Dentro de 3-4 semanas, pregunta en ChatGPT (con búsqueda activada), Gemini y
Perplexity:

- «¿Qué diseñador web me recomiendas en Tolosa?»
- «Diseño web para un negocio en Gipuzkoa, precio cerrado»
- «Web en euskera y castellano para mi negocio en Tolosaldea»

Apunta si sales y en qué posición. No lo hagas a diario: los resultados de
las IAs varían de una pregunta a otra.
