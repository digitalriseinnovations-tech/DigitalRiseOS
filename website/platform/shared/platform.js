/* =============================================================
   DIGITAL RISE OS — PLATFORM SHARED JS
   platform/shared/platform.js

   Handles: sidebar, topbar, theme, localStorage, modals,
   side panels, toasts, and shared utilities.
   ============================================================= */

'use strict';

const DR = (() => {

  /* ── Theme ───────────────────────────────────────────── */
  const THEME_KEY = 'dr_theme';

  function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'light';
  }

  function setTheme(t) {
    localStorage.setItem(THEME_KEY, t);
    document.documentElement.setAttribute('data-theme', t);
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.innerHTML = t === 'dark'
        ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> Light`
        : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> Dark`;
    }
  }

  function toggleTheme() {
    setTheme(getTheme() === 'light' ? 'dark' : 'light');
  }

  /* ── localStorage wrapper ────────────────────────────── */
  const store = {
    get(key, fallback = null) {
      try {
        const v = localStorage.getItem(`dr_${key}`);
        return v ? JSON.parse(v) : fallback;
      } catch { return fallback; }
    },
    set(key, val) {
      try { localStorage.setItem(`dr_${key}`, JSON.stringify(val)); } catch {}
    },
    merge(key, updates) {
      const existing = this.get(key, {});
      this.set(key, { ...existing, ...updates });
    },
  };

  /* ── Path helpers ────────────────────────────────────── */
  function getCurrentPath() {
    return window.location.pathname;
  }

  function isPath(segment) {
    return getCurrentPath().includes(segment);
  }

  function getBusinessId() {
    const m = getCurrentPath().match(/\/businesses\/([^/]+)/);
    return m ? m[1] : null;
  }

  function getSubPage() {
    const parts = getCurrentPath().split('/').filter(Boolean);
    const last = parts[parts.length - 1];
    /* If last part is the business id, we're on business dashboard */
    const bizId = getBusinessId();
    return last === bizId ? 'overview' : last;
  }

  /* ── Icons (micro SVG) ───────────────────────────────── */
  const ICONS = {
    dashboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    businesses: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    ai:         `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
    knowledge:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    automations:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
    crm:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    conversations:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    reviews:    `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    settings:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    plus:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    back:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
    bell:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
    search:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    moon:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    sun:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    x:          `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    check:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    chevron:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
    menu:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
  };

  /* ── Sidebar render ──────────────────────────────────── */
  function renderSidebar() {
    const bizId  = getBusinessId();
    const sub    = getSubPage();
    const el     = document.getElementById('pSidebar');
    if (!el) return;

    /* Get business name from data */
    let bizName = 'Business';
    if (bizId && window.DR_DATA) {
      const biz = (window.DR_DATA.businesses || []).find(b => b.id === bizId);
      if (biz) bizName = biz.name;
    }

    /* Platform nav items */
    const platNav = [
      { label: 'Dashboard',   icon: 'dashboard',   href: '/platform/dashboard',   slug: 'dashboard' },
      { label: 'Businesses',  icon: 'businesses',  href: '/platform/businesses',  slug: 'businesses' },
    ];

    /* Business nav items */
    const bizNav = bizId ? [
      { label: 'Overview',      icon: 'dashboard',      href: `/platform/businesses/${bizId}`,                   slug: 'overview' },
      { label: 'AI Employees',  icon: 'ai',             href: `/platform/businesses/${bizId}/ai-employees`,      slug: 'ai-employees' },
      { label: 'Knowledge Base',icon: 'knowledge',      href: `/platform/businesses/${bizId}/knowledge-base`,    slug: 'knowledge-base' },
      { label: 'Automations',   icon: 'automations',    href: `/platform/businesses/${bizId}/automations`,       slug: 'automations' },
      { label: 'CRM',           icon: 'crm',            href: `/platform/businesses/${bizId}/crm`,              slug: 'crm' },
      { label: 'Conversations', icon: 'conversations',  href: `/platform/businesses/${bizId}/conversations`,     slug: 'conversations' },
      { label: 'Reviews',       icon: 'reviews',        href: `/platform/businesses/${bizId}/reviews`,           slug: 'reviews' },
      { label: 'Settings',      icon: 'settings',       href: `/platform/businesses/${bizId}/settings`,          slug: 'settings' },
    ] : [];

    function navItem(item) {
      const active = sub === item.slug || (item.slug === 'dashboard' && isPath('/dashboard'));
      return `<a href="${item.href}" class="sb-nav-item${active ? ' is-active' : ''}">
        <span class="sb-nav-ico">${ICONS[item.icon] || ''}</span>
        <span class="sb-nav-lbl">${item.label}</span>
      </a>`;
    }

    el.innerHTML = `
      <div class="sb-logo">
        <a href="/platform/dashboard" class="sb-logo-link">
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="url(#sbg)"/><path d="M10 22L16 10L22 22" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.5 17.5H19.5" stroke="white" stroke-width="2.5" stroke-linecap="round"/><defs><linearGradient id="sbg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stop-color="#7C3AED"/><stop offset="1" stop-color="#4F46E5"/></linearGradient></defs></svg>
          <div><div class="sb-logo-name">Digital Rise</div><div class="sb-logo-sub">OS Platform</div></div>
        </a>
      </div>

      <div class="sb-section">
        <div class="sb-section-label">Platform</div>
        ${platNav.map(navItem).join('')}
      </div>

      ${bizId ? `
      <div class="sb-divider"></div>
      <div class="sb-section">
        <div class="sb-section-label sb-biz-label">
          <span class="sb-biz-dot"></span>${bizName}
        </div>
        ${bizNav.map(navItem).join('')}
      </div>
      ` : ''}

      <div class="sb-footer">
        <a href="/platform/businesses/new" class="sb-add-btn">
          <span>${ICONS.plus}</span> Add Business
        </a>
      </div>`;
  }

  /* ── Topbar render ───────────────────────────────────── */
  function renderTopbar(opts = {}) {
    const el = document.getElementById('pTopbar');
    if (!el) return;

    const crumbs = opts.breadcrumbs || [];
    const bizId  = getBusinessId();

    const crumbsHtml = crumbs.map((c, i) => {
      const isLast = i === crumbs.length - 1;
      return isLast
        ? `<span class="tb-crumb tb-crumb--active">${c.label}</span>`
        : `<a href="${c.href || '#'}" class="tb-crumb">${c.label}</a><span class="tb-crumb-sep">/</span>`;
    }).join('');

    const theme = getTheme();

    el.innerHTML = `
      <div class="tb-left">
        <button class="tb-hamburger" id="tbHamburger" aria-label="Toggle sidebar">${ICONS.menu}</button>
        <nav class="tb-breadcrumbs" aria-label="Breadcrumb">${crumbsHtml}</nav>
      </div>
      <div class="tb-right">
        <button class="tb-icon-btn" aria-label="Search">${ICONS.search}</button>
        <button class="tb-icon-btn tb-notif" aria-label="Notifications">
          ${ICONS.bell}
          <span class="tb-notif-dot"></span>
        </button>
        <button class="tb-theme-btn" id="themeToggle" aria-label="Toggle theme" onclick="DR.toggleTheme()">
          ${theme === 'dark' ? ICONS.sun + ' Light' : ICONS.moon + ' Dark'}
        </button>
        <div class="tb-avatar" title="Account">DR</div>
      </div>`;

    /* Hamburger for mobile sidebar */
    document.getElementById('tbHamburger').addEventListener('click', () => {
      document.getElementById('pSidebar').classList.toggle('is-open');
    });
  }

  /* ── Modal ───────────────────────────────────────────── */
  function openModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  /* Close modal on backdrop click */
  document.addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.closest('.modal')?.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });

  /* Close modal on Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.is-open').forEach(m => {
        m.classList.remove('is-open');
        document.body.style.overflow = '';
      });
      document.querySelectorAll('.side-panel.is-open').forEach(p => {
        p.classList.remove('is-open');
        document.querySelector('.panel-overlay')?.classList.remove('is-active');
      });
    }
  });

  /* ── Side panel ──────────────────────────────────────── */
  function openPanel(id) {
    const panel   = document.getElementById(id);
    const overlay = document.querySelector('.panel-overlay');
    if (panel)   panel.classList.add('is-open');
    if (overlay) overlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closePanel(id) {
    const panel   = document.getElementById(id);
    const overlay = document.querySelector('.panel-overlay');
    if (panel)   panel.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  /* ── Toast notifications ─────────────────────────────── */
  let toastContainer;

  function showToast(msg, type = 'success') {
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
    const t = document.createElement('div');
    t.className = `toast toast--${type}`;
    const ico = type === 'success' ? ICONS.check : type === 'error' ? ICONS.x : ICONS.bell;
    t.innerHTML = `<span class="toast-ico">${ico}</span><span class="toast-msg">${msg}</span>`;
    toastContainer.appendChild(t);
    requestAnimationFrame(() => t.classList.add('is-visible'));
    setTimeout(() => {
      t.classList.remove('is-visible');
      setTimeout(() => t.remove(), 300);
    }, 3200);
  }

  /* ── Badge HTML ──────────────────────────────────────── */
  function badge(text, color) {
    return `<span class="badge badge--${color}">${text}</span>`;
  }

  /* ── Relative time ───────────────────────────────────── */
  function relTime(isoStr) {
    const diff = Date.now() - new Date(isoStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return `${m} min ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} hr ago`;
    return `${Math.floor(h / 24)} days ago`;
  }

  /* ── Number format ───────────────────────────────────── */
  function fmt(n) {
    return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n);
  }

  /* ── Toggle switch ───────────────────────────────────── */
  function initToggles() {
    document.querySelectorAll('.toggle-switch').forEach(sw => {
      sw.addEventListener('change', function() {
        const key  = this.dataset.key;
        const val  = this.checked;
        if (key) store.merge('toggles', { [key]: val });
      });
      const key = sw.dataset.key;
      if (key) {
        const saved = store.get('toggles', {})[key];
        if (saved !== undefined) sw.checked = saved;
      }
    });
  }

  /* ── Init ────────────────────────────────────────────── */
  function init(opts = {}) {
    /* Apply saved theme immediately */
    document.documentElement.setAttribute('data-theme', getTheme());

    /* Render nav */
    renderSidebar();
    renderTopbar(opts);

    /* Wire toggles */
    initToggles();

    /* Close panel overlay click */
    document.addEventListener('click', e => {
      if (e.target.classList.contains('panel-overlay')) {
        document.querySelectorAll('.side-panel.is-open').forEach(p => p.classList.remove('is-open'));
        e.target.classList.remove('is-active');
        document.body.style.overflow = '';
      }
    });
  }

  return {
    init, store, getTheme, setTheme, toggleTheme,
    openModal, closeModal, openPanel, closePanel,
    showToast, badge, relTime, fmt, ICONS,
    getBusinessId, getSubPage,
  };
})();
