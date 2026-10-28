/*!
 * Segment analytics.js (Northwind test mock)
 * Category: analytics. Sets ajs_anonymous_id in a cookie and localStorage.
 */
(function (kit) {
  var anonymousId = kit.readCookie("ajs_anonymous_id") || kit.uid();
  kit.track({
    vendor: "Segment",
    category: "analytics",
    cookies: [{ name: "ajs_anonymous_id", value: anonymousId, days: 365 }],
    localStorage: { ajs_anonymous_id: JSON.stringify(anonymousId), ajs_user_traits: "{}" },
  });
})(window.NWTrackerKit);
