/* FitBrand v22 guaranteed-load frontend script */
(function(){
  'use strict';

  const PRODUCTS = {
    aesthetic:{name:'Aesthetic Program',price:4.99,type:'digital',url:'index.html?purchased=aesthetic'},
    shred:{name:'Shred Program',price:6.99,type:'digital',url:'index.html?purchased=shred'},
    strength:{name:'Strength Program',price:6.99,type:'digital',url:'index.html?purchased=strength'},
    bundle:{name:'Complete Bundle + Meal Plan AI',price:18.97,type:'digital',url:'index.html?purchased=bundle'},
    mealplan:{name:'Meal Plan Guide AI',price:5.99,type:'digital',url:'recommended.html?purchased=mealplan#meal-plan-ai'},
    belt:{name:'Lifting Belt',price:24.99,type:'physical',url:'product-belt.html'},
    straps:{name:'Lifting Straps',price:12.99,type:'physical',url:'product-straps.html'}
  };
  const VALID = Object.keys(PRODUCTS);
  const $ = id => document.getElementById(id);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const read = (key, fallback) => { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const money = n => '€' + Number(n || 0).toFixed(2);

  function getUser(){ return read('fitbrandUser', null) || read('fitbrandSessionUser', null); }
  function saveUser(user){ write('fitbrandUser', user); updateProfileUI(); }
  function cart(){ return read('fitbrandCart', []).filter(k => VALID.includes(k)); }
  function saveCart(items){ write('fitbrandCart', items.filter(k => VALID.includes(k))); updateCartCount(); renderCartPage(); renderCartDrawer(); }
  function purchases(){ return read('fitbrandPurchases', []).filter(k => VALID.includes(k)); }
  function savePurchases(items){ write('fitbrandPurchases', [...new Set(items.filter(k => VALID.includes(k)))]); }
  function orders(){ return read('fitbrandOrders', []); }
  function saveOrders(items){ write('fitbrandOrders', items.slice(0,50)); }

  function productKeyFromUrl(){
    const p = new URLSearchParams(location.search);
    return p.get('product') || p.get('purchased') || '';
  }

  function processPurchaseUrl(){
    const key = productKeyFromUrl();
    if(!VALID.includes(key)) return;
    const bought = purchases();
    if(!bought.includes(key)) bought.push(key);
    if(key === 'bundle' && !bought.includes('mealplan')) bought.push('mealplan');
    savePurchases(bought);
    if(['aesthetic','shred','strength','bundle'].includes(key)) localStorage.setItem('fitbrandPurchasedPackage', key);
    if(['mealplan','bundle'].includes(key)) localStorage.setItem('fitbrandMealPlanUnlocked','true');

    if(location.pathname.endsWith('confirmation.html')){
      const guard = 'fitbrandOrderSaved:' + key + ':' + new Date().toISOString().slice(0,10);
      if(!sessionStorage.getItem(guard)){
        const user = getUser();
        const item = { date:new Date().toISOString(), items:[key], product:key, status:'Confirmed', email:user?.email || '' };
        const list = orders();
        const duplicate = list.some(o => (o.product===key || (Array.isArray(o.items)&&o.items.includes(key))) && Math.abs(new Date(item.date)-new Date(o.date||0)) < 60000);
        if(!duplicate) saveOrders([item, ...list]);
        sessionStorage.setItem(guard,'1');
      }
      localStorage.removeItem('fitbrandCart');
    }
  }

  function updateCartCount(){
    const count = cart().length;
    $$('#cart-count, #cart-count-btn, .cart-count').forEach(el => { el.textContent = count; el.style.display = count ? 'inline-flex' : 'none'; });
  }

  function addToCart(key){
    if(!VALID.includes(key)) return;
    const items = cart();
    items.push(key); saveCart(items);
    showNotice(PRODUCTS[key].name + ' added to cart');
  }

  function removeItem(key){ saveCart(cart().filter(k => k !== key)); }
  function removeProduct(key){ removeItem(key); }
  function removeDrawerItem(key){ removeItem(key); }
  function changeQty(key, delta){
    const items = cart();
    if(delta > 0) items.push(key);
    else {
      const idx = items.indexOf(key);
      if(idx >= 0) items.splice(idx, 1);
    }
    saveCart(items);
  }

  function groupedCart(){
    const map = new Map();
    cart().forEach(k => map.set(k, (map.get(k)||0)+1));
    return Array.from(map.entries());
  }
  function subtotal(){ return cart().reduce((sum,k)=>sum+(PRODUCTS[k]?.price||0),0); }

  function renderCartPage(){
    const container = $('cart-items') || $('cartItems') || $('.cart-items');
    const totalEl = $('cart-total') || $('cartTotal') || $('drawerTotal');
    if(container){
      const groups = groupedCart();
      container.innerHTML = groups.length ? groups.map(([key,qty]) => `
        <div class="drawer-item cart-line-item">
          <div><strong>${esc(PRODUCTS[key].name)}</strong><span>${qty} × ${money(PRODUCTS[key].price)}</span></div>
          <button type="button" onclick="removeItem('${key}')">Remove</button>
        </div>`).join('') : '<p>Your cart is empty.</p>';
    }
    if(totalEl) totalEl.textContent = money(subtotal());
    const checkout = $('checkoutBtn') || document.querySelector('[href*="checkout.html"]');
    if(checkout && cart().length){ checkout.href = 'checkout.html?cart=true'; }
  }

  function ensureCartDrawer(){
    let overlay = $('fitbrandCartDrawer');
    if(overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'fitbrandCartDrawer';
    overlay.className = 'cart-drawer-overlay';
    overlay.innerHTML = `<aside class="cart-drawer"><div class="drawer-head"><h2>Your cart</h2><button class="drawer-close" onclick="closeCartDrawer()">×</button></div><div id="drawerCartItems" class="drawer-body"></div><div class="drawer-footer"><strong>Total: <span id="drawerTotal">€0.00</span></strong><a class="btn-dark drawer-checkout-btn" href="checkout.html?cart=true">Checkout</a></div></aside>`;
    overlay.addEventListener('click', e => { if(e.target === overlay) closeCartDrawer(); });
    document.body.appendChild(overlay);
    return overlay;
  }
  function renderCartDrawer(){
    const overlay = ensureCartDrawer();
    const body = overlay.querySelector('#drawerCartItems');
    const groups = groupedCart();
    body.innerHTML = groups.length ? groups.map(([key,qty]) => `
      <div class="drawer-item"><div><strong>${esc(PRODUCTS[key].name)}</strong><span>${qty} × ${money(PRODUCTS[key].price)}</span></div><button onclick="removeDrawerItem('${key}')">Remove</button></div>`).join('') : '<p>Your cart is empty.</p>';
    const total = overlay.querySelector('#drawerTotal');
    if(total) total.textContent = money(subtotal());
  }
  function openCartDrawer(){ renderCartDrawer(); ensureCartDrawer().classList.add('show'); }
  function closeCartDrawer(){ $('fitbrandCartDrawer')?.classList.remove('show'); }
  function applyCartDiscount(){ showNotice('Discount codes are ready for Stripe setup.'); }
  function applyDrawerDiscount(){ applyCartDiscount(); }
  function applyCheckoutDiscount(){ applyCartDiscount(); }

  function ensureProfileMenu(){
    const nav = document.querySelector('.nav'); if(!nav) return;
    let actions = nav.querySelector('.nav-actions');
    const cartBtn = nav.querySelector('.cart-icon-btn');
    if(!actions){ actions = document.createElement('div'); actions.className = 'nav-actions'; nav.appendChild(actions); }
    if(cartBtn && cartBtn.parentElement !== actions) actions.prepend(cartBtn);
    let btn = actions.querySelector('.profile-icon-btn');
    if(!btn){ btn = document.createElement('button'); btn.type='button'; btn.className='profile-icon-btn'; btn.innerHTML='<span id="profileInitial">?</span>'; actions.appendChild(btn); }
    btn.onclick = e => { e.preventDefault(); toggleProfileMenu(); };
    let menu = $('profileMenu');
    if(!menu){ menu = document.createElement('div'); menu.id='profileMenu'; menu.className='profile-menu'; actions.appendChild(menu); }
    menu.innerHTML = `<div class="profile-menu-head"><div class="profile-avatar"><span id="profileMenuInitial">?</span></div><div class="profile-menu-id"><strong id="profileMenuName">Guest</strong><br><span id="profileMenuEmail">Not logged in</span></div></div><button type="button" onclick="openProfileModal('profile')">View profile</button><a class="profile-menu-link" href="profile.html">Edit profile information</a><a class="profile-menu-link" href="products-access.html">My products / access</a><a class="profile-menu-link" href="orders.html">My orders</a><button type="button" id="profileLoginBtn" onclick="openProfileModal('login')">Sign in/up</button><button type="button" id="profileLogoutBtn" onclick="logoutFitBrandUser()">Log out</button>`;
  }

  function initials(user){
    const base = (user?.name || user?.email || '?').trim();
    if(base === '?') return '?';
    return base.split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase();
  }

  function updateProfileUI(){
    ensureProfileMenu();
    const user = getUser();
    $$('#profileInitial,#profileMenuInitial,#profileModalInitial').forEach(el => el.textContent = initials(user));
    $$('#profileMenuName,#profileViewName').forEach(el => el.textContent = user?.name || 'Guest');
    $$('#profileMenuEmail,#profileViewEmail').forEach(el => el.textContent = user?.email || 'Not logged in');
    if($('profileViewStatus')) $('profileViewStatus').textContent = user ? 'Logged in on this device' : 'Guest mode';
    const login = $('profileLoginBtn'), logout = $('profileLogoutBtn');
    if(login) login.style.display = user ? 'none' : 'flex';
    if(logout) logout.style.display = user ? 'flex' : 'none';
    renderAccountPages();
  }

  function toggleProfileMenu(){ ensureProfileMenu(); $('profileMenu')?.classList.toggle('show'); }
  function ensureProfileModal(){
    let modal = $('profileModal') || $('profileModalOverlay');
    if(modal) return modal;
    modal = document.createElement('div');
    modal.id = 'profileModal';
    modal.className = 'profile-modal-overlay';
    modal.innerHTML = `<div class="profile-modal"><button class="profile-modal-close" onclick="closeProfileModal()">×</button><div class="profile-modal-head"><div class="profile-avatar large"><span id="profileModalInitial">?</span></div><h2 id="profileModalTitle">Sign in/up</h2><p id="profileModalSubtitle">Save your orders and access on this device.</p></div><div id="profileView" class="profile-modal-content" style="display:none"><div class="profile-info-box"><strong>Name</strong><span id="profileViewName">Guest</span></div><div class="profile-info-box"><strong>Email</strong><span id="profileViewEmail">Not logged in</span></div><div class="profile-info-box"><strong>Status</strong><span id="profileViewStatus">Guest mode</span></div></div><div id="profileLogin" class="profile-modal-content"><label>Email</label><input id="loginProfileEmail" type="email" placeholder="your@email.com"><label>Name</label><input id="loginProfileName" type="text" placeholder="Your name"><button class="btn-dark" onclick="loginFitBrandUser()">Sign in/up</button></div></div>`;
    modal.addEventListener('click', e => { if(e.target === modal) closeProfileModal(); });
    document.body.appendChild(modal);
    return modal;
  }
  function openProfileModal(mode){
    const modal = ensureProfileModal();
    const user = getUser();
    const view = $('profileView'), login = $('profileLogin');
    if(mode === 'profile' && user){ if(view) view.style.display='grid'; if(login) login.style.display='none'; }
    else { if(view) view.style.display='none'; if(login) login.style.display='grid'; if($('loginProfileEmail')) $('loginProfileEmail').value=user?.email||''; if($('loginProfileName')) $('loginProfileName').value=user?.name||''; }
    updateProfileUI(); modal.classList.add('show');
  }
  function closeProfileModal(){ ($('profileModal')||$('profileModalOverlay'))?.classList.remove('show'); }
  function loginFitBrandUser(){
    const email = ($('loginProfileEmail')?.value || $('profileEmailInput')?.value || '').trim();
    const name = ($('loginProfileName')?.value || $('profileNameInput')?.value || email.split('@')[0] || 'Customer').trim();
    if(!email || !email.includes('@')){ alert('Please enter a valid email.'); return; }
    saveUser({email,name}); closeProfileModal(); showNotice('Signed in');
  }
  function fakeGoogleLogin(){ openProfileModal('login'); }
  function saveFitBrandProfile(){ loginFitBrandUser(); }
  function logoutFitBrandUser(){ localStorage.removeItem('fitbrandUser'); sessionStorage.removeItem('fitbrandSessionUser'); updateProfileUI(); closeProfileModal(); showNotice('Logged out'); }

  function renderAccountPages(){
    const user = getUser();
    if($('accountIntro')) $('accountIntro').textContent = user ? `Signed in as ${user.email || user.name}.` : 'Sign in to see saved access and orders on this device.';
    if($('accountLocked')) $('accountLocked').style.display = user ? 'none' : 'grid';
    if($('orders')) $('orders').style.display = user ? 'block' : 'none';
    if($('products')) $('products').style.display = user ? 'block' : 'none';
    if($('ordersList')){
      const list = user ? orders().filter(o => !o.email || o.email === user.email) : [];
      $('ordersList').innerHTML = list.length ? list.map(o => {
        const keys = Array.isArray(o.items) && o.items.length ? o.items : [o.product];
        return `<article class="order-card"><strong>${esc(keys.map(k=>PRODUCTS[k]?.name||k).join(', '))}</strong><span>${new Date(o.date||Date.now()).toLocaleString()} • ${esc(o.status||'Confirmed')}</span></article>`;
      }).join('') : '<p>No orders saved yet.</p>';
    }
    if($('accessGrid')){
      const own = user ? purchases() : [];
      $('accessGrid').innerHTML = VALID.filter(k=>PRODUCTS[k].type==='digital').map(k => {
        const has = own.includes(k);
        return `<article class="access-card ${has?'owned':'locked'}"><div><span>${has?'Unlocked':'Locked'}</span><h3>${esc(PRODUCTS[k].name)}</h3><p>${has?'You have access on this profile/device.':'Buy to unlock this product.'}</p></div><a class="${has?'btn-dark':'btn-outline'}" href="${has?PRODUCTS[k].url:'checkout.html?product='+k}">${has?'Open':'Buy access'}</a></article>`;
      }).join('');
    }
  }

  function checkoutCurrentProduct(){
    const params = new URLSearchParams(location.search);
    const key = params.get('product');
    if(params.get('cart') === 'true' && cart().length) return cart()[0];
    return VALID.includes(key) ? key : 'bundle';
  }
  function setupCheckout(){
    const key = checkoutCurrentProduct();
    const link = $('stripe-link') || document.querySelector('.checkout-btn, .cart-checkout, a[href*="confirmation.html"]');
    if(link){ link.href = 'confirmation.html?product=' + encodeURIComponent(key); }
  }

  function setGalleryImage(src){
    const main = $('mainProductImage') || document.querySelector('.product-main-image img, .product-media img, .product-gallery-main img');
    if(main && src) main.src = src;
  }

  function openGeneratorModal(){
    let modal = $('fitbrandGeneratorModal');
    if(!modal){
      modal = document.createElement('div'); modal.id='fitbrandGeneratorModal'; modal.className='fb-modal-overlay';
      modal.innerHTML = `<div class="fb-generator-modal"><button class="fb-modal-close" onclick="closeGeneratorModal()">×</button><div class="fb-modal-header"><div class="fb-logo-mark">FB</div><h2>Generate Your Personal Training Plan</h2><p>Simple, fast and personalized after purchase.</p></div><div class="fb-modal-body"><div class="fb-form-grid"><select id="modalPackage"><option value="aesthetic">Aesthetic Program</option><option value="shred">Shred Program</option><option value="strength">Strength Program</option><option value="bundle">Complete Bundle</option></select><select id="modalPlace"><option value="gym">Gym</option><option value="home">Home</option></select><select id="modalDays"><option value="3">3 days</option><option value="4">4 days</option><option value="5">5 days</option><option value="6">6 days</option></select><select id="modalLevel"><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></div><button class="fb-generate-btn" onclick="generateModalPlan()">Generate my plan</button><div id="modalPlanOutput" class="fb-plan-output"><div id="modalPlanDays" class="fb-plan-days"></div></div></div></div>`;
      modal.addEventListener('click', e => { if(e.target === modal) closeGeneratorModal(); });
      document.body.appendChild(modal);
    }
    const bought = purchases();
    const pkg = $('modalPackage');
    if(pkg){ pkg.value = bought.find(k=>['aesthetic','shred','strength','bundle'].includes(k)) || 'aesthetic'; }
    modal.classList.add('show');
  }
  function closeGeneratorModal(){ $('fitbrandGeneratorModal')?.classList.remove('show'); }
  function generateModalPlan(){
    const days = Number($('modalDays')?.value || 4);
    const place = $('modalPlace')?.value || 'gym';
    const level = $('modalLevel')?.value || 'beginner';
    const workouts = ['Push + core','Pull + posture','Legs + conditioning','Upper body','Full body','Recovery / mobility'];
    const html = workouts.slice(0, days).map((name,i)=>`<div class="fb-plan-day"><h4>Day ${i+1} — ${name}</h4><ul><li>Warm up 8-10 minutes</li><li>Main lifts: 3-4 exercises</li><li>Accessories: 2-3 exercises</li><li>${place} plan • ${level} level</li></ul></div>`).join('');
    const out = $('modalPlanOutput'); if(out) out.classList.add('show');
    if($('modalPlanDays')) $('modalPlanDays').innerHTML = html;
  }

  function handleMealPreviewClick(){
    const box = $('meal-plan-ai');
    if(box){ box.classList.add('unlocked'); box.scrollIntoView({behavior:'smooth', block:'start'}); }
    showNotice('Meal Plan AI opened');
  }
  function generateMealPlan(){
    const out = $('mealOutput') || $('mealPlanOutput') || document.querySelector('.meal-output');
    const html = `<h3>Your 7-day meal plan</h3><p>High protein, simple meals and clear structure.</p><ul><li>Breakfast: eggs/skyr/oats option</li><li>Lunch: chicken/rice/vegetables option</li><li>Dinner: lean protein + carbs + vegetables</li><li>Snack: fruit, protein shake or yogurt</li></ul>`;
    if(out){ out.innerHTML = html; out.classList.add('show'); }
    else alert('Meal plan generated.');
  }
  function resetMealPlan(){ const out = $('mealOutput') || $('mealPlanOutput'); if(out){ out.innerHTML=''; out.classList.remove('show'); } }
  function downloadMealPlanPDF(){ window.print(); }

  function showFinderResult(){ document.querySelector('.finder-result')?.classList.add('show'); }
  function nextFinderStep(){ showFinderResult(); }
  function resetFinder(){ document.querySelector('.finder-result')?.classList.remove('show'); }

  function showNotice(text){
    let n = $('fb-mini-notice');
    if(!n){ n = document.createElement('div'); n.id='fb-mini-notice'; n.className='fb-mini-notice'; document.body.appendChild(n); }
    n.textContent = text; n.classList.add('show'); setTimeout(()=>n.classList.remove('show'),1600);
  }

  function boot(){
    processPurchaseUrl();
    updateCartCount();
    renderCartPage();
    setupCheckout();
    ensureProfileMenu();
    updateProfileUI();
    renderAccountPages();
    $$('.cart-icon-btn').forEach(btn => btn.addEventListener('click', e => { e.preventDefault(); openCartDrawer(); }));
    document.addEventListener('click', e => { const menu=$('profileMenu'), btn=document.querySelector('.profile-icon-btn'); if(menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) menu.classList.remove('show'); });
  }

  Object.assign(window, { addToCart, removeItem, removeProduct, removeDrawerItem, changeQty, openCartDrawer, closeCartDrawer, applyCartDiscount, applyDrawerDiscount, applyCheckoutDiscount, toggleProfileMenu, openProfileModal, closeProfileModal, loginFitBrandUser, fakeGoogleLogin, saveFitBrandProfile, logoutFitBrandUser, getFitBrandUser:getUser, saveFitBrandUser:saveUser, updateFitBrandProfileUI:updateProfileUI, updateProfileUI, setGalleryImage, openGeneratorModal, closeGeneratorModal, generateModalPlan, handleMealPreviewClick, generateMealPlan, resetMealPlan, downloadMealPlanPDF, showFinderResult, nextFinderStep, resetFinder });

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
