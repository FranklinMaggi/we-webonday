// ============================================================
// FE || HOME — SOLUTION DETAIL (PUBLIC)
// File: src/pages/home/solution/[id].tsx
// ============================================================
//
// RUOLO:
// - Pagina narrativa di una Solution
// - Marketing + orientamento utente
//
// FLUSSO:
// - GET /api/solution?id=...
// - Racconta il caso d’uso
// - CTA → anteprima / prodotti
//
// NON FA:
// - NON carica prodotti
// - NON crea business
// - NON gestisce pagamento
// ============================================================

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { initWhatsAppScrollWatcher } from "../../../lib/ui/scrollWatcher";
import { API_BASE } from "../../../lib/config";

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
  | { ok: true; solution: PublicSolutionDetail }
  | { ok: false; error: string };

export default function HomeSolutionPage() {
  const { id } = useParams<{ id: string }>();

  const [solution, setSolution] = useState<PublicSolutionDetail | null>(null);
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
     LOAD SOLUTION
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
        } else {
          setSolution(data.solution);
        }
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
    <main>
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            {solution.icon && <span>{solution.icon} </span>}
            {solution.name}
          </h1>

          <p>{solution.description}</p>
        </div>

       
      </section>

      {/* ================= OVERVIEW ================= */}
      <section className="section">
        <h2>
          WebOnDay — la tua landing, il tuo e-commerce, la tua SaaS
        </h2>

        <p>
          Digital is better.  
          WebOnDay ti aiuta a creare il tuo sito web professionale
          a costi accessibili, senza complessità tecniche.
        </p>

        <p>
          Sfoglia le soluzioni, scegli il prodotto, acquista.
          Al resto pensa il nostro <strong>AI Configurator</strong>.
        </p>
      </section>

      {/* ================= INDUSTRIES ================= */}
      {solution.industries && (
        <section className="section">
          <h3>Ideale per</h3>

          <div className="solution-industries">
            {solution.industries.map((i) => (
              <span key={i} className="badge">
                {i}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ================= CTA ================= */}
      <section className="section cta">
        <Link
          to={`/home/preview/${solution.id}`}
          className="primary-button"
        >
          Anteprima del sito
        </Link>

        <Link
          to={`/home/solution/${solution.id}/products`}
          className="secondary-button"
        >
          Scopri i prodotti
        </Link>
      </section>
    </main>
  );
}
