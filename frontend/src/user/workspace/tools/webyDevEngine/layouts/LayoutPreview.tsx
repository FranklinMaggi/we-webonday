
// ======================================================
// AI-SUPERCOMMENT — LAYOUT PREVIEW (VENDITA)
// ======================================================
//
// RUOLO:
// - Visualizzare il layout che verrà ACQUISTATO
//
// INVARIANTI:
// - Read only
// - Nessuna mutazione
// - Nessuna logica di prezzo
// ======================================================

import type { LayoutKVDTO } from "../configurationLayout/layout.dto";

/* ======================================================
   LOCAL DTO — PREVIEW DATA
====================================================== */
type LayoutPreviewData = {
  businessName?: string;
  phone?: string;

  description?: string;
  services?: string;

  style?: string;
  colorPreset?: string;
};

type LayoutPreviewProps = {
  layout: LayoutKVDTO;
  data: LayoutPreviewData;
};

export function LayoutPreview({ layout, data }: LayoutPreviewProps) {
  const { structure, bindings, render } = layout;

  return (
    <div
      className={`layout-preview style-${data.style ?? "modern"} palette-${data.colorPreset ?? "light"}`}
      style={{
        filter: render.previewBlur ? "blur(2px)" : "none",
      }}
    >
      {/* NAVBAR */}
      {structure.navbar && (
        <div className="lp-navbar">
          {bindings.businessName && (
            <strong>{data.businessName || "Nome attività"}</strong>
          )}
        </div>
      )}

      {/* HERO */}
      {structure.hero && (
        <div className="lp-hero">
          {bindings.businessName && (
            <h1>{data.businessName || "Nome attività"}</h1>
          )}
          {bindings.services && (
            <p>{data.services || "I nostri servizi principali"}</p>
          )}
        </div>
      )}

      {/* SEZIONI */}
      <div className="lp-sections">
        {structure.sections.includes("about") && (
          <section>
            <h3>Chi siamo</h3>
            <p>{data.description || "Descrizione attività"}</p>
          </section>
        )}

        {structure.sections.includes("services") && (
          <section>
            <h3>Servizi</h3>
            <p>{data.services || "Elenco servizi"}</p>
          </section>
        )}

        {structure.sections.includes("contact") && (
          <section>
            <h3>Contatti</h3>
            {bindings.phone && <p>{data.phone || "Telefono"}</p>}
          </section>
        )}
      </div>

      {/* FOOTER */}
      {structure.footer && (
        <div className="lp-footer">
          © {new Date().getFullYear()}
        </div>
      )}
    </div>
  );
}
