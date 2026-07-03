/* =============================================================
   DIGITAL RISE OS — HOME PAGE INTERACTIONS  v3.0
   ============================================================= */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ── Industry selector (3-column layout) ───────────────── */

  const INDUSTRY_DATA = {
    daycare: {
      name: 'Daycares',
      stat: '+67%', lbl: 'Faster Enrolment',
      grad: 'linear-gradient(135deg,#0B2245,#1A4580,#2563EB)',
      checks: [
        'Instant response to parent enquiries 24/7',
        'Automated nursery tour booking',
        'Waitlist follow-up sequences',
        '5-star review collection'
      ]
    },
    dental: {
      name: 'Dental Clinics',
      stat: '+32%', lbl: 'More Bookings',
      grad: 'linear-gradient(135deg,#1A0A56,#381A9A,#7C3AED)',
      checks: [
        'Out-of-hours appointment booking AI',
        'Automated patient reminder sequences',
        'Post-treatment review requests',
        'Missed-call WhatsApp follow-up'
      ]
    },
    contractors: {
      name: 'Contractors',
      stat: '+34%', lbl: 'More Jobs Booked',
      grad: 'linear-gradient(135deg,#0A2230,#0F3A50,#0077A8)',
      checks: [
        'Instant quote follow-up via WhatsApp',
        'Job calendar sync & booking',
        'Post-job Google review requests',
        'Lead qualification on autopilot'
      ]
    },
    restaurants: {
      name: 'Restaurants',
      stat: '+55%', lbl: 'More Reviews',
      grad: 'linear-gradient(135deg,#2A1000,#5A2800,#C05010)',
      checks: [
        'Reservation follow-up automation',
        'Post-visit feedback sequences',
        'TripAdvisor & Google review push',
        'No-show reduction reminders'
      ]
    },
    fitness: {
      name: 'Fitness & Wellness',
      stat: '+42%', lbl: 'Member Growth',
      grad: 'linear-gradient(135deg,#052A18,#0A5030,#10B981)',
      checks: [
        'Class & session booking automation',
        'Member retention sequences',
        'Review & referral campaigns',
        'Trial to member conversion flow'
      ]
    },
    more: {
      name: 'Beauty & Salons',
      stat: '+38%', lbl: 'Fewer No-Shows',
      grad: 'linear-gradient(135deg,#280A30,#500A68,#9C27B0)',
      checks: [
        'Last-minute slot filling automation',
        'No-show prevention reminders',
        'After-visit review requests',
        'Loyalty & rebooking follow-ups'
      ]
    }
  };

  const indBtns   = Array.from(document.querySelectorAll('.ind-btn'));
  const indBg     = document.getElementById('ind-img-bg');
  const indBname  = document.getElementById('ind-img-bname');
  const indBlbl   = document.getElementById('ind-img-blbl');
  const indBval   = document.getElementById('ind-img-bval');
  const indStatNum = document.getElementById('ind-stat-num');
  const indStatLbl = document.getElementById('ind-stat-lbl');
  const indChecks  = document.getElementById('ind-checks');

  function setIndustry(key) {
    const d = INDUSTRY_DATA[key];
    if (!d) return;

    if (indBg) {
      indBg.style.background = d.grad;
    }
    if (indBname) indBname.textContent = d.name;
    if (indBlbl)  indBlbl.textContent  = d.lbl;
    if (indBval)  indBval.textContent  = d.stat;
    if (indStatNum) indStatNum.textContent = d.stat;
    if (indStatLbl) indStatLbl.textContent = d.lbl;
    if (indChecks) {
      indChecks.innerHTML = d.checks.map(c => `
        <li>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          ${c}
        </li>`).join('');
    }
  }

  /* Initial load */
  const activeBtn = indBtns.find(b => b.classList.contains('ind-btn--active'));
  if (activeBtn) setIndustry(activeBtn.dataset.ind);

  indBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      indBtns.forEach(b => b.classList.remove('ind-btn--active'));
      btn.classList.add('ind-btn--active');
      setIndustry(btn.dataset.ind);
    });
  });


  /* ── Scroll reveal ─────────────────────────────────────── */
  if (!prefersReducedMotion) {
    const revealEls = document.querySelectorAll('.will-reveal');
    if (revealEls.length) {
      const ro = new IntersectionObserver(
        entries => entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('is-revealed');
            ro.unobserve(e.target);
          }
        }),
        { threshold: 0.07, rootMargin: '0px 0px -40px 0px' }
      );
      revealEls.forEach(el => ro.observe(el));
    }
  } else {
    document.querySelectorAll('.will-reveal').forEach(el => el.classList.add('is-revealed'));
  }


  /* ── Nav scroll state ──────────────────────────────────── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

})();
