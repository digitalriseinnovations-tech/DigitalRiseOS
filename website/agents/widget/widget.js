/*!
 * Digital Rise — Website Enquiry Widget v1.0
 * Embeddable AI chat widget for client websites
 * Usage: <script src="https://digital-rise-os.vercel.app/agents/widget/widget.js"
 *           data-biz="sunshine-nursery"
 *           data-key="YOUR_INSTALL_KEY">
 *        </script>
 */
;(function (w, d) {
  'use strict';

  /* ── Config ─────────────────────────────────────────── */
  var script = d.currentScript || d.querySelector('script[data-biz]');
  var CFG = {
    bizSlug:    script ? (script.getAttribute('data-biz')    || 'demo') : 'demo',
    installKey: script ? (script.getAttribute('data-key')    || '')     : '',
    apiUrl:     script ? (script.getAttribute('data-api')    || 'https://digital-rise-os.vercel.app/api') : 'https://digital-rise-os.vercel.app/api',
    engine:     script ? (script.getAttribute('data-engine') || 'rule-based') : 'rule-based',
    position:   script ? (script.getAttribute('data-pos')    || 'right') : 'right',
    color:      script ? (script.getAttribute('data-color')  || '#6366F1') : '#6366F1',
    /* inline config — can be set via data-config="base64json" */
    inline:     script && script.getAttribute('data-config')
                  ? JSON.parse(atob(script.getAttribute('data-config')))
                  : null,
  };

  /* ── AI Engine Registry ─────────────────────────────── */
  /* Swap CFG.engine to 'claude' or 'openai' in future    */
  var AI = {
    'rule-based': function (msg, kb, state) {
      return RuleBasedEngine.respond(msg, kb, state);
    },
    'claude': function (msg, kb, state) {
      /* Future: POST to /api/chat with engine:'claude' */
      return RuleBasedEngine.respond(msg, kb, state);
    },
    'openai': function (msg, kb, state) {
      /* Future: POST to /api/chat with engine:'openai' */
      return RuleBasedEngine.respond(msg, kb, state);
    },
  };

  /* ── Storage Adapter ────────────────────────────────── */
  var Store = {
    _sb: null, /* Supabase client — injected when credentials available */
    saveLead: function (lead, cb) {
      /* Try API first, fallback to localStorage */
      var payload = Object.assign({}, lead, {
        biz_slug:    CFG.bizSlug,
        install_key: CFG.installKey,
        source:      'website-chat',
        channel:     'website',
        source_url:  w.location.href,
        created_at:  new Date().toISOString(),
      });
      /* Attempt POST to /api/lead */
      fetch(CFG.apiUrl + '/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      .then(function (r) { return r.json(); })
      .then(function (data) { if (cb) cb(null, data); })
      .catch(function () {
        /* Fallback: store in localStorage */
        try {
          var key = 'dr_widget_leads_' + CFG.bizSlug;
          var existing = JSON.parse(localStorage.getItem(key) || '[]');
          existing.push(payload);
          localStorage.setItem(key, JSON.stringify(existing));
        } catch (e) {}
        if (cb) cb(null, payload);
      });
      /* Dispatch event for GTM / analytics */
      try {
        w.dispatchEvent(new CustomEvent('dr:lead-captured', { detail: payload }));
      } catch (e) {}
    },
    saveConversation: function (messages) {
      try {
        fetch(CFG.apiUrl + '/conversation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            biz_slug:    CFG.bizSlug,
            install_key: CFG.installKey,
            messages:    messages,
            source_url:  w.location.href,
          }),
        }).catch(function () {});
      } catch (e) {}
    },
  };

  /* ── Rule-Based Engine ──────────────────────────────── */
  var RuleBasedEngine = {
    respond: function (msg, kb, state) {
      var m = msg.toLowerCase();
      var biz = STATE.biz;

      /* Greetings */
      if (/^(hi|hello|hey|good morning|good afternoon|good evening|howdy|yo)\b/i.test(m)) {
        return "Hi there! 👋 I'm " + STATE.agentName + " from " + biz.name + ". How can I help you today?";
      }
      /* Thanks */
      if (/thank|thanks|great|perfect|awesome|wonderful|brilliant/i.test(m)) {
        return "You're very welcome! 😊 Is there anything else I can help you with?";
      }

      /* KB keyword matching */
      if (kb) {
        var entries = Object.keys(kb);
        for (var i = 0; i < entries.length; i++) {
          var key = entries[i];
          var entry = kb[key];
          if (!entry || !entry.keywords) continue;
          var kws = entry.keywords;
          for (var j = 0; j < kws.length; j++) {
            if (m.indexOf(kws[j].toLowerCase()) !== -1) {
              return entry.answer;
            }
          }
        }
      }

      /* Industry defaults */
      if (/fee|cost|price|how much|pricing/i.test(m))        return kb && kb.fees    ? kb.fees.answer    : "I'd be happy to share our pricing! Could you tell me a bit more about what you're looking for?";
      if (/avail|space|spot|opening|room|place/i.test(m))    return kb && kb.avail   ? kb.avail.answer   : "Let me check availability for you. Can I ask — what timeframe are you looking at?";
      if (/tour|visit|see|look around|come in|show/i.test(m))return kb && kb.tour    ? kb.tour.answer    : "We'd love to show you around! When would work best for you?";
      if (/hour|open|close|time|when are you/i.test(m))      return kb && kb.hours   ? kb.hours.answer   : "We're open Monday to Friday. What time works for you?";
      if (/book|appoint|reserv|schedul/i.test(m))            return kb && kb.booking ? kb.booking.answer : "I can help you book! What service are you interested in?";
      if (/subsid|fund|government|cwelcc|care program/i.test(m)) return kb && kb.subsidy ? kb.subsidy.answer : "Great question about funding! Let me connect you with the right person.";
      if (/waitlist|wait list|waiting list/i.test(m))        return kb && kb.waitlist? kb.waitlist.answer : "Yes, you can join our waitlist! It's free — no deposit needed. Shall I add your details?";
      if (/service|offer|do you do|what do you/i.test(m))    return kb && kb.services? kb.services.answer : "We offer a range of services. What specifically are you interested in?";
      if (/contact|speak|talk|call|phone|email/i.test(m))    return "Of course! I can take your details and have someone call you back within " + (biz.callbackHours || '2 hours') + ". What's the best number to reach you?";
      if (/cancel|refund|complaint|problem|issue/i.test(m))  return "I'm sorry to hear that. Let me make sure the right person gets in touch with you. Can I get your name and contact details?";

      /* Fallback */
      return "That's a great question! I want to make sure I give you the right answer. Could you share a little more detail about what you're looking for? 😊";
    },
  };

  /* ── Widget State ───────────────────────────────────── */
  var STATE = {
    open:          false,
    messages:      [],
    lead:          { name: null, email: null, phone: null },
    leadCaptured:  false,
    qualStep:      0,
    captureStep:   'idle',  /* idle | name | phone | email | done */
    msgCount:      0,
    biz:           {},
    agentName:     'Ava',
    kb:            {},
    qualQs:        [],
    typed:         false,
  };

  /* ── CSS ────────────────────────────────────────────── */
  function injectCSS() {
    if (d.getElementById('dr-widget-css')) return;
    var s = d.createElement('style');
    s.id = 'dr-widget-css';
    var c = CFG.color;
    s.textContent = [
      '#dr-widget *{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif}',
      '#dr-bubble{position:fixed;bottom:24px;' + (CFG.position==='left'?'left':'right') + ':24px;z-index:999999;width:56px;height:56px;border-radius:50%;background:' + c + ';box-shadow:0 4px 20px rgba(0,0,0,.25);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .2s,box-shadow .2s}',
      '#dr-bubble:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(0,0,0,.3)}',
      '#dr-bubble svg{width:26px;height:26px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
      '#dr-notif-dot{position:absolute;top:2px;right:2px;width:14px;height:14px;border-radius:50%;background:#22C55E;border:2px solid #fff;animation:drPulse 2s infinite}',
      '@keyframes drPulse{0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.4)}70%{box-shadow:0 0 0 6px rgba(34,197,94,0)}}',
      '#dr-panel{position:fixed;bottom:92px;' + (CFG.position==='left'?'left':'right') + ':24px;z-index:999998;width:360px;max-width:calc(100vw - 32px);height:520px;max-height:calc(100vh - 120px);background:#fff;border-radius:16px;box-shadow:0 12px 48px rgba(0,0,0,.16);display:flex;flex-direction:column;overflow:hidden;transition:opacity .25s,transform .25s;opacity:0;pointer-events:none;transform:translateY(12px) scale(.98)}',
      '#dr-panel.dr-open{opacity:1;pointer-events:all;transform:translateY(0) scale(1)}',
      '#dr-head{padding:14px 16px;background:' + c + ';display:flex;align-items:center;gap:10px;flex-shrink:0}',
      '#dr-head-av{width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:1.125rem;flex-shrink:0}',
      '#dr-head-name{font-size:.9375rem;font-weight:700;color:#fff;line-height:1.2}',
      '#dr-head-status{font-size:.625rem;color:rgba(255,255,255,.85);margin-top:1px;display:flex;align-items:center;gap:4px}',
      '#dr-head-status span{width:6px;height:6px;border-radius:50%;background:#4ADE80;flex-shrink:0}',
      '#dr-head-close{margin-left:auto;width:28px;height:28px;border-radius:7px;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;border:none;color:#fff;font-size:1rem;transition:background .15s}',
      '#dr-head-close:hover{background:rgba(255,255,255,.25)}',
      '#dr-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:#F8FAFC}',
      '#dr-messages::-webkit-scrollbar{width:3px}#dr-messages::-webkit-scrollbar-thumb{background:#E2E8F0;border-radius:99px}',
      '.dr-msg{display:flex;flex-direction:column;gap:2px}',
      '.dr-msg.dr-out{align-items:flex-end}',
      '.dr-msg-label{font-size:.5rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#94A3B8;padding:0 2px}',
      '.dr-bubble-msg{max-width:82%;padding:9px 13px;border-radius:13px;font-size:.8125rem;line-height:1.55;white-space:pre-wrap;word-wrap:break-word}',
      '.dr-msg-in .dr-bubble-msg{background:#fff;color:#1E293B;border-bottom-left-radius:3px;box-shadow:0 1px 3px rgba(0,0,0,.06);border:1px solid #E2E8F0}',
      '.dr-msg-out .dr-bubble-msg{background:' + c + ';color:#fff;border-bottom-right-radius:3px}',
      '.dr-typing{display:flex;align-items:center;gap:3px;padding:9px 13px;background:#fff;border-radius:13px;border-bottom-left-radius:3px;width:fit-content;border:1px solid #E2E8F0}',
      '.dr-typing-dot{width:5px;height:5px;border-radius:50%;background:#94A3B8;animation:drDot 1.4s infinite both}',
      '.dr-typing-dot:nth-child(2){animation-delay:.2s}.dr-typing-dot:nth-child(3){animation-delay:.4s}',
      '@keyframes drDot{0%,80%,100%{opacity:.3;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}',
      '.dr-msg-fade{animation:drFadeIn .25s ease}',
      '@keyframes drFadeIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}',
      '.dr-quick-btns{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}',
      '.dr-quick-btn{padding:5px 12px;border:1.5px solid ' + c + ';border-radius:99px;font-size:.75rem;font-weight:600;color:' + c + ';background:#fff;cursor:pointer;transition:all .15s;white-space:nowrap}',
      '.dr-quick-btn:hover{background:' + c + ';color:#fff}',
      '#dr-footer{padding:10px 12px;border-top:1px solid #E2E8F0;display:flex;gap:8px;flex-shrink:0;background:#fff}',
      '#dr-input{flex:1;padding:8px 12px;border:1.5px solid #E2E8F0;border-radius:99px;font-size:.8125rem;outline:none;color:#1E293B;transition:border-color .15s;background:#F8FAFC}',
      '#dr-input:focus{border-color:' + c + ';background:#fff}',
      '#dr-input::placeholder{color:#94A3B8}',
      '#dr-send{width:36px;height:36px;border-radius:50%;background:' + c + ';border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform .15s,box-shadow .15s}',
      '#dr-send:hover{transform:scale(1.05);box-shadow:0 2px 10px rgba(99,102,241,.35)}',
      '#dr-send svg{width:15px;height:15px;fill:none;stroke:#fff;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}',
      '#dr-powered{text-align:center;padding:5px 0 8px;font-size:.5625rem;color:#CBD5E1}',
      '#dr-powered a{color:#94A3B8;text-decoration:none}',
      '#dr-powered a:hover{color:' + c + '}',
      '@media(max-width:400px){#dr-panel{width:calc(100vw - 16px);bottom:80px;right:8px;left:8px}}',
    ].join('\n');
    d.head.appendChild(s);
  }

  /* ── DOM Builder ────────────────────────────────────── */
  function buildWidget() {
    var wrap = d.createElement('div');
    wrap.id = 'dr-widget';
    wrap.innerHTML = [
      '<div id="dr-bubble" role="button" aria-label="Open chat" tabindex="0">',
        '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
        '<div id="dr-notif-dot"></div>',
      '</div>',
      '<div id="dr-panel" role="dialog" aria-label="Chat with us">',
        '<div id="dr-head">',
          '<div id="dr-head-av">🤖</div>',
          '<div>',
            '<div id="dr-head-name">Ava</div>',
            '<div id="dr-head-status"><span></span>Online — replies in seconds</div>',
          '</div>',
          '<button id="dr-head-close" aria-label="Close chat">✕</button>',
        '</div>',
        '<div id="dr-messages"></div>',
        '<div id="dr-footer">',
          '<input id="dr-input" type="text" placeholder="Type a message…" autocomplete="off">',
          '<button id="dr-send" aria-label="Send">',
            '<svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
          '</button>',
        '</div>',
        '<div id="dr-powered">Powered by <a href="https://digital-rise-os.vercel.app" target="_blank">Digital Rise AI</a></div>',
      '</div>',
    ].join('');
    d.body.appendChild(wrap);
  }

  /* ── Message Helpers ────────────────────────────────── */
  function msgEl(role, text, quickBtns) {
    var wrap = d.createElement('div');
    wrap.className = 'dr-msg dr-msg-' + (role === 'out' ? 'out' : 'in') + ' dr-msg-fade';
    var label = d.createElement('div');
    label.className = 'dr-msg-label';
    label.textContent = role === 'out' ? 'You' : STATE.agentName;
    var bub = d.createElement('div');
    bub.className = 'dr-bubble-msg';
    bub.textContent = text;
    wrap.appendChild(label);
    wrap.appendChild(bub);
    if (quickBtns && quickBtns.length) {
      var row = d.createElement('div');
      row.className = 'dr-quick-btns';
      quickBtns.forEach(function (btn) {
        var b = d.createElement('button');
        b.className = 'dr-quick-btn';
        b.textContent = btn.label;
        b.onclick = function () {
          row.remove();
          addUserMsg(btn.label);
          if (btn.action) btn.action();
          else handleUserMessage(btn.value || btn.label);
        };
        row.appendChild(b);
      });
      wrap.appendChild(row);
    }
    return wrap;
  }

  function addMsg(role, text, quickBtns) {
    var msgs = d.getElementById('dr-messages');
    if (!msgs) return;
    var empty = msgs.querySelector('.dr-empty');
    if (empty) empty.remove();
    msgs.appendChild(msgEl(role, text, quickBtns));
    msgs.scrollTop = msgs.scrollHeight;
    STATE.messages.push({ role: role, text: text, ts: new Date().toISOString() });
    STATE.msgCount++;
  }

  function addUserMsg(text) {
    var msgs = d.getElementById('dr-messages');
    if (!msgs) return;
    msgs.appendChild(msgEl('out', text));
    msgs.scrollTop = msgs.scrollHeight;
    STATE.messages.push({ role: 'out', text: text, ts: new Date().toISOString() });
    STATE.msgCount++;
  }

  function showTyping(cb, delay) {
    var msgs = d.getElementById('dr-messages');
    if (!msgs) return;
    var el = d.createElement('div');
    el.className = 'dr-msg dr-msg-in';
    el.id = 'dr-typing-ind';
    el.innerHTML = '<div class="dr-typing"><div class="dr-typing-dot"></div><div class="dr-typing-dot"></div><div class="dr-typing-dot"></div></div>';
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
    setTimeout(function () {
      var t = d.getElementById('dr-typing-ind');
      if (t) t.remove();
      if (cb) cb();
    }, delay || 1200);
  }

  function agentSay(text, quickBtns, delay) {
    showTyping(function () { addMsg('in', text, quickBtns); }, delay || 1000);
  }

  /* ── Greeting ───────────────────────────────────────── */
  function showGreeting() {
    var biz = STATE.biz;
    var greeting = (biz.greeting) ||
      "Hi there! 👋 I'm " + STATE.agentName + ", the virtual assistant for " + (biz.name || 'us') + ".\n\nHow can I help you today?";

    var quickBtns = (biz.services || []).slice(0, 4).map(function (s) {
      return { label: s, value: s };
    });
    if (!quickBtns.length) {
      quickBtns = [
        { label: 'Fees & Pricing', value: 'What are your fees?' },
        { label: 'Book a Visit', value: 'How do I book?' },
        { label: 'Availability', value: 'Do you have availability?' },
        { label: 'Contact Us', value: 'How do I contact you?' },
      ];
    }
    agentSay(greeting, quickBtns, 600);
  }

  /* ── Lead Capture Flow ──────────────────────────────── */
  function startLeadCapture() {
    if (STATE.leadCaptured || STATE.captureStep !== 'idle') return;
    STATE.captureStep = 'name';
    agentSay("Before I let you go — could I get your name so we can follow up properly? 😊", [], 1200);
  }

  function handleCapture(text) {
    switch (STATE.captureStep) {
      case 'name':
        STATE.lead.name = text;
        STATE.captureStep = 'phone';
        agentSay("Thanks " + text.split(' ')[0] + "! 😊 And the best phone number to reach you?", [], 800);
        return true;
      case 'phone':
        STATE.lead.phone = text;
        STATE.captureStep = 'email';
        agentSay("Got it! Last one — your email address?", [], 800);
        return true;
      case 'email':
        STATE.lead.email = text;
        STATE.captureStep = 'done';
        STATE.leadCaptured = true;
        Store.saveLead({
          name:         STATE.lead.name,
          phone:        STATE.lead.phone,
          email:        STATE.lead.email,
          enquiry_type: STATE.lastIntent || 'General Enquiry',
          messages:     STATE.messages,
          qual_answers: STATE.qualAnswers || {},
        }, function () {});
        agentSay(
          "Perfect — all saved! ✅\n\nSomeone from " + (STATE.biz.name || 'our team') + " will be in touch shortly.\n\nIs there anything else I can help you with?",
          [], 900
        );
        d.getElementById('dr-notif-dot').style.display = 'none';
        return true;
    }
    return false;
  }

  /* ── Qualification ──────────────────────────────────── */
  function maybeQualify() {
    var qs = STATE.qualQs;
    if (!qs || !qs.length) { startLeadCapture(); return; }
    if (STATE.qualStep >= qs.length) { startLeadCapture(); return; }
    var q = qs[STATE.qualStep];
    STATE.qualStep++;
    agentSay(q, [], 900);
  }

  /* ── Main message handler ───────────────────────────── */
  function handleUserMessage(text) {
    if (!text || !text.trim()) return;
    text = text.trim();

    /* Lead capture in progress */
    if (STATE.captureStep !== 'idle' && STATE.captureStep !== 'done') {
      if (handleCapture(text)) return;
    }

    /* Get AI engine response */
    var engineFn = AI[CFG.engine] || AI['rule-based'];
    var reply = engineFn(text, STATE.kb, STATE);

    /* Detect intent for lead tagging */
    if (/fee|cost|price|how much/i.test(text))   STATE.lastIntent = 'Pricing';
    else if (/tour|visit|book|appoint/i.test(text)) STATE.lastIntent = 'Booking';
    else if (/avail|space|spot/i.test(text))      STATE.lastIntent = 'Availability';
    else if (/subsid|fund/i.test(text))           STATE.lastIntent = 'Subsidy';
    else if (/callback|call me|phone/i.test(text))STATE.lastIntent = 'Callback';
    else if (!STATE.lastIntent)                   STATE.lastIntent = 'General Enquiry';

    agentSay(reply, [], 900 + Math.random() * 300);

    /* Trigger qualification after 3 messages from visitor */
    var outCount = STATE.messages.filter(function (m) { return m.role === 'out'; }).length + 1;
    if (outCount >= 3 && !STATE.leadCaptured && STATE.captureStep === 'idle') {
      setTimeout(maybeQualify, 2400);
    }
  }

  /* ── Open / Close ───────────────────────────────────── */
  function openWidget() {
    STATE.open = true;
    d.getElementById('dr-panel').classList.add('dr-open');
    d.getElementById('dr-notif-dot').style.display = 'none';
    d.getElementById('dr-input').focus();
    if (STATE.msgCount === 0) showGreeting();
  }

  function closeWidget() {
    STATE.open = false;
    d.getElementById('dr-panel').classList.remove('dr-open');
    /* Save conversation on close */
    if (STATE.messages.length > 1) Store.saveConversation(STATE.messages);
  }

  /* ── Config loader ──────────────────────────────────── */
  function applyConfig(cfg) {
    STATE.biz        = cfg || {};
    STATE.agentName  = (cfg && cfg.agentName)  || 'Ava';
    STATE.kb         = (cfg && cfg.kb)         || {};
    STATE.qualQs     = (cfg && cfg.qualQs)     || [];
    STATE.qualAnswers= {};

    var nameEl = d.getElementById('dr-head-name');
    var avEl   = d.getElementById('dr-head-av');
    if (nameEl) nameEl.textContent = STATE.agentName + ' — ' + (STATE.biz.name || '');
    if (avEl && STATE.biz.emoji) avEl.textContent = STATE.biz.emoji;
  }

  function loadConfig() {
    /* 1. Use inline config if provided via data-config */
    if (CFG.inline) { applyConfig(CFG.inline); return; }

    /* 2. Try to fetch from API */
    fetch(CFG.apiUrl + '/config/' + CFG.bizSlug)
      .then(function (r) { return r.json(); })
      .then(function (data) { applyConfig(data); })
      .catch(function () {
        /* 3. Fallback demo config */
        applyConfig({
          name:      'Demo Business',
          agentName: 'Ava',
          emoji:     '🤖',
          greeting:  "Hi there! 👋 I'm Ava. How can I help you today?",
          services:  ['Learn More', 'Get a Quote', 'Book a Visit', 'Contact Us'],
          kb:        {},
          qualQs:    ['What brings you here today?', 'What is the best way to reach you?'],
        });
      });
  }

  /* ── Event listeners ────────────────────────────────── */
  function bindEvents() {
    var bubble = d.getElementById('dr-bubble');
    var close  = d.getElementById('dr-head-close');
    var input  = d.getElementById('dr-input');
    var send   = d.getElementById('dr-send');

    bubble.addEventListener('click', function () { STATE.open ? closeWidget() : openWidget(); });
    bubble.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); STATE.open ? closeWidget() : openWidget(); } });
    close.addEventListener('click', closeWidget);

    function sendMsg() {
      var val = input.value.trim();
      if (!val) return;
      input.value = '';
      addUserMsg(val);
      handleUserMessage(val);
    }

    send.addEventListener('click', sendMsg);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') sendMsg(); });

    /* Close on outside click */
    d.addEventListener('click', function (e) {
      if (STATE.open && !d.getElementById('dr-widget').contains(e.target)) closeWidget();
    });
  }

  /* ── Init ───────────────────────────────────────────── */
  function init() {
    if (d.getElementById('dr-widget')) return; /* Already loaded */
    injectCSS();
    buildWidget();
    bindEvents();
    loadConfig();

    /* Pulse bubble after 3 seconds to attract attention */
    setTimeout(function () {
      var dot = d.getElementById('dr-notif-dot');
      if (dot && !STATE.open) dot.style.display = 'block';
    }, 3000);
  }

  /* Run when DOM is ready */
  if (d.readyState === 'loading') {
    d.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ── Public API ─────────────────────────────────────── */
  w.DigitalRiseWidget = {
    open:   openWidget,
    close:  closeWidget,
    config: applyConfig,
    state:  STATE,
  };

})(window, document);
