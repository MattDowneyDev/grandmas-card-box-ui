import React, { useState } from "react";
import { Recipe, ThemeMode } from "../types";
import { Search as SearchIcon, X } from "lucide-react";
import { RecipeCard } from "./RecipeCard";

interface SearchViewProps {
  recipes: Recipe[];
  theme: ThemeMode;
  onSelectRecipe: (recipe: Recipe) => void;
  onToggleMyBox: (recipeId: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  recipes,
  theme,
  onSelectRecipe,
  onToggleMyBox,
}) => {
  const isDark = theme === "dark";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("ALL");
  const [maxCookTime, setMaxCookTime] = useState<number>(120);
  const [maxIngredients, setMaxIngredients] = useState<number>(10);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Common quick ingredient buttons
  const quickIngredients = [
    "Beef",
    "Chicken",
    "Egg",
    "Tomato",
    "Pasta",
    "Garlic",
    "Rice",
    "Salmon",
  ];

  const filtered = recipes.filter((r) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      r.title.toLowerCase().includes(query) ||
      r.id.toLowerCase().includes(query) ||
      r.ingredients.some((ing) => ing.toLowerCase().includes(query)) ||
      r.instructions.some((step) => step.toLowerCase().includes(query));

    const matchesTag =
      selectedTag === "ALL" ||
      r.tag.toLowerCase() === selectedTag.toLowerCase();
    const matchesCookTime = r.cookTimeMin <= maxCookTime;
    const matchesIngredients = r.ingredients.length <= maxIngredients;

    return matchesQuery && matchesTag && matchesCookTime && matchesIngredients;
  });

  const handleCopyQuickData = (e: React.MouseEvent, recipe: Recipe) => {
    e.stopPropagation();
    const textData = `=== ${recipe.title} (ID: ${recipe.id}) ===\nCOOK TIME: ${recipe.cookTimeMin} MIN | TAG: ${recipe.tag}\n\nINGREDIENTS:\n${recipe.ingredients.map((i) => `- ${i}`).join("\n")}\n\nINSTRUCTIONS:\n${recipe.instructions.map((step, idx) => `${idx + 1}. ${step}`).join("\n")}\n\nNO BACKSTORY. JUST DATA.`;
    navigator.clipboard.writeText(textData);
    setCopiedId(recipe.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="mb-8 border-b-2 pb-4 border-current">
        <h1
          id="search-header-title"
          className={`text-3xl sm:text-4xl font-black font-heading tracking-tight uppercase ${
            isDark ? "text-[#3b82f6]" : "text-[#001255]"
          }`}
        >
          INDEX CARD RECIPES (WITHOUT THE BACKSTORY)
        </h1>
        <p
          className={`text-xs font-mono tracking-widest mt-1 uppercase ${isDark ? "text-[#9ca3af]" : "text-[#5f5e5a]"}`}
        >
          SKIP THE 3,000 WORD ESSAY. JUST FIND THE FOOD.
        </p>
      </div>

      {/* Main Search Bar */}
      <div
        className={`p-4 md:p-6 mb-8 border ${
          isDark
            ? "bg-[#050b14] border-[#1e3a8a]"
            : "bg-[#fcf9f8] border-[#001255] brutalist-shadow"
        }`}
      >
        <div className="relative flex items-center mb-4">
          <SearchIcon
            className={`absolute left-3 w-5 h-5 ${isDark ? "text-[#60a5fa]" : "text-[#001255]"}`}
          />
          <input
            id="search-query-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="TYPE INGREDIENT, RECIPE NAME, OR ID (e.g. SOTTO, BEEF, 042)..."
            className={`w-full pl-11 pr-10 py-3 font-mono text-sm md:text-base border uppercase tracking-wider focus:ring-0 ${
              isDark
                ? "bg-[#030712] border-[#1e3a8a] text-white placeholder-gray-600 focus:border-[#3b82f6]"
                : "bg-white border-[#001255] text-[#001255] placeholder-[#5f5e5a]/60 focus:border-[#001255]"
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 p-1 text-gray-400 hover:text-current"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Keyword Tokens */}
        <div className="flex flex-wrap items-center gap-2 mb-4 font-mono text-xs">
          <span className="opacity-70 text-[11px]">QUICK INDEX:</span>
          {quickIngredients.map((ing) => (
            <button
              key={ing}
              onClick={() => setSearchQuery(ing)}
              className={`px-2.5 py-1 border transition-none uppercase ${
                searchQuery.toLowerCase() === ing.toLowerCase()
                  ? isDark
                    ? "bg-[#1e3a8a] text-white border-[#3b82f6]"
                    : "bg-[#001255] text-white border-[#001255]"
                  : isDark
                    ? "border-[#1e3a8a] text-[#93c5fd] hover:bg-[#111827]"
                    : "border-[#001255] text-[#001255] hover:bg-[#e5e2dc]"
              }`}
            >
              {ing}
            </button>
          ))}
        </div>

        {/* Parameter Sliders / Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-current/20 font-mono text-xs">
          <div>
            <label
              className={`block font-bold uppercase mb-1.5 ${isDark ? "text-[#93c5fd]" : "text-[#001255]"}`}
            >
              CATEGORY
            </label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className={`w-full p-2 border font-mono text-xs uppercase ${
                isDark
                  ? "bg-[#030712] border-[#1e3a8a] text-white"
                  : "bg-white border-[#001255] text-[#001255]"
              }`}
            >
              <option value="ALL">ALL TAGS</option>
              <option value="Dinner">DINNER</option>
              <option value="Quick Fix">QUICK FIX</option>
              <option value="Lunch">LUNCH</option>
              <option value="Late Night">LATE NIGHT</option>
              <option value="Breakfast">BREAKFAST</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <span
                className={`font-bold uppercase ${isDark ? "text-[#93c5fd]" : "text-[#001255]"}`}
              >
                MAX COOK TIME
              </span>
              <span className="font-bold">{maxCookTime} MIN</span>
            </div>
            <input
              type="range"
              min={5}
              max={60}
              step={5}
              value={maxCookTime}
              onChange={(e) => setMaxCookTime(parseInt(e.target.value))}
              className="w-full accent-[#001255]"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <span
                className={`font-bold uppercase ${isDark ? "text-[#93c5fd]" : "text-[#001255]"}`}
              >
                MAX INGREDIENTS
              </span>
              <span className="font-bold">{maxIngredients} ITEMS</span>
            </div>
            <input
              type="range"
              min={2}
              max={10}
              value={maxIngredients}
              onChange={(e) => setMaxIngredients(parseInt(e.target.value))}
              className="w-full accent-[#001255]"
            />
          </div>
        </div>
      </div>

      {/* Results Banner */}
      <div className="flex items-center justify-between font-mono text-xs uppercase mb-4 tracking-widest opacity-80">
        <span>MATCHING DATA RECORDS: {filtered.length}</span>
        {(searchQuery ||
          selectedTag !== "ALL" ||
          maxCookTime < 120 ||
          maxIngredients < 10) && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedTag("ALL");
              setMaxCookTime(120);
              setMaxIngredients(10);
            }}
            className="text-red-500 hover:underline"
          >
            RESET QUERY
          </button>
        )}
      </div>

      {/* Results List / Grid */}
      {filtered.length === 0 ? (
        <div
          className={`p-12 text-center border-2 border-dashed ${
            isDark
              ? "border-[#1e3a8a] text-gray-400"
              : "border-[#001255] text-[#5f5e5a]"
          }`}
        >
          <div className="text-sm font-mono uppercase mb-2 font-bold">
            NO DATA MATCHED YOUR EXACT QUERY.
          </div>
          <p className="text-xs font-mono opacity-80">
            Try relaxing your cook time or ingredient filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {filtered.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              theme={theme}
              copiedId={copiedId}
              onSelectRecipe={onSelectRecipe}
              onToggleMyBox={onToggleMyBox}
              onCopyQuickData={handleCopyQuickData}
            />
          ))}
        </div>
      )}
    </div>
  );
};
