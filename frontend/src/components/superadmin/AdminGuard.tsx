import { useEffect, useState } from "react";
import type {ReactNode} from "react";
import { API_BASE } from "../../lib/config";


export default function SuperAdminGuard({ children }: { children: ReactNode }) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("SUPERADMIN_TOKEN");

    if (!token) {
      setAllowed(false);
      return;
    }

    fetch(`${API_BASE}/api/admin/orders/list`, {
      headers: {
        "x-admin-token": token,
      },
    })
      .then((res) => setAllowed(res.ok))
      .catch(() => setAllowed(false));
  }, []);

  if (allowed === null) {
    return <p>Verifica accesso superadmin…</p>;
  }

  if (!allowed) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Accesso negato</h2>
        <p>Token superadmin mancante o non valido.</p>
        <p>
          Inseriscilo manualmente in console:
          <br />
          <code>
            localStorage.setItem("SUPERADMIN_TOKEN", "IL_TUO_TOKEN")
          </code>
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
