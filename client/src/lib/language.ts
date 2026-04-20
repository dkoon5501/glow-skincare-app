// Language selector using Google Translate Website Translator backend.
// We hide Google's default UI and drive translation via the `googtrans` cookie,
// which their script reads on load/change to re-translate the page.

export type LanguageCode = "en" | "es" | "fr" | "zh-CN" | "hi" | "pt";

export interface Language {
  code: LanguageCode;
  label: string;        // Native name (what speakers call their own language)
  englishName: string;  // English name for accessibility/title
  flag: string;         // Emoji flag for visual identification
}

export const LANGUAGES: Language[] = [
  { code: "en",    label: "English",    englishName: "English",           flag: "🇺🇸" },
  { code: "es",    label: "Español",    englishName: "Spanish",           flag: "🇪🇸" },
  { code: "fr",    label: "Français",   englishName: "French",            flag: "🇫🇷" },
  { code: "zh-CN", label: "中文",       englishName: "Chinese (Simplified)", flag: "🇨🇳" },
  { code: "hi",    label: "हिन्दी",     englishName: "Hindi",             flag: "🇮🇳" },
  { code: "pt",    label: "Português",  englishName: "Portuguese",        flag: "🇵🇹" },
];

const STORAGE_KEY = "bmr-language";
const COOKIE_NAME = "googtrans";

/**
 * Reads the user's current language preference. Falls back to English.
 */
export function getCurrentLanguage(): LanguageCode {
  if (typeof window === "undefined") return "en";
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
    if (stored && LANGUAGES.some((l) => l.code === stored)) return stored;
  } catch {
    // localStorage blocked (private mode / SSR) — fine
  }
  return "en";
}

/**
 * Sets the language cookie that Google Translate reads, then reloads.
 * Setting cookie to `/en/xx` tells Google Translate: source is English, target is xx.
 */
export function setLanguage(code: LanguageCode): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {}

  // Clear existing googtrans cookie on all common paths/domains
  const host = window.location.hostname;
  const clearCookie = (domain?: string) => {
    const d = domain ? `; domain=${domain}` : "";
    document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d}`;
  };
  clearCookie();
  clearCookie(host);
  clearCookie("." + host);

  if (code !== "en") {
    // Set cookie on top-level domain so subdomains share it
    const value = `/en/${code}`;
    document.cookie = `${COOKIE_NAME}=${value}; path=/`;
    document.cookie = `${COOKIE_NAME}=${value}; path=/; domain=${host}`;
    if (host.includes(".")) {
      document.cookie = `${COOKIE_NAME}=${value}; path=/; domain=.${host}`;
    }
  }

  // Reload to let Google Translate re-process the page from the new cookie.
  window.location.reload();
}

/**
 * Restores the user's saved language on page load by setting the googtrans cookie
 * BEFORE the Google Translate script initializes. Call this from index.html head
 * or as the first thing on app boot.
 */
export function restoreLanguageOnBoot(): void {
  if (typeof window === "undefined") return;
  const saved = getCurrentLanguage();
  if (saved === "en") return;
  // Set cookie if not already set
  if (!document.cookie.includes(COOKIE_NAME)) {
    const host = window.location.hostname;
    const value = `/en/${saved}`;
    document.cookie = `${COOKIE_NAME}=${value}; path=/`;
    if (host.includes(".")) {
      document.cookie = `${COOKIE_NAME}=${value}; path=/; domain=.${host}`;
    }
  }
}
