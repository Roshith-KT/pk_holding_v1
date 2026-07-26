(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const nav = header.querySelector('nav');
  let button = header.querySelector('.menu-button');
  if (!nav) return;

  if (!button) {
    button = document.createElement('button');
    button.className = 'menu-button';
    button.type = 'button';
    button.textContent = 'Menu';
    header.appendChild(button);
  }

  const backdrop = document.createElement('div');
  backdrop.className = 'mobile-menu-backdrop';
  backdrop.hidden = false;
  document.body.appendChild(backdrop);

  const setMenu = (open) => {
    document.body.classList.toggle('mobile-menu-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  button.type = 'button';
  button.setAttribute('aria-controls', 'mobile-navigation');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-label', 'Open menu');
  nav.id = nav.id || 'mobile-navigation';

  button.addEventListener('click', () => {
    setMenu(!document.body.classList.contains('mobile-menu-open'));
  });
  backdrop.addEventListener('click', () => setMenu(false));
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) setMenu(false);
  });
})();
