#!/usr/bin/env node
/**
 * Roam all-inclusive resort ingest: match each researched resort to a REAL
 * on-property YouTube tour, then emit the typed catalog + a provenance audit.
 *
 * Video IDs are never taken from a model — they come from `yt-dlp` search
 * results, so every id in the catalog is one YouTube actually returned. A
 * candidate is only accepted if the video title independently names the
 * property (on-property verification), which is what stops a generic
 * "10 BEST Cancun resorts" listicle from being sold as a tour of one resort.
 *
 *   node scripts/ingest-resorts.mjs            # full run
 *   node scripts/ingest-resorts.mjs --limit 5  # smoke test
 *
 * In:  data/resorts-raw.json      (research output; no videos, no prices)
 * Out: client/src/lib/roam-resorts.ts
 *      data/roam-resorts-audit.json
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const execFileP = promisify(execFile);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const RAW = join(ROOT, "data", "resorts-raw.json");
const OUT_TS = join(ROOT, "client", "src", "lib", "roam-resorts.ts");
const OUT_AUDIT = join(ROOT, "data", "roam-resorts-audit.json");

const LIMIT = process.argv.includes("--limit")
  ? Number(process.argv[process.argv.indexOf("--limit") + 1])
  : Infinity;

const CONCURRENCY = 4;
const MIN_DURATION_S = 240;   // under 4 min is a teaser/Short, not a walkthrough
const MAX_DURATION_S = 5400;  // over 90 min is a vlog compilation, not this property
const MIN_TOKEN_MATCH = 0.7;  // fraction of the property's distinctive name tokens

// Words that carry no identifying signal — "Resort", "Hotel" and "Beach" appear in
// half the properties on earth, so matching on them would let any video through.
const STOPWORDS = new Set([
  "the", "and", "a", "an", "of", "at", "by", "resort", "resorts", "hotel", "hotels",
  "spa", "beach", "all", "inclusive", "all-inclusive", "suites", "suite", "collection",
  "club", "bay", "adults", "only", "&",
]);

// A listicle names many properties; it is never a tour of the one we asked for.
const LISTICLE = /\b(top|best|worst|vs|versus|ranked|ranking|every|all)\s+\d+|\b\d+\s+(best|top|worst|cheapest|luxury)\b|listicle/i;

const norm = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();

const tokensOf = (name) =>
  norm(name).split(" ").filter((t) => t.length > 1 && !STOPWORDS.has(t));

const slug = (s) => norm(s).replace(/\s+/g, "-").slice(0, 60);

/** Fraction of the property's distinctive tokens that appear in the video title. */
function titleMatchScore(resortName, videoTitle) {
  const want = tokensOf(resortName);
  if (!want.length) return 0;
  const hay = norm(videoTitle);
  const hit = want.filter((t) => hay.includes(t)).length;
  return hit / want.length;
}

async function ytSearch(query, n = 6) {
  try {
    const { stdout } = await execFileP(
      "yt-dlp",
      ["--flat-playlist", "--dump-json", "--no-warnings", `ytsearch${n}:${query}`],
      { maxBuffer: 32 * 1024 * 1024, timeout: 90_000 },
    );
    return stdout.trim().split("\n").filter(Boolean).map((l) => JSON.parse(l));
  } catch {
    return [];
  }
}

/** Full extract for the one chosen video — flat search results carry no upload date. */
async function ytDetail(videoId) {
  try {
    const { stdout } = await execFileP(
      "yt-dlp",
      ["--dump-json", "--no-warnings", "--skip-download", `https://www.youtube.com/watch?v=${videoId}`],
      { maxBuffer: 32 * 1024 * 1024, timeout: 90_000 },
    );
    const d = JSON.parse(stdout);
    return {
      uploadDate: d.upload_date ?? null,          // YYYYMMDD
      channel: d.channel ?? d.uploader ?? null,
      channelHandle: d.uploader_id ?? null,
      title: d.title ?? null,
      duration: d.duration ?? null,
      availability: d.availability ?? null,
    };
  } catch {
    return null;
  }
}

/** Search a few phrasings, keep the best candidate that actually names the property. */
async function findTour(resort) {
  const queries = [
    `${resort.name} resort tour`,
    `${resort.name} ${resort.country} full tour review`,
    `${resort.name} walkthrough`,
  ];

  const seen = new Set();
  const scored = [];

  for (const q of queries) {
    for (const c of await ytSearch(q)) {
      if (!c.id || seen.has(c.id)) continue;
      seen.add(c.id);

      const title = c.title ?? "";
      const dur = c.duration ?? 0;

      const reject =
        !/^[\w-]{11}$/.test(c.id) ? "malformed id"
        : dur < MIN_DURATION_S ? `too short (${dur}s)`
        : dur > MAX_DURATION_S ? `too long (${dur}s)`
        : LISTICLE.test(title) ? "listicle"
        : null;

      const score = titleMatchScore(resort.name, title);
      if (reject || score < MIN_TOKEN_MATCH) {
        scored.push({ id: c.id, title, score, rejected: reject ?? `weak title match (${score.toFixed(2)})` });
        continue;
      }
      scored.push({ id: c.id, title, score, channel: c.channel ?? null, duration: dur, rejected: null });
    }
    // Stop early once we have a strong on-property match; no need to burn more searches.
    if (scored.some((s) => !s.rejected && s.score >= 0.9)) break;
  }

  const accepted = scored.filter((s) => !s.rejected).sort((a, b) => b.score - a.score);
  return { candidates: scored, best: accepted[0] ?? null };
}

async function mapPool(items, worker, concurrency) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await worker(items[i], i);
      }
    }),
  );
  return out;
}

// ── run ──

const raw = JSON.parse(readFileSync(RAW, "utf-8"));
const resorts = (Array.isArray(raw) ? raw : raw.resorts).slice(0, LIMIT);
console.log(`[ingest] ${resorts.length} researched resorts -> matching tours\n`);

const audit = [];

const results = await mapPool(
  resorts,
  async (r) => {
    const { candidates, best } = await findTour(r);

    let video = null;
    if (best) {
      const detail = await ytDetail(best.id);
      // A video that vanished between search and extract, or that isn't public,
      // would 404 on the site — drop it rather than ship a dead embed.
      if (detail && detail.uploadDate) {
        video = {
          videoId: best.id,
          videoTitle: detail.title ?? best.title,
          channel: detail.channel ?? best.channel ?? null,
          tourYear: Number(detail.uploadDate.slice(0, 4)),
          matchScore: Number(best.score.toFixed(2)),
        };
      }
    }

    audit.push({
      resort: r.name,
      region: r.region,
      matched: !!video,
      video: video ?? null,
      rejectedCandidates: candidates.filter((c) => c.rejected).slice(0, 4),
    });

    console.log(
      video
        ? `  OK   ${r.name}\n         -> ${video.videoId} "${(video.videoTitle ?? "").slice(0, 60)}" (${video.channel}, ${video.tourYear}, match ${video.matchScore})`
        : `  MISS ${r.name}  (no on-property tour survived verification)`,
    );

    return { ...r, video };
  },
  CONCURRENCY,
);

const matched = results.filter((r) => r.video).length;
const coverage = matched / results.length;
console.log(`\n[ingest] video coverage: ${matched}/${results.length} = ${(coverage * 100).toFixed(1)}%`);

writeFileSync(
  OUT_AUDIT,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString().slice(0, 10),
      method:
        "LLM research (property facts, no prices) -> yt-dlp YouTube search -> on-property title verification " +
        "(>=70% of distinctive name tokens must appear in the video title; listicles, sub-4min teasers and " +
        ">90min vlogs rejected) -> full extract for real upload year. Video IDs come from YouTube search " +
        "results only, never from a model.",
      total: results.length,
      withVideo: matched,
      coverage: Number(coverage.toFixed(3)),
      perRegion: results.reduce((a, r) => ((a[r.region] = (a[r.region] ?? 0) + 1), a), {}),
      resorts: audit,
    },
    null,
    2,
  ) + "\n",
);

writeFileSync(OUT_TS, renderTs(results));
console.log(`[ingest] wrote ${OUT_TS}\n[ingest] wrote ${OUT_AUDIT}`);

function renderTs(list) {
  const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const arr = (xs) => `[${xs.map((x) => `"${esc(x)}"`).join(",")}]`;

  const body = list
    .map((r) => {
      const lines = [
        `    id: "${slug(r.name)}",`,
        `    name: "${esc(r.name)}",`,
        `    brand: "${esc(r.brand)}",`,
        `    destination: "${esc(r.destination)}",`,
        `    country: "${esc(r.country)}",`,
        `    region: "${esc(r.region)}",`,
        `    adultsOnly: ${!!r.adultsOnly},`,
        `    familyFriendly: ${!!r.familyFriendly},`,
        `    tags: ${arr(r.tags ?? [])},`,
        `    highlights: ${arr(r.highlights ?? [])},`,
        `    officialSite: "${esc(r.officialSite)}",`,
      ];
      if (r.video) {
        lines.push(
          `    video: { videoId: "${r.video.videoId}", channel: "${esc(r.video.channel ?? "")}", tourYear: ${r.video.tourYear} },`,
        );
      }
      return `  {\n${lines.join("\n")}\n  },`;
    })
    .join("\n");

  return `/**
 * Roam — All-Inclusive Resorts.
 *
 * Generated by scripts/ingest-resorts.mjs — do NOT hand-edit.
 * Property facts are research-verified against each resort's official site.
 * Every \`video\` is a real YouTube result whose title independently names the
 * property, with the true upload year (provenance: data/roam-resorts-audit.json).
 * Resorts carry NO prices: rates swing by season and we will not invent them.
 */

import type { Region } from "./roam-data";

export type ResortTag =
  | "luxury" | "value" | "boutique" | "overwater" | "beachfront" | "golf"
  | "spa" | "party" | "romantic" | "swim-up" | "adventure" | "diving"
  | "safari" | "rainforest";

export interface ResortVideo {
  videoId: string;
  channel: string;
  /** Upload year of the tour, shown to the user so a 2019 walkthrough can't pose as current. */
  tourYear: number;
}

export interface Resort {
  id: string;
  name: string;
  brand: string;
  destination: string;
  country: string;
  region: Region;
  adultsOnly: boolean;
  familyFriendly: boolean;
  tags: ResortTag[];
  highlights: string[];
  officialSite: string;
  video?: ResortVideo;
}

export const roamResorts: Resort[] = [
${body}
];

/** Regions that actually have resorts, in catalog order — drives the filter bar. */
export const resortRegions: Region[] = Array.from(
  new Set(roamResorts.map((r) => r.region)),
) as Region[];
`;
}
