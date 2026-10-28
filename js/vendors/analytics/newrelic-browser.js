/*!
 * New Relic Browser agent (Northwind test mock)
 * Category: performance. Uses session storage only, no cookies.
 */
(function (kit) {
  kit.track({
    vendor: "New Relic Browser",
    category: "performance",
    localStorage: { NRBA_SESSION: JSON.stringify({ value: kit.uid(), inactiveAt: Date.now() + 1800000 }) },
    sessionStorage: { NRBA_SESSION_ID: kit.uid() },
  });
})(window.NWTrackerKit);
