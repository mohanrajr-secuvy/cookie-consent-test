/*!
 * Tawk.to live chat (Northwind test mock)
 * Category: functional. Sets twk_uuid_<property> (6 months) and TawkConnectionTime (session).
 */
(function (kit) {
  kit.track({
    vendor: "Tawk.to",
    category: "functional",
    cookies: [
      { name: "twk_uuid_64f0a1b2c3d4e5f6a7b8c9d0", value: JSON.stringify({ uuid: kit.uid(), version: 3 }), days: 180 },
      { name: "TawkConnectionTime", value: "0" },
    ],
    sessionStorage: { "twk_token": kit.uid() },
  });
})(window.NWTrackerKit);
