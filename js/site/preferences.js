/*
 * Visitor preferences: colour theme and currency.
 * Functional cookies set by the site itself: nw_theme, nw_currency.
 */
(function (d) {
  "use strict";

  var YEAR_SECONDS = 365 * 24 * 60 * 60;

  function readCookie(name) {
    var match = d.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function savePreference(name, value) {
    d.cookie = name + "=" + encodeURIComponent(value) + "; path=/; max-age=" + YEAR_SECONDS + "; SameSite=Lax";
  }

  // Applied immediately (this script is sync in <head>) so the page never flashes
  var theme = readCookie("nw_theme") || "light";
  d.documentElement.setAttribute("data-theme", theme);

  d.addEventListener("DOMContentLoaded", function () {
    var themeToggle = d.querySelector("[data-theme-toggle]");
    if (themeToggle) {
      themeToggle.addEventListener("click", function () {
        theme = theme === "dark" ? "light" : "dark";
        d.documentElement.setAttribute("data-theme", theme);
        savePreference("nw_theme", theme);
      });
    }

    var currencySelect = d.querySelector("[data-currency]");
    if (currencySelect) {
      currencySelect.value = readCookie("nw_currency") || "USD";
      currencySelect.addEventListener("change", function () {
        savePreference("nw_currency", currencySelect.value);
      });
    }
  });
})(document);
