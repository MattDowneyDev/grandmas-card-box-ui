import React, { useState } from "react";
import { AlertCircle, Camera, Check, Plus, Trash2 } from "lucide-react";
import { Recipe, ThemeMode } from "../types";

interface Props {
  theme: ThemeMode;
  onSaveRecipe: (
    recipe: Omit<Recipe, "id" | "createdAt" | "isUserUpload">,
  ) => void;
}
export const UploadView: React.FC<Props> = ({ theme, onSaveRecipe }) => {
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
  const addLine = (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    setter((lines) => [...lines, ""]);
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
  const submit = (event: React.FormEvent) => {
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
    const prepTime = Number(prep) || 0;
    const cookTime = Number(cook) || 0;
    const cleanTitle = title.trim().toUpperCase() || "UNTITLED RECIPE";
    onSaveRecipe({
      title: cleanTitle,
      tag: tag || "Uncategorized",
      servings: Number(servings) || 1,
      prepTimeMin: prepTime,
      cookTimeMin: cookTime,
      totalTimeMin: prepTime + cookTime,
      ingredients: ingredients.map((line) => line.trim()).filter(Boolean),
      instructions: instructions.map((line) => line.trim()).filter(Boolean),
      imageUrl: imageUrl || undefined,
      warningNote: warningNote.trim() || undefined,
      inMyBox: true,
    });
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
  const readImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageUrl(String(reader.result));
    reader.readAsDataURL(file);
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
      <form className="modern-form" onSubmit={submit} noValidate>
        <label className="field-wide">
          Recipe name
          <input
            required
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
              <option>Dinner</option>
              <option>Quick Fix</option>
              <option>Lunch</option>
              <option>Late Night</option>
              <option>Breakfast</option>
              <option>Staple</option>
            </select>
          </label>
          <label>
            Servings
            <input
              required
              type="number"
              min="1"
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
            <Camera /> {imageUrl ? "Change photo" : "Choose photo"}
            <input type="file" accept="image/*" onChange={readImage} />
          </label>
        </div>
        <label className="warning-input">
          <span>Optional note for cooks</span>
          <textarea
            value={warningNote}
            onChange={(event) => setWarningNote(event.target.value)}
            placeholder="A useful warning, substitution, or bit of hard-earned advice"
            rows={3}
          />
        </label>
        <button className="modern-button submit-button" type="submit">
          <Plus /> Save recipe
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
  return (
    <section className="line-editor">
      <div className="editor-heading">
        <h2>{label}</h2>
        <button type="button" onClick={() => add(setter)}>
          <Plus /> Add line
        </button>
      </div>
      {lines.map((line, index) => (
        <div className="editor-line" key={index}>
          <span>{index + 1}</span>
          <input
            required={index === 0}
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
