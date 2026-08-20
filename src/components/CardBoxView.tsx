import React, { useState } from "react";
import { Recipe, FilterCategory, ThemeMode } from "../types";
import { Search, Plus, Bookmark } from "lucide-react";
import { RecipeCard } from "./RecipeCard";

interface CardBoxViewProps {
  recipes: Recipe[];
  theme: ThemeMode;
  onSelectRecipe: (recipe: Recipe) => void;
  onToggleMyBox: (recipeId: string) => void;
  onNavigateToSearch: () => void;
  onNavigateToUpload: () => void;
}

export const CardBoxView: React.FC<CardBoxViewProps> = ({
  recipes,
  theme,
  onSelectRecipe,
  onToggleMyBox,
  onNavigateToSearch,
  onNavigateToUpload,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isDark = theme === "dark";

  // Filter recipes according to active tab
  const filteredRecipes = recipes.filter((r) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "MY_UPLOADS") return r.isUserUpload;
    if (activeFilter === "QUICK_FIXES")
      return r.ingredients.length <= 4 || r.cookTimeMin <= 15;
    if (activeFilter === "SAVED") return r.inMyBox;
    return true;
  });

  const handleCopyQuickData = (e: React.MouseEvent, recipe: Recipe) => {
    e.stopPropagation();
    const textData = `=== ${recipe.title} (ID: ${recipe.id}) ===\nCOOK TIME: ${recipe.cookTimeMin} MIN | TAG: ${recipe.tag}\n\nINGREDIENTS:\n${recipe.ingredients.map((i) => `- ${i}`).join("\n")}\n\nINSTRUCTIONS:\n${recipe.instructions.map((step, idx) => `${idx + 1}. ${step}`).join("\n")}\n\nNO BACKSTORY. JUST DATA.`;
    navigator.clipboard.writeText(textData);
    setCopiedId(recipe.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-6">
      {/* Top Header & Title */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 pb-4 border-current">
          <div>
            <h1
              id="card-box-main-title"
              className={`text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight uppercase ${
                isDark ? "text-[#3b82f6]" : "text-[#001255]"
              }`}
            >
              MY CARD BOX
            </h1>
            <div
              className={`text-xs font-mono tracking-widest mt-2 uppercase ${
                isDark ? "text-[#9ca3af]" : "text-[#5f5e5a]"
              }`}
            >
              INDEX: {recipes.length} ITEMS{" "}
              {activeFilter !== "ALL" &&
                `(FILTERED: ${filteredRecipes.length})`}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              id="filter-all-cards"
              onClick={() => setActiveFilter("ALL")}
              className={`px-3 py-1.5 font-bold uppercase transition-none tracking-wider border ${
                activeFilter === "ALL"
                  ? isDark
                    ? "bg-[#1e3a8a] text-white border-[#3b82f6]"
                    : "bg-[#001255] text-white border-[#001255]"
                  : isDark
                    ? "border-[#1e3a8a] text-[#9ca3af] hover:bg-[#111827] hover:text-white"
                    : "border-[#001255] text-[#001255] hover:bg-[#e5e2dc]"
              }`}
            >
              ALL CARDS
            </button>

            <button
              id="filter-my-uploads"
              onClick={() => setActiveFilter("MY_UPLOADS")}
              className={`px-3 py-1.5 font-bold uppercase transition-none tracking-wider border ${
                activeFilter === "MY_UPLOADS"
                  ? isDark
                    ? "bg-[#1e3a8a] text-white border-[#3b82f6]"
                    : "bg-[#001255] text-white border-[#001255]"
                  : isDark
                    ? "border-[#1e3a8a] text-[#9ca3af] hover:bg-[#111827] hover:text-white"
                    : "border-[#001255] text-[#001255] hover:bg-[#e5e2dc]"
              }`}
            >
              MY UPLOADS
            </button>

            <button
              id="filter-quick-fixes"
              onClick={() => setActiveFilter("QUICK_FIXES")}
              className={`px-3 py-1.5 font-bold uppercase transition-none tracking-wider border ${
                activeFilter === "QUICK_FIXES"
                  ? isDark
                    ? "bg-[#1e3a8a] text-white border-[#3b82f6]"
                    : "bg-[#001255] text-white border-[#001255]"
                  : isDark
                    ? "border-[#1e3a8a] text-[#9ca3af] hover:bg-[#111827] hover:text-white"
                    : "border-[#001255] text-[#001255] hover:bg-[#e5e2dc]"
              }`}
            >
              QUICK FIXES (&lt; 5)
            </button>

            <button
              id="filter-saved-box"
              onClick={() => setActiveFilter("SAVED")}
              className={`px-3 py-1.5 font-bold uppercase transition-none tracking-wider border ${
                activeFilter === "SAVED"
                  ? isDark
                    ? "bg-[#1e3a8a] text-white border-[#3b82f6]"
                    : "bg-[#001255] text-white border-[#001255]"
                  : isDark
                    ? "border-[#1e3a8a] text-[#9ca3af] hover:bg-[#111827] hover:text-white"
                    : "border-[#001255] text-[#001255] hover:bg-[#e5e2dc]"
              }`}
            >
              IN MY BOX ({recipes.filter((r) => r.inMyBox).length})
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            cardId={`recipe-card-${recipe.id}`}
            toggleButtonId={`btn-toggle-box-${recipe.id}`}
            recipe={recipe}
            theme={theme}
            copiedId={copiedId}
            onSelectRecipe={onSelectRecipe}
            onToggleMyBox={onToggleMyBox}
            onCopyQuickData={handleCopyQuickData}
          />
        ))}

        {/* Empty Box Card Prompt (As seen in Image 5) */}
        <div
          id="empty-box-card-cta"
          className={`flex flex-col items-center justify-center text-center p-8 min-h-[380px] border-2 border-dashed ${
            isDark
              ? "bg-[#030712] border-[#1e3a8a] text-white"
              : "bg-white border-[#001255] text-[#001255] brutalist-shadow"
          }`}
        >
          <div
            className={`w-16 h-16 mb-4 flex items-center justify-center border-2 ${
              isDark
                ? "border-[#3b82f6] text-[#3b82f6]"
                : "border-[#001255] text-[#001255]"
            }`}
          >
            <Bookmark className="w-8 h-8 opacity-80" />
          </div>

          <h4 className="text-base font-bold font-mono tracking-widest uppercase mb-2 max-w-[200px] leading-snug">
            YOUR BOX IS EMPTY. GO FIND SOME DATA.
          </h4>

          <div className="flex flex-col gap-3 w-full max-w-[180px] mt-4">
            <button
              id="btn-empty-card-search"
              onClick={onNavigateToSearch}
              className={`w-full py-2.5 px-4 font-mono text-xs font-bold uppercase transition-none flex items-center justify-center gap-2 ${
                isDark
                  ? "bg-[#1e3a8a] text-white hover:bg-[#2563eb]"
                  : "bg-[#001255] text-white hover:bg-[#1a2a6c]"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>SEARCH</span>
            </button>

            <button
              id="btn-empty-card-upload"
              onClick={onNavigateToUpload}
              className={`w-full py-2 px-3 font-mono text-xs font-bold uppercase border transition-none flex items-center justify-center gap-1.5 ${
                isDark
                  ? "border-[#1e3a8a] text-[#93c5fd] hover:bg-[#111827]"
                  : "border-[#001255] text-[#001255] hover:bg-[#f0eded]"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>DONATE RECIPE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
