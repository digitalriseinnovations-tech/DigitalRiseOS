/**
 * Digital Rise — Widget Config API Route
 * Vercel Serverless Function: /api/config/[slug]
 * Returns business config + KB for a given business slug
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { slug } = req.query;
  if (!slug) return res.status(400).json({ error: 'slug is required' });

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      /* Fetch business */
      const bizRes = await fetch(
        `${supabaseUrl}/rest/v1/businesses?slug=eq.${encodeURIComponent(slug)}&select=*`,
        { headers: { 'apikey': supabaseKey, 'Authorization': 'Bearer ' + supabaseKey } }
      );
      const bizData = await bizRes.json();
      const biz = bizData?.[0];

      if (biz) {
        /* Fetch KB */
        const kbRes = await fetch(
          `${supabaseUrl}/rest/v1/knowledge_base?business_id=eq.${biz.id}&active=eq.true&select=*`,
          { headers: { 'apikey': supabaseKey, 'Authorization': 'Bearer ' + supabaseKey } }
        );
        const kbRows = await kbRes.json();

        /* Fetch AI Employee config */
        const empRes = await fetch(
          `${supabaseUrl}/rest/v1/ai_employees?business_id=eq.${biz.id}&type=eq.website-enquiry&is_active=eq.true&select=*&limit=1`,
          { headers: { 'apikey': supabaseKey, 'Authorization': 'Bearer ' + supabaseKey } }
        );
        const empData = await empRes.json();
        const emp = empData?.[0] || {};

        /* Fetch qualification questions */
        const qualRes = await fetch(
          `${supabaseUrl}/rest/v1/qualification_templates?business_id=eq.${biz.id}&active=eq.true&select=*&order=sort_order.asc`,
          { headers: { 'apikey': supabaseKey, 'Authorization': 'Bearer ' + supabaseKey } }
        );
        const qualRows = await qualRes.json();

        /* Build KB map: { category: { answer, keywords } } */
        const kb = {};
        (kbRows || []).forEach(row => {
          kb[row.category + (row.topic ? '_' + row.topic : '')] = {
            answer:   row.answer,
            keywords: row.keywords || [],
          };
        });

        return res.status(200).json({
          name:      biz.name,
          slug:      biz.slug,
          industry:  biz.industry,
          color:     biz.color     || '#6366F1',
          agentName: emp.name      || 'Ava',
          greeting:  emp.greeting  || null,
          emoji:     '🤖',
          services:  biz.metadata?.services || [],
          qualQs:    (qualRows || []).map(q => q.question),
          kb,
        });
      }
    } catch (err) {
      console.error('[config] Supabase error:', err);
    }
  }

  /* ── Demo fallback config ─────────────────────────── */
  return res.status(200).json(demoConfig(slug));
}

function demoConfig(slug) {
  const configs = {
    'sunshine-nursery': {
      name: 'Sunshine Nursery', agentName: 'Ava', color: '#7C3AED', emoji: '🌞',
      greeting: "Hi there! 👋 I'm Ava from Sunshine Nursery. Are you looking for childcare? I can help with availability, fees, or booking a tour!",
      services: ['Check Availability', 'Get Fees', 'Book a Tour', 'Join Waitlist'],
      qualQs: ["How old is your child?", "What start date are you looking at?", "Are you looking for full-time or part-time care?"],
      kb: {
        hours:   { answer: "We're open Monday to Friday, 7:30 AM to 6:00 PM.",   keywords: ['hours','open','close','time','when'] },
        fees:    { answer: "Our fees start from $65/day for toddlers. We accept CWELCC subsidies which can significantly reduce your cost!", keywords: ['fee','cost','price','how much','pricing','subsidy'] },
        avail:   { answer: "We currently have limited spots available. I'd recommend booking a tour soon to secure a space!",          keywords: ['available','availability','space','spot','opening'] },
        tour:    { answer: "We'd love to show you our nursery! Tours are free and take about 30 minutes. When would work for you?",   keywords: ['tour','visit','look around','come in','show'] },
        waitlist:{ answer: "Our waitlist is free to join with no deposit. We'll contact you as soon as a spot becomes available!",     keywords: ['waitlist','wait list','waiting'] },
      },
    },
    'smile-dental-studio': {
      name: 'Smile Dental Studio', agentName: 'Lily', color: '#0891B2', emoji: '🦷',
      greeting: "Hi! I'm Lily from Smile Dental Studio. Looking to book an appointment or have questions about our services?",
      services: ['Book Appointment', 'Our Services', 'Emergency Dental', 'Get a Quote'],
      qualQs: ["Is this for a new or existing patient?", "What treatment are you interested in?"],
      kb: {
        hours:    { answer: "We're open Mon–Fri 8 AM–6 PM, and Saturday 9 AM–3 PM.",                            keywords: ['hours','open','when'] },
        booking:  { answer: "I can help you book! We have appointments available this week. What works for you?", keywords: ['book','appoint','reserv','schedule'] },
        emergency:{ answer: "For dental emergencies, call us at +1 416-555-0202. We always try to see emergency patients the same day!", keywords: ['emergency','urgent','pain','broken','cracked'] },
        services: { answer: "We offer general dentistry, whitening, veneers, implants, Invisalign, and more! What are you interested in?", keywords: ['service','offer','treatment','what do you'] },
      },
    },
    'demo': {
      name: 'Demo Business', agentName: 'Ava', color: '#6366F1', emoji: '🤖',
      greeting: "Hi there! 👋 I'm Ava. This is a demo of the Digital Rise AI chat widget. Try asking me anything!",
      services: ['Learn More', 'Get a Quote', 'Book a Visit', 'Contact Us'],
      qualQs: ["What brings you here today?", "What's the best way to reach you?"],
      kb: {},
    },
  };
  return configs[slug] || configs['demo'];
}
