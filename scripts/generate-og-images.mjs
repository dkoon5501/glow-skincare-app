// Generate OG social share images (1200x675 PNG) for Glow and Vita.
// Uses sharp for rasterization of SVG source. Idempotent — safe to rerun.

import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "client", "public");

// ── SVG builders ──

// Glow logo: sparkles (Lucide-style four-point star with smaller accent).
// Viewbox 0..100; we stroke in product teal on warm cream background.
function glowSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FAF5EE"/>
        <stop offset="100%" stop-color="#F3ECE0"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#bg)"/>

    <!-- Sparkles icon (Glow) -->
    <g transform="translate(600 210) scale(5.2) translate(-12 -12)" fill="none" stroke="#0d9488" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3l1.9 4.6L18.6 9.6 14 11.5 12 16.1 10 11.5 5.4 9.6 10.1 7.6z"/>
      <path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9z"/>
      <path d="M5 17l.6 1.4L7 19l-1.4.6L5 21l-.6-1.4L3 19l1.4-.6z"/>
    </g>

    <!-- Wordmark -->
    <text x="600" y="430" text-anchor="middle" font-family="'General Sans', system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-weight="700" font-size="108" fill="#0d9488" letter-spacing="-3">Glow</text>

    <!-- Tagline -->
    <text x="600" y="495" text-anchor="middle" font-family="'General Sans', system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-weight="500" font-size="34" fill="#3c4441" letter-spacing="0">Your Dermatologist-Guided Skincare Routine</text>

    <!-- Divider -->
    <line x1="340" y1="540" x2="860" y2="540" stroke="#D9CFBF" stroke-width="1.5"/>

    <!-- Domain -->
    <text x="600" y="590" text-anchor="middle" font-family="'General Sans', system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-weight="600" font-size="30" fill="#0d9488">buildmyroutine.app</text>
  </svg>`;
}

// Vita logo: pill shape to signal vitamins/supplements.
function vitaSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FAF5EE"/>
        <stop offset="100%" stop-color="#F3ECE0"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#bg)"/>

    <!-- Pill icon (Vita) -->
    <g transform="translate(600 215) rotate(-32)">
      <!-- Full pill capsule -->
      <rect x="-110" y="-40" width="220" height="80" rx="40" fill="none" stroke="#0d9488" stroke-width="9"/>
      <!-- Half-fill to suggest "supplement" split -->
      <path d="M -110 0 A 40 40 0 0 1 -70 -40 L 0 -40 L 0 40 L -70 40 A 40 40 0 0 1 -110 0 Z" fill="#0d9488" opacity="0.85"/>
      <!-- Center divider -->
      <line x1="0" y1="-40" x2="0" y2="40" stroke="#0d9488" stroke-width="9" stroke-linecap="round"/>
    </g>

    <!-- Wordmark -->
    <text x="600" y="430" text-anchor="middle" font-family="'General Sans', system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-weight="700" font-size="108" fill="#0d9488" letter-spacing="-3">Vita</text>

    <!-- Tagline -->
    <text x="600" y="495" text-anchor="middle" font-family="'General Sans', system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-weight="500" font-size="34" fill="#3c4441" letter-spacing="0">Your Personalized Vitamin &amp; Supplement Routine</text>

    <!-- Divider -->
    <line x1="340" y1="540" x2="860" y2="540" stroke="#D9CFBF" stroke-width="1.5"/>

    <!-- Domain -->
    <text x="600" y="590" text-anchor="middle" font-family="'General Sans', system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-weight="600" font-size="30" fill="#0d9488">buildmyroutine.app</text>
  </svg>`;
}

async function renderToPng(svg, outPath) {
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9 })
    .toFile(outPath);
  console.log(`[og-images] wrote ${outPath}`);
}

// Render both. Overwrite existing Glow OG so it uses the correct sparkles
// mark instead of the legacy circle-target.
await renderToPng(glowSvg(), join(OUT_DIR, "og-image.png"));
await renderToPng(vitaSvg(), join(OUT_DIR, "og-vita.png"));
console.log("[og-images] done");
