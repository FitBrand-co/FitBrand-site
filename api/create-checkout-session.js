import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const FITBRAND_SUBSCRIPTION_PRODUCTS = new Set(['aesthetic','shred','strength','bundle','mealplan']);

const PRODUCT_PRICE_ENV = {
  aesthetic: 'STRIPE_PRICE_AESTHETIC',
  shred: 'STRIPE_PRICE_SHRED',
  strength: 'STRIPE_PRICE_STRENGTH',
  bundle: 'STRIPE_PRICE_BUNDLE',
  mealplan: 'STRIPE_PRICE_MEALPLAN',
  shaker: 'STRIPE_PRICE_SHAKER',
  belt: 'STRIPE_PRICE_BELT',
  straps: 'STRIPE_PRICE_STRAPS'
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items = [], email, successUrl, cancelUrl } = req.body || {};
    const cleanItems = Array.isArray(items) ? items.filter(Boolean) : [];
    if (!cleanItems.length) return res.status(400).json({ error: 'No items provided.' });
    if (!email) return res.status(400).json({ error: 'Email is required.' });

    const line_items = cleanItems.map((slug) => {
      const envName = PRODUCT_PRICE_ENV[slug];
      const price = envName ? process.env[envName] : null;
      if (!price) throw new Error(`Missing Stripe price ID for ${slug}`);
      return { price, quantity: 1 };
    });

    const hasSubscriptionItem = cleanItems.some((slug) => FITBRAND_SUBSCRIPTION_PRODUCTS.has(slug));

    const session = await stripe.checkout.sessions.create({
      mode: hasSubscriptionItem ? 'subscription' : 'payment',
      customer_email: email,
      line_items,
      success_url: successUrl || `${process.env.SITE_URL}/confirmation.html?stripe=success`,
      cancel_url: cancelUrl || `${process.env.SITE_URL}/checkout.html`,
      metadata: {
        fitbrand_items: cleanItems.join(','),
        email
      }
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Could not create checkout session.' });
  }
}
