# Checklist de SEO - Perfumes Zacatecas

## ✅ Implementaciones Completadas

### Meta Tags y Configuración Básica
- [x] Meta description optimizada (155-160 caracteres)
- [x] Meta keywords relevantes
- [x] Título SEO optimizado
- [x] Meta robots configurado
- [x] Canonical URL establecida
- [x] Lang attribute en HTML (es-MX)
- [x] Viewport meta tag para mobile

### Open Graph y Redes Sociales
- [x] Open Graph tags para Facebook
- [x] Twitter Card configurado
- [x] Imágenes OG optimizadas (1200x630px)
- [x] Meta tags de geolocalización

### Structured Data (Schema.org)
- [x] Schema.org Store (LocalBusiness)
- [x] Schema.org WebSite
- [x] Schema.org ItemList (Productos)
- [x] Schema.org Product (8 productos)
- [x] Schema.org BreadcrumbList
- [x] Atributos itemscope/itemtype en HTML

### Archivos para Indexación
- [x] robots.txt creado y configurado
- [x] sitemap.xml creado
- [x] Sitemap referenciado en robots.txt

### Optimización de Contenido
- [x] Headings jerárquicos (H1, H2, H3)
- [x] Atributos alt en imágenes
- [x] Textos descriptivos en secciones
- [x] Enlaces con aria-label donde corresponde

### Seguridad y Rendimiento
- [x] rel="noopener noreferrer" en enlaces externos
- [x] Preconnect para Google Fonts
- [x] Lazy loading en imágenes

---

## 📋 Próximos Pasos Recomendados

### 1. Configuración del Dominio
- [ ] Registrar dominio: `www.perfumeszacatecas.com` (o el que elijas)
- [ ] Configurar certificado SSL (HTTPS obligatorio)
- [ ] Subir archivos al hosting

### 2. Google Search Console
- [ ] Crear cuenta en [Google Search Console](https://search.google.com/search-console)
- [ ] Verificar propiedad del sitio
- [ ] Enviar sitemap.xml
- [ ] Solicitar indexación de páginas principales

### 3. Google My Business
- [ ] Crear perfil en Google My Business
- [ ] Agregar dirección, horarios, teléfono
- [ ] Subir fotos de productos y ubicación
- [ ] Solicitar reseñas de clientes

### 4. Optimización de Imágenes
- [ ] Optimizar imágenes (WebP format recomendado)
- [ ] Reducir tamaño de archivos (< 200KB por imagen)
- [ ] Agregar width/height attributes para CLS
- [ ] Crear imágenes para Open Graph (1200x630px)

### 5. Contenido Adicional
- [ ] Crear página "Acerca de Nosotros"
- [ ] Crear página de "Política de Privacidad"
- [ ] Crear página de "Términos y Condiciones"
- [ ] Agregar blog con artículos sobre perfumes

### 6. Analytics y Tracking
- [ ] Instalar Google Analytics 4
- [ ] Configurar eventos de conversión (compras, clicks WhatsApp)
- [ ] Instalar Facebook Pixel (opcional)
- [ ] Configurar Google Tag Manager (opcional)

### 7. Rendimiento
- [ ] Optimizar CSS (minificar)
- [ ] Optimizar JavaScript (minificar)
- [ ] Habilitar compresión Gzip en servidor
- [ ] Configurar caché del navegador
- [ ] Probar en PageSpeed Insights

### 8. Backlinks y SEO Off-Page
- [ ] Registrar en directorios locales de Zacatecas
- [ ] Crear perfiles en redes sociales (Instagram, Facebook)
- [ ] Intercambiar enlaces con negocios relacionados
- [ ] Participar en foros y comunidades locales

### 9. Local SEO
- [ ] Agregar dirección completa en footer
- [ ] Crear mapa de Google Maps embed
- [ ] Obtener reseñas de clientes en Google
- [ ] Usar palabras clave locales ("perfumes en Zacatecas")

### 10. Mantenimiento Continuo
- [ ] Actualizar sitemap.xml mensualmente
- [ ] Revisar Google Search Console semanalmente
- [ ] Responder reseñas y comentarios
- [ ] Actualizar contenido regularmente
- [ ] Monitorear rankings de palabras clave

---

## 🔧 Configuración Técnica Requerida

### robots.txt
Ya creado en: `/robots.txt`
- Asegúrate de que sea accesible en: `https://www.tudominio.com/robots.txt`

### sitemap.xml
Ya creado en: `/sitemap.xml`
- Actualiza las URLs cuando tengas tu dominio final
- Asegúrate de que sea accesible en: `https://www.tudominio.com/sitemap.xml`
- Envíalo a Google Search Console

### .htaccess (para Apache) - Recomendado
Crea un archivo `.htaccess` en la raíz con:

```apache
# Habilitar compresión Gzip
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Caché del navegador
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Redirigir a HTTPS (descomentar cuando tengas SSL)
# RewriteEngine On
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Redirigir www a no-www (o viceversa, elige uno)
# RewriteEngine On
# RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
# RewriteRule ^(.*)$ https://%1/$1 [R=301,L]
```

---

## 📊 Palabras Clave Principales

**Palabras Clave Primarias:**
- perfumes zacatecas
- decants zacatecas
- perfumes premium zacatecas
- fragancias zacatecas

**Palabras Clave Secundarias:**
- perfumes importados zacatecas
- perfumería zacatecas
- perfumes baratos zacatecas
- invictus zacatecas
- le beau zacatecas

**Long-tail Keywords:**
- dónde comprar perfumes en zacatecas
- tienda de perfumes en zacatecas
- perfumes originales zacatecas
- decants de perfumes zacatecas

---

## ✅ Verificación Final

Antes de lanzar, verifica:

1. **Google Rich Results Test**: https://search.google.com/test/rich-results
   - Ingresa tu URL y verifica que los Schema.org se muestren correctamente

2. **PageSpeed Insights**: https://pagespeed.web.dev/
   - Optimiza para móvil y desktop

3. **Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly
   - Asegúrate de que sea responsive

4. **Meta Tags Checker**: https://metatags.io/
   - Verifica que todos los meta tags se muestren bien

---

## 📝 Notas Importantes

- **Cambiar URLs**: Reemplaza `https://www.perfumeszacatecas.com` con tu dominio real en todos los archivos
- **Actualizar fechas**: Actualiza `<lastmod>` en sitemap.xml regularmente
- **Monitoreo**: Revisa Google Search Console semanalmente al inicio
- **Contenido único**: Asegúrate de tener contenido original y de calidad

---

**Última actualización**: Diciembre 2024
**Versión del sitio**: 1.0
