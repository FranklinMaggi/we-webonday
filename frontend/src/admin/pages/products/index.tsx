// ======================================================
// FE || pages/admin/products/index.tsx
// ======================================================
// ADMIN — PRODUCTS LIST
// ======================================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminProducts } from "../../adminApi/admin.products.api";
import type { AdminProductApiModel } from "../../../shared/lib/apiModels/admin/Product.api-model";
import { getWdStatusClass } from "@src/shared/utils/statusUi";
import { eur } from "../../../shared/utils/format";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProductApiModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOptionsFor, setShowOptionsFor] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);

        // 🔒 BACKEND = SOURCE OF TRUTH
        const products = await getAdminProducts();

        if (!cancelled) {
          setProducts(products);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e.message ?? "Errore caricamento prodotti");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p>Caricamento prodotti…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <section className="admin-page">
      <h1>Prodotti</h1>

      {products.length === 0 && <p>Nessun prodotto presente.</p>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Stato</th>
            <th>Startup</th>
            <th>Annuale</th>
            <th>Mensile</th>
            <th>Opzioni</th>
            <th>Azioni</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>

              <td>
                <strong>{p.name}</strong>
              </td>

              {/* STATO = SOURCE OF TRUTH */}
              <td>
              <span className={getWdStatusClass(p.status)}>
                  {p.status}
                </span>
              </td>

              <td>{eur.format(p.startupFee)}</td>
              <td>{eur.format(p.pricing.yearly)}</td>
              <td>{eur.format(p.pricing.monthly)}</td>
              <td>
  <button
    className="link-button"
    onClick={() => setShowOptionsFor(p.id)}
  >
    {p.optionIds.length} opzioni
  </button>
</td>

{showOptionsFor && (
  <div className="admin-drawer">
    <div className="admin-drawer__header">
      <h3>Opzioni prodotto: {showOptionsFor}</h3>
      <button onClick={() => setShowOptionsFor(null)}>✕</button>
    </div>

    <div className="admin-drawer__content">
      {/* QUI NON EDITI */}
      <p>
        Le opzioni sono entità globali.
        Puoi:
      </p>

      <ul>
        <li>✔️ visualizzare quelle disponibili</li>
        <li>✔️ crearne di nuove</li>
        <li>✏️ associarle dal dettaglio prodotto</li>
      </ul>

      <hr />

      <button
        onClick={() => navigate("/admin/options")}
      >
        Vai al catalogo opzioni
      </button>

      <button
        onClick={() => navigate(`/admin/products/${showOptionsFor}`)}
      >
        Modifica associazioni
      </button>
    </div>
  </div>
)}

              <td>
                <button
                  
                  onClick={() => navigate(p.id)}
                >
                  Modifica
                </button>

                <button disabled>Elimina</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <button
  onClick={() => {
    navigate("/admin/products/new");
  }}
>
  + Nuovo prodotto
</button>

    </section>
  );
}
