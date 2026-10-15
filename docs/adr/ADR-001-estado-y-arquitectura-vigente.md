# ADR-001 — Estado y arquitectura vigente de la landing de OperativAI

- **Fecha:** 2026-10-14
- **Estado:** Aceptado como foto del estado. Se revisa cuando cambie la arquitectura.
- **Repo:** `JcLimonero/landing_operativia` · rama `main` en `7c86738`
- **Fuentes:** `CLAUDE.md` e historial de git.

## Contexto

Sitio estático de OperativAI (agentes de IA para WhatsApp y mentoría de IA).
Producción: **https://www.operativai.com.mx** — Vercel, despliega solo al mezclar en `main`.

**Posicionamiento (decisión de negocio que gobierna el contenido):** el core son **pymes y negocios
pequeños**, incluido el profesional individual. El sector automotriz es una **especialización
secundaria**, no el eje: la experiencia automotriz profunda pertenece a Dealer Solutions y Nexus Q
Tech, que son otras empresas del dueño, y **no se usa para posicionar OperativAI**.

## Decisiones vigentes

- **Dos tipos de página que se editan distinto**, y es lo primero que hay que entender del repo:
  - **Artboards del canvas** — `OperativAI Landing.dc.html`, `OperativAI Agente WhatsApp.dc.html`,
    `OperativAI Mentoria IA.dc.html`. Se editan con cuidado, según las reglas del `CLAUDE.md`.
  - **Páginas normales** — `precios.html`, `privacidad.html`, `condiciones.html`,
    `automotriz.html`, `refaccionarias.html`, `404.html`.
- **Scripts compartidos en la raíz**, cargados por las páginas: `analytics.js`, `assistant.js`,
  `nav-movil.js`, `support.js`.
- **El asistente de IA es el demo del producto**: todos los contactos van al agente
  (decisión de 2026-09-16), con un botón flotante que lo abre en un diálogo.
- **El design system vive en `_ds/`** (kit de Dealer Solutions).
- **`llms.txt`, `robots.txt` y `sitemap.xml`** se mantienen a mano.
- **Redirects y dominio en `vercel.json`** (los `.dc.html` y el dominio sin `www`).

## Estado al 14 de octubre de 2026

- **Precios publicados:** los cuatro planes y los paquetes de créditos (#7); el IVA se declara como
  que **se suma**, no como «netos» (#8); el FAQ responde los términos en vez de remitir al
  diagnóstico (#9).
- **Mentoría:** la página ya dice qué se mejora, con quién y qué te llevas (#10).
- **Navegación:** menú hamburguesa para móvil (#5) y enlace a la app del agente en el menú y el pie (#4).
- **Legal:** condiciones del servicio publicadas (#2) y responsable del tratamiento identificado (#3).
- **Sin PRs abiertos.** Último PR mezclado: #10.

### Pruebas y CI

**No hay pruebas ni CI**: es un sitio estático sin build. Vercel despliega al mezclar.

## Pendientes y huecos conocidos

Son **pendientes fuera de este repo**, y están documentados en el `CLAUDE.md`:

1. **El `/embed` del chat debe añadir `https://www.operativai.com.mx` a su `frame-ancestors`.**
   Hasta entonces **el asistente se ve en blanco en producción** — y el asistente es el demo del
   producto, así que esto es lo más grave que hay abierto.
2. **GA4 sin `GA_MEASUREMENT_ID`**: no hay analítica.
3. **Bing Webmaster Tools sin dar de alta.**

## Riesgos y deuda

- El demo principal del producto está roto en producción por una cabecera que vive en otro servicio.
- Hay dos repos de OperativAI con nombres parecidos y propósitos distintos: este (`landig_opertaivai`
  → `landing_operativia`) y `panel-operativai` (el portal). Los nombres invitan a confundirlos.
- Los artboards `.dc.html` son generados por un canvas: editarlos a mano es frágil por diseño.

## Lo que sigue

1. **Arreglar `frame-ancestors` en el `/embed` del chat** para que el asistente deje de verse en
   blanco.
2. Dar de alta GA4 y Bing Webmaster Tools.
