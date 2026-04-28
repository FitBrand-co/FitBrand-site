/* FitBrand stable customer-ready system - v19 hotfix */
(function(){
  'use strict';

  const USER_KEY='fitbrandUser';
  const SESSION_KEY='fitbrandSessionUser';
  const CART_KEY='fitbrandCart';
  const PURCHASES_KEY='fitbrandPurchases';
  const ORDERS_KEY='fitbrandOrders';
  const MEAL_KEY='fitbrandMealPlanUnlocked';
  const PROGRAM_KEY='fitbrandPurchasedPackage';
  const WELCOME_KEY='fitbrandWelcomeSeenV19';

  const PRODUCTS={
    aesthetic:{name:'Aesthetic Program',price:4.99,type:'digital',url:'index.html?purchased=aesthetic'},
    shred:{name:'Shred Program',price:6.99,type:'digital',url:'index.html?purchased=shred'},
    strength:{name:'Strength Program',price:6.99,type:'digital',url:'index.html?purchased=strength'},
    bundle:{name:'Complete Bundle + Meal Plan AI',price:18.97,type:'digital',url:'index.html?purchased=bundle'},
    mealplan:{name:'Meal Plan Guide AI',price:5.99,type:'digital',url:'recommended.html?purchased=mealplan#meal-plan-ai'},
    belt:{name:'Lifting Belt',price:24.99,type:'comingsoon',url:'product-belt.html'},
    straps:{name:'Lifting Straps',price:12.99,type:'comingsoon',url:'product-straps.html'}
  };
  const VALID=Object.keys(PRODUCTS);
  const PROGRAMS=['aesthetic','shred','strength'];

  const $=(id)=>document.getElementById(id);
  const $$=(sel,root=document)=>Array.from(root.querySelectorAll(sel));
  const safeParse=(v,fallback)=>{try{return JSON.parse(v)}catch(e){return fallback}};
  const money=(n)=>'€'+Number(n||0).toFixed(2);
  const esc=(s)=>String(s==null?'':s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const emailOk=(e)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e||'').trim());

  function getUser(){return safeParse(localStorage.getItem(USER_KEY),null)||safeParse(sessionStorage.getItem(SESSION_KEY),null)}
  function saveUser(user,remember=true){
    const clean={
      name:String(user.name||'').trim(),
      email:String(user.email||'').trim(),
      phone:String(user.phone||'').trim(),
      address:String(user.address||'').trim(),
      gender:String(user.gender||'').trim(),
      age:String(user.age||'').trim(),
      weight:String(user.weight||'').trim(),
      height:String(user.height||'').trim(),
      trainingDays:String(user.trainingDays||'').trim(),
      fitnessLevel:String(user.fitnessLevel||'').trim(),
      equipment:String(user.equipment||'').trim(),
      allergies:String(user.allergies||'').trim()
    };
    if(remember){localStorage.setItem(USER_KEY,JSON.stringify(clean));sessionStorage.removeItem(SESSION_KEY)}
    else{sessionStorage.setItem(SESSION_KEY,JSON.stringify(clean));localStorage.removeItem(USER_KEY)}
    return clean;
  }
  function logoutFitBrandUser(){
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    updateProfileUI();
    closeProfileMenu();
    closeProfileModal();
    showToast('Logged out');
  }
  function initials(name){
    const parts=String(name||'').trim().split(/\s+/).filter(Boolean);
    if(parts.length>=2) return (parts[0][0]+parts[parts.length-1][0]).toUpperCase();
    if(parts.length===1) return parts[0].slice(0,2).toUpperCase();
    return '?';
  }

  function getCart(){return safeParse(localStorage.getItem(CART_KEY),[]).filter(k=>VALID.includes(k)&&PRODUCTS[k].type!=='comingsoon')}
  function saveCart(cart){localStorage.setItem(CART_KEY,JSON.stringify((cart||[]).filter(k=>VALID.includes(k)&&PRODUCTS[k].type!=='comingsoon')))}
  function addToCart(key){
    if(!PRODUCTS[key]) return;
    if(PRODUCTS[key].type==='comingsoon'){showToast(PRODUCTS[key].name+' is coming soon');return;}
    const cart=getCart();cart.push(key);saveCart(cart);updateCartCount();showMiniCartPopup();
  }
  function removeDrawerItem(index){const cart=getCart();cart.splice(index,1);saveCart(cart);updateCartCount()}
  function updateCartCount(){
    const count=getCart().length;
    $$('#cart-count,#cart-count-btn').forEach(el=>{el.textContent=count;el.style.display=count?'inline-flex':'none'});
    renderCartDrawer();
  }
  function renderCartDrawer(){
    const box=$('drawer-items'),total=$('drawer-total'); if(!box||!total) return;
    const cart=getCart();
    if(!cart.length){box.innerHTML='<p>Your cart is empty.</p>';total.textContent='€0.00';return;}
    let sum=0;
    box.innerHTML=cart.map((k,i)=>{const p=PRODUCTS[k]||PRODUCTS.bundle;sum+=p.price;return '<div class="drawer-item"><div><strong>'+esc(p.name)+'</strong><span>FitBrand product</span></div><div><strong>'+money(p.price)+'</strong><br><button class="remove-item-btn" onclick="removeDrawerItem('+i+')">Remove</button></div></div>'}).join('');
    const discount=localStorage.getItem('fitbrandDiscount')==='FIT10'?0.10:0;
    total.textContent=money(sum*(1-discount));
  }
  function openCartDrawer(){ $('cart-drawer')?.classList.add('show'); $('drawer-overlay')?.classList.add('show'); renderCartDrawer(); }
  function closeCartDrawer(){ $('cart-drawer')?.classList.remove('show'); $('drawer-overlay')?.classList.remove('show'); }
  function applyDrawerDiscount(){
    const code=($('drawer-discount')?.value||'').trim().toUpperCase(), msg=$('drawer-discount-message');
    if(code==='FIT10'){localStorage.setItem('fitbrandDiscount','FIT10'); if(msg)msg.textContent='Discount applied: 10% off.';}
    else{localStorage.removeItem('fitbrandDiscount'); if(msg)msg.textContent='Invalid code. Try FIT10.';}
    renderCartDrawer();
  }
  function showMiniCartPopup(){const p=$('mini-cart-popup'); if(p){p.classList.add('show');setTimeout(()=>p.classList.remove('show'),2600)} else showToast('Added to cart')}
  function showToast(text){
    let t=$('fbGlobalToast');
    if(!t){t=document.createElement('div');t.id='fbGlobalToast';t.className='cart-toast';document.body.appendChild(t)}
    t.textContent=text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200);
  }

  function ensureProfileUI(){
    const nav=document.querySelector('.nav'); if(!nav) return;
    let actions=nav.querySelector('.nav-actions');
    const cart=nav.querySelector('.cart-icon-btn');
    if(!actions){
      actions=document.createElement('div');actions.className='nav-actions';
      if(cart){cart.replaceWith(actions);actions.appendChild(cart)} else nav.appendChild(actions);
    }
    if(!actions.querySelector('.profile-icon-btn')){
      actions.insertAdjacentHTML('beforeend','<button class="profile-icon-btn" onclick="toggleProfileMenu()" aria-label="Profile"><span id="profileInitial">?</span></button><div id="profileMenu" class="profile-menu"><div class="profile-menu-head"><div class="profile-avatar"><span id="profileMenuInitial">?</span></div><div class="profile-menu-text"><strong id="profileMenuName">Guest</strong><br><span id="profileMenuEmail">Not logged in</span></div></div><button class="profile-when-in" onclick="openProfileModal(\'profile\')"><span class="fb-menu-ico">◉</span> View profile</button><a class="profile-menu-link profile-when-in" href="profile.html"><span class="fb-menu-ico">✎</span> Edit profile information</a><a class="profile-menu-link profile-when-in" href="products-access.html"><span class="fb-menu-ico">▣</span> My products / access</a><a class="profile-menu-link profile-when-in" href="orders.html"><span class="fb-menu-ico">◎</span> My orders</a><button id="profileLoginBtn" class="profile-when-out" onclick="openProfileModal(\'login\')"><span class="fb-menu-ico">→</span> Sign in/up</button><button id="profileLogoutBtn" class="profile-when-in" onclick="logoutFitBrandUser()"><span class="fb-menu-ico">⏻</span> Log out</button></div>');
    }
    if(!$('profileModalOverlay')){
      document.body.insertAdjacentHTML('beforeend','<div id="profileModalOverlay" class="profile-modal-overlay"><div class="profile-modal"><button class="profile-modal-close" onclick="closeProfileModal()">×</button><h2 id="profileModalTitle">Sign in/up</h2><div id="profileViewBox" style="display:none"><div class="profile-menu-head"><div class="profile-avatar"><span id="profileViewInitial">?</span></div><div class="profile-menu-text"><strong id="profileViewName">Guest</strong><br><span id="profileViewEmail">Not logged in</span></div></div></div><form id="profileForm" class="profile-form"><input id="profileNameInput" type="text" placeholder="Full name"><input id="profileEmailInput" type="email" placeholder="Email"><input id="profilePhoneInput" type="text" placeholder="Phone number"><input id="profileAddressInput" type="text" placeholder="Address"><div class="profile-two"><input id="profileAgeInput" type="number" placeholder="Age"><select id="profileGenderInput"><option value="">Gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div><div class="profile-two"><input id="profileWeightInput" type="number" placeholder="Weight kg"><input id="profileHeightInput" type="number" placeholder="Height cm"></div><div class="profile-two"><select id="profileTrainingDaysInput"><option value="">Training days</option><option value="3">2-3 days</option><option value="5">4-5 days</option><option value="6">6+ days</option></select><select id="profileFitnessLevelInput"><option value="">Fitness level</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></div><input id="profileEquipmentInput" type="text" placeholder="Equipment available"><input id="profileAllergiesInput" type="text" placeholder="Foods to avoid / allergies"><label class="remember-line"><input id="rememberLoginInput" type="checkbox" checked> Remember my login on this device</label><button class="profile-main-btn" type="submit">Sign in/up</button></form></div></div>');
      $('profileModalOverlay').addEventListener('click',e=>{if(e.target.id==='profileModalOverlay') closeProfileModal()});
      $('profileForm')?.addEventListener('submit',saveProfileFromForm);
    }
  }
  function updateProfileUI(){
    ensureProfileUI();
    const user=getUser(), logged=!!user, ini=initials(user?.name||'');
    $$('#profileInitial,#profileMenuInitial,#profileViewInitial').forEach(el=>el.textContent=logged?ini:'?');
    $$('#profileMenuName,#profileViewName').forEach(el=>{el.textContent=logged?(user.name||'FitBrand User'):'Guest';el.title=el.textContent});
    $$('#profileMenuEmail,#profileViewEmail').forEach(el=>{el.textContent=logged?(user.email||'No email'):'Not logged in';el.title=el.textContent});
    $$('.profile-when-in').forEach(el=>el.style.display=logged?'flex':'none');
    $$('.profile-when-out').forEach(el=>el.style.display=logged?'none':'flex');
  }
  function toggleProfileMenu(){updateProfileUI();$('profileMenu')?.classList.toggle('show')}
  function closeProfileMenu(){$('profileMenu')?.classList.remove('show')}
  function openProfileModal(mode='login'){
    ensureProfileUI();closeProfileMenu();
    const user=getUser();
    const title=$('profileModalTitle'),form=$('profileForm'),view=$('profileViewBox');
    if(mode==='profile'&&user){title.textContent='Your profile';form.style.display='none';view.style.display='block'}
    else{
      title.textContent=user?'Edit profile information':'Sign in/up';form.style.display='grid';view.style.display='none';
      $('profileNameInput').value=user?.name||'';$('profileEmailInput').value=user?.email||'';$('profilePhoneInput').value=user?.phone||'';$('profileAddressInput').value=user?.address||'';$('profileAgeInput').value=user?.age||'';$('profileGenderInput').value=user?.gender||'';$('profileWeightInput').value=user?.weight||'';$('profileHeightInput').value=user?.height||'';$('profileTrainingDaysInput').value=user?.trainingDays||'';$('profileFitnessLevelInput').value=user?.fitnessLevel||'';$('profileEquipmentInput').value=user?.equipment||'';$('profileAllergiesInput').value=user?.allergies||'';
    }
    $('profileModalOverlay')?.classList.add('show');
  }
  function closeProfileModal(){$('profileModalOverlay')?.classList.remove('show')}
  function saveProfileFromForm(e){
    e.preventDefault();
    const name=$('profileNameInput').value.trim(), email=$('profileEmailInput').value.trim();
    if(!name||!emailOk(email)){alert('Please enter your name and a valid email.');return;}
    const age=Number($('profileAgeInput').value||0); if(age && age<16){alert('You must be at least 16, or have permission from a parent/guardian.');return;}
    saveUser({name,email,phone:$('profilePhoneInput').value,address:$('profileAddressInput').value,age:$('profileAgeInput').value,gender:$('profileGenderInput').value,weight:$('profileWeightInput').value,height:$('profileHeightInput').value,trainingDays:$('profileTrainingDaysInput').value,fitnessLevel:$('profileFitnessLevelInput').value,equipment:$('profileEquipmentInput').value,allergies:$('profileAllergiesInput').value},$('rememberLoginInput')?.checked!==false);
    updateProfileUI();closeProfileModal();prefillGeneratorsFromProfile();showToast('Profile saved');
    if(location.pathname.endsWith('/profile.html')||location.pathname.endsWith('profile.html')) setTimeout(()=>location.href='index.html',300);
  }

  function getPurchases(){
    const arr=safeParse(localStorage.getItem(PURCHASES_KEY),[]).filter(k=>VALID.includes(k));
    const p=localStorage.getItem(PROGRAM_KEY); if(VALID.includes(p)&&!arr.includes(p)) arr.push(p);
    if(localStorage.getItem(MEAL_KEY)==='true'&&!arr.includes('mealplan')) arr.push('mealplan');
    if(arr.includes('bundle')&&!arr.includes('mealplan')) arr.push('mealplan');
    return [...new Set(arr)];
  }
  function addPurchases(keys,email){
    const clean=[...new Set((keys||[]).filter(k=>VALID.includes(k)&&PRODUCTS[k].type!=='comingsoon'))];
    if(clean.includes('bundle')&&!clean.includes('mealplan')) clean.push('mealplan');
    const existing=getPurchases();clean.forEach(k=>{if(!existing.includes(k)) existing.push(k)});
    localStorage.setItem(PURCHASES_KEY,JSON.stringify(existing));
    if(existing.includes('mealplan')) localStorage.setItem(MEAL_KEY,'true');
    const orders=safeParse(localStorage.getItem(ORDERS_KEY),[]);
    orders.unshift({date:new Date().toLocaleString(),items:clean,total:clean.reduce((s,k)=>s+(PRODUCTS[k]?.price||0),0),email:email||getUser()?.email||''});
    localStorage.setItem(ORDERS_KEY,JSON.stringify(orders.slice(0,25)));
  }

  function checkoutItems(){
    const q=new URLSearchParams(location.search); if(q.get('cart')==='true') return getCart();
    const p=q.get('product')||'bundle'; return VALID.includes(p)?[p]:['bundle'];
  }
  function enhanceCheckout(){
    if(!location.pathname.endsWith('checkout.html')) return;
    const email=document.querySelector('.checkout-right input[type="email"]');
    const user=getUser(); if(email&&user?.email&&!email.value) email.value=user.email;
    const btn=$('stripe-link'), policy=$('accept-policies'); if(!btn||!policy) return;
    function refresh(){
      const okEmail=emailOk(email?.value), okPolicy=policy.checked;
      btn.classList.toggle('btn-disabled',!(okEmail&&okPolicy));
      if(okEmail&&okPolicy){btn.href='confirmation.html?product='+encodeURIComponent(checkoutItems().join(','))+'&email='+encodeURIComponent(email.value.trim())}
      else btn.href='#';
    }
    email?.addEventListener('input',refresh); policy.addEventListener('change',refresh); refresh();
    btn.addEventListener('click',e=>{if(btn.classList.contains('btn-disabled')){e.preventDefault();alert('Please enter your email and accept the policies first.')}});
  }
  function processConfirmation(){
    if(!location.pathname.endsWith('confirmation.html')) return;
    const q=new URLSearchParams(location.search);
    const email=q.get('email')||'';
    const items=(q.get('product')||'').split(',').filter(Boolean);
    if(emailOk(email)&&!getUser()) saveUser({name:email.split('@')[0].replace(/[._-]/g,' '),email},true);
    if(items.length) addPurchases(items,email);
    localStorage.removeItem(CART_KEY);
  }

  function renderAccountPages(){
    const user=getUser();
    const locked=$('accountLocked'), intro=$('accountIntro');
    const access=$('accessGrid'), orders=$('ordersList');
    if(!access&&!orders) return;
    if(!user){if(locked) locked.style.display='grid'; if(intro) intro.textContent='Log in to see this page.'; if(access) access.innerHTML=''; if(orders) orders.innerHTML=''; return;}
    if(locked) locked.style.display='none'; if(intro) intro.textContent='Welcome back, '+(user.name||'FitBrand customer')+'.';
    const own=getPurchases();
    if(access){
      const show=['aesthetic','shred','strength','bundle','mealplan'];
      access.innerHTML=show.map(k=>{const has=own.includes(k)||(k==='mealplan'&&own.includes('bundle'));const p=PRODUCTS[k];return '<article class="access-card '+(has?'owned':'locked')+'"><div><strong>'+esc(p.name)+'</strong><span>'+(has?'Access unlocked':'No access yet')+'</span></div><a class="btn-dark" href="'+(has?p.url:'checkout.html?product='+k)+'">'+(has?'Open':'Buy access')+'</a></article>'}).join('');
    }
    if(orders){
      const list=safeParse(localStorage.getItem(ORDERS_KEY),[]);
      orders.innerHTML=list.length?list.map(o=>'<article class="order-card"><div><strong>'+esc(o.date)+'</strong><span>'+esc((o.items||[]).map(k=>PRODUCTS[k]?.name||k).join(', '))+'</span></div><b>'+money(o.total)+'</b></article>').join(''):'<p>No saved orders on this device yet.</p>';
    }
  }

  function prefillGeneratorsFromProfile(){
    const u=getUser(); if(!u) return;
    const map={mealAge:u.age,mealGender:u.gender,mealWeight:u.weight,mealHeight:u.height,mealTrainingDays:u.trainingDays,mealAvoid:u.allergies,modalAge:u.age,modalGender:u.gender,modalWeight:u.weight,modalHeight:u.height,modalDays:u.trainingDays,modalLevel:u.fitnessLevel};
    Object.entries(map).forEach(([id,v])=>{if($(id)&&v) $(id).value=v});
  }
  function validateAgeFrom(id){const age=Number($(id)?.value||0); if(age&&age<16){alert('You must be at least 16 years old to use this AI generator. If you are under 16, you need permission from a parent or guardian.');return false} return true}

  function makeComingSoon(){
    if(!/product-(belt|straps)\.html$/.test(location.pathname)) return;
    $$('a[href*="checkout.html?product=belt"],a[href*="checkout.html?product=straps"],button[onclick*="belt"],button[onclick*="straps"]').forEach(el=>{const d=document.createElement('div');d.className='coming-soon-pill';d.textContent='Coming soon';el.replaceWith(d)});
    $$('.stock-box span').forEach(s=>{if(/Available/i.test(s.textContent))s.textContent='Coming soon';if(/Ships/i.test(s.textContent))s.textContent='Launching soon'});
  }

  function currentProgramAccess(){
    const q=new URLSearchParams(location.search); const p=q.get('purchased')||localStorage.getItem(PROGRAM_KEY)||'';
    const own=getPurchases(); if(own.includes('bundle')) return 'bundle'; if(PROGRAMS.includes(p)&&own.includes(p)) return p; return own.find(k=>PROGRAMS.includes(k))||'';
  }
  const TRAINING_GOALS={
    aesthetic:[['Upper body shape','Chest, shoulders and V-taper'],['Balanced physique','Proportions and symmetry'],['Lean muscle','Build size while staying athletic']],
    shred:[['Fat loss','Keep strength while cutting'],['Definition','More conditioning and shape'],['Consistency','Simple plan and steps']],
    strength:[['Main lifts','Squat, bench and deadlift'],['Power','Heavy compounds'],['Strength + size','Performance and muscle']],
    bundle:[['Full system','Training + nutrition'],['Transformation','Muscle, fat loss and consistency'],['Long-term progress','Rotate structured phases']]
  };
  function openGeneratorModal(){
    if(!getUser()){openProfileModal('login');return}
    const pack=currentProgramAccess(); if(!pack){alert('Buy a FitBrand program first to unlock the training generator.');return}
    let modal=$('fitbrandGeneratorModal');
    if(!modal){document.body.insertAdjacentHTML('beforeend','<div id="fitbrandGeneratorModal" class="fb-modal-overlay"><div class="fb-generator-modal"><button class="fb-modal-close" onclick="closeGeneratorModal()">×</button><div class="fb-modal-header"><div class="fb-logo-mark">FB</div><div class="fb-modal-kicker">After purchase</div><h2>Generate Your Personal Training Plan</h2><p>Step-by-step plan based on your purchased program.</p></div><div class="fb-modal-body" id="fbTrainingBody"></div></div></div>');modal=$('fitbrandGeneratorModal')}
    const u=getUser()||{}, goals=TRAINING_GOALS[pack]||TRAINING_GOALS.aesthetic;
    $('fbTrainingBody').innerHTML='<div class="fb-premium-ai-wizard"><div class="fb-ai-top"><div><span>'+esc(PRODUCTS[pack].name)+'</span><h3>Build your plan</h3><p>Choose a focus that fits your product.</p></div><strong id="trainStepPill">1 / 4</strong></div><div class="fb-ai-progress"><i id="trainProgressFill" style="width:25%"></i></div><section class="fb-ai-step active" data-step="1"><h4>Choose your focus</h4><div class="fb-program-track-options">'+goals.map((g,i)=>'<button data-focus="'+i+'"><strong>'+esc(g[0])+'</strong><small>'+esc(g[1])+'</small></button>').join('')+'</div></section><section class="fb-ai-step" data-step="2"><h4>Your information</h4><div class="fb-ai-form-grid"><input id="twAge" type="number" placeholder="Age" value="'+esc(u.age||'')+'"><select id="twGender"><option value="">Gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select><input id="twWeight" type="number" placeholder="Weight kg" value="'+esc(u.weight||'')+'"><input id="twHeight" type="number" placeholder="Height cm" value="'+esc(u.height||'')+'"></div><a href="profile.html" class="fb-small-link">Change information</a></section><section class="fb-ai-step" data-step="3"><h4>Training setup</h4><div class="fb-ai-form-grid"><select id="twPlace"><option value="gym">Gym</option><option value="home">Home</option></select><select id="twDays"><option value="3">3 days/week</option><option value="4">4 days/week</option><option value="5">5 days/week</option><option value="6">6 days/week</option></select><select id="twLevel"><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select><select id="twLimit"><option value="none">No limitation</option><option value="knees">Knee discomfort</option><option value="shoulders">Shoulder discomfort</option><option value="time">Short workouts</option></select></div></section><section class="fb-ai-step" data-step="4"><h4>Generate</h4><p>Your plan will match your '+esc(PRODUCTS[pack].name)+'.</p><button class="fb-ai-generate" id="twGenerate">Generate training plan</button></section><div class="fb-ai-actions"><button id="twBack">Back</button><button id="twNext">Next</button></div><div id="modalPlanOutput" class="fb-plan-output"><div class="fb-plan-head"><div><h3 id="modalPlanTitle">Your plan</h3><p id="modalPlanSubtitle"></p></div><div id="modalPlanPill" class="fb-plan-pill"></div></div><div id="modalPlanDays" class="fb-plan-days"></div><div class="meal-action-row"><button class="download-btn" onclick="downloadTrainingPlanPDF()">Download PDF</button></div></div></div>';
    if($('twGender')) $('twGender').value=u.gender||''; if($('twDays')) $('twDays').value=u.trainingDays||'4'; if($('twLevel')) $('twLevel').value=u.fitnessLevel||'beginner';
    let step=1,focus=goals[0][0]; const render=()=>{$$('.fb-ai-step').forEach(s=>s.classList.toggle('active',Number(s.dataset.step)===step));$('trainStepPill').textContent=step+' / 4';$('trainProgressFill').style.width=(step*25)+'%';$('twBack').style.visibility=step===1?'hidden':'visible';$('twNext').style.display=step===4?'none':'inline-flex'};
    $('fbTrainingBody').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.focus!=null){focus=goals[Number(b.dataset.focus)][0];$$('[data-focus]').forEach(x=>x.classList.toggle('selected',x===b))} if(b.id==='twBack'&&step>1){step--;render()} if(b.id==='twNext'&&step<4){if(step===2&&!validateAgeFrom('twAge'))return;step++;render()} if(b.id==='twGenerate'){if(!validateAgeFrom('twAge'))return;generateTrainingPlan(pack,focus)}};
    $$('[data-focus]')[0]?.classList.add('selected');render();modal.classList.add('show');document.body.classList.add('fb-modal-open');
  }
  function generateTrainingPlan(pack,focus){
    const place=$('twPlace')?.value||'gym', days=Number($('twDays')?.value||4), level=$('twLevel')?.value||'beginner';
    const names={aesthetic:['Chest + Shoulders','Back + Biceps','Legs','Upper Aesthetic','Pump + Core','Weak Points'],shred:['Full Body Strength','Conditioning','Lower + Cardio','Upper + HIIT','Fat Loss Circuit','Active Recovery'],strength:['Squat Focus','Bench Focus','Deadlift Focus','Overhead Focus','Volume Strength','Recovery Strength'],bundle:['Aesthetic Upper','Shred Conditioning','Strength Lower','Nutrition + Core','Full Body Performance','Recovery']};
    const ex=place==='gym'?['Main compound — 4x6-8','Accessory lift — 3x8-10','Controlled machine/cable — 3x10-12','Isolation finisher — 3x12-15','Core/cardio — 10 min']:['Main bodyweight/DB lift — 4x10','Single-leg or push/pull — 3x10','Band/DB control — 3x12','Core finisher — 3 rounds','Walk/mobility — 10 min'];
    const list=(names[pack]||names.aesthetic).slice(0,days);
    $('modalPlanTitle').textContent='Your '+PRODUCTS[pack].name+' Plan';
    $('modalPlanSubtitle').textContent='Built for '+level+' level, '+place+' training. Focus: '+focus+'.';
    $('modalPlanPill').textContent=days+' DAYS / '+place.toUpperCase();
    $('modalPlanDays').innerHTML=list.map((d,i)=>'<div class="fb-plan-day"><h4>Day '+(i+1)+' — '+esc(d)+'</h4><ul>'+ex.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div>').join('');
    window.latestTrainingPlanText='FITBRAND TRAINING PLAN\n\nPackage: '+PRODUCTS[pack].name+'\nFocus: '+focus+'\nPlace: '+place+'\nDays: '+days+'\n\n'+list.map((d,i)=>'Day '+(i+1)+' - '+d+'\n'+ex.map(x=>'- '+x).join('\n')).join('\n\n');
    $('modalPlanOutput').classList.add('show');$('modalPlanOutput').scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  function closeGeneratorModal(){ $('fitbrandGeneratorModal')?.classList.remove('show');document.body.classList.remove('fb-modal-open'); }
  function downloadTrainingPlanPDF(){
    if(!window.latestTrainingPlanText){alert('Generate your plan first.');return}
    const w=window.open('','_blank');w.document.write('<html><head><title>FitBrand Training Plan</title><style>body{font-family:Arial;padding:40px;line-height:1.5}pre{white-space:pre-wrap}</style></head><body><h1>FitBrand Training Plan</h1><pre>'+esc(window.latestTrainingPlanText)+'</pre><script>window.print()<\/script></body></html>');w.document.close();
  }

  function handleMealPreviewClick(){
    if(!getUser()){openProfileModal('login');return}
    localStorage.setItem(MEAL_KEY,'true');
    $('meal-plan-ai')?.classList.add('unlocked'); $('mealGenerator')?.classList.add('show');
    prefillGeneratorsFromProfile(); buildMealStepByStep();
    $('meal-plan-ai')?.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function buildMealStepByStep(){
    const gen=$('mealGenerator'); if(!gen||$('fitbrandMealSteps')) return;
    const grid=gen.querySelector('.meal-grid'),btn=gen.querySelector('.meal-generate-btn'); if(grid) grid.style.display='none'; if(btn) btn.style.display='none';
    const u=getUser()||{};
    const div=document.createElement('div');div.id='fitbrandMealSteps';div.className='fb-meal-wizard';
    div.innerHTML='<div class="fb-ai-top"><div><span>Meal Plan AI</span><h3>Build your meal plan</h3><p>Simple step-by-step setup. Saved profile info is already suggested.</p></div><strong id="mealStepPill">1 / 5</strong></div><div class="fb-ai-progress"><i id="mealProgressFill" style="width:20%"></i></div><section class="fb-ai-step active" data-step="1"><h4>Your goal</h4><div class="fb-meal-options"><button data-goal="fatloss"><strong>Lose fat</strong><small>High protein, controlled calories.</small></button><button data-goal="muscle"><strong>Build muscle</strong><small>More food for growth.</small></button><button data-goal="maintenance"><strong>Maintain</strong><small>Balanced clean eating.</small></button></div></section><section class="fb-ai-step" data-step="2"><h4>Your profile</h4><div class="fb-ai-form-grid"><input id="mwAge" type="number" placeholder="Age" value="'+esc(u.age||'')+'"><select id="mwGender"><option value="">Gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select><input id="mwWeight" type="number" placeholder="Weight kg" value="'+esc(u.weight||'')+'"><input id="mwHeight" type="number" placeholder="Height cm" value="'+esc(u.height||'')+'"></div><a class="fb-small-link" href="profile.html">Change information</a></section><section class="fb-ai-step" data-step="3"><h4>Food style</h4><div class="fb-meal-options"><button data-diet="normal"><strong>Balanced</strong><small>Normal flexible meals.</small></button><button data-diet="highprotein"><strong>High protein</strong><small>Extra protein focus.</small></button><button data-diet="budget"><strong>Budget</strong><small>Cheaper ingredients.</small></button><button data-diet="easy"><strong>Fast</strong><small>Easy meals.</small></button><button data-diet="vegetarian"><strong>Vegetarian</strong><small>No meat.</small></button></div></section><section class="fb-ai-step" data-step="4"><h4>Meal structure</h4><div class="fb-meal-options"><button data-meals="3"><strong>3 meals</strong><small>Simple.</small></button><button data-meals="4"><strong>4 meals</strong><small>Balanced.</small></button><button data-meals="5"><strong>5 meals</strong><small>Structured.</small></button></div></section><section class="fb-ai-step" data-step="5"><h4>Final details</h4><div class="fb-ai-form-grid"><select id="mwTraining"><option value="3">2-3 training days</option><option value="5">4-5 training days</option><option value="6">6+ training days</option><option value="0">0-1 training days</option></select><select id="mwStyle"><option value="balanced">Balanced</option><option value="lowcalorie">Low calorie</option><option value="bulking">Bulking</option><option value="simple">Very simple</option></select><input id="mwAvoid" placeholder="Foods to avoid / allergies" value="'+esc(u.allergies||'')+'"></div><button id="mwGenerate" class="fb-ai-generate">Generate 7-day meal plan</button></section><div class="fb-ai-actions"><button id="mwBack">Back</button><button id="mwNext">Next</button></div>';
    gen.prepend(div); if($('mwGender')) $('mwGender').value=u.gender||''; if($('mwTraining')) $('mwTraining').value=u.trainingDays||'3';
    let step=1,state={goal:'fatloss',diet:'normal',meals:'4'};
    function sync(){const map={mealGoal:state.goal,mealDiet:state.diet,mealMeals:state.meals,mealAge:$('mwAge')?.value,mealGender:$('mwGender')?.value,mealWeight:$('mwWeight')?.value,mealHeight:$('mwHeight')?.value,mealTrainingDays:$('mwTraining')?.value,mealStyle:$('mwStyle')?.value,mealAvoid:$('mwAvoid')?.value};Object.entries(map).forEach(([id,v])=>{if($(id))$(id).value=v||''})}
    function render(){$$('#fitbrandMealSteps .fb-ai-step').forEach(s=>s.classList.toggle('active',Number(s.dataset.step)===step));$('mealStepPill').textContent=step+' / 5';$('mealProgressFill').style.width=(step*20)+'%';$('mwBack').style.visibility=step===1?'hidden':'visible';$('mwNext').style.display=step===5?'none':'inline-flex';sync()}
    div.onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.goal){state.goal=b.dataset.goal;$$('[data-goal]').forEach(x=>x.classList.toggle('selected',x===b))}if(b.dataset.diet){state.diet=b.dataset.diet;$$('[data-diet]').forEach(x=>x.classList.toggle('selected',x===b))}if(b.dataset.meals){state.meals=b.dataset.meals;$$('[data-meals]').forEach(x=>x.classList.toggle('selected',x===b))}if(b.id==='mwBack'&&step>1){step--;render()}if(b.id==='mwNext'&&step<5){if(step===2&&!validateAgeFrom('mwAge'))return;step++;render()}if(b.id==='mwGenerate'){if(!validateAgeFrom('mwAge'))return;sync(); if(typeof window.generateMealPlan==='function') window.generateMealPlan();}};
    $$('[data-goal]')[0]?.classList.add('selected');$$('[data-diet]')[0]?.classList.add('selected');$$('[data-meals]')[1]?.classList.add('selected');render();
  }
  function checkMealPurchase(){
    const q=new URLSearchParams(location.search); if(q.get('purchased')==='mealplan'||q.get('product')==='mealplan'||getPurchases().includes('mealplan')||getPurchases().includes('bundle')) localStorage.setItem(MEAL_KEY,'true');
    if(localStorage.getItem(MEAL_KEY)==='true'){$('meal-plan-ai')?.classList.add('unlocked');$('mealGenerator')?.classList.add('show');buildMealStepByStep();}
  }

  function showWelcome(){
    if(!location.pathname.endsWith('index.html')&&location.pathname!=='/'&&location.pathname.split('/').pop()!=='') return;
    if(localStorage.getItem(WELCOME_KEY)||getUser()) return;
    const box=document.createElement('div');box.className='fb-welcome-overlay';box.innerHTML='<div class="fb-welcome-card"><div class="fb-logo-mark">FB</div><h2>Welcome to FitBrand</h2><p>Log in for saved access, profile info and AI generators — or continue as guest.</p><div><button class="btn-dark" id="welcomeLogin">Sign in/up</button><button class="btn-outline" id="welcomeGuest">Continue as guest</button></div></div>';
    document.body.appendChild(box); $('welcomeGuest').onclick=()=>{localStorage.setItem(WELCOME_KEY,'1');box.remove()}; $('welcomeLogin').onclick=()=>{localStorage.setItem(WELCOME_KEY,'1');box.remove();openProfileModal('login')};
  }

  function patchBundle(){
    const b=document.querySelector('.fitbrand-bundle-offer'); if(b&&!b.querySelector('.fb-bundle-micro')) b.insertAdjacentHTML('beforeend','<div class="fb-bundle-micro"><span>All 3 programs</span><span>Meal Plan Guide AI included</span><span>Training generator access</span><span>Best value</span></div>');
  }

  function boot(){
    document.documentElement.classList.add('fb-js-ready');
    ensureProfileUI(); updateProfileUI(); updateCartCount(); enhanceCheckout(); processConfirmation(); renderAccountPages(); makeComingSoon(); prefillGeneratorsFromProfile(); checkMealPurchase(); patchBundle(); showWelcome();
    $$('.cart-icon-btn').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();openCartDrawer()}));
    document.addEventListener('click',e=>{const m=$('profileMenu'),b=document.querySelector('.profile-icon-btn'); if(m&&b&&!m.contains(e.target)&&!b.contains(e.target))m.classList.remove('show')});
    document.body.style.opacity='1';
  }

  Object.assign(window,{getFitBrandUser:getUser,saveFitBrandUser:saveUser,logoutFitBrandUser,updateFitBrandProfileUI:updateProfileUI,toggleProfileMenu,openProfileModal,closeProfileModal,addToCart,removeDrawerItem,updateCartCount,openCartDrawer,closeCartDrawer,applyDrawerDiscount,handleMealPreviewClick,checkMealPurchase,prefillGeneratorsFromProfile,openGeneratorModal,closeGeneratorModal,downloadTrainingPlanPDF});
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
