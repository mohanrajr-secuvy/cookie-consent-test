/*!
 * AB Tasty (Northwind test mock)
 * Category: personalization. Sets ABTasty (13 months) and ABTastySession (session).
 * Injected by the tag manager after load (prepend).
 */
(function (kit) {
  kit.track({
    vendor: "AB Tasty",
    category: "personalization",
    cookies: [
      { name: "ABTasty", value: "uid=" + kit.uid() + "&fst=" + Date.now(), days: 395 },
      { name: "ABTastySession", value: "mrasn=&lp=" + encodeURIComponent(location.href) },
    ],
  });
})(window.NWTrackerKit);
