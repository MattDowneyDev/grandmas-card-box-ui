/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from "react";
import { Analytics, track } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Recipe, NavigationTab, ThemeMode } from "./types";
import {
  AuthSession,
  deleteAccount,
  getCurrentUser,
  login,
  requestPasswordReset,
  resendVerification,
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
import { VerifyEmailView } from "./components/VerifyEmailView";
import { Footer } from "./components/Footer";
import { FeedbackWidget } from "./components/FeedbackWidget";

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

// Recipes get their own shareable, analytics-visible route (/recipes/:id)
// instead of living only in component state.
const RECIPE_ROUTE_PREFIX = "/recipes/";

const getRecipeIdFromPath = (): string | null => {
  const { pathname } = window.location;
  if (!pathname.startsWith(RECIPE_ROUTE_PREFIX)) return null;
  const id = pathname.slice(RECIPE_ROUTE_PREFIX.length);
  return id ? decodeURIComponent(id) : null;
};

const getRecipePath = (recipeId: string) =>
  `${RECIPE_ROUTE_PREFIX}${encodeURIComponent(recipeId)}`;

export default function App() {
  // Recipes are always server-backed; loaded below once the component mounts.
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const [authToken, setAuthToken] = useState<string | null>(() =>
    localStorage.getItem("cardbox_token"),
  );

  useEffect(() => {
    if (!authToken) return;

    getCurrentUser(authToken)
      .then((user) => {
        setUserHandle(user.displayName);
        setIsLoggedIn(true);
        setIsEmailVerified(user.emailVerified);
        setUserEmail(user.email);
        localStorage.setItem("cardbox_user", user.displayName);
      })
      .catch((error) => {
        console.error("Failed to validate API session", error);
        setAuthToken(null);
        setIsLoggedIn(false);
        setUserEmail(null);
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
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Every place the login modal opens funnels through here so we know what
  // drove someone to it — a deliberate click vs. hitting a gated action.
  const openLogin = (reason: string) => {
    track("login_modal_open", { reason });
    setIsLoginOpen(true);
  };

  const handleTabChange = (tab: NavigationTab) => {
    const requiresLogin = tab === "my-box" || tab === "upload";
    if (requiresLogin && (!isLoggedIn || !authToken || !isEmailVerified)) {
      openLogin(tab === "my-box" ? "my_box_gate" : "upload_gate");
      return;
    }

    if (tab === "my-box" || tab === "upload") {
      window.history.pushState({}, "", ROUTE_PATHS[tab]);
    } else {
      window.history.pushState({}, "", HOME_PATH);
    }
    setActiveTab(tab);
  };

  useEffect(() => {
    const requiresLogin = activeTab === "my-box" || activeTab === "upload";
    if (requiresLogin && (!isLoggedIn || !authToken || !isEmailVerified)) {
      window.history.replaceState({}, "", HOME_PATH);
      setActiveTab("search");
      openLogin(activeTab === "my-box" ? "my_box_gate" : "upload_gate");
    }
  }, [activeTab, authToken, isLoggedIn, isEmailVerified]);

  // Currently inspected recipe for detail modal, tracked as a real route
  // (/recipes/:id) so it's shareable and shows up as its own pageview.
  // `viaDirectLink` distinguishes "landed here from an external link" (no
  // in-app history to go back to) from "opened by clicking a card in-app"
  // (where the back button should just pop the entry we pushed).
  const [recipeRoute, setRecipeRoute] = useState<{
    id: string;
    viaDirectLink: boolean;
  } | null>(() => {
    const id = getRecipeIdFromPath();
    return id ? { id, viaDirectLink: true } : null;
  });
  const recipeScrollPosition = useRef(0);

  const openRecipe = (recipe: Recipe) => {
    recipeScrollPosition.current = window.scrollY;
    window.history.pushState({}, "", getRecipePath(recipe.id));
    setRecipeRoute({ id: recipe.id, viaDirectLink: false });
  };

  const closeRecipe = () => {
    if (recipeRoute?.viaDirectLink) {
      // Nothing to go "back" to in-app — land on the recipe grid instead of
      // sending the visitor back out to wherever referred them here.
      window.history.replaceState({}, "", HOME_PATH);
      setRecipeRoute(null);
      setActiveTab("search");
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: recipeScrollPosition.current, behavior: "auto" });
      });
    } else {
      window.history.back();
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const id = getRecipeIdFromPath();
      setRecipeRoute((prev) => {
        const next = id ? { id, viaDirectLink: false } : null;
        if (prev && !next) {
          window.requestAnimationFrame(() => {
            window.scrollTo({
              top: recipeScrollPosition.current,
              behavior: "auto",
            });
          });
        }
        return next;
      });

      if (!id) {
        setActiveTab(getTabFromPath());
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const selectedRecipe = recipeRoute
    ? (recipes.find((recipe) => recipe.id === recipeRoute.id) ?? null)
    : null;

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
    if (!isLoggedIn || !authToken || !isEmailVerified) {
      openLogin("favorite_gate");
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
      })
      .catch((error) =>
        console.error("Failed to update recipe favorite", error),
      );
  };

  // Save newly donated recipe
  const handleSaveRecipe = async (
    newRecipeData: Omit<Recipe, "id" | "createdAt" | "isUserUpload">,
  ) => {
    if (!isLoggedIn || !authToken || !isEmailVerified) {
      openLogin("upload_gate");
      return;
    }
    const newRecipe = await createRecipe(newRecipeData, authToken || undefined);
    setRecipes((prev) => [newRecipe, ...prev]);
    handleTabChange("my-box");
  };

  // Delete user-created recipe
  const handleDeleteRecipe = (recipeId: string) => {
    if (!isLoggedIn || !authToken || !isEmailVerified) return;

    deleteRecipe(recipeId, authToken)
      .then(() => {
        setRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId));
        if (recipeRoute?.id === recipeId) {
          window.history.replaceState({}, "", HOME_PATH);
          setRecipeRoute(null);
        }
      })
      .catch((error) => console.error("Failed to delete recipe", error));
  };

  const handleLogin = async (session: AuthSession) => {
    setAuthToken(session.token);
    setUserHandle(session.displayName);
    setIsLoggedIn(true);
    setIsEmailVerified(session.emailVerified);
    setUserEmail(session.email);
    localStorage.setItem("cardbox_token", session.token);
    localStorage.setItem("cardbox_user", session.displayName);
    localStorage.setItem("cardbox_auth", "true");
  };

  const handleLogout = () => {
    setUserHandle("Guest chef");
    setIsLoggedIn(false);
    setIsEmailVerified(false);
    setUserEmail(null);
    setAuthToken(null);
    if (recipeRoute) {
      window.history.replaceState({}, "", HOME_PATH);
      setRecipeRoute(null);
    }
    localStorage.removeItem("cardbox_token");
    localStorage.removeItem("cardbox_auth");
  };

  const handleResendVerification = async () => {
    if (!authToken) return;
    await resendVerification(authToken);
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
    setUserEmail(user.email);
    localStorage.setItem("cardbox_user", user.displayName);
  };

  const myBoxRecipes = recipes.filter(
    (recipe) => recipe.isOwnRecipe || recipe.inMyBox,
  );
  const myBoxCount = myBoxRecipes.length;
  const queryToken = new URLSearchParams(window.location.search).get("token");

  if (window.location.pathname === "/reset-password") {
    return (
      <PasswordResetView
        theme={theme}
        token={queryToken || ""}
        onBackToLogin={() => {
          window.history.replaceState({}, "", HOME_PATH);
          setActiveTab("search");
          openLogin("password_reset_back");
        }}
      />
    );
  }

  if (window.location.pathname === "/verify-email") {
    return (
      <VerifyEmailView
        theme={theme}
        token={queryToken || ""}
        onBackToLogin={() => {
          window.history.replaceState({}, "", HOME_PATH);
          setActiveTab("search");
          openLogin("verify_email_back");
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
        onOpenLogin={() => openLogin("header_button")}
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
          isEmailVerified={isEmailVerified}
          onClose={() => setIsLoginOpen(false)}
          onLogin={handleLogin}
          onLoginWithPassword={login}
          onSignup={signup}
          onRequestPasswordReset={requestPasswordReset}
          onResendVerification={handleResendVerification}
          onDeleteAccount={handleDeleteAccount}
          onUpdateAccount={handleUpdateAccount}
          onLogout={handleLogout}
        />
      )}

      <FeedbackWidget
        theme={theme}
        authToken={authToken}
        userEmail={isLoggedIn ? userEmail : null}
      />
    </div>
  );
}
