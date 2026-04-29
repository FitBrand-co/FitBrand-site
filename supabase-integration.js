  /* FitBrand Supabase + Stripe bridge.
     This file is safe to load before keys are configured.
     It only activates real backend features when Supabase anon key is added. */
  (function(){
    'use strict';

    const cfg = window.FITBRAND_CONFIG || {};
    const PRODUCTS = {
      aesthetic:'Aesthetic Program',
      shred:'Shred Program',
      strength:'Strength Program',
      bundle:'Complete Bundle + Meal Plan AI',
      mealplan:'Meal Plan Guide AI',
      shaker:'Premium Shaker Bottle',
      belt:'Lifting Belt',
      straps:'Lifting Straps'
    };

    const $ = id => document.getElementById(id);
    const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
    const esc = s => String(s ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
    const isConfigured = () => Boolean(cfg.supabaseUrl && cfg.supabaseAnonKey && !String(cfg.supabaseAnonKey).includes('PASTE_'));

    let supabaseClient = null;
    let supabaseLoadPromise = null;

    function showSetupBanner(){
      if(isConfigured() || document.getElementById('fbBackendSetupBanner')) return;
      const banner = document.createElement('div');
      banner.id = 'fbBackendSetupBanner';
      banner.className = 'fb-backend-setup-banner';
      banner.innerHTML = '<strong>Backend ready:</strong> Add your Supabase anon key, Stripe keys and deploy the API functions to activate real login, orders and product access.';
      document.body.appendChild(banner);
      setTimeout(()=>banner.classList.add('show'), 200);
    }

    function showNotice(message){
      let n = document.getElementById('fbBackendNotice');
      if(!n){
        n = document.createElement('div');
        n.id = 'fbBackendNotice';
        n.className = 'fb-backend-notice';
        document.body.appendChild(n);
      }
      n.textContent = message;
      n.classList.add('show');
      setTimeout(()=>n.classList.remove('show'), 2800);
    }

    function loadSupabase(){
      if(!isConfigured()) return Promise.resolve(null);
      if(window.supabase && window.supabase.createClient){
        supabaseClient = supabaseClient || window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
        return Promise.resolve(supabaseClient);
      }
      if(supabaseLoadPromise) return supabaseLoadPromise;
      supabaseLoadPromise = new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.async = true;
        script.onload = () => {
          try {
            supabaseClient = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
            resolve(supabaseClient);
          } catch(e) {
            console.error('Supabase init failed', e);
            resolve(null);
          }
        };
        script.onerror = () => resolve(null);
        document.head.appendChild(script);
        setTimeout(()=>resolve(supabaseClient), 6000);
      });
      return supabaseLoadPromise;
    }

    async function getSession(){
      const sb = await loadSupabase();
      if(!sb) return null;
      const { data } = await sb.auth.getSession();
      return data && data.session ? data.session : null;
    }

    async function getUser(){
      const session = await getSession();
      return session ? session.user : null;
    }

    async function loginWithMagicLink(email){
      const sb = await loadSupabase();
      if(!sb) {
        showNotice('Supabase key missing. Local demo login is still available.');
        return false;
      }
      const redirectTo = location.origin + location.pathname.replace(/[^/]*$/, 'profile.html');
      const { error } = await sb.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo }
      });
      if(error){
        alert(error.message || 'Login failed.');
        return false;
      }
      showNotice('Check your email for the FitBrand login link.');
      return true;
    }

    async function logoutBackend(){
      const sb = await loadSupabase();
      if(sb) await sb.auth.signOut();
    }

    function patchLoginButtons(){
      document.addEventListener('click', async (e) => {
        const btn = e.target.closest('#profileLogin button, #profileLoginBtn, button[onclick*="loginFitBrandUser"]');
        if(!btn || !isConfigured()) return;
        const email = ($('loginProfileEmail')?.value || $('checkout-email')?.value || '').trim();
        if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
        e.preventDefault();
        e.stopPropagation();
        await loginWithMagicLink(email);
      }, true);

      const oldLogout = window.logoutFitBrandUser;
      window.logoutFitBrandUser = async function(){
        try { await logoutBackend(); } catch(e) {}
        if(typeof oldLogout === 'function') return oldLogout.apply(this, arguments);
      };
    }

    function productFromUrl(){
      const params = new URLSearchParams(location.search);
      return params.get('product') || params.get('purchased') || 'bundle';
    }

    function cartItems(){
      try {
        const cart = JSON.parse(localStorage.getItem('fitbrandCart') || '[]');
        if(Array.isArray(cart) && cart.length) return cart;
      } catch(e) {}
      return [productFromUrl()];
    }

    async function beginStripeCheckout(items, email){
      const url = (cfg.functionsBaseUrl || '') + '/api/create-checkout-session';
      const body = { items, email, successUrl: location.origin + '/confirmation.html?stripe=success', cancelUrl: location.href };
      const response = await fetch(url, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(body)
      });
      const data = await response.json().catch(()=>({}));
      if(!response.ok || !data.url){
        throw new Error(data.error || 'Checkout session could not be created.');
      }
      location.href = data.url;
    }

    function patchCheckout(){
      const pay = $('stripe-link');
      if(!pay) return;
      pay.addEventListener('click', async (e) => {
        if(!isConfigured()) return; // fallback demo checkout
        const email = ($('checkout-email')?.value || '').trim();
        const policy = $('accept-policies');
        if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || (policy && !policy.checked)){
          e.preventDefault();
          alert('Please enter your email and accept the policies first.');
          return;
        }
        e.preventDefault();
        pay.classList.add('btn-disabled');
        pay.textContent = 'Opening secure checkout...';
        try {
          await beginStripeCheckout(cartItems(), email);
        } catch(err) {
          console.error(err);
          alert(err.message || 'Could not start Stripe checkout.');
          pay.classList.remove('btn-disabled');
          pay.textContent = 'Continue to payment';
        }
      }, true);
    }

    async function renderOrders(){
      const list = $('ordersList');
      if(!list || !isConfigured()) return;
      const user = await getUser();
      if(!user) {
        list.innerHTML = '<p>No orders shown. Log in with Supabase to see cloud-saved orders.</p>';
        return;
      }
      const sb = await loadSupabase();
      const { data, error } = await sb
        .from('orders')
        .select('id, created_at, status, total_amount, currency, order_items(product_slug, product_name, quantity)')
        .eq('user_id', user.id)
        .order('created_at', { ascending:false });
      if(error){
        console.error(error);
        list.innerHTML = '<p>Could not load orders yet. Check Supabase RLS/schema setup.</p>';
        return;
      }
      if(!data || !data.length){
        list.innerHTML = '<p>No orders saved yet.</p>';
        return;
      }
      list.innerHTML = data.map(order => {
        const names = (order.order_items || []).map(i => `${i.product_name || PRODUCTS[i.product_slug] || i.product_slug}${i.quantity > 1 ? ' × ' + i.quantity : ''}`).join(', ');
        const total = order.total_amount ? `${(order.total_amount/100).toFixed(2)} ${(order.currency||'EUR').toUpperCase()}` : '';
        return `<article class="order-card order-card-clean"><div class="order-card-main"><strong>${esc(names || 'FitBrand order')}</strong><div class="order-card-meta"><span>${esc(new Date(order.created_at).toLocaleString())}</span><span>•</span><span>${esc(order.status || 'paid')}</span>${total ? `<span>•</span><span>${esc(total)}</span>` : ''}</div></div><div class="order-status-pill">Cloud</div></article>`;
      }).join('');
    }

    async function renderAccess(){
      const grid = $('accessGrid');
      if(!grid || !isConfigured()) return;
      const user = await getUser();
      if(!user) {
        grid.innerHTML = '<p>Log in to see product access saved in Supabase.</p>';
        return;
      }
      const sb = await loadSupabase();
      const { data, error } = await sb
        .from('user_access')
        .select('product_slug, product_name, active, created_at')
        .eq('user_id', user.id)
        .eq('active', true)
        .order('created_at', { ascending:false });
      if(error){
        console.error(error);
        grid.innerHTML = '<p>Could not load product access yet. Check Supabase RLS/schema setup.</p>';
        return;
      }
      const owned = new Set((data || []).map(x => x.product_slug));
      const slugs = ['aesthetic','shred','strength','bundle','mealplan','shaker','belt','straps'];
      grid.innerHTML = slugs.map(slug => {
        const has = owned.has(slug);
        return `<article class="access-card ${has ? 'owned' : ''}"><div><span>${has ? 'Unlocked' : 'Locked'}</span><h3>${esc(PRODUCTS[slug] || slug)}</h3><p>${has ? 'Saved in your FitBrand cloud account.' : 'Buy to unlock this product.'}</p></div><a class="${has ? 'btn-dark' : 'btn-outline'}" href="${has ? (slug === 'mealplan' ? 'recommended.html#meal-plan-ai' : slug === 'shaker' ? 'product-shaker.html' : slug === 'belt' ? 'product-belt.html' : slug === 'straps' ? 'product-straps.html' : 'index.html?purchased=' + slug) : 'checkout.html?product=' + slug}">${has ? 'Open' : 'Buy access'}</a></article>`;
      }).join('');
    }

    function addCookieBanner(){
      if(localStorage.getItem('fitbrandCookieOk') === 'yes' || document.getElementById('fbCookieBanner')) return;
      const banner = document.createElement('div');
      banner.id = 'fbCookieBanner';
      banner.className = 'fb-cookie-banner';
      banner.innerHTML = '<p>FitBrand uses necessary browser storage for cart, login and product access. Analytics/marketing cookies should only be added after consent.</p><button type="button">Accept</button>';
      document.body.appendChild(banner);
      banner.querySelector('button').addEventListener('click', () => {
        localStorage.setItem('fitbrandCookieOk', 'yes');
        banner.remove();
      });
    }

    function boot(){
      patchLoginButtons();
      patchCheckout();
      renderOrders();
      renderAccess();
      addCookieBanner();
      showSetupBanner();

      if(isConfigured()){
        loadSupabase().then(sb => {
          if(!sb) return;
          sb.auth.onAuthStateChange(() => {
            renderOrders();
            renderAccess();
          });
        });
      }
    }

    window.FitBrandBackend = { isConfigured, loadSupabase, getSession, getUser, loginWithMagicLink, renderOrders, renderAccess };

    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
  })();
/* ===== FITBRAND SUPABASE SESSION SYNC FIX ===== */
(function(){
  "use strict";

  const cfg = window.FITBRAND_CONFIG || {};
  let clientPromise = null;

  function configured(){
    return Boolean(
      cfg.supabaseUrl &&
      cfg.supabaseAnonKey &&
      !String(cfg.supabaseAnonKey).includes("PASTE_")
    );
  }

  function loadClient(){
    if(!configured()) return Promise.resolve(null);

    if(window.supabase && window.supabase.createClient){
      return Promise.resolve(
        window.__fitbrandSupabaseClient ||
        (window.__fitbrandSupabaseClient = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey))
      );
    }

    if(clientPromise) return clientPromise;

    clientPromise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      script.async = true;
      script.onload = () => {
        try {
          window.__fitbrandSupabaseClient =
            window.__fitbrandSupabaseClient ||
            window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
          resolve(window.__fitbrandSupabaseClient);
        } catch(e) {
          console.error("Supabase client failed:", e);
          resolve(null);
        }
      };
      script.onerror = () => resolve(null);
      document.head.appendChild(script);
    });

    return clientPromise;
  }

  function nameFromEmail(email){
    return String(email || "")
      .split("@")[0]
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  function syncFitBrandUser(session){
    const user = session && session.user;
    if(!user || !user.email) return;

    const profile = {
      email: user.email,
      name: user.user_metadata?.full_name || user.user_metadata?.name || nameFromEmail(user.email),
      supabaseId: user.id,
      backend: "supabase"
    };

    localStorage.setItem("fitbrandUser", JSON.stringify(profile));
    sessionStorage.removeItem("fitbrandSessionUser");

    document.body.classList.add("fb-is-logged-in");
    document.body.classList.remove("fb-is-logged-out");

    const initials = profile.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(x => x[0])
      .join("")
      .toUpperCase() || "FB";

    ["profileInitial", "profileMenuInitial", "profileModalInitial"].forEach(id => {
      const el = document.getElementById(id);
      if(el) el.textContent = initials;
    });

    ["profileMenuName", "profileViewName"].forEach(id => {
      const el = document.getElementById(id);
      if(el) el.textContent = profile.name;
    });

    ["profileMenuEmail", "profileViewEmail"].forEach(id => {
      const el = document.getElementById(id);
      if(el) el.textContent = profile.email;
    });

    const status = document.getElementById("profileViewStatus");
    if(status) status.textContent = "Logged in with Supabase";

    if(typeof window.updateFitBrandProfileUI === "function"){
      window.updateFitBrandProfileUI();
    }

    if(window.FitBrandBackend){
      window.FitBrandBackend.renderOrders?.();
      window.FitBrandBackend.renderAccess?.();
    }
  }

  async function boot(){
    const sb = await loadClient();
    if(!sb) return;

    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if(code){
      try {
        await sb.auth.exchangeCodeForSession(code);
        url.searchParams.delete("code");
        window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
      } catch(e) {
        console.warn("Supabase code exchange skipped/failed:", e);
      }
    }

    const { data } = await sb.auth.getSession();
    if(data && data.session){
      syncFitBrandUser(data.session);
    }

    sb.auth.onAuthStateChange((_event, session) => {
      if(session) syncFitBrandUser(session);
    });
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
