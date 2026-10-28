/*!
 * Salesforce Pardot (Account Engagement) tracking (Northwind test mock)
 * Category: marketing. Sets visitor_id<account> and its hash (10 years).
 */
(function (kit) {
  var account = "812341";
  kit.track({
    vendor: "Pardot",
    category: "marketing",
    cookies: [
      { name: "visitor_id" + account, value: String(Math.floor(Math.random() * 1e9)), days: 3650 },
      { name: "visitor_id" + account + "-hash", value: kit.uid() + kit.uid(), days: 3650 },
    ],
  });
})(window.NWTrackerKit);
