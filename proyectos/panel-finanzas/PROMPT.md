# Prompt — Panel de finanzas personal/autónomo (localhost + Excel)

> Este es el prompt de partida del proyecto. Sirve para (a) reconstruirlo desde cero,
> (b) pedir cambios grandes sin explicar el contexto otra vez, (c) que otra IA o
> desarrollador entienda las reglas del juego. Si cambias los requisitos, cambia este
> archivo primero.

---

## Rol

Actúa como desarrollador front-end + analista financiero. Construyes herramientas
internas para un autónomo/estudio pequeño en España. Prioridad: que sea **útil el día 1**,
**gratis**, y que **no requiera mantenimiento** ni servicios de pago.

## Objetivo

Un sistema de dos piezas para controlar ingresos y gastos:

1. **Un Excel** (`Finanzas.xlsx`) donde se apuntan los movimientos. Simple de rellenar,
   visual, y a la vez "pro": tablas con nombre, validaciones, fórmulas, formato
   condicional y un dashboard nativo dentro del propio archivo.
2. **Un panel web** que corre en `http://localhost`, lee ese Excel y lo convierte en
   gráficos y KPIs de nivel profesional.

El Excel es la **fuente de la verdad**, siempre. Se puede escribir desde los dos sitios:
a mano en el Excel, o desde el formulario del panel — que no guarda nada por su cuenta,
sino que **añade la fila al mismo Excel** a través del servidor local. Nunca hay dos
versiones de los datos.

## Restricciones duras

- **Coste 0.** Nada de APIs de pago, cuentas, hosting ni licencias.
- **Sin build.** Ni webpack, ni bundlers, ni framework. HTML + CSS + JS moderno.
- **Offline.** Las librerías van vendorizadas en `vendor/`, no por CDN. El panel debe
  funcionar con el wifi apagado.
- **Sin base de datos.** El servidor local sirve archivos estáticos y expone solo dos
  endpoints de datos: `GET /api/listas`, `POST /api/movimientos` y
  `DELETE /api/movimientos`, que escriben en el propio Excel con ExcelJS. Escucha
  únicamente en `127.0.0.1`.
- **Los datos no salen del ordenador.** Cero telemetría, cero peticiones externas.
- **Windows-friendly.** Se arranca con un `.bat` de doble clic o `npm start`.

## Stack

- Panel: HTML5 + CSS (variables, grid, sin frameworks) + JavaScript ES modules.
- Gráficos: **Chart.js 4** (`vendor/chart.umd.js`).
- Lectura de Excel en navegador: **SheetJS / xlsx** (`vendor/xlsx.full.min.js`).
- Generación del Excel: **ExcelJS** en Node (`scripts/generar-excel.mjs`).
- Servidor local: `npx serve` o un `server.mjs` mínimo de Node.

## Modelo de datos

Hoja `Movimientos`, una fila por movimiento:

| Columna | Tipo | Notas |
|---|---|---|
| `Fecha` | fecha | dd/mm/aaaa. Obligatoria. |
| `Tipo` | lista | `Ingreso` / `Gasto`. Validación desplegable. |
| `Concepto` | texto | Descripción libre. |
| `Categoría` | lista | Desplegable alimentado desde la hoja `Categorías`. |
| `Cliente/Proveedor` | texto | Opcional. |
| `Base` | número € | Importe sin IVA. Es el que manda. |
| `IVA %` | lista | 0 / 4 / 10 / 21. |
| `IVA €` | fórmula | `=Base * IVA%` |
| `Total` | fórmula | `=Base + IVA€` |
| `Método` | lista | Banco / Efectivo / Tarjeta / Bizum. |
| `Estado` | lista | Cobrado / Pendiente / Pagado. |
| `Deducible` | lista | Sí / No. |
| `Notas` | texto | Opcional. |

Reglas de cálculo:
- El **neto** = ingresos base − gastos base (sin IVA; el IVA no es ingreso).
- **Trimestre** e **IVA a liquidar** = IVA repercutido (ingresos) − IVA soportado
  (gastos deducibles), agrupado por T1–T4.
- Un movimiento `Pendiente` **cuenta** en facturación pero se marca aparte en el KPI de
  cobros pendientes.

## Lo que debe tener el Excel

- Hoja `Movimientos` con cabecera fija, filtros automáticos, filas alternas y fórmulas
  preparadas hasta la fila 1000 (añadir filas nunca rompe nada).
- Hoja `Categorías` editable (añadir una categoría debe aparecer sola en el desplegable).
- Hoja `Resumen`: matriz mes × concepto con `SUMIFS`, no valores pegados. Ingresos,
  gastos, neto y acumulado.
- Hoja `Dashboard`: KPIs grandes arriba y bloques de reparto (gasto por categoría,
  ingreso por categoría, neto mes a mes, top clientes) visualizados con **barras de
  datos**, no con gráficos nativos: se ven igual en Excel, LibreOffice y Sheets, y no se
  rompen al insertar filas. Los gráficos de verdad viven en el panel web.
- Hoja `IVA`: los cuatro trimestres con repercutido, soportado y resultado.
- Formato: euros con `#.##0,00 €`, negativos en rojo, formato condicional (barras de
  datos en gastos, semáforo en el neto), paneles inmovilizados, anchos de columna
  cuidados, sin líneas de cuadrícula en Dashboard.
- Debe abrirse igual de bien en Excel, LibreOffice y Google Sheets.

## Lo que debe tener el panel

Filtros globales que afectan a todo: rango de fechas, año, trimestre, categoría, tipo.

Fila de KPIs: ingresos, gastos, neto, margen %, pendiente de cobro, IVA del trimestre.
Cada KPI con su variación respecto al periodo anterior.

Gráficos:
1. Barras agrupadas — ingresos vs gastos por mes.
2. Línea/área — neto acumulado del año.
3. Donut o barras horizontales — reparto de gasto por categoría.
4. Barras horizontales — top 10 gastos o top clientes por facturación.
5. Barras — IVA por trimestre.

Tabla de movimientos: ordenable por columna, buscador, paginada, con **borrado** por fila
(botón que aparece al pasar el ratón, confirmación con concepto e importe, y compactado
de las filas de debajo para no dejar huecos en el Excel).

Interacción: al hacer clic en una categoría del gráfico, se filtra todo el panel.

Carga de datos: arrastrar el `.xlsx` sobre el panel **o** que lo lea solo desde
`./datos/Finanzas.xlsx`.

Alta de movimientos desde el panel: botón `+ Movimiento` (atajo `N`) que abre un diálogo
con conmutador Gasto/Ingreso, concepto, importe sin IVA, IVA, fecha, categoría (sugerida
según el tipo), cliente/proveedor, método, estado, deducible, notas y **repetición
mensual** para suscripciones. Antes de guardar muestra el total con IVA y, si se repite,
el total del periodo. Al guardar hace `POST`, recarga el Excel y refresca todo. Si el
archivo está abierto en Excel, lo dice con esas palabras. Cada escritura deja una copia
en `datos/Finanzas.respaldo.xlsx`.

## Dirección de diseño

Nada de "plantilla de admin genérica". Debe parecer una herramienta interna cara.

- Modo oscuro por defecto, con conmutador a claro. Ambos igual de cuidados.
- Paleta sobria: fondo casi negro, superficies elevadas apenas más claras, **un** color
  de acento. Verde para positivo, rojo/coral para negativo, y nada más de color.
- Tipografía: una sans geométrica para texto; **cifras siempre tabulares**
  (`font-variant-numeric: tabular-nums`) para que las columnas cuadren.
- Números grandes y respirados; etiquetas pequeñas, en mayúsculas discretas y atenuadas.
- Densidad tipo terminal financiera: mucha información, cero adorno.
- Sin sombras exageradas, sin gradientes decorativos, sin emojis en la interfaz.
- Todo importe formateado en `es-ES` con símbolo €.
- Responsive: usable en móvil, pensado para pantalla ancha.
- Accesible: contraste AA, foco visible, navegable con teclado.

## Estructura de archivos

```
panel-finanzas/
├─ PROMPT.md              ← este archivo
├─ README.md              ← cómo se usa
├─ index.html             ← el panel
├─ assets/
│  ├─ estilos.css
│  └─ panel.js
├─ vendor/                ← librerías locales (offline)
├─ datos/
│  └─ Finanzas.xlsx       ← el Excel, fuente de la verdad
├─ scripts/
│  └─ generar-excel.mjs   ← regenera el Excel vacío
├─ server.mjs             ← servidor estático local
└─ abrir-panel.bat        ← doble clic: arranca y abre el navegador
```

## Criterios de aceptación

- [ ] `npm start` levanta el panel en localhost y se abre en el navegador.
- [ ] El panel carga el Excel de ejemplo sin tocar nada y muestra datos reales.
- [ ] Cambiar una cifra en el Excel y recargar cambia todos los KPIs y gráficos.
- [ ] Con el wifi apagado funciona igual.
- [ ] El Excel se abre sin avisos de reparación en Excel y en LibreOffice.
- [ ] Añadir una fila al Excel no rompe fórmulas ni desplegables.
- [ ] Cero errores en la consola del navegador.
- [ ] Los totales del panel cuadran al céntimo con los del Excel.
```
