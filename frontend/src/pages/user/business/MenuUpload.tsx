// ======================================================
// FE || pages/user/business/MenuUpload.tsx
// ======================================================
// BUSINESS — MENU UPLOAD
//
// RUOLO:
// - Consentire al business di caricare il menu (PDF)
// - Attivare il business dopo upload riuscito
//
// RESPONSABILITÀ:
// - Gestione file input
// - Chiamata API upload menu
// - Aggiornamento stato business via callback
//
// NON FA:
// - NON valida il contenuto del PDF
// - NON gestisce permessi o ruoli
// - NON naviga
//
// NOTE:
// - Componente controllato dal padre (UserBusinessDashboard)
// - L’attivazione business è demandata al backend
// ======================================================

import { useState } from "react";
import { uploadBusinessMenu } from "../../../lib/businessApi";
import type { BusinessDTO } from "../../../lib/dto/businessDTO";

export default function MenuUpload({
  business,
  onUploaded,
}: {
  business: BusinessDTO;
  onUploaded: (b: BusinessDTO) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file) return;

    setLoading(true);
    try {
      const res = await uploadBusinessMenu(business.id, file);

      if (!res || !res.ok) return;

      onUploaded({
        ...business,
        menuPdfUrl: res.menuPdfUrl,
        status: "active",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="menu-upload">
      <h2>Carica il tuo menù (PDF)</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      {file && (
        <p>
          <strong>Selezionato:</strong> {file.name}
        </p>
      )}

      <button onClick={handleUpload} disabled={!file || loading}>
        {loading ? "Caricamento..." : "Carica e attiva"}
      </button>
    </div>
  );
}
