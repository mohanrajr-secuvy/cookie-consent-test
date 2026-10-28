/*!
 * Optimizely Web Experimentation (Northwind test mock)
 * Category: personalization. Sets optimizelyEndUserId (6 months) and optimizelySession (session).
 */
(function (kit) {
  var userId = "oeu" + Date.now() + "r" + Math.random();
  kit.track({
    vendor: "Optimizely",
    category: "personalization",
    cookies: [
      { name: "optimizelyEndUserId", value: userId, days: 180 },
      { name: "optimizelySession", value: "0" },
    ],
    localStorage: { ["optimizely_data$$" + userId + "$$24719370$$session_state"]: "{}" },
  });
})(window.NWTrackerKit);
