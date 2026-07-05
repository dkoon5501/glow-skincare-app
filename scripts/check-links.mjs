#!/usr/bin/env node
// check-links.mjs — audit Amazon product links and YouTube video references
// in the static data files. No dependencies; requires Node 20+ (global fetch).
//
// Usage:
//   node scripts/check-links.mjs [--out report.json] [--summary summary.md]
//
// Exit codes:
//   0 = no confirmed-dead links (UNKNOWNs, e.g. Amazon throttling, do not fail)
//   1 = at least one confirmed-dead link
//   2 = script/setup error

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const DATA_FILES = [
  "client/src/lib/skincare-data.ts",
  "client/src/lib/vita-data.ts",
  "client/src/lib/roam-data.ts",
];

const CONCURRENCY = 3;
const DELAY_MS = 350; // polite pause before each request
const RETRY_BACKOFF_MS = 4000; // wait before the single retry on 429/503
const TIMEOUT_MS = 15000;
const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

// ── CLI args ──
const args = process.argv.slice(2);
function argValue(flag) {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : null;
}
const outPath = argValue("--out");
const summaryPath = argValue("--summary");

// ── Extraction ──
// The data files are flat arrays of object literals where `id:` always
// precedes the link fields, so a line scan that tracks the current id is
// enough to attribute every link to its record.

const ASIN_RE = /\/(?:dp|gp\/product)\/([A-Z0-9]{10})/;
const YT_WATCH_RE = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/;

function extractRefs() {
  const refs = []; // { file, recordId, field, kind, key, url }
  for (const relFile of DATA_FILES) {
    const text = readFileSync(join(ROOT, relFile), "utf8");
    let currentId = null;
    for (const rawLine of text.split("\n")) {
      const line = rawLine.trim();
      if (line.startsWith("//")) continue;

      const idMatch = line.match(/^id:\s*"([^"]+)"/);
      if (idMatch) currentId = idMatch[1];

      const amazonMatch = line.match(/^amazonUrl:\s*"([^"]+)"/);
      if (amazonMatch) {
        const asin = amazonMatch[1].match(ASIN_RE)?.[1] ?? null;
        refs.push({
          file: relFile,
          recordId: currentId,
          field: "amazonUrl",
          kind: "amazon",
          key: asin,
          url: amazonMatch[1],
        });
      }

      const sourceMatch = line.match(/^sourceUrl:\s*"([^"]+)"/);
      if (sourceMatch && sourceMatch[1].includes("yout")) {
        refs.push({
          file: relFile,
          recordId: currentId,
          field: "sourceUrl",
          kind: "youtube",
          key: sourceMatch[1].match(YT_WATCH_RE)?.[1] ?? null,
          url: sourceMatch[1],
        });
      }

      const videoIdMatch = line.match(/^videoId:\s*"([A-Za-z0-9_-]{11})"/);
      if (videoIdMatch) {
        refs.push({
          file: relFile,
          recordId: currentId,
          field: "videoId",
          kind: "youtube",
          key: videoIdMatch[1],
          url: `https://www.youtube.com/watch?v=${videoIdMatch[1]}`,
        });
      }

      // sourceLinks entries: { name: "...", url: "https://www.youtube..." }
      const linkMatch = line.match(/url:\s*"(https:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)[^"]*)"/);
      if (linkMatch && !sourceMatch) {
        refs.push({
          file: relFile,
          recordId: currentId,
          field: "sourceLinks.url",
          kind: "youtube",
          key: linkMatch[1].match(YT_WATCH_RE)?.[1] ?? null,
          url: linkMatch[1],
        });
      }
    }
  }
  return refs;
}

// ── Checking ──

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchStatus(url, method) {
  const res = await fetch(url, {
    method,
    redirect: "follow",
    headers: {
      "User-Agent": BROWSER_UA,
      "Accept": "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const finalUrl = res.url;
  try {
    await res.body?.cancel();
  } catch {
    /* ignore */
  }
  return { status: res.status, finalUrl };
}

function classifyAmazon(status, finalUrl) {
  if (finalUrl && /captcha|validateCaptcha/i.test(finalUrl)) {
    return { state: "unknown", note: `bot check (captcha redirect), HTTP ${status}` };
  }
  if (status === 404 || status === 410) return { state: "dead", note: `HTTP ${status}` };
  if (status >= 200 && status < 400) return { state: "ok", note: `HTTP ${status}` };
  return { state: "unknown", note: `HTTP ${status}` };
}

async function checkAmazon(asin) {
  const url = `https://www.amazon.com/dp/${asin}`;
  let attempt = 0;
  let lastNote = "no response";
  while (attempt < 2) {
    attempt += 1;
    try {
      // HEAD first; some servers reject it (405/403), and a HEAD 404 is
      // confirmed with GET before we declare a link dead.
      let { status, finalUrl } = await fetchStatus(url, "HEAD");
      if (status === 405 || status === 403 || status === 404) {
        ({ status, finalUrl } = await fetchStatus(url, "GET"));
      }
      if ((status === 429 || status === 503) && attempt === 1) {
        lastNote = `HTTP ${status}, retrying after backoff`;
        await sleep(RETRY_BACKOFF_MS + Math.random() * 1000);
        continue;
      }
      if (status === 429 || status === 503) {
        return { state: "unknown", note: `throttled (HTTP ${status}) after retry` };
      }
      return classifyAmazon(status, finalUrl);
    } catch (err) {
      lastNote = `request failed: ${err?.name ?? "Error"}`;
      if (attempt === 1) await sleep(RETRY_BACKOFF_MS);
    }
  }
  return { state: "unknown", note: lastNote };
}

async function checkYouTube(videoId) {
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const oembed = `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`;
  let attempt = 0;
  let lastNote = "no response";
  while (attempt < 2) {
    attempt += 1;
    try {
      const { status } = await fetchStatus(oembed, "GET");
      if ((status === 429 || status === 503) && attempt === 1) {
        await sleep(RETRY_BACKOFF_MS);
        continue;
      }
      if (status === 200) return { state: "ok", note: "HTTP 200" };
      if (status === 404) return { state: "dead", note: "oEmbed 404 (deleted or private)" };
      if (status === 401 || status === 403) {
        // Video exists but embedding is disabled — link still works for viewers.
        return { state: "ok", note: `oEmbed ${status} (embedding disabled, video exists)` };
      }
      return { state: "unknown", note: `oEmbed HTTP ${status}` };
    } catch (err) {
      lastNote = `request failed: ${err?.name ?? "Error"}`;
      if (attempt === 1) await sleep(RETRY_BACKOFF_MS);
    }
  }
  return { state: "unknown", note: lastNote };
}

async function runPool(tasks) {
  const results = new Array(tasks.length);
  let next = 0;
  async function worker() {
    while (next < tasks.length) {
      const i = next++;
      await sleep(DELAY_MS);
      results[i] = await tasks[i]();
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, tasks.length) }, worker),
  );
  return results;
}

// ── Main ──

async function main() {
  const refs = extractRefs();

  const malformed = refs.filter((r) => !r.key);
  const valid = refs.filter((r) => r.key);

  // Deduplicate: check each unique ASIN / video id once, keep every reference.
  const byTarget = new Map(); // "amazon:ASIN" | "youtube:ID" -> { kind, key, refs }
  for (const r of valid) {
    const mapKey = `${r.kind}:${r.key}`;
    if (!byTarget.has(mapKey)) byTarget.set(mapKey, { kind: r.kind, key: r.key, refs: [] });
    byTarget.get(mapKey).refs.push(r);
  }
  const targets = [...byTarget.values()];
  const amazonCount = targets.filter((t) => t.kind === "amazon").length;
  const youtubeCount = targets.filter((t) => t.kind === "youtube").length;

  console.error(
    `Checking ${targets.length} unique targets ` +
      `(${amazonCount} Amazon ASINs, ${youtubeCount} YouTube videos) ` +
      `from ${valid.length} references...`,
  );

  let done = 0;
  const tasks = targets.map((t) => async () => {
    const result = t.kind === "amazon" ? await checkAmazon(t.key) : await checkYouTube(t.key);
    done += 1;
    if (done % 25 === 0) console.error(`  ...${done}/${targets.length}`);
    return { ...t, ...result };
  });
  const checked = await runPool(tasks);

  const dead = checked.filter((c) => c.state === "dead");
  const unknown = checked.filter((c) => c.state === "unknown");
  const ok = checked.filter((c) => c.state === "ok");

  const report = {
    generatedAt: new Date().toISOString(),
    files: DATA_FILES,
    totals: {
      references: valid.length,
      uniqueTargets: targets.length,
      amazonTargets: amazonCount,
      youtubeTargets: youtubeCount,
      ok: ok.length,
      dead: dead.length,
      unknown: unknown.length,
      malformed: malformed.length,
    },
    dead: dead.map(({ kind, key, note, refs: r }) => ({ kind, key, note, references: r })),
    unknown: unknown.map(({ kind, key, note, refs: r }) => ({ kind, key, note, references: r })),
    ok: ok.map(({ kind, key, note, refs: r }) => ({
      kind,
      key,
      note,
      references: r.map((x) => `${x.file} :: ${x.recordId} (${x.field})`),
    })),
    malformed,
  };

  if (outPath) {
    writeFileSync(outPath, JSON.stringify(report, null, 2));
    console.error(`JSON report written to ${relative(process.cwd(), outPath) || outPath}`);
  }

  // Human summary (also used as the GitHub issue body).
  const lines = [];
  lines.push(`# Link audit — ${report.generatedAt}`);
  lines.push("");
  lines.push(
    `Checked **${targets.length}** unique links (${amazonCount} Amazon, ${youtubeCount} YouTube) ` +
      `covering ${valid.length} references in ${DATA_FILES.length} data files.`,
  );
  lines.push("");
  lines.push(`- OK: ${ok.length}`);
  lines.push(`- DEAD: ${dead.length}`);
  lines.push(`- UNKNOWN (throttled/bot-checked, not counted as dead): ${unknown.length}`);
  lines.push(`- Malformed (no ASIN/video id parseable): ${malformed.length}`);
  if (dead.length > 0) {
    lines.push("");
    lines.push("## Dead links");
    for (const d of dead) {
      lines.push(`- **${d.kind}** \`${d.key}\` — ${d.note}`);
      for (const r of d.refs) {
        lines.push(`  - ${r.file} → record \`${r.recordId}\` (${r.field}): ${r.url}`);
      }
    }
  }
  if (malformed.length > 0) {
    lines.push("");
    lines.push("## Malformed references");
    for (const m of malformed) {
      lines.push(`- ${m.file} → record \`${m.recordId}\` (${m.field}): ${m.url}`);
    }
  }
  const summary = lines.join("\n");
  console.log(summary);
  if (summaryPath) writeFileSync(summaryPath, summary + "\n");

  process.exit(dead.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("check-links failed:", err);
  process.exit(2);
});
