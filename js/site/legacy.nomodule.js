/*
 * Loaded with the nomodule attribute: only browsers without ES module support
 * run it. Modern browsers (and the scanner's Chromium) never fetch it, so the
 * script monitor shows it as "skipped".
 */
(function (d) {
  "use strict";
  d.documentElement.className += " legacy-browser";
  var years = d.querySelectorAll("[data-year]");
  for (var i = 0; i < years.length; i++) years[i].textContent = new Date().getFullYear();
})(document);
