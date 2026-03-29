import type { QuizAnswers } from "./skincare-data";

/**
 * Encode quiz answers into a compact URL-safe string.
 * Format: key1=val1&key2=val2 (arrays joined with commas)
 */
export function encodeAnswers(answers: QuizAnswers): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(answers)) {
    const val = Array.isArray(value) ? value.join(",") : value;
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
  }
  return btoa(parts.join("&"));
}

/**
 * Decode a base64-encoded answer string back to QuizAnswers.
 */
export function decodeAnswers(encoded: string): QuizAnswers | null {
  try {
    const decoded = atob(encoded);
    const answers: QuizAnswers = {};
    const parts = decoded.split("&");
    for (const part of parts) {
      const [key, val] = part.split("=").map(decodeURIComponent);
      if (!key || val === undefined) continue;
      // If it contains commas, it was a multi-select array
      answers[key] = val.includes(",") ? val.split(",") : val;
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
  const base = window.location.origin + window.location.pathname;
  return `${base}#/shared/${encoded}`;
}

/**
 * Trigger native share or copy to clipboard.
 * Returns true if shared/copied successfully.
 */
export async function shareResults(answers: QuizAnswers, skinProfile: { type: string; baumannCode: string }): Promise<"shared" | "copied" | "failed"> {
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
