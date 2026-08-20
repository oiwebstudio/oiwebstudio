# Mi panel

Tu sitio personal en `localhost`. Empieza en **`inicio.html`**: un mosaico donde cada
baldosa resume algo y te lleva a su sección.

| Pantalla | Qué es |
|---|---|
| **`inicio.html`** | Portada tipo bento. Resumen vivo + hábitos de hoy marcables ahí mismo |
| **`index.html`** | El panel completo: finanzas, calendario y objetivos |
| **`habitos.html`** | Calendario de hábitos con vistas Día / Mes / Año |
| **`dashboard.html`** | Resumen en lenguaje iOS de los cuatro módulos |
| **`resumen.html`** | Versión suelta, funciona sin servidor (datos aparte) |

Todas comparten barra de navegación, así que puedes saltar de una a otra.

Dentro del panel completo hay cuatro secciones, y un solo Excel detrás de todo:

| Sección | Para qué |
|---|---|
| **Inicio** | Cómo va todo hoy, sin tocar un filtro |
| **Negocio** | Lo que factura y gasta el estudio: IVA, clientes, trimestres |
| **Personal** | El dinero de casa: tasa de ahorro, gastos fijos, en qué se va |
| **Calendario** | El mes entero: qué entra, qué sale y qué objetivos vencen |
| **Objetivos** | Metas de hoy, de la semana, del mes o del año, con su ritmo |

Dos piezas:

- **`datos/Finanzas.xlsx`** — donde viven los datos. Es la fuente de la verdad.
- **El panel en `localhost`** — lo lee y lo convierte en cuadro de mando.

Atajos: **1**–**5** cambian de sección, **N** abre el formulario de apuntar.

## Instalarla como aplicación

Es una **PWA**: se instala y funciona sin conexión.

- **En el ordenador:** con el panel abierto sale el botón **Instalar** arriba a la derecha
  (o el icono de instalar en la barra de direcciones de Chrome/Edge).
- **En el móvil:** el servidor solo escucha en `127.0.0.1`, así que para verlo desde el
  móvil hace falta exponerlo en tu red. Con eso hecho, *Añadir a pantalla de inicio*.

Una vez instalada tiene su propio icono, arranca sin barra de navegador y guarda el
armazón en caché, así que abre al instante aunque no haya red. Los datos siguen siendo el
Excel de tu ordenador.

> **Sobre el APK:** al ser PWA, el día que la quieras en el móvil como aplicación de verdad
> el camino ya está hecho — se empaqueta con Bubblewrap o PWABuilder (TWA) y sale un `.apk`
> sin reescribir nada. Eso sí, necesitará que el panel esté servido en una URL con HTTPS
> accesible desde el móvil, no en `localhost`. Los iconos ya están generados en `iconos/`.

Puedes apuntar movimientos **desde los dos sitios**: escribiéndolos en el Excel, o con el
botón `+ Movimiento` del panel. El panel no guarda nada aparte — añade la fila al mismo
Excel. Así no hay dos versiones de los datos.

> **Importante:** para guardar desde el panel, el Excel no puede estar abierto en Excel.
> Si lo está, el panel te avisa. Ciérralo y vuelve a darle a Guardar.

---

## Arrancar

Doble clic en **`abrir-panel.bat`** — genera el Excel si no existe, levanta el servidor y
abre el navegador.

O desde la terminal:

```bash
cd "panel-finanzas" && npm start
```

Luego abre `http://localhost:4400`.

## Generar el Excel

```bash
npm run excel
```

Si ya existe `datos/Finanzas.xlsx` **no lo toca** (para no perder tus datos). Para
regenerarlo de cero:

```bash
npm run excel -- --force
```

Otras opciones: `-- --vacio` (sin movimientos de ejemplo), `-- --anio=2027`.

---

## Cómo se usa el Excel

Hoja **`Movimientos`** — una fila por movimiento. Solo rellenas las columnas blancas:

| Rellenas | Se calcula solo |
|---|---|
| Fecha, Tipo, Concepto, Categoría, Cliente/Proveedor, Base, IVA %, Método, Estado, Deducible, Notas | IVA €, Total, Mes, Trimestre |

- **Base** es el importe **sin IVA**. Es lo que cuenta como ingreso o gasto real.
- Tipo, Categoría, IVA %, Método, Estado y Deducible son **desplegables**.
- Para añadir una categoría nueva, escríbela al final de la columna correspondiente en la
  hoja `Categorias`: aparece sola en el desplegable.
- Las fórmulas están preparadas hasta la fila 1000. Añadir filas no rompe nada.

Hoja **`Personal`** — más simple a propósito: fecha, tipo, concepto, categoría, importe,
método, recurrente y notas. Sin IVA, sin deducible, sin estados. Marca **Recurrente = Sí**
en lo que se repite cada mes (alquiler, suscripciones): es lo que alimenta el "gasto fijo"
y el coste anual.

Hoja **`Objetivos`** — un objetivo por fila. Tres tipos:

| Tipo | Meta | Ejemplo |
|---|---|---|
| **Importe** | en € | Ahorrar 5.000 € de colchón |
| **Cantidad** | en unidades | 10 clientes de mantenimiento |
| **Hito** | meta 1 | Sacarme el certificado |

Hojas de solo lectura: **`Resumen`** (mes a mes del negocio), **`Dashboard`** (KPIs y
repartos), **`IVA`** (los cuatro trimestres) y **`Resumen personal`** (ahorro mes a mes y
en qué se va). No escribas en ellas.

> Las cifras del Excel usan barras de datos como gráfico, no gráficos nativos: se ven
> igual en Excel, LibreOffice y Google Sheets, y no se rompen al añadir filas. Los
> gráficos de verdad están en el panel web.

## Apuntar desde el panel

Botón **`+ Apuntar`** arriba a la derecha, o la tecla **`N`**. Lo que abre depende de dónde
estés: en Objetivos crea un objetivo, en el resto un movimiento.

- Conmutador **Negocio / Casa**: elige en qué hoja se escribe. En Casa desaparecen IVA,
  cliente, estado y deducible, y aparece "¿Se repite?".
- Conmutador **Gasto / Ingreso**: cambia las categorías sugeridas y los valores por defecto.
- **Importe sin IVA**: pon lo que te cuesta antes de IVA. Si lo que pagas ya lleva IVA
  incluido y no te lo deduces, pon el total y deja el IVA en 0 %.
- **Repetir**: para suscripciones. Elige 3, 6 o 12 meses y crea una fila por mes, el mismo
  día de cada uno (si el mes es más corto, cae al último día).
- Antes de guardar te enseña el total con IVA y, si repites, el total del periodo.
- Al guardar, la fila entra en el Excel y el panel se refresca solo.

## Importar el extracto del banco

Botón **Importar** arriba. Arrastra el CSV o el Excel **tal cual te lo da el banco**.

1. Se salta las líneas de cabecera del banco y encuentra la fila de columnas.
2. Adivina cuál es la fecha, el concepto y el importe. Si falla, lo corriges con los
   desplegables.
3. El signo del importe decide si es ingreso o gasto.
4. **Propone la categoría** mirando lo que apuntaste antes: si "COMPRA MERCADONA" fue
   Alimentación una vez, lo será siempre.
5. Revisas la lista, desmarcas lo que no quieras, y ya se escribe.

Los movimientos que ya tengas apuntados **se saltan solos**: se comparan fecha, importe y
concepto, así que puedes reimportar el mismo extracto sin miedo a duplicar.

> Ojo con las fechas: un CSV español pone `05/08/2026` para el 5 de agosto. El importador
> lo lee así, no al estilo americano.

## Presupuestos

En **Personal**, botón `Editar topes`: pones un máximo mensual a cada categoría (deja en
blanco lo que no quieras limitar). El panel enseña una barra por categoría con lo
consumido — verde hasta el 80 %, ámbar hasta el 100 %, rojo pasado el tope — y lo que te
queda. Siempre contra el mes que tengas elegido en el filtro.

Los topes viven en la hoja **`Presupuestos`** del Excel, que además calcula el consumido
del mes en curso con sus propias fórmulas.

## Hábitos

Cuatro hábitos diarios: gimnasio, lectura, proyecto y deporte. Se marcan desde **dos
sitios**, y los dos escriben en la misma hoja `Habitos` del Excel:

- **`inicio.html`** — los cuatro botones de la baldosa naranja, para el día de hoy.
- **`habitos.html`** — el calendario completo, con cualquier día y vistas Día / Mes / Año.

En el calendario, cada día muestra un punto verde por hábito cumplido, hoy va en círculo
rosa y el día elegido con contorno azul. El panel lateral lleva racha, % del mes y días
plenos. Las flechas del teclado mueven el día seleccionado.

La hoja `Habitos` del Excel es de formato ancho — una fila por día, una columna por
hábito con `Sí` — así que también puedes marcarlos a mano desde Excel.

> `habitos.html` abierto **suelto** (sin servidor) sigue funcionando, pero entonces guarda
> en el navegador en vez de en el Excel. Te lo dice en la esquina de la barra.

## Calendario

El mes entero en una rejilla. Cada día enseña su saldo y hasta tres cosas; si hay más, un
"+N más".

- **Capas**: enciende y apaga Negocio, Casa y Objetivos para ver solo lo que te interesa.
- **Clic en un día** abre el detalle a la derecha: todo lo de ese día, con su ✕ para
  borrar y un botón para **apuntar directamente en esa fecha**.
- El punto azul en la esquina de un día marca que ahí **vence un objetivo**.

## Objetivos

Cada objetivo vive en un **plazo**: hoy, esta semana, este mes, este año o largo plazo. La
fecha límite se calcula sola según el plazo — solo la de largo plazo se pone a mano. Las
pastillas de arriba filtran, y las tarjetas se agrupan de lo más inmediato a lo más lejano.

Cada tarjeta enseña un anillo de progreso, cuánto llevas de cuánto y **el ritmo que
necesitas**: "82,35 €/semana durante 323 días · por delante". El semáforo compara tu avance
real con el que tocaría a estas alturas del calendario. Por debajo de una semana el ritmo
se da por día, y los hitos no llevan ritmo: están hechos o no lo están.

- **`+ Progreso`** suma al avance sin abrir formularios.
- Al llegar a la meta se marca **Conseguido** solo. Puedes reabrirlo.
- Los conseguidos no se borran: se apartan al filtro `Conseguidos`.

## Borrar un movimiento

Pasa el ratón por encima de la fila en la tabla y pulsa la **✕** de la derecha. Te pide
confirmación con el concepto y el importe antes de tocar nada.

Al borrar, las filas de debajo suben para que no queden huecos en el Excel. Las fórmulas,
los desplegables y los formatos se quedan como están.

Antes de cada alta o borrado deja una copia en `datos/Finanzas.respaldo.xlsx`. Es **la
copia anterior a la última operación**, no un histórico: si borras dos cosas seguidas,
solo puedes recuperar la penúltima situación.

## Cómo se usa el panel

- Al abrirlo carga `datos/Finanzas.xlsx` automáticamente.
- También puedes **arrastrar cualquier `.xlsx`** encima, o usar el botón `Excel…`.
- Filtros arriba: año, trimestre, tipo, categoría, estado y buscador. Afectan a todo.
- Los KPIs comparan con el **periodo anterior** (trimestre anterior, o año anterior si no
  hay trimestre seleccionado).
- **Clic en una barra** de "Gasto por categoría" filtra el panel entero por esa categoría.
- Botón `Tema` para claro/oscuro. Se recuerda.
- Después de tocar el Excel, **recarga la página** (F5) para ver los cambios.

## Detalles de cálculo

- Ingresos, gastos y neto van **sin IVA** (base imponible). El IVA no es ingreso tuyo.
- **IVA a liquidar** = IVA repercutido (ingresos) − IVA soportado (gastos marcados como
  deducibles). Es una estimación orientativa: confírmala con tu gestoría.
- **Pendiente de cobro** suma el total (con IVA) de los ingresos en estado `Pendiente`,
  pero esos ingresos **sí** cuentan como facturación.

## Qué hay en cada archivo

```
PROMPT.md                    especificación del proyecto
IDEAS.md                     el mapa: qué hay y qué queda por hacer
index.html                   las cuatro secciones y los diálogos
assets/estilos.css           tema oscuro/claro, tipografía tabular
assets/comun.js              formato, lectura del Excel, estado y gráficos compartidos
assets/app.js                navegación, tema y formularios de alta
assets/inicio.js             resumen de la portada
assets/negocio.js            sección Negocio
assets/personal.js           sección Personal
assets/calendario.js         sección Calendario
assets/objetivos.js          sección Objetivos
assets/importar.js           importador de extractos bancarios
manifest.webmanifest         identidad de la app instalable
sw.js                        service worker: funciona sin conexión
iconos/                      iconos PNG (los mismos que usará el APK)
scripts/generar-iconos.mjs   los dibuja y codifica sin dependencias
vendor/                      Chart.js y SheetJS en local — funciona sin internet
scripts/generar-excel.mjs    crea datos/Finanzas.xlsx de cero
scripts/hojas-vida.mjs       hojas Personal, Objetivos y Resumen personal
scripts/actualizar-excel.mjs añade hojas nuevas a un Excel que ya tiene datos
scripts/movimientos.mjs      escritura: movimientos y objetivos
scripts/estilo-excel.mjs     estilo compartido de las hojas
server.mjs                   estáticos + API, solo escucha en 127.0.0.1
datos/Finanzas.xlsx          tus datos (fuera de git)
```

## Si actualizo el proyecto

```bash
npm run actualizar
```

Añade al Excel las hojas y columnas que le falten **sin tocar** tus datos. Deja una copia
en `datos/Finanzas.antes-de-actualizar.xlsx`.

Con el servidor en marcha el panel siempre carga la versión actual: el service worker
pide primero a la red y solo tira de su caché si no hay conexión.

## Notas

- Sin cuentas, sin servicios de pago, sin peticiones a internet. Los datos no salen del
  ordenador.
- `datos/*.xlsx` está en `.gitignore`: tus cifras no se suben al repositorio.
- Puerto: 4400. Cámbialo con `PORT=5000 npm start` si te hace falta.
