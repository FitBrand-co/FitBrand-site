
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".section, .split, .review-section, .email-signup, .product-detail-section, .cart-page").forEach(el => el.classList.add("reveal"));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.12});
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
  const signup = document.getElementById("fitbrand-signup-form");
  if(signup){
    signup.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("fitbrand-email")?.value || "";
      const msg = document.getElementById("signup-message");
      if(!email.includes("@")){
        msg.textContent = "Please enter a valid email.";
        return;
      }
      const list = JSON.parse(localStorage.getItem("fitbrandEmailList") || "[]");
      if(!list.includes(email)) list.push(email);
      localStorage.setItem("fitbrandEmailList", JSON.stringify(list));
      msg.textContent = "You're in. Connect this form to Mailchimp/Klaviyo/Formspree when ready.";
      signup.reset();
    });
  }
});
window.addEventListener("scroll", function(){
  const nav = document.querySelector(".nav");

  if(window.scrollY > 180){
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});
(function(){
  function updateHeader(){
    const nav = document.querySelector(".nav");
    if(!nav) return;

    if(window.scrollY > 180){
      nav.classList.add("scrolled");
    }else{
      nav.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", updateHeader);
  window.addEventListener("DOMContentLoaded", updateHeader);
})();
/* ===== FITBRAND PROFILE SYSTEM ===== */

function getFitBrandUser(){
return JSON.parse(localStorage.getItem("fitbrandUser") || "null");
}

function updateFitBrandProfileUI(){

const user=getFitBrandUser();

const initial=user?.name
? user.name.trim().charAt(0).toUpperCase()
: "?";

document.querySelectorAll("#profileInitial,#profileMenuInitial,#profileViewInitial")
.forEach(el=>{
if(el) el.textContent=initial;
});

document.querySelectorAll("#profileMenuName,#profileViewName")
.forEach(el=>{
if(el) el.textContent=user?.name || "Guest";
});

document.querySelectorAll("#profileMenuEmail,#profileViewEmail")
.forEach(el=>{
if(el) el.textContent=user?.email || "Not logged in";
});

const login=document.getElementById("profileLoginBtn");
const logout=document.getElementById("profileLogoutBtn");

if(login) login.style.display=user ? "none":"block";
if(logout) logout.style.display=user ? "block":"none";

}

function toggleProfileMenu(){
document.getElementById("profileMenu")?.classList.toggle("show");
}

function openProfileModal(mode){

document.getElementById("profileMenu")?.classList.remove("show");

const modal=document.getElementById("profileModalOverlay");
const form=document.getElementById("profileForm");
const view=document.getElementById("profileViewBox");
const title=document.getElementById("profileModalTitle");
const user=getFitBrandUser();

if(mode==="profile"){
title.textContent="Your Profile";
form.style.display="none";
view.style.display="block";
}
else{
title.textContent="Log in";
form.style.display="grid";
view.style.display="none";

document.getElementById("profileNameInput").value=user?.name || "";
document.getElementById("profileEmailInput").value=user?.email || "";
}

updateFitBrandProfileUI();
modal.classList.add("show");
}

function closeProfileModal(){
document.getElementById("profileModalOverlay")?.classList.remove("show");
}

function logoutFitBrandUser(){
localStorage.removeItem("fitbrandUser");
updateFitBrandProfileUI();
}

function fakeGoogleLogin(){

const email=prompt("Enter your Google email:");

if(!email) return;

const name=email.split("@")[0].replace(/[._-]/g," ");

localStorage.setItem("fitbrandUser",
JSON.stringify({
name:name.charAt(0).toUpperCase()+name.slice(1),
email
}));

updateFitBrandProfileUI();

closeProfileModal();

}

document.addEventListener("DOMContentLoaded",function(){

updateFitBrandProfileUI();

const form=document.getElementById("profileForm");

if(form){

form.addEventListener("submit",function(e){

e.preventDefault();

const name=document.getElementById("profileNameInput").value.trim();
const email=document.getElementById("profileEmailInput").value.trim();

if(!name || !email){
alert("Enter name and email");
return;
}

localStorage.setItem("fitbrandUser",JSON.stringify({name,email}));

updateFitBrandProfileUI();

closeProfileModal();

});

}

});
