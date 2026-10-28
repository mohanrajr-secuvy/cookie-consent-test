/*!
 * Disqus comments embed (Northwind test mock)
 * Category: functional. Sets disqus_unique (1 year).
 */
(function (kit) {
  kit.track({
    vendor: "Disqus",
    category: "functional",
    cookies: [{ name: "disqus_unique", value: kit.uid(), days: 365 }],
    localStorage: { "disqus.thread": "northwind-journal-yosemite" },
  });
})(window.NWTrackerKit);
