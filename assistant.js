/*
 * Asistente de IA del sitio — botón flotante + diálogo con el chat embebido.
 *
 * Lo cargan todas las páginas con <script src="/assistant.js" defer>. No depende
 * de nada externo: inyecta su propio CSS (sobre las variables del design system)
 * y su markup. El chat vive en un iframe cuyo `src` se asigna solo la primera
 * vez que se abre, para no pedirlo en cada visita y conservar la conversación
 * mientras el diálogo se abre y cierra.
 */
(function () {
  var CHAT_URL = 'https://operativai-chat-iframe.vws2rl.easypanel.host/embed';
  var WA_URL = 'https://wa.me/5213317586975?text=Hola%2C%20quiero%20probar%20el%20agente%20de%20IA.';
  var MOBILE = '(max-width: 700px)';

  var CSS = [
    '.ai-launcher { position: fixed; right: 20px; bottom: 20px; z-index: 200; display: inline-flex; align-items: center; gap: 10px; padding: 12px 16px 12px 12px; background: var(--brand-500, #1E5BB8); color: #fff; font-family: var(--font-body, system-ui, sans-serif); font-size: 14px; font-weight: 600; line-height: 1; border: 0; border-radius: 999px; box-shadow: 0 8px 24px rgba(11,18,32,0.22); cursor: pointer; }',
    '.ai-launcher:hover { background: var(--brand-700, #0E3C82); }',
    '.ai-launcher:focus-visible { outline: 3px solid rgba(30,91,184,0.4); outline-offset: 2px; }',
    '.ai-launcher svg { width: 22px; height: 22px; flex-shrink: 0; }',

    '.ai-overlay { position: fixed; inset: 0; z-index: 210; background: rgba(11,18,32,0.45); }',
    '.ai-dialog { position: fixed; right: 20px; bottom: 20px; z-index: 220; width: 400px; max-width: calc(100vw - 40px); height: min(680px, 100vh - 40px); display: flex; flex-direction: column; background: var(--ink-0, #fff); border-radius: var(--r-xl, 14px); box-shadow: 0 24px 64px rgba(11,18,32,0.28), 0 4px 12px rgba(11,18,32,0.12); overflow: hidden; font-family: var(--font-body, system-ui, sans-serif); }',
    '.ai-hidden { display: none !important; }',

    '.ai-head { display: flex; align-items: center; gap: 12px; height: 56px; padding: 0 8px 0 16px; background: var(--ink-900, #0B1220); color: #fff; flex-shrink: 0; }',
    '.ai-head-text { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; gap: 2px; }',
    '.ai-head-title { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; line-height: 1.2; white-space: nowrap; }',
    '.ai-dot { width: 8px; height: 8px; border-radius: 50%; background: #22C55E; box-shadow: 0 0 0 3px rgba(34,197,94,0.25); flex-shrink: 0; }',
    '.ai-head-sub { font-size: 12px; line-height: 1.2; color: rgba(255,255,255,0.7); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
    '.ai-wa { display: inline-flex; align-items: center; gap: 6px; padding: 7px 10px; font-size: 12px; font-weight: 600; line-height: 1; color: #fff; text-decoration: none; border: 1px solid rgba(255,255,255,0.25); border-radius: 999px; white-space: nowrap; }',
    '.ai-wa:hover { background: rgba(255,255,255,0.1); color: #fff; }',
    '.ai-wa svg { width: 14px; height: 14px; }',
    '.ai-close { width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; background: transparent; color: #fff; border: 0; border-radius: 999px; font-size: 22px; line-height: 1; cursor: pointer; flex-shrink: 0; }',
    '.ai-close:hover { background: rgba(255,255,255,0.12); }',
    '.ai-close:focus-visible, .ai-wa:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }',

    '.ai-body { position: relative; flex: 1; min-height: 0; background: var(--bg, #F4F6F9); }',
    '.ai-frame { display: block; width: 100%; height: 100%; border: 0; background: transparent; }',
    '.ai-loading { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 14px; color: var(--fg-muted, #4B5563); pointer-events: none; }',

    /* Entrada breve; se desactiva si el usuario prefiere menos movimiento. */
    '@keyframes ai-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }',
    '@keyframes ai-fade { from { opacity: 0; } to { opacity: 1; } }',
    '.ai-dialog.ai-anim { animation: ai-in 180ms ease-out; }',
    '.ai-overlay.ai-anim { animation: ai-fade 180ms ease-out; }',
    '@media (prefers-reduced-motion: reduce) { .ai-dialog.ai-anim, .ai-overlay.ai-anim { animation: none; } }',

    '@media ' + MOBILE + ' {',
    '  .ai-launcher span { display: none; }',
    '  .ai-launcher { padding: 12px; }',
    '  .ai-dialog { inset: 0; width: auto; max-width: none; height: auto; border-radius: 0; }',
    '  .ai-wa span { display: none; }',
    '  .ai-wa { padding: 8px; border-radius: 999px; }',
    '}'
  ].join('\n');

  var ICON_CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-8 8H8l-5 3 1.2-4.2A8 8 0 0 1 3 12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></svg>';
  var ICON_WA = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2m0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.54-3.7 8.24-8.23 8.24m4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.28"/></svg>';

  function init() {
    if (document.querySelector('.ai-launcher')) return; // ya está montado

    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    /* Launcher */
    var launcher = document.createElement('button');
    launcher.type = 'button';
    launcher.className = 'ai-launcher';
    launcher.setAttribute('aria-label', 'Abrir el asistente de IA de OperativAI');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-haspopup', 'dialog');
    launcher.innerHTML = ICON_CHAT + '<span>Asistente</span>';

    /* Overlay + diálogo */
    var overlay = document.createElement('div');
    overlay.className = 'ai-overlay ai-hidden';

    var dialog = document.createElement('div');
    dialog.className = 'ai-dialog ai-hidden';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-label', 'Asistente de IA de OperativAI');
    dialog.innerHTML =
      '<div class="ai-head">' +
        '<div class="ai-head-text">' +
          '<div class="ai-head-title"><span class="ai-dot" aria-hidden="true"></span>Asistente OperativAI</div>' +
          '<div class="ai-head-sub">Te contesta nuestro agente de IA</div>' +
        '</div>' +
        '<a class="ai-wa" href="' + WA_URL + '" target="_blank" rel="noopener" aria-label="Continuar en WhatsApp">' + ICON_WA + '<span>WhatsApp</span></a>' +
        '<button type="button" class="ai-close" aria-label="Cerrar">&times;</button>' +
      '</div>' +
      '<div class="ai-body">' +
        '<div class="ai-loading">Cargando el asistente…</div>' +
        '<iframe class="ai-frame" title="Chat con el asistente de IA de OperativAI" allow="clipboard-write; microphone" referrerpolicy="strict-origin-when-cross-origin"></iframe>' +
      '</div>';

    document.body.appendChild(launcher);
    document.body.appendChild(overlay);
    document.body.appendChild(dialog);

    var closeBtn = dialog.querySelector('.ai-close');
    var frame = dialog.querySelector('.ai-frame');
    var loading = dialog.querySelector('.ai-loading');
    var isOpen = false;
    var loaded = false;      // ya se asignó el src del iframe
    var prevOverflow = null; // overflow del body antes de abrir (solo si lo bloqueamos en móvil)

    frame.addEventListener('load', function () {
      if (frame.src) loading.classList.add('ai-hidden');
    });

    function open() {
      if (isOpen) return;
      isOpen = true;

      if (!loaded) {
        loaded = true;
        frame.src = CHAT_URL;
        if (window.gtag) window.gtag('event', 'open_assistant', { origen: location.pathname });
      }

      overlay.classList.remove('ai-hidden');
      dialog.classList.remove('ai-hidden');
      overlay.classList.add('ai-anim');
      dialog.classList.add('ai-anim');
      launcher.setAttribute('aria-expanded', 'true');

      if (window.matchMedia(MOBILE).matches) {
        prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      }
      closeBtn.focus();
    }

    function close() {
      if (!isOpen) return;
      isOpen = false;

      overlay.classList.add('ai-hidden');
      dialog.classList.add('ai-hidden');
      overlay.classList.remove('ai-anim');
      dialog.classList.remove('ai-anim');
      launcher.setAttribute('aria-expanded', 'false');
      if (prevOverflow !== null) {
        document.body.style.overflow = prevOverflow;
        prevOverflow = null;
      }
      launcher.focus();
    }

    launcher.addEventListener('click', function () { isOpen ? close() : open(); });
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (isOpen && e.key === 'Escape') { e.preventDefault(); close(); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
