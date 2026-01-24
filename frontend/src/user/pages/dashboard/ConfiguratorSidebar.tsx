// ======================================================
// FE || pages/user/configurator/layout/ConfiguratorSidebar.tsx
// ======================================================
//
// CONFIGURATOR SIDEBAR (STEP-BASED)
//
// RUOLO:
// - Navigazione step configurazione
// - Stato controllato dal parent
//
// INVARIANTI:
// - Nessun routing
// - Nessun fetch
// ======================================================

const STEPS = [
  { id: "business", label: "Attività" },
  { id: "design", label: "Design" },
  { id: "content", label: "Contenuti" },
  { id: "extra", label: "Extra" },
  { id: "review", label: "Riepilogo" },
] as const;

export type StepId = typeof STEPS[number]["id"];

export default function ConfiguratorSidebar({
  active,
  onSelect,
}: {
  active: StepId;
  onSelect: (id: StepId) => void;
}) {
  return (
    <aside className="configurator-sidebar">
      <h3>Configurazione</h3>

      <ul>
        {STEPS.map((step) => (
          <li
            key={step.id}
            className={active === step.id ? "active" : ""}
            onClick={() => onSelect(step.id)}
          >
            {step.label}
          </li>
        ))}
      </ul>
    </aside>
  );
}
