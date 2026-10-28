/*!
 * Yotpo reviews widget (Northwind test mock)
 * Category: functional. Sets yotpo_pixel (1 year) and a widget cache.
 */
(function (kit) {
  kit.track({
    vendor: "Yotpo",
    category: "functional",
    cookies: [{ name: "yotpo_pixel", value: kit.uid() + "-" + kit.uid(), days: 365 }],
    sessionStorage: { "yotpo-widget-cache": "{}" },
  });
})(window.NWTrackerKit);
