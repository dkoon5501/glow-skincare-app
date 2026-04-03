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
}

interface OBFSearchResult {
  count: number;
  products: {
    product_name?: string;
    brands?: string;
    ingredients_text_en?: string;
    ingredients_text?: string;
    code?: string;
  }[];
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
      fields: "product_name,brands,ingredients_text_en,ingredients_text,code",
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

      results.push({
        name,
        brand,
        ingredients,
        barcode: p.code || undefined,
        ingredientsRaw: rawIngredients,
      });
    }

    return results;
  } catch {
    return [];
  }
}
