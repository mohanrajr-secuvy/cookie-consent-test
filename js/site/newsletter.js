/*
 * Newsletter sign-up form: validation and thank-you message (no real submit).
 * Sets no cookies; remembers the sign-up for the tab in sessionStorage.
 */
(function (d, w) {
  "use strict";

  var SIGNED_UP_KEY = "nw_newsletter_signed_up";

  d.addEventListener("DOMContentLoaded", function () {
    d.querySelectorAll("[data-newsletter]").forEach(function (form) {
      var message = form.querySelector(".form-message");

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var email = form.querySelector("input[type=email]").value.trim();
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
          message.textContent = "Please enter a valid email address.";
          return;
        }
        try {
          w.sessionStorage.setItem(SIGNED_UP_KEY, "1");
        } catch (err) {
          // Not remembered; the message still shows
        }
        message.textContent = "Thanks! Check your inbox for 10% off your first order.";
        form.reset();
      });
    });
  });
})(document, window);
