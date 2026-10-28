/*!
 * Heap Analytics (Northwind test mock)
 * Category: analytics. Sets _hp2_id (13 months) and _hp2_ses_props (30 min).
 */
(function (kit) {
  var appId = "2390184756";
  kit.track({
    vendor: "Heap",
    category: "analytics",
    cookies: [
      { name: "_hp2_id." + appId, value: JSON.stringify({ userId: kit.uid(), pageviewId: kit.uid() }), days: 395 },
      { name: "_hp2_ses_props." + appId, value: JSON.stringify({ ts: Date.now() }), minutes: 30 },
    ],
  });
})(window.NWTrackerKit);
