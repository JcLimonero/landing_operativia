# OperativAI — landing

Sitio estático de OperativAI (agentes de IA para WhatsApp y mentoría de IA).
Producción: **https://www.operativai.com.mx** (Vercel, despliega solo al mezclar en `main`).

**Posicionamiento:** el core son **pymes y negocios pequeños**, incluido el profesional
individual (un asesor de seguros, por ejemplo). El sector automotriz es una
**especialización secundaria**, no el eje: la experiencia automotriz profunda pertenece a
Dealer Solutions y Nexus Q Tech, que son otras empresas del dueño. No apoyarse en ella
para posicionar OperativAI.

## Lo primero que hay que entender: dos tipos de página

| Tipo | Archivos | Cómo se editan |
|---|---|---|
| **Artboards del canvas** | `OperativAI Landing.dc.html`, `OperativAI Agente WhatsApp.dc.html`, `OperativAI Mentoria IA.dc.html` | Con cuidado, ver abajo |
| **HTML normal** | `automotriz.html`, `refaccionarias.html`, `privacidad.html`, `condiciones.html`, `404.html` | Como cualquier HTML |

Los `.dc.html` vienen de un canvas de diseño y tienen esta forma:

```html
<head>
  <!-- meta de SEO, structured data y los <script> compartidos -->
  <script src="/analytics.js"></script>
  <script src="/assistant.js" defer></script>
  <script src="/nav-movil.js" defer></script>
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
  <helmet>
    <style> /* el CSS de la página vive aquí */ </style>
    <!-- hojas del design system, lucide, emailjs -->
  </helmet>
  <!-- el cuerpo -->
</x-dc>
<script type="text/x-dc" data-dc-script data-props="…">
  class Component extends DCLogic { … }   /* props, estado, handleSubmit, faqs */
</script>
</body>
```

Reglas al tocarlos:

- **No romper `<x-dc>` ni `<helmet>`**: cada uno aparece una sola vez.
- **`support.js` (1 900 líneas) es el runtime del canvas. No se edita.** Él mueve el
  contenido del `<helmet>` al `<head>` en tiempo de ejecución, resuelve `{{ variables }}`
  y renderiza `<sc-for>`, `<sc-if>` y los `<details>` de las FAQ.
- **Las meta de SEO van en el `<head>` estático, no en el `<helmet>`.** Los rastreadores
  —y sobre todo los scrapers de WhatsApp, Facebook y LinkedIn— no ejecutan JavaScript.
  Ya se migraron; no devolverlas al helmet.
- **`support.js` hace *append* al head sin deduplicar**, así que una etiqueta puesta en
  los dos sitios acaba duplicada en el DOM.
- **El header se repinta después de `DOMContentLoaded`.** Cualquier cosa que se cuelgue
  de él por JS tiene que sobrevivir a ese repintado (ver `nav-movil.js`).
- Datos de la página —FAQ, textos del formulario, `ctaUrl`— viven en `renderVals()` del
  bloque `data-dc-script`, no en el markup.

## Scripts compartidos (raíz, cargados por las páginas)

| Archivo | Qué hace |
|---|---|
| `analytics.js` | GA4 **desactivado**: `GA_MEASUREMENT_ID` está vacío y mientras lo esté no se carga nada ni se instala cookie. Expone `window.trackLead()` y registra `contact_whatsapp` al pulsar cualquier CTA de WhatsApp. |
| `assistant.js` | Botón flotante que abre el asistente de IA en un iframe (`https://operativai-chat-iframe.vws2rl.easypanel.host/embed`). El iframe no recibe `src` hasta la primera apertura y no se recarga después. |
| `nav-movil.js` | Menú hamburguesa en ≤790 px. Arma el panel **clonando el `<nav>` real** de cada página, así que no hay lista duplicada que mantener. |

Patrón para añadir uno nuevo: un IIFE sin dependencias que inyecta su propio `<style>` y
su UI, y una línea `<script src="/x.js" defer></script>` en el `<head>` de las páginas.

Bloqueo de scroll: `assistant.js` usa `<body>` y `nav-movil.js` usa `<html>`,
deliberadamente, para que abrir los dos a la vez no deje la página sin scroll.

## Rutas

`vercel.json` mapea rutas limpias a los archivos (`/` → `OperativAI Landing.dc.html`,
`/agente-whatsapp`, `/mentoria-ia`, `/automotriz`, `/refaccionarias`, `/privacidad`,
`/condiciones`), redirige los archivos crudos a su ruta limpia y el apex a `www`, y
envía cinco cabeceras de seguridad. `404.html` se sirve en las rutas desconocidas.

Al añadir una página: archivo + rewrite + redirect en `vercel.json` + entrada en
`sitemap.xml` + enlace desde el pie de las demás. `refaccionarias` y `404` llevan
`noindex` a propósito.

## Probar en local

```bash
python3 .claude/serve.py   # puerto 8900, aplica los rewrites y el 404 como Vercel
```

Un `python3 -m http.server` a secas **no** reproduce producción: daría listado de
directorio en `/` y 404 en las rutas limpias.

El iframe del asistente **no carga en localhost:8900 ni en los previews de Vercel**: su
`Content-Security-Policy: frame-ancestors` solo admite `localhost:3000`, `localhost:3001`
y el panel de usuario. Un "Refused to frame" en consola es esperado fuera de esos orígenes.

## Cómo se trabaja aquí

Las dos skills del usuario mandan y se aplican siempre:

- **`plan-ejecuta-valida`** — plan en el chat → subagente `ejecutor` → subagente
  `validador` distinto. Nada se da por terminado sin APROBADO.
- **`flujo-pr`** — nunca push directo a `main`: rama `feat|fix|chore/tema`, commit en
  español con prefijo convencional, PR con `gh`, Vercel en verde, y mezcla con
  `--squash --delete-branch` **solo cuando el usuario diga "publícalo"**.

`main` no tiene protección de rama configurada; la regla se cumple por disciplina.

## Convenciones

- **Todo el contenido en español de México.** Commits, PRs y comentarios de código también.
- **Cuidado con el ancho del header.** Es lo que más se ha roto: cada elemento nuevo en el
  nav parte la barra en dos filas en algún ancho. Hay tres cortes escalonados —1060 px
  aprieta el espaciado, 870 px suelta "Preguntas", 790 px oculta el nav y aparece la
  hamburguesa— y la página del agente de WhatsApp es el peor caso, con seis enlaces.
  Al tocar el nav, barrer de 1440 a 375 px en **las cinco páginas con menú**.
- **Dos números de WhatsApp.** `5213317586975` es **el agente de IA** y es el destino de
  todos los CTA: la línea de contacto es el demo del producto. `523338158423` es el
  teléfono humano y vive solo en el structured data y en el perfil de Google, para que el
  NAP coincida. No mezclarlos.
- Cada CTA lleva su propio `?text=` preescrito según página y posición, para saber de
  dónde viene cada contacto.
- El formulario envía por EmailJS; los destinatarios están en la plantilla del servicio,
  nunca en el HTML. Lleva honeypot (`sitio_web`) y casilla de consentimiento.
- Imágenes: medir antes de subir. El logo del header pesaba 161 KB para verse a 48×34 px.

## Pendientes fuera de este repo

- **El `/embed` del chat debe añadir `https://www.operativai.com.mx` a su
  `frame-ancestors`.** Hasta entonces el asistente se ve en blanco en producción.
- GA4 sin `GA_MEASUREMENT_ID`, y Bing Webmaster Tools sin dar de alta.
