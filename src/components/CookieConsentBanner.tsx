import React, { useEffect, useState } from "react";
import { ThemeMode } from "../types";
import {
  applyConsent,
  getStoredConsent,
  OPEN_COOKIE_PREFERENCES_EVENT,
  storeConsent,
  ConsentChoice,
} from "../lib/consent";

interface Props {
  theme: ThemeMode;
}

export const CookieConsentBanner: React.FC<Props> = ({ theme }) => {
  const isDark = theme === "dark";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getStoredConsent()) setVisible(true);

    const reopen = () => setVisible(true);
    window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, reopen);
    return () =>
      window.removeEventListener(OPEN_COOKIE_PREFERENCES_EVENT, reopen);
  }, []);

  const choose = (choice: ConsentChoice) => {
    storeConsent(choice);
    applyConsent(choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className={`fixed inset-x-4 bottom-4 z-[60] mx-auto flex max-w-2xl flex-col gap-4 rounded-md border p-5 shadow-lg sm:flex-row sm:items-center sm:justify-between ${
        isDark
          ? "bg-[#2f2a24] border-[#8d7548] text-[#f7f1e7]"
          : "bg-[#fcf9f8] border-[#001255] text-[#1b1c1c]"
      }`}
    >
      <p className="flex-1 text-sm">
        We use Google Analytics to understand how Grandma&apos;s Card Box is
        used. It only runs if you say yes, and you can change your mind
        anytime from the link in the footer. See our{" "}
        <a href="/privacy" className="underline hover:text-[#ba1a1a]">
          privacy policy
        </a>{" "}
        for details.
      </p>
      <div className="flex flex-shrink-0 justify-end gap-3">
        <button
          type="button"
          onClick={() => choose("denied")}
          className={`rounded border px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
            isDark
              ? "border-[#8d7548] hover:bg-white/10"
              : "border-[#001255] hover:bg-black/5"
          }`}
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => choose("granted")}
          className="rounded bg-[#ba1a1a] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#a01515]"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
