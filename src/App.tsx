/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Recipe, NavigationTab, ThemeMode } from "./types";
import { INITIAL_RECIPES } from "./data/initialRecipes";
import { Sidebar } from "./components/Sidebar";
import { CardBoxView } from "./components/CardBoxView";
import { UploadView } from "./components/UploadView";
import { SearchView } from "./components/SearchView";
import { RecipeModal } from "./components/RecipeModal";
import { FAQModal } from "./components/FAQModal";
import { LoginModal } from "./components/LoginModal";
import { Footer } from "./components/Footer";

const ROUTE_PATHS: Record<"my-box" | "search" | "upload", string> = {
  "my-box": "/my-box",
  search: "/search",
  upload: "/upload",
};

const getTabFromPath = (): "my-box" | "search" | "upload" => {
  if (window.location.pathname === ROUTE_PATHS.upload) return "upload";
  if (window.location.pathname === ROUTE_PATHS["my-box"]) return "my-box";
  return "search";
};

export default function App() {
  // Load recipes from localStorage or fallback to INITIAL_RECIPES
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem("cardbox_recipes");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to parse local storage recipes", e);
    }
    return INITIAL_RECIPES;
  });

  // Theme mode: default to 'light' (matches Image 7 paper archive) or 'dark' (Image 5 terminal)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const savedTheme = localStorage.getItem("cardbox_theme");
      if (savedTheme === "dark" || savedTheme === "light") {
        return savedTheme;
      }
    } catch (e) {}
    return "dark"; // Starting with dark matches the primary Card Box screenshot (Image 5)
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<NavigationTab>(getTabFromPath);

  const handleTabChange = (tab: NavigationTab) => {
    if (tab in ROUTE_PATHS) {
      window.history.pushState(
        {},
        "",
        ROUTE_PATHS[tab as "my-box" | "search" | "upload"],
      );
    }
    setActiveTab(tab);
  };

  useEffect(() => {
    const handlePopState = () => setActiveTab(getTabFromPath());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Currently inspected recipe for detail modal
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Modals
  const [faqModalType, setFaqModalType] = useState<
    "faq" | "privacy" | "terms" | null
  >(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // User state
  const [userHandle, setUserHandle] = useState<string>(() => {
    return localStorage.getItem("cardbox_user") || "CHEF_001";
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("cardbox_auth") === "true";
  });

  // Persist recipes
  useEffect(() => {
    try {
      localStorage.setItem("cardbox_recipes", JSON.stringify(recipes));
    } catch (e) {
      console.error("Failed to save recipes to localStorage", e);
    }
  }, [recipes]);

  // Persist theme & toggle dark class on document element
  useEffect(() => {
    try {
      localStorage.setItem("cardbox_theme", theme);
    } catch (e) {}

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#030712";
      document.body.style.color = "#dde1ff";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "#dcd9d9";
      document.body.style.color = "#1b1c1c";
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Toggle recipe bookmark in My Box
  const handleToggleMyBox = (recipeId: string) => {
    setRecipes((prev) =>
      prev.map((r) => {
        if (r.id === recipeId) {
          const updated = { ...r, inMyBox: !r.inMyBox };
          if (selectedRecipe?.id === recipeId) {
            setSelectedRecipe(updated);
          }
          return updated;
        }
        return r;
      }),
    );
  };

  // Save newly donated recipe
  const handleSaveRecipe = (
    newRecipeData: Omit<Recipe, "id" | "createdAt" | "isUserUpload">,
  ) => {
    const nextId = (recipes.length + 1).toString().padStart(3, "0");
    const newRecipe: Recipe = {
      ...newRecipeData,
      id: nextId,
      createdAt: new Date().toISOString(),
      isUserUpload: true,
      inMyBox: true,
    };

    setRecipes((prev) => [newRecipe, ...prev]);
    handleTabChange("my-box");
  };

  // Delete user-created recipe
  const handleDeleteRecipe = (recipeId: string) => {
    setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
    if (selectedRecipe?.id === recipeId) {
      setSelectedRecipe(null);
    }
  };

  const handleLogin = (handle: string) => {
    setUserHandle(handle);
    setIsLoggedIn(true);
    localStorage.setItem("cardbox_user", handle);
    localStorage.setItem("cardbox_auth", "true");
  };

  const handleLogout = () => {
    setUserHandle("GUEST_CHEF");
    setIsLoggedIn(false);
    localStorage.removeItem("cardbox_auth");
  };

  const myBoxCount = recipes.filter((r) => r.inMyBox).length;

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-150 ${
        theme === "dark"
          ? "bg-[#030712] text-[#dde1ff]"
          : "bg-[#dcd9d9] text-[#1b1c1c]"
      }`}
    >
      {/* Navigation Sidebar & Header */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        myBoxCount={myBoxCount}
        theme={theme}
        toggleTheme={toggleTheme}
        isLoggedIn={isLoggedIn}
        userHandle={userHandle}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenFAQ={() => setFaqModalType("faq")}
      />

      {/* Main Content Area (Offset by desktop sidebar md:ml-64) */}
      <main className="flex-1 md:ml-64 flex flex-col">
        <div className="flex-1">
          {activeTab === "my-box" && (
            <CardBoxView
              recipes={recipes}
              theme={theme}
              onSelectRecipe={(recipe) => setSelectedRecipe(recipe)}
              onToggleMyBox={handleToggleMyBox}
              onNavigateToSearch={() => handleTabChange("search")}
              onNavigateToUpload={() => handleTabChange("upload")}
            />
          )}

          {activeTab === "upload" && (
            <UploadView
              theme={theme}
              onSaveRecipe={handleSaveRecipe}
              onViewRecipe={(recipe) => setSelectedRecipe(recipe)}
            />
          )}

          {activeTab === "search" && (
            <SearchView
              recipes={recipes}
              theme={theme}
              onSelectRecipe={(recipe) => setSelectedRecipe(recipe)}
              onToggleMyBox={handleToggleMyBox}
            />
          )}
        </div>

        {/* Footer */}
        <Footer
          theme={theme}
          onOpenPrivacy={() => setFaqModalType("privacy")}
          onOpenTerms={() => setFaqModalType("terms")}
          onOpenFAQ={() => setFaqModalType("faq")}
        />
      </main>

      {/* Recipe Details 3x5 Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          theme={theme}
          onClose={() => setSelectedRecipe(null)}
          onToggleMyBox={handleToggleMyBox}
          onDeleteRecipe={handleDeleteRecipe}
        />
      )}

      {/* FAQ, Privacy, Terms Modal */}
      {faqModalType && (
        <FAQModal
          type={faqModalType}
          theme={theme}
          onClose={() => setFaqModalType(null)}
        />
      )}

      {/* Direct Data Login Modal */}
      {isLoginOpen && (
        <LoginModal
          isOpen={isLoginOpen}
          theme={theme}
          userHandle={userHandle}
          isLoggedIn={isLoggedIn}
          onClose={() => setIsLoginOpen(false)}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
