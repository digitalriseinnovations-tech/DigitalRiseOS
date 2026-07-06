/**
 * Digital Rise — Conversation Save API Route
 * Vercel Serverless Function: /api/conversation
 * Stores full conversation transcript
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { biz_slug, install_key, messages, source_url } = req.body || {};
  if (!biz_slug || !messages?.length) {
    return res.status(400).json({ error: 'biz_slug and messages are required' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const bizRes = await fetch(
        `${supabaseUrl}/rest/v1/businesses?slug=eq.${encodeURIComponent(biz_slug)}&select=id`,
        { headers: { 'apikey': supabaseKey, 'Authorization': 'Bearer ' + supabaseKey } }
      );
      const bizData = await bizRes.json();
      const businessId = bizData?.[0]?.id;

      if (businessId) {
        const leadCaptured = messages.some(m => m.role === 'out' && /@|^\+?[\d\s\-]{7,}/.test(m.text));
        await fetch(`${supabaseUrl}/rest/v1/conversations`, {
          method: 'POST',
          headers: {
            'apikey':        supabaseKey,
            'Authorization': 'Bearer ' + supabaseKey,
            'Content-Type':  'application/json',
            'Prefer':        'return=minimal',
          },
          body: JSON.stringify({
            business_id:    businessId,
            channel:        'website',
            source_url:     source_url || null,
            messages:       messages,
            lead_captured:  leadCaptured,
            ended_at:       new Date().toISOString(),
          }),
        });
        return res.status(200).json({ ok: true, storage: 'supabase' });
      }
    } catch (err) {
      console.error('[conversation] Supabase error:', err);
    }
  }

  console.log('[conversation] saved (no DB):', biz_slug, messages.length, 'messages');
  return res.status(200).json({ ok: true, storage: 'log' });
}
