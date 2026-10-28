# Northwind Outfitters: cookie consent test site

A static, realistic-looking outdoor-gear store built to test the Secuvy cookie
consent flow end to end: scan → categorise → publish `script.blocker.rule.js` →
block before consent → release after consent.

- 3 pages: `/` (home), `/shop`, `/journal`
- 54–59 `<script src>` tags per page, 62–67 once the tag manager has run, 84 unique script URLs across the site
- Real third-party tags, mock vendor tags that always set cookies, scripts injected after load and on interaction, module/nomodule scripts, inline scripts, iframes, and server-set HttpOnly cookies

No build step and no dependencies.

## Deploy to Vercel

1. Push this folder to a Git repo and import it in Vercel, or run `vercel deploy` from inside it.
2. Framework preset: **Other**. Build command: none. Output directory: `.` (the root).
3. `vercel.json` turns on clean URLs (`/shop` serves `shop.html`) and sets the `nw_lb` cookie on page responses. `api/session.js` runs as a serverless function.

Local preview: VS Code Live Server or `npx serve .`. All paths are relative, so the
site also works when served from a sub-folder (e.g. Live Server at
`127.0.0.1:5500/cookie-consent-test-site/`). `/api/session` only exists on Vercel, so
the server cookies are missing locally.

## Test flow

1. **Baseline.** Deploy without Secuvy files. Open `https://<site>/?debug=1`. The **script monitor** (bottom right) lists every script as `loaded` / `failed` / `pending` / `skipped`, plus cookies and storage.
2. **Scan.** Scan all three URLs: `/`, `/shop`, `/journal`. Categorise the scripts and cookies, then publish.
3. **Install.** In each page, replace the commented `SECUVY CONSENT FILES` block at the top of `<head>` with the published tags, in the order shown there. Redeploy.
4. **Before consent.** Use **Clear cookies + storage & reload** in the monitor. Scripts with a rule should show `held` along with the rule name, and their cookies must be absent.
5. **Accept (all or per category).** Held scripts change to `loaded` without a reload, and their cookies appear.
6. **Reject / withdraw.** Clear and reload. Nothing with a rule should run.
7. **Interaction tags.** Scroll, click **Add to cart**, and click **Chat with us**. These inject scripts the scanner may never see (see "Expected gaps").

The monitor is remembered across pages once `?debug=1` is used. Turn it off with `?debug=0`.

## Folder layout

```
index.html, shop.html, journal.html   pages
assets/css/site.css                   styles (light + dark theme)
api/session.js                        Vercel function: Set-Cookie (HttpOnly etc.)
vercel.json                           clean URLs, Set-Cookie header on pages
js/site/                              essential first-party scripts (never block)
js/vendors/<category>/                mock vendor tags, one file per vendor
```

## Essential scripts: do not create blocking rules for these

| File | Load | What it does |
|---|---|---|
| `js/site/script-monitor.js` | sync, head | Debug panel (`?debug=1`). Must load before every other script. |
| `js/site/vendor-config.js` | sync, head | Dummy vendor IDs + command-queue stubs (`gtag`, `fbq`, `ttq`, `pintrk`, `snaptr`, `twq`, `rdt`, `qp`, `lintrk`, `uetq`) |
| `js/site/tracker-kit.js` | sync, head | Helper every mock vendor uses to set its cookies. If this is held, all mock vendors fail. |
| `js/site/preferences.js` | sync, head | Theme + currency. Cookies: `nw_theme`, `nw_currency` |
| `js/site/nav.js` | sync, body | Mobile menu, sticky header |
| `js/site/cart.js` | sync, body | Cart. Cookie `nw_cart`, localStorage `nw_cart_items`. Calls `/api/session` |
| `js/site/newsletter.js` | sync, body | Form validation. sessionStorage `nw_newsletter_signed_up` |
| `js/site/site.module.js` | `type="module"` | Starts AOS + Swiper if present |
| `js/site/legacy.nomodule.js` | `nomodule` | Never fetched by modern browsers (monitor shows `skipped`) |
| `js/site/tag-manager.js` | sync, body | Injects the dynamic tags below |

## Real third-party scripts (dummy IDs)

Real vendor tags with dummy IDs. Many vendors set no cookies (or return 404) for an
unknown ID. That is fine for testing blocking by host/file. For real vendor
cookies, put real IDs in `js/site/vendor-config.js` and in the `gtm.js`, `gtag/js`
and TikTok `sdkid` URLs in each page.

| Vendor | Host | Load | Pages | Category |
|---|---|---|---|---|
| Google Tag Manager | www.googletagmanager.com `/gtm.js` | async | all | analytics |
| Google Analytics 4 (gtag) | www.googletagmanager.com `/gtag/js` | async | all | analytics |
| Sentry | browser.sentry-cdn.com | async | all | performance |
| jQuery | code.jquery.com | sync | all | necessary/library |
| Meta Pixel | connect.facebook.net | async | all | marketing |
| TikTok Pixel | analytics.tiktok.com | async | all | marketing |
| Pinterest Tag | s.pinimg.com | async | all | marketing |
| Snap Pixel | sc-static.net | async | all | marketing |
| X (Twitter) Pixel | static.ads-twitter.com | async | all | marketing |
| Reddit Pixel | www.redditstatic.com | async | all | marketing |
| LinkedIn Insight | snap.licdn.com | async | all | marketing |
| Microsoft UET | bat.bing.com | async | all | marketing |
| Google WebFont Loader | ajax.googleapis.com | async | all | functional |
| Bootstrap | cdn.jsdelivr.net | defer | all | library |
| lodash | cdnjs.cloudflare.com | defer | all | library |
| AOS | unpkg.com | defer | all | library |
| Quora Pixel | a.quora.com | async | home, journal | marketing |
| Swiper | cdn.jsdelivr.net | defer | home | functional |
| YouTube IFrame API | www.youtube.com | async | home, journal | functional |
| Vimeo Player API | player.vimeo.com | defer | home | functional |
| Stripe.js (sets `__stripe_mid`, `__stripe_sid`) | js.stripe.com | **sync, head** | shop | necessary |
| Google Ads conversion | www.googleadservices.com | async | shop | marketing |
| PayPal JS SDK (sandbox `client-id=test`) | www.paypal.com | defer | shop | necessary |
| Klarna | js.klarna.com | async | shop | functional |
| Cloudflare Turnstile (test site key) | challenges.cloudflare.com | async defer | shop | necessary |
| Day.js | cdn.jsdelivr.net | defer | shop, journal | library |
| ShareThis | platform-api.sharethis.com | async | journal | marketing |
| reCAPTCHA (Google test key) | www.google.com | async defer | journal | necessary |
| Criteo | static.criteo.net | **dynamic**, DOM ready | all | marketing |
| Outbrain | amplify.outbrain.com | **dynamic**, after load | all | marketing |

Note: GTM, gtag and the Day.js/Swiper/Bootstrap libraries share a host
(`googletagmanager.com`, `cdn.jsdelivr.net`), so a rule must name the **file** to
hold one without the other.

## Mock vendor scripts (always set cookies)

Hosted on the site's own domain, so their rules are `host = <your vercel domain>` +
`file = <name>.js`. Each sets the cookie names the real vendor uses. Persistent IDs
keep their first value across page loads, as real trackers do.

### Analytics / performance

| File | Load | Pages | Cookies (lifetime) · storage |
|---|---|---|---|
| `analytics/hotjar.js` | sync, head | all | `_hjSessionUser_3812345` (1y), `_hjSession_3812345` (30m), `_hjAbsoluteSessionInProgress` (30m) · LS `_hjSessionStorageTest`, SS `_hjRecordingEnabled` |
| `analytics/clarity.js` | async, head | all | `_clck` (1y), `_clsk` (1d) |
| `analytics/segment-analytics.js` | async, head | all | `ajs_anonymous_id` (1y) · LS `ajs_anonymous_id`, `ajs_user_traits` |
| `analytics/newrelic-browser.js` | sync, head | all | no cookies · LS `NRBA_SESSION`, SS `NRBA_SESSION_ID` (category: performance) |
| `analytics/mixpanel.js` | defer | all | `mp_4f1c2e9b7a3d_mixpanel` (1y) |
| `analytics/amplitude.js` | defer | all | `AMP_a8f3c1d2e4`, `AMP_MKTG_a8f3c1d2e4` (1y) · LS `AMP_unsent_a8f3c1d2e4` |
| `analytics/heap.js` | defer | all | `_hp2_id.2390184756` (13mo), `_hp2_ses_props.2390184756` (30m) |
| `analytics/fullstory.js` | defer | all | `fs_uid` (1y), `fs_lua` (30m) |
| `analytics/adobe-analytics.js` | defer | all | `AMCV_…%40AdobeOrg` (2y), `s_cc`, `s_sq` (session) |
| `analytics/matomo.js` | async, head | journal | `_pk_id.1.4e2f` (13mo), `_pk_ses.1.4e2f` (30m) |
| `analytics/plausible.js` | **dynamic**, after load | all | **none** (cookieless: tests a rule with no cookie to check) |
| `analytics/mouseflow.js` | **dynamic**, after load | all | `mf_7c1e…` (90d), `mf_user` (90d) |
| `analytics/crazyegg.js` | **dynamic**, first scroll | all | `_ce.s` (1y), `_ce.clock_data` (1d) |

### Marketing

| File | Load | Pages | Cookies (lifetime) · storage |
|---|---|---|---|
| `marketing/hubspot.js` | async | all | `__hstc`, `hubspotutk` (6mo), `__hssc` (30m), `__hssrc` (session) |
| `marketing/marketo-munchkin.js` | async | all | `_mkto_trk` (2y) |
| `marketing/klaviyo.js` | async, head | shop | `__kla_id` (2y) · LS `klaviyoOnsite` |
| `marketing/pardot.js` | async | shop | `visitor_id812341`, `visitor_id812341-hash` (10y) |
| `marketing/cj-affiliate.js` | async | shop | `cje` (13mo) |
| `marketing/optinmonster.js` | async | shop | `_omappvp` (11y), `_omappvs` (20m) · LS `omSeenCampaigns` |
| `marketing/mailchimp.js` | async, head | journal | `_mcid` (1y) |
| `marketing/adroll.js` | **dynamic**, DOM ready | all | `__adroll_fpc`, `__ar_v4` (1y) |
| `marketing/taboola.js` | **dynamic**, DOM ready | all | `t_gid` (1y) · SS `taboola global:last-external-referrer` |
| `marketing/impact.js` | **dynamic**, DOM ready | all | `IR_gbd`, `IR_PI` (1y), `IR_17421` (1d) |
| `marketing/awin.js` | **dynamic**, first Add to cart | all | `_aw_m_28411` (1y) |

### Functional

| File | Load | Pages | Cookies (lifetime) · storage |
|---|---|---|---|
| `functional/intercom.js` | defer | all | `intercom-id-nw7t3st`, `intercom-device-id-nw7t3st` (9mo), `intercom-session-nw7t3st` (7d) |
| `functional/zendesk-widget.js` | defer | all | `__zlcmid` (1y) · LS `ZD-suid` |
| `functional/weglot.js` | sync, head | home | no cookies · LS `wglang` |
| `functional/drift.js` | async | home | `drift_aid`, `driftt_aid` (2y), `drift_campaign_refresh` (session) |
| `functional/tawk.js` | async | home | `twk_uuid_64f0…` (6mo), `TawkConnectionTime` (session) · SS `twk_token` |
| `functional/trustpilot.js` | defer | home | no cookies · LS `tp-trustbox-cache` |
| `functional/livechat.js` | defer | shop | `__lc_cid`, `__lc_cst` (2y) |
| `functional/yotpo.js` | async | shop | `yotpo_pixel` (1y) · SS `yotpo-widget-cache` |
| `functional/disqus.js` | defer | journal | `disqus_unique` (1y) · LS `disqus.thread` |
| `functional/crisp.js` | **dynamic**, Chat click | all | `crisp-client%2Fsession%2F1a2b…` (6mo) |

### Personalization / A-B testing

| File | Load | Pages | Cookies (lifetime) · storage |
|---|---|---|---|
| `personalization/optimizely.js` | sync, head | all | `optimizelyEndUserId` (6mo), `optimizelySession` (session) · LS `optimizely_data$$…` |
| `personalization/vwo.js` | sync, head | all | `_vwo_uuid_v2` (1y), `_vis_opt_s` (100d), `_vis_opt_test_cookie` (session) |
| `personalization/dynamic-yield.js` | sync, head | home | `_dyid`, `_dycst` (1y), `_dyjsession` (30m) · SS `_dy_ses_load_seq` |
| `personalization/nosto.js` | **`type="module"`**, head | shop | `2c.cId` (2y) |
| `personalization/ab-tasty.js` | **dynamic**, after load | all | `ABTasty` (13mo), `ABTastySession` (session) |

### Unknown (no vendor name)

| File | Load | Pages | Cookies (lifetime) · storage |
|---|---|---|---|
| `unknown/px-sync.js` | async | all | `_px_sync_uid` (1y), `cs_vid` (30d, `SameSite=None`) |
| `unknown/collect.js` | async | shop, journal | `_cid_x` (1y) · LS `__fp_hash` |

## How the tag manager injects scripts

`js/site/tag-manager.js` uses a different insertion API for each tag, so every guard in
`secuvy.blocker.script.js` is exercised:

| Tag | Trigger | How it is inserted |
|---|---|---|
| adroll.js | DOM ready | `createElement` + `.src =` + `head.appendChild` |
| taboola.js | DOM ready | `.src =` + `insertBefore(first script)` |
| impact.js | DOM ready | `setAttribute("src")` + `body.append` |
| Criteo publishertag.js | DOM ready | `setAttribute("src")` + `head.appendChild` |
| ab-tasty.js | load + 1.5s | `.src =` + `body.prepend` |
| plausible.js | load + 1.5s | `.src =` + `insertAdjacentElement("beforeend")` |
| mouseflow.js | load + 1.5s | `.src =` + `lastScript.after()` |
| Outbrain obtp.js | load + 1.5s | `.src =` then **`.type =` set after src** + `appendChild` |
| crazyegg.js | first scroll | `.src =` + `appendChild` |
| awin.js | first Add to cart | `.src =` + `appendChild` |
| crisp.js | Chat with us click | `.src =` + `appendChild` |

## Cookies the blocker cannot hold (expected)

| Cookie | Set by | Why it can't be blocked by a src rule |
|---|---|---|
| `nw_lb` (HttpOnly, 1h) | `vercel.json` header on every page response | Server-set |
| `nw_session` (HttpOnly, Strict, session) | `/api/session` | Server-set, necessary |
| `nw_csrf` (Strict, 1h) | `/api/session` | Server-set, necessary |
| `nw_device_id` (HttpOnly, 1y) | `/api/session` | Server-set, functional |
| `nw_ab_bucket` (`SameSite=None`, 30d) | `/api/session` | Server-set, personalization |
| `nw_ref` (`Path=/shop`, 7d) | `/api/session` | Server-set; only visible on `/shop` |
| `nw_inline_marker` | inline `<script>` at the end of each page | Inline scripts have no `src` |
| YouTube / Vimeo / Google Maps cookies | `<iframe>` embeds | Set inside third-party iframes |

## Expected gaps worth checking

- **Interaction-only tags** (crazyegg, awin, crisp) appear only after scroll/click. A scan that just loads the page will not list them, so they run without a rule.
- **Shared hosts**: a host-only rule for `cdn.jsdelivr.net` would also hold Bootstrap, Swiper and Day.js; one for `www.googletagmanager.com` holds both GTM and gtag.
- **First-party rules**: all mock vendors share your Vercel host. A rule without a file name for that host would hold every first-party script, including the essential ones.
- **`type="module"`** (nosto.js): after release the script should keep `type="module"`. The monitor's load column shows `module` for it.
- **`tracker-kit.js`** is a dependency of every mock vendor. If it gets a rule, the mock vendors throw `Cannot read properties of undefined`.
