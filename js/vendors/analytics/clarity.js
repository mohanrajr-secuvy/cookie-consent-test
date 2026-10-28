/*!
 * Microsoft Clarity (Northwind test mock)
 * Category: analytics. Sets _clck (visitor) and _clsk (session) like the real tag.
 */
(function (kit) {
  kit.track({
    vendor: "Microsoft Clarity",
    category: "analytics",
    cookies: [
      { name: "_clck", value: kit.uid() + "|2|fnw|0|1", days: 365 },
      { name: "_clsk", value: kit.uid() + "|1|1|0|a.clarity.ms/collect", days: 1 },
    ],
  });
})(window.NWTrackerKit);
