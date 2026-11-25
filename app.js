(() => {
  const body = document.body;
  const collapseButton = document.getElementById('collapseSidebar');
  const openMenu = document.getElementById('openMenu');
  const closeMenu = document.getElementById('closeMenu');
  const mobileSearchToggle = document.getElementById('mobileSearchToggle');
  const searchBox = document.querySelector('.search-box');
  const appShell = document.querySelector('.app-shell');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const search = document.getElementById('globalSearch');
  const searchEmpty = document.getElementById('searchEmpty');
  const searchable = [...document.querySelectorAll('[data-search]')];
  const navLinks = [...document.querySelectorAll('[data-section]')];

  function setDrawer(open) {
    if (!drawer || !backdrop) return;
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    drawer.inert = !open;
    appShell?.toggleAttribute('inert', open);
    openMenu?.setAttribute('aria-expanded', String(open));
    backdrop.hidden = !open;
    requestAnimationFrame(() => backdrop.classList.toggle('is-visible', open));
    body.classList.toggle('drawer-open', open);
    if (open) {
      setMobileSearch(false);
      closeMenu?.focus();
    } else {
      openMenu?.focus();
    }
  }

  function setMobileSearch(open) {
    searchBox?.classList.toggle('is-open', open);
    mobileSearchToggle?.setAttribute('aria-expanded', String(open));
    mobileSearchToggle?.setAttribute('aria-label', open ? 'Đóng tìm kiếm' : 'Mở tìm kiếm');
    if (open) search?.focus();
    else if (document.activeElement === search) search.blur();
  }

  openMenu?.addEventListener('click', () => setDrawer(true));
  mobileSearchToggle?.addEventListener('click', () => setMobileSearch(!searchBox?.classList.contains('is-open')));
  closeMenu?.addEventListener('click', () => setDrawer(false));
  backdrop?.addEventListener('click', () => setDrawer(false));
  drawer?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setDrawer(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && drawer?.classList.contains('is-open')) setDrawer(false);
    else if (event.key === 'Escape' && searchBox?.classList.contains('is-open')) {
      setMobileSearch(false);
      mobileSearchToggle?.focus();
    }
    if (event.key === 'Tab' && drawer?.classList.contains('is-open')) {
      const focusable = [...drawer.querySelectorAll('a[href], button:not([disabled])')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
      event.preventDefault();
      search?.focus();
    }
  });

  collapseButton?.addEventListener('click', () => {
    const collapsed = document.documentElement.classList.toggle('sidebar-collapsed');
    collapseButton.setAttribute('aria-expanded', String(!collapsed));
    collapseButton.setAttribute('aria-label', collapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng');
  });

  function filterContent(value) {
    const query = value.trim().toLocaleLowerCase('vi');
    let fieldMatches = 0;
    searchable.forEach(item => {
      const text = `${item.dataset.search || ''} ${item.textContent || ''}`.toLocaleLowerCase('vi');
      const match = !query || text.includes(query);
      item.hidden = !match;
      if (match && item.classList.contains('field-card')) fieldMatches += 1;
    });
    if (searchEmpty) searchEmpty.hidden = !query || fieldMatches > 0;
  }

  search?.addEventListener('input', event => filterContent(event.target.value));
  search?.addEventListener('search', event => filterContent(event.target.value));

  const sectionTargets = ['overview', 'fields', 'spaces', 'library']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  function setActiveSection(id) {
    navLinks.forEach(link => {
      const active = link.dataset.section === id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: '-18% 0px -62% 0px', threshold: [0, .1, .25, .5] });
    sectionTargets.forEach(section => observer.observe(section));
  }

  navLinks.forEach(link => link.addEventListener('click', () => {
    const id = link.dataset.section;
    if (id) setActiveSection(id);
  }));

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760 && drawer?.classList.contains('is-open')) setDrawer(false);
    if (window.innerWidth > 760 && searchBox?.classList.contains('is-open')) setMobileSearch(false);
  }, { passive: true });
})();
