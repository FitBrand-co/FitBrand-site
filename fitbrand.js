/* FitBrand global script: cart helpers, profile system, welcome choice, generator autofill and page polish. */
(function(){
  const USER_KEY = "fitbrandUser";
  const SESSION_USER_KEY = "fitbrandSessionUser";
  const WELCOME_KEY = "fitbrandWelcomeChoice";
  const WELCOME_SESSION_KEY = "fitbrandWelcomeSeenSession";
  const PURCHASED_KEY = "fitbrandPurchasedPackage";
  const PURCHASES_KEY = "fitbrandPurchases";
  const ORDERS_KEY = "fitbrandOrders";

  function safeJson(value, fallback){
    try { return value ? (JSON.parse(value) || fallback) : fallback; }
    catch(e){ return fallback; }
  }

  window.getFitBrandUser = function(){
    return safeJson(sessionStorage.getItem(SESSION_USER_KEY), null) || safeJson(localStorage.getItem(USER_KEY), null);
  };
  window.saveFitBrandUser = function(user, remember){
    const existing = getFitBrandUser() || {};
    const saved = Object.assign({}, existing, user || {});
    const rememberChoice = remember !== undefined ? !!remember : (document.getElementById('profileRememberInput')?.checked !== false);
    if(rememberChoice){
      localStorage.setItem(USER_KEY, JSON.stringify(saved));
      sessionStorage.removeItem(SESSION_USER_KEY);
    } else {
      sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(saved));
      localStorage.removeItem(USER_KEY);
    }
    localStorage.setItem(WELCOME_KEY, "login");
    sessionStorage.setItem(WELCOME_SESSION_KEY, "true");
    updateFitBrandProfileUI();
    prefillGeneratorsFromProfile();
    return saved;
  };

  function getInitial(user){
    if(!user || !user.name) return "?";
    const parts = user.name.trim().split(/\s+/).filter(Boolean);
    if(parts.length === 0) return "?";
    const first = parts[0].charAt(0).toUpperCase();
    const last = parts.length > 1 ? parts[parts.length - 1].charAt(0).toUpperCase() : "";
    return (first + last).slice(0, 2);
  }

  window.updateFitBrandProfileUI = function(){
    const user = getFitBrandUser();
    const initial = getInitial(user);
    document.querySelectorAll("#profileInitial,#profileMenuInitial,#profileViewInitial,#profileModalInitial").forEach(el => { if(el) el.textContent = initial; });
    document.querySelectorAll("#profileMenuName,#profileViewName").forEach(el => { if(el) el.textContent = user?.name || "Guest"; });
    document.querySelectorAll("#profileMenuEmail,#profileViewEmail").forEach(el => { if(el) el.textContent = user?.email || "Not logged in"; });
    const login = document.getElementById("profileLoginBtn");
    const logout = document.getElementById("profileLogoutBtn");
    if(login) login.style.display = user ? "none" : "block";
    if(logout) logout.style.display = user ? "block" : "none";
    document.querySelectorAll('.profile-menu-link').forEach(el => { el.style.display = user ? 'block' : 'none'; });
  };

  function ensureHeaderProfile(){
    const nav = document.querySelector("header.nav");
    if(!nav) return;
    let actions = nav.querySelector(".nav-actions");
    const cart = nav.querySelector(".cart-icon-btn");

    if(!actions){
      actions = document.createElement("div");
      actions.className = "nav-actions";
      if(cart){ cart.parentNode.insertBefore(actions, cart); actions.appendChild(cart); }
      else nav.appendChild(actions);
    }

    if(!actions.querySelector(".profile-icon-btn")){
      const btn = document.createElement("button");
      btn.className = "profile-icon-btn";
      btn.type = "button";
      btn.setAttribute("aria-label", "Profile");
      btn.innerHTML = '<span id="profileInitial">?</span>';
      btn.addEventListener("click", window.toggleProfileMenu);
      actions.appendChild(btn);
    }

    if(!document.getElementById("profileMenu")){
      const menu = document.createElement("div");
      menu.id = "profileMenu";
      menu.className = "profile-menu";
      menu.innerHTML = `
        <div class="profile-menu-head">
          <div class="profile-avatar"><span id="profileMenuInitial">?</span></div>
          <div><strong id="profileMenuName">Guest</strong><br><span id="profileMenuEmail">Not logged in</span></div>
        </div>
        <button type="button" onclick="openProfileModal('profile')">View profile</button>
        <a class="profile-menu-link" href="profile.html">Edit profile</a>
        <a class="profile-menu-link" href="account.html#products">My products</a>
        <a class="profile-menu-link" href="account.html#orders">My orders</a>
        <button id="profileLoginBtn" type="button" onclick="openProfileModal('login')">Log in</button>
        <button id="profileLogoutBtn" type="button" onclick="logoutFitBrandUser()">Log out</button>`;
      actions.appendChild(menu);
    }
  }

  function ensureProfileModal(){
    if(document.getElementById("profileModalOverlay")) return;
    const overlay = document.createElement("div");
    overlay.id = "profileModalOverlay";
    overlay.className = "profile-modal-overlay";
    overlay.addEventListener("click", window.closeProfileModal);
    overlay.innerHTML = `
      <div class="profile-modal" onclick="event.stopPropagation()">
        <button class="profile-modal-close" type="button" onclick="closeProfileModal()">×</button>
        <h2 id="profileModalTitle">Log in</h2>
        <p id="profileModalText">Save your FitBrand profile on this device. It will auto-fill the generators later.</p>
        <div id="profileViewBox" style="display:none;">
          <div class="profile-menu-head">
            <div class="profile-avatar"><span id="profileViewInitial">?</span></div>
            <div><strong id="profileViewName">Guest</strong><br><span id="profileViewEmail">Not logged in</span></div>
          </div>
          <a class="profile-main-btn" href="profile.html">Edit full profile</a>
        </div>
        <form id="profileForm" class="profile-form">
          <input id="profileNameInput" type="text" placeholder="Your name" autocomplete="name">
          <input id="profileEmailInput" type="email" placeholder="your@email.com" autocomplete="email">
          <label class="profile-remember-row"><input id="profileRememberInput" type="checkbox" checked> Remember my login on this device</label>
          <button class="profile-main-btn" type="submit">Save / log in</button>
          <button class="profile-google-btn" type="button" onclick="fakeGoogleLogin()">Continue with Google</button>
        </form>
      </div>`;
    document.body.appendChild(overlay);
  }

  function ensureWelcomeModal(){
    if(document.getElementById("fitbrandWelcomeOverlay")) return;
    const overlay = document.createElement("div");
    overlay.id = "fitbrandWelcomeOverlay";
    overlay.className = "fb-welcome-overlay";
    overlay.innerHTML = `
      <div class="fb-welcome-card">
        <div class="premium-badge">FitBrand Account</div>
        <h2>Welcome to FitBrand</h2>
        <p>Log in to save your profile details and let the AI tools auto-fill your age, gender, weight, height, goal and training setup. You can also continue as guest.</p>
        <div class="fb-welcome-actions">
          <button class="fb-welcome-primary" type="button" onclick="openProfileFromWelcome()">Log in</button>
          <button class="fb-welcome-secondary" type="button" onclick="continueAsGuest()">Continue as guest</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  }

  window.openProfileFromWelcome = function(){
    localStorage.setItem(WELCOME_KEY, "login");
    sessionStorage.setItem(WELCOME_SESSION_KEY, "true");
    document.getElementById("fitbrandWelcomeOverlay")?.classList.remove("show");
    openProfileModal("login");
  };

  window.continueAsGuest = function(){
    localStorage.setItem(WELCOME_KEY, "guest");
    sessionStorage.setItem(WELCOME_SESSION_KEY, "true");
    document.getElementById("fitbrandWelcomeOverlay")?.classList.remove("show");
  };

  window.toggleProfileMenu = function(){
    ensureHeaderProfile();
    document.getElementById("profileMenu")?.classList.toggle("show");
  };

  window.openProfileModal = function(mode){
    ensureProfileModal();
    document.getElementById("profileMenu")?.classList.remove("show");
    const modal = document.getElementById("profileModalOverlay");
    const form = document.getElementById("profileForm");
    const view = document.getElementById("profileViewBox");
    const title = document.getElementById("profileModalTitle");
    const text = document.getElementById("profileModalText");
    const user = getFitBrandUser();

    if(mode === "profile" && user){
      if(title) title.textContent = "Your Profile";
      if(text) text.textContent = "Your saved FitBrand account on this device.";
      if(form) form.style.display = "none";
      if(view) view.style.display = "block";
    } else {
      if(title) title.textContent = user ? "Edit Quick Login" : "Log in";
      if(text) text.textContent = "Save your name and email. Full fitness details can be edited on the profile page.";
      if(form) form.style.display = "grid";
      if(view) view.style.display = "none";
      const name = document.getElementById("profileNameInput");
      const email = document.getElementById("profileEmailInput");
      if(name) name.value = user?.name || "";
      if(email) email.value = user?.email || "";
    }

    updateFitBrandProfileUI();
    modal?.classList.add("show");
  };

  window.closeProfileModal = function(){
    document.getElementById("profileModalOverlay")?.classList.remove("show");
  };

  window.logoutFitBrandUser = function(){
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(SESSION_USER_KEY);
    localStorage.removeItem(WELCOME_KEY);
    sessionStorage.removeItem(WELCOME_SESSION_KEY);
    updateFitBrandProfileUI();
    document.getElementById("profileMenu")?.classList.remove("show");
    document.getElementById("profileModalOverlay")?.classList.remove("show");
    document.getElementById("fitbrandWelcomeOverlay")?.classList.remove("show");
    if(location.pathname.endsWith('profile.html')){
      setTimeout(() => { location.href = 'index.html'; }, 150);
    }
  };

    window.fakeGoogleLogin = function(){
    const email = prompt("Enter your Google email:");
    if(!email) return;
    const rawName = email.split("@")[0].replace(/[._-]/g, " ").trim();
    const name = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : "FitBrand User";
    saveFitBrandUser({name, email}, true);
    closeProfileModal();
  };

  function setupProfileForm(){
    const form = document.getElementById("profileForm");
    if(!form || form.dataset.bound === "true") return;
    form.dataset.bound = "true";
    form.addEventListener("submit", function(e){
      e.preventDefault();
      const name = (document.getElementById("profileNameInput")?.value || "").trim();
      const email = (document.getElementById("profileEmailInput")?.value || "").trim();
      if(!name || !email){ alert("Enter name and email"); return; }
      saveFitBrandUser({name, email}, document.getElementById('profileRememberInput')?.checked !== false);
      closeProfileModal();
    });
  }

  window.prefillGeneratorsFromProfile = function(){
    const user = getFitBrandUser();
    if(!user) return;
    const map = {
      mealAge:user.age, mealGender:user.gender, mealWeight:user.weight, mealHeight:user.height, mealTrainingDays:user.trainingDays, mealAvoid:user.allergies,
      modalAge:user.age, modalGender:user.gender, modalWeight:user.weight, modalHeight:user.height, modalLevel:user.level, modalPlace:user.trainingLocation, modalDays:user.trainingDays,
      genAge:user.age, genGender:user.gender, genWeight:user.weight, genHeight:user.height, genLevel:user.level, genPlace:user.trainingLocation, genDays:user.trainingDays
    };
    Object.entries(map).forEach(([id,val]) => {
      const el = document.getElementById(id);
      if(el && val !== undefined && val !== null && val !== "") el.value = val;
    });
    if(user.goal){
      const mealGoal = document.getElementById("mealGoal");
      if(mealGoal){ mealGoal.value = user.goal === "strength" ? "muscle" : user.goal; }
      const modalGoal = document.getElementById("modalGoal");
      if(modalGoal){ modalGoal.value = user.goal === "maintenance" ? "muscle" : user.goal; }
    }
  };

  function maybeShowWelcome(){
    ensureWelcomeModal();
    if(!getFitBrandUser() && !sessionStorage.getItem(WELCOME_SESSION_KEY)){
      setTimeout(() => document.getElementById("fitbrandWelcomeOverlay")?.classList.add("show"), 500);
    }
  }

  function setupMealChoiceWizard(){
    const target = document.querySelector("#meal-plan-ai .meal-generator");
    if(!target || document.getElementById("fbMealChoicePanel")) return;
    const panel = document.createElement("div");
    panel.id = "fbMealChoicePanel";
    panel.className = "fb-meal-choice-panel fb-meal-choice-panel-pro";
    panel.innerHTML = `
      <div class="fb-meal-choice-head">
        <div><h3>Step-by-step Meal Plan AI</h3><p>Click through the cards. Your saved profile can fill the boring stuff automatically.</p></div>
        <div id="fbMealStepPill" class="fb-meal-step-pill">1 / 6</div>
      </div>
      <div class="fb-meal-question active" data-step="1">
        <h4>Start with profile info</h4>
        <div class="fb-meal-wizard-note">Log in or save your profile to skip repeated fields.</div>
        <div class="fb-meal-options">
          <button class="fb-meal-option" type="button" data-action="use-profile"><strong>Use saved profile</strong><span>Auto-fill age, gender, weight, height and training days.</span></button>
          <a class="fb-meal-option" href="profile.html"><strong>Change profile</strong><span>Edit name, address, phone, gender, weight and more.</span></a>
          <button class="fb-meal-option" type="button" data-action="manual"><strong>Enter manually</strong><span>Use different information for this plan.</span></button>
        </div>
      </div>
      <div class="fb-meal-question" data-step="2"><h4>What is your goal?</h4><div class="fb-meal-options"><button class="fb-meal-option" data-field="mealGoal" data-value="fatloss"><strong>Lose fat</strong><span>High protein and controlled calories.</span></button><button class="fb-meal-option" data-field="mealGoal" data-value="muscle"><strong>Build muscle</strong><span>More calories for growth.</span></button><button class="fb-meal-option" data-field="mealGoal" data-value="maintenance"><strong>Maintain</strong><span>Clean eating and balance.</span></button></div></div>
      <div class="fb-meal-question" data-step="3"><h4>Your body info</h4><div class="fb-meal-mini-form"><input id="fbWizAge" type="number" placeholder="Age"><select id="fbWizGender"><option value="">Gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select><input id="fbWizWeight" type="number" placeholder="Weight kg"><input id="fbWizHeight" type="number" placeholder="Height cm"></div></div>
      <div class="fb-meal-question" data-step="4"><h4>Training and meals</h4><div class="fb-meal-options"><button class="fb-meal-option" data-field="mealTrainingDays" data-value="3"><strong>2-3 days</strong><span>Simple routine.</span></button><button class="fb-meal-option" data-field="mealTrainingDays" data-value="5"><strong>4-5 days</strong><span>Balanced progress.</span></button><button class="fb-meal-option" data-field="mealTrainingDays" data-value="6"><strong>6+ days</strong><span>High consistency.</span></button></div><div class="fb-meal-options compact"><button class="fb-meal-option" data-field="mealMeals" data-value="3">3 meals</button><button class="fb-meal-option" data-field="mealMeals" data-value="4">4 meals</button><button class="fb-meal-option" data-field="mealMeals" data-value="5">5 meals</button></div></div>
      <div class="fb-meal-question" data-step="5"><h4>Food style</h4><div class="fb-meal-options"><button class="fb-meal-option" data-field="mealDiet" data-value="highprotein"><strong>High protein</strong><span>Best for results.</span></button><button class="fb-meal-option" data-field="mealDiet" data-value="budget"><strong>Budget</strong><span>Cheaper meals.</span></button><button class="fb-meal-option" data-field="mealDiet" data-value="vegetarian"><strong>Vegetarian</strong><span>No meat.</span></button><button class="fb-meal-option" data-field="mealDiet" data-value="easy"><strong>Easy meals</strong><span>Fast and simple.</span></button></div></div>
      <div class="fb-meal-question" data-step="6"><h4>Final details</h4><div class="fb-meal-mini-form"><select id="fbWizTime"><option value="normal">Normal cooking time</option><option value="fast">Under 15 min</option><option value="prep">Meal prep friendly</option></select><select id="fbWizDifficulty"><option value="easy">Easy to follow</option><option value="flexible">Flexible lifestyle</option><option value="strict">Strict / precise</option></select><input id="fbWizAvoid" class="wide" placeholder="Foods to avoid / allergies"></div><button class="fb-meal-generate-final" type="button" onclick="generateMealPlan()">Generate my 7-day meal plan</button></div>
      <div class="fb-meal-choice-actions"><button class="fb-meal-back" type="button" id="fbMealBack">Back</button><button class="fb-meal-next" type="button" id="fbMealNext">Next</button></div>`;
    target.insertBefore(panel, target.firstChild);
    const grid = document.querySelector('#meal-plan-ai .meal-grid');
    if(grid) grid.classList.add('fb-meal-grid-collapsed');
    let step = 1;
    function setVal(id, val){ const el = document.getElementById(id); if(el && val !== undefined && val !== null) el.value = val; }
    function syncWizardToReal(){
      setVal('mealAge', document.getElementById('fbWizAge')?.value || document.getElementById('mealAge')?.value || '');
      setVal('mealGender', document.getElementById('fbWizGender')?.value || document.getElementById('mealGender')?.value || '');
      setVal('mealWeight', document.getElementById('fbWizWeight')?.value || document.getElementById('mealWeight')?.value || '');
      setVal('mealHeight', document.getElementById('fbWizHeight')?.value || document.getElementById('mealHeight')?.value || '');
      setVal('mealTime', document.getElementById('fbWizTime')?.value || 'normal');
      setVal('mealDifficulty', document.getElementById('fbWizDifficulty')?.value || 'easy');
      setVal('mealAvoid', document.getElementById('fbWizAvoid')?.value || document.getElementById('mealAvoid')?.value || '');
    }
    window.syncMealWizardToReal = syncWizardToReal;
    function fillWizardFromProfile(){
      const user = getFitBrandUser(); if(!user) return false;
      setVal('fbWizAge', user.age || ''); setVal('fbWizGender', user.gender || ''); setVal('fbWizWeight', user.weight || ''); setVal('fbWizHeight', user.height || ''); setVal('fbWizAvoid', user.allergies || '');
      if(user.trainingDays) setVal('mealTrainingDays', user.trainingDays);
      if(user.goal) setVal('mealGoal', user.goal === 'strength' ? 'muscle' : user.goal);
      syncWizardToReal(); return !!(user.age && user.gender && user.weight && user.height);
    }
    function render(){
      panel.querySelectorAll('.fb-meal-question').forEach(q => q.classList.toggle('active', Number(q.dataset.step) === step));
      const pill = document.getElementById('fbMealStepPill'); if(pill) pill.textContent = step + ' / 6';
      const back=document.getElementById('fbMealBack'), next=document.getElementById('fbMealNext');
      if(back) back.style.visibility = step === 1 ? 'hidden' : 'visible'; if(next) next.style.display = step === 6 ? 'none' : 'inline-flex'; syncWizardToReal();
    }
    panel.querySelectorAll('input, select').forEach(el => el.addEventListener('input', syncWizardToReal));
    panel.querySelectorAll('.fb-meal-option').forEach(btn => btn.addEventListener('click', () => {
      if(btn.tagName === 'A') return; const action = btn.dataset.action;
      if(action === 'use-profile'){ if(!fillWizardFromProfile()){ alert('Save your profile first, or enter the details manually.'); return; } btn.closest('.fb-meal-question').querySelectorAll('.fb-meal-option').forEach(b => b.classList.remove('selected')); btn.classList.add('selected'); step = 2; render(); return; }
      if(action === 'manual'){ btn.classList.add('selected'); step = 2; render(); return; }
      if(btn.dataset.field){ const el = document.getElementById(btn.dataset.field); if(el) el.value = btn.dataset.value; }
      const q = btn.closest('.fb-meal-question'); q.querySelectorAll('.fb-meal-option').forEach(b => b.classList.remove('selected')); btn.classList.add('selected'); syncWizardToReal();
    }));
    document.getElementById('fbMealBack')?.addEventListener('click', () => { if(step > 1){ step--; render(); } });
    document.getElementById('fbMealNext')?.addEventListener('click', () => { if(step < 6){ step++; render(); } });
    fillWizardFromProfile(); render();
  }


  function profileHasMealBasics(user){
    return !!(user && user.age && user.gender && user.weight && user.height && user.trainingDays);
  }

  window.useProfileForMealPlan = function(){
    prefillGeneratorsFromProfile();
    const grid = document.querySelector('#meal-plan-ai .meal-grid');
    const summary = document.getElementById('fbMealProfileSummary');
    if(grid) grid.classList.add('fb-meal-grid-collapsed');
    if(summary) summary.classList.add('using-profile');
  };

  window.changeMealInformation = function(){
    const grid = document.querySelector('#meal-plan-ai .meal-grid');
    if(grid){
      grid.classList.remove('fb-meal-grid-collapsed');
      grid.scrollIntoView({behavior:'smooth', block:'start'});
    }
  };

  window.handleMealPreviewClick = function(){
    localStorage.setItem('fitbrandMealPlanUnlocked', 'true');
    const generator = document.getElementById('meal-plan-ai');
    if(generator){
      generator.classList.add('unlocked');
      document.getElementById('mealGenerator')?.classList.add('show');
      prefillGeneratorsFromProfile();
      setupMealChoiceWizard();
      setupMealProfileSmartMode();
      generator.scrollIntoView({behavior:'smooth', block:'start'});
    }
  };

  function setupMealProfileSmartMode(){
    const generator = document.querySelector('#meal-plan-ai .meal-generator');
    if(!generator || document.getElementById('fbMealProfileSummary')) return;
    const user = getFitBrandUser();
    const profileOk = profileHasMealBasics(user);
    const box = document.createElement('div');
    box.id = 'fbMealProfileSummary';
    box.className = 'fb-meal-profile-summary' + (profileOk ? ' using-profile' : '');
    box.innerHTML = `
      <div>
        <strong>${profileOk ? 'Using your saved profile' : 'Profile info missing'}</strong>
        <span>${profileOk ? `${user.age} years • ${user.gender || 'gender'} • ${user.weight}kg • ${user.height}cm • ${user.trainingDays} training days/week` : 'Save your profile to skip age, gender, weight, height and training days next time.'}</span>
      </div>
      <div class="fb-meal-profile-actions">
        ${profileOk ? '<button type="button" onclick="useProfileForMealPlan()">Use saved profile</button>' : '<a href="profile.html">Complete profile</a>'}
        <button type="button" onclick="changeMealInformation()">Change information</button>
      </div>`;
    const choicePanel = document.getElementById('fbMealChoicePanel');
    generator.insertBefore(box, choicePanel ? choicePanel.nextSibling : generator.firstChild);
    if(profileOk){
      prefillGeneratorsFromProfile();
      const grid = document.querySelector('#meal-plan-ai .meal-grid');
      if(grid) grid.classList.add('fb-meal-grid-collapsed');
    }
  }

  function unlockFromUrl(){
    const params = new URLSearchParams(location.search);
    const purchased = params.get("purchased") || params.get("product");
    if(purchased === "mealplan") localStorage.setItem("fitbrandMealPlanUnlocked", "true");
    if(["aesthetic","shred","strength","bundle"].includes(purchased)) localStorage.setItem(PURCHASED_KEY, purchased);
  }

  function revealSetup(){
    document.querySelectorAll(".section,.split,.review-section,.email-signup,.product-detail-section,.cart-page,.checkout,.profile-page").forEach(el => el.classList.add("reveal"));
    if(!("IntersectionObserver" in window)){
      document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){ entry.target.classList.add("visible"); observer.unobserve(entry.target); }
      });
    }, {threshold:0.12});
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
  }

  function signupSetup(){
    const signup = document.getElementById("fitbrand-signup-form");
    if(!signup || signup.dataset.bound === "true") return;
    signup.dataset.bound = "true";
    signup.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("fitbrand-email")?.value || "";
      const msg = document.getElementById("signup-message");
      if(!email.includes("@")){ if(msg) msg.textContent = "Please enter a valid email."; return; }
      const list = safeJson(localStorage.getItem("fitbrandEmailList"), []);
      if(!list.includes(email)) list.push(email);
      localStorage.setItem("fitbrandEmailList", JSON.stringify(list));
      if(msg) msg.textContent = "You're in. Connect this form to your email platform when ready.";
      signup.reset();
    });
  }

  function updateHeaderScroll(){
    const nav = document.querySelector(".nav");
    if(!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 180);
  }

  document.addEventListener("DOMContentLoaded", function(){
    ensureHeaderProfile();
    ensureProfileModal();
    setupProfileForm();
    updateFitBrandProfileUI();
    maybeShowWelcome();
    unlockFromUrl();
    prefillGeneratorsFromProfile();
    setupMealChoiceWizard();
    setupMealProfileSmartMode();
    revealSetup();
    signupSetup();
    updateHeaderScroll();

    document.addEventListener("click", function(e){
      const menu = document.getElementById("profileMenu");
      const btn = document.querySelector(".profile-icon-btn");
      if(menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) menu.classList.remove("show");
    });
  });

  window.addEventListener("scroll", updateHeaderScroll, {passive:true});
})();


/* ===== FITBRAND V4 HARD FIXES: reliable profile/login/welcome/checkout/meal AI ===== */
(function(){
  const USER_KEY='fitbrandUser';
  const SESSION_KEY='fitbrandSessionUser';
  const WELCOME_SESSION='fitbrandWelcomeSeenSession';
  function read(k, ss){ try{return JSON.parse((ss?sessionStorage:localStorage).getItem(k)||'null')}catch(e){return null} }
  function write(k,v,ss){ (ss?sessionStorage:localStorage).setItem(k, JSON.stringify(v)); }
  function user(){ return read(SESSION_KEY,true) || read(USER_KEY,false); }
  function initials(u){
    if(!u || !u.name) return '?';
    const p=String(u.name).trim().split(/\s+/).filter(Boolean);
    if(!p.length) return '?';
    return ((p[0][0]||'') + (p.length>1 ? (p[p.length-1][0]||'') : '')).toUpperCase();
  }
  function qsa(sel){ return Array.from(document.querySelectorAll(sel)); }
  function ensureHeader(){
    const nav=document.querySelector('header.nav'); if(!nav) return;
    let actions=nav.querySelector('.nav-actions');
    const cart=nav.querySelector('.cart-icon-btn');
    if(!actions){ actions=document.createElement('div'); actions.className='nav-actions'; if(cart){cart.parentNode.insertBefore(actions,cart);actions.appendChild(cart);} else nav.appendChild(actions); }
    if(!actions.querySelector('.profile-icon-btn')){
      const b=document.createElement('button'); b.className='profile-icon-btn'; b.type='button'; b.setAttribute('aria-label','Profile'); b.innerHTML='<span id="profileInitial">?</span>'; b.onclick=()=>window.toggleProfileMenu(); actions.appendChild(b);
    }
    if(!actions.querySelector('#profileMenu')){
      const m=document.createElement('div'); m.id='profileMenu'; m.className='profile-menu';
      m.innerHTML=`<div class="profile-menu-head"><div class="profile-avatar"><span id="profileMenuInitial">?</span></div><div><strong id="profileMenuName">Guest</strong><br><span id="profileMenuEmail">Not logged in</span></div></div><button type="button" onclick="openProfileModal('profile')">View profile</button><a class="profile-menu-link" href="profile.html">Edit profile</a><a class="profile-menu-link" href="account.html#products">My products</a><a class="profile-menu-link" href="account.html#orders">My orders</a><button id="profileLoginBtn" type="button" onclick="openProfileModal('login')">Log in</button><button id="profileLogoutBtn" type="button" onclick="logoutFitBrandUser()">Log out</button>`;
      actions.appendChild(m);
    }
  }
  function ensureModernModal(){
    let overlay=document.getElementById('profileModalOverlay');
    if(!overlay){
      overlay=document.createElement('div'); overlay.id='profileModalOverlay'; overlay.className='profile-modal-overlay'; overlay.onclick=()=>window.closeProfileModal();
      overlay.innerHTML=`<div class="profile-modal" onclick="event.stopPropagation()"><button class="profile-modal-close" type="button" onclick="closeProfileModal()">×</button><h2 id="profileModalTitle">Log in</h2><p id="profileModalText">Save your login on this device.</p><div id="profileViewBox" style="display:none;"><div class="profile-menu-head"><div class="profile-avatar"><span id="profileViewInitial">?</span></div><div><strong id="profileViewName">Guest</strong><br><span id="profileViewEmail">Not logged in</span></div></div><a class="profile-main-btn" href="profile.html">Edit full profile</a></div><form id="profileForm" class="profile-form"><input id="profileNameInput" type="text" placeholder="Your name" autocomplete="name"><input id="profileEmailInput" type="email" placeholder="your@email.com" autocomplete="email"><label class="profile-remember-row"><input id="profileRememberInput" type="checkbox"> Remember my login</label><button class="profile-main-btn" type="submit">Save / log in</button><button class="profile-google-btn" type="button" onclick="fakeGoogleLogin()">Continue with Google</button></form></div>`;
      document.body.appendChild(overlay);
    }
    const form=document.getElementById('profileForm');
    if(form && !document.getElementById('profileRememberInput')){
      const lab=document.createElement('label'); lab.className='profile-remember-row'; lab.innerHTML='<input id="profileRememberInput" type="checkbox"> Remember my login';
      const submit=form.querySelector('button[type="submit"], .profile-main-btn'); form.insertBefore(lab, submit || null);
    }
    const oldLogin=document.getElementById('profileLogin');
    if(oldLogin && !document.getElementById('oldProfileRememberInput')){
      const lab=document.createElement('label'); lab.className='profile-remember-row'; lab.innerHTML='<input id="oldProfileRememberInput" type="checkbox"> Remember my login';
      const btn=oldLogin.querySelector('button'); oldLogin.insertBefore(lab, btn || null);
    }
    bindProfileForm();
    return overlay;
  }
  function save(u, remember){
    const existing=user()||{}; const merged=Object.assign({}, existing, u||{});
    const rem = remember === true;
    if(rem){ write(USER_KEY,merged,false); sessionStorage.removeItem(SESSION_KEY); }
    else { write(SESSION_KEY,merged,true); localStorage.removeItem(USER_KEY); }
    sessionStorage.setItem(WELCOME_SESSION,'true');
    window.updateFitBrandProfileUI();
    if(window.prefillGeneratorsFromProfile) window.prefillGeneratorsFromProfile();
    return merged;
  }
  window.getFitBrandUser=user;
  window.saveFitBrandUser=save;
  window.updateFitBrandProfileUI=function(){
    ensureHeader();
    const u=user(), ini=initials(u);
    qsa('#profileInitial,#profileMenuInitial,#profileViewInitial,#profileModalInitial').forEach(el=>el.textContent=ini);
    qsa('#profileMenuName,#profileViewName').forEach(el=>el.textContent=u?.name||'Guest');
    qsa('#profileMenuEmail,#profileViewEmail').forEach(el=>el.textContent=u?.email||'Not logged in');
    qsa('#profileLoginBtn').forEach(el=>el.style.display=u?'none':'block');
    qsa('#profileLogoutBtn').forEach(el=>el.style.display=u?'block':'none');
    qsa('.profile-menu-link').forEach(el=>el.style.display=u?'block':'none');
  };
  window.toggleProfileMenu=function(){ ensureHeader(); window.updateFitBrandProfileUI(); document.getElementById('profileMenu')?.classList.toggle('show'); };
  window.openProfileModal=function(mode){
    const overlay=ensureModernModal(); document.getElementById('profileMenu')?.classList.remove('show');
    const u=user(); const form=document.getElementById('profileForm'), view=document.getElementById('profileViewBox');
    const title=document.getElementById('profileModalTitle'), text=document.getElementById('profileModalText');
    if(mode==='profile' && u){ if(title)title.textContent='Your profile'; if(text)text.textContent='Your saved FitBrand login on this device.'; if(form)form.style.display='none'; if(view)view.style.display='block'; }
    else { if(title)title.textContent=u?'Edit quick login':'Log in'; if(text)text.textContent='Enter your name and email. Tick remember login if you do not want to log in again.'; if(form)form.style.display='grid'; if(view)view.style.display='none'; const n=document.getElementById('profileNameInput'), e=document.getElementById('profileEmailInput'); if(n)n.value=u?.name||''; if(e)e.value=u?.email||''; }
    window.updateFitBrandProfileUI(); overlay.classList.add('show');
  };
  window.closeProfileModal=function(){ document.getElementById('profileModalOverlay')?.classList.remove('show'); document.getElementById('profileModal')?.classList.remove('show'); };
  window.logoutFitBrandUser=function(){
    localStorage.removeItem(USER_KEY); sessionStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(WELCOME_SESSION); localStorage.removeItem('fitbrandWelcomeChoice');
    window.updateFitBrandProfileUI(); document.getElementById('profileMenu')?.classList.remove('show'); window.closeProfileModal();
    if(location.pathname.endsWith('/profile.html') || location.pathname.endsWith('profile.html')) setTimeout(()=>location.href='index.html',80);
  };
  function bindProfileForm(){
    const form=document.getElementById('profileForm'); if(form && form.dataset.v4bound!=='true'){
      form.dataset.v4bound='true'; form.addEventListener('submit',e=>{e.preventDefault(); const name=(document.getElementById('profileNameInput')?.value||'').trim(); const email=(document.getElementById('profileEmailInput')?.value||'').trim(); if(!name||!email){alert('Enter name and email');return;} save({name,email}, !!document.getElementById('profileRememberInput')?.checked); window.closeProfileModal();});
    }
  }
  window.loginFitBrandUser=function(){
    const email=(document.getElementById('loginProfileEmail')?.value || document.getElementById('profileEmailInput')?.value || '').trim();
    const name=(document.getElementById('loginProfileName')?.value || document.getElementById('profileNameInput')?.value || (email?email.split('@')[0]:'')).trim();
    if(!name||!email){alert('Enter name and email');return;}
    save({name,email}, !!(document.getElementById('oldProfileRememberInput')?.checked || document.getElementById('profileRememberInput')?.checked)); window.closeProfileModal();
  };
  window.saveFitBrandProfile=function(){
    const name=(document.getElementById('editProfileName')?.value || document.getElementById('profileNameInput')?.value || '').trim();
    const email=(document.getElementById('editProfileEmail')?.value || document.getElementById('profileEmailInput')?.value || '').trim();
    if(!name||!email){alert('Enter name and email');return;}
    save({name,email}, !!(document.getElementById('oldProfileRememberInput')?.checked || document.getElementById('profileRememberInput')?.checked)); window.closeProfileModal();
    if(location.pathname.endsWith('/profile.html') || location.pathname.endsWith('profile.html')) location.href='index.html';
  };
  window.fakeGoogleLogin=function(){ const email=prompt('Enter your Google email:'); if(!email)return; const raw=email.split('@')[0].replace(/[._-]/g,' ').trim(); save({name:raw?raw.charAt(0).toUpperCase()+raw.slice(1):'FitBrand User',email}, true); window.closeProfileModal(); };
  function welcome(){
    if(user() || sessionStorage.getItem(WELCOME_SESSION)) return;
    let o=document.getElementById('fitbrandWelcomeOverlay');
    if(!o){ o=document.createElement('div'); o.id='fitbrandWelcomeOverlay'; o.className='fb-welcome-overlay'; o.innerHTML=`<div class="fb-welcome-card"><div class="premium-badge">FitBrand Account</div><h2>Welcome to FitBrand</h2><p>Log in to save your profile information and auto-fill the AI generators, or continue as guest.</p><div class="fb-welcome-actions"><button class="fb-welcome-primary" type="button" onclick="openProfileFromWelcome()">Log in</button><button class="fb-welcome-secondary" type="button" onclick="continueAsGuest()">Continue as guest</button></div></div>`; document.body.appendChild(o); }
    setTimeout(()=>o.classList.add('show'),450);
  }
  window.openProfileFromWelcome=function(){ sessionStorage.setItem(WELCOME_SESSION,'true'); document.getElementById('fitbrandWelcomeOverlay')?.classList.remove('show'); window.openProfileModal('login'); };
  window.continueAsGuest=function(){ sessionStorage.setItem(WELCOME_SESSION,'true'); document.getElementById('fitbrandWelcomeOverlay')?.classList.remove('show'); };
  function checkoutFix(){
    const pay=document.getElementById('stripe-link'); if(!pay || pay.dataset.v4bound==='true') return; pay.dataset.v4bound='true';
    pay.addEventListener('click',function(e){
      const emailInput=document.querySelector('#checkout-email, .checkout-right input[type="email"], input[type="email"]'); const email=(emailInput?.value||'').trim();
      if(!email || !email.includes('@')){ e.preventDefault(); alert('Please enter your email before continuing to payment.'); emailInput?.focus(); return; }
      const u=user(); if(!u){ save({name:email.split('@')[0], email}, true); }
    }, true);
  }
  function mealFix(){
    window.handleMealPreviewClick=function(){
      localStorage.setItem('fitbrandMealPlanUnlocked','true');
      const g=document.getElementById('meal-plan-ai'); if(g){ g.classList.add('unlocked'); g.style.display='block'; document.getElementById('mealGenerator')?.classList.add('show'); }
      if(window.prefillGeneratorsFromProfile) window.prefillGeneratorsFromProfile();
      if(typeof window.syncMealWizardToReal==='function') window.syncMealWizardToReal();
      if(g) g.scrollIntoView({behavior:'smooth',block:'start'});
    };
    const params=new URLSearchParams(location.search);
    if(localStorage.getItem('fitbrandMealPlanUnlocked')==='true' || params.get('purchased')==='mealplan'){
      localStorage.setItem('fitbrandMealPlanUnlocked','true');
      const g=document.getElementById('meal-plan-ai'); if(g){ g.classList.add('unlocked'); g.style.display='block'; document.getElementById('mealGenerator')?.classList.add('show'); }
    }
  }
  document.addEventListener('DOMContentLoaded',()=>{ ensureHeader(); ensureModernModal(); bindProfileForm(); window.updateFitBrandProfileUI(); welcome(); checkoutFix(); mealFix(); document.addEventListener('click',e=>{ const m=document.getElementById('profileMenu'), b=document.querySelector('.profile-icon-btn'); if(m&&b&&!m.contains(e.target)&&!b.contains(e.target))m.classList.remove('show'); }); });
})();

/* ===== FITBRAND V5 FINAL OVERRIDE - profile/login/logout/welcome/meal wizard/checkout guard ===== */
(function(){
  const LS_USER = 'fitbrandUser';
  const SS_USER = 'fitbrandSessionUser';
  const SS_WELCOME = 'fitbrandWelcomeSeenSession';
  const PURCHASES = 'fitbrandPurchases';

  function safeParse(v, fallback){ try{return v ? JSON.parse(v) : fallback;}catch(e){return fallback;} }
  function user(){ return safeParse(sessionStorage.getItem(SS_USER), null) || safeParse(localStorage.getItem(LS_USER), null); }
  function initials(u){
    if(!u || !u.name) return '?';
    const parts = String(u.name).trim().split(/\s+/).filter(Boolean);
    if(!parts.length) return '?';
    return (parts[0][0] + (parts.length > 1 ? parts[parts.length-1][0] : '')).toUpperCase();
  }
  function saveUser(data, remember){
    const merged = Object.assign({}, user() || {}, data || {});
    if(remember){ localStorage.setItem(LS_USER, JSON.stringify(merged)); sessionStorage.removeItem(SS_USER); }
    else { sessionStorage.setItem(SS_USER, JSON.stringify(merged)); localStorage.removeItem(LS_USER); }
    sessionStorage.setItem(SS_WELCOME, 'true');
    updateUI();
    fillAllGeneratorsFromProfile();
    return merged;
  }
  function ensureHeader(){
    const nav = document.querySelector('header.nav'); if(!nav) return;
    let actions = nav.querySelector('.nav-actions');
    let cart = nav.querySelector('.cart-icon-btn');
    if(!actions){ actions = document.createElement('div'); actions.className = 'nav-actions'; if(cart){ cart.parentNode.insertBefore(actions, cart); actions.appendChild(cart); } else nav.appendChild(actions); }
    if(cart && cart.parentElement !== actions) actions.insertBefore(cart, actions.firstChild);
    let btn = actions.querySelector('.profile-icon-btn');
    if(!btn){ btn = document.createElement('button'); btn.className='profile-icon-btn'; btn.type='button'; btn.setAttribute('aria-label','Profile'); btn.innerHTML='<span id="profileInitial">?</span>'; actions.appendChild(btn); }
    btn.onclick = function(e){ e.preventDefault(); e.stopPropagation(); toggleProfileMenu(); };
    let menu = document.getElementById('profileMenu');
    if(!menu){ menu = document.createElement('div'); menu.id='profileMenu'; menu.className='profile-menu'; actions.appendChild(menu); }
    menu.innerHTML = '<div class="profile-menu-head"><div class="profile-avatar"><span id="profileMenuInitial">?</span></div><div><strong id="profileMenuName">Guest</strong><br><span id="profileMenuEmail">Not logged in</span></div></div><button type="button" onclick="openProfileModal(\'profile\')">View profile</button><a class="profile-menu-link" href="profile.html">Edit profile</a><a class="profile-menu-link" href="account.html#products">My products</a><a class="profile-menu-link" href="account.html#orders">My orders</a><button id="profileLoginBtn" type="button" onclick="openProfileModal(\'login\')">Log in</button><button id="profileLogoutBtn" type="button" onclick="logoutFitBrandUser()">Log out</button>';
  }
  function ensureModal(){
    let o = document.getElementById('profileModalOverlay');
    if(!o){ o = document.createElement('div'); o.id='profileModalOverlay'; o.className='profile-modal-overlay'; document.body.appendChild(o); }
    o.onclick = closeProfileModal;
    o.innerHTML = '<div class="profile-modal" onclick="event.stopPropagation()"><button class="profile-modal-close" type="button" onclick="closeProfileModal()">×</button><h2 id="profileModalTitle">Log in</h2><p id="profileModalText">Save your login and profile details on this device.</p><div id="profileViewBox" style="display:none"><div class="profile-menu-head"><div class="profile-avatar"><span id="profileViewInitial">?</span></div><div><strong id="profileViewName">Guest</strong><br><span id="profileViewEmail">Not logged in</span></div></div><a class="profile-main-btn" href="profile.html">Edit full profile</a></div><form id="profileForm" class="profile-form"><input id="profileNameInput" type="text" placeholder="Your full name" autocomplete="name"><input id="profileEmailInput" type="email" placeholder="your@email.com" autocomplete="email"><label class="profile-remember-row"><input id="profileRememberInput" type="checkbox"> Remember my login</label><button class="profile-main-btn" type="submit">Save / log in</button><button class="profile-google-btn" type="button" onclick="fakeGoogleLogin()">Continue with Google</button></form></div>';
    const form = document.getElementById('profileForm');
    if(form){
      form.onsubmit = function(e){
        e.preventDefault();
        const name = (document.getElementById('profileNameInput')?.value || '').trim();
        const email = (document.getElementById('profileEmailInput')?.value || '').trim();
        if(!name || !email || !email.includes('@')){ alert('Enter a valid name and email.'); return; }
        saveUser({name, email}, !!document.getElementById('profileRememberInput')?.checked);
        closeProfileModal();
      };
    }
    return o;
  }
  function ensureWelcome(){
    if(user() || sessionStorage.getItem(SS_WELCOME)) return;
    let o = document.getElementById('fitbrandWelcomeOverlay');
    if(!o){ o=document.createElement('div'); o.id='fitbrandWelcomeOverlay'; o.className='fb-welcome-overlay'; document.body.appendChild(o); }
    o.innerHTML = '<div class="fb-welcome-card"><div class="premium-badge">FitBrand Account</div><h2>Welcome to FitBrand</h2><p>Log in to save your profile information and auto-fill the AI generators, or continue as guest.</p><div class="fb-welcome-actions"><button class="fb-welcome-primary" type="button" onclick="openProfileFromWelcome()">Log in</button><button class="fb-welcome-secondary" type="button" onclick="continueAsGuest()">Continue as guest</button></div></div>';
    setTimeout(()=>o.classList.add('show'), 500);
  }
  function updateUI(){
    ensureHeader();
    const u = user(); const ini = initials(u);
    document.querySelectorAll('#profileInitial,#profileMenuInitial,#profileViewInitial,#profileModalInitial').forEach(el=>{el.textContent=ini;});
    document.querySelectorAll('#profileMenuName,#profileViewName').forEach(el=>{el.textContent = u?.name || 'Guest';});
    document.querySelectorAll('#profileMenuEmail,#profileViewEmail').forEach(el=>{el.textContent = u?.email || 'Not logged in';});
    document.querySelectorAll('#profileLoginBtn').forEach(el=>{el.style.display = u ? 'none' : 'block';});
    document.querySelectorAll('#profileLogoutBtn').forEach(el=>{el.style.display = u ? 'block' : 'none';});
    document.querySelectorAll('.profile-menu-link').forEach(el=>{el.style.display = u ? 'block' : 'none';});
  }
  window.getFitBrandUser = user;
  window.saveFitBrandUser = saveUser;
  window.updateFitBrandProfileUI = updateUI;
  window.toggleProfileMenu = function(){ ensureHeader(); updateUI(); document.getElementById('profileMenu')?.classList.toggle('show'); };
  window.openProfileModal = function(mode){
    const o = ensureModal(); const u = user();
    const title = document.getElementById('profileModalTitle'); const text = document.getElementById('profileModalText');
    const form = document.getElementById('profileForm'); const view = document.getElementById('profileViewBox');
    if(mode === 'profile' && u){ title.textContent='Your profile'; text.textContent='Your saved FitBrand account on this device.'; form.style.display='none'; view.style.display='block'; }
    else { title.textContent = u ? 'Edit quick login' : 'Log in'; text.textContent='Enter your name and email. Tick remember login if you do not want to log in again.'; form.style.display='grid'; view.style.display='none'; document.getElementById('profileNameInput').value=u?.name||''; document.getElementById('profileEmailInput').value=u?.email||''; }
    updateUI(); document.getElementById('profileMenu')?.classList.remove('show'); o.classList.add('show');
  };
  window.closeProfileModal = function(){ document.getElementById('profileModalOverlay')?.classList.remove('show'); };
  window.logoutFitBrandUser = function(){
    localStorage.removeItem(LS_USER); sessionStorage.removeItem(SS_USER); sessionStorage.removeItem(SS_WELCOME);
    updateUI(); document.getElementById('profileMenu')?.classList.remove('show'); closeProfileModal();
    if(location.pathname.endsWith('profile.html') || location.pathname.endsWith('account.html')) setTimeout(()=>{ location.href='index.html'; }, 80);
  };
  window.openProfileFromWelcome = function(){ sessionStorage.setItem(SS_WELCOME,'true'); document.getElementById('fitbrandWelcomeOverlay')?.classList.remove('show'); openProfileModal('login'); };
  window.continueAsGuest = function(){ sessionStorage.setItem(SS_WELCOME,'true'); document.getElementById('fitbrandWelcomeOverlay')?.classList.remove('show'); };
  window.fakeGoogleLogin = function(){ const email = prompt('Enter your Google email:'); if(!email || !email.includes('@')) return; const raw=email.split('@')[0].replace(/[._-]/g,' ').trim(); saveUser({name:raw ? raw.charAt(0).toUpperCase()+raw.slice(1) : 'FitBrand User', email}, true); closeProfileModal(); };

  function fillAllGeneratorsFromProfile(){
    const u = user() || {};
    const pairs = { mealAge:u.age, mealGender:u.gender, mealWeight:u.weight, mealHeight:u.height, mealTrainingDays:u.trainingDays, mealAvoid:u.allergies, mealGoal:(u.goal==='fatloss'||u.goal==='muscle'||u.goal==='maintenance')?u.goal:'' };
    Object.entries(pairs).forEach(([id,val])=>{ const el=document.getElementById(id); if(el && val && !el.value) el.value=val; });
    const wiz = { fbWizAge:u.age, fbWizGender:u.gender, fbWizWeight:u.weight, fbWizHeight:u.height, fbWizAvoid:u.allergies };
    Object.entries(wiz).forEach(([id,val])=>{ const el=document.getElementById(id); if(el && val && !el.value) el.value=val; });
  }
  window.prefillGeneratorsFromProfile = fillAllGeneratorsFromProfile;

  function unlockMealFromUrl(){
    const p = new URLSearchParams(location.search);
    if(p.get('purchased') === 'mealplan' || p.get('product') === 'mealplan') localStorage.setItem('fitbrandMealPlanUnlocked','true');
    if(localStorage.getItem('fitbrandMealPlanUnlocked') === 'true') document.getElementById('meal-plan-ai')?.classList.add('unlocked');
  }
  function syncWizardToHiddenFields(){
    const map = {fbWizAge:'mealAge',fbWizGender:'mealGender',fbWizWeight:'mealWeight',fbWizHeight:'mealHeight',fbWizAvoid:'mealAvoid',fbWizTime:'mealTime',fbWizDifficulty:'mealDifficulty'};
    Object.entries(map).forEach(([from,to])=>{ const a=document.getElementById(from), b=document.getElementById(to); if(a && b && a.value) b.value=a.value; });
  }
  function setupMealWizard(){
    const ai = document.getElementById('meal-plan-ai'); const realGrid = ai?.querySelector('.meal-grid'); if(!ai || !realGrid || document.getElementById('fbMealWizardV5')) return;
    realGrid.classList.add('fb-meal-grid-collapsed');
    const u = user();
    const panel = document.createElement('div'); panel.id='fbMealWizardV5'; panel.className='fb-meal-choice-panel fb-meal-choice-panel-pro';
    panel.innerHTML = '<div class="fb-meal-choice-head"><div><h3>Step-by-step Meal Plan AI</h3><p>Click through the cards. Use your saved profile or change the details anytime.</p></div><div id="fbMealStepPill" class="fb-meal-step-pill">1 / 6</div></div><div class="fb-meal-profile-summary"><div><strong>Saved profile</strong><span id="fbMealProfileText">'+(u?('Using '+(u.name||u.email)+' — saved details can auto-fill this plan.'):'No saved profile yet. You can still continue manually.')+'</span></div><div class="fb-meal-profile-actions"><button type="button" data-action="use-profile">Use saved profile</button><a href="profile.html">Change information</a></div></div><div class="fb-meal-question active" data-step="1"><h4>How do you want to start?</h4><div class="fb-meal-options"><button class="fb-meal-option" data-action="use-profile"><strong>Use saved profile</strong><span>Auto-fill age, gender, weight, height and preferences.</span></button><button class="fb-meal-option" data-action="manual"><strong>Fill manually</strong><span>Choose the information step by step.</span></button></div></div><div class="fb-meal-question" data-step="2"><h4>What is your goal?</h4><div class="fb-meal-options"><button class="fb-meal-option" data-field="mealGoal" data-value="fatloss"><strong>Lose fat</strong><span>High protein and controlled calories.</span></button><button class="fb-meal-option" data-field="mealGoal" data-value="muscle"><strong>Build muscle</strong><span>More calories for growth.</span></button><button class="fb-meal-option" data-field="mealGoal" data-value="maintenance"><strong>Maintain</strong><span>Clean eating and balance.</span></button></div></div><div class="fb-meal-question" data-step="3"><h4>Your body info</h4><div class="fb-meal-mini-form"><input id="fbWizAge" type="number" placeholder="Age"><select id="fbWizGender"><option value="">Gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select><input id="fbWizWeight" type="number" placeholder="Weight kg"><input id="fbWizHeight" type="number" placeholder="Height cm"></div></div><div class="fb-meal-question" data-step="4"><h4>Training and meals</h4><div class="fb-meal-options"><button class="fb-meal-option" data-field="mealTrainingDays" data-value="3"><strong>2-3 days</strong><span>Simple routine.</span></button><button class="fb-meal-option" data-field="mealTrainingDays" data-value="5"><strong>4-5 days</strong><span>Balanced progress.</span></button><button class="fb-meal-option" data-field="mealTrainingDays" data-value="6"><strong>6+ days</strong><span>High consistency.</span></button></div><div class="fb-meal-options compact"><button class="fb-meal-option" data-field="mealMeals" data-value="3">3 meals</button><button class="fb-meal-option" data-field="mealMeals" data-value="4">4 meals</button><button class="fb-meal-option" data-field="mealMeals" data-value="5">5 meals</button></div></div><div class="fb-meal-question" data-step="5"><h4>Food style</h4><div class="fb-meal-options"><button class="fb-meal-option" data-field="mealDiet" data-value="highprotein"><strong>High protein</strong><span>Best for results.</span></button><button class="fb-meal-option" data-field="mealDiet" data-value="budget"><strong>Budget</strong><span>Cheaper meals.</span></button><button class="fb-meal-option" data-field="mealDiet" data-value="vegetarian"><strong>Vegetarian</strong><span>No meat.</span></button><button class="fb-meal-option" data-field="mealDiet" data-value="easy"><strong>Easy meals</strong><span>Fast and simple.</span></button></div></div><div class="fb-meal-question" data-step="6"><h4>Final details</h4><div class="fb-meal-mini-form"><select id="fbWizTime"><option value="normal">Normal cooking time</option><option value="fast">Under 15 min</option><option value="prep">Meal prep friendly</option></select><select id="fbWizDifficulty"><option value="easy">Easy to follow</option><option value="flexible">Flexible lifestyle</option><option value="strict">Strict / precise</option></select><input id="fbWizAvoid" class="wide" placeholder="Foods to avoid / allergies"></div><button class="fb-meal-generate-final" type="button">Generate my 7-day meal plan</button></div><div class="fb-meal-choice-actions"><button id="fbMealBack" class="fb-meal-back" type="button">Back</button><button id="fbMealNext" class="fb-meal-next" type="button">Next</button></div>';
    realGrid.parentNode.insertBefore(panel, realGrid);
    let step = 1;
    function render(){ panel.querySelectorAll('.fb-meal-question').forEach(q=>q.classList.toggle('active', Number(q.dataset.step)===step)); const pill=document.getElementById('fbMealStepPill'); if(pill)pill.textContent=step+' / 6'; document.getElementById('fbMealBack').style.visibility=step===1?'hidden':'visible'; document.getElementById('fbMealNext').style.display=step===6?'none':'inline-flex'; syncWizardToHiddenFields(); }
    panel.addEventListener('click', function(e){
      const b=e.target.closest('button'); if(!b) return;
      if(b.dataset.action === 'use-profile'){ fillAllGeneratorsFromProfile(); step=2; render(); return; }
      if(b.dataset.action === 'manual'){ step=2; render(); return; }
      if(b.dataset.field){ const target=document.getElementById(b.dataset.field); if(target) target.value=b.dataset.value; b.parentElement.querySelectorAll('button').forEach(x=>x.classList.remove('selected')); b.classList.add('selected'); }
      if(b.classList.contains('fb-meal-generate-final')){ syncWizardToHiddenFields(); if(typeof window.generateMealPlan === 'function') window.generateMealPlan(); }
    });
    document.getElementById('fbMealBack').onclick=()=>{ if(step>1){step--; render();} };
    document.getElementById('fbMealNext').onclick=()=>{ syncWizardToHiddenFields(); if(step<6){step++; render();} };
    fillAllGeneratorsFromProfile(); render();
  }

  function profilePageFix(){
    const form = document.getElementById('fullProfileForm'); if(!form || form.dataset.v5bound==='true') return; form.dataset.v5bound='true';
    const u=user()||{}; const set=(id,val)=>{const el=document.getElementById(id); if(el && val) el.value=val;};
    set('pfName',u.name); set('pfEmail',u.email); set('pfPhone',u.phone); set('pfAddress',u.address); set('pfGender',u.gender); set('pfAge',u.age); set('pfWeight',u.weight); set('pfHeight',u.height); set('pfLevel',u.level); set('pfTrainingLocation',u.trainingLocation); set('pfTrainingDays',u.trainingDays); set('pfEquipment',u.equipment); set('pfAllergies',u.allergies); set('pfGoal',u.goal);
    form.addEventListener('submit', function(e){
      e.preventDefault(); e.stopImmediatePropagation();
      const data={name:pfName.value.trim(),email:pfEmail.value.trim(),phone:pfPhone.value.trim(),address:pfAddress.value.trim(),gender:pfGender.value,age:pfAge.value,weight:pfWeight.value,height:pfHeight.value,level:pfLevel.value,trainingLocation:pfTrainingLocation.value,trainingDays:pfTrainingDays.value,equipment:pfEquipment.value.trim(),allergies:pfAllergies.value.trim(),goal:pfGoal.value};
      if(!data.name || !data.email || !data.email.includes('@')){ alert('Please add at least a valid name and email.'); return; }
      saveUser(data, true); location.href='index.html';
    }, true);
  }
  function checkoutGuard(){
    const pay=document.getElementById('stripe-link'); if(!pay || pay.dataset.v5bound==='true') return; pay.dataset.v5bound='true';
    pay.addEventListener('click', function(e){
      const emailInput=document.getElementById('checkout-email') || document.querySelector('.checkout-right input[type="email"], input[type="email"]');
      const email=(emailInput?.value||'').trim();
      if(!email || !email.includes('@')){ e.preventDefault(); alert('Please enter your email before continuing to payment.'); emailInput?.focus(); return; }
      if(!user()) saveUser({name:email.split('@')[0], email}, true);
    }, true);
  }
  function cartCount(){
    const cart=safeParse(localStorage.getItem('fitbrandCart'), []); document.querySelectorAll('#cart-count,#cart-count-btn').forEach(el=>{el.textContent=cart.length; el.style.display=cart.length?'inline-flex':'none';});
  }
  document.addEventListener('click', function(e){ const m=document.getElementById('profileMenu'), b=document.querySelector('.profile-icon-btn'); if(m && b && !m.contains(e.target) && !b.contains(e.target)) m.classList.remove('show'); });
  document.addEventListener('DOMContentLoaded', function(){ ensureHeader(); ensureModal(); updateUI(); ensureWelcome(); unlockMealFromUrl(); setupMealWizard(); fillAllGeneratorsFromProfile(); profilePageFix(); checkoutGuard(); cartCount(); });
})();
