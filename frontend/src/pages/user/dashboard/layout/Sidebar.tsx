// ======================================================
// FE || dashboard/layout/Sidebar.tsx
// ======================================================

const SECTIONS = [
    { id: "business", label: "Attività" },
    { id: "design", label: "Design" },
    { id: "content", label: "Contenuti" },
    { id: "extra", label: "Extra" },
    { id: "review", label: "Riepilogo" },
  ] as const;
  
  export default function Sidebar({
    active,
    onSelect,
  }: {
    active: string;
    onSelect: (id: any) => void;
  }) {
    return (
      <aside className="configuration-sidebar">
        <h3>Configurazione</h3>
  
        <ul>
          {SECTIONS.map((s) => (
            <li
              key={s.id}
              className={active === s.id ? "active" : ""}
              onClick={() => onSelect(s.id)}
            >
              {s.label}
            </li>
          ))}
        </ul>
      </aside>
    );
  }
  