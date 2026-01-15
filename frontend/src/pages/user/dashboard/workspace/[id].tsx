// ======================================================
// FE || pages/user/dashboard/workspace/[id].tsx
// ======================================================
//
// AI-SUPERCOMMENT — CONFIGURATION WORKSPACE (POST-WIZARD)
//
// 🧭 MAPPA CONCETTUALE (CICLO DI VITA CONFIGURATION)
//
// ┌────────────────────────────────────────────┐
// │  CONFIGURATOR (WIZARD)                     │
// │  /user/configurator/:id                   │
// └──────────────┬─────────────────────────────┘
//                │
//                │  Salvataggio finale (draft)
//                ▼
// ┌────────────────────────────────────────────┐
// │  DASHBOARD WORKSPACE (QUESTO FILE)         │
// │  /user/dashboard/workspace/:id             │
// └────────────────────────────────────────────┘
//                │
//                ▼
//  Fetch Configuration (BE = source of truth)
//                │
//                ▼
//  Editing CONTINUO e NON guidato
//                │
//                ▼
//  Persistenza incrementale su backend
//
// ======================================================
////Il configurator è l’unica interfaccia
//che modifica una Configuration.

//La modalità (wizard / workspace)
//dipende esclusivamente dallo status backend.
// RUOLO:
// - Workspace persistente di una Configuration ESISTENTE
// - Modifica libera post-wizard (no step, no flusso guidato)
//
// SOURCE OF TRUTH:
// - Backend (ConfigurationDTO)
// - Stato locale FE SOLO per UI
//
// COSA FA:
// - Legge :id dalla URL
// - Fetcha /api/configuration/:id
// - Monta ConfigurationLayout (sidebar + sezioni)
//
// COSA NON FA (VINCOLANTE):
// - ❌ NON è un wizard
// - ❌ NON inizializza Zustand setup
// - ❌ NON dipende dal carrello
// - ❌ NON crea configuration
// - ❌ NON decide pricing o checkout
//
// DIFFERENZA CHIAVE vs CONFIGURATOR:
// - Configurator = onboarding guidato (wizard)
// - Workspace = editor persistente e continuo
//
// INVARIANTI CRITICI:
// 1. Accede SOLO a Configuration già esistenti
// 2. Ogni modifica è immediatamente persistita
// 3. Nessuna logica di navigazione a step
// 4. Nessun accoppiamento con /user/configurator
//
// COLLISIONI NOTE / FILE SOSPETTI:
// - ❌ pages/user/dashboard/[id].tsx (legacy catch-all)
// - ❌ qualsiasi reuse del wizard qui dentro
//
// STATO:
// - ATTIVO
// - POST-WIZARD
// - STRUTTURALMENTE SEPARATO DAL CONFIGURATOR
//
// ======================================================
// ======================================================
// FE || pages/user/dashboard/workspace/[id].tsx
// ======================================================
//
// CONFIGURATION WORKSPACE (POST-WIZARD)
//
// SOURCE OF TRUTH:
// - Backend → GET /api/configuration
// - FE filtra per :id
//
// ======================================================

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


import type { ConfigurationDTO } from "../../../../lib/apiModels/user/Configuration.api-model";

export default function UserConfigurationWorkspace() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [configuration, setConfiguration] =
    useState<ConfigurationDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
  
    setLoading(true);
  
    fetch(`/api/configuration/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => {
        if (!json?.ok || !json.configuration) {
          setConfiguration(null);
          return;
        }
  
        setConfiguration(json.configuration);
      })
      .finally(() => setLoading(false));
  }, [id]);
  
  /* =========================
     UI GUARDS
  ========================= */
  if (!id) return <p>ID configurazione mancante</p>;
  if (loading) return <p>Caricamento…</p>;

  if (!configuration) {
    return (
      <section>
        <p>Configurazione non trovata</p>
        <button onClick={() => navigate("/user/dashboard/workspace")}>
          Torna alle configurazioni
        </button>
      </section>
    );
  }

 
}
