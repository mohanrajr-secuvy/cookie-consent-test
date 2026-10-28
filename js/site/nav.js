/*
 * Header navigation: mobile menu, active link, shadow once scrolled.
 * Sets no cookies.
 */
(function (d, w) {
  "use strict";

  // "shop.html", "/shop" and "/site/shop.html" all name the page "shop"; a folder ("/", "/site/") is "index"
  function pageName(path) {
    if (/\/$/.test(path)) return "index";
    var last = path.split("/").filter(Boolean).pop() || "index";
    return last.replace(/\.html$/, "");
  }

  d.addEventListener("DOMContentLoaded", function () {
    var header = d.querySelector(".site-header");
    var menuButton = d.querySelector("[data-menu-toggle]");
    d.querySelectorAll(".main-nav a").forEach(function (link) {
      if (pageName(link.getAttribute("href")) === pageName(location.pathname)) link.setAttribute("aria-current", "page");
    });

    if (menuButton) {
      menuButton.addEventListener("click", function () {
        var open = header.classList.toggle("menu-open");
        menuButton.setAttribute("aria-expanded", String(open));
      });
    }

    w.addEventListener("scroll", function () {
      header.classList.toggle("scrolled", w.scrollY > 8);
    }, { passive: true });
  });
})(document, window);
