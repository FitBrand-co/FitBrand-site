FITBRAND GO-LIVE CHECKLIST

This ZIP is customer-ready as a static frontend, but real payments/accounts require real services.

Before taking real customers:
1. Open stripe-config.js and replace every #replace-with-stripe... value with your real Stripe Payment Links.
2. In Stripe, set each success URL to your domain + /confirmation.html?product=PRODUCT_KEY.
   Example: https://yourdomain.com/confirmation.html?product=aesthetic
3. Test every product checkout with Stripe test mode first.
4. Add your real support email in the footer if support@fitbrand.co is not active.
5. Confirm your refund, privacy, shipping and terms are correct for your business.
6. For a real login system across devices, connect a backend database/auth service later. This version saves login/access on the customer's browser using localStorage/sessionStorage.

What is included in this version:
- Stable profile icon, sign in/up popup and remember-login checkbox.
- Profile page with saved customer details.
- My products/access page and my orders page.
- Checkout email requirement before payment.
- Cart drawer and discount code FIT10.
- Bundle access includes Aesthetic, Shred, Strength and Meal Plan AI.
- Meal Plan AI is step-by-step and can use saved profile details.
- Program generator is based on the program purchased and includes PDF/PNG export.
- Shaker has been removed from active catalog/access.
