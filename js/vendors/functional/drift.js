/*!
 * Drift chat (Northwind test mock)
 * Category: functional. Sets drift_aid, driftt_aid (2 years) and drift_campaign_refresh (session).
 */
(function (kit) {
  var anonymousId = kit.uid();
  kit.track({
    vendor: "Drift",
    category: "functional",
    cookies: [
      { name: "drift_aid", value: anonymousId, days: 730 },
      { name: "driftt_aid", value: anonymousId, days: 730 },
      { name: "drift_campaign_refresh", value: kit.uid() },
    ],
  });
})(window.NWTrackerKit);
