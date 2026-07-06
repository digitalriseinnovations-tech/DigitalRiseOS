'use strict';
/* ============================================================
   DRS — DIGITAL RISE PLATFORM STORAGE
   localStorage driver today; shaped so a Supabase driver can
   be swapped in later (same collection/record contract).
   Collections: businesses, agents, leads, conversations,
                bookings, reviews
   ============================================================ */
var DRS = (function () {

  var NS = 'drp_';                 /* key namespace */
  var driver = 'local';            /* 'local' | 'supabase' (future) */
  var COLS = ['businesses','agents','leads','conversations','bookings','reviews'];

  /* ── Primitives ────────────────────────────────────────── */
  function uid() {
    return 'xxxxxxxx-xxxx-4xxx'.replace(/x/g, function () {
      return (Math.random() * 16 | 0).toString(16);
    }) + '-' + Date.now().toString(36);
  }
  function now() { return new Date().toISOString(); }

  function _read(col) {
    try { return JSON.parse(localStorage.getItem(NS + col) || '[]'); }
    catch (e) { return []; }
  }
  function _write(col, arr) {
    localStorage.setItem(NS + col, JSON.stringify(arr));
  }

  /* ── CRUD ──────────────────────────────────────────────── */
  function list(col, filter) {
    var arr = _read(col);
    if (!filter) return arr;
    return arr.filter(function (r) {
      return Object.keys(filter).every(function (k) { return r[k] === filter[k]; });
    });
  }
  function get(col, id) {
    return _read(col).find(function (r) { return r.id === id; }) || null;
  }
  function getBusinessBySlug(slug) {
    return _read('businesses').find(function (b) { return b.slug === slug; }) || null;
  }
  function create(col, obj) {
    var arr = _read(col);
    var rec = Object.assign({ id: uid(), createdAt: now() }, obj);
    arr.unshift(rec);
    _write(col, arr);
    return rec;
  }
  function update(col, id, patch) {
    var arr = _read(col);
    var i = arr.findIndex(function (r) { return r.id === id; });
    if (i === -1) return null;
    arr[i] = Object.assign({}, arr[i], patch, { updatedAt: now() });
    _write(col, arr);
    return arr[i];
  }
  function remove(col, id) {
    _write(col, _read(col).filter(function (r) { return r.id !== id; }));
  }
  function clearAll() {
    COLS.forEach(function (c) { localStorage.removeItem(NS + c); });
    localStorage.removeItem(NS + 'seeded');
  }

  /* ── Seed demo data (first run only) ───────────────────── */
  function seed() {
    if (localStorage.getItem(NS + 'seeded')) return;
    localStorage.setItem(NS + 'seeded', '1');
    if (_read('businesses').length) return;

    var biz = create('businesses', {
      name: 'Sunshine Nursery', slug: 'sunshine-nursery',
      industryGroup: 'childcare', businessType: 'Daycare',
      website: 'sunshinenursery.ca', phone: '+1 905-555-0101',
      email: 'hello@sunshinenursery.ca', whatsapp: '+1 905-555-0101',
      location: 'Brampton, ON', reviewLink: 'https://g.page/r/sunshine-nursery/review',
      bookingLink: '', status: 'active', color: '#7C3AED', initial: 'SN',
      selectedAgents: ['website-enquiry', 'booking', 'whatsapp-followup', 'review'],
      knowledge: {
        hours: 'Monday–Friday 7:30 AM – 6:00 PM. Closed weekends and stat holidays.',
        services: 'Full-time and part-time childcare for infants, toddlers and preschoolers. Before/after school program.',
        pricing: 'Toddlers from $65/day. Preschool from $58/day. CWELCC subsidy accepted — reduces fees significantly.',
        ageGroups: 'Infants 6–18 months, Toddlers 18 months–2.5 years, Preschool 2.5–4 years',
        fees: 'Infants $85/day, Toddlers $65/day, Preschool $58/day. CWELCC subsidy accepted.',
        tourTimes: 'Tours Tuesday & Thursday 10 AM, Saturday 9–11 AM. Free, about 30 minutes.',
        waitlistRules: 'Waitlist is free to join — no deposit. Priority to siblings of enrolled children.',
        meals: 'Hot lunch and two snacks daily, included in fees. Nut-free facility, allergy plans supported.',
        curriculum: 'Play-based learning with HighScope elements. Weekly themes, outdoor play twice daily.',
        safety: '1:5 ratio for toddlers, secured keypad entry, CCTV, all staff first-aid certified.',
        siblingDiscount: '10% off the second child.',
        escalation: 'Director Sarah Chen — 905-555-0199',
        reviewLink: 'https://g.page/r/sunshine-nursery/review',
        whatsapp: '+1 905-555-0101',
      },
    });

    var agents = {};
    ['website-enquiry', 'booking', 'whatsapp-followup', 'review'].forEach(function (t) {
      agents[t] = create('agents', {
        businessId: biz.id, agentType: t,
        agentName: t === 'website-enquiry' ? 'Website Parent Enquiry Agent'
                 : t === 'booking' ? 'Tour Booking Agent'
                 : t === 'whatsapp-followup' ? 'WhatsApp Follow-up Agent'
                 : 'Review Request Agent',
        status: 'active',
        channels: t === 'whatsapp-followup' ? ['whatsapp'] : t === 'review' ? ['whatsapp', 'email'] : ['website'],
        actionsEnabled: { createLead: true, offerBooking: true, whatsappFollowup: true, requestReview: t === 'review', escalate: true },
        trainingStatus: 'ready', lastTrained: now(),
      });
    });

    var lead1 = create('leads', {
      businessId: biz.id, agentId: agents['website-enquiry'].id,
      name: 'Amanda Rodriguez', phone: '+1 905-555-2211', email: 'amanda.r@gmail.com',
      enquiryType: 'Tour Request', channel: 'website', status: 'New', qualScore: 85,
      notes: 'Toddler, 20 months. Wants to start in September. Asked about CWELCC.',
    });
    create('leads', {
      businessId: biz.id, agentId: agents['website-enquiry'].id,
      name: 'James Okafor', phone: '+1 647-555-8899', email: 'j.okafor@outlook.com',
      enquiryType: 'Availability', channel: 'website', status: 'Qualified', qualScore: 72,
      notes: 'Two children — infant and preschooler. Asked about sibling discount.',
    });
    create('conversations', {
      businessId: biz.id, agentId: agents['website-enquiry'].id, leadId: lead1.id,
      channel: 'website', leadCaptured: true,
      messages: [
        { role: 'in',  text: "Hi there! 👋 I'm Ava from Sunshine Nursery. How can I help you today?" },
        { role: 'out', text: 'Do you have space for a toddler starting September?' },
        { role: 'in',  text: 'We have limited toddler spots for September! Tours run Tue & Thu 10 AM. Can I grab your name and number?' },
        { role: 'out', text: 'Amanda Rodriguez, 905-555-2211' },
      ],
    });
    create('bookings', {
      businessId: biz.id, agentId: agents['booking'].id, leadId: lead1.id,
      service: 'Nursery Tour', bookingDate: new Date(Date.now() + 3 * 864e5).toISOString(),
      status: 'confirmed', notes: 'Tour for toddler room. Confirmed by WhatsApp.',
    });
    create('reviews', {
      businessId: biz.id, agentId: agents['review'].id,
      platform: 'google', rating: 5, authorName: 'Priya S.',
      content: 'Wonderful staff, my daughter loves it here. The AI chat made enrolment so easy!',
      status: 'published',
    });

    /* Second demo business — partially set up */
    create('businesses', {
      name: 'Smile Dental Studio', slug: 'smile-dental-studio',
      industryGroup: 'healthcare', businessType: 'Dental Clinic',
      website: 'smiledentalstudio.ca', phone: '+1 416-555-0202',
      email: 'info@smiledentalstudio.ca', whatsapp: '',
      location: 'Toronto, ON', reviewLink: '', bookingLink: 'https://smiledentalstudio.ca/book',
      status: 'setup', color: '#0891B2', initial: 'SD',
      selectedAgents: ['website-enquiry', 'booking'],
      knowledge: {
        hours: 'Mon–Fri 8 AM–6 PM, Sat 9 AM–3 PM.',
        treatments: 'Check-ups, cleaning, whitening, veneers, implants, Invisalign.',
        insurance: 'Direct billing for most major insurance providers.',
        emergency: 'Same-day emergency appointments — call 416-555-0202.',
      },
    });
    var sd = getBusinessBySlug('smile-dental-studio');
    ['website-enquiry', 'booking'].forEach(function (t) {
      create('agents', {
        businessId: sd.id, agentType: t,
        agentName: t === 'website-enquiry' ? 'Website Patient Enquiry Agent' : 'Appointment Booking Agent',
        status: 'active', channels: ['website'],
        actionsEnabled: { createLead: true, offerBooking: true, escalate: true },
        trainingStatus: 'not-trained', lastTrained: null,
      });
    });
  }

  seed();

  return {
    driver: driver,
    uid: uid, now: now,
    list: list, get: get, create: create, update: update, remove: remove,
    getBusinessBySlug: getBusinessBySlug,
    clearAll: clearAll, seed: seed,
  };
})();
