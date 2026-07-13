'use strict';
/* ============================================================
   DRA — DIGITAL RISE PLATFORM ACTIONS (v2 — AI Employee engine)
   Conversation logic: detect intent → pull layered knowledge →
   reply like a trained human assistant → push toward action →
   save structured outcomes (lead / booking / callback / quote /
   review flag / escalation note).
   ============================================================ */
var DRA = (function () {

  /* ── Helpers ───────────────────────────────────────────── */
  function slugify(name) {
    return String(name).toLowerCase().trim()
      .replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'business';
  }
  function uniqueSlug(name) {
    var base = slugify(name), slug = base, n = 2;
    while (DRS.getBusinessBySlug(slug)) { slug = base + '-' + n; n++; }
    return slug;
  }
  var COLORS = ['#7C3AED','#0891B2','#DB2777','#16A34A','#D97706','#4F46E5','#0D9488','#9333EA','#DC2626'];
  function pickColor(name) {
    var h = 0; for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 997;
    return COLORS[h % COLORS.length];
  }
  function initials(name) {
    var w = name.trim().split(/\s+/);
    return ((w[0] || 'B')[0] + (w[1] ? w[1][0] : '')).toUpperCase();
  }
  var PHONE_RE = /\+?\d[\d\s\-().]{6,}\d/;
  var EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.]+/;
  function firstName(s) { return String(s || '').trim().split(/\s+/)[0] || ''; }

  /* ── Merged agent job (defaults + per-agent overrides) ─── */
  function jobFor(agent) {
    var d = DRD.jobFor(agent.agentType);
    return {
      role:       agent.role       || d.role,
      purpose:    agent.purpose    || d.purpose,
      intents:    agent.supportedIntents || d.intents,
      actions:    Object.assign({}, d.actions, agent.actionsEnabled || {}),
      escalation: agent.escalationRules && agent.escalationRules.length ? agent.escalationRules : d.escalation,
      style:      Object.assign({}, d.style, agent.responseStyle || {}),
      mustAsk:    agent.mustAsk  && agent.mustAsk.length  ? agent.mustAsk  : d.mustAsk,
      mustNot:    agent.mustNot  && agent.mustNot.length  ? agent.mustNot  : d.mustNot,
      followUp:   agent.followUpRules || d.followUp,
    };
  }

  /* ── Intent detection ──────────────────────────────────── */
  function detectIntent(msg) {
    var m = ' ' + msg.toLowerCase() + ' ';
    var hits = [];
    if (PHONE_RE.test(msg) || EMAIL_RE.test(msg)) hits.push('contact-info');
    DRD.intents.forEach(function (it) {
      if (it.id === 'contact-info') return;
      for (var i = 0; i < it.kws.length; i++) {
        if (m.indexOf(it.kws[i]) !== -1) { hits.push(it.id); return; }
      }
    });
    var primary = hits.filter(function (h) { return h !== 'greeting' && h !== 'thanks' && h !== 'contact-info'; })[0]
               || hits[0] || 'general';
    return { primary: primary, all: hits };
  }
  function intentLabel(id) {
    var it = DRD.intents.find(function (x) { return x.id === id; });
    return it ? it.label : 'General enquiry';
  }

  /* ── Layered knowledge lookup ──────────────────────────── */
  /* L4 manual rules → L3 imported intel → legacy manual KB → nothing */
  var STOP = ['what','when','where','with','your','does','do','you','have','the','and','for','are','how','much','can','offer','provide','about','this','that','there','would','like'];
  function stems(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
      .filter(function (w) { return w.length > 3 && STOP.indexOf(w) === -1; })
      .map(function (w) { return w.slice(0, 5); });
  }
  function overlap(aStems, bText) {
    var b = stems(bText);
    return aStems.filter(function (s) { return b.indexOf(s) !== -1; }).length;
  }
  function knowledgeFor(biz, intentId, msg) {
    var kb = biz.knowledge || {};
    var intel = biz.intel || {};
    var m = msg.toLowerCase();
    var mStems = stems(msg);
    var it = DRD.intents.find(function (x) { return x.id === intentId; });

    /* L4: manual business rules — intent keywords OR word-stem overlap with the message */
    var rules = biz.manualRules || [];
    var bestRule = null, bestRuleScore = 0;
    for (var r = 0; r < rules.length; r++) {
      var rl = rules[r].toLowerCase();
      if (it && it.kws.some(function (k) { return rl.indexOf(k) !== -1; })) {
        return { text: rules[r], source: 'Manual business rule' };
      }
      var sc = overlap(mStems, rules[r]);
      if (sc > bestRuleScore) { bestRuleScore = sc; bestRule = rules[r]; }
    }
    if (bestRule && bestRuleScore >= 1) return { text: bestRule, source: 'Manual business rule' };

    /* L3: imported FAQs — intent keywords OR best word-stem overlap */
    if (intel.faqs && intel.faqs.length) {
      var bestFaq = null, bestFaqScore = 0;
      for (var f = 0; f < intel.faqs.length; f++) {
        var q = intel.faqs[f].q.toLowerCase();
        if (it && it.kws.some(function (k) { return q.indexOf(k) !== -1; })) {
          return { text: intel.faqs[f].a, source: 'Imported website FAQ' };
        }
        var fsc = overlap(mStems, intel.faqs[f].q);
        if (fsc > bestFaqScore) { bestFaqScore = fsc; bestFaq = intel.faqs[f]; }
      }
      if (bestFaq && bestFaqScore >= 1) return { text: bestFaq.a, source: 'Imported website FAQ' };
    }

    /* L3: imported structured fields */
    var intelMap = {
      price: intel.pricingNotes, hours: intel.hours || (intel.google || {}).hours,
      services: intel.services && intel.services.length ? 'We offer: ' + intel.services.slice(0, 4).join(', ') + '.' : null,
      location: intel.serviceArea || (intel.google || {}).address,
      availability: null, subsidy: null, insurance: null, meals: null, ages: null,
    };
    if (intelMap[intentId]) return { text: intelMap[intentId], source: 'Imported website content' };

    /* Legacy manual KB via keyword map */
    for (var i = 0; i < DRD.keywordMap.length; i++) {
      var entry = DRD.keywordMap[i];
      if (!kb[entry.field]) continue;
      if (it && it.kws.some(function (k) { return entry.kws.indexOf(k) !== -1; })) {
        return { text: kb[entry.field], source: 'Business knowledge' };
      }
      if (entry.kws.some(function (k) { return m.indexOf(k) !== -1; })) {
        return { text: kb[entry.field], source: 'Business knowledge' };
      }
    }
    /* intel summary only for explicit services questions — never as a
       filler for unknown questions (that must use the honest fallback) */
    if (intentId === 'services' && intel.summary) {
      return { text: intel.summary, source: 'Imported business summary' };
    }
    return null;
  }
  function trim(text, n) {
    text = String(text);
    if (text.length <= n) return text;
    var cut = text.slice(0, n);
    return cut.slice(0, Math.max(cut.lastIndexOf('.'), cut.lastIndexOf(',')) + 1) || cut + '…';
  }

  /* ── CTA selection (push toward action) ────────────────── */
  function ctaFor(biz, job, intentId) {
    var g = biz.industryGroup;
    var a = job.actions;
    if (a.createBooking) {
      if (g === 'childcare')  return { text: 'book you a free tour so you can see it in person', type: 'tour' };
      if (g === 'healthcare') return { text: 'get you booked in — we usually have slots this week', type: 'booking' };
      if (g === 'events')     return { text: 'set up a free consultation to plan the details', type: 'booking' };
      if (g === 'food')       return { text: 'reserve a table for you', type: 'reservation' };
      if (g === 'home')       return { text: 'arrange a free site visit and quote', type: 'booking' };
      if (g === 'beauty')     return { text: 'grab you the next available slot', type: 'booking' };
      return { text: 'book that in for you', type: 'booking' };
    }
    if (a.createCallback) return { text: 'have someone call you back today', type: 'callback' };
    if (a.captureLead)    return { text: 'take your details so the team can follow up', type: 'lead' };
    return null;
  }

  /* ── Business fact extraction (approved knowledge only) ── */
  function bizFacts(biz) {
    var kb = biz.knowledge || {};
    var intel = biz.intel || {};
    function faq(re) {
      var fs = intel.faqs || [];
      for (var i = 0; i < fs.length; i++) {
        if (re.test((fs[i].q + ' ' + fs[i].a).toLowerCase())) return fs[i].a;
      }
      return null;
    }
    function sentence(src, re) {
      var m = String(src || '').match(re);
      return m ? m[0].trim() : null;
    }
    return {
      meals:      kb.meals || faq(/meal|lunch|snack/),
      allergy:    kb.allergyNotes || sentence((kb.meals || '') + ' ' + (kb.safety || '') + ' ' + (faq(/allerg|nut/) || ''), /[^.]*(nut[- ]?free|allerg)[^.]*\.?/i),
      fees:       kb.fees || kb.pricing || intel.pricingNotes || null,
      subsidy:    kb.subsidyNotes || faq(/subsid|cwelcc|funding/) || sentence(kb.fees || intel.pricingNotes, /[^.]*(cwelcc|subsid)[^.]*\.?/i),
      holidays:   kb.holidayClosures || sentence(kb.policies || intel.policies, /[^.]*(holiday|closure|closed)[^.]*\.?/i),
      hours:      kb.hours || intel.hours || (intel.google || {}).hours || null,
      tours:      kb.tourTimes || null,
      waitlist:   kb.waitlistRules || faq(/waitlist/),
      ages:       kb.ageGroups || null,
      sick:       kb.sickPolicy || sentence(kb.policies || intel.policies, /[^.]*(sick|symptom|fever)[^.]*\.?/i) || faq(/sick|ill/),
      activities: kb.curriculum || kb.activityThemes || kb.napOutdoor || faq(/curricul|activit|play/),
      safety:     kb.safety || faq(/ratio|safe/),
      services:   kb.services || (intel.services && intel.services.length ? 'We offer ' + intel.services.slice(0, 4).join(', ') + '.' : null),
      location:   kb.serviceArea || intel.serviceArea || (intel.google || {}).address || null,
      insurance:  kb.insurance || faq(/insurance|billing/),
      policies:   kb.policies || intel.policies || null,
    };
  }

  /* ── Human response generator ─────────────────────────── */
  /* Intent-specific composition from approved facts, with
     conversation memory, phrasing variation, and an honest
     fallback that never invents information.                 */
  function composeReply(biz, agent, job, intentId, know, msg, ctx) {
    var f = bizFacts(biz);
    var t = DRD.terms(biz.industryGroup);
    var team = biz.industryGroup === 'childcare' ? 'daycare team' : 'team';
    var p = ctx.profile = ctx.profile || {};
    ctx.counts = ctx.counts || {};
    var v = ctx.counts[intentId] = (ctx.counts[intentId] || 0) + 1; /* variation index */
    function pick(arr) { return arr[(v - 1) % arr.length]; }
    function used(src) { ctx._src = src; return true; }
    function fb() {
      ctx._fallback = true; ctx.pendingAction = 'callback'; ctx.ctaOffered = true;
      return 'I want to make sure I give you the correct information. I can take your details and have the ' + team + ' confirm — would that be okay?';
    }
    var ans = know ? trim(know.text, 200) : null;
    var cta = ctaFor(biz, job, intentId);
    var push = (cta && !ctx.leadCaptured && !ctx.ctaOffered) ? ' Want me to ' + cta.text + '?' : '';
    function offer() { if (push) { ctx.ctaOffered = true; ctx.pendingAction = cta.type; } return push; }
    var kid = p.childAge ? (p.childAge + (p.ageUnit === 'months' ? '-month' : '-year') + '-old') : null;

    switch (intentId) {
      case 'greeting':
        return "Hi! 👋 I'm " + agent.agentName + ' at ' + biz.name + '. ' +
               (biz.industryGroup === 'childcare' ? 'Are you looking for childcare, fees, or maybe a tour?' : 'How can I help you today?');
      case 'thanks':
        return pick(["You're so welcome! 😊 Anything else I can help with?",
                     "My pleasure! Give me a shout if anything else comes up. 😊"]);

      case 'price':
        if (!f.fees) return fb();
        used('Business knowledge — fees');
        return pick([
          (kid ? 'For your ' + kid + ' — ' : 'Happy to help! ') + trim(f.fees, 190) + offer(),
          'Of course. ' + trim(f.fees, 190) + ' If you tell me a bit about what you need, the ' + team + ' can confirm your exact rate.' + offer(),
        ]);

      case 'subsidy':
        if (!f.subsidy) return fb();
        used('Business knowledge — subsidy');
        return pick([
          'Yes! ' + trim(f.subsidy, 190) + ' Lots of our families use it.' + offer(),
          trim(f.subsidy, 190) + ' The ' + team + ' can walk you through exactly how it applies to you.' + offer(),
        ]);

      case 'meals':
        if (!f.meals) return fb();
        used('Business knowledge — meals');
        var mealCore = trim(f.meals.replace(/nut[- ]?free[^.]*\.?/i, '').trim(), 170);
        var mealNote = p.allergyNoted
          ? " And since you mentioned the allergy — the kitchen plans around each child's individual needs."
          : (f.allergy ? ' (' + trim(f.allergy, 80).replace(/\.$/, '') + ', too.)' : '');
        return pick([
          'Great question! ' + mealCore + mealNote,
          'Of course — ' + mealCore + mealNote + ' Anything specific your little one loves (or avoids)?',
        ]);

      case 'allergy':
        p.allergyNoted = true;
        ctx.awaitingProfile = true; ctx.pendingAction = 'callback'; ctx.ctaOffered = true;
        used(f.allergy ? 'Business knowledge — allergy policy' : 'Approved allergy protocol');
        return pick([
          'Absolutely — we take allergies very seriously. ' + (f.allergy ? trim(f.allergy, 120) + ' ' : '') +
            'Every child with an allergy gets an individual allergy plan, and the staff review the details with you before day one. ' +
            "Could you share your child's age and the allergy details? I'll have the " + team + ' follow up personally.',
          "You're in good hands — this comes up a lot and we handle it carefully. " + (f.allergy ? trim(f.allergy, 120) + ' ' : '') +
            'The team builds an individual plan for each child. What age is your little one, and what should we know about the allergy?',
        ]);

      case 'availability':
        used(f.ages ? 'Business knowledge — age groups' : 'General availability guidance');
        var avAck = kid ? 'For a ' + kid + (p.startDate ? ' starting ' + p.startDate : '') + ' — ' : '';
        return pick([
          avAck + 'spots genuinely do move quickly' + (f.ages ? ' (our rooms: ' + trim(f.ages, 110) + ')' : '') +
            ", so I'd rather have the " + team + ' confirm exact openings than guess.' + (offer() || ' Want me to set that up?'),
          avAck + "I don't want to promise a spot I can't guarantee — the " + team + ' checks live availability.' + (offer() || ' Shall I have them confirm for you?'),
        ]);

      case 'hours':
        if (!f.hours) return fb();
        used('Business knowledge — hours');
        return pick(["We're open " + trim(f.hours, 130).replace(/^we'?re open /i, '') + offer(),
                     trim(f.hours, 130) + ' — does that work for your schedule?' ]);

      case 'ages':
        if (!f.ages) return fb();
        used('Business knowledge — age groups');
        if (!p.childAge) { ctx.awaitingProfile = true; }
        return trim(f.ages, 170) + (p.childAge ? ' Your ' + kid + ' would fit right in.' : ' How old is your little one? I can point you to the right room.');

      case 'sick-policy':
        if (!f.sick && !f.policies) return fb();
        used('Business knowledge — health policy');
        return trim(f.sick || f.policies, 190) + ' If your child is unwell today, I can let the ' + team + ' know — want me to pass on a message?';

      case 'holiday-closure':
        if (!f.holidays) return fb();
        used('Business knowledge — closures');
        return trim(f.holidays, 180) + (f.hours ? ' Regular hours otherwise: ' + trim(f.hours, 80) : '');

      case 'printables':
        used('Activity & printable hub');
        return "We love sharing resources! Our team keeps printable packs — worksheets, routine charts, flashcards and seasonal activities. I can have the " + team + ' send you the ones that fit your child\'s age. What age is your little one?';

      case 'existing-parent':
        ctx.pendingAction = 'callback'; ctx.ctaOffered = true; ctx.stage = 'ask-name';
        used('Family support flow');
        return "Of course — I'll make sure this reaches the right person on the " + team + " straight away. Can I grab your name and the message you'd like me to pass on?";

      case 'activity-planning':
        if (!f.activities) return fb();
        used('Business knowledge — program');
        return pick([
          trim(f.activities, 190) + ' The days are full but never rushed. 😊',
          'The children keep busy! ' + trim(f.activities, 180),
        ]);

      case 'waitlist':
        ctx.pendingAction = 'waitlist'; ctx.ctaOffered = true;
        used(f.waitlist ? 'Business knowledge — waitlist' : 'Waitlist flow');
        return (f.waitlist ? trim(f.waitlist, 140) + ' ' : '') + "I can add you right now — what's your name?";

      case 'quote':
        ctx.pendingAction = 'quote'; ctx.ctaOffered = true;
        return (ans ? trim(ans, 140) + ' ' : '') + 'I can get a quote started for you right now — it only takes a minute. Could I grab a few details?';

      case 'tour': case 'booking': case 'reservation':
        ctx.pendingAction = intentId === 'tour' ? 'tour' : intentId;
        ctx.ctaOffered = true;
        used(f.tours ? 'Business knowledge — tour times' : 'Booking flow');
        return (intentId === 'tour' && f.tours ? trim(f.tours, 110) + ' ' : (ans ? trim(ans, 110) + ' ' : '')) +
               "Perfect — I can set that up right now. What's your name?";

      case 'speak-human':
        ctx.pendingAction = 'callback'; ctx.ctaOffered = true;
        return "Of course — I'll have a team member call you personally. What's your name?";

      case 'complaint':
        ctx.pendingAction = 'escalation'; ctx.ctaOffered = true; ctx.escalated = true;
        return "I'm really sorry to hear that — that's not the experience we want you to have. I'm flagging this for " +
               ((biz.knowledge || {}).escalation ? 'our manager (' + trim(biz.knowledge.escalation, 60) + ')' : 'our manager') +
               ' right now. Can I get your name so they can reach you directly?';

      case 'emergency':
        ctx.pendingAction = 'callback'; ctx.ctaOffered = true; ctx.escalated = true;
        return 'That sounds urgent — ' + (biz.phone ? 'please call us directly at ' + biz.phone + '. ' : '') +
               "I'm also alerting the team right now. Can I take your name and number so someone calls you immediately?";

      case 'review':
        if (job.actions.sendReviewLink && (biz.reviewLink || (biz.intel && biz.intel.google && biz.intel.google.reviewLink))) {
          ctx.reviewOffered = true;
          return "That's wonderful to hear — thank you! 🌟 It would mean a lot if you shared that in a quick Google review: " +
                 (biz.reviewLink || biz.intel.google.reviewLink);
        }
        return "Thank you so much — I'll pass that on to the team, it will make their day!";

      case 'insurance': case 'services': case 'location':
        var fact2 = intentId === 'insurance' ? f.insurance : intentId === 'services' ? f.services : f.location;
        if (!fact2 && !ans) return fb();
        used('Business knowledge — ' + intentId);
        return trim(fact2 || ans, 190) + offer();

      default:
        if (ans) { used(know.source); return ans + offer(); }
        ctx.unknownCount = (ctx.unknownCount || 0) + 1;
        if (ctx.unknownCount >= 2) return fb();
        return 'Good question! Could you tell me a little more so I point you in exactly the right direction?';
    }
  }

  /* ── Main conversation step ────────────────────────────── */
  /* ctx is persistent across a session:
     { stage, lead:{}, ctaOffered, pendingAction, escalated,
       leadCaptured, msgs:[] }                                 */
  function converse(biz, agent, msg, ctx) {
    ctx = ctx || {};
    ctx.lead = ctx.lead || {};
    var job = jobFor(agent);
    var det = detectIntent(msg);
    var out = { reply: '', intent: det.primary, intentLabel: intentLabel(det.primary),
                actions: [], outcomes: [],
                checks: { leadCaptured: !!ctx.leadCaptured, bookingOffered: false, followUpSuggested: false, escalationNeeded: !!ctx.escalated, dataSaved: false } };
    ctx._src = null; ctx._fallback = false;

    /* ── Conversation memory: remember details the parent shares ── */
    var p = ctx.profile = ctx.profile || {};
    var ageM = msg.match(/(\d{1,2})\s*(?:-|\s)?(months?|mos?)\b/i) || msg.match(/(\d{1,2})\s*(?:-|\s)?(?:years?|yrs?|yo|year-old)\b/i);
    var foundAge = false;
    if (ageM) { p.childAge = ageM[1]; p.ageUnit = /mo/i.test(ageM[2] || '') ? 'months' : 'years'; foundAge = true; }
    var monthM = msg.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i);
    if (monthM) p.startDate = monthM[1].charAt(0).toUpperCase() + monthM[1].slice(1).toLowerCase();
    var schedM = msg.match(/\b(full[\s-]?time|part[\s-]?time)\b/i);
    if (schedM) p.schedule = schedM[1].toLowerCase().replace(/\s/, '-');
    var foundAllergy = /allerg|peanut|epipen|celiac|lactose|nut[- ]?free/i.test(msg);
    if (foundAllergy) { p.allergyNoted = true; if (msg.length < 120) p.allergyDetail = msg.trim(); }

    /* Extract any contact info present in ANY message */
    var phone = (msg.match(PHONE_RE) || [null])[0];
    var email = (msg.match(EMAIL_RE) || [null])[0];
    if (phone) ctx.lead.phone = phone;
    if (email) ctx.lead.email = email;

    /* Parent just shared the details the agent asked for (age/allergy) */
    if (ctx.awaitingProfile && !ctx.leadCaptured && !ctx.stage && (foundAge || foundAllergy) && !phone && !email) {
      ctx.awaitingProfile = false;
      ctx.stage = ctx.lead.name ? 'ask-contact' : 'ask-name';
      out.reply = "Perfect — I've noted that" + (p.childAge ? ' for your ' + p.childAge + (p.ageUnit === 'months' ? '-month' : '-year') + '-old' : '') +
                  (p.allergyNoted ? ', including the allergy details' : '') + '. ' +
                  (ctx.stage === 'ask-name' ? "What's your name?" : 'And the best phone number or email for you?');
      out.confidence = 'high'; out.nextAction = 'Team callback';
      finalize(); return out;
    }

    /* Capture-flow stages */
    if (ctx.stage === 'ask-name' && det.primary !== 'complaint') {
      var nm = msg.replace(PHONE_RE, '').replace(EMAIL_RE, '')
                  .replace(/(my name is|i am|i'm|this is|it's|its)/i, '').replace(/[,.!]/g, '').trim();
      if (nm && nm.length < 50 && nm.split(/\s+/).length <= 4) ctx.lead.name = nm;
      if (ctx.lead.phone || ctx.lead.email) { ctx.stage = 'confirm'; }
      else {
        ctx.stage = 'ask-contact';
        out.reply = 'Thanks' + (ctx.lead.name ? ', ' + firstName(ctx.lead.name) : '') + '! And the best phone number (or email) to reach you?';
        finalize(); return out;
      }
    } else if (ctx.stage === 'ask-contact') {
      if (ctx.lead.phone || ctx.lead.email) ctx.stage = 'confirm';
      else { out.reply = "I just need a phone number or email so the team can reach you — whichever you prefer!"; finalize(); return out; }
    }

    /* Completion: save structured outcomes */
    if (ctx.stage === 'confirm' && !ctx.leadCaptured) {
      saveOutcomes(biz, agent, job, ctx, out);
      var what = { tour: 'your tour request', booking: 'your booking request', reservation: 'your reservation request',
                   quote: 'your quote request', callback: 'a callback', waitlist: 'your waitlist spot',
                   escalation: 'this for our manager', lead: 'your details' }[ctx.pendingAction || 'lead'];
      var noted = [];
      if (ctx.profile && ctx.profile.childAge) noted.push('your ' + ctx.profile.childAge + (ctx.profile.ageUnit === 'months' ? '-month' : '-year') + '-old');
      if (ctx.profile && ctx.profile.allergyNoted) noted.push('the allergy note');
      if (ctx.profile && ctx.profile.startDate) noted.push(ctx.profile.startDate + ' start');
      out.reply = 'Perfect, all set ✅ I\'ve logged ' + what + (ctx.lead.name ? ' for ' + firstName(ctx.lead.name) : '') +
                  (noted.length ? ' — including ' + noted.join(', ') + ' —' : '') +
                  ' and the team will ' + (ctx.pendingAction === 'escalation' ? 'call you as a priority' : 'confirm with you shortly') +
                  '. Anything else I can help with?';
      ctx.stage = 'done';
      finalize(); return out;
    }

    /* User accepts an offered CTA */
    if (ctx.ctaOffered && !ctx.leadCaptured && ctx.stage !== 'ask-name' &&
        /^(yes|yeah|yep|sure|ok|okay|sounds good|please|definitely|let's do it|go ahead)\b/i.test(msg.trim())) {
      ctx.stage = ctx.lead.name ? 'ask-contact' : 'ask-name';
      out.reply = ctx.lead.name ? 'Great! And the best phone number or email for you?' : "Great! What's your name?";
      if (ctx.stage === 'ask-contact' && (ctx.lead.phone || ctx.lead.email)) { ctx.stage = 'confirm'; return converse(biz, agent, msg, ctx); }
      finalize(); return out;
    }

    /* Contact info volunteered mid-chat */
    if ((phone || email) && !ctx.leadCaptured && ctx.stage !== 'done') {
      if (!ctx.lead.name) {
        var nm2 = msg.replace(PHONE_RE, '').replace(EMAIL_RE, '').replace(/(my name is|i am|i'm|this is|call me)/i, '').replace(/[,.!]/g, '').trim();
        if (nm2 && nm2.length < 50) ctx.lead.name = nm2;
      }
      ctx.stage = 'confirm';
      if (!ctx.pendingAction) ctx.pendingAction = 'lead';
      return converse(biz, agent, '', ctx);
    }

    /* Normal reply */
    var know = knowledgeFor(biz, det.primary, msg);
    out.reply = composeReply(biz, agent, job, det.primary, know, msg, ctx);
    out.knowledgeSource = ctx._src || (know ? know.source : null);
    out.fallbackUsed = !!ctx._fallback;
    if (ctx.ctaOffered && ['tour','booking','reservation','quote','callback','waitlist','escalation'].indexOf(ctx.pendingAction) !== -1 &&
        (det.primary === 'tour' || det.primary === 'booking' || det.primary === 'reservation' || det.primary === 'quote' ||
         det.primary === 'speak-human' || det.primary === 'complaint' || det.primary === 'emergency')) {
      ctx.stage = 'ask-name';
    }
    finalize();
    return out;

    function finalize() {
      /* Confidence + next best action for the outcome analysis panel */
      if (!out.confidence) {
        out.confidence = ctx._fallback ? 'low'
          : (out.knowledgeSource || ctx._src) ? 'high'
          : det.primary !== 'general' ? 'medium' : 'low';
      }
      if (!out.nextAction) {
        out.nextAction = { tour: 'Book tour', booking: 'Create booking request', reservation: 'Create reservation request',
                           quote: 'Prepare quote', callback: 'Team callback', waitlist: 'Add to waitlist',
                           escalation: 'Staff escalation' }[ctx.pendingAction] || 'Continue conversation';
      }
      out.checks.leadCaptured = !!ctx.leadCaptured;
      out.checks.escalationNeeded = !!ctx.escalated;
      out.checks.bookingOffered = ['tour','booking','reservation'].indexOf(ctx.pendingAction) !== -1;
      out.checks.followUpSuggested = !!(job.actions.whatsappFollowup && (ctx.ctaOffered || ctx.leadCaptured));
      out.checks.dataSaved = !!ctx.leadCaptured;
      if (out.checks.bookingOffered)                 out.actions.push({ icon:'📅', label:'Booking offered' });
      if (ctx.pendingAction === 'quote')             out.actions.push({ icon:'💰', label:'Quote request started' });
      if (ctx.pendingAction === 'callback')          out.actions.push({ icon:'📞', label:'Callback flow started' });
      if (ctx.escalated)                             out.actions.push({ icon:'🚨', label:'Staff escalation triggered' });
      if (ctx.reviewOffered)                         out.actions.push({ icon:'⭐', label:'Review link shared' });
      if (out.checks.followUpSuggested && !ctx.leadCaptured) out.actions.push({ icon:'📲', label:'WhatsApp follow-up suggested' });
      if (ctx.leadCaptured)                          out.actions.push({ icon:'🎯', label:'Lead captured & saved' });
    }
  }

  /* ── Structured outcome persistence + workflow automation ─ */
  function saveOutcomes(biz, agent, job, ctx, out) {
    var typeMap = { tour:'Tour Request', booking:'Booking Request', reservation:'Reservation Request',
                    quote:'Quote Request', callback:'Callback Request', waitlist:'Waitlist Request',
                    escalation:'Escalation', lead:'General Enquiry' };
    var statusMap = { tour:'booking-requested', booking:'booking-requested', reservation:'booking-requested',
                      waitlist:'follow-up-scheduled', quote:'quote-requested', callback:'callback-requested',
                      escalation:'escalated', lead:'new' };
    var pa = ctx.pendingAction || 'lead';
    var enquiryType = typeMap[pa];
    var hot = pa === 'quote' || pa === 'booking' || pa === 'tour' || ctx.escalated;
    var followUpDue = new Date(Date.now() + (ctx.escalated ? 2 : 24) * 3600e3).toISOString();
    var lead = DRS.create('leads', {
      businessId: biz.id, agentId: agent.id,
      name: ctx.lead.name || 'Unknown', phone: ctx.lead.phone || '', email: ctx.lead.email || '',
      enquiryType: enquiryType, requestedService: ctx.requestedService || enquiryType,
      channel: agent.channels && agent.channels[0] || 'website',
      status: statusMap[pa],
      qualScore: hot ? 80 + Math.floor(Math.random() * 15) : 55 + Math.floor(Math.random() * 25),
      score: hot ? 'hot' : 'warm',
      urgency: ctx.escalated ? 'urgent' : 'routine',
      priority: ctx.escalated ? 'urgent' : hot ? 'high' : 'normal',
      bookingRequested: ['tour','booking','reservation'].indexOf(pa) !== -1,
      quoteRequested: pa === 'quote',
      reviewRequested: !!ctx.reviewOffered,
      escalated: !!ctx.escalated,
      lastInteraction: DRS.now(),
      nextFollowUpDue: followUpDue,
      notes: (ctx.escalated ? '[ESCALATION] ' : '') + 'Captured by ' + agent.agentName + '. Pending action: ' + enquiryType + '.' +
             (ctx.profile && ctx.profile.childAge ? ' Child: ' + ctx.profile.childAge + ' ' + (ctx.profile.ageUnit || 'years') + '.' : '') +
             (ctx.profile && ctx.profile.allergyNoted ? ' ⚠ Allergy noted' + (ctx.profile.allergyDetail ? ': "' + ctx.profile.allergyDetail + '"' : '') + '.' : '') +
             (ctx.profile && ctx.profile.startDate ? ' Start: ' + ctx.profile.startDate + '.' : '') +
             (ctx.profile && ctx.profile.schedule ? ' Schedule: ' + ctx.profile.schedule + '.' : ''),
      nextAction: pa === 'callback' || ctx.escalated ? 'Call back today' : job.followUp || 'Follow up',
      fields: Object.assign({}, ctx.lead, ctx.profile || {}),
    });
    ctx.leadCaptured = true; ctx.leadId = lead.id;
    out.outcomes.push({ type: 'lead', id: lead.id });

    if (['tour','booking','reservation','waitlist'].indexOf(pa) !== -1) {
      var bk = DRS.create('bookings', {
        businessId: biz.id, agentId: agent.id, leadId: lead.id,
        service: typeMap[pa], status: 'request',
        bookingDate: null, notes: 'Requested in conversation — team to confirm time with ' + (ctx.lead.name || 'customer') + '.',
      });
      out.outcomes.push({ type: 'booking', id: bk.id });
    }

    /* Workflow automation: schedule follow-up tasks (simulated channel actions, logged) */
    if (job.actions.whatsappFollowup && !ctx.escalated) {
      var task = DRS.create('tasks', {
        businessId: biz.id, agentId: agent.id, leadId: lead.id,
        type: 'whatsapp-followup', trigger: 'new-lead', status: 'scheduled', dueAt: followUpDue,
        message: 'Hi ' + firstName(ctx.lead.name || 'there') + '! Following up on your ' + enquiryType.toLowerCase() + ' — want me to help you get that locked in this week?',
      });
      out.outcomes.push({ type: 'task', id: task.id });
    }
    if (pa === 'callback' || ctx.escalated) {
      var cb = DRS.create('tasks', {
        businessId: biz.id, agentId: agent.id, leadId: lead.id,
        type: 'callback', trigger: ctx.escalated ? 'escalation' : 'callback-request',
        status: 'scheduled', dueAt: new Date(Date.now() + 2 * 3600e3).toISOString(),
        message: (ctx.escalated ? 'URGENT: ' : '') + 'Call ' + (ctx.lead.name || 'customer') + ' back — ' + enquiryType + '.',
      });
      out.outcomes.push({ type: 'task', id: cb.id });
    }
    if (ctx.escalated) {
      DRS.update('leads', lead.id, { notes: lead.notes + ' Staff alert created.' });
      out.outcomes.push({ type: 'escalation', id: lead.id });
    }
    DRS.update('agents', agent.id, { tasksCompleted: (agent.tasksCompleted || 0) + 1 });
  }

  /* Flag an unhappy review internally (Review agent) */
  function flagUnhappy(biz, agent, content) {
    return DRS.create('reviews', {
      businessId: biz.id, agentId: agent ? agent.id : null,
      platform: 'internal', rating: 2, authorName: 'Flagged feedback',
      content: content, status: 'flagged',
    });
  }

  /* ── Business creation from wizard ─────────────────────── */
  function createBusiness(w) {
    var slug = uniqueSlug(w.name);
    var biz = DRS.create('businesses', {
      name: w.name, slug: slug,
      industryGroup: w.industryGroup, businessType: w.businessType,
      website: w.website || '', phone: w.phone || '', email: w.email || '',
      whatsapp: w.whatsapp || '', location: w.location || '',
      reviewLink: w.reviewLink || '', bookingLink: w.bookingLink || '',
      status: 'active', color: pickColor(w.name), initial: initials(w.name),
      selectedAgents: w.selectedAgents.slice(),
      knowledge: Object.assign({}, w.knowledge || {}),
      intel: w.intel || null,
      manualRules: w.manualRules || [],
      social: w.social || {},
    });
    w.selectedAgents.forEach(function (type) {
      var def = DRD.agentDef(w.industryGroup, type) || { name: type, channels: ['website'] };
      var job = DRD.jobFor(type);
      DRS.create('agents', {
        businessId: biz.id, agentType: type, agentName: def.name,
        status: 'active', channels: def.channels || ['website'],
        role: job.role, purpose: job.purpose,
        supportedIntents: job.intents.slice(),
        actionsEnabled: Object.assign({}, job.actions),
        escalationRules: job.escalation.slice(),
        responseStyle: Object.assign({}, job.style),
        knowledgeSources: { website: !!w.intel, google: !!w.intel, social: !!(w.social && Object.keys(w.social).length), manualRules: true, docs: false, faq: true },
        trainingStatus: w.trained ? 'ready' : 'not-trained',
        lastTrained: w.trained ? DRS.now() : null,
        tasksCompleted: 0,
      });
    });
    return biz;
  }

  /* ── Training simulation ───────────────────────────────── */
  function trainAgent(agentId, done) {
    DRS.update('agents', agentId, { trainingStatus: 'training' });
    setTimeout(function () {
      DRS.update('agents', agentId, { trainingStatus: 'ready', lastTrained: DRS.now() });
      if (done) done(DRS.get('agents', agentId));
    }, 1200 + Math.random() * 900);
  }
  function trainAll(businessId, onEach, onDone) {
    var agents = DRS.list('agents', { businessId: businessId });
    var remaining = agents.length;
    if (!remaining) { if (onDone) onDone(); return; }
    agents.forEach(function (a, i) {
      setTimeout(function () {
        DRS.update('agents', a.id, { trainingStatus: 'training' });
        if (onEach) onEach(a, 'training');
        trainAgent(a.id, function (updated) {
          if (onEach) onEach(updated, 'ready');
          remaining--;
          if (!remaining && onDone) onDone();
        });
      }, i * 350);
    });
  }

  /* ── Record helpers / stats / embed (unchanged API) ────── */
  function captureLead(biz, agent, data) {
    return DRS.create('leads', Object.assign({
      businessId: biz.id, agentId: agent ? agent.id : null,
      channel: 'website', status: 'New', qualScore: 60 + Math.floor(Math.random() * 30),
    }, data));
  }
  function logConversation(biz, agent, messages, leadId, meta) {
    return DRS.create('conversations', Object.assign({
      businessId: biz.id, agentId: agent ? agent.id : null, leadId: leadId || null,
      channel: 'website', leadCaptured: !!leadId, messages: messages,
    }, meta || {}));
  }
  function addBooking(biz, agent, data) {
    return DRS.create('bookings', Object.assign({
      businessId: biz.id, agentId: agent ? agent.id : null, status: 'pending',
    }, data));
  }
  function addReview(biz, data) {
    return DRS.create('reviews', Object.assign({ businessId: biz.id, platform: 'google', status: 'pending' }, data));
  }
  function bizStats(businessId) {
    return {
      agents:        DRS.list('agents',        { businessId: businessId }),
      leads:         DRS.list('leads',         { businessId: businessId }),
      conversations: DRS.list('conversations', { businessId: businessId }),
      bookings:      DRS.list('bookings',      { businessId: businessId }),
      reviews:       DRS.list('reviews',       { businessId: businessId }),
    };
  }
  function agentStats(agentId) {
    return {
      leads:         DRS.list('leads',         { agentId: agentId }),
      conversations: DRS.list('conversations', { agentId: agentId }),
      bookings:      DRS.list('bookings',      { agentId: agentId }),
    };
  }
  /* ── Setup status: Draft → Needs Training → Trained →
         Test Passed → Demo Mode / Live ────────────────────── */
  function bizSetupStatus(biz) {
    if (!biz) return 'draft';
    if (biz.setupStatus === 'live') return 'live';
    if (biz.setupStatus === 'demo') return 'demo';
    if (biz.setupStatus === 'draft') return 'draft';
    var agents = DRS.list('agents', { businessId: biz.id });
    if (!agents.length) return 'draft';
    if (agents.some(function (a) { return a.trainingStatus !== 'ready'; })) return 'needs-training';
    if (biz.testPassed) return 'test-passed';
    return 'trained';
  }
  function setupBadge(status) {
    var map = {
      'draft':          ['gray',   'Draft'],
      'needs-training': ['amber',  'Needs Training'],
      'trained':        ['blue',   'Trained'],
      'test-passed':    ['purple', 'Test Passed'],
      'demo':           ['amber',  '◐ Demo Mode'],
      'live':           ['green',  '● Live'],
    };
    var x = map[status] || ['gray', status];
    return '<span class="badge badge--' + x[0] + '">' + x[1] + '</span>';
  }

  /* ── Sync deployed agents to a selected type list ──────── */
  function syncAgents(biz, types) {
    var existing = DRS.list('agents', { businessId: biz.id });
    existing.forEach(function (a) {
      if (types.indexOf(a.agentType) === -1) DRS.remove('agents', a.id);
    });
    types.forEach(function (type) {
      if (existing.some(function (a) { return a.agentType === type; })) return;
      var def = DRD.agentDef(biz.industryGroup, type) || { name: type, channels: ['website'] };
      var job = DRD.jobFor(type);
      DRS.create('agents', {
        businessId: biz.id, agentType: type, agentName: def.name,
        status: 'active', channels: def.channels || ['website'],
        role: job.role, purpose: job.purpose,
        supportedIntents: job.intents.slice(),
        actionsEnabled: Object.assign({}, job.actions),
        escalationRules: job.escalation.slice(),
        responseStyle: Object.assign({}, job.style),
        knowledgeSources: { website: !!biz.intel, google: !!biz.intel, social: !!(biz.social && Object.keys(biz.social).length), manualRules: true, docs: false, faq: true },
        trainingStatus: 'not-trained', lastTrained: null, tasksCompleted: 0,
      });
    });
    DRS.update('businesses', biz.id, {
      selectedAgents: types.slice(),
      setupStatus: biz.setupStatus === 'draft' ? null : biz.setupStatus,
    });
    return DRS.list('agents', { businessId: biz.id });
  }

  function embedSnippet(biz, agentType) {
    return '<script src="https://digital-rise-os.vercel.app/agents/widget/widget.js"\n' +
           '        data-business="' + biz.slug + '"\n' +
           '        data-agent="' + (agentType || 'website-enquiry') + '"></' + 'script>';
  }

  /* Legacy simple respond() kept for old pages (wizard v1 etc.) */
  function respond(biz, agent, msg) {
    var ctx = {};
    var r = converse(biz, agent, msg, ctx);
    return { reply: r.reply, actions: r.actions };
  }

  return {
    slugify: slugify, uniqueSlug: uniqueSlug,
    jobFor: jobFor, detectIntent: detectIntent, intentLabel: intentLabel,
    knowledgeFor: knowledgeFor, converse: converse, respond: respond,
    flagUnhappy: flagUnhappy,
    createBusiness: createBusiness,
    trainAgent: trainAgent, trainAll: trainAll,
    captureLead: captureLead, logConversation: logConversation,
    addBooking: addBooking, addReview: addReview,
    bizStats: bizStats, agentStats: agentStats,
    embedSnippet: embedSnippet,
    bizSetupStatus: bizSetupStatus, setupBadge: setupBadge, syncAgents: syncAgents,
  };
})();
