/*
 * Shopping cart and server session.
 * Necessary: nw_cart cookie (item count), nw_cart_items in localStorage.
 * Also calls /api/session once per tab, which sets the HttpOnly server cookies.
 */
(function (d, w) {
  "use strict";

  var ITEMS_KEY = "nw_cart_items";

  function readItems() {
    try {
      return JSON.parse(w.localStorage.getItem(ITEMS_KEY)) || [];
    } catch (err) {
      return [];
    }
  }

  function saveItems(items) {
    try {
      w.localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
    } catch (err) {
      // Storage disabled: the cookie still holds the count
    }
    d.cookie = "nw_cart=" + items.length + "; path=/; max-age=" + 7 * 24 * 60 * 60 + "; SameSite=Lax";
  }

  function renderCount(items) {
    d.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = items.length;
      el.hidden = items.length === 0;
    });
  }

  function showToast(message) {
    var toast = d.querySelector(".toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(function () {
      toast.classList.remove("visible");
    }, 2200);
  }

  function startServerSession() {
    try {
      if (w.sessionStorage.getItem("nw_session_started")) return;
      w.sessionStorage.setItem("nw_session_started", "1");
    } catch (err) {
      // Without sessionStorage, call the endpoint on every page
    }
    w.fetch("/api/session", { credentials: "same-origin" }).catch(function () {
      // Not deployed on Vercel (local preview): no server cookies
    });
  }

  d.addEventListener("DOMContentLoaded", function () {
    var items = readItems();
    renderCount(items);
    startServerSession();

    d.addEventListener("click", function (e) {
      var button = e.target.closest("[data-add-to-cart]");
      if (!button) return;
      items.push(button.getAttribute("data-add-to-cart"));
      saveItems(items);
      renderCount(items);
      showToast(button.getAttribute("data-product-name") + " added to your cart");
      d.dispatchEvent(new CustomEvent("nw:add-to-cart", { detail: { sku: button.getAttribute("data-add-to-cart") } }));
    });
  });
})(document, window);
