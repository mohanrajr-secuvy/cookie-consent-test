/*!
 * Matomo (Piwik) tracker (Northwind test mock)
 * Category: analytics. Sets _pk_id (13 months) and _pk_ses (30 min).
 */
(function (kit) {
  var hash = "1.4e2f";
  kit.track({
    vendor: "Matomo",
    category: "analytics",
    cookies: [
      { name: "_pk_id." + hash, value: kit.uid() + "." + Math.floor(Date.now() / 1000) + ".", days: 395 },
      { name: "_pk_ses." + hash, value: "1", minutes: 30 },
    ],
  });
})(window.NWTrackerKit);
