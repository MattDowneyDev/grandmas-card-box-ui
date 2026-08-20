import React, { useState, useRef } from "react";
import { Recipe, ThemeMode } from "../types";
import {
  Camera,
  Sparkles,
  AlertTriangle,
  Check,
  Upload,
  Image as ImageIcon,
  X,
} from "lucide-react";

interface UploadViewProps {
  theme: ThemeMode;
  onSaveRecipe: (
    newRecipe: Omit<Recipe, "id" | "createdAt" | "isUserUpload">,
  ) => void;
  onViewRecipe: (recipe: Recipe) => void;
}

export const UploadView: React.FC<UploadViewProps> = ({
  theme,
  onSaveRecipe,
}) => {
  const isDark = theme === "dark";

  const [recipeName, setRecipeName] = useState("");
  const [ingredientsText, setIngredientsText] = useState(
    "1 lb beef\n2 carrots\nWater",
  );
  const [steps, setSteps] = useState<string[]>([
    "Chop everything.",
    "Boil water.",
    "Combine.",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [cookTime, setCookTime] = useState<number>(25);
  const [tag, setTag] = useState<string>("Dinner");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [warningNote, setWarningNote] = useState<string>(
    "WARNING: IF THIS TAKES MORE THAN 30 MINUTES, YOU ARE DOING IT WRONG.",
  );
  const [isStripperOpen, setIsStripperOpen] = useState(false);
  const [blogText, setBlogText] = useState("");
  const [isStripping, setIsStripping] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStepChange = (index: number, value: string) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Preset sample photo selector
  const samplePhotos = [
    {
      name: "Stew / Soup",
      url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Meat / Roast",
      url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Pasta",
      url: "https://images.unsplash.com/photo-1621996346565-e3d5d6281084?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Eggs / Quick",
      url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    },
  ];

  // Quick Backstory Stripper
  const handleStripBackstory = () => {
    if (!blogText.trim()) return;
    setIsStripping(true);

    setTimeout(() => {
      // Clean heuristic parser to strip story fluff
      const lines = blogText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      const parsedIngredients: string[] = [];
      const parsedInstructions: string[] = [];
      let detectedName = recipeName || "CLEANED RECIPE";

      for (const line of lines) {
        if (!detectedName && line.length < 50 && !line.includes(":")) {
          detectedName = line.toUpperCase();
        } else if (
          line.match(/^(\d+|\d\/\d|½|¼|¾|\-|\*|cup|tbsp|tsp|g|oz|lb|pinch)/i) ||
          line.toLowerCase().includes("salt") ||
          line.toLowerCase().includes("pepper") ||
          line.toLowerCase().includes("oil")
        ) {
          parsedIngredients.push(line.replace(/^[-*•]\s*/, ""));
        } else if (
          line.match(/^\d+[\.\)]/i) ||
          line.toLowerCase().startsWith("step") ||
          line.toLowerCase().startsWith("heat") ||
          line.toLowerCase().startsWith("mix") ||
          line.toLowerCase().startsWith("bake") ||
          line.toLowerCase().startsWith("boil") ||
          line.toLowerCase().startsWith("cook") ||
          line.toLowerCase().startsWith("chop")
        ) {
          parsedInstructions.push(line.replace(/^\d+[\.\)]\s*/, ""));
        }
      }

      if (detectedName) setRecipeName(detectedName.toUpperCase());
      if (parsedIngredients.length > 0)
        setIngredientsText(parsedIngredients.join("\n"));
      if (parsedInstructions.length > 0) {
        const newSteps = Array(10).fill("");
        parsedInstructions.slice(0, 10).forEach((st, idx) => {
          newSteps[idx] = st;
        });
        setSteps(newSteps);
      }

      setIsStripping(false);
      setIsStripperOpen(false);
      setNotification("BACKSTORY PURGED. RAW DATA EXTRACTED.");
      setTimeout(() => setNotification(null), 3000);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanTitle = recipeName.trim()
      ? recipeName.trim().toUpperCase()
      : "UNTITLED DATA";
    const cleanIngredients = ingredientsText
      .split("\n")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    const cleanInstructions = steps
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (cleanIngredients.length === 0) {
      alert("You must provide at least 1 ingredient.");
      return;
    }

    if (cleanInstructions.length === 0) {
      alert("You must provide at least 1 instruction step.");
      return;
    }

    onSaveRecipe({
      title: cleanTitle,
      ingredients: cleanIngredients,
      instructions: cleanInstructions,
      cookTimeMin: cookTime,
      tag: tag || "Dinner",
      imageUrl: imageUrl || undefined,
      warningNote: warningNote.trim() || undefined,
      inMyBox: true,
    });

    setNotification(`RECIPE "${cleanTitle}" FILED TO YOUR BOX.`);
    setTimeout(() => setNotification(null), 3500);

    // Reset form
    setRecipeName("");
    setIngredientsText("");
    setSteps(Array(10).fill(""));
    setImageUrl("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-8 flex flex-col items-center">
      {/* Header Section from Image 7 */}
      <div className="text-center mb-10 w-full max-w-2xl">
        <h1
          id="upload-main-title"
          className={`text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading uppercase pb-4 mb-3 border-b-2 ${
            isDark
              ? "text-[#3b82f6] border-[#1e3a8a]"
              : "text-[#001255] border-[#001255]"
          }`}
        >
          DONATE TO THE BOX.
        </h1>
        <p
          className={`text-sm md:text-base font-mono ${
            isDark ? "text-[#9ca3af]" : "text-[#5f5e5a]"
          }`}
        >
          Keep it brief. We don't care how your cat feels about this dish.
        </p>

        {/* Quick Backstory Purger trigger */}
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setIsStripperOpen(!isStripperOpen)}
            className={`text-xs font-mono px-3 py-1.5 border transition-none flex items-center gap-1.5 ${
              isDark
                ? "border-[#1e3a8a] text-[#93c5fd] hover:bg-[#111827]"
                : "border-[#001255] text-[#001255] hover:bg-[#e5e2dc]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isStripperOpen
                ? "CLOSE STRIPPER TOOL"
                : "PASTE FOOD BLOG -> PURGE BACKSTORY"}
            </span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="mb-6 w-full max-w-3xl p-3 bg-[#001255] text-white font-mono text-xs flex items-center gap-2 brutalist-shadow">
          <Check className="w-4 h-4 text-green-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Backstory Stripper Modal/Panel */}
      {isStripperOpen && (
        <div
          className={`w-full max-w-3xl mb-8 p-6 border-2 ${
            isDark
              ? "bg-[#0b132b] border-[#3b82f6] text-white"
              : "bg-white border-[#001255] text-[#001255]"
          } brutalist-shadow`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold font-mono text-xs uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              FLUFF PURGER — ZERO BACKSTORY PARSER
            </h3>
            <button
              onClick={() => setIsStripperOpen(false)}
              className="p-1 hover:bg-black/10 text-xs font-mono"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs font-mono opacity-80 mb-3">
            Paste any long-winded food blog essay or copied recipe page below.
            We will extract only the hard data.
          </p>
          <textarea
            rows={4}
            value={blogText}
            onChange={(e) => setBlogText(e.target.value)}
            placeholder="Paste 10 paragraphs of childhood memories and recipe text here..."
            className={`w-full p-3 font-mono text-xs border ${
              isDark
                ? "bg-[#030712] border-[#1e3a8a] text-white"
                : "bg-[#fcf9f8] border-[#001255]"
            }`}
          />
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              disabled={isStripping || !blogText.trim()}
              onClick={handleStripBackstory}
              className="px-4 py-2 bg-[#001255] text-white font-mono text-xs font-bold uppercase disabled:opacity-50"
            >
              {isStripping ? "PURGING..." : "EXTRACT DATA INTO FORM"}
            </button>
          </div>
        </div>
      )}

      {/* The Index Card Form matching Image 7 */}
      <form
        onSubmit={handleSubmit}
        id="recipe-donation-form"
        className={`w-full max-w-3xl border p-6 md:p-12 relative ${
          isDark
            ? "bg-[#050b14] border-[#1e3a8a] text-white"
            : "bg-[#fcf9f8] border-[#001255] text-[#1b1c1c] brutalist-shadow"
        }`}
      >
        {/* Recipe Name */}
        <div className="mb-8">
          <label
            htmlFor="recipeName"
            className={`block text-xs font-mono font-bold tracking-widest uppercase mb-2 ${
              isDark ? "text-[#60a5fa]" : "text-[#001255]"
            }`}
          >
            RECIPE NAME
          </label>
          <input
            id="recipeName"
            type="text"
            required
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            placeholder="e.g., BRUTALIST BEEF STEW"
            className={`w-full bg-transparent border-0 border-b py-2 px-0 text-xl md:text-2xl font-bold font-heading uppercase tracking-tight focus:ring-0 ${
              isDark
                ? "border-[#1e3a8a] brutalist-input-dark text-white placeholder-gray-600"
                : "border-[#001255] brutalist-input text-[#001255] placeholder-[#5f5e5a]/50"
            }`}
          />
        </div>

        {/* Recipe Meta Options: Tag & Cook Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 font-mono text-xs">
          <div>
            <label
              className={`block font-bold uppercase tracking-wider mb-1 ${isDark ? "text-[#93c5fd]" : "text-[#001255]"}`}
            >
              CATEGORY / TAG
            </label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className={`w-full p-2 border font-mono text-xs uppercase ${
                isDark
                  ? "bg-[#030712] border-[#1e3a8a] text-white"
                  : "bg-white border-[#001255] text-[#001255]"
              }`}
            >
              <option value="Dinner">Dinner</option>
              <option value="Quick Fix">Quick Fix (&lt; 15 min)</option>
              <option value="Lunch">Lunch</option>
              <option value="Late Night">Late Night</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Staple">Staple</option>
            </select>
          </div>

          <div>
            <label
              className={`block font-bold uppercase tracking-wider mb-1 ${isDark ? "text-[#93c5fd]" : "text-[#001255]"}`}
            >
              COOK TIME (MINUTES)
            </label>
            <input
              type="number"
              min={1}
              max={480}
              value={cookTime}
              onChange={(e) => setCookTime(parseInt(e.target.value) || 15)}
              className={`w-full p-2 border font-mono text-xs ${
                isDark
                  ? "bg-[#030712] border-[#1e3a8a] text-white"
                  : "bg-white border-[#001255] text-[#001255]"
              }`}
            />
          </div>
        </div>

        {/* Horizontal Rule Divider */}
        <div
          className={`w-full h-px mb-8 opacity-30 ${
            isDark ? "bg-[#3b82f6]" : "bg-[#001255]"
          }`}
        />

        {/* Two-Column Grid: Ingredients & Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Ingredients Column */}
          <div>
            <div
              className={`flex justify-between items-end border-b pb-2 mb-4 ${
                isDark ? "border-[#1e3a8a]" : "border-[#001255]"
              }`}
            >
              <label
                htmlFor="ingredients"
                className={`text-xs font-mono font-bold uppercase tracking-wider ${
                  isDark ? "text-[#60a5fa]" : "text-[#001255]"
                }`}
              >
                INGREDIENTS
              </label>
              <span
                className={`text-[11px] font-mono ${isDark ? "text-gray-400" : "text-[#5f5e5a]"}`}
              >
                One per line
              </span>
            </div>

            <textarea
              id="ingredients"
              rows={12}
              required
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              placeholder="1 lb beef&#10;2 carrots&#10;Water"
              className={`w-full bg-transparent border-none p-0 resize-none focus:ring-0 focus:outline-none font-mono text-sm leading-8 ${
                isDark
                  ? "ruled-line-dark text-[#dde1ff]"
                  : "ruled-line text-[#1b1c1c]"
              }`}
            />
          </div>

          {/* Steps Column (10 Numbered Lines) */}
          <div>
            <div
              className={`border-b pb-2 mb-4 ${
                isDark ? "border-[#1e3a8a]" : "border-[#001255]"
              }`}
            >
              <label
                className={`text-xs font-mono font-bold uppercase tracking-wider ${
                  isDark ? "text-[#60a5fa]" : "text-[#001255]"
                }`}
              >
                INSTRUCTIONS
              </label>
            </div>

            <ol className="space-y-3 font-mono text-sm">
              {steps.map((step, idx) => (
                <li
                  key={idx}
                  className={`flex items-baseline border-b pb-1 ${
                    isDark ? "border-[#1e3a8a]/40" : "border-[#001255]/30"
                  }`}
                >
                  <span
                    className={`font-bold mr-2 text-xs w-5 shrink-0 ${
                      isDark ? "text-[#60a5fa]" : "text-[#001255]"
                    }`}
                  >
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => handleStepChange(idx, e.target.value)}
                    placeholder={
                      idx === 0
                        ? "Chop everything."
                        : idx === 1
                          ? "Boil water."
                          : idx === 2
                            ? "Combine."
                            : ""
                    }
                    className={`w-full bg-transparent border-none p-0 focus:ring-0 focus:outline-none font-mono text-xs sm:text-sm ${
                      isDark
                        ? "text-white placeholder-gray-700"
                        : "text-[#1b1c1c] placeholder-gray-400"
                    }`}
                  />
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Photo Attachment Section */}
        <div className="mt-8 pt-6 border-t border-current/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <label
              className={`text-xs font-mono font-bold uppercase tracking-wider ${isDark ? "text-[#60a5fa]" : "text-[#001255]"}`}
            >
              PHOTO (OPTIONAL)
            </label>
            {imageUrl && (
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="text-[11px] font-mono text-red-600 hover:underline"
              >
                REMOVE PHOTO
              </button>
            )}
          </div>

          {imageUrl ? (
            <div className="relative w-full h-40 border border-current/30 overflow-hidden bg-black/10 mb-4">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 text-xs font-mono mb-2">
                <span className="opacity-70 text-[11px] self-center">
                  Presets:
                </span>
                {samplePhotos.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImageUrl(p.url)}
                    className={`px-2 py-1 border text-[11px] ${
                      isDark
                        ? "border-[#1e3a8a] hover:bg-[#1e3a8a]"
                        : "border-[#001255] hover:bg-[#e5e2dc]"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Horizontal Rule Divider */}
        <div
          className={`w-full h-px my-8 opacity-30 ${
            isDark ? "bg-[#3b82f6]" : "bg-[#001255]"
          }`}
        />

        {/* Actions Area matching Image 7 */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          {/* Image Upload Trigger */}
          <button
            type="button"
            id="btn-attach-photo"
            onClick={() => fileInputRef.current?.click()}
            className={`group flex items-center gap-2 border px-4 py-2 transition-none h-12 w-full sm:w-auto justify-center ${
              isDark
                ? "border-[#1e3a8a] text-[#93c5fd] hover:bg-[#1e3a8a] hover:text-white"
                : "border-[#001255] text-[#001255] hover:bg-[#001255] hover:text-white"
            }`}
          >
            <Camera className="w-4 h-4 shrink-0" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              {imageUrl ? "CHANGE PHOTO" : "ATTACH PHOTO"}
            </span>
          </button>

          {/* Submit */}
          <button
            type="submit"
            id="btn-file-recipe"
            className={`px-8 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-none h-12 w-full sm:w-auto ${
              isDark
                ? "bg-[#1e3a8a] text-white border border-[#3b82f6] hover:bg-[#2563eb] brutalist-shadow-blue brutalist-shadow-blue-interactive"
                : "bg-[#fcf9f8] text-[#001255] border border-[#001255] hover:bg-[#f0eded] brutalist-shadow brutalist-shadow-interactive"
            }`}
          >
            FILE RECIPE
          </button>
        </div>

        {/* Sarcastic Warning Callout matching Image 7 */}
        <div
          id="sarcastic-warning-callout"
          className={`mt-8 border-2 p-4 font-mono text-xs max-w-sm ml-auto text-right ${
            isDark
              ? "border-red-500/80 text-red-400 bg-red-950/20"
              : "border-[#ba1a1a] text-[#ba1a1a] bg-red-50/50"
          }`}
        >
          <div className="flex items-start justify-end gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <input
              type="text"
              value={warningNote}
              onChange={(e) => setWarningNote(e.target.value)}
              className="w-full bg-transparent border-0 p-0 text-right font-bold text-xs focus:ring-0"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
