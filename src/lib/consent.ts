export const CONSENT_STORAGE_KEY = "grandmascardbox-cookie-consent";

export type ConsentChoice = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const getStoredConsent = (): ConsentChoice | null => {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  return value === "granted" || value === "denied" ? value : null;
};

export const storeConsent = (choice: ConsentChoice) => {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
};

export const applyConsent = (choice: ConsentChoice) => {
  window.gtag?.("consent", "update", {
    analytics_storage: choice,
  });
};

export const OPEN_COOKIE_PREFERENCES_EVENT =
  "grandmascardbox:open-cookie-preferences";
