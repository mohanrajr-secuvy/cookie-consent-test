/*
 * Loaded with type="module" (deferred by default). Starts the UI libraries
 * that are present: AOS scroll animations and the Swiper carousel. Both are
 * third-party scripts a rule may hold, so each is optional.
 */
document.documentElement.classList.add("has-modules");

if (window.AOS) window.AOS.init({ once: true, duration: 600 });

const carousel = document.querySelector(".swiper");
if (carousel && window.Swiper) {
  new window.Swiper(carousel, {
    slidesPerView: 1.15,
    spaceBetween: 16,
    breakpoints: { 720: { slidesPerView: 2.2 }, 1080: { slidesPerView: 3.2 } },
  });
}

// Copyright year in the footer
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});
