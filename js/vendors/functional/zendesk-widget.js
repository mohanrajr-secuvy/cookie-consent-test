/*!
 * Zendesk Web Widget (Northwind test mock)
 * Category: functional. Sets __zlcmid (1 year) and ZD-suid in localStorage.
 */
(function (kit) {
  kit.track({
    vendor: "Zendesk",
    category: "functional",
    cookies: [{ name: "__zlcmid", value: kit.uid().toUpperCase(), days: 365 }],
    localStorage: { "ZD-suid": JSON.stringify({ id: kit.uid(), expiresAt: Date.now() + 1800000 }) },
  });
})(window.NWTrackerKit);
