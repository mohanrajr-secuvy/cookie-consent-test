/*!
 * Crazy Egg heatmaps (Northwind test mock)
 * Category: analytics. Sets _ce.s (1 year) and _ce.clock_data (1 day).
 * Injected by the tag manager on the first scroll.
 */
(function (kit) {
  kit.track({
    vendor: "Crazy Egg",
    category: "analytics",
    cookies: [
      { name: "_ce.s", value: "v~" + kit.uid() + "~lcw~" + Date.now(), days: 365 },
      { name: "_ce.clock_data", value: "-12%2C1.2.3.4%2C1%2C" + kit.uid(), days: 1 },
    ],
  });
})(window.NWTrackerKit);
