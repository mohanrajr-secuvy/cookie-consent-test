/*!
 * px-sync.js (Northwind test mock)
 * Category: unknown. A cookie-sync script with no vendor name, to test how the
 * scan handles scripts and cookies it cannot categorise.
 */
(function (kit) {
  kit.track({
    vendor: "Unknown (px-sync)",
    category: "unknown",
    cookies: [
      { name: "_px_sync_uid", value: kit.uid(), days: 365 },
      { name: "cs_vid", value: kit.uid(), days: 30, sameSite: "None" },
    ],
  });
})(window.NWTrackerKit);
