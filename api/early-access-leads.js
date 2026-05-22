// FitBrand v35 - Early access lead capture API for Vercel
import { createClient } from '@supabase/supabase-js';

function clean(value, max = 500) {
  return String(value || '').trim().slice(0, max);
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim().toLowerCase());
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(500).json({ ok: false, error: 'Server is missing Supabase environment variables' });

  const body = req.body || {};
  const email = clean(body.email, 160).toLowerCase();
  if (!validEmail(email)) return res.status(400).json({ ok: false, error: 'Please add a valid email' });

  const lead = {
    email,
    full_name: clean(body.full_name || body.name, 120),
    product_interest: clean(body.product_interest || body.product || 'FitBrand Early Access', 160),
    goal: clean(body.goal || 'General fitness', 200),
    monthly_price_interest: clean(body.monthly_price_interest || body.price_interest || 'Maybe', 120),
    start_timeline: clean(body.start_timeline || 'Interested now', 120),
    notes: clean(body.notes || 'TikTok mobile signup', 700),
    source_page: clean(body.source_page || 'early-access-v35', 200)
  };

  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { data: existing, error: lookupError } = await supabase
      .from('early_access_leads')
      .select('id,email')
      .eq('email', email)
      .limit(1);
    if (lookupError) throw lookupError;

    if (existing && existing.length) {
      const { error } = await supabase
        .from('early_access_leads')
        .update({
          product_interest: lead.product_interest,
          goal: lead.goal,
          monthly_price_interest: lead.monthly_price_interest,
          start_timeline: lead.start_timeline,
          notes: lead.notes,
          source_page: lead.source_page
        })
        .eq('email', email);
      if (error) throw error;
      return res.status(200).json({ ok: true, updated: true });
    }

    const { error } = await supabase.from('early_access_leads').insert(lead);
    if (error) throw error;
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('early-access-leads error:', err);
    return res.status(500).json({ ok: false, error: err.message || 'Could not save signup' });
  }
}
