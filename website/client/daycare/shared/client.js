/* ============================================================
   DIGITAL RISE — DAYCARE OS CLIENT JS
   client/daycare/shared/client.js
   ============================================================ */

'use strict';

const CL = (() => {

  /* ── Theme ─────────────────────────────────────────── */
  const THEME_KEY = 'dc_theme';

  function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'light';
  }

  function setTheme(t) {
    localStorage.setItem(THEME_KEY, t);
    document.documentElement.setAttribute('data-theme', t);
    _updateThemeBtn(t);
  }

  function toggleTheme() {
    setTheme(getTheme() === 'light' ? 'dark' : 'light');
  }

  function _updateThemeBtn(t) {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.innerHTML = t === 'dark'
      ? `${ICONS.sun} Light`
      : `${ICONS.moon} Dark`;
  }

  /* ── Store ──────────────────────────────────────────── */
  const store = {
    get(key, fallback = null) {
      try {
        const v = localStorage.getItem(`dc_${key}`);
        return v !== null ? JSON.parse(v) : fallback;
      } catch { return fallback; }
    },
    set(key, val) {
      try { localStorage.setItem(`dc_${key}`, JSON.stringify(val)); } catch {}
    },
  };

  /* ── Icons ──────────────────────────────────────────── */
  const ICONS = {
    dashboard:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    admissions: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    children:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    staff:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/></svg>`,
    attendance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    reports:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    activities: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    messages:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    tours:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    ai:         `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
    knowledge:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    automations:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
    reviews:    `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    calendar:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    billing:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
    settings:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    x:          `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    check:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    bell:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
    search:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    moon:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    sun:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    menu:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
    plus:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    chevron:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
    edit:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    trash:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
    send:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
    download:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
    upload:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
    star:       `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    star_o:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    user:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    logout:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
    help:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  };

  /* ── Role system ────────────────────────────────────── */
  const ROLE_KEY = 'dc_role';
  const ROLES = {
    manager: { label: 'Manager', color: '#7C3AED', bg: '#F3F0FF' },
    staff:   { label: 'Teacher / Staff', color: '#16A34A', bg: '#F0FDF4' },
  };

  function getRole() {
    return localStorage.getItem(ROLE_KEY) || 'manager';
  }

  function setRole(role) {
    localStorage.setItem(ROLE_KEY, role);
    window.location.reload();
  }

  /* Pages staff cannot access */
  function accessGuard() {
    const role = getRole();
    if (role === 'manager') return; // full access
    const slug = currentSlug();
    const staffBlocked = ['billing','admissions','automations','knowledge-base','reviews','ai-employee','settings'];
    if (staffBlocked.includes(slug)) {
      const content = document.querySelector('.cl-content') || document.querySelector('main');
      if (content) {
        content.innerHTML = '<div style="text-align:center;padding:80px 24px"><div style="font-size:3rem;margin-bottom:16px">🔒</div>' +
          '<div style="font-size:1.25rem;font-weight:700;color:var(--t1);margin-bottom:8px">Access Restricted</div>' +
          '<div style="font-size:.875rem;color:var(--t3);max-width:380px;margin:0 auto 24px">This section is only available to managers and administrators. Contact your manager for access.</div>' +
          '<a href="/client/daycare/dashboard" class="btn btn--primary">Back to Dashboard</a></div>';
      }
    }
  }

  /* ── Nav structure ──────────────────────────────────── */
  /* roles: which roles can see this item. 'all' = everyone */
  const NAV = [
    { section: 'Overview' },
    { label: 'Dashboard',      icon: 'dashboard',  href: '/client/daycare/dashboard',      slug: 'dashboard',       roles: 'all' },
    { section: 'Operations' },
    { label: 'Children',       icon: 'children',   href: '/client/daycare/children',       slug: 'children',        roles: 'all' },
    { label: 'Staff',          icon: 'staff',      href: '/client/daycare/staff',          slug: 'staff',           roles: ['manager'] },
    { label: 'Attendance',     icon: 'attendance', href: '/client/daycare/attendance',     slug: 'attendance',      roles: 'all' },
    { label: 'Daily Reports',  icon: 'reports',    href: '/client/daycare/daily-reports',  slug: 'daily-reports',   roles: 'all' },
    { label: 'Activities',     icon: 'activities', href: '/client/daycare/activities',     slug: 'activities',      roles: 'all' },
    { section: 'Families' },
    { label: 'Admissions',     icon: 'admissions', href: '/client/daycare/admissions',     slug: 'admissions',      roles: ['manager'], badge: '5' },
    { label: 'Parent Messages',icon: 'messages',   href: '/client/daycare/parent-messages',slug: 'parent-messages', roles: 'all',        badge: '3' },
    { label: 'Tours',          icon: 'tours',      href: '/client/daycare/tours',          slug: 'tours',           roles: 'all' },
    { section: 'AI & Automation', roles: ['manager'] },
    { label: 'AI Employee',    icon: 'ai',         href: '/client/daycare/ai-employee',    slug: 'ai-employee',     roles: ['manager'] },
    { label: 'Knowledge Base', icon: 'knowledge',  href: '/client/daycare/knowledge-base', slug: 'knowledge-base',  roles: ['manager'] },
    { label: 'Automations',    icon: 'automations',href: '/client/daycare/automations',    slug: 'automations',     roles: ['manager'] },
    { label: 'Reviews',        icon: 'reviews',    href: '/client/daycare/reviews',        slug: 'reviews',         roles: ['manager'] },
    { section: 'Admin', roles: ['manager'] },
    { label: 'Calendar',       icon: 'calendar',   href: '/client/daycare/calendar',       slug: 'calendar',        roles: ['manager'] },
    { label: 'Billing',        icon: 'billing',    href: '/client/daycare/billing',        slug: 'billing',         roles: ['manager'] },
    { label: 'Settings',       icon: 'settings',   href: '/client/daycare/settings',       slug: 'settings',        roles: ['manager'] },
  ];

  /* ── Current page detection ─────────────────────────── */
  function currentSlug() {
    const parts = window.location.pathname.split('/').filter(Boolean);
    return parts[parts.length - 1] || 'dashboard';
  }

  /* ── Sidebar render ─────────────────────────────────── */
  function renderSidebar() {
    const el = document.getElementById('clSidebar');
    if (!el) return;
    const slug = currentSlug();
    const role = getRole();

    function canSee(item) {
      if (!item.roles || item.roles === 'all') return true;
      if (Array.isArray(item.roles)) return item.roles.includes(role);
      return true;
    }

    let navHtml = '';
    let pendingSection = null;
    NAV.forEach(item => {
      if (item.section) {
        pendingSection = item;
        return;
      }
      if (!canSee(item)) return;
      if (pendingSection) {
        if (!canSee(pendingSection)) { pendingSection = null; return; }
        navHtml += `<div class="sb-section"><div class="sb-section-label">${pendingSection.section}</div>`;
        pendingSection = null;
      }
      const active = slug === item.slug;
      const badge  = item.badge ? `<span class="sb-nav-badge">${item.badge}</span>` : '';
      navHtml += `<a href="${item.href}" class="sb-nav-item${active ? ' is-active' : ''}">
        <span class="sb-nav-ico">${ICONS[item.icon] || ''}</span>
        <span class="sb-nav-lbl">${item.label}</span>
        ${badge}
      </a>`;
    });
    navHtml += '</div>';

    el.innerHTML = `
      <div class="sb-logo">
        <a href="/client/daycare/dashboard" class="sb-logo-link">
          <div class="sb-logo-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 0 1 8 0v2"/><circle cx="18" cy="18" r="3"/><line x1="18" y1="15" x2="18" y2="18"/><line x1="18" y1="18" x2="21" y2="18"/></svg>
          </div>
          <div>
            <div class="sb-logo-name">Sunshine Nursery</div>
            <div class="sb-logo-sub">Daycare OS</div>
          </div>
        </a>
      </div>
      <div class="sb-nav-wrap">${navHtml}</div>
      <div class="sb-footer">
        <div class="sb-ai-status">
          <div class="sb-ai-dot"></div>
          <div class="sb-ai-info">
            <div class="sb-ai-text">AI Employee Online</div>
            <div class="sb-ai-sub">Ava · Responding in 8s avg</div>
          </div>
        </div>
      </div>`;
  }

  /* ── Topbar render ──────────────────────────────────── */
  function renderTopbar(opts = {}) {
    const el = document.getElementById('clTopbar');
    if (!el) return;
    const theme = getTheme();

    const _isManagerRole = getRole() === 'manager';
    const _rolePanel = _isManagerRole
      ? '<div style="padding:8px 16px">' +
        '<div style="font-size:.625rem;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px">Switch Role (Demo)</div>' +
        '<div style="display:flex;gap:6px">' +
        '<button onclick="CL.setRole(\'manager\')" style="flex:1;padding:6px 8px;border-radius:7px;border:1.5px solid #7C3AED;background:#F3F0FF;color:#7C3AED;font-size:.6875rem;font-weight:700;cursor:pointer">👔 Manager</button>' +
        '<button onclick="CL.setRole(\'staff\')" style="flex:1;padding:6px 8px;border-radius:7px;border:1.5px solid var(--border);background:var(--card-bg);color:var(--t3);font-size:.6875rem;font-weight:700;cursor:pointer">👩‍🏫 Teacher</button>' +
        '</div></div>'
      : '<div style="padding:8px 16px"><div style="background:#F0FDF4;border-radius:8px;padding:8px 10px">' +
        '<div style="font-size:.75rem;color:#16A34A;font-weight:700">👩‍🏫 Teacher / Staff</div>' +
        '<div style="font-size:.625rem;color:var(--t3);margin-top:2px">Role assigned by your administrator</div>' +
        '</div>' +
        '<div style="padding-top:4px"><button onclick="CL._adminPinAccess()" style="font-size:.5625rem;color:var(--t4);background:none;border:none;cursor:pointer;text-decoration:underline">Admin access</button></div></div>';

    el.innerHTML = `
      <div class="tb-left">
        <button class="tb-hamburger" id="tbBurger" aria-label="Toggle sidebar">${ICONS.menu}</button>
        <div class="tb-nursery">
          <div class="av av-sm av--purple" style="border-radius:7px;font-size:.625rem;width:28px;height:28px">SN</div>
          <div class="tb-nursery-name">Sunshine Nursery</div>
          <div class="tb-ai-badge"><div class="tb-ai-badge-dot"></div>AI Online</div>
        </div>
      </div>
      <div class="tb-right">
        <div class="tb-search">
          <div class="tb-search-ico">${ICONS.search}</div>
          <input class="tb-search-input" type="text" id="tbSearchInput" placeholder="Search children, staff…" aria-label="Search">
          <div class="tb-search-results" id="tbSearchResults"></div>
        </div>
        <div class="tb-notif-wrap" id="tbNotifWrap">
          <button class="tb-icon-btn" id="tbNotifBtn" aria-label="Notifications" onclick="CL._toggleNotif()">
            ${ICONS.bell}
            <span class="tb-notif-dot"></span>
          </button>
          <div class="tb-dropdown tb-notif-panel" id="tbNotifPanel">
            <div class="tb-dd-header">
              <span class="tb-dd-title">Notifications</span>
              <button class="tb-dd-clear" onclick="CL._clearNotifs()">Mark all read</button>
            </div>
            <div class="tb-notif-list" id="tbNotifList"></div>
          </div>
        </div>
        <button class="tb-theme-btn" id="themeToggle" aria-label="Toggle theme" onclick="CL.toggleTheme()">
          ${theme === 'dark' ? ICONS.sun + ' Light' : ICONS.moon + ' Dark'}
        </button>
        <div class="tb-user-wrap" id="tbUserWrap">
          <div class="tb-avatar" id="tbAvatar" onclick="CL._toggleUserMenu()" title="David Kim — Owner">DK</div>
          <div class="tb-dropdown tb-user-menu" id="tbUserMenu">
            <div class="tb-user-info">
              <div class="tb-user-av">DK</div>
              <div>
                <div class="tb-user-name">David Kim</div>
                <div class="tb-user-role" id="tbUserRoleLabel">${ROLES[getRole()]?.label || 'Manager'} · Sunshine Nursery</div>
              </div>
            </div>
            ${_rolePanel}
            <div class="tb-dd-divider"></div>
            <a href="/client/daycare/settings" class="tb-dd-item">${ICONS.user} My Profile</a>
            <a href="/client/daycare/settings" class="tb-dd-item">${ICONS.settings} Settings</a>
            <div class="tb-dd-divider"></div>
            <button class="tb-dd-item tb-dd-item--danger" onclick="CL.logout()">${ICONS.logout} Sign Out</button>
          </div>
        </div>
      </div>`;

    // Sidebar overlay for mobile
    if (!document.getElementById('sbOverlay')) {
      const ov = document.createElement('div');
      ov.id = 'sbOverlay';
      ov.className = 'sb-overlay';
      ov.addEventListener('click', _closeSidebar);
      document.body.appendChild(ov);
    }

    document.getElementById('tbBurger')?.addEventListener('click', () => {
      const open = document.getElementById('clSidebar')?.classList.toggle('is-open');
      document.getElementById('sbOverlay')?.classList.toggle('is-active', open);
    });

    // Mobile bottom nav
    if (!document.getElementById('mobileBottomNav')) {
      const role = getRole();
      const mobileNavItems = [
        { icon: '📊', label: 'Dashboard', href: '/client/daycare/dashboard', slug: 'dashboard' },
        { icon: '👶', label: 'Children',  href: '/client/daycare/children',  slug: 'children' },
        { icon: '✅', label: 'Attendance',href: '/client/daycare/attendance',slug: 'attendance' },
        { icon: '📝', label: 'Reports',   href: '/client/daycare/daily-reports',slug: 'daily-reports' },
        { icon: role==='manager'?'💰':'💬', label: role==='manager'?'Billing':'Messages',
          href: role==='manager'?'/client/daycare/billing':'/client/daycare/parent-messages',
          slug: role==='manager'?'billing':'parent-messages' },
      ];
      const slug = currentSlug();
      const bn = document.createElement('nav');
      bn.id = 'mobileBottomNav';
      bn.className = 'mobile-bottom-nav';
      bn.innerHTML = mobileNavItems.map(it =>
        `<a href="${it.href}" class="mbn-item${slug===it.slug?' is-active':''}">
          <span class="mbn-icon">${it.icon}</span>
          <span class="mbn-label">${it.label}</span>
        </a>`
      ).join('');
      document.body.appendChild(bn);
    }

    // Notifications data
    _renderNotifs();

    // Live search
    const searchInput = document.getElementById('tbSearchInput');
    const searchResults = document.getElementById('tbSearchResults');
    if (searchInput && searchResults) {
      searchInput.addEventListener('input', e => {
        const q = e.target.value.trim().toLowerCase();
        if (!q || q.length < 2) { searchResults.style.display = 'none'; return; }
        const pages = [
          { label: 'Dashboard',        href: '/client/daycare/dashboard',      icon: '📊' },
          { label: 'Children',         href: '/client/daycare/children',       icon: '👶' },
          { label: 'Staff',            href: '/client/daycare/staff',          icon: '👩‍🏫' },
          { label: 'Attendance',       href: '/client/daycare/attendance',     icon: '✅' },
          { label: 'Daily Reports',    href: '/client/daycare/daily-reports',  icon: '📝' },
          { label: 'Activities',       href: '/client/daycare/activities',     icon: '🎨' },
          { label: 'Admissions',       href: '/client/daycare/admissions',     icon: '📋' },
          { label: 'Parent Messages',  href: '/client/daycare/parent-messages',icon: '💬' },
          { label: 'Tours',            href: '/client/daycare/tours',          icon: '📅' },
          { label: 'AI Employee',      href: '/client/daycare/ai-employee',    icon: '🤖' },
          { label: 'Billing',          href: '/client/daycare/billing',        icon: '💰' },
          { label: 'Settings',         href: '/client/daycare/settings',       icon: '⚙️' },
          { label: 'Calendar',         href: '/client/daycare/calendar',       icon: '🗓' },
          { label: 'Reviews',          href: '/client/daycare/reviews',        icon: '⭐' },
        ];
        let results = pages.filter(p => p.label.toLowerCase().includes(q));
        if (window.DC?.children) {
          window.DC.children.filter(c => c.name.toLowerCase().includes(q)).forEach(c => {
            results.push({ label: c.name, href: '/client/daycare/children', icon: '👶', sub: c.room });
          });
        }
        if (!results.length) { searchResults.style.display = 'none'; return; }
        searchResults.innerHTML = results.slice(0, 6).map(r =>
          `<a href="${r.href}" class="tb-search-result-item">
            <span class="tb-sri-ico">${r.icon}</span>
            <span class="tb-sri-lbl">${r.label}</span>
            ${r.sub ? `<span class="tb-sri-sub">${r.sub}</span>` : ''}
          </a>`
        ).join('');
        searchResults.style.display = 'block';
      });
      searchInput.addEventListener('blur', () => setTimeout(() => { searchResults.style.display = 'none'; }, 200));
      searchInput.addEventListener('focus', e => { if (e.target.value.length >= 2) searchResults.style.display = 'block'; });
    }

    // Close dropdowns on outside click
    document.addEventListener('click', _closeDropdownsOutside);
  }

  /* ── Notifications ──────────────────────────────────── */
  const _notifData = [
    { ic:'💬', txt:'Rachel Wilson: "Is Noah feeling better today?"', time:'2m ago', unread:true },
    { ic:'📋', txt:'New enquiry from Mehta family — 2 year old', time:'18m ago', unread:true },
    { ic:'📅', txt:'Tour confirmed: Chen family at 2:00 PM today', time:'1h ago', unread:true },
    { ic:'⭐', txt:'New 5-star Google review received', time:'2h ago', unread:false },
    { ic:'💰', txt:'Invoice #0041 overdue — $1,150 from Luca Rossi', time:'3h ago', unread:false },
  ];

  function _renderNotifs() {
    const el = document.getElementById('tbNotifList');
    if (!el) return;
    el.innerHTML = _notifData.map(n => `
      <div class="tb-notif-item${n.unread ? ' is-unread' : ''}">
        <div class="tb-ni-ico">${n.ic}</div>
        <div class="tb-ni-body">
          <div class="tb-ni-txt">${n.txt}</div>
          <div class="tb-ni-time">${n.time}</div>
        </div>
        ${n.unread ? '<div class="tb-ni-dot"></div>' : ''}
      </div>`).join('');
  }

  function _toggleNotif() {
    const panel = document.getElementById('tbNotifPanel');
    const userMenu = document.getElementById('tbUserMenu');
    userMenu?.classList.remove('is-open');
    panel?.classList.toggle('is-open');
  }

  function _clearNotifs() {
    _notifData.forEach(n => n.unread = false);
    _renderNotifs();
    const dot = document.querySelector('.tb-notif-dot');
    if (dot) dot.style.display = 'none';
  }

  function _toggleUserMenu() {
    const menu = document.getElementById('tbUserMenu');
    const notifPanel = document.getElementById('tbNotifPanel');
    notifPanel?.classList.remove('is-open');
    menu?.classList.toggle('is-open');
  }

  function _closeSidebar() {
    document.getElementById('clSidebar')?.classList.remove('is-open');
    document.getElementById('sbOverlay')?.classList.remove('is-active');
  }

  function _closeDropdownsOutside(e) {
    const notifWrap = document.getElementById('tbNotifWrap');
    const userWrap  = document.getElementById('tbUserWrap');
    if (notifWrap && !notifWrap.contains(e.target)) {
      document.getElementById('tbNotifPanel')?.classList.remove('is-open');
    }
    if (userWrap && !userWrap.contains(e.target)) {
      document.getElementById('tbUserMenu')?.classList.remove('is-open');
    }
  }

  /* ── Admin PIN access (demo mode) ──────────────────── */
  function _adminPinAccess() {
    var pin = prompt('Enter admin PIN to switch to Manager role:');
    if (pin === '1234') {
      setRole('manager');
    } else if (pin !== null) {
      showToast('Incorrect PIN. Contact your administrator.', 'error');
    }
  }

  /* ── Logout ─────────────────────────────────────────── */
  function logout() {
    if (!confirm('Sign out of Daycare OS?')) return;
    localStorage.removeItem(THEME_KEY);
    localStorage.removeItem('dc_theme');
    showToast('Signed out successfully', 'success');
    setTimeout(() => { window.location.href = '/'; }, 800);
  }

  /* ── Tabs ───────────────────────────────────────────── */
  function initTabs(containerSelector, onChange) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    const tabs    = container.querySelectorAll('[data-tab]');
    const panels  = document.querySelectorAll('[data-tab-panel]');

    function activateTab(key) {
      tabs.forEach(t => t.classList.toggle('is-active', t.dataset.tab === key));
      panels.forEach(p => {
        const show = p.dataset.tabPanel === key;
        p.style.display = show ? 'block' : 'none';
      });
      if (onChange) onChange(key);
    }

    tabs.forEach(t => t.addEventListener('click', () => activateTab(t.dataset.tab)));
    const first = tabs[0];
    if (first) activateTab(first.dataset.tab);
  }

  /* ── Modal ──────────────────────────────────────────── */
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

  /* ── Panel ──────────────────────────────────────────── */
  function openPanel(id) {
    const panel   = document.getElementById(id);
    const overlay = document.getElementById('panelOverlay');
    panel?.classList.add('is-open');
    overlay?.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closePanel(id) {
    const panel   = document.getElementById(id);
    const overlay = document.getElementById('panelOverlay');
    panel?.classList.remove('is-open');
    overlay?.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  /* ── Toast ──────────────────────────────────────────── */
  let _toastWrap;

  function showToast(msg, type = 'success') {
    if (!_toastWrap) {
      _toastWrap = document.createElement('div');
      _toastWrap.className = 'toast-container';
      document.body.appendChild(_toastWrap);
    }
    const ico = type === 'success' ? ICONS.check : type === 'error' ? ICONS.x : ICONS.bell;
    const t = document.createElement('div');
    t.className = `toast toast--${type}`;
    t.innerHTML = `<span class="toast-ico">${ico}</span><span>${msg}</span>`;
    _toastWrap.appendChild(t);
    requestAnimationFrame(() => t.classList.add('is-visible'));
    setTimeout(() => {
      t.classList.remove('is-visible');
      setTimeout(() => t.remove(), 350);
    }, 3000);
  }

  /* ── Helpers ────────────────────────────────────────── */
  function fmt(n) {
    if (typeof n !== 'number') return n;
    return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : String(n);
  }

  function fmtMoney(n) {
    return `$${Number(n).toLocaleString()}`;
  }

  function stars(rating, max = 5) {
    return Array.from({ length: max }, (_, i) =>
      `<span style="color:${i < Math.round(rating) ? '#D97706' : '#E2E8F0'}">${ICONS.star}</span>`
    ).join('');
  }

  function avatarColor(name) {
    const colors = ['purple', 'blue', 'green', 'amber', 'pink', 'teal', 'orange'];
    const idx = (name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % colors.length;
    return colors[idx];
  }

  /* ── Keyboard / overlay close ───────────────────────── */
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.modal.is-open').forEach(m => {
      m.classList.remove('is-open');
      document.body.style.overflow = '';
    });
    document.querySelectorAll('.side-panel.is-open').forEach(p => {
      p.classList.remove('is-open');
      document.getElementById('panelOverlay')?.classList.remove('is-active');
      document.body.style.overflow = '';
    });
    document.querySelectorAll('.tb-dropdown.is-open').forEach(d => d.classList.remove('is-open'));
  });

  document.addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.closest('.modal')?.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    if (e.target.id === 'panelOverlay') {
      document.querySelectorAll('.side-panel.is-open').forEach(p => p.classList.remove('is-open'));
      e.target.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  });

  /* ── Init ───────────────────────────────────────────── */
  function init(opts = {}) {
    document.documentElement.setAttribute('data-theme', getTheme());
    renderSidebar();
    renderTopbar(opts);
  }

  return {
    init, store, getTheme, setTheme, toggleTheme,
    openModal, closeModal, openPanel, closePanel,
    showToast, fmt, fmtMoney, stars, avatarColor,
    initTabs, logout,
    getRole, setRole, accessGuard,
    ICONS, currentSlug,
    _toggleNotif, _clearNotifs, _toggleUserMenu, _adminPinAccess,
  };

})();
