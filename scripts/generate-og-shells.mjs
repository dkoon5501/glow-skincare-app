// Generate per-route static HTML shells with route-specific Open Graph tags.
//
// Why: the SPA uses hash routing, so the real URL path is always `/` from
// the server's perspective — which means social crawlers (Facebook, Twitter,
// iMessage, Slack, etc.) see only one set of OG tags. To let /glow vs /vita
// vs /r/ENCODED vs /v/ENCODED render distinct link previews, we emit small
// pre-rendered HTML files per route. Each contains product-specific
// <meta property="og:..."> tags for crawlers, plus a tiny <script> that
// redirects real humans to the matching hash route so the SPA takes over.
//
// A Netlify `_redirects` file routes `/r/*` and `/v/*` to the shared
// `/r/index.html` and `/v/index.html` shells respectively.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DIST = join(__dirname, "..", "dist", "public");

if (!existsSync(DIST)) {
  console.error(`[og-shells] dist dir missing: ${DIST}. Run vite build first.`);
  process.exit(1);
}

const indexHtml = readFileSync(join(DIST, "index.html"), "utf-8");

// Extract <link>/<script> tags emitted by Vite so the shell can actually
// bootstrap the SPA if the redirect <script> is blocked or slow.
const headAssetMatches = [
  ...indexHtml.matchAll(/<script\s[^>]*type="module"[^>]*><\/script>/g),
  ...indexHtml.matchAll(/<link\s+rel="stylesheet"[^>]*>/g),
  ...indexHtml.matchAll(/<link\s+rel="modulepreload"[^>]*>/g),
];
const headAssets = headAssetMatches.map((m) => m[0]).join("\n    ");

const BASE = "https://buildmyroutine.app";

/**
 * @param {Object} cfg
 * @param {string} cfg.title
 * @param {string} cfg.description
 * @param {string} cfg.ogImage  // absolute URL
 * @param {string} cfg.canonical
 * @param {string} cfg.redirectScript  // JS that sets location accordingly
 */
function shell({ title, description, ogImage, canonical, redirectScript }) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="icon" type="image/png" href="/favicon.png" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="675" />

    <!-- Twitter / X -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${canonical}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${ogImage}" />

    <link rel="canonical" href="${canonical}" />
    <meta name="theme-color" content="#0d9488" />
    <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet">

    <!-- Send humans into the SPA via hash routing. Crawlers ignore scripts. -->
    <script>
${redirectScript}
    </script>

    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-PTWJNNVB84"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-PTWJNNVB84');
    </script>

    <!-- Fallback: if the redirect didn't fire, bootstrap the SPA inline. -->
    ${headAssets}
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;
}

// Redirect snippets.
//
// For /glow and /vita (static product landing): send to the matching hash.
const staticRedirect = (hash) => `      (function(){
        try {
          if (!location.hash || location.hash === "#" || location.hash === "#/") {
            location.replace("/#${hash}");
          }
        } catch (e) {}
      })();`;

// For /r/* and /v/* (dynamic shared routes): capture the path segment after
// the prefix and forward it into the hash route so the SPA decodes it.
const dynamicRedirect = (prefix) => `      (function(){
        try {
          var p = location.pathname || "";
          var m = p.match(/^\\/${prefix}\\/(.+?)\\/?$/);
          if (m && m[1]) {
            location.replace("/#/${prefix}/" + m[1]);
            return;
          }
          // No encoded segment — bounce to the appropriate quiz.
          location.replace("/#/${prefix === "r" ? "glow" : "vita"}");
        } catch (e) {}
      })();`;

const routes = [
  {
    dir: "glow",
    title: "Glow — Dermatologist-Guided Skincare Routine Builder",
    description:
      "Answer 8 quick questions. Get a personalized AM & PM skincare routine with products recommended by board-certified dermatologists. Free, no account required.",
    ogImage: `${BASE}/og-image.png`,
    canonical: `${BASE}/glow`,
    redirectScript: staticRedirect("/glow"),
  },
  {
    dir: "vita",
    title: "Vita — Personalized Vitamin & Supplement Routine Builder",
    description:
      "Take a 2-minute quiz. Get a personalized vitamin & supplement routine tailored to your health goals, diet, and lifestyle. Adults only. Not medical advice.",
    ogImage: `${BASE}/og-vita.png`,
    canonical: `${BASE}/vita`,
    redirectScript: staticRedirect("/vita"),
  },
  {
    dir: "r",
    title: "Someone shared their Glow skincare routine with you",
    description:
      "View this personalized, dermatologist-guided skincare routine — then build your own for free in 2 minutes.",
    ogImage: `${BASE}/og-image.png`,
    canonical: `${BASE}/r`,
    redirectScript: dynamicRedirect("r"),
  },
  {
    dir: "v",
    title: "Someone shared their Vita vitamin routine with you",
    description:
      "View this personalized vitamin & supplement routine — then build your own for free in 2 minutes.",
    ogImage: `${BASE}/og-vita.png`,
    canonical: `${BASE}/v`,
    redirectScript: dynamicRedirect("v"),
  },
];

for (const r of routes) {
  const outDir = join(DIST, r.dir);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), shell(r));
  console.log(`[og-shells] wrote ${r.dir}/index.html`);
}

// Netlify redirects so /r/ANYTHING and /v/ANYTHING serve the shell.
// Pretty URLs already map /glow → /glow/index.html automatically.
const redirects = `# Dynamic share routes — serve the prerendered shell for crawlers.
/r/*    /r/index.html   200
/v/*    /v/index.html   200

# SPA fallback for any other unknown path — load the main app.
/*      /index.html     200
`;
writeFileSync(join(DIST, "_redirects"), redirects);
console.log("[og-shells] wrote _redirects");
