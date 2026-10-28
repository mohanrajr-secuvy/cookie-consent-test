/*!
 * Mixpanel JS library (Northwind test mock)
 * Category: analytics. Sets the mp_<token>_mixpanel cookie.
 */
(function (kit) {
  var token = "4f1c2e9b7a3d";
  kit.track({
    vendor: "Mixpanel",
    category: "analytics",
    cookies: [
      { name: "mp_" + token + "_mixpanel", value: JSON.stringify({ distinct_id: kit.uid(), $device_id: kit.uid() }), days: 365 },
    ],
  });
})(window.NWTrackerKit);
