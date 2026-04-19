import type { VitaAnswers } from "./vita-data";

/**
 * Vita share utilities.
 * Encodes/decodes quiz answers into URL-safe short strings and
 * triggers native share / clipboard copy.
 */

// Short codes for compact URLs.
const SHORT: Record<string, string> = {
  // age
  "18-29": "a1", "30-39": "a2", "40-49": "a3", "50-59": "a4", "60+": "a5",
  // sex
  female: "sf", male: "sm", unspecified: "su",
  // diet
  standard: "ds", vegetarian: "dv", vegan: "dg", keto: "dk", mediterranean: "dm",
  // goals (multi)
  energy: "ge", sleep: "gs", immunity: "gi", joint: "gj", gut: "gg",
  stress: "gx", beauty: "gb", fitness: "gf", heart: "gh", cognitive: "gc",
  // conditions (multi)
  vit_d_deficiency: "cd", iron_deficiency: "ci", digestive: "cg", anxiety: "ca",
  insomnia: "cs", joint_pain: "cj", pregnant: "cp", none: "cn",
  // lifestyle (multi)
  active: "la", sedentary: "ld", low_sun: "ll", caffeine: "lc",
  alcohol: "lo", medications: "lm",
  // preference
  capsule: "pc", gummy: "pg", powder: "pp", any: "pa",
};

const LONG: Record<string, string> = {};
for (const [k, v] of Object.entries(SHORT)) LONG[v] = k;

// Fixed question order. Multi-select questions are dot-joined.
const ORDER: Array<{ id: string; multi: boolean }> = [
  { id: "age", multi: false },
  { id: "sex", multi: false },
  { id: "diet", multi: false },
  { id: "goals", multi: true },
  { id: "conditions", multi: true },
  { id: "lifestyle", multi: true },
  { id: "preference", multi: false },
];

export function encodeVitaAnswers(a: VitaAnswers): string {
  const parts: string[] = [];
  for (const { id, multi } of ORDER) {
    const v = a[id];
    if (!v) { parts.push("_"); continue; }
    if (Array.isArray(v)) {
      const codes = v.map((x) => SHORT[x] || x).join(".");
      parts.push(codes || "_");
    } else {
      parts.push(SHORT[v] || v);
    }
    // If it's multi but stored as string by mistake, handled above.
    void multi;
  }
  return parts.join("-");
}

export function decodeVitaAnswers(encoded: string): VitaAnswers | null {
  try {
    const parts = encoded.split("-");
    if (parts.length !== ORDER.length) return null;
    const out: VitaAnswers = {};
    for (let i = 0; i < ORDER.length; i++) {
      const { id, multi } = ORDER[i];
      const p = parts[i];
      if (p === "_") continue;
      if (multi) {
        out[id] = p.split(".").map((c) => LONG[c] || c);
      } else {
        out[id] = LONG[p] || p;
      }
    }
    return Object.keys(out).length > 0 ? out : null;
  } catch {
    return null;
  }
}

export function generateVitaShareUrl(a: VitaAnswers): string {
  const enc = encodeVitaAnswers(a);
  // Use a path-based share URL so the Netlify edge function can
  // inject Vita-specific OG metadata for social crawlers.
  const base = window.location.origin;
  return `${base}/v/${enc}`;
}

export async function shareVitaRoutine(
  a: VitaAnswers,
  profileCode: string,
): Promise<"shared" | "copied" | "failed"> {
  const url = generateVitaShareUrl(a);
  const text = `Check out my personalized vitamin routine from Vita. Profile: ${profileCode}.`;

  if (navigator.share) {
    try {
      await navigator.share({ title: "My Vita Vitamin Routine", text, url });
      return "shared";
    } catch {
      // fall through
    }
  }

  try {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    return "copied";
  } catch {
    return "failed";
  }
}
