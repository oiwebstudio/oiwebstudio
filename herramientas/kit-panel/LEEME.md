# Kit del panel del cliente

Un panel pequeño, desde el móvil, para que el negocio cambie **solo lo que cambia
a menudo**: el aviso ("cerrado por vacaciones…"), el precio del menú y el menú de
cada día. El diseño no se toca: lo demás se cambia por WhatsApp dentro del
mantenimiento.

| Archivo | Qué es |
|---|---|
| `panel.html` | La página del panel (plantilla). Móvil primero, sin dependencias |
| `aplicar-panel.mjs` | Conecta el panel a una web de `generar-demo.mjs` y escribe `panel/index.html` |
| `functions/api/datos.js` | La API en Cloudflare Pages Functions: lee y guarda en KV, con PIN |

## Dos modos

- **prueba** — para las demos en oiwebstudio.com. Guarda en el navegador
  (`localStorage`): el cliente lo prueba en su móvil y ve el cambio en la demo,
  pero nadie más. El panel lo dice bien claro.
- **real** — para la web entregada. Se entra con PIN, se guarda en Cloudflare KV
  y el cambio lo ve todo el mundo en ~30 segundos.

```bash
# Demo (ya lo hace herramientas/demos/demo-har-ta-jan.mjs al final)
node herramientas/kit-panel/aplicar-panel.mjs web/demos/clientes/har-ta-jan --slug har-ta-jan --modo prueba

# Web entregada
node herramientas/kit-panel/aplicar-panel.mjs clientes/har-ta-jan --slug har-ta-jan --modo real
cp -r herramientas/kit-panel/functions clientes/har-ta-jan/
```

Se puede repetir las veces que haga falta: todo lo que añade va entre marcas
`panel-cliente` y se reemplaza, no se duplica.

## Poner en marcha la versión real (una vez por cliente, ~10 min)

1. Cloudflare → *Workers & Pages* → *KV* → crear un namespace `panel-<slug>`.
2. Publicar la web con las funciones:
   ```bash
   npx wrangler pages deploy clientes/<slug> --project-name <slug>
   ```
3. En el proyecto de Pages → *Settings*:
   - *Bindings* → KV namespace → nombre de variable **`PANEL`** → el namespace del paso 1
   - *Variables and secrets* → secreto **`PANEL_PIN`** → un PIN de 6 cifras
4. Volver a publicar (paso 2) para que coja la configuración.
5. Al cliente: `https://su-dominio.com/panel/` y el PIN. Que lo guarde en la pantalla
   de inicio del móvil.

## Probarlo en local

```bash
cd <carpeta con index.html, panel/ y functions/>
npx wrangler@4 pages dev . --kv PANEL --binding PANEL_PIN=123456 --port 8791
```

En Windows, la carpeta tiene que tener una **ruta corta** (p. ej. `C:\Users\oieri\pp`):
con las rutas largas del scratchpad wrangler falla con "internal error".
Al terminar, cerrar también los procesos `workerd` que quedan abiertos.

## Seguridad

- Solo se guardan `aviso`, `menuPrecio`, `menuIncluye` y `menuDia`; todo lo demás se ignora.
- A todo el texto se le quitan `<` y `>`, se recorta a 300 caracteres y como mucho 15 platos por lista.
- 5 PIN fallidos desde la misma IP → bloqueado 15 minutos.
- El aviso se pinta con `textContent`, nunca como HTML.

## Coste

Cloudflare gratis: 100.000 lecturas y 1.000 escrituras de KV al día. Un negocio
local no se acerca ni de lejos.
