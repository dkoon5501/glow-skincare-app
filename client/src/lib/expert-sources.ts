/**
 * expert-sources.ts
 *
 * Typed loader for the generated expert-index.json.
 * Powers the "Expert says…" attribution panel in supplement cards.
 *
 * Regenerate with: npx tsx scripts/build-expert-index.ts
 */

import indexData from "./expert-index.json";

export type EvidenceLevel = "high" | "medium" | "low";
export type StanceLabel = "supportive" | "neutral" | "neutral_to_skeptical" | "skeptical" | "warns_against";
export type RecommendationType =
  | "routinely_recommended"
  | "situationally_recommended"
  | "not_routinely_recommended"
  | "lab_guided"
  | "safety_caution";

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

const expertIndex = indexData as Record<string, ExpertSourceItem[]>;

/**
 * Look up expert attributions for a supplement category/nutrient key.
 * Returns a stance-ranked, de-duplicated list. Empty array if nothing indexed.
 */
export function getExpertSourcesFor(
  categoryOrNutrient: string,
  limit = 3
): ExpertSourceItem[] {
  const items = expertIndex[categoryOrNutrient];
  if (!items || items.length === 0) return [];
  return items.slice(0, limit);
}

/**
 * Narrow by population tag (e.g. "vegans", "pregnancy"). Falls back to the
 * generic list if nothing matches the population filter.
 */
export function getExpertSourcesForPopulation(
  categoryOrNutrient: string,
  population: string,
  limit = 3
): ExpertSourceItem[] {
  const items = expertIndex[categoryOrNutrient] ?? [];
  const populationMatch = items.filter(
    (i) => i.population.includes(population) || i.population.includes("general_adults")
  );
  const chosen = populationMatch.length > 0 ? populationMatch : items;
  return chosen.slice(0, limit);
}

/** Short display string like "JoAnn Manson, MD, DrPH · Harvard / Brigham". */
export function formatExpertLine(item: ExpertSourceItem): string {
  const creds = item.expertCredentials ? `, ${item.expertCredentials}` : "";
  const affiliation = item.affiliation && item.affiliation !== item.expertName ? ` · ${item.affiliation}` : "";
  return `${item.expertName}${creds}${affiliation}`;
}

/** Human-readable label for recommendation type (used on badges). */
export function formatRecommendationType(type: RecommendationType): string {
  switch (type) {
    case "routinely_recommended":
      return "Routinely recommended";
    case "situationally_recommended":
      return "Situational";
    case "not_routinely_recommended":
      return "Not routine";
    case "lab_guided":
      return "Lab-guided";
    case "safety_caution":
      return "Safety caution";
  }
}
