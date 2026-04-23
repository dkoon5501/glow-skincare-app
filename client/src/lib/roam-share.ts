import type { RoamAnswers } from "./roam-data";

/**
 * Roam share utilities.
 * Encodes/decodes 4-answer quiz responses into compact URL-safe strings.
 */

const SHORT: Record<string, string> = {
  // vibe
  luxury: "vl", budget: "vb", offbeat: "vo", adventure: "va",
  // region
  Asia: "rA", Europe: "rE", Americas: "rM", Africa: "rF",
  "Middle East": "rX", Oceania: "rO",
  // duration
  week: "dw", twoWeeks: "dt", month: "dm",
  // travelStyle
  solo: "ts", partner: "tp", family: "tf", group: "tg",
};

const LONG: Record<string, string> = {};
for (const [k, v] of Object.entries(SHORT)) LONG[v] = k;

const ORDER = ["vibe", "region", "duration", "travelStyle"];

export function encodeRoamAnswers(a: RoamAnswers): string {
  return ORDER.map((key) => {
    const v = a[key];
    return v ? (SHORT[v] || v) : "_";
  }).join("-");
}

export function decodeRoamAnswers(encoded: string): RoamAnswers | null {
  try {
    const parts = encoded.split("-");
    if (parts.length !== ORDER.length) return null;
    const out: RoamAnswers = {};
    for (let i = 0; i < ORDER.length; i++) {
      const p = parts[i];
      if (p === "_") continue;
      out[ORDER[i]] = LONG[p] || p;
    }
    return Object.keys(out).length > 0 ? out : null;
  } catch {
    return null;
  }
}

export function generateRoamShareUrl(a: RoamAnswers): string {
  const enc = encodeRoamAnswers(a);
  const base = window.location.origin;
  return `${base}/roam/${enc}`;
}

export async function shareRoamResults(
  a: RoamAnswers,
  topPickTitle: string,
): Promise<"shared" | "copied" | "failed"> {
  const url = generateRoamShareUrl(a);
  const text = `My Roam travel pick: ${topPickTitle} — curated by Kara & Nate.`;

  if (navigator.share) {
    try {
      await navigator.share({ title: "My Roam Travel Pick", text, url });
      return "shared";
    } catch {
      // fall through to clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    return "copied";
  } catch {
    return "failed";
  }
}
