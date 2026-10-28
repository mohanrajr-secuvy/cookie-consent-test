/*!
 * VWO SmartCode (Northwind test mock)
 * Category: personalization. Sets _vwo_uuid_v2 (1 year), _vis_opt_s (100 days), _vis_opt_test_cookie (session).
 */
(function (kit) {
  kit.track({
    vendor: "VWO",
    category: "personalization",
    cookies: [
      { name: "_vwo_uuid_v2", value: "D" + kit.uid().toUpperCase() + "|" + kit.uid(), days: 365 },
      { name: "_vis_opt_s", value: "1%7C", days: 100 },
      { name: "_vis_opt_test_cookie", value: "1" },
    ],
  });
})(window.NWTrackerKit);
