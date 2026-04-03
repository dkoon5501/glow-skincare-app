/**
 * Open Beauty Facts API integration.
 * Free, open-source database of beauty/skincare products.
 * Used for product lookup in Rate My Routine when a product isn't in our curated database.
 */

export interface OBFProduct {
  name: string;
  brand: string;
  ingredients: string[];
  barcode?: string;
  /** Raw ingredients string for display */
  ingredientsRaw: string;
  /** Detected product category */
  category: "cleanser" | "toner" | "serum" | "moisturizer" | "sunscreen" | "treatment" | "exfoliant" | "";
}

interface OBFSearchResult {
  count: number;
  products: {
    product_name?: string;
    brands?: string;
    ingredients_text_en?: string;
    ingredients_text?: string;
    code?: string;
    categories_tags_en?: string[];
    categories?: string;
  }[];
}

/** Detect category from product name, OBF categories, and ingredients */
function detectCategory(name: string, categories: string[], ingredients: string): "cleanser" | "toner" | "serum" | "moisturizer" | "sunscreen" | "treatment" | "exfoliant" | "" {
  const n = name.toLowerCase();
  const c = categories.join(" ").toLowerCase();
  const all = `${n} ${c}`;

  if (/cleanser|face wash|foaming wash|cleansing|micellar/i.test(all)) return "cleanser";
  if (/sunscreen|spf|sun protect|sun block|uv |broad spectrum/i.test(all)) return "sunscreen";
  if (/toner|toning|astringent|essence/i.test(all)) return "toner";
  if (/serum|ampoule|booster|concentrate/i.test(all)) return "serum";
  if (/exfoliant|exfoliat|peel|aha|bha|scrub/i.test(all)) return "exfoliant";
  if (/retinol|retinal|retinoid|adapalene|tretinoin|treatment|spot|acne.*gel/i.test(all)) return "treatment";
  if (/moisturiz|cream|lotion|balm|butter|gel.*cream|hydrat.*cream|night.*cream|day.*cream/i.test(all)) return "moisturizer";

  // Fallback: check ingredients for SPF indicators
  if (/octinoxate|avobenzone|zinc oxide|titanium dioxide|homosalate|octocrylene/i.test(ingredients)) return "sunscreen";

  return "";
}

const BASE_URL = "https://world.openbeautyfacts.org/cgi/search.pl";

/**
 * Search Open Beauty Facts for skincare products.
 * Returns cleaned, deduplicated results.
 */
export async function searchProducts(query: string): Promise<OBFProduct[]> {
  if (query.length < 2) return [];

  try {
    const params = new URLSearchParams({
      search_terms: query,
      search_simple: "1",
      action: "process",
      json: "1",
      fields: "product_name,brands,ingredients_text_en,ingredients_text,code,categories_tags_en,categories",
      page_size: "15",
    });

    const res = await fetch(`${BASE_URL}?${params}`, {
      headers: { "User-Agent": "Glow-Skincare-App/1.0 (buildmyroutine.app)" },
    });

    if (!res.ok) return [];

    const data: OBFSearchResult = await res.json();

    if (!data.products?.length) return [];

    // Clean and deduplicate results
    const seen = new Set<string>();
    const results: OBFProduct[] = [];

    for (const p of data.products) {
      const name = p.product_name?.trim();
      const brand = p.brands?.trim();
      if (!name || !brand) continue;

      // Deduplicate by brand + name
      const key = `${brand.toLowerCase()}|${name.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);

      // Parse ingredients
      const rawIngredients = p.ingredients_text_en || p.ingredients_text || "";
      const ingredients = rawIngredients
        .split(/,\s*/)
        .map((i) => i.trim().toLowerCase())
        .filter((i) => i.length > 1 && i.length < 60);

      // Detect category
      const cats = Array.isArray(p.categories_tags_en) ? p.categories_tags_en : [];
      if (p.categories) {
        cats.push(...p.categories.split(",").map((c) => c.trim()));
      }
      const category = detectCategory(name, cats, rawIngredients);

      results.push({
        name,
        brand,
        ingredients,
        barcode: p.code || undefined,
        ingredientsRaw: rawIngredients,
        category,
      });
    }

    return results;
  } catch {
    return [];
  }
}
