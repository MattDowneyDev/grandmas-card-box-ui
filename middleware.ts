import { next } from "@vercel/edge";
import { titleCaseIfShouting } from "./src/lib/textCase.ts";

// Vercel Edge Middleware, framework-agnostic (no Next.js needed) — runs
// before the SPA-fallback rewrite in vercel.json. This app is a pure
// client-rendered React SPA (no SSR), so a crawler that doesn't execute JS
// — social-card unfurlers (Slack, Twitter/X, Facebook, iMessage), and some
// SEO/search bots — would otherwise see the same generic index.html for
// every /recipes/:id URL, with no per-recipe title, image, or Recipe
// structured data. This intercepts just those requests, fetches the recipe
// from the API, and serves index.html with the right <title>/OG/JSON-LD
// injected. Everyone else (real browsers) passes straight through untouched.

const BOT_USER_AGENT = new RegExp(
  [
    "facebookexternalhit",
    "Facebot",
    "Twitterbot",
    "Slackbot",
    "LinkedInBot",
    "WhatsApp",
    "TelegramBot",
    "Discordbot",
    "Googlebot",
    "bingbot",
    "Applebot",
    "Pinterest",
    "redditbot",
    "SkypeUriPreview",
  ].join("|"),
  "i",
);

const API_BASE_URL =
  process.env.VITE_API_BASE_URL ||
  "https://zj1705nr6e.execute-api.us-east-1.amazonaws.com";

const SITE_NAME = "Grandma's Card Box";
const DEFAULT_IMAGE = "https://grandmascardbox.com/grandmascardboxhero.jpeg";

export const config = {
  matcher: "/recipes/:id*",
};

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
  servings: number;
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      (
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }) as Record<string, string>
      )[char],
  );
}

function toIsoDuration(minutes?: number): string | undefined {
  return minutes ? `PT${minutes}M` : undefined;
}

function buildDescription(recipe: ApiRecipe): string {
  const title = titleCaseIfShouting(recipe.title);
  const ingredientPreview = recipe.ingredients.slice(0, 3).join(", ");
  const ellipsis = recipe.ingredients.length > 3 ? "…" : "";
  const totalTime = recipe.totalTimeMin ?? recipe.cookTimeMin;
  const timeSuffix = totalTime ? ` Ready in ${totalTime} min.` : "";
  return `${title}: ${ingredientPreview}${ellipsis}.${timeSuffix}`.trim();
}

function buildJsonLd(recipe: ApiRecipe, description: string) {
  return {
    "@context": "https://schema.org/",
    "@type": "Recipe",
    name: titleCaseIfShouting(recipe.title),
    image: [recipe.imageUrl || DEFAULT_IMAGE],
    description,
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.instructions.map((step) => ({
      "@type": "HowToStep",
      text: step,
    })),
    recipeYield: recipe.servings ? `${recipe.servings} servings` : undefined,
    recipeCategory: recipe.tag,
    prepTime: toIsoDuration(recipe.prepTimeMin),
    cookTime: toIsoDuration(recipe.cookTimeMin),
    totalTime: toIsoDuration(recipe.totalTimeMin ?? recipe.cookTimeMin),
  };
}

export default async function middleware(request: Request) {
  const userAgent = request.headers.get("user-agent") || "";
  if (!BOT_USER_AGENT.test(userAgent)) {
    return next();
  }

  const url = new URL(request.url);
  const rawId = url.pathname.replace(/^\/recipes\//, "");
  const recipeId = rawId ? decodeURIComponent(rawId) : "";
  if (!recipeId) {
    return next();
  }

  try {
    const [recipeResponse, htmlResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/recipes/${encodeURIComponent(recipeId)}`),
      fetch(new URL("/index.html", url.origin)),
    ]);

    if (!recipeResponse.ok || !htmlResponse.ok) {
      return next();
    }

    const recipe: ApiRecipe = await recipeResponse.json();
    let html = await htmlResponse.text();

    const title = `${titleCaseIfShouting(recipe.title)} — ${SITE_NAME}`;
    const description = buildDescription(recipe);
    const image = recipe.imageUrl || DEFAULT_IMAGE;
    const pageUrl = `${url.origin}/recipes/${encodeURIComponent(recipe.id)}`;
    const jsonLd = buildJsonLd(recipe, description);

    const escapedTitle = escapeHtml(title);
    const escapedDescription = escapeHtml(description);

    const injectedHead = `
    <title>${escapedTitle}</title>
    <meta name="description" content="${escapedDescription}" />
    <link rel="canonical" href="${pageUrl}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapedTitle}" />
    <meta property="og:description" content="${escapedDescription}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:url" content="${pageUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapedTitle}" />
    <meta name="twitter:description" content="${escapedDescription}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  </head>`;

    // index.html ships its own static <title>/description/canonical/OG/
    // Twitter tags as a fallback for non-bot, non-JS contexts. Strip all of
    // them here so the per-recipe versions below are the only ones a
    // crawler sees — a duplicate og:title earlier in <head> would win over
    // ours for most parsers.
    html = html
      .replace(/<title>.*?<\/title>/s, "")
      .replace(/<meta name="description"[^>]*\/?>\n?/, "")
      .replace(/<link rel="canonical"[^>]*\/?>\n?/, "")
      .replace(/<meta property="og:[^"]*"[^>]*\/?>\n?/g, "")
      .replace(/<meta name="twitter:[^"]*"[^>]*\/?>\n?/g, "")
      .replace("</head>", injectedHead);

    return new Response(html, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  } catch {
    return next();
  }
}
