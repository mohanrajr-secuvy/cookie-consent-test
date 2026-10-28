/*!
 * FullStory recording snippet (Northwind test mock)
 * Category: analytics. Sets fs_uid (1 year) and fs_lua (last user action).
 */
(function (kit) {
  kit.track({
    vendor: "FullStory",
    category: "analytics",
    cookies: [
      { name: "fs_uid", value: "#o-NW7T-na1#" + kit.uid() + ":" + kit.uid() + "/" + Date.now(), days: 365 },
      { name: "fs_lua", value: "1." + Date.now(), minutes: 30 },
    ],
  });
})(window.NWTrackerKit);
