'use strict';
/* ============================================================
   DRA — DIGITAL RISE PLATFORM ACTIONS
   Business logic on top of DRS storage + DRD catalog.
   ============================================================ */
var DRA = (function () {

  /* ── Helpers ───────────────────────────────────────────── */
  function slugify(name) {
    return String(name).toLowerCase().trim()
      .replace(/['’]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'business';
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

  /* ── Create business from wizard state ─────────────────── */
  function createBusiness(w) {
    var slug = uniqueSlug(w.name);
    var biz = DRS.create('businesses', {
      name: w.name, slug: slug,
      industryGroup: w.industryGroup, businessType: w.businessType,
      website: w.website || '', phone: w.phone || '', email: w.email || '',
      whatsapp: w.whatsapp || '', location: w.location || '',
      reviewLink: w.reviewLink || '', bookingLink: w.bookingLink || '',
      status: 'active',
      color: pickColor(w.name), initial: initials(w.name),
      selectedAgents: w.selectedAgents.slice(),
      knowledge: Object.assign({}, w.knowledge || {}),
    });
    w.selectedAgents.forEach(function (type) {
      var def = DRD.agentDef(w.industryGroup, type) || { name: type, channels: ['website'] };
      DRS.create('agents', {
        businessId: biz.id, agentType: type, agentName: def.name,
        status: 'active', channels: def.channels || ['website'],
        actionsEnabled: { createLead: true, offerBooking: true, whatsappFollowup: !!w.whatsapp, requestReview: !!w.reviewLink, escalate: true },
        trainingStatus: w.trained ? 'ready' : 'not-trained',
        lastTrained: w.trained ? DRS.now() : null,
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

  /* ── Rule-based tester engine ──────────────────────────── */
  function respond(biz, agent, msg) {
    var m = msg.toLowerCase();
    var kb = biz.knowledge || {};
    var actions = [];
    var reply = null;

    if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(m)) {
      reply = "Hi there! 👋 I'm the " + (agent ? agent.agentName : 'assistant') + ' for ' + biz.name + '. How can I help you today?';
    } else if (/thank|thanks|great|perfect|awesome/.test(m)) {
      reply = "You're very welcome! 😊 Is there anything else I can help you with?";
    } else {
      /* KB keyword matching via DRD.keywordMap */
      for (var i = 0; i < DRD.keywordMap.length && !reply; i++) {
        var entry = DRD.keywordMap[i];
        var val = kb[entry.field];
        if (!val) continue;
        for (var j = 0; j < entry.kws.length; j++) {
          if (m.indexOf(entry.kws[j]) !== -1) { reply = val; break; }
        }
      }
    }
    if (!reply) {
      reply = "That's a great question! I want to give you the right answer — could you share a little more detail? " +
              (kb.escalation ? 'I can also connect you with our team (' + kb.escalation + ').' : '');
    }

    /* Actions panel detection */
    if (/name|phone|email|contact|reach me|call me/.test(m) || /\d{3}[\s\-.]?\d{3,4}/.test(m) || /@/.test(m)) {
      actions.push({ icon: '🎯', label: 'Lead captured', type: 'lead' });
    }
    if (/book|tour|visit|appointment|reserve|consult/.test(m)) {
      actions.push({ icon: '📅', label: 'Booking offered', type: 'booking' });
    }
    if ((biz.whatsapp || kb.whatsapp) && /follow|quote|think about|later|not sure/.test(m)) {
      actions.push({ icon: '📲', label: 'WhatsApp follow-up suggested', type: 'whatsapp' });
    }
    if ((biz.reviewLink || kb.reviewLink) && /review|feedback|rate/.test(m)) {
      actions.push({ icon: '⭐', label: 'Review link available', type: 'review' });
    }
    if (/complain|unhappy|angry|manager|refund|terrible|speak to (a )?human/.test(m)) {
      actions.push({ icon: '🚨', label: 'Staff escalation triggered', type: 'escalate' });
    }
    return { reply: reply, actions: actions };
  }

  /* ── Record creation ───────────────────────────────────── */
  function captureLead(biz, agent, data) {
    return DRS.create('leads', Object.assign({
      businessId: biz.id, agentId: agent ? agent.id : null,
      channel: 'website', status: 'New', qualScore: 60 + Math.floor(Math.random() * 30),
    }, data));
  }
  function logConversation(biz, agent, messages, leadId) {
    return DRS.create('conversations', {
      businessId: biz.id, agentId: agent ? agent.id : null, leadId: leadId || null,
      channel: 'website', leadCaptured: !!leadId, messages: messages,
    });
  }
  function addBooking(biz, agent, data) {
    return DRS.create('bookings', Object.assign({
      businessId: biz.id, agentId: agent ? agent.id : null, status: 'pending',
    }, data));
  }
  function addReview(biz, data) {
    return DRS.create('reviews', Object.assign({
      businessId: biz.id, platform: 'google', status: 'pending',
    }, data));
  }

  /* ── Stats ─────────────────────────────────────────────── */
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

  /* ── Deployment snippets ───────────────────────────────── */
  function embedSnippet(biz, agentType) {
    return '<script src="https://digital-rise-os.vercel.app/agents/widget/widget.js"\n' +
           '        data-business="' + biz.slug + '"\n' +
           '        data-agent="' + (agentType || 'website-enquiry') + '"></' + 'script>';
  }

  return {
    slugify: slugify, uniqueSlug: uniqueSlug,
    createBusiness: createBusiness,
    trainAgent: trainAgent, trainAll: trainAll,
    respond: respond,
    captureLead: captureLead, logConversation: logConversation,
    addBooking: addBooking, addReview: addReview,
    bizStats: bizStats, agentStats: agentStats,
    embedSnippet: embedSnippet,
  };
})();
