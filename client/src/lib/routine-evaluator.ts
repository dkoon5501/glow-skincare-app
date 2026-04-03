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
    alternatives?: Product[];
  };
}

export interface MissingStep {
  message: string;
  category: Product["category"];
  suggestedProducts: Product[];
}

export interface RoutineEvaluation {
  overallScore: number;
  ratings: ProductRating[];
  missingSteps: MissingStep[];
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
      const missingTags = tags.filter((t) => !dbMatch.bestFor.includes(t));

      // Build a specific, concise explanation
      const skinLabel = baumannCode[0] === "O" ? "oily" : "dry";
      const catLabel = up.category;

      if (score >= 8) {
        explanation = `Strong match for your ${baumannCode} skin type. This ${catLabel} targets ${matchingTags.slice(0, 3).join(", ")} concerns, which aligns well with your profile.`;
      } else if (score >= 6) {
        explanation = `Good fit overall — it addresses ${matchingTags.slice(0, 2).join(" and ")} concerns.${missingTags.length > 0 ? ` However, it doesn't specifically target ${missingTags.slice(0, 2).join(" or ")} needs in your profile.` : ""}`;
      } else if (score >= 4) {
        if (matchingTags.length > 0) {
          explanation = `This ${catLabel} partially fits your skin — it helps with ${matchingTags.join(", ")}, but doesn't address your ${missingTags.slice(0, 2).join(" or ")} needs. A more targeted product could make a noticeable difference.`;
        } else {
          explanation = `This ${catLabel} isn't specifically designed for ${skinLabel} or ${baumannCode[1] === "S" ? "sensitive" : "resistant"} skin. It may work, but a product formulated for your profile would be more effective.`;
        }
      } else {
        explanation = `This ${catLabel} may not be the best choice for your ${baumannCode} skin type. It doesn't target your key concerns (${tags.slice(0, 3).join(", ")}), and a better-matched product could improve your results significantly.`;
      }
    } else if (up.keyIngredients.length > 0) {
      // Unknown product but we have ingredients to evaluate
      const ingResult = scoreUserIngredients(up.keyIngredients, baumannCode);
      score = ingResult.score;

      if (ingResult.good.length > 0 && ingResult.bad.length > 0) {
        explanation = `Mixed fit — ${ingResult.good.join(", ")} ${ingResult.good.length === 1 ? "works" : "work"} well for your skin, but ${ingResult.bad.join(", ")} may cause issues for your ${baumannCode} type. Consider swapping for something without the problematic ingredients.`;
      } else if (ingResult.good.length > 0) {
        explanation = `Good ingredient match — ${ingResult.good.join(", ")} ${ingResult.good.length === 1 ? "is" : "are"} well-suited for your ${baumannCode} skin type. No red flags in the formula.`;
      } else if (ingResult.bad.length > 0) {
        explanation = `Contains ${ingResult.bad.join(", ")}, which ${ingResult.bad.length === 1 ? "isn't" : "aren't"} ideal for your ${baumannCode} skin. This could lead to irritation or reduced effectiveness.`;
      } else {
        explanation = `We couldn't identify strong matches or conflicts based on the listed ingredients. The product may work fine, but we can't confirm it's optimized for your skin type.`;
      }
    } else {
      // Unknown product, no ingredients — generic assessment
      score = 5;
      explanation = `We don't have this product in our database yet. Without ingredient data, we can't assess how well it matches your ${baumannCode} skin type.`;
    }

    // Check if we have a significantly better option — include alternatives for "try another"
    const amSafe = up.timeOfDay === "AM";
    const topInCategory = productDatabase
      .filter((p) => p.category === up.category && p.dermVerified !== false && (!amSafe || !p.pmOnly))
      .map((p) => ({ product: p, score: scoreDatabaseProduct(p, baumannCode) }))
      .filter((x) => !dbMatch || x.product.id !== dbMatch.id)
      .sort((a, b) => b.score - a.score);

    const bestInCategory = topInCategory[0]?.product || null;
    if (bestInCategory) {
      const bestScore = scoreDatabaseProduct(bestInCategory, baumannCode);
      const currentDbScore = dbMatch ? scoreDatabaseProduct(dbMatch, baumannCode) : 0;
      if (bestScore - currentDbScore >= 3 && score <= 7) {
        const bestTags = tags.filter((t) => bestInCategory.bestFor.includes(t));
        const alternatives = topInCategory.slice(0, 3).map((x) => x.product);
        suggestion = {
          product: bestInCategory,
          reason: `Better match for your ${baumannCode} skin type${bestTags.length > 0 ? ` — specifically formulated for ${bestTags.join(", ")} concerns` : ""}`,
          alternatives,
        };
      }
    }

    const verdict: ProductRating["verdict"] =
      score >= 8 ? "great" : score >= 6 ? "good" : score >= 4 ? "fair" : "poor";

    ratings.push({ userProduct: up, score, verdict, explanation, suggestion });
  }

  // Check for missing essential steps — with product suggestions
  const missingSteps: MissingStep[] = [];
  const hasAM = userProducts.some((p) => p.timeOfDay === "AM" || p.timeOfDay === "BOTH");
  const hasPM = userProducts.some((p) => p.timeOfDay === "PM" || p.timeOfDay === "BOTH");
  const categories = userProducts.map((p) => p.category);

  function getTopForCategory(cat: Product["category"], amSafe = false, count = 3): Product[] {
    let candidates = productDatabase.filter((p) => p.category === cat && p.dermVerified !== false);
    if (amSafe) candidates = candidates.filter((p) => !p.pmOnly);
    return candidates
      .map((p) => ({ product: p, score: scoreDatabaseProduct(p, baumannCode) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map((x) => x.product);
  }

  if (!categories.includes("cleanser")) {
    missingSteps.push({
      message: "A cleanser is the foundation of any routine — consider adding one for both AM and PM.",
      category: "cleanser",
      suggestedProducts: getTopForCategory("cleanser"),
    });
  }
  if (!categories.includes("moisturizer")) {
    missingSteps.push({
      message: "Every skin type benefits from a moisturizer, even oily skin. Look for one matched to your type.",
      category: "moisturizer",
      suggestedProducts: getTopForCategory("moisturizer"),
    });
  }
  if (hasAM && !categories.includes("sunscreen")) {
    missingSteps.push({
      message: "Sunscreen is the single most important step for preventing aging and hyperpigmentation. Add one to your AM routine.",
      category: "sunscreen",
      suggestedProducts: getTopForCategory("sunscreen", true),
    });
  }

  if (baumannCode[2] === "P" && !categories.includes("serum") && !userProducts.some((p) => p.keyIngredients.some((i) => normalize(i).includes("vitamin c") || normalize(i).includes("niacinamide")))) {
    missingSteps.push({
      message: "For pigmentation-prone skin, a vitamin C or niacinamide serum can make a significant difference.",
      category: "serum",
      suggestedProducts: getTopForCategory("serum", true),
    });
  }
  if (baumannCode[3] === "W" && !categories.includes("treatment") && !userProducts.some((p) => p.keyIngredients.some((i) => normalize(i).includes("retinol") || normalize(i).includes("retinoid") || normalize(i).includes("retinal")))) {
    missingSteps.push({
      message: "For wrinkle-prone skin, a retinoid in your PM routine is the gold standard for prevention and repair.",
      category: "treatment",
      suggestedProducts: getTopForCategory("treatment"),
    });
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
