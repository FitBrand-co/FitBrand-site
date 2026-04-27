/* FitBrand global system - stable version */
(function(){
  const USER_KEY='fitbrandUser';
  const SESSION_KEY='fitbrandSessionUser';
  const WELCOME_KEY='fitbrandWelcomeSeenSessionV4';
  const CART_KEY='fitbrandCart';
  const PURCHASES_KEY='fitbrandPurchases';
  const ORDERS_KEY='fitbrandOrders';
  const PROGRAM_KEY='fitbrandPurchasedPackage';

  const validProducts=['aesthetic','shred','strength','bundle','mealplan','belt','straps'];
  const programProducts=['aesthetic','shred','strength'];
  const catalog={
    aesthetic:{name:'Aesthetic Program',price:4.99,type:'digital',open:'index.html?purchased=aesthetic',buy:'checkout.html?product=aesthetic'},
    shred:{name:'Shred Program',price:6.99,type:'digital',open:'index.html?purchased=shred',buy:'checkout.html?product=shred'},
    strength:{name:'Strength Program',price:6.99,type:'digital',open:'index.html?purchased=strength',buy:'checkout.html?product=strength'},
    bundle:{name:'Complete Bundle + Meal Plan AI',price:18.97,type:'digital',open:'index.html?purchased=bundle',buy:'checkout.html?product=bundle'},
    mealplan:{name:'Meal Plan Guide AI',price:5.99,type:'digital',open:'recommended.html?purchased=mealplan#meal-plan-ai',buy:'checkout.html?product=mealplan'},
    belt:{name:'Lifting Belt',price:24.99,type:'physical',open:'product-belt.html',buy:'checkout.html?product=belt'},
    straps:{name:'Lifting Straps',price:12.99,type:'physical',open:'product-straps.html',buy:'checkout.html?product=straps'}
  };
  window.fitbrandCatalog=catalog;

  const planLibrary={
    aesthetic:{
      gym:[['Day 1 — Chest + Triceps',['Bench Press — 4x6-8','Incline DB Press — 3x8-10','Cable Fly — 3x12-15','Lateral Raises — 4x12-15','Tricep Pushdown — 3x10-12']],['Day 2 — Back + Biceps',['Lat Pulldown — 4x8-10','Barbell Row — 4x8-10','Seated Cable Row — 3x10-12','Rear Delt Fly — 3x12-15','DB Curl — 3x10-12']],['Day 3 — Legs',['Squat — 4x6-8','Leg Press — 3x10-12','Romanian Deadlift — 3x8-10','Leg Curl — 3x12-15','Calf Raise — 4x12-15']],['Day 4 — Upper Aesthetic',['Incline Press — 4x8','Chest Supported Row — 4x10','Machine Shoulder Press — 3x10','Cable Lateral Raise — 4x15','Arms Superset — 3x12']],['Day 5 — Pump + Core',['Machine Chest Press — 3x12','Cable Row — 3x12','Leg Extension — 3x15','Hanging Leg Raise — 3x12','Plank — 3x45 sec']],['Day 6 — Weak Point Focus',['Upper chest — 4 sets','Back width — 4 sets','Shoulders — 4 sets','Arms — 4 sets','Core — 3 sets']]],
      home:[['Day 1 — Push',['Push Ups — 4xAMRAP','Feet Elevated Push Ups — 3x10-15','Band Fly — 3x15','Pike Push Ups — 4x8-12','Bench Dips — 3x12']],['Day 2 — Pull',['One Arm DB Row — 4x10','Band Pulldown — 4x12','Band Row — 3x15','Rear Delt Raise — 3x15','DB Curl — 3x12']],['Day 3 — Legs',['Goblet Squat — 4x12','Bulgarian Split Squat — 3x10','Single Leg RDL — 3x10','Glute Bridge — 3x15','Calf Raise — 4x15']],['Day 4 — Upper Aesthetic',['Push Ups — 4 sets','DB Row — 4 sets','Lateral Raise — 4x15','Band Pull Apart — 3x20','Arms Superset — 3x12']],['Day 5 — Pump + Core',['Full body circuit — 4 rounds','Mountain Climbers — 3x30 sec','Plank — 3x45 sec','Leg Raises — 3x12']],['Day 6 — Weak Point Focus',['Shoulders — 4 sets','Back — 4 sets','Arms — 4 sets','Core — 3 sets']]]
    },
    shred:{
      gym:[['Day 1 — Full Body Strength',['Squat — 4x6-8','Bench Press — 4x6-8','Row — 4x8-10','Lateral Raise — 3x15','Incline Walk — 20 min']],['Day 2 — Conditioning',['Leg Press — 3x12','Lat Pulldown — 3x12','DB Press — 3x12','Bike Intervals — 10 rounds','Core Circuit — 3 rounds']],['Day 3 — Lower + Cardio',['Romanian Deadlift — 4x8','Bulgarian Split Squat — 3x10','Leg Curl — 3x12','Calf Raise — 4x15','Incline Walk — 25 min']],['Day 4 — Upper + HIIT',['Incline Press — 3x10','Cable Row — 3x10','Shoulder Press — 3x10','Curls + Triceps — 3x12','Bike Intervals — 12 min']],['Day 5 — Fat Loss Circuit',['Goblet Squat — 4x12','Push Ups — 4xAMRAP','Cable Row — 4x12','Walking Lunges — 3x20','Treadmill — 20 min']],['Day 6 — Low Intensity',['Steps goal — 8k-12k','Mobility — 15 min','Core — 10 min','Stretch — 10 min']]],
      home:[['Day 1 — Full Body',['Goblet Squat — 4x12','Push Ups — 4xAMRAP','DB Row — 4x12','Burpees — 3x10','Fast Walk — 25 min']],['Day 2 — Conditioning',['Jump Squats — 4x12','Mountain Climbers — 4x30 sec','Band Row — 4x15','Plank — 3x45 sec','Steps — 8k-12k']],['Day 3 — Lower Burn',['Bulgarian Split Squat — 4x10','Glute Bridge — 4x15','Single Leg RDL — 3x10','Calf Raise — 4x20','Walk — 30 min']],['Day 4 — Upper Burn',['Push Ups — 4 sets','Pike Push Ups — 3x10','Band Row — 4x15','DB Curl — 3x12','HIIT — 10 min']],['Day 5 — Fat Loss Circuit',['Squat — 20 reps','Push Ups — AMRAP','Rows — 15 reps','Lunges — 20 reps','Repeat 4 rounds']],['Day 6 — Active Recovery',['Walk — 40 min','Mobility — 15 min','Core — 10 min']]]
    },
    strength:{
      gym:[['Day 1 — Squat Focus',['Back Squat — 5x3-5','Paused Squat — 3x5','Leg Press — 3x8','Hamstring Curl — 3x10','Core — 3 sets']],['Day 2 — Bench Focus',['Bench Press — 5x3-5','Incline DB Press — 3x8','Barbell Row — 4x8','Tricep Dips — 3x8','Face Pull — 3x15']],['Day 3 — Deadlift Focus',['Deadlift — 5x3','Romanian Deadlift — 3x6-8','Lat Pulldown — 4x8','Back Extension — 3x10','Farmer Carry — 4 rounds']],['Day 4 — Overhead Focus',['Overhead Press — 5x3-5','Close Grip Bench — 3x6','Pull Ups — 4xAMRAP','Lateral Raise — 3x15','Core — 3 sets']],['Day 5 — Volume Strength',['Front Squat — 4x6','Paused Bench — 4x6','Row — 4x8','Hip Thrust — 3x8','Arms — 3x10']],['Day 6 — Recovery Strength',['Technique work — 30 min','Mobility — 15 min','Light cardio — 20 min']]],
      home:[['Day 1 — Lower Strength',['Goblet Squat — 5x8','Bulgarian Split Squat — 4x8','Single Leg RDL — 4x8','Wall Sit — 3x45 sec','Core — 3 sets']],['Day 2 — Push Strength',['Weighted Push Ups — 5x6-10','Pike Push Ups — 4x8','Slow Push Ups — 3x8','Bench Dips — 3x10','Plank — 3 sets']],['Day 3 — Pull Strength',['Heavy DB Row — 5x8','Band Row — 4x12','Towel Row — 4xAMRAP','DB Curl — 4x10','Farmer Hold — 4 rounds']],['Day 4 — Full Body Strength',['Goblet Squat — 4x8','Push Ups — 4xAMRAP','DB Row — 4x8','Split Squat — 3x10','Core — 3 sets']],['Day 5 — Volume Strength',['Tempo Squat — 4x10','Tempo Push Up — 4x10','Tempo Row — 4x10','Glute Bridge — 3x15','Carries — 4 rounds']],['Day 6 — Recovery Strength',['Mobility — 20 min','Walk — 30 min','Technique work — 15 min']]]
    }
  };

  function $(id){return document.getElementById(id)}
  function parse(v,f){try{return v?JSON.parse(v):f}catch(e){return f}}
  function save(k,v){localStorage.setItem(k,JSON.stringify(v))}
  function getCart(){return parse(localStorage.getItem(CART_KEY),[]).filter(x=>validProducts.includes(x))}
  function getUser(){return parse(sessionStorage.getItem(SESSION_KEY),null)||parse(localStorage.getItem(USER_KEY),null)}
  function getInitials(u){if(!u||!u.name)return'?'; const p=String(u.name).trim().split(/\s+/).filter(Boolean); if(!p.length)return'?'; return ((p[0][0]||'')+(p.length>1?(p[p.length-1][0]||''):'')).toUpperCase();}
  function getPurchases(){let p=parse(localStorage.getItem(PURCHASES_KEY),[]).filter(x=>validProducts.includes(x)); const pkg=localStorage.getItem(PROGRAM_KEY); if(pkg&&!p.includes(pkg))p.push(pkg); if(localStorage.getItem('fitbrandMealPlanUnlocked')==='true'&&!p.includes('mealplan'))p.push('mealplan'); if(p.includes('bundle')&&!p.includes('mealplan'))p.push('mealplan'); return [...new Set(p)];}
  function addPurchase(key){if(!validProducts.includes(key))return; let p=getPurchases(); if(!p.includes(key))p.push(key); if(key==='bundle'&&!p.includes('mealplan'))p.push('mealplan'); save(PURCHASES_KEY,p); if(['aesthetic','shred','strength','bundle'].includes(key))localStorage.setItem(PROGRAM_KEY,key); if(key==='mealplan'||key==='bundle')localStorage.setItem('fitbrandMealPlanUnlocked','true');}
  function productName(key){return (catalog[key]||{}).name||key;}

  window.getFitBrandUser=getUser;
  window.saveFitBrandUser=function(data,remember){const merged=Object.assign({},getUser()||{},data||{}); if(remember){localStorage.setItem(USER_KEY,JSON.stringify(merged));sessionStorage.removeItem(SESSION_KEY)}else{sessionStorage.setItem(SESSION_KEY,JSON.stringify(merged));} sessionStorage.setItem(WELCOME_KEY,'true'); updateFitBrandProfileUI(); prefillGeneratorsFromProfile(); return merged};
  window.logoutFitBrandUser=function(){localStorage.removeItem(USER_KEY);sessionStorage.removeItem(SESSION_KEY);updateFitBrandProfileUI();$('profileMenu')?.classList.remove('show');$('profileModalOverlay')?.classList.remove('show');};

  function ensureHeader(){
    const nav=document.querySelector('header.nav'); if(!nav)return;
    let actions=nav.querySelector('.nav-actions'); const cart=nav.querySelector('.cart-icon-btn');
    if(!actions){actions=document.createElement('div'); actions.className='nav-actions'; if(cart){cart.parentNode.insertBefore(actions,cart);actions.appendChild(cart)}else nav.appendChild(actions)}
    if(!actions.querySelector('.profile-icon-btn')){const b=document.createElement('button'); b.type='button'; b.className='profile-icon-btn'; b.setAttribute('aria-label','Profile'); b.innerHTML='<span id="profileInitial">?</span>'; b.addEventListener('click',window.toggleProfileMenu); actions.appendChild(b);}
    let menu=actions.querySelector('#profileMenu'); if(!menu){menu=document.createElement('div'); menu.id='profileMenu'; menu.className='profile-menu'; actions.appendChild(menu);}
  }
  function renderProfileMenu(){
    const menu=$('profileMenu'); if(!menu)return; const u=getUser(); const ini=getInitials(u);
    menu.innerHTML=`
      <div class="profile-menu-head">
        <div class="profile-avatar"><span id="profileMenuInitial">${ini}</span></div>
        <div class="profile-menu-id"><strong id="profileMenuName">${u?.name||'Guest'}</strong><span id="profileMenuEmail">${u?.email||'Not logged in'}</span></div>
      </div>
      <button type="button" onclick="openProfileModal('profile')">View profile</button>
      ${u?'<div class="profile-menu-account-links"><a class="profile-menu-link" href="profile.html">Edit profile information</a><a class="profile-menu-link" href="products-access.html">My products / access</a><a class="profile-menu-link" href="orders.html">My orders</a></div>':''}
      <button id="profileLoginBtn" type="button" onclick="openProfileModal('login')" style="display:${u?'none':'block'}">Log in</button>
      <button id="profileLogoutBtn" type="button" onclick="logoutFitBrandUser()" style="display:${u?'block':'none'}">Log out</button>`;
  }
  window.updateFitBrandProfileUI=function(){ensureHeader(); const u=getUser(), ini=getInitials(u); document.querySelectorAll('#profileInitial,#profileMenuInitial,#profileViewInitial,#profileModalInitial').forEach(el=>el.textContent=ini); document.querySelectorAll('#profileMenuName,#profileViewName').forEach(el=>el.textContent=u?.name||'Guest'); document.querySelectorAll('#profileMenuEmail,#profileViewEmail').forEach(el=>el.textContent=u?.email||'Not logged in'); renderProfileMenu();};
  window.toggleProfileMenu=function(e){if(e)e.stopPropagation(); ensureHeader(); renderProfileMenu(); $('profileMenu')?.classList.toggle('show');};

  function ensureProfileModal(){
    let o=$('profileModalOverlay');
    if(!o){
      o=document.createElement('div'); o.id='profileModalOverlay'; o.className='profile-modal-overlay'; document.body.appendChild(o);
    }
    o.onclick=window.closeProfileModal;
    o.innerHTML=`<div class="profile-modal" onclick="event.stopPropagation()">
      <button class="profile-modal-close" type="button" onclick="closeProfileModal()">×</button>
      <h2 id="profileModalTitle">Sign in/up</h2><p id="profileModalText">Sign in to save your profile, product access and generator details.</p>
      <div id="profileViewBox" style="display:none;"><div class="profile-menu-head"><div class="profile-avatar"><span id="profileViewInitial">?</span></div><div class="profile-menu-id"><strong id="profileViewName">Guest</strong><span id="profileViewEmail">Not logged in</span></div></div><a class="profile-main-btn" href="profile.html">Edit full profile</a></div>
      <form id="profileForm" class="profile-form"><input id="profileNameInput" type="text" placeholder="Your name" autocomplete="name"><input id="profileEmailInput" type="email" placeholder="your@email.com" autocomplete="email"><label class="profile-remember-row"><input id="profileRememberInput" type="checkbox"> Remember my login</label><button class="profile-main-btn" type="submit">Sign in/up</button><button class="profile-google-btn" type="button" onclick="fakeGoogleLogin()">Continue with Google</button></form>
    </div>`;
    const form=$('profileForm');
    form.addEventListener('submit',function(e){e.preventDefault(); const name=$('profileNameInput').value.trim(); const email=$('profileEmailInput').value.trim(); if(!name||!email||!email.includes('@')){alert('Enter a valid name and email.');return;} saveFitBrandUser({name,email},$('profileRememberInput').checked); closeProfileModal();});
    return o;
  }
  window.openProfileModal=function(mode){const o=ensureProfileModal(); const u=getUser(); const form=$('profileForm'), view=$('profileViewBox'), title=$('profileModalTitle'), text=$('profileModalText'); $('profileMenu')?.classList.remove('show'); if(mode==='profile'&&u){title.textContent='Your Profile'; text.textContent='Your saved FitBrand profile on this device.'; form.style.display='none'; view.style.display='block';}else{title.textContent='Sign in/up'; text.textContent='Log in or create an account. Your details can auto-fill FitBrand generators.'; form.style.display='grid'; view.style.display='none'; $('profileNameInput').value=u?.name||''; $('profileEmailInput').value=u?.email||'';} updateFitBrandProfileUI(); o.classList.add('show');};
  window.closeProfileModal=function(){$('profileModalOverlay')?.classList.remove('show');};
  window.fakeGoogleLogin=function(){const email=prompt('Enter your Google email:'); if(!email||!email.includes('@'))return; const name=email.split('@')[0].replace(/[._-]/g,' ').replace(/\b\w/g,c=>c.toUpperCase()); saveFitBrandUser({name,email},true); closeProfileModal();};

  function welcome(){if(getUser()||sessionStorage.getItem(WELCOME_KEY))return; let o=$('fitbrandWelcomeOverlay'); if(!o){o=document.createElement('div'); o.id='fitbrandWelcomeOverlay'; o.className='fb-welcome-overlay'; o.innerHTML=`<div class="fb-welcome-card"><div class="premium-badge">FitBrand Account</div><h2>Welcome to FitBrand</h2><p>Sign in to save profile details, product access and generator settings. You can also continue as guest.</p><div class="fb-welcome-actions"><button class="fb-welcome-primary" type="button" onclick="openProfileFromWelcome()">Sign in/up</button><button class="fb-welcome-secondary" type="button" onclick="continueAsGuest()">Continue as guest</button></div></div>`; document.body.appendChild(o);} setTimeout(()=>o.classList.add('show'),350);}
  window.openProfileFromWelcome=function(){sessionStorage.setItem(WELCOME_KEY,'true'); $('fitbrandWelcomeOverlay')?.classList.remove('show'); openProfileModal('login');};
  window.continueAsGuest=function(){sessionStorage.setItem(WELCOME_KEY,'true'); $('fitbrandWelcomeOverlay')?.classList.remove('show');};

  window.addToCart=function(product){if(!validProducts.includes(product))return; const c=getCart(); c.push(product); save(CART_KEY,c); updateCartCount(); showMiniCartPopup();};
  window.updateCartCount=function(){const c=getCart(); save(CART_KEY,c); document.querySelectorAll('#cart-count,#cart-count-btn').forEach(el=>{el.textContent=c.length; el.style.display=c.length?'inline-flex':'none';}); renderCartDrawer();};
  window.showMiniCartPopup=function(){const p=$('mini-cart-popup'); if(p){p.classList.add('show'); setTimeout(()=>p.classList.remove('show'),2600);}};
  window.openCartDrawer=function(){$('cart-drawer')?.classList.add('show'); $('drawer-overlay')?.classList.add('show'); renderCartDrawer();};
  window.closeCartDrawer=function(){$('cart-drawer')?.classList.remove('show'); $('drawer-overlay')?.classList.remove('show');};
  window.renderCartDrawer=function(){const box=$('drawer-items'), totalEl=$('drawer-total'); if(!box||!totalEl)return; const c=getCart(); if(!c.length){box.innerHTML='<p>Your cart is empty.</p>'; totalEl.textContent='€0.00'; return;} let total=0; box.innerHTML=c.map((key,i)=>{const p=catalog[key]||catalog.bundle; total+=p.price; return `<div class="drawer-item"><div><strong>${p.name}</strong><span>FitBrand product</span></div><div><strong>€${p.price.toFixed(2)}</strong><br><button class="remove-item-btn" onclick="removeDrawerItem(${i})">Remove</button></div></div>`;}).join(''); const discount=localStorage.getItem('fitbrandDiscount')==='FIT10'?0.10:(window.fitbrandDiscount||0); totalEl.textContent='€'+(total*(1-discount)).toFixed(2);};
  window.removeDrawerItem=function(index){const c=getCart(); c.splice(index,1); save(CART_KEY,c); updateCartCount();};
  window.applyDrawerDiscount=function(){const code=($('drawer-discount')?.value||'').trim().toUpperCase(); const msg=$('drawer-discount-message'); if(code==='FIT10'){localStorage.setItem('fitbrandDiscount','FIT10'); if(msg)msg.textContent='Discount applied: 10% off.';}else{localStorage.removeItem('fitbrandDiscount'); if(msg)msg.textContent='Invalid code. Try FIT10.';} renderCartDrawer();};

  function unlockFromUrl(){const p=new URLSearchParams(location.search).get('purchased')||new URLSearchParams(location.search).get('product'); if(p)addPurchase(p);}
  window.prefillGeneratorsFromProfile=function(){const u=getUser(); if(!u)return; const map={mealAge:u.age,mealWeight:u.weight,mealHeight:u.height,mealGender:u.gender,mealTrainingDays:u.trainingDays,mealGoal:u.goal,mealAvoid:u.allergies,modalAge:u.age,modalWeight:u.weight,modalHeight:u.height,modalGender:u.gender,modalDays:u.trainingDays,modalPlace:u.trainingLocation,modalLevel:u.level,modalGoal:u.goal}; Object.entries(map).forEach(([id,val])=>{const el=$(id); if(el&&val&&!el.value)el.value=val;});};
  function profileHasBasics(u){return !!(u&&(u.age||u.weight||u.height||u.gender||u.trainingDays||u.goal));}

  window.handleMealPreviewClick=function(){if(getPurchases().includes('mealplan')||getPurchases().includes('bundle')||localStorage.getItem('fitbrandMealPlanUnlocked')==='true'){openMealPlanGenerator();}else{$('meal-plan-guide-ai')?.scrollIntoView({behavior:'smooth',block:'start'}); const btn=document.querySelector('a[href="checkout.html?product=mealplan"]'); if(btn){btn.style.boxShadow='0 0 0 4px rgba(0,0,0,.12),0 18px 45px rgba(0,0,0,.24)'; setTimeout(()=>btn.style.boxShadow='',1600);}}};
  window.openMealPlanGenerator=function(){const g=$('meal-plan-ai'); if(!g)return; g.classList.add('unlocked'); $('mealGenerator')?.classList.add('show'); setupMealWizard(); prefillGeneratorsFromProfile(); g.scrollIntoView({behavior:'smooth',block:'start'});};
  window.checkMealPurchase=function(){unlockFromUrl(); if(getPurchases().includes('mealplan')||getPurchases().includes('bundle')||location.hash==='#meal-plan-ai') openMealPlanGenerator();};

  function setupMealWizard(){
    const gen=$('mealGenerator'), grid=document.querySelector('#meal-plan-ai .meal-grid'); if(!gen||!grid||$('fbMealWizard'))return;
    grid.classList.add('fb-meal-grid-collapsed');
    const u=getUser();
    const panel=document.createElement('div'); panel.id='fbMealWizard'; panel.className='fb-meal-wizard';
    panel.innerHTML=`<div class="fb-meal-choice-head"><div><h3>Build your meal plan</h3><p>Step by step. Use your saved profile or change details anytime.</p></div><div id="fbMealStepPill" class="fb-meal-step-pill">1 / 6</div></div>
      <div class="fb-meal-profile-summary"><div><strong>${profileHasBasics(u)?'Saved profile found':'No full profile yet'}</strong><span>${profileHasBasics(u)?`${u.name||u.email} • ${u.age||'?'} years • ${u.weight||'?'}kg • ${u.height||'?'}cm`:'You can still continue manually.'}</span></div><div class="fb-meal-profile-actions"><button type="button" data-act="useProfile">Use saved profile</button><a href="profile.html">Change information</a></div></div>
      <div class="fb-meal-question active" data-step="1"><h4>What is your goal?</h4><div class="fb-meal-options"><button type="button" data-field="mealGoal" data-value="fatloss"><strong>Lose fat</strong><span>Controlled calories and high protein.</span></button><button type="button" data-field="mealGoal" data-value="muscle"><strong>Build muscle</strong><span>More food to fuel growth.</span></button><button type="button" data-field="mealGoal" data-value="maintenance"><strong>Maintain</strong><span>Balanced clean eating.</span></button></div></div>
      <div class="fb-meal-question" data-step="2"><h4>Your body info</h4><div class="fb-meal-mini-form"><input id="wizAge" type="number" placeholder="Age"><select id="wizGender"><option value="">Gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select><input id="wizWeight" type="number" placeholder="Weight kg"><input id="wizHeight" type="number" placeholder="Height cm"></div></div>
      <div class="fb-meal-question" data-step="3"><h4>Training days</h4><div class="fb-meal-options"><button type="button" data-field="mealTrainingDays" data-value="0"><strong>0-1 days</strong><span>Low activity setup.</span></button><button type="button" data-field="mealTrainingDays" data-value="3"><strong>2-3 days</strong><span>Simple and realistic.</span></button><button type="button" data-field="mealTrainingDays" data-value="5"><strong>4-5 days</strong><span>Strong progress.</span></button><button type="button" data-field="mealTrainingDays" data-value="6"><strong>6+ days</strong><span>High performance.</span></button></div></div>
      <div class="fb-meal-question" data-step="4"><h4>Meals per day</h4><div class="fb-meal-options compact"><button type="button" data-field="mealMeals" data-value="3">3 meals</button><button type="button" data-field="mealMeals" data-value="4">4 meals</button><button type="button" data-field="mealMeals" data-value="5">5 meals</button></div></div>
      <div class="fb-meal-question" data-step="5"><h4>Food style</h4><div class="fb-meal-options"><button type="button" data-field="mealDiet" data-value="highprotein"><strong>High protein</strong><span>Best for results.</span></button><button type="button" data-field="mealDiet" data-value="budget"><strong>Budget friendly</strong><span>Cheaper meals.</span></button><button type="button" data-field="mealDiet" data-value="easy"><strong>Easy / fast</strong><span>Simple meals.</span></button><button type="button" data-field="mealDiet" data-value="vegetarian"><strong>Vegetarian</strong><span>No meat.</span></button></div></div>
      <div class="fb-meal-question" data-step="6"><h4>Final details</h4><div class="fb-meal-mini-form"><select id="wizTime"><option value="normal">Normal cooking time</option><option value="fast">Under 15 min</option><option value="prep">Meal prep friendly</option></select><select id="wizDifficulty"><option value="easy">Easy to follow</option><option value="flexible">Flexible lifestyle</option><option value="strict">Strict / precise</option></select><input id="wizAvoid" class="wide" placeholder="Foods to avoid / allergies"></div><button id="wizGenerate" class="fb-meal-generate-final" type="button">Generate my 7-day meal plan</button></div>
      <div class="fb-meal-choice-actions"><button id="wizBack" class="fb-meal-back" type="button">Back</button><button id="wizNext" class="fb-meal-next" type="button">Next</button></div>`;
    gen.insertBefore(panel,grid);
    let step=1;
    function el(id){return document.getElementById(id)}
    function sync(){
      const prof=getUser();
      if(prof){if(!el('wizAge').value)el('wizAge').value=prof.age||''; if(!el('wizGender').value)el('wizGender').value=prof.gender||''; if(!el('wizWeight').value)el('wizWeight').value=prof.weight||''; if(!el('wizHeight').value)el('wizHeight').value=prof.height||''; if(!el('wizAvoid').value)el('wizAvoid').value=prof.allergies||'';}
      const map={mealAge:el('wizAge').value,mealGender:el('wizGender').value,mealWeight:el('wizWeight').value,mealHeight:el('wizHeight').value,mealTime:el('wizTime').value,mealDifficulty:el('wizDifficulty').value,mealAvoid:el('wizAvoid').value};
      Object.entries(map).forEach(([id,val])=>{const target=el(id); if(target)target.value=val||target.value;});
    }
    function render(){panel.querySelectorAll('.fb-meal-question').forEach(q=>q.classList.toggle('active',Number(q.dataset.step)===step)); el('fbMealStepPill').textContent=step+' / 6'; el('wizBack').style.visibility=step===1?'hidden':'visible'; el('wizNext').style.display=step===6?'none':'inline-flex'; sync();}
    panel.addEventListener('click',function(e){const b=e.target.closest('button'); if(!b)return; if(b.dataset.act==='useProfile'){prefillGeneratorsFromProfile(); sync(); step=2; render(); return;} if(b.dataset.field){const target=$(b.dataset.field); if(target)target.value=b.dataset.value; b.parentElement.querySelectorAll('button').forEach(x=>x.classList.remove('selected')); b.classList.add('selected');} if(b.id==='wizGenerate'){sync(); if(typeof window.generateMealPlan==='function')window.generateMealPlan();}});
    el('wizBack').addEventListener('click',()=>{if(step>1){step--;render();}});
    el('wizNext').addEventListener('click',()=>{sync(); if(step<6){step++;render();}});
    prefillGeneratorsFromProfile(); sync(); render();
  }

  window.generateModalPlan=function(){const purchased=getPurchases(); let pkg=$('modalPackage')?.value||localStorage.getItem(PROGRAM_KEY)||'aesthetic'; if(pkg==='bundle'){pkg=($('modalGoal')?.value==='fatloss')?'shred':($('modalGoal')?.value==='strength')?'strength':'aesthetic';} if(!programProducts.includes(pkg))pkg='aesthetic'; if(!purchased.includes('bundle')&&!purchased.includes(pkg)){alert('This generator is only available for the program you purchased.');return;} const place=$('modalPlace')?.value||getUser()?.trainingLocation||'gym'; const days=Math.max(3,Math.min(6,parseInt($('modalDays')?.value||getUser()?.trainingDays||4,10))); const level=$('modalLevel')?.value||getUser()?.level||'beginner'; const data=(planLibrary[pkg]&&planLibrary[pkg][place])?planLibrary[pkg][place]:planLibrary[pkg].gym; const selected=data.slice(0,days); const titleMap={aesthetic:'Aesthetic Program',shred:'Shred Program',strength:'Strength Program'}; if($('modalPlanTitle'))$('modalPlanTitle').textContent='Your '+titleMap[pkg]+' Plan'; if($('modalPlanSubtitle'))$('modalPlanSubtitle').textContent=`Based on your purchased ${titleMap[pkg]}, ${days} days/week, ${place} training and ${level} level.`; if($('modalPlanPill'))$('modalPlanPill').textContent=days+' DAYS / '+place.toUpperCase(); if($('modalPlanDays'))$('modalPlanDays').innerHTML=selected.map(d=>`<div class="fb-plan-day"><h4>${d[0]}</h4><ul>${d[1].map(x=>`<li>${x}</li>`).join('')}</ul></div>`).join(''); const out=$('modalPlanOutput'); if(out){out.classList.add('show'); ensureProgramDownloadButtons(); out.scrollIntoView({behavior:'smooth',block:'nearest'});}};
  function ensureProgramDownloadButtons(){const out=$('modalPlanOutput'); if(!out||$('programDownloadActions'))return; const row=document.createElement('div'); row.id='programDownloadActions'; row.className='program-download-actions'; row.innerHTML='<button type="button" onclick="downloadProgramPDF()">Download PDF</button><button type="button" onclick="downloadProgramPNG()">Download PNG</button>'; out.appendChild(row);}
  window.downloadProgramPDF=function(){const out=$('modalPlanOutput'); if(!out||!out.classList.contains('show')){alert('Generate your plan first.');return;} const w=window.open('','_blank'); w.document.write('<html><head><title>FitBrand Program</title><style>body{font-family:Arial;padding:34px;color:#111}h1{font-size:30px}.day{border:1px solid #ddd;border-radius:14px;padding:16px;margin:12px 0}li{margin:6px 0}</style></head><body><h1>'+($('modalPlanTitle')?.textContent||'FitBrand Program')+'</h1><p>'+($('modalPlanSubtitle')?.textContent||'')+'</p>'+Array.from(document.querySelectorAll('#modalPlanDays .fb-plan-day')).map(d=>'<div class="day">'+d.innerHTML+'</div>').join('')+'<script>window.print()<\/script></body></html>'); w.document.close();};
  window.downloadProgramPNG=function(){const out=$('modalPlanOutput'); if(!out||!out.classList.contains('show')){alert('Generate your plan first.');return;} const text=(($('modalPlanTitle')?.textContent||'FitBrand Program')+'\n'+($('modalPlanSubtitle')?.textContent||'')+'\n\n'+Array.from(document.querySelectorAll('#modalPlanDays .fb-plan-day')).map(d=>d.innerText).join('\n\n')).split('\n'); const c=document.createElement('canvas'),ctx=c.getContext('2d'); c.width=1200; c.height=Math.max(900,170+text.length*30); ctx.fillStyle='#080808'; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle='#fff'; ctx.font='bold 44px Arial'; ctx.fillText('FITBRAND PROGRAM',60,70); ctx.font='24px Arial'; let y=125; text.forEach(line=>{ctx.fillText(line.slice(0,95),60,y); y+=30;}); const a=document.createElement('a'); a.download='fitbrand-program.png'; a.href=c.toDataURL('image/png'); a.click();};

  function checkoutGuard(){const pay=$('stripe-link'); if(!pay||pay.dataset.fitbrandGuard)return; pay.dataset.fitbrandGuard='1'; pay.addEventListener('click',function(e){const emailEl=$('checkout-email')||document.querySelector('input[type="email"]'); const email=(emailEl?.value||'').trim(); if(!email||!email.includes('@')){e.preventDefault(); alert('Please enter your email before continuing to payment.'); emailEl?.focus(); return;} if(!getUser())saveFitBrandUser({name:email.split('@')[0],email},true); const params=new URLSearchParams(location.search); const items=(params.get('cart')==='true'?getCart():[params.get('product')||'bundle']).filter(x=>validProducts.includes(x)); items.forEach(addPurchase);},true);}
  function profilePage(){const f=$('fullProfileForm'); if(!f||f.dataset.fitbrandBound)return; f.dataset.fitbrandBound='1'; const u=getUser()||{}; const ids={pfName:'name',pfEmail:'email',pfPhone:'phone',pfAddress:'address',pfGender:'gender',pfAge:'age',pfWeight:'weight',pfHeight:'height',pfLevel:'level',pfTrainingLocation:'trainingLocation',pfTrainingDays:'trainingDays',pfEquipment:'equipment',pfAllergies:'allergies',pfGoal:'goal'}; Object.entries(ids).forEach(([id,k])=>{const input=$(id); if(input&&u[k])input.value=u[k];}); f.addEventListener('submit',function(e){e.preventDefault(); const d={}; Object.entries(ids).forEach(([id,k])=>{d[k]=($(id)?.value||'').trim();}); if(!d.name||!d.email||!d.email.includes('@')){alert('Please add a valid name and email.');return;} saveFitBrandUser(d,true); location.href='index.html';});}
  function accountPages(){const access=$('accessGrid'), orders=$('ordersList'); if(!access&&!orders)return; const u=getUser(), p=getPurchases(); const locked=$('accountLocked'); if(locked)locked.style.display=u?'none':'grid'; const intro=$('accountIntro'); if(intro)intro.textContent=u?'Logged in as '+(u.email||u.name)+'.':'Log in to see saved products and orders on this device.'; if(access){access.innerHTML=Object.entries(catalog).map(([k,v])=>{const has=p.includes(k)||(k==='mealplan'&&p.includes('bundle')); return `<div class="access-card ${has?'':'locked'}"><strong>${v.name}</strong><span>${has?'You have access.':'You do not have access yet.'}</span><a href="${has?v.open:v.buy}">${has?'Open':'Buy access'}</a></div>`;}).join('');} if(orders){const list=parse(localStorage.getItem(ORDERS_KEY),[]); orders.innerHTML=list.length?list.map(o=>`<div class="order-row"><div><strong>${productName(o.product)}</strong><br><span>${new Date(o.date).toLocaleString()} • ${o.status||'Confirmed'}</span></div><a class="btn-outline" href="${catalog[o.product]?.open||'index.html'}">Open</a></div>`).join(''):'<p>No orders saved on this device yet.</p>';}}
  function confirmation(){if(!location.pathname.endsWith('confirmation.html'))return; const p=new URLSearchParams(location.search).get('product')||'bundle'; addPurchase(p); const orders=parse(localStorage.getItem(ORDERS_KEY),[]); if(!orders.some(o=>o.product===p&&Date.now()-new Date(o.date).getTime()<5000)){orders.push({product:p,date:new Date().toISOString(),status:'Confirmed'}); save(ORDERS_KEY,orders);}}
  function wireCartIcon(){document.querySelectorAll('.cart-icon-btn').forEach(btn=>{if(btn.dataset.fitbrandCartBound)return; btn.dataset.fitbrandCartBound='1'; btn.addEventListener('click',function(e){e.preventDefault(); openCartDrawer();});});}
  function init(){ensureHeader(); ensureProfileModal(); updateFitBrandProfileUI(); welcome(); unlockFromUrl(); prefillGeneratorsFromProfile(); if($('mealGenerator'))setupMealWizard(); checkoutGuard(); profilePage(); accountPages(); confirmation(); updateCartCount(); wireCartIcon(); document.addEventListener('click',function(e){const m=$('profileMenu'),b=document.querySelector('.profile-icon-btn'); if(m&&b&&!m.contains(e.target)&&!b.contains(e.target))m.classList.remove('show');});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init); else init();
})();

/* Compatibility aliases for older page buttons */
window.saveFitBrandProfile = window.saveFitBrandProfile || function(){
  const name=(document.getElementById('editProfileName')?.value || document.getElementById('profileNameInput')?.value || '').trim();
  const email=(document.getElementById('editProfileEmail')?.value || document.getElementById('profileEmailInput')?.value || '').trim();
  if(!name || !email || !email.includes('@')){ alert('Please enter a valid name and email.'); return; }
  window.saveFitBrandUser({name,email}, true);
  window.closeProfileModal?.();
};
window.loginFitBrandUser = window.loginFitBrandUser || function(){
  const name=(document.getElementById('loginProfileName')?.value || document.getElementById('profileNameInput')?.value || '').trim();
  const email=(document.getElementById('loginProfileEmail')?.value || document.getElementById('profileEmailInput')?.value || '').trim();
  if(!name || !email || !email.includes('@')){ alert('Please enter a valid name and email.'); return; }
  window.saveFitBrandUser({name,email}, !!document.getElementById('profileRememberInput')?.checked);
  window.closeProfileModal?.();
};

/* ===== FITBRAND CUSTOMER-READY FINAL OVERRIDE v10 ===== */
(function(){
  'use strict';

  const USER_KEY = 'fitbrandUser';
  const SESSION_KEY = 'fitbrandSessionUser';
  const CART_KEY = 'fitbrandCart';
  const PURCHASES_KEY = 'fitbrandPurchases';
  const ORDERS_KEY = 'fitbrandOrders';
  const PENDING_ORDER_KEY = 'fitbrandPendingOrder';
  const WELCOME_KEY = 'fitbrandWelcomeSeenSessionV10';
  const PROGRAM_KEY = 'fitbrandPurchasedPackage';

  const catalog = {
    aesthetic: {name:'Aesthetic Program', price:4.99, type:'digital', category:'program', open:'index.html?purchased=aesthetic', buy:'checkout.html?product=aesthetic'},
    shred: {name:'Shred Program', price:6.99, type:'digital', category:'program', open:'index.html?purchased=shred', buy:'checkout.html?product=shred'},
    strength: {name:'Strength Program', price:6.99, type:'digital', category:'program', open:'index.html?purchased=strength', buy:'checkout.html?product=strength'},
    bundle: {name:'Complete Bundle + Meal Plan AI', price:18.97, type:'digital', category:'bundle', open:'index.html?purchased=bundle', buy:'checkout.html?product=bundle'},
    mealplan: {name:'Meal Plan Guide AI', price:5.99, type:'digital', category:'guide', open:'recommended.html?purchased=mealplan#meal-plan-ai', buy:'checkout.html?product=mealplan'},
    belt: {name:'Lifting Belt', price:24.99, type:'physical', category:'gear', open:'product-belt.html', buy:'checkout.html?product=belt'},
    straps: {name:'Lifting Straps', price:12.99, type:'physical', category:'gear', open:'product-straps.html', buy:'checkout.html?product=straps'}
  };

  const validProducts = Object.keys(catalog);
  const accessProducts = ['aesthetic','shred','strength','bundle','mealplan'];
  const programProducts = ['aesthetic','shred','strength'];

  const planLibrary = {
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

  function $(id){ return document.getElementById(id); }
  function readJSON(key, fallback){ try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch(e){ return fallback; } }
  function writeJSON(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
  function validEmail(email){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email||'').trim()); }
  function money(n){ return '€' + Number(n||0).toFixed(2); }
  function getCart(){ return readJSON(CART_KEY, []).filter(k => validProducts.includes(k)); }
  function setCart(cart){ writeJSON(CART_KEY, cart.filter(k => validProducts.includes(k))); }
  function getUser(){ return readJSON(SESSION_KEY, null) || readJSON(USER_KEY, null); }
  function getInitials(user){
    if(!user || !user.name) return '?';
    const parts = String(user.name).trim().split(/\s+/).filter(Boolean);
    if(!parts.length) return '?';
    return ((parts[0][0] || '') + (parts.length > 1 ? (parts[parts.length-1][0] || '') : '')).toUpperCase();
  }
  function expandAccess(items){
    const set = new Set((items || []).filter(k => validProducts.includes(k)));
    const oldPackage = localStorage.getItem(PROGRAM_KEY);
    if(validProducts.includes(oldPackage)) set.add(oldPackage);
    if(localStorage.getItem('fitbrandMealPlanUnlocked') === 'true') set.add('mealplan');
    if(set.has('bundle')) ['aesthetic','shred','strength','mealplan'].forEach(k => set.add(k));
    return [...set];
  }
  function getPurchases(){ return expandAccess(readJSON(PURCHASES_KEY, [])); }
  function savePurchases(items){
    const p = expandAccess(items);
    writeJSON(PURCHASES_KEY, p);
    if(p.includes('mealplan')) localStorage.setItem('fitbrandMealPlanUnlocked','true');
  }
  function addPurchase(key){
    if(!validProducts.includes(key)) return;
    const p = getPurchases();
    p.push(key);
    if(key === 'bundle') p.push('aesthetic','shred','strength','mealplan');
    savePurchases(p);
    if(programProducts.includes(key) || key === 'bundle') localStorage.setItem(PROGRAM_KEY, key);
  }
  function purchased(key){ const p = getPurchases(); return p.includes(key) || (key === 'mealplan' && p.includes('bundle')); }
  function getCheckoutItems(){ const params = new URLSearchParams(location.search); if(params.get('cart') === 'true') return getCart(); return [params.get('product') || 'bundle'].filter(k => validProducts.includes(k)); }

  window.fitbrandCatalog = catalog;
  window.getFitBrandUser = getUser;

  window.saveFitBrandUser = function(data, remember){
    const current = getUser() || {};
    const merged = Object.assign({}, current, data || {});
    if(!merged.name && merged.email) merged.name = String(merged.email).split('@')[0];
    if(remember){ writeJSON(USER_KEY, merged); sessionStorage.removeItem(SESSION_KEY); }
    else { sessionStorage.setItem(SESSION_KEY, JSON.stringify(merged)); }
    sessionStorage.setItem(WELCOME_KEY,'true');
    updateFitBrandProfileUI();
    prefillGeneratorsFromProfile(true);
    return merged;
  };

  window.logoutFitBrandUser = function(){
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    updateFitBrandProfileUI();
    $('profileMenu')?.classList.remove('show');
    $('profileModalOverlay')?.classList.remove('show');
    showNotice('Logged out');
  };

  function ensureHeader(){
    const nav = document.querySelector('header.nav');
    if(!nav) return;
    let actions = nav.querySelector('.nav-actions');
    let cart = nav.querySelector('.cart-icon-btn');
    if(!actions){
      actions = document.createElement('div');
      actions.className = 'nav-actions';
      if(cart){ cart.parentNode.insertBefore(actions, cart); actions.appendChild(cart); }
      else nav.appendChild(actions);
    }
    if(!actions.querySelector('.cart-icon-btn')){
      cart = document.createElement('a');
      cart.href = 'cart.html';
      cart.className = 'cart-icon-btn';
      cart.innerHTML = '<span class="cart-svg">🛒</span><span class="cart-count" id="cart-count-btn">0</span>';
      actions.insertBefore(cart, actions.firstChild);
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
    let menu = $('profileMenu');
    if(!menu){
      menu = document.createElement('div');
      menu.id = 'profileMenu';
      menu.className = 'profile-menu';
      actions.appendChild(menu);
    }
  }

  function renderProfileMenu(){
    const menu = $('profileMenu');
    if(!menu) return;
    const u = getUser();
    const ini = getInitials(u);
    menu.innerHTML = `
      <div class="profile-menu-head">
        <div class="profile-avatar"><span id="profileMenuInitial">${ini}</span></div>
        <div class="profile-menu-id">
          <strong id="profileMenuName" title="${u?.name || 'Guest'}">${u?.name || 'Guest'}</strong>
          <span id="profileMenuEmail" title="${u?.email || 'Not logged in'}">${u?.email || 'Not logged in'}</span>
        </div>
      </div>
      <button type="button" onclick="openProfileModal('profile')">View profile</button>
      <a class="profile-menu-link" href="profile.html">Edit profile information</a>
      ${u ? `<div class="profile-menu-account-links">
          <a class="profile-menu-link" href="products-access.html">My products / access</a>
          <a class="profile-menu-link" href="orders.html">My orders</a>
        </div>` : ''}
      <button id="profileLoginBtn" type="button" onclick="openProfileModal('login')" style="display:${u ? 'none':'block'}">Log in</button>
      <button id="profileLogoutBtn" type="button" onclick="logoutFitBrandUser()" style="display:${u ? 'block':'none'}">Log out</button>
    `;
  }

  window.updateFitBrandProfileUI = function(){
    ensureHeader();
    const u = getUser();
    const ini = getInitials(u);
    document.querySelectorAll('#profileInitial,#profileMenuInitial,#profileViewInitial,#profileModalInitial').forEach(el => { if(el) el.textContent = ini; });
    document.querySelectorAll('#profileMenuName,#profileViewName').forEach(el => { if(el) el.textContent = u?.name || 'Guest'; });
    document.querySelectorAll('#profileMenuEmail,#profileViewEmail').forEach(el => { if(el) el.textContent = u?.email || 'Not logged in'; });
    document.querySelectorAll('#profileLoginBtn').forEach(el => { el.style.display = u ? 'none':'block'; });
    document.querySelectorAll('#profileLogoutBtn').forEach(el => { el.style.display = u ? 'block':'none'; });
    renderProfileMenu();
  };

  window.toggleProfileMenu = function(){ ensureHeader(); renderProfileMenu(); $('profileMenu')?.classList.toggle('show'); };

  function ensureProfileModal(){
    let overlay = $('profileModalOverlay');
    if(!overlay){ overlay = document.createElement('div'); overlay.id = 'profileModalOverlay'; overlay.className = 'profile-modal-overlay'; document.body.appendChild(overlay); }
    overlay.onclick = window.closeProfileModal;
    overlay.innerHTML = `
      <div class="profile-modal profile-modal-pro" onclick="event.stopPropagation()">
        <button class="profile-modal-close" type="button" onclick="closeProfileModal()">×</button>
        <div class="profile-modal-top">
          <div class="profile-avatar large"><span id="profileViewInitial">${getInitials(getUser())}</span></div>
          <div><h2 id="profileModalTitle">Sign in/up</h2><p id="profileModalText">Save your FitBrand profile, access and generator details on this device.</p></div>
        </div>
        <div id="profileViewBox" style="display:none;">
          <div class="profile-info-box"><strong>Name</strong><span id="profileViewName">${getUser()?.name || 'Guest'}</span></div>
          <div class="profile-info-box"><strong>Email</strong><span id="profileViewEmail">${getUser()?.email || 'Not logged in'}</span></div>
          <div class="profile-modal-actions"><a class="profile-main-btn" href="profile.html">Edit full profile</a><a class="profile-google-btn" href="products-access.html">My products</a><a class="profile-google-btn" href="orders.html">My orders</a></div>
        </div>
        <form id="profileForm" class="profile-form">
          <input id="profileNameInput" type="text" placeholder="Your full name" autocomplete="name">
          <input id="profileEmailInput" type="email" placeholder="your@email.com" autocomplete="email">
          <label class="profile-remember-row"><input id="profileRememberInput" type="checkbox"> Remember my login</label>
          <button class="profile-main-btn" type="submit">Sign in/up</button>
          <button class="profile-google-btn" type="button" onclick="fakeGoogleLogin()">Continue with Google</button>
        </form>
      </div>`;
    const form = $('profileForm');
    if(form && !form.dataset.customerReadyBound){
      form.dataset.customerReadyBound = '1';
      form.addEventListener('submit', function(e){
        e.preventDefault();
        const name = ($('profileNameInput')?.value || '').trim();
        const email = ($('profileEmailInput')?.value || '').trim();
        if(!name || !validEmail(email)){ alert('Please enter your full name and a valid email.'); return; }
        saveFitBrandUser({name, email}, !!$('profileRememberInput')?.checked);
        closeProfileModal();
        showNotice('Signed in');
      });
    }
    return overlay;
  }

  window.openProfileModal = function(mode){
    const overlay = ensureProfileModal();
    const u = getUser();
    const title = $('profileModalTitle');
    const text = $('profileModalText');
    const form = $('profileForm');
    const view = $('profileViewBox');
    $('profileMenu')?.classList.remove('show');
    if(mode === 'profile' && u){
      title.textContent = 'Your Profile';
      text.textContent = 'Your saved FitBrand account details on this device.';
      if(form) form.style.display = 'none';
      if(view) view.style.display = 'block';
    } else {
      title.textContent = 'Sign in/up';
      text.textContent = 'Log in or create an account. Your information can auto-fill FitBrand generators.';
      if(form) form.style.display = 'grid';
      if(view) view.style.display = 'none';
      if($('profileNameInput')) $('profileNameInput').value = u?.name || '';
      if($('profileEmailInput')) $('profileEmailInput').value = u?.email || '';
    }
    updateFitBrandProfileUI();
    overlay.classList.add('show');
  };
  window.closeProfileModal = function(){ $('profileModalOverlay')?.classList.remove('show'); };
  window.fakeGoogleLogin = function(){
    const email = prompt('Enter your Google email:');
    if(!validEmail(email)) return;
    const name = String(email).split('@')[0].replace(/[._-]/g,' ').replace(/\b\w/g, c => c.toUpperCase());
    saveFitBrandUser({name, email}, true);
    closeProfileModal();
    showNotice('Signed in');
  };

  function showWelcome(){
    const path = location.pathname.split('/').pop() || 'index.html';
    const blocked = ['checkout.html','confirmation.html','profile.html','products-access.html','orders.html','cart.html'];
    if(blocked.includes(path) || getUser() || sessionStorage.getItem(WELCOME_KEY)) return;
    let overlay = $('fitbrandWelcomeOverlay');
    if(!overlay){
      overlay = document.createElement('div');
      overlay.id = 'fitbrandWelcomeOverlay';
      overlay.className = 'fb-welcome-overlay';
      overlay.innerHTML = `<div class="fb-welcome-card"><div class="premium-badge">FitBrand account</div><h2>Welcome to FitBrand</h2><p>Sign in to save your profile, orders, product access and generator settings. You can also continue as guest.</p><div class="fb-welcome-actions"><button class="fb-welcome-primary" type="button" onclick="openProfileFromWelcome()">Sign in/up</button><button class="fb-welcome-secondary" type="button" onclick="continueAsGuest()">Continue as guest</button></div></div>`;
      document.body.appendChild(overlay);
    }
    setTimeout(() => overlay.classList.add('show'), 550);
  }
  window.openProfileFromWelcome = function(){ sessionStorage.setItem(WELCOME_KEY,'true'); $('fitbrandWelcomeOverlay')?.classList.remove('show'); openProfileModal('login'); };
  window.continueAsGuest = function(){ sessionStorage.setItem(WELCOME_KEY,'true'); $('fitbrandWelcomeOverlay')?.classList.remove('show'); };

  window.addToCart = function(product){ if(!validProducts.includes(product)) return; const cart = getCart(); cart.push(product); setCart(cart); updateCartCount(); showMiniCartPopup(); };
  window.updateCartCount = function(){ const cart = getCart(); document.querySelectorAll('#cart-count,#cart-count-btn').forEach(el => { el.textContent = cart.length; el.style.display = cart.length ? 'inline-flex':'none'; }); renderCartDrawer(); };
  window.showMiniCartPopup = function(){ const popup = $('mini-cart-popup'); if(!popup) return; popup.classList.add('show'); setTimeout(() => popup.classList.remove('show'), 2500); };
  window.openCartDrawer = function(){ $('cart-drawer')?.classList.add('show'); $('drawer-overlay')?.classList.add('show'); renderCartDrawer(); };
  window.closeCartDrawer = function(){ $('cart-drawer')?.classList.remove('show'); $('drawer-overlay')?.classList.remove('show'); };
  window.removeDrawerItem = function(index){ const cart = getCart(); cart.splice(index, 1); setCart(cart); updateCartCount(); };
  window.renderCartDrawer = function(){
    const box = $('drawer-items'); const totalEl = $('drawer-total'); if(!box || !totalEl) return; const cart = getCart();
    if(!cart.length){ box.innerHTML = '<p>Your cart is empty.</p>'; totalEl.textContent = '€0.00'; return; }
    let total = 0;
    box.innerHTML = cart.map((key, i) => { const p = catalog[key]; total += p.price; return `<div class="drawer-item"><div><strong>${p.name}</strong><span>${p.type === 'digital' ? 'Digital product' : 'Physical product'}</span></div><div><strong>${money(p.price)}</strong><br><button class="remove-item-btn" onclick="removeDrawerItem(${i})">Remove</button></div></div>`; }).join('');
    const discount = localStorage.getItem('fitbrandDiscount') === 'FIT10' ? .10 : 0;
    totalEl.textContent = money(total * (1 - discount));
  };
  window.applyDrawerDiscount = function(){ const code = ($('drawer-discount')?.value || '').trim().toUpperCase(); const msg = $('drawer-discount-message'); if(code === 'FIT10'){ localStorage.setItem('fitbrandDiscount','FIT10'); if(msg) msg.textContent = 'Discount applied: 10% off.'; } else { localStorage.removeItem('fitbrandDiscount'); if(msg) msg.textContent = 'Invalid code. Try FIT10.'; } renderCartDrawer(); };

  function unlockFromUrl(){ const params = new URLSearchParams(location.search); const p = params.get('purchased'); if(validProducts.includes(p)) addPurchase(p); if(p === 'mealplan' || p === 'bundle') localStorage.setItem('fitbrandMealPlanUnlocked','true'); }
  window.prefillGeneratorsFromProfile = function(overwrite){
    const u = getUser(); if(!u) return;
    const map = {mealAge:u.age, mealWeight:u.weight, mealHeight:u.height, mealGender:u.gender, mealTrainingDays:u.trainingDays, mealGoal:u.goal, mealAvoid:u.allergies, modalAge:u.age, modalWeight:u.weight, modalHeight:u.height, modalGender:u.gender, modalDays:u.trainingDays, modalPlace:u.trainingLocation, modalLevel:u.level, modalGoal:u.goal};
    Object.entries(map).forEach(([id, value]) => { const el = $(id); if(el && value && (overwrite || !el.value)) el.value = value; });
  };
  function profileHasGeneratorInfo(){ const u = getUser(); return !!(u && (u.age || u.weight || u.height || u.gender || u.trainingDays || u.goal)); }

  window.handleMealPreviewClick = function(){
    if(purchased('mealplan') || purchased('bundle')){
      localStorage.setItem('fitbrandMealPlanUnlocked','true');
      const generator = $('meal-plan-ai');
      if(generator){ generator.classList.add('unlocked'); generator.scrollIntoView({behavior:'smooth', block:'start'}); setupMealWizard(); }
    } else { $('meal-plan-guide-ai')?.scrollIntoView({behavior:'smooth', block:'start'}); showNotice('Buy the Meal Plan Guide AI to unlock the generator.'); }
  };

  function setupMealWizard(){
    const generator = $('mealGenerator'); const grid = generator?.querySelector('.meal-grid'); if(!generator || !grid || $('fbMealWizard')) return;
    grid.classList.add('fb-meal-grid-collapsed');
    const user = getUser();
    const panel = document.createElement('div'); panel.id = 'fbMealWizard'; panel.className = 'fb-meal-wizard';
    panel.innerHTML = `<div class="fb-meal-choice-head"><div><h3>Build your meal plan</h3><p>Answer step by step. Your saved profile can auto-fill the boring details.</p></div><div id="fbMealStepPill" class="fb-meal-step-pill">1 / 6</div></div><div class="fb-meal-profile-summary"><div><strong>${user ? 'Profile detected' : 'No saved profile yet'}</strong><span>${user ? 'We can use your saved details. You can still change them.' : 'You can continue manually or create a profile first.'}</span></div><div class="fb-meal-profile-actions"><button type="button" data-action="useProfile" ${profileHasGeneratorInfo() ? '' : 'disabled'}>Use profile</button><a href="profile.html">Change information</a></div></div><div class="fb-meal-question active" data-step="1"><h4>What is your goal?</h4><div class="fb-meal-options"><button type="button" data-field="mealGoal" data-value="muscle"><strong>Build muscle</strong><span>Higher protein and performance-focused calories.</span></button><button type="button" data-field="mealGoal" data-value="fatloss"><strong>Lose fat</strong><span>Simple calorie deficit and filling meals.</span></button><button type="button" data-field="mealGoal" data-value="maintenance"><strong>Maintain</strong><span>Balanced calories and clean eating.</span></button></div></div><div class="fb-meal-question" data-step="2"><h4>Basic information</h4><div class="fb-meal-mini-form"><input id="wizAge" type="number" placeholder="Age"><select id="wizGender"><option value="">Gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select><input id="wizWeight" type="number" placeholder="Weight (kg)"><input id="wizHeight" type="number" placeholder="Height (cm)"></div></div><div class="fb-meal-question" data-step="3"><h4>Training activity</h4><div class="fb-meal-options"><button type="button" data-field="mealTrainingDays" data-value="0"><strong>0-1 days</strong><span>Light activity.</span></button><button type="button" data-field="mealTrainingDays" data-value="3"><strong>2-3 days</strong><span>Moderate training.</span></button><button type="button" data-field="mealTrainingDays" data-value="5"><strong>4-5 days</strong><span>Consistent training.</span></button><button type="button" data-field="mealTrainingDays" data-value="6"><strong>6+ days</strong><span>High training volume.</span></button></div></div><div class="fb-meal-question" data-step="4"><h4>Food style</h4><div class="fb-meal-options"><button type="button" data-field="mealDiet" data-value="normal"><strong>Balanced</strong><span>Normal flexible meals.</span></button><button type="button" data-field="mealDiet" data-value="highprotein"><strong>High protein</strong><span>Extra protein focus.</span></button><button type="button" data-field="mealDiet" data-value="budget"><strong>Budget</strong><span>Cheap and easy meals.</span></button><button type="button" data-field="mealDiet" data-value="easy"><strong>Fast meals</strong><span>Low cooking time.</span></button><button type="button" data-field="mealDiet" data-value="vegetarian"><strong>Vegetarian</strong><span>No meat options.</span></button></div></div><div class="fb-meal-question" data-step="5"><h4>Meals per day</h4><div class="fb-meal-options"><button type="button" data-field="mealMeals" data-value="3"><strong>3 meals</strong><span>Simple and easy.</span></button><button type="button" data-field="mealMeals" data-value="4"><strong>4 meals</strong><span>Balanced day.</span></button><button type="button" data-field="mealMeals" data-value="5"><strong>5 meals</strong><span>More structure.</span></button></div></div><div class="fb-meal-question" data-step="6"><h4>Final details</h4><div class="fb-meal-mini-form"><select id="wizStyle"><option value="balanced">Balanced</option><option value="lowcalorie">Low calorie</option><option value="bulking">Bulking</option><option value="simple">Very simple</option></select><select id="wizTime"><option value="normal">Normal cooking</option><option value="fast">Under 15 min</option><option value="prep">Meal prep friendly</option></select><input id="wizAvoid" class="wide" placeholder="Foods to avoid / allergies"></div><button id="wizGenerate" type="button" class="fb-meal-generate-final">Generate my 7-day meal plan</button></div><div class="fb-meal-choice-actions"><button id="wizBack" type="button">Back</button><button id="wizNext" type="button">Next</button></div>`;
    generator.insertBefore(panel, grid);
    let step = 1;
    function copyProfileToWizard(){ const u = getUser() || {}; const values = {wizAge:u.age, wizGender:u.gender, wizWeight:u.weight, wizHeight:u.height, wizAvoid:u.allergies}; Object.entries(values).forEach(([id, value]) => { const el = $(id); if(el && value) el.value = value; }); const selects = { mealGoal:u.goal, mealTrainingDays:u.trainingDays }; Object.entries(selects).forEach(([id, value]) => { const el = $(id); if(el && value) el.value = value; }); }
    function syncWizardToHidden(){ const map = { mealAge:$('wizAge')?.value, mealGender:$('wizGender')?.value, mealWeight:$('wizWeight')?.value, mealHeight:$('wizHeight')?.value, mealAvoid:$('wizAvoid')?.value, mealStyle:$('wizStyle')?.value, mealTime:$('wizTime')?.value }; Object.entries(map).forEach(([id, value]) => { const el = $(id); if(el && value !== undefined) el.value = value || el.value; }); if($('mealDiet') && !$('mealDiet').value) $('mealDiet').value = 'normal'; if($('mealMeals') && !$('mealMeals').value) $('mealMeals').value = '4'; if($('mealActivity') && !$('mealActivity').value) $('mealActivity').value = 'normal'; if($('mealDifficulty') && !$('mealDifficulty').value) $('mealDifficulty').value = 'easy'; }
    function render(){ panel.querySelectorAll('.fb-meal-question').forEach(q => q.classList.toggle('active', Number(q.dataset.step) === step)); $('fbMealStepPill').textContent = step + ' / 6'; $('wizBack').style.visibility = step === 1 ? 'hidden':'visible'; $('wizNext').style.display = step === 6 ? 'none':'inline-flex'; syncWizardToHidden(); }
    panel.addEventListener('click', function(e){ const btn = e.target.closest('button'); if(!btn) return; if(btn.dataset.action === 'useProfile'){ copyProfileToWizard(); prefillGeneratorsFromProfile(true); syncWizardToHidden(); step = 2; render(); return; } if(btn.dataset.field){ const target = $(btn.dataset.field); if(target) target.value = btn.dataset.value; btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('selected')); btn.classList.add('selected'); syncWizardToHidden(); } if(btn.id === 'wizGenerate'){ syncWizardToHidden(); if(typeof window.generateMealPlan === 'function') window.generateMealPlan(); } });
    $('wizBack').addEventListener('click', () => { if(step > 1){ step--; render(); } });
    $('wizNext').addEventListener('click', () => { if(step < 6){ step++; render(); } });
    copyProfileToWizard(); prefillGeneratorsFromProfile(false); render();
  }

  function setupMealUnlock(){ if(purchased('mealplan') || purchased('bundle') || localStorage.getItem('fitbrandMealPlanUnlocked') === 'true'){ localStorage.setItem('fitbrandMealPlanUnlocked','true'); $('meal-plan-ai')?.classList.add('unlocked'); $('mealGenerator')?.classList.add('show'); setupMealWizard(); } }

  window.generateModalPlan = function(){
    const purchases = getPurchases(); let packageType = $('modalPackage')?.value || localStorage.getItem(PROGRAM_KEY) || 'aesthetic'; const goal = $('modalGoal')?.value || getUser()?.goal || 'muscle';
    if(packageType === 'bundle') packageType = goal === 'fatloss' ? 'shred' : goal === 'strength' ? 'strength' : 'aesthetic';
    if(!programProducts.includes(packageType)) packageType = 'aesthetic';
    if(!purchases.includes('bundle') && !purchases.includes(packageType)){ alert('This generator is only available for the program you purchased.'); return; }
    const place = $('modalPlace')?.value || getUser()?.trainingLocation || 'gym'; const level = $('modalLevel')?.value || getUser()?.level || 'beginner'; const days = Math.max(3, Math.min(6, parseInt($('modalDays')?.value || getUser()?.trainingDays || 4, 10))); const library = planLibrary[packageType][place] || planLibrary[packageType].gym; const selected = library.slice(0, days); const titles = {aesthetic:'Aesthetic Program', shred:'Shred Program', strength:'Strength Program'};
    if($('modalPlanTitle')) $('modalPlanTitle').textContent = 'Your ' + titles[packageType] + ' Plan';
    if($('modalPlanSubtitle')) $('modalPlanSubtitle').textContent = `Based on your purchased ${titles[packageType]}, ${days} days/week, ${place} training and ${level} level.`;
    if($('modalPlanPill')) $('modalPlanPill').textContent = days + ' DAYS / ' + place.toUpperCase();
    if($('modalPlanDays')) $('modalPlanDays').innerHTML = selected.map(day => `<div class="fb-plan-day"><h4>${day[0]}</h4><ul>${day[1].map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('');
    const out = $('modalPlanOutput'); if(out){ out.classList.add('show'); ensureProgramDownloadButtons(); out.scrollIntoView({behavior:'smooth', block:'nearest'}); }
  };
  function ensureProgramDownloadButtons(){ const out = $('modalPlanOutput'); if(!out || $('programDownloadActions')) return; const row = document.createElement('div'); row.id = 'programDownloadActions'; row.className = 'program-download-actions'; row.innerHTML = '<button type="button" onclick="downloadProgramPDF()">Download PDF</button><button type="button" onclick="downloadProgramPNG()">Download PNG</button>'; out.appendChild(row); }
  window.downloadProgramPDF = function(){ const out = $('modalPlanOutput'); if(!out || !out.classList.contains('show')){ alert('Generate your plan first.'); return; } const title = $('modalPlanTitle')?.textContent || 'FitBrand Program'; const subtitle = $('modalPlanSubtitle')?.textContent || ''; const days = Array.from(document.querySelectorAll('#modalPlanDays .fb-plan-day')).map(day => '<div class="day">' + day.innerHTML + '</div>').join(''); const win = window.open('', '_blank'); win.document.write(`<html><head><title>${title}</title><style>body{font-family:Arial,sans-serif;padding:38px;color:#111;line-height:1.45}h1{font-size:34px}.day{border:1px solid #ddd;border-radius:16px;padding:18px;margin:14px 0}li{margin:6px 0}</style></head><body><h1>${title}</h1><p>${subtitle}</p>${days}<script>window.print()<\/script></body></html>`); win.document.close(); };
  window.downloadProgramPNG = function(){ const out = $('modalPlanOutput'); if(!out || !out.classList.contains('show')){ alert('Generate your plan first.'); return; } const lines = (($('modalPlanTitle')?.textContent || 'FitBrand Program') + '\n' + ($('modalPlanSubtitle')?.textContent || '') + '\n\n' + Array.from(document.querySelectorAll('#modalPlanDays .fb-plan-day')).map(d => d.innerText).join('\n\n')).split('\n'); const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); canvas.width = 1200; canvas.height = Math.max(900, 170 + lines.length * 32); ctx.fillStyle = '#070707'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.fillStyle = '#fff'; ctx.font = 'bold 44px Arial'; ctx.fillText('FITBRAND PROGRAM', 60, 75); ctx.font = '24px Arial'; let y = 130; lines.forEach(line => { ctx.fillText(line.slice(0, 95), 60, y); y += 32; }); const a = document.createElement('a'); a.download = 'fitbrand-program.png'; a.href = canvas.toDataURL('image/png'); a.click(); };

  function setupProgramModalAccess(){ const trigger = $('openGeneratorBtn'); if(!trigger) return; const purchases = getPurchases(); const hasProgram = purchases.includes('bundle') || programProducts.some(p => purchases.includes(p)); trigger.classList.toggle('show', hasProgram); const pkg = $('modalPackage'); if(pkg){ const selected = purchases.includes('bundle') ? 'bundle' : (programProducts.find(p => purchases.includes(p)) || ''); if(selected) pkg.value = selected; } }
  window.openGeneratorModal = function(){ const purchases = getPurchases(); const hasProgram = purchases.includes('bundle') || programProducts.some(p => purchases.includes(p)); if(!hasProgram){ alert('This generator unlocks after purchasing a FitBrand program or bundle.'); return; } prefillGeneratorsFromProfile(false); setupProgramModalAccess(); $('fitbrandGeneratorModal')?.classList.add('show'); };
  window.closeGeneratorModal = function(){ $('fitbrandGeneratorModal')?.classList.remove('show'); };

  function setupCheckout(){
    const pay = $('stripe-link'); if(!pay) return;
    const emailEl = $('checkout-email') || document.querySelector('input[type="email"]'); const policy = $('accept-policies'); const user = getUser(); if(emailEl && user?.email && !emailEl.value) emailEl.value = user.email;
    function items(){ const arr = getCheckoutItems(); return arr.length ? arr : ['bundle']; }
    function bestSingleProduct(list){ if(list.length === 1) return list[0]; if(list.includes('bundle')) return 'bundle'; if(list.includes('mealplan')) return 'mealplan'; return 'cart'; }
    function updatePayLink(){ const emailOK = validEmail(emailEl?.value); const policyOK = !!policy?.checked; pay.classList.toggle('btn-disabled', !(emailOK && policyOK)); if(emailOK && policyOK){ const product = bestSingleProduct(items()); const links = window.FITBRAND_STRIPE_LINKS || {}; const stripe = links[product] || links.cart || ''; pay.href = stripe && !String(stripe).startsWith('#') ? stripe : `confirmation.html?product=${encodeURIComponent(product)}`; } else pay.href = '#'; }
    emailEl?.addEventListener('input', updatePayLink); policy?.addEventListener('change', updatePayLink); updatePayLink();
    if(!pay.dataset.customerReadyBound){ pay.dataset.customerReadyBound = '1'; pay.addEventListener('click', function(e){ const email = (emailEl?.value || '').trim(); if(!validEmail(email)){ e.preventDefault(); alert('Please enter a valid email before payment.'); emailEl?.focus(); return; } if(policy && !policy.checked){ e.preventDefault(); alert('Please accept FitBrand policies before payment.'); policy.focus(); return; } const existing = getUser(); const name = existing?.name || email.split('@')[0].replace(/[._-]/g,' ').replace(/\b\w/g, c => c.toUpperCase()); saveFitBrandUser(Object.assign({}, existing || {}, {name, email}), true); writeJSON(PENDING_ORDER_KEY, {items:items(), email, date:new Date().toISOString()}); }, true); }
  }

  function setupConfirmation(){ if(!location.pathname.endsWith('confirmation.html')) return; const params = new URLSearchParams(location.search); const fromUrl = params.get('product'); const pending = readJSON(PENDING_ORDER_KEY, null); const items = pending?.items?.length ? pending.items : (validProducts.includes(fromUrl) ? [fromUrl] : ['bundle']); items.forEach(addPurchase); const orders = readJSON(ORDERS_KEY, []); items.forEach(item => { if(!orders.some(o => o.product === item && o.date === pending?.date)){ orders.push({product:item, date:pending?.date || new Date().toISOString(), email:pending?.email || getUser()?.email || '', status:'Confirmed'}); } }); writeJSON(ORDERS_KEY, orders); localStorage.removeItem(PENDING_ORDER_KEY); localStorage.removeItem(CART_KEY); }
  function setupProfilePage(){
    const form = $('fullProfileForm'); if(!form) return; const u = getUser() || {}; const ids = {pfName:'name', pfEmail:'email', pfPhone:'phone', pfAddress:'address', pfGender:'gender', pfAge:'age', pfWeight:'weight', pfHeight:'height', pfLevel:'level', pfTrainingLocation:'trainingLocation', pfTrainingDays:'trainingDays', pfEquipment:'equipment', pfAllergies:'allergies', pfGoal:'goal'};
    Object.entries(ids).forEach(([id, key]) => { const el = $(id); if(el && u[key]) el.value = u[key]; });
    if(!form.dataset.customerReadyBound){ form.dataset.customerReadyBound = '1'; form.addEventListener('submit', function(e){ e.preventDefault(); const data = {}; Object.entries(ids).forEach(([id, key]) => data[key] = ($(id)?.value || '').trim()); if(!data.name || !validEmail(data.email)){ alert('Please add your full name and a valid email.'); return; } saveFitBrandUser(data, true); showNotice('Profile saved'); setTimeout(() => location.href = 'index.html', 350); }, true); }
  }
  function setupAccountPages(){
    const accessGrid = $('accessGrid'); const ordersList = $('ordersList'); if(!accessGrid && !ordersList) return; const u = getUser(); const locked = $('accountLocked'); const intro = $('accountIntro'); if(locked) locked.style.display = u ? 'none' : 'grid'; if(intro) intro.textContent = u ? `Logged in as ${u.email || u.name}.` : 'Log in to see your saved product access and orders on this device.';
    if(accessGrid){ const purchases = getPurchases(); accessGrid.innerHTML = accessProducts.map(key => { const p = catalog[key]; const has = purchases.includes(key) || (key === 'mealplan' && purchases.includes('bundle')); return `<div class="access-card ${has ? '' : 'locked'}"><strong>${p.name}</strong><span>${has ? 'Unlocked on this account/device.' : 'Not unlocked yet.'}</span><a href="${has ? p.open : p.buy}">${has ? 'Open' : 'Buy access'}</a></div>`; }).join(''); }
    if(ordersList){ const orders = readJSON(ORDERS_KEY, []); ordersList.innerHTML = orders.length ? orders.slice().reverse().map(order => { const p = catalog[order.product] || {name:order.product, open:'index.html'}; return `<div class="order-row"><div><strong>${p.name}</strong><br><span>${new Date(order.date).toLocaleString()} • ${order.status || 'Confirmed'}</span></div><a class="btn-outline" href="${p.open || 'index.html'}">Open</a></div>`; }).join('') : '<p>No orders saved on this device yet.</p>'; }
  }
  function showNotice(text){ let notice = $('fitbrandNotice'); if(!notice){ notice = document.createElement('div'); notice.id = 'fitbrandNotice'; notice.className = 'fitbrand-notice'; document.body.appendChild(notice); } notice.textContent = text; notice.classList.add('show'); setTimeout(() => notice.classList.remove('show'), 2200); }
  function wireButtons(){ document.querySelectorAll('.cart-icon-btn').forEach(btn => { if(btn.dataset.customerReadyCart) return; btn.dataset.customerReadyCart = '1'; btn.addEventListener('click', function(e){ e.preventDefault(); openCartDrawer(); }); }); document.addEventListener('click', function(e){ const menu = $('profileMenu'); const button = document.querySelector('.profile-icon-btn'); if(menu && button && !menu.contains(e.target) && !button.contains(e.target)) menu.classList.remove('show'); }); }
  function init(){ ensureHeader(); ensureProfileModal(); unlockFromUrl(); setupConfirmation(); updateFitBrandProfileUI(); prefillGeneratorsFromProfile(false); setupMealUnlock(); setupProgramModalAccess(); setupCheckout(); setupProfilePage(); setupAccountPages(); updateCartCount(); wireButtons(); showWelcome(); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
