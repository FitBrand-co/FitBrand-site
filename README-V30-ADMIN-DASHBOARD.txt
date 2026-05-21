FitBrand v30 admin dashboard

New files:
- admin-leads.html
- api/admin-leads.js

How to use:
1. Upload the v30 changed files to GitHub.
2. In Vercel, add this Environment Variable:
   ADMIN_DASHBOARD_PASSWORD = choose-a-strong-password
3. Make sure these existing Vercel variables are still set:
   SUPABASE_URL
   SUPABASE_SERVICE_ROLE_KEY
4. Redeploy the site in Vercel.
5. Open:
   https://fitbrand.fit/admin-leads.html
6. Enter the admin password.

The dashboard shows:
- total early access signups
- product interest counts
- monthly price answer counts
- start timing counts
- full lead table
- CSV export

Keep admin-leads.html and the password private.
