/*!
 * Taboola pixel (Northwind test mock)
 * Category: marketing. Sets t_gid (1 year) and a session id.
 * Injected by the tag manager on DOM ready (insertBefore).
 */
(function (kit) {
  kit.track({
    vendor: "Taboola",
    category: "marketing",
    cookies: [{ name: "t_gid", value: kit.uid() + "-tuct" + kit.uid(), days: 365 }],
    sessionStorage: { "taboola global:last-external-referrer": "direct" },
  });
})(window.NWTrackerKit);
