type TagInputProps = {
    value: string[];
    onChange: (tags: string[]) => void;
    maxVisible?: number; // default 6
  };
  // ======================================================
// FE || components/solutions/TagInput.tsx
// ======================================================

import { useState } from "react";

export function TagInput({
  value,
  onChange,
  maxVisible = 6,
}: TagInputProps) {
  const [input, setInput] = useState("");

  function addTag(raw: string) {
    const tag = slugifyTag(raw);
    if (!tag) return;
    if (value.includes(tag)) return;

    onChange([...value, tag]);
    setInput("");
  }

  function removeTag(tag: string) {
    onChange(value.filter(t => t !== tag));
  }

  return (
    <div className="tag-input">

      {/* Pills */}
      <div className="tag-pills">
        {value.slice(0, maxVisible).map(tag => (
          <span key={tag} className="pill">
            {tag}
            <button onClick={() => removeTag(tag)}>×</button>
          </span>
        ))}

        {value.length > maxVisible && (
          <div className="pill-scroll">
            {value.slice(maxVisible).map(tag => (
              <span key={tag} className="pill muted">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <input
        type="text"
        placeholder="Aggiungi tag (es. camere sul mare)"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag(input);
          }
        }}
        onBlur={() => addTag(input)}
      />
    </div>
  );
}
// ======================================================
// FE || utils/slugifyTag.ts
// ======================================================

export function slugifyTag(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .normalize("NFD")                 // rimuove accenti
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")     // solo lettere, numeri, spazio
      .replace(/\s+/g, "-")             // spazi → -
      .replace(/-+/g, "-")              // -- → -
      .replace(/^-|-$/g, "");           // trim -
  }
  