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


/* ============================================================
   DRD — DIGITAL RISE PLATFORM CATALOG (v2)
   Static reference data: industries, business types, agent
   catalog, knowledge field definitions. No stored state here.
   ============================================================ */
var DRD = (function () {
  'use strict';

  /* ── Industry groups & business types ─────────────────── */
  var industryGroups = [
    { id:'childcare',    label:'Childcare & Education',  icon:'🧸', color:'#7C3AED',
      types:['Daycare','Preschool','Montessori','Tutoring Centre','Kids Activity Centre'] },
    { id:'healthcare',   label:'Clinics & Healthcare',   icon:'🩺', color:'#0891B2',
      types:['Dental Clinic','Eye Clinic','Physiotherapy Clinic','Chiropractic Clinic','Skin Clinic','Medical Clinic','Therapy Practice'] },
    { id:'events',       label:'Events & Experiences',   icon:'🎉', color:'#DB2777',
      types:['Event Planner','Wedding Planner','Party Rental Business','Birthday Decor Business','Corporate Event Agency','Conference Organiser','Exhibition Organiser','Venue'] },
    { id:'beauty',       label:'Beauty & Wellness',      icon:'💅', color:'#EC4899',
      types:['Hair Salon','Spa','Nail Salon','Lash Studio','Med Spa','Massage Clinic'] },
    { id:'home',         label:'Home & Local Services',  icon:'🛠️', color:'#16A34A',
      types:['Contractor','Cleaning Company','Plumbing','HVAC','Electrical','Landscaping','Roofing'] },
    { id:'food',         label:'Food & Dining',          icon:'🍽️', color:'#D97706',
      types:['Restaurant','Cafe','Bakery','Catering Business','Cloud Kitchen'] },
    { id:'professional', label:'Professional Services',  icon:'💼', color:'#4F46E5',
      types:['Law Firm','Accounting Firm','Consulting Firm','Insurance Agency','Marketing Agency'] },
    { id:'realestate',   label:'Real Estate',            icon:'🏠', color:'#0D9488',
      types:['Real Estate Agent','Property Management','Brokerage','Mortgage Broker'] },
    { id:'retail',       label:'Retail',                 icon:'🛍️', color:'#9333EA',
      types:['Boutique','Furniture Store','Electronics Store','Specialty Shop','Showroom'] },
  ];

  /* ── Universal agent types ─────────────────────────────── */
  var agentTypes = [
    { type:'website-enquiry',    name:'Website Enquiry Agent',      icon:'💬', channels:['website'],
      desc:'Captures website visitors, answers FAQs, qualifies leads, collects contact details.' },
    { type:'booking',            name:'Booking / Appointment Agent',icon:'📅', channels:['website','whatsapp'],
      desc:'Books appointments, tours, consultations, reservations and site visits.' },
    { type:'whatsapp-followup',  name:'WhatsApp Follow-up Agent',   icon:'📲', channels:['whatsapp'],
      desc:'Sends follow-ups, reminders, quote follow-ups and recovers incomplete enquiries.' },
    { type:'review',             name:'Review & Reputation Agent',  icon:'⭐', channels:['whatsapp','email'],
      desc:'Requests Google reviews, detects unhappy feedback, creates staff alerts.' },
    { type:'missed-call',        name:'Missed Call Recovery Agent', icon:'📞', channels:['phone','whatsapp'],
      desc:'Follows up with missed callers and captures callback requests.' },
    { type:'email-inbox',        name:'Email Inbox Agent',          icon:'📧', channels:['email'],
      desc:'Replies to email enquiries, sends brochures, qualifies leads.' },
    { type:'lead-qualification', name:'Lead Qualification Agent',   icon:'🎯', channels:['website'],
      desc:'Scores leads, asks qualification questions, assigns next action.' },
    { type:'marketing-content',  name:'Marketing Content Agent',    icon:'✨', channels:['internal'],
      desc:'Creates simple social posts, email drafts, follow-up content and campaign ideas.' },
  ];

  /* ── Industry-specific naming + extra agents ───────────── */
  var industryOverlays = {
    childcare: {
      rename: { 'website-enquiry':'Website Parent Enquiry Agent', 'booking':'Tour Booking Agent' },
      extra: [
        { type:'activity-planner',  name:'Activity Planner Agent',   icon:'🎨', channels:['internal'], desc:'Plans weekly activity themes and generates parent-friendly activity updates.' },
        { type:'waitlist-followup', name:'Waitlist Follow-up Agent', icon:'⏳', channels:['whatsapp','email'], desc:'Keeps waitlisted families warm and notifies them when spots open.' },
      ],
      recommended: ['website-enquiry','booking','whatsapp-followup','review','missed-call','activity-planner'],
    },
    healthcare: {
      rename: { 'website-enquiry':'Website Patient Enquiry Agent', 'booking':'Appointment Booking Agent' },
      extra: [
        { type:'treatment-followup', name:'Treatment Follow-up Agent', icon:'🩹', channels:['whatsapp','email'], desc:'Checks in after treatments and books follow-up appointments.' },
      ],
      recommended: ['website-enquiry','booking','treatment-followup','review','missed-call'],
    },
    events: {
      rename: { 'website-enquiry':'Event Enquiry Agent', 'booking':'Consultation Booking Agent', 'whatsapp-followup':'WhatsApp Quote Follow-up Agent' },
      extra: [
        { type:'package-recommendation', name:'Package Recommendation Agent', icon:'🎁', channels:['website'], desc:'Recommends the right event package based on guest count, budget and occasion.' },
        { type:'quote-followup',         name:'Quote Follow-up Agent',        icon:'💰', channels:['whatsapp','email'], desc:'Follows up on sent quotes and nudges undecided clients.' },
      ],
      recommended: ['website-enquiry','package-recommendation','booking','whatsapp-followup','review'],
    },
    beauty: {
      rename: { 'booking':'Appointment Booking Agent' },
      extra: [
        { type:'rebooking-followup', name:'Rebooking Follow-up Agent', icon:'💇', channels:['whatsapp'], desc:'Reminds clients when they are due for their next appointment.' },
      ],
      recommended: ['website-enquiry','booking','rebooking-followup','review','missed-call'],
    },
    home: {
      rename: { 'website-enquiry':'Quote Capture Agent', 'booking':'Site Visit Booking Agent' },
      extra: [
        { type:'estimate-followup', name:'Estimate Follow-up Agent', icon:'📐', channels:['whatsapp','email'], desc:'Follows up on estimates and answers scope questions.' },
      ],
      recommended: ['website-enquiry','booking','estimate-followup','review','missed-call'],
    },
    food: {
      rename: { 'booking':'Reservation Agent' },
      extra: [
        { type:'catering-enquiry', name:'Catering Enquiry Agent', icon:'🥂', channels:['website','email'], desc:'Handles catering and private event enquiries and captures event details.' },
      ],
      recommended: ['website-enquiry','booking','catering-enquiry','review'],
    },
    professional: {
      rename: { 'booking':'Consultation Booking Agent' },
      extra: [],
      recommended: ['website-enquiry','booking','lead-qualification','email-inbox','review'],
    },
    realestate: {
      rename: { 'booking':'Viewing Booking Agent' },
      extra: [],
      recommended: ['website-enquiry','booking','whatsapp-followup','lead-qualification','review'],
    },
    retail: {
      rename: { 'website-enquiry':'Product Enquiry Agent' },
      extra: [],
      recommended: ['website-enquiry','whatsapp-followup','review','email-inbox'],
    },
  };

  /* ── Knowledge field definitions ───────────────────────── */
  var universalFields = [
    { id:'hours',        label:'Business Hours',      ph:'e.g. Mon–Fri 7:30am–6pm' },
    { id:'services',     label:'Services',            ph:'List your main services…', ta:true },
    { id:'pricing',      label:'Pricing Notes',       ph:'Starting prices, ranges, what affects cost…', ta:true },
    { id:'faqs',         label:'FAQs',                ph:'Common questions and answers…', ta:true },
    { id:'policies',     label:'Policies',            ph:'Cancellation, refunds, deposits…', ta:true },
    { id:'bookingRules', label:'Booking Rules',       ph:'How bookings work, lead time, confirmation…', ta:true },
    { id:'escalation',   label:'Escalation Contact',  ph:'Who handles complex questions? Name + phone/email' },
    { id:'reviewLink',   label:'Google Review Link',  ph:'https://g.page/r/…' },
    { id:'whatsapp',     label:'WhatsApp Number',     ph:'+1 …' },
  ];
  var industryFields = {
    childcare: [
      { id:'ageGroups',       label:'Age Groups',          ph:'e.g. Infants 6–18mo, Toddlers 18mo–2.5y, Preschool 2.5–4y' },
      { id:'fees',            label:'Fees',                ph:'Daily/monthly rates per age group…', ta:true },
      { id:'tourTimes',       label:'Tour Days & Times',   ph:'e.g. Tue & Thu 10am, Sat 9–11am' },
      { id:'waitlistRules',   label:'Waitlist Rules',      ph:'Free to join? Deposit? Priority rules?' },
      { id:'meals',           label:'Meals',               ph:'Meals & snacks provided, allergy policy…' },
      { id:'curriculum',      label:'Curriculum',          ph:'Play-based, Montessori, HighScope…' },
      { id:'safety',          label:'Safety',              ph:'Ratios, secured entry, cameras, first-aid…' },
      { id:'siblingDiscount', label:'Sibling Discount',    ph:'e.g. 10% off second child' },
      { id:'activityThemes',  label:'Activity Themes',     ph:'Weekly themes, special programs…' },
    ],
    healthcare: [
      { id:'treatments',        label:'Treatments',              ph:'List treatments/services offered…', ta:true },
      { id:'insurance',         label:'Insurance / Direct Billing', ph:'Providers accepted, direct billing…' },
      { id:'emergency',         label:'Emergency Appointments',  ph:'Same-day policy, emergency line…' },
      { id:'practitioners',     label:'Practitioners',           ph:'Dr. names & specialties…' },
      { id:'appointmentTypes',  label:'Appointment Types',       ph:'New patient exam, cleaning, consult…' },
      { id:'newPatientProcess', label:'New Patient Process',     ph:'Forms, first visit length, what to bring…' },
    ],
    events: [
      { id:'eventTypes',    label:'Event Types',        ph:'Weddings, corporate, birthdays…' },
      { id:'packages',      label:'Packages',           ph:'Package names, inclusions, prices…', ta:true },
      { id:'addons',        label:'Add-ons',            ph:'Photo booth, florals, AV, catering…' },
      { id:'serviceArea',   label:'Service Area',       ph:'Cities/regions covered' },
      { id:'guestRange',    label:'Guest Count Range',  ph:'e.g. 20–500 guests' },
      { id:'startingPrice', label:'Starting Price',     ph:'e.g. Packages from $2,500' },
      { id:'depositRules',  label:'Deposit Rules',      ph:'e.g. 30% to secure date, balance 14 days before' },
      { id:'setupRules',    label:'Setup Rules',        ph:'Setup/teardown timing, venue requirements…' },
    ],
    beauty: [
      { id:'treatments',   label:'Treatments & Services', ph:'Cut, colour, lashes, massage…', ta:true },
      { id:'stylists',     label:'Stylists / Practitioners', ph:'Team members & specialties' },
      { id:'cancellation', label:'Cancellation Policy',   ph:'Notice period, no-show fee…' },
    ],
    home: [
      { id:'serviceArea',  label:'Service Area',   ph:'Cities/regions covered' },
      { id:'quoteProcess', label:'Quote Process',  ph:'Free quote? Site visit needed? Turnaround…' },
      { id:'warranty',     label:'Warranty',       ph:'Workmanship guarantee, materials warranty…' },
    ],
    food: [
      { id:'menu',          label:'Menu Highlights',  ph:'Signature dishes, dietary options…', ta:true },
      { id:'reservations',  label:'Reservations',     ph:'Walk-ins? Max party size? Peak times…' },
      { id:'privateEvents', label:'Private Events',   ph:'Private room capacity, minimum spend…' },
      { id:'catering',      label:'Catering',         ph:'Catering menu, min order, delivery area…' },
    ],
    professional: [
      { id:'practiceAreas', label:'Practice / Service Areas', ph:'Specialties and focus areas…', ta:true },
      { id:'consultFees',   label:'Consultation Fees',        ph:'Free first consult? Hourly rates…' },
    ],
    realestate: [
      { id:'areas',    label:'Areas Served',   ph:'Neighbourhoods/cities' },
      { id:'viewings', label:'Viewings',       ph:'How viewings are booked, virtual tours…' },
      { id:'listings', label:'Listings Info',  ph:'Where listings are published, update cadence…' },
    ],
    retail: [
      { id:'products', label:'Products',           ph:'Main product categories…', ta:true },
      { id:'returns',  label:'Returns Policy',     ph:'Return window, condition rules…' },
      { id:'delivery', label:'Delivery & Pickup',  ph:'Shipping, local delivery, in-store pickup…' },
    ],
  };

  /* ── Keyword map for rule-based tester engine ──────────── */
  var keywordMap = [
    { field:'hours',        kws:['hour','open','close','time','when are you'] },
    { field:'fees',         kws:['fee','fees','cost','price','pricing','how much','rate'] },
    { field:'pricing',      kws:['fee','fees','cost','price','pricing','how much','rate','quote','estimate'] },
    { field:'services',     kws:['service','offer','what do you','provide'] },
    { field:'treatments',   kws:['treatment','procedure','whitening','filling','cleaning','massage','facial','colour','color','cut'] },
    { field:'tourTimes',    kws:['tour','visit','look around','see the'] },
    { field:'bookingRules', kws:['book','appointment','reserve','schedule','reservation'] },
    { field:'reservations', kws:['book','reserve','reservation','table'] },
    { field:'waitlistRules',kws:['waitlist','wait list','waiting list'] },
    { field:'ageGroups',    kws:['age','how old','infant','toddler','preschool'] },
    { field:'meals',        kws:['meal','food','lunch','snack','allerg'] },
    { field:'curriculum',   kws:['curriculum','learn','program','montessori','education'] },
    { field:'safety',       kws:['safe','safety','ratio','secure','camera'] },
    { field:'siblingDiscount', kws:['sibling','second child','discount','two kids'] },
    { field:'insurance',    kws:['insurance','billing','coverage','covered'] },
    { field:'emergency',    kws:['emergency','urgent','pain','same day','same-day'] },
    { field:'practitioners',kws:['doctor','dentist','dr ','practitioner','who will'] },
    { field:'newPatientProcess', kws:['new patient','first visit','first appointment'] },
    { field:'packages',     kws:['package','bundle','include'] },
    { field:'addons',       kws:['add-on','addon','extra','photo booth','floral'] },
    { field:'serviceArea',  kws:['area','location','where do you','travel','come to'] },
    { field:'guestRange',   kws:['guest','how many people','capacity','headcount'] },
    { field:'depositRules', kws:['deposit','secure the date','hold the date','down payment'] },
    { field:'startingPrice',kws:['start','minimum','cheapest','budget'] },
    { field:'menu',         kws:['menu','dish','vegan','vegetarian','gluten'] },
    { field:'privateEvents',kws:['private','party room','event room','group'] },
    { field:'catering',     kws:['cater','catering'] },
    { field:'quoteProcess', kws:['quote','estimate','site visit'] },
    { field:'warranty',     kws:['warranty','guarantee'] },
    { field:'cancellation', kws:['cancel','reschedule','no-show','no show'] },
    { field:'policies',     kws:['policy','refund','cancel','term'] },
    { field:'faqs',         kws:['question','faq'] },
    { field:'returns',      kws:['return','refund','exchange'] },
    { field:'delivery',     kws:['deliver','shipping','pickup','pick up'] },
    { field:'escalation',   kws:['manager','complain','speak to someone','human','staff'] },
  ];

  /* ── Helpers ───────────────────────────────────────────── */
  function group(id) { return industryGroups.find(function(g){ return g.id===id; }) || null; }

  function agentsFor(groupId) {
    var ov = industryOverlays[groupId] || { rename:{}, extra:[], recommended:[] };
    var list = agentTypes.map(function(a){
      return Object.assign({}, a, {
        name: ov.rename[a.type] || a.name,
        recommended: ov.recommended.indexOf(a.type) !== -1,
      });
    });
    (ov.extra || []).forEach(function(a){
      list.push(Object.assign({}, a, { recommended: ov.recommended.indexOf(a.type) !== -1, industrySpecific:true }));
    });
    return list;
  }

  function agentDef(groupId, type) {
    return agentsFor(groupId).find(function(a){ return a.type===type; }) || null;
  }

  function fieldsFor(groupId) {
    return universalFields.concat(industryFields[groupId] || []);
  }

  return {
    industryGroups: industryGroups,
    agentTypes: agentTypes,
    industryOverlays: industryOverlays,
    universalFields: universalFields,
    industryFields: industryFields,
    keywordMap: keywordMap,
    group: group,
    agentsFor: agentsFor,
    agentDef: agentDef,
    fieldsFor: fieldsFor,
  };
})();


/* ============================================================
   DRD v3 EXTENSIONS — Intents, Agent Jobs, Scenarios, Layers
   ============================================================ */
(function () {
  'use strict';

  /* ── Intent catalog (detection keywords, ordered) ──────── */
  DRD.intents = [
    { id:'complaint',    label:'Complaint / unhappy',    kws:['complaint','unhappy','angry','terrible','awful','disappointed','refund','worst','never again'] },
    { id:'emergency',    label:'Emergency / urgent',     kws:['emergency','urgent','asap','right now','in pain','injury','injured','bleeding'] },
    { id:'speak-human',  label:'Wants a human',          kws:['speak to','talk to someone','real person','human','manager','call me back','callback'] },
    { id:'quote',        label:'Quote request',          kws:['quote','estimate','ballpark','how much would it cost for','price for my'] },
    { id:'tour',         label:'Tour request',           kws:['tour','visit','look around','come see','see the place','open house'] },
    { id:'reservation',  label:'Reservation',            kws:['reservation','reserve a table','book a table','table for'] },
    { id:'booking',      label:'Wants to book',          kws:['book','appointment','schedule','sign up','enrol','enroll','register'] },
    { id:'waitlist',     label:'Waitlist',               kws:['waitlist','wait list','waiting list'] },
    { id:'subsidy',      label:'Subsidy / funding',      kws:['subsidy','cwelcc','funding','government program','financial assistance'] },
    { id:'insurance',    label:'Insurance',              kws:['insurance','direct billing','coverage','covered by'] },
    { id:'price',        label:'Asking price',           kws:['price','pricing','cost','fee','fees','how much','rates','rate card'] },
    { id:'availability', label:'Availability',           kws:['availability','available','space','spot','opening','vacancy','do you have room','capacity'] },
    { id:'hours',        label:'Opening hours',          kws:['hours','open','close','what time','when are you'] },
    { id:'meals',        label:'Meals / food',           kws:['meal','meals','food','lunch','snack','allerg','vegan','vegetarian','gluten','menu'] },
    { id:'ages',         label:'Age groups',             kws:['age','year old','yr old','month old','toddler','infant','preschool','my son','my daughter','my child'] },
    { id:'review',       label:'Review opportunity',     kws:['review','feedback','rate you','loved it','amazing experience','great experience'] },
    { id:'services',     label:'Services enquiry',       kws:['service','services','do you do','do you offer','can you do','offer'] },
    { id:'location',     label:'Location / area',        kws:['where are you','address','located','directions','service area','do you cover','travel to'] },
    { id:'contact-info', label:'Sharing contact info',   kws:[] }, /* detected via regex */
    { id:'greeting',     label:'Greeting',               kws:['hi','hello','hey','good morning','good afternoon','good evening'] },
    { id:'thanks',       label:'Thanks',                 kws:['thank','thanks','perfect','great, ','awesome'] },
  ];

  /* ── Agent job definitions (role, purpose, behavior) ───── */
  var JOBS = {
    'website-enquiry': {
      role: 'Front-desk enquiry assistant',
      purpose: 'Greet website visitors, answer business questions instantly, qualify interest and capture contact details so no enquiry is lost.',
      intents: ['greeting','price','availability','services','hours','location','booking','tour','speak-human','complaint'],
      actions: { captureLead:true, createBooking:true, createCallback:true, whatsappFollowup:true, sendReviewLink:false, escalate:true, markHotLead:true, internalNote:true },
      escalation: ['Visitor is upset or mentions a complaint', 'Visitor asks a question with no knowledge available twice', 'Visitor explicitly asks for a human'],
      style: { tone:'warm', length:'short', cta:'soft', qualifyFirst:false, afterHours:'capture' },
      mustAsk: ['Name before ending chat', 'Phone or email before promising follow-up'],
      mustNot: ['Quote exact custom prices not in knowledge', 'Make medical/legal claims', 'Promise availability without checking'],
      followUp: 'If contact captured but no booking: suggest WhatsApp follow-up within 24h.',
    },
    'booking': {
      role: 'Booking coordinator',
      purpose: 'Convert interest into confirmed bookings — tours, appointments, consultations — with the fewest possible steps.',
      intents: ['booking','tour','reservation','availability','hours','price'],
      actions: { captureLead:true, createBooking:true, createCallback:true, whatsappFollowup:true, sendReviewLink:false, escalate:true, markHotLead:true, internalNote:true },
      escalation: ['Requested slot conflicts or urgent same-day booking', 'Group/complex booking beyond standard options'],
      style: { tone:'warm', length:'short', cta:'direct', qualifyFirst:true, afterHours:'capture' },
      mustAsk: ['Preferred day/time', 'Name and phone before confirming'],
      mustNot: ['Confirm a slot as guaranteed — always say it will be confirmed by the team'],
      followUp: 'Send confirmation + reminder 24h before the booking.',
    },
    'whatsapp-followup': {
      role: 'Follow-up specialist',
      purpose: 'Recover incomplete enquiries and nudge quotes, waitlists and bookings forward over WhatsApp.',
      intents: ['booking','quote','waitlist','price','thanks'],
      actions: { captureLead:true, createBooking:true, createCallback:true, whatsappFollowup:true, sendReviewLink:true, escalate:true, markHotLead:true, internalNote:true },
      escalation: ['Recipient replies unhappy or asks to stop messages'],
      style: { tone:'friendly', length:'short', cta:'soft', qualifyFirst:false, afterHours:'queue' },
      mustAsk: ['Whether now is a good time before long messages'],
      mustNot: ['Send more than 2 unanswered follow-ups', 'Message outside allowed hours'],
      followUp: 'Sequence: +24h gentle nudge, +72h final check-in, then stop.',
    },
    'review': {
      role: 'Reputation manager',
      purpose: 'Ask happy customers for Google reviews at the right moment, and intercept unhappy feedback before it goes public.',
      intents: ['review','thanks','complaint'],
      actions: { captureLead:false, createBooking:false, createCallback:true, whatsappFollowup:true, sendReviewLink:true, escalate:true, markHotLead:false, internalNote:true },
      escalation: ['Any negative sentiment — route internally, never to the public review link'],
      style: { tone:'grateful', length:'short', cta:'direct', qualifyFirst:false, afterHours:'queue' },
      mustAsk: ['How their experience was BEFORE sharing the review link'],
      mustNot: ['Send the review link to an unhappy customer', 'Offer incentives for reviews'],
      followUp: 'One reminder after 3 days if the review link was not used.',
    },
    'missed-call': {
      role: 'Missed-call recovery agent',
      purpose: 'Text back missed callers within a minute so the business never loses a caller to a competitor.',
      intents: ['speak-human','booking','price','availability'],
      actions: { captureLead:true, createBooking:true, createCallback:true, whatsappFollowup:true, sendReviewLink:false, escalate:true, markHotLead:true, internalNote:true },
      escalation: ['Caller indicates emergency', 'Caller is an existing customer with an active issue'],
      style: { tone:'apologetic-warm', length:'short', cta:'direct', qualifyFirst:false, afterHours:'capture' },
      mustAsk: ['What they were calling about', 'Best time for a callback'],
      mustNot: ['Leave a missed call without a follow-up message'],
      followUp: 'If no reply in 2h, one final SMS with booking link.',
    },
    'email-inbox': {
      role: 'Inbox assistant',
      purpose: 'Draft instant, on-brand replies to email enquiries, attach the right info, and flag anything needing a human.',
      intents: ['price','services','booking','quote','complaint','hours'],
      actions: { captureLead:true, createBooking:true, createCallback:true, whatsappFollowup:false, sendReviewLink:false, escalate:true, markHotLead:true, internalNote:true },
      escalation: ['Legal, refund or complaint emails', 'Attachments requiring human review'],
      style: { tone:'professional', length:'medium', cta:'soft', qualifyFirst:false, afterHours:'queue' },
      mustAsk: ['Missing details needed to answer fully'],
      mustNot: ['Send legally binding confirmations', 'Reply to obvious spam'],
      followUp: 'Bump unanswered enquiry replies after 48h.',
    },
    'lead-qualification': {
      role: 'Lead qualifier',
      purpose: 'Score and segment every lead with 2–3 smart questions so the team calls the hottest ones first.',
      intents: ['price','availability','booking','quote','services'],
      actions: { captureLead:true, createBooking:false, createCallback:true, whatsappFollowup:true, sendReviewLink:false, escalate:true, markHotLead:true, internalNote:true },
      escalation: ['Lead matches VIP criteria — notify staff immediately'],
      style: { tone:'curious', length:'short', cta:'soft', qualifyFirst:true, afterHours:'capture' },
      mustAsk: ['Timeline', 'Budget range where appropriate', 'Decision readiness'],
      mustNot: ['Ask more than 3 qualification questions in a row'],
      followUp: 'Hot leads: immediate staff alert. Warm: 24h follow-up.',
    },
    'marketing-content': {
      role: 'Content assistant',
      purpose: 'Draft social posts, follow-up messages and simple campaign ideas grounded in real business knowledge.',
      intents: ['services'],
      actions: { captureLead:false, createBooking:false, createCallback:false, whatsappFollowup:false, sendReviewLink:false, escalate:false, markHotLead:false, internalNote:true },
      escalation: [],
      style: { tone:'brand-matched', length:'medium', cta:'direct', qualifyFirst:false, afterHours:'queue' },
      mustAsk: ['Goal of the content before drafting'],
      mustNot: ['Invent offers or prices not in knowledge'],
      followUp: 'Weekly content suggestions based on imported social themes.',
    },
    /* Industry-specific */
    'activity-planner': { role:'Activity planner', purpose:'Plan weekly activity themes and draft parent-friendly updates.', intents:['services'], actions:{ internalNote:true }, escalation:[], style:{ tone:'playful', length:'medium', cta:'soft', qualifyFirst:false, afterHours:'queue' }, mustAsk:['Age group before planning'], mustNot:['Suggest activities conflicting with safety policy'], followUp:'Weekly theme suggestions.' },
    'waitlist-followup': { role:'Waitlist manager', purpose:'Keep waitlisted families warm and convert them the moment a spot opens.', intents:['waitlist','availability','ages'], actions:{ captureLead:true, createBooking:true, whatsappFollowup:true, escalate:true, internalNote:true }, escalation:['Family reports changed circumstances needing urgent placement'], style:{ tone:'warm', length:'short', cta:'direct', qualifyFirst:false, afterHours:'queue' }, mustAsk:['Whether they are still interested each check-in'], mustNot:['Promise a specific opening date'], followUp:'Monthly check-in until placed or removed.' },
    'treatment-followup': { role:'Care follow-up assistant', purpose:'Check in after treatments, catch issues early and book the next visit.', intents:['booking','emergency','thanks'], actions:{ createBooking:true, createCallback:true, escalate:true, sendReviewLink:true, internalNote:true }, escalation:['Any report of pain, swelling or complications — escalate immediately'], style:{ tone:'caring', length:'short', cta:'soft', qualifyFirst:false, afterHours:'queue' }, mustAsk:['How they are feeling post-treatment'], mustNot:['Give medical advice beyond booking guidance'], followUp:'48h post-treatment check-in, then recall reminder.' },
    'package-recommendation': { role:'Package advisor', purpose:'Match every enquiry to the right event package by guest count, budget and occasion.', intents:['quote','price','services','availability'], actions:{ captureLead:true, createBooking:true, whatsappFollowup:true, markHotLead:true, internalNote:true }, escalation:['Requests far outside standard packages'], style:{ tone:'enthusiastic', length:'medium', cta:'direct', qualifyFirst:true, afterHours:'capture' }, mustAsk:['Occasion','Guest count','Date','Budget range'], mustNot:['Discount without approval'], followUp:'Send package PDF, follow up in 48h.' },
    'quote-followup': { role:'Quote closer', purpose:'Follow up every sent quote until it becomes a yes, a no, or a scheduled call.', intents:['quote','price','thanks','booking'], actions:{ createCallback:true, whatsappFollowup:true, markHotLead:true, escalate:true, internalNote:true }, escalation:['Customer disputes quote contents'], style:{ tone:'helpful', length:'short', cta:'direct', qualifyFirst:false, afterHours:'queue' }, mustAsk:['Whether the quote covered everything they needed'], mustNot:['Pressure after a clear no'], followUp:'+48h and +5d nudges, then close as lost.' },
    'rebooking-followup': { role:'Rebooking assistant', purpose:'Bring clients back when they are due for their next appointment.', intents:['booking','thanks'], actions:{ createBooking:true, whatsappFollowup:true, sendReviewLink:true, internalNote:true }, escalation:[], style:{ tone:'friendly', length:'short', cta:'direct', qualifyFirst:false, afterHours:'queue' }, mustAsk:['Preferred day/time'], mustNot:['Message more than once per cycle'], followUp:'Due-date reminder based on service cycle.' },
    'estimate-followup': { role:'Estimate closer', purpose:'Answer scope questions and follow up estimates to win the job.', intents:['quote','price','booking'], actions:{ createCallback:true, whatsappFollowup:true, markHotLead:true, escalate:true, internalNote:true }, escalation:['Scope change requests — route to estimator'], style:{ tone:'straightforward', length:'short', cta:'direct', qualifyFirst:false, afterHours:'queue' }, mustAsk:['Timeline and decision date'], mustNot:['Change quoted prices'], followUp:'+72h nudge with financing mention if available.' },
    'catering-enquiry': { role:'Catering coordinator', purpose:'Capture event details and turn catering enquiries into quotes.', intents:['quote','services','price','availability'], actions:{ captureLead:true, createBooking:true, createCallback:true, markHotLead:true, internalNote:true }, escalation:['Events above max capacity'], style:{ tone:'warm', length:'medium', cta:'direct', qualifyFirst:true, afterHours:'capture' }, mustAsk:['Date','Guest count','Dietary requirements','Budget'], mustNot:['Confirm availability without checking the events calendar'], followUp:'Quote within 24h, follow up in 48h.' },
  };
  DRD.agentJobs = JOBS;
  DRD.jobFor = function (type) {
    return JOBS[type] || {
      role:'AI assistant', purpose:'Assist customers for this business.',
      intents:['greeting','services','price','hours'],
      actions:{ captureLead:true, escalate:true, internalNote:true },
      escalation:['Customer asks for a human'],
      style:{ tone:'warm', length:'short', cta:'soft', qualifyFirst:false, afterHours:'capture' },
      mustAsk:['Name and contact before ending'], mustNot:['Invent facts'], followUp:'',
    };
  };

  /* ── Scenario library (per industry group) ─────────────── */
  DRD.scenarios = {
    childcare: [
      'Do you have space for my 3 year old?',
      'How much are your fees?',
      'Can I book a tour?',
      'Do you offer subsidy?',
      'What meals do you provide?',
      'My daughter has a nut allergy — can you handle that?',
      'I am very unhappy with how pickup was handled today',
    ],
    healthcare: [
      'Do you accept insurance?',
      'I need a cleaning appointment.',
      'Do you do emergency appointments? I am in pain',
      'How much is whitening?',
      'Are you taking new patients?',
      'I want to speak to someone about my bill',
    ],
    events: [
      'I need a birthday party setup for 30 kids.',
      'Do you do baby showers?',
      'Can I get a quote for next month?',
      'What is included in your packages?',
      'Do you travel to Hamilton?',
      'How much deposit do you need?',
    ],
    beauty: [
      'How much is a full colour?',
      'Can I book for Saturday?',
      'Do you take walk-ins?',
      'What is your cancellation policy?',
      'I loved my visit last week!',
    ],
    home: [
      'How much would a new deck cost?',
      'Are you licensed and insured?',
      'Can someone come give me a quote this week?',
      'How soon can you start a basement reno?',
      'The crew left a mess and I am not happy',
    ],
    food: [
      'Table for 6 on Saturday at 7?',
      'Do you cater office lunches?',
      'Do you have vegan options?',
      'Can we book the private room?',
      'What are your hours on Sunday?',
    ],
    professional: [
      'Do you offer a free consultation?',
      'How do your fees work?',
      'I need help with a deadline this week — urgent',
      'What areas do you specialise in?',
    ],
    realestate: [
      'What is my home worth?',
      'Can I book a viewing for the listing on Main St?',
      'Do you do virtual tours?',
      'What commission do you charge?',
    ],
    retail: [
      'Do you have this in stock?',
      'What is your return policy?',
      'Do you deliver to Oakville?',
      'When do new arrivals come in?',
    ],
  };

  /* ── Layered knowledge defaults ────────────────────────── */
  DRD.industryLayer = {
    childcare:   { tone:'Warm, reassuring, parent-to-parent. Always acknowledge the child by age/name.', flow:'Answer → reassure on safety/quality → guide to tour or waitlist → capture parent contact.' },
    healthcare:  { tone:'Calm, professional, empathetic. Never alarm; never diagnose.', flow:'Answer → check urgency → guide to appointment → capture patient contact.' },
    events:      { tone:'Enthusiastic and visual. Mirror the excitement of their occasion.', flow:'Congratulate/acknowledge occasion → qualify (date, guests, budget) → recommend package → book consult.' },
    beauty:      { tone:'Stylish, personal, confidence-building.', flow:'Answer → suggest the right service → offer earliest slot → capture contact.' },
    home:        { tone:'Straightforward, trust-first. Lead with licensing, insurance and guarantees.', flow:'Scope the job briefly → offer free quote/site visit → capture address + contact.' },
    food:        { tone:'Appetising and welcoming.', flow:'Answer → offer reservation or catering quote → capture party size + contact.' },
    professional:{ tone:'Credible, plain-language, zero jargon.', flow:'Understand the matter → offer intro call → capture contact.' },
    realestate:  { tone:'Confident and data-backed.', flow:'Understand buy/sell/invest intent → offer valuation or viewing → capture contact.' },
    retail:      { tone:'Helpful and product-savvy.', flow:'Answer → suggest alternatives if unavailable → offer delivery/pickup → capture contact for restock alerts.' },
  };
  DRD.typeLayer = function (group, type) {
    var fields = (DRD.industryFields[group] || []).map(function (f) { return f.label; });
    return { fields: fields, note: (type||'This business type') + ' uses ' + (fields.length ? fields.join(', ').toLowerCase() : 'the universal fields') + ' on top of universal business knowledge.' };
  };
})();


/* ============================================================
   DRD v3.1 — Lead-field presets, reactivation agent, workflows
   ============================================================ */
(function () {
  'use strict';

  /* Lead Reactivation AI — universal agent type */
  DRD.agentTypes.push({
    type:'lead-reactivation', name:'Lead Reactivation Agent', icon:'🔄', channels:['whatsapp','email'],
    desc:'Re-engages older leads that never converted — availability nudges, seasonal offers, "still looking?" check-ins.',
  });
  DRD.agentJobs['lead-reactivation'] = {
    role:'Reactivation specialist',
    purpose:'Bring cold leads back to life with well-timed, personal check-ins tied to real availability and offers.',
    intents:['availability','booking','price','thanks'],
    actions:{ captureLead:true, createBooking:true, createCallback:true, whatsappFollowup:true, sendReviewLink:false, escalate:false, markHotLead:true, internalNote:true },
    escalation:['Lead asks to be removed — honor immediately and log'],
    style:{ tone:'casual-warm', length:'short', cta:'soft', qualifyFirst:false, afterHours:'queue' },
    mustAsk:['Whether they are still looking before pitching'],
    mustNot:['Contact leads who opted out','Reactivate more than twice'],
    followUp:'One reactivation touch at 30 days, one at 60, then archive.',
  };

  /* ── Industry lead-capture field presets ───────────────── */
  DRD.leadFields = {
    childcare: [
      { id:'name',      label:'Parent name',        req:true  },
      { id:'phone',     label:'Phone',              req:true  },
      { id:'email',     label:'Email',              req:false },
      { id:'childAge',  label:'Child age',          req:true  },
      { id:'startDate', label:'Start date',         req:false },
      { id:'schedule',  label:'Full-time / part-time', req:false },
    ],
    healthcare: [
      { id:'name',      label:'Patient name',       req:true  },
      { id:'phone',     label:'Phone',              req:true  },
      { id:'email',     label:'Email',              req:false },
      { id:'treatment', label:'Treatment type',     req:true  },
      { id:'timing',    label:'Preferred timing',   req:false },
      { id:'urgency',   label:'Urgency',            req:false },
    ],
    events: [
      { id:'name',      label:'Name',               req:true  },
      { id:'phone',     label:'Phone',              req:true  },
      { id:'email',     label:'Email',              req:false },
      { id:'eventType', label:'Event type',         req:true  },
      { id:'eventDate', label:'Event date',         req:true  },
      { id:'guests',    label:'Guest count',        req:false },
      { id:'budget',    label:'Budget range',       req:false },
    ],
    home: [
      { id:'name',      label:'Name',               req:true  },
      { id:'phone',     label:'Phone',              req:true  },
      { id:'project',   label:'Project type',       req:true  },
      { id:'area',      label:'Address / area',     req:false },
      { id:'budget',    label:'Budget',             req:false },
      { id:'timeline',  label:'Timeline',           req:false },
    ],
    food: [
      { id:'name',      label:'Name',               req:true  },
      { id:'phone',     label:'Phone',              req:true  },
      { id:'date',      label:'Date',               req:false },
      { id:'partySize', label:'Party size',         req:false },
      { id:'eventType', label:'Event type (catering)', req:false },
    ],
    beauty:       [ { id:'name',label:'Name',req:true }, { id:'phone',label:'Phone',req:true }, { id:'service',label:'Service wanted',req:false }, { id:'timing',label:'Preferred time',req:false } ],
    professional: [ { id:'name',label:'Name',req:true }, { id:'phone',label:'Phone',req:true }, { id:'email',label:'Email',req:true }, { id:'matter',label:'Matter / need',req:false } ],
    realestate:   [ { id:'name',label:'Name',req:true }, { id:'phone',label:'Phone',req:true }, { id:'intent',label:'Buy / sell / invest',req:false }, { id:'area',label:'Area',req:false } ],
    retail:       [ { id:'name',label:'Name',req:true }, { id:'phone',label:'Phone',req:false }, { id:'email',label:'Email',req:false }, { id:'product',label:'Product interest',req:false } ],
  };

  /* ── Workflow trigger/action catalog (automation engine) ─ */
  DRD.workflowTriggers = [
    { id:'new-lead',          label:'New website lead' },
    { id:'booking-incomplete',label:'Booking not completed' },
    { id:'missed-call',       label:'Missed call' },
    { id:'quote-sent',        label:'Quote sent' },
    { id:'no-reply',          label:'No reply after X days' },
    { id:'post-service',      label:'Post-service review request' },
    { id:'after-hours',       label:'After-hours enquiry' },
    { id:'abandoned',         label:'Abandoned conversation' },
    { id:'waitlist',          label:'Waitlist follow-up' },
  ];
  DRD.workflowActions = [
    { id:'whatsapp-followup', label:'Send WhatsApp follow-up', icon:'📲' },
    { id:'email-followup',    label:'Send email follow-up',    icon:'📧' },
    { id:'callback-task',     label:'Create callback task',    icon:'📞' },
    { id:'booking-request',   label:'Create booking request',  icon:'📅' },
    { id:'mark-hot',          label:'Mark hot lead',           icon:'🔥' },
    { id:'review-request',    label:'Send review request',     icon:'⭐' },
    { id:'notify-admin',      label:'Notify admin',            icon:'🔔' },
    { id:'escalate',          label:'Escalate issue',          icon:'🚨' },
  ];

  /* Default follow-up sequences per agent type (shown in deploy/config) */
  DRD.followUpSequences = {
    'whatsapp-followup': [
      { delay:'+2h',  msg:'Thanks for your enquiry today! Would you like me to help you get booked in this week?' },
      { delay:'+24h', msg:'Just checking in — still happy to help whenever you are ready. Any questions I can answer?' },
      { delay:'+72h', msg:'Last check-in from me! If you would like, I can hold your spot / send our latest options. Just reply here.' },
    ],
    'missed-call': [
      { delay:'+1min', msg:'Hi! Sorry we missed your call — how can we help? Reply here and we will sort it out right away.' },
      { delay:'+2h',   msg:'Still here if you need us! Want me to book you a callback at a time that suits you?' },
    ],
    'review': [
      { delay:'+3h', msg:'Thanks for visiting us today! How was everything? (1 = not great, 5 = amazing)' },
      { delay:'on-5', msg:'Amazing! 🌟 Would you mind sharing that in a quick Google review? It really helps: {reviewLink}' },
      { delay:'on-low', msg:'Sorry to hear that — the manager will contact you personally to make it right. (Routed internally, review link NOT sent.)' },
    ],
    'quote-followup': [
      { delay:'+48h', msg:'Hi {name}, did the quote we sent cover everything you needed? Happy to walk through it on a quick call.' },
      { delay:'+5d',  msg:'Just closing the loop on your quote — should I keep it active, or adjust anything to make it work?' },
    ],
    'lead-reactivation': [
      { delay:'+30d', msg:'Hi {name}! Are you still looking? We have new availability this month — want me to grab you a spot?' },
      { delay:'+60d', msg:'Last note from me — if the timing is right later this year, just reply here and I will take care of you.' },
    ],
  };
})();


/* ============================================================
   DRD.terms — AI Employee Suite terminology (industry-aware)
   The product is an AI Employee for the business, not a CRM.
   Labels centre on people served and support given.
   ============================================================ */
(function () {
  'use strict';
  var P = {
    childcare:   { person:'parent',   people:'Parents',   enquiries:'Parent Enquiries',   conversations:'Parent Conversations',  bookings:'Tours & Bookings',  satisfaction:'Parent satisfaction' },
    healthcare:  { person:'patient',  people:'Patients',  enquiries:'Patient Enquiries',  conversations:'Patient Conversations', bookings:'Appointments',      satisfaction:'Patient satisfaction' },
    events:      { person:'client',   people:'Clients',   enquiries:'Event Enquiries',    conversations:'Client Conversations',  bookings:'Consultations',     satisfaction:'Client satisfaction' },
    beauty:      { person:'client',   people:'Clients',   enquiries:'Client Enquiries',   conversations:'Client Conversations',  bookings:'Appointments',      satisfaction:'Client satisfaction' },
    home:        { person:'customer', people:'Customers', enquiries:'Quote Enquiries',    conversations:'Customer Conversations',bookings:'Site Visits',       satisfaction:'Customer satisfaction' },
    food:        { person:'guest',    people:'Guests',    enquiries:'Guest Enquiries',    conversations:'Guest Conversations',   bookings:'Reservations',      satisfaction:'Guest satisfaction' },
    professional:{ person:'client',   people:'Clients',   enquiries:'Client Enquiries',   conversations:'Client Conversations',  bookings:'Consultations',     satisfaction:'Client satisfaction' },
    realestate:  { person:'client',   people:'Clients',   enquiries:'Client Enquiries',   conversations:'Client Conversations',  bookings:'Viewings',          satisfaction:'Client satisfaction' },
    retail:      { person:'customer', people:'Customers', enquiries:'Customer Enquiries', conversations:'Customer Conversations',bookings:'Orders & Pickups',  satisfaction:'Customer satisfaction' },
  };
  var FALLBACK = { person:'customer', people:'Customers', enquiries:'Enquiries', conversations:'Conversations', bookings:'Bookings', satisfaction:'Customer satisfaction' };
  DRD.terms = function (groupId) { return P[groupId] || FALLBACK; };

  /* Support areas the AI employee provides, mapped from deployed agent types */
  DRD.supportAreas = function (groupId, agentTypes) {
    var t = DRD.terms(groupId);
    var map = [
      ['website-enquiry',    '💬', 'Instant answers for ' + t.people.toLowerCase()],
      ['booking',            '📅', (groupId === 'childcare' ? 'Tour support' : t.bookings + ' support')],
      ['whatsapp-followup',  '📲', 'Follow-up support'],
      ['review',             '⭐', 'Review & reputation support'],
      ['missed-call',        '📞', 'Missed-call recovery'],
      ['email-inbox',        '📧', 'Inbox support'],
      ['lead-qualification', '🎯', 'Enquiry qualification'],
      ['marketing-content',  '✨', 'Content & communication support'],
      ['activity-planner',   '🎨', 'Activity planning support'],
      ['waitlist-followup',  '⏳', 'Waitlist support'],
      ['lead-reactivation',  '🔄', 'Re-engagement support'],
      ['treatment-followup', '🩹', 'Care follow-up support'],
      ['package-recommendation','🎁','Package guidance'],
      ['quote-followup',     '💰', 'Quote follow-up support'],
      ['estimate-followup',  '📐', 'Estimate follow-up support'],
      ['rebooking-followup', '💇', 'Rebooking support'],
      ['catering-enquiry',   '🥂', 'Catering enquiry support'],
    ];
    return map.filter(function (m) { return (agentTypes || []).indexOf(m[0]) !== -1; })
              .map(function (m) { return { icon: m[1], label: m[2] }; });
  };
})();


/* ============================================================
   DRD v4 — Intent refinement + categorized test scenarios
   Fixes: allergy vs meals collision, adds daycare-critical
   intents, scenario categories for the pre-deploy test flow.
   ============================================================ */
(function () {
  'use strict';

  /* Remove allergy keywords from meals so the two never collide */
  var meals = DRD.intents.find(function (i) { return i.id === 'meals'; });
  if (meals) meals.kws = ['meal','meals','food ','lunch','snack','menu','nutrition','what do they eat','vegan','vegetarian'];

  /* Insert new intents at the right priority positions */
  function insertBefore(beforeId, intent) {
    var idx = DRD.intents.findIndex(function (i) { return i.id === beforeId; });
    if (idx === -1) DRD.intents.push(intent); else DRD.intents.splice(idx, 0, intent);
  }
  insertBefore('price', { id:'allergy', label:'Allergy support',
    kws:['allerg','nut-free','nut free','peanut','epipen','celiac','lactose','intoleran','dietary restriction','food restriction'] });
  insertBefore('meals', { id:'sick-policy', label:'Sick / illness policy',
    kws:['sick','illness','fever','unwell','symptom','medication','medicine','cold or flu'] });
  insertBefore('ages', { id:'existing-parent', label:'Existing family support',
    kws:['my child attends','currently enrolled','existing parent','report an absence','absent today','running late for pickup','pickup time','drop-off time','drop off time'] });
  insertBefore('ages', { id:'activity-planning', label:'Activities & curriculum',
    kws:['activity','activities','curriculum','do all day','daily schedule','themes','crafts','learning program','what do the kids','nap'] });

  /* ── Categorized pre-deploy test scenarios (childcare) ─── */
  DRD.scenarioCats = {
    childcare: [
      { cat:'Meals',          q:'What meals do you provide?' },
      { cat:'Allergy',        q:'My daughter has a nut allergy — can you handle that?' },
      { cat:'Subsidy',        q:'Do you offer subsidy?' },
      { cat:'Fees',           q:'How much are your fees?' },
      { cat:'Tour',           q:'Can I book a tour this week?' },
      { cat:'Waitlist',       q:'How do I join the waitlist?' },
      { cat:'Availability',   q:'Do you have space for my 3 year old in September?' },
      { cat:'Hours',          q:'What are your opening hours?' },
      { cat:'Parent support', q:'My child attends — I need to report an absence today' },
      { cat:'Sick policy',    q:'What happens if my son has a fever?' },
      { cat:'Activities',     q:'What do the kids do all day?' },
      { cat:'Review',         q:'We had an amazing first week, thank you!' },
    ],
    healthcare: [
      { cat:'Insurance',   q:'Do you accept insurance?' },
      { cat:'Booking',     q:'I need a cleaning appointment.' },
      { cat:'Emergency',   q:'I have a toothache and need urgent help' },
      { cat:'Fees',        q:'How much is teeth whitening?' },
      { cat:'New patient', q:'Are you taking new patients?' },
      { cat:'Support',     q:'I want to speak to someone about my bill' },
    ],
    events: [
      { cat:'Enquiry',  q:'I need a birthday setup for 30 kids next month.' },
      { cat:'Quote',    q:'Can I get a quote for a baby shower?' },
      { cat:'Packages', q:'What is included in your packages?' },
      { cat:'Area',     q:'Do you travel to Hamilton?' },
      { cat:'Deposit',  q:'How much deposit do you need?' },
    ],
  };
})();


/* ============================================================
   DRD v5 — DAYCARE AI EMPLOYEE SYSTEM
   Skill catalog, daycare operations fields, daycare intents,
   activity & printable hub content, parent comm templates.
   ============================================================ */
(function () {
  'use strict';

  /* ── 12 Daycare AI Employee skills (mapped to agent types) ── */
  DRD.daycareSkills = [
    { id:'parent-enquiry',    label:'Parent Enquiry',        icon:'💬', agentType:'website-enquiry',
      handles:'Answers parent questions instantly — fees, meals, hours, programs — and captures every enquiry.',
      captures:'Parent name, phone, email, child age', triggers:'Confirmation + admin alert on every new enquiry' },
    { id:'tour-booking',      label:'Tour Booking',          icon:'📅', agentType:'booking',
      handles:'Turns interest into booked tour requests with the fewest steps.',
      captures:'Preferred day/time, child age, start date', triggers:'Tour confirmation, staff tour alert, reminder' },
    { id:'availability-check',label:'Availability Check',    icon:'🪑', agentType:'website-enquiry',
      handles:'Answers space/room questions honestly and routes to the team for live confirmation.',
      captures:'Child age, desired schedule, start month', triggers:'Staff availability check task' },
    { id:'fees-subsidy',      label:'Fees & Subsidy Support',icon:'💰', agentType:'website-enquiry',
      handles:'Explains fees and CWELCC/subsidy support from approved knowledge only — never invents numbers.',
      captures:'Age group, schedule needs', triggers:'Fee sheet follow-up if requested' },
    { id:'waitlist-support',  label:'Waitlist Support',      icon:'⏳', agentType:'waitlist-followup',
      handles:'Adds families to the waitlist and keeps them warm until a spot opens.',
      captures:'Child age, desired start date', triggers:'Waitlist confirmation + monthly check-in' },
    { id:'callback-requests', label:'Callback Requests',     icon:'📞', agentType:'missed-call',
      handles:'Captures callback requests and recovers missed calls with an instant text-back.',
      captures:'Name, phone, best time to call', triggers:'Staff callback task (2h)' },
    { id:'existing-parent',   label:'Existing Parent Support',icon:'👨‍👩‍👧', agentType:'website-enquiry',
      handles:'Handles enrolled-family requests — absences, pickup notes, questions — and hands off to staff.',
      captures:'Parent name, child, message', triggers:'Staff handoff note' },
    { id:'review-reputation', label:'Review & Reputation',   icon:'⭐', agentType:'review',
      handles:'Requests Google reviews from happy parents and routes unhappy feedback privately to the director.',
      captures:'Sentiment, feedback text', triggers:'Review request / private alert' },
    { id:'parent-communication', label:'Parent Communication', icon:'📣', agentType:'whatsapp-followup',
      handles:'Drafts and sends parent notices — closures, events, reminders — via email/WhatsApp.',
      captures:'—', triggers:'Notice drafts for approval' },
    { id:'activity-planning', label:'Activity Planning',     icon:'🎨', agentType:'activity-planner',
      handles:'Suggests weekly themes and age-appropriate activities for staff.',
      captures:'Age group, season, prep level', triggers:'Weekly suggestion' },
    { id:'printable-suggestions', label:'Printable Suggestions', icon:'🖨️', agentType:'activity-planner',
      handles:'Recommends printable packs — worksheets, charts, seasonal packs — matched to the week.',
      captures:'Age group, theme', triggers:'Printable pack suggestion' },
    { id:'social-content',    label:'Social Content Support',icon:'✨', agentType:'marketing-content',
      handles:'Drafts social posts and parent-facing content in the daycare\'s tone.',
      captures:'—', triggers:'Post draft suggestions' },
  ];
  DRD.skillsToAgents = function (skillIds) {
    var types = [];
    (skillIds || []).forEach(function (id) {
      var s = DRD.daycareSkills.find(function (x) { return x.id === id; });
      if (s && types.indexOf(s.agentType) === -1) types.push(s.agentType);
    });
    return types;
  };
  DRD.recommendedSkills = ['parent-enquiry','tour-booking','availability-check','fees-subsidy','waitlist-support','callback-requests','review-reputation','activity-planning'];

  /* ── Daycare operations fields (extends childcare fields) ── */
  [
    { id:'programs',        label:'Programs Offered',          ph:'e.g. Infant, Toddler, Preschool, Before/After school', ta:true },
    { id:'subsidyNotes',    label:'Subsidy / CWELCC Info',     ph:'CWELCC participation, regional subsidies, how it applies…', ta:true },
    { id:'allergyNotes',    label:'Allergy & Special Diet Support', ph:'Nut-free? Individual allergy plans? Special diets…', ta:true },
    { id:'sickPolicy',      label:'Sick Policy Summary',       ph:'Symptom-free rules, exclusion periods, medication…', ta:true },
    { id:'holidayClosures', label:'Holiday Closure Notes',     ph:'e.g. Closed stat holidays, Dec 24–Jan 2…' },
    { id:'feesVisibility',  label:'Fees Visibility Rule',      ph:'Share fees in chat, or capture contact and send fee sheet?' },
    { id:'napOutdoor',      label:'Naps / Outdoor Play / General FAQ Notes', ph:'Nap schedule, outdoor time, what to bring…', ta:true },
  ].forEach(function (f) {
    if (!DRD.industryFields.childcare.some(function (x) { return x.id === f.id; })) DRD.industryFields.childcare.push(f);
  });

  /* ── New daycare intents ─────────────────────────────────── */
  function insertBefore(beforeId, intent) {
    var idx = DRD.intents.findIndex(function (i) { return i.id === beforeId; });
    if (idx === -1) DRD.intents.push(intent); else DRD.intents.splice(idx, 0, intent);
  }
  if (!DRD.intents.some(function (i) { return i.id === 'holiday-closure'; })) {
    insertBefore('hours', { id:'holiday-closure', label:'Holiday closures',
      kws:['holiday','closed for christmas','winter break','march break','stat holiday','closure','closed on','summer break'] });
    insertBefore('activity-planning', { id:'printables', label:'Printable resources',
      kws:['printable','worksheet','flashcard','colouring sheet','coloring sheet','routine chart','reward chart','poster'] });
  }

  /* ── Activity & Printable Hub catalogs ───────────────────── */
  DRD.activities = [
    { title:'Indoor Obstacle Course', ages:['toddler','preschool'], setting:'indoor', season:'any',    goal:'Gross motor', prep:'low',
      materials:'Cushions, painter\'s tape, tunnels or chairs', parentNote:'Ask your child which part of the obstacle course was trickiest — great conversation starter!', printable:'Movement cards pack' },
    { title:'Rainy Day Sensory Bins', ages:['infant','toddler'], setting:'indoor', season:'spring',  goal:'Sensory', prep:'moderate',
      materials:'Rice or oats, scoops, cups, hidden toys', parentNote:'We explored textures today — your little one loved scooping and pouring!', printable:'Sensory play ideas handout' },
    { title:'Alphabet Nature Hunt', ages:['preschool'], setting:'outdoor', season:'summer',  goal:'Literacy', prep:'low',
      materials:'Clipboards, letter checklist, pencils', parentNote:'Ask what letters they found outside today!', printable:'Alphabet hunt checklist' },
    { title:'Water Play Station', ages:['toddler','preschool'], setting:'outdoor', season:'summer',  goal:'Sensory', prep:'moderate',
      materials:'Water table or bins, funnels, cups, towels', parentNote:'Please pack a spare outfit tomorrow — water play day!', printable:'Water safety poster' },
    { title:'Leaf Colour Sorting', ages:['toddler','preschool'], setting:'outdoor', season:'fall',    goal:'Math & sorting', prep:'low',
      materials:'Collected leaves, sorting mats', parentNote:'We sorted leaves by colour and size — try it on your next walk!', printable:'Fall sorting mats' },
    { title:'Snow Measurement Lab', ages:['preschool'], setting:'outdoor', season:'winter',  goal:'Early STEM', prep:'low',
      materials:'Rulers, cups, magnifying glasses', parentNote:'We measured snow depth like real scientists today!', printable:'Winter science journal page' },
    { title:'Story Stones Circle', ages:['toddler','preschool'], setting:'indoor', season:'any',     goal:'Language', prep:'moderate',
      materials:'Painted stones or picture cards', parentNote:'Ask your child to retell the story we built together!', printable:'Story sequence cards' },
    { title:'Music & Movement Freeze Dance', ages:['infant','toddler','preschool'], setting:'indoor', season:'any', goal:'Gross motor', prep:'low',
      materials:'Music player, scarves', parentNote:'Freeze dance was a hit — try the freeze game at home!', printable:'Action song lyric sheet' },
  ];
  DRD.printables = [
    { cat:'Rainy day activities',   items:'Indoor scavenger hunts, quiet-time packs, movement cards' },
    { cat:'Summer outdoor pack',    items:'Nature hunts, water play signs, sun safety poster' },
    { cat:'Alphabet worksheets',    items:'Tracing A–Z, letter hunts, beginning sounds' },
    { cat:'Number worksheets',      items:'Counting 1–20, number tracing, ten frames' },
    { cat:'Flashcards',             items:'Alphabet, numbers, colours, shapes, emotions' },
    { cat:'Posters',                items:'Classroom rules, handwashing, feelings chart' },
    { cat:'Routine charts',         items:'Morning routine, clean-up steps, visual schedules' },
    { cat:'Reward charts',          items:'Star charts, sticker trackers, kindness charts' },
    { cat:'Seasonal packs',         items:'Fall, winter, spring, summer themed bundles' },
    { cat:'Holiday packs',          items:'Halloween, winter holidays, Valentine\'s, Easter' },
    { cat:'Parent handouts',        items:'What-to-pack lists, illness policy one-pagers, tour welcome sheets' },
  ];

  /* ── Parent communication templates ──────────────────────── */
  DRD.commTemplates = [
    { id:'holiday-closure', label:'Holiday Closure Notice', channel:'email + WhatsApp', on:true,
      body:'Dear families, a friendly reminder that {daycare} will be closed {dates}. We wish you a wonderful break and look forward to welcoming the children back on {return date}! 💛' },
    { id:'event-reminder',  label:'Event / Activity Day Reminder', channel:'WhatsApp', on:true,
      body:'Reminder: tomorrow is {event} at {daycare}! {details — e.g. please pack a water bottle and sun hat}. Can\'t wait! ☀️' },
    { id:'tour-confirm',    label:'Tour Confirmation', channel:'email', on:true,
      body:'Hi {parent name}, your tour at {daycare} is confirmed for {date/time}. We\'ll meet you at the front entrance — plan for about 30 minutes. See you soon!' },
    { id:'waitlist-confirm',label:'Waitlist Confirmation', channel:'email', on:true,
      body:'Hi {parent name}, {child name} has been added to our waitlist for {age group}. We\'ll contact you as soon as a spot opens — siblings of enrolled children get priority.' },
    { id:'fee-reminder',    label:'Fee Reminder (optional)', channel:'email', on:false,
      body:'Hi {parent name}, a gentle reminder that {month} fees are due on {date}. Any questions, just reply here. Thank you!' },
    { id:'document-reminder', label:'Enrollment Document Reminder', channel:'email', on:true,
      body:'Hi {parent name}, we\'re missing {document} for {child name}\'s file. You can reply with a photo or drop it off at the front desk. Thanks so much!' },
  ];
})();
