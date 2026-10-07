/* Shared shell for the seven completed static routes. */
(() => {
  const base = new URL('../', document.currentScript.src);
  const url = (path) => {
    const target = new URL(path, base);
    if (target.protocol === 'file:' && target.pathname.endsWith('/')) target.pathname += 'index.html';
    return target.href;
  };
  const routes = [
    { label: 'About', href: 'about/' },
    { label: 'How It Works', href: 'how-it-works/' },
    { label: 'Create', href: 'create/' },
    { label: 'Overcome', href: 'overcome/' },
    { label: 'Community', href: 'community/' },
    { label: 'Resources', href: 'resources/' },
    { label: 'Merchandise', href: 'merchandise/' },
    { label: 'Get Involved', href: 'get-involved/' },
  ];
  const joinHref = 'get-involved/';
  const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);
  const current = (href) => {
    const path = location.pathname.replace(/index\.html$/, '');
    const target = new URL(url(href)).pathname.replace(/index\.html$/, '');
    return path === target || (href === 'get-involved/' && path.startsWith(target));
  };
  const pathOf = href => new URL(href, location.href).pathname.replace(/index\.html$/, '').replace(/\/$/, '');
  const mainDestinations = new Set([...document.querySelectorAll('main a[href]')].map(link => pathOf(link.href)));
  const duplicate = href => mainDestinations.has(pathOf(url(href))) || pathOf(location.href) === pathOf(url(href));
  const navItems = () => routes.filter(({href}) => href !== joinHref && !duplicate(href)).map(({ label, href }) => `<li><a href="${escape(url(href))}"${current(href) ? ' aria-current="page"' : ''}>${label}</a></li>`).join('');
  const join = () => duplicate(joinHref) ? '' : `<a class="button button--primary site-join" href="${escape(url(joinHref))}">Join HTAFL</a>`;
  const socialLinks = () => [['instagram','Instagram','https://www.instagram.com/htaflco/'],['x-twitter','Twitter / X','https://x.com/htaflco'],['tiktok','TikTok','https://www.tiktok.com/@htaflco']].map(([icon,label,href]) => `<a class="social-icon" data-social="${icon}" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${label} @htaflco (opens in a new tab)" title="${label} @htaflco — opens in a new tab"><img src="${escape(url('assets/icons/social/'+icon+'.svg'))}" width="24" height="24" alt=""></a>`).join('');


  class SiteLogo extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `<a class="site-logo" href="${escape(url('index.html'))}" aria-label="HTAFL home"><img src="${escape(url('assets/htafl-wordmark.svg'))}" width="150" height="40" alt=""></a>`;
    }
  }

  class SiteHeader extends HTMLElement {
    connectedCallback() {
      if (this.controller) return;
      this.controller = new AbortController();
      const { signal } = this.controller;
      this.innerHTML = `<header class="site-header">
        <div class="container site-header__bar">
          <site-logo></site-logo>
          <nav class="site-nav site-nav--desktop" aria-label="Primary"><ul>${navItems()}</ul></nav>
          <div class="site-header__actions">${join()}
            <button class="button button--secondary site-menu-toggle" type="button" aria-expanded="false" aria-controls="site-mobile-menu" hidden>Menu</button>
          </div>
        </div>
        <dialog class="site-menu" id="site-mobile-menu" aria-labelledby="site-menu-title">
          <div class="site-menu__top"><h2 class="type-h3" id="site-menu-title">Explore HTAFL</h2>
            <button class="button button--secondary" type="button" data-menu-close autofocus>Close<span class="sr-only"> menu</span></button>
          </div>
          <nav class="site-nav site-nav--mobile" aria-label="Mobile primary"><ul>${navItems()}</ul></nav>
          ${join()}
          
        </dialog>
      </header>`;
      const dialog = this.querySelector('dialog');
      const trigger = this.querySelector('.site-menu-toggle');
      this.dialog = dialog;
      this.trigger = trigger;
      const desktop = matchMedia('(min-width: 75rem)');
      // If native dialogs are unavailable, keep the ordinary navigation visible.
      if (typeof dialog.showModal === 'function') {
        this.classList.add('site-header--enhanced');
        trigger.hidden = false;
        trigger.addEventListener('click', () => {
          this.scrollPosition = window.scrollY;
          this.previousScrollTop = document.body.style.getPropertyValue('--nav-scroll-top');
          document.body.style.setProperty('--nav-scroll-top', `-${this.scrollPosition}px`);
          document.body.classList.add('nav-is-open');
          dialog.showModal();
          trigger.setAttribute('aria-expanded', 'true');
        }, { signal });
        this.querySelector('[data-menu-close]').addEventListener('click', () => dialog.close(), { signal });
        // Native Escape/cancel closes the dialog and uses this same cleanup path.
        dialog.addEventListener('close', () => this.restorePage(), { signal });
        dialog.addEventListener('click', (event) => {
          if (event.target.closest('a[href]')) dialog.close();
          if (event.target === dialog) {
            const rect = dialog.getBoundingClientRect();
            if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
          }
        }, { signal });
        dialog.addEventListener('keydown', (event) => {
          if (event.key !== 'Tab') return;
          const items = [...dialog.querySelectorAll('a[href], button:not(:disabled)')];
          const first = items[0];
          const last = items[items.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault(); last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault(); first.focus();
          }
        }, { signal });
        desktop.addEventListener('change', () => { if (desktop.matches && dialog.open) dialog.close(); }, { signal });
      }
      const updateScroll = () => {
        if (!dialog.open) this.classList.toggle('is-scrolled', window.scrollY > 64);
      };
      window.addEventListener('scroll', updateScroll, { passive: true, signal });
      updateScroll();
    }
    restorePage() {
      if (this.trigger.getAttribute('aria-expanded') !== 'true') return;
      this.trigger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-is-open');
      if (this.previousScrollTop) document.body.style.setProperty('--nav-scroll-top', this.previousScrollTop);
      else document.body.style.removeProperty('--nav-scroll-top');
      window.scrollTo({ top: this.scrollPosition, behavior: 'instant' });
      const target = this.trigger.getClientRects().length ? this.trigger : this.querySelector('.site-logo');
      target.focus({ preventScroll: true });
    }
    disconnectedCallback() {
      if (this.dialog?.open) this.dialog.close();
      if (this.trigger) this.restorePage();
      this.controller?.abort();
      this.controller = null;
    }
  }

  class SiteFooter extends HTMLElement {
    connectedCallback() {
      const legal=[['privacy/','Privacy'],['accessibility/','Accessibility'],['community-guidelines/','Community Guidelines'],['credits/','Credits']].filter(([href]) => !duplicate(href)).map(([href,label]) => `<a href="${escape(url(href))}">${label}</a>`).join('');
      const email=document.querySelector('main a[href="mailto:htafl@africamail.com"]') ? '<p>htafl@africamail.com</p>' : '<a href="mailto:htafl@africamail.com">htafl@africamail.com</a>';
      this.innerHTML = `<footer class="site-footer"><div class="container"><div class="site-footer__grid"><div class="stack"><img class="footer-wordmark" src="${escape(url('assets/htafl-wordmark.svg'))}" width="180" height="48" alt="HTAFL"><p class="site-footer__statement">Hope. Talent. Art. Fashion. Life.</p></div><div class="stack">${email}<div class="social-links">${socialLinks()}</div></div></div><div class="site-footer__bottom"><p>© ${new Date().getFullYear()} HTAFL. All rights reserved.</p><div class="social-links">${legal}</div></div></div></footer>`;
    }
  }
  customElements.define('site-logo', SiteLogo);
  customElements.define('site-header', SiteHeader);
  customElements.define('site-footer', SiteFooter);
})();
