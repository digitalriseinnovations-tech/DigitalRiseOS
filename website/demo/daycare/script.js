/* =============================================================
   DIGITAL RISE OS — AI EMPLOYEE DEMO
   website/demo/daycare/script.js

   8 fully scripted service flows.
   Each flow: conversation timeline + live actions + CRM update.
   ============================================================= */

'use strict';

/* ── Globals ───────────────────────────────────────────── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const TYPING_DURATION = prefersReducedMotion ? 0 : 900;

/* ── SVG icon library ──────────────────────────────────── */
const ICO = {
  user:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  check:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  wa:       `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,
  db:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
  bell:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  clock:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  star:     `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  mail:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  phone:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.49 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.72-.72a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  tag:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
  list:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  brain:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.96-3 2.5 2.5 0 0 1-1.32-4.24 3 3 0 0 1 .34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.96-3 2.5 2.5 0 0 0 1.32-4.24 3 3 0 0 0-.34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z"/></svg>`,
  doc:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  flag:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`,
  repeat:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
  search:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  heart:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  shield:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  alert:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  users:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  task:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
};

/* ── Service icon HTML for service bar ─────────────────── */
const SVC_ICO_HTML = {
  tour:         `<div class="svc-card-ico svc-ico--purple"  style="width:36px;height:36px;border-radius:10px">${ICO.calendar}</div>`,
  availability: `<div class="svc-card-ico svc-ico--blue"    style="width:36px;height:36px;border-radius:10px">${ICO.search}</div>`,
  fees:         `<div class="svc-card-ico svc-ico--amber"   style="width:36px;height:36px;border-radius:10px">${ICO.tag}</div>`,
  waitlist:     `<div class="svc-card-ico svc-ico--orange"  style="width:36px;height:36px;border-radius:10px">${ICO.users}</div>`,
  faq:          `<div class="svc-card-ico svc-ico--green"   style="width:36px;height:36px;border-radius:10px">${ICO.brain}</div>`,
  callback:     `<div class="svc-card-ico svc-ico--indigo"  style="width:36px;height:36px;border-radius:10px">${ICO.phone}</div>`,
  review:       `<div class="svc-card-ico svc-ico--yellow"  style="width:36px;height:36px;border-radius:10px">${ICO.star}</div>`,
  support:      `<div class="svc-card-ico svc-ico--teal"    style="width:36px;height:36px;border-radius:10px">${ICO.shield}</div>`,
};

/* ═══════════════════════════════════════════════════════════
   SERVICE DEFINITIONS
   Each service: actions[], timeline[], dashboard{}
═══════════════════════════════════════════════════════════ */
const SERVICES = {

  /* ── 1. Book a Daycare Tour ──────────────────────────── */
  tour: {
    name: 'Book a Daycare Tour',
    completeMsg: 'Tour Booked Successfully 🎉',
    actions: [
      { id: 'lead',     label: 'Lead captured',                      icon: 'user',     color: 'green'  },
      { id: 'qual',     label: 'Parent qualified — 3yr, September',   icon: 'check',    color: 'blue'   },
      { id: 'booked',   label: 'Tour booked — Thursday 10:00 AM',     icon: 'calendar', color: 'purple' },
      { id: 'wa',       label: 'WhatsApp confirmation sent',          icon: 'wa',       color: 'green'  },
      { id: 'crm',      label: 'CRM lead created',                    icon: 'db',       color: 'blue'   },
      { id: 'staff',    label: 'Staff notified',                      icon: 'bell',     color: 'amber'  },
      { id: 'remind',   label: '24hr reminder scheduled',             icon: 'clock',    color: 'amber'  },
      { id: 'review',   label: 'Review request prepared',             icon: 'star',     color: 'yellow' },
    ],
    timeline: [
      { t: 0,     type: 'msg',    role: 'parent', text: "Hi! I'd like to book a tour of your daycare, please.",                                                                                  meta: 'Parent · Website Chat' },
      { t: 400,   type: 'typing' },
      { t: 1500,  type: 'msg',    role: 'ai',     text: "Hi! 👋 We'd love to show you around. How old is your child, and when are you looking to start?",                                         meta: 'AI · 8 seconds' },
      { t: 1700,  type: 'action', id: 'lead' },
      { t: 2400,  type: 'msg',    role: 'parent', text: "She's 3 years old. We're hoping to start in September.",                                                                                 meta: 'Parent' },
      { t: 2750,  type: 'typing' },
      { t: 3850,  type: 'msg',    role: 'ai',     text: "Wonderful! 🎉 We do have places available for 3-year-olds from September. We run tours Monday to Friday. Would morning or afternoon suit you best?", meta: 'AI' },
      { t: 4050,  type: 'action', id: 'qual' },
      { t: 4800,  type: 'msg',    role: 'parent', text: "Thursday morning would be perfect.",                                                                                                     meta: 'Parent' },
      { t: 5100,  type: 'typing' },
      { t: 6200,  type: 'msg',    role: 'ai',     text: "Thursday at 10:00 AM is available 📅 Could I take your name, mobile number and email to confirm your booking?",                         meta: 'AI' },
      { t: 7100,  type: 'msg',    role: 'parent', text: "Sarah Mitchell, 780-555-0198, sarah@email.com",                                                                                         meta: 'Parent' },
      { t: 7450,  type: 'typing' },
      { t: 8850,  type: 'msg',    role: 'ai',     text: "All confirmed, Sarah! 🎉 Your tour is booked for Thursday at 10:00 AM. I've sent a WhatsApp confirmation to 780-555-0198 and a calendar invite is on its way. We look forward to meeting you and your daughter!", meta: 'AI · Tour confirmed' },
      { t: 9050,  type: 'action', id: 'booked' },
      { t: 9300,  type: 'action', id: 'wa' },
      { t: 9550,  type: 'action', id: 'crm' },
      { t: 9800,  type: 'action', id: 'staff' },
      { t: 10050, type: 'action', id: 'remind' },
      { t: 10300, type: 'action', id: 'review' },
      { t: 11400, type: 'complete' },
    ],
    dashboard: {
      'Parent Name': { val: 'Sarah Mitchell', set: true },
      'Child Age':   { val: '3 years', set: true },
      'Service':     { val: 'Book a Daycare Tour', set: true },
      'Status':      { val: 'Tour Booked', badge: 'status-green', set: true },
      'Source':      { val: 'Website AI Chat', set: true },
      'Next Action': { val: 'Tour — Thursday 10:00 AM', set: true },
      'Assigned To': { val: 'Admissions Team', set: true },
      'Last Activity': { val: 'Just now', set: true },
    }
  },

  /* ── 2. Check Availability ───────────────────────────── */
  availability: {
    name: 'Check Availability',
    completeMsg: 'Availability Confirmed — 2 Places Left',
    actions: [
      { id: 'avail',   label: 'Availability checked — 2 places (3yr)', icon: 'search', color: 'green'  },
      { id: 'places',  label: 'Places confirmed — full-time, Sept',     icon: 'check',  color: 'blue'   },
      { id: 'tagged',  label: 'Lead tagged — high-intent',              icon: 'flag',   color: 'purple' },
      { id: 'saved',   label: 'Lead saved to CRM',                      icon: 'db',     color: 'blue'   },
      { id: 'alert',   label: 'Admissions team alerted',                icon: 'bell',   color: 'amber'  },
      { id: 'fu',      label: 'Follow-up scheduled in 1 hour',          icon: 'clock',  color: 'amber'  },
    ],
    timeline: [
      { t: 0,    type: 'msg',    role: 'parent', text: "Hi! Do you have any spaces available for a 3-year-old? We're hoping to start in September.",                                              meta: 'Parent · Website Chat' },
      { t: 400,  type: 'typing' },
      { t: 1450, type: 'msg',    role: 'ai',     text: "Hi! 👋 Yes — we currently have limited spaces for 3-year-olds. Are you looking for full-time or part-time care?",                        meta: 'AI · 6 seconds' },
      { t: 1650, type: 'action', id: 'avail' },
      { t: 2400, type: 'msg',    role: 'parent', text: "Full-time from September, please.",                                                                                                       meta: 'Parent' },
      { t: 2700, type: 'typing' },
      { t: 3750, type: 'msg',    role: 'ai',     text: "Great news! We have 2 full-time places remaining for September for your daughter's age group — but they do go quickly. Would you like to come and see us? I can book a tour right now 📅", meta: 'AI' },
      { t: 3950, type: 'action', id: 'places' },
      { t: 4700, type: 'msg',    role: 'parent', text: "Yes, definitely! Can I book a tour?",                                                                                                    meta: 'Parent' },
      { t: 5000, type: 'typing' },
      { t: 6050, type: 'msg',    role: 'ai',     text: "Absolutely! We have Thursday at 10:00 AM or 2:00 PM available this week. Which works best for you?",                                    meta: 'AI' },
      { t: 6950, type: 'msg',    role: 'parent', text: "Thursday 10am please.",                                                                                                                  meta: 'Parent' },
      { t: 7250, type: 'typing' },
      { t: 8300, type: 'msg',    role: 'ai',     text: "Perfect! ✅ Thursday at 10:00 AM is now reserved for you. Our admissions team will be in touch shortly to confirm all the details. We'll make sure those 2 spaces stay on your radar!", meta: 'AI' },
      { t: 8500, type: 'action', id: 'tagged' },
      { t: 8750, type: 'action', id: 'saved' },
      { t: 9000, type: 'action', id: 'alert' },
      { t: 9250, type: 'action', id: 'fu' },
      { t: 10300, type: 'complete' },
    ],
    dashboard: {
      'Parent Name': { val: 'Not provided yet', set: false },
      'Child Age':   { val: '3 years', set: true },
      'Service':     { val: 'Check Availability', set: true },
      'Status':      { val: 'High-Intent Lead', badge: 'status-amber', set: true },
      'Source':      { val: 'Website AI Chat', set: true },
      'Next Action': { val: 'Tour reserved — Thu 10:00 AM', set: true },
      'Assigned To': { val: 'Admissions Team', set: true },
      'Last Activity': { val: 'Just now', set: true },
    }
  },

  /* ── 3. Ask About Fees ───────────────────────────────── */
  fees: {
    name: 'Ask About Fees',
    completeMsg: 'Fee Guide & Brochure Sent',
    actions: [
      { id: 'fee',     label: 'Fee enquiry received',                     icon: 'tag',    color: 'green'  },
      { id: 'shared',  label: 'Full fee breakdown shared',                 icon: 'check',  color: 'blue'   },
      { id: 'funding', label: 'Funding info included (15–30 free hrs)',    icon: 'doc',    color: 'blue'   },
      { id: 'email',   label: 'Brochure + fee guide sent via email',       icon: 'mail',   color: 'green'  },
      { id: 'fu',      label: 'Follow-up scheduled — 48 hours',            icon: 'clock',  color: 'amber'  },
      { id: 'note',    label: 'CRM note added',                            icon: 'db',     color: 'purple' },
    ],
    timeline: [
      { t: 0,    type: 'msg',    role: 'parent', text: "Hi! How much does full-time daycare cost per month?",                                                                                     meta: 'Parent · Website Chat' },
      { t: 400,  type: 'typing' },
      { t: 1450, type: 'msg',    role: 'ai',     text: "Hi! 👋 Our full-time fees start from £1,150/month for 5 days per week. This includes all meals (breakfast, lunch, hot dinner), nappies, wipes, activities and daily photo updates through our parent app.",  meta: 'AI · 7 seconds' },
      { t: 1650, type: 'action', id: 'fee' },
      { t: 1900, type: 'action', id: 'shared' },
      { t: 2600, type: 'msg',    role: 'parent', text: "That sounds good. Is there a sibling discount?",                                                                                         meta: 'Parent' },
      { t: 2900, type: 'typing' },
      { t: 3950, type: 'msg',    role: 'ai',     text: "Yes! We offer a 10% sibling discount for second children 😊 We also accept all Government Childcare Funding — eligible families can receive 15 to 30 hours free per week. Shall I send you our full fee guide and brochure?", meta: 'AI' },
      { t: 4150, type: 'action', id: 'funding' },
      { t: 4900, type: 'msg',    role: 'parent', text: "Yes please, that would be really helpful!",                                                                                              meta: 'Parent' },
      { t: 5200, type: 'typing' },
      { t: 6300, type: 'msg',    role: 'ai',     text: "Done! 📧 I've sent our complete fee guide, funding eligibility breakdown and a full nursery brochure. Would you also like to book a tour to come and see the facilities in person?", meta: 'AI' },
      { t: 6500, type: 'action', id: 'email' },
      { t: 7200, type: 'msg',    role: 'parent', text: "That would be lovely. Let me check my diary.",                                                                                           meta: 'Parent' },
      { t: 7500, type: 'typing' },
      { t: 8400, type: 'msg',    role: 'ai',     text: "Of course! Take your time. Our admissions team will follow up with you within 48 hours to arrange a tour at a time that suits you perfectly. Talk soon! 😊", meta: 'AI' },
      { t: 8600, type: 'action', id: 'fu' },
      { t: 8850, type: 'action', id: 'note' },
      { t: 9800, type: 'complete' },
    ],
    dashboard: {
      'Parent Name': { val: 'Not provided', set: false },
      'Child Age':   { val: 'Not specified', set: false },
      'Service':     { val: 'Ask About Fees', set: true },
      'Status':      { val: 'Brochure Sent', badge: 'status-blue', set: true },
      'Source':      { val: 'Website AI Chat', set: true },
      'Next Action': { val: 'Follow-up in 48 hours', set: true },
      'Assigned To': { val: 'Admissions Team', set: true },
      'Last Activity': { val: 'Just now', set: true },
    }
  },

  /* ── 4. Join Waiting List ────────────────────────────── */
  waitlist: {
    name: 'Join Waiting List',
    completeMsg: 'Added to Waitlist Successfully',
    actions: [
      { id: 'nosp',    label: 'No space — waitlist offered',             icon: 'alert',  color: 'amber'  },
      { id: 'detail',  label: 'Child details saved — 2yr, January',      icon: 'user',   color: 'blue'   },
      { id: 'list',    label: 'Waitlist entry created',                   icon: 'list',   color: 'purple' },
      { id: 'crm',     label: 'Parent added to CRM',                     icon: 'db',     color: 'blue'   },
      { id: 'notify',  label: 'Monthly follow-up scheduled',             icon: 'repeat',  color: 'amber'  },
      { id: 'staff',   label: 'Staff notified — new waitlist addition',  icon: 'bell',   color: 'green'  },
    ],
    timeline: [
      { t: 0,    type: 'msg',    role: 'parent', text: "Hi! Do you have any spaces at all? We're quite flexible on dates.",                                                                       meta: 'Parent · Website Chat' },
      { t: 400,  type: 'typing' },
      { t: 1450, type: 'msg',    role: 'ai',     text: "Hi! 👋 We're currently at full capacity for our next two intakes, but we do maintain an active waitlist. How old is your child, and when would you ideally like to start?", meta: 'AI · 7 seconds' },
      { t: 1650, type: 'action', id: 'nosp' },
      { t: 2400, type: 'msg',    role: 'parent', text: "He's 2 years old. We'd ideally like to start from January.",                                                                            meta: 'Parent' },
      { t: 2700, type: 'typing' },
      { t: 3750, type: 'msg',    role: 'ai',     text: "Thank you! We do have several families on our January waitlist for 2-year-olds. I'll add your son right away. Could I take your name, phone number and email so we can contact you the moment a place opens up?", meta: 'AI' },
      { t: 4550, type: 'msg',    role: 'parent', text: "James Cooper, 07891 234567, james@email.com",                                                                                           meta: 'Parent' },
      { t: 4850, type: 'typing' },
      { t: 6000, type: 'msg',    role: 'ai',     text: "Thank you, James! ✅ Your family has been added to our January waitlist for 2-year-olds. You'll be the very first to know when a space becomes available. We'll also send you a monthly update so you're never left wondering. 😊", meta: 'AI' },
      { t: 6200, type: 'action', id: 'detail' },
      { t: 6450, type: 'action', id: 'list' },
      { t: 6700, type: 'action', id: 'crm' },
      { t: 6950, type: 'action', id: 'notify' },
      { t: 7200, type: 'action', id: 'staff' },
      { t: 8300, type: 'complete' },
    ],
    dashboard: {
      'Parent Name': { val: 'James Cooper', set: true },
      'Child Age':   { val: '2 years', set: true },
      'Service':     { val: 'Join Waiting List', set: true },
      'Status':      { val: 'Added to Waitlist', badge: 'status-orange', set: true },
      'Source':      { val: 'Website AI Chat', set: true },
      'Next Action': { val: 'Notify when space available', set: true },
      'Assigned To': { val: 'Admissions Team', set: true },
      'Last Activity': { val: 'Just now', set: true },
    }
  },

  /* ── 5. Parent FAQ ───────────────────────────────────── */
  faq: {
    name: 'Parent FAQ',
    completeMsg: '3 Parent Questions Answered',
    actions: [
      { id: 'q1',     label: 'FAQ answered — opening hours',            icon: 'check',  color: 'green'  },
      { id: 'q2',     label: 'FAQ answered — nappies & meals policy',   icon: 'check',  color: 'green'  },
      { id: 'q3',     label: 'FAQ answered — staff ratios (1:8)',       icon: 'check',  color: 'green'  },
      { id: 'kb',     label: 'Knowledge base consulted × 3',            icon: 'brain',  color: 'blue'   },
      { id: 'log',    label: 'Conversation saved to CRM',               icon: 'db',     color: 'purple' },
      { id: 'esc',    label: 'Escalation to manager offered',           icon: 'users',  color: 'amber'  },
    ],
    timeline: [
      { t: 0,    type: 'msg',    role: 'parent', text: "Hi! What are your opening hours?",                                                                                                       meta: 'Parent · Website Chat' },
      { t: 400,  type: 'typing' },
      { t: 1350, type: 'msg',    role: 'ai',     text: "Hi! 👋 We're open Monday to Friday, 7:30 AM to 6:30 PM. We're closed on bank holidays and for two weeks over Christmas. Extended holiday cover can sometimes be arranged in advance — just give us a heads up!",  meta: 'AI · Knowledge base' },
      { t: 1550, type: 'action', id: 'q1' },
      { t: 2350, type: 'msg',    role: 'parent', text: "Great, thanks. Do you provide nappies and wipes?",                                                                                      meta: 'Parent' },
      { t: 2650, type: 'typing' },
      { t: 3700, type: 'msg',    role: 'ai',     text: "Yes! 😊 Nappies, wipes and nappy cream are all included in your monthly fee — you don't need to bring a thing. We also provide all meals, morning and afternoon snacks, and sun cream during summer months.",      meta: 'AI · Knowledge base' },
      { t: 3900, type: 'action', id: 'q2' },
      { t: 4650, type: 'msg',    role: 'parent', text: "What's the staff-to-child ratio for 3-year-olds?",                                                                                      meta: 'Parent' },
      { t: 4950, type: 'typing' },
      { t: 6000, type: 'msg',    role: 'ai',     text: "For our 3–4 year olds we maintain a 1:8 ratio — which exceeds Ofsted requirements ✅ For babies and younger toddlers under 2, it's 1:3. All our staff are DBS-checked and many hold Level 3 childcare qualifications. Would you like to speak with our nursery manager directly?", meta: 'AI · Knowledge base' },
      { t: 6200, type: 'action', id: 'q3' },
      { t: 6450, type: 'action', id: 'kb' },
      { t: 6700, type: 'action', id: 'log' },
      { t: 6950, type: 'action', id: 'esc' },
      { t: 8000, type: 'complete' },
    ],
    dashboard: {
      'Parent Name': { val: 'Not collected', set: false },
      'Child Age':   { val: 'Not specified', set: false },
      'Service':     { val: 'Parent FAQ', set: true },
      'Status':      { val: 'FAQ Answered', badge: 'status-blue', set: true },
      'Source':      { val: 'Website AI Chat', set: true },
      'Next Action': { val: 'Escalate to manager if needed', set: true },
      'Assigned To': { val: 'AI Employee', set: true },
      'Last Activity': { val: 'Just now', set: true },
    }
  },

  /* ── 6. Request Callback ─────────────────────────────── */
  callback: {
    name: 'Request Callback',
    completeMsg: 'Staff Callback Scheduled — 2:00 PM',
    actions: [
      { id: 'req',    label: 'Callback requested',                      icon: 'phone',  color: 'green'  },
      { id: 'time',   label: 'Preferred time captured — 2:00 PM',      icon: 'clock',  color: 'blue'   },
      { id: 'topic',  label: 'Topic noted — fees & availability',       icon: 'doc',    color: 'blue'   },
      { id: 'task',   label: 'Staff task created — admissions manager', icon: 'task',   color: 'purple' },
      { id: 'notif',  label: 'Parent notified — WhatsApp reminder set', icon: 'wa',     color: 'green'  },
      { id: 'crm',    label: 'CRM record updated',                      icon: 'db',     color: 'amber'  },
    ],
    timeline: [
      { t: 0,    type: 'msg',    role: 'parent', text: "Hi! Can someone give me a call back? I have a few questions about your nursery.",                                                        meta: 'Parent · Website Chat' },
      { t: 400,  type: 'typing' },
      { t: 1400, type: 'msg',    role: 'ai',     text: "Of course! 😊 We'd love to chat. What's the best time to reach you, and what would you like to ask about?",                           meta: 'AI · 6 seconds' },
      { t: 1600, type: 'action', id: 'req' },
      { t: 2350, type: 'msg',    role: 'parent', text: "This afternoon around 2pm would be great. I want to ask about fees and whether you have September spaces.",                              meta: 'Parent' },
      { t: 2650, type: 'typing' },
      { t: 3700, type: 'msg',    role: 'ai',     text: "Perfect — 2:00 PM today it is! Could I take your name and the best number to reach you on?",                                          meta: 'AI' },
      { t: 4550, type: 'msg',    role: 'parent', text: "Emma Thompson, 07700 900123",                                                                                                           meta: 'Parent' },
      { t: 4850, type: 'typing' },
      { t: 6050, type: 'msg',    role: 'ai',     text: "All sorted, Emma! ✅ A callback has been scheduled for you at 2:00 PM today. Our admissions manager will call 07700 900123. I've also set a WhatsApp reminder for you at 1:30 PM so you don't miss it 📞", meta: 'AI' },
      { t: 6250, type: 'action', id: 'time' },
      { t: 6500, type: 'action', id: 'topic' },
      { t: 6750, type: 'action', id: 'task' },
      { t: 7000, type: 'action', id: 'notif' },
      { t: 7250, type: 'action', id: 'crm' },
      { t: 8300, type: 'complete' },
    ],
    dashboard: {
      'Parent Name': { val: 'Emma Thompson', set: true },
      'Child Age':   { val: 'Not specified', set: false },
      'Service':     { val: 'Request Callback', set: true },
      'Status':      { val: 'Callback Scheduled', badge: 'status-purple', set: true },
      'Source':      { val: 'Website AI Chat', set: true },
      'Next Action': { val: 'Call at 2:00 PM today', set: true },
      'Assigned To': { val: 'Admissions Manager', set: true },
      'Last Activity': { val: 'Just now', set: true },
    }
  },

  /* ── 7. Review Management ────────────────────────────── */
  review: {
    name: 'Review Management',
    completeMsg: 'Google Review Request Sent ⭐',
    actions: [
      { id: 'sentiment', label: 'Positive sentiment detected',           icon: 'heart',  color: 'green'  },
      { id: 'thanks',    label: 'Thank you message sent',                icon: 'check',  color: 'blue'   },
      { id: 'link',      label: 'Google review link shared',             icon: 'star',   color: 'yellow' },
      { id: 'track',     label: 'Review request tracked in CRM',        icon: 'db',     color: 'purple' },
      { id: 'enrol',     label: 'Enrolment intent noted',               icon: 'user',   color: 'blue'   },
      { id: 'crm',       label: 'CRM updated — September enrolment',    icon: 'calendar', color: 'green' },
    ],
    timeline: [
      { t: 0,    type: 'msg',    role: 'parent', text: "Hi! We came for a tour last week and absolutely loved it. The staff were so warm with the children — my daughter didn't want to leave!",  meta: 'Parent · Post-visit message' },
      { t: 400,  type: 'typing' },
      { t: 1500, type: 'msg',    role: 'ai',     text: "That's so wonderful to hear! 😊 Thank you for taking the time to visit us — we loved meeting you both. It really means the world to our whole team.",  meta: 'AI' },
      { t: 1700, type: 'action', id: 'sentiment' },
      { t: 2500, type: 'msg',    role: 'parent', text: "We're definitely enrolling our daughter in September. We can't wait to join!",                                                           meta: 'Parent' },
      { t: 2800, type: 'typing' },
      { t: 3900, type: 'msg',    role: 'ai',     text: "That's such wonderful news — we can't wait to welcome her! 🎉 If you've enjoyed your experience so far, we'd be so grateful if you could take 2 minutes to share a Google review. It really helps other local families find us. I'm sending you a direct link now ⭐", meta: 'AI' },
      { t: 4100, type: 'action', id: 'thanks' },
      { t: 4350, type: 'action', id: 'link' },
      { t: 5100, type: 'msg',    role: 'parent', text: "Of course! I'm so happy to help. You guys deserve it.",                                                                                 meta: 'Parent' },
      { t: 5400, type: 'typing' },
      { t: 6450, type: 'msg',    role: 'ai',     text: "Thank you so much, that genuinely means everything! 💙 Your Google review link has been sent to your email and WhatsApp. Every review makes such a difference to our little nursery family. See you in September!",  meta: 'AI' },
      { t: 6650, type: 'action', id: 'track' },
      { t: 6900, type: 'action', id: 'enrol' },
      { t: 7150, type: 'action', id: 'crm' },
      { t: 8200, type: 'complete' },
    ],
    dashboard: {
      'Parent Name': { val: 'Not collected', set: false },
      'Child Age':   { val: 'Not specified', set: false },
      'Service':     { val: 'Review Management', set: true },
      'Status':      { val: 'Review Request Sent', badge: 'status-amber', set: true },
      'Source':      { val: 'Post-Visit Message', set: true },
      'Next Action': { val: 'Follow up if review posted', set: true },
      'Assigned To': { val: 'AI Employee', set: true },
      'Last Activity': { val: 'Just now', set: true },
    }
  },

  /* ── 8. Existing Parent Support ─────────────────────── */
  support: {
    name: 'Existing Parent Support',
    completeMsg: 'Support Query Resolved ✓',
    actions: [
      { id: 'dates',   label: 'Holiday dates query answered',            icon: 'calendar', color: 'green'  },
      { id: 'allergy', label: 'Nut allergy flagged — kitchen & key worker', icon: 'flag', color: 'amber'  },
      { id: 'worker',  label: 'Key worker notified immediately',         icon: 'bell',   color: 'amber'  },
      { id: 'policy',  label: 'Allergy policy document sent via email',  icon: 'doc',    color: 'blue'   },
      { id: 'profile', label: 'Parent profile updated in CRM',          icon: 'db',     color: 'purple' },
      { id: 'log',     label: 'Conversation logged for audit trail',    icon: 'shield', color: 'blue'   },
    ],
    timeline: [
      { t: 0,    type: 'msg',    role: 'parent', text: "Hi! Can you tell me the Christmas holiday closure dates this year please?",                                                               meta: 'Parent · Website Chat' },
      { t: 400,  type: 'typing' },
      { t: 1400, type: 'msg',    role: 'ai',     text: "Hi! 👋 Of course. We close on Friday 20th December at 6:30 PM and re-open on Thursday 2nd January 2026. That's a 12-day closure over the Christmas period. I'll send confirmation to your email too 🎄", meta: 'AI · Knowledge base' },
      { t: 1600, type: 'action', id: 'dates' },
      { t: 2400, type: 'msg',    role: 'parent', text: "Thank you. Also — my daughter has a nut allergy. Can you make sure that's flagged on her record?",                                     meta: 'Parent' },
      { t: 2700, type: 'typing' },
      { t: 3800, type: 'msg',    role: 'ai',     text: "Absolutely — I've flagged this immediately to our kitchen team and your daughter's key worker 🔴 You'll receive a confirmation email within the hour. Is the allergy anaphylaxis risk, or a mild intolerance? We want to ensure the right protocol is in place.", meta: 'AI' },
      { t: 4000, type: 'action', id: 'allergy' },
      { t: 4250, type: 'action', id: 'worker' },
      { t: 5000, type: 'msg',    role: 'parent', text: "It's a mild intolerance — nuts make her feel unwell but it's not anaphylaxis.",                                                        meta: 'Parent' },
      { t: 5300, type: 'typing' },
      { t: 6400, type: 'msg',    role: 'ai',     text: "Noted — that's been recorded as a mild nut intolerance on your daughter's file ✅ I'm also sending you a copy of our allergy management policy for your records. Is there anything else I can help you with today? 📄", meta: 'AI' },
      { t: 6600, type: 'action', id: 'policy' },
      { t: 6850, type: 'action', id: 'profile' },
      { t: 7100, type: 'action', id: 'log' },
      { t: 8200, type: 'complete' },
    ],
    dashboard: {
      'Parent Name': { val: 'Existing Parent', set: true },
      'Child Age':   { val: 'Enrolled', set: true },
      'Service':     { val: 'Existing Parent Support', set: true },
      'Status':      { val: 'Query Resolved', badge: 'status-green', set: true },
      'Source':      { val: 'WhatsApp / Website', set: true },
      'Next Action': { val: 'Confirm allergy on record', set: true },
      'Assigned To': { val: 'Key Worker', set: true },
      'Last Activity': { val: 'Just now', set: true },
    }
  },
};


/* ═══════════════════════════════════════════════════════════
   DEMO ENGINE — DR namespace
═══════════════════════════════════════════════════════════ */
const DR = {
  /* State */
  selected:  null,   /* service id */
  running:   false,
  complete:  false,
  timers:    [],
  now:       null,   /* timestamp of demo start */

  /* DOM refs */
  el: {},

  init() {
    this.el = {
      demoArea:    document.getElementById('demoArea'),
      svcGrid:     document.getElementById('svcGrid'),
      daSvcBar:    document.getElementById('daSvcBar'),
      daSvcIco:    document.getElementById('daSvcIco'),
      daSvcName:   document.getElementById('daSvcName'),
      daMsgs:      document.getElementById('daMsgs'),
      daIdle:      document.getElementById('daIdle'),
      daActList:   document.getElementById('daActList'),
      daActEmpty:  document.getElementById('daActEmpty'),
      daComplete:  document.getElementById('daComplete'),
      daCompleteMsg: document.getElementById('daCompleteMsg'),
      daBtnStart:  document.getElementById('daBtnStart'),
      daBtnRestart:document.getElementById('daBtnRestart'),
      daCrmBadge:  document.getElementById('daCrmBadge'),
      daCrmGrid:   document.getElementById('daCrmGrid'),
      daChangeBtn: document.getElementById('daChangeBtn'),
    };

    /* Service card selection */
    this.el.svcGrid.addEventListener('click', e => {
      const card = e.target.closest('[data-service]');
      if (card) this.selectService(card.dataset.service);
    });

    /* Keyboard support for service cards */
    this.el.svcGrid.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('[data-service]');
        if (card) { e.preventDefault(); this.selectService(card.dataset.service); }
      }
    });

    this.el.daBtnStart.addEventListener('click',   () => this.startDemo());
    this.el.daBtnRestart.addEventListener('click', () => this.restartDemo());
    this.el.daChangeBtn.addEventListener('click',  () => this.scrollToServices());

    /* Nav scroll */
    const nav = document.querySelector('.nav');
    if (nav) {
      const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    /* Smooth anchors */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (!t) return;
        e.preventDefault();
        t.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      });
    });
  },

  /* ── Select a service ──────────────────────────────── */
  selectService(id) {
    if (!SERVICES[id]) return;
    this.stopDemo();
    this.selected = id;
    const svc = SERVICES[id];

    /* Update service cards */
    document.querySelectorAll('.svc-card').forEach(c => {
      c.classList.toggle('is-active', c.dataset.service === id);
    });

    /* Update service bar */
    this.el.daSvcIco.innerHTML  = SVC_ICO_HTML[id] || '';
    this.el.daSvcName.textContent = svc.name;

    /* Render action items (pending) */
    this.renderActions(svc.actions);

    /* Render CRM skeleton */
    this.renderCRM(svc.dashboard, false);

    /* Reset chat */
    this.resetChat();

    /* Show demo area */
    this.el.demoArea.classList.remove('is-hidden');
    this.el.demoArea.removeAttribute('aria-hidden');

    /* Scroll into view */
    setTimeout(() => {
      this.el.demoArea.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    }, 80);
  },

  /* ── Reset chat to idle state ──────────────────────── */
  resetChat() {
    this.running  = false;
    this.complete = false;
    this.el.daMsgs.innerHTML = '';
    const idle = document.createElement('div');
    idle.className = 'da-idle'; idle.id = 'daIdle';
    idle.innerHTML = `<div class="da-idle-orb"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div><p>Press <strong>Start Demo</strong> to begin the AI conversation</p>`;
    this.el.daMsgs.appendChild(idle);
    this.el.daBtnStart.disabled   = false;
    this.el.daBtnRestart.disabled = true;
    this.el.daComplete.hidden     = true;
    this.el.daCrmBadge.className  = 'da-crm-badge';
    this.el.daCrmBadge.textContent = 'Awaiting Demo';
  },

  /* ── Render pending action items ───────────────────── */
  renderActions(actions) {
    this.el.daActList.innerHTML = '';
    actions.forEach(a => {
      const item = document.createElement('div');
      item.className = `da-act-item act-${a.color}`;
      item.id = `act-${a.id}`;
      item.innerHTML = `
        <div class="da-act-ico">${ICO[a.icon] || ICO.check}</div>
        <div class="da-act-label">${a.label}</div>
        <div class="da-act-time">—</div>
        <div class="da-act-check"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>`;
      this.el.daActList.appendChild(item);
    });
  },

  /* ── Render CRM grid ───────────────────────────────── */
  renderCRM(dashboard, populated) {
    this.el.daCrmGrid.innerHTML = '';
    Object.entries(dashboard).forEach(([lbl, data]) => {
      const cell = document.createElement('div');
      cell.className = 'da-crm-cell';
      cell.setAttribute('data-crm-field', lbl);

      if (lbl === 'Status' && data.badge) {
        cell.innerHTML = `<div class="da-crm-cell-lbl">${lbl}</div>
          <div class="da-crm-status-badge${populated && data.set ? ' ' + data.badge : ''}">${populated && data.set ? data.val : '—'}</div>`;
      } else {
        const isSet = populated && data.set;
        cell.innerHTML = `<div class="da-crm-cell-lbl">${lbl}</div>
          <div class="da-crm-cell-val${isSet ? ' is-set' : ''}">${isSet ? data.val : '—'}</div>`;
      }
      this.el.daCrmGrid.appendChild(cell);
    });
  },

  /* ── Activate CRM ──────────────────────────────────── */
  activateCRM() {
    const svc = SERVICES[this.selected];
    if (!svc) return;
    this.renderCRM(svc.dashboard, true);
    this.el.daCrmBadge.className = 'da-crm-badge is-active';
    this.el.daCrmBadge.textContent = 'Updated';
  },

  /* ── Fire a single action item ─────────────────────── */
  fireAction(id) {
    const el = document.getElementById(`act-${id}`);
    if (!el) return;
    el.classList.add('is-fired');
    const timeEl = el.querySelector('.da-act-time');
    if (timeEl) timeEl.textContent = 'Just now';
  },

  /* ── Show a message bubble ─────────────────────────── */
  showMessage(role, text, meta) {
    /* Remove idle state */
    const idle = this.el.daMsgs.querySelector('.da-idle');
    if (idle) idle.remove();

    const wrap = document.createElement('div');
    wrap.className = `da-msg da-msg--${role}`;

    const bubble = document.createElement('div');
    bubble.className = 'da-msg-bubble';
    bubble.textContent = text;
    wrap.appendChild(bubble);

    if (meta && role !== 'system') {
      const m = document.createElement('div');
      m.className = 'da-msg-meta';
      m.textContent = meta;
      wrap.appendChild(m);
    }

    this.el.daMsgs.appendChild(wrap);
    this.el.daMsgs.scrollTop = this.el.daMsgs.scrollHeight;
  },

  /* ── Show/hide typing indicator ────────────────────── */
  showTyping() {
    const t = document.createElement('div');
    t.className = 'da-typing da-msg--ai';
    t.id = 'daTyping';
    t.innerHTML = `<div class="da-typing-dots"><span class="da-typing-dot"></span><span class="da-typing-dot"></span><span class="da-typing-dot"></span></div><span class="da-typing-lbl">AI is typing…</span>`;
    this.el.daMsgs.appendChild(t);
    this.el.daMsgs.scrollTop = this.el.daMsgs.scrollHeight;
  },

  hideTyping() {
    const t = document.getElementById('daTyping');
    if (t) t.remove();
  },

  /* ── Show complete state ───────────────────────────── */
  showComplete() {
    this.complete = true;
    const svc = SERVICES[this.selected];
    this.el.daCompleteMsg.textContent = svc ? svc.completeMsg : 'Demo Complete';
    this.el.daComplete.hidden = false;
    this.activateCRM();
  },

  /* ── Start demo ────────────────────────────────────── */
  startDemo() {
    if (this.running || this.complete || !this.selected) return;
    this.running = true;
    this.el.daBtnStart.disabled   = true;
    this.el.daBtnRestart.disabled = false;
    this.el.daCrmBadge.className  = 'da-crm-badge is-pending';
    this.el.daCrmBadge.textContent = 'Updating…';

    const svc = SERVICES[this.selected];
    if (!svc) return;

    /* Track currently active typing event */
    let typingActive = false;

    svc.timeline.forEach(event => {
      const delay = prefersReducedMotion ? Math.min(event.t * 0.1, 100) : event.t;

      const tid = setTimeout(() => {
        switch (event.type) {
          case 'msg':
            if (typingActive) { this.hideTyping(); typingActive = false; }
            this.showMessage(event.role, event.text, event.meta);
            break;
          case 'typing':
            this.showTyping();
            typingActive = true;
            break;
          case 'action':
            this.fireAction(event.id);
            break;
          case 'complete':
            this.hideTyping();
            this.running = false;
            this.showComplete();
            break;
        }
      }, delay);

      this.timers.push(tid);
    });
  },

  /* ── Stop and clear all timers ─────────────────────── */
  stopDemo() {
    this.timers.forEach(t => clearTimeout(t));
    this.timers = [];
    this.running  = false;
    this.complete = false;
  },

  /* ── Restart demo ──────────────────────────────────── */
  restartDemo() {
    if (!this.selected) return;
    this.stopDemo();
    const svc = SERVICES[this.selected];
    if (svc) this.renderActions(svc.actions);
    this.renderCRM(svc ? svc.dashboard : {}, false);
    this.resetChat();
  },

  /* ── Scroll back to service selector ──────────────── */
  scrollToServices() {
    const s = document.getElementById('services');
    if (s) s.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  },
};

/* ── Bootstrap ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => DR.init());
