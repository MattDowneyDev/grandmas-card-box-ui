import { Recipe } from "../types";
import { titleCaseIfShouting } from "./textCase";

// Keep these in sync with the static fallbacks in index.html (used before
// this module ever runs, and by any crawler that doesn't execute JS).
export const SITE_NAME = "Grandma's Card Box";
export const SITE_URL = "https://grandmascardbox.com";
export const DEFAULT_DESCRIPTION =
  "Direct data access brutalist recipe box — no backstory, just data.";
export const DEFAULT_IMAGE = `${SITE_URL}/grandmascardboxhero.jpeg`;

interface HeadOptions {
  title: string;
  description?: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | null;
}

function setMetaTag(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLinkTag(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

const JSON_LD_ID = "structured-data";

// Updates the document head for client-side navigations. This covers
// browser-tab titles and anything a JS-executing crawler (Googlebot) picks
// up on a later render pass; it can't help crawlers that only read the raw
// HTML response (social-card unfurlers, some SEO bots) — the edge
// middleware (middleware.ts) covers that path for /recipes/:id specifically.
export function updateHead({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
  jsonLd = null,
}: HeadOptions) {
  const url = `${SITE_URL}${path}`;

  document.title = title;
  setMetaTag("name", "description", description);
  setLinkTag("canonical", url);

  setMetaTag("property", "og:site_name", SITE_NAME);
  setMetaTag("property", "og:type", type);
  setMetaTag("property", "og:title", title);
  setMetaTag("property", "og:description", description);
  setMetaTag("property", "og:image", image);
  setMetaTag("property", "og:url", url);

  setMetaTag("name", "twitter:card", "summary_large_image");
  setMetaTag("name", "twitter:title", title);
  setMetaTag("name", "twitter:description", description);
  setMetaTag("name", "twitter:image", image);

  let robotsTag = document.head.querySelector<HTMLMetaElement>(
    'meta[name="robots"]',
  );
  if (noindex) {
    if (!robotsTag) {
      robotsTag = document.createElement("meta");
      robotsTag.setAttribute("name", "robots");
      document.head.appendChild(robotsTag);
    }
    robotsTag.setAttribute("content", "noindex, nofollow");
  } else if (robotsTag) {
    robotsTag.remove();
  }

  let script = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null;
  if (jsonLd) {
    if (!script) {
      script = document.createElement("script");
      script.id = JSON_LD_ID;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);
  } else if (script) {
    script.remove();
  }
}

function toIsoDuration(minutes?: number): string | undefined {
  return minutes ? `PT${minutes}M` : undefined;
}

export function buildRecipeTitle(recipe: Recipe): string {
  return titleCaseIfShouting(recipe.title);
}

export function buildRecipeDescription(recipe: Recipe): string {
  const title = buildRecipeTitle(recipe);
  const ingredientPreview = recipe.ingredients.slice(0, 3).join(", ");
  const ellipsis = recipe.ingredients.length > 3 ? "…" : "";
  const time = recipe.totalTimeMin
    ? ` Ready in ${recipe.totalTimeMin} min.`
    : "";
  return `${title}: ${ingredientPreview}${ellipsis}.${time}`.trim();
}

export function buildRecipeJsonLd(recipe: Recipe): Record<string, unknown> {
  return {
    "@context": "https://schema.org/",
    "@type": "Recipe",
    name: buildRecipeTitle(recipe),
    image: [recipe.imageUrl || DEFAULT_IMAGE],
    description: buildRecipeDescription(recipe),
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.instructions.map((step) => ({
      "@type": "HowToStep",
      text: step,
    })),
    recipeYield: recipe.servings ? `${recipe.servings} servings` : undefined,
    recipeCategory: recipe.tag,
    prepTime: toIsoDuration(recipe.prepTimeMin),
    cookTime: toIsoDuration(recipe.cookTimeMin),
    totalTime: toIsoDuration(recipe.totalTimeMin),
  };
}
