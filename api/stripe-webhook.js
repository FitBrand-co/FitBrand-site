import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function buffer(readable) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readable.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    readable.on('end', () => resolve(Buffer.concat(chunks)));
    readable.on('error', reject);
  });
}

function productName(slug) {
  const names = {
    aesthetic:'Aesthetic Program',
    shred:'Shred Program',
    strength:'Strength Program',
    bundle:'Complete Bundle + Meal Plan AI',
    mealplan:'Meal Plan Guide AI',
    shaker:'Premium Shaker Bottle',
    belt:'Lifting Belt',
    straps:'Lifting Straps'
  };
  return names[slug] || slug;
}

async function findOrCreateUser(email) {
  const { data: list } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const existing = list?.users?.find(u => String(u.email).toLowerCase() === String(email).toLowerCase());
  if (existing) return existing;

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true
  });
  if (error) throw error;
  return data.user;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  let event;
  try {
    const rawBody = await buffer(req);
    const signature = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      if (session.payment_status !== 'paid') return res.status(200).json({ received: true });

      const email = session.customer_details?.email || session.customer_email || session.metadata?.email;
      if (!email) throw new Error('No customer email on Stripe session.');

      const user = await findOrCreateUser(email);
      const items = String(session.metadata?.fitbrand_items || '').split(',').map(x => x.trim()).filter(Boolean);

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .upsert({
          user_id: user.id,
          email,
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent,
          status: 'paid',
          total_amount: session.amount_total,
          currency: session.currency || 'eur'
        }, { onConflict: 'stripe_session_id' })
        .select()
        .single();

      if (orderError) throw orderError;

      for (const slug of items) {
        await supabase.from('order_items').insert({
          order_id: order.id,
          product_slug: slug,
          product_name: productName(slug),
          quantity: 1,
          unit_amount: null,
          currency: session.currency || 'eur'
        });

        await supabase.from('user_access').upsert({
          user_id: user.id,
          email,
          product_slug: slug,
          product_name: productName(slug),
          active: true,
          stripe_session_id: session.id
        }, { onConflict: 'user_id,product_slug' });

        if (slug === 'bundle') {
          for (const bundled of ['aesthetic','shred','strength','mealplan']) {
            await supabase.from('user_access').upsert({
              user_id: user.id,
              email,
              product_slug: bundled,
              product_name: productName(bundled),
              active: true,
              stripe_session_id: session.id
            }, { onConflict: 'user_id,product_slug' });
          }
        }
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Webhook handling failed.' });
  }
}
