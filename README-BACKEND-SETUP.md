# FitBrand Backend Setup: Supabase + Stripe

Your Supabase project ref: `xlwctuqnsiycqametagq`  
Your Supabase project URL: `https://xlwctuqnsiycqametagq.supabase.co`

## What is already prepared

This site now includes:

- Supabase-ready login bridge in `supabase-integration.js`
- Project URL prefilled in `fitbrand-config.js`
- Stripe Checkout API: `api/create-checkout-session.js`
- Stripe webhook API: `api/stripe-webhook.js`
- Database schema: `supabase/schema.sql`
- Environment template: `.env.example`
- Cloud-ready My Orders and My Products rendering

The site still loads as a normal frontend demo if keys are missing.

## Step 1 — Supabase

1. Open Supabase.
2. Go to your project: `xlwctuqnsiycqametagq`.
3. Open SQL Editor.
4. Run everything inside `supabase/schema.sql`.
5. Go to Project Settings → API.
6. Copy:
   - Project URL
   - anon public key
   - service role key

The Project URL is already in the files. You still need to paste the anon key in `fitbrand-config.js`.

## Step 2 — Stripe

1. Create products in Stripe:
   - Aesthetic Program
   - Shred Program
   - Strength Program
   - Complete Bundle + Meal Plan AI
   - Meal Plan Guide AI
   - Premium Shaker Bottle
   - Lifting Belt
   - Lifting Straps
2. Copy each Stripe Price ID.
3. Add them to:
   - `.env` / Vercel environment variables
   - optionally `fitbrand-config.js` for frontend reference

## Step 3 — Deploy on Vercel

1. Upload this folder to GitHub.
2. Import the repo into Vercel.
3. Add all variables from `.env.example` in Vercel → Settings → Environment Variables.
4. Deploy.

## Step 4 — Stripe webhook

In Stripe Developers → Webhooks, add endpoint:

`https://your-domain.com/api/stripe-webhook`

Listen for:

- `checkout.session.completed`

Copy the webhook signing secret into:

`STRIPE_WEBHOOK_SECRET`

## Step 5 — Test

1. Use Stripe test mode.
2. Buy a digital product.
3. Check Supabase tables:
   - `orders`
   - `order_items`
   - `user_access`
4. Log in with the same email on another device.
5. Visit:
   - `orders.html`
   - `products-access.html`

You should see the order/access from Supabase.
