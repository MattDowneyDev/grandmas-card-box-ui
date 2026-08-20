import React from "react";
import { ThemeMode } from "../types";
import { X, HelpCircle, Shield, FileText } from "lucide-react";

interface FAQModalProps {
  type: "faq" | "privacy" | "terms" | null;
  theme: ThemeMode;
  onClose: () => void;
}

export const FAQModal: React.FC<FAQModalProps> = ({ type, theme, onClose }) => {
  if (!type) return null;

  const isDark = theme === "dark";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div
        className={`relative w-full max-w-2xl border p-6 md:p-8 font-mono max-h-[85vh] overflow-y-auto ${
          isDark
            ? "bg-[#050b14] border-[#1e3a8a] text-white"
            : "bg-[#fcf9f8] border-[#001255] text-[#1b1c1c] brutalist-shadow"
        }`}
      >
        <div className="flex items-center justify-between border-b pb-4 mb-6 border-current">
          <div className="flex items-center gap-2">
            {type === "faq" && <HelpCircle className="w-5 h-5 text-blue-600" />}
            {type === "privacy" && (
              <Shield className="w-5 h-5 text-green-600" />
            )}
            {type === "terms" && (
              <FileText className="w-5 h-5 text-amber-600" />
            )}
            <h2 className="text-xl font-bold uppercase font-heading tracking-tight">
              {type === "faq" && "SARCASTIC FAQ & MANIFESTO"}
              {type === "privacy" && "PRIVACY POLICY (DATA MINIMALISM)"}
              {type === "terms" && "TERMS OF DIRECT DATA ACCESS"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className={`p-1 border ${
              isDark
                ? "border-[#1e3a8a] text-white"
                : "border-[#001255] text-[#001255]"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {type === "faq" && (
          <div className="space-y-6 text-xs md:text-sm">
            <div>
              <div className="font-bold text-blue-600 dark:text-blue-400 mb-1">
                Q: Why is there no backstory about your childhood in Provence?
              </div>
              <div className="opacity-90 leading-relaxed">
                A: Because you are hungry right now. You do not need to know
                what the autumn leaves smelled like in 2004 to brown 1 lb of
                ground beef.
              </div>
            </div>

            <div>
              <div className="font-bold text-blue-600 dark:text-blue-400 mb-1">
                Q: Can I post a recipe with 35 ingredients and 4 emulsifiers?
              </div>
              <div className="opacity-90 leading-relaxed">
                A: No. This is Index Card Recipes, not the CERN laboratory. If a
                dish takes 35 ingredients, rethink your life choices.
              </div>
            </div>

            <div>
              <div className="font-bold text-blue-600 dark:text-blue-400 mb-1">
                Q: What is a "Quick Fix (&lt; 5)"?
              </div>
              <div className="opacity-90 leading-relaxed">
                A: Dishes with 4 or fewer ingredients, or under 15 minutes of
                mechanical effort. Maximum flavor, minimum cognitive load.
              </div>
            </div>

            <div>
              <div className="font-bold text-blue-600 dark:text-blue-400 mb-1">
                Q: What if I really want to talk about my cat?
              </div>
              <div className="opacity-90 leading-relaxed">
                A: Tell your cat directly. Your cat will care approximately as
                much as we do.
              </div>
            </div>
          </div>
        )}

        {type === "privacy" && (
          <div className="space-y-4 text-xs md:text-sm leading-relaxed">
            <p>
              <strong>1. NO TRACKING SCRIPTS:</strong> We do not track your
              mouse, your heartbeat, or what supermarket you visit.
            </p>
            <p>
              <strong>2. LOCAL STORAGE FIRST:</strong> Your personal card box
              and custom recipe donations are stored in your browser's
              persistent storage.
            </p>
            <p>
              <strong>3. ZERO COOKIES FOR ADS:</strong> We have no banner
              advertisements, no pop-up newsletter modals, and no corporate
              sponsor overrides.
            </p>
          </div>
        )}

        {type === "terms" && (
          <div className="space-y-4 text-xs md:text-sm leading-relaxed">
            <p>
              <strong>CLAUSE 1:</strong> You agree not to upload blog essays
              disguised as recipes.
            </p>
            <p>
              <strong>CLAUSE 2:</strong> All uploaded recipes must have accurate
              cook times. Lying that caramelizing onions takes "5 minutes" is a
              violation of international kitchen law.
            </p>
            <p>
              <strong>CLAUSE 3:</strong> Dry the chicken skin before roasting.
            </p>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-current flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 font-bold font-mono text-xs uppercase ${
              isDark ? "bg-[#1e3a8a] text-white" : "bg-[#001255] text-white"
            }`}
          >
            UNDERSTOOD
          </button>
        </div>
      </div>
    </div>
  );
};
