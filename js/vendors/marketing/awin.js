/*!
 * Awin affiliate MasterTag (Northwind test mock)
 * Category: marketing. Sets _aw_m_<advertiser> (1 year).
 * Injected by the tag manager on the first "Add to cart" click.
 */
(function (kit) {
  kit.track({
    vendor: "Awin",
    category: "marketing",
    cookies: [{ name: "_aw_m_28411", value: "28411_" + Date.now() + "_" + kit.uid(), days: 365 }],
  });
})(window.NWTrackerKit);
