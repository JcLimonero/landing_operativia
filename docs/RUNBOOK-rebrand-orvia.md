# Runbook — rebrand de OperativAI a Orvia

- **Fecha:** 2026-11-03 · última revisión 2026-11-04
- **Estado:** **fases 1, 2, 3 y 5 completadas y en producción.** Falta la fase 4 (los
  servicios externos: chat, Search Console, Google Business Profile, Bing, EmailJS).
- **Repo:** `JcLimonero/landing_operativia`
- **Producción:** **https://www.orvia.tech**

> Se actualiza al cerrar cada fase. Cuando el rebrand termine, se archiva y su
> contenido vigente pasa a `CLAUDE.md` y a un ADR-002.

## Qué es esto

OperativAI pasó a llamarse **Orvia**. Cambian **la marca comercial y la razón social**.
El dominio pasó de `operativai.com.mx` a **`orvia.tech`**, con `www` como canónico.

La marca Orvia **está registrada en México** a nombre del dueño. El dominio se compró
en **Neubox** (revendedor de PublicDomainRegistry) el 3 de noviembre de 2026 y
**vence el 4 de noviembre de 2027**.

### La regla que gobernó el rebrand

**Nada de medias tintas.** Un sitio que dice Orvia en un dominio que dice operativai es
peor que cualquiera de los dos extremos. Por eso las fases 2 y 3 se prepararon por
separado y se publicaron en el mismo merge.

## Tamaño real

244 ocurrencias de la marca, pero **solo ~87 eran texto de marca**. El resto eran URLs
y rutas de archivo: 102 del dominio, 33 de assets, 20 del subdominio del agente.
El texto visible era lo barato; lo caro fue la identidad.

---

## Fase 0 — decisiones ✅

### 0.1 — Canónico → **`www.orvia.tech`**

Vercel ya lo había configurado así al dar de alta los dos dominios, y replica lo que
tenía `operativai.com.mx`. El apex `orvia.tech` redirige con 308.

### 0.2 — Responsable del aviso de privacidad ✅ (4 nov 2026)

**No hubo cambio de razón social.** Sigue siendo una **persona física** operando bajo el
nombre comercial Orvia; lo que cambió es **quién** es esa persona. El dueño aportó la
Constancia de Situación Fiscal del nuevo titular y `privacidad.html` se actualizó con
nombre, RFC y domicilio de esa constancia.

**La CURP no se publica.** Viene en la constancia, pero la ley pide identificar al
responsable y su domicilio, no su CURP. Es dato sensible de más y queda fuera a
propósito. Si alguna vez se constituye una sociedad, hay que rehacer este bloque con la
razón social, su régimen y su RFC.

### 0.3 — Identidad visual → **provisional en producción**

Paleta **grafito con acento lima**, tipografía de display **Outfit**, cuerpo en Geist.
Tokens en `orvia-brand.css`. Los tres assets (`orvia-logo.png`, `orvia-icon.png`,
`og-orvia.png`) y la marca `orvia-mark.svg` son **provisionales**: cuando exista
identidad formal se reemplazan esos cuatro archivos y los valores del CSS.

---

## Fase 1 — infraestructura ✅

- Zona `orvia.tech` en Cloudflare, cuenta `Carloslimon@outlook.com's Account`,
  id `9e7480d36b450f922d86d1adab113c01`, **activa**.
- Nameservers `jihoon.ns.cloudflare.com` y `nova.ns.cloudflare.com`, puestos en el área
  de clientes de **Neubox** (**no** en el "Administrador de DNS", que no está conectado
  a la zona viva).
- `orvia.tech` y `www.orvia.tech` en el proyecto Vercel `landing-operativia`.

Registros, todos en **DNS only** (nube gris):

| Tipo | Nombre | Contenido | Para qué |
|---|---|---|---|
| A | `@` | `216.198.79.1` | Vercel |
| CNAME | `www` | `cb3e8d107b31abb3.vercel-dns-017.com` | Vercel |
| A | `agente` | `74.208.16.223` | VPS con EasyPanel |
| A | `mail` | `72.249.60.221` | cPanel de Orvia (`svgt448`) |
| A | `ftp` | `72.249.60.221` | cPanel de Orvia (`svgt448`) |
| A | `webmail` | `72.249.60.221` | acceso al correo por navegador |
| A | `cpanel` | `72.249.60.221` | panel |
| A | `autodiscover` | `72.249.60.221` | configuración automática de Outlook/Apple Mail |
| MX | `@` | `mail.orvia.tech` prio 0 | correo |
| TXT | `@` | `v=spf1 +a +mx +ip4:72.249.60.221 include:relay.mailchannels.net include:smtp.relay.serverneubox.com.mx ~all` | SPF |

### Trampa 1 — el CNAME al apex

El escaneo automático de Cloudflare importó `www`, `mail` **y `ftp`** como **CNAME al
apex**. Si solo se hubiera cambiado el `A @` a Vercel, el correo de `@orvia.tech` habría
quedado apuntando a Vercel, que no habla SMTP — y el síntoma habría aparecido semanas
después, al crear el primer buzón, sin relación aparente con el cambio de DNS.

Por eso `mail` y `ftp` se convirtieron a registros **A** al cPanel y el MX dejó de
apuntar al apex. **Regla: al agregar cualquier subdominio de servicio, verificar que no
sea un CNAME al apex.**

### Trampa 2 — la caché de DNS de macOS

Durante toda la migración, `dig` devolvía la IP correcta y el navegador seguía viendo la
vieja, porque el resolver del sistema cachea aparte. Diagnosticar siempre con
`dig @<nameserver>` o `curl --resolve`, nunca con lo que muestre el navegador. Para
limpiarla: `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`.

### Pendientes menores

- [ ] Autorrenovación de `orvia.tech` en Neubox (vence 2027-11-04)
- [x] Token de Cloudflare acotado a la zona (`Zone → DNS → Edit`, solo `orvia.tech`)
- [ ] Guardarlo en el vault como item `CLOUDFLARE_DNS_ORVIA`

---

## Fase 2 — el repo ✅ (PR #14)

Archivos renombrados con `git mv`: los tres artboards a `Orvia *.dc.html`. Assets viejos
borrados. Marca, URLs, structured data, `sitemap.xml`, `llms.txt`, `robots.txt` y
`CLAUDE.md` actualizados. `orvia-brand.css` cargado **después** de las hojas del design
system en las 8 páginas.

### Trampa 3 — la rampa de marca es color de TEXTO

La más cara de descubrir. La rampa `--brand-*` del design system **se usa unas 70 veces
como color de texto** (enlaces, la palabra de acento de cada titular, `--info`), no como
superficie.

Consecuencia práctica: **no se puede elegir un color de marca claro.** Al poner el lima
en `--brand-*` hay que oscurecerlo para que pase contraste sobre blanco, y la página
entera se va a verde oliva — además de acercarse al verde de WhatsApp, que es lo último
que conviene vendiendo agentes de WhatsApp.

La solución fue invertirlo: **el grafito va en `--brand-*`** y **el lima en
`--accent-light`**, que el design system usa sobre fondos oscuros, donde contrasta de
sobra y es donde la marca realmente se ve. El costo asumido: sobre fondo claro la palabra
de acento de los titulares queda en grafito, sin color.

> Al cambiar la paleta en el futuro, **probar sobre la página real antes de decidir**.
> Una muestra de color aislada no revela este problema: lo vimos solo al renderizar la
> portada completa.

### Lo que NO se tocó, a propósito

- Los datos del responsable en `privacidad.html` (ver 0.2).
- `docs/adr/ADR-001-…md`, que es una foto histórica.
- `_ds/` y `support.js`.
- La estructura, las secciones y los textos: eso sería rediseño, y mezclarlo con una
  migración de dominio haría imposible saber qué rompió qué.

---

## Fase 3 — el switch y los 301 ✅

`operativai.com.mx` **se quedó en Vercel**, en el mismo proyecto, redirigiendo todo a
`https://www.orvia.tech` con dos reglas `has.host` (apex y `www`). Vercel las sirve como
**308**, que Google trata igual que un 301.

Verificado en producción:

| Desde | Resultado |
|---|---|
| `www.orvia.tech` | 200 |
| `orvia.tech` | 308 → `www.orvia.tech` |
| `operativai.com.mx` | 308 → `www.orvia.tech` |
| `www.operativai.com.mx/precios` | 308 → `www.orvia.tech/precios` |

El último es el que importa: los enlaces profundos conservan la ruta.

> **Nunca dejar expirar `operativai.com.mx` ni quitarlo de Vercel.** Sostiene los 308 y
> con ellos toda la autoridad heredada. Estos redirects no se quitan.

---

## Fase 4 — servicios externos ⬜

Nada de esto vive en el repo. En orden de urgencia:

| Servicio | Qué hacer |
|---|---|
| **`/embed` del chat** | Agregar `https://www.orvia.tech` a `frame-ancestors`. **El asistente lleva semanas saliendo en blanco en producción**; con el dominio nuevo sigue igual. |
| **App del agente** | Dar de alta `agente.orvia.tech` en EasyPanel para que emita su certificado. El DNS ya apunta; hoy presenta uno autofirmado. |
| **Search Console** | Alta y verificación de `orvia.tech`, luego **cambio de dirección** en la propiedad vieja, y subir el sitemap. Entre más tarde, más tiempo con las dos versiones compitiendo. |
| **Google Business Profile** | Cambiar nombre a Orvia y el sitio web. Un cambio de nombre suele disparar **revisión manual**: puede tardar días. Al terminar, agregar la URL del perfil al `sameAs` del `Organization`, que hoy está vacío. |
| **Bing Webmaster Tools** | Alta directa sobre `orvia.tech`. |
| **EmailJS** | Plantilla del servicio (marca y remitente) y *Allowed Origins*. |

**Sobre el SEO.** La indexación de `/precios` y `/mentoria-ia` pedida en septiembre se
reemplaza, pero los 308 transfieren la autoridad. Una caída temporal de impresiones de
varias semanas es normal y no indica que algo salió mal.

---

## Fase 5 — correo ✅ en lo esencial (4 nov 2026)

**`orvia.tech` tiene su PROPIA cuenta de cPanel**, donde es el dominio principal y único,
en **`72.249.60.221` = `svgt448.serverneubox.com.mx`**.

**No está en el cPanel TELL IT.** El TELL IT (`207.210.229.233` = `svgt446`) es el de
`operativai.com.mx` y es **otro servidor**. Son cuentas y máquinas distintas del mismo
proveedor.

- [x] El dominio ya existe en su cPanel y los buzones están creados
- [x] Registros de correo, todos a `72.249.60.221`: `mail`, `ftp`, `webmail`, `cpanel`,
      `autodiscover`; `MX` → `mail.orvia.tech`
- [x] **SPF** con `ip4:72.249.60.221` y los `include` de Neubox y MailChannels
- [ ] DMARC (opcional, pero recomendable una vez que el flujo de correo sea estable)
- [ ] Plan de transición del correo `@operativai.com.mx`: reenvío o convivencia

### Trampa 4 — asumir en qué servidor vive el correo

Costó **un día de correo rebotado**. El dueño mencionó "el TELL IT" y se asumió que
`orvia.tech` era un dominio adicional de ese cPanel. No lo era. El correo quedó apuntando
a `svgt446` cuando el buzón vivía en `svgt448`, y todo lo enviado a `@orvia.tech` rebotó
hasta que se corrigió.

> **Regla: la IP del servidor de correo se confirma en el cPanel** —barra lateral,
> "Dirección IP compartida"— **nunca se infiere** del nombre del cPanel, del servidor de
> otro dominio del mismo dueño, ni de la IP donde el dominio está estacionado.

El síntoma, además, es silencioso del lado de quien lo configura: el DNS se ve
perfectamente sano porque *es* sano. Lo que está mal es a qué máquina apunta.

---

## Riesgos vigentes

| Riesgo | Mitigación |
|---|---|
| Publicar la entidad fiscal equivocada | `privacidad.html` no se toca sin los datos confirmados |
| Dejar expirar `operativai.com.mx` | Mantenerlo vivo indefinidamente: sostiene los 308 |
| Perder `orvia.tech` por no renovar | Autorrenovación; vence 2027-11-04 |
| Proxy naranja en Cloudflare | Rompe el certificado de Vercel. Todo en **DNS only** |
| CNAME al apex en subdominios nuevos | Revisar siempre (trampa 1) |
| Elegir paleta sobre una muestra aislada | Probar sobre la página real (trampa 3) |
| Asumir en qué servidor vive un buzón | Confirmar la IP en el cPanel (trampa 4) |

## Los dos cPanel, que no son el mismo

Es la confusión que más cara salió. Son cuentas distintas en máquinas distintas:

| Dominio | cPanel | Servidor |
|---|---|---|
| `operativai.com.mx` | **TELL IT** | `207.210.229.233` = `svgt446.serverneubox.com.mx` |
| `orvia.tech` | el suyo propio, donde es dominio principal y único | `72.249.60.221` = `svgt448.serverneubox.com.mx` |

## Bitácora

| Fecha | Qué pasó |
|---|---|
| 2026-11-03 | Decisión del rebrand. Fase 1: zona, DNS y dominio en Vercel. |
| 2026-11-03 | Fases 2 y 3 (PR #14): rename completo, paleta grafito + lima, 308 desde el dominio viejo. **En producción.** |
| 2026-11-04 | Responsable del aviso de privacidad actualizado (PR #15). |
| 2026-11-04 | Correo de `orvia.tech` corregido: apuntaba al servidor equivocado y rebotaba. Más `webmail`, `cpanel`, `autodiscover` y SPF. |
