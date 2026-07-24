# Evox Entrepreneur ⚡

**Connect · Build · Scale** — Tu coach de negocio con IA (Powered by Evox), para emprendedores. Acompaña una idea en todo su camino:

1. **Valida** — un análisis honesto de la idea (¿problema real?, ¿mercado?, ¿diferenciación?).
2. **Pule** — como *abogado del diablo constructivo*: encuentra los huecos reales y, por cada uno, da el **"cómo sí"** para ejecutarlo mejor. No busca todos los "no".
3. **Lanza** — plan de ejecución por fases, **identidad visual** (paleta, tipografía, logo) y guía de **posicionamiento digital**.
4. **Escala** — una **comunidad tipo incubadora**: cada miembro declara lo que ofrece y lo que busca, y se conecta con quien tiene justo lo que necesita.

Incluye **perfiles de usuario** para dar seguimiento: cada persona crea su perfil, guarda sus análisis y vincula sus proyectos de la comunidad.

El análisis funciona como un **escáner por etapas**: se adapta a si el proyecto es apenas una idea o ya es un negocio consolidado.

## Identidad de marca (EVOXVERSE)

- **Paleta:** Cyber Blue `#00B2FF` · Neon Purple `#8A2BE2` · Neon Pink `#FF2E7A` · Deep Space `#1E1E2A` · Pure White `#FFFFFF`.
- **Tipografía:** Orbitron (títulos), Rajdhani (destacados), Inter (cuerpo).
- **Estilo:** oscuro, futurista, neón. Nunca fondos blancos ni colores pastel.
- **Logo:** la máscara EVOX con rayo (regla innegociable). Ver nota abajo.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** + **Tailwind CSS v4**
- **Claude** (Anthropic, `claude-opus-4-8`) como motor de análisis, con salida estructurada.
- Identidad de usuario local-first (localStorage). Lista para cambiar por un backend real cuando se requiera multi-dispositivo.

## Cómo correrlo en local

```bash
npm install
cp .env.example .env.local   # opcional: agrega tu ANTHROPIC_API_KEY
npm run dev
```

Abre http://localhost:3000

> **Sin API key:** funciona con respuestas de **ejemplo** para ver el flujo completo.
> **Con API key:** análisis reales de Claude. Consíguela en https://console.anthropic.com/

## ⚠️ Logo oficial (pendiente)

El componente `components/Logo.tsx` usa la imagen `public/evox-logo.png`.
**Coloca el archivo del logo Evox real** en `public/evox-logo.png` (fondo negro, se funde con el tema oscuro). Hasta entonces se verá un ícono roto.

## Despliegue

La ruta `/api/analizar` corre en el servidor para proteger la API key de Claude,
así que se despliega como **app Node.js**. En Hostinger se usa la opción
**"Deploy Web App"** (desde GitHub o subiendo archivos).

```bash
npm run build
npm start   # usa la variable PORT que asigna el hosting
```

Configura la variable de entorno `ANTHROPIC_API_KEY` en el panel de hosting.
**Pasos detallados para Hostinger:** ver [`DEPLOY-HOSTINGER.md`](DEPLOY-HOSTINGER.md).

## Estructura

```
app/
  page.tsx            Landing (visión + filosofía Evox)
  estudio/            Motor de IA: formulario → análisis con pestañas
  comunidad/          Comunidad Evox (directorio + conexiones)
  perfil/             Perfil de usuario + historial (seguimiento)
  api/analizar/       Endpoint servidor que llama a Claude
lib/
  types.ts            Tipos + esquema de salida estructurada
  prompts.ts          System prompt (el abogado del diablo constructivo, voz Evox)
  anthropic.ts        Cliente de Claude + fallback a ejemplo
  mockData.ts         Análisis de ejemplo (sin API key)
  community.ts        Datos semilla + lógica de conexiones
  auth.tsx            Identidad de usuario (perfil + historial)
components/           NavBar, Footer, Logo, Estudio, Comunidad
```

## Nota

Evox Entrepreneur acompaña, no reemplaza el criterio del emprendedor. Belong to the evolution.
