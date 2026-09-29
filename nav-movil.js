/*
 * Menú hamburguesa para móvil (≤790px).
 *
 * En anchos chicos las páginas ocultan los enlaces del nav del header. Este
 * script los recupera: agrega un botón hamburguesa al header y un panel que
 * clona los enlaces reales del `<header nav>` (el último, el CTA, va como botón
 * de ancho completo). Lo cargan las páginas con <script src="/nav-movil.js" defer>.
 * Sin dependencias: inyecta su propio CSS sobre las variables del design system.
 * Si la página no tiene `header nav` (404, privacidad, condiciones) no hace nada.
 */
(function () {
  var MOBILE = '(max-width: 790px)';

  var CSS = [
    '.nm-toggle { display: none; align-items: center; justify-content: center; width: 44px; height: 44px; margin: 0 -10px 0 0; padding: 0; background: none; color: var(--fg, #0B1220); border: 0; border-radius: var(--r-md, 8px); cursor: pointer; -webkit-tap-highlight-color: transparent; }',
    '.nm-toggle:focus-visible { outline: 3px solid rgba(30,91,184,0.4); outline-offset: 0; }',
    '.nm-toggle svg { display: block; width: 24px; height: 24px; }',
    '.nm-toggle line { transform-box: fill-box; transform-origin: center; transition: transform 180ms ease, opacity 120ms ease; }',
    '.nm-toggle[aria-expanded="true"] .nm-l1 { transform: translateY(6px) rotate(45deg); }',
    '.nm-toggle[aria-expanded="true"] .nm-l2 { opacity: 0; }',
    '.nm-toggle[aria-expanded="true"] .nm-l3 { transform: translateY(-6px) rotate(-45deg); }',

    '.nm-overlay { position: fixed; top: var(--nm-top, 0); right: 0; bottom: 0; left: 0; z-index: 150; background: rgba(11,18,32,0.4); }',
    '.nm-panel { position: fixed; top: var(--nm-top, 0); left: 0; right: 0; z-index: 160; box-sizing: border-box; max-height: calc(100vh - var(--nm-top, 0px)); max-height: calc(100dvh - var(--nm-top, 0px)); overflow-y: auto; overscroll-behavior: contain; padding: 4px 24px 24px; background: var(--bg, #F4F6F9); border-bottom: 1px solid var(--border, #E3E7ED); box-shadow: var(--shadow-lg, 0 16px 40px rgba(11,18,32,0.16)); font-family: var(--font-body, system-ui, sans-serif); }',
    '.nm-hidden { display: none !important; }',
    '.nm-link { display: flex; align-items: center; min-height: 44px; padding: 14px 0; color: var(--fg, #0B1220); font-size: 17px; font-weight: 500; line-height: 1.3; text-decoration: none; border-bottom: 1px solid var(--border, #E3E7ED); }',
    '.nm-link:hover { color: var(--brand-700, #0E3C82); }',
    '.nm-link:focus-visible, .nm-cta:focus-visible { outline: 3px solid rgba(30,91,184,0.4); outline-offset: 2px; }',
    '.nm-panel a.nm-cta { display: flex; align-items: center; justify-content: center; box-sizing: border-box; width: 100%; min-height: 48px; margin-top: 20px; padding: 14px; background: var(--ink-900, #0B1220); color: var(--ink-0, #fff); font-size: 16px; font-weight: 600; line-height: 1.2; text-decoration: none; border: 0; border-radius: var(--r-md, 8px); }',
    '.nm-panel a.nm-cta:hover { background: var(--brand-500, #1E5BB8); color: var(--ink-0, #fff); }',

    /* Entrada breve; se desactiva si el usuario prefiere menos movimiento. */
    '@keyframes nm-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }',
    '@keyframes nm-fade { from { opacity: 0; } to { opacity: 1; } }',
    '.nm-panel.nm-anim { animation: nm-in 160ms ease-out; }',
    '.nm-overlay.nm-anim { animation: nm-fade 160ms ease-out; }',
    '@media (prefers-reduced-motion: reduce) { .nm-panel.nm-anim, .nm-overlay.nm-anim { animation: none; } .nm-toggle line { transition: none; } }',

    /* En escritorio el panel nunca se pinta, aunque haya quedado abierto al ensanchar la ventana. */
    '@media (min-width: 791px) { .nm-panel, .nm-overlay { display: none !important; } }',

    /* En móvil el nav completo (enlaces + CTA) vive en el panel: logo a la izquierda, hamburguesa a la derecha. */
    '@media ' + MOBILE + ' {',
    '  .nm-toggle { display: inline-flex; }',
    '  header nav { display: none !important; }',
    '}'
  ].join('\n');

  var ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<line class="nm-l1" x1="4" y1="6" x2="20" y2="6"/>' +
      '<line class="nm-l2" x1="4" y1="12" x2="20" y2="12"/>' +
      '<line class="nm-l3" x1="4" y1="18" x2="20" y2="18"/>' +
    '</svg>';

  function mount() {
    var nav = null;    // el nav vigente del header
    var header = null;
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'nm-toggle';
    toggle.setAttribute('aria-label', 'Abrir menú');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'nm-panel');
    toggle.innerHTML = ICON;

    var overlay = document.createElement('div');
    overlay.className = 'nm-overlay nm-hidden';

    var panel = document.createElement('div');
    panel.id = 'nm-panel';
    panel.className = 'nm-panel nm-hidden';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', 'Menú');

    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    var mq = window.matchMedia(MOBILE);
    var isOpen = false;
    var prevOverflow = null; // overflow del body antes de abrir (solo si lo bloqueamos nosotros)

    /* Las páginas .dc.html repintan el header en el cliente: si reemplaza su markup,
       el botón se vuelve a colgar del nuevo contenedor (el que tiene logo + nav). */
    function attach() {
      var n = document.querySelector('header nav');
      if (!n || !n.parentElement) return;
      nav = n;
      header = n.closest('header');
      if (toggle.parentElement !== n.parentElement) n.parentElement.appendChild(toggle);
    }

    /* Clona los enlaces vigentes del nav; se rehace en cada apertura por si la página los re-renderiza. */
    function buildLinks() {
      var links = nav.querySelectorAll('a[href]');
      panel.textContent = '';
      Array.prototype.forEach.call(links, function (a, i) {
        var c = a.cloneNode(true);
        // Fuera clases y estilos de la página (p. ej. .nav-link, que se oculta en móvil).
        Array.prototype.slice.call(c.attributes).forEach(function (attr) {
          if (attr.name !== 'href' && attr.name !== 'target' && attr.name !== 'rel') c.removeAttribute(attr.name);
        });
        c.className = i === links.length - 1 ? 'nm-cta' : 'nm-link';
        panel.appendChild(c);
      });
    }

    function place() {
      if (!header || !header.isConnected) attach();
      var bottom = Math.max(0, Math.round(header.getBoundingClientRect().bottom));
      document.documentElement.style.setProperty('--nm-top', bottom + 'px');
    }

    function focusables() {
      return [toggle].concat(Array.prototype.slice.call(panel.querySelectorAll('a[href]')));
    }

    function open() {
      if (isOpen) return;
      attach();
      isOpen = true;
      buildLinks();
      place();
      overlay.classList.remove('nm-hidden');
      panel.classList.remove('nm-hidden');
      overlay.classList.add('nm-anim');
      panel.classList.add('nm-anim');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Cerrar menú');
      prevOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      var first = panel.querySelector('a');
      if (first) first.focus();
    }

    function close(returnFocus) {
      if (!isOpen) return;
      isOpen = false;
      overlay.classList.add('nm-hidden');
      panel.classList.add('nm-hidden');
      overlay.classList.remove('nm-anim');
      panel.classList.remove('nm-anim');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú');
      if (prevOverflow !== null) {
        document.documentElement.style.overflow = prevOverflow;
        prevOverflow = null;
      }
      if (returnFocus !== false) toggle.focus();
    }

    toggle.addEventListener('click', function () { isOpen ? close() : open(); });
    overlay.addEventListener('click', function () { close(); });
    // Cualquier enlace cierra el panel (los anclas #faq no recargan la página).
    panel.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (!isOpen) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      // El diálogo es modal: el foco da la vuelta entre el botón y los enlaces.
      var f = focusables();
      if (!f.length) return;
      e.preventDefault();
      var i = f.indexOf(document.activeElement);
      if (i === -1) { f[e.shiftKey ? f.length - 1 : 0].focus(); return; }
      f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    });

    // Si el asistente de IA se abre, cede el bloqueo de scroll antes de que él guarde el suyo.
    document.addEventListener('click', function (e) {
      if (isOpen && e.target.closest && e.target.closest('.ai-launcher')) close(false);
    }, true);

    // Al pasar a escritorio con el panel abierto, se cierra solo.
    function onChange() {
      if (!mq.matches) close(false);
    }
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);

    // El header puede cambiar de alto (rotación, fuentes): reubica el panel mientras está abierto;
    // y si el viewport ya es de escritorio, lo cierra.
    window.addEventListener('resize', function () {
      if (!isOpen) return;
      if (!mq.matches) close(false); // respaldo del listener de matchMedia
      else place();
    });

    attach();
    return { toggle: toggle, attach: attach };
  }

  function init() {
    var ui = null;
    function sync() {
      if (!ui) {
        if (document.querySelector('header nav')) ui = mount();
      } else if (!ui.toggle.isConnected) {
        ui.attach();
      }
    }
    sync();
    if (!window.MutationObserver) return;
    // El header puede pintarse después de DOMContentLoaded o repintarse (.dc.html): se vigila.
    // Sin `header nav` (404, privacidad) deja de mirar a los pocos segundos.
    var obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { childList: true, subtree: true });
    if (!ui) setTimeout(function () { if (!ui) obs.disconnect(); }, 8000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
