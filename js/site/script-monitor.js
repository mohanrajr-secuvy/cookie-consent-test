/*
 * Script monitor: a debug panel for testing the consent blocker.
 *
 * Open any page with ?debug=1 (remembered across pages; ?debug=0 turns it off).
 * It lists every external <script> with its state, plus cookies and storage:
 *   loaded  - the script downloaded and ran
 *   held    - the Secuvy blocker holds it as text/plain until consent
 *   failed  - the request failed (404, network, blocked by the browser)
 *   pending - inserted, not finished yet
 *
 * Load this right after the Secuvy files, before every other script, so it sees
 * each script's load/error event. It is essential: do not create a rule for it.
 */
(function (w, d) {
  "use strict";

  var DEBUG_KEY = "nw_debug";
  var HELD_NAME_ATTR = "data-secuvy-name";
  var states = new WeakMap();

  // Load/error events do not bubble, but capture listeners on document see them
  d.addEventListener("load", function (e) { if (e.target.tagName === "SCRIPT") states.set(e.target, "loaded"); }, true);
  d.addEventListener("error", function (e) { if (e.target.tagName === "SCRIPT") states.set(e.target, "failed"); }, true);

  function debugEnabled() {
    var flag = new URLSearchParams(location.search).get("debug");
    try {
      if (flag === "1") localStorage.setItem(DEBUG_KEY, "1");
      if (flag === "0") localStorage.removeItem(DEBUG_KEY);
      return localStorage.getItem(DEBUG_KEY) === "1";
    } catch (err) {
      return flag === "1";
    }
  }

  function scriptState(el) {
    if (el.getAttribute("type") === "text/plain" && el.hasAttribute(HELD_NAME_ATTR)) return "held";
    if (el.hasAttribute("nomodule") && "noModule" in el) return "skipped";
    return states.get(el) || "pending";
  }

  function collectScripts() {
    return Array.prototype.map.call(d.querySelectorAll("script[src]"), function (el) {
      var url = new URL(el.getAttribute("src"), location.href);
      return {
        state: scriptState(el),
        host: url.host === location.host ? "first-party" : url.host,
        file: url.pathname.split("/").filter(Boolean).pop() || url.pathname,
        rule: el.getAttribute(HELD_NAME_ATTR) || "",
        how: el.dataset.injectedBy ? "dynamic (" + el.dataset.injectedBy + ")" : el.type === "module" ? "module" : el.async ? "async" : el.defer ? "defer" : "sync",
      };
    });
  }

  function collectCookies() {
    return d.cookie ? d.cookie.split("; ").map(function (c) { return c.split("=")[0]; }) : [];
  }

  function storageKeys(storage) {
    try {
      return Object.keys(storage);
    } catch (err) {
      return [];
    }
  }

  // Test reset: removes JS-visible cookies (HttpOnly ones need DevTools) and storage
  function clearAll() {
    collectCookies().forEach(function (name) {
      ["/", "/shop", location.pathname].forEach(function (path) {
        d.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=" + path;
      });
    });
    try {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem(DEBUG_KEY, "1");
    } catch (err) {
      // Storage disabled: nothing to clear
    }
    location.reload();
  }

  var STYLE =
    "#nw-monitor{position:fixed;right:16px;bottom:16px;z-index:2147483000;font:12px/1.4 ui-monospace,Menlo,Consolas,monospace;color:#e6edf3}" +
    "#nw-monitor button{font:inherit;cursor:pointer;border:0;border-radius:6px;padding:6px 10px;background:#1f6feb;color:#fff}" +
    "#nw-monitor .nw-panel{display:none;width:min(560px,calc(100vw - 32px));max-height:70vh;overflow:auto;margin-bottom:8px;background:#0d1117;border:1px solid #30363d;border-radius:10px;padding:12px;box-shadow:0 12px 32px rgba(0,0,0,.4)}" +
    "#nw-monitor.open .nw-panel{display:block}" +
    "#nw-monitor table{width:100%;border-collapse:collapse}#nw-monitor td,#nw-monitor th{padding:3px 6px;border-bottom:1px solid #21262d;text-align:left;vertical-align:top;word-break:break-all}" +
    "#nw-monitor h4{margin:12px 0 6px;font-size:12px;color:#8b949e;text-transform:uppercase;letter-spacing:.06em}" +
    "#nw-monitor .s-loaded{color:#3fb950}#nw-monitor .s-held{color:#d29922}#nw-monitor .s-failed{color:#f85149}#nw-monitor .s-pending,#nw-monitor .s-skipped{color:#8b949e}" +
    "#nw-monitor .nw-bar{display:flex;gap:8px;justify-content:flex-end}#nw-monitor .nw-bar .nw-clear{background:#30363d}";

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  function render(root) {
    var scripts = collectScripts();
    var count = function (state) { return scripts.filter(function (s) { return s.state === state; }).length; };
    var cookies = collectCookies();

    root.querySelector(".nw-toggle").textContent =
      "Scripts " + scripts.length + " · loaded " + count("loaded") + " · held " + count("held") + " · failed " + count("failed") + " · cookies " + cookies.length;
    if (!root.classList.contains("open")) return;

    var rows = scripts.map(function (s) {
      return "<tr><td class='s-" + s.state + "'>" + s.state + "</td><td>" + escapeHtml(s.host) + "</td><td>" + escapeHtml(s.file) + "</td><td>" + escapeHtml(s.how) + "</td><td>" + escapeHtml(s.rule) + "</td></tr>";
    });
    var list = function (keys) { return keys.length ? escapeHtml(keys.sort().join(", ")) : "(none)"; };

    root.querySelector(".nw-body").innerHTML =
      "<h4>Scripts (" + scripts.length + ")</h4><table><tr><th>state</th><th>host</th><th>file</th><th>load</th><th>held by rule</th></tr>" + rows.join("") + "</table>" +
      "<h4>Cookies visible to JS (" + cookies.length + ")</h4><div>" + list(cookies) + "</div>" +
      "<h4>localStorage</h4><div>" + list(storageKeys(w.localStorage)) + "</div>" +
      "<h4>sessionStorage</h4><div>" + list(storageKeys(w.sessionStorage)) + "</div>";
  }

  function mount() {
    var style = d.createElement("style");
    style.textContent = STYLE;
    d.head.appendChild(style);

    var root = d.createElement("div");
    root.id = "nw-monitor";
    root.innerHTML =
      "<div class='nw-panel'><div class='nw-bar'><button class='nw-clear' type='button'>Clear cookies + storage &amp; reload</button></div><div class='nw-body'></div></div>" +
      "<button class='nw-toggle' type='button'></button>";
    d.body.appendChild(root);

    root.querySelector(".nw-toggle").addEventListener("click", function () {
      root.classList.toggle("open");
      render(root);
    });
    root.querySelector(".nw-clear").addEventListener("click", clearAll);
    render(root);
    setInterval(function () { render(root); }, 1000);
  }

  if (!debugEnabled()) return;
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", mount);
  else mount();
})(window, document);
