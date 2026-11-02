#!/usr/bin/env node
/*
 * Generates the bulk mock vendor set used to stress-test the consent blocker:
 * 110 scripts per category in js/vendors/<category>/bulk/, the bulk tag manager,
 * the <script> blocks in every page, and tools/bulk-manifest.csv.
 *
 * Run from the repo root:  node tools/generate-bulk-vendors.mjs
 * Output is committed, so the site still has no build step. Re-running is safe:
 * the bulk folders are rewritten and the page blocks are replaced between markers.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PER_CATEGORY = 110;
const COOKIE_EVERY = 10; // Chrome keeps ~180 cookies per host; the rest prove they ran via localStorage
const PAGES = ["index.html", "shop.html", "journal.html"];

const CATEGORIES = {
  analytics: {
    letter: "a",
    prefixes: ["pulse", "beacon", "metric", "insight", "trace", "signal", "stat", "lens", "scope", "chart", "funnel", "cohort"],
    suffixes: ["iq", "hub", "flow", "ly", "labs", "track", "sense", "view", "stack", "logic"],
  },
  marketing: {
    letter: "m",
    prefixes: ["ad", "click", "reach", "promo", "lead", "convert", "retarget", "affiliate", "audience", "campaign", "bid", "spark"],
    suffixes: ["pixel", "tag", "boost", "link", "sync", "wave", "loop", "mail", "point", "net"],
  },
  functional: {
    letter: "f",
    prefixes: ["chat", "help", "review", "search", "translate", "map", "video", "form", "booking", "access", "support", "widget"],
    suffixes: ["desk", "box", "bot", "kit", "now", "ly", "cast", "wise", "pad", "dock"],
  },
  personalization: {
    letter: "p",
    prefixes: ["persona", "variant", "split", "tailor", "adapt", "segment", "recommend", "experiment", "flag", "match", "curate", "morph"],
    suffixes: ["ai", "lab", "engine", "iq", "flow", "kit", "hub", "logic", "mind", "sense"],
  },
  unknown: {
    letter: "u",
    prefixes: ["px", "ev", "cs", "fp", "uid", "tr", "sx", "dt", "bx", "rt", "qs", "zl"],
    suffixes: ["sync", "collect", "beacon", "ping", "bridge", "relay", "match", "push", "load", "hit"],
    hashedFrom: 80, // the rest get hash-like names with no vendor hint at all
  },
};

// Repeats every 22 scripts: 20 sync-head, 20 async-head, 20 defer, 15 async-body, 10 module, 25 dynamic per category
const LOAD_PATTERN = [
  "sync-head", "async-head", "defer", "dynamic", "sync-head", "async-body", "defer", "async-head", "dynamic", "module", "sync-head",
  "async-head", "defer", "dynamic", "async-body", "sync-head", "async-head", "defer", "dynamic", "module", "async-body", "dynamic",
];
const TRIGGERS = ["dom-ready", "after-load", "timer", "first-scroll", "first-click"];
const INSERTS = ["append-head", "insert-before", "attr-append", "prepend", "adjacent", "after", "type-after-src"];
const LIFETIMES = [{ days: 365 }, { minutes: 30 }, { days: 90 }, {}, { days: 730 }, { days: 1 }];

const MARK = "BULK VENDOR SCRIPTS";

function titleCase(slug) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function hashName(seed) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return "s-" + (h >>> 0).toString(16).padStart(8, "0").slice(0, 6);
}

function lifetimeLabel(l) {
  if (l.days) return l.days >= 365 && l.days % 365 === 0 ? l.days / 365 + "y" : l.days + "d";
  if (l.minutes) return l.minutes + "m";
  return "session";
}

// File names already used by the hand-written mocks, so no rule matches two files
function existingNames() {
  const names = new Set();
  for (const cat of Object.keys(CATEGORIES)) {
    const dir = join("js/vendors", cat);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) if (f.endsWith(".js")) names.add(f.slice(0, -3));
  }
  return names;
}

function buildVendors() {
  const taken = existingNames();
  const vendors = [];
  for (const [category, cfg] of Object.entries(CATEGORIES)) {
    const P = cfg.prefixes.length;
    let made = 0;
    for (let i = 0; made < PER_CATEGORY; i++) {
      let slug = cfg.prefixes[i % P] + "-" + cfg.suffixes[Math.floor(i / P) % cfg.suffixes.length];
      if (cfg.hashedFrom !== undefined && made >= cfg.hashedFrom) slug = hashName(category + made);
      if (taken.has(slug)) continue;
      taken.add(slug);

      const n = made + 1;
      const id = cfg.letter + String(n).padStart(3, "0");
      const load = LOAD_PATTERN[made % LOAD_PATTERN.length];
      const dynamicIndex = vendors.filter((v) => v.load === "dynamic").length;
      vendors.push({
        category,
        slug,
        id,
        vendor: category === "unknown" ? "Unknown (" + slug + ")" : titleCase(slug),
        src: "js/vendors/" + category + "/bulk/" + slug + ".js",
        load,
        trigger: load === "dynamic" ? TRIGGERS[dynamicIndex % TRIGGERS.length] : "",
        insert: load === "dynamic" ? INSERTS[dynamicIndex % INSERTS.length] : "",
        cookie: n % COOKIE_EVERY === 0 ? { name: "nwb_" + id, ...LIFETIMES[(n / COOKIE_EVERY) % LIFETIMES.length] } : null,
        storageKey: "nwb." + category + "." + slug,
      });
      made++;
    }
  }
  return vendors;
}

function loadLabel(v) {
  if (v.load === "dynamic") return "dynamic (" + v.trigger + ", " + v.insert + ")";
  return { "sync-head": "sync, head", "async-head": "async, head", defer: "defer", "async-body": "async, body", module: 'type="module"' }[v.load];
}

function vendorFile(v) {
  const cookieLine = v.cookie ? "Sets cookie " + v.cookie.name + " (" + lifetimeLabel(v.cookie) + ") and" : "Sets no cookie;";
  const lifetime = v.cookie && (v.cookie.days ? ", days: " + v.cookie.days : v.cookie.minutes ? ", minutes: " + v.cookie.minutes : "");
  const cookies = v.cookie ? '\n    cookies: [{ name: "' + v.cookie.name + '", value: kit.uid()' + lifetime + " }]," : "";
  return `/*!
 * ${v.vendor} (Northwind bulk test mock)
 * Category: ${v.category}. Load: ${loadLabel(v)}.
 * ${cookieLine} LS ${v.storageKey}.
 * Generated by tools/generate-bulk-vendors.mjs: do not edit by hand.
 */
(function (kit) {
  kit.track({
    vendor: "${v.vendor}",
    category: "${v.category}",${cookies}
    localStorage: { "${v.storageKey}": kit.uid() },
  });
})(window.NWTrackerKit);
`;
}

function tagManagerFile(vendors) {
  const rows = vendors
    .filter((v) => v.load === "dynamic")
    .map((v) => '    ["' + v.src + '", "' + v.trigger + '", "' + v.insert + '"],')
    .join("\n");
  return `/*
 * Northwind bulk tag manager: injects the dynamic half of the bulk mock vendor set.
 * Generated by tools/generate-bulk-vendors.mjs: do not edit by hand.
 *
 * Each tag is [src, trigger, insertion]. Triggers: dom-ready, after-load (+1.5s),
 * timer (5s after load), first-scroll, first-click. Insertion methods mirror
 * tag-manager.js so every blocker guard sees hundreds of scripts, not one each.
 *
 * This file is essential: do not create a blocking rule for it.
 */
(function (d, w) {
  "use strict";

  var TAGS = [
${rows}
  ];

  var insert = {
    "append-head": function (s, src) { s.src = src; d.head.appendChild(s); },
    "insert-before": function (s, src) {
      s.src = src;
      var first = d.getElementsByTagName("script")[0];
      first.parentNode.insertBefore(s, first);
    },
    "attr-append": function (s, src) { s.setAttribute("src", src); d.body.append(s); },
    prepend: function (s, src) { s.src = src; d.body.prepend(s); },
    adjacent: function (s, src) { s.src = src; d.body.insertAdjacentElement("beforeend", s); },
    after: function (s, src) {
      s.src = src;
      var scripts = d.getElementsByTagName("script");
      scripts[scripts.length - 1].after(s);
    },
    // type set after src: the blocker must keep the script held
    "type-after-src": function (s, src) { s.src = src; s.type = "text/javascript"; d.head.appendChild(s); },
  };

  function fire(trigger) {
    TAGS.forEach(function (tag) {
      if (tag[1] !== trigger) return;
      try {
        var s = d.createElement("script");
        s.async = true;
        s.dataset.injectedBy = "bulk-" + trigger;
        insert[tag[2]](s, tag[0]);
      } catch (err) {
        console.error("[Northwind] bulk tag failed:", tag[0], err);
      }
    });
  }

  d.addEventListener("DOMContentLoaded", function () { fire("dom-ready"); });
  w.addEventListener("load", function () {
    setTimeout(function () { fire("after-load"); }, 1500);
    setTimeout(function () { fire("timer"); }, 5000);
  });
  w.addEventListener("scroll", function () { fire("first-scroll"); }, { once: true, passive: true });
  d.addEventListener("pointerdown", function () { fire("first-click"); }, { once: true, passive: true });
})(document, window);
`;
}

function scriptTag(v) {
  const attr = { "sync-head": "", "async-head": "async ", defer: "defer ", "async-body": "async ", module: 'type="module" ' }[v.load];
  return '    <script ' + attr + 'src="' + v.src + '"></script>';
}

function block(name, vendors, extra) {
  const lines = ["    <!-- " + MARK + " (" + name + "): generated by tools/generate-bulk-vendors.mjs, do not edit by hand -->"];
  for (const category of Object.keys(CATEGORIES)) {
    const tags = vendors.filter((v) => v.category === category);
    if (!tags.length) continue;
    lines.push("    <!-- bulk " + category + " (" + tags.length + ") -->");
    tags.forEach((v) => lines.push(scriptTag(v)));
  }
  if (extra) lines.push(extra);
  lines.push("    <!-- /" + MARK + " (" + name + ") -->");
  return lines.join("\n");
}

function upsert(html, name, content, insertBefore) {
  const re = new RegExp("    <!-- " + MARK + " \\(" + name + "\\)[\\s\\S]*?<!-- /" + MARK + " \\(" + name + "\\) -->");
  if (re.test(html)) return html.replace(re, content);
  const at = insertBefore(html);
  if (at < 0) throw new Error("No insertion point for the " + name + " block");
  return html.slice(0, at) + content + "\n\n" + html.slice(at);
}

function writePages(vendors) {
  const head = block("head", vendors.filter((v) => v.load === "sync-head" || v.load === "async-head"));
  const body = block(
    "body",
    vendors.filter((v) => v.load === "defer" || v.load === "async-body" || v.load === "module"),
    "    <!-- bulk tag manager (essential: injects the " + vendors.filter((v) => v.load === "dynamic").length + ' dynamic bulk tags) -->\n    <script src="js/site/bulk-tag-manager.js"></script>'
  );
  for (const page of PAGES) {
    let html = readFileSync(page, "utf8");
    html = upsert(html, "head", head, (h) => h.lastIndexOf("  </head>"));
    // Before the essential body scripts, after the existing vendor tags
    html = upsert(html, "body", body, (h) => h.lastIndexOf("    <!-- Essential site scripts"));
    writeFileSync(page, html);
  }
}

function writeManifest(vendors) {
  const header = "category,file,vendor,load,cookie,cookie_lifetime,local_storage";
  const rows = vendors.map((v) =>
    [v.category, v.src, v.vendor, loadLabel(v), v.cookie ? v.cookie.name : "", v.cookie ? lifetimeLabel(v.cookie) : "", v.storageKey]
      .map((c) => (/[",]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c))
      .join(",")
  );
  writeFileSync("tools/bulk-manifest.csv", [header, ...rows].join("\n") + "\n");
}

const vendors = buildVendors();
for (const category of Object.keys(CATEGORIES)) {
  const dir = join("js/vendors", category, "bulk");
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}
vendors.forEach((v) => writeFileSync(v.src, vendorFile(v)));
writeFileSync("js/site/bulk-tag-manager.js", tagManagerFile(vendors));
writePages(vendors);
writeManifest(vendors);

const count = (key) => vendors.reduce((acc, v) => ((acc[v[key]] = (acc[v[key]] || 0) + 1), acc), {});
console.log("Generated", vendors.length, "bulk vendor scripts");
console.log("  by category:", count("category"));
console.log("  by load:", count("load"));
console.log("  cookies:", vendors.filter((v) => v.cookie).length);
