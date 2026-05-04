import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRODUCT_PRICE_ENV = {
  aesthetic: 'STRIPE_PRICE_AESTHETIC_MONTHLY',
  shred: 'STRIPE_PRICE_SHRED_MONTHLY',
  strength: 'STRIPE_PRICE_STRENGTH_MONTHLY',
  bundle: 'STRIPE_PRICE_BUNDLE_MONTHLY',
  mealplan: 'STRIPE_PRICE_MEALPLAN_MONTHLY',
  shaker: 'STRIPE_PRICE_SHAKER',
  belt: 'STRIPE_PRICE_BELT',
  straps: 'STRIPE_PRICE_STRAPS'
};

const SUBSCRIPTION_ITEMS = new Set(['aesthetic','shred','strength','bundle','mealplan']);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items = [], email, successUrl, cancelUrl } = req.body || {};
    const cleanItems = Array.isArray(items) ? [...new Set(items.filter(Boolean))] : [];
    if (!cleanItems.length) return res.status(400).json({ error: 'No items provided.' });
    if (!email) return res.status(400).json({ error: 'Email is required.' });

    const hasSubscription = cleanItems.some(slug => SUBSCRIPTION_ITEMS.has(slug));
    const hasPhysical = cleanItems.some(slug => !SUBSCRIPTION_ITEMS.has(slug));

    if (hasSubscription && hasPhysical) {
      return res.status(400).json({
        error: 'Subscriptions and physical products must be checked out separately. Please remove physical products or subscription products from the cart.'
      });
    }

    const line_items = cleanItems.map((slug) => {
      const envName = PRODUCT_PRICE_ENV[slug];
      const price = envName ? process.env[envName] : null;
      if (!price) throw new Error(`Missing Stripe price ID for ${slug}. Expected env var ${envName}.`);
      return { price, quantity: 1 };
    });

    const mode = hasSubscription ? 'subscription' : 'payment';

    const session = await stripe.checkout.sessions.create({
      mode,
      customer_email: email,
      line_items,
      success_url: successUrl || `${process.env.SITE_URL || 'https://fitbrand.fit'}/confirmation.html?stripe=success`,
      cancel_url: cancelUrl || `${process.env.SITE_URL || 'https://fitbrand.fit'}/checkout.html`,
      metadata: {
        fitbrand_items: cleanItems.join(','),
        email,
        fitbrand_checkout_type: mode
      },
      subscription_data: hasSubscription ? {
        metadata: {
          fitbrand_items: cleanItems.join(','),
          email
        }
      } : undefined
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Could not create checkout session.' });
  }
}
/* FITBRAND_VERSION_MARKER:v26-force-github-update-2026-05-04 */
