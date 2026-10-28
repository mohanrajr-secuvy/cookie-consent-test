/*!
 * Mailchimp site connection (Northwind test mock)
 * Category: marketing. Sets _mcid (1 year).
 */
(function (kit) {
  kit.track({
    vendor: "Mailchimp",
    category: "marketing",
    cookies: [{ name: "_mcid", value: "1." + kit.uid(), days: 365 }],
  });
})(window.NWTrackerKit);
