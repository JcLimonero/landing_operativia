# Dealer Solutions — Design System

> Software development a la medida para los sectores **automotriz, salud y financiero**.

Este design system es el ADN visual de Dealer Solutions, reconstruido para 2026 con una estética moderna tech (oscuro, gradientes sutiles, animaciones contenidas) que respeta y refresca la identidad existente del bull azul.

---

## Fuentes consultadas

- **Sitio actual:** https://dealersolutions.com.mx — referencia de contenido y servicios. No tuvimos acceso al código ni a Figma; el rediseño se construye sobre el logo + descripción del negocio que nos proporcionó el equipo.
- **Logo:** subido por el cliente (`uploads/logo_file-1778866409643.webp`) — bull azul + wordmark "Dealer Solutions".
- **Referencia de dirección estética:** https://itechdev.com.mx/es/ (dark, geométrico, software-house).

> ⚠️ **Sin acceso a código ni Figma del sitio actual.** Los componentes son recreaciones de cero siguiendo el lenguaje moderno solicitado. Si nos comparten el repo o Figma, podemos refinar a pixel-perfect.

---

## Índice del proyecto

```
/
├── README.md                ← este archivo
├── SKILL.md                 ← para usar como Claude Skill
├── colors_and_type.css      ← variables CSS canónicas (colores, type, spacing, motion)
├── assets/                  ← logos, ícono del bull, variantes
│   ├── logo-original.webp
│   ├── logo-white.png       ← versión para fondos oscuros
│   ├── logo-blue.png        ← monocromo azul de marca
│   ├── logo-dark.png        ← versión para fondos claros
│   ├── bull-icon.png        ← solo el bull, recortado
│   └── bull-icon-bright.png ← bull en azul accent
├── preview/                 ← cards del design system (auto-registradas)
│   ├── colors-*.html
│   ├── type-*.html
│   ├── spacing-*.html
│   └── components-*.html
└── ui_kits/
    └── website/             ← rediseño moderno del sitio
        ├── README.md
        ├── index.html       ← homepage interactiva
        └── *.jsx            ← componentes React
```

---

## Productos / superficies

Dealer Solutions tiene una superficie pública principal:

| Producto | Status | UI Kit |
|---|---|---|
| **Sitio web público (marketing)** | rediseñado en este sistema | `ui_kits/website/` |
| Portal de cliente (interno) | no existe materialmente / fuera de scope | — |

---

## CONTENT FUNDAMENTALS — Voz y tono

### Voz
**Confiable, experta, cercana.** Hablamos como un equipo técnico senior que entiende el negocio del cliente. No somos "agencia creativa", somos **partners de software**: hablamos de procesos, de integración, de ROI, no de "experiencias asombrosas".

### Reglas de copy

- **Idioma:** Español de México. Sin anglicismos innecesarios ("desarrollo a la medida", no "custom dev"). Términos técnicos universales sí se mantienen en inglés (API, SaaS, dashboard, stack).
- **Persona:** Tuteo profesional ("tu operación", "tu equipo"). Nunca "usted". Nunca "vosotros".
- **Nosotros vs ellos:** "Construimos contigo" — siempre primera persona plural + segunda persona singular. Evitar "los clientes" en tercera persona.
- **Casing:** Sentence case en títulos largos. Title Case sólo en navegación corta y CTAs. Nunca ALL CAPS excepto eyebrows técnicos (12px, tracking +0.08em).
- **Largo:** Headlines de 4–9 palabras. Subheads de 12–22. Body en párrafos cortos (≤3 líneas en desktop).
- **Concreto > abstracto:** En vez de "soluciones innovadoras", decimos "plataforma de gestión de inventario para 12 concesionarias".
- **Emoji:** ❌ no se usan en superficies del producto ni marketing. Se permiten en redes sociales informales si el equipo de marketing los aprueba.

### Ejemplos de copy

✅ **Sí:**
> Software a la medida para concesionarias, clínicas y fintechs.
> Construimos contigo el sistema que tu operación necesita — desde la primera línea de código hasta el despliegue.

> 14 años desarrollando plataformas que escalan con tu negocio.

❌ **No:**
> ¡Soluciones digitales innovadoras y disruptivas! 🚀
> Transformamos su negocio con tecnología de vanguardia.

### Llamados a la acción

Verbos directos, primera persona del cliente:
- "Agendar diagnóstico"
- "Ver casos de éxito"
- "Hablar con un arquitecto"
- "Cotizar proyecto"

Evitar: "Click aquí", "Más información", "Conoce más" (vago).

---

## VISUAL FOUNDATIONS

### Paleta

**Filosofía:** light-first, corporativo profesional. Gris-azulado frío como base, navy oscuro como texto, azul corporativo como acento. **Nada de gradientes coloridos, glows, ni tonos cálidos.** El sistema vive en una escala fría que comunica seriedad, ingeniería y madurez técnica.

- **Brand 500** `#1E5BB8` — azul corporativo. Acento principal en CTAs, links, eyebrows.
- **Brand 700** `#0E3C82` — navy profundo. Secciones invertidas (sector destacado, CTA final).
- **Logo blue** `#4090D0` — color original del bull. **Sólo en el logo**, no en UI.
- **Accent light** `#8FB4E8` — azul claro, sólo para acentos sobre fondos navy.
- **Neutrales:** escala fría `ink-50` (casi blanco) → `ink-900` (navy near-black).
- **Page bg:** `ink-100` `#F4F6F9` — gris-azul muy claro.
- **Texto:** `ink-900` `#0B1220` — navy near-black, NO negro puro.
- **Status:** verde apagado `#4A8B7A`, ámbar `#B88842`, rojo `#A84F4F`. Saturación baja para no competir con la UI.

### Tipografía

- **Display & Body:** `Geist` (Vercel) — tipografía oficial del sistema. Geométrica, optimizada para pantalla, alta legibilidad. Pesos 400/500/600/700.
- **Mono:** `Geist Mono` — para snippets, métricas precisas, badges técnicos. Pesos 400/500.

Geist se carga desde Google Fonts. Si en el futuro quieren self-host, los archivos están en [vercel.com/font](https://vercel.com/font) (open source, OFL).

### Espaciado

Sistema base de **4px**. Stack vertical entre secciones usa múltiplos generosos: 64 / 96 / 128. Padding interno de cards: 24 / 32. Gap entre elementos de UI: 12 / 16 / 24. **Nunca** usar valores fuera del sistema.

### Backgrounds

- **Base:** plano `--bg` (`#F4F6F9`). Gris-azul claro, sin imágenes ni gradientes.
- **Secciones alternas:** `--bg-elev-3` (`#ECEFF4`) — un step más oscuro para crear ritmo vertical sin agregar color.
- **Secciones invertidas:** navy profundo `--brand-700` (`#0E3C82`) — el CTA final, el sector destacado, el ticker superior. Crea contraste y "puntos de gravedad" sin recurrir a imágenes.
- **Gradientes:** mínimos. `--grad-brand` (500 → 700) reservado para 1-2 usos puntuales. `--grad-soft` para fades de top. **No usar gradientes coloridos, multi-stop, ni de marca electrónica.**
- **Patrón de cuadrícula:** opcional, SVG sutil de 32px en footer/secciones técnicas, opacity ≤5%.
- **Imágenes:** evitamos stock photo genérico. Cuando se requiere fotografía, usar tomas frías, monocromáticas o b&w. Mejor opción: screenshots reales del producto, dashboards, diagramas técnicos.

### Animaciones

- **Easing default:** `--ease-out` (`cubic-bezier(0.16, 1, 0.3, 1)`) — entrada rápida, salida suave.
- **Duración:** la mayoría de transiciones a **220ms**. Fades hover a 140ms. Reveals on-scroll a 420ms.
- **Tipo:** fades + translaciones de 8–16px. **No bounces** (no es el lenguaje correcto para B2B financiero/salud). El único easing tipo spring permitido es en checkmarks de confirmación.
- **Reveals on scroll:** sí, en hero y stats. Cards en grid aparecen escalonadas (stagger 60ms).
- **Reduced motion:** respetar `prefers-reduced-motion`, colapsar a opacity-only.

### Estados de hover/press

- **Hover de botones:** primary cambia a brand-500; secondary se llena de navy.
- **Hover de cards:** background sube a `--bg-elev-3` o aparece un tint sutil `rgba(30,91,184,0.04)`, el border se intensifica.
- **Hover de links:** color → `--brand-500`, opcional underline en `text-underline-offset: 4px`.
- **Press:** opacity 0.85, transición 100ms. **Sin scale** — el lenguaje es editorial, no de app móvil.
- **Focus visible:** `--ring-brand` (3px halo brand-500 a 18% alpha). **Siempre** visible para teclado.

### Bordes y cards

- **Border default:** 1px sólido `rgba(11,18,32,0.10)` — visible pero sobrio.
- **Hairlines:** mismo color en `rgba(11,18,32,0.12)` para divisores horizontales (estilo editorial).
- **Radii:** **mayormente afilados** (0 o 2-4px). Sólo cards y modales redondean hasta `--r-xl` (14px). Botones a 0 — sharp, geométricos. Pills sólo en filter pills y status badges.
- **Card pattern:** `background: var(--bg-elev-2)` (blanco puro) + `border: 1px solid var(--border-strong)`. Cards destacadas usan navy profundo (`--brand-700`) con texto blanco.
- **Glass / blur:** **NO se usa**. La estética es editorial, no glassmorphic.

### Sombras

- **Filosofía:** sombras muy sutiles. La estética editorial **no depende de sombras** para crear jerarquía — usa hairlines, espacio en blanco y tipografía gigante.
- **shadow-sm/md/lg/xl:** offset bajo, blur generoso, alpha 6-14%. Para inputs, cards, dropdowns, modales.
- **shadow-flat:** hard-shadow editorial de 2px offset — opcional, para cards "stickers" tipo brutalismo light.
- **NO se usan glows** en light mode. Eso era del sistema dark anterior.

### Transparencia

- Glass en sticky nav (header) y modales. 60% opacity + blur.
- Gradientes radiales en hero al 35% max alpha.
- **No** usar transparencia para crear capas semánticas — siempre preferir un surface dedicado (`bg-elev-1/2/3`).

### Layout

- Container max-width: **1280px**.
- Gutters: 24px mobile, 48px tablet, 96px desktop.
- Grid: 12 columnas, gap de 24px.
- Secciones con padding vertical 96–128px desktop.
- Header sticky (72px alto, glass).
- Footer denso, multicolumna (4 cols), padding vertical 64px.

---

## ICONOGRAPHY

**Decisión:** usamos **Lucide** (`https://unpkg.com/lucide-static@latest/`) como sistema unificado de íconos.

### Por qué Lucide

- Stroke weight de 2px coherente con la sensación geométrica de Space Grotesk.
- Set amplio (~1500 íconos), perfecto para B2B (cog, server, shield, chart-line, code, workflow, etc).
- Render por SVG inline → cambio de color por `currentColor`.
- Disponible vía CDN — no requiere fuentes propias.

### Reglas

- **Tamaños:** 16 / 20 / 24 px. Iconos hero hasta 32.
- **Color:** `currentColor` por defecto, hereda del texto. Acentos en `--brand-400` para íconos clave.
- **Pareados con texto:** gap 8px o 12px (nunca menos), alineación baseline.
- **Solos (sin label):** SIEMPRE acompañar de `aria-label` o `title` para accesibilidad.
- **Decorativos:** marcar `aria-hidden="true"`.

### Otros sistemas que NO usamos

- ❌ Emoji — no en superficies del producto.
- ❌ Font Awesome — estética demasiado "agencia 2018".
- ❌ Material Icons — visualmente desalineado con la geometría de Space Grotesk.
- ❌ SVGs custom dibujados por agentes — usar Lucide o solicitar al equipo de diseño.

### Logo & marca

- Variantes en `assets/`:
  - `logo-white.png` — para fondos oscuros (default).
  - `logo-blue.png` — versión monocroma azul para fondos blancos / impresos.
  - `logo-dark.png` — fondos claros / favicon dark.
  - `logo-original.webp` — original mixto (bull azul + "Dealer" blanco + "Solutions" azul).
  - `bull-icon.png` — sólo el bull, para avatares, favicons cuadrados.

**No alterar el logo:** no rotar, no inclinar, no añadir efectos, no cambiar el ratio del bull.

---

## Notas para diseñadores / agentes

1. **Empieza siempre por leer `colors_and_type.css`** — todas las variables vienen de ahí.
2. **No inventes colores** — si necesitas un color nuevo, propón añadirlo al sistema.
3. **No uses Inter / Roboto / Open Sans** — son tropes y rompen la dirección.
4. **No dibujes íconos en SVG inline** — usa Lucide.
5. **No agregues emoji** sin aprobación.
6. **Animaciones contenidas** — el cliente es B2B salud/financiero. No "wow", "claridad".
