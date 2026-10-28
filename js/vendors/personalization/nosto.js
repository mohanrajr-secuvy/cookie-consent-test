/*!
 * Nosto product recommendations (Northwind test mock)
 * Category: personalization. Loaded with type="module". Sets 2c.cId (2 years).
 */
const kit = window.NWTrackerKit;
kit.track({
  vendor: "Nosto",
  category: "personalization",
  cookies: [{ name: "2c.cId", value: kit.uid() + kit.uid(), days: 730 }],
});
