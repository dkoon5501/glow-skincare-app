/**
 * build-expert-index.ts
 *
 * Reads the NDJSON dataset in /data (experts, sources, positions) and emits
 * a compact JSON index to client/src/lib/expert-index.json.
 *
 * The index is keyed by nutrient tag (e.g. "vitamin_d") and returns a
 * pre-sorted array of attribution items ready for direct UI rendering:
 *
 *   {
 *     "vitamin_d": [
 *       {
 *         expertName: "JoAnn Manson",
 *         expertCredentials: "MD, DrPH",
 *         affiliation: "Harvard / Brigham & Women's Hospital",
 *         evidenceLevel: "high",
 *         stanceLabel: "supportive",
 *         recommendationType: "situationally_recommended",
 *         keyQuote: "...",
 *         population: ["older_adults_75+", "pre_diabetics"],
 *         sourceTitle: "VITAL Trial — NEJM 2019",
 *         sourceUrl: "https://...",
 *         publisher: "Harvard Gazette"
 *       },
 *       ...
 *     ]
 *   }
 *
 * Run with: npx tsx scripts/build-expert-index.ts
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, "..");
const dataDir = join(repoRoot, "data");
const outPath = join(repoRoot, "client/src/lib/expert-index.json");

// ── Types mirror data/SCHEMA.md ──

type EvidenceLevel = "high" | "medium" | "low";
type StanceLabel = "supportive" | "neutral" | "neutral_to_skeptical" | "skeptical" | "warns_against";
type RecommendationType =
  | "routinely_recommended"
  | "situationally_recommended"
  | "not_routinely_recommended"
  | "lab_guided"
  | "safety_caution";

interface Expert {
  id: string;
  full_name: string;
  credentials: string[];
  primary_affiliations: string[];
  evidence_level: EvidenceLevel;
  expert_type: string;
}

interface Source {
  id: string;
  title: string;
  publisher: string;
  url: string;
  publish_date?: string;
  type: string;
}

interface Position {
  id: string;
  expert_id: string;
  source_id: string;
  nutrient: string;
  population: string[];
  stance_label: StanceLabel;
  recommendation_type: RecommendationType;
  recommendation_strength: "strong" | "moderate" | "weak";
  key_quote: string;
}

export interface ExpertSourceItem {
  expertName: string;
  expertCredentials: string;
  affiliation: string;
  evidenceLevel: EvidenceLevel;
  expertType: string;
  stanceLabel: StanceLabel;
  recommendationType: RecommendationType;
  recommendationStrength: "strong" | "moderate" | "weak";
  keyQuote: string;
  population: string[];
  sourceTitle: string;
  sourceUrl: string;
  publisher: string;
  publishDate?: string;
}

// ── Ingest ──

function readNdjson<T>(path: string): T[] {
  if (!existsSync(path)) {
    console.warn(`[warn] Missing ${path} — returning []`);
    return [];
  }
  const lines = readFileSync(path, "utf8").split("\n").filter((l) => l.trim());
  return lines.map((l, i) => {
    try {
      return JSON.parse(l) as T;
    } catch (err) {
      throw new Error(`Failed to parse ${path}:${i + 1} — ${(err as Error).message}`);
    }
  });
}

const experts = readNdjson<Expert>(join(dataDir, "experts.ndjson"));
const sources = readNdjson<Source>(join(dataDir, "sources.ndjson"));
const positions = readNdjson<Position>(join(dataDir, "positions.ndjson"));

const expertById = new Map(experts.map((e) => [e.id, e]));
const sourceById = new Map(sources.map((s) => [s.id, s]));

// Category aliases — UI supplement categories → dataset nutrient tags
// Keeps UI stable while tolerating legacy naming.
const nutrientAliases: Record<string, string[]> = {
  vitamin_b: ["vitamin_b12", "vitamin_b", "folate"],
  probiotic: ["probiotics", "probiotic"],
  vitamin_d: ["vitamin_d"],
  omega_3: ["omega_3"],
  magnesium: ["magnesium"],
  iron: ["iron"],
  zinc: ["zinc"],
  vitamin_c: ["vitamin_c"],
  multivitamin: ["multivitamin"],
  calcium: ["calcium"],
  prenatal: ["folate", "iron"],
};

// ── Sort: authority first, then stance strength ──

const evidenceRank: Record<EvidenceLevel, number> = { high: 3, medium: 2, low: 1 };
const strengthRank = { strong: 3, moderate: 2, weak: 1 };
const stanceRank: Record<StanceLabel, number> = {
  supportive: 5,
  neutral: 3,
  neutral_to_skeptical: 2,
  skeptical: 2,
  warns_against: 1,
};

function score(item: ExpertSourceItem): number {
  return (
    evidenceRank[item.evidenceLevel] * 10 +
    strengthRank[item.recommendationStrength] * 3 +
    stanceRank[item.stanceLabel]
  );
}

// ── Build index ──

const rawByNutrient: Record<string, ExpertSourceItem[]> = {};

for (const p of positions) {
  const expert = expertById.get(p.expert_id);
  const source = sourceById.get(p.source_id);
  if (!source) continue; // orphan — skip silently, warn in build log below

  const item: ExpertSourceItem = {
    expertName: expert?.full_name ?? source.publisher,
    expertCredentials: expert?.credentials?.join(", ") ?? "",
    affiliation: expert?.primary_affiliations?.[0] ?? source.publisher,
    evidenceLevel: expert?.evidence_level ?? "medium",
    expertType: expert?.expert_type ?? "institution",
    stanceLabel: p.stance_label,
    recommendationType: p.recommendation_type,
    recommendationStrength: p.recommendation_strength,
    keyQuote: p.key_quote,
    population: p.population,
    sourceTitle: source.title,
    sourceUrl: source.url,
    publisher: source.publisher,
    publishDate: source.publish_date,
  };

  rawByNutrient[p.nutrient] ??= [];
  rawByNutrient[p.nutrient].push(item);
}

// Apply aliases so UI can look up by supplement category or nutrient tag
const index: Record<string, ExpertSourceItem[]> = { ...rawByNutrient };
for (const [uiKey, nutrients] of Object.entries(nutrientAliases)) {
  const merged: ExpertSourceItem[] = [];
  for (const n of nutrients) {
    if (rawByNutrient[n]) merged.push(...rawByNutrient[n]);
  }
  if (merged.length > 0 && !index[uiKey]) {
    index[uiKey] = merged;
  }
}

// Sort every bucket, then dedupe by (expert_id, source_id) pair via object key
for (const key of Object.keys(index)) {
  const seen = new Set<string>();
  const deduped: ExpertSourceItem[] = [];
  for (const item of index[key]) {
    const k = `${item.expertName}::${item.sourceUrl}`;
    if (seen.has(k)) continue;
    seen.add(k);
    deduped.push(item);
  }
  deduped.sort((a, b) => score(b) - score(a));
  index[key] = deduped;
}

// ── Write ──

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(index, null, 2) + "\n");

// ── Summary ──

const totalPositions = positions.length;
const totalItems = Object.values(index).reduce((sum, arr) => sum + arr.length, 0);
const nutrientCounts = Object.entries(index)
  .map(([k, v]) => `  ${k}: ${v.length}`)
  .sort()
  .join("\n");

console.log(`\n[build-expert-index] ok`);
console.log(`  experts: ${experts.length}`);
console.log(`  sources: ${sources.length}`);
console.log(`  positions: ${totalPositions}`);
console.log(`  indexed items (incl. aliases): ${totalItems}`);
console.log(`  nutrients:`);
console.log(nutrientCounts);
console.log(`  → wrote ${outPath}\n`);

// Warn on orphan source references
const sourceRefs = new Set(sources.map((s) => s.id));
const orphans = positions.filter((p) => !sourceRefs.has(p.source_id));
if (orphans.length) {
  console.warn(`[warn] ${orphans.length} position(s) reference missing source_id — skipped in index`);
}
