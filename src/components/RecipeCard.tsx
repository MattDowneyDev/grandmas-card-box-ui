import React from "react";
import { Recipe, ThemeMode } from "../types";
import {
  Bookmark,
  BookmarkCheck,
  Check,
  Clock,
  Eye,
  Share2,
  Utensils,
} from "lucide-react";

interface RecipeCardProps {
  recipe: Recipe;
  theme: ThemeMode;
  copiedId: string | null;
  onSelectRecipe: (recipe: Recipe) => void;
  onToggleMyBox: (recipeId: string) => void;
  onCopyQuickData: (event: React.MouseEvent, recipe: Recipe) => void;
  cardId?: string;
  toggleButtonId?: string;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  theme,
  copiedId,
  onSelectRecipe,
  onToggleMyBox,
  onCopyQuickData,
  cardId,
  toggleButtonId,
}) => {
  const isDark = theme === "dark";
  const isSaved = recipe.inMyBox;

  return (
    <div
      id={cardId}
      onClick={() => onSelectRecipe(recipe)}
      className={`cursor-pointer transition-all duration-150 flex flex-col justify-between border ${
        isDark
          ? "bg-[#050b14] border-[#1e3a8a] hover:border-[#3b82f6] text-[#dde1ff]"
          : "bg-[#fcf9f8] border-[#001255] hover:bg-white text-[#1b1c1c] brutalist-shadow"
      } p-5 min-h-[380px] group`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3
            className={`text-xl font-bold font-heading uppercase tracking-tight line-clamp-2 ${
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
              className={`p-1.5 transition-none border ${
                isSaved
                  ? isDark
                    ? "bg-[#1e3a8a] text-white border-[#3b82f6]"
                    : "bg-[#001255] text-white border-[#001255]"
                  : isDark
                    ? "border-[#1e3a8a] text-[#9ca3af] hover:text-white"
                    : "border-[#001255] text-[#5f5e5a] hover:text-[#001255]"
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
          className={`space-y-1.5 font-mono text-xs mb-4 ${isDark ? "text-[#93c5fd]" : "text-[#5f5e5a]"}`}
        >
          <div className="flex items-center gap-2">
            <Utensils className="w-3.5 h-3.5 opacity-70 shrink-0" />
            <span>{recipe.ingredients.length} ingredients</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 opacity-70 shrink-0" />
            <span>{recipe.cookTimeMin} min cook time</span>
          </div>
          <div className="text-[11px] uppercase tracking-wider font-semibold opacity-90">
            Tag: {recipe.tag}
          </div>
        </div>

        <div
          className={`text-xs font-mono border-t pt-2.5 mb-3 line-clamp-2 ${isDark ? "border-[#1e3a8a]/60 text-gray-400" : "border-[#001255]/20 text-gray-600"}`}
        >
          {recipe.ingredients.slice(0, 3).join(", ")}
          {recipe.ingredients.length > 3 && "..."}
        </div>
      </div>

      <div
        className={`pt-3 border-t flex items-center justify-between font-mono text-xs ${isDark ? "border-[#1e3a8a]" : "border-[#001255]"}`}
      >
        <span className="font-bold tracking-widest">ID: {recipe.id}</span>

        <div className="flex items-center gap-2">
          <button
            onClick={(event) => onCopyQuickData(event, recipe)}
            className={`px-2 py-1 text-[11px] border transition-none flex items-center gap-1 ${isDark ? "border-[#1e3a8a] text-[#93c5fd] hover:bg-[#1e3a8a] hover:text-white" : "border-[#001255] text-[#001255] hover:bg-[#001255] hover:text-white"}`}
            title="Copy zero-backstory text data"
          >
            {copiedId === recipe.id ? (
              <>
                <Check className="w-3 h-3 text-green-500" />
                <span>COPIED</span>
              </>
            ) : (
              <>
                <Share2 className="w-3 h-3" />
                <span>DATA</span>
              </>
            )}
          </button>

          <button
            onClick={(event) => {
              event.stopPropagation();
              onSelectRecipe(recipe);
            }}
            className={`px-2 py-1 text-[11px] font-bold border transition-none flex items-center gap-1 ${isDark ? "bg-[#1e3a8a] text-white border-[#3b82f6] hover:bg-[#2563eb]" : "bg-[#001255] text-white border-[#001255] hover:bg-[#1a2a6c]"}`}
          >
            <Eye className="w-3 h-3" />
            <span>VIEW</span>
          </button>
        </div>
      </div>
    </div>
  );
};
