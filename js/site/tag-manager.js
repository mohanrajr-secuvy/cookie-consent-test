/*
 * Northwind tag manager: injects tags after the page loads, the way GTM does.
 *
 * Every tag uses a different insertion API or src-assignment pattern, so each
 * guard in the Secuvy blocker is exercised (createElement src setter,
 * setAttribute, type set after src, appendChild, insertBefore, append, prepend,
 * after, insertAdjacentElement). Injected scripts carry data-injected-by so the
 * script monitor can show how they were loaded.
 */
(function (d, w) {
  "use strict";

  var VENDORS = "js/vendors/";

  function createTag(trigger) {
    var s = d.createElement("script");
    s.async = true;
    s.dataset.injectedBy = trigger;
    return s;
  }

  // Each tag: when it fires, and how it is inserted
  var onDomReady = [
    function () {
      var s = createTag("dom-ready");
      s.src = VENDORS + "marketing/adroll.js";
      d.head.appendChild(s);
    },
    function () {
      var s = createTag("dom-ready");
      s.src = VENDORS + "marketing/taboola.js";
      var first = d.getElementsByTagName("script")[0];
      first.parentNode.insertBefore(s, first);
    },
    function () {
      var s = createTag("dom-ready");
      s.setAttribute("src", VENDORS + "marketing/impact.js");
      d.body.append(s);
    },
    function () {
      var s = createTag("dom-ready");
      s.setAttribute("src", "https://static.criteo.net/js/ld/publishertag.js");
      d.head.appendChild(s);
    },
  ];

  var afterLoad = [
    function () {
      var s = createTag("after-load");
      s.src = VENDORS + "personalization/ab-tasty.js";
      d.body.prepend(s);
    },
    function () {
      var s = createTag("after-load");
      s.src = VENDORS + "analytics/plausible.js";
      d.body.insertAdjacentElement("beforeend", s);
    },
    function () {
      var s = createTag("after-load");
      s.src = VENDORS + "analytics/mouseflow.js";
      var scripts = d.getElementsByTagName("script");
      scripts[scripts.length - 1].after(s);
    },
    function () {
      // type set after src: the blocker must keep the script held
      var s = createTag("after-load");
      s.src = "https://amplify.outbrain.com/cp/obtp.js";
      s.type = "text/javascript";
      d.head.appendChild(s);
    },
  ];

  function injectOnce(eventTarget, eventName, trigger, src) {
    eventTarget.addEventListener(eventName, function () {
      var s = createTag(trigger);
      s.src = src;
      d.body.appendChild(s);
    }, { once: true, passive: true });
  }

  function run(tags) {
    tags.forEach(function (tag) {
      try {
        tag();
      } catch (err) {
        console.error("[Northwind] tag failed:", err);
      }
    });
  }

  d.addEventListener("DOMContentLoaded", function () {
    run(onDomReady);
  });

  w.addEventListener("load", function () {
    setTimeout(function () {
      run(afterLoad);
    }, 1500);
  });

  // Interaction tags: a scanner that only loads the page will not see these
  injectOnce(w, "scroll", "first-scroll", VENDORS + "analytics/crazyegg.js");
  injectOnce(d, "nw:add-to-cart", "add-to-cart", VENDORS + "marketing/awin.js");
  d.addEventListener("click", function openChat(e) {
    if (!e.target.closest("[data-open-chat]")) return;
    d.removeEventListener("click", openChat);
    var s = createTag("chat-click");
    s.src = VENDORS + "functional/crisp.js";
    d.body.appendChild(s);
  });
})(document, window);
