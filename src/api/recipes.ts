import { Recipe } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

interface ApiRecipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMin?: number;
  cookTimeMin: number;
  totalTimeMin?: number;
  tag: string;
  imageUrl?: string;
  warningNote?: string;
  createdAt: string;
  favoriteCount?: number;
  isUserUpload: boolean;
  isOwnRecipe?: boolean;
  inMyBox: boolean;
  servings: number;
  difficulty?: "trivial" | "medium" | "high";
}

function mapApiRecipe(recipe: ApiRecipe): Recipe {
  const prepTimeMin = recipe.prepTimeMin || 0;
  return {
    ...recipe,
    prepTimeMin,
    totalTimeMin: recipe.totalTimeMin ?? prepTimeMin + recipe.cookTimeMin,
  };
}

function authHeaders(token?: string): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getRecipes(token?: string): Promise<Recipe[]> {
  const response = await fetch(`${API_BASE_URL}/recipes`, {
    headers: authHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`Failed to load recipes (${response.status})`);
  }

  const recipes: ApiRecipe[] = await response.json();
  return recipes.map(mapApiRecipe);
}

export async function getRecipe(recipeId: string): Promise<Recipe> {
  const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`);

  if (!response.ok) {
    throw new Error(`Failed to load recipe (${response.status})`);
  }

  return mapApiRecipe(await response.json());
}

export async function createRecipe(
  recipe: Omit<Recipe, "id" | "createdAt" | "isUserUpload" | "inMyBox">,
  token?: string,
): Promise<Recipe> {
  const response = await fetch(`${API_BASE_URL}/recipes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(recipe),
  });

  if (!response.ok) {
    throw new Error(`Failed to create recipe (${response.status})`);
  }

  return mapApiRecipe(await response.json());
}

export async function deleteRecipe(recipeId: string, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete recipe (${response.status})`);
  }
}

export async function setRecipeFavorite(
  recipeId: string,
  inMyBox: boolean,
  token?: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/favorites/${recipeId}`, {
    method: inMyBox ? "POST" : "DELETE",
    headers: authHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`Failed to update recipe favorite (${response.status})`);
  }
}
