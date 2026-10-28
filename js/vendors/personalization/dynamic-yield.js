/*!
 * Dynamic Yield (Northwind test mock)
 * Category: personalization. Sets _dyid, _dycst (1 year) and _dyjsession (30 min).
 */
(function (kit) {
  kit.track({
    vendor: "Dynamic Yield",
    category: "personalization",
    cookies: [
      { name: "_dyid", value: String(Math.floor(Math.random() * 1e18)), days: 365 },
      { name: "_dycst", value: "dk.l.c.ws.", days: 365 },
      { name: "_dyjsession", value: kit.uid(), minutes: 30 },
    ],
    sessionStorage: { _dy_ses_load_seq: "1" },
  });
})(window.NWTrackerKit);
