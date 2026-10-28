/*!
 * collect.js (Northwind test mock)
 * Category: unknown. Generic fingerprint collector with no vendor name.
 */
(function (kit) {
  kit.track({
    vendor: "Unknown (collect)",
    category: "unknown",
    cookies: [{ name: "_cid_x", value: kit.uid(), days: 365 }],
    localStorage: { __fp_hash: kit.uid() + kit.uid() },
  });
})(window.NWTrackerKit);
