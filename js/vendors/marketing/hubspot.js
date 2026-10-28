/*!
 * HubSpot tracking code (Northwind test mock)
 * Category: marketing. Sets __hstc, hubspotutk (6 months), __hssc (30 min), __hssrc (session).
 */
(function (kit) {
  var visitor = kit.uid();
  var now = Date.now();
  kit.track({
    vendor: "HubSpot",
    category: "marketing",
    cookies: [
      { name: "__hstc", value: ["24071983", visitor, now, now, now, "1"].join("."), days: 180 },
      { name: "hubspotutk", value: visitor, days: 180 },
      { name: "__hssc", value: "24071983.1." + now, minutes: 30 },
      { name: "__hssrc", value: "1" },
    ],
  });
})(window.NWTrackerKit);
