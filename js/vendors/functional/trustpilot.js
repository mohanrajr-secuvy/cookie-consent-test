/*!
 * Trustpilot TrustBox widget (Northwind test mock)
 * Category: functional. No cookies; caches the widget in localStorage.
 */
(function (kit) {
  kit.track({
    vendor: "Trustpilot",
    category: "functional",
    localStorage: { "tp-trustbox-cache": JSON.stringify({ score: 4.7, reviews: 2318 }) },
  });
})(window.NWTrackerKit);
