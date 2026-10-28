/*!
 * Marketo Munchkin (Northwind test mock)
 * Category: marketing. Sets _mkto_trk (2 years).
 */
(function (kit) {
  kit.track({
    vendor: "Marketo",
    category: "marketing",
    cookies: [{ name: "_mkto_trk", value: "id:123-NWT-456&token:_mch-northwind-" + kit.uid(), days: 730 }],
  });
})(window.NWTrackerKit);
