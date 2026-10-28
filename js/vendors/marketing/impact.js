/*!
 * Impact (affiliate) Universal Tracking Tag (Northwind test mock)
 * Category: marketing. Sets IR_gbd, IR_PI (1 year) and IR_<campaign> (1 day).
 * Injected by the tag manager on DOM ready (setAttribute src, append).
 */
(function (kit) {
  kit.track({
    vendor: "Impact",
    category: "marketing",
    cookies: [
      { name: "IR_gbd", value: location.hostname, days: 365 },
      { name: "IR_PI", value: kit.uid() + "%7C" + Date.now(), days: 365 },
      { name: "IR_17421", value: Date.now() + "%7C0%7C" + Date.now(), days: 1 },
    ],
  });
})(window.NWTrackerKit);
