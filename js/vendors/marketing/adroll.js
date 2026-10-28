/*!
 * AdRoll pixel (Northwind test mock)
 * Category: marketing. Sets __adroll_fpc and __ar_v4 (1 year).
 * Injected by the tag manager on DOM ready (appendChild, src property).
 */
(function (kit) {
  kit.track({
    vendor: "AdRoll",
    category: "marketing",
    cookies: [
      { name: "__adroll_fpc", value: kit.uid() + "-" + Date.now(), days: 365 },
      { name: "__ar_v4", value: "NWT7EST%3A20261028%3A1%7C", days: 365 },
    ],
  });
})(window.NWTrackerKit);
