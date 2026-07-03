/* =============================================================
   DIGITAL RISE OS — DAYCARE AI EMPLOYEE LIVE DEMO
   website/industries/daycare/live-demo/script.js

   Interactive scripted demo with 8 daycare service flows.
   Quick-reply-driven conversation + live actions + voice AI.
   ============================================================= */

'use strict';

const PRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const TYPING_MS = PRM ? 100 : 850;
const REPLY_DELAY = PRM ? 50  : 300;

/* ── SVG Icons ─────────────────────────────────────────────── */
const I = {
  user:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  check:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  wa:       `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,
  db:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
  bell:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  clock:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  star:     `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  mail:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  phone:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.49 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.72-.72a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  tag:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
  flag:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`,
  list:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  brain:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.96-3 2.5 2.5 0 0 1-1.32-4.24 3 3 0 0 1 .34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.96-3 2.5 2.5 0 0 0 1.32-4.24 3 3 0 0 0-.34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z"/></svg>`,
  doc:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  repeat:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
  search:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  heart:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  shield:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  task:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
  send:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  alert:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
};

/* ═══════════════════════════════════════════════════════════
   SERVICE FLOWS
   Each flow: stages{}, allActions[], dashboard()
═══════════════════════════════════════════════════════════ */
const FLOWS = {

  /* ── 1. Book a Daycare Tour ──────────────────────────── */
  'book-tour': {
    name: 'Book a Daycare Tour',
    completeMsg: 'Tour Booked Successfully 🎉',
    completeBadge: 'Tour Booked',
    completeBadgeColor: 'green',

    stages: {
      start: {
        ai: "Hi {name}! 👋 I can help you book a tour of Sunshine Nursery. How old is your child?",
        replies: [
          { label: '12–18 months', val: '12–18 months', next: 'care-type', collect: 'childAge' },
          { label: '18–24 months', val: '18–24 months', next: 'care-type', collect: 'childAge' },
          { label: '2–3 years',    val: '2–3 years',    next: 'care-type', collect: 'childAge' },
          { label: '3–5 years',    val: '3–5 years',    next: 'care-type', collect: 'childAge' },
        ]
      },
      'care-type': {
        ai: "Lovely! We support children from 12 months to 5 years. Are you looking for full-time or part-time care?",
        actions: ['enquiry-captured'],
        progress: 1,
        replies: [
          { label: 'Full-time (5 days)', val: 'Full-time',          next: 'tour-slot', collect: 'careType' },
          { label: 'Part-time (3 days)', val: 'Part-time (3 days)', next: 'tour-slot', collect: 'careType' },
          { label: 'Part-time (2 days)', val: 'Part-time (2 days)', next: 'tour-slot', collect: 'careType' },
        ]
      },
      'tour-slot': {
        ai: "We have tours on Tuesday, Wednesday, and Thursday. Which slot works best for you?",
        actions: ['child-age-saved', 'care-type-saved'],
        progress: 2,
        replies: [
          { label: 'Tue 10:00 AM', val: 'Tuesday 10:00 AM',   next: 'contact', collect: 'tourSlot' },
          { label: 'Wed 10:00 AM', val: 'Wednesday 10:00 AM', next: 'contact', collect: 'tourSlot' },
          { label: 'Thu 10:00 AM', val: 'Thursday 10:00 AM',  next: 'contact', collect: 'tourSlot' },
          { label: 'Thu 2:00 PM',  val: 'Thursday 2:00 PM',   next: 'contact', collect: 'tourSlot' },
        ]
      },
      'contact': {
        ai: "{tourSlot} is available! 📅 I just need your contact details to confirm the booking. Tap below to use demo details:",
        actions: ['tour-slot-checked'],
        progress: 3,
        type: 'contact',
        next: 'confirm',
        demoContact: { name: 'Sarah Mitchell', phone: '780-555-0198', email: 'sarah@email.com' }
      },
      'confirm': {
        ai: "All confirmed, {name}! 🎉 Your tour is booked for {tourSlot}. I've sent a WhatsApp confirmation to {phone} and the visit is now in our admissions calendar. We look forward to meeting you!",
        actions: ['tour-booked', 'whatsapp-sent', 'crm-created', 'staff-notified', 'reminder-scheduled', 'review-prepared'],
        progress: 5,
        type: 'complete',
      }
    },
    allActions: [
      { id: 'enquiry-captured',   label: 'Parent enquiry captured',         icon: 'user',     color: 'green'  },
      { id: 'child-age-saved',    label: 'Child age collected',             icon: 'check',    color: 'blue'   },
      { id: 'care-type-saved',    label: 'Care type selected',              icon: 'check',    color: 'blue'   },
      { id: 'tour-slot-checked',  label: 'Tour slot availability checked',  icon: 'calendar', color: 'purple' },
      { id: 'tour-booked',        label: 'Tour booked — {tourSlot}',        icon: 'calendar', color: 'purple' },
      { id: 'whatsapp-sent',      label: 'WhatsApp confirmation sent',      icon: 'wa',       color: 'green'  },
      { id: 'crm-created',        label: 'CRM lead created',                icon: 'db',       color: 'blue'   },
      { id: 'staff-notified',     label: 'Admissions team notified',        icon: 'bell',     color: 'amber'  },
      { id: 'reminder-scheduled', label: '24hr reminder scheduled',         icon: 'clock',    color: 'amber'  },
      { id: 'review-prepared',    label: 'Review request prepared',         icon: 'star',     color: 'yellow' },
    ],
    dashboard: (s) => [
      { lbl: 'Parent Name', val: s.name       || '—', set: !!s.name      },
      { lbl: 'Role',        val: s.role       || '—', set: !!s.role      },
      { lbl: 'Child Age',   val: s.childAge   || '—', set: !!s.childAge  },
      { lbl: 'Care Type',   val: s.careType   || '—', set: !!s.careType  },
      { lbl: 'Service',     val: 'Book a Daycare Tour', set: true },
      { lbl: 'Status', val: s.tourSlot ? 'Tour Booked' : 'Enquiry Open', badge: s.tourSlot ? 'green' : null, set: true },
      { lbl: 'Tour Date',   val: s.tourSlot   || '—', set: !!s.tourSlot  },
      { lbl: 'Lead Source', val: 'Website AI Chat', set: true },
      { lbl: 'Next Action', val: s.tourSlot ? `Tour — ${s.tourSlot}` : 'Awaiting details', set: true },
      { lbl: 'Assigned To', val: 'Admissions Team', set: true },
      { lbl: 'Last Activity', val: 'Just now', set: true },
    ],
  },

  /* ── 2. Check Availability ───────────────────────────── */
  'availability': {
    name: 'Check Availability',
    completeMsg: '2 Places Confirmed — September',
    completeBadge: 'Availability Confirmed',
    completeBadgeColor: 'blue',

    stages: {
      start: {
        ai: "Hi {name}! 👋 I can check availability for you right now. How old is your child?",
        replies: [
          { label: '12–18 months', val: '12–18 months', next: 'start-month', collect: 'childAge' },
          { label: '18–24 months', val: '18–24 months', next: 'start-month', collect: 'childAge' },
          { label: '2–3 years',    val: '2–3 years',    next: 'start-month', collect: 'childAge' },
          { label: '3–5 years',    val: '3–5 years',    next: 'start-month', collect: 'childAge' },
        ]
      },
      'start-month': {
        ai: "Thanks! When are you looking to start?",
        actions: ['enquiry-captured'],
        progress: 1,
        replies: [
          { label: 'This month',   val: 'This month',   next: 'care-type', collect: 'startMonth' },
          { label: 'Next month',   val: 'Next month',   next: 'care-type', collect: 'startMonth' },
          { label: 'In 3 months',  val: 'In 3 months',  next: 'care-type', collect: 'startMonth' },
          { label: 'September',    val: 'September',    next: 'care-type', collect: 'startMonth' },
        ]
      },
      'care-type': {
        ai: "And are you looking for full-time or part-time care?",
        actions: ['child-age-saved'],
        progress: 2,
        replies: [
          { label: 'Full-time',    val: 'Full-time',          next: 'avail-result', collect: 'careType' },
          { label: 'Part-time',    val: 'Part-time',          next: 'avail-result', collect: 'careType' },
        ]
      },
      'avail-result': {
        ai: "Great news! ✅ We currently have 2 {careType} places available for {childAge} starting {startMonth}. Spaces fill quickly — would you like to secure your spot with a tour?",
        actions: ['care-type-saved', 'avail-checked', 'places-found'],
        progress: 3,
        replies: [
          { label: 'Yes! Book a tour', val: 'Yes, I\'d like to book a tour please!', next: 'offer-tour', collect: null },
          { label: 'Join waitlist',    val: 'What if places run out?',               next: 'waitlist-offer', collect: null },
          { label: 'Just browsing',    val: 'I\'m just checking for now, thanks.',   next: 'just-browsing', collect: null },
        ]
      },
      'offer-tour': {
        ai: "Excellent! 🎉 I'll flag you as high-priority in our system. A member of our admissions team will reach out within the next hour to confirm your tour date and time.",
        actions: ['lead-tagged', 'crm-saved', 'follow-up-scheduled'],
        progress: 5,
        type: 'complete',
      },
      'waitlist-offer': {
        ai: "Don't worry — I've added you to our priority waitlist for {childAge} starting {startMonth}. You'll be the very first to know if availability changes. We'll also check in monthly. 😊",
        actions: ['lead-tagged', 'crm-saved', 'follow-up-scheduled'],
        progress: 5,
        type: 'complete',
      },
      'just-browsing': {
        ai: "No problem at all! 😊 I've saved your details in case availability changes. Our team will send you monthly updates so you're always in the loop. Feel free to come back anytime!",
        actions: ['crm-saved', 'follow-up-scheduled'],
        progress: 4,
        type: 'complete',
      },
    },
    allActions: [
      { id: 'enquiry-captured',    label: 'Parent enquiry captured',           icon: 'user',   color: 'green'  },
      { id: 'child-age-saved',     label: 'Child age and start date saved',    icon: 'check',  color: 'blue'   },
      { id: 'care-type-saved',     label: 'Care type preference saved',        icon: 'check',  color: 'blue'   },
      { id: 'avail-checked',       label: 'Availability checked — 2 places',   icon: 'search', color: 'green'  },
      { id: 'places-found',        label: 'Places confirmed for age group',    icon: 'check',  color: 'purple' },
      { id: 'lead-tagged',         label: 'Lead tagged — high-intent',         icon: 'flag',   color: 'amber'  },
      { id: 'crm-saved',           label: 'CRM lead saved',                    icon: 'db',     color: 'blue'   },
      { id: 'follow-up-scheduled', label: 'Follow-up scheduled in 1 hour',     icon: 'clock',  color: 'amber'  },
    ],
    dashboard: (s) => [
      { lbl: 'Parent Name', val: s.name       || '—', set: !!s.name      },
      { lbl: 'Role',        val: s.role       || '—', set: !!s.role      },
      { lbl: 'Child Age',   val: s.childAge   || '—', set: !!s.childAge  },
      { lbl: 'Care Type',   val: s.careType   || '—', set: !!s.careType  },
      { lbl: 'Service',     val: 'Check Availability', set: true },
      { lbl: 'Status', val: 'High-Intent Lead', badge: 'amber', set: true },
      { lbl: 'Start Date',  val: s.startMonth || '—', set: !!s.startMonth },
      { lbl: 'Lead Source', val: 'Website AI Chat', set: true },
      { lbl: 'Next Action', val: 'Tour reserved or waitlisted', set: true },
      { lbl: 'Assigned To', val: 'Admissions Team', set: true },
      { lbl: 'Last Activity', val: 'Just now', set: true },
    ],
  },

  /* ── 3. Ask About Fees ───────────────────────────────── */
  'fees': {
    name: 'Ask About Fees',
    completeMsg: 'Fee Guide & Brochure Sent',
    completeBadge: 'Brochure Sent',
    completeBadgeColor: 'blue',

    stages: {
      start: {
        ai: "Hi {name}! 👋 I can share our fee information right now. How old is your child?",
        replies: [
          { label: '12–18 months', val: '12–18 months', next: 'ft-pt', collect: 'childAge' },
          { label: '18–24 months', val: '18–24 months', next: 'ft-pt', collect: 'childAge' },
          { label: '2–3 years',    val: '2–3 years',    next: 'ft-pt', collect: 'childAge' },
          { label: '3–5 years',    val: '3–5 years',    next: 'ft-pt', collect: 'childAge' },
        ]
      },
      'ft-pt': {
        ai: "Thanks! Are you thinking full-time or part-time care?",
        actions: ['fee-enquiry'],
        progress: 1,
        replies: [
          { label: 'Full-time',  val: 'Full-time',  next: 'show-fees-ft', collect: 'careType' },
          { label: 'Part-time',  val: 'Part-time',  next: 'show-fees-pt', collect: 'careType' },
          { label: 'Not sure yet', val: 'Not sure yet', next: 'show-fees-both', collect: 'careType' },
        ]
      },
      'show-fees-ft': {
        ai: "Our full-time rate (5 days/week) for {childAge} starts from $1,150/month. 🎉 This includes all meals — breakfast, lunch and afternoon snack — nappies, wipes, all activities, and daily photo updates via our parent app. We also offer a 10% sibling discount! Would you like me to send the full fee guide to your email?",
        actions: ['fee-info-shared'],
        progress: 3,
        replies: [
          { label: 'Yes, send the brochure!', val: 'Yes please, send me the full brochure.', next: 'send-brochure', collect: null },
          { label: 'Book a tour first',       val: 'I\'d love to book a tour first.',         next: 'offer-tour',    collect: null },
          { label: 'Ask about funding',        val: 'Do you accept childcare funding?',        next: 'funding',       collect: null },
        ]
      },
      'show-fees-pt': {
        ai: "Our part-time rate starts from $650/month for 2-3 days per week. 😊 All meals, activities, nappies and wipes are included. We accept Government Childcare Funding — eligible families can receive 15 to 30 hours free per week. Want me to send the full fee guide?",
        actions: ['fee-info-shared'],
        progress: 3,
        replies: [
          { label: 'Yes, send the brochure!', val: 'Yes please, send me the full brochure.', next: 'send-brochure', collect: null },
          { label: 'Book a tour first',       val: 'I\'d love to book a tour first.',         next: 'offer-tour',    collect: null },
          { label: 'Ask about funding',        val: 'Do you accept childcare funding?',        next: 'funding',       collect: null },
        ]
      },
      'show-fees-both': {
        ai: "No problem! Here's a quick overview: Full-time (5 days) from $1,150/month. Part-time (3 days) from $820/month. Part-time (2 days) from $650/month. All prices include meals, nappies, activities and daily updates. We accept all Government Childcare Funding too! Shall I send the full fee guide?",
        actions: ['fee-info-shared'],
        progress: 3,
        replies: [
          { label: 'Send me the brochure', val: 'Yes, send me the full brochure please.', next: 'send-brochure', collect: null },
          { label: 'Book a tour',          val: 'I\'d like to book a tour.',              next: 'offer-tour',    collect: null },
        ]
      },
      'funding': {
        ai: "Yes! We accept 15-hour and 30-hour Government Childcare Funding for eligible families. We'll help you understand exactly what you're entitled to when you visit. I'll include full funding details in the brochure I'm sending you now 📧",
        actions: ['fee-info-shared', 'brochure-sent', 'crm-note', 'follow-up-set'],
        progress: 5,
        type: 'complete',
      },
      'send-brochure': {
        ai: "Done! 📧 I've sent our complete fee guide, funding eligibility checker, and full nursery brochure. Check your inbox — and feel free to come back with any questions. Would you also like to arrange a tour?",
        actions: ['brochure-sent', 'crm-note', 'follow-up-set'],
        progress: 5,
        type: 'complete',
      },
      'offer-tour': {
        ai: "Brilliant! Tours run Tuesday, Wednesday, and Thursday at 10:00 AM or 2:00 PM. I'll have a member of our admissions team reach out within the hour to confirm your slot. I've sent the fee guide to your email too 📧",
        actions: ['brochure-sent', 'crm-note', 'follow-up-set'],
        progress: 5,
        type: 'complete',
      },
    },
    allActions: [
      { id: 'fee-enquiry',   label: 'Fee enquiry received',                  icon: 'tag',   color: 'green'  },
      { id: 'fee-info-shared', label: 'Personalised fee information shared', icon: 'check', color: 'blue'   },
      { id: 'brochure-sent', label: 'Brochure + fee guide sent via email',   icon: 'mail',  color: 'green'  },
      { id: 'crm-note',      label: 'CRM note added',                        icon: 'db',    color: 'purple' },
      { id: 'follow-up-set', label: 'Follow-up scheduled in 48 hours',       icon: 'clock', color: 'amber'  },
    ],
    dashboard: (s) => [
      { lbl: 'Parent Name', val: s.name     || '—', set: !!s.name    },
      { lbl: 'Role',        val: s.role     || '—', set: !!s.role    },
      { lbl: 'Child Age',   val: s.childAge || '—', set: !!s.childAge},
      { lbl: 'Care Type',   val: s.careType || '—', set: !!s.careType},
      { lbl: 'Service',     val: 'Ask About Fees', set: true },
      { lbl: 'Status', val: 'Brochure Sent', badge: 'blue', set: true },
      { lbl: 'Tour Date',   val: '—', set: false },
      { lbl: 'Lead Source', val: 'Website AI Chat', set: true },
      { lbl: 'Next Action', val: 'Follow-up in 48 hours', set: true },
      { lbl: 'Assigned To', val: 'Admissions Team', set: true },
      { lbl: 'Last Activity', val: 'Just now', set: true },
    ],
  },

  /* ── 4. Join Waiting List ────────────────────────────── */
  'waitlist': {
    name: 'Join Waiting List',
    completeMsg: 'Added to Waitlist — Monthly Updates Set',
    completeBadge: 'Added to Waitlist',
    completeBadgeColor: 'orange',

    stages: {
      start: {
        ai: "Hi {name}! 👋 I can add your family to our waitlist right away. How old is your child?",
        replies: [
          { label: '12–18 months', val: '12–18 months', next: 'start-date', collect: 'childAge' },
          { label: '18–24 months', val: '18–24 months', next: 'start-date', collect: 'childAge' },
          { label: '2–3 years',    val: '2–3 years',    next: 'start-date', collect: 'childAge' },
          { label: '3–5 years',    val: '3–5 years',    next: 'start-date', collect: 'childAge' },
        ]
      },
      'start-date': {
        ai: "When would you ideally like to start?",
        actions: ['no-space-noted'],
        progress: 1,
        replies: [
          { label: 'As soon as possible', val: 'As soon as possible', next: 'care-pref', collect: 'startMonth' },
          { label: 'January',    val: 'January',    next: 'care-pref', collect: 'startMonth' },
          { label: 'April',      val: 'April',      next: 'care-pref', collect: 'startMonth' },
          { label: 'September',  val: 'September',  next: 'care-pref', collect: 'startMonth' },
        ]
      },
      'care-pref': {
        ai: "And are you looking for full-time or part-time care?",
        actions: ['child-age-saved'],
        progress: 2,
        replies: [
          { label: 'Full-time',  val: 'Full-time',  next: 'contact', collect: 'careType' },
          { label: 'Part-time',  val: 'Part-time',  next: 'contact', collect: 'careType' },
        ]
      },
      'contact': {
        ai: "I'll add you to the waitlist now. Just need your contact details so we can reach you the moment a place opens. Use the demo details below:",
        actions: ['care-type-saved'],
        progress: 3,
        type: 'contact',
        next: 'confirmed',
        demoContact: { name: 'James Cooper', phone: '07891 234567', email: 'james@email.com' }
      },
      'confirmed': {
        ai: "Done, {name}! ✅ Your family has been added to the {startMonth} waitlist for {childAge} ({careType}). You'll be the very first to hear when a space opens. We'll also send a monthly availability update so you're never left guessing. 😊",
        actions: ['waitlist-created', 'crm-added', 'monthly-updates', 'staff-notified'],
        progress: 5,
        type: 'complete',
      },
    },
    allActions: [
      { id: 'no-space-noted',  label: 'No current space — waitlist offered', icon: 'alert',  color: 'amber'  },
      { id: 'child-age-saved', label: 'Child details saved',                 icon: 'user',   color: 'blue'   },
      { id: 'care-type-saved', label: 'Care type preference noted',          icon: 'check',  color: 'blue'   },
      { id: 'waitlist-created',label: 'Waitlist entry created',              icon: 'list',   color: 'purple' },
      { id: 'crm-added',       label: 'Parent added to CRM',                 icon: 'db',     color: 'blue'   },
      { id: 'monthly-updates', label: 'Monthly availability follow-up set',  icon: 'repeat', color: 'amber'  },
      { id: 'staff-notified',  label: 'Staff notified — new waitlist entry', icon: 'bell',   color: 'green'  },
    ],
    dashboard: (s) => [
      { lbl: 'Parent Name', val: s.contactName || s.name || '—', set: !!(s.contactName || s.name) },
      { lbl: 'Role',        val: s.role    || '—', set: !!s.role    },
      { lbl: 'Child Age',   val: s.childAge || '—', set: !!s.childAge },
      { lbl: 'Care Type',   val: s.careType || '—', set: !!s.careType },
      { lbl: 'Service',     val: 'Join Waiting List', set: true },
      { lbl: 'Status', val: 'Added to Waitlist', badge: 'orange', set: true },
      { lbl: 'Start Date',  val: s.startMonth || '—', set: !!s.startMonth },
      { lbl: 'Lead Source', val: 'Website AI Chat', set: true },
      { lbl: 'Next Action', val: 'Notify when space available', set: true },
      { lbl: 'Assigned To', val: 'Admissions Team', set: true },
      { lbl: 'Last Activity', val: 'Just now', set: true },
    ],
  },

  /* ── 5. Parent FAQ ───────────────────────────────────── */
  'faq': {
    name: 'Parent FAQ',
    completeMsg: 'FAQ Answered — 3 Questions',
    completeBadge: 'FAQ Answered',
    completeBadgeColor: 'blue',

    stages: {
      start: {
        ai: "Hi {name}! 👋 I'm trained on everything about Sunshine Nursery. What would you like to know?",
        replies: [
          { label: '⏰ Opening hours',    val: 'What are your opening hours?',              next: 'ans-hours',    collect: null },
          { label: '🍽️ Meals',           val: 'What meals do you provide?',                next: 'ans-meals',    collect: null },
          { label: '🔒 Safety',           val: 'How do you keep children safe?',            next: 'ans-safety',   collect: null },
          { label: '📚 Curriculum',       val: 'What\'s your curriculum like?',             next: 'ans-curriculum', collect: null },
          { label: '🤧 Sick child policy', val: 'What\'s your sick child policy?',         next: 'ans-sick',     collect: null },
          { label: '👨‍👩‍👧 Sibling discount', val: 'Do you offer a sibling discount?',      next: 'ans-sibling',  collect: null },
        ]
      },
      'ans-hours': {
        ai: "We're open Monday to Friday, 7:30 AM to 6:30 PM ⏰ We're closed on bank holidays and for two weeks over Christmas. We send all parents our annual holiday schedule at the start of each year so you can plan ahead. What else would you like to know?",
        actions: ['kb-searched', 'faq-answered'],
        progress: 2,
        replies: [
          { label: '🍽️ Meals',             val: 'Tell me about the meals.', next: 'ans-meals', collect: null },
          { label: '🔒 Safety',             val: 'And your safety measures?', next: 'ans-safety', collect: null },
          { label: '📅 Book a tour',        val: 'I\'d like to book a tour!', next: 'suggest-tour', collect: null },
          { label: "That's all, thanks!",   val: "That answered my question, thank you!", next: 'wrap-up', collect: null },
        ]
      },
      'ans-meals': {
        ai: "We provide fresh, nutritious meals every day 🍽️ — breakfast, lunch and a hot afternoon snack. Our kitchen team prepares everything fresh on-site. We cater for all allergies and dietary requirements; just let us know. All meals are included in the monthly fee. Anything else?",
        actions: ['kb-searched', 'faq-answered'],
        progress: 2,
        replies: [
          { label: '⏰ Opening hours',    val: 'What are your opening hours?', next: 'ans-hours', collect: null },
          { label: '🔒 Safety',           val: 'How about safety?', next: 'ans-safety', collect: null },
          { label: '📅 Book a tour',      val: 'I\'d love to book a tour!', next: 'suggest-tour', collect: null },
          { label: "That's all, thanks!", val: "That answered my question, thank you!", next: 'wrap-up', collect: null },
        ]
      },
      'ans-safety': {
        ai: "Safety is our absolute priority 🔒 All staff are DBS-checked and first-aid trained. We have a secure keypad entry — only registered parents and staff can access the building. Children are signed in and out by their registered adults only. We maintain emergency contact files and daily supervision logs for every child. Anything else?",
        actions: ['kb-searched', 'faq-answered'],
        progress: 2,
        replies: [
          { label: '📚 Curriculum',       val: 'Tell me about your curriculum.', next: 'ans-curriculum', collect: null },
          { label: '🍽️ Meals',           val: 'And what about meals?', next: 'ans-meals', collect: null },
          { label: '📅 Book a tour',      val: 'I\'d love to see it in person!', next: 'suggest-tour', collect: null },
          { label: "That's all, thanks!", val: "That answered my question, thank you!", next: 'wrap-up', collect: null },
        ]
      },
      'ans-curriculum': {
        ai: "We follow a play-based early learning approach 📚 — covering language development, fine and gross motor skills, social-emotional development, outdoor play, music, storytelling and creative activities. Children learn through exploration and play in a nurturing, structured environment. Every child also gets a dedicated key worker. Anything else?",
        actions: ['kb-searched', 'faq-answered'],
        progress: 2,
        replies: [
          { label: '⏰ Opening hours',    val: 'What are your opening hours?', next: 'ans-hours', collect: null },
          { label: '🔒 Safety',           val: 'Tell me about safety.', next: 'ans-safety', collect: null },
          { label: '📅 Book a tour',      val: 'I\'d love to come and see it!', next: 'suggest-tour', collect: null },
          { label: "That's all, thanks!", val: "Perfect, that's really helpful!", next: 'wrap-up', collect: null },
        ]
      },
      'ans-sick': {
        ai: "Our sick child policy follows best health practice 🤧 Children with a fever above 38°C, vomiting, or contagious symptoms (like chickenpox or hand, foot and mouth) should stay home until they've been symptom-free for 48 hours. We'll always be in touch with you the same day if we have concerns at nursery. Anything else?",
        actions: ['kb-searched', 'faq-answered'],
        progress: 2,
        replies: [
          { label: '🍽️ Meals',           val: 'Tell me about the meals.', next: 'ans-meals', collect: null },
          { label: '📅 Book a tour',      val: 'I\'d love to come and visit!', next: 'suggest-tour', collect: null },
          { label: "That's all, thanks!", val: "Perfect, that answered my question!", next: 'wrap-up', collect: null },
        ]
      },
      'ans-sibling': {
        ai: "Yes! 😊 We offer a 10% sibling discount for second children enrolled at the same time. It's applied automatically to the younger child's fees. We also accept all Government Childcare Funding — 15 and 30-hour entitlements. Shall I send you a full fee breakdown?",
        actions: ['kb-searched', 'faq-answered'],
        progress: 2,
        replies: [
          { label: '📧 Send fee guide',   val: 'Yes, please send the fee guide.', next: 'wrap-up', collect: null },
          { label: '📅 Book a tour',      val: 'I\'d love to book a tour instead!', next: 'suggest-tour', collect: null },
          { label: "That's great, thanks!", val: "Brilliant, that's really helpful!", next: 'wrap-up', collect: null },
        ]
      },
      'suggest-tour': {
        ai: "Wonderful! Tours are available Tuesday, Wednesday and Thursday at 10:00 AM or 2:00 PM. Our admissions team will be in touch within the hour to confirm your slot. Looking forward to showing you around! 🏫",
        actions: ['conversation-saved', 'escalation-offered'],
        progress: 5,
        type: 'complete',
      },
      'wrap-up': {
        ai: "My pleasure, {name}! 😊 Feel free to come back anytime with more questions. If you'd like to come and see us, tours run Tuesday to Thursday at 10:00 AM or 2:00 PM. I've saved this conversation so our admissions team has full context. Have a wonderful day!",
        actions: ['conversation-saved', 'escalation-offered'],
        progress: 5,
        type: 'complete',
      },
    },
    allActions: [
      { id: 'kb-searched',       label: 'Knowledge base searched',           icon: 'brain',  color: 'blue'   },
      { id: 'faq-answered',      label: 'FAQ answered from knowledge base',  icon: 'check',  color: 'green'  },
      { id: 'conversation-saved',label: 'Conversation saved to CRM',         icon: 'db',     color: 'purple' },
      { id: 'escalation-offered',label: 'Escalation to manager available',   icon: 'bell',   color: 'amber'  },
    ],
    dashboard: (s) => [
      { lbl: 'Parent Name', val: s.name || '—', set: !!s.name },
      { lbl: 'Role',        val: s.role || '—', set: !!s.role },
      { lbl: 'Child Age',   val: '—', set: false },
      { lbl: 'Care Type',   val: '—', set: false },
      { lbl: 'Service',     val: 'Parent FAQ', set: true },
      { lbl: 'Status', val: 'FAQ Answered', badge: 'blue', set: true },
      { lbl: 'Tour Date',   val: '—', set: false },
      { lbl: 'Lead Source', val: 'Website AI Chat', set: true },
      { lbl: 'Next Action', val: 'Escalate if needed', set: true },
      { lbl: 'Assigned To', val: 'AI Employee', set: true },
      { lbl: 'Last Activity', val: 'Just now', set: true },
    ],
  },

  /* ── 6. Request Callback ─────────────────────────────── */
  'callback': {
    name: 'Request Callback',
    completeMsg: 'Staff Callback Scheduled',
    completeBadge: 'Callback Scheduled',
    completeBadgeColor: 'purple',

    stages: {
      start: {
        ai: "Hi {name}! 👋 I'll arrange a callback for you right away. What's the best time for our team to reach you?",
        replies: [
          { label: 'This morning',    val: 'This morning',          next: 'reason', collect: 'callTime' },
          { label: 'This afternoon',  val: 'This afternoon (~2pm)', next: 'reason', collect: 'callTime' },
          { label: 'Tomorrow AM',     val: 'Tomorrow morning',      next: 'reason', collect: 'callTime' },
          { label: 'Any time today',  val: 'Any time today',        next: 'reason', collect: 'callTime' },
        ]
      },
      'reason': {
        ai: "Noted! What's the main reason for your call? This helps us get the right person to call you.",
        actions: ['callback-requested'],
        progress: 1,
        replies: [
          { label: 'Fees & pricing',   val: 'I have questions about fees and pricing.', next: 'contact', collect: 'callReason' },
          { label: 'Availability',     val: 'I want to ask about availability.',         next: 'contact', collect: 'callReason' },
          { label: 'Book a tour',      val: 'I\'d like to discuss booking a tour.',      next: 'contact', collect: 'callReason' },
          { label: 'General query',    val: 'I have a general query.',                   next: 'contact', collect: 'callReason' },
        ]
      },
      'contact': {
        ai: "Almost done! I just need your phone number to confirm the callback. Use the demo details below or type your own:",
        actions: ['reason-noted'],
        progress: 2,
        type: 'contact',
        next: 'confirmed',
        demoContact: { name: 'Emma Thompson', phone: '07700 900123', email: 'emma@email.com' }
      },
      'confirmed': {
        ai: "Sorted, {name}! ✅ A callback is confirmed for {callTime}. Our admissions manager will call {phone} and is fully briefed on your query. I've also set a WhatsApp reminder for you 30 minutes before. We'll see you then! 📞",
        actions: ['time-confirmed', 'staff-task-created', 'parent-notified', 'crm-updated'],
        progress: 5,
        type: 'complete',
      },
    },
    allActions: [
      { id: 'callback-requested',  label: 'Callback requested',                    icon: 'phone', color: 'green'  },
      { id: 'reason-noted',        label: 'Topic noted — {callReason}',            icon: 'doc',   color: 'blue'   },
      { id: 'time-confirmed',      label: 'Preferred time captured — {callTime}',  icon: 'clock', color: 'blue'   },
      { id: 'staff-task-created',  label: 'Staff task created — admissions mgr',   icon: 'task',  color: 'purple' },
      { id: 'parent-notified',     label: 'Parent notified — WhatsApp reminder set', icon: 'wa',  color: 'green'  },
      { id: 'crm-updated',         label: 'CRM record updated',                    icon: 'db',    color: 'amber'  },
    ],
    dashboard: (s) => [
      { lbl: 'Parent Name', val: s.contactName || s.name || '—', set: !!(s.contactName || s.name) },
      { lbl: 'Role',        val: s.role      || '—', set: !!s.role      },
      { lbl: 'Child Age',   val: '—', set: false },
      { lbl: 'Care Type',   val: '—', set: false },
      { lbl: 'Service',     val: 'Request Callback', set: true },
      { lbl: 'Status', val: 'Callback Scheduled', badge: 'purple', set: true },
      { lbl: 'Call Time',   val: s.callTime  || '—', set: !!s.callTime  },
      { lbl: 'Lead Source', val: 'Website AI Chat', set: true },
      { lbl: 'Next Action', val: s.callTime ? `Call at ${s.callTime}` : 'Awaiting confirmation', set: true },
      { lbl: 'Assigned To', val: 'Admissions Manager', set: true },
      { lbl: 'Last Activity', val: 'Just now', set: true },
    ],
  },

  /* ── 7. Review Management ────────────────────────────── */
  'review': {
    name: 'Review Management',
    completeMsg: 'Review Request Sent — Thank You ⭐',
    completeBadge: 'Review Sent',
    completeBadgeColor: 'amber',

    stages: {
      start: {
        ai: "Hi {name}! 👋 Thank you for reaching out to us. How was your experience with Sunshine Nursery?",
        replies: [
          { label: '⭐ Loved it!',        val: 'Loved it! Our experience was wonderful ⭐', next: 'positive', collect: 'sentiment' },
          { label: '😊 Really positive',  val: 'Really positive — we were very happy.', next: 'positive', collect: 'sentiment' },
          { label: '😕 Had some concerns', val: 'We had some concerns we\'d like to raise.', next: 'negative', collect: 'sentiment' },
          { label: '😐 It was okay',      val: 'It was okay — some good, some could improve.', next: 'mixed', collect: 'sentiment' },
        ]
      },
      'positive': {
        ai: "That's wonderful to hear! 😊 Thank you so much — it genuinely means everything to our whole team. If you have a spare 2 minutes, leaving a Google review would help other local families discover us. I'm sending you a direct review link right now ⭐",
        actions: ['positive-detected', 'thanks-sent'],
        progress: 2,
        replies: [
          { label: '⭐ Yes, I\'d love to!', val: 'Absolutely! I\'d be happy to leave a review.', next: 'send-review-link', collect: null },
          { label: 'Maybe another time',    val: 'I\'ll try to do it another time.',              next: 'polite-decline',  collect: null },
        ]
      },
      'send-review-link': {
        ai: "Thank you so much, {name}! 💙 Your Google review link has been sent to your email and WhatsApp — it takes less than 2 minutes. Every single review makes a real difference to our little nursery family. You're amazing!",
        actions: ['review-link-sent', 'review-logged'],
        progress: 5,
        type: 'complete',
      },
      'polite-decline': {
        ai: "No problem at all, {name}! 😊 The link will be there whenever you're ready. Thank you for the kind words — they mean the world to all of us. Have a wonderful day!",
        actions: ['review-logged'],
        progress: 4,
        type: 'complete',
      },
      'negative': {
        ai: "I'm so sorry to hear that, {name}. Your experience matters deeply to us. Could you share a little more so we can understand what happened?",
        actions: ['negative-detected'],
        progress: 2,
        replies: [
          { label: 'Communication issue',   val: 'There was a communication issue.',          next: 'resolve-neg', collect: 'concern' },
          { label: 'About the facilities',  val: 'It was about the facilities.',              next: 'resolve-neg', collect: 'concern' },
          { label: 'About a staff member',  val: 'It involved a member of staff.',            next: 'resolve-neg', collect: 'concern' },
          { label: 'Admin / billing issue', val: 'There was an admin or billing problem.',    next: 'resolve-neg', collect: 'concern' },
        ]
      },
      'resolve-neg': {
        ai: "Thank you for sharing this with us, {name}. I've flagged this directly to our nursery manager who will contact you personally within 2 hours to listen and resolve this. This never leaves the public eye — it's a private, direct conversation. I'm so sorry for any upset caused.",
        actions: ['staff-alerted', 'resolution-task', 'crm-updated-neg'],
        progress: 5,
        type: 'complete',
        completeMsg: 'Private Resolution — Manager Alerted',
        completeBadge: 'Staff Follow-up Required',
        completeBadgeColor: 'amber',
      },
      'mixed': {
        ai: "Thank you for your honesty, {name}. We'd love to understand both what worked well and where we could do better. Could you tell me a bit more?",
        actions: ['mixed-detected'],
        progress: 2,
        replies: [
          { label: 'Happy to share',    val: 'Sure, I\'d be happy to share more.', next: 'resolve-neg', collect: null },
          { label: 'Leave a review',    val: 'I\'d prefer to leave a review directly.', next: 'send-review-link', collect: null },
        ]
      },
    },
    allActions: [
      { id: 'positive-detected', label: 'Positive sentiment detected',      icon: 'heart',  color: 'green'  },
      { id: 'thanks-sent',       label: 'Thank you message sent',           icon: 'check',  color: 'blue'   },
      { id: 'review-link-sent',  label: 'Google review link sent',          icon: 'star',   color: 'yellow' },
      { id: 'review-logged',     label: 'Review request tracked in CRM',    icon: 'db',     color: 'purple' },
      { id: 'negative-detected', label: 'Concern flagged — private follow-up', icon: 'alert', color: 'amber' },
      { id: 'mixed-detected',    label: 'Mixed feedback — monitoring',      icon: 'flag',   color: 'amber'  },
      { id: 'staff-alerted',     label: 'Manager alerted immediately',      icon: 'bell',   color: 'amber'  },
      { id: 'resolution-task',   label: 'Private resolution task created',  icon: 'task',   color: 'purple' },
      { id: 'crm-updated-neg',   label: 'CRM updated with case details',    icon: 'db',     color: 'blue'   },
    ],
    dashboard: (s) => [
      { lbl: 'Parent Name', val: s.name || '—', set: !!s.name },
      { lbl: 'Role',        val: s.role || '—', set: !!s.role },
      { lbl: 'Child Age',   val: '—', set: false },
      { lbl: 'Care Type',   val: '—', set: false },
      { lbl: 'Service',     val: 'Review Management', set: true },
      { lbl: 'Status', val: s.sentiment && s.sentiment.includes('concern') ? 'Staff Follow-up Required' : 'Review Request Sent', badge: s.sentiment && s.sentiment.includes('concern') ? 'amber' : 'amber', set: true },
      { lbl: 'Tour Date',   val: '—', set: false },
      { lbl: 'Lead Source', val: 'Post-Visit Message', set: true },
      { lbl: 'Next Action', val: 'Follow up if review posted', set: true },
      { lbl: 'Assigned To', val: 'AI Employee', set: true },
      { lbl: 'Last Activity', val: 'Just now', set: true },
    ],
  },

  /* ── 8. Existing Parent Support ─────────────────────── */
  'support': {
    name: 'Existing Parent Support',
    completeMsg: 'Support Query Resolved ✓',
    completeBadge: 'Query Resolved',
    completeBadgeColor: 'green',

    stages: {
      start: {
        ai: "Hi {name}! 👋 I'm here to help. What can I assist you with today?",
        replies: [
          { label: '📅 Holiday schedule',    val: 'I need the holiday closure dates.', next: 'holiday', collect: null },
          { label: '🤧 Sick child policy',   val: 'Can you remind me of the sick child policy?', next: 'sick', collect: null },
          { label: '⏰ Daily timings',        val: 'Can you confirm the daily timings?', next: 'timings', collect: null },
          { label: '💳 Fees & payments',     val: 'I have a question about fees or payments.', next: 'payments', collect: null },
          { label: '📄 Policy document',     val: 'Can you send me a policy document?', next: 'policy', collect: null },
          { label: '🔔 Other question',      val: 'I have a different question.', next: 'escalate', collect: null },
        ]
      },
      'holiday': {
        ai: "Here are our upcoming closure dates 📅 We close for Christmas from Friday 20th December (6:30 PM) until Thursday 2nd January 2026. We follow all standard bank holidays — these are listed in your Welcome Pack. I'm emailing you the full annual schedule right now.",
        actions: ['query-answered', 'doc-sent'],
        progress: 3,
        replies: [
          { label: 'Ask another question', val: 'I have another question.', next: 'more-help', collect: null },
          { label: "That's perfect, thanks!", val: "That's exactly what I needed, thank you!", next: 'close', collect: null },
        ]
      },
      'sick': {
        ai: "Our sick child policy 🤧 — children with a fever above 38°C, vomiting, diarrhoea, or contagious conditions (chickenpox, hand, foot and mouth, etc.) should stay home until they've been symptom-free for 48 hours. Please call us by 8:30 AM if your child won't be in. I'm sending you the full policy document now.",
        actions: ['query-answered', 'doc-sent'],
        progress: 3,
        replies: [
          { label: 'Ask another question', val: 'I have another question.', next: 'more-help', collect: null },
          { label: "That's clear, thanks!", val: "Perfect, that's what I needed.", next: 'close', collect: null },
        ]
      },
      'timings': {
        ai: "We're open Monday to Friday, 7:30 AM to 6:30 PM ⏰ Drop-off is any time from 7:30 AM, and collection should be before 6:30 PM. If you're ever running late, please call the nursery so we can let your child's key worker know. Is there anything else?",
        actions: ['query-answered'],
        progress: 3,
        replies: [
          { label: 'Ask another question', val: 'I have another question.', next: 'more-help', collect: null },
          { label: "That's great, thanks!", val: "That's great, thank you so much!", next: 'close', collect: null },
        ]
      },
      'payments': {
        ai: "For fees and payment queries, I can share your current fee schedule — or if you have a specific billing question, I'll flag it directly to our admin team to reach out to you today. Which would you prefer?",
        actions: ['query-answered'],
        progress: 2,
        replies: [
          { label: 'Send fee schedule', val: 'Please send me the fee schedule.', next: 'close-with-doc', collect: null },
          { label: 'Admin team callback', val: 'Could the admin team call me?', next: 'admin-callback', collect: null },
        ]
      },
      'close-with-doc': {
        ai: "Done! 📧 I've sent your current fee schedule to your registered email address. If anything looks off, just reply to that email and our admin team will sort it for you. Is there anything else I can help with today?",
        actions: ['query-answered', 'doc-sent', 'conversation-logged'],
        progress: 5,
        type: 'complete',
      },
      'admin-callback': {
        ai: "No problem! I've created a task for our admin team to call you today. They'll be in touch within 2 hours during business hours. I've noted your query in the system so they have full context. 😊",
        actions: ['query-answered', 'staff-task', 'conversation-logged'],
        progress: 5,
        type: 'complete',
      },
      'policy': {
        ai: "Of course! Which document do you need?",
        progress: 2,
        replies: [
          { label: 'Sick child policy',    val: 'The sick child policy please.',    next: 'sick', collect: null },
          { label: 'Holiday schedule',     val: 'The holiday schedule.',            next: 'holiday', collect: null },
          { label: 'GDPR / Data policy',  val: 'Your GDPR / data privacy policy.', next: 'gdpr', collect: null },
          { label: 'Welcome Pack',         val: 'A copy of the Welcome Pack.',      next: 'welcome-pack', collect: null },
        ]
      },
      'gdpr': {
        ai: "I've emailed you our full GDPR and Data Privacy Policy 📄 It covers how we collect, use and protect your and your child's data in line with UK GDPR regulations. If you have specific questions after reading it, our admin team is always happy to help.",
        actions: ['query-answered', 'doc-sent', 'conversation-logged'],
        progress: 5,
        type: 'complete',
      },
      'welcome-pack': {
        ai: "Of course! I've resent your Welcome Pack to your registered email address 📄 It covers everything — daily routines, policies, contact numbers, and the holiday calendar. Let us know if you can't find it in your inbox or spam!",
        actions: ['query-answered', 'doc-sent', 'conversation-logged'],
        progress: 5,
        type: 'complete',
      },
      'escalate': {
        ai: "Of course! Tell me a little about what you need and I'll make sure the right person gets back to you quickly. Or if you'd prefer, I can arrange for a member of the team to call you directly.",
        progress: 2,
        replies: [
          { label: 'Please call me', val: 'Could someone call me please?', next: 'admin-callback', collect: null },
          { label: 'Send me an email', val: 'Could you send me an email instead?', next: 'close', collect: null },
        ]
      },
      'more-help': {
        ai: "Of course! 😊 What else can I help you with?",
        progress: 3,
        replies: [
          { label: '📅 Holiday schedule',   val: 'I need the holiday closure dates.', next: 'holiday', collect: null },
          { label: '🤧 Sick child policy',  val: 'Can you remind me of the sick policy?', next: 'sick', collect: null },
          { label: '⏰ Daily timings',       val: 'What are the daily timings?', next: 'timings', collect: null },
          { label: "That's all, thanks!",   val: "That's everything, thank you!", next: 'close', collect: null },
        ]
      },
      'close': {
        ai: "My pleasure, {name}! 😊 Your query has been logged and our team has a record of this conversation. Feel free to come back anytime. Have a wonderful day! 🌟",
        actions: ['query-answered', 'conversation-logged', 'escalation-available'],
        progress: 5,
        type: 'complete',
      },
    },
    allActions: [
      { id: 'query-answered',       label: 'Parent support query answered',       icon: 'check',  color: 'green'  },
      { id: 'doc-sent',             label: 'Policy document sent via email',       icon: 'doc',    color: 'blue'   },
      { id: 'conversation-logged',  label: 'Conversation logged for audit trail', icon: 'db',     color: 'purple' },
      { id: 'staff-task',           label: 'Staff escalation task created',        icon: 'task',   color: 'amber'  },
      { id: 'escalation-available', label: 'Staff escalation available if needed', icon: 'bell',  color: 'amber'  },
    ],
    dashboard: (s) => [
      { lbl: 'Parent Name', val: s.name || 'Existing Parent', set: true },
      { lbl: 'Role',        val: s.role || '—', set: !!s.role },
      { lbl: 'Child Age',   val: 'Enrolled', set: true },
      { lbl: 'Care Type',   val: 'Enrolled', set: true },
      { lbl: 'Service',     val: 'Existing Parent Support', set: true },
      { lbl: 'Status', val: 'Query Resolved', badge: 'green', set: true },
      { lbl: 'Tour Date',   val: '—', set: false },
      { lbl: 'Lead Source', val: 'Parent Portal / Website', set: true },
      { lbl: 'Next Action', val: 'Confirm support resolved', set: true },
      { lbl: 'Assigned To', val: 'AI Employee', set: true },
      { lbl: 'Last Activity', val: 'Just now', set: true },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════
   STATE
═══════════════════════════════════════════════════════════ */
const S = {
  name: '',
  role: 'Parent',
  service: '',
  channel: 'chat',
  stage: '',
  collected: {},
  doneCount: 0,
  totalCount: 0,
  voiceTimerInt: null,
  voiceSecs: 0,
  timers: [],
};

function clearTimers() {
  S.timers.forEach(t => clearTimeout(t));
  S.timers = [];
}
function later(fn, ms) {
  const t = setTimeout(fn, PRM ? Math.min(ms * .08, 100) : ms);
  S.timers.push(t);
  return t;
}

/* ═══════════════════════════════════════════════════════════
   DOM CACHE
═══════════════════════════════════════════════════════════ */
let D = {};

function cacheDOM() {
  D = {
    nav:         document.getElementById('nav'),
    screenForm:  document.getElementById('screenForm'),
    screenDemo:  document.getElementById('screenDemo'),
    demoName:    document.getElementById('demoName'),
    svcGrid:     document.getElementById('svcGrid'),
    formErr:     document.getElementById('formErr'),
    btnStart:    document.getElementById('btnStartDemo'),
    ldGreetName: document.getElementById('ldGreetName'),
    ldGreetSvc:  document.getElementById('ldGreetSvc'),
    ldMsgs:      document.getElementById('ldMsgs'),
    ldReplies:   document.getElementById('ldReplies'),
    ldActList:   document.getElementById('ldActList'),
    ldActEmpty:  document.getElementById('ldActEmpty'),
    ldActCount:  document.getElementById('ldActCount'),
    ldComplete:  document.getElementById('ldComplete'),
    ldCompleteTitle: document.getElementById('ldCompleteTitle'),
    ldDashGrid:  document.getElementById('ldDashGrid'),
    ldDashBadge: document.getElementById('ldDashBadge'),
    progSteps:   document.querySelectorAll('.ld-progress__step'),
    progLines:   document.querySelectorAll('.ld-progress__line'),
    chTabs:      document.querySelectorAll('.ld-ch-tab'),
    viewChat:    document.getElementById('viewChat'),
    viewVoice:   document.getElementById('viewVoice'),
    viewWA:      document.getElementById('viewWhatsApp'),
    voiceWave:   document.getElementById('voiceWave'),
    voiceStatus: document.getElementById('voiceStatus'),
    voiceTimer:  document.getElementById('voiceTimer'),
    voiceTx:     document.getElementById('voiceTranscript'),
    ldRepliesVoice: document.getElementById('ldRepliesVoice'),
    waMsgs:      document.getElementById('ldWaMsgs'),
    ldRepliesWa: document.getElementById('ldRepliesWa'),
    btnChangeSvc:document.getElementById('btnChangeSvc'),
    btnTryAnother: document.getElementById('btnTryAnother'),
  };
}

/* ═══════════════════════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════════════════════ */
function token(str, extra) {
  const ctx = { name: S.name, role: S.role, ...S.collected, ...(extra || {}) };
  return str.replace(/\{(\w+)\}/g, (_, k) => ctx[k] || '');
}

function replaceTokensInAction(lbl) {
  return token(lbl);
}

function scrollMsgs(el) {
  if (el) el.scrollTop = el.scrollHeight;
}

/* ── Determine which message containers are active ─── */
function activeMsgEls() {
  const els = { msgs: null, replies: null };
  switch (S.channel) {
    case 'voice':
      els.msgs    = D.voiceTx;
      els.replies = D.ldRepliesVoice;
      break;
    case 'whatsapp':
      els.msgs    = D.waMsgs;
      els.replies = D.ldRepliesWa;
      break;
    default:
      els.msgs    = D.ldMsgs;
      els.replies = D.ldReplies;
  }
  return els;
}

/* ═══════════════════════════════════════════════════════════
   MESSAGE RENDERING
═══════════════════════════════════════════════════════════ */
function addMsg(role, text, { msgs } = activeMsgEls()) {
  if (!msgs) return;
  let el;

  if (S.channel === 'whatsapp') {
    el = document.createElement('div');
    el.className = `ld-wa-msg ld-wa-msg--${role === 'user' ? 'user' : 'ai'}`;
    const now = new Date();
    const t = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
    el.innerHTML = `<div class="ld-wa-bubble">${text}</div><div class="ld-wa-time">${t}${role === 'user' ? ' ✓✓' : ''}</div>`;
  } else {
    el = document.createElement('div');
    const cls = role === 'user' ? 'ld-msg--user' : role === 'system' ? 'ld-msg--system' : 'ld-msg--ai';
    el.className = `ld-msg ${cls}`;
    el.innerHTML = `<div class="ld-msg__bubble">${text.replace(/\n/g, '<br>')}</div>`;
  }

  msgs.appendChild(el);
  scrollMsgs(msgs);

  if (S.channel === 'voice') {
    const speaker = role === 'user' ? 'Parent' : 'AI Employee';
    const txWave  = D.voiceWave;
    if (txWave) {
      txWave.classList.remove('idle');
      txWave.classList.toggle('ai-speaking', role !== 'user');
    }
    if (D.voiceStatus) D.voiceStatus.textContent = role === 'user' ? 'Parent speaking…' : 'AI Employee speaking…';
  }
}

function addTyping({ msgs } = activeMsgEls()) {
  if (!msgs) return;
  const t = document.createElement('div');
  t.className = 'ld-typing';
  t.id = 'ld-typing-ind';
  t.innerHTML = `<span class="ld-typing-dot"></span><span class="ld-typing-dot"></span><span class="ld-typing-dot"></span>`;
  msgs.appendChild(t);
  scrollMsgs(msgs);
}

function removeTyping({ msgs } = activeMsgEls()) {
  if (!msgs) return;
  const t = msgs.querySelector('#ld-typing-ind');
  if (t) t.remove();
}

/* ═══════════════════════════════════════════════════════════
   QUICK REPLIES
═══════════════════════════════════════════════════════════ */
function showReplies(replies, repliesEl) {
  if (!repliesEl) return;
  repliesEl.innerHTML = '';
  replies.forEach((r, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ld-qr-btn';
    btn.style.animationDelay = `${i * 60}ms`;
    btn.textContent = r.label;
    btn.addEventListener('click', () => handleReply(r, repliesEl));
    repliesEl.appendChild(btn);
  });
}

function clearReplies(repliesEl) {
  if (repliesEl) repliesEl.innerHTML = '';
}

function handleReply(r, repliesEl) {
  clearReplies(repliesEl);
  const el = activeMsgEls();

  addMsg('user', r.val, el);
  if (r.collect) S.collected[r.collect] = r.val;

  later(() => {
    addTyping(el);
    later(() => {
      removeTyping(el);
      showStage(r.next, el);
    }, TYPING_MS);
  }, REPLY_DELAY);
}

/* ═══════════════════════════════════════════════════════════
   CONTACT FORM CARD
═══════════════════════════════════════════════════════════ */
function showContactCard(stage, el) {
  const { msgs, replies } = el;
  if (!msgs) return;

  const d = stage.demoContact || { name: 'Demo User', phone: '07700 900000', email: 'demo@example.com' };

  const card = document.createElement('div');
  card.className = 'ld-contact-card';
  card.innerHTML = `
    <div class="ld-contact-card__title">📋 Demo contact details (pre-filled):</div>
    <div class="ld-contact-card__demo">
      <div>Name: <span>${d.name}</span></div>
      <div>Phone: <span>${d.phone}</span></div>
      <div>Email: <span>${d.email}</span></div>
    </div>
    <button class="ld-contact-confirm" type="button">Confirm Details &amp; Continue →</button>`;

  msgs.appendChild(card);
  scrollMsgs(msgs);

  card.querySelector('.ld-contact-confirm').addEventListener('click', () => {
    card.remove();
    S.collected.contactName  = d.name;
    S.collected.phone        = d.phone;
    S.collected.email        = d.email;
    addMsg('user', `${d.name} · ${d.phone} · ${d.email}`, el);
    later(() => {
      addTyping(el);
      later(() => {
        removeTyping(el);
        showStage(stage.next, el);
      }, TYPING_MS + 200);
    }, REPLY_DELAY);
  });
}

/* ═══════════════════════════════════════════════════════════
   ACTIONS PANEL
═══════════════════════════════════════════════════════════ */
function renderActions(actions) {
  S.totalCount = actions.length;
  S.doneCount  = 0;
  D.ldActCount.textContent = `0 / ${S.totalCount}`;

  D.ldActList.innerHTML = '';
  D.ldActEmpty.style.display = 'none';
  D.ldComplete.hidden = true;

  actions.forEach(a => {
    const item = document.createElement('div');
    item.className = `ld-act-item act-${a.color}`;
    item.id = `act-${a.id}`;
    item.innerHTML = `
      <div class="ld-act-ico">${I[a.icon] || I.check}</div>
      <div class="ld-act-info">
        <div class="ld-act-label">${replaceTokensInAction(a.label)}</div>
        <div class="ld-act-status">Pending</div>
      </div>
      <div class="ld-act-check"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>`;
    D.ldActList.appendChild(item);
  });
}

function fireActions(ids) {
  ids.forEach((id, idx) => {
    later(() => {
      const el = document.getElementById(`act-${id}`);
      if (!el) return;

      /* Mark previous as pending → in-progress first */
      el.classList.add('is-pending');
      later(() => {
        el.classList.remove('is-pending');
        el.classList.add('is-done');
        const status = el.querySelector('.ld-act-status');
        if (status) status.textContent = 'Done';
        const lbl = el.querySelector('.ld-act-label');
        if (lbl) lbl.textContent = replaceTokensInAction(lbl.textContent);
        S.doneCount++;
        D.ldActCount.textContent = `${S.doneCount} / ${S.totalCount}`;
      }, 350);
    }, idx * (PRM ? 80 : 280));
  });
}

/* ═══════════════════════════════════════════════════════════
   PROGRESS BAR
═══════════════════════════════════════════════════════════ */
function setProgress(step) {
  D.progSteps.forEach((s, i) => {
    s.classList.toggle('is-done',   i + 1 <  step);
    s.classList.toggle('is-active', i + 1 === step);
  });
  D.progLines.forEach((l, i) => {
    l.classList.toggle('is-done', i + 1 < step);
  });
}

/* ═══════════════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════════════ */
function renderDashboard(ctx, badgeText, badgeColor) {
  const flow  = FLOWS[S.service];
  if (!flow) return;
  const cells = flow.dashboard({ name: S.name, role: S.role, ...S.collected, ...ctx });

  D.ldDashGrid.innerHTML = '';
  cells.forEach(c => {
    const cell = document.createElement('div');
    cell.className = 'ld-dash-cell';

    if (c.badge) {
      cell.innerHTML = `<div class="ld-dash-cell-lbl">${c.lbl}</div>
        <div class="ld-dash-status${c.set ? ' st-' + c.badge : ''}">${c.set ? c.val : '—'}</div>`;
    } else {
      cell.innerHTML = `<div class="ld-dash-cell-lbl">${c.lbl}</div>
        <div class="ld-dash-cell-val${c.set ? ' is-set' : ''}">${c.set ? c.val : '—'}</div>`;
    }
    D.ldDashGrid.appendChild(cell);
  });

  if (badgeText) {
    D.ldDashBadge.textContent = badgeText;
    D.ldDashBadge.className   = `ld-dash__badge${badgeColor ? ' st-' + badgeColor : ''}`;
  }
}

/* ═══════════════════════════════════════════════════════════
   COMPLETE STATE
═══════════════════════════════════════════════════════════ */
function showComplete(stage) {
  const flow       = FLOWS[S.service];
  const msg        = stage.completeMsg  || flow.completeMsg;
  const badge      = stage.completeBadge || flow.completeBadge;
  const badgeColor = stage.completeBadgeColor || flow.completeBadgeColor;

  D.ldCompleteTitle.textContent = msg;
  D.ldComplete.hidden = false;

  renderDashboard({}, badge, badgeColor);
  D.ldDashBadge.textContent = badge;
  D.ldDashBadge.className   = `ld-dash__badge st-${badgeColor}`;
}

/* ═══════════════════════════════════════════════════════════
   STAGE ENGINE
═══════════════════════════════════════════════════════════ */
function showStage(stageId, el) {
  el = el || activeMsgEls();
  const flow  = FLOWS[S.service];
  if (!flow) return;
  const stage = flow.stages[stageId];
  if (!stage) return;

  S.stage = stageId;

  /* Resolve AI message text */
  const aiText = token(stage.ai || '');

  /* Fire stage-entry actions */
  if (stage.actions && stage.actions.length) {
    later(() => fireActions(stage.actions), 200);
    if (stage.progress) later(() => setProgress(stage.progress), 400);
  }

  /* Render dashboard progressively */
  if (stage.progress) {
    later(() => renderDashboard({}, null, null), 600);
  }

  /* Show AI message */
  if (aiText) addMsg('ai', aiText, el);

  /* Complete state */
  if (stage.type === 'complete') {
    later(() => showComplete(stage), 800);
    return;
  }

  /* Contact form card */
  if (stage.type === 'contact') {
    later(() => showContactCard(stage, el), 400);
    return;
  }

  /* Quick replies */
  if (stage.replies && stage.replies.length) {
    later(() => showReplies(stage.replies, el.replies), 500);
  }
}

/* ═══════════════════════════════════════════════════════════
   VOICE CHANNEL
═══════════════════════════════════════════════════════════ */
function startVoiceTimer() {
  stopVoiceTimer();
  S.voiceSecs = 0;
  if (D.voiceTimer) D.voiceTimer.textContent = '00:00';
  if (D.voiceStatus) D.voiceStatus.textContent = 'Connected';

  S.voiceTimerInt = setInterval(() => {
    S.voiceSecs++;
    const m = Math.floor(S.voiceSecs / 60).toString().padStart(2, '0');
    const s = (S.voiceSecs % 60).toString().padStart(2, '0');
    if (D.voiceTimer) D.voiceTimer.textContent = `${m}:${s}`;
  }, 1000);
}

function stopVoiceTimer() {
  if (S.voiceTimerInt) clearInterval(S.voiceTimerInt);
  S.voiceTimerInt = null;
}

function activateVoiceWave() {
  if (D.voiceWave) {
    D.voiceWave.classList.remove('idle');
    D.voiceWave.classList.add('ai-speaking');
  }
}

function idleVoiceWave() {
  if (D.voiceWave) {
    D.voiceWave.classList.add('idle');
    D.voiceWave.classList.remove('ai-speaking');
  }
}

/* ═══════════════════════════════════════════════════════════
   CHANNEL SWITCHING
═══════════════════════════════════════════════════════════ */
function switchChannel(ch) {
  S.channel = ch;

  D.chTabs.forEach(t => {
    const isActive = t.dataset.channel === ch;
    t.classList.toggle('is-active', isActive);
    t.setAttribute('aria-selected', isActive);
  });

  D.viewChat.classList.toggle('is-hidden',      ch !== 'chat');
  D.viewVoice.classList.toggle('is-hidden',     ch !== 'voice');
  D.viewWA.classList.toggle('is-hidden',        ch !== 'whatsapp');

  if (ch === 'voice') {
    activateVoiceWave();
    startVoiceTimer();
    if (D.voiceStatus) D.voiceStatus.textContent = 'Connected';
  } else {
    stopVoiceTimer();
    idleVoiceWave();
  }
}

/* ═══════════════════════════════════════════════════════════
   DEMO START
═══════════════════════════════════════════════════════════ */
function startDemo() {
  const name    = D.demoName.value.trim();
  const service = S.service;

  /* Validation */
  if (!name) {
    D.formErr.textContent = 'Please enter your first name.';
    D.formErr.hidden = false;
    D.demoName.focus();
    return;
  }
  if (!service) {
    D.formErr.textContent = 'Please choose a service to demo.';
    D.formErr.hidden = false;
    return;
  }
  D.formErr.hidden = true;

  S.name = name;
  S.collected = {};
  S.stage = 'start';

  const flow = FLOWS[service];
  if (!flow) return;

  /* Transition screens */
  D.screenForm.classList.add('is-hidden');
  D.screenDemo.classList.remove('is-hidden');
  window.scrollTo({ top: 0, behavior: PRM ? 'auto' : 'smooth' });

  /* Update greeting bar */
  D.ldGreetName.textContent = name;
  D.ldGreetSvc.textContent  = flow.name;

  /* Clear chat areas */
  D.ldMsgs.innerHTML         = '';
  D.ldReplies.innerHTML      = '';
  D.voiceTx.innerHTML        = '';
  D.ldRepliesVoice.innerHTML = '';
  D.waMsgs.innerHTML         = '';
  D.ldRepliesWa.innerHTML    = '';

  /* Reset channel to chat */
  switchChannel('chat');

  /* Render actions (pending) */
  renderActions(flow.allActions);

  /* Render dashboard skeleton */
  renderDashboard({}, 'In Progress', null);
  D.ldDashBadge.textContent = 'Demo Running';
  D.ldDashBadge.className   = 'ld-dash__badge';

  /* Reset progress */
  setProgress(0);

  /* Start conversation */
  later(() => showStage('start'), 400);
}

/* ═══════════════════════════════════════════════════════════
   NAV SCROLL
═══════════════════════════════════════════════════════════ */
function initNav() {
  const onScroll = () => D.nav && D.nav.classList.toggle('is-scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ═══════════════════════════════════════════════════════════
   FORM EVENTS
═══════════════════════════════════════════════════════════ */
function initFormEvents() {
  /* Service card selection */
  D.svcGrid.addEventListener('click', e => {
    const card = e.target.closest('[data-service]');
    if (!card) return;
    const id = card.dataset.service;
    S.service = id;

    document.querySelectorAll('.lf__svc-card').forEach(c => {
      c.classList.toggle('is-active', c.dataset.service === id);
      c.setAttribute('aria-pressed', c.dataset.service === id ? 'true' : 'false');
    });
    D.formErr.hidden = true;
  });

  D.svcGrid.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('[data-service]');
      if (card) { e.preventDefault(); card.click(); }
    }
  });

  /* Role selector */
  document.querySelectorAll('.lf__role-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lf__role-btn').forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      S.role = btn.dataset.role;
    });
  });

  /* Start demo button */
  D.btnStart.addEventListener('click', startDemo);
  D.demoName.addEventListener('keydown', e => { if (e.key === 'Enter') startDemo(); });

  /* Channel tabs */
  D.chTabs.forEach(tab => {
    tab.addEventListener('click', () => switchChannel(tab.dataset.channel));
  });

  /* Change service button */
  D.btnChangeSvc.addEventListener('click', () => {
    clearTimers();
    stopVoiceTimer();
    D.screenDemo.classList.add('is-hidden');
    D.screenForm.classList.remove('is-hidden');
    window.scrollTo({ top: 0, behavior: PRM ? 'auto' : 'smooth' });
  });

  /* Try another service */
  D.btnTryAnother.addEventListener('click', () => {
    clearTimers();
    stopVoiceTimer();
    D.screenDemo.classList.add('is-hidden');
    D.screenForm.classList.remove('is-hidden');
    D.ldComplete.hidden = true;
    /* Scroll to service selector */
    later(() => {
      const grid = document.getElementById('svcGrid');
      if (grid) grid.scrollIntoView({ behavior: PRM ? 'auto' : 'smooth', block: 'center' });
    }, 200);
  });
}

/* ═══════════════════════════════════════════════════════════
   SMOOTH ANCHORS
═══════════════════════════════════════════════════════════ */
function initAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: PRM ? 'auto' : 'smooth', block: 'start' });
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  cacheDOM();
  initNav();
  initFormEvents();
  initAnchors();

  /* Idle voice wave */
  idleVoiceWave();

  /* Clear form error on name input */
  if (D.demoName) {
    D.demoName.addEventListener('input', () => {
      if (D.demoName.value.trim()) D.formErr.hidden = true;
    });
  }
});
