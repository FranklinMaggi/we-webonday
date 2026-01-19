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
import { fetchProducts } from "../../../domains/buyflow/api/publiApi/products/products.public.api";

import { API_BASE } from "../../../lib/config";
import { initWhatsAppScrollWatcher } from "../../../lib/ui/scrollWatcher";
import type { ProductVM } from "../../../lib/viewModels/product/Product.view-model";
import ProductCard from "../../user/dashboard/catalog/ProductCard/ProductCard";
/* =========================
   TIPI PUBLIC
========================= */

type PublicSolutionDetail = {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  image?: {
    hero: string;
    card: string;
    fallback:string; 
  };
  industries?: string[];
};



type SolutionDetailResponse =
  | {
      ok: true;
      solution: PublicSolutionDetail;
      products: ProductVM[];
    }
  | {
      ok: false;
      error: string;
    };

export default function HomeSolutionPage() {
  const { id } = useParams<{ id: string }>();

  const [solution, setSolution] =
    useState<PublicSolutionDetail | null>(null);
  const [products, setProducts] = useState<ProductVM[]>([]);
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
          
            setProducts(full);
            
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
  const heroImage = solution.image?.fallback;
  return (
    <main className="solution-page">
{/* ================= HERO ================= */}
      
        <section
                  className="solution-hero"
                  style={{
                    backgroundImage: heroImage
                      ? `url(${heroImage})`
                      : undefined,
                  }}
                >
            <div className="solution-hero-overlay">
            <h1>La nostra offerta per {solution.name}</h1>
            <p>{solution.description}</p>
          </div>
        </section>
{/* ================= SOLUTION EXPLANATION ================= */}
<section className="section solution-explanation">
  <h2>Cos’è la solution {solution.name}</h2>

  {solution.longDescription ? (
    <p className="solution-long-description">
      {solution.longDescription}
    </p>
  ) : (
    <p>
      La solution <strong>{solution.name}</strong> è un modello
      di sito WebOnDay progettato per rispondere a esigenze
      specifiche di un determinato tipo di attività.
      Fornisce una struttura già pensata, pronta per essere
      personalizzata e messa online rapidamente.
    </p>
  )}
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

       
      </section>
{/* ================= HOW IT WORKS ================= */}
<section className="section solution-how-it-works">
  <h2>Come funziona</h2>

  <ol className="solution-steps">
    <li>
      <strong> Scegli un prodotto</strong><br />
      Seleziona il prodotto più adatto alle tue esigenze
      in base al livello di personalizzazione e supporto.
    </li>

    <li>
      <strong>Configura le informazioni principali</strong><br />
      Dopo l’accesso, ti guideremo nella raccolta dei dati
      necessari per costruire il sito.
    </li>

    <li>
      <strong>Realizziamo il tuo sito</strong><br />
      Utilizziamo le informazioni fornite per creare
      la tua soluzione WebOnDay pronta all’uso.
    </li>
  </ol>
</section>

 {/* ================= PRODUCTS ================= */}
{products.length > 0 && (
  <section className="section">
    <h3>Scegli il prodotto</h3>

    <div className="wd-grid">
      {products.map((product) => (
        <ProductCard
        
          key={product.id}
          product={product}
          solutionId={solution.id}
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
