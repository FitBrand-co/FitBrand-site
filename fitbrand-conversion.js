/* FitBrand v33 conversion/mobile system */
(function(){
  "use strict";

  const DIGITAL_PRODUCTS = {
    aesthetic: "Aesthetic Program",
    shred: "Shred Program",
    strength: "Strength Program",
    bundle: "Complete FitBrand Bundle",
    mealplan: "Meal Plan Guide AI"
  };

  const productFromUrl = (href) => {
    try {
      const u = new URL(href, window.location.href);
      const product = u.searchParams.get("product");
      return DIGITAL_PRODUCTS[product] ? product : "";
    } catch {
      const m = String(href || "").match(/product=([a-z]+)/);
      return m && DIGITAL_PRODUCTS[m[1]] ? m[1] : "";
    }
  };

  function qs(sel, root=document){ return root.querySelector(sel); }
  function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

  function toast(message, type="success"){
    let el = qs("#fbConversionToast");
    if(!el){
      el = document.createElement("div");
      el.id = "fbConversionToast";
      el.className = "fb-conversion-toast";
      document.body.appendChild(el);
    }
    el.className = "fb-conversion-toast show " + (type === "error" ? "error" : "success");
    el.textContent = message;
    clearTimeout(el._t);
    el._t = setTimeout(()=>el.classList.remove("show"), 4500);
  }

  function addEarlyAccessNav(){
    qsa("header.nav nav").forEach(nav => {
      if(!nav.querySelector('a[href="early-access.html"]')){
        const a = document.createElement("a");
        a.href = "early-access.html";
        a.textContent = "Early Access";
        nav.appendChild(a);
      }
    });
  }

  function buildMobileMenu(){
    const header = qs("header.nav");
    if(!header || qs("#fbMobileMenuButton")) return;

    const navActions = qs(".nav-actions", header) || header;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "fbMobileMenuButton";
    btn.className = "fb-mobile-menu-button";
    btn.setAttribute("aria-label", "Open navigation menu");
    btn.innerHTML = "<span></span><span></span><span></span>";

    // Put it before cart/profile if possible
    navActions.insertBefore(btn, navActions.firstChild);

    const overlay = document.createElement("div");
    overlay.id = "fbMobileMenuOverlay";
    overlay.className = "fb-mobile-menu-overlay";
    overlay.innerHTML = `
      <div class="fb-mobile-menu-panel" role="dialog" aria-label="Mobile navigation">
        <div class="fb-mobile-menu-top">
          <strong>FITBRAND</strong>
          <button type="button" id="fbMobileMenuClose" aria-label="Close menu">×</button>
        </div>
        <a href="index.html">Home</a>
        <a href="early-access.html">Join Early Access</a>
        <a href="programs.html">Programs</a>
        <a href="recommended.html">Recommended Products</a>
        <a href="about.html">About us</a>
        <a href="policies.html">Policies</a>
        <div class="fb-mobile-menu-note">Free to join. No payment required during early access.</div>
      </div>
    `;
    document.body.appendChild(overlay);

    const open = () => {
      overlay.classList.add("show");
      document.body.classList.add("fb-menu-open");
    };
    const close = () => {
      overlay.classList.remove("show");
      document.body.classList.remove("fb-menu-open");
    };

    btn.addEventListener("click", open);
    qs("#fbMobileMenuClose", overlay).addEventListener("click", close);
    overlay.addEventListener("click", e => { if(e.target === overlay) close(); });
    qsa("a", overlay).forEach(a => a.addEventListener("click", close));
  }

  function rewriteDigitalCheckoutLinks(){
    qsa('a[href*="checkout.html?product="]').forEach(a => {
      const product = productFromUrl(a.getAttribute("href"));
      if(!product) return;
      a.href = "early-access.html?interest=" + encodeURIComponent(product);
      a.dataset.earlyAccessProduct = product;
      const text = a.textContent.trim().toLowerCase();
      if(text.includes("subscription") || text.includes("buy") || text.includes("start") || text.includes("monthly")){
        a.textContent = product === "bundle" ? "Join Bundle Waitlist" : "Join Early Access";
      }
    });

    qsa("button[onclick*=\"addToCart('aesthetic')\"],button[onclick*=\"addToCart('shred')\"],button[onclick*=\"addToCart('strength')\"],button[onclick*=\"addToCart('bundle')\"],button[onclick*=\"addToCart('mealplan')\"]").forEach(btn => {
      const onclick = btn.getAttribute("onclick") || "";
      const m = onclick.match(/addToCart\('([^']+)'\)/);
      const product = m && DIGITAL_PRODUCTS[m[1]] ? m[1] : "";
      if(!product) return;
      btn.removeAttribute("onclick");
      btn.type = "button";
      btn.textContent = "Notify me at launch";
      btn.addEventListener("click", () => {
        window.location.href = "early-access.html?interest=" + encodeURIComponent(product);
      });
    });
  }

  function cleanOfferText(){
    document.body.innerHTML = document.body.innerHTML
      .replace(/€9\.99\s*\/\s*month\/mo/gi, "Target launch price: €9.99 / month")
      .replace(/€9\.99\s*\/\s*month/gi, "Target launch price: €9.99 / month")
      .replace(/€24\.99\s*\/\s*month/gi, "Target launch price: €24.99 / month")
      .replace(/€7\.99\s*\/\s*month/gi, "Target launch price: €7.99 / month")
      .replace(/Launch offer/gi, "Early access estimate")
      .replace(/Monthly access/gi, "Early access")
      .replace(/Premium programs as a subscription/gi, "Join early access before launch")
      .replace(/Train with FitBrand every month\. Current launch pricing is shown with clear monthly billing, so customers know exactly what they subscribe to\./gi, "Join the waitlist, choose your goal and help us decide what to launch first. No payment required.");
  }

  function prefillEarlyAccess(){
    const form = qs("#fbEarlyAccessForm");
    if(!form) return;
    const params = new URLSearchParams(location.search);
    const interest = params.get("interest");
    if(interest && qs("#eaProduct")){
      qs("#eaProduct").value = interest;
    }
  }

  async function submitEarlyAccess(form){
    const msg = qs("#eaFormMessage");
    const submit = qs("#eaSubmit");
    const payload = {
      email: (qs("#eaEmail") || {}).value || "",
      full_name: (qs("#eaName") || {}).value || "",
      product_interest: (qs("#eaProduct") || {}).value || "aesthetic",
      goal: (qs("#eaGoal") || {}).value || "",
      monthly_price_interest: (qs("#eaPrice") || {}).value || "",
      start_timeline: "as-soon-as-ready",
      notes: (qs("#eaNotes") || {}).value || "",
      source_page: "early-access"
    };

    if(!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)){
      if(msg){ msg.textContent = "Please enter a valid email."; msg.className = "ea-form-message error"; }
      return;
    }

    if(submit){ submit.disabled = true; submit.textContent = "Joining..."; }
    if(msg){ msg.textContent = "Saving your spot..."; msg.className = "ea-form-message"; }

    try{
      const res = await fetch("/api/early-access-leads", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(()=>({}));
      if(!res.ok || data.error) throw new Error(data.error || "Could not save signup.");

      localStorage.setItem("fitbrandEarlyAccessSuccess", "1");
      localStorage.setItem("fitbrandEarlyAccessProduct", payload.product_interest);
      if(msg){ msg.textContent = "You are on the list. Redirecting to FitBrand..."; msg.className = "ea-form-message success"; }
      toast("You joined early access. Welcome to FitBrand.");
      setTimeout(() => { window.location.href = "index.html?early_access=success"; }, 1300);
    }catch(err){
      console.error(err);
      if(msg){
        msg.textContent = "Something went wrong. Please try again or DM us on TikTok/Instagram.";
        msg.className = "ea-form-message error";
      }
      if(submit){ submit.disabled = false; submit.textContent = "Join Early Access"; }
    }
  }

  function bindEarlyAccessForm(){
    const form = qs("#fbEarlyAccessForm");
    if(!form) return;
    form.addEventListener("submit", e => {
      e.preventDefault();
      submitEarlyAccess(form);
    });
  }

  function showReturnSuccess(){
    const params = new URLSearchParams(location.search);
    if(params.get("early_access") === "success" || localStorage.getItem("fitbrandEarlyAccessSuccess") === "1"){
      toast("You are on the FitBrand early access list.");
      localStorage.removeItem("fitbrandEarlyAccessSuccess");
    }
  }

  function boot(){
    addEarlyAccessNav();
    buildMobileMenu();
    rewriteDigitalCheckoutLinks();
    prefillEarlyAccess();
    bindEarlyAccessForm();
    showReturnSuccess();
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
