/**
 * Local (device-level) record of Roam episodes the user replaced on the
 * results screen, so backfills and retakes skip videos they didn't like —
 * same pattern as lib/discards.ts for Glow products.
 */
const KEY = "bmr_roam_hidden_episodes";

export function getRoamDiscards(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function addRoamDiscard(episodeId: string): void {
  try {
    const set = new Set(getRoamDiscards());
    set.add(episodeId);
    localStorage.setItem(KEY, JSON.stringify(Array.from(set)));
  } catch {
    // storage unavailable (private mode) — silently skip
  }
}

export function clearRoamDiscards(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // storage unavailable — nothing to clear
  }
}
