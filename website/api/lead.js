/**
 * Digital Rise — Lead Save API Route
 * Vercel Serverless Function: /api/lead
 * Saves captured leads to Supabase (or logs when not configured)
 */

export default async function handler(req, res) {
  /* CORS — widget embeds on third-party sites */
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    biz_slug, install_key, name, email, phone,
    enquiry_type, qual_answers, messages,
    source, source_url, channel, created_at,
  } = req.body || {};

  if (!biz_slug) {
    return res.status(400).json({ error: 'biz_slug is required' });
  }

  const lead = {
    biz_slug,
    install_key: install_key || null,
    name:         name         || null,
    email:        email        || null,
    phone:        phone        || null,
    enquiry_type: enquiry_type || 'General Enquiry',
    qual_answers: qual_answers || {},
    messages:     messages     || [],
    source:       source       || 'website-chat',
    source_url:   source_url   || null,
    channel:      channel      || 'website',
    created_at:   created_at   || new Date().toISOString(),
  };

  /* ── Supabase ─────────────────────────────────────── */
  const supabaseUrl  = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey  = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      /* Resolve business_id from slug */
      const bizRes = await fetch(`${supabaseUrl}/rest/v1/businesses?slug=eq.${encodeURIComponent(biz_slug)}&select=id`, {
        headers: {
          'apikey':        supabaseKey,
          'Authorization': 'Bearer ' + supabaseKey,
          'Content-Type':  'application/json',
        },
      });
      const bizData = await bizRes.json();
      const businessId = bizData?.[0]?.id;

      if (businessId) {
        const insertRes = await fetch(`${supabaseUrl}/rest/v1/leads`, {
          method: 'POST',
          headers: {
            'apikey':        supabaseKey,
            'Authorization': 'Bearer ' + supabaseKey,
            'Content-Type':  'application/json',
            'Prefer':        'return=minimal',
          },
          body: JSON.stringify({
            business_id:  businessId,
            name:         lead.name,
            email:        lead.email,
            phone:        lead.phone,
            enquiry_type: lead.enquiry_type,
            qual_answers: lead.qual_answers,
            source:       lead.source,
            channel:      lead.channel,
            status:       'New',
          }),
        });
        if (insertRes.status === 201) {
          return res.status(200).json({ ok: true, storage: 'supabase' });
        }
        console.error('[lead] insert failed:', insertRes.status, await insertRes.text());
      }
    } catch (err) {
      console.error('[lead] Supabase error:', err);
      /* Fall through to log-only */
    }
  }

  /* ── Fallback: log only ──────────────────────────── */
  console.log('[lead] captured (no DB):', JSON.stringify({ name: lead.name, phone: lead.phone, biz: biz_slug }));
  return res.status(200).json({ ok: true, storage: 'log', lead });
}
