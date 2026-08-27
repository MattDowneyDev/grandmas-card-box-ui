import React, { useState, useEffect } from "react";
import { Recipe, ThemeMode } from "../types";
import {
  X,
  Clock,
  Utensils,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  Printer,
  AlertTriangle,
  Share2,
} from "lucide-react";

interface RecipeModalProps {
  recipe: Recipe | null;
  theme: ThemeMode;
  onClose: () => void;
  onToggleMyBox: (recipeId: string) => void;
  onDeleteRecipe?: (recipeId: string) => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  theme,
  onClose,
  onToggleMyBox,
  onDeleteRecipe,
}) => {
  if (!recipe) return null;

  const isDark = theme === "dark";

  const [checkedIngredients, setCheckedIngredients] = useState<
    Record<number, boolean>
  >({});
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>(
    {},
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCheckedIngredients({});
    setCompletedSteps({});
  }, [recipe]);

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCopyText = () => {
    const plainText = `=== ${recipe.title} (ID: ${recipe.id}) ===\nTAG: ${recipe.tag} | COOK TIME: ${recipe.cookTimeMin} MIN\n\nINGREDIENTS:\n${recipe.ingredients.map((ing) => `• ${ing}`).join("\n")}\n\nINSTRUCTIONS:\n${recipe.instructions.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n${recipe.warningNote || ""}\n\nNO BACKSTORY. JUST DATA.`;
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="recipe-modal-overlay"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 py-8 bg-black/70 backdrop-blur-xs overflow-y-auto"
    >
      <div
        id="recipe-index-card-modal"
        onClick={(event) => event.stopPropagation()}
        className={`relative w-full max-w-3xl border p-6 md:p-10 font-mono ${
          isDark
            ? "bg-[#050b14] border-[#1e3a8a] text-white shadow-2xl"
            : "bg-[#fcf9f8] border-[#001255] text-[#1b1c1c] brutalist-shadow"
        }`}
      >
        {/* Top Header Controls */}
        <div className="flex items-center justify-between border-b pb-4 mb-6 border-current">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider opacity-80">
              TAG: {recipe.tag}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Copy pure data */}
            <button
              onClick={handleCopyText}
              className={`p-1.5 border text-xs flex items-center gap-1 transition-none ${
                isDark
                  ? "border-[#1e3a8a] text-[#93c5fd] hover:bg-[#1e3a8a]"
                  : "border-[#001255] text-[#001255] hover:bg-[#e5e2dc]"
              }`}
              title="Copy pure text data"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span className="hidden sm:inline text-[11px]">
                {copied ? "COPIED" : "COPY"}
              </span>
            </button>

            {/* Print card */}
            <button
              onClick={handlePrint}
              className={`p-1.5 border text-xs flex items-center gap-1 transition-none ${
                isDark
                  ? "border-[#1e3a8a] text-[#93c5fd] hover:bg-[#1e3a8a]"
                  : "border-[#001255] text-[#001255] hover:bg-[#e5e2dc]"
              }`}
              title="Print index card"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px]">PRINT</span>
            </button>

            {/* Bookmark button */}
            <button
              onClick={() => onToggleMyBox(recipe.id)}
              className={`p-1.5 border text-xs flex items-center gap-1 transition-none ${
                recipe.inMyBox
                  ? isDark
                    ? "bg-[#1e3a8a] text-white border-[#3b82f6]"
                    : "bg-[#001255] text-white border-[#001255]"
                  : isDark
                    ? "border-[#1e3a8a] text-[#93c5fd]"
                    : "border-[#001255] text-[#001255]"
              }`}
              title={recipe.inMyBox ? "In your box" : "Add to your box"}
            >
              {recipe.inMyBox ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            {/* Close button */}
            <button
              id="btn-close-recipe-modal"
              onClick={onClose}
              className={`p-1.5 border transition-none ml-2 ${
                isDark
                  ? "border-[#1e3a8a] text-gray-300 hover:text-white hover:bg-[#1e3a8a]"
                  : "border-[#001255] text-[#001255] hover:bg-[#001255] hover:text-white"
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Recipe Title & Image */}
        <div className="mb-6">
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading uppercase tracking-tight mb-2 ${
              isDark ? "text-[#3b82f6]" : "text-[#001255]"
            }`}
          >
            {recipe.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono opacity-90">
            <span className="flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5" />
              {recipe.ingredients.length} INGREDIENTS
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {recipe.prepTimeMin || 0} MIN PREP / {recipe.cookTimeMin} MIN COOK
              /{" "}
              {recipe.totalTimeMin ??
                (recipe.prepTimeMin || 0) + recipe.cookTimeMin}{" "}
              MIN TOTAL
            </span>
            {recipe.servings && <span>{recipe.servings} SERVINGS</span>}
          </div>
        </div>

        {/* Optional Image Banner */}
        {recipe.imageUrl && (
          <div className="mb-6 border border-current/30 overflow-hidden max-h-64 bg-black/10">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* Main Content Grid: Ingredients & Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Ingredients with checklist */}
          <div>
            <h3
              className={`text-xs font-bold uppercase tracking-widest border-b pb-2 mb-4 flex justify-between items-center ${
                isDark
                  ? "text-[#60a5fa] border-[#1e3a8a]"
                  : "text-[#001255] border-[#001255]"
              }`}
            >
              <span>INGREDIENTS</span>
            </h3>

            <ul className="space-y-2 text-xs md:text-sm">
              {recipe.ingredients.map((ing, idx) => {
                const isChecked = checkedIngredients[idx];
                return (
                  <li
                    key={idx}
                    onClick={() => toggleIngredient(idx)}
                    className={`cursor-pointer p-1.5 border-b flex items-start gap-2.5 transition-none ${
                      isDark
                        ? "border-[#1e3a8a]/40 hover:bg-[#1e3a8a]/20"
                        : "border-[#001255]/20 hover:bg-[#e5e2dc]"
                    } ${isChecked ? "line-through opacity-40" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={!!isChecked}
                      onChange={() => {}}
                      className="mt-0.5 accent-[#001255]"
                    />
                    <span>{ing}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Instructions with step counter */}
          <div>
            <h3
              className={`text-xs font-bold uppercase tracking-widest border-b pb-2 mb-4 flex justify-between items-center ${
                isDark
                  ? "text-[#60a5fa] border-[#1e3a8a]"
                  : "text-[#001255] border-[#001255]"
              }`}
            >
              <span>INSTRUCTIONS</span>
            </h3>

            <ol className="space-y-3 text-xs md:text-sm">
              {recipe.instructions.map((step, idx) => {
                const isDone = completedSteps[idx];
                return (
                  <li
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`cursor-pointer p-2 border-b flex items-start gap-2.5 transition-none ${
                      isDark
                        ? "border-[#1e3a8a]/40 hover:bg-[#1e3a8a]/20"
                        : "border-[#001255]/20 hover:bg-[#e5e2dc]"
                    } ${isDone ? "line-through opacity-40" : ""}`}
                  >
                    <span
                      className={`font-bold shrink-0 text-xs px-1.5 py-0.5 border ${
                        isDone
                          ? "border-gray-500 text-gray-500"
                          : isDark
                            ? "border-[#3b82f6] text-[#60a5fa]"
                            : "border-[#001255] text-[#001255]"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* Warning Callout */}
        {recipe.warningNote && (
          <div
            className={`p-3 border-2 font-mono text-xs mb-6 flex items-start gap-2 ${
              isDark
                ? "border-red-500 text-red-400 bg-red-950/20"
                : "border-[#ba1a1a] text-[#ba1a1a] bg-red-50"
            }`}
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-bold uppercase tracking-wider">
              {recipe.warningNote}
            </span>
          </div>
        )}

        {/* Card Footer */}
        <div className="pt-4 border-t border-current flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-[11px] opacity-70">
            {recipe.isUserUpload && recipe.createdByDisplayName && (
              <span>Shared by {recipe.createdByDisplayName} on </span>
            )}
            {new Date(recipe.createdAt).toLocaleDateString()}
          </div>

          <div className="flex items-center gap-3">
            {recipe.isOwnRecipe && onDeleteRecipe && (
              <button
                onClick={() => {
                  if (confirm("Delete this recipe data permanently?")) {
                    onDeleteRecipe(recipe.id);
                    onClose();
                  }
                }}
                className="text-red-500 hover:underline uppercase text-xs"
              >
                DELETE RECIPE
              </button>
            )}

            <button
              onClick={onClose}
              className={`px-4 py-2 font-bold uppercase transition-none ${
                isDark
                  ? "bg-[#1e3a8a] text-white hover:bg-[#2563eb]"
                  : "bg-[#001255] text-white hover:bg-[#1a2a6c]"
              }`}
            >
              DONE / CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
