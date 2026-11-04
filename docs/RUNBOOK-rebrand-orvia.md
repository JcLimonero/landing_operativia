# Runbook — rebrand de OperativAI a Orvia

- **Fecha:** 2026-11-03
- **Estado:** **fases 1, 2 y 3 completadas y en producción.** Faltan las fases 4 y 5.
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

### 0.2 — Datos fiscales de la nueva razón social → **PENDIENTE, y es el único con filo legal**

`privacidad.html` sigue declarando responsable a una **persona física**:
Fernando Ramón Parra Villanueva, con su RFC y domicilio. **No se tocó** porque el dueño
dijo que la razón social cambia pero todavía no dio los datos. No se inventan.

- [ ] Razón social exacta con régimen: `___________`
- [ ] RFC de la nueva entidad: `___________`
- [ ] Domicilio fiscal: `___________`
- [ ] ¿La entidad ya está constituida, o la persona física sigue operando bajo la marca
      Orvia? **Si es lo segundo, `privacidad.html` ya está correcto** y solo hacía falta
      el cambio de nombre comercial, que sí se hizo.

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
| A | `mail` | `207.210.229.233` | cPanel TELL IT |
| A | `ftp` | `207.210.229.233` | cPanel TELL IT |
| MX | `@` | `mail.orvia.tech` prio 0 | correo |

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

## Fase 5 — correo ⬜

Decisión aparte; no bloquea el sitio. El correo de `orvia.tech` apunta al cPanel
**TELL IT** de Neubox (`207.210.229.233` = `svgt446.serverneubox.com.mx`), el mismo de
`operativai.com.mx`.

- [ ] Dar de alta `orvia.tech` como dominio adicional **en el cPanel**. El DNS solo
      dirige el tráfico; si el dominio no existe ahí, el correo rebota.
- [ ] Crear los buzones
- [ ] Registros opcionales para webmail y configuración automática:
      `A webmail`, `A cpanel`, `A autodiscover` → `207.210.229.233`;
      `CNAME pop` / `imap` / `smtp` → `mail.orvia.tech`
- [ ] **SPF** antes de enviar el primer correo. Sin SPF, cae en spam desde el día uno.
- [ ] Plan de transición del correo `@operativai.com.mx`: reenvío o convivencia

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

## Bitácora

| Fecha | Qué pasó |
|---|---|
| 2026-11-03 | Decisión del rebrand. Fase 1: zona, DNS y dominio en Vercel. |
| 2026-11-03 | Fases 2 y 3 (PR #14): rename completo, paleta grafito + lima, 308 desde el dominio viejo. **En producción.** |
