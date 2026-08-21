import React, { useEffect, useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { Recipe, ThemeMode } from "../types";
import { RecipeCard } from "./RecipeCard";
import { RECIPE_CATEGORIES } from "../data/categories";

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
  const maxAvailableTime = Math.max(
    15,
    Math.ceil(
      Math.max(
        0,
        ...recipes.map(
          (recipe) =>
            recipe.totalTimeMin ??
            (recipe.prepTimeMin || 0) + recipe.cookTimeMin,
        ),
      ) / 15,
    ) * 15,
  );
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("ALL");
  const [maxTime, setMaxTime] = useState(maxAvailableTime);
  const [maxIngredients, setMaxIngredients] = useState(10);
  const [sortOrder, setSortOrder] = useState<"random" | "popular" | "newest">(
    "random",
  );
  useEffect(() => {
    setMaxTime(maxAvailableTime);
  }, [maxAvailableTime]);
  const filteredRecipes = recipes.filter((recipe) => {
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
  const filtered = [...filteredRecipes].sort((left, right) => {
    if (sortOrder === "popular") {
      return (right.favoriteCount || 0) - (left.favoriteCount || 0);
    }
    if (sortOrder === "newest") {
      return (
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      );
    }
    return 0;
  });

  const clear = () => {
    setQuery("");
    setTag("ALL");
    setMaxTime(maxAvailableTime);
    setMaxIngredients(10);
    setSortOrder("random");
  };
  const hasActiveFilters =
    query || tag !== "ALL" || maxTime < maxAvailableTime || maxIngredients < 10;

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
            just needed an index card.
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
              {RECIPE_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Sort by
            <select
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value as typeof sortOrder)
              }
            >
              <option value="random">Random</option>
              <option value="popular">Most popular</option>
              <option value="newest">Newest</option>
            </select>
          </label>
          <label>
            Max time <output>{maxTime} min</output>
            <input
              type="range"
              min="15"
              max={maxAvailableTime}
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

          <button
            className={`filter-reset ${hasActiveFilters ? "" : "is-hidden"}`}
            onClick={clear}
            tabIndex={hasActiveFilters ? 0 : -1}
            aria-hidden={!hasActiveFilters}
          >
            Reset filters
          </button>
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="modern-empty">
          <h3>Nothing matched that search</h3>
          <p>Try a broader ingredient, category, or time range.</p>

          <button className="modern-button secondary" onClick={clear}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="modern-recipe-grid">
          {filtered.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              theme={theme}
              onSelectRecipe={onSelectRecipe}
              onToggleMyBox={onToggleMyBox}
            />
          ))}
        </div>
      )}
    </div>
  );
};
