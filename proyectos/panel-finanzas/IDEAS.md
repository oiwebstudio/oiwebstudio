# Ideas — de panel de finanzas a web personal

El panel deja de ser solo el dinero del negocio y pasa a ser **tu sitio**: cuatro
secciones, un solo Excel, un solo localhost.

```
Inicio      →  cómo va todo hoy, de un vistazo
Negocio     →  lo que ya tienes: ingresos, gastos, IVA, clientes
Personal    →  tus gastos e ingresos de casa, tasa de ahorro
Objetivos   →  metas con progreso, ritmo y fecha límite
```

---

## 1 · Inicio

Lo primero que ves al abrirlo. Nada de configurar: responde "¿cómo voy?".

- **Saludo con la fecha** y el mes en curso.
- **Cuatro cifras**: neto del negocio este mes · gasto personal este mes · tasa de ahorro ·
  objetivos en marcha.
- **La barra de la verdad**: lo que entra por el negocio menos lo que sale de casa, en los
  últimos 6 meses. Una sola gráfica que responde si estás ganando terreno o perdiéndolo.
- **Objetivos activos** con su barra de progreso, ordenados por urgencia.
- **Lo que se repite este mes**: suscripciones y gastos fijos, con el total. Es el número
  que más gente subestima.
- **Runway**: con tu ahorro actual y tu gasto medio, cuántos meses aguantas sin ingresos.

## 2 · Negocio

Lo que ya funciona, sin tocar. Ideas para más adelante:

- Facturas pendientes con días de antelación ("Dental Amara lleva 34 días sin pagar").
- Rentabilidad por cliente: facturado menos gastos imputados.
- Comparativa año contra año en la misma gráfica.
- Previsión de cierre de año según el ritmo actual.
- Generar la factura en PDF desde una fila.

## 3 · Personal

Deliberadamente **más simple** que el negocio: aquí no hay IVA, ni deducible, ni estados.
Fecha, concepto, categoría, importe. Punto.

- **Tasa de ahorro** como cifra principal: (ingresos − gastos) / ingresos. Es el número que
  de verdad mueve la aguja, más que el saldo.
- **Gasto fijo vs variable**: lo marcado como recurrente se separa. Saber que 380 €/mes se
  van solos antes de decidir nada cambia cómo ves el resto.
- **Reparto por categoría** en donut, con clic para filtrar.
- **Carrera del mes**: gasto acumulado día a día contra el mismo día del mes pasado. Ver a
  día 12 que vas 90 € por encima es lo que te frena.
- **Media diaria** y **proyección de cierre de mes** al ritmo actual.
- **Cazador de suscripciones**: todo lo recurrente en una lista, con el coste anual al
  lado. 22 €/mes son 264 €/año, y así es como se ve.

## 4 · Objetivos

Tres tipos, porque no todas las metas son dinero:

| Tipo | Ejemplo | Cómo se mide |
|---|---|---|
| **Importe** | Ahorrar 5.000 € para el colchón | € acumulados sobre la meta |
| **Cantidad** | 10 clientes de mantenimiento | unidades sobre la meta |
| **Hito** | Sacarme el certificado | hecho / no hecho |

- **Anillo de progreso** por objetivo, con el porcentaje en el centro.
- **Ritmo necesario**: "te faltan 3.200 € y quedan 214 días → 105 €/semana". Convierte una
  meta abstracta en una decisión de esta semana.
- **Semáforo de ritmo**: verde si vas por delante del calendario, ámbar si justo, rojo si
  ya no llegas al ritmo actual.
- **Sumar progreso en un clic**: botón `+` para añadir al avance sin abrir formularios.
- **Áreas**: Dinero, Negocio, Salud, Aprendizaje, Personal. Para que no sea solo el banco.
- **Archivo de conseguidos**: los cumplidos no se borran, se apartan. Ver la lista de lo
  logrado el año pasado vale más de lo que parece.

---

## Ideas transversales

- **Un solo Excel** con todas las hojas. Sigue siendo la fuente de la verdad y sigues
  pudiendo editarlo a mano.
- **Navegación por pestañas** sin recargar, con la URL sincronizada (`#personal`), para
  poder marcar una sección como favorita.
- **Todo se apunta desde el panel**: alta y borrado en las tres secciones con datos.
- **Atajos de teclado**: `1`–`4` para cambiar de sección, `N` para apuntar.
- **El mismo lenguaje visual** en todo: mismos KPIs, mismos gráficos, mismo tema
  oscuro/claro. Que se note que es un sitio, no cuatro herramientas pegadas.

## Ya construido en la v4

- [x] **Importador de extractos**: CSV o Excel del banco, detección de columnas, categoría
      propuesta a partir del histórico y salto automático de lo ya apuntado.
- [x] **Presupuestos por categoría**: tope mensual, barras con semáforo y hoja propia en
      el Excel.

## Para más adelante

- Reglas de clasificación explícitas ("si pone REPSOL → Transporte"), editables en el Excel.
- Patrimonio neto: cuentas, inversiones y deudas en una línea temporal.
- Diario: una nota por día enlazada a los objetivos.
- Hábitos con racha diaria.
- Exportar el año a PDF.
- Modo lectura para el móvil en la mesilla.

---

## Ya construido en la v3

- [x] Sección **Calendario**: mes completo, capas de negocio/casa/objetivos, detalle del
      día con borrado y alta directa en esa fecha.
- [x] **Objetivos por plazo**: hoy, esta semana, este mes, este año o largo plazo, con la
      fecha límite calculada sola y las tarjetas agrupadas por urgencia.
- [x] **PWA instalable**: manifiesto, service worker, iconos propios y modo offline.
      Es la base para empaquetarla como APK sin reescribir nada.

## Qué se construyó antes

- [x] Sección **Inicio** con resumen, gráfica negocio vs personal, objetivos y recurrentes.
- [x] Sección **Personal** completa: KPIs, cuatro gráficos, tabla, alta y borrado.
- [x] Sección **Objetivos** completa: tarjetas con anillo, ritmo, alta, sumar progreso,
      cambio de estado y borrado.
- [x] Hojas nuevas en el Excel: `Personal`, `Objetivos` y `Resumen personal`, con fórmulas,
      desplegables y formato, sin tocar lo que ya tienes escrito.
- [x] Navegación por pestañas, atajos de teclado y URL sincronizada.
