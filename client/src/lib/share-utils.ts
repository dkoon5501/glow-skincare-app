import type { QuizAnswers } from "./skincare-data";
import { quizQuestions } from "./skincare-data";

/**
 * Short codes for answer IDs to keep URLs compact.
 * Maps full option ID -> 1-3 char code.
 */
const SHORT_CODES: Record<string, string> = {
  // Skin type
  oily: "o", dry: "d", combination: "c", normal: "n",
  // Sensitivity
  very_sensitive: "vs", somewhat_sensitive: "ss", resistant: "r",
  // Primary concern
  acne: "ac", aging: "ag", hyperpigmentation: "hp", dryness_dehydration: "dd",
  redness: "rd", texture: "tx",
  // Secondary concerns
  sc_acne: "sa", sc_dark_spots: "sd", sc_fine_lines: "sf", sc_dullness: "sl",
  sc_large_pores: "sp", sc_oiliness: "so", sc_none: "sn",
  // Sun exposure
  high_sun: "hs", moderate_sun: "ms", low_sun: "ls",
  // Retinoid experience
  retinoid_yes: "ry", retinoid_some: "rs", retinoid_no: "rn",
  // Age range
  age_teen: "at", age_20s: "a2", age_30s: "a3", age_40s: "a4", age_50plus: "a5",
  // Budget
  budget_low: "bl", budget_mid: "bm", budget_high: "bh",
};

// Reverse map
const LONG_CODES: Record<string, string> = {};
for (const [long, short] of Object.entries(SHORT_CODES)) {
  LONG_CODES[short] = long;
}

// Question IDs in fixed order for encoding
const QUESTION_ORDER = [
  "skin_type", "sensitivity", "primary_concern", "secondary_concerns",
  "sun_exposure", "retinoid_experience", "age_range", "budget"
];

/**
 * Encode quiz answers into a compact URL-safe string.
 * Format: shortcode-shortcode-shortcode.shortcode-shortcode...
 * Dots separate multi-select values within a question.
 */
export function encodeAnswers(answers: QuizAnswers): string {
  const parts: string[] = [];
  for (const qId of QUESTION_ORDER) {
    const val = answers[qId];
    if (!val) { parts.push("_"); continue; }
    if (Array.isArray(val)) {
      const codes = val.map(v => SHORT_CODES[v] || v).join(".");
      parts.push(codes || "_");
    } else {
      parts.push(SHORT_CODES[val] || val);
    }
  }
  return parts.join("-");
}

/**
 * Decode a compact answer string back to QuizAnswers.
 */
export function decodeAnswers(encoded: string): QuizAnswers | null {
  try {
    const parts = encoded.split("-");
    if (parts.length !== QUESTION_ORDER.length) return null;

    const answers: QuizAnswers = {};
    for (let i = 0; i < QUESTION_ORDER.length; i++) {
      const qId = QUESTION_ORDER[i];
      const part = parts[i];
      if (part === "_") continue;

      const question = quizQuestions.find(q => q.id === qId);
      if (question?.multiSelect) {
        // Multi-select: dot-separated short codes
        answers[qId] = part.split(".").map(code => LONG_CODES[code] || code);
      } else {
        answers[qId] = LONG_CODES[part] || part;
      }
    }
    return Object.keys(answers).length > 0 ? answers : null;
  } catch {
    return null;
  }
}

/**
 * Generate a shareable URL for the current results.
 */
export function generateShareUrl(answers: QuizAnswers): string {
  const encoded = encodeAnswers(answers);
  // Path-based share URL so Netlify redirects / edge function
  // can serve Glow-specific OG metadata for social crawlers.
  const base = window.location.origin;
  return `${base}/r/${encoded}`;
}

/**
 * Trigger native share or copy to clipboard.
 */
export async function shareResults(
  answers: QuizAnswers,
  skinProfile: { type: string; baumannCode: string }
): Promise<"shared" | "copied" | "failed"> {
  const url = generateShareUrl(answers);
  const text = `Check out my personalized skincare routine from Glow! My skin type: ${skinProfile.type} (Baumann ${skinProfile.baumannCode})`;

  // Try native share API (mobile)
  if (navigator.share) {
    try {
      await navigator.share({ title: "My Glow Skincare Routine", text, url });
      return "shared";
    } catch {
      // User cancelled or share failed, fall through to clipboard
    }
  }

  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    return "copied";
  } catch {
    return "failed";
  }
}
