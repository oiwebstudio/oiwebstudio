# Guía para Publicar en GitHub

## 1. Crear repositorio en GitHub

1. Accede a [github.com](https://github.com)
2. Haz clic en "New" para crear un repositorio nuevo
3. Nombre: `oi-studio` o `mi-web-estudio`
4. Descripción: "Web profesional de OI Studio"
5. Puedes hacerlo público (mejor para portafolio)
6. **No** inicializes con README (ya lo tenemos)
7. Clic en "Create repository"

## 2. Subir archivos desde Git

En tu terminal (PowerShell):

```powershell
cd "C:\Users\oieri\Documents\creador de webs - PRUEBA TEMA\mi web"

# Inicializar Git (si no está hecho)
git init

# Añadir todos los archivos
git add .

# Crear commit inicial
git commit -m "feat: web OI Studio inicial"

# Conectar con GitHub (reemplaza TU_USUARIO y TU_REPO)
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git

# Subir a main
git branch -M main
git push -u origin main
```

## 3. Publicar con GitHub Pages

### Opción A: GitHub Pages (RECOMENDADO - gratis)

1. En tu repo de GitHub, ve a **Settings**
2. Baja a **Pages** (en la izquierda)
3. En "Source", selecciona **main** (rama)
4. En carpeta, deja **/root** (es la raíz)
5. Clic en Save
6. Espera 1-2 minutos
7. Tu web estará en: `https://TU_USUARIO.github.io/TU_REPO/`

### Opción B: Dominio personalizado

Si tienes un dominio (ej: `oistudio.com`):

1. Sigue los pasos de GitHub Pages arriba
2. En GitHub Pages, rellena "Custom domain": `oistudio.com`
3. En tu registrador de dominio (GoDaddy, Namecheap, etc.), configura DNS:
   - CNAME → `TU_USUARIO.github.io`
4. Espera 24h para que se propague

## 4. Actualizaciones futuras

Después de cambios locales:

```powershell
# Desde la carpeta "mi web"
git add .
git commit -m "fix: cambio en precios"
git push
```

Los cambios se reflejan en 1-2 minutos.

## 5. Verificaciones antes de subir

Antes de hacer `git push`, verifica:

- [ ] Legal.html: rellenados los campos amarillos (nombre, NIF, dirección)
- [ ] Sitemap.xml: dominio actualizado (si no, dejar placeholder)
- [ ] Robots.txt: dominio y Sitemap correctos
- [ ] Meta tags og:image: URLs absolutas (cuando tengas dominio)
- [ ] Email de contacto: contactoiwebstudio@gmail.com ✓
- [ ] No hay archivos .txt, .bat ni carpetas de desarrollo

## 6. SEO extra

Una vez publicado:

1. **Google Search Console** (console.google.com):
   - Añade tu sitio
   - Sube sitemap.xml
   
2. **Bing Webmaster Tools** (bing.com/webmasters):
   - Verifica tu sitio
   - Sube sitemap.xml

3. **Monitoreo**:
   - Revisa Core Web Vitals en GSC
   - Monitorea errores de rastreo

## 7. Alternativas a GitHub Pages

Si prefieres otro alojamiento:

- **Netlify** (drop & drop, desplegues automáticos)
- **Vercel** (optimizado para static, muy rápido)
- **Hosting tradicional** (GoDaddy, 1&1, Webempresa)

---

**Necesitas ayuda?** Revisa [GitHub Pages Docs](https://docs.github.com/es/pages)
