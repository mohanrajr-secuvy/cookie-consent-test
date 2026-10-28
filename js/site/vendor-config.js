/*
 * Vendor IDs and command-queue stubs for the real third-party tags.
 *
 * The IDs are dummies. Real vendors often set no cookies for an unknown ID; put
 * real IDs here (and in the gtm/gtag/tiktok URLs in each page) to get them.
 *
 * Each stub only queues calls. The vendor's own script, loaded by its <script src>
 * tag, picks up the queue when (and if) the consent blocker lets it run.
 */
(function (w) {
  "use strict";

  var ids = (w.NW_VENDOR_IDS = {
    ga4: "G-NW7TEST001",
    googleAds: "AW-100000001",
    metaPixel: "100000000000001",
    linkedin: "1000001",
    tiktok: "CNW7TESTPIXEL0000001",
    pinterest: "2610000000001",
    snap: "00000000-0000-4000-8000-000000000001",
    twitter: "nw7te",
    reddit: "t2_nw7test",
    quora: "00000000000000000000000000000001",
  });

  // Google tag (gtag.js / GTM)
  w.dataLayer = w.dataLayer || [];
  w.gtag = function () {
    w.dataLayer.push(arguments);
  };
  w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  w.gtag("js", new Date());
  w.gtag("config", ids.ga4);
  w.gtag("config", ids.googleAds);

  // Meta Pixel
  if (!w.fbq) {
    var fbq = (w.fbq = function () {
      fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
    });
    w._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
  }
  w.fbq("init", ids.metaPixel);
  w.fbq("track", "PageView");

  // LinkedIn Insight
  w._linkedin_partner_id = ids.linkedin;
  w._linkedin_data_partner_ids = [ids.linkedin];
  if (!w.lintrk) {
    w.lintrk = function (a, b) {
      w.lintrk.q.push([a, b]);
    };
    w.lintrk.q = [];
  }

  // TikTok Pixel
  w.TiktokAnalyticsObject = "ttq";
  var ttq = (w.ttq = w.ttq || []);
  ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"];
  ttq.setAndDefer = function (t, e) {
    t[e] = function () {
      t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
    };
  };
  ttq.methods.forEach(function (m) {
    ttq.setAndDefer(ttq, m);
  });
  ttq._i = {};
  ttq._i[ids.tiktok] = [];
  ttq._i[ids.tiktok]._u = "https://analytics.tiktok.com/i18n/pixel/events.js";
  ttq._t = {};
  ttq._t[ids.tiktok] = Date.now();
  ttq._o = {};
  ttq._o[ids.tiktok] = {};
  ttq.page();

  // Pinterest Tag
  if (!w.pintrk) {
    w.pintrk = function () {
      w.pintrk.queue.push(Array.prototype.slice.call(arguments));
    };
    w.pintrk.queue = [];
    w.pintrk.version = "3.0";
  }
  w.pintrk("load", ids.pinterest);
  w.pintrk("page");

  // Snap Pixel
  if (!w.snaptr) {
    var snaptr = (w.snaptr = function () {
      snaptr.handleRequest ? snaptr.handleRequest.apply(snaptr, arguments) : snaptr.queue.push(arguments);
    });
    snaptr.queue = [];
  }
  w.snaptr("init", ids.snap);
  w.snaptr("track", "PAGE_VIEW");

  // X (Twitter) Pixel
  if (!w.twq) {
    var twq = (w.twq = function () {
      twq.exe ? twq.exe.apply(twq, arguments) : twq.queue.push(arguments);
    });
    twq.version = "1.1";
    twq.queue = [];
  }
  w.twq("config", ids.twitter);

  // Reddit Pixel
  if (!w.rdt) {
    var rdt = (w.rdt = function () {
      rdt.sendEvent ? rdt.sendEvent.apply(rdt, arguments) : rdt.callQueue.push(arguments);
    });
    rdt.callQueue = [];
  }
  w.rdt("init", ids.reddit);
  w.rdt("track", "PageVisit");

  // Quora Pixel
  if (!w.qp) {
    var qp = (w.qp = function () {
      qp.qp ? qp.qp.apply(qp, arguments) : qp.queue.push(arguments);
    });
    qp.queue = [];
  }
  w.qp("init", ids.quora);
  w.qp("track", "ViewContent");

  // Microsoft Advertising (UET)
  w.uetq = w.uetq || [];
})(window);
