// Seed recipe titles are stored ALL CAPS (e.g. "SPAGHETTI WITH TOMATO
// SAUCE") to match the app's brutalist in-app styling, but that reads as
// shouting in a search result, a social share card, or JSON-LD. This
// converts an all-caps title to headline case for those contexts only —
// the in-app UI keeps rendering the raw title (RecipeModal even forces
// `uppercase` via CSS regardless of the underlying string).
//
// Only strings with zero lowercase letters are touched, so a user-submitted
// title typed in normal or intentional casing ("Mom's BBQ Ribs") is left
// exactly as written.
const LOWERCASE_SMALL_WORDS = new Set([
  "a", "an", "and", "as", "at", "but", "by", "for", "in",
  "nor", "of", "on", "or", "so", "the", "to", "up", "yet", "with",
]);

function capitalizeHyphenated(word: string): string {
  return word
    .split("-")
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join("-");
}

export function titleCaseIfShouting(text: string): string {
  if (!text || /[a-z]/.test(text)) return text;

  const words = text.toLowerCase().split(" ");
  return words
    .map((word, index) => {
      const isEdge = index === 0 || index === words.length - 1;
      if (!isEdge && LOWERCASE_SMALL_WORDS.has(word)) return word;
      return capitalizeHyphenated(word);
    })
    .join(" ");
}
