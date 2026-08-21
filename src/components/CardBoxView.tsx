import React, { useState } from "react";
import { Bookmark, Plus, Search } from "lucide-react";
import { FilterCategory, Recipe, ThemeMode } from "../types";
import { RecipeCard } from "./RecipeCard";

interface Props {
  recipes: Recipe[];
  theme: ThemeMode;
  onSelectRecipe: (recipe: Recipe) => void;
  onToggleMyBox: (id: string) => void;
  onNavigateToSearch: () => void;
  onNavigateToUpload: () => void;
}

export const CardBoxView: React.FC<Props> = ({
  recipes,
  theme,
  onSelectRecipe,
  onToggleMyBox,
  onNavigateToSearch,
  onNavigateToUpload,
}) => {
  const [filter, setFilter] = useState<FilterCategory>("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const filtered = recipes.filter(
    (recipe) =>
      filter === "ALL" ||
      (filter === "MY_UPLOADS" && recipe.isUserUpload) ||
      (filter === "QUICK_FIXES" &&
        (recipe.ingredients.length <= 4 || recipe.cookTimeMin <= 15)) ||
      (filter === "SAVED" && recipe.inMyBox),
  );
  const copyRecipe = (event: React.MouseEvent, recipe: Recipe) => {
    event.stopPropagation();
    navigator.clipboard.writeText(
      `${recipe.title}\n${recipe.ingredients.join("\n")}`,
    );
    setCopiedId(recipe.id);
    setTimeout(() => setCopiedId(null), 1800);
  };
  const filters: { id: FilterCategory; label: string }[] = [
    { id: "ALL", label: "Everything" },
    { id: "SAVED", label: "Favorites" },
    { id: "MY_UPLOADS", label: "My recipes" },
    { id: "QUICK_FIXES", label: "Quick fixes" },
  ];
  return (
    <div className="modern-page">
      <section className="modern-section-intro">
        <div>
          <span className="eyebrow accent-eyebrow">Your personal shelf</span>
          <h1>My card box</h1>
          <p>Recipes you want close at hand, whenever dinner calls.</p>
        </div>
        <div className="modern-stat">
          <strong>{recipes.length}</strong>
          <span>saved cards</span>
        </div>
      </section>
      <div className="modern-filter-row">
        {filters.map(({ id, label }) => (
          <button
            key={id}
            className={filter === id ? "active" : ""}
            onClick={() => setFilter(id)}
          >
            {label}
            <span>
              {id === "SAVED"
                ? recipes.filter((recipe) => recipe.inMyBox).length
                : id === "MY_UPLOADS"
                  ? recipes.filter((recipe) => recipe.isUserUpload).length
                  : id === "ALL"
                    ? recipes.length
                    : filtered.length}
            </span>
          </button>
        ))}
      </div>
      {filtered.length ? (
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
      ) : (
        <div className="modern-empty">
          <div className="empty-icon">
            <Bookmark />
          </div>
          <h3>Your box is waiting</h3>
          <p>
            Start building a collection of recipes you will actually make again.
          </p>
          <div className="empty-actions">
            <button className="modern-button" onClick={onNavigateToSearch}>
              <Search /> Explore recipes
            </button>
            <button
              className="modern-button secondary"
              onClick={onNavigateToUpload}
            >
              <Plus /> Add your own
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
