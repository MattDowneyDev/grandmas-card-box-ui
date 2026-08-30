import React from "react";
import { ThemeMode } from "../types";
import { OPEN_COOKIE_PREFERENCES_EVENT } from "../lib/consent";

interface FooterProps {
  theme: ThemeMode;
}

export const Footer: React.FC<FooterProps> = ({ theme }) => {
  const isDark = theme === "dark";

  return (
    <footer
      id="app-footer"
      className={`w-full py-10 px-6 flex flex-col items-center gap-4 mt-auto border-t ${
        isDark
          ? "bg-[#2f2a24] border-[#8d7548] text-[#f7f1e7]"
          : "bg-[#efe6d6] border-[#6f3f27] text-[#332c24]"
      }`}
    >
      <div className="font-mono text-xs font-bold tracking-widest text-[#a84b2a]">
        GRANDMA'S CARDBOX · {new Date().getFullYear()}
      </div>

      <a
        href="https://mattdowneydev.com"
        target="_blank"
        rel="noreferrer"
        className="font-mono text-[11px] uppercase tracking-wider text-[#5f5e5a] dark:text-[#9ca3af] hover:text-[#ba1a1a] dark:hover:text-red-400 transition-none"
      >
        Designed and developed by MD Dev
      </a>

      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider">
        <a href="/privacy" className="underline hover:text-[#ba1a1a]">
          Privacy policy
        </a>
        <span aria-hidden="true">·</span>
        <button
          type="button"
          onClick={() =>
            window.dispatchEvent(new Event(OPEN_COOKIE_PREFERENCES_EVENT))
          }
          className="underline hover:text-[#ba1a1a]"
        >
          Cookie preferences
        </button>
      </div>
    </footer>
  );
};
