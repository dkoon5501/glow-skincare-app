/**
 * Amazon Add-to-Cart URL utilities.
 * Uses Amazon's cart API to add products directly to cart with affiliate tag.
 */

const AFFILIATE_TAG = "glowskincar0c-20";

/**
 * Extract ASIN from an Amazon product URL.
 * Handles: /dp/ASIN, /gp/product/ASIN
 */
export function extractAsin(amazonUrl: string): string | null {
  const match = amazonUrl.match(/\/dp\/([A-Z0-9]{10})/i)
    || amazonUrl.match(/\/gp\/product\/([A-Z0-9]{10})/i);
  return match ? match[1] : null;
}

/**
 * Convert a single product Amazon URL to an add-to-cart URL.
 * Keeps the same visual but adds directly to cart on click.
 */
export function singleAddToCartUrl(amazonUrl: string): string {
  const asin = extractAsin(amazonUrl);
  if (!asin) return amazonUrl; // fallback to original link
  return `https://www.amazon.com/gp/aws/cart/add.html?ASIN.1=${asin}&Quantity.1=1&tag=${AFFILIATE_TAG}`;
}

/**
 * Build a multi-product add-to-cart URL.
 * Takes an array of Amazon URLs, extracts ASINs, and builds one cart URL.
 */
export function multiAddToCartUrl(amazonUrls: string[]): string | null {
  const asins = amazonUrls
    .map(extractAsin)
    .filter((a): a is string => a !== null);

  if (asins.length === 0) return null;

  // Deduplicate
  const unique = [...new Set(asins)];

  const params = unique
    .map((asin, i) => `ASIN.${i + 1}=${asin}&Quantity.${i + 1}=1`)
    .join("&");

  return `https://www.amazon.com/gp/aws/cart/add.html?${params}&tag=${AFFILIATE_TAG}`;
}
