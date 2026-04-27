
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

  if(window.scrollY > 40){
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});
