import React from "react";
import { Recipe, ThemeMode } from "../types";
import { Bookmark, BookmarkCheck, Clock, Utensils } from "lucide-react";

interface RecipeCardProps {
  recipe: Recipe;
  theme: ThemeMode;
  onSelectRecipe: (recipe: Recipe) => void;
  onToggleMyBox: (recipeId: string) => void;
  cardId?: string;
  toggleButtonId?: string;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  theme,
  onSelectRecipe,
  onToggleMyBox,
  cardId,
  toggleButtonId,
}) => {
  const isDark = theme === "dark";
  const isSaved = recipe.inMyBox;

  return (
    <div
      id={cardId}
      onClick={() => onSelectRecipe(recipe)}
      className={`cursor-pointer transition-all duration-300 flex flex-col rounded-3xl border shadow-lg shadow-[#573a23]/5 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#573a23]/15 ${
        isDark
          ? "bg-[#050b14] border-[#5f503b] hover:border-[#8d7548] text-[#dde1ff]"
          : "bg-[#fffaf2] border-[#eadfce] hover:bg-white text-[#332c24]"
      } p-5 min-h-[360px] overflow-hidden group`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3
            className={`text-2xl font-bold font-heading leading-tight line-clamp-2 ${
              isDark ? "text-[#3b82f6]" : "text-[#001255]"
            }`}
          >
            {recipe.title}
          </h3>

          <div className="flex items-center gap-1 shrink-0">
            <button
              id={toggleButtonId}
              onClick={(event) => {
                event.stopPropagation();
                onToggleMyBox(recipe.id);
              }}
              className={`p-2 rounded-full transition ${
                isSaved
                  ? isDark
                    ? "bg-[#6f3f27] text-white border-[#6f3f27]"
                    : "bg-[#6f3f27] text-white border-[#6f3f27]"
                  : isDark
                    ? "border-[#5f503b] text-[#cfc3ad] hover:text-white"
                    : "border-[#eadfce] text-[#766957] hover:text-[#6f3f27]"
              }`}
              title={isSaved ? "In your box" : "Add to your box"}
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {recipe.imageUrl && (
          <div className="mb-4 overflow-hidden border border-current/20 bg-black/10 aspect-video relative">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute top-1 right-1 bg-black/70 text-white text-[10px] font-mono px-1.5 py-0.5">
              {recipe.tag}
            </div>
          </div>
        )}

        <div
          className={`space-y-1.5 font-mono text-xs mb-4 ${isDark ? "text-[#cfc3ad]" : "text-[#766957]"}`}
        >
          <div className="flex items-center gap-2">
            <Utensils className="w-3.5 h-3.5 opacity-70 shrink-0" />
            <span>{recipe.ingredients.length} ingredients</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 opacity-70 shrink-0" />
            <span>
              {recipe.prepTimeMin || 0} min prep / {recipe.cookTimeMin} min cook
              /{" "}
              {recipe.totalTimeMin ??
                (recipe.prepTimeMin || 0) + recipe.cookTimeMin}{" "}
              min total
            </span>
          </div>
          <div className="text-[11px] uppercase tracking-wider font-semibold opacity-90">
            Tag: {recipe.tag}
          </div>
        </div>

        <div
          className={`text-sm leading-relaxed border-t pt-3 mb-3 line-clamp-2 ${isDark ? "border-[#5f503b] text-[#cfc3ad]" : "border-[#eadfce] text-[#766957]"}`}
        >
          {recipe.ingredients.slice(0, 3).join(", ")}
          {recipe.ingredients.length > 3 && "..."}
        </div>
      </div>
    </div>
  );
};
