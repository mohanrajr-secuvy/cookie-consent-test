/*!
 * OptinMonster popups (Northwind test mock)
 * Category: marketing. Sets _omappvp (visitor, 11 years) and _omappvs (20 min).
 */
(function (kit) {
  kit.track({
    vendor: "OptinMonster",
    category: "marketing",
    cookies: [
      { name: "_omappvp", value: kit.uid() + kit.uid(), days: 4015 },
      { name: "_omappvs", value: String(Date.now()), minutes: 20 },
    ],
    localStorage: { "omSeenCampaigns": "{}" },
  });
})(window.NWTrackerKit);
