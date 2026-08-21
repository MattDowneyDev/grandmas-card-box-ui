import React, { useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { Recipe, ThemeMode } from "../types";
import { RecipeCard } from "./RecipeCard";

interface Props {
  recipes: Recipe[];
  theme: ThemeMode;
  onSelectRecipe: (recipe: Recipe) => void;
  onToggleMyBox: (recipeId: string) => void;
}

export const SearchView: React.FC<Props> = ({
  recipes,
  theme,
  onSelectRecipe,
  onToggleMyBox,
}) => {
  const dark = theme === "dark";
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("ALL");
  const [maxTime, setMaxTime] = useState(480);
  const [maxIngredients, setMaxIngredients] = useState(10);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const filtered = recipes.filter((recipe) => {
    const search = query.trim().toLowerCase();
    const matchesQuery =
      !search ||
      [
        recipe.title,
        recipe.id,
        ...recipe.ingredients,
        ...recipe.instructions,
      ].some((value) => value.toLowerCase().includes(search));
    const total =
      recipe.totalTimeMin ?? (recipe.prepTimeMin || 0) + recipe.cookTimeMin;
    return (
      matchesQuery &&
      (tag === "ALL" || recipe.tag.toLowerCase() === tag.toLowerCase()) &&
      total <= maxTime &&
      recipe.ingredients.length <= maxIngredients
    );
  });

  // ***** ADD THIS BACK IN LATER *****
  // const clear = () => {
  //   setQuery("");
  //   setTag("ALL");
  //   setMaxTime(480);
  //   setMaxIngredients(10);
  // };

  const copyRecipe = (event: React.MouseEvent, recipe: Recipe) => {
    event.stopPropagation();
    navigator.clipboard.writeText(
      `${recipe.title}\n\nINGREDIENTS\n${recipe.ingredients.join("\n")}\n\nINSTRUCTIONS\n${recipe.instructions.join("\n")}`,
    );
    setCopiedId(recipe.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="modern-page">
      <section className="modern-hero">
        <img
          src="/grandmascardboxhero.jpeg"
          alt="A recipe box in a warm kitchen"
        />
        <div className="modern-hero-overlay" />
        <div className="modern-hero-content">
          <h1>
            No backstories,
            <br />
            <em>just recipes.</em>
          </h1>
          <p>
            Grandma didn't need someone's life story to make a great meal. She
            just needed the ingredients.
          </p>
        </div>
      </section>

      <section className="modern-content-head">
        <div>
          <span className="eyebrow accent-eyebrow">The collection</span>
          <h2>What are you hungry for?</h2>
        </div>
        <span className="result-count">{filtered.length} recipes</span>
      </section>

      <section className={`modern-search-panel ${dark ? "is-dark" : ""}`}>
        <div className="modern-search-input">
          <SearchIcon className="h-5 w-5" />
          <input
            id="search-query-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search recipes, ingredients, or instructions"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="modern-filters">
          <label>
            Category
            <select
              value={tag}
              onChange={(event) => setTag(event.target.value)}
            >
              <option value="ALL">All categories</option>
              <option value="Dinner">Dinner</option>
              <option value="Quick Fix">Quick fix</option>
              <option value="Lunch">Lunch</option>
              <option value="Late Night">Late night</option>
              <option value="Breakfast">Breakfast</option>
            </select>
          </label>
          <label>
            Max time <output>{maxTime} min</output>
            <input
              type="range"
              min="15"
              max="480"
              step="15"
              value={maxTime}
              onChange={(event) => setMaxTime(Number(event.target.value))}
            />
          </label>
          <label>
            Ingredients <output>{maxIngredients} max</output>
            <input
              type="range"
              min="2"
              max="10"
              value={maxIngredients}
              onChange={(event) =>
                setMaxIngredients(Number(event.target.value))
              }
            />
          </label>

          {/* ***** ADD THIS BACK IN LATER ***** */}
          {/* {(query || tag !== "ALL" || maxTime < 480 || maxIngredients < 10) && (
            <button className="filter-reset" onClick={clear}>
              Reset filters
            </button>
          )} */}
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="modern-empty">
          <h3>Nothing matched that search</h3>
          <p>Try a broader ingredient, category, or time range.</p>

          {/* ***** ADD THIS BACK IN LATER ***** */}
          {/* <button className="modern-button secondary" onClick={clear}>
            Clear filters
          </button> */}
        </div>
      ) : (
        <div className="modern-recipe-grid">
          {filtered.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              theme={theme}
              copiedId={copiedId}
              onSelectRecipe={onSelectRecipe}
              onToggleMyBox={onToggleMyBox}
              onCopyQuickData={copyRecipe}
            />
          ))}
        </div>
      )}
    </div>
  );
};
