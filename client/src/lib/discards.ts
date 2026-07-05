/**
 * Local (device-level) record of products the user rejected, so retakes
 * honor "we remember your preferences" even without an account.
 * Signed-in users additionally persist discards to Firestore.
 */
const KEY = "bmr_discarded_products";

export function getLocalDiscards(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function addLocalDiscard(productId: string): void {
  try {
    const set = new Set(getLocalDiscards());
    set.add(productId);
    localStorage.setItem(KEY, JSON.stringify(Array.from(set)));
  } catch {
    // storage unavailable (private mode) — silently skip
  }
}
