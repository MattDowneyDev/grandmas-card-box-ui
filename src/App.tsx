/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Recipe, NavigationTab, ThemeMode } from "./types";
import { INITIAL_RECIPES } from "./data/initialRecipes";
import {
  AuthSession,
  deleteAccount,
  getCurrentUser,
  login,
  requestPasswordReset,
  signup,
  updateAccount,
} from "./api/auth";
import {
  createRecipe,
  deleteRecipe,
  getRecipes,
  setRecipeFavorite,
} from "./api/recipes";
import { Header } from "./components/Header";
import { CardBoxView } from "./components/CardBoxView";
import { UploadView } from "./components/UploadView";
import { SearchView } from "./components/SearchView";
import { RecipeModal } from "./components/RecipeModal";
import { LoginModal } from "./components/LoginModal";
import { PasswordResetView } from "./components/PasswordResetView";
import { Footer } from "./components/Footer";

const HOME_PATH = "/";

const ROUTE_PATHS: Record<"my-box" | "upload", string> = {
  "my-box": "/my-box",
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
        setUserHandle(user.displayName);
        setIsLoggedIn(true);
        localStorage.setItem("cardbox_user", user.displayName);
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
    return "light";
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<NavigationTab>(getTabFromPath);

  // Modals
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // User state
  const [userHandle, setUserHandle] = useState<string>(() => {
    return localStorage.getItem("cardbox_user") || "Chef_001";
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

    if (tab === "my-box" || tab === "upload") {
      window.history.pushState({}, "", ROUTE_PATHS[tab]);
    }
    setActiveTab(tab);
  };

  useEffect(() => {
    const requiresLogin = activeTab === "my-box" || activeTab === "upload";
    if (requiresLogin && (!isLoggedIn || !authToken)) {
      window.history.replaceState({}, "", HOME_PATH);
      setActiveTab("search");
      setIsLoginOpen(true);
    }
  }, [activeTab, authToken, isLoggedIn]);

  // Currently inspected recipe for detail modal
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const recipeScrollPosition = useRef(0);

  const openRecipe = (recipe: Recipe) => {
    recipeScrollPosition.current = window.scrollY;
    setSelectedRecipe(recipe);
  };

  const closeRecipe = () => {
    setSelectedRecipe(null);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: recipeScrollPosition.current, behavior: "auto" });
    });
  };

  useEffect(() => {
    const handlePopState = () => {
      if (selectedRecipe) {
        setSelectedRecipe(null);
        window.history.replaceState({}, "", HOME_PATH);
        setActiveTab("search");
        window.requestAnimationFrame(() => {
          window.scrollTo({
            top: recipeScrollPosition.current,
            behavior: "auto",
          });
        });
        return;
      }

      setActiveTab(getTabFromPath());
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [selectedRecipe]);

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
      document.body.style.backgroundColor = "#2f2a24";
      document.body.style.color = "#f7f1e7";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "#f7f1e7";
      document.body.style.color = "#332c24";
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
    const newRecipe = await createRecipe(newRecipeData, authToken || undefined);
    setRecipes((prev) => [newRecipe, ...prev]);
    handleTabChange("my-box");
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
    setUserHandle(session.displayName);
    setIsLoggedIn(true);
    localStorage.setItem("cardbox_token", session.token);
    localStorage.setItem("cardbox_user", session.displayName);
    localStorage.setItem("cardbox_auth", "true");
  };

  const handleLogout = () => {
    setUserHandle("Guest chef");
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

  const handleUpdateAccount = async (updates: {
    displayName?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => {
    if (!authToken) return;
    const user = await updateAccount(authToken, updates);
    setUserHandle(user.displayName);
    localStorage.setItem("cardbox_user", user.displayName);
  };

  const myBoxRecipes = recipes.filter(
    (recipe) => recipe.isUserUpload || recipe.inMyBox,
  );
  const myBoxCount = myBoxRecipes.length;
  const resetToken = new URLSearchParams(window.location.search).get("token");

  if (window.location.pathname === "/reset-password") {
    return (
      <PasswordResetView
        theme={theme}
        token={resetToken || ""}
        onBackToLogin={() => {
          window.history.replaceState({}, "", HOME_PATH);
          setActiveTab("search");
          setIsLoginOpen(true);
        }}
      />
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-150 ${
        theme === "dark"
          ? "bg-[#2f2a24] text-[#f7f1e7]"
          : "bg-[#f7f1e7] text-[#332c24]"
      }`}
    >
      <Analytics />
      <SpeedInsights />
      {/* Navigation Sidebar & Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        myBoxCount={myBoxCount}
        theme={theme}
        toggleTheme={toggleTheme}
        isLoggedIn={isLoggedIn}
        userHandle={userHandle}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* Main Content Area (Offset by desktop sidebar md:ml-64) */}
      <main className="app-main flex min-w-0 flex-1 flex-col">
        <div className="flex-1">
          {activeTab === "my-box" && (
            <CardBoxView
              recipes={myBoxRecipes}
              theme={theme}
              onSelectRecipe={openRecipe}
              onToggleMyBox={handleToggleMyBox}
              onNavigateToSearch={() => handleTabChange("search")}
              onNavigateToUpload={() => handleTabChange("upload")}
            />
          )}

          {activeTab === "upload" && (
            <UploadView
              theme={theme}
              onSaveRecipe={handleSaveRecipe}
              authToken={authToken}
            />
          )}

          {activeTab === "search" && (
            <SearchView
              recipes={recipes}
              theme={theme}
              onSelectRecipe={openRecipe}
              onToggleMyBox={handleToggleMyBox}
            />
          )}
        </div>

        {/* Footer */}
        <Footer theme={theme} />
      </main>

      {/* Recipe Details 3x5 Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          theme={theme}
          onClose={closeRecipe}
          onToggleMyBox={handleToggleMyBox}
          onDeleteRecipe={isLoggedIn ? handleDeleteRecipe : undefined}
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
          onRequestPasswordReset={requestPasswordReset}
          onDeleteAccount={handleDeleteAccount}
          onUpdateAccount={handleUpdateAccount}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
