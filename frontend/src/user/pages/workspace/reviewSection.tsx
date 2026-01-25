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
import type { ConfigurationConfiguratorDTO } from "../../../configurator/base_configuration/configuration/ConfigurationConfiguratorDTO";


export default function ReviewSection({
    configuration,
  }: {
    configuration: ConfigurationConfiguratorDTO;
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
  