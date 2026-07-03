'use strict';
/* ============================================================
   DIGITAL RISE — AI AGENT PLATFORM DATA
   Rebuild: Agency-first, Agent-1-centric
   ============================================================ */

window.AD = {};

/* ── Storage ─────────────────────────────────────────────── */
AD.store = {
  get(k, fb=null) { try { const v=localStorage.getItem('dr_'+k); return v!==null?JSON.parse(v):fb; } catch { return fb; } },
  set(k, val)     { try { localStorage.setItem('dr_'+k, JSON.stringify(val)); } catch {} },
  remove(k)       { localStorage.removeItem('dr_'+k); },
  clearAll()      { Object.keys(localStorage).filter(k=>k.startsWith('dr_')).forEach(k=>localStorage.removeItem(k)); },
};

/* ── Agency ──────────────────────────────────────────────── */
AD.agency = { name:'Digital Rise', plan:'Agency Pro', clients:5 };

/* ── Client Businesses ───────────────────────────────────── */
AD.defaultBusinesses = [
  { id:'b1', name:'Sunshine Nursery',     industry:'Daycare',       status:'active', plan:'Professional',
    website:'sunshinenursery.ca',    phone:'+1 905-555-0101', email:'hello@sunshinenursery.ca',
    whatsapp:'+1 905-555-0101',      location:'Brampton, ON',  color:'#7C3AED', initial:'SN', setupScore:92 },
  { id:'b2', name:'Smile Dental Studio',  industry:'Dental Clinic', status:'active', plan:'Professional',
    website:'smiledentalstudio.ca',  phone:'+1 416-555-0202', email:'info@smiledentalstudio.ca',
    whatsapp:'+1 416-555-0202',      location:'Toronto, ON',   color:'#0891B2', initial:'SD', setupScore:85 },
  { id:'b3', name:"Bella's Restaurant",   industry:'Restaurant',    status:'active', plan:'Starter',
    website:'bellasrestaurant.ca',   phone:'+1 647-555-0303', email:'book@bellasrestaurant.ca',
    whatsapp:'+1 647-555-0303',      location:'Mississauga, ON',color:'#D97706', initial:'BR', setupScore:70 },
  { id:'b4', name:'ProBuild Contractors', industry:'Contractor',    status:'active', plan:'Professional',
    website:'probuildcontractors.ca',phone:'+1 905-555-0404', email:'quotes@probuild.ca',
    whatsapp:'+1 905-555-0404',      location:'Hamilton, ON',  color:'#16A34A', initial:'PB', setupScore:55 },
  { id:'b5', name:'Glow Beauty Lounge',   industry:'Beauty Salon',  status:'active', plan:'Starter',
    website:'glowbeautylounge.ca',   phone:'+1 416-555-0505', email:'book@glowbeauty.ca',
    whatsapp:'+1 416-555-0505',      location:'Vaughan, ON',   color:'#EC4899', initial:'GL', setupScore:78 },
];
AD.businesses = AD.store.get('businesses', AD.defaultBusinesses);

/* ── Agent Stats per Business ────────────────────────────── */
AD.agentStats = {
  b1: { conversations:312, leads:47, qualified:31, bookings:24, avgResponse:'8s',  faqRate:78, conversion:66 },
  b2: { conversations:203, leads:31, qualified:19, bookings:14, avgResponse:'6s',  faqRate:83, conversion:45 },
  b3: { conversations:89,  leads:12, qualified:7,  bookings:9,  avgResponse:'11s', faqRate:71, conversion:58 },
  b4: { conversations:45,  leads:8,  qualified:4,  bookings:3,  avgResponse:'14s', faqRate:62, conversion:37 },
  b5: { conversations:178, leads:28, qualified:18, bookings:16, avgResponse:'9s',  faqRate:76, conversion:57 },
};

/* ── Dashboard KPIs ──────────────────────────────────────── */
AD.kpis = {
  activeBusinesses:   5,
  agentsLive:         5,
  conversationsHandled: 827,
  leadsCaptured:      126,
  qualifiedLeads:     79,
  avgResponseTime:    '9s',
  conversionToBooking:'24%',
  needsSetup:         1,
};

/* ── Website Enquiry Leads ───────────────────────────────── */
AD.defaultLeads = [
  { id:'l1',  bizId:'b1', biz:'Sunshine Nursery',    name:'Sarah Mitchell',  phone:'+1 905-551-1001', email:'sarah.m@email.com',
    enquiryType:'Toddler Care',       source:'Website Chat', status:'Qualified',  qualScore:85,
    nextAction:'Tour booked Jul 8',    lastActivity:'2 hr ago',   notes:'2yo daughter, Sep start, interested in full-time',
    qualAnswers:{ childAge:'2 years', startMonth:'September 2026', schedule:'Full-time', tourInterest:'Yes' } },
  { id:'l2',  bizId:'b2', biz:'Smile Dental Studio', name:'James Thompson',  phone:'+1 416-552-2002', email:'james.t@email.com',
    enquiryType:'New Patient',         source:'Website Chat', status:'Booked',     qualScore:92,
    nextAction:'Appt Jul 10 2pm',      lastActivity:'5 min ago',  notes:'Teeth whitening, new patient, referred by friend',
    qualAnswers:{ treatment:'Teeth Whitening', insurance:'Private', urgency:'Medium', preferredTime:'Afternoons' } },
  { id:'l3',  bizId:'b4', biz:'ProBuild Contractors', name:'Mike Davidson',  phone:'+1 905-554-4004', email:'mike.d@email.com',
    enquiryType:'Deck Build Quote',    source:'Website Chat', status:'New',        qualScore:60,
    nextAction:'Send quote',           lastActivity:'3 hr ago',   notes:'20x30 deck, August start, needs quote fast',
    qualAnswers:{ projectType:'Deck Build', location:'Hamilton', timeline:'August 2026', budget:'$15–20k' } },
  { id:'l4',  bizId:'b5', biz:'Glow Beauty Lounge',  name:'Emma Lau',        phone:'+1 416-555-4004', email:'emma.l@email.com',
    enquiryType:'Appointment Booking', source:'Website Chat', status:'Booked',     qualScore:90,
    nextAction:'Appt Sat Jul 12',      lastActivity:'32 min ago', notes:'Gel mani+pedi, prefers mornings',
    qualAnswers:{ service:'Gel Manicure + Pedicure', preferredDay:'Saturday', preferredTime:'Morning' } },
  { id:'l5',  bizId:'b3', biz:"Bella's Restaurant",  name:'David Santos',    phone:'+1 647-553-3003', email:'david.s@email.com',
    enquiryType:'Event Booking',       source:'Website Chat', status:'Follow-up',  qualScore:72,
    nextAction:'Confirm menu package', lastActivity:'6 hr ago',   notes:'Birthday dinner for 12, Jul 19',
    qualAnswers:{ eventType:'Birthday Dinner', guestCount:'12', date:'July 19', specialReq:'Private room' } },
  { id:'l6',  bizId:'b1', biz:'Sunshine Nursery',    name:'Nathan Osei',     phone:'+1 905-551-7007', email:'nathan.o@email.com',
    enquiryType:'Preschool Enquiry',   source:'Website Chat', status:'Qualified',  qualScore:78,
    nextAction:'Tour scheduled',       lastActivity:'3 hr ago',   notes:'Twin boys, Sep start, needs 2 spots',
    qualAnswers:{ childAge:'3.5 years (twins)', startMonth:'September', schedule:'Full-time', tourInterest:'Yes' } },
  { id:'l7',  bizId:'b2', biz:'Smile Dental Studio', name:'Priya Sharma',    phone:'+1 416-552-6006', email:'priya.s@email.com',
    enquiryType:'Invisalign Consult',  source:'Website Chat', status:'New',        qualScore:65,
    nextAction:'Follow up tomorrow',   lastActivity:'1 hr ago',   notes:'Budget-conscious, interested in Invisalign',
    qualAnswers:{ treatment:'Invisalign', insurance:'Partial', urgency:'Low', preferredTime:'Evenings' } },
  { id:'l8',  bizId:'b5', biz:'Glow Beauty Lounge',  name:'Chloe Martin',    phone:'+1 416-555-8008', email:'chloe.m@email.com',
    enquiryType:'Bridal Package',      source:'Website Chat', status:'Qualified',  qualScore:88,
    nextAction:'Send package info',    lastActivity:'Yesterday',  notes:'Wedding Aug 15, needs trial session',
    qualAnswers:{ service:'Bridal Hair & Makeup', weddingDate:'August 15 2026', trialNeeded:'Yes' } },
  { id:'l9',  bizId:'b4', biz:'ProBuild Contractors', name:'Lisa Chen',      phone:'+1 905-554-9009', email:'lisa.c@email.com',
    enquiryType:'Basement Renovation', source:'Website Chat', status:'Follow-up',  qualScore:58,
    nextAction:'Call back Monday',     lastActivity:'Yesterday',  notes:'Budget $40k, permit questions',
    qualAnswers:{ projectType:'Basement Reno', location:'Hamilton', budget:'$40k', timeline:'October 2026' } },
  { id:'l10', bizId:'b1', biz:'Sunshine Nursery',    name:'Aisha Patel',     phone:'+1 905-551-1010', email:'aisha.p@email.com',
    enquiryType:'Infant Care Enquiry', source:'Website Chat', status:'Won',        qualScore:95,
    nextAction:'Enrolled — Sep 2026',  lastActivity:'2 days ago', notes:'6-month infant, enrolled successfully',
    qualAnswers:{ childAge:'6 months', startMonth:'September', schedule:'Full-time', tourInterest:'Completed' } },
];
AD.leads = AD.store.get('leads', AD.defaultLeads);

/* ── Recent Activity ─────────────────────────────────────── */
AD.recentActivity = [
  { ico:'👤', msg:'Sarah Mitchell enquired about Toddler Care — qualified, tour booked for Jul 8', time:'2 min ago',   biz:'Sunshine Nursery',    type:'lead',     bizId:'b1' },
  { ico:'💬', msg:'Website Enquiry Agent answered 4 FAQ enquiries at Smile Dental Studio',         time:'15 min ago',  biz:'Smile Dental Studio', type:'faq',      bizId:'b2' },
  { ico:'📅', msg:'James Thompson booked a new patient consultation for Jul 10 at 2pm',             time:'32 min ago',  biz:'Smile Dental Studio', type:'booking',  bizId:'b2' },
  { ico:'👤', msg:'Mike Davidson submitted a deck build quote request',                             time:'3 hrs ago',   biz:'ProBuild Contractors',type:'lead',     bizId:'b4' },
  { ico:'💬', msg:'Enquiry Agent handled 7 conversations at Glow Beauty Lounge',                   time:'4 hrs ago',   biz:'Glow Beauty Lounge',  type:'faq',      bizId:'b5' },
  { ico:'📞', msg:'Callback request captured — Lisa Chen (ProBuild Contractors)',                  time:'Yesterday',   biz:'ProBuild Contractors',type:'callback',  bizId:'b4' },
  { ico:'⚡', msg:"Knowledge base trained for Sunshine Nursery — 12 FAQs updated",                time:'2 days ago',  biz:'Sunshine Nursery',    type:'training', bizId:'b1' },
  { ico:'👤', msg:'Chloe Martin enquired about bridal package — qualified lead',                   time:'Yesterday',   biz:'Glow Beauty Lounge',  type:'lead',     bizId:'b5' },
];

/* ── Top Questions ───────────────────────────────────────── */
AD.topQuestions = [
  { q:'What are your fees?',                    count:47, pct:85, bizId:'b1', intent:'Pricing'      },
  { q:'Do you have availability in September?', count:38, pct:70, bizId:'b1', intent:'Availability' },
  { q:'Can I book a tour?',                     count:31, pct:56, bizId:'b1', intent:'Tour'         },
  { q:'Do you accept government subsidies?',    count:28, pct:51, bizId:'b1', intent:'Subsidy'      },
  { q:'What age groups do you take?',           count:24, pct:44, bizId:'b1', intent:'Programs'     },
  { q:'How much is teeth whitening?',           count:19, pct:35, bizId:'b2', intent:'Pricing'      },
  { q:'Are you accepting new patients?',        count:16, pct:29, bizId:'b2', intent:'Availability' },
  { q:'What services do you offer?',            count:14, pct:25, bizId:'b1', intent:'Services'     },
];

/* ── Enquiry Types ───────────────────────────────────────── */
AD.enquiryTypes = [
  { type:'Pricing & Fees',          count:127, pct:41 },
  { type:'Availability & Waitlist', count:89,  pct:29 },
  { type:'Tours & Visits',          count:62,  pct:20 },
  { type:'Curriculum & Services',   count:31,  pct:10 },
];

/* ── Knowledge Base ──────────────────────────────────────── */
AD.kbDefaults = {
  b1: {
    hours:          'Mon–Fri 7:30am–6pm, Sat 9am–1pm (limited staffing)',
    ageGroups:      'Infant (6wk–12m), Toddler (12m–3yrs), Preschool (3–5yrs), School Age (5–12yrs)',
    services:       'Full-time care, Part-time care, School-age after-school programme, Summer camp',
    fees:           'Infant from $1,800/mo, Toddler from $1,200/mo, Preschool from $1,100/mo, School Age from $650/mo',
    subsidy:        'CWELCC and CARE subsidies accepted. Up to 100% subsidy for eligible families.',
    meals:          'Nutritious meals and snacks included. Dietary restrictions and allergies accommodated.',
    curriculum:     'Play-based, Reggio Emilia inspired, nature and outdoor learning focus',
    tours:          'Mon–Fri at 10am and 2pm. 30 minutes. Book via chat, WhatsApp, or phone.',
    availability:   'Limited Toddler spots for September 2026. Infant Room waitlist only.',
    waitlist:       'Free to join — no deposit. We contact you when a spot opens.',
    siblingDiscount:'10% sibling discount on the second child\'s monthly fees.',
    sickPolicy:     '24-hour symptom-free rule. Children with fever, vomiting, or contagious illness stay home.',
    bookingLink:    'https://sunshinenursery.ca/tour',
    reviewLink:     'https://g.page/r/sunshinenursery/review',
    escalation:     'Subsidy eligibility → Director Sarah Chen | Medical needs → call directly',
  },
  b2: {
    hours:      'Mon–Fri 8am–6pm, Sat 8am–2pm. Same-day emergency slots available.',
    services:   'Check-up & Clean, Teeth Whitening, Invisalign, Implants, Veneers, Emergency, Root Canal',
    fees:       'Check-up from $180 (insurance covered). Whitening from $450. Invisalign from $4,200.',
    subsidy:    'Direct billing for most major insurance providers. Call to confirm coverage.',
    tours:      '',
    bookingLink:'https://smiledentalstudio.ca/book',
    reviewLink: 'https://g.page/r/smiledentalstudio/review',
    escalation: 'Treatment plans → Dr. Patel | Insurance → office@smiledentalstudio.ca',
  },
  b3: {
    hours:      'Tue–Sun 11:30am–10pm. Closed Mondays.',
    services:   'À la carte dining, Private events (up to 50 guests), Catering, Corporate lunch packages',
    fees:       'Dinner mains $28–$52. Private room from $500/event. Corporate lunch from $38/person.',
    tours:      '',
    bookingLink:'https://bellasrestaurant.ca/reserve',
    reviewLink: 'https://g.page/r/bellasrestaurant/review',
    escalation: 'Events → Rosa Bella | Large groups → call directly',
  },
  b4: {
    hours:      'Mon–Fri 7am–6pm. Sat by appointment only.',
    services:   'Deck & Fence, Basement Renovation, Kitchen Remodel, Garage Conversion, Commercial Fit-out',
    fees:       'Free quote within 48hrs of site visit. Deck from $15k. Basement reno from $35k.',
    tours:      '',
    bookingLink:'https://probuildcontractors.ca/quote',
    reviewLink: 'https://g.page/r/probuildcontractors/review',
    escalation: 'Permits & compliance → Owner Mike D. | Complex projects → call directly',
  },
  b5: {
    hours:      'Tue–Sat 9am–7pm, Sun 10am–5pm. Closed Mondays.',
    services:   'Hair Cut & Colour, Balayage, Gel Manicure & Pedicure, Lash Lift, Brow Lamination, Bridal Packages',
    fees:       'Haircut from $65. Gel Mani from $55. Bridal from $450. Payment by card or e-transfer.',
    tours:      '',
    bookingLink:'https://glowbeautylounge.ca/book',
    reviewLink: 'https://g.page/r/glowbeautylounge/review',
    escalation: 'Bridal packages → Manager Luna | Complex colour → book consult',
  },
};
