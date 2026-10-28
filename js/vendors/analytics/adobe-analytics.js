/*!
 * Adobe Analytics AppMeasurement + Visitor ID service (Northwind test mock)
 * Category: analytics. Sets AMCV_ (2 years), s_cc and s_sq (session).
 */
(function (kit) {
  kit.track({
    vendor: "Adobe Analytics",
    category: "analytics",
    cookies: [
      { name: "AMCV_0A1B2C3D4E5F6A7B8C9D0E1F%40AdobeOrg", value: "MCMID|" + kit.uid() + "|vVersion|5.5.0", days: 730 },
      { name: "s_cc", value: "true" },
      { name: "s_sq", value: "northwind-prod%3D%2526pid%253Dhome" },
    ],
  });
})(window.NWTrackerKit);
