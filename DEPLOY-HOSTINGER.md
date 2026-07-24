# Desplegar Evox Entrepreneur en Hostinger — Deploy Web App (Node.js)

Se despliega la app Next.js completa usando la opción **"Deploy Web App"** de
Hostinger (el icono JS). Así corre el servidor real: **IA de máxima calidad**,
tu API key protegida como variable de entorno, y actualizaciones sencillas.

---

## Antes de empezar necesitas

1. **Tu logo** en `public/evox-logo.png` (el archivo real de Evox). Inclúyelo
   antes de subir/compilar para que aparezca en la app.
2. **Una API key de Claude** — https://console.anthropic.com/ (empieza con `sk-ant-`).

---

## Opción A — Deploy desde GitHub (recomendada)

**1. Sube el proyecto a un repositorio de GitHub**

Desde la carpeta del proyecto:

```bash
git add .
git commit -m "Evox Entrepreneur"
# crea un repo vacío en github.com y luego:
git remote add origin https://github.com/TU-USUARIO/evox-entrepreneur.git
git push -u origin main
```

**2. En hPanel → "Deploy Web App" → conecta GitHub** y elige el repo.

**3. Configura la app:**

| Campo | Valor |
|---|---|
| Versión de Node | **20** (o 18.18+) |
| Comando de instalación | `npm install` |
| Comando de build | `npm run build` |
| Comando de inicio | `npm start` |

**4. Variable de entorno** (en la config de la app / "Environment variables"):

```
ANTHROPIC_API_KEY = sk-ant-tu-clave-real
```

**5. Deploy.** Cada vez que hagas `git push`, puedes volver a desplegar y se
actualiza.

---

## Opción B — Subir archivos (sin GitHub)

1. En tu computadora, deja el logo en `public/evox-logo.png`.
2. En hPanel → **"Deploy Web App" → subir archivos**, sube el proyecto
   **sin** las carpetas `node_modules`, `.next` ni `out` (Hostinger las genera).
3. Configura los mismos comandos y la variable `ANTHROPIC_API_KEY` de la Opción A.

> Si tu panel te deja subir solo un `.zip`, comprime el proyecto excluyendo
> `node_modules/`, `.next/` y `out/`.

---

## Verificar

1. Abre tu dominio → debe cargar Evox Entrepreneur (tema oscuro neón).
2. Ve a **Estudio**, analiza una idea:
   - Sin aviso amarillo de "Respuesta de ejemplo" → **IA real funcionando** 🎉
   - Con aviso amarillo → revisa que la variable `ANTHROPIC_API_KEY` esté puesta
     y hayas re-desplegado.

---

## Notas

- **`npm start`** usa el puerto que Hostinger asigna automáticamente (variable
  `PORT`). No necesitas configurarlo a mano.
- **Si un análisis se corta por timeout** (peticiones muy largas): abre
  `lib/anthropic.ts` y cambia `effort: "high"` por `"medium"`, vuelve a
  desplegar. Es más rápido con excelente calidad igual.
- **Perfiles y comunidad** se guardan hoy en el navegador de cada usuario
  (local-first, sin base de datos). Para que sean **compartidos entre todos y
  multi-dispositivo**, el siguiente paso es una base de datos MySQL (incluida en
  tu plan Hostinger) — se puede añadir después sin rehacer la app.
- **El logo se ve roto:** faltó `public/evox-logo.png`. Agrégalo, y vuelve a
  desplegar (o `git push` si usas GitHub).
```
