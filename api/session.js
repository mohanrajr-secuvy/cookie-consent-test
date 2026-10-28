// Vercel serverless function: sets cookies over HTTP (Set-Cookie headers) so the
// scan sees cookies that page JavaScript cannot create or read (HttpOnly).
// The consent blocker cannot hold these: they arrive with the response.
const crypto = require("crypto");

const DAY = 24 * 60 * 60;

function cookie(name, value, attrs) {
  return [`${name}=${value}`, ...attrs].join("; ");
}

module.exports = (req, res) => {
  const id = crypto.randomUUID();

  res.setHeader("Set-Cookie", [
    // Necessary: server session, HttpOnly, ends with the browser session
    cookie("nw_session", id, ["Path=/", "Secure", "HttpOnly", "SameSite=Strict"]),
    // Necessary: CSRF token the page reads, so not HttpOnly
    cookie("nw_csrf", crypto.randomBytes(16).toString("hex"), [
      "Path=/",
      "Max-Age=3600",
      "Secure",
      "SameSite=Strict",
    ]),
    // Functional: long-lived device id, HttpOnly
    cookie("nw_device_id", id, ["Path=/", `Max-Age=${365 * DAY}`, "Secure", "HttpOnly", "SameSite=Lax"]),
    // Personalization: A/B bucket, SameSite=None (sent in cross-site requests)
    cookie("nw_ab_bucket", Math.random() < 0.5 ? "A" : "B", [
      "Path=/",
      `Max-Age=${30 * DAY}`,
      "Secure",
      "SameSite=None",
    ]),
    // Marketing: referral cookie scoped to the shop path only
    cookie("nw_ref", "journal-newsletter", ["Path=/shop", `Max-Age=${7 * DAY}`, "Secure", "SameSite=Lax"]),
  ]);
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ ok: true });
};
