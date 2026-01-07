// ============================================================
// FE || ADMIN — SOLUTION EDITOR (ROUTE-BASED)
// File: frontend/src/pages/admin/solutions/[id].tsx
// ============================================================
//
// AI-SUPERCOMMENT
// ------------------------------------------------------------
// RUOLO:
// - Pagina di editing ADMIN per una singola Solution
// - Accesso via route dinamica: /admin/solutions/:id
//
// COSA FA:
// - Legge `id` dalla URL
// - Carica la Solution dal backend (GET)
// - Permette la modifica dei campi principali
// - Salva tramite UPSERT (PUT)
//
// COSA NON FA:
// - NON gestisce routing
// - NON valida busin

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAdminProducts } from "../../../lib/adminApi/admin.products.api";
import type { AdminProductDTO } from "../../../lib/dto/AdminProductDTO";

import {
  fetchAdminSolution,
  saveAdminSolution,
} from "../../../lib/adminApi/admin.solution.editor.api";

import type { SolutionEditorDTO } from "../../../lib/dto/solution";

/* ======================================================
   ADMIN — SOLUTION EDITOR (ROUTE-BASED)
====================================================== */

export default function SolutionEditor() {
  /* =========================
     ROUTE PARAM
  ========================= */
  const { id } = useParams<{ id: string }>();

  const [solution, setSolution] =
    useState<SolutionEditorDTO | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<AdminProductDTO[]>([]);

  /* =========================
     LOAD
  ========================= */
  useEffect(() => {
    if (!id) {
      setError("MISSING_SOLUTION_ID");
      setLoading(false);
      return;
    }

    fetchAdminSolution(id)
      .then((res) => {
        if (!res.ok) {
          setError(res.error);
        } else {
          setSolution(res.solution);
        }getAdminProducts()
        .then(setProducts)
        .catch(() => {
          // non blocca l’editor se fallisce
        });
      
      })
      .catch(() => {
        setError("FAILED_TO_LOAD_SOLUTION");
      })
      .finally(() => setLoading(false));
  }, [id]);

  /* =========================
     SAVE
  ========================= */
  async function onSave() {
    if (!solution) return;

    setSaving(true);
    setError(null);

    try {
      const res = await saveAdminSolution(solution);
      if (!res.ok) {
        setError("SAVE_FAILED");
      }
    } catch {
      setError("SAVE_FAILED");
    } finally {
      setSaving(false);
    }
  }

  /* =========================
     STATES
  ========================= */
  if (loading) return <p>Loading solution...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!solution) return null;

  /* =========================
     UI
  ========================= */
  return (
    <div>
      <h1>Admin — Solution Editor</h1>

      <label>
        Name
        <input
          value={solution.name}
          onChange={(e) =>
            setSolution({
              ...solution,
              name: e.target.value,
            })
          }
        />
      </label>

      <label>
        Description
        <textarea
          value={solution.description}
          onChange={(e) =>
            setSolution({
              ...solution,
              description: e.target.value,
            })
          }
        />
      </label>

      <label>
        Status
        <select
          value={solution.status}
          onChange={(e) =>
            setSolution({
              ...solution,
              status: e.target.value as SolutionEditorDTO["status"],
            })
          }
        >
          <option value="DRAFT">DRAFT</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="ARCHIVED">ARCHIVED</option>
        </select>
      </label>
            {/* =========================
    PRODUCTS (ASSIGN ONLY)
========================= */}
<div>
  <h3>Associated Products</h3>

  {products.length === 0 && (
    <p>Nessun prodotto disponibile.</p>
  )}

  {products.map((p) => {
    const checked = solution.productIds.includes(p.id);

    return (
      <label key={p.id} style={{ display: "block" }}>
        <input
          type="checkbox"
          disabled={p.status !== "ACTIVE"}
          checked={checked}
          onChange={(e) => {
            setSolution({
              ...solution,
              productIds: e.target.checked
                ? [...solution.productIds, p.id]
                : solution.productIds.filter(
                    (id) => id !== p.id
                  ),
            });
          }}
        />
        {p.name} ({p.status})
      </label>
    );
  })}
</div>

      <button onClick={onSave} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
