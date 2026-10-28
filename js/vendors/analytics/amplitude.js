/*!
 * Amplitude Browser SDK (Northwind test mock)
 * Category: analytics. Sets AMP_<key> cookies and the unsent-events queue.
 */
(function (kit) {
  var key = "a8f3c1d2e4";
  kit.track({
    vendor: "Amplitude",
    category: "analytics",
    cookies: [
      { name: "AMP_" + key, value: kit.uid(), days: 365 },
      { name: "AMP_MKTG_" + key, value: "JTdCJTdE", days: 365 },
    ],
    localStorage: { ["AMP_unsent_" + key]: "[]" },
  });
})(window.NWTrackerKit);
