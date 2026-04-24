import type { RoamAnswers } from "./roam-data";

/**
 * Roam share utilities.
 * Encodes/decodes quiz answers into compact URL-safe strings.
 *
 * V2 (current): 6 segments — [vibe, region, usZone, duration, travelStyle, accommodation]
 * V1 (legacy):  4 segments — [vibe, region, duration, travelStyle]
 * Decoder accepts both so old share links keep working.
 */

const SHORT: Record<string, string> = {
  // vibe
  luxury: "vl", budget: "vb", offbeat: "vo", adventure: "va",
  // region
  Asia: "rA", Europe: "rE", Americas: "rM", Africa: "rF",
  "Middle East": "rX", Oceania: "rO", "United States": "rU",
  // usZone
  "Pacific Coast": "zP", "Rocky Mountains": "zR", Southwest: "zS",
  Southeast: "zE", West: "zW", "Alaska & Hawaii": "zA",
  // duration
  weekend: "dk", week: "dw", twoWeeks: "dt", month: "dm",
  // travelStyle
  solo: "ts", partner: "tp", family: "tf", group: "tg",
  // accommodation
  hotel: "ah", hostel: "as", outdoor: "ao", rv: "av",
};

const LONG: Record<string, string> = {};
for (const [k, v] of Object.entries(SHORT)) LONG[v] = k;

const ORDER_V2 = ["vibe", "region", "usZone", "duration", "travelStyle", "accommodation"];
const ORDER_V1 = ["vibe", "region", "duration", "travelStyle"];

export function encodeRoamAnswers(a: RoamAnswers): string {
  return ORDER_V2.map((key) => {
    const v = a[key];
    return v ? (SHORT[v] || v) : "_";
  }).join("-");
}

export function decodeRoamAnswers(encoded: string): RoamAnswers | null {
  try {
    const parts = encoded.split("-");
    let order: string[];
    if (parts.length === ORDER_V2.length) order = ORDER_V2;
    else if (parts.length === ORDER_V1.length) order = ORDER_V1;
    else return null;

    const out: RoamAnswers = {};
    for (let i = 0; i < order.length; i++) {
      const p = parts[i];
      if (p === "_") continue;
      out[order[i]] = LONG[p] || p;
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
  topPickCreator?: string,
): Promise<"shared" | "copied" | "failed"> {
  const url = generateRoamShareUrl(a);
  const by = topPickCreator ? ` — curated by ${topPickCreator}.` : " — a creator-vetted travel pick.";
  const text = `My Roam travel pick: ${topPickTitle}${by}`;

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
