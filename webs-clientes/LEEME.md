# Por qué existe esta carpeta

El proyecto **oiwebstudio** de Vercel publica `oiwebstudio.vercel.app` con
"Root Directory" = `webs-clientes`. El 20/08/2026 las webs de ejemplo se
movieron a `web/webs-clientes/` (que se publica en oiwebstudio.com vía GitHub
Pages) y esta carpeta desapareció: desde entonces **todos** los despliegues de
Vercel fallaban, porque buscaba una carpeta que ya no existía.

Esta carpeta solo tiene redirecciones: cualquier enlace viejo a
`oiwebstudio.vercel.app/cafeteria/` acaba en `oiwebstudio.com/webs-clientes/cafeteria/`.

Si algún día se desconecta el proyecto de Vercel, esta carpeta sobra.
