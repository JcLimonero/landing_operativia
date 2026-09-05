/*
 * Analítica del sitio — Google Analytics 4.
 *
 * Para activarla, pega abajo el Measurement ID de tu propiedad
 * (Analytics → Administrar → Flujos de datos → tu flujo web). Es el único
 * cambio necesario: este archivo lo cargan las cuatro páginas.
 *
 * Mientras el ID esté vacío no se carga nada, no se piden scripts a Google
 * y no se instala ninguna cookie.
 */
var GA_MEASUREMENT_ID = '';

(function () {
  if (!GA_MEASUREMENT_ID) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
  document.head.appendChild(s);
})();

/** Solicitud enviada desde el formulario de contacto. */
window.trackLead = function (servicio) {
  if (window.gtag) window.gtag('event', 'generate_lead', { servicio: servicio || 'no especificado' });
};

/* Clic en cualquier CTA de WhatsApp: es la otra vía de conversión del sitio. */
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a[href^="https://wa.me/"]');
  if (a && window.gtag) window.gtag('event', 'contact_whatsapp', { origen: location.pathname });
});
