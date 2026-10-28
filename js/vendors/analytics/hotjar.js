/*!
 * Hotjar tracking code (Northwind test mock)
 * Category: analytics. Sets the cookies and storage keys the real Hotjar tag sets.
 */
(function (kit) {
  var siteId = "3812345";
  kit.track({
    vendor: "Hotjar",
    category: "analytics",
    cookies: [
      { name: "_hjSessionUser_" + siteId, value: kit.uid(), days: 365 },
      { name: "_hjSession_" + siteId, value: kit.uid(), minutes: 30 },
      { name: "_hjAbsoluteSessionInProgress", value: "0", minutes: 30 },
    ],
    localStorage: { _hjSessionStorageTest: "1" },
    sessionStorage: { _hjRecordingEnabled: "true" },
  });
})(window.NWTrackerKit);
