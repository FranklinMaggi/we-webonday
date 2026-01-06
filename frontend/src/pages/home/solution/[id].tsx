// ============================================================
// FE || HOME — SOLUTION DETAIL (PUBLIC)
// File: src/pages/home/solution/[id].tsx
// ============================================================
//
// RUOLO:
// - Pagina narrativa di una Solution
// - Orienta l’utente alla scelta del prodotto
//
// FLUSSO:
// Home → Solution → Product → Checkout
//
// FA:
// - Carica Solution + Products associati
// - Racconta il caso d’uso
// - Mostra i prodotti disponibili
//
// NON FA:
// - NON gestisce carrello
// - NON gestisce pagamento
// - NON crea business
// ============================================================

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProducts } from "../../../lib/products/productsApi";

import { API_BASE } from "../../../lib/config";
import { initWhatsAppScrollWatcher } from "../../../lib/ui/scrollWatcher";
import type { ProductDTO } from "../../../dto/productDTO";
import ProductCard from "../../../components/catalog/ProductCard/ProductCard";
/* =========================
   TIPI PUBLIC
========================= */

type PublicSolutionDetail = {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  icon?: string;
  industries?: string[];
};



type SolutionDetailResponse =
  | {
      ok: true;
      solution: PublicSolutionDetail;
      products: ProductDTO[];
    }
  | {
      ok: false;
      error: string;
    };

export default function HomeSolutionPage() {
  const { id } = useParams<{ id: string }>();

  const [solution, setSolution] =
    useState<PublicSolutionDetail | null>(null);
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ===========================
     WHATSAPP VISIBILITY
  =========================== */
  useEffect(() => {
    const cleanup = initWhatsAppScrollWatcher();
    return cleanup;
  }, []);

  /* ===========================
     LOAD SOLUTION + PRODUCTS
  =========================== */
  useEffect(() => {
    if (!id) {
      setError("MISSING_SOLUTION_ID");
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/api/solution?id=${id}`)
      .then((res) => res.json())
      .then((data: SolutionDetailResponse) => {
        if (!data.ok) {
          setError(data.error);
          return;
        }

        setSolution(data.solution);
        (async () => {
          try {
            const full = await fetchProducts(); // prodotti completi con options[]
        
            const merged = (data.products || []).map((p) => {
              const hit = full.find((fp) => fp.id === p.id);
              return hit ?? p; // fallback safe: se non trovato, lasciamo il light
            });
        
            setProducts(merged);
            console.log("[SolutionPage] merged products", merged);
          } catch (e) {
            // fallback: se fallisce l’arricchimento, mostriamo comunque i prodotti light
            setProducts(data.products || []);
          }
        })();
      })
      .catch(() => setError("FAILED_TO_LOAD_SOLUTION"))
      .finally(() => setLoading(false));
  }, [id]);

  /* ===========================
     STATES
  =========================== */
  if (loading) return <p>Caricamento…</p>;
  if (error) return <p style={{ color: "red" }}>Errore: {error}</p>;
  if (!solution) return null;

  /* ===========================
     UI
  =========================== */
  return (
    <main className="solution-page">
      {/* ================= HERO ================= */}
      <section className="solution-hero">
        <h1>
          {solution.icon && <span>{solution.icon} </span>}
          {solution.name}
        </h1>

        <p>{solution.description}</p>
      </section>

      {/* ================= OVERVIEW ================= */}
      <section className="section">
        <h2>
          La soluzione pensata per il tuo business
        </h2>

        <p>
          WebOnDay ti fornisce una struttura pronta:
          landing page, e-commerce e strumenti di gestione
          progettati per convertire.
        </p>

        <p>
          Tu scegli il prodotto più adatto,
          al resto pensa il nostro <strong>AI Configurator</strong>.
        </p>
      </section>

      {/* ================= INDUSTRIES ================= */}
      {solution.industries && solution.industries.length > 0 && (
        <section className="section">
          <h3>Ideale per</h3>

          <div className="solution-industries">
            {solution.industries.map((industry) => (
              <span key={industry} className="badge">
                {industry}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ================= PRODUCTS ================= */}
 {/* ================= PRODUCTS ================= */}
{products.length > 0 && (
  <section className="section">
    <h3>Scegli il prodotto</h3>

    <div className="wd-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  </section>
)}


      {/* ================= CTA ================= 
      <section className="section cta">
        <Link
          to={`/home/preview/${solution.id}`}
          className="secondary-button"
        >
          Anteprima del sito
        </Link>
      </section>*/}
    </main>
  );
}
