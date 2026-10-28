/*!
 * Crisp chat (Northwind test mock)
 * Category: functional. Sets crisp-client/session/<website> (6 months).
 * Injected by the tag manager when the visitor clicks "Chat with us".
 */
(function (kit) {
  kit.track({
    vendor: "Crisp",
    category: "functional",
    cookies: [{ name: "crisp-client%2Fsession%2F1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d", value: "session_" + kit.uid(), days: 180 }],
  });
})(window.NWTrackerKit);
