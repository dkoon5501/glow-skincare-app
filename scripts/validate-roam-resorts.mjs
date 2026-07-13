#!/usr/bin/env node
// Validates the Roam all-inclusive resort catalog: schema, enums, uniqueness,
// region floors, video-coverage floor, and the no-invented-prices rule.
// Runs in CI before deploy — a resort that can't pass this can't ship.
import { build } from 'esbuild';
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const TMP = join(HERE, '.roam-resorts-bundle.mjs');

await build({
  entryPoints: [join(ROOT, 'client/src/lib/roam-resorts.ts')],
  bundle: true, format: 'esm', platform: 'neutral', outfile: TMP, logLevel: 'silent',
});
const mod = await import(TMP);
rmSync(TMP, { force: true });

const { roamResorts } = mod;

const REGIONS = ['Asia', 'Europe', 'Americas', 'North America', 'Central America', 'South America', 'Caribbean', 'United States', 'Africa', 'Middle East', 'Oceania', 'Global'];
const TAGS = ['luxury', 'value', 'boutique', 'overwater', 'beachfront', 'golf', 'spa', 'party', 'romantic', 'swim-up', 'adventure', 'diving', 'safari', 'rainforest'];

// Region floors: the catalog is only useful if a user picking a region finds real
// options there. Falling under a floor means the research thinned out — fail loudly
// rather than quietly shipping a region with two resorts in it.
const REGION_FLOORS = { Caribbean: 15, 'North America': 12, Europe: 4, 'Central America': 3, Asia: 4, Africa: 2, Oceania: 2 };
const VIDEO_COVERAGE_FLOOR = 0.8;   // David's bar: >=80% of resorts show a real tour
const MIN_RESORTS = 60;

const errors = [];
const err = (m) => errors.push(m);

// Prices move with season and we never invent them. If a price-shaped string ever
// appears in the generated catalog, something upstream started making numbers up.
// Must anchor on an actual amount: prose like "Nightly rate includes meals",
// "day/night activities" or "from 1 November 2025" is descriptive, not a price.
const PRICE_LIKE = /([$€£]\s?\d|\b\d[\d,.]*\s?(usd|eur|gbp)\b|\b\d[\d,.]*\s*(per night|\/\s*night|a night|nightly))/i;

const ids = new Set(), videoIds = new Set();

for (const r of roamResorts) {
  const at = `resort ${r.id || '?'}`;

  for (const f of ['id', 'name', 'brand', 'destination', 'country', 'region', 'officialSite'])
    if (!r[f] || typeof r[f] !== 'string') err(`${at}: missing/empty ${f}`);

  if (ids.has(r.id)) err(`${at}: duplicate id`);
  ids.add(r.id);

  if (!REGIONS.includes(r.region)) err(`${at}: bad region "${r.region}"`);
  if (typeof r.adultsOnly !== 'boolean') err(`${at}: adultsOnly must be boolean`);
  if (typeof r.familyFriendly !== 'boolean') err(`${at}: familyFriendly must be boolean`);
  if (r.adultsOnly && r.familyFriendly) err(`${at}: cannot be both adults-only and family-friendly`);

  if (!r.tags?.length || r.tags.some((t) => !TAGS.includes(t))) err(`${at}: bad tags ${JSON.stringify(r.tags)}`);
  if (!r.highlights?.length) err(`${at}: no highlights`);
  if (!/^https?:\/\//.test(r.officialSite || '')) err(`${at}: officialSite is not a URL`);

  for (const h of r.highlights ?? [])
    if (PRICE_LIKE.test(h)) err(`${at}: highlight contains a price — we never invent prices: "${h}"`);
  if (PRICE_LIKE.test(r.name || '')) err(`${at}: name contains a price`);

  if (r.video) {
    const v = r.video;
    if (!/^[\w-]{11}$/.test(v.videoId || '')) err(`${at}: malformed videoId "${v.videoId}"`);
    if (videoIds.has(v.videoId)) err(`${at}: videoId ${v.videoId} reused by another resort`);
    videoIds.add(v.videoId);
    if (!v.channel) err(`${at}: video missing channel`);
    // tourYear is user-visible so a stale walkthrough can't pose as current — it must be real.
    const yr = Number(v.tourYear);
    if (!Number.isInteger(yr) || yr < 2008 || yr > new Date().getFullYear())
      err(`${at}: implausible tourYear ${v.tourYear}`);
  }
}

// ── floors ──
const perRegion = {};
for (const r of roamResorts) perRegion[r.region] = (perRegion[r.region] ?? 0) + 1;

for (const [region, floor] of Object.entries(REGION_FLOORS)) {
  const n = perRegion[region] ?? 0;
  if (n < floor) err(`region floor: ${region} has ${n} resorts, floor is ${floor}`);
}

const withVideo = roamResorts.filter((r) => r.video).length;
const coverage = roamResorts.length ? withVideo / roamResorts.length : 0;
if (coverage < VIDEO_COVERAGE_FLOOR)
  err(`video coverage ${(coverage * 100).toFixed(1)}% is below the ${VIDEO_COVERAGE_FLOOR * 100}% floor`);

if (roamResorts.length < MIN_RESORTS)
  err(`catalog has ${roamResorts.length} resorts, minimum is ${MIN_RESORTS}`);

// ── audit provenance must match the shipped catalog ──
try {
  const audit = JSON.parse(readFileSync(join(ROOT, 'data/roam-resorts-audit.json'), 'utf-8'));
  if (audit.total !== roamResorts.length)
    err(`audit total (${audit.total}) != catalog length (${roamResorts.length}) — regenerate via scripts/ingest-resorts.mjs`);
} catch {
  err('data/roam-resorts-audit.json missing or unreadable — provenance is required');
}

console.log(`resorts: ${roamResorts.length}`);
console.log(`per region:`, perRegion);
console.log(`video coverage: ${withVideo}/${roamResorts.length} = ${(coverage * 100).toFixed(1)}%`);

if (errors.length) {
  console.log(`\n${errors.length} ERRORS:`);
  for (const e of errors.slice(0, 40)) console.log('  ' + e);
}
process.exit(errors.length ? 1 : 0);
