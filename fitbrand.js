/* FitBrand global system - v12 clean/stable */
(function(){
  'use strict';

  const USER_KEY = 'fitbrandUser';
  const SESSION_USER_KEY = 'fitbrandSessionUser';
  const CART_KEY = 'fitbrandCart';
  const PURCHASES_KEY = 'fitbrandPurchases';
  const ORDERS_KEY = 'fitbrandOrders';
  const PROGRAM_KEY = 'fitbrandPurchasedPackage';
  const WELCOME_KEY = 'fitbrandWelcomeSeenV12';
  const DISCOUNT_KEY = 'fitbrandDiscount';

  const PRODUCTS = {
    aesthetic: { name:'Aesthetic Program', price:4.99, type:'digital', open:'index.html?purchased=aesthetic', buy:'checkout.html?product=aesthetic' },
    shred: { name:'Shred Program', price:6.99, type:'digital', open:'index.html?purchased=shred', buy:'checkout.html?product=shred' },
    strength: { name:'Strength Program', price:6.99, type:'digital', open:'index.html?purchased=strength', buy:'checkout.html?product=strength' },
    bundle: { name:'Complete FitBrand Bundle + Meal Plan AI', price:18.97, type:'digital', open:'index.html?purchased=bundle', buy:'checkout.html?product=bundle' },
    mealplan: { name:'Meal Plan Guide AI', price:5.99, type:'digital', open:'recommended.html?purchased=mealplan#meal-plan-ai', buy:'checkout.html?product=mealplan' },
    belt: { name:'Lifting Belt', price:24.99, type:'physical', open:'product-belt.html', buy:'checkout.html?product=belt' },
    straps: { name:'Lifting Straps', price:12.99, type:'physical', open:'product-straps.html', buy:'checkout.html?product=straps' }
  };
  const VALID_PRODUCTS = Object.keys(PRODUCTS);
  const PROGRAMS = ['aesthetic','shred','strength'];
  window.fitbrandCatalog = PRODUCTS;

  const PROGRAM_LIBRARY = {
    aesthetic: {
      gym: [
        ['Day 1 — Chest + Triceps',['Bench Press — 4x6-8','Incline DB Press — 3x8-10','Cable Fly — 3x12-15','Lateral Raises — 4x12-15','Tricep Pushdown — 3x10-12']],
        ['Day 2 — Back + Biceps',['Lat Pulldown — 4x8-10','Barbell Row — 4x8-10','Seated Cable Row — 3x10-12','Rear Delt Fly — 3x12-15','DB Curl — 3x10-12']],
        ['Day 3 — Legs',['Squat — 4x6-8','Leg Press — 3x10-12','Romanian Deadlift — 3x8-10','Leg Curl — 3x12-15','Calf Raise — 4x12-15']],
        ['Day 4 — Upper Aesthetic',['Incline Press — 4x8','Chest Supported Row — 4x10','Machine Shoulder Press — 3x10','Cable Lateral Raise — 4x15','Arms Superset — 3x12']],
        ['Day 5 — Pump + Core',['Machine Chest Press — 3x12','Cable Row — 3x12','Leg Extension — 3x15','Hanging Leg Raise — 3x12','Plank — 3x45 sec']],
        ['Day 6 — Weak Point Focus',['Upper chest — 4 sets','Back width — 4 sets','Shoulders — 4 sets','Arms — 4 sets','Core — 3 sets']]
      ],
      home: [
        ['Day 1 — Push',['Push Ups — 4xAMRAP','Feet Elevated Push Ups — 3x10-15','Band Fly — 3x15','Pike Push Ups — 4x8-12','Bench Dips — 3x12']],
        ['Day 2 — Pull',['One Arm DB Row — 4x10','Band Pulldown — 4x12','Band Row — 3x15','Rear Delt Raise — 3x15','DB Curl — 3x12']],
        ['Day 3 — Legs',['Goblet Squat — 4x12','Bulgarian Split Squat — 3x10','Single Leg RDL — 3x10','Glute Bridge — 3x15','Calf Raise — 4x15']],
        ['Day 4 — Upper Aesthetic',['Push Ups — 4 sets','DB Row — 4 sets','Lateral Raise — 4x15','Band Pull Apart — 3x20','Arms Superset — 3x12']],
        ['Day 5 — Pump + Core',['Full body circuit — 4 rounds','Mountain Climbers — 3x30 sec','Plank — 3x45 sec','Leg Raises — 3x12']],
        ['Day 6 — Weak Point Focus',['Shoulders — 4 sets','Back — 4 sets','Arms — 4 sets','Core — 3 sets']]
      ]
    },
    shred: {
      gym: [
        ['Day 1 — Full Body Strength',['Squat — 4x6-8','Bench Press — 4x6-8','Row — 4x8-10','Lateral Raise — 3x15','Incline Walk — 20 min']],
        ['Day 2 — Conditioning',['Leg Press — 3x12','Lat Pulldown — 3x12','DB Press — 3x12','Bike Intervals — 10 rounds','Core Circuit — 3 rounds']],
        ['Day 3 — Lower + Cardio',['Romanian Deadlift — 4x8','Bulgarian Split Squat — 3x10','Leg Curl — 3x12','Calf Raise — 4x15','Incline Walk — 25 min']],
        ['Day 4 — Upper + HIIT',['Incline Press — 3x10','Cable Row — 3x10','Shoulder Press — 3x10','Curls + Triceps — 3x12','Bike Intervals — 12 min']],
        ['Day 5 — Fat Loss Circuit',['Goblet Squat — 4x12','Push Ups — 4xAMRAP','Cable Row — 4x12','Walking Lunges — 3x20','Treadmill — 20 min']],
        ['Day 6 — Low Intensity',['Steps goal — 8k-12k','Mobility — 15 min','Core — 10 min','Stretch — 10 min']]
      ],
      home: [
        ['Day 1 — Full Body',['Goblet Squat — 4x12','Push Ups — 4xAMRAP','DB Row — 4x12','Burpees — 3x10','Fast Walk — 25 min']],
        ['Day 2 — Conditioning',['Jump Squats — 4x12','Mountain Climbers — 4x30 sec','Band Row — 4x15','Plank — 3x45 sec','Steps — 8k-12k']],
        ['Day 3 — Lower Burn',['Bulgarian Split Squat — 4x10','Glute Bridge — 4x15','Single Leg RDL — 3x10','Calf Raise — 4x20','Walk — 30 min']],
        ['Day 4 — Upper Burn',['Push Ups — 4 sets','Pike Push Ups — 3x10','Band Row — 4x15','DB Curl — 3x12','HIIT — 10 min']],
        ['Day 5 — Fat Loss Circuit',['Squat — 20 reps','Push Ups — AMRAP','Rows — 15 reps','Lunges — 20 reps','Repeat 4 rounds']],
        ['Day 6 — Active Recovery',['Walk — 40 min','Mobility — 15 min','Core — 10 min']]
      ]
    },
    strength: {
      gym: [
        ['Day 1 — Squat Focus',['Back Squat — 5x3-5','Paused Squat — 3x5','Leg Press — 3x8','Hamstring Curl — 3x10','Core — 3 sets']],
        ['Day 2 — Bench Focus',['Bench Press — 5x3-5','Incline DB Press — 3x8','Barbell Row — 4x8','Tricep Dips — 3x8','Face Pull — 3x15']],
        ['Day 3 — Deadlift Focus',['Deadlift — 5x3','Romanian Deadlift — 3x6-8','Lat Pulldown — 4x8','Back Extension — 3x10','Farmer Carry — 4 rounds']],
        ['Day 4 — Overhead Focus',['Overhead Press — 5x3-5','Close Grip Bench — 3x6','Pull Ups — 4xAMRAP','Lateral Raise — 3x15','Core — 3 sets']],
        ['Day 5 — Volume Strength',['Front Squat — 4x6','Paused Bench — 4x6','Row — 4x8','Hip Thrust — 3x8','Arms — 3x10']],
        ['Day 6 — Recovery Strength',['Technique work — 30 min','Mobility — 15 min','Light cardio — 20 min']]
      ],
      home: [
        ['Day 1 — Lower Strength',['Goblet Squat — 5x8','Bulgarian Split Squat — 4x8','Single Leg RDL — 4x8','Wall Sit — 3x45 sec','Core — 3 sets']],
        ['Day 2 — Push Strength',['Weighted Push Ups — 5x6-10','Pike Push Ups — 4x8','Slow Push Ups — 3x8','Bench Dips — 3x10','Plank — 3 sets']],
        ['Day 3 — Pull Strength',['Heavy DB Row — 5x8','Band Row — 4x12','Towel Row — 4xAMRAP','DB Curl — 4x10','Farmer Hold — 4 rounds']],
        ['Day 4 — Full Body Strength',['Goblet Squat — 4x8','Push Ups — 4xAMRAP','DB Row — 4x8','Split Squat — 3x10','Core — 3 sets']],
        ['Day 5 — Volume Strength',['Tempo Squat — 4x10','Tempo Push Up — 4x10','Tempo Row — 4x10','Glute Bridge — 3x15','Carries — 4 rounds']],
        ['Day 6 — Recovery Strength',['Mobility — 20 min','Walk — 30 min','Technique work — 15 min']]
      ]
    }
  };

  const $ = (id) => document.getElementById(id);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  function safeParse(raw, fallback){ try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } }
  function money(n){ return '€' + Number(n || 0).toFixed(2); }
  function productName(key){ return PRODUCTS[key]?.name || key; }
  function validProduct(key){ return VALID_PRODUCTS.includes(key); }

  function getPersistentUser(){ return safeParse(localStorage.getItem(USER_KEY), null); }
  function getSessionUser(){ return safeParse(sessionStorage.getItem(SESSION_USER_KEY), null); }
  function getUser(){ return getPersistentUser() || getSessionUser(); }
  window.getFitBrandUser = getUser;

  function getInitials(user){
    if(!user || !user.name) return '?';
    const parts = String(user.name).trim().split(/\s+/).filter(Boolean);
    if(!parts.length) return '?';
    return ((parts[0][0] || '') + (parts.length > 1 ? (parts[parts.length - 1][0] || '') : '')).toUpperCase();
  }

  function saveFitBrandUser(data, remember){
    const previous = getUser() || {};
    const merged = Object.assign({}, previous, data || {});
    if(remember){
      localStorage.setItem(USER_KEY, JSON.stringify(merged));
      sessionStorage.removeItem(SESSION_USER_KEY);
    } else {
      sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(merged));
    }
    sessionStorage.setItem(WELCOME_KEY, 'true');
    updateFitBrandProfileUI();
    prefillGeneratorsFromProfile(false);
    return merged;
  }
  window.saveFitBrandUser = saveFitBrandUser;

  window.logoutFitBrandUser = function(){
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(SESSION_USER_KEY);
    updateFitBrandProfileUI();
    closeProfileModal();
    const menu = $('profileMenu');
    if(menu) menu.classList.remove('show');
    showNotice('Logged out');
  };

  function getCart(){ return safeParse(localStorage.getItem(CART_KEY), []).filter(validProduct); }
  function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart.filter(validProduct))); }
  function grouped(items){ return items.reduce((acc, item) => { acc[item] = (acc[item] || 0) + 1; return acc; }, {}); }
  function getPurchases(){
    const base = safeParse(localStorage.getItem(PURCHASES_KEY), []).filter(validProduct);
    const program = localStorage.getItem(PROGRAM_KEY);
    if(validProduct(program) && !base.includes(program)) base.push(program);
    if(localStorage.getItem('fitbrandMealPlanUnlocked') === 'true' && !base.includes('mealplan')) base.push('mealplan');
    if(base.includes('bundle') && !base.includes('mealplan')) base.push('mealplan');
    return [...new Set(base)];
  }
  function savePurchases(items){ localStorage.setItem(PURCHASES_KEY, JSON.stringify([...new Set(items.filter(validProduct))])); }
  function addPurchase(key){
    if(!validProduct(key)) return;
    const purchases = getPurchases();
    if(!purchases.includes(key)) purchases.push(key);
    if(key === 'bundle' && !purchases.includes('mealplan')) purchases.push('mealplan');
    savePurchases(purchases);
    if(PROGRAMS.includes(key) || key === 'bundle') localStorage.setItem(PROGRAM_KEY, key);
    if(key === 'mealplan' || key === 'bundle') localStorage.setItem('fitbrandMealPlanUnlocked','true');
  }

  function ensureHeader(){
    const nav = document.querySelector('header.nav');
    if(!nav) return;
    let actions = nav.querySelector('.nav-actions');
    const cart = nav.querySelector('.cart-icon-btn');
    if(!actions){
      actions = document.createElement('div');
      actions.className = 'nav-actions';
      if(cart){ cart.parentNode.insertBefore(actions, cart); actions.appendChild(cart); }
      else nav.appendChild(actions);
    }
    if(!actions.querySelector('.profile-icon-btn')){
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'profile-icon-btn';
      btn.setAttribute('aria-label','Profile');
      btn.innerHTML = '<span id="profileInitial">?</span>';
      btn.addEventListener('click', window.toggleProfileMenu);
      actions.appendChild(btn);
    }
    let menu = actions.querySelector('#profileMenu');
    if(!menu){
      menu = document.createElement('div');
      menu.id = 'profileMenu';
      menu.className = 'profile-menu';
      actions.appendChild(menu);
    }
  }

  function renderProfileMenu(){
    ensureHeader();
    const menu = $('profileMenu');
    if(!menu) return;
    const user = getUser();
    const initials = getInitials(user);
    const name = user?.name || 'Guest';
    const email = user?.email || 'Not logged in';
    const loggedInLinks = `
      <button type="button" onclick="openProfileModal('profile')">View profile</button>
      <a class="profile-menu-link" href="profile.html">Edit profile information</a>
      <a class="profile-menu-link" href="products-access.html">My products / access</a>
      <a class="profile-menu-link" href="orders.html">My orders</a>
      <button id="profileLogoutBtn" type="button" onclick="logoutFitBrandUser()">Log out</button>
    `;
    const guestLinks = `
      <button id="profileLoginBtn" type="button" onclick="openProfileModal('login')">Sign in/up</button>
    `;
    menu.innerHTML = `
      <div class="profile-menu-head">
        <div class="profile-avatar"><span id="profileMenuInitial">${initials}</span></div>
        <div class="profile-menu-id"><strong id="profileMenuName" title="${escapeHtml(name)}">${escapeHtml(name)}</strong><span id="profileMenuEmail" title="${escapeHtml(email)}">${escapeHtml(email)}</span></div>
      </div>
      ${user ? loggedInLinks : guestLinks}
    `;
  }

  function updateFitBrandProfileUI(){
    ensureHeader();
    const user = getUser();
    const initials = getInitials(user);
    $$('#profileInitial,#profileMenuInitial,#profileViewInitial,#profileModalInitial').forEach(el => { el.textContent = initials; });
    $$('#profileMenuName,#profileViewName').forEach(el => { el.textContent = user?.name || 'Guest'; });
    $$('#profileMenuEmail,#profileViewEmail').forEach(el => { el.textContent = user?.email || 'Not logged in'; });
    renderProfileMenu();
  }
  window.updateFitBrandProfileUI = updateFitBrandProfileUI;

  window.toggleProfileMenu = function(event){
    if(event) event.stopPropagation();
    renderProfileMenu();
    $('profileMenu')?.classList.toggle('show');
  };

  function ensureProfileModal(){
    let overlay = $('profileModalOverlay');
    if(overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'profileModalOverlay';
    overlay.className = 'profile-modal-overlay';
    overlay.innerHTML = `
      <div class="profile-modal" onclick="event.stopPropagation()">
        <button class="profile-modal-close" type="button" onclick="closeProfileModal()">×</button>
        <div class="profile-modal-top">
          <div class="profile-avatar large"><span id="profileModalInitial">?</span></div>
          <div><h2 id="profileModalTitle">Sign in/up</h2><p id="profileModalText">Save your profile, product access and generator details.</p></div>
        </div>
        <div id="profileViewBox" style="display:none;">
          <div class="profile-info-box"><strong>Name</strong><span id="profileViewName">Guest</span></div>
          <div class="profile-info-box"><strong>Email</strong><span id="profileViewEmail">Not logged in</span></div>
          <div class="profile-modal-actions"><a class="btn-dark" href="profile.html">Edit information</a><a class="btn-outline" href="products-access.html">My access</a><a class="btn-outline" href="orders.html">My orders</a></div>
        </div>
        <form id="profileForm" class="profile-form">
          <input id="profileNameInput" type="text" placeholder="Full name" autocomplete="name">
          <input id="profileEmailInput" type="email" placeholder="your@email.com" autocomplete="email">
          <label class="profile-remember-row"><input id="profileRememberInput" type="checkbox"> Remember my login</label>
          <button class="profile-main-btn" type="submit">Sign in/up</button>
          <button class="profile-google-btn" type="button" onclick="fakeGoogleLogin()">Continue with Google</button>
        </form>
      </div>
    `;
    overlay.addEventListener('click', closeProfileModal);
    document.body.appendChild(overlay);
    const form = $('profileForm');
    if(form){
      form.addEventListener('submit', function(e){
        e.preventDefault();
        const name = $('profileNameInput')?.value.trim();
        const email = $('profileEmailInput')?.value.trim();
        const remember = Boolean($('profileRememberInput')?.checked);
        if(!name || !email || !email.includes('@')){ alert('Enter a valid name and email.'); return; }
        saveFitBrandUser({ name, email }, remember);
        closeProfileModal();
        showNotice('Signed in');
      });
    }
    return overlay;
  }

  window.openProfileModal = function(mode){
    const overlay = ensureProfileModal();
    const user = getUser();
    $('profileMenu')?.classList.remove('show');
    const form = $('profileForm');
    const view = $('profileViewBox');
    const title = $('profileModalTitle');
    const text = $('profileModalText');
    if(mode === 'profile' && user){
      title.textContent = 'Your Profile';
      text.textContent = 'Your saved FitBrand profile on this device.';
      if(form) form.style.display = 'none';
      if(view) view.style.display = 'block';
    } else {
      title.textContent = 'Sign in/up';
      text.textContent = 'Sign in to save your profile, access, orders and generator details.';
      if(form) form.style.display = 'grid';
      if(view) view.style.display = 'none';
      if($('profileNameInput')) $('profileNameInput').value = user?.name || '';
      if($('profileEmailInput')) $('profileEmailInput').value = user?.email || '';
      if($('profileRememberInput')) $('profileRememberInput').checked = Boolean(getPersistentUser());
    }
    updateFitBrandProfileUI();
    overlay.classList.add('show');
  };
  function closeProfileModal(){ $('profileModalOverlay')?.classList.remove('show'); }
  window.closeProfileModal = closeProfileModal;

  window.fakeGoogleLogin = function(){
    const email = prompt('Enter your Google email:');
    if(!email) return;
    const local = email.split('@')[0].replace(/[._-]+/g,' ').trim();
    const name = local ? local.replace(/\b\w/g, c => c.toUpperCase()) : 'FitBrand Customer';
    saveFitBrandUser({ name, email }, true);
    closeProfileModal();
    showNotice('Signed in');
  };

  function showWelcome(){
    if(getUser() || sessionStorage.getItem(WELCOME_KEY)) return;
    let overlay = $('fitbrandWelcomeOverlay');
    if(!overlay){
      overlay = document.createElement('div');
      overlay.id = 'fitbrandWelcomeOverlay';
      overlay.className = 'fb-welcome-overlay';
      overlay.innerHTML = `
        <div class="fb-welcome-card">
          <div class="premium-badge">FitBrand Account</div>
          <h2>Welcome to FitBrand</h2>
          <p>Sign in to save your profile, orders, access and generator details. You can also continue as guest.</p>
          <div class="fb-welcome-actions">
            <button class="fb-welcome-primary" type="button" onclick="openProfileFromWelcome()">Sign in/up</button>
            <button class="fb-welcome-secondary" type="button" onclick="continueAsGuest()">Continue as guest</button>
          </div>
        </div>`;
      document.body.appendChild(overlay);
    }
    setTimeout(() => overlay.classList.add('show'), 450);
  }
  window.openProfileFromWelcome = function(){ sessionStorage.setItem(WELCOME_KEY,'true'); $('fitbrandWelcomeOverlay')?.classList.remove('show'); openProfileModal('login'); };
  window.continueAsGuest = function(){ sessionStorage.setItem(WELCOME_KEY,'true'); $('fitbrandWelcomeOverlay')?.classList.remove('show'); };

  window.updateCartCount = function(){
    const cart = getCart();
    $$('#cart-count,#cart-count-btn').forEach(el => { el.textContent = cart.length; el.style.display = cart.length > 0 ? 'inline-flex' : 'none'; });
    renderCartDrawer();
  };

  window.addToCart = function(product){
    if(!validProduct(product)) return;
    const cart = getCart();
    cart.push(product);
    saveCart(cart);
    updateCartCount();
    showMiniCartPopup();
  };

  window.showMiniCartPopup = function(){ showMiniCartPopup(); };
  function showMiniCartPopup(){
    const popup = $('mini-cart-popup');
    if(!popup) return;
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 2600);
  }

  function renderCartDrawer(){
    const drawerItems = $('drawer-items');
    const totalEl = $('drawer-total');
    if(!drawerItems || !totalEl) return;
    const cart = getCart();
    if(!cart.length){ drawerItems.innerHTML = '<p>Your cart is empty.</p>'; totalEl.textContent = money(0); return; }
    let total = 0;
    drawerItems.innerHTML = cart.map((item, index) => {
      const p = PRODUCTS[item] || PRODUCTS.bundle;
      total += p.price;
      return `<div class="drawer-item"><div><strong>${escapeHtml(p.name)}</strong><span>FitBrand product</span></div><div><strong>${money(p.price)}</strong><br><button class="remove-item-btn" onclick="removeDrawerItem(${index})">Remove</button></div></div>`;
    }).join('');
    const discount = localStorage.getItem(DISCOUNT_KEY) === 'FIT10' ? 0.10 : 0;
    totalEl.textContent = money(total * (1 - discount));
  }
  window.renderCartDrawer = renderCartDrawer;
  window.removeDrawerItem = function(index){ const cart = getCart(); cart.splice(index,1); saveCart(cart); updateCartCount(); };
  window.openCartDrawer = function(){ $('cart-drawer')?.classList.add('show'); $('drawer-overlay')?.classList.add('show'); renderCartDrawer(); };
  window.closeCartDrawer = function(){ $('cart-drawer')?.classList.remove('show'); $('drawer-overlay')?.classList.remove('show'); };
  window.applyDrawerDiscount = function(){
    const code = ($('drawer-discount')?.value || '').trim().toUpperCase();
    const msg = $('drawer-discount-message');
    if(code === 'FIT10'){ localStorage.setItem(DISCOUNT_KEY,'FIT10'); if(msg) msg.textContent = 'Discount applied: 10% off.'; }
    else { localStorage.removeItem(DISCOUNT_KEY); if(msg) msg.textContent = 'Invalid code. Try FIT10.'; }
    renderCartDrawer();
  };

  function wireCartIcon(){
    $$('.cart-icon-btn').forEach(btn => {
      if(btn.dataset.fitbrandWired) return;
      btn.dataset.fitbrandWired = '1';
      btn.addEventListener('click', function(e){
        if($('cart-drawer')){ e.preventDefault(); openCartDrawer(); }
      });
    });
  }

  function unlockFromUrl(){
    const params = new URLSearchParams(location.search);
    const purchased = params.get('purchased') || params.get('product_access');
    if(validProduct(purchased)){ addPurchase(purchased); }
    if(params.get('product') === 'mealplan' || params.get('purchased') === 'mealplan') localStorage.setItem('fitbrandMealPlanUnlocked','true');
  }

  function setupConfirmation(){
    if(!document.querySelector('.success-card')) return;
    const pending = safeParse(localStorage.getItem('fitbrandPendingOrder'), null);
    if(pending && validProduct(pending.product)){
      addPurchase(pending.product);
      const orders = safeParse(localStorage.getItem(ORDERS_KEY), []);
      if(!orders.some(o => o.id === pending.id)){
        orders.push({ id: pending.id, product: pending.product, email: pending.email, total: pending.total || PRODUCTS[pending.product].price, date: new Date().toISOString(), status: 'Confirmed demo' });
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      }
      localStorage.removeItem('fitbrandPendingOrder');
    }
  }

  function setupCheckout(){
    const payButton = $('stripe-link');
    const emailInput = document.querySelector('.checkout-right input[type="email"], input[type="email"]');
    const policy = $('accept-policies');
    if(!payButton || !emailInput || !policy) return;

    function getCheckoutProduct(){
      const params = new URLSearchParams(location.search);
      if(params.get('cart') === 'true') return 'bundle';
      const p = params.get('product') || 'bundle';
      return validProduct(p) ? p : 'bundle';
    }

    function validate(){
      const ok = emailInput.value.trim().includes('@') && policy.checked;
      payButton.classList.toggle('btn-disabled', !ok);
      return ok;
    }
    emailInput.addEventListener('input', validate);
    policy.addEventListener('change', validate);
    validate();

    payButton.addEventListener('click', function(e){
      if(!validate()){
        e.preventDefault();
        alert('Please enter your email and accept the policies first.');
        return;
      }
      const email = emailInput.value.trim();
      const user = getUser();
      if(!user){
        const name = email.split('@')[0].replace(/[._-]+/g,' ').replace(/\b\w/g, c => c.toUpperCase());
        saveFitBrandUser({ name, email }, true);
      } else if(!user.email){
        saveFitBrandUser(Object.assign({}, user, { email }), true);
      }
      const product = getCheckoutProduct();
      const pending = { id:'FB-' + Date.now(), product, email, date:new Date().toISOString(), total: PRODUCTS[product]?.price || 0 };
      localStorage.setItem('fitbrandPendingOrder', JSON.stringify(pending));
    });
  }

  function setupProfilePage(){
    const form = $('fullProfileForm');
    if(!form || form.dataset.fitbrandWired) return;
    form.dataset.fitbrandWired = '1';
    const user = getUser() || {};
    const map = {
      pfName:'name', pfEmail:'email', pfPhone:'phone', pfAddress:'address', pfGender:'gender', pfAge:'age', pfWeight:'weight', pfHeight:'height', pfLevel:'level', pfTrainingLocation:'trainingLocation', pfTrainingDays:'trainingDays', pfEquipment:'equipment', pfAllergies:'allergies', pfGoal:'goal'
    };
    Object.entries(map).forEach(([id, key]) => { const el = $(id); if(el && user[key]) el.value = user[key]; });
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const data = {};
      Object.entries(map).forEach(([id, key]) => { const el = $(id); if(el) data[key] = el.value.trim(); });
      if(!data.name || !data.email || !data.email.includes('@')){ alert('Please add a valid name and email.'); return; }
      saveFitBrandUser(data, true);
      location.href = 'index.html';
    });
  }

  function setupAccountPages(){
    const accessGrid = $('accessGrid');
    const ordersList = $('ordersList');
    if(!accessGrid && !ordersList) return;
    const user = getUser();
    const locked = $('accountLocked');
    if(locked) locked.style.display = user ? 'none' : 'grid';
    const intro = $('accountIntro');
    if(intro) intro.textContent = user ? `Logged in as ${user.email || user.name}.` : 'Log in to see your saved product access and orders on this device.';
    if(accessGrid){
      const purchases = getPurchases();
      accessGrid.innerHTML = Object.entries(PRODUCTS).filter(([key]) => key !== 'belt' && key !== 'straps').map(([key,p]) => {
        const has = purchases.includes(key) || (key === 'mealplan' && purchases.includes('bundle'));
        return `<div class="access-card ${has ? '' : 'locked'}"><strong>${escapeHtml(p.name)}</strong><span>${has ? 'You have access.' : 'You do not have access yet.'}</span><a href="${has ? p.open : p.buy}">${has ? 'Open' : 'Buy access'}</a></div>`;
      }).join('');
    }
    if(ordersList){
      const orders = safeParse(localStorage.getItem(ORDERS_KEY), []);
      ordersList.innerHTML = orders.length ? orders.map(o => `<div class="order-row"><div><strong>${escapeHtml(productName(o.product))}</strong><br><span>${new Date(o.date).toLocaleString()} • ${escapeHtml(o.status || 'Confirmed')}</span></div><a class="btn-outline" href="${PRODUCTS[o.product]?.open || 'index.html'}">Open</a></div>`).join('') : '<p>No orders saved on this device yet.</p>';
    }
  }

  function prefillGeneratorsFromProfile(showNoticeOnUse){
    const user = getUser();
    if(!user) return;
    const pairs = [
      ['mealAge','age'], ['mealGender','gender'], ['mealWeight','weight'], ['mealHeight','height'], ['mealTrainingDays','trainingDays'], ['mealAvoid','allergies'], ['mealGoal','goal'],
      ['modalAge','age'], ['modalGender','gender'], ['modalWeight','weight'], ['modalHeight','height'], ['modalPlace','trainingLocation'], ['modalDays','trainingDays'], ['modalLevel','level']
    ];
    pairs.forEach(([id, key]) => { const el = $(id); if(el && user[key] && !el.value) el.value = user[key]; });
    if(showNoticeOnUse) showNotice('Profile details filled in');
  }
  window.prefillGeneratorsFromProfile = prefillGeneratorsFromProfile;

  function ensureMealUnlocked(){
    if(getPurchases().includes('mealplan') || getPurchases().includes('bundle')) localStorage.setItem('fitbrandMealPlanUnlocked','true');
    const unlocked = localStorage.getItem('fitbrandMealPlanUnlocked') === 'true';
    if(unlocked){
      $('meal-plan-ai')?.classList.add('unlocked');
      $('mealGenerator')?.classList.add('show');
    }
    return unlocked;
  }

  window.handleMealPreviewClick = function(){
    if(ensureMealUnlocked()) openMealPlanGenerator();
    else { $('meal-plan-guide-ai')?.scrollIntoView({ behavior:'smooth', block:'start' }); showNotice('Meal Plan AI unlocks after purchase'); }
  };
  window.openMealPlanGenerator = function(){
    const box = $('meal-plan-ai');
    if(!box) return;
    box.classList.add('unlocked');
    $('mealGenerator')?.classList.add('show');
    setupMealWizard();
    prefillGeneratorsFromProfile(false);
    box.scrollIntoView({ behavior:'smooth', block:'start' });
  };

  function setValue(id, value){ const el = $(id); if(el) el.value = value; }
  function getValue(id){ return ($(id)?.value || '').trim(); }

  function setupMealWizard(){
    const gen = $('mealGenerator');
    const realGrid = gen?.querySelector('.meal-grid');
    if(!gen || !realGrid || $('fitbrandMealWizard')) return;
    realGrid.style.display = 'none';
    const oldBtn = gen.querySelector('.meal-generate-btn');
    if(oldBtn) oldBtn.style.display = 'none';

    const user = getUser();
    const wizard = document.createElement('div');
    wizard.id = 'fitbrandMealWizard';
    wizard.className = 'fb-meal-wizard';
    wizard.innerHTML = `
      <div class="fb-meal-profile-summary">
        <div><strong>${user ? 'Profile connected' : 'No profile connected'}</strong><span>${user ? 'You can use your saved profile details or change them for this plan.' : 'You can still create a meal plan, or sign in to save details for next time.'}</span></div>
        <div class="fb-meal-profile-actions"><button type="button" id="mealUseProfile" ${user ? '' : 'disabled'}>Use profile</button><a href="profile.html">Change information</a></div>
      </div>
      <div class="fb-meal-wizard-head"><div><h3>Meal Plan Builder</h3><p>Click through the steps. No long messy form.</p></div><span id="mealStepPill">1 / 6</span></div>
      <div class="fb-meal-progress"><span id="mealProgressFill"></span></div>
      <div class="fb-meal-step active" data-step="1"><h4>What is your goal?</h4><div class="fb-meal-options"><button data-field="mealGoal" data-value="fatloss" type="button"><strong>Lose fat</strong><span>Lower calories and high protein.</span></button><button data-field="mealGoal" data-value="muscle" type="button"><strong>Build muscle</strong><span>More calories for growth.</span></button><button data-field="mealGoal" data-value="maintenance" type="button"><strong>Maintain</strong><span>Clean eating and stable weight.</span></button></div></div>
      <div class="fb-meal-step" data-step="2"><h4>Your details</h4><div class="fb-meal-mini-form"><input id="wizAge" type="number" placeholder="Age"><select id="wizGender"><option value="">Gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select><input id="wizWeight" type="number" placeholder="Weight kg"><input id="wizHeight" type="number" placeholder="Height cm"></div></div>
      <div class="fb-meal-step" data-step="3"><h4>Training activity</h4><div class="fb-meal-options"><button data-field="mealTrainingDays" data-value="0" type="button"><strong>0-1 days</strong><span>Light activity</span></button><button data-field="mealTrainingDays" data-value="3" type="button"><strong>2-3 days</strong><span>Moderate routine</span></button><button data-field="mealTrainingDays" data-value="5" type="button"><strong>4-5 days</strong><span>Consistent gym routine</span></button><button data-field="mealTrainingDays" data-value="6" type="button"><strong>6+ days</strong><span>Very active</span></button></div></div>
      <div class="fb-meal-step" data-step="4"><h4>Food style</h4><div class="fb-meal-options"><button data-field="mealDiet" data-value="normal" type="button"><strong>Balanced</strong><span>Flexible normal food.</span></button><button data-field="mealDiet" data-value="highprotein" type="button"><strong>High protein</strong><span>Protein-focused meals.</span></button><button data-field="mealDiet" data-value="budget" type="button"><strong>Budget</strong><span>Cheap and simple.</span></button><button data-field="mealDiet" data-value="easy" type="button"><strong>Fast meals</strong><span>Low cooking time.</span></button><button data-field="mealDiet" data-value="vegetarian" type="button"><strong>Vegetarian</strong><span>No meat.</span></button></div></div>
      <div class="fb-meal-step" data-step="5"><h4>Meals per day</h4><div class="fb-meal-options"><button data-field="mealMeals" data-value="3" type="button"><strong>3 meals</strong><span>Simple structure</span></button><button data-field="mealMeals" data-value="4" type="button"><strong>4 meals</strong><span>Balanced day</span></button><button data-field="mealMeals" data-value="5" type="button"><strong>5 meals</strong><span>More planned meals</span></button></div></div>
      <div class="fb-meal-step" data-step="6"><h4>Final details</h4><div class="fb-meal-mini-form"><select id="wizStyle"><option value="balanced">Balanced</option><option value="lowcalorie">Low calorie</option><option value="bulking">Bulking</option><option value="simple">Very simple</option></select><select id="wizTime"><option value="normal">Normal cooking</option><option value="fast">Under 15 min</option><option value="prep">Meal prep friendly</option></select><input id="wizAvoid" class="wide" placeholder="Foods to avoid / allergies"></div><button id="mealFinalGenerate" type="button" class="fb-meal-generate-final">Generate my 7-day meal plan</button></div>
      <div class="fb-meal-choice-actions"><button id="mealBackBtn" type="button">Back</button><button id="mealNextBtn" type="button">Next</button></div>
    `;
    gen.insertBefore(wizard, realGrid);
    let step = 1;

    function useProfile(){
      const u = getUser() || {};
      const map = { wizAge:'age', wizGender:'gender', wizWeight:'weight', wizHeight:'height', wizAvoid:'allergies' };
      Object.entries(map).forEach(([id,key]) => { if($(id) && u[key]) $(id).value = u[key]; });
      if(u.goal) selectOption('mealGoal', u.goal);
      if(u.trainingDays) selectOption('mealTrainingDays', u.trainingDays);
      sync();
    }
    function selectOption(field, value){
      setValue(field, value);
      $$('#fitbrandMealWizard [data-field="'+field+'"]').forEach(btn => btn.classList.toggle('selected', btn.dataset.value === String(value)));
    }
    function sync(){
      setValue('mealAge', getValue('wizAge'));
      setValue('mealGender', getValue('wizGender'));
      setValue('mealWeight', getValue('wizWeight'));
      setValue('mealHeight', getValue('wizHeight'));
      setValue('mealAvoid', getValue('wizAvoid'));
      setValue('mealStyle', getValue('wizStyle') || 'balanced');
      setValue('mealTime', getValue('wizTime') || 'normal');
      if(!getValue('mealDiet')) setValue('mealDiet','normal');
      if(!getValue('mealMeals')) setValue('mealMeals','4');
      setValue('mealActivity','normal');
      setValue('mealDifficulty','easy');
    }
    function render(){
      $$('#fitbrandMealWizard .fb-meal-step').forEach(panel => panel.classList.toggle('active', Number(panel.dataset.step) === step));
      $('mealStepPill').textContent = `${step} / 6`;
      $('mealProgressFill').style.width = (step / 6 * 100) + '%';
      $('mealBackBtn').style.visibility = step === 1 ? 'hidden' : 'visible';
      $('mealNextBtn').style.display = step === 6 ? 'none' : 'inline-flex';
      sync();
    }
    wizard.addEventListener('click', function(e){
      const btn = e.target.closest('button');
      if(!btn) return;
      if(btn.id === 'mealUseProfile'){ useProfile(); step = 2; render(); return; }
      if(btn.dataset.field){ selectOption(btn.dataset.field, btn.dataset.value); return; }
      if(btn.id === 'mealFinalGenerate'){
        sync();
        if(typeof window.generateMealPlan === 'function') window.generateMealPlan();
        else alert('Meal generator is missing.');
      }
    });
    $('mealBackBtn').addEventListener('click', () => { if(step > 1){ step--; render(); } });
    $('mealNextBtn').addEventListener('click', () => { sync(); if(step < 6){ step++; render(); } });
    useProfile();
    render();
  }

  function availableProgramTracks(){
    const p = getPurchases();
    if(p.includes('bundle')) return PROGRAMS.slice();
    const owned = PROGRAMS.filter(x => p.includes(x));
    return owned.length ? owned : [];
  }

  function setupProgramTrackPanel(){
    const body = document.querySelector('#fitbrandGeneratorModal .fb-modal-body');
    if(!body) return;
    let panel = $('fbProgramTrackPanel');
    if(panel) panel.remove();
    const allowed = availableProgramTracks();
    const current = allowed[0] || 'aesthetic';
    const copy = {
      aesthetic:['Aesthetic AI','For symmetry, upper body shape, hypertrophy and visual proportions.'],
      shred:['Shred AI','For fat loss, conditioning, steps and muscle retention.'],
      strength:['Strength AI','For heavier lifts, progression, performance and strength skill.']
    };
    panel = document.createElement('div');
    panel.id = 'fbProgramTrackPanel';
    panel.className = 'fb-program-track-panel';
    panel.innerHTML = `<h3>Choose your unlocked AI track</h3><p>${allowed.length > 1 ? 'Bundle unlocked: choose which program AI you want to generate.' : 'This AI is customized to the program you purchased.'}</p><div class="fb-program-track-options">${allowed.map(key => `<button type="button" data-track="${key}" class="${key === current ? 'selected' : ''}"><strong>${copy[key][0]}</strong><span>${copy[key][1]}</span></button>`).join('')}</div>`;
    body.insertBefore(panel, body.firstChild);
    setValue('modalPackage', current);
    const goal = $('modalGoal');
    if(goal) goal.value = current === 'shred' ? 'fatloss' : current === 'strength' ? 'strength' : 'muscle';
    panel.addEventListener('click', function(e){
      const btn = e.target.closest('[data-track]');
      if(!btn) return;
      panel.querySelectorAll('[data-track]').forEach(x => x.classList.remove('selected'));
      btn.classList.add('selected');
      const track = btn.dataset.track;
      setValue('modalPackage', track);
      const g = $('modalGoal');
      if(g) g.value = track === 'shred' ? 'fatloss' : track === 'strength' ? 'strength' : 'muscle';
    });
  }

  window.openGeneratorModal = function(){
    const allowed = availableProgramTracks();
    if(!allowed.length){ alert('This generator unlocks after purchasing a FitBrand program or bundle.'); return; }
    $('fitbrandGeneratorModal')?.classList.add('show');
    prefillGeneratorsFromProfile(false);
    setupProgramTrackPanel();
  };
  window.closeGeneratorModal = function(){ $('fitbrandGeneratorModal')?.classList.remove('show'); };

  window.generateModalPlan = function(){
    const allowed = availableProgramTracks();
    if(!allowed.length){ alert('This generator unlocks after purchase.'); return; }
    let pkg = getValue('modalPackage') || allowed[0];
    if(pkg === 'bundle' || !allowed.includes(pkg)) pkg = allowed[0];
    const place = getValue('modalPlace') || getUser()?.trainingLocation || 'gym';
    const days = Math.max(3, Math.min(6, parseInt(getValue('modalDays') || getUser()?.trainingDays || '4', 10)));
    const level = getValue('modalLevel') || getUser()?.level || 'beginner';
    const library = PROGRAM_LIBRARY[pkg][place] || PROGRAM_LIBRARY[pkg].gym;
    const selected = library.slice(0, days);
    const titles = { aesthetic:'Aesthetic Program AI', shred:'Shred Program AI', strength:'Strength Program AI' };
    if($('modalPlanTitle')) $('modalPlanTitle').textContent = `Your ${titles[pkg]} Plan`;
    if($('modalPlanSubtitle')) $('modalPlanSubtitle').textContent = `Customized for your unlocked ${productName(pkg)}: ${days} days/week, ${place} training, ${level} level.`;
    if($('modalPlanPill')) $('modalPlanPill').textContent = `${days} DAYS / ${place.toUpperCase()}`;
    if($('modalPlanDays')) $('modalPlanDays').innerHTML = selected.map(day => `<div class="fb-plan-day"><h4>${escapeHtml(day[0])}</h4><ul>${day[1].map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ul></div>`).join('');
    const out = $('modalPlanOutput');
    if(out){
      out.classList.add('show');
      if(!$('programDownloadActions')){
        const actions = document.createElement('div');
        actions.id = 'programDownloadActions';
        actions.className = 'program-download-actions';
        actions.innerHTML = '<button type="button" onclick="downloadProgramPDF()">Download PDF</button><button type="button" onclick="downloadProgramPNG()">Download PNG</button>';
        out.appendChild(actions);
      }
      out.scrollIntoView({ behavior:'smooth', block:'nearest' });
    }
  };

  window.downloadProgramPDF = function(){
    const title = $('modalPlanTitle')?.textContent || 'FitBrand Training Plan';
    const subtitle = $('modalPlanSubtitle')?.textContent || '';
    const days = $$('.fb-plan-day').map(day => `${day.querySelector('h4')?.textContent || ''}\n${$$('li', day).map(li => '- ' + li.textContent).join('\n')}`).join('\n\n');
    const w = window.open('', '_blank');
    if(!w) return;
    w.document.write(`<html><head><title>${escapeHtml(title)}</title><style>body{font-family:Arial,sans-serif;padding:40px;line-height:1.55;color:#111}h1{font-size:34px;margin-bottom:8px}.brand{letter-spacing:2px;text-transform:uppercase;font-weight:900;color:#555}pre{white-space:pre-wrap;font-family:Arial,sans-serif;font-size:14px}</style></head><body><div class="brand">FitBrand</div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p><pre>${escapeHtml(days)}</pre><script>window.print();<\/script></body></html>`);
    w.document.close();
  };
  window.downloadProgramPNG = function(){
    alert('PNG export needs a screenshot/export library. PDF print/export is ready now.');
  };

  function enhanceBundleCard(){
    const card = document.querySelector('.fitbrand-bundle-offer');
    if(!card || card.dataset.fitbrandEnhanced) return;
    card.dataset.fitbrandEnhanced = '1';
    card.classList.add('bundle-offer-premium');
    const p = card.querySelector('p:nth-of-type(2)');
    if(p) p.textContent = 'Get Aesthetic, Shred, Strength and Meal Plan Guide AI in one bundle. Best value for customers who want the full FitBrand training and nutrition system.';
    if(!card.querySelector('.bundle-feature-grid')){
      const grid = document.createElement('div');
      grid.className = 'bundle-feature-grid';
      grid.innerHTML = '<span>3 premium programs</span><span>Meal Plan AI included</span><span>Best total value</span>';
      const actions = card.querySelector('a')?.parentElement || card;
      card.insertBefore(grid, card.querySelector('a'));
    }
  }

  function setupCartPage(){
    const container = $('cart-items');
    const totalEl = $('cart-total');
    if(!container || !totalEl) return;
    function render(){
      const cart = getCart();
      const groups = grouped(cart);
      const keys = Object.keys(groups);
      if(!keys.length){ container.innerHTML = '<p>Your cart is empty.</p>'; totalEl.textContent = money(0); return; }
      let subtotal = 0;
      container.innerHTML = keys.map(key => {
        const p = PRODUCTS[key];
        const qty = groups[key];
        subtotal += p.price * qty;
        return `<div class="cart-item"><div><strong>${escapeHtml(p.name)}</strong><br><span>FitBrand product</span><div class="qty-controls"><button class="qty-btn" onclick="changeQty('${key}',-1)">−</button><strong>${qty}</strong><button class="qty-btn" onclick="changeQty('${key}',1)">+</button></div></div><div class="cart-item-actions"><strong>${money(p.price * qty)}</strong><button class="remove-item-btn" onclick="removeProduct('${key}')">Remove</button></div></div>`;
      }).join('');
      const discount = localStorage.getItem(DISCOUNT_KEY) === 'FIT10' ? 0.10 : 0;
      totalEl.textContent = money(subtotal * (1 - discount));
      const link = $('checkout-link');
      if(link) link.href = 'checkout.html?cart=true';
    }
    window.changeQty = function(product, delta){
      const cart = getCart();
      if(delta > 0) cart.push(product);
      else {
        const i = cart.indexOf(product);
        if(i >= 0) cart.splice(i, 1);
      }
      saveCart(cart); render(); updateCartCount();
    };
    window.removeProduct = function(product){ saveCart(getCart().filter(x => x !== product)); render(); updateCartCount(); };
    window.applyCartDiscount = function(){
      const code = ($('cart-discount')?.value || '').trim().toUpperCase();
      const msg = $('cart-discount-message');
      if(code === 'FIT10'){ localStorage.setItem(DISCOUNT_KEY,'FIT10'); if(msg) msg.textContent = 'Discount applied: 10% off.'; }
      else { localStorage.removeItem(DISCOUNT_KEY); if(msg) msg.textContent = 'Invalid code. Try FIT10.'; }
      render();
    };
    render();
  }

  function showNotice(text){
    let n = $('fitbrandNotice');
    if(!n){ n = document.createElement('div'); n.id = 'fitbrandNotice'; n.className = 'fitbrand-notice'; document.body.appendChild(n); }
    n.textContent = text;
    n.classList.add('show');
    setTimeout(() => n.classList.remove('show'), 2200);
  }

  function escapeHtml(value){
    return String(value == null ? '' : value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }

  function init(){
    ensureHeader();
    ensureProfileModal();
    unlockFromUrl();
    setupConfirmation();
    updateFitBrandProfileUI();
    updateCartCount();
    wireCartIcon();
    setupCheckout();
    setupProfilePage();
    setupAccountPages();
    setupCartPage();
    ensureMealUnlocked();
    if($('mealGenerator') && ensureMealUnlocked()) setupMealWizard();
    prefillGeneratorsFromProfile(false);
    enhanceBundleCard();
    showWelcome();

    document.addEventListener('click', function(e){
      const menu = $('profileMenu');
      const btn = document.querySelector('.profile-icon-btn');
      if(menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) menu.classList.remove('show');
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
