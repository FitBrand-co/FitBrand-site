import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
const ADMIN_PASSWORD = process.env.ADMIN_DASHBOARD_PASSWORD;

function setSecurityHeaders(res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('X-Content-Type-Options', 'nosniff');
}

function normaliseLead(row = {}) {
  return {
    id: row.id,
    email: row.email || '',
    name: row.name || row.full_name || '',
    product: row.product || row.product_interest || 'Not selected',
    goal: row.goal || '',
    price_intent: row.price_intent || row.monthly_price_interest || '',
    start_timing: row.start_timing || row.start_timeline || '',
    note: row.note || row.notes || '',
    source: row.source || 'website',
    created_at: row.created_at || null
  };
}

function countBy(rows, key) {
  return rows.reduce((acc, item) => {
    const value = (item[key] || 'Not answered').toString().trim() || 'Not answered';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

export default async function handler(req, res) {
  setSecurityHeaders(res);

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET, OPTIONS');
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({
      error: 'Supabase server environment variables are missing.',
      missing: {
        SUPABASE_URL: !SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: !SUPABASE_SERVICE_ROLE_KEY
      }
    });
  }

  if (!ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'ADMIN_DASHBOARD_PASSWORD is missing in Vercel Environment Variables.' });
  }

  const providedPassword = req.headers['x-fitbrand-admin-password'];
  if (!providedPassword || providedPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Wrong admin password.' });
  }

  try {
    const limitRaw = Number.parseInt(req.query.limit || '500', 10);
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 1000) : 500;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data, error, count } = await supabase
      .from('early_access_leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    const leads = (data || []).map(normaliseLead);
    return res.status(200).json({
      ok: true,
      total: count ?? leads.length,
      returned: leads.length,
      generated_at: new Date().toISOString(),
      stats: {
        by_product: countBy(leads, 'product'),
        by_price_intent: countBy(leads, 'price_intent'),
        by_start_timing: countBy(leads, 'start_timing')
      },
      leads
    });
  } catch (error) {
    console.error('FitBrand admin leads error:', error);
    return res.status(500).json({ error: error.message || 'Could not load early access leads.' });
  }
}
