(() => {
  const body = document.body;
  const root = document.documentElement;
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
  const preferencesToggle = document.getElementById('preferencesToggle');
  const preferencesPanel = document.getElementById('preferencesPanel');
  const languageSelect = document.getElementById('languageSelect');
  const themeSelect = document.getElementById('themeSelect');
  const searchable = [...document.querySelectorAll('[data-search]')];
  const navLinks = [...document.querySelectorAll('[data-section]')];

  const translations = {
    vi: {
      skipLink: 'Bỏ qua điều hướng',
      brandHome: 'SCIAVERSE: Trang tổng quan',
      projectInfo: 'Thông tin dự án',
      orbitDiagram: 'Sơ đồ quỹ đạo minh họa',
      orbitDescription: 'Một thiên thể trung tâm và các quỹ đạo elip được vẽ để minh họa chuyển động quỹ đạo, không theo tỉ lệ.',
      mainNavigation: 'Điều hướng chính',
      spacesLabel: 'Không gian',
      overview: 'Tổng quan',
      fields: 'Lĩnh vực',
      toolSpaces: 'Không gian công cụ',
      library: 'Thư viện',
      collapse: 'Thu gọn',
      expandSidebar: 'Mở rộng thanh điều hướng',
      collapseSidebar: 'Thu gọn thanh điều hướng',
      searchPlaceholder: 'Tìm kiếm lĩnh vực, học liệu...',
      openSearch: 'Mở tìm kiếm',
      closeSearch: 'Đóng tìm kiếm',
      openNavigation: 'Mở điều hướng',
      closeNavigation: 'Đóng điều hướng',
      preferences: 'Cài đặt',
      languageLabel: 'Ngôn ngữ',
      themeLabel: 'Giao diện',
      themeSystem: 'Theo thiết bị',
      themeDark: 'Tối',
      themeLight: 'Sáng',
      pageTitle: 'Không gian khoa học số<br>đa lĩnh vực.',
      startExploring: 'Bắt đầu khám phá',
      fieldsTitle: 'Khám phá theo lĩnh vực',
      earthEnvironment: 'Trái Đất &amp; môi trường',
      spaceAstronomy: 'Vũ trụ &amp; thiên văn',
      physics: 'Vật lí',
      chemistry: 'Hóa học',
      biology: 'Sinh học',
      mathComputerScience: 'Toán học &amp; tin học',
      searchEmpty: 'Không tìm thấy nội dung phù hợp.',
      spacesTitle: 'Không gian khoa học',
      scientificSimulation: 'Mô phỏng khoa học',
      virtualExperiments: 'Thực nghiệm ảo',
      scientificData: 'Dữ liệu khoa học',
      learningLibrary: 'Thư viện học liệu',
      copyright: '© 2026 SCIAVERSE. Bảo lưu mọi quyền.',
      mobileNavigation: 'Điều hướng trên điện thoại',
      navigation: 'Điều hướng',
      quickNavigation: 'Điều hướng nhanh'
    },
    en: {
      skipLink: 'Skip navigation',
      brandHome: 'SCIAVERSE: Overview',
      projectInfo: 'Project information',
      orbitDiagram: 'Illustrative orbital diagram',
      orbitDescription: 'A central body and elliptical paths illustrate orbital motion. The diagram is not to scale.',
      mainNavigation: 'Main navigation',
      spacesLabel: 'Spaces',
      overview: 'Overview',
      fields: 'Fields',
      toolSpaces: 'Science tools',
      library: 'Library',
      collapse: 'Collapse',
      expandSidebar: 'Expand navigation',
      collapseSidebar: 'Collapse navigation',
      searchPlaceholder: 'Search fields and learning resources...',
      openSearch: 'Open search',
      closeSearch: 'Close search',
      openNavigation: 'Open navigation',
      closeNavigation: 'Close navigation',
      preferences: 'Settings',
      languageLabel: 'Language',
      themeLabel: 'Appearance',
      themeSystem: 'Use device setting',
      themeDark: 'Dark',
      themeLight: 'Light',
      pageTitle: 'Digital science environment<br>across disciplines.',
      startExploring: 'Start exploring',
      fieldsTitle: 'Explore by field',
      earthEnvironment: 'Earth &amp; environment',
      spaceAstronomy: 'Space &amp; astronomy',
      physics: 'Physics',
      chemistry: 'Chemistry',
      biology: 'Biology',
      mathComputerScience: 'Mathematics &amp; computer science',
      searchEmpty: 'No matching content found.',
      spacesTitle: 'Science spaces',
      scientificSimulation: 'Scientific simulations',
      virtualExperiments: 'Virtual experiments',
      scientificData: 'Scientific data',
      learningLibrary: 'Learning library',
      copyright: '© 2026 SCIAVERSE. All rights reserved.',
      mobileNavigation: 'Mobile navigation',
      navigation: 'Navigation',
      quickNavigation: 'Quick navigation'
    }
  };

  let currentLanguage = 'vi';
  let themeChoice = 'dark';
  let systemThemeQuery = null;

  function readPreference(key, fallback) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch {
      return fallback;
    }
  }

  function savePreference(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // The interface still works when storage is unavailable.
    }
  }

  function applyLanguage(language) {
    currentLanguage = language === 'en' ? 'en' : 'vi';
    const dictionary = translations[currentLanguage];
    root.lang = currentLanguage;
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const value = dictionary[element.dataset.i18n];
      if (value !== undefined) {
        if (element.dataset.i18n === 'pageTitle') element.innerHTML = value;
        else element.innerHTML = value;
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const value = dictionary[element.dataset.i18nPlaceholder];
      if (value !== undefined) element.setAttribute('placeholder', value);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      const value = dictionary[element.dataset.i18nAria];
      if (value !== undefined) element.setAttribute('aria-label', value);
    });
    if (document.title) {
      document.title = currentLanguage === 'en'
        ? 'SCIAVERSE: Digital Science Environment'
        : 'SCIAVERSE: Không gian khoa học số';
    }
    const description = document.querySelector('meta[name="description"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const descriptionText = currentLanguage === 'en'
      ? 'SCIAVERSE: A multidisciplinary digital science environment.'
      : 'SCIAVERSE: Môi trường khoa học số đa lĩnh vực.';
    if (description) description.content = descriptionText;
    if (ogDescription) ogDescription.content = descriptionText;
    if (ogTitle) ogTitle.content = document.title;
    if (languageSelect) languageSelect.value = currentLanguage;
    if (mobileSearchToggle) {
      mobileSearchToggle.setAttribute('aria-label', searchBox?.classList.contains('is-open')
        ? dictionary.closeSearch : dictionary.openSearch);
    }
    if (openMenu) openMenu.setAttribute('aria-label', dictionary.openNavigation);
    if (closeMenu) closeMenu.setAttribute('aria-label', dictionary.closeNavigation);
    if (collapseButton) {
      const collapsed = root.classList.contains('sidebar-collapsed');
      collapseButton.setAttribute('aria-label', collapsed ? dictionary.expandSidebar : dictionary.collapseSidebar);
    }
    if (search) filterContent(search.value);
    savePreference('sciaverse-language', currentLanguage);
  }

  function applyTheme(choice) {
    themeChoice = ['system', 'light', 'dark'].includes(choice) ? choice : 'dark';
    const systemPrefersLight = systemThemeQuery?.matches ?? false;
    const resolved = themeChoice === 'system'
      ? (systemPrefersLight ? 'light' : 'dark')
      : themeChoice;
    root.dataset.theme = resolved;
    if (themeSelect) themeSelect.value = themeChoice;
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = resolved === 'light' ? '#f3f6f4' : '#10171b';
    savePreference('sciaverse-theme', themeChoice);
  }

  function setPreferences(open) {
    if (!preferencesPanel || !preferencesToggle) return;
    preferencesPanel.hidden = !open;
    preferencesPanel.classList.toggle('is-open', open);
    preferencesToggle.setAttribute('aria-expanded', String(open));
    if (open) {
      setMobileSearch(false);
      languageSelect?.focus();
    }
  }

  function setDrawer(open) {
    if (!drawer || !backdrop) return;
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    drawer.inert = !open;
    appShell?.toggleAttribute('inert', open);
    openMenu?.setAttribute('aria-expanded', String(open));
    openMenu?.setAttribute('aria-label', open
      ? translations[currentLanguage].closeNavigation
      : translations[currentLanguage].openNavigation);
    backdrop.hidden = !open;
    requestAnimationFrame(() => backdrop.classList.toggle('is-visible', open));
    body.classList.toggle('drawer-open', open);
    if (open) {
      setMobileSearch(false);
      setPreferences(false);
      closeMenu?.focus();
    } else if (window.innerWidth <= 760) {
      openMenu?.focus();
    } else {
      document.querySelector('.side-nav .nav-link')?.focus();
    }
  }

  function setMobileSearch(open) {
    searchBox?.classList.toggle('is-open', open);
    mobileSearchToggle?.setAttribute('aria-expanded', String(open));
    mobileSearchToggle?.setAttribute('aria-label', open
      ? translations[currentLanguage].closeSearch
      : translations[currentLanguage].openSearch);
    if (open) {
      setPreferences(false);
      search?.focus();
    } else if (document.activeElement === search) {
      search.blur();
    }
  }

  function filterContent(value) {
    const locale = currentLanguage === 'vi' ? 'vi' : 'en';
    const query = value.trim().toLocaleLowerCase(locale);
    let matches = 0;
    searchable.forEach(item => {
      const indexedText = currentLanguage === 'en'
        ? (item.dataset.searchEn || '')
        : (item.dataset.search || '');
      const text = `${indexedText} ${item.textContent || ''}`.toLocaleLowerCase(locale);
      const match = !query || text.includes(query);
      item.hidden = !match;
      if (match) matches += 1;
    });
    if (searchEmpty) searchEmpty.hidden = !query || matches > 0;
  }

  openMenu?.addEventListener('click', () => setDrawer(true));
  mobileSearchToggle?.addEventListener('click', () => setMobileSearch(!searchBox?.classList.contains('is-open')));
  closeMenu?.addEventListener('click', () => setDrawer(false));
  backdrop?.addEventListener('click', () => setDrawer(false));
  drawer?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setDrawer(false)));

  preferencesToggle?.addEventListener('click', () => {
    setPreferences(preferencesPanel?.hidden ?? true);
  });
  languageSelect?.addEventListener('change', event => applyLanguage(event.target.value));
  themeSelect?.addEventListener('change', event => applyTheme(event.target.value));
  document.addEventListener('pointerdown', event => {
    if (!preferencesPanel?.hidden
      && !preferencesPanel?.contains(event.target)
      && !preferencesToggle?.contains(event.target)) setPreferences(false);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && drawer?.classList.contains('is-open')) {
      setDrawer(false);
    } else if (event.key === 'Escape' && preferencesPanel && !preferencesPanel.hidden) {
      setPreferences(false);
      preferencesToggle?.focus();
    } else if (event.key === 'Escape' && searchBox?.classList.contains('is-open')) {
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
    if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
      event.preventDefault();
      if (window.innerWidth <= 760) setMobileSearch(true);
      else search?.focus();
    }
  });

  collapseButton?.addEventListener('click', () => {
    const collapsed = root.classList.toggle('sidebar-collapsed');
    const dictionary = translations[currentLanguage];
    collapseButton.setAttribute('aria-expanded', String(!collapsed));
    collapseButton.setAttribute('aria-label', collapsed ? dictionary.expandSidebar : dictionary.collapseSidebar);
  });

  search?.addEventListener('input', event => filterContent(event.target.value));
  search?.addEventListener('search', event => filterContent(event.target.value));

  const sectionTargets = ['overview', 'fields', 'spaces', 'library']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const motionRegions = [...document.querySelectorAll('[data-motion-region]')];
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)') || null;
  const orbitSystem = document.querySelector('[data-orbit-system]');
  const orbitBodies = orbitSystem ? [...orbitSystem.querySelectorAll('[data-orbit-node]')] : [];
  let orbitFrame = 0;
  let orbitStart = 0;
  let orbitElapsed = 0;

  function orbitPosition(body, elapsed) {
    const a = Number(body.dataset.a);
    const eccentricity = Number(body.dataset.e);
    const angle = Number(body.dataset.rotation) * Math.PI / 180;
    const period = Number(body.dataset.period);
    const phase = Number(body.dataset.phase || 0);
    const meanAnomaly = ((elapsed / period) * Math.PI * 2 + phase) % (Math.PI * 2);
    let eccentricAnomaly = meanAnomaly;
    for (let i = 0; i < 8; i += 1) {
      eccentricAnomaly -= (eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly) - meanAnomaly)
        / (1 - eccentricity * Math.cos(eccentricAnomaly));
    }
    const b = a * Math.sqrt(1 - eccentricity * eccentricity);
    const localX = a * (Math.cos(eccentricAnomaly) - eccentricity);
    const localY = b * Math.sin(eccentricAnomaly);
    const focusX = 210;
    const focusY = 135;
    const centerOffset = a * eccentricity;
    const x = focusX + centerOffset * Math.cos(angle)
      + localX * Math.cos(angle) - localY * Math.sin(angle);
    const y = focusY + centerOffset * Math.sin(angle)
      + localX * Math.sin(angle) + localY * Math.cos(angle);
    body.setAttribute('cx', x.toFixed(3));
    body.setAttribute('cy', y.toFixed(3));
  }

  function renderOrbit(timestamp) {
    if (!orbitStart) orbitStart = timestamp;
    const elapsed = orbitElapsed + (timestamp - orbitStart) / 1000;
    orbitBodies.forEach(body => orbitPosition(body, elapsed));
    orbitFrame = window.requestAnimationFrame(renderOrbit);
  }

  function syncMotion() {
    const motionAllowed = !reducedMotion?.matches && !document.hidden;
    motionRegions.forEach(region => {
      const active = motionAllowed && region.classList.contains('is-in-view');
      region.querySelector('.region-scene')?.classList.toggle('is-in-view', active);
    });
    const overviewActive = motionAllowed && document.getElementById('overview')?.classList.contains('is-in-view');
    if (overviewActive && orbitBodies.length && !orbitFrame) {
      orbitStart = 0;
      orbitFrame = window.requestAnimationFrame(renderOrbit);
    } else if ((!overviewActive || !motionAllowed) && orbitFrame) {
      orbitElapsed += orbitStart ? (performance.now() - orbitStart) / 1000 : 0;
      window.cancelAnimationFrame(orbitFrame);
      orbitFrame = 0;
      orbitStart = 0;
    }
  }

  if ('IntersectionObserver' in window && motionRegions.length) {
    const motionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('is-in-view', entry.isIntersecting));
      syncMotion();
    }, { rootMargin: '120px 0px 120px 0px', threshold: 0 });
    motionRegions.forEach(region => motionObserver.observe(region));
  } else {
    motionRegions.forEach(region => region.classList.add('is-in-view'));
    syncMotion();
  }
  reducedMotion?.addEventListener?.('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);

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

  systemThemeQuery = window.matchMedia?.('(prefers-color-scheme: light)') || null;
  systemThemeQuery?.addEventListener?.('change', () => {
    if (themeChoice === 'system') applyTheme('system');
  });

  const savedLanguage = readPreference('sciaverse-language', 'vi');
  const savedTheme = readPreference('sciaverse-theme', 'dark');
  applyLanguage(savedLanguage);
  applyTheme(savedTheme);
  if (preferencesPanel) preferencesPanel.hidden = true;

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760 && drawer?.classList.contains('is-open')) setDrawer(false);
    if (window.innerWidth > 760 && searchBox?.classList.contains('is-open')) setMobileSearch(false);
  }, { passive: true });
})();
