/*
 * Shared helper for the mock vendor scripts in /js/vendors/.
 *
 * Each mock vendor calls NWTrackerKit.track({...}) with the cookies and storage
 * keys its real counterpart sets. Running is recorded so the script monitor
 * (?debug=1) can show which trackers actually executed.
 *
 * This file is essential: if it is held, every mock vendor fails.
 */
(function (w, d) {
  "use strict";

  var MINUTE = 60 * 1000;
  var DAY = 24 * 60 * MINUTE;
  var isHttps = location.protocol === "https:";

  function uid() {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }

  function readCookie(name) {
    var prefix = name + "=";
    var match = d.cookie.split("; ").filter(function (c) {
      return c.indexOf(prefix) === 0;
    })[0];
    return match ? decodeURIComponent(match.slice(prefix.length)) : null;
  }

  // Persistent ids keep their first value, as real trackers do; the expiry is renewed
  function setCookie(c) {
    var value = readCookie(c.name) || c.value;
    var sameSite = c.sameSite || "Lax";
    if (sameSite === "None" && !isHttps) sameSite = "Lax"; // None requires Secure

    var parts = [c.name + "=" + encodeURIComponent(value), "path=" + (c.path || "/"), "SameSite=" + sameSite];
    if (c.days) parts.push("expires=" + new Date(Date.now() + c.days * DAY).toUTCString());
    if (c.minutes) parts.push("expires=" + new Date(Date.now() + c.minutes * MINUTE).toUTCString());
    if (isHttps) parts.push("Secure");
    d.cookie = parts.join("; ");
  }

  function setStorage(storage, entries) {
    try {
      Object.keys(entries || {}).forEach(function (key) {
        if (storage.getItem(key) === null) storage.setItem(key, entries[key]);
      });
    } catch (err) {
      // Storage can be disabled; cookies still prove the tracker ran
    }
  }

  var ran = (w.__NW_TRACKERS_RAN__ = w.__NW_TRACKERS_RAN__ || []);

  function track(def) {
    (def.cookies || []).forEach(setCookie);
    setStorage(w.localStorage, def.localStorage);
    setStorage(w.sessionStorage, def.sessionStorage);

    var entry = { vendor: def.vendor, category: def.category, src: d.currentScript && d.currentScript.src, at: Date.now() };
    ran.push(entry);
    d.dispatchEvent(new CustomEvent("nw:tracker-ran", { detail: entry }));
    console.info("[Northwind] tracker ran:", def.vendor, "(" + def.category + ")");
  }

  w.NWTrackerKit = { track: track, uid: uid, readCookie: readCookie };
})(window, document);
