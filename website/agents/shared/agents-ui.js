'use strict';
/* ============================================================
   DRUI — DIGITAL RISE PLATFORM UI SHELL
   Sidebar + topbar + routing helpers for the admin platform.
   Requires: agents.css, agents.js (AG utils), agents-data.js,
             agents-storage.js, agents-actions.js
   ============================================================ */
var DRUI = (function () {

  /* ── Route parsing ─────────────────────────────────────── */
  /* /agents/businesses/:slug/:sub/:agentId  (clean URLs)     */
  function route() {
    var q = new URLSearchParams(window.location.search);
    var p = window.location.pathname.replace(/\.html$/, '').split('/').filter(Boolean);
    /* p = ['agents','businesses', slug?, sub?, agentId?] */
    var r = { section: p[1] || 'dashboard', slug: null, sub: null, agentId: null };
    if (p[1] === 'businesses' && p[2] && p[2] !== 'new' &&
        ['detail','agents','agent-detail','knowledge-base','conversations','leads','bookings','reviews','deploy'].indexOf(p[2]) === -1) {
      r.slug = p[2];
      r.sub = p[3] || 'overview';
      if (p[3] === 'agents' && p[4]) r.agentId = p[4];
    }
    /* Fallback: direct .html access with ?biz= & ?agent= */
    if (!r.slug && q.get('biz')) { r.slug = q.get('biz'); r.sub = q.get('sub') || 'overview'; }
    if (!r.agentId && q.get('agent')) r.agentId = q.get('agent');
    return r;
  }
  function bizUrl(slug, sub) { return '/agents/businesses/' + slug + (sub ? '/' + sub : ''); }
  function agentUrl(slug, agentId) { return '/agents/businesses/' + slug + '/agents/' + agentId; }

  /* ── Current business from route ───────────────────────── */
  function currentBiz() {
    var r = route();
    return r.slug ? DRS.getBusinessBySlug(r.slug) : null;
  }

  /* ── Sidebar ───────────────────────────────────────────── */
  var EM = { dashboard:'📊', businesses:'🏢', industries:'🗂️', templates:'🧩', settings:'⚙️',
             overview:'🏠', agents:'🤖', 'knowledge-base':'📚', conversations:'💬',
             leads:'🎯', bookings:'📅', reviews:'⭐', deploy:'🚀' };

  function navItem(href, label, key, activeKey, badge) {
    var active = key === activeKey;
    return '<a href="' + href + '" class="ag-nav-item' + (active ? ' is-active' : '') + '">' +
      '<span class="ag-nav-ico" style="font-size:.9375rem;display:flex;align-items:center;justify-content:center">' + (EM[key] || '•') + '</span>' +
      '<span>' + label + '</span>' +
      (badge ? '<span class="ag-nav-badge ag-nav-badge--green">' + badge + '</span>' : '') +
      '</a>';
  }

  function renderSidebar(opts) {
    var el = document.getElementById('agSidebar');
    if (!el) return;
    var biz = opts.biz;
    var html = '<div class="ag-nav-section">PLATFORM</div>';
    html += navItem('/agents/dashboard',  'Dashboard',  'dashboard',  opts.nav);
    html += navItem('/agents/businesses', 'Businesses', 'businesses', opts.nav);
    html += navItem('/agents/industries', 'Industries', 'industries', opts.nav);
    html += navItem('/agents/templates',  'Templates',  'templates',  opts.nav);
    html += navItem('/agents/settings',   'Settings',   'settings',   opts.nav);

    if (biz) {
      html += '<div class="ag-nav-section" style="color:var(--accent);display:flex;align-items:center;gap:6px;margin-top:14px">' +
        '<div class="av av-sm" style="background:' + biz.color + ';width:18px;height:18px;font-size:.5rem">' + biz.initial + '</div>' +
        '<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + biz.name.toUpperCase() + '</span></div>';
      [['overview','Overview',''],['agents','AI Agents','agents'],['knowledge-base','Knowledge Base','knowledge-base'],
       ['conversations','Conversations','conversations'],['leads','Leads','leads'],['bookings','Bookings','bookings'],
       ['reviews','Reviews','reviews'],['deploy','Deploy','deploy']].forEach(function (it) {
        html += navItem(bizUrl(biz.slug, it[2]), it[1], it[0], opts.bizNav);
      });
    }

    var liveAgents = DRS.list('agents').filter(function (a) { return a.status === 'active'; }).length;
    var bizCount = DRS.list('businesses').length;

    el.innerHTML =
      '<div class="ag-logo"><a href="/agents/dashboard" class="ag-logo-link">' +
        '<div class="ag-logo-mark"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div>' +
        '<div><div class="ag-logo-name">Digital Rise</div><div class="ag-logo-sub">AI Agent Platform</div></div>' +
      '</a></div>' +
      '<div class="ag-nav-wrap">' + html + '</div>' +
      '<div class="ag-sb-footer"><div class="ag-sb-status"><div class="ag-sb-dot"></div><div>' +
        '<div class="ag-sb-status-text">' + liveAgents + ' AI Agents Active</div>' +
        '<div class="ag-sb-status-sub">' + bizCount + ' business' + (bizCount === 1 ? '' : 'es') + ' on platform</div>' +
      '</div></div></div>';
  }

  /* ── Topbar ────────────────────────────────────────────── */
  function renderTopbar() {
    var el = document.getElementById('agTopbar');
    if (!el) return;
    var theme = AG.getTheme();
    var liveAgents = DRS.list('agents').filter(function (a) { return a.status === 'active'; }).length;
    el.innerHTML =
      '<div class="ag-tb-left">' +
        '<button class="ag-hamburger" id="agBurger">' + AG.IC.menu + '</button>' +
        '<div class="ag-search"><span class="ag-search-ico">' + AG.IC.search + '</span>' +
        '<input class="ag-search-input" type="text" placeholder="Search businesses, leads, agents…"></div>' +
      '</div>' +
      '<div class="ag-tb-right">' +
        '<div style="display:flex;align-items:center;gap:6px;padding:4px 10px;background:var(--green-bg);border-radius:99px;border:1px solid #A7F3D0">' +
          '<div style="width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 0 2px rgba(5,150,105,.2)"></div>' +
          '<span style="font-size:.625rem;font-weight:700;color:var(--green-t)">' + liveAgents + ' Agents Live</span></div>' +
        '<button class="ag-tb-btn" onclick="AG.toast(\'No new notifications\',\'info\')" title="Notifications">' + AG.IC.bell + '<span class="ag-tb-notif-dot"></span></button>' +
        '<button class="ag-tb-btn" id="agThemeBtn" onclick="AG.toggleTheme()" title="Toggle theme">' + (theme === 'dark' ? AG.IC.sun : AG.IC.moon) + '</button>' +
        '<div class="ag-tb-avatar" title="Digital Rise Admin">DR</div>' +
      '</div>';
    var burger = document.getElementById('agBurger');
    if (burger) burger.addEventListener('click', function () {
      var sb = document.getElementById('agSidebar');
      if (sb) sb.classList.toggle('is-open');
      var ov = document.getElementById('agSbOverlay');
      if (ov) ov.classList.toggle('is-active');
    });
  }

  /* ── Init ──────────────────────────────────────────────── */
  /* opts: { nav:'dashboard'|..., bizNav:'overview'|..., requireBiz:bool } */
  function init(opts) {
    opts = opts || {};
    document.documentElement.setAttribute('data-theme', AG.getTheme());
    var biz = opts.biz !== undefined ? opts.biz : currentBiz();
    if (opts.requireBiz && !biz) {
      renderSidebar({ nav: 'businesses' });
      renderTopbar();
      var c = document.querySelector('.ag-content');
      if (c) c.innerHTML = empty('🔍', 'Business not found',
        'This business does not exist or was removed.',
        '<a class="btn btn--primary" href="/agents/businesses">← Back to Businesses</a>');
      return null;
    }
    renderSidebar({ nav: opts.nav || route().section, biz: biz, bizNav: opts.bizNav });
    renderTopbar();
    if (!document.getElementById('agSbOverlay')) {
      var ov = document.createElement('div'); ov.id = 'agSbOverlay'; ov.className = 'ag-sb-overlay';
      ov.addEventListener('click', function () {
        var sb = document.getElementById('agSidebar');
        if (sb) sb.classList.remove('is-open');
        ov.classList.remove('is-active');
      });
      document.body.appendChild(ov);
    }
    return biz;
  }

  /* ── Shared render helpers ─────────────────────────────── */
  function pageHeader(title, sub, actionsHtml) {
    return '<div class="ag-ph"><div>' +
      '<div class="ag-ph-title">' + title + '</div>' +
      (sub ? '<div class="ag-ph-sub">' + sub + '</div>' : '') +
      '</div>' + (actionsHtml ? '<div class="ag-ph-actions">' + actionsHtml + '</div>' : '') + '</div>';
  }

  function kpiRow(items) {
    return '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin-bottom:22px">' +
      items.map(function (k) {
        return '<div class="ag-card" style="padding:16px;display:flex;align-items:center;gap:12px">' +
          '<div style="width:40px;height:40px;border-radius:10px;background:' + (k.bg || 'var(--accent-bg)') + ';display:flex;align-items:center;justify-content:center;font-size:1.125rem;flex-shrink:0">' + k.ico + '</div>' +
          '<div><div style="font-size:1.375rem;font-weight:800;color:var(--t1);line-height:1.1">' + k.val + '</div>' +
          '<div style="font-size:.6875rem;color:var(--t3);font-weight:600">' + k.label + '</div></div></div>';
      }).join('') + '</div>';
  }

  function table(cols, rowsHtml) {
    return '<div class="ag-card" style="padding:0;overflow:auto"><table style="width:100%;border-collapse:collapse;font-size:.8125rem">' +
      '<thead><tr>' + cols.map(function (c) {
        return '<th style="text-align:left;padding:11px 14px;background:var(--bg-alt);font-size:.625rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--t4);border-bottom:1px solid var(--border);white-space:nowrap">' + c + '</th>';
      }).join('') + '</tr></thead><tbody>' + rowsHtml + '</tbody></table></div>';
  }
  function td(content, extra) {
    return '<td style="padding:12px 14px;border-bottom:1px solid var(--border-s);color:var(--t2);vertical-align:middle;' + (extra || '') + '">' + content + '</td>';
  }

  function empty(icon, title, sub, ctaHtml) {
    return '<div class="ag-card" style="padding:52px 24px;text-align:center">' +
      '<div style="font-size:2.5rem;margin-bottom:12px">' + icon + '</div>' +
      '<div style="font-size:1rem;font-weight:800;color:var(--t1);margin-bottom:4px">' + title + '</div>' +
      '<div style="font-size:.8125rem;color:var(--t3);margin-bottom:18px">' + sub + '</div>' +
      (ctaHtml || '') + '</div>';
  }

  function trainBadge(s) {
    var map = { 'ready': ['green', '✓ Ready'], 'training': ['amber', '◌ Training…'], 'not-trained': ['gray', 'Not trained'] };
    var x = map[s] || ['gray', s];
    return '<span class="badge badge--' + x[0] + '">' + x[1] + '</span>';
  }

  function timeAgo(iso) {
    if (!iso) return '—';
    var s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (s < 60) return 'just now';
    if (s < 3600) return Math.floor(s / 60) + 'm ago';
    if (s < 86400) return Math.floor(s / 3600) + 'h ago';
    return Math.floor(s / 86400) + 'd ago';
  }
  function fmtDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  return {
    route: route, bizUrl: bizUrl, agentUrl: agentUrl, currentBiz: currentBiz,
    init: init,
    pageHeader: pageHeader, kpiRow: kpiRow, table: table, td: td,
    empty: empty, trainBadge: trainBadge,
    timeAgo: timeAgo, fmtDate: fmtDate, esc: esc,
  };
})();
