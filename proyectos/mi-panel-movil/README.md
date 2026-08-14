# Mi panel — versión móvil

Finanzas, hábitos y metas en una sola app. **Sin Excel, sin servidor y sin cuentas**: los
datos viven en una base de datos dentro del propio dispositivo (IndexedDB).

Cinco pestañas abajo, al estilo iOS:

| Pestaña | Qué hace |
|---|---|
| **Inicio** | Mosaico con caja del negocio, tasa de ahorro, gasto fijo, hábitos de hoy y metas |
| **Dinero** | Movimientos de Casa y de Negocio, mes a mes, con su resumen |
| **Hábitos** | Calendario con vistas Día / Mes / Año, racha y días plenos |
| **Metas** | Fondos y objetivos con barra de progreso |
| **Ajustes** | Cuántos datos tienes, copia de seguridad y borrado |

---

## Probarla en el ordenador

```bash
cd "proyectos/mi-panel-movil" && npm start
```

Y abres `http://localhost:4500`. Para verla como se verá en el móvil, abre las
herramientas del navegador (F12) y activa la vista de móvil.

## Instalarla en el móvil sin APK

Es una PWA, así que ya se puede instalar sin empaquetar nada:

1. Sirve la carpeta `www` en tu red local (o súbela a cualquier hosting con HTTPS).
2. Ábrela en el móvil y pulsa *Añadir a pantalla de inicio*.

Queda con su icono, sin barra de navegador y funciona sin conexión. Para la mayoría de
usos esto ya es suficiente.

---

## Convertirla en APK

El proyecto Android **ya está montado** con Capacitor, que mete la web dentro del APK.
No hace falta servidor ni URL pública: los datos van en el dispositivo.

> PWABuilder y Bubblewrap generan un TWA, que es un navegador disfrazado apuntando a una
> URL con HTTPS. Para esta app no vale: dependería de tener la web publicada en internet.

### Cuánto pesa cada cosa

| | Tamaño |
|---|---|
| La app (`www`) | **120 kB** |
| El proyecto Android que se sube a git | **716 kB** |
| El APK que sale | ~4–5 MB |
| Android Studio + SDK, **solo si compilas en tu PC** | 6–8 GB |

Esos GB son herramientas de compilación, no la app. Y hay forma de no instalarlos.

### Opción A — compilar en la nube, sin instalar nada (recomendada)

En `.github/workflows/apk.yml` está el flujo que lo compila en los servidores de GitHub,
que ya traen Java y el SDK puestos.

1. Sube el repositorio a GitHub.
2. Entra en la pestaña **Actions** → *APK — Mi panel* → **Run workflow**.
3. En 3–5 minutos, al final de la ejecución, descargas el `mi-panel-apk`.
4. Pasas el `.apk` al móvil y lo instalas permitiendo *orígenes desconocidos*.

Cada vez que cambies algo dentro de `proyectos/mi-panel-movil` y lo subas, se compila solo.

### Opción B — compilar en tu ordenador

Necesitas **JDK 17 o superior** ([adoptium.net](https://adoptium.net)) y **Android
Studio** ([developer.android.com/studio](https://developer.android.com/studio)). Después:

```bash
cd "proyectos/mi-panel-movil" && npx cap open android
```

Y en Android Studio: **Build → Build Bundle(s)/APK(s) → Build APK(s)**. Sale en
`android/app/build/outputs/apk/debug/app-debug.apk`.

### Cada vez que cambies la app

```bash
npx cap sync android
```

Copia `www` dentro del proyecto Android. Luego vuelves a compilar.

### Para publicarla en Play Store

Hace falta firmarla con un almacén de claves propio (**Build → Generate Signed
Bundle/APK**) y pagar la cuota única de 25 $ de cuenta de desarrollador. Para uso propio
no es necesario: el APK se instala directamente.

---

## Lo que hay que tener claro sobre los datos

**Viven solo en este dispositivo.** No hay servidor ni copia en la nube. Eso significa:

- Funciona sin internet, sin cuentas y nadie más los ve. Esa es la ventaja.
- Si pierdes el móvil, lo formateas o desinstalas la app, **se van con él**.
- Los datos del móvil y los del ordenador son distintos: no se sincronizan.

Por eso Ajustes tiene **Exportar mis datos**: baja un `.json` con todo. Guárdalo donde
quieras (Drive, correo, un USB) y con **Importar una copia** lo recuperas en cualquier
dispositivo. Hazlo de vez en cuando; es la única red de seguridad que hay.

La app pide al sistema que **no borre** su base de datos cuando ande justo de espacio.
En Ajustes puedes ver si lo ha concedido.

## Estructura

```
www/
├─ index.html              las cinco pantallas y las hojas modales
├─ assets/estilos.css      negro OLED, cristal, barra de pestañas
├─ assets/datos.js         IndexedDB: guardar, leer, exportar, importar
├─ assets/app.js           pantallas, cálculos e interacción
├─ manifest.webmanifest    identidad de la app instalable
├─ sw.js                   funciona sin conexión
└─ iconos/                 los mismos que usará el APK
```
