'use strict';
/* ============================================================
   DRI — BUSINESS INTELLIGENCE IMPORT LAYER
   Modular importers: Website, Google/Public Profile, Social.
   MVP: realistic simulation generators, structured so each
   module can be swapped for a real fetcher (API route) later.
   Contract: every importer returns a Promise<partial intel>.
   ============================================================ */
var DRI = (function () {

  var PAGES = ['homepage', 'about', 'services', 'pricing', 'faq', 'contact', 'booking', 'policies', 'location'];

  /* ── Per-industry intelligence templates ───────────────── */
  /* Interpolated with the business basics to feel real.      */
  function T(b) {
    var loc = b.location || 'your area';
    var map = {
      childcare: {
        summary: b.name + ' is a licensed ' + (b.businessType || 'childcare centre').toLowerCase() + ' in ' + loc + ' offering full-time and part-time programs for infants, toddlers and preschoolers, with a focus on play-based learning, nutritious meals and daily outdoor time.',
        services: ['Infant care (6–18 months)', 'Toddler program (18 months–2.5 yrs)', 'Preschool program (2.5–4 yrs)', 'Before & after school care', 'Summer camp'],
        faqs: [
          { q: 'Do you accept government subsidies?', a: 'Yes — we participate in CWELCC and accept regional childcare subsidies, which can significantly reduce your fees.' },
          { q: 'Are meals included?', a: 'Yes, a hot lunch and two snacks are included daily. We are a nut-free facility and support individual allergy plans.' },
          { q: 'How do I join the waitlist?', a: 'The waitlist is free to join with no deposit — spots are offered in order, with priority for siblings.' },
          { q: 'What are your staff ratios?', a: 'We follow or exceed provincial ratios in every room, and all educators are first-aid and CPR certified.' },
        ],
        hours: 'Monday–Friday 7:30 AM – 6:00 PM',
        pricingNotes: 'Fees vary by age group; infant care from $85/day, toddlers from $65/day, preschool from $58/day. CWELCC reduces eligible fees.',
        policies: 'Sick policy: children must be symptom-free for 24 hours. Withdrawal requires 4 weeks written notice.',
        testimonials: ['“My daughter has thrived here — the teachers genuinely care.” — Google review', '“Enrolment was easy and the team answered every question.” — Facebook'],
        categories: ['Day care center', 'Preschool'],
        socialTone: 'Warm, family-focused, reassuring',
        socialMentions: ['tour days', 'weekly activity themes', 'open house', 'summer camp registration'],
        promoStyle: 'Community-first: photos of crafts and outdoor play, seasonal enrolment pushes',
      },
      healthcare: {
        summary: b.name + ' is a modern ' + (b.businessType || 'clinic').toLowerCase() + ' in ' + loc + ' providing comprehensive care for new and existing patients, with direct insurance billing and same-day emergency appointments.',
        services: ['New patient exams', 'Cleanings & check-ups', 'Emergency appointments', 'Cosmetic treatments', 'Family care plans'],
        faqs: [
          { q: 'Do you accept insurance?', a: 'Yes — we direct-bill most major insurance providers, so you usually pay only the uncovered portion.' },
          { q: 'Do you take new patients?', a: 'Yes, we are welcoming new patients and can usually book a first visit within the week.' },
          { q: 'What about emergencies?', a: 'We keep same-day slots for emergencies — call us and we will fit you in.' },
        ],
        hours: 'Mon–Fri 8 AM–6 PM, Sat 9 AM–3 PM',
        pricingNotes: 'Standard exams typically covered by insurance; cosmetic treatment quotes provided after consultation.',
        policies: '48-hour notice required for cancellations to avoid a missed-appointment fee.',
        testimonials: ['“Painless, professional and on time — best clinic I have used.” — Google review'],
        categories: ['Clinic', 'Health'],
        socialTone: 'Professional, calm, trust-building',
        socialMentions: ['new patient offers', 'oral health tips', 'meet the team'],
        promoStyle: 'Educational posts with occasional new-patient promotions',
      },
      events: {
        summary: b.name + ' plans and delivers memorable events across ' + loc + ' — from intimate celebrations to large corporate functions — with transparent packages, trusted vendors and full setup/teardown.',
        services: ['Birthday parties & kids events', 'Weddings & engagements', 'Corporate events', 'Themed decor & styling', 'Full planning packages'],
        faqs: [
          { q: 'How far in advance should I book?', a: 'Popular dates fill 4–8 weeks out; we recommend enquiring as early as possible. Rush bookings are sometimes possible.' },
          { q: 'Do you require a deposit?', a: 'Yes — 30% secures your date, with the balance due 14 days before the event.' },
          { q: 'Do you travel?', a: 'We serve the wider region; travel outside our core area may add a small fee.' },
        ],
        hours: 'Consultations by appointment, 7 days a week',
        pricingNotes: 'Packages from $2,500; custom quotes based on guest count, venue and add-ons.',
        policies: 'Deposits are transferable to a new date with 21+ days notice.',
        testimonials: ['“They turned our venue into magic — guests are still talking about it.” — Google review'],
        categories: ['Event planner', 'Party services'],
        socialTone: 'Energetic, visual, celebratory',
        socialMentions: ['real event showcases', 'package launches', 'seasonal themes'],
        promoStyle: 'Before/after reels and themed package promotions',
      },
      beauty: {
        summary: b.name + ' is a boutique ' + (b.businessType || 'salon').toLowerCase() + ' in ' + loc + ' known for personalised consultations, premium products and easy online booking.',
        services: ['Consultations', 'Signature treatments', 'Colour & styling', 'Bridal & event packages', 'Memberships'],
        faqs: [
          { q: 'How do I book?', a: 'Book online anytime or message us — we confirm within the hour during business hours.' },
          { q: 'What is your cancellation policy?', a: 'We ask for 24 hours notice; late cancellations may incur a 50% fee.' },
        ],
        hours: 'Tue–Sat 9 AM–7 PM',
        pricingNotes: 'Service menu with fixed prices; complex work quoted after consultation.',
        policies: '24-hour cancellation notice; deposits required for appointments over 2 hours.',
        testimonials: ['“Best experience I have had — they listen and deliver.” — Google review'],
        categories: ['Beauty salon'],
        socialTone: 'Stylish, personal, confidence-boosting',
        socialMentions: ['transformations', 'last-minute openings', 'new services'],
        promoStyle: 'Before/after photos and limited-time booking pushes',
      },
      home: {
        summary: b.name + ' is a licensed and insured ' + (b.businessType || 'contractor').toLowerCase() + ' serving ' + loc + ', offering free quotes, clear timelines and workmanship guarantees.',
        services: ['Free on-site quotes', 'Residential projects', 'Commercial work', 'Repairs & maintenance', 'Emergency call-outs'],
        faqs: [
          { q: 'Are quotes really free?', a: 'Yes — we visit, measure and send a written quote within 48 hours, no obligation.' },
          { q: 'Are you insured?', a: 'Fully licensed and insured, with a workmanship guarantee on every job.' },
          { q: 'How soon can you start?', a: 'Small jobs often within the week; larger projects are scheduled after the site visit.' },
        ],
        hours: 'Mon–Fri 7 AM–6 PM, Sat by appointment',
        pricingNotes: 'Written quotes within 48 hours of site visit; financing available on larger projects.',
        policies: 'All work covered by a workmanship guarantee; changes handled by written change orders.',
        testimonials: ['“On time, on budget, spotless cleanup. Rare these days.” — Google review'],
        categories: ['Contractor', 'Home services'],
        socialTone: 'Straightforward, proof-driven, reliable',
        socialMentions: ['project photos', 'before/after', 'seasonal maintenance tips'],
        promoStyle: 'Job showcases with quote CTAs',
      },
      food: {
        summary: b.name + ' is a beloved ' + (b.businessType || 'restaurant').toLowerCase() + ' in ' + loc + ' serving fresh, locally sourced dishes, with private dining and full catering available.',
        services: ['Dine-in', 'Reservations & group bookings', 'Private events', 'Catering', 'Takeout'],
        faqs: [
          { q: 'Do you take reservations?', a: 'Yes — book online or message us; large groups should book ahead, especially weekends.' },
          { q: 'Do you cater?', a: 'Yes, we cater events of most sizes with menus tailored to your budget and dietary needs.' },
          { q: 'Do you have vegetarian/vegan options?', a: 'Absolutely — clearly marked on the menu, and the kitchen can adapt most dishes.' },
        ],
        hours: 'Tue–Sun 11:30 AM–10 PM, closed Mondays',
        pricingNotes: 'Mains $28–$52; private room from $500; catering quoted per event.',
        policies: 'Groups of 8+ require a card to hold; 24-hour notice for cancellation.',
        testimonials: ['“The private dinner they hosted for us was flawless.” — Google review'],
        categories: ['Restaurant'],
        socialTone: 'Appetising, lively, local',
        socialMentions: ['seasonal menu items', 'event nights', 'catering showcases'],
        promoStyle: 'Food photography with reservation CTAs',
      },
      professional: {
        summary: b.name + ' is a ' + (b.businessType || 'professional services firm').toLowerCase() + ' in ' + loc + ' helping clients with responsive, plain-language advice and transparent fees.',
        services: ['Initial consultations', 'Ongoing advisory', 'Project engagements', 'Compliance & filings'],
        faqs: [
          { q: 'Is the first consultation free?', a: 'We offer a short free intro call to understand your needs before any engagement.' },
          { q: 'How are fees billed?', a: 'Fixed-fee where possible; hourly work is estimated up front so there are no surprises.' },
        ],
        hours: 'Mon–Fri 9 AM–5:30 PM',
        pricingNotes: 'Free intro call; fixed-fee packages for common engagements.',
        policies: 'Engagement letters define scope; confidentiality guaranteed.',
        testimonials: ['“Clear advice, fast responses, fair fees.” — Google review'],
        categories: ['Professional services'],
        socialTone: 'Credible, concise, helpful',
        socialMentions: ['tips & explainers', 'deadline reminders', 'case highlights'],
        promoStyle: 'Educational content with consultation CTAs',
      },
      realestate: {
        summary: b.name + ' helps buyers, sellers and investors across ' + loc + ' with data-driven pricing, strong negotiation and end-to-end support.',
        services: ['Buyer representation', 'Seller listings', 'Free home valuations', 'Investment advisory', 'Viewings & virtual tours'],
        faqs: [
          { q: 'How do I get a valuation?', a: 'Request a free, no-obligation home valuation — usually delivered within 24 hours.' },
          { q: 'Can I do a virtual viewing?', a: 'Yes — live video viewings are available for most listings.' },
        ],
        hours: 'Mon–Sat 9 AM–7 PM',
        pricingNotes: 'Standard commission structure; valuations free.',
        policies: 'Exclusive listing agreements; buyer representation agreements explained up front.',
        testimonials: ['“Sold over asking in 9 days. Superb communication.” — Google review'],
        categories: ['Real estate agency'],
        socialTone: 'Confident, market-savvy, responsive',
        socialMentions: ['new listings', 'sold stories', 'market updates'],
        promoStyle: 'Listing showcases and market stat posts',
      },
      retail: {
        summary: b.name + ' is a specialty ' + (b.businessType || 'store').toLowerCase() + ' in ' + loc + ' offering curated products, expert advice, and flexible delivery and pickup.',
        services: ['In-store shopping', 'Personal shopping advice', 'Local delivery', 'Click & collect', 'Gift services'],
        faqs: [
          { q: 'What is your return policy?', a: '30-day returns on unused items with receipt; exchanges anytime.' },
          { q: 'Do you deliver?', a: 'Yes — local delivery within 2–3 days, and in-store pickup is free.' },
        ],
        hours: 'Mon–Sat 10 AM–8 PM, Sun 11 AM–5 PM',
        pricingNotes: 'Price-match on identical items from local competitors.',
        policies: '30-day return window; special orders require a deposit.',
        testimonials: ['“Staff actually know their products — rare and refreshing.” — Google review'],
        categories: ['Retail store'],
        socialTone: 'Friendly, product-savvy, seasonal',
        socialMentions: ['new arrivals', 'seasonal sales', 'staff picks'],
        promoStyle: 'Product highlights with store-visit CTAs',
      },
    };
    return map[b.industryGroup] || map.professional;
  }

  /* ── Module A: Website Import ──────────────────────────── */
  /* Swap body with a real crawler (e.g. /api/import) later.  */
  function importWebsite(basics, onProgress) {
    return new Promise(function (resolve) {
      var t = T(basics);
      var found = [], i = 0;
      (function crawl() {
        if (i >= PAGES.length) {
          resolve({
            pagesFound: found,
            summary: t.summary,
            services: t.services.slice(),
            faqs: t.faqs.slice(),
            hours: t.hours,
            contact: { phone: basics.phone || '', email: basics.email || '', address: basics.location || '' },
            bookingLink: basics.bookingLink || '',
            pricingNotes: t.pricingNotes,
            serviceArea: basics.location || '',
            policies: t.policies,
            testimonials: t.testimonials.slice(),
          });
          return;
        }
        var page = PAGES[i++];
        /* pricing/policies pages "missing" sometimes for realism */
        var hit = !(page === 'policies' && Math.random() < 0.3);
        if (hit) found.push(page);
        if (onProgress) onProgress('website', page, hit);
        setTimeout(crawl, 220 + Math.random() * 180);
      })();
    });
  }

  /* ── Module B: Google / Public Profile Import ──────────── */
  function importGoogleProfile(basics, onProgress) {
    return new Promise(function (resolve) {
      if (onProgress) onProgress('google', 'business profile', true);
      var t = T(basics);
      setTimeout(function () {
        resolve({
          google: {
            description: t.summary.split('.')[0] + '.',
            rating: (4.5 + Math.random() * 0.4).toFixed(1),
            reviewCount: 18 + Math.floor(Math.random() * 120),
            reviewLink: basics.reviewLink || '',
            address: basics.location || '',
            hours: t.hours,
            phone: basics.phone || '',
            categories: t.categories.slice(),
          },
        });
      }, 500);
    });
  }

  /* ── Module C: Social Profile Import ───────────────────── */
  function importSocial(basics, links, onProgress) {
    return new Promise(function (resolve) {
      var active = Object.keys(links || {}).filter(function (k) { return links[k]; });
      var t = T(basics);
      var i = 0;
      (function next() {
        if (i >= active.length) {
          resolve({
            social: {
              profiles: links || {},
              tone: t.socialTone,
              serviceMentions: t.socialMentions.slice(),
              promoStyle: t.promoStyle,
              themes: t.socialMentions.slice(0, 2),
            },
          });
          return;
        }
        if (onProgress) onProgress('social', active[i], true);
        i++;
        setTimeout(next, 350);
      })();
    });
  }

  /* ── Orchestrator ──────────────────────────────────────── */
  /* Runs all modules, merges into one intel object.          */
  function runImport(basics, socialLinks, onProgress) {
    var intel = { importedAt: new Date().toISOString(), sourceWebsite: basics.website || '' };
    return importWebsite(basics, onProgress)
      .then(function (web) {
        Object.assign(intel, web);
        return importGoogleProfile(basics, onProgress);
      })
      .then(function (g) {
        Object.assign(intel, g);
        return importSocial(basics, socialLinks, onProgress);
      })
      .then(function (s) {
        Object.assign(intel, s);
        intel.missing = [];
        if (!intel.bookingLink) intel.missing.push('Booking link');
        if (!intel.google.reviewLink) intel.missing.push('Google review link');
        if (intel.pagesFound.indexOf('policies') === -1) intel.missing.push('Policies page');
        if (!basics.whatsapp) intel.missing.push('WhatsApp number');
        return intel;
      });
  }

  return {
    PAGES: PAGES,
    runImport: runImport,
    importWebsite: importWebsite,
    importGoogleProfile: importGoogleProfile,
    importSocial: importSocial,
  };
})();
