/*!
 * Klaviyo onsite tracking (Northwind test mock)
 * Category: marketing. Sets __kla_id (2 years).
 */
(function (kit) {
  kit.track({
    vendor: "Klaviyo",
    category: "marketing",
    cookies: [{ name: "__kla_id", value: btoa(JSON.stringify({ $exchange_id: kit.uid() })), days: 730 }],
    localStorage: { klaviyoOnsite: JSON.stringify({ viewedForms: {} }) },
  });
})(window.NWTrackerKit);
