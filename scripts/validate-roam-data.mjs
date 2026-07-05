#!/usr/bin/env node
// Validates the Roam episode catalog: schema/enum correctness, uniqueness,
// and quiz coverage through the real scorer. Run in CI before deploy.
import { build } from 'esbuild';
import { writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const TMP = join(HERE, '.roam-data-bundle.mjs');

await build({
  entryPoints: [join(ROOT, 'client/src/lib/roam-data.ts')],
  bundle: true, format: 'esm', platform: 'neutral', outfile: TMP, logLevel: 'silent',
});
const mod = await import(TMP);
rmSync(TMP, { force: true });

const { roamEpisodes, roamQuestions, roamUSZones } = mod;
const scorer = mod.generateRoamResults;

const VIBES = ['luxury', 'budget', 'offbeat', 'adventure'];
const REGIONS = ['Asia', 'Europe', 'Americas', 'North America', 'Central America', 'South America', 'Caribbean', 'United States', 'Africa', 'Middle East', 'Oceania', 'Global'];
const ZONES = roamUSZones.map(z => z.value);
const DURATIONS = ['weekend', 'week', 'twoWeeks', 'month'];
const STYLES = ['solo', 'partner', 'family', 'group'];
const ACCOM = ['hotel', 'hostel', 'outdoor', 'rv'];

const errors = [];
const err = m => errors.push(m);

// US episodes with no fitting zone in the current 6-zone taxonomy (NYC — no Northeast zone yet).
const ZONELESS_OK = new Set(['b8r62Ie0jAE', 'gMrHBpY4HRA']); // NYC (no Northeast zone), Badlands SD (no Midwest/Plains zone)
const unbalancedParens = s => s.split('(').length !== s.split(')').length;
const DANGLING_END = /\s(and|with|of|the|a|an|to|for|from|in|on|at|like|via|through|where|which)$/i;

// ── per-episode schema checks ──
const ids = new Set(), vids = new Set();
for (const e of roamEpisodes) {
  const at = `episode ${e.id || '?'} (${e.videoId || 'no-vid'})`;
  for (const f of ['id', 'title', 'destination', 'country', 'region', 'videoId', 'creator', 'creatorHandle', 'description'])
    if (!e[f] || typeof e[f] !== 'string') err(`${at}: missing/empty ${f}`);
  if (ids.has(e.id)) err(`${at}: duplicate id`);
  ids.add(e.id);
  if (vids.has(e.videoId)) err(`${at}: duplicate videoId`);
  vids.add(e.videoId);
  if (!/^[\w-]{11}$/.test(e.videoId || '')) err(`${at}: malformed videoId`);
  if (!REGIONS.includes(e.region)) err(`${at}: bad region "${e.region}"`);
  if (e.usZone && !ZONES.includes(e.usZone)) err(`${at}: bad usZone "${e.usZone}"`);
  if (e.usZone && e.region !== 'United States') err(`${at}: usZone set but region is "${e.region}"`);
  // Episodes allowed to have no zone because the current taxonomy has no fitting one
  // (e.g. no Northeast). Additions here need a conscious decision, not convenience.
  if (e.region === 'United States' && !e.usZone && !ZONELESS_OK.has(e.id)) err(`${at}: US episode missing usZone`);
  if (!e.vibeTags?.length || e.vibeTags.some(v => !VIBES.includes(v))) err(`${at}: bad vibeTags ${JSON.stringify(e.vibeTags)}`);
  if (!e.duration?.length || e.duration.some(d => !DURATIONS.includes(d))) err(`${at}: bad duration ${JSON.stringify(e.duration)}`);
  if (!e.travelStyle?.length || e.travelStyle.some(s => !STYLES.includes(s))) err(`${at}: bad travelStyle`);
  if (!e.accommodation?.length || e.accommodation.some(a => !ACCOM.includes(a))) err(`${at}: bad accommodation`);
  if (!/^@?[A-Za-z0-9._-]+$/.test(e.creatorHandle || '')) err(`${at}: suspicious creatorHandle "${e.creatorHandle}"`);
  if (!e.highlights?.length) err(`${at}: no highlights`);
  // Titles are user-visible: reject machine-truncation artifacts.
  if (/…/.test(e.title || '')) err(`${at}: title ends in ellipsis "${e.title}"`);
  if (unbalancedParens(e.title || '')) err(`${at}: unbalanced parens in title "${e.title}"`);
  if (DANGLING_END.test(e.title || '')) err(`${at}: title ends mid-phrase "${e.title}"`);
  if ((e.title || '').length > 90) err(`${at}: title over 90 chars`);
}

// ── coverage + region honesty through the real scorer ──
// Region honesty: a user who picks a region must never get a Global (or other
// off-region) episode as the top pick — Global is a low-weight fallback only.
let coverageChecked = 0, coverageEmpty = [], regionDishonest = [];
if (typeof scorer === 'function') {
  const regionValues = roamQuestions.find(q => q.id === 'region')?.options.map(o => o.value) ?? REGIONS;
  const groups = mod.REGION_GROUPS ?? {};
  for (const vibe of VIBES) for (const region of regionValues) for (const duration of DURATIONS) {
    const answers = { vibe, region, duration, travelStyle: 'partner', accommodation: 'hotel' };
    const res = scorer(answers);
    coverageChecked++;
    if (!res || (Array.isArray(res) && res.length === 0)) { coverageEmpty.push(JSON.stringify(answers)); continue; }
    const allowed = groups[region] ?? [region];
    for (const r of res.slice(0, 8)) {
      if (!allowed.includes(r.episode.region) && r.episode.region !== 'Global')
        regionDishonest.push(`${JSON.stringify(answers)} -> top8 has ${r.episode.id} (${r.episode.region})`);
    }
    if (!allowed.includes(res[0].episode.region))
      regionDishonest.push(`${JSON.stringify(answers)} -> TOP pick is ${res[0].episode.id} (${res[0].episode.region})`);
  }
  // Zone ordering: picking a zone that has episodes must put a zone episode on top.
  for (const zone of ZONES) {
    const zoneEps = roamEpisodes.filter(e => e.usZone === zone).length;
    for (const vibe of VIBES) {
      const res = scorer({ vibe, region: 'United States', usZone: zone, duration: 'week', travelStyle: 'partner', accommodation: 'hotel' });
      coverageChecked++;
      if (!res?.length) { coverageEmpty.push(`US zone ${zone} / ${vibe}`); continue; }
      if (zoneEps > 0 && res[0].episode.usZone !== zone)
        regionDishonest.push(`zone ${zone} (${zoneEps} eps, vibe ${vibe}) -> top pick ${res[0].episode.id} has zone ${res[0].episode.usZone ?? 'none'}`);
    }
  }
} else {
  console.log('NOTE: no scorer export found — coverage matrix skipped');
}

// ── zone census (informational + hard floor) ──
const zoneCounts = Object.fromEntries(ZONES.map(z => [z, 0]));
for (const e of roamEpisodes) if (e.usZone) zoneCounts[e.usZone]++;

console.log(`episodes: ${roamEpisodes.length}`);
console.log(`zone census:`, zoneCounts);
console.log(`coverage combos checked: ${coverageChecked}, empty: ${coverageEmpty.length}, region-honesty violations: ${regionDishonest.length}`);
for (const c of coverageEmpty.slice(0, 10)) console.log(`  EMPTY: ${c}`);
for (const c of regionDishonest.slice(0, 10)) console.log(`  DISHONEST: ${c}`);
if (errors.length) {
  console.log(`\n${errors.length} SCHEMA ERRORS:`);
  for (const e of errors.slice(0, 40)) console.log('  ' + e);
}
const zoneZero = Object.entries(zoneCounts).filter(([, n]) => n === 0);
if (zoneZero.length) console.log(`zones with ZERO episodes: ${zoneZero.map(([z]) => z).join(', ')}`);

process.exit(errors.length || coverageEmpty.length || regionDishonest.length ? 1 : 0);
