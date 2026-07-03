/* =============================================================
   DIGITAL RISE OS — INDUSTRY PAGE  script.js
   Master Industry Framework  v1.0

   FRAMEWORK GUIDE:
   • INDUSTRY_CONFIG at the top is the ONLY thing to change
     when reusing this page for a new industry.
   • All interactions (FAQ, demo, nav, counters) are generic.
   ============================================================= */

'use strict';

/* ── Accessibility helper ──────────────────────────────── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* ═══════════════════════════════════════════════════════
   INDUSTRY CONFIG — SWAP PER INDUSTRY
   Replace this block for every new industry page.
═══════════════════════════════════════════════════════ */
const INDUSTRY_CONFIG = {
  industry:     'daycare',
  industryName: 'Daycare Providers',
  channelName:  'Sunshine Nursery',

  /* Interactive demo conversation (10 steps = 5 pairs).
     type: 'parent' | 'ai' | 'system' */
  demoConversation: [
    { type: 'parent', text: 'Hi! Do you have space for a 3-year-old starting September?',        time: '09:01' },
    { type: 'ai',     text: 'Hi there! 😊 Great news — we do have places available for 3-year-olds from September. Are you looking for full-time or part-time care?', time: '09:01 · AI replied in 8 seconds' },
    { type: 'parent', text: 'Full-time please. Can you tell me the fees?',                       time: '09:02' },
    { type: 'ai',     text: 'Of course! Full-time starts from £1,150/month and includes meals, nappies and all activities. We also offer a 10% sibling discount. Would you like to come and see us? I can book a tour right now 🗓', time: '09:02' },
    { type: 'parent', text: 'That sounds great. Can we come Thursday?',                          time: '09:03' },
    { type: 'ai',     text: 'Thursday 10am works perfectly! Tour booked 🎉 You\'ll get a WhatsApp confirmation shortly with our address and parking info. Can I take your name?', time: '09:03 · Tour booked automatically' },
    { type: 'parent', text: 'Sarah Mitchell.',                                                    time: '09:03' },
    { type: 'ai',     text: 'Lovely to meet you, Sarah! All confirmed — see you Thursday at 10am. If you have any questions before then, just message here and I\'ll reply instantly 😊', time: '09:03' },
    { type: 'system', text: '✓ CRM lead created: Sarah Mitchell — 3yr full-time — Tour Thu 10am', time: '09:04' },
    { type: 'system', text: '✓ Staff notification sent · Review request scheduled for after tour', time: '09:04' },
  ],

  /* Channel display names per tab */
  demoChannels: {
    website:  'Sunshine Nursery · Website Chat',
    whatsapp: 'Sunshine Nursery · WhatsApp',
    voice:    'Sunshine Nursery · Voice AI'
  }
};


/* ═══════════════════════════════════════════════════════
   1. SCROLL REVEAL
═══════════════════════════════════════════════════════ */
(function initScrollReveal() {
  const els = document.querySelectorAll('.will-reveal');
  if (!els.length) return;

  if (prefersReducedMotion) {
    els.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const delay = parseInt(entry.target.dataset.delay || 0, 10);
        if (delay) {
          setTimeout(() => entry.target.classList.add('is-revealed'), delay);
        } else {
          entry.target.classList.add('is-revealed');
        }
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.06, rootMargin: '0px 0px -36px 0px' }
  );

  els.forEach(el => observer.observe(el));
})();


/* ═══════════════════════════════════════════════════════
   2. NAV SCROLL STATE
═══════════════════════════════════════════════════════ */
(function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ═══════════════════════════════════════════════════════
   3. NAV HAMBURGER (mobile)
═══════════════════════════════════════════════════════ */
(function initHamburger() {
  const btn   = document.querySelector('.nav__hamburger');
  const links = document.querySelector('.nav__links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !open);
    links.style.display = open ? '' : 'flex';
    links.style.flexDirection = 'column';
    links.style.position = 'fixed';
    links.style.top = '68px';
    links.style.left = '0';
    links.style.right = '0';
    links.style.background = 'rgba(7,9,26,.97)';
    links.style.padding = '24px';
    links.style.gap = '18px';
    links.style.borderBottom = '1px solid rgba(255,255,255,.08)';
    links.style.zIndex = '999';
    if (open) links.removeAttribute('style');
  });
})();


/* ═══════════════════════════════════════════════════════
   4. FAQ ACCORDION
═══════════════════════════════════════════════════════ */
(function initFAQ() {
  const items = document.querySelectorAll('.sf-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.sf-q');
    const ans = item.querySelector('.sf-a');
    if (!btn || !ans) return;

    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';

      /* Close all others */
      items.forEach(other => {
        if (other === item) return;
        const ob = other.querySelector('.sf-q');
        const oa = other.querySelector('.sf-a');
        if (ob) ob.setAttribute('aria-expanded', 'false');
        if (oa) oa.classList.remove('is-open');
      });

      btn.setAttribute('aria-expanded', !expanded);
      ans.classList.toggle('is-open', !expanded);
    });
  });
})();


/* ═══════════════════════════════════════════════════════
   5. INTERACTIVE DEMO CONVERSATION
═══════════════════════════════════════════════════════ */
(function initDemo() {
  const container  = document.getElementById('demoMessages');
  const nextBtn    = document.getElementById('demoNext');
  const restartBtn = document.getElementById('demoRestart');
  const chanName   = document.getElementById('demoChannelName');
  const outcomes   = document.querySelectorAll('.sd-outcome');
  const chanBtns   = document.querySelectorAll('.sd-ch-btn');

  if (!container || !nextBtn) return;

  const CONV = INDUSTRY_CONFIG.demoConversation;
  let   step = 0;        /* next message index to show */
  let   typing = false;

  function buildBubble(msg) {
    const wrap = document.createElement('div');
    wrap.className = `sd-msg sd-msg--${msg.type}`;

    const bubble = document.createElement('div');
    bubble.className = 'sd-msg-bubble';
    bubble.textContent = msg.text;
    wrap.appendChild(bubble);

    if (msg.time && msg.type !== 'system') {
      const t = document.createElement('div');
      t.className = 'sd-msg-time';
      t.textContent = msg.time;
      wrap.appendChild(t);
    }

    return wrap;
  }

  function showTyping() {
    const t = document.createElement('div');
    t.className = 'sd-msg sd-msg--ai sd-typing';
    t.id = 'demoTyping';
    t.innerHTML = '<span></span><span></span><span></span> <em style="font-size:11px;color:var(--c-dim);font-style:normal">AI is typing…</em>';
    container.appendChild(t);
    container.scrollTop = container.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById('demoTyping');
    if (t) t.remove();
  }

  function updateOutcomes() {
    outcomes.forEach(oc => {
      const threshold = parseInt(oc.dataset.step, 10);
      oc.classList.toggle('is-active', step >= threshold);
    });
  }

  function showNextPair() {
    if (step >= CONV.length) return;

    /* Show user/system message immediately */
    const first = CONV[step];
    container.appendChild(buildBubble(first));
    container.scrollTop = container.scrollHeight;
    step++;

    /* If next message is AI — show typing then reveal */
    if (step < CONV.length && CONV[step].type === 'ai') {
      typing = true;
      nextBtn.disabled = true;

      if (!prefersReducedMotion) {
        showTyping();
        setTimeout(() => {
          removeTyping();
          const ai = CONV[step];
          container.appendChild(buildBubble(ai));
          container.scrollTop = container.scrollHeight;
          step++;
          typing = false;
          nextBtn.disabled = false;
          updateOutcomes();
          if (step >= CONV.length) {
            nextBtn.textContent = '✓ Conversation complete';
            nextBtn.disabled = true;
          }
        }, 1100 + Math.random() * 600);
      } else {
        const ai = CONV[step];
        container.appendChild(buildBubble(ai));
        container.scrollTop = container.scrollHeight;
        step++;
        typing = false;
        nextBtn.disabled = false;
        updateOutcomes();
        if (step >= CONV.length) {
          nextBtn.textContent = '✓ Conversation complete';
          nextBtn.disabled = true;
        }
      }
    } else {
      updateOutcomes();
      if (step >= CONV.length) {
        nextBtn.textContent = '✓ Conversation complete';
        nextBtn.disabled = true;
      }
    }
  }

  function restart() {
    step = 0;
    typing = false;
    container.innerHTML = '';
    nextBtn.disabled = false;
    nextBtn.innerHTML = 'Continue Conversation <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
    outcomes.forEach(oc => oc.classList.remove('is-active'));
    showNextPair(); /* show first message immediately */
  }

  nextBtn.addEventListener('click', () => { if (!typing) showNextPair(); });
  restartBtn.addEventListener('click', restart);

  /* Channel switcher */
  chanBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      chanBtns.forEach(b => b.classList.remove('sd-ch-btn--active'));
      btn.classList.add('sd-ch-btn--active');
      const ch = btn.dataset.channel;
      if (chanName && INDUSTRY_CONFIG.demoChannels[ch]) {
        chanName.textContent = INDUSTRY_CONFIG.demoChannels[ch];
      }
      restart();
    });
  });

  /* Kick off with first message */
  restart();
})();


/* ═══════════════════════════════════════════════════════
   6. COUNTER ANIMATION
═══════════════════════════════════════════════════════ */
(function initCounters() {
  if (prefersReducedMotion) return;

  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);

        const el     = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.textContent.replace(/[0-9]/g, '').trim(); /* preserve non-numeric */
        const duration = 1400;
        const start  = performance.now();

        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
          el.textContent = Math.round(eased * target) + (suffix || '');
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.4 }
  );

  els.forEach(el => observer.observe(el));
})();


/* ═══════════════════════════════════════════════════════
   7. TIMELINE CONVERSATION REPLAY
═══════════════════════════════════════════════════════ */
(function initTimelineReplay() {
  const replayBtn = document.getElementById('tlReplay');
  const msgs = document.querySelectorAll('.stl-msg--reveal');
  if (!replayBtn || !msgs.length) return;

  let shown = false;

  function revealMessages() {
    msgs.forEach((msg, i) => {
      setTimeout(() => {
        msg.classList.add('stl-msg--visible');
        msg.style.opacity = '1';
        msg.style.transform = 'none';
      }, i * (prefersReducedMotion ? 0 : 600));
    });
    shown = true;
  }

  replayBtn.addEventListener('click', () => {
    msgs.forEach(msg => {
      msg.classList.remove('stl-msg--visible');
      msg.style.opacity = '';
      msg.style.transform = '';
    });
    shown = false;
    /* Brief pause then replay */
    setTimeout(revealMessages, prefersReducedMotion ? 0 : 200);
  });

  /* Auto-reveal when section scrolls into view */
  const section = document.querySelector('.s-timeline');
  if (!section || prefersReducedMotion) { revealMessages(); return; }

  const tlObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !shown) {
          setTimeout(revealMessages, 600);
          tlObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  tlObserver.observe(section);
})();


/* ═══════════════════════════════════════════════════════
   8. DASHBOARD BAR ANIMATION (pipeline bars)
   Restore inline width on reveal since CSS can't override it.
═══════════════════════════════════════════════════════ */
(function initPipelineBars() {
  if (prefersReducedMotion) return;

  const bars = document.querySelectorAll('.sdash-pipe-bar div');
  if (!bars.length) return;

  /* Cache original widths */
  const origWidths = Array.from(bars).map(b => b.style.width);
  bars.forEach(b => { b.style.width = '0'; });

  const section = document.querySelector('.s-dash');
  if (!section) return;

  const obs = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        bars.forEach((b, i) => {
          setTimeout(() => {
            b.style.transition = 'width 1.2s cubic-bezier(.22,1,.36,1)';
            b.style.width = origWidths[i];
          }, 100 + i * 80);
        });
      });
    },
    { threshold: 0.2 }
  );
  obs.observe(section);
})();


/* ═══════════════════════════════════════════════════════
   9. MAGNETIC BUTTON EFFECT (CTA buttons)
═══════════════════════════════════════════════════════ */
(function initMagneticButtons() {
  if (prefersReducedMotion) return;

  const btns = document.querySelectorAll('.scta-btn-primary, .sh-btn-primary');

  btns.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.22;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.22;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();


/* ═══════════════════════════════════════════════════════
   10. SMOOTH ANCHOR SCROLL (accounts for fixed nav)
═══════════════════════════════════════════════════════ */
(function initAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; /* nav height + buffer */
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });
})();


/* ═══════════════════════════════════════════════════════
   11. HERO SPARK LINE  (triggers after page load)
═══════════════════════════════════════════════════════ */
(function initHeroSpark() {
  if (prefersReducedMotion) return;
  const hero = document.querySelector('.s-hero');
  if (!hero) return;

  /* Add is-revealed to hero immediately so spark animates in */
  requestAnimationFrame(() => {
    const sparkLine = hero.querySelector('.shv-spark-line');
    if (sparkLine) {
      hero.classList.add('is-revealed');
    }
  });
})();


/* ═══════════════════════════════════════════════════════
   12. ORBIT HUB  — pause animation on hover
═══════════════════════════════════════════════════════ */
(function initOrbitPause() {
  if (prefersReducedMotion) return;
  const visual = document.querySelector('.so-visual');
  if (!visual) return;

  visual.addEventListener('mouseenter', () => {
    visual.querySelectorAll('.so-orb-ring').forEach(r => { r.style.animationPlayState = 'paused'; });
    visual.querySelectorAll('.so-line').forEach(l => { l.style.animationPlayState = 'paused'; });
  });
  visual.addEventListener('mouseleave', () => {
    visual.querySelectorAll('.so-orb-ring').forEach(r => { r.style.animationPlayState = ''; });
    visual.querySelectorAll('.so-line').forEach(l => { l.style.animationPlayState = ''; });
  });
})();
