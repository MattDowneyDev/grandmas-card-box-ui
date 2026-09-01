// Runs before `vite build` (see package.json "prebuild") to regenerate
// public/sitemap.xml with every recipe's real URL, so Vite copies it into
// dist/ alongside the rest of the static assets. Falls back to a
// static-pages-only sitemap if the recipes API can't be reached, so a build
// never fails just because the API happened to be down.
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const SITE_URL = "https://grandmascardbox.com";
const API_BASE_URL =
  process.env.VITE_API_BASE_URL ||
  "https://zj1705nr6e.execute-api.us-east-1.amazonaws.com";

const STATIC_PATHS = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/privacy", changefreq: "yearly", priority: "0.2" },
];

function xmlEscape(value) {
  return value.replace(
    /[<>&'"]/g,
    (char) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[
        char
      ],
  );
}

function urlEntry(loc, { changefreq, priority, lastmod }) {
  return [
    "  <url>",
    `    <loc>${xmlEscape(loc)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    priority ? `    <priority>${priority}</priority>` : null,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

async function fetchRecipes() {
  // 100 is the API's MAX_PAGE_SIZE (see grandmas-card-box-api/src/routes/recipes.ts);
  // revisit with real pagination here if the catalog ever grows past that.
  const response = await fetch(`${API_BASE_URL}/recipes?limit=100`);
  if (!response.ok) {
    throw new Error(`Recipes API returned ${response.status}`);
  }
  return response.json();
}

async function main() {
  const entries = STATIC_PATHS.map((entry) =>
    urlEntry(`${SITE_URL}${entry.path}`, entry),
  );

  try {
    const recipes = await fetchRecipes();
    for (const recipe of recipes) {
      entries.push(
        urlEntry(`${SITE_URL}/recipes/${encodeURIComponent(recipe.id)}`, {
          changefreq: "monthly",
          priority: "0.7",
          lastmod: recipe.createdAt
            ? new Date(recipe.createdAt).toISOString().slice(0, 10)
            : undefined,
        }),
      );
    }
    console.log(`sitemap: included ${recipes.length} recipe URL(s)`);
  } catch (error) {
    console.warn(
      `sitemap: couldn't fetch recipes (${error.message}); writing static pages only`,
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;

  const outPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "public",
    "sitemap.xml",
  );
  await writeFile(outPath, xml, "utf8");
  console.log(`sitemap: wrote ${outPath}`);
}

main().catch((error) => {
  console.error("sitemap: generation failed", error);
  process.exitCode = 1;
});
