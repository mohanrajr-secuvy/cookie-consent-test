/*!
 * CJ Affiliate site tag (Northwind test mock)
 * Category: marketing. Sets cje (13 months).
 */
(function (kit) {
  kit.track({
    vendor: "CJ Affiliate",
    category: "marketing",
    cookies: [{ name: "cje", value: "Aaq" + kit.uid() + kit.uid(), days: 395 }],
  });
})(window.NWTrackerKit);
