import type { Product } from "./skincare-data";
import { productDatabase } from "./skincare-data";

export interface UserProduct {
  category: Product["category"];
  brand: string;
  name: string;
  keyIngredients: string[];
  timeOfDay: "AM" | "PM" | "BOTH";
}

export interface ProductRating {
  userProduct: UserProduct;
  score: number;
  verdict: "great" | "good" | "fair" | "poor";
  explanation: string;
  suggestion?: {
    product: Product;
    reason: string;
  };
}

export interface RoutineEvaluation {
  overallScore: number;
  ratings: ProductRating[];
  missingSteps: string[];
  tips: string[];
}

// ── Ingredient compatibility by Baumann dimension ──

const INGREDIENT_GOOD: Record<string, string[]> = {
  oily: ["salicylic acid", "niacinamide", "hyaluronic acid", "zinc", "tea tree", "benzoyl peroxide", "clay", "witch hazel"],
  dry: ["ceramides", "hyaluronic acid", "squalane", "shea butter", "glycerin", "panthenol", "urea", "petrolatum", "dimethicone"],
  sensitive: ["centella", "cica", "ceramides", "aloe", "oat", "allantoin", "bisabolol", "panthenol", "colloidal oatmeal"],
  acne: ["salicylic acid", "benzoyl peroxide", "niacinamide", "retinol", "retinal", "adapalene", "azelaic acid", "zinc", "tea tree", "sulfur"],
  hyperpigmentation: ["vitamin c", "ascorbic acid", "arbutin", "niacinamide", "tranexamic acid", "kojic acid", "azelaic acid", "licorice", "alpha arbutin"],
  aging: ["retinol", "retinal", "retinoid", "peptides", "vitamin c", "ascorbic acid", "hyaluronic acid", "niacinamide", "bakuchiol", "coq10"],
};

const INGREDIENT_BAD: Record<string, string[]> = {
  oily: ["coconut oil", "mineral oil", "cocoa butter", "isopropyl myristate"],
  dry: ["alcohol denat", "denatured alcohol", "witch hazel", "menthol"],
  sensitive: ["fragrance", "parfum", "essential oil", "linalool", "limonene", "alcohol denat", "menthol", "camphor"],
  acne: ["coconut oil", "isopropyl myristate", "cocoa butter", "algae extract", "laureth-4"],
};

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

function fuzzyMatch(a: string, b: string): boolean {
  const na = normalize(a);
  const nb = normalize(b);
  if (na === nb) return true;
  if (na.includes(nb) || nb.includes(na)) return true;
  // Simple token overlap
  const tokensA = na.split(/\s+/);
  const tokensB = nb.split(/\s+/);
  const overlap = tokensA.filter(t => tokensB.some(tb => tb.includes(t) || t.includes(tb)));
  return overlap.length >= Math.min(2, tokensB.length);
}

function findDatabaseMatch(userProduct: UserProduct): Product | null {
  // Try exact brand + name match first
  const exact = productDatabase.find(
    (p) =>
      p.category === userProduct.category &&
      fuzzyMatch(p.brand, userProduct.brand) &&
      fuzzyMatch(p.name, userProduct.name)
  );
  if (exact) return exact;

  // Try brand + partial name
  const partial = productDatabase.find(
    (p) =>
      p.category === userProduct.category &&
      fuzzyMatch(p.brand, userProduct.brand)
  );
  return partial || null;
}

function getRelevantTags(baumannCode: string): string[] {
  const tags: string[] = [];
  if (baumannCode[0] === "O") tags.push("oily");
  else tags.push("dry");
  if (baumannCode[1] === "S") tags.push("sensitive");
  if (baumannCode[2] === "P") tags.push("hyperpigmentation");
  if (baumannCode[3] === "W") tags.push("aging");
  return tags;
}

function scoreDatabaseProduct(product: Product, baumannCode: string): number {
  const tags = getRelevantTags(baumannCode);
  let score = 0;
  for (const tag of tags) {
    if (product.bestFor.includes(tag)) score += 2;
  }
  const skinType = baumannCode[0] === "O" ? "oily" : baumannCode[0] === "D" ? "dry" : "normal";
  if (product.bestFor.includes(skinType)) score += 3;
  if (product.bestFor.includes("combination") && skinType === "oily") score += 1;
  if (baumannCode[1] === "S" && product.bestFor.includes("sensitive")) score += 3;
  return score;
}

function scoreUserIngredients(ingredients: string[], baumannCode: string): { good: string[]; bad: string[]; score: number } {
  const tags = getRelevantTags(baumannCode);
  const good: string[] = [];
  const bad: string[] = [];

  for (const ing of ingredients) {
    const nIng = normalize(ing);
    for (const tag of tags) {
      if (INGREDIENT_GOOD[tag]?.some((g) => nIng.includes(g) || g.includes(nIng))) {
        if (!good.includes(ing)) good.push(ing);
      }
      if (INGREDIENT_BAD[tag]?.some((b) => nIng.includes(b) || b.includes(nIng))) {
        if (!bad.includes(ing)) bad.push(ing);
      }
    }
  }

  let score = 5; // baseline
  score += good.length * 1.5;
  score -= bad.length * 2;
  return { good, bad, score: Math.max(1, Math.min(10, Math.round(score))) };
}

function getBestForCategory(category: Product["category"], baumannCode: string, amSafe = false): Product | null {
  let candidates = productDatabase.filter((p) => p.category === category && p.dermVerified !== false);
  if (amSafe) candidates = candidates.filter((p) => !p.pmOnly);
  if (candidates.length === 0) return null;

  const scored = candidates
    .map((p) => ({ product: p, score: scoreDatabaseProduct(p, baumannCode) }))
    .sort((a, b) => b.score - a.score);

  return scored[0]?.product || null;
}

export function evaluateRoutine(
  userProducts: UserProduct[],
  baumannCode: string,
  primaryConcern: string
): RoutineEvaluation {
  const ratings: ProductRating[] = [];
  const tags = getRelevantTags(baumannCode);

  for (const up of userProducts) {
    const dbMatch = findDatabaseMatch(up);
    let score: number;
    let explanation: string;
    let suggestion: ProductRating["suggestion"];

    if (dbMatch) {
      // We know this product — score it directly
      const prodScore = scoreDatabaseProduct(dbMatch, baumannCode);
      const maxPossible = tags.length * 2 + 6; // rough max
      score = Math.max(1, Math.min(10, Math.round((prodScore / Math.max(maxPossible, 1)) * 10)));

      const matchingTags = tags.filter((t) => dbMatch.bestFor.includes(t));
      if (matchingTags.length > 0) {
        explanation = `This product is well-suited for ${matchingTags.join(", ")} skin concerns. ${dbMatch.whyRecommended}`;
      } else {
        explanation = `This product is a decent choice for its category, though it may not specifically target your ${tags.join("/")} profile.`;
      }
    } else if (up.keyIngredients.length > 0) {
      // Unknown product but we have ingredients to evaluate
      const ingResult = scoreUserIngredients(up.keyIngredients, baumannCode);
      score = ingResult.score;

      const parts: string[] = [];
      if (ingResult.good.length > 0) {
        parts.push(`${ingResult.good.join(", ")} ${ingResult.good.length === 1 ? "is" : "are"} great for your skin type`);
      }
      if (ingResult.bad.length > 0) {
        parts.push(`${ingResult.bad.join(", ")} may not be ideal for your ${baumannCode} skin`);
      }
      if (parts.length === 0) {
        parts.push("We couldn't find strong matches or conflicts with your skin type based on the ingredients listed");
      }
      explanation = parts.join(". ") + ".";
    } else {
      // Unknown product, no ingredients — generic assessment
      score = 5;
      explanation = `We don't have this product in our database yet. Add key ingredients for a more detailed analysis.`;
    }

    // Check if we have a significantly better option
    const amSafe = up.timeOfDay === "AM";
    const bestInCategory = getBestForCategory(up.category, baumannCode, amSafe);
    if (bestInCategory && (!dbMatch || bestInCategory.id !== dbMatch.id)) {
      const bestScore = scoreDatabaseProduct(bestInCategory, baumannCode);
      const currentDbScore = dbMatch ? scoreDatabaseProduct(dbMatch, baumannCode) : 0;
      if (bestScore - currentDbScore >= 3 && score <= 7) {
        const bestTags = tags.filter((t) => bestInCategory.bestFor.includes(t));
        suggestion = {
          product: bestInCategory,
          reason: `Better match for your ${baumannCode} skin type${bestTags.length > 0 ? ` — specifically formulated for ${bestTags.join(", ")} concerns` : ""}`,
        };
      }
    }

    const verdict: ProductRating["verdict"] =
      score >= 8 ? "great" : score >= 6 ? "good" : score >= 4 ? "fair" : "poor";

    ratings.push({ userProduct: up, score, verdict, explanation, suggestion });
  }

  // Check for missing essential steps
  const missingSteps: string[] = [];
  const hasAM = userProducts.some((p) => p.timeOfDay === "AM" || p.timeOfDay === "BOTH");
  const hasPM = userProducts.some((p) => p.timeOfDay === "PM" || p.timeOfDay === "BOTH");
  const categories = userProducts.map((p) => p.category);

  if (!categories.includes("cleanser")) {
    missingSteps.push("A cleanser is the foundation of any routine — consider adding one for both AM and PM.");
  }
  if (!categories.includes("moisturizer")) {
    missingSteps.push("Every skin type benefits from a moisturizer, even oily skin. Look for one matched to your type.");
  }
  if (hasAM && !categories.includes("sunscreen")) {
    missingSteps.push("Sunscreen is the single most important step for preventing aging and hyperpigmentation. Add one to your AM routine.");
  }

  if (baumannCode[2] === "P" && !categories.includes("serum") && !userProducts.some((p) => p.keyIngredients.some((i) => normalize(i).includes("vitamin c") || normalize(i).includes("niacinamide")))) {
    missingSteps.push("For pigmentation-prone skin, a vitamin C or niacinamide serum can make a significant difference.");
  }
  if (baumannCode[3] === "W" && !categories.includes("treatment") && !userProducts.some((p) => p.keyIngredients.some((i) => normalize(i).includes("retinol") || normalize(i).includes("retinoid") || normalize(i).includes("retinal")))) {
    missingSteps.push("For wrinkle-prone skin, a retinoid in your PM routine is the gold standard for prevention and repair.");
  }

  // Tips
  const tips: string[] = [];
  if (baumannCode[1] === "S") {
    tips.push("With sensitive skin, introduce new products one at a time, waiting 1-2 weeks between additions.");
  }
  if (baumannCode[0] === "O") {
    tips.push("Oily skin still needs hydration — look for lightweight, water-based formulas rather than skipping moisturizer.");
  }
  if (baumannCode[0] === "D") {
    tips.push("Layer hydrating products thinnest to thickest for maximum absorption.");
  }
  if (userProducts.some((p) => p.keyIngredients.some((i) => normalize(i).includes("retinol"))) && userProducts.some((p) => p.timeOfDay === "AM" && p.keyIngredients.some((i) => normalize(i).includes("retinol")))) {
    tips.push("Retinol should only be used in your PM routine — it degrades in sunlight and increases photosensitivity.");
  }

  // Overall score
  const avgScore = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length : 5;
  const missingPenalty = missingSteps.length * 0.5;
  const overallScore = Math.max(1, Math.min(10, Math.round(avgScore - missingPenalty)));

  return { overallScore, ratings, missingSteps, tips };
}
