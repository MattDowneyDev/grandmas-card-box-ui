import React, { useState } from "react";
import { AlertCircle, Camera, Check, Plus, Trash2 } from "lucide-react";
import { Recipe, ThemeMode } from "../types";
import { RECIPE_CATEGORIES } from "../data/categories";
import { uploadRecipeImage } from "../api/uploads";

const MAX_LINES = 10;
const MAX_TITLE_LENGTH = 80;
const MAX_LINE_LENGTH = 120;
const MAX_WARNING_LENGTH = 200;
const MAX_SERVINGS = 99;
const MAX_MINUTES = 480;

interface Props {
  theme: ThemeMode;
  onSaveRecipe: (
    recipe: Omit<Recipe, "id" | "createdAt" | "isUserUpload">,
  ) => Promise<void>;
  authToken: string | null;
}
export const UploadView: React.FC<Props> = ({
  theme,
  onSaveRecipe,
  authToken,
}) => {
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [servings, setServings] = useState<number | "">("");
  const [prep, setPrep] = useState<number | "">("");
  const [cook, setCook] = useState<number | "">("");
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);
  const [imageUrl, setImageUrl] = useState("");
  const [warningNote, setWarningNote] = useState("");
  const [notice, setNotice] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const addLine = (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    setter((lines) =>
      lines.length >= MAX_LINES ? lines : [...lines, ""],
    );
  const updateLine = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string,
  ) =>
    setter((lines) =>
      lines.map((line, lineIndex) => (lineIndex === index ? value : line)),
    );
  const removeLine = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
  ) =>
    setter((lines) =>
      lines.length > 1
        ? lines.filter((_, lineIndex) => lineIndex !== index)
        : lines,
    );
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const missingField = !title.trim()
      ? "recipe name"
      : !tag
        ? "category"
        : !servings
          ? "servings"
          : !prep && prep !== 0
            ? "prep minutes"
            : !cook
              ? "cook minutes"
              : !ingredients.some((line) => line.trim())
                ? "at least one ingredient"
                : !instructions.some((line) => line.trim())
                  ? "at least one instruction"
                  : "";

    if (missingField) {
      setValidationMessage(
        `Please add ${missingField} before saving this recipe.`,
      );
      return;
    }

    setValidationMessage("");
    setErrorMessage("");
    const prepTime = Math.min(Number(prep) || 0, MAX_MINUTES);
    const cookTime = Math.min(Number(cook) || 0, MAX_MINUTES);
    const cleanTitle =
      title.trim().slice(0, MAX_TITLE_LENGTH).toUpperCase() ||
      "UNTITLED RECIPE";

    setIsSaving(true);
    try {
      await onSaveRecipe({
        title: cleanTitle,
        tag: tag || "Uncategorized",
        servings: Math.min(Number(servings) || 1, MAX_SERVINGS),
        prepTimeMin: prepTime,
        cookTimeMin: cookTime,
        totalTimeMin: prepTime + cookTime,
        ingredients: ingredients
          .slice(0, MAX_LINES)
          .map((line) => line.trim().slice(0, MAX_LINE_LENGTH))
          .filter(Boolean),
        instructions: instructions
          .slice(0, MAX_LINES)
          .map((line) => line.trim().slice(0, MAX_LINE_LENGTH))
          .filter(Boolean),
        imageUrl: imageUrl || undefined,
        warningNote:
          warningNote.trim().slice(0, MAX_WARNING_LENGTH) || undefined,
        inMyBox: true,
      });
    } catch (error) {
      console.error("Failed to save recipe", error);
      setErrorMessage(
        "We couldn't save that recipe. Please try again, or use a smaller photo.",
      );
      return;
    } finally {
      setIsSaving(false);
    }

    setNotice(`${cleanTitle} was added to your box.`);
    setTitle("");
    setTag("");
    setServings("");
    setPrep("");
    setCook("");
    setIngredients([""]);
    setInstructions([""]);
    setImageUrl("");
    setWarningNote("");
    setTimeout(() => setNotice(""), 3500);
  };
  const readImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setErrorMessage("");
    setIsUploadingImage(true);
    try {
      const publicUrl = await uploadRecipeImage(file, authToken || undefined);
      setImageUrl(publicUrl);
    } catch (error) {
      console.error("Failed to upload image", error);
      setErrorMessage("We couldn't upload that photo. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };
  return (
    <div className={`modern-page ${theme === "dark" ? "is-dark" : ""}`}>
      <section className="modern-section-intro">
        <div>
          <span className="eyebrow accent-eyebrow">Add to the collection</span>
          <h1>Share a recipe</h1>
          <p>Keep the story if you want. The useful bits come first.</p>
        </div>
      </section>
      {notice && (
        <div className="modern-notice">
          <Check /> {notice}
        </div>
      )}
      {validationMessage && (
        <div className="modern-notice modern-notice-error" role="alert">
          <AlertCircle /> {validationMessage}
        </div>
      )}
      {errorMessage && (
        <div className="modern-notice modern-notice-error" role="alert">
          <AlertCircle /> {errorMessage}
        </div>
      )}
      <form className="modern-form" onSubmit={submit} noValidate>
        <label className="field-wide">
          Recipe name
          <input
            required
            maxLength={MAX_TITLE_LENGTH}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Sunday morning pancakes"
          />
        </label>
        <div className="field-grid">
          <label>
            Category
            <select
              required
              value={tag}
              onChange={(event) => setTag(event.target.value)}
            >
              <option value="">Choose one</option>
              {RECIPE_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Servings
            <input
              required
              type="number"
              min="1"
              max={MAX_SERVINGS}
              value={servings}
              onChange={(event) =>
                setServings(
                  event.target.value ? Number(event.target.value) : "",
                )
              }
            />
          </label>
          <label>
            Prep minutes
            <input
              required
              type="number"
              min="0"
              max={MAX_MINUTES}
              value={prep}
              onChange={(event) =>
                setPrep(event.target.value ? Number(event.target.value) : "")
              }
            />
          </label>
          <label>
            Cook minutes
            <input
              required
              type="number"
              min="1"
              max={MAX_MINUTES}
              value={cook}
              onChange={(event) =>
                setCook(event.target.value ? Number(event.target.value) : "")
              }
            />
          </label>
        </div>
        <div className="form-columns">
          <LineEditor
            label="Ingredients"
            lines={ingredients}
            setter={setIngredients}
            update={updateLine}
            remove={removeLine}
            add={addLine}
            placeholder="1 cup flour"
          />
          <LineEditor
            label="Instructions"
            lines={instructions}
            setter={setInstructions}
            update={updateLine}
            remove={removeLine}
            add={addLine}
            placeholder="Mix everything together"
          />
        </div>
        <div className="photo-upload">
          {imageUrl ? (
            <img src={imageUrl} alt="Recipe preview" />
          ) : (
            <div>
              <Camera />
              <strong>Add a photo</strong>
              <span>A good photo makes a recipe easier to find later.</span>
            </div>
          )}
          <label className="modern-button secondary">
            <Camera />{" "}
            {isUploadingImage
              ? "Uploading..."
              : imageUrl
                ? "Change photo"
                : "Choose photo"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={readImage}
              disabled={isUploadingImage}
            />
          </label>
        </div>
        <label className="warning-input">
          <span>Optional note for cooks</span>
          <textarea
            maxLength={MAX_WARNING_LENGTH}
            value={warningNote}
            onChange={(event) => setWarningNote(event.target.value)}
            placeholder="A useful warning, substitution, or bit of hard-earned advice"
            rows={3}
          />
        </label>
        <button
          className="modern-button submit-button"
          type="submit"
          disabled={isSaving || isUploadingImage}
        >
          <Plus /> {isSaving ? "Saving..." : "Save recipe"}
        </button>
      </form>
    </div>
  );
};

function LineEditor({
  label,
  lines,
  setter,
  update,
  remove,
  add,
  placeholder,
}: {
  label: string;
  lines: string[];
  setter: React.Dispatch<React.SetStateAction<string[]>>;
  update: (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string,
  ) => void;
  remove: (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
  ) => void;
  add: (setter: React.Dispatch<React.SetStateAction<string[]>>) => void;
  placeholder: string;
}) {
  const atLineLimit = lines.length >= MAX_LINES;
  return (
    <section className="line-editor">
      <div className="editor-heading">
        <h2>
          {label}{" "}
          <span className="line-count">
            ({lines.length}/{MAX_LINES})
          </span>
        </h2>
        <button
          type="button"
          onClick={() => add(setter)}
          disabled={atLineLimit}
          title={atLineLimit ? `Limit of ${MAX_LINES} lines reached` : undefined}
        >
          <Plus /> Add line
        </button>
      </div>
      {lines.map((line, index) => (
        <div className="editor-line" key={index}>
          <span>{index + 1}</span>
          <input
            required={index === 0}
            maxLength={MAX_LINE_LENGTH}
            value={line}
            onChange={(event) => update(setter, index, event.target.value)}
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => remove(setter, index)}
            aria-label={`Remove ${label} line`}
          >
            <Trash2 />
          </button>
        </div>
      ))}
    </section>
  );
}
