/* FitBrand global script: cart helpers, profile system, welcome choice, generator autofill and page polish. */
(function(){
  const USER_KEY = "fitbrandUser";
  const WELCOME_KEY = "fitbrandWelcomeChoice";
  const PURCHASED_KEY = "fitbrandPurchasedPackage";

  function safeJson(value, fallback){
    try { return value ? (JSON.parse(value) || fallback) : fallback; }
    catch(e){ return fallback; }
  }

  window.getFitBrandUser = function(){ return safeJson(localStorage.getItem(USER_KEY), null); };
  window.saveFitBrandUser = function(user){
    const existing = getFitBrandUser() || {};
    const saved = Object.assign({}, existing, user || {});
    localStorage.setItem(USER_KEY, JSON.stringify(saved));
    localStorage.setItem(WELCOME_KEY, "login");
    updateFitBrandProfileUI();
    prefillGeneratorsFromProfile();
    return saved;
  };

  function getInitial(user){
    return user && user.name ? user.name.trim().charAt(0).toUpperCase() : "?";
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
    document.getElementById("fitbrandWelcomeOverlay")?.classList.remove("show");
    openProfileModal("login");
  };

  window.continueAsGuest = function(){
    localStorage.setItem(WELCOME_KEY, "guest");
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
    updateFitBrandProfileUI();
    document.getElementById("profileMenu")?.classList.remove("show");
  };

  window.fakeGoogleLogin = function(){
    const email = prompt("Enter your Google email:");
    if(!email) return;
    const rawName = email.split("@")[0].replace(/[._-]/g, " ").trim();
    const name = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : "FitBrand User";
    saveFitBrandUser({name, email});
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
      saveFitBrandUser({name, email});
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
    if(!localStorage.getItem(WELCOME_KEY) && !getFitBrandUser()){
      setTimeout(() => document.getElementById("fitbrandWelcomeOverlay")?.classList.add("show"), 500);
    }
  }

  function setupMealChoiceWizard(){
    const target = document.querySelector("#meal-plan-ai .meal-generator");
    if(!target || document.getElementById("fbMealChoicePanel")) return;
    const panel = document.createElement("div");
    panel.id = "fbMealChoicePanel";
    panel.className = "fb-meal-choice-panel";
    panel.innerHTML = `
      <div class="fb-meal-choice-head">
        <div><h3>Quick Meal Setup</h3><p>Click through the choices and the form fills itself automatically.</p></div>
        <div id="fbMealStepPill" class="fb-meal-step-pill">1 / 5</div>
      </div>
      <div class="fb-meal-question active" data-step="1"><h4>What is your goal?</h4><div class="fb-meal-options"><button class="fb-meal-option" data-field="mealGoal" data-value="fatloss"><strong>Lose fat</strong><span>Lower calories and high protein.</span></button><button class="fb-meal-option" data-field="mealGoal" data-value="muscle"><strong>Build muscle</strong><span>More food for growth.</span></button><button class="fb-meal-option" data-field="mealGoal" data-value="maintenance"><strong>Maintain</strong><span>Clean eating and balance.</span></button></div></div>
      <div class="fb-meal-question" data-step="2"><h4>How many meals do you want?</h4><div class="fb-meal-options"><button class="fb-meal-option" data-field="mealMeals" data-value="3"><strong>3 meals</strong><span>Simple and easy.</span></button><button class="fb-meal-option" data-field="mealMeals" data-value="4"><strong>4 meals</strong><span>Balanced day.</span></button><button class="fb-meal-option" data-field="mealMeals" data-value="5"><strong>5 meals</strong><span>Best structure.</span></button></div></div>
      <div class="fb-meal-question" data-step="3"><h4>Choose food style</h4><div class="fb-meal-options"><button class="fb-meal-option" data-field="mealDiet" data-value="highprotein"><strong>High protein</strong><span>Best for results.</span></button><button class="fb-meal-option" data-field="mealDiet" data-value="budget"><strong>Budget</strong><span>Cheaper meals.</span></button><button class="fb-meal-option" data-field="mealDiet" data-value="vegetarian"><strong>Vegetarian</strong><span>No meat.</span></button></div></div>
      <div class="fb-meal-question" data-step="4"><h4>How much cooking time?</h4><div class="fb-meal-options"><button class="fb-meal-option" data-field="mealTime" data-value="fast"><strong>Under 15 min</strong><span>Fast meals.</span></button><button class="fb-meal-option" data-field="mealTime" data-value="prep"><strong>Meal prep</strong><span>Prepare ahead.</span></button><button class="fb-meal-option" data-field="mealTime" data-value="normal"><strong>Normal</strong><span>More flexible.</span></button></div></div>
      <div class="fb-meal-question" data-step="5"><h4>How strict should it be?</h4><div class="fb-meal-options"><button class="fb-meal-option" data-field="mealDifficulty" data-value="easy"><strong>Easy</strong><span>Simple to follow.</span></button><button class="fb-meal-option" data-field="mealDifficulty" data-value="flexible"><strong>Flexible</strong><span>Lifestyle friendly.</span></button><button class="fb-meal-option" data-field="mealDifficulty" data-value="strict"><strong>Strict</strong><span>More precise.</span></button></div></div>
      <div class="fb-meal-choice-actions"><button class="fb-meal-back" type="button" id="fbMealBack">Back</button><button class="fb-meal-next" type="button" id="fbMealNext">Next</button></div>`;
    target.insertBefore(panel, target.firstChild);
    let step = 1;
    function render(){
      panel.querySelectorAll(".fb-meal-question").forEach(q => q.classList.toggle("active", Number(q.dataset.step) === step));
      const pill = document.getElementById("fbMealStepPill");
      if(pill) pill.textContent = step + " / 5";
    }
    panel.querySelectorAll(".fb-meal-option").forEach(btn => btn.addEventListener("click", () => {
      const el = document.getElementById(btn.dataset.field);
      if(el) el.value = btn.dataset.value;
      btn.closest(".fb-meal-question").querySelectorAll(".fb-meal-option").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      if(step < 5){ step++; render(); }
    }));
    document.getElementById("fbMealBack")?.addEventListener("click", () => { if(step > 1){ step--; render(); } });
    document.getElementById("fbMealNext")?.addEventListener("click", () => { if(step < 5){ step++; render(); } });
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
