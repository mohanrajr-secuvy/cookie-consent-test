/*!
 * Plausible Analytics (Northwind test mock)
 * Category: analytics. Cookieless: it sets nothing. Use it to check that a rule
 * holds a script even when there is no cookie to see.
 */
(function (kit) {
  kit.track({ vendor: "Plausible", category: "analytics" });
})(window.NWTrackerKit);
