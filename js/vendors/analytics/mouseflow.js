/*!
 * Mouseflow session replay (Northwind test mock)
 * Category: analytics. Sets mf_<site-id> and mf_user (90 days).
 */
(function (kit) {
  kit.track({
    vendor: "Mouseflow",
    category: "analytics",
    cookies: [
      { name: "mf_7c1e4a90-2b3d-4f5e-8a6b-9c0d1e2f3a4b", value: kit.uid(), days: 90 },
      { name: "mf_user", value: kit.uid() + "|", days: 90 },
    ],
  });
})(window.NWTrackerKit);
