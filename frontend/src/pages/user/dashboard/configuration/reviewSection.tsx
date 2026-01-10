// ======================================================
// FE || dashboard/configuration/ReviewSection.tsx
// ======================================================
//
// AI-SUPERCOMMENT — CONFIGURATION REVIEW
//
// RUOLO:
// - Visualizzare stato corrente configurazione
// - Nessun editing
//
// INVARIANTI:
// - Backend = source of truth
// - Nessuna mutazione
//
// NOTE:
// - Editing avviene nelle singole form
// ======================================================
import type { ConfigurationDTO } from "../../../../lib/apiModels/user/Configuration.api-model";


export default function ReviewSection({
    configuration,
  }: {
    configuration: ConfigurationDTO;
  }) {
    return (
      <section>
        <h2>Riepilogo configurazione</h2>
  
        <pre>
          {JSON.stringify(configuration, null, 2)}
        </pre>
      </section>
    );
  }
  