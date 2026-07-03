'use strict';
/* ============================================================
   DIGITAL RISE — AI AGENT PLATFORM JS
   Rebuild: Agent-first architecture, Agent 1 fully live
   ============================================================ */

const AG = (() => {

  /* ── Icons ──────────────────────────────────────────────── */
  const IC = {
    menu:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
    search:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    bell:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
    moon:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    sun:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    x:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    check:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
    dash:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    bot:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="15" x2="8" y2="15"/><line x1="16" y1="15" x2="16" y2="15"/></svg>`,
    settings:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    chat:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    leads:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    book:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    zap:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    lock:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    plus:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  };

  /* ── Theme ──────────────────────────────────────────────── */
  const THEME_KEY = 'dr_theme';
  function getTheme() { return localStorage.getItem(THEME_KEY)||'light'; }
  function setTheme(t) {
    localStorage.setItem(THEME_KEY, t);
    document.documentElement.setAttribute('data-theme', t);
    const btn = document.getElementById('agThemeBtn');
    if (btn) btn.innerHTML = t==='dark' ? IC.sun : IC.moon;
  }
  function toggleTheme() { setTheme(getTheme()==='light'?'dark':'light'); }

  /* ── Nav ────────────────────────────────────────────────── */
  const NAV = [
    { section:'OVERVIEW' },
    { label:'Dashboard',       icon:'dash',     href:'/agents/dashboard',                               slug:'dashboard'      },
    { section:'WEBSITE ENQUIRY AGENT', active:true },
    { label:'Agent Overview',  icon:'bot',      href:'/agents/agent-website-enquiry/overview',          slug:'overview'       },
    { label:'Business Config', icon:'settings', href:'/agents/agent-website-enquiry/business-config',   slug:'business-config'},
    { label:'Agent Tester',    icon:'chat',     href:'/agents/agent-website-enquiry/tester',            slug:'tester',  badge:'LIVE' },
    { label:'Leads',           icon:'leads',    href:'/agents/agent-website-enquiry/leads',             slug:'leads'          },
    { label:'Knowledge Base',  icon:'book',     href:'/agents/agent-website-enquiry/knowledge-base',    slug:'knowledge-base' },
    { label:'Analytics',       icon:'zap',      href:'/agents/agent-website-enquiry/analytics',         slug:'analytics'      },
    { section:'COMING SOON' },
    { label:'Booking Agent',         icon:'lock', disabled:true, soon:true },
    { label:'WhatsApp Follow-up AI', icon:'lock', disabled:true, soon:true },
    { label:'Review Agent',          icon:'lock', disabled:true, soon:true },
    { label:'Phone Recovery AI',     icon:'lock', disabled:true, soon:true },
    { label:'Email AI Agent',        icon:'lock', disabled:true, soon:true },
  ];

  function currentSlug() {
    const p = window.location.pathname.split('/').filter(Boolean);
    return p[p.length-1] || 'dashboard';
  }

  /* ── Sidebar ────────────────────────────────────────────── */
  function renderSidebar() {
    const el = document.getElementById('agSidebar');
    if (!el) return;
    const slug = currentSlug();
    let html = '';
    NAV.forEach(item => {
      if (item.section) {
        const active = item.active ? ' style="color:var(--accent)"' : '';
        html += `<div class="ag-nav-section"${active}>${item.section}</div>`;
        return;
      }
      if (item.disabled) {
        html += `<div class="ag-nav-item" style="opacity:.4;cursor:not-allowed;pointer-events:none">
          <span class="ag-nav-ico">${IC.lock}</span><span>${item.label}</span>
          <span style="margin-left:auto;font-size:.5rem;font-weight:700;color:var(--t4);letter-spacing:.06em">SOON</span>
        </div>`;
        return;
      }
      const active = slug === item.slug;
      const badge = item.badge ? `<span class="ag-nav-badge ag-nav-badge--green">${item.badge}</span>` : '';
      html += `<a href="${item.href}" class="ag-nav-item${active?' is-active':''}">
        <span class="ag-nav-ico">${IC[item.icon]||''}</span>
        <span>${item.label}</span>${badge}
      </a>`;
    });
    el.innerHTML = `
      <div class="ag-logo">
        <a href="/agents/dashboard" class="ag-logo-link">
          <div class="ag-logo-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <div>
            <div class="ag-logo-name">Digital Rise</div>
            <div class="ag-logo-sub">AI Agent Platform</div>
          </div>
        </a>
      </div>
      <div class="ag-nav-wrap">${html}</div>
      <div class="ag-sb-footer">
        <div class="ag-sb-status">
          <div class="ag-sb-dot"></div>
          <div>
            <div class="ag-sb-status-text">Website Enquiry Agent Live</div>
            <div class="ag-sb-status-sub">5 businesses · 9s avg response</div>
          </div>
        </div>
      </div>`;
  }

  /* ── Topbar ─────────────────────────────────────────────── */
  function renderTopbar() {
    const el = document.getElementById('agTopbar');
    if (!el) return;
    const theme = getTheme();
    el.innerHTML = `
      <div class="ag-tb-left">
        <button class="ag-hamburger" id="agBurger">${IC.menu}</button>
        <div class="ag-search">
          <span class="ag-search-ico">${IC.search}</span>
          <input class="ag-search-input" type="text" placeholder="Search leads, businesses, conversations…">
        </div>
      </div>
      <div class="ag-tb-right">
        <div style="display:flex;align-items:center;gap:6px;padding:5px 10px;background:var(--accent-bg);border-radius:99px;border:1px solid var(--accent-light,#C7D2FE)">
          <div style="width:7px;height:7px;border-radius:50%;background:var(--green)"></div>
          <span style="font-size:.6875rem;font-weight:700;color:var(--accent)">Agent Live</span>
        </div>
        <button class="ag-tb-btn" onclick="AG.toast('No new notifications','info')" title="Notifications">
          ${IC.bell}<span class="ag-tb-notif-dot"></span>
        </button>
        <button class="ag-tb-btn" id="agThemeBtn" onclick="AG.toggleTheme()" title="Toggle theme">
          ${theme==='dark' ? IC.sun : IC.moon}
        </button>
        <div class="ag-tb-avatar" title="Digital Rise">DR</div>
      </div>`;
    document.getElementById('agBurger')?.addEventListener('click', () => {
      document.getElementById('agSidebar')?.classList.toggle('is-open');
      document.getElementById('agSbOverlay')?.classList.toggle('is-active');
    });
  }

  /* ── Toast ──────────────────────────────────────────────── */
  let _tw;
  function toast(msg, type='success') {
    if (!_tw) { _tw=document.createElement('div'); _tw.className='ag-toast-wrap'; document.body.appendChild(_tw); }
    const ico = type==='success'?'✓':type==='error'?'✕':'ℹ';
    const t=document.createElement('div');
    t.className=`ag-toast ag-toast--${type}`;
    t.innerHTML=`<span class="ag-toast-ico">${ico}</span><span>${msg}</span>`;
    _tw.appendChild(t);
    requestAnimationFrame(()=>t.classList.add('is-visible'));
    setTimeout(()=>{t.classList.remove('is-visible');setTimeout(()=>t.remove(),350);},3200);
  }

  /* ── Modal ──────────────────────────────────────────────── */
  function openModal(id) { document.getElementById(id)?.classList.add('is-open'); document.body.style.overflow='hidden'; }
  function closeModal(id){ document.getElementById(id)?.classList.remove('is-open'); document.body.style.overflow=''; }

  /* ── Panel ──────────────────────────────────────────────── */
  function openPanel(id) {
    document.getElementById(id)?.classList.add('is-open');
    document.getElementById('agPanelOverlay')?.classList.add('is-active');
    document.body.style.overflow='hidden';
  }
  function closePanel(id){
    document.getElementById(id)?.classList.remove('is-open');
    document.getElementById('agPanelOverlay')?.classList.remove('is-active');
    document.body.style.overflow='';
  }

  /* ── Badges ─────────────────────────────────────────────── */
  function statusBadge(s) {
    const map = {
      'New':['blue','New'], 'Qualified':['purple','Qualified'], 'Booked':['green','Booked'],
      'Follow-up':['amber','Follow-up'], 'Won':['green','✓ Won'], 'Lost':['gray','Lost'],
      'Escalated':['red','Escalated'], 'active':['green','● Active'], 'setup':['amber','◐ Setup'],
      'paused':['gray','⏸ Paused'],
    };
    const [color,label]=map[s]||['gray',s];
    return `<span class="badge badge--${color}">${label}</span>`;
  }
  function qualBadge(score) {
    const color = score>=80?'green':score>=60?'amber':'red';
    return `<span class="badge badge--${color}">${score}%</span>`;
  }
  function chBadge(ch) {
    const icons={website:'💻',whatsapp:'📲',email:'📧',phone:'📞',instagram:'📸'};
    return `<span class="ch-badge ch-badge--${ch}">${icons[ch]||'📡'} ${ch}</span>`;
  }
  function bizAv(b, size='av-sm') { return `<div class="av ${size}" style="background:${b.color}">${b.initial}</div>`; }

  /* ── Init ───────────────────────────────────────────────── */
  function init(opts={}) {
    document.documentElement.setAttribute('data-theme', getTheme());
    renderSidebar();
    renderTopbar();
    if (!document.getElementById('agSbOverlay')) {
      const ov=document.createElement('div');ov.id='agSbOverlay';ov.className='ag-sb-overlay';
      ov.addEventListener('click',()=>{document.getElementById('agSidebar')?.classList.remove('is-open');ov.classList.remove('is-active');});
      document.body.appendChild(ov);
    }
    if (!document.getElementById('agPanelOverlay')) {
      const po=document.createElement('div');po.id='agPanelOverlay';po.className='ag-panel-overlay';
      po.addEventListener('click',()=>{
        document.querySelectorAll('.ag-panel.is-open').forEach(p=>p.classList.remove('is-open'));
        po.classList.remove('is-active');document.body.style.overflow='';
      });
      document.body.appendChild(po);
    }
    document.querySelectorAll('.ag-modal').forEach(m=>{
      if(!m.querySelector('.ag-modal-overlay')){const ov=document.createElement('div');ov.className='ag-modal-overlay';m.insertBefore(ov,m.firstChild);}
    });
    document.addEventListener('click',e=>{
      if(e.target.classList.contains('ag-modal-overlay')){e.target.closest('.ag-modal')?.classList.remove('is-open');document.body.style.overflow='';}
    });
    document.addEventListener('keydown',e=>{
      if(e.key!=='Escape')return;
      document.querySelectorAll('.ag-modal.is-open').forEach(m=>{m.classList.remove('is-open');document.body.style.overflow='';});
      document.querySelectorAll('.ag-panel.is-open').forEach(p=>p.classList.remove('is-open'));
      document.getElementById('agPanelOverlay')?.classList.remove('is-active');
      document.body.style.overflow='';
    });
  }

  return { init, toast, openModal, closeModal, openPanel, closePanel, getTheme, setTheme, toggleTheme, statusBadge, qualBadge, chBadge, bizAv, IC };

})();
