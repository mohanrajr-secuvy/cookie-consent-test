/*!
 * LiveChat (Northwind test mock)
 * Category: functional. Sets __lc_cid and __lc_cst (2 years).
 */
(function (kit) {
  kit.track({
    vendor: "LiveChat",
    category: "functional",
    cookies: [
      { name: "__lc_cid", value: kit.uid() + "-" + kit.uid(), days: 730 },
      { name: "__lc_cst", value: kit.uid(), days: 730 },
    ],
  });
})(window.NWTrackerKit);
