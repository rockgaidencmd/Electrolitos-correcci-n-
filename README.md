# Corrección de Sodio y Potasio

App web instalable (PWA) para calcular velocidades de infusión en la corrección de
hiponatremia, hipernatremia e hipopotasemia. No requiere build ni instalar dependencias:
es HTML + CSS + JS puro.

## Publicarla en GitHub Pages

1. Sube estos archivos a la raíz de tu repositorio (o a una carpeta, p. ej. `/docs`):
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `icons/icon-192.png`
   - `icons/icon-512.png`
2. En GitHub: **Settings → Pages**.
3. En "Source" elige la rama (`main`) y la carpeta (`/root` o `/docs`, según donde subiste los archivos).
4. Guarda. GitHub te dará una URL tipo `https://tu-usuario.github.io/tu-repo/`.
5. Espera 1–2 minutos y abre esa URL desde el celular Android.

## Instalarla en Android

1. Abre la URL de GitHub Pages en **Chrome** en el celular.
2. Aparecerá un aviso de "Instalar app" o "Agregar a pantalla de inicio"
   (si no aparece automáticamente, toca el menú ⋮ → **Instalar aplicación**).
3. Confirma. Quedará como un ícono más en el celular, se abre sin barra de navegador
   y funciona sin internet una vez cargada la primera vez (gracias al service worker).

## Notas

- Todo el cálculo corre en el propio dispositivo, no se envía ningún dato a un servidor.
- Los íconos están en `icons/`; puedes reemplazarlos por el logo de tu servicio si quieres.
- Los límites de seguridad (mEq/L en 24 h, mEq/h por vía) están al inicio de `index.html`
  dentro de las funciones `calcHipoNa`, `calcHiperNa` y `calcHipoK` — ajústalos si tu
  institución usa otros protocolos.

**Aviso:** esta herramienta es de apoyo a la decisión clínica y no reemplaza el juicio
médico ni los protocolos institucionales.
