import React from "react";
import { ThemeMode } from "../types";

interface FooterProps {
  theme: ThemeMode;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenFAQ: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  theme,
  onOpenPrivacy,
  onOpenTerms,
  onOpenFAQ,
}) => {
  const isDark = theme === "dark";

  return (
    <footer
      id="app-footer"
      className={`w-full py-8 px-6 flex flex-col items-center gap-4 mt-auto border-t-2 ${
        isDark
          ? "bg-[#030712] border-[#1e3a8a] text-[#b9c3ff]"
          : "bg-[#fcf9f8] border-[#001255] text-[#1b1c1c]"
      }`}
    >
      <div className="font-mono text-xs font-bold tracking-widest text-[#ba1a1a] uppercase">
        INDEX CARD RECIPES © {new Date().getFullYear()}
      </div>

      <div className="flex flex-wrap justify-center gap-6 font-mono text-xs">
        <button
          onClick={onOpenPrivacy}
          className="text-[#5f5e5a] dark:text-[#9ca3af] hover:text-[#ba1a1a] dark:hover:text-red-400 transition-none uppercase"
        >
          Privacy
        </button>
        <button
          onClick={onOpenTerms}
          className="text-[#5f5e5a] dark:text-[#9ca3af] hover:text-[#ba1a1a] dark:hover:text-red-400 transition-none uppercase"
        >
          Terms
        </button>
        <button
          onClick={onOpenFAQ}
          className="text-[#5f5e5a] dark:text-[#9ca3af] hover:text-[#ba1a1a] dark:hover:text-red-400 transition-none uppercase"
        >
          FAQ
        </button>
      </div>

      <a
        href="https://mattdowneydev.com"
        target="_blank"
        rel="noreferrer"
        className="font-mono text-[11px] uppercase tracking-wider text-[#5f5e5a] dark:text-[#9ca3af] hover:text-[#ba1a1a] dark:hover:text-red-400 transition-none"
      >
        Designed and developed by Matt Downey
      </a>
    </footer>
  );
};
