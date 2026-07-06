/**
 * Digital Rise — Chat API Route
 * Vercel Serverless Function: /api/chat
 * Handles chat messages with modular AI engine support
 *
 * engine = 'rule-based' | 'claude' | 'openai' | 'other'
 */

/* ── Engine Registry ──────────────────────────────────── */
const engines = {
  'rule-based': ruleBasedEngine,
  'claude':     claudeEngine,
  'openai':     openaiEngine,
};

/* ── Handler ──────────────────────────────────────────── */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, bizSlug, engine = 'rule-based', kb = {}, history = [] } = req.body || {};

  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  try {
    const engineFn = engines[engine] || engines['rule-based'];
    const reply = await engineFn({ message, bizSlug, kb, history });

    return res.status(200).json({
      reply,
      engine,
      ts: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[chat] engine error:', err);
    return res.status(200).json({
      reply: "I'm having a moment — let me get a team member to help you. Could you share your contact details?",
      engine: 'fallback',
      ts: new Date().toISOString(),
    });
  }
}

/* ── Rule-Based Engine ────────────────────────────────── */
function ruleBasedEngine({ message, kb }) {
  const m = message.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|howdy)\b/i.test(m)) {
    return "Hi there! 👋 How can I help you today?";
  }
  // Thanks
  if (/thank|thanks|great|perfect|awesome|brilliant/i.test(m)) {
    return "You're very welcome! Is there anything else I can help you with? 😊";
  }

  // KB keyword matching
  if (kb && typeof kb === 'object') {
    for (const [, entry] of Object.entries(kb)) {
      if (!entry?.keywords?.length) continue;
      const matched = entry.keywords.some(kw => m.includes(kw.toLowerCase()));
      if (matched) return entry.answer;
    }
  }

  // Intent patterns
  if (/fee|cost|price|how much|pricing/.test(m))          return "I'd be happy to share our pricing — could you tell me a bit more about what you're looking for?";
  if (/avail|space|spot|opening/.test(m))                  return "Let me check availability for you. What timeframe are you looking at?";
  if (/tour|visit|come in|show/.test(m))                   return "We'd love to show you around! When would work best for you?";
  if (/hour|open|close|when are you/.test(m))              return "We're open Monday to Friday. What time works for you?";
  if (/book|appoint|reserv|schedul/.test(m))               return "I can help you book an appointment. What service are you interested in?";
  if (/waitlist|wait list/.test(m))                        return "Yes, you can join our waitlist! It's free and no deposit is needed. Shall I add your details?";
  if (/subsid|fund|government|program/.test(m))            return "Great question about funding! I'll make sure the right person contacts you with the latest details.";
  if (/contact|speak|call|phone|email/.test(m))            return "Of course! I can take your details and have someone call you back. What's the best number to reach you?";
  if (/cancel|refund|complaint|issue|problem/.test(m))     return "I'm sorry to hear that! Let me make sure the right person gets in touch. Can I get your name and contact details?";
  if (/service|offer|what do you|what can/.test(m))        return "We offer a range of services tailored to your needs. What specifically are you interested in?";

  // Default fallback
  return "That's a great question! I want to give you the right answer — could you share a little more detail about what you're looking for? 😊";
}

/* ── Claude Engine (stub — wire API key to activate) ──── */
async function claudeEngine({ message, kb, history }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return ruleBasedEngine({ message, kb, history });
  }

  const systemPrompt = buildSystemPrompt(kb);
  const messages = [
    ...history.slice(-10).map(m => ({ role: m.role === 'out' ? 'user' : 'assistant', content: m.text })),
    { role: 'user', content: message },
  ];

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: systemPrompt,
      messages,
    }),
  });

  const data = await response.json();
  return data?.content?.[0]?.text || ruleBasedEngine({ message, kb });
}

/* ── OpenAI Engine (stub — wire API key to activate) ───── */
async function openaiEngine({ message, kb, history }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return ruleBasedEngine({ message, kb, history });
  }

  const systemPrompt = buildSystemPrompt(kb);
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-10).map(m => ({ role: m.role === 'out' ? 'user' : 'assistant', content: m.text })),
    { role: 'user', content: message },
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 300,
      messages,
    }),
  });

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || ruleBasedEngine({ message, kb });
}

/* ── Helper: build system prompt from KB ─────────────── */
function buildSystemPrompt(kb) {
  let kbText = '';
  if (kb && typeof kb === 'object') {
    kbText = Object.entries(kb)
      .map(([k, v]) => `[${k}] ${v?.answer || ''}`)
      .join('\n');
  }
  return [
    'You are a helpful, warm virtual assistant for a business.',
    'Keep responses under 3 sentences. Be friendly and conversational.',
    'Always try to capture the visitor\'s name and phone number.',
    kbText ? '\nKnowledge Base:\n' + kbText : '',
  ].join('\n').trim();
}
