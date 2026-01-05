/* ======================================================
   FE || Admin Product Edit Page — DEBUGGED & ALIGNED
======================================================

DEBUG OBIETTIVO:
- Allineare FE al nuovo dominio:
  AdminProductDTO → usa SOLO optionIds
- Rimuovere ogni logica legacy su product.options
- Rendere esplicito cosa succede e dove

DOMINIO:
- Prodotto ≠ Opzioni
- Le opzioni sono entità globali
- Qui si ASSEGNANO ID, non si editano contenuti

ENDPOINT USATI:
- GET  /api/admin/product/with-options
- GET  /api/admin/options/list
- POST /api/admin/product/options/update
- PUT  /api/products/register

====================================================== */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  updateAdminProduct,
} from "../../../lib/adminApi/products";

import { adminFetch } from "../../../lib/adminApi/client";
import { adminProductToBE } from "../../../lib/normalizers/adminProductToBe";

import type { AdminProductDTO } from "../../../dto/AdminProductDTO";

/* =========================
   TIPI LOCALI (DEBUG)
========================= */
type AdminOptionDTO = {
  id: string;
  name: string;
  price: number;
  status: "ACTIVE" | "ARCHIVED";
};

export default function AdminEditProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new";

  /* =========================
     STATE
  ========================= */
  const [product, setProduct] = useState<AdminProductDTO | null>(null);
  const [options, setOptions] = useState<AdminOptionDTO[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* =========================
     LOAD DATA
  ========================= */
  useEffect(() => {
    if (!id) return;
  
    if (isNew) {
      setProduct({
        id: "",
        name: "",
        description: "",
        status: "DRAFT",
        startupFee: 0,
        
        pricing: { yearly: 0, monthly: 0 },
        optionIds: [],
        
      });
      return;
    }
  
    Promise.all([
      adminFetch<{
        ok: true;
        product: AdminProductDTO;
      }>(`/api/admin/product/with-options?id=${id}`),
  
      adminFetch<{
        ok: true;
        options: {
          id: string;
          name: string;
          price: number;
          status: "ACTIVE" | "ARCHIVED";
        }[];
      }>(`/api/admin/options/list`),
    ])
      .then(([p, o]) => {
        setProduct(p.product);
        setOptions(o.options);
      })
      .catch(() => {
        setError("Errore caricamento prodotto");
      });
  }, [id, isNew]);
  
  /* =========================
     SAVE PRODUCT (NO OPTIONS)
  ========================= */
  async function saveProduct() {
    if (!product) return;

    try {
      setSaving(true);
      setError(null);

      const payload = adminProductToBE(product);
      await updateAdminProduct(payload);

      navigate("/admin/products");
    } catch (e: any) {
      setError(e?.message ?? "Errore salvataggio prodotto");
    } finally {
      setSaving(false);
    }
  }

  /* =========================
     SAVE OPTIONS (SEPARATO)
  ========================= */
  async function saveOptions() {
    if (!product) return;

    try {
      setSaving(true);
      setError(null);

      await adminFetch("/api/admin/product/options/update", {
        method: "POST",
        body: JSON.stringify({
          productId: product.id,
          optionIds: product.optionIds,
        }),
      });
    } catch {
      setError("Errore aggiornamento opzioni");
    } finally {
      setSaving(false);
    }
  }

  /* =========================
     GUARDS
  ========================= */
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!product) return <p>Caricamento…</p>;

  /* =========================
     RENDER
  ========================= */
  return (
    <section className="admin-page admin-product-edit">
      <header className="admin-header">
        <button onClick={() => navigate("/admin/products")}>
          ← Torna ai prodotti
        </button>
        <h1>{isNew ? "Nuovo prodotto" : "Modifica prodotto"}</h1>
      </header>

      {/* ================= INFO BASE ================= */}
      <div className="admin-card">
        <label>
          ID prodotto
          <input
            value={product.id}
            disabled={!isNew}
            onChange={(e) =>
              setProduct({
                ...product,
                id: e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9-]/g, ""),
              })
            }
          />
        </label>

        <label>
          Nome
          <input
            value={product.name}
            onChange={(e) =>
              setProduct({ ...product, name: e.target.value })
            }
          />
        </label>

        <label>
          Descrizione
          <textarea
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
          />
        </label>
      </div>

      {/* ================= PRICING ================= */}
      <div className="admin-card">
        <h3>Prezzi</h3>

        <input
          type="number"
          min={0}
          value={product.startupFee}
          onChange={(e) =>
            setProduct({
              ...product,
              startupFee: Number(e.target.value),
            })
          }
        />

        <input
          type="number"
          min={0}
          value={product.pricing.yearly}
          onChange={(e) =>
            setProduct({
              ...product,
              pricing: {
                ...product.pricing,
                yearly: Number(e.target.value),
              },
            })
          }
        /><input
          type="number"
          min={0}
          value={product.pricing.monthly}
          onChange={(e) =>
            setProduct({
              ...product,
              pricing: {
                ...product.pricing,
                monthly: Number(e.target.value),
              },
            })
          }
        />
      </div>
   
      {/* ================= OPTIONS (ASSIGN ONLY) ================= */}
      {!isNew && (
        <div className="admin-card">
          <h3>Opzioni prodotto</h3>

          {options.map((opt) => (
            <label key={opt.id} style={{ display: "block" }}>
              <input
                type="checkbox"
                disabled={opt.status === "ARCHIVED"}
                checked={product.optionIds.includes(opt.id)}
                onChange={(e) => {
                  setProduct({
                    ...product,
                    optionIds: e.target.checked
                      ? [...product.optionIds, opt.id]
                      : product.optionIds.filter((id) => id !== opt.id),
                  });
                }}
              />
              {opt.name} — €{opt.price}
            </label>
          ))}

          <button onClick={saveOptions} disabled={saving}>
            Salva opzioni
          </button>
        </div>
      )}<label>
      Stato prodotto
      <select
        value={product.status}
        onChange={(e) =>
          setProduct({
            ...product,
            status: e.target.value as any,
          })
        }
      >
        <option value="DRAFT">Bozza</option>
        <option value="ACTIVE">Attivo</option>
        <option value="ARCHIVED">Archiviato</option>
      </select>
    </label>
    

      {/* ================= ACTIONS ================= */}
      <footer className="admin-actions">
        <button onClick={saveProduct} disabled={saving || !product.id}>
          {saving ? "Salvataggio…" : "Salva prodotto"}
        </button>
      </footer>
    </section>
  );
}
