# Runbook — rebrand de OperativAI a Orvia

- **Fecha:** 2026-11-03
- **Estado:** fase 1 completada. Fases 2 a 5 pendientes.
- **Repo:** `JcLimonero/landing_operativia`
- **Dominio destino:** `orvia.tech`

> Este documento se actualiza al cerrar cada fase. Cuando el rebrand termine,
> se archiva y su contenido vigente pasa a `CLAUDE.md` y a un ADR-002.

## Qué es esto

OperativAI pasa a llamarse **Orvia**. Cambian **la marca comercial y la razón social**.
El dominio pasa de `operativai.com.mx` a **`orvia.tech`**.

La marca Orvia **está registrada en México** a nombre del dueño. El dominio se compró
en **Neubox** (revendedor de PublicDomainRegistry) el 3 de noviembre de 2026 y
**vence el 4 de noviembre de 2027**.

### La regla que gobierna todo el rebrand

**Nada de medias tintas.** Un sitio que dice Orvia en un dominio que dice operativai
es peor que cualquiera de los dos extremos: rompe la confianza del visitante y confunde
a Google con dos identidades para el mismo contenido.

Por eso las fases 2 y 3 se preparan por separado pero **se publican el mismo día**: el
día que `orvia.tech` sirva el sitio con la marca nueva, `operativai.com.mx` ya debe
estar redirigiendo.

## Tamaño real

244 ocurrencias de la marca en el repo, pero **solo ~87 son texto de marca**. El resto
son URLs y rutas de archivo:

| Qué | Cuántas |
|---|---|
| `operativai.com.mx` en URLs canónicas, OG, sitemap y JSON-LD | 102 |
| Rutas de `assets/operativai-*.png` | 33 |
| `agente.operativai.com.mx` | 20 |
| `operativai-chat-iframe…easypanel.host` | 2 |
| **Texto de marca visible** | **~87** |

Por archivo:

| Ocurrencias | Archivo |
|---:|---|
| 40 | `precios.html` |
| 31 | `OperativAI Landing.dc.html` |
| 28 | `OperativAI Agente WhatsApp.dc.html` |
| 22 | `OperativAI Mentoria IA.dc.html` |
| 19 | `refaccionarias.html` |
| 19 | `automotriz.html` |
| 16 | `condiciones.html` |
| 12 | `privacidad.html` |
| 12 | `docs/adr/ADR-001-…md` |
| 10 | `CLAUDE.md` |
| 9 | `llms.txt` |
| 8 | `vercel.json` |
| 7 | `sitemap.xml` |
| 5 | `assistant.js` |
| 5 | `404.html` |
| 1 | `robots.txt` |

---

## Fase 0 — decisiones que bloquean

Ninguna fase posterior puede cerrarse sin estas dos.

### 0.1 — Canónico: apex o `www`

Hoy `operativai.com.mx` usa `www` como canónico y el apex redirige. Para `orvia.tech`
hay que decidir **antes del switch**: cambiarlo después desperdicia los 301 acumulados.

Define la dirección del redirect en `vercel.json`, el `<link rel="canonical">` de cada
página, las URLs del `sitemap.xml` y las de `llms.txt`.

- [ ] Decidido: `___________________`

### 0.2 — Datos fiscales de la nueva razón social

`privacidad.html` declara hoy como responsable a una **persona física**:
Fernando Ramón Parra Villanueva, con su RFC y domicilio. Si la entidad cambia, los tres
datos cambian. **No se inventan ni se deducen.**

- [ ] Razón social exacta con régimen (S.A.P.I. de C.V., S. de R.L., …): `___________`
- [ ] RFC de la nueva entidad: `___________`
- [ ] Domicilio fiscal: `___________`
- [ ] ¿La entidad ya está constituida, o la persona física sigue operando bajo la marca
      Orvia? **Si es lo segundo, `privacidad.html` no se toca** y solo cambia el
      nombre comercial.

### 0.3 — Identidad visual

Los tres assets dicen OperativAI y hay que reemplazarlos, no renombrarlos:

| Archivo | Peso actual |
|---|---|
| `assets/operativai-logo.png` | 84 KB |
| `assets/operativai-icon.png` | 15 KB |
| `assets/og-operativai.png` | 51 KB |

Pasan a `assets/orvia-logo.png`, `assets/orvia-icon.png`, `assets/og-orvia.png`.

> **Medir antes de subir.** El logo anterior llegó a pesar 161 KB para verse a 48×34 px.

- [ ] Identidad de Orvia disponible, o provisionales marcados como tales

---

## Fase 1 — infraestructura ✅ (3 nov 2026)

Hecho y verificado contra los nameservers autoritativos.

- Zona `orvia.tech` en Cloudflare, cuenta `Carloslimon@outlook.com's Account`,
  id `9e7480d36b450f922d86d1adab113c01`, **activa**.
- Nameservers `jihoon.ns.cloudflare.com` y `nova.ns.cloudflare.com`, puestos en el
  área de clientes de Neubox (**no** en el "Administrador de DNS", que no está
  conectado a la zona viva).
- `orvia.tech` y `www.orvia.tech` agregados al proyecto Vercel `landing-operativia`.

Registros, todos en **DNS only** (nube gris):

| Tipo | Nombre | Contenido | Para qué |
|---|---|---|---|
| A | `@` | `216.198.79.1` | Vercel |
| CNAME | `www` | `cname.vercel-dns.com` | Vercel |
| A | `agente` | `74.208.16.223` | VPS con EasyPanel |
| A | `mail` | `207.210.229.233` | cPanel TELL IT |
| A | `ftp` | `207.210.229.233` | cPanel TELL IT |
| MX | `@` | `mail.orvia.tech` prio 0 | correo |

### La trampa que se atrapó aquí

El escaneo automático de Cloudflare importó `www`, `mail` **y `ftp`** como **CNAME al
apex**. Si solo se hubiera cambiado el registro `A @` a Vercel, el correo de
`@orvia.tech` habría quedado apuntando a Vercel, que no habla SMTP. El síntoma habría
aparecido semanas después, al dar de alta el primer buzón, sin relación aparente con
el cambio de DNS.

Por eso `mail` y `ftp` se convirtieron a registros **A** al cPanel, y el MX dejó de
apuntar al apex. **Si en el futuro se agrega otro subdominio de servicio, revisar que
no sea un CNAME al apex.**

### Pendientes menores de fase 1

- [ ] Autorrenovación de `orvia.tech` en Neubox (vence 2027-11-04)
- [ ] Guardar el token DNS en el vault como item `CLOUDFLARE_DNS_ORVIA`
      (hoy vive solo en `.env.sh`, que es local)
- [ ] Confirmar que Vercel emitió el certificado TLS:
      `curl -sI https://orvia.tech/ | head -1`

---

## Fase 2 — el repo (un PR)

Se prepara completo contra una **preview de Vercel** y no se mezcla hasta que la fase 3
esté lista. Sigue `flujo-equipo` y `flujo-pr`.

### 2.1 — Renombrar archivos

```
OperativAI Landing.dc.html          ->  Orvia Landing.dc.html
OperativAI Agente WhatsApp.dc.html  ->  Orvia Agente WhatsApp.dc.html
OperativAI Mentoria IA.dc.html      ->  Orvia Mentoria IA.dc.html
assets/operativai-logo.png          ->  assets/orvia-logo.png
assets/operativai-icon.png          ->  assets/orvia-icon.png
assets/og-operativai.png            ->  assets/og-orvia.png
```

> Renombrar los `.dc.html` **arrastra los rewrites y los redirects** de `vercel.json`.
> Los redirects usan regex con `(.*)` en lugar de espacios literales; hay que
> actualizarlos, no solo los rewrites.

### 2.2 — `vercel.json`

Rewrites actuales que cambian de destino:

| Ruta | Destino nuevo |
|---|---|
| `/` | `/Orvia Landing.dc.html` |
| `/agente-whatsapp` | `/Orvia Agente WhatsApp.dc.html` |
| `/mentoria-ia` | `/Orvia Mentoria IA.dc.html` |

Los de `/privacidad`, `/condiciones`, `/automotriz`, `/refaccionarias` y `/precios`
no cambian.

Redirects de archivo crudo a ruta limpia: cambiar `/OperativAI(.*)…` por `/Orvia(.*)…`,
**y conservar los viejos** por si alguien tiene un enlace directo al `.dc.html` antiguo.

### 2.3 — Texto de marca y URLs

En los 16 archivos de la tabla de arriba:

- `OperativAI` → `Orvia` en texto visible
- `https://www.operativai.com.mx` → la URL canónica que se decida en 0.1
- `agente.operativai.com.mx` → `agente.orvia.tech`
- Rutas de assets a los nombres nuevos

Puntos que no son texto corrido y es fácil olvidar:

- `<link rel="canonical">` de cada página
- `og:url`, `og:image`, `og:site_name`, `twitter:*`
- JSON-LD: `Organization.name`, `.url`, `.logo`, y el `sameAs` (hoy `[]`)
- `sitemap.xml` — las 7 URLs
- `llms.txt`
- `robots.txt` — la línea del sitemap
- `assistant.js` — comentarios y, si cambia, la URL del `/embed`
- `CLAUDE.md` — nombres de archivo, dominio, posicionamiento

### 2.4 — Páginas legales

Según 0.2. Si la entidad cambia, actualizar en `privacidad.html` el responsable, el RFC
y el domicilio. `condiciones.html` solo cambia el nombre comercial.

**Si los datos no están confirmados, dejar las páginas como están y marcar el pendiente.**
Publicar un aviso de privacidad con la entidad equivocada es un problema real, no
cosmético.

### 2.5 — Documentación

- `CLAUDE.md` al día
- `docs/adr/ADR-001-…md` es una foto histórica: **no se reescribe**. Se agrega un
  ADR-002 que lo supersede y documenta el rebrand.

### 2.6 — Verificar antes de mezclar

- [ ] `python3 .claude/serve.py` y barrer las 8 rutas limpias
- [ ] Header de 1440 a 375 px en **las cinco páginas con menú** (los cortes son
      1060 / 870 / 790 px; la del agente de WhatsApp es el peor caso, con seis enlaces)
- [ ] `grep -ri operativai .` sin resultados fuera de los redirects heredados
- [ ] Preview de Vercel en verde

---

## Fase 3 — el switch y los 301

**El mismo día que la fase 2.**

### 3.1 — Los 301

`operativai.com.mx` **se queda en Vercel**, en el mismo proyecto, redirigiendo todo a
`orvia.tech`. Se hace con `has.host` en `vercel.json`:

```jsonc
{
  "source": "/(.*)",
  "has": [{ "type": "host", "value": "(www\\.)?operativai\\.com\\.mx" }],
  "destination": "https://orvia.tech/$1",
  "permanent": true
}
```

**Estos redirects se quedan para siempre**, no un año. Es lo que transfiere la
autoridad acumulada y lo que evita romper cualquier enlace externo que ya exista.

> No borrar el dominio viejo de Vercel ni dejar expirar `operativai.com.mx`.
> El día que expire, los 301 mueren y con ellos todo el SEO heredado.

### 3.2 — Verificación inmediata

- [ ] `curl -sI https://www.operativai.com.mx/precios` devuelve `301` a `orvia.tech`
- [ ] Las 8 rutas limpias responden 200 en el dominio nuevo
- [ ] El certificado TLS es válido en apex y `www`
- [ ] El 404 sigue funcionando en rutas desconocidas

---

## Fase 4 — servicios externos

Nada de esto vive en el repo.

| Servicio | Qué hacer |
|---|---|
| **Search Console** | Alta y verificación de `orvia.tech`. Luego **herramienta de cambio de dirección** en la propiedad vieja. Subir el sitemap nuevo. |
| **Google Business Profile** | Cambiar nombre a Orvia y el sitio web. Un cambio de nombre suele disparar **revisión manual**: puede tardar días. Al terminar, agregar la URL del perfil al `sameAs`. |
| **Bing Webmaster Tools** | Alta directa sobre `orvia.tech`. **No hacerlo sobre el dominio viejo** — sería trabajo tirado. |
| **EmailJS** | Actualizar la plantilla del servicio (marca y remitente) y las *Allowed Origins*. |
| **App del agente** | `agente.orvia.tech` en EasyPanel para que emita su certificado. El DNS ya apunta; hoy presenta uno autofirmado. |
| **`/embed` del chat** | Agregar `https://orvia.tech` a `frame-ancestors`. **Ya estaba pendiente**: el asistente se ve en blanco en producción desde hace semanas. Esta es la oportunidad de cerrarlo. |

### Sobre el SEO

La indexación de `/precios` y `/mentoria-ia` que se pidió en septiembre **se reemplaza**,
pero los 301 transfieren la autoridad. No se pierde: se transfiere. Esperar una caída
temporal de impresiones de varias semanas es normal y no indica que algo salió mal.

---

## Fase 5 — correo

Decisión aparte, no bloquea el sitio.

Hoy el correo de `orvia.tech` apunta al cPanel **TELL IT** de Neubox
(`207.210.229.233` = `svgt446.serverneubox.com.mx`), el mismo de `operativai.com.mx`.

- [ ] Dar de alta `orvia.tech` como dominio adicional **en el cPanel**. El DNS solo
      dirige el tráfico; si el dominio no existe ahí, el correo rebota.
- [ ] Crear los buzones
- [ ] Registros opcionales para webmail y configuración automática:
      `A webmail`, `A cpanel`, `A autodiscover` → `207.210.229.233`;
      `CNAME pop` / `imap` / `smtp` → `mail.orvia.tech`
- [ ] **SPF** antes de enviar el primer correo. Sin SPF, cae en spam desde el día uno.
- [ ] Plan de transición del correo `@operativai.com.mx`: reenvío o convivencia

---

## Riesgos conocidos

| Riesgo | Mitigación |
|---|---|
| Dejar el rebrand a medias | Fases 2 y 3 el mismo día |
| Perder `orvia.tech` por no renovar | Autorrenovación, vence 2027-11-04 |
| Dejar expirar `operativai.com.mx` | Mantenerlo vivo indefinidamente: sostiene los 301 |
| Proxy naranja en Cloudflare | Rompe el certificado de Vercel. Todos los registros en **DNS only** |
| CNAME al apex en subdominios nuevos | Revisar siempre; fue la trampa de la fase 1 |
| Publicar la entidad fiscal equivocada | No tocar `privacidad.html` sin los datos confirmados |

## Bitácora

| Fecha | Qué pasó |
|---|---|
| 2026-11-03 | Decisión del rebrand. Fase 1 completada: zona, DNS y dominio en Vercel. |
