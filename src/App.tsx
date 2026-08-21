/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Recipe, NavigationTab, ThemeMode } from "./types";
import { INITIAL_RECIPES } from "./data/initialRecipes";
import {
  AuthSession,
  deleteAccount,
  getCurrentUser,
  login,
  signup,
} from "./api/auth";
import {
  createRecipe,
  deleteRecipe,
  getRecipes,
  setRecipeFavorite,
} from "./api/recipes";
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

  const [authToken, setAuthToken] = useState<string | null>(() =>
    localStorage.getItem("cardbox_token"),
  );

  useEffect(() => {
    if (!authToken) return;

    getCurrentUser(authToken)
      .then((user) => {
        setUserHandle(user.displayName.toUpperCase());
        setIsLoggedIn(true);
        localStorage.setItem("cardbox_user", user.displayName.toUpperCase());
      })
      .catch((error) => {
        console.error("Failed to validate API session", error);
        setAuthToken(null);
        setIsLoggedIn(false);
        localStorage.removeItem("cardbox_token");
        localStorage.removeItem("cardbox_auth");
      });
  }, [authToken]);

  useEffect(() => {
    getRecipes(authToken || undefined)
      .then(setRecipes)
      .catch((error) => {
        console.error("Failed to load recipes from API", error);
      });
  }, [authToken]);

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

  // Modals
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // User state
  const [userHandle, setUserHandle] = useState<string>(() => {
    return localStorage.getItem("cardbox_user") || "CHEF_001";
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return Boolean(localStorage.getItem("cardbox_token"));
  });

  const handleTabChange = (tab: NavigationTab) => {
    const requiresLogin = tab === "my-box" || tab === "upload";
    if (requiresLogin && (!isLoggedIn || !authToken)) {
      setIsLoginOpen(true);
      return;
    }

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

  useEffect(() => {
    const requiresLogin = activeTab === "my-box" || activeTab === "upload";
    if (requiresLogin && (!isLoggedIn || !authToken)) {
      window.history.replaceState({}, "", ROUTE_PATHS.search);
      setActiveTab("search");
      setIsLoginOpen(true);
    }
  }, [activeTab, authToken, isLoggedIn]);

  // Currently inspected recipe for detail modal
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Modals
  const [faqModalType, setFaqModalType] = useState<
    "faq" | "privacy" | "terms" | null
  >(null);

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
    if (!isLoggedIn || !authToken) {
      setIsLoginOpen(true);
      return;
    }

    const recipe = recipes.find((item) => item.id === recipeId);
    if (!recipe) return;

    const nextInMyBox = !recipe.inMyBox;
    setRecipeFavorite(recipeId, nextInMyBox, authToken || undefined)
      .then(() => {
        setRecipes((prev) =>
          prev.map((item) =>
            item.id === recipeId ? { ...item, inMyBox: nextInMyBox } : item,
          ),
        );
        setSelectedRecipe((current) =>
          current?.id === recipeId
            ? { ...current, inMyBox: nextInMyBox }
            : current,
        );
      })
      .catch((error) =>
        console.error("Failed to update recipe favorite", error),
      );
  };

  // Save newly donated recipe
  const handleSaveRecipe = async (
    newRecipeData: Omit<Recipe, "id" | "createdAt" | "isUserUpload">,
  ) => {
    if (!isLoggedIn || !authToken) {
      setIsLoginOpen(true);
      return;
    }

    createRecipe(newRecipeData, authToken || undefined)
      .then((newRecipe) => {
        setRecipes((prev) => [newRecipe, ...prev]);
        handleTabChange("my-box");
      })
      .catch((error) => console.error("Failed to create recipe", error));
  };

  // Delete user-created recipe
  const handleDeleteRecipe = (recipeId: string) => {
    if (!isLoggedIn || !authToken) return;

    deleteRecipe(recipeId, authToken)
      .then(() => {
        setRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId));
        if (selectedRecipe?.id === recipeId) {
          setSelectedRecipe(null);
        }
      })
      .catch((error) => console.error("Failed to delete recipe", error));
  };

  const handleLogin = async (session: AuthSession) => {
    setAuthToken(session.token);
    setUserHandle(session.displayName.toUpperCase());
    setIsLoggedIn(true);
    localStorage.setItem("cardbox_token", session.token);
    localStorage.setItem("cardbox_user", session.displayName.toUpperCase());
    localStorage.setItem("cardbox_auth", "true");
  };

  const handleLogout = () => {
    setUserHandle("GUEST_CHEF");
    setIsLoggedIn(false);
    setAuthToken(null);
    setSelectedRecipe(null);
    localStorage.removeItem("cardbox_token");
    localStorage.removeItem("cardbox_auth");
  };

  const handleDeleteAccount = async () => {
    if (!authToken) return;

    await deleteAccount(authToken);
    setRecipes(await getRecipes());
    handleLogout();
    handleTabChange("search");
  };

  const myBoxRecipes = recipes.filter(
    (recipe) => recipe.isUserUpload || recipe.inMyBox,
  );
  const myBoxCount = myBoxRecipes.length;

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
              recipes={myBoxRecipes}
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
          onDeleteRecipe={isLoggedIn ? handleDeleteRecipe : undefined}
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
          onLoginWithPassword={login}
          onSignup={signup}
          onDeleteAccount={handleDeleteAccount}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
