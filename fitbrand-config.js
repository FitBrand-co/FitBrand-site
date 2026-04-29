/*
  FitBrand backend config.
  Supabase project URL is already filled from your project ref:
  xlwctuqnsiycqametagq

  Add your public Supabase anon key and deploy URL when you are ready.
  Never put Stripe secret keys or Supabase service role keys in this frontend file.
*/
window.FITBRAND_CONFIG = {
  backendEnabled: true,
  supabaseUrl: "https://xlwctuqnsiycqametagq.supabase.co",
  supabaseAnonKey: "PASTE_SUPABASE_ANON_KEY_HERE",
  functionsBaseUrl: "",

  // Use your real Stripe Price IDs here after creating products/prices in Stripe.
  // Example format: price_123...
  stripePrices: {
    aesthetic: "PASTE_STRIPE_PRICE_ID_AESTHETIC",
    shred: "PASTE_STRIPE_PRICE_ID_SHRED",
    strength: "PASTE_STRIPE_PRICE_ID_STRENGTH",
    bundle: "PASTE_STRIPE_PRICE_ID_BUNDLE",
    mealplan: "PASTE_STRIPE_PRICE_ID_MEALPLAN",
    shaker: "PASTE_STRIPE_PRICE_ID_SHAKER",
    belt: "PASTE_STRIPE_PRICE_ID_BELT",
    straps: "PASTE_STRIPE_PRICE_ID_STRAPS"
  }
};
