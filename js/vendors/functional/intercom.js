/*!
 * Intercom Messenger (Northwind test mock)
 * Category: functional. Sets intercom-id / intercom-device-id (9 months) and intercom-session (7 days).
 */
(function (kit) {
  var appId = "nw7t3st";
  kit.track({
    vendor: "Intercom",
    category: "functional",
    cookies: [
      { name: "intercom-id-" + appId, value: kit.uid(), days: 270 },
      { name: "intercom-device-id-" + appId, value: kit.uid(), days: 270 },
      { name: "intercom-session-" + appId, value: "", days: 7 },
    ],
  });
})(window.NWTrackerKit);
